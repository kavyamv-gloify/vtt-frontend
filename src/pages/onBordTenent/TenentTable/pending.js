import React, { useState } from 'react';
import SmartTable from '@smart-table';
import Avatar from '@mui/material/Avatar';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import _ from '@lodash';
import api from '@api';
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import DialogTitle from '@mui/material/DialogTitle';
import CustomLabel from 'pages/common/CustomLabel';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateForm from '../EditPage/pending'
import { Grid } from '@mui/material';
const List = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState({})
  const [openform, setOpenForm] = useState();
  const [id, setId] = useState()
  const tableRef = React.useRef();
  const tableTemplate = {
    columns: [
      
      {
        title: 'Name',
        field: "companyName",
      },

      {
        title: 'Email Id',
        field: "emailId"
      },
      {
        title: 'Mobile No.',
        field: "mobileNo"
      },
      {
        title: 'Created by',
        field: "createdBy",

      },
      {
        title: 'Created On',
        field: "createdOn",
        type: "date",
       
      },
      {
        title: 'Last Updated On',
        field: "updatedOn",
        type: "datetime"
      },
      {
        title: 'Status',
        field: "status",
        render: rowData => (

          (rowData.status == 'ACTIVE') ? (<span style={{ color: "green" }}>ACTIVE</span>) : (rowData.status == 'INACTIVE') ? <span style={{ color: "red" }}>INACTIVE</span> : rowData.status
        )

      },
    ]
  };


  function handleClickEdit(rowData) {
    setId(rowData.id)
    setOpenForm(true);
  };

  function handleCloseform() {
    setOpenForm(false);
    setTimeout(() => {
      tableRef.current && tableRef.current.onQueryChange()
    }, 0);
  }

  function handleClose() {
    setOpenForm(false);

  }
  return (
    <>
      <Grid container spacing={2} sx={{ mb: 6 }} className='page-header-second'>
        <Grid item xs={9}>
          <CustomLabel labelVal="Profile Update Requests" variantVal="h3-underline" />
        </Grid>
      </Grid>
      <SmartTable
        components={{
          Toolbar: (props) => (
            <>
              <div
                style={{
                  height: "0px",
                }}
              >
              </div>
            </>
          ),
        }}
        title="Super Admin"
        columns={tableTemplate.columns}
        tableRef={tableRef}
        // data={data}
        data={query =>
          new Promise((resolve, reject) => {
            let url = `${api.onBoardTenant.changeRequest}/PENDING/status`,
              body = {
                pageSize: query.pageSize,
                pageNo: query.page
              }
            if (!_.isEmpty(filter)) {
              body = {
                ...body,
                ...filter
              }
            }
            axios.get(url, body).then(result => {
              resolve({
                data: result.data?.data ?? [],
                page: 0,
                totalCount: result.data?.data?.length ?? 0,
              })
            }).catch(err => {
              resolve({
                data: [],
                page: 0,
                totalCount: 0,
              })
            })
          })}
        options={{
          search: false,
          showTitle: false,
          actionsColumnIndex: -1,
          headerStyle: { position: "sticky", top: 0 },
        }}
        actions={[
          {
            icon: () => (<EditIcon color="primary" />),
            tooltip: 'edit',
            onClick: (event, rowData) => handleClickEdit(rowData)
          },
          //   {
          //     icon: () => (<VisibilityIcon color="primary" />),
          //     tooltip: 'view',
          //     onClick: (event, rowData) => handleClickView(rowData)
          //   }
        ]}
        localization={{
          body: {
            emptyDataSourceMessage: "No records to display",
            filterRow: {
              filterTooltip: "Filter",
              filterPlaceHolder: "Filtaaer",
            },
          },
        }}
      // style={{ borderRadius: 16, boxShadow: '0px 10px 10px 4px rgb(0 0 0 / 4%)' }}
      />

      <Dialog
        // onClose={handleClose}
        open={openform}
        maxWidth="false"
        PaperProps={{
          sx: {
            width: "90%"

          }
        }}
        style={{ borderRadius: "4rem" }}
      >

        <DialogTitle style={{ background: "#f5f2f2" }}>
          <h1 >Profile Update Request</h1>
          <CloseIcon onClick={handleClose} style={{ cursor: "pointer", position: "absolute", top: "14px", right: "14px", color: "#4f4f4f", fontWeight: "bold" }} />
        </DialogTitle>
        <DialogContent style={{ padding: "0px", }}  >
          <div >
            <CreateForm id={id} style={{ padding: "1rem", marginTop: "60px" }} close={handleCloseform} />
          </div>

        </DialogContent>
      </Dialog>

    </>
  );
};

export default List;
