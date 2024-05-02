/* eslint-disable */
import React, {useEffect, useState} from 'react';
import {Alert, Snackbar} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import Steppers from '@smart-form/stepper';
import {getFormData} from '@hoc';
import {useAuthUser} from '@crema/utility/AuthHooks';
import regex from '@regex';
import axios from 'axios';
import api from '@api';
import {toast} from 'react-toastify';
import AppLoader from '@crema/core/AppLoader';
import _ from 'lodash';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PersonIcon from '@mui/icons-material/Person';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import {Button} from '@mui/material';
import Api from '@api';

const RegisterVendor = ({close}) => {
  const navigate = useNavigate();
  const [showbtn, setshowbtn] = React.useState(true);
  // const [showSnack, setshowSnack] = React.useState(true);
  const [showTick, setshowTick] = React.useState();
  const {user} = useAuthUser();
  const [mytempifsc, setMytempifsc] = React.useState();
  const [branchData, setbranchData] = React.useState();
  const [bankNameVal, setbankNameVal] = React.useState();
  const [mobileExists, setMobileExists] = useState(false);
  const [mobileNo, setMobileNo] = useState();
  const [emailExists, setEmailExists] = useState(false);
  const [email, setEmail] = useState();
  const CorpId =
    user?.role == 'CORPORATEADMIN'
      ? user?.userList?.profileId
      : user?.userList?.corporateId;
  let stepperTemplate = {
    title: 'Register Vendor Details',
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
                      name: 'vendorName',
                      id: 'vendorName',
                      title: 'Vendor Name',
                      disabled: false,
                      infoMessage: [
                        'Only alphabets are allowed.',
                        'Maximum length should be 50 characters.',
                        'Field is mandatory.',
                      ],
                      pattern: {
                        value: regex.char50,
                        message:
                          'Please enter valid Vendor name with max 50 characters',
                      },
                      validationProps: {
                        required: 'This is a mandatory field',
                      },
                    },
                    {
                      type: 'file',
                      name: 'vendorPhoto',
                      id: 'vendorPhoto',
                      title: 'Upload Logo',
                      infoMessage: [
                        'Should only accept PDF,JPEG files',
                        'File should contain file extension',
                        'e.g.:Shub.jpeg',
                      ],
                      accept: 'image/*,.pdf,.doc,.docx',
                      //   accept: '.jpg,.jpeg,.png,.pdf,.doc,.docx',
                      //   tempFilename: (data?.companyPanDoc)?.split('/')[2],
                      validationProps: {
                        // required: !(data?.companyPanDoc) ? 'This is a mandatory field' : false,
                        size: {
                          value: 5,
                          message: 'File size should not be more than 5 mb.',
                        },
                      },
                    },
                  ],
                },

                {
                  type: 'text',
                  name: 'vendorCode',
                  id: 'vendorCode',
                  title: 'Vendor Code',
                  infoMessage: [
                    'Alphanumerics characters are allowed.',
                    'Maximum length should be 30 characters.',
                    'EX-GDH4',
                  ],
                  disabled: false,
                  pattern: {
                    value: regex.maxSize30,
                    message:
                      'Please enter valid Vendor code with max 30 characters',
                  },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },
                {
                  type: 'text',
                  name: 'vendorType',
                  id: 'vendorType',
                  title: 'Vendor Service Area',
                  infoMessage: [
                    'Only alphabets are allowed.',
                    'Maximum length should be 50 characters.',
                    'Field is mandatory.',
                  ],

                  pattern: {
                    value: regex.char30,
                    message:
                      'Please enter valid Vendor Service Area with max 30 characters',
                  },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
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
                      maxChar: 10,
                      isUpper: true,
                      title: 'PAN No.',
                      infoMessage: [
                        'Alphanumeric characters are allowed',
                        'Maximum length should be 10 characters .',
                        'e.g.:BNZPM2501F',
                      ],
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
                      infoMessage: [
                        'Should only accept PDF,JPEG files',
                        'File should contain file extension',
                        'e.g.:Shub.jpeg',
                      ],
                      accept: 'image/*,.pdf,.doc,.docx',
                      //   accept: '.jpg,.jpeg,.png,.pdf,.doc,.docx',
                      //   tempFilename: (data?.companyPanDoc)?.split('/')[2],
                      validationProps: {
                        // required: !(data?.companyPanDoc) ? 'This is a mandatory field' : false,
                        size: {
                          value: 5,
                          message: 'File size should not be more than 5 mb.',
                        },
                      },
                    },
                  ],
                },

                // {
                //     type: "section",
                //     layout: { column: 2, spacing: 2, size: 'medium', label: 'fixed' },
                //     fields: [
                //         {
                //             type: 'text',
                //             name: "companyRegNo",
                //             id: 'companyRegNo',
                //             title: 'Registration Number',
                //             pattern: {
                //                 value: regex.maxSize30,
                //                 message: 'Please enter valid PAN number'
                //             },
                //             // validationProps: {
                //             //   required: 'This is a mandatory field'
                //             // }
                //         },
                //         {
                //             type: 'file',
                //             name: 'regfile',
                //             id: 'regfile',
                //             title: 'Upload Document',
                //             accept: 'image/*,.pdf,.doc,.docx',
                //             //   accept: '.jpg,.jpeg,.png,.pdf,.doc,.docx',
                //             //   tempFilename: (data?.companyPanDoc)?.split('/')[2],
                //             validationProps: {
                //                 // required: !(data?.companyPanDoc) ? 'This is a mandatory field' : false,
                //                 size: {
                //                     value: 5,
                //                     message: 'File size should not be more than 5 mb.'
                //                 },
                //             }
                //         },
                //     ]
                // },

                // {
                //     type: "section",
                //     layout: { column: 2, spacing: 2, size: 'medium', label: 'fixed' },
                //     fields: [
                //         {
                //             type: 'text',
                //             name: "companyGSTN",
                //             id: 'companyGSTN',
                //             title: 'GST Number',
                //             pattern: {
                //                 value: regex.maxSize30,
                //                 message: 'Please enter valid PAN number'
                //             },
                //             // validationProps: {
                //             //   required: 'This is a mandatory field'
                //             // }
                //         },
                //         {
                //             type: 'file',
                //             name: 'gstnfile',
                //             id: 'gstnfile',
                //             title: 'Upload Document',
                //             accept: 'image/*,.pdf,.doc,.docx',
                //             //   accept: '.jpg,.jpeg,.png,.pdf,.doc,.docx',
                //             //   tempFilename: (data?.companyPanDoc)?.split('/')[2],
                //             validationProps: {
                //                 // required: !(data?.companyPanDoc) ? 'This is a mandatory field' : false,
                //                 size: {
                //                     value: 5,
                //                     message: 'File size should not be more than 5 mb.'
                //                 },
                //             }
                //         },
                //     ]
                // },

                // {
                //     type: "section",
                //     layout: { column: 2, spacing: 2, size: 'medium', label: 'fixed' },
                //     fields: [
                //         {
                //             type: 'text',
                //             name: "companyRegNo",
                //             id: 'companyRegNo',
                //             title: 'Registration Number',
                //             pattern: {
                //                 value: regex.maxSize30,
                //                 message: 'Please enter valid PAN number'
                //             },
                //             // validationProps: {
                //             //   required: 'This is a mandatory field'
                //             // }
                //         },
                //         {
                //             type: 'file',
                //             name: 'regfile',
                //             id: 'regfile',
                //             title: 'Upload Document',
                //             accept: 'image/*,.pdf,.doc,.docx',
                //             //   accept: '.jpg,.jpeg,.png,.pdf,.doc,.docx',
                //             //   tempFilename: (data?.companyPanDoc)?.split('/')[2],
                //             validationProps: {
                //                 // required: !(data?.companyPanDoc) ? 'This is a mandatory field' : false,
                //                 size: {
                //                     value: 5,
                //                     message: 'File size should not be more than 5 mb.'
                //                 },
                //             }
                //         },
                //     ]
                // },
                {
                  type: 'text',
                  name: 'tempaddress',
                  id: 'tempaddress',
                  title: 'Flat, House No., Building, Apartment',
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
                  infoMessage: [
                    'Alphanumeric characters are allowed',
                    'Maximum length should be 50  characters',
                    'e.g.: Noida ',
                  ],
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
                  name: 'tempstate',
                  id: 'tempstate',
                  title: 'State',
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
                  name: 'temppincode',
                  id: 'temppincode',
                  isNumber: true,
                  maxChar: 6,
                  title: 'Pincode',
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
                    'Ex-Sharma',
                  ],
                  disabled: false,
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
                  type: 'text',
                  name: 'emailId',
                  id: 'emailId',
                  title: 'Email Id',
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
                  },
                },
                {
                  type: 'text',
                  name: 'mobileNo',
                  id: 'mobileNo',
                  title: 'Mobile No.',
                  isNumber: true,
                  maxChar: 10,
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

  function handleBank() {
    alert('hii');
  }

  const handleSubmit = (values) => {
    if (values?.data?.accountNumber != values?.data?.tempaccountNumber) {
      setshowbtn(true);
      return;
    }
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
      tem.profileStatus = 'DEFAULT';
      tem.corporateid = CorpId;
      delete tem.tempaddressAREA;
      delete tem.tempaddress;
      if (tem.temptown) delete tem.temptown;
      if (tem.tempstate) delete tem.tempstate;
      if (tem.temppincode) delete tem.temppincode;

      if (tem?.bankNameTemp) delete tem.bankNameTemp;
      if (!tem?.pandoc?.length) delete tem.pandoc;

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
        url: api.vendor.list,
        data: getFormData(dataSet),
        headers: {'Content-Type': 'multipart/form-data'},
      })
        .then(function (response) {
          if (response?.data?.status == '200') {
            // toast.success('Details has been successfully submitted.');
            toast.success(
              `${response?.data?.data?.vendorName}'s created successfully`,
            );
            close(false);
            navigate(`/onboardadmin/vendor/vendor-listing/Def`);
          } else {
            setshowbtn(true);
            toast.error(response?.data?.message ?? 'Something went wrong');
          }
        })
        .catch(function (response) {
          toast.error('Something went wrong');
          //handle error
          setshowbtn(true);
        });
    }
  };

  async function checkMobile(mob) {
    let r = await axios.get(
      `${Api?.baseUri}/userauth/user-account/${mob}/mobile`,
    );
    if (r?.data == 'User Present') return false;
    else return true;
  }
  async function checkEmail(email) {
    let r = await axios.get(
      `${Api?.baseUri}/userauth/user-account/${email}/email`,
    );
    if (r?.data == 'User Present') return false;
    else return true;
  }

  async function myGetData(d) {
    setMobileNo(d?.mobileNo);
    setEmail(d?.emailId);
    if (d?.mobileNo && d?.mobileNo?.length == 10 && mobileNo != d?.mobileNo) {
      let temCheck = await checkMobile(d?.mobileNo);
      if (!temCheck) {
        setMobileExists(true);
      } else {
        setMobileExists(false);
      }
    }
    if (!d?.mobileNo || d?.mobileNo?.length != 10) {
      setMobileExists(false);
    }

    if (d?.emailId && email != d?.emailId) {
      let temCheck = await checkEmail(d?.emailId);
      if (!temCheck) {
        setEmailExists(true);
      } else {
        setEmailExists(false);
      }
    }
    if (!d?.emailId) {
      setEmailExists(false);
    }

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
  }
  // const sampleData = { "address": "Test Address", "addressProofDocTpye": "PAN", "identityProofDocTpye": "aadar", "contactPersonName": "Chandra kamal", "emailId": "chandra.kamal1@gmail.com", "mobileNo": "9876987622", "accountNumber": "234234234", "accountName": "DDDDD", "bankName": "CHHHHHHHH", "bankCode": "123DDD", "branchName": "DDDD", "ifscCode": "99999999", "vendorName": "Test", "vendorCode": "TEST0001", "vendorType": "TEST", "companyPAN": "5241587936", "tenantId": "628f6442b785eb0637b9f64d", "tenantCode": "VTTTEST", "tenantName": "VTT_test" }

  return (
    <>
      {!showbtn ? <AppLoader /> : null}
      <Steppers
        // defaultValues={sampleData}
        template={stepperTemplate}
        getOnInput={myGetData}
        setVal={[
          {name: 'branchName', value: branchData},
          {name: 'bankName', value: bankNameVal},
        ]}
        setSuccessIcon={[
          {name: 'accountNumber', value: showTick},
          {
            name: 'mobileNo',
            value: mobileExists == false && mobileNo?.length == 10,
          },
          {name: 'emailId', value: email?.length && emailExists == false},
        ]}
        showbtn={showbtn}
        afterSubmit={handleSubmit}
        mode='onTouched'
        icons={{
          1: <PersonPinIcon />,
          2: <PersonIcon />,
          3: <AccountBalanceIcon />,
        }}
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
          {name: 'mobileNo', value: mobileNo?.length == 10 && !mobileExists},
          {name: 'emailId', value: !emailExists},
        ]}
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
            message: 'Number already exist',
            error: mobileNo?.length == 10 && mobileExists == true,
          },
          {
            name: 'emailId',
            type: 'customized',
            message: 'Email already exist',
            error: emailExists == true,
          },
        ]}
      />
    </>
  );
};

export default RegisterVendor;
