import {
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stepper,
  Step,
  Typography,
  StepLabel,
  StepContent,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
} from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import clsx from 'clsx';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachmentIcon from '@mui/icons-material/Attachment';
import {makeStyles} from '@mui/styles';
import PrintIcon from '@mui/icons-material/Print';
import React, {useEffect, useRef, useState} from 'react';
import AppTooltip from '@crema/core/AppTooltip';
import CustomLabel from 'pages/common/CustomLabel';
import moment from 'moment';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import Api from '@api';
import {useReactToPrint} from 'react-to-print';
import _ from 'lodash';
import {toast} from 'react-toastify';
import {useAuthUser} from '@crema/utility/AuthHooks';

const blockInvalidChar = (e) =>
  ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();
const VendorInvoiceList = () => {
  var converter = require('number-to-words');
  const {user} = useAuthUser();
  const {id, fromDate, toDate} = useParams();
  const [myData, setMyData] = useState({});
  const [vendorDetails, setVendorDetails] = useState({});
  const [corpDetails, setCorpDetails] = useState({});
  const [taxes, setTaxes] = useState([]);
  const componentRef = useRef();
  const [activeStep, setActiveStep] = React.useState(3);
  const [historyData, setHistoryData] = React.useState({});
  const [additionalFields, setAdditionalFields] = React.useState([]);
  const [data, setData] = useState({});
  const [error, setError] = useState();

  console.log('historyData', historyData);
  useEffect(() => {
    async function fetchData() {
      const baseURL = `${Api.vendor.list}/${user.userList.profileId}`;
      axios
        .get(`${baseURL}`)
        .then((res) => {
          setData(res?.data?.data);
          setLastVerifiedData({
            mob: res?.data?.data?.mobileNo,
            email: res?.data?.data?.emailId,
          });
        })
        .catch((err) => {});
    }
    fetchData();
  }, [user.userList.profileId]);

  function getOtherCharges(type) {
    let tem = 0;
    let TAX_ = {};
    let TOTAL_ = {};
    additionalFields?.map((ele, _i) => {
      let txpr = 0;
      if (ele.taxType == 'CGST_SGST') txpr = ((ele.taxPercentage || 0) - 0) * 2;
      if (ele.taxType == 'IGST') txpr = (ele?.taxPercentage || 0) - 0;
      let amt = (ele?.tripCost || 0) - 0;
      let ttl = amt + (amt * txpr) / 100;
      tem = tem + ttl;
      ele.taxAmount = (amt * txpr) / 100;
      ele.totalAmount = amt + (amt * txpr) / 100;
      TAX_[_i] = ele.taxAmount || 0;
      TOTAL_[_i] = ele.totalAmount || 0;
    });
    if (type == 'TAX') return TAX_;
    else if (type == 'TOTAL') return TOTAL_;
    else return tem || 0;
  }
  const toIndianCurrency = (num) => {
    num = Number(num || 0);
    const curr = num?.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
    });
    return curr;
  };
  useEffect(() => {
    if (!myData?.corporateId) return;
    axios
      .get(Api.baseUri + '/user-reg/vendor-reg/' + myData?.vendorId)
      .then((res_) => {
        setVendorDetails(res_?.data?.data);
      })
      .catch(() => {});
    axios
      .get(Api.baseUri + '/user-reg/corporate-reg/' + myData?.corporateId)
      .then((re) => {
        setCorpDetails(re?.data?.data);
        axios
          .get(Api.baseUri + '/user-reg/tax-Applicable/getAll')
          .then((res) => {
            let _d = {};

            res?.data?.data?.map((el) => {
              if (
                re?.data?.data?.companyAddress?.state?.toUpperCase() ==
                el?.state?.toUpperCase()
              ) {
                _d = el.tax;
              }
            });
            // {el?.taxTypeName}({el?.taxAbleAmount}%):
            console.log('myData', myData);
            let total =
              Number(myData?.totalRegTripCost || 0) +
              Number(myData?.regularParkingAmount || 0) +
              Number(myData?.regularPenaltyAmount || 0) +
              Number(myData?.regularTollAmount || 0) +
              Number(myData?.totalAdhocTripCost || 0) +
              Number(myData?.adhocParkingAmount || 0) +
              Number(myData?.adhocPenaltyAmount || 0) +
              Number(myData?.adhocTollAmount || 0);
            let subtotal = Number(total);
            _d?.map((el_) => {
              subtotal =
                subtotal + (total * Number(el_?.taxAbleAmount || 0)) / 100;
            });
            setTaxes({taxes: _d, total: total, subTotal: subtotal});
          })
          .catch(() => {});
      })
      .catch((er) => {});
  }, [myData]);
  const handlePrint = useReactToPrint({
    onBeforePrint: () =>
      (document.title = (vendorDetails?.vendorName || 'NA') + ' Invoice'),
    content: () => componentRef.current,
    onAfterPrint: () => (document.title = ''), // Resetting the document title after printing

    // Adding custom styling for page numbers

    // pageStyle: `
    //   @media print {
    //     .page-number {
    //       counter-increment: page;
    //     }
    //     .page-number:after {
    //       content: counter(page) "/" counter(pages);
    //     }
    //   }
    // `,
  });
  const getAll = () => {
    axios
      .get(Api.baseUri + '/user-reg/invoice/getById/' + window.atob(id))
      .then((res) => {
        setMyData(res?.data?.data);
        setAdditionalFields(res?.data?.data?.addInvInfo);
        axios
          .get(
            Api.baseUri +
              '/user-reg/invoice/getByInvoiceId/' +
              res?.data?.data?.invoiceId,
          )
          .then((re_) => {
            let tem_ = re_?.data?.data?.length ? re_?.data?.data[0] : {};
            let his_ = {
              PENDING: {
                name: res?.data?.data?.createdBy,
                role: 'VENDOR',
                date: res?.data?.data?.createdOn,
                remarks: '',
                status: 'Pending',
              },
            };
            if (tem_?.sentStatus == 'SENT') {
              his_['SENT'] = {
                name: tem_?.sentByName,
                role: tem_?.sentByRole,
                date: tem_?.sentOn,
                remarks: tem_?.sendRemarks,
                status: 'Sent',
              };
            }
            if (tem_?.approvedStatus == 'APPROVED') {
              his_['APPROVED'] = {
                name: tem_?.approvedByName,
                role: tem_?.approvedByRole,
                date: tem_?.approvedOn,
                remarks: tem_?.approvedRemarks,
                status: 'Approved',
              };
            }
            if (tem_?.declinedStatus == 'DECLINED') {
              his_['DECLINED'] = {
                name: tem_?.declinedByName,
                role: tem_?.declinedByRole,
                date: tem_?.declinedOn,
                remarks: tem_?.declinedRemarks,
                status: 'Declined',
              };
            }
            if (tem_?.cancelledStatus == 'CANCELLED') {
              his_['CANCELLED'] = {
                name: tem_?.cancelledByName,
                role: tem_?.cancelledByRole,
                date: tem_?.cancelledOn,
                remarks: tem_?.cancelledRemarks,
                status: 'Cancelled',
              };
            }
            if (tem_?.eInvSubmittedStatus == 'SUBMITTED') {
              his_['SUBMITTED'] = {
                name: tem_?.eInvSubmittedByName,
                role: tem_?.eInvSubmittedByRole,
                date: tem_?.eInvSubmittedOn,
                remarks: tem_?.eInvSubmittedRemarks,
                file: tem_?.eInvSubmittedFile,
                status: 'e-Invoice Submitted',
              };
            }
            if (tem_?.closedStatus == 'CLOSED') {
              his_['CLOSED'] = {
                name: tem_?.closedByName,
                role: tem_?.closedByRole,
                date: tem_?.closedOn,
                remarks: tem_?.closedRemarks,
                file: tem_?.closedFile,
                status: tem_?.closedByRole == 'VENDOR' ? 'Closed' : 'Paid',
              };
            }
            setHistoryData(his_);
          })
          .catch(() => {});
      })
      .catch((er) => {});
  };
  useEffect(() => {
    if (!id) return;
    getAll();
  }, [id]);
  const calculateTotal = () => {
    if (!myData?.addInvInfo || !Array.isArray(myData.addInvInfo)) {
      return 0;
    }

    const total = myData.addInvInfo.reduce((accumulator, addInvInfo) => {
      return accumulator + Number(addInvInfo?.totalAmount || 0);
    }, 0);

    console.log('accumulator', total);
    return total;
  };
  let ParametersCount = 1;
  const gstinRegex =
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    const isValid = gstinRegex.test(inputValue) || inputValue === '';

    setMyData({
      ...myData,
      corporateGSTIN: inputValue,
    });

    setError(!isValid);
  };

  return (
    <>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={8}>
          <CustomLabel labelVal='Invoice' variantVal='h3-underline' />
        </Grid>
        <Grid item xs={4}>
          <Box display='flex' justifyContent='flex-end'>
            <div className=''>
              <AppTooltip placement={'top'} title={''}>
                <>{}</>
              </AppTooltip>
            </div>
          </Box>
        </Grid>
      </Grid>
      <div
        style={{
          background: 'white',
          padding: '10px 10px 10px 10px',
          borderRadius: '15px',
        }}
      >
        <Grid
          container
          spacing={2}
          sx={{
            background: '#FAFAFA',
            margin: 0,
            width: '100%',
            borderRadius: '10px',
          }}
        >
          <Grid
            item
            sm={12}
            md={4}
            style={{
              display: 'flex',
              fontSize: '28px',
              padding: '10px',
              paddingLeft: '25px',
              fontWeight: '500',
              alignItems: 'center',
            }}
          >
            <div>{myData?.corporateName}</div>
          </Grid>
          <Grid
            item
            sm={12}
            md={5}
            style={{
              display: 'flex',
              fontSize: '14px',
              padding: '10px',
              alignItems: 'center',
            }}
          >
            <div style={{width: '100%'}}>
              <Grid container spacing={2}>
                <Grid item sm={4} md={4} style={{fontWeight: 600}}>
                  <div style={{marginBottom: '15px', marginTop: '10px'}}>
                    Invoice No:
                  </div>
                  <div style={{marginBottom: '2px'}}>Invoice Date:</div>
                  <div>Annexure For:</div>
                </Grid>
                <Grid item sm={8} md={8} style={{fontWeight: 400}}>
                  <div style={{marginBottom: '5px'}}>
                    <TextField
                      size='small'
                      value={myData?.invoiceId}
                      // disabled={historyData?.PENDING?.status != 'Pending'}
                      disabled={
                        Object.keys(historyData).length > 1 ||
                        user?.role != 'VENDOR'
                          ? true
                          : false
                      }
                      onInput={(e) => {
                        setMyData({
                          ...myData,
                          invoiceId: e.target.value,
                        });
                      }}
                      // fullWidth
                    />
                    {/* {myData?.invoiceId} */}
                  </div>
                  <div style={{marginBottom: '2px'}}>
                    {moment(myData?.invoiceDate).format('DD MMM YYYY')}
                  </div>
                  <div>
                    {moment(myData?.fromDate).format('DD MMM YYYY') +
                      ' to ' +
                      moment(myData?.toDate).format('DD MMM YYYY')}
                  </div>
                </Grid>
              </Grid>
            </div>
          </Grid>

          <Grid
            item
            sm={12}
            md={3}
            style={{
              display: 'flex',
              fontSize: '14px',
              padding: '10px',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                textAlign: 'center',
                background: '#F2F1F1',
                padding: '10px',
                width: '100%',
                borderRadius: '10px',
              }}
            >
              <div style={{fontSize: '16px', fontWeight: '600'}}>
                Total Amount
              </div>
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  marginTop: '3px',
                  marginBottom: '3px',
                }}
              >
                {toIndianCurrency(
                  Number(myData?.totalRegTripCost || 0) +
                    Number(myData?.regularParkingAmount || 0) +
                    Number(myData?.regularPenaltyAmount || 0) +
                    Number(myData?.regularTollAmount || 0) +
                    Number(myData?.totalAdhocTripCost || 0) +
                    Number(myData?.adhocParkingAmount || 0) +
                    Number(myData?.adhocPenaltyAmount || 0) +
                    Number(myData?.adhocTollAmount || 0),
                )}
              </div>
              <div>
                Due Date:{' '}
                {moment(myData?.dueDate || new Date()).format('DD MMM YYYY')}
              </div>
            </div>
          </Grid>
        </Grid>
        {user?.role == 'VENDOR' && (
          <>
            <Grid
              item
              sm={12}
              md={5}
              style={{
                display: 'flex',
                fontSize: '14px',
                padding: '10px',
                alignItems: 'center',
                marginTop: '10px',
                marginBottom: '10px',
              }}
            >
              <div style={{paddingRight: '20px'}}>
                <TextField
                  size='small'
                  label='Reference No.'
                  InputLabelProps={{shrink: true}}
                  value={myData?.referenceNo}
                  // disabled={historyData?.PENDING?.status != 'Pending'}
                  // disabled={Object.keys(historyData).length > 1 ? true : false}
                  onInput={(e) => {
                    setMyData({
                      ...myData,
                      referenceNo: e.target.value,
                    });
                  }}
                  fullWidth
                />
              </div>
              {/* <div style={{paddingRight: '20px'}}>
                <TextField
                  type='date'
                  size='small'
                  label='Reference Date'
                  InputLabelProps={{shrink: true}}
                  value={myData?.referenceDate}
                  onInput={(e) => {
                    setMyData({
                      ...myData,
                      referenceDate: e.target.value,
                    });
                  }}
                  // fullWidth
                />
              </div> */}
              <div style={{paddingRight: '20px'}}>
                <TextField
                  size='small'
                  label='Buyer’s Order No'
                  InputLabelProps={{shrink: true}}
                  value={myData?.buyerOrderId}
                  onInput={(e) => {
                    setMyData({
                      ...myData,
                      buyerOrderId: e.target.value,
                    });
                  }}
                  // fullWidth
                />
              </div>
              <div style={{paddingRight: '20px'}}>
                <TextField
                  type='date'
                  size='small'
                  label='Buyer’s Order Date'
                  InputLabelProps={{shrink: true}}
                  value={myData?.buyerOrderDate}
                  onInput={(e) => {
                    setMyData({
                      ...myData,
                      buyerOrderDate: e.target.value,
                    });
                  }}
                  // fullWidth
                />
              </div>

              <div style={{paddingRight: '20px'}}>
                <TextField
                  size='small'
                  label='Other Reference'
                  InputLabelProps={{shrink: true}}
                  value={myData?.otherReference}
                  onInput={(e) => {
                    setMyData({
                      ...myData,
                      otherReference: e.target.value,
                    });
                  }}
                  // fullWidth
                />
              </div>
            </Grid>
            <h4 style={{marginLeft: '11px'}}>Bank Details</h4>
            <Grid
              item
              sm={12}
              md={5}
              style={{
                display: 'flex',
                fontSize: '14px',
                padding: '10px',
                alignItems: 'center',
                marginTop: '10px',
                marginBottom: '10px',
              }}
            >
              <div style={{paddingRight: '20px'}}>
                <TextField
                  size='small'
                  label='Mode Of Payment'
                  InputLabelProps={{shrink: true}}
                  value={myData?.paymentMode}
                  onInput={(e) => {
                    setMyData({
                      ...myData,
                      paymentMode: e.target.value,
                    });
                  }}
                  // fullWidth
                />
              </div>
              <div style={{paddingRight: '20px'}}>
                <TextField
                  size='small'
                  label='Account Holder Name'
                  InputLabelProps={{shrink: true}}
                  value={data?.accountName}
                  disabled={data?.accountName}
                />
              </div>
              <div style={{paddingRight: '20px'}}>
                <TextField
                  size='small'
                  label='Bank Account No'
                  InputLabelProps={{shrink: true}}
                  value={data?.accountNumber}
                  disabled={data?.accountNumber}
                />
              </div>
              <div style={{paddingRight: '20px'}}>
                <TextField
                  InputLabelProps={{shrink: true}}
                  size='small'
                  label='IFSC Code'
                  value={data?.ifscCode}
                  disabled={data?.ifscCode}
                />
              </div>
              <div style={{paddingRight: '20px'}}>
                <TextField
                  size='small'
                  label='Bank Name'
                  InputLabelProps={{shrink: true}}
                  value={data?.bankName}
                  disabled={data?.bankName}
                />
              </div>
              <div style={{paddingRight: '20px'}}>
                <TextField
                  size='small'
                  label='Branch Name'
                  value={data?.branchName}
                  disabled={data?.branchName}
                  InputLabelProps={{shrink: true}}
                />
              </div>
            </Grid>
            <h4 style={{marginLeft: '11px'}}>Corporate Details</h4>
            <Grid
              item
              sm={12}
              md={5}
              style={{
                display: 'flex',
                fontSize: '14px',
                padding: '10px',
                alignItems: 'center',
                marginTop: '10px',
                marginBottom: '10px',
              }}
            >
              <div style={{paddingRight: '20px'}}>
                <TextField
                  size='small'
                  label='Corporate Name'
                  InputLabelProps={{shrink: true}}
                  value={myData?.corporateName}
                  onInput={(e) => {
                    setMyData({
                      ...myData,
                      corporateName: e.target.value,
                    });
                  }}
                />
              </div>

              <div style={{paddingRight: '20px'}}>
                <TextField
                  size='small'
                  label='Corporate PinCode'
                  InputLabelProps={{shrink: true}}
                  value={myData?.corporateAddress?.pinCode}
                  onInput={(e) => {
                    setMyData({
                      ...myData,
                      corporateAddress: {
                        ...myData.corporateAddress,
                        pinCode: e.target.value,
                      },
                    });
                  }}
                />
              </div>
              <div style={{paddingRight: '20px'}}>
                <TextField
                  size='small'
                  label='Corporate State'
                  InputLabelProps={{shrink: true}}
                  value={myData?.corporateAddress?.state}
                  onInput={(e) => {
                    setMyData({
                      ...myData,
                      corporateAddress: {
                        ...myData.corporateAddress,
                        state: e.target.value,
                      },
                    });
                  }}
                />
              </div>
              <div style={{padding: '20px'}}>
                <TextField
                  size='small'
                  label='Corporate GSTIN/UIN'
                  InputLabelProps={{shrink: true}}
                  value={myData?.corporateGSTIN}
                  // onInput={(e) => {
                  //   setMyData({
                  //     ...myData,
                  //     iGST: e.target.value,
                  //   });
                  // }}
                  onInput={handleInputChange}
                  // error={error} // Set error to true if there's an error
                  // helperText={error ? 'Please enter a valid GSTIN' : ''} // Display error message
                  inputProps={{
                    pattern:
                      '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$',
                    title:
                      'Please enter a valid GSTIN (2 digits, 5 uppercase letters, 4 digits, 1 uppercase letter, 1 digit/uppercase letter, 1 uppercase letter, 1 digit/uppercase letter)',
                  }}
                />
                {error && (
                  <div style={{color: 'red'}}>Please enter a valid GSTIN</div>
                )}
              </div>

              <div style={{paddingRight: '20px'}}>
                <TextField
                  size='small'
                  label='Corporate Email'
                  InputLabelProps={{shrink: true}}
                  value={myData?.corporateEmail}
                  onInput={(e) => {
                    setMyData({
                      ...myData,
                      corporateEmail: e.target.value,
                    });
                  }}
                />
              </div>
              <div style={{paddingRight: '20px'}}>
                <TextField
                  size='small'
                  multiline
                  rows={4}
                  label='Corporate Address'
                  InputLabelProps={{shrink: true}}
                  value={myData?.corporateAddress?.addressName}
                  onInput={(e) => {
                    setMyData({
                      ...myData,
                      corporateAddress: {
                        ...myData.corporateAddress,
                        addressName: e.target.value,
                      },
                    });
                  }}
                />
              </div>
            </Grid>
          </>
        )}
        <TableContainer component={Paper}>
          <Table aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell align='center'>S.No.</TableCell>
                <TableCell align='left'>Particulars</TableCell>
                <TableCell align='center'>Number of Trips</TableCell>
                <TableCell align='center'>Trip Cost</TableCell>
                <TableCell align='center'>Penalties</TableCell>
                <TableCell align='center'>Parking</TableCell>
                <TableCell align='center'>Toll Tax</TableCell>
                <TableCell align='right'>Total Amount</TableCell>
                <TableCell align='center'>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <>
                {Number(myData?.regularTripCount) > 0 && (
                  <TableRow
                    key={'regtr'}
                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                  >
                    <TableCell align='center'>{ParametersCount++}</TableCell>
                    <TableCell align='left'>
                      Regular Trip
                      {Number(myData?.adhocTripCount <= 0) && (
                        <div>
                          {/* style={{marginTop: '5px'}} */}
                          <TextField
                            type='text'
                            inputProps={{style: {textAlign: 'center'}}}
                            value={
                              myData.empTransParticulars ||
                              `For ${
                                moment(myData?.fromDate).format('DD MMM YYYY') +
                                ' to ' +
                                moment(myData?.toDate).format('DD MMM YYYY')
                              } As Per Annexure`
                            }
                            size='small'
                            onInput={(e) => {
                              setMyData({
                                ...myData,
                                empTransParticulars: e.target.value,
                              });
                            }}
                            disabled={user?.role == 'VENDOR' ? false : true}
                          />
                        </div>
                      )}
                    </TableCell>
                    <TableCell align='center'>
                      {myData?.regularTripCount || 0}
                    </TableCell>
                    <TableCell align='center'>
                      {/* {toIndianCurrency(myData.totalRegTripCost || 0)} */}
                      <TextField
                        type='text'
                        onKeyDown={blockInvalidChar}
                        inputProps={{min: 0, style: {textAlign: 'center'}}}
                        value={myData.totalRegTripCost}
                        size='small'
                        onInput={(e) => {
                          setMyData({
                            ...myData,
                            totalRegTripCost: e.target.value,
                          });
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>₹</InputAdornment>
                          ),
                        }}
                        disabled={user?.role == 'VENDOR' ? false : true}
                      />
                    </TableCell>
                    <TableCell align='center'>
                      {/* {toIndianCurrency(myData.regularPenaltyAmount || 0)} */}
                      <TextField
                        type='text'
                        onKeyDown={blockInvalidChar}
                        inputProps={{min: 0, style: {textAlign: 'center'}}}
                        value={myData.regularPenaltyAmount}
                        size='small'
                        onInput={(e) => {
                          setMyData({
                            ...myData,
                            regularPenaltyAmount: e.target.value,
                          });
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>₹</InputAdornment>
                          ),
                        }}
                        disabled={user?.role == 'VENDOR' ? false : true}
                      />
                    </TableCell>
                    <TableCell align='center'>
                      {/* {toIndianCurrency(myData.regularParkingAmount || 0)} */}
                      <TextField
                        type='text'
                        onKeyDown={blockInvalidChar}
                        inputProps={{min: 0, style: {textAlign: 'center'}}}
                        value={myData.regularParkingAmount}
                        size='small'
                        onInput={(e) => {
                          setMyData({
                            ...myData,
                            regularParkingAmount: e.target.value,
                          });
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>₹</InputAdornment>
                          ),
                        }}
                        disabled={user?.role == 'VENDOR' ? false : true}
                      />
                    </TableCell>
                    <TableCell align='center'>
                      {/* {toIndianCurrency(myData.regularTollAmount || 0)} */}
                      <TextField
                        type='text'
                        onKeyDown={blockInvalidChar}
                        inputProps={{min: 0, style: {textAlign: 'center'}}}
                        value={myData.regularTollAmount}
                        size='small'
                        onInput={(e) => {
                          setMyData({
                            ...myData,
                            regularTollAmount: e.target.value,
                          });
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>₹</InputAdornment>
                          ),
                        }}
                        disabled={user?.role == 'VENDOR' ? false : true}
                      />
                    </TableCell>
                    <TableCell align='right'>
                      {toIndianCurrency(
                        Number(myData.totalRegTripCost || 0) +
                          Number(myData.regularPenaltyAmount || 0) +
                          Number(myData.regularParkingAmount || 0) +
                          Number(myData.regularTollAmount || 0),
                      )}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                )}
              </>
              <>
                {Number(myData?.adhocTripCount) > 0 && (
                  <TableRow
                    key={'adhtr'}
                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                  >
                    <TableCell align='center'>{ParametersCount++}</TableCell>
                    <TableCell align='left'>
                      Adhoc Trip
                      <div>
                        {/* style={{marginTop: '5px'}} */}
                        <TextField
                          type='text'
                          inputProps={{style: {textAlign: 'center'}}}
                          value={
                            myData.empTransParticulars ||
                            `For ${
                              moment(myData?.fromDate).format('DD MMM YYYY') +
                              ' to ' +
                              moment(myData?.toDate).format('DD MMM YYYY')
                            } As Per Annexure`
                          }
                          size='small'
                          onInput={(e) => {
                            setMyData({
                              ...myData,
                              empTransParticulars: e.target.value,
                            });
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell align='center'>
                      {myData?.adhocTripCount || 0}
                    </TableCell>
                    <TableCell align='center'>
                      {/* {toIndianCurrency(myData.totalAdhocTripCost || 0)} */}
                      <TextField
                        type='number'
                        onKeyDown={blockInvalidChar}
                        inputProps={{min: 0, style: {textAlign: 'center'}}}
                        value={myData.totalAdhocTripCost}
                        size='small'
                        onInput={(e) => {
                          setMyData({
                            ...myData,
                            totalAdhocTripCost: e.target.value,
                          });
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>₹</InputAdornment>
                          ),
                        }}
                      />
                    </TableCell>
                    <TableCell align='center'>
                      {/* {toIndianCurrency(myData.adhocPenaltyAmount || 0)} */}
                      <TextField
                        type='number'
                        onKeyDown={blockInvalidChar}
                        inputProps={{min: 0, style: {textAlign: 'center'}}}
                        value={myData.adhocPenaltyAmount}
                        size='small'
                        onInput={(e) => {
                          setMyData({
                            ...myData,
                            adhocPenaltyAmount: e.target.value,
                          });
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>₹</InputAdornment>
                          ),
                        }}
                      />
                    </TableCell>
                    <TableCell align='center'>
                      {/* {toIndianCurrency(myData.adhocParkingAmount || 0)} */}
                      <TextField
                        type='number'
                        onKeyDown={blockInvalidChar}
                        inputProps={{min: 0, style: {textAlign: 'center'}}}
                        value={myData.adhocParkingAmount}
                        size='small'
                        onInput={(e) => {
                          setMyData({
                            ...myData,
                            adhocParkingAmount: e.target.value,
                          });
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>₹</InputAdornment>
                          ),
                        }}
                      />
                    </TableCell>
                    <TableCell align='center'>
                      {/* {toIndianCurrency(myData.adhocTollAmount || 0)} */}
                      <TextField
                        type='number'
                        onKeyDown={blockInvalidChar}
                        inputProps={{min: 0, style: {textAlign: 'center'}}}
                        value={myData.adhocTollAmount}
                        size='small'
                        onInput={(e) => {
                          setMyData({
                            ...myData,
                            adhocTollAmount: e.target.value,
                          });
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>₹</InputAdornment>
                          ),
                        }}
                      />
                    </TableCell>
                    <TableCell align='right'>
                      {toIndianCurrency(
                        Number(myData.totalAdhocTripCost || 0) +
                          Number(myData.adhocPenaltyAmount || 0) +
                          Number(myData.adhocParkingAmount || 0) +
                          Number(myData.adhocTollAmount || 0),
                      )}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                )}
              </>
              {!!additionalFields?.length && (
                <TableRow
                  key={'adhtrwwss'}
                  sx={{'&:last-child td, &:last-child th': {border: 0}}}
                >
                  <TableCell align='center'></TableCell>
                  <TableCell align='left'></TableCell>
                  <TableCell align='center'></TableCell>
                  <TableCell align='center'>Cost</TableCell>
                  <TableCell align='center'>Tax Type</TableCell>
                  <TableCell align='center'>Tax %</TableCell>
                  <TableCell align='center'>Tax Amount</TableCell>
                  <TableCell align='right'></TableCell>
                  <TableCell align='center'></TableCell>
                </TableRow>
              )}
              {additionalFields?.map((el, ind) => (
                <TableRow
                  key={ind}
                  sx={{'&:last-child td, &:last-child th': {border: 0}}}
                >
                  <TableCell align='center'>{ind + ParametersCount}</TableCell>
                  <TableCell align='left'>
                    <TextField
                      size='small'
                      value={el.parameter}
                      onInput={(e) => {
                        el.parameter = e.target.value;
                        let tem = additionalFields;
                        tem[ind] = {...tem[ind], parameter: e.target.value};
                        setAdditionalFields([...tem]);
                      }}
                      disabled={user?.role == 'VENDOR' ? false : true}
                    />
                    <div style={{paddingTop: '5px'}}>
                      <TextField
                        size='small'
                        value={el.purpose}
                        onInput={(e) => {
                          el.purpose = e.target.value;
                          let tem = additionalFields;
                          tem[ind] = {...tem[ind], purpose: e.target.value};
                          setAdditionalFields([...tem]);
                        }}
                        disabled={user?.role == 'VENDOR' ? false : true}
                      />
                    </div>
                  </TableCell>
                  <TableCell align='center'></TableCell>
                  <TableCell align='center'>
                    <TextField
                      type='number'
                      onKeyDown={blockInvalidChar}
                      inputProps={{min: 0, style: {textAlign: 'center'}}}
                      value={el.tripCost}
                      size='small'
                      onInput={(e) => {
                        el.tripCost = e.target.value;
                        let tem = additionalFields;
                        tem[ind] = {...tem[ind], tripCost: e.target.value};
                        setAdditionalFields([...tem]);
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>₹</InputAdornment>
                        ),
                      }}
                      disabled={user?.role == 'VENDOR' ? false : true}
                    />
                  </TableCell>
                  <TableCell align='center'>
                    <Select
                      labelId='demo-simple-select-label'
                      id='demo-simple-select'
                      value={el.taxType}
                      size='small'
                      label='Age'
                      fullWidth
                      onChange={(e) => {
                        el.taxType = e.target.value;
                        let tem = additionalFields;
                        let tem2 = {taxType: e.target.value};
                        if (e.target.value == 'SEZ') {
                          tem2.taxPercentage = 0;
                        }
                        tem[ind] = {...tem[ind], ...tem2};
                        setAdditionalFields([...tem]);
                      }}
                      disabled={user?.role == 'VENDOR' ? false : true}
                    >
                      <MenuItem value={'IGST'}>IGST</MenuItem>
                      <MenuItem value={'CGST_SGST'}>CGST + SGST</MenuItem>
                      <MenuItem value={'SEZ'}>SEZ</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell align='center'>
                    <TextField
                      type='number'
                      onKeyDown={blockInvalidChar}
                      disabled={
                        el.taxType == 'SEZ' || user?.role != 'VENDOR'
                          ? true
                          : false
                      }
                      inputProps={{min: 0, style: {textAlign: 'center'}}}
                      value={el.taxPercentage}
                      size='small'
                      onInput={(e) => {
                        el.taxPercentage =
                          el.taxType == 'SEZ' ? 0 : e.target.value;
                        let tem = additionalFields;
                        tem[ind] = {...tem[ind], taxPercentage: e.target.value};
                        setAdditionalFields([...tem]);
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='start'>%</InputAdornment>
                        ),
                      }}
                    />
                  </TableCell>
                  <TableCell align='center'>
                    {toIndianCurrency(getOtherCharges('TAX')[ind])}
                  </TableCell>
                  <TableCell align='right'>
                    {toIndianCurrency(getOtherCharges('TOTAL')[ind])}
                  </TableCell>
                  <TableCell>
                    <HighlightOffIcon
                      onClick={() => {
                        let tem = additionalFields || [];
                        tem.splice(ind, 1);
                        setAdditionalFields([...tem]);
                      }}
                      sx={{color: '#e53835'}}
                    />
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                {user?.role == 'VENDOR' ? (
                  <TableCell colSpan={9}>
                    <Button
                      size='small'
                      variant='outlined'
                      onClick={() => {
                        let tem = additionalFields || [];
                        tem.push({});
                        setAdditionalFields([...tem]);
                      }}
                    >
                      + Add More
                    </Button>
                  </TableCell>
                ) : null}
              </TableRow>
              <TableRow
                key={'adhtr'}
                sx={{'&:last-child td, &:last-child th': {border: 0}}}
              >
                <TableCell colSpan={10}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'right',
                    }}
                  >
                    <Grid container spacing={2} sx={{width: '300px'}}>
                      <Grid item sm={6} md={6} style={{textAlign: 'right'}}>
                        <div style={{marginBottom: '10px', fontWeight: 600}}>
                          Taxable Sub Total:
                        </div>
                        {taxes?.taxes?.map((el) => (
                          <div style={{marginBottom: '10px', fontWeight: 400}}>
                            {el?.taxTypeName}({el?.taxAbleAmount}%):
                          </div>
                        ))}
                        <div style={{fontWeight: '600'}}>Additionals:</div>
                        <div style={{fontWeight: '600'}}>Total:</div>
                      </Grid>
                      <Grid
                        item
                        sm={6}
                        md={6}
                        style={{
                          fontWeight: 400,
                          textAlign: 'right',
                        }}
                      >
                        <div style={{marginBottom: '10px'}}>
                          {toIndianCurrency(taxes?.total)}
                        </div>
                        {taxes?.taxes?.map((el) => (
                          <div style={{marginBottom: '10px'}}>
                            {toIndianCurrency(
                              (taxes?.total * Number(el?.taxAbleAmount || 0)) /
                                100,
                            )}
                          </div>
                        ))}
                        <div>{toIndianCurrency(getOtherCharges('FINAL'))}</div>
                        <div>
                          {toIndianCurrency(
                            taxes?.subTotal + getOtherCharges('FINAL'),
                          )}
                        </div>
                      </Grid>
                    </Grid>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <div style={{width: '100%', textAlign: 'center', marginTop: '20px'}}>
          {user?.role == 'VENDOR' ? (
            <Button
              variant='contained'
              sx={{mr: 2}}
              onClick={() => {
                let reqBody = {
                  ...myData,
                  addInvInfo: additionalFields ? [...additionalFields] : [],
                  additionalAmount: getOtherCharges('FINAL'),
                  bankName: data?.bankName,
                  branchName: data?.branchName,
                  accountName: data?.accountName,
                  accountNumber: data?.accountNumber,
                  ifscCode: data?.ifscCode,
                };
                // delete reqBody?.corporateName;
                // delete reqBody?.corporateId;
                // delete reqBody?.vendorId;
                // delete reqBody?.vendorName;
                // delete reqBody?.invoiceId;
                // delete reqBody?.invoiceDate;
                // delete reqBody?.fromDate;
                // delete reqBody?.fromDate;
                // delete reqBody?.toDate;

                axios
                  .post(
                    Api.baseUri + '/user-reg/invoice/updateInvoice',
                    reqBody,
                  )
                  .then((res) => {
                    if (res?.data?.status == '200') {
                      toast.success(
                        res?.data?.message || 'Invoice updated successfully.',
                      );
                      getAll();
                    } else {
                      toast.error(
                        res?.data?.message || 'Something went wrong.',
                      );
                    }
                  })
                  .catch((err) => {
                    toast.error('Something went wrong!');
                  });
              }}
            >
              Update
            </Button>
          ) : null}
          <Button variant='contained' onClick={handlePrint}>
            <PrintIcon sx={{mr: 1}} />
            Print Invoice
          </Button>
        </div>
      </div>
      <div style={{display: 'none'}}>
        <div
          style={{background: 'white', padding: '30px'}}
          ref={componentRef}
          name='fffff'
        >
          <div
            style={{
              position: 'fixed',
              bottom: 0,
              right: '10px',
              width: '100%',
              textAlign: 'right',
            }}
            className='page-number'
          ></div>
          <div
            style={{display: 'flex', justifyContent: 'center', width: '100%'}}
          >
            <img
              src='/eTravelmateLogo.png'
              style={{width: '50px', height: 'auto'}}
            />
          </div>
          <div
            style={{
              textAlign: 'center',
              fontSize: '24px',
              fontWeight: 600,
              marginTop: '5px',
              width: '100%',
            }}
          >
            {vendorDetails?.vendorName}
          </div>
          <Grid container spacing={2}>
            <Grid
              item
              sm={12}
              md={12}
              style={{fontWeight: 600, color: '#3E4145'}}
            >
              <div
                style={{
                  textAlign: 'center',
                  fontSize: '18px',
                  fontWeight: 600,
                  marginTop: '5px',
                  width: '100%',
                }}
              >
                Tax Invoice <br />
              </div>
            </Grid>
            {myData?.addInvInfo?.some((item) => item.taxType == 'SEZ') ? (
              <div style={{backgroundColor: '#86b6c2', padding: '5px'}}>
                <p>
                  (SUPPLY MEANT FOR EXPORT/SUPPLY TO SEZ UNIT OR SEZ DEVELOPER
                  FOR AUTHORISED OPERATIONS UNDER BOND OR LETTER OF UNDERTAKING
                  WITHOUT PAYMENT OF IGST)
                </p>
              </div>
            ) : null}
          </Grid>
          <Grid
            container
            spacing={2}
            style={{
              border: '1px solid',
              borderBottom: '0px',
              marginTop: '10px',
            }}
          >
            <Grid
              item
              sm={6}
              md={6}
              style={{
                fontWeight: 500,
                fontSize: '14px',
                padding: '10px',
                color: '#3E4145',
                borderRight: '1px solid',
                borderBottom: '1px solid',
              }}
            >
              <div style={{fontWeight: 600, fontSize: '18px'}}>
                {vendorDetails?.vendorName}
              </div>
              <div style={{marginTop: '5px'}}>
                {vendorDetails?.address?.addressName?.split('++')[0]}
                {vendorDetails?.address?.addressName?.split('++')[1] !=
                'undefined'
                  ? ', ' + vendorDetails?.address?.addressName?.split('++')[1]
                  : ''}
                , {vendorDetails?.address?.city}
                {', PIN: '}
                {vendorDetails?.address?.pinCode}
              </div>
              <div style={{marginTop: '5px'}}>
                GSTIN/UIN: {vendorDetails?.companyGSTN || 'NA'}
              </div>
              <div style={{marginTop: '5px'}}>
                State Name : {vendorDetails?.address?.state}
              </div>
              <div style={{marginTop: '5px'}}>
                E-Mail : {vendorDetails?.emailId || 'NA'}
              </div>
            </Grid>
            <Grid
              item
              sm={6}
              md={6}
              style={{
                fontWeight: 600,
                color: '#3E4145',
              }}
            >
              <Grid container spacing={2} style={{borderBottom: '1px solid'}}>
                <Grid
                  item
                  sm={6}
                  md={6}
                  style={{
                    fontWeight: 600,
                    color: '#3E4145',
                    padding: '10px',
                    fontSize: '14px',
                    marginTop: 0,
                    borderRight: '1px solid',
                  }}
                >
                  <div style={{fontWeight: 500}}>Invoice No. </div>
                  <div>{myData?.invoiceId}</div>
                </Grid>
                <Grid
                  item
                  sm={6}
                  md={6}
                  style={{
                    fontWeight: 600,
                    padding: '10px',
                    fontSize: '14px',
                    color: '#3E4145',
                  }}
                >
                  <div style={{fontWeight: 500}}>Date </div>
                  <div>{moment(myData?.invoiceDate).format('DD MMM YYYY')}</div>
                </Grid>
              </Grid>
              <Grid container spacing={2} style={{borderBottom: '1px solid'}}>
                <Grid
                  item
                  sm={6}
                  md={6}
                  style={{
                    fontWeight: 600,
                    padding: '10px',
                    fontSize: '14px',
                    color: '#3E4145',
                    marginTop: 0,
                    borderRight: '1px solid',
                  }}
                >
                  <div style={{fontWeight: 500}}>Reference No. & Date. </div>
                  <div>
                    {myData?.referenceNo}
                    {/* {myData?.referenceDate
                      ? `/${moment(myData?.referenceDate).format(
                          'DD MMM YYYY',
                        )}`
                      : ''} */}
                  </div>
                </Grid>
                <Grid
                  item
                  sm={6}
                  md={6}
                  style={{
                    fontWeight: 600,
                    padding: '10px',
                    fontSize: '14px',
                    color: '#3E4145',
                  }}
                >
                  <div style={{fontWeight: 500}}>Other References </div>
                  <div style={{minHeight: '12px'}}>
                    {myData?.otherReference}{' '}
                  </div>
                </Grid>
              </Grid>
              <Grid container spacing={2} style={{borderBottom: '1px solid'}}>
                <Grid
                  item
                  sm={6}
                  md={6}
                  style={{
                    fontWeight: 600,
                    padding: '10px',
                    fontSize: '14px',
                    color: '#3E4145',
                    marginTop: 0,
                    borderRight: '1px solid',
                  }}
                >
                  <div style={{fontWeight: 500}}>Buyer’s Order No. </div>
                  <div style={{minHeight: '12px'}}>{myData?.buyerOrderId} </div>
                </Grid>
                <Grid
                  item
                  sm={6}
                  md={6}
                  style={{
                    fontWeight: 600,
                    padding: '10px',
                    fontSize: '14px',
                    color: '#3E4145',
                  }}
                >
                  <div style={{fontWeight: 500}}>Dated </div>
                  <div style={{minHeight: '12px'}}>
                    {myData?.buyerOrderDate}{' '}
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            style={{border: '1px solid', marginTop: 0, borderTop: '0px'}}
          >
            <Grid
              item
              sm={6}
              md={6}
              style={{
                fontWeight: 500,
                fontSize: '14px',
                padding: '10px',
                color: '#3E4145',
                borderRight: '1px solid',
              }}
            >
              Buyer (Bill to)
              <div style={{fontWeight: 600, fontSize: '18px'}}>
                {/* {corpDetails?.companyName} */}
                {myData?.corporateName ?? 'N/A'}
              </div>
              <div style={{marginTop: '5px'}}>
                {/* {corpDetails?.companyAddress?.addressName?.split('++')[0]}
                {corpDetails?.companyAddress?.addressName?.split('++')[1] !=
                'undefined'
                  ? ', ' +
                    corpDetails?.companyAddress?.addressName?.split('++')[1]
                  : ''}
                , PIN: {corpDetails?.companyAddress?.pinCode} */}
                {myData?.corporateAddress?.addressName?.split('++')[0]}
                {myData?.corporateAddress?.addressName?.split('++')[1] !=
                'undefined'
                  ? ', ' + myData?.corporateAddress?.addressName?.split('++')[1]
                  : ''}
                , PIN: {myData?.corporateAddress?.pinCode ?? 'N/A'}
              </div>
              <div style={{marginTop: '5px'}}>
                GSTIN/UIN: {myData?.corporateGSTIN ?? 'N/A'}
              </div>
              <div style={{marginTop: '5px'}}>
                {/* State Name : {corpDetails?.companyAddress?.state} */}
                State Name : {myData?.corporateAddress?.state ?? 'N/A'}
              </div>
              <div style={{marginTop: '5px'}}>
                E-Mail : {myData?.corporateEmail}
              </div>
            </Grid>
            <Grid
              item
              sm={6}
              md={6}
              style={{
                fontWeight: 500,
                fontSize: '14px',
                padding: '10px',
                color: '#3E4145',
                borderRight: '1px solid',
              }}
            >
              {/* <div>Payment Mode </div> */}
              <div>Payment Mode : {myData?.paymentMode || 'N/A'}</div>
              <b>Bank Details</b>
              {/* <div> Account Holder Name</div> */}
              <div>Account Holder Name : {myData?.accountName || 'N/A'}</div>
              {/* <div> Bank Account No</div> */}
              <div>Bank Account No: {myData?.accountNumber || 'N/A'}</div>
              {/* <div> IFSC Code</div> */}
              <div>IFSC Code : {myData?.ifscCode || 'N/A'}</div>
              {/* <div>Bank Name</div> */}
              <div>Bank Name : {myData?.bankName || 'N/A'}</div>
              {/* <div>Branch Name</div> */}
              <div>Branch Name : {myData?.branchName || 'N/A'}</div>
            </Grid>
            {/* <Grid
              item
              sm={3}
              md={3}
              style={{
                fontWeight: 500,
                fontSize: '14px',
                padding: '10px',
                color: '#3E4145',
                borderRight: '1px solid',
              }}
            >
              Bank Details
              <div>
                <b>{myData?.accountName}</b>
              </div>
              <div>
                <b>{myData?.accountNumber}</b>
              </div>
              <div>
                <b>{myData?.ifscCode}</b>
              </div>
              <div>
                <b>{myData?.bankName}</b>
              </div>
              <div>
                <b>{myData?.branchName}</b>
              </div>
            </Grid> */}
          </Grid>
          <table
            style={{
              width: 'calc(100% + 8px)',
              marginLeft: '-8px',
              borderCollapse: 'collapse',
            }}
          >
            <tr>
              <th style={{border: '1px solid', padding: '10px'}}>S No.</th>
              <th style={{border: '1px solid', padding: '10px'}}>
                Particulars
              </th>
              {/* <th style={{border: '1px solid', padding: '10px'}}>HSN/SAC</th> */}
              <th style={{border: '1px solid', padding: '10px'}}>Quantity</th>
              <th style={{border: '1px solid', padding: '10px'}}>Rate</th>
              <th style={{border: '1px solid', padding: '10px'}}>Per</th>
              <th style={{border: '1px solid', padding: '10px'}}>Amount</th>
            </tr>
            <tr style={{textAlign: 'center', fontWeight: 600}}>
              <td style={{border: '1px solid', padding: '10px'}}>1</td>
              <td
                style={{border: '1px solid', padding: '10px', fontWeight: 600}}
              >
                <div>Employee Transport Services</div>
                <div style={{fontSize: '12px', fontWeight: 500}}>
                  {myData.empTransParticulars ||
                    `For ${
                      moment(myData?.fromDate).format('DD MMM YYYY') +
                      ' to ' +
                      moment(myData?.toDate).format('DD MMM YYYY')
                    } As Per Annexure`}
                </div>
                {taxes?.taxes?.map((el) => (
                  <div style={{marginTop: '5px'}}>
                    {el?.taxTypeName} @{el?.taxAbleAmount}%
                  </div>
                ))}
              </td>
              {/* <td style={{border: '1px solid', padding: '10px'}}>
                <div style={{height: '12px', fontWeight: 500}}></div>
                {taxes?.taxes?.map((el) => (
                  <div style={{marginTop: '5px'}}>-</div>
                ))}
              </td> */}
              <td style={{border: '1px solid', padding: '10px'}}>
                <div>
                  {Number(myData?.adhocTripCount || 0) +
                    Number(myData?.regularTripCount || 0)}
                </div>
                <div style={{height: '12px', fontWeight: 500}}></div>
                {taxes?.taxes?.map((el) => (
                  <div style={{marginTop: '5px'}}>-</div>
                ))}
              </td>
              <td align='right' style={{border: '1px solid', padding: '10px'}}>
                <div>{toIndianCurrency(taxes?.total)}</div>
                <div style={{height: '12px', fontWeight: 500}}></div>
                {taxes?.taxes?.map((el) => (
                  <div style={{marginTop: '5px'}}>
                    {toIndianCurrency(
                      (taxes?.total * Number(el?.taxAbleAmount || 0)) / 100,
                    )}
                  </div>
                ))}
              </td>
              <td style={{border: '1px solid', padding: '10px'}}>
                <div style={{height: '14px'}}></div>
                <div style={{height: '12px', fontWeight: 500}}></div>
                {taxes?.taxes?.map((el) => (
                  <div style={{marginTop: '5px'}}>%</div>
                ))}
              </td>
              <td align='right' style={{border: '1px solid', padding: '10px'}}>
                <div>{toIndianCurrency(taxes?.total)}</div>
                <div style={{height: '12px', fontWeight: 500}}></div>
                {taxes?.taxes?.map((el) => (
                  <div style={{marginTop: '5px'}}>
                    {toIndianCurrency(
                      (taxes?.total * Number(el?.taxAbleAmount || 0)) / 100,
                    )}
                  </div>
                ))}
              </td>
            </tr>
            {myData?.addInvInfo?.map((addInvInfo, index) => {
              return (
                <tr style={{textAlign: 'center', fontWeight: 600}} key={index}>
                  <td style={{border: '1px solid', padding: '10px'}}>
                    {index + 2}
                  </td>
                  <td style={{border: '1px solid', padding: '10px'}}>
                    {addInvInfo?.parameter}
                    <div style={{fontSize: '12px', fontWeight: 500}}>
                      {addInvInfo?.purpose}
                    </div>
                    <div style={{marginTop: '12px'}}>
                      {addInvInfo?.taxType} @{addInvInfo?.taxPercentage || 0}%
                    </div>
                  </td>
                  <td style={{border: '1px solid', padding: '10px'}}>-</td>
                  <td style={{border: '1px solid', padding: '10px'}}>
                    <div>{toIndianCurrency(addInvInfo?.tripCost)}</div>
                    <div style={{height: '12px', fontWeight: 500}}></div>
                    <div>{toIndianCurrency(addInvInfo?.taxAmount)}</div>
                  </td>
                  <td style={{border: '1px solid', padding: '10px'}}>
                    <div style={{height: '14px'}}></div>
                    <div style={{height: '12px', fontWeight: 500}}></div>
                    <div>%</div>
                  </td>
                  <td
                    align='right'
                    style={{border: '1px solid', padding: '10px'}}
                  >
                    <div>{toIndianCurrency(addInvInfo?.tripCost)}</div>
                    <div style={{height: '12px', fontWeight: 500}}></div>
                    <div>{toIndianCurrency(addInvInfo?.taxAmount)}</div>
                  </td>
                </tr>
              );
            })}
            <tr style={{textAlign: 'center', fontWeight: 600}}>
              <td style={{border: '1px solid', padding: '10px'}}></td>
              <td align='right' style={{border: '1px solid', padding: '10px'}}>
                Total
              </td>
              {/* <td style={{border: '1px solid', padding: '10px'}}></td> */}
              <td style={{border: '1px solid', padding: '10px'}}></td>
              <td style={{border: '1px solid', padding: '10px'}}></td>
              <td style={{border: '1px solid', padding: '10px'}}></td>
              <td align='right' style={{border: '1px solid', padding: '10px'}}>
                {toIndianCurrency(taxes?.subTotal + calculateTotal())}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  border: '1px solid',
                  padding: '10px',
                }}
                colSpan={7}
              >
                <div
                  style={{padding: '5px', fontSize: '14px', fontWeight: 600}}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '12px',
                      fontWeight: 500,
                    }}
                  >
                    <div>Amount Chargeable (in words)</div>
                    <div>E. & O.E</div>
                  </div>
                  <div>
                    INR{' '}
                    {converter
                      ?.toWords(Number(taxes?.subTotal + calculateTotal() || 0))
                      ?.toUpperCase()}
                    {' RUPEES '}
                    {taxes?.subTotal?.toString()?.split('.')[1]
                      ? 'AND ' +
                        converter
                          ?.toWords(
                            Number(taxes?.subTotal?.toString()?.split('.')[1]),
                          )
                          ?.toUpperCase() +
                        ' Paise '
                      : ''}
                    ONLY
                  </div>
                </div>
              </td>
            </tr>
          </table>
          <table
            style={{
              width: 'calc(100% + 8px)',
              marginLeft: '-8px',
              borderCollapse: 'collapse',
            }}
          >
            <tr style={{textAlign: 'center'}}>
              <td style={{border: '1px solid', padding: '5px'}}></td>
              <td style={{border: '1px solid', padding: '5px'}}>
                Taxable Value
              </td>
              {taxes?.taxes?.map((el) => (
                <td style={{border: '1px solid'}}>
                  <div
                    style={{
                      borderBottom: '1px solid',
                      padding: '2px',
                    }}
                  >
                    {el?.taxTypeName}
                  </div>
                  <div style={{display: 'flex'}}>
                    <div
                      style={{
                        width: '50%',
                        borderRight: '1px solid',
                        padding: '2px',
                      }}
                    >
                      Rate
                    </div>
                    <div style={{width: '50%'}}>Amount</div>
                  </div>
                </td>
              ))}
              <td style={{border: '1px solid', padding: '5px'}}>
                Total Tax Amount
              </td>
            </tr>

            <tr style={{textAlign: 'center'}}>
              <td
                style={{
                  border: '1px solid',
                }}
              ></td>
              <td style={{border: '1px solid'}}>
                {toIndianCurrency(taxes?.total)}
              </td>
              {taxes?.taxes?.map((el) => (
                <td style={{border: '1px solid'}}>
                  <div style={{display: 'flex'}}>
                    <div
                      style={{
                        width: '50%',
                        borderRight: '1px solid',
                      }}
                    >
                      {el?.taxAbleAmount}%
                    </div>
                    <div style={{width: '50%'}}>
                      {toIndianCurrency(
                        (taxes?.total * el?.taxAbleAmount) / 100,
                      )}
                    </div>
                  </div>
                </td>
              ))}
              <td style={{border: '1px solid'}}>
                {toIndianCurrency(taxes?.subTotal)}
              </td>
            </tr>
            <tr style={{textAlign: 'center'}}>
              <td
                style={{
                  border: '1px solid',
                  textAlign: 'right',
                  fontWeight: 600,
                  paddingRight: '5px',
                }}
              >
                Total
              </td>
              <td style={{border: '1px solid'}}>
                {toIndianCurrency(taxes?.total)}
              </td>
              {taxes?.taxes?.map((el) => (
                <td style={{border: '1px solid'}}>
                  <div style={{display: 'flex'}}>
                    <div
                      style={{
                        width: '50%',
                        borderRight: '1px solid',
                      }}
                    ></div>
                    <div style={{width: '50%'}}>
                      {toIndianCurrency(
                        (taxes?.total * el?.taxAbleAmount) / 100,
                      )}
                    </div>
                  </div>
                </td>
              ))}
              <td style={{border: '1px solid'}}>
                {toIndianCurrency(
                  Number(taxes?.subTotal || 0) - Number(taxes?.total || 0),
                )}
              </td>
            </tr>
            <tr style={{border: '1px solid'}}>
              <td colSpan={7}>
                <div
                  style={{padding: '5px', fontSize: '14px', fontWeight: 600}}
                >
                  <span style={{fontSize: '12px', fontWeight: 500}}>
                    {'Tax Amount (in words): '}
                  </span>
                  INR{' '}
                  {converter
                    ?.toWords(
                      Number(taxes?.subTotal || 0) - Number(taxes?.total || 0),
                    )
                    ?.toUpperCase()}
                  {' RUPEES '}
                  {Number(taxes?.subTotal || 0) -
                    Number(taxes?.total || 0)
                      ?.toString()
                      ?.split('.')[1] || 0
                    ? 'AND ' +
                      converter
                        ?.toWords(
                          Number(taxes?.subTotal || 0) -
                            Number(taxes?.total || 0)
                              ?.toString()
                              ?.split('.')[1] || 0,
                        )
                        ?.toUpperCase() +
                      ' Paise '
                    : ''}
                  ONLY
                </div>
                <Grid container>
                  <Grid
                    item
                    sm={6}
                    md={6}
                    style={{
                      fontWeight: 500,
                      color: '#3E4145',
                      padding: '5px',
                    }}
                  >
                    Company’s PAN : {vendorDetails?.companyPAN || 'NA'}
                  </Grid>

                  <Grid
                    item
                    sm={6}
                    md={6}
                    style={{
                      fontWeight: 600,
                      color: '#3E4145',
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        border: '1px solid',
                        borderBottom: '0px',
                        borderRight: '0px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          padding: '10px',
                        }}
                      >
                        For {corpDetails?.companyName}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'end',
                          alignItems: 'baseline',
                          marginTop: '30px',
                          padding: '10px',
                        }}
                      >
                        Authorised Signatory
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </td>
            </tr>
          </table>
          <div
            style={{
              marginTop: '10px',
              borderTop: '1px solid',
            }}
          >
            <h2
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {vendorDetails?.vendorName}
            </h2>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '2px',
              }}
            >
              {vendorDetails?.address?.addressName?.split('++')[0]}
              {vendorDetails?.address?.addressName?.split('++')[1] !=
              'undefined'
                ? ', ' + vendorDetails?.address?.addressName?.split('++')[1]
                : ''}
              , {vendorDetails?.address?.city}, {vendorDetails?.address?.state},{' '}
              {', PIN: '}
              {vendorDetails?.address?.pinCode}
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              Email: {vendorDetails?.emailId} | Phone: {vendorDetails?.mobileNo}
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          background: 'white',
          padding: '20px',
          borderRadius: '10px',
          marginTop: '10px',
        }}
      >
        <CustomLabel labelVal='History' variantVal='h3-underline' />
        <Box sx={{width: '100%', mt: 6}}>
          <Grid
            container
            spacing={2}
            style={{
              paddingLeft: '15px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              marginBottom: '5px',
              fontWeight: 600,
            }}
          >
            <Grid
              item
              sm={6}
              md={3}
              style={{textAlign: 'left', paddingLeft: '28px'}}
            >
              Name / Role
            </Grid>
            <Grid item sm={6} md={2}>
              Date
            </Grid>
            <Grid item sm={6} md={3} sx={{textAlign: 'left'}}>
              Remarks / Message
            </Grid>
            <Grid item sm={6} md={2}>
              Status
            </Grid>
            <Grid item sm={6} md={2}>
              Attachment/File
            </Grid>
          </Grid>
          <Stepper activeStep={activeStep} orientation='vertical'>
            {Object.keys(historyData).map((step, index) => (
              <Step key={step.label}>
                <StepLabel>
                  <Grid
                    container
                    spacing={2}
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      textAlign: 'center',
                    }}
                  >
                    <Grid
                      item
                      sm={6}
                      md={3}
                      sx={{textAlign: 'left', paddingLeft: '15px'}}
                    >
                      {historyData[step]?.name} ({historyData[step]?.role})
                    </Grid>
                    <Grid item sm={6} md={2}>
                      {historyData[step]?.date != 'Date'
                        ? moment(historyData[step]?.date).format('DD MMM YYYY')
                        : 'Date'}
                    </Grid>
                    <Grid item sm={6} md={3} sx={{textAlign: 'left'}}>
                      {historyData[step]?.remarks || 'NA'}
                    </Grid>
                    <Grid
                      item
                      sm={6}
                      md={2}
                      sx={{
                        color:
                          historyData[step]?.status == 'CLOSED'
                            ? 'green'
                            : historyData[step]?.status == 'DECLINED' ||
                              historyData[step]?.status == 'CANCELLED'
                            ? 'red'
                            : 'orange',
                      }}
                    >
                      {historyData[step]?.status || 'NA'}
                    </Grid>
                    <Grid
                      item
                      sm={6}
                      md={2}
                      sx={{display: 'flex', justifyContent: 'center'}}
                    >
                      <AppTooltip
                        placement={'bottom'}
                        title={historyData[step]?.file}
                      >
                        <AttachmentIcon
                          sx={{
                            color: historyData[step]?.file
                              ? '#00dcff'
                              : '#e6e6e6',
                          }}
                        />
                      </AppTooltip>
                    </Grid>
                  </Grid>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      </div>
    </>
  );
};

export default VendorInvoiceList;
