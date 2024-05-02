import React, {useEffect, useState} from 'react';
import {Button, InputLabel, TextField, Typography} from '@mui/material';
import SmartTable from '@smart-table';
import axios from 'axios';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {toast} from 'react-toastify';
import {DataGrid} from '@mui/x-data-grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import moment from 'moment';
import Api from '@api';
const PendingList = ({close}) => {
  const [selectedItems, setselectedItems] = useState([]);
  const [data, setData] = useState();
  const [checkedData, setCheckedData] = useState();
  const [setting, setSetting] = useState();
  const [request, setRequest] = useState([]);
  const {user} = useAuthUser();
  const label = {inputProps: {'aria-label': 'Checkbox demo'}};
  const [checked, setChecked] = useState([]);
  const [reject, setReject] = useState();
  const [forward, setForward] = useState();
  function getAllList() {
    axios
      .get(Api.baseUri + '/user-reg/fuelTracking/getAllPendingWith/PENDING')
      .then((res) => {
        if (res?.data?.status == '200') {
          setData(res?.data?.data ?? []);
        }
      })
      .catch((err) => {
        setData([]);
      });
  }
  useEffect(() => {
    getAllList();
  }, []);
  function getData() {
    axios
      .get(
        Api.baseUri +
          `/user-reg/fuelTracking-setting/get-fuelTracking-setting-by-corporateId/${user?.userList?.corporateId}`,
      )
      .then((res) => {
        console.log('setting', res);
        if (res?.data?.status == '200') {
          console.log('res', res?.data?.data);
          setSetting(res?.data?.data);
        }
      })
      .catch((err) => {
        setSetting({});
      });
  }

  useEffect(() => {
    getData();
  }, [user?.userList?.corporateId]);

  function handleChange(e) {
    console.log('e', e?.target?.name, e?.target?.checked);
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
    let temp = [];
    data?.map((el) => {
      console.log('el', el);
      if (el?.checked == true) {
        temp.push(el);
      } else {
        return;
      }
    });
    setselectedItems(temp);
    console.log('temp', temp);
  }, [data]);
  return (
    <>
      {user?.userList?.userRole == 'CORPORATEADMIN' && (
        <div
          style={{
            textAlign: 'right',
            paddingRight: '10px',
            paddingBottom: '10px',
          }}
        >
          <Button
            id='btnMui123'
            variant='contained'
            disabled={selectedItems?.length ? false : true}
            onClick={() => {
              // console.log('request', request);
              let temp = [];
              data?.map((el) => {
                if (el.checked == true) {
                  temp.push({id: el?.id, status: 'APPROVED'});
                }
              });
              console.log('temp', temp);

              axios
                .post(
                  Api.baseUri +
                    '/user-reg/fuelTracking/approveFuelTrackingRequest',
                  temp,
                )
                .then((res) => {
                  if (res?.data?.status == '200') {
                    toast.success('Request approved successfully');
                    window.location.reload();
                  } else {
                    toast.error('Something went wrong');
                  }
                })
                .catch((err) => {
                  toast.error('Something went wrong' ?? err);
                });
            }}
          >
            Approve
          </Button>
          <Button
            id='btnMui123'
            variant='contained'
            sx={{marginLeft: '20px'}}
            disabled={selectedItems?.length ? false : true}
            onClick={() => {
              let temp = [];
              data?.map((el) => {
                if (el.checked == true) {
                  temp.push({id: el?.id, status: 'REJECTED'});
                }
              });
              console.log('temp', temp);
              axios
                .post(
                  Api.baseUri +
                    '/user-reg/fuelTracking/approveFuelTrackingRequest',
                  temp,
                )
                .then((res) => {
                  if (res?.data?.status == '200') {
                    toast.success('Request rejected successfully');
                    window.location.reload();
                  } else {
                    toast.error('Something went wrong');
                  }
                })
                .catch((err) => {
                  toast.error('Something went wrong' ?? err);
                });
            }}
          >
            Reject
          </Button>
        </div>
      )}

      {user?.userList?.userRole == 'VENDOR' && (
        <div
          style={{
            textAlign: 'right',
            paddingRight: '10px',
            paddingBottom: '10px',
          }}
        >
          {setting?.corporateApprovalRequired == 'YES' ? (
            <Button
              id='btnMui123'
              variant='contained'
              sx={{mr: 2}}
              disabled={selectedItems?.length ? false : true}
              onClick={(e) => {
                let temp = [];
                data?.map((el) => {
                  if (el.checked == true) {
                    temp.push({id: el?.id});
                  }
                });
                console.log('temp', temp);
                axios
                  .post(
                    Api.baseUri +
                      '/user-reg/fuelTracking/forwardFuelTrackingRequest',
                    temp,
                  )
                  .then((res) => {
                    if (res?.data?.status == '200') {
                      toast.success('Request forwarded successfully');
                      window.location.reload();
                    } else {
                      toast.error('Something went wrong');
                    }
                  })
                  .catch((err) => {
                    toast.error('Something went wrong' ?? err);
                  });
              }}
            >
              Forward
            </Button>
          ) : (
            <Button
              id='btnMui123'
              variant='contained'
              disabled={selectedItems?.length ? false : true}
              onClick={() => {
                let temp = [];
                data?.map((el) => {
                  if (el.checked == true) {
                    temp.push({id: el?.id, status: 'APPROVED'});
                  }
                });
                console.log('temp', temp);

                axios
                  .post(
                    Api.baseUri +
                      '/user-reg/fuelTracking/approveFuelTrackingRequest',temp
                    // data.filter((el) => el.checked === true

                    // ),
                  )
                  .then((res) => {
                    if (res?.data?.status == '200') {
                      toast.success('Request Approved successfully');
                      // window.location.reload();
                      close();
                    } else {
                      toast.error('Something went wrong');
                    }
                  })
                  .catch((err) => {
                    toast.error('Something went wrong' ?? err);
                  });
              }}
              // disabled={!selectedItems?.length}
              sx={{mr: 2}}
            >
              Approve
            </Button>
          )}

          <Button
            id='btnMui123'
            variant='contained'
            disabled={selectedItems?.length ? false : true}
            onClick={() => {
              let temp = [];
              data?.map((el) => {
                if (el.checked == true) {
                  temp.push({id: el?.id, status: 'REJECTED'});
                }
              });
              axios
                .post(
                  Api.baseUri +
                    '/user-reg/fuelTracking/approveFuelTrackingRequest',
                  temp,
                )
                .then((res) => {
                  if (res?.data?.status == '200') {
                    toast.success('Request Rejected successfully');
                    close();
                  } else {
                    toast.error('Something went wrong');
                  }
                })
                .catch((err) => {
                  toast.error('Something went wrong' ?? err);
                });
            }}
          >
            Reject
          </Button>
        </div>
      )}

      <TableContainer component={Paper}>
        <Table sx={{minWidth: 650}} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox
                  {...label}
                  onChange={handleChange}
                  className='form-check-input'
                  name='all'
                />
              </TableCell>
              <TableCell>Vehicle Type</TableCell>
              <TableCell align='right'>Vehicle Number</TableCell>
              <TableCell align='right'>Model</TableCell>
              <TableCell align='right'>Fuel Station</TableCell>
              <TableCell align='right'>Fuel Volume</TableCell>
              <TableCell align='right'>Fuel Price</TableCell>
              <TableCell align='right'>Mileage</TableCell>
              <TableCell align='right'>Odometer Reading</TableCell>
              <TableCell align='right'>Generated On</TableCell>
              <TableCell align='right'>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((row, ind) => (
              <TableRow
                key={row?.name}
                sx={{'&:last-child td, &:last-child th': {border: 0}}}
              >
                {' '}
                <TableCell align='right'>
                  <Checkbox
                    {...label}
                    name={row?.id}
                    checked={row?.checked == true ? true : false}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                  />
                </TableCell>
                <TableCell component='th' scope='row?'>
                  {row?.vehicleType}
                </TableCell>
                <TableCell align='right'>{row?.vehicleNo}</TableCell>
                <TableCell align='right'>{row?.vehicleModel}</TableCell>
                <TableCell align='right'>{row?.fuelStation}</TableCell>
                <TableCell align='right'>{row?.fuelVolume}</TableCell>
                <TableCell align='right'>{row?.fuelPrice}</TableCell>
                <TableCell align='right'>{row?.mileage}</TableCell>
                <TableCell align='right'>{row?.odoMeterReadin}</TableCell>
                <TableCell align='right'>
                  {moment(row?.createdOn).format('DD-MM-YYYY HH:MM')}
                </TableCell>
                <TableCell align='right'>{row?.status}</TableCell>
              </TableRow>
            ))}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '20px',
                justifyContent: 'center',
              }}
            >
              {data?.length == 0 && <p>No record found</p>}
            </div>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default PendingList;
