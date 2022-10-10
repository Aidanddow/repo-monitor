import datetime
import os
from rest_framework.response import Response
from rest_framework import viewsets
from core.models import Branch, Commit as CommitModel, Developer, Repository
from git import *
from core.serializers import BranchSerializer, DevCommitSerializer, CommitSerializer, DeveloperSerializer, RepositorySerializer, GraphSerializer
from rest_framework.views import APIView
from django.db.models import Count, Sum


'''
API when a repository is added.
 -> It will create the bare repository in the folder and will store repo details in the DB
 -> It will store all the branches in DB
 -> It will store commits in branches 'main'/ 'master'

'''


class AddRepositoryViewSet(viewsets.ViewSet):

    def get_url(self, repo_path):
        return repo_path.split("//")[-1]

    def get_commits_from_branch(self, repo, branch):
        end_date = branch.commit.authored_datetime.date()
        start_date = str(branch.commit.authored_datetime.year-1) + '-01-01'

        return list(repo.iter_commits(branch.remote_head, since=start_date, until=end_date))

    def process_commits(self, commits, branch, repository):
        for commit in commits:
            total_files = commit.stats.total['files']
            total_lines = commit.stats.total['lines']
            commit_id = commit.hexsha
            branch_id = Branch.objects.get_or_create(
                branch_name=branch.remote_head, repo=repository)[0]
            message = commit.message
            author = Developer.objects.get_or_create(username=commit.author)[0]
            repository.developers.add(author)
            date = commit.authored_datetime
            commit_modal = CommitModel(commit_hash=commit_id, repo=repository, branch=branch_id, date=date,
                                       author=author, message=message, total_files=total_files, total_lines=total_lines)
            commit_modal.save()

    def process_branches(self, repo, repository):

        current_branch = None
        for branch in repo.remote().refs:

            Branch.objects.create(
                branch_name=branch.remote_head, repo=repository)
            if branch.remote_head in ['main', 'master'] and current_branch is None:
                current_branch = branch
                current_branch.last_fetch_date = datetime.datetime.now()
        self.process_commits(self.get_commits_from_branch(
            repo, current_branch), current_branch, repository)
        self.set_start_date(repo, repository, current_branch)

    def set_start_date(self, repo, repository, initial_branch):
        repository.start_date = list(repo.iter_commits(
            initial_branch.remote_head))[-1].authored_datetime
        repository.save()

    def save_repo(self, repo_path, repo_name):
        repo_serializer = RepositorySerializer(
            data={"repo_path": repo_path, "repo_name": repo_name})
        repo_serializer.is_valid(raise_exception=True)
        repo_serializer.save()

    def get_repo_path(self, request):
        return request.data['repo_path']

    def fetch_repo(self, repo):
        repo.remotes.origin.fetch('+refs/heads/*:refs/remotes/origin/*')

    def get_repo_credenitals(self, request, repo_path):
        username = request.data['username']
        if len(username) > 0:
            repo_url = self.get_url(repo_path)
            password = request.data['password']
            repo_path_with_cred = f"https://{username}:{password}@{repo_url}"
        else:
            repo_path_with_cred = repo_path
        return repo_path_with_cred

    def clone_repo(self, request, repo_path, repo_name):
        if not os.path.isdir(repo_name):
            os.mkdir(repo_name)
            repo_path_with_cred = self.get_repo_credenitals(request, repo_path)
            Repo.clone_from(repo_path_with_cred, repo_name, bare=True)

    def create(self, request):
        repo_path = self.get_repo_path(request)
        repo_name = repo_path.split("/")[-1].split(".")[0]
        self.clone_repo(request, repo_path, repo_name)
        repo = Repo(repo_name)
        self.fetch_repo(repo)
        self.save_repo(repo_path, repo_name)
        repository = Repository.objects.filter(repo_name=repo_name)[0]
        self.process_branches(repo, repository)
        repo_ = BasicRepoUtils()
        repo_.set_last_authored_date(
            repo, repository, Branch.objects.filter(repo__id=repository.id))
        return Response({"success": "True"})


