import React, {useState, useEffect} from 'react';
import SmartForm from '@smart-form';
import regex from '@regex';
import AppLoader from '@crema/core/AppLoader';
import api from '@api';
import axios from 'axios';
import {toast} from 'react-toastify';
const EditForm = ({id, close}) => {
  const [showbtn, setshowbtn] = useState(true);
  const [data, setData] = useState();
  const [vehicleList, setVehicleList] = useState([]);
  useEffect(() => {
    async function ratecard() {
      const baseURL = `${api.ratecard.getlist}/${id}`;
      let response = await axios.get(`${baseURL}`);

      setData(response.data.data);
    }
    ratecard();
  }, [id]);

  useEffect(() => {
    async function vehicelTypeList() {
      const baseURL = `${api.masterVehicletype.listbytanent}?page=0&size=1000&vehicleType=null`;
      axios
        .get(`${baseURL}`)
        .then((response) => {
          let temp = [];
          response?.data?.data?.body['VehicleTypeList']?.map((id) => {
            temp.push({
              title: id?.vehicleType + '-' + id?.vehicleOccupancy,
              value: id?.id,
              name: id?.vehicleType,
            });
            setVehicleList(temp ?? []);
          });
        })
        .catch((err) => {
          setVehicleList([]);
        });
    }
    vehicelTypeList();
  }, []);

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
        layout: {column: 2, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'text',
            name: 'cardType',
            id: 'cardType',
            title: 'Card Type',
            pattern: {
              value: regex.maxSize50,
              message:
                'Please enter  valid code with alpha-numeric and below 50 characters',
            },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'autocomplete',
            name: 'fuelType',
            id: 'fuelType',
            title: 'Fuel Type',
            infoMessage: ['Dropdown values are selectable', 'Ex: Petrol'],
            validationProps: {
              required: 'This is a mandatory field',
            },
            options: [
              {title: 'Petrol', value: 'Petrol'},
              {title: 'Diesel', value: 'Diesel'},
              {title: 'CNG', value: 'CNG'},
              {title: 'Electric', value: 'Electric'},
            ],
          },
          {
            type: 'autocomplete',
            name: 'vehicleType',
            id: 'vehicleType',
            title: 'Vehicle Type',
            options: vehicleList ?? [],
            // pattern: {
            //     value: regex.maxSize50,
            //     message: 'Please enter  valid code with alpha-numeric and below 50 characters'
            // },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'text',
            name: 'maxRange',
            id: 'maxRange',
            title: 'Max Range',
            options: [
              {title: 'Active', value: 'Active'},
              {title: 'Inactive', value: 'Inactive'},
            ],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },

          {
            type: 'text',
            name: 'minRange',
            id: 'minRange',
            title: 'Min Range',
            validationProps: {
              required: 'This is a mandatory field',
            },
          },

          {
            type: 'text',
            name: 'rate',
            id: 'rate',
            title: 'Rate',
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
        ],
      },
    ],
  };

  function handleSubmit(val) {
    setshowbtn(false);
    if (val.button === 'update') {
      let dataSet = {};
      dataSet = val.data;

      vehicleList?.map((e) => {
        if (e?.value == dataSet?.vehicleType) {
          dataSet.vehicleTypeName = e?.name;
          //
          // setVehicleName( myUpperData.data.vehicleTypeName)
        }
      });

      axios
        .put(api.ratecard.getlist + '/updatetripcard', dataSet)
        .then((response) => {
          if (response?.data?.status == '200') {
            toast.success(response?.data?.message ?? 'Updated successfully');
            close(false);
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
  }

  return (
    <>
      {!showbtn ? <AppLoader /> : null}
      {data && data.id && vehicleList?.length && (
        <SmartForm
          defaultValues={data}
          template={template}
          onSubmit={handleSubmit}
          buttons={['update']}
        />
      )}
    </>
  );
};

export default EditForm;
