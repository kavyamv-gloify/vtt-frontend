import React, {useState, useEffect} from 'react';
import {Grid, Button, Box} from '@mui/material';
import Editor from '../CKEDITOR';
import AttachmentOutlinedIcon from '@mui/icons-material/AttachmentOutlined';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import AppTooltip from '@crema/core/AppTooltip';
import {useAuthUser} from '@crema/utility/AuthHooks';
const EmailBody = ({close, copyContent}) => {
  const {user} = useAuthUser();
  const [comment, setComment] = useState();
  function setEmail(d) {
    setComment(d);
  }
  useEffect(() => {
    console.log('comment', comment);
  }, []);
  return (
    <div>
      <Grid
        container
        sx={{
          borderBottom: '1px solid rgba(224, 224, 224, 1)',
          marginTop: '-14px',
        }}
      >
        <Grid item md={12} sx={{marginBottom: '10px'}}>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Box
              component='h5'
              sx={{
                fontWeight: 550,
                fontSize: 14,
                textAlign: 'left',
                marginLeft: '10px',
                lineHeight: 1,
                color: '#909497',
              }}
            >
              {'From'}
            </Box>
            <Box sx={{marginLeft: '20px'}}>{user?.userList?.emailId}</Box>
          </Box>
        </Grid>
        <Grid item md={12} sx={{marginBottom: '10px'}}>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Box
              component='h5'
              sx={{
                fontWeight: 550,
                fontSize: 14,
                textAlign: 'left',
                marginLeft: '10px',
                lineHeight: 1,
                color: '#909497',
              }}
            >
              {'Recipients'}
            </Box>
            <Box sx={{marginLeft: '20px'}}>{user?.userList?.emailId}</Box>
          </Box>
        </Grid>
        <Grid item md={12}>
          <Editor setEmail={setEmail} id={'658151a50e45ef51bb5725b6'} />
        </Grid>
        <Grid item md={12} sx={{padding: '10px'}}>
          <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
            <Box sx={{display: 'flex', alignItems: 'center'}}>
              <AppTooltip placement={'top'} title={'Add Attachement'}>
                <AttachmentOutlinedIcon sx={{marginRight: '20px'}} />
              </AppTooltip>
            </Box>
            <Box sx={{display: 'flex'}}>
              {
                <Button
                  variant='contained'
                  sx={{marginLeft: '10px'}}
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  Send and Close
                </Button>
              }
              <Button
               variant='contained'
               sx={{marginLeft: '10px'}}
                onClick={() => {
                  // setClose(true);
                }}
              >
                Close Ticket
              </Button>
              <Button
                sx={{marginLeft: '10px'}}
                onClick={() => {
                  close();
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default EmailBody;
