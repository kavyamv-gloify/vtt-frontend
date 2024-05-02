import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Box,
  Avatar,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import {Typography} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Api from '@api';
import axios from 'axios';
const SelfConsent = ({ticketInfo}) => {
  return (
    <div>
      <Grid container>
        <Grid md={3} sx={{border: '1px solid rgba(224, 224, 224, 1)'}}>
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
                    {ticketInfo?.ticketForName}
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
                  {ticketInfo?.status || "NA"}
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
                  {ticketInfo?.dueDate || "NA"}
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
                  {ticketInfo?.mobileNo || "NA"}
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
                  {ticketInfo?.channelName || "NA"}
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
                  {ticketInfo?.classification || "NA"}
                </p>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={9} sm={12} xs={12}>
          <div style={{marginTop: '20px', padding: '20px'}}>
            <Accordion>
              <AccordionSummary
                expandIcon={<AddCircleOutlineIcon />}
                aria-controls='panel1a-content'
                id='panel1a-header'
              >
                <Grid container>
                  <Grid item xs={6} md={6}>
                    <Typography style={{fontWeight: 'bold'}}>
                      Driver is wearing a face convering or mask
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography>
                      <img
                        src={'/assets/images/yesIcon.png'}
                        style={{
                          width: '20px',
                          opacity:
                            ticketInfo?.driverConsent?.wearingFaceMask == 'Yes'
                              ? ' '
                              : '0.3',
                        }}
                        onClick={(eve) => {
                          eve.stopPropagation();
                        }}
                      />
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography>
                      <img
                        src={'/assets/images/NoIcon.png'}
                        style={{
                          width: '20px',
                          opacity:
                            ticketInfo?.driverConsent?.wearingFaceMask == 'No'
                              ? ' '
                              : '0.3',
                        }}
                        onClick={(eve) => {
                          eve.stopPropagation();
                        }}
                      />
                    </Typography>
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container>
                  <Grid item xs={6} md={6}>
                    <Typography> Photo without Mask</Typography>
                    <img
                      id='ll'
                      src={
                        Api.imgUrl + ticketInfo?.driverConsent?.withMaskPhoto
                      }
                      alt='No File'
                    />
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <Typography>Photo with Mask </Typography>
                    <img
                      id='ll2'
                      src={
                        Api.imgUrl + ticketInfo?.driverConsent?.withOutMaskPhoto
                      }
                      alt='No File'
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary
                // expandIcon={<AddCircleOutlineIcon />}
                aria-controls='panel1a-content'
                id='panel1a-header'
              >
                <Grid container>
                  <Grid item xs={6} md={6}>
                    <Typography style={{fontWeight: 'bold'}}>
                      Driver won't drive if he/she may have COVID-19 or related
                      Symptoms
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography>
                      <img
                        src={'/assets/images/yesIcon.png'}
                        style={{
                          width: '20px',
                          opacity:
                            ticketInfo?.driverConsent?.relatedSystoms == 'Yes'
                              ? ' '
                              : '0.3',
                        }}
                        onClick={(eve) => {
                          eve.stopPropagation();
                        }}
                      />
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography>
                      <img
                        src={'/assets/images/NoIcon.png'}
                        style={{
                          width: '20px',
                          opacity:
                            ticketInfo?.driverConsent?.relatedSystoms == 'No'
                              ? ' '
                              : '0.3',
                        }}
                        onClick={(eve) => {
                          eve.stopPropagation();
                        }}
                      />
                    </Typography>
                  </Grid>
                </Grid>
              </AccordionSummary>
              {/* <AccordionDetails>
                <Typography>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                  eget.
                </Typography>
              </AccordionDetails> */}
            </Accordion>

            <Accordion>
              <AccordionSummary
                // expandIcon={<AddCircleOutlineIcon />}
                aria-controls='panel1a-content'
                id='panel1a-header'
              >
                <Grid container>
                  <Grid item xs={6} md={6}>
                    <Typography style={{fontWeight: 'bold'}}>
                      Driver sanitised his/her vehicle today
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography>
                      <img
                        src={'/assets/images/yesIcon.png'}
                        style={{
                          width: '20px',
                          opacity:
                            ticketInfo?.driverConsent?.sanitizedVehicle == 'Yes'
                              ? ' '
                              : '0.3',
                        }}
                        onClick={(eve) => {
                          eve.stopPropagation();
                        }}
                      />
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography>
                      <img
                        src={'/assets/images/NoIcon.png'}
                        style={{
                          width: '20px',
                          opacity:
                            ticketInfo?.driverConsent?.sanitizedVehicle == 'No'
                              ? ' '
                              : '0.3',
                        }}
                        onClick={(eve) => {
                          eve.stopPropagation();
                        }}
                      />
                    </Typography>
                  </Grid>
                </Grid>
              </AccordionSummary>
              {/* <AccordionDetails>
                <Typography>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                  eget.
                </Typography>
              </AccordionDetails> */}
            </Accordion>

            <Accordion>
              <AccordionSummary
                // expandIcon={<AddCircleOutlineIcon />}
                aria-controls='panel1a-content'
                id='panel1a-header'
              >
                <Grid container>
                  <Grid item xs={6} md={6}>
                    <Typography style={{fontWeight: 'bold'}}>
                      Driver won't drive if he/she may have COVID-19
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography>
                      <img
                        src={'/assets/images/yesIcon.png'}
                        style={{
                          width: '20px',
                          opacity:
                            ticketInfo?.driverConsent?.haveCovid == 'Yes'
                              ? ' '
                              : '0.3',
                        }}
                        onClick={(eve) => {
                          eve.stopPropagation();
                        }}
                      />
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography>
                      <img
                        src={'/assets/images/NoIcon.png'}
                        style={{
                          width: '20px',
                          opacity:
                            ticketInfo?.driverConsent?.haveCovid == 'No'
                              ? ' '
                              : '0.3',
                        }}
                        onClick={(eve) => {
                          eve.stopPropagation();
                        }}
                      />
                    </Typography>
                  </Grid>
                </Grid>
              </AccordionSummary>
              {/* <AccordionDetails>
                <Typography>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                  eget.
                </Typography>
              </AccordionDetails> */}
            </Accordion>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default SelfConsent;
