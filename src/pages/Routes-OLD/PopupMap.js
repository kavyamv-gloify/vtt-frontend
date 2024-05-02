import React, { Component, useEffect, useState } from 'react';
import { withGoogleMap, GoogleMap, Circle, withScriptjs, InfoWindow, Marker, DirectionsRenderer } from "react-google-maps";
import Geocode from "react-geocode";
import { GoogleMapsAPI } from '../../@smart-form/GoogleMap/g-config';
import axios from 'axios';
import { Button } from '@mui/material';
Geocode.setApiKey(GoogleMapsAPI);
Geocode.enableDebug();

function Map({ getAssignees, radius }) {
  const props = { height: "500px", center: { lat: 28.6590525, lng: 77.4049277 } }
  const [activeMarker, setActiveMarker] = useState(null);
  const places = {
    id: '0',
    name: "Velocis Systems Pvt. Ltd.",
    latitude: "40.6655101",
    longitude: "-73.89188969999998",
    circle: {
      radius: 16000,
      options: {
        strokeColor: "blue"
      }
    }
  }
  const DirectionsService = new google.maps.DirectionsService();
  let [directions, setDirections] = useState("");

  DirectionsService.route(
    {
      origin: { lat: parseFloat(places?.latitude), lng: parseFloat(places?.longitude) },
      destination: { lat: parseFloat(places?.latitude), lng: parseFloat(places?.longitude) },
      travelMode: google.maps.TravelMode.DRIVING,
      waypoints: [
        {
          location: { lat: 40.7955101, lng: -73.8228969999998 }
        },
        {
          location: { lat: 40.6955101, lng: -73.8228969999998 }
        },
        {
          location: { lat: 40.6955101, lng: -73.8928969999998 }
        },
      ]
    },
    (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        setDirections(result);
      } else {
      }
    }
  );

  const handleActiveMarker = (marker) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
  };
  const [mapData, setMapData] = useState({
    address: '',
    city: '',
    area: '',
    state: '',
    mapPosition: {
      lat: 40.6655101,
      lng: -73.89188969999998
    },
    markerPosition: {
      lat: 40.6655101,
      lng: -73.89188969999998
    }
  });

  useEffect(() => {
    Geocode.fromLatLng(mapData.mapPosition.lat, mapData.mapPosition.lng).then(
      response => {
        const address = response.results[0].formatted_address,
          addressArray = response.results[0].address_components,
          city = getCity(addressArray),
          area = getArea(addressArray),
          state = getState(addressArray);
        setMapData({
          ...mapData,
          address: (address) ? address : '',
          area: (area) ? area : '',
          city: (city) ? city : '',
          state: (state) ? state : '',
        })
      },
      error => {
        console.error(error);
      }
    );
  }, [])

  const getCity = (addressArray) => {
    let city = '';
    for (let i = 0; i < addressArray.length; i++) {
      if (addressArray[i].types[0] && 'administrative_area_level_2' === addressArray[i].types[0]) {
        city = addressArray[i].long_name;
        return city;
      }
    }
  };
  const getArea = (addressArray) => {
    let area = '';
    for (let i = 0; i < addressArray.length; i++) {
      if (addressArray[i].types[0]) {
        for (let j = 0; j < addressArray[i].types.length; j++) {
          if ('sublocality_level_1' === addressArray[i].types[j] || 'locality' === addressArray[i].types[j]) {
            area = addressArray[i].long_name;
            return area;
          }
        }
      }
    }
  };

  const getState = (addressArray) => {
    let state = '';
    for (let i = 0; i < addressArray.length; i++) {
      for (let i = 0; i < addressArray.length; i++) {
        if (addressArray[i].types[0] && 'administrative_area_level_1' === addressArray[i].types[0]) {
          state = addressArray[i].long_name;
          return state;
        }
      }
    }
  };

  const handleGoogleMapApi = (google, path) => {
    var flightPath = new google.maps.Polyline({
      path: [{ "lat": 40.659568, "lng": -73.933782 }, { "lat": 40.659561, "lng": -73.933783 }, { "lat": 40.659560, "lng": -73.933789 }],
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
    flightPath.setMap(google.map);
  }
  const AsyncMap = withScriptjs(
    withGoogleMap(
      () => (
        <GoogleMap google={props.google}
          defaultZoom={10}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={handleGoogleMapApi}
          // defaultCenter={{ lat: -34.897, lng: 151.144 }}
          defaultCenter={{ lat: 40.7955101, lng: -73.8228969999998 }}
        >
          <Marker
            position={{
              lat: parseFloat(places.latitude),
              lng: parseFloat(places.longitude)
            }}
            onMouseOver={() => handleActiveMarker(places.id.toString())}
            onMouseOut={() => setActiveMarker(null)}
          // label={"V"}
          >
            {activeMarker == places.id &&
              <InfoWindow visible={activeMarker == places.id} onCloseClick={() => setActiveMarker(null)}>
                <div>{places.name}</div>
              </InfoWindow>}
          </Marker>
          {places.circle && (
            <Circle
              defaultCenter={{
                lat: parseFloat(places.latitude),
                lng: parseFloat(places.longitude)
              }}
              radius={places.circle.radius}
              options={places.circle.options}
            />
          )}
          {/* <DirectionsRenderer origin={{ lat: 40.756795, lng: -73.954298 }} suppressMarkers: true, preserveViewport: true,  destination={{ lat: parseFloat(places?.latitude), lng: parseFloat(places?.longitude) }} /> */}
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      )
    )
  );
  let map;
  if (props.center.lat !== undefined) {
    map = <div style={{ marginTop: "15px", width:"3000px"}}>
      <AsyncMap
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GoogleMapsAPI}&libraries=places`}
        loadingElement={
          <div style={{ height: `100%` }} />
        }
        containerElement={
          <div style={{ height: props.height }} />
        }
        mapElement={
          <div style={{ height: `100%` }} />
        }
      />
    </div>
  } else {
    map = <div style={{ height: props.height }} />
  }
  return map;
}

export default Map
