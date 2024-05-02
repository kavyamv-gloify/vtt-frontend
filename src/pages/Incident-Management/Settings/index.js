import React, {useState} from 'react';
import {Grid} from '@mui/material';
// import HQView from './HqView/index';
import Agents from './Agents';
import HQView from '../Tickets/HqView/index';
import Teams from './Team';
import TicketStatus from './TicketStatus';
import ChannelDefination from './ChannelDefination';
import AssignmentRules from './AssignmentRules';
import Permission from './Permission';
// import SLA from './SLA';
import SLACopy from './SLACopy';
const Settings = ({action, user}) => {
  const [value, setValue] = useState('Ticket_Status');
  const [activeGrid, setActiveGrid] = useState("Ticket_Status");
  const settingOption = [
    {
      title: 'Ticket Status',
      icon: '/assets/images/tickets.svg',
      value: 'Ticket_Status',
    },
    {
      title: 'Agents',
      icon: '/assets/images/agent-setting.svg',
      value: 'Agents',
    },
    {title: 'Teams', icon: '/assets/images/team-queue.svg', value: 'Team'},
    {
      title: 'Permissions',
      icon: '/assets/images/permissions.svg',
      value: 'Permissions',
    },
    {
      title: 'Channel Defination',
      icon: '/assets/images/channel-definition.svg',
      value: 'Channel_Defination',
    },
    {title: 'SLA', icon: '/assets/images/sla.svg', value: 'SLA'},
    {
      title: 'Assignment rules',
      icon: '/assets/images/assignment-rules.svg',
      value: 'Assignment_rules',
    },
  ];

  const onValues = () => {
    switch (value) {
      case 'Ticket_Status':
        return <TicketStatus />;
      case 'Agents':
        return <Agents />;
      case 'Team':
        return <Teams />;
      case 'Channel_Defination':
        return <ChannelDefination />;
      case 'Assignment_rules':
        return <AssignmentRules />;
      case 'SLA':
        return <SLACopy />;
      default:
        return <Permission />;
    }
  };
  return (
    <div>
      <Grid container sx={{background: 'white', border: '1px solid #f6f6f6'}}>
        <Grid item xs={12} sm={12} md={1.5} sx={{border: '2px solid #f1f1f1'}}>
          <Grid container>
            {settingOption?.map((el) => {
              if (
                user?.role == 'CORPORATEADMIN' ||
                user?.role == 'SUPERADMIN' ||
                (user?.role == 'AGENT-2' && action?.includes(el?.title))
              )
                return (
                  <Grid
                    item
                    md={12}
                    sm={4}
                    xs={4}
                    sx={{
                      border: '1px solid #f1f1f1',
                      // borderRadius: '10px',
                      display: 'flex',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      alignItems: 'center',
                      px: '10px',
                      py: '20px',
                      borderLeft:
                        activeGrid == el?.value
                          ? '6px solid #0e2433'
                          : '1px solid #f1f1f1',
                    }}
                    onClick={() => {
                      setValue(el?.value);
                      setActiveGrid(el?.value);
                    }}
                  >
                    <img
                      src={el?.icon}
                      style={{
                        width: '30px',
                        height: '20px',
                        marginBottom: '10px',
                      }}
                    />
                    <p>{el?.title}</p>
                  </Grid>
                );
            })}
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={10.5}
          sx={{
            border: '2px solid #f1f1f1',
            padding: '10px',
            border: '1px solid #f6f6f6',
          }}
        >
          {onValues()}
        </Grid>
      </Grid>
    </div>
  );
};

export default Settings;
