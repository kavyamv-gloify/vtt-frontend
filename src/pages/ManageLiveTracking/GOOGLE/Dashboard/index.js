import React, {useEffect, useState} from 'react';
import '../style.css';
import '../../style.css';
import WrappedMap from './dashboard';
import {GoogleMapsAPI} from '@smart-form/GoogleMap/g-config';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import BottomPannel from '../../BottomPannel';
import SidePannel from '../../sidePannel';
import axios from 'axios';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {useParams} from 'react-router-dom';
import _ from 'lodash';
import moment from 'moment';
import Api from '@api';
import io from 'socket.io-client';
const host = Api?.baseUri;
const socket = io(host, {path: '/api/socket.io/'});

function App() {
  const [currFilter, setCurrFilter] = useState(0);
  const [dropDowns, setdropDowns] = useState({});
  const [tripCounts, setTripCounts] = useState({female: 0});
  const [searchData, setsearchData] = useState({});
  const [filterType, setFilterType] = useState('');
  const [data, setData] = useState([]);
  const [allTrips, setAllTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const {type} = useParams();
  const {user} = useAuthUser();
  const [stops, setStops] = useState({});
  const [siteOfficeLocation, setSiteOfficeLocation] = useState({});
  useEffect(() => {
    if (type == 'full-window' && window) {
      document.querySelector('.app-bar').style.display = 'none';
      document.querySelector('.mini-toggle-sidebar').style.display = 'none';
    }
    if (type == 'default' && window) {
      document.querySelector('.app-bar').style.display = '';
      document.querySelector('.mini-toggle-sidebar').style.display = '';
    }
  }, [type]);
  function differencebetweenTime(d1, d2) {
    if (!d1 || !d2) return;
    // Declare dates
    let td1 = new Date(d1);
    let td2 = new Date(d2);
    let dif = td2 - td1;
    dif = Math.round(dif / 1000 / 60);
    return dif;
  }
  useEffect(() => {
    let filter_trips = [];
    let t_driver = [];
    let t_emp = [];
    let t_shift = [];
    let t_trip = [];
    let t_vehicle = [];
    let t_vendor = [];
    if (searchData?.driverID?.length) {
      searchData?.driverID?.map((e) => {
        t_driver.push(e.value);
      });
    }
    if (searchData?.empCode?.length) {
      searchData?.empCode?.map((e) => {
        t_emp.push(e.value);
      });
    }
    if (searchData?.shiftId?.length) {
      searchData?.shiftId?.map((e) => {
        t_shift.push(e.value);
      });
    }
    if (searchData?.tripId?.length) {
      searchData?.tripId?.map((e) => {
        t_trip.push(e.value);
      });
    }
    if (searchData?.vehicleCode?.length) {
      searchData?.vehicleCode?.map((e) => {
        t_vehicle.push(e.value);
      });
    }
    if (searchData?.vendorId?.length) {
      searchData?.vendorId?.map((e) => {
        t_vendor.push(e.value);
      });
    }
    allTrips?.map((el) => {
      if (
        !filter_trips?.includes(el.driverId) &&
        t_driver.includes(el.driverId)
      )
        filter_trips.push(el.id);
      if (!filter_trips?.includes(el.shiftId) && t_shift.includes(el.shiftId))
        filter_trips.push(el.id);
      if (!filter_trips?.includes(el.id) && t_trip.includes(el.id))
        filter_trips.push(el.id);
      if (
        !filter_trips?.includes(el.vehicleId) &&
        t_vehicle.includes(el.vehicleId)
      )
        filter_trips.push(el.id);
      if (
        !filter_trips?.includes(el.vendorId) &&
        t_vendor.includes(el.vendorId)
      )
        filter_trips.push(el.id);
      let t_arr =
        el.tripType == 'UPTRIP'
          ? el?.stopList[el?.stopList?.length - 1]?.deBoardPassengers
          : el?.stopList[0]?.onBoardPassengers;
      t_arr?.map((ele) => {
        if (!filter_trips?.includes(ele.empId) && t_emp.includes(ele.empId))
          filter_trips.push(el.id);
      });
    });
    setFilteredTrips([...filter_trips]);
  }, [searchData]);
  useEffect(() => {
    axios
      .get(`${Api.siteOffice.list}/corporate?page=0&size=1000&officeName=null`)
      .then((res) => {
        setSiteOfficeLocation({
          ...res.data.data.body['SiteOffice List'][0].location,
          isOfc: true,
          officeName: res.data.data.body['SiteOffice List'][0].officeName,
        });
        setStops({
          total: 0,
          data: [],
        });
      });
  }, []);
  function arePointsNear(checkPoint, centerPoint) {
    var ky = 40000 / 360;
    var kx = Math.cos((Math.PI * centerPoint.lat) / 180.0) * ky;
    var dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
    var dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
    return Math.sqrt(dx * dx + dy * dy);
  }
  useEffect(() => {
    axios
      .post(Api.baseUri + '/api/dashboard/rtd/getLiveData', {
        corpId: user?.userList?.corporateId,
        date: moment().format('DD-MM-YYYY'),
      })
      .then((re) => {
        let my_data = [];
        for (const [key, ele] of Object.entries(re?.data)) {
          my_data.push(ele);
        }
        setData([...my_data]);
      })
      .catch((err) => {});
  }, [user?.userList?.corporateId]);
  useEffect(() => {
    socket.emit('add-user', user?.userList?.corporateId);
    // socket.on('live-vehicles', (t_data) => {
    //     for (const [key, value] of Object.entries(t_data)) {
    //         if(value.tripId == id) setVehicleCordinate({ ...value.location })
    //     }
    // })
    socket.on('live-vehicles', (t_data) => {
      console.log('::::::<<<<>>>>>>RRR', t_data);
      let tem = {};
      let tem_arr = [];
      let inactive_tem_arr = [];
      let ind = 0;
      let my_data = [];
      let first_point_delay_trip = [];
      let delayed_trip = [];
      let expected_delayed_trip = [];
      let expected_fpd = [];
      let escortTrip = [];
      let isSOS = [];
      let isAdhoc = [];
      let nearOfc = [];
      let over_speeding = [];
      let gps_lost = [];
      let fem_count = [];
      let stop_morethan_5 = [];
      let geofence_violation = [];
      let special_employee = [];
      for (const [key, ele] of Object.entries(t_data)) {
        if (ele?.vehicleId && ele?.tripId) {
          my_data.push(ele);
          let dist = arePointsNear(
            {
              lat: parseFloat(siteOfficeLocation.latitude),
              lng: parseFloat(siteOfficeLocation.longitude),
            },
            {lat: ele?.location?.lat, lng: ele?.location?.lng},
          );
          let isnearOfc = false;
          let isstopmorethan5 = false;
          let isgeofenceviolation = false;
          let isoverspeed = false;
          let isgpslost = false;
          if (dist <= 2) {
            nearOfc.push(ele);
            isnearOfc = true;
          }
          if (ele.OVER_SPEEDING > 70) {
            over_speeding.push(ele);
            isoverspeed = true;
          }
          if (!ele.GPS_SIGNAL_LOST) {
            gps_lost.push(ele);
            isgpslost = true;
          }
          let is_fem = false;
          let trip_status = '';
          let is_escort = false;
          let is_sos = false;
          let is_adhoc = false;
          let is_fpd = false;
          let is_expected_fpd = false;
          let isspecialEmp = false;
          let is_delayed = false;
          let is_expected_delayed = false;
          let is_vehicleCompliances = false;
          let gg;
          if (!_.isEmpty(ele.location)) {
            ele.location.id = 'stop' + ind;
            ele.location.tid = ele.tripId;
            let groupedTrips = {};
            let dynamicETA = _.groupBy(ele.stopPointsDynamicETA, 'id');
            if (allTrips.length) {
              groupedTrips = _.groupBy(allTrips, 'id');
            }
            let te_arr = [];
            gg = groupedTrips[ele.tripId] ? groupedTrips[ele.tripId][0] : null;

            is_vehicleCompliances =
              gg?.vehicleCompliancesDto?.complianceTopics?.some(
                (topic) => topic?.status == 'NOTMET',
              ) || false;
            te_arr =
              gg?.tripType == 'UPTRIP'
                ? gg?.stopList[gg?.stopList?.length - 1]?.deBoardPassengers
                : gg?.tripType == 'DOWNTRIP'
                ? gg?.stopList[0]?.onBoardPassengers
                : [];
            if (groupedTrips[ele.tripId]?.length) {
              if (
                groupedTrips[ele.tripId][0]?.isSOS == 'true' &&
                !isSOS?.includes(ele.tripId)
              ) {
                isSOS.push(ele.tripId);
                is_sos = true;
              }
              if (
                groupedTrips[ele.tripId][0]?.tripCategory == 'ADHOCTRIP' &&
                !isAdhoc?.includes(ele.tripId)
              ) {
                isAdhoc.push(ele.tripId);
                is_adhoc = true;
              }
              let e = groupedTrips[ele.tripId][0];

              let delay_fpd = differencebetweenTime(
                e.stopList[
                  e?.escortTrip == 'YES' && e?.tripType == 'UPTRIP' ? 1 : 0
                ][
                  e.tripType == 'DOWNTRIP'
                    ? 'expectedArivalTime'
                    : 'expectedDepartureTime'
                ],
                e.stopList[
                  e?.escortTrip == 'YES' && e?.tripType == 'UPTRIP' ? 1 : 0
                ][
                  e.tripType == 'DOWNTRIP'
                    ? 'actualArivalTime'
                    : 'actualDepartureTime'
                ],
              );
              e?.stopList?.map((em_, i__) => {
                if (
                  em_?.id &&
                  em_?.id != 'null' &&
                  dynamicETA[em_?.id]?.length
                ) {
                  let _delayed = differencebetweenTime(
                    em_[
                      e.tripType == 'DOWNTRIP'
                        ? 'expectedArivalTime'
                        : 'expectedDepartureTime'
                    ],
                    +new Date() +
                      1000 * 60 * (dynamicETA[em_?.id][0]?.timeTaken || 0),
                  );
                  if (_delayed) {
                    is_expected_delayed = true;
                  }
                  if (
                    _delayed &&
                    i__ ==
                      (e?.escortTrip == 'YES' && e?.tripType == 'UPTRIP'
                        ? 1
                        : 0)
                  ) {
                    is_expected_fpd = true;
                  }
                }
                let ps_data;
                if (e?.tripType == 'UPTRIP')
                  ps_data = em_?.onBoardPassengers || [];
                if (e?.tripType == 'DOWNTRIP')
                  ps_data = em_?.deBoardPassengers || [];

                ps_data?.map((ee__) => {
                  if (ee__?.geoFenceViolation == 'YES')
                    isgeofenceviolation = true;
                });
                ps_data?.map((ee__) => {
                  if (ee__?.specialEmployee == 'YES') isspecialEmp = true;
                });
                if (em_?.waitingTimeInSec > 300) {
                  // timestamp += 75 * 60;
                  isstopmorethan5 = true;
                }
                let ddd = differencebetweenTime(
                  em_[
                    e.tripType == 'DOWNTRIP'
                      ? 'expectedArivalTime'
                      : 'expectedDepartureTime'
                  ],
                  em_[
                    e.tripType == 'DOWNTRIP'
                      ? 'actualArivalTime'
                      : 'actualDepartureTime'
                  ],
                );
                if (ddd > 0) is_delayed = true;
              });
              if (delay_fpd > 0) {
                is_fpd = true;
                if (!first_point_delay_trip?.includes(ele.tripId)) {
                  first_point_delay_trip.push(ele.tripId);
                }
              }
              if (is_delayed) {
                if (!delayed_trip?.includes(ele.tripId)) {
                  delayed_trip.push(ele.tripId);
                }
              }
              if (is_expected_delayed) {
                if (!expected_delayed_trip?.includes(ele.tripId)) {
                  expected_delayed_trip.push(ele.tripId);
                }
              }
              if (is_expected_fpd) {
                if (!expected_fpd?.includes(ele.tripId)) {
                  expected_fpd.push(ele.tripId);
                }
              }

              if (isspecialEmp) {
                if (!special_employee?.includes(ele.tripId)) {
                  special_employee.push(ele.tripId);
                }
              }
              if (isgeofenceviolation) {
                if (!geofence_violation?.includes(ele.tripId)) {
                  geofence_violation.push(ele.tripId);
                }
              }
              if (isstopmorethan5) {
                if (!stop_morethan_5?.includes(ele.tripId)) {
                  stop_morethan_5.push(ele.tripId);
                }
              }
            }
            te_arr?.map((_fem) => {
              if (_fem?.gender == 'Female') {
                is_fem = true;
                if (!fem_count?.includes(_fem?.tripId))
                  fem_count.push(_fem?.tripId);
              }
              // if (
              //   _fem?.tripType == 'UPTRIP' &&
              //   moment(_fem?.pickUpDateTimeStr).isBefore(
              //     _fem?.actualPickUpDateTimeStr,
              //   )
              // ) {
              //   if (first_point_delay_trip?.includes(_fem?.tripId))
              //     first_point_delay_trip.push(_fem?.tripId);
              //   is_fpd = true;
              // }
              // if (
              //   _fem?.tripType == 'DOWNTRIP' &&
              //   moment(_fem?.dropDateTimeStr).isBefore(
              //     _fem?.actualDropDateTimeStr,
              //   )
              // ) {
              //   if (first_point_delay_trip?.includes(_fem?.tripId))
              //     first_point_delay_trip.push(_fem?.tripId);
              //   is_fpd = true;
              // }
              // if (_fem?.isSOS == 'true' && !isSOS?.includes(_fem?.tripId)) {
              //   isSOS.push(_fem.tripId);
              //   is_sos = true;
              // }
              if (
                _fem?.escortTrip == 'YES' &&
                !escortTrip?.includes(_fem?.tripId)
              ) {
                escortTrip.push(_fem?.tripId);
                is_escort = true;
              }
              trip_status = _fem?.tripStatus;
            });

            if (gg) {
              ele.location.driverName = gg?.driverName || 'NA';
              ele.location.driverMobileNo = gg?.driverMobileNo || 'NA';
              ele.location.driverPhoto = gg?.driverPhoto
                ? Api.imgUrl + gg?.driverPhoto
                : '/assets/images/placeholder.jpg';
              ele.location.gpsLost = ele.GPS_SIGNAL_LOST;
              ele.location.battery = ele.mobileBatteryStatus?.toFixed();
              ele.location.vehicleNo = gg?.vehicleNo || 'NA';
              ele.location.vehicleType = gg?.vehicleType || 'NA';
              ele.location.escortName = gg?.escortName || 'NA';
              ele.location.tripCode = gg?.tripCode || 'NA';
              ele.location.tripId = gg?.id || 'NA';
              ele.location.is_vehicleCompliances = is_vehicleCompliances;
              ele.location.passcount =
                gg.escortTrip != 'YES'
                  ? te_arr.length
                  : te_arr.length
                  ? te_arr.length - 1
                  : 0;
              ele.location.isfemale = is_fem;
              ele.location.escortTrip = gg?.escortTrip || 'NA';
              // ele.location.trip_status = trip_status;
              ele.location.trip_status = ele?.tripStatus;
              // el?.isfemale ?  : (el.tripStatus == 'COMPLETED') ?  :
              if (ele.vehicleId)
                ele.location.icon = {
                  url: '/assets/images/female_car.svg',
                  scaledSize: new window.google.maps.Size(40, 40),
                  anchor: new window.google.maps.Point(20, 20),
                  scale: 0.7,
                  rotation: 90,
                };
              if (ele.location.isfemale)
                ele.location.icon = {
                  url: '/assets/images/female_car.svg',
                  scaledSize: new window.google.maps.Size(40, 40),
                  anchor: new window.google.maps.Point(20, 20),
                  scale: 0.7,
                  rotation: 90,
                };
              else if (ele.location.tripStatus == 'COMPLETED')
                ele.location.icon = {
                  url: '/assets/images/available_car.svg',
                  scaledSize: new window.google.maps.Size(40, 40),
                  anchor: new window.google.maps.Point(20, 20),
                  scale: 0.7,
                  rotation: 90,
                };
              else
                ele.location.icon = {
                  url: '/assets/images/male_car.svg',
                  scaledSize: new window.google.maps.Size(40, 40),
                  anchor: new window.google.maps.Point(20, 20),
                  scale: 0.7,
                  rotation: 90,
                };
            }
          }
          if (filterType == 'EXPECTED_DELAYED_DROP' && is_expected_delayed) {
            tem_arr.push(ele.location);
          }
          if (filterType == 'DELAYED_BOARDING_DEBOARDING' && is_delayed) {
            tem_arr.push(ele.location);
          }
          if (
            filterType == 'VEHICLE_STOPPAGE_MORE_THAN_5_MINS' &&
            isstopmorethan5
          ) {
            tem_arr.push(ele.location);
          }
          if (filterType == 'SPECIAL_EMP_TRIP' && isspecialEmp) {
            tem_arr.push(ele.location);
          }
          if (filterType == 'GEOFENCE_VIOLATION' && isgeofenceviolation) {
            tem_arr.push(ele.location);
          }
          if (filterType == 'ESCORT_TRIP' && is_escort) {
            tem_arr.push(ele.location);
          }
          if (filterType == 'SOS_ALERT' && is_sos) {
            tem_arr.push(ele.location);
          }
          if (filterType == 'FIRST_PICKUP_DELAYED' && is_fpd) {
            tem_arr.push(ele.location);
          }
          if (filterType == 'FEMALE_TRAVELING' && is_fem) {
            tem_arr.push(ele.location);
          }
          if (filterType == 'ADHOC_TRIP' && is_adhoc) {
            tem_arr.push(ele.location);
          }
          if (filterType == 'VEHICLE_NEAR_OFC_2KM' && isnearOfc) {
            tem_arr.push(ele.location);
          }
          if (filterType == 'OVER_SPEEDING' && isoverspeed) {
            tem_arr.push(ele.location);
          }
          if (filterType == 'GPS_SIGNAL_LOST' && isgpslost) {
            tem_arr.push(ele.location);
          }
          if (!filterType) {
            tem_arr.push(ele.location);
          }

          // ele?.tripCategory == "ADHOCTRIP"
          ind++;
        }

        if (ele?.vehicleId) {
          ele.location.trip_status = 'SCHEDULE';
          // ele.location.vehicleNo = 'DL-9C-AS-4565';
          // ele.location.vehicleType = 'TATA';
          ele.location.is_vehicleCompliances = false;
          ele.location.icon = {
            url: '/assets/images/male_car.svg',
            scaledSize: {
              width: 40,
              height: 40,
            },
            anchor: {
              x: 20,
              y: 20,
            },
            scale: 0.7,
            rotation: 90,
          };

          inactive_tem_arr.push(ele.location);

          // ele?.tripCategory == "ADHOCTRIP"
          ind++;
        }
      }

      setData([...my_data]);
      tem = {
        total: t_data?.length || 0,
        data: tem_arr.concat(inactive_tem_arr),
        // data: inactive_tem_arr,
      };
      setStops({...tem});
      setTripCounts({
        ...tripCounts,
        gps_lost: gps_lost,
        geofence_violation: geofence_violation,
        special_employee: special_employee,
        over_speeding: over_speeding,
        stop_morethan_5: stop_morethan_5,
        nearOfc: nearOfc,
        adhoc: isAdhoc,
        female: fem_count,
        sos: isSOS,
        escortTrip: escortTrip,
        fpd: first_point_delay_trip,
        delayedTrip: delayed_trip,
        expecteddelayedTrip: expected_delayed_trip,
        expected_fpd: expected_fpd,
      });
    });
  }, [allTrips, filterType]);

  const mapURL = `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${GoogleMapsAPI}`;
  return (
    <div
      className='App'
      style={{marginTop: '-19px', marginLeft: '-35px', marginRight: '-35px'}}
    >
      <SidePannel
        data={data}
        dropDowns={dropDowns}
        setsearchData={setsearchData}
        setAllTrips={setAllTrips}
        setFilterType={setFilterType}
      />
      {stops?.data && (
        <WrappedMap
          stops={stops}
          googleMapURL={mapURL}
          loadingElement={<div style={{height: `100%`}} />}
          containerElement={
            <div
              className={
                type == 'full-window' ? 'mapContainer2' : 'mapContainer'
              }
            />
          }
          mapElement={<div style={{height: `100%`}} />}
          filteredTrips={filteredTrips}
          siteOfficeLocation={siteOfficeLocation}
          setFilteredTrips={setFilteredTrips}
        />
      )}
      <BottomPannel
        type={type}
        currFilter={currFilter}
        filterType={filterType}
        tripCounts={tripCounts}
        setCurrFilter={setCurrFilter}
        setFilterType={setFilterType}
      />
    </div>
  );
}

export default App;
