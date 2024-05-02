// import React from 'react';
// import TableCell from '@mui/material/TableCell';
// import TableRow from '@mui/material/TableRow';
// import PropTypes from 'prop-types';
// import Box from '@mui/material/Box';
// import AppMenu from '@crema/core/AppMenu';
// import Avatar from '@mui/material/Avatar';
// import {Fonts} from 'shared/constants/AppEnums';
// import Tooltip from '@mui/material/Tooltip';

// const TableItem = ({data}) => {
//   const truncateText = (text, maxLength) => {
//     if (text.length > maxLength) {
//       return text.substring(0, maxLength) + '...';
//     }
//     return text;
//   };
//   return (
//     <TableRow
//       key={data.name}
//       sx={{
//         '& .tableCell': {
//           fontSize: 13,
//           padding: 2,
//           whiteSpace: 'nowrap',
//           '&:first-of-type': {
//             pl: 5,
//           },
//           '&:last-of-type': {
//             pr: 5,
//           },
//         },
//       }}
//       className='item-hover'
//     >
//       <TableCell component='th' scope='row' className='tableCell'>
//         <Box
//           sx={{
//             display: 'flex',
//             alignItems: 'center',
//           }}
//         >
//           {/* <Avatar
//             sx={{
//               mr: 3.5,
//             }}
//             src={data.profile_pic}
//           /> */}
//           <Box
//             sx={{
//               fontWeight: Fonts.MEDIUM,
//             }}
//           >
//             {data.corpId}
//           </Box>
//         </Box>
//       </TableCell>
//       <TableCell align='center' className='tableCell'>
//         <Tooltip title={data?.city} arrow placement='top'>
//           <Box
//             sx={{
//               overflow: 'hidden',
//               textOverflow: 'ellipsis',
//               whiteSpace: 'nowrap',
//             }}
//             // title={data.city} // Display full content as tooltip
//           >
//             {truncateText(data.city, 30)} {/* Truncate to 30 characters */}
//           </Box>
//         </Tooltip>
//       </TableCell>
//       <TableCell align='center' className='tableCell'>
//         {data.totalRegTripCount || 0}
//       </TableCell>
//       <TableCell align='center' className='tableCell'>
//         {data.totalAdhocTripCount || 0}
//       </TableCell>
//       <TableCell align='center' className='tableCell'>
//         {data.billType ?? 'N/A'}
//       </TableCell>
//       <TableCell align='center' className='tableCell'>
//         {data.netRevenue || 'N/A'}
//       </TableCell>
//       <TableCell align='center' className='tableCell'>
//         {data.totalvendor || 0}
//       </TableCell>
//       <TableCell align='center'>{data.totalEmp || 0}</TableCell>
//       <TableCell align='center'>
//         <Box
// sx={{
//   color: data.status == 'ACTIVE' ? 'green' : 'red',
//   backgroundColor: '#e6e3dc' + '44',
//   padding: '3px 10px',
//   borderRadius: 1,
//   display: 'inline-block',
//   fontSize: 13,
// }}
//         >
//           {data.status}
//         </Box>
//       </TableCell>
//       {/* <TableCell align='right'>
//         <AppMenu />
//       </TableCell> */}
//     </TableRow>
//   );
// };

// export default TableItem;

// TableItem.propTypes = {
//   data: PropTypes.object.isRequired,
// };
import React from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import {Fonts} from 'shared/constants/AppEnums';
import Tooltip from '@mui/material/Tooltip';
import {Link, Rating} from '@mui/material';

const CommonTableItem = ({data, cellConfig}) => {
  return (
    <TableRow
      key={data[cellConfig?.name]}
      sx={{
        '& .tableCell': {
          fontSize: 13,
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
      {cellConfig?.cells.map((cell) => (
        <TableCell key={cell?.id} className='tableCell'>
          {/* {cell?.link ? (
            <Link
              href={cell?.link}
              style={cell?.style}
              underline='hover'
              color='inherit'
            >
              {data[cell?.id] ?? 'N/A'}
            </Link>
          ) : (
            <span style={cell?.style}>{data[cell?.id] ?? 'N/A'}</span>
          )} */}
          {cell.id === 'status' || cell.id === 'vendorStatus' ? (
            <Box
              sx={{
                ...cell.styles, // Applying dynamic styles for the status cell
                color:
                  (data?.status || data?.vendorStatus) === 'ACTIVE'
                    ? 'green'
                    : 'red',
                backgroundColor: '#e6e3dc' + '44',
                padding: '3px 10px',
                borderRadius: 1,
                display: 'inline-block',
                fontSize: 13,
              }}
            >
              {data[cell.id]}
            </Box>
          ) : cell.id === 'vendorRating' || cell.id === 'avgRating' ? (
            // Handling vendorRating cell with custom Rating component
            // <Rating value={4.5} />
            <Rating
              name='custom-rating'
              value={data[cell.id]}
              precision={0.5} // Allow half-star increments
              readOnly // Make it read-only if needed
            />
          ) : cell.link ? (
            <Link
              href={cell?.link}
              style={cell?.style}
              underline='hover'
              color='inherit'
            >
              {data[cell?.id] || 'N/A'}
            </Link>
          ) : (
            <span style={cell.styles}>{data[cell.id] || 'N/A'}</span>
          )}
        </TableCell>
      ))}
    </TableRow>
  );
};

export default CommonTableItem;
