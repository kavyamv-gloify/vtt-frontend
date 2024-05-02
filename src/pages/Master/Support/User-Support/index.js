import React, {useEffect} from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import {IoMdInformationCircleOutline} from 'react-icons/io';
import AccountTabsWrapper from 'pages/account/MyProfile/AccountTabsWrapper';
import Subtopics from './sub-topics';
import MyComplaints from './ticket-list';
import WriteToUs from './write-to-us';
import AppAnimate from '@crema/core/AppAnimate';
import {Fonts} from 'shared/constants/AppEnums';
import axios from 'axios';
import Api from '@api';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import {useNavigate} from 'react-router-dom';
import TripSupport from './TripSupport';
import {useSelector} from 'react-redux';
import {useAuthUser} from '@crema/utility/AuthHooks';

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const Account = () => {
  const navigate = useNavigate();
  const {user} = useAuthUser();
  const [value, setValue] = React.useState('0');
  const [topicList, settopicList] = React.useState();
  const [TabVal, setTabVal] = React.useState('');
  const [myActions, setMyActions] = React.useState([]);

  const permissionCheck = useSelector(({settings}) => settings.permissions);
  useEffect(() => {
    if (!permissionCheck) return;
    let sub_mod = {};
    permissionCheck?.map((el) => {
      if (el.subModuleName == 'Support') sub_mod = el;
    });
    setMyActions(sub_mod?.actions);
    if (
      (!sub_mod || !sub_mod?.actions?.includes('View')) &&
      user?.userList?.userRole !== 'SUPERADMIN'
    )
      navigate('/error-pages/error-404');
  }, [permissionCheck, user]);
  useEffect(() => {
    axios
      ?.get(
        Api?.support?.topicList +
          '?page=0&size=100&topicName=null&type=EMPLOYEE',
      )
      .then((res) => {
        settopicList(res?.data?.data?.body?.HelpTopicList ?? []);
        if (localStorage.getItem('Tab') == 'CREATE') {
          setValue('write');
          setTabVal({id: 'Create', name: 'Raise Complaint'});
          localStorage.removeItem('Tab');
        } else {
          setValue('0');
          if (res?.data?.data?.length)
            setTabVal({
              id: res?.data?.data[0].id,
              name: res?.data?.data[0].topicName,
            });
        }
      })
      .catch((err) => {});
  }, []);
  const onTabsChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
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
      >
        {/* My Account */}
      </Box>
      <AppAnimate animation='transition.slideUpIn' delay={200}>
        <AccountTabsWrapper>
          <Tabs
            className='account-tabs'
            value={value}
            onChange={onTabsChange}
            aria-label='basic tabs example'
            orientation='vertical'
          >
            <h2 style={{padding: '4px 0px 13px 24px'}}>Topics</h2>
            {topicList?.map((tab, index) => (
              <Tab
                className='account-tab'
                label={
                  tab?.topicName?.trim()?.length > 40
                    ? tab?.topicName?.trim()?.slice(0, 40) + '...'
                    : tab?.topicName
                }
                onClick={() => {
                  setTabVal({id: tab.id, name: tab.topicName, index: index});
                }}
                icon={
                  <ArrowRightIcon style={{position: 'relative', top: '-2px'}} />
                }
                key={index.toString()}
                {...a11yProps(index.toString())}
              />
            ))}
            {/* <Tab
                            className='account-tab'
                            label={"Your Rides"}
                            onClick={() => { setTabVal({ id: "Your_Rides", name: "Raise Complaint" }) }}
                            icon={<ArrowRightIcon style={{ position: "relative", top: "-2px" }} />}
                            key={"write"}
                            {...a11yProps('write')}
                        /> */}
            <Tab
              className='account-tab'
              label={'Write To Us'}
              // onClick={() => {
              //   setTabVal({id: 'Create', name: 'Raise Complaint'});
              // }}
              onClick={() => {
                if (myActions && myActions.includes('Create')) {
                  setTabVal({id: 'Create', name: 'Raise Complaint'});
                }
              }}
              icon={
                <ArrowRightIcon style={{position: 'relative', top: '-2px'}} />
              }
              key={'write'}
              {...a11yProps('write')}
            />
            <Tab
              className='account-tab'
              label={'My Tickets'}
              onClick={() => {
                navigate('/user/my-complaints');
              }}
              icon={
                <ArrowRightIcon style={{position: 'relative', top: '-2px'}} />
              }
              key={'mytkts'}
              {...a11yProps('mytks')}
            />
          </Tabs>
          {TabVal?.id && (
            <Box className='account-tabs-content'>
              {TabVal?.id == 'Create' ? (
                <WriteToUs TabVal={TabVal} />
              ) : TabVal?.index == '0' ? (
                <TripSupport id={TabVal?.id} />
              ) : (
                <Subtopics TabVal={TabVal} />
              )}
            </Box>
          )}
        </AccountTabsWrapper>
      </AppAnimate>
    </>
  );
};

export default Account;
