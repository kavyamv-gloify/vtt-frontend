import React, {useState, useEffect} from 'react';
import {Grid, Box, Button, Autocomplete} from '@mui/material';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import {useTheme} from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import LevelTemplate from './LevelTemplate';
import CustomLabel from 'pages/common/CustomLabel';
import AppTooltip from '@crema/core/AppTooltip';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import InputAdornment from '@mui/material/InputAdornment';
import Input from '@mui/material/Input';
import {useAuthUser} from '@crema/utility/AuthHooks';
import axios from 'axios';
import {toast} from 'react-toastify';
import Api from '@api';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
const SLACopy = () => {
  const [age, setAge] = React.useState('');
  const [open, setOpen] = useState(false);
  const [openLevel1, setOpenLevel1] = React.useState(false);
  const [openLevel2, setOpenLevel2] = React.useState(false);
  const [openLevel3, setOpenLevel3] = React.useState(false);
  const [openLevel4, setOpenLevel4] = React.useState(false);
  const [openLevel5, setOpenLevel5] = React.useState(false);
  const [openLevel6, setOpenLevel6] = React.useState(false);
  const [respond, setRespond] = useState({});
  const [resolved, setResolved] = useState({});
  const [value1, setValue1] = useState();
  const [value2, setValue2] = useState();
  const [value3, setValue3] = useState();
  const [value4, setValue4] = useState();
  const [value5, setValue5] = useState();
  const [value6, setValue6] = useState();
  const [id, setId] = useState({});
  const [operationHour, setOperationHour] = useState('');
  const [getAllList, setGetAllList] = useState();
  const [flag, setFlag] = useState();
  const {user} = useAuthUser();
  const header = ['SLA Name', 'Incident Type', 'Action'];
  const [data, setData] = useState({
    resolveEsc: false,
    responseEsc: false,
  });

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
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

  const names = [
    'SOS',
    'Feed Back',
    'Support',
    'Safe Reach',
    'Application-technology',
    'Over Speeding',
    'Other',
  ];
  const operationArray = [
    {title: 'Office Hours', value: 'office'},
    {title: '24 Hours', value: 'hour'},
  ];
  useEffect(() => {
    console.log('id', id);
    setData({
      slaName: id?.slaName || null,
      description: id?.description || null,
      criteria: id?.criteria || null,
      incidentType: id?.incidentType || [],
      responseEsc: id?.responseEscalation,
      resolveEsc: id?.resolutionEscalation,
      operHour: id?.operationHours,
    });
    console.log('id?.responseEscalation', id?.responseEscalation);
    console.log('id?.resolutionEscalation', id?.resolutionEscalation);
    setResolved({
      days: Math.trunc(id?.resolveWithinMinutes / 1440),
      hrs: Math.trunc((id?.resolveWithinMinutes % 1440) / 60),
      mins: Math.trunc((id?.resolveWithinMinutes % 1440) % 60),
    });
    setRespond({
      days: Math.trunc(id?.respondWithinMinutes / 1440),
      hrs: Math.trunc((id?.respondWithinMinutes % 1440) / 60),
      mins: Math.trunc((id?.respondWithinMinutes % 1440) % 60),
    });
  }, [id]);

  function getStyles(name, personName, theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }
  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);

  const handleChanges = (event) => {
    const {
      target: {value},
    } = event;
    setPersonName(typeof value === 'string' ? value.split(',') : value);
  };
  useEffect(() => {
    console.log('personName', personName);
  }, [personName]);

  function handleSubmit() {
    // console.log('Working!!!');
    if (!data.slaName || data.incidentType.length === 0) {
      alert('These fields are required.'); 
      return;
    }
    let postData = {
      slaName: data?.slaName,
      description: data?.description,
      criteria: data?.criteria,
      incidentType: data?.incidentType,
      respondWithinMinutes:
        Number(respond?.days || 0) * 1440 +
        Number(respond?.hrs || 0) * 60 +
        Number(respond?.mins || 0),
      resolveWithinMinutes:
        Number(resolved?.days || 0) * 1440 +
        Number(resolved?.hrs || 0) * 60 +
        Number(resolved?.mins || 0),
      corporateId: user?.userList?.corporateId,
      operationHours: operationHour,
      responseEscalation: data?.resolveEsc,
      resolutionEscalation: data?.responseEsc,
      responseLevel1EscalationId: value1?.escalteEmail,
      responseLevel1EscalationTime:
        Number(value1?.days || 0) * 1440 +
        Number(value1?.hrs || 0) * 60 +
        Number(value1?.mins || 0),
      responseLevel2EscalationId: value2?.escalteEmail,
      responseLevel2EscalationTime:
        Number(value2?.days || 0) * 1440 +
        Number(value2?.hrs || 0) * 60 +
        Number(value2?.mins || 0),
      responseLevel3EscalationId: value3?.escalteEmail,
      responseLevel3EscalationTime:
        Number(value4?.days || 0) * 1440 +
        Number(value4?.hrs || 0) * 60 +
        Number(value4?.mins || 0),
      resolutionLevel1EscalationId: value4?.escalteEmail,
      resolutionLevel1EscalationTime:
        Number(value4?.days || 0) * 1440 +
        Number(value4?.hrs || 0) * 60 +
        Number(value4?.mins || 0),
      resolutionLevel2EscalationId: value5?.escalteEmail,
      resolutionLevel2EscalationTime:
        Number(value5?.days || 0) * 1440 +
        Number(value5?.hrs || 0) * 60 +
        Number(value5?.mins || 0),
      resolutionLevel3EscalationId: value6?.escalteEmail,
      resolutionLevel3EscalationTime:
        Number(value6?.days || 0) * 1440 +
        Number(value6?.hrs || 0) * 60 +
        Number(value6?.mins || 0),
    };

    // console.log('postData', postData);
    if (flag == 'EDIT') {
      postData.id = id.id;
      axios
        .put(Api.baseUri + '/user-reg/sla/update', postData)
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success('SLA updated successfully');
            setOpen(false);
            setOpen(false);
            setFlag('ADD_NEW');
            setData({
              resolveEsc: false,
              responseEsc: false,
            });
            setRespond({});
            setResolved({});
            setOpenLevel1(false);
            setOpenLevel2(false);
            setOpenLevel3(false);
            setOpenLevel4(false);
            setOpenLevel5(false);
            setOpenLevel6(false);
            setValue1();
            setValue2();
            setValue3();
            setValue4();
            setValue5();
            setValue6();
            getAll();
          } else {
            toast.error('Something went wrong');
          }
        })
        .catch((err) => {
          console.log('err', err);
          toast.error('Something went wrong');
        });
    } else {
      axios
        .post(Api.baseUri + '/user-reg/sla/save', postData)
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success('SLA submited successfully');
            getAll();
            setOpen(false);
            setOpen(false);
            setFlag('ADD_NEW');
            setData({
              resolveEsc: false,
              responseEsc: false,
            });
            setRespond({});
            setResolved({});
            setOpenLevel1(false);
            setOpenLevel2(false);
            setOpenLevel3(false);
            setOpenLevel4(false);
            setOpenLevel5(false);
            setOpenLevel6(false);
            setValue1();
            setValue2();
            setValue3();
            setValue4();
            setValue5();
            setValue6();
          } else {
            toast.error(res?.data?.message);
          }
        })
        .catch((err) => {
          console.log('err', err);
          toast.error('Something went wrong');
        });
    }
  }

  return (
    <div>
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
              <AppTooltip placement={'top'} title={'Add SLA'}>
                {/* <img
                  src='/assets/images/channel-definition.svg'
                  className='title-icons-mui'
                /> */}
                <AssignmentOutlinedIcon />
              </AppTooltip>
            </div>
          </Box>
        </Grid>
      </Grid>
      <Dialog
        open={open}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '85%',
          },
        }}
        style={{borderRadius: '4rem'}}
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
                position: 'fixed',
                width: '85%',

                zIndex: '9',
                borderRadius: '5px 5px 0px 0px',
              }}
            >
              <h1 style={{marginTop: '1.5rem'}}>
                {flag == 'EDIT' ? 'Edit SLA' : 'Add SLA'}
              </h1>
              <CloseIcon
                onClick={() => {
                  setOpen(false);
                  setFlag('ADD_NEW');
                  setData({
                    resolveEsc: false,
                    responseEsc: false,
                  });
                  setRespond({});
                  setResolved({});
                  setOpenLevel1(false);
                  setOpenLevel2(false);
                  setOpenLevel3(false);
                  setOpenLevel4(false);
                  setOpenLevel5(false);
                  setOpenLevel6(false);
                  setValue1();
                  setValue2();
                  setValue3();
                  setValue4();
                  setValue5();
                  setValue6();
                }}
                style={{
                  marginTop: '1.4rem',
                  color: '#4f4f4f',
                  fontWeight: 'bold',
                }}
              />
            </div>

            <div style={{padding: '2rem', marginTop: '20px'}}>
              <Grid container sx={{marginTop: '30px'}} spacing={2}>
                <Grid item md={3}>
                  {'SLA Name*'}
                  <Box
                    component='form'
                    sx={{
                      '& > :not(style)': {m: 1, width: '100%'},
                    }}
                    noValidate
                    autoComplete='off'
                  >
                    <TextField
                      value={data?.slaName}
                      onChange={(e) => {
                        setData({...data, slaName: e?.target?.value});
                      }}
                      id='outlined-basic'
                      variant='outlined'
                      size='small'
                    />
                    {!data.slaName && <p style={{color: "red"}}>SLA Name is required.</p>}
                  </Box>
                </Grid>
                <Grid item md={3}>
                  {'Description'}
                  <Box
                    component='form'
                    sx={{
                      '& > :not(style)': {m: 1, width: '100%'},
                    }}
                    noValidate
                    autoComplete='off'
                  >
                    <TextField
                      value={data?.description}
                      onChange={(e) => {
                        setData({...data, description: e?.target?.value});
                      }}
                      id='outlined-basic'
                      variant='outlined'
                      size='small'
                    />
                  </Box>
                </Grid>
                <Grid item md={3}>
                  {'Criteria'}
                  <FormControl sx={{width: '100%', m: 1}}>
                    <Select
                      labelId='demo-simple-select-helper-label'
                      id='demo-simple-select-helper'
                      size='small'
                      value={data?.criteria}
                      onChange={(e, value) => {
                        setData({...data, criteria: e?.target?.value});
                      }}
                    >
                      <MenuItem value=''>
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value={'Critical'}>Critical</MenuItem>
                      <MenuItem value={'High'}>High</MenuItem>
                      <MenuItem value={'Low'}>Low</MenuItem>
                      <MenuItem value={'Medium'}>Medium</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item md={3}>
                  {'Incident Type*'}
                  <FormControl sx={{m: 1, width: 300}}>
                    <Select
                      labelId='demo-multiple-chip-label'
                      id='demo-multiple-chip'
                      size='small'
                      multiple
                      value={data?.incidentType ?? []}
                      onChange={(event) => {
                        const {
                          target: {value},
                        } = event;

                        setData({
                          ...data,
                          incidentType:
                            typeof value === 'string'
                              ? value.split(',')
                              : value,
                        });
                      }}
                      renderValue={(selected) => (
                        <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      )}
                      MenuProps={MenuProps}
                    >
                      {names.map((name) => (
                        <MenuItem
                          key={name}
                          value={name}
                          style={getStyles(name, personName, theme)}
                        >
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                  {(!data.incidentType || data.incidentType.length === 0) && <p style={{color: "red"}}>SLA Incident Type is required.</p>}
                  </FormControl>
                </Grid>
                <Grid
                  md={12}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '10px',
                  }}
                >
                  <Box
                    component='h3'
                    sx={{
                      fontWeight: 600,
                      fontSize: 14,
                      textAlign: 'left',
                      lineHeight: 1,
                      marginBottom: '8px',
                      marginTop: '10px',
                    }}
                  >
                    {'Set the Response and resolution time'}
                  </Box>
                </Grid>
                <Grid md={4}>
                  <Box>
                    {'Response Within'}
                    <Box sx={{display: 'flex'}}>
                      <FormControl
                        variant='standard'
                        sx={{m: 1, mt: 3, width: '10ch'}}
                      >
                        <Input
                          value={respond?.days || Number('0')}
                          id='standard-adornment-weight'
                          onChange={(e) => {
                            setRespond({...respond, days: e?.target?.value});
                          }}
                          endAdornment={
                            <InputAdornment position='end'>Days</InputAdornment>
                          }
                          aria-describedby='standard-weight-helper-text'
                          inputProps={{
                            'aria-label': 'weight',
                          }}
                        />
                      </FormControl>
                      <FormControl
                        variant='standard'
                        sx={{m: 1, mt: 3, width: '10ch'}}
                      >
                        <Input
                          id='standard-adornment-weight'
                          value={respond?.hrs || Number('0')}
                          onChange={(e) => {
                            setRespond({...respond, hrs: e?.target?.value});
                          }}
                          endAdornment={
                            <InputAdornment position='end'>Hrs</InputAdornment>
                          }
                          aria-describedby='standard-weight-helper-text'
                          inputProps={{
                            'aria-label': 'weight',
                          }}
                        />
                      </FormControl>
                      <FormControl
                        variant='standard'
                        sx={{m: 1, mt: 3, width: '10ch'}}
                      >
                        <Input
                          value={respond?.mins || Number('0')}
                          id='standard-adornment-weight'
                          onChange={(e) => {
                            setRespond({...respond, mins: e?.target?.value});
                          }}
                          endAdornment={
                            <InputAdornment position='end'>Mins</InputAdornment>
                          }
                          aria-describedby='standard-weight-helper-text'
                          inputProps={{
                            'aria-label': 'weight',
                          }}
                        />
                      </FormControl>
                    </Box>
                  </Box>
                </Grid>
                <Grid md={4}>
                  <Box>
                    {'Resolution Within'}
                    <Box sx={{display: 'flex'}}>
                      <FormControl
                        variant='standard'
                        sx={{m: 1, mt: 3, width: '10ch'}}
                      >
                        <Input
                          value={resolved?.days || Number('0')}
                          id='standard-adornment-weight'
                          onChange={(e) => {
                            setResolved({...resolved, days: e?.target?.value});
                          }}
                          endAdornment={
                            <InputAdornment position='end'>Days</InputAdornment>
                          }
                          aria-describedby='standard-weight-helper-text'
                          inputProps={{
                            'aria-label': 'weight',
                          }}
                        />
                      </FormControl>
                      <FormControl
                        variant='standard'
                        sx={{m: 1, mt: 3, width: '10ch'}}
                      >
                        <Input
                          value={resolved?.hrs || Number('0')}
                          id='standard-adornment-weight'
                          onChange={(e) => {
                            setResolved({...resolved, hrs: e?.target?.value});
                          }}
                          endAdornment={
                            <InputAdornment position='end'>Hrs</InputAdornment>
                          }
                          aria-describedby='standard-weight-helper-text'
                          inputProps={{
                            'aria-label': 'weight',
                          }}
                        />
                      </FormControl>
                      <FormControl
                        variant='standard'
                        sx={{m: 1, mt: 3, width: '10ch'}}
                      >
                        <Input
                          value={resolved?.mins || Number('0')}
                          id='standard-adornment-weight'
                          onChange={(e) => {
                            setResolved({...resolved, mins: e?.target?.value});
                          }}
                          endAdornment={
                            <InputAdornment position='end'>Mins</InputAdornment>
                          }
                          aria-describedby='standard-weight-helper-text'
                          inputProps={{
                            'aria-label': 'weight',
                          }}
                        />
                      </FormControl>
                    </Box>
                  </Box>
                </Grid>
                <Grid md={4}>
                  <Box>
                    {'Operation hour'}
                    <Box>
                      <FormControl fullWidth>
                        <Select
                          labelId='demo-simple-select-label'
                          id='demo-simple-select'
                          // value={data?.operHour || operationHour}
                          label='Operation hour'
                          onChange={(e)=>{setOperationHour(e?.target?.value)}}
                        >
                          {operationArray?.map((el)=>(
                          <MenuItem value={el?.value}>{el?.title}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Box>
                </Grid>
                <Grid md={12}>
                  <FormGroup>
                    {console.log('data?.responseEsc', data)}
                    <FormControlLabel
                      control={<Switch defaultChecked={data?.responseEsc} />}
                      label='Response Escalation'
                      onChange={(e) => {
                        setData({...data, responseEsc: e?.target?.checked});
                      }}
                    />
                  </FormGroup>
                </Grid>
                <Grid md={12} sx={{marginTop: '10px'}}>
                  <Grid md={12} sx={{marginBottom: '15px'}}>
                    <Box
                      component='h3'
                      sx={{
                        fontWeight: 600,
                        fontSize: 13,
                        textAlign: 'left',
                        lineHeight: 1,
                        marginBottom: '8px',
                        color: '#85C1E9',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        setOpenLevel1(!openLevel1);
                      }}
                    >
                      {'Add level 1 Escalation'}
                    </Box>
                  </Grid>
                  {/* {openLevel1 && (
                    <Grid md={12}>
                        <LevelTemplate
                          title={'Level 1'}
                          levelContent={setValue1}
                          _edit={{
                            agent: id?.responseLevel1EscalationId,
                            time: id?.responseLevel1EscalationTime,
                          }}
                        />
                      </Grid>
                  )} */}
                  {openLevel1 === false ? (
                    id?.responseLevel1EscalationId && (
                      <Grid md={12}>
                        <LevelTemplate
                          title={'Level 1'}
                          levelContent={setValue1}
                          _edit={{
                            agent: id?.responseLevel1EscalationId,
                            time: id?.responseLevel1EscalationTime,
                          }}
                        />
                      </Grid>
                    )
                  ) : (
                    <Grid md={12}>
                      <LevelTemplate
                        title={'Level 1'}
                        levelContent={setValue1}
                        _edit={{
                          agent: id?.responseLevel1EscalationId,
                          time: id?.responseLevel1EscalationTime,
                        }}
                      />
                    </Grid>
                  )}
                  <Grid md={12} sx={{marginBottom: '15px'}}>
                    <Box
                      component='h3'
                      sx={{
                        fontWeight: 600,
                        fontSize: 13,
                        textAlign: 'left',
                        lineHeight: 1,
                        marginBottom: '8px',
                        color: '#85C1E9',
                        cursor: 'pointer',
                        marginTop: '8px',
                      }}
                      onClick={() => {
                        setOpenLevel2(!openLevel2);
                      }}
                    >
                      {'Add level 2 Escalation'}
                    </Box>
                  </Grid>
                  {openLevel2 === false ? (
                    id?.responseLevel2EscalationId && (
                      <Grid md={12}>
                        <LevelTemplate
                          title={'Level 2'}
                          levelContent={setValue2}
                          _edit={{
                            agent: id?.responseLevel2EscalationId,
                            time: id?.responseLevel2EscalationTime,
                          }}
                        />
                      </Grid>
                    )
                  ) : (
                    <Grid md={12}>
                      <LevelTemplate
                        title={'Level 2'}
                        levelContent={setValue2}
                        _edit={{
                          agent: id?.responseLevel2EscalationId,
                          time: id?.responseLevel2EscalationTime,
                        }}
                      />
                    </Grid>
                  )}
                  {/* {openLevel2 && (
                    <Grid md={12}>
                      <LevelTemplate
                        title={'Level 2'}
                        levelContent={setValue2}
                        _edit={{
                          agent: id?.responseLevel2EscalationId,
                          time: id?.responseLevel2EscalationTime,
                        }}
                      />
                    </Grid>
                  )} */}
                  <Grid md={12} sx={{marginBottom: '15px'}}>
                    <Box
                      component='h3'
                      sx={{
                        fontWeight: 600,
                        fontSize: 13,
                        textAlign: 'left',
                        lineHeight: 1,
                        marginBottom: '8px',
                        marginTop: '8px',
                        color: '#85C1E9',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        setOpenLevel3(!openLevel3);
                      }}
                    >
                      {'Add level 3 Escalation'}
                    </Box>
                  </Grid>
                  {openLevel3 === false ? (
                    id?.responseLevel3EscalationId && (
                      <Grid md={12}>
                        <LevelTemplate
                          title={'Level 3'}
                          levelContent={setValue3}
                          _edit={{
                            agent: id?.responseLevel3EscalationId,
                            time: id?.responseLevel3EscalationTime,
                          }}
                        />
                      </Grid>
                    )
                  ) : (
                    <Grid md={12}>
                      <LevelTemplate
                        title={'Level 3'}
                        levelContent={setValue3}
                        _edit={{
                          agent: id?.responseLevel3EscalationId,
                          time: id?.responseLevel3EscalationTime,
                        }}
                      />
                    </Grid>
                  )}
                  {/* {openLevel3 && (
                    <Grid md={12}>
                      <LevelTemplate
                        title={'Level 3'}
                        levelContent={setValue3}
                        _edit={{
                          agent: id?.responseLevel3EscalationId,
                          time: id?.responseLevel3EscalationTime,
                        }}
                      />
                    </Grid>
                  )} */}
                </Grid>
                <Grid md={12} sx={{marginBottom: '10px', marginTop: '10px'}}>
                  <FormGroup>
                    <FormControlLabel
                      control={<Switch defaultChecked={data?.resolveEsc} />}
                      label='Resolution Escalation'
                      onChange={() => {
                        setData({...data, resolveEsc: e?.target?.checked});
                      }}
                    />
                  </FormGroup>
                </Grid>
              </Grid>
              <Grid md={12} sx={{marginBottom: '15px'}}>
                <Box
                  component='h3'
                  sx={{
                    fontWeight: 600,
                    fontSize: 13,
                    textAlign: 'left',
                    lineHeight: 1,
                    marginBottom: '8px',
                    color: '#85C1E9',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setOpenLevel4(!openLevel4);
                  }}
                >
                  {'Add level 1 Escalation'}
                </Box>
              </Grid>
              {openLevel4 === false ? (
                id?.resolutionLevel1EscalationId && (
                  <Grid md={12}>
                    <LevelTemplate
                      title={'Level 1'}
                      levelContent={setValue4}
                      _edit={{
                        agent: id?.resolutionLevel1EscalationId,
                        time: id?.resolutionLevel1EscalationTime,
                      }}
                    />
                  </Grid>
                )
              ) : (
                <Grid md={12}>
                  <LevelTemplate
                    title={'Level 1'}
                    levelContent={setValue4}
                    _edit={{
                      agent: id?.resolutionLevel1EscalationId,
                      time: id?.resolutionLevel1EscalationTime,
                    }}
                  />
                </Grid>
              )}

              {/* {openLevel4 && (
                <Grid md={12}>
                  <LevelTemplate
                    title={'Level 1'}
                    levelContent={setValue4}
                    _edit={{
                      agent: id?.resolutionLevel1EscalationId,
                      time: id?.resolutionLevel1EscalationTime,
                    }}
                  />
                </Grid>
              )} */}

              <Grid md={12} sx={{marginBottom: '15px'}}>
                <Box
                  component='h3'
                  sx={{
                    fontWeight: 600,
                    fontSize: 13,
                    textAlign: 'left',
                    lineHeight: 1,
                    marginBottom: '8px',
                    color: '#85C1E9',
                    cursor: 'pointer',
                    marginTop: '8px',
                  }}
                  onClick={() => {
                    setOpenLevel5(!openLevel5);
                  }}
                >
                  {'Add level 2 Escalation'}
                </Box>
              </Grid>
              {openLevel5 === false ? (
                id?.resolutionLevel2EscalationId && (
                  <Grid md={12}>
                    <LevelTemplate
                      title={'Level 2'}
                      levelContent={setValue5}
                      _edit={{
                        agent: id?.resolutionLevel2EscalationId,
                        time: id?.resolutionLevel2EscalationTime,
                      }}
                    />
                  </Grid>
                )
              ) : (
                <Grid md={12}>
                  <LevelTemplate
                    title={'Level 2'}
                    levelContent={setValue5}
                    _edit={{
                      agent: id?.resolutionLevel2EscalationId,
                      time: id?.resolutionLevel2EscalationTime,
                    }}
                  />
                </Grid>
              )}
              {/* {openLevel5 && (
                <Grid md={12}>
                  <LevelTemplate
                    title={'Level 2'}
                    levelContent={setValue5}
                    _edit={{
                      agent: id?.resolutionLevel2EscalationId,
                      time: id?.resolutionLevel2EscalationTime,
                    }}
                  />
                </Grid>
              )} */}

              <Grid md={12} sx={{marginBottom: '15px'}}>
                <Box
                  component='h3'
                  sx={{
                    fontWeight: 600,
                    fontSize: 13,
                    textAlign: 'left',
                    lineHeight: 1,
                    marginBottom: '8px',
                    marginTop: '8px',
                    color: '#85C1E9',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setOpenLevel6(!openLevel6);
                  }}
                >
                  {'Add level 3 Escalation'}
                </Box>
              </Grid>
              {openLevel6 === false ? (
                id?.resolutionLevel3EscalationId && (
                  <Grid md={12}>
                    <LevelTemplate
                      title={'Level 3'}
                      levelContent={setValue6}
                      _edit={{
                        agent: id?.resolutionLevel3EscalationId,
                        time: id?.resolutionLevel3EscalationTime,
                      }}
                    />
                  </Grid>
                )
              ) : (
                <Grid md={12}>
                  <LevelTemplate
                    title={'Level 3'}
                    levelContent={setValue6}
                    _edit={{
                      agent: id?.resolutionLevel3EscalationId,
                      time: id?.resolutionLevel3EscalationTime,
                    }}
                  />
                </Grid>
              )}
              {/* {openLevel6 && (
                <Grid md={12}>
                  <LevelTemplate
                    title={'Level 3'}
                    levelContent={setValue6}
                    _edit={{
                      agent: id?.resolutionLevel3EscalationId,
                      time: id?.resolutionLevel3EscalationTime,
                    }}
                  />
                </Grid>
              )} */}
            </div>
            <Grid
              md={12}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '10px',
              }}
            >
              <Button
                variant='contained'
                type='submit'
                onClick={() => {
                  handleSubmit();
                }}
              >
                {flag == 'EDIT' ? 'Update' : 'Submit'}
              </Button>
            </Grid>
          </DialogContent>
        </div>
      </Dialog>

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
                        <TableCell> {el?.incidentType}</TableCell>
                        <TableCell>
                          <AccessTimeIcon
                            onClick={() => {
                              setOpen(true);
                              setFlag('EDIT');
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
    </div>
  );
};

export default SLACopy;
