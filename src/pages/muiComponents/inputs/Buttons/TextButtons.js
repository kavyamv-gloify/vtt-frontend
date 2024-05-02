import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

export default function TextButtons() {
  return (
    <Stack direction='row' spacing={2}>
      <Button id='btnMui123'>Primary</Button>
      <Button id='btnMui123' disabled>
        Disabled
      </Button>
      <Button id='btnMui123' href='#text-buttons'>
        Link
      </Button>
    </Stack>
  );
}
