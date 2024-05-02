import {style} from '@mui/system';
import React, {useEffect, useState} from 'react';
import api from '@api';
import styles from './Calender.module.css';
import InfoIcon from '@mui/icons-material/Info';
import {Tooltip} from '@mui/material';
import parse from 'html-react-parser';
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import DialogTitle from '@mui/material/DialogTitle';
import AppTooltip from '@crema/core/AppTooltip';
import Grid from '@mui/material/Grid';
import CustomLabel from 'pages/common/CustomLabel';
import AttachmentIcon from '@mui/icons-material/Attachment';
import downDoc from '@common/fileDownload';
import {toast} from 'react-toastify';
import Details from '../../CorporateAdmin/AnnouncementCard/AnnouncementCard';
const Calender = ({dates, title, summary, id}) => {
  const [data, setData] = useState('');
  const [info, setInfo] = useState();
  const [openDialog, setopenDialog] = useState(false);
  const date = {
    year: dates?.split('-')[0],
    month: dates?.split('-')[1],
    day: dates?.split('-')[2],
  };

  useEffect(() => {
    if (!id) {
      return;
    }
    if (id?.length) {
      axios
        .get(`${api.announcement.getbyId}/${id}`)
        .then((response) => {
          setData(response?.data?.data?.pushNotificationMessage);
          setInfo(response?.data?.data);
        })
        .catch(() => {
          setData(' ');
        });
    }
  }, [id]);

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
