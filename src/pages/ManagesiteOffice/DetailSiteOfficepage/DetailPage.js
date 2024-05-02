/* eslint-disable */
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
// import Steppers from '@smart-form/stepper';
// import regex from '@regex';
// import axios from 'axios';
import SmartForm from '@smart-form';
import {useParams} from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import api from '@api';
import {Box, Table, TableCell, TableRow} from '@mui/material';
import {Button} from '@mui/material';
import styles from './style.module.css';
import downDoc from '@common/fileDownload';

const DetailForm = ({id, close}) => {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  // const { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      const baseURL = `${api.siteOffice.list}/${id}`;
      let response = await axios.get(`${baseURL}`);

      setData(response.data?.data);
    }
    fetchData();
  }, [id]);

  const Container = styled.div`
    background-color: rgba(255, 255, 255, 0.8);
    border: 1px solid rgb(154, 152, 152);
    border-radius: 11px;
    margin-top: 25px;
  `;

  // let template = {
  //     layout: { column: 2, spacing: 2, size: 'small', label: 'fixed' },
  //     sections: [
  //         {
  //             layout: { column: 2, spacing: 2, size: 'medium', label: 'fixed' },
  //             fields: [
  //                 {
  //                     type: 'text',
  //                     name: 'companyName',
  //                     id: 'companyName',
  //                     title: 'Company Name',
  //                     readOnly: true,
  //                     disabled: true,
  //                 },
  //                 {
  //                     type: 'text',
  //                     name: 'companyCode',
  //                     id: 'companyCode',
  //                     title: 'Company Code',
  //                     readOnly: true,
  //                     disabled: true,
  //                 },
  //                 {
  //                     type: 'text',
  //                     name: 'companyId',
  //                     id: 'companyId',
  //                     title: 'Company Id',
  //                     readOnly: true,
  //                     disabled: true,
  //                 },
  //                 {
  //                     type: 'text',
  //                     name: 'officeName',
  //                     id: 'officeName',
  //                     title: 'Office Name',
  //                     readOnly: true,
  //                     disabled: true,
  //                 },
  //                 {
  //                     type: 'text',
  //                     name: 'officeAddress',
  //                     id: 'officeAddress',
  //                     title: 'Office Address',
  //                     readOnly: true,
  //                     disabled: true,
  //                 },
  //                 {
  //                     type: 'text',
  //                     name: 'location',
  //                     id: 'location',
  //                     title: 'Location',
  //                     readOnly: true,
  //                     disabled: true,
  //                 },
  //                 {
  //                     type: 'text',
  //                     name: 'contactPersonName',
  //                     id: 'contactPersonName',
  //                     title: 'Contact Person Name',
  //                     disabled: true,
  //                     // disabled:true,
  //                 },
  //                 {
  //                     type: 'email',
  //                     name: 'emailId',
  //                     id: 'emailId',
  //                     title: 'Email Id',
  //                     readOnly: true,
  //                     disabled: true,
  //                 },
  //                 {
  //                     type: 'text',
  //                     name: 'mobileNo',
  //                     id: 'mobileNo',
  //                     title: 'Mobile No.',
  //                     readOnly: true,
  //                     disabled: true,
  //                 },
  //                 {
  //                     type: 'text',
  //                     name: 'landLineNo',
  //                     id: 'landLineNo',
  //                     title: 'Landline No.',
  //                     readOnly: true,
  //                     disabled: true,
  //                 },
  //                 {
  //                     type: 'text',
  //                     name: 'shiftName',
  //                     id: 'shiftName',
  //                     title: 'Shift Name',
  //                     // readOnly: true,
  //                     disabled: true,
  //                 },
  //                 {
  //                     type: 'text',
  //                     name: 'startTime',
  //                     id: 'startTime',
  //                     title: 'Start Time',
  //                     // readOnly: true,
  //                     disabled: true,
  //                 },
  //                 {
  //                     type: 'text',
  //                     name: 'endTime',
  //                     id: 'endTime',
  //                     title: 'End Time',
  //                     // readOnly: true,
  //                     disabled: true,
  //                 }

  //             ]
  //         },
  //     ]
  // };

  function onCancel() {
    // navigate(`/onbordCorporate/siteOffice/siteoffice-listing`);
    close();
  }

  function downloadReg(e) {
    downDoc?.downloadDoc(e);
  }

  return (
    <>
      <div style={{textAlign: 'center'}}>{/* <h1 >Site Details</h1> */}</div>

      <div className={styles.ab}>
        {/* {arr.map((e) => {return ( */}

        <div className={styles.gridcontainer}>
          <div className={styles.gridTitle}>Company Name</div>
          <div className={styles.griditem}>{data?.companyName}</div>
          <div className={styles.gridTitle}>Company Code</div>
          <div className={styles.griditem}>{data?.companyCode ?? 'NA'}</div>

          <div className={styles.gridTitle}>Office Name</div>
          <div className={styles.griditem}>{data?.officeName}</div>
          <div className={styles.gridTitle}>Location</div>
          <div className={styles.griditem}>{data?.location?.locName}</div>
          <div className={styles.gridTitle}>Town/City</div>
          <div className={styles.griditem}>{data?.officeAddress?.city}</div>
          <div className={styles.gridTitle}>State</div>
          <div className={styles.griditem}>{data?.officeAddress?.state}</div>
          <div className={styles.gridTitle}>Pincode</div>
          <div className={styles.griditem}>{data?.officeAddress?.pinCode}</div>
          <div className={styles.gridTitle}>Contact Person First Name</div>
          <div className={styles.griditem}>{data?.contactPersonFirstName}</div>
          <div className={styles.gridTitle}>Contact Person Last Name</div>
          <div className={styles.griditem}>{data?.contactPersonLastName}</div>
          <div className={styles.gridTitle}>Email Id</div>
          <div className={styles.griditem}>{data?.emailId}</div>
          <div className={styles.gridTitle}>Mobile No.</div>
          <div className={styles.griditem}>{data?.mobileNo ?? 'NA'}</div>
          <div className={styles.gridTitle}>Landline No.</div>
          <div className={styles.griditem}>{data?.landLineNo}</div>
        </div>
      </div>
      {/* <div style={{ width: "100%", marginTop: "15px", textAlign: "center" }}><Button id='btnMui123' variant='contained' onClick={onCancel}>Cancel</Button></div> */}
    </>
  );
};

export default DetailForm;
