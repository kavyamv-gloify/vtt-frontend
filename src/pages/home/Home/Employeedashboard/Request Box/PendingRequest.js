import React, {useState, useEffect} from 'react';
import styles from './PendingRequest.module.css';
import HistoryIcon from '@mui/icons-material/History';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CampaignIcon from '@mui/icons-material/Campaign';
import Calender from '../Calender/Calender';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import Api from '@api';
import {Box, Grid} from '@mui/material';
import {useSelector} from 'react-redux';
// import { useState } from 'react';
const PendingRequestBox = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const adhocPendingCount = useSelector(({settings}) => settings.adhocCount);
  const leavePendingCount = useSelector(({settings}) => settings.leaveCount);
  function getAnnouncement() {
    axios
      .get(Api.announcement.empAnnounceList)
      .then((res) => {
        setData(res?.data?.data || []);
      })
      .catch((err) => {
        setData([]);
      });
  }
  useEffect(() => {
    getAnnouncement();
  }, []);
  return (
    <>
      <Box sx={{width: '100%', marginTop: '5px'}}>
        <Grid item xs={12} sm={12}>
          <div className={styles.parentContainer}>
            <div className={styles.announcementContainer}>
              <div className={styles.announcementContainer2}>
                <div className={styles.AnnounceHeader}>
                  <div style={{display: 'flex', alignItems: 'center'}}>
                    <CampaignIcon aignIcon sx={{mr: 2}} />
                    <span className={styles.title}>Announcements</span>
                  </div>
                </div>
                {/* <hr /> */}
                <div className={styles.AnnounceScroll}>
                  {data?.length ? (
                    data?.slice(0, 5)?.map((el) => {
                      return (
                        <Calender
                          dates={el?.startDate}
                          title={el?.title}
                          summary={el?.summary}
                          id={el?.id}
                        />
                      );
                    })
                  ) : (
                    <h5 className={styles.AnnounceNoRecord}>No Record Found</h5>
                  )}
                </div>
                {/* <div className={styles.view}>
                  <u>
                    <a
                      onClick={() => {
                        navigate(
                          '/onboardCorporate/announcement/announcement-listing',
                        );
                      }}
                    >
                      View All
                    </a>
                  </u>
                </div> */}
              </div>
            </div>
            <div className={styles.pendingRequestContainer}>
              <div className={styles.pendingRequestHeader}>
                <div className={styles.pendingLeft}>
                  <div className={styles.pendingIcon}>
                    <HistoryIcon />
                  </div>
                  <span className={styles.title}>
                    Pending Request
                    {/* ({totalPending}) */}
                  </span>
                </div>
              </div>
              <div className={styles.pendingRequestParent}>
                <div
                  className={styles.pendingRequestChild}
                  onClick={() => {
                    navigate('/AdhocTrip-list');
                  }}
                >
                  <span>Adhoc Requests</span>
                  <div className={styles.pendingReqChildRight}>
                    {adhocPendingCount || 0}
                  </div>
                </div>
                <div
                  className={styles.pendingRequestChild}
                  onClick={() => {
                    navigate('/leave-listing');
                  }}
                >
                  <span>Leave Requests</span>
                  <div className={styles.pendingReqChildRight}>
                    {leavePendingCount || 0}
                  </div>
                </div>
                {/* <div
                  className={styles.pendingRequestChild}
                  onClick={() => {
                    navigate('/rosters/my-roster-req');
                  }}
                >
                  <span>Schedule Requests</span>
                  <div className={styles.pendingReqChildRight}> 0</div>
                </div> */}
              </div>
              {/* <hr className={styles.underline} /> */}
            </div>
          </div>
        </Grid>
      </Box>
      {/* <div className={styles.parentContainer}>
        <div className={styles.pendingRequestContainer}>
          <div className={styles.pendingRequestHeader}>
            <div className={styles.pendingLeft}>
              <div className={styles.pendingIcon}>
                <HistoryIcon />
              </div>
              <span className={styles.title}>Pending Request</span>
            </div>
          </div>
          <hr className={styles.underline} />
        </div>
        <div className={styles.announcementContainer}>
          <div className={styles.announcementContainer2}>
            <div className={styles.AnnounceHeader}>
              <div className={styles.AnnounceLeft}>
                <div className={styles.AnnounceIcon}>
                  <CampaignIcon style={{color: 'orange'}} />
                </div>
                <span className={styles.title}>Announcement</span>
              </div>
            </div>
            <hr />
            <div className={styles.AnnounceScroll}>
              {data?.slice(0, 5)?.map((el) => {
                return (
                  <Calender
                    dates={el?.startDate}
                    title={el?.title}
                    summary={el?.summary}
                    id={el?.id}
                  />
                );
              })}
            </div>
            <div className={styles.view}>
              <u>
                <a
                  onClick={() => {
                    navigate(
                      '/onboardCorporate/announcement/announcement-listing',
                    );
                  }}
                >
                  View All
                </a>
              </u>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default PendingRequestBox;
