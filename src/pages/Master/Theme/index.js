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
import CustomTheme from './theme';
import Api from '@api';
import {Box, Grid} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';
import Confirm from '@confirmation-box';
import {toast} from 'react-toastify';
const tableTemplate = {
  columns: [
    {
      title: 'Theme Name',
      field: 'themeName',
    },
    {
      title: 'Background Colour',
      field: 'bgColor',
    },
    {
      title: 'Font Colour',
      field: 'fontColor',
    },
    {
      title: 'Font Colour After Hover',
      field: 'hoverColor',
    },
    {
      title: 'Button Colour',
      field: 'btnColor',
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
      title: 'Created On',
      field: 'createdOn',
      type: 'date',
    },
  ],
};
const Themes = () => {
  const [openDial, setOpenDial] = useState(null);
  const [dialType, setDialType] = useState('');
  const [openReactive, setOpenReactive] = useState(false);
  const [openDeactive, setOpenDeactive] = useState(false);
  const [selectedData, setSelectedData] = useState();
  const tableRef = React.useRef();
  const [data, setData] = useState(null);
  useEffect(() => {
    if (openDial != null) return;
    setTimeout(() => {
      axios
        .get(Api.baseUri + '/user-reg/theme-Service/getAll')
        .then((res) => {
          setData(res?.data?.data || []);
        })
        .catch((err) => {
          setData([]);
        });
    }, 500);
  }, [openDial]);
  function handleClickEdit(rowData) {
    setOpenDial(rowData);
  }
  const closeConfirmBox = (d) => {
    if (d == 'YES') {
      let postData = selectedData;
      postData.status = 'INACTIVE';

      axios
        .put(Api.baseUri + '/user-reg/theme-Service/update-theme', postData)
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success(
              res?.data?.message || 'Theme deactivated successfully.',
            );
            setOpenDeactive(false);
          } else {
            toast.error(res?.data?.message || 'Something went wrong.');
          }
        })
        .catch((err) => {
          toast.error('Something went wrong.');
        });
    } else {
      setOpenDeactive(false);
    }
  };
  const closeConfirmBoxReactivate = (d) => {
    if (d == 'YES') {
      let postData = selectedData;
      postData.status = 'ACTIVE';

      axios
        .put(Api.baseUri + '/user-reg/theme-Service/update-theme', postData)
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success(
              res?.data?.message || 'Theme deactivated successfully.',
            );
            setOpenReactive(false);
          } else {
            toast.error(res?.data?.message || 'Something went wrong.');
          }
        })
        .catch((err) => {
          toast.error('Something went wrong.');
        });
    } else {
      setOpenReactive(false);
    }
  };
  return (
    <>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={3}>
          <CustomLabel labelVal="Themes' List" variantVal='h3-underline' />
        </Grid>
        <Grid item xs={9} sx={{paddingTop: '0px !important'}}>
          <Box display='flex' justifyContent='flex-end' alignItems='center'>
            <div className='left-seperator'>
              <AppTooltip placement={'top'} title={'Add New Theme'}>
                <AddIcon
                  onClick={() => {
                    setOpenDial(true);
                    setDialType('ADDNEW');
                  }}
                />
              </AppTooltip>
            </div>
          </Box>
        </Grid>
      </Grid>
      {data && (
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
          columns={tableTemplate?.columns}
          data={data || []}
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
                  style={{opacity: rd?.status == 'INACTIVE' ? '0.2' : ' '}}
                />
              ),
              tooltip: 'Edit',
              onClick: (event, rowData) => {
                if (rowData?.status == 'INACTIVE') {
                  return;
                }
                handleClickEdit(rowData);
              },
            }),
            (rd) => ({
              icon: () => (
                <DeleteIcon
                  color='primary'
                  style={{
                    color: '#CC0000',
                    opacity: rd?.status == 'INACTIVE' ? '0.3' : ' ',
                  }}
                />
              ),
              tooltip: 'Deactivate',
              onClick: (event, rowData) => {
                if (rd?.status == 'INACTIVE') {
                  return;
                }
                setOpenDeactive(true);
                setSelectedData(rowData);
              },
            }),
            (rd) => ({
              icon: () => (
                <RestoreIcon
                  color='primary'
                  style={{
                    opacity: rd?.status == 'ACTIVE' ? '0.3' : '',
                  }}
                />
              ),
              tooltip: 'Restore',
              onClick: (event, rowData) => {
                if (rowData?.status == 'ACTIVE') {
                  return;
                }
                setOpenReactive(true);
                setSelectedData(rowData);
              },
            }),
            // {
            //   icon: () => <VisibilityIcon color='primary' />,
            //   tooltip: 'Delete',
            //   onClick: (event, rowData) => {},
            // },
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
      )}
      {openDial && (
        <CustomTheme
          setOpenDial={setOpenDial}
          selData={dialType}
          themeData={openDial}
        />
      )}

      <Confirm
        open={openDeactive}
        header={'Confirm to Deactivate'}
        cnfMsg={'Are you sure, You want to deactivate the theme?'}
        handleClose={closeConfirmBox}
      />
      <Confirm
        open={openReactive}
        header={'Confirm to Reactivate'}
        cnfMsg={'Are you sure, You want to reactivate the theme?'}
        handleClose={closeConfirmBoxReactivate}
      />
    </>
  );
};

export default Themes;
