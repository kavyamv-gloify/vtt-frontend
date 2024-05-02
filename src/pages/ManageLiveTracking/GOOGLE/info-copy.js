import React, {useEffect, useState, useCallback, useRef} from 'react';
// import {
//     GoogleMap,
//     withScriptjs,
//     withGoogleMap,
//     Marker,
//     Polyline
// } from 'react-google-maps';
// import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import './style.css';
import _ from 'lodash';

const Map = ({paths, stops, vehicleCordinate}) => {
  const [cOrigin, setCOrigin] = useState(vehicleCordinate);
  const googleMapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [LastAxis, setLastAxis] = useState();
  const [Loaded, setLoaded] = useState(false);

  const icon1 = {
    url: '/assets/images/car_topview_.png',
    scaledSize: new window.google.maps.Size(40, 40),
    anchor: new window.google.maps.Point(20, 20),
    scale: 0.7,
    rotation: 190,
  };

  const marker = new window.google.maps.Marker({
    position: {lat: cOrigin[0]?.lat, lng: cOrigin[0]?.lng},
    map,
    icon: icon1,
  });

  useEffect(() => {
    transition([vehicleCordinate?.lat, vehicleCordinate?.lng]);
    if (!_.isEmpty(vehicleCordinate)) setLoaded(true);
  }, [vehicleCordinate]);
  useEffect(() => {
    const googleMap = initGoogleMap();
    setMap(googleMap);
  }, []);
  useEffect(() => {
    if (!map || !Loaded) return;
    {
      stops.data.map(
        (stop, index) =>
          new window.google.maps.Marker({
            key: index,
            position: {
              lat: stop.lat,
              lng: stop.lng,
            },
            map,
            label: index + 1,
          }),
      );
    }

    const bounds = new window.google.maps.LatLngBounds();
    paths?.map((item) => {
      bounds.extend(item);
      return item.id;
    });
    map.fitBounds(bounds);

    // draw line between two points
    new window.google.maps.Polyline({
      options: {
        strokeColor: '#0088FF',
        strokeWeight: 6,
        strokeOpacity: 0.6,
        defaultVisible: true,
      },
      path: paths,
      map,
    });

    // draw marker to move from one point to another
    // setTimeout(() => {
    //     const marker1 = document.querySelector(`[src="/assets/images/car_topview_.png"]`);
    //     marker1.style.transform = `rotate(${90}deg)`;
    //     if(!_.isEmpty(LastAxis))animatedMove(marker, new window.google.maps.LatLng(LastAxis.lat, LastAxis.lng), new window.google.maps.LatLng(vehicleCordinate.lat, vehicleCordinate.lng), 3);
    //     setLastAxis(vehicleCordinate);
    // }, 1000)
  }, [map, Loaded]);

  const initGoogleMap = () => {
    return new window.google.maps.Map(googleMapRef.current, {
      // center: new window.google.maps.LatLng(37.7699298, -122.4469157),
      zoom: 12,
    });
  };

  const animatedMove = async (marker, moveFrom, moveTo, t, delta = 100) => {
    return new Promise((resolve) => {
      const deltalat = (moveTo.lat() - moveFrom.lat()) / delta;
      const deltalng = (moveTo.lng() - moveFrom.lng()) / delta;
      let delay = 10 * t,
        count = 0;
      for (let i = 0; i < delta; i++) {
        (function (ind) {
          setTimeout(function () {
            let lat = marker.position.lat();
            let lng = marker.position.lng();
            lat += deltalat;
            lng += deltalng;
            marker.setPosition(new window.google.maps.LatLng(lat, lng));
            count++;
            if (count === delta) {
              resolve(marker);
            }
          }, delay * ind);
        })(i);
      }
    });
  };

  var numDeltas = 100;
  var delay = 10; //milliseconds
  var i = 0;
  var deltaLat;
  var deltaLng;
  function transition(result) {
    i = 0;
    deltaLat = (result[0] - paths[0]?.lat) / numDeltas;
    deltaLng = (result[1] - paths[1]?.lng) / numDeltas;
    moveMarker();
  }

  function moveMarker() {
    if (!_.isNaN(deltaLat)) paths[0].lat += deltaLat;
    if (!_.isNaN(deltaLng)) paths[1].lng += deltaLng;
    var latlng = new google.maps.LatLng(paths[0]?.lat, paths[1]?.lng);

    marker.setPosition(latlng);
    if (i != numDeltas) {
      i++;
      setTimeout(moveMarker, delay);
    }
  }

  return (
    <>
      {stops?.data?.length && (
        <Card variant='outlined'>
          <div ref={googleMapRef} style={{width: '100%', height: 600}} />
        </Card>
      )}
    </>
  );
};
export default Map;
// withScriptjs(
//     withGoogleMap(
//         Map
//     )
// )
