import React, {useEffect, useRef, useState} from 'react';
import {Box, Button, Grid, Tab, Tabs} from '@mui/material';
import HorizentalBar from './horizontalline';
import {useTheme} from '@mui/material/styles';
import {
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
import './style.css';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import {useNavigate} from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import PropTypes from 'prop-types';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LineGraph from './linechart';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import axios from 'axios';
import Api from '@api';
import moment from 'moment';
import _ from 'lodash';
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
const Tab1 = ({dateRange}) => {
  const [value, setValue] = React.useState('one');
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [tabSelected, setTabSelected] = React.useState(0);
  const [page, setPage] = React.useState(0);
  const [dropDown, setDropDown] = useState(false);
  const [info, setInfo] = useState();
  const [Count, setCount] = useState(0);
  const [callCount, setCallCount] = useState({
    Completed: 0,
    Missed: 0,
    ComDuration: 0,
    Employee: 0,
    Driver: 0,
    EmpDuration: 0,
    DriverDuration: 0,
  });
  const [duration, setDuration] = useState({});
  const header = [
    'Trip Id',
    'Shift Name',
    'Shift Type',
    'Dialer',
    'Receiver',
    'Call Type',
    'Vehicle Number',
    'Call Duration',
  ];
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  function getAllD(_page, _rowsPerPage) {
    let postData = {
      pageNo: _page + 1,
      pageSize: _rowsPerPage,
      from: dateRange?.fromDate,
      to: dateRange?.toDate,
    };
    axios
      .post(Api.baseUri + '/api/dashboard/ivr/ivrCallsFilter', postData)
      .then((res) => {
        setInfo([...res?.data?.data] || []);
        setCount(res?.data?.totalItems || 0);
      })
      .catch((err) => {
        setInfo([]);
        setCount(0);
      });
  }
  useEffect(() => {
    if (dateRange?.toDate && dateRange?.fromDate) getAllD(page, rowsPerPage);
  }, [page, dateRange]);

  useEffect(() => {
    if (dateRange?.toDate && dateRange?.fromDate) getAllD(0, rowsPerPage);
  }, [rowsPerPage]);

  function CallDuration(starttime, endtime) {
    var a = moment(endtime);
    var b = moment(starttime);
    return a.diff(b, 'minutes');
  }

  useEffect(() => {
    if (!dateRange?.fromDate && !dateRange?.toDate) return;
    let postData = {
      pageNo: 1,
      pageSize: 1000,
      to: dateRange?.toDate,
      from: dateRange?.fromDate,
    };
    axios
      .post(Api.baseUri + '/api/dashboard/ivr/ivrCallsDataCount', postData)
      .then((res) => {
        let tem = res?.data?.data[0] || {};
        if (!_.isEmpty(tem)) setCallCount({...tem});
      })
      .catch((err) => {
        setCallCount({
          Completed: 0,
          Missed: 0,
          ComDuration: 0,
          Employee: 0,
          Driver: 0,
          EmpDuration: 0,
          DriverDuration: 0,
        });
      });
  }, [dateRange]);
  return (
    <div
      style={{
        padding: '10px',
        background: 'white',
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
        // marginTop: '-10px',
      }}
    >
      <Box sx={{width: '100%', marginTop: '10px'}}>
        <Grid container rowSpacing={2} columnSpacing={{xs: 4}}>
          <Grid item xs={12} sm={2} md={2}>
            <div className='card-with-icon'>
              <div className='cwi-bg'>
                <img src='/assets/images/ivricon.png' alt='P' />
              </div>
              <div className='cwi-title'>
                <p style={{fontSize: '18px'}}>
                  {callCount?.Completed + callCount?.Missed}
                </p>
                <p className='time-section-left'>
                  <AccessTimeIcon style={{fontSize: '12px'}} />
                  {callCount?.ComDuration +
                    (callCount?.ComDuration > 1 ? ' Mins' : ' Min')}
                </p>
                <p style={{fontSize: '18px'}}>Total IVRs Call</p>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={10} md={10}>
            <div className='card-normal' style={{minHeight: '210px'}}>
              <div className='card-title'>IVRS call</div>
              <Box sx={{width: '100%'}}>
                <Grid container rowSpacing={0} columnSpacing={{xs: 0}}>
                  <Grid item xs={12} sm={3} md={3}>
                    <HorizentalBar
                      total={callCount?.Completed + callCount?.Missed}
                      // iconStyle={{background:'#049f60'}}
                      completed={callCount?.Completed || 0}
                      icon='/assets/images/travelling.png'
                      barColor='#049f60'
                      time={
                        callCount?.ComDuration +
                        (callCount?.ComDuration > 1 ? ' Mins' : ' Min')
                      }
                      title='Answered'
                    />
                  </Grid>
                  <Grid item xs={12} sm={3} md={3}>
                    <HorizentalBar
                      total={callCount?.Completed + callCount?.Missed}
                      // iconStyle={{background:'#fd9b01'}}
                      completed={callCount?.Missed}
                      icon='/assets/images/travelling.png'
                      time={'-- Min'}
                      barColor='#fd9b01'
                      title='Missed'
                    />
                  </Grid>
                  <Grid item xs={12} sm={3} md={3}>
                    <HorizentalBar
                      total={callCount?.Completed + callCount?.Missed}
                      completed={callCount?.Driver}
                      // iconStyle={{background:'#05653f'}}
                      icon='/assets/images/travelling.png'
                      time={
                        callCount?.DriverDuration +
                        (callCount?.DriverDuration > 1 ? ' Mins' : ' Min')
                      }
                      barColor='#05653f'
                      title='By Driver'
                    />
                  </Grid>
                  <Grid item xs={12} sm={3} md={3}>
                    <HorizentalBar
                      total={callCount?.Completed + callCount?.Missed}
                      completed={callCount?.Employee}
                      icon='/assets/images/travelling.png'
                      // iconStyle={{background:'#049f60'}}
                      barColor='#049f60'
                      time={
                        callCount?.EmpDuration +
                        (callCount?.EmpDuration > 1 ? ' Mins' : ' Min')
                      }
                      title='By Employee'
                    />
                  </Grid>
                </Grid>
              </Box>
            </div>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{width: '100%', mt: 8}}>
        <div
          style={{
            paddingTop: '20px',
            marginBottom: '20px',
            fontSize: '18px',
            marginLeft: '5px',
            fontWeight: 600,
          }}
        >
          <span style={{borderBottom: '4px solid orange'}}>IVRs</span> Call
          Report
        </div>
        <LineGraph dateRange={dateRange} />
        <div className='box2-tab1' style={{marginTop: '25px'}}>
          <div
            style={{
              paddingTop: '20px',
              marginBottom: '20px',
              fontSize: '18px',
              marginLeft: '5px',
              fontWeight: 600,
            }}
          >
            <span style={{borderBottom: '4px solid orange'}}>IVRs</span> Call
            Records
          </div>
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
                {info?.map((el, i) => {
                  return (
                    <TableRow style={{background: i % 2 == 0 ? '' : '#f5f7ff'}}>
                      <TableCell> {el?.trip?.tripCode} </TableCell>
                      <TableCell> {el?.trip?.shiftName} </TableCell>
                      <TableCell>
                        {' '}
                        {el?.trip?.tripType == 'DOWNTRIP'
                          ? 'Logout'
                          : 'Login'}{' '}
                      </TableCell>
                      <TableCell> {el?.callFrom?.firstName} </TableCell>
                      <TableCell> {el?.callTo?.name} </TableCell>
                      <TableCell>
                        {' '}
                        {el?.callType == 'dte'
                          ? 'Driver to Employee'
                          : 'Employee to Driver'}{' '}
                      </TableCell>
                      <TableCell> {el?.trip?.vehicleNo} </TableCell>
                      <TableCell>
                        {' '}
                        {el.duration ? (el.duration / 60)?.toFixed(2) : 0}{' '}
                      </TableCell>
                      {/* CallDuration(el?.startTime, el?.endTime) */}
                    </TableRow>
                  );
                })}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[1, 5, 10, 25]}
                    colSpan={8}
                    count={Count} //rows.length
                    rowsPerPage={rowsPerPage} //rowsPerPage
                    page={page} //page
                    SelectProps={{
                      inputProps: {
                        'aria-label': 'rows per page',
                      },
                      native: true,
                    }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </div>
      </Box>
    </div>
  );
};

export default Tab1;
