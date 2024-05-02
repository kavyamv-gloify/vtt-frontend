import {StylesContext} from '@mui/styles';
import React, {useEffect, useState} from 'react';
import styles from './Ticket.module.css';
import CampaignIcon from '@mui/icons-material/Campaign';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import Calender from '../Calender/Calender';
import HistoryIcon from '@mui/icons-material/History';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TicketContent from '../TicketContent/TicketContent';
import moment from 'moment';
import Api from '@api';
import {useNavigate} from 'react-router-dom';
import {useStepContext} from '@mui/material';
import {style} from '@mui/system';
import axios from 'axios';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
const Ticket = () => {
  const [data, setData] = useState();
  const [pendingRoaster, setPendingRoaster] = useState();
  const [leave, setLeave] = useState();
  const [pendingRequest, setPendingRequest] = useState();
  const [totalPending, setTotalPending] = useState();
  const navigate = useNavigate();
  const [mydata, setMydata] = useState([]);
  useEffect(() => {
    axios
      .get(
        Api.baseUri +
          '/user-reg/incident-management/get-All-incident-management/null',
      )
      .then((res) => {
        setMydata(res?.data?.data || []);
      })
      .catch((er) => {
        setMydata([]);
      });
  }, []);
  // function getAnnouncement() {
  //     axios.get(Api.announcement.listing).then((res) => {
  //         let temp = [];
  //         setData(res?.data?.data)
  //     }).catch((err) => {
  //
  //         setData([]);
  //     })
  // }

  function getAllAnnouncement() {
    axios
      .get(Api.announcement.listing)
      .then((res) => {
        let sortedProducts = res?.data?.data?.sort((p1, p2) =>
          new Date(p1.createdOn) < new Date(p2.createdOn)
            ? 1
            : new Date(p1.createdOn) > new Date(p2.createdOn)
            ? -1
            : 0,
        );
        let tem = [];
        sortedProducts?.map((el) => {
          let t = el;
          t.startTime = Date.parse(t.startDate + ' ' + t.startTime);
          t.endTime = Date.parse(t.endDate + ' ' + t.endTime);
          tem.push(t);
        });
        setData(tem);
      })
      .catch((err) => {
        setData([]);
      });
  }
  useEffect(() => {
    getAllAnnouncement();
  }, []);
  function getPendingRoaster() {
    axios
      .get(Api.baseUri + '/user-reg/roaster/get-team-roaster-req')
      .then((res) => {
        //
        setPendingRoaster(res?.data?.data);
      });
  }

  function getLeaveList() {
    axios.get(Api.baseUri + '/user-reg/leave-reg/getAll').then((res) => {
      setLeave(res?.data?.data);
    });
  }

  useEffect(() => {
    // getAnnouncement();
    getPendingRoaster();
    getLeaveList();
  }, []);

  useEffect(() => {
    axios
      .get(Api.baseUri + '/user-reg/employee-reg/getAllPendingData')
      .then((res) => {
        if (res?.data?.status == '200') {
          // console.log('res', res);
          setPendingRequest(res?.data?.data?.pendingMap);
          let result = Object.values(res?.data?.data?.pendingMap)?.reduce(
            (a, b) => Number(a) + Number(b),
            0,
          );
          setTotalPending(result);
          // console.log(result);
        }
      })
      .catch((err) => {
        setPendingRequest({});
      });
  }, []);
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
                {/* <div className={styles.AnnounceIcon}>
              <ConfirmationNumberOutlinedIcon />
              <div className={styles.contentTitle}>Tickets</div>
            </div> */}
                <div className={styles.contentHeaderRight}></div>
              </div>
              <div className={styles.TicketScroll}>
                {mydata?.map((el) => (
                  <TicketContent myData={el} />
                ))}
              </div>
            </div>
          </Grid>
          {/* 40% width for the div above */}
          <Grid item xs={12} sm={4}>
            {/* Your content for the div above */}
            <div className={styles.childRightTop}>
              <div className={styles.AnnounceHeader}>
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <CampaignIcon sx={{mr: 2}} />
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
                        navigate('/createForm/corporate-AdhocTrip');
                      }}
                    >
                      <span>Adhoc Requests</span>
                      <div className={styles.pendingReqChildRight}>
                        {pendingRequest?.AdhocTrip}
                      </div>
                    </div>
                    <div
                      className={styles.pendingRequestChild}
                      onClick={() => {
                        navigate('/all-leave-listing');
                      }}
                    >
                      <span>Leave Requests</span>
                      <div className={styles.pendingReqChildRight}>
                        {pendingRequest?.LeaveRequest}
                      </div>
                    </div>
                    <div
                      className={styles.pendingRequestChild}
                      onClick={() => {
                        navigate('/rosters/roster-page');
                      }}
                    >
                      <span>Roster Requests</span>
                      <div className={styles.pendingReqChildRight}>
                        {' '}
                        {pendingRequest?.RosterRequest}
                      </div>
                    </div>
                    <div
                      className={styles.pendingRequestChild}
                      onClick={() => {
                        navigate('/onboardCorporate/employee/pending-list');
                      }}
                    >
                      <span>Employee Profile Requests</span>
                      <div className={styles.pendingReqChildRight}>
                        {' '}
                        {pendingRequest?.EmpPendingRequest}
                      </div>
                    </div>
                    <div
                      className={styles.pendingRequestChild}
                      onClick={() => {
                        navigate('/onboardadmin/pending-driver/driver-listing');
                      }}
                    >
                      <span>Driver Profile Requests</span>
                      <div className={styles.pendingReqChildRight}>
                        {' '}
                        {pendingRequest?.DriverChangeRequest}
                      </div>
                    </div>
                    <div
                      className={styles.pendingRequestChild}
                      onClick={() => {
                        navigate('/onboardadmin/pending-vendor/vendor-listing');
                      }}
                    >
                      <span>Vendor Profile Requests</span>
                      <div className={styles.pendingReqChildRight}>
                        {' '}
                        {pendingRequest?.VendorChangeRequest}
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
            <div style={{display: 'flex', alignItems: 'center'}}>
              <ConfirmationNumberOutlinedIcon sx={{mr: 2}} />
              <span className={styles.pendingtitle}>Tickets</span>
            </div>

            <div className={styles.contentHeaderRight}></div>
          </div>
          <div className={styles.TicketScroll}>
            {mydata?.map((el) => (
              <TicketContent myData={el} />
            ))}
          </div>
        </div>
        <div className={styles.childRight}>
          <div className={styles.childRightTop}>
            <div className={styles.AnnounceHeader}>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <CampaignIcon sx={{mr: 2}} />
                <span className={styles.pendingtitle}>Announcements</span>
              </div>
            </div>
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
                  navigate('/createForm/corporate-AdhocTrip');
                }}
              >
                <span>Adhoc Requests</span>
                <div className={styles.pendingReqChildRight}>
                  {pendingRequest?.AdhocTrip}
                </div>
              </div>
              <div
                className={styles.pendingRequestChild}
                onClick={() => {
                  navigate('/all-leave-listing');
                }}
              >
                <span>Leave Requests</span>
                <div className={styles.pendingReqChildRight}>
                  {pendingRequest?.LeaveRequest}
                </div>
              </div>
              <div
                className={styles.pendingRequestChild}
                onClick={() => {
                  navigate('/rosters/roster-page');
                }}
              >
                <span>Roster Requests</span>
                <div className={styles.pendingReqChildRight}>
                  {' '}
                  {pendingRequest?.RosterRequest}
                </div>
              </div>
              <div
                className={styles.pendingRequestChild}
                onClick={() => {
                  navigate('/onboardCorporate/employee/pending-list');
                }}
              >
                <span>Employee Profile Requests</span>
                <div className={styles.pendingReqChildRight}>
                  {' '}
                  {pendingRequest?.EmpPendingRequest}
                </div>
              </div>
              <div
                className={styles.pendingRequestChild}
                onClick={() => {
                  navigate('/onboardadmin/pending-driver/driver-listing');
                }}
              >
                <span>Driver Profile Requests</span>
                <div className={styles.pendingReqChildRight}>
                  {' '}
                  {pendingRequest?.DriverChangeRequest}
                </div>
              </div>
              <div
                className={styles.pendingRequestChild}
                onClick={() => {
                  navigate('/onboardadmin/pending-vendor/vendor-listing');
                }}
              >
                <span>Vendor Profile Requests</span>
                <div className={styles.pendingReqChildRight}>
                  {' '}
                  {pendingRequest?.VendorChangeRequest}
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
