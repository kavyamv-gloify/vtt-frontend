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
import PendingEditPage from '../EditVendor/PendingEditPage';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import DialogTitle from '@mui/material/DialogTitle';
const List = () => {
  const [filter, setFilter] = useState({});
  const navigate = useNavigate();
  const {user} = useAuthUser();
  const id = user?.userList?.tanentId;
  const tableRef = React.useRef();
  const [openform, setOpenForm] = useState();
  const [idd, setIdd] = useState();

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
        title: 'Mobile No.',
        field: 'mobileNo',
      },
      {
        title: 'Email Id',
        field: 'emailId',
      },
    ],
  };

  function handleClickEdit(rowData) {
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
          labelVal="Vendors' Pending List"
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
            let url = `${api.vendor.changeRequest}/${id}/tanent/PENDING/status`,
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
                data:
                  result?.data && result?.data?.data ? result?.data?.data : [],
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
        <div>
          <DialogTitle
            style={{
              background: '#f5f2f2',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <h1>Vendor Pending Request</h1>
            <CloseIcon
              onClick={handleClose}
              style={{color: '#4f4f4f', fontWeight: 'bold'}}
            />
          </DialogTitle>
          <DialogContent style={{padding: '0px'}}>
            {/* <div style={{ display: "flex", justifyContent: "space-between", background: "#f5f2f2", height: "4rem", paddingRight: "1.5rem", paddingLeft: "1.5rem", position: "fixed", width: "90%", zIndex: "9", borderRadius: "5px 5px 0px 0px" }}>
              <h1 style={{ marginTop: '1.5rem' }}>Vendor Pending Request</h1>
              <CloseIcon onClick={handleClose} style={{ marginTop: "1.4rem", color: "#4f4f4f", fontWeight: "bold" }} />
            </div> */}

            <div style={{padding: '1rem', marginTop: '0px'}}>
              <PendingEditPage id={idd} close={handleCloseform} />
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </>
  );
};

export default List;
