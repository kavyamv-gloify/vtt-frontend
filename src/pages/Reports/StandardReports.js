import React, {useEffect, useState} from 'react';
import SmartForm from '@smart-form';
import moment from 'moment';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import {Grid} from '@mui/material';
// import { DatePicker } from '@mui/x-date-pickers';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import axios from 'axios';
import Api from '@api';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {toast} from 'react-toastify';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import AppLoader from '@crema/core/AppLoader';
import {Today} from '@mui/icons-material';
import {useAuthUser} from '@crema/utility/AuthHooks';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import {Button} from '@mui/material';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
// import moment from 'moment';
const StandardReports = ({myActions}) => {
  const [reportType, setReportType] = useState();
  const [dropDown, setDropDown] = useState(false);
  const [format, setFormat] = useState('CSV');
  const [data, setData] = useState();
  const [header, setHeader] = useState();
  const [openFilter, setOpenFilter] = useState(false);
  const [filter, setFilter] = useState();
  const [showbtn, setshowbtn] = useState(true);
  const [date, setDate] = useState();
  const [expand, setExpand] = useState(true);
  const [startDate, setStartDate] = useState(new Date());
  const {user} = useAuthUser();
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [dateType, setDateType] = useState();
  const [isLoading, setIsLoading] = useState(false);

  let reportCategory = [
    {title: 'Vehicle Compliance Report', value: 'Vehicle Compliance Report'},
    {title: 'Driver Compliance Report', value: 'Driver Compliance Report'},
    {title: 'Trip Cancelled Report', value: 'Trip Cancelled Report'},
    {title: 'Employee Rating Report', value: 'Employee Rating Report'},
    {title: 'Route Report', value: 'Route Report'},
    {title: 'Absent Report', value: 'Absent Report'},
    {title: 'SMS User Report', value: 'Sms User Report'},
    // { title: "Leave Report", value: "Leave Report" },
    // { title: "Incident Report", value: "Incident Report" },
  ];

  useEffect(() => {
    axios
      .get(Api.baseUri + '/usernotify/smsReport/getHeaders')
      .then((res) => {})
      .catch((err) => {});
  }, []);

  const getDates = () => {
    var curr = new Date();
    var first = curr.getDate() - curr.getDay();
    var last = first + 6;
    var firstday = new Date(curr.setDate(first)).toUTCString();
    var lastday = new Date(curr.setDate(last)).toUTCString();
    return {firstDay: firstday, lastDay: lastday};
  };

  const getMonth = () => {
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return {firstDay: firstDay, lastDay: lastDay};
  };

  let template = {
    layout: {
      column: 1,
      spacing: 2,
      size: 'small',
      label: 'fixed',
      type: 'flex',
    },
    title: '',
    description: 'Routes',
    sections: [
      {
        layout: {
          column: 4,
          spacing: 2,
          size: 'small',
          label: 'fixed',
          type: 'flex',
        },
        id: 'route_information',
        fields: [
          {
            type: 'select',
            name: 'reportType',
            id: 'reportType',
            title: 'Report',
            options: reportCategory ?? [],
            size: 'small',
            style: {width: '20%'},
          },
          {
            type: 'select',
            name: 'dateType',
            id: 'dateType',
            title: 'Date',
            options: [
              {title: 'Custom', value: 'Custom'},
              {title: 'Today', value: 'Today'},
              {title: 'Weekly', value: 'Weekly'},
              {title: 'Monthly', value: 'Monthly'},
            ],
            dynamic: {
              field: 'reportType',
              isNotValue: [
                'Vehicle Compliance Report',
                'Driver Compliance Report',
              ],
            },
            style: {width: '20%'},
          },
          {
            type: 'date',
            name: 'fromDate',
            id: 'fromDate',
            title: 'From Date',
            size: 'small',
            dynamic: {
              field: 'dateType',
              value: ['Custom'],
            },
            style: {width: '20%'},
            max: 'today',
            validationProps: {
              required: 'This is a mandatory field',
              // manual: [
              //   {
              //     condition: `driverInductionDate >= today`,
              //     message: "Driver Induction Date should be greater than or equal to today's date."
              //   }
              // ]
            },
          },
          {
            type: 'date',
            name: 'toDate',
            id: 'toDate',
            title: 'To Date',
            size: 'small',
            max: 'today',
            dynamic: {
              field: 'dateType',
              value: 'Custom',
            },
            style: {width: '20%'},
            validationProps: {
              required: 'This is a mandatory field',
              // manual: [
              //   {
              //     condition: `driverInductionDate >= today`,
              //     message: "Driver Induction Date should be greater than or equal to today's date."
              //   }
              // ]
            },
          },
        ],
      },
    ],
  };
  function handleDateChange(e) {}
  let Filtertemplate = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    // title: 'Bank Type',
    description: 'Form for applying Job',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'multiSelect',
            name: 'reportType',
            id: 'reportType',
            title: 'Select Fields',
            options: filter ?? [],
          },
        ],
      },
    ],
  };
  const handleSubmit = async (val) => {
    setshowbtn(false);
    setReportType(val?.data?.reportType);
    await getAllList(
      val?.data?.reportType,
      val?.data?.dateType,
      val?.data?.fromDate,
      val?.data?.toDate,
    );
    setTimeout(() => {
      setshowbtn(true);
    }, 200);
  };

  const submitReport = async () => {
    await getAllList(reportType, dateType, fromDate, toDate);
    setTimeout(() => {
      setshowbtn(true);
    }, 200);
  };
  function getAllList(reportType, dateType, fromDate, toDate) {
    setIsLoading(true);
    let result = getDates();
    let months = getMonth();
    let date = {};
    if (dateType == 'Weekly') {
      date.fromDate = moment(result?.firstDay).format('YYYY-MM-DD');
      date.toDate = moment(result?.lastDay).format('YYYY-MM-DD');
      setDate({
        dateType: dateType,
        fromDate: moment(result?.firstDay).format('YYYY-MM-DD'),
        toDate: moment(result?.lastDay).format('YYYY-MM-DD'),
      });
    } else if (dateType == 'Monthly') {
      date.fromDate = moment(months?.firstDay).format('YYYY-MM-DD');
      date.toDate = moment(months?.lastDay).format('YYYY-MM-DD');
      setDate({
        dateType: dateType,
        fromDate: moment(months?.firstDay).format('YYYY-MM-DD'),
        toDate: moment(months?.lastDay).format('YYYY-MM-DD'),
      });
    } else if (dateType == 'Today') {
      date.fromDate = moment().format('YYYY-MM-DD');
      setDate({dateType: dateType, fromDate: moment().format('YYYY-MM-DD')});
    } else {
      date.fromDate = moment(fromDate).format('YYYY-MM-DD');
      date.toDate = moment(toDate).format('YYYY-MM-DD');
      setDate({dateType: dateType, fromDate: fromDate, toDate: toDate});
    }
    if (!reportType) {
      return;
    }
    let temp_url = {get: '', post: ''};
    if (reportType == 'Vehicle Compliance Report')
      temp_url = {
        get: Api.baseUri + '/user-reg/vehicleComplianceReport/getHeaders',
        post:
          Api.baseUri +
          '/user-reg/vehicleComplianceReport/vehicle-compliance/null/null/null/null',
        name: 'shreya',
      };
    if (reportType == 'Driver Compliance Report')
      temp_url = {
        get: Api.baseUri + '/user-reg/driverComplianceReport/getHeaders',
        post:
          Api.baseUri +
          '/user-reg/driverComplianceReport/driver-compliance/null/null/null/null/null',
      };
    if (reportType == 'Trip Cancelled Report')
      temp_url = {
        get: Api.baseUri + '/user-reg/tripCancelReport/getHeaders',
        post:
          Api.baseUri +
          '/user-reg/tripCancelReport/cancelled-trips/' +
          date?.fromDate +
          '/' +
          (dateType == 'Today' ? date?.fromDate : date?.toDate),
      };
    if (reportType == 'Employee Rating Report')
      temp_url = {
        get: Api.baseUri + '/user-reg/empRatingReport/getHeaders',
        post:
          Api.baseUri +
          '/user-reg/empRatingReport/getAllRating/' +
          date?.fromDate +
          '/' +
          (dateType == 'Today' ? date?.fromDate : date?.toDate),
      };
    if (reportType == 'Route Report')
      temp_url = {
        get: Api.baseUri + '/user-reg/routeReport/getHeaders',
        post:
          Api.baseUri +
          '/user-reg/routeReport/shiftWiseTrips/' +
          date?.fromDate +
          '/' +
          (dateType == 'Today' ? date?.fromDate : date?.toDate),
      };
    if (reportType == 'Absent Report')
      temp_url = {
        get: Api.baseUri + '/user-reg/absentPassengerReport/getHeaders',
        post:
          Api.baseUri +
          '/user-reg/absentPassengerReport/absent-passengers/' +
          date?.fromDate +
          '/' +
          (dateType == 'Today' ? date?.fromDate : date?.toDate),
      };
    if (reportType == 'Sms User Report')
      temp_url = {
        get: Api.baseUri + '/user-reg/smsReport/getHeaders',
        post:
          Api.baseUri +
          '/user-reg/smsReport/smsHistory/' +
          date?.fromDate +
          '/' +
          (dateType == 'Today' ? date?.fromDate : date?.toDate) +
          '/' +
          user?.userList?.corporateId +
          '/null',
      };
    axios
      .get(temp_url.get)
      .then((res) => {
        if (res?.data?.status == '200') {
          setshowbtn(true);
          setHeader(res?.data?.data);
          let temp_array = [];
          res?.data?.data?.map((el) => {
            temp_array.push({title: el, value: el});
          });
          setFilter(temp_array);
          axios
            .post(temp_url.post, res?.data?.data)
            .then((res) => {
              setData(res?.data?.split('\r\n'));
              setIsLoading(false);
            })
            .catch((err) => {
              setIsLoading(false);
            });
        }
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }

  const handleDownload = () => {
    let temp_url = '';
    if (reportType == 'Vehicle Compliance Report')
      temp_url =
        Api.baseUri + '/user-reg/vehicleComplianceReport/download-report/';
    if (reportType == 'Driver Compliance Report')
      temp_url =
        Api.baseUri + '/user-reg/driverComplianceReport/download-report/';
    if (reportType == 'Trip Cancelled Report')
      temp_url = Api.baseUri + '/user-reg/tripCancelReport/download-report/';
    if (reportType == 'Employee Rating Report')
      temp_url = Api.baseUri + '/user-reg/empRatingReport/download-report/';
    if (reportType == 'Route Report')
      temp_url = Api.baseUri + '/user-reg/routeReport/download-report/';
    if (reportType == 'Absent Report')
      temp_url =
        Api.baseUri + '/user-reg/absentPassengerReport/download-report/';
    if (reportType == 'Sms User Report') {
      temp_url =
        Api.baseUri + '/user-reg/smsReport/smsHistory/download-report/';
    }
    if (
      reportType == 'Vehicle Compliance Report' ||
      reportType == 'Driver Compliance Report'
    ) {
      axios
        .post(
          temp_url +
            (format == 'PDF'
              ? 'PDF'
              : format == 'CSV'
              ? 'CSV'
              : format == 'EXCEL'
              ? 'EXCEL'
              : null) +
            '/null/null/null/null/null',
          header,
          {responseType: 'blob'},
        )
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute(
            'download',
            (reportType == 'Vehicle Compliance Report'
              ? 'vehicle_compliance'
              : reportType == 'Driver Compliance Report'
              ? 'driver_compliance'
              : 'trip_cancelled') +
              (format == 'PDF'
                ? '.pdf'
                : format == 'CSV'
                ? '.csv'
                : format == 'EXCEL'
                ? '.xls'
                : null),
          );
          document.body.appendChild(link);
          link.click();
        });
    }
    if (
      reportType == 'Trip Cancelled Report' ||
      reportType == 'Employee Rating Report' ||
      reportType == 'Route Report' ||
      reportType == 'Absent Report' ||
      reportType == 'SMS User Report'
    ) {
      axios
        .post(
          temp_url +
            (format == 'PDF'
              ? 'PDF'
              : format == 'CSV'
              ? 'CSV'
              : format == 'EXCEL'
              ? 'EXCEL'
              : null) +
            '/' +
            date?.fromDate +
            '/' +
            (date?.dateType == 'Today' ? date?.fromDate : date?.toDate),
          header,
          {responseType: 'blob'},
        )
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute(
            'download',
            (reportType == 'Vehicle Compliance Report'
              ? 'vehicle_compliance'
              : reportType == 'Driver Compliance Report'
              ? 'driver_compliance'
              : reportType == 'Trip Cancelled Report'
              ? 'trip_cancelled'
              : reportType == 'Employee Rating Report'
              ? 'employee_rating_'
              : reportType == 'Route Report'
              ? 'route_report'
              : 'absent_report') +
              (format == 'PDF'
                ? '.pdf'
                : format == 'CSV'
                ? '.csv'
                : format == 'EXCEL'
                ? '.xls'
                : null),
          );
          document.body.appendChild(link);
          link.click();
        });
    }
  };

  const handleFilter = (val) => {
    let temp_url = '';
    if (reportType == 'Vehicle Compliance Report')
      temp_url =
        Api.baseUri + '/user-reg/vehicleComplianceReport/download-report/';
    if (reportType == 'Driver Compliance Report')
      temp_url =
        Api.baseUri + '/user-reg/driverComplianceReport/download-report/';
    if (reportType == 'Trip Cancelled Report')
      temp_url = Api.baseUri + '/user-reg/tripCancelReport/download-report/';
    if (reportType == 'Employee Rating Report')
      temp_url = Api.baseUri + '/user-reg/empRatingReport/download-report/';
    if (reportType == 'Route Report')
      temp_url = Api.baseUri + '/user-reg/routeReport/download-report/';
    if (reportType == 'Absent Report')
      temp_url =
        Api.baseUri + '/user-reg/absentPassengerReport/download-report/';
    if (
      reportType == 'Vehicle Compliance Report' ||
      reportType == 'Driver Compliance Report'
    ) {
      axios
        .post(
          temp_url +
            (val?.button == 'csv'
              ? 'CSV'
              : val?.button == 'pdf'
              ? 'PDF'
              : val?.button == 'xls'
              ? 'EXCEL'
              : null) +
            '/null/null/null/null/null',
          val?.data?.reportType,
          {responseType: 'blob'},
        )
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute(
            'download',
            (reportType == 'Vehicle Compliance Report'
              ? 'vehicle_compliance'
              : reportType == 'Driver Compliance Report'
              ? 'driver_compliance'
              : 'trip_cancelled') +
              (val?.button == 'csv'
                ? '.csv'
                : val?.button == 'pdf'
                ? '.pdf'
                : val?.button == 'excel'
                ? '.xls'
                : null),
          );
          document.body.appendChild(link);
          link.click();
          setOpenFilter(false);
        });
    }

    if (
      reportType == 'Trip Cancelled Report' ||
      reportType == 'Employee Rating Report' ||
      reportType == 'Route Report' ||
      reportType == 'Absent Report'
    ) {
      axios
        .post(
          temp_url +
            (val?.button == 'csv'
              ? 'CSV'
              : val?.button == 'pdf'
              ? 'PDF'
              : val?.button == 'excel'
              ? 'EXCEL'
              : null) +
            '/' +
            date?.fromDate +
            '/' +
            (date?.dateType == 'Today' ? date?.fromDate : date?.toDate),
          val?.data?.reportType,
          {responseType: 'blob'},
        )
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute(
            'download',
            (reportType == 'Vehicle Compliance Report'
              ? 'vehicle_compliance'
              : reportType == 'Driver Compliance Report'
              ? 'driver_compliance'
              : reportType == 'Trip Cancelled Report'
              ? 'trip_cancelled'
              : reportType == 'Employee Rating Report'
              ? 'employee_rating'
              : reportType == 'Route Report'
              ? 'route_report'
              : 'absent_report') +
              (val?.button == 'csv'
                ? '.csv'
                : val?.button == 'pdf'
                ? '.pdf'
                : val?.button == 'excel'
                ? '.xls'
                : null),
          );
          document.body.appendChild(link);
          link.click();
          setOpenFilter(false);
        });
    }
  };
  const currentDate = moment();

  const getColor = (date) => {
    const datePattern = /^([0-9]{2})-([0-9]{2})-([0-9]{4})$/;
    if (!datePattern?.test(date)) return ''; // No color if date format is incorrect
    const targetDate = moment(date, 'DD-MM-YYYY');
    const difference = targetDate?.diff(currentDate, 'days'); // Calculate difference in days

    if (difference > 15) {
      return 'green';
    } else if (difference >= 0 && difference <= 15) {
      return 'orange';
    } else {
      return 'red';
    }
  };
  return (
    <>
      <div style={{background: 'white'}}>
        <div className='route-list' style={{padding: '20px'}}>
          <div>
            {!showbtn ? <AppLoader /> : null}
            <Grid
              container
              spacing={2}
              sx={{
                background: 'white',
                boxShadow:
                  ' rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px',
                padding: '10px',
                borderLeft: '5px solid #006685',
                borderRadius: '5px',
              }}
            >
              <Grid item md={3}>
                <Autocomplete
                  disablePortal
                  size='small'
                  id='combo-box-demo'
                  options={reportCategory ?? []}
                  sx={{width: '100%', m: 2}}
                  getOptionLabel={(option) => option.title}
                  onChange={(e, v) => {
                    setReportType(v?.value);
                  }}
                  // sx={{width: 300}}
                  renderInput={(params) => (
                    <TextField {...params} label='Reports' />
                  )}
                />
              </Grid>
              {(reportType == 'Trip Cancelled Report' ||
                reportType == 'Employee Rating Report' ||
                reportType == 'Route Report' ||
                reportType == 'Absent Report' ||
                reportType == 'Sms User Report') && (
                <>
                  <Grid item md={2}>
                    <Autocomplete
                      disablePortal
                      size='small'
                      id='combo-box-demo'
                      options={[
                        {title: 'Custom', value: 'Custom'},
                        {title: 'Today', value: 'Today'},
                        {title: 'Weekly', value: 'Weekly'},
                        {title: 'Monthly', value: 'Monthly'},
                      ]}
                      sx={{width: '100%', m: 2}}
                      getOptionLabel={(option) => option.title}
                      onChange={(e, v) => {
                        setDateType(v?.value);
                        // console.log('vvvv', v);
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label='Date' />
                      )}
                    />
                  </Grid>
                  {dateType == 'Custom' && (
                    <>
                      <Grid item md={2}>
                        <TextField
                          type='date'
                          inputProps={{
                            max: moment().format('YYYY-MM-DD'),
                          }}
                          onChange={(e, v) => {
                            setFromDate(e?.target?.value);
                          }}
                          id='outlined-error-helper-text'
                          size='small'
                          sx={{width: '100%', m: 2}}
                          fullWidth
                        />
                      </Grid>

                      <Grid item md={2}>
                        <TextField
                          type='date'
                          inputProps={{
                            max: moment().format('YYYY-MM-DD'),
                          }}
                          onChange={(e, v) => {
                            setToDate(e?.target?.value);
                          }}
                          id='outlined-error-helper-text'
                          size='small'
                          fullWidth
                          sx={{width: '100%', m: 2}}
                        />
                      </Grid>
                    </>
                  )}
                </>
              )}

              <Grid item md={2}>
                <Button
                  variant='contained'
                  sx={{m: 2}}
                  type='submit'
                  onClick={() => {
                    submitReport();
                  }}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
            {/* <SmartForm
              template={template}
              filterbtnStyle={{
                maxHeight: '36px',
                marginLeft: '5px',
                marginTop: '26px',
                backgroundColor: '#006685',
              }}
              buttons={['submit']}
              onSubmit={handleSubmit}
              success={showbtn}
              fieldsize='SMALL'
            /> */}
          </div>
        </div>

        {reportType?.length && (
          <h3
            style={{
              marginBottom: '20px',
              paddingLeft: '20px',
              fontSize: '15px',
              fontWeight: 'bold',
            }}
          >
            {reportType}
          </h3>
        )}
        <Accordion>
          <AccordionSummary
            aria-controls='panel1a-content'
            id='panel1a-header'
            style={{background: '#f1f1f1'}}
          >
            <Grid container>
              <Grid item xs={4} sx={{paddingLeft: '20px'}}>
                <Typography style={{fontWeight: 'bold'}}>S.No.</Typography>
              </Grid>
              <Grid item xs={4} sx={{paddingLeft: '20px'}}>
                <Typography style={{fontWeight: 'bold'}}>Topics</Typography>
              </Grid>
              <Grid
                item
                xs={4}
                sx={{
                  paddingLeft: '20px',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                {myActions?.includes('Download And Upload') && (
                  <Typography style={{fontWeight: 'bold'}}>Actions</Typography>
                )}
              </Grid>
            </Grid>
          </AccordionSummary>
        </Accordion>
        {reportType?.length && (
          <Accordion>
            <AccordionSummary
              aria-controls='panel1a-content'
              id='panel1a-header'
            >
              <Grid container>
                <Grid item xs={4} sx={{paddingLeft: '20px'}}>
                  <Typography
                    onClick={(eve) => {
                      eve.stopPropagation();
                    }}
                  >
                    0001
                  </Typography>
                </Grid>
                <Grid item xs={4} sx={{paddingLeft: '20px'}}>
                  <Typography
                    onClick={(eve) => {
                      eve.stopPropagation();
                    }}
                  >
                    {reportType}
                  </Typography>
                </Grid>
                <Grid item xs={4} sx={{paddingLeft: '20px'}}>
                  {myActions?.includes('Download And Upload') && (
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                      <div style={{color: '#006685', marginTop: '5px'}}>
                        <ArrowCircleDownIcon
                          onClick={(eve) => {
                            eve.stopPropagation();
                            setOpenFilter(true);
                          }}
                        />
                      </div>
                      <div
                        style={{
                          marginLeft: '20px',
                          color: expand == true ? '#006685' : 'grey',
                          marginTop: '5px',
                        }}
                      >
                        <RemoveRedEyeOutlinedIcon
                          onClick={() => {
                            setExpand(!expand);
                          }}
                        />
                      </div>
                      <Grid item xs={5} style={{marginLeft: '20px'}}>
                        <Grid
                          container
                          sx={{
                            border: '2px solid #f1f1f1',
                            borderRadius: '50px',
                            display: 'flex',
                          }}
                        >
                          <Grid
                            item
                            xs={6}
                            sx={{
                              display: 'flex',
                              borderRight: '2px solid #f1f1f1',
                              padding: '5px 0px 0px 13px',
                            }}
                          >
                            <Grid container>
                              <Grid xs={6}>
                                {' '}
                                <p
                                  style={{marginTop: '2px'}}
                                  onClick={(eve) => {
                                    eve.stopPropagation();
                                  }}
                                >
                                  {format}
                                </p>
                              </Grid>
                              <Grid xs={6}>
                                <div>
                                  <div style={{position: 'relative'}}>
                                    <ArrowDropDownOutlinedIcon
                                      onClick={(eve) => {
                                        eve.stopPropagation();
                                        setDropDown(!dropDown);
                                      }}
                                    />
                                  </div>
                                  {dropDown && (
                                    <Paper
                                      sx={{
                                        width: 120,
                                        maxWidth: '100%',
                                        marginLeft: '-101px',
                                        marginTop: '-9px',
                                        position: 'absolute',
                                        zIndex: '2',
                                      }}
                                    >
                                      <MenuList>
                                        <MenuItem
                                          onClick={(eve) => {
                                            eve.stopPropagation();
                                            setFormat('PDF');
                                            setDropDown(!dropDown);
                                          }}
                                        >
                                          <ListItemText>PDF</ListItemText>
                                        </MenuItem>
                                        <MenuItem
                                          onClick={(eve) => {
                                            eve.stopPropagation();
                                            setFormat('CSV');
                                            setDropDown(!dropDown);
                                          }}
                                        >
                                          <ListItemText>CSV</ListItemText>
                                        </MenuItem>
                                        <MenuItem
                                          onClick={(eve) => {
                                            eve.stopPropagation();
                                            setFormat('EXCEL');
                                            setDropDown(!dropDown);
                                          }}
                                        >
                                          <ListItemText>XLS</ListItemText>
                                        </MenuItem>
                                      </MenuList>
                                    </Paper>
                                  )}
                                </div>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid
                            item
                            xs={6}
                            sx={{padding: '5px 0px 0px 13px', color: '#006685'}}
                          >
                            <FileDownloadOutlinedIcon
                              onClick={(eve) => {
                                eve.stopPropagation();
                                handleDownload();
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </div>
                  )}
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label='simple table'>
                  {!isLoading ? (
                    <>
                      <TableHead style={{background: '#f1f1f1'}}>
                        <TableRow>
                          {data?.[0]?.split(',')?.map((el) => {
                            return <TableCell align='center'> {el} </TableCell>;
                          })}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data?.map((el, i) => {
                          return (
                            <>
                              {i != 0 && (
                                <TableRow align='center'>
                                  {el?.split(',')?.map((_el) => {
                                    return (
                                      <TableCell
                                        align='center'
                                        style={
                                          reportType ==
                                            'Vehicle Compliance Report' ||
                                          reportType ==
                                            'Driver Compliance Report'
                                            ? {color: getColor(_el)}
                                            : {}
                                        }
                                        key={_el}
                                      >
                                        {' '}
                                        {_el?.length ? _el : '----'}
                                      </TableCell>
                                    );
                                  })}
                                </TableRow>
                              )}
                            </>
                          );
                        })}
                      </TableBody>
                    </>
                  ) : (
                    <TableRow>
                      <TableCell style={{textAlign: 'center'}} colSpan={15}>
                        Loading...
                      </TableCell>
                    </TableRow>
                  )}
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        )}

        <Dialog
          onClose={() => {
            setOpenFilter(false);
          }}
          open={openFilter}
          style={{borderRadius: '4rem'}}
          PaperProps={{
            sx: {
              width: '500px',
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
                }}
              >
                <h1 style={{marginTop: '1.5rem'}}>Downloadable Fields</h1>
                <CloseIcon
                  onClick={() => {
                    setOpenFilter(false);
                  }}
                  style={{
                    marginTop: '1.4rem',
                    color: '#4f4f4f',
                    fontWeight: 'bold',
                  }}
                />
              </div>
              <div style={{padding: '2rem', paddingTop: '0rem'}}>
                <SmartForm
                  template={Filtertemplate}
                  filterbtnStyle={{
                    background: '#31bc7b',
                    borderRadius: '20px',
                    width: '50px',
                  }}
                  buttons={['csv', 'pdf', 'xls']}
                  onSubmit={handleFilter}
                  fieldsize='SMALL'
                />
              </div>
            </DialogContent>
          </div>
        </Dialog>
      </div>
    </>
  );
};

export default StandardReports;
