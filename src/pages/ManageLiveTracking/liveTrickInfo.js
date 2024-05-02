import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import Api from '@api';
import './style.css';
import io from 'socket.io-client';
const host = Api?.baseUri;
const socket = io(host, {path: '/api/socket.io/'});
import {useAuthUser} from '@crema/utility/AuthHooks';
const LiveTrickInfo = () => {
  const {user} = useAuthUser();
  useEffect(() => {
    socket.emit('add-user', user?.userList?.profileId);
  }, []);
  const param = useParams();
  const styleMap = {
    minWidth: '100%',
    minHeight: '100%',
    position: 'fixed',
    top: 0,
    left: 0,
    display: 'inline-block',
  };
  useEffect(() => {
    // const id = window.atob(param?.id);
    const id = '645f30ba8d32ea0bca03d04f';
    document.querySelector('.app-bar').style.display = 'none';
    document.querySelector('.mini-toggle-sidebar').style.display = 'none';
    axios
      .get(Api.baseUri + '/user-reg/trip-route/get-trip-by-id/' + id)
      .then((res) => {
        initialize(localStorage.getItem('mappl_access_token'), () => {
          //Action after script has been loaded completely
          if (res?.data?.data) {
            afterScriptsLoaded(res?.data?.data);
          }
        });
      })
      .catch((err) => {});
  }, []);
  function afterScriptsLoaded(tripData) {
    var map, tracking_plugin, data1;
    var {stopList, ...rest} = tripData;
    var steps = [];
    var startPoint = {};
    var endPoint = {};
    stopList.forEach((stp, idx) => {
      if (idx == 0) {
        startPoint = {
          geoposition: stp.location.latitude + ',' + stp.location.longitude,
        };
      } else if (idx == stopList.length - 1) {
        endPoint = {
          geoposition: stp.location.latitude + ',' + stp.location.longitude,
        };
      } else {
        steps.push({
          geoposition: stp.location.latitude + ',' + stp.location.longitude,
        });
      }
    });
    map = new mappls.Map('map', {
      center: [stopList[0].location.latitude, stopList[0].location.latitude],
      zoom: 12,
    });
    map.addListener('load', function () {
      /*tracking plugin initialization*/
      for (let idx = 0; idx < steps.length; idx++) {
        window['marker' + idx] = new mappls.Marker({
          map: map,
          width: 60,
          height: 60,
          html: '<img id="m1" src="	https://apis.mappls.com/map_v3/mkr_start.png?1" style="width:50px; margin-left:0px;" />',
          offset: [5, 5],
          position: {
            lat: stopList[idx].location.latitude,
            lng: stopList[idx].location.longitude,
          },
          fitbounds: true,
        });
        ['marker' + idx]['id'] = 'm' + (0 + idx);
      }
      var tracking_option = {
        map: map,
        start: startPoint,
        end: endPoint,
        via: steps,
        resource: 'route_eta',
        fitBounds: true,
        ccpIconWidth: 70,
        strokeWidth: 7,
        routeColor: 'blue',
        sPopup: 'Start',
        ccpIcon: '/assets/images/car_topview_STARTED.png',
        ccpIconWidth: 60,
        cPopup: '<h3>Current Popup</h3>',
        dPopup: 'End',
      };
      tracking_plugin = mappls.tracking(tracking_option, function (data) {
        data1 = data;
      });
    });
    map.on('click', function (e) {
      socket.on('live-update', (d) => {
        let t_lng =
          d?.length && d[0]?.location?.lng ? d[0]?.location?.lng : 77.3813188;
        let t_lat =
          d?.length && d[0]?.location?.lat ? d[0]?.location?.lat : 28.6028326;
        var user = [t_lng, t_lat];
        data1.trackingCall({
          location: user,
          reRoute: true,
          heading: true,
          mapCenter: false,
          buffer: 50,
          delay: 3000,
          fitBounds: false,
          fitboundsOptions: {padding: 80},
          castepsback: function (data) {},
        });
      });
    });

    // map.on('click', function (e) {
    //     socket.on('live-update', (d) => {
    //         let t_lng = ((d?.length && d[0]?.location?.lng) ? d[0]?.location?.lng : e.lngLat.lng)
    //         let t_lat = ((d?.length && d[0]?.location?.lat) ? d[0]?.location?.lat : e.lngLat.lat)
    //         var user = [(t_lng), (t_lat)];
    //         data1.trackingCall({ location: user, reRoute: true, heading: true, mapCenter: false, buffer: 50, delay: 3000, fitBounds: false, fitboundsOptions: { padding: 80 }, castepsback: function (data) {   } });
    //     })
    // });
    // var d = 1;
    // setInterval(() => {
    //     var user = [steps[d].lng, steps[d].lat];
    //     data1.trackingCall({location: user,reRoute: true,heading:true, mapCenter:false, buffer:50,delay: 1, fitBounds:false, fitboundsOptions:{padding:80}, callback:function(data){ }});
    //     d = d + 1;
    // }, 3000);
  }
  return (
    <>
      <section>
        <div id='map' className='live-tracking' style={styleMap}></div>
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
        '/map_sdk_plugins?v=3.0&libraries=tracking';
      // let deco_url = "https://www.mapmyindia.com/api/advanced-maps/doc/sample/js/leaflet.polylineDecorator.js"
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

export default LiveTrickInfo;
