
class BasicRepoUtils:
    '''
    Class which provides basic repository utilities
    '''
    @staticmethod
    def sort_branches(repo, branches):
        return sorted((branch for branch in branches), 
                        key=lambda branch: repo.rev_parse(f'origin/{branch.branch_name}').authored_datetime, 
                        reverse=True)

    @staticmethod
    def get_latest_branch(repo, branches):
        return BasicRepoUtils.sort_branches(repo, branches)[0]