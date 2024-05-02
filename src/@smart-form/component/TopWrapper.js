/* eslint-disable */
import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import Grid from '@mui/material/Grid';

const TopWrapper = props => {
    if(props.type && props.type == 'table'){
        return (
            <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
                <TableRow
                    className="h-48"
                >
                    <TableBody>
                        {props.children}
                    </TableBody>
                </TableRow>
            </Table>
        )
    }else if(props.type && props.type == 'flex'){
        return (
            <div style={{marginBottom: '16px', marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
                {props.children}
            </div>
        )
    }else {
        return (
            <Grid container spacing={props.spacing || 0} style={{marginBottom: '16px', marginTop: '16px'}}>
                {props.children}
            </Grid>
        )
    }
}

export default TopWrapper
