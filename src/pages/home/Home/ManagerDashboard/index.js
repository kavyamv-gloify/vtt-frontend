import React, {useEffect, useState} from 'react';
import {useAuthUser} from '@crema/utility/AuthHooks';
import Operations from './Operations/Operations';
import Ticket from './Ticket/Ticket';
import Slider from './ShiftCard/carousel';
import moment from 'moment';
import Api from '../../../../@api';
import axios from 'axios';
import _ from 'lodash';
// import {
//   setAdhocCountManager,
//   setLeaveCountManager,
//   setScheduleCountManager,
// } from 'redux/actions';
import {useDispatch} from 'react-redux';

const ManagerDashBoard = () => {
  const [data, setData] = useState();
  const {user} = useAuthUser();
  const [tripPSData, setTripPSData] = useState({});
  const [counts, setCounts] = useState([]);
  const [countsLeave, setCountsLeave] = useState([]);
  const dispatch = useDispatch();

  // for Adhoc count and Manage Leave Count
  // useEffect(() => {
  //   result();
  //   resultLeave();
  //   scheduleCount();
  // }, []);
  // async function result() {
  //   let res = await axios.get(
  //     Api.baseUri +
  //       '/user-reg/adhoc-trip/get-adhoc-request-by-managerid/' +
  //       user?.userList?.profileId,
  //   );
  //   if (res?.data?.status == '200') {
  //     // dispatch(setAdhocCountManager(res?.data?.data?.length));
  //     setCounts(res?.data?.data);
  //   }
  // }

  // function groupBy(array, getKey) {
  //   return array?.reduce((result, element) => {
  //     const key = getKey(element);
  //     (result[key] || (result[key] = [])).push(element);
  //     return result;
  //   }, {});
  // }
  // console.log('counts', counts);
  // let groupedByStatus = groupBy(counts, ({status}) =>
  //   status === 'PENDING' ? status : '',
  // );
  // let pendingArray = groupedByStatus['PENDING'] || [];
  // dispatch(setAdhocCountManager(pendingArray));

  // async function resultLeave() {
  //   let res = await axios.get(
  //     Api.baseUri +
  //       '/user-reg/adhoc-trip/get-adhoc-request-by-managerid/' +
  //       user?.userList?.profileId,
  //   );
  //   if (res?.data?.status == '200') {
  //     // dispatch(setLeaveCountManager(res?.data?.data?.length));
  //     setCountsLeave(res?.data?.data);
  //   }
  // }
  // let groupedByStatusLeave = groupBy(countsLeave, ({status}) =>
  //   status === 'PENDING' ? status : '',
  // );
  // let pendingArrayLeave = groupedByStatusLeave['PENDING'] || [];
  // // dispatch(setLeaveCountManager(pendingArrayLeave));

  // async function scheduleCount() {
  //   let res = await axios.get(
  //     Api.baseUri + '/user-reg/roaster/get-team-roaster-req',
  //   );
  //   if (res?.data?.status == '200') {
  //     dispatch(setScheduleCountManager(res?.data?.data?.length));
  //   }
  // }
  const [escortTrip, setEscortTrip] = useState([]);
  const [tripByStatus, settripByStatus] = useState();
  const [selectedShift, setSelectedShift] = useState([]);
  const [tripByEmpStatus, settripByEmpStatus] = useState();
  const [temAllTrips, setTemAllTrips] = useState([]);
  const [totalTrip, setTotalTrip] = useState();
  function differencebetweenTime(d1, d2) {
    if (!d1 || !d2) return;
    let td1 = new Date(d1);
    let td2 = new Date(d2);
    let dif = td2 - td1;
    dif = Math.round(dif / 1000 / 60);
    return dif;
  }
  useEffect(() => {
    rosterChecked(data?.[0], 'ADD', 0);
  }, [data]);
  useEffect(() => {
    let post_data = {
      corporateId: user?.userList?.corporateId,
      fromDate: moment().subtract(2, 'days').format('YYYY-MM-DD'),
      toDate: moment().add(2, 'days').format('YYYY-MM-DD'),
      sort: -1,
    };
    axios
      .get(
        Api?.baseUri +
          `/user-reg/trip-route/get-all-trips-shifts/${post_data?.corporateId}/${post_data?.fromDate}/${post_data?.toDate}`,
      )
      .then((res) => {
        console.log('res', res);
        setData(res?.data?.data);
        // rosterChecked(res?.data?.data[0]);
      })
      .catch((err) => {});
  }, []);

  async function rosterChecked(d, _type, _ind) {
    if (d?.shiftId || d?.tripCategory == 'ADHOCTRIP') {
      let tripTime = d?.tripTime;
      if (d?.tripCategory != 'ADHOCTRIP') {
        tripTime = null;
      }
      if (_type === 'REMOVE') {
        const tem_ARRAY = selectedShift?.filter(
          (elem) => elem?.selectedInd !== _ind,
        );
        setSelectedShift(tem_ARRAY);
      } else {
        d.selectedInd = _ind;
        setSelectedShift([...selectedShift, d]);
      }
      axios
        .get(
          Api.baseUri +
            `/user-reg/trip-route/get-all-trips-by-shift/${d?.tripDate}/${d?.shiftId}/${d?.tripType}/${tripTime}`,
        )
        .then((res) => {
          let tem_all_trip;
          if (_type == 'ADD') {
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

          setTemAllTrips((pre) => {
            return tem_all_trip;
          });
          let trip_stats_data = [];
          let fem_emp_data = [];
          let emp_boarding_stats_data = [];
          let my_data_ = [];
          let mytemD_total = {};
          let mytemD_etd = {};
          let expectedDelayedData = [];
          console.log('tem_all_trip', tem_all_trip);
          setTotalTrip(tem_all_trip);
        })
        .catch((err) => {});
    }
  }

  return (
    <>
      <Slider rosterChecked={rosterChecked} data={data} />
      <div style={{marginTop: '20px', marginBottom: '20px'}}>
        <Operations
          // escortTrip={escortTrip}
          // tripByStatus={tripByStatus}
          // selectedShift={selectedShift}
          // tripByEmpStatus={tripByEmpStatus}
          totalTrip={totalTrip}
        />
      </div>
      <Ticket />
    </>
  );
};

export default ManagerDashBoard;
