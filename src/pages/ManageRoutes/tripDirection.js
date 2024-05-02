import React, {useState, useEffect, useRef} from 'react';
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  DirectionsRenderer,
  InfoWindow,
  Polyline,
} from '@react-google-maps/api';
import Api from '@api';
import {GoogleMapsAPI} from '@smart-form/GoogleMap/g-config';
import {size} from 'lodash';
import {IoIosOpen} from 'react-icons/io';
import axios from 'axios';
import moment from 'moment';
import {padding} from '@mui/system';
import './routes.css';

const DefaultLocation = {lat: 28.62, lng: 77.09};

const TripDirection = ({data, getAllList}) => {
  // const data = props.data;
  // console.log('dsdjfgsfata', data);
  const [markerId, setMarkerId] = useState('');
  const [markerIdOne, setMarkerIdOne] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [addresses, setAddresses] = useState('');
  const [mapCenter, setMapCenter] = useState(null);
  const [mapZoom, setMapZoom] = useState(10); // Default zoom level

  // const {isLoaded} = useJsApiLoader({
  //   googleMapsApiKey: GoogleMapsAPI,
  //   libraries: ['places'],
  // });
  const [directions, setDirections] = useState(null);
  const [origin, setOrigin] = useState({});
  const [destination, setDestination] = useState({});
  const [waypts, setWaypts] = useState([]);
  const [wayptsLable, setWayptsLable] = useState([]);
  const [endPointLabel_, setendPointLabel_] = useState();
  const [startPointLabel_, setstartPointLabel_] = useState();
  const [pullingLatandlong, setPullingLatandlong] = useState([]);
  const [pullingStopPage, setPullingStopPage] = useState([]);
  useEffect(() => {
    const fetchData = () => {
      axios
        .get(
          `${Api.baseUri}/user-reg/trip-route/get-all-trip-LatLongDataByTripId/${data?.id}`,
        )
        .then((res) => {
          setPullingLatandlong(res?.data?.data[0]?.latLongList);
        })
        .catch((error) => {
          // Handle error
          console.error('Error fetching data: ', error);
        });
    };
    const fetchDataForStopPage = () => {
      axios
        .get(
          `${Api.baseUri}/user-reg/trip-driver/get-StopageHistory/${data?.id}`,
        )
        .then((res) => {
          setPullingStopPage(res?.data?.data);
        })
        .catch((error) => {
          // Handle error
          console.error('Error fetching data: ', error);
        });
    };
    if (data?.id) {
      fetchData();
      fetchDataForStopPage();
    }

    // Fetch data every 5 minutes
    const interval = setInterval(() => {
      fetchData();
      fetchDataForStopPage();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [data?.id]);
  useEffect(() => {
    // let tem_origin = {};
    // let tem_destination = {};
    const tem_waypts = [];
    const tem_wayptsLable = [];
    let startPointLabel = '';
    if (data?.stops?.[0]?.onBoardPassengers?.length > 0) {
      data?.stops?.[0]?.onBoardPassengers.forEach((ud, idx) => {
        startPointLabel = `${startPointLabel}<div class='point-details onboard'><span class='img-s'><img class='user-image' src='${
          ud?.photo
            ? `${Api.imgUrl}${ud.photo}`
            : ud?.gender == 'Male'
            ? '/assets/images/user.png'
            : ud?.gender == 'Female'
            ? '/assets/images/human.png'
            : ''
        }' /></span><span class='user-info'><h4>${
          ud?.name
        }</h4><p class='eta-time'>${
          data?.stops[0]?.expectedArivalTimeStr?.split(' ')[1]
        }</p><p>${ud?.location?.locName}</p></span></div>`;
      });
    } else if (data?.stops?.[0]?.deBoardPassengers?.length > 0) {
      data?.stops[0]?.deBoardPassengers.forEach((ud, idx) => {
        startPointLabel = `${startPointLabel}<div class='point-details deboard'><span class='img-s'><img class='user-image' src='${
          ud?.photo
            ? `${Api.imgUrl}${ud.photo}`
            : ud?.gender == 'Male'
            ? '/assets/images/user.png'
            : ud?.gender == 'Female'
            ? '/assets/images/human.png'
            : ''
        }' /></span><span class='user-info'><h4>${
          ud?.name
        }</h4><p class='eta-time'>${
          data?.stops[0]?.expectedArivalTimeStr?.split(' ')[1]
        }</p><p>${ud?.location?.locName}</p></span></div>`;
      });
    } else {
      startPointLabel = `<div class='point-details'>${data?.stops?.[0]?.location?.locName}</div>`;
    }

    let endPointLabel = '';
    if (data?.stops[data?.stops?.length - 1]?.onBoardPassengers?.length > 0) {
      data?.stops[data?.stops?.length - 1]?.onBoardPassengers.forEach(
        (ud, idx) => {
          endPointLabel = `${endPointLabel}<div class='point-details onboard'><span class='img-s'><img class='user-image' src='${
            ud?.photo
              ? `${Api.imgUrl}${ud.photo}`
              : ud?.gender == 'Male'
              ? '/assets/images/user.png'
              : ud?.gender == 'Female'
              ? '/assets/images/human.png'
              : ''
          }' /></span><span class='user-info'><h4>${
            ud?.name
          }</h4><p class='eta-time'>${
            data?.stops[data?.stops?.length - 1]?.expectedArivalTimeStr?.split(
              ' ',
            )[1]
          }</p><p>${ud?.location?.locName}</p></span></div>`;
        },
      );
    } else if (
      data?.stops[data?.stops?.length - 1]?.deBoardPassengers?.length > 0
    ) {
      data?.stops[data?.stops?.length - 1]?.deBoardPassengers.forEach(
        (ud, idx) => {
          endPointLabel = `${endPointLabel}<div class='point-details deboard'><span class='img-s'><img class='user-image' src='${
            ud?.photo
              ? `${Api.imgUrl}${ud.photo}`
              : ud?.gender == 'Male'
              ? '/assets/images/user.png'
              : ud?.gender == 'Female'
              ? '/assets/images/human.png'
              : ''
          }' /></span><span class='user-info'><h4>${
            ud?.name
          }</h4><p class='eta-time'>${
            data?.stops[data?.stops?.length - 1]?.expectedArivalTimeStr?.split(
              ' ',
            )[1]
          }</p><p>${ud?.location?.locName}</p></span></div>`;
        },
      );
    } else {
      endPointLabel = `<div class='point-details'>${
        data?.stops[data?.stops?.length - 1]?.location?.locName
      }</div>`;
    }

    if (data?.stops?.length > 1) {
      setOrigin({
        lat: parseFloat(data?.stops[0]?.location?.latitude),
        lng: parseFloat(data?.stops[0]?.location?.longitude),
      });
      setDestination({
        lat: parseFloat(
          data?.stops[data?.stops?.length - 1]?.location?.latitude,
        ),
        lng: parseFloat(
          data?.stops[data?.stops?.length - 1]?.location?.longitude,
        ),
      });
      //
      for (let i = 1; i < data?.stops?.length - 1; i++) {
        if (
          data?.stops[i]?.onBoardPassengers?.length > 0 ||
          data?.stops[i]?.deBoardPassengers?.length > 0
        ) {
          let viaPointLabel = '';
          if (data?.stops[i]?.onBoardPassengers?.length > 0) {
            data?.stops[i]?.onBoardPassengers.forEach((ud, idx) => {
              viaPointLabel = `${viaPointLabel}<div class='point-details onboard'><span class='img-s'><img class='user-image' src='${
                ud?.photo
                  ? `${Api.imgUrl}${ud.photo}`
                  : ud?.gender == 'Male'
                  ? '/assets/images/user.png'
                  : ud?.gender == 'Female'
                  ? '/assets/images/human.png'
                  : ''
              }' /></span><span class='user-info'><h4>${
                ud?.name
              }</h4><p class='eta-time'>${
                data?.stops[i]?.expectedArivalTimeStr?.split(' ')[1]
              }</p><p>${ud?.location?.locName}</p></span></div>`;
            });
          } else if (data?.stops[i]?.deBoardPassengers?.length > 0) {
            data?.stops[i]?.deBoardPassengers.forEach((ud, idx) => {
              viaPointLabel = `${viaPointLabel}<div class='point-details deboard'><span class='img-s'><img class='user-image' src='${
                ud?.photo
                  ? `${Api.imgUrl}${ud.photo}`
                  : ud?.gender == 'Male'
                  ? '/assets/images/user.png'
                  : ud?.gender == 'Female'
                  ? '/assets/images/human.png'
                  : ''
              }' /></span><span class='user-info'><h4>${
                ud?.name
              }</h4><p class='eta-time'>${
                data?.stops[i]?.expectedArivalTimeStr?.split(' ')[1]
              }</p><p>${ud?.location?.locName}</p></span></div>`;
            });
          } else {
            viaPointLabel = `<div class='point-details'>${data?.stops[i]?.location?.locName}</div>`;
          }
          tem_wayptsLable.push(viaPointLabel);
          tem_waypts.push({
            location: new google.maps.LatLng(
              parseFloat(data?.stops[i]?.location?.latitude),
              data?.stops[i]?.location?.longitude,
            ),
          });
          setWaypts([...tem_waypts]);
          setWayptsLable([...tem_wayptsLable]);
          //
        }
      }
    }
    //
    setstartPointLabel_(startPointLabel);
    setendPointLabel_(endPointLabel);
  }, [data]);
  useEffect(() => {
    if (data?.polyLine) return;
    const google = window.google;
    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        waypoints: waypts,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          const polyline = result?.routes[0]?.overview_polyline;

          axios
            .post(
              Api.baseUri +
                `/user-reg/trip-route/saveTripPolyline?id=${
                  data?.id
                }&polyLine=${encodeURIComponent(polyline)}`,
            )
            .then((response) => {
              console.log('API response:', response.data);
              // Handle API response as needed
              // getAllList();
            })
            .catch((error) => {
              console.error(
                'There was a problem with the Axios request:',
                error,
              );
            });

          setDirections(result);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      },
    );
    //
  }, [origin, destination, waypts, data]);

  useEffect(() => {
    if (data && data.polyLine) {
      const points = google.maps.geometry.encoding.decodePath(
        decodeURIComponent(data.polyLine),
      );

      // Calculate the bounds of the polyline
      let bounds = new google.maps.LatLngBounds();
      points.forEach((point) => bounds.extend(point));

      // Calculate the center of the polyline
      const center = {
        lat: (bounds.getNorthEast().lat() + bounds.getSouthWest().lat()) / 2,
        lng: (bounds.getNorthEast().lng() + bounds.getSouthWest().lng()) / 2,
      };

      // Calculate the appropriate zoom level to fit the entire polyline within the viewport
      const zoom = getZoomToFit(bounds);

      setMapCenter(center);
      setMapZoom(zoom);
    }
  }, [data]);
  const getZoomToFit = (bounds) => {
    const WORLD_DIM = {height: 256, width: 256};
    const ZOOM_MAX = 21;

    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    const latFraction = (ne.lat() - sw.lat()) / 180;
    const lngDiff = ne.lng() - sw.lng();

    const lngFraction = (lngDiff < 0 ? lngDiff + 360 : lngDiff) / 360;

    const latZoom = zoomToFitFraction(latFraction);
    const lngZoom = zoomToFitFraction(lngFraction);

    return Math.min(latZoom, lngZoom, ZOOM_MAX);
  };

  const zoomToFitFraction = (fraction) => {
    return Math.floor(Math.log2(1 / fraction));
  };

  useEffect(() => {
    setIsOpen(isOpen);
  }, [isOpen]);
  useEffect(() => {
    setMarkerId(markerId);
  }, [markerId]);
  function onToggleOpenInfoWindow(mid) {
    if (markerId == mid) {
      {
        isOpen ? setIsOpen(false) : setIsOpen(true);
      }
    } else {
      setIsOpen(true);
    }
    setMarkerId(mid);
  }
  function onToggleCloseInfoWindow(mid) {
    setMarkerId(mid);
    // setIsOpen(false)
    {
      isOpen ? setIsOpen(false) : setIsOpen(true);
    }
  }
  const getAddress = (lat, lng) => {
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
  const convertSpeedToKmPerHour = (speed) => {
    return (speed * 3.6).toFixed(2); // 1 m/s = 3.6 km/h
  };
  const pathCoordinates = pullingLatandlong?.map((item) => ({
    lat: parseFloat(item.latitude),
    lng: parseFloat(item.longitude),
  }));

  return (
    <>
      {/* { } */}
      {(origin, destination) ? (
        <GoogleMap
          center={mapCenter ? mapCenter : origin}
          zoom={mapZoom}
          googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GoogleMapsAPI}`}
          // googleMapURL={`https://maps.googleapis.com/maps/api/staticmap?key=${GoogleMapsAPI}&center=${
          //   mapCenter ? mapCenter : origin
          // }&zoom=${mapZoom}`}
          mapContainerStyle={{width: '100%', height: '100%'}}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
          {pathCoordinates && (
            <Polyline
              path={pathCoordinates}
              options={{
                strokeColor: 'gray', // Change this to the color you want
                strokeOpacity: 1,
                strokeWeight: 5,
              }}
            />
          )}
          {pullingStopPage &&
            pullingStopPage?.map((ele, index) => {
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
          {pullingLatandlong &&
            pullingLatandlong?.map((ele, index) => {
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
          {/* <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: true,
              polylineOptions: {
                strokeOpacity: 1,
                strokeWeight: 6,
                strokeColor: '#119BF0',
              },
            }}
          /> */}
          {data?.polyLine ? (
            <Polyline
              path={google.maps.geometry.encoding.decodePath(
                decodeURIComponent(data?.polyLine),
              )}
              // geodesic={true}
              options={{
                strokeOpacity: 1,
                strokeWeight: 6,
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
                  strokeWeight: 6,
                  strokeColor: '#119BF0',
                },
              }}
            />
          )}
          <Marker
            position={origin}
            label={{
              text: `${1}`,
              color: 'white',
              className: 'marker-label',
              fontSize: '12px',
              fontWeight: 'bold',
            }}
            icon={{
              // url: '/assets/images/officeMarker.png',
              // url: 'https://cdn-icons-png.flaticon.com/512/2107/2107961.png',
              url: '/assets/images/redFlag.png',
              scaledSize: {width: 40, height: 50},
              anchor: new window.google.maps.Point(20, 50),
            }}
            key={0}
            // title={directions.routes[0].legs[0].start_address}
            onClick={() => {
              onToggleOpenInfoWindow(0);
            }}
          >
            {isOpen && markerId == 0 ? (
              <InfoWindow
                position={origin}
                Marker={false}
                // onCloseClick={onToggleCloseInfoWindow(0)}
              >
                <div dangerouslySetInnerHTML={{__html: startPointLabel_}}></div>
              </InfoWindow>
            ) : null}
          </Marker>
          <Marker
            position={destination}
            icon={{
              // url: 'https://maps.mappls.com/images/to.png',
              // url: 'https://cdn-icons-png.flaticon.com/512/2164/2164733.png',
              url: '/assets/images/greenFlag.png',
              scaledSize: {width: 40, height: 50},
              rotation: 360,
            }}
            // title={directions.routes[0].legs[directions.routes[0].legs.length -1].end_address}
            // onClick={() => {
            //   console.log('tesbgjfsst', data?.stops?.length - 1);
            //   onToggleOpenInfoWindow(directions.routes[0].legs.length);
            // }}
            onClick={() => {
              onToggleOpenInfoWindow(data?.stops?.length - 1);
            }}
          >
            {isOpen && markerId == data?.stops?.length - 1 ? (
              <InfoWindow
                position={destination}
                // onCloseClick={onToggleCloseInfoWindow(directions.routes[0].legs.length)}
              >
                <div dangerouslySetInnerHTML={{__html: endPointLabel_}}></div>
              </InfoWindow>
            ) : null}
          </Marker>
          {waypts.map((waypt, index) => (
            <Marker
              label={{
                text: `${index + 2}`,
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold',
                className: 'marker-label',
              }}
              position={{lat: waypt.location.lat(), lng: waypt.location.lng()}}
              icon={{
                url: 'https://maps.mappls.com/images/2.png',
                scaledSize: {width: 40, height: 50},
              }}
              // label={'W'}
              // title={directions.routes[0].legs[index + 1].start_address}
              onClick={() => {
                onToggleOpenInfoWindow(index + 1);
              }}
            >
              {isOpen && markerId == index + 1 ? (
                <InfoWindow
                  position={{
                    lat: waypt.location.lat(),
                    lng: waypt.location.lng(),
                  }}
                  // onCloseClick={onToggleCloseInfoWindow(index+1)}
                >
                  <div
                    dangerouslySetInnerHTML={{__html: wayptsLable[index]}}
                  ></div>
                </InfoWindow>
              ) : null}
            </Marker>
          ))}
        </GoogleMap>
      ) : (
        <></>
      )}
    </>
  );
};

export default TripDirection;
