import React, {useState} from 'react';
import {Button} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import WbTwilightIcon from '@mui/icons-material/WbTwilight';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import {pink} from '@mui/material/colors';
import Checkbox from '@mui/material/Checkbox';
import RouteIcon from '@mui/icons-material/Route';
import moment from 'moment';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import LightModeIcon from '@mui/icons-material/LightMode';
import 'pages/home/Home/CorporateAdmin/style.css';
const label = {inputProps: {'aria-label': 'Checkbox demo'}};
const CarouselCard = ({
  tripTime,
  shiftName,
  data,
  tripDate,
  tripType,
  tripCategory,
  tripStatus,
  props,
}) => {
  const dates = {
    date: tripDate.split('-')[2],
    month: tripDate.split('-')[1],
  };
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ];
  return (
    <>
      <div className='carousel-card-wrapper'>
        <div className='carousel-card-inner-wrapper'>
          <div className='carousel-card-inner-wrapper-icon-wrapper'>
            {tripType == 'UPTRIP' ? (
              <img
                style={{height: '2em'}}
                src={
                  tripStatus == 'COMPLETED'
                    ? '/assets/images/login_icon.png'
                    : '/assets/images/login_icon.png'
                }
              />
            ) : null}
            {tripType == 'DOWNTRIP' ? (
              <img
                style={{height: '2em'}}
                src={
                  tripStatus == 'COMPLETED'
                    ? '/assets/images/logout_icon.png'
                    : '/assets/images/logout_icon.png'
                }
              />
            ) : null}
          </div>

          {tripStatus == 'STARTED' ? (
            <div className='ring-container'>
              <div className='ringring'></div>
              <div className='circle'>Live</div>
            </div>
          ) : null}
          <div style={{marginLeft: '1em', postion: 'absolute'}}>
            {tripCategory !== 'ADHOCTRIP' ? (
              <h2 style={{fontWeight: 'bold', fontSize: '2.5em'}}>
                {tripTime}
              </h2>
            ) : (
              <h2 style={{fontWeight: 'bold', fontSize: '2.5em'}}>
                {data?.tripTime}
              </h2>
            )}
            {shiftName ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  postion: 'absolute',
                }}
              >
                {Number(tripTime?.split(':')[0]) >= 18 ? (
                  <BedtimeIcon
                    style={{fontSize: '1.4em', fontWeight: 'bold'}}
                  />
                ) : Number(tripTime?.split(':')[0]) >= 12 ? (
                  <LightModeIcon
                    style={{fontSize: '1.4em', fontWeight: 'bold'}}
                  />
                ) : (
                  <WbTwilightIcon
                    style={{fontSize: '1.4em', fontWeight: 'bold'}}
                  />
                )}
                <h4
                  style={{
                    fontWeight: 'bold',
                    fontWeight: 'bold',
                    width: '100px',
                    overflow: 'hidden',
                    paddingLeft: '10px',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tripCategory == 'ADHOCTRIP' ? 'Adhoc' : shiftName}{' '}
                  {tripCategory == 'ADHOCTRIP' && (
                    <img
                      src='/assets/images/Adhoc.svg'
                      style={{height: '10px'}}
                    />
                  )}
                </h4>
                {/* {tripCategory == 'ADHOCTRIP' && (
                  <img
                    src='/assets/images/Adhoc.svg'
                    style={{height: '10px'}}
                  />
                )} */}
              </div>
            ) : null}
          </div>
        </div>
        <div
          variant='contained'
          className='carousel-card-bottom-section'
          style={{
            background:
              tripStatus == 'COMPLETED'
                ? '#d2d2d2'
                : tripType == 'DOWNTRIP'
                ? '#feac4e'
                : 'rgb(30 140 186)',
          }}
        >
          <span className='carousel-card-bottom-section-label'>
            {' '}
            {dates?.date + '  ' + months[Number(dates?.month) - 1]}
          </span>
        </div>
      </div>
    </>
  );
};

export default CarouselCard;
