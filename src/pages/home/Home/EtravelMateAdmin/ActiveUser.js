import React from 'react';
import BtcVolumeCurrency from '../CorporateAdmin/BTC-chart';
import {Grid} from '@mui/material';
const btcChartData = [
  {
    id: 1001,
    name: 'GBP',
    value: 302,
    color: '#4299E1',
  },
  {
    id: 1002,
    name: 'USD',
    value: 450,
    color: '#E53E3E',
  },
  {
    id: 1003,
    name: 'CNY',
    value: 274,
    color: '#38B2AC',
  },
  {
    id: 1004,
    name: 'EUR',
    value: 218,
    color: '#4C51BF',
  },
];
const ActiveUser = () => {
  return (
    <div className='btc-graph-etravelmate'>
      <Grid container spacing={2} sx={{}}>
        <Grid item xs={12} md={12} sm={12}>
          <h2 className='heading'>Active User</h2>
          <BtcVolumeCurrency data={btcChartData} />
        </Grid>
      </Grid>
    </div>
  );
};

export default ActiveUser;
