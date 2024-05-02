import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import SmartForm from '@smart-form';
import { useAuthUser } from '@crema/utility/AuthHooks';
import regex from '@regex';
// import { Button } from '@mui/material';
import axios from 'axios';
import api from '@api';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import style from './user.module.css';
const DetailPage = ({ data, close }) => {
  const [open, setOpen] = useState();
  const [boolean, setBoolean] = useState(false);
  const [snackbarMsg, setsnackBarMsg] = useState();

  function onCancel() {
    close();
  }

  return (
    <>
      <div style={{ textAlign: 'center' }}>
        {/* <h1 >Department Details</h1> */}
      </div>
      <div className={style.ab}>
        {/* {arr.map((e) => {return ( */}
        <div className={style.mainContainer}>
          <div className={style.gridcontainer}>
            <div className={style.gridtitle}>User Name : </div>
            <div className={style.griditem}>{data?.userName}</div>
          </div>
          <div className={style.gridcontainer}>
            <div className={style.gridtitle}>Email Id : </div>
            <div className={style.griditem}>{data?.emailId}</div>
          </div>
        </div>
        <div className={style.mobileContainer}>
          <div className={style.gridcontainer}>
            <div className={style.gridtitle}>Mobile No. : </div>
            <div className={style.griditem}>{data?.mobileNo}</div>
          </div>
        </div>
        {/* )})} */}
      </div>
      <div style={{ width: '100%', marginTop: '15px', textAlign: 'center' }}>
        <Button id='btnMui123' variant='contained' onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </>
  );
};

export default DetailPage;
