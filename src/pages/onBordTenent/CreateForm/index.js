/* eslint-disable */
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Steppers from '@smart-form/stepper';
import {useDispatch, useSelector} from 'react-redux';
import {onAddNewTenent} from 'redux/actions';
import regex from '@regex';
import Api from '@api';
import axios from 'axios';
import {toast} from 'react-toastify';
import AppLoader from '@crema/core/AppLoader';
import ControlledOpenSelect from 'pages/muiComponents/inputs/Selects/ControlledOpenSelect';
import SettingsIcon from '@mui/icons-material/Settings';
import DomainIcon from '@mui/icons-material/Domain';
import PersonIcon from '@mui/icons-material/Person';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

// import {setInitialPath} from 'redux/actions';
const CreateForm = ({close}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const boardList = useSelector(({ OnboardTenent }) => OnboardTenent.tenentBoardList);
  const [showbtn, setshowbtn] = React.useState(true);
  const [showTick, setshowTick] = React.useState();
  const [mytempifsc, setMytempifsc] = React.useState();
  const [branchData, setbranchData] = React.useState();
  const [bankNameVal, setbankNameVal] = React.useState();
  const [mobileNo, setMobileNo] = useState();
  const [mobileCheck, setMobileCheck] = useState();
  const [data, setData] = React.useState();
  const [corporateList, setCorporateList] = useState();
  const [mobileExists, setMobileExists] = useState(false);
  const [email, setEmail] = useState();
  const [emailExists, setEmailExists] = useState(false);
  const [companyCodeExists, setCompanyCodeExists] = useState(false);
  const [comp_code, setComp_code] = useState();
  let stepperTemplate = {
    title: 'Super Admin Registration Form',
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
                  infoMessage: [
                    'Alphanumeric characters are allowed.',
                    'Maximum length should be 50 characters.',
                    'e.g.: TSD Pvt. Ltd. etc...',
                  ],
                  disabled: false,
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
                      isProfile: true,
                      id: 'logodoc',
                      title: 'Company Logo',
                      infoMessage: [
                        'Should only accept image files',
                        'File should contain file extension',
                        'Should accept all the image file extension.',
                        'e.g.:Shub.jpeg',
                      ],
                      accept: 'image/*',
                      validationProps: {
                        required: 'This is a mandatory field',
                        size: {
                          value: 5,
                          message: 'File size should not be more than 5 mb.',
                        },
                      },
                    },
                  ],
                },
                {
                  type: 'text',
                  name: 'tempaddress',
                  id: 'tempaddress',
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
                      name: 'companyGSTN',
                      id: 'companyGSTN',
                      title: 'GSTIN No.',
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
                      name: 'companyPAN',
                      id: 'companyPAN',
                      title: 'PAN No.',
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
                  type: 'text',
                  name: 'accountName',
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

  const getFormData = (object) =>
    Object.keys(object).reduce((formData, key) => {
      formData.append(key, object[key]);
      return formData;
    }, new FormData());
  //

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
  async function checkCompanyCode(code) {
    let r = await axios.get(
      `${Api?.baseUri}/user-reg/tenant-reg/${code}/companyCode

      `,
    );
    if (r?.data == 'User Present') return false;
    else return true;
  }
  const handleSubmit = async (values) => {
    //  )
    setshowbtn(false);
    if (values.button.toUpperCase() === 'SUBMIT') {
      let dataSet = {};
      let allElem = {};
      let tem = values?.data;

      (tem.companyAddress = {
        pinCode: values?.data?.temppincode,
        state: values?.data?.tempstate,
        city: values?.data?.temptown,
        addressName:
          values?.data?.tempaddress + '++' + values?.data?.tempaddressAREA,
      }),
        (tem.profileStatus = 'DEFAULT');
      delete tem.tempaccountNumber;
      delete tem.bankNameTemp;
      let arr = [];
      tem.domains?.map((ele) => {
        arr.push(ele?.Domains);
      });
      tem.domains = arr;
      delete tem.Domains;
      if (!tem?.logodoc?.length) delete tem.logodoc;
      if (!tem?.regdoc?.length) delete tem.regdoc;
      if (!tem?.gstndoc?.length) delete tem.gstndoc;
      if (!tem?.pandoc?.length) delete tem.pandoc;

      delete tem.tempaddress;
      delete tem.tempaddressAREA;
      delete tem.temppincode;
      delete tem.tempstate;
      delete tem.temptown;
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
        method: 'post',
        url: Api.onBoardTenant.list,
        data: getFormData(dataSet),
        headers: {'Content-Type': 'multipart/form-data'},
      })
        .then(function (response) {
          if (response?.data?.status == 200) {
            // navigate(`/superadmin/table`);
            toast.success('Details has been successfully submitted.');
            close();
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

  async function myGetData(d) {
    // console.log(d?.companyCode, "d?.companyCode")
    setComp_code(d?.companyCode);
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

    if (d?.companyCode && d?.companyCode && comp_code != d?.companyCode) {
      let temCheck = await checkCompanyCode(d?.companyCode);
      if (!temCheck) {
        setCompanyCodeExists(true);
      } else {
        setCompanyCodeExists(false);
      }
    }

    if (!d?.emailId) {
      setEmailExists(false);
    }

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
  return (
    <>
      {!showbtn ? <AppLoader /> : null}
      <Steppers
        // defaultValues={temp}
        seterrors={[
          {
            name: 'branchName',
            type: 'customized',
            message: 'Please enter valid IFSC.',
            error: branchData?.toUpperCase() == 'NA',
          },
          {
            name: 'bankName',
            type: 'customized',
            message: 'Please enter valid IFSC.',
            error: bankNameVal?.toUpperCase() == 'NA',
          },
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
          {
            name: 'companyCode',
            type: 'customized',
            message: 'company code already exist',
            error: companyCodeExists == true,
          },
        ]}
        template={stepperTemplate}
        // watchFields={['firstname', 'include_portfolio', 'email', 'country']}
        // validate={validate}
        getOnInput={myGetData}
        clearErr={[
          {
            name: 'branchName',
            value: branchData && branchData?.toUpperCase() != 'NA',
          },
          {
            name: 'bankName',
            value: bankNameVal && bankNameVal?.toUpperCase() != 'NA',
          },
          {name: 'accountNumber', value: showTick, rr: bankNameVal},
          {name: 'accountNumber', value: showTick, rr: bankNameVal},
          {name: 'mobileNo', value: mobileNo?.length == 10 && !mobileExists},
          {name: 'emailId', value: !emailExists},
          {name: 'companyCode', value: !companyCodeExists},
        ]}
        setVal={[
          {name: 'branchName', value: branchData},
          {name: 'bankName', value: bankNameVal},
        ]}
        setSuccessIcon={[
          {name: 'accountNumber', value: showTick},
          {
            name: 'mobileNo',
            value: mobileExists == false && mobileNo?.length == 10,
          },
          {name: 'emailId', value: email?.length && emailExists == false},
          {
            name: 'companyCode',
            value: comp_code?.length && companyCodeExists == false,
          },
        ]}
        icons={{
          1: <DomainIcon />,
          2: <PersonIcon />,
          3: <AccountBalanceIcon />,
        }}
        // seterrors={[{ name: "mobileNo", type: "customized", message: "Number already exist", error: !mobileCheck }]}
        showbtn={showbtn}
        afterSubmit={handleSubmit}
        mode='onTouched'
        onChange={handleChange}
      />
    </>
  );
};

export default CreateForm;
