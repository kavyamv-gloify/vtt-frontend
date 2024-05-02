import React, {useEffect, useState} from 'react';
import ExcelContainer from '@excelupload';
import {Autocomplete, Box, Grid, TextField, Typography} from '@mui/material';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import SummarizeIconOutlinedIcon from '@mui/icons-material/SummarizeOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import InputAdornment from '@mui/material/InputAdornment';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AppTooltip from '@crema/core/AppTooltip';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import Slab from './Slab';
import Trip from './Trip';
import KM from './KM';
import Fixed from './Fixed';
import axios from 'axios';
import Api from '@api';
import {useAuthUser} from '@crema/utility/AuthHooks';
const index = () => {
  const [tabSelected, setTabSelected] = useState(0);
  const {user} = useAuthUser();
  const [fuel, setFuel] = useState();
  const [fueltypeList, setFuelTypeList] = useState([]);
  const [fuelTypeVal, setfuelTypeVal] = useState({});
  useEffect(() => {
    if (!fuel) {
      return;
    }
    setFuelTypeList([
      {
        title:
          'Diesel(' +
          fuel?.fuel?.diesel?.currency +
          ' ' +
          fuel?.fuel?.diesel?.retailPrice +
          ')',
        value: 'Diesel',
      },
      {
        title:
          'Petrol(' +
          fuel?.fuel?.petrol?.currency +
          ' ' +
          fuel?.fuel?.petrol?.retailPrice +
          ')',
        value: 'Petrol',
      },
      {
        title:
          'CNG(' +
          (fuel?.fuel?.cng?.retailPrice
            ? fuel.fuel.cng.currency + ' ' + fuel.fuel.cng.retailPrice
            : '0') +
          ')',
        value: 'CNG',
      },
      {title: 'Electric', value: 'Electric'},
    ]);

    setfuelTypeVal({
      title:
        'Diesel(' +
        fuel?.fuel?.diesel?.currency +
        ' ' +
        fuel?.fuel?.diesel?.retailPrice +
        ')',
      value: 'Diesel',
    });
  }, [fuel]);

  const [myActions, setMyActions] = useState([]); // used
  const permissionCheck = useSelector(({settings}) => settings.permissions);
  const navigate = useNavigate();
  useEffect(() => {
    if (!permissionCheck) return;
    let sub_mod = {};
    permissionCheck?.map((el) => {
      if (el.subModuleName == 'Rate Card') sub_mod = el;
    });
    setMyActions(sub_mod?.actions);
    if (
      (!sub_mod || !sub_mod?.actions?.includes('View')) &&
      user?.userList?.userRole !== 'SUPERADMIN'
    )
      navigate('/error-pages/error-404');
  }, [permissionCheck, user]);

  const defaultProps = {
    options: fueltypeList,
    getOptionLabel: (option) => option.title,
  };

  useEffect(() => {
    axios
      .get(
        Api.baseUri +
          '/user-reg/siteoffice-reg/corporate?page=0&size=100&officeName=null',
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          // console.log('res', res?.data?.data?.body?.['SiteOffice List'][0]);
          axios
            .get(
              Api.baseUri +
                `/user-reg/fuelPrice/getByStateAndCity/${res?.data?.data?.body?.['SiteOffice List'][0]?.officeAddress?.state}/${res?.data?.data?.body?.['SiteOffice List'][0]?.officeAddress?.city}`,
            )
            .then((resp) => {
              // console.log('ccccc', resp?.data?.data);
              setFuel(resp?.data?.data);
            })
            .catch((err) => {
              console.log('err');
            });
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  }, []);
  useEffect(() => {
    let tabValuesto = localStorage.getItem('Tab_value') ?? '0';
    // console.log('Tab_value', tabValuesto);
    setTabSelected(tabValuesto);
    // console.log('Tab_value', tabValuesto);
    localStorage.removeItem('Tab_value');
  }, []);
  return (
    <div>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={12} sm={3} md={3} sx={{mb: 2}}>
          <Typography variant='h3' style={{display: 'flex'}} className='cursor'>
            <div
              onClick={() => {
                setTabSelected(0);
              }}
              style={{
                borderBottom: tabSelected == 0 ? '4px solid orange' : '',
                paddingBottom: '5px',
                paddingRight: '5px',
                marginRight: '15px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <SignalCellularAltIcon sx={{mr: 2}} /> <span>Slab</span>
            </div>
            <div
              onClick={() => {
                setTabSelected(1);
              }}
              style={{
                borderBottom: tabSelected == 1 ? '4px solid orange' : '',
                paddingBottom: '5px',
                paddingRight: '5px',
                marginRight: '15px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <SummarizeIconOutlinedIcon sx={{mr: 2}} /> <span>Trip</span>
            </div>
            <div
              onClick={() => {
                setTabSelected(2);
              }}
              style={{
                borderBottom: tabSelected == 2 ? '4px solid orange' : '',
                paddingBottom: '5px',
                paddingRight: '5px',
                marginRight: '15px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <FactCheckOutlinedIcon sx={{mr: 2}} /> <span>KM</span>
            </div>
            <div
              onClick={() => {
                setTabSelected(3);
              }}
              style={{
                borderBottom: tabSelected == 3 ? '4px solid orange' : '',
                paddingBottom: '5px',
                paddingRight: '5px',
                marginRight: '15px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <FactCheckOutlinedIcon sx={{mr: 2}} /> <span>Fixed</span>
            </div>
          </Typography>
          {/* <hr style={styles.hr} /> */}
        </Grid>
        <Grid item xs={12} sm={9} md={9} sx={{paddingTop: '0px !important'}}>
          <Box display='flex' justifyContent='flex-end' alignItems='center'>
            <div className='left-seperator'>
              <Autocomplete
                {...defaultProps}
                value={fuelTypeVal ?? {}}
                options={fueltypeList ?? []}
                getOptionLabel={(option) => option?.title}
                onChange={(option, value) => {
                  setfuelTypeVal(value);
                }}
                style={{
                  width: '200px',
                  marginRight: '22px',
                  marginTop: '0px',
                  minWidth: '250px',
                }}
                id='include-input-in-list'
                renderInput={(params) => (
                  <TextField
                    {...params}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position='start'>
                          <BloodtypeIcon
                            style={{fontSize: '24px', color: 'grey'}}
                          />{' '}
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment
                          position='start'
                          style={{marginRight: '-20px'}}
                        >
                          {fuelTypeVal == fueltypeList[0] ? (
                            <ArrowDropDownIcon
                              style={{fontSize: '28px', color: '#15cd35'}}
                            />
                          ) : (
                            <ArrowDropUpIcon
                              style={{fontSize: '28px', color: 'red'}}
                            />
                          )}{' '}
                        </InputAdornment>
                      ),
                    }}
                    variant='standard'
                  />
                )}
              />
              {myActions?.includes('Create') && (
                <AppTooltip placement={'top'} title={'Add Rate Card'}>
                  <img
                    src='/assets/images/title-icon/add rate card.svg'
                    className='title-icons-mui'
                    onClick={(e) => {
                      navigate('/rate-card/CREATE');
                    }}
                  />
                </AppTooltip>
              )}
            </div>
            {myActions?.includes('Download And Upload') && (
              <ExcelContainer
                downloadFile={'Rate-Card'}
                downloadURL={'/user-reg/tripRateCard/download'}
                getHeadersUrl={'/user-reg/tripRateCard/downlad-headerdata'}
                // downloadURL={'/user-reg/trip-ratecard/download'}
                // getHeadersUrl={'/user-reg/trip-ratecard/headerdata'}
                downloadTempURL={'/user-reg/trip-ratecard/download-template'}
                uploadURL={'/user-reg/trip-ratecard/import-excel'}
              />
            )}
          </Box>
        </Grid>
      </Grid>
      {tabSelected == 0 && (
        <Slab fuelTypeVal={fuelTypeVal} myActions={myActions} />
      )}
      {tabSelected == 1 && (
        <Trip fuelTypeVal={fuelTypeVal} myActions={myActions} />
      )}
      {tabSelected == 2 && (
        <KM fuelTypeVal={fuelTypeVal} myActions={myActions} />
      )}
      {tabSelected == 3 && (
        <Fixed fuelTypeVal={fuelTypeVal} myActions={myActions} />
      )}
    </div>
  );
};

export default index;
