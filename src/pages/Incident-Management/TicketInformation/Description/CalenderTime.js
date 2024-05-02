import React from 'react';
import {Grid} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
const CalenderTime = () => {
  return (
    <div>
      <Grid container sx={{border: '1px solid #f6f6f6', borderRadius: '10px'}}>
        <Grid
          item
          md={6}
          sx={{borderRight: '1px solid #f6f6f6', padding: '3px'}}
        >
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
                {/* {detail?.trip?.actualTripStartTimeStr.split(' ')[1]} */}
                09:30
              </p>
            </div>
            <div style={{marginTop: '-7px'}}>
              <MoreVertIcon />
            </div>
            <div
              style={{
                color: 'green',
                paddingLeft: '7px',
                display: 'flex',
                flexDirection: 'row',
                marginTop: '-7px',
              }}
            >
              <div>
                <FiberManualRecordIcon sx={{fontSize: '10px'}} />
              </div>
              <p style={{paddingLeft: '20px', color: 'grey'}}>
                {/* {detail?.trip?.actualTripCompletionTimeStr.split(' ')[1]} */}
                10:30
              </p>
            </div>
          </div>
        </Grid>
        <Grid
          item
          md={6}
          sx={{borderRight: '1px solid #f6f6f6', padding: '3px'}}
        >
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
                {/* {detail?.trip?.actualTripStartTimeStr.split(' ')[1]} */}
                09:06
              </p>
            </div>
            <div style={{marginTop: '-7px'}}>
              <MoreVertIcon />
            </div>
            <div
              style={{
                color: 'green',
                paddingLeft: '7px',
                display: 'flex',
                flexDirection: 'row',
                marginTop: '-7px',
              }}
            >
              <div>
                <FiberManualRecordIcon sx={{fontSize: '10px'}} />
              </div>
              <p style={{paddingLeft: '20px', color: 'grey'}}>
                {/* {detail?.trip?.actualTripCompletionTimeStr.split(' ')[1]} */}
                08:30
              </p>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default CalenderTime;
