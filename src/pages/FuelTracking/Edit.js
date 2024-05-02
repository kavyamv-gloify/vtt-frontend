import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import SmartForm from '@smart-form';
import {useAuthUser} from '@crema/utility/AuthHooks';
import regex from '@regex';
import axios from 'axios';
import api from '@api';
import SnackbarCustom from 'pages/thirdParty/SnackBar/SnackBarMsg';
import {SettingsPowerRounded} from '@mui/icons-material';
import AppLoader from '@crema/core/AppLoader';
import {toast} from 'react-toastify';
import AwsAuthProvider from '@crema/services/auth/aws-cognito/AWSAuthProvider';
import PopEdit from '@editpopup';
import Api from '@api';
import {getFormData} from '@hoc';
const EditFuelTracking = ({id, popBTNClick, openDialog}) => {
  const {user} = useAuthUser();
  const navigate = useNavigate();
  const [showbtn, setshowbtn] = React.useState(true);
  const [data, setData] = useState({});
  const [vehicleList, setVehicleList] = useState();
  const [driverList, setDriverList] = useState();
  const [vendorOptions, setVendorOptions] = useState([]);
  const [fuelData, setFuelData] = useState({});
  useEffect(() => {
    getAllDriver(id?.vendorId);
    getAllVehicle(id?.vendorId);
    console.log('id', id);
    let postData = id;
    postData.tempIndent = id?.indentDoc;
    postData.tempInvoice = id?.invoiceDoc;
    postData.tempOdo = id?.odoMeterDoc;
    console.log('postData', postData);
    setFuelData(postData);
  }, [id]);
  useEffect(() => {
    console.log('fuelData', fuelData);
  }, [fuelData]);
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
console.log("vendorList", vendorOptions)
  function getAllList() {
    axios
      .get(Api.baseUri + '/user-reg/fuelTracking/getAllApprovedRejected')
      .then((res) => {
        if (res?.data?.status == '200') {
          setData(res?.data?.data ?? []);
        }
      })
      .catch((err) => {
        setData([]);
      });
  }

  useEffect(() => {
    getAllList();
  }, []);

  function getAllDriver(vendor) {
    axios
      .get(
        Api.baseUri +
          `/user-reg/driver-reg/driverListingByVendorId?page=0&size=1000&vendorId=${
            user?.role == 'VENDOR' ? user?.userList?.profileId : vendor
          }`,
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
  let template = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    title: 'Edit Form',
    description: 'Form for applying Job',
    // sections: [
    // {
    // layout: { column: 1, spacing: 2, size: 'small', label: 'fixed' },
    // id: 'personal_information',
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
      },
      {
        type: user?.userList?.userRole == 'VENDOR' ? 'hidden' : 'autocomplete',
        name: 'vendorId',
        id: 'vendorId',
        title: 'Vendor',
        options: vendorOptions ?? [],
        validationProps: {
          required: 'This is a mandatory field',
        },
      },
      {
        type: 'text',
        name: 'driverName',
        id: 'driverName',
        title: 'Driver',
        disabled: true,
        validationProps: {
          required: 'This is a mandatory field',
        },
      },

      {
        type: 'text',
        name: 'vehicleNo',
        id: 'vehicleNo',
        title: 'Vehicle Number',
        disabled: true,
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
          value: /^\d{1,6}(\.\d{1,2})?$/,
          message: 'Please enter valid fuel price',
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
          value: /^\d{1,6}(\.\d{1,2})?$/,
          message: 'Please enter valid fuel volume',
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
          value: /^\d{1,6}(\.\d{1,2})?$/,
          message: 'Please enter valid odometer reading',
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
        name: 'tempInvoice',
        id: 'tempInvoice',
        accept: 'image/*,.pdf',
        title: 'Upload Invoice Document',
        tempFilename: fuelData?.tempInvoice,
        validationProps: fuelData?.tempInvoice
          ? {
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
        name: 'tempOdo',
        id: 'tempOdo',
        accept: 'image/*,.pdf',
        title: 'Upload odometer Document',
        tempFilename: fuelData?.tempOdo,
        validationProps: fuelData?.tempOdo
          ? {
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
        name: 'tempIndent',
        id: 'tempIndent',
        accept: 'image/*,.pdf',
        title: 'Upload Indent Document',
        tempFilename: fuelData?.tempIndent,
        validationProps: fuelData?.tempIndent
          ? {
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
    ],
  };
  const getFileName = async (value) => {
    console.log('value', value);
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
    console.log(temp?.data?.data?.documentName);
    return temp?.data?.data?.documentName;
  };
  const handleSubmit = async (val) => {
    console.log('val', val);
    if (val?.close) {
      popBTNClick(false);
      return;
    }
    setshowbtn(false);

    setshowbtn(false);
    if (val.button.toUpperCase() === 'UPDATE') {
      let invoiceDoc = '';
      let odoMeterDoc = '';
      let indentDoc = '';
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
        id: fuelData?._id,
      };
      if (val?.data?.tempIndent == fuelData?.indentDoc) {
        postData.indentDoc = fuelData.indentDoc;
      }
      if (val?.data?.tempInvoice == fuelData?.invoiceDoc) {
        postData.invoiceDoc = fuelData.invoiceDoc;
      }
      if (val?.data?.tempOdo == fuelData?.odoMeterDoc) {
        postData.odoMeterDoc = fuelData.odoMeterDoc;
      }
      if (val?.data?.tempIndent !== fuelData?.indentDoc) {
        postData.indentDoc = await getFileName(val?.data?.tempIndent);
      }
      if (val?.data?.tempInvoice !== fuelData?.invoiceDoc) {
        postData.invoiceDoc = await getFileName(val?.data?.tempInvoice);
      }
      if (val?.data?.tempOdo !== fuelData?.odoMeterDoc) {
        postData.odoMeterDoc = await getFileName(val?.data?.tempOdo);
      }
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
        // debugger
        if (el?.value == val?.data?.vendorId) {
          postData.vendorName = el?.title;
        }
      });
      console.log("vendorId", vendorOptions)
      postData.status == 'ACTIVE';
      console.log('postData', postData);

      axios
        .put(Api.baseUri + '/user-reg/fuelTracking', postData)
        .then((response) => {
          if (response?.data?.status == '200') {
            // navigate('/onboardCorporate/designation/designation-table')
            toast.success(`Details updated successfully`);
            // toast.success(response?.data?.message ?? 'Created successfully');
            popBTNClick(false);
          } else {
            toast.error(response?.data?.message ?? 'Something went wrong');
          }
          setshowbtn(true);
        })
        .catch((er) => {
          setshowbtn(true);
          toast.error('Something went wrong');
        });
    }
  };

  return (
    <>
      {fuelData?._id && (
        <PopEdit
          title={'Edit Fuel Tracking'}
          poptemplate={template}
          defaultValues={fuelData}
          openDialog={openDialog}
          // showbtn={showbtn}
          buttons={['update']}
          // onChange={handleChange}
          // setVal={[{ name: "pointName", value: tempFData?.pointname }, { name: "latitude", value: tempFData?.latitude },{name:"longitude", value: tempFData?.longitude} ]}
          popAction={handleSubmit}
        />
      )}
    </>
  );
};

export default EditFuelTracking;
