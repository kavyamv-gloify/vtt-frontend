import React, {useState, useEffect} from 'react';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import PropTypes from 'prop-types';
import {Box, ListItem, Typography} from '@mui/material';
import {Fonts} from 'shared/constants/AppEnums';
import Grid from '@mui/material/Grid';
import './sos.css';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import CallIcon from '@mui/icons-material/Call';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';
import Api from '../../../@api';
import {useNavigate} from 'react-router-dom';
import moment from 'moment';
import EditNotificationsIcon from '@mui/icons-material/EditNotifications';

const SOS = (props) => {
  const [dotArr, setdotArr] = useState([]);
  const navigate = useNavigate();
  function notificationClicked() {
    // let postData = {
    //     "tripId":props?.item?.tripId,
    //     "empId":"63bbebbace773d7284657c16",
    //     "ssoStatus":"CLOSED",
    //     "ssoRemarks":"TEST"
    // }
  }
  useEffect(() => {
    let temarr = [];
    for (
      let step = 1;
      step < (props?.item?.location?.locName?.length ?? 15) / 15;
      step++
    ) {
      temarr.push(step);
    }
    setdotArr(temarr);
  }, []);
  return (
    <div
      className='sos-items'
      style={{paddingBottom: '12px', marginBottom: '12px'}}
    >
      <ListItem
        sx={{
          padding: '8px 20px',
        }}
        className='item-hover sos-items'
      >
        <ListItemAvatar
          sx={{
            minWidth: 0,
            mr: 4,
          }}
        >
          <div style={{width: '40px'}}>
            <img
              className='sos-title-image-back'
              src={'/assets/images/vaccinated_fully.png'}
            />
            <img
              className='sos-title-image-up'
              src={Api.imgUrl + props?.item?.photo}
            />
            {/* <Avatar
                        sx={{
                            width: 54,
                            height: 54,
                        }}
                        alt='Remy Sharp'
                        src={'/assets/images/vaccinated_fully.png'}
                        // src={item.image}
                    >
                        <img style={{
                            width: 48,
                            height: 48,
                            zIndex:'2000'
                        }} src={item.image}>
                            
                        </img>
                    </Avatar> */}
          </div>
        </ListItemAvatar>
        <div className='sos-right-section' style={{width: '100%'}}>
          <div className='sos-title-container'>
            <div className='sos-title-image'>
              {props?.item?.gender?.toLowerCase() == 'female' ? (
                <img src='/assets/images/female_icon.png' />
              ) : (
                <img src='/assets/images/male_icon.png' />
              )}
            </div>
            <div className='sos-title-text'>
              <h4 className='sos-header'>{props?.item?.name}</h4>
            </div>
          </div>

          {props?.item?.sosRaisedBy == 'EMPLOYEE' && (
            <div className='sos-right-title-container'>
              <PersonIcon style={{color: 'white', fontSize: '18px'}} />
            </div>
          )}
          {props?.item?.sosRaisedBy == 'DRIVER' && (
            <div className='sos-right-title-container'>
              {/* <PersonIcon style={{color: 'white', fontSize: '18px'}} /> */}
              <img className='sidebar-icon' src={'/assets/images/driver.svg'} />
            </div>
          )}

          {/* style={{color: '#ff9800'}} */}
          {props?.item?.tripType == 'DOWNTRIP' ? (
            <div
              onClick={() => {
                navigate(
                  '/route-lists/' +
                    window.btoa(
                      props?.item?.tripId +
                        '==>>' +
                        props?.item?.tripDate +
                        '==>>' +
                        props?.item?.tripType,
                    ),
                );
              }}
              className='sos-sub-header'
            >
              <img
                src='/assets/images/logout_icon.png'
                style={{height: '18px', margin: '3px 2px -2px 0px'}}
              />{' '}
              {props?.item?.tripCode}{' '}
            </div>
          ) : (
            <div
              onClick={() => {
                navigate(
                  '/route-lists/' +
                    window.btoa(
                      props?.item?.tripId +
                        '==>>' +
                        props?.item?.tripDate +
                        '==>>' +
                        props?.item?.tripType,
                    ),
                );
              }}
              className='sos-sub-header'
            >
              <img
                src='/assets/images/login_icon.png'
                style={{height: '18px', margin: '3px 2px -2px 0px'}}
              />{' '}
              {props?.item?.tripCode}{' '}
            </div>
          )}
        </div>
      </ListItem>
      <div className='sos-sub-header2'>
        <CallIcon className='sos-sub-header-icons' />{' '}
        {props?.item?.mobileNo + ' / ' + props?.item?.emailId}
        {/* <BloodtypeIcon style={{marginLeft:'12px', color:'#C70039', fontSize: '16px'}}/> B+ */}
      </div>
      <Box sx={{flexGrow: 1}}>
        <Grid container>
          <Grid item xs={2}>
            <div className='sos-dotWrapper'>
              <div className='sos-green-dotted-icon'>
                <FiberManualRecordIcon
                  style={{color: 'green', fontSize: '15px'}}
                />
              </div>
              <FiberManualRecordIcon className='sos-grey-icon' />
              {dotArr?.map((res) => {
                return (
                  <div className='sos-grey-dotted-icon'>
                    <FiberManualRecordIcon className='sos-grey-icon' />
                  </div>
                );
              })}
            </div>
          </Grid>
          <Grid item xs={10}>
            <div className='sos-from-address'>
              {props?.item?.location?.locName}
            </div>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={2}>
            <div className='sos-dotWrapper'>
              <div className='sos-orange-dotted-icon'>
                <FiberManualRecordIcon
                  style={{color: '#ff9700', fontSize: '15px'}}
                />
              </div>
            </div>
          </Grid>
          <Grid item xs={10}>
            <div className='sos-to-address'>
              {props?.item?.officeLocation?.locName}
            </div>
          </Grid>
        </Grid>
      </Box>
      <div className='sos-bottom-container'>
        <span className='sos-bottom-container-person'>
          <PersonIcon style={{fontSize: '20px', margin: '-2px 6px'}} />{' '}
          {props?.item?.noOfPassengerInTrip}{' '}
        </span>
        <span className='sos-bottom-container-person'>
          <img
            style={{height: '15px', marginRight: '4px'}}
            src='/assets/images/escort-black.svg'
          />
          {/* {props?.isFemale ? (
            <img src='/assets/images/right.png' style={{height: '18px'}} />
          ) : (
            <img
              src='/assets/images/notavailable_icon.png'
              style={{height: '13px', marginTop: '3px'}}
            />
          )} */}
          {props?.item?.escortTrip?.toLowerCase() == 'yes' ? (
            <img src='/assets/images/right.png' style={{height: '18px'}} />
          ) : (
            <img
              src='/assets/images/notavailable_icon.png'
              style={{height: '13px', marginTop: '3px'}}
            />
          )}
        </span>
        <span className='sos-bottom-container-person'>
          <LocationOnIcon style={{fontSize: '16px'}} />
        </span>
        {props?.item?.tripCategory?.toUpperCase() == 'REGTRIP' ? (
          <span className='sos-bottom-container-person'>
            {/* <span className='sos-adhoc-button'></span> */}
          </span>
        ) : (
          <span className='sos-bottom-container-person'>
            <span className='sos-adhoc-button'>Adhoc</span>
          </span>
        )}
      </div>
      <div style={{padding: '12px 5px 5px 35px', color: '#919191'}}>
        {props?.item?.tripDate &&
          moment(props?.item?.tripDate).format('dddd, MMMM Do YYYY') +
            '  ' +
            moment(props?.item?.time).format('HH:mm')}
        <EditNotificationsIcon
          onClick={() => {
            notificationClicked();
          }}
          style={{
            position: 'absolute',
            right: '17px',
            color: '#aa4251',
            fontSize: '18px',
            cursor: 'pointer',
          }}
        />
      </div>
    </div>
  );
};
export default SOS;

SOS.propTypes = {
  item: PropTypes.object.isRequired,
};
