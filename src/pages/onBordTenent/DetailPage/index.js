/* eslint-disable */
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
// import Steppers from '@smart-form/stepper';
// import regex from '@regex';
// import axios from 'axios';
import SmartForm from '@smart-form';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import api from '@api';
import {Box, Grid, Table, TableCell, TableRow} from '@mui/material';
import {Button} from '@mui/material';
import downDoc from '@common/fileDownload';
import styles from './style.module.css';
import Api from '@api';

const DetailPage = ({close, id}) => {
  // useEffect(()=>{
  //     downDoc?.downloadDoc("/fsdfds");
  // },[])
  const navigate = useNavigate();
  const [data, setData] = useState({});
  // const { id } = useParams();
  //

  useEffect(() => {
    async function fetchData() {
      const baseURL = `${api.onBoardTenant.list}/${id} `;
      let response = await axios.get(`${baseURL}`);

      setData(response.data.data);
    }
    fetchData();
  }, [id]);

  const commonStyles = {
    // bgcolor: '#e0e0e0',
    // borderColor: 'text.primary',
    m: 1,
    border: 1,
    width: '45rem',
    height: '47rem',
  };

  function onCancel() {
    // navigate(`/superadmin/table`);
    close();
  }

  function Regdownload(d) {
    if (typeof d == 'string') downDoc?.downloadDoc(d);
    else {
      d?.map((el) => {
        downDoc?.downloadDoc(el);
      });
    }
  }

  return (
    <>
      {/* <div style={{ "textAlign": "center" }}>
                <h1 >Super Admin Details</h1>
            </div> */}
      <div className={styles.ab}>
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
                src={Api.imgUrl + data.companyLogoDoc}
                onError={(event) =>
                  (event.target.src =
                    data.companyLogoDoc?.trim() == 'mickey'
                      ? '/assets/images/placeholder.jpg'
                      : '/assets/images/placeholder.jpg')
                }
              />
            </span>
          </Grid>
          {/* {arr.map((e) => {return ( */}
          <Grid item xs={10}>
            <div className={styles.gridcontainer}>
              <div className={styles.gridTitle}>Company Name</div>
              <div className={styles.griditem}>{data?.companyName}</div>

              {/* <div className={styles.gridTitle}>Company Logo</div>
              <div
                className={styles.griditem}
                onClick={() => Regdownload(data.companyLogoDoc)}
              >
                <a href='#'>{data?.companyLogoDoc?.slice(30)}</a>
              </div> */}
              <div className={styles.gridTitle}>Company Domain</div>
              <div className={styles.griditem}>{data?.domains?.join(', ')}</div>
              <div className={styles.gridTitle}>
                Flat, House No., Building, Apartment
              </div>
              <div className={styles.griditem}>
                {data?.companyAddress?.addressName?.split('++')[0]}
              </div>
              <div className={styles.gridTitle}>
                Area, Street, Sector,Village
              </div>
              <div className={styles.griditem}>
                {data?.companyAddress?.addressName?.split('++')[1] || 'NA'}
              </div>
              <div className={styles.gridTitle}>State</div>
              <div className={styles.griditem}>
                {data?.companyAddress?.state}
              </div>
              <div className={styles.gridTitle}>City</div>
              <div className={styles.griditem}>
                {data?.companyAddress?.city}
              </div>
              <div className={styles.gridTitle}>Pincode</div>
              <div className={styles.griditem}>
                {data?.companyAddress?.pinCode}
              </div>
              <div className={styles.gridTitle}>Registration No.</div>
              <div className={styles.griditem}>{data?.companyRegNo}</div>
              <div className={styles.gridTitle}>Registration No.Doc</div>
              <div
                className={styles.griditem}
                onClick={() => Regdownload(data.companyRegDoc)}
              >
                <a href='#'>{data?.companyRegDoc?.slice(30)}</a>
              </div>
              <div className={styles.gridTitle}>GSTIN No. </div>
              <div className={styles.griditem}>{data?.companyGSTN}</div>
              <div className={styles.gridTitle}>GSTIN No. DOC</div>
              <div
                className={styles.griditem}
                onClick={() => Regdownload(data?.companyGstnDoc)}
              >
                <a href='#'>{data?.companyGstnDoc?.slice(30)}</a>
              </div>
              <div className={styles.gridTitle}>PAN No.</div>
              <div className={styles.griditem}>{data?.companyPAN}</div>
              <div className={styles.gridTitle}>PAN No. Doc</div>
              <div
                className={styles.griditem}
                onClick={() => Regdownload(data.companyPanDoc)}
              >
                <a href='#'>{data?.companyPanDoc?.slice(30)}</a>
              </div>

              <div className={styles.gridTitle}> First Name</div>
              <div className={styles.griditem}>
                {data?.contactPersonFirstName}
              </div>
              <div className={styles.gridTitle}>Last Name</div>
              <div className={styles.griditem}>
                {data?.contactPersonLastName}
              </div>
              <div className={styles.gridTitle}>Email Id</div>
              <div className={styles.griditem}>{data?.emailId ?? 'NA'}</div>
              <div className={styles.gridTitle}>Mobile No.</div>
              <div className={styles.griditem}>{data?.mobileNo ?? 'NA'}</div>
              <div className={styles.gridTitle}>Landline No.</div>
              <div className={styles.griditem}>{data?.landLineNo ?? 'NA'}</div>
              <div className={styles.gridTitle}>Account Name</div>
              <div className={styles.griditem}>{data?.accountName ?? 'NA'}</div>
              <div className={styles.gridTitle}>Bank Account Number</div>
              <div className={styles.griditem}>
                {data?.accountNumber ?? 'NA'}
              </div>
              <div className={styles.gridTitle}>Bank Name</div>
              <div className={styles.griditem}>{data?.bankName ?? 'NA'}</div>

              <div className={styles.gridTitle}>Branch Name</div>
              <div className={styles.griditem}>{data?.branchName ?? 'NA'}</div>
              <div className={styles.gridTitle}>IFSC Code</div>
              <div className={styles.griditem}>{data?.ifscCode ?? 'NA'}</div>
            </div>
          </Grid>
          {/* )})} */}
        </Grid>
      </div>
      <div style={{width: '100%', marginTop: '15px', textAlign: 'center'}}>
        <Button id='btnMui123' variant='contained' onClick={onCancel}>
          Cancel
        </Button>
        <Button
          id='btnMui123'
          variant='contained'
          sx={{ml: 4}}
          onClick={() => {
            Regdownload([
              data.companyLogoDoc,
              data.companyRegDoc,
              data.companyGstnDoc,
              data.companyPanDoc,
            ]);
          }}
        >
          Download All Files
        </Button>
      </div>
    </>
  );
};

export default DetailPage;
