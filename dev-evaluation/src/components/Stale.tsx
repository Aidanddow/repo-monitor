import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../App.css';
import { CommitData, Commits, GraphData, RepositoryPayload, Store } from '../types';
import { formatDate, getLastWeeksDate } from '../utils';
import ArchiveIcon from '@mui/icons-material/Archive';
import * as actions from '../actions';

interface Props {

 
}

const Navbar: React.FC<Props> = props => {
  const repos: RepositoryPayload[] = useSelector((state: Store) => state.core.repositories);
  
  const staleRepos = repos.filter(repo=>!repo.archived && new Date(repo.last_authored_date).getTime()< getLastWeeksDate().getTime()).sort((a,b)=>new Date(b.last_authored_date).getTime()-new Date(a.last_authored_date).getTime())
  const dispatch = useDispatch();

const archive = (e: React.MouseEvent<HTMLButtonElement> | undefined)=>{
  if(e){
    dispatch(actions.archiveRepo.request({id: +e.currentTarget.id, archived: true}));
  }
  
}
   



  return (
   <div>
    <h4 className='text-start pb-3'>Stale Repositories</h4>
<TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Repository</TableCell>
        
            <TableCell align="right">Last Modified Date</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {staleRepos.map(repo=><TableRow
              key={1}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
              {repo.repo_name}
              </TableCell>
              <TableCell align="right">{formatDate(repo.last_authored_date, true)}</TableCell>
              <TableCell align="right"><Button variant='contained' size='small' id = {repo.id.toString()} onClick={archive}>
              <ArchiveIcon  /> Archive{' '}
           
          </Button></TableCell>
            </TableRow>)}  
        </TableBody>
      </Table>
    </TableContainer>
   </div>
  );
};

export default Navbar;
