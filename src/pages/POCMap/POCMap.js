// import React, {useState, useEffect} from 'react';
// import {Button} from '@mui/material';
// import {GoogleMapsAPI} from '../../@smart-form/GoogleMap/g-config';
// import Geocode from 'react-geocode';
// import MapPicker from 'react-google-map-picker';
// import {loadBundle} from 'firebase/firestore';
// Geocode.setApiKey(GoogleMapsAPI);
// Geocode.enableDebug();
// const DefaultLocation = {
//   lat: 12.9134051743803,
//   lng: 77.6706832097168,
// };
// const DefaultZoom = 10;
// const POCMap = () => {
//   const [open, setOpen] = useState(false);
//   const [location, setLocation] = useState(DefaultLocation);
//   const [zoom, setZoom] = useState(DefaultZoom);
//   function handleChangeLocation(lat, long) {
//     console.log('lat', lat, long);
//   }
//   function handleChangeZoom() {}
//   return (
//     <div>
// <Button
//  variant='contained'
//  onClick={() => {
//    setOpen(true);
//  }}
// >
// Open
// </Button>;
//       {open && (
//         <MapPicker
//           defaultLocation={location}
//           zoom={zoom}
//           mapTypeId='roadmap'
//           style={{maxHeight: '424px'}}
//           onChangeLocation={handleChangeLocation}
//           onChangeZoom={handleChangeZoom}
//           apiKey={GoogleMapsAPI}
//         />
//       )}
//     </div>
//   );
// };

// export default POCMap;

// Secound Type

// import React, {useState, useEffect} from 'react';
// import {
//   GoogleMap,
//   Marker,
//   DirectionsService,
//   DirectionsRenderer,
//   Polyline,
//   Autocomplete,
// } from '@react-google-maps/api';
// import {GoogleMapsAPI} from '@smart-form/GoogleMap/g-config';
// import {
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   FormControl,
//   Select,
//   MenuItem,
//   InputLabel,
// } from '@mui/material';
// import axios from 'axios';
// import {toast} from 'react-toastify';
// import Api from '@api';

// const MapWithMarkers = ({apiKey}) => {
//   const [markers, setMarkers] = useState([]);
//   const [directions, setDirections] = useState(null);
//   const [path, setPath] = useState([]);
//   const [routesData, setRoutesData] = useState([]);
//   const [showPopup, setShowPopup] = useState(false);
//   const [roadType, setRoadType] = useState('');
//   const [roadName, setRoadName] = useState('');
//   const [turnDirection, setTurnDirection] = useState('');
//   const [autocomplete, setAutocomplete] = useState(null);
//   const [mapData, setMapData] = useState({});

//   console.log('routesData', routesData);
//   const handleMapClick = (event) => {
//     const newMarker = {
//       lat: event.latLng.lat(),
//       lng: event.latLng.lng(),
//     };
//     setMarkers([...markers, newMarker]);

//     if (markers.length >= 1) {
//       setShowPopup(true); // Open popup for all points except the first one
//     }
//   };

//   const handleReset = () => {
//     setMarkers([]);
//     setDirections(null);
//     setPath([]);
//     setRoutesData([]);
//   };

//   const handleGenerateRoute = async () => {
//     try {
//       const response = await axios.post(
//         Api.baseUri + `/test/map-test/save-googleData`,
//         routesData,
//       );
//       if (response?.data?.status == '200') {
//         toast.success('Route generated successfully.');
//         console.log('Response from API:', response.data);
//         handleReset();
//       }
//     } catch (error) {
//       console.error('Error while sending data to API:', error);
//       toast.error(error);
//     }
//   };

//   const handlePopupClose = () => {
//     if (markers.length > 0) {
//       const updatedMarkers = [...markers];
//       updatedMarkers.pop();
//       setMarkers(updatedMarkers);
//     }
//     setShowPopup(false);
//   };

//   const handlePopupSubmit = () => {
//     // Store details for the current point
//     setRoutesData((prevData) => [
//       ...prevData,
//       {
//         originLat: markers[markers.length - 2].lat,
//         originLong: markers[markers.length - 2].lng,
//         destinationLat: markers[markers.length - 1].lat,
//         destinationLong: markers[markers.length - 1].lng,
//         status: 'ACTIVE',
//         roadType: roadType || 'One Way',
//         roadName: roadName || 'Gaur Road',
//         junction: turnDirection || 'turn-left',
//       },
//     ]);
//     setShowPopup(false);
//     setRoadType('');
//     setRoadName('');
//     setTurnDirection('');
//     if (markers.length >= 2) {
//       generateRoute();
//     }
//   };

