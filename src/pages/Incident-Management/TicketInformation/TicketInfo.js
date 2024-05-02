import React, {useState, useEffect} from 'react';
import CardView from '../Tickets/CardView';
import {Avatar, Grid} from '@mui/material';
// import GeneralInformation from './GeneralInformation';
import Description from './Description/index';
import Complaince from './Compliance';
import SelfConsent from './SelfConsent';
import ChatTranscript from './ChatTranscript';
import Api from '@api';
import axios from 'axios';
import {OndemandVideoTwoTone} from '@mui/icons-material';
import {useParams} from 'react-router-dom';
import GeneralInfo_Copy from './GeneralInfo_Copy';
import AppTooltip from '@crema/core/AppTooltip';
import KnowledgeBase from './KnowledgeBase';
const TicketInfo = () => {
  const [activeGrid, setActiveGrid] = useState('HQ');
  const [value, setValue] = useState('GeneralInformation');
  const [tripInfo, setTripInfo] = useState();
  const [ticketInfo, setTicketInfo] = useState();
  const {id} = useParams();
  const ticketOption =
    ticketInfo?.tripId === '' || ticketInfo?.tripId === null
      ? [
          {
            title: 'GeneralInformation',
            icon: '/assets/images/manage-super-admin.svg',
            color: '#AED6F1',
          },
          {
            title: 'Knowledge Base',
            icon: '/assets/images/general-information.svg',
            color: '#F7DC6F',
          },
        ]
      : [
          {
            title: 'GeneralInformation',
            icon: '/assets/images/manage-super-admin.svg',
            color: '#AED6F1',
          },
          {
            title: 'Knowledge Base',
            icon: '/assets/images/general-information.svg',
            color: '#F7DC6F',
          },
          {
            title: 'Trip Information',
            icon: '/assets/images/Routes.svg',
            color: '#E6B0AA',
          },
          {
            title: 'Self Consent',
            icon: '/assets/images/team-queue.svg',
            color: '#ABEBC6',
          },
          {
            title: 'Compliance',
            icon: '/assets/images/Compliances.svg',
            color: '#F7DC6F',
          },
          {
            title: 'Chat Transcript',
            icon: '/assets/images/chat-transcript.svg',
            color: '#EDBB99',
          },
          {
            title: 'IVR & SMS',
            icon: '/assets/images/IVR.svg',
            color: '#AED6F1',
          },
        ];
  const onValue = () => {
    switch (value) {
      case 'GeneralInformation':
        return <GeneralInfo_Copy ticketInfo={ticketInfo} tripInfo={tripInfo} />;
      case 'Trip Information':
        return <Description ticketInfo={ticketInfo} tripInfo={tripInfo} />;
      case 'Self Consent':
        return <SelfConsent ticketInfo={ticketInfo} />;
      case 'Compliance':
        return <Complaince tripInfo={tripInfo} ticketInfo={ticketInfo} />;
      case 'Knowledge Base':
        return <KnowledgeBase ticketInfo={ticketInfo} />;
      default:
        return <ChatTranscript ticketInfo={ticketInfo} />;
    }
  };
  useEffect(() => {
    axios
      .get(
        Api.baseUri +
          '/user-reg/incident-management/get-incident-management-by-id/' +
          id,
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          setTicketInfo(res?.data?.data);
          axios
            .get(
              Api.baseUri +
                '/user-reg/trip-route/get-trip-by-id/' +
                res?.data?.data?.tripId,
            )
            .then((resp) => {
              if (resp?.data?.status == '200') {
                setTripInfo(resp?.data?.data);
              }
            })
            .catch((err) => {});
        }
      })
      .catch((err) => {});
  }, [id]);
  return (
    <div>
      <Grid item md={9}>
        <Grid container spacing={2}>
          <Grid item md={0.5} sm={12} xs={12}>
            {ticketOption?.map((el) => {
              return (
                <Grid
                  item
                  md={12}
                  sm={4}
                  xs={4}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '20px',
                    borderLeft:
                      activeGrid == el?.title ? '4px solid #0e2433' : '',
                  }}
                  onClick={() => {
                    setActiveGrid(el?.title);
                    setValue(el?.title);
                  }}
                >
                  <AppTooltip placement={'top'} title={el?.title}>
                    <Avatar
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        m: '0',
                        mr: 2,
                        ml: 2,
                        height: 40,
                        width: 40,
                        borderTop: '1px solid #D7DBDD',
                        borderBottom: '1px solid #D7DBDD',
                        backgroundColor: el?.color,
                        color: '#A6ACAF',
                      }}
                    >
                      <img
                        src={el?.icon}
                        style={{
                          width: '25px',
                          height: '25px',
                        }}
                      />
                    </Avatar>
                  </AppTooltip>
                </Grid>
              );
            })}
          </Grid>
          <Grid item md={11.5}>
            {onValue()} {/* <CardView title={'Open'} bgColor={'#E6B0AA'} /> */}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default TicketInfo;
