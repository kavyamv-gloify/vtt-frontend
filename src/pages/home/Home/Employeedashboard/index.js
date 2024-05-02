import {defaultFormat} from 'moment';
import React, {useEffect, useState} from 'react';
import {useAuthUser} from '@crema/utility/AuthHooks';
// import TripBox from './TripBox/Trip';
import ServicesBox from '../Common Component/Services/Services';
import RequestBoxes from './Request Box/index';
import Slider from './ShiftCard/carousel';
import {useNavigate} from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import Api from '@api';
import _ from 'lodash';
import CustomLabel from 'pages/common/CustomLabel';
import TripSpare from './TripSpare/TripSpare';
import {setAdhocCount, setLeaveCount} from 'redux/actions';
import {useDispatch} from 'react-redux';
import lodash from '@smart-form/lodash';
const Employeedashboard = () => {
  const navigate = useNavigate();
  const {user} = useAuthUser();
  const [data, setData] = useState();
  const [selectedShift, setSelectedShift] = useState();
  const [tripData, setTripData] = useState();
  const [tripdesc, setTripDesc] = useState({});
  const [location, setLocation] = useState({});
  const [tripID, setTripId] = useState([]);
  const [tripStartTime, setTripStartTime] = useState();
  const [adhocTrip, setAdhocTrip] = useState([]);
  const [empLeave, setEmpLeave] = useState([]);
  useEffect(() => {
    if (user?.userList?.userStatus == 'DEFAULT') {
      navigate('/my-profile');
    }
  }, [user?.userList?.userStatus]);
  //
  // useEffect(() => {
  //   let postData = {
  //     corporateId: user?.userList?.corporateId,
  //     fromDate: moment().subtract(2, 'days').format('YYYY-MM-DD'),
  //     // "fromDate": "2023-01-04",
  //     toDate: moment().add(2, 'days').format('YYYY-MM-DD'),
  //     //  "toDate": "2023-01-08",
  //     sort: -1,
  //   };

  //   axios
  //     .post(Api.baseUri + '/api/dashboard/analytics/shifts', postData)
  //     .then((res) => {
  //       setData(res?.data?.data);
  //       let temArr = [];
  //       res?.data?.data?.map((el) => {
  //         let postdata = {
  //           shiftId: el?.shiftId,
  //           tripType: el?.tripType,
  //           date: el?.tripDate,
  //           // "fromDate": "2023-01-08",
  //           // "toDate": moment().add(2, 'days').format('YYYY-MM-DD')
  //         };
  //         axios
  //           .post(
  //             Api.baseUri + '/api/dashboard/analytics/tripsByShift',
  //             postdata,
  //           )
  //           .then((res) => {
  //             //
  //             temArr = temArr.concat(res?.data);
  //             //
  //             setTripData([...temArr]);
  //           })
  //           .catch((err) => {});
  //       });
  //     })
  //     .catch((err) => {});
  // }, []);
  useEffect(() => {
    shiftList();
  }, []);
  function shiftList() {
    let post_data = {
      corporateId: user?.userList?.corporateId,
      fromDate: moment(new Date().setDate(new Date().getDate() - 1)).format(
        'YYYY-MM-DD',
      ),
      toDate: moment(new Date().setDate(new Date().getDate() + 1)).format(
        'YYYY-MM-DD',
      ),
      sort: -1,
    };
    // setLoading(true);
    // let postData = {
    //   corporateId: user?.userList?.corporateId,
    //   fromDate: moment(new Date().setDate(new Date().getDate())).format(
    //     'YYYY-MM-DD',
    //   ),
    //   toDate: moment(new Date().setDate(new Date().getDate() + 2)).format(
    //     'YYYY-MM-DD',
    //   ),
    //   // fromDate: '2023-10-10',
    //   // toDate: '2023-10-12',
    //   sort: -1,
    // };
    // .post(Api.baseUri + '/api/dashboard/analytics/shifts', postData)
    axios
      .get(
        Api.baseUri +
          `/user-reg/trip-route/get-all-trips-shifts-for-employee/${post_data?.corporateId}/${post_data?.fromDate}/${post_data?.toDate}`,
      )
      .then((res) => {
        setData(res?.data?.data);
        // setLoading(false);
      })
      .catch((err) => {
        // setLoading(false);
      });
  }
  async function rosterChecked(d) {
    let res = await axios.get(
      Api.baseUri +
        `/user-reg/trip-route/get-all-trips-by-shift/${d?.tripDate}/${d?.shiftId}/${d?.tripType}/${d?.tripTime}`,
    );
    console.log('res', res?.data?.data);
    setTripData(res?.data?.data);
    return res?.data?.data;
    // setTripStartTime({
    //   time: d?.startTime,
    //   date: d?.date,
    //   category: d?.tripCategory,
    // });
    // let temp = {};
    // d?.empIds?.map((e) => {
    //   if (e?.empId === user?.userList?.profileId) {
    //     temp.pickupLocation =
    //       e.tripType == 'UPTRIP' ? e?.location : e?.officeLocation;
    //     temp.officeLocation =
    //       e.tripType == 'UPTRIP' ? e?.officeLocation : e?.location;
    //     temp.photo = e?.photo;
    //   }
    // });
    // setLocation(temp);

    // setTripDesc({
    //   tripCode: d?.tripCode,
    //   date: d?.date,
    //   employees: d?.empDetails?.length,
    //   whole_data: d,
    // });
    // setSelectedShift(d._id);
  }

  // useEffect(() => {
  //   let postData = {
  //     shiftId: selectedShift,
  //     tripType: 'UPTRIP',
  //     fromDate: moment().subtract(2, 'days').format('YYYY-MM-DD'),
  //     toDate: moment().add(2, 'days').format('YYYY-MM-DD'),
  //   };
  //   axios
  //     .post(Api.baseUri + '/api/dashboard/analytics/tripsByShift', postData)
  //     .then((res) => {})
  //     .catch((err) => {});
  // }, [selectedShift]);

  // useEffect(() => {
  //   //
  //   if (tripdata?.length) rosterChecked(tripdata[0]);
  // }, [tripdata]);
  const dispatch = useDispatch();

  // for Adhoc count and Manage Leave Count
  async function result() {
    let res = await axios.get(
      Api.baseUri + '/user-reg/adhoc-trip/get-adhoc-request-by-empid',
    );
    if (res?.data?.status == '200') {
      let pendingList = _.groupBy(res?.data?.data, 'status');
      dispatch(setAdhocCount(pendingList?.PENDING?.length || 0));
    }
  }

  const getAllLeave = () => {
    let url = `${Api.leave.getAll}`;
    let postData = {
      empId:
        user?.userList?.userRole == 'EMPLOYEE' ? user?.userList?.profileId : '',
      status: '',
      empCode: '',
      fromDate: '',
      toDate: '',
      departmentId: '',
      managerId: '',
    };
    axios
      .post(url, postData)
      .then((res) => {
        if (res?.data?.status == '200') {
          let list = _.groupBy(res?.data?.data, 'status');
          dispatch(setLeaveCount(list?.PENDING?.length || 0));
        }
      })
      .catch((err) => {
        console.log('error');
      });
  };

  useEffect(() => {
    result();
    getAllLeave();
    if (data?.length) {
      rosterChecked(data[0]);
    }
  }, [data]);

  useEffect(() => {
    console.log('tripData', tripData);
  }, [tripData]);
  return (
    <>
      {data?.length ? (
        <Slider rosterChecked={rosterChecked} data={data} />
      ) : null}
      {data?.length ? (
        <TripSpare
          tripdata={tripData}
          // location={location}
          // tripTime={tripStartTime}
        />
      ) : null}
      {/* <ServicesBox /> */}
      <RequestBoxes />
    </>
  );
};

export default Employeedashboard;
