import React, {useEffect, useState} from 'react';
import SmartTable from '@smart-table';
import Avatar from '@mui/material/Avatar';
import AppTooltip from '@crema/core/AppTooltip';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import CustomLabel from 'pages/common/CustomLabel';
import _, {values} from 'lodash';
import {useAuthUser} from '@crema/utility/AuthHooks';
import Button from '@mui/material/Button';
// import CustomTheme from './theme';
import SmartForm from '@smart-form';
import Api from '@api';
import {Box, Grid} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VehicleVariant from './index';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import {Delete} from '@mui/icons-material';
import moment from 'moment';
import {toast} from 'react-toastify';
import RestoreIcon from '@mui/icons-material/Restore';
import regex from '@regex';
const Category = ({openForm, closeBrand, data, vehicleId, getAllList}) => {
  // const [openForm, setOpenForm] = useState(false);
  const [form, setForm] = useState(false);
  const [vehicleType, setVehicleType] = useState();
  // const [data, setData] = useState();
  const [open, setOpen] = useState(false);
  const [flag, setFlag] = useState();
  const [selectedData, setSelectedData] = useState();
  // function getAllList() {
  //   axios
  //     .get(
  //       Api.baseUri + '/user-reg/vehicle-subCategory/get-allVehicleSubCategory',
  //     )
  //     .then((res) => {
  //       if (res?.data?.status == '200') {
  //         setData(res?.data?.data ?? []);
  //       }
  //     })
  //     .catch((err) => {
  //       setData([]);
  //     });
  // }
  // useEffect(() => {
  //   getAllList();
  // }, []);
  const tableTemplate = {
    columns: [
      {
        title: 'Category Name',
        field: 'subCategoryName',
      },
      {
        title: 'Vehicle Types',
        field: 'vehcieTypeName',
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
    // title: 'Bank Type',
    description: 'Form for applying Job',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          // {
          //   type: 'autocomplete',
          //   name: 'vehicleTypeId',
          //   id: 'vehicleTypeId',
          //   title: 'Vehicle Type',
          //   options: vehicleType ?? [],
          //   infoMessage: [
          //     'Numeric characters are allowed',
          //     'Maximum value should be 1,000,000',
          //     'e.g.: 2000',
          //   ],
          //   validationProps: {
          //     required: 'This is a mandatory field',
          //   },
          // },
          {
            type: 'text',
            name: 'subCategoryName',
            id: 'subCategoryName',
            title: 'Category Name',
            infoMessage: [
              'Alpha Numeric Characters are allowed',
              'Maximum length should be 150',
              'e.g.: OTA-Penalty1',
            ],
            pattern: {
              value: regex.maxSize150,
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
  // function getAll() {
  //   axios
  //     .get(
  //       Api.baseUri + '/user-reg/VehicleNewVerient/Get-AllVehicle-New-Verient',
  //     )
  //     .then((res) => {
  //       if (res?.data?.status == '200') {
  //         let temp = [];
  //         res?.data?.data?.map((el) => {
  //           temp.push({title: el?.vehicleVeriant, value: el?.id});
  //         });
  //         setVehicleType(temp ?? []);
  //       }
  //     })
  //     .catch((err) => {});
  // }
  // useEffect(() => {
  //   getAll();
  // }, []);
  function handleSubmit(val) {
    console.log(val);

    if (flag == 'EDIT') {
      let postData = val?.data;
      postData.vehicleTypeId = vehicleId?.id;
      postData.vehcieTypeName = vehicleId?.vehicleVeriant;
      postData.id = selectedData?.id;
      console.log('postData', postData);
      axios
        .put(
          Api.baseUri +
            '/user-reg/vehicle-subCategory/update-vehicleSubCategory',
          postData,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success('Sub-Category Updated Successfully');
            setOpen(false);
            getAllList();
            setSelectedData(null);
          }
        })
        .catch((err) => {
          console.log('err', err);
        });
    } else {
      let postData = val?.data;
      postData.vehicleTypeId = vehicleId?.id;
      postData.vehcieTypeName = vehicleId?.vehicleVeriant;
      // vehicleType?.map((el) => {
      //   if (el?.value == val?.data?.vehicleTypeId) {
      //     postData.vehcieTypeName = el?.title;
      //   }
      // });
      console.log('postData', postData);
      axios
        .post(
          Api.baseUri + '/user-reg/vehicle-subCategory/save-vehicleSubCategory',
          postData,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success('Sub-Category Submitted Successfully');
            // closeBrand();
            setOpen(false);
            getAllList();
          }
        })
        .catch((err) => {
          console.log('err', err);
        });
    }
  }
  return (
    <div>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={3}>
          <CustomLabel labelVal='Vehicle Category' variantVal='h3-underline' />
        </Grid>
        <Grid item xs={9} sx={{paddingTop: '0px !important'}}>
          <Box display='flex' justifyContent='flex-end' alignItems='center'>
            <div className='left-seperator'>
              <AppTooltip placement={'top'} title={'Add Vehicle Category'}>
                <AddIcon
                  onClick={() => {
                    setOpen(true);
                    // setOpenForm(true);
                    setFlag('ADDNEW');
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
        data={data ?? []}
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
          {
            icon: () => (
              <EditIcon
                variant='contained'
                color='primary'
                size='small'
                fontSize='small'
              />
            ),
            tooltip: 'Edit',
            iconProps: {
              fontSize: 'small',
              color: 'primary',
              classes: 'filled',
            },
            onClick: (event, rowData) => {
              // setForm(true);
              setOpen(true);
              setFlag('EDIT');
              setSelectedData(rowData);
            },
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
      <Dialog open={openForm} style={{borderRadius: '4rem'}}>
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
              <h1 style={{marginTop: '1.5rem'}}>
                {flag == 'EDIT'
                  ? 'Update Vehicle Category'
                  : 'Vehicle Category'}
              </h1>
              <CloseIcon
                onClick={() => {
                  closeBrand();
                }}
                style={{
                  marginTop: '1.4rem',
                  color: '#4f4f4f',
                  fontWeight: 'bold',
                }}
              />
            </div>
            <div style={{padding: '2rem', paddingTop: '0rem'}}>
              {flag == 'EDIT' ? (
                <SmartForm
                  template={template}
                  defaultValues={selectedData}
                  onSubmit={handleSubmit}
                  buttons={['update']}
                />
              ) : (
                <SmartForm
                  template={template}
                  onSubmit={handleSubmit}
                  buttons={['submit']}
                />
              )}
            </div>
          </DialogContent>
        </div>
      </Dialog>
      <Dialog open={open} style={{borderRadius: '4rem'}}>
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
              <h1 style={{marginTop: '1.5rem'}}>
                {flag == 'EDIT'
                  ? 'Update Vehicle Category'
                  : 'Vehicle Category'}
              </h1>
              <CloseIcon
                onClick={() => {
                  setOpen(false);
                  // setForm(false);
                }}
                style={{
                  marginTop: '1.4rem',
                  color: '#4f4f4f',
                  fontWeight: 'bold',
                }}
              />
            </div>
            <div style={{padding: '2rem', paddingTop: '0rem'}}>
              {flag == 'EDIT' ? (
                <SmartForm
                  template={template}
                  defaultValues={selectedData}
                  onSubmit={handleSubmit}
                  buttons={['update']}
                />
              ) : (
                <SmartForm
                  template={template}
                  onSubmit={handleSubmit}
                  buttons={['submit']}
                />
              )}
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </div>
  );
};

export default Category;
