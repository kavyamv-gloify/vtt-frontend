import React from 'react';
import {useNavigate} from 'react-router-dom';
import {Grid} from '@mui/material';
import {styled} from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import StorefrontIcon from '@mui/icons-material/Storefront';
import CustomLabel from 'pages/common/CustomLabel';
import {useAuthUser} from '@crema/utility/AuthHooks';
const SettingModule = () => {
  const Item = styled(Paper)(({theme}) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    height: 'auto',
    textAlign: 'center',
    color: theme.palette.text.secondary,
    padding: '40px',
    // background: 'white',
    // backgroundColor: isHover ? '#f5f5f5' : 'white',
    borderRadius: '20px',
    boxShadow: '0px 4px 10px -2px rgba(0, 0, 0, 0.07);',
    border: '1px solid #ECECEC',
  }));

  const data = [
    {title: 'Roster', image: '/assets/images/RosterSettings.svg'},
    {title: 'Routing Rule', image: '/assets/images/RoutingRule.svg'},
    {title: 'Leave', image: '/assets/images/LeaveSettings.svg'},
    {title: 'SOS', image: '/assets/images/SOSSettings.svg'},
    {title: 'Push Notification', image: '/assets/images/PushNotification.svg'},
    {title: 'Compliance', image: '/assets/images/ComplianceSetting.svg'},
  ];
  const {user} = useAuthUser();
  const navigate = useNavigate();
  return (
    <>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={9}>
          <CustomLabel labelVal='Setting' variantVal='h3-underline' />
        </Grid>
      </Grid>

      <Grid container spacing={6} sx={{padding: '20px', bcakground: 'white'}}>
        {data?.map((el) => {
          return (
            <Grid
              item
              md={2.4}
              sm={4}
              className='cursor'
              xs={6}
              onClick={() => {
                if (el?.title == 'Roster') {
                  navigate('/roster-setting-list');
                }
                if (el?.title == 'Routing Rule') {
                  navigate('/manage-route/routing-rule');
                }
                if (el?.title == 'Leave') {
                  navigate('/leave-settings');
                }
                if (el?.title == 'SOS') {
                  navigate('/sos/setting');
                }
                if (el?.title == 'Push Notification') {
                  navigate('/setting/push-notification');
                }
                if (el?.title == 'Compliance') {
                  navigate('/compliance/settings');
                }
                if (el?.title == 'Driver App setting') {
                  navigate(
                    '/setting/driver-setting/' + user?.userList?.corporateId,
                  );
                }
                if (el?.title == 'Employee App setting') {
                  navigate(
                    '/setting/employee-setting/' + user?.userList?.corporateId,
                  );
                }
              }}
            >
              <Item
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <div
                  style={{
                    background: '#f8f8f8',
                    width: '100px',
                    aspectRatio: '1 / 1',
                    // height: '100px',
                    borderRadius: '50%',
                    // width: '100%',
                    margin: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    // position: 'relative',
                  }}
                >
                  {el?.image ? (
                    <img
                      src={el?.image}
                      style={
                        {
                          // position: 'absolute',
                          // marginLeft: '-26px',
                          // marginTop: '20px',
                        }
                      }
                    />
                  ) : (
                    el?.icon
                  )}
                </div>
                <p
                  style={{
                    fontSize: '18px',
                    fontFamily: 'Roboto',
                    color: '#000',
                    fontWeight: '600',
                    fontStyle: 'normal',
                    marginTop: '10px',
                  }}
                >
                  {el?.title}
                </p>
              </Item>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export default SettingModule;
