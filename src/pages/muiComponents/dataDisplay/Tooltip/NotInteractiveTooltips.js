import * as React from 'react';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';

export default function NotInteractiveTooltips() {
  return (
    <Tooltip title='Add' disableInteractive>
      <Button id='btnMui123'>Not interactive</Button>
    </Tooltip>
  );
}
