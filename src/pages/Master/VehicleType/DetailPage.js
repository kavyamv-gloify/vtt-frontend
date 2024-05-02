import React, {useEffect} from 'react';
// import { useNavigate } from 'react-router-dom';
import SmartForm from '@smart-form';
import {useAuthUser} from '@crema/utility/AuthHooks';
import regex from '@regex';
// import { Button } from '@mui/material';
import axios from 'axios';
import api from '@api';
import {useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {Button} from '@mui/material';
import style from './vehicletype.module.css';
const DetailPage = ({id, close}) => {
  const [open, setOpen] = useState();
  const [boolean, setBoolean] = useState(false);
  const [snackbarMsg, setsnackBarMsg] = useState();
  const [data, setData] = useState();
  // const { id } = useParams();
  const navigate = useNavigate();

  const userVehicleTypeDetail = async () => {
    const baseURL = `${api.masterVehicletype?.id}${id}`;
    let response = await axios.get(`${baseURL}`);

    setData(response.data.data);
  };

  useEffect(() => {
    userVehicleTypeDetail();
  }, []);

  function onCancel() {
    navigate(`/Master/vehicletype/table`);
    close();
  }

  return (
    <>
      <div style={{textAlign: 'center'}}>
        {/* <h1 >Department Details</h1> */}
      </div>
      <div className={style.ab}>
        {/* {arr.map((e) => {return ( */}
        <div className={style.gridcontainer}>
          <div className={style.gridtitle}>Vehicle Variant</div>
          <div className={style.griditem}>{data?.vehicleType}</div>
          <div className={style.gridtitle}> Vehicle Type Name</div>
          <div className={style.griditem}>{data?.vehicleTypeName}</div>
          <div className={style.gridtitle}>Vehicle Occupancy</div>
          <div className={style.griditem}>{data?.vehicleOccupancy}</div>
          <div className={style.gridtitle}>Min. capacity Exclud driver</div>
          <div className={style.griditem}>
            {data?.minCapacityExcludingDriver}
          </div>
          <div className={style.gridtitle}>Max. capacity Exclud driver </div>
          <div className={style.griditem}>
            {data?.maxCapacityExcludingDriver}
          </div>
          <div className={style.gridtitle}>
            Max. capacity With Escort Exclud driver{' '}
          </div>
          <div className={style.griditem}>
            {data?.maxCapacitywithEscortExcludingdriver}
          </div>
          <div className={style.gridtitle}>Status </div>
          <div className={style.griditem}>{data?.status}</div>
        </div>
        {/* )})} */}
      </div>
      {/* <div style={{ width: "100%", marginTop: "15px", textAlign: "center" }}><Button id='btnMui123' variant='contained' onClick={onCancel}>Cancel</Button></div> */}
    </>
  );
};

export default DetailPage;
