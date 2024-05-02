import React, {useState, useEffect, useMemo} from 'react';
import styles from './TripSpare.module.css';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import GroupsIcon from '@mui/icons-material/Groups';
import Api from '@api';
import moment from 'moment';
import {Tooltip, Grid} from '@mui/material';
import MapWithAMarker from './map';
import {GoogleMapsAPI} from '@smart-form/GoogleMap/g-config';
import axios from 'axios';
import {useAuthUser} from '@crema/utility/AuthHooks';
import MoreVertIcon from '@mui/icons-material/MoreVert';
const TripSpare = ({tripdata}) => {
  const [siteOfficeLocation, setSiteOfficeLocation] = useState({});
  const [empDetail, setEmpDetail] = useState();
  const {user} = useAuthUser();
  const [MyStops, setMyStops] = useState([
    // {
    //   lat: parseFloat(el.location?.latitude),
    //   lng: parseFloat(el.location?.longitude),
    //   locName: el.location?.locName,
    //   id: ind + 'v',
    // },
  ]);
  useEffect(() => {
    console.log('tripData', tripdata);
    let temp = [];

    // Initialize empDetail and myStops to default values
    setEmpDetail(null);
    setMyStops([]);

    tripdata?.map((el) => {
      el?.stopList?.map((e) => {
        e?.onBoardPassengers?.map((_e, ind) => {
          if (_e?.empId == user?.userList?.profileId) {
            console.log('el', el[ind]);
            setEmpDetail({
              ..._e,
              escortName: el?.escortName,
              eta: e?.expectedArivalTimeStr,
            });
            setMyStops([
              {
                lat: parseFloat(_e?.location?.latitude),
                lng: parseFloat(_e?.location?.longitude),
                locName: _e?.location?.locName,
                id: ind + 'v',
              },
            ]);
          }
        });
      });
    });
  }, [tripdata]);

  useEffect(() => {
    console.log('empDetail', empDetail);
  }, [empDetail]);
  useEffect(() => {
    if (location?.officeLocation) {
      setMyStops([
        {
          lat: parseFloat(location?.pickupLocation?.latitude),
          lng: parseFloat(location?.pickupLocation?.longitude),
          locName: location?.pickupLocation?.locName,
          id: 1 + 'v',
        },
        {
          lat: parseFloat(location?.officeLocation?.latitude),
          lng: parseFloat(location?.officeLocation?.longitude),
          locName: location?.officeLocation?.locName,
          id: 0 + 'v',
        },
      ]);
    }
  }, [location]);
  useEffect(() => {
    axios
      .get(`${Api.siteOffice.list}/corporate?page=0&size=1000&officeName=null`)
      .then((res) => {
        setSiteOfficeLocation({
          ...res.data.data.body['SiteOffice List'][0].location,
          isOfc: true,
          officeName: res.data.data.body['SiteOffice List'][0].officeName,
        });
      });
  }, []);
  return (
    <>
      <div className={styles.parentContainer} styles={{height: '0px'}}>
        {empDetail ? (
          <>
            <div className={styles.heading}>
              <h2>Trips</h2>
            </div>
            <div className={styles.childContainer}>
              {/* <div className={styles.childRight}> */}
              <Grid container>
                <Grid md={1}>
                  <div className={styles.profile}>
                    <img
                      className={styles.imageCircle}
                      src={Api?.imgUrl + empDetail?.photo}
                    />
                  </div>
                </Grid>
                <Grid md={6}>
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
                        <FiberManualRecordIcon sx={{fontSize: '10px'}} />{' '}
                      </div>
                      <p style={{paddingLeft: '20px', color: 'grey'}}>
                        {empDetail?.tripType == 'UPTRIP'
                          ? empDetail?.location?.locName
                          : empDetail?.officeLocation?.locName}
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
                        {empDetail?.tripType == 'UPTRIP'
                          ? empDetail?.officeLocation?.locName
                          : empDetail?.location?.locName}
                      </p>
                    </div>
                  </div>
                </Grid>
                <Grid md={5}>
                  <div className={styles.childLeft}>
                    <div
                      id='r-map'
                      className='gMapCont'
                      style={{height: '100px', maxWidth: '100%'}}
                    >
                      {MyStops?.length != 0 && (
                        <MapWithAMarker
                          googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GoogleMapsAPI}`}
                          siteOfficeLocation={siteOfficeLocation}
                          stops={MyStops}
                          containerElement={<div />}
                          mapElement={<div style={{height: `100%`}} />}
                          loadingElement={`<div style={{ height: '100%' }} />`}
                        />
                      )}
                    </div>
                  </div>
                </Grid>
              </Grid>
            </div>
            <div
              className={styles.bottomDiv}
              style={{display: 'flex', alignItems: 'center'}}
            >
              <div
                className={styles.tripcode}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <img
                  // classname={styles.idpic}
                  style={{marginLeft: '10px'}}
                  src={
                    empDetail?.tripType == 'UPTRIP'
                      ? '/assets/images/login_icon.png'
                      : '/assets/images/logout_icon.png'
                  }
                  alt='P'
                />
                <h5 className={styles.bottomContent}>{empDetail?.tripCode}</h5>
              </div>
              <div className={styles.tripdate}>
                <h5 className={styles.bottomContent}>
                  {moment(empDetail?.eta?.split(' ')?.[0]).format(
                    'DD-MM-YYYY ',
                  ) + empDetail?.eta?.split(' ')?.[1]}
                  {/* {moment(tripTime?.date).format('dddd').substring(0, 3) +
                    '  ' +
                    moment(tripTime?.date).format('DD-MM-YYYY') +
                    ' ' +
                    tripTime?.time} */}
                </h5>
              </div>
              <div
                className={styles.trippopulation}
                style={{display: 'flex', alignItems: 'center'}}
              >
                <GroupsIcon />
                <h5 className={styles.bottomContent}>
                  {empDetail?.noOfPassengerInTrip}
                </h5>
              </div>
              <div className={styles.tripescort}>
                <Tooltip title={empDetail?.escortName}>
                  <img
                    src={'/assets/images/route_page_icon/escort_blue.png'}
                    style={{
                      opacity: empDetail?.escortName?.length ? '' : '0.3',
                      marginRight: '15px',
                    }}
                  />
                </Tooltip>
                <Tooltip title={empDetail?.driverName || 'Not Assigned'}>
                  <img
                    src={'/assets/images/route_page_icon/driver_blue.png'}
                    style={{
                      opacity: empDetail?.driverName ? '' : '0.3',
                      marginRight: '15px',
                    }}
                  />
                </Tooltip>
                <Tooltip title={empDetail?.vehicleNumber || 'Not Assigned'}>
                  <img
                    src={'/assets/images/route_page_icon/car_blue.png'}
                    style={{
                      opacity: empDetail?.vehicleNumber ? '' : '0.3',
                      marginRight: '15px',
                    }}
                  />
                </Tooltip>
              </div>
              {/* {tripTime?.category == 'ADHOCTRIP' && (
                <div className={styles.buttonbox}>
                  <div className={styles.button}>
                    <span className={styles.buttonText}>Adhoc</span>
                  </div>
                </div>
              )} */}
            </div>
          </>
        ) : (
          <p>No trip found</p>
        )}
      </div>
    </>
  );
};

export default TripSpare;
