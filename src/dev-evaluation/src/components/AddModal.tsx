import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { TextField } from '@mui/material';
import * as actions from '../actions';
import { useDispatch } from 'react-redux';
import { AddRepo } from '../types';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
interface Props{
    open: boolean;
    setOpen : React.Dispatch<React.SetStateAction<boolean>>
}

export default function BasicModal(props: Props) {
//   const [open, setOpen] = React.useState(false);
  const handleOpen = () => props.setOpen(true);
  const handleClose = () => props.setOpen(false);
  const dispatch = useDispatch();
  const [repoPath, setRepoPath] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleAddRepo = ()=>{
    const payload:  AddRepo = {
        username,
        password,
        repo_path: repoPath
    }
    dispatch(actions.addRepo.request(payload));

  }

  return (
    <div>
      <Modal
        open={props.open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add a Repository
          </Typography>
          <div>
          <TextField
          required
          className='w-100 my-1'
          id="outlined-required"
          label="Git Repository URL(HTTPS)"
          value={repoPath} 
          onChange={(event: React.ChangeEvent<HTMLInputElement>)=> setRepoPath(event.currentTarget.value)}
        />
        <TextField
          required
          className='w-100 my-1'
          id="outlined-required"
          label="Username"
          value={username} 
          onChange={(event: React.ChangeEvent<HTMLInputElement>)=> setUsername(event.currentTarget.value)}
        />
        <TextField
          required
          className='w-100 my-1'
          id="outlined-password"
          label="Password(access_token)"
          value={password} 
          onChange={(event: React.ChangeEvent<HTMLInputElement>)=> setPassword(event.currentTarget.value)}
        />
          </div>
          <Button variant="contained" color="primary" size="small" onClick={handleAddRepo}>
  Submit
</Button>
        </Box>
      
      </Modal>
      
    </div>
  );
}
