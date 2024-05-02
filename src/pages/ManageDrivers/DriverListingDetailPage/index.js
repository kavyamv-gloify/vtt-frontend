/* eslint-disable */
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import SmartForm from '@smart-form';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import {useAuthUser} from '@crema/utility/AuthHooks';
import VerifiedIcon from '@mui/icons-material/Verified';
import api from '@api';
import styled from 'styled-components';
import {Box, Table, TableCell, TableRow} from '@mui/material';
import {Button} from '@mui/material';
import {Grid} from '@mui/material';
// import { Icon } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import styles from './style.module.css';
import downDoc from '@common/fileDownload';
import {borderRadius} from '@mui/system';
import moment from 'moment';

const DetailForm = ({id, close}) => {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [vendorName, setVendorName] = useState();
  // const { id } = useParams();
  const {user} = useAuthUser();

  useEffect(() => {
    async function fetchData() {
      let baseURL;
      if (user?.role == 'CORPORATEADMIN') {
        baseURL = `${api.driver.list}/${id}`;
      }
      if (user?.role == 'VENDOR') {
        baseURL = `${api.driver.list}/${id}`;
      }
      let response = await axios.get(baseURL);
      axios
        .get(
          api.baseUri +
            '/user-reg/vendor-reg/' +
            response?.data?.data?.vendorId,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            setVendorName(
              res?.data?.data?.contactPersonFirstName +
                ' ' +
                res?.data?.data?.contactPersonLastName,
            );
          }
        });

      setData(response.data.data);
    }
    fetchData();
  }, [id]);

  function onCancel() {
    navigate(`/onboardadmin/driver/driver-listing`);
    close();
  }

  function downloadReg(d) {
    if (typeof d == 'string') downDoc?.downloadDoc(d);
    else {
      d?.map((el) => {
        downDoc?.downloadDoc(el);
      });
    }
  }

  // const styles = {
  //   parentcontainer: {
  //     backgroundColor: 'rgba(255, 255, 255, 0.8)',
  //     border: '1px solid rgb(154, 152, 152)',
  //     borderRadius: '11px',
  //     padding: '20px',
  //     marginTop: '25px',
  //   },

  //   container: {
  //     display: 'grid',
  //     // grid-template-columns: "auto auto auto auto",
  //     backgroundColor: 'grey',
  //     padding: '1px',
  //   },
  //   title: {
  //     fontWeight: 'bold',
  //     border: '0px',
  //     padding: '15px',
  //     fontSize: '12px',
  //     textAlign: 'left',
  //     fontWeight: 'bold',
  //   },
  //   item: {
  //     // fontWeight: "bold",
  //     border: '0px',
  //     padding: '15px',
  //     fontSize: '12px',
  //     textAlign: 'left',
  //   },
  // };

  return (
    <>
      <div style={{textAlign: 'left'}}>
        <div className={styles.abs}>
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <span>
                <img
                  style={{
                    width: '100px',
                    height: '110px',
                    borderRadius: '8px',
                    margin: '18px',
                  }}
                  src={api.imgUrl + data?.photo}
                  onError={(event) =>
                    (event.target.src =
                      data.gender?.toUpperCase()?.trim() == 'FEMALE'
                        ? '/assets/images/female.webp'
                        : '/assets/images/placeholder.jpg')
                  }
                />
              </span>
            </Grid>
            <Grid item xs={10}>
              <span>
                <div className={styles.gridcontainers2}>
                  <div className={styles.gridtitle}>Address</div>
                  <div className={styles.griditem}>
                    {data.address?.addressName?.split('++')?.join(', ')}
                  </div>
                  <div className={styles.gridtitle}>Email Id</div>
                  <div style={{display: 'flex', alignItems: 'center'}}>
                    <div className={styles.griditem}>
                      {data.emailId || 'NA'}
                    </div>
                    {data?.profileStatus == 'ACTIVE' && data.emailId && (
                      <VerifiedIcon
                        sx={{ml: 2, color: 'green', fontSize: '16px'}}
                      />
                    )}
                  </div>
                  <div className={styles.gridtitle}>First Name</div>
                  <div className={styles.griditem}>{data.firstName}</div>
                  <div className={styles.gridtitle}>Last Name</div>
                  <div className={styles.griditem}>{data.lastName}</div>
                  <div className={styles.gridtitle}>Gender</div>
                  <div className={styles.griditem}>{data.gender}</div>
                  <div className={styles.gridtitle}>Date of Birth</div>
                  <div className={styles.griditem}>
                    {data?.dateofBirth
                      ?.toString()
                      ?.split('-')
                      ?.reverse()
                      .join('-')}
                  </div>
                  <div className={styles.gridtitle}>Age</div>
                  <div className={styles.griditem}>{data.age}</div>
                  <div className={styles.gridtitle}>Mobile No.</div>
                  <div className={{display: 'flex', alignItems: 'center'}}>
                    <div className={styles.griditem}>{data.mobileNo}</div>
                    {data?.profileStatus == 'ACTIVE' && (
                      <VerifiedIcon
                        sx={{ml: 2, color: 'green', fontSize: '16px'}}
                      />
                    )}
                  </div>
                  <div className={styles.gridtitle}>Alternate No.</div>
                  <div className={styles.griditem}>{data.alternateNo}</div>
                  <div className={styles.gridtitle}>Govt. Id Proof</div>
                  <div className={styles.griditem}>{data.govtidproof}</div>
                  <div className={styles.gridtitle}>Govt. Id Proof Doc</div>
                  <div
                    className={styles.griditem}
                    onClick={() => {
                      downloadReg(data.govtIdProofDoc);
                    }}
                  >
                    <a href='#'>{data?.govtIdProofDoc?.slice(30)}</a>
                  </div>
                  {/* <div className={styles.gridtitle}>Govt. Id Proof</div>
                  <div className={styles.gridItem}>{data.govtidproof}</div> */}
                  <div className={styles.gridtitle}>Id Card Issued</div>
                  <div className={styles.griditem}>{data.iDCardIssued}</div>
                  <div className={styles.gridtitle}>Is PAN Card</div>
                  <div className={styles.griditem}>{data.isPanCard}</div>

                  <div className={styles.gridtitle}> Vendor </div>
                  <div className={styles.griditem}>{vendorName}</div>

                  <div className={styles.gridtitle}>
                    Police Verification Status
                  </div>
                  <div className={styles.griditem}>{data.policeVerStatus}</div>
                  <div className={styles.gridtitle}>
                    Police Verification Code
                  </div>
                  <div className={styles.griditem}>
                    {data.policeVerificationCode}
                  </div>
                  {/* <div className={styles.gridtitle}>
                    Police Verification Date
                  </div>
                  <div className={styles.griditem}>
                    {data.policeverificationdate
                      ?.toString()
                      ?.split('-')
                      ?.reverse()
                      .join('-')}
                  </div> */}
                  <div className={styles.gridtitle}>
                    Police Verification Expiry Date
                  </div>
                  <div className={styles.griditem}>
                    {data.policeverificationexpirydate
                      ?.toString()
                      ?.split('-')
                      ?.reverse()
                      .join('-')}
                  </div>
                  <div className={styles.gridtitle}>
                    Police Verification Doc
                  </div>
                  <div
                    className={styles.griditem}
                    onClick={() => {
                      downloadReg(data.policeVerDoc);
                    }}
                  >
                    <a href='#'>{data?.policeVerDoc?.slice(30)}</a>
                  </div>

                  <div className={styles.gridtitle}>Driving License No.</div>
                  <div className={styles.griditem}>{data.dlNumber}</div>
                  <div className={styles.gridtitle}>
                    Driving License Validity
                  </div>
                  <div className={styles.griditem}>
                    {moment(data.dlValidity).format('DD/MM/YYYY')}
                  </div>
                  <div className={styles.gridtitle}>Driving License Doc</div>
                  <div
                    className={styles.griditem}
                    onClick={() => {
                      downloadReg(data.dlcenseDoc);
                    }}
                  >
                    <a href='#'>{data?.dlcenseDoc?.slice(30)}</a>
                  </div>
                  <div className={styles.gridtitle}>Badge </div>
                  <div className={styles.griditem}>{data.badge}</div>
                  <div className={styles.gridtitle}>Badge No. </div>
                  <div className={styles.griditem}>{data.badgeNo}</div>
                  <div className={styles.gridtitle}>Badge Expiry date </div>
                  <div className={styles.griditem}>
                    {data.badgeExpDate
                      ?.toString()
                      ?.split('-')
                      ?.reverse()
                      .join('-')}
                  </div>
                  <div className={styles.gridtitle}>Driver Induction </div>
                  <div className={styles.griditem}>{data.driverInduction}</div>
                  <div className={styles.gridtitle}>Driver Induction Date </div>
                  <div className={styles.griditem}>
                    {data.driverInductionDate
                      ?.toString()
                      ?.split('-')
                      ?.reverse()
                      .join('-')}
                  </div>
                  <div className={styles.gridtitle}>Driver Training </div>
                  <div className={styles.griditem}>{data.trainingStatus}</div>
                  <div className={styles.gridtitle}>Driver Training Date </div>
                  <div className={styles.griditem}>
                    {data.lastTrainingDate
                      ?.toString()
                      ?.split('-')
                      ?.reverse()
                      .join('-')}
                  </div>

                  {/* <div className={styles.gridtitle}>Address Proof Doc</div>
                  <div
                    className={styles.griditem}
                    onClick={() => {
                      downloadReg(data?.addressProofDoc);
                    }}
                  >
                    <a href='#'>{data.addressProofDoc?.slice(20)}</a>
                  </div> */}
                  <div className={styles.gridtitle}>Is Vaccinated</div>
                  <div className={styles.griditem}>{data.isVaccinated}</div>
                  {/* <div className={styles.gridtitle}>
                    Vaccine Certificate Doc
                  </div>
                  <div
                    className={styles.griditem}
                    onClick={() => {
                      downloadReg(data.vaccineCertificateDoc);
                    }}
                  >
                    <a href='#'>{data.vaccineCertificateDoc?.slice(20)}</a>
                  </div> */}
                  <div className={styles.gridtitle}>Last Training date</div>
                  <div className={styles.griditem}>
                    {data.lastTrainingDate
                      ?.toString()
                      ?.split('-')
                      ?.reverse()
                      .join('-')}
                  </div>
                  <div className={styles.gridtitle}>Medical Fitness</div>
                  <div className={styles.griditem}>{data.medicalFitness}</div>
                  <div className={styles.gridtitle}>Medical Fitness Doc</div>
                  <div
                    className={styles.griditem}
                    onClick={() => {
                      downloadReg(data.medicalCertificateDoc);
                    }}
                  >
                    <a href='#'>{data.medicalCertificateDoc?.slice(20)}</a>
                  </div>
                  <div className={styles.gridtitle}>
                    Medical Fitness Expiry Date
                  </div>
                  <div className={styles.griditem}>
                    {data.medicalFitnessExpiryDate
                      ?.toString()
                      ?.split('-')
                      ?.reverse()
                      .join('-')}
                  </div>
                  <div className={styles.gridtitle}>Training Status</div>
                  <div className={styles.griditem}>{data.trainingStatus}</div>
                  <div className={styles.gridtitle}>Profile Remarks</div>
                  <div
                    className={styles.griditem}
                    style={{
                      // ...styles.griditem,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      {data?.reActivationRemark ||
                        data?.deActivationRemark ||
                        'NA'}
                    </div>
                  </div>
                </div>
              </span>
            </Grid>
          </Grid>
        </div>
      </div>

      <div style={{width: '100%', marginTop: '15px', textAlign: 'center'}}>
        <Button
          id='btnMui123'
          variant='contained'
          sx={{ml: 0}}
          onClick={() => {
            downloadReg([
              data.policeVerDoc,
              data.dlcenseDoc,
              data.medicalCertificateDoc,
              // data.identityProofDoc,
              data.govtIdProofDoc,
            ]);
          }}
        >
          Download All Files
        </Button>
      </div>
    </>
  );
};

export default DetailForm;
