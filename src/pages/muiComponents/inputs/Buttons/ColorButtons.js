import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export default function ColorButtons() {
  return (
    <Stack direction='row' spacing={2}>
      <Button id='btnMui123' color='secondary'>
        Secondary
      </Button>
      <Button id='btnMui123' variant='contained' color='success'>
        Success
      </Button>
      <Button id='btnMui123' variant='outlined' color='error'>
        Error
      </Button>
    </Stack>
  );
}
