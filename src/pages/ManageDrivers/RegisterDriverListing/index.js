import React, {useEffect, useState} from 'react';
import SmartTable from '@smart-table';
import Avatar from '@mui/material/Avatar';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import RestoreIcon from '@mui/icons-material/Restore';
import api from '@api';
import SmartForm from '@smart-form';
import {Divider} from '@mui/material';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {Button} from '@mui/material';
import EditForm from '../EditDrivers';
import RegisterDriver from '../RegisterDriver/index';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import DialogTitle from '@mui/material/DialogTitle';
import DetailForm from '../DriverListingDetailPage';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterPop from '@filter-pop';
import CustomLabel from 'pages/common/CustomLabel';
import ExcelContainer from '@excelupload';
import Confirm from '@confirmation-box';
import Grid from '@mui/material/Grid';
import AppTooltip from '@crema/core/AppTooltip';
import {Box} from '@mui/material';
import _ from 'lodash';
import regex from '@regex';
import {useSelector} from 'react-redux';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import QuickSearchPage from '@quick-search';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import SmartFilter from '@smart-filter';
import Api from '@api';
import moment from 'moment';
import {toast} from 'react-toastify';
import EmailIcon from '@mui/icons-material/Email';
import MessageIcon from '@mui/icons-material/Message';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import UnsubscribeIcon from '@mui/icons-material/Unsubscribe';
import AddchartIcon from '@mui/icons-material/Addchart';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import {useParams} from 'react-router-dom';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import MarkChatReadIcon from '@mui/icons-material/MarkChatRead';
import DriverAssociation from 'pages/Association/DriverAssociation';

