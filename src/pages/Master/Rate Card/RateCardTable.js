import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import PerKm from './Edit/PerKm';
import PerTrip from './Edit/PerTrip';
import Escort from './Edit/Escort';
import CustomLabel from 'pages/common/CustomLabel';
import {Button, Grid, InputLabel} from '@mui/material';
import {Navigate, useNavigate} from 'react-router-dom';
import AppTooltip from '@crema/core/AppTooltip';
import ExcelContainer from '@excelupload';
function TabPanel(props) {
  const {children, value, index, ...other} = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{p: 3}}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function RateCard() {
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClick = () => {
    navigate('/master/rate-card');
  };
  return (
    <>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={8}>
          <CustomLabel labelVal="Rate Cards' List" variantVal='h3-underline' />
        </Grid>
        <Grid item xs={4}>
          <Box display='flex' justifyContent='flex-end'>
            <div className='left-seperator'>
              <AppTooltip placement={'top'} title={'Add New Rate Card'}>
                <img
                  src='/assets/images/title-icon/add rate card.svg'
                  className='title-icons-mui'
                  onClick={handleClick}
                />
              </AppTooltip>
            </div>
            <ExcelContainer
              downloadFile={'Rate-Card'}
              downloadURL={'/user-reg/trip-ratecard/download'}
              getHeadersUrl={'/user-reg/trip-ratecard/headerdata'}
              downloadTempURL={'/user-reg/trip-ratecard/download-template'}
              uploadURL={'/user-reg/trip-ratecard/import-excel'}
            />
          </Box>
        </Grid>
      </Grid>

      {/* <div style={{
        display: "flex",
        justifyContent: "flex-end",
        marginTop:"10px"
      }}>
        <Button id='btnMui123' variant="contained" onClick={handleClick}>
          Add Rate Cards
        </Button>
      </div> */}
      <Box sx={{width: '100%'}}>
        <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label='basic tabs example'
          >
            <Tab label='Per Trip' {...a11yProps(0)} />
            <Tab label='Per KM' {...a11yProps(1)} />
            <Tab label='Escort' {...a11yProps(2)} />
          </Tabs>
        </Box>

        <TabPanel value={value} index={0}>
          <PerTrip tabvalue={value} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <PerKm tabvalue={value} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Escort />
        </TabPanel>
      </Box>
    </>
  );
}
