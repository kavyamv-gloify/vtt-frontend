import React, {useState, useEffect, useRef} from 'react';
import AppTooltip from '@crema/core/AppTooltip';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {Box, DialogTitle, Grid} from '@mui/material';
import CustomLabel from 'pages/common/CustomLabel';
import {Dialog, DialogContent} from '@mui/material';
import AdhocTripForm from './AdhocTripForm';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import Api from '@api';
import SmartTable from '@smart-table';
import moment from 'moment';
import EditIcon from '@mui/icons-material/Edit';
import WrongLocationIcon from '@mui/icons-material/WrongLocation';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import Confirm from '@confirmation-box';
import {toast} from 'react-toastify';
import CancelIcon from '@mui/icons-material/Cancel';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import _ from 'lodash';
import SmartFilter from '@smart-filter';
import QuickSearchPage from '@quick-search';
import {useAuthUser} from '@crema/utility/AuthHooks';

const fieldList = [
  {title: 'Employee Code', value: 'empCode'},
  {title: 'Employee Name', value: 'empName'},
  {title: 'Status', value: 'status'},
];

const AdhocList = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [data, setData] = useState();
  const [openConfirmbox, setOpenConfirmBox] = useState(false);
  const [approveData, setApproveData] = useState();
  const [saveAction, setSaveAction] = useState();
  const [openConfirmDeletebox, setOpenConfirmDeletebox] = useState(false);
  const [id, setId] = useState();
  const [employeeId, setEmployeeId] = useState('');
  const [myActions, setMyActions] = useState([]);
  const navigate = useNavigate();
  const {user} = useAuthUser();
  const permissionCheck = useSelector(({settings}) => settings.permissions);
  const tableRef = useRef();
  const [filter, setFilter] = useState({});
  const [openFilter, setOpenFilter] = useState(false);
  const [filterRes, setFilterRes] = useState(null);
  const [filterShow, setfilterShow] = useState(false);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (!permissionCheck) return;
    let sub_mod = {};
    permissionCheck?.map((el) => {
      if (el.subModuleName == 'Adhoc Trip') sub_mod = el;
    });
    setMyActions(sub_mod?.actions);
    if (
      (!sub_mod || !sub_mod?.actions?.includes('View')) &&
      user?.userList?.userRole !== 'SUPERADMIN'
    )
      navigate('/error-pages/error-404');
  }, [permissionCheck, user]);
  useEffect(() => {
    getFilterData();
  }, [filter]);
  const getFilterData = () => {
    setTimeout(() => {
      tableRef.current && tableRef.current.onQueryChange();
    }, 0);
  };
  const handleClosefilter = (d) => {
    setOpenFilter(false);
  };
  function getAllList() {
    let temp = [];
    axios
      .get(
        Api.baseUri + '/user-reg/adhoc-trip/get-adhoc-request-by-corporateId',
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          res?.data?.data?.map((el) => {
            let date = moment(el?.date).format('DD-MM-YYYY');
            el.date = date;
            el.tripType == 'UPTRIP'
              ? (el.tripType = 'LOGIN')
              : (el.tripType = 'LOGOUT');
            // el?.createdBy == user?.userList?.userName ? el.createdBy = "SELF" : el.createdBy = "CORPORATE"
            temp.push(el);
          });
          setData(temp);
        }
      })
      .catch((err) => {});
  }

  // useEffect(() => {
  //   getAllList();
  // }, []);

  const tableTemplate = {
    columns: [
      {
        title: 'Employee Code',
        field: 'empCode',
      },
      {
        title: 'Employee Name',
        field: 'empName',
      },
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
        render: (rowData) =>
          rowData.status == 'APPROVED' ? (
            <span style={{color: 'green'}}>APPROVED</span>
          ) : rowData.status == 'PENDING' ? (
            <span style={{color: 'orange'}}>PENDING</span>
          ) : rowData.status == 'CANCELLED' ? (
            <span style={{color: 'red'}}>CANCELLED</span>
          ) : (
            rowData.status
          ),
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
        title: 'Last Updated',
        field: 'updatedOn',
        type: 'datetime',
      },
    ],
  };

  function closeConfirmBox(d) {
    setOpenConfirmBox(false);
    if (d == 'YES') {
      let postData = {};
      postData.id = approveData?._id;
      postData.date = approveData?.date;
      postData.time = approveData?.time;
      postData.managerId = approveData?.managerId;
      postData.corporateId = approveData?.corporateId;
      postData.tripType = approveData?.tripType;
      postData.empId = approveData?.empId;
      postData.empCode = approveData?.empCode;
      postData.emailId = approveData?.emailId;
      postData.mobileNo = approveData?.mobileNo;
      postData.officeId = approveData?.officeId;
      postData.officeLocation = approveData?.officeLocation;
      postData.homeLocation = approveData?.homeLocation;
      postData.createdOn = approveData?.createdOn;
      postData.createdBy = approveData?.createdBy;
      postData.updatedOn = approveData?.updatedOn;
      postData.updatedBy = approveData?.updatedBy;
      postData.status = approveData?.status;
      postData.empRemark = approveData?.empRemark;
      postData.managerRemark = approveData?.managerRemark;
      postData.requestedBy = approveData?.requestedBy;
      axios
        .put(
          Api.baseUri + '/user-reg/adhoc-trip/approve-adhoc-request',
          postData,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success(
              `${res?.data?.data?.empName}'s adhoc request approved `,
            );
            // toast.success('Trip Approved Successfully');
            setOpenConfirmBox(false);
            // getAllList();
            getFilterData();
          }
        })
        .catch((err) => {});
    }
  }

  function closeDeleteConfirmBox(d) {
    setOpenConfirmDeletebox(false);
    if (d == 'YES') {
      let postData = {};
      postData.id = approveData?._id;
      postData.date = approveData?.date;
      postData.time = approveData?.time;
      postData.managerId = approveData?.managerId;
      postData.corporateId = approveData?.corporateId;
      postData.tripType = approveData?.tripType;
      postData.empId = approveData?.empId;
      postData.empCode = approveData?.empCode;
      postData.empName = approveData?.empName;
      postData.emailId = approveData?.emailId;
      postData.mobileNo = approveData?.mobileNo;
      postData.officeId = approveData?.officeId;
      postData.officeLocation = approveData?.officeLocation;
      postData.homeLocation = approveData?.homeLocation;
      postData.createdOn = approveData?.createdOn;
      postData.createdBy = approveData?.createdBy;
      postData.updatedOn = approveData?.updatedOn;
      postData.updatedBy = approveData?.updatedBy;
      postData.status = approveData?.status;
      postData.empRemark = approveData?.empRemark;
      postData.managerRemark = approveData?.managerRemark;
      postData.requestedBy = approveData?.requestedBy;
      axios
        .put(
          Api.baseUri + '/user-reg/adhoc-trip/reject-adhoc-request',
          postData,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success(
              `${res?.data?.data?.empName}'s adhoc request rejected `,
            );
            // toast.success('Trip Rejected Successfully');
            setOpenConfirmDeletebox(false);
            // getAllList();
            getFilterData();
          }
        })
        .catch((err) => {});
    }
  }
  return (
    <>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={3} md={4}>
          <CustomLabel labelVal='Adhoc Trip' variantVal='h3-underline' />
        </Grid>
        <Grid item xs={12} sm={3} md={4}>
          <QuickSearchPage
            masterKey='empCode'
            module={'AdhocTripRequest'}
            searchClicked={true}
            searchUrl={'/employee-reg/filter'}
            // masterFields={['empCode', 'emailId', 'firstName']}
            displayFields={['empCode', 'empName', 'date']}
            filterRes={filterRes}
            getFilterData={getFilterData}
            setFilterRes={setFilterRes}
          />
        </Grid>
        <Grid item xs={12} sm={9} md={4} sx={{paddingTop: '0px !important'}}>
          <Box display='flex' justifyContent='flex-end' alignItems='center'>
            <div className='left-seperator'>
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
              {myActions?.includes('Create') && (
                <AppTooltip placement={'top'} title={'Add Adhoc Trip'}>
                  <TrendingUpIcon
                    onClick={() => {
                      setSaveAction('create');
                      setOpenDialog(true);
                    }}
                    sx={{ml: 2, mr: 4}}
                    className='pointer'
                  />
                </AppTooltip>
              )}
            </div>
          </Box>
        </Grid>
      </Grid>
      {!filterRes ? (
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
          title='Adhoc Trip '
          columns={tableTemplate.columns}
          tableRef={tableRef}
          // data={data}
          data={(query) =>
            new Promise((resolve, reject) => {
              let url_ = Api.baseUri + '/api/dashboard/employee/filter',
                body =
                  !filter || _.isEmpty(filter)
                    ? {
                        collection: 'AdhocTripRequest',
                        pageSize: query.pageSize,
                        pageNo: query.page + 1,
                      }
                    : {
                        collection: 'AdhocTripRequest',
                        filterType: 'filter',
                        filters: filter,
                        pageSize: query.pageSize,
                        pageNo: query.page + 1,
                      };
              if (!_.isEmpty(filter)) {
                body = {
                  ...body,
                  ...filter,
                };
              }
              axios
                .post(url_, body)
                .then((result) => {
                  const updatedData = result?.data?.data?.map((el) => {
                    let date = moment(el?.date).format('DD-MM-YYYY');
                    el.date = date;
                    el.tripType = el.tripType === 'UPTRIP' ? 'LOGIN' : 'LOGOUT';
                    return el;
                  });
                  resolve({
                    data: updatedData ?? [],
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
            search: false,
            showTitle: false,
            selection: false,
            pageSize: pageSize,
            pageSizeOptions: [10, 25, 50],
            sorting: true,
            actionsColumnIndex: -1,
            headerStyle: {position: 'sticky', top: 0},
            color: 'primary',
          }}
          onChangeRowsPerPage={(pageSize) => {
            setPageSize(pageSize);
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
                    rowData?.status == 'APPROVED' ||
                    rowData?.status == 'REJECTED' ||
                    data?.status == 'Expired'
                  ) {
                    return;
                  }
                  setSaveAction('Edit');
                  setOpenDialog(true);
                  setId(rowData?._id);
                  setEmployeeId(rowData?.empId);
                },
              },
            (data) =>
              myActions?.includes('Approve Or Reject') && {
                icon: () => (
                  <AssignmentTurnedInIcon
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
                tooltip: 'Approve',
                onClick: (event, rowData) => {
                  if (
                    rowData?.status == 'APPROVED' ||
                    rowData?.status == 'REJECTED' ||
                    rowData?.status == 'CANCELLED' ||
                    rowData?.status == 'Expired'
                  ) {
                    return;
                  }
                  setApproveData(rowData);
                  setOpenConfirmBox(true);
                },
              },
            (data) =>
              myActions?.includes('Approve Or Reject') && {
                icon: () => (
                  <CancelIcon
                    color='primary'
                    style={{
                      color: '#bc0805',
                      opacity:
                        data?.status == 'APPROVED' ||
                        data?.status == 'CANCELLED' ||
                        data?.status == 'REJECTED' ||
                        data?.status == 'Expired'
                          ? '0.3'
                          : '',
                    }}
                  />
                ),
                tooltip: 'Reject',
                onClick: (event, rowData) => {
                  if (
                    rowData?.status == 'APPROVED' ||
                    rowData?.status == 'CANCELLED' ||
                    rowData?.status == 'REJECTED' ||
                    rowData?.status == 'Expired'
                  ) {
                    return;
                  }
                  setApproveData(rowData);
                  setOpenConfirmDeletebox(true);
                  handleClickReject(rowData);
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
          title='Adhoc Trip '
          columns={tableTemplate.columns}
          tableRef={tableRef}
          data={filterRes || []}
          options={{
            search: false,
            showTitle: false,
            selection: false,
            sorting: true,
            actionsColumnIndex: -1,
            headerStyle: {position: 'sticky', top: 0},
            color: 'primary',
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
                    rowData?.status == 'APPROVED' ||
                    rowData?.status == 'REJECTED' ||
                    data?.status == 'Expired'
                  ) {
                    return;
                  }
                  setSaveAction('Edit');
                  setOpenDialog(true);
                  setEmployeeId(rowData?.empId);
                  setId(rowData?._id);
                },
              },
            (data) =>
              myActions?.includes('Approve Or Reject') && {
                icon: () => (
                  <AssignmentTurnedInIcon
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
                tooltip: 'Approve',
                onClick: (event, rowData) => {
                  if (
                    rowData?.status == 'APPROVED' ||
                    rowData?.status == 'REJECTED' ||
                    rowData?.status == 'CANCELLED' ||
                    rowData?.status == 'Expired'
                  ) {
                    return;
                  }
                  setApproveData(rowData);
                  setOpenConfirmBox(true);
                },
              },
            (data) =>
              myActions?.includes('Approve Or Reject') && {
                icon: () => (
                  <CancelIcon
                    color='primary'
                    style={{
                      color: '#bc0805',
                      opacity:
                        data?.status == 'APPROVED' ||
                        data?.status == 'CANCELLED' ||
                        data?.status == 'REJECTED' ||
                        data?.status == 'Expired'
                          ? '0.3'
                          : '',
                    }}
                  />
                ),
                tooltip: 'Reject',
                onClick: (event, rowData) => {
                  if (
                    rowData?.status == 'APPROVED' ||
                    rowData?.status == 'CANCELLED' ||
                    rowData?.status == 'REJECTED' ||
                    rowData?.status == 'Expired'
                  ) {
                    return;
                  }
                  setApproveData(rowData);
                  setOpenConfirmDeletebox(true);
                  handleClickReject(rowData);
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
      )}
      {openDialog && (
        <Dialog
          open={true}
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
            <h1>Update Adhoc Trip</h1>
            <CloseIcon
              onClick={() => {
                setOpenDialog(false);
                setId(null);
              }}
              style={{color: '#4f4f4f', fontWeight: 'bold'}}
            />
          </DialogTitle>
          <DialogContent style={{marginTop: '50px'}}>
            <AdhocTripForm
              close={() => {
                setOpenDialog(false);
                setId(null);
                // getAllList();
                getFilterData();
              }}
              action={saveAction}
              adhocid={id}
              employeeId={employeeId}
            />
          </DialogContent>
        </Dialog>
      )}

      {openConfirmbox && (
        <Confirm
          open={true}
          header={'Confirm to Approve'}
          cnfMsg={'Are you sure, You want to approve it?'}
          handleClose={closeConfirmBox}
        />
      )}
      {openConfirmDeletebox && (
        <Confirm
          open={true}
          header={'Confirm to Reject'}
          cnfMsg={'Are you sure, You want to reject it?'}
          handleClose={closeDeleteConfirmBox}
          reason={true}
        />
      )}
      {filterShow && (
        <SmartFilter
          open={openFilter}
          title={'Adhoc Trip Filter'}
          handleClose={handleClosefilter}
          filter={filter}
          fieldList={fieldList}
          setFilter={setFilter}
        />
      )}
    </>
  );
};

export default AdhocList;
