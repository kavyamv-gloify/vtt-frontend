import {Dialog, DialogContent, DialogTitle, Typography} from '@mui/material';
import React, {useEffect, useState} from 'react';
import SmartForm from '@smart-form';
import CloseIcon from '@mui/icons-material/Close';
import {getFormData} from '@hoc';
import axios from 'axios';
import Api from '@api';
import {toast} from 'react-toastify';
import {ConstructionOutlined} from '@mui/icons-material';
import NewUserGuide from './NewUserGuide';
const Upload = ({setOpen, data, allList, getData}) => {
  //   console.log('data', data);
  const [showbtn, setShowbtn] = useState(true);
  const [module, setModule] = useState([]);

  const corporateModule = [
    {title: 'Master', value: 'Master'},
    {title: 'Active Trips', value: 'Active Trips'},
    {title: 'Live Tracking', value: 'Live Tracking'},
    {title: 'Roster', value: 'Roster'},
    {title: 'Routes', value: 'Routes'},
    {title: 'Adhoc Trip', value: 'Adhoc Trip'},
    {title: 'Leave Management', value: 'Leave Management'},
    {title: 'Rate Card', value: 'Rate Card'},
    {title: 'Compliance', value: 'Compliance'},
    {title: 'Reports', value: 'Reports'},
    {title: 'Billing', value: 'Billing'},
    {title: 'IVR', value: 'IVR'},
    {title: 'Invoicing', value: 'Invoicing'},
    {title: 'Feedback', value: 'Feedback'},
    {title: 'Training Video', value: 'Training Video'},
    {title: 'Announcements', value: 'Announcements'},
    {title: 'Setting', value: 'Setting'},
    {title: 'New', value: 'NEW'},
  ];

  const StakeHolder = [
    {title: 'Super Admin', value: 'SUPERADMIN'},
    {title: 'Corporate Admin', value: 'CORPORATEADMIN'},
    {title: 'Employee', value: 'EMPLOYEE'},
    {title: 'Manager', value: 'MANAGER'},
    {title: 'Vendor', value: 'VENDOR'},
    {title: 'Driver', value: 'DRIVER'},
  ];

  const VendorModule = [
    {title: 'Active Trips', value: 'Active Trips'},
    {title: 'Master', value: 'Master'},
    {title: 'Route List', value: 'Route List'},
    {title: 'Leave Management', value: 'Leave Management'},
    {title: 'Compliance', value: 'Compliance'},
    {title: 'Reports', value: 'Reports'},
    {title: 'Billing', value: 'Billing'},
    {title: 'Invoicing', value: 'Invoicing'},
    {title: 'Feedback', value: 'Feedback'},
    {title: 'Training Video', value: 'Training Video'},
    {title: 'New', value: 'NEW'},
  ];

  const EmployeeModule = [
    {title: 'Manage Leave', value: 'Manage Leave'},
    {title: 'Adhoc Trip', value: 'Adhoc Trip'},
    {title: 'Roster', value: 'Roster'},
    {title: 'Support', value: 'Support'},
    {title: 'New', value: 'NEW'},
  ];
  const SuperAdminModule = [
    {title: 'Corporate', value: 'Corporate'},
    {title: 'New', value: 'NEW'},
  ];
  useEffect(() => {
    if (!data) {
      return;
    }
    data.thumbnail = data?.doc;
    // console.log('dddddd', data);
    if (data?.stakeHolder == 'SUPERADMIN') {
      setModule(SuperAdminModule);
    } else if (data?.stakeHolder == 'CORPORATEADMIN') {
      setModule(corporateModule);
    } else if (data?.stakeHolder == 'VENDOR') {
      setModule(VendorModule);
    } else if (data?.stakeHolder == 'EMPLOYEE') {
      setModule(EmployeeModule);
    } else setModule(DriverModule);
  }, [data]);

  const DriverModule = [{title: 'New', value: 'NEW'}];
  let template = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    description: 'Form for applying Job',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'section',
            layout: {column: 2, spacing: 2, size: 'small', label: 'fixed'},
            fields: [
              {
                type: 'autocomplete',
                name: 'stakeHolder',
                id: 'stakeHolder',
                title: 'Stake Holder',
                options: StakeHolder ?? [],
                validationProps: {
                  required: 'This is a mandatory field',
                },
              },
              {
                type: 'autocomplete',
                name: 'platform',
                id: 'platform',
                title: 'Platform',
                options: [
                  {title: 'Mobile Application', value: 'MOBILE'},
                  {title: 'Web Application', value: 'WEB'},
                ],
                validationProps: {
                  required: 'This is a mandatory field',
                },
              },
              {
                type: 'autocomplete',
                name: 'module',
                id: 'module',
                title: 'Modules',
                options: module ?? [],
                validationProps: {
                  required: 'This is a mandatory field',
                },
              },
              {
                type: 'text',
                name: 'newmodule',
                id: 'newmodule',
                title: 'Enter Module Name',
                validationProps: {
                  required: 'This is a mandatory field',
                },
                dynamic: {
                  field: 'modules',
                  value: 'NEW',
                },
              },
            ],
          },
          {
            type: 'section',
            layout: {column: 2, spacing: 2, size: 'small', label: 'fixed'},
            fields: [
              {
                type: 'text',
                name: 'title',
                id: 'title',
                title: 'Title',
                validationProps: {
                  required: 'This is a mandatory field',
                },
              },
              {
                type: 'text',
                name: 'description',
                id: 'description',
                title: 'Descriptions',
                validationProps: {
                  required: 'This is a mandatory field',
                },
              },
              {
                type: 'file',
                name: 'thumbnail',
                id: 'thumbnail',
                accept: '.pdf',
                title: 'Upload Document',
                tempFilename: data?.thumbnail,
                validationProps: {
                  // required: 'This is a mandatory field'
                },
              },
            ],
          },
        ],
      },
    ],
  };
  function handleChange(val) {
    if (val?.stakeHolder?.value == 'SUPERADMIN') {
      setModule(SuperAdminModule);
    } else if (val?.stakeHolder?.value == 'CORPORATEADMIN') {
      setModule(corporateModule);
    } else if (val?.stakeHolder?.value == 'VENDOR') {
      setModule(VendorModule);
    } else if (val?.stakeHolder?.value == 'EMPLOYEE') {
      setModule(EmployeeModule);
    } else setModule(DriverModule);
  }

  const getFileName = async (val) => {
    let tem = {
      photo: val?.data?.thumbnail,
    };
    let dataSet;

    Object.keys(tem).map((key) => {
      dataSet = {
        ...dataSet,
        [key]: tem[key][0],
      };
    });

    // console.log('dataSet', dataSet);
    let temp = await axios({
      method: 'post',
      url: Api.baseUri + '/user-reg/compliance/save-file',
      data: getFormData(dataSet),
      headers: {'Content-Type': 'multipart/form-data'},
    });
    // console.log('temp', temp);
    return temp?.data?.data?.documentName;
  };

  async function handleSubmit(val) {
    // console.log('val', val);
    setShowbtn(false);
    if (val?.button == 'submit') {
      let myFileName = '';

      if (val?.data?.thumbnail) {
        myFileName = await getFileName(val);
      }
      let postData = {
        stakeHolder: val?.data?.stakeHolder,
        module:
          val?.data?.modules == 'NEW'
            ? val?.data?.newmodule
            : val?.data?.module,
        platform: val?.data?.platform,
        title: val?.data?.title,
        description: val?.data?.description,
        doc: myFileName,
        status: 'ACTIVE',
      };

      axios
        .post(Api.baseUri + '/user-reg/userGuide/save', postData)
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success('Uploaded Successfully');
            setOpen(false);
            getData();
          } else {
            toast.error(res?.data?.message || 'Something went Wrong');
            setShowbtn(true);
          }
        })
        .catch((err) => {
          toast.error('Something went Wrong');
          setShowbtn(true);
        });
    }

    if (val?.button == 'update') {
      // console.log('val', val?.data);
      console.log(val?.data?.thumbnail?.[0]?.name);
      let postData = {
        id: data?.id,
        stakeHolder: val?.data?.stakeHolder,
        module:
          val?.data?.modules == 'NEW'
            ? val?.data?.newmodule
            : val?.data?.module,
        platform: val?.data?.platform,
        title: val?.data?.title,
        description: val?.data?.description,
        // doc: myFileName,
        status: 'ACTIVE',
      };
      let myFileName = '';
      if (val?.data?.doc !== val?.data?.thumbnail?.[0]?.name) {
        if (val?.data?.thumbnail) {
          postData.doc = await getFileName(val);
        }
      }

      if (val?.data?.doc == val?.data?.thumbnail) {
        postData.doc = val?.data?.doc;
      }
      // console.log('postData', postData);
      axios
        .put(Api.baseUri + '/user-reg/userGuide/update', postData)
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success('Updated Successfully');
            setOpen(false);
            getData();
            // allList();
          } else {
            toast.error(res?.data?.message || 'Something went Wrong');
            setShowbtn(true);
          }
        })
        .catch((err) => {
          toast.error('Something went Wrong');
          setShowbtn(true);
        });
    }
  }
  return (
    <div>
      <Dialog
        open={true}
        onClose={() => {
          setOpen(false);
        }}
      >
        <DialogTitle
          style={{background: '#f5f2f2', padding: '20px 55px 13px 15px'}}
        >
          <Typography
            component='h2'
            variant='h2'
            sx={{mb: 3, fontWeight: 600}}
            id='alert-dialog-title'
          >
            {data ? 'Update ' : 'Add User Guide'}
          </Typography>
          <CloseIcon
            onClick={() => {
              setOpen(false);
            }}
            style={{position: 'absolute', right: '12px', top: '14px'}}
          />
        </DialogTitle>
        <DialogContent
          sx={{color: 'text.secondary', fontSize: 14, width: '800px'}}
          id='alert-dialog-description'
        >
          <div style={{padding: '20px'}}>
            {data?.id ? (
              <NewUserGuide
                data={data}
                close={() => {
                  setOpen(false);
                  getData();
                }}
              />
            ) : (
              <SmartForm
                template={template}
                onSubmit={handleSubmit}
                onChange={handleChange}
                success={showbtn}
                filterbtnStyle={{
                  background: '#0f1f48',
                  borderRadius: '20px',
                  width: '130px',
                  marginTop: '20px',
                }}
                buttons={['submit']}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Upload;
