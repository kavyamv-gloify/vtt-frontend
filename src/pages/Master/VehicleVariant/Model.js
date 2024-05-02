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
const Model = () => {
  const [openForm, setOpenForm] = useState(false);
  const [vehicleType, setVehicleType] = useState();
  const [category, setCategory] = useState();
  const [brand, setBrand] = useState();
  const [data, setData] = useState();
  const [color, setColor] = useState();
  const [selectedData, setSelectedData] = useState();
  const [flag, setFlag] = useState();
  function getAllList() {
    axios
      .get(Api.baseUri + '/user-reg/vehicle-model/get-AllVehicleModel')
      .then((res) => {
        if (res?.data?.status == '200') {
          setData(res?.data?.data ?? []);
        }
      })
      .catch((err) => {
        setData([]);
      });
  }
  useEffect(() => {
    getAllList();
  }, []);

  useEffect(() => {
    console.log('selectedData', selectedData);
    if (selectedData?.vehicleTypeId) {
      getSubCategory(selectedData?.vehicleTypeId);
    }
  }, [selectedData]);
  const tableTemplate = {
    columns: [
      {
        title: 'Vehicle Type',
        field: 'vehicleTypeName',
      },
      {
        title: 'Vehicle Category',
        field: 'vehicleSubCategoryName',
      },
      {
        title: 'Vehicle Brand',
        field: 'vehicleBrandName',
      },
      {
        title: 'Vehicle Model',
        field: 'vehicleModelName',
      },

      // {
      //   title: 'Color',
      //   field: 'vehicleColor',
      //   render: (rd) => {
      //     return (
      //       <span style={{color: rd?.vehicleColor}}>{rd?.vehicleColor}</span>
      //     );
      //   },
      // },
      {
        title: 'Created by',
        field: 'createdOn',
        render: (rd) => {
          return (
            rd.createdBy +
            '  ' +
            moment(rd.createdOn).format('DD/MM/YYYY HH:mm')
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
          {
            type: 'autocomplete',
            name: 'vehicleTypeId',
            id: 'vehicleTypeId',
            title: 'Vehicle Type',
            options: vehicleType ?? [],
            infoMessage: [
              'Numeric characters are allowed',
              'Maximum value should be 1,000,000',
              'e.g.: 2000',
            ],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'autocomplete',
            name: 'vehicleSubCategoryId',
            id: 'vehicleSubCategoryId',
            title: 'Vehicle Category',
            options: category ?? [],
            infoMessage: [
              'Numeric characters are allowed',
              'Maximum value should be 1,000,000',
              'e.g.: 2000',
            ],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'autocomplete',
            name: 'vehicleBrandId',
            id: 'vehicleBrandId',
            title: 'Vehicle Brand',
            options: brand ?? [],
            infoMessage: [
              'Numeric characters are allowed',
              'Maximum value should be 1,000,000',
              'e.g.: 2000',
            ],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },

          {
            type: 'text',
            name: 'vehicleModelName',
            id: 'vehicleModelName',
            title: 'Vehicle Model',
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
          // {
          //   type: 'autocomplete',
          //   name: 'vehicleTypeThemeId',
          //   id: 'vehicleTypeThemeId',
          //   multiple: true,
          //   title: 'Vehicle Color',
          //   options: color ?? [],
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
            type: 'multiSelect',
            name: 'vehicleTypeThemeId',
            id: 'vehicleTypeThemeId',
            title: 'Vehicle Color',
            // multiple: true,
            // infoMessage: ['Dropdown values are selectable', 'e.g.:Morning'],
            validationProps: {
              required: 'This is a mandatory field',
            },
            options: color ?? [],
          },
        ],
      },
    ],
  };
  function getAll() {
    axios
      .get(
        Api.baseUri + '/user-reg/VehicleNewVerient/Get-AllVehicle-New-Verient',
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          let temp = [];
          res?.data?.data?.map((el) => {
            temp.push({title: el?.vehicleVeriant, value: el?.id});
          });
          setVehicleType(temp ?? []);
        }
      })
      .catch((err) => {});
  }
  function getSubCategory(id) {
    axios
      .get(
        Api.baseUri +
          `/user-reg/vehicle-subCategory/get-vehicleSubCategory-by-categoryId/${id}`,
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          let temp = [];
          res?.data?.data?.map((el) => {
            temp.push({title: el?.subCategoryName, value: el?.id});
          });
          setCategory(temp ?? []);
        }
      })
      .catch((err) => {});
  }
  function getBrand() {
    axios
      .get(Api.baseUri + '/user-reg/vehicle-brand/get-allVehicleBrand')
      .then((res) => {
        if (res?.data?.status == '200') {
          let temp = [];
          res?.data?.data?.map((el) => {
            temp.push({title: el?.vehicleBrandName, value: el?.id});
          });
          setBrand(temp ?? []);
        }
      })
      .catch((err) => {});
  }
  function getColor() {
    axios
      .get(Api.baseUri + '/user-reg/vehicleTypeTheme-Service/getAll')
      .then((res) => {
        if (res?.data?.status == '200') {
          console.log('res', res?.data?.data);
          let temp = [];
          res?.data?.data?.map((el) => {
            temp.push({
              title: el?.vehicleColor + ' ( ' + el.vehicleColorName + ' )',
              value: el?.id,
            });
          });
          setColor(temp);
        } else {
          setColor([]);
        }
      })
      .catch((err) => {});
  }
  useEffect(() => {
    getAll();
    getBrand();
    getColor();
    // getSubCategory();
  }, []);

  function handleChange(val) {
    console.log('val', val);
    setTimeout(() => {
      getSubCategory(val?.vehicleTypeId?.value);
    }, 2000);
  }
  function handleSubmit(val) {
    console.log(val);
    let postData = val?.data;
    let temp = [];
    for (let i = 0; i <= color?.length; i++) {
      for (let j = 0; j < val?.data?.vehicleTypeThemeId?.length; j++) {
        if (color[i]?.value == val?.data?.vehicleTypeThemeId[j]) {
          temp.push(color[i]?.title);
        }
      }
    }

    console.log('temp', temp);

    vehicleType?.map((el) => {
      if (el?.value == val?.data?.vehicleTypeId) {
        postData.vehicleTypeName = el?.title;
      }
    });
    category?.map((el) => {
      if (el?.value == val?.data?.vehicleSubCategoryId) {
        postData.vehicleSubCategoryName = el?.title;
      }
    });

    brand?.map((el) => {
      if (el?.value == val?.data?.vehicleBrandId) {
        postData.vehicleBrandName = el?.title;
      }
    });
    postData.vehicleTypeThemeColor = temp;
    console.log('postData', postData);
    if (flag == 'ADDNEW') {
      axios
        .post(
          Api.baseUri + '/user-reg/vehicle-model/save-vehicleModel',
          postData,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success('Model Submitted Successfully');
            setOpenForm(false);
            getAllList();
          }
        })
        .catch((err) => {});
    }

    if (flag == 'EDIT') {
      axios
        .put(
          Api.baseUri + '/user-reg/vehicle-model/update-vehicleModel',
          postData,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success('Model Updated Successfully');
            setOpenForm(false);
            getAllList();
          }
        })
        .catch((err) => {});
    }
  }
  return (
    <div>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={3}>
          <CustomLabel labelVal='Vehicle Model' variantVal='h3-underline' />
        </Grid>
        <Grid item xs={9} sx={{paddingTop: '0px !important'}}>
          <Box display='flex' justifyContent='flex-end' alignItems='center'>
            <div className='left-seperator'>
              <AppTooltip placement={'top'} title={'Add Vehicle Model'}>
                <AddIcon
                  onClick={() => {
                    setOpenForm(true);
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
              setOpenForm(true);
              setFlag('EDIT');
              console.log('rowData', rowData);
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
             {flag == 'EDIT' ? <h1 style={{marginTop: '1.5rem'}}>Update Vehicle Model</h1> :
              <h1 style={{marginTop: '1.5rem'}}>Vehicle Model</h1>}
              <CloseIcon
                onClick={() => {
                  setOpenForm(false);
                  setSelectedData(null);
                }}
                style={{
                  marginTop: '1.4rem',
                  color: '#4f4f4f',
                  fontWeight: 'bold',
                }}
              />
            </div>
            <div style={{padding: '2rem', paddingTop: '0rem'}}>
              {flag == 'EDIT' &&
                color &&
                category &&
                selectedData?.vehicleTypeThemeId && (
                  <SmartForm
                    template={template}
                    defaultValues={selectedData}
                    onSubmit={handleSubmit}
                    onChange={handleChange}
                    buttons={['update']}
                  />
                )}
              {flag == 'ADDNEW' && (
                <SmartForm
                  template={template}
                  // defaultValues={selectedData}
                  onSubmit={handleSubmit}
                  onChange={handleChange}
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

export default Model;
