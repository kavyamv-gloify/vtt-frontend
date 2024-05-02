import React, {useState, useEffect} from 'react';
import {Grid} from '@mui/material';
import TimeToLeaveIcon from '@mui/icons-material/TimeToLeave';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import axios from 'axios';
import Api from '@api';
import moment from 'moment';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import {useNavigate} from 'react-router-dom';
import Tab from '@mui/material/Tab';
const TripSupport = ({id}) => {
  const [indexes, setIndexes] = useState(false);
  const [data, setData] = useState();
  const [value, setvalue] = useState('list');
  const [tripId, setTripId] = useState();
  const [topicList, settopicList] = useState();
  const [flag, setflag] = useState('current_Page');
  const navigate = useNavigate();
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  useEffect(() => {
    axios
      .get(Api.baseUri + '/user-reg/trip-driver/employee-trips/past')
      .then((res) => {
        setData(res?.data?.data);
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {}, [tripId]);

  useEffect(() => {
    axios
      .get(Api.baseUri + '/user-reg/subtopiccontroller/' + id + '/helpid')
      .then((res) => {
        console.log('res', res);
        settopicList(res?.data);
      })
      .catch((err) => {});
  }, [id]);
  return (
    <>
      {value == 'list' && (
        <>
          <h1>Help with your last bookings?</h1>

          <Grid container sx={{marginTop: '20px'}}>
            
            {data?.map((el, index) => {
              {console.log("eeee",el)}
              return (
                <>
                <Grid
                  item
                  xs={12}
                  md={12}
                  sx={{
                    background: 'white',
                    padding: '20px',
                    boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                    marginBottom: '20px',
                  }}
                  onClick={() => {
                    setvalue('listItem');
                    setTripId(index);
                  }}
                >
                  <div style={{display: 'flex', flexDirection: 'row'}}>
                    <div>
                      <TimeToLeaveIcon />
                    </div>
                    <div
                      style={{
                        marginLeft: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      {/* <h5 style={{ fontWeight: "700" }}>Mon, Feb 13, 07:15 PM</h5> */}
                      <h5 style={{fontWeight: '700'}}>
                        {moment(el?.actualPickUpDateTimeStr).format('llll')}
                      </h5>
                      <h5>{el?.vehicleNumber}</h5>
                      
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          marginTop: '10px',
                        }}
                      >
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
                            <FiberManualRecordIcon
                              sx={{fontSize: '10px'}}
                            />{' '}
                          </div>
                          <p style={{paddingLeft: '20px', color: 'grey'}}>
                            {el?.tripType == 'UPTRIP'
                              ? el?.location?.locName
                              : el?.officeLocation?.locName}
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
                            {el?.tripType == 'UPTRIP'
                              ? el?.officeLocation?.locName
                              : el?.location?.locName}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='urrides-tripcard'>
                    <div className='card-data-tripcard'>
                      <img
                        style={{maxHeight: '20px', height: '100%'}}
                        src={
                          '/assets/images/' +
                          (el.tripType == 'DOWNTRIP'
                            ? 'logout_icon.png'
                            : 'login_icon.png')
                        }
                      />
                      <span
                        style={{marginLeft: '10px', cursor: 'pointer'}}
                        onClick={() => {
                          setOpenDialog(true);
                          setCurrentData(el);
                          // createmap(el);
                        }}
                      >
                        {' '}
                        {el.tripCode}
                      </span>
                    </div>
                    <div className='card-data-tripcard'>
                      <img
                        style={{maxHeight: '20px', height: '100%'}}
                        src='/assets/images/group_people.png'
                      />
                      <span style={{marginLeft: '10px'}}>
                        {' '}
                        {el.noOfPassengerInTrip || 0}
                      </span>
                    </div>

                    <div className='card-data-tripcard'>
                      {/* <img src='/assets/images/trip_id.png' /> */}
                      <div
                        style={{
                          color:
                            el.status == 'COMPLETED'
                              ? 'green'
                              : el.status == 'STARTED'
                              ? 'green'
                              : el.status == 'SCHEDULE'
                              ? 'orange'
                              : 'red',
                        }}
                      >
                        {' '}
                        <div
                          style={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          {el.status == 'STARTED' && (
                            <div
                              className='ringring'
                              style={{
                                position: 'initial',
                                marginRight: '5px',
                              }}
                            ></div>
                          )}
                          <div>
                            {el.status == 'CANCLED'
                              ? 'Cancelled'
                              : el.status == 'STARTED'
                              ? 'Live'
                              : el.status == 'SCHEDULE'
                              ? 'Scheduled'
                              : el.status?.charAt(0).toUpperCase() +
                                el.status?.toLowerCase()?.slice(1)}
                          </div>
                        </div>
                      </div>
                    </div>
                    {el?.vehicleNumber?.length && (
                      <div className='card-data-tripcard'>
                        {el?.vehicleNumber}
                      </div>
                    )}

                    {el?.driverName?.length && (
                      <div className='card-data-tripcard'>{el?.driverName}</div>
                    )}
                    {el.tripCategory == 'ADHOCTRIP' && (
                      <div className='card-data-tripcard'>
                        <div style={{height: '100%'}}>
                          <img
                            style={{height: '15px'}}
                            src='/assets/images/Adhoc.svg'
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </Grid>
                </>    
              );
            })}
          </Grid>
        </>
      )}

      {flag == 'current_Page' && value == 'listItem' && (
        <>
          <div style={{display: 'flex'}}>
            <div style={{marginLeft: '20px'}}>
              <ArrowBackIosIcon
                onClick={() => {
                  setvalue('list');
                }}
              />
            </div>
            <div>
              <h1>Choose An issue</h1>
            </div>
          </div>
          <Grid container sx={{border: '2px solid #f1f1f1', marginTop: '20px'}}>
            <Grid
              item
              xs={12}
              sx={{background: 'white', borderBottom: '2px solid #f1f1f1'}}
            >
              <div
                style={{display: 'flex', flexDirection: 'row', padding: '20px'}}
              >
                <div
                  style={{
                    marginLeft: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <h5 style={{fontWeight: '700'}}>
                    {moment(data[tripId]?.actualPickUpDateTimeStr).format(
                      'llll',
                    )}
                  </h5>
                  <h5>{data[tripId]?.vehicleNumber}</h5>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      marginTop: '10px',
                    }}
                  >
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
                        {data[tripId]?.tripType == 'UPTRIP'
                          ? data[tripId]?.location?.locName
                          : data[tripId]?.officeLocation?.locName}
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
                        {data[tripId]?.tripType == 'UPTRIP'
                          ? data[tripId]?.officeLocation?.locName
                          : data[tripId]?.location?.locName}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='urrides-tripcard' style={{marginTop:"-10px", padding:"9px 50px",borderTop:"0px"}}>
                    <div className='card-data-tripcard'>
                      <img
                        style={{maxHeight: '20px', height: '100%'}}
                        src={
                          '/assets/images/' +
                          (data[tripId]?.tripType == 'DOWNTRIP'
                            ? 'logout_icon.png'
                            : 'login_icon.png')
                        }
                      />
                      <span
                        style={{marginLeft: '10px', cursor: 'pointer'}}
                        onClick={() => {
                          setOpenDialog(true);
                          setCurrentData(el);
                          // createmap(el);
                        }}
                      >
                        {' '}
                        {data[tripId]?.tripCode}
                      </span>
                    </div>
                    <div className='card-data-tripcard'>
                      <img
                        style={{maxHeight: '20px', height: '100%'}}
                        src='/assets/images/group_people.png'
                      />
                      <span style={{marginLeft: '10px'}}>
                        {' '}
                        {data[tripId]?.noOfPassengerInTrip || 0}
                      </span>
                    </div>

                    <div className='card-data-tripcard'>
                      {/* <img src='/assets/images/trip_id.png' /> */}
                      <div
                        style={{
                          color:
                            data[tripId]?.status == 'COMPLETED'
                              ? 'green'
                              : data[tripId]?.status == 'STARTED'
                              ? 'green'
                              : data[tripId]?.status == 'SCHEDULE'
                              ? 'orange'
                              : 'red',
                        }}
                      >
                        {' '}
                        <div
                          style={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          {data[tripId]?.status == 'STARTED' && (
                            <div
                              className='ringring'
                              style={{
                                position: 'initial',
                                marginRight: '5px',
                              }}
                            ></div>
                          )}
                          <div>
                            {data[tripId]?.status == 'CANCLED'
                              ? 'Cancelled'
                              : data[tripId]?.status == 'STARTED'
                              ? 'Live'
                              : data[tripId]?.status == 'SCHEDULE'
                              ? 'Scheduled'
                              : data[tripId]?.status?.charAt(0).toUpperCase() +
                                data[tripId]?.status?.toLowerCase()?.slice(1)}
                          </div>
                        </div>
                      </div>
                    </div>
                    {data[tripId]?.vehicleNumber?.length && (
                      <div className='card-data-tripcard'>
                        {data[tripId]?.vehicleNumber}
                      </div>
                    )}

                    {data[tripId]?.driverName?.length && (
                      <div className='card-data-tripcard'>{data[tripId]?.driverName}</div>
                    )}
                    {data[tripId]?.tripCategory == 'ADHOCTRIP' && (
                      <div className='card-data-tripcard'>
                        <div style={{height: '100%'}}>
                          <img
                            style={{height: '15px'}}
                            src='/assets/images/Adhoc.svg'
                          />
                        </div>
                      </div>
                    )}
                  </div>
            </Grid>
            <Grid item xs={12}>
              {topicList?.data?.map((tab, index) => (
                <Tab
                  className='account-tab'
                  label={
                    tab?.subTopicName?.trim()?.length > 60
                      ? tab?.subTopicName?.trim()?.slice(0, 60) + '...'
                      : tab?.subTopicName
                  }
                  icon={
                    <ArrowRightIcon
                      style={{position: 'relative', top: '-2px'}}
                    />
                  }
                  onClick={() => {
                    navigate(
                      '/user/support-faq/' +
                        window.btoa(tab?.id + '>>' + tripId),
                    );
                  }}
                  key={index}
                  {...a11yProps(index)}
                />
              ))}
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
};

export default TripSupport;
