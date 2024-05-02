import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import SmartForm from '@smart-form';
import {useAuthUser} from '@crema/utility/AuthHooks';
import regex from '@regex';
import axios from 'axios';
import Api from '@api';
import SnackbarCustom from 'pages/thirdParty/SnackBar/SnackBarMsg';
import {SettingsPowerRounded} from '@mui/icons-material';
import AppLoader from '@crema/core/AppLoader';
import {toast} from 'react-toastify';

const CreateTypeForm = ({close}) => {
  const navigate = useNavigate();
  const [showbtn, setshowbtn] = React.useState(true);
  const [employee, setEmployee] = useState();
  const {user} = useAuthUser();

  // useEffect(() => {
  //     axios.get(Api.baseUri + '/user-reg/employee-reg/corporate?page=0&size=2000&emailId=null&employeeCode=null&mobileNo=null').then((res) => {
  //         //
  //         let temp = []
  //         res?.data?.data?.body?.EmployeeList?.map((el) => {
  //             temp.push({ title: el?.employeeFullName, value: el?.id })
  //         })
  //         setEmployee(temp ?? [])
  //     }).catch((err) => {
  //
  //         setEmployee([])
  //     })
  // }, [])
  let template = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
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
            title: 'Incident Type Name',
            pattern: {
              value: regex.maxSize150,
              message: 'Please enter  valid amount',
            },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },

          {
            type: 'text',
            name: 'code',
            id: 'code',
            title: 'Incident Type Code',
            // infoMessage: ["Numeric characters are allowed", "Maximum value should be 1,000,000", "e.g.: 2000"],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },

          // {
          //     type: 'multiSelect',
          //     name: 'tempworkflow',
          //     id: 'tempworkflow',
          //     title: 'Work Flow',
          //     options: employee ?? [],
          //     validationProps: {
          //         required: 'This is a mandatory field'
          //     }
          // },
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
      // let temparray = dataSet.tempworkflow;
      // let arr = []
      // for (let i = 0; i < temparray.length; i++) {
      //     arr.concat(arr.push({ empId: temparray[i], level: Number(i + 1) }))
      // }
      //

      // dataSet.workflow = arr;
      // delete dataSet.tempworkflow;

      axios
        .post(Api.baseUri + '/user-reg/incident/create-incident-type', dataSet)
        .then((response) => {
          if (response?.data?.status == '200') {
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
        onSubmit={handleSubmit}
        buttons={['submit']}
      />
    </>
  );
};

export default CreateTypeForm;
