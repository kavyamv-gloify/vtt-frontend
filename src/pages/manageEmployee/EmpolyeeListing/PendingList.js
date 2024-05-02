import React, {useState} from 'react';
import SmartTable from '@smart-table';
import Avatar from '@mui/material/Avatar';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import _ from 'lodash';
import api from '@api';
import {useAuthUser} from '@crema/utility/AuthHooks';
import CustomLabel from 'pages/common/CustomLabel';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import DialogTitle from '@mui/material/DialogTitle';
import PendingForm from '../EditEmployee/PendingForm';
const PendingList = () => {
  const [filter, setFilter] = useState({});
  const navigate = useNavigate();
  const {user} = useAuthUser();

  const profileIds = user?.userList?.profileId;
  const tableRef = React.useRef();
  const [openform, setOpenForm] = useState();
  const [idd, setIdd] = useState();
  const CorpId =
    user?.role == 'CORPORATEADMIN'
      ? user?.userList?.profileId
      : user?.userList?.corporateId;
  const tableTemplate = {
    columns: [
      {
        title: 'Employee First Name',
        field: 'firstName',
      },
      {
        title: 'Employee Last Name',
        field: 'lastName',
      },
      {
        title: 'Employee Code',
        field: 'employeeCode',
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
        title: 'Requested on',
        field: 'createdOn',
        type: 'datetime',
      },
    ],
  };

  function handleClickEdit(rowData) {
    console.log("rowData", rowData)
    setIdd(rowData.id);
    setOpenForm(true);
  }

  function handleCloseform() {
    setOpenForm(false);
    setTimeout(() => {
      tableRef.current && tableRef.current.onQueryChange();
    }, 0);
  }

  function handleClose() {
    setOpenForm(false);
  }

  return (
    <>
      <div style={{marginBottom: '30px'}}>
        <CustomLabel
          labelVal='Profile Update Requests'
          variantVal='h3-underline'
        />
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
        title='Onboard Tenants List'
        columns={tableTemplate.columns}
        data={(query) =>
          new Promise((resolve, reject) => {
            let url = `${api.employee.changeRequest}/${CorpId}/corporate/PENDING/status`,
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
            axios
              .get(url, body)
              .then((result) => {
                resolve({
                  data:
                    result?.data && result?.data?.data
                      ? result?.data?.data
                      : [],
                  page:
                    result.data && result.data.currentPage
                      ? result.data.currentPage
                      : 0,
                  totalCount:
                    result.data && result.data.totalItems
                      ? result.data.totalItems
                      : 0,
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
          actionsColumnIndex: -1,
          headerStyle: {position: 'sticky', top: 0},
        }}
        actions={[
          {
            icon: () => <EditIcon color='primary' />,
            tooltip: 'edit',
            onClick: (event, rowData) => handleClickEdit(rowData),
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
        PaperProps={{
          sx: {
            width: '90%',
          },
        }}
        style={{borderRadius: '4rem'}}
      >
        <DialogTitle
          style={{
            background: '#f5f2f2',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <h1>Employee Pending Request</h1>
          <CloseIcon
            onClick={handleClose}
            style={{color: '#4f4f4f', fontWeight: 'bold'}}
          />
        </DialogTitle>
        <DialogContent style={{padding: '0px'}}>
          <div style={{padding: '1rem', marginTop: '0px'}}>
            <PendingForm id={idd} close={handleCloseform} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PendingList;
