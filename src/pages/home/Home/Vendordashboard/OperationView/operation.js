import React, {useEffect, useState} from 'react';
import {Box} from '@mui/material';
import {Grid} from '@mui/material';
import {styled} from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import HorizentalBar from './horizentalBar';
import './style.css';
import axios from 'axios';
import Api from '@api';

const Operations = ({escortTrip, selectedShift, tripByStatus}) => {
  return (
    <>
      <Box sx={{width: '100%', marginTop: '1vh'}}>
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
                <p>{tripByStatus?.SCHEDULE?.length || 0}</p>
                <p>Scheduled</p>
              </div>
            </div>
          </Grid>

          <Grid item xs={12} sm={10} md={10}>
            <div className='card-normal' style={{minHeight: '210px'}}>
              <div className='card-title'>Trips</div>
              <Box sx={{width: '100%', height: '100%'}}>
                <Grid
                  container
                  rowSpacing={0}
                  columnSpacing={{xs: 0}}
                  sx={{height: '100%'}}
                >
                  <Grid item xs={12} sm={2} md={2}>
                    <HorizentalBar
                      total={tripByStatus?.count || 0}
                      completed={tripByStatus?.STARTED?.length || 0}
                      icon='/assets/images/scheduled_trip_dash.svg'
                      barColor='#1f456e'
                      title='In Progress'
                    />
                  </Grid>
                  <Grid item xs={12} sm={2} md={2}>
                    <HorizentalBar
                      total={tripByStatus?.count ?? 0}
                      completed={tripByStatus?.SCHEDULE?.length || 0}
                      icon='/assets/images/scheduled_trip_dash.svg'
                      barColor='#1f456e'
                      title='Not Started'
                    />
                  </Grid>
                  <Grid item xs={12} sm={2} md={2}>
                    <HorizentalBar
                      total={tripByStatus?.count ?? 0}
                      completed={tripByStatus?.COMPLETED?.length || 0}
                      icon='/assets/images/completed_dash.svg'
                      barColor='#1f456e'
                      title='Completed'
                    />
                  </Grid>
                  <Grid item xs={12} sm={2} md={2}>
                    <HorizentalBar
                      total={tripByStatus?.count || 0}
                      completed={tripByStatus?.ABSENT?.length || 0}
                      icon='/assets/images/absent_dash.svg'
                      barColor='#1f456e'
                      title='Absent'
                    />
                  </Grid>
                  <Grid item xs={12} sm={2} md={2}>
                    <HorizentalBar
                      total={tripByStatus?.count || 0}
                      completed={
                        (tripByStatus?.CANCLED?.length || 0) +
                        (tripByStatus?.NOSHOW?.length || 0)
                      }
                      icon='/assets/images/cancelled_dash.svg'
                      barColor='#1f456e'
                      title='No Show / Cancelled'
                    />
                  </Grid>
                  <Grid item xs={12} sm={2} md={2}>
                    <HorizentalBar
                      total={tripByStatus?.count || 0}
                      completed={escortTrip?.YES?.length || 0}
                      icon='/assets/images/escort_dash.svg'
                      barColor='#1f456e'
                      title='Escort'
                    />
                  </Grid>
                </Grid>
              </Box>
            </div>
          </Grid>
          {/* <Grid item xs={3} columns={{ xs: 3, sm: 8, md: 12 }} >
                        <div style={{
                            padding: "0px",
                            position: "relative",
                            height: '280px',
                            marginTop: '-50px',
                            background: 'white',
                            borderRadius: '15px',
                            marginLeft: '-36px',
                            boxShadow: "rgb(0 0 0 / 13%) 3px 2px 25px 2px",
                        }} >
                            <div style={{ background:"#de2314", borderRadius: '15px 15px 0px 0px', borderBottom: '1px solid #eceaea', textAlign: 'left', fontSize: '16px', fontWeight: "600", padding: '14px', color: 'white' }}>
                                <div>Support <span style={{position:"absolute", right:"10px"}}><CloseIcon/></span></div>
                            </div>
                            <div style={{padding:"10px 10px 0px 15px"}}>
                                
                            </div>
                        </div>
                    </Grid> */}
        </Grid>
      </Box>
    </>
  );
};

export default Operations;
