import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

export default function BasicButtonGroup() {
  return (
    <ButtonGroup variant='contained' aria-label='outlined primary button group'>
      <Button id='btnMui123'>One</Button>
      <Button id='btnMui123'>Two</Button>
      <Button id='btnMui123'>Three</Button>
    </ButtonGroup>
  );
}
