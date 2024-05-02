import React, {useEffect, useState} from 'react';
import _, {set} from 'lodash';
import api from '@api';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Tab,
  Tabs,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SmartForm from '@smart-form';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import AppTooltip from '@crema/core/AppTooltip';
import AddCompliance from './add-compliance';
import AddPenalty from './add-penalty';
import {toast} from 'react-toastify';
import Api from '@api';
import moment from 'moment';
import PenaltySummary from './penalty-summary';
import ItemWiseSummary from './itemwise-summary';
import {useAuthUser} from '@crema/utility/AuthHooks';
import PenaltyMaster from './penalty-master';
import DriverPenaltySummary from '../Driver/penalty-summary';
import DriverItemWiseSummary from '../Driver/itemwise-summary';
import DriverAddCompliance from '../Driver/add-compliance';
import DriverAddPenalty from '../Driver/add-penalty';
import DriverPenaltyMaster from '../Driver/penalty-master';

const VendorDriverList = ({
  searchTerm,
  saveClicked,
  setSaveClicked,
  actionClicked,
  setActionClicked,
}) => {
  const {user} = useAuthUser();
  const [driverList, setDriverList] = useState([]);
  const [driverListOptions, setDriverListOptions] = useState([]);
  const [driverTopicList, setDriverTopicList] = useState([]);
  const [filteredDriverTopicList, setFilteredDriverTopicList] = useState([]);
  const [openDial, setOpenDial] = useState(false);
  const [topicName, setTopicName] = useState('');
  const [penaltyClick, setPenaltyClick] = useState(false);
  const [penaltyOption, setPenaltyOption] = useState(6);
  const [waiveOffamt_tem, setWaiveOffamt_tem] = useState(0);
  const [mySummary, setMySummary] = useState([]);
  const [DateOf, setDateOf] = useState({});
  const [penaltyItem, setPenaltyItem] = useState({});
  const [openIndivualDial, setOpenIndivualDial] = useState(false);
  const [TabValue, setTabValue] = React.useState(1);
  useEffect(() => {
    if (searchTerm && searchTerm != '' && filteredDriverTopicList) {
      const searchTerms = searchTerm
        .toLowerCase()
        .split(',')
        .map((t) => t.trim());
      console.log('searchTerms', searchTerms);
      const filteredDrivers = filteredDriverTopicList.filter((driver) => {
        const fullName = `${driver?.vehicleNumberPlate}`.toLowerCase();
        // Check if the full name includes either "Sumit" or "driver"
        return searchTerms.some((term) => fullName.includes(term));
      });
      console.log('filteredDrivers', filteredDrivers);
      setDriverList(filteredDrivers);
    } else {
      setDriverList(filteredDriverTopicList);
    }
  }, [searchTerm]);
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };
  useEffect(() => {
    if (!actionClicked) return;
    setPenaltyClick(true);
    setActionClicked(false);
  }, [actionClicked]);
  useEffect(() => {
    if (user?.userList?.userRoleName == 'VENDOR') setPenaltyOption(1);
  }, [user?.userList]);
  useEffect(() => {
    if (!saveClicked) return;
    let postData = [];
    for (const [key, value] of Object.entries(alignment)) {
      postData.push({
        vehicleId: driverList[value?.split('_')[0]]?.id,
        complianceTopic: {
          ...driverTopicList[value?.split('_')[2]],
          status: value?.split('_')[1],
        },
      });
    }
    axios
      .post(
        Api.baseUri + '/user-reg/vehicle-reg/update-vehicle-topics',
        postData,
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          toast.success('Updated successfully.');
          getAllDriverCompTopics();
          // window.location.reload();
        } else {
          toast.error(res?.data?.message || 'Something went wrong');
        }
      })
      .catch((er) => {
        toast.error('Something went wrong');
      });
    setSaveClicked(false);
  }, [saveClicked]);

  const [template, setTemplate] = useState({
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    description: 'Form for verifying OTP',
    sections: [],
  });
  const [alignment, setAlignment] = useState({});
  function handleSubmitDial(v) {}

  const templateIndiv = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'section',
            layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
            fields: [
              {
                type: 'date',
                name: 'effectiveDate',
                id: 'effectiveDate',
                title: ' Date',
                defaultValue: moment().format('YYYY-MM-DD'),
                validationProps: {
                  required: 'This is a mandatory field',
                },
              },
              {
                type: 'text',
                name: 'defPenaltyAmt',
                id: 'defPenaltyAmt',
                title: 'Default Penalty Amount',
                disabled: true,
                validationProps: {
                  required: 'This is a mandatory field',
                },
              },
              {
                type: 'text',
                name: 'waiveOFF',
                id: 'waiveOFF',
                isNumber: true,
                maxVal: Number(penaltyItem?.topic?.defaultPenalty || 0),
                maxChar: 5,
                title: 'Waive-Off Amount',
                // validationProps: {
                //   required: 'This is a mandatory field'
                // }
              },
              {
                type: 'text',
                name: 'tem_status',
                id: 'tem_status',
                disabled: true,
                title: 'Status',
              },
              {
                type: 'text',
                name: 'penaltyAmt',
                id: 'penaltyAmt',
                disabled: true,
                title: 'Penalty Amount',
                // validationProps: {
                //   required: 'This is a mandatory field'
                // }
              },
              {
                type: 'text',
                name: 'remarks',
                id: 'remarks',
                title: 'Remarks',
              },
            ],
          },
        ],
      },
    ],
  };
  function getAllDriverCompTopics() {
    axios
      .get(
        api.baseUri + '/user-reg/compliance-topic/getAllByCorporateId/VEHICLE',
      )
      .then((res) => {
        setDriverTopicList(res?.data?.data);
        getAllDrivers(res?.data?.data);
      })
      .catch((err) => {});
  }
  useEffect(() => {
    getAllDriverCompTopics();
  }, []);

  function getAllDrivers(comp) {
    let tem_align = alignment || {};
    let apibaseuRL =
      user?.userList?.userRole == 'VENDOR'
        ? `/user-reg/associateVehicle/getAllAssociatedVehicles?corporateId=${user?.userList?.corporateId}&vendorId=${user?.userList?.profileId}`
        : `/user-reg/associateVehicle/getAllAssociatedVehicles?corporateId=${
            user?.userList?.corporateId
          }&vendorId=${null}`;
    axios
      .get(
        api.baseUri +
          // '/user-reg/vehicle-reg/corporateId?page=0&size=1000&vehicleNumberPlate=null',
          apibaseuRL,
      )
      .then((response) => {
        console.log('responseee', response);
        let _tem = [];
        // _tem = response?.data?.data;
        response?.data?.data?.map((el) => {
          _tem.push(el?.vehicle);
        });
        // if (user?.userList?.userRoleName == 'VENDOR') {
        //   response?.data?.data?.body['CorporateList']?.map((el) => {
        //     if (el?.vendorId == user?.userList?.profileId) {
        //       _tem.push(el);
        //     }
        //   });
        // } else {
        //   _tem = response?.data?.data?.body['CorporateList'];
        // }

        // let tem = response?.data?.data?.body['CorporateList'];  // did changes on 10 jan 2024 because driver of other vendor was coming in the list
        let tem = _tem;
        console.log('tem', tem);
        let didData = [];
        let datesObj = DateOf || {};
        tem?.map((el, _ind) => {
          didData.push({
            title: el?.vehicleNumberPlate + ' ' + el?.vehicleBrand,
            value: el?.id,
          });
          comp?.map((eb, i) => {
            let tem_status = '';
            if (el?.compliancesDto?.complianceTopics?.length) {
              el?.compliancesDto?.complianceTopics?.map((te_) => {
                if (te_?.id == eb?.id) {
                  tem_status = te_?.status;
                  te_?.complianceSubTopicList?.map((checkit) => {
                    if (checkit?.inputType == 'date') {
                      datesObj[_ind + '_TEMPDATE_' + i] = checkit?.fileName;
                    }
                  });
                }
              });
              if (tem_status)
                tem_align[_ind + '_TOGGLE_' + i] =
                  _ind + '_' + tem_status + '_' + i;
              else tem_align[_ind + '_TOGGLE_' + i] = _ind + '_NOTMET_' + i;
            } else {
              tem_align[_ind + '_TOGGLE_' + i] = _ind + '_NOTMET_' + i;
            }
          });
        });
        setDriverListOptions(didData);
        setDateOf({...datesObj});
        setDriverList(tem);
        setFilteredDriverTopicList(tem);
        setAlignment({...tem_align});
      })
      .catch((err) => {
        setDriverList([]);
      });
  }

  return (
    <>
      {console.log('driverTopicList', driverTopicList)}
      <TableContainer
        component={Paper}
        sx={{
          mt: 4,
          maxHeight: '630px',
        }}
      >
        <Table
          aria-label='simple table'
          sx={{
            tableLayout: 'fixed',
            overflow: 'auto',
            maxHeight: '630px',
            minWidth: driverTopicList?.length < 9 ? '100%' : '250%',
          }}
        >
          <TableHead
            // style={{background: '#f1f1f1'}}
            sx={{
              position: 'sticky',
              top: 0,
              // backgroundColor: '#f5f5f5',
              zIndex: '2',
              background: '#f1f1f1',
            }}
          >
            <TableRow key={'index'}>
              <TableCell
                style={{
                  borderRight: '1px solid #e0e0e0',
                  fontSize: 'inherit',
                  fontWeight: 'bold',
                  position: 'sticky',
                  left: 0,
                  background: '#f1f1f1',
                  zIndex: 801,
                  width: '30px',
                }}
              >
                {'Vehicle Number'}
              </TableCell>
              {driverTopicList?.map((e, index) => {
                return (
                  <>
                    <TableCell
                      align='left'
                      style={{
                        fontWeight: 'bold',
                        width: '40px',
                        position: 'sticky',
                        zIndex: 800,
                        borderRight: '1px solid #e0e0e0',
                      }}
                    >
                      {e.topicNameKey}
                    </TableCell>
                  </>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {driverList?.map((row, _ind) => (
              <TableRow
                key={row.id}
                sx={{
                  position: 'relative',
                  zIndex: '1',
                  '&:last-child td, &:last-child th': {border: 0},
                }}
              >
                <TableCell
                  style={{
                    fontSize: 'inherit',
                    position: 'sticky',
                    left: 0,
                    borderRight: '1px solid #e0e0e0',
                    background: 'white',
                    // zIndex: 799,
                    zIndex: 800,
                    width: '30px',
                  }}
                  component='th'
                  scope='row'
                >
                  {
                    row.vehicleNumberPlate + ' '
                    //  +
                    // (row.vehicleBrand || '-') +
                    // ' ' +
                    // (row?.modelNo || '-')
                  }
                </TableCell>
                {driverTopicList?.map((el, ind) => {
                  return (
                    <TableCell
                      style={{
                        fontSize: 'inherit',
                        borderRight: '1px solid #e0e0e0',
                        position: 'relative',
                        background:
                          DateOf[_ind + '_TEMPDATE_' + ind] &&
                          (new Date(
                            DateOf[_ind + '_TEMPDATE_' + ind],
                          ).getTime() -
                            new Date().getTime()) /
                            (1000 * 60 * 60 * 24) <
                            15
                            ? '#fcf3e7'
                            : alignment[_ind + '_TOGGLE_' + ind] ==
                              _ind + '_MET_' + ind
                            ? '#f8ffef'
                            : '#fff7f7',
                        width: '40px',
                      }}
                      align='left'
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <AppTooltip
                          placement={'top'}
                          title={
                            alignment[_ind + '_TOGGLE_' + ind] ==
                            _ind + '_MET_' + ind
                              ? 'Met'
                              : !alignment[_ind + '_TOGGLE_' + ind] ||
                                alignment[_ind + '_TOGGLE_' + ind] ==
                                  _ind + '_NOTMET_' + ind
                              ? 'Not Met'
                              : alignment[_ind + '_TOGGLE_' + ind] ==
                                _ind + '_WAIVEOFF_' + ind
                              ? 'Waive Off'
                              : ''
                          }
                        >
                          <ToggleButtonGroup
                            color='primary'
                            // value={row?.complianceTopicDto_tem[ind]}
                            value={alignment[_ind + '_TOGGLE_' + ind]}
                            size='small'
                            id={ind + '-tgl' + _ind}
                            style={{height: '24px', whiteSpace: 'nowrap'}}
                            exclusive
                            // row?.complianceTopicDto_tem[ind]
                            aria-label='Platform'
                          >
                            {alignment[_ind + '_TOGGLE_' + ind] ==
                            _ind + '_MET_' + ind ? (
                              <ToggleButton
                                color='success'
                                style={{
                                  fontSize: '18px',
                                  height: '30px',
                                  width: '30px',
                                  borderRadius: '50%',
                                  background: 'white',
                                }}
                                value={_ind + '_MET_' + ind}
                              >
                                M
                              </ToggleButton>
                            ) : null}
                            {/* onClick={() => { setTopicName(el.topicNameKey); handleChange(_ind, "_NOTMET_", ind); }} */}
                            {!alignment[_ind + '_TOGGLE_' + ind] ||
                            alignment[_ind + '_TOGGLE_' + ind] ==
                              _ind + '_NOTMET_' + ind ? (
                              <ToggleButton
                                color='error'
                                style={{
                                  fontSize: '18px',
                                  height: '30px',
                                  width: '30px',
                                  borderRadius: '50%',
                                  background: 'white',
                                }}
                                value={_ind + '_NOTMET_' + ind}
                              >
                                N
                              </ToggleButton>
                            ) : null}
                            {/* onClick={() => { setTopicName(el.topicNameKey); handleChange(_ind, "_WAIVEOFF_", ind); }}  */}
                            {alignment[_ind + '_TOGGLE_' + ind] ==
                            _ind + '_WAIVEOFF_' + ind ? (
                              <ToggleButton
                                color='error'
                                style={{
                                  fontSize: '18px',
                                  height: '30px',
                                  width: '30px',
                                  borderRadius: '50%',
                                  background: 'white',
                                }}
                                value={_ind + '_WAIVEOFF_' + ind}
                              >
                                W
                              </ToggleButton>
                            ) : null}
                            {/* onClick={() => { setTopicName(el.topicNameKey); handleChange(_ind, "_MET_", ind); }}  */}
                          </ToggleButtonGroup>
                        </AppTooltip>
                        {user?.userList?.userRole !== 'VENDOR' && (
                          <AppTooltip title='Add Penalty' placement={'bottom'}>
                            <DriveFileRenameOutlineIcon
                              onClick={() => {
                                if (
                                  alignment[_ind + '_TOGGLE_' + ind] ==
                                  _ind + '_MET_' + ind
                                )
                                  return;
                                setOpenIndivualDial(true);
                                setPenaltyItem({driver: row, topic: el});
                              }}
                              style={{
                                cursor: 'pointer',
                                fontSize: '18px',
                                marginLeft: '6px',
                                opacity:
                                  alignment[_ind + '_TOGGLE_' + ind] ==
                                  _ind + '_MET_' + ind
                                    ? '0.5'
                                    : '',
                                marginTop: '8px',
                              }}
                            />
                          </AppTooltip>
                        )}
                      </div>
                      {DateOf[_ind + '_TEMPDATE_' + ind] &&
                        (new Date(DateOf[_ind + '_TEMPDATE_' + ind]).getTime() -
                          new Date().getTime()) /
                          (1000 * 60 * 60 * 24) >
                          0 &&
                        (new Date(DateOf[_ind + '_TEMPDATE_' + ind]).getTime() -
                          new Date().getTime()) /
                          (1000 * 60 * 60 * 24) <=
                          15 && (
                          <div className='compliance-remainingdays'>
                            {Math.ceil(
                              (new Date(
                                DateOf[_ind + '_TEMPDATE_' + ind],
                              ).getTime() -
                                new Date().getTime()) /
                                (1000 * 60 * 60 * 24),
                            ) + ' days'}
                          </div>
                        )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        onClose={() => {
          setOpenDial(false);
        }}
        open={openDial}
        style={{borderRadius: '4rem'}}
      >
        <DialogTitle
          style={{
            background: '#f5f2f2',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <h1>{topicName}</h1>
          <CloseIcon
            onClick={() => {
              setOpenDial(false);
            }}
            style={{color: '#4f4f4f', fontWeight: 'bold'}}
          />
        </DialogTitle>
        <DialogContent style={{padding: '0px'}}>
          <div style={{padding: '20px', paddingTop: '0', marginTop: '0px'}}>
            <SmartForm
              // defaultValues={data}
              template={template}
              onSubmit={handleSubmitDial}
              buttons={['Submit']}
            />
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={penaltyClick}
        onClose={() => {
          setPenaltyClick(false);
          setPenaltyOption(6);
        }}
        style={{borderRadius: '4rem'}}
        PaperProps={{
          sx: {
            width: '75%',
          },
        }}
      >
        <DialogTitle
          style={{
            background: '#f5f2f2',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <h1>Compliance Actions</h1>
          <CloseIcon
            onClick={() => {
              setPenaltyClick(false);
              setPenaltyOption(6);
            }}
            style={{color: '#4f4f4f', fontWeight: 'bold'}}
          />
        </DialogTitle>
        <DialogContent style={{padding: '0px'}}>
          <div>
            <Grid container spacing={2} sx={{padding: '0px'}}>
              <Grid
                item
                xs={9}
                style={{borderRight: '1px solid #efefef', minHeight: '500px'}}
              >
                <Box className='compliance-tab-sticky' sx={{width: '100%'}}>
                  <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                    <Tabs
                      value={TabValue}
                      onChange={handleChangeTab}
                      aria-label='basic tabs example'
                    >
                      <Tab label='Driver' {...a11yProps(0)} />
                      <Tab label='Vehicle' {...a11yProps(1)} />
                      {/* <Tab label="Vendor" {...a11yProps(2)} /> */}
                    </Tabs>
                  </Box>
                </Box>
                {TabValue == 1 ? (
                  <div style={{padding: '10px'}}>
                    {penaltyOption == 0 &&
                    user?.userList?.userRoleName != 'VENDOR' ? (
                      <AddPenalty
                        driverList={driverList}
                        driverTopicList={driverTopicList}
                        closefun={() => {
                          setPenaltyClick(false);
                          setPenaltyOption(6);
                          getAllDriverCompTopics();
                          setMySummary([]);
                        }}
                      />
                    ) : null}
                    {penaltyOption == 1 ? (
                      <AddCompliance
                        driverList={driverList}
                        driverTopicList={driverTopicList}
                        closefun={() => {
                          getAllDriverCompTopics();
                        }}
                      />
                    ) : null}
                    {penaltyOption == 3 ? (
                      <ItemWiseSummary driverListOptions={driverListOptions} />
                    ) : null}
                    {/* {(penaltyOption == 4) ? <ItemWiseSummary driverListOptions={driverListOptions} /> : null} */}
                    {penaltyOption == 5 ? (
                      <PenaltySummary driverListOptions={driverListOptions} />
                    ) : null}
                    {penaltyOption == 6 &&
                    user?.userList?.userRoleName != 'VENDOR' ? (
                      <PenaltyMaster driverListOptions={driverListOptions} />
                    ) : null}
                  </div>
                ) : (
                  <div style={{padding: '10px'}}>
                    {penaltyOption == 0 &&
                    user?.userList?.userRoleName != 'VENDOR' ? (
                      <DriverAddPenalty
                        driverList={driverList}
                        driverTopicList={driverTopicList}
                        closefun={() => {
                          setPenaltyClick(false);
                          setPenaltyOption(6);
                          getAllDriverCompTopics();
                          setMySummary([]);
                        }}
                      />
                    ) : null}
                    {penaltyOption == 1 ? (
                      <DriverAddCompliance
                        driverList={driverList}
                        driverTopicList={driverTopicList}
                        closefun={() => {
                          getAllDriverCompTopics();
                        }}
                      />
                    ) : null}
                    {penaltyOption == 3 ? (
                      <DriverItemWiseSummary
                        driverListOptions={driverListOptions}
                      />
                    ) : null}
                    {/* {(penaltyOption == 4) ? <ItemWiseSummary driverListOptions={driverListOptions} /> : null} */}
                    {penaltyOption == 5 ? (
                      <DriverPenaltySummary
                        driverListOptions={driverListOptions}
                      />
                    ) : null}
                    {penaltyOption == 6 &&
                    user?.userList?.userRoleName != 'VENDOR' ? (
                      <DriverPenaltyMaster
                        driverListOptions={driverListOptions}
                      />
                    ) : null}
                  </div>
                )}
              </Grid>
              {/* <Grid item xs={9} style={{ borderRight: '1px solid #efefef', minHeight: '500px' }}>
                <div style={{ padding: '20px' }}>
                  {((penaltyOption == 6) && (user?.userList?.userRoleName != 'VENDOR')) ? <PenaltyMaster driverListOptions={driverListOptions} /> : null}
                  {((penaltyOption == 0) && (user?.userList?.userRoleName != 'VENDOR')) ? <AddPenalty driverList={driverList} driverTopicList={driverTopicList} closefun={() => { setPenaltyClick(false); setPenaltyOption(6); getAllDriverCompTopics(); setMySummary([]); }} /> : null}
                  {(penaltyOption == 1) ? <AddCompliance driverList={driverList} driverTopicList={driverTopicList} closefun={() => { getAllDriverCompTopics(); }} /> : null}
                  {(penaltyOption == 3) ? <ItemWiseSummary driverListOptions={driverListOptions} /> : null}
                  {(penaltyOption == 5) ? <PenaltySummary driverListOptions={driverListOptions} /> : null}
                </div>
              </Grid> */}
              <Grid item xs={3} style={{padding: '0'}}>
                <div className='sticky-container' style={{top: '0px'}}>
                  {user?.userList?.userRoleName == 'VENDOR' ? null : (
                    <div
                      className='penalty-compliance-right-option'
                      onClick={() => {
                        setPenaltyOption(6);
                      }}
                      style={{
                        marginBottom: '2px',
                        color: penaltyOption == 6 ? '#ffa500' : '',
                      }}
                    >
                      Penalty Master
                    </div>
                  )}
                  {user?.userList?.userRoleName == 'VENDOR' ? null : (
                    <div
                      className='penalty-compliance-right-option'
                      onClick={() => {
                        setPenaltyOption(0);
                        setMySummary([]);
                      }}
                      style={{
                        marginBottom: '2px',
                        color: penaltyOption == 0 ? '#ffa500' : '',
                      }}
                    >
                      Add Penalty
                    </div>
                  )}
                  <div
                    className='penalty-compliance-right-option'
                    onClick={() => {
                      setPenaltyOption(1);
                      setMySummary([]);
                    }}
                    style={{
                      marginBottom: '2px',
                      color: penaltyOption == 1 ? '#ffa500' : '',
                    }}
                  >
                    Update Compliance
                  </div>
                  <div
                    className='penalty-compliance-right-option'
                    onClick={() => {
                      setPenaltyOption(3);
                    }}
                    style={{
                      marginBottom: '2px',
                      color: penaltyOption == 3 ? '#ffa500' : '',
                    }}
                  >
                    Item-Wise Penalty
                  </div>
                  {/* <div className='penalty-compliance-right-option' onClick={() => { setPenaltyOption(4); }} style={{ marginBottom: '2px', color: (penaltyOption == 4) ? '#ffa500' : '' }}>Date-Wise Penalty</div> */}
                  <div
                    className='penalty-compliance-right-option'
                    onClick={() => {
                      setPenaltyOption(5);
                    }}
                    style={{
                      marginBottom: '2px',
                      color: penaltyOption == 5 ? '#ffa500' : '',
                    }}
                  >
                    Penalty Summary
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={openIndivualDial} onClose={() => {}}>
        <DialogTitle
          style={{
            background: '#f5f2f2',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <h1>
            {penaltyItem?.driver?.vehicleNumberPlate} (
            {penaltyItem?.topic?.topicNameKey})
          </h1>
          <CloseIcon
            onClick={() => {
              setPenaltyItem({});
              setOpenIndivualDial(false);
            }}
            style={{color: '#4f4f4f', fontWeight: 'bold'}}
          />
        </DialogTitle>
        <DialogContent style={{padding: '15px', paddingTop: '0'}}>
          <SmartForm
            template={templateIndiv}
            defaultValues={{
              defPenaltyAmt: penaltyItem?.topic?.defaultPenalty,
              effectiveDate: moment().format('YYYY-MM-DD'),
            }}
            setVal={[
              {
                name: 'penaltyAmt',
                value:
                  Number(penaltyItem?.topic?.defaultPenalty || 0) -
                  waiveOffamt_tem,
              },
              {
                name: 'tem_status',
                value: waiveOffamt_tem == 0 ? 'Not Met' : 'WAIVEOFF',
              },
            ]} // waiveOFF
            onChange={(e) => {
              if (waiveOffamt_tem != e?.waiveOFF)
                setWaiveOffamt_tem(Number(e?.waiveOFF || 0));
            }}
            onSubmit={(v) => {
              let postData = [
                {
                  status:
                    Number(penaltyItem?.topic?.defaultPenalty || 0) ==
                    Number(v?.data?.penaltyAmt || 0)
                      ? 'NOTMET'
                      : 'WAIVEOFF',
                  defaultPenalty: Number(
                    penaltyItem?.topic?.defaultPenalty || 0,
                  ),
                  waveOffAmount:
                    Number(penaltyItem?.topic?.defaultPenalty || 0) -
                    Number(v?.data?.penaltyAmt || 0),
                  finalPenalty: Number(v?.data?.penaltyAmt || 0),
                  entityId: penaltyItem?.driver?.id,
                  topicNameKey: penaltyItem?.topic?.topicNameKey,
                  topicId: penaltyItem?.topic?.id,
                  topicName: penaltyItem?.topic?.topicName,
                  penaltyEffectiveDate: v?.data?.effectiveDate,
                  remarks: v?.data?.remarks,
                  vendorName: penaltyItem?.driver?.vendorName,
                  vendorId: penaltyItem?.driver?.vendorId,
                  driverName: '-',
                  vehicleName:
                    penaltyItem?.driver?.vehicleNumberPlate +
                    ' - ' +
                    penaltyItem?.driver?.vehicleBrand,
                },
              ];
              axios
                .post(
                  Api.baseUri +
                    '/user-reg/vehicle-reg/add-vehicle-topic-penalty',
                  postData,
                )
                .then((res) => {
                  if (res?.data?.status == '200') {
                    toast.success('Penalty added successfully.');
                    getAllDriverCompTopics();
                    setPenaltyItem({});
                    setOpenIndivualDial(false);
                  } else {
                    toast.error(res?.data?.message || 'Something went wrong.');
                  }
                })
                .catch((err) => {
                  toast.error('Something went wrong.');
                });
            }}
            buttons={['Submit']}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
export default VendorDriverList;
