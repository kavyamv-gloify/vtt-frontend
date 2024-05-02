import React, {useEffect, useState} from 'react';
import SmartForm from '@smart-form';
import regex from '@regex';
import axios from 'axios';
import {toast} from 'react-toastify';
import Api from '@api';

const EditForm = ({id, handleClicked, openDialog}) => {
  const [data, setdata] = useState({});

  useEffect(() => {
    if (id) {
      axios
        .get(
          `${Api?.baseUri}/user-reg/gps-provider/get-gpsProvider-by-id/${id}`,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            setdata(res?.data?.data);
          }
        })
        .catch((err) => {
          toast.error(err);
        });
    }
  }, [id]);

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
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'hidden',
            name: 'id',
            id: 'id',
            title: 'vendorId',
            defaultValue: id,
          },
          {
            type: 'text',
            name: 'vendorName',
            id: 'vendorName',
            title: 'Vendor Name',
            pattern: {
              value: regex.maxSize50,
              message: 'Please valid name with max 50 characters',
            },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
        ],
      },
    ],
  };

  const handleSubmit = async (values) => {
    if (values.button.toUpperCase() === 'UPDATE') {
      let postData = {
        id: values?.data?.id,
        vendorName: values?.data?.vendorName,
      };
      axios
        .put(
          `${Api.baseUri}/user-reg/gps-provider/update-gpsProvider`,
          postData,
        )
        .then((response) => {
          handleClicked(false);
          if (response?.data?.status == '200') {
            toast.success('Vendor Name updated successfully.');
          } else {
            toast.error(response?.data?.message ?? 'Something went wrong');
          }
        })
        .catch((er) => {
          handleClicked(false);
          toast.error(err ?? 'Something went wrong');
        });
    }
  };

  return (
    <>
      {id && data?.id && (
        <SmartForm
          template={template}
          defaultValues={data}
          onSubmit={handleSubmit}
          openDialog={openDialog}
          buttons={['Update']}
        />
      )}
    </>
  );
};

export default EditForm;
