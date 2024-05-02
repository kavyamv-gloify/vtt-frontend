import React, {useEffect, useState, useRef} from 'react';
import Api from '@api';
import moment from 'moment';
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

const OPTIONS = {
  minZoom: 4,
  maxZoom: 18,
};

const Map = ({siteOfficeLocation, empLocation, data}) => {
  console.log('data', data);
  const [directions, setDirections] = useState();
  const [markerId, setMarkerId] = useState();
  const [markerIdOne, setMarkerIdOne] = useState();
  const [addresses, setAddresses] = useState('');
  const mapRef = useRef(null);

  useEffect(() => {
    fitBounds();
  }, [siteOfficeLocation, empLocation, data]);

  useEffect(() => {
    console.log('dataaaaaa', data?.empPolyLine);
    if (data?.empPolyLine) return;
    const google = window.google;
    if (!empLocation.length || !siteOfficeLocation?.latitude) return;

    let tem_waypts = [];
    empLocation?.map((el, i) => {
      tem_waypts.push({
        location: new google.maps.LatLng(
          parseFloat(empLocation[i]?.latitude),
          empLocation[i]?.longitude,
        ),
      });
    });

    const directionsService = new google.maps.DirectionsService();
    data?.tripType == 'UPTRIP'
      ? directionsService.route(
          {
            destination: {
              lat: parseFloat(siteOfficeLocation?.latitude),
              lng: parseFloat(siteOfficeLocation?.longitude),
            },
            origin: {
              lat: parseFloat(empLocation[0]?.latitude),
              lng: parseFloat(empLocation[0]?.longitude),
            },
            waypoints: tem_waypts,
            optimizeWaypoints: true,
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
              const polyLine = result?.routes[0]?.overview_polyline;

              axios
                .post(
                  Api.baseUri +
                    `/user-reg/trip-driver/saveRoutePolyline?tripId=${
                      data?.tripId
                    }&polyLine=${encodeURIComponent(polyLine)}`,
                )
                .then((resp) => {
                  console.log('Response', resp.data);
                })
                .catch((err) => {
                  console.log('err', err);
                });
              console.log('result', result);
              setDirections(result);
            } else {
              console.error(`Error fetching directions: ${result}`);
            }
          },
        )
      : directionsService.route(
          {
            origin: {
              lat: parseFloat(siteOfficeLocation?.latitude),
              lng: parseFloat(siteOfficeLocation?.longitude),
            },
            destination: {
              lat: parseFloat(empLocation[0]?.latitude),
              lng: parseFloat(empLocation[0]?.longitude),
            },
            waypoints: tem_waypts,
            optimizeWaypoints: true,
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
              const polyLine = result?.routes[0]?.overview_polyline;

              axios
                .post(
                  Api.baseUri +
                    `/user-reg/trip-driver/saveRoutePolyline?tripId=${
                      currentData?.tripId
                    }&polyLine=${encodeURIComponent(polyLine)}`,
                )
                .then((resp) => {
                  console.log('Response', resp.data);
                })
                .catch((err) => {
                  console.log('err', err);
                });
              console.log('result', result);
              setDirections(result);
            } else {
              console.error(`Error fetching directions: ${result}`);
            }
          },
        );
  }, [siteOfficeLocation, empLocation, data]);

  const fitBounds = () => {
    if (!empLocation?.length || !siteOfficeLocation?.latitude) return;

    const bounds = new window.google.maps.LatLngBounds();
    empLocation?.map((item) => {
      bounds.extend({
        lat: parseFloat(item.latitude),
        lng: parseFloat(item.longitude),
      });
      return item.id;
    });
    if (siteOfficeLocation?.latitude)
      bounds.extend({
        lat: parseFloat(siteOfficeLocation.latitude),
        lng: parseFloat(siteOfficeLocation.longitude),
      });
    mapRef.current.fitBounds(bounds);
  };

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
          <Marker
            position={{
              lat: parseFloat(siteOfficeLocation?.latitude),
              lng: parseFloat(siteOfficeLocation?.longitude),
            }}
            icon={{
              url: '/assets/images/greenFlag.png',
              scaledSize: {width: 40, height: 50},
            }}
          />

          {empLocation.map((employee, index) => (
            <Marker
              key={employee.id}
              position={{
                lat: parseFloat(employee.latitude),
                lng: parseFloat(employee.longitude),
              }}
              icon={{
                url: '/assets/images/redFlag.png',
                scaledSize: {width: 40, height: 50},
              }}
            />
          ))}
          {data?.empPolyLine ? (
            <Polyline
              path={google.maps.geometry.encoding.decodePath(
                decodeURIComponent(data?.empPolyLine),
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

          {/* ... (rest of the markers and components) */}
        </GoogleMap>
      )}
    </>
  );
};

export default withScriptjs(withGoogleMap(Map));
