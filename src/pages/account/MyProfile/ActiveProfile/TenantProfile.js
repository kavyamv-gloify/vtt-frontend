/* eslint-disable */
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Steppers from '@smart-form/stepper';
import {useDispatch, useSelector} from 'react-redux';
import {onAddNewTenent} from 'redux/actions';
import regex from '@regex';
import api from '@api';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import Api from '@api';
import {toast} from 'react-toastify';
import AppLoader from '@crema/core/AppLoader';
import {useAuthUser} from '@crema/utility/AuthHooks';
import DomainIcon from '@mui/icons-material/Domain';
import PersonIcon from '@mui/icons-material/Person';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import {Dialog, DialogContent, DialogTitle} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SmartForm from '@smart-form';

const TenantAdminInfo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {user} = useAuthUser();
  const [data, setData] = useState({});
  const [showbtn, setshowbtn] = React.useState(true);
  const [mytempifsc, setMytempifsc] = React.useState();
  const [branchData, setbranchData] = React.useState();
  const [showTick, setshowTick] = React.useState();
  const [bankNameVal, setbankNameVal] = React.useState();
  const [layoutChange, setLayoutChange] = useState([]);
  const [lastverifiedData, setLastVerifiedData] = useState({});
  const [myFormData, setmyFormData] = useState({});
  const [currentStep, setCurrentStep] = useState(false);
  const [otpLoader, setOtpLoader] = useState(false);
  const [verifyType, setVerifyType] = useState();
  const [verifyData, setVerifyData] = useState();
  const [myOtp, setmyOtp] = useState();
  const myCurrentStep = (currStep) => {
    setCurrentStep(currStep);
  };
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
  useEffect(() => {
    if (user?.userList?.userStatus && user?.userList?.userStatus != 'ACTIVE') {
      navigate('/dashboard');
    }
    async function fetchData() {
      const baseURL = `${api.onBoardTenant.list}/${user?.userList?.profileId}`;
      let response = await axios.get(`${baseURL}`);

      let tempo = response?.data?.data;
      tempo.tempaddress =
        response?.data?.data?.companyAddress?.addressName?.split('++')?.[0];
      tempo.tempaddressAREA =
        response?.data?.data?.companyAddress?.addressName?.split('++')?.[1];
      tempo.temptown = response?.data?.data?.companyAddress?.city;
      tempo.tempstate = response?.data?.data?.companyAddress?.state;
      tempo.temppincode = response?.data?.data?.companyAddress?.pinCode;
      tempo.tempaccountNumber = tempo?.accountNumber;
      let temDomains = [];
      response?.data?.data?.domains?.map((e) => {
        temDomains.push({Domains: e});
      });
      setLastVerifiedData({
        mob: response?.data?.data?.mobileNo,
        email: response?.data?.data?.emailId,
      });
      tempo.domains = temDomains;
      setData(tempo);
    }
    fetchData();
  }, [user.userList.profileId]);
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

  let stepperTemplate = {
    title: 'View and Update',
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
        title: 'Company Details',
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
                  infoMessage: [
                    'Only Alphabets are allowed',
                    'Maximum length should be 50 characters.',
                    'EX: TCS,Wipro,HCL etc...',
                  ],
                  disabled: false,
                  pattern: {
                    value: regex.companyreg,
                    message:
                      'Please enter valid Company Name with max 50 characters',
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
                      name: 'companyCode',
                      id: 'companyCode',
                      title: 'Company Code',
                      infoMessage: [
                        'Alphanumeric characters are allowed',
                        'Maximum length should be 50  characters',
                        'e.g.: Noida Sector 48, UP ',
                      ],
                      pattern: {
                        value: regex.charwithnum,
                        message:
                          'Please enter valid name with max 50 characters',
                      },
                      validationProps: {
                        required: 'This is a mandatory field',
                      },
                    },
                    {
                      type: 'file',
                      name: 'logodoc',
                      id: 'logodoc',
                      title: 'Company Logo',
                      tempFilename: data?.companyLogoDoc,
                      infoMessage: [
                        'Should only accept PDF,JPEG files',
                        'File should contain file extension',
                        'e.g.:Shub.jpeg',
                      ],
                      accept: 'image/*,.pdf,.doc,.docx',
                      validationProps: data?.companyLogoDoc
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

                // {
                //   type: 'text',
                //   name: 'domain',
                //   id: 'domain',
                //   title: 'Allowed Domains',
                //   infoMessage: ["Alphanumeric characters are allowed", "Maximum length should be 50  characters", "e.g.: @gmail.com "],
                //   pattern: {
                //     value: regex.maxSize50,
                //     message: 'Please enter valid code with max 50 characters'
                //   },
                //   validationProps: {
                //     required: 'This is a mandatory field'
                //   }
                // },
                {
                  type: 'text',
                  name: 'tempaddress',
                  id: 'tempaddress',
                  title: 'Flat, House No., Building, Apartment',
                  infoMessage: [
                    'Alphanumeric characters are allowed',
                    'Maximum length should be 50  characters',
                    'e.g.: Noida Sector 48, UP ',
                  ],
                  pattern: {
                    value: regex.addressReg,
                    message:
                      'Please enter valid building No, street with max 100 characters ',
                  },
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },
                {
                  type: 'text',
                  name: 'tempaddressAREA',
                  id: 'tempaddressAREA',
                  title: 'Area, Street, Sector, Village',
                  infoMessage: [
                    'Alphanumeric characters are allowed',
                    'Maximum length should be 250  characters',
                    'e.g.: Noida Sector 48, UP ',
                  ],
                  pattern: {
                    value: regex.maxSize250,
                    message:
                      'Please enter valid building No, street with max 250 characters ',
                  },
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },
                {
                  type: 'text',
                  name: 'temptown',
                  id: 'temptown',
                  title: 'Town/City',
                  infoMessage: [
                    'Alphabets are allowed',
                    'Maximum length should be 50  characters',
                    'e.g.: Noida ',
                  ],
                  pattern: {
                    value: regex.adreesschar50,
                    message:
                      'Please enter valid Town/City with max 50 characters',
                  },
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },
                {
                  type: 'text',
                  name: 'tempstate',
                  id: 'tempstate',
                  title: 'State ',
                  infoMessage: [
                    'Alphabets characters are allowed',
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
                  name: 'temppincode',
                  id: 'temppincode',
                  title: 'Pincode ',
                  infoMessage: [
                    'Numeric characters are allowed',
                    'Maximum length should be 6 characters',
                    'e.g.: 201301',
                  ],
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
                      pattern: {
                        value: regex.maxSize30,
                        message:
                          'Please enter valid Registration No. with max 30 characters',
                      },
                      validationProps: {
                        required: 'This is a mandatory field',
                      },
                    },
                    {
                      type: 'file',
                      name: 'regdoc',
                      id: 'regdoc',
                      title: 'Upload Document',
                      tempFilename: data?.companyRegDoc,
                      infoMessage: [
                        'Should only accept PDF,JPEG files',
                        'File should contain file extension',
                        'e.g.:Shub.jpeg',
                      ],
                      accept: 'image/*,.pdf,.doc,.docx',
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
                        message: 'Please enter valid GSTIN No.',
                      },
                      validationProps: {
                        required: 'This is a mandatory field',
                      },
                    },
                    {
                      type: 'file',
                      name: 'gstndoc',
                      id: 'gstndoc',
                      title: 'Upload Document',
                      tempFilename: data?.companyGstnDoc,
                      infoMessage: [
                        'Should only accept PDF,JPEG files',
                        'File should contain file extension',
                        'e.g.:Shub.jpeg',
                      ],
                      accept: 'image/*,.pdf,.doc,.docx',
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
                      infoMessage: [
                        'Alphanumeric characters are allowed',
                        'Maximum length should be 10 characters .',
                        'e.g.:BNZPM2501F',
                      ],
                      pattern: {
                        value: regex.panReg,
                        message: 'Please enter valid PAN No',
                      },
                      validationProps: {
                        required: 'This is a mandatory field',
                      },
                    },
                    {
                      type: 'file',
                      name: 'pandoc',
                      id: 'pandoc',
                      title: 'Upload Document',
                      tempFilename: data?.companyPanDoc,
                      infoMessage: [
                        'Should only accept PDF,JPEG files',
                        'File should contain file extension',
                        'e.g.:Shub.jpeg',
                      ],
                      accept: 'image/*,.pdf,.doc,.docx',
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

                {
                  type: 'array',
                  name: 'domains',
                  id: 'domains',
                  layout: {
                    column: 1,
                    spacing: 2,
                    size: 'small',
                    label: 'blank',
                    type: 'table',
                  },
                  columns: ['Domain'],
                  subFields: [
                    {
                      type: 'text',
                      name: 'Domains',
                      id: 'Domains',
                      title: 'Allowed Domains',
                      infoMessage: [
                        'Alphanumeric characters are allowed starting with @',
                        'Maximum length should be 50  characters',
                        'e.g.: @gmail.com ',
                      ],
                      pattern: {
                        value: regex.domainReg,
                        message:
                          'Please enter valid code with max 50 characters',
                      },
                      validationProps: {
                        required: 'This is a mandatory field',
                      },
                    },
                  ],
                },
                // {
                //   type: 'select',
                //   name: 'country',
                //   id: 'country',
                //   title: 'Country',
                //   options: [
                //     { title: 'India', value: 'ind' },
                //     { title: 'South Africa', value: 'sa' }
                //   ]
                // },
                // {
                //   type: 'radio',
                //   name: 'gender',
                //   id: 'gender',
                //   title: 'Gender',
                //   options: [{ title: "Male", value: "Male" }, { title: "Female", value: "Female" }, { title: "Others", value: "Others" }]
                // }
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
                  title: 'First Name',
                  infoMessage: [
                    'Only alphabets are allowed.',
                    'Maximum length should be 50 characters.',
                    'Ex-XYZ.',
                  ],
                  pattern: {
                    value: regex.char50,
                    message:
                      'Please enter valid First Name with max 50 characters',
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
                    message:
                      'Please enter valid Last Name with max 50 characters',
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
                      infoMessage: [
                        'Alphanumeric characters are allowed',
                        'Maximum length should be 30 characters & should include @',
                        'Should have domain name',
                        'e.g.: xyz45@gmail.com',
                      ],
                      title: 'Email Id',
                      pattern: {
                        value: regex.emailReg,
                        message: 'Please enter valid Email Id',
                      },
                      validationProps: {
                        required: 'This is a mandatory field',
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
                      infoMessage: [
                        'Numeric characters are allowed',
                        'Maximum length should be 10 characters',
                        'e.g.: 9058906780',
                      ],
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
                    message: 'Please enter valid Landline No.',
                  },
                  validationProps: {
                    manual: [
                      {
                        condition: `mobileNo != landLineNo`,
                        message: 'Landline should be different from mobileNo.',
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
      },
      {
        layout: {},
        title: 'Bank Details',
        buttons: ['submit'],
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
                  title: 'Account Holder Name',
                  infoMessage: [
                    'Only alphabets are allowed.',
                    'Maximum length should be 50 characters.',
                    'Ex-XYZ Sharma',
                  ],
                  pattern: {
                    value: regex.maxSize50,
                    message:
                      'Please enter valid Account Holder Name with max 50 characters',
                  },
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },
                {
                  type: 'password',
                  name: 'tempaccountNumber',
                  id: 'tempaccountNumber',
                  infoMessage: [
                    'Numeric characters are allowed',
                    'Maximum length should be 10 characters',
                    'e.g.: 9058906780',
                  ],
                  title: 'Bank Account No.',
                  pattern: {
                    value: regex.acountNoReg,
                    message: 'Please enter valid Bank Account No.',
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
                    message: 'Please enter valid Bank Account No.',
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
                  title: 'IFSC Code',
                  infoMessage: [
                    'Numeric characters are allowed',
                    'Maximum length should be 10 characters',
                    'e.g.: 9058906780',
                  ],
                  isUpper: true,
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
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
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

  const getFormData = (object) =>
    Object.keys(object).reduce((formData, key) => {
      formData.append(key, object[key]);
      return formData;
    }, new FormData());

  const handleChange = (values) => {};
  const handleSubmit = async (values) => {
    if (values.button.toUpperCase() === 'SUBMIT') {
      let dataSet = {};
      let allElem = {};
      let tem = values?.data;

      tem.companyAddress = {
        pinCode: values?.data?.temppincode,
        state: values?.data?.tempstate,
        city: values?.data?.temptown,
        addressName:
          values?.data?.tempaddress + '++' + values?.data?.tempaddressAREA,
      };

      let arr = [];
      tem.domains?.map((ele) => {
        arr.push(ele?.Domains);
      });
      tem.domains = arr;
      delete tem.Domains;
      // delete tem.companyCode;
      // delete tem.domain
      delete tem.tempaddress;
      delete tem.tempaddressAREA;
      delete tem.temppincode;
      delete tem.tempstate;
      delete tem.temptown;
      delete tem.bankNameTemp;
      if (!tem?.logodoc?.length) delete tem.logodoc;
      if (!tem?.regdoc?.length) delete tem.regdoc;
      if (!tem?.gstndoc?.length) delete tem.gstndoc;
      if (!tem?.pandoc?.length) delete tem.pandoc;
      delete tem.tempaccountNumber;
      tem.changeReqFlag = String(layoutChange);
      // if (!layoutChange?.length) { toast.error("Please do change for raising change request"); setshowbtn(true); return; }
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
        url: api.onBoardTenant.changeRequest,
        data: getFormData(dataSet),
        headers: {'Content-Type': 'multipart/form-data'},
      })
        .then(function (response) {
          if (response?.data?.status == '200') {
            toast.success('Your profile update request submitted successfully');
            setshowbtn(true);
            setTimeout(() => {
              window.location.href = `/dashboard`;
            }, 2000);
            // navigate('/dashboard');
          } else {
            setshowbtn(true);
            toast.error('Something went wrong');
          }
        })
        .catch(function (response) {
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
    if (
      myFormData?.mobileNo != d?.mobileNo ||
      myFormData?.emailId != d?.emailId
    ) {
      setmyFormData({emailId: d?.emailId, mobileNo: d?.mobileNo});
    }
    if (d?.ifscCode?.length != 11) {
      setbranchData('');
      setbankNameVal('');
    }
  }
  function verifyOTP(val) {
    setshowbtn(false);
    setTimeout(() => {
      setshowbtn(true);
    }, 400);
    if (val?.data?.enterOTP == myOtp) {
      toast.success(
        (verifyType == 'MOB' ? 'Mobile Number' : 'Email Id') +
          ' verified successfully.',
      );
      setLastVerifiedData({
        mob: verifyType == 'MOB' ? val?.data?.enterEmail : lastverifiedData.mob,
        email:
          verifyType == 'MOB' ? lastverifiedData.email : val?.data?.enterEmail,
      });
    } else {
      toast.error('OTP did not match.');
      return;
    }
    setVerifyType('');
    setVerifyData('');
    setmyOtp('');
  }
  // function SecretFun(title, v){   }
  function fetchLayoutData(rr, layout) {
    let templay = [];
    let sec = '';
    let formValue = rr;
    layout?.sections?.length &&
      layout?.sections[0]?.fields?.map((d) => {
        if (d.type != 'section') {
          if (d.type == 'file' && !formValue[d?.name]?.length) {
            formValue[d?.name] = null;
          }
          templay.push(d);
        } else {
          d?.fields?.map((f) => {
            if (f.type != 'section') {
              templay.push(f);
              if (f.type == 'file' && !formValue[f?.name]?.length) {
                formValue[f?.name] = null;
              }
            }
          });
        }
      });
    templay?.length &&
      templay.map((te) => {
        if (data[te?.name] != formValue[te?.name] && te?.type != 'hidden') {
          sec = layout?.sections?.length ? layout?.sections[0]?.id : '';
        }
      });
    let temArr = layoutChange;
    if (!temArr.includes(sec) && sec) {
      temArr.push(sec);
    }
    if (!sec) {
      const index = temArr.indexOf(layout?.sections[0]?.id);
      if (index > -1) {
        temArr.splice(index, 1);
      }
    }

    setLayoutChange(temArr);
  }

  return (
    <>
      {!showbtn ? <AppLoader /> : null}

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
      {data && data.id && (
        <Steppers
          defaultValues={data}
          template={stepperTemplate}
          fetchLayoutData={fetchLayoutData}
          getOnInput={myGetData}
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
          ]}
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
          afterSubmit={handleSubmit}
          icons={{
            1: <DomainIcon />,
            2: <PersonIcon />,
            3: <AccountBalanceIcon />,
          }}
          SecretFun={SecretFun}
          // buttons={['submit']}
          onChange={handleChange}
        />
      )}
    </>
  );
};

export default TenantAdminInfo;
