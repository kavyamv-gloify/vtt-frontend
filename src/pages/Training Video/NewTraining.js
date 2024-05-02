import {Box, Button, Grid, Typography} from '@mui/material';
import React, {useState, useEffect} from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
// import '../style.css';
import {styled} from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, {tableCellClasses} from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Api from '@api';
import axios from 'axios';
import {toast} from 'react-toastify';
import {useForm, Controller, useWatch} from 'react-hook-form';
import {PostAdd, Watch} from '@mui/icons-material';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import {useNavigate, useParams} from 'react-router-dom';
import regex from '@regex';
import moment from 'moment';
import _ from 'lodash';
import {useAuthUser} from '@crema/utility/AuthHooks';

const StyledTableCell = styled(TableCell)(({theme}) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#f5f7f6',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({theme}) => ({
  '&:nth-of-type(even)': {
    backgroundColor: '#fafbff',
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const Create = ({data, close}) => {
  const [selVendor, setselVendor] = useState([]);
  const [selVehicleType, setSelVehicleType] = useState([]);
  const [selFuelType, setSelFuelType] = useState([]);
  const [subClicked, setsubClicked] = useState(false);
  const [title, setTitle] = useState({});
  const [stakeHolder, setStakeHolder] = useState({});
  const [platForm, setPlatForm] = useState({});
  const [module, setModule] = useState({});
  const {
    register,
    formState: {errors},
    reset,
    handleSubmit,
    watch,
    control,
    getValues,
    setValue,
  } = useForm({mode: 'onTouched'});
  const formData = useWatch({control, defaultValue: 'default'});
  const {user} = useAuthUser();
  const styles = {
    input: {
      // width: "10rem",
      alignItem: 'center',
      height: '23px',
      borderColor: '#f6f6f6',
      marginTop: '-8px',
      width: '100px',
      fontSize: '14px',
    },
  };

  useEffect(() => {}, [errors]);

  useEffect(() => {
    reset(data);
  }, []);

  useEffect(() => {
    // console.log('data', data);

    if (_.isEmpty(data) || !StakeHolder?.length) return;
    StakeHolder?.map((el) => {
      if (el.value == data?.stakeHolder)
        setStakeHolder({title: el?.title, value: el?.value});
    });

    setTitle({
      ...title,
      title: data?.title,
      description: data?.description,
      thumbnailURL: data?.thumbnailURL,
      youtubeURL: data?.youtubeURL,
    });

    platform?.map((el) => {
      if (el.value == data?.platform)
        setPlatForm({title: el?.title, value: el?.value});
    });

    if (data?.stakeHolder == 'CORPORATEADMIN') {
      corporateModule?.map((el) => {
        if (el.value == data?.module)
          setModule({title: el?.title, value: el?.value});
      });
    }
    if (data?.stakeHolder == 'SUPERADMIN') {
      SuperAdminModule?.map((el) => {
        if (el.value == data?.module)
          setModule({title: el?.title, value: el?.value});
      });
    }
    if (data?.stakeHolder == 'EMPLOYEE') {
      EmployeeModule?.map((el) => {
        if (el.value == data?.module)
          setModule({title: el?.title, value: el?.value});
      });
    }
    if (data?.stakeHolder == 'MANAGER') {
      ManagerModule?.map((el) => {
        if (el.value == data?.module)
          setModule({title: el?.title, value: el?.value});
      });
    }
    if (data?.stakeHolder == 'DRIVER') {
      DriverModule?.map((el) => {
        if (el.value == data?.module)
          setModule({title: el?.title, value: el?.value});
      });
    }
    if (data?.stakeHolder == 'VENDOR') {
      VendorModule?.map((el) => {
        if (el.value == data?.module)
          setModule({title: el?.title, value: el?.value});
      });
    }
  }, [data]);

  const StakeHolder = [
    {title: 'Super Admin', value: 'SUPERADMIN'},
    {title: 'Corporate Admin', value: 'CORPORATEADMIN'},
    {title: 'Employee', value: 'EMPLOYEE'},
    {title: 'Manager', value: 'MANAGER'},
    {title: 'Driver', value: 'DRIVER'},
    {title: 'Vendor', value: 'VENDOR'},
  ];
  const corporateModule = [
    {title: 'Master', value: 'Masters'},
    {title: 'Active Trips', value: 'Active Trips'},
    {title: 'Live Tracking', value: 'Live Tracking'},
    {title: 'Roster', value: 'Roster'},
    {title: 'Routes', value: 'Routes'},
    {title: 'Adhoc Trip', value: 'Adhoc Trip'},
    {title: 'Leave Management', value: 'Leave Management'},
    {title: 'Rate Card', value: 'Rate Card'},
    {title: 'Compliance', value: 'Compliance'},
    {title: 'Reports', value: 'Reports'},
    {title: 'Billing', value: 'Billing'},
    {title: 'IVR', value: 'IVR'},
    {title: 'Invoicing', value: 'Invoicing'},
    {title: 'Feedback', value: 'Feedback'},
    {title: 'Training Video', value: 'Training Video'},
    {title: 'Announcements', value: 'Announcements'},
    {title: 'Setting', value: 'Setting'},
    {title: 'Incident Management', value: 'Incident Management'},
    {title: 'Driver Attendance', value: 'Driver Attendance'},
    {title: 'Fuel Tracking', value: 'Fuel Tracking'},
    {title: 'New', value: 'NEW'},
  ];
  const VendorModule = [
    {title: 'Active Trips', value: 'Active Trips'},
    {title: 'Master', value: 'Master'},
    {title: 'Route List', value: 'Route List'},
    {title: 'Leave Management', value: 'Leave Management'},
    {title: 'Compliance', value: 'Compliance'},
    {title: 'Reports', value: 'Reports'},
    {title: 'Billing', value: 'Billing'},
    {title: 'Invoicing', value: 'Invoicing'},
    {title: 'Feedback', value: 'Feedback'},
    {title: 'Training Video', value: 'Training Video'},
    {title: 'Announcements', value: 'Announcements'},
    {title: 'Setting', value: 'Setting'},
    {title: 'Incident Management', value: 'Incident Management'},
    {title: 'Driver Attendance', value: 'Driver Attendance'},
    {title: 'Fuel Tracking', value: 'Fuel Tracking'},
    {title: 'New', value: 'NEW'},
  ];

  const EmployeeModule = [
    {title: 'Manage Leave', value: 'Manage Leave'},
    {title: 'Training Video', value: 'Training Video'},
    {title: 'Adhoc Trip-Employee', value: 'Adhoc Trip'},
    {title: 'Roster', value: 'Roster'},
    {title: 'Your Rides ', value: 'Your Rides '},
    {title: 'Support', value: 'Support'},
    {title: 'New', value: 'NEW'},
  ];

  const ManagerModule = [
    {title: 'Leave Management', value: 'Leave Management'},
    {title: 'Training Video', value: 'Training Video'},
    {title: 'Adhoc Trip-Manager', value: 'Adhoc Trip'},
    {title: 'Roster', value: 'Roster'},
    {title: 'Your Rides	', value: 'Your Rides	'},
    {title: 'Support', value: 'Support'},
  ];
  const SuperAdminModule = [
    {title: 'Corporate', value: 'Corporate'},
    {title: 'New', value: 'NEW'},
  ];
  const DriverModule = [
    {title: 'Compliance', value: 'Compliance'},
    {title: 'Feedback', value: 'Feedback'},
    {title: 'Driver Attendance', value: 'Driver Attendance'},
    {title: 'Support', value: 'Support'},
    {title: 'Fuel Tracking', value: 'Fuel Tracking'},
    {title: 'New', value: 'NEW'},
  ];
  const platform = [
    {title: 'Mobile Application', value: 'MOBILE'},
    {title: 'Web Application', value: 'WEB'},
  ];

  function onSubmit(val) {
    // console.log('val', val);
    // console.log('platform', platform, stakeHolder, module);

    let postData = val;
    postData.module = module?.value;
    postData.stakeHolder = stakeHolder?.value;
    postData.platForm = platForm?.value;
    // console.log('postData', postData);
    axios
      .put(Api.baseUri + '/user-reg/trainingVideos/update', postData)
      .then((res) => {
        if (res?.data?.status == '200') {
          toast.success('Updated Successfully');
          close();
        } else {
          toast.error(res?.data?.message || 'Something went Wrong');
          setShowbtn(true);
        }
      })
      .catch((err) => {
        toast.error('Something went Wrong');
        setShowbtn(true);
      });
  }
  return (
    <div className='my-chip'>
      <div className='rate-headings'>
        <Grid container spacing={1} sx={{padding: '25px'}}>
          <Grid item xs={12} sm={6} md={12} className='left-grid-create-box'>
            <div>
              {data && (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={6}>
                    <Grid item xs={6} sm={6} md={6}>
                      <h5>
                        Stake Holder
                        <span style={{color: 'red'}}>*</span>
                      </h5>
                      <Autocomplete
                        disablePortal
                        value={stakeHolder}
                        // error={subClicked && !selVehicleType?.length}
                        id='combo-box-demo'
                        options={StakeHolder ?? []}
                        onChange={(e, value) => {
                          // console.log('e', e, value);
                          setStakeHolder(value);
                        }}
                        getOptionLabel={(option) => option.title}
                        sx={{width: '100%'}}
                        size='small'
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </Grid>
                    <Grid item xs={6} sm={6} md={6}>
                      <h5>
                        Platform <span style={{color: 'red'}}>*</span>
                      </h5>
                      <Autocomplete
                        // multiple
                        // name='vendorId'
                        // error={subClicked && !selVehicleType?.length}
                        value={platForm}
                        // error={subClicked && !selVendor?.length}
                        options={platform ?? []}
                        getOptionLabel={(option) => option.title}
                        // defaultValue={data?.vendorId}
                        limitTags={1}
                        disablePortal
                        onChange={(e, value) => {
                          // console.log('e', e, value);
                          setPlatForm(value);
                        }}
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
                      <p style={{fontSize: '12px', color: 'red'}}>
                        {subClicked && !selVendor?.length
                          ? 'Please select vendor.'
                          : ''}
                      </p>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6}>
                      <h5>
                        Modules <span style={{color: 'red'}}>*</span>
                      </h5>
                      <Autocomplete
                        value={module}
                        // error={subClicked && !selVehicleType?.length}
                        limitTags={1}
                        options={
                          stakeHolder?.value == 'SUPERADMIN'
                            ? SuperAdminModule
                            : stakeHolder?.value == 'CORPORATEADMIN'
                            ? corporateModule
                            : stakeHolder?.value == 'EMPLOYEE'
                            ? EmployeeModule
                            : stakeHolder?.value == 'MANAGER'
                            ? ManagerModule
                            : stakeHolder?.value == 'DRIVER'
                            ? DriverModule
                            : VendorModule
                        }
                        getOptionLabel={(option) => option.title}
                        onChange={(e, value) => {
                          // console.log('e', e, value);
                          setModule(value);
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
                      <p style={{fontSize: '12px', color: 'red'}}>
                        {subClicked && !selVehicleType?.length
                          ? 'Please select vehicle Type.'
                          : ''}
                      </p>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6}>
                      <h5>
                        Title <span style={{color: 'red'}}>*</span>
                      </h5>
                      <TextField
                        // error
                        value={title?.title}
                        {...register('title', {
                          required: 'This is a  mandatory field',

                          // pattern: {
                          //   value: regex.numReg,
                          //   message: 'Please enter valid price.',
                          // },
                        })}
                        onChange={(e, v) => {
                          setTitle({...title, title: e?.target?.value});
                        }}
                        id='outlined-error-helper-text'
                        // label="Error"
                        size='small'
                        fullWidth
                      />

                      <p style={{fontSize: '12px', color: 'red'}}>
                        {subClicked && !selFuelType?.length
                          ? 'Please select Fuel Type.'
                          : ''}
                      </p>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6}>
                      <h5>
                        Description <span style={{color: 'red'}}>*</span>
                      </h5>
                      <TextField
                        // error
                        value={title?.description}
                        {...register('description', {
                          required: 'This is a  mandatory field',

                          // pattern: {
                          //   value: regex.numReg,
                          //   message: 'Please enter valid price.',
                          // },
                        })}
                        onChange={(e, v) => {
                          setTitle({...title, description: e?.target?.value});
                        }}
                        id='outlined-error-helper-text'
                        // label="Error"
                        size='small'
                        fullWidth
                      />
                      <p style={{fontSize: '12px', color: 'red'}}>
                        {subClicked && !selFuelType?.length
                          ? 'Please select Fuel Type.'
                          : ''}
                      </p>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6}>
                      <h5>
                        Thumb Nail URL<span style={{color: 'red'}}>*</span>
                      </h5>
                      <TextField
                        // error
                        value={title?.thumbnailURL}
                        {...register('thumbnailURL', {
                          required: 'This is a  mandatory field',

                          // pattern: {
                          //   value: regex.numReg,
                          //   message: 'Please enter valid price.',
                          // },
                        })}
                        onChange={(e, v) => {
                          setTitle({...title, thumbnailURL: e?.target?.value});
                        }}
                        id='outlined-error-helper-text'
                        // label="Error"
                        size='small'
                        fullWidth
                      />
                      <p style={{fontSize: '12px', color: 'red'}}>
                        {errors?.basePrice?.message}
                      </p>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6}>
                      <h5>
                        Youtube URL<span style={{color: 'red'}}>*</span>
                      </h5>
                      <TextField
                        // error
                        value={title?.youtubeURL}
                        {...register('youtubeURL', {
                          required: 'This is a  mandatory field',

                          // pattern: {
                          //   value: regex.numReg,
                          //   message: 'Please enter valid price.',
                          // },
                        })}
                        onChange={(e, v) => {
                          setTitle({...title, youtubeURL: e?.target?.value});
                        }}
                        id='outlined-error-helper-text'
                        // label="Error"
                        size='small'
                        fullWidth
                      />
                      <p style={{fontSize: '12px', color: 'red'}}>
                        {errors?.basePrice?.message}
                      </p>
                    </Grid>
                  </Grid>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      marginTop: '25px',
                    }}
                  >
                    <Button
                      id='btnMui123'
                      type='submit'
                      // onClick={() => {
                      //   setsubClicked(true);
                      // }}
                      variant='contained'
                      sx={{background: '#0b6284', width: '100px'}}
                      // disabled={buttonType == 'PREVIEW' ? false : true}
                    >
                      UPDATE
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Create;
