// TopCustomers.js

import React, {useEffect, useState} from 'react';
import {Grid, CircularProgress} from '@mui/material';
import RecentPatients from './TopCustomers/index';
import axios from 'axios';
import Api from '@api';

const TopCustomers = ({formDates}) => {
  const [data, setData] = useState([]);
  const [selectedTab, setSelectedTab] = useState('one');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          getApiEndpoint(selectedTab, formDates),
        );
        console.log('responseAPI', response);
        if (response?.data?.status == '200') {
          setData(response?.data?.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedTab, formDates]);

  const getApiEndpoint = (tab, dates) => {
    const fromDate = dates?.trxFromDate || '2023-12-10'; // Default to '2023-12-10' if not provided
    const toDate = dates?.trxToDate || '2023-12-20'; // Default to '2023-12-20' if not provided

    switch (tab) {
      case 'one':
        return `${Api.baseUri}/user-reg/corporate-reg/getTopPerformance/CORPORATEADMIN/${fromDate}/${toDate}`;
      case 'two':
        return `${Api.baseUri}/user-reg/corporate-reg/getTopPerformance/VENDOR/${fromDate}/${toDate}`;
      case 'three':
        return `${Api.baseUri}/user-reg/corporate-reg/getTopPerformance/DRIVER/${fromDate}/${toDate}`;
      default:
        return `${Api.baseUri}/user-reg/corporate-reg/getTopPerformance/CORPORATEADMIN/${fromDate}/${toDate}`;
    }
  };

  return (
    <Grid container spacing={2} sx={{marginTop: '20px'}}>
      <Grid item xs={12} md={12} sm={12}>
        <RecentPatients
          title={'Top Customer'}
          recentPatients={data}
          topHeader={true}
          onTabChange={setSelectedTab}
          loading={loading}
        />
      </Grid>
    </Grid>
  );
};

export default TopCustomers;
