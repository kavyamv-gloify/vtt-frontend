import React from 'react';
import {Button} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import WbTwilightIcon from '@mui/icons-material/WbTwilight';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import {pink} from '@mui/material/colors';
import Checkbox from '@mui/material/Checkbox';
import RouteIcon from '@mui/icons-material/Route';
import AddIcon from '@mui/icons-material/Add';
import {useNavigate} from 'react-router-dom';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import LightModeIcon from '@mui/icons-material/LightMode';
const label = {inputProps: {'aria-label': 'Checkbox demo'}};
const CarouselCard = (props) => {
  const navigate = useNavigate();
  // getSelected
  return (
    <>
      <div className='carousel-card-wrapper'>
        {props.name != 'NEW' ? (
          <>
            {' '}
            <div className='carousel-card-inner-wrapper'>
              <div className='carousel-card-inner-wrapper-icon-wrapper'>
                {props?.tripType == 'UPTRIP' ? (
                  <img
                    style={{height: '2em'}}
                    src={
                      props?.tripStatus == 'COMPLETED'
                        ? '/assets/images/login_icon.png'
                        : '/assets/images/login_icon.png'
                    }
                  />
                ) : null}
                {props?.tripType == 'DOWNTRIP' ? (
                  <img
                    style={{height: '2em'}}
                    src={
                      props?.tripStatus == 'COMPLETED'
                        ? '/assets/images/logout_icon.png'
                        : '/assets/images/logout_icon.png'
                    }
                  />
                ) : null}
              </div>

              {props?.tripStatus == 'STARTED' ? (
                <div className='ring-container'>
                  <div className='ringring'></div>
                  <div className='circle'>Live</div>
                </div>
              ) : null}
              {/* <PersonIcon style={{ fontSize: '5em', color: props.color }} /> */}
              <div style={{marginLeft: '1em', postion: 'absolute'}}>
                <h2 style={{fontWeight: 'bold', fontSize: '2.5em'}}>
                  {props?.tripTime || 'rsdf'}
                </h2>
                {props?.shiftName ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      postion: 'absolute',
                    }}
                  >
                    {Number(props?.tripTime?.split(':')[0]) >= 18 ? (
                      <BedtimeIcon
                        style={{fontSize: '1.4em', fontWeight: 'bold'}}
                      />
                    ) : Number(props?.tripTime?.split(':')[0]) >= 12 ? (
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
                      {props?.shiftName}
                    </h4>
                    {props?.tripCategory == 'ADHOCTRIP' && (
                      <img
                        src='/assets/images/Adhoc.svg'
                        style={{height: '10px'}}
                      />
                    )}
                  </div>
                ) : null}
              </div>
            </div>
            <div
              variant='contained'
              className='carousel-card-bottom-section'
              style={{
                background:
                  props?.tripStatus == 'COMPLETED'
                    ? '#d2d2d2'
                    : props?.tripType == 'DOWNTRIP'
                    ? '#feac4e'
                    : 'rgb(30 140 186)',
              }}
            >
              <span className='carousel-card-bottom-section-label'>
                {props.name}
              </span>
            </div>
          </>
        ) : (
          <div
            className='add-new-roster-section'
            onClick={() => {
              if (props?.name == 'NEW') navigate('/rosters/roster-page');
            }}
          >
            <div>
              <AddIcon style={{fontSize: '36px'}} />
              <div className='carousel-new-subtitle'>Create Roster</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CarouselCard;
