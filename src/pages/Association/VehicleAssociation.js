import React, {useState, useEffect} from 'react';
import {
  Grid,
  Autocomplete,
  TextField,
  Box,
  Checkbox,
  InputAdornment,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CustomLabel from 'pages/common/CustomLabel';
import {useAuthUser} from '@crema/utility/AuthHooks';
import AppTooltip from '@crema/core/AppTooltip';
import Api from '@api';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CreditCardOffIcon from '@mui/icons-material/CreditCardOff';
import {toast} from 'react-toastify';
import moment from 'moment';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CloseIcon from '@mui/icons-material/Close';
import SmartForm from '@smart-form';
import PersonIcon from '@mui/icons-material/Person';
import {useParams} from 'react-router-dom';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
const VehicleAssociation = () => {
  const {user} = useAuthUser();
  const [vendorList, setVendorList] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [tenant, setTenant] = useState();
  const [corporate, setCorporate] = useState();
  const [corporateId, setCorporateId] = useState();
  const [vendorId, setVendorId] = useState();
  const [dummyData, setDummyData] = useState([]);
  const [associate, setAssociate] = useState(false);
  const [unassociate, setUnassociate] = useState(false);
  const [newData, setNewData] = useState([]);
  const [vendorCorporate, setVendorCorporate] = useState();
  const [corpUnassociate, setCorpUnassociate] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState();
  const [selectedCorpList, setSelectedCorpList] = useState([]);
  const [selectedVendorList, setSelectedVendorList] = useState([]);
  const [selectedCorporate, setSelectedCorporate] = useState();
  const [selectedVendor, setSelectedVendor] = useState({});
  const [venUnassociate, setVenUnassociate] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState();
  const [associatePopup, setAssociatePopup] = useState(false);
  const {id} = useParams();
  const label = {inputProps: {'aria-label': 'Checkbox demo'}};
  useEffect(() => {
    getVendorList();
  }, []);

  function handleChange(e) {
    console.log('e', e?.target?.name, e?.target?.checked);
    if (e?.target?.name == 'all') {
      const isSelected = dummyData?.map((el) => {
        return {...el, checked: e?.target?.checked};
      });
      setDummyData(isSelected);
    } else {
      const isSelected = dummyData.map((el) =>
        el?.id == e?.target?.name ? {...el, checked: e?.target?.checked} : el,
      );
      setDummyData(isSelected);
    }
    if (e?.target?.checked === true) {
      setAssociatePopup(true);
    } else {
      setAssociatePopup(false);
    }
  }

  useEffect(() => {
    axios
      .get(
        Api.baseUri +
          '/user-reg/tenant-reg?page=0&size=1000&mobileNo=null&emailId=null&companyPAN=null&companyGSTN=null',
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          let temp = [];
          res?.data?.data?.body['Tanent List']?.map((el) => {
            temp.push({
              title:
                el?.companyName + el?.companyCode + '(' + el?.emailId + ')',
              value: el?.id,
            });
          });
          setTenant(temp ?? []);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  }, []);
  useEffect(() => {
    console.log('dummyData', dummyData);
  }, [dummyData]);
  function getCorporate(id) {
    axios
      .get(Api.baseUri + '/user-reg/corporate-reg/getCorporateByTanentId/' + id)
      .then((res) => {
        if (res?.data?.status == '200') {
          let temp = [];
          res?.data?.data?.map((el) => {
         
            temp.push({
              title:
                el?.companyName + el?.companyCode + '(' + el?.emailId + ')',
              value: el,
            });
          });
          setCorporate(temp ?? []);
        }
      })
      .catch((err) => {});
  }

  const getVendorList = () => {
    axios
      .get(
        Api.baseUri +
          `/user-reg/associatevendor/getallassociateVendorBycorporateId/${id}`,
      )
      .then((re) => {
        console.log('re', re);
        let temArr = []; // + ' (' + el?.vendor?.vendorCode + ')'
        re?.data?.data?.length &&
          re?.data?.data?.map((el) => {
            if (el)
              temArr.push({
                value: el?.vendor?.id,
                title: el?.vendor?.vendorName,
                createdOn: el?.vendor?.createdOn,
                vendorName: el?.vendor?.vendorName,
                vendorCode: el?.vendor?.vendorCode,
              });
          });
        console.log('sortedProducts', temArr);
        setVendorList(temArr ?? []);
      })
      .catch((err) => {
        setVendorList([]);
      });
  };
  function getVendorVehicle(vendor) {
    axios
      .get(
        Api.baseUri +
          `/user-reg/associateVehicle/getAllAssociatedVehicles?corporateId=${id}&vendorId=${vendor}`,
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          console.log('res', res);
          let temp = [];
          let tempVen = [];
          let result = res?.data?.data?.map((el) => {
            el?.associatedWithCorporate?.map((e) => {
              temp.push(e?.id);
              el.tempCorps = [...new Set(temp)];
            });
            el?.associatedWithVendor?.map((_e) => {
              tempVen.push(_e?.id);
              el.tempVendors = [...new Set(tempVen)];
            });
            return el;
          });
          console.log('tep', temp);
          console.log('tep++++', tempVen);
          console.log('result', result);
          setNewData(result ?? []);
          setDummyData(result ?? []);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  }

  useEffect(() => {
    if (searchTerm && searchTerm != '' && newData) {
      const searchTerms = searchTerm
        .toLowerCase()
        .split(',')
        .map((t) => t.trim());
      console.log('searchTerms', searchTerms);
      const filteredDrivers = newData.filter((vehicle) => {
        // Check if the full name includes either "Sumit" or "driver"
        return searchTerms.some(
          (term) =>
            vehicle?.vehicle?.vehicleNumberPlate
              ?.toLowerCase()
              .includes(term) ||
            vehicle?.vehicle?.fuelType?.toLowerCase().includes(term) ||
            vehicle?.vehicle?.vehicleTypeName?.toLowerCase().includes(term),
        );
      });
      console.log('filteredDrivers', filteredDrivers);
      setDummyData(filteredDrivers);
    } else {
      setDummyData(newData);
    }
  }, [searchTerm]);

  function getVendorByCorporate(corporateId) {
    let temp = [];
    axios
      .get(
        Api.baseUri +
          `/user-reg/vendor-reg/get-All-Vendor-By-CorporateId/${corporateId}`,
      )
      .then((res) => {
        console.log('res', res);
        res?.data?.data?.map((el) => {
          temp.push({title: el?.vendorName, value: el?.id});
        });
        setVendorCorporate(temp ?? []);
      })
      .catch((err) => {
        console.log('err', err);
        setVendorCorporate([]);
      });
  }

  function associateVehicle() {
    console.log('dummyData', dummyData);
    let temp = [];
    dummyData?.map((el) => {
      if (el?.checked == true) {
        temp.push(el?.vehicleId);
      }
    });
    console.log('temp', temp);

    axios
      .post(
        Api.baseUri +
          `/user-reg/associateVehicle/save?vehicleId=${temp}&corporateId=${corporateId}&vendorId=${
            vendorId?.length ? vendorId : null
          }`,
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          toast.success('Vehicle associated Successfully');
          getVendorVehicle(selectedVehicle);
          setAssociate(false);
          console.log('res', res);
        } else if (res?.data?.status == '400') {
          toast.error(res?.data?.message);
        } else {
          toast.error('Something went wrong');
          setAssociate(false);
        }
      })
      .catch((err) => {
        toast.error('Something went wrong');
      });
  }

  useEffect(() => {
    console.log('selec', selectedVehicle);
    if (!selectedVehicle?.id) {
      return;
    }
    let temp = [];
    let tempVendor = [];
    if (selectedVehicle?.id) {
      console.log('selectedDriver?.tempCorps', selectedVehicle?.tempCorps);
      selectedVehicle?.associatedCorporateList?.map((el) => {
        temp.push({title: el?.companyName, value: el?.id});
      });
      selectedVehicle?.associatedVendorList?.map((el) => {
        tempVendor.push({
          title: el?.vendorName,
          value: el?.id,
        });
      });
      console.log('tempVendor', tempVendor, temp);
      setSelectedVendorList(tempVendor ?? []);
      setSelectedCorpList(temp ?? []);
    }
  }, [selectedVehicle]);

  return (
    <div>
      <Grid container>
        <Grid md={4}>
          <CustomLabel labelVal='Associate-Vehicle' variantVal='h3-underline' />
        </Grid>
        <Grid md={5} sx={{display: 'flex'}}>
          <TextField
            sx={{m: 1, width: 350}}
            size='small'
            autoComplete='off'
            onChange={(e) => {
              console.log('e', e?.target?.value);
              setSearchTerm(e?.target?.value);
            }}
            value={searchTerm}
            placeholder='vehicle number plate'
            style={{borderRadius: '20px', marginRight: '10px'}}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position='end'>
                  <CloseOutlinedIcon
                    sx={{cursor: 'pointer', fontSize: '1.5rem'}}
                    onClick={() => {
                      setSearchTerm('');
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={9} md={3} sx={{paddingTop: '0px !important'}}>
          {/* <Box display='flex' alignItems='center' flexDirection='flex-end'> */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {/* <Autocomplete
              disablePortal
              id='actions'
              size='small'
              options={vendorList}
              getOptionLabel={(option) => option.title}
              onChange={(e, v) => {
                console.log('v', v);
                getVendorVehicle(v?.value);
              }}
              sx={{width: '100%', m: 2, maxWidth: '250px'}}
              renderInput={(params) => <TextField {...params} label='Vendor' />}
            /> */}
            <Autocomplete
              // {...defaultProps}
              id='auto-complete'
              autoComplete
              options={vendorList ?? []}
              size='small'
              sx={{width: '100%', maxWidth: '250px'}}
              onChange={(e, v) => {
                console.log('v', v);
                setSelectedVehicle(v?.value);
                setSelectedVendor(v);
                getVendorVehicle(v?.value);
              }}
              getOptionLabel={(option) => option.title}
              includeInputInList
              renderInput={(params) => (
                <TextField {...params} label='Vendor' variant='standard' />
              )}
            />
            <AppTooltip title={'Associate Vehicle'}>
              <CreditCardIcon
                onClick={() => {
                  if (!selectedVendor) {
                    toast.error('Please select the vendor first.');
                    return;
                  }
                  if (newData?.length === 0) {
                    toast.error('Please select the vendor first.');
                  }
                  else if (newData?.length && associatePopup === true) {
                    setAssociate(true);
                  } else if (newData?.length && associatePopup === false) {
                    toast.error('Please Select the Vehicle Brand first.');
                  } else {
                    toast.error('Please Select the Vehicle Brand first.');
                  }
                }}
              />
            </AppTooltip>
          </div>
        </Grid>
      </Grid>

      <Grid container sx={{marginTop: '10px'}}>
        <div style={{height: '500px', width: '100%'}}>
          <TableContainer
            sx={{
              border: '2px solid white',
              borderRadius: '10px',
              maxHeight: '590px',
              overflowY: 'auto',
            }}
          >
            <Table sx={{minWidth: 850}} size='small' aria-label='a dense table'>
              <TableHead
                sx={{
                  background: '#f6f6f6',
                  fontWeight: 'bold',
                  position: 'sticky',
                  top: 0,
                  zIndex: '1',
                }}
              >
                <TableRow>
                  {/* <TableCell component='th' scope='row'></TableCell> */}
                  <TableCell sx={{fontWeight: 'bold'}}>
                    <Checkbox
                      {...label}
                      onChange={handleChange}
                      className='form-check-input'
                      name='all'
                    />
                    Vehicle Brand
                  </TableCell>
                  <TableCell align='left' sx={{fontWeight: 'bold'}}>
                    Vehicle Number
                  </TableCell>

                  <TableCell align='left' sx={{fontWeight: 'bold'}}>
                    Fuel Type
                  </TableCell>
                  <TableCell align='left' sx={{fontWeight: 'bold'}}>
                    Vehicle Type
                  </TableCell>
                  <TableCell align='left' sx={{fontWeight: 'bold'}}>
                    Model Name
                  </TableCell>
                  {/* <TableCell align='left' sx={{fontWeight: 'bold'}}>
                    Status
                  </TableCell> */}
                  <TableCell
                    align='left'
                    sx={{width: '60px', fontWeight: 'bold'}}
                  >
                    Associated With Corporate
                  </TableCell>
                  <TableCell
                    align='left'
                    sx={{width: '60px', fontWeight: 'bold'}}
                  >
                    Associated With Vendor
                  </TableCell>
                  <TableCell align='left' sx={{fontWeight: 'bold'}}>
                    Created By
                  </TableCell>
                  <TableCell align='left' sx={{fontWeight: 'bold'}}>
                    Last Updated On
                  </TableCell>
                  <TableCell align='left' sx={{fontWeight: 'bold'}}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{background: 'white', scrollBehavior: 'smooth'}}>
                {dummyData?.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                  >
                    <TableCell component='th' scope='row'>
                      <Checkbox
                        {...label}
                        name={row?.id}
                        checked={row?.checked == true ? true : false}
                        onChange={(e) => {
                          handleChange(e);
                        }}
                      />
                      {row?.vehicle?.vehicleBrand}
                    </TableCell>
                    <TableCell align='left'>
                      {' '}
                      {row?.vehicle?.vehicleNumberPlate}
                    </TableCell>

                    <TableCell align='left'>
                      {' '}
                      {row?.vehicle?.fuelType}
                    </TableCell>
                    <TableCell align='left'>
                      {' '}
                      {row?.vehicle?.vehicleTypeName}
                    </TableCell>
                    {/* <TableCell align='left'> {row?.status}</TableCell> */}
                    <TableCell align='left' sx={{width: '60px'}}>
                      {row?.vehicle?.modelName}
                    </TableCell>
                    {/* <TableCell
                      align='left'
                      sx={{
                        color:
                          row?.vehicle?.profileStatus == 'ACTIVE'
                            ? 'green'
                            : 'orange',
                      }}
                    >
                      {' '}
                      {row?.vehicle?.profileStatus === 'DEFAULT'
                        ? 'Not Verified'
                        : 'Verified'}
                    </TableCell> */}
                    <TableCell align='left'>
                      {' '}
                      {row?.associatedCorporateList?.map((e, index) => {
                        if (index > 2) {
                          return;
                        }
                        return <p>{e?.companyName + ','}</p>;
                      })}
                    </TableCell>
                    <TableCell align='left'>
                      {' '}
                      {row?.associatedVendorList?.map((e, index) => {
                        if (index > 2) {
                          return;
                        }
                        return <p>{e?.vendorName + ','}</p>;
                      })}
                    </TableCell>
                    <TableCell align='left'>
                      <p>{row?.vehicle?.createdBy}</p>
                      <p>
                        {' '}
                        {moment(row?.vehicle?.createdOn).format('DD/MM/YYYY')}
                      </p>
                    </TableCell>
                    <TableCell align='left'>
                      {' '}
                      {moment(row?.vehicle?.updatedOn).format('DD/MM/YYYY')}
                    </TableCell>
                    <TableCell align='left'>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <AppTooltip title='Corporate Unassociate'>
                          <AccountBalanceIcon
                            onClick={() => {
                              setCorpUnassociate(true);
                              setSelectedVehicle(row);
                            }}
                          />
                        </AppTooltip>
                        <AppTooltip title='Vendor Unassociate'>
                          <PersonIcon
                            sx={{marginLeft: '10px'}}
                            onClick={() => {
                              setVenUnassociate(true);
                              setSelectedVehicle(row);
                            }}
                          />
                        </AppTooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Grid>
      <Grid container></Grid>

      <Dialog
        open={associate}
        onClose={() => {
          setAssociate(false);
        }}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '800px',
            overflowY: 'unset',
          },
        }}
        style={{borderRadius: '4rem'}}
      >
        <DialogTitle style={{
            background: '#f5f2f2',
            display: 'flex',
            justifyContent: 'space-between',
          }}>
          <h1>Associate </h1>
          <CloseIcon
            onClick={() => {
              setAssociate(false);
            }}
            style={{color: '#4f4f4f', fontWeight: 'bold'}}
          />
        </DialogTitle>
        <DialogContent
          sx={{
            display: 'flex',
            // justifyContent: 'center',
            // alignItems: 'center',
            marginTop: '10px',
            flexDirection: 'column',
            marginBottom: '40px',
          }}
        >
          <div style={{display: 'flex', marginBottom: '20px'}}>
            <Autocomplete
              disablePortal
              id='actions'
              size='small'
              options={tenant}
              getOptionLabel={(option) => option.title}
              onChange={(e, v) => {
                console.log('v', v);
                getCorporate(v?.value);
              }}
              sx={{width: '100%', m: 2, maxWidth: '250px'}}
              renderInput={(params) => <TextField {...params} label='Tenant' />}
            />
            <Autocomplete
              disablePortal
              id='actions'
              size='small'
              options={corporate ?? []}
              getOptionLabel={(option) => option.title}
              onChange={(e, v) => {
                console.log('v', v?.id);
                setCorporateId(v?.value?.id);
                getVendorByCorporate(v?.value?.id);
              }}
              sx={{width: '100%', m: 2, maxWidth: '250px'}}
              renderInput={(params) => (
                <TextField {...params} label='Corporate' />
              )}
            />
            <Autocomplete
              disablePortal
              id='actions'
              size='small'
              options={vendorCorporate ?? []}
              getOptionLabel={(option) => option.title}
              onChange={(e, v) => {
                console.log('v', v);
                setVendorId(v?.value);
              }}
              sx={{width: '100%', m: 2, maxWidth: '250px'}}
              renderInput={(params) => <TextField {...params} label='Vendor' />}
            />
          </div>
          {/* <div style={{width: '100px'}}> */}
          <Button
            variant='contained'
            sx={{margin: 'auto'}}
            onClick={() => {
              associateVehicle();
            }}
          >
            Submit
          </Button>
          {/* </div> */}
        </DialogContent>
      </Dialog>

      <Dialog
        // onClose={handleClose}
        open={corpUnassociate}
        maxWidth='false'
        PaperProps={{
          // 65e05064ab44ea6ed04a4712
          sx: {
            width: '30%',
            overflowY: 'unset',
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
          <h1>Unassociate with Corporate</h1>
          <CloseIcon
            onClick={() => {
              setCorpUnassociate(false);
            }}
            style={{color: '#4f4f4f', fontWeight: 'bold'}}
          />
        </DialogTitle>
        <DialogContent style={{padding: '0px'}}>
          <div style={{padding: '20px', paddingBottom: '0', marginTop: '10px'}}>
            <span>
              <b>Corporate: </b> {selectedVehicle?.firstName}
            </span>
          </div>
          <div style={{padding: '20px', paddingTop: '0'}}>
            <Autocomplete
              disablePortal
              id='actions'
              size='small'
              options={selectedCorpList ?? []}
              getOptionLabel={(option) => option.title}
              onChange={(e, v) => {
                console.log('v', v?.value);
                setSelectedCorporate(v?.value);
              }}
              sx={{width: '100%', m: 2, maxWidth: '500px'}}
              renderInput={(params) => <TextField {...params} />}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Button
                variant='contained'
                onClick={() => {
                  if (selectedCorpList?.length == 1 && selectedCorporate) {
                    toast.error(
                      'Atleast one corporate should be associated with the vehicle',
                    );
                    return;
                  } else {
                    axios
                      .delete(
                        Api.baseUri +
                          `/user-reg/associateVehicle/unAssociateVehicleFromCorporate?vehicleId=${selectedVehicle?.vehicleId}&corporateId=${selectedCorporate}`,
                      )
                      .then((res) => {
                        if (res?.data?.status == '200') {
                          toast.success('Corporate Unassociated successfully');
                          getVendorVehicle(selectedVehicle);
                          setCorpUnassociate(false);
                        } else {
                          toast.error('Something went wrong');
                        }
                      })
                      .catch((err) => {
                        console.log('err', err);
                      });
                  }
                }}
              >
                Unassociate
              </Button>
            </div>

            <br />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        // onClose={handleClose}
        open={venUnassociate}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '30%',
            overflowY: 'unset',
          },
        }}
      >
        <DialogTitle
          style={{
            background: '#f5f2f2',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <h1>Unassociate with Vendor</h1>
          <CloseIcon
            onClick={() => {
              setVenUnassociate(false);
            }}
            style={{color: '#4f4f4f', fontWeight: 'bold'}}
          />
        </DialogTitle>
        <DialogContent style={{padding: '0px'}}>
          <div style={{padding: '20px', paddingBottom: '0', marginTop: '10px'}}>
            <span>
              <b>Vehicle: </b> {selectedVehicle?.firstName}
            </span>
          </div>
          <div style={{padding: '20px', paddingTop: '0'}}>
            <Autocomplete
              disablePortal
              id='actions'
              size='small'
              options={selectedVendorList ?? []}
              getOptionLabel={(option) => option.title}
              onChange={(e, v) => {
                console.log('v', v?.value);
                setSelectedVendor(v?.value);
              }}
              sx={{width: '300', m: 4}}
              renderInput={(params) => <TextField {...params} />}
            />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Button
                variant='contained'
                onClick={() => {
                  if (selectedVendorList?.length == 1 && selectedVendor) {
                    toast.error(
                      'Atleast one vendor should be associated with the vehicle',
                    );
                    return;
                  } else {
                    axios
                      .delete(
                        Api.baseUri +
                          `/user-reg/associateVehicle/unAssociateVehicleFromVendor?vehicleId=${selectedVehicle?.vehicleId}&vendorId=${selectedVendor}`,
                      )
                      .then((res) => {
                        if (res?.data?.status == '200') {
                          toast.success('Vendor Unassociated successfully');
                          // getVendorVehicle(selectedVehicle);
                          setVenUnassociate(false);
                        } else {
                          toast.error('Something went wrong');
                        }
                      })
                      .catch((err) => {
                        console.log('err', err);
                      });
                  }
                }}
              >
                Unassociate
              </Button>
            </div>

            <br />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VehicleAssociation;
