import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import ReactSpeedometer from 'react-d3-speedometer';
import {Box} from '@mui/system';
import {Grid} from '@mui/material';
import useResizeObserver from 'use-resize-observer';
import axios from 'axios';
import {useAuthUser} from '@crema/utility/AuthHooks';
import Api from '@api';
// import "./styles.css";

export default function App() {
  const [compliantDrivers, setCompliantDrivers] = useState(0);
  const [compliantVehicles, setCompliantVehicles] = useState(0);
  const {ref, width, height} = useResizeObserver();
  const {user} = useAuthUser();
  useEffect(() => {
    axios
      .get(
        Api.baseUri +
          '/user-reg/vendor-reg/get-All-Driver-By-vendorId/' +
          user?.userList?.profileId,
      )
      .then((res) => {
        setCompliantVehicles(
          (Number(res?.data?.data?.ratingMap?.DriverMetCount || 0) * 100) /
            Number(res?.data?.data?.ratingMap?.TotalDriverCount || 0),
        );
        setCompliantDrivers(
          (Number(res?.data?.data?.ratingMap?.VehicleMetCount || 0) * 100) /
            Number(res?.data?.data?.ratingMap?.TotalVehicleCount || 0),
        );
      })
      .catch((er) => {
        setCompliantVehicles(0);
        setCompliantDrivers(0);
      });
  }, []);
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
            style={{borderRight: '1px solid #eceaea', marginBottom: '-160px'}}
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
                  currentValueText='${value} % Drivers'
                  forceRender={true}
                  value={compliantVehicles?.toFixed(2)}
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
                  currentValueText='${value} % Vehicles'
                  value={compliantDrivers?.toFixed(2)}
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
