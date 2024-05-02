import React, {useEffect, useState} from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

import {Tooltip} from '@mui/material';
import axios from 'axios';
import Api from '../@api';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import SmartForm from '@smart-form';
import excelDoc from '@excelupload/excelupload';
import CloseIcon from '@mui/icons-material/Close';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VerifiedIcon from '@mui/icons-material/Verified';
import SimCardDownloadOutlinedIcon from '@mui/icons-material/SimCardDownloadOutlined';
import DownloadForOfflineOutlinedIcon from '@mui/icons-material/DownloadForOfflineOutlined';
import AppTooltip from '@crema/core/AppTooltip';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
const ExcelContainer = ({
  downloadURL,
  downloadFile,
  uploadURL,
  downloadTempURL,
  getHeadersUrl,
}) => {
  const [myuploadedFile, setMyuploadedFile] = useState();
  const [downloadClick, setDownloadClick] = useState(false);
  const [open, setOpen] = useState(false);
  const [downBody, setDownBody] = useState();
  const [errMsg, seterrMsg] = useState('');
  const [copied, setcopied] = useState(false);
  useEffect(() => {
    axios
      .get(Api.baseUri + getHeadersUrl)
      .then((res) => {
        let arr = [];
        res?.data?.data?.map((rr) => {
          arr.push({title: rr, value: rr});
        });
        setDownBody(arr);
      })
      .catch((err) => {
        setDownBody([]);
      });
  }, []);
  async function uploadExcel(file, uploadURL) {
    let tt = await excelDoc?.uploadDoc(file, uploadURL);
    seterrMsg(tt);
    setDownloadClick(false);
    setMyuploadedFile('');
  }
  async function downloadExcel(downloadURL, downloadFile) {
    await excelDoc?.downloadDoc(downloadURL, downloadFile);
    setDownloadClick(false);
  }
  async function downloadExcelPost(downloadURL, downloadFile, down) {
    await excelDoc?.downloadDocPost(downloadURL, downloadFile, down);
    setDownloadClick(false);
  }
  function onSubmit(val) {
    setOpen(false);
    downloadExcelPost(downloadURL, downloadFile + '  List', val?.data?.downReq);
  }

  let template = {
    layout: {
      column: 1,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'multiSelect',
            name: 'downReq',
            field: 'downReq',
            title: 'Select Fields',
            options: downBody ?? [],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      {errMsg ? (
        <Dialog
          open={true}
          maxWidth='false'
          PaperProps={{
            sx: {
              width: '40%',
            },
          }}
          style={{borderRadius: '4rem'}}
        >
          <DialogTitle
            style={{
              background: '#e74b3c',
              color: 'white',
              paddingBottom: '0px',
              fontWeight: 600,
              fontSize: '16px',
            }}
          >
            <span>
              Total number of error is {errMsg?.data?.length}
              <CopyToClipboard
                text={JSON.stringify(errMsg?.data)}
                onCopy={() => {
                  setcopied(true);
                  setTimeout(() => {
                    setcopied(false);
                  }, 5000);
                }}
              >
                {!copied ? (
                  <ContentCopyIcon
                    style={{
                      cursor: 'pointer',
                      marginLeft: '12px',
                      fontSize: '16px',
                      position: 'relative',
                      top: '4px',
                    }}
                  />
                ) : (
                  <VerifiedIcon
                    style={{
                      marginLeft: '12px',
                      fontSize: '16px',
                      position: 'relative',
                      top: '3px',
                      color: '#60ea60',
                    }}
                  />
                )}
              </CopyToClipboard>
            </span>
            <CloseIcon
              style={{
                cursor: 'pointer',
                position: 'absolute',
                right: '12px',
                top: '12px',
              }}
              onClick={(e) => {
                seterrMsg('');
              }}
            />
          </DialogTitle>
          <DialogContent
            style={{
              padding: '15px 10px 17px 21px;',
              background: '#e74b3c',
              color: 'white',
            }}
          >
            {errMsg?.data?.map((el) => {
              return (
                <div>
                  Row: {el?.row}, message: {el?.errorMsg}{' '}
                </div>
              );
            })}
          </DialogContent>
        </Dialog>
      ) : null}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginRight: '20px',
          alignItems: 'center',
        }}
      >
        {downloadTempURL && (
          <div>
            <AppTooltip placement={'top'} title={'Download Template'}>
              <SimCardDownloadOutlinedIcon
                className='title-icons-mui'
                // sx={{mr: 4}}
                onClick={() => {
                  if (downloadClick) return;
                  setDownloadClick(true);
                  downloadExcel(downloadTempURL, downloadFile + ' Template');
                }}
              />
            </AppTooltip>
            {/* <Button id='btnMui123'
                        onClick={() => {
                            setDownloadClick(true);
                            downloadExcel(downloadTempURL, downloadFile + ' Template')
                        }}
                        disabled={downloadClick}
                        sx={{ borderRadius: "15px", mr: 2, border: '2px solid #5a879f', color: "black" }}
                        variant="outlined" >
                        <ArrowCircleDownIcon style={{ marginRight: "5px", fontSize: "18px" }} />
                        Download Template
                    </Button> */}
          </div>
        )}
        {downloadURL && (
          <div>
            <AppTooltip placement={'top'} title={'Download'}>
              <ArrowCircleDownIcon
                className='title-icons-mui'
                // sx={{mr: 4}}
                onClick={() => {
                  if (downloadClick) return;
                  setDownloadClick(true);
                  setOpen(true);
                }}
              />
            </AppTooltip>
            {/* <Button id='btnMui123'
                        sx={{ borderRadius: "15px", mr: 2, border: '2px solid #5a879f', color: "black" }}
                        onClick={() => {
                            setDownloadClick(true);
                            setOpen(true);
                        }}
                        disabled={downloadClick}
                        variant="outlined" >
                        <ArrowCircleDownIcon style={{ marginRight: "5px", fontSize: "18px" }} />
                        Download
                    </Button> */}
          </div>
        )}

        {uploadURL && (
          <div>
            <AppTooltip
              placement={'top'}
              title={myuploadedFile?.name || 'Upload'}
            >
              <div
                style={{position: 'relative'}}
                className='title-icons-mui-upload'
              >
                <FileUploadIcon style={{marginRight: '-24px'}} />
                {!downloadClick ? (
                  <input
                    onChange={(e) => {
                      setDownloadClick(true);
                      uploadExcel(e.target.files, uploadURL);
                      setMyuploadedFile({
                        ...myuploadedFile,
                        name: e.target.files[0]?.name,
                      });
                    }}
                    accept='.xlsx,.xls,.csv'
                    title='Please Select File'
                    style={{
                      position: 'absolute',
                      opacity: 0,
                      cursor: 'pointer',
                      color: 'transparent',
                      width: '24px',
                      zIndex: '2000',
                    }}
                    id={'registerName'}
                    multiple={false}
                    type='file'
                  />
                ) : null}
              </div>
            </AppTooltip>
          </div>
        )}
      </div>
      <Dialog
        open={open}
        onClose={() => {
          setDownloadClick(false);
          setOpen(false);
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle
          id='alert-dialog-title'
          style={{backgroundColor: '#f4f2f2', fontSize: '20px'}}
        >
          Downloadable Fields
          <span
            style={{
              position: 'absolute',
              right: '14px',
              top: '14px',
              cursor: 'pointer',
            }}
          >
            <CloseIcon
              onClick={(e) => {
                setOpen(false);
                setDownloadClick(false);
              }}
            />
          </span>
        </DialogTitle>
        <DialogContent style={{minWidth: '500px'}}>
          <SmartForm
            template={template}
            onSubmit={onSubmit}
            buttons={['Download']}
            filterbtnStyle={{
              background: '#31bc7b',
              borderRadius: '20px',
              width: '113px',
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExcelContainer;
