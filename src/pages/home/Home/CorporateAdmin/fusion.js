import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import ReactSpeedometer from 'react-d3-speedometer';
import {Box} from '@mui/system';
import {Grid} from '@mui/material';
import useResizeObserver from 'use-resize-observer';

// import "./styles.css";

export default function App({otaCountTrip, otaCountEmp}) {
  const {ref, width, height} = useResizeObserver();

  return (
    <div className='App' style={{marginTop: '16px'}}>
      <Box sx={{flexGrow: 1}}>
        <Grid
          container
          spacing={{xs: 4, md: 4}}
          columns={{xs: 6, sm: 12, md: 12}}
        >
          <Grid
            item
            style={{borderRight: '1px solid #eceaea', marginBottom: '-60px'}}
            xs={12}
            ref={ref}
            sm={6}
            md={6}
            key={'11'}
          >
            {width ? (
              <>
                <ReactSpeedometer
                  minValue={0}
                  maxValue={100}
                  needleHeightRatio={0.75}
                  segments={4}
                  width={width}
                  height={width / 2 + 40}
                  ringWidth={30}
                  needleColor='#2a2a2a'
                  valueTextFontSize='12px'
                  labelFontSize='10px'
                  segmentColors={['#f1726e', '#ffc534', '#63b591', '#0083F9']}
                  currentValueText='${value} % Trips'
                  forceRender={true}
                  value={parseInt(otaCountTrip || 0, 10)}
                />
              </>
            ) : (
              ''
            )}
          </Grid>
          <Grid item xs={12} sm={6} md={6} key={'12'}>
            {width ? (
              <>
                <ReactSpeedometer
                  minValue={0}
                  maxValue={100}
                  needleHeightRatio={0.75}
                  width={width}
                  height={width / 2 + 40}
                  segments={4}
                  labelFontSize='10px'
                  valueTextFontSize='12px'
                  needleColor='#2a2a2a'
                  ringWidth={30}
                  forceRender={true}
                  segmentColors={['#f1726e', '#ffc534', '#63b591', '#0083F9']}
                  currentValueText='${value} % Trips'
                  value={parseInt(otaCountEmp || 0, 10)}
                />
              </>
            ) : (
              ''
            )}
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
