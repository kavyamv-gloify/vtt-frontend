import React, {useEffect, useState} from 'react';
import {Box, Button} from '@mui/material';
import styles from '../style.module.css';
// import styles from './style.module.css'
import {TabContext, TabPanel} from '@mui/lab';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import parse from 'html-react-parser';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import Api from '@api';
import ModalImage from 'react-modal-image';

const Account = ({TabVal}) => {
  const [accordian, setAccordian] = useState();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [file, setFile] = useState();
  const [extn, setExtn] = useState();

  return (
    <>
      <div className={styles.contentSec}>
        <h3
          className='ml-3 mb-4'
          style={{padding: '10px 10px 10px 10px', color: '#11234e'}}
        >
          {TabVal?.subTopicName ?? 'Our FAQs'}
        </h3>
        <Box sx={{width: '100%', typography: 'body1'}}>
          <TabContext value={'1'}>
            <TabPanel value='1'>
              <div className='flex flex-wrap'>
                <div className='w-full md:w-12/12 sm:w-12/12 px-4'>
                  {TabVal?.length ? (
                    TabVal?.map((r, ind) => {
                      return (
                        <div
                          className='mb-4 cursor-pointer'
                          style={{cursor: 'pointer', marginBottom: '10px'}}
                          onClick={() => {
                            accordian == ind
                              ? setAccordian(null)
                              : setAccordian(ind);
                          }}
                        >
                          <div
                            style={{padding: '14px'}}
                            className={styles.filterHeading}
                          >
                            Question {ind + 1}: {r.question}
                            <img
                              style={{float: 'right', marginTop: '2px'}}
                              className='pull-right cursor-pointer'
                              src={
                                accordian == ind
                                  ? '/assets/images/minus_icon.png'
                                  : '/assets/images/plus_icon.png'
                              }
                            />
                          </div>
                          {accordian == ind ? (
                            // <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div
                              className={styles.filterContent}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                              }}
                            >
                              <div>Answer: {parse(r.answer)}</div>
                              <div
                                style={{
                                  display: r?.document?.length ? ' ' : 'none',
                                }}
                              >
                                <FileCopyIcon
                                  onClick={() => {
                                    setOpenDialog(true);
                                    setExtn(
                                      (Api.imgUrl + r?.document).slice(-3),
                                    );
                                    setFile(Api.imgUrl + r?.document);
                                  }}
                                />
                              </div>
                            </div>
                          ) : null}
                        </div>
                      );
                    })
                  ) : (
                    <div className='mt-2 mb-8 font-semibold font-grey'>
                      No Records Found
                    </div>
                  )}
                  <div
                    style={{
                      borderRadius: '12px',
                      border: 'solid 1px #efefef',
                      padding: '25px',
                      marginTop: '20px',
                    }}
                    className='mb-2'
                  >
                    <div
                      style={{
                        color: '#1d5490',
                        fontWeight: 'bold',
                        fontSize: 'medium',
                      }}
                    >
                      Did the solution resolve your query?
                    </div>
                    <div className='mt-4' style={{marginTop: '20px'}}>
                      <Button
                        id='btnMui123'
                        size='small'
                        onClick={() => {
                          toast.success('Thanks for your feedback');
                        }}
                        variant='contained'
                        className={styles.btnPrimary}
                        style={{marginRight: '10px'}}
                      >
                        Yes
                      </Button>

                      <Button
                        id='btnMui123'
                        size='small'
                        onClick={() => {
                          navigate('/user/support');
                          localStorage.setItem('Tab', 'CREATE');
                        }}
                        variant='contained'
                        className={styles.btnPrimary}
                      >
                        No
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>
          </TabContext>
        </Box>
      </div>

      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
        }}
        // style={{ borderRadius: "4rem" }}
        PaperProps={{
          sx: {
            width: '75%',
            height: '90%',
          },
        }}
      >
        <DialogContent style={{padding: '0px'}}>
          {file && extn == 'pdf' ? (
            <iframe
              src={file}
              style={{width: '100%', height: '100%'}}
              frameborder='0'
            ></iframe>
          ) : (
            <ModalImage small={file} alt='Hello World!' />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Account;
