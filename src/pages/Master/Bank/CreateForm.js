import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import SmartForm from '@smart-form';
import {useAuthUser} from '@crema/utility/AuthHooks';
import regex from '@regex';
import axios from 'axios';
import Steppers from '@smart-form/stepper';
import api from '@api';
import SnackbarCustom from 'pages/thirdParty/SnackBar/SnackBarMsg';
import {SettingsPowerRounded} from '@mui/icons-material';
import AppLoader from '@crema/core/AppLoader';
import {toast} from 'react-toastify';

const CreateForm = () => {
  const navigate = useNavigate();
  const [showbtn, setshowbtn] = React.useState(true);
  const [open, setOpen] = useState();
  const [boolean, setBoolean] = useState(false);
  const [snackbarMsg, setsnackBarMsg] = useState();
  // const [showbtn, setshowbtn] = useState(true);
  let stepperTemplate = {
    title: 'Register Vendor Details',
    layout: {
      type: 'horizontal',
      position: 'center',
      labelPos: 'top',
      maxWidth: '80%',
      margin: '10px 20px',
    },
    steps: [
      {
        layout: {},
        title: 'Vendor Details',
        buttons: ['next'],
        buttonStyle: {
          type: 'square',
          text: true,
          icon: '',
          size: '',
          bgColor: '',
          textColor: '',
          fontSize: '',
        },
        form: {
          layout: {
            column: 2,
            spacing: 2,
            size: 'medium',
            label: 'fixed',
            type: 'grid',
          },
          sections: [
            {
              layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
              id: 'personal_information',
              fields: [
                
                {
                  type: 'text',
                  name: 'vendorName',
                  id: 'vendorName',
                  title: 'Vendor Name',
                  disabled: false,
                  infoMessage: [
                    'Only alphabets are allowed.',
                    'Maximum length should be 50 characters.',
                    'Field is mandatory.',
                  ],
                  pattern: {
                    value: regex.char50,
                    message:
                      'Please enter valid Vendor name with max 50 characters',
                  },
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },
                {
                  type: 'text',
                  name: 'vendorCode',
                  id: 'vendorCode',
                  title: 'Vendor Code',
                  infoMessage: [
                    'Alphanumerics characters are allowed.',
                    'Maximum length should be 30 characters.',
                    'EX-GDH4',
                  ],
                  disabled: false,
                  pattern: {
                    value: regex.maxSize30,
                    message:
                      'Please enter valid Vendor code with max 30 characters',
                  },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },
                
              ],
            },
          ],
        },
      },
      {
        layout: {},
        title: 'Contact Person Details',
        buttons: ['next'],
        buttonStyle: {
          type: 'square',
          text: true,
          icon: '',
          size: '',
          bgColor: '',
          textColor: '',
          fontSize: '',
        },
        form: {
          layout: {
            column: 2,
            spacing: 2,
            size: 'medium',
            label: 'fixed',
            type: 'grid',
          },
          sections: [
            {
              layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
              fields: [
                {
                  type: 'text',
                  name: 'contactPersonFirstName',
                  id: 'contactPersonFirstName',
                  title: 'First Name',
                  infoMessage: [
                    'Only alphabets are allowed.',
                    'Maximum length should be 50 characters.',
                    'Ex-XYZ.',
                  ],
                  pattern: {
                    value: regex.char50,
                    message:
                      'Please enter valid First Name with max 50 characters',
                  },
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },
                {
                  type: 'text',
                  name: 'contactPersonLastName',
                  id: 'contactPersonLastName',
                  title: 'Last Name',
                  infoMessage: [
                    'Only alphabets are allowed.',
                    'Maximum length should be 50 characters.',
                    'Ex-Sharma',
                  ],
                  disabled: false,
                  pattern: {
                    value: regex.char50,
                    message:
                      'Please enter valid Last Name with max 50 characters',
                  },
                  validationProps: {
                    // required: 'This is a mandatory field'
                  },
                },
                
              ],
            },
          ],
        },
      },
      {
        layout: {},
        title: 'Bank Details',
        buttons: ['submit'],
        buttonStyle: {
          type: 'square',
          text: true,
          icon: '',
          size: '',
          bgColor: '',
          textColor: '',
          fontSize: '',
        },
        form: {
          layout: {
            column: 2,
            spacing: 2,
            size: 'medium',
            label: 'fixed',
            type: 'grid',
          },
          sections: [
            {
              layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
              fields: [
                
              ],
            },
          ],
        },
      },
    ],
  };


  const handleSubmit = async (values) => {
    setshowbtn(false);

    setshowbtn(false);
    if (values.button.toUpperCase() === 'SUBMIT') {
      let dataSet = {};
      dataSet = values.data;
      axios
        .post(api.masterBank.createform, dataSet)
        .then((response) => {
          if (response?.data?.status == '200') {
            navigate('/Master/bank/table');
            toast.success(response?.data?.message ?? 'Created successfully');
          } else {
            toast.error(response?.data?.message ?? 'Something went wrong');
          }
          setshowbtn(true);
        })
        .catch((er) => {
          setshowbtn(true);
          toast.error('Something went wrong');
        });
    }
  };
  return (
    <>
      {!showbtn ? <AppLoader /> : null}
      {vendorList && (
        <Steppers
          // defaultValues={{
          //   vendorId: user?.role == 'VENDOR' ? user?.userList?.profileId : null,
          // }}
          template={stepperTemplate}
          // watchFields={['firstname', 'include_portfolio', 'email', 'country']}
          showbtn={showbtn}
          mode='onTouched'
          // getOnInput={seatdata}
          // validate={validate}
          icons={{
            1: <CommuteIcon />,
            2: <PersonIcon />,
            3: <EnhancedEncryptionIcon />,
            4: <TextSnippetIcon />,
          }}
          afterSubmit={handleSubmit}
          // buttons={['submit']}
        />
      )}
      {/* <SnackbarCustom BooleanValue={boolean} open={open} onChange={handleChange}>{snackbarMsg}</SnackbarCustom> */}
    </>
  );
};

export default CreateForm;
