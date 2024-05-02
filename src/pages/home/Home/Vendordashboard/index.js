import React, {useEffect, useState} from 'react';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {useNavigate} from 'react-router-dom';
// import '../style.css'
import Operations from './OperationView/operation';
import Slider from './Cards/carousel';
import CustomLabel from 'pages/common/CustomLabel';
import {Box} from '@mui/system';
import {Grid, IconButton} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CustomActiveShapePieChart from './CustomActiveShapePieChart';
import Pie from './PieChart';
import BtcVolumeCurrency from '../CorporateAdmin/BTC-chart';
import {useDispatch, useSelector} from 'react-redux';
import {onGetCryptoData} from 'redux/actions';
// import SimpleGauge from './fusion';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import FleetMix from './fleetMix';
import './style.css';
import _, {indexOf} from 'lodash';
import Api from '@api';
import axios from 'axios';
import {Bar} from 'react-chartjs-2';
import SimpleGuageComp from './fusion comp';
import Services from '../Common Component/Services/Services';
// import Ticket from './Ticket/Ticket';
import {setCompanyName} from 'redux/actions';
import {CategoryScale} from 'chart.js';
import Chart from 'chart.js/auto';
import LineChartComp from '../CorporateAdmin/linechart';
import BarChartComp from '../CorporateAdmin/barchart';
import moment from 'moment';
import downDoc from '@common/fileDownload';
import {toast} from 'react-toastify';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import SmartForm from '@smart-form';
import AppTooltip from '@crema/core/AppTooltip';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import DialogTitle from '@mui/material/DialogTitle';
Chart.register(CategoryScale);
const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  type: 'bar',
  scales: {
    // to remove the labels
    x: {
      // ticks: {
      //   display: false,
      // },

      // to remove the x-axis grid
      grid: {
        drawBorder: true,
        display: false,
      },
    },
    // to remove the y-axis labels
    y: {
      // ticks: {
      //   display: false,
      //   beginAtZero: true,
      // },
      // to remove the y-axis grid
      grid: {
        drawBorder: true,
        display: false,
      },
    },
  },
  //   scales: {
  //     xAxes: [{
  //         stacked: true
  //     }],
  //     yAxes: [{
  //         stacked: true
  //     }]
  // }
};
var colorArray = [
  '#ff8313',
  '#27865c',
  '#f2726f',
  '#00B3E6',
  '#E6B333',
  '#3366E6',
  '#999966',
  '#99FF99',
  '#B34D4D',
  '#80B300',
  '#809900',
  '#E6B3B3',
  '#6680B3',
  '#66991A',
  '#FF99E6',
  '#CCFF1A',
  '#FF1A66',
  '#E6331A',
  '#33FFCC',
  '#66994D',
  '#B366CC',
  '#4D8000',
  '#B33300',
  '#CC80CC',
  '#66664D',
  '#991AFF',
  '#E666FF',
  '#4DB3FF',
  '#1AB399',
  '#E666B3',
  '#33991A',
  '#CC9999',
  '#B3B31A',
  '#00E680',
  '#4D8066',
  '#809980',
  '#E6FF80',
  '#1AFF33',
  '#999933',
  '#FF3380',
  '#CCCC00',
  '#66E64D',
  '#4D80CC',
  '#9900B3',
  '#E64D66',
  '#4DB380',
  '#FF4D4D',
  '#99E6E6',
  '#6666FF',
];

