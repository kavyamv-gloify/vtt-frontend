import React, { useState } from 'react';
import { Grid } from '@mui/material';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
const TicketRating = () => {
  const [value, setValue] = useState();
  const onValue = () => {
    switch (value) {
      case '1':
        '1';
        return (
          <SentimentVeryDissatisfiedIcon
            style={{ color: 'red', fontSize: '50px' }}
          />
        );

      case '2':
        '2';
        return <SentimentDissatisfiedIcon sx={{ color: 'red' }} />;

      case '3':
        '3';
        return <SentimentSatisfiedIcon sx={{ color: 'orange' }} />;
      case '4':
        '4';
        return <SentimentSatisfiedAltIcon sx={{ color: 'green' }} />;

      default:
        return (
          <SentimentVerySatisfiedIcon sx={{ color: 'green', fontSize: '50px' }} />
        );
    }
  };
  return (
    <Grid container>
      <Grid item md={12} sx={12} sm={12}>
        <Grid container>
          <Grid item md={12} sm={12} xs={12} sx={{ display: "flex", justifyContent: "space-between", padding: "10px" }}>
            <div>
              <p style={{ fontWeight: "600", color: "#55555" }}>Customer Happiness</p>
            </div>
          </Grid>
        </Grid>
        <hr style={{ border: '1px solid #f1f1f1' }} />
        <Grid container>
          <Grid item md={12} sm={12} xs={12} sx={{ display: "flex", flexDirection: "row", alignItems:"center", justifyContent:"space-between", paddingRight:"100px", paddingLeft:"100px", paddingTop:"10px", paddingBottom:"10px" }}>
            {onValue()}
            <p style={{ fontWeight: "600", color: "green", fontSize:"22px" }}>4.5</p>
            <p style={{ fontWeight: "500", color: "#55555" }}>Good</p>
          </Grid>
        </Grid>

      </Grid>
    </Grid>

  )
}

export default TicketRating