import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import SmartForm from '@smart-form';
import {useAuthUser} from '@crema/utility/AuthHooks';
import regex from '@regex';
import axios from 'axios';
import api from '@api';
import SnackbarCustom from 'pages/thirdParty/SnackBar/SnackBarMsg';
import {SettingsPowerRounded} from '@mui/icons-material';
import {useState} from 'react';
import {useParams} from 'react-router-dom';

const CreateForm = () => {
  const [open, setOpen] = useState();
  const [boolean, setBoolean] = useState(false);
  const [snackbarMsg, setsnackBarMsg] = useState();
  const [data, setData] = useState();
  const {id} = useParams();
  const navigate = useNavigate();

  const userVehicleDetail = async () => {
    const baseURL = `${api.masterVehicletype.id}/${id}`;
    let response = await axios.get(`${baseURL}`);

    setData(response.data.data);
  };

  useEffect(() => {
    userVehicleDetail();
  }, [id]);

  let template = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    title: 'Edit Page',
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
              message: 'Please enter Name and below 50 characters',
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
          //   name: 'createdOn',
          //   id: 'createdOn',
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
          //   {
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

  const handleSubmit = async (values) => {
    if (values.button.toUpperCase() === 'UPDATE') {
      let dataSet = {};
      dataSet = values.data;
      let response = await axios.put(api.masterVehicletype.createform, dataSet);

      if (response.data.status == '200') {
        navigate('/Master/vehicletype/table');
        setsnackBarMsg(response.data.message);
        setBoolean(true);
      } else {
        setsnackBarMsg('Something Went Wrong');
        setBoolean(false);
      }
    }
  };

  return (
    <>
      {' '}
      {data && data.id && (
        <SmartForm
          defaultValues={data}
          template={template}
          onSubmit={handleSubmit}
          buttons={['update']}
        />
      )}
    </>
  );
};

export default CreateForm;
