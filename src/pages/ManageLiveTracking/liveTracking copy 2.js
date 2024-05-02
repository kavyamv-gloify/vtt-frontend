import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import keys from '@common/keys';
import axios from "axios";

const LiveTracking = () => {
    const  styleMap  = {minWidth:  '98%', minHeight: '400px', display:'inline-block'}
	var map = null;
    var poly = [];
    var decorator;
    var line;
    var center;
    var interval = 0;
    var pp = [];
	const [open, setOpen] = useState(false);

    
    
	initialize(localStorage.getItem('mappl_access_token'),()=>{
		//Action after script has been loaded completely
			afterScriptsLoaded();
		})
		function afterScriptsLoaded()
		{
            center = new L.LatLng(28.549948, 77.268241);
            pp = [[28.58177, 77.302784], [28.581949, 77.302655], [28.582637, 77.302129], [28.583014, 77.301839],
            [28.583532, 77.301453], [28.584022, 77.301088], [28.58486, 77.30023], [28.585934, 77.298621], [28.58616, 77.298396], [28.587036, 77.297742], [28.588685, 77.296916]];
			
            map = new MapmyIndia.Map('map', {
                center: center,
                editable: true,
                zoomControl: true,
                hybrid: true
            });
    
            //draw polyline
            drawCarMarkerOnPolyline();
            
		}

        async function drawCarMarkerOnPolyline() {
            removePolyline();
            var offset = 0; //intial offset value
            var w = 14, h = 33;
            //Polyline css
            var linecss = {
                color: '#234FB6',
                weight: 3,
                opacity: 1
            };
            
            line = L.polyline(pp, linecss).addTo(map); //add polyline on map
            decorator = L.polylineDecorator(line).addTo(map); //create a polyline decorator instance.

            //offset and repeat can be each defined as a number,in pixels,or in percentage of the line's length,as a string 
            interval = window.setInterval(function () {
                decorator.setPatterns([{
                        offset: offset + '%', //Offset value for first pattern symbol,from the start point of the line. Default is 0.
                        repeat: 0, //repeat pattern at every x offset. 0 means no repeat.
                        //Symbol type.
                        symbol: L.Symbol.marker({
                            rotate: true, //move marker along the line. false value may cause the custom marker to shift away from a curved polyline. Default is false. 
                            markerOptions: {
                                icon: L.icon({
                                    iconUrl: 'https://www.mapmyindia.com/api/advanced-maps/doc/sample/images/car.png',
                                    iconAnchor: [w / 2, h / 2], //Handles the marker anchor point. For a correct anchor point [ImageWidth/2,ImageHeight/2]
                                    iconSize: [14, 33]
                                })
                            }
                        })
                    }
                ]);
                if ((offset += 0.03) > 100) //Sets offset. Smaller the value smoother the movement.
                    offset = 0;
            }, 10); //Time in ms. Increases/decreases the speed of the marker movement on decrement/increment of 1 respectively. values should not be less than 1.
            poly.push(line);
            poly.push(decorator);
            map.fitBounds(line.getBounds());
        }
        function drawArrowOnPolyline() {
            removePolyline();
            var offset = 0; //intial offset value

            //Polyline css
            var linecss = {
                color: '#fd4000',
                weight: 3,
                opacity: 1
            };
            line = L.polyline(pp, linecss).addTo(map); //add polyline on map
            decorator = L.polylineDecorator(line).addTo(map); //create a polyline decorator instance.
            //offset and repeat can be each defined as a number,in pixels,or in percentage of the line's length,as a string 
            interval = window.setInterval(function () {
                decorator.setPatterns([{
                        offset: offset + "%", //Start first marker from x offset.
                        repeat: 0, //repeat market at every x offset. 0 means no repeat.
                        symbol: L.Symbol.arrowHead({
                            pixelSize: 20, //Size of arrow image
                            headAngle: 60, //Increases/decreases arrow angel. Default is 60.
                            polygon: true, //if set to false an arrow is added else a triangle shape arrow is added. Default is true.
                            pathOptions: {
                                color: '#303030', //arrow color
                                fillOpacity: 0, //0 for no fill
                                weight: 4 // arrow line width
                            }
                        })
                    }
                ]);
                if ((offset += 0.03) > 100) //Sets offset. Smaller the value smoother the movement.
                    offset = 0;
            }, 10); //Time in ms. Increases/decreases the speed of the marker movement on decrement/increment of 1 respectively. values should not be less than 1.
            poly.push(line);
            poly.push(decorator);
            map.fitBounds(line.getBounds());
        }
        function drawRepeatedPatternOnPolyline() {
            removePolyline();
            var offset = 0; //intial offset value

            //Polyline css
            var linecss = {
                color: '#fd4000',
                weight: 3,
                opacity: 1
            };
            line = L.polyline(pp, linecss).addTo(map); //add polyline on map
            decorator = L.polylineDecorator(line).addTo(map); //create a polyline decorator instance.
            //offset and repeat can be each defined as a number,in pixels,or in percentage of the line's length,as a string 
            interval = window.setInterval(function () {
                decorator.setPatterns([{
                        offset: offset + "%", //Start first marker from x offset.
                        repeat: 100, //repeat market at every 100 offset.
                        symbol: L.Symbol.arrowHead({
                            pixelSize: 20, //Size of arrow image
                            headAngle: 60, //Increases/decreases arrow angel. Default is 60.
                            polygon: true, //if set to false an arrow is added else a triangle shape arrow is added. Default is true.
                            pathOptions: {
                                color: '#303030', //arrow color
                                fillOpacity: 0, //0 for no fill
                                weight: 4 // arrow line width
                            }
                        })
                    }
                ]);
                if ((offset += 0.03) > 100) //Sets offset. Smaller the value smoother the movement.
                    offset = 0;
            }, 10); //Time in ms. Increases/decreases the speed of the marker movement on decrement/increment of 1 respectively. values should not be less than 1.
            poly.push(line);
            poly.push(decorator);
            map.fitBounds(line.getBounds());
        }

        var removePolyline = function () {
            var polylength = poly.length;
            if (polylength > 0) {
                for (var i = 0; i < polylength; i++) {
                    if (poly[i] !== undefined) {
                        map.removeLayer(poly[i]);
                    }
                }
                poly = new Array();
                window.clearInterval(interval);
            }
        }

    return(
        <>
            <section>
                <Button id='btnMui123' className='btn' onClick={()=>{setOpen(true)}}>Live Tracking</Button>
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
                <div id="map"  style={styleMap}></div>
            </section>
        </>
    )
};

function initialize(mmiToken , loadCallback) {
    try {
        if(mmiToken)
        {
            let count = 0;

            //Insert your script seperated by comma like scriptArr = [mapSDK_url, plugins_url];
            let mapSDK_url = "https://apis.mapmyindia.com/advancedmaps/v1/" + mmiToken + "/map_load?v=1.3&plugin=polylinedecorator,path.drag";
            // let plugins_url = "https://apis.mappls.com/advancedmaps/api/" + mmiToken + "/map_sdk_plugins?v=3.0";
            let deco_url = "https://www.mapmyindia.com/api/advanced-maps/doc/sample/js/leaflet.polylineDecorator.js"

            var scriptArr = [mapSDK_url, deco_url];

             const recursivelyAddScript = (script) => {
              if(count < script.length) {
                const el = document.createElement('script')
                el.src = script[count]
                el.async = true;
                el.type = 'text/javascript';
                document.getElementsByTagName('head')[0].appendChild(el);
                count = count + 1;
                el.onload = function () {recursivelyAddScript(script)}
              } else {
                return loadCallback ();
              }
            }
              recursivelyAddScript(scriptArr);
    }
    else  ")
    }
    catch (e) {
        console.error(String(e));
    } 
   
}

export default LiveTracking;