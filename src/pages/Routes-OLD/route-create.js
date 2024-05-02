import React, {useState, useEffect} from 'react';
import {useForm, useWatch} from 'react-hook-form';
import {
  TextField,
  Button,
  InputLabel,
  MenuItem,
  Select,
  Box,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';
import Api from '@api';
import {alpha, styled} from '@mui/material/styles';
import {yellow} from '@mui/material/colors';
import Switch from '@mui/material/Switch';
import {useAuthUser} from '@crema/utility/AuthHooks';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import './myfile.css';
import Map from './testmap';
import {pink} from '@mui/material/colors';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import WomanIcon from '@mui/icons-material/Woman';
import BoyIcon from '@mui/icons-material/Boy';
import {width} from '@mui/system';
const places = {
  id: '0',
  name: 'Velocis Systems Pvt. Ltd.',
  latitude: '52',
  longitude: '10',
  circle: {
    radius: 16000,
    options: {
      strokeColor: 'blue',
    },
  },
};
const RouteCreate = () => {
  const {user} = useAuthUser();
  const [vehicleTypeList, setVehicleTypeList] = useState([]);
  const [shiftList, setShiftList] = useState([]);
  const [empCount, setEmpCount] = useState(0);
  const [shift, setShift] = useState();
  const [vehicleType, setVehicleType] = useState([]);
  const [clicked, setClicked] = useState(false);
  const [tempObject, settempObject] = useState({});
  const [employeeArray, setEmployeeArray] = useState([]);
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: {errors},
  } = useForm({});
  const formData = useWatch({control, defaultValue: 'default'});
  const [selectedLoginType, setSelectedLoginType] = React.useState('LOGIN');
  const [selectedShifts, setSelectedShifts] = React.useState({});
  const [selectedVehicleType, setSelectedVehicleType] = React.useState({});
  const handleChange = (event) => {
    setSelectedLoginType(event.target.value);
    getShiftlist(event.target.value);
  };
  async function onSubmit(val) {}
  const clickHandle = (e) => {
    setTimeout(() => {
      e.target.select();
    }, 0);
  };
  function getEmployeesByShiftIdAndDate(id) {
    axios
      .get(
        `${Api?.roaster?.getemployeebyshiftandtime}6300a12275fb556ef83a9540&date=2022-02-22T10:52:29.739Z`,
      )
      .then((res) => {
        let tem = [];
        res?.data?.data?.map((r) => {
          tem = [...tem, ...(r.emplyeeData ?? [])];
        });
        let temEmployees = [];
        if (tem?.length) {
          tem.map((t) => {
            temEmployees.push(setEmployeeInActualFormat(t));
          });
        }
        getDistanceFromOrigin(temEmployees);
      });
  }
  function setEmployeeInActualFormat(n) {
    return {
      id: n?.id,
      employeename: n?.firstName + ' ' + n?.lastName,
      gender: n?.gender,
      distance: null,
      straightDistance: null,
      latitude: n?.location?.latitude,
      longitude: n?.location?.longitude,
      locName: n?.location?.locName,
      index: null,
    };
  }
  function arePointsNear(checkPoint, centerPoint) {
    var ky = 40000 / 360;
    var kx = Math.cos((Math.PI * centerPoint.lat) / 180.0) * ky;
    var dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
    var dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
    return Math.sqrt(dx * dx + dy * dy);
  }
  function getDistanceFromOrigin(apiRes) {
    // apiRes?.employees?.map((e) => {
    // axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=40.6655101%2C-73.89188969999998&destinations=40.659569%2C-73.933783%7C40.729029%2C-73.851524%7C40.6860072%2C-73.6334271%7C40.598566%2C-73.7527626&key=AIzaSyDmi-Upou8tVu263Vi0-nRS_tq7kCpYZ2c&travelMode=WALKING`).then((res)=>{
    // axios.get(`http://180.151.3.104:9000/trip/getdist/geocode?language=en&origins=40.6655101%2C-73.89188969999998&destinations=40.659569%2C-73.933783%7C40.729029%2C-73.851524%7C40.6860072%2C-73.6334271%7C40.598566%2C-73.7527626&key=${GoogleMapsAPI}`)
    // .then((response) => {

    {
      /*  ========= This is sample response gotten from Google distance matrix api===========   */
    }

    let response = {
      data: {
        destination_addresses: [
          '585 Schenectady Ave, Brooklyn, NY 11203, USA',
          '102-01 66th Rd, Queens, NY 11375, USA',
          '1000 N Village Ave, Rockville Centre, NY 11570, USA',
          '1000 N Village Ave, Rockville Centre, NY 11570, USA',
          '327 Beach 19th St, Far Rockaway, NY 11691, USA',
          '327 Beach 19th St, Far Rockaway, NY 11691, USA',
        ],
        origin_addresses: ['P.O. Box 793, Brooklyn, NY 11207, USA'],
        rows: [
          {
            elements: [
              {
                distance: {
                  text: '4.8 km',
                  value: 4788,
                },
                duration: {
                  text: '19 mins',
                  value: 1143,
                },
                status: 'OK',
              },
              {
                distance: {
                  text: '13.7 km',
                  value: 13744,
                },
                duration: {
                  text: '24 mins',
                  value: 1419,
                },
                status: 'OK',
              },
              {
                distance: {
                  text: '25.3 km',
                  value: 25345,
                },
                duration: {
                  text: '31 mins',
                  value: 1858,
                },
                status: 'OK',
              },
              {
                distance: {
                  text: '25.3 km',
                  value: 25345,
                },
                duration: {
                  text: '31 mins',
                  value: 1858,
                },
                status: 'OK',
              },
              {
                distance: {
                  text: '25.3 km',
                  value: 25345,
                },
                duration: {
                  text: '31 mins',
                  value: 1858,
                },
                status: 'OK',
              },
              {
                distance: {
                  text: '25.3 km',
                  value: 25345,
                },
                duration: {
                  text: '31 mins',
                  value: 1858,
                },
                status: 'OK',
              },
              {
                distance: {
                  text: '25.3 km',
                  value: 25345,
                },
                duration: {
                  text: '31 mins',
                  value: 1858,
                },
                status: 'OK',
              },
              {
                distance: {
                  text: '25.3 km',
                  value: 25345,
                },
                duration: {
                  text: '31 mins',
                  value: 1858,
                },
                status: 'OK',
              },
              {
                distance: {
                  text: '25.3 km',
                  value: 25345,
                },
                duration: {
                  text: '31 mins',
                  value: 1858,
                },
                status: 'OK',
              },
              {
                distance: {
                  text: '25.3 km',
                  value: 25345,
                },
                duration: {
                  text: '31 mins',
                  value: 1858,
                },
                status: 'OK',
              },
              {
                distance: {
                  text: '21.1 km',
                  value: 21118,
                },
                duration: {
                  text: '35 mins',
                  value: 2117,
                },
                status: 'OK',
              },
              {
                distance: {
                  text: '21.1 km',
                  value: 21118,
                },
                duration: {
                  text: '35 mins',
                  value: 2117,
                },
                status: 'OK',
              },
            ],
          },
        ],
        status: 'OK',
      },
      status: 200,
      statusText: '',
      headers: {
        'content-type': 'application/json',
      },
      config: {
        url: `${Api?.routes?.getDist}geocode?language=en&origins=40.6655101%2C-73.89188969999998&destinations=40.659569%2C-73.933783%7C40.729029%2C-73.851524%7C40.6860072%2C-73.6334271%7C40.598566%2C-73.7527626&key=AIzaSyDmi-Upou8tVu263Vi0-nRS_tq7kCpYZ2c`,
        method: 'get',
        headers: {
          Accept: 'application/json, text/plain, */*',
        },
        transformRequest: [null],
        transformResponse: [null],
        timeout: 0,
        xsrfCookieName: 'XSRF-TOKEN',
        xsrfHeaderName: 'X-XSRF-TOKEN',
        maxContentLength: -1,
        maxBodyLength: -1,
        transitional: {
          silentJSONParsing: true,
          forcedJSONParsing: true,
          clarifyTimeoutError: false,
        },
      },
      request: {},
    };

    let myDistanceArray = response?.data?.rows[0]?.elements ?? [];
    let tempArray = apiRes;
    myDistanceArray?.map((dis, ind) => {
      let myStrDist = arePointsNear(
        {lat: tempArray[ind]?.latitude, lng: tempArray[ind].longitude},
        {lat: places?.latitude, lng: places?.longitude},
      );
      // if(dis?.distance?.value < places.circle.radius){
      tempArray[ind].isInRadius =
        myStrDist * 1000 < places.circle.radius ? true : false;
      tempArray[ind].straightDistance = myStrDist * 1000;
      tempArray[ind].distance = dis?.distance?.value;
      tempArray[ind].ETA = '08:45';
      // }
    });
    getRadiusEmp(tempArray);
    // apiRes
    // })
    // .catch((error) => {
    // });
    // })
  }

  function getRadiusEmp(apiRes) {
    if (!apiRes?.length) return;
    let tem = [];
    if (apiRes?.length) {
      apiRes.map((m) => {
        tem.push({lat: parseFloat(m?.latitude), lng: parseFloat(m?.longitude)});
      });
    }
    tem.push({
      lat: parseFloat(places?.latitude),
      lng: parseFloat(places?.longitude),
    });
    // setJoinMarker(tem);
    let mytemArr = apiRes;
    let mySortedEmpArray = [];
    let radiusEmp = [];
    mytemArr?.map((re, ind) => {
      if (re.isInRadius) {
        radiusEmp.push(re);
      }
    });
    let farestDistVal = 0;
    let firstEmp = {};
    let firstInd;
    let myloop = radiusEmp?.length;
    if (radiusEmp?.length) {
      radiusEmp?.map((re, ind) => {
        if (farestDistVal < re.straightDistance) {
          farestDistVal = re.straightDistance;
          firstEmp = re;
          firstInd = ind;
        }
      });
      radiusEmp.splice(firstInd, 1);
      mySortedEmpArray.push(firstEmp);
    }
    for (let i = 0; i < myloop; i++) {
      let SecondDistVal = 0;
      let SecondEmp = {};
      let secondInd;
      if (radiusEmp?.length) {
        radiusEmp?.map((re, ind) => {
          let tem = arePointsNear(
            {lat: re?.latitude, lng: re?.longitude},
            {
              lat: mySortedEmpArray[mySortedEmpArray.length - 1]?.latitude,
              lng: mySortedEmpArray[mySortedEmpArray.length - 1]?.longitude,
            },
          );
          if (SecondDistVal < tem) {
            SecondDistVal = tem;
            SecondEmp = re;
            secondInd = ind;
          }
        });
        mySortedEmpArray.push(SecondEmp);
        radiusEmp.splice(secondInd, 1);
      }
    }

    // getAssignees(mySortedEmpArray);
    // let seqEmp = [farestRadiusEmployee];
    // while(seqEmp.length == radiusEmp.length){
    // radiusEmp?.map((re, ind)=>{
    // })
    // }
    // let myStrDist = arePointsNear({ lat: a?.latitude, lng: a.longitude }, { lat: b?.latitude, lng: b?.longitude });

    // radiusEmp.sort(function (a, b) {
    //   return Number(b.id) - Number(a.id);
    // });
  }
  function handleCreateRoute() {
    for (var key in selectedShifts) {
      getEmployeesByShiftIdAndDate(selectedShifts[key]?.split('==>>')[0]);
    }
    let temVehicleTypeArr = [];
    for (var key in selectedVehicleType) {
      temVehicleTypeArr?.push({
        id: key?.split('<<==>>')[0]?.split('==>>')[1],
        capacity: key.split('<<==>>')[1],
        count: selectedVehicleType[key] ?? 'ALL',
      });
    }
    // http://180.151.3.104:9000/user-reg/roaster/getemployeebyshiftandtime?shiftId=6300a12275fb556ef83a9540&date=2022-02-22T10:52:29.739Z
  }

  function getShiftlist(tripType) {
    setEmpCount(0);
    setEmployeeArray([]);
    setShift([]);
    axios
      .get(Api?.masters?.getallShift)
      .then((res) => {
        if (res?.data?.data?.length) {
          let tem = [];
          res?.data?.data?.map((n, ind) => {
            let tripTime = '';
            if (tripType == 'LOGIN') {
              tripTime = n.shiftStart;
            }
            if (tripType == 'LOGOUT') {
              tripTime = n.shiftEnd;
            }
            if (tripType == 'BOTH') {
              tripTime = n.shiftStart + ' - ' + n.shiftEnd;
            }
            tem.push({
              title: getTripTypeBasedIcon(n, tripTime, tripType),
              value: n.id,
              triptype: tripType,
            });
          });
          setShiftList(tem);
        } else {
          setShiftList([]);
        }
      })
      .catch((err) => {
        setShiftList([]);
      });
  }
  function handleVehicleTypeStock(val, name) {
    let y = tempObject;
    y[name] = val;
    let tempo = selectedVehicleType ?? {};
    tempo[name] = val;
    setSelectedVehicleType(tempo);
  }
  function AutoCompleteInnerUI(n) {
    return (
      <div style={{padding: '10px'}}>
        <span style={{position: 'relative', bottom: '3px'}}>
          {n.vehicleType}
        </span>
        <span
          style={{
            borderRadius: '6px',
            color: 'white',
            marginLeft: '8px',
            backgroundColor: '#0A8FDC',
            display: 'inline-flex',
            width: '42px',
            height: '22px',
            textAlign: 'center',
          }}
        >
          <img
            src='/assets/images/chair.png'
            style={{margin: '0px 4px 3px 4px', marginTop: '3px'}}
            alt='P'
          />
          {n?.vehicleOccupancy}
        </span>
        <span
          style={{
            borderRadius: '6px',
            color: 'white',
            marginLeft: '8px',
            backgroundColor: '#ff9800',
            display: 'inline-flex',
            width: '42px',
            height: '22px',
            textAlign: 'center',
          }}
        >
          <img
            src='/assets/images/stock.png'
            style={{margin: '0px 4px 3px 4px', marginTop: '3px'}}
            alt='P'
          />
          <input
            type='text'
            value={selectedVehicleType['vehicleStock==>>' + n.id]}
            onInput={(e) => {
              handleVehicleTypeStock(e?.target?.value, e?.target?.id);
            }}
            style={{border: 'none', textAlign: 'center', maxWidth: '30px'}}
            id={'vehicleStock==>>' + n.id + '<<==>>' + n?.vehicleOccupancy}
            name={'vehicleStock' + n.id}
            defaultValue={''}
            onClick={(e) => clickHandle(e)}
          />
        </span>
      </div>
    );
  }
  function getVehicleList() {
    axios
      .get(Api.masterVehicletype.list)
      .then((res) => {
        if (res?.data?.data?.length) {
          let temarr = [];
          res?.data?.data?.map((r) => {
            temarr.push({
              title: AutoCompleteInnerUI(r),
              value: r,
              tem: r.vehicleType,
            });
          });
          setVehicleTypeList(temarr);
        }
      })
      .catch((err) => {});
  }
  function getTripTypeBasedIcon(n, tripTime, tripType) {
    return (
      <>
        {n.shiftName}
        <img
          style={{position: 'relative', top: '5px', margin: '0px 6px 0px 6px'}}
          src={
            tripType == 'LOGIN'
              ? '/assets/images/login_icon.png'
              : tripType == 'LOGOUT'
              ? '/assets/images/Logout_icon.png'
              : '/assets/images/both_icon.png'
          }
        />
        {' (' + tripTime + ')'}
      </>
    );
  }
  useEffect(() => {
    axios.get('https://geolocation-db.com/json/').then((resp) => {});
    getShiftlist('LOGIN');
    getVehicleList();
  }, []);
  function getAssignees(data) {}
  function workOnRoute() {}
  useEffect(() => {
    workOnRoute();
  }, [vehicleType, employeeArray]);
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{marginBottom: '20px'}}>
          <Box sx={{flexGrow: 1}}>
            <Grid container spacing={2}>
              <Grid item xs={4} md={4}>
                <span>
                  <InputLabel className='routeLabelsClass' shrink>
                    Trip Type
                  </InputLabel>
                  <FormControlLabel
                    onChange={handleChange}
                    checked={selectedLoginType == 'LOGIN'}
                    value='LOGIN'
                    control={
                      <Radio
                        sx={{
                          color: yellow[900],
                          '&.Mui-checked': {color: yellow[900]},
                        }}
                      />
                    }
                    label='Login'
                  />
                  <FormControlLabel
                    onChange={handleChange}
                    checked={selectedLoginType == 'LOGOUT'}
                    value='LOGOUT'
                    control={
                      <Radio
                        sx={{
                          color: yellow[900],
                          '&.Mui-checked': {color: yellow[900]},
                        }}
                      />
                    }
                    label='Logout'
                  />
                  <FormControlLabel
                    onChange={handleChange}
                    checked={selectedLoginType == 'BOTH'}
                    value='BOTH'
                    control={
                      <Radio
                        sx={{
                          color: yellow[900],
                          '&.Mui-checked': {color: yellow[900]},
                        }}
                      />
                    }
                    label='Both'
                  />
                  {/* <GreenSwitch {...label} {...register("switchbtn", { required: true })} defaultChecked /> {(formData?.switchbtn) ? "Logout Route" : "Login Route"} */}
                </span>
              </Grid>

              <Grid item xs={4} md={4}>
                <span>
                  <InputLabel
                    className='routeLabelsClass'
                    shrink
                    htmlFor='corporateName'
                  >
                    Route Date
                  </InputLabel>
                  <TextField
                    type={'date'}
                    fullWidth
                    style={{maxWidth: '80%'}}
                    InputProps={{disableUnderline: true}}
                    {...register('routeDate', {required: true})}
                    InputLabelProps={{shrink: true}}
                  />
                  <div className='errorMessage'>
                    {errors.routeDate && 'Please enter valid date.'}
                  </div>
                </span>
              </Grid>

              <Grid item xs={4} md={4}>
                <span>
                  <InputLabel className='routeLabelsClass' shrink>
                    Total Number of Employees
                  </InputLabel>
                  <div
                    style={{
                      display: 'flex',
                    }}
                  >
                    {/* -----------------------------------first div---------------------------------- */}
                    <div
                      style={{
                        marginTop: '13px',
                      }}
                    >
                      <img
                        src='/assets/images/people.png'
                        style={{margin: '3px 0px 0px 5px '}}
                        alt='P'
                      />
                      <span
                        style={{
                          color: '#0A8FDC',
                          fontSize: '24px',
                          marginLeft: '8px',
                          marginRight: '10px',
                          position: 'relative',
                          top: '-3px',
                          fontWeight: 'bolder',
                        }}
                      >
                        {empCount}
                      </span>
                    </div>

                    {/* -----------------------------------second div---------------------------------- */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                        width: '37%',
                        border: '3px solid whitesmoke',
                        padding: '2%',
                        borderRadius: '20px',
                        background: 'white',
                        boxShadow: '0 8px 16px 0 rgb(0 0 0 / 3%)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                        }}
                      >
                        <div
                          style={{
                            borderRadius: '50%',
                            border: '2px solid grey',
                            width: '34px',
                            height: '34px',
                            position: 'relative',
                          }}
                        >
                          <img
                            src='/assets/images/male_icon.png'
                            style={{margin: '3px 0px 0px 7px '}}
                            alt='P'
                          />
                        </div>
                        <div
                          style={{
                            borderRadius: '50%',
                            position: 'absolute',
                            border: '2px solid orange',
                            width: '19px',
                            height: '22px',
                            marginTop: '6px',
                            marginLeft: '19px',
                            background: 'orange',
                          }}
                        >
                          <span style={{color: 'white', marginLeft: '2px'}}>
                            {empCount}
                          </span>
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                        }}
                      >
                        <div
                          style={{
                            borderRadius: '50%',
                            border: '2px solid grey',
                            width: '34px',
                            height: '34px',
                            position: 'relative',
                          }}
                        >
                          <img
                            src='/assets/images/Female_icon.png'
                            style={{margin: '3px 0px 0px 8px '}}
                            alt='P'
                          />
                        </div>
                        <div
                          style={{
                            borderRadius: '50%',
                            position: 'absolute',
                            border: '2px solid aqua',
                            width: '24px',
                            height: '24px',
                            marginTop: '4px',
                            marginLeft: '19px',
                            background: 'aqua',
                          }}
                        >
                          <span style={{color: 'white', marginLeft: '2px'}}>
                            {empCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </span>
              </Grid>

              <Grid item xs={12} md={12}>
                <span>
                  <InputLabel
                    className='routeLabelsClass'
                    shrink
                    htmlFor='shiftName'
                  >
                    Shifts
                  </InputLabel>
                  <Autocomplete
                    disablePortal
                    multiple={true}
                    disableCloseOnSelect
                    limitTags={3}
                    value={shift}
                    options={shiftList}
                    onChange={(e, option, v) => {
                      if (v == 'clear') {
                        setShift(null);
                        setSelectedShifts({});
                      } else {
                        setShift(option);
                        let temValObj = {};
                        option?.map((p) => {
                          temValObj['shiftVal==>>' + p.value] =
                            p.value + '==>>' + p.triptype;
                        });
                        setSelectedShifts(temValObj);
                      }
                    }}
                    InputProps={{disableUnderline: true}}
                    getOptionLabel={(option) => option.title}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        InputProps={{
                          ...params.InputProps,
                          disableUnderline: true,
                        }}
                      />
                    )}
                  />
                  <div className='errorMessage'>
                    {clicked && !shift?.value?.length && 'Please select shifts'}
                  </div>
                </span>
              </Grid>

              <Grid item xs={12} md={12}>
                <span>
                  <InputLabel
                    className='routeLabelsClass'
                    shrink
                    htmlFor='VehicleType'
                  >
                    Vehicle Type
                  </InputLabel>
                  <Autocomplete
                    disablePortal
                    value={vehicleType}
                    multiple
                    disableCloseOnSelect
                    // limitTags={3}
                    options={vehicleTypeList}
                    onChange={(e, option, v) => {
                      if (v == 'clear') {
                        setVehicleType([]);
                        setSelectedVehicleType({});
                      } else {
                        setVehicleType(option);
                        let tempo = selectedVehicleType ?? {};
                        option?.map((er) => {
                          if (
                            er?.value?.id &&
                            !tempo[
                              'vehicleStock==>>' +
                                er?.value?.id +
                                '<<==>>' +
                                er?.value?.vehicleOccupancy
                            ]
                          )
                            tempo[
                              'vehicleStock==>>' +
                                er?.value?.id +
                                '<<==>>' +
                                er?.value?.vehicleOccupancy
                            ] = '';
                        });
                        setSelectedVehicleType(tempo);
                      }
                    }}
                    InputProps={{disableUnderline: true}}
                    getOptionLabel={(option) => option.title}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        InputProps={{
                          ...params.InputProps,
                          disableUnderline: true,
                        }}
                      />
                    )}
                  />
                  <div className='errorMessage'>
                    {clicked &&
                      !vehicleType?.length &&
                      'Please select vehicle type.'}
                  </div>
                </span>
              </Grid>
            </Grid>
          </Box>
        </div>
        <span
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
          }}
        >
          <Button
            id='btnMui123'
            onClick={() => {
              handleCreateRoute();
            }}
            size='medium'
            style={{marginRight: '20px'}}
            variant='contained'
            className='btn-primary'
          >
            Get Routes
          </Button>
          <Button
            id='btnMui123'
            type='submit'
            size='medium'
            style={{marginRight: '20px'}}
            onClick={() => {
              setClicked(true);
            }}
            variant='contained'
            // disabled={disableBtn}
            className='btn-primary mr-4'
          >
            Submit
          </Button>
          <Button
            id='btnMui123'
            onClick={() => {}}
            size='medium'
            variant='contained'
            className='btn-primary'
          >
            Cancel
          </Button>
        </span>
      </form>
      {shift?.length ? <Map getAssignees={getAssignees} radius={8000} /> : null}
    </>
  );
};

export default RouteCreate;
