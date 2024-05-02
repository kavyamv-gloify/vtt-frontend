import {Dialog, DialogContent, DialogTitle, Typography} from '@mui/material';
import React, {useEffect, useState} from 'react';
import SmartForm from '@smart-form';
import CloseIcon from '@mui/icons-material/Close';
import {getFormData} from '@hoc';
import axios from 'axios';
import Api from '@api';
import NewTraining from './NewTraining';
import {toast} from 'react-toastify';
const Upload = ({setOpen, data, getData}) => {
  const [showbtn, setShowbtn] = useState(true);
  const [module, setModule] = useState([]);
  // console.log('data', data);
  useEffect(() => {
    if (!data) {
      return;
    }
    if (data?.id && data?.stakeHolder) {
      if (data?.stakeHolder == 'SUPERADMIN') {
        setModule(SuperAdminModule);
      } else if (data?.stakeHolder == 'CORPORATEADMIN') {
        setModule(corporateModule);
      } else if (data?.stakeHolder == 'VENDOR') {
        setModule(VendorModule);
      } else if (data?.stakeHolder == 'EMPLOYEE') {
        setModule(EmployeeModule);
      } else if (data?.stakeHolder == 'MANAGER') {
        setModule(ManagerModule);
      } else setModule(DriverModule);
    }
  }, [data]);

  const corporateModule = [
    {title: 'Masters', value: 'Master'},
    {title: 'Active Trip', value: 'Active Trips'},
    {title: 'Live Tracking', value: 'Live Tracking'},
    {title: 'Roster', value: 'Roster'},
    {title: 'Routes', value: 'Routes'},
    {title: 'Schedule', value: 'SCHEDULE'},
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
    {title: 'Incident Management', value: 'Incident Management'},
    {title: 'Driver Attendance', value: 'Driver Attendance'},
    {title: 'Fuel Tracking', value: 'Fuel Tracking'},
    {title: 'New', value: 'NEW'},
  ];

  const StakeHolder = [
    {title: 'Super Admin', value: 'SUPERADMIN'},
    {title: 'Corporate Admin', value: 'CORPORATEADMIN'},
    {title: 'Employee', value: 'EMPLOYEE'},
    {title: 'Manager', value: 'MANAGER'},
    {title: 'Driver', value: 'DRIVER'},
    {title: 'Vendor', value: 'VENDOR'},
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
    {title: 'Announcements', value: 'Announcements'},
    {title: 'Setting', value: 'Setting'},
    {title: 'Incident Management', value: 'Incident Management'},
    {title: 'Driver Attendance', value: 'Driver Attendance'},
    {title: 'Fuel Tracking', value: 'Fuel Tracking'},
    {title: 'New', value: 'NEW'},
  ];

  const EmployeeModule = [
    {title: 'Manage Leave', value: 'Manage Leave'},
    {title: 'Training Video', value: 'Training Video'},
    {title: 'Adhoc Trip', value: 'Adhoc Trip'},
    {title: 'Roster', value: 'Roster'},
    {title: 'Your Rides	', value: 'Your Rides	'},
    {title: 'Support', value: 'Support'},
    {title: 'New', value: 'NEW'},
  ];

  const ManagerModule = [
    {title: 'Leave Management', value: 'Leave Management'},
    {title: 'Training Video', value: 'Training Video'},
    {title: 'Adhoc Trip', value: 'Adhoc Trip'},
    {title: 'Roster', value: 'Roster'},
    {title: 'Your Rides	', value: 'Your Rides	'},
    {title: 'Support', value: 'Support'},
    // {title: 'New', value: 'NEW'},
  ];
  const SuperAdminModule = [
    {title: 'Corporate', value: 'Corporate'},
    {title: 'New', value: 'NEW'},
  ];
  const DriverModule = [
    {title: 'Compliance', value: 'Compliance'},
    {title: 'Feedback', value: 'Feedback'},
    {title: 'Driver Attendance', value: 'Driver Attendance'},
    {title: 'Support', value: 'Support'},
    {title: 'Fuel Tracking', value: 'Fuel Tracking'},
    {title: 'New', value: 'NEW'},
  ];
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
                type: 'text',
                name: 'thumbnailUrl',
                id: 'thumbnailUrl',
                title: 'Thumbnail URL',
                defaultValue: data?.thumbnailURL,
                validationProps: {
                  // required: 'This is a mandatory field'
                },
              },
              {
                type: 'text',
                name: 'youtubeUrl',
                id: 'youtubeUrl',
                defaultValue: data?.youtubeURL,
                title: 'Youtube URL',
                validationProps: {
                  required: 'This is a mandatory field',
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
    } else if (val?.stakeHolder?.value == 'MANAGER') {
      setModule(ManagerModule);
    } else setModule(DriverModule);
  }

  const getFileName = async (dataSet) => {
    let temp = await axios({
      method: 'post',
      url: Api.baseUri + '/trainingVideos/save-file',
      data: getFormData(dataSet),
      headers: {'Content-Type': 'multipart/form-data'},
    });
    return temp?.data?.data?.documentName;
  };

  async function handleSubmit(val) {
    setShowbtn(false);
    // console.log('val', val);

    if (val?.button == 'submit') {
      let postData = {
        stakeHolder: val?.data?.stakeHolder,
        module:
          val?.data?.modules == 'NEW'
            ? val?.data?.newmodule
            : val?.data?.module,
        platform: val?.data?.platform,
        title: val?.data?.title,
        description: val?.data?.description,
        thumbnailURL: val?.data?.thumbnailUrl,
        youtubeURL: val?.data?.youtubeUrl,
        status: 'ACTIVE',
      };
      axios
        .post(Api.baseUri + '/user-reg/trainingVideos/save', postData)
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
        thumbnailURL: val?.data?.thumbnailUrl,
        youtubeURL: val?.data?.youtubeUrl,
        status: 'ACTIVE',
      };
      axios
        .put(Api.baseUri + '/user-reg/trainingVideos/update', postData)
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success('Updated Successfully');
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
  }
  return (
    <div>
      <Dialog
        open={true}
        PaperProps={{
          sx: {
            width: '50%',
          },
        }}
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
            {data?.id ? 'Update Training Videos' : 'Add Training Videos'}
          </Typography>
          <CloseIcon
            onClick={() => {
              setOpen(false);
            }}
            style={{position: 'absolute', right: '12px', top: '14px'}}
          />
        </DialogTitle>
        <DialogContent
          sx={{
            color: 'text.secondary',
            fontSize: 14,
            // width: '500px',
            padding: '20px',
          }}
          id='alert-dialog-description'
        >
          {data?.id ? (
            <NewTraining
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

          {/* <div style={{padding: '20px'}}>
            {data?.id ? (
              data?.id &&
              data?.module &&
              module &&
              module?.length && (
                <SmartForm
                  template={template}
                  onSubmit={handleSubmit}
                  defaultValues={data}
                  onChange={handleChange}
                  success={showbtn}
                  // setVal={[
                  //   {name: 'tempHome', value: address?.from_address || ''},
                  //   {name: 'tempOffice', value: address?.to_Address || ''},
                  // ]}
                  filterbtnStyle={{
                    background: '#0f1f48',
                    borderRadius: '20px',
                    width: '130px',
                    marginTop: '20px',
                  }}
                  buttons={['update']}
                />
              )
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
          </div> */}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Upload;
