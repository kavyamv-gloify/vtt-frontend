import React, {useState} from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import {makeStyles} from '@mui/styles';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import {Avatar, Box, Grid} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import HistoryIcon from '@mui/icons-material/History';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import clsx from 'clsx';
const History = ({ticketInfo}) => {
  const [OnboardPassenger, setOnboardPassenger] = useState([
    '1',
    '2',
    '3',
    '4',
  ]);
  const CustomStepIcon = (props) => {
    const classes = makeStyles();
    const {active, completed} = props;

    const stepIcons = {
      1: (
        <div
          style={{
            borderRadius: '50%',
            width: '30px',
            aspectRatio: '1 / 1',
            // border: '1px solid o'
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '1px solid rgba(224, 224, 224, 1)',
            // background: 'orange',
          }}
        >
          <ConfirmationNumberOutlinedIcon sx={{fontSize: '20px'}} />
        </div>
      ),
      2: <ConfirmationNumberOutlinedIcon />,
    };
    return (
      <div
        className={clsx(classes.root, {
          [classes.active]: active,
          [classes.completed]: completed,
        })}
      >
        {
          stepIcons[
            (String(props.icon) == OnboardPassenger?.stopType) == 'ESCORT'
              ? 2
              : 1
          ]
        }
      </div>
    );
  };

  return (
    <div>
      {ticketInfo?.incidentActionHistory?.length ? (
        <>
          <Stepper
            sx={{marginTop: '10px'}}
            // activeStep={5}
            orientation='vertical'
          >
            {ticketInfo?.incidentActionHistory.map((step, ind) => {
              return (
                <Step key={step.label} active={true}>
                  <StepLabel
                    sx={{fontSize: '20px', color: 'black', fontWeight: '500'}}
                    StepIconComponent={CustomStepIcon}
                  >
                    <Box
                      component='h3'
                      sx={{
                        fontWeight: 600,
                        fontSize: 16,
                        textAlign: 'left',
                        lineHeight: 1,
                        // marginBottom: '10px',
                      }}
                    >
                      {step?.action}
                    </Box>
                  </StepLabel>
                  <StepContent active={true}>
                    <Box
                      component='h3'
                      sx={{
                        // fontWeight: 400,
                        fontSize: 12,
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        ml: 1,
                        lineHeight: 1,
                        // marginBottom: '10px',
                      }}
                    >
                      {step?.actionDoneByName}
                    </Box>
                  </StepContent>
                </Step>
              );
            })}
          </Stepper>
        </>
      ) : null}
    </div>
  );
};

export default History;
