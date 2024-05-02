import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

export default function ContainedButtons() {
  return (
    <Stack direction='row' spacing={2}>
      <Button id='btnMui123' variant='contained'>
        Contained
      </Button>
      <Button id='btnMui123' variant='contained' disabled>
        Disabled
      </Button>
      <Button id='btnMui123' variant='contained' href='#contained-buttons'>
        Link
      </Button>
    </Stack>
  );
}
