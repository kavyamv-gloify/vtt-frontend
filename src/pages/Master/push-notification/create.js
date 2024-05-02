import React, {useEffect, useState} from 'react';
import SmartForm from '@smart-form';
import AppLoader from '@crema/core/AppLoader';
import regex from '@regex';
import axios from 'axios';
import {Grid} from '@mui/material';
import Api from '@api';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {toast} from 'react-toastify';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import CustomLabel from 'pages/common/CustomLabel';

const create = () => {
  const navigate = useNavigate();
  const [showbtn, setshowbtn] = React.useState(true);
  const {user} = useAuthUser();
  const [settingList, setSettingList] = React.useState();
  useEffect(() => {
    axios
      .get(Api.setting.notificationSettinggetAll)
      .then((res) => {
        setSettingList(res?.data?.data || {});
      })
      .catch((err) => {
        setSettingList({});
      });
  }, []);
  const [myActions, setMyActions] = useState([]);
  const permissionCheck = useSelector(({settings}) => settings.permissions);
  useEffect(() => {
    if (!permissionCheck) return;
    let sub_mod = {};
    permissionCheck?.map((el) => {
      if (el.subModuleName == 'Push Notification') sub_mod = el;
    });
    setMyActions(sub_mod?.actions);
    if (
      (!sub_mod || !sub_mod?.actions?.includes('View')) &&
      user?.userList?.userRole !== 'SUPERADMIN'
    )
      navigate('/error-pages/error-404');
  }, [permissionCheck, user]);
  // driverApproveByCorporate;
  // driverApproveByCorporateSMS;
  // driverApproveByCorporatePush;
  // driverApproveByCorporateEmail;
  // driverRejectByCorporate;
  // driverRejectByCorporateSMS;
  // driverRejectByCorporatePush;
  // driverRejectByCorporateEmail;
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
              // {
              //     type: 'section',
              //     layout: { column: 1, spacing: 2, size: 'small', label: 'fixed' },
              //     fields: [
              //         {
              //             type: 'switchToggle',
              //             name: 'empSignupApproval',
              //             id: 'empSignupApproval',
              //             title: " Approval",
              //             infoMessage: ["Radio button is selectable", "e.g.: yes"],
              //             options: [
              //                 { title: "Yes", value: "YES" },
              //                 { title: "No", value: "NO" }
              //             ],
              //             validationProps: {
              //                 // required: 'This is a mandatory field'
              //             },
              //         },
              //         {
              //             type: 'section',
              //             layout: { column: 3, spacing: 2, size: 'small', label: 'fixed' },
              //             fields: [
              //                 {
              //                     type: 'textarea',
              //                     name: 'empSignupApprovalSMS',
              //                     id: 'empSignupApprovalSMS',
              //                     title: "SMS body",
              //                     isCheckBox: true,
              //                     isSMS: true,
              //                     boxheight: 14.2,
              //                     pattern: {
              //                         value: regex.maxSize1000,
              //                         message: 'Please enter valid code with alpha-numeric and below 50 characters'
              //                     },
              //                     infoMessage: ["Alphanumeric characters are allowed", "Maximum length should be 250 characters", "e.g.:Successfully created"],
              //                     validationProps: {
              //                         // required: 'This is a mandatory field'
              //                     },
              //                     dynamic: {
              //                         field: 'empSignupApproval',
              //                         value: 'YES'
              //                     },
              //                 },
              //                 {
              //                     type: 'textarea',
              //                     name: 'empSignupApprovalPush',
              //                     id: 'empSignupApprovalPush',
              //                     title: "Push Notification body",
              //                     isCheckBox: true,
              //                     isSMS: true,
              //                     boxheight: 14.2,
              //                     pattern: {
              //                         value: regex.maxSize1000,
              //                         message: 'Please enter valid code with alpha-numeric and below 50 characters'
              //                     },
              //                     infoMessage: ["Alphanumeric characters are allowed", "Maximum length should be 250 characters", "e.g.:Successfully created"],
              //                     validationProps: {
              //                         // required: 'This is a mandatory field'
              //                     },
              //                     dynamic: {
              //                         field: 'empSignupApproval',
              //                         value: 'YES'
              //                     },
              //                 },
              //                 {
              //                     type: 'ckeditor',
              //                     name: 'empSignupApprovalEmail',
              //                     id: 'empSignupApprovalEmail',
              //                     title: "Email body",
              //                     isCheckBox: true,
              //                     pattern: {
              //                         value: regex.maxSize250,
              //                         message: 'Please enter valid code with alpha-numeric and below 50 characters'
              //                     },
              //                     infoMessage: ["Alphanumeric characters are allowed", "Maximum length should be 250 characters", "e.g.:Successfully created"],
              //                     validationProps: {
              //                         // required: 'This is a mandatory field'
              //                     },
              //                     dynamic: {
              //                         field: 'empSignupApproval',
              //                         value: 'YES'
              //                     },
              //                 },
              //             ]
              //         },
              //     ]
              // },
              {
                type: 'section',
                layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
                fields: [
                  {
                    type: 'switchToggle',
                    name: 'driverReqCorporate',
                    id: 'driverReqCorporate',
                    title: 'Alert Corporate Admin on Update Request of Driver',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'driverReqCorporateSMS',
                        id: 'driverReqCorporateSMS',
                        title: 'SMS body',
                        // disabled: true,
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
                          field: 'driverReqCorporate',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'driverReqCorporatePush',
                        id: 'driverReqCorporatePush',
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
                          field: 'driverReqCorporate',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'driverReqCorporateEmail',
                        id: 'driverReqCorporateEmail',
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
                          field: 'driverReqCorporate',
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
                    name: 'empUpdateReqManager',
                    id: 'empUpdateReqManager',
                    title: 'Alert Manager on Update Request of Employee',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'empUpdateReqManagerSMS',
                        id: 'empUpdateReqManagerSMS',
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
                          field: 'empUpdateReqManager',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'empUpdateReqManagerPush',
                        id: 'empUpdateReqManagerPush',
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
                          field: 'empUpdateReqManager',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'empUpdateReqManagerEmail',
                        id: 'empUpdateReqManagerEmail',
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
                          field: 'empUpdateReqManager',
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
                    name: 'rosterPendingReq',
                    id: 'rosterPendingReq',
                    title: 'Alert Manager on Roster Request',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'rosterPendingReqSMS',
                        id: 'rosterPendingReqSMS',
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
                          field: 'rosterPendingReq',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'rosterPendingReqPush',
                        id: 'rosterPendingReqPush',
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
                          field: 'rosterPendingReq',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'rosterPendingReqEmail',
                        id: 'rosterPendingReqEmail',
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
                          field: 'rosterPendingReq',
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
                    name: 'rosterApproval',
                    id: 'rosterApproval',
                    title: 'Alert Employee on Roster Approval/Rejection',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'rosterApprovalSMS',
                        id: 'rosterApprovalSMS',
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
                          field: 'rosterApproval',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'rosterApprovalPush',
                        id: 'rosterApprovalPush',
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
                          field: 'rosterApproval',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'rosterApprovalEmail',
                        id: 'rosterApprovalEmail',
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
                          field: 'rosterApproval',
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
                    name: 'empRosterRaiseCutoffTime',
                    id: 'empRosterRaiseCutoffTime',
                    title: 'Alert Employee for Roster Raise Cutoff Time',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'empRosterRaiseCutoffTimeSMS',
                        id: 'empRosterRaiseCutoffTimeSMS',
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
                          field: 'empRosterRaiseCutoffTime',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'empRosterRaiseCutoffTimePush',
                        id: 'empRosterRaiseCutoffTimePush',
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
                          field: 'empRosterRaiseCutoffTime',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'empRosterRaiseCutoffTimeEmail',
                        id: 'empRosterRaiseCutoffTimeEmail',
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
                          field: 'empRosterRaiseCutoffTime',
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
                    name: 'rosterCancelCutoffTime',
                    id: 'rosterCancelCutoffTime',
                    title: 'Alert Employee for Roster Cancel Cutoff Time',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'rosterCancelCutoffTimeSMS',
                        id: 'rosterCancelCutoffTimeSMS',
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
                          field: 'rosterCancelCutoffTime',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'rosterCancelCutoffTimePush',
                        id: 'rosterCancelCutoffTimePush',
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
                          field: 'rosterCancelCutoffTime',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'rosterCancelCutoffTimeEmail',
                        id: 'rosterCancelCutoffTimeEmail',
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
                          field: 'rosterCancelCutoffTime',
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
                    name: 'leaveRaiseCutoffTime',
                    id: 'leaveRaiseCutoffTime',
                    title: 'Alert Employee for Leave Raise Cutoff Time',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'leaveRaiseCutoffTimeSMS',
                        id: 'leaveRaiseCutoffTimeSMS',
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
                          field: 'leaveRaiseCutoffTime',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'leaveRaiseCutoffTimePush',
                        id: 'leaveRaiseCutoffTimePush',
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
                          field: 'leaveRaiseCutoffTime',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'leaveRaiseCutoffTimeEmail',
                        id: 'leaveRaiseCutoffTimeEmail',
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
                          field: 'leaveRaiseCutoffTime',
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
                    name: 'leaveCancelCutoffTime',
                    id: 'leaveCancelCutoffTime',
                    title: 'Alert Employee for Leave Cancel Cutoff Time',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'leaveCancelCutoffTimeSMS',
                        id: 'leaveCancelCutoffTimeSMS',
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
                          field: 'leaveCancelCutoffTime',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'leaveCancelCutoffTimePush',
                        id: 'leaveCancelCutoffTimePush',
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
                          field: 'leaveCancelCutoffTime',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'leaveCancelCutoffTimeEmail',
                        id: 'leaveCancelCutoffTimeEmail',
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
                          field: 'leaveCancelCutoffTime',
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
                    name: 'leaveRaise',
                    id: 'leaveRaise',
                    title: 'Alert Manager on Leave Raise',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'leaveRaiseSMS',
                        id: 'leaveRaiseSMS',
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
                          field: 'leaveRaise',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'leaveRaisePush',
                        id: 'leaveRaisePush',
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
                          field: 'leaveRaise',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'leaveRaiseEmail',
                        id: 'leaveRaiseEmail',
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
                          field: 'leaveRaise',
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
                    name: 'leaveApproveReject',
                    id: 'leaveApproveReject',
                    title: 'Alert Employee on Leave Acceptance/Rejection',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'leaveApproveRejectSMS',
                        id: 'leaveApproveRejectSMS',
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
                          field: 'leaveApproveReject',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'leaveApproveRejectPush',
                        id: 'leaveApproveRejectPush',
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
                          field: 'leaveApproveReject',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'leaveApproveRejectEmail',
                        id: 'leaveApproveRejectEmail',
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
                          field: 'leaveApproveReject',
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
                    name: 'upcomingHolidays',
                    id: 'upcomingHolidays',
                    title: 'Alert Employee for upcoming holidays',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'upcomingHolidaysSMS',
                        id: 'upcomingHolidaysSMS',
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
                          field: 'upcomingHolidays',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'upcomingHolidaysPush',
                        id: 'upcomingHolidaysPush',
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
                          field: 'upcomingHolidays',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'upcomingHolidaysEmail',
                        id: 'upcomingHolidaysEmail',
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
                          field: 'upcomingHolidays',
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
                    name: 'dailyChangesCutoff',
                    id: 'dailyChangesCutoff',
                    title: 'Alert Employee for Daily Changes Cutoff',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'dailyChangesCutoffSMS',
                        id: 'dailyChangesCutoffSMS',
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
                          field: 'dailyChangesCutoff',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'dailyChangesCutoffPush',
                        id: 'dailyChangesCutoffPush',
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
                          field: 'dailyChangesCutoff',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'dailyChangesCutoffEmail',
                        id: 'dailyChangesCutoffEmail',
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
                          field: 'dailyChangesCutoff',
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
                    name: 'rosterByAdminManager',
                    id: 'rosterByAdminManager',
                    title: 'Alert Employee on Roster Creation by Admin/Manager',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'rosterByAdminManagerSMS',
                        id: 'rosterByAdminManagerSMS',
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
                          field: 'rosterByAdminManager',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'rosterByAdminManagerPush',
                        id: 'rosterByAdminManagerPush',
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
                          field: 'rosterByAdminManager',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'rosterByAdminManagerEmail',
                        id: 'rosterByAdminManagerEmail',
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
                          field: 'rosterByAdminManager',
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
                    name: 'routeGeneration',
                    id: 'routeGeneration',
                    title: 'Alert Employee on Route Generation',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'routeGenerationSMS',
                        id: 'routeGenerationSMS',
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
                          field: 'routeGeneration',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'routeGenerationPush',
                        id: 'routeGenerationPush',
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
                          field: 'routeGeneration',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'routeGenerationEmail',
                        id: 'routeGenerationEmail',
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
                          field: 'routeGeneration',
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
                    name: 'vehicleAssign',
                    id: 'vehicleAssign',
                    title: 'Alert Employee on Vehicle Assign',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'vehicleAssignSMS',
                        id: 'vehicleAssignSMS',
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
                          field: 'vehicleAssign',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'vehicleAssignPush',
                        id: 'vehicleAssignPush',
                        title: 'Push Notification body',
                        isCheckBox: false,
                        isSMS: true,
                        boxheight: 14.2,
                        disabled: true,
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
                          field: 'vehicleAssign',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'vehicleAssignEmail',
                        id: 'vehicleAssignEmail',
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
                          field: 'vehicleAssign',
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
                    name: 'tripStart',
                    id: 'tripStart',
                    title: 'Alert Employee on Trip Start',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'tripStartSMS',
                        id: 'tripStartSMS',
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
                          field: 'tripStart',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'tripStartPush',
                        id: 'tripStartPush',
                        title: 'Push Notification body',
                        isCheckBox: false,
                        isSMS: true,
                        boxheight: 14.2,
                        disabled: true,
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
                          field: 'tripStart',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'tripStartEmail',
                        id: 'tripStartEmail',
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
                          field: 'tripStart',
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
                    name: 'prevEmpPick',
                    id: 'prevEmpPick',
                    title: 'Alert Employee after Previous Employee Pickup',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'prevEmpPickSMS',
                        id: 'prevEmpPickSMS',
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
                          field: 'prevEmpPick',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'prevEmpPickPush',
                        id: 'prevEmpPickPush',
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
                          field: 'prevEmpPick',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'prevEmpPickEmail',
                        id: 'prevEmpPickEmail',
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
                          field: 'prevEmpPick',
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
                    name: 'reachGeofence',
                    id: 'reachGeofence',
                    title: 'Alert Employee on Reaching in Geofence',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'reachGeofenceSMS',
                        id: 'reachGeofenceSMS',
                        title: 'SMS body',
                        isCheckBox: false,
                        isSMS: true,
                        boxheight: 14.2,
                        disabled: true,
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
                          field: 'reachGeofence',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'reachGeofencePush',
                        id: 'reachGeofencePush',
                        title: 'Push Notification body',
                        isCheckBox: false,
                        isSMS: true,
                        boxheight: 14.2,
                        disabled: true,
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
                          field: 'reachGeofence',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'reachGeofenceEmail',
                        id: 'reachGeofenceEmail',
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
                          field: 'reachGeofence',
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
                    name: 'vehicleChange',
                    id: 'vehicleChange',
                    title: 'Alert Employee on Vehicle Re-allocation',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'vehicleChangeSMS',
                        id: 'vehicleChangeSMS',
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
                          field: 'vehicleChange',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'vehicleChangePush',
                        id: 'vehicleChangePush',
                        title: 'Push Notification body',
                        isCheckBox: false,
                        isSMS: true,
                        boxheight: 14.2,
                        disabled: true,
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
                          field: 'vehicleChange',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'vehicleChangeEmail',
                        id: 'vehicleChangeEmail',
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
                          field: 'vehicleChange',
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
                    name: 'driverChange',
                    id: 'driverChange',
                    title: 'Alert Employee on Driver Re-allocation',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'driverChangeSMS',
                        id: 'driverChangeSMS',
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
                          field: 'driverChange',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'driverChangePush',
                        id: 'driverChangePush',
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
                          field: 'driverChange',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'driverChangeEmail',
                        id: 'driverChangeEmail',
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
                          field: 'driverChange',
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
                    name: 'tripCancelCutoff',
                    id: 'tripCancelCutoff',
                    title: 'Alert Employee on Trip Cancellation',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'tripCancelCutoffSMS',
                        id: 'tripCancelCutoffSMS',
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
                          field: 'tripCancelCutoff',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'tripCancelCutoffPush',
                        id: 'tripCancelCutoffPush',
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
                          field: 'tripCancelCutoff',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'tripCancelCutoffEmail',
                        id: 'tripCancelCutoffEmail',
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
                          field: 'tripCancelCutoff',
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
                    name: 'aboutETA',
                    id: 'aboutETA',
                    title: 'Alert for Trip ETA',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'aboutETASMS',
                        id: 'aboutETASMS',
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
                          field: 'aboutETA',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'aboutETAPush',
                        id: 'aboutETAPush',
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
                          field: 'aboutETA',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'aboutETAEmail',
                        id: 'aboutETAEmail',
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
                          field: 'aboutETA',
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
                    name: 'newChat',
                    id: 'newChat',
                    title: 'Alert for New Chat',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'newChatSMS',
                        id: 'newChatSMS',
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
                          field: 'newChat',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'newChatPush',
                        id: 'newChatPush',
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
                          field: 'newChat',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'newChatEmail',
                        id: 'newChatEmail',
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
                          field: 'newChat',
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
                    name: 'tripDetails',
                    id: 'tripDetails',
                    title: 'Alert for New Trip',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'tripDetailsSMS',
                        id: 'tripDetailsSMS',
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
                          field: 'tripDetails',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'tripDetailsPush',
                        id: 'tripDetailsPush',
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
                          field: 'tripDetails',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'tripDetailsEmail',
                        id: 'tripDetailsEmail',
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
                          field: 'tripDetails',
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
                    name: 'tripChanges',
                    id: 'tripChanges',
                    title: 'Alert for Trip Updation',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'tripChangesSMS',
                        id: 'tripChangesSMS',
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
                          field: 'tripChanges',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'tripChangesPush',
                        id: 'tripChangesPush',
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
                          field: 'tripChanges',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'tripChangesEmail',
                        id: 'tripChangesEmail',
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
                          field: 'tripChanges',
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
                    name: 'profileEdit',
                    id: 'profileEdit',
                    title: 'Alert Employee for Profile Changes',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'profileEditSMS',
                        id: 'profileEditSMS',
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
                          field: 'profileEdit',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'profileEditPush',
                        id: 'profileEditPush',
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
                          field: 'profileEdit',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'profileEditEmail',
                        id: 'profileEditEmail',
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
                          field: 'profileEdit',
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
                    name: 'feedback',
                    id: 'feedback',
                    title: 'Alert Employee for Feedback',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'feedbackSMS',
                        id: 'feedbackSMS',
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
                          field: 'feedback',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'feedbackPush',
                        id: 'feedbackPush',
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
                          field: 'feedback',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'feedbackEmail',
                        id: 'feedbackEmail',
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
                          field: 'feedback',
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
                    name: 'pickupPoint',
                    id: 'pickupPoint',
                    title: 'Alert Employee for Pickup Point (Home/Nodal)',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'pickupPointSMS',
                        id: 'pickupPointSMS',
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
                          field: 'pickupPoint',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'pickupPointPush',
                        id: 'pickupPointPush',
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
                          field: 'pickupPoint',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'pickupPointEmail',
                        id: 'pickupPointEmail',
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
                          field: 'pickupPoint',
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
                    name: 'pickupPointDeviation',
                    id: 'pickupPointDeviation',
                    title: 'Alert Employee for Pickup Point Deviation',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'pickupPointDeviationSMS',
                        id: 'pickupPointDeviationSMS',
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
                          field: 'pickupPointDeviation',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'pickupPointDeviationPush',
                        id: 'pickupPointDeviationPush',
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
                          field: 'pickupPointDeviation',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'pickupPointDeviationEmail',
                        id: 'pickupPointDeviationEmail',
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
                          field: 'pickupPointDeviation',
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
                    name: 'empFrequencyToChangeLoc',
                    id: 'empFrequencyToChangeLoc',
                    title: 'Alert Employee for Frequency to Change Location',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'empFrequencyToChangeLocSMS',
                        id: 'empFrequencyToChangeLocSMS',
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
                          field: 'empFrequencyToChangeLoc',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'empFrequencyToChangeLocPush',
                        id: 'empFrequencyToChangeLocPush',
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
                          field: 'empFrequencyToChangeLoc',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'empFrequencyToChangeLocEmail',
                        id: 'empFrequencyToChangeLocEmail',
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
                          field: 'empFrequencyToChangeLoc',
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
                    name: 'upcomingTrip',
                    id: 'upcomingTrip',
                    title: 'Alert Driver for Upcoming Trip',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'upcomingTripSMS',
                        id: 'upcomingTripSMS',
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
                          field: 'upcomingTrip',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'upcomingTripPush',
                        id: 'upcomingTripPush',
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
                          field: 'upcomingTrip',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'upcomingTripEmail',
                        id: 'upcomingTripEmail',
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
                          field: 'upcomingTrip',
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
                    name: 'onTripCancelByEmp',
                    id: 'onTripCancelByEmp',
                    title: 'Alert Driver after Trip Cancelled by Employee',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'onTripCancelByEmpSMS',
                        id: 'onTripCancelByEmpSMS',
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
                          field: 'onTripCancelByEmp',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'onTripCancelByEmpPush',
                        id: 'onTripCancelByEmpPush',
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
                          field: 'onTripCancelByEmp',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'onTripCancelByEmpEmail',
                        id: 'onTripCancelByEmpEmail',
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
                          field: 'onTripCancelByEmp',
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
                    name: 'markNoshowByEmp',
                    id: 'markNoshowByEmp',
                    title: 'Alert Driver after Trip Marked as NOSHOW',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'markNoshowByEmpSMS',
                        id: 'markNoshowByEmpSMS',
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
                          field: 'markNoshowByEmp',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'markNoshowByEmpPush',
                        id: 'markNoshowByEmpPush',
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
                          field: 'markNoshowByEmp',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'markNoshowByEmpEmail',
                        id: 'markNoshowByEmpEmail',
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
                          field: 'markNoshowByEmp',
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
                    name: 'aboutETAForDriver',
                    id: 'aboutETAForDriver',
                    title: 'Alert Driver after Trip ETA',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'aboutETAForDriverSMS',
                        id: 'aboutETAForDriverSMS',
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
                          field: 'aboutETAForDriver',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'aboutETAForDriverPush',
                        id: 'aboutETAForDriverPush',
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
                          field: 'aboutETAForDriver',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'aboutETAForDriverEmail',
                        id: 'aboutETAForDriverEmail',
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
                          field: 'aboutETAForDriver',
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
                    name: 'startTripBasisDistanceETA',
                    id: 'startTripBasisDistanceETA',
                    title:
                      'Alert Driver to Start Trip on Basis of Distance & ETA',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'startTripBasisDistanceETASMS',
                        id: 'startTripBasisDistanceETASMS',
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
                          field: 'startTripBasisDistanceETA',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'startTripBasisDistanceETAPush',
                        id: 'startTripBasisDistanceETAPush',
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
                          field: 'startTripBasisDistanceETA',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'startTripBasisDistanceETAEmail',
                        id: 'startTripBasisDistanceETAEmail',
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
                          field: 'startTripBasisDistanceETA',
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
                    name: 'tripEndMissed',
                    id: 'tripEndMissed',
                    title: 'Alert if the driver has not ended the trip',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'tripEndMissedSMS',
                        id: 'tripEndMissedSMS',
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
                          field: 'tripEndMissed',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'tripEndMissedPush',
                        id: 'tripEndMissedPush',
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
                          field: 'tripEndMissed',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'tripEndMissedEmail',
                        id: 'tripEndMissedEmail',
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
                          field: 'tripEndMissed',
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
                    name: 'newTripAssignedToDriver',
                    id: 'newTripAssignedToDriver',
                    title: 'Alert Driver for New Trip Assigned',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'newTripAssignedToDriverSMS',
                        id: 'newTripAssignedToDriverSMS',
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
                          field: 'newTripAssignedToDriver',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'newTripAssignedToDriverPush',
                        id: 'newTripAssignedToDriverPush',
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
                          field: 'newTripAssignedToDriver',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'newTripAssignedToDriverEmail',
                        id: 'newTripAssignedToDriverEmail',
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
                          field: 'newTripAssignedToDriver',
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
                    name: 'escortPickup',
                    id: 'escortPickup',
                    title: 'Alert Driver for Escort Pickup',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'escortPickupSMS',
                        id: 'escortPickupSMS',
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
                          field: 'escortPickup',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'escortPickupPush',
                        id: 'escortPickupPush',
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
                          field: 'escortPickup',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'escortPickupEmail',
                        id: 'escortPickupEmail',
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
                          field: 'escortPickup',
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
                    name: 'aboutAdequates',
                    id: 'aboutAdequates',
                    title: 'Alert Driver about Adequates',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'aboutAdequatesSMS',
                        id: 'aboutAdequatesSMS',
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
                          field: 'aboutAdequates',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'aboutAdequatesPush',
                        id: 'aboutAdequatesPush',
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
                          field: 'aboutAdequates',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'aboutAdequatesEmail',
                        id: 'aboutAdequatesEmail',
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
                          field: 'aboutAdequates',
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
                    name: 'aboutPenalty',
                    id: 'aboutPenalty',
                    title: 'Alert Driver about Penalty',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'aboutPenaltySMS',
                        id: 'aboutPenaltySMS',
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
                          field: 'aboutPenalty',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'aboutPenaltyPush',
                        id: 'aboutPenaltyPush',
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
                          field: 'aboutPenalty',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'aboutPenaltyEmail',
                        id: 'aboutPenaltyEmail',
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
                          field: 'aboutPenalty',
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
                    name: 'successfulAttendenceCapture',
                    id: 'successfulAttendenceCapture',
                    title: 'Alert Driver on Successful Attendence Capture',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'successfulAttendenceCaptureSMS',
                        id: 'successfulAttendenceCaptureSMS',
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
                          field: 'successfulAttendenceCapture',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'successfulAttendenceCapturePush',
                        id: 'successfulAttendenceCapturePush',
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
                          field: 'successfulAttendenceCapture',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'successfulAttendenceCaptureEmail',
                        id: 'successfulAttendenceCaptureEmail',
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
                          field: 'successfulAttendenceCapture',
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
                    name: 'empRated',
                    id: 'empRated',
                    title: 'Alert Driver after Employee Rated the Trip',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'empRatedSMS',
                        id: 'empRatedSMS',
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
                          field: 'empRated',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'empRatedPush',
                        id: 'empRatedPush',
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
                          field: 'empRated',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'empRatedEmail',
                        id: 'empRatedEmail',
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
                          field: 'empRated',
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
                    name: 'totalTripCompleted',
                    id: 'totalTripCompleted',
                    title: 'Alert Driver for Total Trip Completed',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'totalTripCompletedSMS',
                        id: 'totalTripCompletedSMS',
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
                          field: 'totalTripCompleted',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'totalTripCompletedPush',
                        id: 'totalTripCompletedPush',
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
                          field: 'totalTripCompleted',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'totalTripCompletedEmail',
                        id: 'totalTripCompletedEmail',
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
                          field: 'totalTripCompleted',
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
                    name: 'speedLimit',
                    id: 'speedLimit',
                    title: 'Alert Driver about Speed Limit',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'speedLimitSMS',
                        id: 'speedLimitSMS',
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
                          field: 'speedLimit',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'speedLimitPush',
                        id: 'speedLimitPush',
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
                          field: 'speedLimit',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'speedLimitEmail',
                        id: 'speedLimitEmail',
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
                          field: 'speedLimit',
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
                    name: 'lastMinTripChanges',
                    id: 'lastMinTripChanges',
                    title: 'Alert Driver about Last Minute Trip Changes',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'lastMinTripChangesSMS',
                        id: 'lastMinTripChangesSMS',
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
                          field: 'lastMinTripChanges',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'lastMinTripChangesPush',
                        id: 'lastMinTripChangesPush',
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
                          field: 'lastMinTripChanges',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'lastMinTripChangesEmail',
                        id: 'lastMinTripChangesEmail',
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
                          field: 'lastMinTripChanges',
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
                    name: 'onExpiredDocs',
                    id: 'onExpiredDocs',
                    title: 'Alert Driver after Document Expired',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'onExpiredDocsSMS',
                        id: 'onExpiredDocsSMS',
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
                          field: 'onExpiredDocs',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'onExpiredDocsPush',
                        id: 'onExpiredDocsPush',
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
                          field: 'onExpiredDocs',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'onExpiredDocsEmail',
                        id: 'onExpiredDocsEmail',
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
                          field: 'onExpiredDocs',
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
                    name: 'Days15ToExpireDocs',
                    id: 'Days15ToExpireDocs',
                    title: 'Alert Driver for 15 Days To Expire the Document',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'Days15ToExpireDocsSMS',
                        id: 'Days15ToExpireDocsSMS',
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
                          field: 'Days15ToExpireDocs',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'Days15ToExpireDocsPush',
                        id: 'Days15ToExpireDocsPush',
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
                          field: 'Days15ToExpireDocs',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'Days15ToExpireDocsEmail',
                        id: 'Days15ToExpireDocsEmail',
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
                          field: 'Days15ToExpireDocs',
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
                    name: 'newAnnouncement',
                    id: 'newAnnouncement',
                    title: 'Alert Employee for New Announcement',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'newAnnouncementSMS',
                        id: 'newAnnouncementSMS',
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
                          field: 'newAnnouncement',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'newAnnouncementPush',
                        id: 'newAnnouncementPush',
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
                          field: 'newAnnouncement',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'newAnnouncementEmail',
                        id: 'newAnnouncementEmail',
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
                          field: 'newAnnouncement',
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
                    name: 'newSOS',
                    id: 'newSOS',
                    title: 'Alert Manager/Admin for SOS',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'newSOSSMS',
                        id: 'newSOSSMS',
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
                          field: 'newSOS',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'newSOSPush',
                        id: 'newSOSPush',
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
                          field: 'newSOS',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'newSOSEmail',
                        id: 'newSOSEmail',
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
                          field: 'newSOS',
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
                    name: 'newIncedent',
                    id: 'newIncedent',
                    title: 'Alert Manager/Admin for New Incident',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'newIncedentSMS',
                        id: 'newIncedentSMS',
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
                          field: 'newIncedent',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'newIncedentPush',
                        id: 'newIncedentPush',
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
                          field: 'newIncedent',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'newIncedentEmail',
                        id: 'newIncedentEmail',
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
                          field: 'newIncedent',
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
                    name: 'updateIncedent',
                    id: 'updateIncedent',
                    title: 'Alert Manager/Admin for Incident Updation',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'updateIncedentSMS',
                        id: 'updateIncedentSMS',
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
                          field: 'updateIncedent',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'updateIncedentPush',
                        id: 'updateIncedentPush',
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
                          field: 'updateIncedent',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'updateIncedentEmail',
                        id: 'updateIncedentEmail',
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
                          field: 'updateIncedent',
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
                    name: 'updateIncedentStatus',
                    id: 'updateIncedentStatus',
                    title: 'Alert Employee for Incident Status Change',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'updateIncedentStatusSMS',
                        id: 'updateIncedentStatusSMS',
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
                          field: 'updateIncedentStatus',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'updateIncedentStatusPush',
                        id: 'updateIncedentStatusPush',
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
                          field: 'updateIncedentStatus',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'updateIncedentStatusEmail',
                        id: 'updateIncedentStatusEmail',
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
                          field: 'updateIncedentStatus',
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
                    name: 'idleFor15Days',
                    id: 'idleFor15Days',
                    title: 'Alert employee on being idle for more than 15 days',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'idleFor15DaysSMS',
                        id: 'idleFor15DaysSMS',
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
                          field: 'idleFor15Days',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'idleFor15DaysPush',
                        id: 'idleFor15DaysPush',
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
                          field: 'idleFor15Days',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'idleFor15DaysEmail',
                        id: 'idleFor15DaysEmail',
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
                          field: 'idleFor15Days',
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
                    name: 'driverCreation',
                    id: 'driverCreation',
                    title:
                      'Alert driver after creation of an account to verify and update profile',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'driverCreationSMS',
                        id: 'driverCreationSMS',
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
                          field: 'driverCreation',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'driverCreationPush',
                        id: 'driverCreationPush',
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
                          field: 'driverCreation',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'driverCreationEmail',
                        id: 'driverCreationEmail',
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
                          field: 'driverCreation',
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
                    name: 'driverApproveByCorporate',
                    id: 'driverApproveByCorporate',
                    title: 'Alert driver after approved by corporate admin',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'driverApproveByCorporateSMS',
                        id: 'driverApproveByCorporateSMS',
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
                          field: 'driverApproveByCorporate',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'driverApproveByCorporatePush',
                        id: 'driverApproveByCorporatePush',
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
                          field: 'driverApproveByCorporate',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'driverApproveByCorporateEmail',
                        id: 'driverApproveByCorporateEmail',
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
                          field: 'driverApproveByCorporate',
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
                    name: 'driverRejectByCorporate',
                    id: 'driverRejectByCorporate',
                    title: 'Alert driver after rejected by corporate admin',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'driverRejectByCorporateSMS',
                        id: 'driverRejectByCorporateSMS',
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
                          field: 'driverRejectByCorporate',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'driverRejectByCorporatePush',
                        id: 'driverRejectByCorporatePush',
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
                          field: 'driverRejectByCorporate',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'driverRejectByCorporateEmail',
                        id: 'driverRejectByCorporateEmail',
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
                          field: 'driverRejectByCorporate',
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
                    name: 'deActivatedAccountDriver',
                    id: 'deActivatedAccountDriver',
                    title: 'Alert driver after account deactivated',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'deActivatedAccountDriverSMS',
                        id: 'deActivatedAccountDriverSMS',
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
                          field: 'deActivatedAccountDriver',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'deActivatedAccountDriverPush',
                        id: 'deActivatedAccountDriverPush',
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
                          field: 'deActivatedAccountDriver',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'deActivatedAccountDriverEmail',
                        id: 'deActivatedAccountDriverEmail',
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
                          field: 'deActivatedAccountDriver',
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
                    name: 'deActivatedAccountEmp',
                    id: 'deActivatedAccountEmp',
                    title: 'Alert employee after account deactivated',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'deActivatedAccountEmpSMS',
                        id: 'deActivatedAccountEmpSMS',
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
                          field: 'deActivatedAccountEmp',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'deActivatedAccountEmpPush',
                        id: 'deActivatedAccountEmpPush',
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
                          field: 'deActivatedAccountEmp',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'deActivatedAccountEmpEmail',
                        id: 'deActivatedAccountEmpEmail',
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
                          field: 'deActivatedAccountEmp',
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
                    name: 'empCreation',
                    id: 'empCreation',
                    title:
                      'Alert employee/manager after creation of an account to verify and update profile',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'empCreationSMS',
                        id: 'empCreationSMS',
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
                          field: 'empCreation',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'empCreationPush',
                        id: 'empCreationPush',
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
                          field: 'empCreation',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'empCreationEmail',
                        id: 'empCreationEmail',
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
                          field: 'empCreation',
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
                    name: 'deActivatedAccountEmp',
                    id: 'deActivatedAccountEmp',
                    title: 'Alert employee after account deactivated',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'deActivatedAccountEmpSMS',
                        id: 'deActivatedAccountEmpSMS',
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
                          field: 'deActivatedAccountEmp',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'deActivatedAccountEmpPush',
                        id: 'deActivatedAccountEmpPush',
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
                          field: 'deActivatedAccountEmp',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'deActivatedAccountEmpEmail',
                        id: 'deActivatedAccountEmpEmail',
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
                          field: 'deActivatedAccountEmp',
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
                    name: 'safeReachToAct',
                    id: 'safeReachToAct',
                    title: 'Alert Employee/Manager For Safe Reach To Act',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'safeReachToActSMS',
                        id: 'safeReachToActSMS',
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
                          field: 'safeReachToAct',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'safeReachToActPush',
                        id: 'safeReachToActPush',
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
                          field: 'safeReachToAct',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'safeReachToActEmail',
                        id: 'safeReachToActEmail',
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
                          field: 'safeReachToAct',
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
                    name: 'technicalIssue',
                    id: 'technicalIssue',
                    title: 'Alert Driver/Employee/Manager For Technical Issue',
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
                    layout: {
                      column: 3,
                      spacing: 2,
                      size: 'small',
                      label: 'fixed',
                    },
                    fields: [
                      {
                        type: 'textarea',
                        name: 'technicalIssueSMS',
                        id: 'technicalIssueSMS',
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
                          field: 'technicalIssue',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'textarea',
                        name: 'technicalIssuePush',
                        id: 'technicalIssuePush',
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
                          field: 'technicalIssue',
                          value: 'YES',
                        },
                      },
                      {
                        type: 'ckeditor',
                        name: 'technicalIssueEmail',
                        id: 'technicalIssueEmail',
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
                          field: 'technicalIssue',
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
      },
    ],
  };
  const handleSubmit = (values) => {
    setshowbtn(false);
    if (values.button == 'submit') {
      values.data.empSignupApproval = null;
      values.data.empSignupApprovalSMS = null;
      values.data.empSignupApprovalPush = null;
      values.data.empSignupApprovalEmail = null;
      axios
        .post(Api.setting.notificationSettingSave, values?.data)
        .then((res) => {
          setshowbtn(true);
          if (res?.data?.status == '200') {
            toast.success('Push Notification Setting created successfully.');
          } else {
            toast.error(res?.data?.message || 'Something went wrong.');
          }
        })
        .catch((err) => {
          setshowbtn(true);
          toast.error('Something went wrong.');
        });
    }
    if (values.button == 'update') {
      values.data.empSignupApproval = null;
      values.data.empSignupApprovalSMS = null;
      values.data.empSignupApprovalPush = null;
      values.data.empSignupApprovalEmail = null;
      axios
        .put(Api.setting.notificationSettingUpdate, values?.data)
        .then((res) => {
          setshowbtn(true);
          if (res?.data?.status == '200') {
            toast.success('Push Notification setting updated successfully.');
          } else {
            toast.error(res?.data?.message || 'Something went wrong.');
          }
        })
        .catch((err) => {
          setshowbtn(true);
          toast.error('Something went wrong.');
        });
    }
  };
  return (
    <>
      {!showbtn ? <AppLoader /> : null}
      <Grid container spacing={2} sx={{mb: 2}} className='page-header-second'>
        <Grid item xs={8}>
          <CustomLabel
            labelVal='Notification Settings'
            variantVal='h3-underline'
          />
        </Grid>
      </Grid>
      {settingList ? (
        <SmartForm
          defaultValues={settingList?.id ? settingList : {}}
          template={template}
          onSubmit={handleSubmit}
          buttons={
            settingList?.id
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

export default create;
