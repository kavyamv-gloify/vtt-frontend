import SmartTable from '@smart-table';
import React, {useEffect, useState} from 'react';
import Api from '@api';
import axios from 'axios';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import CancelIcon from '@mui/icons-material/Cancel';
import Confirm from '@confirmation-box';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {toast} from 'react-toastify';
import SmartForm from '@smart-form';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CustomLabel from 'pages/common/CustomLabel';
import Grid from '@mui/material/Grid';
import moment from 'moment';
const List = () => {
  const [data, setData] = useState();
  const [openConfirmbox, setOpenConfirmBox] = useState(false);
  const [info, setInfo] = useState();
  const [status, setStatus] = useState();
  const [openDialog, setOpenDialog] = useState(false);
  const {user} = useAuthUser();

  useEffect(() => {
    getAll();
  }, []);
  function getAll() {
    axios
      .get(
        Api.baseUri +
          '/user-reg/adhoc-trip/get-adhoc-request-by-managerid/' +
          user?.userList?.profileId,
      )
      .then((res) => {
        let temp = [];
        res?.data?.data?.map((el) => {
          if (el?.status == 'CANCELLED') {
            return;
          }
          let date = moment(el?.date).format('DD-MM-YYYY');
          el.date = date;
          el.tripType == 'UPTRIP'
            ? (el.tripType = 'LOGIN')
            : (el.tripType = 'LOGOUT');
          temp.push(el);
        });

        setData(temp);
      })
      .catch((err) => {
        setData([]);
      });
  }
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
              required: 'This is a mandatory field',
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
      {
        title: 'Employee Code',
        field: 'empCode',
      },
      {
        title: 'Employee Email',
        field: 'emailId',
      },
      {
        title: 'Date',
        field: 'date',
        render: (rd) => {
          return moment(rd.date).format('DD-MM-YYYY');
        },
      },
      {
        title: 'Trip Type',
        field: 'tripType',
      },
      {
        title: 'Status',
        field: 'status',
        render: (rowData) =>
          rowData.status == 'APPROVED' ? (
            <span style={{color: 'green'}}>APPROVED</span>
          ) : rowData.status == 'PENDING' ? (
            <span style={{color: 'orange'}}>PENDING</span>
          ) : (
            <span style={{color: 'red'}}>{rowData?.status?.toUpperCase()}</span>
          ),
      },
      {
        title: 'Time',
        field: 'time',
      },
      {
        title: 'Created by',
        field: 'createdOn',
        render: (rd) => {
          return (
            rd.createdBy +
            '  ' +
            moment(rd.createdOn).format('DD/MM/YYYY HH:MM')
          );
        },
      },
      {
        title: 'Last Updated ',
        field: 'updatedOn',
        type: 'datetime',
      },
    ],
  };

  function handleClickApprove(rowData) {
    setInfo(rowData);
    setStatus('approve');
    setOpenDialog(true);
  }
  function handleClickReject(rowData) {
    setInfo(rowData);
    setStatus('reject');
    setOpenDialog(true);
  }
  function handleDialog(value) {
    let postData = info;
    status == 'approve'
      ? (postData.status = 'APPROVE')
      : (postData.status = 'REJECT');
    postData.managerRemark = value?.data?.remarks;

    axios
      .put(
        Api.baseUri +
          (status == 'approve'
            ? '/user-reg/adhoc-trip/approve-adhoc-request'
            : '/user-reg/adhoc-trip/reject-adhoc-request'),
        postData,
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          status == 'approve'
            ? toast.success('Approved Successfully')
            : toast.success('Rejected Successfully');
          getAll();
          setOpenDialog(false);
          getAll();
        } else {
          toast.error('Something went wrong');
          setOpenDialog(false);
        }
      })
      .catch((err) => {
        toast.error('Something went wrong');
        setOpenDialog(false);
      });
  }
  return (
    <>
      <Grid item xs={3} sx={{marginBottom: '10px'}}>
        <CustomLabel labelVal='Adhoc Trip ' variantVal='h3-underline' />
      </Grid>
      <SmartTable
        components={{
          Toolbar: (props) => (
            <>
              <div
                style={{
                  height: '0px',
                  // marginTop:"10px"
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
          (data) => ({
            icon: () => (
              <AssignmentTurnedInIcon
                color='primary'
                style={{
                  opacity:
                    data?.status == 'APPROVED' ||
                    data?.status == 'REJECTED' ||
                    data?.status?.toUpperCase() == 'EXPIRED' ||
                    data?.status == 'CANCELLED'
                      ? '0.3'
                      : '',
                }}
              />
            ),
            tooltip: 'Approve',
            onClick: (event, rowData) => {
              if (
                rowData?.status?.toUpperCase() == 'EXPIRED' ||
                rowData?.status == 'APPROVED' ||
                rowData?.status == 'REJECTED' ||
                rowData?.status == 'CANCELLED'
              ) {
                return;
              }
              handleClickApprove(rowData);
            },
          }),

          (data) => ({
            icon: () => (
              <CancelIcon
                color='primary'
                style={{
                  color: '#bc0805',
                  opacity:
                    data?.status == 'APPROVED' ||
                    data?.status == 'REJECTED' ||
                    data?.status?.toUpperCase() == 'EXPIRED' ||
                    data?.status == 'CANCELLED'
                      ? '0.3'
                      : '',
                }}
              />
            ),
            tooltip: 'Reject',
            onClick: (event, rowData) => {
              if (
                rowData?.status?.toUpperCase() == 'EXPIRED' ||
                rowData?.status == 'APPROVED' ||
                rowData?.status == 'REJECTED' ||
                rowData?.status == 'CANCELLED'
              ) {
                return;
              }
              handleClickReject(rowData);
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
      >
        <DialogContent style={{width: '500px'}}>
          {status == 'approve' ? (
            <p>Are you sure, you want to Approve?</p>
          ) : (
            <p>Are you sure, you want to Reject? </p>
          )}
          <SmartForm
            template={Dilaogtemplate}
            onCancel={() => {
              setOpenDialog(false);
              getAll();
            }}
            buttons={['Yes', 'cancel']}
            onSubmit={handleDialog}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default List;
