import React, {useState, useEffect, createRef} from 'react';
import {useNavigate} from 'react-router-dom';
import SmartForm from '@smart-form';
import {useAuthUser} from '@crema/utility/AuthHooks';
import AppLoader from '@crema/core/AppLoader';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import {makeStyles} from '@mui/styles';
import Pagination from '@mui/material/Pagination';
import RouteList from './table';
import CustomLabel from 'pages/common/CustomLabel';
import {Button, Tooltip, Checkbox, Grid} from '@mui/material';
import Box from '@mui/material/Box';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import UploadSection from './upload-section';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';
import FilterPop from '@filter-pop';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import axios from 'axios';
import Api from '@api';
import {toast} from 'react-toastify';
import regex from '@regex';
import excelDoc from '@excelupload/excelupload';
import DeleteIcon from '@mui/icons-material/Delete';
import Confirm from '@confirmation-box';
import moment from 'moment';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import GroupsIcon from '@mui/icons-material/Groups';
import AppTooltip from '@crema/core/AppTooltip';
// import ImageFunction from '../Snapshot/index'
import MapSnapShot from '../Snapshot/tripSnapshot';
import '../index.css';
import {useScreenshot} from 'use-react-screenshot';
import getStaticGmapURLForDirection from '../Snapshot/tripSnapshot';
import {useSelector} from 'react-redux';
const weekAr = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const weeks = [
  {title: 'Sunday', value: 'SUN'},
  {title: 'Monday', value: 'MON'},
  {title: 'Tuesday', value: 'TUE'},
  {title: 'Wednesday', value: 'WED'},
  {title: 'Thursday', value: 'THU'},
  {title: 'Friday', value: 'FRI'},
  {title: 'Saturday', value: 'SAT'},
];
const CustomExpandIcon = ({opacity}) => {
  return (
    <Box
      sx={{
        '.Mui-expanded & > .collapsIconWrapper': {
          display: 'none',
        },
        '.expandIconWrapper': {
          display: 'none',
        },
        '.Mui-expanded & > .expandIconWrapper': {
          display: 'block',
        },
      }}
    >
      <div className='expandIconWrapper'>
        <IndeterminateCheckBoxOutlinedIcon style={{color: '#407999'}} />
      </div>
      <div className='collapsIconWrapper'>
        <AddBoxOutlinedIcon style={{color: '#407999', opacity: opacity}} />
      </div>
    </Box>
  );
};
const MasterRoutes = () => {
  const navigate = useNavigate();
  const {user} = useAuthUser();
  const [myActions, setMyActions] = React.useState([]);
  const permissionCheck = useSelector(({settings}) => settings.permissions);
  React.useEffect(() => {
    if (!permissionCheck) return;
    let sub_mod = {};
    permissionCheck?.map((el) => {
      if (el.subModuleName == 'Route Master') sub_mod = el;
    });
    setMyActions(sub_mod?.actions);
    if (
      (!sub_mod || !sub_mod?.actions?.includes('View')) &&
      user?.userList?.userRole !== 'SUPERADMIN'
    )
      navigate('/error-pages/error-404');
  }, [permissionCheck, user]);
  const [showbtn, setshowbtn] = React.useState(true);
  const [fileName, setFileName] = useState('');
  const [mrouteId, setMrouteId] = useState('');
  const [masterRouteId, setMasterRouteId] = useState('');
  const [formData, setformData] = useState({});
  const [masterData, setMastderData] = useState([]);
  const [childData, setChildData] = useState([
    {id: 1, childid: 1, name: 'abc'},
    {id: 2, childid: 2, name: 'xyz'},
    {id: 3, childid: 2, name: 'efg'},
  ]);
  const itemsPerPage = 10;
  const [page, setPage] = React.useState(1);
  const [totalCount, settotalCount] = React.useState(1);
  const [open, setOpen] = React.useState(false);
  const [chartData, setChartData] = React.useState([]);
  const [openFilter, setOpenFilter] = React.useState(false);
  const [disableDown, setDisableDown] = React.useState(false);
  const [openConfirmbox, setOpenConfirmBox] = useState(false);
  const [deleteConfirmbox, setDeleteConfirmbox] = useState(false);
  const [selectedAccord, setSelectedAccord] = React.useState([]);
  const [copyErrorMsg, setCopyErrorMsg] = React.useState('');
  const [openConfirmboxCopy, setOpenConfirmboxCopy] = React.useState(false);
  const [deleteEmpId, setDeleteEmpId] = React.useState([]);
  const [holidayArr, setHolidayArr] = React.useState([]);
  const [formDates, setformDates] = React.useState();
  const [myFinalDateArr, setmyFinalDateArr] = React.useState();
  const [clickMe, setClickMe] = useState(false);
  const [curtResponse, setCurtResponse] = useState();
  const [image, takeScreenShot] = useScreenshot();
  const [showIamge, setShowImage] = useState();
  const ref = createRef(null);
  const [mapPosition, setMapPosition] = useState();
  const [imageSource, setImageSource] = useState();
  const [count, setCount] = useState(0);
  const [passenger, setPassenger] = useState();
  const getImage = () => {
    takeScreenShot(ref.current);
    setShowImage(true);
  };

  function onChangeVal(v) {
    if (v?.fromDate != formDates?.fromdate || v?.toDate != formDates?.todate) {
      getHolidays(v?.fromDate, v?.toDate);
      setformDates({fromdate: v?.fromDate, todate: v?.toDate});
    }
  }
  function getFinalDates(dateArr, holiday, weekOffs) {
    let temDateArr = [];
    dateArr?.map((el, ind) => {
      if (
        !weekOffs?.includes(weekAr[new Date(el).getDay()]) &&
        !holiday?.includes(el)
      ) {
        temDateArr.push(el);
      }
    });
    return temDateArr;
  }
  function getHolidays(temfrom, temto) {
    axios
      .get(Api?.holiday?.holidayList)
      .then((re) => {
        //+res?.data?.data?.body['SiteOffice List'][0]?.id+'/office'
        let arr = [];
        re?.data?.data?.map((myel) => {
          if (temfrom == 'NA') {
            if (
              selectedDate?.includes(
                moment(myel?.holidayDate).format('DD/MM/YYYY'),
              )
            ) {
              arr?.push({
                title:
                  moment(new Date(myel?.holidayDate?.split('T')[0])).format(
                    'DD MMM',
                  ) +
                  ' - ' +
                  myel?.holidayName,
                value: myel?.holidayDate?.split('T')[0],
              });
            }
          } else {
            if (
              new Date(myel?.holidayDate?.split('T')[0]) >= new Date(temfrom) &&
              new Date(myel?.holidayDate?.split('T')[0]) <= new Date(temto)
            ) {
              arr?.push({
                title:
                  moment(new Date(myel?.holidayDate?.split('T')[0])).format(
                    'DD MMM',
                  ) +
                  ' - ' +
                  myel?.holidayName,
                value: myel?.holidayDate?.split('T')[0],
              });
            }
          }
        });
        if (arr?.length) {
          toast.warning(
            'There ' +
              (arr?.length > 1
                ? 'are ' + arr?.length + ' holidays'
                : 'is ' + arr?.length + ' holiday') +
              ' in this date range Please select Holidays to enable.',
          );
        }
        setHolidayArr([...arr]);
      })
      .catch((er) => {});
  }
  function handleClose(dd) {
    setOpenFilter(false);
    if (dd === 'NO') return;
  }
  const getAllRoutes = () => {
    axios
      .get(Api?.baseUri + '/user-reg/master-route/getallmasterroute')
      .then((res) => {
        let temTotalEmpCount = 0;
        let temMaleCount = 0;
        let temFemaleCount = 0;
        res?.data?.data?.map((el) => {
          el?.passengers?.map((elem) => {
            temTotalEmpCount = ++temTotalEmpCount;
            if (elem?.gender?.toUpperCase() == 'MALE') {
              temMaleCount = ++temMaleCount;
            }
            if (elem?.gender?.toUpperCase() == 'FEMALE') {
              temFemaleCount = ++temFemaleCount;
            }
          });
        });
        setChartData([temMaleCount, temFemaleCount, temTotalEmpCount]);
        setMastderData(res?.data?.data);
      })
      .catch((err) => {});
  };
  useEffect(() => {
    getAllRoutes();
  }, []);
  useEffect(() => {
    setSelectedAccord(selectedAccord);
  }, [selectedAccord]);

  const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        marginTop: theme.spacing(2),
      },
    },
  }));
  const classes = useStyles();

  const handlethisChange = (event, value) => {
    setPage(value);
  };
  useEffect(() => {
    if (!user?.userList?.profileId) {
      return;
    }
  }, []);

  function myProcess(p1, p2) {
    let postData = p2.postData;
    postData.passengerSnapshot = p1;

    axios
      .post(Api.baseUri + '/user-reg/trip-driver/update-snapshot', postData)
      .then((res) => {
        if (res?.data?.status == '200') {
        }
      })
      .catch((err) => {});
    setTimeout(() => {
      setCount(count + 1);
    }, 3000);
  }

  let filtertemplate = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    description: 'Form for applying Job',
    // filtertype:"POP",
    //  margin-top: -30px;
    // background: #31bc7b;
    // border-radius: 20px;
    // width: 113px;
    sections: [
      {
        layout: {column: 2, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'text',
            name: 'empid',
            id: 'empid',
            title: 'Employee ID',
            inputiconurl: '/assets/images/login_icon.png',
            pattern: {
              value: regex.maxSize50,
              message:
                'Please enter  valid code with alpha-numeric and below 50 characters',
            },
          },
          {
            type: 'text',
            name: 'empname',
            id: 'empname',
            inputiconurl: '/assets/images/login_icon.png',
            title: 'Employee Name',
            pattern: {
              value: regex.maxSize50,
              message:
                'Please enter  valid code with alpha-numeric and below 50 characters',
            },
          },
          {
            type: 'text',
            name: 'tripid',
            id: 'tripid',
            inputiconurl: '/assets/images/logout_icon.png',
            title: 'Trip ID',
            pattern: {
              value: regex.maxSize50,
              message:
                'Please enter  valid code with alpha-numeric and below 50 characters',
            },
          },
          {
            type: 'text',
            name: 'gender',
            id: 'gender',
            inputiconurl: '/assets/images/login_icon.png',
            title: 'Gender',
            pattern: {
              value: regex.maxSize50,
              message:
                'Please enter  valid code with alpha-numeric and below 50 characters',
            },
          },
          {
            type: 'text',
            name: 'emailid',
            id: 'emailid',
            inputiconurl: '/assets/images/login_icon.png',
            title: 'Email Id',
            pattern: {
              value: regex.maxSize50,
              message:
                'Please enter  valid code with alpha-numeric and below 50 characters',
            },
          },
          {
            type: 'text',
            name: 'code',
            id: 'code',
            inputiconurl: '/assets/images/login_icon.png',
            title: 'Mobile No',
            pattern: {
              value: regex.maxSize50,
              message:
                'Please enter  valid code with alpha-numeric and below 50 characters',
            },
          },
        ],
      },
    ],
  };
  let template = {
    layout: {
      column: 1,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    title: '',
    description: '',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'date',
            name: 'fromDate',
            id: 'fromDate',
            title: 'From Date',
            min: 'today',
            validationProps: {
              required: 'This is a mandatory field',
              manual: [
                {
                  condition: `fromDate >= today`,
                  message:
                    "From date should be more than or equal to today's date.",
                },
              ],
            },
          },
          {
            type: 'date',
            name: 'toDate',
            id: 'To Date',
            min: 'today',
            title: 'To Date',
            validationProps: {
              required: 'This is a mandatory field',
              // manual: [
              //   {
              //     condition: `toDate >= today`,
              //     message: "To date should be more than or equal to today's date."
              //   }
              // ],
              validate: [
                {
                  condition: 'fromDate <= toDate',
                  message: 'From date should not be greater than To date.',
                },
              ],
            },
          },
          {
            type: 'multiSelect',
            name: 'weekOffs',
            id: 'weekOffs',
            title: 'WeekOffs',
            options: weeks ?? [],
          },
          {
            type: 'multiSelect',
            name: 'holidays',
            id: 'holidays',
            title: 'Holidays',
            options: holidayArr ?? [],
          },
        ],
      },
    ],
  };

  const uploadMasterList = async (event) => {
    setFileName(event?.target?.files[0]?.name);
  };
  const downloadFile = async (event) => {};
  const copyRoute = async (data) => {
    if (selectedAccord.length > 0) {
      setOpen(true);
    } else {
      toast.error('Please select at least one route.');
    }
  };
  var getDaysArray = function (start, end) {
    for (
      var arr = [], dt = new Date(start);
      dt <= new Date(end);
      dt.setDate(dt.getDate() + 1)
    ) {
      arr.push(new Date(dt));
    }
    return arr;
  };
  const handleSubmit = async (values) => {
    setshowbtn(false);
    if (values == 'NO') {
      setOpenConfirmboxCopy(false);
      setshowbtn(true);
    }
    if (values?.button?.toUpperCase() === 'SUBMIT' || values == 'YES') {
      let date1 = moment();
      let date2 = moment(values?.data?.fromDate);
      let difference = date1.diff(date2, 'days');
      if (difference > 0) {
        setTimeout(function () {
          setshowbtn(true);
        }, 1000);
        toast.error('Please enter a vailid date.');
        return;
      }
      let dateArr = getDaysArray(
        new Date(values?.data?.fromDate),
        new Date(values?.data?.toDate),
      );
      dateArr = dateArr.map((v) => v.toISOString().slice(0, 10));
      let temDateArray = getFinalDates(
        dateArr,
        values?.data?.holidays,
        values?.data?.weekOffs,
      );
      setmyFinalDateArr(temDateArray);
      let postbody = {
        dates: values == 'YES' ? myFinalDateArr : temDateArray,
        masterIds: selectedAccord,
        allMasters: selectedAccord.length === masterData.length ? 'YES' : 'NO',
      };

      axios
        .post(
          Api.baseUri +
            '/user-reg/trip-route/create-master-route-trip/' +
            (values == 'YES' ? 'true' : 'false'),
          postbody,
        )
        .then((res) => {
          setshowbtn(true);
          setOpen(false);
          if (res?.data?.status == '200') {
            setCurtResponse(res);
            toast.success(res?.data?.message ?? 'Success');
            setOpenConfirmboxCopy(false);
            setSelectedAccord([]);
            sentRouteSnapshot(res?.data?.data);
          } else if (res?.data?.status == '400') {
            setOpenConfirmboxCopy(true);
            setCopyErrorMsg(res?.data?.message);
          } else {
            setOpenConfirmboxCopy(false);
            toast.error(res?.data?.message ?? 'Failed');
          }
        })
        .catch((err) => {
          setOpenConfirmboxCopy(false);
          setOpen(false);
          setshowbtn(true);
          toast.error('Something went wrong.');
        });
    }
  };

  const selectAllRoute = async (event) => {
    let temArr = [];
    if (event.target.checked === true) {
      masterData.map((e) => {
        temArr.push(e?.id);
      });
    }
    setSelectedAccord(temArr);
  };
  const selectRoute = async (event, id) => {
    let temArr = selectedAccord;
    if (temArr.includes(id)) {
      temArr.splice(temArr.indexOf(id), 1);
    } else {
      temArr.push(id);
    }
    setSelectedAccord([...temArr]);
  };
  const deleteMasterRoute = async (id, routeId) => {
    setOpenConfirmBox(true);
    setMrouteId(id);
    setMasterRouteId(routeId);
  };
  const closeConfirmBox = (dd) => {
    if (dd == 'YES') {
      setOpenConfirmBox(false);
      axios
        .delete(Api?.baseUri + '/user-reg/master-route/' + mrouteId)
        .then((res) => {
          if (res?.status == 200) {
            toast.success(
              res?.message ?? masterRouteId + ' delete successfully',
            );
            getAllRoutes();
          }
        })
        .catch((err) => {
          toast.error(err);
        });
    }
    if (dd == 'NO') {
      setOpenConfirmBox(false);
    }
  };
  // const deleteEmpFromRoute = (row) => {
  //
  // }
  const deleteEmpFromRoute = async (row) => {
    setDeleteConfirmbox(true);
    setDeleteEmpId(row?.id);
  };
  const closeDeleteConfirmBox = (dd) => {
    if (dd == 'YES') {
      setDeleteConfirmbox(false);
      axios
        .delete(Api?.baseUri + '/user-reg/master-route/employee/' + deleteEmpId)
        .then((res) => {
          if (res?.status == 200) {
            toast.success(res?.message ?? 'Deleted successfully');
            getAllRoutes();
          }
        })
        .catch((err) => {
          toast.error(err);
        });
    }
    if (dd == 'NO') {
      setDeleteConfirmbox(false);
    }
  };

  const imageSrc = (d) => {
    if (d?.length) {
      setImageSource(d);
    }
  };

  function sentRouteSnapshot(value) {
    let temp = [];
    let temp_arr = [];
    for (let i = 0; i <= value?.length; i++) {
      temp = temp.concat(value[i]?.stopList);
    }
    for (let i = 0; i <= temp?.length; i++) {
      if (temp[i]?.onBoardPassengers)
        temp_arr = temp_arr.concat(temp[i]?.onBoardPassengers);
    }

    let temp_object = [];
    for (let i = 0; i <= temp_arr?.length - 1; i++) {
      temp_object.push({
        origin_lat: temp_arr[i]?.location?.latitude,
        origin_long: temp_arr[i]?.location?.longitude,
        destination_lat: temp_arr[i]?.officeLocation?.latitude,
        destination_long: temp_arr[i]?.officeLocation?.longitude,
        postData: {
          tripId: temp_arr[i]?.tripId,
          driverId: temp_arr[i]?.driverId,
          passengerId: temp_arr[i]?.empId,
          driverSnapShot: '',
          passengerSnapshot: '',
        },
      });
    }
    setMapPosition(temp_object);
  }
  return (
    <>
      {/* {!showbtn ?
        <AppLoader />
        : null} */}
      {/* <div className="grid-container"><SmartForm
                template={template}
                defaultValues={formData}
                onSubmit={handleSubmit}
                buttons={['submit']}
            /></div> */}

      <div style={{display: 'none'}}>
        {mapPosition?.length > count && (
          <MapSnapShot
            mapPosition={mapPosition}
            imageSrc={imageSrc}
            myProcess={myProcess}
            count={count}
          />
        )}
      </div>

      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={8}>
          <CustomLabel labelVal='Master Routes' variantVal='h3-underline' />
        </Grid>
        <Grid item xs={4}>
          {myActions?.includes('Download And Upload') && (
            <>
              <Button
                id='btnMui123'
                disabled={disableDown}
                onClick={async () => {
                  setDisableDown(true);
                  let url = '/user-reg/master-route/download-template';
                  await excelDoc?.downloadDoc(url, 'Route-Template');
                  setDisableDown(false);
                }}
                variant='outlined'
                className='route-file-download-btn'
              >
                <FileDownloadIcon className='route-file-download-icon' />
                Download Template
              </Button>
            </>
          )}
        </Grid>
      </Grid>

      <UploadSection chartArr={chartData} getAllRoutes={getAllRoutes} />
      <div className='routeListData route-list-data'>
        <div style={{width: '100%', display: 'flex'}}>
          <div style={{width: '50%'}}>
            {myActions?.includes('Copy') && (
              <FileCopyIcon
                onClick={(eve) => {
                  eve.stopPropagation();
                  copyRoute(eve);
                }}
              />
            )}
          </div>
          <div style={{width: '50%', textAlign: 'right'}}>
            {/* <Button id='btnMui123'
              variant='outlined'
              sx={{mb: 2, background: '#fdfdfd'}}
              onClick={(e) => {
                setOpenFilter(true);
              }}
            >
              <FilterAltIcon sx={{fontSize: '18px', marginBottom: '3px'}} />
              Filter
            </Button> */}
          </div>
        </div>
        <div>
          <Accordion
            onClick={(eve) => {
              eve.stopPropagation();
            }}
            className='route-accordion-header'
          >
            <AccordionSummary
              className='mb-2'
              expandIcon={<CustomExpandIcon opacity='0' />}
              aria-controls='panel1a-content'
              id='panel1a-header'
            >
              <Typography style={{width: '5%'}}>
                <Checkbox
                  color='success'
                  style={{borderColor: 'red', pointerEvents: 'auto'}}
                  checked={selectedAccord?.length == masterData?.length}
                  onClick={(ev) => {
                    ev.stopPropagation();
                  }}
                  onChange={(ev) => {
                    selectAllRoute(ev);
                  }}
                />
              </Typography>
              <Typography className='route-acc-head-cells-20'>
                <AssignmentIndIcon className='route-master-head-mui-icon' />
                <span>Route Id</span>
              </Typography>
              <Typography className='route-acc-head-cells-20'>
                <ExitToAppIcon className='route-master-head-mui-icon' />
                <span>Log-in</span>
              </Typography>
              <Typography className='route-acc-head-cells-20'>
                <LocationOnIcon className='route-master-head-mui-icon' />
                <span>Office Location</span>
              </Typography>
              <Typography className='route-acc-head-cells-15'>
                <StopCircleIcon className='route-master-head-mui-icon' />
                <span>No. of Stoppage</span>
              </Typography>
              <Typography className='route-acc-head-cells-15'>
                <GroupsIcon className='route-master-head-mui-icon' />
                {/* <img className="route-icons" src="/assets/images/route_page_icon/employee.png" style={{ position: 'relative', top: '3px', right: '5px' }} /> */}
                <span>Total Employees</span>
              </Typography>
              <Typography
                style={{width: '5%'}}
                className='route-acc-head-cells-20'
              >
                <span></span>
              </Typography>
            </AccordionSummary>
          </Accordion>

          {masterData?.length ? (
            masterData
              // ? data.slice((page - 1) * itemsPerPage, page * itemsPerPage)
              .map((e) => {
                return (
                  <Accordion style={{padding: '10px'}}>
                    <AccordionSummary
                      className='mb-2'
                      expandIcon={<CustomExpandIcon />}
                      // expandIcon={<><ExpandMoreIcon /></>}
                      // onClick={() => { setDataid(e.id); }}
                      aria-controls='panel1a-content'
                      id='panel1a-header'
                    >
                      <Typography style={{width: '5%'}}>
                        <Checkbox
                          color='success'
                          style={{borderColor: 'red'}}
                          checked={selectedAccord?.includes(e?.id)}
                          onClick={(ev) => {
                            ev.stopPropagation();
                          }}
                          onChange={(ev) => {
                            selectRoute(ev, e?.id);
                          }}
                        />
                      </Typography>
                      <Typography className='route-acc-body-cells-20'>
                        {e.routeId}
                      </Typography>
                      <Typography className='route-acc-body-cells-20'>
                        {e.loginTime}
                      </Typography>
                      <Typography className='route-acc-body-cells-20'>
                        {e.officeLocation?.locName ?? e?.officeName}
                      </Typography>
                      <Typography className='route-acc-body-cells-15'>
                        {e.passengers?.length}
                      </Typography>
                      <Typography className='route-acc-body-cells-15'>
                        {e.passengers?.length}
                      </Typography>
                      <Typography style={{width: '3.5%'}}>
                        <DeleteIcon
                          color='primary'
                          style={{color: '#bc0805', marginTop: '40%'}}
                          onClick={(eve) => {
                            eve.stopPropagation();
                            deleteMasterRoute(e.id, e.routeId);
                          }}
                        />
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        <div className='route-list-div'></div>
                        <RouteList
                          rows={e.passengers}
                          id={e.id}
                          deleteEmpFromRoute={deleteEmpFromRoute}
                        />
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                );
              })
          ) : !masterData ? (
            <p className='route-no-data'>No records to display</p>
          ) : (
            <p className='route-no-data'>No records to display</p>
          )}
          <div
            className={classes.root}
            style={{display: 'flex', justifyContent: 'center'}}
          >
            <Pagination
              // count={Math.ceil(data?.length / itemsPerPage)}
              count={Math.ceil(totalCount / itemsPerPage)}
              page={page}
              defaultPage={0}
              // color="primary"
              size='large'
              showFirstButton
              showLastButton
              onChange={handlethisChange}
            />
          </div>
        </div>
      </div>

      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        maxWidth='false'
      >
        <DialogTitle id='alert-dialog-title' className='header-color'>
          <h1>Master Route</h1>
          <IconButton
            className='header-close-btn'
            onClick={() => {
              setOpen(false);
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent style={{padding: '0px 20px 15px 20px', width: '500px'}}>
          {!showbtn ? <AppLoader /> : null}
          <div className='grid-container'>
            <SmartForm
              template={template}
              defaultValues={formData}
              onSubmit={handleSubmit}
              buttons={['submit']}
              onChange={onChangeVal}
              showbtn={showbtn}
            />
          </div>
        </DialogContent>
      </Dialog>
      <FilterPop
        open={openFilter}
        handleClose={handleClose}
        title={'Route Filter'}
        template={filtertemplate}
        cnfMsg={'cnfMsg'}
        header={'My Header'}
      />
      <Confirm
        open={openConfirmboxCopy}
        header={'Confirm to Copy'}
        cnfMsg={copyErrorMsg + 'Still want to create?'}
        handleClose={handleSubmit}
      />
      <Confirm
        open={openConfirmbox}
        header={'Confirm to Deactivate'}
        cnfMsg={`Are you sure, You want to deactivate the Route - ${masterRouteId}?`}
        handleClose={closeConfirmBox}
      />
      <Confirm
        open={deleteConfirmbox}
        header={'Confirm to Delete'}
        cnfMsg={`Are you sure, You want to delete this employee from route?`}
        handleClose={closeDeleteConfirmBox}
      />

      {/* <Button id='btnMui123' onClick={() => { setClickMe(true) }}>Click Me</Button>
      {clickMe && <ImageFunction />} */}
    </>
  );
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default MasterRoutes;
