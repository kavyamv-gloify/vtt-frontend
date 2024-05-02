import {Grid, Typography} from '@mui/material';
import React, {useEffect} from 'react';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import SummarizeIconOutlinedIcon from '@mui/icons-material/SummarizeOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import Slab from './Slab';
import Trip from './Trip';
import KM from './KM';
import Fixed from './Fixed';

const Create = () => {
  const [tabSelected, setTabSelected] = React.useState(0);
  useEffect(() => {
    let tabValuesto = localStorage.getItem('RateCard_Tab_value') ?? '0';
    // console.log('RateCard_Tab_value', tabValuesto);
    setTabSelected(tabValuesto);
    // console.log('tabValuesto', tabValuesto);
    localStorage.removeItem('RateCard_Tab_value');
  }, []);
  return (
    <div>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={12} sm={3} md={3} sx={{mb: 2}}>
          <Typography variant='h3' style={{display: 'flex'}} className='cursor'>
            <div
              onClick={() => {
                setTabSelected(0);
              }}
              style={{
                borderBottom: tabSelected == 0 ? '4px solid orange' : '',
                paddingBottom: '5px',
                paddingRight: '5px',
                marginRight: '15px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <SignalCellularAltIcon sx={{mr: 2}} /> <span>Slab</span>
            </div>
            <div
              onClick={() => {
                setTabSelected(1);
              }}
              style={{
                borderBottom: tabSelected == 1 ? '4px solid orange' : '',
                paddingBottom: '5px',
                paddingRight: '5px',
                marginRight: '15px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <SummarizeIconOutlinedIcon sx={{mr: 2}} /> <span>Trip</span>
            </div>
            <div
              onClick={() => {
                setTabSelected(2);
              }}
              style={{
                borderBottom: tabSelected == 2 ? '4px solid orange' : '',
                paddingBottom: '5px',
                paddingRight: '5px',
                marginRight: '15px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <FactCheckOutlinedIcon sx={{mr: 2}} /> <span>KM</span>
            </div>
            <div
              onClick={() => {
                setTabSelected(3);
              }}
              style={{
                borderBottom: tabSelected == 3 ? '4px solid orange' : '',
                paddingBottom: '5px',
                paddingRight: '5px',
                marginRight: '15px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <FactCheckOutlinedIcon sx={{mr: 2}} /> <span>Fixed</span>
            </div>
          </Typography>
          {/* <hr style={styles.hr} /> */}
        </Grid>
      </Grid>
      {tabSelected == 0 && <Slab />}
      {tabSelected == 1 && <Trip />}
      {tabSelected == 2 && <KM />}
      {tabSelected == 3 && <Fixed />}
    </div>
  );
};

export default Create;
