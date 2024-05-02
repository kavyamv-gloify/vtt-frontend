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
import {Divider} from '@mui/material';
import {useAuthUser} from '@crema/utility/AuthHooks';
import CustomLabel from 'pages/common/CustomLabel';
import PendingEditPage from '../EditDrivers/PendingEditPage';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import DialogTitle from '@mui/material/DialogTitle';
import DetailForm from '../DriverListingDetailPage';
import DeleteIcon from '@mui/icons-material/Delete';
const PendingList = () => {
  const [filter, setFilter] = useState({});
  const navigate = useNavigate();
  const {user} = useAuthUser();
  const [openform, setOpenForm] = useState();
  const [id, setId] = useState();
  const tableRef = React.useRef();
  // const id = user?.userList?.tanentId;
  //

  const tanents = user?.userList?.tanentId;
  const vendorId = user?.userList?.profileId;

  const tableTemplate = {
    columns: [
      {
        title: 'First Name',
        field: 'firstName',
      },
      {
        title: 'Last Name',
        field: 'lastName',
      },
      {
        title: 'Address',
        field: 'address.addressName',
        render: (rowData) =>
          //
          rowData?.address?.addressName?.split('++')?.[0] +
          ',' +
          rowData?.address?.addressName?.split('++')?.[1],
      },
      // {
      //   title: 'Years of ex.',
      //   field: "expYears"
      // },
      {
        title: 'Driving licence No.',
        field: 'dlNumber',
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

  function handleClickEdit(rowData) {
    setId(rowData.id);
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
          labelVal="Drivers' Pending List"
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
            let url =
                user?.role == 'CORPORATEADMIN'
                  ? `${api.driver.changeRequest}/${tanents}/tanent/PENDING/profile`
                  : `${api.driver.changeRequest}/${vendorId}/vendor/PENDING/profile`,
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
            if (user?.role == 'CORPORATEADMIN') {
              axios.get(url, body).then((result) => {
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
              });
            }

            if (user?.role == 'VENDOR') {
              axios.get(url, body).then((result) => {
                resolve({
                  data: result.data?.data ?? [],
                  page: result?.data?.data?.body?.currentPage ?? 0,
                  totalCount: result?.data?.data?.body?.totalItems ?? 0,
                });
              });
            }
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
          <h1>Driver Pending Request</h1>
          <CloseIcon
            onClick={handleClose}
            style={{color: '#4f4f4f', fontWeight: 'bold'}}
          />
        </DialogTitle>
        <DialogContent style={{padding: '0px'}}>
          <div style={{padding: '10px'}}>
            <PendingEditPage id={id} close={handleCloseform} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PendingList;
