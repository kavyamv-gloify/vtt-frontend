/* eslint-disable */
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import SmartForm from '@smart-form';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import api from '@api';
import {Box, Table, TableCell, TableRow} from '@mui/material';
import {Button} from '@mui/material';
import './style.css';
import downDoc from '@common/fileDownload';

const DetailForm = ({id}) => {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  // const { id } = useParams();

  //

  useEffect(() => {
    async function fetchData() {
      const baseURL = `${api.onBoardCorporate.list}/${id}`;
      let response = await axios.get(`${baseURL}`);

      setData(response.data.data);
    }
    fetchData();
  }, [id]);

  const commonStyles = {
    // bgcolor: '#e0e0e0',
    // borderColor: 'text.primary',
    m: 1,
    border: 1,
    width: '45rem',
    height: '42rem',
  };

  function dataDownload(d) {
    if (typeof d == 'string') downDoc?.downloadDoc(d);
    else {
      d?.map((el) => {
        downDoc?.downloadDoc(el);
      });
    }
  }
  function onCancel() {
    navigate(`/onbordCorporate/siteOffice/list`);
  }
  function onCancel() {
    navigate(`/onbordCorporate/list`);
  }
  return (
    <>
      {/* <div style={{ "textAlign": "center" }}>
                <h1 >Corporate Details</h1>
            </div> */}
      <div className='ab'>
        {/* {arr.map((e) => {return ( */}
        <div className='grid-container'>
          <div className='grid-item bold'>Company Name</div>
          <div className='grid-item'>{data?.companyName}</div>
          <div className='grid-item bold'>Adress</div>
          <div className='grid-item'>{data.companyAddress?.addressName}</div>
          <div className='grid-item bold'>City</div>
          <div className='grid-item'>{data.companyAddress?.city}</div>
          <div className='grid-item bold'>State</div>
          <div className='grid-item'>{data.companyAddress?.state}</div>
          <div className='grid-item bold'>Pincode</div>
          <div className='grid-item'>{data.companyAddress?.pinCode}</div>
          <div className='grid-item bold'>GSTIN No.</div>
          <div className='grid-item'>{data.companyGSTN}</div>
          <div className='grid-item bold'>GSTIN No. Doc</div>
          <div
            className='grid-item'
            onClick={() => dataDownload(data.companyGstnDoc)}
          >
            <a href='#'>{data?.companyGstnDoc?.slice(20)}</a>
          </div>
          <div className='grid-item bold'>Contact Person First Name</div>
          <div className='grid-item'>{data.contactPersonFirstName}</div>
          <div className='grid-item bold'>Contact Person Last Name</div>
          <div className='grid-item'>{data.contactPersonLastName}</div>
          <div className='grid-item bold'>Mobile No</div>
          <div className='grid-item'>{data.mobileNo}</div>
          <div className='grid-item bold'>Landline No</div>
          <div className='grid-item'>{data.landLineNo}</div>
          <div className='grid-item bold'>Email Id</div>
          <div className='grid-item'>{data.emailId}</div>
          <div className='grid-item bold'>Account Name</div>
          <div className='grid-item'>{data.accountName}</div>
          <div className='grid-item bold'>Bank Name</div>
          <div className='grid-item'>{data.bankName}</div>
          <div className='grid-item bold'>Branch Name</div>
          <div className='grid-item'>{data.branchName}</div>
          <div className='grid-item bold'>Bank AccountNumber</div>
          <div className='grid-item'>{data.accountNumber}</div>
          <div className='grid-item bold'>IFSC Code</div>
          <div className='grid-item'>{data.ifscCode}</div>

          <div className='grid-item bold'>Registration Number</div>
          <div className='grid-item'>{data.companyRegNo}</div>
          <div className='grid-item bold'>Registration Doc</div>
          <div
            className='grid-item'
            onClick={() => dataDownload(data.companyRegDoc)}
          >
            <a href='#'>{data.companyRegDoc?.slice(20)}</a>
          </div>
          <div className='grid-item bold'>PAN No.</div>
          <div className='grid-item'>{data.companyPAN ?? 'NA'}</div>
          <div className='grid-item bold'>PAN No. Doc</div>
          <div
            className='grid-item'
            onClick={() => dataDownload(data.companyPanDoc)}
          >
            <a href='#'>{data.companyPanDoc?.slice(20)}</a>
          </div>
        </div>
      </div>
      <div style={{width: '100%', marginTop: '15px', textAlign: 'center'}}>
        {/* <Button id='btnMui123' variant='contained' onClick={onCancel}>Cancel</Button> */}
        <Button
          id='btnMui123'
          variant='contained'
          sx={{ml: 0}}
          onClick={() => {
            dataDownload([
              data.companyPanDoc,
              data.companyRegDoc,
              data.companyGstnDoc,
            ]);
          }}
        >
          Download All Files
        </Button>
      </div>
    </>
  );
};

export default DetailForm;
