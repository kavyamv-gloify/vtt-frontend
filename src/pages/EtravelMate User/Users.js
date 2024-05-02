import {useNavigate} from 'react-router-dom';
// import SmartForm from '@smart-form';
import {useAuthUser} from '@crema/utility/AuthHooks';
import regex from '@regex';
import axios from 'axios';
import Api from '@api';
import SnackbarCustom from 'pages/thirdParty/SnackBar/SnackBarMsg';
import {SettingsPowerRounded} from '@mui/icons-material';
import AppLoader from '@crema/core/AppLoader';
import {toast} from 'react-toastify';
import SmartForm from '@smart-form';
import {useParams} from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import SmartTable from '@smart-table';
import EditIcon from '@mui/icons-material/Edit';
import _, {set} from 'lodash';
import PopEdit from '@editpopup';
import {Box, Button, Grid} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
// import DialogForm from '@mui/material/DialogForm';
import CloseIcon from '@mui/icons-material/Close';
import ExcelContainer from '@excelupload';
import {Delete} from '@mui/icons-material';
import CustomLabel from 'pages/common/CustomLabel';
import AppTooltip from '@crema/core/AppTooltip';
import Confirm from '@confirmation-box';
import {useSelector} from 'react-redux';
import QuickSearchPage from '@quick-search';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import SmartFilter from '@smart-filter';
import RestoreIcon from '@mui/icons-material/Restore';
import VisibilityIcon from '@mui/icons-material/Visibility';
import moment from 'moment';
import DetailPage from './DetailPage';
const Users = () => {
  const [showbtn, setshowbtn] = useState(true);
  const [data, setData] = useState();
  const [userList, setUserList] = useState();
  const [openform, setOpenForm] = useState(false);
  const [openDialog, setopenDialog] = useState(false);
  const [openConfirmbox, setOpenConfirmBox] = useState(false);
  const [openConfirmboxReactivate, setOpenConfirmBoxReactivate] =
    useState(false);
  const [openDetailPage, setOpenDetailPage] = useState(false);
  function handleSubmit(val) {
    setshowbtn(false);
    let postData = val?.data;
    axios
      .post(Api.baseUri + '/userauth/user-account/save-superAdmin', postData)
      .then((res) => {
        if (res?.data?.status == '200') {
          toast.success('User submitted successfully');
          setOpenForm(false);
          setshowbtn(true);
          getAll();
        } else if(res?.data?.status=="500") {
          toast.error(res?.data?.message)
        }
        else {
          toast.error('Something went wrong');
          setshowbtn(true);
        }
      })
      .catch((err) => {
        toast.error('Somethig went wrong');
        setshowbtn(true);
      });
  }

  function getAll() {
    axios
      .get(Api.baseUri + '/userauth/user-account/getAll-superAdmin')
      .then((res) => {
        if (res?.data?.status == '200') {
          console.log(res?.data?.data);
          setUserList(res?.data?.data ?? []);
        }
      })
      .catch((err) => {});
  }
  useEffect(() => {
    getAll();
  }, []);

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
    // title: 'Bank Type',
    description: 'Form for applying Job',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
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
              message: 'Please enter  valid amount',
            },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
        ],
      },
    ],
  };
  let Edittemplate = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    title: 'User',
    description: 'Form for applying Job',
    // sections: [
    // {
    // layout: { column: 1, spacing: 2, size: 'small', label: 'fixed' },
    // id: 'personal_information',
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
          message: 'Please enter  valid amount',
        },
        validationProps: {
          required: 'This is a mandatory field',
        },
      },
    ],
    // },
    // ]
  };

  function handleEdit(val) {
    if (val?.close) {
      setopenDialog(false);
      return;
    }
    let postData = val?.data;
    postData.id = data?.id;
    axios
      .put(Api.baseUri + '/userauth/user-account/update-superAdmin', postData)
      .then((res) => {
        if (res?.data?.status == '200') {
          toast.success('User updated successfully');
          getAll();
          setData(null);
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
            `/userauth/user-account/deActivate-superAdmin-By-id/${data?.id}/${
              reason?.length ? reason : null
            }`,
        )
        .then((response) => {
          if (response?.data?.status == '200') {
            getAll();
            setOpenConfirmBox(false);
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
            `/userauth/user-account/reActivate-superAdmin-By-id/${data?.id}/${
              reason?.length ? reason : null
            }`,
        )
        .then((response) => {
          if (response?.data?.status == '200') {
            getAll();
            setData(null);
            setOpenConfirmBoxReactivate(false);
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
        data={userList ?? []}
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
              setData(rowData);
            },
          }),
          // {
          //   icon: () => (
          //     <VisibilityIcon
          //       variant='contained'
          //       color='primary'
          //       size='small'
          //       fontSize='small'
          //     />
          //   ),
          //   tooltip: 'View',
          //   iconProps: {
          //     fontSize: 'small',
          //     color: 'primary',
          //     classes: 'filled',
          //   },
          //   onClick: (event, rowData) => {
          //     setOpenDetailPage(true);
          //     setData(rowData);
          //   },
          // },
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
                setData(rowData);
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
                setData(rowData);
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
        // aria-labelledby="alert-dialog-title"
        // aria-describedby="alert-dialog-description"
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
                // defaultValues={data?.id ? data : {}}
                onSubmit={handleSubmit}
                buttons={['submit']}
              />
            </div>
          </DialogContent>
        </div>
      </Dialog>

      <Dialog
        // onClose={CloseDetailPage}
        open={openDetailPage}
        maxWidth='false'
      >
        <DialogTitle style={{background: '#f4f2f2'}}>
          <h1>Users Details</h1>
          <CloseIcon
            onClick={() => {
              setOpenDetailPage(false);
            }}
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
          <DetailPage
            data={data}
            close={() => {
              setOpenDetailPage(false);
            }}
          />
        </DialogContent>
      </Dialog>
      {data && data.id && (
        <PopEdit
          title={data?.userName}
          poptemplate={Edittemplate}
          defaultValues={data}
          openDialog={openDialog}
          showbtn={showbtn}
          buttons={['Update']}
          // onChange={handleChange}
          // setVal={[{ name: "pointName", value: tempFData?.pointname }, { name: "latitude", value: tempFData?.latitude },{name:"longitude", value: tempFData?.longitude} ]}
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

export default Users;
