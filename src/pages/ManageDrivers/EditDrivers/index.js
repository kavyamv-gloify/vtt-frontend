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
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import PopEdit from '@editpopup';

const EditForm = ({id, popBTNClick, openDialog}) => {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const {user} = useAuthUser();
  const [address, setAddress] = useState();
  const [vendor, setVendor] = useState();
  const [vendorList, setVendorList] = useState();
  const vendorProfile = user?.userList?.profileId;
  const [agency, setAgencyList] = useState([]);
  const [showbtn, setshowbtn] = React.useState(true);
  const [email, setEmail] = useState();
  const [mobileNo, setMobileNo] = useState();
  const [mobileExists, setMobileExists] = useState(false);
  const [emailExists, setEmailExists] = useState(false);

  useEffect(() => {
    async function fetchVendorData() {
      const baseURL = `${api.vendor.list}/${vendorProfile}`;
      let response = await axios.get(`${baseURL}`);
      setVendor(response.data.data);
    }
    fetchVendorData();
  }, [vendorProfile]);

  async function agencyList() {
    axios
      .get(`${api?.baseUri}/user-reg/internal-reg/getAll`)
      .then((res) => {
        let temp = [];
        res?.data?.data?.map((e) => {
          temp.push({title: e.internalAgencyName, value: e.internalAgencyName});
        });

        setAgencyList(temp);
      })
      .catch((err) => {
        setAgencyList([]);
      });
  }
  useEffect(() => {
    agencyList();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const baseURL = `${api.driver.list}/${id}`;
      let response = await axios.get(`${baseURL}`);
      console.log('response', response);
      let temp = response?.data?.data;
      temp.present_house = temp?.address?.addressName.split('++')?.[0];
      temp.present_area = temp?.address?.addressName.split('++')?.[1];
      temp.present_state = temp?.address?.state;
      temp.present_pinCode = temp?.address?.pinCode;
      temp.present_city = temp?.address?.city;
      temp.state = temp?.address?.addressName.split('++')?.[1];
      temp.shelter_house = temp?.shelterAddress?.addressName.split('++')?.[0];
      temp.shelter_area = temp?.shelterAddress?.addressName.split('++')?.[1];
      temp.shelter_state = temp?.shelterAddress?.state;
      temp.shelter_pinCode = temp?.shelterAddress?.pinCode;
      temp.shelter_city = temp?.shelterAddress?.city;
      console.log('temp', temp);
      setData(response?.data?.data);
    }
    fetchData();
  }, [id]);

  const getVendorList = () => {
    axios
      .get(api.baseUri + '/user-reg/associatevendor/getallassociatecorporateId')
      .then((re) => {
        let temArr = [];
        re?.data?.data?.length &&
          re?.data?.data?.map((el) => {
            // + ' (' + el?.vendor?.vendorCode + ')'
            if (el?.vendor)
              temArr.push({
                value: el?.vendor?.id,
                title: el?.vendor?.vendorName,
                createdOn: el?.vendor?.createdOn,
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

  useEffect(() => {
    if (data?.address?.length) {
      let officeAddress = data?.address;
      let addressArray = officeAddress.split(',');

      setAddress(addressArray);
    }
  }, [data]);

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
                // {
                //   type: 'hidden',
                //   name: 'tanentName',
                //   id: 'tanentName',
                //   defaultValue: user?.userList?.tanentName
                // },

                {
                  type: 'section',
                  layout: {
                    column: 2,
                    spacing: 2,
                    size: 'medium',
                    label: 'fixed',
                  },
                  sectionName: 'personalname',
                  sectiontitle: 'Name & Photo',
                  fields: [
                    {
                      type: 'text',
                      name: 'firstName',
                      id: 'firstName',
                      title: 'First Name',
                      disabled: false,
                      pattern: {
                        value: regex.char50,
                        message:
                          'Please enter valid First Name with max 50 characters',
                      },
                      validationProps: {
                        required: 'This is a mandatory field',
                      },
                    },
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
                  // disabled: true,
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
                  name: 'mobileNo',
                  id: 'mobileNo',
                  title: 'Mobile No.',
                  isNumber: true,
                  maxChar: 10,
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
                  pattern: {
                    value: regex.emailReg,
                    message: 'Please enter valid Email Id',
                  },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },
                {
                  type: 'text',
                  name: 'vendorName',
                  id: 'vendorName',
                  title: 'Vendor',
                  // options: vendorList ?? [],
                  disabled: true,
                  // pattern: {
                  //   value: regex.maxSize30,
                  //   message: 'Please enter valid Fleet Vendor with max 30 characters'
                  // },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // },
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
                  maxChar: 10,
                  isNumber: true,
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },
                {
                  type: 'section',
                  sectiontitle: 'Driving License',
                  sectionName: 'drivingLic',
                  layout: {
                    column: 2,
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
                      isUpper: true,
                      pattern: {
                        value: regex.drivingLicReg,
                        message: 'Please enter valid Driving License No',
                      },
                      // disabled: true,
                      // pat: {
                      //   value: regex.drivingLicReg,
                      //   message: 'checking',
                      // },
                      validationProps: {
                        required: 'This is a mandatory field',
                      },
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
                  type: 'date',
                  name: 'tedlValidity',
                  id: 'tedlValidity',
                  title: 'Driving License Validity',
                  disabled: false,
                  defaultValue: data?.dlValidity,
                  min: 'today',
                  pattern: {
                    value: regex.dateReg,
                    message: 'Please enter valid format DD/MM/YYYY',
                  },

                  validationProps: {
                    required: 'This is a mandatory field',

                    manual: [
                      {
                        condition: `tedlValidity >= today`,
                        message:
                          "Driving License Validity should be greater than or equal to today's date.",
                      },
                    ],
                  },
                },
                // {
                //   type: 'mappl',
                //   name: 'shelterAddress',
                //   id: 'shelterAddress',
                //   title: 'Permanent Address',
                //   validationProps: {
                //     required: 'This is a mandatory field'
                //   },

                // },

                {
                  type: 'section',
                  layout: {
                    column: 2,
                    spacing: 2,
                    size: 'medium',
                    label: 'fixed',
                  },
                  sectionName: 'presentaddress',
                  sectiontitle: 'Present Address',
                  fields: [
                    {
                      type: 'text',
                      name: 'present_house',
                      id: 'present_house',
                      title: 'Flat, House No., Building, Company, Apartment',
                      defaultValue: data?.present_house,
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
                    },
                    {
                      type: 'text',
                      name: 'present_area',
                      id: 'present_area',
                      title: 'Area, Street, Sector, Village',
                      defaultValue: data?.present_area,
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
                      name: 'present_city',
                      id: 'present_city',
                      title: 'Town/City(Residence)',
                      defaultValue: data?.present_city,
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
                      // validationProps: {
                      //   required: 'This is a mandatory field'
                      // }
                    },
                    {
                      type: 'text',
                      name: 'present_state',
                      id: 'present_state',
                      title: 'State',
                      defaultValue: data?.present_state,
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
                      // validationProps: {
                      //   required: 'This is a mandatory field'
                      // }
                    },
                    {
                      type: 'text',
                      name: 'present_pinCode',
                      id: 'present_pinCode',
                      title: 'Pincode',
                      defaultValue: data?.present_pinCode,
                      infoMessage: [
                        'Numeric characters are allowed',
                        'Maximum length should be 6 characters',
                        'Ex: 201301',
                      ],

                      pattern: {
                        value: regex.pincodeRegex,
                        message: 'Please enter valid Pincode',
                      },
                      // validationProps: {
                      //   required: 'This is a mandatory field'
                      // }
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
                  sectionName: 'permanentaddress',
                  sectiontitle: 'Permanent Address',
                  fields: [
                    {
                      type: 'text',
                      name: 'permanent_address',
                      id: 'permanent_address',
                      title: 'Flat, House No., Building, Company, Apartment',
                      defaultValue: data?.shelter_house,
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
                    },
                    {
                      type: 'text',
                      name: 'permanent_tempaddressAREA',
                      id: 'permanent_tempaddressAREA',
                      title: 'Area, Street, Sector, Village',
                      defaultValue: data?.shelter_area,
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
                    },
                    {
                      type: 'text',
                      name: 'permanent_town',
                      id: 'permanent_town',
                      title: 'Town/City(Residence)',
                      defaultValue: data?.shelter_city,
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
                      // validationProps: {
                      //   required: 'This is a mandatory field'
                      // }
                    },
                    {
                      type: 'text',
                      name: 'permanent_state',
                      id: 'permanent_state',
                      defaultValue: data?.shelter_state,
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
                      // validationProps: {
                      //   required: 'This is a mandatory field'
                      // }
                    },
                    {
                      type: 'text',
                      name: 'permanent_pincode',
                      id: 'permanent_pincode',
                      title: 'Pincode',
                      defaultValue: data?.shelter_pinCode,
                      infoMessage: [
                        'Alphanumeric characters are allowed',
                        'Maximum length should be 50 characters',
                        'Ex:  UP',
                      ],
                      pattern: {
                        value: regex.pincodeRegex,
                        message: 'Please enter valid Pincode',
                      },
                      // validationProps: {
                      //   required: 'This is a mandatory field'
                      // }
                    },
                  ],
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
                    column: 3,
                    spacing: 2,
                    size: 'medium',
                    label: 'fixed',
                  },
                  sectiontitle: 'ID card',
                  sectionName: 'panDetails',
                  fields: [
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
                      // disabled: true,
                      // validationProps: {
                      //   required: 'This is a mandatory field'
                      // },
                      dynamic: {
                        field: 'iDCardIssued',
                        value: 'Yes',
                      },
                      options: [
                        {title: 'Aadhar Card', value: 'Aadhar Card'},
                        {title: 'PAN Card', value: 'PAN Card'},
                        {title: 'Passport', value: 'Passport'},
                        {title: 'Driving License', value: 'Driving License'},
                        {title: 'Voter Id Card', value: 'Voter Id Card'},
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
                      tempFilename: data?.govtIdProofDoc,
                      validationProps: data?.govtIdProofDoc
                        ? {
                            required: 'This is a mandatory field',
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
                      accept: 'image/*,.pdf,.doc,.docx',
                    },
                  ],
                },

                // {
                //   type: 'radio',
                //   name: 'driverInduction',
                //   id: 'driverInduction',
                //   title: "Driver Induction",
                //   disabled: false,
                //   options: [
                //     { title: 'Yes', value: 'Yes' },
                //     { title: 'No', value: 'No' }
                //   ]

                //   // validationProps: {
                //   //   required: 'This is a mandatory field'
                //   // },

                // },

                {
                  type: 'section',
                  sectiontitle: 'Driver Induction',
                  sectionName: 'driverInductions',
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
                  ],
                },

                {
                  type: 'section',
                  sectiontitle: 'Police Verification',
                  sectionName: 'policeverification',
                  layout: {
                    column: 2,
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
                        // required: 'This is a mandatory field'
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
                      // disabled: true,
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
                      title: 'Upload Document',
                      accept: 'image/*,.pdf,.doc,.docx',
                      tempFilename: data?.policeVerDoc,
                      dynamic: {
                        field: 'policeVerStatus',
                        value: 'Yes',
                      },
                      validationProps: data?.policeVerDoc
                        ? {
                            required: 'This is a mandatory field',
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
                      // validationProps: {
                      //   required: 'This is a mandatory field'
                      // },
                      validationProps: {
                        required: 'This is a mandatory field',
                        // validate: [
                        //   {
                        //     condition: "policeverificationexpirydate >= policeverificationdate",
                        //     message: "From date should be less than or equal to till date."
                        //   }
                        // ],
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
                  ],
                },

                {
                  type: 'section',
                  sectiontitle: 'Vaccination Details',
                  sectionName: 'vaccination',
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
                  ],
                },

                {
                  type: 'section',
                  sectiontitle: 'Badge Details',
                  sectionName: 'badgeDetail',
                  layout: {
                    column: 2,
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
                      name: 'badgeNo',
                      id: 'badgeNo',
                      title: 'Badge Number',
                      dynamic: {
                        field: 'badge',
                        isNotValue: 'No',
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
                        isNotValue: 'No',
                      },
                    },
                  ],
                },

                {
                  type: 'section',
                  sectiontitle: 'Medical Fitness',
                  sectionName: 'medicalFitnessSection',
                  layout: {
                    column: 2,
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
                      validationProps: {
                        // required: 'This is a mandatory field'
                      },
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
                      name: 'medicalcertificate',
                      id: 'medicalcertificate',
                      title: 'Upload Medical Certificate',
                      // disabled: true,
                      infoMessage: [
                        'Should only accept PDF,JPEG files',
                        'File should contain file extension',
                        'e.g.:Shub.jpeg',
                      ],
                      tempFilename: data?.medicalCertificateDoc?.split('/')[2],
                      infoMessage: [
                        'Should only accept PDF,JPEG files',
                        'File should contain file extension',
                        'e.g.:Shub.jpeg',
                      ],
                      accept: 'image/*,.pdf,.doc,.docx',
                      validationProps: data?.medicalCertificateDoc
                        ? {
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
                        field: 'medicalFitness',
                        isNotValue: 'No',
                      },
                    },
                  ],
                },
                {
                  type: 'section',
                  sectiontitle: 'Driver Training ',
                  sectionName: 'driverTrainingSection',
                  layout: {
                    column: 2,
                    spacing: 2,
                    size: 'medium',
                    label: 'fixed',
                  },
                  fields: [
                    {
                      type: 'radio',
                      name: 'trainingStatus',
                      id: 'trainingStatus',
                      title: 'Driver Training',
                      infoMessage: [
                        'Radio button is selectable',
                        'Ex: External',
                      ],
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
                      dynamic: {
                        field: 'trainingStatus',
                        isNotValue: 'No',
                      },
                      infoMessage: [
                        'Date is selectable from calendar',
                        'Date can be entered in DD-MM-YY Format',
                        'Ex: 07-04-2021',
                      ],
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

  const handleSubmit = (values) => {
    if (values?.close) {
      popBTNClick(false);
      return;
    }
    setshowbtn(false);

    if (values.button.toUpperCase() === 'UPDATE') {
      let dataSet = {};
      let allElem = {};
      let tem = values?.data;
      console.log('values', values);
      tem.address = {
        addressName:
          values?.data?.present_house + '++' + values?.data?.present_area,
        city: values?.data?.present_city,
        state: values?.data?.present_state,
        pinCode: values?.data?.present_pinCode,
      };
      tem.shelterAddress = {
        addressName:
          values?.data?.shelter_house + '++' + values?.data?.shelter_area,
        city: values?.data?.shelter_city,
        state: values?.data?.shelter_state,
        pinCode: values?.data?.shelter_pinCode,
      };

      // if (user?.role == 'CORPORATEADMIN') {
      //   vendorList?.map((e) => {
      //     if (e?.value == tem?.vendorId) {
      //       tem.vendorName = e?.name;
      //       tem.vendorCode = e?.code;
      //     }
      //   });
      // }
      // if (user?.role == 'VENDOR') {
      //   tem.vendorId = user?.userList?.profileId;
      //   tem.vendorName = user?.userList?.userName;
      //   tem.vendorCode = user?.userList?.corporateCode;
      // }

      tem.profileStatus = 'ACTIVE';
      tem.dlValidity = tem.tedlValidity;
      delete tem.tedlValidity;

      if (tem?.tempshelteredAddress) delete tem?.tempshelteredAddress;
      if (!tem?.photo?.length) delete tem?.photo;
      if (!tem?.dldoc?.length) delete tem?.dldoc;
      if (!tem?.addressdoc?.length) delete tem?.addressdoc;
      if (!tem?.policedoc?.length) delete tem?.policedoc;
      if (!tem?.identitydoc?.length) delete tem?.identitydoc;
      if (!tem?.vaccinecertificate?.length) delete tem?.vaccinecertificate;

      delete tem.present_house;
      delete tem.present_area;
      delete tem.present_city;
      delete tem.present_state;
      delete tem.present_pincode;

      delete tem.shelter_house;
      delete tem.shelter_area;
      delete tem.shelter_city;
      delete tem.shelter_state;
      delete tem.shelter_pincode;
      console.log('tem', tem);
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
        method: 'put',
        url: api.driver.list,
        data: getFormData(dataSet),
        headers: {'Content-Type': 'multipart/form-data'},
      })
        .then(function (response) {
          if (response?.data?.status == 200) {
            toast.success(
              `${
                response?.data?.data?.firstName + response?.data?.data?.lastName
              }'s details updated successfully.`,
            );
            popBTNClick(false);
          } else {
            toast.error('Something went wrong');
          }
          setshowbtn(true);
        })
        .catch(function (err) {
          setshowbtn(true);
          toast.error('Something went wrong');
        });
    }
  };

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

  async function getOnInput(d) {
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
  return (
    <>
      {data && data?.id && vendorList && (
        <>
          <PopEdit
            title={data?.firstName + ' ' + data?.lastName}
            defaultValues={data}
            template={stepperTemplate}
            openDialog={openDialog}
            // setVal={[{ name: "tempaddress", value: data?.address?.addressName }, { name: "temptown", value: data?.address?.city }, { name: "tempstate", value: data?.address?.state }, { name: "temppincode", value: data?.address?.pinCode }]}
            getOnInput={getOnInput}
            popAction={handleSubmit}
            icons={{1: <PersonIcon />, 2: <TextSnippetIcon />}}
            oldFormType={'STEPPER'}
            setSuccessIcon={[
              {
                name: 'mobileNo',
                value:
                  (mobileExists == false && mobileNo?.length == 10) ||
                  mobileNo == data?.mobileNo,
              },
              {
                name: 'emailId',
                value:
                  (email?.length && emailExists == false) ||
                  email == data?.emailId,
              },
            ]}
            clearErr={[
              {
                name: 'mobileNo',
                value:
                  mobileNo == data.mobileNo ||
                  (mobileNo?.length == 10 && !mobileExists),
              },
              {name: 'emailId', value: !emailExists || email == data?.emailId},
            ]}
            seterrors={[
              {
                name: 'mobileNo',
                type: 'customized',
                message: 'Number already exist',
                error:
                  mobileNo != data.mobileNo &&
                  mobileNo?.length == 10 &&
                  mobileExists == true,
              },
              {
                name: 'emailId',
                type: 'customized',
                message: 'Email already exist',
                error: email != data?.emailId && emailExists == true,
              },
            ]}
          />
        </>
      )}
    </>
  );
};

export default EditForm;
