import React, {useEffect, useState} from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import Tab1 from './tab1';
import Tab2 from './tab2';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TuneIcon from '@mui/icons-material/Tune';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {Box, Grid, TextField, Typography} from '@mui/material';
import moment from 'moment';
import {useAuthUser} from '@crema/utility/AuthHooks';
const IVR = () => {
  const [value, setValue] = React.useState(0);
  const [ratFilter, setratFilter] = React.useState(null);
  const [myActions, setMyActions] = useState([]);
  const [dateType, setDateType] = useState('today');
  const [dates, setDates] = useState();
  const [dateRange, setDateRange] = useState();
  const navigate = useNavigate();
  const {user} = useAuthUser();
  const permissionCheck = useSelector(({settings}) => settings.permissions);
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  useEffect(() => {
    if (!permissionCheck) return;
    let sub_mod = {};
    permissionCheck?.map((el) => {
      if (el.subModuleName == 'IVR') sub_mod = el;
    });
    setMyActions(sub_mod?.actions);
   if (
      (!sub_mod || !sub_mod?.actions?.includes('View')) &&
      user?.userList?.userRole !== 'SUPERADMIN'
    )
      navigate('/error-pages/error-404');
  }, [permissionCheck,user]);
  const handleChange = (event, newValue) => {
    setratFilter(null);
    setValue(newValue);
  };
  function clickedFunc(categ) {
    setValue('three');
    setratFilter(categ);
  }

  const handleChanges = (event) => {
    setDateType(event.target.value || 'today');
  };
  const getDates = () => {
    var curr = new Date();
    var first = curr.getDate() - curr.getDay();
    var last = first + 6;
    var firstday = new Date(curr.setDate(first)).toUTCString();
    var lastday = new Date(curr.setDate(last)).toUTCString();
    return {firstDay: firstday, lastDay: lastday};
  };

  const getMonth = () => {
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return {firstDay: firstDay, lastDay: lastDay};
  };

  useEffect(() => {
    if (!dateType) {
      return;
    }
    let from_Date = '';
    let to_Date = '';
    if (dateType == 'today') {
      from_Date = moment().format('YYYY-MM-DD');
      to_Date = moment().format('YYYY-MM-DD');
    }

    if (dateType == 'custom') {
      from_Date = dates?.fromDate;
      to_Date = dates?.toDate;
    }

    let Weekly = getDates();
    let Monthly = getMonth();

    if (dateType == 'weekly') {
      from_Date = moment(Weekly?.firstDay).format('YYYY-MM-DD');
      to_Date = moment(Weekly?.lastDay).format('YYYY-MM-DD');
    }

    if (dateType == 'monthly') {
      from_Date = moment(Monthly?.firstDay).format('YYYY-MM-DD');
      to_Date = moment(Monthly?.lastDay).format('YYYY-MM-DD');
    }

    setDateRange({...dateRange, fromDate: from_Date, toDate: to_Date});
  }, [dates, dateType]);
  return (
    <>
      <Grid container spacing={2} className='page-header-second'>
        <Grid item xs={3}>
          <Box sx={{width: '100%', mb: 4}}>
            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
              <Tabs
                sx={{marginTop: '-20px'}}
                value={value}
                onChange={handleChange}
                aria-label='basic tabs example'
              >
                <Tab
                  sx={{paddingBottom: '0px'}}
                  icon={
                    <img
                      src={'/assets/images/standard.svg'}
                      style={{width: '20px'}}
                    />
                  }
                  iconPosition='start'
                  label='IVRS'
                  {...a11yProps(0)}
                />

                <Tab
                  sx={{paddingBottom: '0px'}}
                  icon={<PermIdentityIcon style={{color: 'black'}} />}
                  iconPosition='start'
                  label='SMS'
                  {...a11yProps(1)}
                />

                {/* <Tab label="Vendor" {...a11yProps(2)} /> */}
              </Tabs>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={9}>
          <Box display='flex' justifyContent='flex-end'>
            <div className='left-seperator'>
              <FormControl variant='standard' sx={{m: 1, minWidth: 120}}>
                <Select
                  sx={{mr: 4}}
                  id='demo-simple-select-standard'
                  value={dateType}
                  onChange={handleChanges}
                >
                  <MenuItem value={'custom'}>Custom</MenuItem>
                  <MenuItem value={'today'}>Today</MenuItem>
                  <MenuItem value={'weekly'}>Weekly</MenuItem>
                  <MenuItem value={'monthly'}>Monthly</MenuItem>
                </Select>
              </FormControl>
              {dateType == 'custom' && (
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <TextField
                    type='date'
                    inputProps={{
                      max: moment().format('YYYY-MM-DD'),
                    }}
                    onChange={(e, v) => {
                      setDates({...dates, fromDate: e?.target?.value});
                    }}
                    id='outlined-error-helper-text'
                    size='small'
                    fullWidth
                  />
                  <TextField
                    type='date'
                    inputProps={{
                      max: moment().format('YYYY-MM-DD'),
                    }}
                    onChange={(e, v) => {
                      setDates({...dates, toDate: e?.target?.value});
                    }}
                    id='outlined-error-helper-text'
                    size='small'
                    fullWidth
                  />
                </div>
              )}
              <TuneIcon sx={{mt: 3}} />
            </div>
          </Box>
        </Grid>
      </Grid>
      {value == 0 && <Tab1 clickedFunc={clickedFunc} dateRange={dateRange} />}
      {value == 1 && <Tab2 dateRange={dateRange} />}
      {/* {value == 'one' && (
        <Tab1 clickedFunc={clickedFunc} dateRange={dateRange} />
      )}
      {value == 'two' && <Tab2 dateRange={dateRange} />} */}
    </>
  );
};

export default IVR;
