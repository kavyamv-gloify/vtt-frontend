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
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

const DashboardView = () => {
  const styleMap = {
    minWidth: '98%',
    minHeight: '520px',
    display: 'inline-block',
  };
  var mapObject, picker;
  const [open, setOpen] = useState(false);
  const [pinData, setPinData] = React.useState([]);
  const [popupData, setPopupData] = React.useState([]);
  useEffect(() => {
    // setInterval(() => {
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
    // }, 10000);
  }, []);

  initialize(localStorage.getItem('mappl_access_token'), () => {
    //Action after script has been loaded completely

    afterScriptsLoaded();
  });

  function afterScriptsLoaded() {
    var div = document.getElementById('map');
    while (div.firstChild) {
      div.removeChild(div?.firstChild);
    }
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
        // popupHtml:[
        //   "<h6>ITO</h6>",
        //   "<h6>New Delhi Railway Station</h6>",
        //   "<h6>India Gate</h6>",
        //   "<h6>Noida sector 16</h6>",
        //   "<h6>Akshardham temple</h6>",
        //   "<h6>Dhaula Kuan metro station</h6>"
        // ],
        // pin: pinData,
        popupHtml: popupData,
        icon: {
          html: " <div><img src='/assets/images/route_page_icon/car_blue.png' /></div>",
          width: 30, //optional
          height: 20, //optional
        },
      };

      new window.mappls.pinMarker(markerOptions);
    });
  }
  function deviceNotAllowed() {}
  function empGeoFanceViolation() {}
  function empSignOffTimeViolation() {}

  return (
    <>
      {/* <section> */}
      {/* <Button id='btnMui123'
          className='btn'
          // onClick={() => {
          //   setOpen(true);
          // }}
        >
          Dashboard
        </Button> */}
      <div id='map' style={styleMap}></div>
      <div className='dashboardBottomPanel'>
        <div className='bottomTabBtn' onClick={deviceNotAllowed}>
          Device Not Reachable<span className='dataCount'>2</span>
        </div>
        <div className='bottomTabBtn' onClick={empGeoFanceViolation}>
          Employee Geo Fance Violation<span className='dataCount'>0</span>
        </div>
        <div className='bottomTabBtn' onClick={empSignOffTimeViolation}>
          Employee Sign Off Time Violation<span className='dataCount'>2</span>
        </div>
        <div className='bottomTabBtn' onClick={empSignOffTimeViolation}>
          Fixed Device Not Reachable<span className='dataCount'>3</span>
        </div>
        <div className='bottomTabBtn' onClick={empSignOffTimeViolation}>
          Over Speeding In Vehicle<span className='dataCount'>1</span>
        </div>
        <div className='bottomTabBtn' onClick={empSignOffTimeViolation}>
          Sos Alert From Device<span className='dataCount'>2</span>
        </div>
        <div className='bottomTabBtn' onClick={empSignOffTimeViolation}>
          Sos Alert From Fixed Device<span className='dataCount'>8</span>
        </div>
        <div className='bottomTabBtn' onClick={empSignOffTimeViolation}>
          Sos Alert From Mobile App<span className='dataCount'>0</span>
        </div>
        <div className='bottomTabBtn' onClick={empSignOffTimeViolation}>
          Tamper Alert From Fixed Device<span className='dataCount'>2</span>
        </div>
        <div className='bottomTabBtn' onClick={empSignOffTimeViolation}>
          Unsafe Zone Alert<span className='dataCount'>2</span>
        </div>
        <div className='bottomTabBtn' onClick={empSignOffTimeViolation}>
          Vechile Stopped<span className='dataCount'>0</span>
        </div>
        <div className='bottomTabBtn' onClick={empSignOffTimeViolation}>
          Women Travelling Alone<span className='dataCount'>2</span>
        </div>
      </div>
      {/* </section> */}
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
