/* eslint-disable */
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import SmartForm from '@smart-form';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import {useAuthUser} from '@crema/utility/AuthHooks';
import api from '@api';
import {
  Box,
  Table,
  TableCell,
  TableRow,
  TableHead,
  TableBody,
} from '@mui/material';
import {Button} from '@mui/material';
import style from './vehiclecost.module.css';
import Api from '@api';

const DetailPage = ({id, close}) => {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  // const { id } = useParams();
  const {user} = useAuthUser();
  useEffect(() => {
    async function fetchData() {
      const baseURL = `${api.vehicleTypeCost.getbyId}/${id}`;

      let response = await axios.get(baseURL);
      setData(response.data.data);
    }
    fetchData();
  }, [id]);

  function onCancel() {
    navigate(`/onboardCorporate/vehiclecost/vehiclecost-listing`);
    close(true);
  }
  return (
    <>
      <div style={{textAlign: 'center'}}>
        {/* <h1 >Department Details</h1> */}
      </div>
      <div className={style.ab}>
        {/* {arr.map((e) => {return ( */}
        <div className={style.gridcontainer}>
          <div className={style.gridtitle}>Vehicle Type</div>
          <div className={style.griditem}>{data?.vehicleType}</div>
          <div className={style.gridtitle}>Capacity</div>
          <div className={style.griditem}>{data?.capacity}</div>
          <div className={style.gridtitle}>Speed</div>
          <div className={style.griditem}>{data?.speed}</div>
          <div className={style.gridtitle}>Cost/Km </div>
          <div className={style.griditem}>{data?.costKM}</div>
          <div className={style.gridtitle}>Trip Cost </div>
          <div className={style.griditem}>{data?.costTrip}</div>
          <div className={style.gridtitle}>Extra Km </div>
          <div className={style.griditem}>{data?.extraKMcharge}</div>
        </div>
        {/* )})} */}
      </div>
      <div style={{width: '100%', marginTop: '15px', textAlign: 'center'}}>
        <Button id='btnMui123' variant='contained' onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </>
  );
};

export default DetailPage;
