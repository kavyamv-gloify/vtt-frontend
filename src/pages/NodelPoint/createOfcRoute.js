import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import SmartForm from '@smart-form';
import {useAuthUser} from '@crema/utility/AuthHooks';
import regex from '@regex';
import axios from 'axios';
import Api from '@api';
import AppLoader from '@crema/core/AppLoader';
import {toast} from 'react-toastify';

const CreateOfcRoute = ({id, popBTNClick}) => {
  const navigate = useNavigate();
  const [showbtn, setshowbtn] = React.useState(true);
  const [ofcList, setOfcList] = React.useState();

  let template = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    // title: 'Office Route',
    description: 'Form for applying Job',
    sections: [
      {
        layout: {column: 2, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'autocomplete',
            name: 'officeId',
            id: 'officeId',
            title: 'Site Office',
            options: ofcList ?? [],
            infoMessage: ['Dropdown values are selectable', 'Ex: SRT INFOTECH'],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'text',
            name: 'routeShortName',
            id: 'routeShortName',
            title: 'Route Name',
            infoMessage: [
              'Alphanumeric characters are allowed',
              'Maximum length should be 50 characters',
              'e.g.:R123',
            ],
            pattern: {
              value: regex.maxSize50,
              message:
                'Please enter valid code with alpha-numeric and below 50 characters',
            },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },

          {
            type: 'textarea',
            name: 'routeName',
            id: 'routeName',
            title: 'Route Description',
            infoMessage: [
              'Alphanumeric characters are allowed',
              'Maximum length should be 250 characters',
              'e.g.: Description',
            ],
            pattern: {
              value: regex.maxSize250,
              message:
                'Please enter valid code with alpha-numeric and below 250 characters',
            },
            // validationProps: {
            //     required: 'This is a mandatory field'
            // }
          },
        ],
      },
    ],
  };

  const getSiteOfc = () => {
    axios
      .get(`${Api.siteOffice.list}/corporate?page=0&size=10000&officeName=null`)
      .then((res) => {
        let temArr = [];
        res?.data?.data?.body['SiteOffice List']?.map((el) => {
          temArr.push({title: el?.officeName, value: el?.id});
        });
        setOfcList(temArr ?? []);
      })
      .catch((err) => {
        setOfcList([]);
      });
  };
  useEffect(() => {
    getSiteOfc();
  }, []);
  const handleSubmit = async (values) => {
    setshowbtn(false);
    if (values.button.toUpperCase() === 'SUBMIT') {
      let dataSet = {};
      dataSet = values.data;
      axios
        .post(Api.routes.createOfficeRoute, dataSet)
        .then((response) => {
          if (response?.data?.status == '200') {
            // navigate('/Master/bank/table')
            popBTNClick(false);
            toast.success(
              `${response?.data?.data?.routeShortName} created successfully`,
            );
            // toast.success(response?.data?.message ?? 'Created successfully');
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
      <SmartForm
        template={template}
        onSubmit={handleSubmit}
        buttons={['submit']}
      />
      {/* <SnackbarCustom BooleanValue={boolean} open={open} onChange={handleChange}>{snackbarMsg}</SnackbarCustom> */}
    </>
  );
};

export default CreateOfcRoute;
