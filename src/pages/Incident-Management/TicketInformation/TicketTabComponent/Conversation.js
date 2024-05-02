import React, {useState, useEffect} from 'react';
import parse from 'html-react-parser';
import {Button, Grid, Box, Avatar} from '@mui/material';
import moment from 'moment';
const Conversation = ({ticketInfo}) => {
  const [mail, setEmail] = React.useState();
  const [openMsg, setOpenMsg] = useState(false);
  return (
    <div>
      <Grid container>
        {ticketInfo?.remarksHistory?.map((el) => {
          return (
            <Grid
              item
              md={12}
              sx={{borderBottom: '1px solid #D7DBDD'}}
              onClick={() => {
                console.log('shreya');
                setOpenMsg(!openMsg);
              }}
            >
              <Box sx={{padding: '10px', background: 'white'}}>
                <Box sx={{display: 'flex'}}>
                  <Avatar
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      m: '0',
                      //   mr: 2,
                      height: 40,
                      width: 40,
                      border: '1px solid #D7DBDD',
                      // borderBottom: '1px solid #D7DBDD',
                      backgroundColor: 'white',
                      color: '#A6ACAF',
                    }}
                  >
                    {el?.remarksGivenByName?.split(' ')?.[0]?.slice(0, 1) +
                      el?.remarksGivenByName?.split(' ')?.[1]?.slice(0, 1)}
                  </Avatar>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      marginLeft: '10px',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        marginBottom: '10px',
                        alignItems: 'center',
                      }}
                    >
                      <Box
                        component='h5'
                        sx={{
                          fontWeight: 600,
                          fontSize: 15,
                          textAlign: 'left',
                          lineHeight: 1,
                        }}
                      >
                        {el?.remarksGivenByName}
                      </Box>
                      <Box
                        component='h5'
                        sx={{
                          fontWeight: 600,
                          fontSize: 12,
                          textAlign: 'left',
                          marginLeft: '10px',
                          lineHeight: 1,
                          color: '#CACFD2',
                        }}
                      >
                        {moment(el?.createdOn).format('lll')}
                      </Box>
                    </Box>
                    {openMsg == false && el?.remarks?.slice(0, 60) + '...'}
                    {openMsg == true && el?.remarks}
                  </Box>
                </Box>
              </Box>
            </Grid>
          );
        })}

        <Grid item md={12} sx={{height: '350px', overflowY: 'auto'}}>
          <Box sx={{padding: '10px', background: 'white'}}>
            <Box sx={{display: 'flex'}}>
              <Avatar
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  m: '0',
                  //   mr: 2,
                  height: 40,
                  width: 40,
                  border: '1px solid #D7DBDD',
                  // borderBottom: '1px solid #D7DBDD',
                  backgroundColor: 'white',
                  color: '#A6ACAF',
                }}
              >
                {/* {'SS'} */}
                {ticketInfo?.ticketForName?.split(' ')?.[0]?.slice(0, 1) +
                  ticketInfo?.ticketForName?.split(' ')?.[1]?.slice(0, 1)}
              </Avatar>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginLeft: '10px',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    marginBottom: '10px',
                    alignItems: 'center',
                  }}
                >
                  <Box
                    component='h5'
                    sx={{
                      fontWeight: 600,
                      fontSize: 15,
                      textAlign: 'left',
                      lineHeight: 1,
                    }}
                  >
                    {ticketInfo?.ticketForName}
                  </Box>
                  <Box
                    component='h5'
                    sx={{
                      fontWeight: 600,
                      fontSize: 12,
                      textAlign: 'left',
                      marginLeft: '10px',
                      lineHeight: 1,
                      color: '#CACFD2',
                    }}
                  >
                    {moment(ticketInfo?.createdOn).format('lll')}
                  </Box>
                </Box>
                {parse(ticketInfo?.message?.length ? ticketInfo?.message : ' ')}
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default Conversation;
