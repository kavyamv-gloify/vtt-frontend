import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export default function BasicButtons() {
  return (
    <Stack spacing={2} direction='row'>
      <Button id='btnMui123' variant='text'>
        Text
      </Button>
      <Button id='btnMui123' variant='contained'>
        Contained
      </Button>
      <Button id='btnMui123' variant='outlined'>
        Outlined
      </Button>
    </Stack>
  );
}
