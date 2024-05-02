import React, {useEffect, useState} from 'react';
import AppCard from '@crema/core/AppCard';
import AppList from '@crema/core/AppList';
import {Box} from '@mui/material';
import {Fonts} from 'shared/constants/AppEnums';
//import {timeFromNow} from '@crema/utility/utils';
import AppLoader from '@crema/core/AppLoader';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {useIntl} from 'react-intl';
import PropTypes from 'prop-types';
import SmartForm from '@smart-form';
import NoDataFound from '@common/NoDataFound';

import {
  Avatar,
  Divider,
  Grid,
  ListItem,
  ListItemAvatar,
  Pagination,
  Typography,
} from '@mui/material';
import Api from '@api';
import axios from 'axios';
import moment from 'moment';

const NotificationItem = ({notification}) => {
  const [value, setValue] = useState();
  console.log('notification', notification);
  const onValue = () => {
    switch (value) {
      case 'Route List':
        return '/assets/images/Routes.svg';
      case 'Leave':
        return '/assets/images/Leave.svg';
      case 'Roster':
        return '/assets/images/Roster.svg';
      default:
        return '/assets/images/notification.png';
    }
  };

  useEffect(() => {
    setValue(notification?.moduleName);
  }, [notification]);

  return (
    <>
      <ListItem
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px 20px',
        }}
        className='item-hover'
      >
        <Box sx={{width: '100%'}}>
          <Grid container>
            <Grid item md={1}>
              <ListItemAvatar
                sx={{
                  minWidth: 0,
                  marginRight: 4,
                }}
              >
                <img
                  // style={{
                  //   width: '60%',
                  //   height: '25%',
                  // }}
                  alt='User Avatar'
                  src={onValue()}
                />
              </ListItemAvatar>
            </Grid>
            <Grid item md={11}>
              <Box
                sx={{
                  fontSize: 14,
                  color: (theme) => theme.palette.text.secondary,
                }}
              >
                <Typography>
                  <Box
                    component='span'
                    sx={{
                      fontSize: 14,
                      fontWeight: 'medium',
                      marginBottom: 0.5,
                      color: (theme) => theme.palette.text.primary,
                      marginRight: 1,
                      display: 'inline-block',
                    }}
                  >
                    {notification.name}
                  </Box>
                  {notification?.message}
                </Typography>
                <Typography
                  variant='caption'
                  sx={{
                    fontSize: 12,
                    color: (theme) => theme.palette.text.secondary,
                    marginTop: 1,
                  }}
                >
                  {/* {notification.time} */}
                  {moment(notification?.time).format('MMMM Do YYYY, h:mm a')}
                  {/* Assuming you have a 'time' property in your notification object */}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </ListItem>
      <Divider />
    </>
  );
};

NotificationItem.propTypes = {
  notification: PropTypes.object,
};

