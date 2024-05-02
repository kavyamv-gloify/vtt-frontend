import React, {useEffect, useState} from 'react';
import SmartTable from '@smart-table';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RestoreIcon from '@mui/icons-material/Restore';
import EditIcon from '@mui/icons-material/Edit';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import _ from 'lodash';
import Api from '@api';
import {useAuthUser} from '@crema/utility/AuthHooks';
import DeleteIcon from '@mui/icons-material/Delete';
import {Button} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {toast} from 'react-toastify';
import RegisterVendor from '../RegisterVendor/index';
import CloseIcon from '@mui/icons-material/Close';
import DetailForm from '../VendorDetailPage/index';
import EditForm from '../EditVendor/index';
import SmartForm from '@smart-form';
import Confirm from '@confirmation-box';
import {Divider} from '@mui/material';
import CustomLabel from 'pages/common/CustomLabel';
import ExcelContainer from '@excelupload';
import regex from '@regex';
import Grid from '@mui/material/Grid';
import AppTooltip from '@crema/core/AppTooltip';
import {Box} from '@mui/material';
import {useSelector} from 'react-redux';
import QuickSearchPage from '@quick-search';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import SmartFilter from '@smart-filter';
import moment from 'moment';
import EmailIcon from '@mui/icons-material/Email';
import MessageIcon from '@mui/icons-material/Message';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import UnsubscribeIcon from '@mui/icons-material/Unsubscribe';
import AssociateDriver from '../AssociateDriver';
import AssociateVehicle from '../AssociateVehicle';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import MarkChatReadIcon from '@mui/icons-material/MarkChatRead';
const fieldList = [
  {title: 'Vendor Name', value: 'vendorName'},
  {title: 'Vendor Code', value: 'vendorCode'},
  {title: 'Email Id', value: 'emailId'},

  {title: 'Mob No', value: 'mobileNo'},
  {title: 'Email Status', value: 'emailStatus'},
  {title: 'SMS Status', value: 'smsStatus'},
  {title: 'Vendor Service', value: 'vendorType'},
  {title: 'Status', value: 'status'},
  {title: 'Profile Status', value: 'profileStatus'},
];

