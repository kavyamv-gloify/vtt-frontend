import React, {useEffect, useState} from 'react';
import {Avatar, Box, Grid} from '@mui/material';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import ReplyOutlinedIcon from '@mui/icons-material/ReplyOutlined';
import MarkEmailUnreadOutlinedIcon from '@mui/icons-material/MarkEmailUnreadOutlined';
import PhoneIcon from '@mui/icons-material/Phone';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import History from './TicketTabComponent/History';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Resolution from './TicketTabComponent/Resolution';
import Comment from './TicketTabComponent/Comment';
import Conversation from './TicketTabComponent/Conversation';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ForwardOutlinedIcon from '@mui/icons-material/ForwardOutlined';
import ReplyAllOutlinedIcon from '@mui/icons-material/ReplyAllOutlined';
import AppTooltip from '@crema/core/AppTooltip';
import Select from '@mui/material/Select';
import moment from 'moment';
import {useAuthUser} from '@crema/utility/AuthHooks';
import EmailBody from './TicketTabComponent/EmailBody';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AppSearchBar from '@crema/core/AppSearchBar';
import axios from 'axios';
import Api from '@api';

const KnowledgeBase = ({ticketInfo, tripInfo}) => {
  const [value, setValue] = React.useState('1');
  const [openComment, setOpenComment] = useState(false);
  const [openEmail, setOpenEmail] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [copyContent, setCopyContent] = useState();
  const [keywords, setKeywords] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState();
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setDebouncedSearchTerm(keywords);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [keywords]);
  useEffect(() => {
    if (debouncedSearchTerm) {
      searchApi();
    }
  }, [debouncedSearchTerm]);

  const searchApi = async () => {
    const apiUrl =
      Api.baseUri + '/user-reg/searchKnowledgeBase/' + debouncedSearchTerm;

    try {
      const response = await axios.get(apiUrl);
      const data = response.data;
      console.log('data', data);
    } catch (error) {}
  };

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    // setOpenEmail(true);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setOpenEmail(true);
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const {user} = useAuthUser();
  console.log('ticketInfo', ticketInfo);
  console.log('ticketInfo', tripInfo);
  return (
    <div>
      <Grid container>
        <Grid md={3} sx={{border: '1px solid rgba(224, 224, 224, 1)'}}>
          <Box
            component='h3'
            sx={{
              fontWeight: 600,
              fontSize: 16,
              textAlign: 'left',
              lineHeight: 1,
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '5px',
            }}
          >
            {'Suggested Articles'}
          </Box>
          <Box></Box>
          <AppSearchBar
            // sx={{
            //   marginRight: 0,
            //   width: '100%',
            //   '& .searchRoot': {
            //     width: '100%',
            //   },
            //   '& .MuiInputBase-input': {
            //     width: '100%',
            //     '&:focus': {
            //       width: '100%',
            //     },
            //   },
            // }}
            // iconPosition='right'
            overlap={false}
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder={'Search...'}
          />
          <Box sx={{padding: '10px'}}>
            <div>
              <Box
                sx={{
                  padding: '10px',
                  border: '1px solid rgba(224, 224, 224, 1)',
                  borderRadius: '8px',
                }}
              >
                <Box
                  sx={{
                    fontWeight: 600,
                    fontSize: 16,
                    textAlign: 'left',
                    lineHeight: 1,
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '5px',
                  }}
                >
                  {'Answering Your first Ticket'}
                </Box>
                <Box>
                  {
                    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a"
                  }
                </Box>
                <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                  <ContentCopyIcon
                    sx={{
                      fontSize: 'small',
                      color: '#797D7F',
                      fontWeight: '900',
                    }}
                    onClick={() => {
                      setCopyContent(
                        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a",
                      );
                      setOpenComment(true);
                    }}
                  />
                </Box>
              </Box>
            </div>
          </Box>
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
                  {'#' + ticketInfo?.ticketCode}
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
              </Avatar> */}
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
              </Menu>

              {
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
                  <ChatOutlinedIcon
                    sx={{color: '#85C1E9'}}
                    onClick={() => {
                      setOpenComment(!openComment);
                    }}
                  />
                </Avatar>
              }
            </Box>
          </Box>
          {/* -----------------------------------------Email paNEL--------------------------------------------------------------------------------------------------------- */}
          {openEmail && (
            <Box sx={{padding: '0px 10px'}}>
              <EmailBody
                ticketInfo={ticketInfo}
                copyContent={copyContent}
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
                copyContent={copyContent}
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
                <Resolution ticketInfo={ticketInfo} />
              </TabPanel>
              <TabPanel value='3'>Item Three</TabPanel>
              <TabPanel value='4'>
                <History />
              </TabPanel>
            </TabContext>
          </Box>

          {/* --------------------------------------Ticket Content---------------------------------------------------------------------- */}

          {/* <Box
            sx={{
              // borderBottom: '1px solid rgba(224, 224, 224, 1)',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <Box
              sx={{
                background: '#D4E6F1',
                width: '250px',
                padding: '4px 10px',
                alignItems: 'center',
                display: 'flex',
              }}
            >
              <FormGroup>
                <FormControlLabel
                  sx={{color: '#2980B9', fontWeight: '1000'}}
                  control={
                    <Switch
                      color='secondary'
                      onChange={(e) => {
                        console.log(e);
                      }}
                    />
                  }
                  label='Close Ticket'
                />
              </FormGroup>
            </Box>
          </Box> */}
          <Box
            sx={{
              // borderBottom: '1px solid rgba(224, 224, 224, 1)',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            {ticketInfo?.status === 'CLOSED' ? (
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
                    setClose(false);
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
            )}
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default KnowledgeBase;
