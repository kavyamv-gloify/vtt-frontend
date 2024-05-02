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
import AppTooltip from '@crema/core/AppTooltip';
import React, {useEffect, useState} from 'react';
import AttachmentIcon from '@mui/icons-material/Attachment';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';
import Api from '@api';
import CloseIcon from '@mui/icons-material/Close';
import SmartForm from '@smart-form';
import regex from '@regex';
import {toast} from 'react-toastify';
import {getFormData} from '@hoc';
import VisibilityIcon from '@mui/icons-material/Visibility';

const Parking = ({
  selected,
  showRem,
  pind,
  tid,
  selectParentData,
  setSelectedTolls,
  selectedTolls,
}) => {
  const [myData, setMyData] = useState([]);
  const [isApplicable, setIsApplicable] = useState([]);
  const [tollAmt, setTollAmt] = useState({});
  const [tollAdd, setTollAdd] = useState(false);
  let templateAdd = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    description: 'Add ParkingS',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'toll_information',
        fields: [
          {
            type: 'text',
            name: 'name',
            id: 'name',
            title: 'Name',
            infoMessage: [
              'Alpha Numeric Characters are allowed',
              'Maximum length should be 50',
              'e.g.: OTA-Penalty1',
            ],
            pattern: {
              value: regex.maxSize50,
              message: 'Please enter valid Name and below 50 characters',
            },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'text',
            name: 'amount',
            id: 'amount',
            title: 'Amount',
            isNumber: true,
            maxChar: 7,
            infoMessage: [
              'Numeric characters are allowed',
              'Maximum value should be 1,000,000',
              'e.g.: 2000',
            ],
            pattern: {
              value: regex.num1000000,
              message: 'Please enter  valid amount',
            },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'file',
            name: 'attachement',
            id: 'attachement',
            title: 'Document',
            validationProps: {
              size: {
                value: 5,
                message: 'File size should not be more than 5 mb.',
              },
            },
          },
        ],
      },
    ],
  };
  const getFileName = async (value) => {
    let tem = {
      photo: value,
    };
    let dataSet;
    Object.keys(tem).map((key) => {
      dataSet = {
        ...dataSet,
        [key]: tem[key][0],
      };
    });
    let temp = await axios({
      method: 'post',
      url: Api.baseUri + '/user-reg/fuelTracking/save-file',
      data: getFormData(dataSet),
      headers: {'Content-Type': 'multipart/form-data'},
    });
    return temp?.data?.data?.documentName;
  };
  async function handleSubmitAddParking(val) {
    console.log('test', val);
    let photo = '';
    if (val?.data?.photo) {
      photo = await getFileName(val?.data?.photo);
    }
    let reqBody = {
      tripId: tid,
      tollParkingData: [
        {
          type: 'Parking',
          amount: val?.data?.amount,
          name: val?.data?.name,
          photo: photo,
        },
      ],
    };
    axios
      .post(Api?.baseUri + '/user-reg/trip-route/saveTolltax', reqBody)
      .then((res) => {
        if (res?.data?.status == 200) {
          toast.success(res?.data?.message ?? 'Added successfully.', {
            autoClose: 5000,
          });
          setTimeout(() => {
            setTollAdd(false);
          }, 1000);
        } else {
          toast.error(res?.data?.message ?? 'Something went wrong.', {
            autoClose: 5000,
          });
          setTollAdd(false);
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  }
  useEffect(() => {
    if (isApplicable.length !== myData.length && selected.includes(pind)) {
      selectParentData('ev', pind);
    }
    if (
      isApplicable.length &&
      isApplicable.length == myData.length &&
      !selected.includes(pind)
    ) {
      selectParentData('ev', pind);
    }
  }, [isApplicable]);
  useEffect(() => {
    //64c3487fd5455947d37c8e91
    if (showRem || tollAdd) return;
    axios
      .get(Api.baseUri + '/user-reg/trip-route/getPendingRequest/' + tid)
      .then((res) => {
        let pdata = [];
        res?.data?.data?.length &&
          res?.data?.data[0]?.tollParkingData?.map((el) => {
            if (el.type == 'Parking') {
              pdata.push(el);
            }
          });
        setMyData([...pdata]);
      })
      .catch((err) => {
        setMyData([]);
      });
  }, [showRem, tollAdd]);
  useEffect(() => {
    let arr = [];
    if (selected.includes(pind) && myData?.length) {
      myData?.map((el, ind) => {
        arr.push(ind);
      });
      setIsApplicable([...arr]);
    }
    if (!selected.includes(pind) && isApplicable.length == myData.length) {
      setIsApplicable([]);
    }
  }, [myData, selected]);
  useEffect(() => {
    let myd_ = [];
    selectedTolls?.map((el) => {
      if (el.tripId !== tid) {
        myd_.push(el);
      }
    });
    let tem_ = [];
    isApplicable?.map((el) => {
      if (myData[el]?.status == 'PENDING')
        tem_.push({...myData[el], amount: tollAmt[el]});
    });
    if (!tem_.length) {
      setSelectedTolls([...myd_]);
      return;
    }
    let td = {
      tripId: tid,
      tollParkingData: tem_,
    };
    setSelectedTolls([...myd_, td]);
  }, [isApplicable, tollAmt]);
  useEffect(() => {
    if (!myData?.length) return;
    let obj = [];
    myData?.map((el, ind) => {
      obj[ind] = el.amount;
    });
    setTollAmt({...obj});
  }, [myData]);
  return (
    <div>
      {tollAdd ? (
        <Dialog
          open={tollAdd}
          onClose={() => {
            setTollAdd(false);
          }}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
          maxWidth='false'
          // PaperProps={{
          //   sx: {
          //     width: 400,
          //     maxHeight: 500,
          //     overflow: 'hidden',
          //   },
          // }}
        >
          <DialogTitle
            id='alert-dialog-title'
            style={{
              background: '#f5f2f2',
              position: 'relative',
              fontSize: '21px',
            }}
          >
            Add Parking
            <IconButton
              onClick={() => {
                setTollAdd(false);
              }}
              style={{position: 'absolute', top: '8px', right: '8px'}}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <div className='grid-container'>
              <SmartForm
                template={templateAdd}
                onSubmit={handleSubmitAddParking}
                buttons={['Submit']}
              />
            </div>
          </DialogContent>
        </Dialog>
      ) : null}
      <TableContainer component={Paper} sx={{mt: 4}}>
        <div style={{width: '100%', textAlign: 'right'}}>
          <Button
            id='btnMui123'
            variant='outlined'
            color='primary'
            sx={{mb: 2, background: '#fdfdfd'}}
            onClick={(e) => {
              setTollAdd(true);
            }}
          >
            Add Parking
          </Button>
        </div>
        <Table aria-label='simple table'>
          <TableHead style={{background: '#f6f6f6'}}>
            <TableRow>
              <TableCell align='center'>
                <Checkbox
                  color='primary'
                  key={'check-all'}
                  checked={isApplicable?.length == myData.length}
                  onChange={(e) => {
                    if (isApplicable?.length == myData.length) {
                      setIsApplicable([]);
                    } else {
                      let ar = [];
                      myData?.map((el, ind) => {
                        ar.push(ind);
                      });
                      setIsApplicable([...ar]);
                    }
                  }}
                />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell align='center'>Parking Amount</TableCell>
              <TableCell align='center'>Documents</TableCell>
              <TableCell align='center'>Status</TableCell>
              {/* <TableCell align='center'>Action</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {myData?.map((row, ind) => (
              <TableRow
                key={ind + 'table' + ind}
                sx={{'&:last-child td, &:last-child th': {border: 0}}}
              >
                <TableCell align='center'>
                  <Checkbox
                    color='primary'
                    key={ind + 'check'}
                    style={{opacity: row.status != 'PENDING' ? '0.3' : ''}}
                    checked={
                      isApplicable.includes(ind) && row.status == 'PENDING'
                    }
                    onChange={(e) => {
                      if (row.status != 'PENDING') return;
                      if (!isApplicable.includes(ind))
                        setIsApplicable([...isApplicable, ind]);
                      else {
                        let arr = isApplicable;
                        arr.splice(arr.indexOf(ind), 1);
                        setIsApplicable([...arr]);
                      }
                    }}
                  />
                </TableCell>
                <TableCell component='th' scope='row'>
                  {row.name || 'NA'}
                </TableCell>
                <TableCell align='center'>
                  <TextField
                    style={{width: '100px'}}
                    size='small'
                    value={tollAmt[ind]}
                    disabled={row.status != 'PENDING'}
                    onInput={(e) => {
                      setTollAmt({...tollAmt, [ind]: e.target.value});
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>₹</InputAdornment>
                      ),
                    }}
                  />
                </TableCell>
                <TableCell align='center'>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        minWidth: '100px',
                        height: '40px',
                        background: row?.photo ? '#00dcff' : '#d6d6d4',
                        marginRight: '10px',
                        borderRadius: '10px',
                        padding: '10px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'white',
                      }}
                    >
                      {console.log('row', row)}
                      <AppTooltip
                        title={
                          row?.photo
                            ? row?.photo?.split('/')[
                                row?.photo?.split('/')?.length - 1
                              ]
                            : 'No file'
                        }
                      >
                        <span>
                          {row?.photo
                            ? row?.photo?.split('/')[
                                row?.photo?.split('/')?.length - 1
                              ]?.length > 15
                              ? '...' +
                                row?.photo
                                  ?.split('/')
                                  [row?.photo?.split('/')?.length - 1]?.slice(
                                    -15,
                                  )
                              : row?.photo?.split('/')[
                                  row?.photo?.split('/')?.length - 1
                                ]
                            : 'No file'}
                        </span>
                      </AppTooltip>
                    </div>
                    <AppTooltip title='Documents'>
                      <VisibilityIcon
                        onClick={() => {
                          if (row?.photo) downDoc?.openDoc(row?.photo);
                        }}
                        className='pointer'
                        style={{color: '#00dcff'}}
                      />
                    </AppTooltip>
                  </div>
                </TableCell>
                <TableCell align='center'>{row.status}</TableCell>
                {/* <TableCell align='center'>
                  <AppTooltip title='Approve'>
                    <AssignmentTurnedInIcon
                      className='pointer'
                      color='primary'
                    />
                  </AppTooltip>
                  <AppTooltip title='Reject'>
                    <CancelIcon
                      className='pointer'
                      sx={{color: '#bc0805', ml: 2}}
                    />
                  </AppTooltip>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Parking;
