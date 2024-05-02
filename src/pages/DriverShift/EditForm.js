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
import {toast} from 'react-toastify';
import {useParams} from 'react-router-dom';

const CreateForm = () => {
  const navigate = useNavigate();
  const {user} = useAuthUser();
  const [data, setData] = useState();
  const {id} = useParams();

  const drivershiftDetail = async () => {
    const baseURL = `${api.drivershift.list}/${id}`;
    let response = await axios.get(`${baseURL}`);

    setData(response.data.data);
  };

  useEffect(() => {
    drivershiftDetail();
  }, [id]);

  let template = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    title: 'Drive Shift Form',
    description: 'Form for applying Job',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'hidden',
            name: 'tenantName',
            title: 'tenantName',
            id: 'tenantName',
            defaultValue: user?.userList?.tanentName,
          },
          {
            type: 'text',
            name: 'shiftName',
            id: 'shiftName',
            title: 'Shift Name',
            pattern: {
              value: regex.char50,
              message: 'Please enter valid Shift Name and below 50 characters',
            },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
        ],
      },

      {
        layout: {column: 3, spacing: 2, size: 'small', label: 'fixed'},
        id: 'Time Information',
        fields: [
          {
            type: 'text',
            name: 'fromTime',
            id: 'fromTime',
            title: 'From Time',
            input_type: 'time',
            // pattern: {
            //     value: regex.hhmmReg,
            //     message: 'Please enter valid Time'
            // },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
        ],
      },

      {
        layout: {column: 3, spacing: 2, size: 'small', label: 'fixed'},
        id: 'Time Information',
        fields: [
          {
            type: 'text',
            name: 'toTime',
            id: 'toTime',
            title: 'To Time',
            input_type: 'time',
            // pattern: {
            //   value: regex.hhmmReg,
            //   message: 'Please enter valid Time'
            // },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
        ],
      },
    ],
  };

  const handleSubmit = async (values) => {
    if (values.button.toUpperCase() === 'UPDATE') {
      let dataSet = {};
      dataSet = values.data;
      dataSet.fromTimeHr = values.data.fromTime.split(':')[0];
      dataSet.fromTimeMin = values.data.fromTime.split(':')[1];
      dataSet.toTimeHr = values.data.toTime.split(':')[0];
      dataSet.toTimeMin = values.data.toTime.split(':')[1];
      dataSet.tenantId = user?.userList?.tanentId;
      dataSet.tenantCode = user?.userList?.tanentCode;

      let response = await axios.put(api.drivershift.createform, dataSet);
      if (response.data.status == '200') {
        navigate(`/Master/drivershift/table`);
        toast.success(response?.data?.message ?? 'shifts updated successfully');
      } else {
      }
    }
  };

  return (
    <>
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
