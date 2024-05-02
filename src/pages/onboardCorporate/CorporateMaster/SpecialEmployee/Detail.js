import React, {useEffect, useState} from 'react';
import axios from 'axios';
import style from './style.module.css';
import Api from '@api';

const DetailPage = ({id, close}) => {
  const [data, setData] = useState({});

  useEffect(() => {
    async function fetchData() {
      const baseURL = `${Api.specialEmployee.getbyId}/${id}`;
      let response = await axios.get(baseURL);
      setData(response.data.data);
    }
    fetchData();
  }, [id]);

  return (
    <>
      <div style={{textAlign: 'center'}}>
        {/* <h1 >Department Details</h1> */}
      </div>
      <div className={style.abspecial}>
        {/* {arr.map((e) => {return ( */}
        <div className={style['grid-container']}>
          <div className={style.griditem}>Category Name</div>
          <div className={style.griditems}>{data.categoryName}</div>
          <div className={style.griditem}>Strength</div>
          <div className={style.griditems}>{data.size}</div>
          <div className={style.griditem}>Guard Is Required</div>
          <div className={style.griditems}>{data.guardisRequired}</div>
          <div className={style.griditem}>Exclusive vehicle</div>
          <div className={style.griditems}>{data.exclusiveVehicle}</div>
        </div>
        {/* )})} */}
      </div>
      {/* <div style={{width:"100%", marginTop:"15px", textAlign:"center"}}><Button id='btnMui123' variant='contained' onClick={onCancel}>Cancel</Button></div> */}
    </>
  );
};

export default DetailPage;
