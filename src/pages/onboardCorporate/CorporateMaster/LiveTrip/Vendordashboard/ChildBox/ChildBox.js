import React, {useEffect, useState} from 'react';
import styles from './ChildBox.module.css';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GridBoxCopy from '../GridBox/GridBoxCopy';
import moment from 'moment';
import {isEmpty} from 'lodash';
const Container = ({data, tripType, tripDate, getAllData}) => {
  const month = [
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
      <div className={styles.childContainer}>
        <div className={styles.firstlayer}>
          <div className={styles.firstlayerContent}>
            {tripType == 'UPTRIP' ? (
              <img
                src={'/assets/images/login_icon.png'}
                alt='P'
                style={{width: '25px', height: '25px', margin: '6px 5px 0 0'}}
              />
            ) : (
              <img
                src={'/assets/images/logout_icon.png'}
                alt='P'
                style={{width: '25px', height: '25px', margin: '6px 5px 0 0'}}
              />
            )}
            {data?.[0]?.tripCategory !== 'ADHOCTRIP' ? (
              <span className={styles.spans}>
                {
                  moment(tripDate?.split('T')[0]).format('DD MMM') +
                    ' ' +
                    tripDate?.split('T')[2]?.split(':')[0] +
                    ':' +
                    tripDate?.split('T')[2]?.split(':')[1]
                  // tripDate?.split('T')[1]?.split(':')[0] +
                  // ':' +
                  // tripDate?.split('T')[1]?.split(':')[1]
                }
              </span>
            ) : (
              <span className={styles.spans}>{data?.[0]?.startTime}</span>
            )}

            {data?.[0]?.tripCategory == 'ADHOCTRIP' ? (
              <TrendingUpIcon style={{marginTop: '13px', marginLeft: '10px'}} />
            ) : (
              ' '
            )}
          </div>
        </div>

        <div style={{padding: '20px'}}>
          <div>
            {isEmpty(data) ? (
              <div style={{textAlign: 'center'}}>No records found</div>
            ) : (
              <GridBoxCopy data={data} getAllData={getAllData} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Container;
