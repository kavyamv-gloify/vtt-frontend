import React, {useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import SmartForm from '@smart-form';
import {useAuthUser} from '@crema/utility/AuthHooks';
import regex from '@regex';
import axios from 'axios';
import api from '@api';
import SnackbarCustom from 'pages/thirdParty/SnackBar/SnackBarMsg';
import {SettingsPowerRounded} from '@mui/icons-material';
import AppLoader from '@crema/core/AppLoader';
import {toast} from 'react-toastify';

const ComplianceForm = (props) => {
  //
  // if(props?.myId != "CREATE"){
  // }

  const navigate = useNavigate();
  const [data, setData] = useState();
  const [info, setInfo] = useState({});
  const [showbtn, setshowbtn] = React.useState(true);
  const [thisID, setthisID] = useState();
  const [boolean, setBoolean] = useState(false);
  const [snackbarMsg, setsnackBarMsg] = useState();
  const {user} = useAuthUser();

  //

  const id = props.id;
  const driverLicense = props.driverId;

  console.group('license', driverLicense);

  useEffect(() => {
    async function fetchData() {
      const baseURL = `${api.vendor.list}/${user?.userList?.profileId}`;
      let response = await axios.get(`${baseURL}`);

      let tempo = response?.data?.data;
      setData(tempo);
    }
    fetchData();
  }, [user?.userList?.profileId]);

  useEffect(() => {
    async function fetchData() {
      const baseURL = `${api.compliance.getdriverCompliance}/${id}/driverId?page=0&size=1`;
      let response = await axios.get(`${baseURL}`);

      let tempo = response.data?.data?.body?.DriverComplianceList[0];

      setInfo(tempo ?? {temid: 'CREATE'});
    }

    fetchData();
  }, [id]);

  let template = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    title:
      info?.temid == 'CREATE'
        ? 'Driver Compliance'
        : 'Update Driver Compliance',
    description: 'Form for applying Job',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'text',
            name: 'driverName',
            id: 'driverName',
            title: 'Driver Name',
            disabled: true,
            defaultValue: props?.driverName,
          },
          {
            type: 'text',
            name: 'drivingLicense',
            id: 'drivingLicense',
            title: 'Driving License Number',

            pattern: {
              value: regex.drivingLicReg,
              message: 'Please enter valid Driving License No.',
            },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'text',
            name: 'temperature',
            id: 'temperature',
            title: 'Temperature (In °F)',
            pattern: {
              value: regex.temperatureReg,
              message: 'Please enter accurate Temperature',
            },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },

          {
            type: 'section',
            layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
            fields: [
              {
                type: 'radio',
                name: 'inDress',
                id: 'inDress',
                title: 'In Dress',
                options: [
                  {title: 'Yes', value: 'yes'},
                  {title: 'No', value: 'no'},
                ],
                validationProps: {
                  required: 'This is a mandatory field',
                },
              },

              {
                type: 'radio',
                name: 'policeVerification',
                id: 'policeVerification',
                title: 'Police Verification',
                options: [
                  {title: 'Yes', value: 'Yes'},
                  {title: 'No', value: 'No'},
                ],
                validationProps: {
                  required: 'This is a mandatory field',
                },
              },
            ],
          },
          {
            type: 'section',
            layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
            fields: [
              {
                type: 'radio',
                name: 'wearingMask',
                id: 'wearingMask',
                title: 'Wearing Mask',
                options: [
                  {title: 'Yes', value: 'Yes'},
                  {title: 'No', value: 'No'},
                ],
                validationProps: {
                  required: 'This is a mandatory field',
                },
              },

              {
                type: 'radio',
                name: 'sanitized',
                id: 'sanitized',
                title: 'Sanitized',
                options: [
                  {title: 'Yes', value: 'Yes'},
                  {title: 'No', value: 'No'},
                ],
                validationProps: {
                  required: 'This is a mandatory field',
                },
              },
            ],
          },
          {
            type: 'section',
            layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
            fields: [
              {
                type: 'radio',
                name: 'vaccination',
                id: 'vaccination',
                title: 'Vaccination',
                options: [
                  {title: 'Yes', value: 'Yes'},
                  {title: 'No', value: 'No'},
                ],
                validationProps: {
                  required: 'This is a mandatory field',
                },
              },

              {
                type: 'file',
                name: 'driverInDressImageDoc',
                id: 'driverInDressImageDoc',
                title: 'Upload Image',
                accept: 'image/*,.pdf,.doc,.docx',
                tempFilename: info?.driverInDressImageDoc,
                validationProps: info?.driverInDressImageDoc
                  ? {
                      // required: 'This is a mandatory field',
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
              {
                type: 'file',
                name: 'driverDoc',
                id: 'driverDoc',
                title: 'Upload Document',
                accept: 'image/*,.pdf,.doc,.docx',
                tempFilename: info?.driverInDressImageDoc,
                validationProps: info?.driverInDressImageDoc
                  ? {
                      // required: 'This is a mandatory field',
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
              // {
              //     type: 'text',
              //     name: 'lastUpdatedOn',
              //     id: 'lastUpdatedOn',
              //     title: "Last Update",
              //     // pattern: {
              //     //     value: regex.amountReg,
              //     //     message: 'Please enter numeric value only'
              //     // },
              //     validationProps: {
              //         required: 'This is a mandatory field'
              //     }
              // },
            ],
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

  const handleSubmit = async (values) => {
    setshowbtn(false);

    setshowbtn(false);

    if (values.button.toUpperCase() === 'SUBMIT') {
      let dataSet = {};
      let allElem = {};
      let tem = values.data;
      tem.driverId = id;
      tem.drivingLicense = driverLicense;
      tem.vendorCode = data?.vendorCode;
      tem.vendorName = data?.vendorName;
      delete tem.driverName;
      if (!tem?.driverInDressImageDoc?.length)
        delete tem?.driverInDressImageDoc;

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
        method: 'post',
        url: api.compliance.getdriverCompliance + '/savedrivercompliance',
        data: getFormData(dataSet),
        headers: {'Content-Type': 'multipart/form-data'},
      })
        .then(function (response) {
          if (response?.data?.status == 200) {
            toast.success(
              response?.data?.message,
              'User Registered Succefully',
            );
            props.myDial(false);
            navigate(`/compliance-listing`);
          } else {
            toast.error(response?.data?.message, 'Something went wrong');
          }
          setshowbtn(true);
        })
        .catch(function (err) {
          setshowbtn(true);
          //handle error
          toast.error(err?.data?.message, 'Something went wrong');
        });
    }

    if (values.button.toUpperCase() === 'UPDATE') {
      let dataSet = {};
      let allElem = {};
      let tem = values.data;
      tem.driverId = id;
      tem.vendorCode = data?.vendorCode;
      tem.vendorName = data?.vendorName;

      delete tem.driverName;
      delete tem.lastUpdatedOn;
      if (!tem?.driverInDressImageDoc?.length)
        delete tem?.driverInDressImageDoc;
      if (!tem?.driverDoc?.length) delete tem?.driverDoc?.length;

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
        url: api.compliance.getdriverCompliance + '/updatedrivercompliance',
        data: getFormData(dataSet),
        headers: {'Content-Type': 'multipart/form-data'},
      })
        .then(function (response) {
          if (response?.data?.status == 200) {
            toast.success(
              response?.data?.message,
              'User Registered Succefully',
            );
            props.myDial(false);
            navigate(`/compliance-listing`);
          } else {
            toast.error(response?.data?.message, 'Something went wrong');
          }
          setshowbtn(true);
        })
        .catch(function (err) {
          setshowbtn(true);
          //handle error
          toast.error(err?.data?.message, 'Something went wrong');
        });
    }
  };
  return (
    <>
      {!showbtn ? <AppLoader /> : null}

      {(info?.temid == 'CREATE' || info?.id) && (
        <SmartForm
          template={template}
          defaultValues={info?.temid == 'CREATE' ? null : info}
          onSubmit={handleSubmit}
          buttons={info?.temid == 'CREATE' ? ['submit'] : ['update']}
          setVal={[{name: 'drivingLicense', value: driverLicense}]}
        />
      )}
    </>
  );
};

export default ComplianceForm;
