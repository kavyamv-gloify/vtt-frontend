/* eslint-disable */
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import SmartForm from '@smart-form';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import {useAuthUser} from '@crema/utility/AuthHooks';
// import { useNavigate } from 'react-router-dom';
import api from '@api';
import {Box, Table, TableCell, TableRow} from '@mui/material';
import {Button} from '@mui/material';
import styled from 'styled-components';
import {Grid} from '@mui/material';
// import { Icon } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import styles from './escort.module.css';
import downDoc from '@common/fileDownload';
const DetailPage = ({idd, close}) => {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  // const [agencyName, setAgencyName] = useState();
  // const { id } = useParams();
  const {user} = useAuthUser();

  //

  useEffect(() => {
    async function fetchData() {
      let baseURL = `${api.escort.createform}/${idd}`;
      let response = await axios.get(baseURL);

      let res = await axios.get(
        api.baseUri +
          '/user-reg/Agency-Service/getbyid/' +
          response.data.data.agency,
      );
      response.data.data.agencyName = res?.data?.data?.agencyName;
      setData(response.data.data);
    }
    fetchData();
  }, [idd]);
  const Container = styled.div`
    background-color: rgba(255, 255, 255, 0.8);
    border: 1px solid rgb(154, 152, 152);
    border-radius: 11px;
    margin-top: 25px;
  `;

  function onCancel() {
    // navigate(`/onboardadmin/escort/escort-listing`);
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
  return (
    <>
      <div style={{textAlign: 'center'}}>{/* <h1 >Escort Details</h1> */}</div>
      <div className={styles.abescort}>
        {/* {arr.map((e) => {return ( */}
        <div className={styles.gridcontainer}>
          {/* <div className="grid-item bold">Super Admin Name</div>
                    <div className="grid-item">{data.tenantName}</div> */}
          <div className={styles.gridtitle}>First Name</div>
          <div className={styles.griditem}>{data?.firstName}</div>
          <div className={styles.gridtitle}>Last Name</div>
          <div className={styles.griditem}>{data?.lastName}</div>
          <div className={styles.gridtitle}>Agency</div>
          <div className={styles.griditem}>{data?.agencyName}</div>
          <div className={styles.gridtitle}>Escort Id</div>
          <div className={styles.griditem}>{data?.escortCode}</div>
          <div className={styles.gridtitle}>Mobile No.</div>
          <div className={styles.griditem}>{data?.mobileNo}</div>
          <div className={styles.gridtitle}>Email Id</div>
          <div className={styles.griditem}>{data?.emailId}</div>
          <div className={styles.gridtitle}> Short Id</div>
          <div className={styles.griditem}>{data?.shortId}</div>
          <div className={styles.gridtitle}>Address</div>
          <div className={styles.griditem}>
            {data?.address?.addressName?.split('++')?.join(', ')}
          </div>
          <div className={styles.gridtitle}>State</div>
          <div className={styles.griditem}>{data?.address?.state}</div>
          <div className={styles.gridtitle}>City</div>
          <div className={styles.griditem}>{data?.address?.city}</div>
          <div className={styles.gridtitle}>Pincode</div>
          <div className={styles.griditem}>{data?.address?.pinCode}</div>
          <div className={styles.gridtitle}>Address Proof Doc. type</div>
          <div className={styles.griditem}>{data?.addressProofDocTpye}</div>
          <div className={styles.gridtitle}>Address Proof Document</div>
          <div
            className={styles.griditem}
            onClick={() => {
              downloadReg(data?.addressProofDoc);
            }}
          >
            <a href='#'>{data?.addressProofDoc?.slice(20)}</a>
          </div>
          <div className={styles.gridtitle}>Identity Proof Doc. type</div>
          <div className={styles.griditem}>{data?.identityProofDocTpye}</div>
          <div className={styles.gridtitle}>Identity Proof Document</div>
          <div
            className={styles.griditem}
            onClick={() => {
              downloadReg(data?.identityProofDoc);
            }}
          >
            <a href='#'>{data?.identityProofDoc?.slice(20)}</a>
          </div>
          <div className={styles.gridtitle}>Police Verification</div>
          <div className={styles.griditem}>{data?.policeVerStatus}</div>
          <div className={styles.gridtitle}>Police Verification Document</div>
          <div
            className={styles.griditem}
            onClick={() => {
              downloadReg(data?.policeVerDoc);
            }}
          >
            <a href='#'>{data?.policeVerDoc?.slice(20)}</a>
          </div>
          <div className={styles.gridtitle}>Special Training</div>
          <div className={styles.griditem}>{data?.specialTraings}</div>
          <div className={styles.gridtitle}>Arm License No.</div>
          <div className={styles.griditem}>{data?.armsLicence}</div>
          <div className={styles.gridtitle}>Arm Status</div>
          <div className={styles.griditem}>{data?.armsStatus}</div>
          <div className={styles.gridtitle}>Photo</div>
          <div
            className={styles.griditem}
            onClick={() => {
              downloadReg(data?.photoDoc);
            }}
          >
            <a href='#'>{data?.photoDoc?.slice(20) ?? 'NA'}</a>
          </div>
          <div className={styles.gridtitle}>Remarks</div>
          <div className={styles.griditem}>{data?.remarks}</div>
          {/* <div className={styles.gridtitle}>Shift</div>
                    <div className={styles.griditem}>{data?.shiftDetails}</div>
                    {/* <div className='grid-item bold'>Escort Location</div> */}
          {/* <div className='grid-item'>{data?.escortLocation}</div> */}
          {/* <div className='grid-item bold'>Office Location</div>
                    <div className='grid-item'>{data?.officeLocation}</div> */}
        </div>
      </div>
      <div style={{width: '100%', marginTop: '15px', textAlign: 'center'}}>
        <Button
          id='btnMui123'
          variant='contained'
          sx={{ml: 0}}
          onClick={() => {
            downloadReg([
              data.photoDoc,
              data.policeVerDoc,
              data.identityProofDoc,
              data.addressProofDoc,
            ]);
          }}
        >
          Download All Files
        </Button>
      </div>
      {/* <div style={{ width: "100%", marginTop: "15px", textAlign: "center" }}><Button id='btnMui123' variant='contained' onClick={onCancel}>Cancel</Button></div> */}
    </>
  );
};

export default DetailPage;
