import * as React from 'react';
import {useState} from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import {makeStyles} from '@mui/styles';
import clsx from 'clsx';
import PrintIcon from '@mui/icons-material/Print';
import Rating from '@mui/material/Rating';
import {Grid} from '@mui/material';
import {SettingsPowerRounded} from '@mui/icons-material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import moment from 'moment';

export default function TripHistory({ticketInfo}) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState();
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
            border: '1px solid',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <PrintIcon />
        </div>
      ),
      2: <MoreVertIcon />,
    };

    return (
      <div
        className={clsx(classes.root, {
          [classes.active]: active,
          [classes.completed]: completed,
        })}
      >
        {stepIcons[String(props.icon) == ticketInfo?.stopList?.length ? 2 : 1]}
      </div>
    );
  };
  function OnboardPassenger({steps}) {
    return (
      <Grid container>
        <Grid item md={12}>
          <Stepper orientation='vertical'>
            {steps?.map((step, index) => (
              <Step>
                <StepLabel>
                  <Grid container>
                    <Grid item md={8} sx={{borderBottom: '1px solid black'}}>
                      <Grid container>
                        <Grid item md={8}>
                          <p>{step?.name}</p>
                          <Grid
                            container
                            sx={{marginTop: '5px', marginBottom: '5px'}}
                          >
                            <Grid
                              item
                              md={3}
                              sx={{
                                borderRight: '1px solid #f6f6f6',
                                display: 'flex',
                                //   justifyContent: 'center',
                              }}
                            >
                              <Rating
                                name='read-only'
                                value={step?.passRating}
                                readOnly
                                sx={{color: 'green', fontSize: '15px'}}
                              />
                            </Grid>
                            <Grid
                              item
                              md={3}
                              sx={{
                                borderLeft: '1px solid #f6f6f6',
                                display: 'flex',
                                justifyContent: 'center',
                              }}
                            >
                              <img
                                src={
                                  '/assets/images/' +
                                  (step?.vaccineStatus == 'Fully Vaccinated'
                                    ? 'Vaccinate_c_icon.png'
                                    : step?.vaccineStatus ==
                                      'Partially Vaccinated'
                                    ? 'partial_vaccinated_c_icon.png'
                                    : 'Not_vaccinated_c_icon.png')
                                }
                                style={{width: '20px', height: '20px'}}
                                alt='P'
                                onError={(event) =>
                                  (event.target.src =
                                    'Not_vaccinated_c_icon.png')
                                }
                              />
                              {step?.gender == 'Male' ? (
                                <div>
                                  <img
                                    src={'/assets/images/male.png'}
                                    alt='P'
                                    style={{width: '20px', height: '20px'}}
                                    // className={styles.icons}
                                  />
                                </div>
                              ) : step?.gender == 'Female' ? (
                                <img
                                  src={'/assets/images/female.png'}
                                  alt='P'
                                />
                              ) : null}
                            </Grid>
                          </Grid>
                          <div style={{display: 'flex'}}>
                            <img
                              src={'/assets/images/Routes.svg'}
                              style={{width: '20px', height: '20px'}}
                            />
                            <p
                              style={{marginLeft: '10px', marginBottom: '10px'}}
                            >
                              {step?.location?.locName}
                            </p>
                          </div>
                        </Grid>
                        <Grid item md={4} sx={{display: 'flex'}}>
                          <div
                            style={{display: 'flex', flexDirection: 'column'}}
                          >
                            <p>
                              {moment(step?.expectedArivalTime).format('hh:mm')}
                            </p>
                            <p>
                              {moment(step?.actualArivalTime).format('hh:mm')}
                            </p>
                          </div>
                          <div style={{marginLeft: '20px', marginTop: '4px'}}>
                            <p>09:03</p>
                          </div>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Grid>
      </Grid>
    );
  }
  return (
    <Grid container>
      <Grid item md={12}>
        <Stepper orientation='vertical' activeStep={open}>
          {ticketInfo?.stopList?.map((step, ind) => (
            <Step>
              <StepLabel StepIconComponent={CustomStepIcon}>
                <Grid container>
                  <Grid item md={12} sx={{borderBottom: '1px solid #f6f6f6'}}>
                    <Grid container>
                      <Grid item md={6}>
                        <p style={{color: 'grey'}}>{step?.stopPointName}</p>
                        <div style={{display: 'flex'}} className='cursor'>
                          <img
                            onClick={() => {
                              setOpen(open == ind ? null : ind);
                            }}
                            src={
                              '/assets/images/route_page_icon/employee_blue.png'
                            }
                            style={{marginTop: '7px', marginLeft: '20px'}}
                          />
                          <p
                            style={{
                              fontSize: '15px',
                              fomtWeight: '900',
                              marginLeft: '15px',
                              marginTop: '5px',
                            }}
                          >
                            {step?.onBoardPassengers?.length}
                          </p>
                        </div>
                      </Grid>
                      <Grid item md={4} sx={{display: 'flex'}}>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                          <p style={{color: 'grey'}}>
                            {step?.expectedArivalTimeStr?.split(' ')?.[1]}
                          </p>
                          <p style={{marginTop: '8px', color: 'grey'}}>
                            {step?.actualArivalTimeStr?.split(' ')?.[1]}
                          </p>
                        </div>
                        <div style={{marginLeft: '20px', marginTop: '4px'}}>
                          <p>09:03</p>
                        </div>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </StepLabel>
              <StepContent>
                {open == ind && (
                  <OnboardPassenger steps={step?.onBoardPassengers} />
                )}
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Grid>
    </Grid>
  );
}
