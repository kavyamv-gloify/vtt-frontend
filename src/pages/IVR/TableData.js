import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import Api from '@api';
import {useAuthUser} from '@crema/utility/AuthHooks';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import excelDoc from '@excelupload/excelupload';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import AppTooltip from '@crema/core/AppTooltip';
import {toast} from 'react-toastify';

const TableData = () => {
  const {id, from, to} = useParams();
  const [myActions, setMyActions] = useState([]);
  const navigate = useNavigate();
  const permissionCheck = useSelector(({settings}) => settings.permissions);
  const {user} = useAuthUser();
  const [data, setData] = useState();
  const header = [
    'Emp Code',
    'Mobile No.',
    'Message Sent Time',
    'Shift Time',
    'Status',
    'Message',
    'SMS Type',
  ];

  useEffect(() => {
    if (!permissionCheck) return;
    let sub_mod = {};
    permissionCheck?.map((el) => {
      if (el.subModuleName == 'IVR') sub_mod = el;
    });
    setMyActions(sub_mod?.actions);
   if (
      (!sub_mod || !sub_mod?.actions?.includes('View')) &&
      user?.userList?.userRole !== 'SUPERADMIN'
    )
      navigate('/error-pages/error-404');
  }, [permissionCheck,user]);

  useEffect(() => {
    axios
      .post(
        Api.baseUri + `/usernotify/notification/smsDataByCorporateIdAndStatus`,
        {
          corporateId: user?.userList?.corporateId,
          status: id,
          fromDate: from,
          toDate: to,
          pageNo: 0,
          pageSize: 1000,
        }, ///${user?.userList?.corporateId}/${id}/${from}/${to}`,
      )
      .then((res) => {
        if (res?.status == '200') {
          setData(res?.data?.data?.body['smsHistoryList']);
        }
      })
      .catch((err) => {});
  }, []);
  return (
    <>
      <Typography
        variant='h3'
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}
        className='cursor'
      >
        <div style={{display: 'flex'}}>
          <div
            style={{
              borderBottom: '4px solid orange',
              paddingBottom: '5px',
              marginRight: '5px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span>SMS</span>
          </div>
          {id == 'DELIVERED'
            ? 'Delivered '
            : id == 'PENDING'
            ? 'Pending '
            : id == 'FAILED'
            ? 'Undelivered '
            : 'Total '}
        </div>
        <div>
          <AppTooltip title='Download' placement='bottom'>
            <FileDownloadIcon
              sx={{mr: 4}}
              onClick={() => {
                let postData = {
                  corporateId: '645caf975115e85968471fcf',
                  status: 'queued',
                  fromDate: '2023-08-01',
                  toDate: '2023-08-02',
                };
                excelDoc?.downloadDocPost(
                  '/usernotify/notification/download',
                  'SMS List',
                  postData,
                );
              }}
            />
          </AppTooltip>
        </div>
      </Typography>
      <div style={{background: 'white', padding: '10px'}}>
        <TableContainer
          style={{
            boxShadow:
              'rgba(0, 0, 0, 0) 0px 2px 4px, rgba(0, 0, 0, 0) 0px 7px 13px -3px, rgb(0,102,133) 0px -3px 0px inset',
          }}
        >
          <Table sx={{minWidth: 650}} aria-label='simple table'>
            <TableHead style={{background: '#f1f1f1'}}>
              <TableRow>
                {header?.map((el) => {
                  return <TableCell> {el} </TableCell>;
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.length ? (
                data?.map((el, i) => {
                  return (
                    <TableRow style={{background: i % 2 == 0 ? '' : '#f5f7ff'}}>
                      <TableCell> {'--'} </TableCell>
                      <TableCell> {el?.mobileNo} </TableCell>
                      <TableCell> {el?.time} </TableCell>
                      <TableCell> {'--'} </TableCell>
                      <TableCell> {el?.status} </TableCell>
                      <TableCell style={{maxWidth: '200px'}}>
                        {' '}
                        {el?.message}{' '}
                      </TableCell>
                      <TableCell> {'--'} </TableCell>

                      {/* <TableCell> {el?.VehicleNumber} </TableCell>
                                    <TableCell> {el?.Receiver} </TableCell>
                                    <TableCell> {el?.CallDuration} </TableCell> */}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell align='center' colSpan={10}>
                    No Records Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              {/* <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[1,5, 10, 25]}
                    colSpan={8}
                    count={8} //rows.length
                    rowsPerPage={rowsPerPage} //rowsPerPage
                    page={page}//page
                    SelectProps={{
                      inputProps: {
                        'aria-label': 'rows per page',
                      },
                      native: true,
                    }}
                    // onPageChange={handleChangePage}
                    // onRowsPerPageChange={handleChangeRowsPerPage}
                    // ActionsComponent={TablePaginationActions}
                  />
                </TableRow> */}
            </TableFooter>
          </Table>
        </TableContainer>
      </div>
    </>
  );
};

export default TableData;
