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
import axios from 'axios';
import Api from '@api';
import keys from '@common/keys';

const DashboardView = () => {
  const styleMap = {
    minWidth: '98%',
    minHeight: '580px',
    display: 'inline-block',
  };
  var mapObject, picker;
  const [open, setOpen] = useState(false);
  const [pinData, setPinData] = React.useState([]);
  const [popupData, setPopupData] = React.useState([]);
  useEffect(() => {
    let url = `${Api.baseUri}/user-reg/vehicle-track`;
    axios
      .get(url)
      .then((result) => {
        if (result?.status == 200) {
          let temPinData = [];
          let temPopupData = [];
          if (result?.data?.status == 200 && result?.data?.data?.length > 0) {
            result?.data?.data?.forEach(function (item, index) {
              temPinData.push(
                `${item?.location?.latitude},${item?.location?.longitude}`,
              );
              temPopupData.push(`<h6>${item?.location?.address}</h6>`);
            });
          }
          setPinData(temPinData);
          setPopupData(temPopupData);
        } else {
          setPinData([]);
        }
      })
      .catch((err) => {
        setPinData([]);
      });
  }, []);

  useEffect(() => {
    setPinData(pinData);
    setPopupData(popupData);
  }, [pinData, popupData]);

  initialize(keys.ACCESS_TOKEN.toString(), () => {
    //Action after script has been loaded completely

    afterScriptsLoaded();
  });

  function afterScriptsLoaded() {
    mapObject = window.mappls.Map('map', {
      center: [28.612964, 77.229463],
      zoom: 12,
      geolocation: false,
      search: false,
    });
    mapObject.addListener('load', function () {
      var markerOptions = {
        map: mapObject,
        pin: [
          '28.6308,77.2506',
          '28.6392,77.2182',
          '28.612964,77.229463',
          '28.578614,77.317483',
          '28.6127, 77.2773',
          '28.5924, 77.1624',
        ],
        popupHtml: [
          '<h6>ITO</h6>',
          '<h6>New Delhi Railway Station</h6>',
          '<h6>India Gate</h6>',
          '<h6>Noida sector 16</h6>',
          '<h6>Akshardham temple</h6>',
          '<h6>Dhaula Kuan metro station</h6>',
        ],
        // pin: pinData,
        // popupHtml: popupData,
        icon: {
          html: " <div><img src='/assets/images/route_page_icon/car_orange.png' /></div>",
          width: 30, //optional
          height: 20, //optional
        },
      };

      new window.mappls.pinMarker(markerOptions);
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
          Dashboard
        </Button>
        <div id='map' style={styleMap}></div>
        <Dialog
          open={open}
          onClose={() => {
            setOpen(false);
          }}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
          maxWidth='false'
          maxHeight='false'
          PaperProps={{
            sx: {
              width: '95%',
              maxHeight: 700,
            },
          }}
        >
          {/* <DialogTitle id="alert-dialog-title">
                    {"Confirm to Deactivate"}
                    </DialogTitle> */}
          <DialogContent style={{padding: '20px 5px'}}>
            <div id='map1' style={styleMap}></div>

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

export default DashboardView;
