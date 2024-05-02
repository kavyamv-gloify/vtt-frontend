import React, {useEffect, useState} from 'react';
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

const ApproveForm = ({id, close}) => {
  const navigate = useNavigate();
  const [showbtn, setshowbtn] = React.useState(true);
  const [open, setOpen] = useState();
  const [boolean, setBoolean] = useState(false);
  const [snackbarMsg, setsnackBarMsg] = useState();
  const [data, setData] = useState();

  const {user} = useAuthUser();

  useEffect(() => {
    async function getEmployee() {
      let res = await axios.get(
        `${api.employeesignup.getNewEmployeebyId}/${id}`,
      );

      setData(res?.data?.data);
    }
    getEmployee();
  }, [id]);

  let fulltemplate = {
    layout: {
      column: 1,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    title: '',
    // layout: { type: 'horizontal', position: 'center', labelPos: 'top', maxWidth: '80%', margin: '10px 20px' },

    sections: [
      {
        type: 'section',
        layout: {column: 4, spacing: 2, size: 'medium', label: 'fixed'},
        fields: [],
      },

      {
        type: 'section',
        layout: {column: 1, spacing: 2, size: 'medium', label: 'fixed'},
        fields: [
          {
            type: 'text',
            name: 'firstName',
            id: 'firstName',
            title: 'FirstName',
            disabled: true,
            pattern: {
              value: regex.char50,
              message: 'Please enter valid first name with max 50 characters',
            },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },

          {
            type: 'text',
            name: 'lastName',
            id: 'lastName',
            title: 'LastName',
            disabled: true,
            pattern: {
              value: regex.char50,
              message: 'Please enter valid last name with max 50 characters',
            },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },

          {
            type: 'text',
            name: 'emailId',
            id: 'emailId',
            title: 'Employee Email Id',
            disabled: true,
            pattern: {
              value: regex.emailReg,
              message: 'Please enter valid Employee Email Id',
            },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'radio',
            name: 'gender',
            id: 'gender',
            // disabled: true,
            title: 'Gender',
            options: [
              {title: 'Male', value: 'Male'},
              {title: 'Female', value: 'Female'},
              {title: 'Others', value: 'Others'},
            ],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },

          {
            type: 'text',
            name: 'mobileNo',
            id: 'mobileNo',
            title: 'Mobile No.',
            disabled: true,
            pattern: {
              value: regex.phoneReg,
              message: 'Please enter valid Mobile No.',
            },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },

          {
            type: 'text',
            name: 'employeeCode',
            id: 'employeeCode',
            title: 'Employee Code',
            disabled: true,
            pattern: {
              value: regex.codeReg,
              message: 'Please enter valid Employee Code',
            },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
        ],
      },
    ],
  };

  const getFormData = (object) =>
    Object.keys(object).reduce((formData, key) => {
      formData.append(key, object[key]);
      return formData;
    }, new FormData());

  const handleSubmit = (values) => {
    setshowbtn(false);

    if (values.button.toUpperCase() === 'APPROVE') {
      let dataSet = {};
      let allElem = {};
      let tem = {};
      tem = values?.data;
      tem.tanentId = user?.userList?.tanentId;
      tem.corporateId = user?.userList?.corporateId;
      tem.companyName = user?.userList?.corporateName;

      delete tem.password;

      Object.keys(tem).map((key) => {
        if (typeof tem[key]?.[0]?.name == 'string') {
          dataSet = {
            ...dataSet,
            [key]: tem[key][0],
          };
        } else {
          allElem = {
            ...allElem,
            [key]: tem[key],
          };
        }
      });
      dataSet = {
        ...dataSet,
        data: JSON.stringify(allElem),
      };

      axios({
        method: 'post',
        url: api?.employeesignup?.approve,
        data: getFormData(dataSet),
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then(function (response) {
          if (response?.data?.status == 200) {
            toast.success('Details has been successfully approved.');
            // navigate(`/onboardCorporate/employee/newemployee-request`);
            // myDial(false);
            // window.location.href = (`/onboardadmin/driver/driver-listing`);
            close(false);
          } else {
            toast.error(response?.data?.message, 'Something went wrong');
          }
          setshowbtn(true);
        })
        .catch(function (err) {
          setshowbtn(true);
          //handle error
          toast.error(err?.data?.message, 'Something went wrong');
        });
    }
  };

  return (
    <>
      {!showbtn ? <AppLoader /> : null}
      {data && data.id && (
        <SmartForm
          template={fulltemplate}
          onSubmit={handleSubmit}
          buttons={['approve']}
          defaultValues={data}
          // setVal={[
          //     { name: "emailId", value: mail },
          //     { name: "firstName", value: first },
          //     { name: "lastName", value: last }]}
        />
      )}

      {/* <SnackbarCustom BooleanValue={boolean} open={open} onChange={handleChange}>{snackbarMsg}</SnackbarCustom> */}
    </>
  );
};

export default ApproveForm;
