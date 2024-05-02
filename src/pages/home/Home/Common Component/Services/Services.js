import React from 'react';
import Box from '@mui/material/Box';
import {Button} from '@mui/material';
import {Grid} from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox';
import {styled} from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import styles from './services.module.css';
import CustomLabel from 'pages/common/CustomLabel';

const ServicesBox = () => {
  const Service = styled(Paper)(({theme}) => ({
    borderRadius: '20px',
    background: 'white',
  }));

  return (
    <>
      <div style={{marginTop: '45px'}}>
        <CustomLabel labelVal='Services' variantVal='h3-underline' />
      </div>

      <div class={styles.header} style={{marginTop: '3em'}}>
        <div class={styles.item}>
          <div style={{padding: '1rem'}}>
            <img src='/assets/images/Clock.png' alt='P' />
          </div>
          <div>
            <Button
              id='btnMui123'
              variant='contained'
              className={styles.button1}
              style={{
                background: 'orange',
                width: '100%',
                borderRadius: '0px 0px 15px 15px',
                height: '4em',
              }}
            >
              <AddBoxIcon />
              Adhoc Trip
            </Button>
          </div>
        </div>

        <div class={styles.item}>
          <div style={{padding: '1rem'}}>
            <img src='/assets/images/Clock.png' alt='P' />
          </div>
          <div>
            <Button
              id='btnMui123'
              variant='contained'
              className={styles.button2}
              style={{
                background: '#1f456e',
                width: '100%',
                borderRadius: '0px 0px 15px 15px',
                height: '4em',
              }}
            >
              <AddBoxIcon />
              Car Rental
            </Button>
          </div>
        </div>

        <div class={styles.item}>
          <div>
            <img
              src='/assets/images/school_transport.jpg'
              style={{marginTop: '1em'}}
              alt='P'
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default ServicesBox;
