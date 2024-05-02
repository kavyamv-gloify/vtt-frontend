import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import SmartForm from '@smart-form';
import {useAuthUser} from '@crema/utility/AuthHooks';
import regex from '@regex';
import axios from 'axios';
import api from '@api';
import SnackbarCustom from 'pages/thirdParty/SnackBar/SnackBarMsg';
import {SettingsPowerRounded} from '@mui/icons-material';
import {useState} from 'react';
import {useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import PopEdit from '@editpopup';

const EditForm = ({id, popBTNClick, openDialog, getFilterData}) => {
  const [open, setOpen] = useState();
  const [boolean, setBoolean] = useState(false);
  const [showbtn, setshowbtn] = useState(true);
  const [data, setData] = useState();
  // const { id } = useParams();
  const navigate = useNavigate();
  const {user} = useAuthUser();
  const [vehicleType, setVehicleType] = useState();
  const tanentId = user?.userList?.tanentId;
  const userVehicleDetail = async () => {
    const baseURL = `${api.masterVehicletype.id}${id}`;
    let response = await axios.get(`${baseURL}`);

    setData(response.data.data);
  };

  useEffect(() => {
    userVehicleDetail();
  }, [id]);
  useEffect(() => {
    function getAllVehicleType() {
      axios
        .get(
          api.baseUri +
            '/user-reg/VehicleNewVerient/Get-AllVehicle-New-Verient',
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            let temp = [];
            res?.data?.data?.map((el) => {
              console.log('el', el);
              temp.push({title: el?.vehicleVeriant, value: el?.id});
            });
            setVehicleType(temp ?? []);
          }
        })
        .catch((err) => {});
    }
    getAllVehicleType();
  }, []);
  let template = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    // title: 'Edit Page',
    description: 'Form for applying Job',
    // sections: [
    // {
    // layout: { column: 1, spacing: 2, size: 'small', label: 'fixed' },
    // id: 'personal_information',
    fields: [
      {
        type: 'autocomplete',
        name: 'vehicleTypeNewId',
        id: 'vehicleTypeNewId',
        title: 'Vehicle variant',
        options: vehicleType ?? [],
        infoMessage: [
          'Alphabets are allowed',
          'Maximum length should be 50 characters',
          'e.g.:TATA',
        ],

        // disabled: false,
        // pattern: {
        //   value: regex.char50,
        //   message:
        //     'Please enter valid Vehicle type and below 50 characters',
        // },
        validationProps: {
          required: 'This is a mandatory field',
        },
      },
      {
        type: 'text',
        name: 'vehicleTypeName',
        id: 'vehicleTypeName',
        title: 'Vehicle Type Name',
        infoMessage: [
          'Alphabets are allowed',
          'Maximum length should be 50 characters',
          'e.g.:TATA',
        ],

        // disabled: false,
        // pattern: {
        //   value: regex.char50,
        //   message:
        //     'Please enter valid Vehicle type and below 50 characters',
        // },
        validationProps: {
          required: 'This is a mandatory field',
        },
      },
      {
        type: 'section',
        layout: {column: 1, spacing: 2, size: 'medium', label: 'fixed'},
        sectionName: 'vehicle',
        sectiontitle: 'Vehicle Occupancy',
        fields: [
          {
            type: 'text',
            name: 'vehicleOccupancy',
            id: 'vehicleOccupancy',
            title: 'Vehicle Occupancy',
            infoMessage: [
              'Numeric characters are allowed',
              'Maximum length should be 2 characters',
              'e.g.: 12',
            ],
            pattern: {
              value: regex.numOfYearReg,
              message: 'Please enter number only',
            },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },

          {
            type: 'text',
            name: 'minCapacityExcludingDriver',
            id: 'minCapacityExcludingDriver',
            title: 'Minimum Capacity Excluding Driver',
            defaultValue: '1',
            infoMessage: [
              'Numeric characters are allowed',
              'Maximum length should be 2 characters',
              'e.g.: 10',
            ],
            pattern: {
              value: regex.numOfYearReg,
              message: 'Please enter number only',
            },
            validationProps: {
              required: 'This is a mandatory field',
              manual: [
                {
                  condition: `vehicleOccupancy > minCapacityExcludingDriver`,
                  message: 'Vehicle occupancy should be greater ',
                },
              ],
            },
          },

          {
            type: 'text',
            name: 'maxCapacityExcludingDriver',
            id: 'maxCapacityExcludingDriver',
            title: 'Maximum Capacity Excluding Driver',
            infoMessage: [
              'Numeric characters are allowed',
              'Maximum length should be 2 characters',
              'e.g.: 8',
            ],
            pattern: {
              value: regex.numOfYearReg,
              message: 'Please enter number only',
            },
            validationProps: {
              required: 'This is a mandatory field',
              manual: [
                {
                  condition: `vehicleOccupancy > maxCapacityExcludingDriver`,
                  message: 'Vehicle occupancy should be greater ',
                },
              ],
            },
          },
          {
            type: 'text',
            name: 'maxCapacitywithEscortExcludingdriver',
            id: 'maxCapacitywithEscortExcludingdriver',
            infoMessage: [
              'Numeric characters are allowed',
              'Maximum length should be 2 characters',
              'e.g.: 6',
            ],
            title: 'Maximum Capacity with Escort Excluding Driver',
            pattern: {
              value: regex.numOfYearReg,
              message: 'Please enter number only',
            },
            validationProps: {
              required: 'This is a mandatory field',

              manual: [
                {
                  condition: `vehicleOccupancy > maxCapacitywithEscortExcludingdriver`,
                  message: 'Vehicle occupancy should be greater ',
                },
              ],
            },
          },
        ],
      },
    ],
  };

  const handleSubmit = (values) => {
    if (values?.close) {
      popBTNClick(false);
      return;
    }
    setshowbtn(false);

    if (values.button.toUpperCase() === 'UPDATE') {
      let tem = values?.data;
      tem.tanentId = tanentId;

      axios
        .put(api.masterVehicletype.update, tem)
        .then((response) => {
          if (response?.data?.status == '200') {
            // navigate(`/onbordTenent/NodelPoint/table`);
            toast.success(
              `${response?.data?.data?.vehicleType} details updated successfully`,
            );
            // toast.success('Details has been successfully updated.');
            getFilterData();
            popBTNClick(false);
            // setTimeout(()=>{ window.location.reload();}, 1000)
          } else {
            toast.error(response?.data?.message ?? 'something wrong');
          }
          setshowbtn(true);
        })
        .catch((err) => {
          toast.error('wrong');
          setshowbtn(true);
        });
    }
  };

  return (
    <>
      {' '}
      {data && data.id && (
        <PopEdit
          title={data?.vehicleType}
          defaultValues={data}
          openDialog={openDialog}
          poptemplate={template}
          showbtn={showbtn}
          popAction={handleSubmit}
          buttons={['update']}
        />
      )}
    </>
  );
};

export default EditForm;
