import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
// import SmartForm from '@smart-form';
import {useAuthUser} from '@crema/utility/AuthHooks';
import regex from '@regex';
import axios from 'axios';
import Api from '@api';
import SnackbarCustom from 'pages/thirdParty/SnackBar/SnackBarMsg';
import {Grid} from '@mui/material';
import CustomLabel from 'pages/common/CustomLabel';
import {SettingsPowerRounded} from '@mui/icons-material';
import AppLoader from '@crema/core/AppLoader';
import {toast} from 'react-toastify';
import SmartForm from '@smart-form';
import {useParams} from 'react-router-dom';
const index = () => {
  const [showbtn, setshowbtn] = useState(true);
  const [data, setData] = useState();
  const {id} = useParams();
  useEffect(() => {
    if (!id) {
      return;
    }
    getData();
  }, [id]);
  function getData() {
    axios
      .get(
        Api.baseUri +
          `/user-reg/trip-setting/get-tripSettingByCorporateId/${id}`,
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          console.log('res', res?.data?.data);
          setData(res?.data?.data);
        }
      })
      .catch((err) => {
        setData({});
      });
  }
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
            name: 'allowVendorToChangeTheVehicleLogin',
            id: 'allowVendorToChangeTheVehicleLogin',
            title: 'Allow vendor to change the vehicle login',
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
            name: 'allowVendorToChangeTheVehicleBeforeTimeOfLogin',
            id: 'allowVendorToChangeTheVehicleBeforeTimeOfLogin',
            title:
              'Allow vendor to change the vehicle before the time of login',
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
            name: 'allowVendorToChangeTheVehicleLogout',
            id: 'allowVendorToChangeTheVehicleLogout',
            title: 'Allow vendor to change the vehicle logout',
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
            name: 'allowVendorToChangeTheVehicleBeforeTimeOfLogout',
            id: 'allowVendorToChangeTheVehicleBeforeTimeOfLogout',
            title: 'Allow vendor to change the vehicle before time of logout',
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
            type: 'section',
            layout: {column: 2, spacing: 2, size: 'small', label: 'fixed'},
            fields: [
              {
                type: 'switchToggle',
                name: 'cutoffTimeToCanelTheTripBeforeLogin',
                id: 'cutoffTimeToCanelTheTripBeforeLogin',
                title: 'Allow cut off time to cancel the trip before login',
                validationProps: {
                  // required: 'This is a mandatory field'
                },
                options: [
                  {title: 'Yes', value: 'YES'},
                  {title: 'No', value: 'NO'},
                ],
              },
              {
                type: 'text',
                name: 'cutoffTimeToCanelTheTripBeforeLoginTime',
                id: 'cutoffTimeToCanelTheTripBeforeLoginTime',
                title:
                  'Cut off time to cancel the trip before _______ of login',
                validationProps: {
                  // required: 'This is a mandatory field'
                },
                dynamic: {
                  field: 'cutoffTimeToCanelTheTripBeforeLogin',
                  value: 'YES',
                },
                maxChar: 6,
                isNumber: true,
              },
            ],
          },
          {
            type: 'section',
            layout: {column: 2, spacing: 2, size: 'small', label: 'fixed'},
            fields: [
              {
                type: 'switchToggle',
                name: 'cutoffTimeToCanelTheTripBeforeLogout',
                id: 'cutoffTimeToCanelTheTripBeforeLogout',
                title: 'Allow cut off time to cancel the trip before logout',
                validationProps: {
                  // required: 'This is a mandatory field'
                },
                options: [
                  {title: 'Yes', value: 'YES'},
                  {title: 'No', value: 'NO'},
                ],
              },
              {
                type: 'text',
                name: 'cutoffTimeToCanelTheTripBeforeLogoutTime',
                id: 'cutoffTimeToCanelTheTripBeforeLogoutTime',
                title:
                  'Cut off time to cancel the trip before _______ of logout',
                validationProps: {
                  // required: 'This is a mandatory field'
                },
                dynamic: {
                  field: 'cutoffTimeToCanelTheTripBeforeLogout',
                  value: 'YES',
                },
                maxChar: 6,
                isNumber: true,
              },
            ],
          },

          {
            type: 'section',
            layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
            fields: [
              {
                type: 'switchToggle',
                name: 'ableToTrackTheVehicle',
                id: 'ableToTrackTheVehicle',
                title: 'Allow to Track vehicle through gps',
                validationProps: {
                  // required: 'This is a mandatory field'
                },
                options: [
                  {title: 'Yes', value: 'YES'},
                  {title: 'No', value: 'NO'},
                ],
              },
              // {
              //   type: 'autocomplete',
              //   name: 'gpsTrackingMode',
              //   id: 'gpsTrackingMode',
              //   title: 'Tracking through',
              //   options: [
              //     {title: 'Vehicle GPS', value: 'VEHICLE_GPS'},
              //     {title: 'Mobile GPS', value: 'MOBILE_GPS'},
              //   ],
              //   validationProps: {
              //     // required: 'This is a mandatory field'
              //   },
              //   dynamic: {
              //     field: 'ableToTrackTheVehicle',
              //     value: 'YES',
              //   },
              //   // maxChar: 6,
              //   // isNumber: true,
              // },
            ],
          },
        ],
      },
    ],
  };

  function handleSubmit(val) {
    setshowbtn(false);
    if (val?.button == 'submit') {
      let postData = val?.data;
      postData.corporateId = [id];
      axios
        .post(Api.baseUri + '/user-reg/trip-setting/save-tripSetting', postData)
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success('Trip Setting submitted successfully');
          }
          setshowbtn(true);
          getData();
        })
        .catch((err) => {
          toast.error(err);
        });
    }

    if (val?.button == 'update') {
      let postData = val?.data;
      postData.corporateId = [id];
      console.log('postData', postData);
      axios
        .put(
          Api.baseUri + '/user-reg/trip-setting/update-tripSetting',
          postData,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success('Trip Setting updated successfully');
          }
          setshowbtn(true);
        })
        .catch((err) => {
          toast.error(err);
        });
    }
  }
  return (
    <>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={8}>
          <CustomLabel labelVal='Trip Setting' variantVal='h3-underline' />
        </Grid>
      </Grid>
      {!showbtn ? <AppLoader /> : null}

      {/* <SmartForm
        template={template}
        // defaultValues={data?.id ? data : {}}
        onSubmit={handleSubmit}
        buttons={['submit']}
      /> */}
      {data?.id && (
        <SmartForm
          template={template}
          defaultValues={data?.id ? data : {}}
          onSubmit={handleSubmit}
          buttons={['update']}
        />
      )}
      {!data?.id && (
        <SmartForm
          template={template}
          // defaultValues={data?.id ? data : {}}
          onSubmit={handleSubmit}
          buttons={['submit']}
        />
      )}
    </>
  );
};

export default index;
