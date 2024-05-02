import React, {useState, useEffect} from 'react';
import {useAuthUser} from '@crema/utility/AuthHooks';
import regex from '@regex';
import axios from 'axios';
import api from '@api';
import AppLoader from '@crema/core/AppLoader';
import {toast} from 'react-toastify';
import {makeStyles} from '@mui/styles';
import CustomLabel from 'pages/common/CustomLabel';
import {
  Button,
  Checkbox,
  Dialog,
  InputAdornment,
  InputLabel,
  Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
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
import DialogTitle from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import RefreshIcon from '@mui/icons-material/Refresh';
import moment from 'moment';
import Confirm from '@confirmation-box';
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
  const [openScheduler, setOpenScheduler] = useState(false);
  const [fuelType, setFuelType] = useState();
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const permissionCheck = useSelector(({settings}) => settings.permissions);
  const [deptList, setdeptList] = useState();
  const [scheduelData, setScheduleData] = useState();
  const fuelTypeList = [
    {title: 'Petrol', value: 'Petrol'},
    {title: 'Diesel', value: 'Diesel'},
    {title: 'CNG', value: 'CNG'},
    {title: 'Electric', value: 'Electric'},
  ];
  const [isRotating, setIsRotating] = useState(false);
  const [schedulerMatrix, setSchedulerMatrix] = useState(false);

  useEffect(() => {
    if (schedulerMatrix == true) {
      axios
        .get(
          Api.baseUri +
            '/user-reg/trip-route/getRouteMatrixSchedulerLastRunDetails',
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            console.log('res', res?.data?.data);
            setScheduleData(res?.data?.data ?? {});
          } else {
            setScheduleData({});
          }
        })
        .catch((err) => {
          console.log('err', err);
        });
    }
  }, [schedulerMatrix]);
  // useEffect(() => {
  //   async function getDeptList() {
  //     const baseURL = `${api.department.list}/${
  //       user?.userList?.userRole == 'CORPORATEADMIN'
  //         ? null
  //         : user?.userList?.userRole == 'SUPERADMIN'
  //         ? null
  //         : null
  //     }/employeeId/${
  //       user?.userList?.userRole == 'CORPORATEADMIN'
  //         ? user?.userList?.corporateId
  //         : user?.userList?.corporateId
  //     }/corporateId?page=0&size=1000`;
  //     let response = await axios.get(`${baseURL}`);

  //     let temp = [{title:"ALL", value:"ALL"}];
  //     if (response?.data?.data?.body['DepartmentList']?.length) {
  //       response?.data?.data?.body['DepartmentList']?.map((e) => {
  //         temp.push({title: e.departmentName, value: e.id});
  //       });
  //       setdeptList(temp);

  //     }
  //   }
  //   getDeptList();
  // }, [user]);

  function ScheduleComponent() {
    return (
      <div>
        <Grid container>
          <Grid item md={6} sx={{marginBottom: '10px'}}>
            <Grid container>
              <Grid item md={6}>
                <p style={{fontWeight: 'bold'}}>Date:</p>
              </Grid>
              <Grid item md={6}>
                <p>{moment(scheduelData?.createdOn).format('DD-MM-YYYY')}</p>
              </Grid>
              <Grid item md={6}></Grid>
            </Grid>
          </Grid>
          <Grid item md={6} sx={{marginBottom: '10px'}}>
            <Grid container>
              <Grid item md={6}>
                <p style={{fontWeight: 'bold'}}>Google Api Hit:</p>
              </Grid>
              <Grid item md={6}>
                <p>{scheduelData?.googleAPIHitCount}</p>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={6} sx={{marginBottom: '10px'}}>
            <Grid container>
              <Grid item md={6}>
                <p style={{fontWeight: 'bold'}}>No. of Employees:</p>
              </Grid>
              <Grid item md={6}>
                <p>{scheduelData?.forNoOfEmployee}</p>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={6} sx={{marginBottom: '10px'}}>
            <Grid container>
              <Grid item md={6}>
                <p style={{fontWeight: 'bold'}}>Status:</p>
              </Grid>
              <Grid item md={6}>
                <p>{scheduelData?.status}</p>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={6} sx={{marginBottom: '10px'}}>
            <Grid container>
              <Grid item md={6}>
                <p style={{fontWeight: 'bold'}}>Error Details:</p>
              </Grid>
              <Grid item md={6}>
                <p>{scheduelData?.errorDetails}</p>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
  useEffect(() => {
    console.log('fuelType', fuelType);
  }, [fuelType]);
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
          ob[el?.id] = true;
        });
        setTypeChecked(ob);
      })
      .catch((err) => {});
  }, []);
  function handleContained(mydata) {
    setshowbtn(false);
    setIsRotating(true);
    // let tem_vtype = _.groupBy(vehicleType, 'vehicleType');
    let tem_vtype = _.groupBy(vehicleType, 'id');
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
          type: value[0].vehicleType,
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
    axios
      .post(
        Api.baseUri + `/user-reg/trip-vrp/generate-routes/${fuelType}/true`,
        postData,
      )
      .then((res) => {
        setshowbtn(true);
        setIsRotating(false);
        if (res?.data?.status == '200') {
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
          }); //
          setAvailableFleet([...tem_result]);
        } else {
          toast.error(res?.data?.message || 'Something went wrong.');
        }
      })
      .catch((err) => {
        toast.error('Something went wrong.');
        setshowbtn(true);
        setIsRotating(false);
      });
  }
  useEffect(() => {
    setSearchAction(searchAction);
  }, [searchAction]);

  function runScheduler(d) {
    if (d == 'YES') {
      axios
        .post(Api.baseUri + '/user-reg/trip-route/manualVRP')
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success('Scheduler run successfully');
            setOpenScheduler(false);
          } else {
            toast.error('Something went wrong');
          }
        })
        .catch((err) => {
          console.log('err', err);
        });
    } else {
      setOpenScheduler(false);
    }
  }

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
  const handleCancel = async () => {
    localStorage.removeItem('selectedIds');
    setAvailableFleet([]);
  };
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
      {/* <div>shreya</div> */}
      {/* <div style={{display: 'flex', justifyContent: 'flex-end'}}>
        <div>
          <TextField
            type='date'
            // label='From Date'
            inputProps={{
              max: moment().format('YYYY-MM-DD'),
            }}
            onChange={(e, v) => {
              setFromDate(e?.target?.value);
            }}
            id='outlined-error-helper-text'
            size='small'
            sx={{width: '100%', m: 2}}
            fullWidth
          />
        </div>
        <div>
          <TextField
            type='date'
            // label='To Date'
            inputProps={{
              max: moment().format('YYYY-MM-DD'),
            }}
            onChange={(e, v) => {
              setToDate(e?.target?.value);
            }}
            id='outlined-error-helper-text'
            size='small'
            sx={{width: '100%', m: 2}}
            fullWidth
          />
        </div>
      </div> */}
      <div className='create-route'>
        {!showbtn ? <AppLoader /> : null}
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

          <div style={{display: 'flex', alignItems: 'center'}}>
            {user?.userList?.userRole == 'SUPERADMIN' && (
              <Button
                variant='contained'
                sx={{marginRight: '10px'}}
                onClick={() => {
                  setSchedulerMatrix(true);
                }}
              >
                Route Scheduler
              </Button>
            )}
            {user?.userList?.userRole == 'SUPERADMIN' && (
              <Button
                variant='contained'
                sx={{marginRight: '10px'}}
                onClick={() => {
                  setOpenScheduler(true);
                }}
              >
                Run Scheduler
              </Button>
            )}

            <Autocomplete
              disablePortal
              id='combo-box-demo'
              size='small'
              options={fuelTypeList}
              getOptionLabel={(option) => option.title}
              onChange={(e, v) => {
                setFuelType(v?.value);
              }}
              sx={{width: 300}}
              renderInput={(params) => (
                <TextField {...params} label='Fuel Type' />
              )}
            />
          </div>
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
                            checked={typeChecked[el?.id]}
                            onChange={(e) => {
                              setTypeChecked({
                                ...typeChecked,
                                [el?.id]: e.target.checked,
                              });
                              if (!e.target.checked)
                                setTypeInput({
                                  ...typeInput,
                                  [el?.id]: '',
                                });
                            }}
                          />
                        </div>
                        <TextField
                          size='small'
                          fullWidth
                          id='outlined-basic'
                          value={typeInput[el?.id] || ''}
                          disabled={!typeChecked[el?.id]}
                          onChange={(e) => {
                            if (
                              !_.isNaN(Number(e.target.value)) &&
                              e.target.value?.length < 5
                            ) {
                              setTypeInput({
                                ...typeInput,
                                [el?.id]: e.target.value,
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
            <div
              style={{
                display: 'flex',
                // justifyContent: 'flex-end',
                alignItems: 'center',
                position: 'relative',
              }}
            >
              <style>
                {`
      @keyframes rotation {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    `}
              </style>
              <RefreshIcon
                onClick={handleContained}
                style={{
                  cursor: 'pointer',
                  animation: isRotating
                    ? 'rotation 2s linear infinite'
                    : 'none',
                  transition: 'color 0.3s ease',
                  color: isRotating ? 'red' : 'inherit',
                  right: 0,
                }}
              />
            </div>
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

      <Dialog
        open={schedulerMatrix}
        onClose={() => {
          setSchedulerMatrix(false);
        }}
      >
        <DialogTitle
          id='alert-dialog-title'
          style={{
            background: '#f5f2f2',
            position: 'relative',
            fontSize: '21px',
          }}
        >
          Scheduler Details
          {/* <IconButton
            onClick={() => {
              sethistoryOpen(null);
            }}
            style={{position: 'absolute', top: '8px', right: '8px'}}
          >
            <CloseIcon />
          </IconButton> */}
        </DialogTitle>
        <DialogContent>
          <ScheduleComponent />
        </DialogContent>
      </Dialog>

      <Confirm
        open={openScheduler}
        header={'Confirm to Run'}
        cnfMsg={'Are you sure, You want to manually run the scheduler?'}
        handleClose={runScheduler}
        // reason={true}
      />
    </>
  );
};

export default CreateRoute;

// Added for the this component
// 1.Reload functionality
// 2.Cancel functionality
// 3.Vehicle variant functionality