const VendorDashboard = () => {
  const navigate = useNavigate();
  const {user} = useAuthUser();
  const [selectedShift, setSelectedShift] = useState([]);
  const [tripByStatus, settripByStatus] = useState();
  const [tripByEmpStatus, settripByEmpStatus] = useState();
  const [tripByVendor, settripByVendor] = useState([]);
  const [tripByGender, settripByGender] = useState({});
  const [tripByVehicleId, setTripByVehicleId] = useState({});
  const [thermoVal, setthermoVal] = useState(0);
  const [myArr, setmyArr] = useState([0, 0, 0, 0]);
  const [temAllTrips, setTemAllTrips] = useState([]);
  const [otaCountTrip, setOtaCountTrip] = useState({});
  const [escortTrip, setEscortTrip] = useState([]);
  const [etdDataArr, setetdDataArr] = useState([]);
  const [etdDataCSV, setetdDataArrCSV] = useState([]);
  const [otherStatus, setOtherStatus] = useState();
  const [refresh, setRefresh] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(moment().format('HH:mm:ss'));
  const permissionCheck = useSelector(({settings}) => settings.permissions);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  // const host = "https://devapi.etravelmate.com";
  // const socket = io(host, { path: '/api/socket.io/'});
  const [myActions, setMyActions] = useState([]);
  useEffect(() => {
    if (!permissionCheck) return;
    let sub_mod = {};
    permissionCheck?.map((el) => {
      if (el.subModuleName == 'Dashboard') sub_mod = el;
    });
    setMyActions(sub_mod?.actions);
    // if (!sub_mod || !sub_mod?.actions?.includes('View'))
    //   navigate('/error-pages/error-404');
  }, [permissionCheck]);
  console.log('myActions', myActions);
  let templateDownload = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    // title: 'Bank Type',
    description: 'Form for applying Job',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'date',
            name: 'fromDate',
            id: 'fromDate',
            title: 'From Date ',
          },
          {
            type: 'date',
            name: 'toDate',
            id: 'toDate',
            title: 'To Date ',
          },
        ],
      },
    ],
  };
  function handleDownload(val) {
    axios
      .get(
        Api.baseUri +
          `/user-reg/tripReport/vendorConsolidated-report/${val?.data?.fromDate}/${val?.data?.toDate}`,
        {responseType: 'blob'},
      )
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
          'download',
          'consolidated response/' +
            (val?.button?.toUpperCase() == 'XLS' ? '.xls' : '.pdf'),
        );
        document.body.appendChild(link);
        link.click();
        setOpen(false);
      });
  }
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
    if (!tripByGender?.Female) return;
    let noStatus = 0;
    for (const [key, value] of Object.entries(tripByGender?.Female)) {
      if (
        key != 'Female' &&
        key != 'SAFEREACHED' &&
        key != 'INCAB' &&
        key != 'SCHEDULE'
      )
        noStatus = noStatus + value?.length;
    }
    let tem = [
      tripByGender?.Female?.SAFEREACHED?.length ?? 0,
      tripByGender?.Female?.INCAB?.length ?? 0,
      tripByGender?.Female?.SCHEDULE?.length ?? 0,
      noStatus ?? 0,
    ];
    setmyArr([...tem]);
  }, [tripByGender]);
  const data = {
    labels: ['Safe Reach', 'In Trip', 'Not Traveling', 'No Status'],
    datasets: [
      {
        label: 'Count',
        backgroundColor: ['#06ae9a', '#fe7f0c', '#f2726f', '#54bac9'],
        borderColor: ['#06ae9a', '#fe7f0c', '#f2726f', '#54bac9'],
        borderWidth: 1,
        stack: 10,
        borderRadius: 12,
        hoverBackgroundColor: ['#06ae9a', '#fe7f0c', '#f2726f', '#54bac9'],
        hoverBorderColor: ['#06ae9a', '#fe7f0c', '#f2726f', '#54bac9'],
        data: [myArr[0], myArr[1], myArr[2], myArr[3]],
      },
    ],
  };

  useEffect(() => {
    let total = tripByStatus?.count ?? 0;
    let totalStatusSum =
      (tripByStatus?.SCHEDULE?.length ? tripByStatus?.SCHEDULE?.length : 0) +
      (tripByStatus?.STARTED?.length ? tripByStatus?.STARTED?.length : 0) +
      (tripByStatus?.COMPLETED?.length ? tripByStatus?.COMPLETED?.length : 0);
    let difference = total - totalStatusSum;
    setOtherStatus(difference);
  }, [tripByStatus]);

  useEffect(() => {
    if (user?.userList?.userStatus == 'DEFAULT') {
      navigate('/my-profile');
    }
  }, [user?.userList?.userStatus]);
  function rosterChecked(d, _type, _ind) {
    if (d?.shiftId || d?.tripCategory == 'ADHOCTRIP') {
      let tripTime = d?.tripTime;
      if (d?.tripCategory != 'ADHOCTRIP') {
        tripTime = null;
      }
      let postData = {
        shiftId: d?.shiftId,
        tripType: d?.tripType,
        date: d?.tripDate,
        // "toDate": "2023-01-14"
      };
      if (_type == 'REMOVE') {
        // let tem_ARRAY = selectedShift;
        // tem_ARRAY?.length &&
        //   tem_ARRAY?.map((elem, i) => {
        //     if (elem?.selectedInd == _ind) {
        //       tem_ARRAY?.splice(i, 1);
        //     }
        //   });
        // setSelectedShift(tem_ARRAY);
        const tem_ARRAY = selectedShift?.filter(
          (elem) => elem?.selectedInd !== _ind,
        );
        setSelectedShift(tem_ARRAY);
      } else {
        d.selectedInd = _ind;
        setSelectedShift([...selectedShift, d]);
      }
      axios
        // .post(Api.baseUri + '/api/dashboard/analytics/tripsByShift', postData)
        .get(
          Api.baseUri +
            `/user-reg/trip-route/get-all-trips-by-shift/${d?.tripDate}/${d?.shiftId}/${d?.tripType}/${tripTime}`,
        )
        .then((res) => {
          let tem_all_trip;
          if (_type == 'ADD') {
            // tem_all_trip = [...temAllTrips, ...res?.data];
            tem_all_trip = [...temAllTrips, ...res?.data?.data];
          } else {
            tem_all_trip = temAllTrips;
            let indexes = [];
            temAllTrips?.length &&
              temAllTrips?.map((em, inde) => {
                if (
                  em?.shiftId == d?.shiftId &&
                  em?.tripType == d?.tripType &&
                  em?.date == d?.tripDate
                ) {
                  indexes.push(inde);
                }
              });
            for (var tem_i = indexes.length - 1; tem_i >= 0; tem_i--)
              tem_all_trip.splice(indexes[tem_i], 1);
          }
          setTemAllTrips(tem_all_trip);
          let trip_stats_data = [];
          let fem_emp_data = [];
          let emp_boarding_stats_data = [];
          let my_data_ = [];
          // let mytemD = _.groupBy(tem_all_trip, 'shiftName');
          let mytemD_total = {};
          let mytemD_etd = {};
          let expectedDelayedData = [];
          tem_all_trip?.map((meme) => {
            mytemD_total[meme.shiftName] =
              (mytemD_total[meme.shiftName] || 0) + 1;
            let etd_etd_ = false;
            meme?.routePsDetails?.map((ell) => {
              let op = differencebetweenTime(
                ell.expectedArivalTime,
                ell.updatedArivalTime,
              );
              if (op > 0) {
                expectedDelayedData.push({
                  ['Trip Id']: meme.tripCode,
                  ['Trip Type']:
                    meme.tripCategory == 'ADHOCTRIP' ? 'Adhoc' : 'Reguar',
                  ['Shift']:
                    meme.tripCategory == 'ADHOCTRIP'
                      ? 'Adhoc [' + meme.startTime + ']'
                      : meme.shiftName,
                  ['Vehicle Number']: meme.vehicleNo,
                  ['From Address']:
                    meme?.stopList[
                      meme.escortTrip !== 'YES' || meme?.tripType == 'DOWNTRIP'
                        ? 0
                        : 1
                    ]?.stopPointName,
                  ['To Address']:
                    meme?.stopList[
                      meme.escortTrip !== 'YES' || meme?.tripType == 'UPTRIP'
                        ? meme?.stopList?.length - 1
                        : meme?.stopList?.length - 2
                    ]?.stopPointName,
                  ['Employee Name']: ell.name + ' - ' + ell.empCode,
                  ['Employee ETA']: moment(ell.expectedArivalTime).format(
                    'HH:MM',
                  ),
                  ['Expected Delay']:
                    moment(ell.updatedArivalTime).format('HH:MM') + ' +' + op,
                  ['No of Passengers']: ell.noOfPassengerInTrip,
                  ['ActualLogin/LogoutTime']: moment(
                    meme.tripType === 'UPTRIP'
                      ? meme.actualTripCompletionTime
                      : meme.actualTripStartTime,
                  ).format('DD/MM/YYYY HH:MM'),
                });
                etd_etd_ = true;
              }
            });

            if (etd_etd_) {
              mytemD_etd[meme.shiftName] =
                (mytemD_etd[meme.shiftName] || 0) + 1;
            }

            trip_stats_data.push({
              Shift:
                moment(meme.date).format('DD/MM/YYYY') +
                ' ' +
                (meme.tripType == 'UPTRIP'
                  ? new Date(Number(meme.shiftInTime))
                  : new Date(Number(meme.shiftOutTime))
                )
                  ?.toTimeString()
                  ?.split(' ')[0],
              'Shift Type': meme.tripType == 'UPTRIP' ? 'Login' : 'Logout',
              'Trip ID': meme.tripCode,
              'Trip Status':
                meme.status == 'CANCLED'
                  ? 'Cancelled'
                  : meme.status == 'SCHEDULE'
                  ? 'Not Started'
                  : meme.status,
              'Trip Type': meme.tripCategory == 'REGTRIP' ? 'Regular' : 'Adhoc',
              'No of Passengers':
                (meme.numberOfFemalePassengers || 0) +
                (meme.numberOfMalePassengers || 0),
            });
            let __tt = _.groupBy(meme.empDetails, 'id');
            meme.routePsDetails?.map((elements) => {
              if (elements.passType != 'ESCORT') {
                emp_boarding_stats_data.push({
                  Shift:
                    moment(meme.date).format('DD/MM/YYYY') +
                    ' ' +
                    (meme.tripType == 'UPTRIP'
                      ? new Date(Number(meme.shiftInTime))
                      : new Date(Number(meme.shiftOutTime))
                    )
                      ?.toTimeString()
                      ?.split(' ')[0],
                  'Shift Name': meme.shiftName,
                  'Shift Type': meme.tripType == 'UPTRIP' ? 'Login' : 'Logout',
                  'Employee ID': elements.empCode,
                  Gender: elements.gender,
                  'Contact Number': elements.mobileNo,
                  Department: __tt[elements.empId][0]?.department,
                  'Business Unit': __tt[elements.empId][0]?.businessUnit,
                  'Manager Name': __tt[elements.empId][0]?.managerName,
                  Status:
                    elements.status == 'CANCLED'
                      ? 'Cancelled'
                      : elements.status == 'SCHEDULE'
                      ? 'Not Boarded'
                      : elements.status,
                  'Trip Status':
                    meme.status == 'CANCLED'
                      ? 'Cancelled'
                      : meme.status == 'SCHEDULE'
                      ? 'Not Started'
                      : meme.status,
                });
              }
              if (elements.gender == 'Female') {
                fem_emp_data.push({
                  Shift:
                    moment(meme.date).format('DD/MM/YYYY') +
                    ' ' +
                    (meme.tripType == 'UPTRIP'
                      ? new Date(Number(meme.shiftInTime))
                      : new Date(Number(meme.shiftOutTime))
                    )
                      ?.toTimeString()
                      ?.split(' ')[0],
                  'Shift Name': meme.shiftName,
                  'Shift Type':
                    elements.tripType == 'UPTRIP' ? 'Login' : 'Logout',
                  'Trip Type':
                    elements.tripCategory == 'REGTRIP' ? 'Regular' : 'Adhoc',
                  'Driver Name': elements.driverName || 'NA',
                  'Driver Number': elements.driverMobile || 'NA',
                  'Vehicle Number': elements.vehicleNumber,
                  'Is Escort': elements.escortTrip == 'YES' ? 'Yes' : 'No',
                  'Employee ID': elements.empCode,
                  'Employee Name': elements.name,
                  Gender: elements.gender,
                  'Contact Number': elements.mobileNo,
                  Department: __tt[elements.empId][0]?.department,
                  'Business Unit': __tt[elements.empId][0]?.businessUnit,
                  'Manager Name': __tt[elements.empId][0]?.managerName,
                  'Safe Reach': elements.safeReachStatus || 'NA',
                  Status:
                    elements.status == 'CANCLED'
                      ? 'Cancelled'
                      : elements.status == 'SCHEDULE'
                      ? 'Not Boarded'
                      : elements.status,
                  'Trip Status':
                    meme.status == 'CANCLED'
                      ? 'Cancelled'
                      : meme.status == 'SCHEDULE'
                      ? 'Not Started'
                      : meme.status,
                });
              }
            });
            // tem_ota_otd_emp.push({
            //   Shift:
            //     moment(ee.tripDate).format('DD/MM/YYYY') +
            //     ' ' +
            //     ee.shiftTime,
            //   'Trip ID': ee.tripCode,
            //   'Trip Type':
            // })
          });

          setetdDataArrCSV([...expectedDelayedData]);
          Object.keys(mytemD_total).map((eel) => {
            my_data_.push({
              name: eel,
              ['Total Trips']: mytemD_total[eel] || 0,
              ['Expected Delayed Trips']: mytemD_etd[eel] || 0,
            });
          });
          setetdDataArr([...my_data_]);
          setExportData({
            trip_stats_data: trip_stats_data,
            fem_emp_data: fem_emp_data,
            emp_boarding_stats_data: emp_boarding_stats_data,
          });
          let _tem_d = _.groupBy(tem_all_trip, 'escortTrip');
          setEscortTrip(_tem_d);
          let vehicleArr = [];
          tem_all_trip?.map((ele, ind) => {
            ele?.vehicleDetail?.map((el) => {
              vehicleArr.push({
                ...el?.vehicleTypeDetail,
                noOfPassenger: ele?.routePsDetails?.length,
                selectedInd: _ind,
              });
            });
            if (!ele?.vehicleDetail?.length) {
              vehicleArr.push({
                vehicleType: 'NA',
                noOfPassenger: ele?.routePsDetails?.length,
              });
            }
          });

          let temp__ = [];
          tem_all_trip?.map((ee) => {
            temp__.push({
              ...ee,
              groupkey: ee.shiftName + ' - ' + moment(ee.date).format('DD/MM'),
            });
          });

          setTripByVehicleId(_.groupBy(vehicleArr, 'vehicleType'));
          let empArr = [];
          let empArr2 = [];
          let tem_group_trip = _.groupBy(temp__, 'groupkey');
          let myd_ = {};
          let upemp = 0;
          let downemp = 0;
          let upt = 0;
          let dwnt = 0;
          Object.keys(tem_group_trip).forEach(function (vv, index) {
            let ota_c = [];
            let otd_c = [];
            let ota_emp = [];
            let otd_emp = [];
            tem_group_trip[vv]?.map((el) => {
              if (el.tripType == 'UPTRIP') {
                upt++;
                let expected = el?.shiftInTime;
                let arrival = el?.actualTripCompletionTime;
                if (
                  expected &&
                  arrival &&
                  Number(arrival) <= Number(expected)
                ) {
                  if (!ota_c?.includes(el._id)) ota_c.push(el._id);
                }
                el.routePsDetails?.map((_ee, __i) => {
                  upemp++;
                  if (
                    _ee.actualPickUpDateTime &&
                    _ee.expectedArivalTime &&
                    _ee.actualPickUpDateTime <= _ee.expectedArivalTime
                  ) {
                    ota_emp.push(_ee);
                  }
                });
              } else {
                let expected = el?.shiftOutTime;
                let depart = el?.stopList[0]?.actualDepartureTime;
                if (expected && depart && Number(depart) <= Number(expected)) {
                  if (!otd_c?.includes(el._id)) otd_c.push(el._id);
                }
                dwnt++;
                el?.routePsDetails?.map((_ee, __i) => {
                  downemp++;
                  if (
                    _ee.shiftOutTime &&
                    _ee.actualPickUpDateTime &&
                    _ee.actualPickUpDateTime <= _ee.shiftOutTime
                  ) {
                    otd_emp.push(_ee);
                  }
                });
              }
            });

            myd_[vv] = {
              ota_trip: ota_c || [],
              ota_emp: ota_emp || [],
              otd_emp: otd_emp || [],
              otd_trip: otd_c || [],
              up_trip: upt || 0,
              down_trip: dwnt || 0,
              up_pass: upemp || 0,
              down_pass: downemp || 0,
            };
          });
          setOtaCountTrip(myd_);
          tem_all_trip?.map((el, ind) => {
            empArr2 = empArr2.concat(el?.routePsDetails);
          });
          empArr2?.map((_ee) => {
            if (_ee.gender == 'Female' && _ee.safeReachStatus == 'reached')
              _ee.status = 'SAFEREACHED';
            if (_ee.gender == 'Female' && _ee.safeReachStatus == 'inCab')
              _ee.status = 'INCAB';
            if (_ee.gender == 'Female' && _ee.safeReachStatus == 'notTravel')
              _ee.status = 'NOTTRAVEL';
            if (_ee?.empId) empArr.push(_ee);
          });
          settripByEmpStatus(_.groupBy(empArr, 'status'));
          let temDataByGender = _.groupBy(empArr, 'gender');
          settripByGender({
            Male: _.groupBy(temDataByGender?.Male, 'status'),
            Female: _.groupBy(temDataByGender?.Female, 'status'),
            FemaleCount: temDataByGender?.Female?.length,
          });
          setthermoVal(
            (
              (100 * (temDataByGender?.Female?.length ?? 0)) /
              empArr?.length
            )?.toFixed(0),
          );
          let vendorArr = [];
          let groupByVendor = _.groupBy(tem_all_trip, 'vendorId');
          let i = 0;
          let excelDownVendor = [];
          for (const [key, value] of Object.entries(groupByVendor)) {
            if (key && key != 'null' && key != 'undefined' && value.length) {
              let groupByVType = _.groupBy(value, 'vehicleType');

              Object.keys(groupByVType)?.map((elmt) => {
                excelDownVendor.push({
                  'Vendor Name': value[0].vendorName,
                  'Vehicle Type':
                    elmt == 'null' || elmt == 'undefined' ? 'NA' : elmt,
                  'Supervisor Name': 'NA',
                  'Supervisor Contact Number': 'NA',
                  'Number of Vehicles': groupByVType[elmt]?.length || 0,
                  'Percentage of Vehicles': groupByVType[elmt]?.length
                    ? (groupByVType[elmt]?.length * 100) / value?.length
                    : 0,
                });
              });
              vendorArr.push({
                name: value?.length + (value?.length > 1 ? ' Trips' : ' Trip'),
                value: value?.length ?? 0,
                color: colorArray[i],
                vendor: value[0]?.vendorName,
              }); // (value[0]?.vendorName ?? "Not Assigned") +
              i++;
            }
            setExportDataVendor(excelDownVendor);
            settripByVendor(vendorArr);
            let groupByShiftId = _.groupBy(tem_all_trip, 'status');
            groupByShiftId.count = tem_all_trip?.length;
            settripByStatus(groupByShiftId);
          }
        })
        .catch((err) => {});
    }
    // d.selectedInd = _ind;
    // setSelectedShift([...selectedShift, d]);
  }
  useEffect(() => {
    dispatch(onGetCryptoData());
  }, [dispatch]);
  // useEffect(() => {
  //     if (user) dispatch(setCompanyName(user?.userList?.corporateName))
  // }, [user?.userList?.corporateName])

  useEffect(() => {
    axios
      .get(
        Api.baseUri +
          '/user-reg/siteoffice-reg/corporate?page=0&size=100&officeName=null',
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          dispatch(
            setCompanyName(
              res?.data?.data?.body?.['SiteOffice List'][0]?.companyName +
                '++' +
                res?.data?.data?.body?.['SiteOffice List'][0]?.officeName,
            ),
          );
        }
      })
      .catch((err) => {});
  }, []);

  const [fleetData, setfleetData] = useState([]);
  const [exportData, setExportData] = useState({});
  const [exportDataVendor, setExportDataVendor] = useState([]);
  // const fleetData = [
  //     {
  //         label: 'Four Seater',
  //         value: 20,
  //         color: '#71ab95',
  //         seats: 4
  //     },
  //     {
  //         label: 'Six Seater',
  //         value: 40,
  //         color: '#54bac9',
  //         seats: 6
  //     },
  //     {
  //         label: '16 Seater',
  //         value: 86,
  //         color: '#a79fd8',
  //         seats: 16
  //     },
  //     {
  //         label: '28 Seater',
  //         value: 63,
  //         color: '#e07a64',
  //         seats: 28
  //     },
  // ];
  useEffect(() => {
    if (!_.isEmpty(tripByVehicleId)) {
      let myData = [];
      let ind = 0;
      for (const [key, value] of Object.entries(tripByVehicleId)) {
        let numOfPassengers = 0;
        let numOfSeat = 0;
        value?.map((elem) => {
          numOfPassengers = numOfPassengers + elem?.noOfPassenger;
          numOfSeat = numOfSeat + Number(elem?.maxCapacityExcludingDriver);
        });
        myData.push({
          label: key,
          value: numOfPassengers,
          color: colorArray[ind],
          seats: numOfSeat,
        });
        ind++;
      }
      setfleetData(myData);
    }
  }, [tripByVehicleId]);
  const cryptoData = useSelector(({dashboard}) => dashboard.cryptoData);
  const handleRefresh = () => {
    setLastUpdated(moment().format('HH:mm:ss'));
    setRefresh(true);
    setSelectedShift([]);
    setTemAllTrips([]);
  };
  const handleRefreshClose = () => {
    setRefresh(false);
  };
  return (
    <>
      {/* <Slider rosterChecked={rosterChecked} /> */}
      <div style={{marginTop: '10px'}}>
        <Slider
          rosterChecked={rosterChecked}
          refresh={refresh}
          handleRefreshClose={handleRefreshClose}
        />
        <div style={{padding: '5px'}}></div>
      </div>
      {/* <CustomLabel labelVal='Operations Summary' variantVal='h3-underline' /> */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <CustomLabel
            labelVal='Operations Summary'
            variantVal='h3-underline'
          />
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {' '}
          <ArrowCircleDownIcon
            sx={{marginRight: '12px'}}
            onClick={() => {
              setOpen(true);
            }}
          />
          <RefreshIcon
            onClick={handleRefresh}
            style={{
              cursor: 'pointer',
              transition: 'color 0.3s ease', // Optional: Add a smooth transition effect
              ':hover': {
                color: 'blue', // Change the color on hover
              },
            }}
          />
          <span
            style={{
              marginRight: '8px',
              border: '1px solid #77c3ec',
              borderRadius: '5px',
              padding: '2px',
              background: '#77c3ec',
              color: 'white',
              // float: 'right',
            }}
          >
            Last Updated - {lastUpdated}
          </span>
        </div>
      </div>
      <Operations
        escortTrip={escortTrip}
        tripByStatus={tripByStatus}
        selectedShift={selectedShift}
      />
      <Box sx={{width: '100%', marginTop: '20px'}}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <div className='card-normal min-h-300'>
              <div style={{display: 'flex'}}>
                <div className='card-title'>
                  <div>
                    OTA / OTD
                    {myActions?.includes('Download And Upload') && (
                      <div
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '12px',
                        }}
                      >
                        <FileDownloadIcon
                          className='cursor'
                          onClick={() => {
                            let tem_ota_otd_trip = [];
                            let tem_ota_otd_trip_data = [];
                            let tem_ota_otd_emp = [];
                            Object.values(otaCountTrip)?.map((el) => {
                              let combined_ota_otd_emp = [
                                ...el?.ota_emp,
                                ...el?.otd_emp,
                              ];
                              let combined_ota_otd_trip = [
                                ...el?.otd_trip,
                                ...el?.ota_trip,
                              ];
                              combined_ota_otd_trip?.map((ee) => {
                                if (!tem_ota_otd_trip?.includes(ee))
                                  tem_ota_otd_trip.push(ee);
                              });
                              combined_ota_otd_emp?.map((ee) => {
                                console.log('ee==>>', ee);
                                tem_ota_otd_emp.push({
                                  Shift:
                                    moment(ee.tripDate).format('DD/MM/YYYY') +
                                    ' ' +
                                    ee.shiftTime,
                                  'Trip ID': ee.tripCode,
                                  'Trip Type':
                                    ee.tripType == 'UPTRIP'
                                      ? 'Login'
                                      : 'Logout',
                                  'Employee Code': ee.empCode,
                                  'Vendor Name': ee.vendorId,
                                  'Vehicle Number': ee.vehicleNumber,
                                  'Driver Name': ee.driverName,
                                  'Driver Number': ee.driverMobile,
                                  'Number of Passengers':
                                    ee.noOfPassengerInTrip,
                                  'Number of Noshows': '0',
                                  'Arrival/Departure from Office': moment(
                                    ee.actualPickUpDateTime,
                                  ).format('HH:MM'),
                                  // 'First point on time': 'Y',
                                  // 'Buffer Time': '0',
                                  // 'Delay Status': 'NO',
                                  // Delay: '0 Mins',
                                });
                              });
                            });
                            axios
                              .get(
                                Api.baseUri +
                                  '/user-reg/trip-route/get-trip-by-id?tripId=' +
                                  tem_ota_otd_trip?.join(),
                              )
                              .then((res) => {
                                res?.data?.data?.map((elem) => {
                                  // console.log('elem', elem);
                                  tem_ota_otd_trip_data.push({
                                    Shift:
                                      moment(elem.date).format('DD/MM/YYYY') +
                                      ' ' +
                                      (elem.tripType == 'UPTRIP'
                                        ? new Date(Number(elem.shiftInTime))
                                        : new Date(Number(elem.shiftOutTime))
                                      )
                                        ?.toTimeString()
                                        ?.split(' ')[0],
                                    'Trip ID': elem.tripCode,
                                    'Trip Type':
                                      elem.tripType == 'UPTRIP'
                                        ? 'Login'
                                        : 'Logout',
                                    'Vendor Name': elem.vendorName,
                                    'Vehicle Number': elem.vehicleNo,
                                    'Driver Name': elem.driverName,
                                    'Driver Number': elem.driverMobileNo,
                                    'Number of Passengers':
                                      (elem.numberOfFemalePassengers || 0) +
                                      (elem.numberOfMalePassengers || 0),
                                    // 'Travelled Pax': 10,
                                    'Number of Noshows': '0',
                                    'Office Arrival/Departure Time':
                                      elem.actualTripCompletionTimeStr?.split(
                                        ' ',
                                      )[1],
                                    // 'First point on time': 'Y',
                                    // 'Buffer Time': '0',
                                    // 'Delay Status': 'NO',
                                    // Delay: '0 Mins',
                                  });
                                });
                                if (_.isEmpty(tem_ota_otd_trip_data)) {
                                  toast.error('No Data found!');
                                } else {
                                  downDoc.downloadReport(
                                    {
                                      OTA_OTD_Trip: tem_ota_otd_trip_data,
                                      OTA_OTD_Employees: tem_ota_otd_emp,
                                    },
                                    'OTA/OTD',
                                  );
                                }
                              })
                              .catch((er) => {});
                            return;
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <LineChartComp colorArray={colorArray} mydata={otaCountTrip} />
              {/* <SimpleGauge
                otaCountTrip={otaCountTrip}
                otdCountEmp={otaCountEmp}
              /> */}
            </div>
          </Grid>
          <Grid item xs={12} sm={6}>
            <div className='card-normal min-h-300'>
              <div className='card-title'>
                <div>
                  Trip Stats{' '}
                  {myActions?.includes('Download And Upload') && (
                    <FileDownloadIcon
                      className='cursor'
                      onClick={() => {
                        exportData.trip_stats_data;
                        if (_.isEmpty(exportData?.trip_stats_data)) {
                          toast.error('No Data found!');
                        } else {
                          downDoc.downloadReport(
                            {
                              Trip_Stats: exportData?.trip_stats_data,
                            },
                            'Trip Stats',
                          );
                        }
                      }}
                      style={{position: 'absolute', right: '8px'}}
                    />
                  )}
                </div>
              </div>
              <div style={{padding: '14px'}}>
                <div style={{padding: '14px'}}>
                  <Pie
                    chartArr={[
                      tripByStatus?.SCHEDULE?.length ?? 0,
                      tripByStatus?.STARTED?.length ?? 0,
                      tripByStatus?.COMPLETED?.length ?? 0,
                      otherStatus ?? 0,
                    ]}
                    type={'DOUGHNUT'}
                    colorCode={['#f2726f', '#ffc534', '#63b58f', 'orange']}
                    labels={[
                      'Not Started',
                      'Inprogress',
                      'Completed',
                      'Others',
                    ]}
                    headLabel={'Total Trips'}
                  />
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={6}>
            <div className='card-normal min-h-300'>
              <div className='card-title'>
                <div>
                  Employees Boarding Status{' '}
                  {myActions?.includes('Download And Upload') && (
                    <FileDownloadIcon
                      className='cursor'
                      onClick={() => {
                        if (_.isEmpty(exportData?.emp_boarding_stats_data)) {
                          toast.error('No Data found!');
                        } else {
                          downDoc.downloadReport(
                            {
                              Employee_Boarding_Status:
                                exportData?.emp_boarding_stats_data,
                            },
                            'Employee Boarding Status',
                          );
                        }
                      }}
                      style={{position: 'absolute', right: '8px'}}
                    />
                  )}
                </div>
              </div>
              <div className='min-h-300' style={{padding: '14px'}}>
                <Pie
                  chartArr={[
                    tripByEmpStatus?.BOARDED?.length ?? 0,
                    tripByEmpStatus?.SCHEDULE?.length ?? 0,
                    tripByEmpStatus?.NOSHOW?.length ?? 0,
                    tripByEmpStatus?.COMPLETED?.length ?? 0,
                    tripByEmpStatus?.ABSENT?.length ?? 0,
                  ]}
                  type={'PIE'}
                  colorCode={[
                    '#2078b5',
                    '#f2726f',
                    '#fe7f10',
                    '#63b58f',
                    '#ffc534',
                  ]}
                  labels={[
                    'Boarded',
                    'Not Boarded',
                    'No Show',
                    'Completed',
                    'Absent',
                  ]}
                  headLabel={'Total Employees'}
                />
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={6}>
            <div className='card-normal min-h-300'>
              <div className='card-normal min-h-300'>
                <div style={{display: 'flex'}}>
                  <div
                    className='card-title'
                    style={{
                      width: 'calc(50% - 8px)',
                      borderRight: '1px solid #eceaea',
                    }}
                  >
                    <div>Compliant Drivers </div>
                  </div>
                  <div className='card-title' style={{width: '50%'}}>
                    <div>
                      Compliant Vehicles
                      {/* <FileDownloadIcon
                        className='pointer'
                        style={{position: 'absolute', right: '8px'}}
                      /> */}
                    </div>
                  </div>
                </div>
                <SimpleGuageComp for={'Compliances'} />
              </div>
            </div>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{width: '100%', marginTop: '20px'}}>
        <Grid container rowSpacing={2} columnSpacing={{xs: 4}}>
          <Grid item xs={12} sm={8}>
            <div className='card-normal min-h-300'>
              <div className='card-title'>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>Female Employees Travelling</div>
                  {myActions?.includes('Download And Upload') && (
                    <FileDownloadIcon
                      className='cursor'
                      onClick={() => {
                        if (_.isEmpty(exportData?.fem_emp_data)) {
                          toast.error('No Data found!');
                        } else {
                          downDoc.downloadReport(
                            {
                              Female_Stats: exportData.fem_emp_data,
                            },
                            'Female Stats',
                          );
                        }
                      }}
                    />
                  )}
                </div>
              </div>
              <Grid container rowSpacing={2} columnSpacing={{xs: 4}}>
                <Grid item xs={12} sm={5}>
                  <div className='female-first-box-grid'>
                    <div className='female-temperature'>
                      <div style={{position: 'relative'}}>
                        <div
                          style={{
                            left: '-41px',
                            position: 'absolute',
                            bottom:
                              (thermoVal > 90
                                ? Number(thermoVal) - 8
                                : thermoVal > 60
                                ? Number(thermoVal) - 5
                                : thermoVal > 30
                                ? Number(thermoVal) - 3
                                : Number(thermoVal)) + '%',
                          }}
                        >
                          <span
                            style={{fontWeight: '600', marginLeft: '-14px'}}
                          >
                            {(thermoVal || 0) + ' %'}
                          </span>{' '}
                          <ArrowRightIcon
                            style={{position: 'absolute', top: '-3px'}}
                          />{' '}
                        </div>
                        <div
                          style={{
                            background: 'white',
                            width: '50px',
                            height: '200px',
                            padding: '5px',
                            border: '2px solid #737374',
                            borderRadius: '25px',
                          }}
                        >
                          <div
                            style={{
                              background: '#0dae9b',
                              height: '100%',
                              border: '1px solid #white',
                              borderRadius: '25px',
                            }}
                          >
                            <div
                              style={{
                                background: 'white',
                                height: (100 - Number(thermoVal) ?? 100) + '%',
                                border: 'none',
                                borderTopRightRadius: '25px',
                                borderTopLeftRadius: '25px',
                                borderBottomRightRadius: !Number(thermoVal)
                                  ? '25px'
                                  : '',
                                borderBottomLeftRadius: !Number(thermoVal)
                                  ? '25px'
                                  : '',
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className='female-bottom-text'>Trend</div>
                    </div>
                    <div style={{position: 'relative'}}>
                      <div className='female-count-box'>
                        <span>
                          <p
                            style={{
                              fontSize: '25px',
                              fontWeight: 800,
                              color: '#1477b1',
                            }}
                          >
                            {tripByGender?.FemaleCount ?? 0}
                          </p>
                          Female Employees
                          <br />
                          Travelling in trip
                        </span>
                      </div>
                    </div>
                  </div>
                </Grid>
                <Grid item xs={12} sm={7}>
                  <div className='female-right-container'>
                    <div className='female-bottom-text-right'>
                      Total Female Employees:{' '}
                      {' ' + (tripByGender?.FemaleCount ?? 0)}
                    </div>
                    <div style={{width: '90%', padding: '5px'}}>
                      <Bar
                        data={data}
                        width={null}
                        height={null}
                        options={options}
                      />
                    </div>
                    <div className='female-bar-graph-bottom-section'>
                      {data?.datasets[0]?.backgroundColor?.map((elem, ind) => {
                        return (
                          <div className='bar-graph-bottom-color-box-wrapper'>
                            <div
                              className='bar-graph-bottom-color-box'
                              style={{background: elem}}
                            ></div>
                            <span className='bar-graph-bottom-labels'>
                              {data?.labels[ind] +
                                ': ' +
                                data?.datasets[0]?.data[ind]}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Grid>
              </Grid>
            </div>
          </Grid>
          <Grid item xs={12} sm={4}>
            <div className='card-normal min-h-300'>
              <div className='card-title'>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>Expected Delayed Trip</div>{' '}
                  {myActions?.includes('Download And Upload') && (
                    <FileDownloadIcon
                      onClick={() => {
                        console.log('etdDataCSV', etdDataCSV);
                        if (_.isEmpty(etdDataCSV)) {
                          toast.error('No Data found!');
                        } else {
                          downDoc.downloadReport(
                            {
                              EXPECTED_DELAYED: etdDataCSV,
                            },
                            'Expected Delayed',
                          );
                        }
                      }}
                    />
                  )}
                </div>
              </div>
              <Grid container rowSpacing={2} columnSpacing={{xs: 4}}>
                <Grid item xs={12} sm={12}>
                  <div className='female-right-container'>
                    {/* <div className='female-bottom-text-right'>
                      Expected Delayed Trip{' '}
                      {' ' + (tripByGender?.FemaleCount ?? 0)}
                    </div> */}
                    {/* <Bar
                      data={data}
                      width={null}
                      height={null}
                      options={options}
                      style={{margingBottom: '20px'}}
                    /> */}
                    <BarChartComp data={etdDataArr} />
                    {/* <LineChartComp /> */}
                  </div>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{width: '100%', marginTop: '20px'}}>
        <Grid container rowSpacing={2} columnSpacing={{xs: 4}}>
          <Grid item xs={12} sm={12}>
            {fleetData?.length &&
            !(
              fleetData?.length == 1 &&
              fleetData[0]?.label == 'NA' &&
              isNaN(fleetData[0]?.seats)
            ) ? (
              <FleetMix title='Fleet Mix' data={fleetData} />
            ) : null}
          </Grid>
        </Grid>
      </Box>
      {/* <Services /> */}
      <br />
      {/* <Ticket /> */}

      <Dialog
        // onClose={CloseDetailPage}
        open={open}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '60%',
          },
        }}
        style={{borderRadius: '4rem'}}
        // aria-labelledby="alert-dialog-title"
        // aria-describedby="alert-dialog-description"
      >
        <div>
          <DialogContent style={{padding: '0px'}}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                background: '#f5f2f2',
                height: '4rem',
                paddingRight: '1.5rem',
                paddingLeft: '1.5rem',
              }}
            >
              <h1 style={{marginTop: '1.5rem'}}>Download Consolidate Report</h1>
              <CloseIcon
                onClick={() => {
                  setOpen(false);
                }}
                style={{
                  marginTop: '1.4rem',
                  color: '#4f4f4f',
                  fontWeight: 'bold',
                }}
              />
            </div>

            <div style={{padding: '1rem'}}>
              <SmartForm
                template={templateDownload}
                onSubmit={handleDownload}
                buttons={['pdf']}
              />
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </>
  );
};

export default VendorDashboard;
