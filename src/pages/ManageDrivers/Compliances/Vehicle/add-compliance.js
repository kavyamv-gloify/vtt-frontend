import {
  Autocomplete,
  Button,
  Grid,
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
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios';
import Api from '@api';
import {toast} from 'react-toastify';
import moment from 'moment';
import {get} from 'lodash';
import VisibilityIcon from '@mui/icons-material/Visibility';
import downDoc from '@common/fileDownload';
import {useAuthUser} from '@crema/utility/AuthHooks';
const AddCompliance = ({driverList, closefun}) => {
  const [driverList_t, setdriverList_t] = useState([]);
  const [driverOptions, setDriverOptions] = useState([]);
  const [vendorOptions, setVendorOptions] = useState([]);
  const [compType, setCompType] = useState({title: 'Driver', value: 'DRIVER'});
  const [driverVal, setDriverVal] = useState();
  const [vendorVal, setVendorVal] = useState();
  const [driverTopicList, setDriverTopicList] = useState([]);
  const [subTopicList, setSubTopicList] = useState([]);
  const [topicStatus, setTopicStatus] = useState({});
  const [fileVal, setFileVal] = useState({});
  const [inputVal, setInputVal] = useState({});
  const {user} = useAuthUser();
  useEffect(() => {
    getVehicleData();
  }, [vendorVal, user?.userList?.profileId]);

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
  }, [vendorVal]);

  useEffect(() => {
    if (user?.userList?.userRole !== 'VENDOR') {
      return;
    }
    if (user?.userList?.userRole == 'VENDOR') {
      setVendorVal({
        title: user?.userList?.userName,
        value: user?.userList?.profileId,
      });

      axios
        .get(
          Api.baseUri +
            `/user-reg/associateVehicle/getAllAssociatedVehicles?corporateId=${user?.userList?.corporateId}&vendorId=${vendorVal?.value}`,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            console.log('res', res);
            let tem = [];
            res?.data?.data?.map((el) => {
              tem.push({
                title:
                  el?.vehicle?.vehicleNumberPlate +
                  ' ' +
                  el?.vehicle?.vehicleBrand,
                value: el?.vehicle?.id,
              });
            });

            setDriverOptions(tem);
          }
        })
        .catch((err) => {
          console.log('err', err);
        });
    }
  }, [user?.userList]);
  function getVehicleData() {
    if (user?.userList?.userRole !== 'VENDOR') {
      axios
        .get(
          Api.baseUri +
            `/user-reg/associateVehicle/getAllAssociatedVehicles?corporateId=${user?.userList?.corporateId}&vendorId=${vendorVal?.value}`,
        )
        .then((response) => {
          // let tem = response?.data?.data?.body?.data;
          let tem = [];
          response?.data?.data?.map((el) => {
            if (el?.vehicleId) {
              tem.push(el?.vehicle);
            }
          });
          setdriverList_t([...(tem || [])]);
        })
        .catch((er) => {});
    } else {
      axios
        .get(
          Api.baseUri +
            `/user-reg/associateVehicle/getAllAssociatedVehicles?corporateId=${user?.userList?.corporateId}&vendorId=${user?.userList?.profileId}`,
        )
        .then((response) => {
          // let tem = response?.data?.data?.body?.data;
          let tem = [];
          response?.data?.data?.map((el) => {
            if (el?.vehicleId) {
              tem.push(el?.vehicle);
            }
          });
          setdriverList_t([...(tem || [])]);
        })
        .catch((er) => {});
    }
  }
  const getFormData = (object) =>
    Object.keys(object).reduce((formData, key) => {
      formData.append(key, object[key]);
      return formData;
    }, new FormData());

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
      re?.complianceSubTopicList?.map((sub) => {
        tempo.push({
          sid: sub.id,
          sub_d: sub,
          tid: re?.id,
          topicNameKey: re?.topicNameKey,
          topicName: re?.topicName,
          name: sub?.subTopicName,
          tName: re?.topicNameKey,
          topicId: re?.id,
          topicType: re?.topicType,
          inputType: sub?.inputType,
          fileName: sub?.fileName,
          status: sub?.status || re?.status,
          description: sub?.description,
          defaultPenalty: sub?.defaultPenalty,
        });
      });
    });

    setSubTopicList(tempo);
  }, [driverTopicList]);

  useEffect(() => {
    loadData();
  }, [driverVal, driverList_t]);
  function loadData() {
    let tem;
    driverList_t?.map((dr) => {
      if (driverVal?.value == dr?.id) tem = dr;
    });
    let tem_comp = {};
    let tem_comp2 = {};
    tem?.compliancesDto?.complianceTopics?.map((el) => {
      tem_comp[el?.id] = el?.status;
      el?.complianceSubTopicList?.map((e_l) => {
        tem_comp2 = {...tem_comp2, [e_l.id]: e_l.fileName};
      });
    });
    setTopicStatus({...tem_comp});
    setFileVal({...tem_comp2});
  }

  return (
    <div>
      <Grid container spacing={2} className='sticky-container'>
        {/* <Grid item xs={6}>
                    <Autocomplete
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
                    />
                </Grid> */}
        <Grid item xs={6}>
          <Autocomplete
            id='tags-outlined'
            options={vendorOptions}
            getOptionLabel={(option) => option.title}
            value={vendorVal || null}
            disabled={user?.userList?.userRole == 'VENDOR' ? true : false}
            onChange={(event, value) => {
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
        <Grid item xs={6}>
          <Autocomplete
            id='tags-outlined'
            options={driverOptions}
            getOptionLabel={(option) => option.title}
            value={driverVal || null}
            onChange={(event, value) => setDriverVal(value)}
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
      </Grid>
      <TableContainer
        component={Paper}
        sx={{mt: 4, display: driverVal?.value ? '' : 'none'}}
      >
        <Table aria-label='simple table'>
          <TableHead style={{background: '#f1f1f1'}}>
            <TableRow key={'index'}>
              <TableCell align='left' style={{fontWeight: 'bold'}}>
                Compliance Name
              </TableCell>
              <TableCell align='left' style={{fontWeight: 'bold'}}>
                Sub-Compliance Name
              </TableCell>
              <TableCell align='left' style={{fontWeight: 'bold'}}>
                Status
              </TableCell>
              <TableCell
                align='center'
                style={{fontWeight: 'bold', width: '100px'}}
              >
                Input
              </TableCell>
              <TableCell align='center' style={{fontWeight: 'bold'}}>
                Action
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
                  {row?.tName}
                </TableCell>
                <TableCell component='th' scope='row'>
                  {row?.name}
                </TableCell>
                <TableCell component='th' scope='row'>
                  <div
                    className={
                      topicStatus[row?.tid] == 'MET' ||
                      (row?.inputType == 'date' &&
                        !(new Date() > new Date(fileVal[row?.sid])))
                        ? 'penalty-status-met'
                        : 'penalty-status-not-met'
                    }
                    // onClick={() => {
                    //     if (row?.inputType == 'date') return;
                    //     if (topicStatus[row?.tid] == "NOTMET") {
                    //         setTopicStatus({ ...topicStatus, [row?.tid]: "WAIVEOFF" })
                    //     }
                    //     else if (topicStatus[row?.tid] == "WAIVEOFF") {
                    //         setTopicStatus({ ...topicStatus, [row?.tid]: "MET" })
                    //     }
                    //     else {
                    //         setTopicStatus({ ...topicStatus, [row?.tid]: "NOTMET" })
                    //     }
                    // }}
                  >
                    {row?.inputType == 'date'
                      ? new Date() > new Date(fileVal[row?.sid])
                        ? 'N'
                        : 'M'
                      : topicStatus[row?.tid] == 'MET'
                      ? 'M'
                      : topicStatus[row?.tid] == 'WAIVEOFF'
                      ? 'W'
                      : 'N'}
                  </div>
                </TableCell>
                <TableCell
                  component='th'
                  scope='row'
                  style={{display: 'flex', alignItems: 'center'}}
                >
                  {row?.inputType == 'file' ? (
                    <label
                      style={{
                        background:
                          fileVal[row.sid]?.name || fileVal[row.sid]?.length
                            ? '#d6d6d4'
                            : '',
                      }}
                      for={_ind + 'File'}
                      className='btn-upload-file'
                    >
                      {fileVal[row.sid] ? '...' : ''}
                      {fileVal[row.sid]?.name?.slice(
                        fileVal[row.sid]?.name?.length > 8
                          ? fileVal[row.sid]?.name?.length - 8
                          : 0,
                      ) ||
                        fileVal[row.sid]?.slice(
                          fileVal[row.sid]?.length > 8
                            ? fileVal[row.sid]?.length - 8
                            : 0,
                        ) ||
                        'Upload File'}
                    </label>
                  ) : null}
                  {row?.inputType != 'file' ? (
                    <TextField
                      size='small'
                      id={_ind + 'File'}
                      type={row?.inputType || 'text'}
                      value={fileVal[row?.sid]}
                      InputLabelProps={{shrink: true}}
                      fullWidth
                      variant='outlined'
                      inputProps={{min: moment().format('YYYY-MM-DD')}}
                      onChange={(e) => {
                        setFileVal({...fileVal, [row.sid]: e.target.value});
                        if (row?.inputType == 'date') {
                          if (new Date() > new Date(e.target.value)) {
                            setTopicStatus({
                              ...topicStatus,
                              [row?.tid]: 'NOTMET',
                            });
                          } else {
                            setTopicStatus({...topicStatus, [row?.tid]: 'MET'});
                          }
                        }
                      }}
                    />
                  ) : (
                    <div>
                      <TextField
                        size='small'
                        sx={{display: 'none'}}
                        id={_ind + 'File'}
                        type={row?.inputType || 'text'}
                        InputLabelProps={{shrink: true}}
                        fullWidth
                        variant='outlined'
                        onChange={(e) => {
                          setFileVal({
                            ...fileVal,
                            [row.sid]: e.target.files[0],
                          });
                        }}
                      />
                      {fileVal[row.sid] &&
                      typeof fileVal[row.sid] == 'string' ? (
                        <div
                          style={{
                            cursor: 'pointer',
                            color: 'rgb(0, 220, 255)',
                            marginLeft: '15px',
                          }}
                        >
                          <VisibilityIcon
                            onClick={() => {
                              downDoc?.openDoc(fileVal[row.sid]);
                            }}
                          />
                        </div>
                      ) : null}
                      {fileVal[row.sid] &&
                      typeof fileVal[row.sid] != 'string' ? (
                        <a
                          id={row.sid + 'image_round2'}
                          target='_blank'
                          style={{
                            cursor: 'pointer',
                            color: 'rgb(0, 220, 255)',
                            marginLeft: '15px',
                          }}
                        >
                          <VisibilityIcon />
                        </a>
                      ) : null}
                    </div>
                  )}
                </TableCell>
                <TableCell component='th' scope='row'>
                  <Button
                    id='btnMui123'
                    variant='outlined'
                    disabled={!driverVal?.value}
                    onClick={(e) => {
                      let tem_topic_obj = {};
                      if (row?.inputType == 'file') {
                        let dataSet = {};
                        let tem = {
                          photo: fileVal[row.sid],
                        };
                        Object.keys(tem).map((key) => {
                          dataSet = {
                            ...dataSet,
                            [key]: tem[key],
                          };
                        });
                        axios({
                          method: 'post',
                          url: Api.baseUri + '/user-reg/compliance/save-file',
                          data: getFormData(dataSet),
                          headers: {'Content-Type': 'multipart/form-data'},
                        })
                          .then((res) => {
                            if (res?.status == '200') {
                              let tem_filename = res?.data?.data?.documentName;
                              driverTopicList?.map((temelem) => {
                                temelem?.complianceSubTopicList?.map(
                                  (s_temelem) => {
                                    if (temelem?.id == row?.tid) {
                                      if (s_temelem?.id == row?.sid) {
                                        s_temelem.fileName = tem_filename;
                                        temelem.status =
                                          topicStatus[temelem.id];
                                        tem_topic_obj = temelem;
                                      } else {
                                        s_temelem.fileName =
                                          fileVal[s_temelem?.id];
                                        temelem.status =
                                          topicStatus[temelem.id]; // topicStatus[temelem.id]
                                        tem_topic_obj = temelem;
                                      }
                                    }
                                  },
                                );
                              });
                              let postData = [
                                {
                                  vehicleId: driverVal?.value,
                                  complianceTopic: tem_topic_obj,
                                },
                              ];
                              axios
                                .post(
                                  Api.baseUri +
                                    '/user-reg/vehicle-reg/update-vehicle-topics',
                                  postData,
                                )
                                .then((res) => {
                                  setFileVal({});
                                  setTimeout(() => {
                                    closefun();
                                    loadData();
                                  }, 2000);
                                  if (res?.data?.status == '200') {
                                    toast.success('Updated successfully.');
                                    getVehicleData();
                                  } else {
                                    toast.error(
                                      res?.data?.message ||
                                        'Something went wrong',
                                    );
                                  }
                                })
                                .catch((er) => {
                                  setTimeout(() => {
                                    closefun();
                                    loadData();
                                  }, 2000);
                                  toast.error('Something went wrong');
                                });
                            }
                          })
                          .catch((err) => {});
                      } else {
                        driverTopicList?.map((e_l) => {
                          e_l?.complianceSubTopicList?.map((s_e_l) => {
                            if (s_e_l?.id == row?.sid) {
                              s_e_l.fileName = fileVal[row.sid];
                              e_l.status = topicStatus[e_l.id];
                              tem_topic_obj = e_l;
                            }
                          });
                        });
                        let postData = [
                          {
                            vehicleId: driverVal?.value,
                            complianceTopic: tem_topic_obj,
                          },
                        ];
                        axios
                          .post(
                            Api.baseUri +
                              '/user-reg/vehicle-reg/update-vehicle-topics',
                            postData,
                          )
                          .then((res) => {
                            closefun();
                            if (res?.data?.status == '200') {
                              toast.success('Updated successfully.');
                              getVehicleData();
                            } else {
                              toast.error(
                                res?.data?.message || 'Something went wrong',
                              );
                            }
                          })
                          .catch((er) => {
                            toast.error('Something went wrong');
                          });
                      }
                    }}
                  >
                    <SaveIcon style={{fontSize: '18px', marginRight: '2px'}} />
                    Save
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AddCompliance;
