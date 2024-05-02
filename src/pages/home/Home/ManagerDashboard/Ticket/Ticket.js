import {StylesContext} from '@mui/styles';
import React, {useState, useEffect} from 'react';
import styles from './Ticket.module.css';
import CampaignIcon from '@mui/icons-material/Campaign';
import Calender from '../Calender/Calender';
import HistoryIcon from '@mui/icons-material/History';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TicketContent from '../TicketContent/TicketContent';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import Api from '@api';
import {useNavigate} from 'react-router-dom';
import {
  setAdhocCountManager,
  setLeaveCountManager,
  setScheduleCountManager,
} from 'redux/actions';
import { useDispatch } from 'react-redux';
const Ticket = () => {
  const [data, setData] = useState();
  const [totalPending, setTotalPending] = useState();
  const [pendingRequest, setPendingRequest] = useState();
  const dispatch = useDispatch();

  function getAnnouncement() {
    axios
      .get(Api.announcement.listing)
      .then((res) => {
        let temp = [];
        setData(res?.data?.data);
      })
      .catch((err) => {
        setData([]);
      });
  }

  function getPendingRoaster() {
    axios
      .get(Api.baseUri + '/user-reg/employee-reg/getPendingDataForManager')
      .then((res) => {
        if (res?.data?.status == '200') {
          setPendingRequest(res?.data?.data);
          dispatch(
            setLeaveCountManager(res?.data?.data?.pendingMap?.LeaveRequest),
          );
          dispatch(
            setAdhocCountManager(res?.data?.data?.pendingMap?.AdhocTrip),
          );
          dispatch(
            setScheduleCountManager(res?.data?.data?.pendingMap?.RosterRequest),
          );
          let result = Object.values(res?.data?.data?.pendingMap)?.reduce(
            (a, b) => Number(a) + Number(b),
            0,
          );
          setTotalPending(result);
        }
      })
      .catch((err) => {
        setPendingRequest({});
      });
  }

  useEffect(() => {
    getAnnouncement();
    getPendingRoaster();
  }, []);
  const navigate = useNavigate();
  return (
    <>
      <Box sx={{width: '100%', marginTop: '5px'}}>
        <Grid container rowSpacing={2} columnSpacing={{xs: 4}}>
          {/* 60% width for the main content */}
          <Grid item xs={12} sm={8}>
            <div className={styles.childLeft}>
              <div className={styles.childLeftHeader}>
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <ConfirmationNumberOutlinedIcon sx={{mr: 2}} />
                  <span className={styles.pendingtitle}>Tickets</span>
                </div>
                <div className={styles.contentHeaderRight}></div>
              </div>
              <div className={styles.TicketScroll}>
                {/* {mydata?.map((el) => ( */}
                {/* <TicketContent myData={el} /> */}
                <TicketContent />
                {/* ))} */}
              </div>
            </div>
          </Grid>
          {/* 40% width for the div above */}
          <Grid item xs={12} sm={4}>
            {/* Your content for the div above */}
            <div className={styles.childRightTop}>
              <div className={styles.AnnounceHeader}>
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <CampaignIcon aignIcon sx={{mr: 2}} />
                  <span className={styles.pendingtitle}>Announcements</span>
                </div>
                {/* <div className={styles.AnnounceLeft}>
                <div className={styles.AnnounceIcon}>
                  <CampaignIcon />
                </div>
                <span className={styles.contentTitle}>Announcements</span>
              </div> */}
              </div>
              {/* <hr /> */}
              <div className={styles.AnnounceScroll}>
                {}
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

              {data?.length > 0 && (
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
              )}
            </div>
            <Grid
              container
              rowSpacing={2}
              columnSpacing={{xs: 4}}
              sx={{marginTop: '10px'}}
            >
              <Grid item xs={12} sm={12}>
                <div className={styles.childRightBottom}>
                  <div className={styles.pendingRequestHeader}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                      <HistoryIcon sx={{mr: 2}} />
                      <span className={styles.pendingtitle}>
                        Pending Requests ({totalPending})
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
                        {pendingRequest?.pendingMap?.AdhocTrip}
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
                        {pendingRequest?.pendingMap?.LeaveRequest}
                      </div>
                    </div>
                    <div
                      className={styles.pendingRequestChild}
                      onClick={() => {
                        navigate('/rosters/my-roster-req');
                      }}
                    >
                      <span>Schedule Requests</span>
                      <div className={styles.pendingReqChildRight}>
                        {' '}
                        {pendingRequest?.pendingMap?.RosterRequest}
                      </div>
                    </div>
                  </div>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      {/* <div className={styles.parentContainer}>
        <div className={styles.childLeft}>
          <div className={styles.childLeftHeader}>
            <div className={styles.contentTitle}>Tickets</div>
            <div className={styles.contentHeaderRight}>
              <span className={styles.contentNumber}>2016</span>
              <span className={styles.contentNumber}>June</span>
            </div>
          </div>
          <div className={styles.TicketScroll}>
            <TicketContent />
            <TicketContent />
            <TicketContent />
            <TicketContent />
            <TicketContent />
            <TicketContent />
          </div>
        </div>
        <div className={styles.childRight}>
          <div style={{paddingLeft: '20px', width: '100%'}}>
            <div className={styles.childRightTop}>
              <div className={styles.AnnounceHeader}>
                <div className={styles.AnnounceLeft}>
                  <div className={styles.AnnounceIcon}>
                    <CampaignIcon />
                  </div>
                  <span className={styles.contentTitle}>Announcements</span>
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

            <div className={styles.childRightBottom}>
              <div className={styles.pendingRequestHeader}>
                <div className={styles.pendingLeft}>
                  <div className={styles.pendingIcon}>
                    <HistoryIcon />
                  </div>
                  <span className={styles.pendingtitle}>Pending Request</span>
                </div>
                <div className={styles.pendingRight}>
                  <MoreVertIcon />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default Ticket;
