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
const DriverAssociation = () => {
  const {user} = useAuthUser();
  const [vendorList, setVendorList] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [tenant, setTenant] = useState();
  const [corporate, setCorporate] = useState();
  const [corporateId, setCorporateId] = useState();
  const [vendorId, setVendorId] = useState();
  const [selectedVendorId, setSelectedVendorId] = useState();
  const [dummyData, setDummyData] = useState([]);
  const [associate, setAssociate] = useState(false);
  const [newData, setNewData] = useState([]);
  const [vendorCorporate, setVendorCorporate] = useState();
  const [corpUnassociate, setCorpUnassociate] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState();
  const [selectedCorpList, setSelectedCorpList] = useState([]);
  const [selectedVendorList, setSelectedVendorList] = useState([]);
  const [selectedCorporate, setSelectedCorporate] = useState();
  const [selectedVendor, setSelectedVendor] = useState();
  const [venUnassociate, setVenUnassociate] = useState(false);
  const [associatePopup, setAssociatePopup] = useState(false);
  const {id} = useParams();
  console.log('id', id);
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
      console.log(isSelected);
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
  function getAllDriver(vendor) {
    console.log('vendor', vendor);
    axios
      .get(
        Api.baseUri +
          `/user-reg/associateDriver/getAllAssociatedDrivers?corporateId=${id}&vendorId=${vendor}`,
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
    console.log('searchTerm', searchTerm);
    if (searchTerm && searchTerm != '' && newData) {
      const searchTerms = searchTerm
        .toLowerCase()
        .split(',')
        .map((t) => t.trim());
      console.log('searchTerms', searchTerms);
      const filteredDrivers = newData.filter((driver) => {
        return searchTerms.some(
          (term) =>
            driver?.driver?.firstName?.toLowerCase().includes(term) ||
            driver?.driver?.lastName?.toLowerCase().includes(term) ||
            driver?.driver?.mobileNo?.includes(term) ||
            driver?.driver?.emailId?.toLowerCase().includes(term),
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

  function associateDriver() {
    console.log('dummyData', dummyData);
    let temp = [];
    dummyData?.map((el) => {
      if (el?.checked == true) {
        temp.push(el?.driverId);
      }
    });
    console.log('temp', temp);

    axios
      .post(
        Api.baseUri +
          `/user-reg/associateDriver/save?driverId=${temp}&corporateId=${corporateId}&vendorId=${
            vendorId?.length ? vendorId : null
          }`,
      )
      .then((res) => {
        console.log("res", res)
        if (res?.data?.status == '200') {
        
          toast.success('Driver associated Successfully');
          getAllDriver(selectedVendorId);
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
    console.log('selec', selectedDriver);
    if (!selectedDriver?.id) {
      return;
    }
    let temp = [];
    let tempVendor = [];
    if (selectedDriver?.id) {
      selectedDriver?.associatedCorporateList?.map((el) => {
        temp.push({title: el?.companyName, value: el?.id});
      });
      selectedDriver?.associatedVendorList?.map((el) => {
        tempVendor.push({
          title: el?.vendorName,
          value: el?.id,
        });
      });
      setSelectedVendorList(tempVendor ?? []);
      setSelectedCorpList(temp ?? []);
    }
  }, [selectedDriver]);

  return (
    <div>
      <Grid container>
        <Grid md={4}>
          <CustomLabel labelVal='Associate-Driver' variantVal='h3-underline' />
        </Grid>
        <Grid md={5}>
          <TextField
            sx={{m: 1, width: 350}}
            size='small'
            autoComplete='off'
            onChange={(e) => {
              console.log('e', e?.target?.value);
              setSearchTerm(e?.target?.value);
            }}
            value={searchTerm}
            placeholder='Driver search'
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
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Autocomplete
              id='auto-complete'
              autoComplete
              options={vendorList ?? []}
              size='small'
              sx={{width: '100%', maxWidth: '250px'}}
              onChange={(e, v) => {
                setSelectedVendorId(v?.value);
                getAllDriver(v?.value);
              }}
              getOptionLabel={(option) => option.title}
              includeInputInList
              renderInput={(params) => (
                <TextField {...params} label='Vendor' variant='standard' />
              )}
            />
            <AppTooltip title={'Associate Driver'}>
              <CreditCardIcon
                onClick={() => {
                  if (!selectedVendorId) {
                    toast.error('Select Vendor First.');
                    return;
                  }

                  if (newData?.length === 0) {
                    toast.error('Select Vendor First');
                  }
                  // setAssociate(true);
                  else if (newData?.length && associatePopup === true) {
                    setAssociate(true);
                  }
                  else if (newData?.length && associatePopup === false) {
                    toast.error('Please Select the Driver first.');
                  } else {
                    toast.error('Please Select the Driver first.');
                  }
                }}
              />
            </AppTooltip>
          </div>
        </Grid>
      </Grid>
      <Grid container>
        <div style={{height: '500px', width: '100%'}}>
          <TableContainer
            sx={{
              maxHeight: '590px',
              overflowY: 'auto',
              border: '2px solid white',
            }}
          >
            <Table
              sx={{
                minWidth: 850,
                // tableLayout: 'fixed',
                // maxHeight: '630px',
                // // tableLayout: 'fixed',
                // overflow: 'auto',
              }}
              size='small'
              aria-label='a dense table'
            >
              <TableHead
                sx={{
                  background: '#f6f6f6',
                  position: 'sticky',
                  fontWeight: 'bold',
                  top: 0,
                  // backgroundColor: '#f5f5f5',
                  zIndex: '1',
                }}
              >
                <TableRow>
                  <TableCell component='th' scope='row'>
                    <Checkbox
                      {...label}
                      onChange={handleChange}
                      className='form-check-input'
                      name='all'
                    />
                  </TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell align='left'>Address</TableCell>
                  <TableCell align='left'>Driving License</TableCell>
                  <TableCell align='left'>Email</TableCell>
                  <TableCell align='left'>Mobile No.</TableCell>
                  <TableCell align='left'>Status</TableCell>
                  <TableCell align='left' sx={{width: '60px'}}>
                    Associated With Corporate
                  </TableCell>
                  <TableCell align='left' sx={{width: '60px'}}>
                    Associated With Vendor
                  </TableCell>
                  <TableCell align='left'>Profile Status</TableCell>
                  <TableCell align='left'>Created By</TableCell>
                  <TableCell align='left'>Last Updated On</TableCell>
                  <TableCell align='left'>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody
                style={{scrollBehavior: 'smooth', background: 'white'}}
              >
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
                    </TableCell>
                    <TableCell component='th' scope='row'>
                      {row?.driver?.firstName + ' ' + row?.driver?.lastName}
                    </TableCell>
                    <TableCell align='left'>
                      {' '}
                      {row?.driver?.address?.addressName?.replace(/\+\+/g, ",") || 'NA'}
                      {/* {row?.driver?.address?.addressName?.split("++") || 'NA'} */}
                    </TableCell>
                    <TableCell align='left'> {row?.driver?.dlNumber}</TableCell>
                    <TableCell align='left'> {row?.driver?.emailId}</TableCell>
                    <TableCell align='left'> {row?.driver?.mobileNo}</TableCell>
                    <TableCell align='left'> {row?.driver?.status}</TableCell>
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
                    <TableCell
                      align='left'
                      sx={{
                        color:
                          row?.driver?.profileStatus == 'ACTIVE'
                            ? 'green'
                            : 'orange',
                      }}
                    >
                      {' '}
                      {row?.driver?.profileStatus === 'DEFAULT'
                        ? 'Not Verified'
                        : 'Verified'}
                        {/*  */}
                    </TableCell>
                    <TableCell align='left'>
                      <p>{row?.driver?.createdBy} </p>
                      <p>
                        {moment(row?.driver?.createdOn).format(
                          'DD-MM-YYYY HH:MM',
                        )}
                      </p>
                    </TableCell>
                    <TableCell align='left'>
                      {' '}
                      {moment(row?.driver?.updatedOn).format(
                        'DD-MM-YYYY HH:MM',
                      )}
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
                              setSelectedDriver(row);
                            }}
                          />
                        </AppTooltip>
                        <AppTooltip title='Vendor Unassociate'>
                          <PersonIcon
                            sx={{marginLeft: '10px'}}
                            onClick={() => {
                              setVenUnassociate(true);
                              setSelectedDriver(row);
                            }}
                          />
                        </AppTooltip>
                        {console.log(
                          'selectedDreiver',
                          selectedDriver?.vendorId,
                        )}
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
        <DialogTitle style={{background: '#f5f2f2'}}>
          <h1>Associate </h1>
          {/* <CloseIcon
            onClick={handlecloseDetail}
            style={{
              position: 'absolute',
              right: '12px',
              top: '12px',
              color: '#4f4f4f',
            }}
          /> */}
        </DialogTitle>
        <DialogContent
          sx={{
            display: 'flex',
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

          <Button
            variant='contained'
            sx={{margin: 'auto'}}
            onClick={() => {
              associateDriver();
              // getAllDriver(selectedVendorId);
            }}
          >
            Submit
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog
        // onClose={handleClose}
        open={corpUnassociate}
        maxWidth='false'
        PaperProps={{
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
              <b>Driver : </b>{' '}
              {selectedDriver?.driver?.firstName +
                ' ' +
                selectedDriver?.driver?.lastName}
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
              renderInput={(params) => (
                <TextField {...params} label='Corporate' />
              )}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                margin: 'auto',
                width: '100%',
              }}
            >
              <Button
                variant='contained'
                onClick={() => {
                  if (selectedCorpList?.length == 1 && selectedCorporate) {
                    toast.error(
                      'Atleast one corporate should be associated with the driver',
                    );
                    return;
                  } else {
                    axios
                      .delete(
                        Api.baseUri +
                          `/user-reg/associateDriver/unAssociateDriverFromCorporate?driverId=${selectedDriver?.driverId}&corporateId=${selectedCorporate}`,
                      )
                      .then((res) => {
                        if (res?.data?.status == '200') {
                          toast.success('Corporate Unassociated successfully');
                          getAllDriver(selectedVendorId);
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
        style={{borderRadius: '4rem'}}
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
              <b>Driver: </b>{' '}
              {selectedDriver?.driver?.firstName +
                ' ' +
                selectedDriver?.driver?.lastName}
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
              sx={{width: '100%', m: 2, maxWidth: '500px'}}
              renderInput={(params) => <TextField {...params} label='Vendor' />}
            />
            <div
              style={{
                margin: 'auto',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Button
                variant='contained'
                onClick={() => {
                  if (selectedVendorList?.length == 1 && selectedVendor) {
                    toast.error(
                      `Atleast one vendor should be associated with the driver`,
                    );
                    return;
                  } else {
                    axios
                      .delete(
                        Api.baseUri +
                          `/user-reg/associateDriver/unAssociateDriverFromVendor?driverId=${selectedDriver?.driverId}&vendorId=${selectedVendor}`,
                      )
                      .then((res) => {
                        if (res?.data?.status == '200') {
                          toast.success('Vendor Unassociated successfully');
                          getAllDriver(selectedVendorId);
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

export default DriverAssociation;
