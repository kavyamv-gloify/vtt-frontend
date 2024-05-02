import React, { useState, useEffect } from 'react';
import axios from "axios";
import _ from 'lodash';
import io from 'socket.io-client';
import Api from '@api';
const host = Api?.baseUri;
const socket = io(host, { path: '/api/socket.io/' });
import { useAuthUser } from '@crema/utility/AuthHooks';
import './style.css';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import SidePannel from './sidePannel';
import BottomPannel from './BottomPannel';

const LiveTracking = () => {
    const { user } = useAuthUser();
    const { type } = useParams()
    const [filterType, setFilterType] = useState('')
    const [searchData, setsearchData] = useState({})
    const [currFilter, setCurrFilter] = useState(0)
    const [zoomValue, setZoomValue] = useState(10)
    const [siteOfficeLocation, setSiteOfficeLocation] = useState({})
    const [trips, setTrips] = useState({ female: 0 })
    const navigate = useNavigate();
    useEffect(() => {
        setZoomValue(zoomValue);
    }, [zoomValue])
    useEffect(() => {
        if (type == "full-window" && window) {
            document.querySelector('.app-bar').style.display = 'none';
            document.querySelector('.mini-toggle-sidebar').style.display = 'none';
        }
        if (type == "default" && window) {
            document.querySelector('.app-bar').style.display = '';
            // document.querySelector('.mini-toggle-sidebar').style.display = '';
        }
    }, [type])
    useEffect(() => {
        socket.emit('add-user', user?.userList?.profileId);
        axios.get(`${Api.siteOffice.list}/corporate?page=0&size=1000&officeName=null`).then(res => {
            setSiteOfficeLocation({ ...res.data.data.body['SiteOffice List'][0].location, isOfc: true })
        })
        // socket.on('live-vehicles', (data) => {
        //    
        //   if(!vehicles){
        //     setVehicles(data)
        //   }
        // });
        // socket.on('live-update', (data) => {
        //        
        // })
    }, []);
    const styleMap = { minWidth: '100%', position: 'fixed', left: 0, top: 0, height: '100%', minHeight: '400px', display: 'inline-block' };

    const vehicleAllData = async (data) => {
        let driverData = await axios.get(Api?.driver?.list + '/' + data.driverId)
        let tripData = await axios.get(Api?.trip?.getTripById + '/' + data.tripId)
        let vehicleData = await axios.get(Api?.vehicle?.list + '/' + data.vehicleId)
        let vendorData = await axios.get(Api?.vendor?.list + '/' + data.vendorId)
        let ndata = { driverData: driverData.data.data, tripData: tripData.data.data, vehicleData: vehicleData.data.data, vendorData: vendorData.data.data };
        // setMData(ndata);
        return ndata;
    }

    // const opendetail = (cont, disp) => {
    //     document.getElementById(cont).style.display = disp;
    // }
    useEffect(() => {
        if (_.isEmpty(siteOfficeLocation)) return;
        initialize(localStorage.getItem('mappl_access_token'), () => {
            //Action after script has been loaded completely
            afterScriptsLoaded();
        })
        let tem_emp_data = [];
        let tem_vehicle_data = [];
        let tem_driver_data = [];
        let tem_shift_data = [];
        let tem_trip_data = [];
        let tem_vendor_data = [];
        let Fem_Count = 0
        let GEOFENCE_VIOLATION = []; // Need apis for getting Geofence Violation Trips
        let GPS_SIGNAL_LOST = []; // Need apis for getting GPS Signal Lost Trips
        let OVER_SPEEDING = []; // Need apis for getting Over Speeding Trips
        let ESCORT_TRIP = []; // Currently not in scope
        let NON_COMPLIANT_VEHICLE = []; // pending from api
        let SPECIAL_EMP_TRIP = []; // pending from api
        let SOS_ALERT = []; // Fully done
        let ADHOC_TRIP = [];

        // Need to handle from frontend
        let FEMALE_TRAVELING = []; // Fully done
        let VEHICLE_STOPPAGE_MORE_THAN_5_MINS = [];
        let FIRST_PICKUP_DELAYED = []; // Fully done
        let EXPECTED_FIRST_PICKUP_DELAYED = [];
        let EXPECTED_DELAYED_DROP = [];
        let DELAYED_BOARDING_DEBOARDING = [];
        let VEHICLE_NEAR_OFC_2KM = [];

        function afterScriptsLoaded() {
            const div = document.querySelector('div#map')
            if (div?.firstChild) { while (div.firstChild) div.firstChild.remove() }
            var map, markers = {}, markerData = {}, ct = 0, speed = 2;
            window.opendetail = function (cont, disp, d, tdiv, t_lng, t_lat) {
                // t_lng, t_lat
                 
                map.setCenter([t_lng, t_lat]);
                // map.flyTo() //ANIMATED CENTRALIZE




                // if (t_lng && t_lat && ((siteOfficeLocation?.latitude != t_lat) || (siteOfficeLocation?.longitude != t_lng))) {
                //     setSiteOfficeLocation({ ...siteOfficeLocation, lat: t_lat, lng: t_lng, isOfc: false });
                // }
                document.getElementById(cont).style.display = disp;
                //document.getElementById(tdiv).style.zIndex = '1';
                document.getElementById(cont).parentNode.style.zIndex = '1';
                for (let i = 0; i < d; i++) {
                    if (cont != 'm-detail-' + (i + 1)) {
                        document.getElementById('m-detail-' + (i + 1)).style.display = 'none';
                        document.getElementById('m-detail-' + (i + 1)).parentNode.style.zIndex = '0';
                        // document.getElementById('cst_mid' + (i+1)).style.zIndex = '0';
                    }
                }
            }
            window.redirectToTrip = function (u) {
                navigate('/live-tracking-info/' + u);
            }// HERE IS ORIGIN
            map = new mappls.Map('map', { center: [parseFloat((siteOfficeLocation.lat || siteOfficeLocation.latitude)), parseFloat((siteOfficeLocation.lng || siteOfficeLocation.longitude))], zoom: 10, zoomControl: true, clickableIcons: false, disableDoubleClickZoom: true });

            map.on('load', function () {
                var f_count = 0;
                setTimeout(async () => {
                    socket.on('live-vehicles', (data) => {
                         
                        data.map(async (vch, i) => {
                            let driverData = await axios.get(Api.baseUri + '/user-reg/driver-reg/' + vch.driverId)
                            markers = {
                                ...markers,
                                // [0]:new mappls.Marker({
                                //     map: map, width: 60, height: 60, html: `<img id=${"m-img-" + (1 + i)} src="/assets/images/car_topview_.png" style="width:50px; margin-left:0px;"/>`, offset: [0, 5], position: [parseFloat(siteOfficeLocation.latitude), parseFloat(siteOfficeLocation.longitude)], fitbounds: false
                                // }),
                                [vch.vehicleId]: new mappls.Marker({
                                    map: map, width: 60, height: 60, html: `<img id=${"m-img-" + (1 + i)} src="/assets/images/car_topview_.png" style="width:50px; margin-left:0px;"/>`, offset: [0, 5], position: vch.location, fitbounds: false
                                })
                            }
                            markers[vch.vehicleId]['id'] = "m" + (1 + i);
                        })
                         

                    });

                    // socket.on('live-tracking-activities', (d) => {
                    //    if(d.type == 'GEOFENCE_VIOLATION') {
                    //     // call api for getting all GEOFENCE_VIOLATION and set tripids in GEOFENCE_VIOLATION variable
                    //     GEOFENCE_VIOLATION = res?.data?.data.tripIds
                    //    }
                    // })

                    // socket.on('gps-signal-lost', (d) => {
                    //    if(d.type == 'GPS_SIGNAL_LOST') {
                    //     // call api for getting all GPS_SIGNAL_LOST and set tripids in GPS_SIGNAL_LOST variable
                    //     GPS_SIGNAL_LOST = res?.data?.data.tripIds
                    //    }
                    // })

                    // socket.on('over-speeding', (d) => {
                    //    if(d.type == 'OVER_SPEEDING') {
                    //     // call api for getting all OVER_SPEEDING and set tripids in OVER_SPEEDING variable
                    //     OVER_SPEEDING = res?.data?.data.tripIds
                    //    }
                    // })

                    const getSOSTrip = async () => {
                        axios.get(Api?.baseUri + '/user-reg/trip-route/get-all-sso-passenger').then(res => {
                            let t1 = []
                            res?.data?.data?.map(el => {
                                t1.push(el.tripId);
                            })
                            SOS_ALERT = t1;
                        }).catch(err => { })
                    }

                    getSOSTrip();
                    socket.on('sos-trigger', async (data) => {
                        getSOSTrip();
                    });
                    socket.on('live-update', (t_data) => {
                         
                         
                        Fem_Count = 9;

                        const getTripDetailsMulti = async (tr_ids) => {
                            //  
                            // setTrips({ female: 9 });

                            axios.get(Api?.baseUri + '/user-reg/trip-route/get-trip-by-id?tripId=' + tr_ids?.join(',')).then(res => {
                                let fem_trip = [];
                                let first_point_delay_trip = [];
                                let filterd_Match_Trips = [];
                                res?.data?.data?.map((re, ind) => {
                                    if (ind == 0) f_count = 0;
                                    if (searchData?.vehicleCode?.length) {
                                        searchData?.vehicleCode?.map(em => {
                                            if (em?.value == re?.vehicleId) {
                                                if (!filterd_Match_Trips?.includes(re?.id)) filterd_Match_Trips.push(re.id);
                                            }
                                        })
                                    }
                                    if (searchData?.driverID?.length) {
                                        searchData?.driverID?.map(em => {
                                            if (em?.value == re?.driverId) {
                                                if (!filterd_Match_Trips?.includes(re?.id)) filterd_Match_Trips.push(re.id);
                                            }
                                        })
                                    }
                                    if (searchData?.shiftId?.length) {
                                        searchData?.shiftId?.map(eb => {
                                            if (eb.value == re?.shiftId) {
                                                if (!filterd_Match_Trips?.includes(re?.id)) filterd_Match_Trips.push(re.id);
                                            }
                                        })
                                    }

                                    if (searchData?.vendorId?.length) {
                                        searchData?.vendorId?.map(eb => {
                                            if (eb.value == re?.vendorId) {
                                                if (!filterd_Match_Trips?.includes(re?.id)) filterd_Match_Trips.push(re.id);
                                            }
                                        })
                                    }

                                    if (searchData?.tripId?.length) {
                                        searchData?.tripId?.map(eb => {
                                            if (eb.value == re?.id) {
                                                if (!filterd_Match_Trips?.includes(re?.id)) filterd_Match_Trips.push(re.id);
                                            }
                                        })
                                    }
                                    tem_vehicle_data.push({ title: re?.vehicleNo, value: re?.vehicleId });
                                    tem_driver_data.push({ title: re?.driverName, value: re?.driverId });
                                    let tem_bool = false;
                                    re?.stopList?.map((r, _indx) => {
                                        r?.onBoardPassengers?.map((pas, _indx2) => {
                                            if (pas?.gender == 'Female') tem_bool = true;
                                            if (searchData?.empCode?.length) {
                                                searchData?.empCode?.map(eb => {
                                                    if (eb.value == pas?.empId) {
                                                        if (!filterd_Match_Trips?.includes(re?.id)) filterd_Match_Trips.push(re.id);
                                                    }
                                                })
                                            }
                                            if ((pas?.gender?.toUpperCase() == 'FEMALE') && !fem_trip?.includes(re?.id)) {
                                                fem_trip.push(re.id);
                                            }
                                            // moment('2010-10-20 00:00:00').isBefore('2010-10-21'); // true
                                            if ((_indx == 0) && (_indx2 == 0) && (pas?.tripType == "UPTRIP") && (moment(pas?.pickUpDateTimeStr).isBefore(pas?.actualPickUpDateTimeStr))) {
                                                if (!first_point_delay_trip?.includes(re?.id)) first_point_delay_trip.push(re.id);
                                            }
                                            if ((_indx == 0) && (_indx2 == 0) && (pas?.tripType == "DOWNTRIP") && (moment(pas?.dropDateTimeStr).isBefore(pas?.actualDropDateTimeStr))) {
                                                if (!first_point_delay_trip?.includes(re?.id)) first_point_delay_trip.push(re.id);
                                            }

                                            if (tem_vendor_data.findIndex(x => x.value === re.vendorId) < 0) {
                                                tem_vendor_data.push({ title: re?.vendorName, value: re.vendorId });
                                            }
                                            if (tem_trip_data.findIndex(x => x.value === re.id) < 0) {
                                                tem_trip_data.push({ title: re?.tripCode + ' - ' + ((re?.tripCategory == "REGTRIP") ? "Regular" : 'Adhoc'), value: re.id });
                                            }
                                            if (tem_shift_data.findIndex(x => x.value === re.shiftId) < 0) {
                                                tem_shift_data.push({ title: re?.shiftName, value: re.shiftId });
                                            }
                                            if (tem_emp_data.findIndex(x => x.value === pas.empId) < 0) {
                                                tem_emp_data.push({ title: pas?.empCode + ' - ' + pas?.name, value: pas.empId }); // + ' - ' + t_elem?.emailId
                                            }

                                        })
                                    })
                                    if (tem_bool == true) f_count = f_count + 1;
                                })
                                FEMALE_TRAVELING = fem_trip;
                                FIRST_PICKUP_DELAYED = first_point_delay_trip;
                                //  
                                if (filterd_Match_Trips?.length) {
                                    let tempo = [];
                                    t_data?.map(db => {
                                        if (filterd_Match_Trips?.includes(db.tripId)) {
                                            tempo.push(db);
                                        }
                                    })
                                    renderMap(tempo);
                                }
                                else {
                                    renderMap(t_data);
                                }
                                //  
                                // if((trips?.female != f_count) || ((trips?.tripIds?.length) != (t_arr?.length))) setTrips({ tripIds: t_arr ,female: f_count});
                                // if(f_count && (trips?.female != f_count)) setTrips({female: f_count});
                                return;
                            }).catch(err => {
                                return;
                            })
                            // return;
                        }

                        let all_trip_ids = []
                        t_data.map(async (vch, i) => {
                            if (vch?.tripId) all_trip_ids.push(vch?.tripId);
                            if ((i + 1 == t_data?.length)) { await getTripDetailsMulti(all_trip_ids); }
                        })
                        // SITEOFFICE ICON
                        // setValCount([GEOFENCE_VIOLATION?.length, GPS_SIGNAL_LOST?.length, OVER_SPEEDING?.length, SOS_ALERT?.length, FEMALE_TRAVELING?.length])
                        const renderMap = async (data) => {
                            let markerSiteOfficeHtml = `<div><img src=${"/assets/images/siteoffice.png"}></div>` //siteOfficeLocation?.isOfc ?  : ''
                            markers = {
                                ...markers,
                                'siteOffice': new mappls.Marker({
                                    map: map, width: 60, height: 60, html: markerSiteOfficeHtml, offset: [0, 5], position: { lat: parseFloat(siteOfficeLocation.latitude), lng: parseFloat(siteOfficeLocation.longitude) }, fitbounds: false
                                })
                            }
                            markers['siteOffice']['id'] = "m0";
                            data.map(async (vch, i) => {
                                if (!(vch.vehicleId in markers)) {
                                    let { driverData, vehicleData, tripData, vendorData } = await vehicleAllData(vch);
                                    // markerData = {
                                    //     ...markerData,
                                    //     [vch.vehicleId]: await vehicleAllData(vch)
                                    // }
                                    if ((filterType == "GEOFENCE_VIOLATION") && !GEOFENCE_VIOLATION.includes(tripData?.id)) { return; }
                                    if ((filterType == "GPS_SIGNAL_LOST") && !GPS_SIGNAL_LOST.includes(tripData?.id)) { return; }
                                    if ((filterType == "OVER_SPEEDING") && !OVER_SPEEDING.includes(tripData?.id)) { return; }
                                    if ((filterType == "SOS_ALERT") && !SOS_ALERT.includes(tripData?.id)) { return; }
                                    if ((filterType == "FEMALE_TRAVELING") && !FEMALE_TRAVELING.includes(tripData?.id)) { return; }
                                    if ((filterType == "ESCORT_TRIP") && !ESCORT_TRIP.includes(tripData?.id)) { return; }
                                    if ((filterType == "VEHICLE_STOPPAGE_MORE_THAN_5_MINS") && !VEHICLE_STOPPAGE_MORE_THAN_5_MINS.includes(tripData?.id)) { return; }
                                    if ((filterType == "FIRST_PICKUP_DELAYED") && !FIRST_PICKUP_DELAYED.includes(tripData?.id)) { return; }
                                    if ((filterType == "EXPECTED_FIRST_PICKUP_DELAYED") && !EXPECTED_FIRST_PICKUP_DELAYED.includes(tripData?.id)) { return; }
                                    if ((filterType == "EXPECTED_DELAYED_DROP") && !EXPECTED_DELAYED_DROP.includes(tripData?.id)) { return; }
                                    if ((filterType == "DELAYED_BOARDING_DEBOARDING") && !DELAYED_BOARDING_DEBOARDING.includes(tripData?.id)) { return; }
                                    if ((filterType == "NON_COMPLIANT_VEHICLE") && !NON_COMPLIANT_VEHICLE.includes(tripData?.id)) { return; }
                                    if ((filterType == "ADHOC_TRIP") && !ADHOC_TRIP.includes(tripData?.id)) { return; }
                                    if ((filterType == "SPECIAL_EMP_TRIP") && !SPECIAL_EMP_TRIP.includes(tripData?.id)) { return; }
                                    if ((filterType == "VEHICLE_NEAR_OFC_2KM") && !VEHICLE_NEAR_OFC_2KM.includes(tripData?.id)) { return; }

                                    let markerHtml = `
                                    <img id=${'m-img-' + (1 + i)} src=${(FEMALE_TRAVELING?.includes(tripData?.id)) ? '/assets/images/female_car.svg' : (vch.tripStatus == 'COMPLETED') ? "/assets/images/available_car.svg" : "/assets/images/male_car.svg"} style="width:50px; margin-left:0px;"  onclick="opendetail('${'m-detail-' + (1 + i)}', 'block', '${data?.length}', '${'cst_mid' + (1 + i)}', '${vch?.location?.lng}', '${vch?.location?.lat}')"/>
                                    <div class="lt-vch-detail" id=${'m-detail-' + (1 + i)} >
                                        <div>
                                            <h3 class='live-tracking-marker-header'>
                                                <div class='span1'>${vehicleData.vehicleNumberPlate}</div>
                                                <div style='font-size: 12px; font-weight: 400; color: #9b9b9b'>${vehicleData.vehicleBrand + ' - ' + vehicleData.modelNo}</div>
                                            </h3>
                                            <div  style="position: absolute; top: 5px; right: 10px; font-weight: 600" onclick="opendetail('${'m-detail-' + (1 + i)}', 'none', '${data?.length}', '${'cst_mid' + (1 + i)}', '', '')"> 
                                                ${'X'}
                                            </div>
                                            <h4 class='live-tracking-marker-driver-sec'><img src=${(driverData.photo ? Api?.imgUrl + driverData.photo : "/assets/images/placeholder.jpg")}><span>${driverData.firstName + ' ' + driverData.lastName}<br><span style="font-size: 10px; color: #9b9b9b">${driverData.mobileNo || 'NA'}</span></span></h4>
                                          ${vch.tripStatus == 'COMPLETED' ? `<h4 class='live-tracking-marker-lower-sec'><img src=${"/assets/images/" + (tripData.tripType == "UPTRIP" ? "login_icon.png" : "logout_icon.png")}><span  onclick="redirectToTrip('${window.btoa(tripData?.id)}')">${tripData.tripCode} </span></h4>` : ''}
                                            <h4 class='live-tracking-marker-lower-sec'><img src=${"/assets/images/Escort3.png"}><span>${'NA'}</span></h4>
                                            <h4 class='live-tracking-marker-lower-sec'><img src=${"/assets/images/group_people.png"}><span>${tripData.stopList.length}</span></h4>
                                            <h4 class='live-tracking-marker-lower-sec'><img src=${"/assets/images/group_people.png"}><span>${tripData.stopList.length}</span></h4>
                                        </div>
                                    </div>
                                    `
                                    markers = {
                                        ...markers,
                                        [vch.vehicleId]: new mappls.Marker({
                                            map: map, width: 60, height: 60, html: markerHtml, offset: [0, 5], position: vch.location, fitbounds: false
                                        })
                                    }
                                    markers[vch.vehicleId]['id'] = "m" + (1 + i);
                                    if (siteOfficeLocation?.lat && (siteOfficeLocation?.lat == vch?.location?.lat) && (siteOfficeLocation?.lng == vch?.location?.lng)) {
                                        // document.getElementById('m-detail-' + (1 + i)).style.display = 'block';
                                        opendetail('m-detail-' + (1 + i), 'block', data?.length, 'cst_mid' + (1 + i), '', '')
                                    }
                                }
                            })

                            let bounds = '';
                            data?.forEach(lvd => {
                                bounds = map.LatLngBounds();
                                bounds.extend(markers[lvd.vehicleId]);
                                smoothNavigate(markers[lvd.vehicleId], lvd.location, speed);
                            })
                            map.fitBounds(bounds); // [[lng,lat],[lng, lat]] 
                        }
                    });

                });
                // var marker = new mappls.Marker({map: map,width: 60,height: 60,html: '<img id="m1" src="/assets/images/car_topview.png" style="width:50px; margin-left:0px;" />',offset: [0, 5],position: { lat: 28.63124010064198, lng: 77.46734619140625 },fitbounds: false
                // });marker['id']="m1"; //icon id store in marker object (Important)
                // var marker1 = new mappls.Marker({map: map,width: 60,height: 60,html: '<img id="m2" src="/assets/images/car_topview.png" style="width:50px; margin-left:0px;" />',offset: [0, 5],position: { lat: 28.55202964105841, lng: 77.27020605691723 },fitbounds: false
                // });marker1['id']="m2"; //icon id store in marker object (Important)
                // var marker2 = new mappls.Marker({map: map,width: 60,height: 60,html: '<img id="m3" src="/assets/images/car_topview.png" style="width:50px; margin-left:0px;" />',offset: [0, 5],position: { lat: 28.55161498283526, lng: 77.26874693521154 },fitbounds: false
                // });marker2['id']="m3"; //icon id store in marker object (Important)

                // setInterval(() => {
                //     var speed=2; // in meter
                //     smoothNavigate(marker,ll[ct],speed); 
                //     smoothNavigate(marker1,{lat: 28.55405578844676, lng: 77.27057083734223},speed);
                //     smoothNavigate(marker2,{lat: 28.553970973758467, lng: 77.26844652780147},speed);
                //     ct = ct + 1;
                // },5000);

            });
        }
    }, [siteOfficeLocation])
    // Set position Smoothly
    function smoothNavigate(obj, setPos, no) {
        if (no != undefined && no) {
            var coordinates = [];
            var prv = obj.getPosition();
            var next = setPos;
            var dis = getDistanceFromLatLonInKm(prv.lat, prv.lng, next.lat, next.lng); // find distancr
            var hed = angleFromCoordinate(prv.lat, prv.lng, next.lat, next.lng);
            var n = (Math.round(dis)) / no; // the number of coordinates you want
            for (var i = n - 1; i > 0; i--) {
                coordinates.push({ lat: prv.lat * i / n + next.lat * (n - i) / n, lng: prv.lng * i / n + next.lng * (n - i) / n });
                if (Math.ceil(i) == 1) { coordinates.push(next); }
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
        } else {
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
    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2 - lat1);  // deg2rad below
        var dLon = deg2rad(lon2 - lon1);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d * 1000;
    }
    function deg2rad(deg) { return deg * (Math.PI / 180); }

    return (
        <>
            <section style={{ height: '100%' }}>
                {/* <SidePannel
                    tem_emp_data={tem_emp_data}
                    tem_vendor_data={tem_vendor_data}
                    tem_vehicle_data={tem_vehicle_data}
                    tem_trip_data={tem_trip_data}
                    tem_shift_data={tem_shift_data}
                    tem_driver_data={tem_driver_data}
                    setsearchData={setsearchData}
                    setFilterType={setFilterType} /> */}
                <div id="map" className='live-tracking' style={styleMap}></div>
                {/* <BottomPannel
                    type={type}
                    currFilter={currFilter}
                    filterType={filterType}
                    Fem_Count={Fem_Count}
                    setFilterType={setFilterType}
                /> */}
            </section>
        </>
    )
};

function initialize(mmiToken, loadCallback) {
    try {
        if (mmiToken) {
            let count = 0;
            //Insert your script seperated by comma like scriptArr = [mapSDK_url, plugins_url];
            let mapSDK_url = "https://apis.mappls.com/advancedmaps/api/" + mmiToken + "/map_sdk?layer=vector&v=3.0";
            // let plugins_url = "https://apis.mappls.com/advancedmaps/api/" + mmiToken + "/map_sdk_plugins?v=3.0";
            // let deco_url = "https://www.mapmyindia.com/api/advanced-maps/doc/sample/js/leaflet.polylineDecorator.js"

            var scriptArr = [mapSDK_url];
            const recursivelyAddScript = (script) => {
                if (count < script.length) {
                    const el = document.createElement('script')
                    el.src = script[count]
                    el.async = true;
                    el.type = 'text/javascript';
                    document.getElementsByTagName('head')[0].appendChild(el);
                    count = count + 1;
                    el.onload = function () { recursivelyAddScript(script) }
                } else {
                    return loadCallback();
                }
            }
            recursivelyAddScript(scriptArr);
        }
        else  {}
    }
    catch (e) {
        console.error(String(e));
    }
}

export default LiveTracking;