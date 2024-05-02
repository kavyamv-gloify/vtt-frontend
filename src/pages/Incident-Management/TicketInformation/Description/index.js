import React, {useEffect, useState} from 'react';
import {Grid, Box, Avatar} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CalenderTime from './CalenderTime';
import TripHistory from './TripHistory';
import PhoneIcon from '@mui/icons-material/Phone';
import moment from 'moment';
const Description = ({ticketInfo, tripInfo}) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState();
  const [passenger, setPassesger] = useState();
  function msToTime(ms) {
    let seconds = (ms / 1000).toFixed(1);
    let minutes = (ms / (1000 * 60)).toFixed(1);
    let hours = (ms / (1000 * 60 * 60)).toFixed(1);
    let days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
    if (seconds < 60) return seconds + ' Sec';
    else if (minutes < 60) return minutes + ' Min';
    else if (hours < 24) return hours + ' Hrs';
    else return days + ' Days';
  }
  useEffect(() => {
    console.log('tripInfo', tripInfo);
    let temp_array = [];
    tripInfo?.stopList?.map((el) => {
      el?.onBoardPassengers?.map((e) => {
        temp_array.push(e);
      });
    });
    setPassesger(temp_array);
    console.log(' temp_array', temp_array);
    temp_array?.map((el) => {
      // console.log('el', el);
      if (el?.empId == ticketInfo?.ticketForId) {
        console.log('filter', el);
        setData(el);
      }
    });
  }, [tripInfo, ticketInfo?.ticketForId]);

  return (
    <div>
      <Grid container>
        <Grid item md={3} sx={{border: '1px solid rgba(224, 224, 224, 1)'}}>
          <Grid container>
            <Grid md={12} sx={{padding: '10px'}}>
              <Box
                sx={{
                  borderBottom: '1px solid rgba(224, 224, 224, 1)',
                  borderBottomStyle: 'dashed  ',
                  padding: '10px',
                }}
              >
                <Box
                  component='h3'
                  sx={{
                    fontWeight: 600,
                    fontSize: 16,
                    textAlign: 'left',
                    lineHeight: 1,
                    marginBottom: '10px',
                  }}
                >
                  {ticketInfo?.ticketForName}
                </Box>
                <Box>{ticketInfo?.departmentName}</Box>
                <Box>{ticketInfo?.emailId}</Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '15px',
                  }}
                >
                  {ticketInfo?.mobileNo}{' '}
                  <PhoneIcon
                    sx={{
                      fontSize: 'medium',
                      fontWeight: '600',
                      marginLeft: '10px',
                    }}
                  />
                </Box>
              </Box>
            </Grid>
            <Grid md={12}>
              <Box sx={{padding: '10px'}}>
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: '800',
                    color: '#909497',
                  }}
                >
                  Assign To
                </p>
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                  <Avatar
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      m: '0',
                      mr: 2,
                      height: 25,
                      width: 25,
                      border: '1px solid #D7DBDD',
                      backgroundColor: 'white',
                      marginRight: '10px',
                    }}
                  ></Avatar>
                  <p style={{fontSize: '12px', fontWeight: '800'}}>
                    {ticketInfo?.ticketForName || 'NA'}
                  </p>
                </Box>
              </Box>
              <Box sx={{padding: '10px'}}>
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: '800',
                    color: '#909497',
                  }}
                >
                  Status
                </p>
                <p style={{fontSize: '12px', fontWeight: '800'}}>
                  {ticketInfo?.status || "NA"}
                </p>
              </Box>
              <Box sx={{padding: '10px'}}>
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: '800',
                    color: '#909497',
                  }}
                >
                  Due Date
                </p>
                <p style={{fontSize: '12px', fontWeight: '800'}}>
                  {ticketInfo?.dueDate || "NA"}
                </p>
              </Box>
              <Box sx={{padding: '10px'}}>
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: '800',
                    color: '#909497',
                  }}
                >
                  Phone Number
                </p>
                <p style={{fontSize: '12px', fontWeight: '800'}}>
                  {ticketInfo?.mobileNo || "NA"}
                </p>
              </Box>
              <Box sx={{padding: '10px'}}>
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: '800',
                    color: '#E74C3C',
                  }}
                >
                  Incident Type
                </p>
                <p style={{fontSize: '12px', fontWeight: '800'}}>SOS</p>
              </Box>
              <Box sx={{padding: '10px'}}>
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: '800',
                    color: '#E74C3C',
                  }}
                >
                  Channel
                </p>
                <p style={{fontSize: '12px', fontWeight: '800'}}>
                  {ticketInfo?.channelName || "NA"}
                </p>
              </Box>
              <Box sx={{padding: '10px'}}>
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: '800',
                    color: '#E74C3C',
                  }}
                >
                  Classification
                </p>
                <p style={{fontSize: '12px', fontWeight: '800'}}>
                  {ticketInfo?.classification || "NA"}
                </p>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={9} sx={{padding: '10px'}}>
          <Grid
            item
            md={12}
            sm={12}
            xs={12}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              borderBottom: '1.5px solid #f6f6f6 ',
              padding: '10px',
              color: 'black',
            }}
          >
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <p style={{fontSize: '18px', fontWeight: '700', color: 'black'}}>
                {ticketInfo?.subject}
              </p>
              <p
                style={{
                  fontSize: '15px',
                  fontWeight: '500',
                  color: 'black',
                  marginLeft: '20px',
                  marginTop: '3px',
                }}
              >
                {ticketInfo?.ticketCode}
              </p>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <div style={{marginRight: '4px'}}>
                <AccessTimeIcon />
              </div>
              <p style={{marginTop: '3px'}}>
                {' '}
                {moment(ticketInfo?.createdOn).format('MMM Do YYYY, hh:mm:ss')}
              </p>
            </div>
          </Grid>
          <Grid
            item
            md={12}
            sm={12}
            xs={12}
            sx={{borderBottom: '1px solid #f6f6f6'}}
          >
            <Grid container>
              <Grid item md={9} sm={12} xs={12} sx={{padding: '10px'}}>
                <Grid container>
                  <Grid item md={12} sx={{marginTop: '10px'}}>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                      <div
                        style={{
                          color: 'orange',
                          paddingLeft: '7px',
                          display: 'flex',
                          flexDirection: 'row',
                        }}
                      >
                        <div>
                          {' '}
                          <FiberManualRecordIcon sx={{fontSize: '10px'}} />{' '}
                        </div>
                        <p style={{paddingLeft: '20px', color: 'grey'}}>
                          {data?.tripType == 'UPTRIP'
                            ? data?.location?.locName
                            : data?.officeLocation?.locName}
                        </p>
                      </div>
                      <div>
                        <MoreVertIcon />
                      </div>
                      <div
                        style={{
                          color: 'green',
                          paddingLeft: '7px',
                          display: 'flex',
                          flexDirection: 'row',
                        }}
                      >
                        <div>
                          <FiberManualRecordIcon sx={{fontSize: '10px'}} />
                        </div>
                        <p style={{paddingLeft: '20px', color: 'grey'}}>
                          {data?.tripType == 'DOWNTRIP'
                            ? data?.location?.locName
                            : data?.officeLocation?.locName}
                        </p>
                      </div>
                    </div>
                  </Grid>

                  <Grid item md={12} sx={{marginTop: '20px'}}>
                    <Grid container>
                      <Grid
                        item
                        md={2}
                        sx={{
                          display: 'flex',
                          borderRight: '1px solid #f6f6f6',
                          justifyContent: 'center',
                        }}
                      >
                        <img
                          src={'/assets/images/login_icon.png'}
                          style={{width: '20px', height: '20px'}}
                        />
                        <p
                          style={{
                            fontSize: '12px',
                            marginLeft: '3px',
                            marginTop: '2px',
                          }}
                        >
                          {tripInfo?.tripCode}
                        </p>
                      </Grid>
                      <Grid
                        item
                        md={2}
                        sx={{
                          display: 'flex',
                          borderRight: '1px solid #f6f6f6',
                          justifyContent: 'center',
                        }}
                      >
                        <p style={{fontSize: '12px'}}>
                          {moment(ticketInfo?.createdOn).format(
                            'MMM Do YYYY, hh:mm:ss',
                          )}
                        </p>
                      </Grid>
                      <Grid
                        item
                        md={2}
                        sx={{
                          display: 'flex',
                          borderRight: '1px solid #f6f6f6',
                          justifyContent: 'center',
                        }}
                      >
                        <img
                          onClick={() => {
                            setOpen(!open);
                          }}
                          src={
                            '/assets/images/route_page_icon/employee_blue.png'
                          }
                        />
                        <p style={{marginLeft: '20px'}}> {data?.length}</p>
                        {/* <p>
                        {tripInfo?.escortTrip == 'YES'
                          ? data?.length - 1
                          : data?.length}
                      </p> */}
                      </Grid>
                      <Grid
                        item
                        md={2}
                        sx={{
                          display: 'flex',
                          borderRight: '1px solid #f6f6f6',
                          justifyContent: 'center',
                        }}
                      >
                        <img
                          src={'/assets/images/route_page_icon/map.png'}
                          style={{paddingLeft: '10px'}}
                        />
                      </Grid>
                      <Grid
                        item
                        md={2}
                        sx={{
                          display: 'flex',
                          borderRight: '1px solid #f6f6f6',
                          justifyContent: 'center',
                        }}
                      >
                        <img
                          src={'/assets/images/route_page_icon/driver.png'}
                        />
                      </Grid>
                      <Grid
                        item
                        md={2}
                        sx={{
                          display: 'flex',
                          borderRight: '1px solid #f6f6f6',
                          justifyContent: 'center',
                        }}
                      >
                        <img
                          src={'/assets/images/route_page_icon/escort.png'}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={3} sm={12} xs={12}></Grid>
            </Grid>
          </Grid>
          {open && (
            <Grid item md={12} sm={12} xs={12} sx={{padding: '10px'}}>
              <TripHistory ticketInfo={tripInfo} />
            </Grid>
          )}

          <Grid
            item
            md={12}
            sm={12}
            xs={12}
            sx={{
              display: 'flex',
              marginBottom: '20px',
              borderBottom: '1px solid #f6f6f6',
            }}
          >
            <img
              src={'/assets/images/vehical_icon.png'}
              style={{width: '35px'}}
            />
            <p
              style={{
                fontWeight: 'bold',
                marginTop: '10px',
                marginLeft: '40px',
              }}
            >
              {tripInfo?.vehicleNo ?? '--'}
            </p>
          </Grid>
          <Grid
            item
            md={12}
            sm={12}
            xs={12}
            sx={{
              display: 'flex',
              marginBottom: '20px',
              borderBottom: '1px solid #f6f6f6',
            }}
          >
            <img
              src={'/assets/images/route_page_icon/escort.png'}
              style={{width: '35px'}}
            />
            <p
              style={{
                fontWeight: 'bold',
                marginTop: '10px',
                marginLeft: '40px',
              }}
            >
              {tripInfo?.driverName ?? '--'}
            </p>
          </Grid>

          <Grid item md={9} sm={12} xs={12}>
            <Grid container>
              <Grid
                item
                md={2}
                sx={{display: 'flex', justifyContent: 'space-between'}}
              >
                <AccessTimeIcon />
                <p style={{fontWeight: 'bold'}}>
                  {(Math.round(Number(tripInfo?.tripDistance)) / 1000).toFixed(
                    2,
                  ) + 'km'}
                </p>
                <p style={{fontWeight: 'bold'}}>
                  {msToTime(Number(tripInfo?.tripDuration))}
                </p>
              </Grid>
              <Grid
                item
                md={4}
                sx={{display: 'flex', justifyContent: 'center'}}
              >
                <CalenderTime />
              </Grid>
              <Grid
                item
                md={2}
                sx={{
                  dispaly: 'flex',
                  flexDirection: 'row',
                  paddingLeft: '30px',
                }}
              >
                <img
                  src={'/assets/images/on_timeincident copy.png'}
                  style={{width: '35px'}}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Description;
