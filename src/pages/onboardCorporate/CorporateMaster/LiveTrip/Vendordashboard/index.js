import React, {useEffect, useState} from 'react';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {useNavigate} from 'react-router-dom';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import {
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  Grid,
  Autocomplete,
  Button,
} from '@mui/material';
import Slider from './carousel';
import Api from '@api';
import axios from 'axios';
// import LiveTrip from '../LiveTrip';
import ParentBox from '../Vendordashboard/ParentBox/ParentBox';
import moment from 'moment';
import _, {indexOf} from 'lodash';
import {useSelector} from 'react-redux';
import AppLoader from '@crema/core/AppLoader';
import NoDataFound from '@common/NoDataFound';
import SearchIcon from '@mui/icons-material/Search';
import AppTooltip from '@crema/core/AppTooltip';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import CloseIcon from '@mui/icons-material/Close';
import {styled, lighten, darken} from '@mui/system';
const GroupHeader = styled('div')(({theme}) => ({
  position: 'sticky',
  top: '-8px',
  textAlign: 'center',
  padding: '4px 10px',
  color: theme.palette.primary.main,
  backgroundColor:
    theme.palette.mode === 'light'
      ? lighten(theme.palette.primary.light, 0.85)
      : darken(theme.palette.primary.main, 0.8),
}));

