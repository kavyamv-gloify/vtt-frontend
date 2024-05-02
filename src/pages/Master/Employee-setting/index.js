import React, {useState, useEffect} from 'react';
import SmartForm from '@smart-form';
import regex from '@regex';
import {useNavigate} from 'react-router-dom';
import CustomLabel from 'pages/common/CustomLabel';
import {useSelector} from 'react-redux';
import {Grid} from '@mui/material';
import Api from '@api';
import axios from 'axios';
import AppLoader from '@crema/core/AppLoader';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {toast} from 'react-toastify';
import {useParams} from 'react-router-dom';
const index = () => {
  const [showbtn, setshowbtn] = React.useState(true);
  const [data, setData] = useState({});
  const [corporate, setCorporate] = useState();
  const {id} = useParams();
  const employeeField = [
    {title: 'Photo', value: 'photo'},
    {title: 'Business Unit', value: 'businessUnit'},
    {title: 'First Name & Last Name', value: 'employeeFullName'},
    {title: 'Mobile No.', value: 'mobileNo'},
    {title: 'Alternate Number ', value: 'alternateContactNo'},
    {title: 'Email Id', value: 'emailId'},
    {title: 'Employee Code', value: 'employeeCode'},
    {title: 'Gender', value: 'gender'},
    {title: 'Is Vaccinated', value: 'isVaccinated'},
    {title: 'Department', value: 'department'},
    {title: 'Shift Name', value: 'shiftName'},
    {title: 'Designation', value: 'designation'},
    {title: 'Cost Center', value: 'costCenter'},
    {title: 'Specific Need Type', value: 'specificNeedType'},
    {title: 'Is Manager', value: 'roasterManagerFlag'},
    {title: 'Special Employee', value: 'specialEmployee'},
    {title: 'Employee Category', value: 'employeeCategory'},
    {title: 'Office Location', value: 'siteOffice'},
    {title: 'Residence Address', value: 'residenceAddress'},
    // {title: "PickUp Location", value:"pickupLocation"},
    {title: 'Nodal Point', value: 'pickupDropNodalPoint'},
    {title: 'Short Id', value: 'shortId'},
  ];
  useEffect(() => {
    axios
      .get(
        Api.baseUri +
          '/user-reg/employee-setting/get-empSetting-by-corpoarteId/' +
          id,
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          setData(res?.data?.data ?? {});
        }
      })
      .catch((err) => {
        setData({});
      });
  }, []);

  useEffect(() => {
    axios
      .get(Api.baseUri + '/user-reg/corporate-reg?page=0&size=1000')
      .then((res) => {
        if (res?.data?.status == '200') {
          let temp = [];
          res?.data?.data?.body?.CorporateList?.map((el) => {
            temp.push({title: el?.companyName, value: el?.id});
          });
          setCorporate(temp ?? []);
        } else {
          setCorporate([]);
        }
      })
      .catch((err) => {
        setCorporate([]);
      });
  }, []);

  let template = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    // title: 'Roster Setting',
    description: 'Form for applying Job',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        title: 'Contact',
        fields: [
          {
            type: 'section',
            layout: {column: 1, spacing: 2, size: 'medium', label: 'fixed'},
            fields: [
              {
                type: 'text',
                name: 'transportDeskContact',
                id: 'transportDeskContact',
                maxChar: 10,
                isNumber: true,
                title: 'Transport Desk contact',
                infoMessage: ['Radio button is selectable', 'e.g.: yes'],
                validationProps: {
                  // required: 'This is a mandatory field'
                },
              },
            ],
          },
        ],
      },
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        title: 'IVR',
        fields: [
          {
            type: 'section',
            layout: {column: 1, spacing: 2, size: 'medium', label: 'fixed'},
            fields: [
              {
                type: 'switchToggle',
                name: 'canEmpCallDriverThroughCallMasking',
                id: ' canEmpCallDriverThroughCallMasking',
                title: 'Can employee call driver through call masking',
                infoMessage: ['Radio button is selectable', 'e.g.: yes'],
                options: [
                  {title: 'Yes', value: 'YES'},
                  {title: 'No', value: 'NO'},
                ],
                validationProps: {
                  // required: 'This is a mandatory field'
                },
              },
            ],
          },
        ],
      },
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        title: 'Feedback',
        fields: [
          {
            type: 'section',
            layout: {column: 1, spacing: 2, size: 'medium', label: 'fixed'},
            fields: [
              {
                type: 'switchToggle',
                name: 'emailCorpAdminOnTripFeedbackEveryday',
                id: 'emailCorpAdminOnTripFeedbackEveryday',
                title: 'Email corporate admin on trip feedback everyday',
                infoMessage: ['Radio button is selectable', 'e.g.: yes'],
                options: [
                  {title: 'Yes', value: 'YES'},
                  {title: 'No', value: 'NO'},
                ],
                validationProps: {
                  // required: 'This is a mandatory field'
                },
              },
              {
                type: 'switchToggle',
                name: 'emailVendorOnTripFeedbackEveryday',
                id: 'emailVendorOnTripFeedbackEveryday',
                title: 'Email vendor on trip feedback everyday',
                infoMessage: ['Radio button is selectable', 'e.g.: yes'],
                options: [
                  {title: 'Yes', value: 'YES'},
                  {title: 'No', value: 'NO'},
                ],
                validationProps: {
                  // required: 'This is a mandatory field'
                },
              },
              {
                type: 'switchToggle',
                name: 'tripFeedback',
                id: 'tripFeedback',
                title: 'Allow trip feedback',
                infoMessage: ['Radio button is selectable', 'e.g.: yes'],
                options: [
                  {title: 'Yes', value: 'YES'},
                  {title: 'No', value: 'NO'},
                ],
                validationProps: {
                  // required: 'This is a mandatory field'
                },
              },

              {
                type: 'section',
                layout: {column: 3, spacing: 2, size: 'small', label: 'fixed'},
                fields: [
                  {
                    type: 'textarea',
                    name: 'tripFeedbackSMS',
                    id: 'tripFeedbackSMS',
                    title: 'SMS body',
                    isCheckBox: true,
                    isSMS: true,
                    boxheight: 14.2,
                    pattern: {
                      value: regex.maxSize1000,
                      message:
                        'Please enter valid code with alpha-numeric and below 50 characters',
                    },
                    infoMessage: [
                      'Alphanumeric characters are allowed',
                      'Maximum length should be 250 characters',
                      'e.g.:Successfully created',
                    ],
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    dynamic: {
                      field: 'tripFeedback',
                      value: 'YES',
                    },
                  },
                  {
                    type: 'textarea',
                    name: 'tripFeedbackPush',
                    id: 'tripFeedbackPush',
                    title: 'Push Notification body',
                    isCheckBox: true,
                    isSMS: true,
                    boxheight: 14.2,
                    pattern: {
                      value: regex.maxSize1000,
                      message:
                        'Please enter valid code with alpha-numeric and below 50 characters',
                    },
                    infoMessage: [
                      'Alphanumeric characters are allowed',
                      'Maximum length should be 250 characters',
                      'e.g.:Successfully created',
                    ],
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    dynamic: {
                      field: 'tripFeedback',
                      value: 'YES',
                    },
                  },

                  {
                    type: 'ckeditor',
                    name: 'tripFeedbackEmail',
                    id: 'tripFeedbackEmail',
                    isCheckBox: true,
                    title: 'Email body',
                    pattern: {
                      value: regex.maxSize250,
                      message:
                        'Please enter valid code with alpha-numeric and below 50 characters',
                    },
                    infoMessage: [
                      'Alphanumeric characters are allowed',
                      'Maximum length should be 250 characters',
                      'e.g.:Successfully created',
                    ],
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    dynamic: {
                      field: 'tripFeedback',
                      value: 'YES',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        title: 'General',
        fields: [
          {
            type: 'section',
            layout: {column: 1, spacing: 2, size: 'medium', label: 'fixed'},
            fields: [
              {
                type: 'switchToggle',
                name: 'canEmpViewDriverPhoto',
                id: 'canEmpViewDriverPhoto',
                title: 'Can employee view driver photo',
                infoMessage: ['Radio button is selectable', 'e.g.: yes'],
                options: [
                  {title: 'Yes', value: 'YES'},
                  {title: 'No', value: 'NO'},
                ],
                validationProps: {
                  // required: 'This is a mandatory field'
                },
              },
            ],
          },
        ],
      },
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        title: 'Profile Alert',
        fields: [
          {
            type: 'section',
            layout: {column: 1, spacing: 2, size: 'medium', label: 'fixed'},
            fields: [
              {
                type: 'switchToggle',
                name: 'alertEmpOnAddingByCorpAdmin',
                id: 'alertEmpOnAddingByCorpAdmin',
                title: 'Alert employee on adding by corporate admin',
                infoMessage: ['Radio button is selectable', 'e.g.: yes'],
                options: [
                  {title: 'Yes', value: 'YES'},
                  {title: 'No', value: 'NO'},
                ],
                validationProps: {
                  // required: 'This is a mandatory field'
                },
              },

              {
                type: 'section',
                layout: {column: 3, spacing: 2, size: 'small', label: 'fixed'},
                fields: [
                  {
                    type: 'textarea',
                    name: 'alertEmpOnAddingByCorpAdminSMS',
                    id: 'alertEmpOnAddingByCorpAdminSMS',
                    title: 'SMS body',
                    isCheckBox: true,
                    isSMS: true,
                    boxheight: 14.2,
                    pattern: {
                      value: regex.maxSize1000,
                      message:
                        'Please enter valid code with alpha-numeric and below 50 characters',
                    },
                    infoMessage: [
                      'Alphanumeric characters are allowed',
                      'Maximum length should be 250 characters',
                      'e.g.:Successfully created',
                    ],
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    dynamic: {
                      field: 'alertEmpOnAddingByCorpAdmin',
                      value: 'YES',
                    },
                  },
                  {
                    type: 'textarea',
                    name: 'alertEmpOnAddingByCorpAdminPush',
                    id: 'alertEmpOnAddingByCorpAdminPush',
                    title: 'Push Notification body',
                    isCheckBox: true,
                    isSMS: true,
                    boxheight: 14.2,
                    pattern: {
                      value: regex.maxSize1000,
                      message:
                        'Please enter valid code with alpha-numeric and below 50 characters',
                    },
                    infoMessage: [
                      'Alphanumeric characters are allowed',
                      'Maximum length should be 250 characters',
                      'e.g.:Successfully created',
                    ],
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    dynamic: {
                      field: 'alertEmpOnAddingByCorpAdmin',
                      value: 'YES',
                    },
                  },

                  {
                    type: 'ckeditor',
                    name: 'alertEmpOnAddingByCorpAdminEmail',
                    id: 'alertEmpOnAddingByCorpAdminEmail',
                    isCheckBox: true,
                    title: 'Email body',
                    pattern: {
                      value: regex.maxSize250,
                      message:
                        'Please enter valid code with alpha-numeric and below 50 characters',
                    },
                    infoMessage: [
                      'Alphanumeric characters are allowed',
                      'Maximum length should be 250 characters',
                      'e.g.:Successfully created',
                    ],
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    dynamic: {
                      field: 'alertEmpOnAddingByCorpAdmin',
                      value: 'YES',
                    },
                  },
                ],
              },
              {
                type: 'switchToggle',
                name: 'alertToEmpVerifiedProfile',
                id: 'alertToEmpVerifiedProfile',
                title: 'Alert employee after verifying the profile',
                infoMessage: ['Radio button is selectable', 'e.g.: yes'],
                options: [
                  {title: 'Yes', value: 'YES'},
                  {title: 'No', value: 'NO'},
                ],
                validationProps: {
                  // required: 'This is a mandatory field'
                },
              },

              {
                type: 'section',
                layout: {column: 3, spacing: 2, size: 'small', label: 'fixed'},
                fields: [
                  {
                    type: 'textarea',
                    name: 'alertToEmpVerifiedProfileSMS',
                    id: 'alertToEmpVerifiedProfileSMS',
                    title: 'SMS body',
                    isCheckBox: true,
                    isSMS: true,
                    boxheight: 14.2,
                    pattern: {
                      value: regex.maxSize1000,
                      message:
                        'Please enter valid code with alpha-numeric and below 50 characters',
                    },
                    infoMessage: [
                      'Alphanumeric characters are allowed',
                      'Maximum length should be 250 characters',
                      'e.g.:Successfully created',
                    ],
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    dynamic: {
                      field: 'alertToEmpVerifiedProfile',
                      value: 'YES',
                    },
                  },
                  {
                    type: 'textarea',
                    name: 'alertToEmpVerifiedProfilePush',
                    id: 'alertToEmpVerifiedProfilePush',
                    title: 'Push Notification body',
                    isCheckBox: true,
                    isSMS: true,
                    boxheight: 14.2,
                    pattern: {
                      value: regex.maxSize1000,
                      message:
                        'Please enter valid code with alpha-numeric and below 50 characters',
                    },
                    infoMessage: [
                      'Alphanumeric characters are allowed',
                      'Maximum length should be 250 characters',
                      'e.g.:Successfully created',
                    ],
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    dynamic: {
                      field: 'alertToEmpVerifiedProfile',
                      value: 'YES',
                    },
                  },

                  {
                    type: 'ckeditor',
                    name: 'alertToEmpVerifiedProfileEmail',
                    id: 'alertToEmpVerifiedProfileEmail',
                    isCheckBox: true,
                    title: 'Email body',
                    pattern: {
                      value: regex.maxSize250,
                      message:
                        'Please enter valid code with alpha-numeric and below 50 characters',
                    },
                    infoMessage: [
                      'Alphanumeric characters are allowed',
                      'Maximum length should be 250 characters',
                      'e.g.:Successfully created',
                    ],
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    dynamic: {
                      field: 'alertToEmpVerifiedProfile',
                      value: 'YES',
                    },
                  },
                ],
              },
              {
                type: 'text',
                name: 'alertToEmpIfProfileNotVerifiedMoreThanDays',
                id: 'alertToEmpIfProfileNotVerifiedMoreThanDays',
                maxChar: 6,
                isNumber: true,
                title:
                  'Alert employee if the profile is not verfied more than _____ days',
                infoMessage: ['Radio button is selectable', 'e.g.: yes'],
                validationProps: {
                  // required: 'This is a mandatory field'
                },
              },

              {
                type: 'section',
                layout: {column: 3, spacing: 2, size: 'small', label: 'fixed'},
                fields: [
                  {
                    type: 'textarea',
                    name: 'alertToEmpIfProfileNotVerifiedMoreThanDaysSMS',
                    id: 'alertToEmpIfProfileNotVerifiedMoreThanDaysSMS',
                    title: 'SMS body',
                    isCheckBox: true,
                    isSMS: true,
                    boxheight: 14.2,
                    pattern: {
                      value: regex.maxSize1000,
                      message:
                        'Please enter valid code with alpha-numeric and below 50 characters',
                    },
                    infoMessage: [
                      'Alphanumeric characters are allowed',
                      'Maximum length should be 250 characters',
                      'e.g.:Successfully created',
                    ],
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    dynamic: {
                      field: 'alertToEmpIfProfileNotVerifiedMoreThanDays',
                      value: 'YES',
                    },
                  },
                  {
                    type: 'textarea',
                    name: 'alertToEmpIfProfileNotVerifiedMoreThanDaysPush',
                    id: 'alertToEmpIfProfileNotVerifiedMoreThanDaysPush',
                    title: 'Push Notification body',
                    isCheckBox: true,
                    isSMS: true,
                    boxheight: 14.2,
                    pattern: {
                      value: regex.maxSize1000,
                      message:
                        'Please enter valid code with alpha-numeric and below 50 characters',
                    },
                    infoMessage: [
                      'Alphanumeric characters are allowed',
                      'Maximum length should be 250 characters',
                      'e.g.:Successfully created',
                    ],
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    dynamic: {
                      field: 'alertToEmpIfProfileNotVerifiedMoreThanDays',
                      value: 'YES',
                    },
                  },

                  {
                    type: 'ckeditor',
                    name: 'alertToEmpIfProfileNotVerifiedMoreThanDaysEmail',
                    id: 'alertToEmpIfProfileNotVerifiedMoreThanDaysEmail',
                    isCheckBox: true,
                    title: 'Email body',
                    pattern: {
                      value: regex.maxSize250,
                      message:
                        'Please enter valid code with alpha-numeric and below 50 characters',
                    },
                    infoMessage: [
                      'Alphanumeric characters are allowed',
                      'Maximum length should be 250 characters',
                      'e.g.:Successfully created',
                    ],
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    dynamic: {
                      field: 'alertToEmpIfProfileNotVerifiedMoreThanDays',
                      value: 'YES',
                    },
                  },
                ],
              },
              {
                type: 'switchToggle',
                name: 'alertToUserOnReactivatingAccount',
                id: 'alertToUserOnReactivatingAccount',
                title: 'Alert user on reactivating the account',
                infoMessage: ['Radio button is selectable', 'e.g.: yes'],
                options: [
                  {title: 'Yes', value: 'YES'},
                  {title: 'No', value: 'NO'},
                ],
                validationProps: {
                  // required: 'This is a mandatory field'
                },
              },

              {
                type: 'section',
                layout: {column: 3, spacing: 2, size: 'small', label: 'fixed'},
                fields: [
                  {
                    type: 'textarea',
                    name: 'alertToUserOnReactivatingAccountSMS',
                    id: 'alertToUserOnReactivatingAccountSMS',
                    title: 'SMS body',
                    isCheckBox: true,
                    isSMS: true,
                    boxheight: 14.2,
                    pattern: {
                      value: regex.maxSize1000,
                      message:
                        'Please enter valid code with alpha-numeric and below 50 characters',
                    },
                    infoMessage: [
                      'Alphanumeric characters are allowed',
                      'Maximum length should be 250 characters',
                      'e.g.:Successfully created',
                    ],
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    dynamic: {
                      field: 'alertToUserOnReactivatingAccount',
                      value: 'YES',
                    },
                  },
                  {
                    type: 'textarea',
                    name: 'alertToUserOnReactivatingAccountPush',
                    id: 'alertToUserOnReactivatingAccountPush',
                    title: 'Push Notification body',
                    isCheckBox: true,
                    isSMS: true,
                    boxheight: 14.2,
                    pattern: {
                      value: regex.maxSize1000,
                      message:
                        'Please enter valid code with alpha-numeric and below 50 characters',
                    },
                    infoMessage: [
                      'Alphanumeric characters are allowed',
                      'Maximum length should be 250 characters',
                      'e.g.:Successfully created',
                    ],
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    dynamic: {
                      field: 'alertToUserOnReactivatingAccount',
                      value: 'YES',
                    },
                  },

                  {
                    type: 'ckeditor',
                    name: 'alertToUserOnReactivatingAccountEmail',
                    id: 'alertToUserOnReactivatingAccountEmail',
                    isCheckBox: true,
                    title: 'Email body',
                    pattern: {
                      value: regex.maxSize250,
                      message:
                        'Please enter valid code with alpha-numeric and below 50 characters',
                    },
                    infoMessage: [
                      'Alphanumeric characters are allowed',
                      'Maximum length should be 250 characters',
                      'e.g.:Successfully created',
                    ],
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    dynamic: {
                      field: 'alertToUserOnReactivatingAccount',
                      value: 'YES',
                    },
                  },
                ],
              },
              {
                type: 'text',
                name: 'alertToCorpAdminIfEmpProfileIsNotVerifiedMoreThanDays',
                id: 'alertToCorpAdminIfEmpProfileIsNotVerifiedMoreThanDays',
                maxChar: 6,
                isNumber: true,
                title:
                  'Alert corporate Admin if the profile is not verified more than _____ days',
                infoMessage: ['Radio button is selectable', 'e.g.: yes'],

                validationProps: {
                  // required: 'This is a mandatory field'
                },
              },

              {
                type: 'section',
                layout: {column: 3, spacing: 2, size: 'small', label: 'fixed'},
                fields: [
                  {
                    type: 'textarea',
                    name: 'alertDriverAfterAcceptingTripNotStartSMS',
                    id: 'alertDriverAfterAcceptingTripNotStartSMS',
                    title: 'SMS body',
                    isCheckBox: true,
                    isSMS: true,
                    boxheight: 14.2,
                    pattern: {
                      value: regex.maxSize1000,
                      message:
                        'Please enter valid code with alpha-numeric and below 50 characters',
                    },
                    infoMessage: [
                      'Alphanumeric characters are allowed',
                      'Maximum length should be 250 characters',
                      'e.g.:Successfully created',
                    ],
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    dynamic: {
                      field:
                        'alertToCorpAdminIfEmpProfileIsNotVerifiedMoreThanDays',
                      value: 'YES',
                    },
                  },
                  {
                    type: 'textarea',
                    name: 'alertDriverAfterAcceptingTripNotStartPush',
                    id: 'alertDriverAfterAcceptingTripNotStartPush',
                    title: 'Push Notification body',
                    isCheckBox: true,
                    isSMS: true,
                    boxheight: 14.2,
                    pattern: {
                      value: regex.maxSize1000,
                      message:
                        'Please enter valid code with alpha-numeric and below 50 characters',
                    },
                    infoMessage: [
                      'Alphanumeric characters are allowed',
                      'Maximum length should be 250 characters',
                      'e.g.:Successfully created',
                    ],
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    dynamic: {
                      field:
                        'alertToCorpAdminIfEmpProfileIsNotVerifiedMoreThanDays',
                      value: 'YES',
                    },
                  },

                  {
                    type: 'ckeditor',
                    name: 'alertDriverAfterAcceptingTripNotStartEmail',
                    id: 'alertDriverAfterAcceptingTripNotStartEmail',
                    isCheckBox: true,
                    title: 'Email body',
                    pattern: {
                      value: regex.maxSize250,
                      message:
                        'Please enter valid code with alpha-numeric and below 50 characters',
                    },
                    infoMessage: [
                      'Alphanumeric characters are allowed',
                      'Maximum length should be 250 characters',
                      'e.g.:Successfully created',
                    ],
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    dynamic: {
                      field:
                        'alertToCorpAdminIfEmpProfileIsNotVerifiedMoreThanDays',
                      value: 'YES',
                    },
                  },
                ],
              },
              {
                type: 'text',
                name: 'alertToManagerIfEmpProfileIsNotVerifiedMoreThanDays',
                id: 'alertToManagerIfEmpProfileIsNotVerifiedMoreThanDays',
                maxChar: 6,
                isNumber: true,
                title:
                  'Alert manager if the profile is not verified more than ______ days',
                infoMessage: ['Radio button is selectable', 'e.g.: yes'],
                options: [
                  {title: 'Yes', value: 'YES'},
                  {title: 'No', value: 'NO'},
                ],
                validationProps: {
                  // required: 'This is a mandatory field'
                },
              },

              {
                type: 'section',
                layout: {column: 3, spacing: 2, size: 'small', label: 'fixed'},
                fields: [
                  {
                    type: 'textarea',
                    name: 'alertDriverAfterAcceptingTripNotStartSMS',
                    id: 'alertDriverAfterAcceptingTripNotStartSMS',
                    title: 'SMS body',
                    isCheckBox: true,
                    isSMS: true,
                    boxheight: 14.2,
                    pattern: {
                      value: regex.maxSize1000,
                      message:
                        'Please enter valid code with alpha-numeric and below 50 characters',
                    },
                    infoMessage: [
                      'Alphanumeric characters are allowed',
                      'Maximum length should be 250 characters',
                      'e.g.:Successfully created',
                    ],
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    dynamic: {
                      field:
                        'alertToManagerIfEmpProfileIsNotVerifiedMoreThanDays',
                      value: 'YES',
                    },
                  },
                  {
                    type: 'textarea',
                    name: 'alertDriverAfterAcceptingTripNotStartPush',
                    id: 'alertDriverAfterAcceptingTripNotStartPush',
                    title: 'Push Notification body',
                    isCheckBox: true,
                    isSMS: true,
                    boxheight: 14.2,
                    pattern: {
                      value: regex.maxSize1000,
                      message:
                        'Please enter valid code with alpha-numeric and below 50 characters',
                    },
                    infoMessage: [
                      'Alphanumeric characters are allowed',
                      'Maximum length should be 250 characters',
                      'e.g.:Successfully created',
                    ],
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    dynamic: {
                      field:
                        'alertToManagerIfEmpProfileIsNotVerifiedMoreThanDays',
                      value: 'YES',
                    },
                  },

                  {
                    type: 'ckeditor',
                    name: 'alertDriverAfterAcceptingTripNotStartEmail',
                    id: 'alertDriverAfterAcceptingTripNotStartEmail',
                    isCheckBox: true,
                    title: 'Email body',
                    pattern: {
                      value: regex.maxSize250,
                      message:
                        'Please enter valid code with alpha-numeric and below 50 characters',
                    },
                    infoMessage: [
                      'Alphanumeric characters are allowed',
                      'Maximum length should be 250 characters',
                      'e.g.:Successfully created',
                    ],
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    dynamic: {
                      field:
                        'alertToManagerIfEmpProfileIsNotVerifiedMoreThanDays',
                      value: 'YES',
                    },
                  },
                ],
              },
              {
                type: 'switchToggle',
                name: 'alertOnApprovePendingRequest',
                id: 'alertOnApprovePendingRequest',
                title: 'Alert on approving the pending request',
                infoMessage: ['Radio button is selectable', 'e.g.: yes'],
                options: [
                  {title: 'Yes', value: 'YES'},
                  {title: 'No', value: 'NO'},
                ],
                validationProps: {
                  // required: 'This is a mandatory field'
                },
              },

              {
                type: 'section',
                layout: {column: 3, spacing: 2, size: 'small', label: 'fixed'},
                fields: [
                  {
                    type: 'textarea',
                    name: 'alertOnApprovePendingRequestSMS',
                    id: 'alertOnApprovePendingRequestSMS',
                    title: 'SMS body',
                    isCheckBox: true,
                    isSMS: true,
                    boxheight: 14.2,
                    pattern: {
                      value: regex.maxSize1000,
                      message:
                        'Please enter valid code with alpha-numeric and below 50 characters',
                    },
                    infoMessage: [
                      'Alphanumeric characters are allowed',
                      'Maximum length should be 250 characters',
                      'e.g.:Successfully created',
                    ],
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    dynamic: {
                      field: 'alertOnApprovePendingRequest',
                      value: 'YES',
                    },
                  },
                  {
                    type: 'textarea',
                    name: 'alertOnApprovePendingRequestPush',
                    id: 'alertOnApprovePendingRequestPush',
                    title: 'Push Notification body',
                    isCheckBox: true,
                    isSMS: true,
                    boxheight: 14.2,
                    pattern: {
                      value: regex.maxSize1000,
                      message:
                        'Please enter valid code with alpha-numeric and below 50 characters',
                    },
                    infoMessage: [
                      'Alphanumeric characters are allowed',
                      'Maximum length should be 250 characters',
                      'e.g.:Successfully created',
                    ],
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    dynamic: {
                      field: 'alertOnApprovePendingRequest',
                      value: 'YES',
                    },
                  },

                  {
                    type: 'ckeditor',
                    name: 'alertOnApprovePendingRequestEmail',
                    id: 'alertOnApprovePendingRequestEmail',
                    isCheckBox: true,
                    title: 'Email body',
                    pattern: {
                      value: regex.maxSize250,
                      message:
                        'Please enter valid code with alpha-numeric and below 50 characters',
                    },
                    infoMessage: [
                      'Alphanumeric characters are allowed',
                      'Maximum length should be 250 characters',
                      'e.g.:Successfully created',
                    ],
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    dynamic: {
                      field: 'alertOnApprovePendingRequest',
                      value: 'YES',
                    },
                  },
                ],
              },
              {
                type: 'switchToggle',
                name: 'sendListOfUnverifiedUserToCorpAdminEveryday',
                id: 'sendListOfUnverifiedUserToCorpAdminEveryday',
                title:
                  'Send the list of unverified user to corporate admin eveyday',
                infoMessage: ['Radio button is selectable', 'e.g.: yes'],
                options: [
                  {title: 'Yes', value: 'YES'},
                  {title: 'No', value: 'NO'},
                ],
                validationProps: {
                  // required: 'This is a mandatory field'
                },
              },

              {
                type: 'section',
                layout: {column: 3, spacing: 2, size: 'small', label: 'fixed'},
                fields: [
                  {
                    type: 'ckeditor',
                    name: 'sendListOfUnverifiedUserToCorpAdminEverydayEmail',
                    id: 'sendListOfUnverifiedUserToCorpAdminEverydayEmail',
                    isCheckBox: true,
                    title: 'Email body',
                    pattern: {
                      value: regex.maxSize250,
                      message:
                        'Please enter valid code with alpha-numeric and below 50 characters',
                    },
                    infoMessage: [
                      'Alphanumeric characters are allowed',
                      'Maximum length should be 250 characters',
                      'e.g.:Successfully created',
                    ],
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    dynamic: {
                      field: 'sendListOfUnverifiedUserToCorpAdminEveryday',
                      value: 'YES',
                    },
                  },
                ],
              },
              {
                type: 'switchToggle',
                name: ' deActivateAccountIfUserIdle',
                id: ' deActivateAccountIfUserIdle',
                title: 'Deactivate the idle account',
                infoMessage: ['Radio button is selectable', 'e.g.: yes'],
                options: [
                  {title: 'Yes', value: 'YES'},
                  {title: 'No', value: 'NO'},
                ],
                validationProps: {
                  // required: 'This is a mandatory field'
                },
              },
              {
                type: 'text',
                name: 'deActivateAccountIfUserIdleMoreThanDays',
                id: 'deActivateAccountIfUserIdleMoreThanDays',
                title:
                  'Deactivate the account if user account idle for more than ____ days',
                infoMessage: ['Radio button is selectable', 'e.g.: yes'],
                dynamic: {
                  field: ' deActivateAccountIfUserIdle',
                  value: 'YES',
                },
                validationProps: {
                  // required: 'This is a mandatory field'
                },
              },

              {
                type: 'section',
                layout: {column: 3, spacing: 2, size: 'small', label: 'fixed'},
                fields: [
                  {
                    type: 'textarea',
                    name: 'deActivateAccountIfUserIdleMoreThanDaysSMS',
                    id: 'deActivateAccountIfUserIdleMoreThanDaysSMS',
                    title: 'SMS body',
                    isCheckBox: true,
                    isSMS: true,
                    boxheight: 14.2,
                    pattern: {
                      value: regex.maxSize1000,
                      message:
                        'Please enter valid code with alpha-numeric and below 50 characters',
                    },
                    infoMessage: [
                      'Alphanumeric characters are allowed',
                      'Maximum length should be 250 characters',
                      'e.g.:Successfully created',
                    ],
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    dynamic: {
                      field: ' deActivateAccountIfUserIdle',
                      value: 'YES',
                    },
                  },
                  {
                    type: 'textarea',
                    name: 'deActivateAccountIfUserIdleMoreThanDaysPush',
                    id: 'deActivateAccountIfUserIdleMoreThanDaysPush',
                    title: 'Push Notification body',
                    isCheckBox: true,
                    isSMS: true,
                    boxheight: 14.2,
                    pattern: {
                      value: regex.maxSize1000,
                      message:
                        'Please enter valid code with alpha-numeric and below 50 characters',
                    },
                    infoMessage: [
                      'Alphanumeric characters are allowed',
                      'Maximum length should be 250 characters',
                      'e.g.:Successfully created',
                    ],
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    dynamic: {
                      field: ' deActivateAccountIfUserIdle',
                      value: 'YES',
                    },
                  },

                  {
                    type: 'ckeditor',
                    name: 'deActivateAccountIfUserIdleMoreThanDaysEmail',
                    id: 'deActivateAccountIfUserIdleMoreThanDaysEmail',
                    isCheckBox: true,
                    title: 'Email body',
                    pattern: {
                      value: regex.maxSize250,
                      message:
                        'Please enter valid code with alpha-numeric and below 50 characters',
                    },
                    infoMessage: [
                      'Alphanumeric characters are allowed',
                      'Maximum length should be 250 characters',
                      'e.g.:Successfully created',
                    ],
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    dynamic: {
                      field: ' deActivateAccountIfUserIdle',
                      value: 'YES',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        title: 'Profile Update',
        fields: [
          {
            type: 'section',
            layout: {column: 1, spacing: 2, size: 'medium', label: 'fixed'},
            fields: [
              {
                type: 'text',
                name: 'howFrequentlyAllowEmpUpdateHomePickupDropLocation',
                id: 'howFrequentlyAllowEmpUpdateHomePickupDropLocation',
                maxChar: 6,
                isNumber: true,
                title:
                  'How frequently allow the employee to update his/her home pickup drop location',
                // pattern: {
                //   value: regex.maxSize50,
                //   message: 'Please enter valid Name and below 50 characters',
                // },
                validationProps: {
                  //   required: 'This is a mandatory field',
                },
              },
              {
                type: 'switchToggle',
                name: 'approvalForEmpProfileUpdateByCorpAdmin',
                id: 'approvalForEmpProfileUpdateByCorpAdmin',
                title:
                  'Allow the corporateAdmin to update the employee profile',
                options: [
                  {title: 'Yes', value: 'YES'},
                  {title: 'No', value: 'NO'},
                ],
                // pattern: {
                //   value: regex.maxSize50,
                //   message: 'Please enter valid Name and below 50 characters',
                // },
                validationProps: {
                  //   required: 'This is a mandatory field',
                },
              },
              {
                type: 'switchToggle',
                name: 'allowEmpToChangeSiteOffice',
                id: 'allowEmpToChangeSiteOffice',
                title: 'Allow employee to change the siteoffice',
                options: [
                  {title: 'Yes', value: 'YES'},
                  {title: 'No', value: 'NO'},
                ],
                // pattern: {
                //   value: regex.maxSize50,
                //   message: 'Please enter valid Name and below 50 characters',
                // },
                validationProps: {
                  //   required: 'This is a mandatory field',
                },
              },

              {
                type: 'multiSelect',
                name: 'nonEditableAfterEmpProfileVerification',
                id: 'nonEditableAfterEmpProfileVerification',
                title: 'Non-editable field after profile verification',
                options: employeeField ?? [],
                infoMessage: ['Radio button is selectable', 'e.g.: yes'],
                validationProps: {
                  // required: 'This is a mandatory field'
                },
              },
            ],
          },
        ],
      },
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        title: 'Safe Reach',
        fields: [
          {
            type: 'section',
            layout: {column: 1, spacing: 2, size: 'medium', label: 'fixed'},
            fields: [
              {
                type: 'switchToggle',
                name: 'safeReach',
                id: 'safeReach',
                title: 'Alert for safe reach',
                infoMessage: ['Radio button is selectable', 'e.g.: yes'],
                options: [
                  {title: 'Yes', value: 'YES'},
                  {title: 'No', value: 'NO'},
                ],
                validationProps: {
                  // required: 'This is a mandatory field'
                },
              },

              {
                type: 'section',
                layout: {column: 3, spacing: 2, size: 'small', label: 'fixed'},
                fields: [
                  {
                    type: 'textarea',
                    name: 'safeReachSMS',
                    id: 'safeReachSMS',
                    title: 'SMS body',
                    isCheckBox: true,
                    isSMS: true,
                    boxheight: 14.2,
                    pattern: {
                      value: regex.maxSize1000,
                      message:
                        'Please enter valid code with alpha-numeric and below 50 characters',
                    },
                    infoMessage: [
                      'Alphanumeric characters are allowed',
                      'Maximum length should be 250 characters',
                      'e.g.:Successfully created',
                    ],
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    dynamic: {
                      field: 'safeReach',
                      value: 'YES',
                    },
                  },
                  {
                    type: 'textarea',
                    name: 'safeReachPush',
                    id: 'safeReachPush',
                    title: 'Push Notification body',
                    isCheckBox: true,
                    isSMS: true,
                    boxheight: 14.2,
                    pattern: {
                      value: regex.maxSize1000,
                      message:
                        'Please enter valid code with alpha-numeric and below 50 characters',
                    },
                    infoMessage: [
                      'Alphanumeric characters are allowed',
                      'Maximum length should be 250 characters',
                      'e.g.:Successfully created',
                    ],
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    dynamic: {
                      field: 'safeReach',
                      value: 'YES',
                    },
                  },

                  {
                    type: 'ckeditor',
                    name: 'safeReachEmail',
                    id: 'safeReachEmail',
                    isCheckBox: true,
                    title: 'Email body',
                    pattern: {
                      value: regex.maxSize250,
                      message:
                        'Please enter valid code with alpha-numeric and below 50 characters',
                    },
                    infoMessage: [
                      'Alphanumeric characters are allowed',
                      'Maximum length should be 250 characters',
                      'e.g.:Successfully created',
                    ],
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    dynamic: {
                      field: 'safeReach',
                      value: 'YES',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        title: 'SOS',
        fields: [
          {
            type: 'section',
            layout: {column: 1, spacing: 2, size: 'medium', label: 'fixed'},
            fields: [
              {
                type: 'switchToggle',
                name: 'afterPanicSendAdmin',
                id: 'afterPanicSendAdmin',
                title: 'After panic alert to corporate admin',
                infoMessage: ['Radio button is selectable', 'e.g.: yes'],
                options: [
                  {title: 'Yes', value: 'YES'},
                  {title: 'No', value: 'NO'},
                ],
                validationProps: {
                  // required: 'This is a mandatory field'
                },
              },

              {
                type: 'section',
                layout: {column: 3, spacing: 2, size: 'small', label: 'fixed'},
                fields: [
                  {
                    type: 'textarea',
                    name: 'afterPanicSendAdminSMS',
                    id: 'afterPanicSendAdminSMS',
                    title: 'SMS body',
                    isCheckBox: true,
                    isSMS: true,
                    boxheight: 14.2,
                    pattern: {
                      value: regex.maxSize1000,
                      message:
                        'Please enter valid code with alpha-numeric and below 50 characters',
                    },
                    infoMessage: [
                      'Alphanumeric characters are allowed',
                      'Maximum length should be 250 characters',
                      'e.g.:Successfully created',
                    ],
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    dynamic: {
                      field: 'afterPanicSendAdmin',
                      value: 'YES',
                    },
                  },
                  {
                    type: 'textarea',
                    name: 'afterPanicSendAdminPush',
                    id: 'afterPanicSendAdminPush',
                    title: 'Push Notification body',
                    isCheckBox: true,
                    isSMS: true,
                    boxheight: 14.2,
                    pattern: {
                      value: regex.maxSize1000,
                      message:
                        'Please enter valid code with alpha-numeric and below 50 characters',
                    },
                    infoMessage: [
                      'Alphanumeric characters are allowed',
                      'Maximum length should be 250 characters',
                      'e.g.:Successfully created',
                    ],
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    dynamic: {
                      field: 'afterPanicSendAdmin',
                      value: 'YES',
                    },
                  },

                  {
                    type: 'ckeditor',
                    name: 'afterPanicSendAdminEmail',
                    id: 'afterPanicSendAdminEmail',
                    isCheckBox: true,
                    title: 'Email body',
                    pattern: {
                      value: regex.maxSize250,
                      message:
                        'Please enter valid code with alpha-numeric and below 50 characters',
                    },
                    infoMessage: [
                      'Alphanumeric characters are allowed',
                      'Maximum length should be 250 characters',
                      'e.g.:Successfully created',
                    ],
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    dynamic: {
                      field: 'afterPanicSendAdmin',
                      value: 'YES',
                    },
                  },
                ],
              },
              {
                type: 'switchToggle',
                name: 'afterPanicSendManager',
                id: 'afterPanicSendManager',
                title: 'After panic alert to manager',
                infoMessage: ['Radio button is selectable', 'e.g.: yes'],
                options: [
                  {title: 'Yes', value: 'YES'},
                  {title: 'No', value: 'NO'},
                ],
                validationProps: {
                  // required: 'This is a mandatory field'
                },
              },

              {
                type: 'section',
                layout: {column: 3, spacing: 2, size: 'small', label: 'fixed'},
                fields: [
                  {
                    type: 'textarea',
                    name: 'afterPanicSendManagerSMS',
                    id: 'afterPanicSendManagerSMS',
                    title: 'SMS body',
                    isCheckBox: true,
                    isSMS: true,
                    boxheight: 14.2,
                    pattern: {
                      value: regex.maxSize1000,
                      message:
                        'Please enter valid code with alpha-numeric and below 50 characters',
                    },
                    infoMessage: [
                      'Alphanumeric characters are allowed',
                      'Maximum length should be 250 characters',
                      'e.g.:Successfully created',
                    ],
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    dynamic: {
                      field: 'afterPanicSendManager',
                      value: 'YES',
                    },
                  },
                  {
                    type: 'textarea',
                    name: 'afterPanicSendManagerPush',
                    id: 'afterPanicSendManagerPush',
                    title: 'Push Notification body',
                    isCheckBox: true,
                    isSMS: true,
                    boxheight: 14.2,
                    pattern: {
                      value: regex.maxSize1000,
                      message:
                        'Please enter valid code with alpha-numeric and below 50 characters',
                    },
                    infoMessage: [
                      'Alphanumeric characters are allowed',
                      'Maximum length should be 250 characters',
                      'e.g.:Successfully created',
                    ],
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    dynamic: {
                      field: 'afterPanicSendManager',
                      value: 'YES',
                    },
                  },

                  {
                    type: 'ckeditor',
                    name: 'afterPanicSendManagerEmail',
                    id: 'afterPanicSendManagerEmail',
                    isCheckBox: true,
                    title: 'Email body',
                    pattern: {
                      value: regex.maxSize250,
                      message:
                        'Please enter valid code with alpha-numeric and below 50 characters',
                    },
                    infoMessage: [
                      'Alphanumeric characters are allowed',
                      'Maximum length should be 250 characters',
                      'e.g.:Successfully created',
                    ],
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    dynamic: {
                      field: 'afterPanicSendManager',
                      value: 'YES',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        title: 'Trip',
        fields: [
          {
            type: 'section',
            layout: {column: 1, spacing: 2, size: 'medium', label: 'fixed'},
            fields: [
              {
                type: 'switchToggle',
                name: 'canEmpChat',
                id: ' canEmpVicanEmpChatewDriverPhoto',
                title: 'Can employee chat',
                infoMessage: ['Radio button is selectable', 'e.g.: yes'],
                options: [
                  {title: 'Yes', value: 'YES'},
                  {title: 'No', value: 'NO'},
                ],
                validationProps: {
                  // required: 'This is a mandatory field'
                },
              },
            ],
          },
        ],
      },
      {
        type: 'section',
        layout: {column: 2, spacing: 4, size: 'medium', label: 'fixed'},
        fields: [
          {
            type: 'autocomplete',
            name: 'roasterTypeLogin',
            id: 'roasterTypeLogin',
            title: 'Roster Type',
            infoMessage: ['Dropdown values are selectable', 'e.g.: Weekly'],
            options: [
              {title: 'Weekly', value: 'weekly'},
              {title: 'Monthly', value: 'monthly'},
              {title: 'Fortnight', value: 'fortnight'},
            ],
            validationProps: {
              required: 'This is a mandatory field',
            },
            dynamic: {
              field: 'allowDailyChanges',
              value: 'No',
            },
          },
          {
            type: 'autocomplete',
            name: 'weekStartdayLogin',
            id: 'weekStartdayLogin',
            title: 'Week Start Day',
            infoMessage: ['Dropdown values are selectable', 'e.g.: Monday'],
            options: [
              {title: 'Monday', value: 'Monday'},
              {title: 'Tuesday', value: 'Tuesday'},
              {title: 'Wednesday', value: 'Wednesday'},
              {title: 'Thursday', value: 'Thursday'},
              {title: 'Friday', value: 'Friday'},
              {title: 'Saturday', value: 'Saturday'},
              {title: 'Sunday', value: 'Sunday'},
            ],
            validationProps: {
              required: 'This is a mandatory field',
            },
            dynamic: {
              condition: 'dy.allowDailyChanges && dy.roasterTypeLogin',
              field: ['allowDailyChanges', 'roasterTypeLogin'],
              value: ['No', 'weekly'],
            },
          },
          {
            type: 'text',
            disabled: true,
            name: 'tempo',
            id: 'tempo',
            title: 'Roster Start Date',
            defaultValue: '1st of each month',
            infoMessage: ['Nothing to change'],
            dynamic: {
              condition: 'dy.allowDailyChanges && dy.roasterTypeLogin',
              field: ['allowDailyChanges', 'roasterTypeLogin'],
              value: ['No', 'monthly'],
            },
          },
          {
            type: 'text',
            disabled: true,
            name: 'tempo',
            id: 'tempo',
            title: 'Roster Dates',
            defaultValue: '1 to 15 and 16 to last day of the month ',
            infoMessage: ['Nothing to change'],
            dynamic: {
              condition: 'dy.allowDailyChanges && dy.roasterTypeLogin',
              field: ['allowDailyChanges', 'roasterTypeLogin'],
              value: ['No', 'fortnight'],
            },
          },
          {
            type: 'autocomplete',
            name: 'roasterCutOffDay',
            id: 'roasterCutOffDay',
            title: 'Roster Cutoff Day',
            infoMessage: ['Dropdown values are selectable', 'e.g.: Monday'],
            // defaultValue:'Thursday',
            options: [
              {title: 'Monday', value: 'Monday'},
              {title: 'Tuesday', value: 'Tuesday'},
              {title: 'Wednesday', value: 'Wednesday'},
              {title: 'Thursday', value: 'Thursday'},
              {title: 'Friday', value: 'Friday'},
              {title: 'Saturday', value: 'Saturday'},
              {title: 'Sunday', value: 'Sunday'},
            ],
            validationProps: {
              required: 'This is a mandatory field',
            },
            dynamic: {
              condition: 'dy.allowDailyChanges && dy.roasterTypeLogin',
              field: ['allowDailyChanges', 'roasterTypeLogin'],
              value: ['No', 'weekly'],
            },
          },
          {
            type: 'text',
            disabled: true,
            name: 'tempo',
            id: 'tempo',
            title: 'Roster Cutoff Date',
            defaultValue:
              'Last day of previous fortnight (lastday of the mornth or 15th of month)',
            infoMessage: ['Not changeable'],
            dynamic: {
              condition: 'dy.allowDailyChanges && dy.roasterTypeLogin',
              field: ['allowDailyChanges', 'roasterTypeLogin'],
              value: ['No', 'fortnight'],
            },
          },
          {
            type: 'text',
            disabled: true,
            name: 'tempo',
            id: 'tempo',
            title: 'Roster Cutoff Date',
            defaultValue: 'Last day of previous month',
            infoMessage: ['Not changeable'],
            dynamic: {
              condition: 'dy.allowDailyChanges && dy.roasterTypeLogin',
              field: ['allowDailyChanges', 'roasterTypeLogin'],
              value: ['No', 'monthly'],
            },
          },
          {
            type: 'text',
            name: 'roasterCutOffTime',
            id: 'roasterCutOffTime',
            title: 'Roster Cutoff time',
            infoMessage: ['Numeric characters are allowed', 'e.g.: 02:00'],
            input_type: 'time',
            // pattern: {
            //     value: regex.hhmmReg,
            //     message: 'Please enter valid Time (i.e.: 2:00am)'
            // },
            validationProps: {
              required: 'This is a mandatory field',
            },
            dynamic: {
              field: 'allowDailyChanges',
              value: 'No',
            },
          },
        ],
      },
      {
        type: 'section',
        layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
        fields: [
          {
            type: 'text',
            name: 'logoutModifyCutoffTimeinMinutes',
            id: 'logoutModifyCutoffTimeinMinutes',
            title: 'Cut-off time to modify Logout Shift before  (Minutes) ',
            infoMessage: [
              'Dropdown values are selectable',
              'e.g.: Morning(10:00-17:00)',
            ],
            validationProps: {
              required: 'This is a mandatory field',
            },
            dynamic: {
              field: 'allowDailyChanges',
              value: 'Yes',
            },
          },
          {
            type: 'text',
            name: 'logoutCancelCutoffTime',
            id: 'logoutCancelCutoffTime',
            title: 'Cut-off time to cancel Logout Shift before  (Minutes) ',
            infoMessage: ['Numeric Value', 'e.g.: 90'],
            validationProps: {
              required: 'This is a mandatory field',
              manual: [
                {
                  condition: `logoutCancelCutoffTime < logoutModifyCutoffTimeinMinutes`,
                  message: 'Cancel time should be less than modify time.',
                },
              ],
            },
            dynamic: {
              field: 'allowDailyChanges',
              value: 'Yes',
            },
          },
        ],
      },
    ],
  };
  // let template = {
  //   layout: {
  //     column: 1,
  //     spacing: 2,
  //     size: 'medium',
  //     label: 'fixed',
  //     type: 'grid',
  //   },

  //   description: 'Form for applying Job',
  //   sections: [
  //     {
  //       layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
  //       id: 'personal_information',
  //       fields: [
  //

  //
  //
  //
  //

  //
  //

  //

  //

  //

  //

  //

  //

  //

  //
  //

  //

  //
  //
  //
  //
  //
  //
  //         },

  //       ],
  //     },
  //   ],
  // };

  function handleSubmit(val) {
    setshowbtn(false);
    if (val?.button == 'submit') {
      let postData = val.data;
      if (val?.data?.nonEditableAfterEmpProfileVerification?.length == 0) {
        postData.nonEditableAfterEmpProfileVerification = [];
      }

      postData.corporateId = [id];
      axios
        .post(
          Api.baseUri + '/user-reg/employee-setting/save-empSetting',
          postData,
        )
        ?.then((res) => {
          setshowbtn(true);
          if (res?.data?.status == '200') {
            toast.success('Setting submitted successfully');
          }
        })
        .catch((err) => {
          setshowbtn(true);
        });
    }

    if (val?.button == 'update') {
      let postData = val?.data;
      postData.id = data?.id;
      postData.corporateId = [id];

      axios
        .put(
          Api.baseUri + '/user-reg/employee-setting/update-empSetting',
          postData,
        )
        ?.then((res) => {
          setshowbtn(true);
          if (res?.data?.status == '200') {
            toast.success('Setting updated successfully');
          }
        })
        .catch((err) => {
          setshowbtn(true);
        });
    }
  }
  return (
    <>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={8}>
          <CustomLabel
            labelVal='Employee App Setting'
            variantVal='h3-underline'
          />
        </Grid>
      </Grid>
      {!showbtn ? <AppLoader /> : null}
      {corporate && data ? (
        <SmartForm
          defaultValues={data?.id ? data : {}}
          template={template}
          onSubmit={handleSubmit}
          success={showbtn}
          buttons={data?.id ? ['update'] : ['submit']}
        />
      ) : null}
    </>
  );
};

export default index;
