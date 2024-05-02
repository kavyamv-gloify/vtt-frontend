import React, {useEffect, useState} from 'react';
import SmartForm from '@smart-form';
import regex from '@regex';
import axios from 'axios';
import api from '@api';
import {toast} from 'react-toastify';
import Api from '@api';
import {useAuthUser} from '@crema/utility/AuthHooks';

const EditForm = ({id, handleClicked}) => {
  const {user} = useAuthUser();
  const CorpId =
    user?.role == 'CORPORATEADMIN'
      ? user?.userList?.profileId
      : user?.userList?.corporateId;
  const [data, setdata] = useState({});
  useEffect(() => {
    if (id) {
      axios
        .get(Api?.baseUri + '/user-reg/siteoffice-holyday/' + id)
        .then((res) => {
          if (res?.data?.status == '200') {
            setdata(res?.data?.data);
          }
        })
        .catch((err) => {});
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
            name: 'officeId',
            id: 'officeId',
            title: 'officeId',
          },
          {
            type: 'hidden',
            name: 'officeName',
            id: 'officeName',
            title: 'officeName',
          },
          {
            type: 'hidden',
            name: 'corporateId',
            id: 'corporateId',
            title: 'companyId',
            defaultValue: CorpId,
          },
          {
            type: 'autocomplete',
            name: 'type',
            id: 'type',
            title: 'Holiday Type',
            options: [
              {title: 'National holidays', value: 'National holidays'},
              {
                title: 'Other secular holidays',
                value: 'Other secular holidays',
              },
              {title: 'Unofficial holidays', value: 'Unofficial holidays'},
              {title: 'Religious holidays', value: 'Religious holidays'},
              {title: 'Substitute holidays', value: 'Substitute holidays'},
            ],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'text',
            name: 'holidayName',
            id: 'holidayName',
            title: 'Holiday Name',
            pattern: {
              value: regex.maxSize50,
              message: 'Please valid name with max 50 characters',
            },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'date',
            name: 'holidayDate',
            id: 'holidayDate',
            // min: 'today',
            minmax: 'custom',
            minCustomDate: new Date().setDate(new Date().getDate() + 1),
            defaultValue: data?.holidayDate,
            title: 'Holiday Date',
            validationProps: {
              required: 'This is a mandatory field.',
              manual: [
                {
                  condition: `holidayDate > today`,
                  message: 'Minimum date will be toorrow.',
                },
              ],
            },
          },
          // {
          //     type: 'text',
          //     name: 'year',
          //     id: 'year',
          //     title: "Year",
          //     pattern: {
          //         value: regex.yearReg,
          //         message: 'Please valid year in YYYY format'
          //     },
          //     validationProps: {
          //         required: 'This is a mandatory field'
          //     }
          // },
          // {
          //     type: 'radio',
          //     name: 'status',
          //     id: 'status',
          //     title: 'Status',
          //     options: [
          //         { title: 'Active', value: 'ACTIVE' },
          //         { title: 'Inactive', value: 'INACTIVE' },

          //     ],
          //     validationProps: {
          //         required: 'This is a mandatory field'
          //     }
          // },
        ],
      },
    ],
  };

  const handleSubmit = async (values) => {
    if (values.button.toUpperCase() === 'UPDATE') {
      let dataSet = values.data;
      dataSet.year = values.data?.holidayDate?.split('-')[0];
      axios
        .put(api.baseUri + '/user-reg/siteoffice-holyday', dataSet)
        .then((response) => {
          handleClicked(false);
          if (response?.data?.status == '200') {
            toast.success(
              `${response?.data?.data?.holidayName} details updated successfully`,
            );
            // toast.success('Holiday updated successfully.');
          } else {
            toast.error(response?.data?.message ?? 'Something went wrong');
          }
        })
        .catch((er) => {
          handleClicked(false);
          toast.error('Something went wrong');
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
          buttons={['Update']}
        />
      )}
    </>
  );
};

export default EditForm;
