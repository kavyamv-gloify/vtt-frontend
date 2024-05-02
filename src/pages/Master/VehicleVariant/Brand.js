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
const Brand = ({openForm, closeBrand}) => {
  // const [openForm, setOpenForm] = useState(false);
  const [form, setForm] = useState(false);
  const [vehicleType, setVehicleType] = useState();
  const [data, setData] = useState();
  const [flag, setFlag] = useState();
  const [selectedData, setSelectedData] = useState();

  function getAllBrand() {
    console.log('FUNCTION CALLED');
    axios
      .get(Api.baseUri + '/user-reg/vehicle-brand/get-allVehicleBrand')
      .then((res) => {
        if (res?.data?.status == '200') {
          console.log('res', res?.data);
          setData(res?.data?.data);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  }
  useEffect(() => {
    getAllBrand();
  }, []);

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
            name: 'vehicleBrandName',
            id: 'vehicleBrandName',
            title: 'Brand Name',
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
            //   options: [
            //     { title: 'OTAPenalty', value: 'OTAPenalty' },
            //     { title: 'OTDPenalty', value: 'OTDPenalty' },
            //     { title: 'Overspeed', value: 'Overspeed' },

            //   ]
          },
        ],
      },
    ],
  };
  function getAll() {
    axios
      .get(
        Api.baseUri +
          '/user-reg/vehicletype/getAllvehicleTypeBytanentId?page=0&size=20&vehicleType=null',
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          let temp = [];
          res?.data?.data?.body['VehicleTypeList']?.map((el) => {
            temp.push({title: el?.vehicleType, value: el?.id});
          });
          setVehicleType(temp ?? []);
        }
      })
      .catch((err) => {});
  }
  useEffect(() => {
    getAll();
  }, []);
  function handleSubmit(val) {
    console.log(val);
    if (flag == 'EDIT') {
      let postData = val?.data;
      postData.id = selectedData?.id;
      console.log('postData', postData);
      axios
        .put(
          Api.baseUri + '/user-reg/vehicle-brand/update-vehicleBrand',
          postData,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success('Brand Updated Successfully');
            setForm(false);
            setSelectedData(null);
            getAllBrand();
          }
        })
        .catch((err) => {
          console.log('err', err);
        });
    } else {
      let postData = val?.data;
      console.log('postData', postData);
      axios
        .post(
          Api.baseUri + '/user-reg/vehicle-brand/save-vehicleBrand',
          postData,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success('Brand Submitted Successfully');
            closeBrand();
            getAllBrand();
          }
        });
    }
  }

  const tableTemplate = {
    columns: [
      {
        title: 'Brand Name',
        field: 'vehicleBrandName',
      },

      // {
      //   title: 'Status',
      //   field: 'status',
      //   render: (rowData) =>
      //     rowData.status == 'ACTIVE' ? (
      //       <span style={{color: 'green'}}>ACTIVE</span>
      //     ) : rowData.status == 'INACTIVE' ? (
      //       <span style={{color: 'red'}}>INACTIVE</span>
      //     ) : (
      //       rowData.status
      //     ),
      // },
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
      // {
      //   title: 'Status',
      //   field: "status"
      // },
    ],
  };

  return (
    <div>
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
        }}
        actions={[
          {
            icon: () => <EditIcon color='primary' />,
            tooltip: 'Edit',
            onClick: (event, rowData) => {
              setFlag('EDIT');
              setForm(true);
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
      <Dialog
        open={openForm}
        style={{borderRadius: '4rem'}}
        PaperProps={{
          sx: {
            width: '400px',
          },
        }}
      >
        <div>
          <DialogContent style={{padding: '0px'}}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                background: '#f5f2f2',
                height: '4rem',
                width: '400px',
                paddingRight: '1.5rem',
                paddingLeft: '1.5rem',
              }}
            >
              <h1 style={{marginTop: '1.5rem'}}>
                {flag == 'EDIT' ? 'Update Vehicle Brand' : 'Vehicle Brand'}
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
                  onSubmit={handleSubmit}
                  defaultValues={selectedData}
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
      <Dialog
        open={form}
        style={{borderRadius: '4rem'}}
        PaperProps={{
          sx: {
            width: '400px',
          },
        }}
      >
        <div>
          <DialogContent style={{padding: '0px'}}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                background: '#f5f2f2',
                height: '4rem',
                width: '400px',
                paddingRight: '1.5rem',
                paddingLeft: '1.5rem',
              }}
            >
              <h1 style={{marginTop: '1.5rem'}}>
                {flag == 'EDIT' ? 'Update Vehicle Brand' : 'Vehicle Brand'}
              </h1>
              <CloseIcon
                onClick={() => {
                  setForm(false);
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
                  onSubmit={handleSubmit}
                  defaultValues={selectedData}
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

export default Brand;
