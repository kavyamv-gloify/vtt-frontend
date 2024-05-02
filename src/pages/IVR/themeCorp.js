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
import AppTooltip from '@crema/core/AppTooltip';
const CustomTheme = ({setOpenDial}) => {
  const [selData, setSelData] = useState(0);
  const myData = [
    {
      name: 'Default',
      id: '0',
      bgColor: '#11234e',
      fontColor: '#098fdc',
      btnColor: '#098fdc',
    },
    {
      name: 'My Theme Name 2',
      id: '1',
      bgColor: 'green',
      fontColor: 'white',
      btnColor: '#098fdc',
    },
    {
      name: 'My Theme Name 3',
      id: '2',
      bgColor: 'yellow',
      fontColor: 'white',
      btnColor: '#098fdc',
    },
    {
      name: 'My Theme Name 4',
      id: '3',
      bgColor: 'grey',
      fontColor: 'white',
      btnColor: '#098fdc',
    },
    {
      name: 'My Theme Name 5',
      id: '4',
      bgColor: 'black',
      fontColor: 'white',
      btnColor: '#098fdc',
    },
    {
      name: 'My Theme Name 6',
      id: '5',
      bgColor: 'white',
      fontColor: 'black',
      btnColor: '#098fdc',
    },
    {
      name: 'My Theme Name 7',
      id: '6',
      bgColor: 'red',
      fontColor: 'white',
      btnColor: '#098fdc',
    },
    {
      name: 'My Theme Name 8',
      id: '7',
      bgColor: 'Green',
      fontColor: 'white',
      btnColor: '#098fdc',
    },
    {
      name: 'My Theme Name 9',
      id: '8',
      bgColor: 'blue',
      fontColor: 'black',
      btnColor: 'white',
    },
  ];
  useEffect(() => {
    if (selData == 'CUSTOM') {
      setInputData({name: '', bgColor: '', fontColor: '', btnColor: ''});
      return;
    }
    setInputData({...myData[selData]});
  }, [selData]);
  const [inputData, setInputData] = useState({});
  const [color, setColor] = useState('#fd0606');
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
          <h1>Theme Setting </h1>
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
                    background: inputData.bgColor,
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
                border: '1px solid #f4f2f2',
                borderRadius: '10px',
                padding: '15px',
                paddingRight: '23px',
              }}
            >
              {myData?.map((el, ind) => {
                return (
                  <AppTooltip title={'shreya'} placement={'top'}>
                    <Grid item sm={3} xs={3} md={2}>
                      {/* <AppTooltip title={'shreya'} placement={'top'}> */}
                      <div
                        onClick={() => {
                          setSelData(ind);
                        }}
                        style={{
                          width: '100%',
                          border:
                            selData == ind
                              ? '3px solid #098fdc'
                              : '1px solid grey',
                          aspectRatio: '1 / 1',
                          borderRadius: '50%',

                          background: `linear-gradient( 180deg, ${el.bgColor} 50%, ${el.fontColor} 50% )`,
                          cursor: 'pointer',
                        }}
                      ></div>
                      {/* </AppTooltip> */}
                    </Grid>
                  </AppTooltip>
                );
              })}

              <Grid item sm={3} xs={3} md={2}>
                <div
                  onClick={() => {
                    setSelData('CUSTOM');
                  }}
                  style={{
                    width: '100%',
                    border:
                      selData == 'CUSTOM'
                        ? '3px solid #098fdc'
                        : '1px solid grey',
                    aspectRatio: '1 / 1',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#cacaca',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{textAlign: 'center'}}>
                    <div style={{fontSize: '25px'}}>+</div>
                    <div style={{fontSize: '11px', marginTop: '-5px'}}>
                      Custom
                    </div>
                  </div>
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
              <Grid item sx={{mb: 3}} sm={12} xs={12} md={12}>
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
                    disabled={inputData?.name && selData !== 'CUSTOM'}
                    value={inputData?.name}
                    onInput={(e) => {
                      setInputData({...inputData, name: e.target.value});
                    }}
                    fullWidth
                    size='small'
                  />
                </div>
              </Grid>
              <Grid item sx={{mb: 3}} sm={6} xs={6} md={6}>
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
                    disabled={inputData?.bgColor && selData !== 'CUSTOM'}
                    onInput={(e) => {
                      setInputData({...inputData, bgColor: e.target.value});
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <ColorizeIcon
                            onClick={() => {
                              setTimeout(() => {
                                if (inputData?.bgColor && selData !== 'CUSTOM')
                                  return;
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
              <Grid item sx={{mb: 3}} sm={6} xs={6} md={6}>
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
                    {'Font Colour'}
                  </label>
                  <TextField
                    name={'fontColor'}
                    id='fontColor'
                    value={inputData?.fontColor}
                    disabled={inputData?.fontColor && selData !== 'CUSTOM'}
                    onInput={(e) => {
                      setInputData({...inputData, fontColor: e.target.value});
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <ColorizeIcon
                            onClick={() => {
                              setTimeout(() => {
                                if (
                                  inputData?.fontColor &&
                                  selData !== 'CUSTOM'
                                )
                                  return;
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
              {displayPicker && (
                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent:
                      // displayPicker == 'btnColor'
                      //   ? 'end'
                      //   :
                      displayPicker == 'fontColor' ? 'end' : 'start',
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
                sx={{mb: 3, textAlign: 'center'}}
                sm={12}
                xs={12}
                md={12}
              >
                <Button id='btnMui123' variant='contained'>
                  Save
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
