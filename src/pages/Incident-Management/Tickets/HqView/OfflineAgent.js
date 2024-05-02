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
const OfflineAgent = ({agentCount}) => {
    function handleSelectionType() {

    }
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    return (
        <div>
            <Grid container>
                <Grid item xs={12} sm={12} md={12}>
                    <Grid container>
                        <Grid item xs={12} sm={12} md={12} sx={{ display: "flex", justifyContent: "space-between", padding: "10px" }}>
                            <p style={{ fontWeight: "600", color: "#55555" }}>OfflineAgent ({agentCount?.length})</p>
                            <div style={{ visibility: "hidden" }}>
                                <AppSelect
                                    menus={['xyz', 'xyz', 'All Channels']}
                                    defaultValue={'All Channels'}
                                    onChange={handleSelectionType}
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
                                                <TableCell> Agents </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <img
                                                            src={'/assets/images/tickets.svg'}
                                                            style={{ width: '16px', height: '16px' }}
                                                        />
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <img
                                                            src={'/assets/images/watch.svg'}
                                                            style={{ width: '16px', height: '16px' }}
                                                        />
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <img
                                                            src={'/assets/images/timer.svg'}
                                                            style={{ width: '16px', height: '16px' }}
                                                        />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {agentCount
                                                .map((el) => {
                                                    return (
                                                        <TableRow>
                                                            <TableCell> {el?.agentName || "NA"} </TableCell>
                                                            <TableCell> {el?.inActiveAgent || 0} </TableCell>
                                                            <TableCell> {el?.activeAgent || 0} </TableCell>
                                                            <TableCell> {el?.pendingMap || 0} </TableCell>
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

export default OfflineAgent