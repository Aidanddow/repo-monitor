
from django.db.models import Count, Sum

from core.repo_utils import BasicRepoUtils
from core.utils import  PerformFetch
from core.models import Branch, Commit as CommitModel, Developer, Repository
from core.serializers import BranchSerializer, DevCommitSerializer, CommitSerializer, DeveloperSerializer, RepositorySerializer, GraphSerializer

import datetime
import os
from git import Repo
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView


class AddRepositoryViewSet(viewsets.ViewSet):
    '''
    API when a repository is added.
    -> It will create the bare repository in the folder and will store repo details in the DB
    -> It will store all the branches in DB
    -> It will store commits in branches 'main'/ 'master'
    '''

    def create(self, request):
        repo_url = request.data['repo_url']
        repo_name = self.get_repo_name(repo_url)
        repo_save_path = os.path.join("repos", repo_name)
        self.clone_repo(request, repo_url, repo_save_path)
        repo = Repo(repo_save_path)
        self.fetch_repo(repo)
        self.save_repo_model(repo_url, repo_name)
        repo_model = Repository.objects.get(repo_name=repo_name)
        self.process_branches(repo, repo_model)
        repo_model.set_last_authored_date(repo, Branch.objects.filter(repo__id=repo_model.id))
        
        return Response({
            "success": "True"
        })

    def get_commits_from_branch(self, repo, branch):
        end_date = branch.commit.authored_datetime.date()
        start_date = str(branch.commit.authored_datetime.year-1) + '-01-01'

        return list(repo.iter_commits(branch.remote_head, since=start_date, until=end_date))

    def process_commits(self, commits, branch, repository):
        for commit in commits:
            
            branch_id, _ = Branch.objects.get_or_create(
                                branch_name=branch.remote_head, 
                                repo=repository )

            author, _ = Developer.objects.get_or_create(username=commit.author)
            repository.developers.add(author)
            
            commit_model = CommitModel({
                "repo" : repository, 
                "author" : author,  
                "branch" : branch_id, 
                "commit_hash" : commit.hexsha,
                "date" : commit.authored_datetime,
                "message" : commit.message.strip(), 
                "total_files" : commit.stats.total['files'],
                "total_lines" : commit.stats.total['lines'],
            })
        
    def process_branches(self, repo, repo_model):

        current_branch = None
        for branch in repo.remote().refs:
            Branch.objects.create(branch_name=branch.remote_head, repo=repo_model)

            if branch.remote_head in ['main', 'master'] and current_branch is None:
                current_branch = branch
                current_branch.last_fetch_date = datetime.datetime.now()

        commits = self.get_commits_from_branch(repo, current_branch)
        self.process_commits(commits, current_branch, repo_model)
        self.set_start_date(repo, repo_model, current_branch)

    def set_start_date(self, repo, repo_model, initial_branch):
        repo_model.start_date = list(repo.iter_commits(
            initial_branch.remote_head))[-1].authored_datetime
        repo_model.save()

    def save_repo_model(self, repo_url, repo_name):
        repo_serializer = RepositorySerializer(
            data = {
                "repo_url": repo_url, 
                "repo_name": repo_name
            }
        )
        repo_serializer.is_valid(raise_exception=True)
        repo_serializer.save()

    def fetch_repo(self, repo):
        repo.remotes.origin.fetch('+refs/heads/*:refs/remotes/origin/*')

    def get_repo_credenitals(self, request, repo_url):
        if username := request.data['username']:
            password = request.data['password']
            repo_url = self.get_url(repo_url)
            repo_url_with_cred = f"https://{username}:{password}@{repo_url}"
        else:
            repo_url_with_cred = repo_url
        return repo_url_with_cred

    def get_url(self):
        return self.repo_url.split("//")[-1]

    def clone_repo(self, request, repo_url, repo_save_path):
        repo_save_folder = os.path.dirname(repo_save_path)
        if not os.path.isdir(repo_save_folder):
            os.mkdir(repo_save_folder)
        repo_url_with_cred = self.get_repo_credenitals(request, repo_url)
        Repo.clone_from(repo_url_with_cred, to_path=repo_save_path, bare=True)

    def get_repo_name(self, url):
        return url.split("/")[-1].split(".")[0]


class FetchBranchViewSet(viewsets.ViewSet):
    '''
    API which fetches the requested branch
    '''

    def create(self, request):
        repo_requested = request.data['repo']
        branch_requested = request.data['branch']
        year_requested = request.data['year']
        PerformFetch().fetch_branch(repo_requested, branch_requested, year_requested)
        return Response({"success": "True"})



class FetchRepositories(APIView):
    '''
    API which fetches all repos
    '''

    def get(self, request):
        for repo in Repository.objects.filter(archived=False):
            PerformFetch().fetch_latest_branch(repo.repo_name, datetime.datetime.now().year)
        return Response({"success": "True"})



