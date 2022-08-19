import React, { useEffect, useState } from 'react';
import {
  Button,
  List,
  ListItem,
  ListItemText,
  TextField
} from '@mui/material';
import { Link, useLocation, useParams } from 'react-router-dom';
import { RepositoryPayload, Store } from '../types';
import AddModal from './AddModal';
import { useSelector } from 'react-redux';
interface Props {
  // repos: RepositoryPayload[];
  // setRepos:  React.Dispatch<React.SetStateAction<RepositoryPayload[]>>

}
const Sidebar: React.FC<Props> = props => {
  // let { repo } = useParams();
  // console.log("fr", useLocation().pathname.split('/').at(-2))
  const urlParam = useLocation().pathname.split('/').at(-2)
  const [selectedIndex, setSelectedIndex] = React.useState(urlParam?+urlParam:0);
  // console.log("repo", repo)
  const [open, setOpen] = React.useState(false);

  const repositories: RepositoryPayload[] = useSelector((state: Store) => state.core.repositories);
  const [sortedRepos, setRepos] = useState<RepositoryPayload[]>([]);


  useEffect(() => {
    const sorted = [...repositories].sort((a, b) => new Date(b.last_authored_date).getTime() - new Date(a.last_authored_date).getTime())
    setRepos(sorted)
  }, [repositories]);
 
  const renderRepos = sortedRepos.map((item, index)=> <ListItem
    onClick={() => setSelectedIndex(item.id)}
    selected={selectedIndex === item.id}
    component={Link}
    to={'/repositories/' + item.id + '/'}
    button
    key={item.id}
  >
    <ListItemText primary={item.repo_name} className='text-nm' />
  </ListItem>)


  return (
    <div className="sidebar">
      <div className='d-flex justify-content-center pt-5'>
      </div>
      <div className='d-flex justify-content-center text-center default-font py-3'>
      </div>
      <div className='d-flex justify-content-between  align-items-center'>
        <b className='text-nm'>
          Recent Repositories
        </b>
        <Button variant="contained" color="success" size="small" onClick={()=>setOpen(true)}>
  Add
</Button>
<AddModal open={open} setOpen={setOpen}/>
      </div>
      <TextField
          id='outlined-required'
          label='Find a Repository'
          size="small"
          className='mt-3 w-100 text-nm'
      onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>setRepos([...repositories].filter(item=>item.repo_name.replace(/\s/g,'').toLowerCase().includes(e.currentTarget.value.toLowerCase().replace(/\s/g,''))))}
        />
        <div>
          <List
            component='nav'
            aria-label='main mailbox folders'
            
          >
            
           {renderRepos}
          </List>
          
        </div>
      
    </div>
  );
};

export default Sidebar;
