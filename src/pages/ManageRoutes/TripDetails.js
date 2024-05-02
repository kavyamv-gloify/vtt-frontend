import React, {useState, useEffect} from 'react';
import Table from '@mui/material/Table';
import {Button, TextField} from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {toast} from 'react-toastify';
import Api from '@api';
import axios from 'axios';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import moment from 'moment';
import {Grid} from '@mui/material';
import AppTooltip from '@crema/core/AppTooltip';
const TripDetails = ({data, close}) => {
  const [empData, setEmpData] = useState([]);
  const [shift, setShift] = useState();
  const [reason, setReason] = useState('');
  const [actualKm, setActualKm] = useState('');
  function getDelayOrEarlyMinutes(expectedTime, arrivalTime) {
    if (expectedTime !== 0 && arrivalTime !== 0) {
      let expected = expectedTime;
      let arrival = arrivalTime;
      let secDiff = Math.floor((arrival - expected) / 1000);
      let minutesDiff = Math.floor(secDiff / 60);
      // console.log(minutesDiff.toString().slice(0, 3));
      return minutesDiff.toString().slice(0, 4);
    } else return '--';
  }
  useEffect(() => {
    console.log('data', data);
    let temp = [];
    data?.stopList?.map((el) => {
      if (data?.tripType == 'UPTRIP') {
        el?.onBoardPassengers?.map((_e) => {
          if (_e?.passType == 'ESCORT') {
            _e.gender = 'ESCORT';
          }
          temp.push({
            ..._e,
            stopPoint: el?.stopPointName,
            vehicleReachingTimeactual: el?.actualArivalTime,
            vehicleReachingTimeExpect: el?.expectedArivalTime,
            tempactualArivalTime:
              _e?.status == 'SCHEDULE'
                ? _e?.actualArivalTime
                : _e?.status == 'BOARDED'
                ? _e?.actualArivalTime
                : _e?.status == 'COMPLETED'
                ? _e?.expectedArivalTime
                : _e?.actualArivalTime,
            tripCompleteReason: '',
          });
        });
      }
      if (data?.tripType == 'DOWNTRIP') {
        el?.deBoardPassengers?.map((_e) => {
          if (_e?.passType == 'ESCORT') {
            _e.gender = 'ESCORT';
          }
          temp.push({
            ..._e,
            stopPoint: el?.stopPointName,
            vehicleReachingTimeactual: el?.actualArivalTime,
            vehicleReachingTimeExpect: el?.expectedArivalTime,
            tempactualArivalTime: _e?.actualArivalTime,
            // tempactualArivalTime:
            //   _e?.status == 'SCHEDULE'
            //     ? _e?.actualArivalTime
            //     : _e?.status == 'BOARDED'
            //     ? _e?.actualArivalTime
            //     : _e?.status == 'COMPLETED'
            //     ? _e?.expectedArivalTime
            //     : _e?.actualArivalTime,
            tripCompleteReason: '',
          });
        });
      }
    });
    console.log('temp', temp);
    setEmpData(temp);
  }, [data]);
  const statusOptions = [
    {title: 'BOARDED', value: 'BOARDED', color: 'green'},
    {title: 'SCHEDULE', value: 'SCHEDULE', color: '5px solid rgb(5, 63, 92)'},
    {title: 'ABSENT', value: 'ABSENT', color: 'red'},
    {title: 'NO-SHOW', value: 'NO_SHOW', color: 'orange'},
    {title: 'COMPLETED', value: 'COMPLETED', color: 'green'},
  ];

  useEffect(() => {
    axios
      .get(Api.baseUri + `/user-reg/shift/${data?.shiftId}`)
      .then((res) => {
        if (res?.data?.status == '200') {
          console.log('res', res?.data);
          setShift(res?.data?.data);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  }, [data?.shiftId]);
  function handleSubmit() {
    const postData = [];
    console.log('empData', empData);
    empData?.map((el) => {
      postData.push({
        id: el?.id,
        tripId: el?.tripId,
        actualDropDateTime: el?.actualArivalTime,
        status: el?.status,
        tripCompleteReason: el?.tripCompleteReason,
        manualTripReason: reason,
        actualTripDistance : actualKm
      });
    });
    console.log('postData', postData);

    axios
      .post(Api.baseUri + '/user-reg/trip-route/manualCompleteTrip', postData)
      .then((res) => {
        if (res?.data?.status == '200') {
          toast.success('Trip closed successfully');
          close();
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  }

  const tableHeader = [
    'S.No',
    'Employee Code',
    'Employee Name',
    'Gender',
    data?.tripType == 'UPTRIP' ? 'Pickup Location' : 'Drop Location',
    'Vehicle Reaching time',
    'Vehicle Time Early/Delay',
    data?.tripType == 'UPTRIP' ? 'Expected Arrival Time' : 'Expected Drop Time',
    'Status',
    data?.tripType == 'UPTRIP' ? 'Boarding Time' : 'Deboarding Time',
  ];
  const onChangeInput = (e, employeeId) => {
    const {name, value} = e.target;
    console.log('name', name);
    console.log('value', value);
    console.log('employeeId', employeeId);

    const editData = empData?.map((item) =>
      item?.id === employeeId?.id && name
        ? {
            ...item,
            [name]: moment(
              employeeId?.tripDate + value,
              'YYYY-MM-DD HH:mm',
            ).valueOf(),
          }
        : item,
    );

    console.log('editData', editData);
    setEmpData(editData);
  };
  const handleChange = (e, emplId) => {
    const {name, value} = e.target;
    console.log('name', name, value);
    const editData = empData?.map((item) =>
      item?.id === emplId?.id && name
        ? {
            ...item,
            [name]: value,
          }
        : item,
    );
    console.log('editData', editData);
    setEmpData(editData);
  };
  const handleStatus = (e, status, name) => {
    const editData = empData?.map((item) =>
      item?.id === e?.id
        ? {
            ...item,
            [name]: status,
          }
        : item,
    );
    console.log('editData', editData);
    let postData = [];
    editData?.map((el) => {
      postData.push({
        ...el,
        tempactualArivalTime:
          el?.status == 'SCHEDULE'
            ? el?.actualArivalTime
            : el?.status == 'BOARDED'
            ? el?.actualArivalTime
            : el?.status == 'COMPLETED'
            ? el?.expectedArivalTime
            : el?.actualArivalTime,
      });
    });
    console.log('postData', postData);
    setEmpData(postData);
  };

  const handleReason = (e, empId) => {
    const {name, value} = e.target;
    console.log('name', name);
    console.log('value', value);
    console.log('employeeId', empId);

    const editData = empData?.map((item) =>
      item?.id === empId?.id && name
        ? {
            ...item,
            [name]: value,
          }
        : item,
    );

    console.log('editData', editData);
    setEmpData(editData);
  };

  return (
    <div
      style={{
        marginTop: '10px',
        padding: '5px',
      }}
    >
      <div style={{marginBottom: '20px'}}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell colSpan={3}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <strong>Date</strong>
                  <span>{moment(data?.date).format('DD-MM-YYYY') || 'NA'}</span>
                  <strong>Shift</strong>
                  <span>
                    {shift?.shiftName + '(' + shift?.shiftStart + ')' || 'NA'}
                  </span>
                </div>
              </TableCell>
              <TableCell colSpan={2}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    textAlign: 'center',
                  }}
                >
                  <strong style={{fontWeight: 'bold', color: 'blue'}}>
                    Trip Details
                  </strong>
                  <span>
                    <strong>Trip Id:</strong> {data?.tripCode || 'NA'}
                    <br />
                    <strong>Trip Type:</strong> {data?.tripType || 'NA'}
                    <br />
                    <strong>Route Name:</strong> {data?.routeName || 'NA'}
                  </span>
                </div>
              </TableCell>

              <TableCell colSpan={3}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    textAlign: 'center',
                  }}
                >
                  <strong style={{fontWeight: 'bold', color: 'blue'}}>
                    Driver & Vehicle Details
                  </strong>
                  <span>
                    <strong>Driver Name:</strong> {data?.driverName || 'NA'}
                    <br />
                    <strong>Vehicle No.:</strong> {data?.vehicleNo || 'NA'}
                    <br />
                    <strong>Vehicle Type:</strong> {data?.vehicleType || 'NA'}
                    <br />
                    <strong>Emp Count:</strong>{' '}
                    {data?.numberOfMalePassengers +
                      data?.numberOfFemalePassengers || 'NA'}
                  </span>
                </div>
              </TableCell>
              <TableCell colSpan={3}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    textAlign: 'center',
                  }}
                >
                  <strong style={{fontWeight: 'bold', color: 'blue'}}>
                    Vendor Details
                  </strong>
                  <span>
                    <strong>Name:</strong> {data?.vendorName || 'NA'}
                    <br />
                    {/* <strong>Status:</strong> {data?.vendorStatus || 'NA'} */}
                  </span>
                </div>
              </TableCell>
              {/* <TableCell colSpan={2}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <strong>Actual Start & End time</strong>
                  <span>
                    <strong>Start:</strong> {data?.actualStartTime || 'NA'}
                    <br />
                    <strong>End:</strong> {data?.actualEndTime || 'NA'}
                  </span>
                </div>
              </TableCell> */}
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <strong>Planned Km</strong>
                  <span>{data?.tripDistance ? data?.tripDistance / 1000 : "0" || 'NA'} KM</span>
                </div>
              </TableCell>
              <TableCell colSpan={2}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <strong>Actual Km</strong>
                  {/* <span>{data?.actualKm || 'NA'}</span> */}
                  <span>
                    <input
                      style={{
                        width: '118px',
                        padding: '5px',
                        borderRadius: '5px',

                        border: '1px solid #ccc',
                      }}
                      name='tempactualArivalTime'
                      onChange={(e)=>setActualKm(e.target.value)}
                      type='number'
                      // onChange={(e) => onChangeInput(e, el)}
                      placeholder='Actual KM'
                    />
                  </span>
                </div>
              </TableCell>
              {/* <TableCell colSpan={1}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <strong>Delay</strong>
                  <span>
                    {shift?.shiftName + '(' + shift?.shiftStart + ')' || 'NA'}
                  </span>
                </div>
              </TableCell>
              <TableCell colSpan={2}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <strong>Planned time</strong>
                  <span>{data?.plannedTime || 'NA'}</span>
                </div>
              </TableCell> */}
            </TableRow>
          </TableHead>

          {/* <TableHead>
            <TableRow>
              <TableCell colSpan={2}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <strong>Date</strong>
                  <span>{moment(data?.date).format('DD-MM-YYYY') || 'NA'}</span>
                </div>
              </TableCell>
              <TableCell colSpan={2}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <strong>Trip Id</strong>
                  <span>{data?.tripCode || 'NA'}</span>
                </div>
              </TableCell>
              <TableCell colSpan={2}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <strong>Trip Type</strong>
                  <span>{data?.tripCode || 'NA'}</span>
                </div>
              </TableCell>
              <TableCell colSpan={2}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <strong>Route Name</strong>
                  <span>{data?.routeName || 'NA'}</span>
                </div>
              </TableCell>
              <TableCell colSpan={1}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <strong>Shift</strong>
                  <span>
                    {shift?.shiftName + '(' + shift?.shiftStart + ')' || 'NA'}
                  </span>
                </div>
              </TableCell>
              <TableCell colSpan={2}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <strong>Driver Name</strong>
                  <span>{data?.driverName || 'NA'}</span>
                </div>
              </TableCell>
              <TableCell colSpan={2}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <strong>Vehicle No.</strong>
                  <span>{data?.vehicleNo || 'NA'}</span>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <strong>Vehicle type</strong>
                  <span>{data?.vehicleType || 'NA'}</span>
                </div>
              </TableCell>
              <TableCell colSpan={2}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <strong>Planned Km</strong>
                  <span>{data?.tripCode || 'NA'}</span>
                </div>
              </TableCell>
              <TableCell colSpan={2}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <strong>Actual Km</strong>
                  <span>{data?.routeName || 'NA'}</span>
                </div>
              </TableCell>
              <TableCell colSpan={1}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <strong>Delay</strong>
                  <span>
                    {shift?.shiftName + '(' + shift?.shiftStart + ')' || 'NA'}
                  </span>
                </div>
              </TableCell>
              <TableCell colSpan={2}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <strong>Emp Count</strong>
                  <span>{data?.driverName || 'NA'}</span>
                </div>
              </TableCell>
              <TableCell colSpan={2}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <strong>Vehicle No.</strong>
                  <span>{data?.vehicleNo || 'NA'}</span>
                </div>
              </TableCell>
              // <TableCell colSpan={2}>
              //   <div style={{display: 'flex', flexDirection: 'column'}}>
              //     <strong>Vehicle type</strong>
              //     <span>{data?.vehicleType || 'NA'}</span>
              //   </div>
              // </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <strong>Planned time</strong>
                  <span>{data?.vehicleType || 'NA'}</span>
                </div>
              </TableCell>
              <TableCell colSpan={2}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <strong>Actual Start time</strong>
                  <span>{data?.tripCode || 'NA'}</span>
                </div>
              </TableCell>
              <TableCell colSpan={2}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <strong>Actual End time</strong>
                  <span>{data?.routeName || 'NA'}</span>
                </div>
              </TableCell>
              <TableCell colSpan={1}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <strong>Delay</strong>
                  <span>
                    {shift?.shiftName + '(' + shift?.shiftStart + ')' || 'NA'}
                  </span>
                </div>
              </TableCell>
              <TableCell colSpan={2}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <strong>Emp Count</strong>
                  <span>{data?.driverName || 'NA'}</span>
                </div>
              </TableCell>
              <TableCell colSpan={2}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <strong>Vehicle No.</strong>
                  <span>{data?.vehicleNo || 'NA'}</span>
                </div>
              </TableCell>
              
            </TableRow>
            <TableRow>
              {tableHeader?.map((el, index) => (
                <TableCell
                  key={index}
                  // style={{background: '#A6ACAF', fontWeight: 'bold'}}
                  style={{
                    background: '#f2f2f2',
                    color: '#000',
                    fontWeight: 'bold',
                    borderBottom: '2px solid #000',
                    textAlign: 'center',
                    padding: '10px',
                  }}
                >
                  {el}
                </TableCell>
              ))}
            </TableRow>
          </TableHead> */}
          <TableRow>
            {tableHeader?.map((el, index) => (
              <TableCell
                key={index}
                // style={{background: '#A6ACAF', fontWeight: 'bold'}}
                style={{
                  background: '#f2f2f2',
                  color: '#000',
                  fontWeight: 'bold',
                  borderBottom: '2px solid #000',
                  textAlign: 'center',
                  padding: '10px',
                }}
              >
                {el}
              </TableCell>
            ))}
          </TableRow>
          <TableBody>
            {empData?.map((el, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell align='center'>{el?.empCode}</TableCell>
                <TableCell align='center'>{el?.name}</TableCell>
                <TableCell align='center'>{el?.gender}</TableCell>
                <TableCell style={{width: '200px'}} align='center'>
                  {data?.tripType == 'UPTRIP'
                    ? el?.stopPoint
                    : el?.location?.locName}
                </TableCell>
                <TableCell align='center'>
                  {moment(el?.vehicleReachingTimeactual).format('HH:mm')}
                </TableCell>
                <TableCell
                  align='center'
                  style={{
                    color:
                      getDelayOrEarlyMinutes(
                        el?.vehicleReachingTimeExpect,
                        el?.vehicleReachingTimeactual,
                      ) < 0
                        ? '#04bade'
                        : '#800000',
                  }}
                >
                  {getDelayOrEarlyMinutes(
                    el?.vehicleReachingTimeExpect,
                    el?.vehicleReachingTimeactual,
                  ) + '  min'}
                </TableCell>
                <TableCell align='center'>
                  {moment(el?.expectedArivalTime).format('HH:mm')}
                </TableCell>

                {/* <TableCell align='center'>{el?.status}</TableCell> */}
                {/* <TableCell>
                  <Select
                    labelId='demo-simple-select-label'
                    id='demo-simple-select'
                    value={el?.status}
                    label='status'
                    name='status'
                    onChange={(e) => {
                      handleChange(e, el);
                    }}
                  >
                    {statusOptions?.map((el) => {
                      return (
                        <MenuItem value={el?.value} style={{color: el?.color}}>
                          {el?.title}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </TableCell> */}
                <TableCell style={{width: '150px'}}>
                  <Grid container gap={1}>
                    <Grid item md={2}>
                      <AppTooltip title='Schedule'>
                        <div
                          style={{
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            color:
                              el?.status == 'COMPLETED'
                                ? 'white'
                                : 'rgb(5, 63, 92)',
                            border: '1px solid rgb(5, 63, 92)',
                            display: 'flex',
                            color:
                              el?.status == 'SCHEDULE'
                                ? 'white'
                                : 'rgb(5, 63, 92)',
                            alignItems: 'center',
                            background:
                              el?.status == 'SCHEDULE'
                                ? 'rgb(5, 63, 92)'
                                : 'white',
                            cursor: 'pointer',
                            justifyContent: 'center',
                          }}
                        >
                          S
                        </div>
                      </AppTooltip>
                    </Grid>
                    {data?.tripType == 'UPTRIP' && (
                      <Grid item md={2}>
                        <AppTooltip title='Boarded'>
                          <div
                            onClick={() => {
                              handleStatus(el, 'BOARDED', 'status');
                            }}
                            style={{
                              borderRadius: '50%',
                              width: '20px',
                              height: '20px',
                              color:
                                el?.status == 'BOARDED'
                                  ? 'white'
                                  : 'rgb(5, 63, 92)',
                              border: '1px solid rgb(5, 63, 92)',
                              display: 'flex',
                              color:
                                el?.status == 'BOARDED'
                                  ? 'white'
                                  : 'rgb(5, 63, 92)',
                              alignItems: 'center',
                              background:
                                el?.status == 'BOARDED'
                                  ? 'rgb(5, 63, 92)'
                                  : 'white',
                              cursor: 'pointer',
                              justifyContent: 'center',
                            }}
                          >
                            B
                          </div>
                        </AppTooltip>
                      </Grid>
                    )}

                    <Grid item md={2}>
                      <AppTooltip title='Completed'>
                        <div
                          onClick={() => {
                            handleStatus(el, 'COMPLETED', 'status');
                          }}
                          style={{
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            color:
                              el?.status == 'COMPLETED' ? 'white' : 'green',
                            border: '1px solid green',
                            display: 'flex',
                            cursor: 'pointer',
                            background:
                              el?.status == 'COMPLETED' ? 'green' : 'white',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          C
                        </div>
                      </AppTooltip>
                    </Grid>
                    <Grid item md={2}>
                      <AppTooltip title='Now Show'>
                        <div
                          onClick={() => {
                            handleStatus(el, 'NOSHOW', 'status');
                          }}
                          style={{
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            cursor: 'pointer',
                            color: el?.status == 'NOSHOW' ? 'white' : 'orange',
                            border: '1px solid orange',
                            background:
                              el?.status == 'NOSHOW' ? 'orange' : 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          N
                        </div>
                      </AppTooltip>
                    </Grid>
                    <Grid item md={2}>
                      <AppTooltip title='Absent'>
                        <div
                          onClick={() => {
                            handleStatus(el, 'ABSENT', 'status');
                          }}
                          style={{
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            cursor: 'pointer',
                            color: el?.status == 'ABSENT' ? 'white' : 'red',
                            border: '1px solid red',
                            background:
                              el?.status == 'ABSENT' ? 'red' : 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          A
                        </div>
                      </AppTooltip>
                    </Grid>
                  </Grid>
                </TableCell>
                <TableCell align='center'>
                  {el?.status == 'COMPLETED' && (
                    <input
                      style={{
                        width: '118px',
                        padding: '5px',
                        borderRadius: '5px',

                        border: '1px solid #ccc',
                      }}
                      name='tempactualArivalTime'
                      value={moment(el?.tempactualArivalTime).format('HH:mm')}
                      type='time'
                      onChange={(e) => onChangeInput(e, el)}
                      placeholder='Schedule Time'
                    />
                  )}
                  {(el?.status == 'SCHEDULE' || el?.status == 'BOARDED') &&
                    moment(el?.tempactualArivalTime).format('HH:mm')}
                </TableCell>
                {/* <TableCell>
                  <input
                    style={{
                      width: '118px',
                      padding: '5px',
                      borderRadius: '5px',

                      border: '1px solid #ccc',
                    }}
                    name='tripCompleteReason'
                    value={el?.tripCompleteReason}
                    onChange={(e) => handleReason(e, el)}
                    placeholder='Reason'
                  />
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div style={{textAlign: 'center'}}>
        <div style={{width: '100%', marginBottom: '1rem'}}>
        <TextField
                sx={{mt: 4}}
                label='Reason'
                onInput={(e) => {
                  setReason(e.target.value);
                }}
                fullWidth
              />
        </div>
        <div style={{width: '100%', margin: 'auto'}}>
          <Button variant='contained' id='btnMui123' onClick={handleSubmit}>
            Close Trip
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TripDetails;
