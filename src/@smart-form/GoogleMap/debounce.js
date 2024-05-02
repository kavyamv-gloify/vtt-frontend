// import { Input, TextField } from '@mui/material';
// import React, {FC, useRef, useState} from 'react';
// import Autocomplete, {usePlacesWidget} from 'react-google-autocomplete';

// // Custom debounce function
// function debounce(func, delay) {
//   let timer;
//   return function (...args) {
//     const context = this;
//     clearTimeout(timer);
//     timer = setTimeout(() => func.apply(context, args), delay);
//   };
// }

// function App() {
//   const inputRef = useRef(null);
//   const [country, setCountry] = useState('in');

//   // Define the debounced function
//   const debouncedOnPlaceSelected = debounce((place) => {
//     console.log(place);
//   }, 500);

//   const {ref: materialRef} = usePlacesWidget({
//     apiKey: process.env.REACT_APP_GOOGLE,
//     onPlaceSelected: (place) => {
//       debouncedOnPlaceSelected(place);
//     },
//     inputAutocompleteValue: 'country',
//     options: {
//       componentRestrictions: {country},
//     },
//   });

//   return (
//     <div className='App'>
//       <header className='App-header'>
//         <span style={{color: 'black'}}>Standard HTML</span>
//         <Autocomplete
//           style={{width: '250px'}}
//           ref={inputRef}
//           apiKey={process.env.REACT_APP_GOOGLE}
//           onPlaceSelected={(selected, a, c) => {
//             console.log(selected);
//           }}
//           options={{
//             types: ['geocode', 'establishment'],
//             componentRestrictions: {country},
//           }}
//           defaultValue='Moscow'
//         />
//         <select
//           onChange={(v) => {
//             setCountry(v.target.value);
//           }}
//           style={{color: 'black', display: 'none'}}
//         >
//           <option key='1' value='us'>
//             Us
//           </option>
//           <option key='2' value='ru'>
//             Ru
//           </option>
//         </select>
//         <div style={{width: '250px'}}>
//           <span style={{color: 'black'}}>Material UI</span>
//           <Input
//             fullWidth
//             color='secondary'
//             inputComponent={({inputRef, onFocus, onBlur, ...props}) => (
//               <Autocomplete
//                 apiKey={process.env.REACT_APP_GOOGLE}
//                 {...props}
//                 onPlaceSelected={(selected) => console.log(selected)}
//               />
//             )}
//           />
//         </div>
//         <div style={{width: '250px', marginTop: '20px'}}>
//           <span style={{color: 'black'}}>Material UI</span>
//           <TextField
//             fullWidth
//             color='secondary'
//             variant='outlined'
//             inputRef={materialRef}
//           />
//         </div>
//       </header>
//     </div>
//   );
// }

// export default App;

// import React, {useState, useEffect} from 'react';
// import MapPicker from 'react-google-map-picker';
// import TextField from '@mui/material/TextField';
// import InputAdornment from '@mui/material/InputAdornment';
// import AddLocationIcon from '@mui/icons-material/AddLocation';
// import Button from '@mui/material/Button';
// import {
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
// } from '@mui/material';
// import Api from '@api';
// import Geocode from 'react-geocode';
// import Autocomplete from 'react-google-autocomplete';
// import {GoogleMapsAPI} from './g-config';
// import _ from 'lodash';
// Geocode.setApiKey(GoogleMapsAPI);
// Geocode.enableDebug();

// const style = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: '70%',
//   bgcolor: '#00000000',
//   // border: '2px solid #000',
//   // boxShadow: 24,
//   pt: 2,
//   px: 4,
//   pb: 3,
//   display: 'none',
// };

// const DefaultLocation = {
//   lat: 12.9134051743803,
//   lng: 77.6706832097168,
// };
// const DefaultZoom = 10;
// let myobj = {
//   locName: '',
//   latitude: '',
//   longitude: '',
//   city: '',
//   state: '',
//   pincode: '',
//   district: '',
//   subDistrict: '',
//   area: '',
//   locality: '',
// };

// export default function index(props) {
//   const [defaultLocation, setDefaultLocation] = useState(DefaultLocation);
//   const [location, setLocation] = useState(defaultLocation);
//   const [zoom, setZoom] = useState(DefaultZoom);
//   useEffect(() => {
//     // console.log(props?.defaultValue, 'fasdfasf');
//     handleChangeLocation(
//       props?.defaultValue?.latitude || DefaultLocation.lat,
//       props?.defaultValue?.longitude || DefaultLocation.lng,
//     );
//   }, []);

//   useEffect(() => {
//     let obj = {
//       lat: Number(props?.defaultValue?.latitude || DefaultLocation.lat),
//       lng: Number(props?.defaultValue?.longitude || DefaultLocation.lng),
//     };
//     setDefaultLocation({...obj});
//     setLocation({...obj});
//   }, [props?.defaultValue]);

