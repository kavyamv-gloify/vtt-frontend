import React, {useState, useEffect} from 'react';
import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import AppTooltip from '@crema/core/AppTooltip';
import PeopleIcon from '@mui/icons-material/People';
import moment from 'moment';
import {Dialog, DialogContent, DialogTitle, Grid} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import Api from '@api';
import GMap from './map';
import Battery4BarIcon from '@mui/icons-material/Battery4Bar';
import InfoIcon from '@mui/icons-material/Info';
import IconInfo from '../IconInfo/IconInfo';
import TripInfo from './TripInfo';
import TripInfo_copy from './TripInfo_copy';
import TripStepper from '../TripStepper';
import io from 'socket.io-client';
import {useAuthUser} from '@crema/utility/AuthHooks';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import _ from 'lodash';
const host = Api?.baseUri;
const socket = io(host, {path: '/api/socket.io/'});
const GridBoxCopy = ({data, getAllData}) => {
  console.log('data', data);
  // console.log(data, 'datadatadatadatadatadata');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentData, setCurrentData] = useState();
  const [openStepper, setOpenStepper] = useState(false);
  const [open, setOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState();
  const [driver, setDriver] = useState();
  const [id, setId] = useState();
  const [socketData, setSocketData] = useState({});
  const {user} = useAuthUser();
  // console.log(currentData, 'mmmmmmmm');
  // useEffect(() => {
  //   data?.map((el) => {
  //     el.car = 'sssss';
  //   });
  // }, []);
  useEffect(() => {
    socket.emit('add-user', user?.userList?.corporateId);
  }, [user]);
  useEffect(() => {
    let myd_ = {};
    socket.on('live-vehicles', (t_data) => {
      Object.keys(t_data)?.map((ele) => {
        myd_[t_data[ele]?.tripId] = t_data[ele];
      });
      setSocketData({...myd_});
    });
  }, [data]);
  useEffect(() => {
    data?.map((elm) => {
      // console.log(elm, socketData, 'socketDatasocketDatasocketDatasocketData');
      elm.BATTERY_PERC = socketData[elm?._id]?.mobileBatteryStatus || 0;
      elm.IsGPS = socketData[elm._id]?.GPS_SIGNAL_LOST || true;
      elm.networkStrength = socketData[elm._id]?.networkStrength || 0;
      elm.status = socketData[elm._id]?.tripStatus || elm.status;
    });
    // console.log(data, 'APUNICCCCCH BHAGWAAN HAI');
  }, [socketData]);
  function getDelayOrEarlyMinutes(expectedTime, arrivalTime) {
    let expected = expectedTime;
    let arrival = arrivalTime;
    let secDiff = Math.floor((arrival - expected) / 1000);
    let minutesDiff = Math.floor(secDiff / 60);
    return minutesDiff.toString().slice(0, 3);
  }
  const Item = styled(Paper)(({theme}) => ({
    padding: theme.spacing(1),
    textAlign: 'center',
    borderRadius: '20px',
  }));
  // console.log('<<<data', data);
  const Status = {
    Female_SCHEDULE: '/assets/images/FemaleEmployee.png',
    Male_SCHEDULE: '/assets/images/maleEmployee.png',
    Female_NOSHOW: '/assets/images/FemaleEmployeeNShow.png',
    Male_NOSHOW: '/assets/images/maleEmployeeNoShow.png',
    Female_BOARDED: '/assets/images/FemaleEmployeeBoarded.png',
    Male_BOARDED: '/assets/images/maleEmployeeBoarded.png',
    Female_COMPLETED: '/assets/images/FemaleEmployeeDeborded.png',
    Male_COMPLETED: '/assets/images/maleEmployeeDeboarded.png',
    Female_Delayed: '/assets/images/female-icon.svg',
    Male_Delayed: '/assets/images/male.svg',
    Female_Timely: '/assets/images/FemaleEmployeeReachednTime.png',
    Male_Timely: '/assets/images/maleEmployeeReachednTime.png',
    Female_ABSENT: '/assets/images/female-absent-icon.svg',
    Male_ABSENT: '/assets/images/male-absent.svg',
    Female_CANCLED: '/assets/images/female-cancel-icon.svg',
    Male_CANCLED: '/assets/images/male-cancel.svg',
  };
  const escortStatus = {
    BOARDED: '/assets/images/escort_skipped.svg',
    SCHEDULE: '/assets/images/Escort3.png',
    COMPLETED: '/assets/images/EscortCheckedIn.png',
    SKIPPED: '/assets/images/EscortNotDeployed.png',
  };

  const handleMouseEnter = (e) => {
    if (e.length) {
      axios.get(Api.baseUri + '/user-reg/driver-reg' + e).then((res) => {
        console.log('res>>>', res);
        setDriver({
          firstName: res?.data?.data?.firstName,
          lastName: res?.data?.data?.lastName,
        });
      });
    } else return;
  };

  const handleMouseLeave = (e) => {
    setDisplayShift({});
  };

  const createmap = async (data) => {
    initialize(localStorage.getItem('mappl_access_token'), () => {
      afterScriptsLoaded(data);
    });
  };
  function initialize(mmiToken, loadCallback) {
    try {
      if (mmiToken) {
        let count = 0;
        //Insert your script seperated by comma like scriptArr = [mapSDK_url, plugins_url];
        // checking map key is working or not
        fetch(
          'https://apis.mappls.com/advancedmaps/api/' +
            mmiToken +
            '/map_sdk?layer=vector&v=3.0',
          {
            method: 'GET',
          },
        ).then((response) => {
          //
          if (response?.status && response?.status != 200) {
            // map key is not working and have to rtegenerate
            fetch(Api.baseUri + '/userauth/app/mapkey/generate', {
              method: 'GET',
            })
              .then((response) => response.json())
              .then((response) => {
                if (response?.status != 200) {
                  // map key not generated
                  toast.error(
                    'Something went wrong with map key. Please contact to system administrator.',
                  );
                } else {
                  // new map key generated
                  localStorage.setItem('mappl_access_token', response?.data);
                  let mapSDK_url =
                    'https://apis.mappls.com/advancedmaps/api/' +
                    response?.data +
                    '/map_sdk?layer=vector&v=3.0';
                  let plugins_url =
                    'https://apis.mappls.com/advancedmaps/api/' +
                    response?.data +
                    '/map_sdk_plugins?v=3.0';
                  var scriptArr = [mapSDK_url, plugins_url];
                  const recursivelyAddScript = (script) => {
                    if (count < script.length) {
                      const el = document.createElement('script');
                      el.src = script[count];
                      el.async = true;
                      el.type = 'text/javascript';
                      document.getElementsByTagName('head')[0].appendChild(el);
                      count = count + 1;
                      el.onload = function () {
                        recursivelyAddScript(script);
                      };
                    } else {
                      return loadCallback();
                    }
                  };
                  recursivelyAddScript(scriptArr);
                }
              });
          } else {
            // mapp key is working
            let mapSDK_url =
              'https://apis.mappls.com/advancedmaps/api/' +
              mmiToken +
              '/map_sdk?layer=vector&v=3.0';
            let plugins_url =
              'https://apis.mappls.com/advancedmaps/api/' +
              mmiToken +
              '/map_sdk_plugins?v=3.0';
            var scriptArr = [mapSDK_url, plugins_url];
            const recursivelyAddScript = (script) => {
              if (count < script.length) {
                const el = document.createElement('script');
                el.src = script[count];
                el.async = true;
                el.type = 'text/javascript';
                document.getElementsByTagName('head')[0].appendChild(el);
                count = count + 1;
                el.onload = function () {
                  recursivelyAddScript(script);
                };
              } else {
                return loadCallback();
              }
            };
            recursivelyAddScript(scriptArr);
          }
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  function afterScriptsLoaded(data) {
    let userImgs = [];
    let startPointLabel = '';
    if (data?.stopList[0]?.onBoardPassengers?.length > 0) {
      data?.stopList[0]?.onBoardPassengers.forEach((ud, idx) => {
        startPointLabel = `${startPointLabel}<div class='point-details onboard'><span class='img-s'><img class='user-image' src='${
          Api.imgUrl
        }${ud?.photo}' /></span><span class='user-info'><h4>${
          ud?.name
        }</h4><p class='eta-time'>${
          data?.stopList[0]?.expectedArivalTimeStr?.split(' ')[1]
        }</p><p>${ud?.location?.locName}</p></span></div>`;
      });
    } else if (data?.stopList[0]?.deBoardPassengers?.length > 0) {
      data?.stopList[0]?.deBoardPassengers.forEach((ud, idx) => {
        startPointLabel = `${startPointLabel}<div class='point-details deboard'><span class='img-s'><img class='user-image' src='${
          Api.imgUrl
        }${ud?.photo}' /></span><span class='user-info'><h4>${
          ud?.name
        }</h4><p class='eta-time'>${
          data?.stopList[0]?.expectedArivalTimeStr?.split(' ')[1]
        }</p><p>${ud?.location?.locName}</p></span></div>`;
      });
    } else {
      startPointLabel = `<div class='point-details'>${data?.stopList[0]?.location?.locName}</div>`;
    }
    let endPointLabel = '';
    if (
      data?.stopList[data?.stopList?.length - 1]?.onBoardPassengers?.length > 0
    ) {
      data?.stopList[data?.stopList?.length - 1]?.onBoardPassengers.forEach(
        (ud, idx) => {
          endPointLabel = `${endPointLabel}<div class='point-details onboard'><span class='img-s'><img class='user-image' src='${
            Api.imgUrl
          }${ud?.photo}' /></span><span class='user-info'><h4>${
            ud?.name
          }</h4><p class='eta-time'>${
            data?.stopList[
              data?.stopList?.length - 1
            ]?.expectedArivalTimeStr?.split(' ')[1]
          }</p><p>${ud?.location?.locName}</p></span></div>`;
        },
      );
    } else if (
      data?.stopList[data?.stopList?.length - 1]?.deBoardPassengers?.length > 0
    ) {
      data?.stopList[data?.stopList?.length - 1]?.deBoardPassengers.forEach(
        (ud, idx) => {
          endPointLabel = `${endPointLabel}<div class='point-details deboard'><span class='img-s'><img class='user-image' src='${
            Api.imgUrl
          }${ud?.photo}' /></span><span class='user-info'><h4>${
            ud?.name
          }</h4><p class='eta-time'>${
            data?.stopList[
              data?.stopList?.length - 1
            ]?.expectedArivalTimeStr?.split(' ')[1]
          }</p><p>${ud?.location?.locName}</p></span></div>`;
        },
      );
    } else {
      endPointLabel = `<div class='point-details'>${
        data?.stopList[data?.stopList?.length - 1]?.location?.locName
      }</div>`;
    }
    let startPoint = {
      label: startPointLabel,
      geoposition:
        data?.stopList[0]?.location?.latitude +
        ',' +
        data?.stopList[0]?.location?.longitude,
    };
    let endPoint = {
      label: endPointLabel,
      geoposition:
        data?.stopList[data?.stopList?.length - 1]?.location?.latitude +
        ',' +
        data?.stopList[data?.stopList?.length - 1]?.location?.longitude,
    };
    let viaPoints = [];
    if (data?.stopList?.length > 2) {
      for (let i = 1; i < data?.stopList?.length; i++) {
        if (
          data?.stopList[i]?.onBoardPassengers?.length > 0 ||
          data?.stopList[i]?.deBoardPassengers?.length > 0
        ) {
          let viaPointLabel = '';
          if (data?.stopList[i]?.onBoardPassengers?.length > 0) {
            data?.stopList[i]?.onBoardPassengers.forEach((ud, idx) => {
              viaPointLabel = `${viaPointLabel}<div class='point-details onboard'><span class='img-s'><img class='user-image' src='${
                Api.imgUrl
              }${ud?.photo}' /></span><span class='user-info'><h4>${
                ud?.name
              }</h4><p class='eta-time'>${
                data?.stopList[i]?.expectedArivalTimeStr?.split(' ')[1]
              }</p><p>${ud?.location?.locName}</p></span></div>`;
            });
          } else if (data?.stopList[i]?.deBoardPassengers?.length > 0) {
            data?.stopList[i]?.deBoardPassengers.forEach((ud, idx) => {
              viaPointLabel = `${viaPointLabel}<div class='point-details deboard'><span class='img-s'><img class='user-image' src='${
                Api.imgUrl
              }${ud?.photo}' /></span><span class='user-info'><h4>${
                ud?.name
              }</h4><p class='eta-time'>${
                data?.stopList[i]?.expectedArivalTimeStr?.split(' ')[1]
              }</p><p>${ud?.location?.locName}</p></span></div>`;
            });
          } else {
            viaPointLabel = `<div class='point-details'>${data?.stopList[i]?.location?.locName}</div>`;
          }
          // userImgs.push(data?.stopList[i]?.onBoardPassengers[0]?.photo)
          viaPoints.push({
            label: viaPointLabel,
            geoposition:
              data?.stopList[i]?.location?.latitude +
              ',' +
              data?.stopList[i]?.location?.longitude,
          });
        }
      }
    }
    var div = document.getElementById(tripId);
    while (div.firstChild) {
      div.removeChild(div?.firstChild);
    }
    mapObject = '';
    mapObject = window.mappls.Map(tripId, {
      center: [
        data?.stopList[0]?.location?.latitude,
        data?.stopList[0]?.location?.longitude,
      ],
      zoom: 8,
      zoomControl: false,
    });
    if (mapObject !== undefined && mapObject !== '') {
      var direction_option = {
        map: mapObject,
        divWidth: '0px',
        // divHeigth:'400px',
        isDraggable: false,
        start: startPoint,
        end: endPoint,
        Profile: ['driving', 'biking', 'trucking', 'walking'],
        via: viaPoints,
        start_icon: {
          html: `<div class='marker-pin'><img src='https://maps.mappls.com/images/from.png' /></div>`,
          width: 30,
          height: 40,
        },
        end_icon: {
          html: `<div class='marker-pin'><img src='https://maps.mappls.com/images/to.png' /></div>`,
          width: 30,
          height: 40,
        },
        via_icon: {
          html: `<div class='marker-pin'><img src='https://maps.mappls.com/images/2.png' /></div>`,
          width: 30,
          height: 40,
        },
      };

      new window.mappls.direction(direction_option, function (data) {
        direction_plugin = data;
      });
    }
  }
  return (
    <div>
      {/* <Box sx={{width: '5px'}}>
        <AppCircularProgress activeColor='#F04F47' value={59} thickness={2} />
      </Box> */}

      <Grid container spacing={4}>
        {data?.map((el) => {
          // console.log('el', el);
          return (
            <Grid item md={3} sm={4} xs={12}>
              {/* <Item> */}

              <Grid
                container
                sx={{
                  // boxShadow: '5px 5px 5px rgba(68, 68, 68, 0.6)',
                  boxShadow:
                    'rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px',
                  borderRadius: '10px',
                  position: 'relative',
                }}
              >
                <Grid
                  md={12}
                  xs={12}
                  sm={12}
                  sx={{
                    background: 'white',
                    borderRadius: '10px 10px 0px 0px',
                    padding: '14px',
                    borderLeft:
                      el?.status == 'SCHEDULE'
                        ? '6px solid red'
                        : el?.status == 'COMPLETED'
                        ? '6px solid green'
                        : el?.status == 'STARTED'
                        ? '6px solid #053f5c'
                        : ' ',
                    borderRight:
                      el?.escortTrip == 'YES'
                        ? '6px solid #f7007a'
                        : '6px solid white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    justifyItems: 'center',
                    alignItems: 'center',
                  }}
                >
                  <AppTooltip
                    // onMouseEnter={() => handleMouseEnter(el?.driverId )}
                    // onMouseLeave={() => handleMouseLeave()}
                    title={
                      <>
                        <span>
                          Driver Name:
                          {el?.driverName ?? 'Not Assigned'}
                        </span>
                        <br />
                        <span>
                          Vendor Name: {el?.vendorName ?? 'Not Assigned'}
                        </span>
                      </>
                    }
                  >
                    <p style={{fontWeight: 'bold', color: 'blue'}}>
                      <a
                        href='#'
                        onClick={() => {
                          setOpenDialog(true);
                          setCurrentData(el);
                          createmap(el);
                        }}
                      >
                        {el?.tripCode}
                      </a>
                    </p>
                  </AppTooltip>
                  <div style={{display: 'flex', justifyItems: 'center'}}>
                    <PeopleIcon sx={{color: 'grey'}} />
                    <p style={{marginTop: '3px', marginLeft: '5px'}}>
                      {el?.routePsDetails?.length}
                    </p>
                  </div>
                  <div style={{display: 'flex'}}>
                    <AppTooltip
                      title={
                        <div>
                          <span>{el?.BATTERY_PERC || 0}</span>
                          <span>{'%'}</span>
                        </div>
                      }
                    >
                      <Battery4BarIcon
                        sx={{
                          fontSize: 'medium',
                          marginTop: '6px',
                          marginRight: '10px',
                        }}
                      />
                    </AppTooltip>
                    <div>
                      <AppTooltip
                        placement={'top'}
                        title={
                          <>
                            <span>
                              <strong>GPS Strength:</strong>
                              {el?.networkStrength ?? '--'}%
                            </span>
                            <br />
                            <span>
                              <strong>Vehicle No.:</strong>
                              {el?.vehicleDetail?.[0]?.vehicleNumberPlate ??
                                'Not Assigned'}
                            </span>
                            <br />
                            <span>
                              <strong>Vehicle Brand:</strong>
                              {el?.vehicleDetail?.[0]?.vehicleBrand ??
                                'Not Assigned'}
                            </span>
                            <br />
                            <span>
                              <strong>Vehicle Model:</strong>
                              {el?.vehicleDetail?.[0]?.modelNo ??
                                'Not Assigned'}
                            </span>
                          </>
                        }
                      >
                        <div style={{display: 'flex'}}>
                          {/* <p
                          style={{
                            fontSize: '12px',
                            fontWeight: '500',
                            marginTop: '10px',
                          }}
                        >
                          {el?.networkStrength}
                        </p> */}
                          <img
                            src={
                              el?.networkStrength > 0
                                ? '/assets/images/GPSDeviceAvialable.png'
                                : '/assets/images/GPSDeviceOffline.png'
                            }
                            alt='P'
                          />
                        </div>
                      </AppTooltip>
                    </div>
                  </div>
                </Grid>
                <Grid
                  md={12}
                  xs={12}
                  sm={12}
                  sx={{
                    background: '#f5f7fe',
                    borderRadius: '0 0 10px 10px',
                    padding: '14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    justifyItems: 'center',
                    alignItems: 'center',
                    borderLeft:
                      el?.status == 'SCHEDULE'
                        ? '6px solid red'
                        : el?.status == 'COMPLETED'
                        ? '6px solid green'
                        : el?.status == 'STARTED'
                        ? '6px solid #053f5c'
                        : ' ',
                    borderRight:
                      el?.escortTrip == 'YES' ? '6px solid #f7007a' : '',
                  }}
                >
                  <div style={{display: 'flex'}}>
                    {el?.routePsDetails?.map((e) => {
                      if (e?.passType == 'ESCORT') {
                        return (
                          <AppTooltip
                            placement='top'
                            title={
                              <div>
                                <span>{'Name:' + e?.name}</span>
                                <br />
                                <span>
                                  {/* {'Checkin:-' +
                                    (e?.actualPickUpDateTime == 0
                                      ? '--'
                                      : moment(e?.actualPickUpDateTime).format(
                                          'hh:mm',
                                        ))} */}
                                  {'Boarded Time:-' +
                                    (e?.actualPickUpDateTime == 0
                                      ? '--'
                                      : moment(e?.actualPickUpDateTime).format(
                                          'hh:mm',
                                        ))}
                                </span>
                                <br />
                                <span>
                                  {/* {'Actual Arrival:-' +
                                    (e?.actualArivalTime == 0
                                      ? '--'
                                      : moment(e?.actualArivalTime).format(
                                          'hh:mm',
                                        ))} */}
                                  {'Actual Arrival Time:-' +
                                    (e?.actualArivalTime == 0
                                      ? '--'
                                      : moment(e?.actualArivalTime).format(
                                          'hh:mm',
                                        ))}
                                </span>
                                <br />
                              </div>
                            }
                          >
                            <img
                              src={escortStatus[e?.status]}
                              style={{
                                width: '20px',
                                height: '20px',
                                marginTop: '5px',
                              }}
                            />
                          </AppTooltip>
                        );
                      }
                    })}

                    {el?.routePsDetails?.map((e, ind) => {
                      if (e?.passType == 'EMPLOYEE' && ind <= 2) {
                        return (
                          <AppTooltip
                            placement={'top'}
                            title={
                              <>
                                <div>
                                  <span>
                                    {e?.name + '(' + e?.empCode + ')'}
                                  </span>
                                  <br />
                                  <span>
                                    {'Boarded Time:-' +
                                      (e?.actualPickUpDateTime == 0
                                        ? '--'
                                        : moment(
                                            e?.actualPickUpDateTime,
                                          ).format('hh:mm'))}
                                  </span>
                                  <br />
                                  <span>
                                    {'ETA:-' +
                                      (e?.expectedArivalTime == 0
                                        ? '--'
                                        : moment(e?.expectedArivalTime).format(
                                            'hh:mm',
                                          ))}
                                  </span>
                                  <br />
                                  <span>
                                    {/* {'Actual Arrival:-' +
                                      (e?.actualArivalTime == 0
                                        ? '--'
                                        : moment(e?.actualArivalTime).format(
                                            'hh:mm',
                                          ))} */}
                                    {'Actual Arrival Time:-' +
                                      (e?.actualArivalTime == 0
                                        ? '--'
                                        : moment(e?.actualArivalTime).format(
                                            'hh:mm',
                                          ))}
                                  </span>
                                </div>
                              </>
                            }
                          >
                            <img
                              src={Status[e?.gender + '_' + e?.status]}
                              alt='P'
                              style={{
                                marginTop: '5px',
                                width: '20px',
                                height: '20px',
                                marginLeft: '10px',
                              }}
                            />
                          </AppTooltip>
                        );
                      }
                    })}
                    <div>
                      <MoreHorizIcon
                        sx={{
                          marginTop: '15px',
                          fontSize: '12px',
                          fontWeight: '500',
                        }}
                        onClick={() => {
                          setOpenStepper(true);
                          setId(el);
                        }}
                      />
                    </div>
                  </div>
                  <div style={{display: 'flex'}}>
                    <div>
                      <InfoIcon
                        sx={{
                          fontSize: '20px',
                          color: '#77c3ec',
                          marginTop: '5px',
                          marginRight: '10px',
                        }}
                        onClick={() => {
                          setOpen(true);
                        }}
                      />
                    </div>

                    <div>
                      <img
                        src={'/assets/images/tripsheetOffline.png'}
                        alt='P'
                        style={{marginRight: '5px', marginTop: '5px'}}
                        onClick={() => {
                          // console.log('shreya');
                          setOpenDetail(true);
                          // console.log('el', el);
                          setCurrentData(el);
                        }}
                      />
                    </div>
                  </div>
                </Grid>
              </Grid>
              {/* </Item> */}
            </Grid>
          );
        })}
      </Grid>
      <Dialog
        onClose={() => {
          setOpenDialog(false);
          getAllData();
        }}
        open={openDialog}
        maxWidth='false'
        style={{padding: '34px'}}
        PaperProps={{
          sx: {
            width: '60%',
          },
        }}
        // onClose={() => { handleClose("NO") }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle
          style={{
            background: '#f5f2f2',
            fontSize: '22px',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <h2>{currentData?.tripCode}</h2>
          <div>
            <CloseIcon
              style={{color: '#4f4f4f', fontWeight: 'bold'}}
              onClick={() => {
                setOpenDialog(false);
                getAllData();
              }}
            />
          </div>
        </DialogTitle>
        <DialogContent style={{padding: '10px'}}>
          <div
            id={currentData?._id}
            style={{height: '350px', maxHeight: '100%', maxWidth: '100%'}}
          >
            <GMap
              tripId={currentData?._id}
              stops={currentData?.stopList}
              psDetails={_.groupBy(currentData?.routePsDetails, '_id')}
              polyLine={currentData?.polyLine}
            />
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        onClose={() => {
          setOpen(false);
        }}
        open={open}
        maxWidth='false'
        style={{padding: '34px'}}
        PaperProps={{
          sx: {
            width: '60%',
          },
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle
          style={{
            background: 'rgb(245, 242, 242)',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <h1>INFORMATION</h1>
          <div>
            <CloseIcon
              style={{color: '#4f4f4f', fontWeight: 'bold'}}
              onClick={() => {
                setOpen(false);
              }}
            />
          </div>
        </DialogTitle>
        <DialogContent style={{padding: '40px'}}>
          {' '}
          <IconInfo
            close={() => {
              setOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
      <Dialog
        onClose={() => {
          setOpenStepper(false);
        }}
        open={openStepper}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '800px',
            borderRadius: '20px',
          },
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle style={{backgroundColor: 'rgb(245, 242, 242)'}}>
          <h1 style={{display: 'flex'}}>
            <img
              src={
                '/assets/images/' +
                ('UPTRIP' == 'UPTRIP' ? 'login_icon.png' : 'login_icon.png')
              }
              style={{marginTop: '4px', height: '26px', marginRight: '10px'}}
            />
            {id?.tripCode}
          </h1>
          <CloseIcon
            style={{position: 'absolute', top: '14px', right: '12px'}}
            onClick={() => {
              setOpenStepper(false);
            }}
          />
        </DialogTitle>
        <DialogContent>
          <TripStepper tripId={id} />
        </DialogContent>
      </Dialog>
      <Dialog
        onClose={() => {
          setOpenDetail(false);
        }}
        open={openDetail}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '700px',
            borderRadius: '10px',
          },
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle
          style={{
            background: 'rgb(245, 242, 242)',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <h1>Trip Details</h1>
          <div>
            <CloseIcon
              style={{color: '#4f4f4f', fontWeight: 'bold'}}
              onClick={() => {
                setOpenDetail(false);
              }}
            />
          </div>
        </DialogTitle>
        <DialogContent style={{padding: '20px 0 20px 0'}}>
          <TripInfo
            content={currentData}
            close={() => {
              setOpenDetail(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GridBoxCopy;
