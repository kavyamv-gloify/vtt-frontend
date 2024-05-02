import React from 'react';
import WbTwilightIcon from '@mui/icons-material/WbTwilight';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import LightModeIcon from '@mui/icons-material/LightMode';
const ShiftCard = (props) => {
  // getSelected
  return (
    <>
      <div
        style={{
          maxWidth: '100%',
          borderRadius: '20px',
          wordBreak: 'break-word',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          boxShadow: '0 8px 16px 0 rgb(0 0 0 / 25%)',
          position: 'relative',
          background: 'white',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            wordBreak: 'break-word',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          {/* <div className='carousel-card-inner-wrapper-icon-wrapper'> */}
          {props?.tripType == 'UPTRIP' ? (
            <img
              style={{height: '35px', marginTop: '20px', marginLeft: '24px'}}
              src={
                props?.tripStatus == 'COMPLETED'
                  ? '/assets/images/login_icon.png'
                  : '/assets/images/login_icon.png'
              }
            />
          ) : null}
          {props?.tripType == 'DOWNTRIP' ? (
            <img
              style={{height: '35px', marginTop: '20px', marginLeft: '24px'}}
              src={
                props?.tripStatus == 'COMPLETED'
                  ? '/assets/images/logout_icon.png'
                  : '/assets/images/logout_icon.png'
              }
            />
          ) : null}
          {/* </div> */}
          <div
            style={{
              marginLeft: '1em',
              postion: 'absolute',
              marginBottom: '5px',
            }}
          >
            <h2 style={{fontWeight: 'bold', fontSize: '2.5em'}}>
              {props.shiftStart}
            </h2>
            <div style={{display: 'flex', postion: 'absolute'}}>
              {Number(props?.shiftStart?.split(':')[0]) >= 18 ? (
                <BedtimeIcon style={{fontSize: '1.4em', fontWeight: 'bold'}} />
              ) : Number(props?.shiftStart?.split(':')[0]) >= 12 ? (
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
                <ImportExportIcon
                  style={{fontSize: '1.4em', fontWeight: 'bold'}}
                />
              )}
            </div>
          </div>
        </div>
        {props?.tripStatus == 'STARTED' ? (
          <div className='ring-container'>
            <div className='ringring'></div>
            <div className='circle'>Live</div>
          </div>
        ) : null}
        <div
          variant='contained'
          style={{
            width: '100%',
            textAlign: 'center',
            color: '#fff',
            fontWeight: '600',
            background: props.background,
            borderRadius: '0px 0px 20px 20px',
            height: '3em',
          }}
        >
          <span style={{marginLeft: '1em', position: 'relative', top: '8px'}}>
            {props.tripDate}
          </span>
        </div>
      </div>
    </>
  );
};

export default ShiftCard;
