import React, {useEffect, useRef, useState} from 'react';
import SmartTable from '@smart-table';
import axios from 'axios';
import _ from 'lodash';
import {
  Autocomplete,
  Box,
  Button,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
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
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import {useAuthUser} from '@crema/utility/AuthHooks';
import moment from 'moment';
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import AppLoader from '@crema/core/AppLoader';
import QuickSearchPage from '@quick-search';
import AppTooltip from '@crema/core/AppTooltip';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import SmartFilter from '@smart-filter';
const fieldList = [
  {title: 'Employee Code', value: 'empCode'},
  {title: 'Employee Name', value: 'createdBy'},
  {title: 'Days', value: 'count'},
  {title: 'Status', value: 'status'},
];

const LeaveList = () => {
  const tableRef = useRef();
  const {user} = useAuthUser();
  const [data, setData] = useState([]);
  const [openConfirmbox, setOpenConfirmBox] = useState(false);
  const [leaveList, setLeaveList] = useState([]);
  const [deptId, setDeptId] = useState();
  const [flag, setFlag] = useState();
  const [leaveSetting, setLeaveSetting] = useState();
  const [departmentList, setDepartmentList] = useState([]);
  const navigate = useNavigate();
  const [myActions, setMyActions] = useState([]);
  const permissionCheck = useSelector(({settings}) => settings.permissions);
  const [filter, setFilter] = useState({});
  const [openFilter, setOpenFilter] = useState(false);
  const [filterRes, setFilterRes] = useState(null);
  const [filterShow, setfilterShow] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  console.log('filter', filter);
  useEffect(() => {
    getFilterData();
  }, [filter]);
  const getFilterData = () => {
    setTimeout(() => {
      tableRef.current && tableRef.current.onQueryChange();
    }, 0);
  };
  useEffect(() => {
    if (!permissionCheck) return;
    if (user?.userList?.userRole == 'MANAGER') return;
    let sub_mod = {};
    permissionCheck?.map((el) => {
      if (el.subModuleName == 'Leave Management') sub_mod = el;
    });
    setMyActions(sub_mod?.actions);
    if (
      (!sub_mod || !sub_mod?.actions?.includes('View')) &&
      user?.userList?.userRole !== 'SUPERADMIN'
    )
      navigate('/error-pages/error-404');
  }, [permissionCheck, user]);
  async function getDeptList() {
    axios
      .get(`${Api?.dropdown?.department}`)
      .then((res) => {
        let temp = [];
        if (res?.data?.data?.length) {
          res?.data?.data?.map((e, ind) => {
            if (ind === 0 && user?.userList?.userRole !== 'MANAGER')
              setDeptId(e.id);
            temp.push({title: e.departmentName, value: e.id});
          });
        }
        setDepartmentList(temp);
      })
      .catch((er) => {
        setDepartmentList([]);
      });
  }

  useEffect(() => {
    if (deptId) {
      getsettingById(deptId);
      getFilterData();
    }
  }, [deptId]);

  useEffect(() => {
    if (user?.userList?.userRole) getDeptList();
    if (user?.userList?.userRole == 'MANAGER') getManagerDeptId();
  }, [user?.userList?.userRole]);

  const getManagerDeptId = () => {
    const baseURL = `${Api.employee.list}/${user.userList.profileId}`;
    axios
      .get(`${baseURL}`)
      .then((response) => {
        setDeptId(response?.data?.data?.departmentId);
      })
      .catch((err) => {});
  };

  const getsettingById = (dep_id) => {
    axios
      .get(`${Api?.leave?.getLeaveSettingByDeptId + dep_id}`)
      .then((res) => {
        setLeaveSetting(res?.data?.data[0]);
      })
      .catch((er) => {
        setLeaveSetting({});
      });
  };

  const handleProceedAction = (val) => {
    if (val?.button == 'cancel') {
      setOpenConfirmBox(false);
      return;
    }
    let postData = data;
    postData.status = postData.tempstatus;
    delete postData.tempstatus;
    postData.approverRemarks = val?.data?.approverRemarks;
    axios
      .put(`${Api.leave.update}`, postData)
      .then((response) => {
        setOpenConfirmBox(false);
        if (response?.data?.status == '200') {
          flag == 'APPROVED'
            ? toast.success(
                `${response?.data?.data?.createdBy}'s leave request approved`,
              )
            : toast.success(
                `${response?.data?.data?.createdBy}'s leave request rejected`,
              );
          // toast.success('Leave ' + val?.button + 'ed successfully.');
          getFilterData();
        }
      })
      .catch((err) => {
        setOpenConfirmBox(false);
        toast.error('Something went wrong.');
      });
  };
  let templateAction = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    title: '',
    description: 'Action',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'action_form',
        fields: [
          {
            type: 'textarea',
            name: 'approverRemarks',
            id: 'approverRemarks',
            title: 'Remarks',
            pattern: {
              value: regex.maxSize250,
              message: 'Please enter valid remarks',
            },
            validationProps: {
              // required: 'This is a mandatory field'
            },
          },
        ],
      },
    ],
  };
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
            pattern: {
              value: regex.maxSize50,
              message: 'Please enter valid routing(%)',
            },
            validationProps: {
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
            title: 'To Date',
            pattern: {
              value: regex.maxSize50,
              message: 'Please enter valid routing(%)',
            },
            validationProps: {
              required: 'This is a mandatory field',
              manual: [
                {
                  condition: `toDate >= today`,
                  message:
                    "To date should be more than or equal to today's date.",
                },
              ],
              validate: [
                {
                  condition: 'fromDate <= toDate',
                  message: 'From date should not be greater than To date.',
                },
              ],
            },
          },
          {
            type: 'text',
            name: 'count',
            id: 'count',
            title: 'Count',
            disabled: true,
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
  // const getFilterData = () => {
  //   if (!deptId) return;
  //   let url = `${Api.leave.getAll}`;
  //   let postData = {
  //     empId: '',
  //     empCode: '',
  //     managerId:
  //       user?.userList?.userRole == 'MANAGER' ? user?.userList?.profileId : '',
  //     status: '',
  //     fromDate: '',
  //     toDate: '',
  //     departmentId: deptId,
  //   };
  //   axios
  //     .post(url, postData)
  //     .then((res) => {
  //       let temArr = [];
  //       res?.data?.data?.map((el) => {
  //         if (el?.status == 'PENDING') {
  //           el.approvedBy = '';
  //         }
  //         temArr.push(el);
  //       });
  //       let sortedProducts = temArr.sort((p1, p2) =>
  //         new Date(p1.createdOn) < new Date(p2.createdOn)
  //           ? 1
  //           : new Date(p1.createdOn) > new Date(p2.createdOn)
  //           ? -1
  //           : 0,
  //       );
  //       setLeaveList(sortedProducts);
  //     })
  //     .catch((err) => {
  //       setLeaveList([]);
  //     });
  // };
  const tableTemplate = {
    columns: [
      {
        title: 'Employee Name',
        field: 'createdBy',
      },
      {
        title: 'Employee Code',
        field: 'empCode',
      },
      // {
      //   title: 'Leave From Date',
      //   field: 'fromDate',
      //   type: 'date',
      // },
      // {
      //   title: 'Leave To Date',
      //   field: 'toDate',
      //   type: 'date',
      // },
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
        title: 'Days',
        field: 'count',
      },
      {
        title: 'Reason',
        field: 'empRemarks',
      },

      {
        title: 'Status',
        field: 'status',
        render: (rowData) =>
          rowData.status == 'APPROVED' ? (
            <span style={{color: 'green'}}>APPROVED</span>
          ) : rowData.status == 'PENDING' ? (
            <span style={{color: 'orange'}}>PENDING</span>
          ) : rowData.status == 'CANCELLED' ? (
            <span style={{color: '#950e0e'}}>CANCELLED</span>
          ) : rowData.status == 'Expired' ? (
            <span style={{color: 'blue'}}>EXPIRED</span>
          ) :  rowData.status == 'REJECTED' ? (
            <span style={{color: 'red'}}>REJECTED</span>
          ) : (
            rowData.status
          ),
      },
      {
        title: 'Approver',
        field: 'approvedBy',
      },
      {
        title: 'Approver Remarks',
        field: 'approverRemarks',
      },
      {
        title: 'Updated on',
        field: 'updatedOn',
        type: 'datetime',
      },
      // {
      //   title: 'Applied on',
      //   field: 'createdOn',
      //   type: 'datetime',
      // },
    ],
  };

  function handleClickCancel(rowData, status) {
    rowData.id = rowData?._id;
    // Remove _id property
    delete rowData?._id;
    rowData.tempstatus = status;
    setData(rowData);
    handleConfirmBox();
  }

  const handleConfirmBox = () => {
    setOpenConfirmBox(true);
  };
  const handleClosefilter = (d) => {
    setOpenFilter(false);
  };

  return (
    <>
      {!deptId ? <AppLoader /> : null}
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={3}>
          <CustomLabel labelVal='Leaves' variantVal='h3-underline' />
        </Grid>
        <Grid item xs={12} sm={3} md={4}>
          <QuickSearchPage
            masterKey='empCode'
            module={'Leave'}
            searchClicked={true}
            searchUrl={'/employee-reg/filter'}
            // masterFields={['empCode', 'emailId', 'firstName']}
            displayFields={['empCode', 'createdBy', 'fromDate', 'toDate']}
            filterRes={filterRes}
            getFilterData={getFilterData}
            setFilterRes={setFilterRes}
          />
        </Grid>
        <Grid xs={12} sm={9} md={5}>
          <Box display='flex' justifyContent='flex-end' alignItems='center'>
            <AppTooltip placement={'top'} title={'Add Filter'}>
              <FilterAltOutlinedIcon
                className='title-icons-mui'
                style={{color: _.isEmpty(filter) ? '' : '#ff9800'}}
                onClick={() => {
                  setfilterShow(true);
                  setOpenFilter(true);
                }}
              />
            </AppTooltip>
            <AppTooltip placement={'top'} title={'Clear Filter'}>
              <img
                src='/assets/images/clear-filter.png'
                onClick={() => {
                  setfilterShow(false);
                  setFilter({});
                  handleClosefilter({button: 'clear'});
                }}
                className='title-icons-mui'
              />
            </AppTooltip>
            <FormControl sx={{m: 1, width: 200}}>
              {departmentList?.length && deptId ? (
                <FormControl fullWidth>
                  <InputLabel id='demo-simple-select-label' shrink={true}>
                    Department
                  </InputLabel>
                  <Select
                    labelId='demo-simple-select-label'
                    id='demo-simple-select'
                    value={deptId}
                    size='small'
                    disabled={user?.userList?.userRole == 'MANAGER'}
                    InputLabelProps={{shrink: true}}
                    label='Department'
                    onChange={(e) => {
                      setDeptId(e?.target?.value);
                    }}
                  >
                    {departmentList?.map((el) => {
                      return <MenuItem value={el.value}>{el?.title}</MenuItem>;
                    })}
                  </Select>
                </FormControl>
              ) : // <Autocomplete
              //     id="free-solo-demo"
              //     disabled={departmentList?.length == 1}
              //     freeSolo
              //     size='small'
              //     onChange={(e, option, v) => {
              //         if (v == 'clear') {
              //             //  setDeptId(departmentList[0]);
              //         }
              //         else {
              //
              //             setDeptId(option);
              //         }
              //     }}
              //     options={departmentList ?? []}
              //     value={ !_.isEmpty(deptId) ? deptId : departmentList[0] }//{title:"App & cloud", value:"63cfb6ce63de953f3a07b80b"}}
              //     style={{ background: "#fff" }}
              //     InputProps={{ disableUnderline: true }}
              //     getOptionLabel={(option) => option.title}
              //     renderInput={(params) => <TextField
              //         {...params} label="Department" style={{ fontWeight: "bold" }} InputProps={{
              //             ...params.InputProps,
              //             disableUnderline: true,
              //             size: 'small'
              //         }} />}
              // />
              null}
            </FormControl>
          </Box>
        </Grid>
      </Grid>
      {deptId &&
        (!filterRes ? (
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
            tableRef={tableRef}
            // data={leaveList}
            data={(query) =>
              new Promise((resolve, reject) => {
                let url_ = Api.baseUri + '/api/dashboard/employee/filter',
                  body = !deptId
                    ? {
                        collection: 'Leave',
                        pageSize: query.pageSize,
                        pageNo: query.page + 1,
                      }
                    : {
                        collection: 'Leave',
                        filterType: 'filter',
                        filters: [
                          {
                            fieldOperator: '$and',
                            field: 'departmentId',
                            valueOperator: '$eq',
                            value: deptId,
                          },
                        ],
                        pageSize: query.pageSize,
                        pageNo: query.page + 1,
                      };
                if (!_.isEmpty(filter)) {
                  body = {
                    ...body,
                    filters: [...body.filters, ...filter],
                  };
                }
                axios
                  .post(url_, body)
                  .then((result) => {
                    resolve({
                      data: result?.data?.data ?? [],
                      page: (result?.data?.currentPage || 0) - 1,
                      totalCount: result?.data?.totalItems ?? 0,
                    });
                  })
                  .catch((err) => {
                    resolve({
                      data: [],
                      page: 0,
                      totalCount: 0,
                    });
                  });
              })
            }
            options={{
              sorting: true,
              search: false,
              showTitle: false,
              actionsColumnIndex: -1,
              headerStyle: {position: 'sticky', top: 0},
              pageSize: pageSize,
              pageSizeOptions: [10, 25, 50],
              // myActions?.includes('Approve Or Reject') &&
            }} //(user?.userList?.userRole == "CORPORATEADMIN") &&
            onChangeRowsPerPage={(pageSize) => {
              setPageSize(pageSize);
            }}
            actions={
              (user?.userList?.userRole == 'MANAGER' &&
                leaveSetting?.managerApprovalReq == 'YES') ||
              (leaveSetting?.corporateApprovalReq == 'YES' &&
                myActions?.includes('Approve Or Reject'))
                ? [
                    (rd) => ({
                      icon: () => (
                        <TaskAltIcon
                          color='primary'
                          style={{
                            opacity:
                              moment(new Date(rd?.fromDate)).isBefore(
                                moment(
                                  new Date(
                                    moment(
                                      new Date().setDate(
                                        new Date().getDate() +
                                          (Number(
                                            leaveSetting?.approvalCutoffDays,
                                          ) ?? 1),
                                      ),
                                    ).format('YYYY-MM-DD') + ' 00:01',
                                  ),
                                ),
                              ) || rd?.status != 'PENDING'
                                ? '0.3'
                                : '',
                          }}
                        />
                      ),
                      tooltip: rd?.status != 'PENDING' ? rd?.status : 'APPROVE',
                      onClick: (event, rowData) => {
                        if (
                          moment(new Date(rd?.fromDate)).isBefore(
                            moment(
                              new Date(
                                moment(
                                  new Date().setDate(
                                    new Date().getDate() +
                                      (Number(
                                        leaveSetting?.approvalCutoffDays,
                                      ) ?? 1),
                                  ),
                                ).format('YYYY-MM-DD') + ' 00:01',
                              ),
                            ),
                          )
                        )
                          return;
                        if (rowData?.status != 'PENDING') {
                          return;
                        }
                        handleClickCancel(rowData, 'APPROVED');
                        setFlag('APPROVED');
                      },
                    }),
                    (rd) => ({
                      icon: () => (
                        <CancelScheduleSendIcon
                          color='primary'
                          style={{
                            color: '#bc0805',
                            opacity:
                              !leaveSetting?.applyCutoffDays ||
                              moment(new Date(rd?.fromDate)).isBefore(
                                moment(
                                  new Date(
                                    moment(
                                      new Date().setDate(
                                        new Date().getDate() +
                                          (Number(
                                            leaveSetting?.approvalCutoffDays,
                                          ) ?? 1),
                                      ),
                                    ).format('YYYY-MM-DD') + ' 00:01',
                                  ),
                                ),
                              ) ||
                              rd?.status != 'PENDING'
                                ? '0.3'
                                : '',
                          }}
                        />
                      ),
                      tooltip: rd?.status != 'PENDING' ? rd?.status : 'Reject',
                      onClick: (event, rowData) => {
                        if (
                          moment(new Date(rd?.fromDate)).isBefore(
                            moment(
                              new Date(
                                moment(
                                  new Date().setDate(
                                    new Date().getDate() +
                                      (Number(
                                        leaveSetting?.approvalCutoffDays,
                                      ) ?? 1),
                                  ),
                                ).format('YYYY-MM-DD') + ' 00:01',
                              ),
                            ),
                          )
                        )
                          return;
                        if (!leaveSetting?.applyCutoffDays) return;
                        if (rowData?.status != 'PENDING') {
                          return;
                        }
                        handleClickCancel(rowData, 'REJECTED');
                        setFlag('REJECTED');
                      },
                    }),
                  ]
                : []
            }
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
        ) : (
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
            tableRef={tableRef}
            data={filterRes || []}
            // data={(query) =>
            //   new Promise((resolve, reject) => {
            //     let url_ = Api.baseUri + '/api/dashboard/employee/filter',
            //       body = !deptId
            //         ? {
            //             collection: 'Leave',
            //             pageSize: query.pageSize,
            //             pageNo: query.page + 1,
            //           }
            //         : {
            //             collection: 'Leave',
            //             filterType: 'filter',
            //             filters: [
            //               {
            //                 fieldOperator: '$and',
            //                 field: 'departmentId',
            //                 valueOperator: '$eq',
            //                 value: deptId,
            //               },
            //             ],
            //             pageSize: query.pageSize,
            //             pageNo: query.page + 1,
            //           };
            //     if (!_.isEmpty(filter)) {
            //       body = {
            //         ...body,
            //         ...filter,
            //       };
            //     }
            //     axios
            //       .post(url_, body)
            //       .then((result) => {
            //         resolve({
            //           data: result?.data?.data ?? [],
            //           page: (result?.data?.currentPage || 0) - 1,
            //           totalCount: result?.data?.totalItems ?? 0,
            //         });
            //       })
            //       .catch((err) => {
            //         resolve({
            //           data: [],
            //           page: 0,
            //           totalCount: 0,
            //         });
            //       });
            //   })
            // }
            options={{
              sorting: true,
              search: false,
              showTitle: false,
              actionsColumnIndex: -1,
              headerStyle: {position: 'sticky', top: 0},
              // myActions?.includes('Approve Or Reject') &&
            }} //(user?.userList?.userRole == "CORPORATEADMIN") &&
            actions={
              (user?.userList?.userRole == 'MANAGER' &&
                leaveSetting?.managerApprovalReq == 'YES') ||
              (leaveSetting?.corporateApprovalReq == 'YES' &&
                myActions?.includes('Approve Or Reject'))
                ? [
                    (rd) => ({
                      icon: () => (
                        <TaskAltIcon
                          color='primary'
                          style={{
                            opacity:
                              moment(new Date(rd?.fromDate)).isBefore(
                                moment(
                                  new Date(
                                    moment(
                                      new Date().setDate(
                                        new Date().getDate() +
                                          (Number(
                                            leaveSetting?.approvalCutoffDays,
                                          ) ?? 1),
                                      ),
                                    ).format('YYYY-MM-DD') + ' 00:01',
                                  ),
                                ),
                              ) || rd?.status != 'PENDING'
                                ? '0.3'
                                : '',
                          }}
                        />
                      ),
                      tooltip: rd?.status != 'PENDING' ? rd?.status : 'APPROVE',
                      onClick: (event, rowData) => {
                        if (
                          moment(new Date(rd?.fromDate)).isBefore(
                            moment(
                              new Date(
                                moment(
                                  new Date().setDate(
                                    new Date().getDate() +
                                      (Number(
                                        leaveSetting?.approvalCutoffDays,
                                      ) ?? 1),
                                  ),
                                ).format('YYYY-MM-DD') + ' 00:01',
                              ),
                            ),
                          )
                        )
                          return;
                        if (rowData?.status != 'PENDING') {
                          return;
                        }
                        handleClickCancel(rowData, 'APPROVED');
                        setFlag('APPROVED');
                      },
                    }),
                    (rd) => ({
                      icon: () => (
                        <CancelScheduleSendIcon
                          color='primary'
                          style={{
                            color: '#bc0805',
                            opacity:
                              !leaveSetting?.applyCutoffDays ||
                              moment(new Date(rd?.fromDate)).isBefore(
                                moment(
                                  new Date(
                                    moment(
                                      new Date().setDate(
                                        new Date().getDate() +
                                          (Number(
                                            leaveSetting?.approvalCutoffDays,
                                          ) ?? 1),
                                      ),
                                    ).format('YYYY-MM-DD') + ' 00:01',
                                  ),
                                ),
                              ) ||
                              rd?.status != 'PENDING'
                                ? '0.3'
                                : '',
                          }}
                        />
                      ),
                      tooltip: rd?.status != 'PENDING' ? rd?.status : 'Reject',
                      onClick: (event, rowData) => {
                        if (
                          moment(new Date(rd?.fromDate)).isBefore(
                            moment(
                              new Date(
                                moment(
                                  new Date().setDate(
                                    new Date().getDate() +
                                      (Number(
                                        leaveSetting?.approvalCutoffDays,
                                      ) ?? 1),
                                  ),
                                ).format('YYYY-MM-DD') + ' 00:01',
                              ),
                            ),
                          )
                        )
                          return;
                        if (!leaveSetting?.applyCutoffDays) return;
                        if (rowData?.status != 'PENDING') {
                          return;
                        }
                        handleClickCancel(rowData, 'REJECTED');
                        setFlag('REJECTED');
                      },
                    }),
                  ]
                : []
            }
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
        ))}

      {openConfirmbox ? (
        <Dialog
          onClose={() => {
            setOpenConfirmBox(false);
          }}
          open={openConfirmbox}
          maxWidth='false'
        >
          <DialogTitle style={{background: 'rgb(245, 242, 242)'}}>
            <h1>
              {data?.tempstatus == 'APPROVED' ? 'Approve' : 'Reject'} Leave
            </h1>
            <CloseIcon
              onClick={() => {
                setOpenConfirmBox(false);
              }}
              style={{position: 'absolute', right: '14px', top: '14px'}}
            />
          </DialogTitle>
          <DialogContent
            style={{padding: '20px', paddingTop: '0px', minWidth: '500px'}}
          >
            <SmartForm
              template={templateAction}
              onSubmit={handleProceedAction}
              buttons={[data?.tempstatus == 'APPROVED' ? 'approve' : 'reject']}
            />
          </DialogContent>
        </Dialog>
      ) : null}
      {filterShow && (
        <SmartFilter
          open={openFilter}
          title={'Leave Management Filter'}
          handleClose={handleClosefilter}
          filter={filter}
          fieldList={fieldList}
          setFilter={setFilter}
        />
      )}
      {/* <Confirm open={openConfirmbox} header={"Confirm to Cancel"} cnfMsg={"Are you sure, You want to "+(data?.status == "APPROVED" ? "accept" : "reject")+" the leave?"} handleClose={closeConfirmBox} /> */}
    </>
  );
};

export default LeaveList;