const List = () => {
  const {type} = useParams();
  const {user} = useAuthUser();
  const [thisObj, setThisObj] = useState(null);
  const [filter, setFilter] = useState({});
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const [myActions, setMyActions] = useState([]);
  const [emailPermission, setEmailPermission] = useState();
  const permissionCheck = useSelector(({settings}) => settings.permissions);
  useEffect(() => {
    if (!permissionCheck) return;
    let sub_mod = {};
    permissionCheck?.map((el) => {
      if (el.subModuleName == 'Vendors') sub_mod = el;
    });
    setMyActions(sub_mod?.actions);
    if (
      (!sub_mod || !sub_mod?.actions?.includes('View')) &&
      user?.userList?.userRole !== 'SUPERADMIN'
    )
      navigate('/error-pages/error-404');
  }, [permissionCheck, user]);
  // const tableRef = React.useRef();

  const [openform, setopenform] = useState(false);
  const tenants = user?.userList?.tanentId;
  const [id, setId] = useState();
  const [openDialog, setopenDialog] = useState(false);
  const [dialID, setdialID] = useState();
  const [openDetail, setOpenDetail] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [openConfirmbox, setOpenConfirmBox] = useState(false);
  const [openAssociate, setOpenAssociate] = useState(false);
  const [vendorData, setVendorData] = useState({});
  const [showbtn, setshowbtn] = useState();
  const [vendorList, setVendorList] = useState([]);
  const [searchClicked, setsearchClicked] = useState(false);
  const [filterRes, setFilterRes] = useState(null);
  const [filterShow, setfilterShow] = useState(false);
  const [pendingCount, setPendingCount] = useState();
  const [openConfirmboxReactivate, setOpenConfirmBoxReactivate] =
    useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedMode, setSelectedMode] = useState('');
  const [isEmailSwitchOn, setEmailSwitchOn] = useState(false);
  const [isAnotherSwitchOn, setAnotherSwitchOn] = useState(false);
  const [openDriverAssociate, setOpenDriverAssociate] = useState(false);
  const [openVehicleAssociate, setOpenVehicleAssociate] = useState(false);
  useEffect(() => {
    getFilterData();
  }, [filter]);
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
      name: row.vendorName,
      emailid: row.emailId,
      mobileNo: row?.mobileNo,
    }));
    setSelectedRows(selectedData);
  };

  useEffect(() => {
    console.log('selectedRows', selectedRows);
  }, [selectedRows]);
  const handleTooltipClick = async () => {
    try {
      let apiEndpoint = '';
      let payload = {};
      if (selectedMode == 'EMAIL') {
        // apiEndpoint = '/usernotify/email/sendMailForProfileCreationForVendor';
        apiEndpoint = '/user-reg/vendor-reg/sendMailForProfileCreationVendor';
        payload = selectedRows.map(({name, emailid}) => ({name, emailid}));
      } else if (selectedMode == 'SMS') {
        apiEndpoint = '/user-reg/vendor-reg/sendSmsForProfileCreationVendor';
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
      } else {
        toast.error('Failed to send request.');
      }
    } catch (error) {
      toast.error('Error sending request.');
    }
  };

  const closeConfirmBoxReactivate = (dd, reason) => {
    setOpenConfirmBoxReactivate(false);
    setId(null);
    if (dd == 'YES') {
      axios
        .post(
          Api.baseUri +
            `/user-reg/vendor-reg/activateVendor/${id}/${
              reason?.length ? reason : null
            }`,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success(
              `${res?.data?.data?.vendorName}'s profile reactivated`,
            );
            // toast.success('Vendor reactivated successfully');
            getFilterData();
          }
        });
    }
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
  const getFilterData = () => {
    let url_ = Api.baseUri + '/api/dashboard/employee/filter';
    let post_ = {
      collection: 'AssociateVendor',
      filterType: 'filter',
      filters: filter,
      pageNo: 1,
      pageSize: 1000,
    };
    let def_post = {
      collection: 'AssociateVendor',
      pageNo: 1,
      pageSize: 1000,
    };
    axios
      .post(url_, !filter || _.isEmpty(filter) ? def_post : post_)
      .then((re_) => {
        setFilterRes(re_?.data?.data);
      })
      .catch((err) => {
        setFilterRes([]);
      });
  };
  function SecretFun(search, value) {
    if (search?.toUpperCase() == 'SEARCH') {
      searchVendor(value);
    } else return;
  }

  function popBTNClick(val) {
    // getVendorList();
    // setTimeout(() => {
    //   tableRef.current && tableRef.current.onQueryChange()
    // }, 0);
    getFilterData();
    if (!val) {
      setopenDialog(false);
    }
  }
  const searchVendor = (val) => {
    if (!val?.vendorId) {
      return;
    }
    let mob = null;
    let email = null;
    if (isNaN(Number(val?.vendorId))) {
      email = val?.vendorId;
    } else {
      mob = val?.vendorId;
    }
    axios
      .get(
        `${Api.baseUri}/user-reg/associatevendor/search-associate?emailId=${email}&mobileNo=${mob}&corporateId=null`,
      )
      .then((re) => {
        if (!re?.data?.data?.id) toast.error('No record found.');
        let tem_bool = true;

        re?.data?.data?.id &&
          vendorList?.length &&
          vendorList?.map((ell) => {
            if (re?.data?.data?.id == ell?.id) {
              toast.error('Already exists.');
              tem_bool = false;
            }
          }); //vendorList
        if (tem_bool) setVendorData({...re?.data?.data});
      })
      .catch((err) => {
        setVendorData({});
      });
  };

  useEffect(() => {
    axios
      .get(
        Api.baseUri +
          '/user-reg/vendor-change/' +
          user?.userList?.tanentId +
          '/tanent/PENDING/status',
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          setPendingCount(res?.data?.data?.length);
        }
      })
      .catch((err) => {});
  }, [user?.userList?.tanentId]);

  const handleDialog = (val) => {
    setshowbtn(false);
    if (!vendorData?.id) {
      toast.error('Please Enter Email or Mobile No.');
      setTimeout(() => {
        setshowbtn(true);
      }, 1000);
      return;
    }
    if (val?.button == 'Add') {
      axios
        .post(
          Api.baseUri +
            `/user-reg/associatevendor/saveassociatevendor/${user?.userList?.corporateId}/corporate/${vendorData?.id}/vendorId`,
        )
        .then((res) => {
          toast.success(res?.data?.message);
          setOpenAssociate(false);
          getFilterData();
          // setTimeout(() => {
          //   tableRef.current && tableRef.current.onQueryChange()
          // }, 0);
        })
        .catch((err) => {
          setOpenAssociate(false);
          toast.error('Something went wrong.');
        });
    }
  };
  const tableTemplate = {
    columns: [
      {
        title: 'Vendor Name',
        field: 'vendorName',
      },
      {
        title: 'Vendor Service Area',
        field: 'vendorType',
      },
      {
        title: 'Vendor Code',
        field: 'vendorCode',
      },
      {
        title: 'Address',
        field: 'address.addressName',
        render: (rowData) => rowData?.address?.addressName?.split('++')[0],
      },
      {
        title: 'Mobile',
        field: 'mobileNo',
      },
      {
        title: 'PAN',
        field: 'companyPAN',
      },

      {
        title: 'Email',
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
            {rowData.emailStatus == 'SENT' ? (
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
        title: 'Last Updated ',
        field: 'updateOn',
        type: 'datetime',
      },
    ],
  };

  let templateAssociate = {
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
            type: 'section',
            layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
            fields: [
              {
                type: 'text',
                name: 'vendorId',
                id: 'vendorId',
                title: 'Vendor Email Id/Mobile No',
                field: 'vendorId',
                pattern: {
                  value: regex.phoneORemailReg,
                  message: 'Please enter valid Time',
                },
              },
              {
                type: 'button',
                name: 'searchVendor',
                id: 'searchVendor',
                title: 'Search',
              },
            ],
          },
          {
            type: 'section',
            layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
            fields: [
              {
                type: 'text',
                name: 'vendorName',
                id: 'vendorName',
                title: 'Vendor Name',
                disabled: true,
                field: 'vendorName',
              },
              {
                type: 'text',
                name: 'vendorCode',
                id: 'vendorCode',
                disabled: true,
                title: 'Vendor Code',
                field: 'vendor Code',
                // validationProps: {
                //   required: 'This is a mandatory field',
                // },
              },
            ],
          },
        ],
      },
    ],
  };

  function handleClickEdit(rowData) {
    setopenDialog(true);
    setdialID(rowData?.vendorId);
  }

  function handleClickView(rowData) {
    setId(rowData?.vendorId);
    setOpenDetail(true);
  }

  function handleClickDelete(rowData) {
    setId(rowData.vendorId);
    handleConfirmBox();
    setThisObj(rowData);
  }

  function handleOpenform() {
    setopenform(true);
  }

  function handlecloseform() {
    setopenform(false);
  }

  function closeform(status) {
    setopenform(status);
    getFilterData();
    // getVendorList();
    // window.location.reload();
  }

  function handlecloseDetail() {
    setOpenDetail(false);
  }

  function internalDetail() {
    setOpenDetail(false);
  }

  const handleClose = () => {
    setOpen(false);
  };

  function handleSubmit() {
    let rowData = thisObj;
    axios
      .put(`${Api.vendor.list}/${rowData.vendorId}/disable`)
      .then((resolve) => {
        if (resolve?.data?.status == '200') {
          toast.success(
            resolve?.data?.message ?? 'Vendor deactivate successfully',
          );
        } else {
          toast.error(resolve?.data?.message ?? 'Something went wrong.');
        }
      })
      .catch((err) => {
        toast.error('Something went wrong.');
      });
    setOpen(false);
  }

  const handleClosefilter = (d) => {
    setOpenFilter(false);
  };

  const handleConfirmBox = () => {
    setOpenConfirmBox(true);
  };

  const closeConfirmBox = (dd, reason) => {
    if (dd == 'YES') {
      axios
        .post(
          `${Api.vendor.list}/deactivatevendor/${id}/${
            reason?.length ? reason : null
          }`,
        )
        .then((response) => {
          if (response?.data?.status == '200') {
            toast.success(
              `${response?.data?.data?.vendorName}'s profile deactivated`,
            );
            getFilterData();
            setOpenConfirmBox(false);
          } else {
            toast.error(response?.data?.message || 'Something went wrong.');
          }
        })
        .catch((err) => {
          toast.success('Something went wrong.');
        });
    } else {
      setOpenConfirmBox(false);
    }
  };
  useEffect(() => {
    console.log('openDriver', openDriverAssociate);
  }, [openDriverAssociate]);
  return (
    <>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={12} sm={3} md={4} sx={{mb: 2}}>
          <CustomLabel labelVal='Vendors' variantVal='h3-underline' />
        </Grid>
        <Grid item xs={12} sm={3} md={4}>
          <QuickSearchPage
            masterKey='vendorName'
            module={'AssociateVendor'}
            searchClicked={true}
            searchUrl={'/employee-reg/filter'}
            // masterFields={['vendorCode', 'vendorName']}
            displayFields={['vendorName']}
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
              {myActions?.includes('Create') && type == 'Def' && (
                <AppTooltip placement={'top'} title={'Add New Vendor'}>
                  <img
                    src='/assets/images/title-icon/add-vendor.svg'
                    className='title-icons-mui'
                    onClick={handleOpenform}
                  />
                </AppTooltip>
              )}
              {user?.role == 'SUPERADMIN' && (
                <AppTooltip placement={'top'} title={'Associate New Vendor'}>
                  <img
                    src='/assets/images/title-icon/associate-vendor.svg'
                    className='title-icons-mui'
                    onClick={() => {
                      setOpenAssociate(true);
                    }}
                  />
                </AppTooltip>
              )}
              {user?.role !== 'SUPERADMIN' && type == 'Def' && (
                <AppTooltip placement={'top'} title={'Profile Update Requests'}>
                  <div style={{display: 'flex'}}>
                    <img
                      src='/assets/images/title-icon/profile-change.svg'
                      className='title-icons-mui'
                      onClick={(e) => {
                        navigate('/onboardadmin/pending-vendor/vendor-listing');
                      }}
                    />
                    <span className='pending-count'>{pendingCount}</span>
                  </div>
                </AppTooltip>
              )}
            </div>
            {emailPermission?.alertVendorToCreateProfileByCorporate ==
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
            {emailPermission?.alertVendorToCreateProfileByCorporateSMS ==
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

            {myActions?.includes('Download And Upload') && type == 'Def' && (
              <ExcelContainer
                downloadFile={'Vendor'}
                downloadURL={'/user-reg/vendor-reg/download'}
                getHeadersUrl={'/user-reg/vendor-reg/headerdata'}
                downloadTempURL={'/user-reg/vendor-reg/download-template'}
                uploadURL={'/user-reg/vendor-reg/import-excel'}
              />
            )}
          </Box>
        </Grid>
      </Grid>

      <CustomLabel labelVal='Vendor List' variantVal='h3-underline' />
      <div style={{marginTop: '-30px'}}></div>
      {openDialog && dialID && (
        <EditForm
          openDialog={openDialog}
          id={dialID}
          popBTNClick={popBTNClick}
        />
      )}

      <Divider light className='mb-4' />
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
        columns={tableTemplate.columns}
        data={filterRes || []}
        options={{
          search: false,
          showTitle: false,
          selection: isEmailSwitchOn || isAnotherSwitchOn ? true : false,
          actionsColumnIndex: -1,
          headerStyle: {position: 'sticky', top: 0},
        }}
        onSelectionChange={(rows) => {
          handleSelectionChange(rows);
          console.log('rows', rows);
        }}
        actions={
          type !== 'associate-to-vendor'
            ? [
                (rd) => ({
                  icon: () => (
                    <EditIcon
                      color='primary'
                      style={{opacity: rd.status == 'INACTIVE' ? '0.3' : ''}}
                    />
                  ),
                  tooltip: 'Edit',
                  onClick: (event, rowData) => {
                    if (rowData?.status == 'INACTIVE') {
                      return;
                    }
                    handleClickEdit(rowData);
                  },
                }),
                {
                  icon: () => <VisibilityIcon color='primary' />,
                  tooltip: 'View',
                  onClick: (event, rowData) => handleClickView(rowData),
                },
                (rd) => ({
                  icon: () => (
                    <DeleteIcon
                      style={{
                        color: '#CC0000',
                        opacity: rd?.status == 'INACTIVE' ? '0.3' : '',
                      }}
                    />
                  ),
                  tooltip: 'Deactivate',
                  onClick: (event, rowData) => {
                    if (rowData.status == 'ACTIVE') handleClickDelete(rowData);
                  },
                }),
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
                      if (rowData?.status == 'INACTIVE') {
                        setId(rowData?.vendorId);

                        setOpenConfirmBoxReactivate(true);
                      }
                    },
                  },
              ]
            : [
                (rd) => ({
                  icon: () => (
                    <img
                      src={'/assets/images/Drivers.svg'}
                      style={{width: '20px', height: '20px'}}
                    />
                    // <RestoreIcon
                    //   color='primary'
                    //   style={{opacity: rd?.status == 'INACTIVE' ? '' : '0.2'}}
                    // />
                  ),
                  tooltip: 'associate-driver',
                  onClick: (event, rowData) => {
                    if (rowData?.status == 'INACTIVE') {
                      return;
                    }
                    setId(rowData?.vendorId);
                    setOpenDriverAssociate(true);
                  },
                }),
                (rd) => ({
                  icon: () => (
                    <img
                      src={'/assets/images/Vehicle.svg'}
                      style={{width: '20px', height: '20px'}}
                    />
                  ),
                  tooltip: 'associate-vendor',
                  onClick: (event, rowData) => {
                    if (rowData?.status == 'INACTIVE') {
                      return;
                    }
                    setId(rowData?.vendorId);
                    setOpenVehicleAssociate(true);
                  },
                }),
              ]
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
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          {'Confirm to Deactivate'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Are you sure, You want to deactivate the vendor?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button id='btnMui123' onClick={handleClose}>
            Disagree
          </Button>
          <Button id='btnMui123' onClick={handleSubmit} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openform}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '80%',
          },
        }}
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
              <h1 style={{marginTop: '1.5rem'}}>Register Vendor</h1>
              <CloseIcon
                onClick={handlecloseform}
                style={{
                  marginTop: '1.4rem',
                  color: '#4f4f4f',
                  fontWeight: 'bold',
                }}
              />
            </div>
            <div style={{padding: '1rem', marginTop: '60px'}}>
              <RegisterVendor close={closeform} />
            </div>
          </DialogContent>
        </div>
      </Dialog>
      <Dialog
        open={openDetail}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '80%',
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
                width: '80%',
                zIndex: '9',
                borderRadius: '5px 5px 0px 0px',
              }}
            >
              <h1 style={{marginTop: '1.5rem'}}>Vendor Details</h1>
              <CloseIcon
                onClick={handlecloseDetail}
                style={{
                  marginTop: '1.4rem',
                  color: '#4f4f4f',
                  fontWeight: 'bold',
                }}
              />
            </div>
            <div style={{padding: '1rem', marginTop: '60px'}}>
              <DetailForm close={internalDetail} id={id} />
            </div>
          </DialogContent>
        </div>
      </Dialog>
      {filterShow && (
        <SmartFilter
          open={openFilter}
          title={'Vendor Filter'}
          handleClose={handleClosefilter}
          filter={filter}
          fieldList={fieldList}
          setFilter={setFilter}
        />
      )}
      {/* <FilterPop open={openFilter} handleClose={handleClosefilter} title={"Vendor Filter"} template={templateFilter} cnfMsg={'cnfMsg'} header={"My Header"} /> */}
      <Confirm
        open={openConfirmbox}
        header={'Confirm to Deactivate'}
        cnfMsg={'Are you sure, You want to deactivate the vendor?'}
        handleClose={closeConfirmBox}
        reason={true}
      />
      <Confirm
        open={openConfirmboxReactivate}
        header={'Confirm to Reactivate'}
        cnfMsg={'Are you sure, You want to reactivate the vendor?'}
        handleClose={closeConfirmBoxReactivate}
        reason={true}
      />
      {openAssociate ? (
        <>
          <Dialog
            onClose={() => {
              setOpenAssociate(false);
            }}
            open={true}
            maxWidth='false'
            PaperProps={{sx: {width: '40%'}}}
          >
            <DialogTitle
              id='alert-dialog-title'
              style={{
                background: '#f5f2f2',
                fontSize: '24px',
                padding: '11px 0px 0px 20px',
              }}
            >
              {/* {'Associate New Vendor'} */}
              {'Associate Driver and Vehicle to Vendor'}
              <CloseIcon
                style={{
                  position: 'absolute',
                  right: '12px',
                  cursor: 'pointer',
                  top: '14px',
                }}
                onClick={() => {
                  setOpenAssociate(false);
                }}
              />
            </DialogTitle>
            <DialogContent style={{padding: '5px 24px 13px'}}>
              <SmartForm
                template={templateAssociate}
                setVal={[
                  {name: 'vendorCode', value: vendorData?.vendorCode ?? 'NA'},
                  {name: 'vendorName', value: vendorData?.vendorName ?? 'NA'},
                ]}
                showbtn={showbtn}
                SecretFun={SecretFun}
                onSubmit={handleDialog}
                buttons={['Add']}
              />
            </DialogContent>
          </Dialog>
        </>
      ) : null}

      {openDriverAssociate ? (
        <>
          <Dialog
            onClose={() => {
              setOpenDriverAssociate(false);
            }}
            open={openDriverAssociate}
            maxWidth='false'
            PaperProps={{sx: {width: '50%'}}}
          >
            <DialogTitle
              id='alert-dialog-title'
              style={{
                background: '#f5f2f2',
                fontSize: '24px',
                padding: '11px 0px 0px 20px',
              }}
            >
              {'Associate New Driver'}
              <CloseIcon
                style={{
                  position: 'absolute',
                  right: '12px',
                  cursor: 'pointer',
                  top: '14px',
                }}
                onClick={() => {
                  setOpenDriverAssociate(false);
                }}
              />
            </DialogTitle>
            <DialogContent style={{padding: '5px 24px 13px'}}>
              <AssociateDriver id={id} />
            </DialogContent>
          </Dialog>
        </>
      ) : null}

      {openVehicleAssociate ? (
        <>
          <Dialog
            onClose={() => {
              setOpenVehicleAssociate(false);
            }}
            open={openVehicleAssociate}
            maxWidth='false'
            PaperProps={{sx: {width: '50%'}}}
          >
            <DialogTitle
              id='alert-dialog-title'
              style={{
                background: '#f5f2f2',
                fontSize: '24px',
                padding: '11px 0px 0px 20px',
              }}
            >
              {'Associate New Vehicle'}
              <CloseIcon
                style={{
                  position: 'absolute',
                  right: '12px',
                  cursor: 'pointer',
                  top: '14px',
                }}
                onClick={() => {
                  setOpenVehicleAssociate(false);
                }}
              />
            </DialogTitle>
            <DialogContent style={{padding: '5px 24px 13px'}}>
              <AssociateVehicle id={id} />
            </DialogContent>
          </Dialog>
        </>
      ) : null}
    </>
  );
};

export default List;
