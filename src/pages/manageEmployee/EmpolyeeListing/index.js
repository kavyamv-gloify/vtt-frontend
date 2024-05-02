import React, {useState, useEffect} from 'react';
import SmartTable from '@smart-table';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import _ from 'lodash';
import api from '@api';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {Box, Button, Switch} from '@mui/material';
import EmpolyeeEditForm from '../EditEmployee/index';
import EmpolyeeForm from '../EmpolyeeForm/index';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import DetailForm from '../EmployeeDetailPage';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomLabel from 'pages/common/CustomLabel';
import ExcelContainer from '@excelupload';
import Confirm from '@confirmation-box';
import Api from '@api';
import Grid from '@mui/material/Grid';
import AppTooltip from '@crema/core/AppTooltip';
import QuickSearchPage from '@quick-search';
import {useSelector} from 'react-redux';
import RestoreIcon from '@mui/icons-material/Restore';
import SmartFilter from '@smart-filter';
import moment from 'moment';
import {getFormData} from '@hoc';
import {toast} from 'react-toastify';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import EmailIcon from '@mui/icons-material/Email';
import MessageIcon from '@mui/icons-material/Message';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import UnsubscribeIcon from '@mui/icons-material/Unsubscribe';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import MarkChatReadIcon from '@mui/icons-material/MarkChatRead';

