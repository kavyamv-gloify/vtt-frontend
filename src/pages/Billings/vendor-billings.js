import React, {useState, useEffect} from 'react';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import SummarizeIconOutlinedIcon from '@mui/icons-material/SummarizeOutlined';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import AppTooltip from '@crema/core/AppTooltip';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import Checkbox from '@mui/material/Checkbox';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {useTheme} from '@mui/material/styles';
import PropTypes from 'prop-types';
import LastPageIcon from '@mui/icons-material/LastPage';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import Api from '@api';
import SmartForm from '@smart-form';
import moment from 'moment';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';

function TablePaginationActions(props) {
  const theme = useTheme();
  const {count, page, rowsPerPage, onPageChange} = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{flexShrink: 0, ml: 2.5}}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label='first page'
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label='previous page'
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label='next page'
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label='last page'
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};
const filterTypeList = [
  {title: 'Today', value: 'Today'},
  {title: 'Weekly', value: 'Weekly'},
  {title: 'Monthly', value: 'Monthly'},
  {title: 'Custom', value: 'Custom'},
];
const defaultProps = {
  options: filterTypeList,
  getOptionLabel: (option) => option.title,
};

const Billing = () => {
  const {user} = useAuthUser();
  const [tabSelected, setTabSelected] = React.useState('Audited Data');
  const [selectedCheck, setSelectedCheck] = React.useState([]);
  const [selectedCheckFirst, setSelectedCheckFirst] = React.useState([]);
  const [accordSel, setAccordSel] = useState();
  const [corpList, setCorpList] = useState();
  const [selectedCorpList, setSelectedCorpList] = useState();
  const [openFilter, setOpenFilter] = useState(false);
  const [corpId, setCorpId] = useState();
  const [header, setHeader] = useState();
  const [openDueDate, setopenDueDate] = useState(false);
  const [data, setData] = useState();
  const [finalData, setFinalData] = useState();
  const [dates, setDates] = useState({});
  const [finalDates, setFinalDates] = useState();
  const [dateFilter, setDateFilter] = useState('Today');
  const [entity, setEntity] = useState();
  const [myActions, setMyActions] = useState([]);
  const [selData, setSelData] = useState([]);
  const [noDays, setNoOfDays] = useState(0);
  const [dueDateset, setDueDate] = useState();
console.log("data data data", data)
  // useEffect(() => {
  //   let tabValuesto = localStorage.getItem('billingFilter');
  //   var parsedData = JSON.parse(tabValuesto);
  //   console.log('parsedData', parsedData);
  //   if (parsedData?.fromDate) {
  //     setDates({
  //       fromDate: parsedData?.fromDate,
  //       toDate: parsedData?.toDate,
  //     });
  //     setDateFilter('Custom');
  //   }

  //   localStorage.removeItem('billingFilter');
  // }, []);

  function getMyData(val) {
    // const currentDate = moment(val?.fromDate).startOf('day');
    // const dueDate = moment(val?.dueDate).startOf('day');
    // const daysUntilDue = dueDate.diff(currentDate, 'days');
    // // console.log('daysUntilDue', daysUntilDue);
    // // console.log('daysUntilDue', daysUntilDue);
    // setNoOfDays(daysUntilDue + 1 || 0);

    if (!moment(val?.fromDate).isValid() || isNaN(val?.noOfDays)) {
      // Handle invalid input as needed
      setDueDate(null);
      return;
    }
    if (val?.fromDate && val?.noOfDays) {
      // Calculate the dueDate by adding numberOfDays to fromDate
      const dueDate = moment(val?.fromDate)
        .startOf('day')
        .add(val?.noOfDays - 1, 'days');

      // Return the calculated dueDate
      setDueDate(dueDate?.format('YYYY-MM-DD')); // You can format the date as needed\
    }
  }
  useEffect(() => {
    let ar = [];
    data?.map((el, i) => {
      let dd = el?.split(',');
      let tt = {};
      dd?.map((ee, ind) => {
        tt[header[ind]] = ee?.split('|')?.join(', ');
      });
      if (tt['Trip ID'] && tt['Trip ID'] != 'Trip ID') ar.push(tt);
      if (tt['Trip Id'] && tt['Trip Id'] != 'Trip Id') ar.push(tt);
    });
    setFinalData(ar);
  }, [data]);
  const navigate = useNavigate();
  const permissionCheck = useSelector(({settings}) => settings.permissions);
  useEffect(() => {
    axios
      .get(
        Api.baseUri +
          '/user-reg/associatevendor/getallassociateCorporateByVendorId/' +
          user?.userList?.profileId,
      )
      .then((re) => {
        let temp = [];
        let temp2 = [];
        let sortedProducts = re?.data?.data?.sort((p1, p2) =>
          new Date(p1.createdOn) < new Date(p2.createdOn)
            ? 1
            : new Date(p1.createdOn) > new Date(p2.createdOn)
            ? -1
            : 0,
        );
        sortedProducts?.map((el) => {
          temp2.push(el?.corporate?.id + '+' + el?.corporate?.companyName);
          temp.push({
            title: el?.corporate?.companyName,
            value: el?.corporate?.id + '+' + el?.corporate?.companyName,
          });
        });
        setCorpList(temp ?? []);
        setSelectedCorpList(temp2 ?? []);
      })
      .catch(() => {});
  }, []);
  useEffect(() => {
    if (!permissionCheck) return;
    let sub_mod = {};
    permissionCheck?.map((el) => {
      if (el.subModuleName == 'Corporates Billing') sub_mod = el;
    });
    setMyActions(sub_mod?.actions);
    if (
      (!sub_mod || !sub_mod?.actions?.includes('View')) &&
      user?.userList?.userRole !== 'SUPERADMIN'
    )
      navigate('/error-pages/error-404');
  }, [permissionCheck, user]);

  function selectClicked(d) {
    if (!selectedCheck?.includes(d)) {
      setSelectedCheck([...selectedCheck, d]);
    } else {
      let tem = selectedCheck;
      tem?.splice(tem.indexOf(d), 1);
      setSelectedCheck([...tem]);
    }
  }
  function selectClickedFirst(d) {
    if (!selectedCheckFirst?.includes(d)) {
      setSelectedCheckFirst([...selectedCheckFirst, d]);
    } else {
      let tem = selectedCheckFirst;
      tem?.splice(tem.indexOf(d), 1);
      setSelectedCheckFirst([...tem]);
    }
  }

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
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'multiSelect',
            name: 'corpId',
            field: 'corpId',
            title: 'Select Corporates',
            options: corpList ?? [],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
        ],
      },
    ],
  };
  let template2 = {
    layout: {
      column: 1,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'date',
            name: 'fromDate',
            max: 'today',
            field: 'fromDate',
            // title: 'From Date',
            title: 'Invoice Date',
            validationProps: {
              required: 'This is a mandatory field',
              manual: [
                {
                  condition: `fromDate <= today`,
                  message:
                    "Due date should be less than or equal to today's date.",
                },
              ],
            },
          },
          {
            type: 'number',
            name: 'noOfDays',
            id: 'noOfDays',
            title: 'Number of days',
            // disabled: true,
          },
          {
            type: 'date',
            name: 'dueDate',
            min: 'today',
            field: 'dueDate',
            title: 'Due Date',
            min: 'today',
            disabled: true,
            validationProps: {
              required: 'This is a mandatory field',
              manual: [
                {
                  condition: `dueDate >= today`,
                  message:
                    "Due date should be greater than or equal to today's date.",
                },
              ],
            },
          },
        ],
      },
    ],
  };

  function handleSubmit(val) {
    if (val?.button?.toUpperCase() == 'SUBMIT') {
      setSelectedCorpList(val?.data?.corpId ?? []);
    } else {
      downloadFormatData(val?.button, val?.data?.corpId);
    }
    setOpenFilter(false);
  }
  function createInvoice(dueDate, noOfDays) {
    let postData = {
      corporateId: corpId?.split('+')[0],
      vendorId: user?.userList?.profileId,
      fromDate: finalDates?.fromDate,
      toDate: finalDates?.toDate,
      dueDate: dueDate,
      noOfDays: Number(noOfDays),
      billingType:
        tabSelected == 'Audited Data'
          ? 'AUDITED'
          : tabSelected == 'Raw Data'
          ? 'RAW'
          : tabSelected == 'Vehicle Wise'
          ? 'VEHICLE'
          : 'DRIVER',
    };

    axios
      .post(
        Api?.baseUri +
          '/user-reg/invoice/saveInvoiceData?tripId=' +
          selData?.join(','),
        postData,
      )
      .then((res) => {
        if (res?.data?.status == 200) {
          toast.success('Invoice generated successfully.');
          navigate(
            `/invoice-listing-vendor/${dateFilter}/${finalDates?.fromDate}/${finalDates?.toDate}`,
          );
        } else {
          toast.error(res?.data?.message || 'Something went wrong.');
        }
      })
      .catch((err) => {
        toast.error('Something went wrong.');
      });
  }

  console.log('select data', selData);
  useEffect(() => {
    let from_date = '';
    let to_Date = '';
    if (dateFilter == 'Today') {
      from_date = moment().format('YYYY-MM-DD');
      to_Date = moment().format('YYYY-MM-DD');
    }

    if (dateFilter == 'Custom') {
      from_date = dates?.fromDate;
      to_Date = dates?.toDate;
    }

    let Weekly = getDates();
    let Monthly = getMonth();

    if (dateFilter == 'Weekly') {
      from_date = moment(Weekly?.firstDay).format('YYYY-MM-DD');
      to_Date = moment(Weekly?.lastDay).format('YYYY-MM-DD');
    }

    if (dateFilter == 'Monthly') {
      from_date = moment(Monthly?.firstDay).format('YYYY-MM-DD');
      to_Date = moment(Monthly?.lastDay).format('YYYY-MM-DD');
    }
    setFinalDates({...finalDates, fromDate: from_date, toDate: to_Date});
    let filter = '';
  }, [dateFilter, dates]);

  useEffect(() => {
    if (!finalDates?.fromDate || !finalDates?.toDate || !corpId || !tabSelected)
      return;
    if (tabSelected == 'Audited Data') {
      axios
        .get(Api.baseUri + '/user-reg/AuditBillingReport/getHeaders')
        .then((res) => {
          if (res?.data?.status == '200') {
            setHeader(res?.data?.data);
            axios
              .post(
                Api.baseUri +
                  `/user-reg/AuditBillingReport/AuditBillingReportData/${
                    finalDates?.fromDate
                  }/${finalDates?.toDate}/${user?.userList?.profileId}/${
                    corpId?.split('+')[0]
                  }?tripId&status=` +
                  selectedCheckFirst,
                res?.data?.data,
              )
              .then((res) => {
                setData(res?.data?.split('\r\n'));
              })
              .catch((err) => {});
          }
        })
        .catch((err) => {});
    }
    if (tabSelected == 'Raw Data') {
      axios
        .get(Api.baseUri + '/user-reg/RawBillingReport/getHeaders')
        .then((res) => {
          if (res?.data?.status == '200') {
            setHeader(res?.data?.data);
            axios
              .post(
                Api.baseUri +
                  `/user-reg/RawBillingReport/RawBillingReportData/${
                    finalDates?.fromDate
                  }/${finalDates?.toDate}/${user?.userList?.profileId}/${
                    corpId?.split('+')[0]
                  }?tripId=` +
                  selectedCheck,
                res?.data?.data,
              )
              .then((res) => {
                setData(res?.data?.split('\r\n'));
              })
              .catch((err) => {});
          }
        })
        .catch((err) => {});
    }
    if (tabSelected == 'Vehicle Wise') {
      axios
        .get(Api.baseUri + '/user-reg/vehicleWiseBilling/getHeaders')
        .then((res) => {
          if (res?.data?.status == '200') {
            setHeader(res?.data?.data);
            axios
              .post(
                Api.baseUri +
                  `/user-reg/vehicleWiseBilling/VehicleWiseBilling/${finalDates?.fromDate}/${finalDates?.toDate}/${user?.userList?.profileId}?tripStatus=` +
                  selectedCheckFirst,
                res?.data?.data,
              )
              .then((res) => {
                setData(res?.data?.split('\r\n'));
              })
              .catch((err) => {});
          }
        });
    }

    if (tabSelected == 'Driver Wise') {
      axios
        .get(Api.baseUri + '/user-reg/driverWiseBilling/getHeaders')
        .then((res) => {
          if (res?.data?.status == '200') {
            setHeader(res?.data?.data);
            axios
              .post(
                Api.baseUri +
                  '/user-reg/driverWiseBilling/DriverWiseBilling/' +
                  finalDates?.fromDate +
                  '/' +
                  finalDates?.toDate +
                  '/' +
                  user?.userList?.profileId +
                  '?tripStatus='+ selectedCheckFirst,
                res?.data?.data,
              )
              .then((res) => {
                if (res?.status == '200') {
                  setData(res?.data?.split('\r\n'));
                }
              })
              .catch((err) => {});
          }
        });
    }
  }, [dates, corpId, tabSelected, selectedCheck, finalDates]);

  function downloadFormatData(format, corpId) {
    let temp = [];
    corpId?.map((el) => {
      temp.push(el?.split('+')?.[0]);
    });
    if (tabSelected == 'Raw Data') {
      axios
        .post(
          Api.baseUri +
            '/user-reg/RawBillingReport/download-report/' +
            (format == 'PDF'
              ? 'PDF'
              : format == 'CSV'
              ? 'CSV'
              : format == 'EXCEL'
              ? 'EXCEL'
              : null) +
            '/' +
            finalDates?.fromDate +
            '/' +
            finalDates?.toDate +
            '?vendorId=' +
            user?.userList?.profileId +
            '&tripStatus=' +
            selectedCheck,
          header,
          {responseType: 'blob'},
        )
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response?.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute(
            'download',
            'billing_report' +
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

    if (tabSelected == 'Vehicle Wise') {
      axios
        .post(
          Api.baseUri +
            '/user-reg/vehicleWiseBilling/download-report/' +
            (format == 'PDF'
              ? 'PDF'
              : format == 'CSV'
              ? 'CSV'
              : format == 'EXCEL'
              ? 'EXCEL'
              : null) +
            '/' +
            finalDates?.fromDate +
            '/' +
            finalDates?.toDate +
            '?tripStatus=' +
            '&vendorId=' +
            user?.userList?.profileId,
          header,
          {responseType: 'blob'},
        )
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response?.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute(
            'download',
            'billing_report' +
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

    if (tabSelected == 'Driver Wise') {
      axios
        .post(
          Api.baseUri +
            '/user-reg/driverWiseBilling/download-report/' +
            (format == 'PDF'
              ? 'PDF'
              : format == 'CSV'
              ? 'CSV'
              : format == 'EXCEL'
              ? 'EXCEL'
              : null) +
            '/' +
            finalDates?.fromDate +
            '/' +
            finalDates?.toDate +
            '?tripStatus=' +
            '&vendorId=' +
            user?.userList?.profileId,
          header,
          {responseType: 'blob'},
        )
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response?.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute(
            'download',
            'billing_report' +
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
  }
  return (
    <div>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={12} sm={8} md={8} sx={{mb: 2}}>
          <Typography variant='h3' style={{display: 'flex'}} className='cursor'>
            <div
              onClick={() => {
                setTabSelected('Audited Data');
              }}
              style={{
                borderBottom:
                  tabSelected == 'Audited Data' ? '4px solid orange' : '',
                paddingBottom: '5px',
                paddingRight: '5px',
                marginRight: '15px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <SignalCellularAltIcon sx={{mr: 2}} /> <span>Audited Data</span>
            </div>
            <div
              onClick={() => {
                setTabSelected('Raw Data');
              }}
              style={{
                borderBottom:
                  tabSelected == 'Raw Data' ? '4px solid orange' : '',
                paddingBottom: '5px',
                paddingRight: '5px',
                marginRight: '15px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <SummarizeIconOutlinedIcon sx={{mr: 2}} /> <span>Raw Data</span>
            </div>
            <div
              onClick={() => {
                setTabSelected('Vehicle Wise');
              }}
              style={{
                borderBottom:
                  tabSelected == 'Vehicle Wise' ? '4px solid orange' : '',
                paddingBottom: '5px',
                paddingRight: '5px',
                marginRight: '15px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <FactCheckOutlinedIcon sx={{mr: 2}} /> <span>Vehicle Wise</span>
            </div>
            <div
              onClick={() => {
                setTabSelected('Driver Wise');
              }}
              style={{
                borderBottom:
                  tabSelected == 'Driver Wise' ? '4px solid orange' : '',
                paddingBottom: '5px',
                paddingRight: '5px',
                marginRight: '15px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <FactCheckOutlinedIcon sx={{mr: 2}} /> <span>Driver Wise</span>
            </div>
          </Typography>
          {/* <hr style={styles.hr} /> */}
        </Grid>
        <Grid item xs={12} sm={4} md={4} sx={{paddingTop: '0px !important'}}>
          <Box display='flex' justifyContent='flex-end' alignItems='center'>
            <div
              className='left-seperator'
              style={{display: 'flex', justifyContent: 'space-between'}}
            >
              <Autocomplete
                {...defaultProps}
                defaultValue={filterTypeList[0]}
                options={filterTypeList}
                onChange={(e, v) => {
                  setDateFilter(v?.value);
                }}
                fullWidth
                // style={{ marginRight: '22px', marginTop: '0px', fullWidth }}
                id='include-input-in-list'
                renderInput={(params) => (
                  <TextField
                    {...params}
                    InputProps={{
                      ...params.InputProps,
                      // startAdornment: (
                      //     <InputAdornment position="start"><BloodtypeIcon style={{ fontSize: '24px', color: 'grey' }} /> </InputAdornment>
                      // ),
                    }}
                    variant='standard'
                  />
                )}
              />
              {dateFilter == 'Custom' && (
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <TextField
                    type='date'
                    // value={dates?.fromDate}
                    onChange={(e, v) => {
                      setDates({...dates, fromDate: e?.target?.value});
                    }}
                    id='outlined-error-helper-text'
                    size='small'
                    fullWidth
                  />
                  <TextField
                    type='date'
                    // value={dates?.fromDate}
                    onChange={(e, v) => {
                      setDates({...dates, toDate: e?.target?.value});
                    }}
                    id='outlined-error-helper-text'
                    size='small'
                    fullWidth
                  />
                </div>
              )}
              <AppTooltip placement={'top'} title={'Filter'}>
                <TuneOutlinedIcon
                  className='title-icons-mui'
                  onClick={() => {
                    setOpenFilter(true);
                    setEntity('FILTER');
                  }}
                />
              </AppTooltip>
            </div>
            <div>
              {myActions?.includes('Download And Upload') && (
                <AppTooltip placement={'top'} title={'Download'}>
                  <ArrowCircleDownIcon
                    className='title-icons-mui'
                    sx={{mr: 3}}
                    onClick={() => {
                      setEntity('DOWNLOAD');
                      setOpenFilter(true);
                    }}
                  />
                </AppTooltip>
              )}
            </div>
          </Box>
        </Grid>
      </Grid>
      <div
        style={{
          background: 'white',
          padding: '15px',
          marginTop: '-20px',
          paddingTop: '30px',
          paddingBottom: '30px',
        }}
      >
        {(tabSelected == 'Audited Data' || tabSelected == 'Vehicle Wise' || tabSelected == 'Driver Wise' ) && (
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <div
              style={{
                marginLeft: '10px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {/* <span
                className='pointer'
                onClick={(e) => {
                  selectClickedFirst('STARTED');
                }}
              >
                <Checkbox
                  checked={selectedCheckFirst?.includes('STARTED')}
                  sx={{ml: 2}}
                />{' '}
                <span>Incomplete Trips</span>
              </span> */}
              <span
                className='pointer'
                onClick={(e) => {
                  selectClickedFirst('NOSHOW');
                }}
              >
                <Checkbox
                  checked={selectedCheckFirst?.includes('NOSHOW')}
                  sx={{ml: 2}}
                />{' '}
                <span>NoShow</span>
              </span>
              <span
                className='pointer'
                onClick={(e) => {
                  selectClickedFirst('CANCLED');
                }}
              >
                <Checkbox
                  checked={selectedCheckFirst?.includes('CANCLED')}
                  sx={{ml: 2}}
                />{' '}
                <span>Cancelled</span>
              </span>
              <span
                className='pointer'
                onClick={(e) => {
                  selectClickedFirst('STARTED');
                }}
              >
                <Checkbox
                  checked={selectedCheckFirst?.includes('STARTED')}
                  sx={{ml: 2}}
                />{' '}
                <span>Started</span>
              </span>
              <span
                className='pointer'
                onClick={(e) => {
                  selectClickedFirst('ABSENT');
                }}
              >
                <Checkbox
                  checked={selectedCheckFirst?.includes('ABSENT')}
                  sx={{ml: 2}}
                />{' '}
                <span>Absent</span>
              </span>
              <span
                className='pointer'
                onClick={(e) => {
                  selectClickedFirst('SCHEDULE');
                }}
              >
                <Checkbox
                  checked={selectedCheckFirst?.includes('SCHEDULE')}
                  sx={{ml: 2}}
                />{' '}
                <span>Not Executed</span>
              </span>
              <span
                className='pointer'
                onClick={(e) => {
                  selectClickedFirst('COMPLETED');
                }}
              >
                <Checkbox
                  checked={selectedCheckFirst?.includes('COMPLETED')}
                  sx={{ml: 2}}
                />{' '}
                <span>Completed</span>
              </span>
            </div>
            <Button
              disabled={!selData?.length}
              variant='contained'
              onClick={() => {
                setopenDueDate(true);
              }}
            >
              Generate Invoice
            </Button>
          </div>
        )}
        {tabSelected == 'Raw Data' && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {' '}
            <div
              style={{
                marginLeft: '10px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span
                className='pointer'
                onClick={(e) => {
                  selectClicked('');
                }}
              >
                <Checkbox checked={selectedCheck?.includes('')} sx={{ml: 2}} />{' '}
                <span>Unaudited Data</span>
              </span>
              {/* <span
                className='pointer'
                onClick={(e) => {
                  selectClicked('INCOMPLETE');
                }}
              >
                <Checkbox
                  checked={selectedCheck?.includes('INCOMPLETE')}
                  sx={{ml: 2}}
                />{' '}
                <span>Incomplete Trips</span>
              </span> */}
              <span
                className='pointer'
                onClick={(e) => {
                  selectClicked('NOSHOW');
                }}
              >
                <Checkbox
                  checked={selectedCheck?.includes('NOSHOW')}
                  sx={{ml: 2}}
                />{' '}
                <span>NoShow</span>
              </span>
              <span
                className='pointer'
                onClick={(e) => {
                  selectClicked('CANCLED');
                }}
              >
                <Checkbox
                  checked={selectedCheck?.includes('CANCLED')}
                  sx={{ml: 2}}
                />{' '}
                <span>Cancelled</span>
              </span>
              <span
                className='pointer'
                onClick={(e) => {
                  selectClicked('ABSENT');
                }}
              >
                <Checkbox
                  checked={selectedCheck?.includes('ABSENT')}
                  sx={{ml: 2}}
                />{' '}
                <span>Absent</span>
              </span>
              <span
                className='pointer'
                onClick={(e) => {
                  selectClicked('SCHEDULE');
                }}
              >
                <Checkbox
                  checked={selectedCheck?.includes('SCHEDULE')}
                  sx={{ml: 2}}
                />{' '}
                <span>Not Executed</span>
              </span>
            </div>
            <Button
              disabled={!selData?.length}
              variant='contained'
              onClick={() => {
                setopenDueDate(true);
              }}
            >
              Generate Invoice
            </Button>
          </div>
        )}
        <div style={{marginTop: '15px'}}>
          {selectedCorpList?.map((el, ind) => {
            return (
              <Accordion expanded={accordSel == ind} sx={{mb: 2}}>
                <AccordionSummary
                  style={{paddingLeft: '15px'}}
                  aria-controls='panel1a-content'
                  expandIcon={<ExpandMoreIcon />}
                  id={ind + 'panel1a-header'}
                  onClick={(e) => {
                    if (accordSel != ind) setAccordSel(ind);
                    else setAccordSel(null);
                    setCorpId(el);
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span>{el?.split('+')?.[1]}</span>
                  </div>
                </AccordionSummary>
                <AccordionDetails style={{padding: '0px'}}>
                  <Typography>
                    <div style={{marginTop: '15px'}}>
                      <TableContainer
                        style={{
                          boxShadow:
                            'rgba(0, 0, 0, 0) 0px 2px 4px, rgba(0, 0, 0, 0) 0px 7px 13px -3px, rgb(0,102,133) 0px -3px 0px inset',
                        }}
                      >
                        <Table sx={{minWidth: 650}} aria-label='simple table'>
                          <TableHead style={{background: '#f1f1f1'}}>
                            <TableRow>
                              <TableCell align='left'>
                                <Checkbox
                                  checked={selData?.length == finalData?.length}
                                  onChange={() => {
                                    if (selData?.length == finalData?.length) {
                                      setSelData([]);
                                    } else {
                                      let tt = [];
                                      finalData?.map((el, i) => {
                                        tt.push(el['Trip Id']);
                                      });
                                      setSelData([...tt]);
                                    }
                                  }}
                                />
                              </TableCell>
                              {header?.map((el) => {
                                if (el == 'Trip Id') return;
                                return <TableCell> {el} </TableCell>;
                              })}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {finalData?.map((el, i) => {
                              return (
                                <>
                                  <TableRow align='center'>
                                    <TableCell align='left'>
                                      <Checkbox
                                        checked={selData?.includes(
                                          el['Trip Id'],
                                        )}
                                        onChange={(e) => {
                                          if (
                                            selData?.includes(el['Trip Id'])
                                          ) {
                                            let arr = selData;
                                            selData.splice(
                                              selData.indexOf(el['Trip Id']),
                                              1,
                                            );
                                            setSelData([...arr]);
                                          } else {
                                            setSelData([
                                              ...selData,
                                              el['Trip Id'],
                                            ]);
                                          }
                                        }}
                                      />
                                    </TableCell>
                                    {Object.keys(el)?.map((_el) => {
                                      if (_el == 'Trip Id') return;
                                      return (
                                        <TableCell align='left'>
                                          {el[_el] || '----'}
                                        </TableCell>
                                      );
                                    })}
                                  </TableRow>
                                </>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
                  </Typography>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </div>
      </div>

      <Dialog
        open={openFilter}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '500px',
            height: '300px',
          },
        }}
        style={{borderRadius: '4rem'}}
      >
        <DialogTitle
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            background: '#f5f2f2',
          }}
        >
          <h1>filter</h1>
          <CloseIcon
            onClick={() => {
              setOpenFilter(false);
            }}
            style={{color: '#4f4f4f', fontWeight: 'bold'}}
          />
        </DialogTitle>
        <DialogContent style={{padding: '20px', paddingTop: '0px'}}>
          {corpList && selectedCorpList && (
            <SmartForm
              template={template}
              defaultValues={{corpId: selectedCorpList}}
              onSubmit={handleSubmit}
              filterbtnStyle={{
                maxHeight: '36px',
                marginLeft: '5px',
                marginTop: '26px',
                backgroundColor: '#006685',
              }}
              buttons={
                entity == 'FILTER' ? ['submit'] : ['CSV', 'EXCEL', 'PDF']
              }
              mode='onTouched'
            />
          )}
        </DialogContent>
      </Dialog>
      {openDueDate && (
        <Dialog
          open={true}
          maxWidth='false'
          PaperProps={{
            sx: {
              width: '500px',
            },
          }}
          style={{borderRadius: '4rem'}}
        >
          <DialogTitle
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              background: '#f5f2f2',
            }}
          >
            <h1>Generate Invoice</h1>
            <CloseIcon
              onClick={() => {
                setopenDueDate(false);
              }}
              style={{color: '#4f4f4f', fontWeight: 'bold'}}
            />
          </DialogTitle>
          <DialogContent style={{padding: '0px 20px 20px 20px'}}>
            <SmartForm
              defaultValues={{
                dueDate: dueDateset,
              }}
              template={template2}
              onSubmit={(val) => {
                createInvoice(val?.data?.dueDate, val?.data?.noOfDays);
                setopenDueDate(false);
              }}
              getOnInput={getMyData}
              setVal={[{name: 'dueDate', value: dueDateset}]}
              buttons={['submit']}
              mode='onTouched'
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Billing;
