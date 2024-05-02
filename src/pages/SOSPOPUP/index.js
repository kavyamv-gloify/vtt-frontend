import React, {useEffect, useState} from 'react';
import {Grid, Button, Avatar} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from 'axios';
import Api from '@api';
import Map from './mappage';
import {GoogleMapsAPI} from '@smart-form/GoogleMap/g-config';
import moment from 'moment';

const SOSPOPUP = ({
  keys,
  sos_generatorId,
  tripId,
  sosData,
  empInfo,
  tripInfo,
}) => {
  const [driverInfo, setDriverInfo] = useState();
  const [empTrip, setEmpTrip] = useState();
  const [address, setAddress] = useState();
  const [mapView, setMapView] = useState(false);
  const getAddress = (lat, lng) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({location: {lat, lng}}, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          setAddress(results[0].formatted_address);
        }
      }
    });
  };

  useEffect(() => {
    tripInfo?.[0]?.stopList?.map((el) => {
      el?.onBoardPassengers?.map((e) => {
        if (sosData?.empId == e?.empId) {
          setEmpTrip(e);
        }
      });
    });

    axios
      .get(`${Api.driver.list}/${tripInfo?.[0]?.driverId}`)
      .then((resp) => {
        if (resp?.data?.status == '200') {
          setDriverInfo(resp?.data?.data);
        }
      })
      .catch((err) => {});
  }, [tripInfo]);

  useEffect(() => {
    if (sosData?.latitude && sosData?.longitude)
      getAddress(parseFloat(sosData?.latitude), parseFloat(sosData?.longitude));
  }, [sosData?.latitude, sosData?.longitude]);

  return (
    <div style={{marginTop: '10px'}}>
      <Grid container sx={{padding: '0.8rem'}}>
        <Grid
          md={12}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '15px',
            padding: '0px 10px 0px 10px ',
          }}
        >
          <div style={{display: 'flex', alignItems: 'center'}}>
            <Avatar
              alt='Employee Photo'
              src={`${Api.imgUrl}${empInfo?.photo}`}
              sx={{
                width: 50,
                height: 50,
                background: 'pink',
                marginRight: '20px',
              }}
            />
            <div>
              <div
                style={{
                  color: 'red',
                  fontWeight: '900',
                  fontSize: '16px',
                }}
              >
                {/* {`SOS PRESSED BY ${
                  keys === 'empId' ? 'EMPLOYEE ID' : 'DRIVER ID'
                } - ${empTrip?.empCode}`} */}
                {`SOS PRESSED BY ${
                  keys === 'empId'
                    ? `EMPLOYEE ID-${empTrip?.empCode}`
                    : 'DRIVER'
                }`}
              </div>
              <div style={{fontSize: '14px', color: 'black'}}>
                Trip ID:{' '}
                <span style={{color: 'green'}}>{tripInfo?.[0]?.tripCode}</span>
              </div>
              <div style={{fontSize: '14px', color: 'black'}}>
                Vehicle Number:{' '}
                <span style={{color: 'green'}}>{tripInfo?.[0]?.vehicleNo}</span>
              </div>
            </div>
          </div>
          {/* <ShareIcon sx={{fontSize: '20px'}} /> */}
        </Grid>
        <Grid md={12} sx={{marginBottom: '10px'}}>
          <Grid container>
            {keys == 'empId' && (
              <Grid
                md={6}
                sx={{
                  borderRight: '1px solid grey',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  // padding: '10px',
                }}
              >
                <div>
                  <h3
                    style={{
                      color: '#0496c7',
                      marginBottom: '5px',
                      fontSize: '15px',
                      fontWeight: '900',
                    }}
                  >
                    Employee Details
                  </h3>
                  <p style={{marginBottom: '5px'}}>
                    {empInfo?.employeeFullName}
                  </p>
                  <p style={{marginBottom: '5px'}}>{empInfo?.mobileNo}</p>
                  <p style={{marginBottom: '5px'}}>{empInfo?.emailId}</p>
                </div>
              </Grid>
            )}
            <Grid
              md={6}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                // padding: '10px',
              }}
            >
              <div>
                <h3
                  style={{
                    color: '#0496c7',
                    marginBottom: '5px',
                    fontSize: '15px',
                    fontWeight: '900',
                  }}
                >
                  Driver Details
                </h3>
                <p style={{marginBottom: '5px'}}>
                  {driverInfo?.firstName + ' ' + driverInfo?.lastName}
                </p>
                <p style={{marginBottom: '5px'}}>{driverInfo?.mobileNo}</p>
                <p style={{marginBottom: '5px'}}>
                  {driverInfo?.emailId?.length ? driverInfo?.emailId : '--'}
                </p>
              </div>
            </Grid>
          </Grid>
        </Grid>
        <Grid md={12} sx={{marginBottom: '14px', background: '#eaf4f4'}}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '5px',
            }}
          >
            <div style={{display: 'flex', fontWeight: '900', fontSize: '20px'}}>
              <p style={{fontWeight: '900', fontSize: '15px'}}>SOS Location</p>
              <p
                style={{
                  marginLeft: '10px',
                  fontWeight: '900',
                  fontSize: '15px',
                }}
              >
                {moment(sosData?.time).format('HH:mm')}
              </p>
            </div>
            <div
              style={{
                fontWeight: '900',
                color: '#0496c7',
                fontSize: '15px',
                cursor: 'pointer',
              }}
              onClick={() => {
                setMapView(!mapView);
              }}
            >
              Map {!mapView ? 'View' : 'Close'}
            </div>
          </div>
          <div>
            {mapView && (
              <Map
                googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GoogleMapsAPI}`}
                containerElement={<div style={{height: `400px`}} />}
                mapElement={<div style={{height: `100%`}} />}
                loadingElement={`   `}
                lat={sosData?.latitude}
                long={sosData?.longitude}
              />
            )}
          </div>
          <div
            style={{
              // marginTop: '5px',
              fontSize: '14px',
              padding: '5px',
              color: '#014f86',
            }}
          >
            {address}
          </div>
        </Grid>
        <Grid md={12} sx={{marginBottom: '8px'}}>
          <div
            style={{
              fontSize: '16px',
              fontWeight: '900',
              color: '#0496c7',
              // color: 'green',
              marginBottom: '10px',
            }}
          >
            Nearest emergency Service
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  background: '#f8f8f8',
                  width: '20px',
                  aspectRatio: '1 / 1',
                  borderRadius: '50%',
                  backgroundColor: 'green',
                  // width: '100%',
                  margin: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  // position: 'relative',
                }}
              >
                <LocalPhoneIcon sx={{fontSize: '10px', color: 'white'}} />
              </div>

              <div style={{marginLeft: '10px'}}>
                <p>Golden Hour center</p>
                <p style={{color: 'grey'}}>87683525442</p>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  background: '#f8f8f8',
                  width: '20px',
                  aspectRatio: '1 / 1',
                  borderRadius: '50%',
                  backgroundColor: 'green',
                  // width: '100%',
                  margin: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  // position: 'relative',
                }}
              >
                <LocalPhoneIcon sx={{fontSize: '10px', color: 'white'}} />
              </div>

              <div style={{marginLeft: '10px'}}>
                <p>Golden Hour center</p>
                <p style={{color: 'grey'}}>87683525442</p>
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: '20px',
              padding: '0px 40px 0px 40px',
              display: 'flex',
            }}
          >
            {keys == 'empId' ? (
              <div style={{display: 'flex', flexDirection: 'column'}}>
                <div
                  style={{
                    color: 'orange',
                    paddingLeft: '7px',
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                >
                  <div>
                    <FiberManualRecordIcon sx={{fontSize: '10px'}} />{' '}
                  </div>
                  <div>
                    <p style={{paddingLeft: '20px', fontWeight: '900'}}>
                      Pick Up
                    </p>
                    <p style={{paddingLeft: '20px', color: 'grey'}}>
                      {empTrip?.tripType == 'UPTRIP'
                        ? empTrip?.location?.locName
                        : empTrip?.officeLocation?.locName}
                    </p>
                  </div>
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

                  <div>
                    <p style={{paddingLeft: '20px', fontWeight: '900'}}>
                      Drop Up
                    </p>
                    <p style={{paddingLeft: '20px', color: 'grey'}}>
                      {empTrip?.tripType == 'UPTRIP'
                        ? empTrip?.officeLocation?.locName
                        : empTrip?.location?.locName}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{display: 'flex', flexDirection: 'column'}}>
                <div
                  style={{
                    color: 'orange',
                    paddingLeft: '7px',
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                >
                  <div>
                    <FiberManualRecordIcon sx={{fontSize: '10px'}} />{' '}
                  </div>
                  <div>
                    <p style={{paddingLeft: '20px', fontWeight: '900'}}>
                      Pick Up
                    </p>
                    <p style={{paddingLeft: '20px', color: 'grey'}}>
                      {tripInfo?.[0]?.stopList?.[0]?.stopPointName}
                    </p>
                  </div>
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

                  <div>
                    <p style={{paddingLeft: '20px', fontWeight: '900'}}>
                      Drop Up
                    </p>
                    <p style={{paddingLeft: '20px', color: 'grey'}}>
                      {
                        tripInfo?.[0]?.stopList?.[
                          tripInfo?.[0]?.stopList?.length - 1
                        ]?.stopPointName
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Grid>
        <Grid md={12} sx={{marginBottom: '10px'}}>
          {keys == 'empId' ? (
            <div
              style={{marginBottom: '10px', fontWeight: '800'}}
            >{`${empInfo?.employeeFullName} Number`}</div>
          ) : (
            <div style={{marginBottom: '10px', fontWeight: '800'}}>{`${
              driverInfo?.firstName + ' ' + driverInfo?.lastName
            } Number`}</div>
          )}
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  background: '#f8f8f8',
                  width: '20px',
                  aspectRatio: '1 / 1',
                  borderRadius: '50%',
                  backgroundColor: 'green',
                  // width: '100%',
                  margin: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  // position: 'relative',
                }}
              >
                <LocalPhoneIcon sx={{fontSize: 'small', color: 'white'}} />
              </div>

              <div style={{marginLeft: '10px'}}>
                <p>Alternate Mobile Number</p>
                {keys == 'empId' ? (
                  <p style={{color: 'grey'}}>
                    {empInfo?.alternateContactNo || 'Not Available!'}
                  </p>
                ) : (
                  <p style={{color: 'grey'}}>
                    {driverInfo?.alternateNo || 'Not Available!'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Grid>
        <Grid
          md={12}
          sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
        >
          <Button sx={{color: 'white', background: 'red'}}>Take Action</Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default SOSPOPUP;
