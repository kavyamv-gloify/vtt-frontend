import React, {useEffect, useState} from 'react';
import {
  Avatar,
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  Select,
  Tooltip,
} from '@mui/material';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import ReplyOutlinedIcon from '@mui/icons-material/ReplyOutlined';
import MarkEmailUnreadOutlinedIcon from '@mui/icons-material/MarkEmailUnreadOutlined';
import PermContactCalendarOutlinedIcon from '@mui/icons-material/PermContactCalendarOutlined';
import PhoneIcon from '@mui/icons-material/Phone';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import History from './TicketTabComponent/History';
import Menu from '@mui/material/Menu';
// import FormGroup from '@mui/material/FormGroup';
// import FormControlLabel from '@mui/material/FormControlLabel';
import {
  FormGroup,
  FormControlLabel,
  Switch,
  createTheme,
  ThemeProvider,
} from '@mui/material';
// import Switch from '@mui/material/Switch';
import Resolution from './TicketTabComponent/Resolution';
import ResolutionCopy from './TicketTabComponent/ResolutionCopy';
import Comment from './TicketTabComponent/Comment';
import Conversation from './TicketTabComponent/Conversation';
import MenuItem from '@mui/material/MenuItem';
import ForwardOutlinedIcon from '@mui/icons-material/ForwardOutlined';
import ReplyAllOutlinedIcon from '@mui/icons-material/ReplyAllOutlined';
import AppTooltip from '@crema/core/AppTooltip';
import moment from 'moment';
import {useAuthUser} from '@crema/utility/AuthHooks';
import EmailBody from './TicketTabComponent/EmailBody';
import Confirm from '@confirmation-box';
import axios from 'axios';
import Api from '@api';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import Attachement from './TicketTabComponent/Attachement';
import SmartForm from '@smart-form';
const GeneralInfo_Copy = ({ticketInfo, tripInfo}) => {
  const [value, setValue] = React.useState('1');
  const [openComment, setOpenComment] = useState(false);
  const [openEmail, setOpenEmail] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [close, setClose] = useState(false);
  const [reopen, setReopen] = useState(false);
  const [buttonToggle, setButtonToggle] = useState();
  const [updatedData, setUpdatedData] = useState();
  const [channelList, setChannelList] = useState();
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (!ticketInfo) {
      setUpdatedData({});
    } else {
      setUpdatedData({
        id: ticketInfo?.id,
        ticketOwnerName: ticketInfo?.ticketOwnerName,
        status: ticketInfo?.status,
        dueDate: ticketInfo?.dueDate,
        mobileNo: ticketInfo?.mobileNo,
        incidentType: ticketInfo?.incidentType,
        channelName: ticketInfo?.channelName,
        classification: ticketInfo?.classification,
      });
    }
  }, [ticketInfo]);

  useEffect(() => {
    axios
      .get(
        Api.baseUri +
          '/user-reg/channel/getChannelByCorporateId/' +
          user?.userList?.corporateId,
      )
      .then((res) => {
        let temp = [];
        if (res?.data?.status == '200') {
          res?.data?.data?.map((el) => {
            temp.push({title: el?.channelName, value: el?.id});
          });
        }
        setChannelList(temp ?? []);
      })
      .catch((err) => {});
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setOpenEmail(true);
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const {user} = useAuthUser();
  function closeConfirmBox(d) {
    if (d == 'YES') {
      {
        let postData = ticketInfo;
        postData.status = 'CLOSED';
        axios
          .put(
            Api.baseUri +
              '/user-reg/incident-management/update-incident-management',
            postData,
          )
          .then((res) => {
            if (res?.data?.status == '200') {
              toast.success('Ticket closed successfully');
              setClose();
              navigate('/incident-view');
            }
          });
      }
    } else {
      setClose(false);
    }
  }

  function reopenConfirmBox (d) {
    if (d == 'YES') {
      {
        let postData = ticketInfo;
        postData.status = 'REOPEN';
        axios
          .put(
            Api.baseUri +
              '/user-reg/incident-management/update-incident-management',
            postData,
          )
          .then((res) => {
            if (res?.data?.status == '200') {
              toast.success('Ticket reopen successfully');
              setReopen();
              navigate('/incident-view');
            }
          });
      }
    } else {
      setReopen(false);
    }
  }

  const theme = createTheme({
    palette: {
      primary: {
        main: '#4CAF50', // Green color
      },
    },
  });

  console.log('generalInfo ticket', ticketInfo);

  async function handleSubmit(value) {
    console.log('edit ticketd value', value);
    let postData = ticketInfo;
    postData.dueDate = value?.data?.dueDate;
    postData.status = value?.data?.status;
    postData.incidentType = value?.data?.incidentType;
    postData.channelName = value?.data?.channelName;
    postData.classification = value?.data?.classification;

    await axios
      .put(
        Api.baseUri +
          `/user-reg/incident-management/update-incident-management`,
        postData,
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          toast.success('ticket updated sucessfully');
        }
      })
      .catch((err) => {});
  }

  let template = {
    layout: {
      column: 1,
      spacing: 1,
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
            type: 'text',
            name: 'ticketOwnerName',
            id: 'ticketOwnerName',
            title: 'Assign To',
            disabled: true,
            // infoMessage: ["Radio button is selectable", "e.g.: yes"],
            // validationProps: {
            //   required: 'This is a mandatory field',
            // },
          },
          {
            type: 'text',
            name: 'status',
            id: 'status',
            title: 'Status',
            disabled: true,
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'date',
            name: 'dueDate',
            id: 'dueDate',
            title: 'Due Date',
            render: (rd) => {
              return moment.utc(rd.dueDate).local().format('DD/MM/YYYY HH:mm');
            },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'text',
            name: 'mobileNo',
            id: 'mobileNo',
            title: 'Phone Number',
            disabled: true,
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'autocomplete',
            name: 'incidentType',
            id: 'incidentType',
            title: 'Incident Type',
            options: [
              {title: 'SOS', value: 'SOS'},
              {title: 'Feed Back', value: 'Feed Back'},
              {title: 'Support', value: 'Support'},
              {title: 'Safe Reach', value: 'Safe Reach'},
              {title: 'Application-technology', value: 'Application-technology'},
              {title: 'Over Speeding', value: 'Over Speeding'},
              {title: 'Other', value: 'Other'},
            ], 
            validationProps: {
              size: {
                value: 5,
                message: 'File size should not be more than 5 mb.',
              },
            },
          },
          {
            type: 'autocomplete', // channelId,channelName
            name: 'channelName',
            id:  'channelName',
            title: 'Channel',
            options: channelList ?? [],
          },
          {
            type: 'autocomplete',
            name: 'classification',
            id: 'classification',
            title: 'Classification',
            options: [
              {title: 'Question', value: 'Question'},
              {title: 'Problem', value: 'Problem'},
              {title: 'Feature', value: 'Feature'},
              {title: 'Others', value: 'Others'},
            ],
          },
        ],
      },
    ],
  };
  return (
    <div>
      <Grid container>
        <Grid md={3} sx={{border: '1px solid rgba(224, 224, 224, 1)'}}>
          <Grid container>
            <Grid md={12} sx={{padding: '10px'}}>
              <Box
                sx={{
                  borderBottom: '1px solid rgba(224, 224, 224, 1)',
                  borderBottomStyle: 'dashed  ',
                  padding: '10px',
                }}
              >
                <Box
                  component='h3'
                  sx={{
                    fontWeight: 600,
                    fontSize: 16,
                    textAlign: 'left',
                    lineHeight: 1,
                    marginBottom: '10px',
                  }}
                >
                  {ticketInfo?.ticketForName}
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <PermContactCalendarOutlinedIcon
                    sx={{
                      fontSize: 'medium',
                      fontWeight: '600',
                      marginRight: '5px',
                    }}
                  />
                  {ticketInfo?.departmentName || 'NA'}
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <MarkEmailUnreadOutlinedIcon
                    sx={{
                      fontSize: 'medium',
                      fontWeight: '600',
                      marginRight: '5px',
                    }}
                  />
                  {ticketInfo?.emailId || 'NA'}{' '}
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '15px',
                  }}
                >
                  <PhoneIcon
                    sx={{
                      fontSize: 'medium',
                      fontWeight: '600',
                      marginRight: '5px',
                    }}
                  />
                  {ticketInfo?.mobileNo || 'NA'}{' '}
                </Box>
              </Box>
            </Grid>
            {/* <Grid md={12}>
              <Box sx={{padding: '10px'}}>
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: '800',
                    color: '#909497',
                  }}
                >
                  Assign To
                </p>
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                  <Avatar
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      m: '0',
                      mr: 2,
                      height: 25,
                      width: 25,
                      border: '1px solid #D7DBDD',
                      backgroundColor: 'white',
                      marginRight: '10px',
                    }}
                  ></Avatar>
                  <p style={{fontSize: '12px', fontWeight: '800'}}>
                    {ticketInfo?.ticketForName || 'NA'}
                  </p>
                </Box>
              </Box>
              <Box sx={{padding: '10px'}}>
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: '800',
                    color: '#909497',
                  }}
                >
                  Status
                </p>
                <p style={{fontSize: '12px', fontWeight: '800'}}>
                  {ticketInfo?.status || 'NA'}
                </p>
              </Box>
              <Box sx={{padding: '10px'}}>
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: '800',
                    color: '#909497',
                  }}
                >
                  Due Date
                </p>
                <p style={{fontSize: '12px', fontWeight: '800'}}>
                  {ticketInfo?.dueDate || 'NA'}
                </p>
              </Box>
              <Box sx={{padding: '10px'}}>
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: '800',
                    color: '#909497',
                  }}
                >
                  Phone Number
                </p>
                <p style={{fontSize: '12px', fontWeight: '800'}}>
                  {ticketInfo?.mobileNo || 'NA'}
                </p>
              </Box>
              <Box sx={{padding: '10px'}}>
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: '800',
                    color: '#E74C3C',
                  }}
                >
                  Incident Type
                </p>
                <p style={{fontSize: '12px', fontWeight: '800'}}>SOS</p>
              </Box>
              <Box sx={{padding: '10px'}}>
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: '800',
                    color: '#E74C3C',
                  }}
                >
                  Channel
                </p>
                <p style={{fontSize: '12px', fontWeight: '800'}}>
                  {ticketInfo?.channelName || 'NA'}
                </p>
              </Box>
              <Box sx={{padding: '10px'}}>
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: '800',
                    color: '#E74C3C',
                  }}
                >
                  Classification
                </p>
                <p style={{fontSize: '12px', fontWeight: '800'}}>
                  {ticketInfo?.classification || 'NA'}
                </p>
              </Box>
            </Grid> */}
            {/* Edit ticket form */}
            <div style={{padding: '0px 32px 0px 32px'}}>
              {updatedData?.id && (
                <SmartForm
                  template={template}
                  // onChange={handleChange}
                  onSubmit={handleSubmit}
                  defaultValues={updatedData}
                  buttons={['Update']}
                />
              )}
            </div>
          </Grid>
        </Grid>
        <Grid md={9} sx={{border: '1px solid rgba(224, 224, 224, 1)'}}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px',
              marginBottom: '15px',
              borderBottom: '1px solid rgba(224, 224, 224, 1)',
            }}
          >
            <Box sx={{display: 'flex', alignItems: 'center'}}>
              <Avatar
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  m: '0',
                  mr: 2,
                  height: 40,
                  width: 40,
                  border: '1px solid #D7DBDD',
                  backgroundColor: 'white',
                }}
              >
                <MarkEmailUnreadOutlinedIcon sx={{color: '#D7DBDD'}} />
              </Avatar>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginLeft: '10px',
                }}
              >
                <Box
                  component='h3'
                  sx={{
                    fontWeight: 600,
                    fontSize: 16,
                    textAlign: 'left',
                    lineHeight: 1,
                    marginBottom: '8px',
                  }}
                >
                  {'#' + ticketInfo?.corporateId.toUpperCase()}
                  {'    ' + ticketInfo?.subject}
                </Box>
                <Box
                  component='h5'
                  sx={{
                    fontWeight: 400,
                    fontSize: 12,
                    textAlign: 'left',
                    lineHeight: 1,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <AccessTimeOutlinedIcon
                    sx={{
                      fontSize: 'small',
                      color: 'green',
                      fontWeight: '800',
                      marginRight: '5px',
                    }}
                  />
                  {moment(ticketInfo?.createdOn).format('lll')}
                </Box>
              </Box>
            </Box>
            {
              <Box sx={{display: 'flex'}}>
                {/* <Avatar
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    m: '0',
                    mr: 2,
                    height: 40,
                    width: 40,
                    backgroundColor: '#85C1E9',
                  }}
                >
                  <ReplyOutlinedIcon
                    sx={{color: 'white'}}
                    id='demo-positioned-button'
                    aria-controls={open ? 'demo-positioned-menu' : undefined}
                    aria-haspopup='true'
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                  />
                </Avatar>
                <Menu
                  id='demo-positioned-menu'
                  aria-labelledby='demo-positioned-button'
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                >
                  <MenuItem onClick={handleClose}>
                    <AppTooltip placement={'top'} title={'Reply All'}>
                      <ReplyAllOutlinedIcon sx={{color: '#85C1E9'}} />
                    </AppTooltip>
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <AppTooltip placement={'top'} title={'Reply'}>
                      <ReplyOutlinedIcon sx={{color: '#85C1E9'}} />
                    </AppTooltip>
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <AppTooltip placement={'top'} title={'Forward'}>
                      <ForwardOutlinedIcon sx={{color: '#85C1E9'}} />
                    </AppTooltip>
                  </MenuItem>
                </Menu> */}
              {ticketInfo?.status == "CLOSED" ? "" : <div>
                {ticketInfo?.pendingWith == user?.userList?.profileId && (
                  <Avatar
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      m: '0',
                      mr: 2,
                      height: 40,
                      width: 40,
                      border: '1px solid #85C1E9',
                      backgroundColor: 'white',
                    }}
                  >
                    <Tooltip title='Forward Ticket'>
                      <ChatOutlinedIcon
                        sx={{color: '#85C1E9', cursor: 'pointer'}}
                        onClick={() => {
                          setOpenComment(!openComment);
                        }}
                      />
                    </Tooltip>
                  </Avatar>
                )}
              </div>}
              </Box>
            }
          </Box>
          {/* -----------------------------------------Email paNEL--------------------------------------------------------------------------------------------------------- */}
          {openEmail && (
            <Box sx={{padding: '0px 10px'}}>
              <EmailBody
                ticketInfo={ticketInfo}
                close={() => {
                  setOpenEmail(false);
                }}
              />
            </Box>
          )}

          {/* -----------------------------------------Comment paNEL--------------------------------------------------------------------------------------------------------- */}
          {openComment && (
            <Box sx={{padding: '5px 10px'}}>
              <Comment
                ticketInfo={ticketInfo}
                close={() => {
                  setOpenComment(false);
                }}
              />
            </Box>
          )}

          {/* ---------------------------------------Tab Panel----------------------------------------------------------------- */}
          <Box sx={{width: '100%', typography: 'body1', marignTop: '-20px'}}>
            <TabContext value={value} sx={{marginTop: '-20px'}}>
              <Box sx={{borderColor: 'divider'}}>
                <TabList
                  onChange={handleChange}
                  aria-label='lab API tabs example'
                  size='small'
                  sx={{fontSize: '12px'}}
                >
                  <Tab
                    label={`${
                      Number(ticketInfo?.remarksHistory?.length + 1) || '1'
                    } Conversation`}
                    value='1'
                    sx={{fontSize: '12px', fontWeight: '900'}}
                  />
                  <Tab
                    label='Resolution'
                    value='2'
                    sx={{fontSize: '12px', fontWeight: '900'}}
                  />
                  <Tab
                    label='Attachement'
                    value='3'
                    sx={{fontSize: '12px', fontWeight: '900'}}
                  />
                  <Tab
                    label='History'
                    value='4'
                    sx={{fontSize: '12px', fontWeight: '900'}}
                  />
                </TabList>
              </Box>

              <TabPanel value='1'>
                <Conversation ticketInfo={ticketInfo} />
              </TabPanel>
              <TabPanel value='2'>
                <ResolutionCopy ticketInfo={ticketInfo} />
              </TabPanel>
              <TabPanel value='3'>
                <Attachement ticketInfo={ticketInfo} />
              </TabPanel>
              <TabPanel value='4'>
                <History ticketInfo={ticketInfo} />
              </TabPanel>
            </TabContext>
          </Box>

          {/* --------------------------------------Ticket Content---------------------------------------------------------------------- */}

          <Box
            sx={{
              // borderBottom: '1px solid rgba(224, 224, 224, 1)',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            {ticketInfo?.pendingWith === user?.userList?.profileId ? (
              ticketInfo?.status === 'CLOSED' ? (
                <Box
                  sx={{
                    background: '#e0251b',
                    width: '250px',
                    padding: '4px 10px',
                    alignItems: 'center',
                    display: 'flex',
                  }}
                >
                  <Button
                    style={{paddingLeft: '55px', color: 'white'}}
                    onClick={(e) => {
                      setReopen(true);
                    }}
                  >
                    Reopen Ticket
                  </Button>
                </Box>
              ) : (
                <Box
                  sx={{
                    background: '#D4E6F1',
                    width: '250px',
                    padding: '4px 10px',
                    alignItems: 'center',
                    display: 'flex',
                  }}
                >
                  <Button
                    style={{paddingLeft: '55px'}}
                    onClick={() => {
                      setClose(true);
                    }}
                  >
                    Close Ticket
                  </Button>
                </Box>
              )
            ) : (
              ''
            )}
          </Box>
          {/* <Box
            sx={{
              // borderBottom: '1px solid rgba(224, 224, 224, 1)',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            {ticketInfo?.pendingWith == user?.userList?.profileId && (
              <Box
                sx={{
                  background: '#D4E6F1',
                  width: '250px',
                  padding: '4px 10px',
                  alignItems: 'center',
                  display: 'flex',
                }}
              >
                <ThemeProvider theme={theme}>
                  <FormGroup>
                    <FormControlLabel
                      sx={{fontWeight: '1000'}}
                      control={
                        <Switch
                          defaultChecked={close}
                          onChange={(e) => {
                            setClose(e?.target?.checked);
                          }}
                          checkedColor='primary'
                        />
                      }
                      label='Close Ticket'
                    />
                  </FormGroup>
                </ThemeProvider>
                <FormGroup>
                  <FormControlLabel
                    sx={{color: '#2980B9', fontWeight: '1000'}}
                    control={
                      <Switch
                        color='secondary'
                        defaultChecked={close}
                        onChange={(e) => {
                          setClose(e?.target?.checked);
                        }}
                      />
                    }
                    label='Close Ticket conversation'
                  />
                </FormGroup>
              </Box>
            )}
          </Box> */}
        </Grid>
      </Grid>

      <Confirm
        open={close}
        header={'Confirm to Close the ticket'}
        cnfMsg={'Are you sure, You want to close the ticket?'}
        handleClose={closeConfirmBox}
      />
       <Confirm
        open={reopen}
        header={'Confirm to Reopen the ticket'}
        cnfMsg={'Are you sure, You want to reopen the ticket?'}
        handleClose={reopenConfirmBox}
      />
    </div>
  );
};

export default GeneralInfo_Copy;
