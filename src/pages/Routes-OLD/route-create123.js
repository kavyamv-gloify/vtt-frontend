import { mappls } from 'mappls-web-maps';
function App() {
  const styleMap = { width: '99%', height: '99vh', display: 'inline-block' }
  // const mapProps = { center: [28.6330, 77.2194], traffic: false, zoom: 8, geolocation: false, clickableIcons: false }
  
  const mapProps = { 
    center:  [28.544,77.5454], // the coordinates as [lat, lon]
                draggable:  true, // toggle draggable map
                zoom:  5, //the initial Map `zoom` level.
                minZoom:  8, //  minimum zoom level which will be displayed on the map
                maxZoom:  15, //  maximum zoom level which will be displayed on the map
                // backgroundColor:  '#fff', // used for the background of the Map div.
                // heading:  100, // The `heading` for aerial imagery in degrees
                // traffic:  true, // To show traffic control on map.
                // geolocation:  true, // to display the icon for current location
                // // Controls
                // disableDoubleClickZoom:  true, // enables/disables zoom and center on double click.
                // fullscreenControl:  true, // It shows the icon of the full screen on the map
                // scrollWheel:  true, // If false, disables zooming on the map using a mouse scroll
                // scrollZoom:  true, // if `false` scroll to zoom interaction is disabled.
                // rotateControl:  true, // enable/disable of the map.
                // scaleControl:  true, // The initial enabled/disabled state of the Scale control.
                // zoomControl:  true,     // The enabled/disabled Zoom control at a fixed position
                // zoomControlOptions: 
                //     {
                //         position:mappls.ControlPosition.RIGHT_CENTER
                //     },
                //Possible Values : TOP_CENTER, `TOP_LEFT`, `TOP_RIGHT`, `LEFT_TOP`, `RIGHT_TOP`, `LEFT_CENTER`, `RIGHT_CENTER`, `LEFT_BOTTOM`, `RIGHT_BOTTOM`, `BOTTOM_CENTER`, `BOTTOM_LEFT`, `BOTTOM_RIGHT``
                // clickableIcons:  true,  //to make the icons clickable
                // indoor:  true, // To show indoor floor plans in MapmyIndia Vector SDK.
                // indoor_position:  'bottom-left',
                //Possible Values : TOP_CENTER, `TOP_LEFT`, `TOP_RIGHT`, `LEFT_TOP`, `RIGHT_TOP`, `LEFT_CENTER`, `RIGHT_CENTER`, `LEFT_BOTTOM`, `RIGHT_BOTTOM`, `BOTTOM_CENTER`, `BOTTOM_LEFT`, `BOTTOM_RIGHT``
                tilt:  30,
   }
  var mapObject;
  var circleObject;
  var markerObject;
  var mapplsClassObject = new mappls();

  mapplsClassObject.initialize("5bec826e-dc77-4398-b142-d976bd1f4ce8", () => {
    mapObject = mapplsClassObject.Map({ id: "map", properties: mapProps });

    //load map layers/components after map load, inside this callback (Recommended)
    mapObject.on("load", () => {
      // Activites after mapload
    })
    // markerObject = mapplsClassObject.marker({
    //   map:  mapObject,
    //   position:{lat:28.5512908, lng:77.26809282},
    //   });
//       markerObject.setPosition({lat:28.454,lng:77.5454});
// markerObject.setIcon("https://apis.mapmyindia.com/map_v3/1.png");
// markerObject.addListener('load', function () {  });
mapplsClassObject.map(
  { 
      id:  "map", 
      key:'token/rest-key',
      properties: 
      {
          center: [28.6330, 77.2194]
      }
  },
  // Callback Method : Load all other components inside this it initilizes after map load
  // it also returns map object
(data)=>{ mapObject = data }
);
    circleObject = mapplsClassObject.Circle({
      center: { "lat": "28.552097968260668", "lng": "77.2701604561851" },
      map: mapObject,
      radius: 5000,
      strokeColor: "red",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "red",
      fillOpacity: 0.3,
      text: 'eTravelmate',
      'text-color': 'yellow',
      'text-size': '30px'
    });
    circleObject.addListener('load', function () {  });
  });

  return (
    <div>
      <div id="map" style={styleMap}></div>
    </div>
  );
}
export default App;