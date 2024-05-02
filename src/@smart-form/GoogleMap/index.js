import React, {useState, useEffect} from 'react';
import Map from './Map';
import keys from '@common/keys';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import {NoEncryption} from '@mui/icons-material';
import zIndex from '@mui/material/styles/zIndex';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

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
  const styleMap = {
    minWidth: '98%',
    minHeight: '400px',
    display: 'inline-block',
  };
  var mapObject, picker;
  const [open, setOpen] = useState(false);
  let myobj = {
    address: props?.defaultValue?.address,
    city: '',
    area: '',
    state: '',
    mapPosition: {
      lat: props?.defaultValue?.mapPosition?.lat,
      lng: props?.defaultValue?.mapPosition?.lng,
    },
    markerPosition: {
      lat: props?.defaultValue?.mapPosition?.lat,
      lng: props?.defaultValue?.mapPosition?.lng,
    },
  };
  const [mapData, setMapData] = useState({
    address: props?.defaultValue?.address,
    city: '',
    area: '',
    state: '',
    mapPosition: {
      lat: props?.defaultValue?.mapPosition?.lat,
      lng: props?.defaultValue?.mapPosition?.lng,
    },
    markerPosition: {
      lat: props?.defaultValue?.mapPosition?.lat,
      lng: props?.defaultValue?.mapPosition?.lng,
    },
  });

  useEffect(() => {
    props?.onChange(mapData);
  }, [mapData]);

  const handleClose = () => {
    setOpen(false);
  };

  initialize(keys.ACCESS_TOKEN.toString(), () => {
    //Action after script has been loaded completely

    afterScriptsLoaded();
  });

  const confirmLocation = () => {
    setMapData(myobj);
    setOpen(false);
  };

  function afterScriptsLoaded() {
    mapObject = window.mappls.Map('map', {
      center: [
        props?.defaultValue?.mapPosition?.lat
          ? props?.defaultValue?.mapPosition?.lat
          : 28.62,
        props?.defaultValue?.mapPosition?.lng
          ? props?.defaultValue?.mapPosition?.lng
          : 77.09,
      ],
      topText: 'Set Location',
      closeBtn: false,
      zoom: 8,
    });
    // document.getElementById("mmiPickerBot").style.display = "none";
    mapObject.addListener('load', function () {
      /*Place Picker plugin initialization*/
      var options = {
        map: mapObject,
        header: true,
        topText: 'Set Location',
        closeBtn: false,
      };
      new window.mappls.placePicker(options, function (data) {
        picker = data;
        var pdata = picker.getLocation();
        myobj = {
          address: pdata.data.formatted_address.toString(),
          city: pdata.data.city.toString(),
          area: pdata.data.area.toString(),
          state: pdata.data.state.toString(),
          mapPosition: {
            lat: pdata.data.lat.toString(),
            lng: pdata.data.lng.toString(),
          },
          markerPosition: {
            lat: pdata.data.lat.toString(),
            lng: pdata.data.lng.toString(),
          },
        };
      });
    });

    mapObject.addListener('move', function () {
      var options = {
        map: mapObject,
        header: true,
        topText: 'Set Location',
        closeBtn: false,
      };
      new window.mappls.placePicker(options, function (data) {
        picker = data;
        var pdata = picker.getLocation();
        myobj = {
          address: pdata.data.formatted_address.toString(),
          city: pdata.data.city.toString(),
          area: pdata.data.area.toString(),
          state: pdata.data.state.toString(),
          mapPosition: {
            lat: pdata.data.lat.toString(),
            lng: pdata.data.lng.toString(),
          },
          markerPosition: {
            lat: pdata.data.lat.toString(),
            lng: pdata.data.lng.toString(),
          },
        };
      });
    });
  }

  return (
    <div>
      <TextField
        id={props.id}
        label={props.label}
        value={mapData?.address}
        InputProps={{
          endAdornment: (
            <InputAdornment position='start'>
              <AddLocationIcon onClick={() => setOpen(true)} />
            </InputAdornment>
          ),
        }}
        variant='outlined'
        fullWidth
        size={props.size}
        error={props.error}
        helperText={props.helperText}
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
          <DialogContentText
            id='alert-dialog-description'
            style={{textAlign: 'center'}}
          >
            <Button
              id='btnMui123'
              variant='contained'
              onClick={confirmLocation}
            >
              Confirm Location
            </Button>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function initialize(mmiToken, loadCallback) {
  try {
    if (mmiToken) {
      let count = 0;

      //Insert your script seperated by comma like scriptArr = [mapSDK_url, plugins_url];
      let mapSDK_url =
        'https://apis.mappls.com/advancedmaps/api/' +
        mmiToken +
        '/map_sdk?layer=vector&v=3.0';
      let plugins_url =
        'https://apis.mappls.com/advancedmaps/api/' +
        mmiToken +
        '/map_sdk_plugins?v=3.0';

      var scriptArr = [mapSDK_url, plugins_url];

      const recursivelyAddScript = (script) => {
        if (count < script.length) {
          const el = document.createElement('script');
          el.src = script[count];
          el.async = true;
          el.type = 'text/javascript';
          document.getElementsByTagName('head')[0].appendChild(el);
          count = count + 1;
          el.onload = function () {
            recursivelyAddScript(script);
          };
        } else {
          return loadCallback();
        }
      };
      recursivelyAddScript(scriptArr);
    }
  } catch (e) {
    console.error(String(e));
  }
}
