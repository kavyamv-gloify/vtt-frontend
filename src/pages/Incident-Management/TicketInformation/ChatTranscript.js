import React, {useState, useEffect} from 'react';
import Api from '@api';
import axios from 'axios';
import CustomLabel from 'pages/common/CustomLabel';
import {Grid} from '@mui/material';
import moment from 'moment';
const ChatTranscript = (props, ticketInfo) => {
  const [chatData, setChatData] = useState();
  const colors = [
    '#ffb703',
    '#fb8500',
    '#219ebc',
    '#8ecae6',
    '#f4c095',
    '#5f0f40',
    '#621940',
  ];
  useEffect(() => {
    axios
      .get(
        Api.baseUri + '/user-reg/trip-chat/getby/' + '64a2ef6ecf0c5b29364403a3',
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          setChatData(res?.data?.data);
        }
      })
      .catch((err) => {});
  }, []);
  return (
    <>
      <Grid container>
        {chatData?.map((el) => {
          return (
            <Grid container>
              <Grid item md={12} sx={{padding: '20px'}}>
                <div style={{display: 'flex'}}>
                  <div>
                    <img
                      style={{
                        width: '80px',
                        aspectRatio: '1 / 1',
                        borderRadius: '50%',
                        border: '1px solid',
                      }}
                      src={Api.imgUrl + el?.img}
                    />
                  </div>
                  <div
                    style={{
                      marginLeft: '30px',
                      padding: '20px',
                      border: '1px solid black',
                      borderRadius: '0px 30px 30px 30px',
                      // width: '600px',
                    }}
                  >
                    <p
                      style={{
                        marginBottom: '10px',
                        fontWeight: '800',
                        color: colors[Math.floor(Math.random() * 10)],
                      }}
                    >
                      {el?.postedBy}
                    </p>
                    <p style={{marginBottom: '10px'}}>{el?.msgText}</p>
                    <p style={{marginBottom: '10px', fontWeight: '800'}}>
                      {moment(el?.postedOn).format('DD-MM-YYYY hh:mm')}
                    </p>
                  </div>
                </div>
              </Grid>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export default ChatTranscript;
