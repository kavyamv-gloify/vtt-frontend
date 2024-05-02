import React from 'react';
import {useNavigate} from 'react-router-dom';
import SmartForm from '@smart-form';
import {useAuthUser} from '@crema/utility/AuthHooks';
import regex from '@regex';
import axios from 'axios';
import api from '@api';
import AppLoader from '@crema/core/AppLoader';
import {toast} from 'react-toastify';

const CreateForm = ({close}) => {
  const [showbtn, setshowbtn] = React.useState(true);

  const navigate = useNavigate();
  let template = {
    layout: {
      column: 1,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    title: 'Fuel Type',
    description: 'Form for applying Job',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'text',
            name: 'name',
            id: 'name',
            title: 'Name',
            pattern: {
              value: regex.maxSize50,
              message: 'Please enter valid Name and below 50 characters',
            },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },

          {
            type: 'text',
            name: 'description',
            id: 'description',
            title: 'Description',
            pattern: {
              value: regex.maxSize50,
              message: 'Please enter alpha-numeric and below 50 characters',
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
            options: [
              {title: 'Active', value: 'Active'},
              {title: 'Inactive', value: 'Inactive'},
            ],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          // {
          //   type: 'date',
          //   name: 'createdon',
          //   id: 'createdon',
          //   title: "Date",
          //   disabled: false,
          //   max: 'today',
          //   //   pattern: {
          //   //       value: regex.yearReg,
          //   //       message: 'Please enter valid format YYYY'
          //   //   },
          //   validationProps: {
          //     required: 'This is a mandatory field'
          //   }
          // },
        ],
      },
    ],
  };

  const handleSubmit = async (values) => {
    setshowbtn(false);

    if (values.button.toUpperCase() === 'SUBMIT') {
      let dataSet = {};
      dataSet = values.data;
      axios
        .post(api.masterFueltype.createform, dataSet)
        .then((response) => {
          if (response?.data?.status == '200') {
            navigate('/Master/fueltype/table');
            toast.success(response?.data?.message ?? 'Created successfully');
            close();
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
        // watchFields={['firstname', 'include_portfolio', 'email', 'country']}
        // validate={validate}
        onSubmit={handleSubmit}
        buttons={['submit']}
      />
    </>
  );
};

export default CreateForm;
