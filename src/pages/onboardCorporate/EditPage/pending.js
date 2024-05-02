/* eslint-disable */
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Steppers from '@smart-form/stepper';
import SmartForm from '@smart-form';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import api from '@api';
import regex from '@regex';
import {toast} from 'react-toastify';
import AppLoader from '@crema/core/AppLoader';
import {reject} from 'lodash';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import {CollectionsBookmarkRounded} from '@mui/icons-material';
import PersonIcon from '@mui/icons-material/Person';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import DomainIcon from '@mui/icons-material/Domain';
import HomeIcon from '@mui/icons-material/Home';

const EditForm = ({id, close}) => {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  // const { id } = useParams();
  const [mytempifsc, setMytempifsc] = React.useState();
  const [branchData, setbranchData] = React.useState();
  const [bankNameVal, setbankNameVal] = React.useState();
  const [showTick, setshowTick] = React.useState();
  const [showbtn, setshowbtn] = React.useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [btnName, setBtnName] = useState(null);
  const [subVal, setsubVal] = useState({});
  const [domainList, setDomainList] = useState();

  useEffect(() => {
    async function fetchData() {
      const baseURL = `${api.onBoardCorporate.changeRequest}/${id}`;
      let response = await axios.get(`${baseURL}`);

      let tempo = response?.data?.data;
      setData(tempo);
    }
    fetchData();
  }, [id]);

  useEffect(() => {
    async function fetchData() {
      const baseURL = `${api.onBoardTenant.list}/${data?.tanentId}`;
      axios
        .get(`${baseURL}`)
        .then((response) => {
          let temArr = [];

          response.data.data?.domains?.map((el) => {
            temArr.push({title: el, value: el});
          });
          // setData(response.data.data ?? {})
          setDomainList(temArr ?? []);
        })
        .catch((err) => {
          // setData({})
          setDomainList([]);
        });
    }
    fetchData();
  }, [data?.tanentId]);
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
  let stepperTemplate = {
    title: 'Edit Corporate Onboarding Form',
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
                  type: 'text',
                  name: 'companyName',
                  id: 'companyName',
                  title: 'Company Name',
                  disabled: true,
                  pattern: {
                    value: regex.maxSize50,
                    message:
                      'Please enter valid Company Name with max 50 characters',
                  },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },
                {
                  type: 'text',
                  name: 'companyCode',
                  id: 'companyCode',
                  title: 'Company Code',
                  disabled: true,
                  // pattern: {
                  //   value: regex.maxSize50,
                  //   message:
                  //     'Please enter alpha-numeric and below 50 characters',
                  // },
                  // validationProps: {
                  //     required: 'This is a mandatory field'
                  // }
                },
                {
                  type: 'hidden',
                  name: 'tanentId',
                  id: 'tanentId',
                },
                {
                  type: 'hidden',
                  name: 'tanentCode',
                  id: 'tanentCode',
                },
                {
                  type: 'hidden',
                  name: 'tanentName',
                  id: 'tanentName',
                },
                {
                  type: 'text',
                  name: 'tempcompanyAddressOne',
                  id: 'tempcompanyAddressOne',
                  title: 'Address Line1 ',
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
                  name: 'tempcompanyAddresstown',
                  id: 'tempcompanyAddresstown',
                  title: 'Town/City ',
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
                  name: 'tempcompanyAddressstate',
                  id: 'tempcompanyAddressstate',
                  title: 'State ',
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
                  name: 'tempcompanyAddresspincode',
                  id: 'tempcompanyAddresspincode',
                  title: 'Pincode ',
                  disabled: true,
                  pattern: {
                    value: regex.pincodeRegex,
                    message: 'Please enter valid Pincode',
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
                  fields: [
                    {
                      type: 'text',
                      name: 'companyRegNo',
                      id: 'companyRegNo',
                      title: 'Registration No.',
                      disabled: true,
                      pattern: {
                        value: regex.maxSize30,
                        message: 'Please enter valid Registration No.',
                      },
                      // validationProps: {
                      //   required: 'This is a mandatory field'
                      // }
                    },
                    {
                      type: 'file',
                      name: 'regfile',
                      id: 'regfile',
                      title: 'Upload Document',
                      disabled: true,
                      accept: 'image/*,.pdf,.doc,.docx',
                      tempFilename: data?.companyRegDoc,
                      // validationProps: data?.companyRegDoc ? {
                      //   // required: 'This is a mandatory field',
                      //   size: {
                      //     value: 5,
                      //     message: 'File size should not be more than 5 mb.'
                      //   },
                      // } : {
                      //   required: 'This is a mandatory field',
                      //   size: {
                      //     value: 5,
                      //     message: 'File size should not be more than 5 mb.'
                      //   },
                      // }
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
                  fields: [
                    {
                      type: 'text',
                      name: 'companyGSTN',
                      id: 'companyGSTN',
                      title: 'GSTIN No.',
                      disabled: true,
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
                      name: 'gstnfile',
                      id: 'gstnfile',
                      title: 'Upload Document',
                      accept: 'image/*,.pdf,.doc,.docx',
                      disabled: true,
                      tempFilename: data?.companyGstnDoc,

                      // validationProps: data?.companyGstnDoc ? {
                      //   // required: 'This is a mandatory field',
                      //   size: {
                      //     value: 5,
                      //     message: 'File size should not be more than 5 mb.'
                      //   },
                      // } : {
                      //   required: 'This is a mandatory field',
                      //   size: {
                      //     value: 5,
                      //     message: 'File size should not be more than 5 mb.'
                      //   },
                      // }
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
                      name: 'panfile',
                      id: 'panfile',
                      title: 'Upload Document',
                      accept: 'image/*,.pdf,.doc,.docx',
                      disabled: true,
                      tempFilename: data?.companyPanDoc,
                      // validationProps: data?.companyPanDoc ? {
                      //   // required: 'This is a mandatory field',
                      //   size: {
                      //     value: 5,
                      //     message: 'File size should not be more than 5 mb.'
                      //   },
                      // } : {
                      //   required: 'This is a mandatory field',
                      //   size: {
                      //     value: 5,
                      //     message: 'File size should not be more than 5 mb.'
                      //   },
                      // }
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
                  disabled: true,
                  pattern: {
                    value: regex.char50,
                    message:
                      'Please enter valid First Name with max 50 characters',
                  },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
                },
                {
                  type: 'text',
                  name: 'contactPersonLastName',
                  id: 'contactPersonLastName',
                  title: 'Last Name',
                  disabled: true,
                  pattern: {
                    value: regex.char50,
                    message:
                      'Please enter valid Last Name with max 50 characters',
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
                  type: 'multiSelect',
                  name: 'domains',
                  id: 'domains',
                  title: 'Domains',
                  disabled: true,
                  options: domainList ?? [],

                  // infoMessage: ["Alphanumeric characters are allowed", "Maximum length should be 30 characters & should include @", "Should have domain name", "e.g.: xyz45@gmail.com"],
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
                  disabled: true,
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
                  disabled: true,
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
                    message:
                      'Please enter valid Account Holder Name with max 50 characters',
                  },
                  // validationProps: {
                  //   required: 'This is a mandatory field'
                  // }
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
                  disabled: true,
                  isUpper: true,
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
                },
              ],
            },
          ],
        },
      },
    ],
  };

  const handleSubmit = (values) => {
    // setshowbtn(false);
    setOpenDialog(true);

    setsubVal(values?.data);
    if (values.button.toUpperCase() === 'APPROVE') {
      setBtnName('APPROVE');
      setOpenDialog(true);
      setshowbtn(true);
    }
    if (values.button.toUpperCase() === 'REJECT') {
      setBtnName('REJECT');
      setOpenDialog(true);
      setshowbtn(true);
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  function handleDialog(val) {
    let tem = {};
    tem = subVal;
    tem.remarks = val?.data?.remarks;
    tem.address = {
      pinCode: subVal?.tempcompanyAddresspincode,
      state: subVal?.tempcompanyAddressstate,
      city: subVal?.tempcompanyAddresstown,
      addressName: subVal?.tempcompanyAddressOne,
    };
    if (tem.tempcompanyAddressOne) delete tem.tempcompanyAddressOne;
    if (tem.tempcompanyAddresstown) delete tem.tempcompanyAddresstown;
    if (tem.tempcompanyAddressstate) delete tem.tempcompanyAddressstate;
    if (tem.tempcompanyAddresspincode) delete tem.tempcompanyAddresspincode;

    if (
      (val.button == 'No' && btnName == 'REJECT') ||
      (val.button == 'No' && btnName == 'APPROVE')
    ) {
      setOpenDialog(false);
    }

    if (val.button == 'Yes' && btnName == 'APPROVE') {
      axios
        .post(api.onBoardCorporate.changeRequest + '/approve', tem)
        .then(function (response) {
          if (response?.data?.status == 200) {
            navigate(`/onbordCorporate/list`);
            toast.success('Approved successfully');
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
        .post(api.onBoardCorporate.changeRequest + '/reject', tem)
        .then(function (response) {
          if (response.status == 200) {
            navigate(`/onbordCorporate/list`);
            toast.success('Rejected successfully');
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

  const getFormData = (object) =>
    Object.keys(object).reduce((formData, key) => {
      formData.append(key, object[key]);
      return formData;
    }, new FormData());

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
      {data && data.id && (
        <>
          {!showbtn ? <AppLoader /> : null}
          <Steppers
            defaultValues={data}
            template={stepperTemplate}
            getOnInput={myGetData}
            clearErr={[
              {name: 'accountNumber', value: showTick, rr: bankNameVal},
            ]}
            setVal={[
              {name: 'branchName', value: branchData},
              {name: 'bankName', value: bankNameVal},
              {
                name: 'tempcompanyAddressOne',
                value: data?.companyAddress?.addressName,
              },
              {
                name: 'tempcompanyAddresstown',
                value: data?.companyAddress?.city,
              },
              {
                name: 'tempcompanyAddressstate',
                value: data?.companyAddress?.state,
              },
              {
                name: 'tempcompanyAddresspincode',
                value: data?.companyAddress?.pinCode,
              },
            ]}
            setSuccessIcon={[{name: 'accountNumber', value: showTick}]}
            afterSubmit={handleSubmit}
            icons={{
              1: <DomainIcon />,
              2: <HomeIcon />,
              3: <PersonIcon />,
              4: <AccountBalanceIcon />,
            }}
          />
        </>
      )}
      <Dialog
        onClose={handleClose}
        open={openDialog}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogContent>
          <p>Are you sure, you want to confirm?</p>

          <SmartForm
            template={template}
            buttons={['Yes', 'No']}
            onSubmit={handleDialog}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditForm;
