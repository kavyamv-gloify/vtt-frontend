/* eslint-disable */
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Steppers from '@smart-form/stepper';
import {useDispatch, useSelector} from 'react-redux';
import {onAddNewTenent} from 'redux/actions';
import regex from '@regex';
import api from '@api';
import axios from 'axios';
import Api from '@api';
import {toast} from 'react-toastify';
import AppLoader from '@crema/core/AppLoader';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {useParams} from 'react-router-dom';
import PopEdit from '@editpopup';
// import {setInitialPath} from 'redux/actions';
const EscortEdit = ({id, popBTNClick, openDialog}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const boardList = useSelector(({ OnboardTenent }) => OnboardTenent.tenentBoardList);
  const [showbtn, setshowbtn] = React.useState(true);
  const [showTick, setshowTick] = React.useState();
  const [mytempifsc, setMytempifsc] = React.useState();
  const [branchData, setbranchData] = React.useState();
  const [bankNameVal, setbankNameVal] = React.useState();
  const [data, setData] = useState();
  const [agency, setAgencyList] = useState([]);
  const [shiftList, setshiftList] = useState();
  const {user} = useAuthUser();
  // const { id } = useParams();

  // const corporateId = user.userList.profileId
  const CorpId =
    user?.role == 'CORPORATEADMIN'
      ? user?.userList?.profileId
      : user?.userList?.corporateId;
  useEffect(() => {
    async function fetchData() {
      // alert("hii")
      const baseURL = `${Api?.escort?.createform}/${id}`;
      let response = await axios.get(`${baseURL}`);

      let tempObj = response.data.data;
      tempObj.tempaddress =
        response?.data?.data?.address?.addressName?.split('++')?.[0];
      tempObj.tempaddressAREA =
        response?.data?.data?.address?.addressName?.split('++')?.[1];
      tempObj.temptown = response?.data?.data?.address?.city;
      tempObj.tempstate = response?.data?.data?.address?.state;
      tempObj.temppincode = response?.data?.data?.address?.pinCode;
      setData(tempObj);
    }
    fetchData();
  }, [id]);

  useEffect(() => {
    getShiftList();
  }, []);
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

  useEffect(() => {
    agencyList();
  }, []);
  async function agencyList() {
    axios
      .get(`${api.dropdown.escortagency}`)
      .then((res) => {
        let temp = [];

        res?.data?.data?.map((e) => {
          temp.push({title: e.agencyName, value: e.id});
        });
        setAgencyList(temp ?? []);
      })
      .catch((er) => {
        setAgencyList([]);
      });
  }

  let stepperTemplate = {
    title: 'Escort Registration Form',
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
        title: 'Escort Employee Details',
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

                // {
                //   type: 'text',
                //   name: 'firstName',
                //   id: 'firstName',
                //   title: 'First Name',
                //   disabled: false,
                //   pattern: {
                //     value: regex.char50,
                //     message: 'Please enter valid First name with max 50 characters'
                //   },
                //   validationProps: {
                //     required: 'This is a mandatory field'
                //   }
                // },
                {
                  type: 'section',
                  sectionName: 'personalname',
                  sectiontitle: 'Name & Photo',
                  layout: {
                    column: 2,
                    spacing: 2,
                    size: 'medium',
                    label: 'fixed',
                  },
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
                      validationProps: {
                        // required: 'This is a mandatory field'
                      },
                    },
                    {
                      type: 'file',
                      name: 'photo',
                      id: 'photo',
                      title: 'Upload Photograph',
                      // disabled: true,

                      accept: 'image/*',
                      tempFilename: data?.photoDoc?.split('/')[2],
                      validationProps: data?.photoDoc
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

                  infoMessage: ['Radio button is selectable', 'Ex: Male'],
                  options: [
                    {title: 'Male', value: 'Male'},
                    {title: 'Female', value: 'Female'},
                    {title: 'Others', value: 'Others'},
                  ],
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },
                {
                  type: 'autocomplete',
                  name: 'agency',
                  id: 'agency',
                  title: 'Agency',
                  options: agency ?? [],
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },
                {
                  type: 'text',
                  name: 'escortCode',
                  id: 'escortCode',
                  title: 'Escort Id',
                  pattern: {
                    value: regex.maxSize30,
                    message:
                      'Please enter valid escort Id with max 30 characters',
                  },
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },

                {
                  type: 'text',
                  name: 'remarks',
                  id: 'remarks',
                  title: 'Remarks',
                  pattern: {
                    value: regex.maxSize50,
                    message:
                      'Please enter valid remarks with max 50 characters',
                  },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },

                // {
                //   type: 'autocomplete',
                //   name: 'shiftDetails',
                //   id: 'shiftDetails',
                //   title: 'Shift',
                //   options: shiftList ?? [],

                //   // validationProps: {
                //   //   required: 'This is a mandatory field'
                //   // }
                // },
                {
                  type: 'select',
                  name: 'vaccinationStatus',
                  id: 'vaccinationStatus',
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
                  //   required: 'This is a mandatory field',
                  // },
                },
                {
                  type: 'text',
                  name: 'shortId',
                  id: 'shortId',
                  title: 'Escort Short Id',
                  // isUpper: true,
                  infoMessage: [
                    'Alphanumeric characters are allowed',
                    'Maximum length should be 16 characters',
                    'e.g.: BJAJ8595',
                  ],
                  pattern: {
                    value: regex.codeReg16,
                    message:
                      'Please enter valid escort Code  with 16 characters',
                  },
                  // validationProps: {
                  //   required: 'This is a mandatory field',
                  // },
                },
                {
                  type: 'section',
                  sectionName: 'escortaddress',
                  sectiontitle: 'Escort Address',
                  layout: {
                    column: 2,
                    spacing: 2,
                    size: 'medium',
                    label: 'fixed',
                  },
                  fields: [
                    {
                      type: 'text',
                      name: 'tempaddress',
                      id: 'tempaddress',
                      title: 'Flat,House,Building,Apartment',
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
                      name: 'tempaddressAREA',
                      id: 'tempaddressAREA',
                      title: 'Area, Street, Sector, Village',
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
                      name: 'temptown',
                      id: 'temptown',
                      title: 'Town/City(Residence)',
                      pattern: {
                        value: regex.adreesschar50,
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
                      pattern: {
                        value: regex.adreesschar50,
                        message:
                          'Please enter valid State with max 50 characters',
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
                      pattern: {
                        value: regex.pincodeRegex,
                        message: 'Please enter valid Pincode',
                      },
                      validationProps: {
                        required: 'This is a mandatory field',
                      },
                    },
                  ],
                },

                // {
                //   type: 'mappl',
                //   name: 'escort',
                //   id: 'pescort',
                //   title: 'Escort Location',
                //   validationProps: {
                //     required: 'This is a mandatory field'
                //   },

                // },
                // {
                //   type: 'mappl',
                //   name: 'officeLocation',
                //   id: 'officeLocation',
                //   title: 'Office Location',
                //   validationProps: {
                //     required: 'This is a mandatory field'
                //   },

                // },

                // {
                //   type: 'select',
                //   name: 'country',
                //   id: 'country',
                //   title: 'Country',
                //   options: [
                //     { title: 'India', value: 'ind' },
                //     { title: 'South Africa', value: 'sa' }
                //   ]
                // },
                // {
                //   type: 'radio',
                //   name: 'gender',
                //   id: 'gender',
                //   title: 'Gender',
                //   options: [{ title: "Male", value: "Male" }, { title: "Female", value: "Female" }, { title: "Others", value: "Others" }]
                // }
              ],
            },
          ],
        },
      },
      {
        layout: {},
        title: 'Upload Documents',
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
                    column: 2,
                    spacing: 2,
                    size: 'medium',
                    label: 'fixed',
                  },
                  sectionName: 'addressname',
                  sectiontitle: 'Address Proof and Doc',
                  fields: [
                    {
                      type: 'autocomplete',
                      name: 'addressProofDocTpye',
                      id: 'addressProofDocTpye',
                      title: 'Address Proof Type',
                      validationProps: {
                        required: 'This is a mandatory field',
                      },
                      options: [
                        {title: 'Aadhar', value: 'Aadhar'},
                        {title: 'PAN', value: 'PAN'},
                        {title: 'Driving License', value: 'Driving License'},
                        {title: 'Passport', value: 'Passport'},
                        {title: 'Voter ID', value: 'Voter ID'},
                        {title: 'Other', value: 'Other'},
                      ],
                    },
                    {
                      type: 'file',
                      name: 'addressdoc',
                      id: 'addressdoc',
                      title: 'Upload Document',

                      tempFilename: data?.addressProofDoc?.split('/')[2],
                      validationProps: data?.addressProofDoc
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
                  type: 'section',
                  layout: {
                    column: 2,
                    spacing: 2,
                    size: 'medium',
                    label: 'fixed',
                  },
                  sectionName: 'identitydoc',
                  sectiontitle: 'Identity Proof and doc',
                  fields: [
                    {
                      type: 'autocomplete',
                      name: 'identityProofDocTpye',
                      id: 'identityProofDocTpye',
                      title: 'Identity Proof Type',
                      validationProps: {
                        required: 'This is a mandatory field',
                      },
                      disabled: true,
                      options: [
                        {title: 'Aadhar', value: 'Aadhar'},
                        {title: 'PAN', value: 'PAN'},
                        {title: 'Driving License', value: 'Driving License'},
                        {title: 'Passport', value: 'Passport'},
                        {title: 'Voter ID', value: 'Voter ID'},
                        {title: 'Other', value: 'Other'},
                      ],
                    },
                    {
                      type: 'file',
                      name: 'identitydoc',
                      id: 'identitydoc',
                      title: 'Upload Document',
                      disabled: true,

                      tempFilename: data?.identityProofDoc?.split('/')[2],
                      validationProps: data?.identityProofDoc
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
                  type: 'text',
                  name: 'armsLicence',
                  id: 'armsLicence',
                  title: 'Arms License No.',
                  pattern: {
                    value: regex.maxSize30,
                    message: 'Please enter valid Arms License No.',
                  },
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },
                {
                  type: 'radio',
                  name: 'specialTraings',
                  id: 'specialTraings',
                  title: 'Special Training',
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                  options: [
                    {title: 'Allow', value: 'Allow'},
                    {title: 'Disallow', value: 'Disallow'},
                  ],
                },
                {
                  type: 'radio',
                  name: 'armsStatus',
                  id: 'armsStatus',
                  title: 'Arm Status',
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                  options: [
                    {title: 'Verified', value: 'Verify'},
                    {title: 'Not verifed', value: 'Non-verify'},
                  ],
                },

                // {
                //   type: "section",
                //   layout: { column: 2, spacing: 2, size: 'medium', label: 'fixed' },
                //   fields: [
                // {
                //   type: 'text',
                //   name: 'armsLicence',
                //   id: 'armsLicence',
                //   title: 'Arms License No.',
                //   pattern: {
                //     value: regex.maxSize30,
                //     message: 'Please enter valid Arms License No.'
                //   },
                //   validationProps: {
                //     required: 'This is a mandatory field'
                //   }
                // },
                // {
                //   type: 'file',
                //   name: 'dldoc',
                //   id: 'dldoc',
                //   title: 'Upload Document',
                //   accept: 'image/*,.pdf,.doc,.docx',

                // },
                // {
                //   type: 'radio',
                //   name: 'specialTraings',
                //   id: 'specialTraings',
                //   title: 'Special Training',
                //   validationProps: {
                //     required: 'This is a mandatory field'
                //   },
                //   options: [
                //     { title: 'Allow', value: 'Allow' },
                //     { title: 'Disallow', value: 'Disallow' }
                //   ]
                // },
                // {
                //   type: 'radio',
                //   name: 'armsStatus',
                //   id: 'armsStatus',
                //   title: 'Arm Status',
                //   validationProps: {
                //     required: 'This is a mandatory field'
                //   },
                //   options: [
                //     { title: 'Verified', value: 'Verify' },
                //     { title: 'Not verifed', value: 'Non-verify' }
                //   ]
                // },
                //   ]
                // },

                {
                  type: 'section',
                  layout: {
                    column: 2,
                    spacing: 2,
                    size: 'medium',
                    label: 'fixed',
                  },
                  sectionName: 'policeverification',
                  sectiontitle: 'Police verification and Doc',
                  fields: [
                    {
                      type: 'radio',
                      name: 'policeVerStatus',
                      id: 'policeVerStatus',
                      title: 'Police Verification',
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
                      name: 'policeVericationNo',
                      id: 'policeVericationNo',
                      title: 'Police Verification No.',
                      pattern: {
                        value: regex.maxSize30,
                        message:
                          'Please enter valid Police Verification No. with max 30 characters',
                      },
                      dynamic: {
                        field: 'policeVerStatus',
                        value: 'Yes',
                      },
                      validationProps: {
                        required: 'This is a mandatory field',
                      },
                    },
                    {
                      type: 'file',
                      name: 'policedoc',
                      id: 'policedoc',
                      title: 'Upload Document',
                      dynamic: {
                        field: 'policeVerStatus',
                        value: 'Yes',
                      },
                      tempFilename: data?.policeVerDoc?.split('/')[2],
                      validationProps: data?.policeVerDoc
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
  const handleSubmit = async (values) => {
    if (values?.close) {
      popBTNClick(false);
      return;
    }
    //  )
    setshowbtn(false);
    if (values.button.toUpperCase() === 'UPDATE') {
      let dataSet = {};
      let allElem = {};
      let tem = values?.data;

      (tem.address = {
        pinCode: values?.data?.temppincode,
        state: values?.data?.tempstate,
        city: values?.data?.temptown,
        addressName:
          values?.data?.tempaddress + '++' + values?.data?.tempaddressAREA,
      }),
        //   tem.escortLocation = {
        //     "locName": values?.data?.tempescort?.area,
        //     "latitude": values?.data?.tempescort?.mapPosition?.lat,
        //     "longitude": values?.data?.tempescort?.mapPosition?.lng,
        //   }
        (tem.vendorId = user?.userList?.tanentId);
      tem.vendorName = user?.userList?.tanentName;
      tem.vendorCode = user?.userList?.tanentCode;
      tem.corporateId = CorpId;
      tem.officeLocation = values?.data?.tempofficeLocation?.area;
      delete tem.tempaddress;
      delete tem.temptown;
      delete tem.tempstate;
      delete tem.temppincode;
      delete tem.tempaddressAREA;
      delete tem.tempofficeLocation;
      // if (tem?.bankNameTemp) delete tem.bankNameTemp;
      if (!tem?.addressdoc?.length) delete tem.addressdoc;
      if (!tem?.identitydoc?.length) delete tem.identitydoc;
      if (!tem?.policedoc?.length) delete tem.policedoc;
      if (!tem?.photo?.length) delete tem.photo;
      if (tem.tempescort) delete tem.tempescort;
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
        url: api.escort.createform,
        data: getFormData(dataSet),
        headers: {'Content-Type': 'multipart/form-data'},
      })
        .then(function (response) {
          if (response?.status == 200) {
            toast.success(
              `${
                response?.data?.data?.firstName +
                ' ' +
                response?.data?.data?.lastName
              }'s details updated successfully`,
            );
            // toast.success('Details has been successfully updated.');
            popBTNClick(false);
            // window.location.reload();
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

  return (
    <>
      {/* {!showbtn ?
        <AppLoader />
        : null} */}
      {data && data.id && (
        <PopEdit
          defaultValues={data}
          template={stepperTemplate}
          openDialog={openDialog}
          mode='onTouched'
          // watchFields={['firstname', 'include_portfolio', 'email', 'country']}
          // validate={validate}
          title={data?.firstName + ' ' + data?.lastName}
          showbtn={showbtn}
          popAction={handleSubmit}
          // buttons={['submit']}
          onChange={handleChange}
          // setVal={[{ name: "tempaddress", value: data?.address?.addressName }, { name: "temptown", value: data?.address?.city }, { name: "tempstate", value: data?.address?.state }, { name: "temppincode", value: data?.address?.pinCode }]}
          oldFormType={'STEPPER'}
        />
      )}
    </>
  );
};

export default EscortEdit;
