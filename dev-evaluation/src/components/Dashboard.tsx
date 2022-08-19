import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import {
  Backdrop,
  CardActionArea,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import GroupIcon from '@mui/icons-material/Group';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import DashboardSidebar from './DashboardSidebar';
import { Line, Pie } from 'react-chartjs-2';
import ArchiveIcon from '@mui/icons-material/Archive';
import WarningIcon from '@mui/icons-material/Warning';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { useDispatch, useSelector } from 'react-redux';
import { APIStatus, DashboardGraphData, GraphData, Store } from '../types';
import * as actions from '../actions';
import { hex2rgb, stringToColor } from './BackgroundLetterAvatars';

interface Props {}

const Navbar: React.FC<Props> = (props) => {
  const [days, setDays] = React.useState(7);
  const [showCount, setShowCount] = React.useState(2);
  const graphData = useSelector((state: Store) => state.core.topRepos);
  const dispatch = useDispatch();
  const dashboardCount = useSelector(
    (state: Store) => state.core.dashboardCount
  );
  const fetchLoader = useSelector(
    (state: Store) => state.core.loaders.fetchAllRepos
  );

 

  const handleChange = (event: SelectChangeEvent) => {
    setDays(+event.target.value);
    dispatch(
      actions.fetchTopRepo.request({
        days: +event.target.value,
        top: showCount,
      })
    );
  };
  const handleChangeShowCount = (event: SelectChangeEvent) => {
    setShowCount(+event.target.value);
    dispatch(
      actions.fetchTopRepo.request({
        days: days ,
        top: +event.target.value,
      })
    );
  };

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
  );
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
      },
    },
  };
  let flatArray: GraphData[] = []
  flatArray = flatArray.concat(...graphData.map(item=>item.data)).sort((a, b) => new Date(a.date__date).getTime() - new Date(b.date__date).getTime())
  const labels_unformatted = flatArray.map((item) => item.date__date)
