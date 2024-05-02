import * as React from 'react';
// import Box from "@mui/material/Box";
import {TextField} from '@mui/material';

import {useState, useEffect} from 'react';
import {FormControl} from '@mui/material';

export default function Registrationbox() {
  const [otp, setOTP] = useState({first: '', sec: '', third: '', fourth: ''});
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [otpvalid, setotpvaild] = useState('');
  const [clicked, setclicked] = useState(false);

  const handleSubmit = (e) => {
    setclicked(true);
    e.preventDefault();
    if (otpvalid === '') {
      setotpvaild('otp required');
    } else {
      let tempotp =
        otp.first.toString() +
        otp.sec.toString() +
        otp.third.toString() +
        otp.fourth.toString();
    }
  };

  return (
    <>
      <div className='forgot-wrapper'>
        {forgotSuccess ? (
          <h4
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '300px',
            }}
          >
            Please enter OTP
          </h4>
        ) : (
          <div className='ps-order-tracking'>
            <div className='container'>
              <div className='ps-section__content'>
                <FormControl className='ps-form--account'>
                  <div className='form-group' style={{flexDirection: 'row'}}>
                    <div style={{display: 'flex'}}>
                      <TextField
                        style={{width: '8rem'}}
                        autoFocus
                        className='form-control'
                        name='otp1'
                        id='otp1'
                        value={otp?.first}
                        onChange={(e) => {
                          if (e?.target?.value?.length < 5) {
                            setOTP({...otp, first: e?.target?.value});
                            if (e?.target?.value?.length == 4)
                              document.getElementById('otp2').focus();
                          }
                        }}
                      />
                      <TextField
                        style={{width: '8rem', borderRadius: '0px'}}
                        className='form-control'
                        name='otp2'
                        id='otp2'
                        value={otp.sec}
                        onChange={(e) => {
                          if (e?.target?.value?.length < 5) {
                            setOTP({...otp, sec: e?.target?.value});
                            if (e?.target?.value?.length == 4)
                              document.getElementById('otp3').focus();
                          }
                        }}
                      />

                      <TextField
                        style={{width: '8rem', whiteSpace: 'pre'}}
                        className='form-control'
                        name='otp3'
                        id='otp3'
                        value={otp?.third}
                        onChange={(e) => {
                          if (e?.target?.value?.length < 5) {
                            setOTP({...otp, third: e?.target?.value});
                            if (e?.target?.value?.length == 4)
                              document.getElementById('otp4').focus();
                          }
                        }}
                      />
                      <TextField
                        style={{width: '8rem'}}
                        className='form-control'
                        name='otp4'
                        id='otp4'
                        value={otp?.fourth}
                        onChange={(e) => {
                          if (e?.target?.value?.length <= 4)
                            setOTP({...otp, fourth: e?.target?.value});
                        }}
                      />
                    </div>
                  </div>
                  <span style={{color: 'red'}}>
                    {clicked &&
                    (otp?.first?.length != 4 ||
                      otp?.sec?.length != 4 ||
                      otp?.third?.length != 4 ||
                      otp?.fourth?.length != 4)
                      ? 'Please enter valid OTP.'
                      : null}
                  </span>
                  <br />
                </FormControl>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
