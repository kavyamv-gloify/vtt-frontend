import React from 'react';
import WbTwilightIcon from '@mui/icons-material/WbTwilight';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import LightModeIcon from '@mui/icons-material/LightMode';
const ShiftCard = (props) => {
  return (
    <>
      {/* <div
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
            padding: '9px',
          }}
        >
          <img
            style={{width: '22%', height: '22%', marginTop: '16px'}}
            src={
              props.tripType == 'UPTRIP'
                ? '/assets/images/login_icon.png'
                : '/assets/images/logout_icon.png'
            }
            alt='P'
          />
          <div style={{marginLeft: '1em', postion: 'absolute'}}>
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
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              margin: 'auto',
              width: '50%',
            }}
          >
            <span
              style={{marginLeft: '1em', position: 'relative', top: '10px'}}
            >
              {props.tripDate}
            </span>
          </div>
        </div>
      </div> */}
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

              {/* <PersonIcon style={{ fontSize: '5em', color: props.color }} /> */}
              <div style={{marginLeft: '1em', postion: 'absolute'}}>
                {props?.tripCategory !== 'ADHOCTRIP' ? (
                  <h2 style={{fontWeight: 'bold', fontSize: '2.5em'}}>
                    {props?.tripTime}
                  </h2>
                ) : (
                  <h2 style={{fontWeight: 'bold', fontSize: '2.5em'}}>
                    {props?.shiftdata?.tripTime}
                  </h2>
                )}
                {/* <h2 style={{fontWeight: 'bold', fontSize: '2.5em'}}>
                  {props?.tripTime}
                </h2> */}
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
                      {props?.tripCategory == 'ADHOCTRIP'
                        ? 'Adhoc'
                        : props?.shiftName}{' '}
                      {props?.tripCategory == 'ADHOCTRIP' && (
                        <img
                          src='/assets/images/Adhoc.svg'
                          style={{height: '10px'}}
                        />
                      )}
                    </h4>
                  </div>
                ) : null}
              </div>
            </div>
            <div
              variant='contained'
              className=''
              style={{
                display: 'flex',
                alignItems: 'center',
                color: props?.tripStatus == 'COMPLETED' ? '' : 'white',
                justifyContent:
                  props?.tripStatus == 'STARTED' ? 'space-between' : 'center',
                fontWeight: 600,
                padding: '12px',
                background:
                  props?.tripStatus == 'COMPLETED'
                    ? '#d2d2d2'
                    : props?.tripType == 'DOWNTRIP'
                    ? '#feac4e'
                    : 'rgb(30 140 186)',
              }}
            >
              <div>
                <div>{props.name}</div>
              </div>
              <div style={{position: 'relative'}}>
                {props?.tripStatus == 'STARTED' ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div className='ringring'></div>
                    <div className='circle' style={{marginLeft: '4px'}}>
                      Live
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
};

export default ShiftCard;
