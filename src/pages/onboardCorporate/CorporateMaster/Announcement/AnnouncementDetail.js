import {ReadMoreSharp, StyleSharp} from '@mui/icons-material';
import React, {useEffect, useState} from 'react';
import styles from './Announcement.module.css';
import axios from 'axios';
import Api from '@api';
import {Grid} from '@mui/material';
import parse from 'html-react-parser';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import {get} from 'react-hook-form';
import geturl from '../../../../@common/fileUrl';
import moment from 'moment';
const Details = ({info, data}) => {
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
        const url = window.URL.createObjectURL(blob.data);
        var reader = new FileReader();
        reader.readAsDataURL(blob.data);

        reader.onloadend = function () {
          var base64data = reader.result;
          setImage(base64data);
          // if (myname) localStorage.setItem(myname, base64data);
          // return (base64data)
        };
      })
      .catch((error) => {});
  }

  getRealUrl(info?.banner, 'picture');

  // useEffect(() => {
  //      )
  //    (localStorage.getItem("picture"))

  // }, [])

  function getTimeFromDate(timestamp) {
    var date = new Date(timestamp * 1000);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    var time = new Date();
    return time.setHours(hours, minutes, seconds);
  }

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
          <div className={styles.DetailsGrey}>
            <h5 className={styles.contentHeading}>Announcement Type</h5>
            <span>:</span>
            <h5 className={styles.contentValue}>{info?.announcemnetType}</h5>
          </div>
          <div className={styles.Details}>
            <h5 className={styles.contentHeading}>Start Date</h5>
            <span>:</span>
            <h5 className={styles.contentValue}>
              {moment(info?.startDate).format('DD-MM-YYYY')}
            </h5>
          </div>
          <div className={styles.DetailsGrey}>
            <h5 className={styles.contentHeading}>End Date</h5>
            <span>:</span>
            <h5 className={styles.contentValue}>
              {moment(info?.endDate).format('DD-MM-YYYY')}
            </h5>
          </div>
          <div className={styles.Details}>
            <h5 className={styles.contentHeading}>Start Time</h5>
            <span>:</span>
            <h5 className={styles.contentValue}>
              {moment(info?.startTime).format('hh:mm')}
            </h5>
          </div>
          <div className={styles.DetailsGrey}>
            <h5 className={styles.contentHeading}>End Time</h5>
            <span>:</span>
            <h5 className={styles.contentValue}>
              {moment(info?.endTime).format('hh:mm')}
            </h5>
          </div>
          <div className={styles.Details}>
            <h5 className={styles.contentHeading}>Message</h5>
            <span>:</span>
            <h5 className={styles.contentValue}>{info?.summary}</h5>
          </div>
          <div className={styles.DetailsGrey}>
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
            <div>
              <h5 className={styles.contentValue}>
                {info?.employeeNames?.join(', ')}
              </h5>
            </div>
          </div>
          <div className={styles.Details}>
            <h5 className={styles.contentHeading}>Frequency</h5>
            <span>:</span>
            <h5 className={styles.contentValue}>
              {info?.isFrequency == true ? info?.frequencyTime : '--'}
            </h5>
          </div>
          {/* <div className={styles.DetailsGrey}>
                        <h5 className={styles.contentHeading}>Email</h5>
                        <span>:</span>
                        <h5 className={styles.contentValue}>{info?.sendEmail ==  true ? parse(data) : "--"}</h5>
                    </div> */}
          <div className={styles.Details}>
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
            <h5 className={styles.contentValue}>
              {moment(info?.createdOn).format('DD MMM, YYYY hh:mm')}
            </h5>
          </div>
          <div className={styles.DetailsGrey}>
            <h5 className={styles.contentHeading}>Created By</h5>
            <span>:</span>
            <h5 className={styles.contentValue}>{info?.createdBy}</h5>
          </div>
        </div>

        <div className={styles.rightchild}>
          <img src={image} alt='No File' className={styles.image} />
        </div>
      </div>
    </>
  );
};

export default Details;
