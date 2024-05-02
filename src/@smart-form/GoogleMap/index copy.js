import React, {useState, useEffect} from 'react';
import Map from './Map';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import {NoEncryption} from '@mui/icons-material';
import zIndex from '@mui/material/styles/zIndex';
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
  const [open, setOpen] = useState(false);
  const [mapData, setMapData] = useState({
    address: props?.defaultValue?.address,
    city: '',
    area: '',
    state: '',
    mapPosition: {
        lat: props?.defaultValue?.lat,
        lng: props?.defaultValue?.lng
    },
    markerPosition: {
        lat: props?.defaultValue?.lat,
        lng: props?.defaultValue?.lng
    }
  });

  useEffect(() => {
    props?.onChange(mapData)
  }, [mapData])
  

  const handleClose = () => {
    setOpen(false);
  };

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
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '70%',
          bgcolor: '#00000000',
          display: open ? 'block' : 'none',
          zIndex: 1301,
        }}
      >
        <Map
          google={props.google}
          center={{lat: 28.6590525, lng: 77.4049277}}
          height='500px'
          zoom={15}
          onChange={setMapData}
        />
      </div>
    </div>
  );
}
