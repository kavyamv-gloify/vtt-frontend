import {style} from '@mui/system';
import React, {useEffect, useState} from 'react';
import styles from './Calender.module.css';
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import DialogTitle from '@mui/material/DialogTitle';
import Api from '@api';
import {Tooltip} from '@mui/material';
import {useStepContext} from '@mui/material';
import Details from '../../CorporateAdmin/AnnouncementCard/AnnouncementCard';
import AttachmentIcon from '@mui/icons-material/Attachment';
import downDoc from '@common/fileDownload';
const Calender = ({dates, title, summary, id}) => {
  const [openDialog, setopenDialog] = useState();
  const [data, setData] = useState();
  const [info, setInfo] = useState();

  const date = {
    year: dates?.split('-')[0],
    month: dates?.split('-')[1],
    day: dates?.split('-')[2],
  };
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ];

  useEffect(() => {
    async function getAnnouncement() {
      //
      axios
        .get(`${Api.announcement.getbyId}/${id}`)
        .then((response) => {
          setData(response?.data?.data?.pushNotificationMessage);
          setInfo(response?.data?.data);
        })
        .catch(() => {
          setData(' ');
        });
    }
    getAnnouncement();
  }, [id]);
  return (
    <>
      {/* <hr className={styles.underLine}/> */}
      <div className={styles.parentContainer}>
        <div className={styles.childcontainer}>
          <div className={styles.dateContainer}>
            <span className={styles.date}>{date?.day}</span>
          </div>
          <div className={styles.monthContainer}>
            <span className={styles.month}>
              {months[Number(date?.month) - 1]}
            </span>
            <span className={styles.month}>{date?.year}</span>
          </div>
        </div>
        <div className={styles.announceContent}>
          <div className={styles?.announcementSpace}>
            <h4
              className={styles.title}
              onClick={() => {
                setopenDialog(true);
              }}
            >
              {title}
            </h4>
            <div>
              <Tooltip title={'view attachment'}>
                <AttachmentIcon
                  className='cursor'
                  onClick={() => {
                    downDoc?.openDoc(info?.image);
                  }}
                />
              </Tooltip>
            </div>
          </div>
          <h5 className={styles.summary}>{summary}</h5>
        </div>
      </div>

      <Dialog
        onClose={() => {
          setopenDialog(false);
        }}
        open={openDialog}
        PaperProps={{
          sx: {
            width: '1200px',
          },
        }}
        maxWidth='false'
      >
        <DialogTitle style={{background: '#f4f2f2'}}>
          <h1>{title}</h1>
          <CloseIcon
            onClick={() => {
              setopenDialog(false);
            }}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              color: '#4f4f4f',
              fontWeight: 'bold',
            }}
          />
        </DialogTitle>
        <DialogContent style={{padding: '28px'}}>
          <Details info={info} doc={data} />
        </DialogContent>
      </Dialog>
    </>
  );
};
export default Calender;
