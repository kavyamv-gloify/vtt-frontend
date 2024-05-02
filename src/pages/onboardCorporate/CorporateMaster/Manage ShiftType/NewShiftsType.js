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

const NewShiftsType = ({close}) => {
  const navigate = useNavigate();
  const [showbtn, setshowbtn] = React.useState(true);
  const {user} = useAuthUser();
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
            name: 'shiftType',
            id: 'shiftType',
            title: 'Shift Type Name',
            infoMessage: [
              'only Alphabets are allowed',
              'Maximum length should be 50 characters',
              'e.g.: Morning',
            ],
            pattern: {
              value: regex.char50,
              message: 'Please enter valid Shiftname',
            },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },

          {
            type: 'radio',
            name: 'pickupType',
            id: 'pickupType',
            title: 'Pick Up',
            infoMessage: [
              'only Alphabets are allowed',
              'Maximum length should be 50 characters',
              'e.g.: Morning',
            ],
            options: [
              {title: 'Home', value: 'HOME'},
              {title: 'Nodal', value: 'NODAL'},
            ],
            pattern: {
              value: regex.char50,
              message: 'Please enter valid Shiftname',
            },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
        ],
      },
    ],
  };

  function submitshiftType(values) {
    setshowbtn(false);
    if (values?.button == 'submit') {
      let dataSet = {};
      dataSet = values.data;
      dataSet.tanentId = user?.userList?.tanentId;
      dataSet.corporateId = user?.userList?.corporateId;
      dataSet.status = 'ACTIVE';
      axios
        .post(api.mastershifttype.addshifttype, dataSet)
        .then((response) => {
          if (response?.data?.status == '200') {
            toast.success(
              response?.data?.message ?? 'ShiftType Created Successfully',
            );
            close(false);
          } else {
            setshowbtn(true);
            toast.error(response?.data?.message);
          }
          setshowbtn(true);
        })
        .catch((er) => {
          setshowbtn(true);
          toast.success(
            response?.data?.message ?? 'ShiftType Created Successfully',
          );
        });
    }
  }

  return (
    <>
      {!showbtn ? <AppLoader /> : null}
      <SmartForm
        template={template}
        onSubmit={submitshiftType}
        buttons={['submit']}
      />
    </>
  );
};

export default NewShiftsType;
