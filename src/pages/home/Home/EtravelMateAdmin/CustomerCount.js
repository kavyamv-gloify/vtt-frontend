import React, {useEffect, useState} from 'react';
import {Box, Grid, IconButton} from '@mui/material';
import {styled} from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import {useDispatch, useSelector} from 'react-redux';
import MixedChart from './MixedChart.js';
import AppCard from '@crema/core/AppCard';
import AppSelect from '@crema/core/AppSelect';
import {useIntl} from 'react-intl';
import {FormControl, InputLabel, Select, MenuItem} from '@mui/material';
import OutlinedInput from '@mui/material/OutlinedInput';
import FilterListIcon from '@mui/icons-material/FilterList';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const CustomerCount = ({data}) => {
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedCityObjects, setSelectedCityObjects] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  useEffect(() => {
    if (data) {
      let selectedCityNames = data.cityList
        ?.slice(0, 5)
        .map((city) => city.cityName);
      setSelectedCities(selectedCityNames || []);
      const selectedCityObjects = data.cityList?.filter((city) =>
        selectedCityNames.includes(city.cityName),
      );
      setSelectedCityObjects(selectedCityObjects);
    }
  }, [data]);
  const salesChartData = [
    {
      name: 'Mon',
      AS: 8000,
      AS2: 7000,
      Rev2: 2000,
      Rev: 1000,
      amt: 2400,
      amt2: 3400,
    },
    {
      name: 'Tue',
      AS: 8000,
      AS2: 7000,
      Rev2: 2000,
      Rev: 1000,
      amt: 2400,
      amt2: 3400,
    },
    {
      name: 'Web',
      AS: 8000,
      AS2: 7000,
      Rev2: 2000,
      Rev: 1000,
      amt: 2400,
      amt2: 3400,
    },
    {
      name: 'Thu',
      AS: 8000,
      AS2: 7000,
      Rev2: 2000,
      Rev: 1000,
      amt: 2400,
      amt2: 3400,
    },
    {
      name: 'Fri',
      AS: 8000,
      AS2: 7000,
      Rev2: 2000,
      Rev: 1000,
      amt: 2400,
      amt2: 3400,
    },
    {
      name: 'Sat',
      AS: 8000,
      AS2: 7000,
      Rev2: 2000,
      Rev: 1000,
      amt: 2400,
      amt2: 3400,
    },
    {
      name: 'Sun',
      AS: 8000,
      AS2: 7000,
      Rev2: 2000,
      Rev: 1000,
      amt: 2400,
      amt2: 3400,
    },
  ];
  const Item = styled(Paper)(({theme}) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  const handleCityChange = (event) => {
    const selectedCityNames = event.target.value;
    const selectedCityObjects = data?.cityList?.filter((city) =>
      selectedCityNames.includes(city.cityName),
    );
    setSelectedCities(selectedCityNames);
    setSelectedCityObjects(selectedCityObjects);
  };

  return (
    <>
      <AppCard
        sxStyle={{height: 1, fontSize: '12px !important'}}
        title={'Our Customers (City based)'}
        action={
          <div style={{display: 'flex', alignItems: 'center'}}>
            {isFilterOpen && (
              <div style={{marginRight: '8px'}}>
                <FormControl FormControl sx={{width: 250}}>
                  <InputLabel size='small' id='demo-multiple-name-label'>
                    City
                  </InputLabel>
                  <Select
                    size='small'
                    labelId='demo-multiple-name-label'
                    id='demo-multiple-name'
                    multiple
                    value={selectedCities}
                    onChange={handleCityChange}
                    input={<OutlinedInput label='City' />}
                    MenuProps={MenuProps}
                  >
                    {data?.cityList?.map((city) => (
                      <MenuItem
                        key={city.cityName}
                        value={city.cityName}
                        disabled={
                          selectedCities.length >= 5 &&
                          !selectedCities.includes(city.cityName)
                        }
                      >
                        {city.cityName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            )}
            <IconButton
              sx={{
                p: 2,
                backgroundColor: '#e9e9e9',
              }}
            >
              <FilterListIcon onClick={toggleFilter} />
            </IconButton>
          </div>
        }
      >
        <Box
          sx={{
            // display: 'flex',
            // flex: 1,
            height: '90%',
            // flexDirection: 'column',
            alignItems: 'end',
          }}
        >
          {selectedCityObjects && <MixedChart data={selectedCityObjects} />}
          <div
            style={{
              display: 'flex',
              fontSize: '11px',
              marginTop: '5px',
            }}
          >
            <div
              style={{
                marginLeft: '10px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  marginRight: '5px',
                  height: '10px',
                  width: '10px',
                  background: '#098fdc',
                  borderRadius: '50%',
                }}
              ></div>
              <div>Corporates</div>
            </div>
            <div
              style={{
                marginLeft: '10px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  marginRight: '5px',
                  height: '10px',
                  width: '10px',
                  background: '#f04f47',
                  borderRadius: '50%',
                }}
              ></div>
              <div>Vendors</div>
            </div>
            <div
              style={{
                marginLeft: '10px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  marginRight: '5px',
                  height: '10px',
                  width: '10px',
                  background: '#ff9800',
                  borderRadius: '50%',
                }}
              ></div>
              <div>Vehicles</div>
            </div>
            <div
              style={{
                marginLeft: '10px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  marginRight: '5px',
                  height: '10px',
                  width: '10px',
                  background: '#e91e63',
                  borderRadius: '50%',
                }}
              ></div>
              <div>Drivers</div>
            </div>

            {/* <AppSelect
              fontSize='11px'
              menus={[
                messages['dashboard.thisWeek'],
                messages['dashboard.lastWeeks'],
                messages['dashboard.lastMonth'],
              ]}
              defaultValue={messages['dashboard.thisWeek']}
              onChange={handleSelectionType}
            /> */}
          </div>
        </Box>
      </AppCard>
    </>
  );
};

export default CustomerCount;
