/* eslint-disable */
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Steppers from '@smart-form/stepper';
import SmartForm from '@smart-form';
import {useDispatch, useSelector} from 'react-redux';
import {onAddNewTenent} from 'redux/actions';
import regex from '@regex';
import api from '@api';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import Api from '@api';
import {toast} from 'react-toastify';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import AppLoader from '@crema/core/AppLoader';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {func} from 'prop-types';
import SettingsIcon from '@mui/icons-material/Settings';
import DomainIcon from '@mui/icons-material/Domain';
import PersonIcon from '@mui/icons-material/Person';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
// import {setInitialPath} from 'redux/actions';
const CreateForm = ({id, close}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const { id } = useParams();
  const [data, setData] = useState({});
  const {user} = useAuthUser();

  const [showbtn, setshowbtn] = React.useState(true);
  const [showTick, setshowTick] = React.useState();
  const [mytempifsc, setMytempifsc] = React.useState();
  const [branchData, setbranchData] = React.useState();
  const [bankNameVal, setbankNameVal] = React.useState();
  const [openDialog, setOpenDialog] = useState(false);
  const [btnName, setBtnName] = useState(null);
  const [subVal, setsubVal] = useState({});
  useEffect(() => {
    async function fetchData() {
      const baseURL = `${api.onBoardTenant.changeRequest}/${id}`;
      let response = await axios.get(`${baseURL}`);

      let tempo = response?.data?.data;
      response.data.data.tempaddress =
        response?.data?.data?.companyAddress?.addressName?.split('++')?.[0];
      response.data.data.tempaddressAREA =
        response?.data?.data?.companyAddress?.addressName?.split('++')?.[1];
      // tempo.tempaccountNumber = tempo?.accountNumber
      let temDomains = [];
      response?.data?.data?.domains?.map((e) => {
        temDomains.push({Domains: e});
      });
      tempo.domains = temDomains;

      setData(response.data.data);
    }
    fetchData();
  }, [id]);
  let Dilaogtemplate = {
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
              // required: 'This is a mandatory field',
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
  // let stepperTemplate = {
  //   layout: {
  //     column: 2,
  //     spacing: 2,
  //     size: 'medium',
  //     label: 'fixed',
  //     type: 'grid',
  //   },
  //   title: 'Edit Form',
  //   description: 'Form for applying Job',
  //   // sections: [
  //   // {
  //   // layout: { column: 1, spacing: 2, size: 'small', label: 'fixed' },
  //   id: 'personal_information',
  //   fields: [
  //     {
  //       type: 'text',
  //       name: 'companyName',
  //       id: 'companyName',
  //       title: 'Company Name',
  //       disabled: false,
  //       pattern: {
  //         value: regex.companyreg,
  //         message: 'Please enter valid Company Name with max 50 characters',
  //       },
  //       validationProps: {
  //         required: 'This is a mandatory field',
  //       },
  //     },

  //     {
  //       type: 'section',
  //       layout: {column: 3, spacing: 2, size: 'medium', label: 'fixed'},
  //       sectionName: 'companyCode',
  //       sectiontitle: 'Company code & Logo',
  //       fields: [
  //         {
  //           type: 'text',
  //           name: 'companyCode',
  //           id: 'companyCode',
  //           title: 'Company Code',

  //           pattern: {
  //             value: regex.charwithnum,
  //             message: 'Please enter valid name with max 50 characters',
  //           },
  //           validationProps: {
  //             required: 'This is a mandatory field',
  //           },
  //         },
  //         {
  //           type: 'file',
  //           name: 'logodoc',
  //           id: 'logodoc',
  //           title: 'Company Logo',
  //           tempFilename: data?.companyLogoDoc,
  //           infoMessage: [
  //             'Should only accept image files',
  //             'File should contain file extension',
  //             'e.g.:Shub.jpeg',
  //           ],
  //           accept: 'image/*',
  //           validationProps: data?.companyLogoDoc
  //             ? {
  //                 size: {
  //                   value: 5,
  //                   message: 'File size should not be more than 5 mb.',
  //                 },
  //               }
  //             : {
  //                 required: 'This is a mandatory field',
  //                 size: {
  //                   value: 5,
  //                   message: 'File size should not be more than 5 mb.',
  //                 },
  //               },
  //         },
  //       ],
  //     },
  //     {
  //       type: 'array',
  //       name: 'domains',
  //       id: 'domains',
  //       title: 'Domain',
  //       layout: {
  //         column: 1,
  //         spacing: 2,
  //         size: 'small',
  //         label: 'blank',
  //         type: 'table',
  //       },
  //       columns: ['Domain'],
  //       subFields: [
  //         {
  //           type: 'text',
  //           name: 'Domains',
  //           id: 'Domains',
  //           title: 'Allowed Domains',
  //           infoMessage: [
  //             'Alphanumeric characters are allowed starting with @',
  //             'Maximum length should be 50  characters',
  //             'e.g.: @gmail.com ',
  //           ],
  //           pattern: {
  //             value: regex.domainReg,
  //             message: 'Please enter valid domain',
  //           },
  //           validationProps: {
  //             required: 'This is a mandatory field',
  //           },
  //         },
  //       ],
  //     },
  //     {
  //       type: 'section',
  //       layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
  //       sectionName: 'companyAddress',
  //       sectiontitle: 'Company Address',
  //       fields: [
  //         {
  //           type: 'text',
  //           name: 'tempaddress',
  //           id: 'tempaddress',
  //           title: 'Flat,House,Building,Apartment',
  //           pattern: {
  //             value: regex.addressReg,
  //             message: 'Please enter valid Address with max 100 characters ',
  //           },
  //           // validationProps: {
  //           //   required: 'This is a mandatory field'
  //           // }
  //         },
  //         {
  //           type: 'text',
  //           name: 'tempaddressAREA',
  //           id: 'tempaddressAREA',
  //           title: 'Area, Street, Sector, Village',
  //           infoMessage: [
  //             'Alphanumeric characters are allowed',
  //             'Maximum length should be 250  characters',
  //             'e.g.: Noida Sector 48, UP ',
  //           ],
  //           pattern: {
  //             value: regex.maxSize250,
  //             message:
  //               'Please enter valid building No, street with max 250 characters ',
  //           },
  //           // validationProps: {
  //           //   required: 'This is a mandatory field'
  //           // }
  //         },
  //         {
  //           type: 'text',
  //           name: 'temptown',
  //           id: 'temptown',
  //           title: 'Town/City',
  //           pattern: {
  //             value: regex.adreesschar50,
  //             message: 'Please enter valid Town/City with max 50 characters',
  //           },
  //           // validationProps: {
  //           //   required: 'This is a mandatory field'
  //           // }
  //         },
  //         {
  //           type: 'text',
  //           name: 'tempstate',
  //           id: 'tempstate',
  //           title: 'State ',
  //           pattern: {
  //             value: regex.adreesschar50,
  //             message: 'Please enter valid State with max 50 characters',
  //           },
  //           // validationProps: {
  //           //   required: 'This is a mandatory field'
  //           // }
  //         },
  //         {
  //           type: 'text',
  //           name: 'temppincode',
  //           id: 'temppincode',
  //           title: 'Pincode ',
  //           pattern: {
  //             value: regex.pincodeRegex,
  //             message: 'Please enter valid Pincode',
  //           },
  //           // validationProps: {
  //           //   required: 'This is a mandatory field'
  //           // }
  //         },
  //       ],
  //     },

  //     {
  //       type: 'section',
  //       layout: {column: 3, spacing: 2, size: 'medium', label: 'fixed'},
  //       sectionName: 'companyregistration',
  //       sectiontitle: 'Company Registration',
  //       fields: [
  //         {
  //           type: 'text',
  //           name: 'companyRegNo',
  //           id: 'companyRegNo',
  //           title: 'Registration No.',
  //           isUpper: true,
  //           pattern: {
  //             value: regex.maxSize30,
  //             message:
  //               'Please enter valid Registration No. with max 30 characters',
  //           },
  //           // validationProps: {
  //           //   required: 'This is a mandatory field'
  //           // }
  //         },
  //         {
  //           type: 'file',
  //           name: 'regdoc',
  //           id: 'regdoc',
  //           title: 'Upload Document',
  //           accept: 'image/*,.pdf,.doc,.docx',
  //           tempFilename: data?.companyRegDoc,
  //           validationProps: data?.companyRegDoc
  //             ? {
  //                 size: {
  //                   value: 5,
  //                   message: 'File size should not be more than 5 mb.',
  //                 },
  //               }
  //             : {
  //                 required: 'This is a mandatory field',
  //                 size: {
  //                   value: 5,
  //                   message: 'File size should not be more than 5 mb.',
  //                 },
  //               },
  //         },
  //       ],
  //     },

  //     {
  //       type: 'section',
  //       layout: {column: 3, spacing: 2, size: 'medium', label: 'fixed'},
  //       sectionName: 'companygstn',
  //       sectiontitle: 'Company GSTIN',
  //       fields: [
  //         {
  //           type: 'text',
  //           name: 'companyGSTN',
  //           id: 'companyGSTN',
  //           title: 'GSTIN No.',
  //           isUpper: true,
  //           pattern: {
  //             value: regex.gstReg,
  //             message: 'Please enter valid GSTIN No.',
  //           },
  //           // validationProps: {
  //           //   required: 'This is a mandatory field'
  //           // }
  //         },
  //         {
  //           type: 'file',
  //           name: 'gstndoc',
  //           id: 'gstndoc',
  //           title: 'Upload Document',
  //           accept: 'image/*,.pdf,.doc,.docx',
  //           tempFilename: data?.companyGstnDoc,
  //           validationProps: data?.companyGstnDoc
  //             ? {
  //                 size: {
  //                   value: 5,
  //                   message: 'File size should not be more than 5 mb.',
  //                 },
  //               }
  //             : {
  //                 required: 'This is a mandatory field',
  //                 size: {
  //                   value: 5,
  //                   message: 'File size should not be more than 5 mb.',
  //                 },
  //               },
  //         },
  //       ],
  //     },

  //     {
  //       type: 'section',
  //       layout: {column: 3, spacing: 2, size: 'medium', label: 'fixed'},
  //       sectionName: 'companyPAN',
  //       sectiontitle: 'Company PAN Number',
  //       fields: [
  //         {
  //           type: 'text',
  //           name: 'companyPAN',
  //           id: 'companyPAN',
  //           title: 'PAN No.',
  //           isUpper: true,
  //           pattern: {
  //             value: regex.panReg,
  //             message: 'Please enter valid PAN No.',
  //           },
  //           // validationProps: {
  //           //   required: 'This is a mandatory field'
  //           // }
  //         },
  //         {
  //           type: 'file',
  //           name: 'pandoc',
  //           id: 'pandoc',
  //           title: 'Upload Document',
  //           accept: 'image/*,.pdf,.doc,.docx',
  //           tempFilename: data?.companyPanDoc,

  //           validationProps: data?.companyPanDoc
  //             ? {
  //                 size: {
  //                   value: 5,
  //                   message: 'File size should not be more than 5 mb.',
  //                 },
  //               }
  //             : {
  //                 required: 'This is a mandatory field',
  //                 size: {
  //                   value: 5,
  //                   message: 'File size should not be more than 5 mb.',
  //                 },
  //               },
  //         },
  //       ],
  //     },

  //     {
  //       type: 'section',
  //       layout: {column: 3, spacing: 2, size: 'medium', label: 'fixed'},
  //       sectionName: 'contactPerson',
  //       sectiontitle: 'Contact Person Name',
  //       fields: [
  //         {
  //           type: 'text',
  //           name: 'contactPersonFirstName',
  //           id: 'contactPersonFirstName',
  //           title: ' First Name',
  //           pattern: {
  //             value: regex.char50,
  //             message: 'Please enter valid First Name with max 50 characters',
  //           },
  //           validationProps: {
  //             required: 'This is a mandatory field',
  //           },
  //         },
  //         {
  //           type: 'text',
  //           name: 'contactPersonLastName',
  //           id: 'contactPersonLastName',
  //           title: 'Last Name',
  //           pattern: {
  //             value: regex.char50,
  //             message: 'Please enter valid Last Name with max 50 characters',
  //           },
  //           validationProps: {
  //             // required: 'This is a mandatory field'
  //           },
  //         },
  //       ],
  //     },

  //     {
  //       type: 'text',
  //       name: 'emailId',
  //       id: 'emailId',
  //       title: 'Email Id',
  //       pattern: {
  //         value: regex.emailReg,
  //         message: 'Please enter valid Email Id',
  //       },
  //       validationProps: {
  //         required: 'This is a mandatory field',
  //       },
  //     },
  //     {
  //       type: 'text',
  //       name: 'mobileNo',
  //       id: 'mobileNo',
  //       title: 'Mobile No.',
  //       pattern: {
  //         value: regex.phoneReg,
  //         message: 'Please enter valid Mobile No.',
  //       },
  //       // validationProps: {
  //       //   required: 'This is a mandatory field'
  //       // }
  //     },
  //     {
  //       type: 'text',
  //       name: 'landLineNo',
  //       id: 'landLineNo',
  //       title: 'Landline No.',
  //       pattern: {
  //         value: regex.landlineReg,
  //         message: 'Please enter valid Landline No.',
  //       },
  //       validationProps: {
  //         manual: [
  //           {
  //             condition: `mobileNo != landLineNo`,
  //             message: 'Landline should be different from mobileNo.',
  //           },
  //         ],
  //       },
  //     },

  //     {
  //       type: 'text',
  //       name: 'accountName',
  //       id: 'accountName',
  //       title: 'Account Holder Name',
  //       pattern: {
  //         value: regex.maxSize50,
  //         message:
  //           'Please enter valid Account Holder Name with max 50 characters',
  //       },
  //       validationProps: {
  //         required: 'This is a mandatory field',
  //       },
  //     },

  //     {
  //       type: 'section',
  //       layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
  //       sectionName: 'bankaccount',
  //       sectiontitle: 'Bank Account Number',
  //       fields: [
  //         {
  //           type: 'password',
  //           name: 'tempaccountNumber',
  //           id: 'tempaccountNumber',
  //           title: 'Bank Account No.',
  //           defaultValue: data?.accountNumber,
  //           pattern: {
  //             value: regex.acountNoReg,
  //             message: 'Please enter valid Bank Account No.',
  //           },
  //           validationProps: {
  //             required: 'This is a mandatory field',
  //           },
  //         },

  //         {
  //           type: 'text',
  //           name: 'accountNumber',
  //           id: 'accountNumber',
  //           title: 'Confirm Bank Account No.',
  //           pattern: {
  //             value: regex.acountNoReg,
  //             message: 'Please enter valid Bank Account No.',
  //           },
  //           validationProps: {
  //             manual: [
  //               {
  //                 condition: `tempaccountNumber == accountNumber`,
  //                 message: 'Account number did not match',
  //               },
  //             ],
  //             required: 'This is a mandatory field',
  //           },
  //         },
  //       ],
  //     },
  //     {
  //       type: 'section',
  //       layout: {column: 3, spacing: 2, size: 'medium', label: 'fixed'},
  //       sectionName: 'bankdetail',
  //       sectiontitle: 'Bank Details',
  //       fields: [
  //         {
  //           type: 'text',
  //           name: 'ifscCode',
  //           id: 'ifscCode',
  //           title: 'IFSC Code',
  //           isUpper: true,
  //           pattern: {
  //             value: regex.ifscReg,
  //             message: 'Please enter valid IFSC code',
  //           },
  //           validationProps: {
  //             required: 'This is a mandatory field',
  //           },
  //         },
  //         {
  //           type: 'text',
  //           name: 'bankName',
  //           id: 'bankName',
  //           title: 'Bank Name',
  //           disabled: true,
  //           // validationProps: {
  //           //   required: 'This is a mandatory field'
  //           // }
  //         },
  //         {
  //           type: 'text',
  //           name: 'branchName',
  //           id: 'branchName',
  //           title: 'Branch Name',
  //           disabled: true,
  //         },
  //       ],
  //     },
  //   ],
  // };

  // let stepperTemplate = {
  //   title: 'Super Admin Profile Update',
  //   layout: {
  //     type: 'horizontal',
  //     position: 'center',
  //     labelPos: 'top',
  //     maxWidth: '80%',
  //     margin: '10px 20px',
  //   },
  //   steps: [],
  // };
  // if (data?.changeReqFlag?.split(',')?.includes('personal_information')) {
  //   stepperTemplate.steps.push({
  //     layout: {},
  //     title: 'Super Admin Details',
  //     buttons:
  //       data?.changeReqFlag?.split(',').length == 1
  //         ? ['Approve', 'Reject']
  //         : ['next'],
  //     buttonStyle: {
  //       type: 'square',
  //       text: true,
  //       icon: '',
  //       size: '',
  //       bgColor: '',
  //       textColor: '',
  //       fontSize: '',
  //     },
  //     form: {
  //       layout: {
  //         column: 2,
  //         spacing: 2,
  //         size: 'medium',
  //         label: 'fixed',
  //         type: 'grid',
  //       },
  //       sections: [
  //         {
  //           layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
  //           id: 'personal_information',
  //           fields: [
  //             {
  //               type: 'hidden',
  //               name: 'tenantId',
  //               id: 'tenantId',
  //               defaultValue: user?.userList?.tanentId,
  //             },
  //             {
  //               type: 'text',
  //               name: 'companyName',
  //               id: 'companyName',
  //               title: 'Company Name',
  //               disabled: true,
  //               pattern: {
  //                 value: regex.companyreg,
  //                 message:
  //                   'Please enter valid Company Name with max 50 characters',
  //               },
  //               validationProps: {
  //                 required: 'This is a mandatory field',
  //               },
  //             },
  //             {
  //               type: 'section',
  //               layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
  //               fields: [
  //                 {
  //                   type: 'text',
  //                   name: 'companyCode',
  //                   id: 'companyCode',
  //                   title: 'Company Code',
  //                   disabled: true,
  //                   infoMessage: [
  //                     'Alphanumeric characters are allowed',
  //                     'Maximum length should be 50  characters',
  //                     'e.g.: Noida Sector 48, UP ',
  //                   ],
  //                   pattern: {
  //                     value: regex.onlyChar,
  //                     message: 'Please enter valid name with max 50 characters',
  //                   },
  //                   validationProps: {
  //                     required: 'This is a mandatory field',
  //                   },
  //                 },
  //                 {
  //                   type: 'file',
  //                   name: 'logodoc',
  //                   id: 'logodoc',
  //                   title: 'Company Logo',
  //                   tempFilename: data?.companyLogoDoc,
  //                   disabled: true,
  //                   infoMessage: [
  //                     'Should only accept PDF,JPEG files',
  //                     'File should contain file extension',
  //                     'e.g.:Shub.jpeg',
  //                   ],
  //                   accept: 'image/*,',
  //                   validationProps: data?.companyLogoDoc
  //                     ? {
  //                         size: {
  //                           value: 5,
  //                           message: 'File size should not be more than 5 mb.',
  //                         },
  //                       }
  //                     : {
  //                         required: 'This is a mandatory field',
  //                         size: {
  //                           value: 5,
  //                           message: 'File size should not be more than 5 mb.',
  //                         },
  //                       },
  //                 },
  //               ],
  //             },

  //             {
  //               type: 'text',
  //               name: 'tempaddress',
  //               id: 'tempaddress',
  //               title: 'Flat, House No., Building, Apartment',
  //               disabled: true,
  //               infoMessage: [
  //                 'Alphanumeric characters are allowed',
  //                 'Maximum length should be 50  characters',
  //                 'e.g.: Noida Sector 48, UP ',
  //               ],
  //               pattern: {
  //                 value: regex.addressReg,
  //                 message:
  //                   'Please enter valid building No, street with max 100 characters ',
  //               },
  //               validationProps: {
  //                 required: 'This is a mandatory field',
  //               },
  //             },
  //             {
  //               type: 'text',
  //               name: 'tempaddressAREA',
  //               id: 'tempaddressAREA',
  //               title: 'Area, Street, Sector, Village',
  //               disabled: true,
  //               infoMessage: [
  //                 'Alphanumeric characters are allowed',
  //                 'Maximum length should be 250  characters',
  //                 'e.g.: Noida Sector 48, UP ',
  //               ],
  //               pattern: {
  //                 value: regex.maxSize250,
  //                 message:
  //                   'Please enter valid building No, street with max 250 characters ',
  //               },
  //               validationProps: {
  //                 required: 'This is a mandatory field',
  //               },
  //             },
  //             {
  //               type: 'text',
  //               name: 'temptown',
  //               id: 'temptown',
  //               title: 'Town/City',
  //               disabled: true,
  //               pattern: {
  //                 value: regex.adreesschar50,
  //                 message:
  //                   'Please enter valid Town/City with max 50 characters',
  //               },
  //               // validationProps: {
  //               //   required: 'This is a mandatory field'
  //               // }
  //             },
  //             {
  //               type: 'text',
  //               name: 'tempstate',
  //               id: 'tempstate',
  //               title: 'State ',
  //               disabled: true,
  //               pattern: {
  //                 value: regex.adreesschar50,
  //                 message: 'Please enter valid State with max 50 characters',
  //               },
  //               // validationProps: {
  //               //   required: 'This is a mandatory field'
  //               // }
  //             },
  //             {
  //               type: 'text',
  //               name: 'temppincode',
  //               id: 'temppincode',
  //               title: 'Pincode',
  //               disabled: true,
  //               pattern: {
  //                 value: regex.pincodeRegex,
  //                 message: 'Please enter valid Pincode',
  //               },
  //               // validationProps: {
  //               //   required: 'This is a mandatory field'
  //               // }
  //             },
  //             {
  //               type: 'section',
  //               layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
  //               fields: [
  //                 {
  //                   type: 'text',
  //                   name: 'companyRegNo',
  //                   id: 'companyRegNo',
  //                   title: 'Registration No.',
  //                   disabled: true,
  //                   pattern: {
  //                     value: regex.maxSize30,
  //                     message:
  //                       'Please enter valid Registration No. with max 30 characters',
  //                   },
  //                   // validationProps: {
  //                   //   required: 'This is a mandatory field'
  //                   // }
  //                 },
  //                 {
  //                   type: 'file',
  //                   name: 'regdoc',
  //                   id: 'regdoc',
  //                   title: 'Upload Document',
  //                   accept: 'image/*,.pdf,.doc,.docx',
  //                   disabled: true,
  //                   tempFilename: data?.companyRegDoc,
  //                   // validationProps: {
  //                   //   // required: 'This is a mandatory field',
  //                   //   size: {
  //                   //     value: 5,
  //                   //     message: 'File size should not be more than 5 mb.'
  //                   //   },
  //                   // }
  //                 },
  //               ],
  //             },
  //             {
  //               type: 'section',
  //               layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
  //               fields: [
  //                 {
  //                   type: 'text',
  //                   name: 'companyGSTN',
  //                   id: 'companyGSTN',
  //                   title: 'GSTIN No.',
  //                   disabled: true,
  //                   pattern: {
  //                     value: regex.gstReg,
  //                     message: 'Please enter valid GSTIN No.',
  //                   },
  //                   // validationProps: {
  //                   //   required: 'This is a mandatory field'
  //                   // }
  //                 },
  //                 {
  //                   type: 'file',
  //                   name: 'gstndoc',
  //                   id: 'gstndoc',
  //                   title: 'Upload Document',
  //                   accept: 'image/*,.pdf,.doc,.docx',

  //                   disabled: true,
  //                   tempFilename: data?.companyGstnDoc,
  //                   // validationProps: {
  //                   //   // required: 'This is a mandatory field',
  //                   //   size: {
  //                   //     value: 5,
  //                   //     message: 'File size should not be more than 5 mb.'
  //                   //   },
  //                   // }
  //                 },
  //               ],
  //             },
  //             {
  //               type: 'section',
  //               layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
  //               fields: [
  //                 {
  //                   type: 'text',
  //                   name: 'companyPAN',
  //                   id: 'companyPAN',
  //                   title: 'PAN No.',
  //                   disabled: true,
  //                   pattern: {
  //                     value: regex.panReg,
  //                     message: 'Please enter valid PAN No.',
  //                   },
  //                   // validationProps: {
  //                   //   required: 'This is a mandatory field'
  //                   // }
  //                 },
  //                 {
  //                   type: 'file',
  //                   name: 'pandoc',
  //                   id: 'pandoc',
  //                   title: 'Upload Document',
  //                   accept: 'image/*,.pdf,.doc,.docx',
  //                   disabled: true,
  //                   tempFilename: data?.companyPanDoc,
  //                   // validationProps: {
  //                   //   // required: 'This is a mandatory field',
  //                   //   size: {
  //                   //     value: 5,
  //                   //     message: 'File size should not be more than 5 mb.'
  //                   //   },
  //                   // }
  //                 },
  //               ],
  //             },

  //             {
  //               type: 'array',
  //               name: 'domains',
  //               id: 'domains',
  //               layout: {
  //                 column: 1,
  //                 spacing: 2,
  //                 size: 'small',
  //                 label: 'blank',
  //                 type: 'table',
  //               },
  //               columns: ['Domain'],
  //               subFields: [
  //                 {
  //                   type: 'text',
  //                   name: 'Domains',
  //                   id: 'Domains',
  //                   title: 'Allowed Domains',
  //                   disabled: true,
  //                   infoMessage: [
  //                     'Alphanumeric characters are allowed starting with @',
  //                     'Maximum length should be 50  characters',
  //                     'e.g.: @gmail.com ',
  //                   ],
  //                   pattern: {
  //                     value: regex.domainReg,
  //                     message: 'Please enter valid code with max 50 characters',
  //                   },
  //                   validationProps: {
  //                     required: 'This is a mandatory field',
  //                   },
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   });
  // }
  // if (data?.changeReqFlag?.split(',')?.includes('contact_personal_details')) {
  //   stepperTemplate.steps.push({
  //     layout: {},
  //     title: 'Contact Person Details',
  //     buttons:
  //       data?.changeReqFlag?.split(',').length <= 2
  //         ? ['Approve', 'Reject']
  //         : ['next'],
  //     buttonStyle: {
  //       type: 'square',
  //       text: true,
  //       icon: '',
  //       size: '',
  //       bgColor: '',
  //       textColor: '',
  //       fontSize: '',
  //     },
  //     form: {
  //       id: 'contact_personal_details',
  //       layout: {
  //         column: 2,
  //         spacing: 2,
  //         size: 'medium',
  //         label: 'fixed',
  //         type: 'grid',
  //       },
  //       sections: [
  //         {
  //           layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
  //           fields: [
  //             {
  //               type: 'text',
  //               name: 'contactPersonFirstName',
  //               id: 'contactPersonFirstName',
  //               title: ' First Name',
  //               disabled: true,
  //               pattern: {
  //                 value: regex.char50,
  //                 message:
  //                   'Please enter valid  First Name with max 50 characters',
  //               },
  //               // validationProps: {
  //               //   required: 'This is a mandatory field'
  //               // }
  //             },
  //             {
  //               type: 'text',
  //               name: 'contactPersonLastName',
  //               id: 'contactPersonLastName',
  //               title: 'Last Name',
  //               disabled: true,
  //               pattern: {
  //                 value: regex.char50,
  //                 message:
  //                   'Please enter valid Last Name with max 50 characters',
  //               },
  //               // validationProps: {
  //               //   required: 'This is a mandatory field'
  //               // }
  //             },
  //             {
  //               type: 'text',
  //               name: 'emailId',
  //               id: 'emailId',
  //               title: 'Email Id',
  //               disabled: true,
  //               pattern: {
  //                 value: regex.emailReg,
  //                 message: 'Please enter valid Email Id',
  //               },
  //               // validationProps: {
  //               //   required: 'This is a mandatory field'
  //               // }
  //             },
  //             {
  //               type: 'text',
  //               name: 'mobileNo',
  //               id: 'mobileNo',
  //               title: 'Mobile No.',
  //               disabled: true,
  //               pattern: {
  //                 value: regex.phoneReg,
  //                 message: 'Please enter valid Mobile No.',
  //               },
  //               // validationProps: {
  //               //   required: 'This is a mandatory field'
  //               // }
  //             },
  //             {
  //               type: 'text',
  //               name: 'landLineNo',
  //               id: 'landLineNo',
  //               title: 'Landline No.',
  //               disabled: true,
  //               pattern: {
  //                 value: regex.landlineReg,
  //                 message: 'Please enter valid Landline No.',
  //               },
  //               validationProps: {
  //                 manual: [
  //                   {
  //                     condition: `mobileNo != landLineNo`,
  //                     message: 'Landline should be different from mobileNo.',
  //                   },
  //                 ],
  //               },
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   });
  // }
  // if (data?.changeReqFlag?.split(',')?.includes('bank_details')) {
  //   stepperTemplate.steps.push({
  //     layout: {},
  //     title: 'Bank Details',
  //     buttons: ['Approve', 'Reject'],
  //     buttonStyle: {
  //       type: 'square',
  //       text: true,
  //       icon: '',
  //       size: '',
  //       bgColor: '',
  //       textColor: '',
  //       fontSize: '',
  //     },
  //     form: {
  //       layout: {
  //         column: 2,
  //         spacing: 2,
  //         size: 'medium',
  //         label: 'fixed',
  //         type: 'grid',
  //       },
  //       id: 'bank_details',
  //       sections: [
  //         {
  //           layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
  //           fields: [
  //             {
  //               type: 'text',
  //               name: 'accountName',
  //               id: 'accountName',
  //               title: 'Account Holder Name',
  //               disabled: true,
  //               pattern: {
  //                 value: regex.maxSize50,
  //                 message:
  //                   'Please enter valid Account Holder Name with max 50 characters',
  //               },
  //               validationProps: {
  //                 required: 'This is a mandatory field',
  //               },
  //             },
  //             {
  //               type: 'password',
  //               name: 'tempaccountNumber',
  //               id: 'tempaccountNumber',
  //               title: 'Bank Account No.',
  //               disabled: true,
  //               defaultValue: data?.accountNumber,
  //               pattern: {
  //                 value: regex.acountNoReg,
  //                 message: 'Please enter valid Bank Account No.',
  //               },
  //               validationProps: {
  //                 required: 'This is a mandatory field',
  //               },
  //             },

  //             {
  //               type: 'text',
  //               name: 'accountNumber',
  //               id: 'accountNumber',
  //               disabled: true,
  //               title: 'Confirm Bank Account No.',
  //               pattern: {
  //                 value: regex.acountNoReg,
  //                 message: 'Please enter valid Bank Account No.',
  //               },
  //               // validationProps: {
  //               //   manual: [
  //               //     {
  //               //       condition: `tempaccountNumber == accountNumber`,
  //               //       message: "Account number did not match"
  //               //     }
  //               //   ]
  //               // }
  //             },
  //             {
  //               type: 'text',
  //               name: 'ifscCode',
  //               id: 'ifscCode',
  //               title: 'IFSC Code',
  //               disabled: true,
  //               isUpper: true,
  //               pattern: {
  //                 value: regex.ifscReg,
  //                 message: 'Please enter valid IFSC code',
  //               },
  //               validationProps: {
  //                 required: 'This is a mandatory field',
  //               },
  //             },
  //             {
  //               type: 'text',
  //               name: 'bankName',
  //               id: 'bankName',
  //               title: 'Bank Name',
  //               disabled: true,
  //               disabled: true,
  //               // validationProps: {
  //               //   required: 'This is a mandatory field'
  //               // }
  //             },
  //             {
  //               type: 'text',
  //               name: 'branchName',
  //               id: 'branchName',
  //               title: 'Branch Name',
  //               disabled: true,
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   });
  // }
  // const getFormData = object => Object.keys(object).reduce((formData, key) => {
  //   formData.append(key, object[key]);
  //   return formData;
  // }, new FormData());

  let stepperTemplate = {
    title: 'Super Admin Profile Update',
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
        title: 'Company Details',
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
                  name: 'companyName',
                  id: 'companyName',
                  title: 'Company Name',
                  disabled: true,
                  infoMessage: [
                    'Alphanumeric characters are allowed.',
                    'Maximum length should be 50 characters.',
                    'e.g.: TSD Pvt. Ltd. etc...',
                  ],
                  // disabled: false,
                  pattern: {
                    value: regex.maxSize50,
                    message:
                      'Please enter valid Company Name with max 50 characters',
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
                      name: 'companyCode',
                      id: 'companyCode',
                      title: 'Company Code',
                      disabled: true,
                      infoMessage: [
                        'Alphanumeric characters are allowed',
                        'Maximum length should be 20  characters',
                        'e.g.: ASDF123123 ',
                      ],
                      pattern: {
                        value: regex.charwithnum,
                        message:
                          'Please enter valid name with max 20 characters',
                      },
                      validationProps: {
                        required: 'This is a mandatory field',
                      },
                    },
                    {
                      type: 'file',
                      name: 'logodoc',
                      id: 'logodoc',
                      title: 'Company Logo',
                      tempFilename: data?.companyLogoDoc,
                      infoMessage: [
                        'Should only accept image files',
                        'File should contain file extension',
                        'e.g.:Shub.jpeg',
                      ],
                      accept: 'image/*',
                      validationProps: data?.companyLogoDoc
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
                    },
                  ],
                },
                {
                  type: 'text',
                  name: 'tempaddress',
                  id: 'tempaddress',
                  disabled: true,
                  title: 'Flat, House No., Building, Apartment',
                  infoMessage: [
                    'Alphanumeric characters are allowed',
                    'Maximum length should be 250  characters',
                    'e.g.: Noida Sector 48, UP ',
                  ],
                  pattern: {
                    value: regex.maxSize250,
                    message:
                      'Please enter valid building No, street with max 250 characters ',
                  },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },
                {
                  type: 'text',
                  name: 'tempaddressAREA',
                  id: 'tempaddressAREA',
                  title: 'Area, Street, Sector, Village',
                  disabled: true,
                  infoMessage: [
                    'Alphanumeric characters are allowed',
                    'Maximum length should be 250  characters',
                    'e.g.: Noida Sector 48, UP ',
                  ],
                  pattern: {
                    value: regex.maxSize250,
                    message:
                      'Please enter valid building No, street with max 250 characters ',
                  },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },
                {
                  type: 'text',
                  name: 'temptown',
                  id: 'temptown',
                  title: 'Town/City',
                  disabled: true,
                  infoMessage: [
                    'Alphabets are allowed',
                    'Maximum length should be 50  characters',
                    'e.g.: Noida ',
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
                  name: 'tempstate',
                  id: 'tempstate',
                  title: 'State ',
                  disabled: true,
                  infoMessage: [
                    'Alphabets characters are allowed',
                    'Maximum length should be 50 characters',
                    'e.g.:  UP',
                  ],
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
                  disabled: true,
                  isNumber: true,
                  maxChar: 6,
                  title: 'Pincode ',
                  infoMessage: [
                    'Numeric characters are allowed',
                    'Maximum length should be 6 characters',
                    'e.g.: 201301',
                  ],
                  pattern: {
                    value: regex.pincodeRegex,
                    message: 'Please enter valid Pincode',
                  },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
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
                      name: 'companyRegNo',
                      id: 'companyRegNo',
                      title: 'Registration No.',
                      disabled: true,
                      isUpper: true,
                      infoMessage: [
                        'Alphanumeric characters are allowed',
                        'Maximum length should be 30 characters',
                        'e.g.:LU12345DL2022',
                      ],
                      pattern: {
                        value: regex.maxSize30,
                        message:
                          'Please enter valid Registration No. with max 30 characters',
                      },
                      // validationProps: {
                      //   required: 'This is a mandatory field'
                      // }
                    },
                    {
                      type: 'file',
                      name: 'regdoc',
                      id: 'regdoc',
                      title: 'Upload Document',
                      accept: 'image/*,.pdf,.doc,.docx',
                      tempFilename: data?.companyRegDoc,
                      validationProps: data?.companyRegDoc
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
                      name: 'companyGSTN',
                      id: 'companyGSTN',
                      title: 'GSTIN No.',
                      disabled: true,
                      maxChar: 15,
                      isUpper: true,
                      infoMessage: [
                        'Alphanumeric characters are allowed',
                        'Maximum length should be 15 characters .',
                        'e.g.:07AAGFF2194N1Z1',
                      ],
                      pattern: {
                        value: regex.gstReg,
                        message: 'Please enter valid GSTIN No.',
                      },
                      // validationProps: {
                      //   required: 'This is a mandatory field'
                      // }
                    },
                    {
                      type: 'file',
                      name: 'gstndoc',
                      id: 'gstndoc',
                      title: 'Upload Document',
                      accept: 'image/*,.pdf,.doc,.docx',
                      tempFilename: data?.companyGstnDoc,
                      validationProps: data?.companyGstnDoc
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
                      name: 'companyPAN',
                      id: 'companyPAN',
                      title: 'PAN No.',
                      disabled: true,
                      maxChar: 10,
                      isUpper: true,
                      infoMessage: [
                        'Alphanumeric characters are allowed',
                        'Maximum length should be 10 characters .',
                        'e.g.:BNZPM2501F',
                      ],
                      pattern: {
                        value: regex.panReg,
                        message: 'Please enter valid PAN No',
                      },
                      // validationProps: {
                      //   required: 'This is a mandatory field'
                      // }
                    },
                    {
                      type: 'file',
                      name: 'pandoc',
                      id: 'pandoc',
                      title: 'Upload Document',
                      accept: 'image/*,.pdf,.doc,.docx',
                      tempFilename: data?.companyPanDoc,

                      validationProps: data?.companyPanDoc
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
                    },
                  ],
                },

                {
                  type: 'array',
                  name: 'domains',
                  id: 'domains',
                  layout: {
                    column: 1,
                    spacing: 2,
                    size: 'small',
                    label: 'blank',
                    type: 'table',
                  },
                  columns: ['Domain'],
                  subFields: [
                    {
                      type: 'text',
                      name: 'Domains',
                      id: 'Domains',
                      title: 'Allowed Domains',
                      disabled: true,
                      infoMessage: [
                        'Alphanumeric characters are allowed starting with @',
                        'Maximum length should be 50  characters',
                        'e.g.: @gmail.com ',
                      ],
                      pattern: {
                        value: regex.domainReg,
                        message: 'Please enter valid domain ',
                      },
                      validationProps: {
                        required: 'This is a mandatory field',
                      },
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
        title: 'Contact Person Details',
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
              fields: [
                {
                  type: 'text',
                  name: 'contactPersonFirstName',
                  id: 'contactPersonFirstName',
                  title: 'First Name',
                  disabled: true,
                  infoMessage: [
                    'Only alphabets are allowed.',
                    'Maximum length should be 50 characters.',
                    'Ex-XYZ.',
                  ],
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
                  name: 'contactPersonLastName',
                  id: 'contactPersonLastName',
                  title: 'Last Name',
                  disabled: true,
                  infoMessage: [
                    'Only alphabets are allowed.',
                    'Maximum length should be 50 characters.',
                    'Ex-Sharma.',
                  ],
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
                  type: 'text',
                  name: 'emailId',
                  id: 'emailId',
                  disabled: true,
                  infoMessage: [
                    'Alphanumeric characters are allowed',
                    'Maximum length should be 30 characters & should include @',
                    'Should have domain name',
                    'e.g.: xyz45@gmail.com',
                  ],
                  title: 'Email Id',
                  fixErrorBox: true,
                  pattern: {
                    value: regex.emailReg,
                    message: 'Please enter valid Email Id',
                  },
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },
                {
                  type: 'text',
                  name: 'mobileNo',
                  id: 'mobileNo',
                  isNumber: true,
                  maxChar: 10,
                  disabled: true,
                  title: 'Mobile No.',
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
                  name: 'landLineNo',
                  id: 'landLineNo',
                  disabled: true,
                  title: 'Landline No.',
                  isNumber: true,
                  maxChar: 15,
                  infoMessage: [
                    'Numeric characters are allowed',
                    'Maximum length should be 15 characters',
                    'e.g.: 01125645635',
                  ],
                  pattern: {
                    value: regex.landlineReg,
                    message: 'Please enter valid Landline No.',
                  },
                  validationProps: {
                    manual: [
                      {
                        condition: `mobileNo != landLineNo`,
                        message:
                          'Landline should be different from mobile number.',
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
      },
      {
        layout: {},
        title: 'Bank Details',
        buttons: ['approve', 'reject'],
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
                  type: 'text',
                  name: 'accountName',
                  disabled: true,
                  id: 'accountName',
                  title: 'Account Holder Name',
                  infoMessage: [
                    'Only alphabets are allowed.',
                    'Maximum length should be 50 characters.',
                    'Ex-XYZ Sharma',
                  ],
                  pattern: {
                    value: regex.char50,
                    message:
                      'Please enter valid Account Holder Name with max 50 characters',
                  },
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },
                {
                  type: 'password',
                  name: 'tempaccountNumber',
                  id: 'tempaccountNumber',
                  defaultValue: data?.accountNumber,
                  disabled: true,
                  infoMessage: [
                    'Numeric characters are allowed',
                    'Maximum length should be 18 characters',
                    'e.g.: 37830775163',
                  ],
                  title: 'Bank Account No.',
                  pattern: {
                    value: regex.acountNoReg,
                    message: 'Please enter valid Bank Account No.',
                  },
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },

                {
                  type: 'text',
                  name: 'accountNumber',
                  id: 'accountNumber',
                  isNumber: true,
                  disabled: true,
                  maxChar: 18,
                  title: 'Confirm Bank Account No.',
                  infoMessage: [
                    'Numeric characters are allowed',
                    'Maximum length should be 18 characters',
                    'e.g.: 37830775163',
                  ],
                  pattern: {
                    value: regex.acountNoReg,
                    message: 'Please enter valid Bank Account No.',
                  },
                  validationProps: {
                    manual: [
                      {
                        condition: `tempaccountNumber == accountNumber`,
                        message: 'Account number did not match',
                      },
                    ],
                    required: 'This is a mandatory field',
                  },
                },
                {
                  type: 'text',
                  name: 'ifscCode',
                  id: 'ifscCode',
                  title: 'IFSC Code',
                  disabled: true,
                  maxChar: 11,
                  isUpper: true,
                  infoMessage: [
                    'Alphanumeric characters are allowed',
                    'Maximum length should be 11 characters',
                    'e.g.: SBINOOO1234',
                  ],
                  pattern: {
                    value: regex.ifscReg,
                    message: 'Please enter valid IFSC code',
                  },
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },
                {
                  type: 'text',
                  name: 'bankName',
                  id: 'bankName',
                  title: 'Bank Name',
                  disabled: true,
                  infoMessage: [
                    'Bank name should be autofetched through IFSC code',
                  ],
                  disabled: true,
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },
                {
                  type: 'text',
                  name: 'branchName',
                  id: 'branchName',
                  title: 'Branch Name',
                  disabled: true,
                  infoMessage: [
                    'Branch name should be autofetched through IFSC code',
                  ],
                  disabled: true,
                },
              ],
            },
          ],
        },
      },
    ],
  };

  const handleSubmit = async (values) => {
    // setshowbtn(false);
    if (values.button.toUpperCase() === 'APPROVE') {
      setOpenDialog(true);
      let tem = values?.data;
      let arr = [];
      tem.domains?.map((ele) => {
        arr.push(ele?.Domains);
      });
      tem.domains = arr;
      delete tem.Domains;
      if (tem?.bankNameTemp) delete tem.bankNameTemp;
      if (!tem?.logodoc?.length) delete tem.logodoc;
      if (!tem?.regdoc?.length) delete tem.regdoc;
      if (!tem?.gstndoc?.length) delete tem.gstndoc;
      if (!tem?.pandoc?.length) delete tem.pandoc;

      delete tem.tempaccountNumber;

      setBtnName('APPROVE');
      setshowbtn(true);
      setsubVal(tem);
    }

    if (values.button.toUpperCase() === 'REJECT') {
      setOpenDialog(true);
      let tem = values?.data;
      let arr = [];
      tem.domains?.map((ele) => {
        arr.push(ele?.Domains);
      });
      tem.domains = arr;
      delete tem.Domains;
      if (tem?.bankNameTemp) delete tem.bankNameTemp;
      if (!tem?.logodoc?.length) delete tem.logodoc;
      if (!tem?.regdoc?.length) delete tem.regdoc;
      if (!tem?.gstndoc?.length) delete tem.gstndoc;
      if (!tem?.pandoc?.length) delete tem.pandoc;

      delete tem.tempaccountNumber;
      setBtnName('REJECT');
      setshowbtn(true);
      setsubVal(tem);
    }
  };

  const handleDialogs = (val) => {
    setOpenDialog(true);

    let tem = {};
    tem = subVal;
    tem.remarks = val?.data?.remarks;
    tem.updatedBy = user?.userList?.userRole;
    tem.address = {
      pinCode: subVal?.temppincode,
      state: subVal?.tempstate,
      city: subVal?.temptown,
      addressName: subVal?.tempaddress + '++' + subVal?.tempaddressAREA,
    };

    if (tem.tempaddress) delete tem.tempaddress;
    if (tem.temptown) delete tem.temptown;
    if (tem.tempstate) delete tem.tempstate;
    if (tem.temppincode) delete tem.temppincode;
    if (tem.tempaddressAREA) delete tem.tempaddressAREA;

    if (
      (val.button == 'No' && btnName == 'REJECT') ||
      (val.button == 'No' && btnName == 'APPROVE')
    ) {
      setOpenDialog(false);
    }

    if (val.button == 'Yes' && btnName == 'APPROVE') {
      axios
        .post(Api?.onBoardTenant?.approve, tem)
        .then(function (response) {
          if (response?.data?.status == 200) {
            navigate(`/customer-page`);
            toast.success('Approved successfully');
            close();
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
        .post(Api?.onBoardTenant?.reject, tem)
        .then(function (response) {
          if (response?.data?.status == 200) {
            navigate(`/customer-page`);
            toast.success('Rejected successfully');
            close();
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
  };

  function myGetData(d) {
    if (d?.tempaccountNumber && d?.tempaccountNumber == d?.accountNumber) {
      setshowTick(true);
    } else {
      setshowTick(false);
    }
    if (d?.ifscCode != mytempifsc && d?.ifscCode?.length == 11) {
      var instance = axios.create();
      delete instance?.defaults?.headers?.common['vtt_user_signature'];

      instance
        .get(`https://ifsc.razorpay.com/${d?.ifscCode}`)
        .then((r) => {
          if (r?.data) {
            setMytempifsc(r?.data?.IFSC);
            setbranchData(r?.data?.BRANCH);
            setbankNameVal(r?.data?.BANK);
          } else {
            setMytempifsc(null);
            setbranchData(null);
            setbankNameVal(null);
          }
        })
        .catch((er) => {
          setMytempifsc(null);
          setbranchData('NA');
          setbankNameVal('NA');
        });
    }
    if (d?.ifscCode?.length != 11) {
      setbranchData('');
    }
  }

  const handleClose = () => {
    setOpenDialog(false);
  };
  return (
    <>
      {!showbtn ? <AppLoader /> : null}
      {data && data.id && (
        <Steppers
          defaultValues={data}
          template={stepperTemplate}
          // watchFields={['firstname', 'include_portfolio', 'email', 'country']}
          // validate={validate}
          clearErr={[{name: 'accountNumber', value: showTick, rr: bankNameVal}]}
          getOnInput={myGetData}
          setVal={[
            {name: 'branchName', value: branchData},
            {name: 'bankName', value: bankNameVal},
            {name: 'temptown', value: data?.companyAddress?.city},
            {name: 'tempstate', value: data?.companyAddress?.state},
            {name: 'temppincode', value: data?.companyAddress?.pinCode},
          ]}
          setSuccessIcon={[{name: 'accountNumber', value: showTick}]}
          icons={{
            1: <DomainIcon />,
            2: <PersonIcon />,
            3: <AccountBalanceIcon />,
          }}
          afterSubmit={handleSubmit}
          // buttons={['submit']}
          // onChange={handleChange}
        />
      )}

      <Dialog
        onClose={handleClose}
        open={openDialog}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        PaperProps={{
          sx: {
            width: '500px',
          },
        }}
      >
        <DialogContent>
          <p>Are you sure, you want to confirm?</p>

          <SmartForm
            template={Dilaogtemplate}
            buttons={['Yes', 'No']}
            onSubmit={handleDialogs}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateForm;
