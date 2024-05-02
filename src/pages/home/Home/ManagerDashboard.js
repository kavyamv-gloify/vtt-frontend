import * as React from 'react';
import {styled} from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import LinearWithValueLabel from '../LinearProgress';
import {Typography} from '@mui/material';
import Button from '@mui/material/Button';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SmsIcon from '@mui/icons-material/Sms';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import TicketContent from './Tickets';
import CampaignIcon from '@mui/icons-material/Campaign';
import HistoryIcon from '@mui/icons-material/History';
import MoreVertIcon from '@mui/icons-material/MoreVert';
// import AnnouncementContent from ';
import ServicesBox from '../Home/Common Component/Services/Services';
import Operations from './Operations/Operations';

// import Slider from './Slider';
import {height} from '@mui/system';
import {useNavigate} from 'react-router-dom';
import {useAuthUser} from '@crema/utility/AuthHooks';

const Pending = styled(Paper)(({theme}) => ({
  borderRadius: '20px',
  background: 'white',
}));

const Tickets = styled(Paper)(({theme}) => ({
  // padding: theme.spacing(1),
  // textAlign: "center",
  color: theme.palette.text.secondary,
  boxShadow: '0 8px 16px 0 rgb(0 0 0 / 25%)',
  borderRadius: '20px',
  background: 'white',
}));

export default function ManagerDisplay() {
  const navigate = useNavigate();
  const {user} = useAuthUser();

  React.useEffect(() => {
    if (user?.userList?.userStatus == 'DEFAULT') {
      navigate('/my-profile');
    }
  }, [user?.userList?.userStatus]);
  return (
    <>
      {/* <Slider /> */}

      <div style={{marignTop: '20vh'}}></div>

      <div>
        <Typography
          variant='h3'
          gutterBottom
          style={{fontWeight: 'bold', marginBottom: '12px', marginTop: '7vh'}}
        >
          Operations Summary
        </Typography>
        <hr
          style={{
            background: 'orange',
            color: 'orange',
            borderColor: 'orange',
            border: '2px solid orange',
            borderRadius: '5px',
            width: '38px',
          }}
        />
      </div>
      <Operations />

      {/* <div style={{ marginTop: "10vh" }}>
        <Typography variant="h3" gutterBottom style={{ fontWeight: "bold", marginBottom: "12px" }}>
          Services
        </Typography>
        <hr
          style={{
            background: 'orange',
            color: 'orange',
            borderColor: 'orange',
            border: "2px solid orange",
            borderRadius: "5px",
            width: "38px",

          }}
        />
      </div>

      <ServicesBox/> */}

      <Box sx={{width: '100%', marginTop: '4vh'}}>
        <Grid container rowSpacing={3} columnSpacing={{xs: 3}}>
          <Grid item xs={7}>
            <Tickets style={{padding: '4vh'}}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Typography
                  variant='h3'
                  gutterBottom
                  style={{
                    fontWeight: 'bold',
                    marginBottom: '12px',
                    color: 'black',
                  }}
                >
                  Tickets
                </Typography>
                <div style={{display: 'flex', marginRight: '1vh'}}>
                  <h3>2019</h3>
                  <h3 style={{marginLeft: '5vh'}}>June</h3>
                </div>
              </div>
              {/* -------------------------------------------Tickets Content------------------------------------------------------------------ */}
              <TicketContent />
              <TicketContent />
              <TicketContent />
              <TicketContent />
              <TicketContent />
              <TicketContent />
            </Tickets>
          </Grid>

          <Grid item xs={5}>
            {/* <Item> */}
            <Box sx={{width: '100%'}}>
              <Grid container rowSpacing={2} columnSpacing={{xs: 2}}>
                <Grid item xs={12}>
                  <Pending>
                    <hr
                      style={{
                        background: 'orange',
                        color: 'orange',
                        borderColor: 'orange',
                        border: '2px solid orange',
                        borderRadius: '20px 20px 0px 0px',
                        height: '12px',
                      }}
                    />
                    <div
                      style={{
                        padding: '2vh',
                        display: 'flex',
                        flexDirection: 'row',
                      }}
                    >
                      <CampaignIcon
                        style={{marginLeft: '2vh', color: 'orange'}}
                      />
                      <Typography
                        variant='h3'
                        gutterBottom
                        style={{
                          fontWeight: 'bold',
                          color: 'black',
                          marginLeft: '3vh',
                          marginTop: '0.5vh',
                        }}
                      >
                        Announcement
                      </Typography>
                    </div>
                  </Pending>
                </Grid>

                <Grid item xs={12} style={{widht: '100%'}}>
                  <Pending style={{marginTop: '0.8vh', position: 'relative'}}>
                    <div
                      style={{
                        padding: '2vh',
                        display: 'flex',
                        flexDirection: 'row',
                        wordBreak: 'break-word',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <HistoryIcon
                        style={{marginLeft: '2vh', color: 'black'}}
                      />
                      <Typography
                        variant='h3'
                        gutterBottom
                        style={{
                          fontWeight: 'bold',
                          color: 'black',
                          marginLeft: '3vh',
                          marginTop: '0.5vh',
                        }}
                      >
                        Pending Requests
                      </Typography>
                      <MoreVertIcon
                        style={{marginLeft: '50vh', position: 'absolute'}}
                      />
                    </div>
                    {/* <AnnouncementContent />
                    <AnnouncementContent />
                    <AnnouncementContent />
                    <AnnouncementContent /> */}
                  </Pending>
                </Grid>
              </Grid>
            </Box>
            {/* </Item> */}
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
