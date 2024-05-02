import React, {useEffect, useState} from 'react';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import Table from '@mui/material/Table';
import AppTooltip from '@crema/core/AppTooltip';
import Api from '@api';
import axios from 'axios';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {Dialog, DialogContent, DialogTitle, Grid, TableFooter, TablePagination} from '@mui/material';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import PropTypes from 'prop-types';
import {useTheme} from '@mui/material/styles';
import Box from '@mui/material/Box';
import {useAuthUser} from '@crema/utility/AuthHooks';
import AppLoader from '@crema/core/AppLoader';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';
import moment from 'moment';
import SmartForm from '@smart-form';
import CloseIcon from '@mui/icons-material/Close';
import {useGridInitializeState} from '@mui/x-data-grid/internals';
const CustomExpandIcon = () => {
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
        <AddBoxOutlinedIcon style={{color: '#407999'}} />
      </div>
    </Box>
  );
};
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

function TablePaginationActionsParent(props) {
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

TablePaginationActionsParent.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};
const DriverFeedBack = ({ratFilter, myActions}) => {
  const header = [
    'Trip ID',
    'Driver',
    'Employee',
    'Shift Time',
    'Shift Type',
    'Date',
    'Parameters',
    'Star rating',
  ];
  const tktdata = [
    {
      tktId: 'TKT123',
      vendorName: 'Rahul Jain',
      tat: '7 days',
      assignedTo: 'Naina Rathore',
    },
  ];
  const [accordSel, setAccordSel] = useState(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [pageParent, setPageParent] = React.useState(0);
  const [rowsPerPageParent, setRowsPerPageParent] = React.useState(5);
  const [feedData, setFeedData] = React.useState([]);
  const [Count, setCount] = React.useState(0);
  const [CountParent, setCountParent] = React.useState(0);
  const [data, setData] = React.useState([]);
  const [catdata, setCatData] = React.useState({});
  const [openDownload, setOpenDownload] = useState(false);
  const [headers, setHeaders] = useState([]);
  const [empFeedDown, setEmpFeedDown] = useState("");
  function getName(d) {
    let n = [];
    d?.map((el) => {
      n.push(catdata[el]);
    });
    return n?.join(', ');
  }
  useEffect(() => {
    axios
      .get(Api.baseUri + `/user-reg/driver-feedback/get-all-driver-feedback`)
      .then((res) => {
        let ob = {};
        res?.data?.data?.map((el) => {
          ob[el.id] = el.categoryName;
        });
        setCatData(ob || {});
      })
      .catch((err) => {
        setCatData({});
      });
  }, []);
  function getAll(page_, rowsPerPage_) {
    let api = Api.baseUri + '/user-reg/trip-driver/get-all-driver-feedback';
    let postData = {
      passengerId: '',
      tripId: '',
      ratingFrom: 1,
      ratingTo: 3,
      pageNo: page_,
      pageSize: rowsPerPage_,
    };
    axios
      .post(api, postData)
      .then((res) => {
        setData(res?.data?.data?.body?.ratingList);
        setCount(res?.data?.data?.body?.totalItems ?? 0);
      })
      .catch((err) => {});
  }
  useEffect(() => {
    getAll(page, rowsPerPage);
  }, [page]);

  useEffect(() => {
    getAll(0, rowsPerPage);
  }, [rowsPerPage]);
  function getAllParent(page_, rowsPerPage_) {
    let api = Api.baseUri + '/user-reg/trip-driver/get-all-driver-feedback';
    let postData2 = {
      passengerId: '',
      tripId: '',
      ratingFrom: 4,
      ratingTo: 5,
      pageNo: page_,
      pageSize: rowsPerPage_,
    };
    axios
      .post(api, postData2)
      .then((res) => {
        setFeedData(res?.data?.data?.body?.ratingList);
        setCountParent(res?.data?.data?.body?.totalItems ?? 0);
      })
      .catch((err) => {});
  }
  useEffect(() => {
    getAllParent(pageParent, rowsPerPageParent);
  }, [pageParent]);

  useEffect(() => {
    getAllParent(0, rowsPerPageParent);
  }, [rowsPerPageParent]);
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangePageParent = (event, newPage) => {
    setPageParent(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    console.log('event', event.target.value);
    setRowsPerPage(event.target.value);
    setPage(0);
  };
  const handleChangeRowsPerPageParent = (event) => {
    console.log('event', event.target.value);
    setRowsPerPageParent(event.target.value);
    setPageParent(0);
  };
// Download feedback report
function getHeader(){
  axios
  .get(Api.baseUri + '/user-reg/driver-feedback-report/getHeaders')
  .then((res) => {
    let shiftArray = [];
    res?.data?.data?.map((el) => {
      console.log("el",el)
      shiftArray.push({title: el, value: el});
    }); 
    setHeaders(shiftArray)
  })
 }
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
            type: 'multiSelect',
            name: 'header',
            id: 'header',
            title: 'Select Header',
            options: headers ?? [],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
        ],
      },
    ],
  };
  function handleSubmitDownload(value) {
    axios
    .post(
      Api.baseUri +
        `/user-reg/driver-feedback-report/download-report/PDF/${value?.data?.fromDate}/${value?.data?.toDate}/${empFeedDown === "Feedback" ? "1": "4"}/${empFeedDown === "Feedback" ? "3": "5"}`,
      value?.data?.header,
      {responseType: 'blob'},
    )
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        'driver_feedback/' +
          (value?.button == 'download' ? '.pdf' : 'xls'),
      );
      document.body.appendChild(link);
      link.click();
    })
      .catch((err) => {});

    setOpenDownload(false);
  }

  return (
    <div>
      <div style={{background: 'white', padding: '15px'}}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2 style={{fontSize: '17px'}}>Appreciation</h2>
          {myActions?.includes('Download And Upload') && (
            <div
              className='cursor'
              style={{
                border: '2px solid #f1f1f1',
                borderRadius: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                width: '120px',
                padding: '7px',
              }}
              onClick={() => {
                getHeader();
                setOpenDownload(true);
                setEmpFeedDown("Appreciation")
              }}
            >
              <FileDownloadOutlinedIcon />
              <h5 style={{color: 'black', marginTop: '2px', fontWeight: '30'}}>
                Download
              </h5>
            </div>
          )}
        </div>
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
                {console.log("feedData", feedData)}
                {feedData
                  // rowsPerPage > 0
                  // ? feedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  // :
                  ?.map((el) => {
                    return (
                      <TableRow>
                        <TableCell> {el?.tripCode || '-'} </TableCell>
                        <TableCell> {el?.driverName} </TableCell>
                        <TableCell>
                          {' '}
                          {el?.name || 'NA'}
                          {' - ' + (el?.empCode || 'NA')}{' '}
                        </TableCell>
                        <TableCell> {el?.shiftTime || '-'} </TableCell>
                        <TableCell>
                          {' '}
                          {el.tripType == 'UPTRIP'
                            ? 'Login'
                            : el.tripType == 'DOWNTRIP'
                            ? 'Logout'
                            : el.tripType}{' '}
                        </TableCell>
                        <TableCell>
                          {' '}
                          {moment(el.tripDate).format('DD/MM/YYYY')}{' '}
                        </TableCell>
                        <TableCell>
                          {' '}
                          {el?.passFeedback}{' '}
                        </TableCell>
                        <TableCell> {el?.passRating ?? '-'} </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>

              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    colSpan={8}
                    count={CountParent} //rows.length
                    rowsPerPage={rowsPerPageParent} //rowsPerPage
                    page={pageParent} //page
                    SelectProps={{
                      inputProps: {
                        'aria-label': 'rows per page',
                      },
                      native: true,
                    }}
                    onPageChange={handleChangePageParent}
                    onRowsPerPageChange={handleChangeRowsPerPageParent}
                    ActionsComponent={TablePaginationActionsParent}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </div>

        <div style={{marginTop: '25px'}}>
        <div style={{ display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'}}>
          <h2 style={{fontSize: '17px'}}>Feedback</h2>
          {myActions?.includes('Download And Upload') && (
            <div
              className='cursor'
              style={{
                border: '2px solid #f1f1f1',
                borderRadius: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                width: '120px',
                padding: '7px',
              }}
              onClick={() => {
                getHeader();
                setOpenDownload(true);
                setEmpFeedDown("Feedback")
              }}
            >
              <FileDownloadOutlinedIcon />
              <h5 style={{color: 'black', marginTop: '2px', fontWeight: '30'}}>
                Download
              </h5>
            </div>
          )}
          </div>
          <div
            style={{
              borderBottom: '2px solid rgb(0,102, 133)',
              marginTop: '25px',
            }}
          >
            <Accordion expanded={false} sx={{background: '#f1f1f1'}}>
              <AccordionSummary
                style={{paddingLeft: '15px'}}
                aria-controls='panel1a-content'
                expandIcon={
                  <span style={{opacity: 0}}>
                    <CustomExpandIcon />
                  </span>
                }
                id='panel1a-header'
              >
                <Grid container spacing={2}>
                  <Grid item sm={1} md={1}>
                    <Typography>Trip Id</Typography>
                  </Grid>
                  <Grid item sm={2} md={2}>
                    <Typography>Driver Name</Typography>
                  </Grid>
                  <Grid item sm={1} md={2}>
                    <Typography>Employee</Typography>
                  </Grid>
                  <Grid item sm={1} md={1}>
                    <Typography>Shift Time</Typography>
                  </Grid>
                  <Grid item sm={2} md={2}>
                    <Typography>Shift Type</Typography>
                  </Grid>
                  <Grid item sm={1} md={1}>
                    <Typography>Shift Date</Typography>
                  </Grid>
                  <Grid item sm={2} md={2}>
                    <Typography>Parameters</Typography>
                  </Grid>
                  <Grid item sm={1} md={1}>
                    <Typography>Star Ratings</Typography>
                  </Grid>
                </Grid>
              </AccordionSummary>
            </Accordion>
            {data
              // rowsPerPageParent > 0
              // ? data?.slice(pageParent * rowsPerPageParent, pageParent * rowsPerPageParent + rowsPerPageParent)
              // :
              ?.map((el, ind) => {
                return (
                  <Accordion expanded={accordSel == ind}>
                    <AccordionSummary
                      style={{paddingLeft: '15px'}}
                      aria-controls='panel1a-content'
                      expandIcon={<CustomExpandIcon />}
                      id='panel1a-header'
                      onClick={(e) => {
                        if (accordSel != ind) setAccordSel(ind);
                        else setAccordSel(null);
                      }}
                    >
                      <Grid container spacing={2}>
                        <Grid item sm={1} md={1}>
                          <AppTooltip
                            placement={'bottom'}
                            title={el.tripCode || '-'}
                          >
                            <Typography style={{overflow: 'hidden'}}>
                              {el.tripCode || '-'}
                            </Typography>
                          </AppTooltip>
                        </Grid>
                        <Grid item sm={2} md={2}>
                          <Typography>{el.driverName}</Typography>
                        </Grid>
                        <Grid item sm={2} md={2}>
                          <Typography>
                            {el?.name || 'NA'}
                            {' - ' + (el?.empCode || 'NA')}
                          </Typography>
                        </Grid>
                        <Grid item sm={1} md={1}>
                          <Typography>{el.shiftTime || '-'}</Typography>
                        </Grid>
                        <Grid item sm={2} md={2}>
                          <Typography>
                            {el.tripType == 'UPTRIP'
                              ? 'Login'
                              : el.tripType == 'DOWNTRIP'
                              ? 'Logout'
                              : el.tripType}
                          </Typography>
                        </Grid>
                        <Grid item sm={1} md={1}>
                          <Typography>
                            {moment(el.tripDate).format('DD/MM/YYYY')}
                          </Typography>
                        </Grid>
                        <Grid item sm={2} md={2}>
                          <Typography>
                            {el?.driverFeedbackCategories
                              ? getName(el?.driverFeedbackCategories)
                              : '-'}
                          </Typography>
                        </Grid>
                        <Grid item sm={1} md={1}>
                          <Typography>{el.passRating ?? '-'}</Typography>
                        </Grid>
                      </Grid>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        <TableContainer
                          style={{
                            boxShadow:
                              'rgba(0, 0, 0, 0) 0px 2px 4px, rgba(0, 0, 0, 0) 0px 7px 13px -3px, rgb(0,102,133) 0px -3px 0px inset',
                          }}
                        >
                          <Table sx={{minWidth: 650}} aria-label='simple table'>
                            <TableHead style={{background: '#f1f1f1'}}>
                              <TableRow>
                                <TableCell>Ticket Id</TableCell>
                                <TableCell>Vendor Name</TableCell>
                                <TableCell>TAT</TableCell>
                                <TableCell>Assigned To</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {tktdata?.map((el) => {
                                return (
                                  <TableRow>
                                    <TableCell> {el?.tktId} </TableCell>
                                    <TableCell> {el?.vendorName} </TableCell>
                                    <TableCell> {el?.tat} </TableCell>
                                    <TableCell> {el?.assignedTo} </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            <div
              style={{width: '100%', display: 'flex', justifyContent: 'end'}}
            >
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
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
            </div>
          </div>
        </div>
        <div>
          <Dialog
            open={openDownload}
            onClose={() => {
              setOpenDownload(false);
              setEmpFeedDown("");
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
              Driver FeedBack Report
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
                buttons={['download']}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default DriverFeedBack;
