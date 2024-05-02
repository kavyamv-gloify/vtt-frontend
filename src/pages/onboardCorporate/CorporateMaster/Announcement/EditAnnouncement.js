import React, {useState, useEffect} from 'react';
import {alpha, styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import Editor from './dummyckeditor';
import {Button, MenuItem} from '@mui/material';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';
import {useAuthUser} from '@crema/utility/AuthHooks';
import Api from '@api';
import {useForm, Controller, useWatch} from 'react-hook-form';
import Select from '@mui/material/Select';
import {getFormData} from '@hoc';
import VisibilityIcon from '@mui/icons-material/Visibility';
import downDoc from '@common/fileDownload';
import {toast} from 'react-toastify';
import moment from 'moment';

const EditAnnouncement = ({id, close, copy, closeDetail}) => {
  const {user} = useAuthUser();
  const [sitoffice, setSiteOffice] = useState([]);
  const [department, setDepartment] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [officeId, setOfficeId] = useState();
  const [departmentId, setDepartmentId] = useState();
  const [data, setData] = useState({});
  const [emailMessage, setEmailMessage] = useState();
  const [checkpush, setCheckpush] = useState();
  const [checksms, setChecksms] = useState();
  const [checkEmail, setCheckEmail] = useState();
  const [isFrequency, setisFrequency] = useState(false);
  const [filename, setFileName] = useState();
  const [newFileName, setNewFileName] = useState('');
  const [filename2, setFileName2] = useState();
  const [newFileName2, setNewFileName2] = useState();
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

  const {
    register,
    formState: {errors},
    handleSubmit,
    watch,
    reset,
    control,
    getValues,
    setValue,
  } = useForm({mode: 'onTouched'});
  const formData = useWatch({control, defaultValue: 'default'});
  useEffect(() => {
    axios
      .get(Api.baseUri + '/user-reg/announcement/getbyid/' + id)
      .then((res) => {
        let department = [];
        res?.data?.data?.departmentIds?.map((d, ind) => {
          department.push({
            value: d,
            title: res?.data?.data?.departmentNames[ind],
          });
        });
        let siteoffice = [];
        res?.data?.data?.siteOfficeIds?.map((d, ind) => {
          siteoffice.push({
            value: d,
            title: res?.data?.data?.siteOfficeNames[ind],
          });
        });
        let employee = [];
        res?.data?.data?.employeeIds?.map((d, ind) => {
          employee.push({title: res?.data?.data?.employeeNames[ind], value: d});
        });
        setData({
          ...res?.data?.data,
          description: res?.data?.data?.summary,
          siteoffice: siteoffice,
          department: department,
          employee: employee,
        });
        // reset({...res?.data?.data, siteoffice: siteoffice, department: department, employee: employee })
        setFileName(res?.data?.data?.image);
        setFileName2(res?.data?.data?.banner);
        setCheckpush(res?.data?.data?.pushNotification);
        setChecksms(res?.data?.data?.sendSMS);
        setCheckEmail(res?.data?.data?.sendEmail);
        setisFrequency(res?.data?.data?.isFrequency);
      });
  }, [id]);

  useEffect(() => {
    reset(data);
  }, [data]);

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
          '/user-reg/department/null/employeeId/' +
          user?.userList?.corporateId +
          '/corporateId?page=0&size=10',
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
          (data?.departmentIds || temp_dept),
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
  }, [departmentId, officeId, data]);

  useEffect(() => {
    getSiteoffice();
    getDepartment();
    // getEmployee();
  }, [user?.userList]);

  const onSubmit = (datas) => {
    let postData = {};
    postData = datas;
    let sitearray = [];
    let sitearrayid = [];
    let departmentarray = [];
    let departmentId = [];
    let employeearray = [];
    let employeeId = [];
    let tempdata = {
      id: copy !== 'copy' ? id : null,
      emailMessage: emailMessage,
      smsMessage: data?.smsMessage,
      pushNotificationMessage: postData?.pushNotificationMessage,
      title: postData?.title,
      summary: postData?.description,
      date: postData?.date,
      status: 'ACTIVE',
      announcemnetType: postData?.announcemnetType,
      endDate: postData?.endDate,
      endTime: postData?.endTime,
      frequencyTime: postData?.frequencyTime,
      smsMessage: postData?.smsMessage,
      startDate: postData?.startDate,
      startTime: postData?.startTime,
      createdBy: postData?.createdBy,
      createdOn: postData?.createdOn,
      status: 'ACTIVE',
      corporateId: user?.userList?.corporateId,
    };

    tempdata.sendEmail = checkEmail;
    tempdata.sendSMS = checksms;
    tempdata.pushNotification = checkpush;
    if (filename?.length > 0) {
      tempdata.image = filename;
    } else tempdata.image = newFileName;
    if (filename2?.length > 0) {
      tempdata.banner = filename2;
    } else tempdata.banner = newFileName2;
    if (data?.departmentIds && data?.departmentNames) {
      tempdata.departmentNames = data?.departmentNames;
      tempdata.departmentIds = data?.departmentIds;
    }
    if (data?.employeeIds && data?.employeeNames) {
      tempdata.employeeNames = data?.employeeNames;
      tempdata.employeeIds = data?.employeeIds;
    }
    if (data?.siteOfficeIds && data?.siteOfficeNames) {
      tempdata.siteOfficeNames = data?.siteOfficeNames;
      tempdata.siteOfficeIds = data?.siteOfficeIds;
    }
    if (postData?.siteOffice?.length) {
      postData?.siteoffice?.map((e) => {
        sitearray.push(e?.title);
        sitearrayid.push(e?.value);
      });
      tempdata.siteOfficeNames = sitearray;
      tempdata.siteOfficeIds = sitearrayid;
    }
    if (postData?.employee?.length) {
      postData?.employee?.map((e) => {
        employeearray.push(e?.title);
        employeeId.push(e?.value);
      });
      tempdata.employeeNames = employeearray;
      tempdata.employeeIds = employeeId;
    }
    if (postData?.department?.length) {
      postData?.department?.map((e) => {
        departmentarray.push(e?.title);
        departmentId.push(e?.value);
      });
      tempdata.departmentNames = departmentarray;
      tempdata.departmentIds = departmentId;
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
      method: copy == 'copy' ? 'post' : 'put',
      url: copy == 'copy' ? Api.announcement.create : Api.announcement.update,
      data: getFormData(dataSet),
      headers: {'Content-Type': 'multipart/form-data'},
    })
      .then(function (response) {
        if (response?.data?.status == '200') {
          copy == 'copy'
            ? toast.success('Announcement copied successfully')
            : toast.success('Announcement edited successfully');
          copy == 'copy' ? closeDetail() : close();
        } else {
          toast.error(response?.data?.message ?? 'Something went wrong');
        }
      })
      .catch(function (response) {
        toast.error('Something went wrong');
      });
  };
  const email = (d) => {
    setEmailMessage(d);
  };

  return (
    <>
      {data && data?.employee && (
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
                    Announcement type
                    <span style={{color: 'red'}}>*</span>
                  </label>
                  <Select
                    labelId='demo-simple-select-label'
                    defaultValue={data?.announcemnetType}
                    id='announcementType'
                    error={errors?.announcementType}
                    {...register('announcemnetType', {
                      required: 'This is a mandatory field',
                    })}
                  >
                    <MenuItem value={'ERROR'}>Error Announcement</MenuItem>
                    <MenuItem value={'WARNING'}>Warning Announcement</MenuItem>
                    <MenuItem value={'INFO'}>Info Announcement</MenuItem>
                    <MenuItem value={'SUCCESS'}>Success Announcement</MenuItem>
                  </Select>
                  <p style={{fontSize: '12px', color: 'red'}}>
                    {errors?.announcementType?.message}
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
                    htmlFor={'title'}
                    style={{display: 'inline-block', marginBottom: '8px'}}
                    className='input-field-labels'
                  >
                    Title
                    <span style={{color: 'red'}}>*</span>
                  </label>
                  <TextField
                    error={errors?.title}
                    defaultValue={data?.title}
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
                    inputProps={{
                      min: moment().format('YYYY-MM-DD'),
                    }}
                    defaultValue={data?.startDate}
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
                    defaultValue={data?.endDate}
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
                    defaultValue={data?.startTime}
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
                    defaultValue={data?.endTime}
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
                defaultValue={data?.summary}
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
                marginTop: '20px',
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
                defaultValue={data?.siteoffice}
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
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        onInput={() => {
                          let temparr = [];
                          let tem_arr = formData?.siteOffice ?? [];
                          tem_arr = tem_arr.concat(data?.siteoffice);
                          sitoffice.map((e) => {
                            if (tem_arr?.length) {
                              tem_arr?.map((elem) => {
                                if (elem.value != e?.id) {
                                  temparr.push({
                                    title: e?.officeName,
                                    value: e?.id,
                                  });
                                }
                              });
                            }
                          });
                        }}
                      />
                    )}
                  />
                )}
              />
              <p style={{fontSize: '12px', color: 'red'}}>
                {errors?.siteoffice?.message}
              </p>
            </Grid>
            <Grid item xs={12} style={{marginTop: '20px'}}>
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
                defaultValue={data?.department}
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
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        onInput={() => {
                          let temparr = [];
                          let tem_arr = formData?.department ?? [];
                          department.map((e) => {
                            if (tem_arr?.length) {
                              tem_arr?.map((elem) => {
                                if (elem.value != e?.id) {
                                  temparr.push({
                                    title: e?.departmentName,
                                    value: e?.id,
                                  });
                                }
                              });
                            } else {
                              temparr.push({
                                title: e?.departmentName,
                                value: e?.id,
                              });
                            }
                          });
                          temparr = [...tem_arr, ...temparr];
                          setDepartment(temparr);
                        }}
                      />
                    )}
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
                {...register('employee', {
                  required: 'This is a mandatory field',
                })}
                control={control}
                render={({field, fieldState: {error}}) => (
                  <>
                    <Autocomplete
                      {...field}
                      multiple
                      defaultValue={data?.employee}
                      onChange={(e, data, v) => {
                        field.onChange(data);
                      }}
                      selected={field.value}
                      options={employee ?? []}
                      getOptionLabel={(option) => option.title}
                      renderTags={(tagValue, getTagProps) =>
                        tagValue.map((option, index) => (
                          <Chip
                            label={option.title}
                            {...getTagProps({index})}
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          // onInput={() => {
                          //     let temparr = []
                          //     let tem_arr = formData?.employee ?? [];

                          //     employee.map((e) => {
                          //         if (tem_arr?.length) {
                          //             tem_arr?.map(elem => {
                          //                 if (elem.value != e?.id) {
                          //                     temparr.push({ title: e?.employeeFullName, value: e?.id })
                          //                 }
                          //             })
                          //         }
                          //         else {
                          //             temparr.push({ title: e?.employeeFullName, value: e?.id })
                          //         }
                          //     })
                          //     temparr = [...tem_arr, ...temparr]

                          //     setEmployee(temparr);
                          // }}
                        />
                      )}
                    />
                  </>
                )}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} style={{marginTop: '15px'}}>
            <Grid item xs={6}>
              <Box display='flex' alignItems='center'>
                <Android12Switch
                  checked={isFrequency}
                  onChange={(e) => {
                    setisFrequency(e.target.checked);
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
                  defaultValue={data?.frequencyTime}
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
                  checked={checkEmail}
                  onChange={(e) => {
                    setCheckEmail(e.target.checked);
                  }}
                />
                <span style={{marginLeft: '10px'}}>Email</span>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box display='flex' alignItems='center'>
                <Android12Switch
                  checked={checksms}
                  onChange={(e) => {
                    setChecksms(e.target.checked);
                  }}
                />
                <span style={{marginLeft: '10px'}}>SMS</span>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box display='flex' alignItems='center'>
                <Android12Switch
                  checked={checkpush}
                  onChange={(e) => {
                    setCheckpush(e.target.checked);
                  }}
                />
                <span style={{marginLeft: '10px'}}>Push</span>
              </Box>
            </Grid>
          </Grid>
          {checkEmail ? (
            <>
              <Grid container spacing={2}>
                <Grid item xs={4} sx={{mt: 2, mb: 2}}>
                  <label>Email Body</label>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Editor email={email} type={'email'} id={data?.id} />
              </Grid>
            </>
          ) : null}
          {checksms ? (
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
                      (Math.trunc((formData?.smsMessage?.length || 0) / 160) +
                        1)}
                  </span>
                  <TextField
                    defaultValue={data?.smsMessage}
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
          {checkpush ? (
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
                  defaultValue={data?.pushNotificationMessage}
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
          {/* -----------------------------------------------Banner Name ------------------------------------------------------------------- */}
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
                        (filename2?.length && filename2) ||
                        (newFileName2?.length && newFileName2[0]?.name)
                          ? '#c2c2c2'
                          : 'rgb(0, 220, 255)',
                    }}
                  >
                    {(filename2?.length
                      ? filename2?.slice(0, 20)
                      : newFileName2?.[0]?.name
                    )?.slice(0, 20) || 'Upload Document'}
                    <input
                      hidden
                      accept='image/*'
                      multiple
                      type='file'
                      onChange={(e) => {
                        setFileName2('');
                        setNewFileName2(e?.target?.files);
                      }}
                    />
                  </Button>
                  {filename2 && (
                    <div
                      style={{
                        cursor: 'pointer',
                        color: 'rgb(0, 220, 255)',
                        marginLeft: '15px',
                        marginTop: '8px',
                      }}
                    >
                      <VisibilityIcon
                        onClick={() => {
                          if (filename2?.length) downDoc?.openDoc(filename2);
                        }}
                      />
                    </div>
                  )}
                  {newFileName2 && (
                    <a
                      id={'image'}
                      href={URL.createObjectURL(newFileName2[0])}
                      target='_blank'
                      style={{
                        cursor: 'pointer',
                        color: 'rgb(0, 220, 255)',
                        marginLeft: '15px',
                        marginTop: '8px',
                      }}
                    >
                      <VisibilityIcon />
                    </a>
                  )}
                </div>
              </>
            </Grid>
            {/* -----------------------------------------------Additional Attachement ------------------------------------------------------------------- */}
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
                        (filename?.length && filename) ||
                        (newFileName?.length && newFileName[0]?.name)
                          ? '#c2c2c2'
                          : 'rgb(0, 220, 255)',
                    }}
                  >
                    {(filename?.length
                      ? filename?.slice(0, 20)
                      : newFileName[0]?.name
                    )?.slice(0, 20) || 'Upload Document'}
                    <input
                      hidden
                      accept='image/*'
                      multiple
                      type='file'
                      onChange={(e) => {
                        setFileName('');
                        setNewFileName(e?.target?.files);
                        var image2 = document.getElementById(
                          'image' + 'image_round3',
                        );
                        image2.href = URL.createObjectURL(e.target.files[0]);
                      }}
                    />
                  </Button>
                  {filename && (
                    <div
                      style={{
                        cursor: 'pointer',
                        color: 'rgb(0, 220, 255)',
                        marginLeft: '15px',
                        marginTop: '8px',
                      }}
                    >
                      <VisibilityIcon
                        onClick={() => {
                          if (filename?.length) downDoc?.openDoc(filename);
                        }}
                      />
                    </div>
                  )}
                  {newFileName && (
                    <a
                      id={'image'}
                      href={URL.createObjectURL(newFileName[0])}
                      target='_blank'
                      style={{
                        cursor: 'pointer',
                        color: 'rgb(0, 220, 255)',
                        marginLeft: '15px',
                        marginTop: '8px',
                      }}
                    >
                      <VisibilityIcon />
                    </a>
                  )}
                </div>
              </>
            </Grid>
          </Grid>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '20px',
            }}
          >
            <Button
              id='btnMui123'
              onClick={() => {}}
              variant='contained'
              type='submit'
              style={{width: '105px'}}
            >
              {copy == 'copy' ? 'Submit' : 'Update'}
            </Button>
          </div>
        </form>
      )}
    </>
  );
};

export default EditAnnouncement;
