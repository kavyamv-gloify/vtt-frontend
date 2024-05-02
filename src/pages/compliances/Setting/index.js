import React, {useEffect, useState} from 'react';
import SmartForm from '@smart-form';
import regex from '@regex';
import axios from 'axios';
import Api from '@api';
import AppLoader from '@crema/core/AppLoader';
import {toast} from 'react-toastify';
import {useAuthUser} from '@crema/utility/AuthHooks';
import CustomLabel from 'pages/common/CustomLabel';
import {Grid} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
const ComplianceSettings = () => {
  const [settingObj, setSettingObj] = React.useState({});
  const [showbtn, setshowbtn] = React.useState(true);
  const {user} = useAuthUser();
  const navigate = useNavigate();
  const [myActions, setMyActions] = useState([]);
  const permissionCheck = useSelector(({settings}) => settings.permissions);
  useEffect(() => {
    if (!permissionCheck) return;
    let sub_mod = {};
    permissionCheck?.map((el) => {
      if (el.subModuleName == 'Compliance Setting') sub_mod = el;
    });
    setMyActions(sub_mod?.actions);
   if (
      (!sub_mod || !sub_mod?.actions?.includes('View')) &&
      user?.userList?.userRole !== 'SUPERADMIN'
    )
      navigate('/error-pages/error-404');
  }, [permissionCheck,user]);
  function getSetting() {
    axios
      .get(
        Api.baseUri + '/user-reg/compliance-setting/get-all-compliance-setting',
      )
      .then((res) => {
        let tem = {};
        res?.data?.data?.map((el) => {
          if (el?.corporateId == user?.userList?.corporateId) {
            tem = el;
          }
        });
        setSettingObj(tem || {});
      })
      .catch((err) => {
        setSettingList({});
      });
  }

  useEffect(() => {
    getSetting();
  }, [user?.userList?.corporateId]);

  const handleSubmit = async (values) => {
    setshowbtn(false);
    axios
      .post(
        Api.baseUri + '/user-reg/compliance-setting/create-compliance-setting',
        {...values?.data, corporateId: user?.userList?.corporateId},
      )
      .then((res) => {
        setshowbtn(true);
        if (res?.data?.status == '200') {
          getSetting();
          toast.success('Compliance Setting Created successfully.');
        } else {
          toast.error(res?.data?.message || 'Something went wrong.');
        }
      })
      .catch((err) => {
        setshowbtn(true);
        toast.error('Something went wrong.');
      });
  };

  const handleUpdate = async (values) => {
    setshowbtn(false);
    axios
      .put(
        Api.baseUri + '/user-reg/compliance-setting/update-compliance-setting',
        {...values?.data, corporateId: user?.userList?.corporateId},
      )
      .then((res) => {
        setshowbtn(true);
        if (res?.data?.status == '200') {
          getSetting();
          toast.success('Compliance Setting updated successfully.');
        } else {
          toast.error(res?.data?.message || 'Something went wrong.');
        }
      })
      .catch((err) => {
        setshowbtn(true);
        toast.error('Something went wrong.');
      });
  };

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
                name: 'corporateApprovalRequired',
                id: 'corporateApprovalRequired',
                title: 'Corporate Admin Approval Required',
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
                name: 'vendorApprovalRequired',
                id: 'vendorApprovalRequired',
                title: 'Vendor Approval Required',
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
            layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
            fields: [
              {
                type: 'switchToggle',
                name: 'alertToVendor',
                id: 'alertToVendor',
                title: 'Alert to Vendor',
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
                    name: 'alertToVendorPush',
                    id: 'alertToVendorPush',
                    title: 'Push Notification',
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
                      field: 'alertToVendor',
                      value: 'YES',
                    },
                  },
                  {
                    type: 'ckeditor',
                    name: 'alertToVendorEmail',
                    id: 'alertToVendorEmail',
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
                      field: 'alertToVendor',
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
                name: 'alertToCorporate',
                id: 'alertToCorporate',
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
                    name: 'alertToCorporatePush',
                    id: 'alertToCorporatePush',
                    title: 'Push Notification',
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
                      field: 'alertToCorporate',
                      value: 'YES',
                    },
                  },
                  {
                    type: 'ckeditor',
                    name: 'alertToCorporateEmail',
                    id: 'alertToCorporateEmail',
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
                      field: 'alertToCorporate',
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
                name: 'alertVendorOnApprovalRequest',
                id: 'alertVendorOnApprovalRequest',
                title: 'Alert to Vendor On Approval',
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
                    name: 'alertVendorOnApprovalRequestPush',
                    id: 'alertVendorOnApprovalRequestPush',
                    title: 'Push Notification',
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
                      field: 'alertVendorOnApprovalRequest',
                      value: 'YES',
                    },
                  },
                  {
                    type: 'ckeditor',
                    name: 'alertVendorOnApprovalRequestEmail',
                    id: 'alertVendorOnApprovalRequestEmail',
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
                      field: 'alertVendorOnApprovalRequest',
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
                name: 'alertCorpAdminOnApprovalRequest',
                id: 'alertCorpAdminOnApprovalRequest',
                title: 'Alert to Corporate Admin On Approval',
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
                    name: 'alertCorpAdminOnApprovalRequestPush',
                    id: 'alertCorpAdminOnApprovalRequestPush',
                    title: 'Push Notification',
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
                      field: 'alertCorpAdminOnApprovalRequest',
                      value: 'YES',
                    },
                  },
                  {
                    type: 'ckeditor',
                    name: 'alertCorpAdminOnApprovalRequestEmail',
                    id: 'alertCorpAdminOnApprovalRequestEmail',
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
                      field: 'alertCorpAdminOnApprovalRequest',
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
  return (
    <div>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={8}>
          <CustomLabel
            labelVal='Compliance Setting'
            variantVal='h3-underline'
          />
        </Grid>
      </Grid>
      {!showbtn ? <AppLoader /> : null}
      {myActions?.includes('Edit') && settingObj?.id && (
        <SmartForm
          defaultValues={settingObj}
          template={template}
          onSubmit={handleUpdate}
          buttons={['update']}
          success={showbtn}
        />
      )}
      {myActions?.includes('Create') && !settingObj?.id && (
        <SmartForm
          defaultValues={settingObj}
          template={template}
          onSubmit={handleSubmit}
          buttons={['submit']}
          success={showbtn}
        />
      )}
    </div>
  );
};

export default ComplianceSettings;
