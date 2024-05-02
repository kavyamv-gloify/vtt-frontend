import React, {useEffect, useState} from 'react';
import {Button, Grid, Box} from '@mui/material';
import {TextField} from '@mui/material';
import axios from 'axios';
import Api from '@api';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {toast} from 'react-toastify';
import Editor from '../CKEDITOR';
import AppTooltip from '@crema/core/AppTooltip';
import AttachmentOutlinedIcon from '@mui/icons-material/AttachmentOutlined';
import SmartForm from '@smart-form';
const Resolution = ({ticketInfo}) => {
  const [resolution, setResolution] = useState('');
  const [title, setTitle] = useState(ticketInfo?.resolutionSubject);
  const [emailBody, setEmailBody] = useState('');
  const [showbtn, setshowbtn]=useState(true)
  console.log('ticket', ticketInfo);
  console.log('emailBody', emailBody);
  function resolutionValue(d) {
    console.log('d', d);
    setResolution(d);
  }
  // let editorText = (e)=>{
  //   setResolution(e.target.value)
  // }
  useEffect(() => {
    if (ticketInfo?.id) {
      axios
        .get(
          Api.baseUri +
            '/user-reg/incident-management/get-incident-management-by-id/' +
            ticketInfo?.id,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            // setEmailBody(res?.data?.data?.resolution ?? ' ');
            setResolution(
              res?.data?.data?.resolution?.length
                ? res?.data?.data?.resolution
                : ' ',
            );
          }
        });
    }
  }, [ticketInfo?.id]);

  let template = {
    layout: {
      column: 1,
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
            type: 'file',
            name: 'indentDoc',
            id: 'indentDoc',
            accept: 'image/*,.pdf,.doc,.docx',
            title: "Upload Attachement",
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

  const getFileName = async (val) => {
    let tem = {
      photo: val,
    };
    let dataSet;
    
    Object.keys(tem?.photo).map((key) => {
      dataSet = {
        ...dataSet,
        [key]: tem[key],
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

  async function handleSubmit(val) {
    debugger
    console.log('val', val);
    let postData = {};
    postData.id = ticketInfo?.id;
    let myFileName = '';
    if (val?.data?.indentDoc) {
      myFileName = await getFileName(val);
    }

    postData.attachement = myFileName;
    console.log('postData', postData);
    await axios({
      method: 'post',
      url: Api.baseUri + '/user-reg/compliance/save-file',
      data: getFormData(postData),
      headers: {'Content-Type': 'multipart/form-data'},
    }).then((res) => {
      if (res?.data?.status == '200') {
        // setHideAttach(false);
      }
    });
  }

  return (
    <div>
      <Grid container>
        <Grid md={12}>
          <TextField
            id='outlined-basic'
            value={title}
            label='Subject'
            variant='outlined'
            sx={{width: '100%', marginBottom: '10px'}}
            onChange={(e) => {
              setTitle(e?.target?.value);
            }}
          />
        </Grid>
        <Grid md={12}>
          <Editor
            resolution={resolution}
            setResolution={setResolution}
            type={'email'}
            id={ticketInfo?.id}
            emailBodys={emailBody}
          />
        </Grid>
        <Grid
          md={12}
          sx={{
            marginTop: '10px',
            // borderBottom: '1px solid #D7DBDD',
          }}
        >
                <div>
                  <SmartForm
                    template={template}
                    onSubmit={handleSubmit}
                    onChange={getFileName}
                    showbtn={showbtn}
                    buttons={['submit']}
                  />
                </div>
          <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
            {/* <Box sx={{display: 'flex', alignItems: 'center'}}>
              <AppTooltip placement={'top'} title={'Add Attachement'}>
                <AttachmentOutlinedIcon sx={{marginRight: '20px'}}/>
              </AppTooltip>
            </Box> */}
            <Box sx={{display: 'flex'}}>
              <Button
                variant='contained'
                onClick={() => {
                  let postData = {
                    id: ticketInfo?.id,
                    resolution: resolution,
                    resolutionSubject: title,
                  };

                  axios
                    .post(
                      Api.baseUri +
                        `/user-reg/incident-management/add-resolution/NO`,
                      postData,
                    )
                    .then((res) => {
                      if (res?.data?.status == '200') {
                        toast.success('Resolution saved sucessfully');
                      }
                    })
                    .catch((err) => {});
                }}
              >
                Save
              </Button>
              <Button
                variant='contained'
                sx={{marginLeft: '10px'}}
                onClick={(e) => {
                  let postData = {
                    id: ticketInfo?.id,
                    resolution: resolution,
                    resolutionSubject: title,
                  };
                  axios
                    .post(
                      Api.baseUri +
                        `/user-reg/incident-management/add-resolution/YES`,
                      postData,
                    )
                    .then((res) => {
                      if (res?.data?.status == '200') {
                        toast.success('Resolution added sucessfully');
                      }
                    })
                    .catch((err) => {});
                }}
              >
                Save and Add Article
              </Button>
              <Button
                sx={{marginLeft: '10px'}}
                onClick={() => {
                  setResolution(' ');
                }}
              >
                Clear
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default Resolution;
