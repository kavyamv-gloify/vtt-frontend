import {
  Autocomplete,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from '@mui/material';
import downDoc from '@common/fileDownload';
import SmartForm from '@smart-form';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AttachmentIcon from '@mui/icons-material/Attachment';
import SendIcon from '@mui/icons-material/Send';
import AddTaskIcon from '@mui/icons-material/AddTask';
import DescriptionIcon from '@mui/icons-material/Description';
import React, {useEffect, useState} from 'react';
import AppTooltip from '@crema/core/AppTooltip';
import AppLoader from '@crema/core/AppLoader';
import PublishIcon from '@mui/icons-material/Publish';
import CustomLabel from 'pages/common/CustomLabel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import SmartTable from '@smart-table';
import CloseIcon from '@mui/icons-material/Close';
import {useNavigate, useParams} from 'react-router-dom';
import moment from 'moment';
import Confirm from '@confirmation-box';
import axios from 'axios';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import Api from '@api';
import {useAuthUser} from '@crema/utility/AuthHooks';
import CancelScheduleSendIcon from '@mui/icons-material/CancelScheduleSend';
import {toast} from 'react-toastify';
import {getFormData} from '@hoc';

const VendorInvoiceList = () => {
  const navigate = useNavigate();
  const {type, fromDate, toDate} = useParams();
  const [data, setData] = useState();
  const [dateFilter, setDateFilter] = useState(type);
  const [dates, setDates] = useState({fromDate: fromDate, toDate: toDate});
  const {user} = useAuthUser();
  const [openCancel, setOpenCancel] = useState(null);
  const [dialFor, setDialFor] = useState(null);
  const [finalDates, setFinalDates] = useState();

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
            type: 'text',
            name: 'rem',
            field: 'rem',
            title: 'Reason/Remarks',
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
        ],
      },
    ],
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
            type: 'text',
            name: 'rem',
            field: 'rem',
            title:
              (dialFor == 'CLOSED' ? 'Transaction' : 'e-Invoice') + ' Details',
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'file',
            name: 'file',
            field: 'file',
            accept: 'image/*',
            title: 'Upload document',
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
        ],
      },
    ],
  };
  const filterTypeList = [
    {title: 'Today', value: 'Today'},
    {title: 'Weekly', value: 'Weekly'},
    {title: 'Monthly', value: 'Monthly'},
    {title: 'Custom', value: 'Custom'},
  ];

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

  const defaultProps = {
    options: filterTypeList,
    getOptionLabel: (option) => option.title,
  };

  const tableTemplate = {
    columns: [
      {
        title: 'Vendor Name',
        field: 'vendorName',
      },
      {
        title: 'Invoice ID',
        field: 'invoiceId',
      },
      {
        title: 'Date Period',
        field: 'datePeriod',
        render: (rowData) =>
          moment(rowData?.fromDate).format('DD/MM/YYYY') +
          ' - ' +
          moment(rowData?.toDate).format('DD/MM/YYYY'),
      },
      {
        title: 'Invoice Date',
        field: 'invoiceDate',
        type: 'date',
      },
      {
        title: 'Due Date',
        field: 'dueDate',
        type: 'date',
      },
      {
        title: 'Total Regular Trip Cost',
        field: 'totalRegTripCost',
      },
      {
        title: 'Total Adhoc Trip Cost',
        field: 'totalAdhocTripCost',
      },
      {
        title: 'Status',
        field: 'status',
        render: (rowData) => (
          <div
            style={{
              border: '1px solid #ffecdc',
              textAlign: 'center',
              width: '85px',
              marginLeft: '-5px',
              padding: '1px',
              color:
                rowData?.status == 'DECLINED'
                  ? '#ff6e6e'
                  : rowData?.status == 'CANCELLED'
                  ? '#ff6e6e'
                  : rowData?.status == 'APPROVED'
                  ? '#32c972'
                  : rowData?.status == 'CLOSED'
                  ? '#32c972'
                  : rowData?.status == 'SUBMITTED'
                  ? '#32c972'
                  : '#ff9a4a',
              borderRadius: '15px',
              background:
                rowData?.status == 'DECLINED'
                  ? '#ffcbcc'
                  : rowData?.status == 'CANCELLED'
                  ? '#ffcbcc'
                  : rowData?.status == 'APPROVED'
                  ? '#d7f5e4'
                  : rowData?.status == 'CLOSED'
                  ? '#d7f5e4'
                  : rowData?.status == 'SUBMITTED'
                  ? '#d7f5e4'
                  : '#feecdc',
            }}
          >
            {rowData?.status == 'PENDING'
              ? 'Generated'
              : rowData?.status == 'APPROVED'
              ? 'Approved'
              : rowData?.status == 'SENT'
              ? 'Sent'
              : rowData?.status == 'DECLINED'
              ? 'Declined'
              : rowData?.status == 'CANCELLED'
              ? 'Cancelled'
              : rowData?.status == 'SUBMITTED'
              ? 'Submitted'
              : rowData?.status == 'CLOSED'
              ? 'Paid'
              : rowData?.status}
          </div>
        ),
      },
    ],
  };

  function handleClickView(rd) {
    navigate(
      `/invoice-listing-vendor-view/${window.btoa(rd.id)}/${window.btoa(
        rd.fromDate,
      )}/${window.btoa(rd.toDate)}`,
    );
  }

  useEffect(() => {
    if (!finalDates?.fromDate || !finalDates?.toDate || openCancel) return;
    getAllData();
  }, [finalDates, openCancel]);

  function getAllData() {
    axios
      .get(
        Api.baseUri +
          (user?.userList?.userRole == 'VENDOR'
            ? '/user-reg/invoice/getAllInvoiceByVendorId/'
            : '/user-reg/invoice/getAllInvoiceByCoporateId/') +
          (user?.userList?.userRole == 'VENDOR'
            ? user?.userList?.profileId
            : user?.userList?.corporateId) +
          '/' +
          finalDates?.fromDate +
          '/' +
          finalDates?.toDate,
      )
      .then((res) => {
        let arr = [];
        res?.data?.data?.map((el) => {
          if (user?.userList?.userRole != 'VENDOR' && el.status != 'PENDING') {
            arr.push(el);
          }
          if (user?.userList?.userRole == 'VENDOR') {
            arr.push(el);
          }
        });
        setData(arr);
      })
      .catch((er) => {});
  }
  async function closeConfirmBox(d, rem, file) {
    if (d == 'YES') {
      let fileUrl22 = '';
      if (dialFor == 'CLOSED' || dialFor == 'SUBMITTED') {
        let tem = {
          photo: file,
        };
        let dataSet;
        Object.keys(tem).map((key) => {
          dataSet = {
            ...dataSet,
            [key]: tem[key][0],
          };
        });
        let temp = await axios({
          method: 'post',
          url: Api.baseUri + '/user-reg/compliance/save-file',
          data: getFormData(dataSet),
          headers: {'Content-Type': 'multipart/form-data'},
        });
        fileUrl22 = temp?.data?.data?.documentName;
      }
      let postData = {};
      postData.id = openCancel?.id;
      postData.status = dialFor;
      postData.remarks = rem;
      if (fileUrl22) postData.file = fileUrl22;
      axios
        .post(
          Api.baseUri + '/user-reg/invoice/updateInvoiceForstatus',
          postData,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success(`Invoice ${dialFor?.toLowerCase()} successfully.`);
          } else {
            toast.error(res?.data?.message || 'Something went wrong.');
          }
          getAllData();
          setOpenCancel(null);
          setDialFor(null);
        })
        .catch((err) => {
          setDialFor(null);
          setOpenCancel(null);
          toast.error('Something went wrong.');
        });
    } else {
      setDialFor(null);
      setOpenCancel(null);
    }
  }
  return (
    <div>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item sm={12} md={2}>
          <CustomLabel labelVal='Invoices' variantVal='h3-underline' />
        </Grid>
        <Grid item sm={12} md={10}>
          <Box display='flex' justifyContent='flex-end'>
            <div className=''>
              <Box display='flex' justifyContent='flex-end' alignItems='center'>
                <div
                  className='left-seperator'
                  style={{display: 'flex', justifyContent: 'space-between'}}
                >
                  {dateFilter && (
                    <Autocomplete
                      {...defaultProps}
                      defaultValue={
                        dateFilter == 'Today'
                          ? filterTypeList[0]
                          : dateFilter == 'Weekly'
                          ? filterTypeList[1]
                          : dateFilter == 'Monthly'
                          ? filterTypeList[2]
                          : filterTypeList[3]
                      }
                      options={filterTypeList}
                      onChange={(e, v) => {
                        setDateFilter(v?.value);
                      }}
                      sx={{width: '200px'}}
                      disableClearable
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
                  )}
                  {dateFilter == 'Custom' && (
                    <div
                      style={{
                        display: 'flex',
                        marginLeft: '20px',
                        justifyContent: 'space-between',
                      }}
                    >
                      <TextField
                        type='date'
                        value={dates?.fromDate}
                        sx={{mr: 2}}
                        onChange={(e, v) => {
                          setDates({...dates, fromDate: e?.target?.value});
                        }}
                        id='outlined-error-helper-text'
                        size='small'
                        fullWidth
                      />
                      <TextField
                        type='date'
                        value={dates?.toDate}
                        onChange={(e, v) => {
                          setDates({...dates, toDate: e?.target?.value});
                        }}
                        id='outlined-error-helper-text'
                        size='small'
                        fullWidth
                      />
                    </div>
                  )}
                </div>
              </Box>
            </div>
          </Box>
        </Grid>
      </Grid>

      <SmartTable
        components={{
          Toolbar: (props) => (
            <>
              <div
                style={{
                  height: '0px',
                }}
              ></div>
            </>
          ),
        }}
        title='Bank Detail'
        columns={tableTemplate.columns}
        data={data}
        options={{
          search: false,
          showTitle: false,
          actionsColumnIndex: -1,
          headerStyle: {position: 'sticky', top: 0},
        }}
        actions={[
          {
            icon: () => <VisibilityIcon color='primary' />,
            tooltip: 'View',
            onClick: (event, rowData) => handleClickView(rowData),
          },
          (rd) => ({
            icon: () => (
              <CancelScheduleSendIcon
                sx={{
                  opacity:
                    rd.status !== 'PENDING' && rd.status !== 'SENT'
                      ? '0.3'
                      : '',
                  color: '#bc0805',
                }}
              />
            ),
            tooltip:
              user?.userList?.userRole == 'VENDOR' ? 'Cancel' : 'Decline',
            onClick: (event, rowData) => {
              if (
                rd.status !== 'PENDING' &&
                rd.status !== 'SENT' &&
                rd.status !== 'APPROVED'
              )
                return;
              setOpenCancel(rowData);
              setDialFor(
                user?.userList?.userRole == 'VENDOR' ? 'CANCELLED' : 'DECLINED',
              );
            },
          }),
          (rd) =>
            user?.userList?.userRole !== 'VENDOR' && {
              icon: () => (
                <AddTaskIcon
                  color='primary'
                  sx={{
                    opacity: rd.status !== 'SENT' ? '0.3' : '',
                  }}
                />
              ),
              tooltip: 'Approve',
              onClick: (event, rowData) => {
                if (rowData.status !== 'SENT') return;
                setOpenCancel(rowData);
                setDialFor('APPROVED');
              },
            },
          (rd) =>
            user?.userList?.userRole == 'VENDOR' && {
              icon: () => (
                <SendIcon
                  color='primary'
                  sx={{
                    opacity: rd.status !== 'PENDING' ? '0.3' : '',
                  }}
                />
              ),
              tooltip: 'Send',
              onClick: (event, rowData) => {
                if (rowData.status !== 'PENDING') return;
                setOpenCancel(rowData);
                setDialFor('SENT');
              },
            },
          (rd) =>
            user?.userList?.userRole == 'VENDOR' && {
              icon: () => (
                <PublishIcon
                  color='primary'
                  sx={{
                    opacity: rd.status !== 'APPROVED' ? '0.3' : '',
                  }}
                />
              ),
              tooltip: 'Submit eInvoice',
              onClick: (event, rowData) => {
                if (rowData.status !== 'APPROVED') return;
                setOpenCancel(rowData);
                setDialFor('SUBMITTED');
              },
            },
          (rd) => ({
            icon: () => (
              <AttachmentIcon
                color='primary'
                sx={{
                  opacity: rd.eInvSubmittedFile ? '' : '0.3',
                }}
              />
            ),
            tooltip: 'e-Invoice',
            onClick: (event, rowData) => {
              if (!rowData.eInvSubmittedFile) return;
              downDoc.openDoc(rowData.eInvSubmittedFile);
            },
          }),
          (rd) => ({
            icon: () => (
              <TaskAltIcon
                color='primary'
                sx={{
                  opacity:
                    rd.status !== 'PENDING' &&
                    rd.status !== 'SENT' &&
                    rd.status !== 'APPROVED' &&
                    rd.status !== 'SUBMITTED'
                      ? '0.3'
                      : '',
                }}
              />
            ),
            tooltip:
              user?.userList?.userRole == 'VENDOR'
                ? 'Close'
                : 'Update Payment Details',
            onClick: (event, rowData) => {
              if (
                rd.status !== 'PENDING' &&
                rd.status !== 'SENT' &&
                rd.status !== 'APPROVED' &&
                rd.status !== 'SUBMITTED'
              )
                return;
              setOpenCancel(rowData);
              setDialFor('CLOSED');
            },
          }),
          {
            icon: () => <DescriptionIcon color='primary' />,
            tooltip: 'Go to billing',
            onClick: (event, rdata) => {
              localStorage.setItem('billingFilter', JSON.stringify(rdata));
              navigate(
                user?.userList?.userRole == 'VENDOR'
                  ? '/vendor-billings'
                  : '/billings',
              );
            },
          },
        ]}
        localization={{
          body: {
            emptyDataSourceMessage: 'No records to display',
            filterRow: {
              filterTooltip: 'Filter',
              filterPlaceHolder: 'Filtaaer',
            },
          },
        }}
        style={{
          borderRadius: 16,
          boxShadow: '0px 10px 10px 4px rgb(0 0 0 / 4%)',
        }}
      />
      {dialFor == 'SENT' && (
        <Confirm
          open={true}
          header={'Confirm to Send'}
          cnfMsg={'Are you sure, You want to send it?'}
          handleClose={closeConfirmBox}
        />
      )}
      {dialFor && dialFor != 'SENT' && (
        <>
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
              <h1>{openCancel?.invoiceId}</h1>
              <CloseIcon
                onClick={() => {
                  setDialFor(null);
                  setOpenCancel(null);
                }}
                style={{color: '#4f4f4f', fontWeight: 'bold'}}
              />
            </DialogTitle>
            <DialogContent style={{padding: '0px 20px 20px 20px'}}>
              <SmartForm
                template={
                  dialFor == 'CLOSED' || dialFor == 'SUBMITTED'
                    ? template
                    : template2
                }
                onSubmit={(val) => {
                  closeConfirmBox('YES', val?.data?.rem, val?.data?.file);
                  setDialFor(null);
                  setOpenCancel(null);
                }}
                buttons={['submit']}
                mode='onTouched'
              />
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default VendorInvoiceList;
