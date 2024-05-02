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
import {Divider} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';

import {async} from '@firebase/util';
import {values} from 'lodash';
import Dialog from '@mui/material/Dialog';

import DialogContent from '@mui/material/DialogContent';
import Api from '@api';

const PendingEditPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const {id} = useParams();
  const {user} = useAuthUser();

  const [openDialog, setOpenDialog] = useState(false);
  const [btnName, setBtnName] = useState(null);
  const [subVal, setsubVal] = useState({});
  const [vendor, setVendor] = useState();
  const [mobileCheck, setMobileCheck] = useState();

  const [showbtn, setshowbtn] = React.useState(true);

  const vendorProfile = user?.userList?.profileId;
  useEffect(() => {
    async function fetchVendorData() {
      const baseURL = `${api.vendor.list}/${vendorProfile}`;
      let response = await axios.get(`${baseURL}`);

      setVendor(response.data.data);
    }
    fetchVendorData();
  }, [vendorProfile]);

  useEffect(() => {
    async function fetchData() {
      const baseURL = `${api.driver.changeRequest}/${id}`;
      let response = await axios.get(`${baseURL}`);

      setData(response.data.data);
    }
    fetchData();
  }, [id]);

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
              required: 'This is a mandatory field',
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
                      pattern: {
                        value: regex.char50,
                        message:
                          'Please enter valid Last Name with max 50 characters',
                      },
                      validationProps: {
                        // required: 'This is a mandatory field'
                      },
                    },
                    {
                      type: 'file',
                      name: 'photo',
                      id: 'photo',
                      title: 'Upload Photograph',
                      accept: 'image/*,.pdf,.doc,.docx',
                      tempFilename: data?.photo?.split('/')[2],
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

                {
                  type: 'text',
                  name: 'driverFathersName',
                  id: 'driverFathersName',
                  title: 'Father Name',
                  pattern: {
                    value: regex.char50,
                    message: 'Please enter valid Name with max 50 characters',
                  },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // },
                },

                {
                  type: 'radio',
                  name: 'gender',
                  id: 'gender',
                  title: 'Gender',
                  options: [
                    {title: 'Male', value: 'Male'},
                    {title: 'Female', value: 'Female'},
                    {title: 'Others', value: 'Others'},
                  ],
                  // pattern: {
                  //   value: regex.maxSize30,
                  //   message: 'Please enter alpha-numeric and below 30 characters'
                  // },
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },
                {
                  type: 'date',
                  name: 'dateofBirth',
                  id: 'dateofBirth',
                  title: 'Date of Birth',
                  // pattern: {
                  //   value: regex.maxSize30,
                  //   message: 'Please enter valid Name with max 50 characters'
                  // },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // },
                },
                {
                  type: 'text',
                  name: 'age',
                  id: 'age',
                  title: 'Age',
                  pattern: {
                    value: regex.numOfYearReg,
                    message:
                      'Please enter valid age with maximum two characters',
                  },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // },
                },
                {
                  type: 'text',
                  name: 'fleetvendor',
                  id: 'fleetvendor',
                  title: 'Fleet Vendor',
                  pattern: {
                    value: regex.numOfYearReg,
                    message: 'Please enter valid Name with max 50 characters',
                  },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // },
                },
                {
                  type: 'text',
                  name: 'driverCode',
                  id: 'driverCode',
                  title: 'Driver Code',
                  pattern: {
                    value: regex.maxSize30,
                    message:
                      'Please enter valid driver code with max 30 characters',
                  },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // },
                },
                {
                  type: 'text',
                  name: 'driverType',
                  id: 'driverType',
                  title: 'Driver Type',
                  pattern: {
                    value: regex.maxSize30,
                    message:
                      'Please enter valid driver type with max 50 characters',
                  },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // },
                },
                {
                  type: 'text',
                  name: 'bloodGroup',
                  id: 'bloodGroup',
                  title: 'Blood Group',
                  pattern: {
                    value: regex.maxSize30,
                    message: 'Please enter valid blood group',
                  },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // },
                },
                {
                  type: 'mappl',
                  name: 'shelteredAddress',
                  id: 'shelteredAddress',
                  title: 'Present Address',
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },

                {
                  type: 'text',
                  name: 'temptown',
                  id: 'temptown',
                  title: 'Town/City(Residence)',
                  pattern: {
                    value: regex.adreesschar50,
                    message:
                      'Please enter valid Town/City with max 50 characters',
                  },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },
                {
                  type: 'text',
                  name: 'tempstate',
                  id: 'tempstate',
                  title: 'State',
                  pattern: {
                    value: regex.adreesschar50,
                    message: 'Please enter valid State with max 50 characters',
                  },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },
                {
                  type: 'text',
                  name: 'temppincode',
                  id: 'temppincode',
                  title: 'Pincode',
                  pattern: {
                    value: regex.pincodeRegex,
                    message: 'Please enter valid Pincode',
                  },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },

                {
                  type: 'mappl',
                  name: 'shelteredAddress',
                  id: 'shelteredAddress',
                  title: 'Permanent Address',
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },

                {
                  type: 'text',
                  name: 'temptown',
                  id: 'temptown',
                  title: 'Town/City(Residence)',
                  pattern: {
                    value: regex.adreesschar50,
                    message:
                      'Please enter valid Town/City with max 50 characters',
                  },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },
                {
                  type: 'text',
                  name: 'tempstate',
                  id: 'tempstate',
                  title: 'State',
                  pattern: {
                    value: regex.adreesschar50,
                    message: 'Please enter valid State with max 50 characters',
                  },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },
                {
                  type: 'text',
                  name: 'temppincode',
                  id: 'temppincode',
                  title: 'Pincode',
                  pattern: {
                    value: regex.pincodeRegex,
                    message: 'Please enter valid Pincode',
                  },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },

                {
                  type: 'text',
                  name: 'addressOnLicense',
                  id: 'addressOnLicense',
                  title: 'Address on License',
                  pattern: {
                    value: regex.addressReg,
                    message:
                      'Please enter valid address on license with 100 character',
                  },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },
                {
                  type: 'text',
                  name: 'emailId',
                  id: 'emailId',
                  title: 'Email Id',
                  pattern: {
                    value: regex.emailReg,
                    message: 'Please enter valid Email Id',
                  },
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
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
                {
                  type: 'text',
                  name: 'mobileNo',
                  id: 'mobileNo',
                  title: 'Mobile No.',
                  pattern: {
                    value: regex.phoneReg,
                    message: 'Please enter valid Mobile number',
                  },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },
                {
                  type: 'text',
                  name: 'alternateNo',
                  id: 'alternateNo',
                  title: 'Alternate Number',
                  pattern: {
                    value: regex.phoneReg,
                    message: 'Please enter valid alternate number',
                  },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },
                {
                  type: 'text',
                  name: 'emergencyContactNo',
                  id: 'emergencyContactNo',
                  title: 'Emergency No.',
                  pattern: {
                    value: regex.phoneReg,
                    message: 'Please enter valid emergency contact number',
                  },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },
                {
                  type: 'text',
                  name: 'vehicleRegNo',
                  id: 'vehicleRegNo',
                  title: 'Vehcile Registration No.',
                  pattern: {
                    value: regex.maxSize30,
                    message:
                      'Please enter valid registration number with max 30 character',
                  },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },

                {
                  type: 'text',
                  name: 'expYears',
                  id: 'expYears',
                  title: 'Year of Experience',
                  pattern: {
                    value: regex.numOfYearReg,
                    message: 'Please enter valid number of year',
                  },
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },
              ],
            },
          ],
        },
      },
      {
        layout: {},
        title: 'Upload Certificates',
        buttons: ['update'],
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
                      type: 'text',
                      name: 'drivingLicenseIssuanceAuthority',
                      id: 'drivingLicenseIssuanceAuthority',
                      title: 'Driving License Issuance Authority',
                      pattern: {
                        value: regex.char50,
                        message:
                          'Please enter valid Driving License Issuance Authority name with max 50 characters',
                      },
                      validationProps: {
                        required: 'This is a mandatory field',
                      },
                    },
                    {
                      type: 'date',
                      name: 'issuancedate',
                      id: 'issuancedate',
                      title: 'Driving License Issuance Date',
                    },
                  ],
                },

                {
                  type: 'section',
                  layout: {
                    column: 3,
                    spacing: 2,
                    size: 'medium',
                    label: 'fixed',
                  },
                  fields: [
                    {
                      type: 'text',
                      name: 'dlNumber',
                      id: 'dlNumber',
                      title: 'Driving License No.',
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
                    },
                    {
                      type: 'file',
                      name: 'dldoc',
                      id: 'dldoc',
                      title: 'Upload Document',
                      accept: 'image/*,.pdf,.doc,.docx',
                      tempFilename: data?.dlcenseDoc,
                      validationProps: data?.dlcenseDoc
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
                      type: 'date',
                      name: 'supplierJoiningDate',
                      id: 'supplierJoiningDate',
                      title: 'Supplier Joining Date',
                      disabled: false,

                      // validationProps: {
                      //   required: 'This is a mandatory field'
                      // },
                    },
                    {
                      type: 'autocomplete',
                      name: 'govtid',
                      id: 'govtid',
                      title: 'Government Id proof',
                      // validationProps: {
                      //   required: 'This is a mandatory field'
                      // },
                      options: [
                        {title: 'Aadhar', value: 'Aadhar'},
                        {title: 'Passport', value: 'Passport'},
                        {title: 'Voter Id Card', value: 'Voter Id Card'},
                        {title: 'Ration Card', value: 'Ration Card'},
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
                      name: 'driverInduction',
                      id: 'driverInduction',
                      title: 'Driver Induction',
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
                      type: 'radio',
                      name: 'iDCardIssued',
                      id: 'iDCardIssued',
                      title: 'ID card',
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
                    column: 3,
                    spacing: 2,
                    size: 'medium',
                    label: 'fixed',
                  },
                  fields: [
                    {
                      type: 'radio',
                      name: 'policeVerStatus',
                      id: 'policeVerStatus',
                      title: 'Police Verification',
                      validationProps: {
                        required: 'This is a mandatory field',
                      },
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
                      pattern: {
                        value: regex.char30,
                        message:
                          'Please enter police verification code with max 30 characters',
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
                      title: 'Upload Document',
                      accept: 'image/*,.pdf,.doc,.docx',
                      tempFilename: data?.policeVerDoc,
                      dynamic: {
                        field: 'policeVerStatus',
                        value: 'Yes',
                      },
                      validationProps: data?.policeVerDoc
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
                      dynamic: {
                        field: 'policeVerStatus',
                        value: 'Yes',
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
                      type: 'date',
                      name: 'verificationdate',
                      id: 'verificationdate',
                      title: 'Police Verification Date',
                      dynamic: {
                        field: 'policeVerStatus',
                        value: 'Yes',
                      },
                    },

                    {
                      type: 'date',
                      name: 'verificationexpirydate',
                      id: 'verificationexpirydate',
                      title: 'Police Verification Expiry Date',
                      dynamic: {
                        field: 'policeVerStatus',
                        value: 'Yes',
                      },
                    },
                  ],
                },

                {
                  type: 'section',
                  layout: {
                    column: 3,
                    spacing: 2,
                    size: 'medium',
                    label: 'fixed',
                  },
                  fields: [
                    {
                      type: 'radio',
                      name: 'internalVerification',
                      id: 'internalVerification',
                      title: 'Internal Verification',
                      options: [
                        {title: 'Yes', value: 'Yes'},
                        {title: 'No', value: 'No'},
                      ],
                    },
                    {
                      type: 'text',
                      name: 'internalVerificationApprover',
                      id: 'internalVerificationApprover',
                      title: 'Internal Verification Approver',
                      pattern: {
                        value: regex.char30,
                        message:
                          'Please enter valid Approver with max 30 characters',
                      },
                      dynamic: {
                        field: 'internalVerification',
                        isNotValue: 'No',
                      },
                    },
                  ],
                },

                {
                  type: 'section',
                  layout: {
                    column: 3,
                    spacing: 2,
                    size: 'medium',
                    label: 'fixed',
                  },
                  fields: [
                    {
                      type: 'date',
                      name: 'lastInternalVerificationDate',
                      id: 'lastInternalVerificationDate',
                      title: 'Last Internal Verification ',
                      dynamic: {
                        field: 'internalVerification',
                        isNotValue: 'No',
                      },
                    },
                    {
                      type: 'date',
                      name: 'internalVerificationExpDate',
                      id: 'internalVerificationExpDate',
                      title: 'Internal Verification Expiry ',
                      dynamic: {
                        field: 'internalVerification',
                        isNotValue: 'No',
                      },
                    },
                  ],
                },

                {
                  type: 'section',
                  layout: {
                    column: 3,
                    spacing: 2,
                    size: 'medium',
                    label: 'fixed',
                  },
                  fields: [
                    {
                      type: 'text',
                      name: 'externalVerificationAgency',
                      id: 'externalVerificationAgency',
                      title: 'External verfication Agency',
                      pattern: {
                        value: regex.char30,
                        message:
                          'Please enter valid external verfication Agency with max 30 characters',
                      },
                    },
                    {
                      type: 'date',
                      name: 'lastExternalVerificationDate',
                      id: 'lastExternalVerificationDate',
                      title: 'Last External Verification',
                    },
                    {
                      type: 'date',
                      name: 'externalVerificationExpDate',
                      id: 'externalVerificationExpDate',
                      title: 'External Verification Expiry',
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
                      name: 'isPanCard',
                      id: 'isPanCard',
                      title: 'Is PAN Card',
                      options: [
                        {title: 'Yes', value: 'YES'},
                        {title: 'No', value: 'NO'},
                      ],
                    },

                    {
                      type: 'file',
                      name: 'identitydoc',
                      id: 'identitydoc',
                      title: 'Upload PAN Card',
                      dynamic: {
                        field: 'isPanCard',
                        value: 'YES',
                      },
                      accept: 'image/*,.pdf,.doc,.docx',
                      tempFilename: data?.identityProofDoc,
                      validationProps: data?.identityProofDoc
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
                      type: 'select',
                      name: 'isVaccinated',
                      id: 'isVaccinated',
                      title: 'Is Vaccinated',
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
                      type: 'file',
                      name: 'vaccinecertificate',
                      id: 'vaccinecertificate',
                      title: 'Upload Document',
                      accept: 'image/*,.pdf,.doc,.docx',
                      dynamic: {
                        field: 'isVaccinated',
                        isNotValue: 'Not Vaccinated',
                      },
                      tempFilename: data?.vaccineCertificateDoc,
                      dynamic: {
                        field: 'isVaccinated',
                        value: 'YES',
                      },
                      validationProps: data?.vaccineCertificateDoc
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
                      name: 'isMobileDeviceInstalled',
                      id: 'isMobileDeviceInstalled',
                      title: 'Is Mobile device installed',
                      options: [
                        {title: 'Yes', value: 'YES'},
                        {title: 'No', value: 'NO'},
                      ],
                    },
                    {
                      type: 'file',
                      name: 'addressdoc',
                      id: 'addressdoc',
                      title: 'Upload Aadhar',
                      accept: 'image/*,.pdf,.doc,.docx',
                      tempFilename: data?.addressProofDoc,
                      validationProps: data?.addressProofDoc
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

                {
                  type: 'section',
                  layout: {
                    column: 3,
                    spacing: 2,
                    size: 'medium',
                    label: 'fixed',
                  },
                  fields: [
                    {
                      type: 'radio',
                      name: 'badge',
                      id: 'badge',
                      title: 'Badge',
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
                      dynamic: {
                        field: 'badge',
                        isNotValue: 'NO',
                      },
                      pattern: {
                        value: regex.char30,
                        message:
                          'Please enter valid badge Number with max 30 characters ',
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
                      dynamic: {
                        field: 'badge',
                        isNotValue: 'NO',
                      },
                    },
                  ],
                },

                {
                  type: 'section',
                  layout: {
                    column: 3,
                    spacing: 2,
                    size: 'medium',
                    label: 'fixed',
                  },
                  fields: [
                    {
                      type: 'radio',
                      name: 'medicalFitness',
                      id: 'medicalFitness',
                      title: 'Medical Fitness',
                      options: [
                        {title: 'Yes', value: 'Yes'},
                        {title: 'No', value: 'No'},
                      ],
                    },
                    {
                      type: 'date',
                      name: 'medicalFitnessDate',
                      id: 'medicalFitnessDate',
                      title: 'Medical Fitness Date',
                      dynamic: {
                        field: 'medicalFitness',
                        isNotValue: 'No',
                      },
                    },

                    {
                      type: 'date',
                      name: 'medicalFitnessExpiryDate',
                      id: 'medicalFitnessExpiryDate',
                      title: 'Medical Fitness Expiry Date',
                      dynamic: {
                        field: 'medicalFitness',
                        isNotValue: 'No',
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
                      name: 'trainingStatus',
                      id: 'trainingStatus',
                      title: 'Training Status',
                      options: [
                        {title: 'External', value: 'External'},
                        {title: 'Internal', value: 'Internal'},
                      ],
                    },
                    {
                      type: 'date',
                      name: 'lastTrainingDate',
                      id: 'lastTrainingDate',
                      title: 'Last Training Date',
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

  // const getFormData = object => Object.keys(object).reduce((formData, key) => {
  //   formData.append(key, object[key]);
  //   return formData;
  // }, new FormData());

  const handleChange = (values) => {
    // let dataSet = {};
    // let allElem = {};
    // Object.keys(values).map((key)=>{
    //
    //   if(typeof values[key]?.name == 'string'){
    //     dataSet = {
    //       ...dataSet,
    //       [key]: values[key]
    //     }
    //   }else{
    //     allElem = {
    //       ...allElem,
    //       [key]: values[key]
    //     }
    //   }
    // })
    // dataSet = {
    //   ...dataSet,
    //   data: allElem
    // }
    //
  };

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
        .post(Api?.driver?.approve, tem)
        .then(function (response) {
          if (response.status == 200) {
            navigate(`/onboardadmin/pending-driver/driver-listing`);
            toast.success('Approved successfully');
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
        .post(Api?.driver?.reject, tem)
        .then(function (response) {
          if (response.status == 200) {
            navigate(`/onboardadmin/pending-driver/driver-listing`);
            toast.success('Rejected successfully');
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

  function myGetData(d) {
    if (d?.mobileNo?.length == 10) {
      axios
        .get(`${Api.baseUri}/userauth/user-account/${d?.mobileNo}/mobile`)
        .then((r) => {
          setMobileCheck(r.data);
          toast.success(r.data);
        })
        .catch((er) => {
          setMobileCheck('something went wrong');
        });
    }
  }

  return (
    <>
      {!showbtn ? <AppLoader /> : null}

      {data && data.id && (
        <>
          <Steppers
            defaultValues={data}
            showbtn={showbtn}
            template={stepperTemplate}
            afterSubmit={handleSubmit}
            icons={{1: <PersonIcon />, 2: <TextSnippetIcon />}}
            setVal={[
              {name: 'tempaddress', value: data?.address?.addressName},
              {name: 'temptown', value: data?.address?.city},
              {name: 'tempstate', value: data?.address?.state},
              {name: 'temppincode', value: data?.address?.pinCode},
            ]}
            getOnInput={myGetData}
          />
          {/* <ActionDialog
            open={openDialog}
            handleConfirm={handleConfirm}
            btnName={btnName}
            handleCloseDialog={handleCloseDialog}
            title={"Confirmation"}
          /> */}

          <Dialog
            // onClose={handleClose}
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
