import React, {useEffect, useState} from 'react';
import './style.css';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Typography,
} from '@mui/material';
import StarRatings from 'react-star-ratings';
import LinearProgress, {
  linearProgressClasses,
} from '@mui/material/LinearProgress';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {styled} from '@mui/material/styles';
import {useAuthUser} from '@crema/utility/AuthHooks';
import AppLoader from '@crema/core/AppLoader';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';
import axios from 'axios';
import Api from '@api';
import _ from 'lodash';
import VendorEmployeeTable from './VendorEmployeeTable';

const CustomExpandIcon = () => {
  return (
    <Box
      sx={{
        '.Mui-expanded & > .collapsIconWrapper': {
          display: 'none',
        },
        '.expandIconWrapper': {
          display: 'none',
        },
        '.Mui-expanded & > .expandIconWrapper': {
          display: 'block',
        },
      }}
    >
      <div className='expandIconWrapper'>
        <IndeterminateCheckBoxOutlinedIcon style={{color: '#407999'}} />
      </div>
      <div className='collapsIconWrapper'>
        <AddBoxOutlinedIcon style={{color: '#407999'}} />
      </div>
    </Box>
  );
};
const BorderLinearProgress = styled(LinearProgress)(({theme}) => ({
  height: 8,
  marginTop: '5px',
  borderRadius: 0,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: '#f3f3f3',
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 0,
    backgroundColor: '#4bae4d',
  },
}));
const BorderLinearProgress2 = styled(LinearProgress)(({theme}) => ({
  height: 8,
  marginTop: '5px',
  borderRadius: 0,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: '#f3f3f3',
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 0,
    backgroundColor: '#a4d431',
  },
}));
const BorderLinearProgress3 = styled(LinearProgress)(({theme}) => ({
  height: 8,
  marginTop: '5px',
  borderRadius: 0,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: '#f3f3f3',
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 0,
    backgroundColor: '#f8e73f',
  },
}));
const BorderLinearProgress4 = styled(LinearProgress)(({theme}) => ({
  height: 8,
  marginTop: '5px',
  borderRadius: 0,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: '#f3f3f3',
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 0,
    backgroundColor: '#fca928',
  },
}));
const BorderLinearProgress5 = styled(LinearProgress)(({theme}) => ({
  height: 8,
  marginTop: '5px',
  borderRadius: 0,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: '#f3f3f3',
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 0,
    backgroundColor: '#f03d1d',
  },
}));

