import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import {visuallyHidden} from '@mui/utils';
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  if (!array?.length) return;
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'date',
    numeric: false,
    disablePadding: false,
    label: 'Date',
  },
  {
    id: 'shiftName',
    numeric: false,
    disablePadding: false,
    label: 'Shift Name',
  },
  {
    id: 'shiftType',
    numeric: false,
    disablePadding: false,
    label: 'Shift Type',
  },
  {
    id: 'login',
    numeric: true,
    disablePadding: false,
    label: 'Login',
  },
  // {
  //     id: 'logout',
  //     numeric: true,
  //     disablePadding: false,
  //     label: 'Logout',
  // },
  {
    id: 'femaleCount',
    numeric: true,
    disablePadding: false,
    label: 'Female Employees',
  },
  {
    id: 'maleCount',
    numeric: true,
    disablePadding: false,
    label: 'Male Employees',
  },
  {
    id: 'totalEmployees',
    numeric: true,
    disablePadding: false,
    label: 'Total Employees',
  },
  // {
  //     id: 'action',
  //     numeric: true,
  //     disablePadding: false,
  //     label: 'Action',
  // },
];

function EnhancedTableHead(props) {
  const {order, orderBy, onRequestSort} = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead style={{background: '#f4f4f4'}}>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'left' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component='span' sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default function EnhancedTableCreate({SelectedShiftData}) {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  return (
    <Box sx={{width: '100%', marginTop: '20px'}}>
      <Paper sx={{width: '100%', mb: 2}}>
        <TableContainer>
          <Table
            sx={{minWidth: 750}}
            style={{borderTop: '1px solid #e3e0e0'}}
            aria-labelledby='tableTitle'
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={SelectedShiftData?.length}
            />
            <TableBody>
              {SelectedShiftData?.length > 0 &&
                stableSort(SelectedShiftData, getComparator(order, orderBy))
                  // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        style={{background: index % 2 == 0 ? '' : '#f1fbff'}}
                        hover
                        tabIndex={-1}
                        key={row.empid}
                      >
                        <TableCell
                          component='th'
                          id={labelId}
                          scope='row'
                          padding='normal'
                        >
                          {row.id?.split('__')[1] == 'LOGIN'
                            ? row.date
                            : row.logoutDate}
                        </TableCell>
                        <TableCell align='left'>{row.shiftName}</TableCell>
                        <TableCell align='left'>
                          {row.id?.split('__')[1]}
                        </TableCell>
                        <TableCell align='left'>{row.time}</TableCell>
                        {/* <TableCell align="left">{(row.id?.split('__')[1] == 'LOGOUT') ? (row.time) : "NA"}</TableCell> */}
                        <TableCell align='left'>{row.femaleCount}</TableCell>
                        <TableCell align='left'>{row.maleCount}</TableCell>
                        <TableCell align='left'>{row.count}</TableCell>
                        {/* <TableCell align="left"><CancelOutlinedIcon sx={{ color: "#eb916a" }} /></TableCell> */}
                      </TableRow>
                    );
                  })}
            </TableBody>
          </Table>
        </TableContainer>
        {/* <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                /> */}
      </Paper>
    </Box>
  );
}
