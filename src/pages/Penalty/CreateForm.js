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
  const {user} = useAuthUser();
  // console.log('user', user);

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
            name: 'reason',
            id: 'reason',
            title: 'Reason',
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
            //   options: [
            //     { title: 'OTAPenalty', value: 'OTAPenalty' },
            //     { title: 'OTDPenalty', value: 'OTDPenalty' },
            //     { title: 'Overspeed', value: 'Overspeed' },

            //   ]
          },

          {
            type: 'text',
            name: 'amount',
            id: 'amount',
            title: 'Amount',
            isNumber: true,
            maxChar: 7,
            infoMessage: [
              'Numeric characters are allowed',
              'Maximum value should be 1,000,000',
              'e.g.: 2000',
            ],
            pattern: {
              value: regex.num1000000,
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

  const handleSubmit = async (values) => {
    setshowbtn(false);
    if (values.button.toUpperCase() === 'SUBMIT') {
      let dataSet = {};
      dataSet = values.data;

      if (user?.role == 'VENDOR') {
        dataSet.vendorId = user?.userList?.profileId;
      }

      if (user?.role == 'CORPORATEADMIN' || user?.role == 'SUPERADMIN') {
        dataSet.corporateId = user?.userList?.corporateId;
      }
      // console.log('dataSet', dataSet);

      axios
        .post(api.penalty.create, dataSet)
        .then((response) => {
          if (response?.data?.status == '200') {
            // navigate('/onboardCorporate/penalty/penalty-listing');
            toast.success(
              `${response?.data?.data?.reason} created successfully`,
            );
            // toast.success(response?.data?.message ?? 'Created successfully');
            close(false);
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
      />
      {/* <SnackbarCustom BooleanValue={boolean} open={open} onChange={handleChange}>{snackbarMsg}</SnackbarCustom> */}
    </>
  );
};

export default CreateForm;
