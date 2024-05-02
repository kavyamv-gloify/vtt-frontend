import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import Steppers from '@smart-form/stepper';
import api from '@api';
import regex from '@regex';
import axios from 'axios';
import {getFormData} from '@hoc';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {toast} from 'react-toastify';
import Api from '@api';
import PopEdit from '@editpopup';

const EditVendor = ({id, popBTNClick, openDialog}) => {
  const navigate = useNavigate();
  const {user} = useAuthUser();
  const [data, setData] = useState();
  const [vehicle, setVehicle] = useState();
  const [occupancy, setOccupancy] = useState();
  const [seat, setSeat] = useState();
  const [vendorList, setVendorList] = useState();
  const [vendorId, setVendorId] = useState();
  const vendorprofile = user?.userList?.profileId;
  const [vehicleModel, setVehicleModel] = useState();
  const [vehicleColor, setVehicleColor] = useState();
  const [vehicleBrand, setVehicleBrand] = useState();
  const [vehicleColorName, setVehicleColorName] = useState();
  // const [vehicleColorId, setVehicleColorId] = useState("");
  const [fields, setFields] = useState();
  useEffect(() => {
    async function vendorData() {
      const baseURL = `${api.vendor.list}/${vendorprofile}`;
      let response = await axios.get(`${baseURL}`);
      setVendorId(response.data.data);
    }
    vendorData();
  }, [vendorprofile]);

  useEffect(() => {
    async function vehicelTypeList() {
      const baseURL = `${api.masterVehicletype.listbytanent}?page=0&size=1000&vehicleType=null`;
      axios
        .get(`${baseURL}`)
        .then((response) => {
          let temp = [];
          response?.data?.data?.body['VehicleTypeList']?.map((id) => {
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
          });
          setVehicle(temp ?? []);
        })
        .catch((err) => {
          setVehicle([]);
        });
    }
    vehicelTypeList();
  }, [vendorprofile]);
  useEffect(() => {
    async function fetchDatabyId() {
      const baseURL = `${api.vehicle.list}/${id}`;
      let response = await axios.get(baseURL);
      console.log(response);
      console.log('vehicle', vehicle);
      vehicle?.map((el, index) => {
        if (el?.value == response?.data?.data?.vehicleTypeId) {
          console.log('matching',el?.id);
          VehicleModel(el?.id);
        }
      });
      VehicleBrand(response?.data?.data?.modelNo);
      setData(response.data.data);
    }
    fetchDatabyId();
  }, [id, vehicle]);
  useEffect(() => {
    console.log('fields', fields);
  }, [fields]);
 
  function VehicleModel(id) {
    console.log('id', id);

    axios
      .get(
        api.baseUri +
          `/user-reg/vehicle-model/get-vehicleModel-by-vehicleTypeId/${id}`,
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          let temp_vehicleModel = [];
          let temp_color = [];
          res?.data?.data?.map((el) => {
            temp_vehicleModel?.push({
              title: el?.vehicleModelName,
              value: el?.id,
            });
          });
          console.log(' ', temp_vehicleModel);
          setVehicleModel(temp_vehicleModel ?? []);
        }
      })
      .catch((err) => {
        setVehicleModel([]);
      });
  }

  function VehicleBrand(id) {
    console.log('ids', id);
    let temp_color = [];
    axios
      .get(api.baseUri + `/user-reg/vehicle-model/get-vehicleModel-by-id/${id}`)
      .then((res) => {
        if (res?.data?.status == '200') {
          console.log('resp', res?.data);
          setVehicleBrand(res?.data?.data?.vehicleBrandName);
          res?.data?.data?.vehicleTypeThemeColor?.map((el) => {
            temp_color.push({
              title: el?.split(' ')?.[2] + '( ' + el?.split(' ')?.[0] + ' )',
              value: el.split(' ')?.[0],
            });
          });
          console.log('temp_color', temp_color);
          setVehicleColor(temp_color ?? []);
          // setVehicleColorId(res?.data?.data?.vehicleTypeThemeId);
        }
      });
  }
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
                  type: 'section',
                  layout: {
                    column: 2,
                    spacing: 2,
                    size: 'medium',
                    label: 'fixed',
                  },
                  sectionName: 'vehicleType',
                  sectiontitle: 'Vehicle Type ',
                  fields: [
                    {
                      type: 'autocomplete',
                      name: 'vehicleTypeId',
                      id: 'vehicleTypeId',
                      title: 'Vehicle Type',
                      validationProps: {
                        required: 'This is a mandatory field',
                      },
                      options: vehicle ?? [],
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
                  sectionName: 'Model Name',
                  sectiontitle: 'modelName ',
                  fields: [
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
                      // pattern: {
                      //   value: regex.maxSize30,
                      //   message:
                      //     'Please enter valid Model No. and below 30 characters',
                      // },
                      validationProps: {
                        required: 'This is a mandatory field',
                      },
                    },
                    // {
                    //   type: 'text',
                    //   name: 'vehicleBrand',
                    //   id: 'vehicleBrand',

                    //   title: 'Vehicle Brand',
                    //   // disabled: true,
                    //   pattern: {
                    //     value: regex.char50,
                    //     message:
                    //       'Please enter valid Vehicle Brand and below 50 characters',
                    //   },
                    //   validationProps: {
                    //     required: 'This is a mandatory field',
                    //   },
                    // },

                    // {
                    //   type: 'select',
                    //   name: 'vehicleColor',
                    //   id: 'vehicleColor',
                    //   title: 'Vehicle Color',
                    //   options: vehicleColor ?? [],
                    //   // disabled: true,
                    //   infoMessage: [
                    //     'Alphabets are allowed',
                    //     'Maximum length should be 50 characters',
                    //     'Red',
                    //   ],
                    //   // pattern: {
                    //   //   value: regex.char50,
                    //   //   message: 'Please enter name of color',
                    //   // },
                    //   // validationProps: {
                    //   //   required: 'This is a mandatory field'
                    //   // }
                    // },
                  ],
                },
                {
                  type: 'text',
                  name: 'vehicleBrand',
                  id: 'vehicleBrand',

                  title: 'Vehicle Brand',
                  disabled: true,
                  pattern: {
                    value: regex.char50,
                    message:
                      'Please enter valid Vehicle Brand and below 50 characters',
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
                {
                  type: 'section',
                  layout: {
                    column: 1,
                    spacing: 1,
                    size: 'medium',
                    label: 'fixed',
                  },
                  sectionName: 'vehicleNumber',
                  sectiontitle: 'Vehicle Number',
                  fields: [
                    {
                      type: 'select',
                      name: 'vehicleTypeFormat',
                      id: 'vehicleTypeFormat',
                      title: 'Vehicle Number Format',
                      options: [
                        {
                          title: 'FORMAT 1(ex:KA-01-AA-1234)',
                          value: 'FORMATONE',
                        },
                        {
                          title: 'FORMAT 2(ex:KA-01-1234)',
                          value: 'FORMATTWO',
                        },
                        {
                          title: 'FORMAT 3(ex:21BH2345AA)',
                          value: 'FORMATTHREE',
                        },
                        {
                          title: 'FORMAT 4(ex:KA-13-C-9065)',
                          value: 'FORMATFOUR',
                        },
                        {title: 'FORMAT 5(ex:22BH1234A)', value: 'FORMATFIVE'},
                        // {title: 'FORMAT 5(ex:KA-46-9406)', value: 'FORMATFIVE'},
                      ],
                      infoMessage: [
                        'Alpha Numeric Characters are allowed',
                        'Maximum length should be 50',
                        'e.g.: OTA-Penalty1',
                      ],
                    },
                    {
                      type: 'otptypebox',
                      boxarr:
                        data?.vehicleTypeFormat == 'FORMATONE'
                          ? data?.vehicleNumberPlate.replace(/-/g, '').split('')
                          : ['', '', '', '', '', '', '', '', '', ''],
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
                      boxarr:
                        data?.vehicleTypeFormat == 'FORMATTWO'
                          ? data?.vehicleNumberPlate.replace(/-/g, '').split('')
                          : ['', '', '', '', '', '', '', ''],
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
                      boxarr:
                        data?.vehicleTypeFormat == 'FORMATTHREE'
                          ? data?.vehicleNumberPlate.replace(/-/g, '').split('')
                          : ['', '', '', '', '', '', '', '', '', ''],
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
                      boxarr:
                        data?.vehicleTypeFormat == 'FORMATFOUR'
                          ? data?.vehicleNumberPlate.replace(/-/g, '').split('')
                          : ['', '', '', '', '', '', '', '', ''],
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
                  ],
                },

                {
                  type: 'autocomplete',
                  name: 'fuelType',
                  id: 'fuelType',
                  title: 'Fuel Type',
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
                  title: 'Vendor',
                  disabled: true,
                  options: vendorList ?? [],
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                  pattern: {
                    value: regex.char30,
                    message:
                      'Please enter valid fleet vendor below  30 characters',
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
                  sectionName: 'registrationname',
                  sectiontitle: 'Vehicle Registration Detail ',
                  fields: [
                    {
                      type: 'date',
                      name: 'registrationDate',
                      id: 'registrationDate',
                      title: 'Registration Date',
                      max: 'today',
                      validationProps: {
                        required: 'This is a mandatory field',
                      },
                    },
                    {
                      type: 'date',
                      name: 'registrationExpDate',
                      id: 'registrationExpDate',
                      title: 'Registration Expiry Date',
                      min: 'today',
                      validationProps: {
                        required: 'This is a mandatory field',
                      },
                    },
                    {
                      type: 'file',
                      name: 'regdoc',
                      id: 'regdoc',
                      title: 'Upload Registration certificate',
                      accept: 'image/*,.pdf,.doc,.docx',
                      tempFilename: data?.regCertDoc,
                      disabled: true,
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
                  type: 'date',
                  name: 'polutionTill',
                  id: 'polutionTill',
                  title: 'Pollution Expiry Date',
                  min: 'today',
                  validationProps: {
                    required: 'This is a mandatory field',
                    // validate: [
                    //   {
                    //     condition: "polutionFrom < polutionTill",
                    //     message: "From date should not be greater than To date."
                    //   }
                    // ],
                  },
                },

                {
                  type: 'date',
                  name: 'insuranceTill',
                  id: 'insuranceTill',
                  title: 'Insurance Expiry Date',
                  min: 'today',
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },

                {
                  type: 'date',
                  name: 'permitExpiryDate',
                  id: 'permitExpiryDate',
                  title: 'Permit Expiry Date',
                  min: 'today',
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },
                {
                  type: 'date',
                  name: 'fitnessExpiryDate',
                  id: 'fitnessExpiryDate',
                  title: 'Fitness Expiry Date',
                  min: 'today',
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },
                {
                  type: 'date',
                  name: 'roadTaxValidityExpiry',
                  id: 'roadTaxValidityExpiry',
                  title: 'Road Tax Expiry',
                  min: 'today',
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
                  sectionName: 'vehiclename',
                  sectiontitle: 'Vehicle Photo',
                  fields: [
                    {
                      type: 'file',
                      name: 'photo',
                      id: 'photo',
                      title: ' Upload Vehicle Image',
                      accept: 'image/*,.pdf,.doc,.docx',
                      tempFilename: data?.vehiclePhoto,
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
          ],
        },
      },
      {
        layout: {},
        title: 'Upload Documents',
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
                // {
                //   type: "section",
                //   layout: { column: 2, spacing: 2, size: 'medium', label: 'fixed' },
                //   sectionName: "pollution",
                //   sectiontitle: "Pollution Status",
                //   fields: [

                //     {
                //       type: 'radio',
                //       name: 'polutionStatus',
                //       id: 'polutionStatus',
                //       title: 'Pollution',
                //       // disabled:true,
                //       options: [{ title: "Available", value: "Yes" }, { title: "Not Available", value: "No" }],
                //       // pattern: {
                //       //   value: regex.maxSize30,
                //       //   message: 'Please enter alpha-numeric and below 30 characters'
                //       // },
                //       // validationProps: {
                //       //   required: 'This is a mandatory field'
                //       // }
                //     },

                //     {
                //       type: 'file',
                //       name: 'polutiondoc',
                //       id: 'polutiondoc',
                //       title: 'Upload Pollution Doc',
                //       dynamic: {
                //         field: 'polutionStatus',
                //         value: 'Yes'
                //       },
                //       accept: 'image/*,.pdf,.doc,.docx',
                //       tempFilename: (data?.polutionDoc),
                //       validationProps: {
                //         // required: 'This is a mandatory field',
                //         size: {
                //           value: 5,
                //           message: 'File size should not be more than 5 mb.'
                //         },
                //       }

                //     },

                //     // validationProps: {
                //     //   // required: 'This is a mandatory field',
                //     //   size: {
                //     //     value: 5,
                //     //     message: 'File size should not be more than 5 mb.'
                //     //   },
                //     // }

                //   ]
                // },
                // {
                //   type: 'date',
                //   name: 'polutionFrom',
                //   id: 'polutionFrom',
                //   title: 'Pollution from Date',

                //   // dynamic: {
                //   //   field: 'polutionStatus',
                //   //   value: 'Yes'
                //   // },
                //   // validationProps: {
                //   //   required: 'This is a mandatory field'
                //   // }
                // },

                {
                  type: 'section',
                  layout: {
                    column: 2,
                    spacing: 2,
                    size: 'medium',
                    label: 'fixed',
                  },
                  sectionName: 'permitdoc',
                  sectiontitle: 'Permit Certificate',
                  fields: [
                    {
                      type: 'file',
                      name: 'permitdoc',
                      id: 'permitdoc',
                      title: 'Upload Permit Certificate',
                      accept: 'image/*,.pdf,.doc,.docx',
                      tempFilename: data?.permitDoc,
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
                  sectionName: 'pollutiondoc',
                  sectiontitle: 'Pollution/Emission Certificate',
                  fields: [
                    {
                      type: 'file',
                      name: 'polutiondoc',
                      id: 'polutiondoc',
                      title: 'Upload Pollutionn/Emission Certificate',
                      accept: 'image/*,.pdf,.doc,.docx',
                      tempFilename: data?.polutionDoc,
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
                  sectionName: 'fitnessstatus',
                  sectiontitle: 'Fitness Certificate',
                  fields: [
                    {
                      type: 'file',
                      name: 'fitnesdoc',
                      id: 'fitnesdoc',
                      title: 'Upload fitness certificate',
                      accept: 'image/*,.pdf,.doc,.docx',
                      tempFilename: data?.fitnessCertDoc,
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
                  disabled: false,
                  pattern: {
                    value: regex.alphaReg,
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
                  pattern: {
                    value: regex.emailReg,
                    message: 'Please enter valid Owner Email Id',
                  },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },
              ],
            },
          ],
        },
      },
      {
        layout: {},
        title: 'Safety Checks & Features',
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
            spacing: 1,
            size: 'medium',
            label: 'fixed',
            type: 'grid',
          },
          sections: [
            {
              layout: {column: 1, spacing: 2, size: 'medium', label: 'fixed'},
              // title: 'Sample Form',
              fields: [
                {
                  type: 'date',
                  name: 'firstAidKitDate',
                  id: 'firstAidKitDate',
                  title: 'First Aid Kit Date',
                  min: 'today',
                  validationProps: {
                    required: 'This is a mandatory field',
                    manual: [
                      {
                        condition: `firstAidKitDate <= today`,
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
                  validationProps: {
                    required: 'This is a mandatory field',
                    manual: [
                      {
                        condition: `fireExtinguisherDate <= today`,
                        message:
                          "Fire Extinguisher date should be greater than or equal to today's date.",
                      },
                    ],
                  },
                },

                {
                  type: 'radio',
                  name: 'ac',
                  id: 'ac',
                  title: 'AC',
                  options: [
                    {title: 'Available', value: 'Yes'},
                    {title: 'Not Available', value: 'No'},
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
                  type: 'radio',
                  name: 'wifi',
                  id: 'wifi',
                  title: 'Wifi',
                  options: [
                    {title: 'Available', value: 'Yes'},
                    {title: 'Not Available', value: 'No'},
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
                  type: 'radio',
                  name: 'sanitized',
                  id: 'sanitized',
                  title: 'Sanitized',
                  options: [
                    {title: 'Available', value: 'Yes'},
                    {title: 'Not Available', value: 'No'},
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
                  type: 'autocomplete',
                  name: 'standardSelect',
                  id: 'standardSelect',
                  title: 'Pollution Standard',

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
                  // disabled: true,
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
    if (values?.close) {
      popBTNClick(false);
      return;
    }
    setshowbtn(false);
    if (values.button.toUpperCase() === 'UPDATE') {
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
      if (user?.role == 'CORPORATEADMIN') {
        vendorList?.map((e) => {
          if (e?.value == temp?.vendorId) {
            temp.vendorName = e?.title;
            temp.vendorCode = e?.code;
          }
        });
      }

      if (user?.role == 'VENDOR') {
        temp.vendorId = user?.userList?.profileId;
        temp.vendorName = user?.userList?.userName;
        temp.vendorCode = vendorId?.vendorCode;
      }
      if (!temp?.regdoc?.length) delete temp.regdoc;
      if (!temp?.photo?.length) delete temp.photo;
      if (!temp?.polutiondoc?.length) delete temp.polutiondoc;
      if (!temp?.insdoc?.length) delete temp.insdoc;
      if (!temp?.permitdoc?.length) delete temp.permitdoc;
      if (!temp?.fitnesdoc?.length) delete temp.fitnesdoc;
      console.log('temp', temp);
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
        method: 'put',
        url: api.vehicle.list,
        data: getFormData(dataSet),
        headers: {'Content-Type': 'multipart/form-data'},
      })
        .then(function (response) {
          if (response.status == 200) {
            // navigate(`/onboardadmin/vehicle/vehicle-listing`);
            toast.success(
              `${response?.data?.data?.vehicleNumberPlate}'s updated successfully`,
            );
            // toast.success('Details has been successfully updated.');
            popBTNClick(false);
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
    console.log('value', value);
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
    setFields('data is coming');
    VehicleModel(val?.vehicleTypeId?.id);
    VehicleBrand(val?.modelNo?.value);
  }
  return (
    <>
      {data?.id && vehicle && vendorList && (
        <>
          {/* {data?.vehicleTypeId} */}
          <PopEdit
            title={data?.vehicleNumberPlate}
            defaultValues={{
              ...data,
              vehicleNumberPlate: data?.vehicleNumberPlate
                .replace(/-/g, '')
                .split(''),
            }}
            template={stepperTemplate}
            openDialog={openDialog}
            // setVal={[{ name: "tempaddress", value: address[0]?.length ? "address[0]":"null"}]}
            setVal={[
              {name: 'tempaddress', value: data?.address?.addressName},
              {name: 'temptown', value: data?.address?.city},
              {name: 'tempstate', value: data?.address?.state},
              {name: 'temppincode', value: data?.address?.pinCode},
            ]}
            getOnInput={seatdata}
            popAction={handleSubmit}
            onChange={handleChange}
            oldFormType={'STEPPER'}
          />
        </>
      )}
    </>
  );
};

export default EditVendor;
