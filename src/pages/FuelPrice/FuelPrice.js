import React, {useState, useEffect} from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import {Grid} from '@mui/material';
import axios from 'axios';
import Api from '@api';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
const FuelPrice = () => {
  const [state, setState] = useState([]);
  const [city, setCity] = useState();
  const [changeState, setChangeState] = useState();
  // const [changeCity, setChangeCity] = useState();
  const [fuelPrice, setFuelPrice] = useState();
  useEffect(() => {
    axios
      .get(Api.baseUri + '/user-reg/fuelPrice/getAllStates')
      .then((res) => {
        if (res?.data?.status == '200') {
          setState(res?.data?.data);
        }
      })
      .catch((err) => {
        console.log('err',err);
      });
  }, []);

  const getFuelCity = (v) => {
    axios
    .get(Api.baseUri + '/user-reg/fuelPrice/getAllCities/' + v)
    .then((res) => {
      if (res?.data?.status == '200') {
        console.log('res', res);
        setCity(res?.data?.data);
      }
    })
    .catch((err) => {
      console.log('err',err);
    });
  }

  const getFulePrice = (v) => {
    axios
      .get(
        Api.baseUri +
          `/user-reg/fuelPrice/getByStateAndCity/${changeState}/${v}`,
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          setFuelPrice(res?.data?.data);
          //   setCity(res?.data?.data);
        }
      })
      .catch((err) => {
        console.log('err',err);
      });
  }

  // useEffect(() => {
  //   axios
  //     .get(Api.baseUri + '/user-reg/fuelPrice/getAllCities/' + changeState)
  //     .then((res) => {
  //       if (res?.data?.status == '200') {
  //         console.log('res', res);
  //         setCity(res?.data?.data);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log('err');
  //     });
  // }, [changeState]);

  // useEffect(() => {
  //   axios
  //     .get(
  //       Api.baseUri +
  //         `/user-reg/fuelPrice/getByStateAndCity/${changeState}/${changeCity}`,
  //     )
  //     .then((res) => {
  //       if (res?.data?.status == '200') {
  //         console.log('res', res);
  //         setFuelPrice(res?.data?.data);
  //         //   setCity(res?.data?.data);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log('err');
  //     });
  // }, [changeState, changeCity]);
 
 
  //   https://uatapi.etravelmate.com
  return (
    <div style={{marginTop: '10px'}}>
      <Grid container sx={{display: 'flex'}}>
        <Grid item>
          <Autocomplete
            disablePortal
            id='combo-box-demo'
            onChange={(e, v) => {
              console.log('e', v);
              setChangeState(v);
              getFuelCity(v)
            }}
            options={state ?? []}
            sx={{width: 300}}
            size='small'
            renderInput={(params) => <TextField {...params} label='State' />}
          />
        </Grid>
        <Grid item sx={{marginLeft: '10px'}}>
          <Autocomplete
            disablePortal
            id='combo-box-demo'
            size='small'
            onChange={(e, v) => {
              // setChangeCity(v);
              getFulePrice(v);

            }}
            options={city ?? []}
            sx={{width: 300}}
            renderInput={(params) => <TextField {...params} label='City' />}
          />
        </Grid>
      </Grid>
      <Grid container sx={{marginTop: '10px'}}>
        <Grid item md={12}>
          <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} aria-label='simple table'>
              <TableHead>
                <TableRow>
                  <TableCell>Fuel</TableCell>
                  <TableCell align='right'>Currency</TableCell>
                  <TableCell align='right'>Retail Price</TableCell>
                  <TableCell align='right'>Retaill Price Change</TableCell>
                  <TableCell align='right'>
                    Retail Price Change Interval
                  </TableCell>
                  <TableCell align='right'>Retail Unit</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>CNG</TableCell>
                  <TableCell align='right'>
                    {fuelPrice?.fuel?.cng?.currency}
                  </TableCell>
                  <TableCell align='right'>
                    {' '}
                    {fuelPrice?.fuel?.cng?.retailPrice}
                  </TableCell>
                  <TableCell align='right'>
                    {' '}
                    {fuelPrice?.fuel?.cng?.retailPriceChange}
                  </TableCell>
                  <TableCell align='right'>
                    {' '}
                    {fuelPrice?.fuel?.cng?.retailPriceChangeInterval}
                  </TableCell>
                  <TableCell align='right'>
                    {' '}
                    {fuelPrice?.fuel?.cng?.retailUnit}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Diesel</TableCell>
                  <TableCell align='right'>
                    {fuelPrice?.fuel?.diesel?.currency}
                  </TableCell>
                  <TableCell align='right'>
                    {' '}
                    {fuelPrice?.fuel?.diesel?.retailPrice}
                  </TableCell>
                  <TableCell align='right'>
                    {' '}
                    {fuelPrice?.fuel?.diesel?.retailPriceChange}
                  </TableCell>
                  <TableCell align='right'>
                    {' '}
                    {fuelPrice?.fuel?.diesel?.retailPriceChangeInterval}
                  </TableCell>
                  <TableCell align='right'>
                    {' '}
                    {fuelPrice?.fuel?.diesel?.retailUnit}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>LPG</TableCell>
                  <TableCell align='right'>
                    {fuelPrice?.fuel?.lpg?.currency}
                  </TableCell>
                  <TableCell align='right'>
                    {' '}
                    {fuelPrice?.fuel?.lpg?.retailPrice}
                  </TableCell>
                  <TableCell align='right'>
                    {' '}
                    {fuelPrice?.fuel?.lpg?.retailPriceChange}
                  </TableCell>
                  <TableCell align='right'>
                    {' '}
                    {fuelPrice?.fuel?.lpg?.retailPriceChangeInterval}
                  </TableCell>
                  <TableCell align='right'>
                    {' '}
                    {fuelPrice?.fuel?.lpg?.retailUnit}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Petrol</TableCell>
                  <TableCell align='right'>
                    {fuelPrice?.fuel?.petrol?.currency}
                  </TableCell>
                  <TableCell align='right'>
                    {' '}
                    {fuelPrice?.fuel?.petrol?.retailPrice}
                  </TableCell>
                  <TableCell align='right'>
                    {' '}
                    {fuelPrice?.fuel?.petrol?.retailPriceChange}
                  </TableCell>
                  <TableCell align='right'>
                    {' '}
                    {fuelPrice?.fuel?.petrol?.retailPriceChangeInterval}
                  </TableCell>
                  <TableCell align='right'>
                    {' '}
                    {fuelPrice?.fuel?.petrol?.retailUnit}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </div>
  );
};

export default FuelPrice;
