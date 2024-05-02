import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import React, {useEffect, useState} from 'react';
import CloseIcon from '@mui/icons-material/Close';
import _, {indexOf} from 'lodash';
import axios from 'axios';
import Api from '@api';
import {toast} from 'react-toastify';
const Penalty = ({id, setPenaltyBox}) => {
  const [tripData, setTripData] = useState({});
  const [reasons, setReasons] = useState([]);
  const [myPenalty, setMyPenalty] = useState([]);
  const [isApplicable, setIsApplicable] = useState([]);
  const [waiveAmt, setWaveAmt] = useState({});
  useEffect(() => {
    axios
      .get(
        Api.baseUri +
          '/user-reg/penalty-Service/getAll?page=0&size=10000&reason=null',
      )
      .then((res) => {
        setReasons(res?.data?.data?.body['Penalty List'] || []);
      })
      .catch((err) => {
        setReasons([]);
      });
    if (!id) return;
    axios
      .get(Api.baseUri + '/user-reg/trip-penalty/getPenaltyByTripId/' + id)
      .then((res) => {
        setMyPenalty(res?.data?.data?.penaltyList || []);
      })
      .catch((err) => {
        setMyPenalty([]);
      });
    axios
      .get(Api.baseUri + '/user-reg/trip-route/get-trip-by-id/' + id)
      .then((res) => {
        setTripData(res?.data?.data || {});
      })
      .catch((err) => {
        setTripData({});
      });
  }, [id]);
  useEffect(() => {
    let tem = {};
    let d = isApplicable;
    if (myPenalty?.length) {
      myPenalty.map((el) => {
        if (!d.includes(el.penaltyMasterId)) d.push(el.penaltyMasterId);
        tem[el.penaltyMasterId] = el.waiveOffAmt;
      });
      setIsApplicable(d);
      setWaveAmt({...tem});
    }
  }, [myPenalty]);
  return (
    <div>
      <Dialog
        open={true}
        onClose={() => {
          setPenaltyBox(false);
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '800px',
          },
        }}
      >
        <DialogTitle
          id='alert-dialog-title'
          style={{
            background: '#f5f2f2',
            position: 'relative',
            fontSize: '21px',
          }}
        >
          Add Penalty ({tripData?.tripCode})
          <IconButton
            onClick={() => {
              setPenaltyBox(false);
            }}
            style={{position: 'absolute', top: '8px', right: '8px'}}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{mt: 4}}>
          <div className='grid-container'>
            <TableContainer component={Paper}>
              <Table aria-label='simple table'>
                <TableHead style={{background: '#f6f6f6'}}>
                  <TableRow>
                    <TableCell align='center'>
                      <Checkbox
                        key={'check-all'}
                        checked={isApplicable?.length == reasons.length}
                        onChange={(e) => {
                          if (isApplicable?.length == reasons.length) {
                            setIsApplicable([]);
                          } else {
                            let ar = [];
                            reasons?.map((el) => {
                              ar.push(el.id);
                            });
                            setIsApplicable([...ar]);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>Penalty Reason</TableCell>
                    <TableCell align='center'>Default Penalty</TableCell>
                    <TableCell align='center'>Waive-off Amount</TableCell>
                    <TableCell align='center'>Final Penalty</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reasons?.map((row, ind) => (
                    <TableRow
                      key={row.id + 'table' + ind}
                      sx={{'&:last-child td, &:last-child th': {border: 0}}}
                    >
                      <TableCell align='center'>
                        <Checkbox
                          key={row.id + 'check'}
                          checked={isApplicable.includes(row.id)}
                          onChange={(e) => {
                            if (!isApplicable.includes(row.id))
                              setIsApplicable([...isApplicable, row.id]);
                            else {
                              let arr = isApplicable;
                              arr.splice(arr.indexOf(row.id), 1);
                              setIsApplicable([...arr]);
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell component='th' scope='row'>
                        {row.reason}
                      </TableCell>
                      <TableCell align='center'>
                        <TextField
                          style={{width: '100px'}}
                          size='small'
                          disabled={true}
                          value={row.amount}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position='start'>
                                ₹
                              </InputAdornment>
                            ),
                          }}
                        />
                      </TableCell>
                      <TableCell align='center'>
                        <TextField
                          style={{width: '100px'}}
                          size='small'
                          disabled={!isApplicable.includes(row.id)}
                          value={waiveAmt[row.id] || ''}
                          onInput={(e) => {
                            if (_.isNaN(Number(e.target.value))) {
                              setWaveAmt({
                                ...waiveAmt,
                                [row.id]: waiveAmt[row.id] || '',
                              });
                              return;
                            }
                            if (
                              Number(e.target.value) > Number(row.amount || 0)
                            )
                              return;
                            setWaveAmt({
                              ...waiveAmt,
                              [row.id]: e.target.value,
                            });
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position='start'>
                                ₹
                              </InputAdornment>
                            ),
                          }}
                        />
                      </TableCell>
                      <TableCell align='center'>
                        <TextField
                          style={{width: '100px'}}
                          size='small'
                          disabled={true}
                          value={
                            Number(row.amount || 0) -
                            Number(waiveAmt[row.id] || 0)
                          }
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position='start'>
                                ₹
                              </InputAdornment>
                            ),
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <div
              style={{width: '100%', textAlign: 'center', paddingTop: '20px'}}
            >
              <Button
                id='btnMui123'
                variant='contained'
                onClick={() => {
                  let tem_Arr = _.groupBy(reasons, 'id');
                  let penaltyList = [];
                  isApplicable?.map((el) => {
                    penaltyList.push({
                      penaltyMasterName: tem_Arr[el]?.length
                        ? tem_Arr[el][0]?.reason
                        : '',
                      penaltyMasterId: el,
                      defaultAmt: tem_Arr[el]?.length
                        ? tem_Arr[el][0]?.amount
                        : 0,
                      finalAmt: tem_Arr[el]?.length
                        ? Number(tem_Arr[el][0]?.amount || 0) -
                          Number(waiveAmt[el] || 0)
                        : 0,
                      waiveOffAmt: waiveAmt[el] || 0,
                      addedFor: '',
                    });
                  });
                  let postData = {
                    tripId: id,
                    tripCode: tripData?.tripCode,
                    corporateId: tripData?.corporateId,
                    penaltyList: penaltyList || [],
                  };

                  axios
                    .post(
                      Api.baseUri + '/user-reg/trip-penalty/save-penalty',
                      postData,
                    )
                    .then((res) => {
                      if (res?.data?.status == '200') {
                        toast.success(
                          res?.data?.message || 'Penalty added successfully.',
                        );
                        setPenaltyBox(false);
                      } else {
                        toast.error(
                          res?.data?.message || 'Something went wrong.',
                        );
                      }
                    })
                    .catch((err) => {
                      toast.error('Something went wrong.');
                    });
                }}
              >
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Penalty;
