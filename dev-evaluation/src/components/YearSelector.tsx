import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import { borderRadius } from '@mui/system';
import * as actions from '../actions';
import { useDispatch } from 'react-redux';

interface Props{
  selectedYear: number;
  setSelectedYear: React.Dispatch<React.SetStateAction<number>>
  activeBranch: number;

}
export default function SelectedListItem(props: Props) {
  const dispatch = useDispatch();
  

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ) => {
    props.setSelectedYear(index);
    dispatch(actions.fetchGraphData.request({branch: props.activeBranch, year: index}));

  };

  return (
    <Box sx={{ width: '12%', marginRight: '12%', bgcolor: 'background.paper', borderRadius: '3' }}>
      <List component="nav" aria-label="main mailbox folders">
        <ListItemButton
          className='year-button'
          selected={props.selectedYear === 2022}
          onClick={(event) => handleListItemClick(event, 2022)}
        >
          <ListItemText primary="2022" />
        </ListItemButton>
        <ListItemButton
          className='year-button'
          selected={props.selectedYear === 2021}
          onClick={(event) => handleListItemClick(event, 2021)}
        >
           <ListItemText primary="2021" />
        </ListItemButton>
        <ListItemButton
           className='year-button'
          selected={props.selectedYear === 2020}
          onClick={(event) => handleListItemClick(event, 2020)}
        >
          <ListItemText primary="2020" />
        </ListItemButton>
        <ListItemButton
         className='year-button'
          selected={props.selectedYear === 2019}
          onClick={(event) => handleListItemClick(event, 2019)}
        >
         <ListItemText primary="2019" />
        </ListItemButton>
      </List>
    </Box>
  );
}
