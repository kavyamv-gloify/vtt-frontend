import React, {useState, useEffect} from 'react';
import CustomLabel from 'pages/common/CustomLabel';
import AppTooltip from '@crema/core/AppTooltip';
import {Autocomplete, Button, Grid} from '@mui/material';
import {Box} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import AppLoader from '@crema/core/AppLoader';
import SmartForm from '@smart-form';
import {useAuthUser} from '@crema/utility/AuthHooks';
import axios from 'axios';
import {toast} from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Api from '@api';
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
import Confirm from '@confirmation-box';
const Teams = () => {
  const [open, setOpen] = useState(false);
  const [showbtn, setshowbtn] = useState(true);
  const [agentList, setAgentList] = useState();
  const [getAllList, setGetAllList] = useState();
  const [data, setData] = useState();
  const [openEdit, setOpenEdit] = useState(false);
  const [openAddAgent, setOpenAddAgent] = useState(false);
  const [levelAgent, setLevelAgent] = useState();
  const [listObj, setListObj] = useState({});
  const [selectedItem, setSelectedItem] = useState({});
  const [newaction, setNewAction] = useState();
  const [leaveList, setLeaveList] = useState('');
  const [leaveList2, setLeaveList2] = useState('');
  const [leaveList3, setLeaveList3] = useState('');
  const [openConfirmbox, setOpenConfirmBox] = useState(false);
  const [openReactivateConfirmbox, setOpenReactivateConfirmbox] =
    useState(false);
  const {user} = useAuthUser();

  function getAll() {
    axios
      .get(
        Api.baseUri +
          '/user-reg/incidentTeam/getAllByCorporateId/' +
          user?.userList?.corporateId,
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          setGetAllList(res?.data?.data);
        }
      })
      .catch((err) => {});
  }
  useEffect(() => {
    getAll();
  }, []);

  useEffect(() => {
    if (!data) {
      return;
    } else {
      setOpenEdit(true);
      let postData = {};
      agentList?.map((el) => {
        if (el?.value == data?.level1OwnerId) {
          postData.level1 = el;
        }
        if (el?.value == data?.level2OwnerId) {
          postData.level2 = el;
        }
        if (el?.value == data?.level3OwnerId) {
          postData.level3 = el;
        }
      });
      setSelectedItem(postData);
    }
  }, [data]);

  useEffect(() => {
    let postData = {
      page: '0',
      size: '10',
      role: 'AGENT',
      corporateId: user?.userList?.corporateId,
      roleCode: 'EMPLOYEE',
    };
    axios
      .post(Api.baseUri + '/userauth/user-account/getAllUserData', postData)
      .then((res) => {
        if (res?.data?.status == '200') {
          let temp = [];

          res?.data?.data?.body?.UserList?.map((el) => {
            temp.push({title: el?.userName, value: el?.profileId});
          });
          setAgentList(temp ?? []);
        }
      })
      .catch((err) => {
        setAgentList([]);
      });
  }, []);
  const header = [
    'Team Name',
    'Team Description',
    'Number of Agents',
    'Status',
    'Action',
  ];
  function handleSubmit(val) {
    if (val?.button == 'submit') {
      let postData = {
        teamName: val?.data?.teamName,
        corporateId: user?.userList?.corporateId,
        teamDescription: val?.data?.teamDescription,
        teamMembers: val?.data?.teamMembers,
        status: 'ACTIVE',
      };

      axios
        .post(Api.baseUri + '/user-reg/incidentTeam/save', postData)
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success('Team created Successfully');
            setOpen(false);
            getAll();
          } else if (res?.data?.status == '400') {
            toast.error(res?.data?.message);
          } else {
            toast.error('Something went wrong');
          }
        });
    }
  }
  function handleSubmitAgent(val) {
    if (val?.button == 'submit') {
      let postData = data;
      postData.teamMembers = val?.data?.teamMembers;
      axios
        .put(Api.baseUri + '/user-reg/incidentTeam/update', postData)
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success('Agent Added Successfully.');
            setOpenAddAgent(false);
            getAll();
          }
        });
    }
  }
  function handleEdit() {
    let postData = data;
    postData.level1OwnerId = selectedItem?.level1?.value;
    postData.level2OwnerId = selectedItem?.level2?.value;
    postData.level3OwnerId = selectedItem?.level3?.value;

    axios
      .put(Api.baseUri + '/user-reg/incidentTeam/update', postData)
      .then((res) => {
        if (res?.data?.status == '200') {
          toast.success('Team Updated Successfully');
          setOpenEdit(false);
          getAll();
        }
      });
  }

  function getEmployeeDetail(val) {
    axios
      .post(
        Api.baseUri + '/user-reg/employee-reg/getEmpDetailsByIds?empIds=' + val,
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          let temp = [];
          res?.data?.data?.map((el) => {
            temp.push({title: el?.employeeFullName, value: el?.id});
          });
          setLevelAgent(temp ?? []);
        }
      })
      .catch((err) => {
        setLevelAgent([]);
      });
  }

  const closeConfirmBox = (dd) => {
    // debugger
    if (dd == 'YES') {
      let postData = {...listObj};
      postData.status = 'INACTIVE';
      // console.log("postData", postData)
      axios
        .put(Api.baseUri + '/user-reg/incidentTeam/update', postData)
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success('Team Deactivated Successfully');
            getAll();
            setOpenConfirmBox(false);
          } else {
            setOpenConfirmBox(false);
          }
        });
    } else {
      setOpenConfirmBox(false);
    }
  };

  const closeConfirmBoxReactivate = (dd) => {
    if (dd == 'YES') {
      let postData = {...listObj};
      postData.status = 'ACTIVE';
      // console.log("postData", postData)
      axios
        .put(Api.baseUri + '/user-reg/incidentTeam/update', postData)
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success('Team Reactivated Successfully');
            getAll();
            setOpenReactivateConfirmbox(false);
          } else {
            setOpenReactivateConfirmbox(false);
          }
        });
    } else {
      setOpenReactivateConfirmbox(false);
    }
  };

  let template = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    description: 'Form for applying Job',
    sections: [
      {
        layout: {column: 2, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'text',
            name: 'teamName',
            id: 'teamName',
            title: 'Team Name',
            validationProps: {
              required: 'This is a mandatory field',
            },
          },

          {
            type: 'text',
            name: 'teamDescription',
            id: 'teamDescription',
            title: 'Team Description',
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'multiSelect',
            name: 'teamMembers',
            id: 'teamMembers',
            title: 'Select Agent',
            options: agentList ?? [],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
        ],
      },
    ],
  };

  let templateAgent = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    description: 'Form for applying Job',
    sections: [
      {
        layout: {column: 1, spacing: 1, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'multiSelect',
            name: 'teamMembers',
            id: 'teamMembers',
            title: 'Select Agent',
            options: agentList ?? [],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
        ],
      },
    ],
  };
  useEffect(() => {
    setNewAction(levelAgent);
  }, [levelAgent]);

  function newarray() {
    let temp = [];
    for (let [key, value] of Object.entries(selectedItem)) {
      temp.push(value?.value);
    }
    console.log('temp', temp);
    temp = temp.filter(function (element) {
      return element !== undefined;
    });

    let temparray = [];
    levelAgent?.map((el) => {
      if (temp.includes(el?.value)) {
        return;
      } else {
        temparray.push(el);
      }
    });
    console.log('temparray', temparray);
    setNewAction(temparray);
  }
  useEffect(() => {
    newarray();
  }, [selectedItem, levelAgent]);

  return (
    <>
      <Grid container spacing={2} sx={{padding: '30px'}}>
        <Grid item xs={9} md={9}>
          <CustomLabel labelVal='Teams' variantVal='h3-underline' />
        </Grid>
        <Grid item xs={3} md={3}>
          <Box display='flex' justifyContent='flex-end'>
            <div
              className='left-seperator'
              onClick={() => {
                setOpen(true);
              }}
            >
              <AppTooltip placement={'top'} title={'Add Teams'}>
                <img
                  src='/assets/images/team-queue.svg'
                  className='title-icons-mui'
                />
              </AppTooltip>
            </div>
          </Box>
        </Grid>
      </Grid>
      <Grid container sx={{padding: '0px 20px 0px 20px'}}>
        <Grid item xs={12} md={12}>
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
                {getAllList?.length ? (
                  getAllList?.map((el, i) => {
                    return (
                      <TableRow
                        style={{background: i % 2 == 0 ? '' : '#f5f7ff'}}
                      >
                        <TableCell> {el?.teamName} </TableCell>
                        <TableCell> {el?.teamDescription} </TableCell>
                        <TableCell> {el?.teamMembers?.length} </TableCell>
                        <TableCell
                          sx={{color: el?.status == 'ACTIVE' ? 'green' : 'red'}}
                        >
                          {el?.status || 'NA'}
                        </TableCell>
                        <TableCell sx={{display: 'flex'}}>
                          <AppTooltip title='Edit'>
                            <EditIcon
                              color='primary'
                              style={{
                                opacity: el?.status == 'INACTIVE' ? '0.3' : '',
                              }}
                              onClick={() => {
                                if (el?.status == 'INACTIVE') {
                                  return;
                                }
                                setData(el);
                                setOpenEdit(true);
                                getEmployeeDetail(el?.teamMembers);
                              }}
                            />
                          </AppTooltip>
                          <AppTooltip title='Add Agent'>
                            <div style={{marginLeft: '20px'}}>
                              <AddCircleOutlineIcon
                                color='primary'
                                style={{
                                  opacity:
                                    el?.status == 'INACTIVE' ? '0.3' : '',
                                }}
                                onClick={() => {
                                  if (el?.status == 'INACTIVE') {
                                    return;
                                  }
                                  // setData(el);
                                  setOpenAddAgent(true);
                                  // getEmployeeDetail(el?.teamMembers);
                                }}
                              />
                            </div>
                          </AppTooltip>
                          <AppTooltip title='Deactivate Team'>
                            <div style={{marginLeft: '20px'}}>
                              <Delete
                                style={{
                                  color: '#bc0805',
                                  opacity:
                                    el?.status == 'INACTIVE' ? '0.3' : '',
                                }}
                                onClick={() => {
                                  if (el?.status == 'ACTIVE') {
                                    setOpenConfirmBox(true);
                                    setListObj(el);
                                  }
                                }}
                                color='primary'
                              />
                            </div>
                          </AppTooltip>
                          <AppTooltip title='Reactivate Team'>
                            <div>
                              <RestoreIcon
                                style={{
                                  opacity: el?.status == 'ACTIVE' ? '0.3' : '',
                                  marginLeft: '20px',
                                }}
                                onClick={() => {
                                  if (el?.status == 'ACTIVE') {
                                    return;
                                  }
                                  setListObj(el);
                                  setOpenReactivateConfirmbox(true);
                                }}
                                color='primary'
                              />
                            </div>
                          </AppTooltip>
                        </TableCell>
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
              <TableFooter></TableFooter>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Dialog
        open={open}
        style={{borderRadius: '4rem'}}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '800px',
          },
        }}
      >
        <div>
          <DialogContent style={{padding: '0px'}}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                background: '#f5f2f2',
                height: '4rem',
                paddingRight: '1.5rem',
                paddingLeft: '1.5rem',
              }}
            >
              <h1 style={{marginTop: '1.5rem'}}>Add New Team</h1>
              <CloseIcon
                onClick={() => {
                  setOpen(false);
                }}
                style={{
                  marginTop: '1.4rem',
                  color: '#4f4f4f',
                  fontWeight: 'bold',
                }}
              />
            </div>
            <div style={{padding: '2rem', paddingTop: '0rem'}}>
              <>
                {!showbtn ? <AppLoader /> : null}

                <SmartForm
                  template={template}
                  onSubmit={handleSubmit}
                  buttons={['submit']}
                />
              </>
            </div>
          </DialogContent>
        </div>
      </Dialog>

      <Dialog
        open={openEdit}
        style={{borderRadius: '4rem'}}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '600px',
          },
        }}
      >
        <div>
          <DialogContent style={{padding: '0px'}}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                background: '#f5f2f2',
                height: '4rem',
                padding: '0px 33px 0px 32px',
              }}
            >
              <h1 style={{marginTop: '1.5rem'}}>Level</h1>
              <CloseIcon
                onClick={() => {
                  setOpenEdit(false);
                }}
                style={{
                  marginTop: '1.4rem',
                  color: '#4f4f4f',
                  fontWeight: 'bold',
                }}
              />
            </div>
            <div
              style={{
                padding: '40px',
              }}
            >
              <>
                {!showbtn ? <AppLoader /> : null}

                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <h4 style={{marginTop: '1rem'}}>Level 1 :</h4>
                  <Autocomplete
                    disablePortal
                    id='actions'
                    size='small'
                    value={selectedItem?.level1}
                    options={newaction}
                    getOptionLabel={(option) => option.title}
                    onChange={(e, option, v) => {
                      setSelectedItem({
                        ...selectedItem,
                        level1: option,
                      });
                    }}
                    sx={{width: '70%', m: 2}}
                    renderInput={(params) => (
                      <TextField {...params} label='Level 1' />
                    )}
                  />
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <h4 style={{marginTop: '1rem'}}>Level 2 : </h4>
                  <Autocomplete
                    disablePortal
                    id='actions'
                    size='small'
                    value={selectedItem?.level2}
                    options={newaction}
                    getOptionLabel={(option) => option.title}
                    onChange={(e, option, v) => {
                      setSelectedItem({
                        ...selectedItem,
                        level2: option,
                      });
                    }}
                    sx={{width: '70%', m: 2}}
                    renderInput={(params) => (
                      <TextField {...params} label='Level 2' />
                    )}
                  />
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <h4 style={{marginTop: '1rem'}}>Level 3 : </h4>
                  <Autocomplete
                    disablePortal
                    id='actions'
                    size='small'
                    value={selectedItem?.level3}
                    options={newaction}
                    getOptionLabel={(option) => option.title}
                    onChange={(e, option, v) => {
                      setSelectedItem({
                        ...selectedItem,
                        level3: option,
                      });
                    }}
                    sx={{width: '70%', m: 2}}
                    renderInput={(params) => (
                      <TextField {...params} label='Level 3' />
                    )}
                  />
                </div>
                <Button
                  type='submit'
                  style={{margin: '1rem 13rem'}}
                  variant='contained'
                  onClick={() => {
                    handleEdit();
                  }}
                >
                  Submit
                </Button>
              </>
            </div>
          </DialogContent>
        </div>
      </Dialog>

      <Dialog
        open={openAddAgent}
        style={{borderRadius: '4rem'}}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '500px',
          },
        }}
      >
        <DialogContent style={{padding: '0px'}}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              background: '#f5f2f2',
              height: '4rem',
              paddingRight: '1.5rem',
              paddingLeft: '1.5rem',
            }}
          >
            <h1 style={{marginTop: '1.5rem'}}>Add Agents</h1>
            <CloseIcon
              onClick={() => {
                setOpenAddAgent(false);
              }}
              style={{
                marginTop: '1.4rem',
                color: '#4f4f4f',
                fontWeight: 'bold',
              }}
            />
          </div>
          <div style={{padding: '2rem', paddingTop: '0rem'}}>
            <>
              {!showbtn ? <AppLoader /> : null}
              <SmartForm
                template={templateAgent}
                onSubmit={handleSubmitAgent}
                buttons={['submit']}
              />
            </>
          </div>
        </DialogContent>
      </Dialog>

      <Confirm
        open={openConfirmbox}
        header={'Confirm to Deactivate'}
        cnfMsg={'Are you sure, You want to deactivate the Team?'}
        handleClose={closeConfirmBox}
      />
      <Confirm
        open={openReactivateConfirmbox}
        header={'Confirm to Reactivate'}
        cnfMsg={'Are you sure, You want to reactivate the Team?'}
        handleClose={closeConfirmBoxReactivate}
      />
    </>
  );
};

export default Teams;
