/* eslint-disable */
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Steppers from '@smart-form/stepper';
import {useDispatch, useSelector} from 'react-redux';
import {onAddNewTenent} from 'redux/actions';
import regex from '@regex';
import api from '@api';
import axios from 'axios';
import SmartForm from '@smart-form';
import {toast} from 'react-toastify';
import AppLoader from '@crema/core/AppLoader';
import {useAuthUser} from '@crema/utility/AuthHooks';
import PersonIcon from '@mui/icons-material/Person';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {IoMdReturnLeft} from 'react-icons/io';

const EscortRegister = ({close}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const boardList = useSelector(({ OnboardTenent }) => OnboardTenent.tenentBoardList);
  const [showbtn, setshowbtn] = React.useState(true);
  const [showTick, setshowTick] = React.useState();
  const [mytempifsc, setMytempifsc] = React.useState();
  const [branchData, setbranchData] = React.useState();
  const [bankNameVal, setbankNameVal] = React.useState();
  const [shiftList, setshiftList] = useState();
  const {user} = useAuthUser();
  const [openAgency, setOpenAgency] = useState(false);
  const [button, setButton] = useState();
  const [prefetchValue, setPrefetchValue] = useState();
  const [mobileNo, setMobileNo] = useState();
  const [emailExists, setEmailExists] = useState(false);
  const [mobileExists, setMobileExists] = useState(false);
  const [email, setEmail] = useState();
  const corporateId = user.userList.profileId;
  const [agency, setAgencyList] = useState();

  const CorpId =
    user?.role == 'CORPORATEADMIN'
      ? user?.userList?.profileId
      : user?.userList?.corporateId;
  useEffect(() => {
    getShiftList();
  }, []);

  async function getShiftList() {
    await axios.get(`${api.dropdown.shiftmanagement}`).then((response) => {
      let temp = [];
      response?.data?.data
        ?.map((e) => {
          temp.push({
            title: e.shiftName + '(' + e.shiftStart + '-' + e.shiftEnd + ')',
            value: e.id,
          });
          setshiftList(temp);
        })
        .catch((er) => {
          setshiftList([]);
        });
    });
  }

  useEffect(() => {
    agencyList();
  }, []);
  async function agencyList() {
    axios
      .get(`${api.dropdown.escortagency}`)
      .then((res) => {
        let temp = [];

        res?.data?.data?.map((e) => {
          temp.push({title: e.agencyName, value: e.id});
        });
        setAgencyList(temp ?? []);
      })
      .catch((er) => {
        setAgencyList([]);
      });
  }

  function handleClose() {
    setOpenAgency(false);
  }
  useEffect(() => {
    prefetched();
  });

  function prefetched() {
    if (button == 'clicked') {
      //
      //
      // setPrefetchValue(agency[agency.length-1].value);
    }
  }

  let stepperTemplate = {
    title: 'Escort Registration Form',
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
        title: 'Escort Details',
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
                  disabled: false,
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
                        'Ex-Sharma.',
                      ],
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
                      type: 'file',
                      name: 'photo',
                      id: 'photo',
                      isProfile: true,
                      accept: 'image/*',
                      infoMessage: [
                        'Should only accept PDF,JPEG files',
                        'File should contain file extension',
                        'e.g.:Shub.jpeg',
                      ],
                      title: 'Upload Photograph',
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
                  type: 'section',
                  layout: {
                    column: 1,
                    spacing: 2,
                    size: 'medium',
                    label: 'fixed',
                  },
                  fields: [
                    {
                      type: 'autocomplete',
                      name: 'agency',
                      id: 'agency',
                      // defaultValue: 'test54',
                      title: 'Agency',
                      options: agency ?? [],
                      infoMessage: [
                        'Only alphabets are allowed.',
                        'Maximum length should be 50 characters.',
                        'Ex-Sharma.',
                      ],
                      // pattern: {
                      //   value: regex.maxSize50,
                      //   message: 'Please enter valid agency with max 50 characters'
                      // },
                      validationProps: {
                        required: 'This is a mandatory field',
                      },
                    },
                    // {
                    //   type: 'button',
                    //   name: 'addagency',
                    //   id: 'addagency',
                    //   title: 'Add Agency',
                    //   defaultValue: "Add Agency",

                    // },
                  ],
                },

                {
                  type: 'text',
                  name: 'escortCode',
                  id: 'escortCode',
                  title: 'Escort Id',
                  infoMessage: [
                    'Alphanumeric characters are allowed',
                    'Maximum length should be 30 characters.',
                    'e.g.: BJAJ8595',
                  ],
                  pattern: {
                    value: regex.maxSize30,
                    message:
                      'Please enter valid escort Id with max 30 characters',
                  },
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },

                {
                  type: 'select',
                  name: 'vaccinationStatus',
                  id: 'vaccinationStatus',
                  title: 'Is Vaccinated',
                  infoMessage: [
                    'Dropdown values are selectable',
                    'e.g.: Fully Vaccinated',
                  ],
                  options: [
                    {title: 'Fully Vaccinated', value: 'Fully Vaccinated'},
                    {
                      title: 'Partially Vaccinated',
                      value: 'Partially Vaccinated',
                    },
                    {title: 'Not Vaccinated', value: 'Not Vaccinated'},
                  ],
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },

                {
                  type: 'text',
                  name: 'remarks',
                  id: 'remarks',
                  title: 'Remarks',
                  infoMessage: [
                    'Alphanumeric characters are allowed',
                    'Maximum length should be 50 characters',
                    'e.g.: average, good',
                  ],
                  pattern: {
                    value: regex.maxSize50,
                    message:
                      'Please enter valid remarks with max 50 characters',
                  },
                  validationProps: {
                    // required: 'This is a mandatory field'
                  },
                },
                // {
                //   type: 'autocomplete',
                //   name: 'shiftDetails',
                //   id: 'shiftDetails',
                //   title: 'Shift',
                //   infoMessage: ["Dropdown value are selectable", "Maximum length should be 50 characters", "e.g.:Morning(09:00-18:00)"],
                //   options: shiftList ?? [],
                //   validationProps: {
                //     required: 'This is a mandatory field'
                //   }
                // },
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
                  // validationProps: {
                  //   required: 'This is a mandatory field',
                  // },
                },
                {
                  type: 'text',
                  name: 'shortId',
                  id: 'shortId',
                  title: 'Escort Short Id',
                  // isUpper: true,
                  infoMessage: [
                    'Alphanumeric characters are allowed',
                    'Maximum length should be 16 characters',
                    'e.g.: BJAJ8595',
                  ],
                  pattern: {
                    value: regex.codeReg16,
                    message:
                      'Please enter valid escort Code  with 16 characters',
                  },
                  // validationProps: {
                  //   required: 'This is a mandatory field',
                  // },
                },
                {
                  type: 'text',
                  name: 'tempaddress',
                  id: 'tempaddress',
                  title: 'Flat, House No., Building, Apartment',
                  infoMessage: [
                    'Alphanumeric characters are allowed',
                    'Maximum length should be 100 characters',
                    'e.g.: Noida Sector 48, UP',
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
                    'Alphabetics characters are allowed',
                    'Maximum length should be 30 characters',
                    'e.g.: Noida ',
                  ],
                  pattern: {
                    value: regex.char30,
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
                  title: 'State',
                  infoMessage: [
                    'Alphabetics characters are allowed',
                    'Maximum length should be 30 characters',
                    'e.g.: Uttar Pradesh ',
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
                  title: 'Pincode',
                  infoMessage: [
                    'Numeric characters are allowed',
                    'Maximum length should be 6 characters',
                    'e.g.: 201303 ',
                  ],
                  pattern: {
                    value: regex.pincodeRegex,
                    message: 'Please enter valid Pincode',
                  },
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },

                // {
                //   type: 'mappl',
                //   name: 'tempescort',
                //   id: 'tempescort',
                //   title: 'Escort Location',
                //   infoMessage: ["Alphanumeric characters are allowed", "Maximum length should be 100 characters", "e.g.: Noida Sector 48, UP "],
                //   validationProps: {
                //     required: 'This is a mandatory field'
                //   },

                // },
                // {
                //   type: 'mappl',
                //   name: 'tempofficeLocation',
                //   id: 'tempofficeLocation',
                //   infoMessage: ["Alphanumeric characters are allowed", "Maximum length should be 100 characters", "e.g.: Noida Sector 48, UP "],
                //   title: 'Office Location',
                //   validationProps: {
                //     required: 'This is a mandatory field'
                //   },

                // },
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
                  type: 'section',
                  layout: {
                    column: 2,
                    spacing: 2,
                    size: 'medium',
                    label: 'fixed',
                  },
                  fields: [
                    {
                      type: 'autocomplete',
                      name: 'addressProofDocTpye',
                      id: 'addressProofDocTpye',
                      title: 'Address Proof Type',

                      infoMessage: [
                        'Dropdown values are selectable',
                        'e.g.: Aadhar,Driving License,Passport etc.',
                      ],
                      validationProps: {
                        required: 'This is a mandatory field',
                      },
                      options: [
                        {title: 'Aadhar', value: 'Aadhar'},
                        {title: 'PAN', value: 'PAN'},
                        {title: 'Driving License', value: 'Driving License'},
                        {title: 'Passport', value: 'Passport'},
                        {title: 'Voter ID', value: 'Voter ID'},
                        {title: 'Other', value: 'Other'},
                      ],
                    },
                    {
                      type: 'file',
                      name: 'addressdoc',
                      id: 'addressdoc',
                      title: 'Upload Document',
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
                      type: 'autocomplete',
                      name: 'identityProofDocTpye',
                      id: 'identityProofDocTpye',
                      title: 'Identity Proof Type',
                      infoMessage: [
                        'Dropdown values are selectable',
                        'e.g.: Aadhar,Driving License,Passport etc.',
                      ],
                      validationProps: {
                        required: 'This is a mandatory field',
                      },
                      options: [
                        {title: 'Aadhar', value: 'Aadhar'},
                        {title: 'PAN', value: 'PAN'},
                        {title: 'Driving License', value: 'Driving License'},
                        {title: 'Passport', value: 'Passport'},
                        {title: 'Voter ID', value: 'Voter ID'},
                        {title: 'Other', value: 'Other'},
                      ],
                    },
                    {
                      type: 'file',
                      name: 'identitydoc',
                      id: 'identitydoc',
                      title: 'Upload Document',
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
                      name: 'armsLicence',
                      id: 'armsLicence',
                      title: 'Arms License No.',
                      pattern: {
                        value: regex.maxSize30,
                        message:
                          'Please enter valid Arms License No with max 30 characters',
                      },
                      infoMessage: [
                        'Alphanumeric characters are allowed',
                        'Maximum length should be 30 characters',
                        'e.g.: pistol9695',
                      ],
                      validationProps: {
                        required: 'This is a mandatory field',
                      },
                    },
                    {
                      type: 'radio',
                      name: 'armsStatus',
                      id: 'armsStatus',
                      title: 'Arm Status',
                      infoMessage: [
                        'Radio button is selectable',
                        'e.g.: Verified',
                      ],
                      validationProps: {
                        required: 'This is a mandatory field',
                      },
                      options: [
                        {title: 'Verified', value: 'Verify'},
                        {title: 'Not verifed', value: 'Non-verify'},
                      ],
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
                      type: 'radio',
                      name: 'specialTraings',
                      id: 'specialTraings',
                      title: 'Special Training',
                      validationProps: {
                        required: 'This is a mandatory field',
                      },
                      infoMessage: [
                        'Radio button is selectable',
                        'e.g.: Allow',
                      ],
                      options: [
                        {title: 'Allow', value: 'Allow'},
                        {title: 'Disallow', value: 'Disallow'},
                      ],
                    },
                    {
                      type: 'radio',
                      name: 'policeVerStatus',
                      id: 'policeVerStatus',
                      title: 'Police Verification',
                      infoMessage: ['Radio button is selectable', 'e.g.: Yes'],
                      validationProps: {
                        required: 'This is a mandatory field',
                      },
                      options: [
                        {title: 'Yes', value: 'Yes'},
                        {title: 'No', value: 'No'},
                      ],
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
                      name: 'policeVericationNo',
                      id: 'policeVericationNo',
                      title: 'Police Verification No.',
                      infoMessage: [
                        'Alphanumeric characters are allowed',
                        'Maximum length should be 50 characters',
                        'e.g.: ddjdj9695',
                      ],
                      pattern: {
                        value: regex.maxSize30,
                        message:
                          'Please enter valid Police Verification No. with max 30 characters',
                      },
                      dynamic: {
                        field: 'policeVerStatus',
                        value: 'Yes',
                      },
                      validationProps: {
                        required: 'This is a mandatory field',
                      },
                    },

                    {
                      type: 'file',
                      name: 'policedoc',
                      id: 'policedoc',
                      title: 'Upload Document',
                      infoMessage: [
                        'Should only accept PDF,JPEG files',
                        'File should contain file extension',
                        'e.g.:Shub.jpeg',
                      ],
                      dynamic: {
                        field: 'policeVerStatus',
                        value: 'Yes',
                      },
                      accept: 'image/*,.pdf,.doc,.docx',
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
            name: 'agencyName',
            id: 'agencyName',
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

  const handleChange = (values) => {};
  const handleSubmit = async (values) => {
    //  )
    setshowbtn(false);
    if (values.button.toUpperCase() === 'SUBMIT') {
      let dataSet = {};
      let allElem = {};
      let tem = values?.data;

      if (tem?.emailId?.length == 0) {
        tem.emailId = null;
      }
      (tem.address = {
        pinCode: values?.data?.temppincode,
        state: values?.data?.tempstate,
        city: values?.data?.temptown,
        addressName:
          values?.data?.tempaddress + '++' + values?.data?.tempaddressAREA,
      }),
        (tem.corporateId = CorpId);
      console.log('tem', tem);
      tem.vendorId = user?.userList?.tanentId;
      tem.vendorName = user?.userList?.tanentName;
      tem.vendorCode = user?.userList?.tanentCode;

      // if (tem?.bankNameTemp) delete tem.bankNameTemp;
      if (!tem?.addressdoc?.length) delete tem.addressdoc;
      if (!tem?.identitydoc?.length) delete tem.identitydoc;
      if (!tem?.policedoc?.length) delete tem.policedoc;
      if (!tem?.photo?.length) delete tem.photo;

      delete tem.tempaddress;
      delete tem.temptown;
      delete tem.tempstate;
      delete tem.temppincode;
      delete tem.tempescort;
      delete tem.tempaddressAREA;
      delete tem.tempofficeLocation;

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

      // }

      axios({
        method: 'post',
        url: api.escort.createform,
        data: getFormData(dataSet),
        headers: {'Content-Type': 'multipart/form-data'},
      })
        .then(function (response) {
          if (response?.data?.status == 200) {
            navigate(`/onboardadmin/escort/escort-listing`);
            toast.success(
              `${
                response?.data?.data?.firstName +
                ' ' +
                response?.data?.data?.lastName
              }'s created successfully`,
            );
            // toast.success('Details has been successfully submitted.');
            close(false);
          } else {
            toast.error(response?.data?.message ?? 'Something went wrong');
          }
          setshowbtn(true);
        })
        .catch(function (response) {
          setshowbtn(true);
          toast.error(response?.data?.message ?? 'Something went wrong');
          //handle error
        });
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
    setEmailExists(d?.emailId);
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
  }

  function SecretFun(search, value) {
    if (search?.toUpperCase().trim() === 'ADD AGENCY') {
      setOpenAgency(true);
    } else return;
  }

  function submitAgency(values) {
    if (values?.button.toUpperCase() == 'SUBMIT') {
      let dataSet = {};
      dataSet = values.data;
      dataSet.tenantId = user?.userList?.tanentId;
      dataSet.corporateId = user?.userList?.corporateId;

      axios
        .post(api.agency.addagency, dataSet)
        .then((response) => {
          if (response?.data?.status == '200') {
            setOpenAgency(false);
            // navigate('/Master/bank/table')
            setButton('clicked');
            toast.success('Escort Agency is created successfully');
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
      {agency ? (
        <Steppers
          // defaultValues={temp}
          template={stepperTemplate}
          SecretFun={SecretFun}
          showbtn={showbtn}
          getOnInput={myGetData}
          mode='onTouched'
          clearErr={[
            {name: 'mobileNo', value: mobileNo?.length == 10 && !mobileExists},
            {name: 'emailId', value: !emailExists},
          ]}
          seterrors={[
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
          afterSubmit={handleSubmit}
          onChange={handleChange}
        />
      ) : null}

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
            <div style={{padding: '2rem', paddingTop: 0}}>
              <SmartForm
                template={agencytemplate}
                onSubmit={submitAgency}
                buttons={['submit']}
                // setVal={[{ name: "agency", value: "test54" }, ]}
                mode='onTouched'
              />
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </>
  );
};

export default EscortRegister;