const Notifications = () => {
  const {user} = useAuthUser();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setformData] = useState({});
  const [filterOptions, setFilterOptions] = useState({});

  const [pagination, setPagination] = useState({
    page: 0,
    itemsPerPage: 20,
  });

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        Api.baseUri + '/usernotify/notify/getAllNotificationByRoleWise',
        {
          fromDate:
            filterOptions?.fromDate || moment(new Date()).format('YYYY-MM-DD'),
          toDate:
            filterOptions?.toDate || moment(new Date()).format('YYYY-MM-DD'),
          profileId: user?.userList?.profileId,
          userRole: user?.role === 'CORPORATEADMIN' ? 'CORPORATEADMIN' : null,
          moduleName: filterOptions?.moduleName || '',
          page: pagination.page, // API starts counting from 0
          size: pagination.itemsPerPage,
        },
      );
      setNotifications(response?.data?.data?.body || []); // Ensure notifications is an array
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.uid) fetchNotifications();
  }, [user?.uid, pagination.page, filterOptions]);

  const handleChangePage = (event, newPage) => {
    console.log('New page:', newPage);
    setPagination({...pagination, page: newPage - 1});
  };
  let template = {
    layout: {
      column: 1,
      spacing: 2,
      size: 'small',
      label: 'fixed',
      type: 'flex',
    },
    title: '',
    description: 'Routes',
    sections: [
      {
        layout: {
          column: 4,
          spacing: 2,
          size: 'small',
          label: 'fixed',
          type: 'flex',
        },
        id: 'route_information',
        fields: [
          {
            type: 'date',
            name: 'fromDate',
            id: 'fromDate',
            title: 'From Date',
            size: 'small',
            defaultValue: moment(new Date()).format('YYYY-MM-DD'),
            // min: 'today',
            style: {width: '20%'},
          },
          {
            type: 'date',
            name: 'toDate',
            id: 'toDate',
            title: 'To Date',
            size: 'small',
            defaultValue: moment(new Date()).format('YYYY-MM-DD'),
            // min: 'today',
            style: {width: '20%'},
          },
          {
            // type: 'multiSelect',
            type: 'select',
            name: 'moduleName',
            id: 'moduleName',
            title: 'Module Name',
            defaultValue: '',
            options: [
              // {title: 'Route List', value: 'Route List'},
              {title: 'Roster', value: 'Roster'},
              {title: 'Leave', value: 'Leave'},
              // {title: 'Holiday', value: 'Holiday'},
              {title: 'Announcement', value: 'Announcement'},
            ],
            style: {width: '20%'},
            validationProps: {
              // required: 'This is a mandatory field',
            },
          },
        ],
      },
    ],
  };
  const handleSubmit = async (values) => {
    console.log('values', values);
    if (values?.button?.toUpperCase()?.trim() == 'SEARCH') {
      setFilterOptions({
        fromDate:
          values?.data?.fromDate || moment(new Date()).format('YYYY-MM-DD'),
        toDate: values?.data?.toDate || moment(new Date()).format('YYYY-MM-DD'),
        moduleName: values?.data?.moduleName || '',
      });
    } else {
      setFilterOptions({
        fromDate: moment(new Date()).format('YYYY-MM-DD'),
        toDate: moment(new Date()).format('YYYY-MM-DD'),
        moduleName: '',
      });
    }
  };
  const leftNotifications = notifications?.NotificationList?.slice(0, 10);
  const rightNotifications = notifications?.NotificationList?.slice(10, 20);
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%', // Optional: Set the height to fill the viewport
  };
  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover', // or 'contain' based on your preference
  };

  return (
    <>
      <Typography variant='h3'>Notifications</Typography>
      <hr
        style={{
          background: 'orange',
          color: 'orange',
          borderColor: 'orange',
          border: '2px solid orange',
          borderRadius: '5px',
          width: '38px',
        }}
      />

      <div className='route-list' style={{disply: 'flex'}}>
        <div className='route-search'>
          <SmartForm
            template={template}
            filterbtnStyle={{
              maxHeight: '36px',
              marginLeft: '5px',
              marginTop: '26px',
              backgroundColor: '#006685',
            }}
            defaultValues={formData}
            onSubmit={handleSubmit}
            fieldsize='SMALL'
            setVal={[
              {name: 'fromDate', value: filterOptions?.fromDate},
              {name: 'toDate', value: filterOptions?.toDate},
              {name: 'moduleName', value: filterOptions?.moduleName},
            ]}
            buttons={['Search', 'Clear']}
          />
        </div>
      </div>

      {/* <AppCard
        sxStyle={{height: '465px', overflowY: 'auto'}}
        // title={'Notifications'}
        contentStyle={{px: 0}}
      >
        <AppList
          animation='transition.slideRightBigIn'
          data={notifications?.NotificationList}
          renderRow={(data, index) => (
            <NotificationItem key={index} notification={data} />
          )}
        />
      </AppCard> */}
      {leftNotifications?.length && !loading ? (
        <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
          {/* Left side */}
          <AppCard sxStyle={{height: '465px', overflowY: 'auto', width: '49%'}}>
            <AppList
              animation='transition.slideRightBigIn'
              data={leftNotifications}
              renderRow={(data, index) => (
                <NotificationItem key={index} notification={data} />
              )}
            />
          </AppCard>

          {/* Right side */}
          <AppCard sxStyle={{height: '465px', overflowY: 'auto', width: '49%'}}>
            {rightNotifications?.length && !loading ? (
              <AppList
                animation='transition.slideRightBigIn'
                data={rightNotifications}
                renderRow={(data, index) => (
                  <NotificationItem key={index} notification={data} />
                )}
              />
            ) : loading ? null : (
              <div style={containerStyle}>
                <img
                  src='/assets/images/noDataFound.avif'
                  alt='No Data Found'
                  style={imageStyle}
                />
              </div>
            )}
          </AppCard>
        </Box>
      ) : loading ? null : (
        <NoDataFound />
      )}
      {notifications?.totalItems > 0 && (
        <Box sx={{display: 'flex', justifyContent: 'center', marginTop: 2}}>
          <Pagination
            count={Math.ceil(
              notifications?.totalItems / pagination.itemsPerPage,
            )}
            page={pagination.page + 1}
            onChange={(event, newPage) => handleChangePage(event, newPage)}
            color='primary'
          />
        </Box>
      )}

      {loading && <AppLoader />}
    </>
  );
};

export default Notifications;

Notifications.propTypes = {
  notifications: PropTypes.array,
};
