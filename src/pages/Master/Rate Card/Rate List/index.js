import React, { useEffect, useState } from 'react'
import ExcelContainer from '@excelupload';
import { Autocomplete, Box, Grid, TextField, Typography } from '@mui/material';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import SummarizeIconOutlinedIcon from '@mui/icons-material/SummarizeOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import InputAdornment from '@mui/material/InputAdornment';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AppTooltip from '@crema/core/AppTooltip';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Slab from './Slab';

const index = () => {
    const [tabSelected, setTabSelected] = useState(0);
    const [fuelTypeVal, setfuelTypeVal] = useState({ title: 'Diesel (₹100)', value: 'Diesel' }); //used
    const [myActions, setMyActions] = useState([]); // used
    const permissionCheck = useSelector(({ settings }) => settings.permissions);
    const navigate = useNavigate();
    useEffect(() => {
        if (!permissionCheck) return;
        let sub_mod = {}
        permissionCheck?.map(el => {
            if (el.subModuleName == 'Rate Card') sub_mod = el;
        })
        setMyActions(sub_mod?.actions);
        if (!sub_mod || !sub_mod?.actions?.includes('View')) navigate('/error-pages/error-404');
    }, [permissionCheck])
    const fueltypeList = [{ title: 'Diesel (₹100)', value: 'Diesel' }, { title: 'Petrol (₹101)', value: 'Petrol' }, { title: 'CNG (₹101)', value: 'CNG' }]
    const defaultProps = {
        options: fueltypeList,
        getOptionLabel: (option) => option.title,
    };
    return (
        <div>
            <Grid container spacing={2} sx={{ mb: 6 }} className='page-header-second'>
                <Grid item xs={12} sm={3} md={3} sx={{ mb: 2 }}>
                    <Typography variant="h3" style={{ display: 'flex' }} className='cursor' >
                        <div onClick={() => { setTabSelected(0) }} style={{ borderBottom: (tabSelected == 0) ? '4px solid orange' : '', paddingBottom: '5px', paddingRight: '5px', marginRight: '15px', display: 'flex', alignItems: 'center' }}>
                            <SignalCellularAltIcon sx={{ mr: 2 }} /> <span>Slab</span>
                        </div>
                        <div onClick={() => { setTabSelected(1) }} style={{ borderBottom: (tabSelected == 1) ? '4px solid orange' : '', paddingBottom: '5px', paddingRight: '5px', marginRight: '15px', display: 'flex', alignItems: 'center' }}>
                            <SummarizeIconOutlinedIcon sx={{ mr: 2 }} /> <span>Trip</span>
                        </div>
                        <div onClick={() => { setTabSelected(2) }} style={{ borderBottom: (tabSelected == 2) ? '4px solid orange' : '', paddingBottom: '5px', paddingRight: '5px', marginRight: '15px', display: 'flex', alignItems: 'center' }}>
                            <FactCheckOutlinedIcon sx={{ mr: 2 }} /> <span>KM</span>
                        </div>
                    </Typography>
                    {/* <hr style={styles.hr} /> */}
                </Grid>
                <Grid item xs={12} sm={9} md={9} sx={{ paddingTop: '0px !important' }}>
                    <Box display="flex" justifyContent="flex-end" alignItems='center'>
                        <div className='left-seperator'>
                            <Autocomplete
                                {...defaultProps}
                                value={fuelTypeVal}
                                options={fueltypeList ?? []}
                                getOptionLabel={option => option?.title}
                                onChange={(option, value) => {
                                    setfuelTypeVal(value);
                                }}
                                style={{ width: '200px', marginRight: '22px', marginTop: '0px' }}
                                id="include-input-in-list"
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment: (
                                                <InputAdornment position="start"><BloodtypeIcon style={{ fontSize: '24px', color: 'grey' }} /> </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="start" style={{ marginRight: '-20px' }}>{fuelTypeVal == fueltypeList[0] ? <ArrowDropDownIcon style={{ fontSize: '28px', color: '#15cd35' }} /> : <ArrowDropUpIcon style={{ fontSize: '28px', color: 'red' }} />} </InputAdornment>
                                            )
                                        }}
                                        variant="standard" />
                                )}
                            />
                            {myActions?.includes('Create') && <AppTooltip placement={'top'}
                                title={'Add Rate Card'}>
                                <img src='/assets/images/title-icon/add rate card.svg' className='title-icons-mui' onClick={(e) => { navigate("/rate-card/CREATE"); }} />
                            </AppTooltip>}
                        </div>
                        {myActions?.includes('Download And Upload') && <ExcelContainer
                            downloadFile={"Rate-Card"}
                            downloadURL={"/user-reg/trip-ratecard/download"}
                            getHeadersUrl={'/user-reg/trip-ratecard/headerdata'}
                            downloadTempURL={'/user-reg/trip-ratecard/download-template'}
                            uploadURL={"/user-reg/trip-ratecard/import-excel"} />}
                    </Box>
                </Grid>
            </Grid>
            {tabSelected == 0 && <Slab fuelTypeVal={fuelTypeVal} myActions={myActions} />}
        </div>
    )
}

export default index