import React from 'react';
import {useNavigate} from 'react-router-dom';
import {Grid} from '@mui/material';
import {styled} from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import CustomLabel from 'pages/common/CustomLabel';
import {useAuthUser} from '@crema/utility/AuthHooks';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
// import {useNavigate} from 'react-router-dom';
const CorporateMasterPage = () => {
  const navigate = useNavigate();
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
  const {user} = useAuthUser();
  console.log('user', user);

  const data = [
    {title: 'Active Trips', image: '/assets/images/Layer_1.svg'},
    {title: 'Live Tracking', image: '/assets/images/mapLocater.svg'},
    {title: 'Master', image: '/assets/images/Master.svg', isCollapse: true},
    {title: 'Schedule', image: '/assets/images/Roster.svg'},
    {title: 'Driver Attendance', image: '/assets/images/Roster.svg'},
    {title: 'Routes', image: '/assets/images/Routes.svg', isCollapse: true},
    {title: 'Adhoc Trips', image: '/assets/images/Adhoc.svg'},
    {title: 'Leave Management', image: '/assets/images/Leave.svg'},
    {title: 'Rate Card', image: '/assets/images/RateCard.svg'},
    {title: 'Compliance', image: '/assets/images/Compliances.svg'},
    {title: 'Fuel Tracking', image: '/assets/images/Compliances.svg'},
    {title: 'Reports', image: '/assets/images/Reports.svg'},
    {title: 'Billing', image: '/assets/images/Billing.svg'},
    {title: 'IVR and SMS', image: '/assets/images/IVR.svg'},
    {title: 'Invoicing', image: '/assets/images/Invoicing.svg'},
    {title: 'Feedback', image: '/assets/images/FeedBack.svg'},
    {
      title: 'Training Videos',
      image: '/assets/images/Training Video.svg',
    },
    {
      title: 'Announcement',
      image: '/assets/images/Training Video.svg',
    },
    {title: 'Incident MGMT', image: '/assets/images/Incident.svg'},
    {title: 'Settings', image: '/assets/images/Settings.svg', isCollapse: true},
  ];

  const appSetting = [
    {title: 'Driver App setting', image: '/assets/images/routelists.svg'},
    {title: 'Employee App setting', image: '/assets/images/routelists.svg'},
    {title: 'Trip setting', image: '/assets/images/routelists.svg'},
    {title: 'Fuel setting', image: '/assets/images/routelists.svg'},
    {title: 'Compliance Association', image: '/assets/images/routelists.svg'},
    {title: 'GPS Vendor Association', image: '/assets/images/routelists.svg'},
    {title: 'Associate Vendor', image: '/assets/images/routelists.svg'},
    {title: 'Associate Driver', image: '/assets/images/routelists.svg'},
    {
      title: 'Associate Driver and Vehicle to Vendor',
      image: '/assets/images/routelists.svg',
    },
    {title: 'Associate Vehicle', image: '/assets/images/routelists.svg'},
    {title: 'General Setting', image: '/assets/images/routelists.svg'},
  ];
  return (
    <>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={9}>
          <CustomLabel labelVal='Corporate Modules' variantVal='h3-underline' />
        </Grid>
      </Grid>
      <Grid container spacing={6} sx={{padding: '20px'}}>
        {data?.map((el) => {
          return (
            <Grid
              item
              md={2.4}
              className='cursor'
              sm={4}
              xs={6}
              onClick={() => {
                if (el?.title == 'Active Trips') {
                  navigate('/onboardCorporate/livetrip');
                }
                if (el?.title == 'Live Tracking') {
                  navigate('/test-live-tracking-dashboard/DEFAULT');
                }
                if (el?.title == 'Schedule') {
                  navigate('/rosters/roster-page');
                }
                if (el?.title == 'Adhoc Trips') {
                  navigate('/createForm/corporate-AdhocTrip');
                }
                if (el?.title == 'Leave Management') {
                  navigate('/all-leave-listing');
                }
                if (el?.title == 'Rate Card') {
                  navigate('/rate-card-list');
                }
                if (el?.title == 'Compliance') {
                  navigate('/compliance-listing');
                }
                if (el?.title == 'Reports') {
                  navigate('/master/reports');
                }
                if (el?.title == 'Billing') {
                  navigate('/billings');
                }
                if (el?.title == 'IVR and SMS') {
                  navigate('/IVR');
                }
                if (el?.title == 'Invoicing') {
                  navigate('/invoice-listing-vendor/Today/null/null');
                }
                if (el?.title == 'Feedback') {
                  navigate('/feedback-view');
                }
                if (el?.title == 'Training Videos') {
                  navigate('/trainingVideo');
                }
                if (el?.title == 'Announcement') {
                  navigate(
                    '/onboardCorporate/announcement/announcement-listing',
                  );
                }
                if (el?.title == 'Incident MGMT') {
                  navigate('/incident-view');
                }
                if (el?.title == 'Master') {
                  navigate(
                    `/customer-page/masterpage/corporate-modules/master`,
                  );
                }
                if (el?.title == 'Routes') {
                  navigate(`/customer-page/masterpage/corporate-modules/route`);
                }
                if (el?.title == 'Settings') {
                  navigate(
                    `/customer-page/masterpage/corporate-modules/setting`,
                  );
                }
                if (el?.title == 'Driver Attendance') {
                  navigate(`/driver-attendence`);
                }
                if (el?.title == 'Fuel Tracking') {
                  navigate(`/fuel-track`);
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
                </div>
                <p
                  style={{
                    fontSize: '18px',
                    fontFamily: 'Roboto',
                    color: '#000',
                    fontWeight: '600',
                    fontStyle: 'normal',
                    marginTop: '10px',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                  }}
                >
                  {el?.title}
                  {el?.isCollapse && <NavigateNextRoundedIcon />}
                </p>
              </Item>
            </Grid>
          );
        })}
      </Grid>
      <hr style={{marginTop: '10px'}} />
      <Grid container spacing={6} sx={{padding: '20px'}}>
        {appSetting?.map((el) => {
          return (
            <Grid
              item
              md={2.4}
              className='cursor'
              sm={4}
              xs={6}
              onClick={() => {
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

                if (el?.title == 'Compliance Association') {
                  navigate(
                    '/compliance-association/' + user?.userList?.corporateId,
                  );
                }
                if (el?.title == 'GPS Vendor Association') {
                  navigate(
                    '/Mastergps/association/' + user?.userList?.corporateId,
                  );
                }
                if (el?.title == 'Trip setting') {
                  navigate(
                    '/setting/trip-setting/' + user?.userList?.corporateId,
                  );
                }
                if (el?.title == 'Fuel setting') {
                  navigate(
                    '/setting/other-setting/' + user?.userList?.corporateId,
                  );
                }
                if (el?.title == 'Profile Verification') {
                  navigate('/customer-page/masterpage/pending-request');
                }
                if (el?.title == 'Associate Vendor') {
                  navigate('/onboardadmin/vendor/vendor-listing/Ass');
                }
                if (el?.title == 'Associate Driver') {
                  navigate('/onboardadmin/driver/driver-listing/associate');
                }
                if (el?.title == 'Associate Vehicle') {
                  navigate('/onboardadmin/vehicle/vehicle-listing/associate');
                }
                if (el?.title == 'Associate Driver and Vehicle to Vendor') {
                  navigate(
                    '/onboardadmin/vendor/vendor-listing/associate-to-vendor',
                  );
                }

                if (el?.title == 'General Setting') {
                  navigate('/general-setting/' + user?.userList?.corporateId);
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
                </div>
                <p
                  style={{
                    fontSize: '18px',
                    fontFamily: 'Roboto',
                    color: '#000',
                    fontWeight: '600',
                    fontStyle: 'normal',
                    marginTop: '10px',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                  }}
                >
                  {el?.title}
                  {el?.isCollapse && <NavigateNextRoundedIcon />}
                </p>
              </Item>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export default CorporateMasterPage;
