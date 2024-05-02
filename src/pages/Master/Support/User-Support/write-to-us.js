import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {Button, FormHelperText, Grid} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';
import {useAuthUser} from '@crema/utility/AuthHooks';
import Api from '@api';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import TimeToLeaveIcon from '@mui/icons-material/TimeToLeave';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import moment from 'moment';
import Chip from '@mui/material/Chip';
import {useForm, Controller, useWatch} from 'react-hook-form';
import {getFormData} from '@hoc';
import Editor from './Email';
const Account = ({TabVal}) => {
  const {user} = useAuthUser();

  const navigate = useNavigate();
  const [val, setVal] = useState({isRide: 'NO'});
  const [topicList, settopicList] = useState();
  const [subTopicList, setSubTopicList] = useState();
  const [openDialog, setOpenDialog] = useState(false);
  const [data, setData] = useState();
  const [tripId, setTripId] = useState();
  const [showTrip, setShowTrip] = useState(false);
  const [files, setFiles] = useState();
  const [emailMessage, setEmailMessage] = useState();
  const {
    register,
    formState: {errors},
    handleSubmit,
    watch,
    control,
    getValues,
    setValue,
  } = useForm({mode: 'onTouched'});

  useEffect(() => {
    axios
      .get(
        Api.baseUri +
          '/user-reg/helpmaster/getAll?page=0&size=1000&topicName=null&type=EMPLOYEE',
      )
      .then((res) => {
        let temp = [];
        res?.data?.data?.body?.HelpTopicList?.map((el) => {
          temp.push({title: el?.topicName, value: el?.id});
        });
        settopicList(temp ?? []);
      })
      .catch((err) => {
        settopicList([]);
      });
  }, []);

  useEffect(() => {}, [val]);

  useEffect(() => {}, [files]);

  useEffect(() => {
    axios
      .get(Api.baseUri + '/user-reg/trip-driver/employee-trips/past')
      .then((res) => {
        setData(res?.data?.data);
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {
    if (!val?.isRide) {
      return;
    }
    if (val?.isRide == 'YES') {
      setOpenDialog(true);
    } else {
      setOpenDialog(false);
      setShowTrip(false);
    }
  }, [val?.isRide]);

  const getFileName = async (dataSet) => {
    let temp = await axios({
      method: 'post',
      url: Api.baseUri + '/user-reg/ticket/save-file',
      data: getFormData(dataSet),
      headers: {'Content-Type': 'multipart/form-data'},
    });

    return temp?.data?.data?.documentName;
  };
  async function onSubmit(vals) {
    let myFileName = '';
    if (files) {
      let dataSet = {};
      let allElem = {};
      let tempdata = {photo: [files]};
      Object.keys(tempdata).map((key) => {
        if (typeof tempdata[key]?.[0]?.name == 'string') {
          dataSet = {
            ...dataSet,
            [key]: tempdata[key][0],
          };
        }
      });

      myFileName = await getFileName(dataSet); // please use this variable for file in new request message object.
    }

    let postData = {
      userrole: user?.role,
      topicId: vals?.topicId?.value,
      topicName: vals?.topicId?.title,
      subTopicId: vals?.subTopicId?.value,
      subTopicName: vals?.subTopicId?.title,
      tripDate: moment(new Date()).format('YYYY-MM-DD'),
      // "assignedTo": "Som",
      // "raisedBy": "Manager",
      tripId: val?.tripId,
      employeeId: user?.userList?.profileId,
      subject: vals?.subject,
      requestMsg: [
        {
          fileImg: myFileName,
          userName: user?.userList?.userName,
          userId: user?.uid,
          msg: emailMessage,
          profileImg: user?.userList?.profilePhoto,
          userRole: user?.userList?.userRole,
        },
      ],
      // "responceMsg": [
      //     "abc"
      // ],
      tanentId: user?.userList?.tanentId,
      corporateId: user?.userList?.corporateId,
      personContactno: user?.userList?.mobileNo,
      personEmailId: user?.userList?.emailId,
      status: 'PENDING',
      // "roasterRequest": "NO",
      // "assignedOn": "",
      isRide: val?.isRide,
    };
    console.log(postData);

    axios
      .post(Api.baseUri + '/user-reg/ticket', postData)
      .then((res) => {
        if (res?.data?.status == '200') {
          toast.success('Request Raised Succefully');
          navigate('/user/my-complaints');
        } else {
          toast.error('Something went Wrong');
        }
      })
      .catch((err) => {});
  }

  useEffect(() => {
    axios
      .get(
        Api.baseUri + '/user-reg/subtopiccontroller/' + val?.topic + '/helpid',
      )
      .then((res) => {
        let temp = [];
        res?.data?.data?.map((el) => {
          temp.push({title: el?.subTopicName, value: el?.id});
        });
        setSubTopicList(temp ?? []);
      })
      .catch((err) => {
        setSubTopicList([]);
      });
  }, [val?.topic]);
  const email = (d) => {
    console.log('d', d);
    setEmailMessage(d);
  };
  return (
    <>
      <h2 style={{padding: '4px 0px 0px 0px'}}>{TabVal?.name}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container sx={{marginTop: '20px'}}>
          <Grid item md={6} sx={{paddingLeft: '30px'}}>
            <h4 style={{fontSize: '15px', marginBottom: '10px'}}>
              Topics <span style={{color: 'red'}}>*</span>
            </h4>
            <Controller
              error={errors?.topicId}
              helperText={errors?.topicId?.message}
              name='topicId'
              rules={{required: 'This is a  mandatory field'}}
              control={control}
              render={({field}) => (
                <Autocomplete
                  {...field}
                  onChange={(e, data) => {
                    field.onChange(data);
                    setVal({...val, topic: data.value});
                  }}
                  selected={field.value}
                  options={topicList ?? []}
                  getOptionLabel={(option) => option.title}
                  sx={{width: '100%', marginBottom: '10px'}}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip label={option.title} {...getTagProps({index})} />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={errors?.topicId}
                      helperText={errors?.topicId?.message}
                    />
                  )}
                />
              )}
            />
          </Grid>
          <Grid item md={6} sx={{paddingLeft: '30px'}}>
            <h4 style={{fontSize: '15px', marginBottom: '10px'}}>
              Sub-Topics <span style={{color: 'red'}}>*</span>
            </h4>
            <Controller
              name='subTopicId'
              rules={{required: 'This is a  mandatory field'}}
              control={control}
              render={({field}) => (
                <>
                  <Autocomplete
                    {...field}
                    onChange={(e, data) => {
                      field.onChange(data);
                      setVal({...val, subTopic: data.value});
                    }}
                    selected={field.value}
                    error={errors?.subTopicId}
                    helperText={errors?.subTopicId?.message}
                    options={subTopicList ?? []}
                    sx={{width: '100%', marginBottom: '10px'}}
                    getOptionLabel={(option) => option.title}
                    renderTags={(tagValue, getTagProps) =>
                      tagValue.map((option, index) => (
                        <Chip label={option.title} {...getTagProps({index})} />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={errors?.subTopicId}
                        helperText={errors?.subTopicId?.message}
                      />
                    )}
                  />
                </>
              )}
            />
          </Grid>
          <Grid item md={6} sx={{paddingLeft: '30px'}}>
            <h4 style={{fontSize: '15px', marginBottom: '10px'}}>E-mail</h4>
            <TextField
              id='outlined-basic'
              value={user?.userList?.emailId}
              sx={{width: '100%', marginBottom: '10px'}}
              disabled
            />
          </Grid>
          <Grid item md={6} sx={{paddingLeft: '30px'}}>
            <h4 style={{fontSize: '15px', marginBottom: '10px'}}>
              Phone-Number
            </h4>
            <TextField
              id='outlined-basic'
              value={user?.userList?.mobileNo}
              sx={{width: '100%', marginBottom: '10px'}}
              disabled
            />
          </Grid>
          <Grid item md={6} sx={{paddingLeft: '30px'}}>
            <h4 style={{fontSize: '15px', marginBottom: '10px'}}>
              Subject <span style={{color: 'red'}}>*</span>
            </h4>
            <TextField
              sx={{width: '100%'}}
              // id="outlined-basic" sx={{ width: '100%', marginBottom: "10px" }} required onChange={(e) => { setVal({ ...val, subject: e.target.value }) }}
              error={errors?.subject}
              helperText={errors?.subject?.message}
              {...register('subject', {
                required: 'This is a mandatory field',
                maxLength: {
                  value: 250,
                  message: 'Length should be lesser than 250',
                },
              })}
            />
          </Grid>
          <Grid item md={12} sx={{paddingLeft: '30px', marginTop: '10px'}}>
            <h4 style={{fontSize: '15px', marginBottom: '10px'}}>
              Detail <span style={{color: 'red'}}>*</span>
            </h4>
            <Editor
              {...register('emailmessage_Body')}
              email={email}
              type={'email'}
            />
          </Grid>
          <Grid
            xs={12}
            sx={{paddingLeft: '30px', marginTop: '10px', marginBottom: '10px'}}
          >
            <Button
              id='btnMui123'
              variant='contained'
              component='label'
              style={{minHeight: '51px', background: files ? '#c2c2c2' : ' '}}
            >
              {files?.name || ' Upload Document'}
              <input
                hidden
                accept='image/*'
                multiple
                type='file'
                onChange={(e) => {
                  setFiles(e?.target?.files[0]);
                }}
              />
            </Button>
          </Grid>
          <Grid item xs={6} sx={{paddingLeft: '30px'}}>
            <RadioGroup
              aria-labelledby='demo-radio-buttons-group-label'
              defaultValue='NO'
              onChange={(e, v) => {
                setVal({...val, isRide: v});
              }}
              name='radio-buttons-group'
            >
              <FormControlLabel
                value='YES'
                control={<Radio />}
                label='I have an issue with a ride'
              />
              <FormControlLabel
                value='NO'
                control={<Radio />}
                label='I have an issue not related to a ride'
              />
            </RadioGroup>
          </Grid>
          {showTrip && (
            <Grid container sx={{marginTop: '10px'}}>
              <Grid
                item
                xs={12}
                sx={{
                  background: 'white',
                  boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    padding: '20px',
                  }}
                >
                  <div
                    style={{
                      marginLeft: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <div
                      style={{
                        width: '100px',
                        height: '10px',
                        fontSize: '12px',
                        marginBottom: '10px',
                      }}
                    >
                      <span
                        style={{
                          background:
                            data[tripId]?.status == 'CANCLED' ||
                            data[tripId]?.status == 'NOSHOW' ||
                            data[tripId]?.status == 'ABSENT'
                              ? 'orange'
                              : data[tripId]?.status == 'SCHEDULE'
                              ? 'red'
                              : data[tripId]?.status == 'BOARDED'
                              ? '#063f5b'
                              : data[tripId]?.status == 'COMPLETED'
                              ? 'green'
                              : 'grey',
                          padding: '4px',
                          borderRadius: '5px',
                          color: 'white',
                          fontWeight: '600',
                          fontSize: '10px',
                        }}
                      >
                        {data[tripId]?.status == 'CANCLED'
                          ? 'CANCELLED'
                          : data[tripId]?.status}
                      </span>
                    </div>
                    <h5 style={{fontWeight: '700'}}>
                      {moment(data[tripId]?.actualPickUpDateTimeStr).format(
                        'llll',
                      )}
                    </h5>
                    <h5>
                      {'Trip Code: ' +
                        data[tripId]?.tripCode +
                        ',' +
                        ' Driver Name: ' +
                        data[tripId]?.driverName +
                        ',' +
                        ' Vehicle Number: ' +
                        data[tripId]?.vehicleNumber}
                    </h5>
                    <h5>{data[tripId]?.vehicleNumber}</h5>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        marginTop: '10px',
                      }}
                    >
                      <div
                        style={{
                          color: 'orange',
                          paddingLeft: '7px',
                          display: 'flex',
                          flexDirection: 'row',
                        }}
                      >
                        <div>
                          {' '}
                          <FiberManualRecordIcon sx={{fontSize: '10px'}} />{' '}
                        </div>
                        <p style={{paddingLeft: '20px', color: 'grey'}}>
                          {data[tripId]?.tripType == 'UPTRIP'
                            ? data[tripId]?.location?.locName
                            : data[tripId]?.officeLocation?.locName}
                        </p>
                      </div>
                      <div>
                        <MoreVertIcon />
                      </div>
                      <div
                        style={{
                          color: 'green',
                          paddingLeft: '7px',
                          display: 'flex',
                          flexDirection: 'row',
                        }}
                      >
                        <div>
                          <FiberManualRecordIcon sx={{fontSize: '10px'}} />
                        </div>
                        <p style={{paddingLeft: '20px', color: 'grey'}}>
                          {data[tripId]?.tripType == 'DOWNTRIP'
                            ? data[tripId]?.officeLocation?.locName
                            : data[tripId]?.location?.locName}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid
                item
                xs={12}
                sx={{
                  background: 'white',
                  boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                  padding: '10px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setOpenDialog(true);
                  }}
                >
                  <h3 style={{fontSize: '15px', fontWeight: '300'}}>
                    Select Another Trip
                  </h3>
                </div>
              </Grid>
            </Grid>
          )}
          <Grid item xs={12} sx={{marginTop: '20px'}}>
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <Button
                id='btnMui123'
                type='submit'
                variant='contained'
                onClick={() => {}}
              >
                Submit
              </Button>
            </div>
          </Grid>
        </Grid>
      </form>

      <Dialog
        open={openDialog}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '50%',
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
              }}
            >
              <h1 style={{marginTop: '1.5rem'}}>Trip Lisiting</h1>
              <CloseIcon
                onClick={() => {
                  setOpenDialog(false);
                }}
                style={{
                  marginTop: '1.4rem',
                  color: '#4f4f4f',
                  fontWeight: 'bold',
                }}
              />
            </div>

            <div style={{padding: '1rem'}}>
              <Grid container sx={{marginTop: '20px'}}>
                {data?.map((el, index) => {
                  return (
                    <Grid
                      item
                      xs={12}
                      sx={{
                        background: 'white',
                        padding: '20px',
                        boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                        marginBottom: '20px',
                      }}
                      onClick={() => {
                        setOpenDialog(false);
                        setTripId(index);
                        setShowTrip(true);
                        setVal({...val, tripId: el?.tripId});
                      }}
                    >
                      <div style={{display: 'flex', flexDirection: 'row'}}>
                        <div>
                          <TimeToLeaveIcon />
                        </div>
                        <div
                          style={{
                            marginLeft: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          {/* <h5 style={{ fontWeight: "700" }}>Mon, Feb 13, 07:15 PM</h5> */}
                          <div
                            style={{
                              width: '100px',
                              height: '10px',
                              fontSize: '12px',
                              marginBottom: '10px',
                            }}
                          >
                            <span
                              style={{
                                background:
                                  el?.status == 'CANCLED' ||
                                  el?.status == 'NOSHOW' ||
                                  el?.status == 'ABSENT'
                                    ? 'orange'
                                    : el?.status == 'SCHEDULE'
                                    ? 'red'
                                    : el?.status == 'BOARDED'
                                    ? '#063f5b'
                                    : el?.status == 'COMPLETED'
                                    ? 'green'
                                    : 'grey',
                                padding: '4px',
                                borderRadius: '5px',
                                color: 'white',
                                fontWeight: '600',
                                fontSize: '10px',
                              }}
                            >
                              {el.status == 'CANCLED'
                                ? 'CANCELLED'
                                : el?.status}
                            </span>
                          </div>
                          <h5 style={{fontWeight: '700'}}>
                            {moment(el?.actualPickUpDateTimeStr).format('llll')}
                          </h5>
                          <h5>
                            {'Trip Code: ' +
                              el?.tripCode +
                              ',' +
                              ' Driver Name: ' +
                              el?.driverName +
                              ',' +
                              ' Vehicle Number: ' +
                              el?.vehicleNumber}
                          </h5>
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              marginTop: '10px',
                            }}
                          >
                            <div
                              style={{
                                color: 'orange',
                                paddingLeft: '7px',
                                display: 'flex',
                                flexDirection: 'row',
                              }}
                            >
                              <div>
                                {' '}
                                <FiberManualRecordIcon
                                  sx={{fontSize: '10px'}}
                                />{' '}
                              </div>
                              <p style={{paddingLeft: '20px', color: 'grey'}}>
                                {el?.tripType == 'UPTRIP'
                                  ? el?.location?.locName
                                  : el?.officeLocation?.locName}
                              </p>
                            </div>
                            <div>
                              <MoreVertIcon />
                            </div>
                            <div
                              style={{
                                color: 'green',
                                paddingLeft: '7px',
                                display: 'flex',
                                flexDirection: 'row',
                              }}
                            >
                              <div>
                                <FiberManualRecordIcon
                                  sx={{fontSize: '10px'}}
                                />
                              </div>
                              <p style={{paddingLeft: '20px', color: 'grey'}}>
                                {el?.tripType == 'UPTRIP'
                                  ? el?.officeLocation?.locName
                                  : el?.location?.locName}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Grid>
                  );
                })}
              </Grid>
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </>
  );
};

export default Account;
