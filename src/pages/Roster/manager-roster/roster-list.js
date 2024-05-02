import React, {useState, useEffect} from 'react';
import SmartTable from '@smart-table';
import {useAuthUser} from '@crema/utility/AuthHooks';
import EditIcon from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
import _ from 'lodash';
import {useNavigate, useParams} from 'react-router-dom';
import Api from '@api';
import axios from 'axios';
import {toast} from 'react-toastify';
import {Button, InputLabel, TextField, Typography} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import CancelScheduleSendIcon from '@mui/icons-material/CancelScheduleSend';
import IntlMessages from '@crema/utility/IntlMessages';
import moment from 'moment';

const EmployeeSelfRoaster = ({id, handleFun}) => {
  const {user} = useAuthUser();
  const [selectedItems, setselectedItems] = useState([]);
  const [rem, setRem] = useState('');
  const navigate = useNavigate();
  // const {id} = useParams();
  const [data, setData] = useState();
  const tableRef = React.useRef();
  const [open, setOpen] = React.useState(false);
  const [thisObj, setThisObj] = useState({});
  const [selectEnable, setSelectEnable] = useState(true);
  const fetchData = () => {
    axios
      .get(Api?.baseUri + '/user-reg/roaster/get-team-roaster-req')
      .then((res) => {
        let tem = [];
        res?.data?.data?.map((re, ind) => {
          let temDates = [];
          re?.dates?.map((ee) => {
            temDates.push(moment(ee?.date).format('DD MMM'));
          });
          if (id == 'ALL' || window.atob(id) == re?.id) {
            tem.push({
              rosterdate: re?.fromDate
                ? moment(re?.fromDate).format('DD MMM') +
                  ' - ' +
                  moment(re?.toDate).format('DD MMM')
                : temDates?.join(', '),
              departmentName: re?.departmentName,
              employeeName: re?.employeeName,
              employeeCode: re?.employeeCode,
              loginTime: re?.loginTime || '--',
              logoutTime: re?.logoutTime || '--',
              status: re?.status,
              id: re?.id,
              entObj: re,
            });
          }
        });
        if (window.atob(id) == res?.data?.data[0]?.id) {
          setselectedItems(tem);
          setSelectEnable(false);
        } else {
          setSelectEnable(true);
        }
        setData(tem);
      })
      .catch((err) => {});
  };
  useEffect(() => {
    fetchData();
  }, []);

  const tableTemplate = {
    columns: [
      {
        title: 'Roster Date',
        field: 'rosterdate',
        type: 'date',
      },
      // {
      //     title: 'Department Name',
      //     field: "departmentName"
      // },
      {
        title: 'Employee Name',
        field: 'employeeName',
      },
      {
        title: 'Employee Code',
        field: 'employeeCode',
      },
      {
        title: 'Login Time',
        field: 'loginTime',
      },
      {
        title: 'Logout Time',
        field: 'logoutTime',
      },
      {
        title: 'Status',
        field: 'status',
      },
    ],
  };

  function handleClickSubmit(btn) {
    let ids = [];
    selectedItems?.map((e) => {
      ids.push(e?.id);
    });
    let postData = {
      status: btn,
      reqIds: ids, // don't get confused by this key it is utilised for id
      empRemarks: '',
      manegerRemarks: rem,
    };
    axios
      .post(Api?.baseUri + '/user-reg/roaster/update-roaster-all-req', postData)
      .then((res) => {
        fetchData();
        if (res?.data?.status == '200') {
          toast.success(
            'Roster request is sucessfully ' +
              (btn == 'APPROVED' ? 'approved' : 'rejected'),
          );
          handleFun();
        } else {
          toast.error(res?.data?.message ?? 'Something went wrong');
        }
      })
      .catch((err) => {
        toast.error('Something went wrong');
      });
    return;
  }

  return (
    <>
      <div
        style={{
          textAlign: 'right',
          paddingRight: '10px',
          paddingBottom: '10px',
        }}
      >
        <Button
          id='btnMui123'
          // variant='contained'
          disabled={!selectedItems?.length}
          sx={{
            mr: 2,
            color: 'white',
            backgroundColor: !selectedItems?.length
              ? 'rgb(215,219,221)'
              : 'rgb(10,143,220)',
            '&:hover': {
              backgroundColor: !selectedItems?.length
                ? 'rgb(215,219,221)'
                : 'rgb(10,143,220)',
            },
          }}
          onClick={(e) => {
            setThisObj({buttonName: 'APPROVED'});
            setOpen(true);
          }}
        >
          Approve
        </Button>

        <Button
          id='btnMui123'
          disabled={!selectedItems?.length}
          sx={{
            mr: 2,
            backgroundColor: !selectedItems?.length
              ? 'rgb(215,219,221)'
              : 'rgb(10,143,220)',
            '&:hover': {
              backgroundColor: !selectedItems?.length
                ? 'rgb(215,219,221)'
                : 'rgb(10,143,220)',
            },
            color: 'white',
          }}
          onClick={(e) => {
            setThisObj({buttonName: 'REJECTED'});
            setOpen(true);
          }}
        >
          Reject
        </Button>
      </div>
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
        title='Nodal Point List'
        columns={tableTemplate.columns}
        tableRef={tableRef}
        data={data ?? []}
        options={{
          search: false,
          selection: selectEnable ? true : false,
          selectionProps: (rowData) => ({
            disabled: rowData.status !== 'PENDING',
            color: 'primary',
          }),
          showTitle: false,
          actionsColumnIndex: -1,
          headerStyle: {position: 'sticky', top: 0},
        }}
        onSelectionChange={(rows) => {
          setselectedItems(rows);
        }}
        // actions={[rowData => (
        //     {
        //         icon: () => (<HowToRegIcon color="primary" style={{ opacity: rowData?.status == "APPROVED" || rowData?.status == "REJECTED" ? "0.3" : '' }} />),
        //         tooltip: 'Approve',
        //         onClick: (event, rowData) => {
        //             if (rowData?.status != "APPROVED" && rowData?.status != "REJECTED") { setOpen(true); setThisObj({ rowData: rowData, buttonName: "APPROVED" }); }
        //         }
        //     }),
        // rowData => ({
        //     icon: () => (<CancelScheduleSendIcon color="primary" style={{ opacity: rowData?.status == "APPROVED" || rowData?.status == "REJECTED" ? "0.3" : '' }} />),
        //     tooltip: 'Reject',
        //     onClick: (event, rowData) => {
        //         if (rowData?.status != "APPROVED" && rowData?.status != "REJECTED") { setOpen(true); setThisObj({ rowData: rowData, buttonName: "REJECTED" }); }
        //     }
        // })
        // ]}
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
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle style={{padding: '20px 55px 13px 15px'}}>
          {' '}
          <Typography
            component='h4'
            variant='h4'
            sx={{mb: 3}}
            id='alert-dialog-title'
          >
            Are you sure you want to{' '}
            {thisObj?.buttonName == 'APPROVED' ? 'approve' : 'reject'} roster ?
          </Typography>
        </DialogTitle>
        <DialogContent
          sx={{color: 'text.secondary', fontSize: 14}}
          id='alert-dialog-description'
        >
          <InputLabel id={'name'}>Remarks</InputLabel>
          <TextField
            fullWidth
            value={rem}
            onInput={(e) => {
              setRem(e?.target?.value);
            }}
          />
        </DialogContent>
        <DialogActions sx={{pb: 5, px: 6}}>
          <Button
            id='btnMui123'
            variant='outlined'
            onClick={() => {
              setOpen(false);
              handleClickSubmit(thisObj?.buttonName);
            }}
            color='primary'
            autoFocus
          >
            <IntlMessages id='common.yes' />
          </Button>
          <Button
            id='btnMui123'
            variant='outlined'
            onClick={() => {
              setOpen(false);
            }}
            color='secondary'
          >
            <IntlMessages id='common.no' />
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default EmployeeSelfRoaster;
