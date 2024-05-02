/* eslint-disable */
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import SmartForm from '@smart-form';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import {useAuthUser} from '@crema/utility/AuthHooks';
import api from '@api';
import styled from 'styled-components';
import {Box, Table, TableCell, TableRow} from '@mui/material';
import {Button} from '@mui/material';
import {Grid} from '@mui/material';
// import { Icon } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import './style.css';

const DetailForm = ({id, close}) => {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  // const { id } = useParams();
  const {user} = useAuthUser();

  useEffect(() => {
    async function fetchData() {
      let baseURL;
      if (user?.role == 'TANENTADMIN') {
        baseURL = `${api.driver.list}/${id}`;
      }
      if (user?.role == 'VENDOR') {
        baseURL = `${api.driver.list}/${id}`;
      }
      let response = await axios.get(baseURL);

      setData(response.data.data);
    }
    fetchData();
  }, [id]);

  const Container = styled.div`
    background-color: rgba(255, 255, 255, 0.8);
    border: 1px solid rgb(154, 152, 152);
    border-radius: 11px;
    margin-top: 25px;
  `;

  function onCancel() {
    navigate(`/onboardadmin/driver/driver-listing`);
    close();
  }
  return (
    <>
      <div style={{textAlign: 'center'}}>
        <h1>Driver Details</h1>
      </div>
      {/* <div className='ab'> */}
      <Container>
        {/* {arr.map((e) => {return ( */}
        <div className='grid-container'>
          <div className='grid-item bold'>Super Admin Name</div>
          <div className='grid-item'>{data.tenantName}</div>
          <div className='grid-item bold'>Vendor Code</div>
          <div className='grid-item'>{data.vendorCode}</div>
          <div className='grid-item bold'>Vendor Name</div>
          <div className='grid-item'>{data.vendorName}</div>
          <div className='grid-item bold'>Address</div>
          <div className='grid-item'>{data.address?.addressName}</div>
          <div className='grid-item bold'>Email Id</div>
          <div className='grid-item'>{data.emailId}</div>
          <div className='grid-item bold'>First Name</div>
          <div className='grid-item'>{data.firstName}</div>
          <div className='grid-item bold'>Last Name</div>
          <div className='grid-item'>{data.lastName}</div>
          <div className='grid-item bold'>Gender</div>
          <div className='grid-item'>{data.gender}</div>

          <div className='grid-item bold'>Father Name</div>
          <div className='grid-item'>{data.driverFathersName}</div>
          <div className='grid-item bold'>Date of Birth</div>
          <div className='grid-item'>{data.dateofBirth}</div>
          <div className='grid-item bold'>Age</div>
          <div className='grid-item'>{data.age}</div>
          <div className='grid-item bold'>Blood Group</div>
          <div className='grid-item'>{data.bloodGroup}</div>
          <div className='grid-item bold'>Driver Code</div>
          <div className='grid-item'>{data.driverCode}</div>
          <div className='grid-item bold'>Mobile No.</div>
          <div className='grid-item'>{data.mobileNo}</div>
          <div className='grid-item bold'>Alternate No.</div>
          <div className='grid-item'>{data.alternateNo}</div>
          <div className='grid-item bold'>Emergency No.</div>
          <div className='grid-item'>{data.emergencyContactNo}</div>
          <div className='grid-item bold'>Year of Experience</div>
          <div className='grid-item'>{data.expYears}</div>
          <div className='grid-item bold'>Govt. Id Proof</div>
          <div className='grid-item'>{data.govtidproof}</div>
          <div className='grid-item bold'>Id Card Issued</div>
          <div className='grid-item'>{data.iDCardIssued}</div>
          <div className='grid-item bold'>Is PAN Card</div>
          <div className='grid-item'>{data.isPanCard}</div>

          <div className='grid-item bold'>Fleet Vendor </div>
          <div className='grid-item'>{data.fleetVendor}</div>

          <div className='grid-item bold'>Police Verification Status</div>
          <div className='grid-item'>{data.policeVerStatus}</div>
          <div className='grid-item bold'>Police Verification Code</div>
          <div className='grid-item'>{data.policeVerificationCode}</div>
          <div className='grid-item bold'>Police Verification Date</div>
          <div className='grid-item'>{data.policeverificationdate}</div>
          <div className='grid-item bold'>Police Verification Expiry Date</div>
          <div className='grid-item'>{data.policeverificationexpirydate}</div>
          <div className='grid-item bold'>Police Verification Document</div>
          <div className='grid-item'>{data.policeVerDoc}</div>

          <div className='grid-item bold'>Driving License No.</div>
          <div className='grid-item'>{data.dlNumber}</div>
          <div className='grid-item bold'>Driving License Validity</div>
          <div className='grid-item'>{data.dlValidity}</div>
          <div className='grid-item bold'>Driving License Document</div>
          <div className='grid-item'>{data.dlcenseDoc}</div>
          <div className='grid-item bold'>Badge </div>
          <div className='grid-item'>{data.badge}</div>
          <div className='grid-item bold'>Badge No. </div>
          <div className='grid-item'>{data.badgeNo}</div>
          <div className='grid-item bold'>Badge Expiry date </div>
          <div className='grid-item'>{data.badgeExpDate}</div>
          <div className='grid-item bold'>Driver Induction </div>
          <div className='grid-item'>{data.driverInduction}</div>
          <div className='grid-item bold'>Driver type </div>
          <div className='grid-item'>{data.driverType}</div>
          <div className='grid-item bold'>
            Driving License Issuance Authority
          </div>
          <div className='grid-item'>
            {data.drivingLicenseIssuanceAuthority}
          </div>
          <div className='grid-item bold'>Driving License Issue Date</div>
          <div className='grid-item'>{data.drivinglicenseissuedate}</div>
          <div className='grid-item bold'>Address Proof Document</div>
          <div className='grid-item'>
            {data.addressProofDoc?.slice(20) ?? 'NA'}
          </div>
          <div className='grid-item bold'>External Verification Agency </div>
          <div className='grid-item'>{data.externalVerificationAgency}</div>
          <div className='grid-item bold'>
            External Verification Expiry Date{' '}
          </div>
          <div className='grid-item'>{data.externalVerificationExpDate}</div>
          <div className='grid-item bold'>Internal Verification</div>
          <div className='grid-item'>{data.internalVerification}</div>
          <div className='grid-item bold'>Internal Verification Approver</div>
          <div className='grid-item'>{data.internalVerificationApprover}</div>
          <div className='grid-item bold'>
            Internal Verification Expiry Date
          </div>
          <div className='grid-item'>{data.internalVerificationExpDate}</div>
          <div className='grid-item bold'> Last internal Verification Date</div>
          <div className='grid-item'>{data.lastInternalVerificationDate}</div>
          <div className='grid-item bold'> Last External Verification Date</div>
          <div className='grid-item'>{data.lastExternalVerificationDate}</div>
          <div className='grid-item bold'>Identity Proof Document</div>
          <div className='grid-item'>
            {data.identityProofDoc?.slice(20) ?? 'NA'}
          </div>
          <div className='grid-item bold'>Is Vaccinated</div>
          <div className='grid-item'>{data.isVaccinated}</div>
          <div className='grid-item bold'>Vaccine Certificate Doc</div>
          <div className='grid-item'>
            {data.vaccineCertificateDoc?.slice(20) ?? 'NA'}
          </div>
          <div className='grid-item bold'>Is Mobile Device Installed</div>
          <div className='grid-item'>{data.isMobileDeviceInstalled}</div>
          <div className='grid-item bold'>Last Training date</div>
          <div className='grid-item'>{data.lastTrainingDate}</div>
          <div className='grid-item bold'>Medical Fitness</div>
          <div className='grid-item'>{data.medicalFitness}</div>
          <div className='grid-item bold'>Medical Fitness Date</div>
          <div className='grid-item'>{data.medicalFitnessDate}</div>
          <div className='grid-item bold'>Medical Fitness Expiry Date</div>
          <div className='grid-item'>{data.medicalFitnessExpiryDate}</div>
          <div className='grid-item bold'>Supplier Joining date</div>
          <div className='grid-item'>{data.supplierJoiningDate}</div>
          <div className='grid-item bold'>Training Status</div>
          <div className='grid-item'>{data.trainingStatus}</div>
        </div>
      </Container>
      {/* </div> */}
      <div style={{width: '100%', marginTop: '15px', textAlign: 'center'}}>
        <Button id='btnMui123' variant='contained' onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </>
  );
};

export default DetailForm;
