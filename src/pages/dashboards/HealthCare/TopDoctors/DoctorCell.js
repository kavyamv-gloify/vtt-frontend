import React from 'react';
import TableCell from '@mui/material/TableCell';
import {Box, IconButton} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import PropTypes from 'prop-types';
import {blue, green, orange, red} from '@mui/material/colors';
import {Fonts} from 'shared/constants/AppEnums';
import Tooltip from '@mui/material/Tooltip';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import {ReactComponent as Adhoc} from 'pages/SVG/Adhoc.svg';

const getProgressColor = (progress) => {
  switch (progress) {
    case 'SCHEDULE':
      return `${orange[600]}`;
    case 'STARTED':
      return `${green[600]}`;
    default:
      return `${red[600]}`;
  }
};

const TableItem = ({row}) => {
  return (
    <TableRow
      key={row.tripCode}
      sx={{
        '& .tableCell': {
          fontSize: 13,
          borderBottom: '0 1px',
          padding: 2,
          whiteSpace: 'nowrap',
          '&:first-of-type': {
            pl: 5,
          },
          '&:last-of-type': {
            pr: 5,
          },
        },
      }}
      className='item-hover'
    >
      {/* <TableCell
        align='left'
        sx={{
          whiteSpace: 'no-wrap',
        }}
        className='tableCell'
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <IconButton
            sx={{
              height: 30,
              width: 30,
              p: 0,
            }}
          >
            <CalendarMonthIcon
              style={{
                color: 'green',
              }}
              // onClick={() => handleTripTypeChange(el.title, 'regular')}
            />
          </IconButton>
          <IconButton
            sx={{
              height: 30,
              width: 30,
              p: 0,
            }}
          >
            <Adhoc
              fill={'#0E86D4'}
              height='0.7em'
              width='0.7em'
              // onClick={() => handleTripTypeChange(el.title, 'adoc')}
            />
          </IconButton>
        </Box>
      </TableCell> */}
      <TableCell
        align='left'
        sx={{
          whiteSpace: 'no-wrap',
        }}
        className='tableCell'
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {/* <Avatar>{row.customerName[0].toUpperCase()}</Avatar> */}
          <Box
            component='span'
            sx={{
              // mt: 1,
              // ml: 3.5,
              flexDirection: 'column',
              fontWeight: Fonts.SEMI_BOLD,
            }}
          >
            <div>{row.customerName}</div>
            <div style={{fontSize: '0.7rem', fontWeight: Fonts.LIGHT}}>
              {row.vendorName}
            </div>
          </Box>
        </Box>
      </TableCell>
      <TableCell scope='row' className='tableCell'>
        {row.tripCode}
      </TableCell>
      <TableCell align='left' className='tableCell'>
        {row.tripType}
      </TableCell>
      <TableCell align='left' className='tableCell' fontWeight={Fonts.MEDIUM}>
        <div style={{fontWeight: Fonts.SEMI_BOLD}}>{row.vehicleNo}</div>
        <div style={{fontSize: '0.7rem', fontWeight: Fonts.LIGHT}}>
          {row.driverName}
        </div>
      </TableCell>
      <TableCell
        align='left'
        sx={{
          whiteSpace: 'no-wrap',
          width: '120px',
        }}
        className='tableCell'
      >
        <Tooltip title={row?.fromAddress} placement='top-start' arrow>
          <span>
            {row?.fromAddress
              ? row.fromAddress.split(',').slice(0, 2).join(', ')
              : 'N/A'}
          </span>
        </Tooltip>
      </TableCell>
      <TableCell
        align='left'
        sx={{
          whiteSpace: 'no-wrap',
          width: '120px',
        }}
        className='tableCell'
        // style={{width: '120px'}}
      >
        <Tooltip title={row?.toAddress} placement='top-start' arrow>
          <span>
            {row?.toAddress
              ? row.toAddress.split(',').slice(0, 2).join(', ')
              : 'N/A'}
          </span>
        </Tooltip>
      </TableCell>
      <TableCell
        align='left'
        sx={{
          color: getProgressColor(row.tripStatus),
        }}
        className='tableCell'
      >
        <Box
          component='span'
          sx={{
            fontWeight: Fonts.REGULAR,
          }}
        >
          {row.tripStatus}
        </Box>
      </TableCell>
      <TableCell align='left' className='tableCell'>
        {row.tripCategory}
      </TableCell>
    </TableRow>
  );
};

export default TableItem;

TableItem.propTypes = {
  row: PropTypes.object.isRequired,
};
