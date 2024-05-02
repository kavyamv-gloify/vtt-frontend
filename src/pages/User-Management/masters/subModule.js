import React, {useEffect, useState} from 'react';
import SmartTable from '@smart-table';
import SmartForm from '@smart-form';
import EditIcon from '@mui/icons-material/Edit';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import _, {values} from 'lodash';
import Api from '@api';
import {useAuthUser} from '@crema/utility/AuthHooks';
import Button from '@mui/material/Button';
import {Box, Dialog, DialogContent, DialogTitle, Grid} from '@mui/material';
import CustomLabel from 'pages/common/CustomLabel';
import AppTooltip from '@crema/core/AppTooltip';
import CloseIcon from '@mui/icons-material/Close';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import DeleteIcon from '@mui/icons-material/Delete';
import {toast} from 'react-toastify';
import regex from '@regex';
import Confirm from '@confirmation-box';
import RestoreIcon from '@mui/icons-material/Restore';

const SubModule = ({id, moduleName}) => {
  const [openDial, setopenDial] = useState(false);
  const [defVal, setDefVal] = useState({});
  const [editDial, setEditDial] = useState(false);
  const [success, setSuccess] = useState(true);
  const [subModuleData, setSubModuleData] = useState([]);
  const [selectedData, setselectedData] = useState();
  const [clickedDel, setclickedDel] = useState(false);
  const [delText, setDelText] = useState('');
  const navigate = useNavigate();
  const {user} = useAuthUser();
  useEffect(() => {
    if (id) getAllModules();
  }, [id]);
  function getAllModules() {
    axios
      .get(
        Api.baseUri +
          '/user-reg/user-sub-module/get-all-user-sub-module-by-moduleId/' +
          id,
      )
      .then((res) => {
        setSubModuleData(res?.data?.data || []);
      })
      .catch((err) => {
        setSubModuleData([]);
      });
  }
  function onSubmit(values) {
    setSuccess(false);
    let arr = [];
    for (const [key, value] of Object.entries(values?.data?.actions || {})) {
      arr.push(value?.myactions);
    }
    axios
      .post(Api.baseUri + '/user-reg/user-sub-module/save-user-sub-module', {
        ...values?.data,
        moduleName: moduleName,
        moduleId: id,
        actions: arr,
      })
      .then((res) => {
        setSuccess(true);
        if (res?.data?.status == '200') {
          setopenDial(false);
          getAllModules();
          toast.success('Module created successfully.');
        } else {
          toast.error(res?.data?.message || 'Something went wrong.');
        }
      })
      .catch((err) => {
        setSuccess(true);
        toast.error('Something went wrong.');
      });
  }
  function onEdit(values) {
    setSuccess(false);
    if (values?.type == 'DELETE') {
      axios
        .put(
          Api.baseUri + '/user-reg/user-sub-module/update-user-sub-module',
          selectedData,
        )
        .then((res) => {
          setSuccess(true);
          if (res?.data?.status == '200') {
            setselectedData({});
            setclickedDel(false);
            setDelText('');
            getAllModules();
            toast.success('Sub-module ' + delText + 'd successfully.');
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
    let arr = [];
    for (const [key, value] of Object.entries(values?.data?.actions || {})) {
      arr.push(value?.myactions);
    }
    axios
      .put(Api.baseUri + '/user-reg/user-sub-module/update-user-sub-module', {
        ...values?.data,
        actions: arr,
      })
      .then((res) => {
        setSuccess(true);
        if (res?.data?.status == '200') {
          setEditDial(false);
          setDefVal({});
          getAllModules();
          toast.success('Module updated successfully.');
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
            name: 'subModuleName',
            field: 'subModuleName',
            title: 'Sub-Module Name',
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'array',
            name: 'actions',
            id: 'actions',
            layout: {
              column: 1,
              spacing: 2,
              size: 'small',
              label: 'blank',
              type: 'table',
            },
            columns: ["Action's Name"],
            subFields: [
              {
                type: 'text',
                name: 'myactions',
                id: 'myactions',
                title: 'Action Name',
                infoMessage: [
                  'Alphanumeric characters are allowed starting with @ ',
                  'Maximum length should be 50  characters',
                  'e.g.: @gmail.com ',
                ],
                pattern: {
                  value: regex.max50,
                  message: 'Please enter valid code with max 50 characters',
                },
                validationProps: {
                  required: 'This is a mandatory field',
                },
              },
            ],
          },
        ],
      },
    ],
  };

  const tableTemplate = {
    columns: [
      {
        title: 'Sub-Module Name',
        field: 'subModuleName',
      },
      {
        title: 'Status',
        field: 'status',
      },
      {
        title: 'Created On',
        field: 'createdOn',
        type: 'date',
      },
    ],
  };

  function handleClick(rowData, type) {
    if (type == 'EDIT') {
      let arr = [];
      rowData?.actions?.map((el) => {
        arr.push({myactions: el});
      });
      setDefVal({
        id: rowData?.id,
        actions: arr,
        subModuleName: rowData?.subModuleName,
        moduleName: rowData?.moduleName,
        moduleId: rowData?.moduleId,
        status: rowData?.status,
        createdOn: rowData?.createdOn,
        createdBy: rowData?.createdBy,
      });
      // , updatedOn: rowData?.updatedOn, updatedBy: rowData?.updatedBy
      setEditDial(true);
    }
    if (type == 'INACTIVE' || type == 'ACTIVE') {
      let t_obj = {
        id: rowData?.id,
        subModuleName: rowData?.subModuleName,
        status: type,
        moduleId: rowData?.moduleId,
        moduleName: rowData?.moduleName,
        actions: rowData?.actions,
        createdOn: rowData?.createdOn,
        createdBy: rowData?.createdBy,
      };
      setselectedData(t_obj);
      setclickedDel(true);
      setDelText(type == 'ACTIVE' ? 'reactivate' : 'deactivate');
    }
  }

  return (
    <>
      <div style={{display: 'flex', justifyContent: 'right', margin: '10px'}}>
        <Button
          id='btnMui123'
          variant='outlined'
          onClick={() => {
            setopenDial(true);
          }}
        >
          Add New
        </Button>
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
        title='Bank Detail'
        columns={tableTemplate.columns}
        data={subModuleData}
        options={{
          search: false,
          showTitle: false,
          actionsColumnIndex: -1,
          headerStyle: {position: 'sticky', top: 0},
        }}
        actions={[
          (rd) => ({
            icon: () => (
              <EditIcon
                style={{opacity: rd.status == 'INACTIVE' ? '0.3' : ''}}
                color='primary'
              />
            ),
            tooltip: 'Edit',
            onClick: (event, rowData) => {
              if (rd.status != 'INACTIVE') handleClick(rowData, 'EDIT');
            },
          }),
          (rd) => ({
            icon: () => (
              <DeleteIcon
                sx={{
                  color: '#bc0906',
                  opacity: rd.status == 'INACTIVE' ? '0.3' : '',
                }}
              />
            ),
            tooltip: 'Deactivate',
            onClick: (event, rowData) => {
              if (rd.status != 'INACTIVE') handleClick(rowData, 'INACTIVE');
            },
          }),
          (rd) => ({
            icon: () => (
              <RestoreIcon
                sx={{opacity: rd.status !== 'INACTIVE' ? '0.3' : ''}}
              />
            ),
            tooltip: 'Reactivate',
            onClick: (event, rowData) => {
              if (rd.status == 'INACTIVE') handleClick(rowData, 'ACTIVE');
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
        PaperProps={{sx: {width: '500px'}}}
      >
        <DialogTitle
          style={{
            background: '#f5f2f2',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <h1>Create Sub-Module</h1>
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
        open={editDial}
        onClose={() => {
          setEditDial(false);
          setDefVal({});
        }}
        style={{borderRadius: '4rem'}}
        PaperProps={{sx: {width: '500px'}}}
      >
        <DialogTitle
          style={{
            background: '#f5f2f2',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <h1>Edit Sub-Module</h1>
          <CloseIcon
            onClick={() => {
              setEditDial(false);
              setDefVal({});
            }}
            style={{color: '#4f4f4f', fontWeight: 'bold'}}
          />
        </DialogTitle>
        <DialogContent style={{padding: '20px', paddingTop: '0px'}}>
          <div>
            <SmartForm
              defaultValues={defVal || {}}
              template={template}
              onSubmit={onEdit}
              buttons={['update']}
              success={success}
            />
          </div>
        </DialogContent>
      </Dialog>
      <Confirm
        open={clickedDel}
        header={'Confirm to ' + delText}
        cnfMsg={'Are you sure, You want to ' + delText + ' it?'}
        handleClose={(d) => {
          if (d == 'YES') {
            onEdit({type: 'DELETE'});
          } else {
            setclickedDel(false);
            setDelText('');
          }
        }}
      />
    </>
  );
};

export default SubModule;
