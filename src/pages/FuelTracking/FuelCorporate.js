import React, {useState, useEffect} from 'react';
import SmartForm from '@smart-form';
import {toast} from 'react-toastify';
import axios from 'axios';
import Api from '@api';
import {getFormData} from '@hoc';
const FuelCorporate = ({close}) => {
  const [vendorOptions, setVendorOptions] = useState();
  const [vehicleList, setVehicleList] = useState();
  const [driverList, setDriverList] = useState();
  function getAllVehicle(vendor) {
    axios
      .get(
        Api.baseUri +
          `/user-reg/vehicle-reg/vehicleListingByVendorId?page=0&size=1000&vendorId=${vendor}
            `,
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          console.log('res', res);
          let temp = [];
          res?.data?.data?.body?.DriverList?.map((el) => {
            temp.push({
              title: el?.vehicleNumberPlate,
              value: el?.vehicleNumberPlate,
            });
          });
          setVehicleList(temp ?? []);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  }
  function getAllDriver(vendor) {
    console.log('vendor', vendor);
    axios
      .get(
        Api.baseUri +
          `/user-reg/driver-reg/driverListingByVendorId?page=0&size=1000&vendorId=${vendor}`,
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          let temp = [];
          res?.data?.data?.body?.DriverList?.map((el) => {
            temp.push({
              title: el?.firstName + ' ' + el?.lastName,
              value: el?.id,
            });
          });
          setDriverList(temp ?? []);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  }
  useEffect(() => {
    axios
      .get(Api.baseUri + '/user-reg/associatevendor/getallassociatecorporateId')
      .then((re) => {
        let ar = [];
        re?.data?.data?.map((el) => {
          ar.push({title: el?.vendorName, value: el?.vendorId});
        });
        setVendorOptions(ar);
      });
  }, []);
  let template = {
    layout: {
      column: 1,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    // title: 'Fuel Type',
    description: 'Form for applying Job',
    sections: [
      {
        layout: {column: 2, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'date',
            name: 'date',
            id: 'date',
            title: 'Date',
            max: 'today',
            validationProps: {
              required: 'This is a mandatory field',
            },
            manual: [
              {
                condition: `registrationDate <= today`,
                message:
                  "Registration Date should be less than or equal to today's date.",
              },
            ],
          },
          {
            type: 'autocomplete',
            name: 'vendorId',
            id: 'vendorId',
            title: 'Vendor',
            options: vendorOptions ?? [],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'autocomplete',
            name: 'driverId',
            id: 'driverId',
            title: 'Driver',
            options: driverList ?? [],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },

          {
            type: 'autocomplete',
            name: 'vehicleNo',
            id: 'vehicleNo',
            title: 'Vehicle Number',
            options: vehicleList ?? [],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },

          {
            type: 'text',
            name: 'fuelPrice',
            id: 'fuelPrice',
            title: 'Fuel Price',
            // isNumber: true,
            pattern: {
              value: /^[0-9)]{1,5}?\.|[0-9]{1,6}$/,
              message: 'Please enter valid alternate number',
            },
            maxChar: 6,
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'text',
            name: 'fuelVolume',
            id: 'fuelVolume',
            title: 'Fuel Volume',
            pattern: {
              value: /^[0-9)]{1,5}?\.|[0-9]{1,6}$/,
              message: 'Please enter valid alternate number',
            },
            // isNumber: true,
            maxChar: 6,
            validationProps: {
              required: 'This is a mandatory field',
            },
          },

          {
            type: 'text',
            name: 'odoMeterReadin',
            id: 'odoMeterReadin',
            title: 'Odometer Reading',
            // isNumber: true,
            pattern: {
              value: /^[0-9)]{1,5}?\.|[0-9]{1,6}$/,
              message: 'Please enter valid alternate number',
            },
            maxChar: 6,
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'text',
            name: 'fuelStation',
            id: 'fuelStation',
            title: 'Fuel Station',
            validationProps: {
              // required: 'This is a mandatory field',
            },
          },
          {
            type: 'file',
            name: 'invoiceDoc',
            id: 'invoiceDoc',
            accept: 'image/*,.pdf',
            title: 'Upload Invoice Document',
            validationProps: {
              size: {
                value: 5,
                message: 'File size should not be more than 5 mb.',
              },
            },
          },
          {
            type: 'file',
            name: 'odoMeterDoc',
            id: 'odoMeterDoc',
            accept: 'image/*,.pdf',
            title: 'Upload odometer Document',
            validationProps: {
              size: {
                value: 5,
                message: 'File size should not be more than 5 mb.',
              },
            },
          },
          {
            type: 'file',
            name: 'indentDoc',
            id: 'indentDoc',
            accept: 'image/*,.pdf',
            title: 'Upload Indent Document',
            validationProps: {
              size: {
                value: 5,
                message: 'File size should not be more than 5 mb.',
              },
            },
          },
        ],
      },
    ],
  };
  const getFileName = async (value) => {
    let tem = {
      photo: value,
    };
    let dataSet;
    Object.keys(tem).map((key) => {
      dataSet = {
        ...dataSet,
        [key]: tem[key][0],
      };
    });
    let temp = await axios({
      method: 'post',
      url: Api.baseUri + '/user-reg/fuelTracking/save-file',
      data: getFormData(dataSet),
      headers: {'Content-Type': 'multipart/form-data'},
    });
    return temp?.data?.data?.documentName;
  };
  async function handleSubmit(val) {
    console.log('val', val);

    let invoiceDoc = '';
    let odoMeterDoc = '';
    let indentDoc = '';
    if (val?.data?.invoiceDoc) {
      invoiceDoc = await getFileName(val?.data?.invoiceDoc);
    }
    if (val?.data?.odoMeterDoc) {
      odoMeterDoc = await getFileName(val?.data?.odoMeterDoc);
    }
    if (val?.data?.indentDoc) {
      indentDoc = await getFileName(val?.data?.indentDoc);
    }

    let postData = {
      date: val?.data?.date,
      vehicleNo: val?.data?.vehicleNo,
      fuelPrice: val?.data?.fuelPrice,
      fuelVolume: val?.data?.fuelVolume,
      odoMeterReadin: val?.data?.odoMeterReadin,
      fuelStation: val?.data?.fuelStation,
      invoiceDoc: invoiceDoc,
      odoMeterDoc: odoMeterDoc,
      indentDoc: indentDoc,
      driverId: val?.data?.driverId,
      mileage: val?.data?.mileage,
      vendorId: val?.data?.vendorId,
    };
    console.log('postData', postData);

    vehicleList?.map((el) => {
      if (el?.value == val?.data?.vehicleNo) {
        postData.vehicleModel = el?.vehicleModel;
      }
    });
    driverList?.map((el) => {
      if (el?.value == val?.data?.driverId) {
        postData.driverName = el?.title;
      }
    });

    vendorOptions?.map((el) => {
      if (el?.value == val?.data?.vendorId) {
        postData.vendorName = el?.title;
      }
    });

    console.log('postdaTA', postData);
    axios({
      method: 'post',
      url: Api.baseUri + '/user-reg/fuelTracking/saveFuelTrackingRequest',
      data: postData,
    })
      .then((res) => {
        if (res?.data?.status == '200') {
          toast.success('Fuel Tracking submitted successfully');
          close();
        }
      })
      .catch((err) => {
        toast.error(err || 'Something went wrong');
      });
  }

  function handleChange(value) {
    console.log('value', value);
    getAllVehicle(value?.vendorId?.value);
    getAllDriver(value?.vendorId?.value);
  }
  return (
    <div>
      <SmartForm
        template={template}
        onSubmit={handleSubmit}
        onChange={handleChange}
        buttons={['submit']}
      />
    </div>
  );
};

export default FuelCorporate;
