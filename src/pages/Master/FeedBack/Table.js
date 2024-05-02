import React, {useEffect, useState} from 'react';
import Api from '@api';
import axios from 'axios';
import {Box, Grid} from '@mui/material';
import CustomLabel from 'pages/common/CustomLabel';
import AppTooltip from '@crema/core/AppTooltip';
import SmartForm from '@smart-form';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import DialogTitle from '@mui/material/DialogTitle';
import AppLoader from '@crema/core/AppLoader';
import {toast} from 'react-toastify';
import SmartTable from '@smart-table';
import PopEdit from '@editpopup';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import regex from '@regex';
import {SettingsInputSvideoOutlined} from '@mui/icons-material';
import Confirm from '@confirmation-box';
import RestoreIcon from '@mui/icons-material/Restore';
const Table = () => {
  const [data, setData] = useState();
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [showbtn, setshowbtn] = useState(true);
  const [corporateList, setCorporateList] = useState();
  const [curData, setCurData] = useState();
  const [dialID, setDialId] = useState();
  const [delId, setDelId] = useState(false);
  const [deleteBox, setDeleteBox] = useState(false);
  const [restoreBox, setRestoreBox] = useState(false);
  useEffect(() => {
    getAllFeedBack();
  }, []);

  function getAllFeedBack() {
    axios
      .get(Api.baseUri + '/user-reg/driver-feedback/get-all-driver-feedback')
      .then((res) => {
        setData(res?.data?.data ?? []);
      })
      .catch((err) => {
        setData([]);
      });
  }
  useEffect(() => {
    axios
      .get(Api.baseUri + '/user-reg/corporate-reg?page=0&size=10000')
      .then((res) => {
        let temp = [];
        res?.data?.data?.body?.CorporateList?.map((el) => {
          temp.push({title: el?.companyName, value: el?.id});
        });
        setCorporateList(temp ?? []);
      })
      .catch((err) => {
        setCorporateList([]);
      });
  }, []);

  useEffect(() => {
    axios
      .get(
        Api.baseUri +
          '/user-reg/driver-feedback/get-driver-feedback-by-id/' +
          dialID,
      )
      .then((res) => {
        setCurData(res?.data?.data);
      })
      .catch((err) => {});
  }, [dialID]);

  function closeConfirmBox(dd, reason) {
    if (dd == 'YES') {
      axios
        .post(
          Api.baseUri +
            `/user-reg/driver-feedback/deActivate-driver-feedback/${dialID}/${
              reason?.length ? reason : null
            }`,
        )
        .then((response) => {
          if (response?.data?.status == '200') {
            toast.success('Deactivated successfully.');
            getAllFeedBack();
            setDeleteBox(false);
            // navigate(`/onboardadmin/vendor/vendor-listing/Def`);
          } else {
            toast.error(response?.data?.message || 'Something went wrong.');
          }
        })
        .catch((err) => {
          toast.error('Something went wrong.');
        });
    } else {
      setDeleteBox(false);
    }
  }
  const closeConfirmBoxReactivate = (dd, reason) => {
    setRestoreBox(false);

    if (dd == 'YES') {
      axios
        .post(
          Api.baseUri +
            `/user-reg/driver-feedback/reActivate-driver-feedback/${dialID}/${
              reason?.length ? reason : null
            }`,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success('Reactivated successfully');
            getAllFeedBack();
          }
        })
        .catch((err) => {
          toast.error(err);
          setRestoreBox(false);
        });
    }
  };
  const tableTemplate = {
    columns: [
      {
        title: 'Reason',
        field: 'categoryName',
      },
      {
        title: 'Rating Number',
        field: 'ratingNo',
      },
      {
        title: 'Created by',
        field: 'createdBy',
        type: 'date',
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
    description: 'Form for applying Job',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'text',
            name: 'categoryName',
            id: 'categoryName',
            title: 'Category Name',
            infoMessage: [
              'Alphanumeric characters are allowed',
              'Maximum length should be 50 characters',
              'e.g.:Need to take precaution',
            ],
            pattern: {
              value: regex.maxSize50,
              message:
                'Please enter  valid code with alpha-numeric and below 50 characters',
            },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'autocomplete',
            name: 'ratingNo',
            id: 'ratingNo',
            title: 'Rating Number',
            infoMessage: [
              'Numeric characters are allowed',
              'Value must be less than 10.',
            ],
            options: [
              {title: '1', value: '1'},
              {title: '2', value: '2'},
              {title: '3', value: '3'},
              {title: '4', value: '4'},
              {title: '5', value: '5'},
            ],
            // isNumber: true,
            // maxChar: 1,
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'multiSelect',
            name: 'corporateId',
            id: 'corporateId',
            title: 'Corporate',
            options: corporateList ?? [],
            infoMessage: ['Dropdown values are selectable', 'e.g.: Drive'],
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
    title: 'Penalty',
    description: 'Form for applying Job',
    fields: [
      {
        type: 'text',
        name: 'categoryName',
        id: 'categoryName',
        title: 'Category Name',
        // pattern: {
        //     value: regex.maxSize50,
        //     message: 'Please enter  valid code with alpha-numeric and below 50 characters'
        // },
        validationProps: {
          required: 'This is a mandatory field',
        },
      },
      {
        type: 'autocomplete',
        name: 'ratingNo',
        id: 'ratingNo',
        title: 'Rating Number',
        infoMessage: [
          'Numeric characters are allowed',
          'Value must be less than 10.',
        ],
        options: [
          {
            title: '1',
            value: '1',
          },
          {title: '2', value: '2'},
          {title: '3', value: '3'},
          {title: '4', value: '4'},
          {title: '5', value: '5'},
        ],
        // isNumber: true,
        // maxChar: 1,
        validationProps: {
          required: 'This is a mandatory field',
        },
      },
      {
        type: 'multiSelect',
        name: 'corporateId',
        id: 'corporateId',
        title: 'Corporate',
        options: corporateList ?? [],
        validationProps: {
          required: 'This is a mandatory field',
        },
      },
    ],
  };

  function handleSubmit(val) {
    setshowbtn(false);

    if (val?.button == 'submit') {
      let dataSet = val?.data;

      axios
        .post(
          Api.baseUri + '/user-reg/driver-feedback/save-driver-feedback',
          dataSet,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success(
              res?.data?.message ?? 'Feedback Category submitted successfully',
            );
            setOpenDialog(false);
            getAllFeedBack();
            setshowbtn(true);
          } else {
            toast.error('Something Went Wrong');
            setshowbtn(true);
          }
        });
    }
  }

  function handleEditSubmit(val) {
    if (val?.close == true) {
      setDialId(null);
      setOpenEditDialog(false);
    }
    if (val?.button == 'update') {
      let dataSet = val?.data;
      axios
        .put(
          Api.baseUri + '/user-reg/driver-feedback/update-driver-feedback',
          dataSet,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success(
              res?.data?.message ?? 'Feedback Category updated successfully',
            );
            setDialId(null);
            setOpenEditDialog(false);
            getAllFeedBack();
          } else {
            toast.error('Something Went Wrong');
            setshowbtn(true);
          }
        });
    }
  }

  return (
    <>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={9}>
          <CustomLabel
            labelVal='Feedback Category List'
            variantVal='h3-underline'
          />
        </Grid>
        <Grid item xs={3}>
          <Box display='flex' justifyContent='flex-end'>
            <div className='left-seperator'>
              <AppTooltip placement={'top'} title={'Add New FeedBack Category'}>
                <img
                  src='/assets/images/title-icon/add penalty.svg'
                  className='title-icons-mui'
                  onClick={(e) => setOpenDialog(true)}
                />
              </AppTooltip>
            </div>
          </Box>
        </Grid>
      </Grid>

      {openEditDialog && dialID && curData?.id && (
        <PopEdit
          title={curData?.categoryName}
          poptemplate={Edittemplate}
          defaultValues={curData}
          openDialog={openEditDialog}
          showbtn={showbtn}
          buttons={['Update']}
          popAction={handleEditSubmit}
        />
      )}

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
        // tableRef={tableRef}
        data={data}
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
          (data) => ({
            icon: () => (
              <EditIcon
                color='primary'
                style={{opacity: data?.status == 'INACTIVE' ? '0.3' : ''}}
              />
            ),
            tooltip: 'edit',
            onClick: (event, rowData) => {
              if (rowData?.status == 'INACTIVE') {
                return;
              }
              setDialId(rowData?.id);
              setOpenEditDialog(true);
            },
          }),
          (data) => ({
            icon: () => (
              <DeleteIcon
                color='primary'
                style={{
                  color: '#bc0805',
                  opacity: data?.status == 'INACTIVE' ? '0.3' : '',
                }}
              />
            ),
            tooltip: 'Deactivate',
            onClick: (event, rowData) => {
              if (rowData?.status == 'INACTIVE') {
                return;
              }
              setDialId(rowData?.id);
              setDeleteBox(true);
            },
          }),
          (data) => ({
            icon: () => (
              <RestoreIcon
                color='primary'
                style={{
                  opacity: data?.status == 'INACTIVE' ? '' : '0.3',
                }}
              />
            ),
            tooltip: 'restore',
            onClick: (event, rowData) => {
              if (rowData?.status == 'ACTIVE') {
                return;
              }
              setDialId(rowData?.id);
              setRestoreBox(true);
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
        open={openDialog}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '500px',
          },
        }}
        style={{borderRadius: '4rem'}}
      >
        <DialogTitle style={{background: '#f5f2f2'}}>
          <h1>Register Feedback</h1>
          <CloseIcon
            onClick={() => {
              setOpenDialog(false);
            }}
            style={{
              cursor: 'pointer',
              position: 'absolute',
              top: '14px',
              right: '14px',
              color: '#4f4f4f',
              fontWeight: 'bold',
            }}
          />
        </DialogTitle>
        <DialogContent>
          <div style={{padding: '10px', marginTop: '0'}}>
            {!showbtn ? <AppLoader /> : null}
            <SmartForm
              template={template}
              onSubmit={handleSubmit}
              buttons={['submit']}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Confirm
        open={deleteBox}
        header={'Confirm to Deactivate'}
        cnfMsg={'Are you sure, You want to deactivate the Feedback category?'}
        handleClose={closeConfirmBox}
        reason={true}
      />

      <Confirm
        open={restoreBox}
        header={'Confirm to Reactivate'}
        cnfMsg={'Are you sure, You want to reactivate the Feedback category?'}
        handleClose={closeConfirmBoxReactivate}
        reason={true}
      />
    </>
  );
};
export default Table;
