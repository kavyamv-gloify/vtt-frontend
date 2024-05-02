/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@mui/styles';
import {useTheme} from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import Attachment from '../Attachment';

const useStyles1 = makeStyles(() => ({
  root: {
    flexShrink: 0,
    marginLeft: useTheme().spacing(2.5),
  },
}));

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const {count, page, rowsPerPage, onChangePage} = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label='first page'
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label='previous page'
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label='next page'
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label='last page'
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

function createData(name, calories, fat) {
  return {name, calories, fat};
}

const useStyles2 = makeStyles({
  table: {
    minWidth: 500,
  },
});

export default function TableField({columns, rows}) {
  const classes = useStyles2();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, rows && rows.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const attachment = (atms) => {
    let ats = [];
    atms.forEach((element) => {
      ats.push(
        <Attachment
          src={element}
          style={{float: 'left', marginRight: '5px'}}
        />,
      );
    });
    return ats;
  };
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label='custom pagination table'>
        {columns && columns.titles && (
          <TableHead>
            <TableRow className='h-64'>
              {columns.titles.map((column, i) => {
                return (
                  <TableCell
                    className='p-4 md:p-16'
                    key={i}
                    align='left'
                    padding='none'
                  >
                    {column}
                  </TableCell>
                );
              }, this)}
            </TableRow>
          </TableHead>
        )}
        <TableBody>
          {rows &&
            rows.map((row) => (
              <TableRow key={row.name}>
                {columns &&
                  columns.ids.map((clm, index) => (
                    <TableCell component='th' scope='row'>
                      {}
                      {}
                      {clm == 'attList' && row[clm] != null && row[clm] != ''
                        ? attachment(row[clm])
                        : (clm == 'attachmentId' ||
                            clm.indexOf('Attachment') >= 0) &&
                          row[clm] != null &&
                          row[clm] != ''
                        ? attachment([row[clm]])
                        : row[clm] != null && row[clm] != ''
                        ? row[clm]
                        : '-'}
                    </TableCell>
                  ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