const List = () => {
  const {user} = useAuthUser();
  const [filter, setFilter] = useState({});
  const [openDialog, setopenDialog] = useState(false);
  const [dialID, setdialID] = useState();
  const tableRef = React.useRef();
  const navigate = useNavigate();
  const [myActions, setMyActions] = useState([]);
  const {type} = useParams();
  console.log('params', type);
  const [searchClicked, setsearchClicked] = useState(false);
  const permissionCheck = useSelector(({settings}) => settings.permissions);



  useEffect(() => {
    if (!permissionCheck) return;
    let sub_mod = {};
    permissionCheck?.map((el) => {
      if (el.subModuleName == 'Drivers') sub_mod = el;
    });
    setMyActions(sub_mod?.actions);
    if (
      (!sub_mod || !sub_mod?.actions?.includes('View')) &&
      user?.userList?.userRole !== 'SUPERADMIN'
    )
      navigate('/error-pages/error-404');
  }, [permissionCheck, user]);

  const [showbtn, setshowbtn] = useState(true);
  const [openform, setOpenForm] = useState();
  const [openDetail, setOpenDetail] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [id, setId] = useState();
  const [driverList, setdriverList] = useState([]);
  const [formData, setformData] = useState({});
  const [openConfirmbox, setOpenConfirmBox] = useState(false);
  const [openConfirmboxReactivate, setOpenConfirmBoxReactivate] =
    useState(false);
  const tanents = user?.userList?.tanentId;
  const vendorId = user?.userList?.tanentId;
  const [filterRes, setFilterRes] = useState(null);
  const [filterShow, setfilterShow] = useState(false);
  const [pendingCount, setPendingCount] = useState();
  const [counts, setCounts] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedMode, setSelectedMode] = useState('');
  const [isEmailSwitchOn, setEmailSwitchOn] = useState(false);
  const [isAnotherSwitchOn, setAnotherSwitchOn] = useState(false);
  const [emailPermission, setEmailPermission] = useState();
  const [pageSize, setPageSize] = useState(10);
  const [openAssociate, setOpenAssociate] = useState(false);
  const [openUnassociate, setOpenUnassociate] = useState(false);
  const [driverData, setDriverData] = useState({});
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
  const fieldList = [
    {title: 'First Name', value: 'firstName'},
    {title: 'Last Name', value: 'lastName'},
    {title: 'Email Id', value: 'emailId'},
    {title: 'Mob No', value: 'mobileNo'},
    {title: 'Gender', value: 'gender'},
    {
      title: 'Vendor Name',
      value: 'vendorName',
    },
    {
      title: 'Vendor Code',
      value: 'vendorCode',
    },
    {title: 'Driving License Number', value: 'dlNumber'},
    {title: 'Vaccination', value: 'IsVaccinated'},
    {title: 'Age', value: 'age'},
    {title: 'Email Status', value: 'emailStatus'},
    {title: 'SMS Status', value: 'smsStatus'},
    {title: 'Status', value: 'status'},
    {title: 'Profile Status', value: 'profileStatus'},
  ];
  const vendorField = [
    {title: 'First Name', value: 'firstName'},
    {title: 'Last Name', value: 'lastName'},
    {title: 'Email Id', value: 'emailId'},
    {title: 'Mob No', value: 'mobileNo'},
    {title: 'Gender', value: 'gender'},

    {title: 'Driving License Number', value: 'dlNumber'},
    {title: 'Status', value: 'status'},
    {title: 'Profile Status', value: 'profileStatus'},
  ];
  const handleSelectionChange = (rows) => {
    const selectedData = rows.map((row) => ({
      name: row.firstName + row.lastName,
      emailid: row.emailId,
      mobileNo: row?.mobileNo,
    }));
    setSelectedRows(selectedData);
  };
  const handleTooltipClick = async () => {
    try {
      let apiEndpoint = '';
      let payload = {};
      if (selectedMode == 'EMAIL') {
        // apiEndpoint = '/usernotify/email/sendMailForProfileCreationForDriver';
        apiEndpoint = '/user-reg/driver-reg/sendMailForProfileCreationDriver';
        payload = selectedRows.map(({name, emailid}) => ({name, emailid}));
      } else if (selectedMode == 'SMS') {
        apiEndpoint = '/user-reg/driver-reg/sendSmsForProfileCreationDriver';
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

  useEffect(() => {
    getFilterData();
  }, [filter]);
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
  const closeConfirmBoxReactivate = (dd, reason) => {
    setOpenConfirmBoxReactivate(false);
    setId(null);
    if (dd == 'YES') {
      axios
        .post(
          Api.baseUri +
            `/user-reg/driver-reg/activatedriver/${id}/${
              reason?.length ? reason : null
            }`,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success(
              `${
                res?.data?.data?.firstName + res?.data?.data?.lastName
              }'s profile reactivated.`,
            );
            // toast.success('Driver reactivated successfully');
            getFilterData();
          }
        });
    }
  };

  const getFilterData = () => {
    setTimeout(() => {
      tableRef.current && tableRef.current.onQueryChange();
    }, 0);
  };
  function popBTNClick(val) {
    getFilterData();
    if (!val) {
      setopenDialog(false);
    }
  }
  useEffect(() => {
    console.log('selectedRows', selectedRows);
  }, [selectedRows]);
  function unassociateDriver(d) {
    if (d == 'YES') {
      axios
        .post(
          Api.baseUri +
            `/user-reg/associateDriver/unAssociateDriverFromCorporate/{id}`,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
          }
        })
        .catch((err) => {
          console.log('err', err);
        });
    } else {
      setOpenUnassociate(false);
    }
  }
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
        title: 'Name',
        field: 'firstName',
        render: (rd) => rd.firstName + ' ' + rd.lastName,
      },
      {
        title: 'Address',
        field: 'address.addressName',
        render: (rowData) =>
          rowData?.address?.addressName?.split('++')?.[0] +
          ',' +
          rowData?.address?.addressName?.split('++')?.[1],
      },
      {
        title: 'Driving License ',
        field: 'dlNumber',
      },
      {
        title: 'Email',
        field: 'emailId',
      },
      {
        title: 'Mobile',
        field: 'mobileNo',
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
        title: 'Last Updated',
        field: 'updatedOn',
        type: 'datetime',
      },
    ],
  };

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
        title: 'Name',
        field: 'firstName',
        render: (rd) => rd.firstName + ' ' + rd.lastName,
      },
      {
        title: 'Address',
        field: 'address.addressName',
        render: (rowData) =>
          rowData?.address?.addressName?.split('++')?.[0] +
          ',' +
          rowData?.address?.addressName?.split('++')?.[1],
      },
      {
        title: 'Driving License ',
        field: 'dlNumber',
      },
      {
        title: 'Email',
        field: 'emailId',
      },
      {
        title: 'Mobile',
        field: 'mobileNo',
      },
      {
        title: 'Device Name',
        field: 'loginDetails',
        render: (rd) => {
          return (
            (rd?.loginDetails?.deviceName?.length
              ? rd?.loginDetails?.deviceName?.charAt(0).toUpperCase() +
                rd?.loginDetails?.deviceName.slice(1)
              : '--') +
            ',' +
            (rd?.loginDetails?.oS?.length
              ? rd?.loginDetails?.oS?.charAt(0).toUpperCase() +
                rd?.loginDetails?.oS.slice(1)
              : '--') +
            ',' +
            (rd?.loginDetails?.osVersion ? rd?.loginDetails?.osVersion : '--')
          );
        },
      },

      // {
      //   title: 'OS ',
      //   field: 'os',
      //   render: (rd) => {
      //     return rd?.loginDetails?.oS ?? '--';
      //   },
      // },
      // {
      //   title: 'OS Version ',
      //   field: 'osVersion',
      //   render: (rd) => {
      //     return rd?.loginDetails?.osVersion ?? '--';
      //   },
      // },
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
          return rd?.loginDetails?.locationPermission
            ? rd?.loginDetails?.locationPermission?.charAt(0).toUpperCase() +
                rd?.loginDetails?.locationPermission.slice(1)
            : '--';
        },
      },
      {
        title: 'Display Over other Apps',
        field: 'displayOverOtherApp',
        render: (rd) => {
          return rd?.loginDetails?.displayOverOtherApp
            ? rd?.loginDetails?.displayOverOtherApp?.charAt(0).toUpperCase() +
                rd?.loginDetails?.displayOverOtherApp.slice(1)
            : '--';
        },
      },
      {
        title: 'Battery Optimisation Status',
        field: 'batteryOptimisationStatus',
        render: (rd) => {
          return rd?.loginDetails?.batteryOptimisationStatus
            ? rd?.loginDetails?.batteryOptimisationStatus
                ?.charAt(0)
                .toUpperCase() +
                rd?.loginDetails?.batteryOptimisationStatus.slice(1)
            : '--';
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

  const [tableTemplate, setTemplate] = useState({
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
        title: 'Name',
        field: 'firstName',
        render: (rd) => rd.firstName + ' ' + rd.lastName,
      },
      {
        title: 'Address',
        field: 'address.addressName',
        render: (rowData) =>
          rowData?.address?.addressName?.split('++')?.[0] +
          ',' +
          rowData?.address?.addressName?.split('++')?.[1],
      },
      {
        title: 'Driving License ',
        field: 'dlNumber',
      },
      {
        title: 'Email',
        field: 'emailId',
      },
      {
        title: 'Mobile',
        field: 'mobileNo',
      },
    ],
  });
  useEffect(() => {
    let temp = tableTemplate;
    if (user?.userList?.userRole == 'SUPERADMIN') {
      temp.columns.push(
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
          title: 'Display Over other Apps',
          field: 'displayOverOtherApp',
          render: (rd) => {
            return rd?.loginDetails?.displayOverOtherApp ?? '--';
          },
        },
        {
          title: 'Battery Optimisation Status',
          field: 'batteryOptimisationStatus',
          render: (rd) => {
            return rd?.loginDetails?.batteryOptimisationStatus ?? '--';
          },
        },
      );
    }
    temp.columns.push(
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
        field: 'updatedOn',
        type: 'datetime',
      },
    );
    setTemplate({...temp});
  }, []);
  function handleClickView(rowData) {
    // navigate('/onboardadmin/driver/detailPage/' + rowData._id);
    setId(rowData?._id);
    setOpenDetail(true);
  }

  function handleDelete(rowData) {
    setId(rowData?._id);
    handleConfirmBox();
  }
  function handleClickEdit(rowData) {
    console.log('rowData', rowData);
    setopenDialog(true);
    setdialID(rowData?._id);
  }

  const handleForm = () => {
    setOpenForm(true);
  };

  const handleClose = () => {
    setOpenForm(false);
  };
  const handleCloseform = (status) => {
    setOpenForm(status);
    getFilterData();
  };

  const CloseDetailPage = () => {
    setOpenDetail(false);
  };

  const closeInternalDialog = () => {
    setOpenDetail(false);
  };

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
          `${api.driver.list}/deactivatedriver/${id}/${
            reason?.length ? reason : null
          }`,
        )
        .then((response) => {
          if (response?.data?.status == '200') {
            toast.success(
              `${
                response?.data?.data?.firstName + response?.data?.data?.lastName
              }'s profile deactivated.`,
            );
            // toast.success('Driver deactivated successfully');
            getFilterData();
            setOpenConfirmBox(false);
            setId(null);
          }
        })
        .catch((err) => {});
    } else {
      setOpenConfirmBox(false);
    }
  };
  const handleDialog = (val) => {
    setshowbtn(false);
    if (!driverData?.id) {
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
            `/user-reg/associateDriver/associateDriverToCorporate/driver/${driverData?.id}/corporate/${user?.userList?.corporateId}`,
        )
        .then((res) => {
          toast.success(res?.data?.message);
          setOpenAssociate(false);
          setDriverData({});
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
  useEffect(() => {
    let temp_url =
      user?.role == 'CORPORATEADMIN'
        ? `${Api.driver.changeRequest}/${user?.userList?.tanentId}/tanent/PENDING/profile`
        : `${Api.driver.changeRequest}/${user?.userList?.profileId}/vendor/PENDING/profile`;

    axios
      .get(temp_url)
      .then((res) => {
        if (res?.data?.status == '200') {
          setPendingCount(res?.data?.data?.length);
        }
      })
      .catch((err) => {});
  }, []);

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
                title: 'Driver Email Id/Mobile No',
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
                title: 'Driver Name',
                disabled: true,
                field: 'vendorName',
              },
              // {
              //   type: 'text',
              //   name: 'vendorCode',
              //   id: 'vendorCode',
              //   disabled: true,
              //   title: 'Vendor Code',
              //   field: 'vendor Code',
              //   // validationProps: {
              //   //   required: 'This is a mandatory field',
              //   // },
              // },
            ],
          },
        ],
      },
    ],
  };
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
        `${Api.baseUri}/user-reg/associateDriver/search-driver?emailId=${email}&mobileNo=${mob}`,
      )
      .then((re) => {
        if (!re?.data?.data?.id) toast.error('No record found.');
        console.log('elll', re);
        setDriverData({...re?.data?.data});
      })
      .catch((err) => {
        setDriverData({});
      });
  };

  function SecretFun(search, value) {
    if (search?.toUpperCase() == 'SEARCH') {
      searchVendor(value);
    } else return;
  }

  return (
    <>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={12} sm={3} md={4} sx={{mb: 2}}>
          <CustomLabel labelVal='Drivers' variantVal='h3-underline' />
        </Grid>
        <Grid item xs={12} sm={3} md={4}>
          <QuickSearchPage
            masterKey='mobileNo'
            module={'AssociateDriver'}
            searchClicked={true}
            searchUrl={'/employee-reg/filter'}
            // masterFields={['emailId', 'firstName', 'lastName']}
            displayFields={['firstName', 'lastName', 'mobileNo']}
            getFilterData={getFilterData}
            filterRes={filterRes}
            setFilterRes={setFilterRes}
          />
        </Grid>
        <Grid item xs={12} sm={9} md={4} sx={{paddingTop: '0px !important'}}>
          <Box display='flex' justifyContent='flex-end' alignItems='center'>
            <div className='left-seperator'>
              {/* <AppTooltip placement={'top'} title={'Search Drivers'}>
                <SearchOutlinedIcon
                  onClick={() => {
                    setsearchClicked(!searchClicked);
                  }}
                  sx={{ml: 2, mr: 4}}
                  className='pointer'
                />
              </AppTooltip> */}
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
              {type == 'associate' && (
                <AppTooltip>
                  <AddchartIcon
                    sx={{marginRight: '5px'}}
                    onClick={() => {
                      setOpenAssociate(true);
                    }}
                  />
                </AppTooltip>
              )}

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
                <AppTooltip placement={'top'} title={'Add New Driver'}>
                  <img
                    src='/assets/images/title-icon/add-driver.svg'
                    className='title-icons-mui'
                    onClick={handleForm}
                  />
                </AppTooltip>
              )}
              {myActions?.includes('Approve Or Reject') && type == 'Def' && (
                <AppTooltip placement={'top'} title={'Profile Update Requests'}>
                  <div style={{display: 'flex'}}>
                    <img
                      src='/assets/images/title-icon/profile-change.svg'
                      className='title-icons-mui'
                      onClick={(e) => {
                        navigate('/onboardadmin/pending-driver/driver-listing');
                      }}
                    />
                    <p className='pending-count'>{pendingCount}</p>
                  </div>
                </AppTooltip>
              )}
            </div>
            <div style={{display: 'flex'}}>
              {emailPermission?.alertDriverToCreateProfileByCorporate ==
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
              {emailPermission?.alertDriverToCreateProfileByCorporateSMS ==
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
                downloadFile={'Driver'}
                downloadURL={'/user-reg/driver-reg/download'}
                getHeadersUrl={'/user-reg/driver-reg/headerdata'}
                downloadTempURL={'/user-reg/driver-reg/download-template'}
                uploadURL={'/user-reg/driver-reg/import-excel'}
              />
            )}
          </Box>
        </Grid>
      </Grid>

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
      {!filterRes ? (
        <>
          {tableTemplate.columns.length > 9 && (
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
                user?.userList?.userRole == 'SUPERADMIN'
                  ? tableTemplateSuperAdmin.columns
                  : tableTemplateCorporate.columns
              }
              tableRef={tableRef}
              data={(query) =>
                new Promise((resolve, reject) => {
                  const modifiedFilters =
                    !_.isEmpty(filter) &&
                    filter?.map((filterItem) => {
                      if (
                        filterItem?.field === 'profileStatus' &&
                        filterItem?.value?.toUpperCase() == 'VERIFIED'
                      ) {
                        return {
                          ...filterItem,
                          value: 'ACTIVE',
                        };
                      } else if (
                        filterItem.field === 'profileStatus' &&
                        filterItem?.value?.toUpperCase() == 'INACTIVE'
                      ) {
                        return {
                          ...filterItem,
                          value: 'INACTIVE',
                        };
                      } else if (filterItem.field === 'profileStatus') {
                        return {
                          ...filterItem,
                          value: 'DEFAULT',
                        };
                      }
                      return filterItem;
                    });
                  let url_ = Api.baseUri + '/api/dashboard/employee/filter',
                    body =
                      !filter || _.isEmpty(filter)
                        ? {
                            collection: 'AssociateDriver',
                            // user?.userList?.userRole == 'VENDOR'
                            //   ? 'AssociateDriverVendor'
                            //   : 'AssociateDriverCorporate',

                            // collection: 'DriverReg',
                            pageSize: query.pageSize,
                            pageNo: query.page + 1,
                          }
                        : {
                            collection: 'AssociateDriver',
                            // user?.userList?.userRole == 'VENDOR'
                            //   ? 'AssociateDriverVendor'
                            //   : 'AssociateDriverCorporate',
                            // filterType: 'filter',
                            // collection: 'DriverReg',
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
                // filtering:true,
                selection: isEmailSwitchOn || isAnotherSwitchOn ? true : false,
                actionsColumnIndex: -1,
                headerStyle: {position: 'sticky', top: 0},
                pageSize: pageSize,
                pageSizeOptions: [10, 25, 50],
              }}
              onChangeRowsPerPage={(pageSize) => {
                setPageSize(pageSize);
              }}
              onSelectionChange={(rows) => {
                handleSelectionChange(rows);
                console.log('rows', rows);
              }}
              actions={
                type == 'associate'
                  ? [
                      (rd) =>
                        myActions?.includes('Edit') && {
                          icon: () => (
                            <EditIcon
                              color='primary'
                              style={{
                                opacity: rd?.status == 'INACTIVE' ? '0.3' : '',
                              }}
                            />
                          ),
                          tooltip: 'Edit',
                          onClick: (event, rowData) => {
                            if (rowData?.status == 'INACTIVE') {
                              return;
                            }
                            handleClickEdit(rowData);
                          },
                        },
                      myActions?.includes('View') && {
                        icon: () => <VisibilityIcon color='primary' />,
                        tooltip: 'View',
                        onClick: (event, rowData) => handleClickView(rowData),
                      },
                      (rd) =>
                        myActions?.includes('Deactivate') && {
                          icon: () => (
                            <DeleteIcon
                              color='primary'
                              style={{
                                opacity: rd?.status == 'INACTIVE' ? '0.3' : '',
                                color: '#bc0805',
                              }}
                            />
                          ),
                          tooltip: 'Deactivate',
                          onClick: (event, rowData) => {
                            if (rowData?.status == 'INACTIVE') {
                              return;
                            }
                            handleDelete(rowData);
                          },
                        },
                      (rd) =>
                        myActions?.includes('Edit') && {
                          icon: () => (
                            <RestoreIcon
                              color='primary'
                              style={{
                                opacity: rd?.status == 'INACTIVE' ? '' : '0.2',
                              }}
                            />
                          ),
                          tooltip: 'Reactivate',
                          onClick: (event, rowData) => {
                            if (rowData?.status == 'INACTIVE') {
                              setId(rowData?._id);
                              setOpenConfirmBoxReactivate(true);
                            }
                          },
                        },
                      (rd) =>
                        myActions?.includes('Edit') && {
                          icon: () => <DeleteSweepIcon color='primary' />,
                          tooltip: 'un-associate driver',
                          onClick: (event, rowData) => {
                            if (rowData?.status == 'INACTIVE') {
                              setId(rowData?._id);
                              setOpenConfirmBoxReactivate(true);
                            }
                          },
                        },
                    ]
                  : [
                      (rd) =>
                        myActions?.includes('Edit') && {
                          icon: () => (
                            <EditIcon
                              color='primary'
                              style={{
                                opacity: rd?.status == 'INACTIVE' ? '0.3' : '',
                              }}
                            />
                          ),
                          tooltip: 'Edit',
                          onClick: (event, rowData) => {
                            if (rowData?.status == 'INACTIVE') {
                              return;
                            }
                            handleClickEdit(rowData);
                          },
                        },
                      myActions?.includes('View') && {
                        icon: () => <VisibilityIcon color='primary' />,
                        tooltip: 'View',
                        onClick: (event, rowData) => handleClickView(rowData),
                      },
                      (rd) =>
                        myActions?.includes('Deactivate') && {
                          icon: () => (
                            <DeleteIcon
                              color='primary'
                              style={{
                                opacity: rd?.status == 'INACTIVE' ? '0.3' : '',
                                color: '#bc0805',
                              }}
                            />
                          ),
                          tooltip: 'Deactivate',
                          onClick: (event, rowData) => {
                            if (rowData?.status == 'INACTIVE') {
                              return;
                            }
                            handleDelete(rowData);
                          },
                        },
                      (rd) =>
                        myActions?.includes('Edit') && {
                          icon: () => (
                            <RestoreIcon
                              color='primary'
                              style={{
                                opacity: rd?.status == 'INACTIVE' ? '' : '0.2',
                              }}
                            />
                          ),
                          tooltip: 'Reactivate',
                          onClick: (event, rowData) => {
                            if (rowData?.status == 'INACTIVE') {
                              setId(rowData?._id);
                              setOpenConfirmBoxReactivate(true);
                            }
                          },
                        },
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
          )}
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
          tableRef={tableRef}
          columns={
            user?.userList?.userRole == 'CORPORATEADMIN'
              ? tableTemplateCorporate.columns
              : tableTemplateSuperAdmin.columns
          }
          data={filterRes || []}
          options={{
            search: false,
            showTitle: false,
            // filtering:true,
            selection: isEmailSwitchOn || isAnotherSwitchOn ? true : false,
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
                    style={{opacity: rd?.status == 'INACTIVE' ? '0.3' : ''}}
                  />
                ),
                tooltip: 'Edit',
                onClick: (event, rowData) => {
                  if (rowData?.status == 'INACTIVE') {
                    return;
                  }
                  handleClickEdit(rowData);
                },
              },
            myActions?.includes('View') && {
              icon: () => <VisibilityIcon color='primary' />,
              tooltip: 'View',
              onClick: (event, rowData) => handleClickView(rowData),
            },
            (rd) =>
              myActions?.includes('Deactivate') && {
                icon: () => (
                  <DeleteIcon
                    color='primary'
                    style={{
                      opacity: rd?.status == 'INACTIVE' ? '0.3' : '',
                      color: '#bc0805',
                    }}
                  />
                ),
                tooltip: 'Deactivate',
                onClick: (event, rowData) => {
                  if (rowData?.status == 'INACTIVE') {
                    return;
                  }
                  handleDelete(rowData);
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
            width: '88%',
          },
        }}
        style={{borderRadius: '4rem'}}
      >
        <div>
          <DialogTitle
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              background: '#f5f2f2',
              height: '4rem',
              paddingRight: '1.5rem',
              paddingLeft: '1.5rem',
              width: '88%',
              position: 'fixed',
              zIndex: '9',
              borderRadius: '5px 5px 0px 0px',
            }}
          >
            <h1>Register Driver</h1>
            <CloseIcon
              onClick={handleClose}
              style={{color: '#4f4f4f', fontWeight: 'bold'}}
            />
          </DialogTitle>
          <DialogContent style={{padding: '0px', marginTop: '80px'}}>
            <div style={{padding: '1rem'}}>
              <RegisterDriver close={handleCloseform} />
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
      >
        <DialogTitle style={{background: '#f4f2f2'}}>
          <h1>Driver Details</h1>
          <CloseIcon
            onClick={CloseDetailPage}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              color: '#4f4f4f',
              fontWeight: 'bold',
            }}
          />
        </DialogTitle>
        <DialogContent style={{padding: '16px', paddingTop: 0}}>
          <DetailForm id={id} close={closeInternalDialog} />
        </DialogContent>
      </Dialog>
      {filterShow && (
        <SmartFilter
          open={openFilter}
          title={'Driver Filter'}
          handleClose={handleClosefilter}
          filter={filter}
          fieldList={
            user?.userList?.userRole == 'VENDOR' ? vendorField : fieldList
          }
          setFilter={setFilter}
        />
      )}
      {/* <FilterPop open={openFilter} handleClose={handleClosefilter} title={"Driver  Filter"} template={templateFilter} cnfMsg={'cnfMsg'} header={"My Header"} /> */}
      <Confirm
        open={openConfirmbox}
        header={'Confirm to Deactivate'}
        cnfMsg={'Are you sure, You want to deactivate the driver?'}
        handleClose={closeConfirmBox}
        reason={true}
      />
      <Confirm
        open={openConfirmboxReactivate}
        header={'Confirm to Reactivate'}
        cnfMsg={'Are you sure, You want to reactivate the driver?'}
        handleClose={closeConfirmBoxReactivate}
        reason={true}
      />
      <Confirm
        open={openUnassociate}
        header={'Confirm to Unassociate Driver'}
        cnfMsg={'Are you sure, You want to unassociate the driver?'}
        handleClose={unassociateDriver}
        // reason={true}
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
              {'Associate New Driver'}
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
                  // {name: 'vendorCode', value: vendorData?.vendorCode ?? 'NA'},
                  {name: 'vendorName', value: driverData?.firstName ?? 'NA'},
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
    </>
  );
};
export default List;
