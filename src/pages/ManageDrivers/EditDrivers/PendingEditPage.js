/* eslint-disable */
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Steppers from '@smart-form/stepper';
import {useParams} from 'react-router-dom';
import SmartForm from '@smart-form';
import axios from 'axios';
import api from '@api';
import regex from '@regex';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {toast} from 'react-toastify';
import AppLoader from '@crema/core/AppLoader';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Api from '@api';
import PersonIcon from '@mui/icons-material/Person';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';

const PendingEditPage = ({id, close}) => {
  const [data, setData] = useState({});
  // const { id } = useParams();
  const {user} = useAuthUser();
  const [openDialog, setOpenDialog] = useState(false);
  const [btnName, setBtnName] = useState(null);
  const [subVal, setsubVal] = useState({});
  const [vendorList, setVendorList] = useState([]);
  const [agency, setAgencyList] = useState();
  const [showbtn, setshowbtn] = React.useState(true);

  useEffect(() => {
    async function fetchData() {
      const baseURL = `${api.driver.changeRequest}/${id}`;
      let response = await axios.get(`${baseURL}`);
      let temd = response.data.data;

      temd.dlValidity = temd.dlValidity?.split('T')[0];
      setData(temd);
    }
    fetchData();
  }, [id]);

  useEffect(() => {
    async function getvendorlist() {
      await axios
        .get(`${api.dropdown.vendor}`)
        .then((res) => {
          let temp = [];
          res?.data?.data?.map((e) => {
            temp.push({
              title:
                e.vendorName +
                ' (' +
                'vendor code ' +
                '-' +
                ' ' +
                e.vendorCode +
                ')',
              name: e.vendorName,
              code: e.vendorCode,
              value: e.id,
            });

            setVendorList(temp ?? []);
          });
        })
        .catch((er) => {
          setVendorList([]);
        });
    }
    getvendorlist();
  }, []);
  async function agencyList() {
    axios
      .get(`${api?.baseUri}/user-reg/internal-reg/getAll`)
      .then((res) => {
        let temp = [];
        res?.data?.data?.map((e) => {
          temp.push({title: e.internalAgencyName, value: e.internalAgencyName});
        });
        setAgencyList(temp ?? []);
      })
      .catch((err) => {
        setAgencyList([]);
      });
  }
  useEffect(() => {
    agencyList();
  }, []);

  useEffect(() => {
    function getvendorlist() {
      axios
        .get(`${api.dropdown.vendor}`)
        .then((res) => {
          let temp = [];
          res?.data?.data?.map((e) => {
            temp.push({
              title:
                e.vendorName +
                ' (' +
                'vendor code ' +
                '-' +
                ' ' +
                e.vendorCode +
                ')',
              name: e.vendorName,
              code: e.vendorCode,
              value: e.id,
            });
            setVendorList(temp);
          });
        })
        .catch((er) => {
          setVendorList([]);
        });
    }
    getvendorlist();
  }, []);
  let template = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    // title: 'Job Application Form',
    description: 'Form for applying Job',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'medium', label: 'fixed'},
        id: 'personal_information1',
        fields: [
          {
            type: 'textarea',
            name: 'remarks',
            id: 'remarks',
            title: 'Remark',
            validationProps: {
              maxLength: {
                value: 800,
                message: 'Maximum 800 characters are allowed.',
              },
            },
          },
        ],
      },
    ],
  };
  let stepperTemplate = {
    title: 'Register Driver Form',
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
        title: 'Driver Details',
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
                  name: 'firstName',
                  id: 'firstName',
                  title: 'First Name',
                  disabled: true,
                  infoMessage: [
                    'Only alphabets are allowed.',
                    'Maximum length should be 50 characters.',
                    'Ex-XYZ.',
                  ],
                  // pattern: {
                  //   value: regex.char50,
                  //   message: 'Please enter valid First Name and below 50 characters'
                  // },
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
                      name: 'lastName',
                      id: 'lastName',
                      title: 'Last Name',
                      disabled: true,
                      infoMessage: [
                        'Only alphabets are allowed.',
                        'Maximum length should be 50 characters.',
                        'Ex-Sharma',
                      ],
                      pattern: {
                        value: regex.char50,
                        message:
                          'Please enter valid Last Name with max 50 characters',
                      },
                      // validationProps: {
                      //   required: 'This is a mandatory field'
                      // }
                    },
                    {
                      type: 'file',
                      name: 'photo',
                      id: 'photo',
                      title: 'Upload Photograph',
                      accept: 'image/*,.pdf,.doc,.docx',
                      disabled: true,
                      tempFilename: data?.photo,
                      validationProps: data?.photo
                        ? {
                            // required: 'This is a mandatory field',
                            size: {
                              value: 5,
                              message:
                                'File size should not be more than 5 mb.',
                            },
                          }
                        : {
                            // required: 'This is a mandatory field',
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
                //   name: 'driverFathersName',
                //   id: 'driverFathersName',
                //   title: 'Father Name',
                //   infoMessage: ["Only alphabets are allowed.", "Maximum length should be 50 characters.", "Ex-XYZ Sharma"],

                //   pattern: {
                //     value: regex.char50,
                //     message: 'Please enter valid Name with max 50 characters'
                //   },
                //   // validationProps: {
                //   //   required: 'This is a mandatory field'
                //   // },
                // },

                {
                  type: 'radio',
                  name: 'gender',
                  id: 'gender',
                  title: 'Gender',
                  disabled: true,
                  infoMessage: ['Radio button is selectable', 'Ex: Male'],
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
                  type: 'date',
                  name: 'dateofBirth',
                  id: 'dateofBirth',
                  title: 'Date of Birth',
                  max: 'today',
                  disabled: true,
                  infoMessage: [
                    'Date is selectable from calendar',
                    'Date can be entered in DD-MM-YY Format',
                    'Ex: 07-04-1992',
                  ],
                  // pattern: {
                  //   value: regex.maxSize30,
                  //   message: 'Please enter valid Name with max 50 characters'
                  // },
                  // validationProps: {
                  //   required: "This is a mandatory field",
                  //   manual: [
                  //     {
                  //       condition: `dateofBirth <= today`,
                  //       message: "Date of Birth should be less than or equal to today's date."
                  //     }
                  //   ]
                  // },
                },
                {
                  type: 'text',
                  name: 'age',
                  id: 'age',
                  title: 'Age',
                  disabled: true,
                  infoMessage: [
                    'Numeric characters are allowed',
                    'Maximum length should be 2 characters',
                    'Ex:  32',
                  ],
                  pattern: {
                    value: regex.age,
                    message:
                      'Please enter valid age with maximum two characters',
                  },
                },
                {
                  type: 'text',
                  name: 'mobileNo',
                  id: 'mobileNo',
                  title: 'Mobile No.',
                  disabled: true,
                  maxChar: 10,
                  isNumber: true,
                  infoMessage: [
                    'Numeric characters are allowed',
                    'Maximum length should be 10 characters',
                    'Ex: 90589067800',
                  ],
                  pattern: {
                    value: regex.phoneReg,
                    message: 'Please enter valid Mobile number',
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
                  disabled: true,
                  infoMessage: [
                    'Alphanumeric characters are allowed',
                    'Maximum length should be 30 characters & should include @',
                    'Should have domain name',
                    'Ex: xyz45@gmail.com',
                  ],
                  // pattern: {
                  //   value: regex.emailReg,
                  //   message: 'Please enter valid Email Id'
                  // },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },

                {
                  type: 'autocomplete',
                  name: 'vendorId',
                  id: 'vendorId',
                  title: 'Vendor',
                  disabled: true,
                  infoMessage: [
                    'Dropdown values are selectable',
                    'Maximum length should be 100 characters',
                    'Ex: Shubhash',
                  ],
                  options: vendorList ?? [],
                  // pattern: {
                  //   value: regex.maxSize30,
                  //   message: 'Please enter valid Fleet Vendor with max 30 characters'
                  // },
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },
                {
                  type: 'text',
                  name: 'alternateNo',
                  id: 'alternateNo',
                  title: 'Alternate Number',
                  disabled: true,
                  infoMessage: [
                    'Numeric characters are allowed',
                    'Maximum length should be 10 characters',
                    'Ex: 90589067800',
                  ],
                  // pattern: {
                  //   value: regex.phoneReg,
                  //   message: 'Please enter valid alternate number'
                  // },
                  validationProps: {
                    manual: [
                      {
                        condition: `alternateNo != mobileNo`,
                        message:
                          'Alternate mobile no should be different from mobile no.',
                      },
                    ],
                  },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },

                {
                  type: 'text',
                  name: 'dlNumber',
                  id: 'dlNumber',
                  title: 'Driving License No.',
                  disabled: true,
                  infoMessage: [
                    'Alphanumeric characters are allowed',
                    'Maximum length should be 100 characters',
                    'Ex:MH-1420110062821',
                  ],
                  pattern: {
                    value: regex.drivingLicReg,
                    message: 'Please enter valid Driving License No.',
                  },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },
                {
                  type: 'date',
                  name: 'dlValidity',
                  id: 'dlValidity',
                  title: 'Driving License Validity',
                  disabled: true,
                  infoMessage: [
                    'Date is selectable from calendar',
                    'Date can be entered in DD-MM-YY Format',
                    'Ex: 07-04-2024',
                  ],
                  min: 'today',
                  // validationProps: {
                  //   required: "This is a mandatory field",
                  //   manual: [
                  //     {
                  //       condition: `dlValidity >= today`,
                  //       message: "Driving License Validity should be greater than or equal to today's date."
                  //     }
                  //   ]
                  // },
                },
                // {
                //   type: 'text',
                //   name: 'address',
                //   id: 'address',
                //   title: 'Present Address',
                //   // distribute: [{ name: 'present_town', value: 'city' }, { name: 'present_state', value: 'state' }, { name: 'present_pincode', value: 'pincode' }],
                //   infoMessage: ["Alphanumeric characters are allowed", "Maximum length should be 50  characters", "Ex: Noida Sector 48, UP "],
                //   validationProps: {
                //     required: 'This is a mandatory field'
                //   },
                //   pattern: {
                //     value: regex.addressReg,
                //     message: 'Please enter valid Address with max 250 characters'
                //   },
                // },
              ],
            },
            {
              layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
              id: 'present_address_information',
              title: 'Present Address',
              fields: [
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
                      name: 'addressOnLicense',
                      id: 'addressOnLicense',
                      disabled: true,
                      title: 'Flat, House No., Building, Company, Apartment',
                      infoMessage: [
                        'Alphanumeric characters are allowed',
                        'Maximum length should be 250  characters',
                        'Ex: Noida sec 1 ',
                      ],
                      // pattern: {
                      //   value: regex.addressReg,
                      //   message: 'Please enter valid Address with max 250 characters'
                      // },
                    },
                    {
                      type: 'text',
                      name: 'present_tempaddressAREA',
                      id: 'present_tempaddressAREA',
                      title: 'Area, Street, Sector, Village',
                      disabled: true,
                      defaultValue:
                        data?.address?.addressName?.split('++')?.[1],
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
                      name: 'present_town',
                      id: 'present_town',
                      title: 'Town/City(Residence)',
                      disabled: true,
                      infoMessage: [
                        'Alphanumeric characters are allowed',
                        'Maximum length should be 50  characters',
                        'Ex: Noida ',
                      ],
                      // pattern: {
                      //   value: regex.adreesschar50,
                      //   message: 'Please enter valid Town/City with max 50 characters'
                      // },
                      // validationProps: {
                      //   required: 'This is a mandatory field'
                      // }
                    },
                    {
                      type: 'text',
                      name: 'present_state',
                      id: 'present_state',
                      title: 'State',
                      disabled: true,
                      infoMessage: [
                        'Alphanumeric characters are allowed',
                        'Maximum length should be 50 characters',
                        'Ex:  UP',
                      ],
                      // pattern: {
                      //   value: regex.adreesschar50,
                      //   message: 'Please enter valid State with max 50 characters'
                      // },
                      // validationProps: {
                      //   required: 'This is a mandatory field'
                      // }
                    },
                    {
                      type: 'text',
                      name: 'present_pincode',
                      id: 'present_pincode',
                      title: 'Pincode',
                      disabled: true,
                      infoMessage: [
                        'Numeric characters are allowed',
                        'Maximum length should be 6 characters',
                        'Ex: 201301',
                      ],

                      pattern: {
                        value: regex.pincodeRegex,
                        message: 'Please enter valid Pincode',
                      },
                    },
                  ],
                },
              ],
            },
            {
              layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
              id: 'permanent_address_information',
              title: 'Permanent Address',
              fields: [
                // {
                //   type: "section",
                //   layout: { column: 1, spacing: 2, size: 'medium', label: 'fixed' },
                //   fields: [
                //     {
                //       type: 'checkbox',
                //       name: 'isPresentSameAsPermanent',
                //       id: 'isPresentSameAsPermanent',
                //       // defaultValue:true,
                //       title: 'Is Permanent Address same as Present Address?'
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
                      name: 'permanent_address',
                      id: 'permanent_address',
                      title: 'Flat, House No., Building, Company, Apartment',
                      disabled: true,
                      infoMessage: [
                        'Alphanumeric characters are allowed',
                        'Maximum length should be 50  characters',
                        'Ex: Noida sec 1 ',
                      ],
                      pattern: {
                        value: regex.addressReg,
                        message:
                          'Please enter valid Town/City with max 50 characters',
                      },
                      dynamic: {
                        condition: `dy.isPresentSameAsPermanent == undefined || dy.isPresentSameAsPermanent == false`,
                        field: 'isPresentSameAsPermanent',
                        value: ['undefined', false],
                      },
                    },
                    {
                      type: 'text',
                      name: 'permanent_tempaddressAREA',
                      id: 'permanent_tempaddressAREA',
                      title: 'Area, Street, Sector, Village',
                      disabled: true,
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
                      // validationProps: {
                      //   required: 'This is a mandatory field'
                      // },
                      dynamic: {
                        condition: `dy.isSameAddress == undefined || dy.isSameAddress == false`,
                        field: 'isSameAddress',
                        value: ['undefined', false],
                      },
                    },
                    {
                      type: 'text',
                      name: 'permanent_town',
                      id: 'permanent_town',
                      title: 'Town/City(Residence)',
                      disabled: true,
                      infoMessage: [
                        'Alphanumeric characters are allowed',
                        'Maximum length should be 250  characters',
                        'Ex: Noida ',
                      ],
                      pattern: {
                        value: regex.adreesschar50,
                        message:
                          'Please enter valid Town/City with max 250 characters',
                      },
                      dynamic: {
                        condition: `dy.isPresentSameAsPermanent == undefined || dy.isPresentSameAsPermanent == false`,
                        field: 'isPresentSameAsPermanent',
                        value: ['undefined', false],
                      },
                      // validationProps: {
                      //   required: 'This is a mandatory field'
                      // }
                    },
                    {
                      type: 'text',
                      name: 'permanent_state',
                      id: 'permanent_state',
                      disabled: true,
                      infoMessage: [
                        'Alphanumeric characters are allowed',
                        'Maximum length should be 50 characters',
                        'Ex:  UP',
                      ],
                      title: 'State',
                      pattern: {
                        value: regex.adreesschar50,
                        message:
                          'Please enter valid State with max 50 characters',
                      },
                      dynamic: {
                        condition: `dy.isPresentSameAsPermanent == undefined || dy.isPresentSameAsPermanent == false`,
                        field: 'isPresentSameAsPermanent',
                        value: ['undefined', false],
                      },
                      // validationProps: {
                      //   required: 'This is a mandatory field'
                      // }
                    },
                    {
                      type: 'text',
                      name: 'permanent_pincode',
                      id: 'permanent_pincode',
                      title: 'Pincode',
                      disabled: true,
                      infoMessage: [
                        'Alphanumeric characters are allowed',
                        'Maximum length should be 50 characters',
                        'Ex:  UP',
                      ],
                      pattern: {
                        value: regex.pincodeRegex,
                        message: 'Please enter valid Pincode',
                      },
                      dynamic: {
                        condition: `dy.isPresentSameAsPermanent == undefined || dy.isPresentSameAsPermanent == false`,
                        field: 'isPresentSameAsPermanent',
                        value: ['undefined', false],
                      },
                      // validationProps: {
                      //   required: 'This is a mandatory field'
                      // }
                    },
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
                  ],
                },
              ],
            },
          ],
        },
      },
      {
        layout: {},
        title: 'Upload Documents',
        buttons: ['Approve', 'Reject'],
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
            column: 1,
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
                  type: 'file',
                  name: 'dldoc',
                  id: 'dldoc',
                  title: 'Upload Driving License Document',
                  tempFilename: data?.dlcenseDoc,
                  disabled: true,
                  infoMessage: [
                    'Should only accept PDF,JPEG files',
                    'File should contain file extension',
                    'e.g.:Shub.jpeg',
                  ],
                  accept: 'image/*,.pdf,.doc,.docx',
                  validationProps: data?.dlcenseDoc
                    ? {
                        size: {
                          value: 5,
                          message: 'File size should not be more than 5 mb.',
                        },
                      }
                    : {
                        // required: 'This is a mandatory field',
                        size: {
                          value: 5,
                          message: 'File size should not be more than 5 mb.',
                        },
                      },
                },
                {
                  type: 'radio',
                  name: 'iDCardIssued',
                  id: 'iDCardIssued',
                  title: 'ID card',
                  infoMessage: ['Radio button is selectable', 'Ex: Yes'],
                  disabled: true,
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // },
                  options: [
                    {title: 'Yes', value: 'Yes'},
                    {title: 'No', value: 'No'},
                  ],
                },
                {
                  type: 'autocomplete',
                  name: 'govtidproof',
                  id: 'govtidproof',
                  title: 'Government Id proof',
                  infoMessage: [
                    'Dropdown values are selectable',
                    'Maximum length should be 100 characters',
                    'Ex: Passport',
                  ],
                  dynamic: {
                    field: 'iDCardIssued',
                    value: 'Yes',
                  },
                  disabled: true,
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // },
                  options: [
                    {title: 'Aadhar Card', value: 'Aadhar Card'},
                    {title: 'PAN Card', value: 'PAN Card'},
                    {title: 'Passport', value: 'Passport'},
                    {title: 'Driving License', value: 'Driving License'},
                    {title: 'Voter Id Card', value: 'Voter Id Card'},
                  ],
                },
                {
                  type: 'file',
                  name: 'govtIdProofDoc',
                  id: 'govtIdProofDoc',
                  title: 'Upload Government Id Proof Document',
                  disabled: true,
                  tempFilename: data?.govtIdProofDoc,
                  infoMessage: [
                    'Should only accept PDF,JPEG files',
                    'File should contain file extension',
                    'e.g.:Shub.jpeg',
                  ],
                  accept: 'image/*,.pdf,.doc,.docx',
                  validationProps: data?.govtIdProofDoc
                    ? {
                        size: {
                          value: 5,
                          message: 'File size should not be more than 5 mb.',
                        },
                      }
                    : {
                        // required: 'This is a mandatory field',
                        size: {
                          value: 5,
                          message: 'File size should not be more than 5 mb.',
                        },
                      },
                },

                {
                  type: 'radio',
                  name: 'driverInduction',
                  id: 'driverInduction',
                  title: 'Driver Induction',
                  infoMessage: ['Radio button is selectable', 'Ex: Yes'],
                  disabled: true,
                  options: [
                    {title: 'Yes', value: 'Yes'},
                    {title: 'No', value: 'No'},
                  ],

                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // },
                },

                {
                  type: 'date',
                  name: 'driverInductionDate',
                  id: 'driverInductionDate',
                  title: 'Driver Induction Date',
                  min: 'today',
                  infoMessage: [
                    'Date is selectable from calendar',
                    'Date can be entered in DD-MM-YY Format',
                    'Ex: 07-04-2022',
                  ],
                  validationProps: {
                    // required: "This is a mandatory field",
                    manual: [
                      {
                        condition: `driverInductionDate >= today`,
                        message:
                          "Driver Induction Date should be greater than or equal to today's date.",
                      },
                    ],
                  },
                  dynamic: {
                    field: 'driverInduction',
                    value: 'Yes',
                  },
                },
                {
                  type: 'radio',
                  name: 'policeVerStatus',
                  id: 'policeVerStatus',
                  title: 'Police Verification',
                  infoMessage: ['Radio button is selectable', 'Ex: Yes'],
                  disabled: true,
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // },
                  options: [
                    {title: 'Yes', value: 'Yes'},
                    {title: 'No', value: 'No'},
                  ],
                },

                {
                  type: 'text',
                  name: 'policeVerificationCode',
                  id: 'policeVerificationCode',
                  title: 'Police Verification Code',
                  infoMessage: [
                    'Alphanumeric Characters are allowed',
                    'Maximum size shuld be 30 characters',
                    'Ex: 76HHDGBD',
                  ],
                  disabled: true,

                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // },
                  pattern: {
                    value: regex.maxSize30,
                    message:
                      'Please enter valid Police Verification Code with max 30 characters',
                  },
                  dynamic: {
                    field: 'policeVerStatus',
                    value: 'Yes',
                  },
                },

                {
                  type: 'file',
                  name: 'policedoc',
                  id: 'policedoc',
                  title: 'Upload Verification Certificate',
                  accept: 'image/*,.pdf,.doc,.docx',
                  infoMessage: [
                    'Should only accept PDF,JPEG files',
                    'File should contain file extension',
                    'e.g.:Shub.jpeg',
                  ],
                  tempFilename: data?.policeVerDoc,
                  disabled: true,
                  validationProps: {
                    // required: 'This is a mandatory field',
                    size: {
                      value: 5,
                      message: 'File size should not be more than 5 mb.',
                    },
                  },
                  dynamic: {
                    field: 'policeVerStatus',
                    value: 'Yes',
                  },
                },

                {
                  type: 'date',
                  name: 'policeverificationexpirydate',
                  id: 'policeverificationexpirydate',
                  title: 'Police Verification Expiry Date',
                  disabled: true,
                  min: 'today',
                  infoMessage: [
                    'Date is selectable from calendar',
                    'Date can be entered in DD-MM-YY Format',
                    'Ex: 07-04-2022',
                  ],
                  validationProps: {
                    // required: "This is a mandatory field",
                    manual: [
                      {
                        condition: `policeverificationexpirydate >= today`,
                        message:
                          "Police Verification Expiry date should be greater than or equal to today's date.",
                      },
                    ],
                  },
                  dynamic: {
                    field: 'policeVerStatus',
                    value: 'Yes',
                  },
                },
                {
                  type: 'select',
                  name: 'isVaccinated',
                  id: 'isVaccinated',
                  title: 'Is Vaccinated',
                  infoMessage: [
                    'Dropdown is selectable',
                    'Ex: Fully Vaccinated',
                  ],
                  disabled: true,
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // },
                  options: [
                    {title: 'Fully Vaccinated', value: 'Fully Vaccinated'},
                    {
                      title: 'Partially Vaccinated',
                      value: 'Partially Vaccinated',
                    },
                    {title: 'Not Vaccinated', value: 'Not Vaccinated'},
                  ],
                },
                {
                  type: 'radio',
                  name: 'badge',
                  id: 'badge',
                  title: 'Badge',
                  infoMessage: ['Radio button is selectable', 'Ex: Yes'],
                  disabled: true,
                  // validationProps: {
                  //   required: 'This is a mandatory field'

                  // },
                  options: [
                    {title: 'Yes', value: 'Yes'},
                    {title: 'No', value: 'No'},
                  ],
                },
                {
                  type: 'text',
                  name: 'badgeNo',
                  id: 'badgeNo',
                  title: 'Badge Number',
                  disabled: true,
                  infoMessage: [
                    'Alphanumeric charaters are allowed',
                    'Maximum lenght should be 30 charaters',
                    'Ex: 65FHDJD',
                  ],
                  dynamic: {
                    field: 'badge',
                    isNotValue: 'NO',
                  },
                  pattern: {
                    value: regex.maxSize30,
                    message:
                      'Please enter valid badge Number with 30 characters ',
                  },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // },
                },
                {
                  type: 'date',
                  name: 'badgeExpDate',
                  id: 'badgeExpDate',
                  title: 'Badge Expiry Date',
                  disabled: true,
                  infoMessage: [
                    'Date is selectable from calendar',
                    'Date can be entered in DD-MM-YY Format',
                    'Ex: 07-04-1992',
                  ],
                  min: 'today',
                  validationProps: {
                    // required: "This is a mandatory field",
                    manual: [
                      {
                        condition: `badgeExpDate >= today`,
                        message:
                          "Badge Expiry date should be greater than or equal to today's date.",
                      },
                    ],
                  },
                  dynamic: {
                    field: 'badge',
                    isNotValue: 'NO',
                  },
                },

                {
                  type: 'radio',
                  name: 'medicalFitness',
                  id: 'medicalFitness',
                  title: 'Medical Fitness',
                  disabled: true,
                  infoMessage: ['Radio button is selectable', 'Ex: Yes'],
                  options: [
                    {title: 'Yes', value: 'Yes'},
                    {title: 'No', value: 'No'},
                  ],
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // },
                },
                {
                  type: 'date',
                  name: 'medicalFitnessExpiryDate',
                  id: 'medicalFitnessExpiryDate',
                  title: 'Medical Fitness Expiry Date',
                  disabled: true,
                  min: 'today',
                  infoMessage: [
                    'Date is selectable from calendar',
                    'Date can be entered in DD-MM-YY Format',
                    'Ex: 07-04-2023',
                  ],
                  dynamic: {
                    field: 'medicalFitness',
                    isNotValue: 'No',
                  },
                  validationProps: {
                    // required: "This is a mandatory field",
                    validate: [
                      {
                        condition:
                          'medicalFitnessExpiryDate >= medicalFitnessDate',
                        message:
                          'From date should be less than or equal to till date.',
                      },
                    ],
                    manual: [
                      {
                        condition: `medicalFitnessExpiryDate >= today`,
                        message:
                          "Medical Fitness Expiry date should be less than or equal to today's date.",
                      },
                    ],
                  },
                },

                {
                  type: 'file',
                  name: 'medicalCertificateDoc',
                  id: 'medicalCertificateDoc',
                  title: 'Upload Medical Certificate',
                  tempFilename: data?.medicalCertificateDoc,
                  disabled: true,
                  infoMessage: [
                    'Should only accept PDF,JPEG files',
                    'File should contain file extension',
                    'e.g.:Shub.jpeg',
                  ],
                  accept: 'image/*,.pdf,.doc,.docx',
                  validationProps: {
                    // required: 'This is a mandatory field',
                    size: {
                      value: 5,
                      message: 'File size should not be more than 5 mb.',
                    },
                  },
                  dynamic: {
                    field: 'medicalFitness',
                    isNotValue: 'No',
                  },
                },
                {
                  type: 'radio',
                  name: 'trainingStatus',
                  id: 'trainingStatus',
                  title: 'Driver Training',
                  infoMessage: ['Radio button is selectable', 'Ex: External'],
                  disabled: true,
                  options: [
                    {title: 'Yes', value: 'Yes'},
                    {title: 'No', value: 'No'},
                  ],
                },
                {
                  type: 'date',
                  name: 'lastTrainingDate',
                  id: 'lastTrainingDate',
                  title: 'Last Training Date',
                  disabled: true,
                  max: 'today',
                  infoMessage: [
                    'Date is selectable from calendar',
                    'Date can be entered in DD-MM-YY Format',
                    'Ex: 07-04-2021',
                  ],
                  dynamic: {
                    field: 'trainingStatus',
                    isNotValue: 'No',
                  },
                  validationProps: {
                    // required: "This is a mandatory field",
                    manual: [
                      {
                        condition: `lastTrainingDate <= today`,
                        message:
                          "Last Training date should be less than or equal to today's date.",
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
      },
    ],
  };

  const handleClose = () => {
    setOpenDialog(false);
  };
  // const getFormData = object => Object.keys(object).reduce((formData, key) => {
  //   formData.append(key, object[key]);
  //   return formData;
  // }, new FormData());

  const handleSubmit = (values) => {
    setshowbtn(false);
    // setOpenDialog(false)

    setsubVal(values?.data);
    if (values.button.toUpperCase() === 'APPROVE') {
      setBtnName('APPROVE');
      setOpenDialog(true);
      setshowbtn(true);
    }
    if (values.button.toUpperCase() === 'REJECT') {
      setBtnName('REJECT');
      setOpenDialog(true);
      setshowbtn(true);
    }
  };

  function handleDialog(val) {
    setOpenDialog(true);

    let tem = {};
    tem = subVal;
    tem.remarks = val?.data?.remarks;
    tem.address = {
      pinCode: subVal?.temppincode,
      state: subVal?.tempstate,
      city: subVal?.temptown,
      addressName: subVal?.tempaddress,
    };

    if (tem.tempaddress) delete tem.tempaddress;
    if (tem.temptown) delete tem.temptown;
    if (tem.tempstate) delete tem.tempstate;
    if (tem.temppincode) delete tem.temppincode;
    if (
      (val.button == 'No' && btnName == 'REJECT') ||
      (val.button == 'No' && btnName == 'APPROVE')
    ) {
      setOpenDialog(false);
    }
    if (val.button == 'Yes' && btnName == 'APPROVE') {
      axios
        .post(Api?.driver?.approve, data)
        .then(function (response) {
          if (response.data.status == 200) {
            // navigate(`/onboardadmin/driver/driver-listing`);
            toast.success(
              `${
                response?.data?.data?.firstName + response?.data?.data?.lastName
              }'s profile update request approved.`,
            );
            close();
          } else {
            toast.error(response?.data?.message ?? 'Something went wrong');
          }
          setshowbtn(true);
        })
        .catch(function (response) {
          toast.error(response?.data?.message ?? 'Something went wrong');
          //handle error
          setshowbtn(true);
        });
    }

    if (val.button == 'Yes' && btnName == 'REJECT') {
      axios
        .post(Api?.driver?.reject, data)
        .then(function (response) {
          if (response.status == 200) {
            // navigate(`/onboardadmin/driver/driver-listing`);
            toast.success(
              `${
                response?.data?.data?.firstName + response?.data?.data?.lastName
              }'s profile update request rejected.`,
            );
            close();
          } else {
            toast.error(response?.data?.message ?? 'Something went wrong');
          }
          setshowbtn(true);
        })
        .catch(function (response) {
          toast.error(response?.data?.message ?? 'Something went wrong');
          //handle error
          setshowbtn(true);
        });
    }
    setOpenDialog(false);
  }

  return (
    <>
      {!showbtn ? <AppLoader /> : null}

      {data && data.id && vendorList.length && (
        <>
          <Steppers
            defaultValues={data}
            template={stepperTemplate}
            showbtn={showbtn}
            // setVal={[{ name: "tempaddress", value: data?.address?.addressName }, { name: "temptown", value: data?.address?.city }, { name: "tempstate", value: data?.address?.state }, { name: "temppincode", value: data?.address?.pinCode }]}
            afterSubmit={handleSubmit}
            setVal={[
              {
                name: 'addressOnLicense',
                value: data?.address?.addressName?.split('++')?.[0],
              },
              {
                name: 'present_tempaddressAREA',
                value: data?.address?.addressName?.split('++')?.[1],
              },
              {name: 'present_town', value: data?.address?.city},
              {name: 'present_state', value: data?.address?.state},
              {name: 'present_pincode', value: data?.address?.pinCode},
              {
                name: 'permanent_address',
                value: data?.shelterAddress?.addressName?.split('++')?.[0],
              },
              {
                name: 'permanent_tempaddressAREA',
                value: data?.shelterAddress?.addressName?.split('++')?.[1],
              },
              {name: 'permanent_town', value: data?.shelterAddress?.city},
              {name: 'permanent_state', value: data?.shelterAddress?.state},
              {name: 'permanent_pincode', value: data?.shelterAddress?.pinCode},
              {name: 'dlValidity', value: data?.dlValidity?.split('T')[0]},
              // { name: "age", value: data?.age }
            ]}
            icons={{1: <PersonIcon />, 2: <TextSnippetIcon />}}
          />
          <Dialog
            onClose={handleClose}
            open={openDialog}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
          >
            <DialogContent>
              <p>Are you sure, you want to confirm?</p>
              <SmartForm
                template={template}
                buttons={['Yes', 'No']}
                onSubmit={handleDialog}
              />
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
};

export default PendingEditPage;
