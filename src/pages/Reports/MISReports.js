import React, {useEffect, useState} from 'react';
import SmartForm from '@smart-form';
import moment from 'moment';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import {Button, Grid} from '@mui/material';
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
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import AppLoader from '@crema/core/AppLoader';
import {useAuthUser} from '@crema/utility/AuthHooks';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
// import moment from 'moment';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
const MISReports = ({myActions}) => {
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
  let reportCategory = [
    {title: 'Shift Report', value: 'Shift Report'},
    {title: 'NO Show Report', value: 'NO Show Report'},
    {title: 'Safe Reach', value: 'Safe Reach'},
    {title: 'Escort Usage Report', value: 'Escort Usage Report'},
    {title: 'Adhoc Report', value: 'Adhoc Report'},
    {title: 'Employee Usage Report', value: 'Employee Usage Report'},
    {title: 'Speeding Report', value: 'Speeding Report'},
    {title: 'Login Logout Report', value: 'Login Logout Report'},
    // { title: "Raw Billing Report", value: "Raw Billing Report" },
    {title: 'SMS Usage Report', value: 'Sms Usage Report'},
    {title: 'IVR Report', value: 'IVR Report'},
  ];

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
            title: 'Reports',
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

  function getAllList(reportType, dateType, fromDate, toDate) {
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
    if (reportType == 'NO Show Report')
      temp_url = {
        get: Api.baseUri + '/user-reg/noshowReport/getHeaders',
        post:
          Api.baseUri +
          '/user-reg/noshowReport/noshowTrips/' +
          date?.fromDate +
          '/' +
          (dateType == 'Today' ? date?.fromDate : date?.toDate),
      };
    if (reportType == 'Shift Report')
      temp_url = {
        get: Api.baseUri + '/user-reg/shiftReport/getHeaders',
        post:
          Api.baseUri +
          '/user-reg/shiftReport/shiftWiseTrips/' +
          date?.fromDate +
          '/' +
          (dateType == 'Today' ? date?.fromDate : date?.toDate),
      };
    if (reportType == 'Safe Reach')
      temp_url = {
        get: Api.baseUri + '/user-reg/SafeReachReport/getHeaders',
        post:
          Api.baseUri +
          '/user-reg/SafeReachReport/safeReachReport/' +
          date?.fromDate +
          '/' +
          (dateType == 'Today' ? date?.fromDate : date?.toDate),
      };
    if (reportType == 'Escort Usage Report')
      temp_url = {
        get: Api.baseUri + '/user-reg/EscortUsageReport/getHeaders',
        post:
          Api.baseUri +
          '/user-reg/EscortUsageReport/EscortUsageReport/' +
          date?.fromDate +
          '/' +
          (dateType == 'Today' ? date?.fromDate : date?.toDate),
      };
    if (reportType == 'Adhoc Report')
      temp_url = {
        get: Api.baseUri + '/user-reg/adhocReport/getHeaders',
        post:
          Api.baseUri +
          '/user-reg/adhocReport/adhocTrips/' +
          date?.fromDate +
          '/' +
          (dateType == 'Today' ? date?.fromDate : date?.toDate),
      };
    if (reportType == 'Speeding Report')
      temp_url = {
        get: Api.baseUri + '/user-reg/speedingReport/getHeaders',
        post:
          Api.baseUri +
          '/user-reg/speedingReport/speedingTrips/' +
          date?.fromDate +
          '/' +
          (dateType == 'Today' ? date?.fromDate : date?.toDate),
      };
    if (reportType == 'Employee Usage Report')
      temp_url = {
        get: Api.baseUri + '/user-reg/empUsageReport/getHeaders',
        post:
          Api.baseUri +
          '/user-reg/empUsageReport/list/' +
          date?.fromDate +
          '/' +
          (dateType == 'Today' ? date?.fromDate : date?.toDate),
      };
    if (reportType == 'Login Logout Report')
      temp_url = {
        get: Api.baseUri + '/user-reg/LoginLogoutReport/getHeaders',
        post:
          Api.baseUri +
          '/user-reg/LoginLogoutReport/LoginLogoutReportReport/' +
          date?.fromDate +
          '/' +
          (dateType == 'Today' ? date?.fromDate : date?.toDate),
      };
    if (reportType == 'Raw Billing Report')
      temp_url = {
        get: Api.baseUri + '/user-reg/RawBillingReport/getHeaders',
        post:
          Api.baseUri +
          '/user-reg/RawBillingReport/RawBillingReport/' +
          date?.fromDate +
          '/' +
          (dateType == 'Today' ? date?.fromDate : date?.toDate),
      };
    if (reportType == 'Sms Usage Report')
      temp_url = {
        get: Api.baseUri + '/usernotify/smsReport/getHeaders',
        post:
          Api.baseUri +
          '/usernotify/smsReport/smsHistory/' +
          date?.fromDate +
          '/' +
          (dateType == 'Today' ? date?.fromDate : date?.toDate) +
          '/' +
          user?.userList?.corporateId +
          '/null',
      };
    if (reportType == 'IVR Report')
      temp_url = {
        get: Api.baseUri + '/user-reg/ivrReport/getHeaders',
        post:
          Api.baseUri +
          '/user-reg/ivrReport/ivrHistory/' +
          date?.fromDate +
          '/' +
          (dateType == 'Today' ? date?.fromDate : date?.toDate) +
          '/' +
          user?.userList?.corporateId,
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
            })
            .catch((err) => {});
        }
      })
      .catch((err) => {});
  }

  const handleDownload = () => {
    let temp_url = '';
    if (reportType == 'NO Show Report')
      temp_url = Api.baseUri + '/user-reg/noshowReport/download-report/';
    if (reportType == 'Shift Report')
      temp_url = Api.baseUri + '/user-reg/shiftReport/download-report/';
    if (reportType == 'Safe Reach')
      temp_url = Api.baseUri + '/user-reg/SafeReachReport/download-report/';
    if (reportType == 'Escort Usage Report')
      temp_url = Api.baseUri + '/user-reg/EscortUsageReport/download-report/';
    if (reportType == 'Adhoc Report')
      temp_url = Api.baseUri + '/user-reg/adhocReport/download-report/';
    if (reportType == 'Speeding Report')
      temp_url = Api.baseUri + '/user-reg/speedingReport/download-report/';
    if (reportType == 'Employee Usage Report')
      temp_url = Api.baseUri + '/user-reg/empUsageReport/download-report/';
    if (reportType == 'Login Logout Report')
      temp_url = Api.baseUri + '/user-reg/LoginLogoutReport/download-report/';
    if (reportType == 'Raw Billing Report')
      temp_url = Api.baseUri + '/user-reg/RawBillingReport/download-report/';
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
          (reportType == 'NO Show Report'
            ? 'no_show_report'
            : reportType == 'Shift Report'
            ? 'shift_report'
            : reportType == 'Safe Reach'
            ? 'safe_reach_report'
            : reportType == 'Escort Usage Report'
            ? 'escort_usage_report'
            : reportType == 'Adhoc Report'
            ? 'adhoc_report'
            : reportType == 'Speeding Report'
            ? 'speeding_report'
            : reportType == 'Employee Usage Report'
            ? 'employee_usage_report'
            : reportType == 'Login Logout Report'
            ? 'login_logout_report'
            : reportType == 'Raw Billing Report'
            ? 'raw_billing_report'
            : 'sms_usage_report') +
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
    if (reportType == 'Sms Usage Report') {
      axios
        .post(
          Api.baseUri +
            '/usernotify/smsReport/download-report/' +
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
            (date?.dateType == 'Today' ? date?.fromDate : date?.toDate) +
            '/' +
            user?.userList?.corporateId +
            '/null',
          header,
          {responseType: 'blob'},
        )
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute(
            'download',
            'sms_usage_report' +
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
    if (reportType == 'IVR Report') {
      axios
        .post(
          Api.baseUri +
            '/user-reg/ivrReport/download-report/' +
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
            (date?.dateType == 'Today' ? date?.fromDate : date?.toDate) +
            '/' +
            user?.userList?.corporateId,
          header,
          {responseType: 'blob'},
        )
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute(
            'download',
            'ivr_report' +
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
    if (reportType == 'NO Show Report')
      temp_url = Api.baseUri + '/user-reg/noshowReport/download-report/';
    if (reportType == 'Shift Report')
      temp_url = Api.baseUri + '/user-reg/shiftReport/download-report/';
    if (reportType == 'Safe Reach')
      temp_url = Api.baseUri + '/user-reg/SafeReachReport/download-report/';
    if (reportType == 'Escort Usage Report')
      temp_url = Api.baseUri + '/user-reg/EscortUsageReport/download-report/';
    if (reportType == 'Adhoc Report')
      temp_url = Api.baseUri + '/user-reg/adhocReport/download-report/';
    if (reportType == 'Speeding Report')
      temp_url = Api.baseUri + '/user-reg/speedingReport/download-report/';
    if (reportType == 'Employee Usage Report')
      temp_url = Api.baseUri + '/user-reg/empUsageReport/download-report/';
    if (reportType == 'Login Logout Report')
      temp_url = Api.baseUri + '/user-reg/LoginLogoutReport/download-report/';
    if (reportType == 'Raw Billing')
      temp_url = Api.baseUri + '/usernotify/smsReport/download-report/';
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
          (reportType == 'NO Show Report'
            ? 'no_show_report'
            : reportType == 'Shift Report'
            ? 'shift_report'
            : reportType == 'Safe Reach'
            ? 'safe_reach_report'
            : reportType == 'Escort Usage Report'
            ? 'escort_usage_report'
            : reportType == 'Adhoc Report'
            ? 'adhoc_report'
            : reportType == 'Speeding Report'
            ? 'speeding_report'
            : reportType == 'Employee Usage Report'
            ? 'employee_usage_report'
            : reportType == 'Login Logout Report'
            ? 'login_logout_report'
            : reportType == 'Raw Billing Report'
            ? 'raw_billing_report'
            : 'sms_usage_report') +
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

    if (reportType == 'Sms Usage Report') {
      axios
        .post(
          Api.baseUri +
            '/usernotify/smsReport/download-report/' +
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
            (date?.dateType == 'Today' ? date?.fromDate : date?.toDate) +
            '/' +
            user?.userList?.corporateId +
            '/null',
          val?.data?.reportType,
          {responseType: 'blob'},
        )
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute(
            'download',
            'sms_usage_report' +
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

    if (reportType == 'IVR Report') {
      axios
        .post(
          Api.baseUri +
            '/user-reg/ivrReport/download-report/' +
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
            (date?.dateType == 'Today' ? date?.fromDate : date?.toDate) +
            '/' +
            user?.userList?.corporateId,
          val?.data?.reportType,
          {responseType: 'blob'},
        )
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute(
            'download',
            'ivr_report' +
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
  return (
    <>
      <div style={{background: 'white'}}>
        <div className='route-list' style={{padding: '20px'}}>
          <div
            className='route-search'
            style={{
              boxShadow:
                ' rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px',
            }}
          >
            {!showbtn ? <AppLoader /> : null}
            <SmartForm
              template={template}
              filterbtnStyle={{
                maxHeight: '36px',
                marginLeft: '5px',
                marginTop: '26px',
                backgroundColor: '#006685',
              }}
              buttons={['submit']}
              onSubmit={handleSubmit}
              showbtn={showbtn}
              fieldsize='SMALL'
            />
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
                  {/* myActions?.includes('Download And Upload') && */}
                  {
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
                  }
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label='simple table'>
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
                                  <TableCell align='center'>
                                    {' '}
                                    {_el?.length ? _el : '----'}{' '}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          )}
                        </>
                      );
                    })}
                  </TableBody>
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

export default MISReports;
