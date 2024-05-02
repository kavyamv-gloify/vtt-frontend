import React, {useEffect, useState} from 'react';
import SmartTable from '@smart-table';
import Avatar from '@mui/material/Avatar';
import AppTooltip from '@crema/core/AppTooltip';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import CustomLabel from 'pages/common/CustomLabel';
import _, {get, values} from 'lodash';
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
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RestoreIcon from '@mui/icons-material/Restore';
import regex from '@regex';
import Category from './Category';
const VehicleType = ({openForm, setOpenForm, closeBrand}) => {
  // const [openForm, setOpenForm] = useState(false);
  const [selectedData, setSelectedData] = useState('');
  const [flag, setFlag] = useState();
  const [data, setData] = useState();
  const [form, setForm] = useState();
  const [clickedParent, setClickedParent] = useState();

  function getAll() {
    axios
      .get(
        Api.baseUri + '/user-reg/VehicleNewVerient/Get-AllVehicle-New-Verient',
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          setData(res?.data?.data);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  }
  useEffect(() => {
    getAll();
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
            name: 'vehicleVeriant',
            id: 'vehicleVeriant',
            title: 'Vehicle Variant',
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

  function handleSubmit(val) {
    console.log('valval', val);
    let postData = val?.data;
    console.log('postData', postData);
    if (flag == 'EDIT') {
      axios
        .put(
          Api.baseUri +
            '/user-reg/VehicleNewVerient/update-Vehicle-New-Verient',
          postData,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success('Vehicle Varaint Submitted Successfully');
            setForm(false);

            setOpenForm(false);
            setSelectedData({});
            getAll();
            setFlag('');
          }
        })
        .catch((err) => {
          console.log('err', err);
        });
    } else {
      axios
        .post(
          Api.baseUri + '/user-reg/VehicleNewVerient/save-Vehicle-New-Verient',
          postData,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success('Vehicle Varaint Submitted Successfully');
            closeBrand();

            setSelectedData({});
            getAll();
            setFlag('');
          } else {
            toast.error(
              res?.data?.message || 'Vehicle Varaint is all ready exist.',
            );
            setSelectedData({});
            closeBrand();

            getAll();
            setFlag('');
          }
        })
        .catch((err) => {
          console.log('err', err);
        });
    }
  }

  const tableTemplate = {
    columns: [
      {
        title: 'Category Name',
        field: 'vehicleVeriant',
      },
      {
        title: 'Status',
        field: 'status',
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
      {/* <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={3}>
          <CustomLabel labelVal='Vehicle Variant' variantVal='h3-underline' />
        </Grid>
        <Grid item xs={9} sx={{paddingTop: '0px !important'}}>
          <Box display='flex' justifyContent='flex-end' alignItems='center'>
            <div className='left-seperator'>
              <AppTooltip placement={'top'} title={'Add New Theme'}>
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
      </Grid> */}

      <div>
        <Accordion>
          <AccordionSummary
            onClick={() => {
              setClickedParent(el?.id);
            }}
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel1a-content'
            id='panel1a-header'
            sx={{
              '& .MuiAccordionSummary-content': {
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                alignItems: 'center',
              },
            }}
          >
            <Typography
              sx={{
                fontWeight: '900',
                display: 'flex',
                alignItems: 'center',
                width: '13%',
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              Vehicle Type
            </Typography>
            <Typography
              sx={{
                fontWeight: '900',
                display: 'flex',
                alignItems: 'center',
                width: '13%',
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {' '}
              Status
            </Typography>
            <Typography
              sx={{
                fontWeight: '900',
                display: 'flex',
                alignItems: 'center',
                width: '13%',
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              Created On
            </Typography>
            <Typography
              sx={{
                fontWeight: '900',
                display: 'flex',
                alignItems: 'center',
                width: '13%',
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              Updated On
            </Typography>
            <Typography
              sx={{
                fontWeight: '900',
                display: 'flex',
                alignItems: 'center',
                width: '13%',
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              Action
            </Typography>
          </AccordionSummary>
        </Accordion>
        {data?.map((el) => {
          return (
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls='panel1a-content'
                id='panel1a-header'
                sx={{
                  '& .MuiAccordionSummary-content': {
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                    alignItems: 'center',
                  },
                }}
              >
                <Typography
                  sx={{display: 'flex', alignItems: 'center', width: '13%'}}
                >
                  {el?.vehicleVeriant}
                </Typography>
                <Typography
                  sx={{display: 'flex', alignItems: 'center', width: '13%'}}
                >
                  {el?.status}
                </Typography>
                <Typography
                  sx={{display: 'flex', alignItems: 'center', width: '20%'}}
                >
                  {el?.createdBy +
                    '  ' +
                    moment(el?.createdOn).format('DD/MM/YYYY HH:MM')}
                </Typography>
                <Typography
                  sx={{display: 'flex', alignItems: 'center', width: '13%'}}
                >
                  {moment(el?.updatedOn).format('DD/MM/YYYY HH:MM')}
                </Typography>
                <div className='left-seperator' style={{width: '13%'}}>
                  <AppTooltip placement={'top'} title={'Edit Vehicle Type'}>
                    <EditIcon
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenForm(true);
                        setFlag('EDIT');
                        setSelectedData(el);
                      }}
                    />
                  </AppTooltip>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container>
                  <Grid item md={12}>
                    <Category
                      data={el?.vehicleSubCategoryDto}
                      vehicleId={el}
                      getAllList={getAll}
                    />
                  </Grid>
                  {/* <Grid
                    item
                    md={12}
                    sx={{display: 'flex', justifyContent: 'flex-end'}}
                  ></Grid>
                  <Grid md={12}>{console.log('el', el)}
                  
                  </Grid> */}
                </Grid>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </div>
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
                paddingRight: '1.5rem',
                width: '400px',
                paddingLeft: '1.5rem',
              }}
            >
              <h1 style={{marginTop: '1.5rem'}}>
                {flag == 'EDIT' ? 'Update Vehicle Type' : 'Vehicle Type'}
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
      {/* <Dialog
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
                paddingRight: '1.5rem',
                width: '400px',
                paddingLeft: '1.5rem',
              }}
            >
              <h1 style={{marginTop: '1.5rem'}}>
                {flag == 'EDIT' ? 'Update Vehicle Type' : 'Vehicle Type'}
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
      </Dialog> */}
    </div>
  );
};

export default VehicleType;
