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
import {Button} from '@mui/material';
import EmpolyeeEditForm from '../EditEmployee/index';
import EmpolyeeForm from '../EmpolyeeForm/index';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import ApproveForm from '../ApproveEmployee/ApproveEmployee';
import CustomLabel from 'pages/common/CustomLabel';

const NewEmployeeListing = () => {
  const [filter, setFilter] = useState({});
  const navigate = useNavigate();
  const {user} = useAuthUser();
  const [openDialog, setopenDialog] = useState(false);
  const [id, setId] = useState();
  const tableRef = React.useRef();

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
      },
    ],
  };
  function handleClickEdit(rowData) {
    setId(rowData?.id);
    setopenDialog(true);
  }
  const handleClose = () => {
    setopenDialog(false);
  };
  const handleCloseForm = (status) => {
    setopenDialog(status);
    setTimeout(() => {
      tableRef.current && tableRef.current.onQueryChange();
    }, 0);
  };
  return (
    <>
      <div style={{marginBottom: '30px'}}>
        <CustomLabel
          labelVal="Employees' Registration Requests"
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
        tableRef={tableRef}
        data={(query) =>
          new Promise((resolve, reject) => {
            let url = `${api.employeesignup.getList}?page=${query.page}&size=${query.pageSize}&corporateId=${user?.userList?.profileId}`,
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
                  data: result?.data?.data?.body?.EmployeeListList ?? [],
                  page: result?.data?.data?.body?.currentPage ?? 0,
                  totalCount: result?.data?.data?.body?.totalItems ?? 0,
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
        onClose={handleClose}
        open={openDialog}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '40%',
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
              }}
            >
              <h1 style={{marginTop: '1.5rem'}}>Employee Request</h1>
              <CloseIcon
                onClick={handleClose}
                style={{
                  marginTop: '1.4rem',
                  color: '#4f4f4f',
                  fontWeight: 'bold',
                }}
              />
            </div>

            <div style={{padding: '1rem'}}>
              <ApproveForm id={id} close={handleCloseForm} />
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </>
  );
};

export default NewEmployeeListing;
