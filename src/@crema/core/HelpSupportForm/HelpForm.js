import React, {useState, useEffect, useRef} from 'react';
import {alpha, styled} from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
// import Editor from './dummyckeditor';
import {
  Box,
  Button,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from '@mui/material';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';
import {useAuthUser} from '@crema/utility/AuthHooks';
import Api from '@api';
import {useForm, Controller, useWatch} from 'react-hook-form';
import {getFormData} from '@hoc';
import {toast} from 'react-toastify';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import AppLoader from '@crema/core/AppLoader';
import InputAdornment from '@mui/material/InputAdornment';
import moment from 'moment';
import _ from 'lodash';
import html2canvas from 'html2canvas';
import {Dialog, DialogTitle, DialogContent, DialogActions} from '@mui/material';

function dataURLtoBlob(dataURL) {
  const splitDataUrl = dataURL.split(',');
  const contentType = splitDataUrl[0].match(/:(.*?);/)[1];
  const byteCharacters = atob(splitDataUrl[1]);
  const byteArrays = [];

  for (let i = 0; i < byteCharacters.length; i++) {
    byteArrays.push(byteCharacters.charCodeAt(i));
  }

  return new Blob([new Uint8Array(byteArrays)], {type: contentType});
}

const HelpForm = ({close}) => {
  const {user} = useAuthUser();
  const [showbtn, setshowbtn] = useState(true);
  const [filename, setFileName] = useState();
  const [blobFile, setBlobFile] = useState();
  const {
    register,
    formState: {errors},
    handleSubmit,
    watch,
    reset,
    control,
    getValues,
    setValue,
  } = useForm({mode: 'onTouched'});
  const formData = useWatch({control, defaultValue: 'default'});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editedImage, setEditedImage] = useState();
  const [croppedImage, setCroppedImage] = useState(null);
  const [documentVal, setDocumentVal] = useState({documents: 'ATTACHMENT'});
  const [screenshotDataUrl, setScreenshotDataUrl] = useState('');

  // console.log('editedImage', filename);
  // const handleCapture = () => {
  //   const elementToCapture = document.getElementById('root');

  //   html2canvas(elementToCapture).then((canvas) => {
  //     const screenshot = canvas.toDataURL('image/png');

  //     // Set the screenshot URL in the component's state
  //     setEditedImage(screenshot);
  //     console.log(screenshot);
  //     setIsDialogOpen(true);
  //   });
  // };

  const handleCapture = () => {
    const elementToCapture = document.getElementById('root');

    html2canvas(elementToCapture, {
      width: window.innerWidth,
      height: window.innerHeight,
      scrollX: 0,
      scrollY: 0,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      useCORS: true,
    }).then((canvas) => {
      const screenshotDataUrl = canvas.toDataURL('image/png');
      setScreenshotDataUrl(screenshotDataUrl);

      const blob = dataURLtoBlob(screenshotDataUrl);
      setBlobFile(blob);

      const fileName = 'screenshot.png';
      const file = new File([blob], fileName, {
        type: 'image/png',
        lastModified: Date.now(),
      });

      const fileListObject = {
        0: file,
        length: 1,
      };

      setIsDialogOpen(true);

      setEditedImage(fileListObject);
    });
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditedImage();
  };
  const handleUpload = () => {
    setIsDialogOpen(false);
    setFileName(editedImage);
  };
  const getFileName = async (value) => {
    let tem = {
      photo: value,
    };
    let dataSet;
    Object.keys(tem).map((key) => {
      dataSet = {
        ...dataSet,
        [key]: tem[key][0],
      };
    });
    let temp = await axios({
      method: 'post',
      url: Api.baseUri + '/user-reg/fuelTracking/save-file',
      data: getFormData(dataSet),
      headers: {'Content-Type': 'multipart/form-data'},
    });
    return temp?.data?.data?.documentName;
  };

  const onSubmit = async (data) => {
    reset({});
    setshowbtn(false);
    let temRequest = {
      query: data?.subject,
      // email: 'leelabhishek.reddy@velocis.co.in',
      email: 'support@etravelmate.com',
      description: data?.msgBody,
      file: filename,
    };
    // console.log('data', temRequest);

    let dataSet = {};
    let allElem = {};
    Object.keys(temRequest).map((key) => {
      if (typeof temRequest[key]?.[0]?.name == 'string') {
        dataSet = {
          ...dataSet,
          [key]: temRequest[key][0],
        };
      } else {
        allElem = {
          ...allElem,
          [key]: temRequest[key],
        };
      }
    });
    dataSet = {
      ...dataSet,
      ...allElem,
    };
    axios({
      method: 'post',
      url: Api.baseUri + '/usernotify/email/send-email-with-attachment',
      data: getFormData(dataSet),
      headers: {'Content-Type': 'multipart/form-data'},
    })
      .then((res) => {
        if (res?.status == '200') {
          toast.success('Ticket Raised Successfully');
          reset();
          close();
        } else {
          toast.error(response?.message ?? 'Something went wrong');
          setshowbtn(true);
        }
      })
      .catch((err) => {
        toast.error('Something went wrong');
        setshowbtn(true);
      });
  };
  const handleOpenImage = () => {
    // Create a URL for the Blob object
    const blobUrl = URL.createObjectURL(blobFile);
    // console.log('blobUrl', blobUrl);

    // Open the Blob URL in a new tab or window
    window.open(blobUrl, '_blank');

    // Remember to release the object URL when done to prevent memory leaks
    URL.revokeObjectURL(blobUrl);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'column',
            }}
          >
            <label
              htmlFor={'subject'}
              style={{display: 'inline-block', marginBottom: '8px'}}
              className='input-field-labels'
            >
              Query
              <span style={{color: 'red'}}>*</span>
            </label>
            <TextField
              error={errors?.title}
              {...register('subject', {
                required: 'This is a mandatory field',
                maxLength: {
                  value: 250,
                  message: 'Length should be lesser than 250',
                },
              })}
            />
            <p style={{fontSize: '12px', color: 'red'}}>
              {errors?.subject?.message}
            </p>
          </Grid>
          <Grid item xs={12}>
            <RadioGroup
              style={{display: 'flex', flexDirection: 'row'}}
              aria-labelledby='demo-radio-buttons-group-label'
              defaultValue='ATTACHMENT'
              onChange={(e, v) => {
                setDocumentVal({...documentVal, documents: v});
                setFileName();
              }}
              name='radio-buttons-group'
            >
              <FormControlLabel
                value='ATTACHMENT'
                control={<Radio />}
                label='Attachment'
              />
              <FormControlLabel
                value='SCREENSHOT'
                control={<Radio />}
                label='Screenshot'
              />
            </RadioGroup>
          </Grid>

          {documentVal?.documents == 'ATTACHMENT' ? (
            <Grid item xs={12} style={{marginTop: '', marginBottom: '20px'}}>
              <>
                <label
                  htmlFor={'attachement'}
                  style={{display: 'inline-block', marginBottom: '8px'}}
                  className='input-field-labels'
                >
                  Upload Document
                </label>
                <br />
                <div style={{display: 'flex', flexDirection: 'row'}}>
                  <Button
                    id='btnMui123'
                    variant='contained'
                    component='label'
                    style={{
                      minHeight: '51px',
                      backgroundColor:
                        filename?.length && filename[0]?.name
                          ? '#c2c2c2'
                          : 'rgb(0, 220, 255)',
                    }}
                  >
                    {(filename?.length && filename[0]?.name.slice(0, 20)) ||
                      'Upload Document'}
                    <input
                      hidden
                      accept='image/*,.pdf,.doc,.docx'
                      multiple
                      type='file'
                      onChange={(e) => {
                        setFileName(e?.target?.files);
                        var image2 = document.getElementById(
                          'image' + 'image_round2',
                        );
                        image2.href = URL.createObjectURL(e.target.files[0]);
                      }}
                    />
                  </Button>
                  <br />

                  <div
                    style={{
                      cursor: 'pointer',
                      color: 'rgb(0, 220, 255)',
                      marginLeft: '15px',
                      marginTop: '10px',
                    }}
                  >
                    <a
                      id={'image' + 'image_round2'}
                      target='_blank'
                      style={{
                        cursor: 'pointer',
                        color: 'rgb(0, 220, 255)',
                        marginLeft: '5px',
                        marginTop: '8px',
                      }}
                    >
                      <VisibilityIcon />
                    </a>
                  </div>
                </div>
              </>
            </Grid>
          ) : null}

          {documentVal?.documents == 'SCREENSHOT' ? (
            <Grid item xs={12} style={{marginTop: '', marginBottom: '20px'}}>
              <>
                <label
                  htmlFor={'attachement'}
                  style={{display: 'inline-block', marginBottom: '8px'}}
                  className='input-field-labels'
                >
                  Screen Capture
                </label>
                <br />
                <div style={{display: 'flex', flexDirection: 'row'}}>
                  <Button
                    id='btnMui123'
                    onClick={handleCapture}
                    variant='contained'
                    component='label'
                    style={{
                      minHeight: '51px',
                      backgroundColor:
                        filename?.length && filename[0]?.name
                          ? '#c2c2c2'
                          : 'rgb(0, 220, 255)',
                    }}
                  >
                    {(filename?.length && filename[0]?.name?.slice(0, 20)) ||
                      'Screen Capture'}
                  </Button>
                  {/* {editedImage && ( */}
                  <div
                    style={{
                      cursor: 'pointer',
                      color: 'rgb(0, 220, 255)',
                      marginLeft: '15px',
                      marginTop: '10px',
                    }}
                    onClick={handleOpenImage}
                  >
                    <VisibilityIcon />
                  </div>
                  {/* )} */}
                </div>
              </>
            </Grid>
          ) : null}
          <Grid
            item
            xs={12}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'column',
            }}
          >
            <label
              htmlFor={'msgBody'}
              style={{display: 'inline-block', marginBottom: '8px'}}
              className='input-field-labels'
            >
              Description
              <span style={{color: 'red'}}>*</span>
            </label>
            <TextField
              error={errors?.msgBody}
              {...register('msgBody', {
                required: 'This is a  mandatory field',
                maxLength: {
                  value: 500,
                  message: 'Length should be lesser than 500',
                },
              })}
              multiline
              rows={4}
              style={{width: '100%'}}
              maxRows={10}
            />
            <p style={{fontSize: '12px', color: 'red'}}>
              {errors?.message?.msgBody}
            </p>
          </Grid>
        </Grid>

        <Grid
          item
          xs={12}
          style={{
            marginTop: '20px',
            marginBottom: '',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Button
            id='btnMui123'
            disabled={!showbtn}
            variant='contained'
            type='submit'
          >
            Submit
          </Button>

          {/* <Button
            id='btnMui123'
            variant='contained'
            onClick={() => {
              close();
            }}
            style={{width: '105px'}}
          >
            close
          </Button> */}
        </Grid>
      </form>
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            width: '700px',
          },
        }}
      >
        <DialogTitle>Edit Image</DialogTitle>
        <DialogContent>
          <img id='screenshotImage' src={screenshotDataUrl} alt='Screenshot' />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant='contained' color='primary' onClick={handleUpload}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      {!showbtn ? <AppLoader /> : null}
    </>
  );
};

export default HelpForm;
