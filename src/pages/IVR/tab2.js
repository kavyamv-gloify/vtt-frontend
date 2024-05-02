import React, {useEffect, useState} from 'react';
import {Box, Grid, Tab, Tabs} from '@mui/material';
import HorizentalBar from './horizontalline';
import Graph from './Graphs';
import './style.css';
import axios from 'axios';
import Api from '@api';
import {useAuthUser} from '@crema/utility/AuthHooks';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {useNavigate} from 'react-router-dom';
const Tab2 = ({dateRange}) => {
  const [value, setValue] = React.useState('ALL');
  const [MyData, setMyData] = React.useState({});
  const {user} = useAuthUser();
  const navigate = useNavigate();
  useEffect(() => {
    if (!dateRange?.fromDate || !dateRange?.toDate) {
      setMyData({...{}});
      return;
    }
    axios
      .get(
        Api.baseUri +
          `/usernotify/notification/smsDataByCorporateId/${user?.userList?.corporateId}/${dateRange?.fromDate}/${dateRange?.toDate}`,
      )
      .then((res) => {
        setMyData(res?.data);
      })
      .catch((err) => {});
  }, [dateRange]);
  return (
    <div
      style={{
        padding: '10px',
        background: 'white',
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
      }}
    >
      <Box sx={{width: '100%', marginTop: '10px'}}>
        <Grid container rowSpacing={2} columnSpacing={{xs: 4}}>
          <Grid item xs={12} sm={2} md={2}>
            <div className='card-with-icon'>
              <div className='cwi-bg'>
                <img src='/assets/images/ivricon.png' alt='P' />
              </div>
              <div className='cwi-title'>
                <p style={{fontSize: '18px'}}>{MyData?.TOTAL || 0}</p>
                <p style={{fontSize: '18px'}}>Total SMS</p>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={10} md={10}>
            <div className='card-normal' style={{minHeight: '210px'}}>
              <div className='card-title'>SMS</div>
              <Box sx={{width: '100%'}}>
                <Grid container rowSpacing={0} columnSpacing={{xs: 0}}>
                  <Grid item xs={12} sm={4} md={4}>
                    <HorizentalBar
                      total={MyData?.TOTAL || 0}
                      completed={MyData?.DELIVERED || 0}
                      icon='/assets/images/travelling.png'
                      barColor='#049f60'
                      title='Delivered'
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} md={4}>
                    <HorizentalBar
                      total={MyData?.TOTAL || 0}
                      completed={MyData?.FAILED || 0}
                      icon='/assets/images/travelling.png'
                      barColor='#fd9b01'
                      title='Undelivered'
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} md={4}>
                    <HorizentalBar
                      total={MyData?.TOTAL || 0}
                      completed={MyData?.PENDING || 0}
                      icon='/assets/images/travelling.png'
                      barColor='#05653f'
                      title='Waiting for delivery'
                    />
                  </Grid>
                </Grid>
              </Box>
            </div>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{width: '100%', mt: 8}}>
        <div
          style={{
            border: '1px solid #dddddd',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: '10px',
            fontWeight: 600,
          }}
        >
          <div style={{marginRight: '10px'}}>Total SMS Stats</div>
          <Tabs
            value={value}
            onChange={(e, v) => {
              setValue(v);
            }}
            TabIndicatorProps={{
              style: {background: 'orange'},
            }}
          >
            <Tab value='ALL' label='Overview' />
            <Tab value='DELIVERED' label='Delivered' />
            <Tab value='FAILED' label='Undelivered' />
            <Tab value='PENDING' label='Pending' />
          </Tabs>
        </div>
        <div
          style={{
            border: '1px solid #dddddd',
            background: '#fafafa',
            padding: '15px',
          }}
        >
          <Grid container spacing={2}>
            <Grid item sm={3} md={3}>
              Status
            </Grid>
            <Grid item sm={3} md={3} sx={{textAlign: 'center'}}>
              Count
            </Grid>
            <Grid item sm={3} md={3} sx={{textAlign: 'center'}}>
              Total (%)
            </Grid>
            <Grid item sm={3} md={3} sx={{textAlign: 'center'}}>
              Action
            </Grid>
          </Grid>
        </div>
        {[
          {
            name: 'Delivered',
            count: MyData?.DELIVERED || 0,
            total: MyData?.TOTAL || 0,
            color: 'rgb(4 159 96)',
            status: 'DELIVERED',
          },
          {
            name: 'Undelivered',
            count: MyData?.FAILED || 0,
            total: MyData?.TOTAL || 0,
            color: '#fe6460',
            status: 'FAILED',
          },
          {
            name: 'Waiting for Delivery',
            count: MyData?.PENDING || 0,
            total: MyData?.TOTAL || 0,
            color: 'rgb(238, 176, 80)',
            status: 'PENDING',
          },
          {
            name: 'Total',
            count: MyData?.TOTAL || 0,
            total: MyData?.TOTAL || 0,
            status: 'null',
          },
        ]?.map((el, ind) => {
          if (value != 'ALL' && value != el.status) return; //  && (el.status != 'null')
          return (
            <div
              style={{
                border: '1px solid #dddddd',
                padding: '15px',
                background:
                  ind % 2 == 0
                    ? ''
                    : el.name == 'Total'
                    ? '#f2f2f2'
                    : '#f3f8fc',
              }}
            >
              <Grid container spacing={2}>
                <Grid item sm={3} md={3}>
                  {el.name == 'Total' ? (
                    <span>{el.name}</span>
                  ) : (
                    <span style={{display: 'flex', alignItems: 'center'}}>
                      <span
                        style={{background: el.color}}
                        className='dot'
                      ></span>
                      <span>{el.name}</span>
                    </span>
                  )}
                </Grid>
                <Grid item sm={3} md={3} sx={{textAlign: 'center'}}>
                  {el.count}
                </Grid>
                <Grid item sm={3} md={3} sx={{textAlign: 'center'}}>
                  {el.total ? ((el.count * 100) / el.total)?.toFixed(2) : 0} (%)
                </Grid>
                <Grid item sm={3} md={3} sx={{textAlign: 'center'}}>
                  <VisibilityIcon
                    className='pointer'
                    onClick={() => {
                      navigate(
                        `/IVR/${el.status}/${dateRange?.fromDate}/${dateRange?.toDate}`,
                      );
                    }}
                  />
                </Grid>
              </Grid>
            </div>
          );
        })}
      </Box>
      <Box
        sx={{
          padding: '20px',
          width: '100%',
          mt: 8,
          boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
          borderRadius: '10px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #f8f8f8',
            paddingBottom: '10px',
            marginBottom: '15px',
          }}
        >
          <div style={{fontSize: '18px', fontWeight: 600}}>
            Message Over Time
          </div>
        </div>
        <div style={{background: '#fafafa', padding: '20px', height: '500px'}}>
          <Graph dateRange={dateRange} />
        </div>
      </Box>
    </div>
  );
};

export default Tab2;
