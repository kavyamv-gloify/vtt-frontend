import React, {useState, useEffect} from 'react';
import SmartForm from '@smart-form';
import CloseIcon from '@mui/icons-material/Close';
import regex from '@regex';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import RestoreIcon from '@mui/icons-material/Restore';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {Grid, Box} from '@mui/material';
import CustomLabel from 'pages/common/CustomLabel';
import AppTooltip from '@crema/core/AppTooltip';
import moment from 'moment';
import PopEdit from '@editpopup';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from '@mui/material';
import SmartTable from '@smart-table';
import {Delete} from '@mui/icons-material';
import Api from '@api';
import axios from 'axios';
import {toast} from 'react-toastify';
const list = () => {
  const [open, setOpen] = useState(false);
  const [openDialog, setopenDialog] = useState(false);
  const [data, setData] = useState();
  const [list, setList] = useState();
  const {user} = useAuthUser();
  const [showbtn, setshowbtn] = useState(true);
  useEffect(() => {
    getallShift();
  }, []);

  function getallShift() {
    axios
      .get(Api.baseUri + `/user-reg/driver-shift/get-shift-list-by-vendor`)
      .then((res) => {
        if (res?.data?.status == '200') {
          setList(res?.data.data);
        }
      });
  }
  function handleSubmit(value) {
    console.log('value');
    let postData = {
      shiftName: value?.data?.shiftName,
      shiftStart: value?.data?.shiftStart,
      shiftEnd: value?.data?.shiftEnd,
    };
    axios
      .post(Api.baseUri + '/user-reg/driver-shift', postData)
      .then((res) => {
        if (res?.data?.status == '200') {
          setOpen(false);
          toast.success('Shift submitted successfully');
          getallShift();
        } else {
          toast.error(res?.data?.message);

          setOpen(false);
        }
      })
      .catch((err) => {
        setOpen(false);
        toast.error('Something went wrong');
      });
  }

  const tableTemplate = {
    columns: [
      {
        title: 'Shift Start',
        field: 'shiftStart',
        type: 'date',
      },
      {
        title: 'Logout',
        field: 'shiftEnd',
        type: 'date',
      },

      {
        title: ' Shift Name',
        field: 'shiftName',
      },
      {
        title: 'Status',
        field: 'status',
        render: (rowData) =>
          rowData.status == 'ACTIVE' ? (
            <span style={{color: 'green'}}>ACTIVE</span>
          ) : rowData.status == 'INACTIVE' ? (
            <span style={{color: 'red'}}>INACTIVE</span>
          ) : (
            rowData.status
          ),
      },
      {
        title: 'Created by',
        field: 'createdOn',
        render: (rd) => {
          return (
            rd.createdBy +
            '  ' +
            moment(rd.createdOn).format('DD/MM/YYYY HH:MM')
          );
        },
      },
      {
        title: 'Last Updated',
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
    // title: 'Shift Type',
    description: 'Form for applying Job',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'section',
            layout: {column: 1, spacing: 2, size: 'medium', label: 'fixed'},
            fields: [
              {
                type: 'text',
                name: 'shiftName',
                id: 'shiftName',
                title: 'Name',
                infoMessage: [
                  'only Alphabets are allowed',
                  'Maximum length should be 50 characters',
                  'e.g.: Morning',
                ],
                pattern: {
                  value: regex.char50,
                  message: 'Please enter valid Shiftname',
                },
                validationProps: {
                  required: 'This is a mandatory field',
                },
              },
            ],
          },
          {
            type: 'section',
            layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
            fields: [
              {
                type: 'text',
                name: 'shiftStart',
                id: 'shiftStart',
                title: 'Shift Start',
                input_type: 'time',
                infoMessage: [
                  'Numerics are allowed',
                  'Time should start from 00-23',
                  'It should be followed by two digits from 00 to 59',
                  'e.g.: 00:00, 22:00',
                ],
                validationProps: {
                  required: 'This is a mandatory field',
                },
              },
              {
                type: 'text',
                name: 'shiftEnd',
                id: 'shiftEnd',
                title: 'Shift End',
                input_type: 'time',
                infoMessage: [
                  'Numerics are allowed',
                  'Time should start from 00-23',
                  'It should be followed by two digits from 00 to 59',
                  'e.g.: 00:00, 22:00',
                ],
                // pattern: {
                //     value: regex.hhmmReg,
                //     message: 'Please enter valid Time (i.e.: 23:59, 00:00)'
                // },
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

  function handleEdit(val) {
    if (val?.close) {
      setOpen(false);
      return;
    }
    let postData = val?.data;
    postData.id = data?.id;
    axios
      .put(Api.baseUri + '/user-reg/driver-shift', postData)
      .then((res) => {
        if (res?.data?.status == '200') {
          toast.success('User updated successfully');
          getallShift();
          setData(null);
          setopenDialog(false);
        }
      })
      .catch((err) => {
        toast.error(err ?? 'Something went wrong');
        setOpen(false);
      });
  }

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
        name: 'shiftName',
        id: 'shiftName',
        title: 'Name',
        infoMessage: [
          'only Alphabets are allowed',
          'Maximum length should be 50 characters',
          'e.g.: Morning',
        ],
        pattern: {
          value: regex.char50,
          message: 'Please enter valid Shiftname',
        },
        validationProps: {
          required: 'This is a mandatory field',
        },
      },
      {
        type: 'text',
        name: 'shiftStart',
        id: 'shiftStart',
        title: 'Shift Start',
        input_type: 'time',
        infoMessage: [
          'Numerics are allowed',
          'Time should start from 00-23',
          'It should be followed by two digits from 00 to 59',
          'e.g.: 00:00, 22:00',
        ],
        validationProps: {
          required: 'This is a mandatory field',
        },
      },
      {
        type: 'text',
        name: 'shiftEnd',
        id: 'shiftEnd',
        title: 'Shift End',
        input_type: 'time',
        infoMessage: [
          'Numerics are allowed',
          'Time should start from 00-23',
          'It should be followed by two digits from 00 to 59',
          'e.g.: 00:00, 22:00',
        ],
        // pattern: {
        //     value: regex.hhmmReg,
        //     message: 'Please enter valid Time (i.e.: 23:59, 00:00)'
        // },
        validationProps: {
          required: 'This is a mandatory field',
        },
      },
    ],
  };

  return (
    <div>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={12} sm={3} md={3} sx={{mb: 2}}>
          <div>
            <CustomLabel labelVal='Shifts' variantVal='h3-underline' />
          </div>
          <div></div>
        </Grid>
        <Grid item xs={12} sm={9} md={9} sx={{paddingTop: '0px !important'}}>
          <Box display='flex' justifyContent='flex-end' alignItems='center'>
            <div className='left-seperator'>
              <AppTooltip placement={'top'} title={"Add Driver's New Shift"}>
                <img
                  src='/assets/images/title-icon/add shift.svg'
                  className='title-icons-mui'
                  onClick={() => {
                    setOpen(true);
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
        title='Shift Details'
        columns={tableTemplate.columns}
        data={list || []}
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
                color='primary'
                style={{opacity: rd?.status == 'INACTIVE' ? '0.3' : ' '}}
              />
            ),
            tooltip: 'Edit',
            onClick: (event, rowData) => {
              console.log('shreya');
              setopenDialog(true);
              setData(rowData);
            },
          }),

          {
            icon: () => <VisibilityIcon color='primary' />,
            tooltip: 'view',
            onClick: (event, rowData) => handleDialogDetailForm(rowData),
          },

          (rd) => ({
            icon: () => (
              <Delete
                color='primary'
                style={{
                  color: '#bc0805',
                  opacity: rd?.status == 'INACTIVE' ? '0.3' : ' ',
                }}
              />
            ),
            tooltip: 'Deactivate',
            onClick: (event, rowData) => {
              if (rowData?.status == 'INACTIVE') {
                return;
              }
              handleClickdelete(rowData);
            },
          }),
          (rd) => ({
            icon: () => (
              <RestoreIcon
                color='primary'
                style={{opacity: rd?.status == 'INACTIVE' ? '' : '0.2'}}
              />
            ),
            tooltip: 'Reactivate',
            onClick: (event, rowData) => {
              console.log(rowData);
              if (rowData?.status == 'INACTIVE') {
                setId(rowData?._id);
                setOpenConfirmBoxReactivate(true);
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
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        maxWidth='false'
        PaperProps={{
          sx: {
            width: 600,
            maxHeight: 500,
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle
          id='alert-dialog-title'
          style={{
            background: '#f5f2f2',
            position: 'relative',
            fontSize: '21px',
          }}
        >
          Driver's Shift
          <IconButton
            onClick={() => {
              setOpen(false);
            }}
            style={{position: 'absolute', top: '8px', right: '8px'}}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div className='grid-container'>
            <SmartForm
              template={template}
              onSubmit={handleSubmit}
              buttons={['submit']}
            />
          </div>
        </DialogContent>
      </Dialog>

      {data && data.id && (
        <PopEdit
          title={data?.shiftName}
          poptemplate={Edittemplate}
          defaultValues={data}
          openDialog={openDialog}
          showbtn={showbtn}
          buttons={['Update']}
          popAction={handleEdit}
        />
      )}
    </div>
  );
};

export default list;
