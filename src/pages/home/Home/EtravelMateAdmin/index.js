import React, {useEffect, useState} from 'react';
import CustomerDetail from './CustomerDetail';
import {Grid, TextField} from '@mui/material';
import CustomerCount from './CustomerCount';
import Paper from '@mui/material/Paper';
import Stats from './Stats';
import {styled} from '@mui/material/styles';
import TripAnalaytics from './TripAnalaytics';
import EmployeeTravelling from './EmployeeTravelling';
import Notifications from './Notification';
import TopCustomers from './TopCustomers';
import LatestTrip from './LatestTrip';
import LatestIncident from './LatestIncident';
import IvrsData from './IvrsData';
import ActiveUser from './ActiveUser';
import AppFeedback from './AppFeedback';
import _ from 'lodash';
import FleetMix from './fleet';
import Api from '@api';
import axios from 'axios';
import {useForm} from 'react-hook-form';
import moment from 'moment';
const fleetData = [
  {
    label: 'key',
    value: 3,
    color: 'red',
    seats: 5,
  },
];
const EtravelMateAdmin = () => {
  const [data, setData] = useState();
  const [transError, setTransError] = useState({});
  const [stats, setStats] = useState([]);

  const [formDates, setFormDates] = useState({
    trxFromDate: `${moment().format('YYYY-MM-DD')}`,
    trxToDate: `${moment().format('YYYY-MM-DD')}`,
  });

  console.log('formDates', formDates);
  const handleFromDateChange = (event) => {
    const fromDate = event.target.value;
    // setTrxFromDate(fromDate);
    setFormDates((prevDates) => ({
      ...prevDates,
      trxFromDate: fromDate,
    }));

    // Validate and set error
    if (
      formDates?.trxToDate &&
      new Date(fromDate) > new Date(formDates?.trxToDate)
    ) {
      setTransError({trans_error: true});
    } else {
      setTransError({});
    }
  };

  const handleToDateChange = (event) => {
    const toDate = event.target.value;
    // setTrxToDate(toDate);
    setFormDates((prevDates) => ({
      ...prevDates,
      trxToDate: toDate,
    }));

    // Validate and set error
    if (
      formDates?.trxFromDate &&
      new Date(toDate) < new Date(formDates?.trxFromDate)
    ) {
      setTransError({trans_error: true});
    } else {
      setTransError({});
    }
  };
  const Item = styled(Paper)(({theme}) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  useEffect(() => {
    if (formDates.trxFromDate && formDates.trxToDate)
      axios
        .get(
          Api.baseUri +
            `/user-reg/corporate-reg/getAllData/${formDates.trxFromDate}/${formDates.trxToDate}`,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            console.log('res', res?.data?.data);
            setData(res?.data?.data);
            const tripDetails = res?.data?.data?.tripDetails;

            // Create stats array based on tripDetails
            const newStats = [
              {
                title: 'Ongoing Trips',
                color: '#00A2FF',
                adocCount: tripDetails?.adhocStartedTrip || 0,
                regularCount: tripDetails?.regularStartedTrip || 0,
              },
              {
                title: 'Completed Trips',
                color: '#B745FF',
                adocCount: tripDetails?.adhocCompletedTrip || 0,
                regularCount: tripDetails?.regularCompletedTrip || 0,
              },
              {
                title: 'Scheduled trips',
                color: '#F49820',
                adocCount: tripDetails?.adhocScheduleTrip || 0,
                regularCount: tripDetails?.regularScheduleTrip || 0,
              },
              {
                title: 'Cancelled Trips',
                color: '#F04F47',
                adocCount: tripDetails?.adhocCancelledTrip || 0,
                regularCount: tripDetails?.regularCancelledTrip || 0,
              },
              {
                title: 'Absent Trips',
                color: '#00A2FF',
                adocCount: tripDetails?.adhocAbsentTrip || 0,
                regularCount: tripDetails?.regularAbsentTrip || 0,
              },
            ];

            setStats(newStats);
          }
        })
        .catch((err) => {
          console.log('err');
        });
  }, [formDates]);

  return (
    <>
      <div
        style={{display: 'flex', justifyContent: 'flex-end', marginTop: '5px'}}
      >
        <div style={{marginRight: '8px'}}>
          <TextField
            type='date'
            InputProps={{disableUnderline: true}}
            InputLabelProps={{shrink: true}}
            value={formDates?.trxFromDate}
            onChange={handleFromDateChange}
            label='From Date'
            size='small'
          />
          <div style={{color: 'red', fontSize: '12px', marginTop: '4px'}}>
            {transError?.trans_error && 'Not Valid!'}
          </div>
        </div>
        <div>
          <TextField
            type='date'
            InputProps={{disableUnderline: true}}
            InputLabelProps={{shrink: true}}
            value={formDates?.trxToDate}
            onChange={handleToDateChange}
            label='To Date'
            size='small'
          />
          <div style={{color: 'red', fontSize: '12px', marginTop: '4px'}}>
            {transError?.trans_error && 'Not Valid!'}
          </div>
        </div>
      </div>
      <Grid container sx={{padding: '0px'}}>
        <Grid item xs={12} sm={12} md={12}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6} sm={12}>
              <CustomerDetail datacount={data} />
            </Grid>
            <Grid item xs={12} md={6} sm={12}>
              <CustomerCount data={data} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Stats stats={stats} />
        </Grid>
        <Grid item xs={12} sm={12} md={12} sx={{marginTop: '10px'}}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} sm={12}>
              <TripAnalaytics />
            </Grid>
            <Grid item xs={6} sm={6} md={3}>
              <ActiveUser />
            </Grid>
            <Grid item xs={6} sm={6} md={3}>
              <EmployeeTravelling />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12} sm={12}>
              <IvrsData />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={8} sm={12}>
              <TopCustomers formDates={formDates} />
            </Grid>
            <Grid item xs={12} md={4} sm={12}>
              <AppFeedback />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={12} md={12}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={4} sm={6}>
              <LatestIncident  />
            </Grid>
            <Grid item xs={12} md={8} sm={6}>
              <LatestTrip  data ={data?.activeTripList}/>
            </Grid>
            {/* <Grid item xs={12} md={4} sm={6}>
              <Notifications />
            </Grid> */}
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={12}></Grid>
      </Grid>
      <div style={{paddingTop: '30px'}}>
        {fleetData?.length &&
        !(
          fleetData?.length == 1 &&
          fleetData[0]?.label == 'NA' &&
          _.isNaN(fleetData[0]?.seats)
        ) ? (
          <FleetMix title='Fleet Mix' data={fleetData} />
        ) : null}
      </div>
    </>
  );
};

export default EtravelMateAdmin;
