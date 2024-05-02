import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import PerKm from './PerKm';
import PerTrip from './PerTrip';
import Escort from './Escort';
import CustomLabel from 'pages/common/CustomLabel';
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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <div style={{marginBottom: '25px'}}>
        <CustomLabel labelVal='Rate Card' variantVal='h3-underline' />
      </div>
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
