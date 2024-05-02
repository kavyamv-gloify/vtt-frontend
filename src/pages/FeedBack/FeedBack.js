import React, {useEffect, useState} from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ArticleIcon from '@mui/icons-material/Article';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import InsightsIcon from '@mui/icons-material/Insights';
// import StandardReports from './StandardReports';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import EmployeeFeedBack from './EmployeeFeedBack';
import DriverFeedBack from './DriverFeedBack';
import OverviewFeedBack from './overview';
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {useAuthUser} from '@crema/utility/AuthHooks';
const FeedBack = () => {
  const [value, setValue] = React.useState('one');
  const [ratFilter, setratFilter] = React.useState(null);
  const [myActions, setMyActions] = useState([]);
  const navigate = useNavigate();
  const {user} = useAuthUser();
  const permissionCheck = useSelector(({settings}) => settings.permissions);
  useEffect(() => {
    if (!permissionCheck) return;
    let sub_mod = {};
    permissionCheck?.map((el) => {
      if (el.subModuleName == 'Feedback') sub_mod = el;
    });
    setMyActions(sub_mod?.actions);
    if (
      (!sub_mod || !sub_mod?.actions?.includes('View')) &&
      user?.userList?.userRole !== 'SUPERADMIN'
    )
      navigate('/error-pages/error-404');
  }, [permissionCheck, user]);
  const handleChange = (event, newValue) => {
    setratFilter(null);
    setValue(newValue);
  };
  function clickedFunc(categ) {
    setValue('three');
    setratFilter(categ);
  }
  return (
    <>
      {/* <Grid item xs={3}> */}
      <Box sx={{width: '100%', mb: 4, marginTop: '-10px'}}>
        <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
          <Tabs
            value={value}
            onChange={handleChange}
            // TabIndicatorProps={{
            //   style: {background: 'orange'},
            // }}
            // aria-label="wrapped label tabs example"
          >
            <Tab
              sx={{paddingBottom: '0px'}}
              value='one'
              iconPosition='start'
              icon={
                <img
                  src={'/assets/images/standard.svg'}
                  style={{width: '20px'}}
                />
              }
              label='Overview'
            />
            <Tab
              sx={{paddingBottom: '0px'}}
              value='two'
              iconPosition='start'
              icon={<PermIdentityIcon style={{color: 'black'}} />}
              label='Employee'
            />
            <Tab
              value='three'
              sx={{paddingBottom: '0px'}}
              iconPosition='start'
              icon={
                <img
                  src={'/assets/images/title-icon/add-driver.svg'}
                  style={{width: '20px'}}
                />
              }
              label='Driver'
            />
          </Tabs>
        </Box>
      </Box>
      {/* </Grid> */}
      <Box sx={{width: '100%', marginTop: '-12px'}}></Box>
      {value == 'one' && <OverviewFeedBack clickedFunc={clickedFunc} />}
      {value == 'two' && <EmployeeFeedBack myActions={myActions} />}
      {value == 'three' && (
        <DriverFeedBack myActions={myActions} ratFilter={ratFilter} />
      )}
    </>
  );
};

export default FeedBack;
