import React, {useState, useEffect} from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Modal,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import keys from '@common/keys';

const InTouchSdk = () => {
  const styleMap = {
    minWidth: '98%',
    minHeight: '400px',
    display: 'inline-block',
  };
  var mapObject, direction_plugin;
  const [open, setOpen] = useState(false);

  initialized(keys.ACCESS_TOKEN.toString());

  return (
    <>
      <section>
        <Button
          id='btnMui123'
          className='btn'
          onClick={() => {
            setOpen(true);
          }}
        >
          InTouchSDK
        </Button>
        <Dialog
          open={open}
          onClose={() => {
            setOpen(false);
          }}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
          maxWidth='false'
          PaperProps={{
            sx: {
              width: '80%',
              maxHeight: 500,
              border: '2px solid #eee',
              borderRadius: '8px',
            },
          }}
        >
          <DialogTitle id='alert-dialog-title' style={{textAlign: 'right'}}>
            <IconButton
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent style={{padding: '0px 5px 20px 5px'}}>
            <div id='mapdiv' style={styleMap}></div>

            {/* <DialogContentText id="alert-dialog-description">
                        Are you sure, You want to deactivate the vendor?
                    </DialogContentText> */}
          </DialogContent>
        </Dialog>
      </section>
    </>
  );
};

function initialized(mmiToken) {
  try {
    if (mmiToken) {
      <script src='https://cdn.mapmyindia.com/Intouch/sdk/v1.0/intouch-sdk.js'></script>;
      // <script type="text/javascript" defer="defer">
      var intouchSdk = new IntouchSdk();
      function deviceDataCallback(data) {}

      function updateToken() {
        intouchSdk.updateAccessToken('2be6c304-8c7f-4548-956f-ab510c197ad8');
      }

      intouchSdk.initialize(
        mapdiv,
        '0a8af9d5a95ed4765f34f0cf080dfe9f',
        '2be6c304-8c7f-4548-956f-ab510c197ad8',
        updateToken,
      );

      var deviceObj = {};
      deviceObj.customIconUrl = 'https://maps.mappls.com/images/to.png';
      deviceObj.iconType = 'car';
      deviceObj.deviceId = 1002537;
      deviceObj.bindPopUp = true;
      intouchSdk.trackDevice(deviceObj, deviceDataCallback);
      {
        /* </script> */
      }
    }
  } catch (e) {
    console.error(String(e));
  }
}

export default InTouchSdk;
