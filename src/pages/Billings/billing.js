import React, {useState, useEffect} from 'react';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import SummarizeIconOutlinedIcon from '@mui/icons-material/SummarizeOutlined';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
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
import {useAuthUser} from '@crema/utility/AuthHooks';

// const header = ["Vehicle Type", 'Vehicle Number', 'Route Number', 'Date', 'Working Shift Day', 'Office Location', 'Trip Code']

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
  const [selectedCheck, setSelectedCheck] = React.useState(['NOSHOW']);
  const [selectedCheckFirst, setSelectedCheckFirst] = React.useState([
    'NOSHOW',
  ]);
  const [accordSel, setAccordSel] = useState();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [vendorList, setVendorList] = useState();
  const [selectedVendorList, setSelectedVendorList] = useState();
  const [openFilter, setOpenFilter] = useState(false);
  const [vendorId, setVendorId] = useState();
  const [header, setHeader] = useState();
  const [data, setData] = useState();
  const [list, setList] = useState(false);
  const [dates, setDates] = useState();
  const [finalDates, setFinalDates] = useState();
  const [dateFilter, setDateFilter] = useState('Today');
  const [vendor, setVendor] = useState();
  const [entity, setEntity] = useState();
  const [myActions, setMyActions] = useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const navigate = useNavigate();
  const permissionCheck = useSelector(({settings}) => settings.permissions);
  useEffect(() => {
    if (!permissionCheck) return;
    let sub_mod = {};
    permissionCheck?.map((el) => {
      if (el.subModuleName == 'Billing') sub_mod = el;
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
      console.log('tem', tem);
      setSelectedCheckFirst([...tem]);
    }
  }
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
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
  useEffect(() => {
    axios
      .get(Api.baseUri + '/user-reg/associatevendor/getallassociatecorporateId')
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
          temp2.push(el?.vendorId + '+' + el?.vendorName);
          temp.push({
            title: el?.vendorName,
            value: el?.vendorId + '+' + el?.vendorName,
          });
        });
        setVendorList(temp ?? []);
        setSelectedVendorList(temp2 ?? []);
      })
      .catch((err) => {
        setVendorList([]);
        setSelectedVendorList([]);
      });
  }, []);

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
            name: 'vendorId',
            field: 'vendorId',
            title: 'Select Fields',
            options: vendorList ?? [],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
        ],
      },
    ],
  };

  function handleSubmit(val) {
    if (val?.button?.toUpperCase() == 'SUBMIT') {
      setSelectedVendorList(val?.data?.vendorId ?? []);
    } else {
      downloadFormatData(val?.button, val?.data?.vendorId);
    }
    setOpenFilter(false);
  }

  useEffect(() => {
    if (!vendorId?.split('+')?.length) return;
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
    if (tabSelected == 'Audited Data') {
      axios
        .get(Api.baseUri + '/user-reg/AuditBillingReport/getHeaders')
        .then((res) => {
          if (res?.data?.status == '200') {
            setHeader(res?.data?.data);
            axios
              .post(
                Api.baseUri +
                  '/user-reg/AuditBillingReport/AuditBillingReport/' +
                  from_date +
                  '/' +
                  to_Date +
                  '/' +
                  vendorId?.split('+')?.[0] +
                  '?tripStatus=' +
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
                  '/user-reg/RawBillingReport/RawBillingReport/' +
                  from_date +
                  '/' +
                  to_Date +
                  '/' +
                  vendorId?.split('+')?.[0] +
                  '?tripStatus=' +
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
                  '/user-reg/vehicleWiseBilling/VehicleWiseBilling/' +
                  from_date +
                  '/' +
                  to_Date +
                  '/' +
                  vendorId?.split('+')?.[0] +
                  '?tripStatus='+
                  selectedCheck,
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
                  from_date +
                  '/' +
                  to_Date +
                  '/' +
                  vendorId?.split('+')?.[0] +
                  '?tripStatus=' + selectedCheckFirst,
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
  }, [selectedCheck, vendorId, dateFilter, tabSelected]);

  function downloadFormatData(format, vendorId) {
    let temp = [];
    vendorId?.map((el) => {
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
            temp +
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
            temp,
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
            temp,
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
                    }}
                    variant='standard'
                  />
                )}
              />
              {dateFilter == 'Custom' && (
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <TextField
                    type='date'
                    onChange={(e, v) => {
                      setDates({...dates, fromDate: e?.target?.value});
                    }}
                    // error
                    id='outlined-error-helper-text'
                    // label="Error"
                    size='small'
                    fullWidth
                  />
                  <TextField
                    type='date'
                    // inputProps={{
                    //     min: moment().format("YYYY-MM-DD")
                    // }}
                    onChange={(e, v) => {
                      setDates({...dates, toDate: e?.target?.value});
                    }}
                    // error
                    id='outlined-error-helper-text'
                    // label="Error"
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
        {(tabSelected == 'Audited Data' || tabSelected == 'Driver Wise') && (
          <div
            style={{marginLeft: '10px', display: 'flex', alignItems: 'center'}}
          >
            <span
              className='pointer'
              onClick={(e) => {
                selectClickedFirst('INCOMPLETE');
              }}
            >
              <Checkbox
                checked={selectedCheckFirst?.includes('INCOMPLETE')}
                sx={{ml: 2}}
              />{' '}
              <span>Incomplete Trips</span>
            </span>
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
        )}
        {(tabSelected == 'Raw Data' || tabSelected == "Vehicle Wise") && (
          <div
            style={{marginLeft: '10px', display: 'flex', alignItems: 'center'}}
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
        )}
        <div style={{marginTop: '15px'}}>
          {selectedVendorList?.map((el, ind) => {
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
                    setVendorId(el);
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
                              {header?.map((el) => {
                                return <TableCell> {el} </TableCell>;
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
                                          <TableCell align='left'>
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
        <div>
          <DialogTitle
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              background: '#f5f2f2',
              height: '4rem',
              paddingRight: '1.5rem',
              paddingLeft: '1.5rem',
              width: '500px',
              position: 'fixed',
              zIndex: '9',
              borderRadius: '5px 5px 0px 0px',
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
          <DialogContent style={{padding: '0px', marginTop: '20px'}}>
            <div style={{padding: '1rem'}}>
              {vendorList && selectedVendorList && (
                <SmartForm
                  template={template}
                  defaultValues={{vendorId: selectedVendorList}}
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
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </div>
  );
};

export default Billing;
