import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  GoogleMap,
  withScriptjs,
  withGoogleMap,
  Marker,
  Polyline,
  InfoWindow,
} from 'react-google-maps';
import Card from '@mui/material/Card';
import '../style.css';
import Api from '@api';
import '../../style.css'; //driverName_vehicleNo_escortName_tripCode
import {useNavigate} from 'react-router-dom';
import Battery4BarIcon from '@mui/icons-material/Battery4Bar';
// '/assets/images/blueCar .png',
// let markerHtml =
const OPTIONS = {
  minZoom: 4,
  maxZoom: 18,
};
const Map = ({stops, filteredTrips, siteOfficeLocation}) => {
  // const stops = {
  //   total: 0,
  //   data: [
  //     {
  //       lat: 28.6446839,
  //       lng: 77.3772496,
  //       heading: 113.56403350830078,
  //       id: 'stop0',
  //       // tid: '6613d1ba65a7d27a5e9e8758',
  //       driverName: 'MANOJj Singh',
  //       driverMobileNo: '7428240880',
  //       driverPhoto:
  //         'https://api.etravelmate.com/user-reg/download-file/img-file?fileurl=cyient77/drivers/1690187292036Robert.jpg',
  //       gpsLost: true,
  //       battery: '18',
  //       vehicleNo: 'DL-9C-AS-0856',
  //       vehicleType: 'TATA',
  //       escortName: 'NA',
  //       // tripCode: 'U20240408-2',
  //       // tripId: '6613d1ba65a7d27a5e9e8758',
  //       is_vehicleCompliances: true,
  //       passcount: 2,
  //       isfemale: false,
  //       escortTrip: 'NO',
  //       trip_status: 'SCHEDULE',
  //       icon: {
  //         url: '/assets/images/male_car.svg',
  //         scaledSize: {
  //           width: 40,
  //           height: 40,
  //         },
  //         anchor: {
  //           x: 20,
  //           y: 20,
  //         },
  //         scale: 0.7,
  //         rotation: 90,
  //       },
  //     },
  //     {
  //       lat: 19.1075,
  //       lng: 72.8263,
  //       heading: 113.56403350830078,
  //       id: 'stop0',
  //       // tid: '6613d1ba65a7d27a5e9e8758',
  //       driverName: 'Pankaj Singh',
  //       driverMobileNo: '7428240880',
  //       driverPhoto:
  //         'https://api.etravelmate.com/user-reg/download-file/img-file?fileurl=cyient77/drivers/1690187292036Robert.jpg',
  //       gpsLost: true,
  //       battery: '18',
  //       vehicleNo: 'DL-9C-AS-4565',
  //       vehicleType: 'TATA',
  //       // escortName: 'NA',
  //       // tripCode: 'U20240408-2',
  //       // tripId: '6613d1ba65a7d27a5e9e8758',
  //       is_vehicleCompliances: true,
  //       // passcount: 2,
  //       // isfemale: false,
  //       // escortTrip: 'NO',
  //       trip_status: 'STARTED',
  //       icon: {
  //         url: '/assets/images/male_car.svg',
  //         scaledSize: {
  //           width: 40,
  //           height: 40,
  //         },
  //         anchor: {
  //           x: 20,
  //           y: 20,
  //         },
  //         scale: 0.7,
  //         rotation: 90,
  //       },
  //     },
  //   ],
  // };
  console.log('stops', stops);
  const mapRef = useRef(null);
  const [markerId, setMarkerId] = useState();
  const markerRef = useRef(null);
  const navigate = useNavigate();
  const icon1 = {
    url: '/assets/images/car_topview_.png',
    scaledSize: new window.google.maps.Size(40, 40),
    anchor: new window.google.maps.Point(20, 20),
    scale: 0.7,
    rotation: 270,
  };
  window.opendetail = function (d) {
    navigate('/test-live-tracking/' + d);
  };
  // Fit bounds on mount, and when the markers change // stops?.data
  useEffect(() => {
    fitBounds();
  }, [filteredTrips, stops?.data?.length]);

  // useEffect(() => {
  //   // if (!vehicleCordinate?.heading && vehicleCordinate?.heading != 0) return;
  //   setTimeout(() => {
  //     const marker = document.querySelectorAll(`[src="${icon1?.url}"]`); //`[src="${icon1?.url}"]`
  //     if (marker?.length >= 2)
  //       stops?.data?.map((el, i) => {
  //         marker[i].style.transform = `rotate(${el.heading || 0}deg)`;
  //         marker[1].id = 'test' + i;
  //       });
  //   }, 200);
  // }, [stops, siteOfficeLocation?.latitude]);
  useEffect(() => {
    setTimeout(() => {
      stops?.data?.forEach((el, i) => {
        let imageURl =
          el?.is_vehicleCompliances == true
            ? '/assets/images/compliant_car.png'
            : el?.escortTrip === 'YES' &&
              !['COMPLETED', 'NOSHOW', 'CANCLED', 'ABSENT'].includes(
                el?.trip_status,
              )
            ? '/assets/images/blue_car.png'
            : el?.isfemale &&
              el?.escortTrip == 'NO' &&
              !['COMPLETED', 'NOSHOW', 'CANCLED', 'ABSENT'].includes(
                el?.trip_status,
              )
            ? '/assets/images/car_topview_FEMALE.png'
            : ['COMPLETED', 'NOSHOW', 'CANCLED', 'ABSENT'].includes(
                el?.trip_status,
              )
            ? '/assets/images/green-car.png'
            : '/assets/images/car_topview_.png';
        const markers = document.querySelectorAll(`[src="${imageURl}"]`);
        if (markers?.length > 0) {
          const currentMarker = markers[i];
          if (currentMarker) {
            currentMarker.style.transform = `rotate(${el.heading || 0}deg)`;
            currentMarker.id = 'test' + i;
          }
        }
      });
    }, 200);
  }, [stops, siteOfficeLocation?.latitude]);

  // const fitBounds = () => {
  //   if (!stops?.data) return;
  //   const bounds = new window.google.maps.LatLngBounds();
  //   stops?.data?.map((item) => {
  //     bounds.extend(item);
  //     return item.id;
  //   });
  //   if (siteOfficeLocation?.latitude)
  //     bounds.extend({
  //       lat: parseFloat(siteOfficeLocation.latitude),
  //       lng: parseFloat(siteOfficeLocation.longitude),
  //     });
  //   mapRef.current.fitBounds(bounds);
  // };
  const fitBounds = () => {
    if (!stops?.data) return;
    const bounds = new window.google.maps.LatLngBounds();
    stops?.data?.forEach((item) => {
      if (typeof item.lat == 'number' && typeof item.lng == 'number') {
        bounds.extend(new window.google.maps.LatLng(item.lat, item.lng));
      }
    });
    if (siteOfficeLocation?.latitude && siteOfficeLocation?.longitude) {
      bounds.extend(
        new window.google.maps.LatLng(
          parseFloat(siteOfficeLocation.latitude),
          parseFloat(siteOfficeLocation.longitude),
        ),
      );
    }
    mapRef.current.fitBounds(bounds);
  };

  const getIcon = (el) => {
    let iconUrl = '';

    // Choose icon URL based on conditions
    if (el?.is_vehicleCompliances == true) {
      iconUrl = '/assets/images/compliant_car.png';
    } else if (
      el?.escortTrip == 'YES' &&
      !['COMPLETED', 'NOSHOW', 'CANCLED', 'ABSENT'].includes(el?.trip_status)
    ) {
      iconUrl = '/assets/images/blue_car.png';
    } else if (
      el.isfemale &&
      el?.escortTrip == 'NO' &&
      !['COMPLETED', 'NOSHOW', 'CANCLED', 'ABSENT'].includes(el?.trip_status)
    ) {
      iconUrl = '/assets/images/car_topview_FEMALE.png';
    } else if (
      ['COMPLETED', 'NOSHOW', 'CANCLED', 'ABSENT'].includes(el?.trip_status)
    ) {
      iconUrl = '/assets/images/green-car.png';
    } else if (el?.tripId == 'NO_TRIP') {
      iconUrl = '/assets/images/green-car.png';
    } else {
      iconUrl = '/assets/images/car_topview_.png';
    }

    // Set rotation based on heading (default to 0 if heading is not available)
    const rotation = el.heading || 0;

    return {
      url: iconUrl,
      scaledSize: new window.google.maps.Size(40, 40),
      anchor: new window.google.maps.Point(20, 20),
      scale: 0.7,
      rotationAngle: rotation,
    };
  };
  return (
    <>
      <Card variant='outlined'>
        <div className='gMapCont'>
          <GoogleMap options={OPTIONS} ref={mapRef}>
            {siteOfficeLocation?.latitude && (
              <Marker
                ref={markerRef}
                icon={{
                  url: '/assets/images/officeMarker.png',
                  scaledSize: new window.google.maps.Size(40, 40),
                  anchor: new window.google.maps.Point(20, 20),
                  scale: 0.7,
                  rotation: 90,
                }}
                id={'stopss'}
                position={{
                  lat: parseFloat(siteOfficeLocation.latitude),
                  lng: parseFloat(siteOfficeLocation.longitude),
                }}
                key={'Office'}
                title={'Office'}
                onClick={() => {
                  setMarkerId('SITE');
                }}
              >
                {markerId == 'SITE' ? (
                  <InfoWindow
                    position={{
                      lat: parseFloat(siteOfficeLocation.latitude),
                      lng: parseFloat(siteOfficeLocation.longitude),
                    }}
                    Marker={false}
                    onCloseClick={(e) => {
                      setMarkerId(null);
                    }}
                    // ud?.name data?.stops[i]?.expectedArivalTimeStr?.split(' ')[1]ud?.location?.locName
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: `<div style='color: black;' class='point-details deboard'><span class='img-s'><img class='user-image' src='${localStorage.getItem(
                          'COMPANY_LOGO',
                        )}' /></span><span class='user-info'><h4>${
                          siteOfficeLocation?.officeName
                        }</h4><p>${
                          siteOfficeLocation?.locName
                        }</p></span></div>`,
                      }}
                    ></div>
                  </InfoWindow>
                ) : null}
              </Marker>
            )}
            {stops?.data?.map((el, index) => {
              return (
                <>
                  {(!filteredTrips?.length ||
                    filteredTrips?.includes(el.tid)) &&
                    (el?.trip_status ? (
                      <Marker
                        ref={markerRef}
                        // url: el?.isfemale ? '/assets/images/female_car.svg' : (el.tripStatus == 'COMPLETED') ? "/assets/images/available_car.svg" : "/assets/images/male_car.svg",
                        icon={getIcon(el)}
                        id={'stop2'}
                        position={el}
                        key={el.id}
                        title={el.id}
                        onClick={() => {
                          setMarkerId(index);
                        }}
                      >
                        {markerId == index ? (
                          <InfoWindow
                            position={el}
                            Marker={false}
                            onCloseClick={(e) => {
                              setMarkerId(null);
                            }}
                            //driverName_vehicleNo__  ud?.name data?.stops[i]?.expectedArivalTimeStr?.split(' ')[1]ud?.location?.locName
                          >
                            <div
                              dangerouslySetInnerHTML={{
                                __html: `<div class="lt-vch-detail" id=${'m-detail-s'} >
                                                    <div>
                                                        <h3 class='live-tracking-marker-header'>
                                                            <div style='display: flex; align-items: center;' class='span1'><label>${
                                                              el.vehicleNo
                                                            }</label> <img style='margin-left: 10px;' class='img20by20' src=${
                                  el.gpsLost
                                    ? '/assets/images/GPSDeviceAvialable.png'
                                    : '/assets/images/gps-signal-lost.svg'
                                }>
                              <img class=${
                                el.battery == 0 ? 'img20by201' : 'img20by202'
                              } src=${'/assets/images/battryHalf.png'}>
                              <span class=${
                                el.battery == 0 ? 'battery1' : 'battery2'
                              }>${(el.battery || 0) + '%'}</span></div>
                                                            <div style='font-size: 12px; font-weight: 400; color: #9b9b9b; '>${
                                                              el.vehicleType
                                                            }</div>
                                                        </h3>
                                                        <h4 class='live-tracking-marker-driver-sec' ><img src=${
                                                          el.driverPhoto ? encodeURI(el.driverPhoto): "/assets/images/Drivers.svg"
                                                        } ><span>${
                                  el.driverName
                                }<br><span style="font-size: 10px; color: #9b9b9b">${
                                  el.driverMobileNo
                                }</span></span></h4>
                                ${
                                  el.tripId !== 'NO_TRIP'
                                    ? `<h4 class='live-tracking-marker-lower-sec'><img src=${'/assets/images/login_icon.png'}><span  onclick="opendetail('${
                                        el.tripId
                                      }')">${el.tripCode} </span></h4>
                                      <h4 class='live-tracking-marker-lower-sec'><img src=${'/assets/images/Escort3.png'}><span>${
                                        el.escortName
                                      }</span></h4>
                                                              <h4 class='live-tracking-marker-lower-sec'><img src=${'/assets/images/group_people.png'}><span>${
                                        el.passcount || 0
                                      }</span></h4>`
                                    : ' '
                                }
                                                    </div>
                                                </div>`,
                              }}
                            ></div>
                          </InfoWindow>
                        ) : null}
                      </Marker>
                    ) : null)}
                </>
              );
            })}
          </GoogleMap>
        </div>
      </Card>
    </>
  );
};
export default withScriptjs(withGoogleMap(Map));
