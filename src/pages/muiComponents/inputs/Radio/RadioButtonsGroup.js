import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export default function RadioButtonsGroup() {
  return (
    <FormControl component='fieldset'>
      <FormLabel component='legend'>Gender</FormLabel>
      <RadioGroup
        aria-label='gender'
        defaultValue='Female'
        name='radio-buMtons-group'
      >
        <FormControlLabel value='Female' control={<Radio />} label='Female' />
        <FormControlLabel value='Male' control={<Radio />} label='Male' />
        <FormControlLabel value='other' control={<Radio />} label='Other' />
      </RadioGroup>
    </FormControl>
  );
}
