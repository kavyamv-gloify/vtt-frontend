import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import SmartForm from '@smart-form';
import {useAuthUser} from '@crema/utility/AuthHooks';
import regex from '@regex';
import axios from 'axios';
import api from '@api';
import AppLoader from '@crema/core/AppLoader';
import {toast} from 'react-toastify';
import Api from '@api';
import PopEdit from '@editpopup';
import {getFormData} from '@hoc';
const CreateForm = ({id, popBTNClick, openDialog, close, type}) => {
  const navigate = useNavigate();
  const [showbtn, setshowbtn] = React.useState(true);
  // const { id } = useParams();
  const [formData, setFormData] = useState({});
  useEffect(() => {
    if (id && id != 'create') {
      axios
        ?.get(Api?.support?.gettopicbyid + id)
        .then((res) => {
          if (res?.data?.data) {
            setFormData(res?.data?.data);
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
            type: 'text',
            name: 'topicName',
            id: 'topicName',
            title: 'Topic Name ',
            infoMessage: [
              'Alphanumeric characters are allowed',
              'Maximum length should be 50 characters',
              'e.g.:Covid',
            ],
            pattern: {
              value: regex.maxSize50,
              message:
                'Please enter  valid Topic name with alpha-numeric and below 50 characters',
            },

            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'text',
            name: 'topicDetails',
            id: 'topicDetails',
            title: 'Topic Details ',
            infoMessage: [
              'Alphanumeric characters are allowed',
              'Maximum length should be 250 characters',
              'e.g.:Need to take precaution',
            ],
            pattern: {
              value: regex.maxSize250,
              message:
                'Please enter valid topic details with max 250 characters',
            },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'file',
            name: 'file',
            id: 'file',
            title: 'Upload File',
            accept: 'image/*',
            validationProps: {
              required: 'This is a mandatory field',
              size: {
                value: 5,
                message: 'File size should not be more than 5 mb.',
              },
            },
          },
          {
            type: id != 'create' ? 'radio' : 'hidden',
            name: 'status',
            id: 'status',
            title: 'Status',
            options: [
              {title: 'Active', value: 'ACTIVE'},
              {title: 'Inactive', value: 'INACTIVE'},
            ],
          },
        ],
      },
    ],
  };

  let edittemplate = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    title: 'Penalty',
    description: 'Form for applying Job',
    // sections: [
    // {
    // layout: { column: 1, spacing: 2, size: 'small', label: 'fixed' },
    // id: 'personal_information',
    fields: [
      {
        type: 'text',
        name: 'topicName',
        id: 'topicName',
        title: 'Topic Name ',
        infoMessage: [
          'Alphanumeric characters are allowed',
          'Maximum length should be 50 characters',
          'e.g.:Covid',
        ],
        pattern: {
          value: regex.maxSize50,
          message:
            'Please enter  valid Topic name with alpha-numeric and below 50 characters',
        },

        validationProps: {
          required: 'This is a mandatory field',
        },
      },
      {
        type: 'text',
        name: 'topicDetails',
        id: 'topicDetails',
        title: 'Topic Details ',
        infoMessage: [
          'Alphanumeric characters are allowed',
          'Maximum length should be 250 characters',
          'e.g.:Need to take precaution',
        ],
        pattern: {
          value: regex.maxSize250,
          message: 'Please enter valid topic details with max 250 characters',
        },
        validationProps: {
          required: 'This is a mandatory field',
        },
      },
      {
        type: 'file',
        name: 'file',
        id: 'file',
        title: 'Upload File',
        tempFilename: formData?.file,
        validationProps: {
          required: 'This is a mandatory field',
          size: {
            value: 5,
            message: 'File size should not be more than 5 mb.',
          },
        },
      },
    ],
  };

  const handleSubmit = async (values) => {
    if (values?.close) {
      popBTNClick(false);
    }
    if (values.button.toUpperCase() === 'SUBMIT') {
      let dataSet = {};
      let allElem = {};
      let tem = {};
      dataSet = {...values.data, type: type};
      dataSet.status = 'ACTIVE';
      Object.keys(dataSet).map((key) => {
        if (typeof dataSet[key]?.[0]?.name == 'string') {
          tem = {
            ...tem,
            [key]: dataSet[key][0],
          };
        } else {
          allElem = {
            ...allElem,
            [key]: dataSet[key],
          };
        }
      });
      tem = {
        ...tem,
        data: JSON.stringify(allElem),
      };
      axios({
        method: 'post',
        url: api.support.topicCreate,
        data: getFormData(tem),
        headers: {'Content-Type': 'multipart/form-data'},
      })
        .then((response) => {
          if (response?.data?.status == '200') {
            navigate('/Master/support/topic-list');
            toast.success(response?.data?.message ?? 'Created successfully');
            popBTNClick(false);
            close();
          } else {
            toast.error(response?.data?.message ?? 'Something went wrong');
          }
          setshowbtn(true);
        })
        .catch((er) => {
          setshowbtn(true);
          popBTNClick(false);
          toast.error('Something went wrong');
        });
    }
    if (values.button.toUpperCase() === 'UPDATE') {
      if (values?.close) {
        popBTNClick(false);
        return;
      }
      setshowbtn(false);
      let dataSet = {};
      dataSet = {...values.data, type: type};
      delete dataSet.updatedOn;
      let allElem = {};
      let tem = {};
      Object.keys(dataSet).map((key) => {
        if (typeof dataSet[key]?.[0]?.name == 'string') {
          tem = {
            ...tem,
            [key]: dataSet[key][0],
          };
        } else {
          allElem = {
            ...allElem,
            [key]: dataSet[key],
          };
        }
      });
      tem = {
        ...tem,
        data: JSON.stringify(allElem),
      };

      axios({
        method: 'put',
        url: api.support.topicUpdate,
        data: getFormData(tem),
        headers: {'Content-Type': 'multipart/form-data'},
      })
        .then((response) => {
          if (response?.data?.status == '200') {
            navigate('/Master/support/topic-list');
            toast.success(response?.data?.message ?? 'Updated successfully');
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
      {id == 'create' ? (
        <SmartForm
          template={template}
          onSubmit={handleSubmit}
          buttons={['submit']}
        />
      ) : formData?.id ? (
        <PopEdit
          poptemplate={edittemplate}
          defaultValues={formData}
          openDialog={openDialog}
          popAction={handleSubmit}
          showbtn={showbtn}
          title={formData?.topicName}
          buttons={['update']}
        />
      ) : null}
    </>
  );
};

export default CreateForm;
