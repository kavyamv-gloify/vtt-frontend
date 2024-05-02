import React, {useState} from 'react';
import {Grid} from '@mui/material';
import HQView from './HqView/index';

import AgentQueue from './AgentQueue';
// import ViewTicket from './ViewTicket/index';
import TeamQueue from './TeamQueue';
import {OndemandVideoTwoTone} from '@mui/icons-material';
import MyQueue from './MyQueue';
const Ticket = ({action, user}) => {
  const [activeGrid, setActiveGrid] = useState('HQ');

  const [value, setValue] = useState("HQ");
  const ticketOption =
    user?.role == 'VENDOR'
      ? [
          {
            title: 'HQ',
            icon: '/assets/images/hq.svg',
          },
          // {
          //   title: 'Agent Queue',
          //   icon: '/assets/images/agent-queue.svg',
          // },
          // {
          //   title: 'Team Queue',
          //   icon: '/assets/images/team-queue.svg',
          // },
          // {
          //   title: 'View',
          //   icon: '/assets/images/team-queue.svg',
          // },
          {
            title: 'My Queue',
            icon: '/assets/images/team-queue.svg',
          },
        ]
      : [
          {
            title: 'HQ',
            icon: '/assets/images/hq.svg',
          },
          // {
          //   title: 'Agent Queue',
          //   icon: '/assets/images/agent-queue.svg',
          // },
          {
            title: 'Team Queue',
            icon: '/assets/images/team-queue.svg',
          },
          {
            title: 'View',
            icon: '/assets/images/team-queue.svg',
          },
          {
            title: 'My Queue',
            icon: '/assets/images/team-queue.svg',
          },
        ];
  const onValue = () => {
    switch (value) {
      case 'Team Queue':
        return <TeamQueue />;
      case 'View':
        return <AgentQueue />;
      case 'My Queue':
        return <MyQueue userId = {user?.userList?.corporateId}/>;

      default:
        return <HQView />;
    }
  };
  return (
    <div>
      <Grid container sx={{background: 'white', border: '1px solid #f6f6f6'}}>
        <Grid item xs={12} sm={12} md={1.5} sx={{border: '2px solid #f1f1f1'}}>
          <Grid container>
            {ticketOption?.map((el) => {
              if (
                user?.role == 'CORPORATEADMIN' ||
                user?.role == 'SUPERADMIN' ||
                user?.role == 'VENDOR' ||
                (user?.role == 'AGENT-2' )
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
                      justifyContent: 'space-between',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '20px',
                      borderLeft:
                        activeGrid == el?.title
                          ? '6px solid #0e2433'
                          : '1px solid #f1f1f1',
                    }}
                    onClick={() => {
                      setActiveGrid(el?.title);
                      setValue(el?.title);
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
          {/* <HQView /> */}
          {onValue()}
        </Grid>
      </Grid>
    </div>
  );
};

export default Ticket;
