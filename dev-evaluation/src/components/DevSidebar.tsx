import React, { useEffect, useState } from 'react';
import {
  Button,
  List,
  ListItem,
  ListItemText,
  TextField
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Developer, RepositoryPayload, Store } from '../types';
import AddModal from './AddModal';
import { useDispatch, useSelector } from 'react-redux';

import * as actions from '../actions';
interface Props {
//   repos: RepositoryPayload[];

}
const Sidebar: React.FC<Props> = props => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const developers: Developer[] = useSelector((state: Store) => state.core.developers);
  const [selecteddevelopers, setSelectedDevelopers] = useState<Developer[]>(developers)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.fetchDevelopers.request());
  }, []);
  useEffect(() => {
    setSelectedDevelopers(developers);
  }, [developers]);
  const renderDevelopers = selecteddevelopers.map((item, index)=> <ListItem
    onClick={() => setSelectedIndex(index)}
    selected={selectedIndex === index}
    component={Link}
    to={'/developers/' + item.id + '/'}
    button
    key={item.id}
  >
    <ListItemText primary={item.username} className='text-nm' />
  </ListItem>)


  return (
    <div className="sidebar">
      <div className='d-flex justify-content-center pt-5'>
      </div>
      <div className='d-flex justify-content-center text-center default-font py-3'>
      </div>
      <div className='d-flex justify-content-between  align-items-center'>
        <b className='text-nm'>
          Developers
        </b>
      </div>
      <TextField
          id='outlined-required'
          label='Find a developer'
          size="small"
          className='mt-3 w-100 text-nm'
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>setSelectedDevelopers([...developers].filter(item=>item.username.replace(/\s/g,'').toLowerCase().includes(e.currentTarget.value.toLowerCase().replace(/\s/g,''))))}
        />
        <div>
          <List
            component='nav'
            aria-label='main mailbox folders'
            
          >
            
           {renderDevelopers}
          </List>
          
        </div>
      
    </div>
  );
};

export default Sidebar;
