import {
  Autocomplete,
  Button,
  Grid,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import React, {useEffect, useState} from 'react';
import Paper from '@mui/material/Paper';
import _ from 'lodash';
import SaveIcon from '@mui/icons-material/Save';
import moment from 'moment';
import Api from '@api';
import {toast} from 'react-toastify';
import axios from 'axios';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

const AddPenalty = ({driverList, closefun}) => {
  const [driverList_t, setdriverList_t] = useState([]);
  const [driverOptions, setDriverOptions] = useState([]);
  const [vendorOptions, setVendorOptions] = useState([]);
  const [compType, setCompType] = useState({title: 'Driver', value: 'DRIVER'});
  const [driverVal, setDriverVal] = useState();
  const [vendorVal, setVendorVal] = useState();
  const [remarks, setRemarks] = useState({});
  const [subTopicList, setSubTopicList] = useState([]);
  const [waiveOffAmt, setWaiveOffAmt] = useState({});
  const [topicStatus, setTopicStatus] = useState({});
  const [effectiveDate, setEffectiveDate] = useState(
    moment(new Date()).format('YYYY-MM-DD'),
  );
  const [driverTopicList, setDriverTopicList] = useState([]);
  const [penaltyId, setPenaltyId] = useState({});

  useEffect(() => {
    axios
      .get(
        Api.baseUri +
          `/user-reg/associateVehicle/getAllAssociatedVehicles?corporateId=${user?.userList?.corporateId}&vendorId=${vendorVal?.value}`,
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          console.log('res', res);
          let temp = [];
          res?.data?.data?.map((el) => {
            temp.push({
              title:
                el?.vehicle?.vehicleNumberPlate +
                ' ' +
                el?.vehicle?.vehicleBrand,
              value: el?.vehicle?.id,
            });
          });
          setDriverVal(temp[0] || null);
          setDriverOptions(temp);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  }, [vendorVal, user?.userList]);

  useEffect(() => {
    if (user?.userList?.userRole !== 'VENDOR') {
      axios
        .get(
          Api.baseUri +
            `/user-reg/associateVehicle/getAllAssociatedVehicles?corporateId=${user?.userList?.corporateId}&vendorId=${vendorVal?.value}`,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            console.log('res', res);
            let temp = [];
            res?.data?.data?.map((el) => {
              temp.push(el?.vehicle);
            });
            setdriverList_t(temp || []);
          }
        })
        .catch((err) => {
          console.log('err', err);
        });
    }
    if (user?.userList?.userRole == 'VENDOR') {
      axios
        .get(
          Api.baseUri +
            `/user-reg/associateVehicle/getAllAssociatedVehicles?corporateId=${user?.userList?.corporateId}&vendorId=${user?.userList?.profileId}`,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            console.log('res', res);
            let temp = [];
            res?.data?.data?.map((el) => {
              temp.push(el?.vehicle);
            });
            setdriverList_t(temp || []);
          }
        })
        .catch((err) => {
          console.log('err', err);
        });
    }
  }, [user?.userList, vendorVal]);
  useEffect(() => {
    if (!driverVal?.value || !effectiveDate) return;
    axios
      .post(
        Api.baseUri +
          '/user-reg/driver-reg/get-all-penalty/' +
          effectiveDate +
          '/' +
          effectiveDate,
        {
          entityId: driverVal?.value,
        },
      )
      .then((res) => {
        let ob = {};
        let ob2 = {};
        let ob3 = {};
        res?.data?.data?.map((re) => {
          if (effectiveDate == re?.penaltyEffectiveDate) {
            ob[re?.topicId] = re.waveOffAmount;
            ob2[re?.topicId] = re.remarks;
            ob3[re?.topicId] = re.id;
          }
        });
        setRemarks({...ob2});
        setWaiveOffAmt({...ob});
        setPenaltyId({...ob3});
      })
      .catch((er) => {});
  }, [effectiveDate, driverVal]);
  function getAllDriverCompTopics() {
    axios
      .get(
        Api.baseUri + '/user-reg/compliance-topic/getAllByCorporateId/VEHICLE',
      )
      .then((res) => {
        setDriverTopicList(res?.data?.data);
      })
      .catch((err) => {});
  }
  useEffect(() => {
    getAllDriverCompTopics();
  }, []);

  useEffect(() => {
    axios
      .get(Api.baseUri + '/user-reg/associatevendor/getallassociatecorporateId')
      .then((re) => {
        let ar = [];
        re?.data?.data?.map((el) => {
          ar.push({title: el?.vendorName, value: el?.vendorId});
        });
        setVendorOptions(ar);
      });
  }, []);
  useEffect(() => {
    let tempo = [];
    driverTopicList?.map((re) => {
      tempo.push({
        sid: re?.id,
        tid: re?.id,
        topicNameKey: re?.topicNameKey,
        topicName: re?.topicName,
        topicId: re?.id,
        topicType: re?.topicType,
        status: re?.status,
        description: re?.description,
        defaultPenalty: re?.defaultPenalty || 0,
      });
      // re?.complianceSubTopicList?.map((sub) => {
      //     tempo.push({ sid: sub.id, sub_d: sub, tid: re?.id, topicNameKey: re?.topicNameKey, topicName: re?.topicName, name: sub?.subTopicName + ' - ' + re?.topicNameKey, topicId: re?.id, topicType: re?.topicType, inputType: sub?.inputType, fileName: sub?.fileName, status: (sub?.status || re?.status), description: sub?.description, defaultPenalty: sub?.defaultPenalty });
      // })
    });

    setSubTopicList(tempo);
  }, [driverTopicList]);
  useEffect(() => {
    let tem;
    driverList_t?.map((dr) => {
      if (driverVal?.value == dr?.id) tem = dr;
    });
    let tem_comp = {};
    // let tem_comp_waive_amt = {}
    // let tem_comp_remarks = {}
    tem?.compliancesDto?.complianceTopics?.map((el) => {
      tem_comp[el?.id] = el?.status;
      // tem_comp_waive_amt[el?.id] = {status: el?.status, value: el?.value, fileName: el?.fileName };
      // el?.complianceSubTopicPenaltyList?.map(ep=>{
      //     if(effectiveDate == ep?.penaltyEffectiveDate) {
      //         tem_comp_waive_amt[el?.id] = ep.waveOffAmount;
      //         tem_comp_remarks[el?.id] = ep.description;
      //     }
      // })
    });

    setTopicStatus({...tem_comp});
  }, [driverVal]);
  return (
    <div>
      <div className='sticky-container'>
        <Grid container spacing={2}>
          {/* <Grid item xs={6}> */}
          {/* <Autocomplete
                        id='tags-outlined'
                        options={[{ title: "Driver", value: 'DRIVER' }, { title: "Vehicle", value: 'VEHICLE' }]}
                        getOptionLabel={(option) => option.title}
                        value={compType}
                        onChange={(event, value) => setCompType(value)}
                        filterSelectedOptions
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant='outlined'
                                label={"Compliance Type"}
                                fullWidth
                            />
                        )}
                    /> */}
          {/* </Grid> */}
          <Grid item xs={4}>
            <Autocomplete
              id='tags-outlined'
              options={vendorOptions}
              getOptionLabel={(option) => option.title}
              value={vendorVal || null}
              onChange={(event, value) => {
                setRemarks({});
                setWaiveOffAmt({});
                setDriverVal(null);
                setVendorVal(value);
                // let tem = [];

                // driverList_t?.map((dr) => {
                //   if (dr?.vendorId == value.value) {
                //     tem.push({
                //       title: dr?.vehicleNumberPlate + ' ' + dr?.vehicleBrand,
                //       value: dr?.id,
                //     });
                //   }
                // });

                // setDriverVal(tem[0] || null);
                // setDriverOptions(tem);
              }}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label={'Select Vendor'}
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={4}>
            <Autocomplete
              id='tags-outlined'
              options={driverOptions}
              getOptionLabel={(option) => option.title}
              value={driverVal || null}
              onChange={(event, value) => {
                setRemarks({});
                setWaiveOffAmt({});
                setDriverVal(value);
              }}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label={'Select Vehicle'}
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              type='date'
              value={effectiveDate}
              onChange={(e) => {
                setEffectiveDate(e?.target?.value);
                setRemarks({});
                setWaiveOffAmt({});
              }}
              InputLabelProps={{shrink: true}}
              variant='outlined'
              label={'Date'}
              fullWidth
            />
          </Grid>
        </Grid>
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'end',
            marginTop: '10px',
          }}
        >
          <Button
            id='btnMui123'
            disabled={!effectiveDate || !driverVal?.value}
            variant='outlined'
            onClick={() => {
              console.log('driverVal', driverVal);
              let tempo = [];
              let dd = {};
              driverList_t?.map((elm) => {
                if (driverVal?.value == elm.id) {
                  console.log('elm', elm);
                  dd.driverName = '-';
                  dd.vendorId = elm.vendorId;
                  dd.vendorName = elm.vendorName;
                }
              });
              subTopicList?.map((el, _i) => {
                let temp = {
                  status: topicStatus[el.tid],
                  defaultPenalty: el.defaultPenalty || 0,
                  waveOffAmount: waiveOffAmt[el.tid] || 0,
                  finalPenalty:
                    (el.defaultPenalty || 0) - (waiveOffAmt[el.tid] || 0),
                  entityId: driverVal?.value,
                  topicNameKey: el.topicNameKey,
                  topicId: el.tid,
                  topicName: el.topicName,
                  penaltyEffectiveDate: effectiveDate,
                  remarks: remarks[el?.tid],
                  vendorName: dd.vendorName,
                  vendorId: dd.vendorId,
                  driverName: '-',
                  vehicleName: driverVal?.title,
                };
                // if(penaltyId[el.tid]) temp.id = penaltyId[el.tid]
                tempo.push(temp);
              });
              console.log('tempo', tempo);
              return;
              axios
                .post(
                  Api.baseUri +
                    '/user-reg/vehicle-reg/add-vehicle-topic-penalty',
                  tempo,
                )
                .then((res) => {
                  if (res?.data?.status == '200') {
                    toast.success('Penalty added successfully.');
                    closefun();
                  } else {
                    toast.error(res?.data?.message || 'Something went wrong.');
                  }
                })
                .catch((err) => {
                  toast.error('Something went wrong.');
                });
            }}
          >
            <SaveIcon style={{fontSize: '18px', marginRight: '2px'}} />
            Save
          </Button>
        </div>
      </div>
      <TableContainer
        component={Paper}
        sx={{mt: 2, display: driverVal?.value ? '' : 'none'}}
      >
        <Table aria-label='simple table'>
          <TableHead style={{background: '#f1f1f1'}}>
            <TableRow key={'index'}>
              <TableCell align='left' style={{fontWeight: 'bold'}}>
                Compliance Name
              </TableCell>
              <TableCell align='left' style={{fontWeight: 'bold'}}>
                Status
              </TableCell>
              <TableCell
                align='center'
                style={{fontWeight: 'bold', width: '100px'}}
              >
                Default Penalty
              </TableCell>
              <TableCell
                align='center'
                style={{fontWeight: 'bold', width: '100px'}}
              >
                Waive-Off
              </TableCell>
              <TableCell
                align='center'
                style={{fontWeight: 'bold', width: '100px'}}
              >
                Final Penalty
              </TableCell>
              <TableCell
                align='center'
                style={{fontWeight: 'bold', width: '140px'}}
              >
                Remarks
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subTopicList?.map((row, _ind) => (
              <TableRow
                key={row.id}
                sx={{'&:last-child td, &:last-child th': {border: 0}}}
              >
                <TableCell component='th' scope='row'>
                  {row?.topicNameKey}
                </TableCell>
                <TableCell component='th' scope='row'>
                  <div
                    className={
                      topicStatus[row?.tid] == 'MET'
                        ? 'penalty-status-met'
                        : 'penalty-status-not-met'
                    }
                    onClick={() => {
                      setWaiveOffAmt({...waiveOffAmt, [row?.tid]: '0'});
                      if (
                        !topicStatus[row?.tid] ||
                        topicStatus[row?.tid] == 'NOTMET'
                      ) {
                        setTopicStatus({
                          ...topicStatus,
                          [row?.tid]: 'WAIVEOFF',
                        });
                      }
                      if (topicStatus[row?.tid] == 'WAIVEOFF') {
                        setTopicStatus({...topicStatus, [row?.tid]: 'NOTMET'});
                      }
                    }}
                  >
                    {topicStatus[row?.tid] == 'MET'
                      ? 'M'
                      : topicStatus[row?.tid] == 'WAIVEOFF'
                      ? 'W'
                      : 'N'}
                  </div>
                </TableCell>
                <TableCell component='th' scope='row'>
                  <TextField
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <CurrencyRupeeIcon
                            style={{
                              fontSize: '15px',
                              padding: '0px',
                              margin: '-6px',
                            }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    value={
                      topicStatus[row?.tid] != 'MET'
                        ? row?.defaultPenalty || 0
                        : 0
                    }
                    size='small'
                    disabled
                    id={_ind + 'penalty-def'}
                    InputLabelProps={{shrink: true}}
                    fullWidth
                    variant='outlined'
                  />
                </TableCell>
                {/* (topicStatus[row?.tid] == "WAIVEOFF") ? */}
                <TableCell component='th' scope='row'>
                  <TextField
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <CurrencyRupeeIcon
                            style={{
                              fontSize: '15px',
                              padding: '0px',
                              margin: '-6px',
                            }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    disabled={topicStatus[row?.tid] != 'WAIVEOFF'}
                    value={
                      topicStatus[row?.tid] == 'WAIVEOFF'
                        ? waiveOffAmt[row.sid]
                        : 0
                    }
                    onChange={(e) => {
                      if (
                        _.isNaN(Number(e?.target.value)) ||
                        Number(e?.target.value) > (row?.defaultPenalty || 0)
                      )
                        return;
                      setWaiveOffAmt({
                        ...waiveOffAmt,
                        [row?.sid]: Number(e?.target?.value),
                      });
                    }}
                    size='small'
                    id={_ind + 'waive-off'}
                    InputLabelProps={{shrink: true}}
                    fullWidth
                    variant='outlined'
                  />
                </TableCell>
                <TableCell component='th' scope='row'>
                  <TextField
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <CurrencyRupeeIcon
                            style={{
                              fontSize: '15px',
                              padding: '0px',
                              margin: '-6px',
                            }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    value={
                      topicStatus[row?.tid] == 'MET'
                        ? '0'
                        : (row?.defaultPenalty || 0) -
                          (waiveOffAmt[row.sid] || 0)
                    }
                    size='small'
                    disabled
                    id={_ind + 'penaltyFinal'}
                    InputLabelProps={{shrink: true}}
                    fullWidth
                    variant='outlined'
                  />
                </TableCell>
                <TableCell component='th' scope='row'>
                  <TextField
                    size='small'
                    id={_ind + 'remarks'}
                    value={remarks[row?.sid]}
                    onInput={(e) => {
                      setRemarks({...remarks, [row?.sid]: e.target.value});
                    }}
                    InputLabelProps={{shrink: true}}
                    fullWidth
                    variant='outlined'
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AddPenalty;
