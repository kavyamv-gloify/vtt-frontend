import React, {useEffect, useState} from 'react';
import SmartTable from '@smart-table';
import SmartForm from '@smart-form';
import EditIcon from '@mui/icons-material/Edit';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import _, {assign, values} from 'lodash';
import Api from '@api';
import {useAuthUser} from '@crema/utility/AuthHooks';
import Button from '@mui/material/Button';
import {
  Autocomplete,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from '@mui/material';
import CustomLabel from 'pages/common/CustomLabel';
import AppTooltip from '@crema/core/AppTooltip';
import CloseIcon from '@mui/icons-material/Close';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import DeleteIcon from '@mui/icons-material/Delete';
import {toast} from 'react-toastify';
import Confirm from '@confirmation-box';
import RestoreIcon from '@mui/icons-material/Restore';

const RoleMaster = () => {
  const [openDial, setopenDial] = useState(false);
  const [success, setSuccess] = useState(true);
  const [roleData, setRoleData] = useState([]);
  const [savedObj, setsavedObj] = useState({});
  const [delText, setDelText] = useState('');
  const [delClicked, setdelClicked] = useState(false);
  const [openAssociate, setopenAssociate] = useState(false);
  const [openEdit, setopenEdit] = useState(false);
  const navigate = useNavigate();
  const {user} = useAuthUser();
  const [corporateList, setCorporateList] = React.useState([]);
  const [corpVal, setCorpVal] = React.useState([]);

  React.useEffect(() => {
    axios
      .get(Api.baseUri + '/user-reg/corporate-reg?page=0&size=1000')
      .then((response) => {
        let array = [];
        let array2 = [];
        response?.data?.data?.body?.['CorporateList']?.map((el, ind) => {
          array2.push(el.companyName);
          array.push({
            title:
              el.companyName + (array2?.includes(el.companyName) ? ind : ''),
            title2:
              el.companyName +
              ' - ' +
              el?.companyAddress?.addressName?.split(',')[0] +
              ', ' +
              el?.companyAddress?.addressName?.split(',')[1] +
              ', ' +
              el?.companyAddress?.city,
            value: el?.id,
            imgsrc: Api?.imgUrl + el?.companyRegDoc,
          });
        });
        setCorporateList(array);
      })
      .catch((err) => {
        setCorporateList([]);
      });
  }, []);

  function assignFunc() {
    setSuccess(false);
    let tem_corp = [];
    corpVal?.map((el) => {
      tem_corp.push(el.value);
    });
    axios
      .put(Api.baseUri + '/user-reg/user-role/update-user-role', {
        ...savedObj,
        roleFor: 'EMPLOYEE',
        corporateIds: tem_corp,
      })
      .then((res) => {
        setSuccess(true);
        if (res?.data?.status == '200') {
          setsavedObj({});
          setopenAssociate(false);
          setDelText('');
          getAllRoles();
          toast.success('Role assigned successfully.');
        } else {
          toast.error(res?.data?.message || 'Something went wrong.');
        }
      })
      .catch((err) => {
        setSuccess(true);
        toast.error('Something went wrong.');
      });
  }

  useEffect(() => {
    getAllRoles();
  }, []);
  function getAllRoles() {
    axios
      .get(Api.baseUri + '/user-reg/user-role/get-all-user-role')
      .then((res) => {
        setRoleData(res?.data?.data || []);
      })
      .catch((err) => {
        setRoleData([]);
      });
  }
  function onEdit(values) {
    setSuccess(false);
    if (values?.type == 'DELETE') {
      axios
        .put(Api.baseUri + '/user-reg/user-role/update-user-role', savedObj)
        .then((res) => {
          setSuccess(true);
          if (res?.data?.status == '200') {
            setsavedObj({});
            setdelClicked(false);
            setDelText('');
            getAllRoles();
            toast.success('Role ' + delText + 'd successfully.');
          } else {
            toast.error(res?.data?.message || 'Something went wrong.');
          }
        })
        .catch((err) => {
          setSuccess(true);
          toast.error('Something went wrong.');
        });
      return;
    }
    axios
      .put(Api.baseUri + '/user-reg/user-role/update-user-role', {
        ...values?.data,
        roleFor: 'EMPLOYEE',
      })
      .then((res) => {
        setSuccess(true);
        if (res?.data?.status == '200') {
          setopenEdit(false);
          setsavedObj({});
          getAllRoles();
          toast.success('Role updated successfully.');
        } else {
          toast.error(res?.data?.message || 'Something went wrong.');
        }
      })
      .catch((err) => {
        setSuccess(true);
        toast.error('Something went wrong.');
      });
  }
  function onSubmit(values) {
    setSuccess(false);
    axios
      .post(Api.baseUri + '/user-reg/user-role/save-user-role', {
        ...values?.data,
        roleFor: 'EMPLOYEE',
        corporateIds: [],
        roleCode:
          values?.data?.roleName?.toUpperCase() + '-' + roleData?.length,
      })
      .then((res) => {
        setSuccess(true);
        if (res?.data?.status == '200') {
          toast.success('Role created successfully.');
          setopenDial(false);
          getAllRoles();
        } else {
          toast.error(res?.data?.message || 'Something went wrong.');
        }
      })
      .catch((err) => {
        setSuccess(true);
        toast.error('Something went wrong.');
      });
  }
  let template = {
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
            type: 'text',
            name: 'roleName',
            field: 'roleName',
            title: 'Role Name',
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'text',
            name: 'description',
            field: 'description',
            title: 'Description',
            // validationProps: {
            //     required: 'This is a mandatory field'
            // }
          },
        ],
      },
    ],
  };

  const tableTemplate = {
    columns: [
      {
        title: 'Role Name',
        field: 'roleName',
      },
      {
        title: 'Description',
        field: 'description',
      },
      {
        title: 'Status',
        field: 'status',
      },
      {
        title: 'Created On',
        field: 'createdOn',
        type: 'datetime',
      },
    ],
  };

  function handleClick(rowData, type) {
    if (type == 'ACTIVE' || type == 'INACTIVE') {
      let temp = {
        id: rowData?.id,
        roleName: rowData?.roleName,
        description: rowData?.description,
        corporateIds: rowData?.corporateIds,
        status: type,
        createdOn: rowData?.createdOn,
        createdBy: rowData?.createdBy,
        roleCode: rowData?.roleCode,
        roleFor: 'EMPLOYEE',
      };
      setDelText(type == 'ACTIVE' ? 'reactivate' : 'deactivate');
      setsavedObj(temp);
      setdelClicked(true);
    }
    if (type == 'ASSIGN') {
      if (corporateList?.length) {
        let temp = rowData?.corporateIds || [];
        let t_val = [];
        corporateList?.map((elements) => {
          if (temp?.includes(elements?.value)) {
            t_val.push(elements);
          }
        });
        setCorpVal([...t_val]);
      }
      let temp = {
        id: rowData?.id,
        roleName: rowData?.roleName,
        description: rowData?.description,
        corporateIds: rowData?.corporateIds,
        status: rowData?.status,
        createdOn: rowData?.createdOn,
        createdBy: rowData?.createdBy,
        roleCode: rowData?.roleCode,
        roleFor: 'EMPLOYEE',
      };
      setsavedObj(temp);
      setopenAssociate(true);
    }
    if (type == 'EDIT') {
      setopenEdit(true);
      let temp = {
        id: rowData?.id,
        roleName: rowData?.roleName,
        description: rowData?.description,
        corporateIds: rowData?.corporateIds,
        status: 'ACTIVE',
        createdOn: rowData?.createdOn,
        createdBy: rowData?.createdBy,
        roleCode: rowData?.roleCode,
        roleFor: 'EMPLOYEE',
      };
      setsavedObj(temp);
    }
  }

  return (
    <>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={9}>
          <CustomLabel labelVal="Roles' List" variantVal='h3-underline' />
        </Grid>
        <Grid item xs={3}>
          <Box display='flex' justifyContent='flex-end'>
            <div className='left-seperator'>
              <AppTooltip placement={'top'} title={'Add Role'}>
                <img
                  src='/assets/images/title-icon/add-driver.svg'
                  className='title-icons-mui'
                  onClick={(e) => {
                    setopenDial(true);
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
        title='Bank Detail'
        columns={tableTemplate.columns}
        data={roleData}
        options={{
          search: false,
          showTitle: false,
          actionsColumnIndex: -1,
          headerStyle: {position: 'sticky', top: 0},
        }}
        actions={[
          (rd) => ({
            icon: () => (
              <AssignmentTurnedInIcon
                color='primary'
                sx={{opacity: rd?.status == 'ACTIVE' ? '1' : '0.3'}}
              />
            ),
            tooltip: 'Assign',
            onClick: (event, rowData) => {
              if (rd?.status == 'ACTIVE') handleClick(rowData, 'ASSIGN');
            },
          }),
          (rd) => ({
            icon: () => (
              <EditIcon
                color='primary'
                sx={{opacity: rd?.status == 'ACTIVE' ? '1' : '0.3'}}
              />
            ),
            tooltip: 'Edit',
            onClick: (event, rowData) => {
              if (rd?.status == 'ACTIVE') handleClick(rowData, 'EDIT');
            },
          }),
          (rd) => ({
            icon: () => (
              <DeleteIcon
                sx={{
                  color: '#bc0906',
                  opacity: rd?.status == 'ACTIVE' ? '1' : '0.3',
                }}
              />
            ),
            tooltip: 'Deactivate',
            onClick: (event, rowData) => {
              if (rd?.status == 'ACTIVE') handleClick(rowData, 'INACTIVE');
            },
          }),
          (rd) => ({
            icon: () => (
              <RestoreIcon
                color='primary'
                sx={{opacity: rd?.status == 'INACTIVE' ? '1' : '0.3'}}
              />
            ),
            tooltip: 'Reactivate',
            onClick: (event, rowData) => {
              if (rd?.status == 'INACTIVE') handleClick(rowData, 'ACTIVE');
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
        open={openDial}
        onClose={() => {
          setopenDial(false);
        }}
        style={{borderRadius: '4rem'}}
        PaperProps={{
          sx: {
            width: '500px',
          },
        }}
      >
        <DialogTitle
          style={{
            background: '#f5f2f2',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <h1>Create Role</h1>
          <CloseIcon
            onClick={() => {
              setopenDial(false);
            }}
            style={{color: '#4f4f4f', fontWeight: 'bold'}}
          />
        </DialogTitle>
        <DialogContent style={{padding: '20px', paddingTop: '0px'}}>
          <div>
            <SmartForm
              template={template}
              onSubmit={onSubmit}
              buttons={['submit']}
              success={success}
            />
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={openEdit}
        onClose={() => {
          setopenEdit(false);
        }}
        style={{borderRadius: '4rem'}}
        PaperProps={{
          sx: {
            width: '500px',
          },
        }}
      >
        <DialogTitle
          style={{
            background: '#f5f2f2',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <h1>Update Role</h1>
          <CloseIcon
            onClick={() => {
              setopenEdit(false);
            }}
            style={{color: '#4f4f4f', fontWeight: 'bold'}}
          />
        </DialogTitle>
        <DialogContent style={{padding: '20px', paddingTop: '0px'}}>
          <div>
            <SmartForm
              defaultValues={savedObj}
              template={template}
              onSubmit={onEdit}
              buttons={['update']}
              success={success}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openAssociate}
        onClose={() => {
          setopenAssociate(false);
        }}
        style={{borderRadius: '4rem'}}
        PaperProps={{
          sx: {
            width: '500px',
          },
        }}
      >
        <DialogTitle
          style={{
            background: '#f5f2f2',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <h1>Associate Corporates</h1>
          <CloseIcon
            onClick={() => {
              setopenAssociate(false);
            }}
            style={{color: '#4f4f4f', fontWeight: 'bold'}}
          />
        </DialogTitle>
        <DialogContent style={{padding: '20px'}}>
          <div style={{width: '100%', textAlign: 'center'}}>
            <Autocomplete
              id='country-select-demo'
              sx={{width: '100%'}}
              options={corporateList || []}
              value={corpVal || []}
              multiple
              limitTags={1}
              autoHighlight
              onChange={(e, v, r) => {
                setCorpVal(v || []);
              }}
              getOptionLabel={(option) => option.title}
              renderOption={(props, option, ind) => (
                <Box
                  key={ind + '>>'}
                  component='li'
                  sx={{'& > img': {mr: 2, flexShrink: 0}}}
                  {...props}
                >
                  <img loading='lazy' width='20' src={option.imgsrc} alt='' />
                  {option.title2}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label='Select Corporate'
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: 'new-password', // disable autocomplete and autofill
                  }}
                />
              )}
            />
            <Button
              id='btnMui123'
              disabled={!corpVal?.length}
              variant='contained'
              sx={{mt: 4}}
              onClick={() => {
                assignFunc();
              }}
            >
              Assign
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Confirm
        open={delClicked}
        header={'Confirm to ' + delText}
        cnfMsg={'Are you sure, You want to ' + delText + ' it?'}
        handleClose={(d) => {
          if (d == 'YES') {
            onEdit({type: 'DELETE'});
          } else {
            setdelClicked(false);
            setDelText('');
          }
        }}
      />
    </>
  );
};

export default RoleMaster;
