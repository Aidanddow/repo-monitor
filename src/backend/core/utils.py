
import datetime
from git import Repo
from core.repo_utils import BasicRepoUtils
from core.models import Repository, Commit as CommitModel, Developer, Branch

class PerformFetch:
    '''
    Functions related to fetch.
    -> It will store commits in branch which is fetched
    -> It will store additional branches if any
    '''

    def get_repo(self, repo_requested):
        repository = Repository.objects.filter(repo_name=repo_requested)[0]
        return repository

    def fetch_repo(self, repo, repository):
        repo.remotes.origin.fetch('+refs/heads/*:refs/remotes/origin/*')
        self.save_new_branches(repo, repository)
        
        repository.set_last_authored_date(
            repo, Branch.objects.filter(repo__id=repository.id))

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
        print("REPO REQUESTED: ",repo_requested)
        repository = self.get_repo(repo_requested)
        repo = Repo(repository.get_file_path())
        self.fetch_repo(repo, repository)
        active_branch = Branch.objects.get(pk=branch_requested)
        commit_diff_string = self.get_commit_diff_string(active_branch, repo)
        self.save_commits(year_requested, repo,
                          commit_diff_string, active_branch, repository)
        active_branch.last_fetch_date = datetime.datetime.now()
        active_branch.save()

    def fetch_latest_branch(self, repo_requested, year_requested):
        repository = self.get_repo(repo_requested)
        repo = Repo(repository.get_file_path())
        self.fetch_repo(repo, repository)
        active_branch = BasicRepoUtils.get_latest_branch(
            repo, Branch.objects.filter(repo__id=repository.id))

        commit_diff_string = self.get_commit_diff_string(active_branch, repo)
        self.save_commits(year_requested, repo,
                          commit_diff_string, active_branch, repository)
        active_branch.last_fetch_date = datetime.datetime.now()
        active_branch.save()


    

# class RepositoryObject:

#     def __init__(self, repo_url):
#         self.url = repo_url
#         self.name = repo_url.split("/")[-1].split(".")[0]
#         self.save_folder = "repos/"
#         self.save_path = self.get_save_path()
        
#         self.clone_repo(request, self.url, self.save_path)
#         self.repo = None
#         self.repo_model = Repository(repo_name=self.name)
#         # self.clone_repo(request, repo_url, repo_save_path)
#         # repo = Repo(repo_save_path)

#     def get_save_path(self):
#         return os.path.join(self.save_folder, self.name)