import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import '../App.css';
import { CommitData, Commits, DevCommits, GraphData, RepositoryPayload, Store } from '../types';

interface Props {
  value: GraphData;
  commits: Commits[]
 
}

const Navbar: React.FC<Props> = props => {
  
  const repos: RepositoryPayload[] = useSelector((state: Store) => state.core.repositories);
  return (
   <div>
    {props.value.count} Commits on {props.value.date}
<div> 
<TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Commit Hash</TableCell>
            <TableCell align="right">Repository</TableCell>
            <TableCell align="right">No of files</TableCell>
            <TableCell align="right">No of lines</TableCell>
            <TableCell align="right">Author</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.commits.map((commit) => (
            <TableRow
              key={commit.commit_hash}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {commit.commit_hash.substring(0,8)}
              </TableCell>
              <TableCell align="right">{commit.repo.repo_name }</TableCell>
              <TableCell align="right">{commit.total_files}</TableCell>
              <TableCell align="right">{commit.total_lines}</TableCell>
              <TableCell align="right">{commit.author.username}</TableCell>
             
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer></div>
   </div>
  );
};

export default Navbar;
