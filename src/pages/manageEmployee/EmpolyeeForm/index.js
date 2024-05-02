/* eslint-disable */
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Steppers from '@smart-form/stepper';
import {useAuthUser} from '@crema/utility/AuthHooks';
import regex from '@regex';
import axios from 'axios';
import api from '@api';
import {toast} from 'react-toastify';
import AppLoader from '@crema/core/AppLoader';
import PersonIcon from '@mui/icons-material/Person';
import RouteIcon from '@mui/icons-material/Route';
import Api from '@api';
import CreateForm from 'pages/onboardCorporate/CorporateMaster/ManageDepartment/CreateForm';
import ShiftCreateForm from 'pages/onboardCorporate/CorporateMaster/ManageShifts/NewShifts';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
// import data from 'pages/thirdParty/recharts/Arxea/Components/data';
const EmpolyeeForm = ({close, domain}) => {
  const navigate = useNavigate();
  const {user} = useAuthUser();

  const [ofcList, setOfcList] = React.useState([]);
  const [deptList, setdeptList] = React.useState([]);
  const [shiftList, setshiftList] = React.useState([]);
  const [nodalPointList, setNodalPointList] = React.useState([]);
  const [nodalPointData, setNodalPointdata] = React.useState([]);
  const [managerData, setManagerData] = React.useState();
  const [showbtn, setshowbtn] = React.useState(true);
  const [special, setSpecial] = React.useState();
  const [temppickupDropNodalPointGeoVal, setTemppickupDropNodalPointGeoVal] =
    React.useState({});
  const [nodalPointId, setNodalPointId] = React.useState('');
  const [shifttype, setShiftType] = useState([]);
  const [opendepartment, setOpenDepartment] = useState(false);
  const [openshift, setOpenShift] = useState(false);
  const [button, setButton] = useState();
  const [designation, setDesignation] = useState();
  const [employeeCategory, setEmployeCategory] = useState();
  const [businessUnit, setBusinessUnit] = useState();
  const [mobileExists, setMobileExists] = useState(false);
  const [mobileNo, setMobileNo] = useState();
  const [emailExists, setEmailExists] = useState(false);
  const [empSetting, setEmpSetting] = useState();
  const [email, setEmail] = useState();
  let profileId = user?.userList?.corporateId;
  const CorpId =
    user?.role == 'CORPORATEADMIN'
      ? user?.userList?.profileId
      : user?.userList?.corporateId;
  useEffect(() => {
    let url = Api?.baseUri + '/user-reg/nodal-point/getall';
    axios.get(url).then((response) => {
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
    });
    axios.get(`${api?.mastershifttype?.getall}`).then((res) => {
      let temp = [];
      if (res?.data?.data?.length) {
        res?.data?.data?.map((e) => {
          temp.push({title: e?.shiftType, value: e?.shiftType});
        });
      }
      setShiftType(temp);
    });
  }, []);

  useEffect(() => {
    if (!profileId) {
      return;
    }
    fetchSiteOffice();
    getShiftList('');
    getspecial();
  }, [profileId]);

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
    async function getBusinessUnit() {
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
    getDeptList();
  }, []);

  async function getDesignation(buid) {
    let temp = [];
    axios
      .get(`${Api.businessUnit.getbyId}/${buid}`)
      .then((res) => {
        res?.data?.data?.designationList?.map((e) => {
          temp.push({
            title: e.designationName,
            value: e.id,
            name: e.designationName,
          });
        });
        setDesignation(temp ?? []);
      })
      .catch((er) => {
        setDesignation([]);
      });
  }

  async function getDeptList() {
    axios
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

  async function getShiftList(deptname) {
    const baseURL = `${Api.manageshifts.list}/${CorpId}/corporateid/${deptname}/departmentid`;
    axios.get(`${baseURL}`).then((response) => {
      let temp = [];
      response?.data?.data
        ?.map((e) => {
          temp.push({
            title: e.shiftName + '(' + e.shiftStart + '-' + e.shiftEnd + ')',
            value: e.id,
            name: e.shiftName,
          });

          setshiftList(temp);
        })
        .catch((er) => {
          setshiftList([]);
        });
    });
  }

  async function fetchSiteOffice() {
    axios
      .get(`${api.siteOffice.list}/corporate?page=0&size=1000&officeName=null`)
      .then((res) => {
        console.log('siteeeeee', res);
        let temp = [];
        if (res?.data?.data?.body?.['SiteOffice List'].length) {
          res?.data?.data?.body?.['SiteOffice List']?.map((e) => {
            temp.push({
              title: e.officeName,
              value: e.id,
              officeName: e.officeName,
            });
          });
        }
        setOfcList(temp);
      })
      .catch((err) => {
        setOfcList([]);
      });
  }

  useEffect(() => {
    async function fetchData() {
      const baseURL = `${api.onBoardCorporate.list}/${profileId}`;
      let response = await axios.get(`${baseURL}`);
    }
    fetchData();
  }, [profileId]);

  function EmployeeSetting() {
    axios
      .get(
        Api.baseUri +
          '/user-reg/employee-setting/get-empSetting-by-corpoarteId/' +
          user?.userList?.profileId,
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          setEmpSetting(res?.data?.data);
        }
      });
  }

  useEffect(() => {
    EmployeeSetting();
  }, []);

  let stepperTemplate = {
    title: 'Register Employee Detail',
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
                      // validationProps: {
                      //   required: 'This is a mandatory field'
                      // }
                    },
                    {
                      type: 'file',
                      name: 'photo',
                      isProfile: true,
                      id: 'photo',
                      accept: 'image/*',
                      title: 'Upload Photograph',
                      infoMessage: [
                        'Should only accept PDF,JPEG files',
                        'File should contain file extension',
                        'e.g.:Shub.jpeg',
                      ],
                      validationProps: {
                        size: {
                          value: 5,
                          message: 'File size should not be more than 5 mb.',
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
                  type: 'hidden',
                  name: 'tempdomain',
                  id: 'tempdomain',
                  title: 'Domain',
                  infoMessage: [
                    'Alphanumeric characters are allowed',
                    'Maximum length should be 30 characters & should include @',
                    'Should have domain name',
                    'e.g.: xyz45@gmail.com',
                  ],
                  defaultValue: domain,
                },
                {
                  type: 'text',
                  name: 'employeeCode',
                  id: 'employeeCode',
                  title: 'Employee Code',
                  isUpper: true,
                  infoMessage: [
                    'Alphanumeric characters are allowed',
                    'Maximum length should be 50 characters',
                    'e.g.: BJAJ8595',
                  ],
                  pattern: {
                    value: regex.codeReg,
                    message:
                      'Please enter valid Employee Code  and below 50 characters',
                  },
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
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
                  pattern: {
                    value: regex.codeReg16,
                    message:
                      'Please enter valid Employee Code  with 16 characters',
                  },
                  // validationProps: {
                  //   required: 'This is a mandatory field',
                  // },
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
                  infoMessage: ['Radio button is selectable', 'e.g.: Yes'],
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
                  // dynamic: {
                  //   field: 'roasterManagerFlag',
                  //   value: 'NO'
                  // },
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
                          title: "Manager's Email Id",
                          infoMessage: [
                            'Alphanumeric characters are allowed',
                            'Maximum length should be 30 characters & should include @',
                            'Should have domain name',
                            'e.g.: xyz45@gmail.com',
                          ],
                          pattern: {
                            value: regex.emailReg,
                            message: "Please enter valid Manager's Email Id",
                          },
                          dynamic: {
                            field: 'roasterManagerFlag',
                            value: 'NO',
                          },
                          validationProps: {
                            required: 'This is a mandatory field',
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
                      infoMessage: [
                        'Maximum length should be 50 characters',
                        'e.g.: XYZ',
                      ],
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
                // {
                //   type: 'autocomplete',
                //   name: 'businessUnitId',
                //   id: 'businessUnitId',
                //   title: 'Business Unit',
                //   options: businessUnit ?? [],
                //   infoMessage: ["Dropdown is selectable", "e.g.: Software"],
                //   // validationProps: {
                //   //   required: 'This is a mandatory field'
                //   // },
                //   pattern: {
                //     value: regex.char30,
                //     message: 'Please enter valid business unit with max 30 characters '
                //   },
                //   dynamic: {
                //     field: 'roasterManagerFlag',
                //     value: 'YES'
                //   },
                // },
                // {
                //   type: 'autocomplete',
                //   name: 'departmentId',
                //   id: 'departmentId',
                //   title: 'Department Name',
                //   infoMessage: ["Dropdown values are selectable", "e.g.: KM+"],
                //   options: deptList,
                //   // validationProps: {
                //   //   required: 'This is a mandatory field'
                //   // },
                //   dynamic: {
                //     field: 'roasterManagerFlag',
                //     value: 'YES'
                //   },
                // },
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
                  // validationProps: {
                  //   required: 'This is a mandatory field',
                  // },
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
                  infoMessage: ['Prefetch value will come'],
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
                  infoMessage: ['Prefetch value will come'],
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
                  infoMessage: ['Prefetch value will come'],
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
                  infoMessage: ['Prefetch value will come'],
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
                // {
                //   type: 'mappl',
                //   name: 'dropLocation',
                //   id: 'dropLocation',
                //   title: 'Drop Location',
                //   infoMessage: ["Alphanumeric characters are allowed", "Maximum length should be 100 characters", "e.g.: Noida Sector 48, UP"],
                //   disabled: false,
                //   validationProps: {
                //     required: 'This is a mandatory field'
                //   }
                // },
                // {
                //   type: 'text',
                //   name: 'defaultRouteNumber',
                //   id: 'defaultRouteNumber',
                //   title: 'Default Route Number',
                //   infoMessage: ["Alphanumeric characters are allowed", "Maximum length should be 30 characters", "e.g.: 454R"],
                //   pattern: {
                //     value: regex.maxSize30,
                //     message: 'Please enter valid Default Route Number with max 30 characters '
                //   },
                //   validationProps: {
                //     required: 'This is a mandatory field'
                //   }
                // },
                // {
                //   type: 'text',
                //   name: 'defaulteLogoutRouteNumber',
                //   id: 'defaulteLogoutRouteNumber',
                //   title: 'Default Logout Route Number',
                //   infoMessage: ["Alphanumeric characters are allowed", "Maximum length should be 30 characters", "e.g.: 454R"],
                //   pattern: {
                //     value: regex.maxSize30,
                //     message: 'Please enter valid Default Logout Route Number with max 30 characters '
                //   },
                //   validationProps: {
                //     required: 'This is a mandatory field'
                //   }
                // },
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
                  type: 'section',
                  layout: {
                    column: 1,
                    spacing: 2,
                    size: 'medium',
                    label: 'fixed',
                  },
                  fields: [
                    {
                      type: 'autocomplete',
                      name: 'designationId',
                      id: 'designationId',
                      title: 'Designation',
                      options: designation ?? [],
                      infoMessage: [
                        'Dropdown values are selectable',
                        'e.g.: KM+',
                      ],
                      // validationProps: {
                      //   required: 'This is a mandatory field',
                      // },
                    },
                    // {
                    //   type: 'button',
                    //   name: 'department',
                    //   id: 'department',
                    //   title: 'Department',
                    //   defaultValue: "department",
                    // },
                  ],
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
                  title: 'Specific Need ',
                  infoMessage: ['Radio button is selectable', 'e.g.: Yes'],
                  options: [
                    {title: 'Yes', value: 'Yes'},
                    {title: 'No', value: 'No'},
                  ],
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },
                {
                  type: 'autocomplete',
                  name: 'specialEmployeeId',
                  id: 'specialEmployeeId',
                  title: 'Special Employee Type ',
                  options: special ?? [],
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                  infoMessage: [
                    'Dropdown values are selectable',
                    'e.g.: Blind',
                  ],
                  dynamic: {
                    field: 'specificNeedType',
                    value: 'Yes',
                  },
                },
              ],
            },
          ],
        },
      },
      {
        layout: {},
        title: 'Address',
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
                  options: ofcList ?? [],
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },
                {
                  type: 'mappl',
                  name: 'pickupLocation',
                  id: 'pickupLocation',
                  title: 'Area, Street, Sector, Village',
                  distribute: [
                    {name: 'temptown', value: 'city'},
                    {name: 'tempstate', value: 'state'},
                    {name: 'temppincode', value: 'pincode'},
                    {name: 'templocality', value: 'locality'},
                  ],
                  infoMessage: [
                    'Alphanumeric characters are allowed',
                    'Maximum length should be 100 characters',
                    'e.g.: Noida Sector 48, UP',
                  ],
                  disabled: false,
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
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
                },
                {
                  type: 'text',
                  name: 'temptown',
                  id: 'temptown',
                  infoMessage: [
                    'Alphabetics characters are allowed',
                    'Maximum length should be 50 characters',
                    'e.g.: Noida ',
                  ],
                  title: 'Town/City',
                  pattern: {
                    value: regex.adreesschar50,
                    message:
                      'Please enter valid Town/City with max 50 characters',
                  },
                },
                {
                  type: 'text',
                  name: 'tempstate',
                  id: 'tempstate',
                  title: 'State',
                  infoMessage: [
                    'Alphabetics characters are allowed',
                    'Maximum length should be 50 characters',
                    'e.g.: Uttar Pradesh ',
                  ],
                  pattern: {
                    value: regex.adreesschar50,
                    message: 'Please enter valid State with max 50 characters',
                  },
                },
                {
                  type: 'text',
                  name: 'temppincode',
                  id: 'temppincode',
                  title: 'Pincode',
                  infoMessage: [
                    'Numeric characters are allowed',
                    'Maximum length should be 6 characters',
                    'e.g.: 201303 ',
                  ],
                  pattern: {
                    value: regex.pincodeRegex,
                    message: 'Please enter valid Pincode',
                  },
                },
                {
                  type: 'text',
                  name: 'templocality',
                  id: 'templocality',
                  title: 'Locality',
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
                  name: 'pickupDropNodalPoint',
                  id: 'pickupDropNodalPoint',
                  title: 'Nodal Point',
                  infoMessage: [
                    'Dropdown values are selectable',
                    'Values from added nodal points',
                  ],
                  options: nodalPointList ?? [],
                  // validationProps: {
                  //   // required: 'This is a mandatory field'
                  // }
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

  const handleSubmit = async (values) => {
    console.log('val', values);
    setshowbtn(false);
    if (values.button.toUpperCase() === 'SUBMIT') {
      let dataSet = {};
      let allElem = {};
      let tem = {};
      dataSet = values.data;
      if (values?.data?.roasterManagerFlag == 'YES') {
        delete dataSet.managerId;
        delete dataSet.managerName;
      }
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

      shiftList?.map((e) => {
        if (e?.value == dataSet.shiftId) {
          dataSet.shiftName = e?.name;
        }
      });
      (dataSet.residenceAddress = {
        pinCode: values?.data?.temppincode,
        state: values?.data?.tempstate,
        city: values?.data?.temptown,
        addressName: values?.data?.tempaddress,
      }),
        (dataSet.pickupLocation = {
          locName: values?.data?.pickupLocation?.locName,
          latitude: values?.data?.pickupLocation?.latitude,
          longitude: values?.data?.pickupLocation?.longitude,
          locality:
            values?.data?.pickupLocation?.locality == undefined
              ? values?.data?.templocality
              : values?.data?.pickupLocation?.locality,
        }),
        (dataSet.profileStatus = 'DEFAULT');

      ofcList?.map((man) => {
        if (man?.value == dataSet.officeId) {
          dataSet.officeName = man?.officeName;
        }
      });
      dataSet['nodalPointId'] = nodalPointId;
      dataSet['nodalPoint'] = temppickupDropNodalPointGeoVal;
      dataSet.pickupDropNodalPoint = temppickupDropNodalPointGeoVal;
      dataSet.dropLocation = values?.data?.dropLocation;
      dataSet.homeStation = values?.data?.homeStation;
      dataSet.locality = values?.data?.locality;
      dataSet.location = values?.data?.location;
      console.log('dataSet', dataSet);
      if (!dataSet?.photo?.length) delete dataSet?.photo;
      delete dataSet?.tempemailId;
      delete dataSet.tempaddress;
      delete dataSet.temptown;
      delete dataSet.tempstate;
      delete dataSet.temppincode;
      delete dataSet.temppickupDropNodalPoint;
      delete dataSet?.tempdomain;
      delete dataSet?.temp_businessUnitId;
      delete dataSet?.temp_departmentId;
      delete dataSet?.templocality;

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
        method: 'post',
        url: Api?.employee?.list,
        data: getFormData(tem),
        headers: {'Content-Type': 'multipart/form-data'},
      })
        .then(function (response) {
          if (response?.data?.status == 200) {
            toast.success(
              `${response?.data?.data?.employeeFullName}'s profile created successfully`,
            );
            navigate(`/onboardCorporate/employee/employee-listing`);
            close(false);
          } else {
            toast.error(response?.data?.message, 'Something went wrong');
          }
          setshowbtn(true);
        })
        .catch(function (err) {
          setshowbtn(true);
          toast.error(err?.data?.message, 'Something went wrong');
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
    if (email != d?.emailId) setEmail(d?.emailId);
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

  function myGetData(d) {
    if (d?.tempemailId?.length !== 0) {
      let employee = {
        key: d?.tempemailId,
        roasterManagerFlag: 'YES',
      };
      axios
        .post(Api?.employee?.byEmployeeCode, employee)
        .then((r) => {
          if (r?.data) {
            if (r?.data?.data?.roasterManagerFlag == 'YES') {
              setManagerData(r?.data?.data);
            } else {
              setManagerData('NA');
            }
            getDesignation(r?.data?.data?.businessUnitId);
            getShiftList(r?.data?.data?.departmentId);
          } else {
            setManagerData({});
          }
        })
        .catch((er) => {
          setManagerData({});
          // setManagerName("NA")
        });
    }
  }

  function SecretFun(search, value) {
    if (search?.toUpperCase() == 'SEARCH') {
      myGetData(value);
    }
    if (search?.toUpperCase() == 'DEPARTMENT') {
      setButton('department');
      setOpenDepartment(true);
    }
    if (search == 'Shift') {
      setButton('shift');
      setOpenShift(true);
    } else return;
  }

  const handleChange = async (values) => {
    //
    if (values?.pickupDropNodalPoint) {
      setNodalPointId(values?.pickupDropNodalPoint);
      let tempList = nodalPointData.filter(
        (d) => d.id == values?.pickupDropNodalPoint,
      );

      setTemppickupDropNodalPointGeoVal({
        latitude: tempList[0]?.geoPoint?.latitude,
        locName: tempList[0]?.geoPoint?.locName,
        longitude: tempList[0]?.geoPoint?.longitude,
        locality: tempList[0]?.geoPoint?.locality,
      });
    }

    if (values?.temp_businessUnitId?.value) {
      getDesignation(values?.temp_businessUnitId?.value);
    }

    if (values?.temp_departmentId?.value) {
      getShiftList(values?.temp_departmentId?.value);
    }
    if (values?.businessUnitId?.value) {
      getDesignation(values?.businessUnitId?.value);
    }
    if (values?.departmentId?.value) {
      getShiftList(values?.departmentId?.value);
    }
  };

  return (
    <>
      {!showbtn ? <AppLoader /> : null}
      {domain ? (
        <Steppers
          template={stepperTemplate}
          setVal={[
            {name: 'managerId', value: managerData?.id || 'NA'},
            {name: 'managerName', value: managerData?.employeeFullName || 'NA'},
            {name: 'department', value: managerData?.department || 'NA'},
            {name: 'departmentId', value: managerData?.departmentId || ''},
            {name: 'businessUnit', value: managerData?.businessUnit || 'NA'},
            {name: 'businessUnitId', value: managerData?.businessUnitId || ''},
          ]}
          setSuccessIcon={[
            {
              name: 'mobileNo',
              value: mobileExists == false && mobileNo?.length == 10,
            },
            {name: 'emailId', value: email?.length && emailExists == false},
          ]}
          showbtn={showbtn}
          getOnInput={getOnInput}
          SecretFun={SecretFun}
          clearErr={[
            {name: 'mobileNo', value: mobileNo?.length == 10 && !mobileExists},
            {name: 'emailId', value: emailExists == false},
          ]}
          seterrors={[
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
          ]}
          afterSubmit={handleSubmit}
          onChange={handleChange}
          buttons={['submit']}
          mode='onTouched'
          icons={{
            1: <PersonIcon />,
            2: <ManageAccountsIcon />,
            3: <RouteIcon />,
          }}
        />
      ) : null}
    </>
  );
};

export default EmpolyeeForm;
