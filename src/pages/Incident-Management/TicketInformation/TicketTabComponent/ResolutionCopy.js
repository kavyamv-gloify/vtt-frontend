import React, {useState, useEffect} from 'react';
import SmartForm from '@smart-form';
import Api from '@api';
import axios from 'axios';
import {useAuthUser} from '@crema/utility/AuthHooks';
import moment from 'moment';
import {AssignmentIndOutlined} from '@mui/icons-material';
import {toast} from 'react-toastify';
import {getFormData} from '@hoc';

const ResolutionCopy = ({ticketInfo}) => {
  const [ticketInfoData, setTicketInfoData] = useState({});
  const [fileData, setFileData] = useState({});

  // useEffect(()=>{
  //     setTicketInfoData(ticketInfo)
  // },[ticketInfoData]);

  console.log('ticketInfoData', ticketInfoData);

  let template = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    // title: 'Roster Setting',
    description: 'Form for applying Job',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',

        fields: [
          {
            type: 'text',
            name: 'resolutionSubject',
            id: 'resolutionSubject',
            title: 'Subject',
            // infoMessage: ["Radio button is selectable", "e.g.: yes"],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },

          {
            type: 'ckeditor',
            name: 'resolution',
            id: 'resolution',
            title: '',
            validationProps: {
              required: 'This is a mandatory field',
            },
          },

          {
            type: 'file',
            name: 'attachement',
            id: 'attachement',
            title: 'Add Attachement',
            // infoMessage: ["Radio button is selectable", "e.g.: yes"],
            validationProps: {
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

  // const getFileName = async (val) => {
  //   let tem = {
  //     photo: val?.data?.indentDoc,
  //   };
  //   let dataSet;

  //   Object.keys(tem).map((key) => {
  //     dataSet = {
  //       ...dataSet,
  //       [key]: tem[key][0],
  //     };
  //   });
  // debugger
  //   console.log('dataSet', dataSet);
  //   let temp = await axios({
  //     method: 'post',
  //     url: Api.baseUri + '/user-reg/compliance/save-file',
  //     data: getFormData(dataSet),
  //     headers: {'Content-Type': 'multipart/form-data'},
  //   });
  //   console.log('temp', temp);
  //   setFileData(temp?.data?.data?.documentName);
  // };

  //  async function handleChange(value){
  //     let tem = {
  //       photo: value?.data?.indentDoc,
  //     };
  //     let dataSet;

  //     Object.keys(tem).map((key) => {
  //       dataSet = {
  //         ...dataSet,
  //         [key]: tem[key][0],
  //       };
  //     });
  //   debugger
  //     console.log('dataSet', dataSet);
  //     let temp = await axios({
  //       method: 'post',
  //       url: Api.baseUri + '/user-reg/compliance/save-file',
  //       data: getFormData(dataSet),
  //       headers: {'Content-Type': 'multipart/form-data'},
  //     });
  //     console.log('temp', temp);
  //     setFileData(temp?.data?.data?.documentName);
  // console.log("handleChange", value)
  // console.log("fileData", fileData)
  //   }

  const getFileName = async (val) => {
    console.log('Prince val', val);
    let tem = {
      photo: val?.data?.attachement,
    };
    let dataSet;

    Object.keys(tem).map((key) => {
      dataSet = {
        ...dataSet,
        [key]: tem[key][0],
      };
    });

    console.log('dataSet', dataSet);
    let temp = await axios({
      method: 'post',
      url: Api.baseUri + '/user-reg/compliance/save-file',
      data: getFormData(dataSet),
      headers: {'Content-Type': 'multipart/form-data'},
    });
    console.log('temp', temp);
    return temp?.data?.data?.documentName;
  };

  async function handleSubmit(value) {
    console.log('value', value);
    if (value?.button == 'save') {
      let postData = {};
      postData.id = ticketInfo?.id;
      postData.resolution = value?.data?.resolution;
      postData.resolutionSubject =  value?.data?.resolutionSubject;
      let attachement = '';
      if (value?.data?.attachement) {
        attachement = await getFileName(value);
      }
      postData.attachement = attachement;
      axios
        .post(
          Api.baseUri + `/user-reg/incident-management/add-resolution/NO`,
          postData,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success('Resolution saved sucessfully');
          }
        })
        .catch((err) => {});
      return;
    }
    if (value?.button == 'save and Add Article') {
      let postData = {};
      postData.id = ticketInfo?.id;
      postData.resolution = value?.data?.resolution;
      postData.resolutionSubject =  value?.data?.resolutionSubject;
      let attachement = '';
      if (value?.data?.attachement) {
        attachement = await getFileName(value);
      }
      postData.attachement = attachement;
      axios
        .post(
          Api.baseUri + `/user-reg/incident-management/add-resolution/YES`,
          postData,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success('Resolution added sucessfully');
          }
        })
        .catch((err) => {});
    }
    if (value?.button == 'clear') {
      setTicketInfoData({
        ...ticketInfoData,
        resolution: '',
        resolutionSubject: '',
        attachement: '',
      });
    }
  }
  return (
    <>
      <SmartForm
        template={template}
        onChange={getFileName}
        onSubmit={handleSubmit}
        defaultValues={ticketInfo}
        buttons={['save', 'save and Add Article', 'clear']}
      />
    </>
  );
};

export default ResolutionCopy;
