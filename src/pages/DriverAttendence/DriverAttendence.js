import React, {useState, useEffect} from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CustomLabel from 'pages/common/CustomLabel';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Api from '@api';
import axios from 'axios';
import moment from 'moment';
import {makeStyles} from '@mui/styles';
import Pagination from '@mui/material/Pagination';
import AppTooltip from '@crema/core/AppTooltip';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import {Box, Grid, TextField, Typography} from '@mui/material';
import SmartFilter from '@smart-filter';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import SmartForm from '@smart-form';
import CloseIcon from '@mui/icons-material/Close';
import AppLoader from '@crema/core/AppLoader';
import {useSelector} from 'react-redux';
import TablePagination from '@mui/material/TablePagination';
import QuickSearchPage from '@quick-search';
import Stats from './graphh';
import {useNavigate} from 'react-router-dom';
import AppAnimate from '@crema/core/AppAnimate';
import AppGridContainer from '@crema/core/AppGridContainer';
import LinearWithValueLabel from './LinearProgress';
import Autocomplete from '@mui/material/Autocomplete';
import regex from '@regex';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from '@mui/material';
import Mybar from './bar';
import {useAuthUser} from '@crema/utility/AuthHooks';

const DriverAttendence = () => {
  const {user} = useAuthUser();

  const [data, setData] = useState();
  const [dates, setDates] = useState({});
  const navigate = useNavigate();
  const [openDownload, setOpenDownload] = useState(false);
  const [filterPopUp, setFilterPopUp] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const itemsPerPage = 10;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [totalCount, settotalCount] = React.useState(0);
  const [noRecord, setNoRecord] = useState();
  const [myActions, setMyActions] = useState([]);
  const [driverList, setDriverList] = useState();
  const [_driver, set_Driver] = useState();
  const [vendorList, setVendorList] = useState();
  const [filterShow, setfilterShow] = useState(false);
  const [filterRes, setFilterRes] = useState(null);
  const permissionCheck = useSelector(({settings}) => settings.permissions);

  const [openFilter, setOpenFilter] = useState(false);
  const [filter, setFilter] = useState({});
  const [attendanceTypeValue, setAttendanceTypeValue] = useState({
    title: 'All',
    value: 'ALL',
  });
  const [filterDate, setFilterDate] = useState({
    fromDate: moment(new Date())?.format('YYYY-MM-DD'),
    toDate: moment(new Date()).format('YYYY-MM-DD'),
  });
  const [formData, setformData] = useState({});

  console.log('filter', filter, _driver);
  const graphvalues = [
    data?.TotalDrivers - data?.TotalDriversPunchedToday,
    data?.TotalDriversPunchedToday,
  ];
  const valuebar = {
    bgColor: 'red',
    icon: ' /assets/images/halftime.svg',
    type: 'hhhhhh',
    value: '40',
  };
  const graphData = [
    {
      percent: (
        (graphvalues[0] * 100) /
        (graphvalues[0] + graphvalues[1])
      ).toFixed(2),
      count: graphvalues[0],
      color: '#f1736f',
    },
    {
      percent: (
        (graphvalues[1] * 100) /
        (graphvalues[0] + graphvalues[1])
      ).toFixed(2),
      count: graphvalues[1],
      color: '#2078b4',
    },
  ];
  useEffect(() => {
    if (!permissionCheck) return;
    let sub_mod = {};
    permissionCheck?.map((el) => {
      if (el.subModuleName == 'Driver Attendance') sub_mod = el;
    });
    setMyActions(sub_mod?.actions);
    if (
      (!sub_mod || !sub_mod?.actions?.includes('View')) &&
      user?.userList?.userRole !== 'SUPERADMIN'
    )
      navigate('/error-pages/error-404');
  }, [permissionCheck, user]);
  const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        marginTop: theme.spacing(2),
      },
    },
  }));
  const handleChangePage = (event, newPage) => {
    console.log('newPage', newPage);
    setPage(newPage);
    setShowLoader(true);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setShowLoader(true);
  };
  const fieldList = [
    {title: 'Driver Name', value: 'driverName'},
    {title: 'Vendor Name', value: 'vendorName'},
    {title: 'Driver Mobile No.', value: 'driverMobileNo'},
    {title: 'From Date', value: 'fromDate'},
    {title: 'To Date', value: 'toDate'},
  ];
  // useEffect(() => {
  //   getFilterData();
  // }, [filter, page, rowsPerPage]);

  useEffect(() => {
    console.log('filter====', filter);
  }, [filter]);

  // const getFilterData = () => {
  //   let url_ = Api.baseUri + '/api/dashboard/employee/filter';
  //   console.log('--', filter?.length);
  //   if (filter?.length) {
  //     let postData = {
  //       collection: 'DriverAttendance',
  //       pageNo: page + 1,
  //       filterType: 'filter',
  //       filter: filter,
  //       pageSize: rowsPerPage,
  //     };
  //     postData = {
  //       ...postData,
  //       ...filter,
  //     };
  //     console.log('postData', postData);
  //     axios
  //       .post(url_, postData)
  //       .then((re_) => {
  //         console.log('re_', re_);
  //         setData(re_?.data);
  //         setShowLoader(false);
  //       })
  //       .catch((err) => {
  //         setData([]);
  //         setShowLoader(false);
  //       });
  //   } else {
  //     let def_post = {
  //       collection: 'DriverAttendance',
  //       pageNo: page + 1,
  //       pageSize: rowsPerPage,
  //     };

  //     axios
  //       .post(url_, def_post)
  //       .then((re_) => {
  //         // console.log('re_', re_);
  //         setData(re_?.data);
  //         setShowLoader(false);
  //       })
  //       .catch((err) => {
  //         setData([]);
  //         setShowLoader(false);
  //       });
  //   }
  // };

  const classes = useStyles();
  const tableHeader = [
    'Date',
    'Driver Contact',
    'Vendor',
    'Punch-In Time',
    'Punch-out Time',
    'Punch-in Location',
    'Punch-out Location',
    'Punch-in with in geofencing',
    'Punch-out with in geofencing',
    'Allowed working hours',
    'Allowed Extra Hours',
    'Extra Working Hours',
    'Total Working Hours',
    // 'Next Day PunchOut',
    'Well Being Score',
  ];
  useEffect(() => {
    if (!filterDate) {
      return;
    }
    if (filterDate?.fromDate && filterDate?.toDate) {
      let postData = {
        fromDate: filterDate?.fromDate,
        toDate: filterDate?.toDate,
        // driverMobNo: 'null',
        // vendorName: 'null',
        // status: 'null',
        page: page,
        size: rowsPerPage,
        attendanceType: attendanceTypeValue?.value,
      };
      if (_driver?.driver) postData.driverName = `${_driver?.driver}`;
      if (_driver?.mobileNo) postData.driverMobNo = `${_driver?.mobileNo}`;
      if (_driver?.vendor) postData.vendorName = `${_driver?.vendor}`;
      if (_driver?.status) postData.status = `${_driver?.status}`;
      axios
        .post(
          Api.baseUri + `/user-reg/driver-reg/get-all-driver-attendance`,
          postData,
        )
        .then((res) => {
          console.log('res++', res);
          if (res?.data?.status == '200') {
            setShowLoader(false);
            setData(res?.data?.data?.body);
          }
        })
        .catch((err) => {
          console.log('err', err);
          setData([]);
        });
    }
  }, [filterDate, _driver, page, rowsPerPage, attendanceTypeValue]);
  const handleClosefilter = (d) => {
    setOpenFilter(false);
  };
  let templateDownload = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    description: 'Form for applying Job',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'route_information',
        fields: [
          {
            type: 'date',
            name: 'fromDate',
            id: 'fromDate',
            title: 'From Date',
          },
          {
            type: 'date',
            name: 'toDate',
            id: 'toDate',
            title: 'To Date',
          },
          {
            type: 'autocomplete',
            name: 'driverId',
            id: 'driverId',
            title: 'Driver',
            options: driverList ?? [],
            // validationProps: {
            //   required: 'This is a mandatory field',
            // },
          },
          {
            type: 'autocomplete',
            name: 'vendorId',
            id: 'vendorId',
            title: 'Vendor',
            options: vendorList ?? [],
            // validationProps: {
            //   required: 'This is a mandatory field',
            // },
          },
          {
            type: 'text',
            name: 'mobileNo.',
            id: 'mobileno.',
            title: 'Mobile Number',
            maxChar: 10,
            isNumber: true,
            // validationProps: {
            //   required: 'This is a mandatory field',
            // },
          },
          {
            type: 'autocomplete',
            name: 'status',
            id: 'status',
            title: 'Status',
            options: [
              {title: 'Present', value: 'PRESENT'},
              {title: 'Absent', value: 'ABSENT'},
              {title: 'Half Day', value: 'HALFDAY'},
            ],
            // validationProps: {
            //   required: 'This is a mandatory field',
            // },
          },
          {
            type: 'autocomplete',
            name: 'attendanceType',
            id: 'attendanceType',
            title: 'Attendance Type',
            options: [
              {title: 'All', value: 'ALL'},
              {title: 'Punched In', value: 'PunchedIn'},
              {title: 'Not Punched In', value: 'NotPunchedIn'},
            ],
            // validationProps: {
            //   required: 'This is a mandatory field',
            // },
          },
        ],
      },
    ],
  };
  let templateFilter = {
    layout: {
      column: 1,
      spacing: 2,
      size: 'small',
      label: 'fixed',
      // type: 'flex',
    },
    description: 'Form for applying Job',
    sections: [
      {
        layout: {
          column: 6,
          spacing: 2,
          size: 'small',
          label: 'fixed',
          type: 'flex',
        },
        id: 'route_information',
        fields: [
          {
            type: 'date',
            name: 'fromDate',
            id: 'fromDate',
            title: 'From Date',
            style: {marginRight: '5px'},
          },
          {
            type: 'date',
            name: 'toDate',
            id: 'toDate',
            title: 'To Date',
            style: {marginRight: '5px'},
          },
          {
            type: 'autocomplete',
            name: 'driverId',
            id: 'driverId',
            title: 'Driver',
            defaultValue: _driver?.driver || null,
            options: driverList ?? [],
            style: {marginRight: '5px', width: '150px'},
            // validationProps: {
            //   required: 'This is a mandatory field',
            // },
          },
          // {
          //   type: 'autocomplete',
          //   name: 'vendorId',
          //   id: 'vendorId',
          //   title: 'Vendor',
          //   defaultValue: _driver?.vendor || null,
          //   options: vendorList ?? [],
          //   style: {marginRight: '5px', width: '150px'},
          //   // validationProps: {
          //   //   required: 'This is a mandatory field',
          //   // },
          // },
          {
            type: 'text',
            name: 'mobileNo',
            id: 'mobileno.',
            title: 'Mobile Number',
            defaultValue: _driver?.mobileNo || null,
            maxChar: 10,
            isNumber: true,
            style: {marginRight: '5px'},
            // validationProps: {
            //   required: 'This is a mandatory field',
            // },
          },
          {
            type: 'autocomplete',
            name: 'status',
            id: 'status',
            title: 'Status',
            style: {marginRight: '5px'},
            defaultValue: _driver?.status || null,
            options: [
              {title: 'Present', value: 'PRESENT'},
              {title: 'Absent', value: 'ABSENT'},
              {title: 'Half Day', value: 'HALFDAY'},
            ],
            // validationProps: {
            //   required: 'This is a mandatory field',
            // },
          },
          {
            type: 'autocomplete',
            name: 'attendanceType',
            id: 'attendanceType',
            title: 'Attendance Type',
            options: [
              {title: 'All', value: 'ALL'},
              {title: 'Punched In', value: 'PunchedIn'},
              {title: 'Not Punched In', value: 'NotPunchedIn'},
            ],
            // validationProps: {
            //   required: 'This is a mandatory field',
            // },
          },
        ],
      },
    ],
  };

  function handleSubmitDownload(value) {
    console.log('val', value);
    axios
      .get(Api.baseUri + '/user-reg/driverAttdReport/getHeaders')
      .then((res) => {
        let shiftArray = [];
        value?.data?.shifts?.map((el) => {
          shiftArray.push(el?.value);
        });
        axios
          .post(
            Api.baseUri +
              `/user-reg/driverAttdReport/download-report/${
                value?.button?.toUpperCase() == 'XLS' ? 'EXCEL' : 'PDF'
              }/${value?.data?.fromDate}/${value?.data?.toDate}/${
                value?.data?.driverId || null
              }/${value?.data?.mobileNo || null}/${
                value?.data?.vendorId || null
              }/${value?.data?.status || null}/${
                value?.data?.attendanceType || null
              }`,
            res?.data?.data,
            {responseType: 'blob'},
          )
          .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute(
              'download',
              'driver_attendance/' +
                (value?.button?.toUpperCase() == 'XLS' ? '.xls' : '.pdf'),
            );
            document.body.appendChild(link);
            link.click();
          });
      })
      .catch((err) => {});

    setOpenDownload(false);
  }
  function handleFilter(val) {
    setFilterDate({
      fromDate: val?.data?.fromDate,
      toDate: val?.data?.toDate,
    });

    set_Driver({
      driver: val?.data?.driverId,
      vendor: val?.data?.vendorId,
      mobileNo: val?.data?.mobileNo,
      status: val?.data?.status,
    });
    setFilterPopUp(false);
    setShowLoader(true);
    setData(null);
  }

  useEffect(() => {
    axios
      .get(Api.baseUri + '/user-reg/associatevendor/getallassociatecorporateId')
      .then((re) => {
        let temArr = [];
        re?.data?.data?.length &&
          re?.data?.data?.map((el) => {
            if (el?.vendor)
              temArr.push({
                value: el?.vendor?.vendorName,
                title: el?.vendor?.vendorName,
              });
          });
        let sortedProducts = temArr.sort((p1, p2) =>
          new Date(p1.createdOn) < new Date(p2.createdOn)
            ? 1
            : new Date(p1.createdOn) > new Date(p2.createdOn)
            ? -1
            : 0,
        );
        setVendorList(sortedProducts ?? []);
      })
      .catch((err) => {
        setVendorList([]);
      });
  }, []);
  useEffect(() => {
    let temp = [];
    axios
      .get(
        Api.baseUri +
          '/user-reg/driver-reg/corporateId?page=0&size=100000&dlNumber=null&emailId=null&mobileNo=null',
      )
      .then((res) => {
        if (res?.data.status == '200') {
          res?.data?.data?.body?.DriverList?.map((el) => {
            temp.push({
              title: el?.firstName + ' ' + el?.lastName,
              value: el?.firstName,
            });
          });
          setDriverList(temp ?? []);
        } else {
          setDriverList([]);
        }
      })
      .catch((err) => {
        console.log('err', err);
        setDriverList([]);
      });
  }, []);
  return (
    <div>
      <Grid container sx={{mb: 6, mt: 1}} className='page-header-second'>
        <Grid item md={4} xs={12} sx={{mb: 2}}>
          <CustomLabel labelVal='Driver Attendance' variantVal='h3-underline' />
        </Grid>
        <Grid item xs={12} sm={3} md={4}>
          {/* <QuickSearchPage
            masterKey='emailId'
            module={'DriverAttendance'}
            searchClicked={true}
            searchUrl={'/employee-reg/filter'}
            masterFields={['empCode', 'emailId', 'firstName']}
            filterRes={filterRes}
            // getFilterData={getFilterData}
            setFilterRes={setFilterRes}
          /> */}
        </Grid>
        <Grid item md={4} xs={12}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <Autocomplete
              disablePortal
              size='small'
              value={attendanceTypeValue}
              id='combo-box-demo'
              options={[
                {title: 'All', value: 'ALL'},
                {title: 'Punched In', value: 'PunchedIn'},
                {title: 'Not Punched In', value: 'NotPunchedIn'},
              ]}
              sx={{width: '100%', m: 2}}
              getOptionLabel={(option) => option.title}
              onChange={(e, v) => {
                // setFuelType(v?.value);
                console.log('vvvv', v);
                setAttendanceTypeValue(v);
              }}
              // sx={{width: 300}}
              renderInput={(params) => (
                <TextField {...params} label='Attendance Type' />
              )}
            />
            <AppTooltip placement={'top'} title={'Add Filter'}>
              <FilterAltOutlinedIcon
                className='title-icons-mui'
                style={{color: _.isEmpty(filter) ? '' : '#ff9800'}}
                onClick={() => {
                  // setfilterShow(true);
                  // setOpenFilter(true);
                  setFilterPopUp(true);
                }}
              />
            </AppTooltip>
            <AppTooltip placement={'top'} title={'Clear Filter'}>
              <img
                src='/assets/images/clear-filter.png'
                // src='/assets/images/petrol.svg'

                onClick={() => {
                  // setFilterRes(null);
                  // setfilterShow(false);
                  // setFilter({});
                  // handleClosefilter({button: 'clear'});
                  setFilterDate({
                    fromDate: moment(new Date())?.format('YYYY-MM-DD'),
                    toDate: moment(new Date()).format('YYYY-MM-DD'),
                  });
                  set_Driver();
                }}
                className='title-icons-mui'
              />
            </AppTooltip>
            <AppTooltip placement={'top'} title={'Download Report'}>
              <FileDownloadOutlinedIcon
                className='title-icons-mui'
                // style={{color: _.isEmpty(filter) ? '' : '#ff9800'}}
                onClick={() => {
                  setOpenDownload(true);
                }}
              />
            </AppTooltip>
          </div>
        </Grid>
        {data && (
          <Grid
            container
            sx={{
              marginTop: '5px',
              mb: 1,
              paddingRight: '19px',
              paddingLeft: '19px',
            }}
            spacing={2}
          >
            <Grid item md={2}>
              <Stats
                title={'Drivers'}
                data={data?.TotalDrivers}
                total={data?.TotalDrivers}
                icon={'/assets/images/Group (17).svg'}
              />
            </Grid>
            <Grid item md={2}>
              <Stats
                title={'Punch in'}
                data={data?.TotalDriversPunchedInToday}
                total={data?.TotalDrivers}
                icon={'/assets/images/unnamed.png'}
              />
            </Grid>
            <Grid item md={2}>
              <Stats
                title={'Late in'}
                data={data?.TotalDriversLateEntryToday}
                total={data?.TotalDrivers}
                icon={'/assets/images/halftime.svg'}
              />
            </Grid>
            <Grid item md={2}>
              <Stats
                title={'Punch out'}
                data={data?.TotalDriversPunchedOutToday}
                total={data?.TotalDrivers}
                icon={'/assets/images/unnamed.png'}
              />
            </Grid>
            <Grid item md={2}>
              <Stats
                data={data?.TotalDriversEarlyExitToday}
                total={data?.TotalDrivers}
                title={'Early Out'}
                icon={'/assets/images/averagework.svg'}
              />
            </Grid>
            <Grid item md={2}>
              <Stats
                data={data?.AvgWorkingHour}
                total={data?.TotalDrivers}
                title={'Avg. WH'}
                icon={'/assets/images/late.svg'}
              />
            </Grid>
          </Grid>
        )}
      </Grid>

      {data && (
        <div
          style={{
            background: 'white',
            padding: '20px',
            height: '490px',
            overflowY: 'auto',
          }}
        >
          {!data?.DriverAttdList?.length && (
            <p
              style={{
                margin: 'auto',
                width: '100%',
                padding: '40px',
                display: 'flex',
                justifyContent: 'space-around',
                fontWeight: '900',
                fontSize: '15px',
              }}
            >
              No record Found
            </p>
          )}
          {data?.DriverAttdList?.map((el, index) => {
            return (
              <Accordion
                key={index}
                sx={{
                  // marginBottom: '10px',
                  padding: '0px 10px 0px 10px',
                  borderRadius: '10px',
                  // maxHeight: '300px', // Set a fixed height for the Accordion
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls='panel1a-content'
                  id='panel1a-header'
                >
                  <Typography
                    sx={{
                      width: '2%',
                      display: 'flex',
                      justifyContent: 'center',
                      // alignItems: 'center',
                      fontWeight: 550,
                    }}
                  >
                    {data?.currentPage * rowsPerPage + (index + 1)}
                  </Typography>
                  <Typography
                    sx={{
                      width: '14%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'left',
                      marginLeft: '10px',
                      alignItems: 'left',
                      fontWeight: 550,
                    }}
                  >
                    <p style={{fontWeight: 'bold'}}>{el?.driverName}</p>
                    {console.log('el?.vehicleName', el?.vehicleName)}
                    {el?.vehicleName && <p> {el?.vehicleName ?? ''}</p>}
                  </Typography>
                  <Typography
                    sx={{
                      width: '14%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'column',
                    }}
                  >
                    <div style={{display: 'flex'}}>
                      <img
                        src={'/assets/images/halftime.svg'}
                        style={{width: '20px', height: '20px'}}
                      />
                      <p style={{fontWeight: '600', marginLeft: '5px'}}>
                        {el?.noOfLateIn}
                      </p>
                    </div>

                    <p style={{marginTop: '3px'}}>Late In</p>
                  </Typography>
                  <Typography
                    sx={{
                      width: '14%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'column',
                    }}
                  >
                    <div style={{display: 'flex'}}>
                      <img
                        src={'/assets/images/averagework.svg'}
                        style={{width: '20px', height: '20px'}}
                      />
                      <p style={{fontWeight: '600', marginLeft: '5px'}}>
                        {el?.noOfEarlyExit}
                      </p>
                    </div>

                    <p style={{marginTop: '3px'}}>Early Out</p>
                  </Typography>
                  <Typography
                    sx={{
                      width: '14%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'column',
                    }}
                  >
                    <div style={{display: 'flex'}}>
                      <img
                        src={'/assets/images/earlyout.svg'}
                        style={{width: '20px', height: '20px'}}
                      />
                      <p style={{fontWeight: '600', marginLeft: '5px'}}>
                        {el?.deficitHours}
                      </p>
                    </div>
                    <p style={{marginTop: '3px'}}>Deficit Hour</p>
                  </Typography>
                  <Typography
                    sx={{
                      width: '14%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'column',
                    }}
                  >
                    <div style={{display: 'flex'}}>
                      <img
                        src={'/assets/images/daysworked.svg'}
                        style={{width: '20px', height: '20px'}}
                      />
                      <p style={{fontWeight: '600', marginLeft: '5px'}}>
                        {el?.totalWorkHours?.toFixed(2)}
                      </p>
                    </div>

                    <p style={{marginTop: '3px'}}>Total WH</p>
                  </Typography>
                  <Typography
                    sx={{
                      width: '14%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'column',
                    }}
                  >
                    <div style={{display: 'flex'}}>
                      <img
                        src={'/assets/images/totalwork.svg'}
                        style={{width: '20px', height: '20px'}}
                      />
                      <p style={{fontWeight: '600', marginLeft: '5px'}}>
                        {el?.totalDaysWorked}
                      </p>
                    </div>

                    <p style={{marginTop: '3px'}}>Day(s) Worked</p>
                  </Typography>
                  <Typography
                    sx={{
                      width: '14%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'column',
                    }}
                  >
                    <div style={{display: 'flex'}}>
                      <img
                        src={'/assets/images/late.svg'}
                        style={{width: '20px', height: '20px'}}
                      />
                      <p style={{fontWeight: '600', marginLeft: '5px'}}>
                        {el?.avgWorkHours?.toFixed(2)}
                      </p>
                    </div>

                    <p style={{marginTop: '3px'}}>Avg. WH</p>
                  </Typography>
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    overflow: 'auto',
                  }}
                >
                  <Table
                    sx={{
                      tableLayout: 'fixed',
                      // overflow: 'auto',
                      width: '100%',
                      overflowX: 'scroll',
                      // minWidth: 'px',
                    }}
                  >
                    <TableHead>
                      <TableRow sx={{background: '#f6f6f6'}}>
                        {tableHeader?.map((el) => {
                          return (
                            <TableCell
                              sx={{
                                border: '1px solid black',
                                fontWeight: '500',
                                width: '150px',
                              }}
                            >
                              <strong>{el}</strong>
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {el?.swipeList?.map((e, index) => (
                        <>
                          {e?.punchList?.map((_emp, ind) => {
                            return (
                              <TableRow>
                                <TableCell sx={{border: '1px solid black'}}>
                                  {moment(_emp?.date).format('DD-MM-YYYY')}
                                </TableCell>
                                <TableCell sx={{border: '1px solid black'}}>
                                  {e?.driverMobileNo}
                                </TableCell>
                                <TableCell sx={{border: '1px solid black'}}>
                                  {e?.vendorName}
                                </TableCell>
                                <TableCell sx={{border: '1px solid black'}}>
                                  {_emp?.punchInTime}
                                </TableCell>
                                <TableCell sx={{border: '1px solid black'}}>
                                  {_emp?.punchOutTime}
                                  {_emp?.isNextDayPunchOut?.toUpperCase() ==
                                    'YES' && (
                                    <img
                                      style={{
                                        width: '24px',
                                        height: '24px',
                                        margin: '-35px',
                                      }}
                                      src='/assets/images/aa.png'
                                    />
                                  )}
                                </TableCell>
                                <TableCell sx={{border: '1px solid black'}}>
                                  {_emp?.punchInLocation?.locName}
                                </TableCell>
                                <TableCell sx={{border: '1px solid black'}}>
                                  {_emp?.punchOutLocation?.locName}
                                </TableCell>
                                <TableCell sx={{border: '1px solid black'}}>
                                  {_emp?.isPunchInWithinGeofence}
                                </TableCell>
                                <TableCell sx={{border: '1px solid black'}}>
                                  {_emp?.isPunchOutWithinGeofence}
                                </TableCell>
                                <TableCell sx={{border: '1px solid black'}}>
                                  {el?.allowedWorkingHours}
                                </TableCell>
                                <TableCell sx={{border: '1px solid black'}}>
                                  {el?.allowedExtraHours}
                                </TableCell>
                                <TableCell sx={{border: '1px solid black'}}>
                                  {el?.extraHoursWorked}
                                </TableCell>
                                <TableCell sx={{border: '1px solid black'}}>
                                  {el?.totalWorkingHours}
                                </TableCell>
                                {/* <TableCell sx={{border: '1px solid black'}}>
                                  {_emp?.isNextDayPunchOut}
                                </TableCell> */}
                                <TableCell
                                  sx={{
                                    border: '1px solid black',
                                    color: 'white',
                                    background:
                                      el?.wellBeingScore == 'Stressed'
                                        ? 'orange'
                                        : el?.wellBeingScore == 'Risk'
                                        ? 'red'
                                        : 'green',
                                  }}
                                >
                                  {el?.wellBeingScore}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </>
                      ))}
                    </TableBody>
                  </Table>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </div>
      )}
      <div
        // className={classes.root}
        style={{display: 'flex', justifyContent: 'center', background: 'white'}}
      >
        {/* <Pagination
          count={Math.ceil(data?.totalItems / 10)}
          page={page}
          defaultPage={0}
          // color="primary"
          size='large'
          showFirstButton
          showLastButton
          onChange={handlethisChange}
        /> */}
        {data && (
          <TablePagination
            component='div'
            count={data?.totalItems}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              minHeight: 'unset', // Set minHeight to 'unset' or the desired value
            }}
          />
        )}
      </div>
      {showLoader && <AppLoader />}
      {filterShow && (
        <SmartFilter
          open={openFilter}
          title={'Driver Attendance Filter'}
          handleClose={handleClosefilter}
          filter={filter}
          fieldList={fieldList}
          setFilter={setFilter}
        />
      )}
      <Dialog
        open={openDownload}
        onClose={() => {
          setOpenDownload(false);
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        maxWidth='false'
        PaperProps={{
          sx: {
            width: 500,
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle
          id='alert-dialog-title'
          style={{
            background: '#f5f2f2',
            position: 'relative',
            fontSize: '21px',
          }}
        >
          Driver Attendance Report
          <IconButton
            onClick={() => {
              setOpenDownload(false);
            }}
            style={{position: 'absolute', top: '8px', right: '8px'}}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <SmartForm
            template={templateDownload}
            onSubmit={handleSubmitDownload}
            buttons={['xls', 'pdf']}
          />
        </DialogContent>
      </Dialog>
      <Dialog
        open={filterPopUp}
        // onClose={() => {
        //   setFilterPopUp(false);
        // }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        maxWidth='false'
        PaperProps={{
          sx: {
            // width: 500,
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle
          id='alert-dialog-title'
          style={{
            background: '#f5f2f2',
            position: 'relative',
            fontSize: '21px',
          }}
        >
          Driver Attendance Filter
          <IconButton
            onClick={() => {
              setFilterPopUp(false);
            }}
            style={{position: 'absolute', top: '8px', right: '8px'}}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <SmartForm
            template={templateFilter}
            fieldsize='SMALL'
            filterbtnStyle={{
              maxHeight: '36px',
              marginLeft: '5px',
              marginTop: '26px',
              backgroundColor: '#006685',
            }}
            setVal={[
              {name: 'fromDate', value: filterDate?.fromDate},
              {name: 'toDate', value: filterDate?.toDate},
              // {name: 'shiftTime', value: filterOptions?.shiftTime},
              // {name: 'vendorId', value: filterOptions?.vendorId},
            ]}
            onSubmit={handleFilter}
            buttons={['Filter']}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DriverAttendence;
