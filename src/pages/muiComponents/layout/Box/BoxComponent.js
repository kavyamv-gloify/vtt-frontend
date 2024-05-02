import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export default function BoxComponent() {
  return (
    <Box component='span' sx={{p: 2, border: '1px dashed grey'}}>
      <Button id='btnMui123'>Save</Button>
    </Box>
  );
}
