import React, { useEffect, useState } from 'react';
import '../App.css';
import { Avatar, Button, Card, CardContent, TextField, Typography } from '@mui/material';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import * as actions from '../actions';
import { useDispatch, useSelector } from 'react-redux';
import { GraphData, RepositoryPayload, Store } from '../types';
import GraphSelector from './GraphSelector';
import YearSelector from './YearSelector';
import SimpleListMenu from './BranchSelector';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { formatDate, getLastWeeksDate } from '../utils';
import DetailedView from './DevelopersDetailView';
import BackgroundLetterAvatars, { stringAvatar } from './BackgroundLetterAvatars';


interface Props {}

const Navbar: React.FC<Props> = (props) => {
  let { dev } = useParams();
  let location = useLocation();
  const repos: RepositoryPayload[] = useSelector((state: Store) => state.core.repositories);
  const currentDeveloper = dev?+dev:0;
  const devCommits = useSelector((state: Store) => state.core.devCommits);
  const developers = useSelector((state: Store) => state.core.developers);
  const [activeBranch, setActiveBranch] = useState(0)
  const [selectedYear, setSelectedYear] = React.useState(new Date().getFullYear());
  const [selectedGraphValue, setGraphValue] = React.useState<GraphData>({date:"",date__date:"", count:0, sum:0});
  

  const graphData = useSelector((state: Store) => state.core.developerGraphData);
  const devProjects = useSelector((state: Store) => state.core.devProjects);
  const staleRepos = repos.filter(repo=>!repo.archived  && new Date(repo.last_authored_date).getTime()< getLastWeeksDate().getTime()).sort((a,b)=>new Date(b.last_authored_date).getTime()-new Date(a.last_authored_date).getTime())
  const staleRepoCount = staleRepos.filter(item=>item.repo_name)
  const [last_fetch_date, setLastFetch] = useState('')
  // const last_fetch_date = activeBranch?branches.filter(item=>item.id===activeBranch)[0].last_fetch_date:""
  const dispatch = useDispatch();

  useEffect(() => {
    if(dev){
    dispatch(actions.fetchDevProjects.request(+dev));}
  }, [dev, dispatch]);
  useEffect(() => {
    if(dev){
    dispatch(actions.fetchDeveloperGraphData.request({author: +dev, year: selectedYear}));}
  }, [dev, dispatch, selectedYear]);






  function customTitleForValue(value: any) {
    return value
      ? `${value.date} with no: of commits ${value.count} and no: of files ${value.sum} `
      : null;
  }

  const onCellSelect = (value: GraphData)=>{
    if(dev){
    dispatch(actions.fetchDevCommits.request({author:+dev, date:value.date}))
    setGraphValue(value)}

  }

  return (
    <div className='pt-5 d-flex flex-column h-100 mt-5 mx-3'>
      <div className='d-flex justify-content-start mb-5 mx-5'>
        <Card className='w-100'>
          <CardContent className='repo-card'>
            <div className='d-flex justify-content-between align-items-baseline'>
             <div className='d-flex align-items-baseline'> <Typography variant='h5' color='text.primary' className='d-flex '>
                {developers[0]&&developers.filter(item=>item.id===currentDeveloper)[0].username}
              </Typography> <Typography
                variant='body2'
                color='text.secondary'
                className='d-flex ms-2'
              >
              </Typography></div>
             <div className='d-flex'> <div className='me-3'><Typography
                variant='h2'
                color='text.secondary'
                className='d-flex '
              >
               {devProjects&&devProjects.length}
              </Typography>
              <Typography
                variant='body2'
                color='text.secondary'
                className='d-flex '
              >
               Projects
              </Typography></div>
              {/* staleRepos.map(item=>item.repo_name).includes("lynkeos") */}
              {devProjects&&devProjects.filter(project=>staleRepos.map(item=>item.repo_name).includes(project.project_name)).length ? <div> <Typography
                variant='h2'
                color='red'
                className='d-flex '
              >
               {devProjects&&devProjects.filter(project=>staleRepos.map(item=>item.repo_name).includes(project.project_name)).length}
              </Typography>
             <Typography
                variant='body2'
                color='red'
                className='d-flex '
              >
               Stale Project
              </Typography></div>:""}</div>
            </div>
            <div className='d-flex justify-content-between p-2 align-items-end'>
            <div>
                <Typography
                  variant='body1'
                  color='text.primary'
                  className='d-flex '
                >
                  Projects:
                </Typography>
                {devProjects&&devProjects.map(item=>
                <Typography gutterBottom variant='body2' component='div' className="text-start" color='text.secondary'>
                      {item.project_name} - last commited on  {formatDate(item.latest_date, true)}
                    
                    </Typography>)}
                
                   

                {/* {branches &&
                  branches.slice(0, 5).map((item) => (
                    <Typography gutterBottom variant='body2' component='div' className="text-start" color='text.secondary'>
                      {item.branch_name}
                    </Typography>
                  ))} */}
              </div>
              {/* <div>
                <Typography
                  variant='body1'
                  color='text.primary'
                  className='d-flex mb-2'
                >
                  Developers
                </Typography>
               
                      <BackgroundLetterAvatars>
                      {repo &&
                  repositories
                    .filter((item) => item.id === selectedRepo)[0]
                    .developers.map((item) => (
                    <Tooltip title={item.username}>
                      <Avatar {...stringAvatar(item.username)} />
                       
                  </Tooltip> ))} 
                      </BackgroundLetterAvatars>
                  
              </div> */}
            
            </div>

            <div className='d-flex justify-content-between align-items-baseline'></div>
          </CardContent>
        </Card>
      </div>
      <div className='d-flex  justify-content-center'>
        <div className='w-75 mt-5 border p-3'>
          <rect width='10' height='10' x='0' y='11' className='color-github-3'>
            <title></title>
          </rect>
          <CalendarHeatmap
            showWeekdayLabels={true}
            startDate={new Date(selectedYear-1+ '-12-31')}
            endDate={new Date(selectedYear + '-12-31')}
            values={graphData}
            // onClick={value => alert("hello worlf")}
            onClick={onCellSelect}
            classForValue={(value) => {
              let commitWeight = 0
              let filesWeight = 0
              if (!value) {
                return 'color-empty';
              }
              if(value.count<=2){
                commitWeight = 1
              }
              else if(value.count<=5 && value.count>2){
                commitWeight = 2
              }
              else if(value.count<=8 && value.count>5){
                commitWeight = 3
              }
              else if(value.count>8){
                commitWeight = 4
              }
              if(value.sum<=3){
                filesWeight = 1
              }
              else if(value.sum<=5 && value.sum>3){
                filesWeight = 2
              }
              else if(value.sum<=10 && value.sum>5){
                filesWeight = 3
              }
              else if(value.sum>10){
                filesWeight = 4
              }
              return `color-github-${Math.ceil((commitWeight+ filesWeight)/2)}`;
            }}
            titleForValue={customTitleForValue}
            // tooltipDataAttrs={customTooltipDataAttrs}
          />
        </div>
      </div>
      <div className='d-flex justify-content-between '>
        <div className=" w-100 p-5">
          <DetailedView value={selectedGraphValue} commits={devCommits} developer={developers[0]&&developers.filter(item=>item.id===currentDeveloper)[0].username}/>
        </div>
        <YearSelector  selectedYear={selectedYear} setSelectedYear={setSelectedYear} activeBranch={activeBranch}/>
      </div>
    </div>
  );
};

export default Navbar;
