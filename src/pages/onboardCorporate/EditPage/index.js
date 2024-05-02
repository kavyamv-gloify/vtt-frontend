/* eslint-disable */
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import api from '@api';
import regex from '@regex';
import {toast} from 'react-toastify';
import AppLoader from '@crema/core/AppLoader';
import {useAuthUser} from '@crema/utility/AuthHooks';
import PopEdit from '@editpopup';
const EditForm = ({id, popBTNClick, openDialog, getFilterData}) => {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [mytempifsc, setMytempifsc] = React.useState();
  const [branchData, setbranchData] = React.useState();
  const [bankNameVal, setbankNameVal] = React.useState();
  const [showbtn, setshowbtn] = React.useState(true);
  const [showTick, setshowTick] = React.useState();
  const [address, setAddress] = React.useState([]);
  const [domainList, setDomainList] = useState([]);
  const [mobileExists, setMobileExists] = useState(false);
  const [mobileNo, setMobileNo] = useState();
  const [email, setEmail] = useState();
  const [emailExists, setEmailExists] = useState(false);
  const {user} = useAuthUser();
  console.log("id", id)
  useEffect(() => {
    async function fetchData() {
      const baseURL = `${api.onBoardCorporate.list}/${id}`;
      axios
        .get(`${baseURL}`)
        .then((response) => {
          let tempo = response?.data?.data;
          tempo.tempaccountNumber = tempo.accountNumber;
          setData(tempo);
        })
        .catch((err) => {
          setData({});
        });
    }
    fetchData();
    const baseURL =
      api.baseUri + `/user-reg/corporate-reg/${id}`;
   
    axios
      .get(`${baseURL}`)
      .then((response) => {
        console.log('user', user);
        console.log('response', response?.data);
        let temArr = [];
        response.data.data?.domains?.map((el) => {
          temArr.push({title: el, value: el});
        });
        console.log('temArr', temArr);
        setDomainList(temArr ?? []);
      })
      .catch((err) => {
        setDomainList([]);
      });
  }, []);

  useEffect(() => {
    if (data?.companyAddress?.length) {
      let officeAddress = data?.companyAddress;
    }
  }, [data]);

  let stepperTemplate = {
    title: 'Corporate Onboarding Form',
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
        title: 'Corporate Details',
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
                  type: 'section',
                  layout: {
                    column: 2,
                    spacing: 2,
                    size: 'medium',
                    label: 'fixed',
                  },
                  sectionName: 'regDetails',
                  sectiontitle: 'Registration Details',
                  fields: [
                    {
                      type: 'text',
                      name: 'companyRegNo',
                      id: 'companyRegNo',
                      title: 'Registration No.',
                      infoMessage: [
                        'Alphanumeric characters are allowed',
                        'Maximum length should be 30 characters',
                        'e.g.:LU12345DL2022',
                      ],
                      disDate: ['2022-08-07T00:00', '2022-08-08T00:00'],
                      pattern: {
                        value: regex.maxSize30,
                        message: 'Please enter valid registration no. ',
                      },
                    },
                    {
                      type: 'file',
                      name: 'regfile',
                      id: 'regfile',
                      tempFilename: data?.companyRegDoc,
                      title: 'Upload Registration certificate',
                      accept: 'image/*,.pdf,.doc,.docx',
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
                  type: 'section',
                  sectionName: 'gstDetails',
                  sectiontitle: 'GST Details',
                  layout: {
                    column: 2,
                    spacing: 2,
                    size: 'medium',
                    label: 'fixed',
                  },
                  fields: [
                    {
                      type: 'text',
                      name: 'companyGSTN',
                      id: 'companyGSTN',
                      title: 'GSTIN No.',
                      infoMessage: [
                        'Alphanumeric characters are allowed',
                        'Maximum length should be 15 characters .',
                        'e.g.:07AAGFF2194N1Z1',
                      ],
                      pattern: {
                        value: regex.gstReg,
                        message: 'Please enter valid GST number',
                      },
                      validationProps: {
                        required: 'This is a mandatory field',
                      },
                    },
                    {
                      type: 'file',
                      name: 'gstnfile',
                      id: 'gstnfile',
                      title: 'Upload GST certificate',
                      tempFilename: data?.companyGstnDoc,
                      infoMessage: [
                        'Should only accept PDF,JPEG files',
                        'File should contain file extension',
                        'e.g.:Shub.jpeg',
                      ],
                      accept: 'image/*,.pdf,.doc,.docx',
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
                  type: 'section',
                  sectionName: 'panDetails',
                  sectiontitle: 'PAN Details',
                  layout: {
                    column: 2,
                    spacing: 2,
                    size: 'medium',
                    label: 'fixed',
                  },
                  fields: [
                    {
                      type: 'text',
                      name: 'companyPAN',
                      id: 'companyPAN',
                      title: 'PAN No.',
                      infoMessage: [
                        'Alphanumeric characters are allowed',
                        'Maximum length should be 10 characters .',
                        'e.g.:BNZPM2501F',
                      ],
                      pattern: {
                        value: regex.panReg,
                        message: 'Please enter valid PAN number',
                      },
                    },
                    {
                      type: 'file',
                      name: 'panfile',
                      id: 'panfile',
                      title: 'Upload PAN card',
                      tempFilename: data?.companyPanDoc,
                      infoMessage: [
                        'Should only accept PDF,JPEG files',
                        'File should contain file extension',
                        'e.g.:Shub.jpeg',
                      ],
                      accept: 'image/*,.pdf,.doc,.docx',
                      validationProps: {
                        size: {
                          value: 5,
                          message: 'File size should not be more than 1mb.',
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
        title: 'Contact Person Details',
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
                  name: 'contactPersonFirstName',
                  id: 'contactPersonFirstName',
                  title: ' First Name',
                  infoMessage: [
                    'Only alphabets are allowed.',
                    'Maximum length should be 50 characters.',
                    'Ex-XYZ.',
                  ],
                  pattern: {
                    value: regex.char50,
                    message: 'Please enter valid name with max 50 characters',
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
                    'Only alphabets are allowed.',
                    'Maximum length should be 50 characters.',
                    'Ex-Sharma.',
                  ],
                  pattern: {
                    value: regex.char50,
                    message: 'Please enter valid name with max 50 characters',
                  },
                  validationProps: {
                    // required: 'This is a mandatory field'
                  },
                },
                {
                  type: 'section',
                  sectionName: 'emailId',
                  sectiontitle: 'Email Id',
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
                      title: 'Email Id',
                      // defaultValue: data?.domain,
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
                            condition: `emailId domainCheck domains`,
                            message: 'Domain name did not match',
                          },
                        ],
                      },
                    },
                    {
                      type: 'multiSelect',
                      name: 'domains',
                      id: 'domains',
                      title: 'Domains',
                      options: domainList ?? [],
                      infoMessage: [
                        'Dropdown values are selectable',
                        'e.g.: @gmail.com etc.',
                      ],
                      // infoMessage: ["Alphanumeric characters are allowed", "Maximum length should be 30 characters & should include @", "Should have domain name", "e.g.: xyz45@gmail.com"],
                      pattern: {
                        value: regex.emailReg,
                        message: 'Please enter valid Email Id',
                      },
                      validationProps: {
                        required: 'This is a mandatory field',
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
                  sectionName: 'contactDetails',
                  sectiontitle: 'Contact Details',
                  fields: [
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
                        message: 'Please enter valid mobile number',
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
                      infoMessage: [
                        'Numeric characters are allowed',
                        'Maximum length should be 15 characters',
                        'e.g.: 01125645635',
                      ],
                      pattern: {
                        value: regex.landlineReg,
                        message: 'Please enter valid landline number',
                      },
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
      {
        layout: {},
        title: 'Bank Details',
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
                  type: 'text',
                  name: 'accountName',
                  id: 'accountName',
                  title: 'Name of account holder',
                  infoMessage: [
                    'Only alphabets are allowed.',
                    'Maximum length should be 50 characters.',
                    'Ex-XYZ Sharma',
                  ],
                  pattern: {
                    value: regex.maxSize50,
                    message:
                      'Please enter valid account holder name with max 50 characters',
                  },
                },
                {
                  type: 'section',
                  sectionName: 'accountNumber',
                  sectiontitle: 'Bank Account Number',
                  layout: {
                    column: 2,
                    spacing: 2,
                    size: 'medium',
                    label: 'fixed',
                  },
                  fields: [
                    {
                      type: 'password',
                      name: 'tempaccountNumber',
                      id: 'tempaccountNumber',
                      defaultValue: data?.tempaccountNumber,
                      title: 'Bank Account No.',
                      infoMessage: [
                        'Numeric characters are allowed',
                        'Maximum length should be 10 characters',
                        'e.g.: 9058906780',
                      ],
                      pattern: {
                        value: regex.acountNoReg,
                        message: 'Please enter valid bank account number',
                      },
                      validationProps: {
                        required: 'This is a mandatory field',
                      },
                    },
                    {
                      type: 'text',
                      name: 'accountNumber',
                      id: 'accountNumber',
                      title: 'Confirm Bank Account No.',
                      defaultValue: data?.accountNumber,
                      infoMessage: [
                        'Numeric characters are allowed',
                        'Maximum length should be 10 characters',
                        'e.g.: 9058906780',
                      ],
                      pattern: {
                        value: regex.acountNoReg,
                        message: 'Please enter valid bank account number',
                      },
                      validationProps: {
                        manual: [
                          {
                            condition: `tempaccountNumber == accountNumber`,
                            message: 'Account number did not match',
                          },
                        ],
                        required: 'This is a mandatory field',
                      },
                    },
                  ],
                },
                {
                  type: 'section',
                  sectionName: 'accountSection',
                  sectiontitle: 'Bank Details',
                  layout: {
                    column: 2,
                    spacing: 2,
                    size: 'medium',
                    label: 'fixed',
                  },
                  fields: [
                    {
                      type: 'text',
                      name: 'ifscCode',
                      id: 'ifscCode',
                      title: 'IFSC Code',
                      maxChar: 11,
                      isUpper: true,
                      infoMessage: [
                        'Alphanumeric characters are allowed',
                        'Maximum length should be 10 characters',
                        'e.g.: SBIN000456',
                      ],
                      pattern: {
                        value: regex.ifscReg,
                        message: 'Please enter valid IFSC code',
                      },
                      validationProps: {
                        required: 'This is a mandatory field',
                      },
                    },
                    {
                      type: 'text',
                      name: 'bankName',
                      id: 'bankName',
                      title: 'Bank Name',
                      infoMessage: [
                        'Bank name should be autofetched through IFSC code',
                      ],
                      disabled: true,
                    },
                    {
                      type: 'text',
                      name: 'branchName',
                      id: 'branchName',
                      title: 'Branch Name',
                      infoMessage: [
                        'Branch name should be autofetched through IFSC code',
                      ],
                      disabled: true,
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

  const handleSubmit = async (values) => {
    //
    //
    if (values?.close) {
      popBTNClick(false);
      return;
    }
    if (
      values?.data?.accountNumber &&
      values?.data?.tempaccountNumber &&
      values?.data?.accountNumber != values?.data?.tempaccountNumber
    ) {
      setshowbtn(true);
      return;
    }
    setshowbtn(false);
    let dataSet = {};
    let allElem = {};
    let tem = values?.data;
    if (tem?.domain && typeof tem?.domain != 'string')
      tem.domain = tem?.domain?.join();
    tem.companyAddress = data.companyAddress;
    // {
    //   "addressName": values?.data?.tempcompanyAddressOne,
    //   "pinCode": values?.data?.tempcompanyAddresspincode,
    //   "state": values?.data?.tempcompanyAddressstate,
    //   "city": values?.data?.tempcompanyAddresstown
    // }
    tem.profileStatus = 'ACTIVE';
    if (!tem?.regfile?.length) delete tem.regfile;
    if (!tem?.gstnfile?.length) delete tem.gstnfile;
    if (!tem?.panfile?.length) delete tem.panfile;
    delete tem.tempcompanyAddressOne;
    delete tem.tempcompanyAddresstown;
    delete tem.tempcompanyAddressstate;
    delete tem.tempcompanyAddresspincode;
    delete tem.tempaddress;
    delete tem.tempaccountNumber;
    delete tem.tempstate;
    delete tem.temppincode;
    delete tem.temptown;
    //
    // return;
    Object.keys(tem).map((key) => {
      if (typeof tem[key]?.[0]?.name == 'string') {
        dataSet = {
          ...dataSet,
          [key]: tem[key][0],
        };
      } else if (Object.keys(tem[key] ?? {}).length !== 0) {
        if (
          tem[key] !== '' ||
          tem[key] !== null ||
          tem[key] !== undefined ||
          Object.keys(tem[key]).length !== 0
        ) {
          allElem = {
            ...allElem,
            [key]: tem[key],
          };
        }
      }
    });

    dataSet = {
      ...dataSet,
      data: JSON.stringify(allElem),
    };

    axios({
      method: 'put',
      url: api.onBoardCorporate.list,
      data: getFormData(dataSet),
      headers: {'Content-Type': 'multipart/form-data'},
    })
      .then(function (response) {
        //handle success
        // popBTNClick(false);
        if (response?.data?.status == '200') {
          toast.success('Details has been successfully updated.');
          getFilterData()
          popBTNClick(false);

          // navigate(`/onbordCorporate/list`);
        } else {
          setshowbtn(true);
          toast.error('Something wentdd wrong');
          popBTNClick(true);
        }

        setshowbtn(true);
      })
      .catch(function (response) {
        toast.error('Something went wrong');
        setshowbtn(true);
        popBTNClick(true);
      });
    // }
  };

  async function checkMobile(mob) {
    let r = await axios.get(
      `${api?.baseUri}/userauth/user-account/${mob}/mobile`,
    );
    if (r?.data == 'User Present') return false;
    else return true;
  }
  async function checkEmail(email) {
    let r = await axios.get(
      `${api?.baseUri}/userauth/user-account/${email}/email`,
    );
    if (r?.data == 'User Present') return false;
    else return true;
  }

  async function myGetData(d) {
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
    if (d?.tempaccountNumber && d?.tempaccountNumber == d?.accountNumber) {
      setshowTick(true);
    } else {
      setshowTick(false);
    }
    if (d?.ifscCode != mytempifsc && d?.ifscCode?.length == 11) {
      var instance = axios.create();
      delete instance?.defaults?.headers?.common['vtt_user_signature'];
      instance
        .get(`https://ifsc.razorpay.com/${d?.ifscCode}`)
        .then((r) => {
          if (r?.data) {
            setMytempifsc(r?.data?.IFSC);
            setbranchData(r?.data?.BRANCH);
            setbankNameVal(r?.data?.BANK);
          } else {
            setMytempifsc(null);
            setbranchData(null);
            setbankNameVal(null);
          }
        })
        .catch((er) => {
          setMytempifsc(null);
          setbranchData('NA');
          setbankNameVal('NA');
        });
    }
    if (d?.ifscCode?.length != 11) {
      setbranchData('');
    }
  }
  return (
    <>
      {data && data.id && (
        <>
          {/* {!showbtn ?
            <AppLoader />
            : null} */}
          {data && data.id && (
            <PopEdit
              title={data?.companyName}
              defaultValues={data}
              template={stepperTemplate}
              openDialog={openDialog}
              mode='onTouched'
              clearErr={[
                {name: 'accountNumber', value: showTick, rr: bankNameVal},
                {
                  name: 'branchName',
                  value: branchData && branchData?.toUpperCase() != 'NA',
                },
                {
                  name: 'bankName',
                  value: bankNameVal && bankNameVal?.toUpperCase() != 'NA',
                },
                {
                  name: 'mobileNo',
                  value:
                    mobileNo == data.mobileNo ||
                    (mobileNo?.length == 10 && !mobileExists),
                },
                {
                  name: 'emailId',
                  value: !emailExists || email == data?.emailId,
                },
              ]}
              seterrors={[
                {
                  name: 'branchName',
                  type: 'customized',
                  message: 'Please enter valid IFSC.',
                  error: branchData?.toUpperCase() == 'NA',
                },
                {
                  name: 'bankName',
                  type: 'customized',
                  message: 'Please enter valid IFSC.',
                  error: bankNameVal?.toUpperCase() == 'NA',
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
              oldFormType={'STEPPER'}
              getOnInput={myGetData}
              setVal={[
                {name: 'branchName', value: branchData},
                {name: 'bankName', value: bankNameVal},
                {name: 'tempaddress', value: data?.companyAddress?.addressName},
                {name: 'temptown', value: data?.companyAddress?.city},
                {name: 'tempstate', value: data?.companyAddress?.state},
                {name: 'temppincode', value: data?.companyAddress?.pinCode},
              ]}
              popAction={handleSubmit}
              setSuccessIcon={[
                {name: 'accountNumber', value: showTick},
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
            />
          )}
        </>
      )}
    </>
  );
};

export default EditForm;
