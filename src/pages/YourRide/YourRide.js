import React, {useState, useEffect} from 'react';

import TimeToLeaveIcon from '@mui/icons-material/TimeToLeave';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import axios from 'axios';
import Api from '@api';
import moment from 'moment';
import CustomLabel from 'pages/common/CustomLabel';
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {Dialog, DialogContent, DialogTitle, Box, Grid} from '@mui/material';
import GMap from './map';
import CloseIcon from '@mui/icons-material/Close';
import MapWithAMarker from './mappage';
import {GoogleMapsAPI} from '@smart-form/GoogleMap/g-config';
import {useAuthUser} from '@crema/utility/AuthHooks';

const YourRide = () => {
  const [data, setData] = useState();
  const navigate = useNavigate();
  const {user} = useAuthUser();
  const [myActions, setMyActions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentData, setCurrentData] = useState();
  const [id, setId] = useState();
  const permissionCheck = useSelector(({settings}) => settings.permissions);
  useEffect(() => {
    if (!permissionCheck) return;
    let sub_mod = {};
    permissionCheck?.map((el) => {
      if (el.subModuleName == 'Your Rides') sub_mod = el;
    });
    setMyActions(sub_mod?.actions);
    if (
      (!sub_mod || !sub_mod?.actions?.includes('View')) &&
      user?.userList?.userRole !== 'SUPERADMIN'
    )
      navigate('/error-pages/error-404');
  }, [permissionCheck, user]);
  useEffect(() => {
    getAllData();
  }, []);
  // const createmap = async (data) => {
  //   initialize(localStorage.getItem('mappl_access_token'), () => {
  //     afterScriptsLoaded(data);
  //   });
  // };
  async function getAllData() {
    let arr = [];
    try {
      let tem = await axios.get(
        Api.baseUri + '/user-reg/trip-driver/employee-trips/upcomming',
      );
      arr = [...arr, ...(tem?.data?.data || [])];
    } catch (err) {
      console.log(err);
    }
    try {
      let tem = await axios.get(
        Api.baseUri + '/user-reg/trip-driver/employee-trips/past',
      );
      arr = [...arr, ...(tem?.data?.data || [])];
    } catch (err) {
      console.log(err);
    }
    arr.sort((a, b) => new Date(b.dropDateTimeStr) - new Date(a.dropDateTimeStr));
    setData(arr);
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
    <>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={8}>
          <CustomLabel labelVal='Your Rides' variantVal='h3-underline' />
        </Grid>
        <Grid item xs={4}>
          <Box display='flex' justifyContent='flex-end'>
            <div className='left-seperator'></div>
          </Box>
        </Grid>
      </Grid>
      <Grid container sx={{marginTop: '20px'}}>
        {data?.map((el, index) => {
          // console.log('el', el);
          return (
            <Grid
              item
              xs={12}
              sx={{
                background: 'white',
                padding: '20px',
                boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                marginBottom: '20px',
              }}
            >
              <Grid container>
                <Grid item md={6}>
                  <div style={{display: 'flex', flexDirection: 'row'}}>
                    <div>
                      <TimeToLeaveIcon />
                    </div>
                    <div
                      style={{
                        marginLeft: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      {/* <h5 style={{ fontWeight: "700" }}>Mon, Feb 13, 07:15 PM</h5> */}
                      <h5 style={{fontWeight: '700'}}>
                        {moment(el?.shiftInTime).format('DD MMM YYYY HH:mm')}
                      </h5>
                      <h5>
                        {!el?.vehicleNumber && 'Vehicle : Not Assigned'}
                        <span style={{marginLeft: '10px'}}>
                          {!el.driverName && 'Driver : Not Assigned'}
                        </span>
                      </h5>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          marginTop: '10px',
                        }}
                      >
                        <div
                          style={{
                            color: 'orange',
                            paddingLeft: '7px',
                            display: 'flex',
                            flexDirection: 'row',
                          }}
                        >
                          <div>
                            {' '}
                            <FiberManualRecordIcon
                              sx={{fontSize: '10px'}}
                            />{' '}
                          </div>
                          <p style={{paddingLeft: '20px', color: 'grey'}}>
                            {el?.tripType == 'UPTRIP'
                              ? el?.location?.locName
                              : el?.officeLocation?.locName}
                          </p>
                        </div>
                        <div>
                          <MoreVertIcon />
                        </div>
                        <div
                          style={{
                            color: 'green',
                            paddingLeft: '7px',
                            display: 'flex',
                            flexDirection: 'row',
                          }}
                        >
                          <div>
                            <FiberManualRecordIcon sx={{fontSize: '10px'}} />
                          </div>
                          <p style={{paddingLeft: '20px', color: 'grey'}}>
                            {el?.tripType == 'UPTRIP'
                              ? el?.officeLocation?.locName
                              : el?.location?.locName}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Grid>
                <Grid item md={6}></Grid>
              </Grid>
              <Grid container>
                <Grid item md={12}>
                  <div className='urrides-tripcard'>
                    <div className='card-data-tripcard'>
                      <img
                        style={{maxHeight: '20px', height: '100%'}}
                        src={
                          '/assets/images/' +
                          (el.tripType == 'DOWNTRIP'
                            ? 'logout_icon.png'
                            : 'login_icon.png')
                        }
                      />
                      <span
                        style={{marginLeft: '10px', cursor: 'pointer'}}
                        onClick={() => {
                          setOpenDialog(true);
                          setCurrentData(el);
                          // createmap(el);
                        }}
                      >
                        {' '}
                        {el.tripCode}
                      </span>
                    </div>
                    <div className='card-data-tripcard'>
                      <img
                        style={{maxHeight: '20px', height: '100%'}}
                        src='/assets/images/group_people.png'
                      />
                      <span style={{marginLeft: '10px'}}>
                        {' '}
                        {el.noOfPassengerInTrip || 0}
                      </span>
                    </div>

                    <div className='card-data-tripcard'>
                      {/* <img src='/assets/images/trip_id.png' /> */}
                      <div
                        style={{
                          color:
                            el.status == 'COMPLETED'
                              ? 'green'
                              : el.status == 'STARTED'
                              ? 'green'
                              : el.status == 'SCHEDULE'
                              ? 'orange'
                              : 'red',
                        }}
                      >
                        {' '}
                        <div
                          style={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          {el.status == 'STARTED' && (
                            <div
                              className='ringring'
                              style={{
                                position: 'initial',
                                marginRight: '5px',
                              }}
                            ></div>
                          )}
                          <div>
                            {el.status == 'CANCLED'
                              ? 'Cancelled'
                              : el.status == 'STARTED'
                              ? 'Live'
                              : el.status == 'SCHEDULE'
                              ? 'Scheduled'
                              : el.status?.charAt(0).toUpperCase() +
                                el.status?.toLowerCase()?.slice(1)}
                          </div>
                        </div>
                      </div>
                    </div>
                    {el?.vehicleNumber?.length && (
                      <div className='card-data-tripcard'>
                        {el?.vehicleNumber}
                      </div>
                    )}

                    {el?.driverName?.length && (
                      <div className='card-data-tripcard'>{el?.driverName}</div>
                    )}
                    {el.tripCategory == 'ADHOCTRIP' && (
                      <div className='card-data-tripcard'>
                        <div style={{height: '100%'}}>
                          <img
                            style={{height: '15px'}}
                            src='/assets/images/Adhoc.svg'
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </Grid>
              </Grid>
            </Grid>
          );
        })}
      </Grid>
      <Dialog
        onClose={() => {
          setOpenDialog(false);
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
              }}
            />
          </div>
        </DialogTitle>
        <DialogContent style={{padding: '10px'}}>
          <div
            id={currentData?._id}
            style={{height: '350px', maxHeight: '100%', maxWidth: '100%'}}
          >
            {/* <GMap
              tripId={currentData?.tripId}
              stops={currentData?.location}
              psDetails={currentData}
            /> */}
            {/* <GMap
              tripId={currentData?.tripId}
              stops={[currentData?.location, currentData?.officeLocation]}
              psDetails={currentData}
            /> */}
            <MapWithAMarker
              googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GoogleMapsAPI}`}
              siteOfficeLocation={currentData?.officeLocation}
              data={currentData}
              empLocation={[currentData?.location]}
              containerElement={<div style={{height: `400px`}} />}
              mapElement={<div style={{height: `100%`}} />}
              loadingElement={`   `}
              // pullingInfo={pullingLatandlong}
              // pullingStopPage={pullingStopPage}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default YourRide;
