/* eslint-disable */
// import React from 'react';
// import _ from '@lodash';
// const Test = () => {
//   var array = [1];
//   var other = _.concat(array, 2, [3], [[4]]);

//
//   return (
//     <>
//       <h1>Home{other}</h1>
//     </>
//   );
// };
// export default Test;
import React, {useEffect, useState} from 'react';
import {
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  // FormControlLabel,
  // RadioGroup,
  // Radio,
  Checkbox,
} from '@mui/material';
// import MenuItem from '@mui/material/MenuItem';
// import Radio from '@mui/material/Radio';
// import RadioGroup from '@mui/material/RadioGroup';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import FormControl from '@mui/material/FormControl';
// import FormLabel from '@mui/material/FormLabel';
// import InputLabel from '@mui/material/InputLabel';
import {
  useForm,
  Controller,
  FormProvider,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import './CreateForm.css';

// const useStyles = makeStyles((theme) => ({
//   button: {
//     marginRight: theme.spacing(1),
//   },

// }));

function getSteps() {
  return [
    'Super Admin Details',
    'Contact Person Details',
    'Bank Details',
    'Access Rights',
  ];
}
// Corporate Name
// Corporate Logo
// Address(Head Office)
// Registration No.
// GSTIN No.
// PAN No
const BasicForm = () => {
  const {control} = useFormContext();
  const formData = useWatch({control, defaultValue: 'default'});

  const [filename, setFilename] = useState('Upload document');
  const [fileSize, setFilesize] = useState('');
  // const [clicked, setClick] = useState();

  //  );

  useEffect(() => {
    if (formData?.document && formData?.document[0]?.name) {
      var fname = formData.document[0].name;
      setFilesize(formData.document[0].size);
      setFilename(fname.slice(0, 22) + (fname.length > 22 ? '...' : ''));
    } else {
      setFilesize(0);
      setFilename('');
    }
  }, [formData.document]);
  // const test = [
  //   {
  //     value: 'Test',
  //     label: 'Test',
  //   },
  //   {
  //     value: 'Test1',
  //     label: 'Test1',
  //   },
  //   {
  //     value: 'Test2',
  //     label: 'Test2',
  //   },
  //   {
  //     value: 'Test3',
  //     label: 'Test3',
  //   },
  // ];
  return (
    <>
      {/* <Controller
        name="attachments"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <>
            <Button id='btnMui123'
              variant="contained"
              component="label"
            >
              Upload File
              <input
                type="file"
                hidden
                onChange={e => {
                  field.onChange(e.target.files);
                }}
                multiple
              />
            </Button>
          </>
        )}
      /> */}

      <Controller
        style={{display: 'flex'}}
        control={control}
        name='corporateName'
        render={({field}) => (
          <>
            {/* <TextField
              id="outlined-select-currency"
              select
              label="Select"
              variant="outlined"
              placeholder="Corporate Name"
              fullWidth
              margin="normal"
              {...field}
            // helperText="Please select"
            >
              {test.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField> */}
            {/* <FormControl>
              <FormLabel id="demo-controlled-radio-buttons-group">Gender</FormLabel>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                // {...field}
                // value={value}
                // onChange={handleChange}
              >
                <FormControlLabel {...field} value="Female" control={<Radio />} label="Female" />
                <FormControlLabel {...field} value="male" control={<Radio />} label="Male" />
              </RadioGroup>
            </FormControl> */}
            <TextField
              id='Corporate_Name'
              label='Corporate Name'
              variant='outlined'
              placeholder='Corporate Name'
              fullWidth
              margin='normal'
              {...field}
            />
          </>
        )}
      />
      <Controller
        control={control}
        name='document'
        render={({field}) => (
          // <TextField
          //   type='number'
          //   id="corporate-logo"
          //   label="Corporate Logo"
          //   variant="outlined"
          //   placeholder="Corporate Logo"
          //   fullWidth
          //   margin="normal"
          //   {...field}
          // />
          <span>
            {/* <InputLabel shrink htmlFor="my_doc">Business Address Document</InputLabel> */}
            <div className='file-upload-wrapper' data-text={filename}>
              <input
                // {...field}
                onChange={(e) => {
                  field.onChange(e.target.files);
                }}
                placeholder='uplode file'
                id='my_doc'
                className='mt-1 file-upload-field'
                type='file'
                accept='image/*'
                max-size='1'
                // {...register("document", { required: true })}
              />
            </div>
            {/* <div className="errorMessage">{errors.document ? "Please select file" : clicked && filesize > 10000000 ? "File size is more than 10mb" : ""}</div> */}
            <div className='errorMessage'>
              {fileSize && fileSize > 10000000
                ? 'File size is more than 10mb'
                : ''}
            </div>
          </span>
        )}
      />
      <Controller
        control={control}
        name='address'
        render={({field}) => (
          <TextField
            id='address'
            label='Address'
            variant='outlined'
            placeholder='Address'
            fullWidth
            margin='normal'
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name='registration'
        render={({field}) => (
          <TextField
            type='number'
            id='registration'
            label='Registration No.'
            variant='outlined'
            placeholder='Registration No.'
            fullWidth
            margin='normal'
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name='gst'
        render={({field}) => (
          <TextField
            id='gst'
            label='GSTIN No.'
            variant='outlined'
            placeholder='GSTIN No.'
            fullWidth
            margin='normal'
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name='pan'
        render={({field}) => (
          <TextField
            id='pan'
            label='PAN No'
            variant='outlined'
            placeholder='PAN No'
            fullWidth
            margin='normal'
            {...field}
          />
        )}
      />
    </>
  );
};
const ContactForm = () => {
  const {control} = useFormContext();
  return (
    <>
      <Controller
        control={control}
        name='contactPersonName'
        render={({field}) => (
          <TextField
            id='contactPersonName'
            label='Contact Person Name'
            variant='outlined'
            placeholder='Contact Person Name'
            fullWidth
            margin='normal'
            {...field}
          />
        )}
      />

      <Controller
        control={control}
        name='emailId'
        render={({field}) => (
          <TextField
            id='emailId'
            label='Email Id'
            variant='outlined'
            placeholder='Email Id'
            fullWidth
            margin='normal'
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name='mobileNo'
        render={({field}) => (
          <TextField
            id='mobileNo'
            label='Mobile No'
            variant='outlined'
            placeholder='Mobile No'
            fullWidth
            margin='normal'
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name='landlineNo'
        render={({field}) => (
          <TextField
            id='landlineNo'
            label='Landline No'
            variant='outlined'
            placeholder='Landline No'
            fullWidth
            margin='normal'
            {...field}
          />
        )}
      />
    </>
  );
};
const PersonalForm = () => {
  const {control} = useFormContext();
  return (
    <>
      <section>
        <label>Module 1 Permission</label>
        <Controller
          name='Checkbox1'
          control={control}
          render={({field}) => (
            <Checkbox
              onChange={(e) => field.onChange(e.target.checked)}
              checked={field.value}
              label='start'
            />
          )}
        />
      </section>
      <section>
        <label>Module 2 Permission</label>
        <Controller
          name='Checkbox2'
          control={control}
          render={({field}) => (
            <Checkbox
              onChange={(e) => field.onChange(e.target.checked)}
              checked={field.value}
              label='start'
            />
          )}
        />
      </section>
    </>
  );
};
const PaymentForm = () => {
  const {control} = useFormContext();
  return (
    <>
      <Controller
        control={control}
        name='cardNumber'
        render={({field}) => (
          <TextField
            id='cardNumber'
            label='Bank Account No'
            variant='outlined'
            placeholder='Bank Account No'
            fullWidth
            margin='normal'
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name='bankName'
        render={({field}) => (
          <TextField
            id='bankName'
            label='Bank Name'
            variant='outlined'
            placeholder='Bank Name'
            fullWidth
            margin='normal'
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name='branchName'
        render={({field}) => (
          <TextField
            id='branchName'
            label='Branch Name'
            variant='outlined'
            placeholder='Branch Name'
            fullWidth
            margin='normal'
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name='ifscCode'
        render={({field}) => (
          <TextField
            id='ifscCode'
            label='IFSC Code'
            variant='outlined'
            placeholder='IFSC Code'
            fullWidth
            margin='normal'
            {...field}
          />
        )}
      />
    </>
  );
};

function getStepContent(step) {
  switch (step) {
    case 0:
      return <BasicForm />;
    case 1:
      return <ContactForm />;
    case 2:
      return <PaymentForm />;
    case 3:
      return <PersonalForm />;
    default:
      return 'unknown step';
  }
}

const LinaerStepper = () => {
  // const classes = useStyles();
  const methods = useForm({
    defaultValues: {
      corporateName: '',
      document: '',
      address: '',
      registration: '',
      gst: '',
      pan: '',
      contactPersonName: '',
      emailId: '',
      mobileNo: '',
      landlineNo: '',
      Checkbox1: '',
      Checkbox2: '',
      cardNumber: '',
      bankName: '',
      branchName: '',
      ifscCode: '',
    },
  });
  const [activeStep, setActiveStep] = useState(0);
  const [skippedSteps, setSkippedSteps] = useState([]);
  const steps = getSteps();
  const isStepOptional = (step) => {
    return step === 1 || step === 2;
  };
  const isStepSkipped = (step) => {
    return skippedSteps.includes(step);
  };
  const handleNext = (data) => {
    if (activeStep == steps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      setActiveStep(activeStep + 1);
      setSkippedSteps(
        skippedSteps.filter((skipItem) => skipItem !== activeStep),
      );
    }
  };
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };
  const handleSkip = () => {
    if (!isStepSkipped(activeStep)) {
      setSkippedSteps([...skippedSteps, activeStep]);
    }
    setActiveStep(activeStep + 1);
  };
  // const onSubmit = (data) => {
  //
  // };
  return (
    <div>
      <Stepper alternativeLabel activeStep={activeStep}>
        {steps.map((step, index) => {
          const labelProps = {};
          const stepProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography
                variant='caption'
                align='center'
                style={{display: 'block'}}
              >
                optional
              </Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step {...stepProps} key={index}>
              <StepLabel {...labelProps}>{step}</StepLabel>
            </Step>
          );
        })}
      </Stepper>

      {activeStep === steps.length ? (
        <Typography variant='h3' align='center'>
          Thank You
        </Typography>
      ) : (
        <>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleNext)}>
              {getStepContent(activeStep)}

              <Button
                id='btnMui123'
                // className={classes.button}
                // style={{ marginRight: '30%' }}
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                back
              </Button>
              {isStepOptional(activeStep) && (
                <Button
                  id='btnMui123'
                  // className={classes.button}
                  style={{marginRight: '20%'}}
                  variant='contained'
                  color='primary'
                  onClick={handleSkip}
                >
                  skip
                </Button>
              )}
              <Button
                id='btnMui123'
                // className={classes.button}
                style={{marginRight: '50%'}}
                variant='contained'
                color='primary'
                // onClick={handleNext}
                type='submit'
              >
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </form>
          </FormProvider>
        </>
      )}
    </div>
  );
};

export default LinaerStepper;
