import React from 'react';
import {Typography} from '@mui/material';
// import LinearWithValueLabel from 'pages/home/LinearProgress';
import './style.css';
import LinearWithValueLabel from '../Common Component/LinearProgress/LinearProgress';

function HorizentalBar({total, completed, icon, barColor, title, iconStyle}) {
  return (
    <div
      class='horizental-bar mt-10'
      style={{height: '100%', marginTop: 0, paddingTop: '24px'}}
    >
      <div>
        <div className='hb-container-top'>
          <div style={{maxWidth: '65%'}}>
            <Typography
              variant='h1'
              gutterBottom
              style={{
                fontWeight: 'bold',
                textAlign: 'left',
              }}
            >
              {completed}/{total}
            </Typography>
            <Typography
              variant='h4'
              gutterBottom
              style={{
                fontWeight: 'bold',
                fontSize: '13px',
                color: 'grey',
                textAlign: 'left',
              }}
            >
              {title}
            </Typography>
          </div>
          <div style={{marginLeft: 'auto', width: '35%'}}>
            <div className='hb-icon-con' style={iconStyle}>
              <img src={icon} alt='P' />
            </div>
          </div>
        </div>

        <div className='mt-5'>
          <LinearWithValueLabel
            progressVal={(completed / total) * 100 || 0}
            bgcolor={barColor}
          />
        </div>
      </div>
    </div>
  );
}

export default HorizentalBar;
