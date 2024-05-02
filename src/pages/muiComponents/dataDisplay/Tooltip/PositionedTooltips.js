import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';

export default function PositionedTooltips() {
  return (
    <Box sx={{width: 500}}>
      <Grid container justifyContent='center'>
        <Grid item>
          <Tooltip title='Add' placement='top-start'>
            <Button id='btnMui123'>top-start</Button>
          </Tooltip>
          <Tooltip title='Add' placement='top'>
            <Button id='btnMui123'>top</Button>
          </Tooltip>
          <Tooltip title='Add' placement='top-end'>
            <Button id='btnMui123'>top-end</Button>
          </Tooltip>
        </Grid>
      </Grid>
      <Grid container justifyContent='center'>
        <Grid item xs={6}>
          <Tooltip title='Add' placement='left-start'>
            <Button id='btnMui123'>left-start</Button>
          </Tooltip>
          <br />
          <Tooltip title='Add' placement='left'>
            <Button id='btnMui123'>left</Button>
          </Tooltip>
          <br />
          <Tooltip title='Add' placement='left-end'>
            <Button id='btnMui123'>left-end</Button>
          </Tooltip>
        </Grid>
        <Grid item container xs={6} alignItems='flex-end' direction='column'>
          <Grid item>
            <Tooltip title='Add' placement='right-start'>
              <Button id='btnMui123'>right-start</Button>
            </Tooltip>
          </Grid>
          <Grid item>
            <Tooltip title='Add' placement='right'>
              <Button id='btnMui123'>right</Button>
            </Tooltip>
          </Grid>
          <Grid item>
            <Tooltip title='Add' placement='right-end'>
              <Button id='btnMui123'>right-end</Button>
            </Tooltip>
          </Grid>
        </Grid>
      </Grid>
      <Grid container justifyContent='center'>
        <Grid item>
          <Tooltip title='Add' placement='bottom-start'>
            <Button id='btnMui123'>bottom-start</Button>
          </Tooltip>
          <Tooltip title='Add' placement='bottom'>
            <Button id='btnMui123'>bottom</Button>
          </Tooltip>
          <Tooltip title='Add' placement='bottom-end'>
            <Button id='btnMui123'>bottom-end</Button>
          </Tooltip>
        </Grid>
      </Grid>
    </Box>
  );
}
