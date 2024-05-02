import React, {useState, useEffect} from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal,
} from '@mui/material';
import keys from '@common/keys';

const PlacePicker = () => {
  const styleMap = {
    minWidth: '98%',
    minHeight: '400px',
    display: 'inline-block',
  };
  var mapObject, picker;
  const [open, setOpen] = useState(false);

  initialize(keys.ACCESS_TOKEN.toString(), () => {
    //Action after script has been loaded completely

    afterScriptsLoaded();
  });

  function afterScriptsLoaded() {
    mapObject = window.mappls.Map('map', {
      center: [28.62, 77.09],
      zoom: 5,
      geolocation: false,
      search: false,
    });
    mapObject.addListener('load', function () {
      /*Place Picker plugin initialization*/
      var options = {
        map: mapObject,
        header: true,
        closeBtn: true,
        search: false,
      };
      new window.mappls.placePicker(options, function (data) {
        picker = data;
        var pdata = picker.getLocation();
      });
      // setTimeout(() => {
      //   //Dynamically click the done button remove the settimeout
      //   document.getElementById('submt_map').click();
      // }, 2000);
    });
    mapObject.addListener('move', function () {
      var options = {
        map: mapObject,
        header: true,
        closeBtn: true,
        search: false,
      };
      new window.mappls.placePicker(options, function (data) {
        picker = data;
        var pdata = picker.getLocation();
      });
      // setTimeout(() => {
      //   //Dynamically click the done button remove the settimeout
      //   document.getElementById('submt_map').click();
      // }, 2000);
    });
  }

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
          Open Place Picker
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
            },
          }}
        >
          {/* <DialogTitle id="alert-dialog-title">
                    {"Confirm to Deactivate"}
                    </DialogTitle> */}
          <DialogContent style={{padding: '20px 5px'}}>
            <div id='map' style={styleMap}></div>

            {/* <DialogContentText id="alert-dialog-description">
                        Are you sure, You want to deactivate the vendor?
                    </DialogContentText> */}
          </DialogContent>
        </Dialog>
      </section>
    </>
  );
};

function initialize(mmiToken, loadCallback) {
  try {
    if (mmiToken) {
      let count = 0;

      //Insert your script seperated by comma like scriptArr = [mapSDK_url, plugins_url];
      let mapSDK_url =
        'https://apis.mappls.com/advancedmaps/api/' +
        mmiToken +
        '/map_sdk?layer=vector&v=3.0';
      let plugins_url =
        'https://apis.mappls.com/advancedmaps/api/' +
        mmiToken +
        '/map_sdk_plugins?v=3.0';

      var scriptArr = [mapSDK_url, plugins_url];

      const recursivelyAddScript = (script) => {
        if (count < script.length) {
          const el = document.createElement('script');
          el.src = script[count];
          el.async = true;
          el.type = 'text/javascript';
          document.getElementsByTagName('head')[0].appendChild(el);
          count = count + 1;
          el.onload = function () {
            recursivelyAddScript(script);
          };
        } else {
          return loadCallback();
        }
      };
      recursivelyAddScript(scriptArr);
    }
  } catch (e) {
    console.error(String(e));
  }
}

export default PlacePicker;
