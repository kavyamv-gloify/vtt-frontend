import React from 'react'
import { Grid } from '@mui/material';
import Revenue from 'pages/dashboards/ECommerce/Revenue/index.js';
import AppCircularProgress from '@crema/core/AppCircularProgress';
import AppCard from '@crema/core/AppCard';
import { useIntl } from 'react-intl';
import { Box } from '@mui/material';
import { Fonts } from 'shared/constants/AppEnums';
// import AppCircularProgress from '@crema/core/AppCircularProgress';

const EmployeeTravelling = () => {
  const options = ["Male", "Female"]

  return (
    <Grid container spacing={2} sx={{ marginTop: "20px" }}>
      <Grid item xs={12} md={12} sm={12}>
        {/* <Revenue title={"Employees Travelling Trend"} color={"green"} options={options} /> */}
        <AppCard title={"Employees Travelling Trend"}>
          <Box
            sx={{
              mb: 6,
              py: 3,
            }}
          >
            <AppCircularProgress
              activeColor={"GREEN"}
              value={70}
              hidePercentage
              centerNode={
                <Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                    }}
                  >
                    <Box
                      component='span'
                      sx={{
                        fontSize: 14,
                        fontWeight: Fonts.MEDIUM,
                      }}
                    >
                      $
                    </Box>
                    <Box
                      component='h3'
                      sx={{
                        color: 'text.primary',
                        fontSize: 18,
                        fontWeight: Fonts.MEDIUM,
                      }}
                    >
                      600
                    </Box>
                  </Box>
                  <Box
                    component='p'
                    sx={{
                      ml: 2,
                      fontSize: 14,
                      color: 'text.secondary',
                    }}
                  >
                    {"Male"}
                  </Box>
                </Box>
              }
              thickness={2}
            />
          </Box>

          <div style={{ marginTop: "75px" }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-around',

              }}
            >
              <Box>
                <Box
                  sx={{
                    fontSize: 18,
                    mb: 0.5,
                    fontWeight: Fonts.BOLD,
                  }}
                >
                  $ 2,000
                </Box>
                <Box
                  sx={{
                    color: 'text.secondary',
                  }}
                >
                  {"Male"}
                </Box>
              </Box>
              <Box>
                <Box
                  sx={{
                    fontSize: 18,
                    mb: 0.5,
                    fontWeight: Fonts.BOLD,
                  }}
                >
                  $ 1,500
                </Box>
                <Box
                  sx={{
                    color: 'text.secondary',
                  }}
                >
                  Current
                </Box>
              </Box>
            </Box>
          </div>

        </AppCard>
      </Grid>
    </Grid>

  )
}

export default EmployeeTravelling