import Driver from './driver'
import Employee from './employee'
import CustomLabel from 'pages/common/CustomLabel';
import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

export default function BasicTabs() {
    const [value, setValue] = React.useState('Employee');
    const handleChange = (newValue) => {
        setValue(newValue);
    };
    return (
        <>
            <div>
                <CustomLabel labelVal="FAQs" variantVal="h3-underline" />
            </div>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} aria-label="basic tabs example">
                        <Tab value={'Employee'} label="Employee" onClick={() => handleChange("Employee")} />
                        <Tab value={'Driver'} label="Driver" onClick={() => handleChange("Driver")} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={'Employee'}>
                    <Employee />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={'Driver'}>
                    <Driver />
                </CustomTabPanel>
            </Box>
        </>
    );
}