//   const generateRoute = () => {
//     const waypoints = markers.map((marker) => ({
//       location: new window.google.maps.LatLng(marker.lat, marker.lng),
//       stopover: true,
//     }));

//     const origin = waypoints.shift().location;
//     const destination = waypoints.pop().location;

//     const directionsService = new window.google.maps.DirectionsService();

//     directionsService.route(
//       {
//         origin: origin,
//         destination: destination,
//         waypoints: waypoints,
//         optimizeWaypoints: true,
//         travelMode: 'DRIVING',
//       },
//       (result, status) => {
//         if (status === 'OK') {
//           setDirections(result);
//           setPath(result.routes[0].overview_path);
//         } else {
//           console.error('Directions request failed due to ' + status);
//         }
//       },
//     );
//   };

//   const onLoad = (autocomplete) => {
//     setAutocomplete(autocomplete);
//   };
//   const getCity = (addressArray) => {
//     let city = '';
//     for (let i = 0; i < addressArray.length; i++) {
//       if (
//         addressArray[i].types[0] &&
//         'administrative_area_level_2' === addressArray[i].types[0]
//       ) {
//         city = addressArray[i].long_name;
//         return city;
//       }
//     }
//   };

//   const getArea = (addressArray) => {
//     let area = '';
//     for (let i = 0; i < addressArray.length; i++) {
//       if (addressArray[i].types[0]) {
//         for (let j = 0; j < addressArray[i].types.length; j++) {
//           if (
//             'sublocality_level_1' === addressArray[i].types[j] ||
//             'locality' === addressArray[i].types[j]
//           ) {
//             area = addressArray[i].long_name;
//             return area;
//           }
//         }
//       }
//     }
//   };

//   const getState = (addressArray) => {
//     let state = '';
//     for (let i = 0; i < addressArray.length; i++) {
//       for (let i = 0; i < addressArray.length; i++) {
//         if (
//           addressArray[i].types[0] &&
//           'administrative_area_level_1' === addressArray[i].types[0]
//         ) {
//           state = addressArray[i].long_name;
//           return state;
//         }
//       }
//     }
//   };
//   // const onPlaceChanged = () => {
//   //   if (autocomplete !== null) {
//   //     console.log(autocomplete.getPlace());
//   //   } else {
//   //     console.log('Autocomplete is not loaded yet!');
//   //   }
//   // };
//   const onPlaceChanged = () => {
//     let place = autocomplete.getPlace();
//     const address = place.formatted_address,
//       addressArray = place.address_components,
//       city = getCity(addressArray),
//       area = getArea(addressArray),
//       state = getState(addressArray),
//       latValue = place.geometry.location.lat(),
//       lngValue = place.geometry.location.lng();
//     console.log('lngValue', address, city, area, state, latValue, lngValue);
//     setMapData({
//       ...mapData,
//       address: address ? address : '',
//       area: area ? area : '',
//       city: city ? city : '',
//       state: state ? state : '',
//       markerPosition: {
//         lat: latValue,
//         lng: lngValue,
//       },
//       mapPosition: {
//         lat: latValue,
//         lng: lngValue,
//       },
//     });
//   };

