import {Button, FormHelperText, Grid, TextField} from '@mui/material';
import regex from '@regex';
import moment from 'moment';
import React, {useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';

const GeneralInformation = ({
  clickedSwitch,
  activeStep,
  setActiveStep,
  setClickedSwitch,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: {errors},
    watch,
  } = useForm({defaultValues: {Address: 'Address'}, mode: 'onTouched'});
  const formData = watch();

  useEffect(() => {
    if (clickedSwitch != activeStep) onSaveAsDraft();
  }, [clickedSwitch]);

  function onSaveAsDraft() {
    console.log(formData);
    //Use save as draft API to save
    alert('Data saved as draft.');
    setActiveStep(clickedSwitch);
  }

  let section1_fields = [
    {
      title: 'Return Name',
      name: 'Return_Name',
      disabled: false,
      type: 'text',
    },
    {
      title: 'Return Code',
      name: 'Return_Code',
      disabled: false,
      type: 'text',
    },
    {
      title: 'Name of the Reporting Institution',
      name: 'Name_of_the_Reporting_Institution',
      disabled: false,
      type: 'text',
    },
    {
      title: 'Bank Code',
      name: 'Bank_Code',
      disabled: false,
      type: 'text',
    },
    {
      title: 'Address',
      name: 'Address',
      validate: {
        required: 'This field is required.',
        pattern: {
          value: regex.maxSize30,
          message: 'Please enter valid address.',
        },
      },
      disabled: false,
      type: 'text',
    },
    {
      title: 'End of date',
      name: 'End_of_date',
      disabled: false,
      type: 'text',
    },
    {
      title: 'Reporting Frequency',
      name: 'Reporting_Frequency',
      disabled: false,
      type: 'text',
    },
    {
      title: 'Date of Report',
      name: 'Date_of_Report',
      disabled: false,
      type: 'text',
      subtype: 'date',
      min: moment().format('YYYY-MM-DD'),
      max: moment('2023-12-2023').format('YYYY-MM-DD'),
    },
    {
      title: 'Report Status',
      name: 'Report_Status',
      type: 'select',
      options: [
        {title: 'Active', value: 'ACTIVE'},
        {title: 'Inactive', value: 'INACTIVE'},
      ],
    },
    {
      title: 'Date of Audit',
      name: 'Date_of_Audit',
      disabled: false,
      type: 'text',
    },
    {
      title: 'Return Version',
      name: 'Return_Version',
      disabled: false,
      type: 'text',
    },
    {
      title: 'Tool Name',
      name: 'Tool_Name',
      disabled: false,
      type: 'text',
    },
    {
      title: 'General Remarks',
      name: 'General_Remarks',
      disabled: false,
      required: true,
      type: 'text',
    },
  ];
  let section2_fields = [
    {
      title: 'Name',
      name: 'name',
      disabled: false,
      type: 'text',
    },
    {
      title: 'Designation',
      name: 'designation',
      disabled: false,
      type: 'text',
    },
    {
      title: 'Mobile No.',
      name: 'mobileNo',
      disabled: false,
      type: 'text',
    },
    {
      title: 'E-mail Id',
      name: 'emailId',
      disabled: false,
      type: 'text',
    },
    {
      title: 'Place',
      name: 'Place',
      disabled: false,
      type: 'text',
    },
    {
      title: 'Date',
      name: 'Date',
      disabled: false,
      type: 'text',
    },
  ];

  function onSubmit(data) {
    console.log(data);
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h4 className='heading-BSA1'>General Information</h4>
        <Grid
          container
          spacing={{xs: 2, md: 2}}
          // columns={{xs: 1, sm: 1, md: 1}}
        >
          {section1_fields?.map((ele, index) => {
            const {name, subtype, type, title, disabled, validate} = ele;
            return (
              <Grid item xs={12} sm={6} md={4} key={index + name + 'Grid'}>
                <label htmlFor={name} className='label-form-input'>
                  {title}
                  {validate?.required && <span style={{color: 'red'}}>*</span>}
                </label>
                <Controller
                  name={name}
                  control={control}
                  {...register(name, {...validate})}
                  render={({field}) => (
                    <TextField
                      {...field}
                      size='small'
                      type={subtype || type}
                      fullWidth
                      name={name}
                      disabled={disabled}
                    />
                  )}
                />
                <FormHelperText style={{color: '#d32f2f'}}>
                  {errors && !_.isEmpty(errors) && errors[name] && (
                    <span>{errors[name]?.message}</span>
                  )}
                </FormHelperText>
              </Grid>
            );
          })}
        </Grid>
        <h4 className='heading-BSA1'>Authorised Signatory</h4>
        <Grid
          sx={{mb: 8}}
          container
          spacing={{xs: 2, md: 2}}
          // columns={{xs: 1, sm: 1, md: 1}}
        >
          {section2_fields?.map((ele, index) => {
            const {name, subtype, type, title, disabled, required} = ele;
            return (
              <Grid item xs={12} sm={6} md={4} key={index + name + 'Grid'}>
                <label htmlFor={name} className='label-form-input'>
                  {title}
                  {required && <span style={{color: 'red'}}>*</span>}
                </label>
                <Controller
                  name={name}
                  control={control}
                  rules={{
                    required: required,
                  }}
                  render={({field: {onChange, value}}) => (
                    <TextField
                      size='small'
                      type={subtype || type}
                      fullWidth
                      onChange={(e) => onChange(e.target.value)}
                      value={value}
                      name={name}
                      disabled={disabled}
                    />
                  )}
                />
                <div>
                  {errors && !_.isEmpty(errors) && errors[name] && (
                    <span>This field is required</span>
                  )}
                </div>
              </Grid>
            );
          })}
        </Grid>
        <div style={{width: '100%', textAlign: 'center'}}>
          <Button variant='outlined' disabled>
            Back
          </Button>
          <Button
            variant='contained'
            onClick={() => {
              onSaveAsDraft();
            }}
            sx={{ml: 2, mr: 2}}
          >
            Save As Draft
          </Button>
          <Button
            onClick={() => {
              setActiveStep(activeStep + 1);
              setClickedSwitch(clickedSwitch + 1);
            }}
            variant='outlined'
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default GeneralInformation;
