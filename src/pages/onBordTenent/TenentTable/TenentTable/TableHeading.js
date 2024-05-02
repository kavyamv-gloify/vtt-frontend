import React from 'react';
import TableCell from '@mui/material/TableCell';
import TableHeader from '@crema/core/AppTable/TableHeader';

const TableHeading = () => {
  return (
    <TableHeader>
      <TableCell>Super Admin Logo</TableCell>
      <TableCell align='left'>Tanant Name</TableCell>
      <TableCell align='left'>Address</TableCell>
      <TableCell align='left'>Contact Person Name</TableCell>
      <TableCell align='left'>Email Id</TableCell>
      <TableCell align='left'>Mobile No.</TableCell>
      {/* <TableCell align='left'>Status</TableCell> */}
      <TableCell align='right'>Actions</TableCell>
    </TableHeader>
  );
};

export default TableHeading;
