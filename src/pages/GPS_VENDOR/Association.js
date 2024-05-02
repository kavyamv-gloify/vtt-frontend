import React, {useEffect, useState} from 'react';
import CancelScheduleSendIcon from '@mui/icons-material/CancelScheduleSend';
import SmartTable from '@smart-table';
import Confirm from '@confirmation-box';
import AppTooltip from '@crema/core/AppTooltip';
import axios from 'axios';
import Api from '@api';
import CustomLabel from 'pages/common/CustomLabel';
import {useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import moment from 'moment';
import CloseIcon from '@mui/icons-material/Close';
import SmartForm from '@smart-form';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from '@mui/material';
const tableTemplate = {
  columns: [
    {
      title: ' GPS Vendor',
      field: 'gpsVendorName',
    },
    {
      title: 'Vendor Name',
      field: 'vendorName',
      render: (rowData) =>
        rowData?.vendorName.map((el, i) => {
          return rowData?.vendorName?.length > i + 1 ? el + ', ' : el;
        }),
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
        return moment(rd.createdOn).format('DD/MM/YYYY HH:MM');
      },
    },
    {
      title: 'Last Updated ',
      field: 'updatedOn',
      type: 'datetime',
    },
  ],
};

const Association = () => {
  const [openDial, setOpenDial] = useState(false);
  const [corporateName, setCorporateName] = useState();
  const [vendorCorporate, setVendorCorporate] = useState();
  const [selectedCompliances, setSelectedCompliances] = useState();
  const [complianceList, setComplianceList] = useState([]);
  const [complianceListTem, setComplianceListTem] = useState([]);
  const [openVendorAssociate, setOpenVendorAssociate] = useState(false);
  const [data, setData] = useState([]);
  const [gpsVendorList, setgpsVendorList] = useState([]);
  const [delId, setDelId] = useState();
  const [openUnassociate, setOpenUnassociate] = useState(false);
  const [selectedGPSVendor, setSelectedGPSVendor] = useState({
    title: ' xyz',
    value: ' ',
  });
  const {id} = useParams();

  useEffect(() => {
    setSelectedCompliances(null);
    setComplianceListTem([]);
  }, [openDial]);
  useEffect(() => {
    axios.get(Api.baseUri + `/user-reg/corporate-reg/${id}`).then((res) => {
      if (res?.data?.status == '200') {
        setCorporateName(res?.data?.data);
      }
    });
  }, []);
  function closeConfirmBox(d) {
    setOpenUnassociate(false);
    if (d == 'YES') {
      let postData = {
        id: delId,
      };
      axios
        .post(
          Api.baseUri + `/user-reg/gps-provider/remove-gpsProvider`,
          postData,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success('GPS Vendor removed successfully.');
            getAll();
          } else {
            toast.error(res?.data?.message || 'Something went wrong.');
          }
        })
        .catch((er) => {
          toast.error('Something went wrong.');
        });
    }
  }
  useEffect(() => {
    getAll();
  }, [id]);
  useEffect(() => {
    getVendorByCorporate(id);
  }, [id]);

  useEffect(() => {
    console.log('delId', delId);
    let d2 = [];
    vendorCorporate?.map((el) => {
      delId?.vendorId?.map((e) => {
        if (e == el?.value) {
          d2.push(el);
        }
      });
    });
    console.log('d2', [...new Set(d2)]);
    setSelectedGPSVendor(d2);
  }, [delId]);
  function getVendorByCorporate(corporateId) {
    let temp = [];
    axios
      .get(
        Api.baseUri +
          `/user-reg/vendor-reg/get-All-Vendor-By-CorporateId/${corporateId}`,
      )
      .then((res) => {
        res?.data?.data?.map((el) => {
          temp.push({title: el?.vendorName, value: el?.id});
        });
        setVendorCorporate(temp ?? []);
      })
      .catch((err) => {
        setVendorCorporate([]);
      });
  }
  function getAll() {
    axios
      .get(
        Api.baseUri +
          '/user-reg/gps-provider/get-AllgpsVendorAssociateWithCorporate',
      )
      .then((res) => {
        setData(res?.data?.data || []);
      })
      .catch(() => {
        setData([]);
      });
    axios
      .get(Api.baseUri + '/user-reg/gps-provider/get-AllgpsProvider')
      .then((re) => {
        let tem = [];

        re?.data?.data.map((ele) => {
          tem.push({title: ele.vendorName, value: ele.id});
        });
        setgpsVendorList(tem || []);
      })
      .catch((er) => {
        setgpsVendorList([]);
      });
  }

  function handleSubmit() {
    console.log('selectedGps', selectedGPSVendor);
    let postData = {};
    let tempVendor = [];
    let tempId = [];
    postData.id = delId?.id;
    selectedGPSVendor?.map((el) => {
      tempVendor.push(el?.title);
      tempId.push(el?.value);
    });
    postData.vendorId = tempId;
    postData.vendorName = tempVendor;
    console.log('postData', postData);

    axios
      .post(Api.baseUri + '/user-reg/gps-provider/update-gpsProvider', postData)
      .then((res) => {
        if (res?.data?.status == '200') {
          toast.success('GPS Vendor associated with vendor successfully');
          setOpenVendorAssociate(false);
          getAll();
        } else if (res?.data?.status == '500') {
          toast.error(res?.data?.message);
          setOpenVendorAssociate(false);
        } else {
          toast.error('Something went wrong');
          setOpenVendorAssociate(false);
        }
      })
      .catch((err) => {
        console.log('err');
      });
  }
  return (
    <div>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={8}>
          <CustomLabel labelVal='GPS Vendor List' variantVal='h3-underline' />
        </Grid>
        <Grid item xs={4}>
          <Box display='flex' justifyContent='flex-end'>
            <div className='left-seperator'>
              <AppTooltip placement={'top'} title={'Associate With Corporate'}>
                <img
                  src='/assets/images/title-icon/add vehicle variant.svg'
                  className='title-icons-mui'
                  onClick={() => {
                    setOpenDial(true);
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
        columns={tableTemplate.columns}
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
          (data) => ({
            icon: () => <AssignmentTurnedInIcon color='primary' />,
            tooltip: 'Associate Vendor',
            onClick: (event, rowData) => {
              setDelId(rowData);
              setOpenVendorAssociate(true);
            },
          }),
          (data) => ({
            icon: () => (
              <CancelScheduleSendIcon
                color='primary'
                style={{
                  color: '#bc0805',
                }}
              />
            ),
            tooltip: 'Remove',
            onClick: (event, rowData) => {
              setOpenUnassociate(true);
              setDelId(rowData?.id);
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
      {openUnassociate && (
        <Confirm
          open={true}
          header={'Confirm to Remove'}
          cnfMsg={'Are you sure, You want to remove it?'}
          handleClose={closeConfirmBox}
        />
      )}
      {openDial && (
        <Dialog
          onClose={() => {
            setOpenDial(false);
          }}
          open={true}
          PaperProps={{
            sx: {
              width: '600px',
            },
          }}
          style={{borderRadius: '4rem'}}
        >
          <DialogTitle
            style={{
              background: '#f5f2f2',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <h1>Associate GPS Corporate</h1>
            <CloseIcon
              onClick={() => {
                setOpenDial(false);
              }}
              style={{color: '#4f4f4f', fontWeight: 'bold'}}
            />
          </DialogTitle>
          <DialogContent>
            <div style={{paddingTop: '20px', width: '100%'}}>
              <h5>
                Select GPS Vendor <span style={{color: 'red'}}>*</span>
              </h5>
              <Autocomplete
                name='vendorId'
                options={gpsVendorList || []}
                getOptionLabel={(option) => option.title}
                onChange={(e, data) => {
                  console.log('data', data);
                  setSelectedGPSVendor(data);
                }}
                size='small'
                id='combo-box-demo'
                sx={{width: '100%', mt: 2, mb: 4}}
                renderInput={(params) => {
                  return (
                    <TextField {...params} id='outlined-error-helper-text' />
                  );
                }}
              />

              <div style={{width: '100%', textAlign: 'center'}}>
                <Button
                  sx={{mt: 6}}
                  variant='contained'
                  onClick={() => {
                    setOpenDial(false);
                    let postData = {};
                    postData = {
                      corporateId: id,
                      corporateName: corporateName?.companyName,
                      vendorId: [],
                      vendorName: [],
                      gpsVendorId: selectedGPSVendor?.value,
                      gpsVendorName: selectedGPSVendor?.title,
                    };

                    axios
                      .post(
                        Api.baseUri +
                          '/user-reg/gps-provider/associate-gpsProvider',
                        postData,
                      )

                      .then((res) => {
                        if (res?.data?.status == '200') {
                          toast.success(
                            'GPS associated successfully with corporate',
                          );
                          getAll();
                        } else {
                          toast.error(
                            res?.data?.message || 'Something went wrong.',
                          );
                        }
                      })
                      .catch(() => {
                        toast.error('Something went wrong.');
                      });
                  }}
                >
                  Associate
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Dialog
        // onClose={handleClose}
        open={openVendorAssociate}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '40%',
          },
        }}
        style={{borderRadius: '4rem'}}
      >
        <DialogTitle
          style={{
            background: '#f5f2f2',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <h1>Associate with vendor</h1>
          <CloseIcon
            onClick={() => {
              setOpenVendorAssociate(false);
            }}
            style={{color: '#4f4f4f', fontWeight: 'bold'}}
          />
        </DialogTitle>
        <DialogContent style={{padding: '0px'}}>
          <div style={{padding: '20px', paddingBottom: '0', marginTop: '10px'}}>
            <span>
              <b>GPS Vendor: </b> {delId?.gpsVendorName}
            </span>
          </div>
          <div style={{padding: '20px', paddingTop: '0'}}>
            <Autocomplete
              name='vendorId'
              multiple
              value={selectedGPSVendor || []}
              options={vendorCorporate || []}
              getOptionLabel={(option) => option.title}
              onChange={(e, data) => {
                console.log('data', data);
                let all = [];
                let is_all = false;
                setSelectedGPSVendor(data);
                // if (data?.length) {
                //   data?.map((el) => {
                //     if (el.value == 'ALL') is_all = true;
                //   });
                //   vehicleType?.map((el) => {
                //     if (el.value != 'ALL') all.push(el);
                //   });
                // }
                // setSelVehicleType(is_all ? all : data);
              }}
              // onChange={(e, data) => {
              //   setSelectedGPSVendor(data);
              // }}
              size='small'
              id='combo-box-demo'
              sx={{width: '100%', mt: 2, mb: 4}}
              renderInput={(params) => {
                return (
                  <TextField {...params} id='outlined-error-helper-text' />
                );
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {' '}
              <Button
                variant='contained'
                onClick={() => {
                  handleSubmit();
                }}
              >
                Associate
              </Button>
            </div>

            <br />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Association;
