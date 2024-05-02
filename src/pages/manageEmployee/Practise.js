/* eslint-disable */
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Steppers from '@smart-form/stepper';
import SmartForm from '@smart-form';
import {useAuthUser} from '@crema/utility/AuthHooks';
import regex from '@regex';
import axios from 'axios';
import api from '@api';
import {getFormData} from '@hoc';
import {toast} from 'react-toastify';
import AppLoader from '@crema/core/AppLoader';
import {values} from 'lodash';
import PersonIcon from '@mui/icons-material/Person';
import RouteIcon from '@mui/icons-material/Route';
import Api from '@api';

const EmpolyeeForm = ({close}) => {
  const navigate = useNavigate();
  const {user} = useAuthUser();
  const [ofcList, setOfcList] = React.useState([]);
  const [deptList, setdeptList] = React.useState([]);
  const [shiftList, setshiftList] = React.useState([]);
  const [nodalPointList, setNodalPointList] = React.useState([]);
  const [nodalPointData, setNodalPointdata] = React.useState([]);
  const [managerId, setManagerId] = React.useState();
  const [managerName, setManagerName] = React.useState();
  const [showbtn, setshowbtn] = React.useState(true);
  const [special, setSpecial] = React.useState();
  const [temppickupDropNodalPointGeoVal, setTemppickupDropNodalPointGeoVal] =
    React.useState({});
  const [nodalPointId, setNodalPointId] = React.useState('');
  const [shifttype, setShiftType] = useState([]);

  let profileId = user?.userList?.profileId;
  useEffect(() => {
    let url = `${Api.nodalpoint.nodalpointapi}/${user?.userList?.tanentId}/tenant/ACTIVE/status?page=0&size=1000`;
    axios.get(url).then((response) => {
      if (response?.data?.status == '200') {
        setNodalPointdata(response?.data?.data?.body?.NodalPointList);
        let tempval = [];
        response?.data?.data?.body?.NodalPointList?.map((e) => {
          tempval.push({title: e?.geoPoint?.locName, value: e.id});
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
    getShiftList();
    getDeptList();
    getspecial();
  }, [profileId]);

  async function getspecial() {
    let res = await axios.get(api.specialEmployee.getall);
    let temp = [];
    if (res?.data?.data?.length) {
      res?.data?.data?.map((e) => {
        temp.push({title: e.categoryName, value: e.id});
      });
    }
    setSpecial(temp);
  }
  async function getDeptList() {
    await axios
      .get(`${api?.dropdown?.department}`)
      .then((res) => {
        let temp = [];

        if (res?.data?.length) {
          res?.data?.map((e) => {
            temp.push({title: e.departmentName, value: e.id});
          });
        }
        setdeptList(temp);
      })
      .catch((er) => {
        setdeptList([]);
      });
  }

  async function getShiftList() {
    await axios.get(`${api.dropdown.shiftmanagement}`).then((response) => {
      let temp = [];
      response?.data?.data
        ?.map((e) => {
          temp.push({
            title: e.shiftName + '(' + e.shiftStart + '-' + e.shiftEnd + ')',
            value: e.id,
          });
          setshiftList(temp);
        })
        .catch((er) => {
          setshiftList([]);
        });
    });
  }

  async function fetchSiteOffice() {
    let res = await axios.get(
      `${api.siteOffice.list}/corporate?page=0&size=10&officeName=null`,
    );
    let temp = [];
    if (res?.data?.data?.body?.['SiteOffice List'].length) {
      res?.data?.data?.body?.['SiteOffice List']?.map((e) => {
        temp.push({title: e.officeName, value: e});
        //
      });
    }
    setOfcList(temp);
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
              layout: {column: 4, spacing: 2, size: 'medium', label: 'fixed'},
              fields: [
                {
                  type: 'radio',
                  name: 'roasterManagerFlag',
                  id: 'roasterManagerFlag',
                  title: 'Roaster Manager',
                  options: [
                    {title: 'yes', value: 'YES'},
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
              ],
            },

            {
              type: 'section',
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
                      name: 'tempemailId',
                      id: 'tempemailId',
                      title: "Manager's Email Id",
                      pattern: {
                        value: regex.emailReg,
                        message: "Please enter valid Manager's Email Id",
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
                  },
                },
                {
                  type: 'text',
                  name: 'employeeCode',
                  id: 'employeeCode',
                  title: 'Employee Code',
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
                  type: 'date',
                  name: 'dOJ',
                  id: 'dOJ',
                  title: 'Date of Joining',
                  max: 'today',
                  infoMessage: [
                    'Date is selectable from calendar',
                    'Date can be entered in DD-MM-YY Format',
                    'e.g.: 07-04-1992',
                  ],
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },
                {
                  type: 'autocomplete',
                  name: 'employeeCategory',
                  id: 'employeeCategory',
                  title: 'Employee Category',
                  infoMessage: [
                    'Dropdown values are selectable',
                    'e.g.: Contractor,regular etc.',
                  ],
                  options: [
                    {title: 'Contractor', value: 'contractor'},
                    {title: 'Regular', value: 'regular'},
                  ],
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
                      name: 'tempdepartmentId',
                      id: 'tempdepartmentId',
                      title: 'Department Name',
                      infoMessage: [
                        'Dropdown values are selectable',
                        'e.g.: KM+',
                      ],
                      options: deptList,
                      validationProps: {
                        required: 'This is a mandatory field',
                      },
                    },
                    // {
                    //   type: 'button',
                    //   name: 'department',
                    //   id: 'department',
                    //   title: 'Add Department',
                    //   defaultValue: "department",
                    // },
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
                      type: 'autocomplete',
                      name: 'shiftType',
                      id: 'shiftType',
                      title: 'Shift Type',
                      infoMessage: [
                        'Dropdown values are selectable',
                        'e.g.:Weekly',
                      ],
                      options: shifttype ?? [],
                      validationProps: {
                        required: 'This is a mandatory field',
                      },
                    },
                    // {
                    //   type: 'button',
                    //   name: 'shifttype',
                    //   id: 'shifttype',
                    //   title: 'Add ShiftType',
                    //   defaultValue: "shifttype",
                    // },
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
                    // {
                    //   type: 'button',
                    //   name: 'shift',
                    //   id: 'shift',
                    //   title: 'Add Shift',
                    //   defaultValue: "shift",
                    // },
                  ],
                },

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
                  infoMessage: [
                    'Numeric characters are allowed',
                    'Maximum length should be 10 characters',
                    'e.g.: 9058906780',
                  ],
                  pattern: {
                    value: regex.phoneReg,
                    message: 'Please enter valid Alternate Number',
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
                  defaultValue: user?.userList?.profileId,
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
                  type: 'text',
                  name: 'tempaddress',
                  id: 'tempaddress',
                  title: 'Flat, House No., Building, Apartment',
                  infoMessage: [
                    'Alphanumeric characters are allowed',
                    'Maximum length should be 100 characters',
                    'e.g.: Noida Sector 48, UP',
                  ],
                  pattern: {
                    value: regex.addressReg,
                    message:
                      'Please enter valid building No, street with max 100 characters ',
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
                  title: 'Town/City(Residence)',
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
                  type: 'autocomplete',
                  name: 'officeId',
                  id: 'officeId',
                  title: 'Office Name',
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
                  type: 'text',
                  name: 'sitereportTo',
                  id: 'sitereportTo',
                  title: 'Site Report to',
                  pattern: {
                    value: regex.char50,
                    message: 'Please enter valid Site and below 50 characters',
                  },
                  infoMessage: [
                    'Only Alphabets are allowed',
                    'Maximum length should be 50 characters',
                    'e.g.: XYZ  Branch',
                  ],
                },

                {
                  type: 'text',
                  name: 'designation',
                  id: 'designation',
                  title: 'Designation',
                  pattern: {
                    value: regex.char30,
                    message:
                      'Please enter valid Designation and below 30 characters',
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
        title: 'Route Details',
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
                  type: 'mappl',
                  name: 'pickupLocation',
                  id: 'pickupLocation',
                  title: 'Pick Up Location',
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
                  type: 'mappl',
                  name: 'dropLocation',
                  id: 'dropLocation',
                  title: 'Drop Location',
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
                  name: 'defaultRouteNumber',
                  id: 'defaultRouteNumber',
                  title: 'Default Route Number',
                  infoMessage: [
                    'Alphanumeric characters are allowed',
                    'Maximum length should be 30 characters',
                    'e.g.: 454R',
                  ],
                  pattern: {
                    value: regex.maxSize30,
                    message:
                      'Please enter valid Default Route Number with max 30 characters ',
                  },
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },
                {
                  type: 'text',
                  name: 'defaulteLogoutRouteNumber',
                  id: 'defaulteLogoutRouteNumber',
                  title: 'Default Logout Route Number',
                  infoMessage: [
                    'Alphanumeric characters are allowed',
                    'Maximum length should be 30 characters',
                    'e.g.: 454R',
                  ],
                  pattern: {
                    value: regex.maxSize30,
                    message:
                      'Please enter valid Default Logout Route Number with max 30 characters ',
                  },
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },

                {
                  type: 'autocomplete',
                  name: 'specialEmployee',
                  id: 'specialEmployee',
                  title: 'Special Employee',
                  options: special ?? [],
                  infoMessage: [
                    'Dropdown values are selectable',
                    'e.g.: Blind',
                  ],
                },
                {
                  type: 'radio',
                  name: 'boardingVerification',
                  id: 'boardingVerification',
                  title: 'Boarding Verification',
                  infoMessage: ['Radio button is selectable', 'e.g.: Yes'],
                  options: [
                    {title: 'Yes', value: 'Yes'},
                    {title: 'No', value: 'No'},
                  ],
                },
                {
                  type: 'date',
                  name: 'requirementStartDate',
                  id: 'requirementStartDate',
                  title: 'Requirement Start Date',
                  infoMessage: [
                    'Date is selectable from calendar',
                    'Date can be entered in DD-MM-YY Format',
                    'e.g.: 07-04-1992',
                  ],
                },
                {
                  type: 'date',
                  name: 'requirementEndDate',
                  id: 'requirementEndDate',
                  title: 'Requirement End Date',
                  validationProps: {
                    // required: 'This is a mandatory field',
                    validate: [
                      {
                        condition: 'requirementStartDate < requirementEndDate',
                        message:
                          'From date should not be greater than To date.',
                      },
                    ],
                  },
                  infoMessage: [
                    'Date is selectable from calendar',
                    'Date can be entered in DD-MM-YY Format',
                    'e.g.: 07-04-1992',
                  ],
                },
                {
                  type: 'text',
                  name: 'businessUnit',
                  id: 'businessUnit',
                  title: 'Business Unit  ',
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
                },
                {
                  type: 'date',
                  name: 'serviceStartDate',
                  id: 'serviceStartDate',
                  title: 'Service Start Date',
                  infoMessage: [
                    'Date is selectable from calendar',
                    'Date can be entered in DD-MM-YY Format',
                    'e.g.: 07-04-1992',
                  ],
                },
                {
                  type: 'date',
                  name: 'serviceEndDate',
                  id: 'serviceEndDate',
                  title: 'Service End Date',
                  validationProps: {
                    // required: 'This is a mandatory field',
                    validate: [
                      {
                        condition: 'serviceStartDate < serviceEndDate',
                        message:
                          'From date should not be greater than To date.',
                      },
                    ],
                  },
                  infoMessage: [
                    'Date is selectable from calendar',
                    'Date can be entered in DD-MM-YY Format',
                    'e.g.: 07-04-1992',
                  ],
                },
                {
                  type: 'mappl',
                  name: 'homeStation',
                  id: 'homeStation',
                  title: 'Home Station',
                  infoMessage: [
                    'Alphanumeric characters are allowed',
                    'Maximum length should be 100 characters',
                    'e.g.: Noida Sector 48, UP ',
                  ],
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },
                {
                  type: 'select',
                  name: 'pickupDropNodalPoint',
                  id: 'pickupDropNodalPoint',
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

                {
                  type: 'mappl',
                  name: 'locality',
                  id: 'locality',
                  title: 'Locality',
                  infoMessage: [
                    'Alphanumeric characters are allowed',
                    'Maximum length should be 100 characters',
                    'e.g.: Noida Sector 48, UP ',
                  ],
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },
                {
                  type: 'mappl',
                  name: 'location', //tempcity
                  id: 'location', //tempcity
                  title: 'Zone/City',
                  infoMessage: [
                    'Alphanumeric characters are allowed',
                    'Maximum length should be 100 characters',
                    'e.g.: Noida  ',
                  ],
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },
                {
                  type: 'radio',
                  name: 'isGeoVerified',
                  id: 'isGeoVerified',
                  title: 'Is Geo Verified',
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                  infoMessage: ['Radio button is selectable', 'e.g.: Yes'],
                  options: [
                    {title: 'Yes', value: 'yes'},
                    {title: 'No', value: 'No'},
                  ],
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
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
                //   type: 'text',
                //   name: 'employeeTA',
                //   id: 'employeeTA',
                //   title: 'Employee TA',

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
    setshowbtn(false);

    //
    if (values.button.toUpperCase() === 'SUBMIT') {
      let dataSet = {};
      let allElem = {};
      let tem = {};
      dataSet = values.data;

      let ides = [];
      // dataSet.tempdepartmentId?.map((e) => {
      //
      //   ides.push(e?.value)
      // })
      ides.push(dataSet.tempdepartmentId);

      dataSet.departmentId = ides;

      // dataSet.location = {
      //   "locName": values?.data?.templocation?.area,
      //   "latitude": values?.data?.templocation?.mapPosition?.lat,
      //   "longitude": values?.data?.templocation?.mapPosition?.lng
      // }

      (dataSet.residenceAddress = {
        pinCode: values?.data?.temppincode,
        state: values?.data?.tempstate,
        city: values?.data?.temptown,
        addressName: values?.data?.tempaddress,
      }),
        (dataSet.profileStatus = 'DEFAULT');

      //
      dataSet.officeName = values.data?.officeId.officeName;
      dataSet.officeId = values.data?.officeId.id;
      dataSet['nodalPointId'] = nodalPointId;
      dataSet['nodalPoint'] = temppickupDropNodalPointGeoVal;
      dataSet.pickupDropNodalPoint = temppickupDropNodalPointGeoVal;
      dataSet.dropLocation = values?.data?.dropLocation;
      dataSet.homeStation = values?.data?.homeStation;
      dataSet.locality = values?.data?.locality;
      dataSet.location = values?.data?.location;

      //

      if (!dataSet?.photo?.length) delete dataSet?.photo;
      delete dataSet?.tempemailId;
      delete dataSet?.templocation;
      delete dataSet?.tempdepartmentId;
      delete dataSet?.tempaddress;
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
        method: 'post',
        url: Api?.employee?.list,
        data: getFormData(tem),
        headers: {'Content-Type': 'multipart/form-data'},
      })
        .then(function (response) {
          if (response?.data?.status == 200) {
            toast.success('Details has been successfully submitted.');
            navigate(`/onboardCorporate/employee/employee-listing`);
            close(false);
          } else {
            toast.error(response?.data?.message, 'Something went wrong');
          }
          setshowbtn(true);
        })
        .catch(function (err) {
          setshowbtn(true);
          //handle error
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
      axios
        .post(Api?.employee?.byEmployeeCode, employee)
        .then((r) => {
          if (r?.data) {
            setManagerId(r?.data?.data?.id);
            setManagerName(
              r?.data?.data?.firstName + ' ' + r?.data?.data?.lastName,
            );
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
    }
    // if(search?.toUpperCase()=="ADD DEPARTMENT"){

    // }
    else return;
  }

  const handleChange = async (values) => {
    if (values?.pickupDropNodalPoint) {
      setNodalPointId(values?.pickupDropNodalPoint);
      let tempList = nodalPointData.filter(
        (d) => d.id == values?.pickupDropNodalPoint,
      );

      setTemppickupDropNodalPointGeoVal({
        latitude: tempList[0]?.geoPoint?.latitude,
        locName: tempList[0]?.geoPoint?.locName,
        longitude: tempList[0]?.geoPoint?.longitude,
      });
    }
  };

  return (
    <>
      {!showbtn ? <AppLoader /> : null}
      <Steppers
        template={stepperTemplate}
        setVal={[
          {name: 'managerId', value: managerId},
          {name: 'managerName', value: managerName},
        ]}
        showbtn={showbtn}
        SecretFun={SecretFun}
        afterSubmit={handleSubmit}
        onChange={handleChange}
        buttons={['submit']}
        mode='onTouched'
        icons={{1: <PersonIcon />, 2: <RouteIcon />}}
      />
    </>
  );
};

export default EmpolyeeForm;
