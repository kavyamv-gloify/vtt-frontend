import React, {useEffect, useState} from 'react';
import SmartTable from '@smart-table';
import SmartForm from '@smart-form';
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
import Api from '@api';
import {Box, Grid} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VehicleVariant from './index';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import {Delete} from '@mui/icons-material';
import moment from 'moment';
import RestoreIcon from '@mui/icons-material/Restore';
const VehicleVariantTable = () => {
  const [openDial, setOpenDial] = useState(false);
  const [flag, setFlag] = useState();
  const [data, setData] = useState();
  const [selectedData, setSelectedData] = useState();
  function getAllList() {
    axios
      .get(Api.baseUri + '/user-reg/vehicleTypeTheme-Service/getAll')
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
  const tableTemplate = {
    columns: [
      {
        title: 'Vehicle Brand',
        field: 'vehicleBrand',
      },
      {
        title: 'Vehile Model',
        field: 'vehicleModel',
      },
      {
        title: 'Vehicle Variant',
        field: 'vehicleVeriant',
      },
      {
        title: 'Color',
        field: 'vehicleColor',
        render: (rd) => {
          return (
            <span style={{color: rd?.vehicleColor}}>{rd?.vehicleColor}</span>
          );
        },
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
  return (
    <div>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={3}>
          <CustomLabel labelVal='Vehicle Variant' variantVal='h3-underline' />
        </Grid>
        <Grid item xs={9} sx={{paddingTop: '0px !important'}}>
          <Box display='flex' justifyContent='flex-end' alignItems='center'>
            <div className='left-seperator'>
              <AppTooltip placement={'top'} title={'Add New Theme'}>
                <AddIcon
                  onClick={() => {
                    setOpenDial(true);
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
              setOpenDial(true);
              setFlag('EDIT');
              setSelectedData(rowData);
            },
          },
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
          // (rd_) => ({
          //   icon: () => (
          //     <Delete
          //       color='primary'
          //       style={{
          //         color: '#bc0805',
          //         opacity: rd_.userStatus == 'INACTIVE' ? '0.3' : '',
          //       }}
          //     />
          //   ),
          //   tooltip: 'Deactivate',
          //   onClick: (event, rowData) => {
          //     if (rd_.userStatus == 'ACTIVE') {
          //       setOpenConfirmBox(true);
          //       setData(rowData);
          //     }
          //   },
          // }),
          // (rd_) => ({
          //   icon: () => (
          //     <RestoreIcon
          //       variant='contained'
          //       color='primary'
          //       size='small'
          //       fontSize='small'
          //       style={{
          //         opacity: rd_.userStatus == 'ACTIVE' ? '0.3' : '',
          //       }}
          //     />
          //   ),
          //   tooltip: 'Restore',
          //   iconProps: {
          //     fontSize: 'small',
          //     color: 'primary',
          //     classes: 'filled',
          //   },
          //   onClick: (event, rowData) => {
          //     if (rd_.userStatus == 'INACTIVE') {
          //       setOpenConfirmBoxReactivate(true);
          //       setData(rowData);
          //     }
          //   },
          // }),
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
        style={{borderRadius: '4rem'}}
        PaperProps={{
          sx: {
            width: '800px',
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
                paddingRight: '1.5rem',
                paddingLeft: '1.5rem',
                width: '800px',
                position: 'fixed',
                zIndex: '9',
                borderRadius: '5px 5px 0px 0px',
              }}
            >
              <h1 style={{marginTop: '1.5rem'}}>
                {flag == 'ADDNEW'
                  ? 'Add Vehicle Variant'
                  : 'Update Vehicle Variant'}
              </h1>
              <CloseIcon
                onClick={() => {
                  setOpenDial(false);
                }}
                style={{
                  marginTop: '1.4rem',
                  color: '#4f4f4f',
                  fontWeight: 'bold',
                }}
              />
            </div>
            <div
              style={{padding: '2rem', paddingTop: '0rem', marginTop: '100px'}}
            >
              <VehicleVariant
                data={selectedData}
                flag={flag}
                close={() => {
                  setOpenDial(false);
                  getAllList();
                }}
              />
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </div>
  );
};

export default VehicleVariantTable;
