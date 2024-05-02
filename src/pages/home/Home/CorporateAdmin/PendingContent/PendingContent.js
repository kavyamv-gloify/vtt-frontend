import {style} from '@mui/system';
import React, {useEffect, useState} from 'react';
import styles from './PendingContent.module.css';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LogoutIcon from '@mui/icons-material/Logout';
import moment from 'moment';
const PendingContent = ({
  title,
  code,
  login,
  logout,
  date,
  managerName,
  content,
}) => {
  const [dates, setDates] = useState();

  useEffect(() => {
    let arr = [];
    date?.map((el) => {
      arr.push(el?.date);
      setDates({
        fromDate: arr[0],
        toDate: arr[arr?.length - 1],
      });
    });
  }, [date]);
  return (
    <>
      {content == 'PENDING' ? (
        <div className={styles.parentContainer}>
          <div style={{marginTop: '40px'}}>
            <AccessTimeIcon />
          </div>
          <div className={styles.PendingContent}>
            <div className={styles.iconcontent}>
              <div className={styles.firstLayer}>
                <h2 className={styles.content}>
                  {title} <span className={styles.id}>({code})</span>
                </h2>
              </div>

              <div className={styles.secondlayer}>
                <div className={styles.secondlayerName}>
                  <h5>{managerName}</h5>{' '}
                </div>
                <div className={styles.dateWrapper}>
                  <div className={styles.dateContent}>
                    <img src={'/assets/images/calender_icon.png'} alt='P' />
                    <h5> {moment(dates?.fromDate).format('DD-MM-YYYY')} </h5>
                  </div>
                  <div>
                    <h5>------------</h5>
                  </div>
                  <div className={styles.dateContent}>
                    <h5> {moment(dates?.toDate).format('DD-MM-YYYY')} </h5>
                    <img
                      src={'/assets/images/calender_Right_icon.png'}
                      alt='P'
                    />
                  </div>
                </div>
              </div>

              <div className={styles.thirdlayer}>
                <div className={styles.time}>
                  <img
                    src={'/assets/images/login_icon.png'}
                    alt='P'
                    style={{width: '35%'}}
                  />
                  <h4 className={styles.timeValue}>{login}</h4>
                </div>
                <div className={styles.time}>
                  <img
                    src={'/assets/images/logout_icon.png'}
                    alt='P'
                    style={{width: '35%'}}
                  />
                  <h4 className={styles.timeValue}>{logout}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.parentContainer}>
          <div style={{marginTop: '40px'}}>
            <LogoutIcon />
          </div>
          <div className={styles.PendingContent}>
            <div className={styles.iconcontent}>
              <div className={styles.firstLayer}>
                <h2 className={styles.content}>
                  {title ?? 'NA'} <span className={styles.id}>({code})</span>
                </h2>
              </div>

              <div className={styles.secondlayer}>
                <div className={styles.secondlayerName}>
                  <h5>{managerName}</h5>{' '}
                </div>
                <div className={styles.dateWrapper}>
                  <div className={styles.dateContent}>
                    <img src={'/assets/images/calender_icon.png'} alt='P' />
                    <h5> {moment(dates?.fromDate).format('DD-MM-YYYY')} </h5>
                  </div>
                  <div>
                    <h5>------------</h5>
                  </div>
                  <div className={styles.dateContent}>
                    <h5> {moment(dates?.toDate).format('DD-MM-YYYY')} </h5>
                    <img
                      src={'/assets/images/calender_Right_icon.png'}
                      alt='P'
                    />
                  </div>
                </div>
              </div>

              <div className={styles.thirdlayer}>
                <div className={styles.time}>
                  <img
                    src={'/assets/images/login_icon.png'}
                    alt='P'
                    style={{width: '35%'}}
                  />
                  <h4 className={styles.timeValue}>{login}</h4>
                </div>
                <div className={styles.time}>
                  <img
                    src={'/assets/images/logout_icon.png'}
                    alt='P'
                    style={{width: '35%'}}
                  />
                  <h4 className={styles.timeValue}>{logout}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default PendingContent;
