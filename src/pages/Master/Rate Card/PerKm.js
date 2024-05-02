import React, {useState, useEffect} from 'react';
// import { useNavigate } from 'react-router-dom';
import SmartForm from '@smart-form';
import {useAuthUser} from '@crema/utility/AuthHooks';
import regex from '@regex';
import axios from 'axios';
import api from '@api';
import SnackbarCustom from 'pages/thirdParty/SnackBar/SnackBarMsg';
import {SettingsPowerRounded} from '@mui/icons-material';
import AppLoader from '@crema/core/AppLoader';
import {toast} from 'react-toastify';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import {useNavigate} from 'react-router-dom';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import {Button, InputLabel} from '@mui/material';

const PerKm = () => {
  const navigate = useNavigate();
  const [showbtn, setshowbtn] = React.useState(true);
  const [open, setOpen] = useState();
  const [boolean, setBoolean] = useState(false);
  const [snackbarMsg, setsnackBarMsg] = useState();
  const [openSlab, setOpenSlab] = useState();
  const [slab, setSlab] = useState();
  const [myInputFields, setMyInputFields] = useState();
  const [myUpperData, setMyUpperData] = useState();
  const [vehicleList, setVehicleList] = useState([]);
  const [vehicle, setVehicle] = useState();
  const [vendor, setVendor] = useState();
  const [vendorList, setVendorList] = useState();
  // const [showbtn, setshowbtn] = useState(true);
  const styles = {
    ml: {
      marginLeft: '1rem',
    },
    textwidth: {
      width: '8rem',
    },
    h1: {
      color: 'black',
      // marginBottom: "0.5rem"
    },
    button: {
      width: '1rem',
      height: '2.5rem',
      marginTop: '1.5rem',
      marginLeft: '1rem',
    },
    p: {
      color: 'red',
      fontSize: '13px',
      marginTop: '0.5rem',
    },
    input: {
      width: '10rem',
      alignItem: 'center',
      borderRadius: '20rem',
      height: '1.5rem',
      padding: '0.5rem',
      borderColor: '#e9e9f0',
      fontSize: '14px',
    },
  };

  const showAllSlabData = (data) => {
    let i = Number(data?.data?.fuelfrom);
    let j = Number(data?.data?.fuelto);
    let temp = [];
    let temp2 = {};
    let percentage = Number(data?.data?.increment);
    let myVal = Number(data?.data?.pricestart);

    while (i < j) {
      let text = i + '-' + (i + 1);
      i++;
      temp.push({slab: text, val: myVal});
      temp2[text] = myVal;
      myVal = myVal + (percentage * myVal) / 100;

      setSlab(temp);
      setMyInputFields(temp2);
      setshowbtn(true);
    }
  };

  useEffect(() => {
    async function vehicelTypeList() {
      const baseURL = `${api.masterVehicletype.listbytanent}?page=0&size=1000&vehicleType=null`;
      axios
        .get(`${baseURL}`)
        .then((response) => {
          let temp = [];
          response?.data?.data?.body['VehicleTypeList']?.map((id) => {
            temp.push({
              title: id?.vehicleType + '-' + id?.vehicleOccupancy,
              value: id?.id,
            });
            setVehicleList(temp ?? []);
          });
        })
        .catch((err) => {
          setVehicleList([]);
        });
    }
    vehicelTypeList();
  }, []);

  useEffect(() => {
    async function getvendorlist() {
      const baseURL = `${api.vendor.list}/corporateId?page=0&size=1000&companyPAN=null&emailId=null&mobileNo=null`;
      let response = await axios.get(`${baseURL}`);
      //
      let temp = [];
      response?.data?.data?.body['Corporate List']?.map((e) => {
        //
        temp.push({
          title:
            e.vendorName +
            ' (' +
            'vendor code ' +
            '-' +
            ' ' +
            e.vendorCode +
            ')',
          name: e.vendorName,
          code: e.vendorCode,
          value: e.id,
        });

        setVendorList(temp);
      });
    }
    getvendorlist();
  }, []);

  let template = {
    layout: {
      column: 1,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },

    description: 'Form for applying Job',
    sections: [
      {
        layout: {column: 4, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'autocomplete',
            name: 'vendorId',
            id: 'vendorId',
            title: 'Vendor',
            infoMessage: ['Dropdown values are selectable', 'Ex: XYZ'],
            options: vendorList ?? [],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },

          {
            type: 'autocomplete',
            name: 'vehicleType',
            id: 'vehicleType',
            title: 'Vehicle Type',
            infoMessage: ['Dropdown values are selectable', 'Ex: TATA'],
            options: vehicleList ?? [],
            pattern: {
              value: regex.maxSize50,
              message:
                'Please enter  valid code with alpha-numeric and below 50 characters',
            },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'autocomplete',
            name: 'fuelType',
            id: 'fuelType',
            title: 'Fuel',
            infoMessage: ['Dropdown values are selectable', 'Ex: Petrol'],
            options: [
              {title: 'Petrol', value: 'Petrol'},
              {title: 'Diesel', value: 'Diesel'},
              {title: 'CNG', value: 'CNG'},
              {title: 'Electric', value: 'Electric'},
            ],

            pattern: {
              value: regex.maxSize50,
              message:
                'Please enter  valid code with alpha-numeric and below 50 characters',
            },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'autocomplete',
            name: 'acStatus',
            id: 'acStatus',
            title: 'AC',
            infoMessage: ['Dropdown values are selectable', 'Ex: Yes'],
            options: [
              {title: 'Yes', value: 'Yes'},
              {title: 'No', value: 'No'},
            ],

            pattern: {
              value: regex.maxSize50,
              message:
                'Please enter  valid code with alpha-numeric and below 50 characters',
            },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
        ],
      },

      {
        layout: {column: 6, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'text',
            name: 'fuelfrom',
            id: 'fuelfrom',
            title: 'Fuel Range From',
            isNumber: true,
            maxChar: 4,
            infoMessage: [
              'Only Numbers are allowed.',
              'Maximum length should be 4 characters.',
              'Ex-50.',
            ],
            // pattern: {
            //     value: regex.char50,
            //     message: 'Please enter valid Last name with max 50 characters'
            // },
          },
          {
            type: 'text',
            name: 'fuelto',
            id: 'fuelto',
            title: 'Fuel Range to',
            isNumber: true,
            maxChar: 4,
            infoMessage: [
              'Only Numbers are allowed.',
              'Maximum length should be 4 characters.',
              'Ex-100.',
            ],
            validationProps: {
              manual: [
                {
                  condition: `fuelto >= fuelfrom`,
                  message: 'Distance from should not be less. ',
                },
              ],
            },
          },
          {
            type: 'text',
            name: 'pricestart',
            id: 'pricestart',
            title: 'Price Start',
            isNumber: true,
            maxChar: 4,
            infoMessage: [
              'Only Numbers are allowed.',
              'Maximum length should be 4 characters.',
              'Ex-45.',
            ],
            // pattern: {
            //     value: regex.char50,
            //     message: 'Please enter valid Last name with max 50 characters'
            // },
          },
          {
            type: 'text',
            name: 'increment',
            id: 'increment',
            title: 'Increment per 1rs',
            isNumber: true,
            maxChar: 4,
            infoMessage: [
              'Only Numbers are allowed.',
              'Maximum length should be 4 characters.',
              'Ex-4',
            ],
            // pattern: {
            //     value: regex.char50,
            //     message: 'Please enter valid Last name with max 50 characters'
            // },
          },
        ],
      },
    ],
  };

  const handleSubmit = async (values) => {
    setshowbtn(false);

    setshowbtn(false);
    setOpenSlab(true);
    showAllSlabData(values);
    setMyUpperData(values);
  };

  const onFinalSubmit = () => {
    let temArr = [];
    Object.entries(myInputFields).map(([key, value], i) => {
      temArr.push({
        minRange: key?.split('-')[0],
        maxRange: key?.split('-')[1],
        rate: value,
      });
    });
    let postData = {
      fuelType: myUpperData?.data?.fuelType,
      vehicleType: myUpperData?.data?.vehicleType,
      acStatus: myUpperData?.data?.acStatus,
      cardType: 'PER KM',
      key: '',
      // "corporateId": corporateId,
      RateCard: temArr,
      vendorId: myUpperData?.data?.vendorId,
    };
    vehicleList?.map((e) => {
      if (e?.value == myUpperData?.data?.vehicleType) {
        myUpperData.data.vehicleTypeName = e?.name;

        postData.vehicleTypeName = myUpperData.data.vehicleTypeName;
      }
    });

    axios
      .post(api.ratecard.saveRatecard, postData)
      .then((response) => {
        if (response?.data?.status == '200') {
          toast.success(response?.data?.message ?? 'Created successfully');
          navigate('/master/rate-card/table');
        } else {
          toast.error(response?.data?.message ?? 'Something went wrong');
        }
        setshowbtn(true);
      })
      .catch((er) => {
        setshowbtn(true);
        toast.error('Something went wrong');
      });
  };
  return (
    <>
      {!showbtn ? <AppLoader /> : null}
      <SmartForm
        template={template}
        onSubmit={handleSubmit}
        buttons={['submit']}
      />

      {openSlab && (
        <div>
          <TableContainer
            style={{
              width: '40%',
              marginTop: '2rem',
              border: '1px solid black',
              boxShadow: 'initial',
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{borderRight: '1px solid grey'}}>
                    Fuel Slab
                  </TableCell>
                  <TableCell align='right'>Rate</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {}
                {slab?.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell
                      style={{borderRight: '1px solid grey'}}
                      component='th'
                      scope='row'
                    >
                      {row.slab}
                    </TableCell>
                    <TableCell align='right'>
                      <input
                        style={styles.input}
                        type='number'
                        value={myInputFields[row.slab]}
                        onInput={(e) => {
                          setMyInputFields({
                            ...myInputFields,
                            [row.slab]: Number(e.target.value),
                          });
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button
            id='btnMui123'
            sx={{mt: 4}}
            variant='contained'
            onClick={onFinalSubmit}
          >
            Submit
          </Button>
        </div>
      )}
    </>
  );
};

export default PerKm;
