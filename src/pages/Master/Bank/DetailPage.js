import React, {useEffect} from 'react';
// import { useNavigate } from 'react-router-dom';
import SmartForm from '@smart-form';
import {useAuthUser} from '@crema/utility/AuthHooks';
import regex from '@regex';
import axios from 'axios';
import api from '@api';
import SnackbarCustom from 'pages/thirdParty/SnackBar/SnackBarMsg';
import {SettingsPowerRounded} from '@mui/icons-material';
import {useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';

const CreateForm = () => {
  const [open, setOpen] = useState();
  const [boolean, setBoolean] = useState(false);
  const [snackbarMsg, setsnackBarMsg] = useState();
  const [data, setData] = useState();
  const {id} = useParams();
  const navigate = useNavigate();

  const userBankDetail = async () => {
    const baseURL = `${api.masterBank.id}/${id}`;
    let response = await axios.get(`${baseURL}`);

    setData(response.data.data);
  };

  useEffect(() => {
    userBankDetail();
  }, [id]);

  let template = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    title: 'Details',
    description: 'Form for applying Job',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'text',
            name: 'code',
            id: 'code',
            title: 'Bank Code',
            disabled: true,
            pattern: {
              value: regex.maxSize50,
              message:
                'Please enter valid code with alpha-numeric and below 50 characters',
            },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },

          {
            type: 'text',
            name: 'name',
            id: 'name',
            title: 'Bank Name',
            disabled: true,
            pattern: {
              value: regex.maxSize50,
              message: 'Please enter Bank Name and below 50 characters',
            },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },

          {
            type: 'radio',
            name: 'status',
            id: 'status',
            title: 'Status',
            disabled: true,
            options: [
              {title: 'Active', value: 'Active'},
              {title: 'Inactive', value: 'Inactive'},
            ],
          },
          {
            type: 'text',
            name: 'createdOn',
            id: 'createdOn',
            title: 'Created On',
            disabled: true,
            pattern: {
              value: regex.maxSize50,
              message: 'Please enter alpha-numeric and below 50 characters',
            },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },

          // {
          //     type: 'date',
          //     name: 'createdon',
          //     id: 'createdon',
          //     title: "Date",
          //     disabled: false,
          //     max: 'today',
          //     //   pattern: {
          //     //       value: regex.yearReg,
          //     //       message: 'Please enter valid format YYYY'
          //     //   },
          //     validationProps: {
          //         required: 'This is a mandatory field'
          //     }
          // },
        ],
      },
    ],
  };

  function onCancel() {
    navigate(`/onboardCorporate/shift-listing,`);
  }

  return (
    <>
      {' '}
      {data && data.id && (
        <SmartForm
          defaultValues={data}
          template={template}
          onCancel={onCancel}
          buttons={['cancel']}
        />
      )}
    </>
  );
};

export default CreateForm;
