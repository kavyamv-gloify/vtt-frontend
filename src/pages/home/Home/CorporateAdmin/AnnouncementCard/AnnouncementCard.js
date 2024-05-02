import {StyleSharp} from '@mui/icons-material';
import React, {useEffect, useState} from 'react';
import styles from './Announcement.module.css';
import {Grid} from '@mui/material';
import axios from 'axios';
import Api from '@api';
import parse from 'html-react-parser';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import geturl from '@common/fileUrl';
// import { useEffect } from 'react';
const Details = ({info, data}) => {
  //    {data && parse(data)}

  const [image, setImage] = useState();

  function getRealUrl(ur, myname) {
    let postData = {
      fileurl: ur,
    };
    axios
      .post(Api?.baseUri + '/user-reg/download-file', postData, {
        responseType: 'blob',
      })
      .then((blob) => {
        if (myname.length) {
          localStorage.setItem(myname, '');
        }
        var reader = new FileReader();
        reader.readAsDataURL(blob.data);

        reader.onloadend = function () {
          var base64data = reader.result;
          setImage(base64data);
        };
      })
      .catch((error) => {});
  }

  getRealUrl(info?.banner, 'picture');

  // useEffect(() => {
  //      )
  //     (localStorage.getItem("picture"))

  // }, [])

  return (
    <>
      <div className={styles.parentContainer}>
        <div className={styles.leftchild}>
          {/* <div className={styles.title}>
                        <h3>Announcement Details</h3>
                    </div> */}
          <div className={styles.Details}>
            <h5 className={styles.contentHeading}>Announcement Title</h5>
            <span>:</span>
            <h5 className={styles.contentValue}>{info?.title}</h5>
          </div>
          {/* <div className={styles.DetailsGrey}>
            <h5 className={styles.contentHeading}>Announcement Category</h5>
            <span>:</span>
            <h5 className={styles.contentValue}>{info?.announcemnetType}</h5>
          </div> */}
          <div className={styles.Details}>
            {/* <h5 className={styles.contentHeading}>Start Date</h5> */}
            <h5 className={styles.contentHeading}>Date</h5>
            <span>:</span>
            <h5 className={styles.contentValue}>{info?.startDate}</h5>
          </div>
          {/* <div className={styles.DetailsGrey}>
            <h5 className={styles.contentHeading}>End Date</h5>
            <span>:</span>
            <h5 className={styles.contentValue}>{info?.endDate}</h5>
          </div>
          <div className={styles.Details}>
            <h5 className={styles.contentHeading}>Start Time</h5>
            <span>:</span>
            <h5 className={styles.contentValue}>{info?.startTime}</h5>
          </div>
          <div className={styles.DetailsGrey}>
            <h5 className={styles.contentHeading}>End Time</h5>
            <span>:</span>
            <h5 className={styles.contentValue}>{info?.endTime}</h5>
          </div> */}
          <div className={styles.Details}>
            <h5 className={styles.contentHeading}>Message</h5>
            <span>:</span>
            <h5 className={styles.contentValue}>{info?.summary}</h5>
          </div>
          {/* <div className={styles.DetailsGrey}>
            <h5 className={styles.contentHeading}>SiteOffice</h5>
            <span>:</span>
            <h5 className={styles.contentValue}>{info?.siteOfficeNames}</h5>
          </div>
          <div className={styles.Details}>
            <h5 className={styles.contentHeading}>Department</h5>
            <span>:</span>
            <h5 className={styles.contentValue}>{info?.departmentNames}</h5>
          </div>
          <div className={styles.DetailsGrey}>
            <h5 className={styles.contentHeading}>Employee</h5>
            <span>:</span>
            <h5 className={styles.contentValue}>{info?.employeeNames}</h5>
          </div>
          <div className={styles.Details}>
            <h5 className={styles.contentHeading}>Frequency</h5>
            <span>:</span>
            <h5 className={styles.contentValue}>
              {info?.frequency == true ? info?.frequencyTime : '--'}
            </h5>
          </div> */}
          <div className={styles.Details}>
            <h5 className={styles.contentHeading}>Announcement Type</h5>
            <span>:</span>
            <h5 className={styles.contentValue}>
              {info?.announcemnetType}
            </h5>
          </div>
          {/* <div className={styles.DetailsGrey}>
                        <h5 className={styles.contentHeading}>Email</h5>
                        <span>:</span>
                        <h5 className={styles.contentValue}>{info?.sendEmail ==  true ? parse(data) : "--"}</h5>
                    </div> */}
          {/* <div className={styles.Details}>
            <h5 className={styles.contentHeading}>SMS</h5>
            <span>:</span>
            <h5 className={styles.contentValue}>
              {info?.sendSMS == true ? info?.smsMessage : '--'}
            </h5>
          </div>
          <div className={styles.DetailsGrey}>
            <h5 className={styles.contentHeading}>Push</h5>
            <span>:</span>
            <h5 className={styles.contentValue}>
              {info?.pushNotification == true
                ? info?.pushNotificationMessage
                : '--'}
            </h5>
          </div>
          <div className={styles.Details}>
            <h5 className={styles.contentHeading}>Created On</h5>
            <span>:</span>
            <h5 className={styles.contentValue}>{info?.createdOn}</h5>
          </div>
          <div className={styles.DetailsGrey}>
            <h5 className={styles.contentHeading}>Created By</h5>
            <span>:</span>
            <h5 className={styles.contentValue}>{info?.createdBy}</h5>
          </div> */}
        </div>

        <div className={styles.rightchild}>
          <img src={image} alt='banner' className={styles.image} />
        </div>
      </div>
    </>
  );
};

export default Details;
