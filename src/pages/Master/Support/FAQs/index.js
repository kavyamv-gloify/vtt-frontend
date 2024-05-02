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
const CreateForm = ({id, popBTNClick, openDialog, type}) => {
  const navigate = useNavigate();
  const [showbtn, setshowbtn] = React.useState(true);
  // const { id } = useParams();
  const [formData, setFormData] = useState({});
  const [topicList, setTopicList] = useState();
  const [subtopicList, setSubTopicList] = useState();
  const [topicVal, setTopicVal] = useState();

  function getallSubTopics(d) {
    if (!d) {
      return;
    }
    let tem = [];
    axios?.get(api.support.getSubtopicbyTopicid + d + '/helpid').then((res) => {
      res?.data?.data?.map((n) => {
        tem.push({title: n?.subTopicName, value: n?.id});
      });
      setSubTopicList(tem);
    });
  }
  useEffect(() => {
    if (id) {
      axios
        ?.get(Api?.support?.getFAQbyid + id)
        .then((res) => {
          if (res?.data?.data) {
            setFormData(res?.data?.data);
            getallSubTopics(res?.data?.data?.helpTopicId);
          }
        })
        .catch((err) => {});
    }
  }, [id]);

  useEffect(() => {
    let tem = [];
    axios
      ?.get(api.baseUri + '/user-reg/helpmaster/dp-Topic/' + type)
      .then((res) => {
        res?.data?.data?.map((n) => {
          tem.push({title: n?.topicName, value: n?.id});
        });
        setTopicList(tem ?? []);
      })
      .catch((err) => {
        setTopicList([]);
      });
  }, []);
  function onSelectValue(e, v) {
    if (e?.helpTopicId?.value != topicVal) setTopicVal(e?.helpTopicId?.value);
  }
  useEffect(() => {
    if (!topicVal) {
      return;
    }
    let tem = [];
    axios
      ?.get(
        Api.baseUri +
          '/user-reg/subtopiccontroller/dp-subtopic/' +
          topicVal +
          '/helpid',
      )
      .then((res) => {
        res?.data?.data?.map((n) => {
          tem.push({title: n?.subTopicName, value: n?.id});
        });
        setSubTopicList(tem);
      })
      .catch((err) => {});
  }, [topicVal]);
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
            type: 'autocomplete',
            name: 'helpTopicId',
            id: 'helpTopicId',
            title: 'Select Topic',
            infoMessage: ['Dropdown values are selectable', 'e.g.: Drive'],
            disabled: id,
            options: topicList,
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'autocomplete',
            name: 'subTopicsId',
            id: 'subTopicsId',
            disabled: id,
            title: 'Select Sub-Topic',
            infoMessage: ['Dropdown values are selectable', 'e.g.: Drive'],
            options: subtopicList ?? [],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'text',
            name: 'question',
            id: 'question',
            title: 'FAQ question',
            validationProps: {
              required: 'This is a mandatory field',
            },
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
          },
          {
            type: 'ckeditor',
            name: 'answer',
            id: 'answer',
            title: 'FAQ Answer ',
            validationProps: {
              required: 'This is a mandatory field',
            },
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
          },
          {
            type: 'file',
            name: 'document',
            id: 'document',
            title: 'Add Attachement',
            accept: 'image/*,.pdf,.doc,.docx',
            infoMessage: [
              'Should only accept PDF,JPEG files',
              'File should contain file extension',
              'e.g.:Shub.jpeg',
            ],
            validationProps: {
              // required: 'This is a mandatory field',
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
    fields: [
      {
        type: 'autocomplete',
        name: 'helpTopicId',
        id: 'helpTopicId',
        title: 'Select Topic',
        infoMessage: ['Dropdown values are selectable', 'e.g.: Drive'],
        options: topicList,
        validationProps: {
          required: 'This is a mandatory field',
        },
      },
      {
        type: 'autocomplete',
        name: 'subTopicsId',
        id: 'subTopicsId',
        title: 'Select Sub-Topic',
        infoMessage: ['Dropdown values are selectable', 'e.g.: Drive'],
        options: subtopicList ?? [],
        validationProps: {
          required: 'This is a mandatory field',
        },
      },
      {
        type: 'text',
        name: 'question',
        id: 'question',
        title: 'FAQ question',
        validationProps: {
          required: 'This is a mandatory field',
        },
        infoMessage: [
          'Alphanumeric characters are allowed',
          'Maximum length should be 250 characters',
          'e.g.:Need to take precaution',
        ],
        pattern: {
          value: regex.maxSize250,
          message: 'Please enter valid topic details with max 250 characters',
        },
      },
      {
        type: 'ckeditor',
        name: 'answer',
        id: 'answer',
        title: 'FAQ Answer ',
        validationProps: {
          required: 'This is a mandatory field',
        },
        infoMessage: [
          'Alphanumeric characters are allowed',
          'Maximum length should be 250 characters',
          'e.g.:Need to take precaution',
        ],
        pattern: {
          value: regex.maxSize250,
          message: 'Please enter valid topic details with max 250 characters',
        },
      },
      {
        type: 'file',
        name: 'document',
        id: 'document',
        title: 'Add Attachement',
        tempFilename: formData?.document,
        accept: 'image/*,.pdf,.doc,.docx',
        infoMessage: [
          'Should only accept PDF,JPEG files',
          'File should contain file extension',
          'e.g.:Shub.jpeg',
        ],
        validationProps: {
          // required: 'This is a mandatory field',
          size: {
            value: 5,
            message: 'File size should not be more than 5 mb.',
          },
        },
      },
    ],
  };

  const handleSubmit = async (values) => {
    setshowbtn(false);
    if (values?.close) {
      popBTNClick(false);
      setshowbtn(false);
      return;
    }
    if (values.button.toUpperCase() === 'SUBMIT') {
      let dataSet = {};
      let tem = {};
      let allElem = {};
      dataSet = values.data;
      dataSet.type = type;
      subtopicList?.map((e) => {
        if (e?.value == dataSet.subTopicsId) {
          dataSet.subTopicName = e?.title;
        }
      });
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
      await axios({
        method: 'post',
        url: api.support.saveFAQ,
        data: getFormData(tem),
        headers: {'Content-Type': 'multipart/form-data'},
      })
        .then((response) => {
          if (response?.data?.status == '200') {
            navigate('/Master/support/faq-list');
            popBTNClick(false);
            toast.success(response?.data?.message ?? 'Created successfully');
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
      if (values?.close) {
        popBTNClick(false);
        return;
      }
      setshowbtn(false);
      let dataSet = {};
      dataSet = values.data;
      dataSet.type = type;
      subtopicList?.map((e) => {
        if (e?.value == dataSet.subTopicsId) {
          dataSet.subTopicName = e?.title;
        }
      });
      let tem = {};
      let allElem = {};
      delete dataSet.updatedOn;
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
      await axios({
        method: 'put',
        url: api.support.updateFAQ,
        data: getFormData(tem),
        headers: {'Content-Type': 'multipart/form-data'},
      })
        .then((response) => {
          if (response?.data?.status == '200') {
            navigate('/Master/support/faq-list');
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
  function handleChange(val) {
    console.log('val', val);
    getallSubTopics(val?.helpTopicId?.value);
  }
  return (
    <>
      {id == 'create' ? (
        <SmartForm
          template={template}
          onSubmit={handleSubmit}
          onChange={onSelectValue}
          buttons={['submit']}
        />
      ) : formData?.id && topicList && subtopicList ? (
        <PopEdit
          poptemplate={edittemplate}
          title={formData?.question}
          defaultValues={formData}
          openDialog={openDialog}
          popAction={handleSubmit}
          onChange={handleChange}
          buttons={['update']}
          showbtn={showbtn}
        />
      ) : null}
      {/* <SnackbarCustom BooleanValue={boolean} open={open} onChange={handleChange}>{snackbarMsg}</SnackbarCustom> */}
    </>
  );
};

export default CreateForm;
