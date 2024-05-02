import React from 'react';
import {useNavigate} from 'react-router-dom';
import SmartForm from '@smart-form';
import {useAuthUser} from '@crema/utility/AuthHooks';
import regex from '@regex';
import axios from 'axios';
import api from '@api';
import {toast} from 'react-toastify';

const CreateForm = () => {
  const navigate = useNavigate();
  let template = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    title: 'Create Roles',
    description: 'Creating roles for user',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'create_roles',
        fields: [
          {
            type: 'text',
            name: 'userRoleName',
            id: 'userRoleName',
            title: 'User Role Name',
            // disabled: false,
            pattern: {
              value: regex.maxSize50,
              message: 'Please enter valid role name and below 50 characters',
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
    if (values.button.toUpperCase() === 'SUBMIT') {
      let dataSet = {};
      dataSet = values.data;

      axios
        .post(api.masterVehicletype.createform, dataSet)
        .then((res) => {
          if (res?.data?.status == 200) {
            toast.success(
              res?.data?.status ?? 'Vehicle-type created successfully',
            );
            navigate('/Master/vehicletype/table');
          } else {
            toast.error(res?.data?.status ?? 'Something went wrong');
          }
        })
        .catch((err) => {
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
      />
    </>
  );
};

export default CreateForm;
