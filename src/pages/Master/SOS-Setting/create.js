import React, {useEffect, useState} from 'react';
import SmartForm from '@smart-form';
import regex from '@regex';
import axios from 'axios';
import api from '@api';
import AppLoader from '@crema/core/AppLoader';
import {toast} from 'react-toastify';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {useAuthUser} from '@crema/utility/AuthHooks';

const SOSSetting = ({settingList, getAllSettings}) => {
  const navigate = useNavigate();
  const {user} = useAuthUser();
  const [showbtn, setshowbtn] = React.useState(true);
  const [myActions, setMyActions] = useState([]);
  const permissionCheck = useSelector(({settings}) => settings.permissions);
  useEffect(() => {
    if (!permissionCheck) return;
    let sub_mod = {};
    permissionCheck?.map((el) => {
      if (el.subModuleName == 'SOS Setting') sub_mod = el;
    });
    setMyActions(sub_mod?.actions);
    if (
      (!sub_mod || !sub_mod?.actions?.includes('View')) &&
      user?.userList?.userRole !== 'SUPERADMIN'
    )
      navigate('/error-pages/error-404');
  }, [permissionCheck, user]);

  let template = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    description: 'Form for applying Job',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'setting_information',
        fields: [
          {
            type: 'section',
            layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
            fields: [
              {
                type: 'switchToggle',
                name: 'alertCorpAdmin',
                id: 'alertCorpAdmin',
                title: 'Alert to Corporate Admin',
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
                layout: {column: 2, spacing: 2, size: 'small', label: 'fixed'},
                fields: [
                  {
                    type: 'textarea',
                    name: 'corpAdminSMS',
                    id: 'corpAdminSMS',
                    title: 'SMS body',
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
                      required: 'This is a mandatory field',
                    },
                    dynamic: {
                      field: 'alertCorpAdmin',
                      value: 'YES',
                    },
                  },
                  {
                    type: 'ckeditor',
                    name: 'corpAdminEmail',
                    id: 'corpAdminEmail',
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
                      required: 'This is a mandatory field',
                    },
                    dynamic: {
                      field: 'alertCorpAdmin',
                      value: 'YES',
                    },
                  },
                ],
              },
            ],
          },
          {
            type: 'section',
            layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
            fields: [
              {
                type: 'switchToggle',
                name: 'alertVendor',
                id: 'alertVendor',
                title: 'Alert toVendor',
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
                layout: {column: 2, spacing: 2, size: 'small', label: 'fixed'},
                fields: [
                  {
                    type: 'textarea',
                    name: 'vendorSMS',
                    id: 'vendorSMS',
                    title: 'SMS body',
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
                      required: 'This is a mandatory field',
                    },
                    dynamic: {
                      field: 'alertVendor',
                      value: 'YES',
                    },
                  },
                  {
                    type: 'ckeditor',
                    name: 'vendorEmail',
                    id: 'vendorEmail',
                    title: 'Email Body',
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
                      required: 'This is a mandatory field',
                    },
                    dynamic: {
                      field: 'alertVendor',
                      value: 'YES',
                    },
                  },
                ],
              },
            ],
          },
          {
            type: 'section',
            layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
            fields: [
              {
                type: 'switchToggle',
                name: 'alertManager',
                id: 'alertManager',
                title: 'Alert to Manager',
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
                layout: {column: 2, spacing: 2, size: 'small', label: 'fixed'},
                fields: [
                  {
                    type: 'textarea',
                    name: 'managerSMS',
                    id: 'managerSMS',
                    isSMS: true,
                    boxheight: 14.2,
                    title: 'SMS body',
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
                      required: 'This is a mandatory field',
                    },
                    dynamic: {
                      field: 'alertManager',
                      value: 'YES',
                    },
                  },
                  {
                    type: 'ckeditor',
                    name: 'managerEmail',
                    id: 'managerEmail',
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
                      required: 'This is a mandatory field',
                    },
                    dynamic: {
                      field: 'alertManager',
                      value: 'YES',
                    },
                  },
                ],
              },
            ],
          },
          {
            type: 'section',
            layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
            fields: [
              {
                type: 'switchToggle',
                name: 'displaySOS',
                id: 'displaySOS',
                title: 'Display SOS',
                infoMessage: ['Radio button is selectable', 'e.g.: Always'],
                options: [
                  {title: 'Always', value: 'Always'},
                  {title: 'After Boarding', value: 'After Boarding'},
                ],
                validationProps: {
                  // required: 'This is a mandatory field'
                },
              },
            ],
          },
          {
            type: 'section',
            layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
            fields: [
              {
                type: 'switchToggle',
                name: 'alertEmpOnUpdateIncident',
                id: 'alertEmpOnUpdateIncident',
                title: 'Alert Emp on Update Incident',
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
                type: 'ckeditor',
                name: 'emailBodyEmpOnUpdateIncident',
                id: 'emailBodyEmpOnUpdateIncident',
                title: 'Email Body',
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
                  required: 'This is a mandatory field',
                },
                dynamic: {
                  field: 'alertEmpOnUpdateIncident',
                  value: 'YES',
                },
              },
            ],
          },
          {
            type: 'section',
            layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
            fields: [
              {
                type: 'switchToggle',
                name: 'emailConsolidatedReport',
                id: 'emailConsolidatedReport',
                title: 'Email Consolidated Report',
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
                type: 'ckeditor',
                name: 'emailBodyConsolidatedReport',
                id: 'emailBodyConsolidatedReport',
                title: 'Email Body',
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
                  required: 'This is a mandatory field',
                },
                dynamic: {
                  field: 'emailConsolidatedReport',
                  value: 'YES',
                },
              },
            ],
          },
          {
            type: 'section',
            layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
            fields: [
              {
                type: 'switchToggle',
                name: 'initiateCallOnSOS',
                id: 'initiateCallOnSOS',
                title: 'Initiate Call on SOS',
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
          {
            type: 'section',
            layout: {column: 3, spacing: 2, size: 'small', label: 'fixed'},
            fields: [
              {
                type: 'text',
                name: 'sosPhoneNumberOne',
                id: 'sosPhoneNumberOne',
                isNumber: true,
                maxChar: 10,
                title: 'Level One Phone Number',
                pattern: {
                  value: regex.phoneReg,
                  message: 'Please enter valid phone number',
                },
                infoMessage: [
                  'Only numeric value allowed',
                  'Maximum length should be 10 characters',
                  'e.g.:9000000000',
                ],
                validationProps: {
                  required: 'This is a mandatory field',
                },
                dynamic: {
                  field: 'initiateCallOnSOS',
                  value: 'YES',
                },
              },
              {
                type: 'text',
                name: 'sosPhoneNumberTwo',
                id: 'sosPhoneNumberTwo',
                isNumber: true,
                maxChar: 10,
                title: 'Level Two Phone Number',
                pattern: {
                  value: regex.phoneReg,
                  message: 'Please enter valid phone number',
                },
                infoMessage: [
                  'Only numeric value allowed',
                  'Maximum length should be 10 characters',
                  'e.g.:9000000000',
                ],
                validationProps: {
                  required: 'This is a mandatory field',
                },
                dynamic: {
                  field: 'initiateCallOnSOS',
                  value: 'YES',
                },
              },
              {
                type: 'text',
                name: 'sosPhoneNumberThree',
                id: 'sosPhoneNumberThree',
                isNumber: true,
                maxChar: 10,
                title: 'Level Three Phone Number',
                pattern: {
                  value: regex.phoneReg,
                  message: 'Please enter valid phone number',
                },
                infoMessage: [
                  'Only numeric value allowed',
                  'Maximum length should be 10 characters',
                  'e.g.:9000000000',
                ],
                validationProps: {
                  required: 'This is a mandatory field',
                },
                dynamic: {
                  field: 'initiateCallOnSOS',
                  value: 'YES',
                },
              },
            ],
          },
          {
            type: 'section',
            layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
            fields: [
              {
                type: 'switchToggle',
                name: 'incidenetEscalationMatrix',
                id: 'incidenetEscalationMatrix',
                title: 'Incident Escalation Matrix',
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
                    type: 'text',
                    name: 'incidenetEscalationMatrixEmailIdOne',
                    id: 'incidenetEscalationMatrixEmailIdOne',
                    title: 'Level One Email Id',
                    pattern: {
                      value: regex.emailReg,
                      message: 'Please enter valid phone number',
                    },
                    infoMessage: [
                      'Alpha-numeric with special char is allowed',
                      'e.g.: xyz@gmail.com',
                    ],
                    validationProps: {
                      required: 'This is a mandatory field',
                    },
                    dynamic: {
                      field: 'incidenetEscalationMatrix',
                      value: 'YES',
                    },
                  },
                  {
                    type: 'text',
                    name: 'incidenetEscalationMatrixEmailIdTwo',
                    id: 'incidenetEscalationMatrixEmailIdTwo',
                    title: 'Level Two Email Id',
                    pattern: {
                      value: regex.emailReg,
                      message: 'Please enter valid email id',
                    },
                    infoMessage: [
                      'Alpha-numeric with special char is allowed',
                      'e.g.: xyz@gmail.com',
                    ],
                    validationProps: {
                      required: 'This is a mandatory field',
                    },
                    dynamic: {
                      field: 'incidenetEscalationMatrix',
                      value: 'YES',
                    },
                  },
                  {
                    type: 'text',
                    name: 'incidenetEscalationMatrixEmailIdThree',
                    id: 'incidenetEscalationMatrixEmailIdThree',
                    title: 'Level Three Email Id',
                    pattern: {
                      value: regex.emailReg,
                      message: 'Please enter valid email id',
                    },
                    infoMessage: [
                      'Alpha-numeric with special char is allowed',
                      'e.g.: xyz@gmail.com',
                    ],
                    validationProps: {
                      required: 'This is a mandatory field',
                    },
                    dynamic: {
                      field: 'incidenetEscalationMatrix',
                      value: 'YES',
                    },
                  },
                ],
              },
              {
                type: 'section',
                layout: {column: 3, spacing: 2, size: 'small', label: 'fixed'},
                fields: [
                  {
                    type: 'text',
                    name: 'incidenetEscalationMatrixETAOne',
                    id: 'incidenetEscalationMatrixETAOne',
                    title: 'Level One ETA (Minutes)',
                    isNumber: true,
                    maxChar: 3,
                    infoMessage: [
                      'Only numeric value allowed',
                      'Maximum length should be 3 characters',
                      'e.g.: 120',
                    ],
                    validationProps: {
                      required: 'This is a mandatory field',
                    },
                    dynamic: {
                      field: 'incidenetEscalationMatrix',
                      value: 'YES',
                    },
                  },
                  {
                    type: 'text',
                    name: 'incidenetEscalationMatrixETATwo',
                    id: 'incidenetEscalationMatrixETATwo',
                    title: 'Level Two ETA (Minutes)',
                    isNumber: true,
                    maxChar: 3,
                    infoMessage: [
                      'Only numeric value allowed',
                      'Maximum length should be 3 characters',
                      'e.g.: 120',
                    ],
                    validationProps: {
                      required: 'This is a mandatory field',
                    },
                    dynamic: {
                      field: 'incidenetEscalationMatrix',
                      value: 'YES',
                    },
                  },
                  {
                    type: 'text',
                    name: 'incidenetEscalationMatrixETAThree',
                    id: 'incidenetEscalationMatrixETAThree',
                    title: 'Level Three ETA (Minutes)',
                    isNumber: true,
                    maxChar: 3,
                    infoMessage: [
                      'Only numeric value allowed',
                      'Maximum length should be 3 characters',
                      'e.g.: 120',
                    ],
                    validationProps: {
                      required: 'This is a mandatory field',
                    },
                    dynamic: {
                      field: 'incidenetEscalationMatrix',
                      value: 'YES',
                    },
                  },
                ],
              },
              {
                type: 'section',
                layout: {column: 3, spacing: 2, size: 'small', label: 'fixed'},
                fields: [
                  {
                    type: 'ckeditor',
                    name: 'incidenetEscalationMatrixEmailBodyOne',
                    id: 'incidenetEscalationMatrixEmailBodyOne',
                    title: 'Incident Escalation Matrix Email Body (Lvl: 1)',
                    pattern: {
                      value: regex.maxSize250,
                      message:
                        'Please enter valid message with alpha-numeric and below 50 characters',
                    },
                    infoMessage: [
                      'Alphanumeric with style characters are allowed',
                      'Maximum length should be 250 characters',
                      'e.g.: This is my message... ',
                    ],
                    validationProps: {
                      required: 'This is a mandatory field',
                    },
                    dynamic: {
                      field: 'incidenetEscalationMatrix',
                      value: 'YES',
                    },
                  },
                  {
                    type: 'ckeditor',
                    name: 'incidenetEscalationMatrixEmailBodyTwo',
                    id: 'incidenetEscalationMatrixEmailBodyTwo',
                    title: 'Incident Escalation Matrix Email Body (Lvl: 2)',
                    pattern: {
                      value: regex.maxSize250,
                      message:
                        'Please enter valid message with alpha-numeric and below 50 characters',
                    },
                    infoMessage: [
                      'Alphanumeric with style characters are allowed',
                      'Maximum length should be 250 characters',
                      'e.g.: This is my message... ',
                    ],
                    validationProps: {
                      required: 'This is a mandatory field',
                    },
                    dynamic: {
                      field: 'incidenetEscalationMatrix',
                      value: 'YES',
                    },
                  },
                  {
                    type: 'ckeditor',
                    name: 'incidenetEscalationMatrixEmailBodyThree',
                    id: 'incidenetEscalationMatrixEmailBodyThree',
                    title: 'Incident Escalation Matrix Email Body (Lvl: 3)',
                    pattern: {
                      value: regex.maxSize250,
                      message:
                        'Please enter valid message with alpha-numeric and below 50 characters',
                    },
                    infoMessage: [
                      'Alphanumeric with style characters are allowed',
                      'Maximum length should be 250 characters',
                      'e.g.: This is my message... ',
                    ],
                    validationProps: {
                      required: 'This is a mandatory field',
                    },
                    dynamic: {
                      field: 'incidenetEscalationMatrix',
                      value: 'YES',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
  const handleSubmit = async (values) => {
    setshowbtn(false);
    if (values.button?.toUpperCase() == 'SUBMIT') {
      let postData = values?.data;
      axios
        .post(api.sos.sosSettingSave, postData)
        .then((res) => {
          setshowbtn(true);
          if (res?.data?.status == '200') {
            toast.success('SOS setting Created successfully.');
            getAllSettings();
            window.location.reload();
          } else {
            toast.error(res?.data?.message || 'Something went wrong.');
          }
        })
        .catch((err) => {
          toast.error('Something went wrong.');
          setshowbtn(true);
        });
    }

    if (values.button.toUpperCase() === 'UPDATE') {
      let postData = values?.data;
      axios
        .put(api.sos.sosSettingUpdate, postData)
        .then((res) => {
          setshowbtn(true);
          if (res?.data?.status == '200') {
            toast.success('SOS setting Updated successfully.');
            getAllSettings();
            window.location.reload();
          } else {
            toast.error(res?.data?.message || 'Something went wrong.');
          }
        })
        .catch((err) => {
          toast.error('Something went wrong.');
          setshowbtn(true);
        });
    }
  };
  return (
    <>
      {!showbtn ? <AppLoader /> : null}
      {settingList ? (
        <SmartForm
          defaultValues={settingList?.length ? settingList[0] : {}}
          template={template}
          onSubmit={handleSubmit}
          buttons={
            settingList?.length
              ? myActions?.includes('Edit')
                ? ['update']
                : null
              : myActions?.includes('Create')
              ? ['submit']
              : null
          }
        />
      ) : null}
    </>
  );
};

export default SOSSetting;
