export interface RepositoryPayload {
  id: number;
  repo_url: string;
  repo_name: string;
  developers: Developer[];
  last_authored_date: string;
  start_date:string;
  archived: boolean;
}
export interface CurrentRepositoryPayload {
  repository: RepositoryPayload;
  branches: BranchPayload[];
}
export interface BranchPayload {
  id: number;
  branch_name: string;
  repo: RepositoryPayload;
  last_fetch_date: string;
}
export interface Developer {
  id: number;
  username: string;
}
export interface ArchiveRepo {
  id: number;
  archived: boolean;
}

export interface AddRepo {
  repo_url: string;
  username: string;
  password: string;
}
export interface CommitData {
  id: number;
  branch: BranchPayload;
  repo: RepositoryPayload;
  author: Developer;
  commit_hash: string;
  date: string;
  total_files: number;
  total_lines: number;
  message: string;
}
export interface GraphData {
  count: number;
  sum: number;
  date__date: string;
  date: string;
}

export interface DashboardGraphData {
  commit_count: number;
  lines_sum: number;
  data: GraphData[];
  repo: string;

}
export interface TopRepoPayload {
  days: number;
  top: number;

}
export interface DashboardCount {
  repositories_count:number; 
  stale_repositories_count: number; 
  inactive_developers: number;
  developers_count: number;
  archived_repositories: number
}
export interface DevProject {
  project_name: string;
  latest_date: string;
}

export interface GraphDataRequest {
  branch: number;
  year: number;
}

export interface DeveloperGraphDataRequest {
  author: number;
  year: number;
}

export interface FetchRequest {
  branch: number;
  repo: string;
  year: number;
}

export interface FetchCommits {
  branch: number;
  date: string;
}
export interface FetchDevCommits {
  author: number;
  date: string;
}
export interface Commits {
    id: number,
    branch: BranchPayload;
    repo: RepositoryPayload ;
    author: Developer;
    commit_hash: string;
    date: string,
    total_files: number,
    total_lines: number
    message: string;
}

export interface DevCommits {
  id: number,
  branch: BranchPayload;
  repo: number ;
  author: Developer;
  commit_hash: string;
  date: string,
  total_files: number,
  total_lines: number
  message: string;
}

