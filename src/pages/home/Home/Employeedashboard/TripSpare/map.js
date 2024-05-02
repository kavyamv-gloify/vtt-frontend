import {
  GoogleMap,
  withScriptjs,
  withGoogleMap,
  Marker,
  Polyline,
  InfoWindow,
} from 'react-google-maps';
import React, {useEffect, useRef, useState} from 'react';
import Api from '@api';
import axios from 'axios';
import MapWithAMarker from './mappage';
import {GoogleMapsAPI} from '@smart-form/GoogleMap/g-config';

const Map = ({stops, siteOfficeLocation}) => {
  return (
    <div className='gMapCont'>
      <MapWithAMarker
        // googleMapURL={mapURL}
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GoogleMapsAPI}`}
        siteOfficeLocation={siteOfficeLocation}
        stops={stops}
        containerElement={<div style={{height: `150px`}} />}
        mapElement={<div style={{height: `100%`}} />}
        loadingElement={`<div style={{ height: '100%' }} />`}
      />
    </div>
  );
};

export default Map;
