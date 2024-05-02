import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {Button} from '@mui/material';
import AddCardIcon from '@mui/icons-material/AddCard';
import SettingsIcon from '@mui/icons-material/Settings';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import DialogTitle from '@mui/material/DialogTitle';
import CreateTicket from './CreateTicket/index';
import Settings from './Settings/index';
import Ticket from './Tickets/index';
import EmployeeTab from './EmployeeTab/EmployeeTab';
import Api from '@api';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import axios from 'axios';
import KnowledgeBase from './KnowledgeBase';
import {useAuthUser} from '@crema/utility/AuthHooks';
import Reports from './Report';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
const IncidentManagement = () => {
  const [value, setValue] = useState('');
  const [values, setValues] = useState('1');
  const [rightValue, setrightValue] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [action, setAction] = useState();
  const {user} = useAuthUser();
  // console.log('user', user);
  const handleChange = (event, newValue) => {
    setValue(newValue);
    setrightValue(' ');
  };
  const handleChangeSide = (event, newValue) => {
    setValue(' ');
    setrightValue(newValue);
  };
  function handleChanges(n, e) {
    // console.log('n', e);
    setValues(e);
  }
  useEffect(() => {
    setValue(0);
  }, []);

  useEffect(() => {
    axios
      .get(
        Api.baseUri +
          `/user-reg/incidentTeam/getAllByCorporateId/${user?.userList?.corporateId}`,
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          console.log('res', res);
          res?.data?.data?.[0]?.teamMembers?.map((el) => {
            if (el == user?.userList?.profileId) {
              setAction(res?.data?.data?.[0]?.permissions);
            }
          });
        }
      });
  }, [user?.userList?.corporateId]);

  function getOnValue() {
    switch (values) {
      case '2':
        return <Reports user={user} />;
      case '3':
        return <EmployeeTab user={user} />;
      case '4':
        return <Settings action={action} user={user} />;
      case '5':
        return <KnowledgeBase user={user} />;
      default:
        return <Ticket action={action} user={user} />;
    }
  }

  return (
    <>
      <TabContext value={values}>
        <Box
          sx={{
            borderColor: 'divider',
            display: 'flex',
            // bgcolor: 'white',
            padding: '0px',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <TabList
            onChange={handleChanges}
            TabIndicatorProps={{
              style: {background: 'orange'},
            }}
            aria-label='lab API tabs example'
          >
            {(user?.role == 'CORPORATEADMIN' ||
              user?.role == 'VENDOR' ||
              // user?.role == 'VENDOR' ||
              (user?.role == 'AGENT-2')) && (
              <Tab
                label='Tickets'
                value='1'
                sx={{
                  color: 'black',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                icon={
                  <img
                    src='/assets/images/tickets.svg'
                    style={{width: '16px', height: '16px', marginRight: '5px'}}
                  />
                }
              />
            )}
            {(user?.role == 'CORPORATEADMIN' ||
              user?.role == 'SUPERADMIN' ||
              (user?.role == 'AGENT-2' )) && (
              <Tab
                label='Reports'
                value='2'
                sx={{
                  color: 'black',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                icon={
                  <img
                    src={'/assets/images/mis.svg'}
                    style={{width: '16px', height: '16px', marginRight: '5px'}}
                  />
                }
              />
            )}
             {(user?.role == 'CORPORATEADMIN' ||
              user?.role == 'SUPERADMIN' ||
              (user?.role == 'AGENT-2' )) && (
            <Tab
              label='Employees'
              value='3'
              sx={{
                color: 'black',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
              icon={
                <PeopleOutlineIcon
                  sx={{width: '22px', height: '22px', marginRight: '5px'}}
                />
                // <img
                //   src={'/assets/images/employee.svg'}
                //   style={{width: '20px', height: '20px', marginRight: '5px'}}
                //   onClick={() => {
                //     setOpen(true);
                //   }}
                // />
              }
            /> )}
             {(user?.role == 'CORPORATEADMIN' ||
              user?.role == 'SUPERADMIN' ||
              (user?.role == 'AGENT-2' )) && (
            <Tab
              icon={
                <img
                  src={'/assets/images/general-information.svg'}
                  style={{width: '20px', height: '20px', marginRight: '5px'}}
                  onClick={() => {
                    setOpen(true);
                  }}
                />
              }
              label='Knowledge Base'
              value='5'
              sx={{
                color: 'black',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            />)}
            
          </TabList>
          <TabList
            onChange={handleChanges}
            TabIndicatorProps={{
              style: {background: 'orange'},
            }}
            aria-label='lab API tabs example'
          >
            {(user?.role == 'CORPORATEADMIN' ||
              user?.role == 'SUPERADMIN' ||
              (user?.role == 'AGENT-2')) && (
              <Tab
                // icon={<AddCardIcon />}
                sx={{color: 'black'}}
                iconPosition='start'
                label='Create Ticket'
                onClick={() => {
                  // setValues(values);
                  setOpenForm(true);
                }}
              />
            )}
            {(user?.role == 'CORPORATEADMIN' ||
              user?.role == 'SUPERADMIN' ||
              (user?.role == 'AGENT-2')) && (
              <Tab
                // icon={<SettingsIcon />}
                sx={{color: 'black'}}
                iconPosition='start'
                label='Settings'
                value='4'
              />
            )}
          </TabList>
        </Box>
      </TabContext>

      <div>{getOnValue()}</div>

      <Dialog
        open={openForm}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '800px',
          },
        }}
        style={{borderRadius: '4rem'}}
      >
        <div>
          <DialogTitle
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              background: '#f5f2f2',
              height: '4rem',
              paddingRight: '20px',
              paddingLeft: '20px',
              width: '800px',
              position: 'fixed',
              zIndex: '9',
              borderRadius: '5px 5px 0px 0px',
            }}
          >
            <h1>Create Ticket</h1>
            <CloseIcon
              onClick={() => {
                setOpenForm(false);
              }}
              style={{color: '#4f4f4f', fontWeight: 'bold'}}
            />
          </DialogTitle>
          <DialogContent
            style={{padding: '0px 20px 0px 20px', marginTop: '80px'}}
          >
            <div style={{padding: '1rem'}}>
              <CreateTicket
                close={() => {
                  setOpenForm(false);
                }}
              />
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </>
  );
};

export default IncidentManagement;