'''
Functions related to fetch.
 -> It will store commits in branch which is fetched
 -> It will store additional branches if any
'''


class PerformFetch:
    def get_repo(self, repo_requested):
        repository = Repository.objects.filter(repo_name=repo_requested)[0]
        return repository

    def fetch_repo(self, repo, repository):
        repo.remotes.origin.fetch('+refs/heads/*:refs/remotes/origin/*')
        self.save_new_branches(repo, repository)
        repo_ = BasicRepoUtils()
        repo_.set_last_authored_date(
            repo, repository, Branch.objects.filter(repo__id=repository.id))

    def get_commit_diff_string(self, active_branch, repo):
        commits_length = len(
            CommitModel.objects.filter(branch=active_branch.id))
        if(commits_length > 0):
            commit_diff_string = CommitModel.objects.filter(branch=active_branch.id).order_by('-date')[0].commit_hash + \
                '..' + repo.rev_parse('origin/' +
                                      active_branch.branch_name).hexsha
            return commit_diff_string
        commit_diff_string = 'origin/' + active_branch.branch_name
        return commit_diff_string

    def get_commits_list(self, year, repo, commit_diff_string):
        end_date = str(year) + '-12-31'
        start_date = str(year-1) + '-01-01'

        return list(repo.iter_commits(commit_diff_string, since=start_date, until=end_date))

    def save_commits(self, year_requested, repo, commit_diff_string, active_branch, repository):
        for commit in self.get_commits_list(year_requested, repo, commit_diff_string):
            total_files = commit.stats.total['files']
            total_lines = commit.stats.total['lines']
            commit_id = commit.hexsha
            branch_id = active_branch
            message = commit.message
            author = Developer.objects.get_or_create(username=commit.author)[0]
            date = commit.authored_datetime
            commit_modal = CommitModel(commit_hash=commit_id, repo=repository, branch=branch_id, date=date,
                                       author=author, message=message, total_files=total_files, total_lines=total_lines)
            commit_modal.save()

    def save_new_branches(self, repo, repository):
        for branch in repo.remote().refs:
            branch_exist = Branch.objects.filter(
                branch_name=branch.remote_head, repo=repository)
            if len(branch_exist) == 0:
                Branch.objects.create(
                    branch_name=branch.remote_head, repo=repository)

    def fetch_branch(self, repo_requested, branch_requested, year_requested):
        repo = Repo(repo_requested)
        repository = self.get_repo(repo_requested)
        self.fetch_repo(repo, repository)
        active_branch = Branch.objects.get(pk=branch_requested)
        commit_diff_string = self.get_commit_diff_string(active_branch, repo)
        self.save_commits(year_requested, repo,
                          commit_diff_string, active_branch, repository)
        active_branch.last_fetch_date = datetime.datetime.now()
        active_branch.save()

    def fetch_latest_branch(self, repo_requested, year_requested):
        repo = Repo(repo_requested)
        repository = self.get_repo(repo_requested)
        self.fetch_repo(repo, repository)
        repo_ = BasicRepoUtils()
        active_branch = repo_.get_latest_branch(
            repo, Branch.objects.filter(repo__id=repository.id))
        commit_diff_string = self.get_commit_diff_string(active_branch, repo)
        self.save_commits(year_requested, repo,
                          commit_diff_string, active_branch, repository)
        active_branch.last_fetch_date = datetime.datetime.now()
        active_branch.save()


'''
API which fetches the requested branch
'''


class FetchBranchViewSet(viewsets.ViewSet):

    def create(self, request):
        repo_requested = request.data['repo']
        branch_requested = request.data['branch']
        year_requested = request.data['year']
        PerformFetch().fetch_branch(repo_requested, branch_requested, year_requested)
        return Response({"success": "True"})


'''
API which fetches all repos
'''


class FetchRepositories(APIView):

    def get(self, request):
        for repo in Repository.objects.filter(archived=False):
            PerformFetch().fetch_latest_branch(repo.repo_name, datetime.datetime.now().year)
        return Response({"success": "True"})


'''
API which lists all branches of the repo requested
'''