class RepositoryDetailViewSet(viewsets.ViewSet):
    '''
    API which lists all branches of the repo requested
    '''

    slug = 'repo_id'

    def partial_update(self, request, pk=None):
        repository = Repository.objects.get(pk=pk)
        repository.archived = request.data['archived']
        repository.save()
        serializer = RepositorySerializer(Repository.objects.all(), many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        repository = Repository.objects.get(id=pk)
        repo_name = repository.repo_name
        repo_file_path = repository.get_file_path()
        repo = Repo(repo_file_path)
        branches = BasicRepoUtils.sort_branches(
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



class BranchViewSet(viewsets.ViewSet):
    '''
    API which lists all branches of the repo requested
    '''

    slug = 'repo_id'

    def retrieve(self, request, pk=None):
        repo_name = Repository.objects.get(id=pk).repo_name
        repo_file_path = Repository.objects.get(id=pk).get_file_path()
        repo = Repo(repo_file_path)
        branches = BasicRepoUtils.sort_branches(
            repo, Branch.objects.filter(repo__id=pk))
        PerformFetch().fetch_branch(
            repo_name, branches[0].id, datetime.datetime.now().year)
        serializer = BranchSerializer(branches, many=True)
        return Response(serializer.data)



class RepositoryListViewSet(viewsets.ViewSet):
    '''
    API which lists all repos 
    '''
    
    def list(self, request, pk=None):
        repos = Repository.objects.all()
        serializer = RepositorySerializer(repos, many=True)
        return Response(serializer.data)



class DeveloperListViewSet(viewsets.ViewSet):
    '''
    API which lists all developers
    '''

    def list(self, request, pk=None):
        developer = Developer.objects.all()
        serializer = DeveloperSerializer(developer, many=True)
        return Response(serializer.data)



class CommitDetailView(APIView):
    '''
    API which returns the details of commits of a branch
    '''

    def get(self, request, *args, **kwargs):

        commits = CommitModel.objects.filter(
            branch__id=kwargs.get('branch'), date__date=kwargs.get('date'))

        serializer = CommitSerializer(commits, many=True)
        return Response(serializer.data)




class DeveloperCommitDetailView(APIView):
    '''
    API which returns the details of commits of a developer
    '''

    def get(self, request, *args, **kwargs):
        distinct_commit_hash = CommitModel.objects.filter(author__id=kwargs.get('author'), date__date=kwargs.get(
            'date')).values('commit_hash').distinct().values('commit_hash', 'message', 'repo', 'total_files', 'total_lines', 'author')
        serializer = DevCommitSerializer(distinct_commit_hash, many=True)
        return Response(serializer.data)




class DeveloperGraphView(APIView):
    '''
    API which returns the heatmap data of the developer and year requested
    '''

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



class TopRepositories(APIView):
    '''
    API which returns top repos of given number
    '''

    def get(self, request, *args, **kwargs):
        last_specified_day = datetime.datetime.today(
        ).date()-datetime.timedelta(days=kwargs.get('days'))
        top_n = kwargs.get('top')

        repositories = Repository.objects.filter(
            last_authored_date__gt=last_specified_day, archived=False)
        
        repo_data = []
        for repo in repositories:
            latest_branch = BasicRepoUtils.get_latest_branch(
                Repo(repo.repo_name), Branch.objects.filter(repo=repo))
            commits = CommitModel.objects.filter(
                repo=repo, date__gt=last_specified_day, branch=latest_branch)
            data = commits.values('date__date').annotate(count=Count('id')).annotate(sum=Sum(
                'total_lines')).values('date__date', 'count',  'sum').order_by('date__date')
            commit_count = data.aggregate(commit_count=Sum('count'))

            lines_sum = data.aggregate(lines_sum=Sum('sum'))
            serializer = GraphSerializer(data, many=True)
            repo_data.append(
                {
                    "repo": repo.repo_name, 
                    "commit_count": commit_count['commit_count'], 
                    'lines_sum': lines_sum['lines_sum'], 
                    'data': serializer.data
                })

        sorted_repos = sorted(
            repo_data, key=lambda x: x['commit_count'], reverse=True)
        return Response(sorted_repos[0:top_n])



class GraphDatabyYear(APIView):
    '''
    API which returns the heatmap data of the branch provided
    '''

    def get(self, request, *args, **kwargs):
        branch = Branch.objects.get(id=kwargs.get('branch'))
        PerformFetch().fetch_branch(branch.repo, kwargs.get('branch'), kwargs.get('year'))
        commits = CommitModel.objects.filter(
            branch__id=kwargs.get('branch'), date__year=kwargs.get('year'))
        data = commits.values('date__date').annotate(count=Count('id')).annotate(sum=Sum(
            'total_files')).values('date__date', 'count',  'sum').order_by('date__date')
        serializer = GraphSerializer(data, many=True)
        return Response(serializer.data)



class DashboardCount(APIView):
    '''
    API which returns the counts to render in dashboard
    '''

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



class FetchInactiveDevelopers(APIView):
    '''
    API which lists all inactive_developers
    '''

    def get(self, request, *args, **kwargs):
        last_week = datetime.datetime.today().date()-datetime.timedelta(weeks=1)
        developers = Developer.objects.all()
        active_developers = CommitModel.objects.filter(
            date__gte=last_week).values_list('author', flat=True).distinct()
        inactive_developers = developers.exclude(id__in=active_developers)
        serializer = DeveloperSerializer(inactive_developers, many=True)
        return Response(serializer.data)



class DeveloperDetailView(APIView):
    '''
    API which lists all the project_data of a developer
    '''

    def get(self, request, *args, **kwargs):
        developer = Developer.objects.get(id=kwargs.get('developer'))
        projects = Repository.objects.filter(developers__in=[developer])
        projects_list = []

        for project in projects:
            repo = Repo(project.get_file_path())
            date = CommitModel.objects.filter(
                author=developer, repo=project).order_by('-date')[0].date
            projects_list.append(
                {"project_name": project.repo_name, "latest_date": date})

        return Response(projects_list)
