import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import WarningIcon from '@mui/icons-material/Warning';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import Api from '@api';
import moment from 'moment';
import axios from 'axios';
import PhoneIcon from '@mui/icons-material/Phone';
import {
  Table,
  Grid,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Avatar,
} from '@mui/material';
const Complaince = ({tripInfo, ticketInfo}) => {
  console.log('tripInfo', tripInfo);
  const [value, setValue] = React.useState('1');
  const [driverCompliance, setDriverComplaince] = useState();
  const [vehicleCompliance, setVehicleCompliance] = useState();
  const [index, setIndex] = useState();
  const handleChange = (e, newValue) => {
    setValue(newValue);
  };
  const header = ['Title', 'Action'];

  useEffect(() => {
    axios
      .get(Api.baseUri + `/user-reg/driver-reg/${tripInfo?.driverId}`)
      .then((res) => {
        if (res?.data?.status == '200') {
          setDriverComplaince(
            res?.data?.data?.compliancesDto?.complianceTopics,
          );
        }
      });
  }, [tripInfo?.driverId]);

  useEffect(() => {
    axios
      .get(Api.baseUri + `/user-reg/vehicle-reg/645cb7935115e85968472067`)
      .then((res) => {
        if (res?.data?.status == '200') {
          setVehicleCompliance(
            res?.data?.data?.compliancesDto?.complianceTopics,
          );
        }
      });
  }, [tripInfo?.vehicleId]);

  return (
    <div>
      <Grid container>
        <Grid item md={3} sx={{border: '1px solid rgba(224, 224, 224, 1)'}}>
          <Grid container>
            <Grid md={12} sx={{padding: '10px'}}>
              <Box
                sx={{
                  borderBottom: '1px solid rgba(224, 224, 224, 1)',
                  borderBottomStyle: 'dashed  ',
                  padding: '10px',
                }}
              >
                <Box
                  component='h3'
                  sx={{
                    fontWeight: 600,
                    fontSize: 16,
                    textAlign: 'left',
                    lineHeight: 1,
                    marginBottom: '10px',
                  }}
                >
                  {ticketInfo?.ticketForName}
                </Box>
                <Box>{ticketInfo?.departmentName}</Box>
                <Box>{ticketInfo?.emailId}</Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '15px',
                  }}
                >
                  {ticketInfo?.mobileNo}{' '}
                  <PhoneIcon
                    sx={{
                      fontSize: 'medium',
                      fontWeight: '600',
                      marginLeft: '10px',
                    }}
                  />
                </Box>
              </Box>
            </Grid>
            <Grid md={12}>
              <Box sx={{padding: '10px'}}>
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: '800',
                    color: '#909497',
                  }}
                >
                  Assign To
                </p>
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                  <Avatar
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      m: '0',
                      mr: 2,
                      height: 25,
                      width: 25,
                      border: '1px solid #D7DBDD',
                      backgroundColor: 'white',
                      marginRight: '10px',
                    }}
                  ></Avatar>
                  <p style={{fontSize: '12px', fontWeight: '800'}}>
                    {ticketInfo?.assignedAt || 'NA'}
                  </p>
                </Box>
              </Box>
              <Box sx={{padding: '10px'}}>
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: '800',
                    color: '#909497',
                  }}
                >
                  Status
                </p>
                <p style={{fontSize: '12px', fontWeight: '800'}}>
                  {ticketInfo?.status || 'NA'}
                </p>
              </Box>
              <Box sx={{padding: '10px'}}>
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: '800',
                    color: '#909497',
                  }}
                >
                  Due Date
                </p>
                <p style={{fontSize: '12px', fontWeight: '800'}}>
                  {ticketInfo?.dueDate || 'NA'}
                </p>
              </Box>
              <Box sx={{padding: '10px'}}>
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: '800',
                    color: '#909497',
                  }}
                >
                  Phone Number
                </p>
                <p style={{fontSize: '12px', fontWeight: '800'}}>
                  {ticketInfo?.mobileNo || 'NA'}
                </p>
              </Box>
              <Box sx={{padding: '10px'}}>
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: '800',
                    color: '#E74C3C',
                  }}
                >
                  Incident Type
                </p>
                <p style={{fontSize: '12px', fontWeight: '800'}}>SOS</p>
              </Box>
              <Box sx={{padding: '10px'}}>
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: '800',
                    color: '#E74C3C',
                  }}
                >
                  Channel
                </p>
                <p style={{fontSize: '12px', fontWeight: '800'}}>
                  {ticketInfo?.channelName || 'NA'}
                </p>
              </Box>
              <Box sx={{padding: '10px'}}>
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: '800',
                    color: '#E74C3C',
                  }}
                >
                  Classification
                </p>
                <p style={{fontSize: '12px', fontWeight: '800'}}>
                  {ticketInfo?.classification || 'NA'}
                </p>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={9} sx={{border: '1px solid rgba(224, 224, 224, 1)'}}>
          <Box sx={{width: '100%', typography: 'body1'}}>
            <TabContext value={value}>
              <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                <TabList
                  onChange={handleChange}
                  aria-label='lab API tabs example'
                >
                  <Tab label='Driver' value='1' />
                  <Tab label='Vehicle' value='2' />
                </TabList>
              </Box>
            </TabContext>
          </Box>
          {value == 1 && (
            <Grid container gap={6} sx={{padding: '20px'}}>
              {driverCompliance?.map((el, ind) => {
                return (
                  <Grid item md={12} sx={{borderBottom: '2px solid green'}}>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls='panel1a-content'
                        id='panel1a-header'
                        // onClick={() => {
                        //   console.log('index', ind);
                        //   setIndex(ind);
                        // }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div style={{display: 'flex'}}>
                            <div
                              style={{
                                width: '50px',
                                aspectRatio: '1 / 1',
                                borderRadius: '50%',
                                border: '1px solid',
                              }}
                            ></div>
                            <Typography
                              sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontWeight: '800',
                                marginLeft: '10px',
                              }}
                            >
                              {el?.topicName}
                            </Typography>
                          </div>
                          <div style={{display: 'flex', marginLeft: '60px'}}>
                            <WarningIcon
                              sx={{color: 'green', marginTop: '10px'}}
                            />
                            <Typography
                              sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontWeight: '800',
                                marginLeft: '10px',
                                color: 'green',
                              }}
                            >
                              {moment(
                                el?.complianceSubTopicList?.[0]?.fileName,
                              ).format('DD-MM-YYYY')}
                            </Typography>
                          </div>
                        </div>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Table aria-label='simple table'>
                          <TableHead>
                            <TableRow>
                              {header?.map((el) => {
                                return (
                                  <TableCell sx={{fontWeight: '800'}}>
                                    {el}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell> Validity </TableCell>
                              <TableCell sx={{display: 'flex'}}>
                                <CalendarMonthIcon />
                                <p style={{marginLeft: '10px'}}>
                                  {moment(
                                    el?.complianceSubTopicList?.[0]?.fileName,
                                  ).format('DD-MM-YYYY')}
                                </p>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell> Document </TableCell>
                              <TableCell style={{display: 'flex'}}>
                                <SaveAltIcon />
                                <p style={{marginLeft: '10px'}}>
                                  <a>
                                    {' '}
                                    {el?.complianceSubTopicList?.[1]?.fileName?.slice(
                                      20,
                                    )}
                                  </a>
                                </p>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </AccordionDetails>
                    </Accordion>
                  </Grid>
                );
              })}
            </Grid>
          )}

          {value == 2 && (
            <Grid container gap={6} sx={{padding: '20px'}}>
              {vehicleCompliance?.map((el, ind) => {
                return (
                  <Grid item md={12} sx={{borderBottom: '2px solid green'}}>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls='panel1a-content'
                        id='panel1a-header'
                        // onClick={() => {
                        //   console.log('index', ind);
                        //   setIndex(ind);
                        // }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div style={{display: 'flex'}}>
                            <div
                              style={{
                                width: '50px',
                                aspectRatio: '1 / 1',
                                borderRadius: '50%',
                                border: '1px solid',
                              }}
                            ></div>
                            <Typography
                              sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontWeight: '800',
                                marginLeft: '10px',
                              }}
                            >
                              {el?.topicName}
                            </Typography>
                          </div>
                          <div style={{display: 'flex', marginLeft: '60px'}}>
                            <WarningIcon
                              sx={{color: 'green', marginTop: '10px'}}
                            />
                            <Typography
                              sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontWeight: '800',
                                marginLeft: '10px',
                                color: 'green',
                              }}
                            >
                              {moment(
                                el?.complianceSubTopicList?.[1]?.fileName,
                              ).format('DD-MM-YYYY')}
                            </Typography>
                          </div>
                        </div>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Table aria-label='simple table'>
                          <TableHead>
                            <TableRow>
                              {header?.map((el) => {
                                return (
                                  <TableCell sx={{fontWeight: '800'}}>
                                    {el}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell> Validity </TableCell>
                              <TableCell sx={{display: 'flex'}}>
                                <CalendarMonthIcon />
                                <p style={{marginLeft: '10px'}}>
                                  {moment(
                                    el?.complianceSubTopicList?.[0]?.fileName,
                                  ).format('DD-MM-YYYY')}
                                </p>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell> Document </TableCell>
                              <TableCell style={{display: 'flex'}}>
                                <SaveAltIcon />
                                <p style={{marginLeft: '10px'}}>
                                  <a>
                                    {' '}
                                    {el?.complianceSubTopicList?.[1]?.fileName?.slice(
                                      20,
                                    )}
                                  </a>
                                </p>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </AccordionDetails>
                    </Accordion>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default Complaince;
