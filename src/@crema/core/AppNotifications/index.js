import React, {useEffect, useState} from 'react';
import {Autocomplete, IconButton, TextField} from '@mui/material';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppNotificationContent from './AppNotificationContent';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SosIcon from '@mui/icons-material/Sos';
import AppTooltip from '../AppTooltip';
import {alpha} from '@mui/material/styles';
import axios from 'axios';
import Api from '@api';
import SocketApp from '../../../@common/socket';
import {useDispatch, useSelector} from 'react-redux';
import {sosClicked} from 'redux/actions';
import {useAuthUser} from '@crema/utility/AuthHooks';
import TimeToLeaveIcon from '@mui/icons-material/TimeToLeave';
import {useNavigate} from 'react-router-dom';
import RoomIcon from '@mui/icons-material/Room';
import Avatar from '@mui/material/Avatar';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const AppNotifications = ({
  drawerPosition,
  tooltipPosition,
  isMenu,
  sxNotificationContentStyle,
}) => {
  const {user} = useAuthUser();
  const [sosList, setsosList] = useState();
  const [isFemale, setIsFemale] = useState(false);
  const clickedSOS = useSelector(({settings}) => settings.clickedSOS);
  const dispatch = useDispatch();
  const [corporateList, setCorporateList] = React.useState([]);
  const [corpVal, setCorpVal] = React.useState();
  const [address, setAddress] = React.useState('');
  const navigate = useNavigate();

  function saveNewCorp(val, img) {
    let postData = {
      authToken: localStorage.getItem('token'),
      userRole: 'CORPORATEADMIN',
      corporateId: val,
      tanentId: user?.userList?.tanentId,
      tanentName: user?.userList?.tanentName,
      tenentCode: user?.userList?.tenentCode,
      isImpersonate: 'TANENT',
    };
    axios
      .post(Api.baseUri + '/userauth/switchUserRoleTest1', postData)
      .then((res) => {
        localStorage.setItem('token', res?.data?.data?.authToken);
        localStorage.setItem('COMPANY_LOGO', img);
        window.location.reload();
      })
      .catch((err) => {});
  }
  React.useEffect(() => {
    if (user?.userList?.corporateId && corporateList?.length) {
      corporateList?.map((el) => {
        if (el.value == user?.userList?.corporateId) {
          setCorpVal(el);
        }
      });
    }
  }, [user, corporateList]);
  React.useEffect(() => {
    const getCorporateAddress = () => {
      axios
        .get(
          Api?.baseUri +
            `/user-reg/corporate-reg/${user?.userList?.corporateId}`,
        )
        .then((res) => {
          setAddress(res?.data?.data);
        })
        .catch((err) => {});
    };

    if (user?.userList?.corporateId) getCorporateAddress();
  }, [user?.userList?.corporateId]);
  React.useEffect(() => {
    if (user?.userList?.tanentId) {
      axios
        .get(
          Api.baseUri +
            '/user-reg/corporate-reg/getCorporateByTanentId/' +
            user?.userList?.tanentId,
        )
        .then((response) => {
          let array = [];
          let array2 = [];
          response?.data?.data?.map((el, ind) => {
            array2.push(el.companyName);
            array.push({
              title:
                el.companyName + (array2?.includes(el.companyName) ? ind : ''),
              title2:
                el.companyName +
                ' - ' +
                el?.companyAddress?.addressName?.split(',')[0] +
                ', ' +
                el?.companyAddress?.addressName?.split(',')[1] +
                ', ' +
                el?.companyAddress?.city,
              value: el?.id,
              imgsrc: Api?.imgUrl + el?.companyRegDoc,
            });
          });
          if (array?.length && !user?.userList?.corporateId)
            saveNewCorp(array[0]?.value, array[0]?.imgsrc);
          setCorporateList(array);
        })
        .catch((err) => {
          setCorporateList([]);
        });
    }
  }, [user?.userList?.tanentId]);

  useEffect(() => {
    getSSOPassengers();
  }, []);

  // const getSSOPassengers = () => {
  //   axios
  //     .get(Api?.baseUri + '/user-reg/trip-route/get-all-sso-passenger')
  //     .then((res) => {
  //       let tem_isFemale = false;
  //       res?.data?.data?.map((el) => {
  //         if (el?.gender?.toUpperCase() == 'FEMALE') {
  //           tem_isFemale = true;
  //         }
  //       });
  //       setIsFemale(tem_isFemale);
  //       setsosList(res?.data?.data);
  //     })
  //     .catch((err) => {});
  // };

  const getSSOPassengers = () => {
    const firstApi = axios.get(
      Api?.baseUri + '/user-reg/trip-route/get-all-sso-passenger',
    );
    const secondApi = axios.get(
      Api?.baseUri + '/user-reg/trip-route/get-all-sos-driver',
    ); // assuming localhost is your host

    axios
      .all([firstApi, secondApi])
      .then(
        axios.spread((res1, res2) => {
          let combinedData = [];
          let tem_isFemale = false;

          res1?.data?.data?.forEach((el) => {
            if (el?.gender?.toUpperCase() === 'FEMALE') {
              tem_isFemale = true;
            }
            combinedData.push(el);
          });

          res2?.data?.data?.forEach((el) => {
            combinedData.push(el);
          });
          combinedData?.sort(
            (a, b) => new Date(b.tripDate) - new Date(a.tripDate),
          );

          setIsFemale(tem_isFemale);
          setsosList(combinedData);
        }),
      )
      .catch((err) => {
        // Handle errors here
        console.error('Error fetching data: ', err);
      });
  };
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'space-between',
        paddingRight: '18px',
        borderRight: '1px solid #dddddd',
      }}
    >
      {(user?.userList?.userRole == 'CORPORATEADMIN' ||
        user?.userList?.userRole == 'VENDOR') && (
        <>
          {/* <div style={{width: 300, height: 40, marginRight: '5px',fontSize:'10px'}}>
            <span >
              {address?.companyAddress?.addressName?.replace('++undefined', '')}
            </span>
          </div> */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              width: 300,
              height: 40,
              marginRight: '2px',
              fontSize: '12px',
              paddingRight: '18px',
              borderRight: '1px solid #dddddd',
              // backgroundColor: '#3498db',
              // borderRadius: '5px',
            }}
          >
            <span style={{padding: '3px'}}>
              <LocationOnIcon />
            </span>
            <div style={{flex: 1, padding: '3px'}}>
              {address?.siteOfficeDto?.location?.locName}
              {/* {address?.companyAddress?.addressName?.replace('++undefined', '')} */}
            </div>
          </div>
          <AppTooltip title='Active Trips' placement={tooltipPosition}>
            <IconButton
              className='icon-btn'
              sx={{
                borderRadius: '50%',
                width: 40,
                height: 40,
                marginLeft: 5,
                color: (theme) => theme.palette.text.secondary,
                backgroundColor: (theme) => theme.palette.background.default,
                border: 1,
                borderColor: 'transparent',
                '&:hover, &:focus': {
                  color: (theme) => theme.palette.text.primary,
                  backgroundColor: (theme) =>
                    alpha(theme.palette.background.default, 0.9),
                  borderColor: (theme) =>
                    alpha(theme.palette.text.secondary, 0.25),
                },
              }}
              onClick={() => {
                navigate('/onboardCorporate/livetrip');
              }}
              size='large'
            >
              <TimeToLeaveIcon />
            </IconButton>
          </AppTooltip>
        </>
      )}

      {(user?.userList?.userRole == 'CORPORATEADMIN' ||
        user?.userList?.userRole == 'VENDOR') && (
        <AppTooltip title='Live Tracking' placement={tooltipPosition}>
          <IconButton
            className='icon-btn'
            sx={{
              borderRadius: '50%',
              width: 40,
              height: 40,
              marginLeft: 5,
              color: (theme) => theme.palette.text.secondary,
              backgroundColor: (theme) => theme.palette.background.default,
              border: 1,
              borderColor: 'transparent',
              '&:hover, &:focus': {
                color: (theme) => theme.palette.text.primary,
                backgroundColor: (theme) =>
                  alpha(theme.palette.background.default, 0.9),
                borderColor: (theme) =>
                  alpha(theme.palette.text.secondary, 0.25),
              },
            }}
            onClick={() => {
              navigate('/test-live-tracking-dashboard/DEFAULT');
            }}
            size='large'
          >
            <RoomIcon />
          </IconButton>
        </AppTooltip>
      )}
      {(user?.userList?.userRole == 'TANENTADMIN' ||
        (user?.userList?.userRole == 'SUPERADMIN' &&
          user?.userList?.isImpersonate == 'TANENT')) &&
        (corporateList?.length > 0 || user?.userList?.tanentId) && (
          <Autocomplete
            id='country-select-demo'
            sx={{width: '250px', marginRight: '15px'}}
            options={corporateList || []}
            value={corpVal || corporateList[0]}
            // multiple
            disableClearable
            limitTags={1}
            autoHighlight
            onChange={(e, v, r) => {
              setCorpVal(v || corporateList[0]);
              if (!v?.value) return;
              saveNewCorp(v.value, v?.imgsrc);
            }}
            getOptionLabel={(option) => option.title}
            renderOption={(props, option, ind) => (
              <Box
                key={ind + '>>'}
                component='li'
                sx={{'& > img': {mr: 2, flexShrink: 0}}}
                {...props}
              >
                <img loading='lazy' width='20' src={option.imgsrc} alt='' />
                {option.title2}
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                style={{border: 'none'}}
                {...params}
                // label="Select Corporate"
                // InputProps={{ style: { fontWeight: 600 } }}
                inputProps={{
                  ...params.inputProps,
                  autoComplete: 'off', // disable autocomplete and autofill
                }}
              />
            )}
          />
        )}
      <SocketApp getSSOPassengers={getSSOPassengers} />
      {isMenu ? (
        <Box component='span'>Message</Box>
      ) : (
        <AppTooltip title='Notification' placement={tooltipPosition}>
          <IconButton
            className='icon-btn'
            sx={{
              borderRadius: '50%',
              width: 40,
              height: 40,
              marginLeft: 5,
              color: (theme) => theme.palette.text.secondary,
              backgroundColor: (theme) => theme.palette.background.default,
              border: 1,
              borderColor: 'transparent',
              '&:hover, &:focus': {
                color: (theme) => theme.palette.text.primary,
                backgroundColor: (theme) =>
                  alpha(theme.palette.background.default, 0.9),
                borderColor: (theme) =>
                  alpha(theme.palette.text.secondary, 0.25),
              },
            }}
            onClick={() => navigate('/Notifications')}
            size='large'
          >
            <NotificationsNoneIcon />
          </IconButton>
        </AppTooltip>
      )}
      {/* This is notification drawer */}
      <Drawer
        anchor={drawerPosition}
        open={!!clickedSOS}
        onClose={() => {
          dispatch(sosClicked());
        }}
      >
        <AppNotificationContent
          sxStyle={sxNotificationContentStyle}
          sosList={sosList}
          isFemale={isFemale}
          onClose={() => {
            dispatch(sosClicked());
          }}
        />
      </Drawer>
    </div>
  );
};

export default AppNotifications;

AppNotifications.defaultProps = {
  drawerPosition: 'right',
  tooltipPosition: 'bottom',
};

AppNotifications.propTypes = {
  drawerPosition: PropTypes.string,
  tooltipPosition: PropTypes.string,
  isMenu: PropTypes.bool,
  sxNotificationContentStyle: PropTypes.object,
};
