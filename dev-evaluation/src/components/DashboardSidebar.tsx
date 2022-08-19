import React, { useEffect } from 'react';
import { Button, List, ListItem, ListItemText, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import { Developer, RepositoryPayload, Store } from '../types';
import StorageIcon from '@mui/icons-material/Storage';
import GroupIcon from '@mui/icons-material/Group';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import ArchiveIcon from '@mui/icons-material/Archive';
import WarningIcon from '@mui/icons-material/Warning';
import { useDispatch, useSelector } from 'react-redux';
import DashboardIcon from '@mui/icons-material/Dashboard';

import * as actions from '../actions';
interface Props {
  //   repos: RepositoryPayload[];
}
const Sidebar: React.FC<Props> = (props) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const developers: Developer[] = useSelector(
    (state: Store) => state.core.developers
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.fetchDevelopers.request());
  }, []);

  const renderDevelopers = developers.map((item, index) => (
    <ListItem
      onClick={() => setSelectedIndex(index)}
      selected={selectedIndex === index}
      component={Link}
      to={'/developers/' + item.id + '/'}
      button
      key={item.id}
    >
      <ListItemText primary={item.username} className='text-nm' />
    </ListItem>
  ));

  return (
    <div className='sidebar pt-6'>
      <div>
        <List component='nav' aria-label='main mailbox folders'>
        <ListItem
            // onClick={() => setSelectedIndex(index)}
            // selected={selectedIndex === index}
            component={Link}
            to={'/'}
            button
            // key={item.id}
          >
            <DashboardIcon />
            <ListItemText primary='Dashboard' className='text-nm ms-2' />
          </ListItem>
          <ListItem
            // onClick={() => setSelectedIndex(index)}
            // selected={selectedIndex === index}
            component={Link}
            to={'/repositories/'}
            button
            // key={item.id}
          >
            <StorageIcon />
            <ListItemText primary='Repositories' className='text-nm ms-2' />
          </ListItem>
          <ListItem
            // onClick={() => setSelectedIndex(index)}
            // selected={selectedIndex === index}
            component={Link}
            to={'/analysis/stale/'}
            button
            // key={item.id}
          >
            <WarningIcon className='text-danger' />
            <ListItemText
              primary='Stale Repositories'
              className='text-nm ms-2 '
            />
          </ListItem>
          
          <ListItem
            // onClick={() => setSelectedIndex(index)}
            // selected={selectedIndex === index}
            component={Link}
            to={'/analysis/archived/'}
            button
            // key={item.id}
          >
            <ArchiveIcon />
            <ListItemText
              primary='Archived Repositories'
              className='text-nm ms-2'
            />
          </ListItem>
          <ListItem
            // onClick={() => setSelectedIndex(index)}
            // selected={selectedIndex === index}
            component={Link}
            to={'/developers/'}
            button
            // key={item.id}
          >
            <GroupIcon />
            <ListItemText primary='Developers' className='text-nm ms-2' />
          </ListItem>
         
          <ListItem
            // onClick={() => setSelectedIndex(index)}
            // selected={selectedIndex === index}
            component={Link}
            to={'/analysis/inactive-developers/'}
            button
            // key={item.id}
          >
            <GroupIcon className='text-danger' />
            <ListItemText
              primary='Inactive Developers'
              className='text-nm ms-2 '

            />
          </ListItem>
        </List>
      </div>
    </div>
  );
};

export default Sidebar;
