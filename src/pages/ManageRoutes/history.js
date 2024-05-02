import {Box, Grid, Step, StepLabel, Stepper} from '@mui/material';
import React from 'react';
import CustomLabel from 'pages/common/CustomLabel';
import AppTooltip from '@crema/core/AppTooltip';
import moment from 'moment';
import AppLoader from '@crema/core/AppLoader';
const History = ({data}) => {
  return (
    <div>
      {!data && <AppLoader />}
      {data && !data?.length && (
        <div
          style={{display: 'flex', justifyContent: 'center', padding: '40px'}}
        >
          No History Available
        </div>
      )}
      {!!data?.length && (
        <Box sx={{width: '100%', mt: 6}}>
          <Grid
            container
            spacing={2}
            style={{
              paddingLeft: '33px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              marginBottom: '5px',
              fontWeight: 600,
            }}
          >
            <Grid item sm={6} md={4} style={{textAlign: 'left'}}>
              Date
            </Grid>
            <Grid item sm={6} md={8} sx={{textAlign: 'left'}}>
              Action
            </Grid>
            {/* <Grid item sm={6} md={2} sx={{textAlign: 'left'}}>
            Action by
          </Grid> */}
          </Grid>
          <Stepper activeStep={data?.length} orientation='vertical'>
            {data?.map((step, index) => (
              <Step key={step.label}>
                <StepLabel>
                  <Grid
                    container
                    spacing={2}
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      textAlign: 'center',
                    }}
                  >
                    <Grid
                      item
                      sm={6}
                      md={4}
                      sx={{textAlign: 'left', paddingLeft: '28px'}}
                    >
                      {moment(step?.date).format('DD-MM-YYYY HH:mm')}
                    </Grid>
                    <Grid item sm={6} md={8} sx={{textAlign: 'left'}}>
                      {step.tripAction}
                    </Grid>
                    {/* <Grid item sm={6} md={2} sx={{textAlign: 'left'}}>
                    Fasffasr fdsafa fas
                  </Grid> */}
                  </Grid>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      )}
    </div>
  );
};

export default History;