class RepositoryDetailViewSet(viewsets.ViewSet):
    slug = 'repo_id'

    def partial_update(self, request, pk=None):
        repository = Repository.objects.get(pk=pk)
        repository.archived = request.data['archived']
        repository.save()
        serializer = RepositorySerializer(Repository.objects.all(), many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        repository = Repository.objects.get(id=pk)
        repo_name = Repository.objects.get(id=pk).repo_name
        repo = Repo(repo_name)
        branches = BasicRepoUtils().sort_branches(
            repo, Branch.objects.filter(repo__id=pk))
        PerformFetch().fetch_branch(
            repo_name, branches[0].id, datetime.datetime.now().year)

        repo_serializer = RepositorySerializer(repository)
        branch_serializer = BranchSerializer(branches, many=True)
        response_data = {
            "repository": repo_serializer.data,
            "branches": branch_serializer.data
        }
        return Response(response_data)


'''
Class which provides basic repository utilities
'''


class BasicRepoUtils:

    def sort_branches(self, repo, branches):
        return sorted((branch for branch in branches), key=lambda branch: repo.rev_parse('origin/' + branch.branch_name).authored_datetime, reverse=True)

    def get_latest_authored_date(self, repo_name):
        return Repository.objects.get(repo_name=repo_name).last_authored_date

    def set_last_authored_date(self, repo, repository, branches):
        repository.last_authored_date = repo.rev_parse(
            'origin/' + self.get_latest_branch(repo, branches).branch_name).authored_datetime
        repository.save()

    def get_latest_branch(self, repo, branches):
        return self.sort_branches(repo, branches)[0]


'''
API which lists all branches of the repo requested
'''


class BranchViewSet(viewsets.ViewSet):
    slug = 'repo_id'

    def retrieve(self, request, pk=None):
        repo_name = Repository.objects.get(id=pk).repo_name
        repo = Repo(repo_name)
        branches = BasicRepoUtils().sort_branches(
            repo, Branch.objects.filter(repo__id=pk))
        PerformFetch().fetch_branch(
            repo_name, branches[0].id, datetime.datetime.now().year)
        serializer = BranchSerializer(branches, many=True)
        return Response(serializer.data)


'''
API which lists all repos 
'''


class RepositoryListViewSet(viewsets.ViewSet):

    def list(self, request, pk=None):
        repos = Repository.objects.all()
        serializer = RepositorySerializer(repos, many=True)
        return Response(serializer.data)


'''
API which lists all developers
'''


class DeveloperListViewSet(viewsets.ViewSet):

    def list(self, request, pk=None):
        developer = Developer.objects.all()
        serializer = DeveloperSerializer(developer, many=True)
        return Response(serializer.data)


'''
API which returns the details of commits of a branch

'''


class CommitDetailView(APIView):

    def get(self, request, *args, **kwargs):

        commits = CommitModel.objects.filter(
            branch__id=kwargs.get('branch'), date__date=kwargs.get('date'))

        serializer = CommitSerializer(commits, many=True)
        return Response(serializer.data)


'''
API which returns the details of commits of a developer

'''


class DeveloperCommitDetailView(APIView):

    def get(self, request, *args, **kwargs):

        distinct_commit_hash = CommitModel.objects.filter(author__id=kwargs.get('author'), date__date=kwargs.get(
            'date')).values('commit_hash').distinct().values('commit_hash', 'repo', 'total_files', 'total_lines', 'author')
        serializer = DevCommitSerializer(distinct_commit_hash, many=True)
        return Response(serializer.data)


'''
API which returns the heatmap data of the developer and year requested

'''


class DeveloperGraphView(APIView):

    def get(self, request, *args, **kwargs):

        commits = CommitModel.objects.filter(
            author__id=kwargs.get('author'), date__year=kwargs.get('year'))
        data = commits.values('date__date').annotate(count=Count(
            'commit_hash', distinct=True)).values('date__date', 'count').order_by('date__date')
        for i in data:
            sum = (data.filter(date__date=i['date__date']).values('commit_hash').distinct().aggregate(sum=Sum(
                'total_files')))
            i['sum'] = sum['sum']

        serializer = GraphSerializer(data, many=True)
        return Response(serializer.data)


'''
API which returns top repos of given number

'''

class TopRepositories(APIView):

    def get(self, request, *args, **kwargs):
        last_specified_day = datetime.datetime.today(
        ).date()-datetime.timedelta(days=kwargs.get('days'))
        top_n = kwargs.get('top')

        repositories = Repository.objects.filter(
            last_authored_date__gt=last_specified_day, archived=False)
        repo_data = []
        for repo in repositories:
            latest_branch = BasicRepoUtils().get_latest_branch(
                Repo(repo.repo_name), Branch.objects.filter(repo=repo))
            commits = CommitModel.objects.filter(
                repo=repo, date__gt=last_specified_day, branch=latest_branch)
            data = commits.values('date__date').annotate(count=Count('id')).annotate(sum=Sum(
                'total_lines')).values('date__date', 'count',  'sum').order_by('date__date')
            commit_count = data.aggregate(commit_count=Sum('count'))

            lines_sum = data.aggregate(lines_sum=Sum('sum'))
            serializer = GraphSerializer(data, many=True)
            repo_data.append(
                {"repo": repo.repo_name, "commit_count": commit_count['commit_count'], 'lines_sum': lines_sum['lines_sum'], 'data': serializer.data})
        sorted_repos = sorted(
            repo_data, key=lambda x: x['commit_count'], reverse=True)
        return Response(sorted_repos[0:top_n])


'''
API which returns the heatmap data of the branch provided

'''


class GraphDatabyYear(APIView):

    def get(self, request, *args, **kwargs):
        branch = Branch.objects.get(id=kwargs.get('branch'))
        PerformFetch().fetch_branch(branch.repo, kwargs.get('branch'), kwargs.get('year'))
        commits = CommitModel.objects.filter(
            branch__id=kwargs.get('branch'), date__year=kwargs.get('year'))
        data = commits.values('date__date').annotate(count=Count('id')).annotate(sum=Sum(
            'total_files')).values('date__date', 'count',  'sum').order_by('date__date')
        serializer = GraphSerializer(data, many=True)
        return Response(serializer.data)


'''
API which returns the counts to render in dashboard

'''


class DashboardCount(APIView):

    def get(self, request, *args, **kwargs):
        last_week = datetime.datetime.today().date()-datetime.timedelta(weeks=1)
        archived_repositories = Repository.objects.filter(
            archived=True).count()
        repositories_count = Repository.objects.all().count()
        developers_count = Developer.objects.all().count()
        active_developers = CommitModel.objects.filter(
            date__gte=last_week).values_list('author', flat=True).distinct().count()
        inactive_developers = developers_count - active_developers
        stale_repositories_count = Repository.objects.filter(
            last_authored_date__lt=last_week, archived=False).count()
        return Response({"repositories_count": repositories_count, "stale_repositories_count": stale_repositories_count, "inactive_developers": inactive_developers, "developers_count": developers_count, "archived_repositories": archived_repositories})


'''
API which lists all inactive_developers

'''


class FetchInactiveDevelopers(APIView):

    def get(self, request, *args, **kwargs):
        last_week = datetime.datetime.today().date()-datetime.timedelta(weeks=1)
        developers = Developer.objects.all()
        active_developers = CommitModel.objects.filter(
            date__gte=last_week).values_list('author', flat=True).distinct()
        inactive_developers = developers.exclude(id__in=active_developers)
        serializer = DeveloperSerializer(inactive_developers, many=True)
        return Response(serializer.data)


'''
API which lists all the project_data of a developer

'''


class DeveloperDetailView(APIView):

    def get(self, request, *args, **kwargs):
        developer = Developer.objects.get(id=kwargs.get('developer'))
        projects = Repository.objects.filter(developers__in=[developer])
        projects_list = []

        for project in projects:
            repo = Repo(project.repo_name)
            date = CommitModel.objects.filter(
                author=developer, repo=project).order_by('-date')[0].date
            projects_list.append(
                {"project_name": project.repo_name, "latest_date": date})

        return Response(projects_list)
