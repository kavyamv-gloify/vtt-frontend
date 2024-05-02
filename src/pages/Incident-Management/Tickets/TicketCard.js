import React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import AppCard from '@crema/core/AppCard';
import Button from '@mui/material/Button';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import LineWeightOutlinedIcon from '@mui/icons-material/LineWeightOutlined';
import LabelImportantOutlinedIcon from '@mui/icons-material/LabelImportantOutlined';
import PhoneIcon from '@mui/icons-material/Phone';
import moment from 'moment';
import { Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { tooltipClasses } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
// import LinearWithValueLabel from '../Common Component/LinearProgress/LinearProgress';
// import LinearWithValueLabel from './LinearProgress';
const TicketCardView = ({
  status,
  subject,
  name,
  date,
  ticketCode,
  departMentName,
  conversation,
  channel,
}) => {

  const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} arrow/>
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }));

  
  return (
    <HtmlTooltip
        title={
          <>
            <Typography color="inherit"><b>Ticket Detail</b></Typography>
            <h5><b>Name : </b> <em>{name}</em></h5>
            <h5><b>Subject : </b> <em>{subject}</em></h5>
            <h5><b>Ticket Code : </b> <em>{ticketCode}</em></h5>
            <h5><b>Status : </b> <em>{status}</em></h5>
            <h5><b>Channel : </b> <em>{channel}</em></h5>
          </>
        }
      >
    <Box
      sx={{
        borderRadius: '8px',
        backgroundColor: '#F4F7FE',
        // backgroundColor: 'white',
        padding: '10px',
        marginTop: '15px',
        marginBottom: '12px',
      }}
    >
      <Box
        display={'flex'}
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          display: 'flex',
          marginBottom: '6px',
        }}
      >
        <Box
          component='h3'
          sx={{
            fontWeight: 600,
            fontSize: 14,
            textAlign: 'left',
            // lineHeight: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: '250px',
            whiteSpace: 'noWrap',
          }}
        >
          {subject}
        </Box>
        <Avatar
          sx={{
            display: 'flex',
            alignItems: 'center',
            m: '0',
            mr: 2,
            height: 30,
            width: 30,
            backgroundColor: status === "UNASSIGNED"? "#E6B0AA" : status === "PENDING" ?"#F7DC6F":
            status === "CLOSED" ? "#ABEBC6" : status === "HOLD" ? "#EDBB99" : "pink" ,
          }}
        >
          {/* <img
          src={'/assets/images/halftime.svg'}
          alt=''
          style={{width: '25px'}}
        /> */}
        </Avatar>
      </Box>

      <Box
        sx={{
          display: 'flex',
          marginBottom: '10px',
          color: '#5D6D7E',
          marginTop: '5px',
        }}
      >
        <Box
          component='h5'
          sx={{
            fontWeight: 400,
            fontSize: 12,
            textAlign: 'left',
            lineHeight: 1,
          }}
        >
          <u>{'#' + ticketCode}</u>
        </Box>
        <Box
          component='h5'
          sx={{
            fontWeight: 400,
            fontSize: 12,
            textAlign: 'left',
            lineHeight: 1,
            marginLeft: '10px',
          }}
        >
          {name}
        </Box>
      </Box>
      <Box sx={{display: 'flex', marginBottom: '10px', color: '#5D6D7E'}}>
        <Box
          component='h5'
          sx={{
            fontWeight: 400,
            fontSize: 12,
            textAlign: 'left',
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AccessTimeOutlinedIcon
            sx={{
              fontSize: 'small',
              color: 'green',
              fontWeight: '800',
              marginRight: '5px',
            }}
          />
          {moment(date)?.format('D MMM')}.
        </Box>
        <Box
          component='h5'
          sx={{
            fontWeight: 400,
            fontSize: 12,
            textAlign: 'left',
            lineHeight: 1,
            marginLeft: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={'/assets/images/Departments.svg'}
            style={{width: '10px', height: '10px', marginRight: '5px'}}
          />
          {conversation}
        </Box>
      </Box>
      <Box sx={{display: 'flex', marginBottom: '10px', color: '#5D6D7E'}}>
        <Box
          component='h5'
          sx={{
            fontWeight: 400,
            fontSize: 12,
            textAlign: 'left',
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {channel}
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Button
          variant='outlined'
          disabled={true}
          size='small'
          sx={{width: '100px', fontSize: '10px'}}
        >
          <LabelImportantOutlinedIcon sx={{fontSize: 'small'}} />
          {status}
        </Button>
        <Box
          component='h5'
          sx={{
            fontWeight: 400,
            fontSize: 12,
            textAlign: 'left',
            lineHeight: 1,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <PhoneIcon
            sx={{
              fontSize: 'medium',
              color: '#AEB6BF',
              marginLeft: '20px',
            }}
          /> 
          <LineWeightOutlinedIcon sx={{fontSize: 'medium', color: '#AEB6BF'}} />
        </Box>
      </Box>
    </Box>
    </HtmlTooltip>

  );
};

export default TicketCardView;
