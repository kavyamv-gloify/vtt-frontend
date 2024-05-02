/* eslint-disable */
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import SmartForm from '@smart-form';
import {useAuthUser} from '@crema/utility/AuthHooks';
import regex from '@regex';
import axios from 'axios';
import api from '@api';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import {toast} from 'react-toastify';
import AppLoader from '@crema/core/AppLoader';
import {useParams} from 'react-router-dom';
import Steppers from '@smart-form/stepper';
import Api from '@api';
import {tr} from 'date-fns/locale';
import PersonIcon from '@mui/icons-material/Person';
import RouteIcon from '@mui/icons-material/Route';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
const PendingForm = ({id, close}) => {
  const navigate = useNavigate();
  const {user} = useAuthUser();
  const [showbtn, setshowbtn] = React.useState(true);
  const [ofcList, setOfcList] = React.useState(null);
  const [managerId, setManagerId] = React.useState();
  const [managerName, setManagerName] = React.useState();
  const [deptList, setdeptList] = React.useState(null);
  const [shiftList, setshiftList] = React.useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [btnName, setBtnName] = useState(null);
  const [subVal, setsubVal] = useState({});
  const [special, setSpecial] = useState([]);
  const [data, setData] = useState();
  const [nodalPointList, setNodalPointList] = React.useState();
  const [nodalPointData, setNodalPointdata] = React.useState([]);
  const [businessUnit, setBusinessUnit] = useState();
  const [designation, setDesignation] = useState();
  const [employeeCategory, setEmployeCategory] = useState();
  const [managerEmail, setManagerEmail] = useState();
  const CorpId =
    user?.role == 'CORPORATEADMIN'
      ? user?.userList?.profileId
      : user?.userList?.corporateId;
  useEffect(() => {
    fetchSiteOffice();
    getShiftList();
    // getDeptList();
  }, []);

  useEffect(() => {
    getDeptList();
  }, []);

  const handleChange = async (values) => {
    if (values?.businessUnitId) {
      getDesignation(values?.businessUnitId?.value);
    }
  };

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
              name: e?.departmentName,
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
    async function getspecial() {
      axios
        .get(api.specialEmployee.getall)
        .then((res) => {
          let temp = [];
          if (res?.data?.data?.length) {
            res?.data?.data?.map((e) => {
              temp.push({
                title: e.categoryName,
                value: e.id,
                name: e.categoryName,
              });
            });
          }
          setSpecial(temp);
        })
        .catch((err) => {
          setSpecial([]);
        });
    }
    getspecial();
  }, []);

  async function getShiftList() {
    axios.get(`${api.dropdown.shiftmanagement}`).then((response) => {
      let temp = [];
      response?.data?.data
        ?.map((e) => {
          temp.push({
            title: e.shiftName + '(' + e.shiftStart + '-' + e.shiftEnd + ')',
            value: e.id,
            name: e?.shiftName,
          });
          setshiftList(temp);
        })
        .catch((er) => {
          setshiftList([]);
        });
    });
  }

  useEffect(() => {
    async function fetchData() {
      const baseURL = `${api.employee.changeRequest}/${id}`;
      let response = await axios.get(baseURL);
      let temObj = response?.data?.data;
      temObj.tempdepartmentId = response?.data?.data?.departmentId;

      getDesignation(temObj?.businessUnitId ?? 'NA');
      setData(temObj);
    }
    fetchData();
  }, [id]);

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
    async function getBusinessUnit() {
      axios
        .get(`${api.businessUnit.list}`)
        .then((res) => {
          let temp = [];
          res?.data?.data?.map((e) => {
            temp.push({title: e.name, value: e.id, name: e?.name});
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
    axios
      .get(`${Api.businessUnit.getbyId}/${buId}`)
      .then((res) => {
        if (temRes) {
          setData(temRes);
        }
        res?.data?.data?.designationList?.map((e) => {
          temp.push({
            title: e.designationName,
            value: e.id,
            name: e?.designationName,
          });
          setDesignation(temp ?? []);
        });
      })
      .catch((er) => {
        setData(temRes ?? []);
        setDesignation([]);
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
                name: e?.categoryType,
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
        setOfcList(temp);
      })
      .catch((err) => {
        setOfcList([]);
      });
  }

  useEffect(() => {
    let url = `${Api.baseUri}/user-reg/nodal-point/getall`;
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
  }, [user?.userList?.tanentId]);

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

  let stepperTemplate = {
    title: 'View and Update',
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
                  disabled: true,
                  infoMessage: [
                    'Only alphabets are allowed.',
                    'Maximum length should be 50 characters.',
                    'Ex-XYZ.',
                  ],

                  pattern: {
                    value: regex.char50,
                    message:
                      'Please enter valid First name with max 50 characters',
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
                      name: 'lastName',
                      id: 'lastName',
                      title: 'Last Name',
                      disabled: true,
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
                      title: 'Upload Photograph',
                      disabled: true,
                      accept: 'image/*',
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
                            // required: 'This is a mandatory field',
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
                  disabled: true,
                  options: [
                    {title: 'Male', value: 'Male'},
                    {title: 'Female', value: 'Female'},
                    {title: 'Others', value: 'Others'},
                  ],
                  infoMessage: ['Radio button is selectable', 'e.g.: Male'],
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },
                {
                  type: 'text',
                  name: 'emailId',
                  id: 'emailId',
                  title: 'Employee Email Id',
                  disabled: true,
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
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },
                {
                  type: 'text',
                  name: 'employeeCode',
                  id: 'employeeCode',
                  title: 'Employee Code',
                  disabled: true,
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
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },
                {
                  type: 'text',
                  name: 'shortId',
                  id: 'shortId',
                  title: 'Employee Short Id',
                  disabled: true,
                  isUpper: true,
                  infoMessage: [
                    'Alphanumeric characters are allowed',
                    'Maximum length should be 16 characters',
                    'e.g.: BJAJ8595',
                  ],
                  pattern: {
                    value: regex.codeReg16,
                    message:
                      'Please enter valid Employee Code  and below 50 characters',
                  },
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
                  disabled: true,
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
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },
                {
                  type: 'text',
                  name: 'mobileNo',
                  id: 'mobileNo',
                  title: 'Mobile No.',
                  maxChar: 10,
                  isNumber: true,
                  disabled: true,
                  infoMessage: [
                    'Numeric characters are allowed',
                    'Maximum length should be 10 characters',
                    'e.g.: 9058906780',
                  ],
                  pattern: {
                    value: regex.phoneReg,
                    message: 'Please enter valid Mobile No.',
                  },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },
                {
                  type: 'text',
                  name: 'alternateContactNo',
                  id: 'alternateContactNo',
                  title: 'Alternate Number',
                  maxChar: 10,
                  isNumber: true,
                  disabled: true,
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
                // {
                //   type: 'text',
                //   name: 'sitereportTo',
                //   id: 'sitereportTo',
                //   title: 'Site Report to',
                //   pattern: {
                //     value: regex.char50,
                //     message: 'Please enter valid Site and below 50 characters'
                //   },
                //   infoMessage: ["Only Alphabets are allowed", "Maximum length should be 50 characters", "e.g.: XYZ  Branch"],
                // },
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
                  disabled: true,
                  options: [
                    {title: 'yes', value: 'YES'},
                    {title: 'No', value: 'NO'},
                  ],
                  // pattern: {
                  //   value: regex.maxSize30,
                  //   message: 'Please enter alpha-numeric and below 30 characters'
                  // },
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
                  dynamic: {
                    field: 'roasterManagerFlag',
                    value: 'NO',
                  },
                  fields: [
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
                          type: 'text',
                          name: 'tempemailId',
                          id: 'tempemailId',
                          disabled: true,
                          defaultValue: managerEmail,
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
                        },
                        // {
                        //   type: 'button',
                        //   name: 'search',
                        //   id: 'search',
                        //   title: 'Search',
                        //   disabled:true,
                        //   defaultValue: "search",
                        //   dynamic: {
                        //     field: 'roasterManagerFlag',
                        //     value: 'NO'
                        //   },
                        // },
                      ],
                    },
                    {
                      type: 'text',
                      name: 'managerName',
                      id: 'managerName',
                      title: 'Manager Name',
                      infoMessage: [
                        'Only alphabets are allowed.',
                        'Maximum length should be 50 characters.',
                        'Ex-XYZ.',
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
            ,
            {
              type: 'section',
              layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
              fields: [
                {
                  type: 'autocomplete',
                  name: 'businessUnitId',
                  id: 'businessUnitId',
                  title: 'Business Unit',
                  disabled: true,
                  options: businessUnit ?? [],
                  infoMessage: [
                    'Alphanumerics are allowed',
                    'Maximum length should be 30 characters',
                    'e.g.: Software',
                  ],
                  // validationProps: {
                  //   required: 'This is a mandatory field'
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
                  name: 'departmentId',
                  id: 'departmentId',
                  title: 'Department Name',
                  disabled: true,
                  infoMessage: ['Dropdown values are selectable', 'e.g.: KM+'],
                  options: deptList ?? [],
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // },
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
                  disabled: true,
                  infoMessage: [
                    'Dropdown values are selectable',
                    'e.g.: Contractor,regular etc.',
                  ],
                  options: employeeCategory ?? [],
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },

                {
                  type: 'autocomplete',
                  name: 'designationId',
                  id: 'designationId',
                  title: 'Designation',
                  disabled: true,
                  infoMessage: [
                    'Dropdown values are selectable',
                    'Ex-Software.',
                  ],
                  options: designation ?? [],
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },
                {
                  type: 'text',
                  name: 'costCenter',
                  id: 'costcenter',
                  title: 'Cost Center',
                  disabled: true,
                  infoMessage: [
                    'Alphanumeric characters are allowed',
                    'Maximum length should be 100 characters',
                    'e.g.: ABC1234',
                  ],
                  pattern: {
                    value: regex.maxSize100,
                    message:
                      'Please enter alpha-numeric and below 100 characters',
                  },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },
                {
                  type: 'autocomplete',
                  name: 'shiftId',
                  id: 'shiftId',
                  disabled: true,
                  infoMessage: [
                    'Dropdown values are selectable',
                    'e.g.: Morning(09:00-18:00)',
                  ],
                  title: 'Shift',
                  options: shiftList ?? [],
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },
                {
                  type: 'radio',
                  name: 'specificNeedType',
                  id: 'specificNeedType',
                  title: 'Specific Need',
                  disabled: true,
                  infoMessage: ['Radio button is selectable', 'e.g.: Yes'],
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
                  disabled: true,
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
                  disabled: true,
                  infoMessage: [
                    'Dropdown values are selectable',
                    'e.g.: Raj Nagar Branch',
                  ],
                  options: ofcList,
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },
                {
                  type: 'mappl',
                  name: 'pickupLocation',
                  id: 'pickupLocation',
                  title: 'Area, Street, Sector, Village',
                  // distribute: [
                  //   {name: 'temptown', value: 'city'},
                  //   {name: 'tempstate', value: 'state'},
                  //   {name: 'temppincode', value: 'pincode'},
                  // ],
                  // distribute: [ { name: 'temptown', value: 'city' }, { name: 'tempstate', value: 'state' }, { name: 'temppincode', value: 'pincode' }],
                  infoMessage: [
                    'Alphanumeric characters are allowed',
                    'Maximum length should be 100 characters',
                    'e.g.: Noida Sector 48, UP',
                  ],
                  disabled: true,
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },
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
                  type: 'text',
                  name: 'tempaddress',
                  id: 'tempaddress',
                  title: 'Flat, House No., Building, Company, Apartment',
                  disabled: true,
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
                  disabled: true,
                  defaultValue: data?.residenceAddress?.city,
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
                  disabled: true,
                  defaultValue: data?.residenceAddress?.state,
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
                  disabled: true,
                  defaultValue: data?.residenceAddress?.pincode,
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
                  disabled: true,
                  defaultValue: data?.pickupLocation?.locality,
                  infoMessage: [
                    'Numeric characters are allowed',
                    'Maximum length should be 6 characters',
                    'e.g.: 201303 ',
                  ],
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
                  disabled: true,
                  infoMessage: [
                    'Dropdown values are selectable',
                    'Values from added nodal points',
                  ],
                  options: nodalPointList ?? [],
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },
              ],
            },
          ],
        },
      },
    ],
  };
  const handleSubmit = async (values) => {
    console.log('values', values);
    setshowbtn(false);
    if (values.button.toUpperCase() === 'APPROVE') {
      setOpenDialog(true);
      let dataSet = {};
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
        locality: data?.pickupLocation?.locality,
      };

      if (dataSet?.roasterManagerFlag == 'YES') {
        dataSet.managerId = null;
        dataSet.managerName = null;
      }

      console.log('dataSet', dataSet);
      delete dataSet.tempemailId;
      delete dataSet.templocation;
      delete dataSet.tempdepartmentId;
      delete dataSet.templocality;
      if (dataSet.tempaddress) delete dataSet.tempaddress;
      if (dataSet.temptown) delete dataSet.temptown;
      if (dataSet.tempstate) delete dataSet.tempstate;
      if (dataSet.temppincode) delete dataSet.temppincode;
      setBtnName('APPROVE');
      setshowbtn(true);
      setsubVal(dataSet);
    }

    if (values.button.toUpperCase() === 'REJECT') {
      setshowbtn(false);
      setOpenDialog(true);
      let dataSet = {};
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
        locality: data?.pickupLocation?.locality,
      };
      if (dataSet?.roasterManagerFlag == 'YES') {
        dataSet.managerId = null;
        dataSet.managerName = null;
      }
      console.log('dataSet', dataSet);
      delete dataSet?.tempemailId;
      delete dataSet?.templocation;
      delete dataSet?.tempdepartmentId;
      delete dataSet?.tempaddress;
      delete dataSet.tempaddress;
      delete dataSet.temptown;
      delete dataSet.tempstate;
      delete dataSet.temppincode;
      delete dataSet.temphomestation;
      delete dataSet.templocality;
      delete dataSet.temppickupDropNodalPoint;
      delete dataSet.templocality;
      delete dataSet.tempcity;
      delete dataSet.tempdropLocation;
      delete dataSet.temppickupLocation;
      // delete dataSet.tempemailId;
      // delete dataSet.templocation;
      setshowbtn(true);
      setBtnName('REJECT');
      setsubVal(dataSet);
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  function handleDialog(val) {
    setOpenDialog(true);
    let tem = {};
    tem = data;
    delete tem.tempdepartmentId;
    // tem.employeeId = tem?.id;
    tem.updatedBy = user?.role;
    if (
      (val.button == 'No' && btnName == 'REJECT') ||
      (val.button == 'No' && btnName == 'APPROVE')
    ) {
      setOpenDialog(false);
    }
    if (val.button == 'Yes' && btnName == 'APPROVE') {
      axios
        .post(`${api.employee.changeRequest}/approve`, tem)
        .then(function (response) {
          if (response.status == 200) {
            navigate(`/onboardCorporate/employee/employee-listing`);
            toast.success(
              `${
                response?.data?.data?.employeeFullName + `'s`
              } profile update request approved`,
            );
            close();
          } else {
            toast.error(response?.data?.message ?? 'Something went wrong');
          }
          setshowbtn(true);
        })
        .catch(function (response) {
          toast.error(response?.data?.message ?? 'Something went wrong');
          setshowbtn(true);
        });
    }

    if (val.button == 'Yes' && btnName == 'REJECT') {
      axios
        .post(`${api.employee.changeRequest}/reject`, tem)
        .then(function (response) {
          if (response.status == 200) {
            navigate(`/onboardCorporate/employee/employee-listing`);
            toast.success(
              `${
                response?.data?.data?.employeeFullName + `'s`
              } profile update request rejected`,
            );
            close();
          } else {
            toast.error(response?.data?.message ?? 'Something went wrong');
          }
          setshowbtn(true);
        })
        .catch(function (response) {
          toast.error(response?.data?.message ?? 'Something went wrong');
          setshowbtn(true);
        });
    }
    setOpenDialog(false);
  }

  function myGetData(d) {
    if (d?.tempemailId?.length !== 0) {
      let employee = {
        emailId: d?.tempemailId,
        roasterManagerFlag: 'YES',
      };
      axios
        .post(Api?.employee?.byEmployeeCode, employee)
        .then((r) => {
          if (r?.data) {
            setManagerId(r?.data?.data[0]?.managerId);
            setManagerName(r?.data?.data[0]?.managerName);
          } else {
            setManagerId(null);
            setManagerName(null);
          }
        })
        .catch((er) => {
          setManagerId('NA');
          setManagerName('NA');
        });
    }
  }

  function SecretFun(search, value) {
    if (search?.toUpperCase() == 'SEARCH') {
      myGetData(value);
    } else return;
  }

  return (
    <>
      {!showbtn ? <AppLoader /> : null}
      {data &&
        data.id &&
        ofcList &&
        shiftList &&
        deptList &&
        businessUnit &&
        designation && (
          <Steppers
            defaultValues={data}
            template={stepperTemplate}
            // watchFields={['firstname', 'include_portfolio', 'email', 'country']}
            // getOnInput={myGetData}
            setVal={[
              {name: 'managerId', value: managerId},
              {name: 'managerName', value: managerName},
              // {name: "departmentId", value: data?.departmentId},
              {name: 'tempaddress', value: data?.residenceAddress?.addressName},
              {name: 'temptown', value: data?.residenceAddress?.city},
              {name: 'tempstate', value: data?.residenceAddress?.state},
              {name: 'temppincode', value: data?.residenceAddress?.pinCode},
              {name: 'tempdepartmentId', value: [data?.departmentId]},
              {name: 'tempemailId', value: managerEmail},
            ]}
            // showbtn={showbtn}
            // validate={validate}getDesignation
            SecretFun={SecretFun}
            onChange={handleChange}
            afterSubmit={handleSubmit}
            buttons={['approve', 'reject']}
            icons={{
              1: <PersonIcon />,
              2: <ManageAccountsIcon />,
              3: <RouteIcon />,
            }}
          />
        )}
      <Dialog
        onClose={handleClose}
        open={openDialog}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogContent style={{width: '500px'}}>
          <p>Are you sure, you want to confirm?</p>
          <SmartForm
            template={Dilaogtemplate}
            onCancel={handleClose}
            buttons={['Yes', 'cancel']}
            onSubmit={handleDialog}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PendingForm;
