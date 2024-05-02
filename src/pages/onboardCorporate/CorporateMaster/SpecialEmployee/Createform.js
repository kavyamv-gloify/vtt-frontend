import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import SmartForm from '@smart-form';
import {useAuthUser} from '@crema/utility/AuthHooks';
import regex from '@regex';
import axios from 'axios';
import api from '@api';
import SnackbarCustom from 'pages/thirdParty/SnackBar/SnackBarMsg';
import {SettingsPowerRounded} from '@mui/icons-material';
import AppLoader from '@crema/core/AppLoader';
import {toast} from 'react-toastify';
const CreateForm = ({close}) => {
  const navigate = useNavigate();
  const [showbtn, setshowbtn] = React.useState(true);
  const [open, setOpen] = useState();
  const [boolean, setBoolean] = useState(false);
  const [snackbarMsg, setsnackBarMsg] = useState();
  // const [showbtn, setshowbtn] = useState(true);
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
            name: 'categoryName',
            id: 'categoryName',
            title: 'Category Name',
            infoMessage: [
              'Alphates are allowed',
              'Maximum length should be 50 characters',
              'e.g.: Blind',
            ],
            validationProps: {
              required: 'This is a mandatory field',
            },
            pattern: {
              value: regex.char50,
              message: 'Please enter category name less than 50 character ',
            },
          },

          // {
          //   type: 'text',
          //   name: 'size',
          //   id: 'size',
          //   title: 'Strength',
          //   isNumber: true,
          //   maxChar: 3,
          //   infoMessage: [
          //     'Numeric characters are allowed',
          //     'Maximum length should be 3 characters',
          //     'e.g.: 7',
          //   ],

          //   validationProps: {
          //     required: 'This is a mandatory field',
          //   },
          // },

          {
            type: 'radio',
            name: 'guardisRequired',
            id: 'guardisRequired',
            title: 'Guard Is Required',
            options: [
              {title: 'Yes', value: 'Yes'},
              {title: 'No', value: 'No'},
            ],
            infoMessage: ['Radio button is selectable', 'e.g.: Yes'],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'radio',
            name: 'exclusiveVehicle',
            id: 'exclusiveVehicle',
            title: 'Exclusive Vehicle',
            infoMessage: ['Radio button is selectable', 'e.g.: Yes'],
            options: [
              {title: 'Yes', value: 'Yes'},
              {title: 'No', value: 'No'},
            ],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
        ],
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
        .post(api.specialEmployee.create, dataSet)
        .then((response) => {
          if (response?.data?.status == '200') {
            navigate(
              '/onboardCorporate/special-employee/specialemployee-listing',
            );
            toast.success(
              `${response?.data?.data?.categoryName} created successfully`,
            );
            // toast.success(response?.data?.message ?? 'Created successfully');
            close(false);
            // window.location.reload();
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
      <SmartForm
        template={template}
        onSubmit={handleSubmit}
        buttons={['submit']}
        mode='onTouched'
      />
      {/* <SnackbarCustom BooleanValue={boolean} open={open} onChange={handleChange}>{snackbarMsg}</SnackbarCustom> */}
    </>
  );
};

export default CreateForm;
