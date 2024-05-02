import React from 'react'
import { Grid } from '@mui/material';
import AppSelect from '@crema/core/AppSelect';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
const MostThreadedTickets = () => {
  function handleSelectionType() {

  }
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = () => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  const onlineAgent = [
    { name: 'AYHD46222', ticket: 'Active', resolve: '09', open: '25-06-2023' },
    { name: 'AYHD46222', ticket: 'Active', resolve: '05', open: '25-06-2023' },
    { name: 'AYHD46222', ticket: 'Active', resolve: '08', open: '25-06-2023' },
    { name: 'AYHD46222', ticket: 'Active', resolve: '10', open: '25-06-2023' },
    { name: 'AYHD46222', ticket: 'Active', resolve: '05', open: '25-06-2023' },

];



  return (
    <div>
      <Grid container>
        <Grid item xs={12} sm={12} md={12}>
          <Grid container>
            <Grid item xs={12} sm={12} md={12} sx={{ display: "flex", justifyContent: "space-between", padding: "10px" }}>
              <p style={{ fontWeight: "600", color: "#55555" }}>Most Threaded Tickets</p>
              <div style={{ visibility: "hidden" }}>
                <AppSelect
                  menus={['xyz', 'xyz', 'All Channels']}
                  defaultValue={'All Channels'}
                  onChange={handleSelectionType}
                  sx={{ visibility: "hidden" }}
                />
              </div>

            </Grid>
          </Grid>
          <hr style={{ border: '1px solid #f1f1f1' }} />
          <Grid container  style={{height: '18.8rem'}}>
            <Grid item xs={12} sm={12} md={12}>
              <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 300 }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <TableCell> Ticket No. </TableCell>
                        <TableCell> Status </TableCell>
                        <TableCell>Count </TableCell>
                        <TableCell> Updated On </TableCell>
                       
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {onlineAgent
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((el) => {
                          return (
                            <TableRow>
                              <TableCell> {el?.name} </TableCell>
                              <TableCell> {el?.ticket} </TableCell>
                              <TableCell> {el?.resolve} </TableCell>
                              <TableCell> {el?.open} </TableCell>
                            </TableRow>
                          );

                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default MostThreadedTickets