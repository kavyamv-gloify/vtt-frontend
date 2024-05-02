import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Api from '@api';
import {Dialog, DialogContent, DialogTitle, Grid} from '@mui/material';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import moment from 'moment';
import PeopleIcon from '@mui/icons-material/People';
import HistoryIcon from '@mui/icons-material/History';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import {sortedLastIndex} from 'lodash';
import PrintIcon from '@mui/icons-material/Print';
import {makeStyles} from '@mui/styles';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import clsx from 'clsx';
import InnerStepper from './InnerStepper';
const TripStepper = ({tripId}) => {
  const [iconRow, setIconRow] = React.useState();
  const [OnboardPassenger, setOnboardPassenger] = useState();
  const [index, setIndex] = useState();
  const [open, setOpen] = useState(false);
  function getDelayOrEarlyMinutes(expectedTime, arrivalTime) {
    if (expectedTime !== 0 && arrivalTime !== 0) {
      let expected = expectedTime;
      let arrival = arrivalTime;
      let secDiff = Math.floor((arrival - expected) / 1000);
      let minutesDiff = Math.floor(secDiff / 60);
      // console.log(minutesDiff.toString().slice(0, 3));
      return minutesDiff.toString().slice(0, 4);
    } else return '--';
  }
  const [activeStep, setActiveStep] = React.useState(0);

  useEffect(() => {
    console.log('tripId', tripId);
    axios
      .get(Api.baseUri + `/user-reg/trip-route/get-trip-by-id/${tripId?._id}`)
      .then((res) => {
        if (res?.data?.status == '200') {
          console.log('res', res?.data?.data?.stopList);
          setOnboardPassenger(res?.data?.data?.stopList);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  }, [tripId?._id]);

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
            background: 'orange',
          }}
        >
          <LocationCityIcon sx={{fontSize: '20px', color: 'white'}} />
        </div>
      ),
      2: <DirectionsCarIcon />,
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

  const CustomStepEmployeeIcon = (props) => {
    const classes = makeStyles();
    const {active, completed} = props;

    const stepIcons = {
      1: (
        <div
          style={{
            borderRadius: '50%',
            width: '0px',
            aspectRatio: '1 / 1',
            border: '1px solid',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#e8e9eb',
          }}
        >
          <PeopleIcon sx={{fontSize: 'medium'}} />
        </div>
      ),
      2: <DirectionsCarIcon />,
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
            String(props.icon) == OnboardPassenger?.onBoardPassengers?.length
              ? 2
              : 1
          ]
        }
      </div>
    );
  };
  return (
    <>
      {OnboardPassenger?.length ? (
        <>
          <Stepper
            sx={{marginTop: '10px'}}
            // activeStep={5}
            orientation='vertical'
          >
            {OnboardPassenger.map((step, ind) => {
              return (
                <Step key={step.label} active={true}>
                  <StepLabel
                    sx={{fontSize: '20px', color: 'black', fontWeight: '500'}}
                    StepIconComponent={CustomStepIcon}
                  >
                    <Grid container>
                      <Grid
                        item
                        md={8}
                        sx={{
                          display: 'flex',
                          justifyContent: 'start',
                          alignItems: 'center',
                          // flexDirection: 'column',
                        }}
                      >
                        <p
                          style={{
                            fontSize: '15px',
                            color: 'black',
                            fontWeight: '400',
                          }}
                        >
                          {' '}
                          {step?.location?.locName}
                        </p>
                      </Grid>
                      <Grid
                        item
                        md={2}
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          flexDirection: 'column ',
                        }}
                      >
                        <p style={{fontWeight: '500'}}>
                          {step?.expectedArivalTime == 0
                            ? '--'
                            : moment(step?.expectedArivalTime).format('HH:mm')}
                        </p>

                        <p
                          style={{
                            color:
                              getDelayOrEarlyMinutes(
                                step?.expectedArivalTime,
                                step?.actualArivalTime,
                              ) < 0
                                ? '#04bade'
                                : '#800000',
                            fontWeight: '500',
                          }}
                        >
                          {step?.actualArivalTime == 0
                            ? '--'
                            : moment(step?.actualArivalTime).format('HH:mm')}
                        </p>
                      </Grid>
                      <Grid
                        item
                        md={2}
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          flexDirection: 'column',
                        }}
                      >
                        <DirectionsCarIcon
                          sx={{
                            fontSize: 'medium',
                            color:
                              getDelayOrEarlyMinutes(
                                step?.expectedArivalTime,
                                step?.actualArivalTime,
                              ) < 0
                                ? '#04bade'
                                : '#800000',
                          }}
                        />

                        <p
                          style={{
                            fontWeight: '500',
                            color:
                              getDelayOrEarlyMinutes(
                                step?.expectedArivalTime,
                                step?.actualArivalTime,
                              ) < 0
                                ? '#04bade'
                                : '#800000',
                          }}
                        >
                          {getDelayOrEarlyMinutes(
                            step?.expectedArivalTime,
                            step?.actualArivalTime,
                          )}
                        </p>
                      </Grid>
                    </Grid>
                  </StepLabel>
                  <StepContent active={true}>
                    <Grid container>
                      <Grid
                        item
                        md={8}
                        sx={{display: 'flex', flexDirection: 'column'}}
                      >
                        <div
                          style={{display: 'flex', alignItems: 'center'}}
                          className='cursor'
                          onClick={() => {
                            setIndex(ind);
                            setOpen(!open);
                          }}
                        >
                          {step?.onBoardPassengers?.length ? (
                            <PeopleIcon sx={{color: ' #053f5c'}} />
                          ) : (
                            <DirectionsWalkIcon
                              sx={{color: ' #053f5c'}}
                              onClick={() => {
                                console.log('index', ind);
                                setIndex(ind);
                                setOpen(!open);
                              }}
                            />
                          )}

                          <p style={{marginLeft: '5px'}}>
                            {step?.onBoardPassengers?.length
                              ? step?.onBoardPassengers?.length
                              : step?.deBoardPassengers?.length}
                          </p>
                        </div>

                        {index == ind && (
                          <InnerStepper data={step} index={ind} />
                        )}
                      </Grid>
                      <Grid item md={2}></Grid>
                      <Grid
                        item
                        md={2}
                        sx={{
                          display: 'flex',
                          judtifyItem: 'center',
                          alignItems: 'center',
                          flexDirection: 'column',
                        }}
                      ></Grid>
                    </Grid>
                  </StepContent>
                </Step>
              );
            })}
          </Stepper>
        </>
      ) : null}
    </>
  );
};

export default TripStepper;
