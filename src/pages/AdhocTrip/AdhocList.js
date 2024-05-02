import SmartTable from '@smart-table';
import React, {useEffect, useState} from 'react';
import Api from '@api';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import Confirm from '@confirmation-box';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {toast} from 'react-toastify';
import SmartForm from '@smart-form';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CustomLabel from 'pages/common/CustomLabel';
import Grid from '@mui/material/Grid';
import AppTooltip from '@crema/core/AppTooltip';
import {Box, DialogTitle} from '@mui/material';
import AdhocTripForm from './AdhocTripForm';
import CloseIcon from '@mui/icons-material/Close';
import EditAdhocTripForm from './AdhocEditForm';
import DeleteIcon from '@mui/icons-material/Delete';
import {setAdhocCount} from 'redux/actions';
import {useSelector, useDispatch} from 'react-redux';
import WrongLocationIcon from '@mui/icons-material/WrongLocation';
import moment from 'moment';
import _ from 'lodash';
import {useNavigate} from 'react-router-dom';

const AdhocList = () => {
  const [data, setData] = useState();
  const [id, setId] = useState();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [flag, setFlag] = useState();
  const [openConfirmbox, setOpenConfirmBox] = useState(false);
  const {user} = useAuthUser();
  const [myActions, setMyActions] = useState([]);

  const permissionCheck = useSelector(({settings}) => settings.permissions);
  useEffect(() => {
    if (!permissionCheck) return;
    let sub_mod = {};
    permissionCheck?.map((el) => {
      if (el.subModuleName == 'Adhoc TripEmployee') sub_mod = el;
    });
    setMyActions(sub_mod?.actions);
    if (
      (!sub_mod || !sub_mod?.actions?.includes('View')) &&
      user?.userList?.userRole !== 'SUPERADMIN'
    )
      navigate('/error-pages/error-404');
  }, [permissionCheck, user]);
  useEffect(() => {
    getAll();
  }, []);
  const dispatch = useDispatch();
  function getAll() {
    axios
      .get(Api.baseUri + '/user-reg/adhoc-trip/get-adhoc-request-by-empid')
      .then((res) => {
        let temp = [];
        res?.data?.data?.map((el) => {
          let date = moment(el?.date).format('DD-MM-YYYY');
          el.date = date;
          el.tripType == 'UPTRIP'
            ? (el.tripType = 'LOGIN')
            : (el.tripType = 'LOGOUT');
          el?.createdBy == user?.userList?.userName
            ? (el.createdBy = 'SELF')
            : (el.createdBy = 'CORPORATE');
          temp.push(el);
        });
        setData(temp);
      })
      .catch((err) => {
        setData([]);
      });
  }

  async function result() {
    let res = await axios.get(
      Api.baseUri + '/user-reg/adhoc-trip/get-adhoc-request-by-empid',
    );
    if (res?.data?.status == '200') {
      let pendingList = _.groupBy(res?.data?.data, 'status');
      dispatch(setAdhocCount(pendingList?.PENDING?.length || 0));
      // dispatch(setAdhocCount(res?.data?.data?.length));
    }
  }

  useEffect(() => {
    result();
  }, []);
  let Dilaogtemplate = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    // title: 'Job Application Form',
    description: 'Form for applying Job',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'medium', label: 'fixed'},
        id: 'personal_information1',
        fields: [
          {
            type: 'textarea',
            name: 'remarks',
            id: 'remarks',
            title: 'Remark',
            validationProps: {
              // required: 'This is a mandatory field',
              maxLength: {
                value: 800,
                message: 'Maximum 800 characters are allowed.',
              },
            },
          },
        ],
      },
    ],
  };
  const tableTemplate = {
    columns: [
      // {
      //     title: 'Employee Code',
      //     field: "empCode"
      // },
      // {
      //     title: 'Employee Email',
      //     field: "emailId"
      // },

      {
        title: 'Date',
        field: 'date',
      },
      {
        title: 'Time',
        field: 'time',
      },
      {
        title: 'Trip Type',
        field: 'tripType',
      },

      {
        title: 'Status',
        field: 'status',
      },
      {
        title: 'Created by',
        field: 'createdOn',
        render: (rd) => {
          return rd.createdBy;
          //  +
          // '  ' +
          // moment(rd.createdOn).format('DD/MM/YYYY HH:MM')
        },
      },
      {
        title: 'Created on',
        field: 'createdOn',
        render: (rd) => {
          return moment.utc(rd.createdOn).local().format('DD/MM/YYYY HH:mm');
        },
      },
      {
        title: 'Last Updated',
        field: 'updatedOn',
        type: 'datetime',
        render: (rd) =>
          moment.utc(rd.updatedOn).local().format('DD/MM/YYYY HH:mm'),
      },
    ],
  };

  function handleEdit(rowData) {
    setFlag('edit');
    setOpenDialog(true);
    setId(rowData?.id);
  }

  function handleDelete(rowData) {
    setOpenConfirmBox(true);
    setId(rowData?.id);
  }

  function closeConfirmBox(d) {
    if (d == 'YES') {
      axios
        .get(Api.baseUri + '/user-reg/adhoc-trip/get-adhoc-request-by-id/' + id)
        .then((res) => {
          if (res?.data?.status == '200') {
            let postData = res?.data?.data;
            postData.status = 'CANCELLED';
            axios
              .put(
                Api.baseUri + '/user-reg/adhoc-trip/update-adhoc-request',
                postData,
              )
              .then((resp) => {
                if (resp?.data?.status == '200') {
                  toast.success('Trip Cancelled');
                  setOpenConfirmBox(false);
                  getAll();
                } else {
                  toast.error(resp?.data?.message || 'Something went wrong.');
                }
              });
          }
        })
        .catch((err) => {
          toast.error('Something went wrong.');
        });
    } else {
      setOpenConfirmBox(false);
    }
  }

  return (
    <>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={3}>
          <CustomLabel labelVal='Adhoc Trip ' variantVal='h3-underline' />
        </Grid>
        <Grid item xs={9} sx={{paddingTop: '0px !important'}}>
          {myActions?.includes('Create') && (
            <Box display='flex' justifyContent='flex-end' alignItems='center'>
              <div className='left-seperator'>
                <AppTooltip placement={'top'} title={'Add Adhoc Trip'}>
                  <TrendingUpIcon
                    onClick={() => {
                      setFlag('create');
                      setOpenDialog(true);
                    }}
                    sx={{ml: 2, mr: 4}}
                    className='pointer'
                  />
                </AppTooltip>
              </div>
            </Box>
          )}
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
        columns={tableTemplate.columns}
        data={data}
        options={{
          search: false,
          showTitle: false,
          selection: false,

          sorting: true,
          actionsColumnIndex: -1,
          headerStyle: {position: 'sticky', top: 0},
        }}
        actions={[
          (data) =>
            myActions?.includes('Edit') && {
              icon: () => (
                <EditIcon
                  color='primary'
                  style={{
                    opacity:
                      data?.status == 'APPROVED' ||
                      data?.status == 'REJECTED' ||
                      data?.status == 'CANCELLED' ||
                      data?.status == 'Expired'
                        ? '0.3'
                        : '',
                  }}
                />
              ),
              tooltip: 'Edit',
              onClick: (event, rowData) => {
                if (
                  rowData?.status?.toUpperCase() == 'EXPIRED' ||
                  rowData?.status == 'APPROVED' ||
                  rowData?.status == 'REJECTED' ||
                  rowData?.status == 'CANCELLED' ||
                  rowData?.status == 'Expired'
                ) {
                  return;
                }
                handleEdit(rowData);
              },
            },
          (data) => ({
            icon: () => (
              <WrongLocationIcon
                color='primary'
                style={{
                  color: '#bc0805',
                  opacity:
                    data?.status?.toUpperCase() == 'EXPIRED' ||
                    data?.status == 'APPROVED' ||
                    data?.status == 'REJECTED' ||
                    data?.status == 'CANCELLED'
                      ? '0.3'
                      : '',
                }}
              />
            ),
            tooltip: 'Cancel',
            onClick: (event, rowData) => {
              if (
                rowData?.status?.toUpperCase() == 'EXPIRED' ||
                rowData?.status == 'APPROVED' ||
                rowData?.status == 'REJECTED' ||
                rowData?.status == 'CANCELLED'
              ) {
                return;
              }
              handleDelete(rowData);
            },
          }),
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

      <Dialog
        open={openDialog}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '600px',
          },
        }}
      >
        <DialogTitle
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            background: '#f5f2f2',
            height: '4rem',
            paddingRight: '1.5rem',
            paddingLeft: '1.5rem',
            position: 'fixed',
            zIndex: '9',
            width: '600px',
            borderRadius: '5px 5px 0px 0px',
          }}
        >
          <h1>Adhoc Trip</h1>
          <CloseIcon
            onClick={() => {
              setOpenDialog(false);
            }}
            style={{color: '#4f4f4f', fontWeight: 'bold'}}
          />
        </DialogTitle>
        <DialogContent style={{marginTop: '50px'}}>
          <AdhocTripForm
            close={() => {
              setOpenDialog(false);
              getAll();
            }}
            flag={flag}
            id={id}
          />
        </DialogContent>
      </Dialog>

      <Confirm
        open={openConfirmbox}
        header={'Confirm to Cancel'}
        cnfMsg={'Are you sure, You want to Cancel it?'}
        handleClose={closeConfirmBox}
      />
    </>
  );
};

export default AdhocList;
