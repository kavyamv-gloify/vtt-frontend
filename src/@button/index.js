import React from 'react';
import {Button, Grid} from '@mui/material';
import CustomLabel from 'pages/common/CustomLabel';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const Buttons = ({name}) => {
  return (
    <>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={8}>
          <CustomLabel
            labelVal='Master Routes List'
            variantVal='h3-underline'
          />
        </Grid>
        <Grid item xs={4}>
          <CustomLabel
            labelVal='Master Routes List'
            variantVal='h3-underline'
          />
          <Button
            id='btnMui123'
            variant='outlined'
            sx={{
              position: 'absolute',
              right: '10px',
              top: '0',
              color: 'black',
              fontSize: '12px',
              borderRadius: '13px',
            }}
          >
            <FileDownloadIcon
              style={{
                fontSize: '16px',
                position: 'relative',
                top: '1px',
                right: '2px',
              }}
            />
            {name}
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default Buttons;
