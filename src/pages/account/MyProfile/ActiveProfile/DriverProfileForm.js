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
import {te} from 'date-fns/locale';
import PersonIcon from '@mui/icons-material/Person';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import SmartForm from '@smart-form';
import {Dialog, DialogContent, DialogTitle} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {LocalConvenienceStoreOutlined} from '@mui/icons-material';
const DriverProfileInfo = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [vendorList, setVendorList] = useState();
  const {user} = useAuthUser();
  const [agency, setAgencyList] = useState([]);
  const [age, setAge] = useState();
  const [showTick, setshowTick] = React.useState();
  const [verifyType, setVerifyType] = useState('');
  const [verifyData, setVerifyData] = useState('');
  const [lastverifiedData, setLastVerifiedData] = useState({
    mob: '',
    email: '',
  });
  const [myOtp, setmyOtp] = useState();
  const [myFormData, setmyFormData] = useState({});
  const id = user.userList.profileId;
  const [showbtn, setshowbtn] = React.useState(true);
  const [otpLoader, setOtpLoader] = useState(false);
  useEffect(() => {
    if (
      user?.userList?.userStatus &&
      user?.userList?.userStatus === 'DEFAULT'
    ) {
      navigate('/my-profile');
    }
    async function fetchData() {
      const baseURL = `${api.driver.list}/${id}`;
      let response = await axios.get(`${baseURL}`);
      let tempo = response?.data?.data;
      tempo.addressOnLicense =
        response?.data?.data?.address?.addressName?.split('++')?.[0];
      tempo.present_tempaddressAREA =
        response?.data?.data?.address?.addressName?.split('++')?.[1];
      tempo.present_town = response?.data?.data?.address?.city;
      tempo.present_state = response?.data?.data?.address?.state;
      tempo.present_pincode = response?.data?.data?.address?.pinCode;
      tempo.permanent_address =
        response?.data?.data?.shelterAddress?.addressName?.split('++')?.[0];
      tempo.permanent_tempaddressAREA =
        response?.data?.data?.shelterAddress?.addressName?.split('++')?.[1];
      tempo.permanent_town = response?.data?.data?.shelterAddress?.city;
      tempo.permanent_state = response?.data?.data?.shelterAddress?.state;
      tempo.permanent_pincode = response?.data?.data?.shelterAddress?.pinCode;
      setData(tempo);
      setLastVerifiedData({
        mob: response?.data?.data?.mobileNo,
        email: response?.data?.data?.emailId,
      });
    }
    fetchData();
  }, [id]);

  function myGetData(d) {
    if (!d?.dateofBirth) {
      setAge('0');
      return;
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

    if (
      myFormData?.mobileNo != d?.mobileNo ||
      myFormData?.emailId != d?.emailId
    ) {
      setmyFormData({emailId: d?.emailId, mobileNo: d?.mobileNo});
    }
  }

  useEffect(() => {
    async function getvendorlist() {
      await axios
        .get(`${api.dropdown.vendor}`)
        .then((res) => {
          let temp = [];
          res?.data?.data?.map((e) => {
            //  + " (" + "vendor code " + "-" + " " + e.vendorCode + ")"
            temp.push({
              title: e.vendorName,
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
            title: 'Enter OTP',
            blocks: 6,
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
                      id: 'photo',
                      title: 'Upload Photograph',
                      accept: 'image/*,.pdf,.doc,.docx',
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
                      type: 'button',
                      name: ' verify ',
                      id: ' verify ',
                      buttonFor: 'mobileNo',
                      title: ' Verify',
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
                      type: 'button',
                      name: 'verify ',
                      id: 'verify ',
                      buttonFor: 'emailId',
                      title: 'Verify ',
                      defaultValue: 'verify ',
                    },
                  ],
                },
                {
                  type: 'autocomplete',
                  name: 'vendorId',
                  id: 'vendorId',
                  title: 'Vendor',
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
              id: 'Permanent_address_information',
              title: 'Permanent Address',
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
                      name: 'isPresentSameAsPermanent',
                      id: 'isPresentSameAsPermanent',
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
                        condition: `dy.isPresentSameAsPermanent == undefined || dy.isPresentSameAsPermanent == false`,
                        field: 'isPresentSameAsPermanent',
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
                  tempFilename: data?.dlcenseDoc,
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
                        required: 'This is a mandatory field',
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
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // },
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
                  infoMessage: [
                    'Should only accept PDF,JPEG files',
                    'File should contain file extension',
                    'e.g.:Shub.jpeg',
                  ],
                  accept: 'image/*,.pdf,.doc,.docx',
                  validationProps: {
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

  const getFormData = (object) =>
    Object.keys(object).reduce((formData, key) => {
      formData.append(key, object[key]);
      return formData;
    }, new FormData());

  const handleSubmit = async (values) => {
    setshowbtn(false);
    if (values.button.toLowerCase() == 'submit') {
      let dataSet = {};
      let allElem = {};
      let tem = values?.data;
      // tem.dlValidity = tem.tedlValidity;
      // delete tem.tedlValidity;
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

      if (tem.isPresentSameAsPermanent === true) {
        tem.shelterAddress = tem.address;
        tem.isPresentSameAsPermanent = 1;
      } else {
        tem.isPresentSameAsPermanent = 0;
      }
      (tem.profileStatus = 'ACTIVE'),
        // tem.vendorId=user?.userList?.tanentId;
        // tem.vendorName=user?.userList?.tanentName;
        // tem.vendorCode=user?.userList?.tanentCode;
        (tem.driverId = data?.id);

      if (!tem?.photo?.length) delete tem.photo;
      if (!tem?.addressdoc?.length) delete tem.addressdoc;
      if (!tem?.identitydoc?.length) delete tem.identitydoc;
      if (!tem?.dldoc?.length) delete tem.dldoc;
      if (!tem?.policedoc?.length) delete tem.policedoc;

      if (tem.permanent_address) delete tem.permanent_address;
      if (tem.permanent_pincode) delete tem.permanent_pincode;
      if (tem.permanent_state) delete tem.permanent_state;
      if (tem.permanent_town) delete tem.permanent_town;

      if (tem.addressName) delete tem.addressName;
      if (tem.present_town) delete tem.present_town;
      if (tem.present_state) delete tem.present_state;
      if (tem.present_pincode) delete tem.present_pincode;
      delete tem.tempshelteredAddress;
      delete tem.present_tempaddressAREA;
      delete tem.permanent_tempaddressAREA;

      Object.keys(tem).map((key) => {
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
        method: 'post',
        url: `${api.baseUri}/user-reg/driver-change`,
        data: getFormData(dataSet),
        headers: {'Content-Type': 'multipart/form-data'},
      })
        .then(function (response) {
          if (response?.data?.status == '200') {
            toast.success('Your profile update request submitted successfully');
            setTimeout(() => {
              window.location.href = `/dashboard`;
            }, 2000);
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

  function SecretFun(search, value) {
    if (search?.toUpperCase() == ' VERIFY') {
      setVerifyType('MOB');
      setOtpLoader(true);
      var instance = axios.create();
      delete instance?.defaults?.headers?.common['vtt_user_signature'];
      instance
        .get(
          Api.baseUri + '/usernotify/notification/singlesms/' + value?.mobileNo,
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
          Api.baseUri +
            '/user-reg/employee-request/savenewdata/' +
            value?.emailId,
        )
        .then((ele) => {
          setOtpLoader(false);
          if (ele?.data) {
            setVerifyData(value?.emailId);
            setmyOtp(ele?.data?.data?.password);
          }
        })
        .catch((err) => {
          setOtpLoader(false);
        });
    } else return;
  }
  return (
    <>
      {!showbtn ? <AppLoader /> : null}

      {data && data.id && vendorList && (
        <>
          <Steppers
            defaultValues={data}
            template={stepperTemplate}
            afterSubmit={handleSubmit}
            SecretFun={SecretFun}
            clearErr={[
              {
                name: 'age',
                value: age && 70 >= Number(age) && Number(age) >= 18,
              },
              {
                name: 'mobileNo',
                value: myFormData?.mobileNo == lastverifiedData?.mob,
              },
              {
                name: 'emailId',
                value: myFormData?.emailId == lastverifiedData?.email,
              },
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
            icons={{1: <PersonIcon />, 2: <TextSnippetIcon />}}
            // setVal={[{ name: "locname", value: data?.shelterAddress?.locName }, { name: "latitude", value: data?.shelterAddress?.latitude }, { name: "longitude", value: data?.shelterAddress?.longitude }]}
            getOnInput={myGetData}
            setVal={[
              // { name: "addressName", value: data?.address?.addressName },
              // { name: "present_town", value: data?.address?.city },
              // { name: "present_state", value: data?.address?.state },
              // { name: "present_pincode", value: data?.address?.pinCode },
              // { name: "permanent_address", value: data?.shelterAddress?.addressName },
              // { name: "permanent_town", value: data?.shelterAddress?.city },
              // { name: "permanent_state", value: data?.shelterAddress?.state },
              // { name: "permanent_pincode", value: data?.shelterAddress?.pinCode },
              {name: 'dlValidity', value: data?.dlValidity?.split('T')[0]},
              {
                name: 'age',
                value: age ? (age != NaN && age != 'NaN' ? age : 0) : '',
              },
            ]}
          />
        </>
      )}
      {}
      {otpLoader == true ? <AppLoader /> : null}
      {verifyType && verifyData ? (
        <Dialog
          onClose={() => {
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

export default DriverProfileInfo;