//   function handleChangeLocation(lat, lng) {
//     setLocation({lat: lat, lng: lng});
//   }
//   const getCity = (addressArray) => {
//     let city = '';
//     for (let i = 0; i < addressArray.length; i++) {
//       if (
//         (addressArray[i].types[0] && 'locality' === addressArray[i].types[0]) ||
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
//           // 'locality' === addressArray[i].types[0]
//         ) {
//           state = addressArray[i].long_name;
//           return state;
//         }
//       }
//     }
//   };
//   const getDistrict = (addressArray) => {
//     let district = '';
//     for (let i = 0; i < addressArray.length; i++) {
//       for (let i = 0; i < addressArray.length; i++) {
//         if (
//           addressArray[i].types[0] &&
//           'administrative_area_level_3' === addressArray[i].types[0]
//         ) {
//           district = addressArray[i].long_name;
//           return district;
//         }
//       }
//     }
//   };
//   const getSubDistrict = (addressArray) => {
//     let subDistrict = '';
//     for (let i = 0; i < addressArray.length; i++) {
//       for (let j = 0; j < addressArray.length; j++) {
//         if (
//           'sublocality_level_1' === addressArray[i].types[j] ||
//           'locality' === addressArray[i].types[j]
//         ) {
//           subDistrict = addressArray[i].long_name;
//           return subDistrict;
//         }
//       }
//     }
//   };
//   const getPincode = (addressArray) => {
//     let pincode = '';
//     for (let i = 0; i < addressArray.length; i++) {
//       for (let i = 0; i < addressArray.length; i++) {
//         if (
//           addressArray[i].types[0] &&
//           'postal_code' === addressArray[i].types[0]
//         ) {
//           pincode = addressArray[i].long_name;
//           return pincode;
//         }
//       }
//     }
//   };

//   const getLocality = (addressArray) => {
//     let locality = '';
//     for (let i = 0; i < addressArray.length; i++) {
//       for (let i = 0; i < addressArray.length; i++) {
//         if (
//           addressArray[i].types[0] &&
//           'establishment' === addressArray[i].types[0]
//         ) {
//           locality = addressArray[i].long_name;
//           return locality;
//         }
//       }
//     }
//   };

//   function handleChangeZoom(newZoom) {
//     setZoom(newZoom);
//   }

//   function handleResetLocation() {
//     setDefaultLocation({...DefaultLocation});
//     setZoom(DefaultZoom);
//   }

//   const styleMap = {
//     minWidth: '98%',
//     minHeight: '400px',
//     display: 'inline-block',
//   };
//   // var mapObject, picker;
//   const [open, setOpen] = useState(false);
//   const [mapData, setMapData] = useState(null);

//   useEffect(() => {
//     if (props?.defaultValue?.longitude) {
//       setMapData({
//         locName: props?.defaultValue?.locName,
//         latitude: props?.defaultValue?.latitude,
//         longitude: props?.defaultValue?.longitude,
//         city: props?.defaultValue?.city,
//         state: props?.defaultValue?.state,
//         pincode: props?.defaultValue?.pincode,
//         district: props?.defaultValue?.district,
//         subDistrict: props?.defaultValue?.subDistrict,
//         area: props?.defaultValue?.area,
//       });
//       setLocation({
//         lat: props?.defaultValue?.latitude,
//         lng: props?.defaultValue?.longitude,
//       });
//     }
//   }, []);

//   useEffect(() => {
//     if (mapData) {
//       props?.onChange(mapData);
//     }
//   }, [mapData]);

//   const handleClose = () => {
//     setOpen(false);
//   };

//   const confirmLocation = () => {
//     Geocode.fromLatLng(location?.lat, location?.lng).then(
//       (response) => {
//         const address = response.results[0].formatted_address,
//           addressArray = response.results[0].address_components,
//           city = getCity(addressArray),
//           area = getArea(addressArray),
//           state = getState(addressArray),
//           district = getDistrict(addressArray),
//           subDistrict = getSubDistrict(addressArray),
//           pincode = getPincode(addressArray),
//           locality = getLocality(addressArray);

//         const newMyobj = {
//           locName: address,
//           latitude: location?.lat,
//           longitude: location?.lng,
//           city: city,
//           state: state,
//           pincode: pincode,
//           district: district,
//           subDistrict: subDistrict,
//           area: area,
//           locality: locality,
//         };
//         console.log('newMyobj', newMyobj);
//         setMapData(newMyobj);
//         setOpen(false);
//       },
//       (error) => {
//         // console.error(error);
//       },
//     );
//     // console.log('myobj', myobj);
//     // setMapData(myobj);
//     // setOpen(false);
//   };

