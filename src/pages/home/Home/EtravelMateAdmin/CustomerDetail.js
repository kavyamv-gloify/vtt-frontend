import React from 'react';
import {Avatar, Grid, IconButton} from '@mui/material';
import {styled} from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import AppGridContainer from '@crema/core/AppGridContainer';
// import StateCard from '../../../dashboards/Analytics/StateCards';
import StatsCardWithGraph from '../../../dashboards/Metrics/StatsCardWithGraph/index';
import StateCard from '../../../dashboards/Analytics/StateCards';
import {useSelector} from 'react-redux';
import StorefrontIcon from '@mui/icons-material/Storefront';

const CustomerDetail = ({datacount}) => {
  console.log('datacount', datacount);
  const Item = styled(Paper)(({theme}) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));
  const revenueCards = [
    {
      id: 1,
      type: 'Adhoc Trips',
      value: datacount?.tripDetails?.AdhocTrip,
      growth: 0,
      icon: '/assets/images/AdochTrip.svg',
      strokeColor: '#f44d50',
      graphData: [
        {month: 'Aug', number: 310},
        {month: 'Sep', number: 130},
        {month: 'Oct', number: 350},
        {month: 'Nov', number: 170},
        {month: 'Dec', number: 400},
      ],
    },
    {
      id: 2,
      type: 'Regular Trips',
      value: datacount?.tripDetails?.RegularTrip,
      growth: 1.2,
      icon: '/assets/images/RegularTrip.svg',
      strokeColor: '#f49820',
      graphData: [
        {month: 'Jan', number: 20},
        {month: 'Feb', number: 170},
        {month: 'Mar', number: 40},
        {month: 'Apr', number: 200},
        {month: 'May', number: 70},
      ],
    },
  ];

  const entities = [
    // { image: "/assets/images/mail.png", title: "Drivers", value: "12" },
    {
      image: '/assets/images/site-office.svg',
      title: 'Corporates',
      styles: {height: 40, width: 40},
      value: datacount?.pendingMap?.totalCorporate,
    },
    {
      image: '/assets/images/Vendors.svg',
      title: 'Vendors',
      styles: {height: 30, width: 30},
      value: datacount?.pendingMap?.TotalVendor,
    },
    {
      image: '/assets/images/Vehicle.svg',
      title: 'Vehicles',
      styles: {height: 30, width: 30},
      value: datacount?.pendingMap?.TotalVehicle,
    },
  ];

  const data = [
    {
      data: {
        value: '50',
        graphData: [
          {name: 'revenue ', traffic: '50'},
          {name: 'revenue ', traffic: '40'},
          {name: 'revenue ', traffic: '30'},
          {name: 'revenue ', traffic: '70'},
          {name: 'revenue ', traffic: '60'},
          {name: 'revenue ', traffic: '90'},
        ],
      },
    },
  ];
  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={12} md={12} sm={12} sx={{mb: 2}}>
          <Grid
            container
            sx={{
              background: 'white',
              borderRadius: '10px',
              boxShadow: '0px 4px 8px 0px rgba(0, 0, 0, 0.08)',
            }}
          >
            <Grid item md={9} sm={6} xs={12}>
              <Grid container>
                <Grid
                  item
                  md={8}
                  sm={6}
                  xs={12}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '90px',
                    padding: '20px ',
                  }}
                >
                  <h4 style={{opacity: '0.5'}}>Welcome</h4>
                  <h2>Customer Details</h2>
                </Grid>
                <Grid
                  item
                  md={4}
                  sm={6}
                  xs={4}
                  sx={{
                    height: '90px',
                    padding: '20px 0px 20px 10px',
                    display: 'flex',
                  }}
                >
                  <IconButton
                    sx={{
                      height: 55,
                      width: 55,
                      p: 0,
                      // mr: 4,
                      backgroundColor: '#e9e9e9',
                    }}
                  >
                    <img
                      alt='icon'
                      style={{height: 30, width: 30}}
                      src={'/assets/images/Drivers.svg'}
                    />
                    {/* <StorefrontIcon fontSize='small' /> */}
                  </IconButton>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      marginLeft: '10px',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '20px',
                        color: 'black',
                        fontWeight: '500',
                      }}
                    >
                      {datacount?.pendingMap?.TotalDriver}
                    </p>
                    <p style={{fontSize: '12px', color: 'grey'}}>Drivers</p>
                  </div>
                </Grid>
                {entities?.map((el) => {
                  return (
                    <Grid
                      item
                      md={4}
                      sm={6}
                      xs={4}
                      sx={{
                        height: '90px',
                        padding: '20px 0px 20px 10px',
                        display: 'flex',
                      }}
                    >
                      {/* <div
                        style={{
                          width: '55px',
                          height: '55px',
                          aspectRatio: '1 / 1',
                          borderRadius: '92px',
                          background: '#e6f4fb',
                        }}
                      ></div> */}
                      {/* <Avatar
                        src={<StorefrontIcon fontSize='small' />}
                        alt='Avatar Image'
                        sx={{
                          width: '55px',
                          height: '55px',
                          aspectRatio: '1 / 1',
                          borderRadius: '50%', // Adjust the borderRadius based on your design
                        }}
                      /> */}
                      <IconButton
                        sx={{
                          height: 55,
                          width: 55,
                          p: 0,
                          // mr: 4,
                          backgroundColor: '#e9e9e9',
                        }}
                      >
                        <img alt='icon' style={el?.styles} src={el?.image} />
                        {/* <StorefrontIcon fontSize='small' /> */}
                      </IconButton>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          marginLeft: '10px',
                        }}
                      >
                        <p
                          style={{
                            fontSize: '20px',
                            color: 'black',
                            fontWeight: '500',
                          }}
                        >
                          {el?.value}
                        </p>
                        <p style={{fontSize: '12px', color: 'grey'}}>
                          {el?.title}
                        </p>
                      </div>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <img
                src='/assets/images/image 11.png'
                style={{height: '180px'}}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6} sm={12}>
          <StateCard data={revenueCards[0]} />
        </Grid>
        <Grid item xs={12} md={6} sm={12}>
          <StateCard data={revenueCards[1]} />
        </Grid>
      </Grid>
    </>
  );
};

export default CustomerDetail;
