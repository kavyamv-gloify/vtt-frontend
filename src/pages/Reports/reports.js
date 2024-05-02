import React, { useEffect, useState } from 'react'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import StandardReports from './StandardReports';
import MISReports from './MISReports';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
const Reports = () => {
    const [value, setValue] = React.useState('one');
    const [myActions, setMyActions] = useState([]);
    const navigate = useNavigate();
    const permissionCheck = useSelector(({ settings }) => settings.permissions);
    useEffect(() => {
        if (!permissionCheck) return
        let sub_mod = {}
        permissionCheck?.map(el => {
            if (el.subModuleName == 'Reports') sub_mod = el;
        })
        setMyActions(sub_mod?.actions);
        if (!sub_mod || !sub_mod?.actions?.includes('View')) navigate('/error-pages/error-404');
    }, [permissionCheck])
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        setValue('one');
    }, [])

    return (
        <>
            <Box sx={{ width: '100%' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    // sx={{ marginTop: "10px" }}
                    TabIndicatorProps={{
                        style: { background: "orange" }
                    }}
                // aria-label="wrapped label tabs example"
                >
                    <Tab
                        value="one"
                        iconPosition="start"
                        icon={<img src={"/assets/images/standard.svg"} style={{ width: "20px" }} />}
                        label="Standard"
                    />
                    <Tab value="two"
                        iconPosition="start"
                        icon={<img src={"/assets/images/mis.svg"} style={{ width: "20px" }} />}
                        label="MIS"
                    />
                    {/* <Tab value="three"
                        iconPosition="start"
                        icon={<img src={"/assets/images/analytics.svg"} style={{ width: "20px" }} />}
                        label="Analytics"
                    /> */}
                </Tabs>
            </Box>

            {value == "one" && <StandardReports myActions={myActions}/>}
            {value == "two" && <MISReports />}

        </>


    )
}

export default Reports