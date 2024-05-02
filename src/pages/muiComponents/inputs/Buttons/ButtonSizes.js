import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export default function ButtonSizes() {
  return (
    <Box sx={{'& button': {m: 1}}}>
      <div>
        <Button id='btnMui123' size='small'>
          Small
        </Button>
        <Button id='btnMui123' size='medium'>
          Medium
        </Button>
        <Button id='btnMui123' size='large'>
          Large
        </Button>
      </div>
      <div>
        <Button id='btnMui123' variant='outlined' size='small'>
          Small
        </Button>
        <Button id='btnMui123' variant='outlined' size='medium'>
          Medium
        </Button>
        <Button id='btnMui123' variant='outlined' size='large'>
          Large
        </Button>
      </div>
      <div>
        <Button id='btnMui123' variant='contained' size='small'>
          Small
        </Button>
        <Button id='btnMui123' variant='contained' size='medium'>
          Medium
        </Button>
        <Button id='btnMui123' variant='contained' size='large'>
          Large
        </Button>
      </div>
    </Box>
  );
}
