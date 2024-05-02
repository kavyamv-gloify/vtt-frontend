import React, { useEffect, useState } from 'react'
import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TicketGraph from './TicketGraph';
import LiveTraffic from './LiveTraffic';
import TicketRating from './TicketRating';
import TicketCount from './TicketCount';
import OnlineAgent from './OnlineAgent';
import OfflineAgent from './OfflineAgent';
import MostThreadedTickets from './MostThreadedTickets';
import Api from '@api';
import axios from 'axios';
const HQView = () => {
  const [ticketCount, setTicketCount] = useState([]);

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    border: "1px solid #f1f1f1",
    background: "white"
  }));

  useEffect(()=>{
    getAllList();
},[])

function getAllList() {
    axios
      .get(
        Api.baseUri +
          '/user-reg/incident-management/getIncidentData',
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          setTicketCount(res?.data?.data ?? []);
        }
      })
      .catch((err) => {
        console("error", err)
      });
  }

  console.log("ticketCount", ticketCount)

  return (
    <div>
      <Grid container spacing={8} sx={{padding:"10px"}}>
        <Grid item md={12} sm={12} xs={12}>
          <Grid container spacing={2}>
            <Grid item md={8} sm={12} xs={12}>
              <Item style={{ height: "500px" }}>
                <TicketGraph />
              </Item>
            </Grid>
            <Grid item md={4} sm={12} xs={12}>
              <Item style={{ height: "500px" }}>
                <LiveTraffic />
              </Item>
            </Grid>
          </Grid>
        </Grid>

        <Grid item md={12} sm={12} xs={12}>
          <Grid container spacing={2}>
            <Grid item md={8} sm={12} xs={12}>
              <Item >
                <TicketCount
                  totalCount = {ticketCount?.pendingMap}
                />
              </Item>
            </Grid>
            <Grid item md={4} sm={12} xs={12}>
              <Item style={{ height: "130px" }}>
                <TicketRating/>
              </Item>
            </Grid>
          </Grid>
        </Grid>

        <Grid item md={12}>
          <Grid container spacing={2}>
            <Grid item md={4} sm={12} xs={12}>
              <Item>
                <OnlineAgent
                  agentCount ={ticketCount?.activeAgent || []}
                />
              </Item>
            </Grid>
            <Grid item md={4} sm={12} xs={12}>
              <Item>
                <OfflineAgent
                  agentCount ={ticketCount?.inActiveAgent || []}
                />
              </Item>
            </Grid>
            <Grid item md={4} sm={12} xs={12}>
              <Item>
                <MostThreadedTickets/>
              </Item>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default HQView