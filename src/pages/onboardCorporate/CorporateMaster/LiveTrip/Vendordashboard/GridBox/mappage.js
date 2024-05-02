import React, {useEffect, useState, useCallback, useRef} from 'react';
import moment from 'moment';
import Api from '@api';
import {
  GoogleMap,
  withScriptjs,
  withGoogleMap,
  Marker,
  Polyline,
  InfoWindow,
  DirectionsRenderer,
} from 'react-google-maps';
import axios from 'axios';
const {
  MarkerWithLabel,
} = require('react-google-maps/lib/components/addons/MarkerWithLabel');

// const geocoder = new window.google.maps.Geocoder();

const OPTIONS = {
  minZoom: 4,
  maxZoom: 18,
};
const Map = ({
  siteOfficeLocation,
  stops,
  psDetails,
  pullingInfo,
  pullingStopPage,
  tripId,
  polyLine,
}) => {
  const [directions, setDirections] = useState();
  const [markerId, setMarkerId] = useState();
  const [markerIdOne, setMarkerIdOne] = useState();
  const [addresses, setAddresses] = useState('');

  const fitBounds = () => {
    if (!stops?.length || !siteOfficeLocation?.latitude) return;
    const bounds = new window.google.maps.LatLngBounds();
    stops?.map((item) => {
      bounds.extend(item);
      return item.id;
    });
    if (siteOfficeLocation?.latitude)
      bounds.extend({
        lat: parseFloat(siteOfficeLocation.latitude),
        lng: parseFloat(siteOfficeLocation.longitude),
      });
    mapRef.current.fitBounds(bounds);
  };
  useEffect(() => {
    fitBounds();
  }, [siteOfficeLocation, stops]);
  const mapRef = useRef(null);
  useEffect(() => {
    if (polyLine) return;
    const google = window.google;
    if (!stops.length || !siteOfficeLocation?.latitude) return;
    let tem_waypts = [];
    stops?.map((el, i) => {
      tem_waypts.push({
        location: new google.maps.LatLng(
          parseFloat(stops[i]?.lat),
          stops[i]?.lng,
        ),
      });
    });

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        // origin: {
        //   lat: parseFloat(siteOfficeLocation?.latitude),
        //   lng: parseFloat(siteOfficeLocation?.longitude),
        // },
        origin: {
          lat: parseFloat(stops[0]?.lat),
          lng: parseFloat(stops[0]?.lng),
        },
        destination: stops[stops?.length - 1],
        waypoints: tem_waypts,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          //
          setDirections(result);
          const polyline = result?.routes[0]?.overview_polyline;
          axios
            .post(
              Api.baseUri +
                `/user-reg/trip-route/saveTripPolyline?id=${tripId}&polyLine=${encodeURIComponent(
                  polyline,
                )}`,
            )
            .then((response) => {
              console.log('API response:', response.data);
            })
            .catch((error) => {
              console.error(
                'There was a problem with the Axios request:',
                error,
              );
            });
        } else {
          console.error(`error fetching directions ${result}`);
        }
      },
    );
    //
  }, [siteOfficeLocation, stops, polyLine]);
  // const pathCoordinates = [
  //   {lat: 28.54578564817963, lng: 77.3119937524954, a: 'test'},
  //   {lat: 28.546554265561056, lng: 77.31290180931327},
  // ];
  const pathCoordinates = pullingInfo?.map((item) => ({
    lat: parseFloat(item.latitude),
    lng: parseFloat(item.longitude),
  }));
  function getEmpData(dddd) {
    return psDetails[dddd['$id']][0];
  }
  const convertSpeedToKmPerHour = (speed) => {
    return (speed * 3.6).toFixed(2); // 1 m/s = 3.6 km/h
  };
  const getAddress = (lat, lng) => {
    let geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({location: {lat, lng}}, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          // const newAddresses = [...addresses];
          // newAddresses.push(results[0].formatted_address);
          setAddresses(results[0].formatted_address);
        }
      }
    });
  };
  // getAddress(28.54578564817963, 77.3119937524954);
  return (
    <>
      {siteOfficeLocation?.latitude && (
        <GoogleMap
          ref={mapRef}
          defaultZoom={8}
          options={OPTIONS}
          defaultCenter={{
            lat: parseFloat(siteOfficeLocation?.latitude),
            lng: parseFloat(siteOfficeLocation?.longitude),
          }}
        >
          <Polyline
            path={pathCoordinates}
            options={{
              strokeColor: 'gray', // Change this to the color you want
              strokeOpacity: 1,
              strokeWeight: 5,
            }}
          />
          {pullingStopPage?.map((ele, index) => {
            return (
              <Marker
                icon={{
                  url: 'https://cdn-icons-png.flaticon.com/512/3061/3061629.png',

                  scaledSize: {width: 40, height: 60},
                }}
                position={{
                  lat: parseFloat(ele?.location?.latitude),
                  lng: parseFloat(ele?.location?.longitude),
                }}
              />
            );
          })}
          {pullingInfo &&
            pullingInfo?.map((ele, index) => {
              return (
                <Marker
                  icon={{
                    url:
                      ele?.networkStatus == 'true'
                        ? 'https://cdn-icons-png.flaticon.com/512/7345/7345830.png'
                        : 'https://cdn-icons-png.flaticon.com/512/8597/8597951.png',

                    scaledSize: {width: 20, height: 20},
                    // scaledSize: new window.google.maps.Size(5, 10),
                    // anchor: new window.google.maps.Point(20, 20),
                    // scale: 0.2,
                    // rotation: 90,
                  }}
                  onClick={() => {
                    setMarkerIdOne(index);
                    getAddress(
                      parseFloat(ele?.latitude),
                      parseFloat(ele?.longitude),
                    );
                  }}
                  position={{
                    lat: parseFloat(ele?.latitude),
                    lng: parseFloat(ele?.longitude),
                  }}
                >
                  {markerIdOne == index ? (
                    <InfoWindow
                      position={{
                        lat: ele.latitude,
                        lng: ele.longitude,
                      }}
                      Marker={false}
                      onCloseClick={(e) => {
                        setMarkerIdOne(null);
                        setAddresses('');
                      }}
                    >
                      <>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: `<div style='display: flex; margin-bottom:3px; padding:10px; '>
                            <div style='display: flex; align-items:center; margin-left:10px; border-bottom: 1px solid grey;'>
                            <span class='user-info'>
                            <h4><p><b>Time:</b>  ${moment(ele?.time).format(
                              'DD/MM/YYYY HH:mm:ss',
                            )}</p></h4>
                            <h4><p><b>Speed:</b>  ${convertSpeedToKmPerHour(
                              ele?.speed,
                            )} km/h</p></h4>
                            <p style='margin-bottom: 10px;'>
                              ${addresses}
                            </p>
                            </span>
                            </div>
                           
                              </div>`,
                          }}
                        ></div>
                      </>
                    </InfoWindow>
                  ) : null}
                </Marker>
              );
            })}
          {/* <Marker
            icon={{
              url: '/assets/images/siteoffice.png',
              scaledSize: new window.google.maps.Size(20, 30),
              anchor: new window.google.maps.Point(20, 20),
              scale: 0.7,
              rotation: 90,
            }}
            position={{
              lat: parseFloat(siteOfficeLocation?.latitude),
              lng: parseFloat(siteOfficeLocation?.longitude),
            }}
          /> */}
          {/* {siteOfficeLocation?.latitude && (
            
          )} */}

          {stops?.map((el, index) => {
            console.log('stops', stops, index);

            return (
              <Marker
                // label={{
                //   text: `${index + 1}`,
                //   color: 'white',
                //   fontSize: '12px',
                //   fontWeight: 'bold',
                //   anchor: new window.google.maps.Point(25, 50), // Adjust label positioning
                // }}
                // icon={{
                //   url:
                //     index == 0
                //       ? '/assets/images/officeMarker.png'
                //       : index + 1 == stops?.length
                //       ? 'https://maps.mappls.com/images/to.png'
                //       : 'https://maps.mappls.com/images/2.png',
                //   scaledSize: {width: 30, height: 40},
                // }}
                // icon={{
                //   url:
                //     index == 0
                //       ? 'https://maps.mappls.com/images/to.png'
                //       : index + 1 == stops?.length
                //       ? '/assets/images/officeMarker.png'
                //       : 'https://maps.mappls.com/images/2.png',
                //   scaledSize: {width: 30, height: 40},
                // }}
                icon={{
                  url:
                    el?.psDetails[0]?.tripType == 'DOWNTRIP'
                      ? index == 0
                        ? '/assets/images/greenFlag.png'
                        : index + 1 == stops?.length
                        ? '/assets/images/redFlag.png'
                        : 'https://maps.mappls.com/images/2.png'
                      : index == 0
                      ? '/assets/images/redFlag.png'
                      : index + 1 == stops?.length
                      ? '/assets/images/greenFlag.png'
                      : 'https://maps.mappls.com/images/2.png',
                  scaledSize: {width: 40, height: 50},
                }}
                onClick={() => {
                  setMarkerId(index);
                }}
                position={{
                  lat: parseFloat(el?.lat),
                  lng: parseFloat(el?.lng),
                }}
              >
                {index != 0 &&
                  el?.psDetails[0]?.tripType == 'DOWNTRIP' &&
                  el?.psDetails[index]?.passType != 'ESCORT' && (
                    <MarkerWithLabel
                      key={index}
                      position={{
                        lat: parseFloat(el?.lat),
                        lng: parseFloat(el?.lng),
                      }}
                      labelAnchor={new window.google.maps.Point(0, 0)}
                      labelStyle={{
                        backgroundColor: 'green',
                        fontSize: '12px',
                        padding: '6px',
                        borderRadius: '5px',
                        color: 'white',
                      }}
                      icon={'null'}
                    >
                      <div>{index}</div>
                    </MarkerWithLabel>
                  )}
                {index + 1 != stops?.length &&
                  el?.psDetails[0]?.tripType == 'UPTRIP' &&
                  el?.psDetails[index]?.passType != 'ESCORT' && (
                    <MarkerWithLabel
                      key={index}
                      position={{
                        lat: parseFloat(el?.lat),
                        lng: parseFloat(el?.lng),
                      }}
                      labelAnchor={new window.google.maps.Point(0, 0)}
                      labelStyle={{
                        backgroundColor: 'green',
                        fontSize: '12px',
                        padding: '6px',
                        borderRadius: '5px',
                        color: 'white',
                      }}
                      icon={'null'}
                    >
                      <div>
                        {el?.psDetails[0]?.escortTrip == 'YES'
                          ? index
                          : index + 1}
                      </div>
                    </MarkerWithLabel>
                  )}
                {markerId == index ? (
                  <InfoWindow
                    position={{
                      lat: el.lat,
                      lng: el.lng,
                    }}
                    Marker={false}
                    onCloseClick={(e) => {
                      setMarkerId(null);
                    }}
                  >
                    <>
                      {/* {el.psDetails?.map((ell_) => {
                        return (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: `<div style='display: flex; margin-bottom:3px; padding:10px; '>
                              <div><span class='img-s'><img style='width:50px; height:50px;  border-radius: 50%;' src='${
                                getEmpData(ell_)?.photo
                                  ? Api.imgUrl + getEmpData(ell_)?.photo
                                  : getEmpData(ell_)?.gender == 'Male'
                                  ? '/assets/images/user.png'
                                  : getEmpData(ell_)?.gender == 'Female'
                                  ? '/assets/images/human.png'
                                  : ''
                              }' /></span></div>
                              <div style='display: flex; align-items:center; margin-left:10px; border-bottom: 1px solid grey;'>
                              <span class='user-info'><h4>${
                                getEmpData(ell_)?.name
                              }</h4>
                              <p>${getEmpData(ell_)?.empCode}</p>
                              <p class='eta-time'>${moment(
                                getEmpData(ell_)?.expectedArivalTime,
                              ).format('HH:mm')}</p>
                              <p style='margin-bottom: 10px;'>${
                                getEmpData(ell_)?.location?.locName
                              }</p>
                              </span>
                              </div>
                              
                              </div>`,
                            }}
                          ></div>
                        );
                      })} */}
                      {el.psDetails?.map((ell_) => {
                        return (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: `<div style='display: flex; margin-bottom:3px; padding:10px; '>
                              <div><span class='img-s'><img style='width:50px; height:50px;  border-radius: 50%;' src='${
                                ell_?.photo
                                  ? Api.imgUrl + ell_?.photo
                                  : ell_?.gender == 'Male'
                                  ? '/assets/images/user.png'
                                  : ell_?.gender == 'Female'
                                  ? '/assets/images/human.png'
                                  : ''
                              }' /></span></div>
                              <div style='display: flex; align-items:center; margin-left:10px; border-bottom: 1px solid grey;'>
                              <span class='user-info'><h4>${ell_?.name}</h4>
                              <p>${ell_?.empCode}</p>
                              <p class='eta-time'>${moment(
                                ell_?.expectedArivalTime,
                              ).format('HH:mm')}</p>
                              <p style='margin-bottom: 10px;'>${
                                ell_?.location?.locName
                              }</p>
                              </span>
                              </div>
                              
                              </div>`,
                            }}
                          ></div>
                        );
                      })}
                    </>
                  </InfoWindow>
                ) : null}
              </Marker>
            );
          })}
          {/* {console.log('directions', directions)} */}

          {polyLine ? (
            <Polyline
              path={google.maps.geometry.encoding.decodePath(
                decodeURIComponent(polyLine),
              )}
              options={{
                strokeOpacity: 1,
                strokeWeight: 4,
                strokeColor: '#58b9fa',
              }}
            />
          ) : (
            <DirectionsRenderer
              directions={directions}
              options={{
                suppressMarkers: true,
                polylineOptions: {
                  strokeOpacity: 1,
                  strokeWeight: 4,
                  strokeColor: '#119BF0',
                },
              }}
            />
          )}
        </GoogleMap>
      )}
    </>
  );
};
export default withScriptjs(withGoogleMap(Map));
