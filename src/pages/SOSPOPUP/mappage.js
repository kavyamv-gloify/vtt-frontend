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
// const {
//   MarkerWithLabel,
// } = require('react-google-maps/lib/components/addons/MarkerWithLabel');

// const geocoder = new window.google.maps.Geocoder();

const OPTIONS = {
  minZoom: 4,
  maxZoom: 18,
};
const Map = ({lat, long}) => {
  const fitBounds = () => {
    if (!lat) return;
    const bounds = new window.google.maps.LatLngBounds();
    if (lat)
      bounds.extend({
        lat: parseFloat(lat),
        lng: parseFloat(long),
      });
    mapRef.current.fitBounds(bounds);
  };
  useEffect(() => {
    fitBounds();
  }, [lat]);

  const mapRef = useRef(null);

  return (
    <>
      {lat && long && (
        <GoogleMap
          ref={mapRef}
          defaultZoom={8}
          options={OPTIONS}
          defaultCenter={{
            lat: parseFloat(lat),
            lng: parseFloat(long),
          }}
        >
          <Marker
            icon={{
              url: '/assets/images/redFlag.png',
              scaledSize: {width: 40, height: 60},
            }}
            position={{
              lat: parseFloat(lat),
              lng: parseFloat(long),
            }}
          />

          {/* <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: true,
              polylineOptions: {
                strokeOpacity: 1,
                strokeWeight: 4,
                strokeColor: '#119BF0',
              },
            }}
          /> */}
        </GoogleMap>
      )}
    </>
  );
};
export default withScriptjs(withGoogleMap(Map));
