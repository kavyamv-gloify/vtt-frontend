import React, {useState, useEffect} from 'react';
import SmartForm from '@smart-form';
import Api from '@api';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import AppLoader from '@crema/core/AppLoader';
import regex from '@regex';
import {Grid} from '@mui/material';
import CustomLabel from 'pages/common/CustomLabel';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import AppTooltip from '@crema/core/AppTooltip';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import DialogTitle from '@mui/material/DialogTitle';
const index = () => {
  const {id} = useParams();
  const [showbtn, setshowbtn] = useState(true);
  const [data, setData] = useState();
  const [open, setOpen] = useState(false);
  const [flag, setFlag] = useState();
  useEffect(() => {
    axios
      .get(
        Api.baseUri +
          '/user-reg/general-setting/get-GeneralSetting-by-corporateId',
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          console.log(res?.data?.data ?? {});
          setData(res?.data?.data ?? {});
        }
      })
      .catch((err) => {
        setData({});
      });
  }, []);
  useEffect(() => {
    console.log('data', data);
  }, [data]);
  let templateDownload = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    // title: 'Bank Type',
    description: 'Form for applying Job',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'date',
            name: 'fromDate',
            id: 'fromDate',
            title: 'From Date ',
          },
          {
            type: 'date',
            name: 'toDate',
            id: 'toDate',
            title: 'To Date ',
          },
        ],
      },
    ],
  };
  let template = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    // title: 'Bank Type',
    description: 'Form for applying Job',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'switchToggle',
            name: 'alertEmployeeToCreateProfileByCorporate',
            id: 'alertEmployeeToCreateProfileByCorporate',
            title: 'Alert Employee if profile is created by Corporate ',
            infoMessage: ['Radio button is selectable', 'e.g.: yes'],
            options: [
              {title: 'Yes', value: 'YES'},
              {title: 'No', value: 'NO'},
            ],
            validationProps: {
              // required: 'This is a mandatory field'
            },
          },
          {
            type: 'switchToggle',
            name: 'alertDriverToCreateProfileByCorporate',
            id: 'alertDriverToCreateProfileByCorporate',
            title: 'Alert Driver if profile is created by Corporate ',
            infoMessage: ['Radio button is selectable', 'e.g.: yes'],
            options: [
              {title: 'Yes', value: 'YES'},
              {title: 'No', value: 'NO'},
            ],
            validationProps: {
              // required: 'This is a mandatory field'
            },
          },
          {
            type: 'switchToggle',
            name: 'alertVendorToCreateProfileByCorporate',
            id: 'alertVendorToCreateProfileByCorporate',
            title: 'Alert Vendor if profile is created by Corporate ',
            infoMessage: ['Radio button is selectable', 'e.g.: yes'],
            options: [
              {title: 'Yes', value: 'YES'},
              {title: 'No', value: 'NO'},
            ],
            validationProps: {
              // required: 'This is a mandatory field'
            },
          },
          {
            type: 'switchToggle',
            name: 'alertCorporateToCreateProfileByAdmin',
            id: 'alertCorporateToCreateProfileByAdmin',
            title: 'Alert Corporate if profile is created by Admin ',
            infoMessage: ['Radio button is selectable', 'e.g.: yes'],
            options: [
              {title: 'Yes', value: 'YES'},
              {title: 'No', value: 'NO'},
            ],
            validationProps: {
              // required: 'This is a mandatory field'
            },
          },
          {
            type: 'switchToggle',
            name: 'alertEmployeeToCreateProfileByCorporateSMS',
            id: 'alertEmployeeToCreateProfileByCorporateSMS',
            title:
              'Alert Employee through SMS if profile is created by Corporate ',
            infoMessage: ['Radio button is selectable', 'e.g.: yes'],
            options: [
              {title: 'Yes', value: 'YES'},
              {title: 'No', value: 'NO'},
            ],
            validationProps: {
              // required: 'This is a mandatory field'
            },
          },
          {
            type: 'switchToggle',
            name: 'alertDriverToCreateProfileByCorporateSMS',
            id: 'alertDriverToCreateProfileByCorporateSMS',
            title:
              'Alert Driver through SMS if profile is created by Corporate ',
            infoMessage: ['Radio button is selectable', 'e.g.: yes'],
            options: [
              {title: 'Yes', value: 'YES'},
              {title: 'No', value: 'NO'},
            ],
            validationProps: {
              // required: 'This is a mandatory field'
            },
          },
          {
            type: 'switchToggle',
            name: 'alertVendorToCreateProfileByCorporateSMS',
            id: 'alertVendorToCreateProfileByCorporateSMS',
            title:
              'Alert Vendor  through SMS if profile is created by Corporate ',
            infoMessage: ['Radio button is selectable', 'e.g.: yes'],
            options: [
              {title: 'Yes', value: 'YES'},
              {title: 'No', value: 'NO'},
            ],
            validationProps: {
              // required: 'This is a mandatory field'
            },
          },
          {
            type: 'switchToggle',
            name: 'alertCorporateToCreateProfileByAdminSMS',
            id: 'alertCorporateToCreateProfileByAdminSMS',
            title:
              'Alert Corporate through SMS if profile is created by Admin ',
            infoMessage: ['Radio button is selectable', 'e.g.: yes'],
            options: [
              {title: 'Yes', value: 'YES'},
              {title: 'No', value: 'NO'},
            ],
            validationProps: {
              // required: 'This is a mandatory field'
            },
          },
          // {
          //   type: 'switchToggle',
          //   name: 'consolitatedReportForCorporateEmail',
          //   id: 'consolitatedReportForCorporateEmail',
          //   title: 'Send consolidated report to the mail ',
          //   infoMessage: ['Radio button is selectable', 'e.g.: yes'],
          //   options: [
          //     {title: 'Yes', value: 'YES'},
          //     {title: 'No', value: 'NO'},
          //   ],
          //   validationProps: {
          //     // required: 'This is a mandatory field'
          //   },
          // },
          // consolitatedReportForCorporateEmail,
          {
            type: 'section',
            layout: {
              column: 4,
              spacing: 4,
              size: 'medium',
              label: 'fixed',
            },
            fields: [
              {
                type: 'array',
                name: 'complianceSubTopicList',
                id: 'complianceSubTopicList',
                layout: {
                  column: 4,
                  spacing: 2,
                  size: 'small',
                  label: 'blank',
                  type: 'table',
                },
                columns: ['email'],
                subFields: [
                  {
                    type: 'text',
                    name: 'inputType',
                    id: 'inputType',
                    title: 'Search Value',
                    pattern: {
                      value: regex.emailReg,
                      message: 'Please enter valid Employee Email Id',
                    },
                    // dynamic: {
                    //   field: 'subTopicKey',
                    //   value: 'Mobile No.',
                    // },

                    validationProps: {
                      required: 'This is a mandatory field',
                    },
                  },
                ],
              },
              // {
              //   type: 'text',
              //   name: 'consolitatedReportForCorporateEmail',
              //   id: 'consolitatedReportForCorporateEmail',
              //   title: 'Send consolidated report to the mail ',
              //   infoMessage: ['Radio button is selectable', 'e.g.: yes'],
              //   options: [
              //     {title: 'Yes', value: 'YES'},
              //     {title: 'No', value: 'NO'},
              //   ],
              //   validationProps: {
              //     // required: 'This is a mandatory field'
              //   },
              // },
            ],
          },
        ],
      },
    ],
  };
  function handleDownload(val) {
    if (flag == 'vendor') {
      axios
        .get(
          Api.baseUri +
            `/user-reg/tripReport/vendorConsolidated-report/${val?.data?.fromDate}/${val?.data?.toDate}`,
          {responseType: 'blob'},
        )
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute(
            'download',
            'consolidated response/' +
              (val?.button?.toUpperCase() == 'XLS' ? '.xls' : '.pdf'),
          );
          document.body.appendChild(link);
          link.click();
          setOpen(false);
        });
    } else {
      axios
        .get(
          Api.baseUri +
            `/user-reg/tripReport/corporateConsolidated-report/${val?.data?.fromDate}/${val?.data?.toDate}`,
          {responseType: 'blob'},
        )
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute(
            'download',
            'consolidated response/' +
              (val?.button?.toUpperCase() == 'XLS' ? '.xls' : '.pdf'),
          );
          document.body.appendChild(link);
          link.click();
          setOpen(false);
        });
    }
  }
  function handleSubmit(val) {
    setshowbtn(false);
    if (val?.button == 'submit') {
      let postData = {};
      postData = val?.data;
      postData.corporateId = [id];
      val?.data?.complianceSubTopicList?.map((el) => {
        emailarr.push(el?.inputType);
      });
      if (val?.data?.complianceSubTopicList?.length == 0) {
        postData.consolitatedReportForCorporateEmail = [];
      }
      postData.consolitatedReportForCorporateEmail = emailarr;
      console.log('postData', postData);
      delete postData.complianceSubTopicList;
      axios
        .post(
          Api.baseUri + '/user-reg/general-setting/save-GeneralSetting',
          postData,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success('General Setting submitted successfully');
            setshowbtn(true);
          } else {
            toast.error('Something went wrong');
            setshowbtn(true);
          }
        })
        .catch((err) => {
          toast.error('Something went wrong');
        });
    }
    if (val?.button == 'update') {
      console.log('val', val);
      let postData = {};
      postData = val?.data;
      postData.corporateId = [id];
      postData.id = data?.id;
      let emailarr = [];
      val?.data?.complianceSubTopicList?.map((el) => {
        emailarr.push(el?.inputType);
      });
      if (val?.data?.complianceSubTopicList?.length == 0) {
        postData.consolitatedReportForCorporateEmail = [];
      }
      postData.consolitatedReportForCorporateEmail = emailarr;
      console.log('emailarr', emailarr);
      console.log('postData', postData);
      delete postData.complianceSubTopicList;
      axios
        .put(
          Api.baseUri + '/user-reg/general-setting/update-GeneralSetting',
          postData,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success('General Setting updated successfully');
            setshowbtn(true);
          } else {
            toast.error('Something went wrong');
            setshowbtn(true);
          }
        })
        .catch((err) => {
          toast.error('Something went wrong');
        });
    }
  }
  return (
    <div>
      <Grid container sx={{marginTop: '10px'}}>
        <Grid item xs={12} sm={3} md={6} sx={{mb: 2}}>
          <CustomLabel labelVal='General Setting' variantVal='h3-underline' />
        </Grid>
        <Grid
          item
          xs={12}
          sm={3}
          md={6}
          sx={{display: 'flex', justifyContent: 'flex-end'}}
        >
          <AppTooltip placement={'top'} title={'Add Filter'}>
            <ArrowCircleDownIcon
              className='title-icons-mui'
              onClick={() => {
                console.log('open');
                setOpen(true);
                setFlag('corporate');
              }}
            />
          </AppTooltip>
          <AppTooltip placement={'top'} title={'Add Filter'}>
            <ArrowCircleDownIcon
              className='title-icons-mui'
              onClick={() => {
                console.log('close');
                setOpen(true);
                setFlag('vendor');
              }}
            />
          </AppTooltip>
        </Grid>
      </Grid>

      {!showbtn ? <AppLoader /> : null}
      {data ? (
        <SmartForm
          defaultValues={data?.id ? data : {}}
          template={template}
          onSubmit={handleSubmit}
          buttons={data?.id ? ['update'] : ['submit']}
        />
      ) : null}

      <Dialog
        // onClose={CloseDetailPage}
        open={open}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '60%',
          },
        }}
        style={{borderRadius: '4rem'}}
        // aria-labelledby="alert-dialog-title"
        // aria-describedby="alert-dialog-description"
      >
        <div>
          <DialogContent style={{padding: '0px'}}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                background: '#f5f2f2',
                height: '4rem',
                paddingRight: '1.5rem',
                paddingLeft: '1.5rem',
              }}
            >
              <h1 style={{marginTop: '1.5rem'}}>Download Consolidate Report</h1>
              <CloseIcon
                onClick={() => {
                  setOpen(false);
                }}
                style={{
                  marginTop: '1.4rem',
                  color: '#4f4f4f',
                  fontWeight: 'bold',
                }}
              />
            </div>

            <div style={{padding: '1rem'}}>
              <SmartForm
                template={templateDownload}
                onSubmit={handleDownload}
                buttons={['pdf']}
              />
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </div>
  );
};

export default index;