const GroupItems = styled('ul')({
  padding: 0,
});
const groupList = [
  {
    label: 'Absent', // [' + (counts_?.T_ABSENT || 0) + ']',
    value: 'ABSENT',
    groupName: '--Trip--',
  },
  {
    label: 'Cancelled', // [' + (counts_?.T_CANCELLED || 0) + ']',
    value: 'CANCLED',
    groupName: '--Trip--',
  },
  {
    label: 'No Show', // [' + (counts_?.T_NOSHOW || 0) + ']',
    value: 'NOSHOW',
    groupName: '--Trip--',
  },
  {
    label: 'Completed', // [' + (counts_?.T_COMPLETED || 0) + ']',
    value: 'COMPLETED',
    groupName: '--Trip--',
  },
  {
    label: 'In Progress', // [' + (counts_?.T_STARTED || 0) + ']',
    value: 'STARTED',
    groupName: '--Trip--',
  },
  {
    label: 'Yet to Start', // [' + (counts_?.T_SCHEDULE || 0) + ']',
    value: 'SCHEDULE',
    groupName: '--Trip--',
  },
  {
    label: 'Not Executed', // [' + (counts_?.T_EXPIRED || 0) + ']',
    value: 'EXPIRED',
    groupName: '--Trip--',
  },
  {
    label: 'Vehicle Allocated', // [' + (counts_?.VEH_ASSIGN || 0) + ']',
    value: 'VEHICLE_ASSIGN',
    groupName: '--Trip--',
  },
  {
    label: 'Vehicle Not Allocated', // [' + (counts_.ALL - counts_?.VEH_ASSIGN || 0) + ']',
    value: 'VEHICLE_NONE',
    groupName: '--Trip--',
  },
  {
    label: 'Allocated to Vendor', // [' + (counts_?.VEN_ASS || 0) + ']',
    value: 'VENDOR_ASSIGN',
    groupName: '--Trip--',
  },
  {
    label: 'Vendor Not Allocated', // [' + (counts_?.VEN_NASS || 0) + ']',
    value: 'VENDOR_NONE',
    groupName: '--Trip--',
  },
  {
    label: 'Allocated to Driver', // [' + (counts_?.DRI_ASS || 0) + ']',
    value: 'ACCEPT',
    groupName: '--Trip--',
  },
  {
    label: 'Driver Not Allocated', // [' + (counts_?.DRI_NASS || 0) + ']',
    value: 'ASSIGN',
    groupName: '--Trip--',
  },
  {
    label: 'Escort Trip', // [' + (counts_?.ESCORT || 0) + ']',
    value: 'YES',
    groupName: '--Trip--',
  },
  {
    label: 'Absent', // [' + (counts_?.E_ABSENT || 0) + ']',
    value: 'ABSENT',
    groupName: '--Employee--',
  },
  {
    label: 'Cancelled', // [' + (counts_?.E_CANCELLED || 0) + ']',
    value: 'CANCLED',
    groupName: '--Employee--',
  },
  {
    label: 'No Show', // [' + (counts_?.E_NOSHOW || 0) + ']',
    value: 'NOSHOW',
    groupName: '--Employee--',
  },
  {
    label: 'Female', // [' + (counts_?.E_FEM || 0) + ']',
    value: 'NO_OF_FEMALE',
    groupName: '--Employee--',
  },
  // {
  //   label: 'Special Employee',
  //   value: 'SPECIAL_EMPLOYEE',
  //   groupName: '--Employee--',
  // },
  {
    label: 'Geofence Violation',
    value: 'GEOFENCE_VIOLATION',
    groupName: '--Employee--',
  },
];

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
  const [count, setCount] = useState();
  const [filteredTripData, setFilteredTripData] = useState({});
  const [tripCodeFilter, setTripCodeFilter] = useState('');
  const [filterPopUp, setFilterPopUp] = useState(false);
  const [filter, setFilter] = useState({});
  const [groupFilter, setGroupFilter] = useState({});
  const [localities, setLocalities] = useState();
  const [localitiesValue, setLocalitiesValue] = useState();
  const [autocompleteOptions, setAutocompleteOptions] = useState([]);

  useEffect(() => {
    const localitiesSet = new Set();
    tripData &&
      Object.keys(tripData)?.forEach((key) => {
        tripData[key]?.forEach((trip) => {
          trip.stopList?.forEach((stop) => {
            stop?.onBoardPassengers?.forEach((passenger) => {
              const locality = passenger?.location?.locality;
              if (locality) {
                localitiesSet.add(locality);
              }
            });
          });
        });
      });
    const localitiesArray = Array.from(localitiesSet).sort();
    setLocalities(localitiesArray);
    setAutocompleteOptions(
      localitiesArray.map((locality) => ({title: locality, value: locality})),
    );
  }, [tripData]);
  // useEffect(() => {
  //   let temp = [];
  //   axios
  //     .get(Api.baseUri + '/user-reg/employee-reg/getLocalitiesData')
  //     .then((res) => {
  //       res?.data?.data?.map((el) => {
  //         temp.push({title: el?.locality, value: el?.locality});
  //       });

  //       setLocalities(temp);
  //     })
  //     .catch((err) => {
  //       console.log('err', err);
  //     });
  // }, []);
  const filterTripData = () => {
    const filteredData = {};
    Object.keys(tripData).forEach((key) => {
      const trips = tripData[key].filter((trip) => {
        // Filter by trip code
        const isTripCodeMatch = trip?.tripCode
          ?.toUpperCase()
          ?.includes(tripCodeFilter?.toUpperCase());
        const isEmployeeCodeMatch = trip?.empDetails.some((employee) =>
          employee.employeeCode
            .toUpperCase()
            ?.includes(tripCodeFilter?.toUpperCase()),
        );
        const isLocalityMatch = localitiesValue
          ? trip?.stopList?.some((stop) =>
              stop?.onBoardPassengers?.some((passenger) =>
                passenger?.location?.locality
                  ?.toUpperCase()
                  ?.includes(localitiesValue?.toUpperCase()),
              ),
            )
          : true;
        // Apply group filter
        let isGroupFilterMatch = true;
        if (groupFilter && Object.keys(groupFilter)?.length > 0) {
          Object.keys(groupFilter)?.forEach((filterKey) => {
            // if (filterKey === 'specialEmp') {
            //   isGroupFilterMatch =
            //     isGroupFilterMatch &&
            //     trip.specialEmployee === groupFilter[filterKey];
            // } else
            if (filterKey === 'vendorStatus') {
              isGroupFilterMatch =
                isGroupFilterMatch &&
                ((groupFilter[filterKey] === 'VENDOR_ASSIGN' &&
                  trip.vehicleStatus === 'ASSIGN') ||
                  (groupFilter[filterKey] === 'VENDOR_NONE' &&
                    trip.vehicleStatus === 'NONE'));
            } else if (filterKey === 'tripStatus') {
              isGroupFilterMatch =
                isGroupFilterMatch &&
                trip?.routePsDetails.some(
                  (route) => route?.tripStatus === groupFilter[filterKey],
                );
            } else if (filterKey === 'vehicleStatus') {
              isGroupFilterMatch =
                isGroupFilterMatch &&
                ((groupFilter[filterKey] === 'VEHICLE_ASSIGN' &&
                  trip.vehicleStatus === 'ASSIGN') ||
                  (groupFilter[filterKey] === 'VEHICLE_NONE' &&
                    trip.vehicleStatus === 'NONE'));
            } else if (filterKey === 'driver') {
              isGroupFilterMatch =
                isGroupFilterMatch &&
                ((groupFilter[filterKey] === 'ACCEPT' &&
                  trip.driverStatus === 'ACCEPT') ||
                  (groupFilter[filterKey] === 'ASSIGN' &&
                    trip.driverStatus === 'NONE'));
            } else if (filterKey === 'escort') {
              isGroupFilterMatch =
                isGroupFilterMatch &&
                trip.escortTrip === groupFilter[filterKey];
            } else if (filterKey === 'passStatus') {
              isGroupFilterMatch =
                isGroupFilterMatch &&
                trip?.stopList?.some((stop) =>
                  stop?.onBoardPassengers?.some(
                    (passenger) => passenger?.status === groupFilter[filterKey],
                  ),
                );
            } else if (filterKey === 'no_of_female') {
              isGroupFilterMatch =
                isGroupFilterMatch &&
                groupFilter[filterKey] === 'NO_OF_FEMALE' &&
                Number(trip?.numberOfFemalePassengers) > 0;
            } else if (filterKey === 'geofenceStatus') {
              isGroupFilterMatch =
                isGroupFilterMatch &&
                trip?.stopList?.some((stop) =>
                  stop?.onBoardPassengers?.some(
                    (passenger) =>
                      passenger?.geoFenceViolance === groupFilter[filterKey],
                  ),
                );
              // trip?.geoFenceViolance === groupFilter[filterKey];
            }

            // Add more conditions for other keys in groupFilter as needed
          });
        }
        return (
          (isTripCodeMatch || isEmployeeCodeMatch) &&
          isLocalityMatch &&
          isGroupFilterMatch
        );
      });
      if (trips.length > 0) {
        filteredData[key] = trips;
      }
    });

    if (
      Object.keys(filteredData).length === 0 &&
      tripCodeFilter.trim() !== ''
    ) {
      setFilteredTripData({});
    } else {
      setFilteredTripData(filteredData);
    }
  };

  useEffect(() => {
    filterTripData();
  }, [tripData, tripCodeFilter, groupFilter, localitiesValue]);
  useEffect(() => {
    if (user?.userList?.userStatus == 'DEFAULT') {
      navigate('/my-profile');
    }
  }, [user?.userList?.userStatus]);

  useEffect(() => {
    shiftList();
  }, []);
  // useEffect(() => {
  //   window.clearInterval(Timer);
  //   setTimer(
  //     window.setInterval(function () {
  //       getAllData();
  //       const currentTimestamp = moment().format('HH:mm:ss');
  //       setLastUpdated(currentTimestamp);
  //     }, 1000 * 60 * 1),
  //   );
  // }, [selectedTrip]);

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
            d?.id +
            'T' +
            (d.tripType == 'UPTRIP' ? d.shiftStart : d.shiftEnd) +
            ':00Z'
        ] = await getTripByShiftID(d);
      }),
    );
    // console.log('myTripObj', myTripObj);
    setSelectedTrip([...tempArr]);
    setTripData({...myTripObj});
  }

  function shiftList() {
    setLoading(true);
    let postData = {
      corporateId: user?.userList?.corporateId,
      fromDate: moment(new Date().setDate(new Date().getDate())).format(
        'YYYY-MM-DD',
      ),
      toDate: moment(new Date().setDate(new Date().getDate() + 2)).format(
        'YYYY-MM-DD',
      ),
      // fromDate: '2023-10-10',
      // toDate: '2023-10-12',
      sort: -1,
    };
    axios
      // .post(Api.baseUri + '/api/dashboard/analytics/shifts', postData)
      .get(
        Api.baseUri +
          `/user-reg/trip-route/get-all-trips-shifts/${
            user?.userList?.corporateId
          }/${moment(new Date().setDate(new Date().getDate())).format(
            'YYYY-MM-DD',
          )}/${moment(new Date().setDate(new Date().getDate())).format(
            'YYYY-MM-DD',
          )}`,
      )
      .then((res) => {
        setData(res?.data?.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }

  // useEffect(() => {
  //   axios
  //     .get(
  //       Api.baseUri +
  //         '/user-reg/trip-route/get-all-trips-by-shift/645dda309e120223b6906a45',
  //     )
  //     .then((res) => {
  //       if (res?.data?.status == '200') {
  //         console.log('ACTIVE TRIP!!!', res);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log('err', err);
  //     });
  // }, []);

  async function getTripByShiftID(d) {
    const postData = {
      shiftId: d?.shiftId,
      tripType: d?.tripType,
      date: d?.tripDate,
    };

    let res = await axios
      // .post(
      //   Api.baseUri + '/api/dashboard/analytics/tripsByShift',
      //   postData,
      .get(
        Api.baseUri +
          `/user-reg/trip-route/get-all-trips-by-shift/${d?.tripDate}/${d?.shiftId}/${d?.tripType}/${d?.tripTime}`,
      );
    // console.log('res', res?.data?.data);
    // const localities = res.data.data.flatMap((item) => {
    //   console.log('item', item); // Log each item in res.data.data
    //   return item.stopList.flatMap((stop) => {
    //     console.log('stop', stop); // Log each stop
    //     return stop?.onBoardPassengers?.map((passenger) => {
    //       console.log('passenger', passenger); // Log each passenger
    //       return passenger?.location?.locality;
    //     });
    //   });
    // });

    // console.log('localities', localities);
    return res?.data?.data;
  }

  async function rosterChecked(d) {
    let myTripObj = {...tripData} ?? {};
    myTripObj[
      d?.tripDate +
        'T' +
        d?.id +
        'T' +
        (d.tripType == 'UPTRIP' ? d.shiftStart : d.shiftEnd) +
        ':00Z'
    ] = await getTripByShiftID(d);
    let tempArr = [];
    let d_arr = [];
    let type_arr = [];
    let categ_arr = [];
    let is_avl = false;
    selectedTrip?.map((el) => {
      // if (el?._id == d?._id) {
      if (el?.id == d?.id) {
        if (selectedTrip?.length > 1) {
          delete myTripObj[
            d?.tripDate +
              'T' +
              d?.id +
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
            el.id +
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
          d?.id +
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
    let temp = [];
    console.log('tripData', tripData);
    // console.log('fffff', Object.values(tripData));
    Object.values(tripData)?.map((el) => {
      el?.map((e) => {
        e?.stopList?.map((empc) => {
          empc?.onBoardPassengers?.map((elel) => {
            if (elel?.gender == 'Female') e.isFemale = 'YES';
            if (_.isEmpty(elel)) return;
          });
        });
        temp.push(e);
      });
    });
    // console.log('temp', temp);
    let escortTrip = _.groupBy(temp, 'escortTrip');
    let FemaleCount = _.groupBy(temp, 'isFemale');
    // console.log('ednscortTriptest', escortTrip);
    // console.log('isFevdmaletest', FemaleCount);
    setCount({
      escortTrip: escortTrip?.YES?.length,
      femaleCount: FemaleCount?.YES?.length,
    });
  }, [tripData]);
  return (
    <>
      {data?.length ? (
        <>
          <div style={{marginTop: '10px'}}>
            <Slider shiftData={data} rosterChecked={rosterChecked} />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              width: '100%',
              padding: '5px 29px',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginRight: '10px',
              }}
            >
              <TextField
                size='small'
                autoComplete='off'
                onChange={(e) => setTripCodeFilter(e.target.value)}
                value={tripCodeFilter}
                placeholder='TripId / EmpCode'
                // style={{borderRadius: '20px', marginRight: '10px'}}
                sx={{width: '200px', m: 2}}
                // sx={{width: '400px', borderRadius: '20px', marginRight: '10px'}} // Adjust width as needed
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <Autocomplete
                disablePortal
                id='groups'
                size='small'
                options={groupList}
                getOptionLabel={(option) => option.label}
                groupBy={(option) => option.groupName}
                renderGroup={(params) => (
                  <li key={params.key}>
                    <GroupHeader>{params.group}</GroupHeader>
                    <GroupItems>{params.children}</GroupItems>
                  </li>
                )}
                onChange={(e, option, v) => {
                  if (v == 'clear') {
                    setGroupFilter({});
                  }
                  if (option?.value == 'SPECIAL_EMPLOYEE') {
                    let temp = {specialEmp: option?.value};
                    setGroupFilter({...temp});
                  } else if (
                    option?.value == 'VENDOR_ASSIGN' ||
                    option?.value == 'VENDOR_NONE'
                  ) {
                    let temp = {vendorStatus: option?.value};
                    setGroupFilter({...temp});
                  } else if (
                    option?.value == 'VEHICLE_ASSIGN' ||
                    option?.value == 'VEHICLE_NONE'
                  ) {
                    let temp = {vehicleStatus: option?.value};
                    setGroupFilter({...temp});
                  } else if (option?.value == 'NO_OF_FEMALE') {
                    let temp = {no_of_female: option?.value};
                    setGroupFilter({...temp});
                  } else if (
                    option?.value == 'ACCEPT' ||
                    option?.value == 'ASSIGN'
                  ) {
                    let temp = {driver: option?.value};
                    setGroupFilter({...temp});
                  } else if (option?.value == 'YES') {
                    let temp = {escort: option?.value};
                    setGroupFilter({...temp});
                  } else if (option?.value == 'GEOFENCE_VIOLATION') {
                    let temp = {geofenceStatus: 'YES'};
                    setGroupFilter({...temp});
                  } else if (option?.groupName == '--Employee--') {
                    let temp = {passStatus: option?.value};
                    setGroupFilter({...temp});
                  } else if (option?.groupName == '--Trip--') {
                    let temp = {tripStatus: option?.value};

                    setGroupFilter({...temp});
                  } else {
                    setGroupFilter({});
                  }
                }}
                sx={{width: '200px', m: 2}}
                renderInput={(params) => (
                  <TextField {...params} label='Groups' />
                )}
              />

              <Autocomplete
                disablePortal
                size='small'
                id='combo-box-demo'
                options={autocompleteOptions ?? []}
                sx={{width: '200px', m: 2}}
                getOptionLabel={(option) => option.title}
                onChange={(e, v) => {
                  // setFuelType(v?.value);
                  console.log('vvvv', v);
                  setLocalitiesValue(v?.value);
                }}
                // sx={{width: 300}}
                renderInput={(params) => (
                  <TextField {...params} label='Localities' />
                )}
              />
              {/* <AppTooltip placement={'top'} title={'Add Filter'}>
                <FilterAltOutlinedIcon
                  className='title-icons-mui'
                  style={{color: _.isEmpty(filter) ? '' : '#ff9800'}}
                  onClick={() => {
                    setFilterPopUp(true);
                  }}
                />
              </AppTooltip>
              <AppTooltip placement={'top'} title={'Clear Filter'}>
                <img
                  src='/assets/images/clear-filter.png'
                  onClick={() => {
                    setFilterPopUp(true);
                  }}
                  className='title-icons-mui'
                />
              </AppTooltip> */}
            </div>
            <span
              style={{
                marginRight: '8px',
                border: '1px solid #77c3ec',
                borderRadius: '5px',
                padding: '2px',
                background: '#77c3ec',
                color: 'white',
              }}
            >
              Last Updated - {lastUpdated}
            </span>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <img
                src='/assets/images/female.svg'
                style={{height: '18px', marginRight: '8px'}}
              />
              {'[' + (count.femaleCount ?? '0') + ']'}
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <img
                src='/assets/images/escort_dash.svg'
                style={{
                  marginLeft: '5px',
                  height: '35px',
                }}
              />
              {'[' + (count.escortTrip ?? '0') + ']'}
            </div>
          </div>
          <ParentBox
            tripData={
              Object.keys(filteredTripData).length > 0
                ? filteredTripData
                : Object.keys(groupFilter).length > 0
                ? {}
                : tripCodeFilter.trim() !== '' &&
                  Object.keys(filteredTripData).length === 0
                ? {}
                : tripData // No filter applied, show all records
            }
            tripType={tripType}
            tripDate={tripDates}
            getAllData={getAllData}
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

// const applyGroupFilter = () => {
//   const filteredData = {};
//   Object.keys(tripData).forEach((key) => {
//     const trips = tripData[key].filter((trip) => {
//       console.log('tridfbdjfp', trip);
//       let isGroupFilterMatch = true;
//       if (Object.keys(groupFilter).length > 0) {
//         Object.keys(groupFilter).forEach((filterKey) => {
//           console.log('filterKey', filterKey);
//           if (filterKey === 'specialEmp') {
//             isGroupFilterMatch =
//               isGroupFilterMatch &&
//               trip.specialEmployee === groupFilter[filterKey];
//           } else if (filterKey === 'vendorStatus') {
//             isGroupFilterMatch =
//               isGroupFilterMatch &&
//               ((groupFilter[filterKey] === 'VENDOR_ASSIGN' &&
//                 trip.vehicleStatus === 'ASSIGN') ||
//                 (groupFilter[filterKey] === 'VENDOR_NONE' &&
//                   trip.vehicleStatus === 'NONE'));
//           } else if (filterKey === 'tripStatus') {
//             isGroupFilterMatch =
//               isGroupFilterMatch &&
//               trip?.routePsDetails.some(
//                 (route) => route?.tripStatus === groupFilter[filterKey],
//               );
//           } else if (filterKey === 'vehicleStatus') {
//             isGroupFilterMatch =
//               isGroupFilterMatch &&
//               ((groupFilter[filterKey] === 'VEHICLE_ASSIGN' &&
//                 trip.vehicleStatus === 'ASSIGN') ||
//                 (groupFilter[filterKey] === 'VEHICLE_NONE' &&
//                   trip.vehicleStatus === 'NONE'));
//           } else if (filterKey === 'driver') {
//             isGroupFilterMatch =
//               isGroupFilterMatch &&
//               ((groupFilter[filterKey] === 'ACCEPT' &&
//                 trip.driverStatus === 'ASSIGN') ||
//                 (groupFilter[filterKey] === 'ASSIGN' &&
//                   trip.driverStatus === 'NONE'));
//           } else if (filterKey === 'escort') {
//             isGroupFilterMatch =
//               isGroupFilterMatch &&
//               trip.escortTrip === groupFilter[filterKey];
//           }

//           // Add more conditions for other keys in groupFilter as needed
//         });
//       }
//       return isGroupFilterMatch;
//     });

//     if (trips.length > 0) {
//       filteredData[key] = trips;
//     }
//   });

//   console.log('filteredData', filteredData);
//   // return;
//   setFilteredTripData(filteredData);
// };

//Dialog POPUP

{
  /* <Dialog
        open={filterPopUp}
        // onClose={() => {
        //   setFilterPopUp(false);
        // }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        maxWidth='false'
        PaperProps={{
          sx: {
            width: 500,
            height: 400,
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle
          id='alert-dialog-title'
          style={{
            background: '#f5f2f2',
            position: 'relative',
            fontSize: '21px',
          }}
        >
          Active Trip Filter
          <IconButton
            onClick={() => {
              setFilterPopUp(false);
            }}
            style={{position: 'absolute', top: '8px', right: '8px'}}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid item xs={3} md={3} style={{textAlign: 'right'}}>
            <Autocomplete
              disablePortal
              id='groups'
              size='small'
              options={groupList}
              getOptionLabel={(option) => option.label}
              groupBy={(option) => option.groupName}
              renderGroup={(params) => (
                <li key={params.key}>
                  <GroupHeader>{params.group}</GroupHeader>
                  <GroupItems>{params.children}</GroupItems>
                </li>
              )}
              onChange={(e, option, v) => {
                if (v == 'clear') {
                  setGroupFilter({});
                }
                if (option?.value == 'SPECIAL_EMPLOYEE') {
                  let temp = {specialEmp: option?.value};
                  setGroupFilter({...temp});
                } else if (
                  option?.value == 'VENDOR_ASSIGN' ||
                  option?.value == 'VENDOR_NONE'
                ) {
                  let temp = {vendorStatus: option?.value};
                  setGroupFilter({...temp});
                } else if (
                  option?.value == 'VEHICLE_ASSIGN' ||
                  option?.value == 'VEHICLE_NONE'
                ) {
                  let temp = {vehicleStatus: option?.value};
                  setGroupFilter({...temp});
                } else if (option?.value == 'NO_OF_FEMALE') {
                  let temp = {no_of_female: option?.value};
                  setGroupFilter({...temp});
                } else if (
                  option?.value == 'ACCEPT' ||
                  option?.value == 'ASSIGN'
                ) {
                  let temp = {driver: option?.value};
                  setGroupFilter({...temp});
                } else if (option?.value == 'YES') {
                  let temp = {escort: option?.value};
                  setGroupFilter({...temp});
                } else if (option?.value == 'GEOFENCE_VIOLATION') {
                  let temp = {geofenceStatus: 'YES'};
                  setGroupFilter({...temp});
                } else if (option?.groupName == '--Employee--') {
                  let temp = {passStatus: option?.value};
                  setGroupFilter({...temp});
                } else if (option?.groupName == '--Trip--') {
                  let temp = {tripStatus: option?.value};

                  setGroupFilter({...temp});
                } else {
                  setGroupFilter({});
                }
              }}
              sx={{width: '100%', m: 2}}
              renderInput={(params) => <TextField {...params} label='Groups' />}
            />
          </Grid>
          <Grid item xs={3} md={3} style={{textAlign: 'right'}}>
            <Autocomplete
              disablePortal
              size='small'
              id='combo-box-demo'
              options={localities ?? []}
              sx={{width: '100%', m: 2}}
              getOptionLabel={(option) => option.title}
              onChange={(e, v) => {
                // setFuelType(v?.value);
                console.log('vvvv', v);
                setLocalitiesValue(v?.value);
              }}
              // sx={{width: 300}}
              renderInput={(params) => (
                <TextField {...params} label='Localities' />
              )}
            />
          </Grid>
          <div
            style={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Button
              id='btnMui123'
              variant='contained'
              // onClick={applyGroupFilter}
            >
              Filter
            </Button>
          </div>
        </DialogContent>
      </Dialog> */
}