//   return (
//     <>
//       <div style={{position: 'relative', width: '100%', height: '100%'}}>
//         <GoogleMap
//           // center={
//           //   markers.length > 0
//           //     ? {lat: markers[0].lat, lng: markers[0].lng}
//           //     : // : {lat: 28.62, lng: 77.09}
//           //       {lat: 28.61779838224392, lng: 77.36471988976743}
//           // }
//           center={
//             markers.length > 0
//               ? {lat: markers[0].lat, lng: markers[0].lng}
//               : mapData?.mapPosition?.lat && mapData?.mapPosition?.lng
//               ? {lat: mapData?.mapPosition?.lat, lng: mapData?.mapPosition?.lng}
//               : {lat: 28.61779838224392, lng: 77.36471988976743}
//           }
//           zoom={15}
//           googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GoogleMapsAPI}`}
//           mapContainerStyle={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//           }}
//           options={{
//             zoomControl: true,
//             streetViewControl: false,
//             mapTypeControl: false,
//             fullscreenControl: false,
//           }}
//           onClick={handleMapClick}
//         >
//           <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
//             <input
//               type='text'
//               placeholder='Enter a location'
//               style={{
//                 boxSizing: `border-box`,
//                 border: `1px solid transparent`,
//                 width: `240px`,
//                 height: `32px`,
//                 padding: `0 12px`,
//                 borderRadius: `3px`,
//                 boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
//                 fontSize: `14px`,
//                 outline: `none`,
//                 textOverflow: `ellipses`,
//                 position: 'absolute',
//                 left: '50%',
//                 marginLeft: '-120px',
//               }}
//             />
//           </Autocomplete>
//           {/* {markers.map((marker, index) => (
//             <Marker
//               key={index}
//               icon={{
//                 url: `https://maps.google.com/mapfiles/ms/icons/green-dot.png`,
//                 scaledSize: new window.google.maps.Size(40, 40),
//               }}
//               position={{lat: marker.lat, lng: marker.lng}}
//             />
//           ))} */}
//           {directions && (
//             <DirectionsRenderer
//               directions={directions}
//               options={{
//                 suppressMarkers: true,
//                 polylineOptions: {
//                   strokeOpacity: 1,
//                   strokeWeight: 6,
//                   strokeColor: '#119BF0',
//                 },
//               }}
//             />
//           )}
//           {markers.map((marker, index) => (
//             <Marker
//               key={index}
//               position={{lat: marker.lat, lng: marker.lng}}
//               label={String.fromCharCode(65 + index)}
//             />
//           ))}
//         </GoogleMap>
//         <div
//           style={{
//             position: 'absolute',
//             bottom: '20px',
//             left: '50%',
//             transform: 'translateX(-50%)',
//             textAlign: 'center',
//             zIndex: 1,
//           }}
//         >
//           <Button
//             variant='contained'
//             onClick={handleReset}
//             style={{marginRight: '10px'}}
//           >
//             Reset
//           </Button>
//           <Button variant='contained' onClick={handleGenerateRoute}>
//             Generate Route
//           </Button>
//         </div>
//       </div>

//       <Dialog open={showPopup} onClose={handlePopupClose}>
//         <DialogTitle>Additional Details</DialogTitle>
//         <DialogContent>
//           <FormControl fullWidth>
//             <InputLabel>Road Type</InputLabel>
//             <Select
//               value={roadType}
//               onChange={(e) => setRoadType(e.target.value)}
//             >
//               <MenuItem value='One Way'>One Way</MenuItem>
//               <MenuItem value='Two Way'>Two Way</MenuItem>
//             </Select>
//           </FormControl>
//           <TextField
//             margin='normal'
//             label='Road Name'
//             fullWidth
//             value={roadName}
//             onChange={(e) => setRoadName(e.target.value)}
//           />
//           <TextField
//             margin='normal'
//             label='Turn Direction'
//             fullWidth
//             value={turnDirection}
//             onChange={(e) => setTurnDirection(e.target.value)}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handlePopupClose} color='primary'>
//             Cancel
//           </Button>
//           <Button onClick={handlePopupSubmit} color='primary'>
//             Submit
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

// export default MapWithMarkers;

import React, {useState, useEffect} from 'react';
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  Autocomplete,
  Polyline,
} from '@react-google-maps/api';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import axios from 'axios';
import {toast} from 'react-toastify';
import Api from '@api';
import {GoogleMapsAPI} from '@smart-form/GoogleMap/g-config';

