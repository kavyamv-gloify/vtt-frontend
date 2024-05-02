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
const SLAEdit = ({ids}) => {
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

  console.log('ids', ids);
  const {user} = useAuthUser();

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

  useEffect(() => {
    console.log(ids, 'myids');
    // if (ids?.respondLevel1ETA || ids?.resolveLevel1ETA) {
    //   setCheckBox();
    // }
    // if (ids?.respondLevel2ETA || ids?.resolveLevel2ETA) {
    //   setCheckBox();
    // }
    // if (ids?.respondLevel3ETA || ids?.resolveLevel3ETA) {
    //   setCheckBox();
    // }
    setdaysInput([
      Math.trunc(ids?.resolveLevel1ETA / 1440),
      Math.trunc(ids?.resolveLevel2ETA / 1440),
      Math.trunc(ids?.resolveLevel3ETA / 1440),
      Math.trunc(ids?.respondLevel1ETA / 1440),
      Math.trunc(ids?.respondLevel2ETA / 1440),
      Math.trunc(ids?.respondLevel3ETA / 1440),
    ]);
    sethoursInput([
      Math.trunc((ids?.resolveLevel1ETA % 1440) / 60),
      Math.trunc((ids?.resolveLevel2ETA % 1440) / 60),
      Math.trunc((ids?.resolveLevel3ETA % 1440) / 60),
      Math.trunc((ids?.respondLevel1ETA % 1440) / 60),
      Math.trunc((ids?.respondLevel2ETA % 1440) / 60),
      Math.trunc((ids?.respondLevel3ETA % 1440) / 60),
    ]);
    setminsInput([
      Math.trunc((ids?.resolveLevel1ETA % 1440) % 60),
      Math.trunc((ids?.resolveLevel2ETA % 1440) % 60),
      Math.trunc((ids?.resolveLevel3ETA % 1440) % 60),
      Math.trunc((ids?.respondLevel1ETA % 1440) % 60),
      Math.trunc((ids?.respondLevel2ETA % 1440) % 60),
      Math.trunc((ids?.respondLevel3ETA % 1440) % 60),
    ]);

    setslaName(ids?.slaName);
    debugger
    setIncident({title: ids?.incidentType, value: ids?.incidentType});
  }, [ids]);

  useEffect(() => {
    console.log('checkBox', CheckBox);
  }, CheckBox);
  function handleEdit(val) {
    let postData = data;
    postData.escalationTiming =
      val?.data?.reponseInHours +
      'hrs   ' +
      val?.data?.reponseInsec +
      'seconds';
    axios
      .put(
        Api.baseUri + '/user-reg/incidentPriority/update-incidentPriority',
        postData,
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          toast.success('Escalated time added successfully');
          setOpenDialog(false);
          getAll();
        }
      });
  }

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
              value={slaName}
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
              value={incident ?? []}
              // error={subClicked && !selVehicleType?.length}
              limitTags={1}
              options={incidentType ?? []}
              getOptionLabel={(option) => option.title}
              onChange={(e, data) => {
                console.log('data', data);
                // let all = [];
                // let is_all = false;
                // if (data?.length) {
                //   data?.map((el) => {
                //     if (el.value == 'ALL') is_all = true;
                //   });
                //   incidentType?.map((el) => {
                //     if (el.value != 'ALL') all.push(el);
                //   });
                // }
                setIncident(data);
              }}
              disablePortal
              size='small'
              id='combo-box-demo'
              sx={{width: '100%'}}
              renderInput={(params) => {
                return (
                  <TextField {...params} id='outlined-error-helper-text' />
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
          <Grid md={12} style={{display: 'flex', justifyContent: 'center'}}>
            <Button
              variant='contained'
              type='submit'
              onClick={() => {
                handleSubmit();
              }}
            >
              Update
            </Button>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default SLAEdit;
