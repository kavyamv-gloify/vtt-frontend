import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuthUser} from '@crema/utility/AuthHooks';
import regex from '@regex';
import axios from 'axios';
import api from '@api';
import {getFormData} from '@hoc';
import {toast} from 'react-toastify';
import Api from '@api';
import PopEdit from '@editpopup';

const EmpolyeeEditForm = ({id, popBTNClick, openDialog, domain}) => {
  const navigate = useNavigate();
  const {user} = useAuthUser();
  const [showbtn, setshowbtn] = React.useState(true);
  const [ofcList, setOfcList] = React.useState(null);
  const [managerId, setManagerId] = React.useState();
  const [managerName, setManagerName] = React.useState();
  const [deptList, setdeptList] = React.useState(null);
  const [shiftList, setshiftList] = React.useState(null);
  const [special, setSpecial] = React.useState();
  const [nodalPointList, setNodalPointList] = React.useState([]);
  const [nodalPointData, setNodalPointdata] = React.useState([]);
  const [nodalPointId, setNodalPointId] = React.useState('');
  const [businessUnit, setBusinessUnit] = useState();
  const [designationList, setDesignationList] = useState([]);
  const [employeeCategory, setEmployeCategory] = useState();
  const [data, setData] = useState();
  const [managerEmail, setManagerEmail] = useState();
  const [managerData, setManagerData] = useState();
  const [mobileExists, setMobileExists] = useState(false);
  const [mobileNo, setMobileNo] = useState();
  const [email, setEmail] = useState();
  const [empSetting, setEmpSetting] = useState();
  const [emailExists, setEmailExists] = useState(false);
  const CorpId =
    user?.role == 'CORPORATEADMIN'
      ? user?.userList?.profileId
      : user?.userList?.corporateId;
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
  }, []);

  useEffect(() => {
    async function fetchData() {
      const baseURL = `${api.employee.list}/${id}`;
      axios
        .get(`${baseURL}`)
        .then((response) => {
          let temObj = response?.data?.data;
          temObj.tempaddress = temObj?.residenceAddress?.addressName;
          temObj.temptown = temObj?.residenceAddress?.city;
          temObj.tempstate = temObj?.residenceAddress?.state;
          temObj.temppincode = temObj?.residenceAddress?.pinCode;
          temObj.templocality = temObj?.pickupLocation?.locality;
          setData(temObj);
          setManagerData({
            id: temObj?.managerId,
            employeeFullName: temObj?.managerName,
            department: temObj?.department,
            departmentId: temObj?.departmentId,
            businessUnit: temObj?.businessUnit,
            businessUnitId: temObj?.businessUnitId,
          });
          getDesignation(temObj?.businessUnitId);
          getShiftList(temObj?.departmentId);
        })
        .catch((err) => {
          setData([]);
        });
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

  async function getDesignation(buId) {
    let temp = [];
    setDesignationList([]);
    axios
      .get(`${Api.businessUnit.getbyId}/${buId}`)
      .then((res) => {
        res?.data?.data?.designationList?.map((e) => {
          temp.push({
            title: e.designationName,
            value: e.id,
            name: e?.designationName,
          });
        });
        setDesignationList(temp ?? []);
      })
      .catch((er) => {
        setDesignationList([]);
      });
  }

  async function getShiftList(deptname) {
    const baseURL = `${api.manageshifts.list}/${CorpId}/corporateid/${deptname}/departmentid`;

    try {
      const response = await axios.get(`${baseURL}`);
      let temp = [];

      response?.data?.data?.map((e) => {
        temp.push({
          title: e.shiftName + '(' + e.shiftStart + '-' + e.shiftEnd + ')',
          value: e.id,
          name: e.shiftName,
        });
      });

      setshiftList(temp);
    } catch (error) {
      console.error('Error fetching shift list:', error);
      setshiftList([]);
    }
  }

  useEffect(() => {
    if (!user?.userList?.profileId) {
      return;
    }
    fetchSiteOffice();
    getShiftList();
    getspecial();
  }, [user?.userList?.profileId]);

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
              name: e?.categoryName,
            });
          });
        }
        setSpecial(temp);
      })
      .catch((err) => {
        setSpecial([]);
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
            temp.push({
              title: e.officeName,
              value: e?.id,
              officeName: e?.officeName,
            });
          });
        }
        setOfcList(temp);
      });
  }

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
        title: 'Route Details',
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
                  type: 'section',
                  layout: {
                    column: 3,
                    spacing: 2,
                    size: 'medium',
                    label: 'fixed',
                  },
                  sectionName: 'registrationname',
                  sectiontitle: 'Name and photo',
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
                          'Please enter valid First name with max 50 characters',
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
                          'Please enter valid Last name with max 50 characters',
                      },
                      // validationProps: {
                      //   required: 'This is a mandatory field'
                      // }
                    },
                    {
                      type: 'file',
                      name: 'photo',
                      id: 'photo',
                      // isProfile: true,
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
                  type: 'section',
                  layout: {
                    column: 1,
                    spacing: 2,
                    size: 'medium',
                    label: 'fixed',
                  },
                  sectionName: 'emailId',
                  sectiontitle: 'Email Id',
                  fields: [
                    {
                      type: 'text',
                      name: 'emailId',
                      id: 'emailId',
                      title: 'Employee Email Id',
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
                      defaultValue: domain,
                    },
                  ],
                },
                {
                  type:
                    user?.userList?.userRole !== 'SUPERADMIN'
                      ? 'hidden'
                      : 'text',
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
                      'Please enter valid Employee Code  and below 50 characters',
                  },
                  // validationProps: {
                  //   required: 'This is a mandatory field',
                  // },
                },
                // {
                //   type: 'text',
                //   name: 'employeeCode',
                //   id: 'employeeCode',
                //   title: 'Employee Code',
                //   disabled: true,
                //   // pattern: {
                //   //   value: regex.codeReg,
                //   //   message: 'Please enter valid Employee Code  and below 50 characters'
                //   // },
                //   // validationProps: {
                //   //   required: 'This is a mandatory field'
                //   // }
                // },

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
                    column: 3,
                    spacing: 2,
                    size: 'medium',
                    label: 'fixed',
                  },
                  sectionName: 'contactDetail',
                  sectiontitle: 'Contact Detail',
                  fields: [
                    {
                      type: 'text',
                      name: 'mobileNo',
                      id: 'mobileNo',
                      title: 'Mobile No.',
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
                      pattern: {
                        value: regex.phoneReg,
                        message: 'Please enter valid Alternate Number',
                      },
                      validationProps: {
                        manual: [
                          {
                            condition: `mobileNo !== alternateContactNo`,
                            message:
                              'mobile and alternate number should be different',
                          },
                        ],
                      },
                    },
                  ],
                },

                {
                  type: 'section',
                  layout: {
                    column: 1,
                    spacing: 2,
                    size: 'medium',
                    label: 'fixed',
                  },
                  sectionName: 'changeManager',
                  sectiontitle: 'Change Manager',
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
                          type: 'radio',
                          name: 'roasterManagerFlag',
                          id: 'roasterManagerFlag',
                          title: 'Roster Manager',
                          options: [
                            {title: 'Yes', value: 'YES'},
                            {title: 'No', value: 'NO'},
                          ],
                          validationProps: {
                            required: 'This is a mandatory field',
                          },
                        },
                      ],
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
                              title: "Manager's Email Id / Emp. Code",
                              pattern: {
                                value: regex.emailReg,
                                message:
                                  "Please enter valid Manager's Email Id",
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
                              type: 'autocomplete',
                              name: 'businessUnitId',
                              id: 'businessUnitId',
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
                              name: 'departmentId',
                              id: 'departmentId',
                              title: 'Department Name',
                              infoMessage: [
                                'Dropdown values are selectable',
                                'e.g.: KM+',
                              ],
                              options: deptList ?? [],
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
                              defaultValue: data?.businessUnit,
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
                              infoMessage: [
                                'Dropdown values are selectable',
                                'e.g.: KM+',
                              ],
                              dynamic: {
                                field: 'roasterManagerFlag',
                                value: 'NO',
                              },
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },

                {
                  type: 'autocomplete',
                  name: 'employeeCategoryId',
                  id: 'employeeCategoryId',
                  title: 'Employee Category',
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
                  options: designationList ?? [],
                  pattern: {
                    value: regex.char30,
                    message:
                      'Please enter valid Designation and below 30 characters',
                  },
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
                // {
                //   type: 'autocomplete',
                //   name: 'departmentId',
                //   id: 'departmentId',
                //   title: 'Department Name',
                //   options: deptList ?? [],
                //   // multiple: true,
                //   // pattern: {
                //   //   value: regex.maxSize50,
                //   //   message: 'Please enter alpha-numeric and below 50 characters'
                //   // },
                //   validationProps: {
                //     required: 'This is a mandatory field'
                //   }
                // },
                // {
                //   type: 'autocomplete',
                //   name: 'shiftType',
                //   id: 'shiftType',
                //   title: 'Shift Type',
                //   options: shifttype ?? [],
                //   // [{ title: "Weekly", value: "weekly" },
                //   // { title: "Monthly", value: "monthly" },
                //   // { title: "Fortnight", value: "fortnight" }
                //   // ],
                //   validationProps: {
                //     required: 'This is a mandatory field'
                //   }
                // },
                {
                  type: 'autocomplete',
                  name: 'shiftId',
                  // multiple: true,
                  id: 'shiftId',
                  title: 'Shift',
                  options: shiftList ?? [],
                },
                {
                  type: 'section',
                  layout: {
                    column: 2,
                    spacing: 2,
                    size: 'medium',
                    label: 'fixed',
                  },
                  sectionName: 'specificNeed',
                  sectiontitle: 'Specific Need',
                  fields: [
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
                      title: 'Special Employee Type',
                      options: special ?? [],
                      dynamic: {
                        field: 'specificNeedType',
                        value: 'Yes',
                      },
                      validationProps: {
                        required: 'This is a mandatory field',
                      },
                    },
                  ],
                },
                {
                  type: 'hidden',
                  name: 'companyName',
                  id: 'companyName',
                  title: 'Company Name',
                  defaultValue: user?.userList?.corporateName,
                  // pattern: {
                  //   value: regex.onlyChar,
                  //   message: 'Please enter alpha-characters and below 50 characters'
                  // },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
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
                {
                  type: 'autocomplete',
                  name: 'officeId',
                  id: 'officeId',
                  title: 'Site Office',
                  options: ofcList ?? [],
                  // pattern: {
                  //   value: regex.maxSize50,
                  //   message: 'Please enter alpha-numeric and below 50 characters'
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
                  sectionName: 'officeLocation',
                  sectiontitle: 'Pick Up Location',
                  fields: [
                    {
                      type: 'mappl',
                      name: 'pickupLocation',
                      id: 'pickupLocation',
                      title: 'Area, Street, Sector, Village',
                      distribute: [
                        {name: 'temptown', value: 'city'},
                        {name: 'tempstate', value: 'state'},
                        {name: 'temppincode', value: 'pincode'},
                      ],
                      infoMessage: [
                        'Alphanumeric characters are allowed',
                        'Maximum length should be 50  characters',
                        'e.g.: Noida Sector 48, UP ',
                      ],
                      // validationProps: {
                      //     required: 'This is a mandatory field'
                      // },
                      // pattern: {
                      //     value: regex.maxSize50,
                      //     message: 'Please enter alpha-numeric and below 50 characters'
                      // },
                    },
                    {
                      type: 'text',
                      name: 'tempaddress',
                      id: 'tempaddress',
                      title: 'Flat, House No., Building, Company, Apartment',
                      defaultValue: data?.tempaddress,
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
                      defaultValue: data?.temptown,
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
                      defaultValue: data?.tempstate,
                      infoMessage: [
                        'Alphabetics characters are allowed',
                        'Maximum length should be 50 characters',
                        'e.g.: Uttar Pradesh ',
                      ],
                      pattern: {
                        value: regex.adreesschar50,
                        message:
                          'Please enter valid State with max 50 characters',
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
                      // pattern: {
                      //   value: regex.pincodeRegex,
                      //   message: 'Please enter valid Pincode',
                      // },
                    },
                  ],
                },

                {
                  type: 'select',
                  name: 'nodalPointId',
                  id: 'nodalPointId',
                  title: 'Nodal Point',
                  infoMessage: [
                    'Dropdown values are selectable',
                    'Values from added nodal points',
                  ],
                  options: nodalPointList ?? [],
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },
                // {
                //   type: 'select',
                //   name: 'pickupDropNodalPoint',
                //   id: 'pickupDropNodalPoint',
                //   title: 'Nodal Point',
                //   infoMessage: [
                //     'Dropdown values are selectable',
                //     'Values from added nodal points',
                //   ],
                //   options: nodalPointList ?? [],
                //   // validationProps: {
                //   //   // required: 'This is a mandatory field'
                //   // }
                // },
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
    if (values?.close) {
      popBTNClick(false);
      return;
    }
    setshowbtn(false);
    let tempList = nodalPointData.filter(
      (d) => d.id == values?.data?.nodalPointId,
    );
    console.log('tempList', tempList);
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
      (values.data.nodalPoint = values?.data?.pickupDropNodalPoint);
    if (values.button.toUpperCase() === 'UPDATE') {
      let dataSet = {};
      let tem = {};
      let allElem = {};
      dataSet = values.data;

      dataSet.residenceAddress = {
        pinCode: values?.data?.temppincode ?? data?.residenceAddress?.pinCode,
        state: values?.data?.tempstate ?? data?.residenceAddress?.state,
        city: values?.data?.temptown ?? data?.residenceAddress?.city,
        addressName:
          values?.data?.tempaddress ?? data?.residenceAddress?.addressName,
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
      delete dataSet?.tempdomain;
      ofcList?.map((man) => {
        if (man?.value == dataSet.officeId) {
          dataSet.officeName = man?.officeName;
        }
      });
      deptList?.map((man) => {
        if (man?.value == dataSet.departmentId) {
          dataSet.department = man?.name;
        }
      });
      businessUnit?.map((e) => {
        if (e?.value == dataSet.businessUnitId) {
          dataSet.businessUnit = e?.name;
        }
      });
      designationList?.map((e) => {
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
      console.log('dataSet', dataSet);

      delete dataSet.tempaddress;
      delete dataSet.temptown;
      delete dataSet.tempstate;
      delete dataSet.temppincode;
      delete dataSet.temphomestation;
      delete dataSet.temppickupDropNodalPoint;
      delete dataSet.templocality;
      delete dataSet.tempcity;
      delete dataSet.tempdropLocation;
      delete dataSet.temppickupLocation;
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
            toast.success(
              `${
                response?.data?.data?.employeeFullName + `'s`
              } profile updated successfully`,
            );
            popBTNClick(false);
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

  function myGetData(d) {
    if (d?.tempemailId?.length !== 0) {
      let employee = {
        key: d?.tempemailId,
        roasterManagerFlag: 'YES',
      };
      setManagerEmail(d?.tempemailId);
      axios
        .post(api?.employee?.byEmployeeCode, employee)
        .then((r) => {
          if (r?.data?.data?.roasterManagerFlag == 'YES') {
            setManagerData(r?.data?.data);
            setManagerId(r?.data?.data?.id);
            setManagerName(r?.data?.data?.employeeFullName);

            getDeptList(r?.data?.data?.businessUnitId);
            getShiftList(r?.data?.data?.departmentId);
          } else {
            setManagerId('NA');
            setManagerName('NA');
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
      {data && data.id && (
        <>
          <PopEdit
            title={data?.firstName + ' ' + data?.lastName}
            defaultValues={data}
            template={stepperTemplate}
            openDialog={openDialog}
            getOnInput={getOnInput}
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
            setVal={[
              {name: 'tempaddress', value: data?.tempaddress},
              {name: 'temptown', value: data?.temptown},
              {name: 'tempstate', value: data?.tempstate},
              {name: 'temppincode', value: data?.temppincode},
              {name: 'managerId', value: managerId},
              {name: 'managerName', value: managerName},
              {name: 'department', value: managerData?.department || 'NA'},
              {name: 'departmentId', value: managerData?.departmentId || ''},
              {name: 'businessUnit', value: managerData?.businessUnit || 'NA'},
              {
                name: 'businessUnitId',
                value: managerData?.businessUnitId || '',
              },
              // { name: "tempemailId", value: managerEmail || '' },
            ]}
            clearErr={[
              {
                name: 'managerName',
                value: managerData?.employeeFullName && managerData != 'NA',
              },
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
                name: 'managerName',
                type: 'customized',
                message: "Please enter manager's details.",
                error: managerData == 'NA',
              },
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
            showbtn={showbtn}
            popAction={handleSubmit}
            SecretFun={SecretFun}
            oldFormType={'STEPPER'}
          />
        </>
      )}
    </>
  );
};

export default EmpolyeeEditForm;
