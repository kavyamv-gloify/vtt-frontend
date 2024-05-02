import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

export default function OutlinedButtons() {
  return (
    <Stack direction='row' spacing={2}>
      <Button id='btnMui123' variant='outlined'>
        Primary
      </Button>
      <Button id='btnMui123' variant='outlined' disabled>
        Disabled
      </Button>
      <Button id='btnMui123' variant='outlined' href='#outlined-buttons'>
        Link
      </Button>
    </Stack>
  );
}
