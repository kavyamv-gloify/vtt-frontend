/* eslint-disable */
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import SmartForm from '@smart-form';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import {useAuthUser} from '@crema/utility/AuthHooks';
import VerifiedIcon from '@mui/icons-material/Verified';
import api from '@api';
import {Grid} from '@mui/material';
import {
  Box,
  Table,
  TableCell,
  TableRow,
  TableHead,
  TableBody,
} from '@mui/material';
import {Button} from '@mui/material';
import styles from './vendor.module.css';
import downDoc from '@common/fileDownload';
const DetailForm = ({id, close}) => {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  // const { id } = useParams();
  const {user} = useAuthUser();

  useEffect(() => {
    async function fetchData() {
      const baseURL = `${api.vendor.list}/${id}`;

      let response = await axios.get(baseURL);

      setData(response.data.data);
    }
    fetchData();
  }, [id]);
  function onCancel() {
    // navigate(`/onboardadmin/vendor/vendor-listing/Def`);
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
                  src={api.imgUrl + data?.vendorPhoto}
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
                  <div className={styles.gridititle}>Vendor Name</div>
                  <div className={styles.griditem}>{data?.vendorName}</div>
                  <div className={styles.gridititle}>Vendor Code</div>
                  <div className={styles.griditem}>{data?.vendorCode}</div>
                  <div className={styles.gridititle}>Vendor Service Area</div>
                  <div className={styles.griditem}>{data?.vendorType}</div>
                  <div className={styles.gridititle}>Mobile Number</div>
                  <div
                    className={styles.griditem}
                    style={{display: 'flex', padding: 0}}
                  >
                    <div className={styles.griditem}>{data?.mobileNo}</div>
                    {data?.profileStatus == 'ACTIVE' && data?.emailId && (
                      <VerifiedIcon
                        sx={{
                          ml: 2,
                          color: 'green',
                          fontSize: '16px',
                          marginTop: '15px',
                        }}
                      />
                    )}
                  </div>
                  <div className={styles.gridititle}>PAN Number</div>
                  <div className={styles.griditem}>{data?.companyPAN}</div>
                  <div className={styles.gridititle}>PAN Doc</div>
                  <div
                    className={styles.griditem}
                    onClick={() => {
                      downloadReg(data?.companyPanDoc);
                    }}
                  >
                    <a href='#'>{data?.companyPanDoc?.slice(30)}</a>
                  </div>

                  <div className={styles.gridititle}>Email Id</div>
                  <div
                    className={styles.griditem}
                    style={{display: 'flex', padding: 0}}
                  >
                    <div className={styles.griditem}>{data?.emailId}</div>
                    {data?.profileStatus == 'ACTIVE' && data?.emailId && (
                      <VerifiedIcon
                        sx={{
                          ml: 2,
                          color: 'green',
                          fontSize: '16px',
                          marginTop: '15px',
                        }}
                      />
                    )}
                  </div>
                  <div className={styles.gridititle}>Address</div>
                  <div className={styles.griditem}>
                    {data?.address?.addressName?.split('++')?.join(', ')}
                  </div>
                  <div className={styles.gridititle}>Town/City</div>
                  <div className={styles.griditem}>{data?.address?.city}</div>
                  <div className={styles.gridititle}>State</div>
                  <div className={styles.griditem}>{data?.address?.state}</div>
                  <div className={styles.gridititle}>Pincode</div>
                  <div className={styles.griditem}>
                    {data?.address?.pinCode}
                  </div>
                  <div className={styles.gridititle}> Vendor Name</div>
                  <div className={styles.griditem}>{data.vendorName}</div>
                  <div className={styles.gridititle}>Benificiary Name</div>
                  <div className={styles.griditem}>
                    {data.accountName ?? 'NA'}
                  </div>
                  <div className={styles.gridititle}>Account Number</div>
                  <div className={styles.griditem}>
                    {data.accountNumber ?? 'NA'}
                  </div>
                  <div className={styles.gridititle}>Bank Name</div>
                  <div className={styles.griditem}>{data.bankName ?? 'NA'}</div>

                  <div className={styles.gridititle}>Branch Name</div>
                  <div className={styles.griditem}>
                    {data.branchName ?? 'NA'}
                  </div>
                  <div className={styles.gridititle}>IFSC Code</div>
                  <div className={styles.griditem}>{data.ifscCode ?? 'NA'}</div>
                  <div className={styles.gridititle}>Profile Remarks</div>
                  <div
                    className={styles.griditem}
                    style={{display: 'flex', alignItems: 'center'}}
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
      {/* <div className={styles.ab}>
        <div className={styles.gridcontainer}>
          <div className={styles.gridititle}>Vendor Name</div>
          <div className={styles.griditem}>{data?.vendorName}</div>
          <div className={styles.gridititle}>Vendor Code</div>
          <div className={styles.griditem}>{data?.vendorCode}</div>
          <div className={styles.gridititle}>Vendor Service Area</div>
          <div className={styles.griditem}>{data?.vendorType}</div>
          <div className={styles.gridititle}>Mobile Number</div>
          <div
            className={styles.griditem}
            style={{display: 'flex', padding: 0}}
          >
            <div className={styles.griditem}>{data?.mobileNo}</div>
            {data?.profileStatus == 'ACTIVE' && data?.emailId && (
              <VerifiedIcon
                sx={{
                  ml: 2,
                  color: 'green',
                  fontSize: '16px',
                  marginTop: '15px',
                }}
              />
            )}
          </div>
          <div className={styles.gridititle}>PAN Number</div>
          <div className={styles.griditem}>{data?.companyPAN}</div>
          <div className={styles.gridititle}>PAN Doc</div>
          <div
            className={styles.griditem}
            onClick={() => {
              downloadReg(data?.companyPanDoc);
            }}
          >
            <a href='#'>{data?.companyPanDoc?.slice(30)}</a>
          </div>

          <div className={styles.gridititle}>Email Id</div>
          <div
            className={styles.griditem}
            style={{display: 'flex', padding: 0}}
          >
            <div className={styles.griditem}>{data?.emailId}</div>
            {data?.profileStatus == 'ACTIVE' && data?.emailId && (
              <VerifiedIcon
                sx={{
                  ml: 2,
                  color: 'green',
                  fontSize: '16px',
                  marginTop: '15px',
                }}
              />
            )}
          </div>
          <div className={styles.gridititle}>Address</div>
          <div className={styles.griditem}>
            {data?.address?.addressName?.split('++')?.join(', ')}
          </div>
          <div className={styles.gridititle}>Town/City</div>
          <div className={styles.griditem}>{data?.address?.city}</div>
          <div className={styles.gridititle}>State</div>
          <div className={styles.griditem}>{data?.address?.state}</div>
          <div className={styles.gridititle}>Pincode</div>
          <div className={styles.griditem}>{data?.address?.pinCode}</div>
          <div className={styles.gridititle}> Vendor Name</div>
          <div className={styles.griditem}>{data.vendorName}</div>
          <div className={styles.gridititle}>Benificiary Name</div>
          <div className={styles.griditem}>{data.accountName ?? 'NA'}</div>
          <div className={styles.gridititle}>Account Number</div>
          <div className={styles.griditem}>{data.accountNumber ?? 'NA'}</div>
          <div className={styles.gridititle}>Bank Name</div>
          <div className={styles.griditem}>{data.bankName ?? 'NA'}</div>

          <div className={styles.gridititle}>Branch Name</div>
          <div className={styles.griditem}>{data.branchName ?? 'NA'}</div>
          <div className={styles.gridititle}>IFSC Code</div>
          <div className={styles.griditem}>{data.ifscCode ?? 'NA'}</div>
          <div className={styles.gridititle}>Profile Remarks</div>
          <div
            className={styles.griditem}
            style={{display: 'flex', alignItems: 'center'}}
          >
            <div>
              {data?.reActivationRemark || data?.deActivationRemark || 'NA'}
            </div>
          </div>
        </div>
      </div> */}

      <div style={{width: '100%', marginTop: '15px', textAlign: 'center'}}>
        <Button
          id='btnMui123'
          variant='contained'
          sx={{ml: 0}}
          onClick={() => {
            downloadReg([data.companyPanDoc]);
          }}
        >
          Download All Files
        </Button>
      </div>
    </>
  );
};

export default DetailForm;
