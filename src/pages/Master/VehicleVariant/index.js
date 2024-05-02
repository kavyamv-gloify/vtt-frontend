import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
  TextField,
} from '@mui/material';
import React, {useEffect, useRef, useState} from 'react';
import CloseIcon from '@mui/icons-material/Close';
import ColorizeIcon from '@mui/icons-material/Colorize';
import {SketchPicker} from 'react-color';
import axios from 'axios';
import Api from '@api';
import {toast} from 'react-toastify';
import {selectedGridRowsCountSelector} from '@mui/x-data-grid';

const VehicleVariant = ({close, data, flag}) => {
  const [inputData, setInputData] = useState();
  const [displayPicker, setDisplayPicker] = useState('');

  const ref = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setDisplayPicker('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
  useEffect(() => {
    setInputData(data);
  }, [data]);
  const handleChange = (e) => {
    setTimeout(() => {
      setInputData({...inputData, vehicleColor: e?.hex});
    }, 200);
  };

  const handleSubmit = () => {
    console.log('inputData', inputData);
    if (flag == 'ADDNEW') {
      axios
        .post(
          Api.baseUri +
            '/user-reg/vehicleTypeTheme-Service/save-vehicleTypeTheme',
          inputData,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success('Vehicle Type Submitted Successfully');
            close();
          }
        })
        .catch((err) => {});
    }
    if (flag == 'EDIT') {
      let postData = inputData;
      postData.id = data.id;
      axios
        .put(
          Api.baseUri +
            '/user-reg/vehicleTypeTheme-Service/update-vehicleTypeTheme',
          postData,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success('Vehicle Type Submitted Successfully');
            close();
          }
        })
        .catch((err) => {});
    }
  };

  return (
    <div>
      <Grid container spacing={2}>
        <Grid
          md={6}
          sx={{
            marginBottom: '10px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div style={{width: '100%'}}>
            <label
              htmlFor={'variant'}
              style={{
                width: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: 'inline-block',
                whiteSpace: 'nowrap',
              }}
            >
              {'Variant '}
            </label>
            <TextField
              name={'vehicleVeriant'}
              id='vehicleVeriant'
              value={inputData?.vehicleVeriant}
              onInput={(e) => {
                setInputData({...inputData, vehicleVeriant: e.target.value});
              }}
              sx={{width: '300px'}}
              size='small'
            />
          </div>
        </Grid>
        <Grid
          md={6}
          sx={{
            marginBottom: '10px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div style={{width: '100%'}}>
            <label
              htmlFor={'brand'}
              style={{
                width: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: 'inline-block',
                whiteSpace: 'nowrap',
              }}
            >
              {'Brand'}
            </label>
            <TextField
              name={'vehicleBrand'}
              id='vehicleBrand'
              value={inputData?.vehicleBrand}
              onInput={(e) => {
                setInputData({...inputData, vehicleBrand: e.target.value});
              }}
              sx={{width: '300px'}}
              size='small'
            />
          </div>
        </Grid>
        <Grid md={6} sx={{marginBottom: '10px'}}>
          <div style={{width: '100%'}}>
            <label
              htmlFor={'vehicleModel'}
              style={{
                width: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: 'inline-block',
                whiteSpace: 'nowrap',
              }}
            >
              {'Model'}
            </label>
            <TextField
              name={'vehicleModel'}
              id='vehicleModel'
              value={inputData?.vehicleModel}
              onInput={(e) => {
                setInputData({...inputData, vehicleModel: e.target.value});
              }}
              sx={{width: '300px'}}
              size='small'
            />
          </div>
        </Grid>

        <Grid md={6} sx={{marginBottom: '10px'}}>
          <div style={{width: '100%'}}>
            <label
              htmlFor={'vehicleColor'}
              style={{
                width: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: 'inline-block',
                whiteSpace: 'nowrap',
              }}
            >
              {'Color'}
            </label>
            <TextField
              name={'vehicleColor'}
              id='vehicleColor'
              value={inputData?.vehicleColor}
              onInput={(e) => {
                setInputData({...inputData, vehicleColor: e.target.value});
              }}
              sx={{width: '300px'}}
              size='small'
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <ColorizeIcon
                      onClick={() => {
                        setTimeout(() => {
                          setDisplayPicker('bgColor');
                        }, 200);
                      }}
                      style={{
                        fontSize: '16px',
                        cursor: 'pointer',
                      }}
                    />
                  </InputAdornment>
                ),
                startAdornment: (
                  <InputAdornment position='start'>
                    <div
                      style={{
                        border: '1px solid #5a5a5b',
                        background: inputData?.vehicleColor,
                        height: '12px',
                        width: '12px',
                      }}
                    />
                  </InputAdornment>
                ),
              }}
            />
            {displayPicker && (
              <div ref={ref} style={{width: '200px'}}>
                <SketchPicker
                  color={inputData?.vehicleColor || ''}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                />
              </div>
            )}
          </div>
        </Grid>

        <Grid md={12} sx={{marginTop: '10px'}}>
          <div style={{width: '20%', margin: 'auto'}}>
            <Button
              variant='contained'
              type='submit'
              onClick={() => {
                handleSubmit();
              }}
            >
              {flag == 'ADDNEW' ? 'Submit' : 'Update'}
            </Button>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default VehicleVariant;
