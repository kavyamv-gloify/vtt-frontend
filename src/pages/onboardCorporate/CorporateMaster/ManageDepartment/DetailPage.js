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
import style from './department.module.css';
import Api from '@api';

const DetailPage = ({id, close}) => {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  // const { id } = useParams();
  const {user} = useAuthUser();

  // useEffect(() => {
  //     const baseURL = Api?.masters?.getallShift;
  //     let temAr = [];
  //     axios
  //       .get(baseURL)
  //       .then((response) => {
  //         response?.data?.data?.map((r) => {
  //
  //           temAr.push({title: r?.shiftName, value: r?.id});
  //         });
  //         setShifts(temAr);
  //       })
  //       .catch((er) => {
  //
  //       });

  //     async function fetchData() {
  //       const baseURL = `${api.department.list}/${id}`;
  //       let response = await axios.get(`${baseURL}`);
  //
  //       if (response?.data?.data?.length) {
  //         let temObj = response?.data?.data[0];
  //         // temObj.shifts = temObj.shifts.toString();
  //         setData(temObj);
  //       }
  //     }
  //     fetchData();
  //   }, [id]);
  async function fetchData() {
    const baseURL = `${Api.department.list}/${id}`;
    let response = await axios.get(`${baseURL}`);

    if (response?.data?.data?.length) {
      let temObj = response?.data?.data[0];
      let temshift = [];
      {
        temObj?.shiftData?.map((el) => {
          temshift.push(el.shiftName);
        });
      }
      // temObj.shifts = temObj.shifts.toString();
      setData({...temObj, temshift: temshift});
    }
  }
  useEffect(() => {
    fetchData();
  }, [id]);

  function onCancel() {
    // navigate(`/onboardCorporate/department/department-listing`);
    close();
  }
  return (
    <>
      <div style={{textAlign: 'center'}}>
        {/* <h1 >Department Details</h1> */}
      </div>
      <div className={style.abs}>
        <div className={style.gridcontainer}>
          <div className={style.gridtitle}>Department Name</div>
          <div className={style.griditem}>{data.departmentName}</div>
          <div className={style.gridtitle}>Description</div>
          <div className={style.griditem}>{data?.description}</div>
          <div className={style.gridtitle}>Shift</div>
          <div className={style.griditem}>{data?.temshift?.join(', ')}</div>
          <div className={style.gridtitle}>Status Remarks</div>
          <div
            className={style.griditem}
            style={{display: 'flex', alignItems: 'center'}}
          >
            <div>
              {data?.status == 'ACTIVE'
                ? data?.reActivationRemark === "null" ? "NA" : data?.reActivationRemark
                : data?.deActivationRemark === "null" ? "NA" : data?.deActivationRemark}
            </div>
          </div>
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
