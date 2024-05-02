import React, {useState, useEffect, useRef} from 'react';
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  DirectionsRenderer,
  InfoWindow,
} from '@react-google-maps/api';
import {GoogleMapsAPI} from '@smart-form/GoogleMap/g-config';
import {size} from 'lodash';

const DefaultLocation = {lat: 28.62, lng: 77.09};

const DirectionWithMultipleViaPoints = () => {
  const {isLoaded} = useJsApiLoader({
    googleMapsApiKey: {GoogleMapsAPI},
    libraries: ['places'],
  });
  const [directions, setDirections] = useState(null);
  const origin = {lat: 28.62, lng: 77.09};
  const destination = {lat: 28.52, lng: 77.19};
  const waypts = [
    {
      location: new google.maps.LatLng(28.5449, 77.1281),
    },
    {
      location: new google.maps.LatLng(28.5562, 77.1),
    },
    {
      location: new google.maps.LatLng(28.5843, 77.0716),
    },
  ];
  useEffect(() => {
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
          setDirections(result);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      },
    );
  }, []);
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <GoogleMap
        center={DefaultLocation}
        zoom={10}
        mapContainerStyle={{width: '100%', height: '100%'}}
        options={{
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
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
        <Marker
          position={origin}
          icon={{
            url: 'https://maps.mappls.com/images/from.png',
            scaledSize: {width: 30, height: 40},
          }}
          title={directions.routes[0].legs[0].start_address}
        />
        <Marker
          position={destination}
          icon={{
            url: 'https://maps.mappls.com/images/to.png',
            scaledSize: {width: 30, height: 40},
          }}
          title={
            directions.routes[0].legs[directions.routes[0].legs.length - 1]
              .end_address
          }
        />
        {waypts.map((waypt, index) => (
          <Marker
            position={{lat: waypt.location.lat(), lng: waypt.location.lng()}}
            icon={{
              url: 'https://maps.mappls.com/images/2.png',
              scaledSize: {width: 30, height: 40},
            }}
            // label={'W'}
            title={directions.routes[0].legs[index].start_address}
          />
        ))}
      </GoogleMap>
    </>
  );
};

export default DirectionWithMultipleViaPoints;
