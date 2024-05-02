import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import moment from 'moment';
import Api from '@api';
const tableTemplate = {
  Corporatecolumns: [
    {
      field: 'photo',
      title: 'Photo',
      render: (rowData) => (
        <div style={{display: 'flex', alignItems: 'start'}}>
          <FiberManualRecordIcon
            sx={{
              fontSize: '15px',
              color:
                rowData?.loginDetails?.activeStatus == 'YES' ? 'green' : 'red',
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
      title: 'Employee Name',
      field: 'employeeFullName',
    },
    {
      title: 'Employee Code',
      field: 'employeeCode',
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
      title: 'Office Name',
      field: 'officeName',
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
      title: 'Created by',
      field: 'createdBy',
      type: 'date',
    },
    {
      title: 'Created On',
      field: 'createdOn',
      type: 'date',
    },
    {
      title: 'Last Updated on',
      field: 'updatedOn',
      type: 'datetime',
    },
  ],
  SuperAdmincolumns: [
    {
      field: 'photo',
      title: 'Photo',
      render: (rowData) => (
        <div style={{display: 'flex', alignItems: 'start'}}>
          <FiberManualRecordIcon
            sx={{
              fontSize: '15px',
              color:
                rowData?.loginDetails?.activeStatus == 'YES' ? 'green' : 'red',
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
          rd.createdBy + '  ' + moment(rd.createdOn).format('DD/MM/YYYY HH:MM')
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

export default tableTemplate;
