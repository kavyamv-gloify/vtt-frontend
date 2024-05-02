/* eslint-disable */
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
// import Steppers from '@smart-form/stepper';
import SmartForm from '@smart-form';
import {useAuthUser} from '@crema/utility/AuthHooks';
import regex from '@regex';
import axios from 'axios';
import api from '@api';
import {getFormData} from '@hoc';
import {toast} from 'react-toastify';
import AppLoader from '@crema/core/AppLoader';
import {values} from 'lodash';
import {Fonts} from 'shared/constants/AppEnums';
import OtpInput from 'react-otp-input';
import {Button} from '@mui/material';
import Api from '@api';
// import { useAuthUser } from '@crema/utility/AuthHooks';
const EmpolyeeRequestForm = ({first, last, mail, myDial}) => {
  const [emailID, setemailID] = React.useState();
  const [showbtn, setshowbtn] = React.useState(true);
  const [corporateList, setCorporateList] = useState();
  const [openOTP, setOpenOtp] = useState(true);
  const [otpVal, setOtpVal] = useState('');
  const [otpbox, setotpbox] = useState();
  const [getotp, setgetotp] = useState();
  const [emplyid, setEmplyid] = useState();
  const [signupform, setSignupform] = useState();

  const handleOtp = () => {
    if (getotp == otpVal) {
      setotpbox(false);
      setSignupform(true);
    } else {
      toast.error('Please Enter Valid OTP');
    }
  };

  let template = {
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
          // {
          //     type: 'autocomplete',
          //     name: 'userRole',
          //     id: 'userRole',
          //     title: 'Select Role',
          //     options: [{title:"Employee", value:"EMPLOYEE"}, {title:"Corporate Admin", value:"CORPORATEADMIN"}, {title:"Super Admin", value:"SUPERADMIN"}],
          //     validationProps: {
          //         required: 'This is a mandatory field'
          //     }
          // },
          {
            type: 'text',
            name: 'emailId',
            id: 'emailId',
            title: 'Employee Email Id',
            pattern: {
              value: regex.emailReg,
              message: 'Please enter valid Employee Email Id',
            },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
        ],
      },
    ],
  };

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
        layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
        fields: [
          {
            type: 'autocomplete',
            name: 'corporateId',
            id: 'corporateId',
            title: 'Company Name',
            options: corporateList ?? [],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'text',
            name: 'firstName',
            id: 'firstName',
            title: 'FirstName',
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
            pattern: {
              value: regex.char50,
              message: 'Please enter valid last name with max 50 characters',
            },
            // validationProps: {
            //     required: 'This is a mandatory field'
            // }
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
            type: 'text',
            name: 'mobileNo',
            id: 'mobileNo',
            title: 'Mobile No.',
            isNumber: true,
            maxChar: 10,
            pattern: {
              value: regex.phoneReg,
              message: 'Please enter valid Mobile No.',
            },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'radio',
            name: 'gender',
            id: 'gender',
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
            name: 'employeeCode',
            id: 'employeeCode',
            title: 'Employee Code',
            isUpper: true,
            maxChar: 30,
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

  const handleSubmit = async (values) => {
    setshowbtn(false);
    if (values.button.toUpperCase() === 'SIGN UP') {
      let dataSet;
      dataSet = values?.data?.emailId;
      let tem_domain = values?.data?.emailId?.split('@');
      axios
        .get(
          `${Api.baseUri}/userauth/user-account/${values?.data?.emailId}/email`,
        )
        .then((ress) => {
          if (ress?.data == 'User Present') {
            toast.error('User Already Exists.');
            setshowbtn(true);
            return;
          }
          axios
            .get(
              `${Api.baseUri}/user-reg/employee-request/getcorporatelist/@${
                tem_domain[tem_domain?.length - 1]
              }`,
            )
            .then((result) => {
              if (!result?.data?.data?.length) {
                toast.error(
                  "This domain doesn't exists. Please, Contact to Admin.",
                );
                setshowbtn(true);
                return;
              }
              let temppArr = [];
              result?.data?.data?.map((el) => {
                temppArr.push({
                  title: el?.companyName,
                  title2:
                    el.companyName +
                    ' - ' +
                    el?.companyAddress?.addressName?.split(',')[0] +
                    ', ' +
                    el?.companyAddress?.addressName?.split(',')[1] +
                    ', ' +
                    el?.companyAddress?.city,
                  value: el?.id,
                  imgsrc: Api?.imgUrl + el?.companyRegDoc,
                });
              });
              setCorporateList(temppArr);
              axios
                .get(
                  `${Api.baseUri}/user-reg/employee-request/savenewdata/${dataSet}`,
                )
                .then((r) => {
                  if (r.status == '200') {
                    setemailID(values?.data?.emailId);
                    setOpenOtp(false);
                    setshowbtn(true);
                    setotpbox(true);
                    setgetotp(r?.data?.data?.password);
                    setEmplyid(r?.data?.data?.id);
                  } else {
                    setemailID('');
                  }
                });
            });
        })
        .catch((error) => {});
    }
  };

  const handleSubmitsignupform = (values) => {
    setshowbtn(false);
    if (values.button.toUpperCase() === 'SIGN UP') {
      let dataSet = {};
      let allElem = {};
      let tem = {};
      tem = values?.data;
      tem.id = emplyid;
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
        url: api?.employeesignup?.savenewemploye,
        data: getFormData(dataSet),
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then(function (response) {
          if (response?.data?.status == 200) {
            toast.success('Account is created successfully.');
            // navigate(`/onboardadmin/driver/driver-listing`);
            myDial(false);
            // window.location.href = (`/onboardadmin/driver/driver-listing`);
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
      {openOTP && (
        <SmartForm
          template={template}
          setVal={[{name: 'emailId', value: mail}]}
          showbtn={showbtn}
          // validate={validate}
          mode='onTouched'
          onSubmit={handleSubmit}
          buttons={['Sign Up']}
        />
      )}

      {otpbox && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            marginTop: '2rem',
          }}
        >
          <h4
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '-1rem',
            }}
          >
            ENTER OTP
          </h4>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '1rem',
            }}
          >
            <OtpInput
              name='otp'
              value={otpVal}
              onChange={(e) => {
                setOtpVal(e);
              }}
              shouldAutoFocus={true}
              numInputs={6}
              separator={<span>-</span>}
              inputStyle={{
                minWidth: 32,
                minHeight: 40,
                fontWeight: Fonts.REGULAR,
                fontSize: 16,
                textTransform: 'capitalize',
                // padding: '4px 16px 8px',
              }}
            />
          </div>
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <Button
              id='btnMui123'
              variant='contained'
              style={{marginTop: '2rem'}}
              onClick={handleOtp}
            >
              Verify
            </Button>
          </div>
        </div>
      )}

      {signupform && (
        <SmartForm
          template={fulltemplate}
          setVal={[
            {name: 'emailId', value: mail || emailID},
            {name: 'firstName', value: first},
            {name: 'lastName', value: last},
          ]}
          showbtn={showbtn}
          // validate={validate}
          mode='onTouched'
          onSubmit={handleSubmitsignupform}
          buttons={['Sign Up']}
        />
      )}
    </>
  );
};

export default EmpolyeeRequestForm;
