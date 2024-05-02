import React, {useState, useEffect} from 'react';
import {alpha, styled} from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import Editor from './dummyckeditor';
import {Box, Button, MenuItem, Select} from '@mui/material';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';
import {useAuthUser} from '@crema/utility/AuthHooks';
import Api from '@api';
import {useForm, Controller, useWatch} from 'react-hook-form';
import {getFormData} from '@hoc';
import {toast} from 'react-toastify';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import AppLoader from '@crema/core/AppLoader';
import InputAdornment from '@mui/material/InputAdornment';
import moment from 'moment';
import _ from 'lodash';

const Android12Switch = styled(Switch)(({theme}) => ({
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    '&:before, &:after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16,
    },
    '&:before': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    '&:after': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2,
  },
}));

const NewAnnouncement = ({close}) => {
  const {user} = useAuthUser();
  const [sitoffice, setSiteOffice] = useState([]);
  const [department, setDepartment] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [smsbody, setSmsBody] = useState(false);
  const [notificationBody, setNotificationBody] = useState(false);
  const [emailMessage, setEmailMessage] = useState();
  const [emailBody, setEmailBody] = useState(false);
  const [isFrequency, setisFrequency] = useState(false);
  const [showbtn, setshowbtn] = useState(true);
  const [officeId, setOfficeId] = useState();
  const [filename, setFileName] = useState();
  const [filename2, setFileName2] = useState();
  const [departmentId, setDepartmentId] = useState();
  const {
    register,
    formState: {errors},
    handleSubmit,
    watch,
    control,
    getValues,
    setValue,
  } = useForm({mode: 'onTouched'});
  const formData = useWatch({control, defaultValue: 'default'});

  function getSiteoffice() {
    axios
      .get(
        Api.baseUri +
          '/user-reg/siteoffice-reg/corporate?page=0&size=1000&officeName=null',
      )
      .then((res) => {
        let temparr = [];
        res?.data?.data?.body['SiteOffice List']?.map((e) => {
          temparr.push({title: e?.officeName, value: e?.id});
        });
        setSiteOffice(temparr);
      })
      .catch((err) => {
        setSiteOffice([]);
      });
  }

  function getDepartment() {
    axios
      .get(
        Api.baseUri +
          `/user-reg/department/null/employeeId/${user?.userList?.corporateId}/corporateId?page=0&size=1000`,
      )
      .then((res) => {
        let temparr = [];
        res?.data?.data?.body['DepartmentList']?.map((e) => {
          temparr.push({title: e?.departmentName, value: e?.id});
        });
        setDepartment(temparr);
      })
      .catch((err) => {
        setDepartment([]);
      });
  }

  useEffect(() => {
    let temp_dept = [];
    let temp_office = [];
    let temp_emp = [];
    departmentId?.map((el) => {
      temp_dept?.push(el?.value);
    });
    officeId?.map((el) => {
      temp_office?.push(el?.value);
    });

    axios
      .get(
        Api.baseUri +
          '/user-reg/employee-reg/empListing?corporateId=' +
          user?.userList?.corporateId +
          '&departmentId=' +
          temp_dept,
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          res?.data?.data?.map((el) => {
            temp_emp?.push({title: el?.employeeFullName, value: el?.id});
          });
          setEmployee(temp_emp ?? []);
        }
      })
      .catch((err) => {
        setEmployee([]);
      });
  }, [departmentId, officeId]);
  useEffect(() => {
    getSiteoffice();
    getDepartment();
  }, []);

  const onSubmit = (data) => {
    setshowbtn(false);
    let postData = {};
    postData = data;
    let sitearray = [];
    let sitearrayid = [];
    let departmentarray = [];
    let departmentId = [];
    let employeearray = [];
    let employeeId = [];
    postData?.siteoffice?.map((e) => {
      sitearray.push(e?.title);
      sitearrayid.push(e?.value);
    });
    postData?.employee?.map((e) => {
      employeearray.push(e?.title);
      employeeId.push(e?.value);
    });
    postData?.department?.map((e) => {
      departmentarray.push(e?.title);
      departmentId.push(e?.value);
    });

    let tempdata = {
      siteOfficeIds: sitearrayid,
      departmentIds: departmentId,
      employeeIds: employeeId,
      siteOfficeNames: sitearray,
      departmentNames: departmentarray,
      employeeNames: employeearray,
      sendEmail: postData?.email,
      emailMessage: emailMessage,
      sendSMS: postData?.sms,
      smsMessage: postData?.smsMessage,
      pushNotification: postData?.push_notification,
      pushNotificationMessage: postData?.pushNotificationMessage,
      title: postData?.title,
      summary: postData?.description,
      startTime: postData?.startTime,
      endTime: postData?.endTime,
      startDate: postData?.startDate,
      endDate: postData?.endDate,
      image: filename,
      banner: filename2,
      isFrequency: postData?.isFrequency,
      frequencyTime: postData?.frequencyTime,
      announcemnetType: postData?.announcemnetType,
      // "corporateId" : user?.
    };

    if (tempdata.sendEmail == false && emailMessage == undefined) {
      tempdata.emailMessage = '';
    }

    let dataSet = {};
    let allElem = {};
    Object.keys(tempdata).map((key) => {
      if (typeof tempdata[key]?.[0]?.name == 'string') {
        dataSet = {
          ...dataSet,
          [key]: tempdata[key][0],
        };
      } else {
        allElem = {
          ...allElem,
          [key]: tempdata[key],
        };
      }
    });
    dataSet = {
      ...dataSet,
      data: JSON.stringify(allElem),
    };
    axios({
      method: 'post',
      url: Api.announcement.create,
      data: getFormData(dataSet),
      headers: {'Content-Type': 'multipart/form-data'},
    })
      .then(function (response) {
        if (response?.data?.status == '200') {
          toast.success('Announcement created successfully');
          close(false);
        } else {
          setshowbtn(true);
          toast.error(response?.data?.message ?? 'Something went wrong');
        }
      })
      .catch(function (response) {
        toast.error('Something went wrong');
        setshowbtn(true);
      });
  };

  const email = (d) => {
    setEmailMessage(d);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid
                item
                xs={6}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexDirection: 'column',
                }}
              >
                <label
                  htmlFor={'announcemnetType'}
                  style={{display: 'inline-block', marginBottom: '8px'}}
                  className='input-field-labels'
                >
                  Announcement Category
                  <span style={{color: 'red'}}>*</span>
                </label>
                <Select
                  labelId='demo-simple-select-label'
                  id='announcemnetType'
                  error={errors?.announcemnetType}
                  {...register('announcemnetType', {
                    required: 'This is a mandatory field',
                  })}
                >
                  <MenuItem value={'ERROR'}>Error Announcement</MenuItem>
                  <MenuItem value={'WARNING'}>Warning Announcement</MenuItem>
                  <MenuItem value={'INFO'}>Info Announcement</MenuItem>
                  <MenuItem value={'SUCCESS'}>Success Announcement</MenuItem>
                  <MenuItem value={'OTHER'}>Other</MenuItem>
                </Select>
                <p style={{fontSize: '12px', color: 'red'}}>
                  {errors?.announcemnetType?.message}
                </p>
              </Grid>
              <Grid
                item
                xs={6}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexDirection: 'column',
                }}
              >
                <label
                  htmlFor={'title'}
                  style={{display: 'inline-block', marginBottom: '8px'}}
                  className='input-field-labels'
                >
                  Title
                  <span style={{color: 'red'}}>*</span>
                </label>
                <TextField
                  error={errors?.title}
                  {...register('title', {
                    required: 'This is a mandatory field',
                    maxLength: {
                      value: 250,
                      message: 'Length should be lesser than 250',
                    },
                  })}
                />
                <p style={{fontSize: '12px', color: 'red'}}>
                  {errors?.title?.message}
                </p>
              </Grid>
              <Grid
                item
                xs={6}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexDirection: 'column',
                }}
              >
                <label
                  htmlFor={'startDate'}
                  style={{display: 'inline-block', marginBottom: '8px'}}
                  className='input-field-labels'
                >
                  Start Date
                  <span style={{color: 'red'}}>*</span>
                </label>

                <TextField
                  error={errors?.startDate}
                  type='date'
                  // min="2023-02-13"
                  inputProps={{
                    min: moment().format('YYYY-MM-DD'),
                  }}
                  fullWidth
                  {...register('startDate', {
                    required: 'This is a mandatory field',
                  })}
                  id='outlined-basic'
                  variant='outlined'
                />
                <p style={{fontSize: '12px', color: 'red'}}>
                  {errors?.startDate?.message}
                </p>
              </Grid>
              <Grid
                item
                xs={6}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexDirection: 'column',
                }}
              >
                <label
                  htmlFor={'endDate'}
                  style={{display: 'inline-block', marginBottom: '8px'}}
                  className='input-field-labels'
                >
                  End Date
                  <span style={{color: 'red'}}>*</span>
                </label>

                <TextField
                  error={errors?.endDate}
                  type='date'
                  inputProps={{
                    min: moment().format('YYYY-MM-DD'),
                  }}
                  fullWidth
                  {...register('endDate', {
                    required: 'This is a mandatory field',
                    validate: {
                      lessThan: (v) =>
                        new Date(v) >= new Date(watch('startDate')),
                    },
                  })}
                  id='outlined-basic'
                  variant='outlined'
                />
                <p style={{fontSize: '12px', color: 'red'}}>
                  {errors?.endDate?.message ||
                    (errors?.endDate?.type === 'lessThan' && (
                      <p style={{fontSize: '12px', color: 'red'}}>
                        End date should be greater than start end
                      </p>
                    ))}
                </p>
              </Grid>
              <Grid
                item
                xs={6}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexDirection: 'column',
                }}
              >
                <label
                  htmlFor={'startTime'}
                  style={{display: 'inline-block', marginBottom: '8px'}}
                  className='input-field-labels'
                >
                  Start Time
                  <span style={{color: 'red'}}>*</span>
                </label>

                <TextField
                  error={errors?.startTime}
                  type='time'
                  // min={"today"}
                  fullWidth
                  {...register('startTime', {
                    required: 'This is a mandatory field',
                  })}
                  id='outlined-basic'
                  variant='outlined'
                />
                <p style={{fontSize: '12px', color: 'red'}}>
                  {errors?.startTime?.message}
                </p>
              </Grid>
              <Grid
                item
                xs={6}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexDirection: 'column',
                }}
              >
                <label
                  htmlFor={'endTime'}
                  style={{display: 'inline-block', marginBottom: '8px'}}
                  className='input-field-labels'
                >
                  End Time
                  <span style={{color: 'red'}}>*</span>
                </label>

                <TextField
                  error={errors?.endTime}
                  type='time'
                  // min={"today"}
                  fullWidth
                  {...register('endTime', {
                    required: 'This is a mandatory field',
                  })}
                  id='outlined-basic'
                  variant='outlined'
                />
                <p style={{fontSize: '12px', color: 'red'}}>
                  {errors?.endTime?.message}
                </p>
              </Grid>
            </Grid>
          </Grid>

          <Grid
            item
            xs={12}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'column',
            }}
          >
            <label
              htmlFor={'description'}
              style={{display: 'inline-block', marginBottom: '8px'}}
              className='input-field-labels'
            >
              Message
              <span style={{color: 'red'}}>*</span>
            </label>
            <TextField
              error={errors?.description}
              {...register('description', {
                required: 'This is a  mandatory field',
                maxLength: {
                  value: 500,
                  message: 'Length should be lesser than 500',
                },
              })}
              multiline
              style={{width: '100%'}}
              maxRows={10}
            />
            <p style={{fontSize: '12px', color: 'red'}}>
              {errors?.description?.message}
            </p>
          </Grid>

          <Grid
            item
            xs={12}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'column',
            }}
          >
            <label
              htmlFor={'siteoffice'}
              style={{display: 'inline-block', marginBottom: '8px'}}
              className='input-field-labels'
            >
              SiteOffice
              <span style={{color: 'red'}}>*</span>
            </label>
            <Controller
              error={errors?.siteoffice}
              name='siteoffice'
              rules={{required: 'This is a  mandatory field'}}
              control={control}
              render={({field}) => (
                <Autocomplete
                  {...field}
                  multiple
                  onChange={(e, data) => {
                    field.onChange(data);
                    setOfficeId(data);
                  }}
                  selected={field.value}
                  options={sitoffice ?? []}
                  getOptionLabel={(option) => option.title}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip label={option.title} {...getTagProps({index})} />
                    ))
                  }
                  renderInput={(params) => <TextField {...params} />}
                />
              )}
            />
            <p style={{fontSize: '12px', color: 'red'}}>
              {errors?.siteoffice?.message}
            </p>
          </Grid>
          <Grid item xs={12}>
            <label
              htmlFor={'department'}
              style={{display: 'inline-block', marginBottom: '8px'}}
              className='input-field-labels'
            >
              Department
              <span style={{color: 'red'}}>*</span>
            </label>
            <Controller
              name='department'
              control={control}
              rules={{required: 'This is a mandatory field'}}
              render={({field}) => (
                <Autocomplete
                  sx={{width: '100%', maxWidth: '100%'}}
                  {...field}
                  multiple
                  onChange={(e, data) => {
                    field.onChange(data);
                    setDepartmentId(data);
                  }}
                  selected={field.value}
                  options={department ?? []}
                  getOptionLabel={(option) => option.title}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip label={option.title} {...getTagProps({index})} />
                    ))
                  }
                  renderInput={(params) => <TextField {...params} />}
                />
              )}
            />
            <p style={{fontSize: '12px', color: 'red'}}>
              {errors?.department?.message}
            </p>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              position: 'relative',
              '& > .MuiSvgIcon-root': {
                position: 'absolute',
                right: '40px',
                bottom: '13px',
              },
            }}
          >
            <label
              htmlFor={'employee'}
              style={{display: 'inline-block', marginBottom: '8px'}}
              className='input-field-labels'
            >
              Employee Name
              <span style={{color: 'red'}}>*</span>
            </label>
            <Controller
              {...register('employee', {required: 'This is a mandatory field'})}
              control={control}
              render={({field, fieldState: {error}}) => (
                <>
                  <Autocomplete
                    {...field}
                    multiple
                    onChange={(e, data, v) => {
                      field.onChange(data);
                    }}
                    selected={field.value}
                    options={employee ?? []}
                    getOptionLabel={(option) => option.title}
                    renderTags={(tagValue, getTagProps) =>
                      tagValue.map((option, index) => (
                        <Chip label={option.title} {...getTagProps({index})} />
                      ))
                    }
                    renderInput={(params) => <TextField {...params} />}
                  />
                </>
              )}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{mt: 2}}>
          <Grid item xs={6} sx={{display: 'flex', alignItems: 'center'}}>
            <Box display='flex' alignItems='center'>
              <Android12Switch
                {...register('isFrequency')}
                control={control}
                onChange={(e) => {
                  if (e.target.checked) {
                    setisFrequency(e.target.checked);
                  } else setisFrequency(false);
                }}
              />
              <span style={{marginLeft: '10px'}}>Frequency</span>
            </Box>
          </Grid>
          {isFrequency ? (
            <Grid
              item
              xs={6}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'column',
              }}
            >
              <label
                htmlFor={'frequencyTime'}
                style={{display: 'inline-block', marginBottom: '8px'}}
                className='input-field-labels'
              >
                Frequency Time (hours)
                <span style={{color: 'red'}}>*</span>
              </label>
              <TextField
                type='text'
                error={errors?.frequencyTime}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>hrs</InputAdornment>
                  ),
                }}
                {...register('frequencyTime', {
                  required: 'This is a  mandatory field',
                })}
                onInput={(e) => {
                  if (
                    !_.isNaN(Number(e?.target?.value)) &&
                    e?.target?.value?.length <= 3
                  ) {
                    setValue('frequencyTime', e?.target?.value);
                  } else {
                    setValue('frequencyTime', formData?.frequencyTime);
                  }
                }}
                style={{width: '100%'}}
              />
              <p style={{fontSize: '12px', color: 'red'}}>
                {errors?.frequencyTime?.message}
              </p>
            </Grid>
          ) : null}
        </Grid>
        <div
          item
          xs={12}
          style={{
            marginTop: '20px',
            marginBottom: '20px',
            padding: '11px',
            background: '#f6f7f9',
            fontWeight: '400',
            fontSize: '18px',
            textAlign: 'center',
          }}
        >
          <h4>Notification Type</h4>
        </div>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Box display='flex' alignItems='center'>
              <Android12Switch
                {...register('email')}
                control={control}
                onChange={(e) => {
                  if (e.target.checked) {
                    setEmailBody(e.target.checked);
                  } else setEmailBody(false);
                }}
              />
              <span style={{marginLeft: '10px'}}>Email</span>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box display='flex' alignItems='center'>
              <Android12Switch
                {...register('sms')}
                control={control}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSmsBody(true);
                  } else setSmsBody(false);
                }}
              />
              <span style={{marginLeft: '10px'}}>SMS</span>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box display='flex' alignItems='center'>
              <Android12Switch
                {...register('push_notification')}
                control={control}
                onChange={(e) => {
                  if (e.target.checked) {
                    setNotificationBody(true);
                  } else setNotificationBody(false);
                }}
              />
              <span style={{marginLeft: '10px'}}>Push</span>
            </Box>
          </Grid>
        </Grid>
        {emailBody && emailBody == true ? (
          <>
            <Grid container spacing={2}>
              <Grid item xs={4} sx={{mt: 2, mb: 2}}>
                <label>Email Body</label>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Editor
                {...register('emailmessage_Body')}
                email={email}
                type={'email'}
              />
            </Grid>
          </>
        ) : null}
        {smsbody && smsbody == true ? (
          <>
            <Grid
              item
              xs={12}
              sx={{
                mt: 2,
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'column',
              }}
            >
              <label
                htmlFor={'smsMessage'}
                style={{display: 'inline-block', marginBottom: '8px'}}
                className='input-field-labels'
              >
                SMS Body
                <span style={{color: 'red'}}>*</span>
              </label>
              <span style={{position: 'relative'}}>
                <span
                  style={{position: 'absolute', right: '5px', top: '-20px'}}
                >
                  {(formData?.smsMessage?.length || 0) +
                    '/' +
                    (Math.trunc((formData?.smsMessage?.length || 0) / 160) + 1)}
                </span>
                <TextField
                  error={errors?.smsMessage}
                  {...register('smsMessage', {
                    required: 'This is a  mandatory field',
                    maxLength: {
                      value: 500,
                      message: 'Length should be lesser than 500',
                    },
                  })}
                  multiline
                  style={{width: '100%'}}
                  maxRows={10}
                />
                <p style={{fontSize: '12px', color: 'red'}}>
                  {errors?.smsMessage?.message}
                </p>
              </span>
            </Grid>
          </>
        ) : null}
        {notificationBody && notificationBody == true ? (
          <>
            <Grid
              item
              xs={12}
              sx={{
                mt: 2,
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'column',
              }}
            >
              <label
                htmlFor={'pushNotificationMessage'}
                style={{display: 'inline-block', marginBottom: '8px'}}
                className='input-field-labels'
              >
                Push Body
                <span style={{color: 'red'}}>*</span>
              </label>
              <TextField
                error={errors?.pushNotificationMessage}
                {...register('pushNotificationMessage', {
                  required: 'This is a  mandatory field',
                  maxLength: {
                    value: 500,
                    message: 'Length should be lesser than 500',
                  },
                })}
                multiline
                style={{width: '100%'}}
                maxRows={10}
              />
              <p style={{fontSize: '12px', color: 'red'}}>
                {errors?.pushNotificationMessage?.message}
              </p>
            </Grid>
          </>
        ) : null}
        <div
          item
          xs={12}
          style={{
            marginTop: '20px',
            marginBottom: '20px',
            padding: '11px',
            background: '#f6f7f9',
            fontWeight: '400',
            fontSize: '18px',
            textAlign: 'center',
          }}
        >
          <h4>Attachments</h4>
        </div>
        <Grid container spacing={2}>
          <Grid item xs={6} style={{marginTop: '', marginBottom: '20px'}}>
            <>
              <label
                htmlFor={'banner'}
                style={{display: 'inline-block', marginBottom: '8px'}}
                className='input-field-labels'
              >
                Banner
              </label>
              <br />
              <div style={{display: 'flex', flexDirection: 'row'}}>
                <Button
                  id='btnMui123'
                  variant='contained'
                  component='label'
                  style={{
                    minHeight: '51px',
                    backgroundColor:
                      filename?.length && filename[0]?.name
                        ? '#c2c2c2'
                        : 'rgb(0, 220, 255)',
                  }}
                >
                  {(filename?.length && filename[0]?.name.slice(0, 20)) ||
                    'Upload Document'}
                  <input
                    hidden
                    accept='image/*'
                    multiple
                    type='file'
                    onChange={(e) => {
                      setFileName(e?.target?.files);
                      var image2 = document.getElementById(
                        'image' + 'image_round2',
                      );
                      image2.href = URL.createObjectURL(e.target.files[0]);
                    }}
                  />
                </Button>
                <div
                  style={{
                    cursor: 'pointer',
                    color: 'rgb(0, 220, 255)',
                    marginLeft: '15px',
                    marginTop: '10px',
                  }}
                >
                  <a
                    id={'image' + 'image_round2'}
                    target='_blank'
                    style={{
                      cursor: 'pointer',
                      color: 'rgb(0, 220, 255)',
                      marginLeft: '5px',
                      marginTop: '8px',
                    }}
                  >
                    <VisibilityIcon />
                  </a>
                </div>
              </div>
            </>
          </Grid>
          <Grid item xs={6} style={{marginBottom: '20px'}}>
            <>
              <label
                htmlFor={'siteoffice'}
                style={{display: 'inline-block', marginBottom: '8px'}}
                className='input-field-labels'
              >
                Additional Attachment
              </label>
              <br />
              <div style={{display: 'flex', flexDirection: 'row'}}>
                <Button
                  id='btnMui123'
                  variant='contained'
                  component='label'
                  style={{
                    minHeight: '51px',
                    backgroundColor:
                      filename2?.length && filename2[0]?.name
                        ? '#c2c2c2'
                        : 'rgb(0, 220, 255)',
                  }}
                >
                  {(filename2?.length && filename2[0]?.name.slice(0, 20)) ||
                    'Upload Document'}
                  <input
                    hidden
                    accept='image/*'
                    multiple
                    type='file'
                    onChange={(e) => {
                      setFileName2(e?.target?.files);
                      var image2 = document.getElementById(
                        'image' + 'image_round3',
                      );
                      image2.href = URL.createObjectURL(e.target.files[0]);
                    }}
                  />
                </Button>
                <div
                  style={{
                    cursor: 'pointer',
                    color: 'rgb(0, 220, 255)',
                    marginLeft: '15px',
                    marginTop: '10px',
                  }}
                >
                  <a
                    id={'image' + 'image_round3'}
                    target='_blank'
                    style={{
                      cursor: 'pointer',
                      color: 'rgb(0, 220, 255)',
                      marginLeft: '5px',
                      marginTop: '8px',
                    }}
                  >
                    <VisibilityIcon />
                  </a>
                </div>
              </div>
            </>
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          style={{
            marginTop: '20px',
            marginBottom: '',
            width: '100%',
            padding: '0px 0px 0px 250px',
          }}
        >
          <Button
            id='btnMui123'
            disabled={!showbtn}
            variant='contained'
            type='submit'
            style={{width: '105px'}}
          >
            Submit
          </Button>
        </Grid>
      </form>
      {!showbtn ? <AppLoader /> : null}
    </>
  );
};

export default NewAnnouncement;
