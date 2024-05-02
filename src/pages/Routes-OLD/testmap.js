import React, { Component, useEffect, useState } from 'react';
import { withGoogleMap, GoogleMap, Circle, withScriptjs, InfoWindow, Marker, DirectionsRenderer } from "react-google-maps";
import Geocode from "react-geocode";
import { GoogleMapsAPI } from '../../@smart-form/GoogleMap/g-config';
import axios from 'axios';
import { Button } from '@mui/material';
import Api from '@api';
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
  // const DirectionsService = new google.maps.DirectionsService();
  // let [directions, setDirections] = useState("");

  // DirectionsService.route(
  //   {
  //     origin: { lat: parseFloat(places?.latitude), lng: parseFloat(places?.longitude) },
  //     destination: { lat: parseFloat(places?.latitude), lng: parseFloat(places?.longitude) },
  //     travelMode: google.maps.TravelMode.DRIVING,
  //     waypoints: [
  //       {
  //         location: { lat: 40.7955101, lng: -73.8228969999998 }
  //       },
  //       {
  //         location: { lat: 40.6955101, lng: -73.8228969999998 }
  //       },
  //       {
  //         location: { lat: 40.6955101, lng: -73.8928969999998 }
  //       },
  //     ]
  //   },
  //   (result, status) => {
  //     if (status === google.maps.DirectionsStatus.OK) {
  //       setDirections(result);
  //     } else {
  //       console.error(`error fetching directions ${result}`);
  //     }
  //   }
  // );
  // const [joinMarker, setJoinMarker] = useState([])
  const [apiRes, setApiRes] = useState({
    // "boardingEmployeeDto": [
    //   {
    //       "id": "62e8c55520093d498eed7315",
    //       "employeename": "suraj",
    //       "latitude": "25.000",
    //       "longitude": "25.00",
    //       "locName": "noida",
    //       "index": "12345"
    //   },
    boardingEmployeeDto: [
      {
        id: 'VEL/N/0908/22218',
        employeename: 'Raj Ranjan',
        gender: 'Male',
        distance: null,
        straightDistance: null,
        latitude: "40.659569",
        longitude: "-73.933783",
        locName: "Noida",
        index: null,
        // location: { lat: '40.659569', long: '-73.933783', locname: 'Noida' }
      },
      {
        id: 'VEL/N/0908/22231',
        employeename: 'Raju',
        gender: 'Male',
        distance: null,
        straightDistance: null,
        latitude: "40.659969",
        longitude: "-73.935783",
        locName: "Noida",
        index: null,
        // location: { lat: '40.659569', long: '-73.933783', locname: 'Noida' }
      },
      {
        id: 'VEL/N/0908/2221',
        employeename: 'Raju',
        gender: 'Male',
        distance: null,
        straightDistance: null,
        latitude: "40.659969",
        longitude: "-73.935783",
        locName: "Noida",
        index: null,
        // location: { lat: '40.659569', long: '-73.933783', locname: 'Noida' }
      },
      {
        id: 'VEL/N/0908/22021',
        employeename: 'Raju',
        gender: 'Male',
        distance: null,
        straightDistance: null,
        latitude: "40.659969",
        longitude: "-73.935783",
        locName: "Noida",
        index: null,
        // location: { lat: '40.659569', long: '-73.933783', locname: 'Noida' }
      },
      {
        id: 'VEL/N/0908/22291',
        employeename: 'Raju',
        gender: 'Male',
        distance: null,
        straightDistance: null,
        latitude: "40.659969",
        longitude: "-73.935783",
        locName: "Noida",
        index: null,
        // location: { lat: '40.659569', long: '-73.933783', locname: 'Noida' }
      },
      {
        id: 'VEL/N/0920/2801',
        employeename: 'Raj Tripathi',
        gender: 'Male',
        distance: null,
        straightDistance: null,
        index: null,
        latitude: "40.729029",
        longitude: "-73.851524",
        locName: "Noida",
        // location: { lat: '40.729029', long: '-73.851524', locname: 'Noida' }
      },
      {
        id: 'VEL/N/0920/2901',
        employeename: 'Mohit',
        gender: 'Male',
        distance: null,
        straightDistance: null,
        index: null,
        latitude: "40.729129",
        longitude: "-73.852524",
        locName: "Noida",
        // location: { lat: '40.729029', long: '-73.851524', locname: 'Noida' }
      },
      {
        id: 'VEL/R/1020/2191',
        employeename: 'Sneha Singh',
        gender: 'Female',
        distance: null,
        straightDistance: null,
        index: null,
        latitude: "40.6860072",
        longitude: "-73.6334271",
        locName: "Noida",
        // location: { lat: '40.6860072', long: '-73.6334271', locname: 'Noida' }
      },
      {
        id: 'VEL/T/1090/2198',
        employeename: 'Neha Singh',
        gender: 'Female',
        distance: null,
        straightDistance: null,
        index: null,
        latitude: "40.598566",
        longitude: "-73.7527626",
        locName: "Noida",
        // location: { lat: '40.598566', long: '-73.7527626', locname: 'Noida' }
      },
      {
        id: 'VEL/T/1097/2199',
        employeename: 'Neeraj Singh',
        gender: 'Male',
        distance: null,
        straightDistance: null,
        index: null,
        latitude: "40.598586",
        longitude: "-73.7527926",
        locName: "Noida",
        // location: { lat: '40.598566', long: '-73.7527626', locname: 'Noida' }
      },
      {
        id: 'VEL/T/8020/2191',
        employeename: 'Nikky Singh',
        gender: 'Female',
        distance: null,
        straightDistance: null,
        index: null,
        latitude: "40.598569",
        longitude: "-73.7527629",
        locName: "Noida",
        // location: { lat: '40.598566', long: '-73.7527626', locname: 'Noida' }
      },
      {
        id: 'VEL/N/9023/2191',
        employeename: 'Maddy Singh',
        gender: 'Female',
        distance: null,
        straightDistance: null,
        index: null,
        latitude: "40.598509",
        longitude: "-73.7527609",
        locName: "Noida",
        // location: { lat: '40.598566', long: '-73.7527626', locname: 'Noida' }
      }
    ],
    rosterId: [],
    corpId: ""
  });

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
  function arePointsNear(checkPoint, centerPoint) {
    var ky = 40000 / 360;
    var kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky;
    var dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
    var dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
    return Math.sqrt(dx * dx + dy * dy);
  }
  // https://maps.googleapis.com/maps/api/distancematrix/json?origins=${places.latitude}%2C-${places.longitude}&destinations=${e.location.lat}%2C-${e.location.long}
  useEffect(() => {
    // apiRes?.employees?.map((e) => {
    // axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=40.6655101%2C-73.89188969999998&destinations=40.659569%2C-73.933783%7C40.729029%2C-73.851524%7C40.6860072%2C-73.6334271%7C40.598566%2C-73.7527626&key=AIzaSyDmi-Upou8tVu263Vi0-nRS_tq7kCpYZ2c&travelMode=WALKING`).then((res)=>{

    // axios.get(`http://180.151.3.104:9000/trip/getdist/geocode?language=en&origins=40.6655101%2C-73.89188969999998&destinations=40.659569%2C-73.933783%7C40.729029%2C-73.851524%7C40.6860072%2C-73.6334271%7C40.598566%2C-73.7527626&key=${GoogleMapsAPI}`)
    // .then((response) => {
    let response = { "data": { "destination_addresses": ["585 Schenectady Ave, Brooklyn, NY 11203, USA", "102-01 66th Rd, Queens, NY 11375, USA", "1000 N Village Ave, Rockville Centre, NY 11570, USA", "327 Beach 19th St, Far Rockaway, NY 11691, USA"], "origin_addresses": ["P.O. Box 793, Brooklyn, NY 11207, USA"], "rows": [{ "elements": [{ "distance": { "text": "4.8 km", "value": 4788 }, "duration": { "text": "19 mins", "value": 1143 }, "status": "OK" }, { "distance": { "text": "13.7 km", "value": 13744 }, "duration": { "text": "24 mins", "value": 1419 }, "status": "OK" }, { "distance": { "text": "25.3 km", "value": 25345 }, "duration": { "text": "31 mins", "value": 1858 }, "status": "OK" }, { "distance": { "text": "21.1 km", "value": 21118 }, "duration": { "text": "35 mins", "value": 2117 }, "status": "OK" }] }], "status": "OK" }, "status": 200, "statusText": "", "headers": { "content-type": "application/json" }, "config": { "url": `${Api?.routes?.getDist}geocode?language=en&origins=40.6655101%2C-73.89188969999998&destinations=40.659569%2C-73.933783%7C40.729029%2C-73.851524%7C40.6860072%2C-73.6334271%7C40.598566%2C-73.7527626&key=AIzaSyDmi-Upou8tVu263Vi0-nRS_tq7kCpYZ2c`, "method": "get", "headers": { "Accept": "application/json, text/plain, */*" }, "transformRequest": [null], "transformResponse": [null], "timeout": 0, "xsrfCookieName": "XSRF-TOKEN", "xsrfHeaderName": "X-XSRF-TOKEN", "maxContentLength": -1, "maxBodyLength": -1, "transitional": { "silentJSONParsing": true, "forcedJSONParsing": true, "clarifyTimeoutError": false } }, "request": {} }
    let myDistanceArray = response?.data?.rows[0]?.elements ?? [];
    let tempArray = apiRes;
    myDistanceArray?.map((dis, ind) => {
      let myStrDist = arePointsNear({ lat: tempArray?.boardingEmployeeDto[ind]?.latitude, lng: tempArray.boardingEmployeeDto[ind].longitude }, { lat: places?.latitude, lng: places?.longitude });
      // if(dis?.distance?.value < places.circle.radius){
      tempArray.boardingEmployeeDto[ind].isInRadius = (myStrDist * 1000 < places.circle.radius) ? true : false;
      tempArray.boardingEmployeeDto[ind].straightDistance = myStrDist * 1000;
      tempArray.boardingEmployeeDto[ind].distance = dis?.distance?.value;
      // }
    })
    setApiRes(tempArray);
    // apiRes
    // })
    // .catch((error) => {
    // });

    // })
  }, [])

  useEffect(() => {
    if (!apiRes?.boardingEmployeeDto?.length) return;
    let tem = [];
    if (apiRes?.boardingEmployeeDto?.length) {
      apiRes?.boardingEmployeeDto.map(m => {
        tem.push({ lat: parseFloat(m?.latitude), lng: parseFloat(m?.longitude) })
      })
    }
    tem.push({ lat: parseFloat(places?.latitude), lng: parseFloat(places?.longitude) })
    // setJoinMarker(tem);

    let mytemArr = apiRes;
    let mySortedEmpArray = [];
    let radiusEmp = []
    mytemArr?.boardingEmployeeDto?.map((re, ind) => { if (re.isInRadius) { radiusEmp.push(re); } })

    let farestDistVal = 0;
    let firstEmp = {}
    let firstInd
    let myloop = radiusEmp?.length
    if (radiusEmp?.length) {
      radiusEmp?.map((re, ind) => { if (farestDistVal < re.straightDistance) { farestDistVal = re.straightDistance; firstEmp = re; firstInd = ind; } })
      radiusEmp.splice(firstInd, 1);
      mySortedEmpArray.push(firstEmp);
    }
    for (let i = 0; i < myloop; i++) {
      let SecondDistVal = 0;
      let SecondEmp = {}
      let secondInd
      if (radiusEmp?.length) {
        radiusEmp?.map((re, ind) => {
          let tem = arePointsNear({ lat: re?.latitude, lng: re?.longitude }, { lat: mySortedEmpArray[mySortedEmpArray.length - 1]?.latitude, lng: mySortedEmpArray[mySortedEmpArray.length - 1]?.longitude });
          if (SecondDistVal < tem) {
            SecondDistVal = tem
            SecondEmp = re;
            secondInd = ind;
          }
        })
        mySortedEmpArray.push(SecondEmp);
        radiusEmp.splice(secondInd, 1);
      }
    }

    getAssignees(mySortedEmpArray);
    // let seqEmp = [farestRadiusEmployee];
    // while(seqEmp.length == radiusEmp.length){
    // radiusEmp?.map((re, ind)=>{
    // })
    // }
    // let myStrDist = arePointsNear({ lat: a?.latitude, lng: a.longitude }, { lat: b?.latitude, lng: b?.longitude });

    // radiusEmp.sort(function (a, b) { 
    //   return Number(b.id) - Number(a.id); 
    // });
  }, [apiRes])
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

  const icon = {
    url: "https://cdn3.iconfinder.com/data/icons/maps-and-navigation-7/65/68-512.png",
    scaledSize: new google.maps.Size(30, 30),
  };
  // const handleGoogleMapApi = (google) => {
  //   var flightPath = new google.maps.Polyline({
  //     path: [ { "lat": 40.659568, "lng": -73.933782 },{ "lat": 40.659561, "lng": -73.933783 },{ "lat": 40.659560, "lng": -73.933789 } ],
  //     geodesic: true,
  //     strokeColor: 'green',
  //     strokeOpacity: 1,
  //     strokeWeight: 5
  //   });
  //   flightPath.setMap(google.map);
  // }
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
          defaultCenter={{ lat: mapData.mapPosition.lat, lng: mapData.mapPosition.lng }}
        >
          {/* <GoogleMap defaultZoom={7} defaultCenter={{ lat: -34.897, lng: 151.144 }}> */}
          {/* <DirectionsRenderer
      path={joinMarker}
        // {
        //   lat: 40.598586,
        //   lng: -73.7527926
        // },
        
        // { lat: -34.397, lng: 150.644 }, { lat: -35.397, lng: 151.644 }
      // ]}
    /> */}
          {/* </GoogleMap> */}
          {/* <Polyline path={[{
            lat: 40.598586,
            lng: -73.7527926
          },
          {
            lat: 40.598569,
            lng: -73.7527629
          }]} /> */}
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
          {/* <InfoWindow
            position={{ lat: (mapData.markerPosition.lat + 0.0048), lng: mapData.markerPosition.lng }}
          >
            <div>
              <span style={{ padding: 0, margin: 0 }}>{mapData.address}</span>
            </div>
          </InfoWindow> */}
          {/* <DirectionsRenderer origin={{ lat: 40.756795, lng: -73.954298 }} suppressMarkers: true, preserveViewport: true,  destination={{ lat: parseFloat(places?.latitude), lng: parseFloat(places?.longitude) }} /> */}
          {/* {directions && <DirectionsRenderer directions={directions} />} */}
          {apiRes?.boardingEmployeeDto?.map((place, ind) => {
            return (
              <React.Fragment key={place.id}>
                <Marker
                  icon={icon}
                  label={place?.distance ?? "LL"} //< places.circle.radius ? ind.toString() : ""
                  onMouseOver={() => handleActiveMarker(place.id)}
                  onMouseOut={() => setActiveMarker(null)}
                  position={{
                    lat: parseFloat(place?.latitude),
                    lng: parseFloat(place?.longitude)
                  }}
                >
                  {activeMarker === place.id &&
                    <InfoWindow visible={activeMarker === place.id} shouldFocus={false} onCloseClick={() => setActiveMarker(null)}>
                      <div>{place.employeename}</div>
                    </InfoWindow>
                  }
                </Marker>
              </React.Fragment>
            );
          })}
        </GoogleMap>
      )
    )
  );
  let map;
  if (props.center.lat !== undefined) {
    map = <div style={{ marginTop: "15px" }}>
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
