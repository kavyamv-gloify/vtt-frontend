import React, { useState, useEffect } from 'react';
import Map from './Map';
import keys from '@common/keys';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { NoEncryption } from '@mui/icons-material';
import zIndex from '@mui/material/styles/zIndex';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Api from '@api'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '70%',
  bgcolor: '#00000000',
  // border: '2px solid #000',
  // boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
  display: 'none',
};
export default function index(props) {
   
  const  styleMap  = {minWidth:  '98%', minHeight: '400px', display:'inline-block'}
  var mapObject, picker;	
  const [open, setOpen] = useState(false);
  let myobj = {
    locName: props?.defaultValue?.locName,
    latitude: props?.defaultValue?.latitude,
    longitude: props?.defaultValue?.longitude,
    city: props?.defaultValue?.city,
    state: props?.defaultValue?.state,
    pincode: props?.defaultValue?.pincode,
    district: props?.defaultValue?.district,
    subDistrict: props?.defaultValue?.subDistrict,
    area: props?.defaultValue?.area,
  }
  // const [mapData, setMapData] = useState({
  //   locName: props?.defaultValue?.locName,
  //   latitude: props?.defaultValue?.latitude,
  //   longitude: props?.defaultValue?.longitude,
  //   city: props?.defaultValue?.city,
  //   state: props?.defaultValue?.state,
  //   pincode: props?.defaultValue?.pincode,
  //   district: props?.defaultValue?.district,
  //   subDistrict: props?.defaultValue?.subDistrict,
  //   area: props?.defaultValue?.area,
  // });

  const [mapData, setMapData] = useState(null);

  useEffect(() => {
    if(props?.defaultValue?.longitude){
      setMapData({
        locName: props?.defaultValue?.locName,
        latitude: props?.defaultValue?.latitude,
        longitude: props?.defaultValue?.longitude,
        city: props?.defaultValue?.city,
        state: props?.defaultValue?.state,
        pincode: props?.defaultValue?.pincode,
        district: props?.defaultValue?.district,
        subDistrict: props?.defaultValue?.subDistrict,
        area: props?.defaultValue?.area,
      })
    }
  }, [])
  
  useEffect(() => {
    if(mapData){
      props?.onChange(mapData)
    }
  }, [mapData])


  const handleClose = () => {
    setOpen(false);
  };
  let access_token = localStorage.getItem('mappl_access_token');
  // let access_token = keys.ACCESS_TOKEN.toString();
   
  initialize(access_token, () => {
    //Action after script has been loaded completely
     
    afterScriptsLoaded();
  });

  const confirmLocation = () => {
     
    setMapData(myobj);
    setOpen(false);
  }

  function afterScriptsLoaded() {
     
    mapObject = window.mappls.Map('map', {
      center: [
        props?.defaultValue?.latitude ? props?.defaultValue?.latitude : 28.62000000,
        props?.defaultValue?.longitude ? props?.defaultValue?.longitude : 77.09000000
      ],
      topText:'Set Location',
      closeBtn:false,
      zoom: 8,
    });
    // document.getElementById("mmiPickerBot").style.display = "none";
    mapObject.addListener('load', function () {
      /*Place Picker plugin initialization*/
      var options = {
        map: mapObject,
        header: true,
        topText:'Set Location',
        closeBtn: false,
      };
      new window.mappls.placePicker(options, function (data) {
        picker = data;
        var pdata = picker.getLocation();
        if(props?.distribute && props?.distribute?.length>0){
          myobj = {
            locName: pdata.data.formatted_address.toString(),
            latitude: pdata.data.lat.toString(),
            longitude: pdata.data.lng.toString(),
            area: pdata.data.area.toString(),
            city: pdata.data.city.toString(),
            district: pdata.data.district.toString(),
            state: pdata.data.state.toString(),
            subDistrict: pdata.data.subDistrict.toString(),
            pincode: pdata.data.pincode.toString(),
          }
        } else {
          myobj = {
            locName: pdata.data.formatted_address.toString(),
            latitude: pdata.data.lat.toString(),
            longitude: pdata.data.lng.toString()
          }
        }
         
      });
    });
    
    mapObject.addListener('move', function () {
      var options = {
        map: mapObject,
        header: true,
        topText:'Set Location',
        closeBtn: false,
      };
      new window.mappls.placePicker(options, function (data) {
        picker = data;
        var pdata = picker.getLocation();
        if(props?.distribute && props?.distribute?.length>0){
          myobj = {
            locName: pdata.data.formatted_address.toString(),
            latitude: pdata.data.lat.toString(),
            longitude: pdata.data.lng.toString(),
            area: pdata.data.area.toString(),
            city: pdata.data.city.toString(),
            district: pdata.data.district.toString(),
            state: pdata.data.state.toString(),
            subDistrict: pdata.data.subDistrict.toString(),
            pincode: pdata.data.pincode.toString(),
          }
        } else {
          myobj = {
            locName: pdata.data.formatted_address.toString(),
            latitude: pdata.data.lat.toString(),
            longitude: pdata.data.lng.toString()
          }
        }
         
      });
    });
    
  }

  return (
    <>
      <TextField
    
        id={props.id}
        label={props.label}
        value={mapData?.locName || ''}
        InputProps={{
          endAdornment: (
            <InputAdornment position='start'>
              {props.disabled === 'disabled' ? <AddLocationIcon onClick={()=> setOpen(false)} />
              : <AddLocationIcon onClick={() => setOpen(true)} />
              }
              
            </InputAdornment>
          ),
        }}
        variant='outlined'
        fullWidth
        size={props.size}
        error={props.error}
        helperText={props.helperText}
        required={true}
        disabled={true}
      />
        <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgb(0 0 0 / 60%)',
          display: open ? 'block' : 'none',
          zIndex: 1300,
        }}
        onClick={() => setOpen(false)}
      ></div>
        <Dialog
          open={open}
          onClose={() => {
            setOpen(false);
          }}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
          maxWidth='false'
          PaperProps={{
            sx: {
              width: '80%',
              maxHeight: 500,
            },
          }}
        >
          {/* <DialogTitle id="alert-dialog-title">
                    {"Confirm to Deactivate"}
                    </DialogTitle> */}
          <DialogContent style={{padding: '5px 5px'}}>
            <div id='map' style={styleMap}></div>
            <DialogContentText id="alert-dialog-description" style={{textAlign:"center"}}>
              <Button id='btnMui123' variant="contained" onClick={confirmLocation}>Confirm Location</Button>
            </DialogContentText>
          </DialogContent>
        </Dialog>
    </>
  );
}


