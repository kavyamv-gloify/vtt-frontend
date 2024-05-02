import React, {Component, useEffect, useState} from 'react';
import {
  withGoogleMap,
  GoogleMap,
  withScriptjs,
  InfoWindow,
  Marker,
} from 'react-google-maps';
import Geocode from 'react-geocode';
import Autocomplete from 'react-google-autocomplete';
import {GoogleMapsAPI} from './g-config';
Geocode.setApiKey(GoogleMapsAPI);
Geocode.enableDebug();

const areEqual = (prevProps, nextProps) => {
  if (
    prevProps.markerPosition.lat !== nextProps.center.lat ||
    prevProps.address !== nextProps.address ||
    prevProps.city !== nextProps.city ||
    prevProps.area !== nextProps.area ||
    prevProps.state !== nextProps.state
  ) {
    return true;
  } else if (prevProps.center.lat === nextProps.center.lat) {
    return false;
  }
};

function Map(props) {
  const [mapData, setMapData] = useState({
    address: '',
    city: '',
    area: '',
    state: '',
    mapPosition: {
      lat: props.center.lat,
      lng: props.center.lng,
    },
    markerPosition: {
      lat: props.center.lat,
      lng: props.center.lng,
    },
  });

  useEffect(() => {
    Geocode.fromLatLng(mapData.mapPosition.lat, mapData.mapPosition.lng).then(
      (response) => {
        const address = response.results[0].formatted_address,
          addressArray = response.results[0].address_components,
          city = getCity(addressArray),
          area = getArea(addressArray),
          state = getState(addressArray);

        setMapData({
          ...mapData,
          address: address ? address : '',
          area: area ? area : '',
          city: city ? city : '',
          state: state ? state : '',
        });
      },
      (error) => {
        console.error(error);
      },
    );
  }, [props]);

  const getCity = (addressArray) => {
    let city = '';
    for (let i = 0; i < addressArray.length; i++) {
      if (
        addressArray[i].types[0] &&
        'administrative_area_level_2' === addressArray[i].types[0]
      ) {
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
          if (
            'sublocality_level_1' === addressArray[i].types[j] ||
            'locality' === addressArray[i].types[j]
          ) {
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
        if (
          addressArray[i].types[0] &&
          'administrative_area_level_1' === addressArray[i].types[0]
        ) {
          state = addressArray[i].long_name;
          return state;
        }
      }
    }
  };

  const onChange = (event) => {
    setMapData({...mapData, [event.target.name]: event.target.value});
  };

  const onInfoWindowClose = (event) => {};

  const onMarkerDragEnd = (event) => {
    let newLat = event.latLng.lat(),
      newLng = event.latLng.lng();
    Geocode.fromLatLng(newLat, newLng).then(
      (response) => {
        const address = response.results[0].formatted_address,
          addressArray = response.results[0].address_components,
          city = getCity(addressArray),
          area = getArea(addressArray),
          state = getState(addressArray);
        setMapData({
          ...mapData,
          address: address ? address : '',
          area: area ? area : '',
          city: city ? city : '',
          state: state ? state : '',
          markerPosition: {
            lat: newLat,
            lng: newLng,
          },
          mapPosition: {
            lat: newLat,
            lng: newLng,
          },
        });
      },
      (error) => {
        console.error(error);
      },
    );
  };

  const onPlaceSelected = (place) => {
    const address = place.formatted_address,
      addressArray = place.address_components,
      city = getCity(addressArray),
      area = getArea(addressArray),
      state = getState(addressArray),
      latValue = place.geometry.location.lat(),
      lngValue = place.geometry.location.lng();

    setMapData({
      ...mapData,
      address: address ? address : '',
      area: area ? area : '',
      city: city ? city : '',
      state: state ? state : '',
      markerPosition: {
        lat: latValue,
        lng: lngValue,
      },
      mapPosition: {
        lat: latValue,
        lng: lngValue,
      },
    });
  };

  const AsyncMap = withScriptjs(
    withGoogleMap((props) => (
      <GoogleMap
        google={props.google}
        defaultZoom={props.zoom}
        defaultCenter={{
          lat: mapData.mapPosition.lat,
          lng: mapData.mapPosition.lng,
        }}
      >
        <InfoWindow
          onClose={onInfoWindowClose}
          position={{
            lat: mapData.markerPosition.lat + 0.0018,
            lng: mapData.markerPosition.lng,
          }}
        >
          <div>
            <span style={{padding: 0, margin: 0}}>{mapData.address}</span>
          </div>
        </InfoWindow>

        <Marker
          google={props.google}
          name={'Dolores park'}
          draggable={true}
          onDragEnd={onMarkerDragEnd}
          position={{
            lat: mapData.markerPosition.lat,
            lng: mapData.markerPosition.lng,
          }}
        />
        <Marker />

        <Autocomplete
          style={{
            width: '100%',
            height: '40px',
            paddingLeft: '16px',
            marginTop: '20px',
            marginBottom: '500px',
            borderRadius: '5px',
          }}
          onPlaceSelected={onPlaceSelected}
          types={['(regions)']}
        />
      </GoogleMap>
    )),
  );
  let map;
  if (props.center.lat !== undefined) {
    map = (
      <div>
        <AsyncMap
          googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GoogleMapsAPI}&libraries=places`}
          loadingElement={<div style={{height: `100%`}} />}
          containerElement={<div style={{height: props.height}} />}
          mapElement={<div style={{height: `100%`}} />}
        />
      </div>
    );
  } else {
    map = <div style={{height: props.height}} />;
  }

  return map;
}

export default Map;
