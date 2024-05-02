/* eslint-disable */
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Steppers from '@smart-form/stepper';
import {useAuthUser} from '@crema/utility/AuthHooks';
import regex from '@regex';
import api from '@api';
import axios from 'axios';
import {toast} from 'react-toastify';
import AppLoader from '@crema/core/AppLoader';
import {keys} from 'lodash';
import {getFormData} from '@hoc';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import DomainIcon from '@mui/icons-material/Domain';
import HomeIcon from '@mui/icons-material/Home';

const CorporateForm = ({close, tenantId}) => {
  const navigate = useNavigate();
  const {user} = useAuthUser();

  // const [tempbankList, setTempbankList] = React.useState([]);
  const [showbtn, setshowbtn] = React.useState(true);
  const [mytempifsc, setMytempifsc] = React.useState();
  const [branchData, setbranchData] = React.useState();
  const [bankNameVal, setbankNameVal] = React.useState();
  const [value, setValue] = React.useState(null);
  const [accountNumber, setAccountNumber] = React.useState();
  const [showTick, setshowTick] = React.useState();
  const [mobileExists, setMobileExists] = useState(false);
  const [mobileNo, setMobileNo] = useState();
  const [data, setData] = useState();
  const [domainList, setDomainList] = useState([]);
  const [domainArray, setDomainArray] = useState([]);
  const [tenantInfo, setTenantInfo] = useState();
  const [geoLocation, setGeoLocation] = useState({
    locName: '',
    latitude: '',
    longitude: '',
  });
  const corporateId = user?.userList?.profileId;
  const [email, setEmail] = useState();
  const [emailExists, setEmailExists] = useState(false);

  useEffect(() => {
    if (!tenantId) {
      return;
    }
    const baseURL = `${api.onBoardTenant.list}/${tenantId} `;
    axios
      .get(`${baseURL}`)
      .then((response) => {
        setTenantInfo(response.data.data);
      })
      .catch(() => {});
  }, [tenantId]);

  useEffect(() => {
    async function fetchData() {
      const baseURL = `${api.onBoardTenant.list}/${tenantId}`;
      axios
        .get(`${baseURL}`)
        .then((response) => {
          console.log('res', response);
          let temArr = [];
          let temdomain = [];
          response.data.data?.domains?.map((el) => {
            temArr.push({title: el, value: el});
          });

          temArr.map((e) => {
            temdomain.push(e?.value);
          });
          console.log('temdomain', temdomain);
          setDomainArray(temdomain ?? []);
          setData(response.data.data ?? {});
          setDomainList(temArr ?? []);
        })
        .catch((err) => {
          setData({});
          setDomainList([]);
        });
    }
    fetchData();
  }, [corporateId]);

  let stepperTemplate = {
    title: 'Corporate Onboarding Form',
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
                  defaultValue: tenantInfo?.companyName,
                  infoMessage: [
                    'Only Alphanumeric are allowed',
                    'Maximum length should be 50 characters.',
                    'EX: TCS,Wipro,HCL etc...',
                  ],
                  // pattern: {
                  //   value: regex.companyreg,
                  //   message:
                  //     'Please enter valid company name and below 50 characters',
                  // },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },
                // {
                //   type: 'switchToggle',
                //   name: 'branchName',
                //   id: 'branchName',
                //   title: 'Branch Name',
                // },
                {
                  type: 'text',
                  name: 'companyCode',
                  id: 'companyCode',
                  defaultValue: tenantInfo?.companyCode,
                  title: 'Company Code',
                  disabled: true,
                  // infoMessage: ["Alphanumeric characters are allowed", "Maximum length should be 50 characters.", "EX: TCS1234"],
                  // pattern: {
                  //   value: regex.charwithnum,
                  //   message: 'Please enter valid company code  and below 50 characters'
                  // },
                },
                {
                  type: 'hidden',
                  name: 'tanentId',
                  id: 'tanentId',
                  defaultValue: tenantInfo?.id || user?.userList?.tanentId,
                },
                {
                  type: 'hidden',
                  name: 'tanentCode',
                  id: 'tanentCode',
                  defaultValue:
                    tenantInfo?.companyCode || user?.userList?.tanentCode,
                },
                {
                  type: 'hidden',
                  name: 'tanentName',
                  id: 'tanentName',
                  defaultValue:
                    tenantInfo?.companyName || user?.userList?.tanentName,
                },
                {
                  type: 'text',
                  name: 'tempcompanyAddressOne',
                  id: 'tempcompanyAddressOne',
                  title: 'Flat, House No., Building, Apartment',
                  disabled: true,
                  defaultValue:
                    tenantInfo?.companyAddress?.addressName?.split('++')[0],
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
                  //   required: 'This is a mandatory field',
                  // },
                },

                {
                  type: 'text',
                  name: 'tempcompanyAddressOneAREA',
                  id: 'tempcompanyAddressOneAREA',
                  title: 'Area, Street, Sector, Village',
                  disabled: true,
                  infoMessage: [
                    'Alphanumeric characters are allowed',
                    'Maximum length should be 100 characters',
                    'e.g.: Noida Sector 48, UP',
                  ],
                  defaultValue:
                    tenantInfo?.companyAddress?.addressName?.split('++')[1],
                  // pattern: {
                  //   value: regex.addressReg,
                  //   message: 'Please enter valid Address with max 100 characters '
                  // },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },

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
                  defaultValue: tenantInfo?.companyAddress?.city,
                  // pattern: {
                  //   value: regex.adreesschar50,
                  //   message: 'Please enter valid City with max 50 characters'
                  // },
                  // validationProps: {
                  //   required: 'This is a mandatory field',
                  // },
                },

                {
                  type: 'text',
                  name: 'tempcompanyAddressstate',
                  id: 'tempcompanyAddressstate',
                  disabled: true,
                  title: 'State ',
                  defaultValue: tenantInfo?.companyAddress?.state,
                  infoMessage: [
                    'Alphanumeric characters are allowed',
                    'Maximum length should be 50 characters',
                    'e.g.:  UP',
                  ],
                  // pattern: {
                  //   value: regex.adreesschar50,
                  //   message: 'Please enter valid State with max 50 characters'
                  // },
                  // validationProps: {
                  //   required: 'This is a mandatory field',
                  // },
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
                  defaultValue: tenantInfo?.companyAddress?.pinCode,
                  // pattern: {
                  //   value: regex.pincodeRegex,
                  //   message: 'Please enter valid Pincode'
                  // },
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },
                // {
                //   type: "section",
                //   layout: { column: 2, spacing: 2, size: 'medium', label: 'fixed' },
                //   fields: [
                //     {
                //       type: 'text',
                //       name: 'companyRegNo',
                //       id: 'companyRegNo',
                //       title: 'Registration No.',
                //       infoMessage: ["Alphanumeric characters are allowed", "Maximum length should be 30 characters", "e.g.:LU12345DL2022"],
                //       disDate: ['2022-08-07T00:00', '2022-08-08T00:00'],
                //       pattern: {
                //         value: regex.maxSize30,
                //         message: 'Please enter valid registration no. '
                //       },
                //       // validationProps: {
                //       //   required: 'This is a mandatory field'
                //       // }
                //     },
                //     {
                //       type: 'file',
                //       name: 'regfile',
                //       id: 'regfile',
                //       title: 'Upload Registration certificate',
                //       accept: 'image/*,.pdf,.doc,.docx',
                //       infoMessage: ["Should only accept PDF,JPEG files", "File should contain file extension", "e.g.:Shub.jpeg"],
                //       validationProps: {
                //         // required: 'This is a mandatory field',
                //         size: {
                //           value: 5,
                //           message: 'File size should not be more than 5 mb.'
                //         },
                //       }
                //     },
                //   ]
                // },
                // {
                //   type: "section",
                //   layout: { column: 2, spacing: 2, size: 'medium', label: 'fixed' },
                //   fields: [
                //     {
                //       type: 'text',
                //       name: 'companyGSTN',
                //       id: 'companyGSTN',
                //       title: 'GSTIN No.',
                //       infoMessage: ["Alphanumeric characters are allowed", "Maximum length should be 15 characters .", "e.g.:07AAGFF2194N1Z1"],
                //       pattern: {
                //         value: regex.gstReg,
                //         message: 'Please enter valid GST number'
                //       },
                //       validationProps: {
                //         required: 'This is a mandatory field'
                //       }
                //     },
                //     {
                //       type: 'file',
                //       name: 'gstnfile',
                //       id: 'gstnfile',
                //       title: 'Upload GST certificate',
                //       infoMessage: ["Should only accept PDF,JPEG files", "File should contain file extension", "e.g.:Shub.jpeg"],
                //       accept: 'image/*,.pdf,.doc,.docx',
                //       validationProps: {
                //         // required: 'This is a mandatory field',
                //         size: {
                //           value: 5,
                //           message: 'File size should not be more than 5 mb.'
                //         },
                //       }
                //     },
                //   ]
                // },
                // {
                //   type: "section",
                //   layout: { column: 2, spacing: 2, size: 'medium', label: 'fixed' },
                //   fields: [
                //     {
                //       type: 'text',
                //       name: 'companyPAN',
                //       id: 'companyPAN',
                //       title: 'PAN No.',
                //       infoMessage: ["Alphanumeric characters are allowed", "Maximum length should be 10 characters .", "e.g.:BNZPM2501F"],
                //       pattern: {
                //         value: regex.panReg,
                //         message: 'Please enter valid PAN number'
                //       },
                //       // validationProps: {
                //       //   required: 'This is a mandatory field'
                //       // }
                //     },
                //     {
                //       type: 'file',
                //       name: 'panfile',
                //       id: 'panfile',
                //       title: 'Upload PAN card',
                //       infoMessage: ["Should only accept PDF,JPEG files", "File should contain file extension", "e.g.:Shub.jpeg"],
                //       accept: 'image/*,.pdf,.doc,.docx',
                //       validationProps: {
                //         // required: 'This is a mandatory field',
                //         size: {
                //           value: 5,
                //           message: 'File size should not be more than 1mb.'
                //         },
                //       }
                //     },
                //   ]
                // },
              ],
            },
          ],
        },
      },
      {
        layout: {},
        title: 'Office Details',
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
                  name: 'officeName',
                  id: 'officeName',
                  title: 'Office Name',
                  infoMessage: [
                    'Alphanumeric characters are allowed',
                    'Maximum length should be 50 characters',
                    'e.g.:wipro, tcs, velocis',
                  ],
                  pattern: {
                    value: regex.companyreg,
                    message:
                      'Please enter valid Office Name with max 50 characters',
                  },
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },
                {
                  type: 'mappl',
                  name: 'location',
                  id: 'location',
                  distribute: [
                    {name: 'tempofficeAddressone', value: 'locName'},
                    {name: 'tempofficeAddressonetown', value: 'city'},
                    {name: 'tempofficeAddressstate', value: 'state'},
                    {name: 'tempofficeAddresspincode', value: 'pincode'},
                  ],
                  title: 'Office Location',
                  defaultValue: geoLocation,
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                  infoMessage: ['Select from map'],
                },
                {
                  type: 'text',
                  name: 'tempofficeAddressone',
                  id: 'tempofficeAddressone',
                  title: 'Flat, House No., Building, Apartment',
                  infoMessage: [
                    'Alphanumeric characters are allowed',
                    'Maximum length should be 250  characters',
                    'e.g.: Noida Sector 48, UP ',
                  ],
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                  pattern: {
                    value: regex.maxSize250,
                    message:
                      'Please enter valid Address with max 100 characters ',
                  },
                },
                {
                  type: 'text',
                  name: 'tempofficeAddressonetown',
                  id: 'tempofficeAddressonetown',
                  title: 'Town/City ',
                  infoMessage: [
                    'Alphabets are allowed',
                    'Maximum length should be 50  characters',
                    'e.g.: Noida ',
                  ],
                  validationProps: {
                    required:
                      'This is a mandatory field with max 50 characters',
                  },
                  pattern: {
                    value: regex.adreesschar50,
                    message: 'Please enter valid Town/City ',
                  },
                },
                {
                  type: 'text',
                  name: 'tempofficeAddressstate',
                  id: 'tempofficeAddressstate',
                  title: 'State ',
                  infoMessage: [
                    'Alphabets characters are allowed',
                    'Maximum length should be 50 characters',
                    'e.g.:  UP',
                  ],

                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                  pattern: {
                    value: regex.adreesschar50,
                    message:
                      'Please enter valid State name with max 50 characters',
                  },
                },
                {
                  type: 'text',
                  name: 'tempofficeAddresspincode',
                  id: 'tempofficeAddresspincode',
                  title: 'Pincode ',
                  maxChar: 6,
                  isNumber: true,
                  infoMessage: [
                    'Numeric characters are allowed',
                    'Maximum length should be 6 characters',
                    'e.g.: 201301',
                  ],
                  validationProps: {
                    // required: 'This is a mandatory field'
                  },
                  pattern: {
                    value: regex.pincodeRegex,
                    message: 'Please enter valid Pincode',
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
                      isUpper: true,
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
                      // validationProps: {
                      //   required: 'This is a mandatory field'
                      // }
                    },
                    {
                      type: 'file',
                      name: 'regfile',
                      id: 'regfile',
                      title: 'Upload Document',
                      infoMessage: [
                        'Should only accept PDF,JPEG files',
                        'File should contain file extension',
                        'e.g.:Shub.jpeg',
                      ],
                      accept: 'image/*,.pdf,.doc,.docx',
                      // tempFilename: (data?.companyRegDoc),
                      validationProps: {
                        // required: 'This is a mandatory field',
                        size: {
                          value: 5,
                          message: 'File size should not be more than 5 mb.',
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
                      isUpper: true,
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
                      infoMessage: [
                        'Should only accept PDF,JPEG files',
                        'File should contain file extension',
                        'e.g.:Shub.jpeg',
                      ],
                      accept: 'image/*,.pdf,.doc,.docx',
                      // tempFilename: (data?.companyGstnDoc),
                      validationProps: {
                        // required: 'This is a mandatory field',
                        size: {
                          value: 5,
                          message: 'File size should not be more than 5 mb.',
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
                      maxChar: 10,
                      isUpper: true,
                      infoMessage: [
                        'Alphanumeric characters are allowed',
                        'Maximum length should be 10 characters .',
                        'e.g.:BNZPM2501F',
                      ],
                      pattern: {
                        value: regex.panReg,
                        message: 'Please enter valid PAN number',
                      },
                      // validationProps: {
                      //   required: 'This is a mandatory field'
                      // }
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
                      // tempFilename: (data?.companyPanDoc),
                      validationProps: {
                        // required: 'This is a mandatory field',
                        size: {
                          value: 5,
                          message: 'File size should not be more than 5 mb.',
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
                    'e.g.:- XYZ.',
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
                  type: 'text',
                  name: 'emailId',
                  id: 'emailId',
                  title: 'Email Id',
                  fixErrorBox: true,
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
                    message: 'Please enter valid mobile number',
                  },
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },
                {
                  type: 'text',
                  name: 'landLineNo',
                  id: 'landLineNo',
                  title: 'Landline No.',
                  isNumber: true,
                  maxChar: 18,
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
                  title: 'Name of Account Holder',
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
                  title: 'IFSC Code',
                  isUpper: true,
                  maxChar: 11,
                  infoMessage: [
                    'Alphanumeric characters are allowed',
                    'Maximum length should be 10 characters',
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

  // const getFormData = object =>
  //   Object.keys(object).reduce((formData, key) => {
  //     formData.append(key, object[key]);
  //     return formDataObject;
  //   }, new FormData());

  const handleChange = (values) => {
    //
    if (values?.location) {
      setGeoLocation({
        locName: values?.location?.locName,
        latitude: values?.location?.latitude,
        longitude: values?.location?.longitude,
      });
    }
  };
  const handleBack = async (values) => {};
  const handleSubmit = async (values) => {
    if (values?.data?.accountNumber != values?.data?.tempaccountNumber) {
      setshowbtn(true);
      return;
    }
    setshowbtn(false);

    if (values.button.toUpperCase() === 'SUBMIT') {
      if (values.button.toUpperCase() === 'SUBMIT') {
        let dataSet = {};
        let allElem = {};
        let siteData = {};
        let tem = {
          companyName: values?.data?.companyName,
          companyCode: values?.data?.companyCode,
          tanentId: values?.data?.tanentId,
          tanentCode: values?.data?.tanentCode,
          tanentName: values?.data?.tanentName,
          domains: values?.data?.domains,
          companyAddress: {
            addressName: values?.data?.tempofficeAddressone,
            pinCode: values?.data?.tempcompanyAddresspincode,
            state: values?.data?.tempcompanyAddressstate,
            city: values?.data?.tempcompanyAddresstown,
          },
          // "companyAddress":values?.data?.tempcompanyAddressOne + "," + values?.data?.tempcompanyAddresstown + "," + + "," + values?.data?.tempcompanyAddresspincode,
          companyRegNo: values?.data?.companyRegNo,
          companyPAN: values?.data?.companyPAN,
          companyGSTN: values?.data?.companyGSTN,
          landLineNo: values?.data?.landLineNo,
          contactPersonFirstName: values?.data?.contactPersonFirstName,
          contactPersonLastName: values?.data?.contactPersonLastName,
          mobileNo: values?.data?.mobileNo,
          emailId: values?.data?.emailId,
          bankCode: values?.data?.bankCode,
          bankName: values?.data?.bankName,
          branchName: values?.data?.branchName,
          accountName: values?.data?.accountName,
          accountNumber: values?.data?.accountNumber,
          ifscCode: values?.data?.ifscCode,
          gstnfile: values?.data?.gstnfile,
          regfile: values?.data?.regfile,
          panfile: values?.data?.panfile,
          profileStatus: 'DEFAULT',
          siteOfficeDto: {
            companyName: values?.data?.companyName,
            companyCode: values?.data?.companyCode,
            tanentId: values?.data?.tanentId,
            tanentCode: values?.data?.tanentCode,
            tanentName: values?.data?.tanentName,
            contactPersonFirstName: values?.data?.contactPersonFirstName,
            contactPersonLastName: values?.data?.contactPersonLastName,
            landLineNo: values?.data?.landLineNo,
            mobileNo: values?.data?.mobileNo,
            emailId: values?.data?.emailId,
            officeName: values?.data?.officeName,
            officeAddress: {
              addressName: values?.data?.tempofficeAddressone,
              city: values?.data?.tempofficeAddressonetown,
              state: values?.data?.tempofficeAddressstate,
              pinCode: values?.data?.tempofficeAddresspincode,
            },
            // "officeAddress": values?.data?.tempofficeAddressone + "," + values?.data?.tempofficeAddresstown + "," + values?.data?.tempofficeAddresscountry + "," + values?.data?.tempofficeAddresspincode,
            //{name:'tempofficeAddressone', value:'locName'}, {name:'tempofficeAddressonetown', value:'city'}, {name:'tempofficeAddressstate', value:'state'},{name:'tempofficeAddresspincode', value:'pincode'}
            location: {
              locName: values?.data?.location?.locName,
              latitude: values?.data?.location?.latitude,
              longitude: values?.data?.location?.longitude,
            },
          },
        };

        siteData = {
          companyName: values?.data?.companyName,
          companyCode: values?.data?.companyCode,
          tanentId: values?.data?.tanentId,
          tanentCode: values?.data?.tanentCode,
          tanentName: values?.data?.tanentName,
          contactPersonFirstName: values?.data?.contactPersonFirstName,
          contactPersonLastName: values?.data?.contactPersonLastName,
          landLineNo: values?.data?.landLineNo,
          mobileNo: values?.data?.mobileNo,
          emailId: values?.data?.emailId,
          officeName: values?.data?.officeName,
          officeAddress: {
            addressName: values?.data?.tempofficeAddressone,
            city: values?.data?.tempofficeAddressonetown,
            state: values?.data?.tempofficeAddressstate,
            pinCode: values?.data?.tempofficeAddresspincode,
          },
          // "officeAddress": values?.data?.tempofficeAddressone + "," + values?.data?.tempofficeAddresstown + "," + values?.data?.tempofficeAddresscountry + "," + values?.data?.tempofficeAddresspincode,
          //{name:'tempofficeAddressone', value:'locName'}, {name:'tempofficeAddressonetown', value:'city'}, {name:'tempofficeAddressstate', value:'state'},{name:'tempofficeAddresspincode', value:'pincode'}
          location: {
            locName: values?.data?.location?.locName,
            latitude: values?.data?.location?.latitude,
            longitude: values?.data?.location?.longitude,
          },
          shifts: values?.data?.shifts,
        };

        if (!tem?.regfile?.length) delete tem.regfile;
        if (!tem?.gstnfile?.length) delete tem.gstnfile;
        if (!tem?.panfile?.length) delete tem.panfile;

        delete tem.tempaccountNumber;
        delete tem.tempofficeAddressone;
        delete tem.tempcompanyAddresspincode;
        delete tem.tempcompanyAddressstate;
        delete tem.tempcompanyAddresstown;
        delete tem.tempofficeAddressone;
        delete tem.tempofficeAddresstown;
        delete tem.tempofficeAddressstate;
        delete tem.tempofficeAddresspincode;

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

        //

        await axios({
          method: 'post',
          url: api.onBoardCorporate.list,
          data: getFormData(dataSet),
          headers: {'Content-Type': 'multipart/form-data'},
        })
          .then(function (response) {
            //handle success
            if (response?.data?.status == '200') {
              siteData.corporateId = response?.data?.data?.id;
              axios
                .post(api.siteOffice.list, siteData)
                .then((res) => {
                  //for siteoffice
                  if (res?.data?.status == '200') {
                    toast.success('Details has been successfully submitted.');
                    // navigate(`/onbordCorporate/list`);
                    close(false);
                  } else {
                    setshowbtn(true);
                    toast.error('Something went wrong');
                  }
                })
                .catch(function (err) {
                  toast.error('Something went wrong');
                  setshowbtn(true);
                });
            } else {
              setshowbtn(true);
              toast.error(response?.data?.message, 'Something went wrong');
            }
          })
          .catch(function (err) {
            toast.error('Something went wrong');
            setshowbtn(true);
          });
      }
    }
  };

  async function checkMobile(mob) {
    let r = await axios.get(
      `${api?.baseUri}/userauth/user-account/${mob}/mobile`,
    );
    if (r?.data == 'User Present') return false;
    else return true;
  }

  async function checkEmail(email) {
    let r = await axios.get(
      `${api?.baseUri}/userauth/user-account/${email}/email`,
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

    if (d?.emailId && d?.emailId?.includes('@') && email != d?.emailId) {
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

    // ----------------------------------Email Validation--------------------------------------------
  }

  return (
    <>
      {/* { } */}
      {!showbtn ? <AppLoader /> : null}
      {tenantInfo?.id && (
        <Steppers
          // defaultValues={cummyData}
          // watchFields={['location']}

          template={stepperTemplate}
          showbtn={showbtn}
          getOnInput={myGetData}
          mode='onTouched'
          // clearErr={[{ name: "accountNumber", value: showTick, rr: bankNameVal }, { name: "mobileNo", value: mobileNo?.length == 10 && !mobileExists }]}
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
          setVal={[
            {name: 'branchName', value: branchData},
            {name: 'bankName', value: bankNameVal},
            {name: 'accountNumber', value: accountNumber},
            {name: 'companyName', value: tenantInfo?.companyName},
            {name: 'companyCode', value: tenantInfo?.companyCode},
            {
              name: 'tempcompanyAddressOne',
              value: tenantInfo?.companyAddress?.addressName?.split('++')[0],
            },
            {
              name: 'tempcompanyAddressOneAREA',
              value: tenantInfo?.companyAddress?.addressName?.split('++')[1],
            },
            {
              name: 'tempcompanyAddresstown',
              value: tenantInfo?.companyAddress?.city,
            },
            {
              name: 'tempcompanyAddressstate',
              value: tenantInfo?.companyAddress?.state,
            },
            {
              name: 'tempcompanyAddresspincode',
              value: tenantInfo?.companyAddress?.pinCode,
            },
          ]}
          setSuccessIcon={[
            {name: 'accountNumber', value: showTick},
            {
              name: 'mobileNo',
              value: mobileExists == false && mobileNo?.length == 10,
            },
            {
              name: 'emailId',
              value:
                email?.length && email?.includes('@') && emailExists == false,
            },
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
            // { name: "emailId", type: "customized", message: "Please enter valid domain.", error: !emailCheck },
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
              error: emailExists == true && email?.includes('@'),
            },
          ]}
          afterSubmit={handleSubmit}
          onChange={handleChange}
          onBack={handleBack}
          icons={{
            1: <DomainIcon />,
            2: <HomeIcon />,
            3: <PersonIcon />,
            4: <AccountBalanceIcon />,
          }}
        />
      )}
    </>
  );
};

export default CorporateForm;
