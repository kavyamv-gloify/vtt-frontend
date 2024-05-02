import React, {useState} from 'react';
import SmartTable from '@smart-table';
import Avatar from '@mui/material/Avatar';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import _ from 'lodash';
import api from '@api';
import SmartForm from '@smart-form';
import {Button} from '@mui/material';
import {useAuthUser} from '@crema/utility/AuthHooks';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ComplianceForm from './ComplianceForm';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import {Divider} from '@mui/material';
import {BsFillFilePersonFill} from 'react-icons/bs';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

const VendorDriverList = () => {
  const [filter, setFilter] = useState({});
  const [myId, setMyId] = useState();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const {user} = useAuthUser();
  const tableRef = React.useRef();
  const [enable, setEnable] = useState(false);
  const [driverId, setDriverId] = useState();
  const [driverName, setDriverName] = useState();
  const [drivingLicense, setDrivingLicense] = useState();
  const id = user?.userList?.profileId;

  let templateFilter = {
    layout: {column: 1, spacing: 2, size: 'medium', label: 'top', type: 'flex'},
    // title: 'Orders Filter',
    // description: 'Orders Filter',
    sections: [
      {
        layout: {
          column: 6,
          spacing: 2,
          size: 'small',
          label: 'top',
          type: 'flex',
        },
        id: 'personal_information',
        fields: [
          {
            type: 'text',
            name: 'mobileNo.',
            id: 'mobileNo',
            title: 'Mobile Number',
          },
        ],
      },
    ],
  };

  const tableTemplate = {
    columns: [
      {
        title: 'Name',
        field: 'firstName',
      },
      {
        title: 'Name',
        field: 'lastName',
      },

      {
        title: 'Address',
        field: 'address.addressName',
      },
      {
        title: 'Email Id',
        field: 'emailId',
      },
      {
        title: 'Mobile No.',
        field: 'mobileNo',
      },
    ],
  };

  async function onSearch(val) {
    setTimeout(() => {
      setEnable(null);
    }, 1000);
    setTimeout(() => {
      setEnable(true);
    }, 1000);

    setFilter(val.data);
    setTimeout(() => {
      tableRef.current && tableRef.current.onQueryChange();
    }, 0);
  }

  function handleClickEdit(rowData) {
    setOpen(true);
    setDriverId(rowData?.id);
    setDrivingLicense(rowData?.dlNumber);
    setDriverName(rowData.firstName + ' ' + rowData.lastName);
  }

  function myDial(status) {
    setOpen(status);
  }
  function handleClose() {
    setOpen(false);
  }

  return (
    <>
      <SmartForm
        template={templateFilter}
        onSubmit={onSearch}
        success={enable}
        buttons={['search']}
      />
      <Divider light className='mb-4' />
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
        title='Escort Employee List'
        columns={tableTemplate.columns}
        tableRef={tableRef}
        data={(query) =>
          new Promise((resolve, reject) => {
            let url = `${api.driver.list}/${id}/vendor/${
                filter.mobileNo ? filter.mobileNo : null
              }/mobileNo`,
              body = {
                pageSize: query.pageSize,
                pageNo: query.page,
              };
            if (!_.isEmpty(filter)) {
              body = {
                ...body,
                ...filter,
              };
            }
            axios.get(url, body).then((result) => {
              resolve({
                data: (result?.data && result?.data?.data) ?? [],
                page:
                  result?.data && result?.data?.data?.body
                    ? result?.data?.data?.body?.currentPage
                    : 0,
                totalCount:
                  result?.data && result?.data?.data?.body
                    ? result?.data?.data?.body?.totalItems
                    : 0,
              });
            });
          })
        }
        options={{
          search: false,
          showTitle: false,
          actionsColumnIndex: -1,
          headerStyle: {position: 'sticky', top: 0},
        }}
        actions={[
          {
            icon: () => (
              <img
                src='/assets/images/compliance.png'
                style={{height: '25px'}}
                color='primary'
                fontSize='medium'
              />
            ),
            tooltip: 'Create Compliances',
            onClick: (event, rowData) => handleClickEdit(rowData),
          },
          // {
          //   icon: () => (<EditIcon color='primary'/>),
          //   tooltip: 'Edit Compliances',
          //   onClick: (event, rowData) => handleClickEdit(rowData)
          // },
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
        onClose={handleClose}
        open={open}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogContent>
          <ComplianceForm
            id={driverId}
            myDial={myDial}
            driverName={driverName}
            driverId={drivingLicense}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VendorDriverList;
