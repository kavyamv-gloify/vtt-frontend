import React, {Component, useEffect, useState} from 'react';

function Map(props) {
  const styleMap = {
    minWidth: '98%',
    minHeight: '400px',
    display: 'inline-block',
  };
  var mapObject, picker;
  initialize('5fe9b427-6795-447b-a7f3-d4d2d04556e2', () => {
    //Action after script has been loaded completely
    setTimeout(function () {
      afterScriptsLoaded();
    }, 1000);
  });

  function afterScriptsLoaded() {
    mapObject = window.mappls.Map('map', {
      center: [28.62, 77.09],
      zoom: 5,
    });

    mapObject.addListener('load', function () {
      /*Place Picker plugin initialization*/
      var options = {
        map: mapObject,
        header: true,
        closeBtn: true,
      };
      new window.mappls.placePicker(options, function (data) {
        picker = data;
        var pdata = picker.getLocation();
      });
    });
    mapObject.addListener('dragend', function () {
      /*Place Picker plugin initialization*/
      var options = {
        map: mapObject,
        header: true,
        closeBtn: true,
      };
      new window.mappls.placePicker(options, function (data) {
        picker = data;
        var pdata = picker.getLocation();
      });
    });
    // mapObject.addListener('move', function () {
    // 	var options = {
    // 		map: mapObject,
    // 		header: true,
    // 		closeBtn: true,
    // 	};
    // 	new window.mappls.placePicker(options, function (data) {
    // 		picker = data;
    // 		var pdata = picker.getLocation();
    //
    //
    // 	});
    // });
  }

  return (
    <>
      <div id='map' style={styleMap}></div>
    </>
  );
}

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
        } else return loadCallback();
      };
      recursivelyAddScript(scriptArr);
    }
  } catch (e) {
    console.error(String(e));
  }
}

export default Map;
