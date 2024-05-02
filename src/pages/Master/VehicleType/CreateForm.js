import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import SmartForm from '@smart-form';

import regex from '@regex';
import axios from 'axios';
import api from '@api';
import {toast} from 'react-toastify';
import {useAuthUser} from '@crema/utility/AuthHooks';

const CreateForm = ({close}) => {
  const navigate = useNavigate();
  const {user} = useAuthUser();
  const [showbtn, setshowbtn] = React.useState(true);
  const [id, setId] = useState();
  const [vehicleType, setVehicleType] = useState();
  useEffect(() => {
    console.log('res');
    axios
      .get(
        api.baseUri + `/user-reg/corporate-reg/${user?.userList?.corporateId}`,
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          console.log('res', res);
          setId(res?.data?.data?.tanentId);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  }, []);
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
    // title: 'Vehicle Type',
    // description: 'Form for applying Job',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
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
            // defaultValue: "1",
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
              // required: 'This is a mandatory field',
              manual: [
                {
                  condition: `vehicleOccupancy >= minCapacityExcludingDriver`,
                  message: 'Vehicle occupancy should not be less. ',
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
              manual: [
                {
                  condition: `vehicleOccupancy >= maxCapacityExcludingDriver`,
                  message: 'Vehicle occupancy should not be less. ',
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
              manual: [
                {
                  condition: `vehicleOccupancy >= maxCapacitywithEscortExcludingdriver`,
                  message: 'Vehicle occupancy should not be less. ',
                },
              ],
            },
          },

          // {
          //   type: 'radio',
          //   name: 'status',
          //   id: 'status',
          //   title: 'Status',
          //   infoMessage: ["Radio button is selectable", "e.g.: Active"],
          //   options: [
          //     { title: 'Active', value: 'Active' },
          //     { title: 'Inactive', value: 'Inactive' }
          //   ],
          //   validationProps: {
          //     required: 'This is a mandatory field'
          //   }
          // },
        ],
      },
    ],
  };

  const handleSubmit = async (values) => {
    setshowbtn(false);
    if (values.button.toUpperCase() === 'SUBMIT') {
      let dataSet = {};
      dataSet = values.data;
      dataSet.tanentId = id;
      dataSet.status = 'ACTIVE';
      vehicleType?.map((el) => {
        if (dataSet?.vehicleTypeNewId == el?.value) {
          dataSet.vehicleType = el?.title;
        }
      });
      console.log('dataSet', dataSet);

      axios
        .post(api.masterVehicletype.createform + `?tanentId=` + id, dataSet)
        .then((res) => {
          if (res?.data?.status == 200) {
            navigate('/Master/vehicletype/table');
            toast.success(
              `${res?.data?.data?.vehicleType} details created successfully`,
            );
            // toast.success('Vehicle Variant created successfully');
            close(false);
          } else {
            toast.error(res?.data?.message ?? 'Something went wrong');
          }
          setshowbtn(true);
        })
        .catch((err) => {
          setshowbtn(true);
          toast.error('Something went wrong');
        });
    }
  };

  return (
    <>
      <SmartForm
        template={template}
        onSubmit={handleSubmit}
        buttons={['submit']}
        showbtn={showbtn}
        defaultValues={{minCapacityExcludingDriver: '1'}}
        mode='onTouched'
      />
    </>
  );
};

export default CreateForm;
