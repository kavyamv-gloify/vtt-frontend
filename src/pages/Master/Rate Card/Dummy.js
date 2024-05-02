import React, {useState} from 'react';
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

const Dummy = () => {
  const navigate = useNavigate();
  const [showbtn, setshowbtn] = React.useState(true);
  const [open, setOpen] = useState();
  const [boolean, setBoolean] = useState(false);
  const [snackbarMsg, setsnackBarMsg] = useState();
  const [openSlab, setOpenSlab] = useState();
  const [slab, setSlab] = useState();
  const [myInputFields, setMyInputFields] = useState();
  const [myUpperData, setMyUpperData] = useState();
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
      temp2[text] = Math.round(myVal);
      myVal = myVal + (percentage * myVal) / 100;

      setSlab(temp);
      setMyInputFields(temp2);
      setshowbtn(true);
    }
  };

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
            options: [{title: 'hu', value: 'hu'}],

            validationProps: {
              required: 'This is a mandatory field',
            },
          },

          {
            type: 'autocomplete',
            name: 'vehicleType',
            id: 'vehicleType',
            title: 'Vehicle',
            options: [{title: 'hu', value: 'hu'}],

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
            options: [{title: 'hu', value: 'hu'}],

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
            options: [{title: 'hu', value: 'hu'}],

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
            name: 'distancefrom',
            id: 'distancefrom',
            title: 'Distance Range From',
            infoMessage: [
              'Only alphabets are allowed.',
              'Maximum length should be 50 characters.',
              'Ex-XYZ.',
            ],
            // pattern: {
            //     value: regex.char50,
            //     message: 'Please enter valid Last name with max 50 characters'
            // },
          },
          {
            type: 'text',
            name: 'distanceto',
            id: 'distanceto',
            title: 'Distance Range to',
            infoMessage: [
              'Only alphabets are allowed.',
              'Maximum length should be 50 characters.',
              'Ex-XYZ.',
            ],
            // pattern: {
            //     value: regex.char50,
            //     message: 'Please enter valid Last name with max 50 characters'
            // },
          },
          {
            type: 'text',
            name: 'fuelfrom',
            id: 'fuelfrom',
            title: 'Fuel Range From',
            infoMessage: [
              'Only alphabets are allowed.',
              'Maximum length should be 50 characters.',
              'Ex-XYZ.',
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
            infoMessage: [
              'Only alphabets are allowed.',
              'Maximum length should be 50 characters.',
              'Ex-XYZ.',
            ],
            // pattern: {
            //     value: regex.char50,
            //     message: 'Please enter valid Last name with max 50 characters'
            // },
          },
          {
            type: 'text',
            name: 'pricestart',
            id: 'pricestart',
            title: 'Price Start',
            infoMessage: [
              'Only alphabets are allowed.',
              'Maximum length should be 50 characters.',
              'Ex-XYZ.',
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
            title: 'Increment',
            infoMessage: [
              'Only alphabets are allowed.',
              'Maximum length should be 50 characters.',
              'Ex-XYZ.',
            ],
            // pattern: {
            //     value: regex.char50,
            //     message: 'Please enter valid Last name with max 50 characters'
            // },
          },
        ],
      },
      {
        type: 'section',
        layout: {column: 4, spacing: 2, size: 'medium', label: 'fixed'},
        fields: [],
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
      cardType: 'PER TRIP ',
      key: '',
      // "corporateId": corporateId,
      RateCard: temArr,
      vendorId: myUpperData?.data?.vendorId,
    };

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
                            [row.slab]: Math.round(Number(e.target.value)),
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

export default Dummy;
