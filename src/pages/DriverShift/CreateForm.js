/* eslint-disable */
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Steppers from '@smart-form/stepper';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import api from '@api';
import regex from '@regex';
import SmartForm from '@smart-form';
import {toast} from 'react-toastify';
import AppLoader from '@crema/core/AppLoader';
import {useAuthUser} from '@crema/utility/AuthHooks';

const CreateForm = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const {user} = useAuthUser();
  const id = user.userList.profileId;

  const [showTick, setshowTick] = React.useState();
  const [mytempifsc, setMytempifsc] = React.useState();
  const [branchData, setbranchData] = React.useState();
  const [bankNameVal, setbankNameVal] = React.useState();
  const [showbtn, setshowbtn] = React.useState(true);

  useEffect(() => {
    async function fetchData() {
      const baseURL = `${api.driver.list}/${id}`;
      let response = await axios.get(`${baseURL}`);

      let tempo = response?.data?.data;

      setData(tempo);
    }
    fetchData();
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
            title: 'Super Admin Name',
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
              message: 'Please enter valid Shift name and below 50 characters',
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
            title: 'To Time.',
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
    ],
  };

  const handleSubmit = async (values) => {
    setshowbtn(false);

    // return;
    if (values.button.toUpperCase() === 'SUBMIT') {
      let dataSet = {};
      dataSet = values.data;
      dataSet.fromTimeHr = values.data.fromTime.split(':')[0];
      dataSet.fromTimeMin = values.data.fromTime.split(':')[1];
      dataSet.toTimeHr = values.data.toTime.split(':')[0];
      dataSet.toTimeMin = values.data.toTime.split(':')[1];
      dataSet.tenantId = user?.userList?.tanentId;
      dataSet.tenantCode = user?.userList?.tanentCode;

      //  return

      let response = await axios.post(api.drivershift.createform, dataSet);
      if (response.data.status == '200') {
        toast.success(
          response?.data?.message ?? 'Shift submitted successfully',
        );
        navigate(`/Master/drivershift/table`);
        //
      } else {
        setshowbtn(true);
      }
    }
  };

  return (
    <>
      {!showbtn ? <AppLoader /> : null}
      <SmartForm
        // defaultValues={data}
        template={template}
        showbtn={showbtn}
        onSubmit={handleSubmit}
        buttons={['submit']}
      />
    </>
  );
};

export default CreateForm;
