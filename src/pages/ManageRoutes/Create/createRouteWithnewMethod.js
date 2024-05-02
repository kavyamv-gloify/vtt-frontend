import React, {useState, useEffect} from 'react';
import {useAuthUser} from '@crema/utility/AuthHooks';
import regex from '@regex';
import axios from 'axios';
import api from '@api';
import AppLoader from '@crema/core/AppLoader';
import Loader from './Loader';
import {toast} from 'react-toastify';
import {makeStyles} from '@mui/styles';
import CustomLabel from 'pages/common/CustomLabel';
import {
  Button,
  Checkbox,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Slider from './carousel';
import EnhancedTableCreate from './createtable';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import _ from 'lodash';
import Api from '@api';
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';

const CreateRoute = () => {
  const [showbtn, setshowbtn] = React.useState(true);
  const {user} = useAuthUser();
  const navigate = useNavigate();
  const [SelectedShiftData, setSelectedShiftData] = useState([]);
  const [myTableObj, setmyTableObj] = useState({});
  const [searchAction, setSearchAction] = useState('');
  const [typeInput, setTypeInput] = useState({});
  const [typeChecked, setTypeChecked] = useState({});
  const [vehicleType, setvehicleType] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(0);
  const [routeCreated, setRouteCreated] = useState(false);
  const [availableFleet, setAvailableFleet] = useState([]);
  const [passCount, setPassCount] = useState(0);
  const [myActions, setMyActions] = useState([]);
  const [fuelType, setFuelType] = useState();
  const [routeId, setRouteId] = useState();
  const [backgroundLoader, setBackgroundLoader] = useState(false);
  const permissionCheck = useSelector(({settings}) => settings.permissions);
  const fuelTypeList = [
    {title: 'Petrol', value: 'Petrol'},
    {title: 'Diesel', value: 'Diesel'},
    {title: 'CNG', value: 'CNG'},
    {title: 'Electric', value: 'Electric'},
  ];
  useEffect(() => {
    console.log('fuelType', fuelType);
  }, [fuelType]);

  // useEffect(() => {
  //   localStorage.setItem('generated_route', routeId);
  // }, [routeId]);

  const checkStatus = () => {
    const storedRouteId = localStorage.getItem('route_id');
    const storedFuel_type = localStorage.getItem('fuel_type');
    const storedPostData = JSON.parse(localStorage.getItem('route_object'));

    if (storedRouteId && storedPostData) {
      setBackgroundLoader(true);
      axios
        .post(
          Api.baseUri +
            `/user-reg/trip-vrp/generateRoutesAsync/${storedFuel_type}/true/${storedRouteId}`,
          storedPostData,
        )
        .then((res) => {
          if (res?.data?.status == 200 && _.isArray(res?.data?.data)) {
            setBackgroundLoader(false);
            localStorage.removeItem('route_object');
            localStorage.removeItem('route_id');
            localStorage.removeItem('fuel_type');

            let tem_result = [];
            res?.data?.data?.map((ele) => {
              let tem_fleets = [];
              // let tem_o = _.groupBy(ele.fleets, 'type');
              // let arr_t = []
              ele.fleets?.map((fl) => {
                tem_fleets.push({
                  vehiclename: fl.type,
                  noofseat: fl.ocupancy,
                  noofroot: fl.numbers,
                });
                // if(!arr_t?.includes(fl.type)) tem_fleets.push({ vehiclename: fl.type, noofseat: fl.ocupancy, noofroot: tem_o[fl.type]?.length || 0 })
                // arr_t.push(fl.type);
              });
              tem_result.push({
                passCount: ele.numberOfAssignedEmp,
                availableVehicle: tem_fleets,
                estimatedCost: ele.estimatedCost,
                cost: ele.estimatedCost,
                numberOfAssignedEmp: ele.numberOfAssignedEmp,
                numberOfUnAssignedEmp: ele.numberOfUnAssignedEmp,
                numberOfTrips: ele.numberOfTrips,
                route: ele.routes,
                distance: ele.totalDistance,
              });
            });
            tem_result.sort(function (a, b) {
              return a.estimatedCost - b.estimatedCost;
            });
            setAvailableFleet([...tem_result]);
          } else if (res?.data?.status != 200) {
            toast.error(res?.data?.message || 'Something went wrong.');
            setBackgroundLoader(false);
            localStorage.removeItem('route_object');
            localStorage.removeItem('route_id');
            localStorage.removeItem('fuel_type');
          }
        })
        .catch((err) => {
          setBackgroundLoader(false);
          localStorage.removeItem('route_object');
          localStorage.removeItem('route_id');
          localStorage.removeItem('fuel_type');
          toast.error('Something went wrong.');
          setshowbtn(true);
        });
    }
  };
  useEffect(() => {
    const storedRouteId = localStorage.getItem('route_id');
    const storedPostData = JSON.parse(localStorage.getItem('route_object'));
    const storedFuel_type = JSON.parse(localStorage.getItem('fuel_type'));

    if (storedFuel_type) {
      console.log('storedFuel_type', storedFuel_type);
      setFuelType(storedFuel_type);
    }

    if (storedRouteId && storedPostData) {
      checkStatus();

      const intervalId = setInterval(() => {
        checkStatus();
      }, 2000);

      return () => clearInterval(intervalId);
    }
  }, [routeId]);

  useEffect(() => {
    if (!permissionCheck) return;
    let sub_mod = {};
    permissionCheck?.map((el) => {
      if (el.subModuleName == 'Auto Generated') sub_mod = el;
    });
    setMyActions(sub_mod?.actions);
    if (
      (!sub_mod || !sub_mod?.actions?.includes('View')) &&
      user?.userList?.userRole !== 'SUPERADMIN'
    )
      navigate('/error-pages/error-404');
  }, [permissionCheck, user]);
  useEffect(() => {
    let url = `${api.masterVehicletype.listbytanent}?page=0&size=1000&vehicleType=null`;
    axios
      .get(url)
      .then((re) => {
        setvehicleType(re?.data?.data?.body?.VehicleTypeList);
        let ob = {};
        re?.data?.data?.body?.VehicleTypeList?.map((el) => {
          ob[el.vehicleType] = true;
        });
        setTypeChecked(ob);
      })
      .catch((err) => {});
  }, []);
  function handleContained(mydata) {
    setshowbtn(false);
    let tem_vtype = _.groupBy(vehicleType, 'vehicleType');
    let tem_shifts = [];
    SelectedShiftData?.map((se) => {
      tem_shifts.push({
        shiftId: se.id?.split('__')[0],
        shiftName: 'mrng',
        tripType: se.id?.split('__')[1] == 'LOGIN' ? 'UPTRIP' : 'DOWNTRIP',
        date: se.id?.split('__')[2],
      });
    });
    let fleetsArr = [];
    for (const [key, value] of Object.entries(tem_vtype)) {
      if (typeChecked[key]) {
        fleetsArr.push({
          type: key,
          numbers: typeInput[key],
          ocupancy: value[0].maxCapacityExcludingDriver,
        });
      }
    }
    let postData = {
      fleets: fleetsArr,
      shiftTime: tem_shifts,
      passCount: passCount?.toString(),
    };
    // localStorage.setItem('route_object', postData);
    console.log('postData', postData);
    localStorage.setItem('route_object', JSON.stringify(postData));
    localStorage.setItem('fuel_type', JSON.stringify(fuelType));
    // return;
    axios
      .post(
        Api.baseUri +
          `/user-reg/trip-vrp/generateRoutesAsync/${fuelType}/true/${
            routeId?.length ? routeId : null
          }`,
        postData,
      )
      .then((res) => {
        setshowbtn(true);
        if (res?.data?.status == '200') {
          setRouteId(res?.data?.data);
          localStorage.setItem('route_id', res?.data?.data);
          toast.success(res?.data?.message || 'Something went wrong.');
          // return;
          // let tem_result = [];
          // res?.data?.data?.map((ele) => {
          //   console.log('routeId', res?.data);
          //   let tem_fleets = [];
          //   // let tem_o = _.groupBy(ele.fleets, 'type');
          //   // let arr_t = []
          //   ele.fleets?.map((fl) => {
          //     tem_fleets.push({
          //       vehiclename: fl.type,
          //       noofseat: fl.ocupancy,
          //       noofroot: fl.numbers,
          //     });
          //     // if(!arr_t?.includes(fl.type)) tem_fleets.push({ vehiclename: fl.type, noofseat: fl.ocupancy, noofroot: tem_o[fl.type]?.length || 0 })
          //     // arr_t.push(fl.type);
          //   });
          //   tem_result.push({
          //     passCount: ele.numberOfAssignedEmp,
          //     availableVehicle: tem_fleets,
          //     estimatedCost: ele.estimatedCost,
          //     cost: ele.estimatedCost,
          //     numberOfAssignedEmp: ele.numberOfAssignedEmp,
          //     numberOfUnAssignedEmp: ele.numberOfUnAssignedEmp,
          //     numberOfTrips: ele.numberOfTrips,
          //     route: ele.routes,
          //     distance: ele.totalDistance,
          //   });
          // });
          // tem_result.sort(function (a, b) {
          //   return a.estimatedCost - b.estimatedCost;
          // }); //
          // setAvailableFleet([...tem_result]);
        } else {
          toast.error(res?.data?.message || 'Something went wrong.');
        }
      })
      .catch((err) => {
        toast.error('Something went wrong.');
        setshowbtn(true);
      });
  }
  useEffect(() => {
    setSearchAction(searchAction);
  }, [searchAction]);

  const slectRoute = async (env, data) => {};
  const handleSubmit = async () => {
    let postData = availableFleet[selectedSuggestion];
    axios
      .post(Api.baseUri + '/user-reg/trip-vrp/save-routes', postData.route)
      .then((re) => {
        if (re.data?.status == '200') {
          setRouteCreated(true);
          toast.success('Route Created Successfully.');
          localStorage.removeItem('selectedIds');
          navigate('/route-lists/ALL');
        } else {
          toast.error(res?.data?.message || 'Something went wrong.');
        }
      })
      .catch((err) => {
        toast.error('Something went wrong.');
      });
  };
  const handleCancel = async () => {};

  async function rosterChecked(d) {
    let temObj = {};
    d?.map(async (el) => {
      if (el.isSelected) {
        if (!myTableObj[el.id]) {
          let postData = {
            loginShiftId:
              el.id?.split('__')[1] == 'LOGIN' ? el.id?.split('__')[0] : null,
            date:
              el.id?.split('__')[1] == 'LOGIN' ? el.id?.split('__')[2] : null,
            logoutShiftId:
              el.id?.split('__')[1] == 'LOGOUT' ? el.id?.split('__')[0] : null,
            logoutDate:
              el.id?.split('__')[1] == 'LOGOUT' ? el.id?.split('__')[2] : null,
            corporateId: user?.userList?.profileId,
          };
          let re = await axios.post(
            api.baseUri + '/user-reg/roaster/get-roastersummary-list-byshifts',
            postData,
          );

          temObj[el.id] = {
            ...re?.data?.data,
            time: el.time,
            shiftName: el.shiftName,
          };
          console.log('temObj', temObj);
          setmyTableObj({...myTableObj, ...temObj});
        }
      } else {
        let temp_data = myTableObj;
        delete temp_data[el.id];
        setmyTableObj({...temp_data});
      }
    });
  }
  useEffect(() => {
    let te = [];
    let t_count = 0;
    for (const [key, value] of Object.entries(myTableObj)) {
      let tem = value;
      tem.id = key;
      te.push(tem);
      t_count = t_count + tem.count;
    }
    setPassCount(t_count);
    setSelectedShiftData([...te]);
  }, [myTableObj]);
  return (
    <>
      <div className='create-route'>
        {!showbtn ? <AppLoader /> : null}
        {backgroundLoader ? <Loader /> : null}
        <div className='grid-container'>
          <Slider rosterChecked={rosterChecked} />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '20px',
          }}
        >
          <div>
            <CustomLabel labelVal='Roster Plan' variantVal='h3-underline' />
          </div>
          <Autocomplete
            disablePortal
            id='combo-box-demo'
            options={fuelTypeList}
            getOptionLabel={(option) => option.title}
            onChange={(e, v) => {
              setFuelType(v?.value);
            }}
            sx={{width: 300}}
            renderInput={(params) => <TextField {...params} />}
          />
          {/* <Select
            labelId='status-select-outlined-label'
            // label={<IntlMessages id='common.status' />}
            value={fuelType}
            onChange={(e) => {
              setFuelType(e?.target?.value);
            }}
            sx={{
              width: 300,
              cursor: 'pointer',
              '& .MuiOutlinedInput-input': {
                paddingBottom: 2.5,
                paddingTop: 2.5,
              },
            }}
          >
            {fuelTypeList.map((status) => {
              return (
                <MenuItem
                  key={status.value}
                  value={status.value}
                  sx={{
                    padding: 2,
                    cursor: 'pointer',
                  }}
                >
                  {status.title}
                </MenuItem>
              );
            })}
          </Select> */}
        </div>

        <div className='grid-container'>
          <EnhancedTableCreate SelectedShiftData={SelectedShiftData || []} />
        </div>
        <CustomLabel labelVal='Fleet Mix' variantVal='h3-underline' />
        <div
          className='grid-container fleet-mix'
          style={{
            background: 'white',
            boxShadow: 'rgb(100 100 111 / 20%) 0px 3px 6px 0px',
            marginBottom: '20px',
          }}
        >
          <div className='fleet-title' style={{background: '#e5e5e5'}}>
            Available Fleet
          </div>
          <div className='fleet-content' style={{padding: '20px'}}>
            <Box>
              <Grid container spacing={3}>
                {vehicleType?.map((el, ind) => {
                  return (
                    <Grid item xs={1} md={3}>
                      <div>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                          <InputLabel
                            style={{fontWeight: '600', paddingLeft: '5px'}}
                          >
                            {el.vehicleType}
                          </InputLabel>
                          <Checkbox
                            size='small'
                            checked={typeChecked[el.vehicleType]}
                            onChange={(e) => {
                              setTypeChecked({
                                ...typeChecked,
                                [el.vehicleType]: e.target.checked,
                              });
                              if (!e.target.checked)
                                setTypeInput({
                                  ...typeInput,
                                  [el.vehicleType]: '',
                                });
                            }}
                          />
                        </div>
                        <TextField
                          size='small'
                          fullWidth
                          id='outlined-basic'
                          value={typeInput[el.vehicleType] || ''}
                          disabled={!typeChecked[el.vehicleType]}
                          onChange={(e) => {
                            if (
                              !_.isNaN(Number(e.target.value)) &&
                              e.target.value?.length < 5
                            ) {
                              setTypeInput({
                                ...typeInput,
                                [el.vehicleType]: e.target.value,
                              });
                            }
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment
                                position='start'
                                sx={{color: '#fb950a'}}
                              >
                                <Inventory2Icon style={{fontSize: '18px'}} />
                                <p>{el.maxCapacityExcludingDriver}</p>{' '}
                              </InputAdornment>
                            ),
                          }}
                          placeholder='Enter Count'
                          variant='outlined'
                        />
                      </div>
                    </Grid>
                  );
                })}
                <Grid
                  item
                  xs={12}
                  md={12}
                  style={{width: '100%', textAlign: 'center'}}
                >
                  <Button
                    id='btnMui123'
                    style={{marginTop: '36px'}}
                    disabled={
                      !passCount ||
                      !SelectedShiftData?.length ||
                      !showbtn ||
                      availableFleet?.length
                    }
                    variant='contained'
                    onClick={(e) => {
                      handleContained(e);
                    }}
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </div>
        </div>
        {availableFleet?.length ? (
          <div className='grid-container fleet-mix'>
            <div className='fleet-content'>
              {availableFleet?.map((data, i) => {
                return (
                  <div className='available-root'>
                    <div className='vehicle-list'>
                      {data?.availableVehicle?.length
                        ? data?.availableVehicle.map((v, index) => {
                            return (
                              <>
                                <div className='vehicle-detail'>
                                  <span className='v-type'>
                                    {v.vehiclename}
                                  </span>
                                  <span className='seat-icon'>
                                    <img
                                      className='v-icons'
                                      src='/assets/images/route_page_icon/seat.png'
                                    />
                                  </span>
                                  <span className='no-of-seat'>
                                    {v.noofseat}
                                  </span>
                                  <span className='route-icon'>
                                    <img
                                      className='v-icons'
                                      src='/assets/images/route_page_icon/trip.png'
                                    />
                                  </span>
                                  <span className='no-of-route'>
                                    {v.noofroot}
                                  </span>
                                </div>
                                {data?.availableVehicle?.length > index + 1 ? (
                                  <div className='plus-icon'>+</div>
                                ) : null}
                              </>
                            );
                          })
                        : null}
                    </div>
                    <div className='amount'>
                      <span
                        style={{
                          fontFamily: 'none',
                          fontWeight: 'bold',
                          marginRight: '5px',
                        }}
                      >
                        ₹
                      </span>{' '}
                      {data?.estimatedCost}
                    </div>
                    <div
                      className='select-btn'
                      style={{
                        background:
                          selectedSuggestion == i ? '#0fc35c' : '#ece8e7',
                        color: selectedSuggestion == i ? '#FFFFFF' : '#000000',
                      }}
                      onClick={(env) => {
                        slectRoute(env, data);
                        setSelectedSuggestion(i);
                      }}
                    >
                      {selectedSuggestion == i ? 'Selected' : 'Select'}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className='fleet-submit'>
              {routeCreated ? (
                <Button
                  id='btnMui123'
                  className='submit-btn'
                  onClick={() => {
                    navigate('/route-lists/ALL');
                  }}
                  sx={{mt: 1, mr: 2}}
                >
                  View Route
                </Button>
              ) : (
                <>
                  {myActions?.includes('Create') && (
                    <Button
                      id='btnMui123'
                      className='submit-btn'
                      onClick={handleSubmit}
                      sx={{mt: 1, mr: 2}}
                    >
                      Generate Route
                    </Button>
                  )}
                </>
              )}
              <Button
                id='btnMui123'
                className='cancel-btn'
                onClick={handleCancel}
                sx={{mt: 1, ml: 2}}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default CreateRoute;