const MapWithMarkers = ({apiKey}) => {
  const [mapData, setMapData] = useState({
    address: '',
    area: '',
    city: '',
    state: '',
    markerPosition: {lat: 28.61779838224392, lng: 77.36471988976743},
    mapPosition: {lat: 28.61779838224392, lng: 77.36471988976743},
  });
  const [markers, setMarkers] = useState([]);
  const [directions, setDirections] = useState(null);
  const [routesData, setRoutesData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState({
    roadType: '',
    roadName: '',
    turnDirection: '',
  });
  console.log('routesData', routesData, popupData);
  const [previousRoutes, setPreviousRoutes] = useState([]);
  const [groupRoutes, setGroupRoutes] = useState([]);
  const colorArray = [
    '#FF6633',
    '#FF33FF',
    '#00B3E6',
    'red',
    'green',
    'blue',
    '#B34D4D',
    '#80B300',
    '#809900',
    '#E6B3B3',
    '#6680B3',
    '#66991A',
    '#FF99E6',
    '#CCFF1A',
    '#FF1A66',
    '#E6331A',
    '#33FFCC',
    '#66994D',
    '#B366CC',
    '#4D8000',
    '#B33300',
    '#CC80CC',
    '#66664D',
    '#991AFF',
    '#E666FF',
    '#4DB3FF',
    '#1AB399',
    '#E666B3',
    '#33991A',
    '#CC9999',
    '#B3B31A',
    '#00E680',
    '#4D8066',
    '#809980',
    '#E6FF80',
    '#1AFF33',
    '#999933',
    '#FF3380',
    '#CCCC00',
    '#66E64D',
    '#4D80CC',
    '#9900B3',
    '#E64D66',
    '#4DB380',
    '#FF4D4D',
    '#99E6E6',
    '#6666FF',
  ];

  console.log('groupRoutes', groupRoutes);
  const paths = {
    R1: [
      {lat: 28.630849297163927, lng: 77.37484753131866},
      {lat: 28.630352550883615, lng: 77.37477779388428},
      {lat: 28.630140667868666, lng: 77.37476407139042},
      {lat: 28.62519248294738, lng: 77.37447925051313},
      {lat: 28.62466126223178, lng: 77.37446244217469},
    ],
    R2: [
      {lat: 28.61776541875027, lng: 77.37342097581174},
      {lat: 28.617770127821444, lng: 77.3684291797759},
    ],
  };
  const fetchData = async () => {
    try {
      const response = await axios.get(
        Api.baseUri + '/test/map-test/get-googleData',
      );
      setPreviousRoutes(response?.data?.data);
      const groupedRoutes = response?.data?.data.reduce((acc, route) => {
        const {pointLat: lat, pointLong: lng, ...rest} = route;
        const transformedRoute = {...rest, lat, lng};

        if (!acc[transformedRoute.roadName]) {
          acc[transformedRoute.roadName] = [];
        }
        acc[transformedRoute.roadName].push(transformedRoute);
        return acc;
      }, {});
      setGroupRoutes(groupedRoutes);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleMapClick = (event) => {
    const newMarker = {lat: event.latLng.lat(), lng: event.latLng.lng()};
    setMarkers([...markers, newMarker]);
    setShowPopup(true);
  };

  
  const handleReset = () => {
    setMarkers([]);
    setDirections(null);
    setRoutesData([]);
  };

  const handleGenerateRoute = async () => {
    try {
      const response = await axios.post(
        Api.baseUri + `/test/map-test/save-googleData`,
        routesData,
      );
      console.log('response', response);
      if (response?.data?.status == '200') {
        toast.success('Route generated successfully.');
        handleReset();
        fetchData();
      }
    } catch (error) {
      console.error('Error while sending data to API:', error);
      toast.error(error.message);
    }
  };

  const handlePopupClose = () => {
    if (markers.length > 0) {
      const updatedMarkers = [...markers];
      updatedMarkers.pop();
      setMarkers(updatedMarkers);
    }
    setShowPopup(false);
  };

  const handlePopupSubmit = () => {
    const currentIndex = markers.length - 1;
    const currentMarker = markers[currentIndex];
    const currentPointData = {
      pointLat: currentMarker.lat,
      pointLong: currentMarker.lng,
      index: currentIndex,
      status: 'ACTIVE',
      roadType: popupData?.roadType || '',
      roadName: popupData?.roadName || '',
      junction: currentIndex === 0 ? 'STRAIGHT' : popupData?.turnDirection,
    };

    setRoutesData((prevData) => [...prevData, currentPointData]);
    setPopupData((prevData) => ({...prevData, turnDirection: ''}));
    setShowPopup(false);
    // if (markers.length >= 2) generateRoute();
  };

  const generateRoute = () => {
    const waypoints = markers.map((marker) => ({
      location: new window.google.maps.LatLng(marker.lat, marker.lng),
      stopover: true,
    }));

    const origin = waypoints.shift().location;
    const destination = waypoints.pop().location;

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin,
        destination,
        waypoints,
        optimizeWaypoints: true,
        travelMode: 'DRIVING',
      },
      (result, status) => {
        if (status === 'OK') {
          console.log('result', result);
          setDirections(result);
        } else {
          console.error('Directions request failed due to ' + status);
        }
      },
    );
  };

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setPopupData((prevData) => ({...prevData, [name]: value}));
  };

  const polylines = [
    {
      encodedPath:
        'cjvmDsncwM|AADCBK?cADMxAA`@@DGBkD^B?xHfMHxTFbD@`HDTBV?ARyCAqBA',
      strokeColor: '#119BF0',
    },
    {
      encodedPath: 'qmtmDexcwMIhKW?@SFiNDmJ?m@H{H?cGDeEAcFFkM@}MD}KT@CdF?v@BnM',
      strokeColor: '#FF5733',
    },
    {
      encodedPath:
        '__qmDmngwMG|@y@CDiC]AOpHc@?TsHBiEFcEJqG@yEEmES?aBGuDQkFUmBKI|BEjAGbC',
      strokeColor: '#32CD32',
    },
  ];
  return (
    <>
      <div style={{position: 'relative', width: '100%', height: '100%'}}>
        <GoogleMap
          center={
            markers.length > 0
              ? {
                  lat: markers[markers?.length - 1].lat,
                  lng: markers[markers?.length - 1].lng,
                }
              : mapData?.mapPosition?.lat && mapData?.mapPosition?.lng
              ? {lat: mapData?.mapPosition?.lat, lng: mapData?.mapPosition?.lng}
              : {lat: 28.61779838224392, lng: 77.36471988976743}
          }
          zoom={15}
          // googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GoogleMapsAPI}`}
          googleMapURL={`https://maps.googleapis.com/maps/api/staticmap?key=${GoogleMapsAPI}`}
          mapContainerStyle={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onClick={handleMapClick}
        >
          {Object.values(groupRoutes).map((path, index) => (
            <Polyline
              key={index}
              path={path}
              options={{
                strokeColor: colorArray[index],
                strokeWeight: 6,
                strokeOpacity: 0.6,
                defaultVisible: true,
              }}
            />
          ))}
          {previousRoutes.map((route, index) => (
            <Marker
              key={index}
              position={{lat: route.pointLat, lng: route.pointLong}}
              // label={String.fromCharCode(65 + index)}
            />
          ))}
          {/* {polylines.map((polyline, index) => (
            <Polyline
              key={index}
              path={google.maps.geometry.encoding.decodePath(
                polyline.encodedPath,
              )}
              options={{
                strokeOpacity: 1,
                strokeWeight: 4,
                strokeColor: polyline.strokeColor,
              }}
            />
          ))} */}

          {directions && (
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
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={{lat: marker.lat, lng: marker.lng}}
              label={String.fromCharCode(65 + index)}
              onClick={handleMapClick}
            />
          ))}
        </GoogleMap>
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            zIndex: 1,
          }}
        >
          <Button
            variant='contained'
            onClick={generateRoute}
            style={{marginRight: '10px'}}
          >
            Draw Polyline
          </Button>

          <Button
            variant='contained'
            onClick={handleReset}
            style={{marginRight: '10px'}}
          >
            Reset
          </Button>

          <Button variant='contained' onClick={handleGenerateRoute}>
            Generate Route
          </Button>
        </div>
      </div>
      <Dialog
        open={showPopup}
        onClose={handlePopupClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        PaperProps={{
          sx: {
            width: '500px',
          },
        }}
      >
        <DialogTitle
          id='alert-dialog-title'
          style={{background: '#ededed', color: '#343434'}}
        >
          <h3>Route Details</h3>
        </DialogTitle>
        <DialogContent>
          <div style={{marginTop: '20px'}}>
            {markers.length === 1 ? (
              <>
                <FormControl fullWidth>
                  <InputLabel id='demo-simple-select-label'>
                    Road Type
                  </InputLabel>
                  <Select
                    labelId='demo-simple-select-label'
                    id='demo-simple-select'
                    value={popupData.roadType}
                    onChange={handleInputChange}
                    label='Road Type'
                    name='roadType'
                  >
                    <MenuItem value='EXPRESS-ROAD'>Express-Road</MenuItem>
                    <MenuItem value='CITY-ROAD'>City-Road</MenuItem>
                    <MenuItem value='SERVICE-ROAD'>Service-Road</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  autoComplete='off'
                  margin='normal'
                  label='Road Name'
                  fullWidth
                  name='roadName'
                  value={popupData.roadName}
                  onChange={handleInputChange}
                />
              </>
            ) : (
              <>
                <FormControl fullWidth>
                  <InputLabel id='demo-simple-select-label'>
                    Direction
                  </InputLabel>
                  <Select
                    labelId='demo-simple-select-label'
                    id='demo-simple-select'
                    value={popupData.turnDirection}
                    onChange={handleInputChange}
                    label='Direction'
                    name='turnDirection'
                  >
                    <MenuItem value='LEFT-TURN'>Left-Turn</MenuItem>
                    <MenuItem value='RIGHT-TURN'>Right-Turn</MenuItem>
                    <MenuItem value='STRAIGHT'>Straight-Ahead</MenuItem>
                    <MenuItem value='U-TURN'>U-Turn</MenuItem>
                    <MenuItem value='End'>End</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePopupClose} variant='contained' color='error'>
            Cancel
          </Button>
          <Button
            onClick={handlePopupSubmit}
            variant='contained'
            color='success'
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MapWithMarkers;
