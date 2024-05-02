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

const CreateForm = ({popBTNClick, topicId}) => {
  const navigate = useNavigate();
  const [showbtn, setshowbtn] = React.useState(true);
  const [open, setOpen] = useState();
  const [boolean, setBoolean] = useState(false);
  const [snackbarMsg, setsnackBarMsg] = useState();
  const [topicList, setTopicList] = useState();

  // useEffect(() => {

  //     async function getTopicList() {
  //         let temp = []
  //         let res = await axios.get(`${api.support.topicList}`)
  //
  //         if (res?.data?.data?.length) {
  //             res?.data?.data?.map((e) => {
  //
  //                 temp.push({ title: e.topicName, value: e });
  //
  //             })
  //         }
  //         setTopicList(temp);
  //     }

  //     getTopicList();
  // }, [])

  async function fetchSiteOffice() {
    let res = await axios.get(
      `${api.siteOffice.list}/${profileId}/corporate?page=0&size=1000`,
    );

    let temp = [];
    if (res?.data?.data?.body?.['SiteOffice List'].length) {
      res?.data?.data?.body?.['SiteOffice List']?.map((e) => {
        temp.push({title: e.officeName, value: e});
      });
    }
    setOfcList(temp);
  }

  let template = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    // title: 'Sub-Topic',
    description: 'Form for applying Job',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          // {
          //     type: 'autocomplete',
          //     name: 'helpTopicId',
          //     id: 'helpTopicId',
          //     title: "Select Topic",
          //     infoMessage: ["Dropdown values are selectable", "e.g.: Drive"],
          //     options: topicList,
          //     validationProps: {
          //         required: 'This is a mandatory field'
          //     }
          // },

          {
            type: 'text',
            name: 'subTopicName',
            id: 'subTopicName',
            title: 'Sub-Topic',
            infoMessage: [
              'Alphanumeric characters are allowed',
              'Maximum length should be 50 characters',
              'e.g.:Speed',
            ],
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
            type: 'text',
            name: 'subTopicDeatails',
            id: 'subTopicDeatails',
            title: 'Sub-Topic Detail',
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
        ],
      },
    ],
  };

  const handleSubmit = async (values) => {
    setshowbtn(false);
    if (values.button.toUpperCase() === 'SUBMIT') {
      let dataSet = {};
      dataSet.helpTopicId = values?.data?.helpTopicId?.id;
      dataSet.helpTopicName = values?.data?.helpTopicId?.topicName;
      dataSet.subTopicName = values?.data?.subTopicName;
      dataSet.subTopicDeatails = values?.data?.subTopicDeatails;
      dataSet.status = 'ACTIVE';
      dataSet.helpTopicId = topicId;

      axios
        .post(api.support.subtopicCreate, dataSet)
        .then((response) => {
          if (response?.data?.status == '200') {
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
  };
  return (
    <>
      {!showbtn ? <AppLoader /> : null}
      <SmartForm
        template={template}
        onSubmit={handleSubmit}
        buttons={['submit']}
      />
    </>
  );
};

export default CreateForm;
