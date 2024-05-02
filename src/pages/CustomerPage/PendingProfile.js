import React, {useEffect, useState} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import axios from 'axios';
import Api from '@api';
import FormControlLabel from '@mui/material/FormControlLabel';
import TablePagination from '@mui/material/TablePagination';

const PendingProfile = () => {
  const [data, setData] = useState();
  const [list, setList] = useState();
  const [ischecked, setIsChecked] = useState([]);
  const [page, setPage] = React.useState(2);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const label = {inputProps: {'aria-label': 'Checkbox demo'}};
  useEffect(() => {
    axios
      .get(
        Api.baseUri + `/user-reg/employee-reg?page=${page}&size=${rowsPerPage}`,
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          setList(res?.data?.data?.body?.totalPages);
          setData(res?.data?.data?.body?.EmployeeList ?? []);
        }
      })
      .catch((err) => {
        setData([]);
      });
  }, [page, rowsPerPage]);

  function handleChange(e) {
    // console.log('e', e?.target?.name, e?.target?.checked);
    if (e?.target?.name == 'all') {
      const isSelected = data?.map((el) => {
        return {...el, checked: e?.target?.checked};
      });
      setData(isSelected);
    } else {
      const isSelected = data.map((el) =>
        el?.id == e?.target?.name ? {...el, checked: e?.target?.checked} : el,
      );
      console.log(isSelected);
      setData(isSelected);
    }
  }

  useEffect(() => {
    console.log('isSelected', data);
  }, [data]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    data?.map((el) => {
      el.checked = false;
    });
    setData(data);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{minWidth: 650}} aria-label='simple table'>
          <TableHead>
            <TableRow sx={{background: '#f6f6f6'}}>
              <TableCell>
                <Checkbox
                  {...label}
                  // checked={data?.map((el) => {
                  //   el?.checked == true ? true : false;
                  // })}
                  name='all'
                  onChange={(e) => {
                    handleChange(e);
                  }}
                />
              </TableCell>

              <TableCell
                align='right'
                sx={{fontWeight: '800', fontSize: '13px'}}
              >
                Name
              </TableCell>
              <TableCell
                align='right'
                sx={{fontWeight: '800', fontSize: '13px'}}
              >
                Gender
              </TableCell>
              <TableCell
                align='right'
                sx={{fontWeight: '800', fontSize: '13px'}}
              >
                Code
              </TableCell>
              <TableCell
                align='right'
                sx={{fontWeight: '800', fontSize: '13px'}}
              >
                Mobile No.
              </TableCell>
              <TableCell
                align='right'
                sx={{fontWeight: '800', fontSize: '13px'}}
              >
                Email
              </TableCell>
              <TableCell
                align='right'
                sx={{fontWeight: '800', fontSize: '13px'}}
              >
                Department
              </TableCell>
              <TableCell
                align='right'
                sx={{fontWeight: '800', fontSize: '13px'}}
              >
                Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((row, index) => (
              <TableRow
                key={row.name}
                sx={{'&:last-child td, &:last-child th': {border: 0}}}
              >
                <TableCell>
                  <Checkbox
                    {...label}
                    name={row?.id}
                    checked={row?.checked == true ? true : false}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                  />
                </TableCell>
                <TableCell align='right'>{row?.employeeFullName}</TableCell>
                <TableCell align='right'>{row?.gender}</TableCell>
                <TableCell align='right'>{row?.employeeCode}</TableCell>
                <TableCell align='right'>{row?.mobileNo}</TableCell>
                <TableCell align='right'>{row?.emailId}</TableCell>
                <TableCell align='right'>{row?.department}</TableCell>
                <TableCell align='right'>{row?.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component='div'
        count={list}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default PendingProfile;
