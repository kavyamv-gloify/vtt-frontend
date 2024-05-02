/* eslint-disable */
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Steppers from '@smart-form/stepper';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import api from '@api';
import regex from '@regex';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {toast} from 'react-toastify';
import AppLoader from '@crema/core/AppLoader';
import Dialog from '@mui/material/Dialog';
import SmartForm from '@smart-form';
import DialogContent from '@mui/material/DialogContent';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PersonIcon from '@mui/icons-material/Person';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import _, {set} from 'lodash';

const PendingEditPage = ({id, close}) => {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [showbtn, setshowbtn] = React.useState(true);
  // const { id } = useParams();
  const {user} = useAuthUser();
  const [mytempifsc, setMytempifsc] = React.useState();
  const [showTick, setshowTick] = React.useState();
  const [branchData, setbranchData] = React.useState();
  const [bankNameVal, setbankNameVal] = React.useState();
  const [openDialog, setOpenDialog] = useState(false);
  const [btnName, setBtnName] = useState(null);
  const [formVal, setformVal] = useState({});

  let template = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    // title: 'Job Application Form',
    description: 'Form for applying Job',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'medium', label: 'fixed'},
        id: 'personal_information1',
        fields: [
          {
            type: 'textarea',
            name: 'remarks',
            id: 'remarks',
            title: 'Remark',
            validationProps: {
              // required: 'This is a mandatory field',
              maxLength: {
                value: 800,
                message: 'Maximum 800 characters are allowed.',
              },
            },
          },
        ],
      },
    ],
  };
  useEffect(() => {
    async function fetchData() {
      const baseURL = `${api.vendor.changeRequest}/${id}`;
      let response = await axios.get(`${baseURL}`);

      let tempo = response?.data?.data;
      // tempo.bankNameTemp = response?.data?.data?.bankCode;
      setData(tempo);
    }
    fetchData();
  }, [id]);
  let stepperTemplate = {
    title: 'Vendor Details',
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
        title: 'Vendor Details',
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
                //   type: 'autocomplete',
                //   name: 'bankNameTemp22',
                //   options: bankList,
                //   // defaultValue: data?.bankCode,
                //   object: {
                //     filter: ['code']
                //   },
                //   id: 'bankNameTemp22',
                //   title: 'Bank Name',
                //   // pattern: {
                //   //   value: regex.maxSize30,
                //   //   message: 'Please enter valid bank Name'
                //   // },
                //   validationProps: {
                //     booleanrequired: 'This is a mandatory field'
                //   },
                // },
                {
                  type: 'text',
                  name: 'vendorName',
                  id: 'vendorName',
                  title: 'Vendor Name',
                  disabled: true,
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
                  disabled: true,
                  tempFilename: data?.vendorPhoto,
                  validationProps: {
                    // required: 'This is a mandatory field',
                    size: {
                      value: 5,
                      message: 'File size should not be more than 5 mb.',
                    },
                  },
                },
                {
                  type: 'text',
                  name: 'vendorCode',
                  id: 'vendorCode',
                  title: 'Vendor Code',
                  disabled: true,
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
                  disabled: true,
                  pattern: {
                    value: regex.maxSize50,
                    message:
                      'Please enter valid Vendor Service Area area with max 50 characters',
                  },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },
                // {
                //   type: "section",
                //   layout: { column: 2, spacing: 2, size: 'medium', label: 'fixed' },
                //   fields: [
                //     {
                //       type: 'select',
                //       name: 'addressProofDocTpye',
                //       id: 'addressProofDocTpye',
                //       title: 'Address Proof Tpye',
                //       validationProps: {
                //         required: 'This is a mandatory field'
                //       },
                //       options: [
                //         { title: 'Aadhar', value: 'aadar' },
                //         { title: 'PAN', value: 'PAN' },
                //       ]
                //     },
                //     {
                //       type: 'file',
                //       name: 'addressProofDoc',
                //       id: 'addressProofDoc',
                //       title: 'Upload Document',
                //       validationProps: {
                //         required: 'This is a mandatory field'
                //       }
                //     },
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
                  fields: [
                    {
                      type: 'text',
                      name: 'companyPAN',
                      id: 'companyPAN',
                      title: 'PAN No.',
                      disabled: true,
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
                      accept: '.jpg,.jpeg,.png,.pdf,.doc,.docx',
                      disabled: true,
                      tempFilename: data?.companyPanDoc,
                      // validationProps: {
                      //   // required: 'This is a mandatory field',
                      //   size: {
                      //     value: 5,
                      //     message: 'File size should not be more than 5 mb.'
                      //   },
                      // }
                    },
                  ],
                },
                // {
                //   type: "section",
                //   layout: { column: 2, spacing: 2, size: 'medium', label: 'fixed' },
                //   fields: [
                //     {
                //       type: 'select',
                //       name: 'identityProofDocTpye',
                //       id: 'identityProofDocTpye',
                //       title: 'Identity Proof Tpye',
                //       validationProps: {
                //         required: 'This is a mandatory field'
                //       },
                //       options: [
                //         { title: 'Aadhar', value: 'aadar' },
                //         { title: 'PAN', value: 'PAN' },
                //       ]
                //     },
                //     {
                //       type: 'file',
                //       name: 'identityProofDoc',
                //       id: 'identityProofDoc',
                //       title: 'Upload Document',
                //       validationProps: {
                //         required: 'This is a mandatory field'
                //       }
                //     },
                //   ]
                // },
                // {
                //   type: 'map',
                //   name: 'address',
                //   id: 'address',
                //   title: 'Address (Site Office)',
                // },
                {
                  type: 'text',
                  name: 'tempaddress',
                  id: 'tempaddress',
                  title: 'Address Line1',
                  disabled: true,
                  pattern: {
                    value: regex.addressReg,
                    message:
                      'Please enter valid Address with max 100 characters ',
                  },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },
                {
                  type: 'text',
                  name: 'temptown',
                  id: 'temptown',
                  title: 'Town/City(Residence)',
                  disabled: true,
                  pattern: {
                    value: regex.adreesschar50,
                    message:
                      'Please enter valid Town/City with max 50 characters',
                  },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },
                {
                  type: 'text',
                  name: 'tempstate',
                  id: 'tempstate',
                  title: 'State',
                  disabled: true,
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
                  title: 'Pincode',
                  disabled: true,
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
                  disabled: true,
                  pattern: {
                    value: regex.char50,
                    message:
                      'Please enter valid First Namewith max 50 characters',
                  },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },

                {
                  type: 'text',
                  name: 'contactPersonLastName',
                  id: 'contactPersonLastName',
                  title: ' Last Name',
                  disabled: true,
                  pattern: {
                    value: regex.char50,
                    message:
                      'Please enter valid Last Namewith max 50 characters',
                  },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },
                {
                  type: 'text',
                  name: 'emailId',
                  id: 'emailId',
                  title: 'Email Id',
                  disabled: true,
                  pattern: {
                    value: regex.emailReg,
                    message: 'Please enter valid Email Id',
                  },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },
                {
                  type: 'text',
                  name: 'mobileNo',
                  id: 'mobileNo',
                  title: 'Mobile No.',
                  isNumber: true,
                  maxChar: 10,
                  disabled: true,
                  pattern: {
                    value: regex.phoneReg,
                    message: 'Please enter valid Mobile No.',
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
        title: 'Bank Details',
        buttons: ['Approve', 'Reject'],
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
                  title: 'Account Holder Name',
                  disabled: true,
                  pattern: {
                    value: regex.char50,
                    message: 'Please enter valid Account Holder Name',
                  },
                  validationProps: {
                    required: 'This is a mandatory field',
                  },
                },

                {
                  type: 'password',
                  name: 'tempaccountNumber',
                  id: 'tempaccountNumber',
                  title: 'Bank Account No.',
                  disabled: true,
                  defaultValue: data?.accountNumber,
                  pattern: {
                    value: regex.acountNoReg,
                    message: 'Please enter valid Bank Account No.',
                  },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },

                {
                  type: 'text',
                  name: 'accountNumber',
                  id: 'accountNumber',
                  title: 'Confirm Bank Account No.',
                  disabled: true,
                  pattern: {
                    value: regex.acountNoReg,
                    message: 'Please enter valid Bank Account No.',
                  },
                  // validationProps: {
                  //   manual: [
                  //     {
                  //       condition: `tempaccountNumber == accountNumber`,
                  //       message: "Account number did not match"
                  //     }
                  //   ]
                  // }
                },

                {
                  type: 'text',
                  name: 'ifscCode',
                  id: 'ifscCode',
                  title: 'IFSC Code',
                  maxChar: 11,
                  isUpper: true,
                  disabled: true,
                  pattern: {
                    value: regex.ifscReg,
                    message: 'Please enter valid IFSC code',
                  },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
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
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                  // setVal:branchData,
                  // pattern: {
                  //   value: regex.maxSize150,
                  //   message: 'Please enter valid branch Name'
                  // },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },
              ],
            },
          ],
        },
      },
    ],
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const getFormData = (object) =>
    Object.keys(object).reduce((formData, key) => {
      formData.append(key, object[key]);
      return formData;
    }, new FormData());

  const handleSubmit = async (values) => {
    setshowbtn(false);
    setOpenDialog(true);
    if (values.button.toUpperCase() === 'APPROVE') {
      let tem = values?.data;
      tem.vendorId = values?.data?.id;
      if (tem?.bankNameTemp) delete tem.bankNameTemp;
      delete tem.pandoc;
      delete tem.tempaccountNumber;

      setBtnName('APPROVE');
      setshowbtn(true);
      setformVal(tem);
    }
    if (values.button.toUpperCase() === 'REJECT') {
      let tem = values?.data;
      tem.address = {
        addressName: values?.data?.tempaddress,
        pinCode: values?.data?.temppincode,
        state: values?.data?.tempstate,
        city: values?.data?.temptown,
      };

      if (tem.tempaddress) delete tem.tempaddress;
      if (tem.temptown) delete tem.temptown;
      if (tem.tempstate) delete tem.tempstate;
      if (tem.temppincode) delete tem.temppincode;
      tem.vendorId = values?.data?.id;
      if (tem?.bankNameTemp) delete tem.bankNameTemp;
      delete tem.pandoc;
      delete tem.tempaccountNumber;

      setBtnName('REJECT');
      setshowbtn(true);
      setformVal(tem);
    }
  };

  function handleDialog(val) {
    setOpenDialog(true);

    let tem = {};
    tem = formVal;
    tem.remarks = val?.data?.remarks;

    if (
      (val.button == 'No' && btnName == 'REJECT') ||
      (val.button == 'No' && btnName == 'APPROVE')
    ) {
      setOpenDialog(false);
    }

    if (val.button == 'Yes' && btnName == 'APPROVE') {
      axios
        .post(api.vendor.changeRequest + '/approve', tem)
        .then(function (response) {
          if (response.status == 200) {
            navigate(`/onboardadmin/vendor/vendor-listing/Def`);
            toast.success(
              `${response?.data?.data?.vendorName}'s profile update request approved`,
            );
            // toast.success('Approved successfully');
            close();
          } else {
            toast.error(response?.data?.message ?? 'Something went wrong');
          }
          setshowbtn(true);
        })
        .catch(function (response) {
          toast.error(response?.data?.message ?? 'Something went wrong');
          //handle error
          setshowbtn(true);
        });
    }

    if (val.button == 'Yes' && btnName == 'REJECT') {
      axios
        .post(api.vendor.changeRequest + '/reject', tem)
        .then(function (response) {
          if (response.status == 200) {
            navigate(`/onboardadmin/vendor/vendor-listing/Def`);
            toast.success(
              `${response?.data?.data?.vendorName}'s profile update request rejected`,
            );
            // toast.success('Rejected successfully');
            close();
          } else {
            toast.error(response?.data?.message ?? 'Something went wrong');
          }
          setshowbtn(true);
        })
        .catch(function (response) {
          toast.error(response?.data?.message ?? 'Something went wrong');
          //handle error
          setshowbtn(true);
        });
    }
    setOpenDialog(false);
  }
  function myGetData(d) {
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
      {!showbtn ? <AppLoader /> : null}
      {data && data.id && (
        <>
          <Steppers
            defaultValues={data}
            template={stepperTemplate}
            getOnInput={myGetData}
            showbtn={showbtn}
            clearErr={[
              {name: 'accountNumber', value: showTick, rr: bankNameVal},
            ]}
            setVal={[
              {name: 'branchName', value: branchData},
              {name: 'bankName', value: bankNameVal},
              {name: 'tempaddress', value: data?.address?.addressName},
              {name: 'temptown', value: data?.address?.city},
              {name: 'tempstate', value: data?.address?.state},
              {name: 'temppincode', value: data?.address?.pinCode},
            ]}
            setSuccessIcon={[{name: 'accountNumber', value: showTick}]}
            afterSubmit={handleSubmit}
            icons={{
              1: <PersonPinIcon />,
              2: <PersonIcon />,
              3: <AccountBalanceIcon />,
            }}
          />

          <Dialog
            onClose={handleClose}
            open={openDialog}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
          >
            <DialogContent style={{width: '500px'}}>
              <p>Are you sure, you want to confirm?</p>
              <SmartForm
                template={template}
                buttons={['Yes', 'No']}
                onSubmit={handleDialog}
              />
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
};

export default PendingEditPage;
