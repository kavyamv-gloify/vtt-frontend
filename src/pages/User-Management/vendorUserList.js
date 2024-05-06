import React, {useState} from 'react';
import {Accordion, AccordionSummary, Typography, Box} from '@mui/material';
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';

const VendorUserList = () => {
  const [expanded, setExpanded] = useState(null);

  function handleChange(e) {
    setExpanded(e || null);
  }

  const CustomExpandIcon = ({opacity}) => {
    return (
      <Box
        sx={{
          opacity: opacity ?? 'none',
          '.Mui-expanded & > .collapsIconWrapper': {display: 'none'},
          '.expandIconWrapper': {display: 'none'},
          '.Mui-expanded & > .expandIconWrapper': {display: 'block'},
        }}
      >
        <div className='expandIconWrapper'>
          <IndeterminateCheckBoxOutlinedIcon style={{color: '#407999'}} />
        </div>
        <div className='collapsIconWrapper'>
          <AddBoxOutlinedIcon style={{color: '#407999'}} />
        </div>
      </Box>
    );
  };

  const vendorData = [
    {
      applicationRole: 'ROSTER',
      userName: 'mohini',
      mobileNumber: '8978678896',
      emailId: 'mohini@etravelmate.com',
    },

    {
      applicationRole: 'ROSTER',
      userName: 'lakshmi',
      mobileNumber: '8900678896',
      emailId: 'lakshmi@etravelmate.com',
    },
    {
      applicationRole: 'ROSTER',
      userName: 'sneha',
      mobileNumber: '8900678236',
      emailId: 'sneha@etravelmate.com',
    },
    {
      applicationRole: 'ROSTER',
      userName: 'vicky',
      mobileNumber: '8118678891',
      emailId: 'vicky@etravelmate.com',
    },
  ];

  return (
    <div>
      <Accordion
        style={{padding: '10px', background: '#eeeeee', pointerEvents: 'none'}}
      >
        <AccordionSummary
          className='mb-2'
          expandIcon={<CustomExpandIcon opacity={0} />}
          aria-controls='panel1a-content'
          id='panel1a-header'
        >
          <Typography style={{width: '25%', fontWeight: 600}}>
            {' '}
            Application Roles
          </Typography>
          <Typography style={{width: '30%', fontWeight: 600}}>
            {' '}
            User Name
          </Typography>
          <Typography style={{width: '20%', fontWeight: 600}}>
            {' '}
            Mobile Number
          </Typography>
          <Typography
            style={{width: '15%', fontWeight: 600, textAlign: 'center'}}
          >
            {' '}
            Email Id
          </Typography>
          <Typography
            style={{width: '15%', textAlign: 'center', fontWeight: 600}}
          >
            {' '}
            Actions{' '}
          </Typography>
        </AccordionSummary>
      </Accordion>
      {vendorData.map((data, index) => {
        return (
          <Accordion
            style={{padding: '10px'}}
            expanded={expanded === index + 1}
            onChange={() => {
              handleChange(expanded == index + 1 ? null : index + 1);
            }}
          >
            <AccordionSummary
              className='mb-2'
              expandIcon={<CustomExpandIcon />}
              aria-controls='panel1a-content'
              id='panel1a-header'
            >
              <Typography style={{width: '25%'}}>
                {' '}
                {data.applicationRole}{' '}
              </Typography>
              <Typography style={{width: '30%'}}>{data.userName}</Typography>
              <Typography
                style={{
                  width: '20%',
                  textAlign: 'center',
                }}
              >
                {' '}
                {data.mobileNumber}{' '}
              </Typography>

              <Typography
                style={{
                  width: '15%',
                  textAlign: 'center',
                }}
              >
                {' '}
                {data.emailId}{' '}
              </Typography>
              <Typography
                style={{width: '15%', textAlign: 'center', color: '#0000EE'}}
                onClick={(eve) => {
                  eve.stopPropagation();
                }}
              >
                <>
                  <u>Edit</u>
                  <u
                    style={{
                      marginLeft: '10px',
                      display: index == 0 ? 'none' : '',
                    }}
                  >
                    Deactivate
                  </u>
                </>
              </Typography>
            </AccordionSummary>
          </Accordion>
        );
      })}
    </div>
  );
};

export default VendorUserList;
