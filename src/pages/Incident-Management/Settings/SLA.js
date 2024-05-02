import React, {useState, useEffect} from 'react';
import CustomLabel from 'pages/common/CustomLabel';
import AppTooltip from '@crema/core/AppTooltip';
import {Button, DialogTitle, Grid} from '@mui/material';
import {Box} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import AppLoader from '@crema/core/AppLoader';
import SmartForm from '@smart-form';
import Api from '@api';
import axios from 'axios';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {toast} from 'react-toastify';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Switch from '@mui/material/Switch';
import InputAdornment from '@mui/material/InputAdornment';
import Paper from '@mui/material/Paper';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import {Autocomplete} from '@mui/material';
import SLAEdit from './SLA_edit';
// import TextField from '@mui/material/TextField';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import _ from 'lodash';
import {FunctionsRounded} from '@mui/icons-material';
const SLA = () => {
  const [open, setOpen] = useState(false);
  const [showbtn, setshowbtn] = useState(true);
  const [getAllList, setGetAllList] = useState();
  const [id, setId] = useState();
  const [index, setIndex] = useState();
  const [checked, setChecked] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [data, setData] = useState();
  const [CheckBox, setCheckBox] = useState({});
  const [minsInput, setminsInput] = useState({});
  const [daysInput, setdaysInput] = useState({});
  const [hoursInput, sethoursInput] = useState({});
  const [incident, setIncident] = useState();
  const [slaName, setslaName] = useState();
  const header = ['SLA Name', 'Incident Type', 'Action'];
  const label = {inputProps: {'aria-label': 'Checkbox demo'}};

  const {user} = useAuthUser();

  function getAll() {
    axios
      .get(
        Api.baseUri +
          '/user-reg/sla/getAllByCorporateId/' +
          user?.userList?.corporateId,
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          setGetAllList(res?.data?.data);
        }
      })
      .catch((err) => {});
  }

  useEffect(() => {
    getAll();
  }, []);

  const level = ['Level-1', 'Level-2', 'Level-3'];

  useEffect(() => {
    axios
      .get(
        Api.baseUri +
          '/user-reg/incidentPriority/get-incidentPriority-by-id/' +
          id,
      )
      .then((res) => {
        if (res.data?.status == '200') {
          setData(res?.data?.data);
        }
      });
  }, [id]);

  const incidentType = [
    {title: 'SOS', value: 'SOS'},
    {title: 'Feed Back', value: 'Feed Back'},
    {title: 'Support', value: 'Support'},
    {title: 'Safe Reach', value: 'Safe Reach'},
    {title: 'Application-technology', value: 'Application-technology'},
    {title: 'Over Speeding', value: 'Over Speeding'},
    {title: 'Other', value: 'other'},
  ];
  function handleSubmit() {
    let postData = {};
    postData.respondLevel1ETA =
      Number(daysInput?.[0] || 0) * 1440 +
      Number(hoursInput?.[0] || 0) * 60 +
      Number(minsInput?.[0] || 0);
    postData.respondLevel2ETA =
      Number(daysInput?.[1] || 0) * 1440 +
      Number(hoursInput?.[1] || 0) * 60 +
      Number(minsInput?.[1] || 0);
    postData.respondLevel3ETA =
      Number(daysInput?.[2] || 0) * 1440 +
      Number(hoursInput?.[2] || 0) * 60 +
      Number(minsInput?.[2] || 0);
    postData.resolveLevel1ETA =
      Number(daysInput?.[3] || 0) * 1440 +
      Number(hoursInput?.[3] || 0) * 60 +
      Number(minsInput?.[3] || 0);
    postData.resolveLevel2ETA =
      Number(daysInput?.[4] || 0) * 1440 +
      Number(hoursInput?.[4] || 0) * 60 +
      Number(minsInput?.[4] || 0);
    postData.resolveLevel3ETA =
      Number(daysInput?.[5] || 0) * 1440 +
      Number(hoursInput?.[5] || 0) * 60 +
      Number(minsInput?.[5] || 0);
    postData.slaName = slaName;
    postData.incidentType = incident?.value;
    postData.corporateId = user?.userList?.corporateId;

    axios
      .post(Api.baseUri + '/user-reg/sla/save', postData)
      .then((res) => {
        if (res?.data?.status == '200') {
          toast.success('SLA created successfully');
          setOpen(false);
          getAll();
        }
      })
      .catch((err) => {});
  }

  return (
    <>
            <Grid container spacing={2} sx={{padding: '30px'}}>
        <Grid item xs={9}>
          <CustomLabel labelVal='SLA' variantVal='h3-underline' />
        </Grid>
        <Grid item xs={3}>
          <Box display='flex' justifyContent='flex-end'>
            <div
              className='left-seperator'
              onClick={() => {
                setOpen(true);
              }}
            >
              <AppTooltip placement={'top'} title={'Add Prority'}>
                <img
                  src='/assets/images/channel-definition.svg'
                  className='title-icons-mui'
                />
              </AppTooltip>
            </div>
          </Box>
        </Grid>
      </Grid>
      <Grid container sx={{padding: '0px 20px 0px 20px'}}>
        <Grid
          item
          xs={12}
          md={10}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItem: 'center',
            marginTop: '10px',
          }}
        >
          <TableContainer
            style={{
              boxShadow:
                'rgba(0, 0, 0, 0) 0px 2px 4px, rgba(0, 0, 0, 0) 0px 7px 13px -3px, rgb(0,102,133) 0px -3px 0px inset',
            }}
          >
            <Table sx={{minWidth: 650}} aria-label='simple table'>
              <TableHead style={{background: '#f1f1f1'}}>
                <TableRow>
                  {header?.map((el) => {
                    return <TableCell> {el} </TableCell>;
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {getAllList?.length ? (
                  getAllList?.map((el, i) => {
                    return (
                      <TableRow
                        style={{background: i % 2 == 0 ? '' : '#f5f7ff'}}
                      >
                        <TableCell> {el?.slaName} </TableCell>
                        <TableCell> {el?.incidentType} </TableCell>
                        <TableCell>
                          <AccessTimeIcon
                            onClick={() => {
                              setOpenDialog(true);
                              setId(el);
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell align='center' colSpan={10}>
                      No Records Found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter></TableFooter>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      {open && (
        <Dialog
          open={open}
          style={{borderRadius: '4rem'}}
          maxWidth='false'
          PaperProps={{
            sx: {
              width: '1000px',
            },
          }}
        >
          <DialogTitle style={{background: '#f5f2f2'}}>
            <h1 style={{marginTop: '1.5rem'}}>Add Priority</h1>
            <CloseIcon
              onClick={() => {
                setOpen(false);
              }}
              style={{
                position: 'absolute',
                color: '#4f4f4f',
                top: '12px',
                right: '12px',
              }}
            />
          </DialogTitle>
          <DialogContent style={{padding: '0px'}}>
            <div style={{padding: '30px'}}>
              <Grid container spacing={2}>
                <Grid
                  item
                  md={6}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItem: 'center',
                  }}
                >
                  <h5 style={{marginBottom: '10px'}}>SLA Name</h5>
                  <TextField
                    fullWidth
                    size='small'
                    onInput={(e) => {
                      setslaName(e?.target?.value);
                    }}
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItem: 'center',
                  }}
                >
                  <h5 style={{marginBottom: '10px'}}>Incident Type</h5>
                  <Autocomplete
                    // multiple
                    value={incident}
                    // error={subClicked && !selVehicleType?.length}
                    limitTags={1}
                    options={incidentType ?? []}
                    getOptionLabel={(option) => option.title}
                    onChange={(e, data) => {
                      setIncident(data);
                    }}
                    disablePortal
                    size='small'
                    id='combo-box-demo'
                    sx={{width: '100%'}}
                    renderInput={(params) => {
                      return (
                        <TextField
                          {...params}
                          id='outlined-error-helper-text'
                        />
                      );
                    }}
                  />
                </Grid>
                <Grid md={12} sx={{marginTop: '10px'}}>
                  <TableContainer component={Paper}>
                    <Table size='small' aria-label='a dense table'>
                      <TableHead>
                        <TableRow>
                          <TableCell align='center' style={{minWidth: '140px'}}>
                            Levels
                          </TableCell>
                          <TableCell align='center'>Response Time</TableCell>
                          <TableCell align='center'>Resolve Time</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {level?.map((el, ind) => {
                          return (
                            <TableRow>
                              <TableCell align='center'>
                                <FormGroup>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={CheckBox[ind]}
                                        onChange={(e) => {
                                          setCheckBox({
                                            ...CheckBox,
                                            [ind]: e.target.checked,
                                          });
                                        }}
                                      />
                                    }
                                    label={el}
                                  />
                                </FormGroup>
                              </TableCell>
                              <TableCell align='center'>
                                <Grid container spacing={2}>
                                  <Grid item md={3.5}>
                                    <TextField
                                      disabled={!CheckBox[ind]}
                                      fullWidth
                                      value={daysInput[ind]}
                                      size='small'
                                      onInput={(e) => {
                                        if (
                                          !_.isNaN(Number(e.target.value)) &&
                                          Number(e.target.value) <= 365
                                        ) {
                                          setdaysInput({
                                            ...daysInput,
                                            [ind]: e.target.value,
                                          });
                                        }
                                      }}
                                      InputProps={{
                                        endAdornment: (
                                          <InputAdornment
                                            position='start'
                                            sx={{
                                              padding: '2px',
                                              marginRight: '-10px',
                                            }}
                                          >
                                            days
                                          </InputAdornment>
                                        ),
                                      }}
                                    />
                                  </Grid>
                                  <Grid item md={3.5}>
                                    <TextField
                                      fullWidth
                                      disabled={!CheckBox[ind]}
                                      size='small'
                                      value={hoursInput[ind]}
                                      onInput={(e) => {
                                        if (
                                          !_.isNaN(Number(e.target.value)) &&
                                          Number(e.target.value) <= 23
                                        ) {
                                          sethoursInput({
                                            ...hoursInput,
                                            [ind]: e.target.value,
                                          });
                                        }
                                      }}
                                      InputProps={{
                                        endAdornment: (
                                          <InputAdornment
                                            position='start'
                                            sx={{
                                              padding: '2px',
                                              marginRight: '-10px',
                                            }}
                                          >
                                            hrs
                                          </InputAdornment>
                                        ),
                                      }}
                                    />
                                  </Grid>
                                  <Grid item md={3.5}>
                                    <TextField
                                      fullWidth
                                      disabled={!CheckBox[ind]}
                                      size='small'
                                      value={minsInput[ind]}
                                      onInput={(e) => {
                                        if (
                                          !_.isNaN(Number(e.target.value)) &&
                                          Number(e.target.value) <= 59
                                        ) {
                                          setminsInput({
                                            ...minsInput,
                                            [ind]: e.target.value,
                                          });
                                        }
                                      }}
                                      InputProps={{
                                        endAdornment: (
                                          <InputAdornment
                                            position='start'
                                            sx={{
                                              padding: '2px',
                                              marginRight: '-10px',
                                            }}
                                          >
                                            mins
                                          </InputAdornment>
                                        ),
                                      }}
                                    />
                                  </Grid>
                                </Grid>
                              </TableCell>
                              <TableCell align='center'>
                                <Grid container spacing={2}>
                                  <Grid item md={3.5}>
                                    <TextField
                                      fullWidth
                                      disabled={!CheckBox[ind]}
                                      value={daysInput[ind + 3]}
                                      size='small'
                                      onInput={(e) => {
                                        if (
                                          !_.isNaN(Number(e.target.value)) &&
                                          Number(e.target.value) <= 365
                                        ) {
                                          setdaysInput({
                                            ...daysInput,
                                            [ind + 3]: e.target.value,
                                          });
                                        }
                                      }}
                                      InputProps={{
                                        endAdornment: (
                                          <InputAdornment
                                            position='start'
                                            sx={{
                                              padding: '2px',
                                              marginRight: '-10px',
                                            }}
                                          >
                                            days
                                          </InputAdornment>
                                        ),
                                      }}
                                    />
                                  </Grid>
                                  <Grid item md={3.5}>
                                    <TextField
                                      fullWidth
                                      disabled={!CheckBox[ind]}
                                      size='small'
                                      value={hoursInput[ind + 3]}
                                      onInput={(e) => {
                                        if (
                                          !_.isNaN(Number(e.target.value)) &&
                                          Number(e.target.value) <= 23
                                        ) {
                                          sethoursInput({
                                            ...hoursInput,
                                            [ind + 3]: e.target.value,
                                          });
                                        }
                                      }}
                                      InputProps={{
                                        endAdornment: (
                                          <InputAdornment
                                            position='start'
                                            sx={{
                                              padding: '2px',
                                              marginRight: '-10px',
                                            }}
                                          >
                                            hrs
                                          </InputAdornment>
                                        ),
                                      }}
                                    />
                                  </Grid>
                                  <Grid item md={3.5}>
                                    <TextField
                                      fullWidth
                                      disabled={!CheckBox[ind]}
                                      size='small'
                                      value={minsInput[ind + 3]}
                                      onInput={(e) => {
                                        if (
                                          !_.isNaN(Number(e.target.value)) &&
                                          Number(e.target.value) <= 59
                                        ) {
                                          setminsInput({
                                            ...minsInput,
                                            [ind + 3]: e.target.value,
                                          });
                                        }
                                      }}
                                      InputProps={{
                                        endAdornment: (
                                          <InputAdornment
                                            position='start'
                                            sx={{
                                              padding: '2px',
                                              marginRight: '-10px',
                                            }}
                                          >
                                            mins
                                          </InputAdornment>
                                        ),
                                      }}
                                    />
                                  </Grid>
                                </Grid>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid
                  md={12}
                  style={{display: 'flex', justifyContent: 'center'}}
                >
                  <Button
                    type='submit'
                    onClick={() => {
                      handleSubmit();
                    }}
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Dialog
        // onClose={closeDetailPage}
        open={openDialog}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '80%',
          },
        }}
        style={{borderRadius: '4rem'}}
      >
        <DialogTitle style={{background: '#f4f2f2'}}>
          <h1>Update SLA</h1>
          <CloseIcon
            onClick={() => {
              setOpenDialog(false);
            }}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              color: '#4f4f4f',
              fontWeight: 'bold',
            }}
          />
        </DialogTitle>
        <DialogContent style={{padding: '16px', paddingTop: 0}}>
          <SLAEdit
            ids={id}
            close={() => {
              setOpenDialog(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SLA;
