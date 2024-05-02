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
import './style.module.css';
import Api from '@api';

const DetailForm = ({id, close}) => {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  // const { id } = useParams();
  const {user} = useAuthUser();

  useEffect(() => {
    const baseURL = `${api.nodal.nodalpoint}/${id}`;

    // const baseURL = api?.nodal?.nodalpoint;
    let temAr = [];
    axios
      .get(baseURL)
      .then((response) => {
        response?.data?.data?.map((r) => {
          temAr.push({title: r?.locName, value: r?.id});
        });
        setShifts(temAr);
      })
      .catch((er) => {});
    // const baseURL = Api?.masters?.getallNodal;
    // let temAr = [];
    // axios
    //   .get(baseURL)
    //   .then((response) => {
    //     response?.data?.data?.map((r) => {
    //
    //       temAr.push({title: r?.locName, value: r?.id});
    //     });
    //     setShifts(temAr);
    //   })
    //   .catch((er) => {
    //
    //   });

    async function fetchData() {
      const baseURL = `${api.nodal.nodalpoint}/${id}`;
      let response = await axios.get(`${baseURL}`);

      setData(response?.data?.data);
      // if (response?.data?.data?.length) {
      //   let temObj = response?.data?.data[0];
      //   // temObj.shifts = temObj.shifts.toString();

      // }
    }
    fetchData();
  }, [id]);
  // function onCancel() {
  //     navigate(`/onbordTenent/NodelPoint/table`);
  // }

  function onCancel() {
    // navigate(`/onbordTenent/NodelPoint/table`);
    close();
  }
  return (
    <>
      <div className='ab'>
        <div className='grid-container'>
          <div className='grid-item bold'>Location</div>
          <div className='grid-item'>{data?.geoPoint?.locName}</div>
          <div className='grid-item bold'></div>
          <div className='grid-item'></div>
          {/* <div className="grid-item bold">Landmark</div>
                    <div className="grid-item">{data.landmark}</div> */}
          {/* <div className="grid-item bold">Point Name</div>
                    <div className="grid-item">{data.pointName}</div> */}
          <div className='grid-item bold'>Latitude</div>
          <div className='grid-item'>{data?.geoPoint?.latitude}</div>
          <div className='grid-item bold'>Longitude</div>
          <div className='grid-item'>{data?.geoPoint?.longitude}</div>
          <div className='grid-item bold'>Nodal Stop Name</div>
          <div className='grid-item'>{data.nodalStopName}</div>
          <div className='grid-item bold'>Distance From Office</div>
          <div className='grid-item'>{data.distancefromOffice}</div>
          {/* <div className="grid-item bold">Geo Point</div>
                    <div className="grid-item">{data.geoPoint}</div> */}
        </div>
        {/* )})} */}
      </div>
      {/* <div style={{width:"100%", marginTop:"15px", textAlign:"center"}}><Button id='btnMui123' variant='contained' onClick={onCancel}>Cancel</Button></div> */}
    </>
  );
};

export default DetailForm;
