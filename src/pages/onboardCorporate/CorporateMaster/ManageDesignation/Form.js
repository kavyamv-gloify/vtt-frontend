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

const DesignationForm = ({close, bussinessId, businessname, getFilterData}) => {
  const navigate = useNavigate();
  const [showbtn, setshowbtn] = React.useState(true);
  console.log('bussinessId', bussinessId, businessname);
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
            name: 'designationName',
            id: 'designationName',
            title: 'Designation Name',
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
    ],
  };

  const handleSubmit = async (values) => {
    setshowbtn(false);

    setshowbtn(false);
    if (values.button.toUpperCase() === 'SUBMIT') {
      let dataSet = {};
      dataSet = values.data;
      dataSet.status = 'ACTIVE';
      dataSet.buId = bussinessId;
      dataSet.buName = businessname;

      axios
        .post(api.designation.savedesignation, dataSet)
        .then((response) => {
          if (response?.data?.status == '200') {
            // navigate('/onboardCorporate/designation/designation-table')
            toast.success(
              `${response?.data?.data?.designationName} created successfully`,
            );
            getFilterData();
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
    </>
  );
};

export default DesignationForm;
