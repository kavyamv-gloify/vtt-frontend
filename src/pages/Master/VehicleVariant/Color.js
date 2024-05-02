import React, {useEffect, useState, useRef} from 'react';
import SmartTable from '@smart-table';
import SmartForm from '@smart-form';
import Avatar from '@mui/material/Avatar';
import AppTooltip from '@crema/core/AppTooltip';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import CustomLabel from 'pages/common/CustomLabel';
import _, {values} from 'lodash';
import {useAuthUser} from '@crema/utility/AuthHooks';
import Api from '@api';
import AddIcon from '@mui/icons-material/Add';
import VehicleVariant from './index';
import CloseIcon from '@mui/icons-material/Close';
import {Delete} from '@mui/icons-material';
import moment from 'moment';
import RestoreIcon from '@mui/icons-material/Restore';
import ColorizeIcon from '@mui/icons-material/Colorize';
import {SketchPicker} from 'react-color';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
  TextField,
  Box,
} from '@mui/material';
import {toast} from 'react-toastify';
const Color = () => {
  const [openDial, setOpenDial] = useState(false);
  const [flag, setFlag] = useState();
  const [data, setData] = useState();
  const [selectedData, setSelectedData] = useState();
  const [displayPicker, setDisplayPicker] = useState('');
  const ref = useRef(null);
  const [inputData, setInputData] = useState();
  const [vehicleColorName, setVehicleColorName] = useState();
  function getAllList() {
    axios
      .get(Api.baseUri + '/user-reg/vehicleTypeTheme-Service/getAll')
      .then((res) => {
        if (res?.data?.status == '200') {
          setData(res?.data?.data ?? []);
        }
      })
      .catch((err) => {
        setData([]);
      });
  }
  useEffect(() => {
    getAllList();
  }, []);
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
    if (selectedData?.id) {
      setInputData(selectedData?.vehicleColor);
      setVehicleColorName(selectedData?.vehicleColorName);
    }
    console.log('selectedData', selectedData);
  }, [selectedData]);
  const tableTemplate = {
    columns: [
      {
        title: 'Color',
        field: 'vehicleColor',
        render: (rd) => {
          return (
            <div style={{display: 'flex'}}>
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderColor: rd?.vehicleColor,
                  background: rd?.vehicleColor,
                }}
              ></div>
              <span style={{marginLeft: '10px'}}>{rd?.vehicleColor}</span>
            </div>
          );
        },
      },
      {
        title: 'Color Name',
        field: 'vehicleColorName',
      },

      {
        title: 'Created by',
        field: 'createdOn',
        type: 'datetime',
        render: (rd) => {
          return (
            moment(rd.createdOn).format('DD/MM/YYYY HH:mm')
          );
        },
      },

      {
        title: 'Last Updated',
        field: 'updatedOn',
        type: 'datetime',
        render: (rd) => {
          return (
            moment(rd.updatedOn).format('DD/MM/YYYY HH:mm')
          );
        },
      },
    ],
  };
  return (
    <div>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={3}>
          <CustomLabel labelVal='Vehicle Color' variantVal='h3-underline' />
        </Grid>
        <Grid item xs={9} sx={{paddingTop: '0px !important'}}>
          <Box display='flex' justifyContent='flex-end' alignItems='center'>
            <div className='left-seperator'>
              <AppTooltip placement={'top'} title={'Add Vehicle Color'}>
                <AddIcon
                  onClick={() => {
                    setOpenDial(true);
                    setFlag('ADDNEW');
                  }}
                />
              </AppTooltip>
            </div>
          </Box>
        </Grid>
      </Grid>
      <SmartTable
        components={{
          Toolbar: (props) => (
            <>
              <div
                style={{
                  height: '0px',
                }}
              ></div>
            </>
          ),
        }}
        title='Nodal Point List'
        columns={tableTemplate.columns}
        data={data ?? []}
        options={{
          search: false,
          showTitle: false,
          selection: false,

          sorting: true,
          actionsColumnIndex: -1,
          headerStyle: {position: 'sticky', top: 0},
          color: 'primary',
        }}
        actions={[
          {
            icon: () => (
              <EditIcon
                variant='contained'
                color='primary'
                size='small'
                fontSize='small'
              />
            ),
            tooltip: 'Edit',
            iconProps: {
              fontSize: 'small',
              color: 'primary',
              classes: 'filled',
            },
            onClick: (event, rowData) => {
              setOpenDial(true);
              setFlag('EDIT');
              console.log('rowData', rowData);
              setSelectedData(rowData);
            },
          },
        ]}
        localization={{
          body: {
            emptyDataSourceMessage: 'No records to display',
            filterRow: {
              filterTooltip: 'Filter',
              filterPlaceHolder: 'Filtaaer',
            },
          },
        }}
        style={{
          borderRadius: 16,
          boxShadow: '0px 10px 10px 4px rgb(0 0 0 / 4%)',
        }}
      />
      <Dialog
        open={openDial}
        style={{borderRadius: '4rem'}}
        PaperProps={{
          sx: {
            width: '400px',
          },
        }}
      >
        <div>
          <DialogContent style={{padding: '0px'}}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                background: '#f5f2f2',
                height: '4rem',
                paddingRight: '1.5rem',
                paddingLeft: '1.5rem',
                width: '400px',
                position: 'fixed',
                zIndex: '9',
                borderRadius: '5px 5px 0px 0px',
              }}
            >
              <h1 style={{marginTop: '1.5rem'}}>
                {flag == 'ADDNEW'
                  ? 'Add Vehicle Color'
                  : 'Update Vehicle Color'}
              </h1>
              <CloseIcon
                onClick={() => {
                  setOpenDial(false);
                  setSelectedData(null);
                  setVehicleColorName(null);
                  setVehicleColorName(null);
                }}
                style={{
                  marginTop: '1.4rem',
                  color: '#4f4f4f',
                  fontWeight: 'bold',
                }}
              />
            </div>
            <div
              style={{padding: '2rem', paddingTop: '0rem', marginTop: '100px'}}
            >
              <Grid item sm={12} xs={12} md={12}>
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
                    {'Vehicle Colour'}
                  </label>
                  <TextField
                    name={'bgColor'}
                    id='bgColor'
                    value={inputData}
                    onInput={(e) => {
                      setInputData(e?.target?.value);
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
                              background: inputData,
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
              <Grid item sm={12} xs={12} md={12}>
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
                    {'Vehicle Color Name'}
                  </label>
                  <TextField
                    name={'bgColor'}
                    id='bgColor'
                    value={vehicleColorName}
                    onInput={(e) => {
                      setVehicleColorName(e?.target?.value);
                    }}
                    fullWidth
                    size='small'
                  />
                </div>
              </Grid>
              <Grid
                md={12}
                sm={12}
                xs={12}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItem: 'center',
                  marginTop: '20px',
                }}
              >
                {flag == 'ADDNEW' && (
                  <Button
                    variant='contained'
                    type='submit'
                    onClick={() => {
                      let postData = {
                        vehicleColor: inputData,
                        vehicleColorName: vehicleColorName,
                      };
                      console.log('postData', postData);

                      axios
                        .post(
                          Api.baseUri +
                            '/user-reg/vehicleTypeTheme-Service/save-vehicleTypeTheme',
                          postData,
                        )
                        .then((res) => {
                          if (res?.data?.status == '200') {
                            toast.success('Color code submitted successfully');
                            setOpenDial(false);
                            getAllList();
                          } else {
                            toast.error('Something Went wrong');
                          }
                        })
                        .catch((err) => {
                          toast.error('Something Went wrong' ?? err);
                          setOpenDial(false);
                        });
                    }}
                  >
                    Submit
                  </Button>
                )}
                {flag == 'EDIT' && (
                  <Button
                    variant='contained'
                    type='submit'
                    onClick={() => {
                      let postData = {
                        vehicleColor: inputData,
                        vehicleColorName: vehicleColorName,
                        id: selectedData?.id,
                      };
                      console.log('postData', postData);

                      axios
                        .put(
                          Api.baseUri +
                            '/user-reg/vehicleTypeTheme-Service/update-vehicleTypeTheme',
                          postData,
                        )
                        .then((res) => {
                          if (res?.data?.status == '200') {
                            toast.success('Color code updated successfully');
                            setOpenDial(false);
                            getAllList();
                            setSelectedData(null);
                            setVehicleColorName(null);
                            setVehicleColorName(null);
                          } else {
                            toast.error('Something Went wrong');
                          }
                        })
                        .catch((err) => {
                          toast.error('Something Went wrong' ?? err);
                          setOpenDial(false);
                        });
                    }}
                  >
                    Update
                  </Button>
                )}
              </Grid>
              {displayPicker && (
                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    marginTop: displayPicker == 'bgColor' ? '-65px' : '0px',
                    justifyContent:
                      displayPicker == 'fontColor' ||
                      displayPicker == 'hoverColor'
                        ? 'end'
                        : 'start',
                  }}
                >
                  <div ref={ref}>
                    <SketchPicker
                      color={inputData}
                      onChange={(color) => {
                        console.log('color', color);
                        setInputData(color?.hex);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </div>
  );
};

export default Color;
