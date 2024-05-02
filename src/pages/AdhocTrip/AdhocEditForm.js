import React, {useEffect, useState} from 'react';
import SmartForm from '@smart-form';
import regex from '@regex';
import axios from 'axios';
import Api from '@api';
import {toast} from 'react-toastify';
import {useAuthUser} from '@crema/utility/AuthHooks';
import ConsecutiveSnackbars from 'pages/muiComponents/feedback/Snackbar/ConsecutiveSnackbars';
const EditAdhocTripForm = ({close}) => {
  const {user} = useAuthUser();
  const [prefetchData, setPrefetchData] = useState();
  useEffect(() => {}, [prefetchData]);

  useEffect(() => {
    axios
      .get(Api.baseUri + '/user-reg/employee-reg/' + user?.userList?.profileId)
      .then((res) => {
        axios
          .get(
            Api.baseUri +
              '/user-reg/employee-reg/' +
              res?.data?.data?.managerId,
          )
          .then((respo) => {
            setPrefetchData({
              name: res?.data?.data?.managerName,
              mEmailId: respo?.data?.data?.emailId,
              manageId: res?.data?.data?.managerId,
              homeLocation: res?.data?.data?.residenceAddress?.addressName,
              officeLocation: res?.data?.data?.officeId,
            });
          })
          .catch((err) => {});
      })
      .catch((err) => {});
  }, [user?.userList?.profileId]);

  useEffect(() => {
    if (prefetchData?.officeLocation.length) {
      axios
        .get(
          Api.baseUri +
            '/user-reg/siteoffice-reg/' +
            prefetchData?.officeLocation,
        )
        .then((response) => {
          setPrefetchData({
            ...prefetchData,
            officeAddress: response?.data?.data?.officeAddress?.addressName,
          });
        })
        .catch((err) => {});
    }
  }, [prefetchData?.officeLocation]);

  let template = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    // title: 'Vehicle Type',
    // description: 'Form for applying Job',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'switchToggle',
            name: 'tripType',
            id: 'tripType',
            title: 'Trip Type',
            options: [
              {title: 'Up Trip', value: 'LOGIN'},
              {title: 'Down Trip', value: 'LOGOUT'},
            ],
            // infoMessage: ["Numeric characters are allowed", "Maximum length should be 2 characters", "e.g.: 8"],
          },

          {
            type: 'section',
            layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
            fields: [
              {
                type: 'text',
                name: 'tempmanager',
                id: 'tempmanager',
                title: 'Manager Name',
                // infoMessage: ["Alphabets are allowed", "Maximum length should be 50 characters", "e.g.:TATA"],
                disabled: true,
              },
              {
                type: 'text',
                name: 'tempmanageremail',
                id: 'tempmanageremail',
                title: 'Manager Email',
                // infoMessage: ["Alphabets are allowed", "Maximum length should be 50 characters", "e.g.:TATA"],
                disabled: true,
              },
              {
                type: 'text',
                name: 'tempHome',
                id: 'tempHome',
                title: 'From Address',
                dynamic: {
                  field: 'tripType',
                  value: 'LOGIN',
                },
                disabled: true,
                // infoMessage: ["Numerics are allowed", "Time should start from 00-23", "It should be followed by two digits from 00 to 59", "e.g.: 00:00, 22:00"],
                validationProps: {
                  // required: 'This is a mandatory field'
                },
              },
              {
                type: 'text',
                name: 'tempOffice',
                id: 'tempOffice',
                title: 'To Address',
                dynamic: {
                  field: 'tripType',
                  value: 'LOGIN',
                },
                disabled: true,
                // infoMessage: ["Numerics are allowed", "Time should start from 00-23", "It should be followed by two digits from 00 to 59", "e.g.: 00:00, 22:00"],
                validationProps: {
                  // required: 'This is a mandatory field'
                },
              },

              {
                type: 'text',
                name: 'tempOffice',
                id: 'tempOffice',
                title: 'From Address',
                dynamic: {
                  field: 'tripType',
                  value: 'LOGOUT',
                },
                disabled: true,
                // infoMessage: ["Numerics are allowed", "Time should start from 00-23", "It should be followed by two digits from 00 to 59", "e.g.: 00:00, 22:00"],
                validationProps: {
                  // required: 'This is a mandatory field'
                },
              },
              {
                type: 'text',
                name: 'tempHome',
                id: 'tempHome',
                title: 'To Address',
                dynamic: {
                  field: 'tripType',
                  value: 'LOGOUT',
                },
                disabled: true,
                // infoMessage: ["Numerics are allowed", "Time should start from 00-23", "It should be followed by two digits from 00 to 59", "e.g.: 00:00, 22:00"],
                validationProps: {
                  // required: 'This is a mandatory field'
                },
              },
              {
                type: 'date',
                name: 'date',
                id: 'date',
                title: 'Date',
                min: 'today',
                // infoMessage: ["Numerics are allowed", "Time should start from 00-23", "It should be followed by two digits from 00 to 59", "e.g.: 00:00, 22:00"],
              },

              {
                type: 'text',
                name: 'time',
                id: 'time',
                title: 'Time',
                input_type: 'time',
                // infoMessage: ["Numerics are allowed", "Time should start from 00-23", "It should be followed by two digits from 00 to 59", "e.g.: 00:00, 22:00"],
                validationProps: {
                  required: 'This is a mandatory field',
                },
              },
            ],
          },

          {
            type: 'text',
            name: 'empRemark',
            id: 'empRemark',
            // infoMessage: ["Numeric characters are allowed", "Maximum length should be 2 characters", "e.g.: 6"],
            title: 'Employee Remark',
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
        ],
      },
    ],
  };

  function handleSubmit(values) {
    let postData = {
      date: values?.data?.date,
      time: values?.data?.time,
      // "tripType": values?.data?.tripType || "UPTRIP",
      empRemark: values?.data?.empRemark,
      managerId: prefetchData.manageId,
    };
    if (values?.data?.tripType == 'LOGIN' || ' ') {
      postData.tripType = 'UPTRIP';
    }
    if (values?.data?.tripType == 'LOGOUT') {
      postData.tripType = 'DOWNTRIP';
    }

    axios
      .post(Api.baseUri + '/user-reg/adhoc-trip/create-adhoc-request', postData)
      .then((res) => {
        if (res?.data?.status == '200') {
          toast.success('Request Sent');
          close();
        } else {
          toast.error('Something went Wrong');
        }
      })
      .catch((err) => {
        close();
      });
  }
  return (
    <>
      {' '}
      {prefetchData?.officeAddress && (
        <SmartForm
          template={template}
          defaultValues={{
            tripType: 'LOGIN',
            tempmanager: prefetchData.name ?? 'NA',
            tempHome: prefetchData.homeLocation ?? 'NA',
            tempOffice: prefetchData.officeAddress ?? 'NA',
            tempmanageremail: prefetchData.mEmailId,
          }}
          onSubmit={handleSubmit}
          buttons={['submit']}
          // showbtn={showbtn}

          mode='onTouched'
        />
      )}
    </>
  );
};

export default EditAdhocTripForm;
