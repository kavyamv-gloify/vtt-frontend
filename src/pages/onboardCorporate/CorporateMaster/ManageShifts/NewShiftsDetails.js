/* eslint-disable */
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import SmartForm from '@smart-form';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import {useAuthUser} from '@crema/utility/AuthHooks';
import api from '@api';
import './style.css';

const DetailForm = ({id, close}) => {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  // const { id } = useParams();
  const {user} = useAuthUser();

  useEffect(() => {
    async function fetchData() {
      const baseURL = `${api.manageshifts.createform}/${id}`;

      let response = await axios.get(baseURL);

      setData(response.data.data);
    }
    fetchData();
  }, [id]);

  function onCancel() {
    close(false);
    navigate(`/onboardCorporate/shift/shift-listing`);
  }
  return (
    <>
      <div style={{textAlign: 'center'}}>
        {/* <h1 >Shift User Details</h1> */}
      </div>
      <div className='shift-ab'>
        {/* {arr.map((e) => {return ( */}
        <div className='shift-grid-container'>
          <div className='shift-grid-item shift-bold'>Login</div>
          <div className='shift-grid-item'>{data?.shiftStart}</div>
          <div className='shift-grid-item shift-bold'>Logout</div>
          <div className='shift-grid-item'>{data?.shiftEnd}</div>
          <div className='shift-grid-item shift-bold'>Pickup Mode</div>
          <div className='shift-grid-item'>{data?.pickupType}</div>
          <div className='shift-grid-item shift-bold'>Shift Name</div>
          <div className='shift-grid-item'>{data?.shiftName}</div>
          {/* <div className="shift-grid-item shift-bold">Pick Up type</div>
                    <div className="shift-grid-item">{data?.pickupType}</div> */}
          <div className='shift-grid-item shift-bold'>Remarks</div>
          <div className='shift-grid-item'>{data?.remarks}</div>
          <div className='shift-grid-item shift-bold'>Status Remarks</div>
          <div
            className='shift-grid-item'
            style={{display: 'flex', alignItems: 'center'}}
          >
            <div>
              {data?.reActivationRemark || data?.deActivationRemark || 'NA'}
            </div>
          </div>
        </div>
        {/* )})} */}
      </div>
      {/* <div style={{width:"100%", marginTop:"15px", textAlign:"center"}}><Button id='btnMui123' variant='contained' onClick={onCancel}>Cancel</Button></div> */}
    </>
  );
};

export default DetailForm;
