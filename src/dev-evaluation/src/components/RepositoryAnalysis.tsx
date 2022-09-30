import React, { useEffect, useState } from 'react';
import '../App.css';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import * as actions from '../actions';
import { useDispatch, useSelector } from 'react-redux';
import { GraphData, Store } from '../types';
import YearSelector from './YearSelector';
import SimpleListMenu from './BranchSelector';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Link, useParams } from 'react-router-dom';
import { formatDate } from '../utils';
import DetailedView from './RepositoryDetailedView';
import BackgroundLetterAvatars, {
  stringAvatar,
} from './BackgroundLetterAvatars';

interface Props {}

const Navbar: React.FC<Props> = (props) => {
  let { repo } = useParams();
  const selectedRepo = repo ? +repo : 0;

  const branches = useSelector((state: Store) => state.core.branches);
  // const repositories = useSelector((state: Store) => state.core.repositories);
  const currentRepository = useSelector((state: Store) => state.core.currentRepostory);
  const commits = useSelector((state: Store) => state.core.commits);
  const [activeBranch, setActiveBranch] = useState(0);
  const [selectedYear, setSelectedYear] = React.useState(
    new Date().getFullYear()
  );
  const [selectedGraphValue, setGraphValue] = React.useState<GraphData>({
    date: '',
    date__date: '',
    count: 0,
    sum: 0,
  });

  const graphData = useSelector((state: Store) => state.core.graphData);
  const [last_fetch_date, setLastFetch] = useState('');
  // const last_fetch_date = activeBranch?branches.filter(item=>item.id===activeBranch)[0].last_fetch_date:""
  const dispatch = useDispatch();

  useEffect(() => {
    if (repo) {
      dispatch(actions.fetchCurrentRepository.request(repo));
    }
  }, [repo]);

  useEffect(() => {
    if (branches[0]) {
      setActiveBranch(branches[0].id);
    }
  }, [branches]);

  function customTitleForValue(value: any) {
    return value
      ? `${value.date} with no: of commits ${value.count} and no: of files ${value.sum} `
      : null;
  }
  const onFetch = () => {
    if (currentRepository) {
      dispatch(
        actions.fetch.request({
          branch: activeBranch,
          repo: currentRepository
            .repo_name,
          year: selectedYear,
        })
      );
    }
  };
  const onCellSelect = (value: GraphData) => {
    dispatch(
      actions.fetchCommits.request({ branch: activeBranch, date: value.date })
    );
    setGraphValue(value);
  };

  return (
    <div className='pt-5 d-flex flex-column h-100 mt-5 mx-3 '>
      <div className='d-flex justify-content-start mb-5 mx-5'>
        <Card className='w-100'>
          <CardContent className='repo-card'>
            <div className='d-flex justify-content-between align-items-baseline'>
             <div className='d-flex align-items-baseline'> <Typography variant='h5' color='text.primary' className='d-flex '>
                {currentRepository &&currentRepository.repo_name}
              </Typography> <Typography
                variant='body2'
                color='text.secondary'
                className='d-flex ms-2'
              >
                 (Started on {formatDate(currentRepository &&currentRepository.start_date, true)})
              </Typography></div>
              <Typography
                variant='body2'
                color='text.secondary'
                className='d-flex '
              >
                Latest commit on{' '}
                {currentRepository &&
                  formatDate(currentRepository.last_authored_date, true)}
              </Typography>
            </div>
            <div className='d-flex justify-content-between p-2 align-items-end'>
            <div>
                <Typography
                  variant='body1'
                  color='text.primary'
                  className='d-flex '
                >
                  Latest branches:
                </Typography>

                {branches &&
                  branches.slice(0, 5).map((item) => (
                    <Typography gutterBottom variant='body2' component='div' className="text-start" color='text.secondary'>
                      {item.branch_name}
                    </Typography>
                  ))}
              </div>
              <div>
                <Typography
                  variant='body1'
                  color='text.primary'
                  className='d-flex mb-2'
                >
                  Developers
                </Typography>
               
                      <BackgroundLetterAvatars>
                      {currentRepository &&currentRepository.developers.slice(0,4).map((item) => (
                    <Tooltip title={item.username}>
                      <Link to ={ "/developers/" + item.id} className="text-white nounderline">
                      <Avatar {...stringAvatar(item.username)} />
                      </Link>
                  </Tooltip> ))} 
                 { currentRepository &&currentRepository.developers.length>4&&
                 <Tooltip title={currentRepository.developers.slice(4, currentRepository.developers.length).map((item)=><div><Link to ={ "/developers/" + item.id} className="text-white">{item.username}</Link></div>)}>
                 <Avatar>{"+" + (currentRepository.developers.length-4).toString()}</Avatar>
                  
             </Tooltip>
                 }
                   {/* {currentRepository &&currentRepository.developers.slice(4,10).map((item) => (
                    <Tooltip title={item.username}>
                      <Avatar {...stringAvatar(item.username)} />
                       
                  </Tooltip> ))}  */}
                      </BackgroundLetterAvatars>
                  
              </div>
            
            </div>

            <div className='d-flex justify-content-between align-items-baseline'></div>
          </CardContent>
        </Card>
      </div>
      <div className='d-flex justify-content-between  align-items-center'>
        <div className='d-flex align-items-center'>
          <SimpleListMenu
            setActiveBranch={setActiveBranch}
            setLastFetch={setLastFetch}
          />
          <div className='mx-3 text-nm text-grey'>
            <DeviceHubIcon /> {branches.length} Branches
          </div>
          {last_fetch_date && (
            <div className='mx-3 text-nm text-grey'>
              last fetched on: {formatDate(last_fetch_date, true)}
            </div>
          )}
        </div>
        <div>
          <Button variant='contained' size='small' onClick={onFetch}>
            <FileDownloadIcon /> Fetch{' '}
          </Button>
        </div>
      </div>
      <div className='d-flex  justify-content-center'>
        <div className='w-75 mt-5 border p-3'>
          <rect width='10' height='10' x='0' y='11' className='color-github-3'>
            <title></title>
          </rect>
          <CalendarHeatmap
            showWeekdayLabels={true}
            startDate={new Date(selectedYear - 1 + '-12-31')}
            endDate={new Date(selectedYear + '-12-31')}
            values={graphData}
            // onClick={value => alert("hello worlf")}
            onClick={onCellSelect}
            classForValue={(value) => {
              let commitWeight = 0;
              let filesWeight = 0;
              if (!value) {
                return 'color-empty';
              }
              if (value.count <= 2) {
                commitWeight = 1;
              } else if (value.count <= 5 && value.count > 2) {
                commitWeight = 2;
              } else if (value.count <= 8 && value.count > 5) {
                commitWeight = 3;
              } else if (value.count > 8) {
                commitWeight = 4;
              }
              if (value.sum <= 3) {
                filesWeight = 1;
              } else if (value.sum <= 5 && value.sum > 3) {
                filesWeight = 2;
              } else if (value.sum <= 10 && value.sum > 5) {
                filesWeight = 3;
              } else if (value.sum > 10) {
                filesWeight = 4;
              }
              return `color-github-${Math.ceil(
                (commitWeight + filesWeight) / 2
              )}`;
            }}
            titleForValue={customTitleForValue}
            // tooltipDataAttrs={customTooltipDataAttrs}
          />
        </div>
      </div>
      {/* <div className='d-flex flex-grow-1 align-items-end justify-content-end m-5'>

  <Button variant="contained">Contained</Button></div> */}
      <div className='d-flex justify-content-between '>
        <div className=" w-100 p-5">
          <DetailedView value={selectedGraphValue} commits={commits} />
        </div>
        <YearSelector
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          activeBranch={activeBranch}
        />
      </div>
    </div>
  );
};

export default Navbar;
