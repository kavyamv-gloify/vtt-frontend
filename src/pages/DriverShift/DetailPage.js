import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import SmartForm from '@smart-form';
import {useAuthUser} from '@crema/utility/AuthHooks';
import regex from '@regex';
import axios from 'axios';
import api from '@api';
import SnackbarCustom from 'pages/thirdParty/SnackBar/SnackBarMsg';
import {SettingsPowerRounded} from '@mui/icons-material';
import {useState} from 'react';
import {useParams} from 'react-router-dom';
import {Box, Table, TableCell, TableRow} from '@mui/material';
import {Button} from '@mui/material';
import './style.css';

const CreateForm = () => {
  const navigate = useNavigate();
  const {user} = useAuthUser();
  const [data, setData] = useState();
  const {id} = useParams();

  const drivershiftDetail = async () => {
    const baseURL = `${api.driver.shift}/${id}`;
    let response = await axios.get(`${baseURL}`);

    setData(response.data.data);
  };

  useEffect(() => {
    drivershiftDetail();
  }, [id]);

  const commonStyles = {
    // bgcolor: '#e0e0e0',
    // borderColor: 'text.primary',
    m: 1,
    border: 1,
    width: '41rem',
    height: '15rem',
  };

  let template = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    title: 'Drive Shift Form',
    description: 'Form for applying Job',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'text',
            name: 'shiftName',
            id: 'shiftName',
            title: 'Shift Name',
            disabled: true,
            pattern: {
              value: regex.maxSize50,
              message: 'Please enter alpha-numeric and below 50 characters',
            },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
        ],
      },

      {
        layout: {column: 3, spacing: 2, size: 'small', label: 'fixed'},
        id: 'Time Information',
        fields: [
          {
            type: 'text',
            name: 'fromTime',
            id: 'fromTime',
            title: 'From Time',
            maxlength: 10,
            disabled: true,
            validationProps: {
              required: 'This is a mandatory field',
              maxLength: {
                value: 50,
                message: 'Maximum 10 characters are allowed.',
              },
            },
          },
        ],
      },

      {
        layout: {column: 3, spacing: 2, size: 'small', label: 'fixed'},
        id: 'Time Information',
        fields: [
          {
            type: 'text',
            name: 'toTime',
            id: 'toTime',
            title: 'To Time',
            maxlength: 10,
            disabled: true,
            validationProps: {
              required: 'This is a mandatory field',
              maxLength: {
                value: 10,
                message: 'Maximum 50 characters are allowed.',
              },
            },
          },
        ],
      },
    ],
  };

  function onCancel() {
    navigate(`/Master/drivershift/table`);
  }

  return (
    // <>
    //     {/* {data && data.id && (
    //         <SmartForm
    //             defaultValues={data}
    //             template={template}
    //             onCancel={onCancel}
    //             buttons={['cancel']}
    //         />
    //     )} */}

    //     <div style={{ "alignItems": "center", "alignContent": "center", "marginLeft": "500px", "marginBottom": "20px" }}>
    //         <h1 style={{ "alignItems": "center", "alignContent": "center", "fontSize": "40px" }} >Details</h1>
    //     </div>
    //     <Box sx={{ display: 'flex', justifyContent: 'center' }}>
    //         <Box sx={{ ...commonStyles, borderRadius: '16px', display: "flex", padding: "40px", }} >
    //             <div style={{ "marginLeft": "20px", }}>
    //                 <h4 style={{ "marginBottom": "20px" }}>Shift Name</h4><br />
    //                 <h4 style={{ "marginBottom": "20px" }}>From Time</h4> <br />
    //                 <h4 style={{ "marginBottom": "20px" }}>To Time</h4><br />

    //             </div>
    //             <div>
    //                 <body style={{ "marginLeft": "80px", "fontSize": "18px" }}>
    //                     <h5 style={{ "marginBottom": "20px" }}>{data?.shiftName}</h5><br />
    //                     <h5 style={{ "marginBottom": "20px" }}>{data?.fromTime}</h5><br />
    //                     <h5 style={{ "marginBottom": "13px" }}>{data?.toTime}</h5><br />

    //                 </body>
    //             </div>

    //         </Box>

    //     </Box>
    //     <Button id='btnMui123' style={{ "marginTop": "20px" }} onClick={onCancel}>Cancel</Button>
    // </>

    <>
      <div style={{textAlign: 'center'}}>
        <h1>Escort Details</h1>
      </div>
      <div className='ab'>
        {/* {arr.map((e) => {return ( */}
        <div className='grid-container'>
          <div className='grid-item bold'>Super Admin Name</div>
          <div className='grid-item'>{data?.tenantName}</div>
          <div className='grid-item bold'>Shift Name</div>
          <div className='grid-item'>{data?.shiftName ?? 'NA'}</div>
          <div className='grid-item bold'>From Time</div>
          <div className='grid-item'>{data?.fromTime}</div>
          <div className='grid-item bold'>To Time</div>
          <div className='grid-item'>{data?.toTime}</div>
        </div>
      </div>
      <div style={{width: '100%', marginTop: '15px', textAlign: 'center'}}>
        <Button id='btnMui123' variant='contained' onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </>
  );
};

export default CreateForm;
