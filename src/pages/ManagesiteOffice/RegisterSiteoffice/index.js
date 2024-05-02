/* eslint-disable */
import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import Steppers from '@smart-form/stepper';
import {useAuthUser} from '@crema/utility/AuthHooks';
import regex from '@regex';
import api from '@api';
import axios from 'axios';
import {toast} from 'react-toastify';
import AppLoader from '@crema/core/AppLoader';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import Api from '@api';
import {DoneAll} from '@mui/icons-material';

const CorporateCreateForm = ({close, domain}) => {
  const navigate = useNavigate();
  const {user} = useAuthUser();
  const [showbtn, setshowbtn] = useState(true);
  const [mobileNo, setMobileNo] = useState();
  const [mobileCheck, setMobileCheck] = useState();

  let stepperTemplate = {
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
        title: 'Details',
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
                  defaultValue: user?.userList?.corporateName,
                  infoMessage: [
                    'Alphabets are allowed',
                    'Maximum length should be 50 characters',
                    'e.g.:SRT Infotech',
                  ],

                  disabled: true,
                  pattern: {
                    value: regex.maxSize50,
                    message:
                      'Please enter valid Company Name with alpha-numeric and below 50 characters',
                  },
                  // validationProps: {
                  //     required: 'This is a mandatory field'
                  // }
                },
                {
                  type: 'hidden',
                  name: 'tanentId',
                  id: 'tanentId',
                  defaultValue: user?.userList?.tanentId,
                },
                {
                  type: 'hidden',
                  name: 'tanentCode',
                  id: 'tanentCode',
                  defaultValue: user?.userList?.tanentCode,
                },
                {
                  type: 'hidden',
                  name: 'tanentName',
                  id: 'tanentName',
                  defaultValue: user?.userList?.tanentName,
                },
                {
                  type: 'text',
                  name: 'companyCode',
                  id: 'companyCode',
                  title: 'Company Code',
                  // defaultValue: user?.userList?.corporateCode,
                  disabled: true,
                  // pattern: {
                  //     value: regex.maxSize50,
                  //     message: 'Please enter alpha-numeric and below 50 characters'
                  // },
                  // validationProps: {
                  //     required: 'This is a mandatory field'
                  // }
                },
                {
                  type: 'hidden',
                  name: 'corporateId',
                  id: 'corporateId',
                  title: 'Company Id',
                  disabled: true,
                  defaultValue: user?.userList?.profileId,
                  // pattern: {
                  //     value: regex.maxSize50,
                  //     message: 'Please enter alpha-numeric and below 50 characters'
                  // },
                  // validationProps: {
                  //     required: 'This is a mandatory field'
                  // }
                },
                {
                  type: 'text',
                  name: 'officeName',
                  id: 'officeName',
                  title: 'Office Name',

                  infoMessage: [
                    'Alphanumeric characters are allowed',
                    'Maximum length should be 50 characters',
                    'e.g.:SRT Infotech',
                  ],
                  pattern: {
                    value: regex.companyreg,
                    message:
                      'Please enter valid Office Name and below 50 characters',
                  },
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },
                {
                  type: 'mappl',
                  name: 'location',
                  id: 'location',
                  title: 'Office Location',
                  distribute: [
                    {name: 'tempofficeAddresstown', value: 'city'},
                    {name: 'tempofficeAddressstate', value: 'state'},
                    {name: 'tempofficeAddresspincode', value: 'pincode'},
                  ],
                  infoMessage: [
                    'Alphanumeric characters are allowed',
                    'Maximum length should be 50  characters',
                    'e.g.: Noida Sector 48, UP ',
                  ],
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                  // pattern: {
                  //     value: regex.maxSize50,
                  //     message: 'Please enter alpha-numeric and below 50 characters'
                  // },
                },

                {
                  type: 'text',
                  name: 'tempofficeAddresstown',
                  id: 'tempofficeAddresstown',
                  title: 'Town/City ',
                  infoMessage: [
                    'Alphabets are allowed',
                    'Maximum length should be 50  characters',
                    'e.g.: Noida ',
                  ],
                  // validationProps: {
                  //     required: 'This is a mandatory field'
                  // },
                  pattern: {
                    value: regex.adreesschar50,
                    message:
                      'Please enter valid City Name with max 50 characters',
                  },
                },
                {
                  type: 'text',
                  name: 'tempofficeAddressstate',
                  id: 'tempofficeAddressstate',
                  title: 'State ',
                  infoMessage: [
                    'Alphabets are allowed',
                    'Maximum length should be 50  characters',
                    'e.g.: UP ',
                  ],
                  // validationProps: {
                  //     required: 'This is a mandatory field'
                  // },
                  pattern: {
                    value: regex.adreesschar50,
                    message:
                      'Please enter valid City Name with max 50 characters',
                  },
                },
                {
                  type: 'text',
                  name: 'tempofficeAddresspincode',
                  id: 'tempofficeAddresspincode',
                  title: 'Pincode ',
                  infoMessage: [
                    'Numeric characters are allowed',
                    'Maximum length should be 6 characters',
                    'e.g.: 201301',
                  ],
                  // validationProps: {
                  //     required: 'This is a mandatory field'
                  // },
                  pattern: {
                    value: regex.pincodeRegex,
                    message: 'Please enter valid Pincode ',
                  },
                },
              ],
            },
          ],
        },
      },
      {
        layout: {},
        title: 'Contact Person Details',
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
                  name: 'contactPersonFirstName',
                  id: 'contactPersonFirstName',
                  title: ' First Name',
                  disabled: false,
                  infoMessage: [
                    'Only Alphabhets are allowed',
                    'Maximum length should be 50 characters',
                    'e.g.: XYZ',
                  ],
                  pattern: {
                    value: regex.char50,
                    message:
                      'Please enter valid First Name and below 50 characters',
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
                    'Only Alphabhets are allowed',
                    'Maximum length should be 50 characters',
                    'e.g.: Sharma',
                  ],
                  disabled: false,
                  pattern: {
                    value: regex.char50,
                    message:
                      'Please enter valid Last Name and below 50 characters',
                  },
                  validationProps: {
                    // required: 'This is a mandatory field'
                  },
                },
                {
                  type: 'text',
                  name: 'emailId',
                  id: 'emailId',
                  title: 'Email Id',
                  infoMessage: [
                    'Alphanumeric characters are allowed',
                    'Maximum length should be 30 characters & should include @',
                    'Should have domain name',
                    'e.g.: xyz45@gmail.com',
                  ],
                  pattern: {
                    value: regex.emailReg,
                    message: 'Please enter valid Email Id',
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
                // {
                //     type: 'text',
                //     name: 'mobileNo',
                //     id: 'mobileNo',
                //     title: 'Mobile No.',
                //     pattern: {
                //         value: regex.phoneReg,
                //         message: 'Please enter valid mobile number'
                //       },
                //     validationProps: {
                //         required: 'This is a mandatory field'
                //     }
                // },
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
                  name: 'landLineNo',
                  id: 'landLineNo',
                  title: 'Landline No.',
                  isNumber: true,
                  maxChar: 18,
                  infoMessage: [
                    'Numeric characters are allowed',
                    'Maximum length should be 15 characters',
                    'e.g.: 01125645635',
                  ],
                  pattern: {
                    value: regex.landlineReg,
                    message: 'Please enter valid landline number',
                  },
                  validationProps: {
                    manual: [
                      {
                        condition: `mobileNo != landLineNo`,
                        message: 'Landline should be different from mobileNo.',
                      },
                    ],
                  },
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
    if (values.button.toUpperCase() === 'SUBMIT') {
      setshowbtn(false);
      // values.data.location = {
      //     "locName": values?.data?.templocation?.area,
      //     "longitude": values?.data?.templocation?.mapPosition?.lng,
      //     "latitude": values?.data?.templocation?.mapPosition?.lat,
      // }
      values.data.officeAddress = {
        city: values?.data?.tempofficeAddresstown,
        state: values?.data?.tempofficeAddressstate,
        pinCode: values?.data?.tempofficeAddresspincode,
        addressName: values?.data?.tempofficeAddressone,
      };

      if (values?.data?.tempofficeAddressone)
        delete values?.data?.tempofficeAddressone;
      if (values?.data?.tempofficeAddresstown)
        delete values?.data?.tempofficeAddresstown;
      if (values?.data?.tempofficeAddressstate)
        delete values?.data?.tempofficeAddressstate;
      if (values?.data?.tempofficeAddresspincode)
        delete values?.data?.tempofficeAddresspincode;
      // if (values?.data?.templocation) delete values?.data?.templocation;

      if (values.button.toUpperCase() === 'SUBMIT') {
        let dataSet = {};
        dataSet = values.data;
        dataSet.companyName = user?.userList?.corporateName;
        dataSet.companyCode = user?.userList?.corporateCode;
        // dataSet.corporateId
        dataSet.status = 'ACTIVE';

        axios({
          method: 'post',
          url: api.siteOffice.list,
          data: dataSet,
          // data: getFormData(dataSet),
          headers: {'Content-Type': 'application/json'},
        })
          .then(function (response) {
            //handle success
            if (response.data.status == '200') {
              toast.success('Details has been successfully submitted.');
              navigate(`/onbordCorporate/siteOffice/siteoffice-listing`);
              close(false);
              // window.location.reload();
            } else {
              // navigate(`/superadmin/table`);
              setshowbtn(true);
              toast.error(response?.data?.message ?? 'Something went wrong');
            }
          })
          .catch(function (response) {
            toast.error(response?.data?.message ?? 'Something went wrong');
            //handle error
            setshowbtn(true);
          });
      }
    }
  };

  function myGetData(d) {
    if (d?.mobileNo?.length == 10) {
      setMobileNo(d?.mobileNo);
    }
  }

  useEffect(() => {
    if (!mobileNo) {
      return;
    }
    axios
      .get(`${Api?.baseUri}/userauth/user-account/${mobileNo}/mobile`)
      .then((r) => {
        if (r?.data == 'User Present') setMobileCheck(false);
        else setMobileCheck(true);
      })
      .catch((er) => {
        setMobileCheck(true);
      });
  }, [mobileNo]);

  return (
    <>
      {!showbtn ? <AppLoader /> : null}
      <Steppers
        // defaultValues={cummyData}
        template={stepperTemplate}
        // watchFields={['firstname', 'include_portfolio', 'email', 'country']}
        // validate={validate}

        afterSubmit={handleSubmit}
        icons={{1: <SettingsIcon />, 2: <PersonIcon />}}
        mode='onTouched'
        clearErr={[{name: 'mobileNo', value: mobileCheck}]}
        // seterrors={[{ name: "mobileNo", type: "customized", message: "Number already exist", error: !mobileCheck }]}
        getOnInput={myGetData}
        setVal={[{name: 'companyCode', value: user?.userList?.corporateCode}]}
        // buttons={['submit']}
        onChange={handleChange}
      />
    </>
  );
};

export default CorporateCreateForm;
