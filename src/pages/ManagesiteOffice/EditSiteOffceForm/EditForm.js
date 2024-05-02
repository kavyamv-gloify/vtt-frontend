/* eslint-disable */
import React from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import Steppers from '@smart-form/stepper';
import {useAuthUser} from '@crema/utility/AuthHooks';
import regex from '@regex';
import api from '@api';
import axios from 'axios';
// import { useParams } from 'react-router-dom';
import {useEffect, useState} from 'react';
import AppLoader from '@crema/core/AppLoader';
import {toast} from 'react-toastify';
import {BatteryCharging50} from '@mui/icons-material';
import SettingsIcon from '@mui/icons-material/Settings';
import PopEdit from '@editpopup';
import Api from '@api';
import {compareAsc} from 'date-fns';

const CorporateForm = ({id, popBTNClick, openDialog, tenantdata, domain}) => {
  const navigate = useNavigate();
  const {user} = useAuthUser();
  // const { id } = useParams();
  const [data, setData] = useState();
  const [showbtn, setshowbtn] = useState(true);
  const [mobileNo, setMobileNo] = useState();
  const [mobileCheck, setMobileCheck] = useState();
  const [company, setCompany] = useState();
  const userSiteOfficeDetail = async () => {
    const baseURL = `${api.siteOffice.list}/${id}`;
    let response = await axios.get(`${baseURL}`);

    setData(response.data.data);
  };

  useEffect(() => {
    userSiteOfficeDetail();
  }, [id]);

  let stepperTemplate = {
    title: ' Register Site Office Form',
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
                  type: 'hidden',
                  name: 'companyName',
                  id: 'companyName',
                  title: 'Company Name',
                  disabled: true,
                  defaultValue: data?.companyName,
                  pattern: {
                    value: regex.maxSize50,
                    message:
                      'Please enter valid Company Name and below 50 characters',
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
                  type: 'hidden',
                  name: 'companyCode',
                  id: 'companyCode',
                  title: 'Company Code',
                  disabled: true,
                  defaultValue: data?.companyCode,
                  // validationProps: {
                  //     required: 'This is a mandatory field'
                  // }
                },
                {
                  type: 'hidden',
                  name: 'companyId',
                  id: 'companyId',
                  title: 'Company Id',
                  defaultValue: user?.userList?.profileId,
                  // validationProps: {
                  //     required: 'This is a mandatory field'
                  // }
                },
                {
                  type: 'text',
                  name: 'officeName',
                  id: 'officeName',
                  title: 'Office Name',
                  disabled: true,
                  pattern: {
                    value: regex.companyreg,
                    message:
                      'Please enter valid Office Name with alpha-numeric and below 50 characters',
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
                  sectionName: 'officeLocation',
                  sectiontitle: 'office Location',
                  fields: [
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
                      name: 'tempofficeAddresstown',
                      id: 'tempofficeAddresstown',
                      title: 'Town/City ',
                      disabled: true,
                      defaultValue: data?.officeAddress?.city,
                      // validationProps: {
                      //     required: 'This is a mandatory field'
                      // },
                      pattern: {
                        value: regex.adreesschar50,
                        message:
                          'Please enter valid Town/City with max 50 characters ',
                      },
                    },
                    {
                      type: 'text',
                      name: 'tempofficeAddressstate',
                      id: 'tempofficeAddressstate',
                      title: 'State ',
                      defaultValue: data?.officeAddress?.state,
                      disabled: true,
                      validationProps: {
                        required: 'This is a mandatory field',
                      },
                      pattern: {
                        value: regex.adreesschar50,
                        message:
                          'Please enter valid State with max 50 characters',
                      },
                    },
                    {
                      type: 'text',
                      name: 'tempofficeAddresspincode',
                      id: 'tempofficeAddresspincode',
                      disabled: true,
                      title: 'Pincode ',
                      defaultValue: data?.officeAddress?.pinCode,
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
          ],
        },
      },
      {
        layout: {},
        title: 'Contact Person Details',
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
                    column: 3,
                    spacing: 2,
                    size: 'medium',
                    label: 'fixed',
                  },
                  sectionName: 'contactperson',
                  sectiontitle: 'Contact Person Detail',
                  fields: [
                    {
                      type: 'text',
                      name: 'contactPersonFirstName',
                      id: 'contactPersonFirstName',
                      disabled: true,
                      title: ' First Name',
                      disabled: false,
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
                      title: ' Last Name',
                      disabled: true,
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
                  sectionName: 'email',
                  sectiontitle: 'Email Id',
                  fields: [
                    {
                      type: 'text',
                      name: 'emailId',
                      id: 'emailId',
                      title: 'Email Id',
                      disabled: true,
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
                  ],
                },

                {
                  type: 'section',
                  layout: {
                    column: 3,
                    spacing: 2,
                    size: 'medium',
                    label: 'fixed',
                  },
                  sectionName: 'phonenumber',
                  sectiontitle: 'Phone/Landline',
                  fields: [
                    {
                      type: 'text',
                      name: 'mobileNo',
                      id: 'mobileNo',
                      title: 'Mobile No.',
                      disabled: true,
                      maxChar: 10,
                      isNumber: true,
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
                      disabled: true,
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
                            message:
                              'Landline should be different from mobileNo.',
                          },
                        ],
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

  useEffect(() => {
    axios
      .get(
        Api.baseUri + `/user-reg/corporate-reg/${user?.userList?.corporateId}`,
      )
      .then((res) => {
        console.log('res', res);
        setCompany(res?.data?.data);
      })
      .catch((err) => {
        console.log('err', err);
      });
  }, []);

  const handleSubmit = async (values) => {
    if (values?.close) {
      popBTNClick(false);
      return;
    }
    if (values.button.toUpperCase() === 'UPDATE') {
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

      let dataSet = {};
      dataSet = values.data;
      dataSet.companyName = company?.companyName;
      // tenantdata?.companyName ?? user?.userList?.corporateName;
      dataSet.companyCode = company?.companyCode;
      // tenantdata?.companyCode ?? user?.userList?.corporateCode;
      // dataSet.corporateId
      console.log('user', user);
      console.log('dataSet', dataSet);

      axios({
        method: 'put',
        url: api.siteOffice.list,
        data: dataSet,
        // data: getFormData(dataSet),
        headers: {'Content-Type': 'application/json'},
      })
        .then(function (response) {
          //handle success
          if (response.data.status == '200') {
            toast.success(
              `${response?.data?.data?.companyName} details updated successfully`,
            );
            // toast.success('Details has been successfully updated.');
            popBTNClick(false);
            // navigate(`/onbordCorporate/siteOffice/siteoffice-listing`);
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
  };

  useEffect(() => {
    if (!mobileNo) {
      return;
    }
    axios
      .get(`${Api.baseUri}/userauth/user-account/${mobileNo}/mobile`)
      .then((r) => {
        if (r?.data == 'User Present') setMobileCheck(false);
        else setMobileCheck(true);
      })
      .catch((er) => {
        setMobileCheck(true);
      });
  }, [mobileNo]);

  function myGetData(d) {
    if (d?.mobileNo?.length == 10) {
      setMobileNo(d?.mobileNo);
    }
  }

  return (
    <>
      {!showbtn ? <AppLoader /> : null}
      {data && data.id && (
        <PopEdit
          title={data?.companyName}
          defaultValues={data}
          template={stepperTemplate}
          openDialog={openDialog}
          popAction={handleSubmit}
          setVal={[
            {name: 'tempofficeAddresstown', value: data?.officeAddress?.city},
            {name: 'tempofficeAddressstate', value: data?.officeAddress?.state},
            {
              name: 'tempofficeAddresspincode',
              value: data?.officeAddress?.pinCode,
            },
          ]}
          onChange={handleChange}
          getOnInput={myGetData}
          oldFormType={'STEPPER'}
          icons={{
            1: <SettingsIcon />,
            2: <SettingsIcon />,
            3: <SettingsIcon />,
          }}
          clearErr={[{name: 'mobileNo', value: mobileCheck}]}
          // seterrors={[{ name: "mobileNo", type: "customized", message: "Number already exist", error: !mobileCheck }]}
        />
      )}
    </>
  );
};

export default CorporateForm;
