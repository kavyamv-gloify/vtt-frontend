import React, {useEffect, useState} from 'react';
import CloseIcon from '@mui/icons-material/Close';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {Autocomplete, Button, Stack, TextField} from '@mui/material';
import {useForm} from 'react-hook-form';
import io from 'socket.io-client';
import axios from 'axios';
import Api from '@api';
const host = Api?.baseUri;
const socket = io(host, {path: '/api/socket.io/'});
const SidePannel = ({
  setsearchData,
  dropDowns,
  setFilterType,
  data,
  setAllTrips,
}) => {
  const [tripId, setTripId] = useState();
  const [tripList, setTripList] = useState([]);
  const [shiftList, setShiftList] = useState([]);
  const [vendorList, setVendorList] = useState([]);
  const [driverList, setDriverList] = useState([]);
  const [vehicleList, setVehicleList] = useState([]);
  const [empList, setEmpList] = useState([]);
  console.log('data', data);
  console.log('tripId', tripId);
  function getAllData() {
    let temp = [];
    data?.map((el) => {
      temp.push(el?.tripId);
    });
    if (tripId !== temp.join()) {
      setTripId(temp.join());
      axios
        .get(
          Api?.baseUri + '/user-reg/trip-route/get-trip-by-id?tripId=' + temp,
        )
        .then((res) => {
          let temp_res = res?.data?.data;
          setAllTrips([...temp_res]);
          let trip_arr = [];
          let trip_arr_temp = [];
          let shift_arr = [];
          let shift_arr_temp = [];
          let vendor_arr = [];
          let vendor_arr_temp = [];
          let driver_arr = [];
          let driver_arr_temp = [];
          let vehicle_arr = [];
          let vehicle_arr_temp = [];
          let emp_arr = [];
          let emp_arr_temp = [];
          console.log(' temp_res', temp_res);
          temp_res?.map((el) => {
            if (!trip_arr_temp.includes(el.id))
              trip_arr.push({
                trip: el.id,
                title:
                  el.tripCode +
                  ' - ' +
                  (el.tripType == 'DOWNTRIP' ? 'Logout' : 'Login'),
                value: el.id,
              });
            trip_arr_temp.push(el.id);
            if (!shift_arr_temp.includes(el.shiftId))
              shift_arr.push({
                trip: el.id,
                title: el.shiftName,
                value: el.shiftId,
              });
            shift_arr_temp.push(el.shiftId);
            if (!vendor_arr_temp.includes(el.vendorId))
              vendor_arr.push({
                trip: el.id,
                title: el.vendorName,
                value: el.vendorId,
              });
            vendor_arr_temp.push(el.vendorId);
            if (!driver_arr_temp.includes(el.driverId))
              driver_arr.push({
                trip: el.id,
                title: el.driverName,
                value: el.driverId,
              });
            driver_arr_temp.push(el.driverId);
            if (!vehicle_arr_temp.includes(el.vehicleId))
              vehicle_arr.push({
                trip: el.id,
                title: el.vehicleNo + ' - ' + el.vehicleType,
                value: el.vehicleId,
              });
            vehicle_arr_temp.push(el.vehicleId);
            let t_arr =
              el.tripType == 'UPTRIP'
                ? el?.stopList[el?.stopList?.length - 1]?.deBoardPassengers
                : el?.stopList[0]?.onBoardPassengers;
            t_arr?.map((ele) => {
              if (
                ele.status != 'ABSENT' &&
                ele.status != 'CANCLED' &&
                ele.empId &&
                !emp_arr_temp?.includes(ele.empId)
              )
                emp_arr.push({
                  trip: el.id,
                  title: ele.name + ' - ' + ele.empCode,
                  value: ele.empId,
                });
            });
          });
          setTripList([...trip_arr]);
          setShiftList([...shift_arr]);
          setVendorList([...vendor_arr]);
          setDriverList([...driver_arr]);
          setVehicleList([...vehicle_arr]);
          setEmpList([...emp_arr]);
        })
        .catch((err) => {});
    }
  }
  useEffect(() => {
    getAllData();
  }, [data]);
  useEffect(() => {
    socket.on('sos-trigger', (data) => {
      getAllData();
    });
  }, []);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: {errors},
  } = useForm();
  const onSubmit = (data) => {
    console.log('shreya');
    document.querySelector('.ldr-ldr').style.display = 'none';
    document.querySelector('.side-icon').style.display = 'block';
    setsearchData({...data});
    setFilterType('');
  };
  return (
    <div style={{position: 'absolute', right: 0, top: 95}}>
      <div className='live-tracking-side-bar cursor'>
        <div
          className='side-icon'
          onClick={() => {
            document.querySelector('.ldr-ldr').style.display = 'block';
            document.querySelector('.side-icon').style.display = 'none';
          }}
        >
          <FastRewindIcon />
        </div>
      </div>
      <div
        className='info-btn-live-tracking cursor'
        onClick={() => {
          document.querySelector('.live-tracking-infor-dial').style.display =
            'block';
        }}
      >
        <InfoOutlinedIcon style={{fontSize: '22px'}} />
      </div>
      <div className='live-tracking-infor-dial'>
        <CloseIcon
          className='cursor'
          sx={{position: 'absolute', right: '4px', top: '4px'}}
          onClick={() => {
            document.querySelector('.live-tracking-infor-dial').style.display =
              'none';
          }}
        />
        <div>
          <div
            style={{
              padding: '20px 12px 1px',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <img
              src='/assets/images/inactive_car.svg'
              style={{height: 'auto', width: '24px', marginBottom: '5px'}}
            />{' '}
            Inactive Trip
          </div>
          <div
            style={{
              padding: '0px 12px 1px',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <img
              src='/assets/images/female_car.svg'
              style={{height: 'auto', width: '24px', marginBottom: '5px'}}
            />{' '}
            Female Trip
          </div>
          <div
            style={{
              padding: '0px 12px 1px',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <img
              src='/assets/images/male_car.svg'
              style={{height: 'auto', width: '24px', marginBottom: '5px'}}
            />{' '}
            Only Male Trip
          </div>
          <div
            style={{
              padding: '0px 12px 1px',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <img
              src='/assets/images/available_car.svg'
              style={{height: 'auto', width: '24px', marginBottom: '5px'}}
            />{' '}
            Available For Trip
          </div>
          <div
            style={{
              padding: '0px 12px 1px',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <img
              src='/assets/images/non-compliant_car.svg'
              style={{height: 'auto', width: '24px', marginBottom: '5px'}}
            />{' '}
            Non-Compliant Trip
          </div>
        </div>
      </div>
      <div className='live-tracking-side-pannel ldr-ldr'>
        <div>
          <div className='header'>
            Filters{' '}
            <CloseIcon
              style={{position: 'absolute', right: '10px'}}
              onClick={() => {
                document.querySelector('.ldr-ldr').style.display = 'none';
                document.querySelector('.side-icon').style.display = '';
              }}
            />{' '}
          </div>
          <div className='body'>
            <div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Autocomplete
                  multiple
                  limitTags={1}
                  id='empCode'
                  {...register('empCode')}
                  sx={{mb: 2, mt: 6}}
                  options={empList || []}
                  getOptionLabel={(option) => option.title}
                  filterSelectedOptions
                  onChange={(e, v, t) => {
                    if (t == 'clear') {
                      setValue('empCode', null);
                    } else {
                      setValue('empCode', v);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label='Emp Code / Email Id / Emp Name'
                      placeholder='Type here'
                    />
                  )}
                />
                <Autocomplete
                  multiple
                  limitTags={1}
                  sx={{mb: 2}}
                  id='shiftId'
                  {...register('shiftId')}
                  options={shiftList || []}
                  getOptionLabel={(option) => option.title}
                  onChange={(e, v, t) => {
                    if (t == 'clear') {
                      setValue('shiftId', null);
                    } else {
                      setValue('shiftId', v);
                    }
                  }}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label='Shift'
                      placeholder='Type here'
                    />
                  )}
                />
                <Autocomplete
                  multiple
                  limitTags={1}
                  sx={{mb: 2}}
                  id='tripId'
                  {...register('tripId')}
                  onChange={(e, v, t) => {
                    if (t == 'clear') {
                      setValue('tripId', []);
                    } else {
                      setValue('tripId', v);
                    }
                  }}
                  options={tripList || []}
                  getOptionLabel={(option) => option.title}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label='Trip Id'
                      placeholder='Type here'
                    />
                  )}
                />
                <Autocomplete
                  multiple
                  limitTags={1}
                  sx={{mb: 3}}
                  id='vendorId'
                  {...register('vendorId')}
                  onChange={(e, v, t) => {
                    if (t == 'clear') {
                      setValue('vendorId', []);
                    } else {
                      setValue('vendorId', v);
                    }
                  }}
                  options={vendorList || []}
                  getOptionLabel={(option) => option.title}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label='Vendor'
                      placeholder='Type here'
                    />
                  )}
                />
                <Autocomplete
                  multiple
                  limitTags={1}
                  id='driverID'
                  {...register('driverID')}
                  sx={{mb: 2}}
                  options={driverList || []}
                  getOptionLabel={(option) => option.title}
                  filterSelectedOptions
                  onChange={(e, v, t) => {
                    if (t == 'clear') {
                      setValue('driverID', null);
                    } else {
                      setValue('driverID', v);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label='Driver'
                      placeholder='Type here'
                    />
                  )}
                />
                <Autocomplete
                  multiple
                  limitTags={1}
                  id='vehicleCode'
                  {...register('vehicleCode')}
                  sx={{mb: 2}}
                  options={vehicleList || []}
                  getOptionLabel={(option) => option.title}
                  filterSelectedOptions
                  onChange={(e, v, t) => {
                    if (t == 'clear') {
                      setValue('vehicleCode', null);
                    } else {
                      setValue('vehicleCode', v);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label='Vehicle'
                      placeholder='Type here'
                    />
                  )}
                />
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Button
                    id='btnMui123'
                    type='submit'
                    variant='contained'
                    sx={{width: '60%', mb: 2, background: '#11234e'}}
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidePannel;
