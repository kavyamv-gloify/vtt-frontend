import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Grid,
  Table,
  TableBody,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import TableCell, {tableCellClasses} from '@mui/material/TableCell';
import React, {useEffect, useState} from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import Api from '@api';
import {useTheme} from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import PropTypes from 'prop-types';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import {useNavigate} from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {toast} from 'react-toastify';
import {Tooltip} from '@mui/material';
import Confirm from '@confirmation-box';
import moment from 'moment';
import {styled} from '@mui/material/styles';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import _ from 'lodash';
import Dialog from '@mui/material/Dialog';
import Paper from '@mui/material/Paper';
import DialogContent from '@mui/material/DialogContent';
import {useSelector} from 'react-redux';

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
const index = ({fuelTypeVal, myActions}) => {
  const [accordSel, setAccordSel] = useState();
  const [parentAccordSel, setParentAccordSel] = useState();
  const [page, setPage] = React.useState(0);
  const navigate = useNavigate();
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [datas, setDatas] = useState();
  const [vendorId, setVendorId] = useState();
  const [vendortable, setVendorTable] = useState({});
  const [openRateSlab, setOpenRateSlab] = useState(false);
  const [fuelMatrix, setFuelMatrix] = useState();
  const [openConfirmbox, setOpenConfirmBox] = useState(false);
  const [id, setId] = useState();
  const header = [
    'Slab',
    'Distance Range(KM)',
    'Fuel Rate Range(Rs)',
    'Base Price',
    'AC',
    'Escort',
    'Action',
  ];
  const data = [
    {
      slab: 'Slab 1',
      distanceRange: '0-30',
      fuelRateRange: '100-101',
      nonAC: '435',
      ac: '500',
      escort: '400',
    },
    {
      slab: 'Slab 2',
      distanceRange: '30-60',
      fuelRateRange: '100-101',
      nonAC: '435',
      ac: '500',
      escort: '500',
    },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    axios
      .get(
        Api.baseUri + '/user-reg/tripRateCard/' + 'SLAB/' + fuelTypeVal?.value,
      )
      .then((resp) => {
        if (resp?.data?.status == '200') {
          setDatas(resp?.data?.data);
        }
      })
      .catch((err) => {});
  }, [fuelTypeVal]);

  function vendorList() {
    axios
      .get(Api.baseUri + '/user-reg/tripRateCard/byFilter/SLAB/' + vendorId)
      .then((res) => {
        if (res?.data?.status == '200') {
          res?.data?.data?.map((el) => {
            el.mykey = `${el?.applicableFrom}___${el?.applicableTo}___${el?.vehicleType}___${el?.tripCategory}`;
          });
          let tem_Obj = _.groupBy(res?.data?.data, 'mykey');
          setVendorTable(tem_Obj);
        }
      })
      .catch((err) => {});
  }

  useEffect(() => {
    vendorList();
  }, [vendorId]);
  const StyledTableCell = styled(TableCell)(({theme}) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#f5f7f6',
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({theme}) => ({
    '&:nth-of-type(even)': {
      backgroundColor: '#fafbff',
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  function closeConfirmBox(d) {
    if (d == 'YES') {
      axios
        .post(Api.baseUri + '/user-reg/tripRateCard/deActivateRateCard/' + id)
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success('Slab deactivated successfully');
            vendorList();
            setOpenConfirmBox(false);
          }
        })
        .catch((err) => {});
    } else {
      setOpenConfirmBox(false);
    }
  }
  return (
    <div>
      <div style={{background: 'white', marginTop: '25px', padding: '20px'}}>
        {datas?.map((el, _i) => {
          return (
            <Accordion
              expanded={parentAccordSel == _i}
              style={{borderRadius: '12px', marginBottom: '10px'}}
            >
              <AccordionSummary
                style={{paddingLeft: '15px'}}
                aria-controls='panel1a-content'
                id={_i + 'panel1a-header1'}
                onClick={(e) => {
                  if (parentAccordSel != _i) setParentAccordSel(_i);
                  else setParentAccordSel(null);
                  setVendorId(el?.vendorId);
                }}
              >
                {el.vendorName}
              </AccordionSummary>
              <AccordionDetails style={{padding: 0}}>
                <Accordion expanded={false}>
                  <AccordionSummary
                    style={{paddingLeft: '15px'}}
                    aria-controls='panel1a-content'
                    expandIcon={<ExpandMoreIcon style={{opacity: 0}} />}
                    id={'panel1a-header-child' + _i}
                  >
                    <Grid container spacing={2} style={{fontWeight: 600}}>
                      <Grid item xs={12} sm={2} md={2}>
                        From Date
                      </Grid>
                      <Grid item xs={12} sm={2} md={2}>
                        To Date
                      </Grid>
                      <Grid item xs={12} sm={2} md={2}>
                        Vehicle Variant
                      </Grid>
                      <Grid item xs={12} sm={2} md={2}>
                        Trip Type
                      </Grid>
                      {/* <Grid item xs={12} sm={2} md={2} >
                                            Non AC
                                        </Grid> */}
                      <Grid item xs={12} sm={2} md={2}>
                        AC Cost
                      </Grid>
                      <Grid item xs={12} sm={2} md={2}>
                        Escort Cost
                      </Grid>
                    </Grid>
                  </AccordionSummary>
                </Accordion>
                {Object.keys(vendortable)?.map((el, ind) => {
                  return (
                    <Accordion expanded={accordSel == ind + '_' + _i}>
                      <AccordionSummary
                        style={{paddingLeft: '15px'}}
                        aria-controls='panel1a-content'
                        expandIcon={<ExpandMoreIcon />}
                        id={ind + 'panel1a-header' + _i}
                        onClick={(e) => {
                          if (accordSel != ind + '_' + _i)
                            setAccordSel(ind + '_' + _i);
                          else setAccordSel(null);
                        }}
                      >
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={2} md={2}>
                            <p>
                              {moment(
                                vendortable[el][0]?.applicableFrom,
                              ).format('DD-MM-YYYY')}
                            </p>
                          </Grid>
                          <Grid item xs={12} sm={2} md={2}>
                            {moment(vendortable[el][0]?.applicableTo).format(
                              'DD-MM-YYYY',
                            )}
                          </Grid>
                          <Grid item xs={12} sm={2} md={2}>
                            {vendortable[el][0]?.vehicleTypeName}
                          </Grid>
                          <Grid item xs={12} sm={2} md={2}>
                            {vendortable[el][0]?.tripCategory || 'NA'}
                          </Grid>
                          <Grid item xs={12} sm={2} md={2}>
                            {vendortable[el][0]?.acCost}
                          </Grid>
                          <Grid item xs={12} sm={2} md={2}>
                            {vendortable[el][0]?.escortCost}
                          </Grid>
                          {/* <Grid item xs={12} sm={2} md={2} >
                                                    <div style={{ display: "flex", }}>
                                                        <div style={{ marginRight: "15px" }}>
                                                            <EditIcon color="primary" style={{ opacity: el?.status == "INACTIVE" ? "0.3" : "" }} onClick={() => { if (el?.status == "INACTIVE") { return; } navigate(`/rate-card/${el?.id}`) }} />
                                                        </div>
                                                        <div>
                                                            <DeleteIcon style={{ color: "#bc0805", opacity: el?.status == "INACTIVE" ? "0.3" : "" }} onClick={(eve) => {
                                                                eve.stopPropagation();
                                                                if (el?.status == "INACTIVE") { return; }
                                                                axios.post(Api.baseUri + '/user-reg/tripRateCard/deActivateRateCard/' + el?.id).then((res) => {
                                                                    if (res?.data?.status == "200") {
                                                                        toast.success("Rate Card deactivated successfully");
                                                                        vendorList();
                                                                    }
                                                                }).catch((err) => {
                                                                     
                                                                })
                                                            }} />
                                                        </div>

                                                    </div>
                                                </Grid> */}
                        </Grid>
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
                              <Table
                                sx={{minWidth: 650}}
                                aria-label='simple table'
                              >
                                <TableHead style={{background: '#f1f1f1'}}>
                                  <TableRow>
                                    {header?.map((el) => {
                                      return <TableCell> {el} </TableCell>;
                                    })}
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {vendortable[el]?.map((e, i) => {
                                    return (
                                      <TableRow
                                        style={{
                                          background:
                                            i % 2 == 0 ? '' : '#f5f7ff',
                                        }}
                                      >
                                        <TableCell>
                                          {' '}
                                          {'Slab   ' + Number(i + 1)}{' '}
                                        </TableCell>
                                        <TableCell>
                                          {' '}
                                          {e?.distanceFrom +
                                            '-' +
                                            e?.distanceTo}{' '}
                                        </TableCell>
                                        <TableCell>
                                          {' '}
                                          {e.fuleRangeFrom +
                                            '-' +
                                            e.fuleRangeTo}{' '}
                                        </TableCell>
                                        <TableCell> {e?.basePrice} </TableCell>
                                        <TableCell>
                                          {' '}
                                          {Number(e?.acCost)?.toFixed(2)}{' '}
                                        </TableCell>
                                        <TableCell>
                                          {' '}
                                          {Number(e?.escortCost)?.toFixed(
                                            2,
                                          )}{' '}
                                        </TableCell>
                                        <TableCell>
                                          {' '}
                                          <div style={{display: 'flex'}}>
                                            {myActions?.includes('Edit') && (
                                              <div
                                                style={{marginRight: '15px'}}
                                              >
                                                <Tooltip title='Edit'>
                                                  <EditIcon
                                                    color='primary'
                                                    style={{
                                                      opacity:
                                                        e?.status == 'INACTIVE'
                                                          ? '0.3'
                                                          : '',
                                                    }}
                                                    onClick={() => {
                                                      if (
                                                        e?.status == 'INACTIVE'
                                                      ) {
                                                        return;
                                                      }
                                                      navigate(
                                                        `/rate-card/${e?.id}`,
                                                      );
                                                    }}
                                                  />
                                                </Tooltip>
                                              </div>
                                            )}
                                            {myActions?.includes(
                                              'Deactivate',
                                            ) && (
                                              <div
                                                style={{marginRight: '15px'}}
                                              >
                                                <Tooltip title='Delete'>
                                                  <DeleteIcon
                                                    color='primary'
                                                    style={{
                                                      opacity:
                                                        e?.status == 'INACTIVE'
                                                          ? '0.3'
                                                          : '',
                                                      color: '#bc0805',
                                                    }}
                                                    onClick={() => {
                                                      if (
                                                        el?.status == 'INACTIVE'
                                                      ) {
                                                        return;
                                                      }
                                                      setId(e?.id);
                                                      setOpenConfirmBox(true);
                                                    }}
                                                  />
                                                </Tooltip>
                                              </div>
                                            )}
                                            <div>
                                              <VisibilityIcon
                                                onClick={() => {
                                                  setOpenRateSlab(true);
                                                  setFuelMatrix(
                                                    e?.rateCardSlab,
                                                  );
                                                }}
                                              />
                                            </div>
                                          </div>
                                        </TableCell>
                                      </TableRow>
                                    );
                                  })}
                                </TableBody>

                                <TableFooter>
                                  <TableRow>
                                    <TablePagination
                                      rowsPerPageOptions={[
                                        5,
                                        10,
                                        25,
                                        {label: 'All', value: -1},
                                      ]}
                                      colSpan={8}
                                      count={data.length} //rows.length
                                      rowsPerPage={rowsPerPage} //rowsPerPage
                                      page={page} //page
                                      SelectProps={{
                                        inputProps: {
                                          'aria-label': 'rows per page',
                                        },
                                        native: true,
                                      }}
                                      onPageChange={handleChangePage}
                                      onRowsPerPageChange={
                                        handleChangeRowsPerPage
                                      }
                                      ActionsComponent={TablePaginationActions}
                                    />
                                  </TableRow>
                                </TableFooter>
                              </Table>
                            </TableContainer>
                          </div>
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  );
                })}
              </AccordionDetails>
            </Accordion>
          );
        })}
      </div>
      <Dialog
        open={openRateSlab}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '60%',
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
                position: 'fixed',
                width: '60%',
                zIndex: '9',
                borderRadius: '5px 5px 0px 0px',
              }}
            >
              <h1 style={{marginTop: '1.5rem'}}>Fuel Matrix</h1>
              <CloseIcon
                onClick={() => {
                  setOpenRateSlab(false);
                }}
                style={{
                  marginTop: '1.4rem',
                  color: '#4f4f4f',
                  fontWeight: 'bold',
                }}
              />
            </div>
            <div style={{padding: '2rem', marginTop: '50px'}}>
              <TableContainer
                sx={{maxHeight: 440}}
                className='right-container-rate-card'
                component={Paper}
              >
                <Table
                  stickyHeader
                  sx={{maxHeight: 100}}
                  aria-label='customized table'
                >
                  <TableHead>
                    <TableRow>
                      <StyledTableCell
                        style={{fontSize: '16px', fontWeight: 500}}
                      >
                        Fuel Slab
                      </StyledTableCell>
                      <StyledTableCell
                        style={{fontSize: '16px', fontWeight: 500}}
                      >
                        Rate
                      </StyledTableCell>
                      <StyledTableCell
                        style={{fontSize: '16px', fontWeight: 500}}
                      >
                        Rate with AC
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fuelMatrix?.map((row, ind) => (
                      <StyledTableRow key={'table-' + ind}>
                        <StyledTableCell component='th' scope='row'>
                          {row?.rangeFrom + '-' + row?.rangeTo}
                        </StyledTableCell>
                        <StyledTableCell component='th' scope='row'>
                          {row?.rate?.toFixed(2)}
                        </StyledTableCell>
                        <StyledTableCell component='th' scope='row'>
                          {row.slab}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </DialogContent>
        </div>
      </Dialog>
      <Confirm
        open={openConfirmbox}
        header={'Confirm to Deactivate'}
        cnfMsg={'Are you sure, You want to deactivate the Slab?'}
        handleClose={closeConfirmBox}
      />
    </div>
  );
};

export default index;
