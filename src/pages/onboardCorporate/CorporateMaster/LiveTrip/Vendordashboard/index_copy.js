import React, {useEffect, useState} from 'react';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {useNavigate} from 'react-router-dom';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import {Button, Tooltip, Checkbox, selectClasses} from '@mui/material';
import CustomLabel from 'pages/common/CustomLabel';
import {Box} from '@mui/system';
import {Grid} from '@mui/material';
import Slider from './carousel';
import Api from '@api';
import axios from 'axios';
// import LiveTrip from '../LiveTrip';
import ParentBox from '../Vendordashboard/ParentBox/ParentBox';
import moment from 'moment';
import {element, object} from 'prop-types';
import {SelectAllRounded} from '@mui/icons-material';
import {useSelector} from 'react-redux';
import AppLoader from '@crema/core/AppLoader';
import Operations from 'pages/home/Home/CorporateAdmin/operations';
import _, {indexOf} from 'lodash';
import NoDataFound from '@common/NoDataFound';

const VendorDashboard = () => {
  const {user} = useAuthUser();
  const navigate = useNavigate();
  const [myActions, setMyActions] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(moment().format('HH:mm:ss'));
  const permissionCheck = useSelector(({settings}) => settings.permissions);
  useEffect(() => {
    if (!permissionCheck) return;
    let sub_mod = {};
    permissionCheck?.map((el) => {
      if (el.subModuleName == 'Active Trips') sub_mod = el;
    });
    setMyActions(sub_mod?.actions);
    if (
      (!sub_mod || !sub_mod?.actions?.includes('View')) &&
      user?.userList?.userRole !== 'SUPERADMIN'
    )
      navigate('/error-pages/error-404');
  }, [permissionCheck, user]);
  const [openFilter, setOpenFilter] = React.useState(false);
  const [trip, setTrip] = useState();
  const [data, setData] = useState();
  const [tripData, setTripData] = useState({});
  const [tripType, setTripType] = useState();
  const [tripDates, setTripDates] = useState([]);
  const [Timer, setTimer] = React.useState();
  const [selectedTrip, setSelectedTrip] = useState([]);
  const [loading, setLoading] = useState(false);
  const [escortTrip, setEscortTrip] = useState();
  const [tripByStatus, settripByStatus] = useState();
  useEffect(() => {
    if (user?.userList?.userStatus == 'DEFAULT') {
      navigate('/my-profile');
    }
  }, [user?.userList?.userStatus]);

  useEffect(() => {
    shiftList();
  }, []);

  useEffect(() => {
    const interval = window.setInterval(function () {
      getAllData();
      const currentTimestamp = moment().format('HH:mm:ss');
      setLastUpdated(currentTimestamp);
    }, 1000 * 60 * 1);

    return () => {
      clearInterval(interval);
    };
  }, [selectedTrip]);
  async function getAllData() {
    let myTripObj = {};
    let tempArr = [];
    await Promise.all(
      selectedTrip?.map(async (d) => {
        tempArr.push(d);
        myTripObj[
          d?.tripDate +
            'T' +
            (d.tripType == 'UPTRIP' ? d.shiftStart : d.shiftEnd) +
            ':00Z'
        ] = await getTripByShiftID(d);
      }),
    );
    setSelectedTrip([...tempArr]);
    setTripData({...myTripObj});
  }

  function shiftList() {
    setLoading(true);
    axios
      .get(
        Api.baseUri +
          `/user-reg/trip-route/get-all-trips-shifts/${user?.userList?.corporateId}/2023-10-10/2023-10-12`,
      )
      .then((res) => {
        setData(res?.data?.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }
  async function getTripByShiftID(d) {
    let res = await axios.get(
      Api.baseUri +
        `/user-reg/trip-route/get-all-trips-by-shift/${d?.tripDate}/${d?.shiftId}/${d?.tripType}/${d?.tripTime}`,
    );
    return res?.data?.data;
  }

  async function rosterChecked(d) {
    let myTripObj = tripData ?? {};
    myTripObj[
      d?.tripDate +
        'T' +
        (d.tripType == 'UPTRIP' ? d.shiftStart : d.shiftEnd) +
        ':00Z'
    ] = await getTripByShiftID(d);
    let tempArr = [];
    let d_arr = [];
    let type_arr = [];
    let categ_arr = [];
    let is_avl = false;
    console.log('selectedTrip', selectedTrip);
    selectedTrip?.map((el) => {
      if (el?.id == d?.id) {
        if (selectedTrip?.length > 1) {
          delete myTripObj[
            d?.tripDate +
              'T' +
              (d.tripType == 'UPTRIP' ? d.shiftStart : d.shiftEnd) +
              ':00Z'
          ];
          is_avl = true;
        }
      } else {
        tempArr.push(el);
        d_arr.push(
          el.tripDate +
            'T' +
            (el.tripType == 'UPTRIP' ? el.shiftStart : el.shiftEnd) +
            ':00Z',
        );
        type_arr.push(el.tripType);
      }
    });
    if (!is_avl) {
      d_arr.push(
        d.tripDate +
          'T' +
          (d.tripType == 'UPTRIP' ? d.shiftStart : d.shiftEnd) +
          ':00Z',
      );
      type_arr.push(d.tripType);
      categ_arr.push(d.tripCategory);

      tempArr.push(d);
    }
    setTripDates(d_arr);
    setTripType(type_arr);
    setSelectedTrip([...tempArr]);
    setTripData({...myTripObj});
  }

  useEffect(() => {
    if (data?.length) rosterChecked(data[0]);
  }, [data]);

  useEffect(() => {
    let tempArr = [];

    Object.entries(tripData).map(([key, value], i) => {
      tempArr.push(value);
    });
    console.log('tempArr', tempArr);
    let array1 = tempArr[1];
    let array2 = tempArr[2];

    let result = array1?.concat(array2);
    console.log('result', result);
    let _tem_d = _.groupBy(result, 'escortTrip');
    setEscortTrip(_tem_d);
    let groupByShiftId = _.groupBy(result, 'status');
    groupByShiftId.count = result?.length;
    settripByStatus(groupByShiftId);
  }, [tripData]);
  return (
    <>
      {data?.length ? (
        <>
          <Slider shiftData={data} rosterChecked={rosterChecked} />
          <div style={{float: 'right', paddingRight: '20px'}}>
            <span
              style={{
                marginRight: '8px',
                border: '1px solid #77c3ec',
                borderRadius: '5px',
                padding: '2px',
                background: '#77c3ec',
                color: 'white',
                float: 'right',
              }}
            >
              Last Updated - {lastUpdated}
            </span>
          </div>
          <Operations
            escortTrip={escortTrip}
            tripByStatus={tripByStatus}
            // selectedShift={selectedShift}
            // tripByEmpStatus={tripByEmpStatus}
          />
        </>
      ) : (
        <p
          style={{
            margin: 'auto',
            marginTop: '30px',
            fontSize: '100%',
            fontWeight: 'bold',
          }}
        >
          {loading ? <AppLoader /> : <NoDataFound />}
        </p>
      )}
    </>
  );
};

export default VendorDashboard;
