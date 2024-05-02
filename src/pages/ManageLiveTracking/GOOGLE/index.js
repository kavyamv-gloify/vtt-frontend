import React, {useEffect, useState} from 'react';
import './style.css';
import WrappedMap from './info';
import useFetch from './useFetch';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import axios from 'axios';
import {useAuthUser} from '@crema/utility/AuthHooks';
import io from 'socket.io-client';
import Api from '@api';
import {useParams} from 'react-router-dom';
import {GoogleMapsAPI} from '@smart-form/GoogleMap/g-config';
import moment from 'moment';
import {Button} from '@mui/material';
const host = Api?.baseUri;
const socket = io(host, {path: '/api/socket.io/'});

function App() {
  const {user} = useAuthUser();
  const [stops, setStops] = useState({
    total: 0,
    data: [],
  });
  const {id} = useParams();
  const [vehicleCordinate, setVehicleCordinate] = useState({});
  const [tripType_, settripType_] = useState({});
  const [siteOfficeLocation, setSiteOfficeLocation] = useState({});
  const [paths, setPaths] = useState([]);
  const [accumulatedData, setAccumulatedData] = useState([]);
  useEffect(() => {
    axios
      .get(`${Api.siteOffice.list}/corporate?page=0&size=1000&officeName=null`)
      .then((res) => {
        setSiteOfficeLocation({
          ...res.data.data.body['SiteOffice List'][0].location,
          isOfc: true,
        });
      });
  }, []);
  useEffect(() => {
    axios
      .post(Api.baseUri + '/api/dashboard/rtd/getLiveData', {
        corpId: user?.userList?.corporateId,
        date: '08-06-2023',
      })
      .then((re) => {
        for (const [key, value] of Object.entries(re?.data)) {
          if (value.tripId == id) setVehicleCordinate({...value.location});
        }
      })
      .catch((err) => {});
  }, [id]);
  // const handleDownload = () => {
  //   const jsonData = JSON.stringify(accumulatedData);
  //   const blob = new Blob([jsonData], {type: 'text/plain'});
  //   const url = URL.createObjectURL(blob);
  //   const link = document.createElement('a');
  //   link.download = 'accumulated_vehicle_data.txt';
  //   link.href = url;
  //   link.click();
  //   URL.revokeObjectURL(url);

  //   localStorage.removeItem('liveVehicleData');
  // };
  useEffect(() => {
    socket.emit('add-user', user?.userList?.corporateId);
    setTimeout(() => {
      socket.on('get-direction', (d) => {
        if (d?.fullDocument?.tripId !== id) return;
        let t_paths = d?.fullDocument?.start_to_end;
        if (!t_paths) return;
        let arr = [];
        t_paths?.map((el, ind) => {
          arr.push({lat: el.latitude, lng: el.longitude, id: 'stop' + ind});
        });
        setPaths([...arr]);
        // setStops({total: arr.length || 0, data: [arr[0], arr[arr.length-1]]})
      });
    }, 1000);
    socket.on('live-vehicles', (t_data) => {
      // const receivedTime = new Date().getTime();
      // const dataToStore = {
      //   frontReceivedTime: receivedTime,
      //   t_data: t_data,
      // };

      // setAccumulatedData((prevData) => [...prevData, dataToStore]);
      // localStorage.setItem('liveVehicleData', JSON.stringify(dataToStore));
      for (const [key, value] of Object.entries(t_data)) {
        if (value.tripId == id && value?.vehicleId)
          setVehicleCordinate({...value.location});
      }
    });
    // socket.on('live-vehicles', (t_data) => {
    //     let elm;
    //
    //     t_data?.map(el => {
    //         if (el.tripId == id) {
    //             setVehicleCordinate({ ...el.location })
    //             elm = el;
    //         }
    //     })
    // })
  }, []);
  useEffect(() => {
    if (!id) return;
    axios
      .get(Api.baseUri + '/user-reg/trip-route/get-trip-by-id?tripId=' + id)
      .then((res) => {
        let _res = res.data?.data[0] || {};
        let t_stops = [];
        let etaObj = {};
        // let te_arr = [];
        // let is_fem = false;
        // let is_escort = false;
        // if (_res) {
        //   te_arr =
        //     _res?.tripType == 'UPTRIP'
        //       ? _res?.stopList[_res?.stopList?.length - 1]?.deBoardPassengers
        //       : _res?.tripType == 'DOWNTRIP'
        //       ? _res?.stopList[0]?.onBoardPassengers
        //       : [];
        // }

        // te_arr?.map((_fem) => {
        //   if (_fem?.gender == 'Female') {
        //     is_fem = true;
        //     if (!fem_count?.includes(_fem?.tripId))
        //       fem_count.push(_fem?.tripId);
        //   }
        //   if (
        //     _fem?.escortTrip == 'YES' &&
        //     !escortTrip?.includes(_fem?.tripId)
        //   ) {
        //     escortTrip.push(_fem?.tripId);
        //     is_escort = true;
        //   }
        //   trip_status = _fem?.tripStatus;
        // });
        // console.log('te_arr', te_arr, is_fem, is_escort);
        settripType_(_res?.tripType);
        if (_res?.tripType == 'UPTRIP') {
          let temp = _res?.stopList[(_res?.stopList?.length || 1) - 1];
          _res?.stopList?.map((empc) => {
            empc?.onBoardPassengers?.map((elel) => {
              etaObj[elel.id] =
                _res?.tripTyp == 'DOWNTRIP'
                  ? elel?.dropDateTimeStr
                  : empc?.expectedArivalTimeStr;
            });
          });
          temp?.deBoardPassengers?.map((el) => {
            t_stops.push({
              eta: etaObj[el.id]?.split(' ')[1],
              lat: Number(el?.location?.latitude),
              lng: Number(el?.location?.longitude),
              name: el.name,
              location: el?.location?.locName,
              photo: el.photo,
            });
          });
          t_stops.push({
            eta: moment(Number(_res?.shiftInTime)).format('hh:mm'),
            lat: Number(temp?.location?.latitude),
            lng: Number(temp?.location?.longitude),
            name: user?.userList?.corporateName,
            location: temp?.location.locName,
            photo: 'CORP',
          });
        } else {
          let temp = _res?.stopList[0];
          t_stops.push({
            eta: _res?.startTime,
            lat: Number(temp?.location?.latitude),
            lng: Number(temp?.location?.longitude),
            name: user?.userList?.corporateName,
            location: temp?.location?.locName,
            photo: 'CORP',
          });
          temp?.onBoardPassengers?.map((el) => {
            t_stops.push({
              eta: etaObj[el.id]?.split(' ')[1],
              lat: Number(el?.location?.latitude),
              lng: Number(el?.location?.longitude),
              name: el.name,
              location: el?.location?.locName,
              photo: el.photo,
            });
          });
        }
        setStops({total: t_stops.length || 0, data: t_stops});
        axios
          .get(Api.baseUri + '/api/dashboard/rtd/getTripDirectionById/' + id)
          .then((res) => {
            let t_paths = res?.data?.data[0]?.start_to_end || [];
            let arr = [];
            t_paths?.map((el, ind) => {
              arr.push({lat: el.latitude, lng: el.longitude, id: 'stop' + ind});
            });
            setPaths([...arr]);
            // setStops({total: arr.length || 0, data: [arr[0], arr[arr.length-1]]})
            // let t = 0
            // setInterval(()=>{
            //     if((t+1) == arr.length) return;
            //     setVehicleCordinate({...arr[t]})
            //     t++;
            // },3000)
          })
          .catch((err) => {
            setPaths([]);
          });
      })
      .catch((err) => {});
  }, [id]);
  const mapURL = `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${GoogleMapsAPI}`;
  // const paths = []
  // const stops = {
  //     "total": 3,
  //     "data": [
  //         {
  //             "lat": 28.6111,
  //             "lng": 77.38043,
  //             "id": "stop1"
  //         },
  //         {
  //             "lat": 28.6035,
  //             "lng": 77.38205,
  //             "id": "stop2"
  //         },
  //         {
  //             "lat": 28.60417,
  //             "lng": 77.38044,
  //             "id": "stop3"
  //         }
  //     ]
  // }
  return (
    <div className='App'>
      {stops ? (
        <>
          <WrappedMap
            paths={paths}
            stops={stops}
            tripType_={tripType_}
            googleMapURL={mapURL}
            siteOfficeLocation={siteOfficeLocation}
            vehicleCordinate={vehicleCordinate}
            loadingElement={<div style={{height: `100%`}} />}
            containerElement={
              <div
                className='mapContainer'
                style={{
                  margin: '-45px',
                  width: 'calc(100% + 70px)',
                  height: 'calc(100vh - 10px)',
                }}
              />
            }
            mapElement={<div style={{height: `100%`}} />}
          />
          {/* <Button
            variant='contained'
            style={{position: 'absolute', top: '8%'}}
            onClick={handleDownload}
          >
            Download Data
          </Button> */}
        </>
      ) : (
        <Box sx={{width: '100%'}}>
          <LinearProgress />
        </Box>
      )}
    </div>
  );
}

export default App;