//   return (
//     <>
//       <TextField
//         id={props.id}
//         label={props.label}
//         value={mapData?.locName || ''}
//         InputProps={{
//           endAdornment: (
//             <InputAdornment position='start'>
//               {props.disabled === 'disabled' ? (
//                 <AddLocationIcon onClick={() => setOpen(false)} />
//               ) : (
//                 <AddLocationIcon onClick={() => setOpen(true)} />
//               )}
//             </InputAdornment>
//           ),
//         }}
//         variant='outlined'
//         fullWidth
//         size={props.size}
//         error={props.error}
//         helperText={props.helperText}
//         required={true}
//         disabled={true}
//       />
//       <div
//         style={{
//           position: 'fixed',
//           top: 0,
//           left: 0,
//           width: '100%',
//           height: '100%',
//           background: 'rgb(0 0 0 / 60%)',
//           display: open ? 'block' : 'none',
//           zIndex: 1300,
//         }}
//         onClick={() => setOpen(false)}
//       ></div>
//       <Dialog
//         open={open}
//         onClose={() => {
//           setOpen(false);
//         }}
//         aria-labelledby='alert-dialog-title'
//         aria-describedby='alert-dialog-description'
//         maxWidth='false'
//         PaperProps={{
//           sx: {
//             width: '80%',
//             maxHeight: 500,
//           },
//         }}
//       >
//         {/* <DialogTitle id="alert-dialog-title">
//                     {"Confirm to Deactivate"}
//                     </DialogTitle> */}
//         <DialogContent style={{padding: '5px 5px'}}>
//           <Autocomplete
//             apiKey={GoogleMapsAPI}
//             style={{width: '100%', height: '30px'}}
//             onPlaceSelected={(place) => {
//               handleChangeLocation(
//                 place.geometry.location.lat(),
//                 place.geometry.location.lng(),
//               );
//               setLocation({
//                 lat: place.geometry.location.lat(),
//                 lng: place.geometry.location.lng(),
//               });
//               setZoom(12);
//             }}
//             options={{
//               types: ['establishment'],
//               componentRestrictions: {country: 'in'},
//             }}
//             placeholder='Search Location'
//             // defaultValue="New Delhi"
//           />
//           <MapPicker
//             defaultLocation={location}
//             zoom={zoom}
//             mapTypeId='roadmap'
//             style={{maxHeight: '424px'}}
//             onChangeLocation={handleChangeLocation}
//             onChangeZoom={handleChangeZoom}
//             apiKey={GoogleMapsAPI}
//           />
//           <DialogContentText
//             id='alert-dialog-description'
//             style={{textAlign: 'center', paddingTop: '2px'}}
//           >
//             <Button variant='contained' onClick={confirmLocation}>
//               Confirm Location
//             </Button>
//           </DialogContentText>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }

import {Input, TextField} from '@mui/material';
import {useEffect, useState} from 'react';
import usePlacesService from 'react-google-autocomplete/lib/usePlacesAutocompleteService';
import {GoogleMapsAPI} from './g-config';

const PlaceAutocomplete = ({onLocationChange}) => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const {
    placesService,
    placePredictions,
    getPlacePredictions,
    isPlacePredictionsLoading,
  } = usePlacesService({
    apiKey: GoogleMapsAPI,
    debounce: 1000,
    options: {
      types: ['establishment'],
      componentRestrictions: {country: 'in'},
    },
  });

  useEffect(() => {
    setIsDropdownOpen(placePredictions.length > 0);
  }, [placePredictions]);

  const savePlaceDetailsToState = (placeDetails) => {
    if (
      placeDetails &&
      placeDetails.geometry &&
      placeDetails.geometry.location
    ) {
      const lat = placeDetails.geometry.location.lat();
      const lng = placeDetails.geometry.location.lng();
      setSelectedPlace({...placeDetails, lat, lng});
      onLocationChange(lat, lng);
    } else {
      console.error('Invalid place details:', placeDetails);
    }
  };

  const handlePlacePredictionClick = (placePrediction) => {
    placesService?.getDetails(
      {
        placeId: placePrediction.place_id,
      },
      (placeDetails) => {
        savePlaceDetailsToState(placeDetails);
        setInputValue(placePrediction.description);
        setIsDropdownOpen(false);
      },
    );
  };

  const handleInputChange = (evt) => {
    setInputValue(evt.target.value);
    getPlacePredictions({input: evt.target.value});
  };

  return (
    <div style={{position: 'relative'}}>
      <TextField
        variant='outlined'
        placeholder='Search Location'
        value={inputValue}
        onChange={handleInputChange}
        loading={isPlacePredictionsLoading}
        style={{width: '100%'}}
        size="small"
      />
      {isDropdownOpen && (
        <ul
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            width: '100%',
            padding: 0,
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            listStyle: 'none',
            zIndex: 1,
          }}
        >
          {placePredictions.map((prediction) => {
            const typed = inputValue;
            const startIndex = prediction.description?.indexOf(typed);
            const endIndex = startIndex + typed.length;
            const beforeTyped = prediction?.description?.substring(
              0,
              startIndex,
            );
            const afterTyped = prediction?.description?.substring(endIndex);
            return (
              <li
                key={prediction.place_id}
                onClick={() => handlePlacePredictionClick(prediction)}
                style={{
                  padding: '8px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #ccc',
                }}
              >
                {beforeTyped}
                <strong>{typed}</strong>
                <span style={{fontSize: '1em'}}>{afterTyped}</span>
              </li>
            );
          })}
        </ul>
      )}
      {/* {selectedPlace && (
        <div>
          <p>Latitude: {selectedPlace.lat}</p>
          <p>Longitude: {selectedPlace.lng}</p>
        </div>
      )} */}
    </div>
  );
};

export default PlaceAutocomplete;
