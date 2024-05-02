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

const CustomTheme = ({setOpenDial, selData, themeData}) => {
  console.log('themeData', themeData);
  const [inputData, setInputData] = useState();
  const [displayPicker, setDisplayPicker] = useState('');
  const ref = useRef(null);
  useEffect(() => {
    setInputData({
      id: themeData.id || null,
      bgColor: themeData.bgColor || '',
      fontColor: themeData.fontColor || '',
      btnColor: themeData.btnColor || '',
      hoverColor: themeData.hoverColor || '',
      themeName: themeData.themeName || '',
    });
  }, [themeData]);
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
  return (
    <div>
      <Dialog
        onClose={() => {
          setOpenDial(false);
        }}
        open={true}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '500px',
          },
        }}
        style={{borderRadius: '4rem'}}
      >
        <DialogTitle style={{background: '#f5f2f2'}}>
          <h1>{selData == 'ADDNEW' ? 'Add New' : 'Update'} Theme</h1>
          <CloseIcon
            onClick={() => {
              setOpenDial(false);
            }}
            style={{
              top: '14px',
              cursor: 'pointer',
              position: 'absolute',
              right: '12px',
            }}
          />
        </DialogTitle>
        <DialogContent>
          <div>
            <Grid container spacing={2} sx={{mb: 4}}>
              <Grid
                item
                sm={12}
                xs={12}
                md={12}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    background: inputData?.bgColor,
                    border: '1px solid #f4f2f2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '20px',
                    height: '150px',
                    width: '300px',
                    borderRadius: '15px',
                  }}
                >
                  <img
                    src='assets/images/tempss.png'
                    style={{
                      height: 'calc(100% - 30px)',
                      width: 'calc(100% - 30px)',
                    }}
                  />
                </div>
              </Grid>
            </Grid>
            <Grid
              container
              spacing={2}
              sx={{
                mt: 4,
                border: '1px solid #f4f2f2',
                borderRadius: '10px',
                padding: '15px',
              }}
            >
              <Grid item sm={12} xs={12} md={12}>
                <div style={{width: '100%'}}>
                  <label
                    htmlFor={'themeName'}
                    style={{
                      width: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: 'inline-block',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {'Theme Name'}
                  </label>
                  <TextField
                    name={'themeName'}
                    id='themeName'
                    value={inputData?.themeName}
                    onInput={(e) => {
                      setInputData({...inputData, themeName: e.target.value});
                    }}
                    fullWidth
                    size='small'
                  />
                </div>
              </Grid>
              <Grid item sm={6} xs={6} md={6}>
                <div style={{width: '100%'}}>
                  <label
                    htmlFor={'bgColor'}
                    style={{
                      width: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: 'inline-block',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {'Background Colour'}
                  </label>
                  <TextField
                    name={'bgColor'}
                    id='bgColor'
                    value={inputData?.bgColor}
                    onInput={(e) => {
                      setInputData({...inputData, bgColor: e.target.value});
                    }}
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
                              background: inputData?.bgColor,
                              height: '12px',
                              width: '12px',
                            }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                    size='small'
                  />
                </div>
              </Grid>
              <Grid item sm={6} xs={6} md={6}>
                <div style={{width: '100%'}}>
                  <label
                    htmlFor={'fontColor'}
                    style={{
                      width: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: 'inline-block',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {'Font Colour Default'}
                  </label>
                  <TextField
                    name={'fontColor'}
                    id='fontColor'
                    value={inputData?.fontColor}
                    onInput={(e) => {
                      setInputData({...inputData, fontColor: e.target.value});
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <ColorizeIcon
                            onClick={() => {
                              setTimeout(() => {
                                setDisplayPicker('fontColor');
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
                              background: inputData?.fontColor,
                              height: '12px',
                              width: '12px',
                            }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                    size='small'
                  />
                </div>
              </Grid>
              <Grid item sm={6} xs={6} md={6}>
                <div style={{width: '100%'}}>
                  <label
                    htmlFor={'btnColor'}
                    style={{
                      width: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: 'inline-block',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {'Button Colour'}
                  </label>
                  <TextField
                    name={'btnColor'}
                    id='btnColor'
                    value={inputData?.btnColor}
                    onInput={(e) => {
                      setInputData({...inputData, btnColor: e.target.value});
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <ColorizeIcon
                            onClick={() => {
                              setTimeout(() => {
                                setDisplayPicker('btnColor');
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
                              background: inputData?.btnColor,
                              height: '12px',
                              width: '12px',
                            }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                    size='small'
                  />
                </div>
              </Grid>
              <Grid item sm={6} xs={6} md={6}>
                <div style={{width: '100%'}}>
                  <label
                    htmlFor={'hoverColor'}
                    style={{
                      width: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: 'inline-block',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {'Font Colour After Hover'}
                  </label>
                  <TextField
                    name={'hoverColor'}
                    id='hoverColor'
                    value={inputData?.hoverColor}
                    onInput={(e) => {
                      setInputData({...inputData, hoverColor: e.target.value});
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <ColorizeIcon
                            onClick={() => {
                              setTimeout(() => {
                                setDisplayPicker('hoverColor');
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
                              background: inputData?.hoverColor,
                              height: '12px',
                              width: '12px',
                            }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                    size='small'
                  />
                </div>
              </Grid>
              {displayPicker && (
                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    marginTop:
                      displayPicker == 'bgColor' || displayPicker == 'fontColor'
                        ? '-65px'
                        : '0px',
                    justifyContent:
                      displayPicker == 'fontColor' ||
                      displayPicker == 'hoverColor'
                        ? 'end'
                        : 'start',
                  }}
                >
                  <div ref={ref}>
                    <SketchPicker
                      color={inputData[displayPicker]}
                      onChange={(color) => {
                        setInputData({
                          ...inputData,
                          [displayPicker]: color?.hex,
                        });
                      }}
                    />
                  </div>
                </div>
              )}
              <Grid
                item
                sx={{textAlign: 'center', mt: 2}}
                sm={12}
                xs={12}
                md={12}
              >
                <Button
                  id='btnMui123'
                  variant='contained'
                  onClick={() => {
                    if (
                      inputData?.themeName &&
                      inputData?.bgColor &&
                      inputData?.hoverColor &&
                      inputData?.btnColor &&
                      inputData?.fontColor
                    ) {
                      if (selData == 'ADDNEW') {
                        let postData = {
                          bgColor: inputData?.bgColor,
                          fontColor: inputData?.fontColor,
                          btnColor: inputData?.btnColor,
                          hoverColor: inputData?.hoverColor,
                          themeName: inputData?.themeName,
                          status: 'ACTIVE',
                        };
                        axios
                          .post(
                            Api.baseUri + '/user-reg/theme-Service/save-theme',
                            postData,
                          )
                          .then((res) => {
                            if (res?.data?.status == '200') {
                              toast.success(
                                res?.data?.message ||
                                  'Theme setted successfully.',
                              );
                              setOpenDial(null);
                            } else {
                              toast.error(
                                res?.data?.message || 'Something went wrong.',
                              );
                            }
                          })
                          .catch((err) => {
                            toast.error('Something went wrong.');
                          });
                      } else {
                        let postData = {
                          bgColor: inputData?.bgColor,
                          id: inputData?.id,
                          fontColor: inputData?.fontColor,
                          btnColor: inputData?.btnColor,
                          hoverColor: inputData?.hoverColor,
                          themeName: inputData?.themeName,
                          status: 'ACTIVE',
                        };

                        axios
                          .put(
                            Api.baseUri +
                              '/user-reg/theme-Service/update-theme',
                            postData,
                          )
                          .then((res) => {
                            if (res?.data?.status == '200') {
                              toast.success(
                                res?.data?.message ||
                                  'Theme updated successfully.',
                              );
                              setOpenDial(null);
                            } else {
                              toast.error(
                                res?.data?.message || 'Something went wrong.',
                              );
                            }
                          })
                          .catch((err) => {
                            toast.error('Something went wrong.');
                          });
                      }
                    }
                  }}
                >
                  {selData == 'ADDNEW' ? 'Save' : 'Update'}
                </Button>
              </Grid>
            </Grid>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomTheme;