const List = () => {
  const navigate = useNavigate();
  const {user} = useAuthUser();
  const [myActions, setMyActions] = useState([]);

  const permissionCheck = useSelector(({settings}) => settings.permissions);
  const fieldList = [
    {title: 'First Name', value: 'firstName'},
    {title: 'Last Name', value: 'lastName'},
    {title: 'Email Id', value: 'emailId'},
    {title: 'Email Status', value: 'emailStatus'},
    {title: 'SMS Status', value: 'smsStatus'},
    {title: 'Mob No', value: 'mobileNo'},
    {title: 'Gender', value: 'gender'},
    {title: 'Employee Code', value: 'employeeCode'},
    {title: 'Department', value: 'department'},
    {title: 'Designation', value: 'designation'},
    {title: 'Shift', value: 'shiftName'},
    {title: 'Manager Name', value: 'managerName'},
    {title: 'Employee Category', value: 'employeeCategory'},
    {title: 'Special Category', value: 'specificNeedType'},
    {title: 'Short Id', value: 'shortId'},
    {title: 'Vaccination', value: 'IsVaccinated'},
    {title: 'Cost center', value: 'costCenter'},
    {title: 'Locality', value: 'pickupLocation.locality'},
  ];
  useEffect(() => {
    if (!permissionCheck) return;
    let sub_mod = {};
    permissionCheck?.map((el) => {
      if (el.subModuleName == 'Employees') sub_mod = el;
    });
    setMyActions(sub_mod?.actions);
    if (
      (!sub_mod || !sub_mod?.actions?.includes('View')) &&
      user?.userList?.userRole !== 'SUPERADMIN'
    )
      navigate('/error-pages/error-404');
  }, [permissionCheck, user]);
  //

  const [openDialog, setopenDialog] = useState(false);
  const [dialID, setdialID] = useState();
  const [openform, setOpenForm] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [id, setId] = useState();
  const [openConfirmbox, setOpenConfirmBox] = useState(false);
  const [openConfirmboxReactivate, setOpenConfirmBoxReactivate] =
    useState(false);
  const [empDP, setDP] = useState('');
  const [filter, setFilter] = useState({});
  const [openFilter, setOpenFilter] = useState(false);
  const [filterRes, setFilterRes] = useState(null);
  const [filterShow, setfilterShow] = useState(false);
  const [domain, setDomain] = useState();
  const [searchClicked, setsearchClicked] = useState(false);
  const [pendingCount, setPendingCount] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedMode, setSelectedMode] = useState('');
  const [isEmailSwitchOn, setEmailSwitchOn] = useState(false);
  const [isAnotherSwitchOn, setAnotherSwitchOn] = useState(false);
  const [emailPermission, setEmailPermission] = useState();
  const [pageSize, setPageSize] = useState(10);
  const handleChangeEmailSwitch = (mode) => {
    setSelectedMode(mode);
    setEmailSwitchOn((prevSwitchState) => !prevSwitchState);
    setAnotherSwitchOn(false);
  };

  const handleChangeAnotherSwitch = (mode) => {
    setSelectedMode(mode);
    setAnotherSwitchOn((prevSwitchState) => !prevSwitchState);
    setEmailSwitchOn(false);
  };

  const handleSelectionChange = (rows) => {
    const selectedData = rows.map((row) => ({
      name: row?.employeeFullName,
      emailid: row?.emailId,
      mobileNo: row?.mobileNo,
    }));
    setSelectedRows(selectedData);
  };
  const handleTooltipClick = async () => {
    try {
      let apiEndpoint = '';
      let payload = {};
      if (selectedMode == 'EMAIL') {
        // apiEndpoint = '/usernotify/email/sendMailForProfileCreation';
        apiEndpoint =
          '/user-reg/employee-reg/sendMailForProfileCreationEmployee';
        payload = selectedRows.map(({name, emailid}) => ({name, emailid}));
      } else if (selectedMode == 'SMS') {
        apiEndpoint =
          '/user-reg/employee-reg/sendSmsForProfileCreationEmployee';
        payload = selectedRows.map(({name, mobileNo}) => ({name, mobileNo}));
      } else {
        return;
      }
      const response = await axios.post(Api.baseUri + apiEndpoint, payload);
      console.log('response', response);
      if (response?.status == 200) {
        if (selectedMode == 'EMAIL') {
          toast.success('Email sent successfully.');
        } else if (selectedMode == 'SMS') {
          toast.success('SMS sent successfully.');
        }
        setSelectedRows([]);
        getFilterData();
      } else {
        toast.error('Failed to send request.');
      }
    } catch (error) {
      toast.error('Error sending request.');
    }
  };

  function profileDPfunc(r) {
    setDP(Api?.imgUrl + r);
  }
  const tableRef = React.useRef();
  const profileIds = user?.userList?.profileId;

  function popBTNClick(val) {
    getFilterData();
    if (!val) {
      setopenDialog(false);
    }
  }

  useEffect(() => {
    getFilterData();
  }, [filter]);
  const getFilterData = () => {
    setTimeout(() => {
      tableRef.current && tableRef.current.onQueryChange();
    }, 0);
  };
  useEffect(() => {
    if (!user?.userList?.corporateId) return;
    axios
      .get(`${api.onBoardCorporate.list}/${user?.userList?.corporateId}`)
      .then((res) => {
        setDomain(res?.data?.data?.domains ?? []);
      })
      .catch((err) => {
        setDomain([]);
      });
  }, [user?.userList?.corporateId]);

  useEffect(() => {
    axios
      .get(
        Api.baseUri +
          '/user-reg/employee-change/' +
          user?.userList?.corporateId +
          '/corporate/PENDING/status',
      )
      .then((res) => {
        if (res?.data.status == '200') {
          setPendingCount(res?.data?.data?.length);
        }
      })
      .catch((err) => {});
  }, [user?.userList?.corporateId]);
  const tableTemplateSuperAdmin = {
    columns: [
      {
        field: 'photo',
        title: 'Photo',
        render: (rowData) => (
          <div style={{display: 'flex', alignItems: 'start'}}>
            <FiberManualRecordIcon
              sx={{
                fontSize: '15px',
                color:
                  rowData?.loginDetails?.activeStatus == 'YES'
                    ? 'green'
                    : 'red',
                marginLeft: '10px',
              }}
            />
            <img
              src={
                rowData.photo
                  ? Api.imgUrl + rowData.photo
                  : rowData?.gender == 'Female'
                  ? '/assets/images/human.png'
                  : '/assets/images/user.png'
              }
              style={{
                width: 50,
                borderRadius: '50%',
                height: 50,
              }}
            />
          </div>
        ),
      },
      {
        title: 'Employee',
        field: 'employeeFullName',
        render: (rd) => {
          return rd.employeeFullName + ' (' + rd.employeeCode + ')';
        },
      },
      {
        title: 'Is Manager?',
        field: 'roasterManagerFlag',
      },
      {
        title: 'Address',
        field: 'residenceAddress.addressName',
      },

      {
        title: 'Mobile',
        field: 'mobileNo',
      },
      {
        title: 'Email',
        field: 'emailId',
      },
      {
        title: 'Device Name',
        field: 'loginDetails',
        render: (rd) => {
          return rd?.loginDetails?.deviceName ?? '--';
        },
      },

      {
        title: 'OS ',
        field: 'os',
        render: (rd) => {
          return rd?.loginDetails?.oS ?? '--';
        },
      },
      {
        title: 'OS Version ',
        field: 'osVersion',
        render: (rd) => {
          return rd?.loginDetails?.osVersion ?? '--';
        },
      },
      {
        title: 'App Version',
        field: 'appVersion',
        render: (rd) => {
          return rd?.loginDetails?.appVersion ?? '--';
        },
      },
      {
        title: 'Location Permission',
        field: 'locationPermission',
        render: (rd) => {
          return rd?.loginDetails?.locationPermission ?? '--';
        },
      },
      {
        title: 'Status',
        field: 'status',
        render: (rowData) =>
          rowData.status == 'ACTIVE' ? (
            <span style={{color: 'green'}}>ACTIVE</span>
          ) : rowData.status == 'INACTIVE' ? (
            <span style={{color: 'red'}}>INACTIVE</span>
          ) : (
            rowData.status
          ),
      },
      {
        title: 'Email/SMS Status',
        field: 'emailStatus',
        render: (rowData) => (
          <>
            {rowData.emailStatus == 'SENT' ? (
              <MarkEmailReadIcon style={{color: 'green', fontSize: '30px'}} />
            ) : (
              <UnsubscribeIcon style={{color: 'red', fontSize: '30px'}} />
            )}
          </>
        ),
      },
      {
        title: 'Profile Status',
        field: 'profileStatus',
        render: (rowData) =>
          rowData.profileStatus == 'DEFAULT' ? (
            <span style={{color: 'orange'}}>Not Verified</span>
          ) : rowData.profileStatus == 'ACTIVE' ? (
            <span style={{color: 'green'}}>Verified</span>
          ) : rowData.profileStatus == 'INACTIVE' ? (
            <span style={{color: 'red'}}>Inactive</span>
          ) : (
            rowData.profileStatus
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

  const tableTemplateCorporate = {
    columns: [
      {
        field: 'photo',
        title: 'Photo',
        render: (rowData) => (
          <div style={{display: 'flex', alignItems: 'start'}}>
            <FiberManualRecordIcon
              sx={{
                fontSize: '15px',
                color:
                  rowData?.loginDetails?.activeStatus == 'YES'
                    ? 'green'
                    : 'red',
                marginLeft: '10px',
              }}
            />
            <img
              src={
                rowData.photo
                  ? Api.imgUrl + rowData.photo
                  : rowData?.gender == 'Female'
                  ? '/assets/images/human.png'
                  : '/assets/images/user.png'
              }
              style={{
                width: 50,
                borderRadius: '50%',
                height: 50,
              }}
            />
          </div>
        ),
      },
      {
        title: 'Employee',
        field: 'employeeFullName',
        render: (rd) => {
          return rd.employeeFullName + ' (' + rd.employeeCode + ')';
        },
      },
      {
        title: 'Is Manager',
        field: 'roasterManagerFlag',
      },
      {
        title: 'Address',
        field: 'residenceAddress.addressName',
      },

      {
        title: 'Mobile No.',
        field: 'mobileNo',
      },
      {
        title: 'Email Id',
        field: 'emailId',
      },
      {
        title: 'Status',
        field: 'status',
        render: (rowData) =>
          rowData.status == 'ACTIVE' ? (
            <span style={{color: 'green'}}>ACTIVE</span>
          ) : rowData.status == 'INACTIVE' ? (
            <span style={{color: 'red'}}>INACTIVE</span>
          ) : (
            rowData.status
          ),
      },
      {
        title: 'Email/SMS Status',
        field: 'emailStatus',
        render: (rowData) => (
          <>
            {rowData?.emailStatus == 'SENT' ? (
              <MarkEmailReadIcon style={{color: 'green', fontSize: '30px'}} />
            ) : (
              <UnsubscribeIcon style={{color: 'red', fontSize: '30px'}} />
            )}
            {rowData?.smsStatus == 'SENT' ? (
              <MarkChatReadIcon style={{color: 'green', fontSize: '30px'}} />
            ) : (
              <ChatBubbleIcon style={{color: 'red', fontSize: '30px'}} />
            )}
          </>
        ),
      },
      {
        title: 'Profile Status',
        field: 'profileStatus',
        render: (rowData) =>
          rowData.profileStatus == 'DEFAULT' ? (
            <span style={{color: 'orange'}}>Not Verified</span>
          ) : rowData.profileStatus == 'ACTIVE' ? (
            <span style={{color: 'green'}}>Verified</span>
          ) : rowData.profileStatus == 'INACTIVE' ? (
            <span style={{color: 'red'}}>Inactive</span>
          ) : (
            rowData.profileStatus
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
  useEffect(() => {
    axios
      .get(
        Api.baseUri +
          '/user-reg/general-setting/get-GeneralSetting-by-corporateId',
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          console.log('setEmailPermission', res?.data?.data);
          setEmailPermission(res?.data?.data);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  }, []);
  function handleClickView(rowData) {
    setId(rowData?._id);
    setOpenDetail(true);
  }
  function handleClickEdit(rowData) {
    setopenDialog(true);
    setdialID(rowData?._id);
  }
  function handleClickDelete(rowData) {
    setId(rowData?._id);
    handleConfirmBox();
  }
  const handleDialogForm = () => {
    setOpenForm(true);
  };
  const handleClose = () => {
    setOpenForm(false);
  };
  const handleCloseForm = (status) => {
    setOpenForm(status);
    getFilterData();
  };

  const closeDetailPage = () => {
    setOpenDetail(false);
  };
  const internalDetailPage = (status) => {
    setOpenDetail(status);
  };
  const handleClosefilter = (d) => {
    setOpenFilter(false);
  };
  const handleConfirmBox = () => {
    setOpenConfirmBox(true);
  };
  const closeConfirmBoxReactivate = (dd, reason) => {
    setOpenConfirmBoxReactivate(false);
    setId(null);
    if (dd == 'YES') {
      const baseURL = `${api.employee.list}/${id}`;
      axios.get(`${baseURL}`).then((re) => {
        let dataSet = re?.data?.data;
        dataSet.profileStatus = 'ACTIVE';
        dataSet.status = 'ACTIVE';
        dataSet.reActivationRemark = reason;
        let allElem = {};
        let tem = {};
        Object.keys(dataSet).map((key) => {
          if (typeof dataSet[key]?.[0]?.name == 'string') {
            tem = {
              ...tem,
              [key]: dataSet[key][0],
            };
          } else {
            allElem = {
              ...allElem,
              [key]: dataSet[key],
            };
          }
        });
        tem = {
          ...tem,
          data: JSON.stringify(allElem),
        };
        axios({
          method: 'put',
          url: Api?.employee?.list,
          data: getFormData(tem),
          headers: {'Content-Type': 'multipart/form-data'},
        })
          .then((res) => {
            if (res?.data?.status == '200') {
              getFilterData();
              toast.success(
                `${res?.data?.data?.employeeFullName + `'s`} profile activated`,
              );
            } else {
              toast.error('Something went wrong.');
            }
          })
          .catch((er) => {
            toast.error('Something went wrong.');
          });
      });
    }
  };
  const closeConfirmBox = (dd, reason) => {
    if (dd == 'YES') {
      axios
        .post(
          `${api.employee.list}/deactivateemployee/${id}/${
            reason?.length ? reason : null
          }`,
        )
        .then((response) => {
          if (response?.data?.status == '200') {
            getFilterData();
            toast.success(
              `${
                response?.data?.data?.employeeFullName + `'s`
              } profile deactivated`,
            );
            setOpenConfirmBox(false);
          }
        })
        .catch((err) => {});
    }
    if (dd == 'NO') {
      setOpenConfirmBox(false);
    }
  };
  return (
    <>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={12} sm={3} md={3} sx={{mb: 2}}>
          <CustomLabel labelVal='Employees' variantVal='h3-underline' />
        </Grid>
        <Grid item xs={12} sm={3} md={3.5}>
          <QuickSearchPage
            masterKey='emailId'
            module={'EmployeeReg'}
            searchClicked={true}
            searchUrl={'/employee-reg/filter'}
            // masterFields={['empCode', 'emailId', 'firstName']}
            filterRes={filterRes}
            getFilterData={getFilterData}
            setFilterRes={setFilterRes}
          />
        </Grid>
        <Grid item xs={12} sm={9} md={5.5} sx={{paddingTop: '0px !important'}}>
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
                    setFilterRes(null);
                    setfilterShow(false);
                    setFilter({});
                    handleClosefilter({button: 'clear'});
                  }}
                  className='title-icons-mui'
                />
              </AppTooltip>
              {myActions?.includes('Create') && (
                <AppTooltip placement={'top'} title={'Add New Employee'}>
                  <img
                    src='/assets/images/title-icon/add employee.svg'
                    className='title-icons-mui'
                    onClick={handleDialogForm}
                  />
                </AppTooltip>
              )}
              <AppTooltip placement={'top'} title={'Profile Update Requests'}>
                <div style={{display: 'flex'}}>
                  <img
                    src='/assets/images/title-icon/profile-change.svg'
                    className='title-icons-mui'
                    onClick={(e) => {
                      navigate('/onboardCorporate/employee/pending-list');
                    }}
                  />
                  <p className='pending-count'>{pendingCount}</p>
                </div>
              </AppTooltip>
            </div>
            <div style={{display: 'flex'}}>
              {emailPermission?.alertEmployeeToCreateProfileByCorporate ==
                'YES' && (
                <AppTooltip placement={'top'} title={'Email'}>
                  <div style={{display: 'flex'}}>
                    <EmailIcon
                      className='title-icons-mui'
                      // onClick={handleTooltipClick}
                      style={{color: isEmailSwitchOn ? '#ff9800' : ''}}
                      onClick={() => {
                        handleChangeEmailSwitch('EMAIL');
                      }}
                    />
                  </div>
                </AppTooltip>
              )}
              {emailPermission?.alertEmployeeToCreateProfileByCorporateSMS ==
                'YES' && (
                <AppTooltip placement={'top'} title={'SMS'}>
                  <div style={{display: 'flex'}}>
                    <MessageIcon
                      className='title-icons-mui'
                      // onClick={handleTooltipClick}
                      style={{color: isAnotherSwitchOn ? '#ff9800' : ''}}
                      onClick={() => {
                        handleChangeAnotherSwitch('SMS');
                      }}
                    />
                  </div>
                </AppTooltip>
              )}
            </div>

            {myActions?.includes('Download And Upload') && (
              <ExcelContainer
                downloadFile={'Employee'}
                downloadURL={'/user-reg/employee-reg/download'}
                getHeadersUrl={'/user-reg/employee-reg/headerdata'}
                downloadTempURL={'/user-reg/employee-reg/download-template'}
                uploadURL={'/user-reg/employee-reg/import-excel'}
              />
            )}
          </Box>
        </Grid>
      </Grid>

      <div className='page-header-second-content'></div>
      {openDialog && dialID && (
        <EmpolyeeEditForm
          openDialog={openDialog}
          id={dialID}
          popBTNClick={popBTNClick}
          domain={domain}
        />
      )}
      {selectedRows?.length > 0 && (
        <Button
          variant='contained'
          color='primary'
          onClick={handleTooltipClick}
          style={{position: 'fixed', top: 378, right: 50, zIndex: 1000}}
        >
          Send
        </Button>
      )}
      {!filterRes ? (
        <>
          {
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
              title='Onboard Tenants List'
              columns={
                user?.userList?.userRole == 'CORPORATEADMIN'
                  ? tableTemplateCorporate.columns
                  : tableTemplateSuperAdmin.columns
              }
              tableRef={tableRef}
              data={(query) =>
                new Promise((resolve, reject) => {
                  let url_ = Api.baseUri + '/api/dashboard/employee/filter',
                    body =
                      !filter || _.isEmpty(filter)
                        ? {
                            collection: 'EmployeeReg',
                            pageSize: query.pageSize,
                            pageNo: query.page + 1,
                          }
                        : {
                            collection: 'EmployeeReg',
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
                      resolve({
                        data: result?.data?.data ?? [],
                        page: (result?.data?.currentPage || 0) - 1,
                        totalCount: result?.data?.totalItems ?? 0,
                      });
                    })
                    .catch((err) => {
                      console.log('err', err);
                      resolve({
                        data: [],
                        page: 0,
                        totalCount: 0,
                      });
                    });
                })
              }
              // defaultSort={'desc'}
              options={{
                sorting: true,
                search: false,
                selection: isEmailSwitchOn || isAnotherSwitchOn ? true : false,
                showTitle: false,
                actionsColumnIndex: -1,
                headerStyle: {position: 'sticky', top: 0},
                pageSize: pageSize,
                pageSizeOptions: [10, 25, 50],
              }}
              onChangeRowsPerPage={(pageSize) => {
                console.log('onChangeRowsPerPage:', pageSize);
                setPageSize(pageSize);
              }}
              onSelectionChange={(rows) => {
                handleSelectionChange(rows);
                console.log('rows', rows);
              }}
              actions={[
                (rd) =>
                  myActions?.includes('Edit') && {
                    icon: () => (
                      <EditIcon
                        color='primary'
                        style={{opacity: rd?.status == 'INACTIVE' ? '0.2' : ''}}
                      />
                    ),
                    tooltip: 'edit',
                    onClick: (event, rowData) => {
                      if (rowData?.status == 'INACTIVE') return;
                      handleClickEdit(rowData);
                    },
                  },
                myActions?.includes('View') && {
                  icon: () => <VisibilityIcon color='primary' />,
                  tooltip: 'view',
                  onClick: (event, rowData) => handleClickView(rowData),
                },
                (rd) =>
                  myActions?.includes('Deactivate') && {
                    icon: () => (
                      <DeleteIcon
                        color='primary'
                        style={{
                          opacity: rd?.status == 'INACTIVE' ? '0.2' : '',
                          color: '#bc0805',
                        }}
                      />
                    ),
                    tooltip: 'Deactivate',
                    onClick: (event, rowData) => {
                      if (rowData?.status == 'INACTIVE') return;
                      handleClickDelete(rowData);
                    },
                  },
                (rd) =>
                  myActions?.includes('Edit') && {
                    icon: () => (
                      <RestoreIcon
                        color='primary'
                        style={{opacity: rd?.status == 'INACTIVE' ? '' : '0.2'}}
                      />
                    ),
                    tooltip: 'Reactivate',
                    onClick: (event, rowData) => {
                      console.log(rowData);
                      if (rowData?.status == 'INACTIVE') {
                        setId(rowData?._id);
                        setOpenConfirmBoxReactivate(true);
                      }
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
          }
        </>
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
          title='Onboard Tenants List'
          columns={
            user?.userList?.userRole == 'CORPORATEADMIN'
              ? tableTemplateCorporate.columns
              : tableTemplateSuperAdmin.columns
          }
          data={filterRes}
          // defaultSort={'desc'}
          options={{
            sorting: true,
            search: false,
            selection: isEmailSwitchOn || isAnotherSwitchOn ? true : false,
            showTitle: false,
            actionsColumnIndex: -1,
            headerStyle: {position: 'sticky', top: 0},
          }}
          onSelectionChange={(rows) => {
            handleSelectionChange(rows);
          }}
          actions={[
            (rd) =>
              myActions?.includes('Edit') && {
                icon: () => (
                  <EditIcon
                    color='primary'
                    style={{opacity: rd?.status == 'INACTIVE' ? '0.2' : ''}}
                  />
                ),
                tooltip: 'edit',
                onClick: (event, rowData) => {
                  if (rowData?.status == 'INACTIVE') return;
                  handleClickEdit(rowData);
                },
              },
            myActions?.includes('View') && {
              icon: () => <VisibilityIcon color='primary' />,
              tooltip: 'view',
              onClick: (event, rowData) => handleClickView(rowData),
            },
            (rd) =>
              myActions?.includes('Deactivate') && {
                icon: () => (
                  <DeleteIcon
                    color='primary'
                    style={{
                      opacity: rd?.status == 'INACTIVE' ? '0.2' : '',
                      color: '#bc0805',
                    }}
                  />
                ),
                tooltip: 'Deactivate',
                onClick: (event, rowData) => {
                  if (rowData?.status == 'INACTIVE') return;
                  handleClickDelete(rowData);
                },
              },
            (rd) =>
              myActions?.includes('Edit') && {
                icon: () => (
                  <RestoreIcon
                    color='primary'
                    style={{opacity: rd?.status == 'INACTIVE' ? '' : '0.2'}}
                  />
                ),
                tooltip: 'Reactivate',
                onClick: (event, rowData) => {
                  console.log(rowData);
                  if (rowData?.status == 'INACTIVE') {
                    setId(rowData?._id);
                    setOpenConfirmBoxReactivate(true);
                  }
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

      <Dialog
        // onClose={handleClose}
        open={openform}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '80%',
          },
        }}
        style={{borderRadius: '4rem'}}
        // aria-labelledby="alert-dialog-title"
        // aria-describedby="alert-dialog-description"
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
                width: '80%',
                position: 'fixed',
                zIndex: '9',
                borderRadius: '5px 5px 0px 0px',
              }}
            >
              <h1 style={{marginTop: '1.5rem'}}>Register Employee</h1>
              <CloseIcon
                onClick={handleClose}
                style={{
                  marginTop: '1.4rem',
                  color: '#4f4f4f',
                  fontWeight: 'bold',
                }}
              />
            </div>

            <div style={{padding: '1rem', paddingTop: '5rem'}}>
              <EmpolyeeForm close={handleCloseForm} domain={domain} />
            </div>
          </DialogContent>
        </div>
      </Dialog>
      <Dialog
        // onClose={closeDetailPage}
        open={openDetail}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '80%',
          },
        }}
        style={{borderRadius: '4rem'}}
        // aria-labelledby="alert-dialog-title"
        // aria-describedby="alert-dialog-description"
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
                width: '80%',
                zIndex: '9',
                borderRadius: '5px 5px 0px 0px',
              }}
            >
              <h1 style={{marginTop: '1.5rem'}}>Employee Details</h1>
              <CloseIcon
                onClick={closeDetailPage}
                style={{
                  marginTop: '1.4rem',
                  color: '#4f4f4f',
                  fontWeight: 'bold',
                }}
              />
            </div>
            <div style={{padding: '1rem', marginTop: '2.5rem'}}>
              <DetailForm
                profileDPfunc={profileDPfunc}
                internalDetailPage={internalDetailPage}
                id={id}
              />
            </div>
          </DialogContent>
        </div>
      </Dialog>
      {/* const FilterPop = ({open, handleClose, cnfMsg, header, template, title}) => { */}
      {/* <FilterPop open={openFilter}
        handleClose={handleClosefilter}
        title={"Employee Filter"}
        template={templateFilter}
        cnfMsg={'cnfMsg'}
        filter={filter}
        header={"My Header"} /> */}
      {filterShow && (
        <SmartFilter
          open={openFilter}
          title={'Employee Filter'}
          handleClose={handleClosefilter}
          filter={filter}
          fieldList={fieldList}
          setFilter={setFilter}
        />
      )}
      <Confirm
        open={openConfirmbox}
        header={'Confirm to Deactivate'}
        cnfMsg={'Are you sure, You want to deactivate the employee?'}
        handleClose={closeConfirmBox}
        reason={true}
      />
      <Confirm
        open={openConfirmboxReactivate}
        header={'Confirm to Reactivate'}
        cnfMsg={'Are you sure, You want to reactivate the employee?'}
        handleClose={closeConfirmBoxReactivate}
        reason={true}
      />
    </>
  );
};

export default List;
