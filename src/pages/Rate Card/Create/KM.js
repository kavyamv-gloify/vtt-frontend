import {Box, Button, Grid, Typography} from '@mui/material';
import React, {useState, useEffect} from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import '../style.css';
import {styled} from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, {tableCellClasses} from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Api from '@api';
import axios from 'axios';
import {toast} from 'react-toastify';
import {useForm, Controller, useWatch} from 'react-hook-form';
import {PostAdd, Watch} from '@mui/icons-material';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import {useNavigate, useParams} from 'react-router-dom';
import regex from '@regex';
import moment from 'moment';
import _ from 'lodash';
import {number} from 'prop-types';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {el} from 'date-fns/locale';
const fuelTypeList = [
  {title: '--ALL--(4)', value: 'ALL'},
  {title: 'Petrol', value: 'Petrol'},
  {title: 'Diesel', value: 'Diesel'},
  {title: 'CNG', value: 'CNG'},
  {title: 'Electric', value: 'Electric'},
];
const tripType = [
  {title: '--ALL--(2)', value: 'ALL'},
  {title: 'Regular', value: 'Regular'},
  {title: 'Adhoc', value: 'Adhoc'},
];

const StyledTableCell = styled(TableCell)(({theme}) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#f5f7f6',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({theme}) => ({
  '&:nth-of-type(even)': {
    backgroundColor: '#fafbff',
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const Create = () => {
  const [vendorList, setVendorList] = useState();
  const [vehicleType, setVehicleType] = useState();
  const [slab, setSlab] = useState();
  const [myInputFields, setMyInputFields] = useState();
  const [myInputFieldsWithAc, setMyInputFieldsWithAc] = useState();
  const [buttonType, setButtonType] = useState();
  const [inputfield, setInputField] = useState({});
  const navigate = useNavigate();
  const params = useParams();
  const [data, setData] = useState();
  const [selVendor, setselVendor] = useState([]);
  const [selVehicleType, setSelVehicleType] = useState([]);
  const [selFuelType, setSelFuelType] = useState([]);
  const [selTripType, setSelTripType] = useState([]);
  const [subClicked, setsubClicked] = useState(false);
  const [selectedCheck, setSelectedCheck] = useState(0);
  const [acPrice, setAcPrice] = useState();
  const {
    register,
    formState: {errors},
    reset,
    handleSubmit,
    watch,
    control,
    getValues,
    setValue,
  } = useForm({mode: 'onTouched'});
  const formData = useWatch({control, defaultValue: 'default'});
  const {user} = useAuthUser();
  const styles = {
    input: {
      // width: "10rem",
      alignItem: 'center',
      height: '23px',
      borderColor: '#f6f6f6',
      marginTop: '-8px',
      width: '100px',
      fontSize: '14px',
    },
  };

  async function getLists() {
    let res = await axios.get(
      Api.baseUri + '/user-reg/associatevendor/getallassociatecorporateId',
    );
    let tempVendor = [];
    if (res?.data?.status == '200') {
      tempVendor.push({
        value: 'ALL',
        title: `-- ALL (${res?.data?.data?.length}) --`,
      });
      res?.data?.data?.map((el) => {
        tempVendor.push({
          value: el?.vendor?.id,
          title: el?.vendor?.vendorName + '(' + el?.vendor?.vendorCode + ')',
        });
      });
      setVendorList(tempVendor);
    }

    let resp = await axios.get(
      Api.baseUri +
        '/user-reg/vehicletype/vehicletypeBytanentId?page=0&size=1000&vehicleType=null',
    );
    let tempVehicleType = [];
    if (resp?.data?.status == '200') {
      tempVehicleType.push({
        value: 'ALL',
        title: `-- ALL (${resp?.data?.data?.body?.VehicleTypeList?.length}) --`,
      });
      resp?.data?.data?.body?.VehicleTypeList?.map((el) => {
        tempVehicleType.push({
          title:
            el?.vehicleType +
            '-' +
            el?.vehicleOccupancy +
            '(' +
            el?.vehicleTypeName +
            ')',
          name: el?.vehicleType,
          value: el?.id,
        });
      });
      setVehicleType(tempVehicleType);
    }
  }
  useEffect(() => {
    async function getData() {
      await getLists();
      if (params?.id == 'CREATE') return;
      let id = params?.id?.split(':')?.[0];
      axios
        .get(Api.baseUri + '/user-reg/tripRateCard/' + id)
        .then((res) => {
          if (res?.data?.status == '200') {
            setData(res?.data?.data || {});
            setInputField({
              ...inputfield,
              fuelfrom: res?.data?.data?.fuleRangeFrom,
              fuelTo: res?.data?.data?.fuleRangeTo,
              basePrice: res?.data?.data?.basePrice,
              increment: res?.data?.data?.incDecPrice,
            });
            reset(res?.data?.data);
            // setSelectedCheck(data?.incDecType)
          } else {
            setData({});
          }
        })
        .catch((err) => {
          setData({});
        });
    }
    getData();
  }, [params]);

  useEffect(() => {
    if (params?.id == 'CREATE') return;
    if (params?.id !== 'CREATE') {
      setButtonType('PREVIEW');
    }
    let d1 = [];
    if (_.isEmpty(data) || !vehicleType?.length) return;
    vehicleType?.map((el) => {
      if (el.value == data?.vehicleType) d1.push(el);
    });
    let d2 = [];
    vendorList?.map((el) => {
      if (el.value == data?.vendorId) d2.push(el);
    });
    let d3 = [];
    fuelTypeList?.map((el) => {
      if (el.value == data?.fuelType) d3.push(el);
    });
    let d4 = [];
    tripType?.map((el) => {
      if (el.value == data?.tripCategory) d4.push(el);
    });
    setSelVehicleType(d1);
    setselVendor(d2);
    setSelFuelType(d3);
    setSelTripType(d4);
    setSelectedCheck(data?.incDecType);
    // reset({ ...data, });
    let ar = [];
    let ar2 = {};
    let ar3 = {};
    data?.rateCardSlab?.map((el) => {
      ar.push({slab: el.rangeFrom + '-' + el.rangeTo});
      ar2[el.rangeFrom + '-' + el.rangeTo] = el.rate;
      ar3[el.rangeFrom + '-' + el.rangeTo] = el.rateWithAc;
    });
    setMyInputFields(ar2);
    setMyInputFieldsWithAc(ar3);
    setSlab([...ar]);
  }, [data, vehicleType, buttonType]);

  function fuelPriceCalcualtion(fuelStart, fuelTo, incre, basePrice, acPrice) {
    let i = Number(fuelStart);
    let j = Number(fuelTo);
    let temp = [];
    let temp2 = {};
    let temp3 = {};
    let increment = Number(incre);
    let myVal = Number(basePrice);
    let myValWithAc = Number(basePrice) + Number(acPrice);
    while (i < j) {
      let text = i + '-' + (i + 1);
      i++;
      temp.push({slab: text, val: myVal, rateWithAc: myValWithAc});
      temp2[text] = myVal;
      temp3[text] = myValWithAc;
      myVal =
        myVal +
        (selectedCheck == 0
          ? (increment * Number(basePrice)) / 100
          : increment);
      myValWithAc =
        myValWithAc +
        (selectedCheck == 0
          ? (increment * (Number(basePrice) + Number(acPrice))) / 100
          : increment);
      setSlab(temp);
      setMyInputFields(temp2);
      setMyInputFieldsWithAc(temp3);
    }
  }

  useEffect(() => {
    fuelPriceCalcualtion(
      inputfield?.fuelfrom,
      inputfield?.fuelTo,
      inputfield?.increment,
      inputfield?.basePrice,
      formData?.acCost,
    );
  }, [inputfield, selectedCheck, formData?.acCost]);

  function onSubmit(val) {
    if (!selVendor?.length) return;
    if (!selVehicleType?.length) return;
    if (!selTripType?.length) return;
    if (!selFuelType?.length) return;
    let postData = [];
    let temArr = [];
    Object.entries(myInputFields).map(([key, value], i) => {
      temArr.push({
        rangeFrom: key?.split('-')[0],
        rangeTo: key?.split('-')[1],
        rate: value,
        rateWithAc: myInputFieldsWithAc[key],
      });
    });
    let acStatus;
    let escortStatus;
    let id;

    if (val?.acCost > 0) {
      acStatus = 'YES';
    }
    if (val?.escortCost > 0) {
      escortStatus = 'YES';
    }
    if (params?.id == 'CREATE') {
      id = null;
    }
    if (params?.id?.split(':')?.[1] == 'EDIT') {
      id = data?.id;
    }
    if (params?.id?.split(':')?.[1] == 'COPY') {
      id = null;
    }
    selVendor?.map((vendor) => {
      selVehicleType?.map((vehicle) => {
        selFuelType?.map((fuel) => {
          selTripType?.map((tripType) => {
            postData.push({
              rateCardType: 'KM',
              tripCategory: tripType?.value,
              fuelType: fuel?.value,
              vehicleTypeName: vehicle?.name,
              vehicleType: vehicle?.value,
              vendorId: vendor?.value,
              vendorName: vendor?.title,
              acCost: val?.acCost,
              fuleRangeFrom: val?.fuleRangeFrom,
              fuleRangeTo: val?.fuleRangeTo,
              basePrice: val?.basePrice,
              incDecPrice: val?.incDecPrice,
              applicableFrom: val?.applicableFrom,
              applicableTo: val?.applicableTo,
              status: 'ACTIVE',
              corporateId: user?.userList?.corporateId,
              rateCardSlab: temArr,
              acStatus: acStatus,
              escortStatus: escortStatus,
              escortCost: val?.escortCost,
              id: id,
              incDecType: selectedCheck,
            });
          });
        });
      });
    });

    params?.id == 'CREATE'
      ? axios
          .post(Api.baseUri + '/user-reg/tripRateCard/save', postData)
          .then((res) => {
            if (res?.data?.status == '200') {
              toast.success(
                'Rate Card Saved Successfully' ?? res?.data?.message,
              );
              navigate('/rate-card-list');
            } else {
              toast.error(res?.data?.message || 'Something went wrong.');
            }
          })
          .catch((err) => {
            toast.error('Something went wrong.');
          })
      : axios
          .put(
            Api.baseUri + '/user-reg/tripRateCard/updatetripcard',
            postData[0],
          )
          .then((res) => {
            if (res?.data?.status == '200') {
              toast.success(
                'TripCard Updated Successfully' ?? res?.data?.message,
              );
              localStorage.setItem('Tab_value', 1);
              navigate('/rate-card-list');
            } else {
              toast.error(res?.data?.message || 'Something went wrong.');
            }
          })
          .catch((err) => {
            toast.error('Something went wrong.');
          });
  }
  const customVendor = [{title: user?.userList?.userName, value: user?.userList?.profileId }];
  return (
    <div className='my-chip'>
      <div className='rate-headings'>
        <h4 style={{fontWeight: 600, padding: '30px 10px 5px 15px'}}>
          Create Rate Card
        </h4>
        <Grid container spacing={1} sx={{padding: '25px'}}>
          <Grid item xs={12} sm={6} md={6} className='left-grid-create-box'>
            <div>
              {(params?.id == 'CREATE' || data) && (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={6}>
                    <Grid item xs={6} sm={6} md={6}>
                      <h5>
                        Contract Date (From - To){' '}
                        <span style={{color: 'red'}}>*</span>
                      </h5>
                      <Grid container spacing={2}>
                        <Grid item xs={6} sm={6} md={6}>
                          <TextField
                            {...register('applicableFrom', {
                              required: 'This is a  mandatory field',
                            })}
                            type='date'
                            inputProps={{
                              min: moment().format('YYYY-MM-DD'),
                            }}
                            // error
                            id='outlined-error-helper-text'
                            // label="Error"
                            size='small'
                            fullWidth
                          />
                          <p style={{fontSize: '12px', color: 'red'}}>
                            {errors?.applicableFrom?.message}
                          </p>
                        </Grid>
                        <Grid item xs={6} sm={6} md={6}>
                          <TextField
                            {...register('applicableTo', {
                              required: 'This is a  mandatory field',
                              validate: {
                                lessThan: (v) =>
                                  new Date(v) >
                                  new Date(watch('applicableFrom')),
                              },
                            })}
                            type='date'
                            inputProps={{
                              min: moment().format('YYYY-MM-DD'),
                            }}
                            // error
                            id='outlined-error-helper-text'
                            // label="Error"
                            size='small'
                            fullWidth
                          />
                          <p style={{fontSize: '12px', color: 'red'}}>
                            {errors?.applicableTo?.message ||
                              (errors?.applicableTo?.type === 'lessThan' && (
                                <p style={{fontSize: '12px', color: 'red'}}>
                                  End date should be greater than start date
                                </p>
                              ))}
                          </p>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6}>
                      <h5>
                        Vendor <span style={{color: 'red'}}>*</span>
                      </h5>
                      <Autocomplete
                        multiple
                        name='vendorId'
                        // value={selVendor}
                        disabled= {user?.userList?.userRole === "VENDOR"? true : false}
                        value={user?.userList?.userRole === "VENDOR"? customVendor : selVendor}
                        error={subClicked && !selVendor?.length}
                        options={vendorList ?? []}
                        getOptionLabel={(option) => option.title}
                        defaultValue={data?.vendorId}
                        limitTags={1}
                        disablePortal
                        onChange={(e, data) => {
                          let all = [];
                          let is_all = false;
                          if (data?.length) {
                            data?.map((el) => {
                              if (el.value == 'ALL') is_all = true;
                            });
                            vendorList?.map((el) => {
                              if (el.value != 'ALL') all.push(el);
                            });
                          }
                          setselVendor(is_all ? all : data);
                        }}
                        size='small'
                        id='combo-box-demo'
                        sx={{width: '100%'}}
                        renderInput={(params) => {
                          return (
                            <TextField
                              {...params}
                              id='outlined-error-helper-text'
                            />
                          );
                        }}
                      />
                      <p style={{fontSize: '12px', color: 'red'}}>
                        {subClicked && !selVendor?.length
                          ? 'Please select vendor.'
                          : ''}
                      </p>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6}>
                      <h5>
                        Vehicle Type <span style={{color: 'red'}}>*</span>
                      </h5>
                      <Autocomplete
                        multiple
                        value={selVehicleType}
                        error={subClicked && !selVehicleType?.length}
                        limitTags={1}
                        options={vehicleType ?? []}
                        getOptionLabel={(option) => option.title}
                        onChange={(e, data) => {
                          let all = [];
                          let is_all = false;
                          if (data?.length) {
                            data?.map((el) => {
                              if (el.value == 'ALL') is_all = true;
                            });
                            vehicleType?.map((el) => {
                              if (el.value != 'ALL') all.push(el);
                            });
                          }
                          setSelVehicleType(is_all ? all : data);
                        }}
                        disablePortal
                        size='small'
                        id='combo-box-demo'
                        sx={{width: '100%'}}
                        renderInput={(params) => {
                          return (
                            <TextField
                              {...params}
                              id='outlined-error-helper-text'
                            />
                          );
                        }}
                      />
                      <p style={{fontSize: '12px', color: 'red'}}>
                        {subClicked && !selVehicleType?.length
                          ? 'Please select vehicle Type.'
                          : ''}
                      </p>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6}>
                      <h5>
                        Fuel Type <span style={{color: 'red'}}>*</span>
                      </h5>
                      <Autocomplete
                        multiple
                        value={selFuelType}
                        error={subClicked && !selFuelType?.length}
                        limitTags={1}
                        options={fuelTypeList}
                        getOptionLabel={(option) => option.title}
                        disablePortal
                        size='small'
                        onChange={(e, data) => {
                          let all = [];
                          let is_all = false;
                          if (data?.length) {
                            data?.map((el) => {
                              if (el.value == 'ALL') is_all = true;
                            });
                            fuelTypeList?.map((el) => {
                              if (el.value != 'ALL') all.push(el);
                            });
                          }
                          setSelFuelType(is_all ? all : data);
                        }}
                        id='combo-box-demo'
                        sx={{width: '100%'}}
                        renderInput={(params) => {
                          return (
                            <TextField
                              {...params}
                              id='outlined-error-helper-text'
                            />
                          );
                        }}
                      />
                      <p style={{fontSize: '12px', color: 'red'}}>
                        {subClicked && !selFuelType?.length
                          ? 'Please select Fuel Type.'
                          : ''}
                      </p>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6}>
                      <h5>
                        Trip Type <span style={{color: 'red'}}>*</span>
                      </h5>
                      <Autocomplete
                        multiple
                        options={tripType}
                        value={selTripType}
                        limitTags={1}
                        getOptionLabel={(option) => option.title}
                        disablePortal
                        size='small'
                        onChange={(e, data) => {
                          let all = [];
                          let is_all = false;
                          if (data?.length) {
                            data?.map((el) => {
                              if (el.value == 'ALL') is_all = true;
                            });
                            tripType?.map((el) => {
                              if (el.value != 'ALL') all.push(el);
                            });
                          }

                          setSelTripType(is_all ? all : data);
                        }}
                        id='combo-box-demo'
                        sx={{width: '100%'}}
                        renderInput={(params) => {
                          return (
                            <TextField
                              {...params}
                              id='outlined-error-helper-text'
                            />
                          );
                        }}
                      />
                      <p style={{fontSize: '12px', color: 'red'}}>
                        {subClicked && !selTripType?.length
                          ? 'Please select Trip Type.'
                          : ''}
                      </p>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6}>
                      <h5>
                        Base Price (Per KM without Ac)
                        <span style={{color: 'red'}}>*</span>
                      </h5>
                      <TextField
                        // error
                        {...register('basePrice', {
                          required: 'This is a  mandatory field',
                          pattern: {
                            value: regex.numReg,
                            message: 'Please enter valid price.',
                          },
                        })}
                        onChange={(e, v) => {
                          setInputField({
                            ...inputfield,
                            basePrice: e?.target?.value,
                          });
                        }}
                        id='outlined-error-helper-text'
                        // label="Error"
                        size='small'
                        type='number'
                        fullWidth
                      />
                      <p style={{fontSize: '12px', color: 'red'}}>
                        {errors?.basePrice?.message}
                      </p>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6}>
                      <h5>
                        AC Cost <span style={{color: 'red'}}>*</span>
                      </h5>
                      <TextField
                        {...register('acCost', {
                          required: 'This is a  mandatory field',
                          pattern: {
                            value: regex.numReg,
                            message: 'Please enter valid cost',
                          },
                          onChange: (e) => {
                            setAcPrice(e.target.value);
                          },
                        })}
                        // error
                        id='outlined-error-helper-text'
                        // label="Error"

                        size='small'
                        type='number'
                        fullWidth
                      />
                      <p style={{fontSize: '12px', color: 'red'}}>
                        {errors?.acCost?.message}
                      </p>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6}>
                      <h5>
                        Escort Cost <span style={{color: 'red'}}>*</span>
                      </h5>
                      <TextField
                        {...register('escortCost', {
                          required: 'This is a  mandatory field',
                          pattern: {
                            value: regex.numReg,
                            message: 'Please enter valid cost',
                          },
                        })}
                        // error
                        id='outlined-error-helper-text'
                        // label="Error"
                        size='small'
                        fullWidth
                        type='number'
                      />
                      <p style={{fontSize: '12px', color: 'red'}}>
                        {errors?.escortCost?.message}
                      </p>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6}>
                      <h5>
                        Fuel Matrix (From and To){' '}
                        <span style={{color: 'red'}}>*</span>
                      </h5>
                      <Grid container spacing={2}>
                        <Grid item xs={6} sm={6} md={6}>
                          <TextField
                            {...register('fuleRangeFrom', {
                              required: 'This is a  mandatory field',
                              type: number,
                              pattern: {
                                value: /^[0-9]{0,4}$/i,
                                message: 'Please enter valid range',
                              },
                            })}
                            onChange={(e, v) => {
                              setInputField({
                                ...inputfield,
                                fuelfrom:
                                  e?.target?.value || data?.fuleRangeFrom,
                              });
                            }}
                            id='outlined-error-helper-text'
                            size='small'
                            fullWidth
                          />
                          <p style={{fontSize: '12px', color: 'red'}}>
                            {errors?.fuleRangeFrom?.message}
                          </p>
                        </Grid>
                        <Grid item xs={6} sm={6} md={6}>
                          <TextField
                            {...register('fuleRangeTo', {
                              required: 'This is a  mandatory field',
                              pattern: {
                                value: /^[0-9]{0,4}$/i,
                                message: 'Please enter valid range',
                              },
                              validate: {
                                lessThan: (v) =>
                                  Number(v) > Number(watch('fuleRangeFrom')),
                              },
                            })}
                            onChange={(e, v) => {
                              setInputField({
                                ...inputfield,
                                fuelTo: e?.target?.value,
                              });
                            }}
                            // error
                            id='outlined-error-helper-text'
                            // label="Error"
                            size='small'
                            fullWidth
                          />
                          <p style={{fontSize: '12px', color: 'red'}}>
                            {errors?.fuleRangeTo?.message}
                          </p>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6}>
                      <h5>
                        Increment/Decrement (Per 1Rs){' '}
                        <span style={{color: 'red'}}>*</span>
                      </h5>
                      <div>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={selectedCheck == 0}
                                onClick={(e) => {
                                  setSelectedCheck(0);
                                }}
                              />
                            }
                            label='Change in Base Price By %'
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={selectedCheck == 1}
                                onClick={(e) => {
                                  setSelectedCheck(1);
                                }}
                              />
                            }
                            label='Change in Base Price By ₹'
                          />
                        </FormGroup>
                        <TextField
                          sx={{mt: 0, width: '200px'}}
                          // error
                          {...register('incDecPrice', {
                            required: 'This is a  mandatory field',
                            pattern: {
                              value: /^[0-9]{0,4}$/i,
                              message: 'Please enter valid price',
                            },
                          })}
                          id='outlined-error-helper-text'
                          onChange={(e, v) => {
                            setInputField({
                              ...inputfield,
                              increment: e?.target?.value,
                            });
                          }}
                          size='small'
                          fullWidth
                        />
                      </div>
                      <p style={{fontSize: '12px', color: 'red'}}>
                        {errors?.incDecPrice?.message}
                      </p>
                    </Grid>
                  </Grid>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      marginTop: '25px',
                    }}
                  >
                    <Button
                      id='btnMui123'
                      variant='contained'
                      sx={{background: '#636363', width: '100px', mr: 2}}
                      onClick={() => {
                        setButtonType('PREVIEW');
                      }}
                    >
                      Preview
                    </Button>
                    <Button
                      id='btnMui123'
                      type='submit'
                      onClick={() => {
                        setsubClicked(true);
                      }}
                      variant='contained'
                      sx={{background: '#0b6284', width: '100px'}}
                      disabled={buttonType == 'PREVIEW' ? false : true}
                    >
                      {params?.id == 'CREATE' ? 'Submit' : 'Update'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={6} style={{paddingLeft: '45px'}}>
            {(buttonType == 'PREVIEW' || data?.id) && (
              <>
                <div
                  style={{display: 'flex', fontSize: '18px', fontWeight: 600}}
                >
                  <span
                    style={{
                      borderBottom: '4px solid orange',
                      paddingBottom: '2px',
                    }}
                  >
                    Fuel
                  </span>
                  <span>&nbsp;Matrix</span>
                </div>
                <TableContainer
                  sx={{maxHeight: 440}}
                  className='right-container-rate-card'
                  component={Paper}
                >
                  <Table
                    stickyHeader
                    sx={{maxHeight: 100}}
                    aria-label='customized table'
                  >
                    <TableHead>
                      <TableRow>
                        <StyledTableCell
                          style={{fontSize: '16px', fontWeight: 500}}
                        >
                          Fuel Slab
                        </StyledTableCell>
                        <StyledTableCell
                          style={{fontSize: '16px', fontWeight: 500}}
                        >
                          Rate
                        </StyledTableCell>
                        <StyledTableCell
                          style={{fontSize: '16px', fontWeight: 500}}
                        >
                          Rate with AC
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {slab?.map((row, ind) => (
                        <StyledTableRow key={'table-' + ind}>
                          <StyledTableCell component='th' scope='row'>
                            {row.slab}
                          </StyledTableCell>
                          <StyledTableCell>
                            <TextField
                              size='small'
                              style={styles.input}
                              type='number'
                              value={parseFloat(
                                myInputFields[row.slab],
                              ).toFixed(2)}
                              onInput={(e) => {
                                setMyInputFields({
                                  ...myInputFields,
                                  [row.slab]: Number(e.target.value),
                                });
                              }}
                            />
                          </StyledTableCell>
                          <StyledTableCell component='th' scope='row'>
                            <TextField
                              size='small'
                              style={styles.input}
                              type='number'
                              value={parseFloat(
                                myInputFieldsWithAc[row.slab],
                              ).toFixed(2)}
                              onInput={(e) => {
                                setMyInputFieldsWithAc({
                                  ...myInputFieldsWithAc,
                                  [row.slab]: Number(e.target.value),
                                });
                              }}
                            />
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Create;