const OverviewFeedBack = ({clickedFunc}) => {
  const {user} = useAuthUser();
  const [accordSel, setAccordSel] = useState(null);
  const [myData, setMyData] = useState([]);
  const [feedTopics, setFeedTopics] = useState([]);
  const [gradeRating, setGradeRating] = useState({});
  const [totalCount, settotalCount] = React.useState(0);

  useEffect(() => {
    axios
      .get(Api.baseUri + '/user-reg/vendor-reg/vendor-ratings')
      .then((res) => {
        setMyData(res?.data?.data || []);
      })
      .catch((er) => {});
  }, []);

  async function getAllFeed(as) {
    let tem, tem1, tem2, tem3, tem4;
    try {
      let t1 = (tem = await axios.get(
        Api.baseUri +
          `/user-reg/trip-driver/driver-feedback-by-ratingNo/${as}/${0.1}/${5}`,
      ));
      settotalCount(t1?.data?.data?.length);
    } catch (err) {}
    try {
      tem = await axios.get(
        Api.baseUri +
          `/user-reg/trip-driver/driver-feedback-by-ratingNo/${as}/${0.1}/${1}`,
      );
    } catch (err) {}
    try {
      tem1 = await axios.get(
        Api.baseUri +
          `/user-reg/trip-driver/driver-feedback-by-ratingNo/${as}/${1.1}/${2}`,
      );
    } catch (err) {}
    try {
      tem2 = await axios.get(
        Api.baseUri +
          `/user-reg/trip-driver/driver-feedback-by-ratingNo/${as}/${2.1}/${3}`,
      );
    } catch (err) {}
    try {
      tem3 = await axios.get(
        Api.baseUri +
          `/user-reg/trip-driver/driver-feedback-by-ratingNo/${as}/${3.1}/${4}`,
      );
    } catch (err) {}
    try {
      tem4 = await axios.get(
        Api.baseUri +
          `/user-reg/trip-driver/driver-feedback-by-ratingNo/${as}/${4.1}/${5}`,
      );
    } catch (err) {}
    setGradeRating({
      excellent: tem4?.data?.data?.length || 0,
      good: tem3?.data?.data?.length || 0,
      average: tem2?.data?.data?.length || 0,
      belowAvg: tem1?.data?.data?.length || 0,
      poor: tem?.data?.data?.length || 0,
    });
  }
  useEffect(() => {
    if (!accordSel) return;
    getAllFeed(accordSel);
    axios
      .get(Api.baseUri + `/user-reg/driver-feedback/get-all-driver-feedback`)
      .then((res) => {
        getMyData(res);
      })
      .catch((err) => {
        setFeedTopics([]);
      });
  }, [accordSel]);
  async function getMyData(res) {
    let myArr = await Promise.all(
      res?.data?.data?.map(async (el) => {
        let _res = await axios.get(
          Api.baseUri +
            `/user-reg/trip-driver/feedbackCategory-average-rating/${accordSel}/${el.id}`,
        );
        let tem_ = {
          ratings: _res?.data?.data,
          topic: el?.categoryName,
        };
        return tem_;
      }),
    );
    setFeedTopics(myArr);
  }

  return (
    <div style={{background: 'white'}}>
      <Typography sx={{padding: '20px'}} component='h3' variant='h3'>
        {'Vendors'}
      </Typography>
      <div style={{margin: '6px', background: '#f5f7fe'}}>
        <Accordion
          style={{boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px'}}
          expanded={false}
        >
          <AccordionSummary
            aria-controls='panel1a-content'
            expandIcon={
              <span style={{opacity: 0}}>
                <CustomExpandIcon />
              </span>
            }
            id='panel1a-header'
          >
            <Grid container spacing={2}>
              <Grid item xs={1}>
                <Typography className='feed-border-right'>S.NO.</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography className='feed-border-right'>Vendor</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography className='feed-border-right'>
                  Vendor Code
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography className='feed-border-right'>Mobile</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography className='feed-border-right'>Email</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography className='feed-border-right'>
                  Overall Rating
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  style={{border: 'none'}}
                  className='feed-border-right'
                >
                  Action
                </Typography>
              </Grid>
            </Grid>
          </AccordionSummary>
        </Accordion>
        {myData?.map((el, ind) => {
          if (user?.userList?.userRole == 'VENDOR') {
            if (el.id != user?.userList?.profileId) return;
            else {
              if (el.id != accordSel) setAccordSel(el.id);
            }
          }
          return (
            <Accordion
              expanded={
                user?.userList?.userRole == 'VENDOR'
                  ? true
                  : accordSel == el.id
                  ? true
                  : false
              }
              style={{
                margin: '5px',
                borderBottomLeftRadius: '7px',
                borderBottomRightRadius: '7px',
                boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
              }}
            >
              <AccordionSummary
                expandIcon={
                  user?.userList?.userRole !== 'VENDOR' ? (
                    <CustomExpandIcon />
                  ) : (
                    ''
                  )
                }
                aria-controls='panel1a-content'
                id='panel1a-header'
                onClick={(e) => {
                  if (accordSel != el.id) setAccordSel(el.id);
                  else setAccordSel(null);
                }}
              >
                <Grid container spacing={2}>
                  <Grid item style={{overflow: 'hidden'}} xs={1}>
                    <Typography>{ind + 1}</Typography>
                  </Grid>
                  <Grid item style={{overflow: 'hidden'}} xs={2}>
                    <Typography>{el?.vendorName}</Typography>
                  </Grid>
                  <Grid item style={{overflow: 'hidden'}} xs={2}>
                    <Typography>{el?.vendorCode}</Typography>
                  </Grid>
                  <Grid item style={{overflow: 'hidden'}} xs={2}>
                    <Typography>{el?.mobileNo}</Typography>
                  </Grid>
                  <Grid item style={{overflow: 'hidden'}} xs={2}>
                    <Typography>{el?.emailId}</Typography>
                  </Grid>
                  <Grid item style={{overflow: 'hidden'}} xs={2}>
                    <Typography>
                      <StarRatings
                        rating={
                          el?.averageRating &&
                          !_.isNaN(Number(el.averageRating))
                            ? el.averageRating
                            : 0
                        }
                        starRatedColor='#FFDF00'
                        starDimension={'16px'}
                        starSpacing={'2px'}
                        // changeRating={this.changeRating}
                        numberOfStars={5}
                        name='rating'
                      />
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography>Action</Typography>
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails sx={{borderTop: '1px solid #d8d8d8'}}>
                <Grid
                  container
                  spacing={2}
                  sx={{
                    mt: 2,
                    borderBottom: '1px solid #d7d7d7',
                    paddingBottom: '10px',
                  }}
                >
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={5}
                    style={{paddingLeft: '20px'}}
                  >
                    <h2 style={{color: '#0b6282', paddingLeft: '16px'}}>
                      Overall Rating
                    </h2>
                    <Grid container spacing={2} className='rating-right-sec'>
                      <Grid item sm={2} md={2}>
                        {el?.averageRating && !_.isNaN(Number(el.averageRating))
                          ? el.averageRating?.toFixed(2)
                          : 0}
                      </Grid>
                      <Grid
                        item
                        xs={10}
                        sm={10}
                        md={10}
                        style={{paddingLeft: '20px'}}
                      >
                        <StarRatings
                          rating={
                            el?.averageRating &&
                            !_.isNaN(Number(el.averageRating))
                              ? el.averageRating
                              : 0
                          }
                          starRatedColor='#FFDF00'
                          starDimension={'24px'}
                          starSpacing={'2px'}
                          // changeRating={this.changeRating}
                          numberOfStars={5}
                          name='rating'
                        />
                      </Grid>
                    </Grid>
                    <h4 style={{paddingLeft: '18px', color: '#a4a4a4'}}>
                      based on{' '}
                      {el?.noOfDrivers && !_.isNaN(Number(el.noOfDrivers))
                        ? el.noOfDrivers
                        : 0}{' '}
                      reviews
                    </h4>
                  </Grid>
                  <Grid item xs={12} sm={12} md={7}>
                    <Grid container spacing={2} className='grey-font'>
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        className='progress-bar-grid'
                      >
                        <Grid container spacing={2}>
                          <Grid item sm={5} md={5}>
                            <span
                              className='pointer hyperlink'
                              onClick={() => {
                                clickedFunc('EXCELLENT');
                              }}
                            >
                              Excellent
                            </span>
                          </Grid>
                          <Grid item sm={6} md={6}>
                            <BorderLinearProgress
                              value={
                                gradeRating.excellent
                                  ? (gradeRating.excellent * 100) / totalCount
                                  : 0
                              }
                              variant='determinate'
                            />
                          </Grid>
                          <Grid item sm={1} md={1}>
                            {gradeRating.excellent || 0}
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        className='progress-bar-grid'
                      >
                        <Grid container spacing={2}>
                          <Grid item sm={5} md={5}>
                            <span
                              className='pointer hyperlink'
                              onClick={() => {
                                clickedFunc('GOOD');
                              }}
                            >
                              Good
                            </span>
                          </Grid>
                          <Grid item sm={6} md={6}>
                            <BorderLinearProgress2
                              value={
                                gradeRating.good
                                  ? (gradeRating.good * 100) / totalCount
                                  : 0
                              }
                              variant='determinate'
                            />
                          </Grid>
                          <Grid item sm={1} md={1}>
                            {gradeRating.good || 0}
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        className='progress-bar-grid'
                      >
                        <Grid container spacing={2}>
                          <Grid item sm={5} md={5}>
                            <span
                              className='pointer hyperlink'
                              onClick={() => {
                                clickedFunc('AVERAGE');
                              }}
                            >
                              Average
                            </span>
                          </Grid>
                          <Grid item sm={6} md={6}>
                            <BorderLinearProgress3
                              value={
                                gradeRating.average
                                  ? (gradeRating.average * 100) / totalCount
                                  : 0
                              }
                              variant='determinate'
                            />
                          </Grid>
                          <Grid item sm={1} md={1}>
                            {gradeRating.average || 0}
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        className='progress-bar-grid'
                      >
                        <Grid container spacing={2}>
                          <Grid item sm={5} md={5}>
                            <span
                              className='pointer hyperlink'
                              onClick={() => {
                                clickedFunc('BELOW AVERAGE');
                              }}
                            >
                              Below Average
                            </span>
                          </Grid>
                          <Grid item sm={6} md={6}>
                            <BorderLinearProgress4
                              value={
                                gradeRating.belowAvg
                                  ? (gradeRating.belowAvg * 100) / totalCount
                                  : 0
                              }
                              variant='determinate'
                            />
                          </Grid>
                          <Grid item sm={1} md={1}>
                            {gradeRating.belowAvg || 0}
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        className='progress-bar-grid'
                      >
                        <Grid container spacing={2}>
                          <Grid item sm={5} md={5}>
                            <span
                              className='pointer hyperlink'
                              onClick={() => {
                                clickedFunc('POOR');
                              }}
                            >
                              Poor
                            </span>
                          </Grid>
                          <Grid item sm={6} md={6}>
                            <BorderLinearProgress5
                              value={
                                gradeRating.poor
                                  ? (gradeRating.poor * 100) / totalCount
                                  : 0
                              }
                              variant='determinate'
                            />
                          </Grid>
                          <Grid item sm={1} md={1}>
                            {gradeRating.poor || 0}
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <div style={{padding: '20px'}}>
                  <h3 style={{color: '#0b6282', fontWeight: 600}}>
                    FeedBack Summary
                  </h3>
                  <div style={{marginLeft: '10px', marginTop: '10px'}}>
                    <h3 style={{fontWeight: 500}}>
                      Personal Skills and Competencies
                    </h3>
                    <Grid sx={{mt: 1}} container spacing={2}>
                      {feedTopics?.map((ele) => {
                        return (
                          <Grid item sm={6} md={6}>
                            <Grid sx={{}} container spacing={2}>
                              <Grid item sm={5} md={5} className='grey-font'>
                                {ele?.topic}
                              </Grid>
                              <Grid item sm={1} md={1}>
                                ({Number(ele?.ratings)?.toFixed(2)})
                              </Grid>
                              <Grid item sm={6} md={6}>
                                <StarRatings
                                  rating={ele?.ratings}
                                  starRatedColor='#FFDF00'
                                  starDimension={'22px'}
                                  starSpacing={0}
                                  // changeRating={this.changeRating}
                                  numberOfStars={5}
                                  name='rating'
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </div>
      {user?.userList?.userRole == 'VENDOR' && <VendorEmployeeTable />}
    </div>
  );
};

export default OverviewFeedBack;
