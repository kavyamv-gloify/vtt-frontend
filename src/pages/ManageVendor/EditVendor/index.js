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
import {useParams} from 'react-router-dom';
import Api from '@api';
import PopEdit from '@editpopup';
import CommuteIcon from '@mui/icons-material/Commute';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import PersonIcon from '@mui/icons-material/Person';
import EnhancedEncryptionIcon from '@mui/icons-material/EnhancedEncryption';
import {reach} from 'yup';

const EditForm = ({id, popBTNClick, openDialog}) => {
  const navigate = useNavigate();
  const {user} = useAuthUser();

  // const { id } = useParams();
  const [data, setData] = useState();
  const [vehicle, setVehicle] = useState();
  const [occupancy, setOccupancy] = useState();
  const [seat, setSeat] = useState();
  const [allvehicle, setallVehicle] = useState();
  const [vendorList, setVendorList] = useState();
  const [vendorId, setVendorId] = useState();
  const vendorprofile = user?.userList?.profileId;
  const [mytempifsc, setMytempifsc] = React.useState();
  const [branchData, setbranchData] = React.useState();
  const [bankNameVal, setbankNameVal] = React.useState();
  const [showTick, setshowTick] = useState();
  const [mobileExists, setMobileExists] = useState(false);
  const [mobileNo, setMobileNo] = useState();
  const [email, setEmail] = useState();
  const [emailExists, setEmailExists] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const baseURL = `${api.vendor.list}/${id}`;
      let response = await axios.get(`${baseURL}`);

      let tempo = response?.data?.data;
      // tempo.bankNameTemp = response?.data?.data?.bankCode;
      setData(tempo);
    }
    fetchData();
  }, [id]);

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
                  sectionName: 'vendorDetails',
                  sectiontitle: 'Vendor Name',
                  fields: [
                    {
                      type: 'text',
                      name: 'vendorName',
                      id: 'vendorName',
                      title: 'Vendor Name',
                      disabled: false,
                      pattern: {
                        value: regex.alphaReg,
                        message:
                          'Please enter valid Vendor Name with max 50 characters',
                      },
                      validationProps: {
                        required: 'This is a mandatory field',
                      },
                    },
                    {
                      type: 'file',
                      name: 'vendorPhoto',
                      id: 'vendorPhoto',
                      title: 'Upload logo',
                      accept: '.jpg,.jpeg,.png,.pdf,.doc,.docx',
                      tempFilename: data?.vendorPhoto,
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
                  type: 'text',
                  name: 'vendorCode',
                  id: 'vendorCode',
                  title: 'Vendor Code',
                  disabled: false,
                  pattern: {
                    value: regex.maxSize50,
                    message:
                      'Please enter valid Vendor Code with max 50 characters',
                  },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },
                {
                  type: 'text',
                  name: 'vendorType',
                  id: 'vendorType',
                  title: 'Vendor Service Area',
                  pattern: {
                    value: regex.maxSize50,
                    message:
                      'Please enter valid Vendor Service Area area with max 50 characters',
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
                  sectionName: 'panDetails',
                  sectiontitle: 'PAN Card Details',
                  fields: [
                    {
                      type: 'text',
                      name: 'companyPAN',
                      id: 'companyPAN',
                      title: 'PAN No.',
                      pattern: {
                        value: regex.panReg,
                        message: 'Please enter valid PAN No.',
                      },
                      validationProps: {
                        required: 'This is a mandatory field',
                      },
                    },
                    {
                      type: 'file',
                      name: 'pandoc',
                      id: 'pandoc',
                      title: 'Upload Document',
                      accept: '.jpg,.jpeg,.png,.pdf,.doc,.docx',
                      tempFilename: data?.companyPanDoc,
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
                  sectionName: 'vendoraddress',
                  sectiontitle: 'Address',
                  fields: [
                    {
                      type: 'text',
                      name: 'tempaddress',
                      id: 'tempaddress',
                      title: 'Flat, House No., Building, Company, Apartment',
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
                      // validationProps: {
                      //   required: 'This is a mandatory field'
                      // }
                    },
                  ],
                },

                {
                  type: 'text',
                  name: 'contactPersonFirstName',
                  id: 'contactPersonFirstName',
                  title: 'First Name',
                  disabled: false,
                  pattern: {
                    value: regex.char50,
                    message:
                      'Please enter valid First Nameswith max 50 characters',
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
                  disabled: false,
                  pattern: {
                    value: regex.char50,
                    message:
                      'Please enter valid Last Name with max 50 characters',
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
                  name: 'accountName',
                  id: 'accountName',
                  title: 'Account Holder Name',
                  pattern: {
                    value: regex.char50,
                    message: 'Please enter Account Holder Name',
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
                  layout: {
                    column: 2,
                    spacing: 2,
                    size: 'medium',
                    label: 'fixed',
                  },
                  sectionName: 'bankdetail',
                  sectiontitle: 'Bank Details',
                  fields: [
                    {
                      type: 'text',
                      name: 'ifscCode',
                      id: 'ifscCode',
                      title: 'IFSC Code',
                      maxChar: 11,
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

                // {
                //   type: "section",
                //   layout: { column: 2, spacing: 2, size: 'medium', label: 'fixed' },
                //   fields: [
                //     {
                //       type: 'date',
                //       name: 'registrationDate',
                //       id: 'registrationDate',
                //       title: 'Registration Date',

                //       validationProps: {
                //         required: 'This is a mandatory field'
                //       }
                //     },
                //     {
                //       type: 'date',
                //       name: 'registrationExpDate',
                //       id: 'registrationExpDate',
                //       title: 'Registration Expiry Date',

                //       validationProps: {
                //         required: 'This is a mandatory field'
                //       }
                //     },
                //   ]
                // },
              ],
            },
          ],
        },
      },
    ],
  };
  const [showbtn, setshowbtn] = React.useState(true);
  const handleSubmit = async (values) => {
    if (
      values?.data?.accountNumber &&
      values?.data?.tempaccountNumber &&
      values?.data?.accountNumber != values?.data?.tempaccountNumber
    ) {
      setshowbtn(true);
      return;
    }
    if (values?.close) {
      popBTNClick(false);
      return;
    }
    setshowbtn(false);
    if (values.button.toUpperCase() === 'UPDATE') {
      let dataSet = {};
      let allElem = {};
      let tem = values?.data;
      tem.address = {
        addressName:
          values?.data?.tempaddress + '++' + values?.data?.tempaddressAREA,
        pinCode: values?.data?.temppincode,
        state: values?.data?.tempstate,
        city: values?.data?.temptown,
      };
      tem.profileStatus = 'ACTIVE';
      delete tem.tempaddress;
      delete tem.tempaddressAREA;
      if (tem.temptown) delete tem.temptown;
      if (tem.tempstate) delete tem.tempstate;
      if (tem.temppincode) delete tem.temppincode;
      if (tem?.bankNameTemp) delete tem.bankNameTemp;
      if (!tem?.pandoc?.length) delete tem.pandoc;

      delete tem.tempaccountNumber;
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
        url: api.vendor.list,
        data: getFormData(dataSet),
        headers: {'Content-Type': 'multipart/form-data'},
      })
        .then((response) => {
          if (response?.data?.status == '200') {
            toast.success(
              `${response?.data?.data?.vendorName}'s details updated successfully`,
            );
            // toast.success('Details has been successfully updated.');
            // navigate(`/onboardadmin/vendor/vendor-listing/Def`);
            popBTNClick(false);
          } else {
            setshowbtn(true);
            toast.error('Something went wrong');
          }
        })
        .catch(function (response) {
          toast.error('Something went wrong');
          //handle error
          setshowbtn(true);
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

  // const usdata = { "vehicleType": "Mini", "modelNo": "12345678956", "vehicleBrand": "TATA Punch", "vehicleVarient": "Electric", "seatCapacity": "5", "seatOcupancy": "4", "regNumber": "456987", "vehicleColor": "red", "insuranceType": "TEST", "polutionStatus": "ok", "polutionFrom": "2022-06-02", "polutionTill": "2022-06-25", "insuranceStatus": "ok", "insuranceFrom": "2022-06-02", "insuranceTill": "2022-06-06", "permitType": "test", "fitnessStatus": "test", "ownerName": "Test", "ownerEmail": "test@gmail.com", "ownerMobile": "7897897899", "gps": true, "ac": true, "wifi": true, "sanitized": true }
  return (
    <>
      {/* {!showbtn ?
        <AppLoader />
        : null} */}
      {data && data?.id && (
        <>
          {/* {data?.vehicleTypeId} */}
          <PopEdit
            title={
              data?.contactPersonFirstName + ' ' + data?.contactPersonLastName
            }
            defaultValues={data}
            template={stepperTemplate}
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
            clearErr={[
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
            openDialog={openDialog}
            setVal={[
              {name: 'branchName', value: branchData},
              {name: 'bankName', value: bankNameVal},
              {
                name: 'tempaddress',
                value: data?.address?.addressName?.split('++')[0],
              },
              {
                name: 'tempaddressAREA',
                value: data?.address?.addressName?.split('++')[1],
              },
              {name: 'temptown', value: data?.address?.city},
              {name: 'tempstate', value: data?.address?.state},
              {name: 'temppincode', value: data?.address?.pinCode},
            ]}
            getOnInput={myGetData}
            popAction={handleSubmit}
            oldFormType={'STEPPER'}
          />
        </>
      )}
    </>
  );
};

export default EditForm;
