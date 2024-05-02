import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import keys from '@common/keys';
import axios from "axios";
import io from 'socket.io-client';
import Api from '@api';
const host = Api?.baseUri;
const socket = io(host, { path: '/api/socket.io/'});
import { useAuthUser } from '@crema/utility/AuthHooks';

const LiveTracking = () => {
    const { user } = useAuthUser();
    const [vehicles, setVehicles] = useState(null)
    useEffect(() => {
        socket.emit('add-user', user?.userList?.profileId);
        socket.on('live-vehicles', (data) => {
           
          if(!vehicles){
            setVehicles(data)
          }else if(vehicles.length !== data.length){
            setVehicles(data)
          }
        });
      }, []);
    const  styleMap  = {minWidth:  '98%', minHeight: '400px', display:'inline-block'};
    const [markers, setMarkers] = useState()
	var ll = [
        { lat: 28.63124010064198, lng: 77.46734619140625 },
        { lat: 28.63395214251842, lng: 77.4635696411133 },
        { lat: 28.634253476178397, lng: 77.45704650878908 },
        { lat: 28.634856140902432, lng: 77.44880676269533 },
        { lat: 28.635760131498788, lng: 77.44228363037111 },
        { lat: 28.637266765186347, lng: 77.43679046630861 },
        { lat: 28.637869412604015, lng: 77.43232727050783 },
        { lat: 28.639677334088308, lng: 77.42855072021486 },
        { lat: 28.640279967660007, lng: 77.42305755615236 },
        { lat: 28.640882597770116, lng: 77.41928100585939 },
        { lat: 28.640882597770116, lng: 77.41516113281251 },
        { lat: 28.640581283147768, lng: 77.40932464599611 },
        { lat: 28.63756808932784, lng: 77.40108489990236 },
        { lat: 28.635760131498788, lng: 77.39421844482423 },
        { lat: 28.634253476178397, lng: 77.38735198974611 },
        { lat: 28.631541442089226, lng: 77.37808227539064 },
    ];
  
    
    
	initialize(localStorage.getItem('mappl_access_token'),()=>{
		//Action after script has been loaded completely
			afterScriptsLoaded();
		})
		function afterScriptsLoaded()
		{
            var map,ct=0;
            map = new mappls.Map('map',{center:[28.63124010064198,77.46734619140625],zoom: 16, zoomControl: true, clickableIcons: false, disableDoubleClickZoom: true});
            map.on('load', function () {
                vehicles.map(vch => {
                    
                })
                var marker = new mappls.Marker({map: map,width: 60,height: 60,html: '<img id="m1" src="assets/images/car_topview.png" style="width:50px; margin-left:0px;" />',offset: [0, 5],position: { lat: 28.63124010064198, lng: 77.46734619140625 },fitbounds: false
                });marker['id']="m1"; //icon id store in marker object (Important)
                var marker1 = new mappls.Marker({map: map,width: 60,height: 60,html: '<img id="m2" src="assets/images/car_topview.png" style="width:50px; margin-left:0px;" />',offset: [0, 5],position: { lat: 28.55202964105841, lng: 77.27020605691723 },fitbounds: false
                });marker1['id']="m2"; //icon id store in marker object (Important)
                var marker2 = new mappls.Marker({map: map,width: 60,height: 60,html: '<img id="m3" src="assets/images/car_topview.png" style="width:50px; margin-left:0px;" />',offset: [0, 5],position: { lat: 28.55161498283526, lng: 77.26874693521154 },fitbounds: false
                });marker2['id']="m3"; //icon id store in marker object (Important)
                setInterval(() => {
                    var speed=2; // in meter
                     
                    smoothNavigate(marker,ll[ct],speed); 
                    smoothNavigate(marker1,{lat: 28.55405578844676, lng: 77.27057083734223},speed);
                    smoothNavigate(marker2,{lat: 28.553970973758467, lng: 77.26844652780147},speed);
                    ct = ct + 1;
                },5000);
            });
            
		}

        // Set position Smoothly
        function smoothNavigate(obj,setPos, no){
            if(no !=undefined && no){
                var coordinates = [];
                var prv=obj.getPosition();
                var next=setPos; 
                var dis = getDistanceFromLatLonInKm(prv.lat, prv.lng, next.lat, next.lng); // find distancr
                var hed = angleFromCoordinate(prv.lat, prv.lng, next.lat, next.lng);
                var n = (Math.round(dis))/no; // the number of coordinates you want
                for(var i = n - 1; i > 0; i--){
                    coordinates.push( {lat: prv.lat*i/n + next.lat*(n-i)/n,lng: prv.lng*i/n + next.lng*(n-i)/n}); 
                    if(Math.ceil(i) == 1){coordinates.push(next);}
                }            
                setTimeout(() => {
                    for (var i = 0; i < coordinates.length; i++) {
                    function invoke(x) {
                        setTimeout(() => {
                            obj.setPosition(coordinates[x]);
                            document.getElementById(obj.id).style.transform = "rotate(" + hed + "deg)";
                        }, 10 * x + 1); 
                    };
                    invoke(i);
                }
                }, 1000);
            }else{
                obj.setPosition(setPos);
            }
        }

        // Find Heading of map using Two latlng
        function angleFromCoordinate(lat1, lon1, lat2, lon2) {
            var p1 = { x: lat1, y: lon1 };
            var p2 = { x: lat2, y: lon2 };
            // angle in radians
            var angleRadians = Math.atan2(p2.y - p1.y, p2.x - p1.x);
            // angle in degrees
            var angleDeg = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
            return angleDeg;
        }
        
        // calculate Distance between 2 point
        function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
            var R = 6371; // Radius of the earth in km
            var dLat = deg2rad(lat2-lat1);  // deg2rad below
            var dLon = deg2rad(lon2-lon1); 
            var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
            var d = R * c; // Distance in km
            return d*1000;
        }
        function deg2rad(deg) {return deg * (Math.PI/180);}


    return(
        <>
            <section>
                <Button id='btnMui123' className='btn' onClick={()=>{setOpen(true)}}>Live Tracking</Button>li
                <div id="map" style={styleMap}></div>
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
            let mapSDK_url = "https://apis.mappls.com/advancedmaps/api/" + mmiToken + "/map_sdk?layer=vector&v=3.0";
            // let plugins_url = "https://apis.mappls.com/advancedmaps/api/" + mmiToken + "/map_sdk_plugins?v=3.0";
            // let deco_url = "https://www.mapmyindia.com/api/advanced-maps/doc/sample/js/leaflet.polylineDecorator.js"

            var scriptArr = [mapSDK_url];

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