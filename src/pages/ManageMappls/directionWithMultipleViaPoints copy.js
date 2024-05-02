import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import keys from '@common/keys';

const DirectionWithMultipleViaPoints = () => {
    const  styleMap  = {minWidth:  '98%', minHeight: '400px', display:'inline-block'}
	var mapObject, direction_plugin;	
	const [open, setOpen] = useState(false);
    const [userImg, setUserImg] = useState(['https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80','https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80'])
    
	initialize(keys.ACCESS_TOKEN.toString(),()=>{
		//Action after script has been loaded completely
			afterScriptsLoaded();
		})
		function afterScriptsLoaded()
		{
			mapObject =  window.mappls.Map('map', {
                center: [28.09, 78.3],
                zoom: 5,
            });
			mapObject.addListener('load',function(){
                /*direction plugin initialization*/
                var direction_option = {
                    map: mapObject,
                    divWidth:'350px',
                    isDraggable:false,
                    start: {label: 'Noida sector 16', geoposition: "28.578614,77.317483" },
                    end: {label: 'India Gate', geoposition: "28.612964,77.229463" },
                    Profile:['driving','biking','trucking','walking'],
                    via:[{label:'<div><h1> ITO </h1><h2>Test</h2></div>',geoposition:"28.6308,77.2506"},{label:'New Delhi Railway Station',geoposition:"28.6392,77.2182"}],
                    start_icon:{
                        html: ` <div><span><img src = '/assets/images/route_page_icon/escort.png' /><a href="https://google.com" target="_blank">StartPoint:Noida16</a></span><img src='https://maps.mappls.com/images/from.png' /></div>`,
                        width: 30, //optional
                        height: 60 //optional
                    },
                    end_icon:{
                        html: " <div><span><img src = '/assets/images/route_page_icon/escort.png' /><p>EndPoint:IndiaGate</p></span><img src='https://maps.mappls.com/images/to.png' /></div>",
                        width: 30, //optional
                        height: 40 //optional
                    },
                    via_icon:{
                        html: "<div><span><img class='user-image' src='https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80' /><p>ViaPoint</p></span><img src='https://maps.mappls.com/images/2.png' /></div>",
                        width: 40,
                        height: 60
                    }
                }
                // var direction_option = {
                //     map: mapObject,
                //     divWidth:'350px',
                //     isDraggable:true,
		        //     collapse:true,
                //     start: {label: 'Noida sector 16', geoposition: "28.578614,77.317483" },
                //     end: {label: 'India Gate', geoposition: "28.612964,77.229463" },
                //     Profile:['driving','biking','trucking','walking']
                // }
                 

                setTimeout(function() {
                    new window.mappls.direction(direction_option,function(data) {
                        direction_plugin=data;
                         
                        direction_option?.via.forEach((val, idx)=>{
                            let mrks = document.getElementById('cst_mid'+(Number(idx)+1))
                             +1));
                            mrks.innerHTML = `<div><span><img class='user-image' src='${userImg[idx]}' /><p>ViaPoint</p></span><img src='https://maps.mappls.com/images/2.png' /></div>`
                        })
                    });
                     
                }, 3000);                
			
			});
            
		}

    return(
        <>
            <section>
                <Button id='btnMui123' className='btn' onClick={()=>{setOpen(true)}}>Open Direction With Multiple viaPoints</Button>
                <Dialog
                    open={open}
                    onClose={()=>{setOpen(false)}}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="false"
                    PaperProps={{
                        sx: {
                          width: "80%",
                          maxHeight: 500,
                          border: "2px solid #eee",
                          borderRadius: "8px"
                        }
                      }}
                >
                    <DialogTitle id="alert-dialog-title" style={{ textAlign:'right'}}>
                    <IconButton onClick={()=>{setOpen(false)}}>
                        <CloseIcon />
                    </IconButton>
                    </DialogTitle>
                    <DialogContent style={{padding: "0px 5px 20px 5px"}} >
                    <div id="map"  style={styleMap}></div>

                    {/* <DialogContentText id="alert-dialog-description">
                        Are you sure, You want to deactivate the vendor?
                    </DialogContentText> */}
                    </DialogContent>
                </Dialog>
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
            let plugins_url = "https://apis.mappls.com/advancedmaps/api/" + mmiToken + "/map_sdk_plugins?v=3.0";

            var scriptArr = [mapSDK_url, plugins_url];

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

export default DirectionWithMultipleViaPoints;