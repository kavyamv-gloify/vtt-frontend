import React, {useState, useEffect} from 'react';
import {Grid} from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import {Button} from '@mui/material';
import moment from 'moment';
import {templateSettings} from 'lodash';
import axios from 'axios';
import {toast} from 'react-toastify';
import Api from '@api';
const TripInfo_copy = ({content, close}) => {
  const array = ['1', '2', '3', '4', '5', '6'];
  const [escort, setEscort] = useState();
  const [emp, setEmp] = useState();
  const [escort_info, setEscort_info] = useState();
  const [trackerInput, setTrackerInput] = useState();
  const [delay, setDelay] = useState();
  const [comment, setComment] = useState();
  const values = [
    {title: 'Yes', value: 'yes'},
    {title: 'No', value: 'no'},
  ];
  const Reason = [
    {title: 'First Point Delay', value: 'First Point Delay'},
    {title: 'Vehicle Delay', value: 'Vehicle Delay'},
    {title: 'Employee Delay', value: 'Employee Delay'},
    {title: 'Traffic Delay', value: 'Traffic Delay'},
    // {title: 'First Point Delay', value: 'First Point Delay'},
  ];
  const valueArray = [
    'Guard Not Available',
    'Guard Unable to Check-in',
    'Delay in Guard Boarding',
    'Vehicle Issue',
    'Driver Issue ',
    'Vendor Issue',
    'Other',
  ];
  useEffect(() => {
    let temp = [];
    let temp_escort = [];
    console.log('content', content);
    content?.routePsDetails?.map((el) => {
      if (el?.passType == 'ESCORT') {
        return;
      }
      temp.push({title: el?.name, value: el?.empCode});
    });
    content.routePsDetails?.map((el) => {
      if (el?.passType !== 'ESCORT') {
        return;
      }
      temp_escort.push({
        title: el?.escortName,
        expect: el?.expectedArivalTime,
        actual: el?.actualPickUpDateTime,
      });
    });
    console.log(temp, 'temp');
    console.log(temp_escort);
    setEscort_info(temp_escort);
    setEmp(temp ?? []);
  }, [content]);

  return (
    <div>
      <div>
        <Grid container style={{padding: '10px'}}>
          <Grid item md={12}>
            <Grid
              container
              sx={{display: 'flex', justifyContent: 'space-between'}}
            >
              <Grid
                md={3}
                sx={{
                  //   alignItems: 'center',
                  flexDirection: 'column',
                  width: '100%',
                  margin: 'auto',
                  display: 'flex',
                }}
              >
                <p style={{fontWeight: '800', fontSize: '13px'}}>Trip Id</p>
                <p>{content?.tripCode}</p>
              </Grid>
              <Grid md={9} sx={{margin: 'auto', width: '100%'}}>
                <div>
                  <div style={{display: 'flex'}}>
                    <div>
                      <p
                        style={{
                          fontWeight: '800',
                          fontSize: '13px',
                          width: '140px',
                        }}
                      >
                        Planned Start Time
                      </p>
                      <p>{content?.startTime}</p>
                    </div>
                    <div style={{marginLeft: '60px'}}>
                      <p
                        style={{
                          fontWeight: '800',
                          fontSize: '13px',
                          width: '140px',
                        }}
                      >
                        Actual Start Time
                      </p>
                      <p>
                        {moment(content?.actualTripStartTime).format('HH:mm')}
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',

                      marginTop: '10px',
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontWeight: '800',
                          fontSize: '13px',
                          width: '140px',
                        }}
                      >
                        Planned End Time
                      </p>
                      <p>18:00:00</p>
                    </div>
                    <div style={{marginLeft: '60px'}}>
                      <p
                        style={{
                          fontWeight: '800',
                          fontSize: '13px',
                          width: '140px',
                        }}
                      >
                        Actual End Time
                      </p>
                      <p>
                        {moment(content?.actualTripCompletionTime).format(
                          'HH:mm',
                        )}
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',

                      marginTop: '10px',
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontWeight: '800',
                          fontSize: '13px',
                          width: '140px',
                        }}
                      >
                        Planned PickUp Time
                      </p>
                      <p>18:00:00</p>
                    </div>
                    <div style={{marginLeft: '60px'}}>
                      <p
                        style={{
                          fontWeight: '800',
                          fontSize: '13px',
                          width: '140px',
                        }}
                      >
                        Actual PickUp Time
                      </p>
                      <p>18:00:00</p>
                    </div>
                  </div>
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={12} sx={{marginTop: '20px'}}>
            <Grid container>
              <Grid
                md={3}
                sx={{
                  //   alignItems: 'center',
                  flexDirection: 'column',
                  width: '100%',
                  margin: 'auto',
                  display: 'flex',
                }}
              >
                <p style={{fontWeight: '800', fontSize: '13px'}}>Employees</p>
              </Grid>
              <Grid md={9}>
                <Grid item container>
                  {emp?.map((el) => {
                    return (
                      <Grid md={4} sx={{marginBottom: '5px'}}>
                        <p>{el?.title + '(' + el?.value + ')'}</p>
                      </Grid>
                    );
                  })}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={12} sx={{marginTop: '20px'}}>
            <Grid container>
              <Grid
                md={3}
                sx={{
                  //   alignItems: 'center',
                  flexDirection: 'column',
                  width: '100%',
                  margin: 'auto',
                  display: 'flex',
                }}
              >
                <p style={{fontWeight: '800', fontSize: '13px'}}>Escort</p>
              </Grid>
              <Grid md={9}>
                <Autocomplete
                  disablePortal
                  options={values}
                  getOptionLabel={(option) => option.title}
                  onChange={(e, v) => {
                    console.log('v', v);
                    setEscort(v);
                  }}
                  sx={{width: 300}}
                  renderInput={(params) => <TextField {...params} />}
                />
                {escort?.value == 'yes' && (
                  <div>
                    <p style={{fontSize: '13px', marginTop: '10px'}}>
                      {escort_info[0]?.title}
                    </p>
                    <div style={{display: 'flex', marginTop: '10px'}}>
                      <div>
                        <p
                          style={{
                            fontWeight: '800',
                            fontSize: '13px',
                            width: '140px',
                          }}
                        >
                          Planned PickUp Time
                        </p>
                        <p>{moment(escort_info[0]?.expect).format('HH:mm')}</p>
                      </div>
                      <div style={{marginLeft: '60px'}}>
                        <p
                          style={{
                            fontWeight: '800',
                            fontSize: '13px',
                            width: '140px',
                          }}
                        >
                          Actual PickUp Time
                        </p>
                        <p>{moment(escort_info[0]?.actual).format('HH:mm')}</p>
                      </div>
                    </div>
                  </div>
                )}
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={12} sx={{marginTop: '20px'}}>
            <Grid container>
              <Grid
                md={3}
                sx={{
                  //   alignItems: 'center',
                  flexDirection: 'column',
                  width: '100%',
                  margin: 'auto',
                  display: 'flex',
                }}
              >
                <p style={{fontWeight: '800', fontSize: '13px'}}>Delay</p>
              </Grid>
              <Grid md={9}>
                <Autocomplete
                  disablePortal
                  options={values}
                  getOptionLabel={(option) => option.title}
                  onChange={(e, v) => {
                    console.log('v', v);
                    setDelay(v);
                  }}
                  sx={{width: 300}}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid>
            </Grid>
          </Grid>
          {delay?.value == 'yes' && (
            <Grid item md={12} sx={{marginTop: '20px'}}>
              <Grid container>
                <Grid
                  md={3}
                  sx={{
                    // alignItems: 'center',
                    flexDirection: 'column',
                    width: '100%',
                    margin: 'auto',
                    display: 'flex',
                  }}
                >
                  <p style={{fontWeight: '800', fontSize: '13px'}}>Reason</p>
                </Grid>
                <Grid md={9}>
                  <Autocomplete
                    disablePortal
                    options={Reason}
                    getOptionLabel={(option) => option?.title}
                    onChange={(e, v) => {
                      console.log('v', v);
                      setEscort(v);
                    }}
                    sx={{width: 300}}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Grid>
              </Grid>
            </Grid>
          )}

          <Grid item md={12} sx={{marginTop: '20px'}}>
            <Grid container>
              <Grid
                md={3}
                sx={{
                  //   alignItems: 'center',
                  flexDirection: 'column',
                  width: '100%',
                  margin: 'auto',
                  display: 'flex',
                }}
              >
                <p style={{fontWeight: '800', fontSize: '13px'}}>
                  Vehicle Reg No.
                </p>
              </Grid>
              <Grid md={9}>
                <p>{content?.vehicleNo}</p>
              </Grid>
            </Grid>
          </Grid>

          <Grid item md={12} sx={{marginTop: '20px'}}>
            <Grid container>
              <Grid
                md={3}
                sx={{
                  //   alignItems: 'center',
                  flexDirection: 'column',
                  width: '100%',
                  margin: 'auto',
                  display: 'flex',
                }}
              >
                <p style={{fontWeight: '800', fontSize: '13px'}}>Vendor Name</p>
              </Grid>
              <Grid md={9}>
                <p>{content?.vendorName}</p>
              </Grid>
            </Grid>
          </Grid>

          <Grid item md={12} sx={{marginTop: '20px'}}>
            <Grid container>
              <Grid
                md={3}
                sx={{
                  //   alignItems: 'center',
                  flexDirection: 'column',
                  width: '100%',
                  margin: 'auto',
                  display: 'flex',
                }}
              >
                <p style={{fontWeight: '800', fontSize: '13px'}}>Driver Name</p>
              </Grid>
              <Grid md={9}>
                <p>{content?.driverName}</p>
              </Grid>
            </Grid>
          </Grid>

          <Grid item md={12} sx={{marginTop: '20px'}}>
            <Grid container>
              <Grid
                md={3}
                sx={{
                  //   alignItems: 'center',
                  flexDirection: 'column',
                  width: '100%',
                  margin: 'auto',
                  display: 'flex',
                }}
              >
                <p style={{fontWeight: '800', fontSize: '13px'}}>
                  Driver Mobile No.
                </p>
              </Grid>
              <Grid md={9}>
                <p>{content?.driverMobileNo}</p>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={12} sx={{marginTop: '20px'}}>
            <Grid container>
              <Grid
                md={3}
                sx={{
                  //   alignItems: 'center',
                  flexDirection: 'column',
                  width: '100%',
                  margin: 'auto',
                  display: 'flex',
                }}
              >
                <p style={{fontWeight: '800', fontSize: '13px'}}>
                  Tracker Input
                </p>
              </Grid>
              <Grid md={9}>
                <Autocomplete
                  disablePortal
                  value={trackerInput}
                  id='combo-box-demo'
                  options={valueArray}
                  onChange={(e, d) => {
                    console.log('e', e, d);
                    setTrackerInput(d);
                  }}
                  sx={{width: 300}}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={12} sx={{marginTop: '20px'}}>
            <Grid container>
              <Grid
                md={3}
                sx={{
                  //   alignItems: 'center',
                  flexDirection: 'column',
                  width: '100%',
                  margin: 'auto',
                  display: 'flex',
                }}
              >
                <p style={{fontWeight: '800'}}>{'Comment'}</p>
              </Grid>
              <Grid md={9}>
                <TextField
                  multiline
                  value={comment}
                  onInput={(e) => {
                    // console.log(e?.target?.value);
                    setComment(e?.target?.value);
                  }}
                  sx={{width: '300px'}}
                  maxRows={6}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={12} sx={{marginTop: '20px'}}>
            <div
              style={{
                width: '100%',
                textAlign: 'center',
              }}
            >
              <Button
                variant='contained'
                sx={{mr: 4}}
                onClick={() => {
                  let postData = [
                    {
                      tripId: content?._id,
                      trackerInput: trackerInput,
                      comments: comment,
                    },
                  ];
                  console.log('postData', postData);

                  axios
                    .post(
                      Api.baseUri + '/user-reg/trip-route/addCommentTrip',
                      postData,
                    )
                    .then((res) => {
                      if (res?.data?.status == '200') {
                        close();
                        toast.success('Comment submitted successfully');
                      }
                    })
                    .catch((err) => {
                      toast.error('Something went wrong');
                    });
                }}
              >
                Submit
              </Button>
              <Button
                variant='contained'
                onClick={() => {
                  close();
                }}
              >
                Close
              </Button>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default TripInfo_copy;
