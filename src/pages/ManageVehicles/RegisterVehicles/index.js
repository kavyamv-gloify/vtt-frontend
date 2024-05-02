/* eslint-disable */
import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import Steppers from '@smart-form/stepper';
import api from '@api';
import regex from '@regex';
import axios from 'axios';
import {getFormData} from '@hoc';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {toast} from 'react-toastify';
import AppLoader from '@crema/core/AppLoader';
import Api from '@api';
import CommuteIcon from '@mui/icons-material/Commute';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import PersonIcon from '@mui/icons-material/Person';
import EnhancedEncryptionIcon from '@mui/icons-material/EnhancedEncryption';

const RegisterVendor = ({close}) => {
  const navigate = useNavigate();
  const {user} = useAuthUser();
  const [data, setData] = useState();
  const [vehicle, setVehicle] = useState();
  const [occupancy, setOccupancy] = useState();
  const [seat, setSeat] = useState();
  const [vendorId, setVendorId] = useState();
  const [vendorList, setVendorList] = useState();
  const id = user?.userList?.profileId;
  const [vehicleInfo, setVehicleInfo] = useState();
  const [vehicleModel, setVehicleModel] = useState();
  const [vehicleColor, setVehicleColor] = useState();
  const [vehicleBrand, setVehicleBrand] = useState();
  const [vehicleColorId, setVehicleColorId] = useState();
  const [indexOfVehicle, setIndexOfVehicle] = useState();
  const [vehicleColorName, setVehicleColorName] = useState();
  useEffect(() => {
    async function vendorData() {
      const baseURL = `${api.vendor.list}/${id}`;
      let response = await axios.get(`${baseURL}`);
      setVendorId(response.data.data);
    }
    vendorData();
  }, [id]);

  const getVendorList = () => {
    axios
      .get(Api.baseUri + '/user-reg/associatevendor/getallassociatecorporateId')
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
    async function vehicelTypeList() {
      const baseURL =
        Api.baseUri +
        '/user-reg/vehicletype/vehicletypeBytanentId?page=0&vehicleType=null&size=10';
      axios
        .get(`${baseURL}`)
        .then((response) => {
          let temp = [];
          response?.data?.data?.body['VehicleTypeList']?.map((id) => {
            console.log('res', response);
            temp.push({
              title:
                id?.vehicleType +
                '-' +
                id?.vehicleOccupancy +
                '(' +
                id?.vehicleTypeName +
                ')',
              value: id?.id,
              vehicleName: id?.vehicleTypeName,
              id: id?.vehicleTypeNewId,
            });
            setVehicle(temp ?? []);
          });
        })
        .catch((err) => {
          setVehicle([]);
        });
    }
    vehicelTypeList();
  }, []);

  function VehicleModel(id) {
    axios
      .get(
        api.baseUri +
          `/user-reg/vehicle-model/get-vehicleModel-by-vehicleTypeId/${id}`,
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          let temp_vehicleBrand = [];
          let temp_vehicleModel = [];
          let temp_color = [];
          res?.data?.data?.map((el) => {
            temp_vehicleModel?.push({
              title: el?.vehicleModelName,
              value: el?.id,
            });
          });
          setVehicleModel(temp_vehicleModel ?? []);
        }
      })
      .catch((err) => {
        setVehicleModel([]);
      });
  }

  function VehicleBrand(id) {
    let temp_color = [];
    axios
      .get(api.baseUri + `/user-reg/vehicle-model/get-vehicleModel-by-id/${id}`)
      .then((res) => {
        if (res?.data?.status == '200') {
          console.log('resp', res?.data);
          setVehicleBrand(res?.data?.data?.vehicleBrandName);
          // res?.data?.data?.vehicleTypeThemeColor?.map((el) => {
          //   temp_color.push({title: el?.split('(')?.[0], value: el});
          // });
          res?.data?.data?.vehicleTypeThemeColor?.map((el) => {
            temp_color.push({
              title: el?.split(' ')?.[2] + '( ' + el?.split(' ')?.[0] + ' )',
              value: el.split(' ')?.[0],
            });
          });
          console.log('temp_color', temp_color);
          setVehicleColor(temp_color ?? []);
          setVehicleColorId(res?.data?.data?.vehicleTypeThemeId);
        }
      });
  }
  let stepperTemplate = {
    title: 'Register Vehicles Form',
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
        title: 'Vehicles Details',
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
                {
                  type: 'hidden',
                  name: 'tenantName',
                  id: 'tenantName',
                  defaultValue: user?.userList?.tanentName,
                },
                {
                  type: 'autocomplete',
                  name: 'vehicleTypeId',
                  id: 'vehicleTypeId',
                  title: 'Vehicle Type',
                  infoMessage: [
                    'Dropdown values are selectable',
                    'e.g.: Sedan',
                  ],
                  // validationProps: {
                  //   required: 'This is a mandatory field',
                  // },
                  options: vehicle ?? [],
                },
                {
                  type: 'select',
                  name: 'vehicleTypeFormat',
                  id: 'vehicleTypeFormat',
                  title: 'Vehicle Number Format',
                  options: [
                    {title: 'FORMAT 1(ex:KA-01-AA-1234)', value: 'FORMATONE'},
                    {
                      title: 'FORMAT 2(ex:KA-01-1234)',
                      value: 'FORMATTWO',
                    },
                    {title: 'FORMAT 3(ex:21BH2345AA)', value: 'FORMATTHREE'},
                    {title: 'FORMAT 4(ex:KA-13-C-9065)', value: 'FORMATFOUR'},
                    {title: 'FORMAT 5(ex:22BH1234A)', value: 'FORMATFIVE'},
                  ],
                  infoMessage: [
                    'Alpha Numeric Characters are allowed',
                    'Maximum length should be 50',
                    'e.g.: OTA-Penalty1',
                  ],
                },
                {
                  type: 'otptypebox',
                  boxarr: ['', '', '', '', '', '', '', '', '', ''],
                  spaceAfter: [1, 3, 5],
                  minBoxReq: 6,
                  name: 'vehicleNumberPlate',
                  id: 'vehicleNumberPlate',
                  title: 'Vehicle Number ',
                  infoMessage: [
                    'AlphaNumeric characters are allowed',
                    'Maximum characters should be 10 ',
                    'DL-9C-AS-3364',
                  ],
                  placeholder: 'Ex:KA-01-AA-1234',
                  dynamic: {
                    field: 'vehicleTypeFormat',
                    value: 'FORMATONE',
                  },
                  pattern: {
                    value: /^[A-Z]{2}[\dA-Z]{2}[A-Z]{2}\d{4}$/,
                    message: 'Please enter valid Vehicle Number Plate',
                  },
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                  isUpper: true,
                  // maxChar: 11,
                },

                {
                  type: 'otptypebox',
                  boxarr: ['', '', '', '', '', '', '', ''],
                  spaceAfter: [1, 3],
                  minBoxReq: 6,
                  name: 'vehicleNumberPlate',
                  id: 'vehicleNumberPlate',
                  title: 'Vehicle Number ',
                  infoMessage: [
                    'AlphaNumeric characters are allowed',
                    'Maximum characters should be 10 ',
                    'KA-01-1234',
                  ],
                  placeholder: 'Ex:KA-01-1234',
                  dynamic: {
                    field: 'vehicleTypeFormat',
                    value: 'FORMATTWO',
                  },
                  pattern: {
                    value: /^[A-Z]{2}\d{2}\d{4}$/,
                    message: 'Please enter valid Vehicle Number Plate',
                  },
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                  isUpper: true,
                  // maxChar: 11,
                },
                {
                  type: 'otptypebox',
                  boxarr: ['', '', '', '', '', '', '', '', '', ''],
                  // spaceAfter: [],
                  minBoxReq: 6,
                  name: 'vehicleNumberPlate',
                  id: 'vehicleNumberPlate',
                  title: 'Vehicle Number ',
                  infoMessage: [
                    'AlphaNumeric characters are allowed',
                    'Maximum characters should be 10 ',
                    '21BH2345AA',
                  ],
                  placeholder: 'Ex:21BH2345AA',
                  dynamic: {
                    field: 'vehicleTypeFormat',
                    value: 'FORMATTHREE',
                  },
                  pattern: {
                    value: /^\d{2}[A-Z]{2}\d{4}[A-Z]{2}$/,
                    message: 'Please enter valid Vehicle Number Plate',
                  },
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                  isUpper: true,
                  // maxChar: 11,
                },
                {
                  type: 'otptypebox',
                  boxarr: ['', '', '', '', '', '', '', '', ''],
                  spaceAfter: [1, 3, 4],
                  minBoxReq: 6,
                  name: 'vehicleNumberPlate',
                  id: 'vehicleNumberPlate',
                  title: 'Vehicle Number ',
                  infoMessage: [
                    'AlphaNumeric characters are allowed',
                    'Maximum characters should be 9 ',
                    'KA-13-C-9065',
                  ],
                  placeholder: 'Ex:KA-13-C-9065',
                  dynamic: {
                    field: 'vehicleTypeFormat',
                    value: 'FORMATFOUR',
                  },
                  pattern: {
                    value: /^[A-Z]{2}\d{2}[A-Z]{1}\d{4}$/,
                    message: 'Please enter valid Vehicle Number Plate',
                  },
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                  isUpper: true,
                  // maxChar: 11,
                },
                {
                  type: 'otptypebox',
                  boxarr: ['', '', '', '', '', '', '', '', ''],
                  // spaceAfter: [1, 3, 5],
                  minBoxReq: 6,
                  name: 'vehicleNumberPlate',
                  id: 'vehicleNumberPlate',
                  title: 'Vehicle Number ',
                  infoMessage: [
                    'AlphaNumeric characters are allowed',
                    'Maximum characters should be 10 ',
                    'DL-9C-AS-3364',
                  ],
                  placeholder: 'Ex:KA-01-AA-1234',
                  dynamic: {
                    field: 'vehicleTypeFormat',
                    value: 'FORMATFIVE',
                  },
                  pattern: {
                    value: /^\d{2}[A-Z]{2}\d{4}[A-Z]{1}$/,
                    message: 'Please enter valid Vehicle Number Plate',
                  },
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                  isUpper: true,
                  // maxChar: 11,
                },
                {
                  type: 'autocomplete',
                  name: 'modelNo',
                  id: 'modelNo',
                  title: 'Model Name',
                  options: vehicleModel ?? [],
                  // disabled: true,
                  infoMessage: [
                    'Numeric characters are allowed',
                    'Maximum characters should be 30 ',
                    'e.g.: MT-15',
                  ],
                  pattern: {
                    value: regex.maxSize30,
                    message:
                      'Please enter valid Model No. and below 30 characters',
                  },
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },
                {
                  type: 'text',
                  name: 'vehicleBrand',
                  id: 'vehicleBrand',
                  title: 'Vehicle Brand',
                  // defaultValue: vehicleBrand,
                  // disabled: true,
                  infoMessage: [
                    'Alphabhets characters are allowed',
                    'Maximum characters should be 50 ',
                    'TATA',
                  ],
                  // options: vehicleBrand ?? [],
                  pattern: {
                    value: regex.char50,
                    message:
                      'Please enter valid Vehicle Brand and below 30 characters',
                  },
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },
                {
                  type: 'select',
                  name: 'vehicleColor',
                  id: 'vehicleColor',
                  title: 'Vehicle Color',
                  options: vehicleColor ?? [],
                  // disabled: true,
                  infoMessage: [
                    'Alphabets are allowed',
                    'Maximum length should be 50 characters',
                    'Red',
                  ],
                  // pattern: {
                  //   value: regex.char50,
                  //   message: 'Please enter name of color',
                  // },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },
                // {
                //   type: 'text',
                //   name: 'colorName',
                //   id: 'colorName',
                //   title: 'Color Name',
                //   disabled: true,
                //   infoMessage: [
                //     'Alphabets are allowed',
                //     'Maximum length should be 50 characters',
                //     'Red',
                //   ],
                // },
                {
                  type: 'autocomplete',
                  name: 'fuelType',
                  id: 'fuelType',
                  title: 'Fuel Type',
                  infoMessage: [
                    'Dropdown values are selectable',
                    'e.g.: Petrol',
                  ],
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                  options: [
                    {title: 'Petrol', value: 'Petrol'},
                    {title: 'Diesel', value: 'Diesel'},
                    {title: 'CNG', value: 'CNG'},
                    {title: 'Electric', value: 'Electric'},
                  ],
                },
                {
                  type: user?.role == 'VENDOR' ? 'hidden' : 'autocomplete',
                  name: 'vendorId',
                  id: 'vendorId',
                  title: ' Vendor',
                  disabled: user?.role == 'VENDOR' ? true : false,
                  infoMessage: [
                    'Dropdown values are selectable',
                    'Maximum length should be 100 characters',
                    'Ex: Shubhash',
                  ],
                  options: vendorList ?? [],
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },
                {
                  type: 'date',
                  name: 'registrationDate',
                  id: 'registrationDate',
                  title: 'Registration Date',
                  max: 'today',
                  infoMessage: [
                    'Date is selectable from calendar',
                    'Date can be entered in DD-MM-YY Format',
                    'e.g.: 07-04-1992',
                  ],
                  validationProps: {
                    required: 'This is a mandatory field',
                    manual: [
                      {
                        condition: `registrationDate <= today`,
                        message:
                          "Registration Date should be less than or equal to today's date.",
                      },
                    ],
                  },
                },
                {
                  type: 'date',
                  name: 'registrationExpDate',
                  id: 'registrationExpDate',
                  title: 'Registration Expiry Date',
                  min: 'today',
                  infoMessage: [
                    'Date is selectable from calendar',
                    'Date can be entered in DD-MM-YY Format',
                    'Registration Date shouls be greater than Registration Expiry Date',
                    'e.g.: 07-04-1992',
                  ],
                  validationProps: {
                    required: 'This is a mandatory field',
                    manual: [
                      {
                        condition: `registrationExpDate >= today`,
                        message:
                          "Registration expiry date should be greater than or equal to today's date.",
                      },
                    ],
                  },
                },
                {
                  type: 'date',
                  name: 'polutionTill',
                  id: 'polutionTill',
                  title: 'Pollution Expiry Date',
                  min: 'today',
                  infoMessage: [
                    'Date is selectable from calendar',
                    'Date can be entered in DD-MM-YY Format',
                    'e.g.: 07-04-1992',
                  ],
                  validationProps: {
                    required: 'This is a mandatory field',
                    manual: [
                      {
                        condition: `polutionTill >= today`,
                        message:
                          "Pollution date should be greater than or equal to today's date.",
                      },
                    ],
                  },
                },
                {
                  type: 'date',
                  name: 'insuranceTill',
                  id: 'insuranceTill',
                  title: 'Insurance Expiry Date',
                  min: 'today',
                  infoMessage: [
                    'Date is selectable from calendar',
                    'Date can be entered in DD-MM-YY Format',
                    'e.g.: 07-04-1992',
                  ],
                  validationProps: {
                    required: 'This is a mandatory field',
                    manual: [
                      {
                        condition: `insuranceTill >= today`,
                        message:
                          "Insurance date should be greater than or equal to today's date.",
                      },
                    ],
                  },
                },
                {
                  type: 'date',
                  name: 'permitExpiryDate',
                  id: 'permitExpiryDate',
                  title: 'Permit Expiry Date',
                  min: 'today',
                  infoMessage: [
                    'Date is selectable from calendar',
                    'Date can be entered in DD-MM-YY Format',
                    'e.g.: 07-04-1992',
                  ],
                  validationProps: {
                    required: 'This is a mandatory field',
                    manual: [
                      {
                        condition: `permitExpiryDate >= today`,
                        message:
                          "Permit Expiry date should be greater than or equal to today's date.",
                      },
                    ],
                  },
                },
                {
                  type: 'date',
                  name: 'fitnessExpiryDate',
                  id: 'fitnessExpiryDate',
                  title: 'Fitness Expiry Date',
                  min: 'today',
                  infoMessage: [
                    'Date is selectable from calendar',
                    'Date can be entered in DD-MM-YY Format',
                    'e.g.: 07-04-1992',
                  ],
                  validationProps: {
                    required: 'This is a mandatory field',
                    manual: [
                      {
                        condition: `fitnessExpiryDate >= today`,
                        message:
                          "Fitness Expiry date should be greater than or equal to today's date.",
                      },
                    ],
                  },
                },
                {
                  type: 'date',
                  name: 'roadTaxValidityExpiry',
                  id: 'roadTaxValidityExpiry',
                  title: 'Road Tax Expiry',
                  min: 'today',
                  infoMessage: [
                    'Date is selectable from calendar',
                    'Date can be entered in DD-MM-YY Format',
                    'e.g.: 07-04-1992',
                  ],
                  validationProps: {
                    required: 'This is a mandatory field',
                    manual: [
                      {
                        condition: `roadTaxValidityExpiry >= today`,
                        message:
                          "Road Tax expiry date should be greater than or equal to today's date.",
                      },
                    ],
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
                  fields: [],
                },
                {
                  type: 'section',
                  layout: {
                    column: 2,
                    spacing: 2,
                    size: 'medium',
                    label: 'fixed',
                  },
                  fields: [],
                },
              ],
            },
          ],
        },
      },
      {
        layout: {},
        title: 'Owner Details',
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
                  name: 'ownerName',
                  id: 'ownerName',
                  title: 'Name',
                  infoMessage: [
                    'Alpha characters are allowed',
                    'Maximum length should be 30 characters',
                    'e.g.: XYZ',
                  ],

                  disabled: false,
                  pattern: {
                    value: regex.char30,
                    message:
                      'Please enter valid Owner Name and below 50 characters',
                  },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },
                {
                  type: 'text',
                  name: 'oweraddress',
                  id: 'oweraddress',
                  title: 'Address',
                  infoMessage: [
                    'Alphanumeric characters are allowed',
                    'Maximum length should be 50  characters',
                    'e.g.: Noida Sector 48, UP ',
                  ],
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },
                {
                  type: 'text',
                  name: 'ownerMobile',
                  id: 'ownerMobile',
                  title: 'Mobile No.',
                  isNumber: true,
                  maxChar: 10,
                  infoMessage: [
                    'Numeric characters are allowed',
                    'Maximum length should be 10 characters',
                    'e.g.: 9058906780',
                  ],
                  pattern: {
                    value: regex.phoneReg,
                    message: 'Please enter valid  Mobile No.',
                  },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },
                {
                  type: 'text',
                  name: 'ownerEmail',
                  id: 'ownerEmail',
                  title: 'Email',
                  infoMessage: [
                    'Alphanumeric characters are allowed',
                    'Maximum length should be 30 characters & should include @',
                    'Should have domain name',
                    'e.g.: xyz45@gmail.com',
                  ],
                  pattern: {
                    value: regex.emailReg,
                    message: 'Please enter valid Owner Email Id',
                  },
                },
              ],
            },
          ],
        },
      },
      {
        layout: {},
        title: 'Safety Checks & Features',
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
              // title: 'Sample Form',
              fields: [
                {
                  type: 'date',
                  name: 'vehicleInduction',
                  id: 'vehicleInduction',
                  title: 'Vehicle Induction Date',
                  max: 'today',
                  infoMessage: [
                    'Date is selectable from calendar',
                    'Date can be entered in DD-MM-YY Format',
                    'e.g.: 07-04-2005',
                  ],
                  validationProps: {
                    required: 'This is a mandatory field',
                    manual: [
                      {
                        condition: `vehicleInduction <= today`,
                        message:
                          "Vehicle Induction Date should be lesser than or equal to today's date.",
                      },
                    ],
                  },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },
                {
                  type: 'date',
                  name: 'firstAidKitDate',
                  id: 'firstAidKitDate',
                  title: 'First Aid Kit Date',
                  min: 'today',
                  infoMessage: [
                    'Date is selectable from calendar',
                    'Date can be entered in DD-MM-YY Format',
                    'Date when First Aid kit was replaced',
                    'e.g.: 07-04-1992',
                  ],
                  validationProps: {
                    required: 'This is a mandatory field',
                    manual: [
                      {
                        condition: `firstAidKitDate >= today`,
                        message:
                          "First Aid kit date should be smaller than or equal to today's date.",
                      },
                    ],
                  },
                },
                {
                  type: 'date',
                  name: 'fireExtinguisherDate',
                  id: 'fireExtinguisherDate',
                  title: 'Fire Extinguisher Date',
                  min: 'today',
                  infoMessage: [
                    'Date is selectable from calendar',
                    'Date can be entered in DD-MM-YY Format',
                    'Date when fire extinguisher was replaced',
                    'e.g.: 07-04-1992',
                  ],
                  validationProps: {
                    required: 'This is a mandatory field',
                    manual: [
                      {
                        condition: `fireExtinguisherDate >= today`,
                        message:
                          "Fire Extinguisher date should be greater than or equal to today's date.",
                      },
                    ],
                  },
                },
                {
                  type: 'autocomplete',
                  name: 'standardSelect',
                  id: 'standardSelect',
                  title: 'Pollution Standard',
                  infoMessage: [
                    'Dropdown values are selectable',
                    'e.g.: BS III',
                  ],
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // },
                  options: [
                    {title: 'BS I', value: 'BS I'},
                    {title: 'BS II', value: 'BS II'},
                    {title: 'BS III', value: 'BS III'},
                    {title: 'BS IV', value: 'BS IV'},
                    // {title: 'BS V', value: 'BS V'},
                    {title: 'BS VI', value: 'BS VI'},
                  ],
                },
                {
                  type: 'radio',
                  name: 'ac',
                  id: 'ac',
                  title: 'AC',
                  infoMessage: [
                    'Radio button is selectable',
                    'e.g.: Available',
                  ],
                  options: [
                    {title: 'Available', value: 'Yes'},
                    {title: 'Not Available', value: 'No'},
                  ],
                },
                {
                  type: 'radio',
                  name: 'wifi',
                  id: 'wifi',
                  title: 'Wifi',
                  infoMessage: [
                    'Radio button is selectable',
                    'e.g.: Available',
                  ],
                  options: [
                    {title: 'Available', value: 'Yes'},
                    {title: 'Not Available', value: 'No'},
                  ],
                },
                {
                  type: 'radio',
                  name: 'sanitized',
                  id: 'sanitized',
                  title: 'Sanitised',
                  infoMessage: [
                    'Radio button is selectable',
                    'e.g.: Available',
                  ],
                  options: [
                    {title: 'Yes', value: 'Yes'},
                    {title: 'No', value: 'No'},
                  ],
                },
              ],
            },
          ],
        },
      },
      {
        layout: {},
        title: 'Upload Documents',
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
                  type: 'file',
                  name: 'regdoc',
                  id: 'regdoc',
                  title: 'Upload Registration certificate',
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
                {
                  type: 'file',
                  name: 'photo',
                  id: 'photo',
                  accept: 'image/*,.pdf,.doc,.docx',
                  title: 'Upload Vehicle Image',
                  infoMessage: [
                    'Should only accept PDF,JPEG files',
                    'File should contain file extension',
                    'e.g.:Shub.jpeg',
                  ],
                  validationProps: {
                    // required: 'This is a mandatory field',
                    size: {
                      value: 5,
                      message: 'File size should not be more than 5 mb.',
                    },
                  },
                },
                {
                  type: 'file',
                  name: 'insdoc',
                  id: 'insdoc',
                  title: 'Upload Insurance Document',
                  infoMessage: [
                    'Should only accept PDF,JPEG files',
                    'File should contain file extension',
                    'e.g.:Shub.jpeg',
                  ],
                  accept: 'image/*,.pdf,.doc,.docx',
                  dynamic: {
                    field: 'insuranceStatus',
                    value: 'Yes',
                  },
                  validationProps: {
                    // required: 'This is a mandatory field',
                    size: {
                      value: 5,
                      message: 'File size should not be more than 5 mb.',
                    },
                  },
                },
                {
                  type: 'file',
                  name: 'permitdoc',
                  id: 'permitdoc',
                  title: ' Upload Permit Certificate',
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
                {
                  type: 'file',
                  name: 'fitnesdoc',
                  id: 'fitnesdoc',
                  title: 'Upload Fitness Certificate',
                  accept: 'image/*,.pdf,.doc,.docx',
                  infoMessage: [
                    'Should only accept PDF,JPEG files',
                    'File should contain file extension',
                    'e.g.:Shub.jpeg',
                  ],
                  validationProps: {
                    // required: 'This is a mandatory field',
                    size: {
                      value: 5,
                      message: 'File size should not be more than 5 mb.',
                    },
                  },
                },
                {
                  type: 'file',
                  name: 'polutiondoc',
                  id: 'polutiondoc',
                  title: 'Upload Pollution/Emission Ceritificate',
                  accept: 'image/*,.pdf,.doc,.docx',
                  infoMessage: [
                    'Should only accept PDF,JPEG files',
                    'File should contain file extension',
                    'e.g.:Shub.jpeg',
                  ],
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
          ],
        },
      },
    ],
  };
  const [showbtn, setshowbtn] = React.useState(true);
  const handleSubmit = (values) => {
    setshowbtn(false);

    console.log('values', values);
    let formattedString = values?.data?.vehicleNumberPlate?.join('');
    if (values?.data?.vehicleTypeFormat == 'FORMATONE') {
      formattedString = formattedString
        ?.split('')
        ?.map((digit, index) => {
          if ([1, 3, 5]?.includes(index)) {
            return digit + '-';
          } else {
            return digit;
          }
        })
        .join('');
    }
    if (values?.data?.vehicleTypeFormat == 'FORMATTWO') {
      formattedString = formattedString
        ?.split('')
        ?.map((digit, index) => {
          if ([1, 3]?.includes(index)) {
            return digit + '-';
          } else {
            return digit;
          }
        })
        .join('');
    }
    if (values?.data?.vehicleTypeFormat == 'FORMATFOUR') {
      formattedString = formattedString
        ?.split('')
        ?.map((digit, index) => {
          if ([1, 3, 4]?.includes(index)) {
            return digit + '-';
          } else {
            return digit;
          }
        })
        .join('');
    }

    if (values.button.toUpperCase() === 'SUBMIT') {
      let dataSet = {};
      let allElem = {};
      let temp = {
        ...values?.data,
        vehicleNumberPlate: formattedString,
      };
      vehicle?.map((el) => {
        if (el?.value == temp.vehicleTypeId) {
          temp.vehicleTypeName = el?.title?.split('-')[0];
          temp.vehicleName = el?.vehicleName;
        }
      });
      vehicleModel?.map((el) => {
        if (el?.value == temp?.modelNo) {
          temp.modelName = el?.title;
        }
      });
      if (user?.role == 'CORPORATEADMIN' || user?.role == 'SUPERADMIN') {
        vendorList?.map((e) => {
          console.log('e', e);
          if (e?.value == temp?.vendorId) {
            temp.vendorName = e?.title;
            temp.vendorCode = e?.code;
          }
        });
        temp.corporateId = user?.userList?.corporateId;
      }
      if (user?.role == 'VENDOR') {
        temp.vendorId = user?.userList?.profileId;
        temp.vendorName = user?.userList?.userName;
        temp.vendorCode = vendorId?.vendorCode;
        temp.corporateId = user?.userList?.corporateId;
      }
      console.log('temp', temp);
      if (!temp?.regdoc?.length) delete temp.regdoc;
      if (!temp?.photo?.length) delete temp.photo;
      if (!temp?.polutiondoc?.length) delete temp.polutiondoc;
      if (!temp?.insdoc?.length) delete temp.insdoc;
      if (!temp?.permitdoc?.length) delete temp.permitdoc;
      if (!temp?.fitnesdoc?.length) delete temp.fitnesdoc;

      delete temp.vehicleStatus;
      delete temp.officeLocation;
      delete temp.ownerAddress;
      delete temp.colorName;
      delete temp.cng;
      Object.keys(temp).map((key) => {
        if (typeof temp[key]?.[0]?.name == 'string') {
          dataSet = {
            ...dataSet,
            [key]: temp[key][0],
          };
        } else {
          allElem = {
            ...allElem,
            [key]: temp[key],
          };
        }
      });
      dataSet = {
        ...dataSet,
        data: JSON.stringify(allElem),
      };

      axios({
        method: 'post',
        url: api.vehicle.list,
        data: getFormData(dataSet),
        headers: {'Content-Type': 'multipart/form-data'},
      })
        .then(function (response) {
          if (response?.data?.status == 200) {
            // navigate(`/onboardadmin/vehicle/vehicle-listing`);
            toast.success(
              `${response?.data?.data?.vehicleNumberPlate}'s created successfully`,
            );
            // toast.success('Details has been successfully submitted.');
            close(false);
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
  };

  function seatdata(value) {
    if (value?.vehicleTypeId?.length !== 0) {
      axios
        .get(`${Api?.masterVehicletype?.id + value?.vehicleTypeId}`)
        .then((r) => {
          if (r?.data) {
            setSeat(r?.data?.data?.vehicleOccupancy);
            setOccupancy(r?.data?.data?.vehicleOccupancy - 1);
          } else {
            setSeat(null);
            setOccupancy(null);
          }
        })
        .catch((er) => {
          setSeat('NA');
          setOccupancy('NA');
        });
    }
  }
  function handleChange(val) {
    console.log('val', val);
    VehicleModel(val?.vehicleTypeId?.id);
    VehicleBrand(val?.modelNo?.value);
  }

  return (
    <>
      {!showbtn ? <AppLoader /> : null}
      {vendorList && (
        <Steppers
          defaultValues={{
            vendorId: user?.role == 'VENDOR' ? user?.userList?.profileId : null,
          }}
          template={stepperTemplate}
          // watchFields={['firstname', 'include_portfolio', 'email', 'country']}
          showbtn={showbtn}
          mode='onTouched'
          setVal={[
            {name: 'vehicleBrand', value: vehicleBrand},
            {
              name: 'colorName',
              value: vehicleColorName?.length
                ? vehicleColorName?.split(')')?.[0]
                : ' ',
            },
            // {name: 'modelNo', value: vehicle_detail?.model || 'NA'},
          ]}
          getOnInput={seatdata}
          onChange={handleChange}
          // validate={validate}
          icons={{
            1: <CommuteIcon />,
            2: <PersonIcon />,
            3: <EnhancedEncryptionIcon />,
            4: <TextSnippetIcon />,
          }}
          afterSubmit={handleSubmit}
          on
          // buttons={['submit']}
        />
      )}
    </>
  );
};

export default RegisterVendor;
