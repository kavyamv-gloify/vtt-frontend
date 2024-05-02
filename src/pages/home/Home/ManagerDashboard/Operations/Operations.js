import React, {useEffect, useState} from 'react';
import {Box} from '@mui/material';
import {Grid} from '@mui/material';
import _ from 'lodash';
import {styled} from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import HorizentalBar from './horizontalbar';
import './style.css';
import axios from 'axios';
import Api from '@api';

const Operations = ({
  escortTrip,
  tripByStatus,
  setSelectedShift,
  tripByEmpStatus,
  totalTrip,
}) => {
  const [count, setCount] = useState();
  const [trip, setTrip] = useState();
  useEffect(() => {
    let mytemD = _.groupBy(totalTrip, 'status');
    console.log('mytemD', mytemD);
    setTrip(mytemD);
  }, [totalTrip]);
  useEffect(() => {
    console.log('trip', trip);
  }, [trip]);
  return (
    <>
      <Box sx={{width: '100%', marginTop: '2vh'}}>
        <Grid container rowSpacing={2} columnSpacing={{xs: 4}}>
          <Grid item xs={12} sm={2} md={2}>
            <div className='card-with-icon'>
              <div className='cwi-bg'>
                <img
                  src='/assets/images/operatin_summary.jpg'
                  style={{height: '135px'}}
                  alt='P'
                />
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '-40px',
                  }}
                >
                  <img
                    src='/assets/images/scheduled_dash.svg'
                    style={{height: '50px', width: 'auto'}}
                    alt='Ps'
                  />
                </div>
              </div>
              <div className='cwi-title'>
                <p>{tripByEmpStatus?.SCHEDULE?.length ?? 0}</p>
                <p>Scheduled</p>
              </div>
            </div>
          </Grid>

          <Grid item xs={12} sm={10} md={10}>
            <div className='card-normal' style={{minHeight: '210px'}}>
              <div className='card-title'>Trips Status</div>
              <Box sx={{width: '100%', height: '100%'}}>
                <Grid
                  container
                  rowSpacing={0}
                  columnSpacing={{xs: 0}}
                  sx={{height: '100%'}}
                >
                  <Grid item xs={12} sm={2} md={2}>
                    <HorizentalBar
                      total={totalTrip?.length || 0}
                      completed={trip?.STARTED?.length || 0}
                      icon='/assets/images/scheduled_trip_dash.svg'
                      barColor='#1f456e'
                      title='In Progress'
                    />
                  </Grid>
                  <Grid item xs={12} sm={2} md={2}>
                    <HorizentalBar
                      total={totalTrip?.length ?? 0}
                      completed={trip?.SCHEDULE?.length || 0}
                      icon='/assets/images/scheduled_trip_dash.svg'
                      barColor='#1f456e'
                      title='Not Started'
                    />
                  </Grid>
                  <Grid item xs={12} sm={2} md={2}>
                    <HorizentalBar
                      total={totalTrip?.length ?? 0}
                      completed={trip?.COMPLETED?.length || 0}
                      icon='/assets/images/completed_dash.svg'
                      barColor='#1f456e'
                      title='Completed'
                    />
                  </Grid>
                  <Grid item xs={12} sm={2} md={2}>
                    <HorizentalBar
                      total={totalTrip?.length || 0}
                      completed={trip?.ABSENT?.length || 0}
                      icon='/assets/images/absent_dash.svg'
                      barColor='#1f456e'
                      title='Absent'
                    />
                  </Grid>
                  <Grid item xs={12} sm={2} md={2}>
                    <HorizentalBar
                      total={totalTrip?.length || 0}
                      completed={
                        (trip?.CANCLED?.length || 0) +
                        (trip?.NOSHOW?.length || 0)
                      }
                      icon='/assets/images/cancelled_dash.svg'
                      barColor='#1f456e'
                      title='No Show / Cancelled'
                    />
                  </Grid>
                  <Grid item xs={12} sm={2} md={2}>
                    <HorizentalBar
                      total={totalTrip?.length || 0}
                      completed={trip?.EXPIRED?.length || 0}
                      icon='/assets/images/escort_dash.svg'
                      barColor='#1f456e'
                      title='Expired'
                    />
                  </Grid>
                </Grid>
              </Box>
            </div>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Operations;
