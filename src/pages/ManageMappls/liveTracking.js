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
import axios from 'axios';
import Api from '@api';
import keys from '@common/keys';

const LiveTracking = () => {
  const styleMap = {
    minWidth: '98%',
    minHeight: '400px',
    display: 'inline-block',
  };

  useEffect(() => {
    let url = `${Api.baseUri}/user-reg/vehicle-track`;
    axios
      .get(url)
      .then((result) => {})
      .catch((err) => {});
  }, []);
  var mapObject,
    add,
    direction_plugin,
    c = 0,
    ll = [
      {lat: 28.63124010064198, lng: 77.46734619140625},
      {lat: 28.63395214251842, lng: 77.4635696411133},
      {lat: 28.634253476178397, lng: 77.45704650878908},
      {lat: 28.634856140902432, lng: 77.44880676269533},
      {lat: 28.635760131498788, lng: 77.44228363037111},
      {lat: 28.637266765186347, lng: 77.43679046630861},
      {lat: 28.637869412604015, lng: 77.43232727050783},
      {lat: 28.639677334088308, lng: 77.42855072021486},
      {lat: 28.640279967660007, lng: 77.42305755615236},
      {lat: 28.640882597770116, lng: 77.41928100585939},
      {lat: 28.640882597770116, lng: 77.41516113281251},
      {lat: 28.640581283147768, lng: 77.40932464599611},
      {lat: 28.63756808932784, lng: 77.40108489990236},
      {lat: 28.635760131498788, lng: 77.39421844482423},
      {lat: 28.634253476178397, lng: 77.38735198974611},
      {lat: 28.631541442089226, lng: 77.37808227539064},
    ];
  const [open, setOpen] = useState(false);

  initialize(keys.ACCESS_TOKEN.toString(), () => {
    //Action after script has been loaded completely
    afterScriptsLoaded();
  });
  function afterScriptsLoaded() {
    mapObject = window.mappls.Map('map', {
      center: [28.09, 78.3],
      zoom: 5,
    });
    mapObject.addListener('load', function () {
      /*direction plugin initialization*/
      var direction_option = {
        map: mapObject,
        divWidth: '350px',
        start: {
          label: 'start',
          geoposition: '28.63124010064198,77.46734619140625',
        },
        end: {
          label: 'end',
          geoposition: '28.631541442089226,77.37808227539064',
        },
        steps: false,
        search: true,
        isDraggable: false,
        alternatives: false,
        // callback: function(data) {}
      };
      // direction_plugin = new window.mappls.direction(direction_option);
      new window.mappls.direction(direction_option, function (data) {
        direction_plugin = data;
      });

      add = setInterval(() => {
        c++;
        if (ll[c]) {
          direction_plugin.tracking({
            location: ll[c],
            label: 'current location',
            icon: 'https://apis.mappls.com/map_v3/2.png',
            heading: false,
            reRoute: true,
            fitBounds: false,
            animationSpeed: 0,
            delay: 1000,
          });
          if (ll[c].lat === 28.631541442089226) {
            clearInterval(add);
            setTimeout(() => {
              alert('reached.');
            }, 500);
          }
        }
      }, 4000);
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
          Live Tracking
        </Button>
        {/* <Dialog
                    open={open}
                    onClose={()=>{setOpen(false)}}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="false"
                    PaperProps={{
                        sx: {
                          width: "80%",
                          maxHeight: 500
                        }
                      }}
                >
                    <DialogTitle id="alert-dialog-title">
                    <IconButton onClick={()=>{setOpen(false)}}>
                        <CloseIcon />
                    </IconButton>
                    </DialogTitle>
                    <DialogContent style={{padding: "20px 5px"}} >
                    <div id="map"  style={styleMap}></div>
                    </DialogContent>
                </Dialog> */}
        <div id='map' style={styleMap}></div>
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

export default LiveTracking;
