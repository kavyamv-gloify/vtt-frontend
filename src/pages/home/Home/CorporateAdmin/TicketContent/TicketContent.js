import React, {useEffect, useState} from 'react';
import styles from './TicketContent.module.css';
import TextsmsIcon from '@mui/icons-material/Textsms';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import moment from 'moment';
const TicketContent = ({myData}) => {
  return (
    <>
      <div className={styles.ParentContainer}>
        <div className={styles.content}>
          <TextsmsIcon />
          <div className={styles.para}>
            <div className={styles.paracontent}>
              <h4>{myData?.subject}</h4>
            </div>
            <div className={styles.iconsdiv}>
              <div className={styles.idicon}>
                <div className={styles.bookIcon}>
                  <ImportContactsIcon />
                </div>
                <span>{myData.ticketCode}</span>
              </div>
              <div className={styles.dateContent}>
                {moment(myData?.createdOn).format('DD/MM/YYYY HH:MM')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TicketContent;
