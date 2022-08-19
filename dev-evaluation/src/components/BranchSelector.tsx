import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { Button, ListItemIcon } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Check } from '@mui/icons-material';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import { useSelector, useDispatch } from 'react-redux';
import { Store } from '../types';
import * as actions from '../actions';
import { useEffect } from 'react';

interface Props {
  setActiveBranch: React.Dispatch<React.SetStateAction<number>>
  setLastFetch: React.Dispatch<React.SetStateAction<string>>
}
export default function SimpleListMenu( props: Props) {
  const branches = useSelector((state: Store) => state.core.branches);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  // let { repo } = useParams();
  const dispatch = useDispatch();
  const open = Boolean(anchorEl);
  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
   
if(branches[selectedIndex]){
    dispatch(actions.fetchGraphData.request({branch: branches[selectedIndex].id, year: 2022}));}
  }, [selectedIndex, branches, dispatch]);

  useEffect(() => {
   if(branches&&branches[0]){
    props.setLastFetch(branches[0].last_fetch_date)
    setSelectedIndex(0)
   }
      }, [branches]);
  

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLElement>,
    index: number,
  ) => {
    props.setLastFetch(branches[index].last_fetch_date)

    setSelectedIndex(index);
    props.setActiveBranch(branches[index].id);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      {/* <List
        component="nav"
        aria-label="Device settings"
        sx={{ bgcolor: 'background.paper' }}
      >
        <ListItem
          button
          id="lock-button"
          aria-haspopup="listbox"
          aria-controls="lock-menu"
          aria-label="when device is locked"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClickListItem}
        >
          <ListItemText
            primary={options[selectedIndex]}
          />
        </ListItem>
      </List> */}
     {branches.length&& <Button
        id="demo-customized-button"
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="outlined"
        onClick={handleClickListItem}
        startIcon={<DeviceHubIcon />}
        endIcon={<KeyboardArrowDownIcon />}
      >
       {branches[selectedIndex].branch_name}
      </Button>}

      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'lock-button',
          role: 'listbox',
        }}
      >
        {branches.map((option, index) => (
          <MenuItem
            key={option.id}
            selected={index === selectedIndex}
            onClick={(event) => handleMenuItemClick(event, index)}
          >
        <ListItemIcon>
        {index === selectedIndex&&<Check />}
          </ListItemIcon>
            {option.branch_name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