function initialize(mmiToken, loadCallback) {
  try {
      if (mmiToken) {
          let count = 0;
          //Insert your script seperated by comma like scriptArr = [mapSDK_url, plugins_url];
          // checking map key is working or not
          fetch('https://apis.mappls.com/advancedmaps/api/' + mmiToken + '/map_sdk?layer=vector&v=3.0', {
              method: 'GET',
          }).then(response => {
             
              if(response?.status && response?.status != 200){
                // map key is not working and have to rtegenerate
                  fetch(Api.baseUri+"/userauth/app/mapkey/generate" , {
                      method: 'GET',
                  }).then(response => response.json())
                  .then(response => {
                      if(response?.status != 200){
                          // map key not generated
                          toast.error("Something went wrong with map key. Please contact to system administrator.")
                      } else {
                          // new map key generated
                          localStorage.setItem('mappl_access_token', response?.data);
                          let mapSDK_url = 'https://apis.mappls.com/advancedmaps/api/' + response?.data + '/map_sdk?layer=vector&v=3.0';
                          let plugins_url = 'https://apis.mappls.com/advancedmaps/api/' + response?.data + '/map_sdk_plugins?v=3.0';
                          var scriptArr = [mapSDK_url, plugins_url];
                          const recursivelyAddScript = (script) => {
                              if (count < script.length) {
                                  const el = document.createElement('script')
                                  el.src = script[count]
                                  el.async = true;
                                  el.type = 'text/javascript';
                                  document.getElementsByTagName('head')[0].appendChild(el);
                                  count = count + 1;
                                  el.onload = function () { recursivelyAddScript(script) }
                              } else {
                                  return loadCallback();
                              }
                          }
                          recursivelyAddScript(scriptArr);
                      }
                  
                  })
              } else {
                  // mapp key is working
                  let mapSDK_url = 'https://apis.mappls.com/advancedmaps/api/' + mmiToken + '/map_sdk?layer=vector&v=3.0';
                  let plugins_url = 'https://apis.mappls.com/advancedmaps/api/' + mmiToken + '/map_sdk_plugins?v=3.0';
                  var scriptArr = [mapSDK_url, plugins_url];
                  const recursivelyAddScript = (script) => {
                      if (count < script.length) {
                          const el = document.createElement('script')
                          el.src = script[count]
                          el.async = true;
                          el.type = 'text/javascript';
                          document.getElementsByTagName('head')[0].appendChild(el);
                          count = count + 1;
                          el.onload = function () { recursivelyAddScript(script) }
                      } else {
                          return loadCallback();
                      }
                  }
                  recursivelyAddScript(scriptArr);
              }
          })

          
      }
      else  ")
  }
  catch (e) {
      console.error(String(e));
  }
}

// function initialize(mmiToken, loadCallback) {
//   try {
//     if (mmiToken) {
//       let count = 0;

//       //Insert your script seperated by comma like scriptArr = [mapSDK_url, plugins_url];
//       let mapSDK_url =
//         'https://apis.mappls.com/advancedmaps/api/' +
//         mmiToken +
//         '/map_sdk?layer=vector&v=3.0';
//       let plugins_url =
//         'https://apis.mappls.com/advancedmaps/api/' +
//         mmiToken +
//         '/map_sdk_plugins?v=3.0';

//       var scriptArr = [mapSDK_url, plugins_url];

//       const recursivelyAddScript = (script) => {
//         if (count < script.length) {
//           const el = document.createElement('script');
//           el.src = script[count];
//           el.async = true;
//           el.type = 'text/javascript';
//           document.getElementsByTagName('head')[0].appendChild(el);
//           count = count + 1;
//           el.onload = function () {
//             recursivelyAddScript(script);
//           };
//         } else {
//           return loadCallback();
//         }
//       };
//       recursivelyAddScript(scriptArr);
//     } else  ');
//   } catch (e) {
//     console.error(String(e));
//   }
// }