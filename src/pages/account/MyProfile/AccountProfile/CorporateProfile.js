/* eslint-disable */
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Steppers from '@smart-form/stepper';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import api from '@api';
import regex from '@regex';
import {toast} from 'react-toastify';
import AppLoader from '@crema/core/AppLoader';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {te} from 'date-fns/locale';
import PersonIcon from '@mui/icons-material/Person';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import DomainIcon from '@mui/icons-material/Domain';
import HomeIcon from '@mui/icons-material/Home';
import {Dialog, DialogContent, DialogTitle} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SmartForm from '@smart-form';
const EditForm = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const {user} = useAuthUser();
  const id = user.userList.profileId;
  const [showTick, setshowTick] = React.useState();
  const [mytempifsc, setMytempifsc] = React.useState();
  const [branchData, setbranchData] = React.useState();
  const [bankNameVal, setbankNameVal] = React.useState();
  const [showbtn, setshowbtn] = React.useState(true);
  const [add1, setadd1] = React.useState('');
  const [domainList, setDomainList] = useState();
  const [verifyType, setVerifyType] = useState();
  const [lastverifiedData, setLastVerifiedData] = useState({});
  const [verifyData, setVerifyData] = useState();
  const [otpLoader, setOtpLoader] = useState(false);
  const [myOtp, setmyOtp] = useState();
  const [myFormData, setmyFormData] = useState({});
  const [currentStep, setCurrentStep] = useState(false);
  const myCurrentStep = (currStep) => {
    setCurrentStep(currStep);
  };
  useEffect(() => {
    if (user?.userList?.userStatus && user?.userList?.userStatus != 'DEFAULT') {
      navigate('/dashboard');
    }
    async function fetchData() {
      const baseURL = `${api.onBoardCorporate.list}/${id}`;
      let response = await axios.get(`${baseURL}`);

      let tempo = response?.data?.data;
      tempo.tempcompanyAddressOne = tempo?.companyAddress?.addressName;
      tempo.tempcompanyAddresstown = tempo?.companyAddress?.city;
      tempo.tempcompanyAddresspincode = tempo?.companyAddress?.pinCode;
      tempo.tempcompanyAddressstate = tempo?.companyAddress?.state;
      tempo.tempaccountNumber = tempo.accountNumber;
      setData(tempo);
      let temTypOf = localStorage.getItem('loginWith');
      setLastVerifiedData({
        mob: isNaN(Number(temTypOf)) ? '' : temTypOf,
        email: isNaN(Number(temTypOf)) ? temTypOf : '',
      });
      // setLastVerifiedData({ mob: response?.data?.data?.mobileNo, email: response?.data?.data?.emailId })
    }
    fetchData();
  }, [id]);
  useEffect(() => {
    async function fetchData() {
      const baseURL = `${api.onBoardTenant.list}/${data?.tanentId}`;
      axios
        .get(`${baseURL}`)
        .then((response) => {
          let temArr = [];
          response.data.data?.domains?.map((el) => {
            temArr.push({title: el, value: el});
          });
          // setData(response.data.data ?? {})
          setDomainList(temArr ?? []);
        })
        .catch((err) => {
          // setData({})
          setDomainList([]);
        });
    }
    fetchData();
  }, [data?.tanentId]);
  let stepperTemplate = {
    title: 'Profile Verification',
    layout: {
      type: 'horizontal',
      position: 'center',
      labelPos: 'top',
      maxWidth: '80%',
      margin: '10px 20px',
    },
    steps: [
      {
        layout: {},
        title: 'Corporate Details',
        buttons: ['next'],
        buttonStyle: {
          type: 'square',
          text: true,
          icon: '',
          size: '',
          bgColor: '',
          textColor: '',
          fontSize: '',
        },
        form: {
          layout: {
            column: 2,
            spacing: 2,
            size: 'medium',
            label: 'fixed',
            type: 'grid',
          },
          sections: [
            {
              layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
              id: 'personal_information',
              fields: [
                {
                  type: 'text',
                  name: 'companyName',
                  id: 'companyName',
                  title: 'Company Name',
                  disabled: true,
                  infoMessage: [
                    'Only Alphanumeric are allowed',
                    'Maximum length should be 50 characters.',
                    'EX: TCS,Wipro,HCL etc...',
                  ],
                  pattern: {
                    value: regex.companyreg,
                    message:
                      'Please enter valid company name and below 50 characters',
                  },
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },
                {
                  type: 'text',
                  name: 'companyCode',
                  id: 'companyCode',
                  title: 'Company Code',

                  disabled: true,
                  infoMessage: [
                    'Alphanumeric characters are allowed',
                    'Maximum length should be 50 characters.',
                    'EX: TCS1234',
                  ],
                  pattern: {
                    value: regex.charwithnum,
                    message:
                      'Please enter valid company code  and below 50 characters',
                  },
                },
                {
                  type: 'hidden',
                  name: 'tanentId',
                  id: 'tanentId',
                  defaultValue: user?.userList?.tanentId,
                },
                {
                  type: 'hidden',
                  name: 'tanentCode',
                  id: 'tanentCode',
                  defaultValue: user?.userList?.tanentCode,
                },
                {
                  type: 'hidden',
                  name: 'tanentName',
                  id: 'tanentName',
                  defaultValue: user?.userList?.tanentName,
                },
                {
                  type: 'text',
                  name: 'tempcompanyAddressOne',
                  id: 'tempcompanyAddressOne',
                  title: 'Flat, House No., Building, Apartment',
                  disabled: true,
                  infoMessage: [
                    'Alphanumeric characters are allowed',
                    'Maximum length should be 100 characters',
                    'e.g.: Noida Sector 48, UP',
                  ],
                  // pattern: {
                  //   value: regex.addressReg,
                  //   message: 'Please enter valid Address with max 100 characters '
                  // },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },

                // {
                //   type: 'text',
                //   name: 'tempcompanyAddressOneAREA',
                //   id: 'tempcompanyAddressOneAREA',
                //   title: 'Area, Street, Sector, Village',
                //   disabled: true,
                //   infoMessage: ["Alphanumeric characters are allowed", "Maximum length should be 100 characters", "e.g.: Noida Sector 48, UP"],
                //   // pattern: {
                //   //   value: regex.addressReg,
                //   //   message: 'Please enter valid Address with max 100 characters '
                //   // },
                //   // validationProps: {
                //   //   required: 'This is a mandatory field'
                //   // }
                // },

                {
                  type: 'text',
                  name: 'tempcompanyAddresstown',
                  id: 'tempcompanyAddresstown',
                  disabled: true,
                  infoMessage: [
                    'Alphanumeric characters are allowed',
                    'Maximum length should be 50  characters',
                    'e.g.: Noida ',
                  ],
                  title: 'Town/City ',
                  pattern: {
                    value: regex.adreesschar50,
                    message: 'Please enter valid City with max 50 characters',
                  },
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },

                {
                  type: 'text',
                  name: 'tempcompanyAddressstate',
                  id: 'tempcompanyAddressstate',
                  disabled: true,
                  title: 'State ',
                  infoMessage: [
                    'Alphanumeric characters are allowed',
                    'Maximum length should be 50 characters',
                    'e.g.:  UP',
                  ],
                  pattern: {
                    value: regex.adreesschar50,
                    message: 'Please enter valid State with max 50 characters',
                  },
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },
                {
                  type: 'text',
                  name: 'tempcompanyAddresspincode',
                  id: 'tempcompanyAddresspincode',
                  disabled: true,
                  infoMessage: [
                    'Numeric characters are allowed',
                    'Maximum length should be 6 characters',
                    'e.g.: 201301',
                  ],
                  title: 'Pincode ',
                  pattern: {
                    value: regex.pincodeRegex,
                    message: 'Please enter valid Pincode',
                  },
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },

                {
                  type: 'section',
                  layout: {
                    column: 2,
                    spacing: 2,
                    size: 'medium',
                    label: 'fixed',
                  },
                  fields: [
                    {
                      type: 'text',
                      name: 'companyRegNo',
                      id: 'companyRegNo',
                      title: 'Registration No.',
                      infoMessage: [
                        'Alphanumeric characters are allowed',
                        'Maximum length should be 30 characters',
                        'e.g.:LU12345DL2022',
                      ],
                      disDate: ['2022-08-07T00:00', '2022-08-08T00:00'],
                      pattern: {
                        value: regex.maxSize30,
                        message: 'Please enter valid registration no. ',
                      },
                      validationProps: {
                        required: 'This is a mandatory field',
                      },
                    },
                    {
                      type: 'file',
                      name: 'regfile',
                      id: 'regfile',
                      title: 'Upload Document',
                      accept: 'image/*,.pdf,.doc,.docx',
                      infoMessage: [
                        'Should only accept PDF,JPEG files',
                        'File should contain file extension',
                        'e.g.:Shub.jpeg',
                      ],
                      tempFilename: data?.companyRegDoc,
                      validationProps: data?.companyRegDoc
                        ? {
                            size: {
                              value: 5,
                              message:
                                'File size should not be more than 5 mb.',
                            },
                          }
                        : {
                            required: 'This is a mandatory field',
                            size: {
                              value: 5,
                              message:
                                'File size should not be more than 5 mb.',
                            },
                          },
                    },
                  ],
                },
                {
                  type: 'section',
                  layout: {
                    column: 2,
                    spacing: 2,
                    size: 'medium',
                    label: 'fixed',
                  },
                  fields: [
                    {
                      type: 'text',
                      name: 'companyGSTN',
                      id: 'companyGSTN',
                      title: 'GSTIN No.',
                      infoMessage: [
                        'Alphanumeric characters are allowed',
                        'Maximum length should be 15 characters .',
                        'e.g.:07AAGFF2194N1Z1',
                      ],
                      pattern: {
                        value: regex.gstReg,
                        message: 'Please enter valid GST number',
                      },
                      validationProps: {
                        required: 'This is a mandatory field',
                      },
                    },
                    {
                      type: 'file',
                      name: 'gstnfile',
                      id: 'gstnfile',
                      title: 'Upload Document',
                      accept: 'image/*,.pdf,.doc,.docx',
                      infoMessage: [
                        'Should only accept PDF,JPEG files',
                        'File should contain file extension',
                        'e.g.:Shub.jpeg',
                      ],
                      tempFilename: data?.companyGstnDoc,
                      validationProps: data?.companyGstnDoc
                        ? {
                            size: {
                              value: 5,
                              message:
                                'File size should not be more than 5 mb.',
                            },
                          }
                        : {
                            required: 'This is a mandatory field',
                            size: {
                              value: 5,
                              message:
                                'File size should not be more than 5 mb.',
                            },
                          },
                    },
                  ],
                },
                {
                  type: 'section',
                  layout: {
                    column: 2,
                    spacing: 2,
                    size: 'medium',
                    label: 'fixed',
                  },
                  fields: [
                    {
                      type: 'text',
                      name: 'companyPAN',
                      id: 'companyPAN',
                      title: 'PAN No.',
                      isUpper: true,
                      maxChar: 10,
                      infoMessage: [
                        'Alphanumeric characters are allowed',
                        'Maximum length should be 10 characters .',
                        'e.g.:BNZPM2501F',
                      ],
                      pattern: {
                        value: regex.panReg,
                        message: 'Please enter valid PAN number',
                      },
                      validationProps: {
                        required: 'This is a mandatory field',
                      },
                    },
                    {
                      type: 'file',
                      name: 'panfile',
                      id: 'panfile',
                      title: 'Upload Document',
                      accept: 'image/*,.pdf,.doc,.docx',
                      infoMessage: [
                        'Should only accept PDF,JPEG files',
                        'File should contain file extension',
                        'e.g.:Shub.jpeg',
                      ],
                      tempFilename: data?.companyPanDoc,
                      validationProps: data?.companyPanDoc
                        ? {
                            size: {
                              value: 5,
                              message:
                                'File size should not be more than 5 mb.',
                            },
                          }
                        : {
                            required: 'This is a mandatory field',
                            size: {
                              value: 5,
                              message:
                                'File size should not be more than 5 mb.',
                            },
                          },
                    },
                  ],
                },
              ],
            },
          ],
        },
      },

      {
        layout: {},
        title: 'Contact Person Details',
        buttons: ['next'],
        buttonStyle: {
          type: 'square',
          text: true,
          icon: '',
          size: '',
          bgColor: '',
          textColor: '',
          fontSize: '',
        },
        form: {
          layout: {
            column: 2,
            spacing: 2,
            size: 'medium',
            label: 'fixed',
            type: 'grid',
          },
          sections: [
            {
              layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
              fields: [
                {
                  type: 'text',
                  name: 'contactPersonFirstName',
                  id: 'contactPersonFirstName',
                  title: ' First Name',
                  infoMessage: [
                    'Only alphabets are allowed.',
                    'Maximum length should be 50 characters.',
                    'Ex-XYZ.',
                  ],
                  pattern: {
                    value: regex.char50,
                    message: 'Please enter valid name with max 50 characters',
                  },
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },
                {
                  type: 'text',
                  name: 'contactPersonLastName',
                  id: 'contactPersonLastName',
                  title: 'Last Name',
                  infoMessage: [
                    'Only alphabets are allowed.',
                    'Maximum length should be 50 characters.',
                    'Ex-Sharma.',
                  ],
                  pattern: {
                    value: regex.char50,
                    message: 'Please enter valid name with max 50 characters',
                  },
                  validationProps: {
                    // required: 'This is a mandatory field'
                  },
                },
                {
                  type: 'section',
                  layout: {
                    column: 2,
                    spacing: 2,
                    size: 'medium',
                    label: 'fixed',
                  },
                  fields: [
                    {
                      type: 'text',
                      name: 'emailId',
                      id: 'emailId',
                      title: 'Email Id',
                      defaultValue: data?.domain,
                      infoMessage: [
                        'Alphanumeric characters are allowed',
                        'Maximum length should be 30 characters & should include @',
                        'Should have domain name',
                        'e.g.: xyz45@gmail.com',
                      ],
                      pattern: {
                        value: regex.emailReg,
                        message: 'Please enter valid Email Id',
                      },
                      validationProps: {
                        required: 'This is a mandatory field',
                        manual: [
                          {
                            condition: `emailId domainCheck domains`,
                            message: 'Domain name did not match',
                          },
                        ],
                      },
                    },
                    {
                      type: 'button',
                      name: 'verify',
                      buttonFor: 'emailId',
                      id: 'verify ',
                      title: 'Verify ',
                      defaultValue: 'verify',
                    },
                  ],
                },
                {
                  type: 'multiSelect',
                  name: 'domains',
                  id: 'domains',
                  title: 'Domains',
                  options: domainList ?? [],
                  infoMessage: [
                    'Dropdown values are selectable',
                    'e.g.: @gmail.com etc.',
                  ],
                  // infoMessage: ["Alphanumeric characters are allowed", "Maximum length should be 30 characters & should include @", "Should have domain name", "e.g.: xyz45@gmail.com"],
                  pattern: {
                    value: regex.emailReg,
                    message: 'Please enter valid Email Id',
                  },
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },
                {
                  type: 'section',
                  layout: {
                    column: 2,
                    spacing: 2,
                    size: 'medium',
                    label: 'fixed',
                  },
                  fields: [
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
                      type: 'button',
                      name: 'verify',
                      id: 'verify ',
                      buttonFor: 'mobileNo',
                      title: ' Verify',
                      defaultValue: 'verify',
                    },
                  ],
                },
                {
                  type: 'text',
                  name: 'landLineNo',
                  id: 'landLineNo',
                  title: 'Landline No.',
                  infoMessage: [
                    'Numeric characters are allowed',
                    'Maximum length should be 15 characters',
                    'e.g.: 01125645635',
                  ],
                  pattern: {
                    value: regex.landlineReg,
                    message: 'Please enter valid landline number',
                  },
                  validationProps: {
                    manual: [
                      {
                        condition: `mobileNo != landLineNo`,
                        message: 'Landline should be different from mobileNo.',
                      },
                    ],
                  },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },
              ],
            },
          ],
        },
      },
      {
        layout: {},
        title: 'Bank Details',
        buttons: ['verify and confirm'],
        buttonStyle: {
          type: 'square',
          text: true,
          icon: '',
          size: '',
          bgColor: '',
          textColor: '',
          fontSize: '',
        },
        form: {
          layout: {
            column: 2,
            spacing: 2,
            size: 'medium',
            label: 'fixed',
            type: 'grid',
          },
          sections: [
            {
              layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
              fields: [
                {
                  type: 'text',
                  name: 'accountName',
                  id: 'accountName',
                  title: 'Name of account holder',
                  infoMessage: [
                    'Only alphabets are allowed.',
                    'Maximum length should be 50 characters.',
                    'Ex-XYZ Sharma',
                  ],
                  pattern: {
                    value: regex.maxSize50,
                    message:
                      'Please enter valid account holder name with max 50 characters',
                  },
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },
                {
                  type: 'password',
                  name: 'tempaccountNumber',
                  id: 'tempaccountNumber',
                  title: 'Bank Account No.',
                  // defaultValue: data?.accountNumber,
                  infoMessage: [
                    'Numeric characters are allowed',
                    'Maximum length should be 10 characters',
                    'e.g.: 9058906780',
                  ],
                  pattern: {
                    value: regex.acountNoReg,
                    message: 'Please enter valid bank account number',
                  },
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },
                {
                  type: 'text',
                  name: 'accountNumber',
                  id: 'accountNumber',
                  title: 'Confirm Bank Account No.',
                  infoMessage: [
                    'Numeric characters are allowed',
                    'Maximum length should be 10 characters',
                    'e.g.: 9058906780',
                  ],
                  pattern: {
                    value: regex.acountNoReg,
                    message: 'Please enter valid bank account number',
                  },
                  validationProps: {
                    manual: [
                      {
                        condition: `tempaccountNumber == accountNumber`,
                        message: 'Account number did not match',
                      },
                    ],
                    required: 'This is a mandatory field',
                  },
                },
                {
                  type: 'text',
                  name: 'ifscCode',
                  id: 'ifscCode',
                  isUpper: true,
                  maxChar: 11,
                  title: 'IFSC Code',
                  infoMessage: [
                    'Alphanumeric characters are allowed',
                    'Maximum length should be 10 characters',
                    'e.g.: SBIN000456',
                  ],
                  pattern: {
                    value: regex.ifscReg,
                    message: 'Please enter valid IFSC code',
                  },
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },
                {
                  type: 'text',
                  name: 'bankName',
                  id: 'bankName',
                  title: 'Bank Name',
                  infoMessage: [
                    'Bank name should be autofetched through IFSC code',
                  ],
                  disabled: true,
                },
                {
                  type: 'text',
                  name: 'branchName',
                  id: 'branchName',
                  title: 'Branch Name',
                  infoMessage: [
                    'Branch name should be autofetched through IFSC code',
                  ],
                  disabled: true,
                },
              ],
            },
          ],
        },
      },
    ],
  };

  let template = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    // title: 'Bank Type',
    description: 'Form for verifying OTP',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'text',
            name: 'enterEmail',
            id: 'enterEmail',
            title: verifyType == 'MOB' ? 'Mobile Number' : 'Email Id',
            disabled: true,
          },
          {
            type: 'multiInput',
            name: 'enterOTP',
            id: 'enterOTP',
            blocks: 6,
            title: 'Enter OTP',
            maxChar: 6,
            isNumber: true,
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

    //  )
    if (values.button.toUpperCase() === 'VERIFY AND CONFIRM') {
      let dataSet = {};
      let allElem = {};
      let tem = values?.data;
      // if (tem?.bankNameTemp) delete tem.bankNameTemp;
      tem.companyAddress = {
        addressName:
          values?.data?.tempcompanyAddressOne +
          '++' +
          values?.data?.tempcompanyAddressOneAREA,
        pinCode: values?.data?.tempcompanyAddresspincode,
        state: values?.data?.tempcompanyAddressstate,
        city: values?.data?.tempcompanyAddresstown,
      };
      tem.profileStatus = 'ACTIVE';
      if (!tem?.regfile?.length) delete tem.regfile;
      if (!tem?.gstnfile?.length) delete tem.gstnfile;
      if (!tem?.panfile?.length) delete tem.panfile;
      delete tem.tempcompanyAddressOne;
      delete tem.tempcompanyAddressOneAREA;
      if (tem.tempcompanyAddresstown) delete tem.tempcompanyAddresstown;
      if (tem.tempcompanyAddressstate) delete tem.tempcompanyAddressstate;
      if (tem.tempcompanyAddresspincode) delete tem.tempcompanyAddresspincode;

      delete tem.tempaccountNumber;

      Object.keys(tem).map((key) => {
        //
        //  )
        if (typeof tem[key]?.[0]?.name == 'string') {
          dataSet = {
            ...dataSet,
            [key]: tem[key][0],
          };
        } else if (Object.keys(tem[key] ?? {}).length !== 0) {
          if (
            tem[key] !== '' ||
            tem[key] !== null ||
            tem[key] !== undefined ||
            Object.keys(tem[key]).length !== 0
          ) {
            allElem = {
              ...allElem,
              [key]: tem[key],
            };
          }
        }
      });

      dataSet = {
        ...dataSet,
        data: JSON.stringify(allElem),
      };

      axios({
        method: 'put',
        url: api.onBoardCorporate.list,
        data: getFormData(dataSet),
        headers: {'Content-Type': 'multipart/form-data'},
      })
        .then(function (response) {
          //handle success
          if (response?.data?.status == '200') {
            toast.success('Details has been successfully verified');
            setTimeout(() => {
              window.location.href = `/dashboard`;
            }, 2000);
            // navigate('/dashboard')
            // window.location.href = (`/dashboard`);
          } else {
            toast.error('Something went wrong');
          }

          setshowbtn(true);
        })
        .catch(function (response) {
          //handle error
          toast.error('Something went wrong');
          setshowbtn(true);
        });
    }
  };
  function myGetData(d) {
    if (d?.tempaccountNumber && d?.tempaccountNumber == d?.accountNumber) {
      setshowTick(true);
    } else {
      setshowTick(false);
    }
    if (d?.ifscCode != mytempifsc && d?.ifscCode?.length == 11) {
      var instance = axios.create();
      delete instance?.defaults?.headers?.common['vtt_user_signature'];
      instance
        .get(`https://ifsc.razorpay.com/${d?.ifscCode}`)
        .then((r) => {
          if (r?.data) {
            setMytempifsc(r?.data?.IFSC);
            setbranchData(r?.data?.BRANCH);
            setbankNameVal(r?.data?.BANK);
          } else {
            setMytempifsc(null);
            setbranchData(null);
            setbankNameVal(null);
          }
        })
        .catch((er) => {
          setMytempifsc(null);
          setbranchData('NA');
          setbankNameVal('NA');
        });
    }
    if (d?.ifscCode?.length != 11) {
      setbranchData('');
    }

    if (
      myFormData?.mobileNo != d?.mobileNo ||
      myFormData?.emailId != d?.emailId
    ) {
      setmyFormData({emailId: d?.emailId, mobileNo: d?.mobileNo});
    }
  }
  function verifyOTP(val) {
    setshowbtn(false);
    if (val?.data?.enterOTP == myOtp) {
      setTimeout(() => {
        setshowbtn(true);
      }, 400);
      // toast.success(
      //   (verifyType == 'MOB' ? 'Mobile Number' : 'Email Id') +
      //     ' verified successfully.',
      // );
      toast.success('Your profile has been verified successfully');
      setLastVerifiedData({
        mob: verifyType == 'MOB' ? val?.data?.enterEmail : lastverifiedData.mob,
        email:
          verifyType == 'MOB' ? lastverifiedData.email : val?.data?.enterEmail,
      });
    } else {
      setTimeout(() => {
        setshowbtn(true);
      }, 400);
      toast.error('OTP did not match.');
      return;
    }
    setVerifyType('');
    setVerifyData('');
    setmyOtp('');
  }

  function SecretFun(search, value) {
    if (search?.toUpperCase() == ' VERIFY') {
      setVerifyType('MOB');
      setOtpLoader(true);
      var instance = axios.create();
      delete instance?.defaults?.headers?.common['vtt_user_signature'];
      instance
        .get(
          api.baseUri + '/usernotify/notification/singlesms/' + value?.mobileNo,
        )
        .then((ele) => {
          if (ele?.data) {
            setOtpLoader(false);
            setVerifyData(value?.mobileNo);
            setmyOtp(ele?.data?.split(' ')[0]?.trim());
          }
        })
        .catch((err) => {});
    } else if (search?.toUpperCase() == 'VERIFY ') {
      setVerifyType('EMAIL');
      setOtpLoader(true);
      var instance = axios.create();
      delete instance?.defaults?.headers?.common['vtt_user_signature'];
      instance
        .get(
          api.baseUri +
            '/user-reg/employee-request/savenewdata/' +
            value?.emailId,
        )
        .then((ele) => {
          if (ele?.data) {
            setOtpLoader(false);
            setVerifyData(value?.emailId);
            setmyOtp(ele?.data?.data?.password);
          }
        })
        .catch((err) => {});
    } else return;
  }
  return (
    <>
      {data && data.id && (
        <>
          {!showbtn ? <AppLoader /> : null}
          <Steppers
            defaultValues={data}
            template={stepperTemplate}
            getOnInput={myGetData}
            SecretFun={SecretFun}
            setSuccessIcon={[
              {name: 'accountNumber', value: showTick},
              {
                name: 'mobileNo',
                value:
                  myFormData?.mobileNo &&
                  myFormData?.mobileNo == lastverifiedData?.mob,
              },
              {
                name: 'emailId',
                value:
                  myFormData?.emailId &&
                  myFormData?.emailId == lastverifiedData?.email,
              },
            ]}
            clearErr={[
              {
                name: 'branchName',
                value: branchData && branchData?.toUpperCase() != 'NA',
              },
              {
                name: 'bankName',
                value: bankNameVal && bankNameVal?.toUpperCase() != 'NA',
              },
              {name: 'accountNumber', value: showTick, rr: bankNameVal},
              {
                name: 'mobileNo',
                value:
                  myFormData?.mobileNo == lastverifiedData?.mob ||
                  currentStep != 2,
              },
              {
                name: 'emailId',
                value:
                  myFormData?.emailId == lastverifiedData?.email ||
                  currentStep != 2,
              },
            ]}
            setVal={[
              {name: 'branchName', value: branchData},
              {name: 'bankName', value: bankNameVal},
              {
                name: 'tempcompanyAddressOne',
                value: data?.companyAddress?.addressName?.split('++')[0],
              },
              {
                name: 'tempcompanyAddressOneAREA',
                value: data?.companyAddress?.addressName?.split('++')[1],
              },
              {
                name: 'tempcompanyAddresstown',
                value: data?.companyAddress?.city,
              },
              {
                name: 'tempcompanyAddressstate',
                value: data?.companyAddress?.state,
              },
              {
                name: 'tempcompanyAddresspincode',
                value: data?.companyAddress?.pinCode,
              },
            ]}
            icons={{
              1: <DomainIcon />,
              2: <HomeIcon />,
              3: <PersonIcon />,
              4: <AccountBalanceIcon />,
            }}
            myCurrentStep={myCurrentStep}
            seterrors={[
              {
                name: 'branchName',
                type: 'customized',
                message: 'Please enter valid IFSC.',
                error: branchData?.toUpperCase() == 'NA',
              },
              {
                name: 'bankName',
                type: 'customized',
                message: 'Please enter valid IFSC.',
                error: bankNameVal?.toUpperCase() == 'NA',
              },
              {
                name: 'mobileNo',
                type: 'customized',
                message: 'Mobile number is not verified.',
                error:
                  currentStep == 2 &&
                  myFormData?.mobileNo?.length == 10 &&
                  myFormData?.mobileNo != lastverifiedData?.mob,
              },
              {
                name: 'emailId',
                type: 'customized',
                message: 'Email Id is not verified.',
                error:
                  currentStep == 2 &&
                  myFormData?.emailId?.includes('@') &&
                  myFormData?.emailId != lastverifiedData?.email,
              },
            ]}
            showbtn={showbtn}
            afterSubmit={handleSubmit}
          />
        </>
      )}

      {otpLoader == true ? <AppLoader /> : null}
      {verifyType && verifyData ? (
        <Dialog
          onClose={() => {
            setOtpLoader(false);
            setOtpLoader(false);
            setVerifyType('');
            setVerifyData('');
            setmyOtp('');
          }}
          open={true}
          maxWidth='false'
          PaperProps={{
            sx: {
              width: '35%',
            },
          }}
          style={{borderRadius: '4rem'}}
        >
          <DialogTitle style={{background: '#f5f2f2'}}>
            <h1>Verify {verifyType == 'MOB' ? 'Mobile No' : 'Email Id'}</h1>
            <CloseIcon
              onClick={() => {
                setOtpLoader(false);
                setOtpLoader(false);
                setVerifyType('');
                setVerifyData('');
                setmyOtp('');
              }}
              style={{
                top: '14px',
                cursor: 'pointer',
                position: 'absolute',
                right: '12px',
              }}
            />
          </DialogTitle>
          <DialogContent>
            <SmartForm
              template={template}
              defaultValues={{enterEmail: verifyData}}
              onSubmit={verifyOTP}
              buttons={['submit']}
              success={showbtn}
            />
            {/* <CreateRosterSetting verifyType={verifyType} setVerifyType={setVerifyType} /> */}
          </DialogContent>
        </Dialog>
      ) : null}
    </>
  );
};

export default EditForm;
