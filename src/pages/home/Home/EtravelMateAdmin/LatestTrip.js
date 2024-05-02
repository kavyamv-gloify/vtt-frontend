import React from 'react';
import TopDoctors from '../../../dashboards/HealthCare/TopDoctors';
import {Grid} from '@mui/material';
const LatestTrip = ({data}) => {
  // const data = [
  //   { profile_pic: "/assets/images/image 11.png", name: "UP4543145", speciality: "ACTIVE", scheduled: "Schedule" },
  //   { profile_pic: "/assets/images/image 11.png", name: "UP4543145", speciality: "ACTIVE", scheduled: "Remove" }
  // ]

  return (
    <div>
      <Grid container spacing={2} sx={{marginTop: '20px'}}>
        <Grid item xs={12} md={12} sm={12}>
          <TopDoctors data={data} title={'Latest Trip'} />
        </Grid>
      </Grid>
    </div>
  );
};

export default LatestTrip;
