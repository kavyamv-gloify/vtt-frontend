import {TableCell, TableHead, TableRow, TextField} from '@mui/material';
import React from 'react';

const Heading = () => {
  return (
    <TableHead>
      <TableRow>
        <TableCell align='center' colSpan={10}>
          Information relating to exposures in Foreign Currency as on
          <TextField
            InputLabelProps={{shrink: true, required: true}}
            type='date'
            variant='standard'
            sx={{ml: 2, mr: 2}}
          />{' '}
          Name of the bank <TextField variant='standard' sx={{ml: 2, mr: 2}} />
        </TableCell>
        <TableCell align='center' colSpan={6}>
          Information relating to exposures in Foreign Currency as on
          <TextField variant='standard' sx={{ml: 2, mr: 2}} />
          Name of the bank
          <TextField variant='standard' sx={{ml: 2, mr: 2}} />
        </TableCell>
        <TableCell align='center' sx={{minWidth: '150px'}} rowSpan={5}>
          C. INR/FCY currency swaps based on Rupee Liability (above USD 25
          million equivalent be reported)
        </TableCell>
        <TableCell
          sx={{minWidth: '150px'}}
          key='Head-17'
          align='center'
          rowSpan={5}
        >
          Action
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell align='center' colSpan={10}>
          A. Exposures and Hedges based on Underlying Transactions (USD Million)
        </TableCell>
        <TableCell align='center' colSpan={6}>
          B. Exposures and Hedges based on Past Performance (USD Million)
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          rowSpan={3}
          sx={{minWidth: '50px'}}
          key='Head-1'
          align='center'
        >
          Sr. No.
        </TableCell>
        <TableCell
          rowSpan={3}
          sx={{minWidth: '200px'}}
          key='Head-2'
          align='center'
        >
          Name of Corporate
        </TableCell>
        <TableCell align='center' colSpan={6}>
          Trade Related
        </TableCell>
        <TableCell align='center' colSpan={2}>
          Non - Trade
        </TableCell>
        <TableCell align='center' colSpan={6}></TableCell>
      </TableRow>
      <TableRow>
        <TableCell align='center' colSpan={2}>
          Exports
        </TableCell>
        <TableCell align='center' colSpan={2}>
          Imports
        </TableCell>
        <TableCell align='center' colSpan={2}>
          Short Term Finance Outstanding
        </TableCell>
        <TableCell
          sx={{minWidth: '150px'}}
          rowSpan={2}
          key='Head-9'
          align='center'
        >
          Expo sures
        </TableCell>
        <TableCell
          sx={{minWidth: '150px'}}
          rowSpan={2}
          key='Head-10'
          align='center'
        >
          Amount hedged
        </TableCell>
        <TableCell align='center' colSpan={3}>
          Exports
        </TableCell>
        <TableCell align='center' colSpan={3}>
          Imports
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell sx={{minWidth: '150px'}} key='Head-3' align='center'>
          Expo sures
        </TableCell>
        <TableCell sx={{minWidth: '150px'}} key='Head-4' align='center'>
          Amount hedged
        </TableCell>
        <TableCell sx={{minWidth: '150px'}} key='Head-5' align='center'>
          Expo sures
        </TableCell>
        <TableCell sx={{minWidth: '150px'}} key='Head-6' align='center'>
          Amount hedged
        </TableCell>
        <TableCell sx={{minWidth: '150px'}} key='Head-7' align='center'>
          Expo sures
        </TableCell>
        <TableCell sx={{minWidth: '150px'}} key='Head-8' align='center'>
          Amount hedged
        </TableCell>
        <TableCell sx={{minWidth: '150px'}} key='Head-11' align='center'>
          Eligible limits
        </TableCell>
        <TableCell sx={{minWidth: '150px'}} key='Head-12' align='center'>
          Cum. Amount hedged
        </TableCell>
        <TableCell sx={{minWidth: '150px'}} key='Head-13' align='center'>
          Amount O/S
        </TableCell>
        <TableCell sx={{minWidth: '150px'}} key='Head-14' align='center'>
          Eligible limits
        </TableCell>
        <TableCell sx={{minWidth: '150px'}} key='Head-15' align='center'>
          Cum. Amount hedged
        </TableCell>
        <TableCell sx={{minWidth: '150px'}} key='Head-16' align='center'>
          Amount O/S
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

export default Heading;
