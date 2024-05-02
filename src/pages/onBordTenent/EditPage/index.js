/* eslint-disable */
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import regex from '@regex';
import Api from '@api';
import axios from 'axios';
import {toast} from 'react-toastify';
import PopEdit from '@editpopup';
// import {setInitialPath} from 'redux/actions';
const EditForm = ({id, popBTNClick, openDialog}) => {
  const [data, setData] = useState({});
  const [showbtn, setshowbtn] = React.useState(true);
  const [showTick, setshowTick] = React.useState();
  const [mytempifsc, setMytempifsc] = React.useState();
  const [branchData, setbranchData] = React.useState();
  const [bankNameVal, setbankNameVal] = React.useState();
  const [mobileExists, setMobileExists] = useState(false);
  const [mobileNo, setMobileNo] = useState();
  const [email, setEmail] = useState();
  const [emailExists, setEmailExists] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const baseURL = `${Api.onBoardTenant.list}/${id}`;
      axios
        .get(`${baseURL}`)
        .then((response) => {
          let temArr = response.data.data;
          let temDomains = [];
          temArr?.domains?.map((el) => {
            temDomains.push({Domains: el});
          });
          temArr.domains = temDomains;
          setData(temArr);
        })
        .catch((err) => {
          setData({});
        });
    }
    fetchData();
  }, [id]);

  let steppertemplate = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    title: 'Edit Form',
    description: 'Form for applying Job',
    // sections: [
    // {
    // layout: { column: 1, spacing: 2, size: 'small', label: 'fixed' },
    id: 'personal_information',
    fields: [
      {
        type: 'text',
        name: 'companyName',
        id: 'companyName',
        title: 'Company Name',
        disabled: false,
        pattern: {
          value: regex.companyreg,
          message: 'Please enter valid Company Name with max 50 characters',
        },
        validationProps: {
          required: 'This is a mandatory field',
        },
      },

      {
        type: 'section',
        layout: {column: 3, spacing: 2, size: 'medium', label: 'fixed'},
        sectionName: 'companyCode',
        sectiontitle: 'Company code & Logo',
        fields: [
          {
            type: 'text',
            name: 'companyCode',
            id: 'companyCode',
            title: 'Company Code',

            pattern: {
              value: regex.charwithnum,
              message: 'Please enter valid name with max 50 characters',
            },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'file',
            name: 'logodoc',
            id: 'logodoc',
            title: 'Company Logo',
            tempFilename: data?.companyLogoDoc,
            infoMessage: [
              'Should only accept image files',
              'File should contain file extension',
              'e.g.:Shub.jpeg',
            ],
            accept: 'image/*',
            validationProps: data?.companyLogoDoc
              ? {
                  size: {
                    value: 5,
                    message: 'File size should not be more than 5 mb.',
                  },
                }
              : {
                  required: 'This is a mandatory field',
                  size: {
                    value: 5,
                    message: 'File size should not be more than 5 mb.',
                  },
                },
          },
        ],
      },
      {
        type: 'array',
        name: 'domains',
        id: 'domains',
        title: 'Domain',
        layout: {
          column: 1,
          spacing: 2,
          size: 'small',
          label: 'blank',
          type: 'table',
        },
        columns: ['Domain'],
        subFields: [
          {
            type: 'text',
            name: 'Domains',
            id: 'Domains',
            title: 'Allowed Domains',
            infoMessage: [
              'Alphanumeric characters are allowed starting with @',
              'Maximum length should be 50  characters',
              'e.g.: @gmail.com ',
            ],
            pattern: {
              value: regex.domainReg,
              message: 'Please enter valid domain',
            },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
        ],
      },
      {
        type: 'section',
        layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
        sectionName: 'companyAddress',
        sectiontitle: 'Company Address',
        fields: [
          {
            type: 'text',
            name: 'tempaddress',
            id: 'tempaddress',
            title: 'Flat,House,Building,Apartment',
            pattern: {
              value: regex.addressReg,
              message: 'Please enter valid Address with max 100 characters ',
            },
            // validationProps: {
            //   required: 'This is a mandatory field'
            // }
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
              value: regex.maxSize250,
              message:
                'Please enter valid building No, street with max 250 characters ',
            },
            // validationProps: {
            //   required: 'This is a mandatory field'
            // }
          },
          {
            type: 'text',
            name: 'temptown',
            id: 'temptown',
            title: 'Town/City',
            pattern: {
              value: regex.adreesschar50,
              message: 'Please enter valid Town/City with max 50 characters',
            },
            // validationProps: {
            //   required: 'This is a mandatory field'
            // }
          },
          {
            type: 'text',
            name: 'tempstate',
            id: 'tempstate',
            title: 'State ',
            pattern: {
              value: regex.adreesschar50,
              message: 'Please enter valid State with max 50 characters',
            },
            // validationProps: {
            //   required: 'This is a mandatory field'
            // }
          },
          {
            type: 'text',
            name: 'temppincode',
            id: 'temppincode',
            title: 'Pincode ',
            pattern: {
              value: regex.pincodeRegex,
              message: 'Please enter valid Pincode',
            },
            // validationProps: {
            //   required: 'This is a mandatory field'
            // }
          },
        ],
      },

      {
        type: 'section',
        layout: {column: 3, spacing: 2, size: 'medium', label: 'fixed'},
        sectionName: 'companyregistration',
        sectiontitle: 'Company Registration',
        fields: [
          {
            type: 'text',
            name: 'companyRegNo',
            id: 'companyRegNo',
            title: 'Registration No.',
            isUpper: true,
            pattern: {
              value: regex.maxSize30,
              message:
                'Please enter valid Registration No. with max 30 characters',
            },
            // validationProps: {
            //   required: 'This is a mandatory field'
            // }
          },
          {
            type: 'file',
            name: 'regdoc',
            id: 'regdoc',
            title: 'Upload Document',
            accept: 'image/*,.pdf,.doc,.docx',
            tempFilename: data?.companyRegDoc,
            validationProps: data?.companyRegDoc
              ? {
                  size: {
                    value: 5,
                    message: 'File size should not be more than 5 mb.',
                  },
                }
              : {
                  required: 'This is a mandatory field',
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
        layout: {column: 3, spacing: 2, size: 'medium', label: 'fixed'},
        sectionName: 'companygstn',
        sectiontitle: 'Company GSTIN',
        fields: [
          {
            type: 'text',
            name: 'companyGSTN',
            id: 'companyGSTN',
            title: 'GSTIN No.',
            isUpper: true,
            pattern: {
              value: regex.gstReg,
              message: 'Please enter valid GSTIN No.',
            },
            // validationProps: {
            //   required: 'This is a mandatory field'
            // }
          },
          {
            type: 'file',
            name: 'gstndoc',
            id: 'gstndoc',
            title: 'Upload Document',
            accept: 'image/*,.pdf,.doc,.docx',
            tempFilename: data?.companyGstnDoc,
            validationProps: data?.companyGstnDoc
              ? {
                  size: {
                    value: 5,
                    message: 'File size should not be more than 5 mb.',
                  },
                }
              : {
                  required: 'This is a mandatory field',
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
        layout: {column: 3, spacing: 2, size: 'medium', label: 'fixed'},
        sectionName: 'companyPAN',
        sectiontitle: 'Company PAN Number',
        fields: [
          {
            type: 'text',
            name: 'companyPAN',
            id: 'companyPAN',
            title: 'PAN No.',
            isUpper: true,
            pattern: {
              value: regex.panReg,
              message: 'Please enter valid PAN No.',
            },
            // validationProps: {
            //   required: 'This is a mandatory field'
            // }
          },
          {
            type: 'file',
            name: 'pandoc',
            id: 'pandoc',
            title: 'Upload Document',
            accept: 'image/*,.pdf,.doc,.docx',
            tempFilename: data?.companyPanDoc,

            validationProps: data?.companyPanDoc
              ? {
                  size: {
                    value: 5,
                    message: 'File size should not be more than 5 mb.',
                  },
                }
              : {
                  required: 'This is a mandatory field',
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
        layout: {column: 3, spacing: 2, size: 'medium', label: 'fixed'},
        sectionName: 'contactPerson',
        sectiontitle: 'Contact Person Name',
        fields: [
          {
            type: 'text',
            name: 'contactPersonFirstName',
            id: 'contactPersonFirstName',
            title: ' First Name',
            pattern: {
              value: regex.char50,
              message: 'Please enter valid First Name with max 50 characters',
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
            pattern: {
              value: regex.char50,
              message: 'Please enter valid Last Name with max 50 characters',
            },
            validationProps: {
              // required: 'This is a mandatory field'
            },
          },
        ],
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
        validationProps: {
          required: 'This is a mandatory field',
        },
      },
      {
        type: 'text',
        name: 'mobileNo',
        id: 'mobileNo',
        title: 'Mobile No.',
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
        name: 'landLineNo',
        id: 'landLineNo',
        title: 'Landline No.',
        pattern: {
          value: regex.landlineReg,
          message: 'Please enter valid Landline No.',
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

      {
        type: 'text',
        name: 'accountName',
        id: 'accountName',
        title: 'Account Holder Name',
        pattern: {
          value: regex.maxSize50,
          message:
            'Please enter valid Account Holder Name with max 50 characters',
        },
        validationProps: {
          required: 'This is a mandatory field',
        },
      },

      {
        type: 'section',
        layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
        sectionName: 'bankaccount',
        sectiontitle: 'Bank Account Number',
        fields: [
          {
            type: 'password',
            name: 'tempaccountNumber',
            id: 'tempaccountNumber',
            title: 'Bank Account No.',
            defaultValue: data?.accountNumber,
            pattern: {
              value: regex.acountNoReg,
              message: 'Please enter valid Bank Account No.',
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
            pattern: {
              value: regex.acountNoReg,
              message: 'Please enter valid Bank Account No.',
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
        layout: {column: 3, spacing: 2, size: 'medium', label: 'fixed'},
        sectionName: 'bankdetail',
        sectiontitle: 'Bank Details',
        fields: [
          {
            type: 'text',
            name: 'ifscCode',
            id: 'ifscCode',
            title: 'IFSC Code',
            isUpper: true,
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
            disabled: true,
            // validationProps: {
            //   required: 'This is a mandatory field'
            // }
          },
          {
            type: 'text',
            name: 'branchName',
            id: 'branchName',
            title: 'Branch Name',
            disabled: true,
          },
        ],
      },
    ],
  };

  const getFormData = (object) =>
    Object.keys(object).reduce((formData, key) => {
      formData.append(key, object[key]);
      return formData;
    }, new FormData());

  const handleChange = (values) => {};
  const handleSubmit = async (values) => {
    if (values?.close) {
      popBTNClick(false);
      return;
    }
    setshowbtn(false);
    //  )
    if (values.button.toUpperCase() === 'UPDATE') {
      let dataSet = {};
      let allElem = {};
      let tem = values?.data;

      tem.companyAddress = {
        pinCode: values?.data?.temppincode,
        state: values?.data?.tempstate,
        city: values?.data?.temptown,
        addressName:
          values?.data?.tempaddress + '++' + values.data?.tempaddressAREA,
      };
      tem.profileStatus = 'ACTIVE';
      delete tem.tempaccountNumber;
      delete tem.tempaddress;
      delete tem.tempaddressAREA;
      delete tem.temppincode;
      delete tem.tempstate;
      delete tem.temptown;
      let arr = [];
      tem.domains?.map((ele) => {
        arr.push(ele?.Domains);
      });
      tem.domains = arr;
      delete tem.Domains;
      if (tem?.bankNameTemp) delete tem.bankNameTemp;

      if (!tem?.logodoc?.length) delete tem.logodoc;
      if (!tem?.regdoc?.length) delete tem.regdoc;
      if (!tem?.gstndoc?.length) delete tem.gstndoc;
      if (!tem?.pandoc?.length) delete tem.pandoc;
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
        url: Api.onBoardTenant.list,
        data: getFormData(dataSet),
        headers: {'Content-Type': 'multipart/form-data'},
      })
        .then(function (response) {
          if (response?.data?.status == '200') {
            toast.success('Details has been successfully updated.');
            setshowbtn(true);
            // navigate(`/superadmin/table`);
            popBTNClick(false);
          } else {
            setshowbtn(true);
            toast.error(response?.data?.message ?? 'Something went wrong');
          }
        })
        .catch(function (response) {
          toast.error(response?.data?.message ?? 'Something went wrong');
          setshowbtn(true);
          //handle error
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
      {/* 
      {!showbtn ?
        <AppLoader />
        : null} */}
      {data && data.id && (
        <PopEdit
          title={data?.companyName}
          defaultValues={data}
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
            {name: 'emailId', value: !emailExists || email == data?.emailId},
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
          poptemplate={steppertemplate}
          openDialog={openDialog}
          mode='onTouched'
          getOnInput={myGetData}
          setVal={[
            {name: 'branchName', value: branchData},
            {name: 'bankName', value: bankNameVal},
            {
              name: 'tempaddress',
              value: data?.companyAddress?.addressName?.split('++')[0],
            },
            {
              name: 'tempaddressAREA',
              value: data?.companyAddress?.addressName?.split('++')[1],
            },
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
          showbtn={showbtn}
          // oldFormType={"STEPPER"}
        />
      )}
    </>
  );
};

export default EditForm;
