import React, {useEffect, useState} from 'react';
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
import {useParams} from 'react-router-dom';
import Api from '@api';

const CreateForm = (props) => {
  const navigate = useNavigate();
  const [showbtn, setshowbtn] = React.useState(true);
  const [open, setOpen] = useState();
  const [boolean, setBoolean] = useState(false);
  const [snackbarMsg, setsnackBarMsg] = useState();
  const {user} = useAuthUser();
  const [data, setData] = useState({});
  const thisId = user.userList.profileId;

  const {regNo} = useParams();

  const id = props.id;
  const vehicle = props.vehicleRegistration;

  useEffect(() => {
    async function fetchData() {
      // alert("fbhdsbfmds");
      const baseURL = `${Api?.vehicle?.findbyvehicleId + id}`;
      let response = await axios.get(`${baseURL}`);

      let info = response?.data?.data;
      setData(info ?? {temid: 'CREATE'});
      //
    }
    fetchData();
  }, [id]);
  let template = {
    layout: {
      column: 1,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    // title: data?.temid == "CREATE" ? 'Vehicle Compliance' : 'Update Vehicle Compliance',
    description: 'Form for applying Job',
    sections: [
      {
        layout: {column: 3, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'radio',
            name: 'fireExtinguisher',
            id: 'fireExtinguisher',
            title: 'All Doors Lock Operations',
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
            name: 'fireExtinguisher',
            id: 'fireExtinguisher',
            title: 'Body Dents all around the body',
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
            name: 'fireExtinguisher',
            id: 'fireExtinguisher',
            title: 'Brake Light Functionality',
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
            name: 'fireExtinguisher',
            id: 'fireExtinguisher',
            title: "Do's and Don't Stickers",
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
            name: 'fireExtinguisher',
            id: 'fireExtinguisher',
            title: 'Exterior Cleanliness',
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
            name: 'fireExtinguisher',
            id: 'fireExtinguisher',
            title: 'Fire Extinguisher',
            options: [
              {title: 'Yes', value: 'yes'},
              {title: 'No', value: 'no'},
            ],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },

          {
            type: 'date',
            name: 'fireExtinguisher',
            id: 'fireExtinguisher',
            title: 'Fire Extinguisher Expiry Date',
            validationProps: {
              required: 'This is a mandatory field',
            },
          },

          {
            type: 'radio',
            name: 'vehicleAcCheck',
            id: 'vehicleAcCheck',
            title: 'First Aid Box',
            options: [
              {title: 'Yes', value: 'yes'},
              {title: 'No', value: 'no'},
            ],
          },

          {
            type: 'radio',
            name: 'vehicleAcCheck',
            id: 'vehicleAcCheck',
            title: 'Fitness Certificate',
            options: [
              {title: 'Yes', value: 'yes'},
              {title: 'No', value: 'no'},
            ],
          },

          {
            type: 'date',
            name: 'vehicleAcCheck',
            id: 'vehicleAcCheck',
            title: 'Fitness Expiry Date',
            min: 'today',
          },

          {
            type: 'radio',
            name: 'vehicleAcCheck',
            id: 'vehicleAcCheck',
            title: 'Fuel Guage Meter Reading',
            options: [
              {title: 'Yes', value: 'yes'},
              {title: 'No', value: 'no'},
            ],
          },

          {
            type: 'radio',
            name: 'vehicleAcCheck',
            id: 'vehicleAcCheck',
            title: 'Fuel Scarcity',
            options: [
              {title: 'Yes', value: 'yes'},
              {title: 'No', value: 'no'},
            ],
          },
          {
            type: 'radio',
            name: 'vehicleAcCheck',
            id: 'vehicleAcCheck',
            title: 'Headlight High & Low Beam Functionality',
            options: [
              {title: 'Yes', value: 'yes'},
              {title: 'No', value: 'no'},
            ],
          },

          {
            type: 'radio',
            name: 'vehicleAcCheck',
            id: 'vehicleAcCheck',
            title: 'Insurance',
            options: [
              {title: 'Yes', value: 'yes'},
              {title: 'No', value: 'no'},
            ],
          },
          {
            type: 'radio',
            name: 'vehicleAcCheck',
            id: 'vehicleAcCheck',
            title: 'Indicator 4 ways ',
            options: [
              {title: 'Yes', value: 'yes'},
              {title: 'No', value: 'no'},
            ],
          },
          {
            type: 'date',
            name: 'vehicleAcCheck',
            id: 'vehicleAcCheck',
            title: 'Insurance Expiry Date',
            max: 'today',
          },

          {
            type: 'radio',
            name: 'vehicleAcCheck',
            id: 'vehicleAcCheck',
            title: 'Interior Body and Rearview Mirror Cleanliness',
            options: [
              {title: 'Yes', value: 'yes'},
              {title: 'No', value: 'no'},
            ],
          },
          {
            type: 'radio',
            name: 'vehicleAcCheck',
            id: 'vehicleAcCheck',
            title: 'Logo/Route No Sticker/ Emergency Contact Numbers',
            options: [
              {title: 'Yes', value: 'yes'},
              {title: 'No', value: 'no'},
            ],
          },

          {
            type: 'radio',
            name: 'vehicleAcCheck',
            id: 'vehicleAcCheck',
            title: 'Mats Cleanliness',
            options: [
              {title: 'Yes', value: 'yes'},
              {title: 'No', value: 'no'},
            ],
          },

          {
            type: 'radio',
            name: 'vehicleAcCheck',
            id: 'vehicleAcCheck',
            title: 'Mirror Cleanliness',
            options: [
              {title: 'Yes', value: 'yes'},
              {title: 'No', value: 'no'},
            ],
          },

          {
            type: 'radio',
            name: 'vehicleAcCheck',
            id: 'vehicleAcCheck',
            title: 'Mirrors Left/Right Side Rear View',
            options: [
              {title: 'Yes', value: 'yes'},
              {title: 'No', value: 'no'},
            ],
          },

          {
            type: 'radio',
            name: 'vehicleAcCheck',
            id: 'vehicleAcCheck',
            title: 'New Item',
            options: [
              {title: 'Yes', value: 'yes'},
              {title: 'No', value: 'no'},
            ],
          },
          {
            type: 'text',
            name: 'vehicleAcCheck',
            id: 'vehicleAcCheck',
            title: 'New Item for Count testing',
          },

          {
            type: 'radio',
            name: 'vehicleAcCheck',
            id: 'vehicleAcCheck',
            title: 'Parking Light, Functionality on all sides',
            options: [
              {title: 'Yes', value: 'yes'},
              {title: 'No', value: 'no'},
            ],
          },
          {
            type: 'radio',
            name: 'vehicleAcCheck',
            id: 'vehicleAcCheck',
            title: 'Passenger tax/other tax',
            options: [
              {title: 'Yes', value: 'yes'},
              {title: 'No', value: 'no'},
            ],
          },
          {
            type: 'radio',
            name: 'vehicleAcCheck',
            id: 'vehicleAcCheck',
            title: 'Permit',
            options: [
              {title: 'Yes', value: 'yes'},
              {title: 'No', value: 'no'},
            ],
          },
          {
            type: 'radio',
            name: 'vehicleAcCheck',
            id: 'vehicleAcCheck',
            title: 'Permit Expiry Date',
            options: [
              {title: 'Yes', value: 'yes'},
              {title: 'No', value: 'no'},
            ],
          },

          {
            type: 'radio',
            name: 'vehicleAcCheck',
            id: 'vehicleAcCheck',
            title: 'PUC Certificate',
            options: [
              {title: 'Yes', value: 'yes'},
              {title: 'No', value: 'no'},
            ],
          },
          {
            type: 'radio',
            name: 'vehicleAcCheck',
            id: 'vehicleAcCheck',
            title: 'PUC Expiry Date',
            options: [
              {title: 'Yes', value: 'yes'},
              {title: 'No', value: 'no'},
            ],
          },
          {
            type: 'radio',
            name: 'vehicleAcCheck',
            id: 'vehicleAcCheck',
            title: 'RC',
            options: [
              {title: 'Yes', value: 'yes'},
              {title: 'No', value: 'no'},
            ],
          },
          {
            type: 'radio',
            name: 'vehicleAcCheck',
            id: 'vehicleAcCheck',
            title: 'Radio Set',
            options: [
              {title: 'Yes', value: 'yes'},
              {title: 'No', value: 'no'},
            ],
          },

          {
            type: 'radio',
            name: 'vehicleAcCheck',
            id: 'vehicleAcCheck',
            title: 'Registration Expiry Date',
            options: [
              {title: 'Yes', value: 'yes'},
              {title: 'No', value: 'no'},
            ],
          },

          {
            type: 'date',
            name: 'vehicleAcCheck',
            id: 'vehicleAcCheck',
            title: 'Road tax validity expiry date',
            min: 'today',
          },
          {
            type: 'radio',
            name: 'vehicleAcCheck',
            id: 'vehicleAcCheck',
            title: 'Seat Belt Cleaniess',
            options: [
              {title: 'Yes', value: 'yes'},
              {title: 'No', value: 'no'},
            ],
          },
          {
            type: 'radio',
            name: 'vehicleAcCheck',
            id: 'vehicleAcCheck',
            title: 'Seats Front/Behind- Cleanliness',
            options: [
              {title: 'Yes', value: 'yes'},
              {title: 'No', value: 'no'},
            ],
          },
          {
            type: 'radio',
            name: 'vehicleAcCheck',
            id: 'vehicleAcCheck',
            title: 'Test',
            options: [
              {title: 'Yes', value: 'yes'},
              {title: 'No', value: 'no'},
            ],
          },

          {
            type: 'radio',
            name: 'vehicleAcCheck',
            id: 'vehicleAcCheck',
            title: 'Test Item',
            options: [
              {title: 'Yes', value: 'yes'},
              {title: 'No', value: 'no'},
            ],
          },
          {
            type: 'radio',
            name: 'vehicleAcCheck',
            id: 'vehicleAcCheck',
            title: 'Testing',
            options: [
              {title: 'Yes', value: 'yes'},
              {title: 'No', value: 'no'},
            ],
          },

          {
            type: 'radio',
            name: 'vehicleAcCheck',
            id: 'vehicleAcCheck',
            title: 'Tool Kit',
            options: [
              {title: 'Yes', value: 'yes'},
              {title: 'No', value: 'no'},
            ],
          },

          {
            type: 'radio',
            name: 'vehicleAcCheck',
            id: 'vehicleAcCheck',
            title: 'Torch',
            options: [
              {title: 'Yes', value: 'yes'},
              {title: 'No', value: 'no'},
            ],
          },
          {
            type: 'radio',
            name: 'vehicleAcCheck',
            id: 'vehicleAcCheck',
            title: 'Tyre, Stepney',
            options: [
              {title: 'Yes', value: 'yes'},
              {title: 'No', value: 'no'},
            ],
          },

          {
            type: 'radio',
            name: 'vehicleAcCheck',
            id: 'vehicleAcCheck',
            title: 'Umbrella',
            options: [
              {title: 'Yes', value: 'yes'},
              {title: 'No', value: 'no'},
            ],
          },

          {
            type: 'radio',
            name: 'vehicleAcCheck',
            id: 'vehicleAcCheck',
            title: 'Wind Shield Front/Back',
            options: [
              {title: 'Yes', value: 'yes'},
              {title: 'No', value: 'no'},
            ],
          },
        ],
      },
    ],
  };

  const handleSubmit = async (values) => {
    setshowbtn(false);

    setshowbtn(false);
    if (values.button.toUpperCase() === 'SUBMIT') {
      let dataSet = {};
      dataSet = values.data;
      // dataSet.insuranceExpiry = dataSet.tempinsuranceExpiry;
      // dataSet.vehicleMakeYear = dataSet.tempvehicleMakeYear;

      dataSet.insuranceExpiry = dataSet.tempinsuranceExpiry;
      dataSet.vehicleMakeYear = dataSet.tempvehicleMakeYear;
      // dataSet.vehicleRegistrationCertificate= vehicle;
      // dataSet.regVehicleId= id;
      // dataSet.vehicleRegistrationCertificate= id;
      delete dataSet.tempinsuranceExpiry;
      delete dataSet.tempvehicleMakeYear;
      axios
        .post(`${Api?.compliance?.saveVehicleCompliance}`, dataSet)
        .then((response) => {
          if (response?.data?.status == '200') {
            navigate('/vendor/vehicle-compliance/vehicle-listing');
            toast.success(response?.data?.message ?? 'Created successfully');
            props.myDial(false);
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
    if (values.button.toUpperCase() === 'UPDATE') {
      let dataSet = {};
      dataSet = values.data;
      dataSet.insuranceExpiry = dataSet.tempinsuranceExpiry;
      dataSet.vehicleMakeYear = dataSet.tempvehicleMakeYear;
      dataSet.vehicleRegistrationCertificate = id;
      delete dataSet.tempinsuranceExpiry;
      delete dataSet.tempvehicleMakeYear;

      axios
        .put(api.vehicle.createComp + '/updatecomplianceofvehicle', dataSet)
        .then((response) => {
          if (response?.data?.status == '200') {
            navigate('/vendor/vehicle-compliance/vehicle-listing');
            toast.success(response?.data?.message ?? 'Created successfully');
            props.myDial(false);
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
      {!showbtn ? <AppLoader /> : null}
      {(data?.temid == 'CREATE' || (data?.id && data?.insuranceExpiry)) && (
        <SmartForm
          template={template}
          defaultValues={data?.temid == 'CREATE' ? null : data}
          setVal={[
            {name: 'tempinsuranceExpiry', value: data?.insuranceExpiry},
            {name: 'tempvehicleMakeYear', value: data?.vehicleMakeYear},
            {name: 'vehicleRegistrationCertificate', value: vehicle},
          ]}
          onSubmit={handleSubmit}
          buttons={data?.temid == 'CREATE' ? ['submit'] : ['update']}
        />
      )}
    </>
  );
};
export default CreateForm;