// console.log("jbdclkjbdc", [...new Set(labels_unformatted)])
  const labels = [...Array.from(new Set(labels_unformatted))];
  // console.log(labels);
  const datasets = graphData.map((item) => {
    return {
      label: item.repo,
      // data: labels.map(label=>item.data.filter(entry=>entry.date__date===label)[0].count)
      data: labels.map((label) =>
        item.data.filter((entry) => entry.date__date === label).length
          ? item.data.filter((entry) => entry.date__date === label)[0].count
          : 0
      ),
      borderColor: stringToColor(item.repo),
      backgroundColor: hex2rgb(stringToColor(item.repo), '0.5'),
      borderWidth: 1.5,
    };
  });
  const data = {
    labels,
    datasets: datasets,
  };
  const piedata = {
    labels: graphData.map(item=>item.repo),
    datasets: [
      {
        label: '# of Votes',
        data: graphData.map(item=>item.commit_count*item.lines_sum),
        backgroundColor: graphData.map(item=>hex2rgb(stringToColor(item.repo), '0.5')),
        borderColor: graphData.map(item=>stringToColor(item.repo)),
        borderWidth: 1,
      },
    ],
  };
  return (
    <div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={fetchLoader===APIStatus.progress}
        // onClick={handleClose}
      >
        <div className='d-flex flex-column'>
        <div>Fetching ... </div>
        <div> <CircularProgress color="inherit" /></div>
        </div>
      </Backdrop>
      <div className='grid-3'>
        <Card>
          <CardActionArea component={Link} to={'/repositories/'}>
            <CardContent className='display-cards'>
              <Typography
                variant='body2'
                color='text.secondary'
                className='d-flex '
              >
                 Repositories
              </Typography>
              <div className='d-flex justify-content-between align-items-baseline'>
           
                  <Typography gutterBottom variant='h5' component='div'>
                  {dashboardCount.repositories_count}
                  </Typography>
               
                <div className='icon-circle text-danger'>
                  {' '}
                  <StorageIcon fontSize='small'/>
                </div>
              </div>
              <Typography
                variant='body2'
                color='text.secondary'
                className='d-flex mt-2 text-start text-sm'
              > All the Repositories under the Organisation
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
        <Card>
          <CardActionArea component={Link} to={'/analysis/stale/'}>
            <CardContent className='display-cards'>
              <Typography
                variant='body2'
                color='text.secondary'
                className='d-flex '
              >
                Stale Repositories
              </Typography>
              <div className='d-flex justify-content-between align-items-baseline'>
                  <Typography gutterBottom variant='h5' component='div'>
                    {dashboardCount.stale_repositories_count}
                  </Typography>
             
                <div className='icon-circle text-danger'>
                  {' '}
                  <WarningIcon fontSize='small'/>
                </div>
              </div>
              <Typography
                variant='body2'
                color='text.secondary'
                className='d-flex mt-2 text-start text-sm'
              >
                Repositories which haven't been used since a week.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>

        <Card>
          <CardActionArea component={Link} to={'/analysis/archived/'}>
            <CardContent className='display-cards'>
              <Typography
                variant='body2'
                color='text.secondary'
                className='d-flex '
              >
                Archived Repositories
              </Typography>
              <div className='d-flex justify-content-between align-items-baseline'>
                <div>
                  <Typography gutterBottom variant='h5' component='div'>
                  {dashboardCount.archived_repositories}
                  </Typography>
                </div>
                <div className='icon-circle'>
                  {' '}
                  <ArchiveIcon fontSize='small'/>
                </div>
              </div>
              <Typography
                variant='body2'
                color='text.secondary'
                className='d-flex mt-2 text-start text-sm'
              >
                Repositories which is no longer tracked.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </div>
      <div className='grid-bt-2'>
        <div />
        <Card>
          <CardActionArea component={Link} to={'/developers/'}>
            <CardContent className='display-cards'>
              <Typography
                variant='body2'
                color='text.secondary'
                className='d-flex '
              >
                Developers
              </Typography>
              <div className='d-flex justify-content-between align-items-baseline'>
                <div>
                  <Typography gutterBottom variant='h5' component='div'>
                    {dashboardCount.developers_count}
                  </Typography>
                </div>
                <div className='icon-circle'>
                  {' '}
                  <GroupIcon fontSize='small'/>
                </div>
              </div>
              <Typography
                variant='body2'
                color='text.secondary'
                className='d-flex mt-2 text-start text-sm'
              >
                All the Developers who have contributed
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>

        <Card>
          <CardActionArea component={Link} to={'/analysis/inactive-developers/'} >
            <CardContent className='display-cards'>
              <Typography
                variant='body2'
                color='text.secondary'
                className='d-flex'
              >
                Inactive Developers
              </Typography>
              <div className='d-flex justify-content-between align-items-baseline'>
                <div>
                  <Typography gutterBottom variant='h5' component='div'>
                    {dashboardCount.inactive_developers}
                  </Typography>
                </div>
                <div className='icon-circle text-danger'>
                  {' '}
                  <GroupIcon fontSize='small'/>
                </div>
              </div>
              <Typography
                variant='body2'
                color='text.secondary'
                className='d-flex mt-2 text-start text-sm'
              >
                Developers who haven't been active since a week
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </div>

      {/* <div className='grid-2'>
          <div>
            <Card>Most Active repository of past week</Card>
          </div>
          <div>
            <Card>Least Active repository of past week</Card>
          </div>
        </div>
        <div>Other repositories</div> 
        <div>archived repositories</div>
        
        */}
      <div className='pt-4'>
        <FormControl size='small'>
          <InputLabel id='demo-simple-select-label'>Time</InputLabel>
          <Select
            labelId='demo-simple-select-label'
            id='demo-simple-select'
            value={days.toString()}
            label='time'
            onChange={handleChange}
          >
            <MenuItem value={7}>Weekly</MenuItem>
            <MenuItem value={30}>Monthly</MenuItem>
            <MenuItem value={365}>Yearly</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className='d-flex'>
        {/* <div>Hello wirkjsfbv;dskjbfv;ajfn aljdv;asvn ;lkadf;sain ;ldjn;sld ;ldjnv;s</div> */}

        <div className='flex-grow-1'>
          <h4 className='pt-1 text-start'>Top Repositories</h4>
          <div className='d-flex'>
            <FormControl size='small'>
              <InputLabel id='demo-simple-select-label'></InputLabel>
              <Select
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={showCount.toString()}
                label='count'
                onChange={handleChangeShowCount}
              >
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
              </Select>
            </FormControl>
          </div>
          <Line options={options} data={data} />
        </div>
        <div>
          <h4 className='pt-1 text-start'>Repositories Contribution</h4>
          <div className='h-100 d-flex align-items-center'>
            {' '}
            <Pie data={piedata} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
