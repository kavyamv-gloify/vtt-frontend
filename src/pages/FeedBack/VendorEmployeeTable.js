import React, {useState, useEffect} from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  useStepContext,
} from '@mui/material';
import moment from 'moment';
import axios from 'axios';
import Api from '@api';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StarRatings from 'react-star-ratings';
import LinearProgress, {
  linearProgressClasses,
} from '@mui/material/LinearProgress';
import {styled} from '@mui/material/styles';
import {useAuthUser} from '@crema/utility/AuthHooks';
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
const VendorEmployeeTable = (clickedFunc) => {
  const [employeeData, setEmployeeData] = useState();
  const itemsPerPage = 10;
  const [page, setPage] = useState(1);
  const [totalCount, settotalCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [catdata, setCatData] = React.useState({});
  const [driverData, setDriverData] = useState();
  const [driverId, setDriverId] = useState();
  const [gradeRating, setGradeRating] = useState();
  const {user} = useAuthUser();
  useEffect(() => {
    axios
      .get(
        Api.baseUri +
          `/user-reg/trip-driver/driver-feedback-by-ratingNo/${user?.userList?.profileId}/0.1/5`,
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          setDriverData(res?.data?.data);
        }
      })
      .catch((err) => {});
  }, []);

  function getName(d) {
    let n = [];
    d?.map((el) => {
      n.push(catdata[el]);
    });
    return n?.join(', ');
  }
  useEffect(() => {
    axios
      .get(Api.baseUri + `/user-reg/driver-feedback/get-all-driver-feedback`)
      .then((res) => {
        let ob = {};
        res?.data?.data?.map((el) => {
          ob[el.id] = el.categoryName;
        });
        setCatData(ob || {});
      })
      .catch((err) => {
        setCatData({});
      });
  }, []);
  const header = ['Driver Name', 'Mobile No.', 'Email Id', 'OverAll Rating'];
  function getAllD(page_, rowsPerPage_) {
    let postData = {
      pageNo: page_,
      pageSize: rowsPerPage_,
      passengerId: '',
      ratingFrom: 0,
      ratingTo: 5,
      tripId: '',
    };
    axios
      .post(
        Api.baseUri + '/user-reg/trip-driver/get-all-passenger-feedback',
        postData,
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          setEmployeeData(res?.data?.data?.body?.ratingList);
          // settotalCount(res?.data?.data?.body?.totalItems ?? 0)
        }
      })
      .catch((err) => {
        setEmployeeData([]);
      });
  }
  // useEffect(() => {
  //     getAllD(page, rowsPerPage)
  // }, [page])
  // useEffect(() => {
  //     getAllD(0, rowsPerPage)
  // }, [rowsPerPage])
  const handleChangePage = (e, v) => {
    setPage(v);
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(e.target.value);
    setPage(0);
  };
  async function getAllFeed(as) {
    let tem, tem1, tem2, tem3, tem4;
    try {
      let t1 = (tem = await axios.get(
        Api.baseUri +
          `/user-reg/trip-driver/driver-feedbacks-by-ratingNo/${as}/${0.1}/${5}`,
      ));
      settotalCount(t1?.data?.data?.length);
    } catch (err) {}
    try {
      tem = await axios.get(
        Api.baseUri +
          `/user-reg/trip-driver/driver-feedbacks-by-ratingNo/${as}/${0.1}/${1}`,
      );
    } catch (err) {}
    try {
      tem1 = await axios.get(
        Api.baseUri +
          `/user-reg/trip-driver/driver-feedbacks-by-ratingNo/${as}/${1.1}/${2}`,
      );
    } catch (err) {}
    try {
      tem2 = await axios.get(
        Api.baseUri +
          `/user-reg/trip-driver/driver-feedbacks-by-ratingNo/${as}/${2.1}/${3}`,
      );
    } catch (err) {}
    try {
      tem3 = await axios.get(
        Api.baseUri +
          `/user-reg/trip-driver/driver-feedbacks-by-ratingNo/${as}/${3.1}/${4}`,
      );
    } catch (err) {}
    try {
      tem4 = await axios.get(
        Api.baseUri +
          `/user-reg/trip-driver/driver-feedbacks-by-ratingNo/${as}/${4.1}/${5}`,
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
    if (!driverId) {
      return;
    }
    getAllFeed(driverId);
  }, [driverId]);
  return (
    <div>
      {' '}
      <div className='box2-tab1' style={{marginTop: '25px'}}>
        <div
          style={{
            paddingTop: '20px',
            marginBottom: '20px',
            fontSize: '18px',
            marginLeft: '5px',
            fontWeight: 600,
          }}
        >
          <span style={{borderBottom: '4px solid orange'}}>Driver</span>
        </div>
        <hr />
        {/* <TableContainer style={{ boxShadow: "rgba(0, 0, 0, 0) 0px 2px 4px, rgba(0, 0, 0, 0) 0px 7px 13px -3px, rgb(0,102,133) 0px -3px 0px inset" }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead style={{ background: "#f1f1f1" }}>
                        <TableRow>
                            {header?.map(el => {
                                return (<TableCell> {el} </TableCell>)
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {employeeData?.map((el, i) => {
                            //  
                            return (
                                <TableRow style={{ background: (i % 2) == 0 ? '' : '#f5f7ff' }}>
                                    <TableCell> {el?.tripCode || '-'} </TableCell>
                                    <TableCell> {el?.driverName} </TableCell>
                                    <TableCell> {el?.name || 'NA'}{' - ' + (el?.empCode || 'NA')}  </TableCell>
                                    <TableCell> {el?.shiftTime || '-'} </TableCell>
                                    <TableCell> {(el.tripType == 'UPTRIP') ? 'Login' : (el.tripType == 'DOWNTRIP') ? 'Logout' : el.tripType} </TableCell>
                                    <TableCell> {moment(el.tripDate).format('DD/MM/YYYY')} </TableCell>
                                    <TableCell> {el?.driverFeedbackCategories ? getName(el?.driverFeedbackCategories) : '-'} </TableCell>
                                    <TableCell> {el?.passRating ?? '-'} </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                colSpan={8}
                                count={Math.ceil(totalCount / itemsPerPage)}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                // defaultPage={0}
                                SelectProps={{
                                    inputProps: {
                                        'aria-label': 'rows per page',
                                    },
                                    native: true,
                                }}
                                onChange={(e, v) => {   }}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            // ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer> */}
        <Accordion expanded={false}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon style={{opacity: 0}} />}
            aria-controls='panel1a-content'
            id='panel1a-header'
          >
            <Grid container spacing={2}>
              {header?.map((el) => {
                return (
                  <Grid item sm={3} md={3}>
                    <Typography style={{fontWeight: '900'}}>{el}</Typography>
                  </Grid>
                );
              })}
            </Grid>
          </AccordionSummary>
        </Accordion>
        {driverData?.map((el) => {
          return (
            <Accordion expanded={driverId == el?.id ? true : false}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls='panel1a-content'
                id='panel1a-header'
                onClick={() => {
                  if (driverId != el?.id) setDriverId(el?.id);
                  else setDriverId(null);
                }}
              >
                <Grid container spacing={2}>
                  <Grid item sm={3} md={3}>
                    <Typography>{el?.firstName + el?.lastName}</Typography>
                  </Grid>
                  <Grid item sm={3} md={3}>
                    <Typography>{el?.mobileNo}</Typography>
                  </Grid>
                  <Grid item sm={3} md={3}>
                    <Typography>{el?.emailId}</Typography>
                  </Grid>
                  <Grid item sm={3} md={3}>
                    <Typography>{el?.averageRating}</Typography>
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails style={{borderTop: '1px solid #d7d7d7'}}>
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
                      based on {totalCount} reviews
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
                                gradeRating?.excellent
                                  ? (gradeRating?.excellent * 100) / totalCount
                                  : 0
                              }
                              variant='determinate'
                            />
                          </Grid>
                          <Grid item sm={1} md={1}>
                            {gradeRating?.excellent || 0}
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
                                gradeRating?.good
                                  ? (gradeRating?.good * 100) / totalCount
                                  : 0
                              }
                              variant='determinate'
                            />
                          </Grid>
                          <Grid item sm={1} md={1}>
                            {gradeRating?.good || 0}
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
                                gradeRating?.average
                                  ? (gradeRating?.average * 100) / totalCount
                                  : 0
                              }
                              variant='determinate'
                            />
                          </Grid>
                          <Grid item sm={1} md={1}>
                            {gradeRating?.average || 0}
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
                                gradeRating?.belowAvg
                                  ? (gradeRating?.belowAvg * 100) / totalCount
                                  : 0
                              }
                              variant='determinate'
                            />
                          </Grid>
                          <Grid item sm={1} md={1}>
                            {gradeRating?.belowAvg || 0}
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
                                gradeRating?.poor
                                  ? (gradeRating?.poor * 100) / totalCount
                                  : 0
                              }
                              variant='determinate'
                            />
                          </Grid>
                          <Grid item sm={1} md={1}>
                            {gradeRating?.poor || 0}
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </div>
    </div>
  );
};

export default VendorEmployeeTable;
