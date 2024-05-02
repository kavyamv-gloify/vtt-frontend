/* eslint-disable */
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import api from '@api';
import styles from './style.module.css';
import Api from '@api';
import Grid from '@mui/material/Grid';
import VerifiedIcon from '@mui/icons-material/Verified';
const DetailForm = ({profileDPfunc, id, internalDetailPage}) => {
  const [data, setData] = useState({});
  useEffect(() => {
    async function fetchData() {
      const baseURL = `${api.employee.list}/${id}`;
      let response = await axios.get(baseURL);
      profileDPfunc(response?.data?.data?.photo);
      let tem = response.data.data;
      setData(tem);
    }
    fetchData();
  }, [id]);

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
                  src={Api.imgUrl + data?.photo}
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
                  <div className={styles.gridtitle}>First Name</div>
                  <div className={styles.griditem}>
                    {data?.firstName || 'NA'}
                  </div>
                  <div className={styles.gridtitle}> Last Name</div>
                  <div className={styles.griditem}>
                    {data?.lastName || 'NA'}
                  </div>
                  <div className={styles.gridtitle}>Employee Code</div>
                  <div className={styles.griditem}>
                    {data?.employeeCode || 'NA'}
                  </div>
                  <div className={styles.gridtitle}> Short Id</div>
                  <div className={styles.griditem}>{data?.shortId}</div>
                  <div className={styles.gridtitle}>Gender</div>
                  <div className={styles.griditem}>{data?.gender || 'NA'}</div>
                  <div className={styles.gridtitle}>Mobile No.</div>
                  <div
                    className={styles.griditem}
                    style={{display: 'flex', alignItems: 'center'}}
                  >
                    {data?.mobileNo || 'NA'}{' '}
                    {data?.profileStatus == 'ACTIVE' && (
                      <VerifiedIcon
                        sx={{ml: 2, color: 'green', fontSize: '16px'}}
                      />
                    )}
                  </div>
                  <div className={styles.gridtitle}>Alternate No. </div>
                  <div className={styles.griditem}>
                    {data?.alternateContactNo || 'NA'}
                  </div>
                  <div className={styles.gridtitle}>Email Id</div>
                  <div
                    className={styles.griditem}
                    style={{display: 'flex', alignItems: 'center'}}
                  >
                    {data?.emailId || 'NA'}
                    {data?.profileStatus == 'ACTIVE' && (
                      <VerifiedIcon
                        sx={{ml: 2, color: 'green', fontSize: '16px'}}
                      />
                    )}
                  </div>
                  <div className={styles.gridtitle}>Employee Category</div>
                  <div className={styles.griditem}>
                    {data?.employeeCategory || 'NA'}
                  </div>
                  <div className={styles.gridtitle}>Manager Name</div>
                  <div className={styles.griditem}>
                    {data?.managerName || 'NA'}
                  </div>
                  <div className={styles.gridtitle}>Shift Name</div>
                  <div className={styles.griditem}>
                    {data?.shiftName || 'NA'}
                  </div>
                  <div className={styles.gridtitle}>Business Unit </div>
                  <div className={styles.griditem}>
                    {data?.businessUnit || 'NA'}
                  </div>
                  <div className={styles.gridtitle}>Department </div>
                  <div className={styles.griditem}>
                    {data?.department || 'NA'}
                  </div>
                  <div className={styles.gridtitle}>Designation </div>
                  <div className={styles.griditem}>
                    {data?.designation || 'NA'}
                  </div>
                  <div className={styles.gridtitle}>Specific Need </div>
                  <div className={styles.griditem}>
                    {data?.specificNeedType || 'NA'}
                  </div>
                  <div className={styles.gridtitle}>Special Employee Type</div>
                  <div className={styles.griditem}>
                    {data?.specialEmployee || 'NA'}
                  </div>
                  <div className={styles.gridtitle}>Site Report To</div>
                  <div className={styles.griditem}>
                    {data?.officeName || 'NA'}
                  </div>
                  <div className={styles.gridtitle}>Is Vaccinated</div>
                  <div className={styles.griditem}>
                    {data?.isVaccinated || 'NA'}
                  </div>
                  <div className={styles.gridtitle}>Residence Address</div>
                  <div
                    className={styles.griditem}
                    style={{display: 'flex', alignItems: 'center'}}
                  >
                    <div>{data?.pickupLocation?.locName  || 'NA'}</div>
                    {data?.profileStatus == 'ACTIVE' && (
                      <VerifiedIcon
                        sx={{ml: 2, color: 'green', fontSize: '16px'}}
                      />
                    )}
                  </div>
                  <div className={styles.gridtitle}>Town/City</div>
                  <div className={styles.griditem}>
                    {data?.residenceAddress?.city || 'NA'}
                  </div>
                  <div className={styles.gridtitle}>State</div>
                  <div className={styles.griditem}>
                    {data?.residenceAddress?.state || 'NA'}
                  </div>
                  <div className={styles.gridtitle}>Pincode</div>
                  <div className={styles.griditem}>
                    {data?.residenceAddress?.pinCode || 'NA'}
                  </div>
                  <div className={styles.gridtitle}>Nodal Point</div>
                  <div
                    className={styles.griditem}
                    style={{display: 'flex', alignItems: 'center'}}
                  >
                    <div>{data?.pickupDropNodalPoint?.locName || 'NA'}</div>
                    {data?.profileStatus == 'ACTIVE' && (
                      <VerifiedIcon
                        sx={{ml: 2, color: 'green', fontSize: '16px'}}
                      />
                    )}
                  </div>
                  <div className={styles.gridtitle}>Cost Center</div>
                  <div className={styles.griditem}>
                    {data?.costCenter || 'NA'}
                  </div>
                  <div className={styles.gridtitle}>Profile Remarks</div>
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
                  <div className={styles.gridtitle}>Short Id</div>
                  <div className={styles.griditem}>{data?.shortId || 'NA'}</div>
                </div>
              </span>
            </Grid>
          </Grid>
        </div>
      </div>
    </>
  );
};

export default DetailForm;
