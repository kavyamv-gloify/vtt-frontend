import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import SmartForm from '@smart-form';
import regex from '@regex';
import axios from 'axios';
import {toast} from 'react-toastify';
import Api from '@api';

const CreateForm = ({handleClicked}) => {
  const navigate = useNavigate();

  let template = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    // title: 'Vehicle Type',
    // description: 'Form for applying Job',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'text',
            name: 'vendorName',
            id: 'vendorName',
            title: 'Vendor Name',
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
        ],
      },
    ],
  };

  const handleSubmit = async (values) => {
    if (values.button.toUpperCase() === 'SUBMIT') {
      let postData = {
        vendorName: values?.data?.vendorName,
      };
      axios
        .post(Api.baseUri + '/user-reg/gps-provider/save-gpsProvider', postData)
        .then((res) => {
          if (res?.data?.status == 200) {
            toast.success(`GPS Vendor is created successfully`);
            handleClicked(false);
          } else {
            toast.error(res?.data?.message ?? 'Something went wrong');
          }
        })
        .catch((err) => {
          handleClicked(false);
          toast.error('Something went wrong');
        });
    }
  };

  return (
    <>
      <SmartForm
        template={template}
        onSubmit={handleSubmit}
        buttons={['submit']}
        mode='onTouched'
      />
    </>
  );
};

export default CreateForm;
