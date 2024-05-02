import React, {useEffect, useState} from 'react';
import SmartForm from '@smart-form';
import Api from '@api';
import axios from 'axios';
import {toast} from 'react-toastify';
import {get} from 'lodash';
const AdhocTripForm = ({close, action, adhocid, employeeId}) => {
  const [employeeList, setEmployeeList] = useState();
  const [address, setAddress] = useState();
  const [empId, setEmpId] = useState();
  const [tripType, setTripType] = useState();
  const [temData, settemData] = useState({});
  const [data, setData] = useState();

  useEffect(() => {
    axios
      .get(
        Api.baseUri +
          '/user-reg/employee-reg/corporate?page=0&size=10000000&emailId=null&employeeCode=null&mobileNo=null',
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          let temp = [];
          res?.data?.data?.body?.EmployeeList?.map((el) => {
            temp.push({
              title: el?.employeeFullName + '(' + el?.employeeCode + ')',
              value: el?.id,
              name: el?.employeeFullName,
            });
          });
          setEmployeeList(temp ?? []);
        }
      })
      .catch((err) => {
        setEmployeeList([]);
      });
  }, []);

  useEffect(() => {
    if (!empId) {
      setAddress({from_address: '', to_Address: ''})
      return
    }
    axios
      .get(Api.baseUri + '/user-reg/employee-reg/' + empId)
      .then((res) => {
        console.log('res', res);
        if (res?.data?.status == '200') {
          let temp_url = `${Api.siteOffice.list}/${res?.data?.data?.officeId}`;
          axios
            .get(temp_url)
            .then((resp) => {
              if (resp?.data?.status == '200') {
                setAddress({
                  from_address: res?.data?.data?.pickupLocation?.locName,
                  to_Address: resp?.data?.data?.location?.locName,
                });
              } else {
                setAddress({from_address: '', to_Address: ''});
              }
            })
            .catch((err) => {
              setAddress({from_address: '', to_Address: ''});
            });
        }
      })
      .catch((err) => {});
  }, [empId]);
  useEffect(() => {
    if (!adhocid) return;
    axios
      .get(
        Api.baseUri + '/user-reg/adhoc-trip/get-adhoc-request-by-id/' + adhocid,
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          setData(res?.data?.data);
          setEmpId(res?.data?.data?.empId);
        }
      })
      .catch((err) => {});
  }, [adhocid]);

  let template = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
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
                type: 'autocomplete',
                name: 'empId',
                id: 'empId',
                title: 'Employee ',
                validationProps: {
                  required: 'This is a mandatory field',
                },
                // infoMessage: ["Alphabets are allowed", "Maximum length should be 50 characters", "e.g.:TATA"],

                options: employeeList ?? [],
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
                validationProps: {
                  required: 'This is a mandatory field',
                  manual: [
                    {
                      condition: `date >= today`,
                      message:
                        "Date should be greater than or equal to today's date.",
                    },
                  ],
                },
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
            title: 'Remark',
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
        ],
      },
    ],
  };

  function handleSubmit(value) {
    if (value?.button == 'update') {
      employeeList?.map((el) => {
        if (el.value == value?.data?.empId) value.data.empName = el.name;
      });
      delete value?.data?.tempHome;
      delete value?.data?.tempOffice;

      if (value?.data?.tripType == 'LOGIN') {
        value.data.tripType = 'UPTRIP';
      }
      if (value?.data?.tripType == 'LOGOUT') {
        value.data.tripType = 'DOWNTRIP';
      }
      axios
        .put(
          Api.baseUri + '/user-reg/adhoc-trip/update-adhoc-request',
          value?.data,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            // toast.success(
            //   res?.data?.message ?? 'Adhoc Trip Created Successfully',
            // );
            toast.success(
              `Adhoc Request updated for ${res?.data?.data?.empName} successfully`,
            );
            close();
          } else {
            toast.error('Something Went Wrong');
          }
        })
        .catch((err) => {});
      return;
    }
    if (value?.button == 'submit') {
      if (value?.data?.tripType == 'LOGIN') {
        value.data.tripType = 'UPTRIP';
      }
      if (value?.data?.tripType == 'LOGOUT') {
        value.data.tripType = 'DOWNTRIP';
      }

      delete value?.data?.tempHome;
      delete value?.data?.tempOffice;

      axios
        .post(
          Api.baseUri +
            '/user-reg/adhoc-trip/create-adhoc-request-by-corporate',
          value?.data,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success(
              `Adhoc Request created for ${res?.data?.data?.empName} successfully`,
            );
            close();
          } else {
            toast.error(res?.data?.message || 'Something went Wrong');
          }
        })
        .catch((err) => {
          toast.error('Something went Wrong');
        });
    }
  }

  function getMyData(val) {
    // console.log('ddd', val);
    setTripType(val?.tripType);
    setEmpId(val?.empId);
    // getEmployeeInfo(val?.empId);
  }
  return (
    <>
      {action == 'create' && (
        <SmartForm
          template={template}
          defaultValues={{
            tripType: 'LOGIN',
            tempHome: address?.from_address,
            tempOffice: address?.to_address,
          }}
          onSubmit={handleSubmit}
          getOnInput={getMyData}
          setVal={[
            {name: 'tempHome', value: address?.from_address || ''},
            {name: 'tempOffice', value: address?.to_Address || ''},
          ]}
          buttons={['submit']}
          mode='onTouched'
        />
      )}

      {action == 'Edit' && data?.id && employeeList && (
        <SmartForm
          template={template}
          defaultValues={{
            ...data,
            tripType: data?.tripType == 'DOWNTRIP' ? 'LOGOUT' : 'LOGIN',
          }}
          onSubmit={handleSubmit}
          getOnInput={getMyData}
          setVal={[
            {name: 'tempHome', value: address?.from_address},
            {name: 'tempOffice', value: address?.to_Address},
          ]}
          buttons={['update']}
          mode='onTouched'
        />
      )}
    </>
  );
};

export default AdhocTripForm;
