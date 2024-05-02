import React, {useEffect} from 'react';
// import { useNavigate } from 'react-router-dom';
import SmartForm from '@smart-form';
import {useAuthUser} from '@crema/utility/AuthHooks';
import regex from '@regex';
import axios from 'axios';
import api from '@api';
import {useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';

const CreateForm = () => {
  const [open, setOpen] = useState();
  const [boolean, setBoolean] = useState(false);
  const [snackbarMsg, setsnackBarMsg] = useState();
  const [data, setData] = useState();
  const {id} = useParams();
  const navigate = useNavigate();

  const userVehicleTypeDetail = async () => {
    const baseURL = `${api.masterVehicletype.id}/${id}`;
    let response = await axios.get(`${baseURL}`);

    setData(response.data.data);
  };

  useEffect(() => {
    userVehicleTypeDetail();
  }, [id]);

  let template = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    title: 'Detail Page',
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
            disabled: true,
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
            disabled: true,
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
            title: 'Date',
            disabled: true,
            max: 'today',
            //   pattern: {
            //       value: regex.yearReg,
            //       message: 'Please enter valid format YYYY'
            //   },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
        ],
      },
    ],
  };

  function onCancel() {
    navigate(`/Master/vehicletype/table`);
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
