import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuthUser} from '@crema/utility/AuthHooks';
import regex from '@regex';
import axios from 'axios';
import api from '@api';
import AppLoader from '@crema/core/AppLoader';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import {toast} from 'react-toastify';
import Api from '@api';
import SmartForm from '@smart-form';
import Steppers from '@smart-form/stepper';
import PersonIcon from '@mui/icons-material/Person';
import RouteIcon from '@mui/icons-material/Route';
import {Dialog, DialogContent, DialogTitle} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
const EmployeeProfileForm = () => {
  const navigate = useNavigate();
  const {user} = useAuthUser();
  const [showbtn, setshowbtn] = React.useState(true);
  const [data, setData] = useState();
  const [deptList, setdeptList] = useState();
  const [shiftList, setshiftList] = useState();
  const [special, setSpecial] = useState([]);
  const [ofcList, setOfcList] = React.useState();
  const [nodalPointList, setNodalPointList] = React.useState();
  const [nodalPointData, setNodalPointdata] = React.useState([]);
  const [employeeCategory, setEmployeCategory] = useState();
  const [businessUnit, setBusinessUnit] = useState();
  const [businessUnitId, setBusinessUnitId] = useState();
  const [designation, setDesignation] = useState();
  const [managerData, setManagerData] = React.useState();
  const [managerEmail, setManagerEmail] = useState();
  const [verifyType, setVerifyType] = useState('');
  const [verifyData, setVerifyData] = useState('');
  const [lastverifiedData, setLastVerifiedData] = useState({
    mob: '',
    email: '',
  });
  const [myOtp, setmyOtp] = useState();
  const [myFormData, setmyFormData] = useState({});
  const [otpLoader, setOtpLoader] = useState(false);
  const [domain, setDomain] = useState();
  const [mobileNo, setMobileNo] = useState();
  const [otpPopBtn, setotpPopBtn] = useState(true);
  const [mobileExists, setMobileExists] = useState(false);
  const [email, setEmail] = useState();
  const [emailExists, setEmailExists] = useState(false);
  const [errors, setErrors] = useState();

  const CorpId =
    user?.role == 'CORPORATEADMIN'
      ? user?.userList?.profileId
      : user?.userList?.corporateId;
  useEffect(() => {
    fetchSiteOffice();
    getspecial();
    fetchData();
  }, []);
  useEffect(() => {
    if (user?.userList?.userStatus && user?.userList?.userStatus != 'DEFAULT') {
      navigate('/dashboard');
    }
    fetchData();
  }, [user.userList.profileId]);

  useEffect(() => {
    let url = Api?.baseUri + '/user-reg/nodal-point/getall';
    axios
      .get(url)
      .then((response) => {
        if (response?.data?.status == '200') {
          setNodalPointdata(response?.data?.data);
          let tempval = [];
          response?.data?.data?.map((e) => {
            tempval.push({
              title:
                e?.geoPoint?.locName +
                '   ( Stop Name: ' +
                (e?.nodalStopName || 'NA') +
                ')',
              value: e.id,
            });
          });
          setNodalPointList(tempval);
        }
      })
      .catch((err) => {
        setNodalPointList([]);
      });
  }, [user?.userList?.tanentId]);

  useEffect(() => {
    if (!user?.userList?.corporateId) return;
    axios
      .get(`${api.onBoardCorporate.list}/${user?.userList?.corporateId}`)
      .then((res) => {
        setDomain(res?.data?.data?.domains ?? []);
      })
      .catch((err) => {
        setDomain([]);
      });
  }, [user?.userList?.corporateId]);

  async function fetchData() {
    const baseURL = `${api.employee.list}/${user.userList.profileId}`;
    axios
      .get(`${baseURL}`)
      .then((response) => {
        let temRes = response?.data?.data;
        temRes['tempaddress'] = temRes?.residenceAddress?.addressName;
        temRes['temptown'] = temRes?.residenceAddress?.city;
        temRes['tempstate'] = temRes?.residenceAddress?.state;
        temRes['temppincode'] = temRes?.residenceAddress?.pinCode;
        temRes['temp_businessUnitId'] = temRes?.businessUnitId;
        temRes['templocality'] = temRes?.pickupLocation?.locality;
        temRes['temp_departmentId'] = temRes?.departmentId;
        temRes['pickupDropNodalPoint'];
        setManagerData({
          id: temRes?.managerId,
          employeeFullName: temRes?.managerName,
          department: temRes?.department,
          departmentId: temRes?.departmentId,
          businessUnit: temRes?.businessUnit,
          businessUnitId: temRes?.businessUnitId,
        });
        let temTypOf = localStorage.getItem('loginWith');
        setLastVerifiedData({
          mob: isNaN(Number(temTypOf)) ? '' : temTypOf,
          email: isNaN(Number(temTypOf)) ? temTypOf : '',
        });
        // setLastVerifiedData({ mob: temRes?.mobileNo, email: temRes?.emailId })
        getDesignation(temRes?.businessUnitId, temRes);
        getShiftList(temRes?.departmentId);
      })
      .catch((err) => {});
  }

  useEffect(() => {
    axios
      .get(`${api.employee.list}/${data?.managerId}`)
      .then((r) => {
        setManagerEmail(r?.data?.data?.emailId);
      })
      .catch(() => {
        setManagerEmail('');
      });
  }, [data?.managerId]);

  useEffect(() => {
    getDeptList();
  }, []);

  async function getDeptList() {
    await axios
      .get(`${api?.dropdown?.department}`)
      .then((res) => {
        let temp = [];
        if (res?.data?.data?.length) {
          res?.data?.data?.map((e) => {
            temp.push({
              title: e.departmentName,
              value: e.id,
              name: e.departmentName,
            });
          });
        }
        setdeptList(temp);
      })
      .catch((er) => {
        setdeptList([]);
      });
  }

  useEffect(() => {
    async function getEmployeeCategory() {
      axios
        .get(`${api?.employeeCategory?.employeeCategoryList}`)
        .then((res) => {
          let temp = [];
          if (res?.data?.data?.length) {
            res?.data?.data?.map((e) => {
              temp.push({
                title: e.categoryType,
                value: e.id,
                name: e.categoryType,
              });
            });
          }
          setEmployeCategory(temp);
        })
        .catch((er) => {
          setEmployeCategory([]);
        });
    }
    getEmployeeCategory();
  }, []);

  async function getspecial() {
    let res = await axios.get(api.specialEmployee.getall);
    let temp = [];
    if (res?.data?.data?.length) {
      res?.data?.data?.map((e) => {
        temp.push({title: e.categoryName, value: e.id, name: e.categoryName});
      });
    }
    setSpecial(temp);
  }

  useEffect(() => {
    function getBusinessUnit() {
      axios
        .get(`${api.businessUnit.list}`)
        .then((res) => {
          let temp = [];
          res?.data?.data?.map((e) => {
            temp.push({title: e.name, value: e.id, name: e.name});
          });
          setBusinessUnit(temp);
        })
        .catch((err) => {
          setBusinessUnit([]);
        });
    }
    getBusinessUnit();
  }, []);

  async function getDesignation(buId, temRes) {
    let temp = [];
    setDesignation([]);
    axios
      .get(`${Api.businessUnit.getbyId}/${buId}`)
      .then((res) => {
        res?.data?.data?.designationList?.map((e) => {
          temp.push({
            title: e.designationName,
            value: e.id,
            name: e.designationName,
          });
          setDesignation(temp ?? []);
          if (temRes) setData(temRes);
        });
        if (temRes && !res?.data?.data?.designationList) {
          setData(temRes);
        }
      })
      .catch((er) => {
        if (temRes) {
          setData(temRes);
        }
        setDesignation([]);
      });
  }

  useEffect(() => {
    if (businessUnitId) getDesignation(businessUnitId);
    else {
      setDesignation([]);
    }
  }, [businessUnitId]);

  useEffect(() => {
    if (businessUnitId) getDesignation(businessUnitId);
    else {
      setDesignation([]);
    }
  }, [businessUnitId]);

  async function fetchSiteOffice() {
    axios
      .get(`${api.siteOffice.list}/corporate?page=0&size=1000&officeName=null`)
      .then((res) => {
        let temp = [];
        if (res?.data?.data?.body?.['SiteOffice List'].length) {
          res?.data?.data?.body?.['SiteOffice List']?.map((e) => {
            temp.push({title: e.officeName, value: e?.id});
          });
        }
        setOfcList(temp ?? []);
      })
      .catch((err) => {
        setOfcList([]);
      });
  }

  async function getShiftList(deptname) {
    const baseURL = `${Api.manageshifts.list}/${CorpId}/corporateid/${deptname}/departmentid`;
    // api.dropdown.shiftmanagement
    axios
      .get(`${baseURL}`)
      .then((response) => {
        let temp = [];
        response?.data?.data?.map((e) => {
          temp.push({
            title: e.shiftName + '(' + e.shiftStart + '-' + e.shiftEnd + ')',
            value: e.id,
            name: e.shiftName,
          });
        });
        setshiftList(temp);
      })
      .catch((er) => {
        setshiftList([]);
      });
  }

  function verifyOTP(val) {
    setshowbtn(false);
    if (val?.data?.enterOTP == myOtp) {
      setTimeout(() => {
        setshowbtn(true);
      }, 2000);
      toast.success('Your profile has been verified successfully');
      // toast.success(
      //   (verifyType == 'MOB' ? 'Mobile Number' : 'Email Id') +
      //     ' verified successfully.',
      // );
      setLastVerifiedData({
        mob: verifyType == 'MOB' ? val?.data?.enterEmail : lastverifiedData.mob,
        email:
          verifyType == 'MOB' ? lastverifiedData.email : val?.data?.enterEmail,
      });
    } else {
      setTimeout(() => {
        setshowbtn(true);
      }, 2000);
      toast.error('OTP did not match.');
      return;
    }
    setVerifyType('');
    setVerifyData('');
    setmyOtp('');
  }

  let template = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    // title: 'Bank Type',
    description: 'Form for verifying OTP',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'text',
            name: 'enterEmail',
            id: 'enterEmail',
            title: verifyType == 'MOB' ? 'Mobile Number' : 'Email Id',
            disabled: true,
          },
          {
            type: 'multiInput',
            name: 'enterOTP',
            id: 'enterOTP',
            blocks: 6,
            title: 'Enter OTP',
            maxChar: 6,
            isNumber: true,
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
        ],
      },
    ],
  };

  let stepperTemplate = {
    title: 'Profile Verification',
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
        title: 'Employee Personal Details',
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
            column: 1,
            spacing: 2,
            size: 'medium',
            label: 'fixed',
            type: 'grid',
          },
          // title: "Employee Registration Form",
          // layout: { type: 'horizontal', position: 'center', labelPos: 'top', maxWidth: '80%', margin: '10px 20px' },
          sections: [
            {
              type: 'section',
              layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
              fields: [
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
                        'Ex-XYZ.',
                      ],
                      pattern: {
                        value: regex.char50,
                        message:
                          'Please enter valid Last name with max 50 characters',
                      },
                    },
                    {
                      type: 'file',
                      name: 'photo',
                      id: 'photo',
                      // isProfile: true,
                      title: 'Upload Photograph',
                      accept: 'image/*',
                      tempFilename: data?.photo,
                      validationProps: data?.photo
                        ? {
                            // required: 'This is a mandatory field', ?.split('/')[(data?.photo)?.split('/')?.length - 1]
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
                  type: 'radio',
                  name: 'gender',
                  id: 'gender',
                  title: 'Gender',
                  options: [
                    {title: 'Male', value: 'Male'},
                    {title: 'Female', value: 'Female'},
                    {title: 'Others', value: 'Others'},
                  ],
                  infoMessage: ['Radio button is selectable', 'e.g.: Male'],
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
                      name: 'emailId',
                      id: 'emailId',
                      title: 'Employee Email Id',
                      infoMessage: [
                        'Alphanumeric characters are allowed',
                        'Maximum length should be 30 characters & should include @',
                        'Should have domain name',
                        'e.g.: xyz45@gmail.com',
                      ],
                      pattern: {
                        value: regex.emailReg,
                        message: 'Please enter valid Employee Email Id',
                      },
                      validationProps: {
                        required: 'This is a mandatory field',
                        manual: [
                          {
                            condition: `emailId domainCheck tempdomain`,
                            message: 'Domain name did not match',
                          },
                        ],
                      },
                    },
                    {
                      type: 'button',
                      name: 'verify',
                      buttonFor: 'emailId',
                      id: 'verify ',
                      title: 'Verify ',
                      defaultValue: 'verify',
                    },
                  ],
                },
                {
                  type: 'hidden',
                  name: 'tempdomain',
                  id: 'tempdomain',
                  title: 'Domain',
                  defaultValue: domain,
                  infoMessage: [
                    'Alphanumeric characters are allowed',
                    'Maximum length should be 50 characters',
                    'e.g.: BJAJ8595',
                  ],
                },

                {
                  type: 'text',
                  name: 'employeeCode',
                  id: 'employeeCode',
                  disabled: true,
                  title: 'Employee Code',
                  infoMessage: [
                    'Alphanumeric characters are allowed',
                    'Maximum length should be 50 characters',
                    'e.g.: BJAJ8595',
                  ],
                  // pattern: {
                  //   value: regex.codeReg,
                  //   message: 'Please enter valid Employee Code  and below 50 characters'
                  // },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },
                {
                  type: 'text',
                  name: 'shortId',
                  id: 'shortId',
                  title: 'Employee Short Id',
                  // isUpper: true,
                  infoMessage: [
                    'Alphanumeric characters are allowed',
                    'Maximum length should be 16 characters',
                    'e.g.: BJAJ8595',
                  ],
                  // pattern: {
                  //   value: regex.codeReg16,
                  //   message:
                  //     'Please enter valid Employee Code  and below 50 characters',
                  // },
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },
                // {
                //   type: 'date',
                //   name: 'dOJ',
                //   id: 'dOJ',
                //   title: 'Date of Joining',
                //   max: "today",
                //   infoMessage: ["Date is selectable from calendar", "Date can be entered in DD-MM-YY Format", "e.g.: 07-04-1992"],
                //   validationProps: {
                //     required: 'This is a mandatory field'
                //   }
                // },
                {
                  type: 'select',
                  name: 'isVaccinated',
                  id: 'isVaccinated',
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
                      name: 'mobileNo',
                      id: 'mobileNo',
                      title: 'Mobile No.',
                      maxChar: 10,
                      isNumber: true,
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
                      type: 'button',
                      name: 'verify',
                      buttonFor: 'mobileNo',
                      id: 'verify',
                      title: ' Verify',
                      defaultValue: 'verify',
                    },
                  ],
                },

                {
                  type: 'text',
                  name: 'alternateContactNo',
                  id: 'alternateContactNo',
                  title: 'Alternate Number',
                  maxChar: 10,
                  isNumber: true,
                  infoMessage: [
                    'Numeric characters are allowed',
                    'Maximum length should be 10 characters',
                    'e.g.: 9058906780',
                  ],
                  pattern: {
                    value: regex.phoneReg,
                    message: 'Please enter valid Alternate Number',
                  },
                  validationProps: {
                    manual: [
                      {
                        condition: `mobileNo != alternateContactNo`,
                        message:
                          'AlternateNo. should be different from mobileNo.',
                      },
                    ],
                  },
                },
                {
                  type: 'hidden',
                  name: 'companyName',
                  id: 'companyName',
                  title: 'Company Name',
                  defaultValue: user?.userList?.corporateName,
                },
                {
                  type: 'hidden',
                  name: 'companyCode',
                  id: 'companyCode',
                  title: 'Company Code',
                  defaultValue: user?.userList?.corporateCode,
                },
                {
                  type: 'hidden',
                  name: 'corporateId',
                  id: 'corporateId',
                  title: 'Company ID.',
                  defaultValue: CorpId,
                },
                {
                  type: 'hidden',
                  name: 'tanentId',
                  id: 'tanentId',
                  title: 'Tanent ID.',
                  defaultValue: user?.userList?.tanentId,
                },
                {
                  type: 'hidden',
                  name: 'tanentCode',
                  id: 'tanentCode',
                  title: 'Tanent Code',
                  defaultValue: user?.userList?.tanentCode,
                },
                {
                  type: 'hidden',
                  name: 'tanentName',
                  id: 'tanentName',
                  title: 'Tanent Name',
                  defaultValue: user?.userList?.tanentName,
                },
              ],
            },
            {
              type: 'section',
              layout: {column: 1, spacing: 2, size: 'medium', label: 'fixed'},
              fields: [
                {
                  type: 'radio',
                  name: 'roasterManagerFlag',
                  id: 'roasterManagerFlag',
                  title: 'Is Roster Manager?',
                  options: [
                    {title: 'Yes', value: 'YES'},
                    {title: 'No', value: 'NO'},
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
                  type: 'section',
                  layout: {
                    column: 2,
                    spacing: 2,
                    size: 'medium',
                    label: 'fixed',
                  },
                  dynamic: {
                    field: 'roasterManagerFlag',
                    value: 'NO',
                  },
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
                          name: 'tempemailId',
                          id: 'tempemailId',
                          defaultValue: managerEmail,
                          title: "Manager's Email Id",
                          pattern: {
                            value: regex.emailReg,
                            message: "Please enter valid Manager's Email Id",
                          },
                          validationProps: {
                            required: 'This is a mandatory field',
                          },
                          dynamic: {
                            field: 'roasterManagerFlag',
                            value: 'NO',
                          },
                        },
                        {
                          type: 'button',
                          name: 'search',
                          id: 'search',
                          title: 'Search',
                          defaultValue: 'search',
                          dynamic: {
                            field: 'roasterManagerFlag',
                            value: 'NO',
                          },
                        },
                      ],
                    },
                    {
                      type: 'text',
                      name: 'managerName',
                      id: 'managerName',
                      title: 'Manager Name',
                      disabled: true,
                      dynamic: {
                        field: 'roasterManagerFlag',
                        value: 'NO',
                      },
                      pattern: {
                        value: regex.char50,
                        message:
                          'Please enter valid Manager Name and below 50 characters',
                      },
                    },
                  ],
                },
              ],
            },
            {
              type: 'section',
              layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
              fields: [
                {
                  type: 'autocomplete',
                  name: 'temp_businessUnitId',
                  id: 'temp_businessUnitId',
                  title: 'Business Unit',
                  options: businessUnit ?? [],
                  infoMessage: [
                    'Alphanumerics are allowed',
                    'Maximum length should be 30 characters',
                    'e.g.: Software',
                  ],
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                  pattern: {
                    value: regex.char30,
                    message:
                      'Please enter valid business unit with max 30 characters ',
                  },
                  dynamic: {
                    field: 'roasterManagerFlag',
                    value: 'YES',
                  },
                },
                {
                  type: 'autocomplete',
                  name: 'temp_departmentId',
                  id: 'temp_departmentId',
                  title: 'Department Name',
                  infoMessage: ['Dropdown values are selectable', 'e.g.: KM+'],
                  options: deptList,
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                  dynamic: {
                    field: 'roasterManagerFlag',
                    value: 'YES',
                  },
                },

                {
                  type: 'text',
                  name: 'businessUnit',
                  id: 'businessUnit',
                  title: 'Business Unit',
                  disabled: true,
                  infoMessage: [
                    'Maximum length should be 30 characters',
                    'e.g.: Software',
                  ],
                  dynamic: {
                    field: 'roasterManagerFlag',
                    value: 'NO',
                  },
                },
                {
                  type: 'hidden',
                  name: 'businessUnitId',
                  id: 'businessUnitId',
                  title: 'Business Unit',
                  infoMessage: [
                    'Maximum length should be 30 characters',
                    'e.g.: Software',
                  ],
                  dynamic: {
                    field: 'roasterManagerFlag',
                    value: 'NO',
                  },
                },
                {
                  type: 'hidden',
                  name: 'departmentId',
                  id: 'departmentId',
                  title: 'Department ID',
                  dynamic: {
                    field: 'roasterManagerFlag',
                    value: 'NO',
                  },
                },
                {
                  type: 'text',
                  name: 'department',
                  id: 'department',
                  title: 'Department Name',
                  disabled: true,
                  infoMessage: ['Dropdown values are selectable', 'e.g.: KM+'],
                  dynamic: {
                    field: 'roasterManagerFlag',
                    value: 'NO',
                  },
                },
              ],
            },
          ],
        },
      },
      {
        layout: {},
        title: 'Additional Details',
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
            column: 1,
            spacing: 2,
            size: 'medium',
            label: 'fixed',
            type: 'grid',
          },
          sections: [
            {
              type: 'section',
              layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
              fields: [
                {
                  type: 'autocomplete',
                  name: 'employeeCategoryId',
                  id: 'employeeCategoryId',
                  title: 'Employee Category',
                  infoMessage: [
                    'Dropdown values are selectable',
                    'e.g.: Contractor,regular etc.',
                  ],
                  options: employeeCategory ?? [],
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },

                {
                  type: 'autocomplete',
                  name: 'designationId',
                  id: 'designationId',
                  title: 'Designation',
                  infoMessage: [
                    'Dropdown values are selectable',
                    'Ex-Software.',
                  ],
                  options: designation ?? [],
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },

                {
                  type: 'text',
                  name: 'costCenter',
                  id: 'costcenter',
                  title: 'Cost Center',
                  infoMessage: [
                    'Alphanumeric characters are allowed',
                    'Maximum length should be 100 characters',
                    'e.g.: ABC1234',
                  ],
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // },
                  pattern: {
                    value: regex.maxSize100,
                    message:
                      'Please enter alpha-numeric and below 100 characters',
                  },
                },
                {
                  type: 'autocomplete',
                  name: 'shiftId',
                  id: 'shiftId',
                  infoMessage: [
                    'Dropdown values are selectable',
                    'e.g.: Morning(09:00-18:00)',
                  ],
                  title: 'Shift',
                  options: shiftList,
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },
                {
                  type: 'radio',
                  name: 'specificNeedType',
                  id: 'specificNeedType',
                  title: 'Specific Need',
                  infoMessage: ['Radio button is selectable', 'e.g.: Yes'],
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                  options: [
                    {title: 'Yes', value: 'Yes'},
                    {title: 'No', value: 'No'},
                  ],
                },
                {
                  type: 'autocomplete',
                  name: 'specialEmployeeId',
                  id: 'specialEmployeeId',
                  title: 'Special Employee Type',
                  options: special ?? [],
                  infoMessage: [
                    'Dropdown values are selectable',
                    'e.g.: Blind',
                  ],
                  dynamic: {
                    field: 'specificNeedType',
                    value: 'Yes',
                  },
                },
                // {
                //   type: 'button',
                //   name: 'shift',
                //   id: 'shift',
                //   title: 'Shift',
                //   defaultValue: "shift",
                // },
              ],
            },
          ],
        },
      },
      {
        layout: {},
        title: 'Address',
        buttons: ['verify and confirm'],
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
            column: 1,
            spacing: 2,
            size: 'medium',
            label: 'fixed',
            type: 'grid',
          },
          sections: [
            {
              type: 'section',
              layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
              fields: [
                {
                  type: 'autocomplete',
                  name: 'officeId',
                  id: 'officeId',
                  title: 'Site Office',
                  infoMessage: [
                    'Dropdown values are selectable',
                    'e.g.: Raj Nagar Branch',
                  ],
                  options: ofcList,
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },
                {
                  type: 'mappl',
                  name: 'pickupLocation',
                  id: 'pickupLocation',
                  distribute: [
                    {name: 'tempaddress', value: 'locName'},
                    {name: 'temptown', value: 'city'},
                    {name: 'tempstate', value: 'state'},
                    {name: 'temppincode', value: 'pincode'},
                    {name: 'templocality', value: 'locality'},
                  ],
                  title: 'Area, Street, Sector, Village',
                  infoMessage: [
                    'Alphanumeric characters are allowed',
                    'Maximum length should be 100 characters',
                    'e.g.: Noida Sector 48, UP',
                  ],
                  disabled: false,
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },
                {
                  type: 'text',
                  name: 'tempaddress',
                  id: 'tempaddress',
                  title: 'Flat, House No., Building, Company, Apartment',
                  infoMessage: [
                    'Alphanumeric characters are allowed',
                    'Maximum length should be 100 characters',
                    'e.g.: Noida Sector 48, UP',
                  ],
                  pattern: {
                    value: regex.addressReg,
                    message:
                      'Please enter valid Address with max 100 characters ',
                  },
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },
                {
                  type: 'text',
                  name: 'temptown',
                  id: 'temptown',
                  defaultValue: data?.temptown,
                  infoMessage: [
                    'Alphabetics characters are allowed',
                    'Maximum length should be 50 characters',
                    'e.g.: Noida ',
                  ],
                  title: 'Town/City',
                  pattern: {
                    // value: regex.adreesschar50,
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
                  defaultValue: data?.tempstate,
                  infoMessage: [
                    'Alphabetics characters are allowed',
                    'Maximum length should be 50 characters',
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
                  defaultValue: data?.temppincode,
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
                {
                  type: 'text',
                  name: 'templocality',
                  id: 'templocality',
                  title: 'Locality',
                  defaultValue: data?.templocality,
                  infoMessage: [
                    'Numeric characters are allowed',
                    'Maximum length should be 6 characters',
                    'e.g.: 201303 ',
                  ],
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                  // pattern: {
                  //   value: regex.pincodeRegex,
                  //   message: 'Please enter valid Pincode',
                  // },
                },
                {
                  type: 'select',
                  name: 'nodalPointId',
                  id: 'nodalPointId',
                  title: 'Pickup Drop Station',
                  infoMessage: [
                    'Dropdown values are selectable',
                    'Values from added nodal points',
                  ],
                  options: nodalPointList ?? [],
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },
              ],
            },
          ],
        },
      },
    ],
  };

  const handleChange = async (values) => {
    if (values?.businessUnitId?.value) {
      getDesignation(values?.businessUnitId?.value);
    }
    if (values?.temp_businessUnitId?.value) {
      getDesignation(values?.temp_businessUnitId?.value);
    }
    if (values?.departmentId?.value) {
      getShiftList(values?.departmentId?.value);
    }
    if (values?.temp_departmentId?.value) {
      getShiftList(values?.temp_departmentId?.value);
    }
  };
  const getFormData = (object) =>
    Object.keys(object).reduce((formData, key) => {
      formData.append(key, object[key]);
      return formData;
    }, new FormData());

  const handleSubmit = async (values) => {
    setshowbtn(false);
    let tempList = nodalPointData?.filter(
      (d) => d?.id == values?.data?.nodalPointId,
    );
    (values.data.pickupDropNodalPoint = {
      latitude:
        tempList[0]?.geoPoint?.latitude ?? data.pickupDropNodalPoint?.latitude,
      locName:
        tempList[0]?.geoPoint?.locName ?? data.pickupDropNodalPoint?.locName,
      longitude:
        tempList[0]?.geoPoint?.longitude ??
        data.pickupDropNodalPoint?.longitude,
      locality:
        tempList[0]?.geoPoint?.locality ?? data.pickupDropNodalPoint?.locality,
    }),
      (values.data.nodalPoint = {
        latitude: tempList[0]?.geoPoint?.latitude ?? data.nodalPoint?.latitude,
        locName: tempList[0]?.geoPoint?.locName ?? data.nodalPoint?.locName,
        longitude:
          tempList[0]?.geoPoint?.longitude ?? data.nodalPoint?.longitude,
        locality: tempList[0]?.geoPoint?.locality ?? data.nodalPoint?.locality,
      });

    if (values.button.toUpperCase() === 'VERIFY AND CONFIRM') {
      let dataSet = {};
      let tem = {};
      let allElem = {};
      dataSet = values.data;

      dataSet.residenceAddress = {
        pinCode: values?.data?.temppincode,
        state: values?.data?.tempstate,
        city: values?.data?.temptown,
        addressName: values?.data?.tempaddress,
      };
      dataSet.pickupLocation = {
        locName: values?.data?.pickupLocation?.locName,
        latitude: values?.data?.pickupLocation?.latitude,
        longitude: values?.data?.pickupLocation?.longitude,
        locality:
          values?.data?.pickupLocation?.locality == undefined
            ? values?.data?.templocality
            : values?.data?.pickupLocation?.locality,
      };
      if (dataSet?.roasterManagerFlag == 'YES') {
        dataSet.managerId = null;
        dataSet.managerName = null;
      }
      delete dataSet?.tempemailId;
      delete dataSet?.templocation;
      delete dataSet?.tempaddress;
      ofcList?.map((el) => {
        if (el?.value == values?.data?.officeId) {
          dataSet.officeName = el?.title;
        }
      });
      if (values?.data?.roasterManagerFlag == 'YES') {
        delete dataSet.managerId;
        delete dataSet.managerName;
        deptList?.map((man) => {
          if (man?.value == dataSet.temp_departmentId) {
            dataSet.department = man?.name;
            dataSet.departmentId = dataSet.temp_departmentId;
          }
        });
        businessUnit?.map((e) => {
          if (e?.value == dataSet.temp_businessUnitId) {
            dataSet.businessUnit = e?.name;
            dataSet.businessUnitId = dataSet.temp_businessUnitId;
          }
        });
      }
      designation?.map((e) => {
        if (e?.value == dataSet.designationId) {
          dataSet.designation = e?.name;
        }
      });
      employeeCategory?.map((e) => {
        if (e?.value == dataSet.employeeCategoryId) {
          dataSet.employeeCategory = e?.name;
        }
      });

      special?.map((e) => {
        if (e?.value == dataSet.specialEmployeeId) {
          dataSet.specialEmployee = e?.name;
        }
      });

      delete dataSet.tempaddress;
      delete dataSet.temptown;
      delete dataSet.tempstate;
      delete dataSet.temppincode;
      delete dataSet.tempdomain;
      delete dataSet.temp_businessUnitId;
      delete dataSet.temp_departmentId;
      delete dataSet.templocality;

      Object.keys(dataSet).map((key) => {
        if (typeof dataSet[key]?.[0]?.name == 'string') {
          tem = {
            ...tem,
            [key]: dataSet[key][0],
          };
        } else {
          allElem = {
            ...allElem,
            [key]: dataSet[key],
          };
        }
      });
      tem = {
        ...tem,
        data: JSON.stringify(allElem),
      };

      axios({
        method: 'put',
        url: Api?.employee?.list,
        data: getFormData(tem),
        headers: {'Content-Type': 'multipart/form-data'},
      })
        .then(function (response) {
          if (response?.data?.status == 200) {
            toast.success('Details has been successfully verified.');
            setTimeout(() => {
              window.location.href = `/dashboard`;
            }, 2000);
          } else {
            setshowbtn(true);
            toast.error(
              '11' + response?.data?.message ?? 'Something went wrong',
            );
          }
          setshowbtn(true);
        })
        .catch(function (err) {
          setshowbtn(true);
          toast.error(err?.data?.message, 'Something went wrong');
        });
    }
  };
  function myGetData(d) {
    if (d?.tempemailId?.length !== 0) {
      let employee = {
        key: d?.tempemailId,
        roasterManagerFlag: 'YES',
      };
      setManagerEmail(d?.tempemailId);
      axios
        .post(Api?.employee?.byEmployeeCode, employee)
        .then((r) => {
          if (r?.data) {
            if (r?.data?.data?.roasterManagerFlag == 'YES') {
              setManagerData(r?.data?.data);
            }
            if (r?.data?.data?.roasterManagerFlag == 'NO') {
              setManagerData('');
            }
            getDesignation(r?.data?.data?.businessUnitId);
            getShiftList(r?.data?.data?.departmentId);
          } else {
            setManagerData({});
          }
        })
        .catch((er) => {
          setManagerData({});
        });
    }
  }

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

  async function SecretFun(search, value) {
    if (search?.toUpperCase() == 'SEARCH') {
      myGetData(value);
    } else if (search?.toUpperCase() == ' VERIFY') {
      let temp_ = await axios.get(
        `${Api.baseUri}/userauth/user-account/${value?.mobileNo}/mobile`,
      );
      if (temp_?.data == 'User Present' && data?.mobileNo != value?.mobileNo) {
        toast.error('Mobile number already exists.');
        return;
      }
      setMobileNo(value?.mobileNo);
      setVerifyType('MOB');
      setOtpLoader(true);
      var instance = axios.create();
      delete instance?.defaults?.headers?.common['vtt_user_signature'];
      instance
        .get(
          Api.baseUri + '/usernotify/notification/singlesms/' + value?.mobileNo,
        )
        .then((ele) => {
          setOtpLoader(false);
          if (ele?.data) {
            setVerifyData(value?.mobileNo);
            setmyOtp(ele?.data?.split(' ')[0]?.trim());
          }
        })
        .catch((err) => {
          setOtpLoader(false);
        });
    } else if (search?.toUpperCase() == 'VERIFY ') {
      let temp_ = await axios.get(
        `${Api.baseUri}/userauth/user-account/${value?.emailId}/email`,
      );
      if (temp_?.data == 'User Present' && data?.emailId != value?.emailId) {
        toast.error('Email Id already exists.');
        return;
      }
      setEmail(value?.emailId);
      if (value?.emailId && email != value?.emailId) {
        let temCheck = await checkEmail(value?.emailId);
        if (!temCheck) {
          setEmailExists(true);
          setErrors('email');
        } else {
          setEmailExists(false);
          setErrors('email');
        }
      }
      if (!value?.mobileNo || value?.mobileNo?.length != 10) {
        setEmailExists(false);
        setErrors('email');
      }

      setVerifyType('EMAIL');
      setOtpLoader(true);
      var instance = axios.create();
      delete instance?.defaults?.headers?.common['vtt_user_signature'];
      instance
        .get(
          Api.baseUri +
            '/user-reg/employee-request/savenewdata/' +
            value?.emailId,
        )
        .then((ele) => {
          if (ele?.data) {
            setOtpLoader(false);
            setVerifyData(value?.emailId);
            setmyOtp(ele?.data?.data?.password);
          }
        })
        .catch((err) => {});
    } else return;
  }

  const getOnInput = (values) => {
    if (verifyType == 'MOB') {
      setVerifyData(values?.mobileNo);
    }
    if (verifyType == 'EMAIL') {
      setVerifyData(values?.emailId);
    }

    if (
      myFormData?.mobileNo != values?.mobileNo ||
      myFormData?.emailId != values?.emailId
    ) {
      setmyFormData({emailId: values?.emailId, mobileNo: values?.mobileNo});
    }
    if (values?.businessUnitId) {
      setBusinessUnitId(values?.businessUnitId);
    }
  };
  return (
    <>
      {!showbtn ? <AppLoader /> : null}
      {data?.id &&
        deptList &&
        shiftList &&
        businessUnit &&
        designation &&
        nodalPointList &&
        domain && (
          <Steppers
            defaultValues={data}
            template={stepperTemplate}
            setVal={[
              {name: 'managerId', value: managerData?.id || 'NA'},
              {
                name: 'managerName',
                value: managerData?.employeeFullName || 'NA',
              },
              {name: 'department', value: managerData?.department || 'NA'},
              {name: 'departmentId', value: managerData?.departmentId || ''},
              {name: 'businessUnit', value: managerData?.businessUnit || 'NA'},
              {
                name: 'businessUnitId',
                value: managerData?.businessUnitId || '',
              },
              {name: 'tempemailId', value: managerEmail || ''},
              {name: 'temptown', value: data?.residenceAddress?.city},
              {name: 'tempstate', value: data?.residenceAddress?.state},
              {name: 'temppincode', value: data?.residenceAddress?.pinCode},
            ]}
            showbtn={showbtn}
            SecretFun={SecretFun}
            setSuccessIcon={[
              {
                name: 'mobileNo',
                value:
                  myFormData?.mobileNo &&
                  myFormData?.mobileNo == lastverifiedData?.mob,
              },
              {
                name: 'emailId',
                value:
                  myFormData?.emailId &&
                  myFormData?.emailId == lastverifiedData?.email,
              },
            ]}
            seterrors={[
              {
                name: 'mobileNo',
                type: 'customized',
                message: 'Mobile number is not verified.',
                error:
                  myFormData?.mobileNo?.length == 10 &&
                  myFormData?.mobileNo != lastverifiedData?.mob,
              },
              {
                name: 'managerName',
                type: 'customized',
                message: "Please enter manager's details.",
                error: managerData == 'NA',
              },
              {
                name: 'emailId',
                type: 'customized',
                message: 'Email Id is not verified.',
                error:
                  myFormData?.emailId?.includes('@') &&
                  myFormData?.emailId != lastverifiedData?.email,
              },
            ]}
            clearErr={[
              {
                name: 'managerName',
                value: managerData?.employeeFullName && managerData != 'NA',
              },
              {
                name: 'mobileNo',
                value: myFormData?.mobileNo == lastverifiedData?.mob,
              },
              {
                name: 'emailId',
                value: myFormData?.emailId == lastverifiedData?.email,
              },
            ]}
            onChange={handleChange}
            afterSubmit={handleSubmit}
            getOnInput={getOnInput}
            buttons={['Update']}
            icons={{
              1: <PersonIcon />,
              2: <ManageAccountsIcon />,
              3: <RouteIcon />,
            }}
          />
        )}
      {otpLoader == true ? <AppLoader /> : null}
      {verifyType && verifyData ? (
        <Dialog
          onClose={() => {
            setVerifyType('');
            setOtpLoader(false);
            setVerifyData('');
            setmyOtp('');
          }}
          open={true}
          maxWidth='false'
          PaperProps={{
            sx: {
              width: '35%',
            },
          }}
          style={{borderRadius: '4rem'}}
        >
          <DialogTitle style={{background: '#f5f2f2'}}>
            <h1>Verify {verifyType == 'MOB' ? 'Mobile No' : 'Email Id'}</h1>
            <CloseIcon
              onClick={() => {
                setOtpLoader(false);
                setVerifyType('');
                setVerifyData('');
                setmyOtp('');
              }}
              style={{
                top: '14px',
                cursor: 'pointer',
                position: 'absolute',
                right: '12px',
              }}
            />
          </DialogTitle>
          <DialogContent>
            <SmartForm
              template={template}
              defaultValues={{enterEmail: verifyData}}
              onSubmit={verifyOTP}
              buttons={['submit']}
              success={showbtn}
            />
            {/* <CreateRosterSetting verifyType={verifyType} setVerifyType={setVerifyType} /> */}
          </DialogContent>
        </Dialog>
      ) : null}
    </>
  );
};

export default EmployeeProfileForm;
