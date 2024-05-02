import React, {useEffect, useState} from 'react';
import SmartTable from '@smart-table';
import axios from 'axios';
import _ from 'lodash';
import {Box, Button, DialogTitle, Grid} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import CustomLabel from 'pages/common/CustomLabel';
import Confirm from '@confirmation-box';
import Api from '@api';
import CancelScheduleSendIcon from '@mui/icons-material/CancelScheduleSend';
import regex from '@regex';
import SmartForm from '@smart-form';
import {toast} from 'react-toastify';
import {useAuthUser} from '@crema/utility/AuthHooks';
import AppTooltip from '@crema/core/AppTooltip';
import AppLoader from '@crema/core/AppLoader';
import moment from 'moment';
import EditIcon from '@mui/icons-material/Edit';
import {setLeaveCount} from 'redux/actions';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';

const LeaveList = () => {
  const {user} = useAuthUser();
  const navigate = useNavigate();
  const [openform, setOpenForm] = useState(false);
  const [data, setData] = useState([]);
  const [openConfirmbox, setOpenConfirmBox] = useState(false);
  const [leaveList, setLeaveList] = useState([]);
  const [countOfDays, setCountOfDays] = useState(0);
  const [showbtn, setShowbtn] = useState(true);
  const [empData, setEmpData] = useState();
  const [leaveSetting, setLeaveSetting] = useState();
  const [openEdit, setOpenEdit] = useState(false);
  const [id, setId] = useState();
  const [leaveData, setLeaveData] = useState();
  const [myActions, setMyActions] = useState([]);

  const permissionCheck = useSelector(({settings}) => settings.permissions);
  useEffect(() => {
    if (!permissionCheck) return;
    let sub_mod = {};
    permissionCheck?.map((el) => {
      if (el.subModuleName == 'Manage Leaves') sub_mod = el;
    });
    setMyActions(sub_mod?.actions);
    if (
      (!sub_mod || !sub_mod?.actions?.includes('View')) &&
      user?.userList?.userRole !== 'SUPERADMIN'
    )
      navigate('/error-pages/error-404');
  }, [permissionCheck, user]);

  useEffect(() => {
    if (!leaveData) {
      return;
    }
    if (leaveData) {
      setCountOfDays(leaveData?.count);
    }
  }, [leaveData]);

  useEffect(() => {
    getsettingById();
  }, [user?.userList?.profileId]);
  const dispatch = useDispatch();

  const getsettingById = () => {
    const baseURL = `${Api.employee.list}/${user.userList.profileId}`;
    axios
      .get(`${baseURL}`)
      .then((response) => {
        axios
          .get(
            `${
              Api?.leave?.getLeaveSettingByDeptId +
              response?.data?.data?.departmentId
            }`,
          )
          .then((res) => {
            setLeaveSetting(res?.data?.data[0]);
          })
          .catch((er) => {
            setLeaveSetting({});
          });
      })
      .catch((err) => {
        setLeaveSetting({});
      });
  };
  useEffect(() => {
    const baseURL = `${Api.employee.list}/${user.userList.profileId}`;
    axios
      .get(`${baseURL}`)
      .then((response) => {
        setEmpData(response?.data?.data);
      })
      .catch((err) => {});
    getAllLeave();
  }, []);
  function handleSubmit(val) {
    setShowbtn(false);
    if (val?.button?.toUpperCase() == 'APPLY') {
      let postData = {
        empId: empData?.id,
        empCode: empData?.employeeCode,
        fromDate: val?.data?.fromDate,
        toDate: val?.data?.toDate,
        count: val?.data?.count,
        empRemarks: val?.data?.empRemarks,
        managerId: empData?.managerId || empData?.id,
        status:
          leaveSetting?.corporateApprovalReq == 'NO' &&
          leaveSetting?.managerApprovalReq == 'NO'
            ? 'APPROVED'
            : 'PENDING',
        departmentId: empData?.departmentId,
      };
      axios
        .post(Api?.leave?.save, postData)
        .then((res) => {
          setShowbtn(true);
          if (res?.data?.status == '200') {
            toast.success('Leave applied successfully.');
            getAllLeave();
            handleClose();
          } else {
            setShowbtn(true);
            toast.error(res?.data?.message);
          }
        })
        .catch((err) => {
          setShowbtn(true);
          toast.err('Something went wrong.');
        });
    }
  }
  let template = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    title: '',
    description: 'Add Shift',
    sections: [
      {
        layout: {column: 2, spacing: 2, size: 'small', label: 'fixed'},
        id: 'add_shift',
        fields: [
          {
            type: 'date',
            name: 'fromDate',
            id: 'fromDate',
            title: 'From Date',
            disabled:
              openEdit &&
              moment(leaveData?.fromDate + ' 03:00:00').isBefore(
                moment(new Date()).format('YYYY-MM-DD') + ' 03:00:00',
              )
                ? true
                : false,
            // min: 'today',
            minmax: 'custom',
            minCustomDate: new Date().setDate(
              new Date().getDate() +
                (leaveSetting?.applyCutoffDays
                  ? Number(leaveSetting?.applyCutoffDays)
                  : 1),
            ),
            maxCustomDate: new Date().setDate(new Date().getDate() + 90),
            validationProps: openEdit
              ? {}
              : {
                  required: 'This is a mandatory field',
                  manual: [
                    {
                      condition: `fromDate >= today`,
                      message:
                        "From date should be more than or equal to today's date.",
                    },
                  ],
                },
          },
          {
            type: 'date',
            name: 'toDate',
            id: 'toDate',
            // min: 'today',
            title: 'To Date',
            minmax: 'custom',
            minCustomDate: new Date().setDate(
              new Date().getDate() +
                (leaveSetting?.applyCutoffDays
                  ? Number(leaveSetting?.applyCutoffDays)
                  : 1),
            ),
            maxCustomDate: new Date().setDate(new Date().getDate() + 90),
            validationProps: {
              required: 'This is a mandatory field',
              // validate: [
              //     {
              //         condition: "fromDate <= toDate",
              //         message: "From date should not be greater than To date."
              //     }
              // ],
            },
          },
          {
            type: 'text',
            name: 'count',
            id: 'count',
            title: 'Count',
            // allowMaxVal: 3,
            disabled: true,
            defaultValue: leaveData?.count,
            // validationProps: {
            //   required: 'Please select valid date range.',
            // },
          },
          {
            type: 'text',
            name: 'empRemarks',
            id: 'empRemarks',
            title: 'Reason',
            pattern: {
              value: regex.maxSize250,
              message: 'Please enter valid reason.',
            },
          },
        ],
      },
    ],
  };
  function handleChange(val) {
    var date1 = new Date(val?.fromDate || leaveData?.fromDate);
    var date2 = new Date(val?.toDate);
    var Difference_In_Time = date2.getTime() - date1.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    setCountOfDays(Difference_In_Days + 1 ?? 0);
  }
  const getAllLeave = () => {
    let url = `${Api.leave.getAll}`;
    let postData = {
      empId:
        user?.userList?.userRole == 'EMPLOYEE' ? user?.userList?.profileId : '',
      status: '',
      empCode: '',
      fromDate: '',
      toDate: '',
      departmentId: '',
      managerId: '',
    };
    axios
      .post(url, postData)
      .then((res) => {
        if (res?.data?.status == '200') {
          let list = _.groupBy(res?.data?.data, 'status');
          dispatch(setLeaveCount(list?.PENDING?.length || 0));
          // dispatch(setLeaveCount(res?.data?.data?.length));
        }
        let temArr = [];
        res?.data?.data?.map((el) => {
          if (el.status == 'CANCELLED') {
            el.approvedBy = '';
          }
          temArr.push(el);
        });

        let sortedProducts = temArr.sort((p1, p2) =>
          new Date(p1.createdOn) < new Date(p2.createdOn)
            ? 1
            : new Date(p1.createdOn) > new Date(p2.createdOn)
            ? -1
            : 0,
        );

        setLeaveList(sortedProducts);
      })
      .catch((err) => {
        setLeaveList([]);
      });
  };

  const tableTemplate = {
    columns: [
      {
        title: 'Leave Period',
        field: 'fromDate',
        render: (rd) => {
          return (
            moment(rd.fromDate).format('DD/MM/YYYY') +
            '-' +
            moment(rd.toDate).format('DD/MM/YYYY')
          );
        },
      },
      {
        title: ' Days',
        field: 'count',
      },
      {
        title: 'Reason',
        field: 'empRemarks',
      },

      {
        title: 'Status',
        field: 'status',
      },
      {
        title: 'Approver',
        field: 'approvedBy',
      },
      {
        title: 'Approver Remarks',
        field: 'approverRemarks',
      },
      // {
      //   title: 'Applied on',
      //   field: 'createdOn',
      //   type: 'date',
      // },
    ],
  };

  function handleClickCancel(rowData) {
    setData(rowData);
    handleConfirmBox();
  }

  const handleDialogForm = () => {
    setOpenForm(true);
  };

  const handleClose = () => {
    setOpenForm(false);
    setCountOfDays(0);
  };

  const handleConfirmBox = () => {
    setOpenConfirmBox(true);
  };

  const closeConfirmBox = (dd) => {
    if (dd == 'YES') {
      let postData = data;
      postData.status = 'CANCELLED';
      axios
        .put(`${Api.leave.update}`, postData)
        .then((response) => {
          if (response?.data?.status == '200') {
            toast.success('Leave cancelled.');
            setOpenConfirmBox(false);
            getAllLeave();
          } else {
            toast.error(response?.data?.message || 'Something went wrong.');
          }
        })
        .catch((err) => {
          toast.error('Something went wrong.');
        });
    }
    if (dd == 'NO') {
      setOpenConfirmBox(false);
    }
  };

  function handleClickEdit(rowData) {
    console.log('rowData', rowData);
    setId(rowData.id);
    getbyId(rowData?.id);
    setOpenEdit(true);
  }

  function getbyId(id) {
    axios
      .get(Api.baseUri + '/user-reg/leave-reg/getbyid/' + id)
      .then((res) => {
        if (res?.data?.status == '200') {
          setLeaveData({...res?.data?.data});
        }
      })
      .catch((err) => {});
  }

  function handleEdit(values) {
    if (values.button == 'update') {
      let postData = values?.data;
      axios
        .put(Api.baseUri + '/user-reg/leave-reg/update-leave', postData)
        .then((res) => {
          if (res?.data?.status == '200') {
            setLeaveData({});
            setOpenEdit(false);
            getAllLeave();
            toast.success('Leave Updated Successfully');
          }
        })
        .catch((err) => {});
    }
  }
  return (
    <>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={8}>
          <CustomLabel labelVal="Leaves' List" variantVal='h3-underline' />
        </Grid>
        <Grid item xs={4}>
          <Box display='flex' justifyContent='flex-end'>
            <div className=''>
              {leaveSetting?.applyCutoffDays && myActions?.includes('Create') && (
                <AppTooltip placement={'top'} title={'Apply Leave'}>
                  <img
                    src='/assets/images/title-icon/add leave.svg'
                    className='title-icons-mui'
                    onClick={handleDialogForm}
                  />
                </AppTooltip>
              )}
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
        title='Leave List'
        columns={tableTemplate.columns}
        data={leaveList}
        options={{
          sorting: true,
          search: false,
          showTitle: false,
          actionsColumnIndex: -1,
          headerStyle: {position: 'sticky', top: 0},
        }}
        actions={[
          (rd) => ({
            icon: () => (
              <CancelScheduleSendIcon
                color='primary'
                style={{
                  color: '#bc0805',
                  opacity:
                    !leaveSetting?.applyCutoffDays ||
                    rd?.status != 'PENDING' ||
                    moment(new Date(rd?.fromDate)).isBefore(
                      moment(
                        new Date(
                          moment(
                            new Date().setDate(
                              new Date().getDate() +
                                (Number(leaveSetting?.cancelCutoffDays) ?? 1),
                            ),
                          ).format('YYYY-MM-DD') + ' 00:01',
                        ),
                      ),
                    )
                      ? '0.3'
                      : '',
                }}
              />
            ),
            tooltip: rd?.status != 'PENDING' ? rd?.status : 'Cancel',
            onClick: (event, rowData) => {
              if (rowData?.status != 'PENDING') {
                return;
              }
              if (!leaveSetting?.applyCutoffDays) return;
              if (
                moment(new Date(rowData?.fromDate)).isBefore(
                  moment(
                    new Date(
                      moment(
                        new Date().setDate(
                          new Date().getDate() +
                            (Number(leaveSetting?.cancelCutoffDays) ?? 1),
                        ),
                      ).format('YYYY-MM-DD') + ' 00:01',
                    ),
                  ),
                )
              ) {
                return;
              }
              handleClickCancel(rowData);
            },
          }),
          (rd) =>
            myActions?.includes('Edit') && {
              icon: () => (
                <EditIcon
                  color='primary'
                  style={{
                    opacity:
                      rd?.status == 'APPROVED' ||
                      rd?.status == 'CANCELLED' ||
                      rd?.status == 'REJECTED' ||
                      rd?.status == 'Expired' ||
                      // rd?.status == 'PENDING' ||
                      !leaveSetting?.applyCutoffDays
                        ? '0.3'
                        : '',
                  }}
                />
              ),
              tooltip: 'Edit',
              onClick: (event, rowData) => {
                if (
                  rd?.status == 'APPROVED' ||
                  rd?.status == 'CANCELLED' ||
                  rd?.status == 'Expired' ||
                  // rd?.status == 'PENDING' ||
                  rd?.status == 'REJECTED'
                )
                  return;
                if (!leaveSetting?.applyCutoffDays) return;
                handleClickEdit(rowData);
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

      <Dialog
        // onClose={handleClose}
        open={openform}
        maxWidth='false'
      >
        <DialogTitle style={{background: 'rgb(245, 242, 242)'}}>
          <h1>Apply Leave</h1>
          <CloseIcon
            onClick={handleClose}
            style={{position: 'absolute', right: '14px', top: '14px'}}
          />
        </DialogTitle>
        <DialogContent style={{padding: '20px', paddingTop: 0}}>
          {!showbtn ? <AppLoader /> : null}
          <SmartForm
            template={template}
            onSubmit={handleSubmit}
            onChange={handleChange}
            buttons={['apply']}
            mode='onTouched'
            seterrors={[
              {
                name: 'count',
                type: 'customized',
                message:
                  'Maximum number of total leave day require is ' +
                  leaveSetting?.maxLeaveAllowed,
                error:
                  Number(countOfDays) > Number(leaveSetting?.maxLeaveAllowed),
              },
            ]}
            clearErr={[
              {
                name: 'count',
                value:
                  Number(countOfDays) <= Number(leaveSetting?.maxLeaveAllowed),
              },
            ]}
            showbtn={showbtn}
            setVal={[
              {
                name: 'count',
                value: Number(countOfDays) > 0 ? countOfDays : '',
              },
            ]}
          />
        </DialogContent>
      </Dialog>
      <Confirm
        open={openConfirmbox}
        header={'Confirm to Cancel'}
        cnfMsg={'Are you sure, You want to cancel the leave?'}
        handleClose={closeConfirmBox}
      />

      {openEdit && (
        <Dialog
          // onClose={handleClose}
          open={openEdit}
          maxWidth='false'
        >
          <DialogTitle style={{background: 'rgb(245, 242, 242)'}}>
            <h1>Edit Leave</h1>
            <CloseIcon
              onClick={() => {
                setLeaveData({});
                setId('');
                setOpenEdit(false);
              }}
              style={{position: 'absolute', right: '14px', top: '14px'}}
            />
          </DialogTitle>
          <DialogContent style={{padding: '20px', paddingTop: 0}}>
            {leaveData && leaveData?.id && leaveData?.count && (
              <SmartForm
                template={template}
                defaultValues={leaveData}
                onSubmit={handleEdit}
                onChange={handleChange}
                buttons={['update']}
                mode='onTouched'
                seterrors={[
                  {
                    name: 'count',
                    type: 'customized',
                    message:
                      'Maximum number of total leave day require is ' +
                      leaveSetting?.maxLeaveAllowed,
                    error:
                      Number(countOfDays) >
                      Number(leaveSetting?.maxLeaveAllowed),
                  },
                ]}
                clearErr={[
                  {
                    name: 'count',
                    value:
                      Number(countOfDays) <=
                      Number(leaveSetting?.maxLeaveAllowed),
                  },
                ]}
                showbtn={showbtn}
                setVal={[
                  {
                    name: 'count',
                    value: Number(countOfDays) > 0 ? countOfDays : '',
                  },
                ]}
              />
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default LeaveList;
