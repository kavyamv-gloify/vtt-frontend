import React from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import {Dialog, DialogContent, DialogTitle, Grid} from '@mui/material';
import Rating from '@mui/material/Rating';
import ManIcon from '@mui/icons-material/Man';
import WomanIcon from '@mui/icons-material/Woman';
import PeopleIcon from '@mui/icons-material/People';
import moment from 'moment';
import CancelIcon from '@mui/icons-material/Cancel';
const InnerStepper = ({data, index}) => {
  console.log('<<<', data[index]);
  console.log('index', index);
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
        {stepIcons[String(props.icon) == data?.length ? 2 : 1]}
      </div>
    );
  };
  return (
    <div>
      <Grid container sx={{marginTop: '10px'}}>
        <Grid item md={12}>
          <Stepper
            orientation='vertical'
            StepIconComponent={CustomStepEmployeeIcon}
          >
            {data?.onBoardPassengers?.length &&
              data?.onBoardPassengers?.map((el) => {
                return (
                  <Step key={el.label} active={true}>
                    <StepLabel active={true}>
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
                              fontSize: '17px',
                              color: 'black',
                              fontWeight: '500',
                            }}
                          >
                            {' '}
                            {el?.name}
                          </p>
                        </Grid>
                        <Grid
                          item
                          md={2}
                          stlye={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'start',
                            marginTop: '20px',
                          }}
                        ></Grid>
                      </Grid>
                    </StepLabel>
                    <StepContent active={true}>
                      <Grid container sx={{marginTop: '-10px'}}>
                        <Grid item md={8}>
                          <div
                            style={{
                              display: 'flex',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                              }}
                            >
                              <Rating
                                name='read-only'
                                value={el?.passRating}
                                readOnly
                                sx={{
                                  color: 'green',
                                  fontSize: '20px',
                                }}
                              />
                            </div>

                            <div
                              style={{
                                display: 'flex',
                                marginLeft: '20px',
                                alignItems: 'center',
                                borderLeft: '2px solid #f6f6f6',
                                justifyContent: 'center',
                                width: '60px',
                              }}
                            >
                              <img
                                src={
                                  '/assets/images/' +
                                  (el?.vaccineStatus == 'Fully Vaccinated'
                                    ? 'Vaccinate_c_icon.png'
                                    : el?.vaccineStatus ==
                                      'Partially Vaccinated'
                                    ? 'partial_vaccinated_c_icon.png'
                                    : 'Not_vaccinated_c_icon.png')
                                }
                                style={{
                                  width: '25px',
                                  height: '25px',
                                }}
                                alt='P'
                                onError={(event) =>
                                  (event.target.src =
                                    'Not_vaccinated_c_icon.png')
                                }
                              />
                              {el?.gender == 'Male' ? (
                                <div>
                                  <ManIcon sx={{color: '#003152'}} />
                                </div>
                              ) : el?.gender == 'Female' ? (
                                <WomanIcon sx={{color: '#e75480'}} />
                              ) : null}
                            </div>
                          </div>
                          <div style={{display: 'flex'}}>
                            <img
                              src={'/assets/images/Routes.svg'}
                              style={{
                                width: '20px',
                                height: '20px',
                              }}
                            />
                            <p
                              style={{
                                marginLeft: '10px',
                                marginBottom: '10px',
                              }}
                            >
                              {el?.location?.locName}
                            </p>
                          </div>
                        </Grid>
                        <Grid md={3}>
                          {el?.status == 'ABSENT' ? (
                            <div style={{display: 'flex'}}>
                              <img
                                src='/assets/images/absent.png'
                                style={{width: '27px', height: '45px'}}
                              />
                              <p
                                style={{
                                  color: 'red',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  marginLeft: '10px',
                                }}
                              >
                                {el?.absentDateTime == 0
                                  ? '--'
                                  : moment(el?.absentDateTime).format('HH:mm')}
                              </p>
                            </div>
                          ) : el?.status == 'CANCLED' ? (
                            <div style={{display: 'flex'}}>
                              <CancelIcon sx={{color: 'red'}} />
                              <p
                                style={{
                                  color: 'red',
                                  marginLeft: '20px',
                                  display: 'flex',
                                  alignItem: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                {el?.cancelDateTime == 0
                                  ? '--'
                                  : moment(el?.cancelDateTime).format('HH:mm')}
                              </p>
                            </div>
                          ) : (
                            <p
                              style={{
                                color:
                                  getDelayOrEarlyMinutes(
                                    el?.expectedArivalTime,
                                    el?.actualArivalTime,
                                  ) < 0
                                    ? 'green'
                                    : '#800000',
                              }}
                            >
                              {el?.actualPickUpDateTime == 0
                                ? '--'
                                : moment(el?.actualPickUpDateTime).format(
                                    'HH:mm',
                                  )}
                            </p>
                          )}
                        </Grid>
                      </Grid>
                    </StepContent>
                  </Step>
                );
              })}

            {data?.deBoardPassengers?.length &&
              data?.deBoardPassengers?.map((el) => {
                return (
                  <Step key={el.label} active={true}>
                    <StepLabel active={true}>
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
                              fontSize: '17px',
                              color: 'black',
                              fontWeight: '500',
                            }}
                          >
                            {' '}
                            {el?.name}
                          </p>
                        </Grid>
                        <Grid
                          item
                          md={2}
                          stlye={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'start',
                          }}
                        ></Grid>
                      </Grid>
                    </StepLabel>
                    <StepContent active={true}>
                      <Grid container sx={{marginTop: '-10px'}}>
                        <Grid item md={8}>
                          <div
                            style={{
                              display: 'flex',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                              }}
                            >
                              <Rating
                                name='read-only'
                                value={el?.passRating}
                                readOnly
                                sx={{
                                  color: 'green',
                                  fontSize: '20px',
                                }}
                              />
                            </div>

                            <div
                              style={{
                                display: 'flex',
                                marginLeft: '20px',
                                alignItems: 'center',
                                borderLeft: '2px solid #f6f6f6',
                                justifyContent: 'center',
                                width: '60px',
                              }}
                            >
                              <img
                                src={
                                  '/assets/images/' +
                                  (el?.vaccineStatus == 'Fully Vaccinated'
                                    ? 'Vaccinate_c_icon.png'
                                    : el?.vaccineStatus ==
                                      'Partially Vaccinated'
                                    ? 'partial_vaccinated_c_icon.png'
                                    : 'Not_vaccinated_c_icon.png')
                                }
                                style={{
                                  width: '25px',
                                  height: '25px',
                                }}
                                alt='P'
                                onError={(event) =>
                                  (event.target.src =
                                    'Not_vaccinated_c_icon.png')
                                }
                              />
                              {el?.gender == 'Male' ? (
                                <div>
                                  <ManIcon sx={{color: '#003152'}} />
                                </div>
                              ) : el?.gender == 'Female' ? (
                                <WomanIcon sx={{color: '#e75480'}} />
                              ) : null}
                            </div>
                          </div>
                          <div style={{display: 'flex'}}>
                            <img
                              src={'/assets/images/Routes.svg'}
                              style={{
                                width: '20px',
                                height: '20px',
                              }}
                            />
                            <p
                              style={{
                                marginLeft: '10px',
                                marginBottom: '10px',
                              }}
                            >
                              {el?.officeLocation?.locName}
                            </p>
                          </div>
                        </Grid>
                        <Grid md={3}>
                          {el?.status == 'ABSENT' ? (
                            <div style={{display: 'flex'}}>
                              <img
                                src='/assets/images/absent.png'
                                style={{width: '27px', height: '45px'}}
                              />
                              <p
                                style={{
                                  color: 'red',
                                  marginLeft: '20px',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                {el?.absentDateTime == 0
                                  ? '--'
                                  : moment(el?.absentDateTime).format('HH:mm')}
                              </p>
                            </div>
                          ) : el?.status == 'CANCLED' ? (
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              <CancelIcon sx={{color: 'red'}} />
                              <p
                                style={{
                                  color: 'red',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  marginLeft: '20px',
                                }}
                              >
                                {el?.cancelDateTime == 0
                                  ? '--'
                                  : moment(el?.cancelDateTime).format('HH:mm')}
                              </p>
                            </div>
                          ) : el?.status == 'NOSHOW' ? (
                            <p
                              style={{
                                color:
                                  getDelayOrEarlyMinutes(
                                    el?.expectedArivalTime,
                                    el?.actualArivalTime,
                                  ) < 0
                                    ? 'green'
                                    : '#800000',
                              }}
                            >
                              {el?.actualDropDateTime == 0
                                ? '--'
                                : moment(el?.actualDropDateTime).format(
                                    'HH:mm',
                                  )}
                            </p>
                          ) : (
                            <p
                              style={{
                                color:
                                  getDelayOrEarlyMinutes(
                                    el?.expectedArivalTime,
                                    el?.actualArivalTime,
                                  ) < 0
                                    ? 'green'
                                    : '#800000',
                              }}
                            >
                              {el?.actualDropDateTime == 0
                                ? '--'
                                : moment(el?.actualDropDateTime).format(
                                    'HH:mm',
                                  )}
                            </p>
                          )}
                        </Grid>
                      </Grid>
                    </StepContent>
                  </Step>
                );
              })}
          </Stepper>
        </Grid>
      </Grid>
    </div>
  );
};

export default InnerStepper;
