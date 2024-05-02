/* eslint-disable */
import React, {useEffect, useState} from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import SmartForm from './index';
import useStyles from './styles/stepper';
import StepConnector, {stepConnectorClasses} from '@mui/material/StepConnector';
import {styled} from '@mui/material/styles';
import _ from '@lodash';

export default function StepperForm({
  myCurrentStep,
  icons,
  template,
  SecretFun,
  defaultValues,
  fetchLayoutData,
  afterSubmit,
  onChange,
  showbtn,
  onBlur,
  mode,
  myMode,
  setVal,
  clearErr,
  setSuccessIcon,
  getOnInput,
  seterrors,
}) {
  const classes = useStyles();
  const steps = template.steps;
  const [activeStep, setActiveStep] = useState(0);
  const isLastStep = activeStep === steps.length - 1;
  //   const currentValidationSchema = validationSchema[activeStep];
  const [enable, setEnable] = useState(false);

  useEffect(() => {
    if (myCurrentStep) myCurrentStep(activeStep + 1);
  }, [activeStep]);

  const QontoConnector = styled(StepConnector)(({theme}) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 10,
      left: 'calc(-50% + 16px)',
      right: 'calc(50% + 16px)',
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: '#22983d',
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: '#22983d',
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      borderColor:
        theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
      borderTopWidth: 3,
      borderRadius: 1,
    },
  }));

  const QontoStepIconRoot = styled('div')(({theme, ownerState}) => ({
    color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
    display: 'flex',
    height: 22,
    alignItems: 'center',
    ...(ownerState.active && {
      color: '#784af4',
    }),
    '& .QontoStepIcon-completedIcon': {
      color: '#784af4',
      zIndex: 1,
      fontSize: 18,
    },
    '& .QontoStepIcon-circle': {
      width: 8,
      height: 8,
      borderRadius: '50%',
      backgroundColor: 'currentColor',
    },
  }));

  function QontoStepIcon(props) {
    const {active, completed, className} = props;

    return (
      <QontoStepIconRoot ownerState={{active}} className={className}>
        {completed ? (
          <Check className='QontoStepIcon-completedIcon' />
        ) : (
          <div className='QontoStepIcon-circle' />
        )}
      </QontoStepIconRoot>
    );
  }

  QontoStepIcon.propTypes = {
    /**
     * Whether this step is active.
     * @default false
     */
    active: PropTypes.bool,
    className: PropTypes.string,
    /**
     * Mark the step as completed. Is passed to child components.
     * @default false
     */
    completed: PropTypes.bool,
  };

  const ColorlibStepIconRoot = styled('div')(({theme, ownerState}) => ({
    backgroundColor:
      theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
    zIndex: 1,
    color: '#fff',
    width: !icons || _.isEmpty(icons) ? 30 : 40,
    height: !icons || _.isEmpty(icons) ? 30 : 40,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    marginTop: '-6px',
    alignItems: 'center',
    ...(ownerState.active && {
      background: '#0A8FDC',
      boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    }),
    ...(ownerState.completed && {
      background: '#22983d',
    }),
  }));
  function ColorlibStepIcon(props) {
    const {active, completed, className} = props;
    return (
      // <ColorlibStepIconRoot style={{cursor:(completed) ? "pointer" : "pointer"}} onClick={(e) => {setActiveStep(props?.icon - 1) }} ownerState={{ completed, active }} className={className}>
      <ColorlibStepIconRoot
        style={{cursor: completed ? 'pointer' : ''}}
        onClick={(e) => {
          if (completed && props?.icon) {
            setActiveStep(props?.icon - 1);
          }
        }}
        ownerState={{completed, active}}
        className={className}
      >
        {!icons || _.isEmpty(icons) ? props.icon : icons[String(props.icon)]}
      </ColorlibStepIconRoot>
    );
  }
  function _sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  useEffect(() => {
    if (showbtn) {
      enableButton();
    }
  }, [showbtn]);
  async function enableButton() {
    setTimeout(() => {
      setEnable(null);
    }, 1000);
    setTimeout(() => {
      setEnable(true);
    }, 1000);
  }
  async function _submitForm(values, actions) {
    await _sleep(1000);
    //  );
    afterSubmit(values);
    // actions.setSubmitting(false);
    // setActiveStep(activeStep + 1);
  }

  function _handleSubmit(values, actions) {
    if (isLastStep) {
      _submitForm(values, actions);
    } else {
      setActiveStep(activeStep + 1);
      actions.setTouched({});
      actions.setSubmitting(false);
    }
  }

  function _handleBack() {
    setActiveStep(activeStep - 1);
  }

  function _handleChange(value) {
    //
    if (onChange) {
      onChange(value);
    }
  }

  return (
    <>
      {template && template.title && (
        <Typography component='h1' variant='h4' align='center'>
          {template.title}
        </Typography>
      )}
      <Stepper
        activeStep={activeStep}
        className={classes.stepper}
        alternativeLabel
        connector={<QontoConnector />}
      >
        {steps.map((step) => (
          <Step key={step.title}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>
              {step.title}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      <>
        {/* {steps.map((frm, index) => {
        return(
          <Box
          sx={{
            display: activeStep == index ? 'flex' : 'none',
            flexDirection: 'column',
            width: 1,
            height: 1,
          }}
          className={classes.box}
        >
          <SmartForm
            defaultValues={defaultValues}
            template={frm.form}
            watchFields={['vendorName', 'include_portfolio', 'email', 'country']}
            // validate={validate}
            // onInput={true}
            getOnInput={getOnInput}
            onSubmit={data => _handleSubmit(data)}
            onBack={_handleBack}
            onBlur={onBlur}
            mode={mode}
            fetchLayoutData={fetchLayoutData}
            SecretFun={SecretFun}
            setVal={setVal}
            clearErr={clearErr}
            seterrors={seterrors}
            setSuccessIcon={setSuccessIcon}
            onChange={_handleChange}
            success={enable}
            buttons={activeStep !== 0 ? ['back'].concat(steps[activeStep].buttons) : steps[activeStep].buttons}
          />
        </Box>
        )
      })} */}
        {activeStep === steps.length ? (
          <p
            style={{
              paddingTop: '20%',
              color: '#969191',
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            Nothing To Display
          </p>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: 1,
              height: 1,
            }}
            className={classes.box}
          >
            <SmartForm
              defaultValues={defaultValues}
              template={steps[activeStep].form}
              watchFields={[
                'vendorName',
                'include_portfolio',
                'email',
                'country',
              ]}
              // validate={validate}
              // onInput={true}
              getOnInput={getOnInput}
              onSubmit={(data) => _handleSubmit(data)}
              onBack={_handleBack}
              onBlur={onBlur}
              mode={mode}
              myMode={myMode}
              fetchLayoutData={fetchLayoutData}
              SecretFun={SecretFun}
              setVal={setVal}
              clearErr={clearErr}
              seterrors={seterrors}
              setSuccessIcon={setSuccessIcon}
              onChange={_handleChange}
              success={enable}
              buttons={
                activeStep !== 0
                  ? ['back'].concat(steps[activeStep].buttons)
                  : steps[activeStep].buttons
              }
            />
          </Box>
        )}
      </>
    </>
  );
}
