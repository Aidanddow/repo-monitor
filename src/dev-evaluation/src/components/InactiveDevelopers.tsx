import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../App.css';
import { CommitData, Commits, Developer, GraphData, RepositoryPayload, Store } from '../types';
import { formatDate, getLastWeeksDate } from '../utils';
import ArchiveIcon from '@mui/icons-material/Archive';
import { Link } from "react-router-dom";
import * as actions from '../actions';

interface Props {

 
}

const Navbar: React.FC<Props> = props => {
  const inactiveDevelopers: Developer[] = useSelector((state: Store) => state.core.inactiveDevelopers);
  
  const [selecteddevelopers, setSelectedDevelopers] = useState<Developer[]>(inactiveDevelopers)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.fetchInactiveDevelopers.request());
  }, []);
  useEffect(() => {
    setSelectedDevelopers(inactiveDevelopers);
  }, [inactiveDevelopers]);
   



  return (
   <div>
    <h4 className='text-start'>Inactive Developers</h4>
    <p className='text-start pb-3'>Developers who has been inactive for more than a week</p>
<TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Username</TableCell>
            <TableCell>
            <TextField
          id='outlined-required'
          label='Find a developer'
          size="small"
          className='mt-3 w-100 text-nm'
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>setSelectedDevelopers([...inactiveDevelopers].filter(item=>item.username.replace(/\s/g,'').toLowerCase().includes(e.currentTarget.value.toLowerCase().replace(/\s/g,''))))}
        />
            </TableCell>
        
       
          </TableRow>
        </TableHead>
        <TableBody>
          {selecteddevelopers.map(dev=><TableRow
              key={1}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
             <Link to={"/developers/"+ dev.id}> {dev.username}</Link>
              </TableCell>
             
              <TableCell component="th" scope="row">
           
              </TableCell>
            </TableRow>)}  
        </TableBody>
      </Table>
    </TableContainer>
   </div>
  );
};

export default Navbar;
