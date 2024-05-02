import React, {useState} from 'react';
import styles from './IconInfo.module.css';
import {Dialog, DialogContent, DialogTitle} from '@mui/material';
import WomanIcon from '@mui/icons-material/Woman';
import CustomLabel from 'pages/common/CustomLabel';
import {Button} from '@mui/material';
const IconInfo = ({open, close}) => {
  const [openDialog, setOpenDialog] = useState(open);

  const TripStatus = [
    {name: 'Not Started', color: '6px solid red'},
    {name: 'In Progress', color: ' 6px solid #053f5c'},
    {name: 'Completed', color: ' 6px solid green'},
    {name: 'Cancelled', color: 'white'},
  ];

  const ShiftStatus = [
    // {
    //   title: 'Trip Sheet',
    //   value: 'Available',
    //   images: '/assets/images/TripSheetAvialable.png',
    // },
    // {
    //   title: 'Trip Sheet',
    //   value: 'Offline',
    //   images: '/assets/images/tripsheetOffline.png',
    // },
    // {
    //   title: 'Trip Sheet',
    //   value: 'Unavailable',
    //   images: '/assets/images/TripSheet_unavialable.png',
    // },
    {
      title: 'GPS Device',
      value: 'Available',
      images: '/assets/images/GPSDeviceAvialable.png',
    },
    {
      title: 'GPS Device',
      value: 'Offline',
      images: '/assets/images/GPSDeviceOffline.png',
    },
    {
      title: 'GPS Device',
      value: 'Unavailable',
      images: '/assets/images/GPSDeviceUnavilable.png',
    },
  ];

  const EscortStatus = [
    {
      title: 'Escort',
      value: 'Not Deployed',
      images: '/assets/images/EscortNotDeployed.png',
    },
    {
      title: 'Escort',
      value: 'Deployed and Checked In',
      images: '/assets/images/EscortCheckedIn.png',
      width: '28px',
      height: '21px',
    },
    {
      title: 'Escort',
      value: 'Deployed But Not Checked In',
      images: '/assets/images/Escort3.png',
      width: '28px',
      height: '21px',
      flexBasis: '30%',
    },
    {
      title: 'Escort',
      value: 'Checked In',
      images: '/assets/images/escort_skipped.svg',
      width: '28px',
      height: '28px',
    },
  ];

  const EmployeeStatus = [
    {
      title: 'Female',
      value: 'Employee',
      images: '/assets/images/FemaleEmployee.png',
    },
    {
      title: 'Male',
      value: 'Employee',
      images: '/assets/images/maleEmployee.png',
    },
    {
      title: 'Female',
      value: 'No Show',
      images: '/assets/images/FemaleEmployeeNShow.png',
    },
    {
      title: 'Male',
      value: ' No Show',
      images: '/assets/images/maleEmployeeNoShow.png',
    },
    {
      title: 'Female',
      value: 'Boarded',
      images: '/assets/images/FemaleEmployeeBoarded.png',
    },
    {
      title: 'Male',
      value: ' Boarded',
      images: '/assets/images/maleEmployeeBoarded.png',
    },
    {
      title: 'Female',
      value: 'Deboarded',
      images: '/assets/images/FemaleEmployeeDeborded.png',
    },
    {
      title: 'Male',
      value: ' Deboarded',
      images: '/assets/images/maleEmployeeDeboarded.png',
    },
    // {
    //   title: 'Female',
    //   value: 'Reached Timely',
    //   images: '/assets/images/FemaleEmployeeReachednTime.png',
    // },
    // {
    //   title: 'Male',
    //   value: 'Reached Timely',
    //   images: '/assets/images/maleEmployeeReachednTime.png',
    // },
    // {
    //   title: 'Female',
    //   value: 'Reached Delayed',
    //   images: '/assets/images/female-icon.svg',
    //   size: '25px',
    // },
    // {
    //   title: 'Male',
    //   value: 'Reached Delayed',
    //   images: '/assets/images/male.svg',
    //   size: '25px',
    // },
    {
      title: 'Female',
      value: 'Absent',
      images: '/assets/images/female-absent-icon.svg',
      size: '25px',
    },
    {
      title: 'Male',
      value: 'Absent',
      images: '/assets/images/male-absent.svg',
      size: '25px',
    },
    {
      title: 'Female',
      value: 'Cancelled',
      images: '/assets/images/female-cancel-icon.svg',
      size: '25px',
    },
    {
      title: 'Male',
      value: 'Cancelled',
      images: '/assets/images/male-cancel.svg',
      size: '25px',
    },
  ];

  return (
    <>
      <div className={styles.firstLayer}>
        <div>
          <CustomLabel labelVal='Trip Status' variantVal='h3-underline' />
        </div>

        <div className={styles.TripContent}>
          {TripStatus.map((el) => {
            return (
              <div className={styles.Tripgrid} style={{borderLeft: el?.color}}>
                <h3>{el?.name}</h3>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.firstLayer}>
        <div>
          <CustomLabel labelVal='GPS Status' variantVal='h3-underline' />
        </div>

        <div className={styles.ShiftContent}>
          {ShiftStatus.map((el) => {
            return (
              <div className={styles.ContentIconWrapper}>
                <div className={styles.icons}>
                  <img src={el?.images} alt='P' />
                </div>
                <h4>{el?.title}</h4>
                <h4 className={styles.ContentTitle}>{el?.value}</h4>
              </div>
            );
          })}
        </div>

        <div className={styles.firstLayer}>
          <div>
            <CustomLabel labelVal='Escort Status' variantVal='h3-underline' />
          </div>

          <div className={styles.ShiftContent}>
            {EscortStatus.map((el) => {
              return (
                <div
                  className={styles.ContentIconWrapper}
                  style={{
                    flexBasis: el.flexBasis,
                  }}
                >
                  <div className={styles.icons}>
                    <img
                      src={el?.images}
                      alt='P'
                      style={{width: el?.width, height: el?.height}}
                    />
                  </div>
                  <h4>{el?.title}</h4>
                  <h4 className={styles.ContentTitle}>{el?.value}</h4>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.firstLayer}>
          <div>
            <CustomLabel labelVal='Employee Status' variantVal='h3-underline' />
          </div>

          <div className={styles.ShiftContent}>
            {EmployeeStatus.map((el) => {
              return (
                <div className={styles.ContentIconWrapper}>
                  <div className={styles.icons}>
                    <img src={el?.images} alt='P' style={{width: el?.size}} />
                  </div>
                  <h4>{el?.title}</h4>
                  <h4 className={styles.ContentTitle}>{el?.value}</h4>
                </div>
              );
            })}
          </div>
          <div className={styles.button}>
            <Button
              id='btnMui123'
              style={{color: 'white', background: 'green'}}
              onClick={() => {
                close();
              }}
            >
              OK
            </Button>
          </div>
        </div>
      </div>
      {/* </div> */}
    </>
  );
};

export default IconInfo;
