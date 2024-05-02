import React, {useEffect, useState} from 'react';
import SmartForm from '@smart-form';
import moment from 'moment';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import DownloadForOfflineOutlinedIcon from '@mui/icons-material/DownloadForOfflineOutlined';
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
const Reports = () => {
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
  let reportCategory = [
    {title: 'Team Report', value: 'Team Report'},
    {title: 'Agent Report', value: 'Agent Report'},
    {title: 'Employee Report ', value: 'Employee Report'},
  ];
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
  console.log('shreya');
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
    if (reportType == 'Employee Report' || reportType == 'Agent Report') {
      temp_url = {
        get: Api.baseUri + '/user-reg/incident-management/headerdata',
        post:
          Api.baseUri +
          `/user-reg/incident-management/incidentTicketList/${date?.fromDate}/${
            date?.dateType == 'Today' ? date?.fromDate : date?.toDate
          }`,
      };
    }
    if (reportType == 'Team Report') {
      temp_url = {
        get: Api.baseUri + '/user-reg/incidentTeam/headerdata',
        post: Api.baseUri + `/user-reg/incidentTeam/incidentTeamList`,
      };
    }
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
              console.log('data', data);
              setData(res?.data?.split('\r\n'));
            })
            .catch((err) => {});
        }
      })
      .catch((err) => {});
  }
  const submitReport = async () => {
    await getAllList(reportType, dateType, fromDate, toDate);
    setTimeout(() => {
      setshowbtn(true);
    }, 200);
  };
  const handleFilter = (val) => {
    let temp_url = '/user-reg/incident-management/download/EXCEL';

    if (reportType == 'Employee Report' || reportType == 'Agent Report') {
      axios
        .post(
          Api.baseUri +
            temp_url +
            // (val?.button == 'csv'
            //   ? 'CSV'
            //   : val?.button == 'pdf'
            //   ? 'PDF'
            //   : val?.button == 'excel'
            //   ? 'EXCEL'
            //   : null) +
            // '/' +
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
            ((reportType == 'Employee Report' || reportType == 'Agent Report') ? 'employee_report' : ' ') +".xls"
              // (val?.button == 'csv'
              //   ? '.csv'
              //   : val?.button == 'pdf'
              //   ? '.pdf'
              //   : val?.button == 'excel'
              //   ? '.xls'
              //   : null),
          );
          document.body.appendChild(link);
          link.click();
          setOpenFilter(false);
        });
    }
    if (reportType == 'Team Report') {
      axios
        .post(
          Api.baseUri + '/user-reg/incidentTeam/downloadTeamExcel',
          val?.data?.reportType,
          {responseType: 'blob'},
        )
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'team_reports'+'.xls');
          document.body.appendChild(link);
          link.click();
          setOpenFilter(false);
        });
    }
  };

  const handleDownload = () => {
    if (reportType == 'Employee Report' || reportType == 'Agent Report') {
      axios
        .post(
          `${Api.baseUri}/user-reg/incident-management/download/EXCEL${
            date?.fromDate
          }/${date?.dateType == 'Today' ? date?.fromDate : date?.toDate}`,
          header,
          {responseType: 'blob'},
        )
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute(
            'download',
            `${(reportType == 'Employee Report' || reportType == 'Agent Report') ? 'employee_report' : ''}`+ ".xls"
          );
          document.body.appendChild(link);
          link.click();
          setOpenFilter(false);
        })
        .catch((error) => {
          console.error('Error downloading file:', error);
        });
    }
    if (reportType == 'Team Report') {
      axios
        .post(Api.baseUri + '/user-reg/incidentTeam/downloadTeamExcel',header,
          {responseType: 'blob'},
        )
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download','team_reports'+'.xls');
          document.body.appendChild(link);
          link.click();
          setOpenFilter(false);
        });
    }
  };

  console.log('employee report type', reportType);

  return (
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
            {(reportType == 'Employee Report' ||
              reportType == 'Agent Report') && (
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
                      console.log('vvvv', v);
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
              {<Typography style={{fontWeight: 'bold'}}>Actions</Typography>}
            </Grid>
          </Grid>
        </AccordionSummary>
      </Accordion>
      {reportType?.length && (
        <Accordion>
          <AccordionSummary aria-controls='panel1a-content' id='panel1a-header'>
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
                {
                  <div style={{display: 'flex', justifyContent: 'center'}}>
                    <div style={{color: '#006685', marginTop: '5px'}}>
                      <DownloadForOfflineOutlinedIcon
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
                          padding: '9px 0px 11px 44px',
                        }}
                        onClick={(eve) => {
                          console.log('Hello Prince', eve);
                          handleDownload();
                          eve.stopPropagation();
                        }}
                      >
                        <Grid xs={6}>
                          {' '}
                          <p style={{marginTop: '2px'}}>Download</p>
                        </Grid>
                        <FileDownloadOutlinedIcon style={{color: '#006685'}} />
                        {/* <Grid
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
                              console.log("Hello Prince", eve)
                              handleDownload();
                              eve.stopPropagation();
                            }}
                          />
                        </Grid> */}
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
                            {console.log("elelelel", el)}
                            {el?.split(',')?.map((_el) => {
                              return (
                                <TableCell
                                  align='center'
                                  style={
                                    reportType == 'Vehicle Compliance Report' ||
                                    reportType == 'Driver Compliance Report'
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
                }}
                buttons={['Download']}
                onSubmit={handleFilter}
                fieldsize='SMALL'
              />
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </div>
  );
};

export default Reports;
