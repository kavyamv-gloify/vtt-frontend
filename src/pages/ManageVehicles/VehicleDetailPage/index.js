/* eslint-disable */
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import SmartForm from '@smart-form';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import {useAuthUser} from '@crema/utility/AuthHooks';
import api from '@api';
import {Box, Table, TableCell, TableRow} from '@mui/material';
import {Button} from '@mui/material';
import styles from './vehicle.module.css';
import downDoc from '@common/fileDownload';
const DetailForm = ({id, close}) => {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  // const { id } = useParams();
  const {user} = useAuthUser();

  useEffect(() => {
    async function fetchData() {
      const baseURL = `${api.vehicle.list}/${id}`;

      let response = await axios.get(baseURL);

      setData(response.data.data);
    }
    fetchData();
  }, [id]);

  const commonStyles = {
    // bgcolor: '#e0e0e0',
    // borderColor: 'text.primary',
    m: 1,
    border: 1,
    width: '41rem',
    height: '65rem',
  };

  function onCancel() {
    // navigate(`/onboardadmin/vehicle/vehicle-listing`);
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
      <div className={styles.ab}>
        {/* {arr.map((e) => {return ( */}
        <div className={styles.gridcontainer}>
          <div className={styles.gridtitle}>Vehicle Brand</div>
          <div className={styles.griditem}>{data.vehicleBrand}</div>
          <div className={styles.gridtitle}>Model No.</div>
          <div className={styles.griditem}>{data.modelNo}</div>
          <div className={styles.gridtitle}>Fuel Type</div>
          <div className={styles.griditem}>{data.fuelType}</div>

          {/* <div className={styles.gridtitle}>Chasis No.</div>
                <div className={styles.griditem}>{data.chasisNo}</div> */}

          <div className={styles.gridtitle}>Registration No. Doc</div>
          <a href='#'>
            {' '}
            <div className={styles.griditem}>
              {data.regCertDoc?.slice(20) ?? 'NA'}
            </div>
          </a>
          <div className={styles.gridtitle}>Registration Date</div>
          <div className={styles.griditem}>
            {data.registrationDate
              ?.toString()
              ?.split('-')
              ?.reverse()
              .join('-') ?? 'NA'}
          </div>
          <div className={styles.gridtitle}>Registration Expiry Date</div>
          <div className={styles.griditem}>
            {data.registrationExpDate
              ?.toString()
              ?.split('-')
              ?.reverse()
              .join('-') ?? 'NA'}
          </div>
          <div className={styles.gridtitle}>Vehicle Color</div>
          <div className={styles.griditem}>{data.vehicleColor}</div>
          <div className={styles.gridtitle}>Vehicle Photo</div>
          <a href='#'>
            <div className={styles.griditem}>
              {data.vehiclePhoto?.slice(20) ?? 'NA'}
            </div>
          </a>
          <div className={styles.gridtitle}>Vehicle Number Plate</div>
          <div className={styles.griditem}>{data.vehicleNumberPlate}</div>
          {/* <div className={styles.gridtitle}>Pollution Status</div>
          <div className={styles.griditem}>{data.polutionStatus}</div> */}
          <div className={styles.gridtitle}>Pollution Doc</div>
          <a href='#'>
            {' '}
            <div className={styles.griditem}>
              {data.polutionDoc?.slice(20) ?? 'NA'}
            </div>
          </a>
          {/* <div className={styles.gridtitle}>Insurance Status</div>
          <div className={styles.griditem}>{data.insuranceStatus}</div> */}
          <div className={styles.gridtitle}>Insurance Doc</div>
          <a href='#'>
            {' '}
            <div className={styles.griditem}>
              {data.insuranceDoc?.slice(20) ?? 'NA'}
            </div>
          </a>

          {/* <div className={styles.gridtitle}>Pollution from Date </div>
          <div className={styles.griditem}>{data.polutionFrom ?? 'NA'}</div> */}
          <div className={styles.gridtitle}>Pollution to Date</div>
          <div className={styles.griditem}>
            {data.polutionTill?.toString()?.split('-')?.reverse().join('-') ??
              'NA'}
          </div>
          {/* <div className={styles.gridtitle}>Insurance Type</div>
          <div className={styles.griditem}>{data.insuranceType ?? 'NA'}</div> */}
          {/* <div className={styles.gridtitle}>Insurance from Date</div>
          <div className={styles.griditem}>
            {data.insuranceFrom?.toString()?.split('-')?.reverse().join('-') ??
              'NA'}
          </div> */}
          <div className={styles.gridtitle}>Insurance Expriy Date</div>
          <div className={styles.griditem}>
            {data.insuranceTill?.toString()?.split('-')?.reverse().join('-') ??
              'NA'}
          </div>
          <div className={styles.gridtitle}> Permit Expiry Date</div>
          <div className={styles.griditem}>
            {data.permitExpiryDate?.toString()?.split('-')?.reverse().join('-')}
          </div>
          <div className={styles.gridtitle}>Permit Type</div>
          <div className={styles.griditem}>{data.permitType ?? 'NA'}</div>
          <div className={styles.gridtitle}>Permit Doc</div>
          <a href='#'>
            {' '}
            <div className={styles.griditem}>
              {data.permitDoc?.slice(20) ?? 'NA'}
            </div>
          </a>
          <div className={styles.gridtitle}>Owner Name</div>
          <div className={styles.griditem}>{data.ownerName ?? 'NA'}</div>
          <div className={styles.gridtitle}>Owner Mobile No.</div>
          <div className={styles.griditem}>{data.ownerMobile ?? 'NA'}</div>
          <div className={styles.gridtitle}>Owner Email</div>
          <div className={styles.griditem}>{data.ownerEmail ?? 'NA'}</div>
          <div className={styles.gridtitle}>Fitness Expiry Date</div>
          <div className={styles.griditem}>
            {data.fitnessExpiryDate
              ?.toString()
              ?.split('-')
              ?.reverse()
              .join('-') ?? 'NA'}
          </div>
          <div className={styles.gridtitle}>Fitness Doc</div>
          <a href='#'>
            <div className={styles.griditem}>
              {data.fitnessCertDoc?.slice(20) ?? 'NA'}
            </div>
          </a>
          {/* <div className={styles.gridtitle}>Engine Capacity</div>
                <div className={styles.griditem}>{data.engineCapacity}</div> */}
          <div className={styles.gridtitle}>Wifi</div>
          <div className={styles.griditem}>{data.wifi ?? 'NA'}</div>
          {/* <div className={styles.gridtitle}>CNG Fitted</div>
                <div className={styles.griditem}>{data.cngfitted }</div> */}
          {/* <div className={styles.gridtitle}>GPS</div>
          <div className={styles.griditem}>{data.gps}</div> */}
          {/* <div className={styles.gridtitle}>GPS Installed Date</div>
                <div className={styles.griditem}>{data.gPSInstalledDate?.toString()?.split("-")?.reverse().join("-")}</div> */}
          <div className={styles.gridtitle}>AC</div>
          <div className={styles.griditem}>{data.ac}</div>
          <div className={styles.gridtitle}>Fire Extinguisher Date</div>
          <div className={styles.griditem}>
            {data.fireExtinguisherDate
              ?.toString()
              ?.split('-')
              ?.reverse()
              .join('-')}
          </div>
          <div className={styles.gridtitle}>First Aid Kit Date</div>
          <div className={styles.griditem}>
            {data.firstAidKitDate?.toString()?.split('-')?.reverse().join('-')}
          </div>
          <div className={styles.gridtitle}>Sanitized</div>
          <div className={styles.griditem}>{data.sanitized}</div>
          {/* <div className={styles.gridtitle}>Signage</div>
                <div className={styles.griditem}>{data.signage}</div> */}
          <div className={styles.gridtitle}>Vehicle Induction</div>
          <div className={styles.griditem}>
            {data.vehicleInduction?.toString()?.split('-')?.reverse().join('-')}
          </div>
          <div className={styles.gridtitle}>Standard Select</div>
          <div className={styles.griditem}>{data.standardSelect}</div>
          <div className={styles.gridtitle}>Profile Remarks</div>
          <div
            className={styles.griditem}
            style={{display: 'flex', alignItems: 'center'}}
          >
            <div>
              {data?.reActivationRemark || data?.deActivationRemark || 'NA'}
            </div>
          </div>
          <div className={styles.gridtitle}>IMEI Number</div>
          <div
            className={styles.griditem}
            style={{display: 'flex', alignItems: 'center'}}
          >
            <div>
              {data?.iMEINO || 'NA'}
            </div>
          </div>
          <div className={styles.gridtitle}>Vendor Name</div>
          <div
            className={styles.griditem}
            style={{display: 'flex', alignItems: 'center'}}
          >
            <div>
              {data?.gpsVendorName || 'NA'}
            </div>
          </div>
          {/* <div className={styles.gridtitle}>Valid Token Tax Date</div>
                <div className={styles.griditem}>{data.validTokenTaxDate?.toString()?.split("-")?.reverse().join("-")}</div> */}
        </div>
      </div>
      <div style={{width: '100%', marginTop: '15px', textAlign: 'center'}}>
        <Button
          id='btnMui123'
          variant='contained'
          sx={{ml: 0}}
          onClick={() => {
            downloadReg([
              data.polutionDoc,
              data.regCertDoc,
              data.insuranceDoc,
              data.permitDoc,
              data.fitnessCertDoc,
              data.vehiclePhoto,
            ]);
          }}
        >
          Download All Files
        </Button>
      </div>
      {/* <div style={{width:"100%", marginTop:"15px", textAlign:"center"}}><Button id='btnMui123' variant='contained' onClick={onCancel}>Cancel</Button></div> */}
    </>
  );
};

export default DetailForm;
