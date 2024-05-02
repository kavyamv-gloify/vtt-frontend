import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import Steppers from '@smart-form/stepper';
import {useAuthUser} from '@crema/utility/AuthHooks';
import api from '@api';
import regex from '@regex';
import axios from 'axios';
import {toast} from 'react-toastify';
import AppLoader from '@crema/core/AppLoader';
import data from 'pages/thirdParty/timeLine/Custom/data';
import Api from '@api';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import {useAsync} from '@crema/utility/hooks';
import SmartForm from '@smart-form';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {IoMdReturnLeft} from 'react-icons/io';

const RegisterDriver = ({close}) => {
  const navigate = useNavigate();
  const {user} = useAuthUser();
  const [data, setData] = useState();
  const [showbtn, setshowbtn] = React.useState(true);
  const [mobileCheck, setMobileCheck] = useState();
  const [showTick, setshowTick] = React.useState();
  const [vendorList, setVendorList] = useState();
  const [age, setAge] = useState();
  const [openAgency, setOpenAgency] = useState(false);
  const [agency, setAgencyList] = useState([]);
  const [mobileExists, setMobileExists] = useState(false);
  const [mobileNo, setMobileNo] = useState();
  const [email, setEmail] = useState();
  const [emailExists, setEmailExists] = useState(false);
  const [shift, setShift] = useState();
  const [vendorId, setVendorId] = useState();
  const id = user?.userList?.profileId;

  useEffect(() => {
    async function fetchData() {
      const baseURL = `${api.vendor.list}/${id}`;
      let response = await axios.get(`${baseURL}`);
      setData(response.data.data);
    }
    fetchData();
  }, [id]);

  async function agencyList() {
    axios
      .get(`${api.dropdown.driveragency}`)
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
    if (user?.role !== 'VENDOR') {
      getShift(vendorId);
    }
    if (user?.role == 'VENDOR') {
      getShift(user?.userList?.profileId);
    }
  }, [user?.userList?.profileId, vendorId]);

  function getShift(val) {
    console.log(val);
    axios
      .get(
        Api.baseUri +
          `/user-reg/driver-shift/get-DriverShift-by-vendorId/${val}`,
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          console.log('res', res);
          let temp_arr = [];
          res?.data?.data?.map((el) => {
            temp_arr.push({
              title:
                el?.shiftName + '(' + el?.shiftStart + '-' + el?.shiftEnd + ')',
              value: el?.id,
            });
          });
          console.log('temp', temp_arr);
          setShift(temp_arr ?? []);
        }
      })
      .catch((err) => {
        setShift([]);
      });
  }

  const getVendorList = () => {
    axios
      .get(Api.baseUri + '/user-reg/associatevendor/getallassociatecorporateId')
      .then((re) => {
        let temArr = []; // + ' (' + el?.vendor?.vendorCode + ')'
        re?.data?.data?.length &&
          re?.data?.data?.map((el) => {
            if (el?.vendor)
              temArr.push({
                value: el?.vendor?.id,
                title: el?.vendor?.vendorName,
                createdOn: el?.vendor?.createdOn,
                vendorName: el?.vendor?.vendorName,
                vendorCode: el?.vendor?.vendorCode,
              });
          });
        let sortedProducts = temArr.sort((p1, p2) =>
          new Date(p1.createdOn) < new Date(p2.createdOn)
            ? 1
            : new Date(p1.createdOn) > new Date(p2.createdOn)
            ? -1
            : 0,
        );
        setVendorList(sortedProducts ?? []);
      })
      .catch((err) => {
        setVendorList([]);
      });
  };
  useEffect(() => {
    getVendorList();
  }, []);

  function handleClose() {
    setOpenAgency(false);
  }

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
                  infoMessage: [
                    'Only alphabets are allowed.',
                    'Maximum length should be 50 characters.',
                    'Ex-XYZ.',
                  ],
                  pattern: {
                    value: regex.char50,
                    message:
                      'Please enter valid First Name and below 50 characters',
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
                      name: 'lastName',
                      id: 'lastName',
                      title: 'Last Name',
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
                      isProfile: true,
                      id: 'photo',
                      accept: 'image/*',
                      title: 'Upload Photograph',
                      infoMessage: [
                        'Should only accept PDF,JPEG files',
                        'File should contain file extension',
                        'e.g.:Shub.jpeg',
                      ],
                      validationProps: {
                        size: {
                          value: 5,
                          message: 'File size should not be more than 5 mb.',
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
                  infoMessage: [
                    'Date is selectable from calendar',
                    'Date can be entered in DD-MM-YY Format',
                    'Ex: 07-04-1992',
                  ],
                  // pattern: {
                  //   value: regex.maxSize30,
                  //   message: 'Please enter valid Name with max 50 characters'
                  // },
                  validationProps: {
                    required: 'This is a mandatory field',
                    manual: [
                      {
                        condition: `dateofBirth <= today`,
                        message:
                          "Date of Birth should be less than or equal to today's date.",
                      },
                    ],
                  },
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
                  infoMessage: [
                    'Alphanumeric characters are allowed',
                    'Maximum length should be 30 characters & should include @',
                    'Should have domain name',
                    'Ex: xyz45@gmail.com',
                  ],
                  pattern: {
                    value: regex.emailReg,
                    message: 'Please enter valid Email Id',
                  },
                  validationProps: {
                    // required: 'This is a mandatory field'
                  },
                },
                {
                  type: 'autocomplete',
                  name: 'vendorId',
                  id: 'vendorId',
                  title: 'Vendor',
                  disabled: user?.role == 'VENDOR' ? true : false,
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

                // {
                //   type: 'autocomplete',
                //   name: 'shiftId',
                //   id: 'shiftId',
                //   title: 'Shift',
                //   infoMessage: ['Dropdown values are selectable'],
                //   options: shift ?? [],
                //   // pattern: {
                //   //   value: regex.maxSize30,
                //   //   message: 'Please enter valid Fleet Vendor with max 30 characters'
                //   // },
                //   validationProps: {
                //     required: 'This is a mandatory field',
                //   },
                // },
                {
                  type: 'text',
                  name: 'alternateNo',
                  id: 'alternateNo',
                  title: 'Alternate Number',
                  maxChar: 10,
                  isNumber: true,
                  infoMessage: [
                    'Numeric characters are allowed',
                    'Maximum length should be 10 characters',
                    'Ex: 90589067800',
                  ],
                  pattern: {
                    value: regex.phoneReg,
                    message: 'Please enter valid alternate number',
                  },
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
                  isUpper: true,
                  infoMessage: [
                    'Alphanumeric characters are allowed',
                    'Maximum length should be 100 characters',
                    'Ex:MH-1420110062821',
                  ],
                  pattern: {
                    value: regex.drivingLicReg,
                    message: 'Please enter valid Driving License No.',
                  },
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },
                {
                  type: 'date',
                  name: 'dlValidity',
                  id: 'dlValidity',
                  title: 'Driving License Validity',
                  infoMessage: [
                    'Date is selectable from calendar',
                    'Date can be entered in DD-MM-YY Format',
                    'Ex: 07-04-2024',
                  ],
                  min: 'today',
                  validationProps: {
                    required: 'This is a mandatory field',
                    manual: [
                      {
                        condition: `dlValidity >= today`,
                        message:
                          "Driving License Validity should be greater than or equal to today's date.",
                      },
                    ],
                  },
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
                      title: 'Flat, House No., Building, Company, Apartment',
                      infoMessage: [
                        'Alphanumeric characters are allowed',
                        'Maximum length should be 250  characters',
                        'Ex: Noida sec 1 ',
                      ],
                      pattern: {
                        value: regex.addressReg,
                        message:
                          'Please enter valid Address with max 250 characters',
                      },
                      validationProps: {
                        required: 'This is a mandatory field',
                      },
                    },
                    {
                      type: 'text',
                      name: 'present_tempaddressAREA',
                      id: 'present_tempaddressAREA',
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
                      name: 'present_town',
                      id: 'present_town',
                      title: 'Town/City(Residence)',
                      infoMessage: [
                        'Alphanumeric characters are allowed',
                        'Maximum length should be 50  characters',
                        'Ex: Noida ',
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
                      name: 'present_state',
                      id: 'present_state',
                      title: 'State',
                      infoMessage: [
                        'Alphanumeric characters are allowed',
                        'Maximum length should be 50 characters',
                        'Ex:  UP',
                      ],
                      pattern: {
                        value: regex.adreesschar50,
                        message:
                          'Please enter valid State with max 50 characters',
                      },
                      validationProps: {
                        required: 'This is a mandatory field',
                      },
                    },
                    {
                      type: 'text',
                      name: 'present_pincode',
                      id: 'present_pincode',
                      title: 'Pincode',
                      infoMessage: [
                        'Numeric characters are allowed',
                        'Maximum length should be 6 characters',
                        'Ex: 201301',
                      ],
                      validationProps: {
                        required: 'This is a mandatory field',
                      },
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
              id: 'Permanent_address_information',
              title: 'Permanent Address',
              fields: [
                {
                  type: 'section',
                  layout: {
                    column: 1,
                    spacing: 2,
                    size: 'medium',
                    label: 'fixed',
                  },
                  fields: [
                    {
                      type: 'checkbox',
                      name: 'isSameAddress',
                      id: 'isSameAddress',
                      // defaultValue:true,
                      title: 'Is Permanent Address same as Present Address?',
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
                      name: 'permanent_address',
                      id: 'permanent_address',
                      title: 'Flat, House No., Building, Company, Apartment',
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
                        condition: `dy.isSameAddress == undefined || dy.isSameAddress == false`,
                        field: 'isSameAddress',
                        value: ['undefined', false],
                      },
                    },
                    {
                      type: 'text',
                      name: 'permanent_tempaddressAREA',
                      id: 'permanent_tempaddressAREA',
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
                        condition: `dy.isSameAddress == undefined || dy.isSameAddress == false`,
                        field: 'isSameAddress',
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
                        condition: `dy.isSameAddress == undefined || dy.isSameAddress == false`,
                        field: 'isSameAddress',
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
                        condition: `dy.isSameAddress == undefined || dy.isSameAddress == false`,
                        field: 'isSameAddress',
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
                  infoMessage: [
                    'Should only accept PDF,JPEG files',
                    'File should contain file extension',
                    'Ex:Shub.jpeg',
                  ],
                  accept: 'image/*,.pdf,.doc,.docx',
                  validationProps: {
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
                  disabled: false,
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
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
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
                  infoMessage: [
                    'Should only accept PDF,JPEG files',
                    'File should contain file extension',
                    'Ex:Shub.jpeg',
                  ],
                  dynamic: {
                    field: 'iDCardIssued',
                    value: 'Yes',
                  },
                  accept: 'image/*,.pdf,.doc,.docx',
                  validationProps: {
                    required: 'This is a mandatory field',
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
                  disabled: false,
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
                    required: 'This is a mandatory field',
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
                  disabled: false,
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
                  disabled: false,

                  validationProps: {
                    required: 'This is a mandatory field',
                  },
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
                    'Ex:Shub.jpeg',
                  ],
                  validationProps: {
                    required: 'This is a mandatory field',
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
                  min: 'today',
                  infoMessage: [
                    'Date is selectable from calendar',
                    'Date can be entered in DD-MM-YY Format',
                    'Ex: 07-04-2022',
                  ],
                  validationProps: {
                    required: 'This is a mandatory field',
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
                  // validationProps: {
                  //   required: 'This is a mandatory field'

                  // },
                  options: [
                    {title: 'Yes', value: 'YES'},
                    {title: 'No', value: 'NO'},
                  ],
                },
                {
                  type: 'text',
                  name: 'badgeNo',
                  id: 'badgeNo',
                  title: 'Badge Number',
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
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },
                {
                  type: 'date',
                  name: 'badgeExpDate',
                  id: 'badgeExpDate',
                  title: 'Badge Expiry Date',
                  infoMessage: [
                    'Date is selectable from calendar',
                    'Date can be entered in DD-MM-YY Format',
                    'Ex: 07-04-1992',
                  ],
                  min: 'today',
                  validationProps: {
                    required: 'This is a mandatory field',
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
                    required: 'This is a mandatory field',
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
                  title: 'Upload Medical Fitness Certificate',
                  infoMessage: [
                    'Should only accept PDF,JPEG files',
                    'File should contain file extension',
                    'Ex:Shub.jpeg',
                  ],
                  accept: 'image/*,.pdf,.doc,.docx',
                  validationProps: {
                    required: 'This is a mandatory field',
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
                    required: 'This is a mandatory field',
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

  let agencytemplate = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    // title: 'Bank Type',
    description: 'Form for applying Job',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'text',
            name: 'internalAgencyName',
            id: 'internalAgencyName',
            title: 'Agency Name',
            infoMessage: [
              'Only alphabets are allowed.',
              'Maximum length should be 50 characters.',
              'Ex-XYZ.',
            ],
            pattern: {
              value: regex.maxSize50,
              message:
                'Please enter  valid code with alpha-numeric and below 50 characters',
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

  const handleChange = (values) => {
    console.log('values', values?.vendorId?.value);
    setVendorId(values?.vendorId?.value);
  };

  const handleSubmit = (values) => {
    setshowbtn(false);
    if (values.button.toUpperCase() === 'SUBMIT') {
      let dataSet = {};
      let allElem = {};
      let tem = values?.data;

      tem.address = {
        addressName:
          values?.data?.addressOnLicense +
          '++' +
          values?.data?.present_tempaddressAREA,
        pinCode: values?.data?.present_pincode,
        state: values?.data?.present_state,
        city: values?.data?.present_town,
      };

      tem.shelterAddress = {
        addressName:
          values?.data?.permanent_address +
          '++' +
          values?.data?.permanent_tempaddressAREA,
        pinCode: values?.data?.permanent_pincode,
        state: values?.data?.permanent_state,
        city: values?.data?.permanent_town,
      };
      if (tem.isSameAddress === true) {
        tem.shelterAddress = tem.address;
        tem.isPresentSameAsPermanent = 1;
      } else {
        tem.isPresentSameAsPermanent = 0;
      }

      vendorList?.map((e) => {
        if (e?.value == tem?.vendorId) {
          tem.vendorName = e?.vendorName;
          tem.vendorCode = e?.vendorCode;
        }
      });

      if (user?.role == 'VENDOR') {
        tem.vendorId = user?.userList?.profileId;
        tem.vendorName = user?.userList?.userName;
        tem.vendorCode = data?.vendorCode;
      }
      tem.corporateId = user?.userList?.corporateId;
      tem.profileStatus = 'DEFAULT';
      if (tem?.tempshelteredAddress) delete tem?.tempshelteredAddress;
      if (!tem?.photo?.length) delete tem?.photo;
      if (!tem?.dldoc?.length) delete tem?.dldoc;
      if (!tem?.addressdoc?.length) delete tem?.addressdoc;
      if (!tem?.policedoc?.length) delete tem?.policedoc;
      if (!tem?.identitydoc?.length) delete tem?.identitydoc;
      if (!tem?.vaccinecertificate?.length) delete tem?.vaccinecertificate;

      if (tem.present_address) delete tem.present_address;
      if (tem.present_town) delete tem.present_town;
      if (tem.present_state) delete tem.present_state;
      if (tem.present_pincode) delete tem.present_pincode;
      if (tem.permanent_address) delete tem.permanent_address;
      if (tem.permanent_town) delete tem.permanent_town;
      if (tem.permanent_state) delete tem.permanent_state;
      if (tem.permanent_pincode) delete tem.permanent_pincode;
      delete tem.present_tempaddressAREA;
      delete tem.permanent_tempaddressAREA;

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
        url: Api?.driver?.list,
        data: getFormData(dataSet),
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then(function (response) {
          if (response?.data?.status == 200) {
            toast.success(
              `${
                response?.data?.data?.firstName + response?.data?.data?.lastName
              }'s created successfully.`,
            );
            // navigate(`/onboardadmin/driver/driver-listing`);
            close(false);
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

  function SecretFun(search, value) {
    if (search?.toUpperCase().trim() === 'ADD AGENCY') {
      setOpenAgency(true);
    } else return;
  }

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
    if (d?.emailId && d?.emailId.includes('@') && email != d?.emailId) {
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
    if (
      d?.dateofBirth?.split('-')[0] &&
      Number(d?.dateofBirth?.split('-')[0]) >= new Date()?.getFullYear()
    ) {
      setAge('0');
      return;
    }
    const ms = new Date(d?.dateofBirth)?.getTime() - new Date()?.getTime();
    const date = new Date(ms);
    let temm = Math.abs(date.getUTCFullYear() - 1970);
    setAge((temm - 1)?.toString());
  }

  function submitAgency(values) {
    if (values?.button == 'submit') {
      let dataSet = {};
      dataSet = values.data;
      dataSet.status = 'ACTIVE';
      dataSet.tanentId = user?.userList?.tanentId;
      dataSet.corporateId = user?.userList?.corporateId;
      axios
        .post(api.internalagency.addagency, dataSet)
        .then((response) => {
          if (response?.data?.status == '200') {
            setOpenAgency(false);
            toast.success('Created Successfully.');
          } else {
            return;
          }
          setshowbtn(true);
          agencyList();
        })
        .catch((er) => {
          setshowbtn(true);
          toast.error('Something went wrong');
        });
    }
  }

  return (
    <>
      {!showbtn ? <AppLoader /> : null}
      {vendorList && (
        <Steppers
          defaultValues={{
            vendorId: user?.role == 'VENDOR' ? user?.userList?.profileId : null,
          }}
          template={stepperTemplate}
          showbtn={showbtn}
          afterSubmit={handleSubmit}
          onChange={handleChange}
          SecretFun={SecretFun}
          mode='onTouched'
          getOnInput={myGetData}
          setSuccessIcon={[
            {
              name: 'mobileNo',
              value: mobileExists == false && mobileNo?.length == 10,
            },
            {
              name: 'emailId',
              value:
                email?.length && email.includes('@') && emailExists == false,
            },
          ]}
          setVal={[
            {
              name: 'age',
              value: age ? (age != NaN && age != 'NaN' ? age : 0) : '',
            },
          ]}
          clearErr={[
            {name: 'age', value: age && 70 >= Number(age) && Number(age) >= 18},
            {name: 'mobileNo', value: mobileNo?.length == 10 && !mobileExists},
            {name: 'emailId', value: !emailExists},
          ]}
          seterrors={[
            {
              name: 'age',
              type: 'customized',
              message: 'Please enter valid age, 18 to 70',
              error: age && (70 < Number(age) || Number(age) < 18),
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
          icons={{1: <PersonIcon />, 2: <TextSnippetIcon />}}
        />
      )}
      <Dialog
        onClose={handleClose}
        open={openAgency}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '30%',
          },
        }}
      >
        <div>
          <DialogContent style={{padding: '0px'}}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                background: '#f5f2f2',
                height: '4rem',
                paddingRight: '1.5rem',
                paddingLeft: '1.5rem',
              }}
            >
              <h3 style={{marginTop: '1.5rem'}}>Add Agency</h3>
              {/* <CloseIcon onClick={handleClose} style={{ marginTop: "1.4rem", color: "#4f4f4f", fontWeight: "bold" }} /> */}
            </div>
            <div style={{padding: '2rem'}}>
              <SmartForm
                template={agencytemplate}
                // defaultValues={{vendorId : user?.role == "VENDOR" ? user?.userList?.profileId : "" } }
                onSubmit={submitAgency}
                buttons={['submit']}
              />
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </>
  );
};

export default RegisterDriver;
