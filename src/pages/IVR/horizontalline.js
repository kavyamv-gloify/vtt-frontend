import React from 'react';
import {Typography} from '@mui/material';
import LinearWithValueLabel from 'pages/home/Home/Common Component/LinearProgress/LinearProgress.js';
import 'pages/home/Home/CorporateAdmin/style.css';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

function HorizentalBar({
  total,
  completed,
  icon,
  barColor,
  title,
  iconStyle,
  time,
}) {
  return (
    <div class='horizental-bar mt-10'>
      <div>
        <div className='hb-container-top'>
          <div>
            <Typography
              variant='h1'
              gutterBottom
              style={{
                fontWeight: 'bold',
                textAlign: 'left',
              }}
            >
              {completed}
            </Typography>
            <Typography
              variant='h3'
              gutterBottom
              style={{
                fontWeight: 'bold',
                color: 'grey',
                textAlign: 'left',
              }}
            >
              {title}
            </Typography>
            {time && (
              <Typography
                gutterBottom
                style={{
                  fontWeight: 'bold',
                  fontSize: '12px',
                  color: 'grey',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <AccessTimeIcon
                  style={{fontSize: '12px', marginRight: '5px'}}
                />
                <span>{time}</span>
              </Typography>
            )}
          </div>
          <div style={{marginLeft: 'auto'}}>
            <div className='hb-icon-con' style={iconStyle}>
              <img src={icon} alt='P' />
            </div>
          </div>
        </div>

        <div className='mt-20'>
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
