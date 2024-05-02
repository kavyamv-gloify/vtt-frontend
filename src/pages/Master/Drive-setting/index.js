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
const DriverSetting = () => {
  const navigate = useNavigate();
  const [showbtn, setshowbtn] = React.useState(true);
  const {user} = useAuthUser();
  const [data, setData] = useState();
  const [corporate, setCorporate] = useState();
  const {id} = useParams();
  const fieldOptions = [
    {title: 'Full Name', value: 'driverFullName'},
    {title: 'Gender', value: 'gender'},
    {title: 'DOB', value: 'dateofBirth'},
    {title: 'Mobile No', value: 'mobileNo'},
    {title: 'Email Id', value: 'emailId'},
    {title: 'Photo', value: 'photo'},
    {title: 'Alternate No', value: 'alternateNo'},
    {title: 'DL Number', value: 'dlNumber'},
    {title: 'DL Validity', value: 'dlValidity'},
    {title: 'DL Document', value: 'dlcenseDoc'},
    {title: 'Shelter Address', value: 'shelterAddress'},
    {title: 'Address', value: 'address'},
    {title: 'ID Card Issued', value: 'iDCardIssued'},
    {title: 'Govt Id Proof Doc', value: 'govtIdProofDoc'},
    {title: 'Govt. Id Proof', value: 'govtidproof'},
    {title: 'Driver Induction', value: 'driverInduction'},
    {title: 'Driver Induction Date', value: 'driverInductionDate'},
    {title: 'Police Verification Code', value: 'policeVerificationCode'},
    {title: 'Police Verification Document', value: 'policeVerDoc'},
    {title: 'Police Verification Status', value: 'policeVerStatus'},
    {
      title: 'Police Verification Expiry Date',
      value: 'policeverificationexpirydate',
    },
    {title: 'Is Vaccinated', value: 'isVaccinated'},
    {title: 'Badge', value: 'badge'},
    {title: 'Badge Expiry Date', value: 'badgeExpDate'},
    {title: 'Badge No', value: 'badgeNo'},
    {title: 'Medical Fitness', value: 'medicalFitness'},
    {title: 'Medical Fitness Date', value: 'medicalFitnessDate'},
    {title: 'Medical Fitness Expiry Date', value: 'medicalFitnessExpiryDate'},
    {title: 'Training Status', value: 'trainingStatus'},
    {title: 'Last Training Date', value: 'lastTrainingDate'},
    {title: 'Medical Certificate Doc', value: 'medicalCertificateDoc'},
  ];
  console.log('id', id);
  useEffect(() => {
    axios
      .get(
        Api.baseUri +
          '/user-reg/driver-setting/get-driverSetting-by-corpoarteId/' +
          id,
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          console.log(res);
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
        }
      })
      .catch((err) => {});
  }, []);

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
        id: 'personal_information',
        title: 'Contact',
        fields: [
          {
            type: 'section',
            layout: {column: 1, spacing: 2, size: 'medium', label: 'fixed'},
            fields: [
              {
                type: 'text',
                name: 'vendorHelpDesk1',
                id: 'vendorHelpDesk1',
                title: 'Vendor Help desk 1',

                maxChar: 10,
                isNumber: true,
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
        title: 'Driver Attendance',
        fields: [
          {
            type: 'section',
            layout: {column: 1, spacing: 2, size: 'medium', label: 'fixed'},
            fields: [
              {
                type: 'text',
                name: 'noOfAllowedHoursInDay',
                id: 'noOfAllowedHoursInDay',
                title: 'Number of allowed hours in a day',
                validationProps: {
                  // required: 'This is a mandatory field'
                },
                maxChar: 2,
                isNumber: true,
              },
              {
                type: 'switchToggle',
                name: 'markPunchFromCorporate',
                id: 'markPunchFromCorporate',
                title: 'Mark Punch from corporate ',
                validationProps: {
                  // required: 'This is a mandatory field'
                },
                options: [
                  {title: 'Yes', value: 'YES'},
                  {title: 'No', value: 'NO'},
                ],
              },
              {
                type: 'text',
                name: 'corporateGeoFenceAreaRange',
                id: 'corporateGeoFenceAreaRange',
                title: 'Corporate geofence area range in ______meters',
                validationProps: {
                  // required: 'This is a mandatory field'
                },
                maxChar: 6,
                isNumber: true,
              },
              {
                type: 'switchToggle',
                name: 'allowExtraHours',
                id: 'allowExtraHours',
                title: 'Allow extra hours ',
                validationProps: {
                  // required: 'This is a mandatory field'
                },
                options: [
                  {title: 'Yes', value: 'YES'},
                  {title: 'No', value: 'NO'},
                ],
              },
              {
                type: 'text',
                name: 'allowedExtraHours',
                id: 'allowedExtraHours',
                title: 'Allowed extra hours _______ ',
                dynamic: {
                  field: 'allowExtraHours',
                  value: 'YES',
                },
                validationProps: {
                  // required: 'This is a mandatory field'
                },
                maxChar: 2,
                isNumber: true,
              },
            ],
          },
        ],
      },
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        title: 'Emp Attendance',
        fields: [
          {
            type: 'section',
            layout: {column: 1, spacing: 2, size: 'medium', label: 'fixed'},
            fields: [
              {
                type: 'switchToggle',
                name: 'allowEmpAttdCaptureIfDriverAndEmpInMeter',
                id: 'allowEmpAttdCaptureIfDriverAndEmpInMeter',
                title:
                  'Allow Driver to capture employee attendance if they are near ',
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
                    name: 'allowEmpAttdCaptureIfDriverAndEmpInMeterDiff',
                    id: 'allowEmpAttdCaptureIfDriverAndEmpInMeterDiff',
                    title: 'Driver and Employee in meter distance',
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    dynamic: {
                      field: 'allowEmpAttdCaptureIfDriverAndEmpInMeter',
                      value: 'YES',
                    },
                  },
                ],
              },

              {
                type: 'switchToggle',
                name: 'allowEmpAttdCaptureOutsideGeofenceArea',
                id: 'allowEmpAttdCaptureOutsideGeofenceArea',
                title:
                  'Allow Driver to capture employee attendance outside the geofence area ',
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
                name: 'generateOTPQRCodeOfEmpAftEnteringMeterDiffGeofence',
                id: 'generateOTPQRCodeOfEmpAftEnteringMeterDiffGeofence',
                maxChar: 6,
                isNumber: true,
                title:
                  'Generate the OTP/QR code of an employee after entering ______ of Geo-fence',
                infoMessage: ['Radio button is selectable', 'e.g.: yes'],

                validationProps: {
                  // required: 'This is a mandatory field'
                },
              },
              {
                type: 'switchToggle',
                name: 'displayEmpAttendenceCaptureWithoutOTPQR',
                id: 'displayEmpAttendenceCaptureWithoutOTPQR',
                title: 'Display Employee attendence without OTP or QR ',
                validationProps: {
                  // required: 'This is a mandatory field'
                },
                options: [
                  {title: 'Yes', value: 'YES'},
                  {title: 'No', value: 'NO'},
                ],
              },
              {
                type: 'switchToggle',
                name: 'captureAttendanceThroughShortId',
                id: 'captureAttendanceThroughShortId',
                title: 'Capture attendence through short Id',
                validationProps: {
                  // required: 'This is a mandatory field'
                },
                options: [
                  {title: 'Yes', value: 'YES'},
                  {title: 'No', value: 'NO'},
                ],
              },
              {
                type: 'switchToggle',
                name: 'alertDriverIfEmpAttendanceNotMarked',
                id: 'alertDriverIfEmpAttendanceNotMarked',
                title: 'Alert driver if employee attendance not marked ',
                validationProps: {
                  // required: 'This is a mandatory field'
                },
                options: [
                  {title: 'Yes', value: 'YES'},
                  {title: 'No', value: 'NO'},
                ],
              },
              {
                type: 'switchToggle',
                name: 'canEmpAttendenceBeCaptureUsingOTPQR',
                id: 'canEmpAttendenceBeCaptureUsingOTPQR',
                title: 'Can employee attendence be capture using OTP/QR ',
                validationProps: {
                  // required: 'This is a mandatory field'
                },
                options: [
                  {title: 'Yes', value: 'YES'},
                  {title: 'No', value: 'NO'},
                ],
              },
            ],
          },
        ],
      },
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        title: 'ETA',
        fields: [
          {
            type: 'section',
            layout: {column: 1, spacing: 2, size: 'medium', label: 'fixed'},
            fields: [
              {
                type: 'switchToggle',
                name: 'allowDynamicETAInUptrip',
                id: 'allowDynamicETAInUptrip',
                title: 'Allow dynamic ETA in Uptrip ',
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
                name: 'allowDynamicETAInDowntrip',
                id: 'allowDynamicETAInDowntrip',
                title: 'Allow dynamic ETA in down Trip ',
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
                name: 'timeSchedulerToGetDynamicETA',
                id: 'timeSchedulerToGetDynamicETA',
                title: 'Time scheduler to get Dynamic Eta ',
                // infoMessage: ['Radio button is selectable', 'e.g.: yes'],
                maxChar: 6,
                isNumber: true,
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
        title: 'General',
        fields: [
          {
            type: 'section',
            layout: {column: 1, spacing: 2, size: 'medium', label: 'fixed'},
            fields: [
              {
                type: 'switchToggle',
                name: 'canDriverViewEmployeesPhoto',
                id: 'canDriverViewEmployeesPhoto',
                title: 'Can driver view employess photo ',
                validationProps: {
                  // required: 'This is a mandatory field'
                },
                options: [
                  {title: 'Yes', value: 'YES'},
                  {title: 'No', value: 'NO'},
                ],
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
                name: 'canDriverCallEmployeesThroughCallMasking',
                id: 'canDriverCallEmployeesThroughCallMasking',
                title: 'Can driver call employee through call masking',
                validationProps: {
                  // required: 'This is a mandatory field'
                },
                options: [
                  {title: 'Yes', value: 'YES'},
                  {title: 'No', value: 'NO'},
                ],
              },
            ],
          },
        ],
      },
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        title: 'Over Speeding',
        fields: [
          {
            type: 'section',
            layout: {column: 1, spacing: 2, size: 'medium', label: 'fixed'},
            fields: [
              // {
              //   type: 'switchToggle',
              //   name: 'alertDriverForSpeedLimit',
              //   id: 'alertDriverForSpeedLimit',
              //   title: 'Alert driver for speed limit ',
              //   infoMessage: ['Radio button is selectable', 'e.g.: yes'],
              //   options: [
              //     {title: 'Yes', value: 'YES'},
              //     {title: 'No', value: 'NO'},
              //   ],
              //   validationProps: {
              //     // required: 'This is a mandatory field'
              //   },
              // },
              {
                type: 'text',
                name: 'alertDriverForSpeedLimit',
                id: 'alertDriverForSpeedLimit',
                title: 'Alert driver on speed limit ',
                maxChar: 10,
                isNumber: true,
                validationProps: {
                  // required: 'This is a mandatory field'
                },
              },
              {
                type: 'switchToggle',
                name: 'alertDriverOnOverSpeeding',
                id: 'alertDriverOnOverSpeeding',
                title: 'Alert driver on over speeding ',
                validationProps: {
                  // required: 'This is a mandatory field'
                },
                options: [
                  {title: 'Yes', value: 'YES'},
                  {title: 'No', value: 'NO'},
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
                type: 'switchToggle',
                name: 'canCorporateAdminApproveRejectDriverProfileUpdateRequest',
                id: 'canCorporateAdminApproveRejectDriverProfileUpdateRequest',
                title: 'Can corporate Admin Approve/reject driver request',
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
                name: 'canVendorApproveRejectDriverProfileUpdateRequest',
                id: 'canVendorApproveRejectDriverProfileUpdateRequest',
                title: 'Can vendor Approve/reject driver request',
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
                name: 'canCorporateAdminApproveRejectDriverProfileUpdateRequest',
                id: 'canCorporateAdminApproveRejectDriverProfileUpdateRequest',
                title:
                  'Can corporate admin approve or reject the driver profile update request',
                validationProps: {
                  // required: 'This is a mandatory field'
                },
                options: [
                  {title: 'Yes', value: 'YES'},
                  {title: 'No', value: 'NO'},
                ],
              },
              {
                type: 'switchToggle',
                name: 'canVendorApproveRejectDriverProfileUpdateRequest',
                id: 'canVendorApproveRejectDriverProfileUpdateRequest',
                title:
                  'Can vendor approve or reject the driver profile update request',
                validationProps: {
                  // required: 'This is a mandatory field'
                },
                options: [
                  {title: 'Yes', value: 'YES'},
                  {title: 'No', value: 'NO'},
                ],
              },
              {
                type: 'multiSelect',
                name: 'nonEditableFieldsInVerifyAndUpdate',
                id: 'nonEditableFieldsInVerifyAndUpdate',
                title: 'Non-editable field after profile verification',
                options: fieldOptions ?? [],
                // infoMessage: ['Radio button is selectable', 'e.g.: yes'],
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
        title: 'Sleep Alert',
        fields: [
          {
            type: 'section',
            layout: {column: 1, spacing: 2, size: 'medium', label: 'fixed'},
            fields: [
              {
                type: 'switchToggle',
                name: 'driverShouldReceiveSleepAlert',
                id: 'driverShouldReceiveSleepAlert',
                title: 'Driver should receive sleep alert ',

                validationProps: {
                  // required: 'This is a mandatory field'
                },
                options: [
                  {title: 'Yes', value: 'YES'},
                  {title: 'No', value: 'NO'},
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
                name: 'alertOnPanicToVendor',
                id: 'alertOnPanicToVendor',
                title: 'Alert on PANIC press to Vendor',
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
                    name: 'alertOnPanicToVendorSMS',
                    id: 'alertOnPanicToVendorSMS',
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
                      field: 'alertOnPanicToVendor',
                      value: 'YES',
                    },
                  },
                  // {
                  //   type: 'textarea',
                  //   name: 'alertOnPanicToVendorPush',
                  //   id: 'alertOnPanicToVendorPush',
                  //   title: 'Push Notification body',
                  //   isCheckBox: true,
                  //   isSMS: true,
                  //   boxheight: 14.2,
                  //   pattern: {
                  //     value: regex.maxSize1000,
                  //     message:
                  //       'Please enter valid code with alpha-numeric and below 50 characters',
                  //   },
                  //   infoMessage: [
                  //     'Alphanumeric characters are allowed',
                  //     'Maximum length should be 250 characters',
                  //     'e.g.:Successfully created',
                  //   ],
                  //   validationProps: {
                  //     // required: 'This is a mandatory field'
                  //   },
                  //   dynamic: {
                  //     field: 'alertOnPanicToVendor',
                  //     value: 'YES',
                  //   },
                  // },
                  {
                    type: 'ckeditor',
                    name: 'alertOnPanicToVendorEmail',
                    id: 'alertOnPanicToVendorEmail',
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
                      field: 'alertOnPanicToVendor',
                      value: 'YES',
                    },
                  },
                ],
              },

              {
                type: 'switchToggle',
                name: 'alertOnPanicToCorp',
                id: 'alertOnPanicToCorp',
                title: 'Alert on PANIC press to Corporate-Admin',
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
                    name: 'alertOnPanicToCorpSMS',
                    id: 'alertOnPanicToCorpSMS',
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
                      field: 'alertOnPanicToCorp',
                      value: 'YES',
                    },
                  },
                  {
                    type: 'textarea',
                    name: 'alertOnPanicToCorpPush',
                    id: 'alertOnPanicToCorpPush',
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
                      field: 'alertOnPanicToCorp',
                      value: 'YES',
                    },
                  },
                  {
                    type: 'ckeditor',
                    name: 'alertOnPanicToCorpEmail',
                    id: 'alertOnPanicToCorpEmail',
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
                      field: 'alertOnPanicToCorp',
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
            layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
            fields: [
              {
                type: 'switchToggle',
                name: 'alertDriverAfterAcceptingTripNotStart',
                id: 'alertDriverAfterAcceptingTripNotStart',
                title: 'Alert Driver After Accepting Trip not Start',
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
                    name: 'alertDriverAfterAcceptingTripNotStartMinuteDiff',
                    id: 'alertDriverAfterAcceptingTripNotStartMinuteDiff',
                    title: 'Alert in every ___ minutes',
                    maxChar: 10,
                    isNumber: true,
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    dynamic: {
                      field: 'alertDriverAfterAcceptingTripNotStart',
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
                      field: 'alertDriverAfterAcceptingTripNotStart',
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
                      field: 'alertDriverAfterAcceptingTripNotStart',
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
                      field: 'alertDriverAfterAcceptingTripNotStart',
                      value: 'YES',
                    },
                  },
                ],
              },

              {
                type: 'switchToggle',
                name: 'alertDriverIfNotEmpAttendenceAfterETABuffer',
                id: 'alertDriverIfNotEmpAttendenceAfterETABuffer',
                title:
                  'Alert the Driver if Employee attendence is not marked after the employee ETA buffer',
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
                    name: 'alertDriverIfNotEmpAttendenceAfterETABufferSMS',
                    id: 'alertDriverIfNotEmpAttendenceAfterETABufferSMS',
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
                      field: 'alertDriverIfNotEmpAttendenceAfterETABuffer',
                      value: 'YES',
                    },
                  },
                  {
                    type: 'textarea',
                    name: 'alertDriverIfNotEmpAttendenceAfterETABufferPush',
                    id: 'alertDriverIfNotEmpAttendenceAfterETABufferPush',
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
                      field: 'alertDriverIfNotEmpAttendenceAfterETABuffer',
                      value: 'YES',
                    },
                  },
                  {
                    type: 'ckeditor',
                    name: 'alertDriverIfNotEmpAttendenceAfterETABufferEmail',
                    id: 'alertDriverIfNotEmpAttendenceAfterETABufferEmail',
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
                      field: 'alertDriverIfNotEmpAttendenceAfterETABuffer',
                      value: 'YES',
                    },
                  },
                ],
              },

              {
                type: 'switchToggle',
                name: 'alertManagerAfterEmpNoShow',
                id: 'alertManagerAfterEmpNoShow',
                title: 'Alert the Manager if Employee marked as NO SHOW  ',
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
                    name: 'alertManagerAfterEmpNoShowTimePerMonth',
                    id: 'alertManagerAfterEmpNoShowTimePerMonth',
                    title: 'Alert in every ___ time per month',
                    maxChar: 10,
                    isNumber: true,
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    dynamic: {
                      field: 'alertManagerAfterEmpNoShow',
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
                    type: 'textarea',
                    name: 'alertManagerAfterEmpNoShowSMS',
                    id: 'alertManagerAfterEmpNoShowSMS',
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
                      field: 'alertManagerAfterEmpNoShow',
                      value: 'YES',
                    },
                  },
                  {
                    type: 'textarea',
                    name: 'alertManagerAfterEmpNoShowPush',
                    id: 'alertManagerAfterEmpNoShowPush',
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
                      field: 'alertManagerAfterEmpNoShow',
                      value: 'YES',
                    },
                  },
                  {
                    type: 'ckeditor',
                    name: 'alertManagerAfterEmpNoShowEmail',
                    id: 'alertManagerAfterEmpNoShowEmail',
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
                      field: 'alertManagerAfterEmpNoShow',
                      value: 'YES',
                    },
                  },
                ],
              },

              {
                type: 'switchToggle',
                name: 'alertEmpAfterMarkedNoShow',
                id: 'alertEmpAfterMarkedNoShow',
                title: 'Alert the Employee if Marked as No Show',
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
                    name: 'alertEmpAfterMarkedNoShowTimePerMonth',
                    id: 'alertEmpAfterMarkedNoShowTimePerMonth',
                    title: 'Alert in every ___ time per month',
                    maxChar: 10,
                    isNumber: true,
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    dynamic: {
                      field: 'alertEmpAfterMarkedNoShow',
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
                    type: 'textarea',
                    name: 'alertEmpAfterMarkedNoShowSMS',
                    id: 'alertEmpAfterMarkedNoShowSMS',
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
                      field: 'alertEmpAfterMarkedNoShow',
                      value: 'YES',
                    },
                  },
                  {
                    type: 'textarea',
                    name: 'alertEmpAfterMarkedNoShowPush',
                    id: 'alertEmpAfterMarkedNoShowPush',
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
                      field: 'alertEmpAfterMarkedNoShow',
                      value: 'YES',
                    },
                  },
                  {
                    type: 'ckeditor',
                    name: 'alertEmpAfterMarkedNoShowEmail',
                    id: 'alertEmpAfterMarkedNoShowEmail',
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
                      field: 'alertEmpAfterMarkedNoShow',
                      value: 'YES',
                    },
                  },
                ],
              },

              {
                type: 'switchToggle',
                name: 'alertManagerIfEmpNotBoardAfterBuffer',
                id: 'alertManagerIfEmpNotBoardAfterBuffer',
                title:
                  "Alert the  Manager if Employee doesn't board the cab after the boarding buffer time",
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
                    name: 'alertManagerIfEmpNotBoardAfterBufferSMS',
                    id: 'alertManagerIfEmpNotBoardAfterBufferSMS',
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
                      field: 'alertManagerIfEmpNotBoardAfterBuffer',
                      value: 'YES',
                    },
                  },
                  {
                    type: 'textarea',
                    name: 'alertManagerIfEmpNotBoardAfterBufferPush',
                    id: 'alertManagerIfEmpNotBoardAfterBufferPush',
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
                      field: 'alertManagerIfEmpNotBoardAfterBuffer',
                      value: 'YES',
                    },
                  },
                  {
                    type: 'ckeditor',
                    name: 'alertManagerIfEmpNotBoardAfterBufferEmail',
                    id: 'alertManagerIfEmpNotBoardAfterBufferEmail',
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
                      field: 'alertManagerIfEmpNotBoardAfterBuffer',
                      value: 'YES',
                    },
                  },
                ],
              },

              {
                type: 'switchToggle',
                name: 'alertEmpOnVehicleEnterRadius',
                id: 'alertEmpOnVehicleEnterRadius',
                title: 'Alert the Employee when Vehicle enters the radius ',
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
                    name: 'alertEmpOnVehicleEnterRadiusInMeter',
                    id: 'alertEmpOnVehicleEnterRadiusInMeter',
                    title: 'Radius (in meter)',
                    maxChar: 10,
                    isNumber: true,
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    dynamic: {
                      field: 'alertEmpOnVehicleEnterRadius',
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
                    type: 'textarea',
                    name: 'alertEmpOnVehicleEnterRadiusSMS',
                    id: 'alertEmpOnVehicleEnterRadiusSMS',
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
                      field: 'alertEmpOnVehicleEnterRadius',
                      value: 'YES',
                    },
                  },
                  {
                    type: 'textarea',
                    name: 'alertEmpOnVehicleEnterRadiusPush',
                    id: 'alertEmpOnVehicleEnterRadiusPush',
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
                      field: 'alertEmpOnVehicleEnterRadius',
                      value: 'YES',
                    },
                  },
                  {
                    type: 'ckeditor',
                    name: 'alertEmpOnVehicleEnterRadiusEmail',
                    id: 'alertEmpOnVehicleEnterRadiusEmail',
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
                      field: 'alertEmpOnVehicleEnterRadius',
                      value: 'YES',
                    },
                  },
                ],
              },

              {
                type: 'switchToggle',
                name: 'alertEmpBoardingLocViolationToManager',
                id: 'alertEmpBoardingLocViolationToManager',
                title: 'Alert employee boarding location violation to Manager',
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
                    name: 'alertEmpBoardingLocViolationToManagerSMS',
                    id: 'alertEmpBoardingLocViolationToManagerSMS',
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
                      field: 'alertEmpBoardingLocViolationToManager',
                      value: 'YES',
                    },
                  },
                  {
                    type: 'textarea',
                    name: 'alertEmpBoardingLocViolationToManagerPush',
                    id: 'alertEmpBoardingLocViolationToManagerPush',
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
                      field: 'alertEmpBoardingLocViolationToManager',
                      value: 'YES',
                    },
                  },
                  {
                    type: 'ckeditor',
                    name: 'alertEmpBoardingLocViolationToManagerEmail',
                    id: 'alertEmpBoardingLocViolationToManagerEmail',
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
                      field: 'alertEmpBoardingLocViolationToManager',
                      value: 'YES',
                    },
                  },
                ],
              },

              {
                type: 'switchToggle',
                name: 'alertEmpBoardingLocViolationToCorp',
                id: 'alertEmpBoardingLocViolationToCorp',
                title:
                  'Alert employee boarding location violation to Corporate-Admin',
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
                    name: 'alertEmpBoardingLocViolationToCorpSMS',
                    id: 'alertEmpBoardingLocViolationToCorpSMS',
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
                      field: 'alertEmpBoardingLocViolationToCorp',
                      value: 'YES',
                    },
                  },
                  {
                    type: 'textarea',
                    name: 'alertEmpBoardingLocViolationToCorpPush',
                    id: 'alertEmpBoardingLocViolationToCorpPush',
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
                      field: 'alertEmpBoardingLocViolationToCorp',
                      value: 'YES',
                    },
                  },
                  {
                    type: 'ckeditor',
                    name: 'alertEmpBoardingLocViolationToCorpEmail',
                    id: 'alertEmpBoardingLocViolationToCorpEmail',
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
                      field: 'alertEmpBoardingLocViolationToCorp',
                      value: 'YES',
                    },
                  },
                ],
              },

              // {
              //   type: 'switchToggle',
              //   name: 'alertAdminOnNotReceivingPoolingDetails',
              //   id: 'alertAdminOnNotReceivingPoolingDetails',
              //   title:
              //     'Alert on not receiving the Pooling details to Corporate-Admin ',
              //   infoMessage: ['Radio button is selectable', 'e.g.: yes'],
              //   options: [
              //     {title: 'Yes', value: 'YES'},
              //     {title: 'No', value: 'NO'},
              //   ],
              //   validationProps: {
              //     // required: 'This is a mandatory field'
              //   },
              // },
              // {
              //   type: 'section',
              //   layout: {column: 3, spacing: 2, size: 'small', label: 'fixed'},
              //   fields: [
              //     {
              //       type: 'text',
              //       name: 'alertAdminOnNotReceivingPoolingDetailsMinuteDiff',
              //       id: 'alertAdminOnNotReceivingPoolingDetailsMinuteDiff',
              //       title: 'Time (in minute)',
              //       maxChar: 10,
              //       isNumber: true,
              //       validationProps: {
              //         // required: 'This is a mandatory field'
              //       },
              //       dynamic: {
              //         field: 'alertAdminOnNotReceivingPoolingDetails',
              //         value: 'YES',
              //       },
              //     },
              //   ],
              // },
              // {
              //   type: 'section',
              //   layout: {column: 3, spacing: 2, size: 'small', label: 'fixed'},
              //   fields: [
              //     {
              //       type: 'textarea',
              //       name: 'alertAdminOnNotReceivingPoolingDetailsSMS',
              //       id: 'alertAdminOnNotReceivingPoolingDetailsSMS',
              //       title: 'SMS body',
              //       isCheckBox: true,
              //       isSMS: true,
              //       boxheight: 14.2,
              //       pattern: {
              //         value: regex.maxSize1000,
              //         message:
              //           'Please enter valid code with alpha-numeric and below 50 characters',
              //       },
              //       infoMessage: [
              //         'Alphanumeric characters are allowed',
              //         'Maximum length should be 250 characters',
              //         'e.g.:Successfully created',
              //       ],
              //       validationProps: {
              //         // required: 'This is a mandatory field'
              //       },
              //       dynamic: {
              //         field: 'alertAdminOnNotReceivingPoolingDetails',
              //         value: 'YES',
              //       },
              //     },
              //     {
              //       type: 'textarea',
              //       name: 'alertAdminOnNotReceivingPoolingDetailsPush',
              //       id: 'alertAdminOnNotReceivingPoolingDetailsPush',
              //       title: 'Push Notification body',
              //       isCheckBox: true,
              //       isSMS: true,
              //       boxheight: 14.2,
              //       pattern: {
              //         value: regex.maxSize1000,
              //         message:
              //           'Please enter valid code with alpha-numeric and below 50 characters',
              //       },
              //       infoMessage: [
              //         'Alphanumeric characters are allowed',
              //         'Maximum length should be 250 characters',
              //         'e.g.:Successfully created',
              //       ],
              //       validationProps: {
              //         // required: 'This is a mandatory field'
              //       },
              //       dynamic: {
              //         field: 'alertAdminOnNotReceivingPoolingDetails',
              //         value: 'YES',
              //       },
              //     },
              //     {
              //       type: 'ckeditor',
              //       name: 'alertAdminOnNotReceivingPoolingDetailsEmail',
              //       id: 'alertAdminOnNotReceivingPoolingDetailsEmail',
              //       isCheckBox: true,
              //       title: 'Email body',
              //       pattern: {
              //         value: regex.maxSize250,
              //         message:
              //           'Please enter valid code with alpha-numeric and below 50 characters',
              //       },
              //       infoMessage: [
              //         'Alphanumeric characters are allowed',
              //         'Maximum length should be 250 characters',
              //         'e.g.:Successfully created',
              //       ],
              //       validationProps: {
              //         // required: 'This is a mandatory field'
              //       },
              //       dynamic: {
              //         field: 'alertAdminOnNotReceivingPoolingDetails',
              //         value: 'YES',
              //       },
              //     },
              //   ],
              // },

              // {
              //   type: 'switchToggle',
              //   name: 'alertVendorOnNotReceivingPoolingDetails',
              //   id: 'alertVendorOnNotReceivingPoolingDetails',
              //   title: 'Alert on not receiving the Pooling details to Vendor',
              //   infoMessage: ['Radio button is selectable', 'e.g.: yes'],
              //   options: [
              //     {title: 'Yes', value: 'YES'},
              //     {title: 'No', value: 'NO'},
              //   ],
              //   validationProps: {
              //     // required: 'This is a mandatory field'
              //   },
              // },
              // {
              //   type: 'section',
              //   layout: {column: 3, spacing: 2, size: 'small', label: 'fixed'},
              //   fields: [
              //     {
              //       type: 'text',
              //       name: 'alertVendorOnNotReceivingPoolingDetailsMinuteDiff',
              //       id: 'alertVendorOnNotReceivingPoolingDetailsMinuteDiff',
              //       title: 'Time (in minute)',
              //       maxChar: 10,
              //       isNumber: true,
              //       validationProps: {
              //         // required: 'This is a mandatory field'
              //       },
              //       dynamic: {
              //         field: 'alertAdminOnNotReceivingPoolingDetails',
              //         value: 'YES',
              //       },
              //     },
              //   ],
              // },
              // {
              //   type: 'section',
              //   layout: {column: 3, spacing: 2, size: 'small', label: 'fixed'},
              //   fields: [
              //     {
              //       type: 'textarea',
              //       name: 'alertVendorOnNotReceivingPoolingDetailsSMS',
              //       id: 'alertVendorOnNotReceivingPoolingDetailsSMS',
              //       title: 'SMS body',
              //       isCheckBox: true,
              //       isSMS: true,
              //       boxheight: 14.2,
              //       pattern: {
              //         value: regex.maxSize1000,
              //         message:
              //           'Please enter valid code with alpha-numeric and below 50 characters',
              //       },
              //       infoMessage: [
              //         'Alphanumeric characters are allowed',
              //         'Maximum length should be 250 characters',
              //         'e.g.:Successfully created',
              //       ],
              //       validationProps: {
              //         // required: 'This is a mandatory field'
              //       },
              //       dynamic: {
              //         field: 'alertVendorOnNotReceivingPoolingDetails',
              //         value: 'YES',
              //       },
              //     },
              //     {
              //       type: 'textarea',
              //       name: 'alertVendorOnNotReceivingPoolingDetailsPush',
              //       id: 'alertVendorOnNotReceivingPoolingDetailsPush',
              //       title: 'Push Notification body',
              //       isCheckBox: true,
              //       isSMS: true,
              //       boxheight: 14.2,
              //       pattern: {
              //         value: regex.maxSize1000,
              //         message:
              //           'Please enter valid code with alpha-numeric and below 50 characters',
              //       },
              //       infoMessage: [
              //         'Alphanumeric characters are allowed',
              //         'Maximum length should be 250 characters',
              //         'e.g.:Successfully created',
              //       ],
              //       validationProps: {
              //         // required: 'This is a mandatory field'
              //       },
              //       dynamic: {
              //         field: 'alertVendorOnNotReceivingPoolingDetails',
              //         value: 'YES',
              //       },
              //     },
              //     {
              //       type: 'ckeditor',
              //       name: 'alertVendorOnNotReceivingPoolingDetailsEmail',
              //       id: 'alertVendorOnNotReceivingPoolingDetailsEmail',
              //       isCheckBox: true,
              //       title: 'Email body',
              //       pattern: {
              //         value: regex.maxSize250,
              //         message:
              //           'Please enter valid code with alpha-numeric and below 50 characters',
              //       },
              //       infoMessage: [
              //         'Alphanumeric characters are allowed',
              //         'Maximum length should be 250 characters',
              //         'e.g.:Successfully created',
              //       ],
              //       validationProps: {
              //         // required: 'This is a mandatory field'
              //       },
              //       dynamic: {
              //         field: 'alertVendorOnNotReceivingPoolingDetails',
              //         value: 'YES',
              //       },
              //     },
              //   ],
              // },

              {
                type: 'switchToggle',
                name: 'alertCorpOnOverSpeedingBetween',
                id: 'alertCorpOnOverSpeedingBetween',
                title: 'Alert on Overspeeding to Corporate-Admin',
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
                    name: 'alertCorpOnOverSpeedingBetweenfrom',
                    id: 'alertCorpOnOverSpeedingBetweenfrom',
                    title: 'From (in km)',
                    maxChar: 10,
                    isNumber: true,
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    dynamic: {
                      field: 'alertCorpOnOverSpeedingBetween',
                      value: 'YES',
                    },
                  },

                  {
                    type: 'text',
                    name: 'alertCorpOnOverSpeedingBetweento',
                    id: 'alertCorpOnOverSpeedingBetweento',
                    title: 'To (in km)',
                    maxChar: 10,
                    isNumber: true,
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    dynamic: {
                      field: 'alertCorpOnOverSpeedingBetween',
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
                    type: 'textarea',
                    name: 'alertCorpOnOverSpeedingBetweenSMS',
                    id: 'alertCorpOnOverSpeedingBetweenSMS',
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
                      field: 'alertCorpOnOverSpeedingBetween',
                      value: 'YES',
                    },
                  },
                  {
                    type: 'textarea',
                    name: 'alertCorpOnOverSpeedingBetweenPush',
                    id: 'alertCorpOnOverSpeedingBetweenPush',
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
                      field: 'alertCorpOnOverSpeedingBetween',
                      value: 'YES',
                    },
                  },
                  {
                    type: 'ckeditor',
                    name: 'alertCorpOnOverSpeedingBetweenEmail',
                    id: 'alertCorpOnOverSpeedingBetweenEmail',
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
                      field: 'alertCorpOnOverSpeedingBetween',
                      value: 'YES',
                    },
                  },
                ],
              },

              {
                type: 'switchToggle',
                name: 'alertVendorOnOverSpeedingBetween',
                id: 'alertVendorOnOverSpeedingBetween',
                title: 'Alert on Overspeeding to Vendor',
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
                    name: 'alertVendorOnOverSpeedingBetweenfrom',
                    id: 'alertVendorOnOverSpeedingBetweenfrom',
                    title: 'From (in km)',
                    maxChar: 10,
                    isNumber: true,
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    dynamic: {
                      field: 'alertVendorOnOverSpeedingBetween',
                      value: 'YES',
                    },
                  },

                  {
                    type: 'text',
                    name: 'alertVendorOnOverSpeedingBetweento',
                    id: 'alertVendorOnOverSpeedingBetweento',
                    title: 'To (in km)',
                    maxChar: 10,
                    isNumber: true,
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    dynamic: {
                      field: 'alertVendorOnOverSpeedingBetween',
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
                    type: 'textarea',
                    name: 'alertVendorOnOverSpeedingBetweenSMS',
                    id: 'alertVendorOnOverSpeedingBetweenSMS',
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
                      field: 'alertVendorOnOverSpeedingBetween',
                      value: 'YES',
                    },
                  },
                  // {
                  //   type: 'textarea',
                  //   name: 'alertVendorOnOverSpeedingBetweenPush',
                  //   id: 'alertVendornOverSpeedingBetweenPush',
                  //   title: 'Push Notification body',
                  //   isCheckBox: true,
                  //   isSMS: true,
                  //   boxheight: 14.2,
                  //   pattern: {
                  //     value: regex.maxSize1000,
                  //     message:
                  //       'Please enter valid code with alpha-numeric and below 50 characters',
                  //   },
                  //   infoMessage: [
                  //     'Alphanumeric characters are allowed',
                  //     'Maximum length should be 250 characters',
                  //     'e.g.:Successfully created',
                  //   ],
                  //   validationProps: {
                  //     // required: 'This is a mandatory field'
                  //   },
                  //   dynamic: {
                  //     field: 'alertVendorOnOverSpeedingBetween',
                  //     value: 'YES',
                  //   },
                  // },
                  {
                    type: 'ckeditor',
                    name: 'alertVendorOnOverSpeedingBetweenEmail',
                    id: 'alertVendorOnOverSpeedingBetweenEmail',
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
                      field: 'alertVendorOnOverSpeedingBetween',
                      value: 'YES',
                    },
                  },
                ],
              },

              // {
              //   type: 'switchToggle',
              //   name: 'alertManagerForVehicleStopMoreThanMinute',
              //   id: 'alertManagerForVehicleStopMoreThanMinute',
              //   title: 'Alert the Manager for Vehicle Stoppage',
              //   infoMessage: ['Radio button is selectable', 'e.g.: yes'],
              //   options: [
              //     {title: 'Yes', value: 'YES'},
              //     {title: 'No', value: 'NO'},
              //   ],
              //   validationProps: {
              //     // required: 'This is a mandatory field'
              //   },
              // },
              // {
              //   type: 'section',
              //   layout: {column: 3, spacing: 2, size: 'small', label: 'fixed'},
              //   fields: [
              //     {
              //       type: 'text',
              //       name: 'alertManagerForVehicleStopMoreThanMinuteinMin',
              //       id: 'alertManagerForVehicleStopMoreThanMinuteinMin',
              //       title: 'Time (in min)',
              //       maxChar: 10,
              //       isNumber: true,
              //       validationProps: {
              //         // required: 'This is a mandatory field'
              //       },
              //       dynamic: {
              //         field: 'alertManagerForVehicleStopMoreThanMinute',
              //         value: 'YES',
              //       },
              //     },
              //   ],
              // },

              // {
              //   type: 'section',
              //   layout: {column: 3, spacing: 2, size: 'small', label: 'fixed'},
              //   fields: [
              //     {
              //       type: 'textarea',
              //       name: 'alertManagerForVehicleStopMoreThanMinuteSMS',
              //       id: 'alertManagerForVehicleStopMoreThanMinuteSMS',
              //       title: 'SMS body',
              //       isCheckBox: true,
              //       isSMS: true,
              //       boxheight: 14.2,
              //       pattern: {
              //         value: regex.maxSize1000,
              //         message:
              //           'Please enter valid code with alpha-numeric and below 50 characters',
              //       },
              //       infoMessage: [
              //         'Alphanumeric characters are allowed',
              //         'Maximum length should be 250 characters',
              //         'e.g.:Successfully created',
              //       ],
              //       validationProps: {
              //         // required: 'This is a mandatory field'
              //       },
              //       dynamic: {
              //         field: 'alertManagerForVehicleStopMoreThanMinute',
              //         value: 'YES',
              //       },
              //     },
              //     {
              //       type: 'textarea',
              //       name: 'alertManagerForVehicleStopMoreThanMinutePush',
              //       id: 'alertManagerForVehicleStopMoreThanMinutePush',
              //       title: 'Push Notification body',
              //       isCheckBox: true,
              //       isSMS: true,
              //       boxheight: 14.2,
              //       pattern: {
              //         value: regex.maxSize1000,
              //         message:
              //           'Please enter valid code with alpha-numeric and below 50 characters',
              //       },
              //       infoMessage: [
              //         'Alphanumeric characters are allowed',
              //         'Maximum length should be 250 characters',
              //         'e.g.:Successfully created',
              //       ],
              //       validationProps: {
              //         // required: 'This is a mandatory field'
              //       },
              //       dynamic: {
              //         field: 'alertManagerForVehicleStopMoreThanMinute',
              //         value: 'YES',
              //       },
              //     },
              //     {
              //       type: 'ckeditor',
              //       name: 'alertManagerForVehicleStopMoreThanMinuteEmail',
              //       id: 'alertManagerForVehicleStopMoreThanMinuteEmail',
              //       isCheckBox: true,
              //       title: 'Email body',
              //       pattern: {
              //         value: regex.maxSize250,
              //         message:
              //           'Please enter valid code with alpha-numeric and below 50 characters',
              //       },
              //       infoMessage: [
              //         'Alphanumeric characters are allowed',
              //         'Maximum length should be 250 characters',
              //         'e.g.:Successfully created',
              //       ],
              //       validationProps: {
              //         // required: 'This is a mandatory field'
              //       },
              //       dynamic: {
              //         field: 'alertManagerForVehicleStopMoreThanMinute',
              //         value: 'YES',
              //       },
              //     },
              //   ],
              // },

              // {
              //   type: 'switchToggle',
              //   name: 'alertCorpAdminForVehicleStopMoreThanMinute',
              //   id: 'alertCorpAdminForVehicleStopMoreThanMinute',
              //   title: 'Alert the Corporate-Admin for Vehicle Stoppage',
              //   infoMessage: ['Radio button is selectable', 'e.g.: yes'],
              //   options: [
              //     {title: 'Yes', value: 'YES'},
              //     {title: 'No', value: 'NO'},
              //   ],
              //   validationProps: {
              //     // required: 'This is a mandatory field'
              //   },
              // },
              // {
              //   type: 'section',
              //   layout: {column: 3, spacing: 2, size: 'small', label: 'fixed'},
              //   fields: [
              //     {
              //       type: 'text',
              //       name: 'alertCorpForVehicleStopMoreThanMinuteinMin',
              //       id: 'alertCorpForVehicleStopMoreThanMinuteinMin',
              //       title: 'Time (in min)',
              //       maxChar: 10,
              //       isNumber: true,
              //       validationProps: {
              //         // required: 'This is a mandatory field'
              //       },
              //       dynamic: {
              //         field: 'alertCorpAdminForVehicleStopMoreThanMinute',
              //         value: 'YES',
              //       },
              //     },
              //   ],
              // },
              // {
              //   type: 'section',
              //   layout: {column: 3, spacing: 2, size: 'small', label: 'fixed'},
              //   fields: [
              //     {
              //       type: 'textarea',
              //       name: 'alertCorpAdminForVehicleStopMoreThanMinuteSMS',
              //       id: 'alertCorpAdminForVehicleStopMoreThanMinuteSMS',
              //       title: 'SMS body',
              //       isCheckBox: true,
              //       isSMS: true,
              //       boxheight: 14.2,
              //       pattern: {
              //         value: regex.maxSize1000,
              //         message:
              //           'Please enter valid code with alpha-numeric and below 50 characters',
              //       },
              //       infoMessage: [
              //         'Alphanumeric characters are allowed',
              //         'Maximum length should be 250 characters',
              //         'e.g.:Successfully created',
              //       ],
              //       validationProps: {
              //         // required: 'This is a mandatory field'
              //       },
              //       dynamic: {
              //         field: 'alertCorpAdminForVehicleStopMoreThanMinute',
              //         value: 'YES',
              //       },
              //     },
              //     {
              //       type: 'textarea',
              //       name: 'alertCorpAdminForVehicleStopMoreThanMinutePush',
              //       id: 'alertCorpAdminForVehicleStopMoreThanMinutePush',
              //       title: 'Push Notification body',
              //       isCheckBox: true,
              //       isSMS: true,
              //       boxheight: 14.2,
              //       pattern: {
              //         value: regex.maxSize1000,
              //         message:
              //           'Please enter valid code with alpha-numeric and below 50 characters',
              //       },
              //       infoMessage: [
              //         'Alphanumeric characters are allowed',
              //         'Maximum length should be 250 characters',
              //         'e.g.:Successfully created',
              //       ],
              //       validationProps: {
              //         // required: 'This is a mandatory field'
              //       },
              //       dynamic: {
              //         field: 'alertCorpAdminForVehicleStopMoreThanMinute',
              //         value: 'YES',
              //       },
              //     },
              //     {
              //       type: 'ckeditor',
              //       name: 'alertCorpAdminForVehicleStopMoreThanMinuteEmail',
              //       id: 'alertCorpAdminForVehicleStopMoreThanMinuteEmail',
              //       isCheckBox: true,
              //       title: 'Email body',
              //       pattern: {
              //         value: regex.maxSize250,
              //         message:
              //           'Please enter valid code with alpha-numeric and below 50 characters',
              //       },
              //       infoMessage: [
              //         'Alphanumeric characters are allowed',
              //         'Maximum length should be 250 characters',
              //         'e.g.:Successfully created',
              //       ],
              //       validationProps: {
              //         // required: 'This is a mandatory field'
              //       },
              //       dynamic: {
              //         field: 'alertCorpAdminForVehicleStopMoreThanMinute',
              //         value: 'YES',
              //       },
              //     },
              //   ],
              // },

              {
                type: 'switchToggle',
                name: 'alertDriverToEndTrip',
                id: 'alertDriverToEndTrip',
                title: 'Alert Driver to end the Trip',
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
                    type: 'radio',
                    name: 'alertDriverToEndTripIfEmpAttdCapturedAndLoginTimeCrossed',
                    id: 'alertDriverToEndTripIfEmpAttdCapturedAndLoginTimeCrossed',
                    title:
                      'All Employee Attendence captured and login time is crossed',
                    infoMessage: ['Radio button is selectable', 'e.g.: yes'],
                    options: [
                      {title: 'Yes', value: 'YES'},
                      {title: 'No', value: 'NO'},
                    ],
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    dynamic: {
                      field: 'alertDriverToEndTrip',
                      value: 'YES',
                    },
                  },
                ],
              },
              // {
              //     type: 'radio',
              //     name: 'alertDriverToEndTripIfEmpAttdCapturedAndLoginTimeCrossed',
              //     id: 'alertDriverToEndTripIfEmpAttdCapturedAndLoginTimeCrossed',
              //     title: "All Employee Attendence captured and login time is crossed",
              //     infoMessage: ["Radio button is selectable", "e.g.: yes"],
              //     options: [
              //         { title: "Yes", value: "YES" },
              //         { title: "No", value: "NO" }
              //     ],
              //     validationProps: {
              //         // required: 'This is a mandatory field'
              //     },
              //     dynamic: {
              //         field: 'alertDriverToEndTrip',
              //         value: 'YES'
              //     },
              // },
              {
                type: 'section',
                layout: {column: 3, spacing: 2, size: 'small', label: 'fixed'},
                fields: [
                  {
                    type: 'textarea',
                    name: 'alertDriverToEndTripIfEmpAttdCapturedAndLoginTimeCrossedSMS',
                    id: 'alertDriverToEndTripIfEmpAttdCapturedAndLoginTimeCrossedSMS',
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
                        'alertDriverToEndTripIfEmpAttdCapturedAndLoginTimeCrossed',
                      value: 'YES',
                    },
                  },
                  {
                    type: 'textarea',
                    name: 'alertDriverToEndTripIfEmpAttdCapturedAndLoginTimeCrossedPush',
                    id: 'alertDriverToEndTripIfEmpAttdCapturedAndLoginTimeCrossedPush',
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
                        'alertDriverToEndTripIfEmpAttdCapturedAndLoginTimeCrossed',
                      value: 'YES',
                    },
                  },
                  {
                    type: 'ckeditor',
                    name: 'alertDriverToEndTripIfEmpAttdCapturedAndLoginTimeCrossedEmail',
                    id: 'alertDriverToEndTripIfEmpAttdCapturedAndLoginTimeCrossedEmail',
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
                        'alertDriverToEndTripIfEmpAttdCapturedAndLoginTimeCrossed',
                      value: 'YES',
                    },
                  },
                ],
              },
              {
                type: 'radio',
                name: 'alertDriverToEndTripIfEmpAttdCapturedAndEnterOfficeGeofence',
                id: 'alertDriverToEndTripIfEmpAttdCapturedAndEnterOfficeGeofence',
                title:
                  'All Employee Attendence captured and entered the office Geo-fence',
                infoMessage: ['Radio button is selectable', 'e.g.: yes'],
                options: [
                  {title: 'Yes', value: 'YES'},
                  {title: 'No', value: 'NO'},
                ],
                validationProps: {
                  // required: 'This is a mandatory field'
                },
                dynamic: {
                  field: 'alertDriverToEndTrip',
                  value: 'YES',
                },
              },

              {
                type: 'section',
                layout: {column: 3, spacing: 2, size: 'small', label: 'fixed'},
                fields: [
                  {
                    type: 'textarea',
                    name: 'alertDriverToEndTripIfEmpAttdCapturedAndEnterOfficeGeofenceSMS',
                    id: 'alertDriverToEndTripIfEmpAttdCapturedAndEnterOfficeGeofenceSMS',
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
                        'alertDriverToEndTripIfEmpAttdCapturedAndEnterOfficeGeofence',
                      value: 'YES',
                    },
                  },
                  {
                    type: 'textarea',
                    name: 'alertDriverToEndTripIfEmpAttdCapturedAndEnterOfficeGeofencePush',
                    id: 'alertDriverToEndTripIfEmpAttdCapturedAndEnterOfficeGeofencePush',
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
                        'alertDriverToEndTripIfEmpAttdCapturedAndEnterOfficeGeofence',
                      value: 'YES',
                    },
                  },
                  {
                    type: 'ckeditor',
                    name: 'alertDriverToEndTripIfEmpAttdCapturedAndEnterOfficeGeofenceEmail',
                    id: 'alertDriverToEndTripIfEmpAttdCapturedAndEnterOfficeGeofenceEmail',
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
                        'alertDriverToEndTripIfEmpAttdCapturedAndEnterOfficeGeofence',
                      value: 'YES',
                    },
                  },
                ],
              },

              // {
              //   type: 'switchToggle',
              //   name: 'autoStartTrip',
              //   id: 'autoStartTrip',
              //   title:
              //     'Allow Driver to add the Employee in the trip at the last minute ',
              //   infoMessage: ['Radio button is selectable', 'e.g.: yes'],
              //   options: [
              //     {title: 'Yes', value: 'YES'},
              //     {title: 'No', value: 'NO'},
              //   ],
              //   validationProps: {
              //     // required: 'This is a mandatory field'
              //   },
              // },
              // {
              //   type: 'section',
              //   layout: {column: 2, spacing: 2, size: 'small', label: 'fixed'},
              //   fields: [
              //     {
              //       type: 'text',
              //       name: 'autoStartTripMinutesBeforeFirstPickupETA',
              //       id: 'autoStartTripMinutesBeforeFirstPickupETA',
              //       title: 'Minutes before the first pickup ETA',
              //       validationProps: {
              //         // required: 'This is a mandatory field'
              //       },
              //       dynamic: {
              //         field: 'autoStartTrip',
              //         value: 'YES',
              //       },
              //     },
              //     {
              //       type: 'text',
              //       name: 'autoStartTripMinutesBeforeLogout',
              //       id: 'autoStartTripMinutesBeforeLogout',
              //       title: 'Minutes before the Logout',
              //       validationProps: {},
              //       dynamic: {
              //         field: 'autoStartTrip',
              //         value: 'YES',
              //       },
              //     },
              //   ],
              // },

              // {
              //   type: 'switchToggle',
              //   name: 'autoEndTrip',
              //   id: 'autoEndTrip',
              //   title:
              //     'Allow Driver to add the Employee in the trip at the last minute ',
              //   infoMessage: ['Radio button is selectable', 'e.g.: yes'],
              //   options: [
              //     {title: 'Yes', value: 'YES'},
              //     {title: 'No', value: 'NO'},
              //   ],
              //   validationProps: {
              //     // required: 'This is a mandatory field'
              //   },
              // },
              // {
              //   type: 'section',
              //   layout: {column: 3, spacing: 2, size: 'small', label: 'fixed'},
              //   fields: [
              //     {
              //       type: 'text',
              //       name: 'autoEndTripMinuteAfterLoginTime',
              //       id: 'autoEndTripMinuteAfterLoginTime',
              //       title: 'Minutes after the Login Time',
              //       validationProps: {
              //         // required: 'This is a mandatory field'
              //       },
              //       dynamic: {
              //         field: 'autoEndTrip',
              //         value: 'YES',
              //       },
              //     },
              //     {
              //       type: 'text',
              //       name: 'autoEndTripAfterEnteringOfcGeofence',
              //       id: 'autoEndTripAfterEnteringOfcGeofence',
              //       title: 'Minutes after entering the office Geo-fence',
              //       validationProps: {},
              //       dynamic: {
              //         field: 'autoEndTrip',
              //         value: 'YES',
              //       },
              //     },
              //     {
              //       type: 'text',
              //       name: 'autoEndTripAfterLastDrop',
              //       id: 'autoEndTripAfterLastDrop',
              //       title: 'Minutes after the last drop',
              //       validationProps: {},
              //       dynamic: {
              //         field: 'autoEndTrip',
              //         value: 'YES',
              //       },
              //     },
              //   ],
              // },

              {
                type: 'switchToggle',
                name: 'autoMarkingEmpNoshowOnEndingTrip',
                id: 'autoMarkingEmpNoshowOnEndingTrip',
                title: 'Auto marking employees Noshow on Ending the trip ',
                infoMessage: ['Radio button is selectable', 'e.g.: yes'],
                options: [
                  {title: 'Yes', value: 'YES'},
                  {title: 'No', value: 'NO'},
                ],
                validationProps: {
                  // required: 'This is a mandatory field'
                },
              },
              // {
              //   type: 'switchToggle',
              //   name: 'markPunchFromCorporate',
              //   id: 'markPunchFromCorporate',
              //   title: 'Can Driver Mark punch in from Corporate Area',
              //   infoMessage: ['Radio button is selectable', 'e.g.: yes'],
              //   options: [
              //     {title: 'Yes', value: 'YES'},
              //     {title: 'No', value: 'NO'},
              //   ],
              //   validationProps: {
              //     // required: 'This is a mandatory field'
              //   },
              // },
              // {
              //   type: 'text',
              //   name: 'corporateGeoFenceAreaRange',
              //   id: 'corporateGeoFenceAreaRange',
              //   title: 'Corportae Geo Fence area range _______________',
              //   validationProps: {},
              // },
              // {
              //   type: 'switchToggle',
              //   name: 'allowedExtraHours',
              //   id: 'allowedExtraHours',
              //   title: 'Allowed Extra Hours',
              //   infoMessage: ['Radio button is selectable', 'e.g.: yes'],
              //   options: [
              //     {title: 'Yes', value: 'YES'},
              //     {title: 'No', value: 'NO'},
              //   ],
              //   validationProps: {
              //     // required: 'This is a mandatory field'
              //   },
              // },

              {
                type: 'radio',
                name: 'allowDriverToRateEmpStatus',
                id: 'allowDriverToRateEmpStatus',
                title: 'Allow Driver To Rate Employee Status',
                infoMessage: ['Radio button is selectable', 'e.g.: yes'],
                options: [
                  {title: 'Mandatory', value: 'Mandatory'},
                  {title: 'Non-Mandatory', value: 'Non-Mandatory'},
                ],
                validationProps: {
                  // required: 'This is a mandatory field'
                },
                dynamic: {
                  field: 'allowDriverToRateEmp',
                  value: 'YES',
                },
              },
              {
                type: 'switchToggle',
                name: 'allowDisplayLoginRoutes',
                id: 'allowDisplayLoginRoutes',
                title: 'Allow Display login Route ',
                infoMessage: ['Radio button is selectable', 'e.g.: yes'],
                options: [
                  {title: 'Yes', value: 'YES'},
                  {title: 'No', value: 'NO'},
                ],
                validationProps: {
                  // required: 'This is a mandatory field'
                },
              },
              //   {
              //     type: 'section',
              //     layout: {column: 3, spacing: 4, size: 'small', label: 'fixed'},
              //     fields: [
              //       {
              //         type: 'text',
              //         name: 'DisplayLoginRoutes',
              //         id: 'DisplayLoginRoutes',
              //         title:
              //           'Display Login Routes before ________ hours of shift',
              //         validationProps: {
              //           // required: 'This is a mandatory field'
              //         },
              //         dynamic: {
              //           field: 'allowDisplayLoginRoutes',
              //           value: 'YES',
              //         },
              //       },
              //     ],
              //   },
              {
                type: 'switchToggle',
                name: 'allowDisplayLogoutRoutes',
                id: 'allowDisplayLogoutRoutes',
                title: 'Allow Display logout Route ',
                infoMessage: ['Radio button is selectable', 'e.g.: yes'],
                options: [
                  {title: 'Yes', value: 'YES'},
                  {title: 'No', value: 'NO'},
                ],
                validationProps: {
                  // required: 'This is a mandatory field'
                },
              },
              //   {
              //     type: 'section',
              //     layout: {column: 3, spacing: 4, size: 'small', label: 'fixed'},
              //     fields: [
              //       {
              //         type: 'text',
              //         name: 'DisplayLogoutRoutes',
              //         id: 'DisplayLogoutRoutes',
              //         title:
              //           'Display Logout Routes before ________ hours of shift',
              //         validationProps: {
              //           // required: 'This is a mandatory field'
              //         },
              //         dynamic: {
              //           field: 'allowDisplayLogoutRoutes',
              //           value: 'YES',
              //         },
              //       },
              //     ],
              //   },
              {
                type: 'section',
                layout: {column: 2, spacing: 4, size: 'small', label: 'fixed'},
                fields: [],
              },

              {
                type: 'section',
                layout: {column: 2, spacing: 4, size: 'small', label: 'fixed'},
                fields: [
                  {
                    type: 'text',
                    name: 'generateOTPQRCodeOfEmpMinutesBefETA',
                    id: 'generateOTPQRCodeOfEmpMinutesBefETA',
                    maxChar: 6,
                    isNumber: true,
                    title:
                      'Generate the OTP/QR code of an employee ___minutes before ETA',
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    dynamic: {
                      field: 'allowtoGenerateQrOrOtp',
                      value: 'YES',
                    },
                  },
                  {
                    type: 'text',
                    name: 'QRCodeOfEmpAftEnteringMeterDiffGeofence',
                    id: 'QRCodeOfEmpAftEnteringMeterDiffGeofence',
                    maxChar: 6,
                    isNumber: true,
                    title:
                      'Generate the OTP/QR code of an employee after entering ___ meters geofence',
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    dynamic: {
                      field: 'allowtoGenerateQrOrOtp',
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
                    type: 'switchToggle',
                    name: 'allowDriverToAddEscortAtLastMinute',
                    id: 'allowDriverToAddEscortAtLastMinute',
                    title: 'Allow Driver to add escort at last Minute',
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
                type: 'switchToggle',
                name: 'allowDriverToAddEmpAtLastMinute',
                id: 'allowDriverToAddEmpAtLastMinute',
                title:
                  'Allow Driver to add the Employee in the trip at the last minute ',
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
                    name: 'maximumTripAllowedToOperateByDriverPerDay',
                    id: 'maximumTripAllowedToOperateByDriverPerDay',
                    title: 'Maximum Trip allowed to operate by Driver Per day ',
                    maxChar: 6,
                    isNumber: true,
                    infoMessage: ['Radio button is selectable', 'e.g.: yes'],
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                  },
                ],
              },

              {
                type: 'switchToggle',
                name: 'blockDriverToOperateMoreThanAllwMaxTripPerDay',
                id: 'blockDriverToOperateMoreThanAllwMaxTripPerDay',
                title:
                  'Block the driver to operate more than allowed maximum trips per day',
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
                name: 'allowDriverStartTripWithoutEscortAttd',
                id: 'allowDriverStartTripWithoutEscortAttd',
                title:
                  'Allow Driver to Start the trip without Escort attendence ',
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
                    type: 'text',
                    name: 'displayStartButtonBeforeMinDiffOfFirstPickup',
                    id: 'displayStartButtonBeforeMinDiffOfFirstPickup',
                    maxChar: 6,
                    isNumber: true,
                    title:
                      'Display Start button before______minutes of first pickup ',
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                  },
                  {
                    type: 'text',
                    name: 'displayStartButtonBeforeMinDiffOfLogoutTime',
                    id: 'displayStartButtonBeforeMinDiffOfLogoutTime',
                    title:
                      'Display Start button before ______minutes of logout time',
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
                    name: 'displayLoginCompleteTripButtonBeforeMinDiffLoginTime',
                    id: 'displayLoginCompleteTripButtonBeforeMinDiffLoginTime',
                    maxChar: 6,
                    isNumber: true,
                    title:
                      'Display login complete trip button before ____ of login time ',
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                  },
                ],
              },

              {
                type: 'section',
                layout: {column: 2, spacing: 2, size: 'small', label: 'fixed'},
                fields: [
                  {
                    type: 'switchToggle',
                    name: 'displayLoginCompleteTripButtonAfterAllEmpAttdCapture',
                    id: 'displayLoginCompleteTripButtonAfterAllEmpAttdCapture',
                    title:
                      'Display login complete trip button after capturing all employee attendence ',
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    options: [
                      {title: 'Yes', value: 'YES'},
                      {title: 'No', value: 'NO'},
                    ],
                  },
                  // {
                  //   type: 'switchToggle',
                  //   name: 'displayLoginCompleteTripButtonAfterEntOfcGeofence',
                  //   id: 'displayLoginCompleteTripButtonAfterEntOfcGeofence',
                  //   title:
                  //     'Display login complete trip button after entering the Geo-fence',
                  //   validationProps: {
                  //     // required: 'This is a mandatory field'
                  //   },
                  //   options: [
                  //     {title: 'Yes', value: 'YES'},
                  //     {title: 'No', value: 'NO'},
                  //   ],
                  // },
                ],
              },

              {
                type: 'section',
                layout: {column: 3, spacing: 2, size: 'small', label: 'fixed'},
                fields: [
                  {
                    type: 'text',
                    name: 'driverShouldReceiveSleepAlertFrom',
                    id: 'driverShouldReceiveSleepAlertFrom',
                    title:
                      'Driver should receive sleep alert from(in hours) ___ ',
                    maxChar: 2,
                    isNumber: true,
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    dynamic: {
                      field: 'driverShouldReceiveSleepAlert',
                      value: 'YES',
                    },
                  },
                  {
                    type: 'text',
                    name: 'driverShouldReceiveSleepAlertTo',
                    id: 'driverShouldReceiveSleepAlertTo',
                    title:
                      'Driver should receive sleep alert to(in hours) ___ ',
                    maxChar: 2,
                    isNumber: true,
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    dynamic: {
                      field: 'driverShouldReceiveSleepAlert',
                      value: 'YES',
                    },
                  },
                  {
                    type: 'text',
                    name: 'driverShouldReceiveSleepAlertFrequency',
                    id: 'driverShouldReceiveSleepAlertFrequency',
                    title:
                      'Driver should receive sleep alert after ___  frequency',
                    maxChar: 2,
                    isNumber: true,
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    dynamic: {
                      field: 'driverShouldReceiveSleepAlert',
                      value: 'YES',
                    },
                  },
                ],
              },

              {
                type: 'switchToggle',
                name: 'isConsentMandatoryForDriverToStartTheTrip',
                id: 'isConsentMandatoryForDriverToStartTheTrip',
                title: 'Is consent is mandatory for driver to start the trip? ',
                validationProps: {
                  // required: 'This is a mandatory field'
                },
                options: [
                  {title: 'Yes', value: 'YES'},
                  {title: 'No', value: 'NO'},
                ],
              },

              {
                type: 'text',
                name: 'changeThePolylineIfRouteDeviatedFromTheOriginalPathMoreThanMeters',
                id: 'changeThePolylineIfRouteDeviatedFromTheOriginalPathMoreThanMeters',
                title:
                  'Change the polyline if route deviated from the original path more than______meters',
                validationProps: {
                  // required: 'This is a mandatory field'
                },
                maxChar: 6,
                isNumber: true,
              },

              {
                type: 'section',
                layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
                fields: [
                  {
                    type: 'switchToggle',
                    name: 'makingAbsentOfEmpWithAttdNOSTATUSOnLoginCompletionTrip',
                    id: 'makingAbsentOfEmpWithAttdNOSTATUSOnLoginCompletionTrip',
                    title:
                      'Making absent of Employee with attendence NO STATUS on login complete trip ',
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    options: [
                      {title: 'Yes', value: 'YES'},
                      {title: 'No', value: 'NO'},
                    ],
                  },
                  {
                    type: 'switchToggle',
                    name: 'makingAbsentOfEmpWithAttdNOSTATUSOnLogoutCompletionTrip',
                    id: 'makingAbsentOfEmpWithAttdNOSTATUSOnLogoutCompletionTrip',
                    title:
                      'Making absent of Employee with attendence NO STATUS on logout complete trip ',
                    validationProps: {
                      // required: 'This is a mandatory field'
                    },
                    options: [
                      {title: 'Yes', value: 'YES'},
                      {title: 'No', value: 'NO'},
                    ],
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
        title: 'Trip Rating',
        fields: [
          {
            type: 'section',
            layout: {column: 1, spacing: 2, size: 'medium', label: 'fixed'},
            fields: [
              {
                type: 'switchToggle',
                name: 'allowDriverToRateEmp',
                id: 'allowDriverToRateEmp',
                title: 'Allow driver to rate employees ',
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
    ],
  };

  function handleSubmit(val) {
    setshowbtn(false);
    if (val?.button == 'submit') {
      let postData = val?.data;
      if (val?.data?.nonEditableFieldsInVerifyAndUpdate == '') {
        postData.nonEditableFieldsInVerifyAndUpdate = [];
      }
      postData.corporateId = [id];
      axios
        .post(
          Api.baseUri + '/user-reg/driver-setting/save-driverSetting',
          postData,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success(
              res?.data?.data?.message ||
                'Driver Setting Submitted Successfully',
            );
            setshowbtn(true);
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
      console.log(val?.data?.nonEditableFieldsInVerifyAndUpdate);
      axios
        .put(
          Api.baseUri + '/user-reg/driver-setting/update-driverSetting',
          postData,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success(
              res?.data?.data?.message || 'Driver Setting Updated Successfully',
            );
            setshowbtn(true);
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
          <CustomLabel labelVal='Driver Setting' variantVal='h3-underline' />
        </Grid>
      </Grid>
      {!showbtn ? <AppLoader /> : null}
      {data ? (
        <SmartForm
          defaultValues={data?.id ? data : {}}
          template={template}
          onSubmit={handleSubmit}
          buttons={data?.id ? ['update'] : ['submit']}
        />
      ) : null}
    </>
  );
};

export default DriverSetting;
