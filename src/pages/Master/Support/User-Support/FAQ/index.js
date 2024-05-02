import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import AccountTabsWrapper from 'pages/account/MyProfile/AccountTabsWrapper';
import Subtopics from './faq';
import AppAnimate from '@crema/core/AppAnimate';
import {Fonts} from 'shared/constants/AppEnums';
import {useParams} from 'react-router-dom';
import {Grid} from '@mui/material';
import TimeToLeaveIcon from '@mui/icons-material/TimeToLeave';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import axios from 'axios';
import Api from '@api';
import moment from 'moment';
const Account = () => {
  const [topicList, settopicList] = React.useState();
  const [pgType, setPgType] = React.useState('');
  const [data, setData] = useState();
  const {id} = useParams();
  useEffect(() => {
    if (!id) return;
    let tid = window.atob(id)?.split('>>')[0];
    setPgType(window.atob(id)?.split('>>')[1]);
    axios
      ?.get(Api?.support?.getFAQsBySubTopic + tid + '/subtopic')
      .then((res) => {
        settopicList(res?.data?.data ?? []);
      })
      .catch((err) => {});
  }, [id]);

  useEffect(() => {}, [pgType]);

  useEffect(() => {
    axios
      .get(Api.baseUri + '/user-reg/trip-driver/employee-trips/past')
      .then((res) => {
        setData(res?.data?.data);
      })
      .catch((err) => {});
  }, []);
  return (
    <>
      {data?.length && pgType && pgType != 'OTHER' ? (
        <>
          <Grid container sx={{padding: '0px 15px 10px 35px'}}>
            <Grid
              item
              xs={12}
              sx={{
                background: 'white',
                padding: '20px',
                boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                marginBottom: '20px',
              }}
            >
              <div
                style={{display: 'flex', flexDirection: 'row', padding: '20px'}}
              >
                <div
                  style={{
                    marginLeft: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <h5 style={{fontWeight: '700'}}>
                    {moment(data[pgType]?.actualPickUpDateTimeStr).format(
                      'llll',
                    )}
                  </h5>
                  <h5>{data[pgType]?.vehicleNumber}</h5>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      marginTop: '10px',
                    }}
                  >
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
                        {data[pgType]?.tripType == 'UPTRIP'
                          ? data[pgType]?.location?.locName
                          : data[pgType]?.officeLocation?.locName}
                      </p>
                    </div>
                    <div>
                      <MoreVertIcon />
                    </div>
                    <div
                      style={{
                        color: 'green',
                        paddingLeft: '7px',
                        display: 'flex',
                        flexDirection: 'row',
                      }}
                    >
                      <div>
                        <FiberManualRecordIcon sx={{fontSize: '10px'}} />
                      </div>
                      <p style={{paddingLeft: '20px', color: 'grey'}}>
                        {data[pgType]?.tripType == 'DOWNTRIP'
                          ? data[pgType]?.officeLocation?.locName
                          : data[pgType]?.location?.locName}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>
        </>
      ) : null}

      <Box
        component='h2'
        variant='h2'
        sx={{
          fontSize: 16,
          color: 'text.primary',
          fontWeight: Fonts.SEMI_BOLD,
          mb: {
            xs: 2,
            lg: 4,
          },
        }}
      ></Box>
      <AppAnimate animation='transition.slideUpIn' delay={200}>
        <AccountTabsWrapper>
          <Box className='account-tabs-content'>
            <Subtopics TabVal={topicList} />
          </Box>
        </AccountTabsWrapper>
      </AppAnimate>
    </>
  );
};

export default Account;
