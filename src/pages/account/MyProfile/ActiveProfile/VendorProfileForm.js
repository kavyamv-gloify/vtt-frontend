/* eslint-disable */
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Steppers from '@smart-form/stepper';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import api from '@api';
import Api from '@api';
import regex from '@regex';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {toast} from 'react-toastify';
import AppLoader from '@crema/core/AppLoader';
import _ from 'lodash';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PersonIcon from '@mui/icons-material/Person';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import SmartForm from '@smart-form';
import {Dialog, DialogContent, DialogTitle} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
const VendorProfileInfo = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [showbtn, setshowbtn] = React.useState(true);
  const {id} = useParams();
  const {user} = useAuthUser();
  const [showTick, setshowTick] = React.useState();
  const [mytempifsc, setMytempifsc] = React.useState();
  const [branchData, setbranchData] = React.useState();
  const [bankNameVal, setbankNameVal] = React.useState();

  const [verifyType, setVerifyType] = useState('');
  const [verifyData, setVerifyData] = useState('');
  const [lastverifiedData, setLastVerifiedData] = useState({
    mob: '',
    email: '',
  });
  const [myOtp, setmyOtp] = useState();
  const [myFormData, setmyFormData] = useState({});
  const [currentStep, setCurrentStep] = useState(false);

  const myCurrentStep = (currStep) => {
    setCurrentStep(currStep);
  };
  // if (user?.userList?.userStatus == "ACTIVE") { navigate(`/dashboard`) }

  useEffect(() => {
    // if (user?.userList?.userStatus && user?.userList?.userStatus != "DEFAULT") { navigate('/dashboard') }
    if (user?.userList?.userStatus && user?.userList?.userStatus != 'ACTIVE') {
      navigate('/dashboard');
    }

    async function fetchData() {
      const baseURL = `${api.vendor.list}/${user.userList.profileId}`;
      axios
        .get(`${baseURL}`)
        .then((res) => {
          setData(res?.data?.data);
          setLastVerifiedData({
            mob: res?.data?.data?.mobileNo,
            email: res?.data?.data?.emailId,
          });
        })
        .catch((err) => {});
    }
    fetchData();
  }, [user.userList.profileId]);

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
        title: 'Vendor Details',
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
                  type: 'hidden',
                  name: 'tenantId',
                  id: 'tenantId',
                  defaultValue: user?.userList?.tanentId,
                },
                {
                  type: 'hidden',
                  name: 'tenantCode',
                  id: 'tenantCode',
                  defaultValue: user?.userList?.tanentCode,
                },
                {
                  type: 'hidden',
                  name: 'tenantName',
                  id: 'tenantName',
                  defaultValue: user?.userList?.tanentName,
                },
                // {
                //   type: 'autocomplete',
                //   name: 'bankNameTemp22',
                //   options: bankList,
                //   // defaultValue: data?.bankCode,
                //   object: {
                //     filter: ['code']
                //   },
                //   id: 'bankNameTemp22',
                //   title: 'Bank Name',
                //   // pattern: {
                //   //   value: regex.maxSize30,
                //   //   message: 'Please enter valid bank Name'
                //   // },
                //   validationProps: {
                //     booleanrequired: 'This is a mandatory field'
                //   },
                // },
                {
                  type: 'text',
                  name: 'vendorName',
                  id: 'vendorName',
                  title: 'Vendor Name',
                  disabled: false,
                  pattern: {
                    value: regex.alphaReg,
                    message:
                      'Please enter valid Vendor Name with max 50 characters',
                  },
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },
                {
                  type: 'file',
                  name: 'vendorPhoto',
                  id: 'vendorPhoto',
                  title: 'Upload logo',
                  accept: '.jpg,.jpeg,.png,.pdf,.doc,.docx',
                  tempFilename: data?.vendorPhoto,
                  validationProps: {
                    required: 'This is a mandatory field',
                    size: {
                      value: 5,
                      message: 'File size should not be more than 5 mb.',
                    },
                  },
                },
                {
                  type: 'text',
                  name: 'vendorCode',
                  id: 'vendorCode',
                  title: 'Vendor Code',
                  disabled: false,
                  pattern: {
                    value: regex.maxSize50,
                    message: 'Please enter valid code with max 50 characters',
                  },
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },
                {
                  type: 'text',
                  name: 'vendorType',
                  id: 'vendorType',
                  title: 'Vendor Service Area',
                  pattern: {
                    value: regex.maxSize50,
                    message:
                      'Please enter valid Vendor service area with max 50 characters',
                  },
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },
                // {
                //   type: "section",
                //   layout: { column: 2, spacing: 2, size: 'medium', label: 'fixed' },
                //   fields: [
                //     {
                //       type: 'select',
                //       name: 'addressProofDocTpye',
                //       id: 'addressProofDocTpye',
                //       title: 'Address Proof Tpye',
                //       validationProps: {
                //         required: 'This is a mandatory field'
                //       },
                //       options: [
                //         { title: 'Aadhar', value: 'aadar' },
                //         { title: 'PAN', value: 'PAN' },
                //       ]
                //     },
                //     {
                //       type: 'file',
                //       name: 'addressProofDoc',
                //       id: 'addressProofDoc',
                //       title: 'Upload Document',
                //       validationProps: {
                //         required: 'This is a mandatory field'
                //       }
                //     },
                //   ]
                // },

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
                      pattern: {
                        value: regex.panReg,
                        message: 'Please enter valid PAN No.',
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
                      accept: '.jpg,.jpeg,.png,.pdf,.doc,.docx',
                      tempFilename: data?.companyPanDoc?.split('/')[2],
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
                // {
                //   type: "section",
                //   layout: { column: 2, spacing: 2, size: 'medium', label: 'fixed' },
                //   fields: [
                //     {
                //       type: 'select',
                //       name: 'identityProofDocTpye',
                //       id: 'identityProofDocTpye',
                //       title: 'Identity Proof Tpye',
                //       validationProps: {
                //         required: 'This is a mandatory field'
                //       },
                //       options: [
                //         { title: 'Aadhar', value: 'aadar' },
                //         { title: 'PAN', value: 'PAN' },
                //       ]
                //     },
                //     {
                //       type: 'file',
                //       name: 'identityProofDoc',
                //       id: 'identityProofDoc',
                //       title: 'Upload Document',
                //       validationProps: {
                //         required: 'This is a mandatory field'
                //       }
                //     },
                //   ]
                // },
                // {
                //   type: 'map',
                //   name: 'address',
                //   id: 'address',
                //   title: 'Address (Site Office)',
                // },
                {
                  type: 'text',
                  name: 'tempaddress',
                  id: 'tempaddress',
                  title: 'Flat, House No., Building, Company, Apartment',
                  pattern: {
                    value: regex.addressReg,
                    message:
                      'Please enter valid address with max 100 characters ',
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
                    value: regex.addressReg,
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
                  title: 'Town/City(Residence)',
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
                  title: 'Pincode (Residence)',
                  pattern: {
                    value: regex.pincodeRegex,
                    message: 'Please enter valid Pincode',
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
                  pattern: {
                    value: regex.char50,
                    message:
                      'Please enter valid First name with max 50 characters',
                  },
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },
                {
                  type: 'text',
                  name: 'contactPersonLastName',
                  id: 'contactPersonLastName',
                  title: ' Last Name',
                  pattern: {
                    value: regex.char50,
                    message:
                      'Please enter valid Last name with max 50 characters',
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
                      buttonFor: 'emailId',
                      name: 'verify',
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
                      buttonFor: 'mobileNo',
                      id: 'verify ',
                      title: ' Verify',
                      defaultValue: 'verify',
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
                    'Ex- XYZ Sharma',
                  ],

                  pattern: {
                    value: regex.char50,
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
                  title: 'Bank Account No.',
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
                  maxChar: 11,
                  isUpper: true,
                  infoMessage: [
                    'Alphanumeric characters are allowed',
                    'Maximum length should be 11 characters',
                    'e.g.: SBINOOO1234',
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
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },
                // {
                //     type: 'text',
                //     name: 'bankName',
                //     id: 'bankName',
                //     title: 'Bank Name',
                //     pattern: {
                //         value: regex.maxSize30,
                //         message: 'Please enter valid bank Name'
                //     },
                //     validationProps: {
                //         required: 'This is a mandatory field'
                //     }
                // },
                // {
                //     type: 'text',
                //     name: 'bankCode',
                //     id: 'bankCode',
                //     title: 'Bank Code',
                //     pattern: {
                //         value: regex.maxSize30,
                //         message: 'Please enter valid bank code'
                //     },
                //     validationProps: {
                //         required: 'This is a mandatory field'
                //     }
                // },
                // {
                //   type: 'autocomplete',
                //   name: 'bankNameTemp',
                //   options: bankList,
                //   defaultValue: data?.bankCode,
                //   object: {
                //     filter: ['code']
                //   },
                //   id: 'bankNameTemp',
                //   title: 'Bank Name',
                //   // pattern: {
                //   //   value: regex.maxSize30,
                //   //   message: 'Please enter valid bank Name'
                //   // },
                //   validationProps: {
                //     booleanrequired: 'This is a mandatory field'
                //   },
                // },
                // {
                //   type: 'hidden',
                //   name: 'bankName',
                //   id: 'bankName',
                //   from: 'bankNameTemp.name'
                // },
                // {
                //   type: 'hidden',
                //   name: 'bankCode',
                //   id: 'bankCode',
                //   from: 'bankNameTemp.code'
                // },
                {
                  type: 'text',
                  name: 'branchName',
                  id: 'branchName',
                  title: 'Branch Name',
                  infoMessage: [
                    'Branch name should be autofetched through IFSC code',
                  ],
                  disabled: true,
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                  // setVal:branchData,
                  // pattern: {
                  //   value: regex.maxSize150,
                  //   message: 'Please enter valid branch Name'
                  // },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
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

  const handleSubmit = async (values) => {
    setshowbtn(false);
    if (values.button.toUpperCase() === 'SUBMIT') {
      let dataSet = {};
      let allElem = {};
      let tem = values?.data;
      tem.address = {
        addressName:
          values?.data?.tempaddress + '++' + values?.data?.tempaddressAREA,
        pinCode: values?.data?.temppincode,
        state: values?.data?.tempstate,
        city: values?.data?.temptown,
      };
      tem.vendorId = values?.data?.id;
      tem.profileStatus = 'ACTIVE';
      delete tem.tempaddressAREA;
      delete tem.tempaddress;
      if (tem.temptown) delete tem.temptown;
      if (tem.tempstate) delete tem.tempstate;
      if (tem.temppincode) delete tem.temppincode;

      if (tem?.bankNameTemp) delete tem.bankNameTemp;
      if (!tem?.pandoc?.length) delete tem.pandoc;

      delete tem.associatedWith;
      delete tem.tempaccountNumber;

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
        url: api.vendor.changeRequest,
        data: getFormData(dataSet),
        headers: {'Content-Type': 'multipart/form-data'},
      })
        .then((response) => {
          if (response?.data?.status == '200') {
            toast.success('Your profile update request submitted successfully');
            window.location.href = `/dashboard`;
            // navigate(`/dashboard`);
            //
          } else {
            setshowbtn(true);
            toast.error('Something went wrong');
          }
        })
        .catch(function (response) {
          toast.error('Something went wrong');
          //handle error
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

  function SecretFun(search, value) {
    if (search?.toUpperCase() == ' VERIFY') {
      setVerifyType('MOB');
      var instance = axios.create();
      delete instance?.defaults?.headers?.common['vtt_user_signature'];
      instance
        .get(
          Api.baseUri + '/usernotify/notification/singlesms/' + value?.mobileNo,
        )
        .then((ele) => {
          if (ele?.data) {
            setVerifyData(value?.mobileNo);
            setmyOtp(ele?.data?.split(' ')[0]?.trim());
          }
        })
        .catch((err) => {});
    } else if (search?.toUpperCase() == 'VERIFY ') {
      setVerifyType('EMAIL');
      var instance = axios.create();
      delete instance?.defaults?.headers?.common['vtt_user_signature'];
      instance
        .get(
          Api.baseUri +
            '/user-reg/employee-request/savenewdata/' +
            value?.emailId,
        )
        .then((ele) => {
          if (ele?.data) {
            setVerifyData(value?.emailId);
            setmyOtp(ele?.data?.data?.password);
          }
        })
        .catch((err) => {});
    } else return;
  }

  return (
    <>
      {!showbtn ? <AppLoader /> : null}
      {data && data.id && (
        <Steppers
          defaultValues={data}
          template={stepperTemplate}
          // watchFields={['firstname', 'include_portfolio', 'email', 'country']}
          // validate={validate}
          getOnInput={myGetData}
          SecretFun={SecretFun}
          clearErr={[
            {
              name: 'branchName',
              value:
                currentStep < 3 ||
                (branchData && branchData?.toUpperCase() != 'NA'),
            },
            {
              name: 'bankName',
              value:
                currentStep < 3 ||
                (bankNameVal && bankNameVal?.toUpperCase() != 'NA'),
            },
            {name: 'accountNumber', value: showTick, rr: bankNameVal},
            {
              name: 'mobileNo',
              value: myFormData?.mobileNo == lastverifiedData?.mob,
            },
            {
              name: 'emailId',
              value: myFormData?.emailId == lastverifiedData?.email,
            },
          ]}
          setVal={[
            {name: 'branchName', value: branchData},
            {name: 'bankName', value: bankNameVal},
            {name: 'tempaccountNumber', value: data?.accountNumber},
            {
              name: 'tempaddress',
              value: data?.address?.addressName?.split('++')[0],
            },
            {
              name: 'tempaddressAREA',
              value: data?.address?.addressName?.split('++')[1],
            },
            {name: 'temptown', value: data?.address?.city},
            {name: 'tempstate', value: data?.address?.state},
            {name: 'temppincode', value: data?.address?.pinCode},
          ]}
          // setSuccessIcon={[]}
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
          seterrors={[
            {
              name: 'branchName',
              type: 'customized',
              message: 'Please enter valid IFSC.',
              error: branchData?.toUpperCase() == 'NA' && currentStep == 3,
            },
            {
              name: 'bankName',
              type: 'customized',
              message: 'Please enter valid IFSC.',
              error: bankNameVal?.toUpperCase() == 'NA' && currentStep == 3,
            },
            {
              name: 'mobileNo',
              type: 'customized',
              message: 'Mobile number is not verified.',
              error:
                myFormData?.mobileNo?.length == 10 &&
                myFormData?.mobileNo != lastverifiedData?.mob,
            },
            {
              name: 'emailId',
              type: 'customized',
              message: 'Email Id is not verified.',
              error:
                myFormData?.emailId?.includes('@') &&
                myFormData?.emailId != lastverifiedData?.email,
            },
          ]}
          myCurrentStep={myCurrentStep}
          // clearErr={[]}
          showbtn={showbtn}
          afterSubmit={handleSubmit}
          icons={{
            1: <PersonPinIcon />,
            2: <PersonIcon />,
            3: <AccountBalanceIcon />,
          }}
        />
      )}

      {verifyType && verifyData ? (
        <Dialog
          onClose={() => {
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

export default VendorProfileInfo;
