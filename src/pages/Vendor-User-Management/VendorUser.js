import React, {useEffect, useState} from 'react';
import {Grid, Box} from '@mui/material';
import CustomLabel from 'pages/common/CustomLabel';
import AppTooltip from '@crema/core/AppTooltip';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import SmartForm from '@smart-form';
import regex from '@regex';
import EditIcon from '@mui/icons-material/Edit';
import SmartTable from '@smart-table';
import RestoreIcon from '@mui/icons-material/Restore';
import Api from '@api';
import axios from 'axios';
import {Delete, FastForward} from '@mui/icons-material';
import PopEdit from '@editpopup';
import {toast} from 'react-toastify';
import Confirm from '@confirmation-box';



const VendorUser = () => {
  const [openform, setOpenForm] = useState(false);
  const [userData, setUserData] = useState([]);
  const [openDialog, setopenDialog] = useState(false);
  const [editData, setEditData] = useState([])
  const [showbtn, setshowbtn] = useState(true);
  const [deleteData, setDeleteData] = useState([])
  const [restoreData, setRestoreData] = useState([])
  const [openConfirmbox, setOpenConfirmBox] = useState(false);
  const [openConfirmboxReactivate, setOpenConfirmBoxReactivate] = useState(false);
  

  const vendorID = localStorage.getItem('userID')


  const getAllUser = () => {
    axios
      .get(Api.baseUri + `/userauth/user-account/get-All-Users/${vendorID}`)
      .then((response) => {
        setUserData(response.data.data);
      })
      .catch((err) => console.log(err));
  }
  useEffect(() => {
    getAllUser();

  }, [])

  const handleSubmit = async (val) => {
    setshowbtn(false);
    let postData = val?.data;
    postData.vendorId = vendorID;
    axios
      .post(Api.baseUri + '/userauth/user-account', postData)
      .then((res) => {
       if (res?.status === 200) {
         toast.success('User submitted successfully');
         setOpenForm(false);
         getAllUser();
         setshowbtn(true);
       } else if (res?.status === 500) {
         toast.error(res?.data?.message);
       } else {
         toast.error('Something went wrong');
         setshowbtn(true);
       }
      })
      .catch((err) => {
        toast.error('Somethig went wrong');
        setshowbtn(true);
      });
  };

  const tableTemplate = {
    columns: [
      {
        title: 'User Name',
        field: 'userName',
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
        field: 'userStatus',
        render: (rd) => {
          return (
            <div
              style={{
                color: rd?.userStatus == 'ACTIVE' ? 'green' : 'rgb(188, 8, 5)',
              }}
            >
              {rd?.userStatus == 'ACTIVE' ? 'Active' : 'Inactive'}
            </div>
          );
        },
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
  };

  let template = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    description: 'Form for creating user',
    sections: [
      {
        layout: {column: 2, spacing: 1, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'text',
            name: 'userName',
            id: 'userName',
            title: 'User Name',
            pattern: {
              value: regex.maxSize150,
              message: 'Please enter  valid name',
            },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },

          {
            type: 'text',
            name: 'mobileNo',
            id: 'mobileNo',
            title: 'Mobile No.',
            isNumber: true,
            maxChar: 10,
            pattern: {
              value: regex.phoneReg,
              message: 'Please enter valid Mobile No.',
            },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'text',
            name: 'emailId',
            id: 'emailId',
            title: 'Email Id',
            pattern: {
              value: regex.emailReg,
              message: 'Please enter valid email',
            },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
        ],
      },
    ],
  };


  let EditTemplate = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    title: 'User',
    description: 'Form for applying Job',

    fields: [
      {
        type: 'text',
        name: 'userName',
        id: 'userName',
        title: 'User Name',
        pattern: {
          value: regex.maxSize150,
          message: 'Please enter  valid name',
        },
        validationProps: {
          required: 'This is a mandatory field',
        },
      },

      {
        type: 'text',
        name: 'mobileNo',
        id: 'mobileNo',
        title: 'Mobile No.',
        isNumber: true,
        maxChar: 10,
        pattern: {
          value: regex.phoneReg,
          message: 'Please enter valid Mobile No.',
        },
        validationProps: {
          required: 'This is a mandatory field',
        },
      },
      {
        type: 'text',
        name: 'emailId',
        id: 'emailId',
        title: 'Email Id',
        pattern: {
          value: regex.emailReg,
          message: 'Please enter  valid email',
        },
        validationProps: {
          required: 'This is a mandatory field',
        },
      },
    ],
  };

  const handleEdit = (value) => {
        if (value?.close) {
          setopenDialog(false);
          return;
        }

         let postData = value?.data;
         postData.id = editData?.id;
         axios
           .post(Api.baseUri + '/userauth/user-account/update', postData)
           .then((res) => {
             if (res?.data?.status == '200') {
               toast.success('User updated successfully');
               editData(null);
                getAllUser();
               setopenDialog(false);
             }
           })
           .catch((err) => {
             toast.error(err ?? 'Something went wrong');
             setopenDialog(false);
           });
  }

  function closeConfirmBox(dd, reason) {
    if (dd == 'YES') {
      axios
        .post(
          Api.baseUri +
            `/userauth/user-account/deActivate-User-By-id/${deleteData?.id}/${
              reason?.length ? reason : null
            }`,
        )
        .then((response) => {
          if (response?.data?.status === 200) {
            setOpenConfirmBox(false);
             getAllUser();
            toast.success('User deactivated successfully.');
          } else {
            toast.error(res?.data?.message || 'Something went wrong.');
          }
        })
        .catch((err) => {
          toast.error('Something went wrong.');
        });
    }
    if (dd == 'NO') {
      setOpenConfirmBox(false);
    }
  }

  function closeConfirmBoxReactivate(dd, reason) {
    if (dd == 'YES') {
      axios
        .post(
          Api.baseUri +
            `/userauth/user-account/Activate-User-By-id/${restoreData?.id}/${
              reason?.length ? reason : null
            }`,
        )
        .then((response) => {
          if (response?.data?.status === 200) {
            setRestoreData(null);
            setOpenConfirmBoxReactivate(false);
             getAllUser();
            toast.success('User re-activated successfully.');
          } else {
            toast.error(res?.data?.message || 'Something went wrong.');
          }
        })
        .catch((err) => {
          toast.error('Something went wrong.');
        });
    }
    if (dd == 'NO') {
      setOpenConfirmBoxReactivate(false);
    }
  }




  return (
    <div>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={4}>
          <CustomLabel labelVal='Users' variantVal='h3-underline' />
        </Grid>
        <Grid item xs={8}>
          <Box display='flex' justifyContent='flex-end'>
            <div className='left-seperator'>
              <AppTooltip placement={'top'} title={'Add New User'}>
                <img
                  src='/assets/images/title-icon/add penalty.svg'
                  className='title-icons-mui'
                  onClick={() => {
                    setOpenForm(true);
                  }}
                />
              </AppTooltip>
            </div>
          </Box>
        </Grid>
      </Grid>

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
        title='Nodal Point List'
        columns={tableTemplate.columns}
        data={userData || []}
        options={{
          search: false,
          showTitle: false,
          selection: false,

          sorting: true,
          actionsColumnIndex: -1,
          headerStyle: {position: 'sticky', top: 0},
          color: 'primary',
        }}
        actions={[
          (rd_) => ({
            icon: () => (
              <EditIcon
                variant='contained'
                color='primary'
                size='small'
                fontSize='small'
                style={{opacity: rd_?.userStatus == 'INACTIVE' ? '0.2' : ' '}}
              />
            ),
            tooltip: 'Edit',
            iconProps: {
              fontSize: 'small',
              color: 'primary',
              classes: 'filled',
            },
            onClick: (event, rowData) => {
              if (rowData?.userStatus == 'INACTIVE') {
                return;
              }
              setopenDialog(true);
              setEditData(rowData);
            },
          }),

          (rd_) => ({
            icon: () => (
              <Delete
                color='primary'
                style={{
                  color: '#bc0805',
                  opacity: rd_.userStatus == 'INACTIVE' ? '0.3' : '',
                }}
              />
            ),
            tooltip: 'Deactivate',
            onClick: (event, rowData) => {
              if (rd_.userStatus == 'ACTIVE') {
                setOpenConfirmBox(true);
                setDeleteData(rowData);
              }
            },
          }),
          (rd_) => ({
            icon: () => (
              <RestoreIcon
                variant='contained'
                color='primary'
                size='small'
                fontSize='small'
                style={{
                  opacity: rd_.userStatus == 'ACTIVE' ? '0.3' : '',
                }}
              />
            ),
            tooltip: 'Restore',
            iconProps: {
              fontSize: 'small',
              color: 'primary',
              classes: 'filled',
            },
            onClick: (event, rowData) => {
              if (rd_.userStatus == 'INACTIVE') {
                setOpenConfirmBoxReactivate(true);
                setRestoreData(rowData);
              }
            },
          }),
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
        onClose={() => {
          setOpenForm(false);
        }}
        open={openform}
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
              <h1 style={{marginTop: '1.5rem'}}>Add Users</h1>
              <CloseIcon
                onClick={() => {
                  setOpenForm(false);
                }}
                style={{
                  marginTop: '1.4rem',
                  color: '#4f4f4f',
                  fontWeight: 'bold',
                }}
              />
            </div>
            <div style={{padding: '2rem', paddingTop: '0rem'}}>
              <SmartForm
                template={template}
                onSubmit={handleSubmit}
                buttons={['submit']}
              />
            </div>
          </DialogContent>
        </div>
      </Dialog>

      {editData && editData.id && (
        <PopEdit
          title={editData?.userName}
          poptemplate={EditTemplate}
          defaultValues={editData}
          openDialog={openDialog}
          setopenDialog={setopenDialog}
          showbtn={showbtn}
          buttons={['Update']}
          popAction={handleEdit}
        />
      )}

      <Confirm
        open={openConfirmbox}
        header={'Confirm to Deactivate'}
        cnfMsg={'Are you sure, You want to deactivate the User?'}
        handleClose={closeConfirmBox}
        reason={true}
      />

      <Confirm
        open={openConfirmboxReactivate}
        header={'Confirm to Reactivate'}
        cnfMsg={'Are you sure, You want to reactivate the User?'}
        handleClose={closeConfirmBoxReactivate}
        reason={true}
      />
    </div>
  );
};

export default VendorUser;
