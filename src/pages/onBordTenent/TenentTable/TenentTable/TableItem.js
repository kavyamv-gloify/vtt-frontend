/* eslint-disable */
import React from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import TenentActions from './TenentActions';
import { styled } from '@mui/material/styles';
import _ from '@lodash';

const StyledTableCell = styled(TableCell)(() => ({
  fontSize: 14,
  padding: 8,
  '&:first-of-type': {
    paddingLeft: 20,
  },
  '&:last-of-type': {
    paddingRight: 20,
  },
}));
const TableItem = ({ data }) => {
  // const getPaymentStatusColor = () => {
  //   switch (data.status) {
  //     case 'Pending': {
  //       return '#F84E4E';
  //     }
  //     case 'Delivered': {
  //       return '#43C888';
  //     }
  //     default: {
  //       return '#E2A72E';
  //     }
  //   }
  // };

  return (
    <>
      {(_.isEmpty(data)) ? "No Records Found" : null}
      <TableRow key={data.name} className='item-hover'>
        <StyledTableCell component='th' scope='row'>
          <Box
            sx={{
              color: 'primary.main',
              borderBottom: (theme) => `1px solid ${theme.palette.primary.main}`,
              display: 'inline-block',
            }}
          >
            {data.id}
          </Box>
        </StyledTableCell>
        <StyledTableCell align='left'>{data.first_name}</StyledTableCell>
        <StyledTableCell align='left'>{data.last_name}</StyledTableCell>
        <StyledTableCell align='left'>{data.email}</StyledTableCell>
        <StyledTableCell align='left'>{data.gender}</StyledTableCell>
        <StyledTableCell align='left'>{data.ip_address}</StyledTableCell>
        {/* <StyledTableCell align='left'>
          <Box
            sx={{
              color: getPaymentStatusColor(),
              backgroundColor: getPaymentStatusColor() + '44',
              padding: '3px 5px',
              borderRadius: 1,
              fontSize: 14,
              display: 'inline-block',
            }}
          >
            {data.status}
          </Box>
        </StyledTableCell> */}
        <TableCell align='right'>
          <TenentActions />
        </TableCell>
      </TableRow>
    </>
  );
};

export default TableItem;

TableItem.propTypes = {
  data: PropTypes.object.isRequired,
};
