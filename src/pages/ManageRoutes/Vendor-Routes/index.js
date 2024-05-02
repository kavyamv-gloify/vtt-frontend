import React, {useState, useEffect, useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import SmartForm from '@smart-form';
import {useAuthUser} from '@crema/utility/AuthHooks';
import AppLoader from '@crema/core/AppLoader';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import RouteDataList from './routeDataList';
import CustomLabel from 'pages/common/CustomLabel';
import {styled, lighten, darken} from '@mui/system';
import {IconButton, Tooltip} from '@mui/material';
import Box from '@mui/material/Box';
import {Dialog, DialogContent, DialogTitle} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import Api from '@api';
import PropTypes from 'prop-types';
import moment from 'moment';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import {toast} from 'react-toastify';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import _ from '@lodash';
import EditIcon from '@mui/icons-material/Edit';
import TollIcon from '@mui/icons-material/Toll';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import {Button, Checkbox} from '@mui/material';
import {TextField} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TripDirection from '../tripDirection';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Penalty from '../penalty';

import Parking from '../parking';
import TablePagination from '@mui/material/TablePagination';
import Toll from '../toll';
import AppTooltip from '@crema/core/AppTooltip';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import History from '../history';
import InputAdornment from '@mui/material/InputAdornment';
import {useReactToPrint} from 'react-to-print';
import SearchIcon from '@mui/icons-material/Search';
import TripSheet from '../TripSheet';
const CustomExpandIcon = () => {
  return (
    <Box
      sx={{
        '.Mui-expanded & > .collapsIconWrapper': {
          display: 'none',
        },
        '.expandIconWrapper': {
          display: 'none',
        },
        '.Mui-expanded & > .expandIconWrapper': {
          display: 'block',
        },
      }}
    >
      <div className='expandIconWrapper'>
        <IndeterminateCheckBoxOutlinedIcon style={{color: '#407999'}} />
      </div>
      <div className='collapsIconWrapper'>
        <AddBoxOutlinedIcon style={{color: '#407999'}} />
      </div>
    </Box>
  );
};
function TabPanel(props) {
  const {children, value, index, ...other} = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{p: 3}}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
// const [userImg, setUserImg] = useState([])
const RouteLists = () => {
  var mapObject, direction_plugin;
  const [showbtn, setshowbtn] = React.useState(true);
  const [selectedAccord, setSelectedAccord] = React.useState([]);
  const [showRem, setShowRem] = useState(false);
  const {user} = useAuthUser();
  const [formData, setformData] = useState({});
  const [isAnySelected, setIsAnySelected] = useState(false);
  const [searchAction, setSearchAction] = useState('');
  const [selectedTolls, setSelectedTolls] = useState([]);
  const [shiftList, setShiftList] = useState();
  const [myData, setMyData] = useState([]);
  const [currVeh, setcurrVeh] = useState({});
  const [selectedTrip, setSelectedTrip] = useState();
  const [childData, setChildData] = useState([]);
  const [filterOptions, setFilterOptions] = useState({});
  const [counts_, setCounts_] = useState([]);
  const [driverList, setDriverList] = useState([]);
  const [open, setOpen] = useState(false);
  const [historyOpen, sethistoryOpen] = useState(null);
  const [groupFilter, setGroupFilter] = useState();
  const [expandedItem, setExpandedItem] = useState([]);
  const [historyData, setHistoryData] = useState();
  const [value, setValue] = React.useState(0);
  const [escortList, setEscortList] = useState();
  const [expandedItemMap, setExpandedItemMap] = React.useState([]);
  const [escortAssign, setEscortAssign] = React.useState({dialog: false});
  const [displayShift, setDisplayShift] = useState({});
  const [selectedDate, setSelectedDate] = useState();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [localitiesValue, setLocalitiesValue] = useState();
  const [localities, setLocalities] = useState();
  const [tripLength, setTripLength] = useState();
  const [shifts, setShifts] = useState();
  const [lastUpdated, setLastUpdated] = useState(moment().format('HH:mm:ss'));
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState();
  const [trip_Sheet, setTrip_sheet] = useState();
  const [multipleTrip, setMultipleTrip] = useState();
  const [openRoute, setOpenRoute] = useState(false);
  const [allShiftHistory, setAllShiftHistory] = useState({});
  const [allShiftHistoryOpen, setAllShiftHistoryOpen] = useState(false);
  const myref = useRef(null);
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
  const actionList = [
    {label: 'Toll Tax', value: 'TOLL'},
    {label: 'Parking', value: 'PARKING'},
    {label: 'Trip Sheet', value: 'TRIP_SHEET'},
    // { label: 'Allocate Vehicle', value: 'ALLOCATE_VEHICLE' },
    // { label: 'Re-Allocate Vehicle', value: 'RE_ALLOCATE_VEHICLE' },
  ];
  useEffect(() => {
    getAllList();
  }, [debouncedSearchTerm]);
  useEffect(() => {
    if (multipleTrip?.length) {
      handlePrintTripSheet();
      setMultipleTrip([]);
    }
  }, [multipleTrip]);
  useEffect(() => {
    console.log('searchTerm', searchTerm);
    const delayDebounceFn = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);
  useEffect(() => {
    axios
      .get(
        // `${Api.vehicle.list}/${user?.userList?.profileId}/vendor/null/vehiclenumberplate`,
        Api.baseUri +
          `/user-reg/associateVehicle/getAllAssociatedVehicles?corporateId=${user?.userList?.corporateId}&vendorId=${user?.userList?.profileId}`,
      )
      .then((myel) => {
        console.log('myel', myel);
        let temVend = myel?.data?.data;
        let myTempArray = [];
        temVend?.map((elem) => {
          myTempArray.push({
            title:
              elem?.vehicle?.vehicleBrand +
              ' - ' +
              elem?.vehicle?.vehicleNumberPlate,
            value: elem?.vehicle?.id,
          });
        });

        setDriverList(myTempArray);
      });
  }, []);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const onclickChange = () => {
    setTripSheetId(null);
  };
  useEffect(() => {
    let temp = [];
    axios
      .get(Api.baseUri + '/user-reg/employee-reg/getLocalitiesData')
      .then((res) => {
        console.log('res', res);
        const unique = [
          ...new Set(res?.data?.data?.map((item) => item.locality)),
        ];
        unique?.map((el) => {
          temp.push({title: el, value: el});
        });
        setLocalities(temp);
      })
      .catch((err) => {
        console.log('err', err);
      });
  }, []);
  const handlePrintTripSheet = useReactToPrint({
    // onBeforePrint: () => (document.title = ' Invoice'),
    content: () => myref.current,
  });
  const handleSubmitShiftHistory = async (values) => {
    axios
      .get(
        Api?.baseUri +
          '/user-reg/trip-route/get-all-shift-historyByCorporateAndDate/' +
          values,
      )
      .then((response) => {
        if (response?.data?.status == '200') {
          setAllShiftHistory(response?.data?.data);
          setAllShiftHistoryOpen(true);
        } else {
          setAllShiftHistory({});
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };
  function handleSubmitDownload(value) {
    axios
      .get(Api.baseUri + '/user-reg/tripReport/getHeaders')
      .then((res) => {
        let shiftArray = [];
        value?.data?.shifts?.map((el) => {
          shiftArray.push(el?.value);
        });
        axios
          .post(
            Api.baseUri +
              `/user-reg/tripReport/download-report/${
                value?.button?.toUpperCase() == 'XLS' ? 'EXCEL' : 'PDF'
              }/${value?.data?.fromDate}/${
                value?.data?.toDate
              }?shiftId=${shiftArray}`,
            res?.data?.data,
            {responseType: 'blob'},
          )
          .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute(
              'download',
              'routeList/' +
                (value?.button?.toUpperCase() == 'XLS' ? '.xls' : '.pdf'),
            );
            document.body.appendChild(link);
            link.click();
          });
      })
      .catch((err) => {});

    setOpenRoute(false);
  }
  useEffect(() => {
    axios
      .get(
        Api.baseUri +
          '/user-reg/escort-reg/getEscortByCorporateId/' +
          user?.userList?.corporateId,
      )
      .then((res) => {
        if (res?.status == '200') {
          let arr = [];

          res?.data?.data?.map((el) => {
            arr.push({title: el.firstName + ' ' + el.lastName, value: el.id});
          });

          setEscortList(arr);
        }
      })
      .catch((err) => {
        setEscortList([]);
      });
  }, [user?.userList?.corporateId]);
  useEffect(() => {
    const baseURL = `${Api.manageshifts.getlistbyCorporate}corporateId?page=0&size=10000&shiftName=null`;
    let temAr = [];
    axios
      .get(baseURL)
      .then((response) => {
        response?.data?.data?.body['ShiftList']?.map((r) => {
          temAr.push({
            title: r.shiftName + '(' + r.shiftStart + '-' + r.shiftEnd + ')',
            value: r?.id,
          });
        });
        setShifts(temAr);
      })
      .catch((er) => {});
  }, []);
  let EscortTemplate = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    description: 'Form for move employee',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'route_information',
        fields: [
          {
            type: 'autocomplete',
            name: 'escortId',
            id: 'escortId',
            title: 'Assign Escort',
            options: escortList ?? [],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
        ],
      },
    ],
  };
  let templateDownload = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    description: 'Form for applying Job',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'route_information',
        fields: [
          {
            type: 'date',
            name: 'fromDate',
            id: 'fromDate',
            title: 'From Date',
          },
          {
            type: 'date',
            name: 'toDate',
            id: 'toDate',
            title: 'To Date',
          },
          {
            type: 'autocomplete',
            name: 'shifts',
            id: 'shifts',
            title: 'Shifts',
            multiple: true,
            validationProps: {
              required: 'This is a mandatory field',
            },
            options: shifts ?? [],
          },
        ],
      },
    ],
  };
  useEffect(() => {
    if (!historyOpen) {
      setHistoryData(null);
      return;
    }
    axios
      .get(
        Api.baseUri +
          '/user-reg/trip-route/get-all-trip-history/' +
          historyOpen.id,
      )
      .then((res) => {
        console.log(res, 'fasfdfsasfsdfwqrwqer');
        setHistoryData(res?.data?.data || []);
      })
      .catch((er) => {
        setHistoryData([]);
      });
  }, [historyOpen]);
  function handleSubmitDriver(values) {
    if (values?.button == 'submit') {
      let postData = {
        tripId: selectedTrip?.id,
        vehicleId: values?.data?.selectedVendor,
      };
      axios
        .post(Api?.routes?.assignToDriver, postData)
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success(
              res?.data?.message ?? 'Vehicle assigned successfully',
            );
          } else {
            toast.error(res?.data?.message ?? 'Failed');
          }
          getAllList();
        })
        .catch((err) => {
          toast.error('Something went wrong.');
          getAllList();
        });
      setOpen(false);
    }

    if (values?.button == 'update') {
      console.log('value', values);
      let postData = {
        id: selectedTrip?.id,
        vehicleId: values?.data?.selectedVendor,
      };
      driverList?.map((el) => {
        if (el?.value == postData.vehicleId) {
          postData.vehicleNo = el?.title;
        }
      });
      console.log('postData', postData);

      axios
        .post(Api.baseUri + '/user-reg/trip-route/reAllocate-vehicle', postData)
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success('Vehicle Reassigned Successfully');
          } else {
            toast.error(res?.data?.message ?? 'Failed');
          }
          getAllList();
          setOpen(false);
        })
        .catch((err) => {
          toast.error('Something went wrong.');
        });
    }
  }
  useEffect(() => {
    getAllList();
  }, [groupFilter]);
  let poptemplate = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    // title: 'Schedule Roster',
    description: 'Form for applying Job',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'autocomplete',
            name: 'selectedVendor',
            id: 'selectedVendor',
            title: 'Select Vehicle',
            options: driverList ?? [],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
        ],
      },
    ],
  };
  useEffect(() => {
    let arr = [{title: 'All Shifts', value: 'ALL'}];
    let url = `${
      Api.manageshifts.getlistbyCorporate
    }corporateId?page=${0}&size=${1000}&shiftName=null`;
    axios
      .get(url)
      .then((re) => {
        let temArray = re?.data?.data?.body?.ShiftList ?? [];
        temArray?.map((el) => {
          arr.push({title: el?.shiftName, value: el?.id});
        });
        setShiftList(arr);
      })
      .catch((err) => {
        setShiftList([{title: 'All Shifts', value: 'ALL'}]);
      });
  }, []);

  useEffect(() => {
    getAllList();
  }, [filterOptions, searchAction]);

  function handleSubmitEscort(val) {
    let postData = {
      tripId: escortAssign?.tripId?.id,
      escortId: val?.data?.escortId,
    };
    axios
      .post(Api.baseUri + '/user-reg/trip-route/assign-trips-escort', postData)
      .then((res) => {
        if (res?.data?.status == '200') {
          toast.success(res?.data?.message ?? 'Escort Assigned Successfully');
          setEscortAssign({...escortAssign, dialog: false});
          getAllList();
        } else {
          toast.error('Something Went Wrong');
        }
      });
  }

  function getAllList() {
    let postData = {
      date: filterOptions?.date || moment(new Date()).format('YYYY-MM-DD'),
      tripType: filterOptions?.tripType || 'ALL',
      shiftId: filterOptions?.shiftId || 'ALL',
      vehicleStatus:
        groupFilter?.vehicleStatus == 'VEHICLE_ASSIGN'
          ? 'ASSIGN'
          : groupFilter?.vehicleStatus == 'VEHICLE_NONE'
          ? 'NONE'
          : null,
      vendorStatus:
        groupFilter?.vendorStatus == 'VENDOR_ASSIGN'
          ? 'ASSIGN'
          : groupFilter?.vendorStatus == 'VENDOR_NONE'
          ? 'NONE'
          : null,
      status:
        groupFilter?.tripStatus == 'COMPLETED'
          ? 'COMPLETED'
          : groupFilter?.tripStatus == 'STARTED'
          ? 'STARTED'
          : groupFilter?.tripStatus == 'SCHEDULE'
          ? 'SCHEDULE'
          : groupFilter?.tripStatus == 'CANCLED'
          ? 'CANCLED'
          : null,
      numberOfFemalePassengers:
        groupFilter?.no_of_female == 'NO_OF_FEMALE' ? 1 : 0,
    };
    // setExpandedItem([]);

    axios
      .post(
        Api.baseUri +
          `/user-reg/trip-route/search-corporate-trips-list/passStatus/${
            groupFilter?.passStatus || null
          }/allPassStatus/null/specialEmployee/${
            groupFilter?.specialEmp == 'SPECIAL_EMPLOYEE' ? 'yes' : null
          }/geoFenceViolation/${groupFilter?.geofenceStatus || null}/locality/${
            localitiesValue || null
          }/empCode/${debouncedSearchTerm || null}/${page}/${rowsPerPage}`,
        postData,
      )
      .then((result) => {
        setTripLength(result?.data?.data);
        let arr = [];
        let tripList = [];
        result?.data?.data?.content?.map((r) => {
          if (
            searchAction &&
            searchAction != 'PARKING' &&
            searchAction != 'TOLL' &&
            searchAction != 'TRIP_SHEET' &&
            moment(r?.date + ' ' + r.startTime + ':00').isBefore(
              moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            )
          )
            return;
          if (searchAction == 'ASSIGN_TO_DRIVER' && r?.driverStatus != 'NONE') {
            return;
          }
          if (searchAction == 'TRIP_SHEET' && r?.status == 'CANCLED') {
            return;
          }
          let tem = {};
          tem.id = r?.id;
          tem.tripCode = r?.tripCode ?? 'NA';
          tem.vehicleNo = r?.vehicleNo || 'Not Assigned';
          tem.escortTrip = r?.escortTrip;
          tem.escortName = r?.escortName || 'Not Assigned';
          tem.driverName = r?.driverName || 'Not Assigned';
          tem.routeName = r?.routeName;
          tem.tripCategory = r?.tripCategory == 'ADHOCTRIP' ? 'Adhoc' : '';
          tem.tripType = r?.tripType;
          tem.routeDate = r?.date;
          tem.vehicleId = r?.vehicleId;
          tem.driverStatus = r?.driverStatus == 'NONE' ? 'No' : 'Yes';
          tem.vendorName = r?.vendorName || 'Not Assigned';
          tem.status = r?.status;
          tem.startTime = r?.startTime || 'NA';
          tem.shiftId = r?.shiftId;
          tem.noOfStoppage = r?.stopList?.length;
          tem.vehicleType = r?.vehicleType;
          tem.vehicleOccupancy = r?.vehicleOccupancy;
          tem.stops = r?.stopList;
          tem.escortId = r?.escortId;
          tem.vehicleChange = r?.vehicleChange;
          tem.polyLine = r?.polyLine;
          let temarr = [];
          r?.stopList?.map((empc) => {
            empc?.onBoardPassengers?.map((elel) => {
              if (elel.gender == 'Female') tem.isFemale = 'YES';
              if (_.isEmpty(elel)) return;
              elel.eta =
                r?.tripType == 'DOWNTRIP'
                  ? elel?.dropDateTimeStr
                  : empc?.expectedArivalTimeStr;
              if (elel?.shiftTime) tem.adhocShiftTime = elel?.shiftTime;
              elel.empStatus = empc?.status;
              elel.shiftTiming =
                tem.tripType == 'UPTRIP' ? tem.startTime : tem.endTime;
              elel.date = r.date;
              temarr.push(elel);
            });
          });
          tem.empList = temarr;
          arr.push(tem);
          tripList.push({title: r?.tripCode ?? 'NA', value: r?.id});
        });
        let can_emp = 0;
        let abs_emp = 0;
        let noshow_emp = 0;
        let fem = 0;
        arr?.map((elmt) => {
          elmt?.empList?.map((elem) => {
            // console.log(elem, 'tripListtripListtripList');
            if (elem?.passType !== 'ESCORT') {
              if (elem.status == 'ABSENT') abs_emp++;
              if (elem.status == 'NOSHOW') noshow_emp++;
              if (elem.status == 'CANCLED') can_emp++;
              if (elem.gender == 'Female') fem++;
            }
          });
        });
        let mytemD = _.groupBy(arr, 'tripCategory');
        let mytemD2 = _.groupBy(arr, 'isFemale');
        let mytemD3 = _.groupBy(arr, 'escortTrip');
        let mytemD4 = _.groupBy(arr, 'status');
        setCounts_({
          ADHOC: mytemD?.Adhoc?.length || 0,
          REG: (arr?.length || 0) - (mytemD?.Adhoc?.length || 0),
          ALL: arr?.length,
          FEMALE: mytemD2?.YES?.length || 0,
          ESCORT: mytemD3?.YES?.length || 0,
          T_CANCELLED: mytemD4?.CANCLED?.length || 0,
          T_ABSENT: mytemD4?.ABSENT?.length || 0,
          T_NOSHOW: mytemD4?.NOSHOW?.length || 0,
          E_CANCELLED: can_emp,
          E_ABSENT: abs_emp,
          E_NOSHOW: noshow_emp,
          E_FEM: fem,
        });
        setMyData([...arr]);
        setChildData([...arr]);
      })
      .catch((err) => {});
  }

  useEffect(() => {
    setSearchAction(searchAction);
  }, [searchAction]);
  useEffect(() => {
    const interval = window.setInterval(function () {
      getAllList();
      const currentTimestamp = moment().format('HH:mm:ss');
      setLastUpdated(currentTimestamp);
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [
    groupFilter,
    filterOptions,
    searchAction,
    page,
    rowsPerPage,
    localitiesValue,
  ]);
  let template = {
    layout: {
      column: 1,
      spacing: 2,
      size: 'small',
      label: 'fixed',
      type: 'flex',
    },
    title: '',
    description: 'Routes',
    sections: [
      {
        layout: {
          column: 4,
          spacing: 2,
          size: 'small',
          label: 'fixed',
          type: 'flex',
        },
        id: 'route_information',
        fields: [
          {
            type: 'date',
            name: 'date',
            id: 'date',
            title: 'Date',
            size: 'small',
            defaultValue: moment(new Date()).format('YYYY-MM-DD'),
            // min: 'today',
            style: {width: '20%'},
          },
          {
            type: 'select',
            name: 'tripType',
            id: 'tripType',
            defaultValue: 'ALL',
            title: 'Trip Type',
            options: [
              {title: 'All', value: 'ALL'},
              {title: 'Login', value: 'UPTRIP'},
              {title: 'Logout', value: 'DOWNTRIP'},
            ],
            style: {width: '25%'},
          },
          {
            type: 'select',
            name: 'shiftId',
            id: 'shiftId',
            defaultValue: 'ALL',
            title: 'Shift Time',
            options: shiftList ?? [{title: 'All Shifts', value: 'ALL'}],
            style: {width: '25%'},
          },
        ],
      },
    ],
  };

  const handleSubmit = async (values) => {
    setSelectedDate(values?.data?.date);
    if (values?.button?.toUpperCase()?.trim() == 'CLEAR') {
      setSearchAction('');
      setFilterOptions({
        date: moment(new Date()).format('YYYY-MM-DD'),
        tripType: 'ALL',
        shiftId: 'ALL',
      });
    } else {
      setFilterOptions({
        date: values?.data?.date || moment(new Date()).format('YYYY-MM-DD'),
        tripType: values?.data?.tripType || 'ALL',
        shiftId: values?.data?.shiftId || 'ALL',
      });
    }
  };

  // const createmap = async (data) => {
  //   document.getElementById(data.tripCode).style.display = 'block';
  // };
  const createmap = async (data, t) => {
    document.getElementById(data.tripCode).style.display =
      t == 'expand' ? 'block' : '';
  };
  const craeteDlink = async (data) => {
    let selected_trip = _.filter(childData, function (o) {
      return o.id == data?.id;
    });
    let selectedEmp = ([] = _.filter(selected_trip[0]?.empList, {
      checked: true,
    }).map((v) => v.id));
    if (selectedEmp?.length <= 0) {
      toast.error('Employee not selected in this trip to split group.');
      return;
    } else {
      setDlinkConfirmbox(true);
      setSplitGroup(data);
    }
  };
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };
  // function afterScriptsLoaded(data) {
  //
  //     let userImgs = []
  //     let startPointLabel = ''
  //     if (data?.stops[0]?.onBoardPassengers?.length > 0) {
  //         data?.stops[0]?.onBoardPassengers.forEach((ud, idx) => {
  //             startPointLabel = `${startPointLabel}<div class='point-details onboard'><span class='img-s'><img class='user-image' src='${Api.imgUrl}${ud?.photo}' /></span><span class='user-info'><h4>${ud?.name}</h4><p class='eta-time'>${data?.stops[0]?.expectedArivalTime?.split(' ')[1]}</p><p>${ud?.location?.locName}</p></span></div>`
  //         })
  //     } else if (data?.stops[0]?.deBoardPassengers?.length > 0) {
  //         data?.stops[0]?.deBoardPassengers.forEach((ud, idx) => {
  //             startPointLabel = `${startPointLabel}<div class='point-details deboard'><span class='img-s'><img class='user-image' src='${Api.imgUrl}${ud?.photo}' /></span><span class='user-info'><h4>${ud?.name}</h4><p class='eta-time'>${data?.stops[0]?.expectedArivalTime?.split(' ')[1]}</p><p>${ud?.location?.locName}</p></span></div>`
  //         })
  //     } else {
  //         startPointLabel = `<div class='point-details'>${data?.stops[0]?.location?.locName}</div>`
  //     }
  //     let endPointLabel = ''
  //     if (data?.stops[data?.stops?.length - 1]?.onBoardPassengers?.length > 0) {
  //         data?.stops[data?.stops?.length - 1]?.onBoardPassengers.forEach((ud, idx) => {
  //             endPointLabel = `${endPointLabel}<div class='point-details onboard'><span class='img-s'><img class='user-image' src='${Api.imgUrl}${ud?.photo}' /></span><span class='user-info'><h4>${ud?.name}</h4><p class='eta-time'>${data?.stops[data?.stops?.length - 1]?.expectedArivalTime?.split(' ')[1]}</p><p>${ud?.location?.locName}</p></span></div>`
  //         })
  //     } else if (data?.stops[data?.stops?.length - 1]?.deBoardPassengers?.length > 0) {
  //         data?.stops[data?.stops?.length - 1]?.deBoardPassengers.forEach((ud, idx) => {
  //             endPointLabel = `${endPointLabel}<div class='point-details deboard'><span class='img-s'><img class='user-image' src='${Api.imgUrl}${ud?.photo}' /></span><span class='user-info'><h4>${ud?.name}</h4><p class='eta-time'>${data?.stops[data?.stops?.length - 1]?.expectedArivalTime?.split(' ')[1]}</p><p>${ud?.location?.locName}</p></span></div>`
  //         })
  //     } else {
  //         endPointLabel = `<div class='point-details'>${data?.stops[data?.stops?.length - 1]?.location?.locName}</div>`
  //     }
  //     let startPoint = { label: startPointLabel, geoposition: (data?.stops[0]?.location?.latitude + ',' + data?.stops[0]?.location?.longitude) }
  //     let endPoint = { label: endPointLabel, geoposition: (data?.stops[data?.stops?.length - 1]?.location?.latitude + ',' + data?.stops[data?.stops?.length - 1]?.location?.longitude) }
  //     let viaPoints = []
  //     if (data?.stops?.length > 2) {
  //         for (let i = 1; i < data?.stops?.length; i++) {
  //             if (data?.stops[i]?.onBoardPassengers?.length > 0 || data?.stops[i]?.deBoardPassengers?.length > 0) {
  //                 let viaPointLabel = ''
  //                 if (data?.stops[i]?.onBoardPassengers?.length > 0) {
  //                     data?.stops[i]?.onBoardPassengers.forEach((ud, idx) => {
  //                         viaPointLabel = `${viaPointLabel}<div class='point-details onboard'><span class='img-s'><img class='user-image' src='${Api.imgUrl}${ud?.photo}' /></span><span class='user-info'><h4>${ud?.name}</h4><p class='eta-time'>${(data?.stops[i]?.expectedArivalTime)?.split(' ')[1]}</p><p>${ud?.location?.locName}</p></span></div>`
  //                     })
  //                 } else if (data?.stops[i]?.deBoardPassengers?.length > 0) {
  //                     data?.stops[i]?.deBoardPassengers.forEach((ud, idx) => {
  //                         viaPointLabel = `${viaPointLabel}<div class='point-details deboard'><span class='img-s'><img class='user-image' src='${Api.imgUrl}${ud?.photo}' /></span><span class='user-info'><h4>${ud?.name}</h4><p class='eta-time'>${(data?.stops[i]?.expectedArivalTime)?.split(' ')[1]}</p><p>${ud?.location?.locName}</p></span></div>`
  //                     })
  //                 } else {
  //                     viaPointLabel = `<div class='point-details'>${data?.stops[i]?.location?.locName}</div>`
  //                 }
  //                 // userImgs.push(data?.stops[i]?.onBoardPassengers[0]?.photo)
  //                 viaPoints.push({ label: viaPointLabel, geoposition: (data?.stops[i]?.location?.latitude + ',' + data?.stops[i]?.location?.longitude) })
  //             }
  //         }
  //     }
  //     //
  //     // setUserImg(userImgs)
  //     var div = document.getElementById(data?.tripCode);
  //     while (div.firstChild) {
  //         div.removeChild(div?.firstChild);
  //     }
  //     mapObject = ''
  //     mapObject = window.mappls.Map(data?.tripCode, {
  //         center: [data?.stops[0]?.location?.latitude, data?.stops[0]?.location?.longitude],
  //         zoom: 8, zoomControl: false,
  //     })
  //     if (mapObject !== undefined && mapObject !== '') {
  //         var direction_option = {
  //             map: mapObject,
  //             divWidth: '0px',
  //             isDraggable: false,
  //             start: startPoint,
  //             end: endPoint,
  //             Profile: ['driving', 'biking', 'trucking', 'walking'],
  //             via: viaPoints,
  //             start_icon: {
  //                 html: `<div class='marker-pin'><img src='https://maps.mappls.com/images/from.png' /></div>`,
  //                 width: 30,
  //                 height: 40
  //             },
  //             end_icon: {
  //                 html: `<div class='marker-pin'><img src='https://maps.mappls.com/images/to.png' /></div>`,
  //                 width: 30,
  //                 height: 40
  //             },
  //             via_icon: {
  //                 html: `<div class='marker-pin'><img src='https://maps.mappls.com/images/2.png' /></div>`,
  //                 width: 30,
  //                 height: 40
  //             },
  //         }
  //
  //         new window.mappls.direction(direction_option, function (data) {
  //             direction_plugin = data;
  //         });
  //         // setTimeout(function() {
  //         //     new window.mappls.direction(direction_option,function(data) {
  //         //         direction_plugin=data;
  //         //
  //         //         direction_option?.via.forEach((val, idx)=>{
  //         //             let mrks = document.getElementById('cst_mid'+(Number(idx)+1))
  //         //              +1));
  //         //             mrks.innerHTML = `<div><img class='user-image' src='${Api.imgUrl}${userImgs[idx]}' /></div>`
  //         //         })
  //         //     });
  //         // }, 500);
  //     }
  // }
  // const actionList = [
  //     { label: 'Assign to Vendor', value: 'ASSIGN_TO_VENDOR' },
  //     { label: 'Re-Allocate Vendor', value: 'RE_ALLOCATE_VENDOR' },
  //     { label: 'Allocate Vehicle', value: 'ALLOCATE_VEHICLE' },
  //     { label: 'Re-Allocate Vehicle', value: 'RE_ALLOCATE_VEHICLE' },
  // ]

  const handleMouseEnter = (e) => {
    console.log('e', e);
    if (e?.length) {
      axios.get(Api.baseUri + '/user-reg/shift/' + e).then((res) => {
        console.log('resp', res);
        setDisplayShift({
          shiftName: res?.data?.data?.shiftName,
          shiftStartTime: res?.data?.data?.shiftStart,
          shiftEndTime: res?.data?.data?.shiftEnd,
        });
      });
      setDisplayShift({});
    } else return;
  };
  const handleMouseLeave = (e) => {
    setDisplayShift({});
  };

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
    {
      label: 'Special Employee',
      value: 'SPECIAL_EMPLOYEE',
      groupName: '--Employee--',
    },
    {
      label: 'Geofence Violation',
      value: 'GEOFENCE_VIOLATION',
      groupName: '--Employee--',
    },
  ];
  const localitiesList = [
    {label: 'Localities 1', value: 'l1'},
    {label: 'Localities 2', value: 'l2'},
    {label: 'Localities 3', value: 'l3'},
  ];
  // Map section end

  const selectParentData = async (event, evId) => {
    let temArr = selectedAccord;
    if (!temArr.includes(evId)) {
      temArr.push(evId);
      selectChildData(true, evId, 'ALL');
    } else {
      selectChildData(false, evId, 'ALL');
      temArr.splice(temArr.indexOf(evId), 1);
    }
    setSelectedAccord([...temArr]);
  };
  const handleChangePage = (event, newPage) => {
    console.log('newPage', newPage);
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const selectChildData = async (event, parentId, myId) => {
    let tem = childData;
    let thisselec = true;
    tem[parentId]?.empList?.map((el, ind) => {
      if (myId == 'ALL') {
        tem[parentId].empList[ind].checked = event;
      } else if (el.id == myId) {
        if (event == false) {
          let temArr = selectedAccord;
          temArr.splice(temArr.indexOf(parentId), 1);
          setSelectedAccord([...temArr]);
        }
        tem[parentId].empList[ind].checked =
          !tem[parentId].empList[ind].checked;
      }
      if (!tem[parentId].empList[ind].checked) thisselec = false;
    });
    if (thisselec && myId != 'ALL' && !selectedAccord?.includes(parentId)) {
      setSelectedAccord([...selectedAccord, parentId]);
    }
    setChildData({...tem});
  };
  function handleSubmitAction(value) {
    console.log('childData', childData);

    let Arr = [];
    for (let [key, value] of Object.entries(childData)) {
      value?.empList?.length &&
        value?.empList?.map((ar) => {
          if (ar.checked == true) {
            Arr.push(value?.id);
          }
        });
    }
    console.log('arr', Arr);

    if (searchAction == 'TRIP_SHEET') {
      let tripSheetArr = [];
      for (let [key, value] of Object.entries(childData)) {
        value?.empList?.length &&
          value?.empList?.map((ar) => {
            if (ar.checked == true) {
              tripSheetArr.push(value?.id);
            }
          });
      }
      let unique = tripSheetArr.filter((item, i, ar) => ar.indexOf(item) === i);
      console.log(unique);
      setTrip_sheet(unique);

      axios
        .get(
          Api.baseUri + `/user-reg/trip-route/get-trip-by-id?tripId=${unique}`,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            setMultipleTrip(res?.data?.data);
            setSelectedBox([]);
            setSelectedAccord([]);
            getAllList();
          }
        })
        .catch((err) => {});
    }
  }
  return (
    <>
      <div className='route-list'>
        <div style={{display: 'none'}}>
          <div>
            <TripSheet
              tId={trip_Sheet}
              onclickChange={onclickChange}
              myref={myref}
              multipleTrip={multipleTrip}
            />
          </div>
        </div>
        {!showbtn ? <AppLoader /> : null}
        {/* <CustomLabel labelVal='Routes' variantVal='h3-underline' />
        <div className='route-search'>
          <SmartForm
            template={template}
            filterbtnStyle={{
              maxHeight: '36px',
              marginLeft: '5px',
              marginTop: '26px',
              backgroundColor: '#006685',
            }}
            defaultValues={formData}
            onSubmit={handleSubmit}
            fieldsize='SMALL'
            setVal={[
              {name: 'date', value: filterOptions?.date},
              {name: 'tripType', value: filterOptions?.tripType},
              {name: 'shiftId', value: filterOptions?.shiftId},
            ]}
            buttons={['Search', 'Clear']}
          />
        </div> */}
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <div>
            <CustomLabel labelVal='Routes' variantVal='h3-underline' />
          </div>
          {/* <Button>POPUP</Button> */}
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            {/* {myActions?.includes('Download And Upload') && <UploadRoutes />} */}
            <AppTooltip
              placement={'top'}
              title={'Download'}
              sx={{marginLeft: '10px'}}
            >
              <ArrowCircleDownIcon
                className='title-icons-mui'
                sx={{mr: 4}}
                onClick={() => {
                  setOpenRoute(true);
                }}
              />
            </AppTooltip>
          </div>
        </div>
        <div className='route-search'>
          <SmartForm
            template={template}
            filterbtnStyle={{
              maxHeight: '36px',
              marginLeft: '5px',
              marginTop: '26px',
              backgroundColor: '#006685',
            }}
            defaultValues={formData}
            onSubmit={handleSubmit}
            fieldsize='SMALL'
            setVal={[
              {name: 'date', value: filterOptions?.date},
              {name: 'tripType', value: filterOptions?.tripType},
              {name: 'shiftId', value: filterOptions?.shiftId},
            ]}
            buttons={['Search', 'Clear']}
          />
        </div>{' '}
        <div className='route-list'>
          <div className='search-area' style={{background: 'white'}}>
            <Grid container spacing={2}>
              <Grid item xs={3} md={3} style={{textAlign: 'right'}}>
                <Autocomplete
                  disablePortal
                  id='actions'
                  size='small'
                  options={actionList}
                  onChange={(e, option, v) => {
                    if (v === 'clear') {
                      setSearchAction(null);
                    }
                    if (v === 'selectOption') {
                      setSearchAction(option.value);
                    }
                  }}
                  sx={{width: '100%', m: 2}}
                  renderInput={(params) => (
                    <TextField {...params} label='Actions' />
                  )}
                />
              </Grid>
              <Grid item xs={3} md={3} style={{textAlign: 'right'}}>
                <Autocomplete
                  disablePortal
                  id='groups'
                  size='small'
                  options={groupList}
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
                    if (
                      option?.value == 'NOSHOW' ||
                      option?.value == 'CANCELLED' ||
                      option?.value == 'ABSENT'
                    ) {
                      let temp = {passStatus: option?.value};
                      setGroupFilter({...temp});
                    } else if (
                      option?.value == 'SCHEDULE' ||
                      option?.value == 'STARTED' ||
                      option?.value == 'COMPLETED' ||
                      option?.value == 'CANCLED' ||
                      option?.value == 'EXPIRED'
                    ) {
                      let temp = {tripStatus: option?.value};
                      setGroupFilter({...temp});
                    } else if (option?.value == 'SPECIAL_EMPLOYEE') {
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
                      console.log(temp);
                      setGroupFilter({...temp});
                    } else {
                      setGroupFilter({});
                    }
                  }}
                  sx={{width: '100%', m: 2}}
                  renderInput={(params) => (
                    <TextField {...params} label='Groups' />
                  )}
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
              <Grid item xs={3} md={3} style={{textAlign: 'right'}}>
                <Box justify='flex-end'>
                  <Button
                    id='btnMui123'
                    variant='contained'
                    sx={{
                      background: '#006685',
                      marginTop: '8px',
                      marginLeft: '12px',
                    }}
                    onClick={() => {
                      let tem_ex = [];
                      myData?.map((el, i) => {
                        tem_ex.push(i);
                      });
                      setExpandedItem([...tem_ex]);
                    }}
                  >
                    Expand All
                  </Button>
                  <Button
                    id='btnMui123'
                    variant='contained'
                    sx={{
                      background: '#006685',
                      marginTop: '8px',
                      marginLeft: '12px',
                    }}
                    onClick={() => {
                      setExpandedItem([]);
                    }}
                  >
                    Collapse All
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </div>
        </div>
        <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label='basic tabs example'
          >
            <Tab label={'All [' + (counts_.ALL || 0) + ']'} {...a11yProps(0)} />
            <Tab
              label={'Regular [' + (counts_.REG || 0) + ']'}
              {...a11yProps(1)}
            />
            <Tab
              label={'Adhoc [' + (counts_.ADHOC || 0) + ']'}
              {...a11yProps(2)}
            />
            <span
              style={{
                padding: '10px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Tooltip title={'Shift History'}>
                <InfoOutlinedIcon
                  onClick={() => {
                    handleSubmitShiftHistory(
                      selectedDate ?? moment(new Date()).format('YYYY-MM-DD'),
                    );
                  }}
                />
              </Tooltip>
            </span>
            <div
              style={{
                position: 'absolute',
                right: '17px',
                top: '17px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: '-10px',
                  marginRight: '10px',
                }}
              >
                <TextField
                  size='small'
                  autoComplete='off'
                  onChange={handleInputChange}
                  value={searchTerm}
                  placeholder='Search by EmpId'
                  style={{borderRadius: '20px'}}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                {/* <Button variant='contained' sx={{marginLeft: '5px'}}>
                    Go
                  </Button> */}
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
              <img
                src='/assets/images/female.svg'
                style={{height: '18px', marginRight: '8px'}}
              />
              [{counts_.FEMALE}]
              <img
                src='/assets/images/escort_dash.svg'
                style={{
                  marginLeft: '5px',
                  height: '35px',
                }}
              />
              [{counts_.ESCORT}]
            </div>
          </Tabs>
        </Box>
        <div className='route-list'>
          <div>
            {myData?.length ? (
              myData.map((e, index) => {
                if (value == 2 && e.tripCategory != 'Adhoc') {
                  return;
                }
                if (value == 1 && e.tripCategory == 'Adhoc') {
                  return;
                }
                return (
                  <>
                    <Accordion
                      style={{
                        padding: '15px',
                        marginBottom: '10px',
                        borderLeft:
                          e?.status == 'SCHEDULE'
                            ? '6px solid red'
                            : e?.status == 'COMPLETED'
                            ? '6px solid green'
                            : e?.status == 'STARTED'
                            ? '6px solid rgb(5, 63, 92)'
                            : '',
                        borderRight: e.isFemale ? '6px solid #f7007a' : '',
                        // borderBottom:
                        //   e?.vehicleChange == 'YES' ? '6px solid orange' : '',

                        borderRadius: '10px',
                      }}
                      expanded={expandedItem.includes(index)}
                    >
                      <AccordionSummary
                        className='mb-2'
                        expandIcon={<CustomExpandIcon />}
                        // onClick={() => {
                        //   let tempo = expandedItem;
                        //   let tempo2 = expandedItemMap;
                        //   if (expandedItem.includes(index)) {
                        //     // tempo2.splice(tempo.indexOf(index), 1);
                        //   } else {
                        //     tempo.push(index);
                        //   }
                        //   if (expandedItemMap.includes(index)) {
                        //     tempo2.splice(tempo.indexOf(index), 1);
                        //     createmap(e, 'collapse');
                        //   } else {
                        //     createmap(e, 'expand');
                        //     tempo2.push(index);
                        //   }
                        //   setExpandedItem([...tempo]);
                        //   setExpandedItemMap([...tempo2]);
                        // }}
                        onClick={() => {
                          let tempo = expandedItem;
                          if (expandedItem.includes(index)) {
                            tempo.splice(tempo.indexOf(index), 1);
                          } else {
                            tempo.push(index);
                          }
                          setExpandedItem([...tempo]);
                        }}
                        aria-controls='panel1a-content'
                        id='panel1a-header'
                        style={{
                          padding: '10px',
                          // background:
                          //   e?.status == 'CANCLED'
                          //     ? 'rgb(250, 223, 227)'
                          //     : ' ',
                          margin: '-10px',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                          }}
                        >
                          <div
                            style={{
                              position: 'absolute',
                              height: '100%',
                              display: 'flex',
                              padding: '10px',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '100%',
                            }}
                          >
                            {e?.status == 'CANCLED' && (
                              <img
                                style={{height: '60px', opacity: '0.2'}}
                                src='/assets/images/cancelled-bg.svg'
                              />
                            )}
                            {e?.status == 'ABSENT' && (
                              <img
                                style={{height: '60px', opacity: '0.2'}}
                                src='/assets/images/absentabsent-bg.svg'
                              />
                            )}
                            {e?.status == 'NOSHOW' && (
                              <img
                                style={{height: '60px', opacity: '0.2'}}
                                src='/assets/images/noshow-bg.svg'
                              />
                            )}
                            {e?.status?.toUpperCase() == 'EXPIRED' && (
                              <img
                                style={{height: '60px', opacity: '0.2'}}
                                src='/assets/images/expired-bg.svg'
                              />
                            )}
                          </div>
                          <Typography style={{width: '5%', zIndex: 99}}>
                            <Checkbox
                              color='success'
                              style={{borderColor: 'red'}}
                              disabled={
                                (searchAction != 'PARKING' &&
                                  searchAction != 'TOLL' &&
                                  searchAction != 'TRIP_SHEET' &&
                                  selectedDate <
                                    moment(new Date()).format('YYYY-MM-DD')) ||
                                !searchAction ||
                                e?.status == 'CANCLED'
                              }
                              checked={
                                searchAction !== 'TRIP_SHEET' &&
                                searchAction !== 'PARKING' &&
                                searchAction !== 'TOLL' &&
                                selectedDate <
                                  moment(new Date()).format('YYYY-MM-DD')
                                  ? false
                                  : null || selectedAccord?.includes(index)
                              }
                              onClick={(ev) => {
                                ev.stopPropagation();
                              }}
                              onChange={(ev) => {
                                selectParentData(ev, index);
                                // mergeRoute(ev, index);
                              }}
                            />
                          </Typography>
                          <Typography
                            style={{
                              width: '35%',
                              display: 'inherit',
                              zIndex: 99,
                            }}
                            onClick={(eve) => {
                              eve.stopPropagation();
                            }}
                          >
                            <img
                              className='route-icons'
                              src={
                                '/assets/images/' +
                                (e.tripType == 'UPTRIP'
                                  ? 'login_icon.png'
                                  : 'logout_icon.png')
                              }
                              style={{
                                position: 'relative',
                                right: '5px',
                                width: '20px',
                                height: '20px',
                              }}
                            />
                            <span
                              onClick={() => {
                                sethistoryOpen({
                                  code: e?.tripCode,
                                  id: e.id,
                                });
                              }}
                            >
                              {e?.tripCode}
                              {e?.tripCategory !== 'Adhoc' ? (
                                <div>[{e?.routeName || 'NA'}]</div>
                              ) : null}
                            </span>
                            {searchAction !== 'PARKING' &&
                              searchAction !== 'TOLL' && (
                                <span
                                  style={{
                                    marginLeft: '10px',
                                    maxWidth: '200px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {' (' +
                                    (e?.tripType == 'UPTRIP'
                                      ? e?.escortTrip == 'YES'
                                        ? e?.empList[1]?.location?.locName
                                            ?.split(',')
                                            ?.join(', ')
                                        : e?.empList[0]?.location?.locName
                                            ?.split(',')
                                            ?.join(', ')
                                      : e?.empList[
                                          Number(e?.empList?.length) - 1
                                        ]?.officeName) +
                                    ')'}
                                </span>
                              )}
                            <span>
                              {searchAction == 'PARKING' ? (
                                <Tooltip title={'Parking'}>
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <LocalParkingIcon
                                      sx={{
                                        ml: 6,
                                        mr: 2,
                                        fontSize: '14px',
                                      }}
                                    />
                                    <span>₹ {e.parkingCost || 0}</span>
                                  </div>
                                </Tooltip>
                              ) : searchAction == 'TOLL' ? (
                                <Tooltip title={'Toll Tax'}>
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <TollIcon
                                      sx={{
                                        ml: 6,
                                        mr: 2,
                                        fontSize: '14px',
                                      }}
                                    />
                                    <span>₹ {e.tollCost || 0}</span>
                                  </div>
                                </Tooltip>
                              ) : (
                                <></>
                              )}
                            </span>
                          </Typography>
                          <Typography
                            style={{
                              width: '10%',
                              alignItems: 'center',
                              zIndex: 99,
                            }}
                            onClick={(eve) => {
                              eve.stopPropagation();
                            }}
                          >
                            <img
                              className='route-icons'
                              src='/assets/images/route_page_icon/employee_blue.png'
                              style={{
                                position: 'relative',
                                top: '3px',
                                right: '5px',
                              }}
                            />
                            <span>
                              {e.escortTrip != 'YES'
                                ? '[' + e?.empList?.length + ']'
                                : '[' + (e?.empList?.length - 1) + ']'}
                            </span>
                          </Typography>

                          <Typography
                            sx={{
                              display: 'flex',
                              justifyContent: 'center',
                              width: '35%',
                              alignItems: 'center',
                              zIndex: 99,
                            }}
                          >
                            <Typography
                              style={{width: '50%', zIndex: 99}}
                              onClick={(eve) => {
                                eve.stopPropagation();
                              }}
                            >
                              {e.tripCategory !== 'Adhoc' ? (
                                <Tooltip
                                  onMouseEnter={() =>
                                    handleMouseEnter(e?.shiftId)
                                  }
                                  onMouseLeave={() => handleMouseLeave()}
                                  title={
                                    'Shift Time : ' +
                                    (displayShift?.shiftName ?? '') +
                                    ' ' +
                                    (e?.tripType == 'UPTRIP'
                                      ? displayShift?.shiftStartTime ?? ' '
                                      : displayShift?.shiftEndTime ?? ' ')
                                  }
                                >
                                  <img
                                    style={{
                                      marginRight: '6%',
                                      width: '20px',
                                      height: '20px',
                                    }}
                                    className='route-icons'
                                    src={
                                      e?.startTime == 'NA'
                                        ? '/assets/images/route_page_icon/dateTime.png'
                                        : '/assets/images/route_page_icon/dateTime_blue.png'
                                    }
                                  />
                                </Tooltip>
                              ) : e.tripCategory == 'Adhoc' ? (
                                <Tooltip
                                  title={
                                    'Shift Time : ' + (e?.adhocShiftTime ?? '')
                                  }
                                >
                                  <img
                                    style={{
                                      marginRight: '6%',
                                      width: '20px',
                                      height: '20px',
                                    }}
                                    className='route-icons'
                                    src={
                                      e?.startTime == 'NA'
                                        ? '/assets/images/route_page_icon/dateTime.png'
                                        : '/assets/images/route_page_icon/dateTime_blue.png'
                                    }
                                  />
                                </Tooltip>
                              ) : null}
                            </Typography>
                            {user?.userList?.userRole !== 'VENDOR' && (
                              <Typography
                                style={{width: '50%'}}
                                onClick={(eve) => {
                                  eve.stopPropagation();
                                }}
                              >
                                <Tooltip title={'Vendor:' + e?.vendorName}>
                                  <img
                                    style={{
                                      marginRight: '6%',
                                      maxWidth: '26px',
                                      maxHeight: '26px',
                                    }}
                                    className='route-icons'
                                    src={
                                      e?.vendorName == 'Not Assigned'
                                        ? '/assets/images/route_page_icon/vendor.png'
                                        : '/assets/images/route_page_icon/vendor_blue.png'
                                    }
                                  />
                                </Tooltip>
                              </Typography>
                            )}
                            <Typography
                              style={{width: '50%'}}
                              onClick={(eve) => {
                                eve.stopPropagation();
                              }}
                            >
                              <Tooltip title={'Escort:' + e?.escortName}>
                                <img
                                  onClick={() => {
                                    if (
                                      e?.escortTrip !== 'YES' ||
                                      e?.status == 'STARTED' ||
                                      moment(
                                        e?.routeDate +
                                          ' ' +
                                          e.startTime +
                                          ':00',
                                      ).isBefore(
                                        moment(new Date()).format(
                                          'YYYY-MM-DD HH:mm:ss',
                                        ),
                                      )
                                    ) {
                                      return;
                                    }
                                    setEscortAssign({
                                      dialog: true,
                                      tripId: e,
                                    });
                                  }}
                                  style={{
                                    marginRight: '6%',
                                    maxWidth: '26px',
                                    maxHeight: '26px',
                                  }}
                                  className='route-icons'
                                  src={
                                    e.escortTrip != 'YES'
                                      ? '/assets/images/escortCancelled.svg'
                                      : e?.escortName == 'Not Assigned'
                                      ? '/assets/images/route_page_icon/escort.png'
                                      : '/assets/images/route_page_icon/escort_blue.png'
                                  }
                                />
                              </Tooltip>
                            </Typography>
                            <Typography
                              style={{width: '50%'}}
                              onClick={(eve) => {
                                eve.stopPropagation();
                              }}
                            >
                              <Tooltip title={'Driver:' + e?.driverName}>
                                <img
                                  style={{
                                    marginRight: '6%',
                                    maxWidth: '26px',
                                    maxHeight: '26px',
                                  }}
                                  className='route-icons'
                                  src={
                                    e?.driverName == 'Not Assigned'
                                      ? '/assets/images/route_page_icon/driver.png'
                                      : '/assets/images/route_page_icon/driver_blue.png'
                                  }
                                />
                              </Tooltip>
                            </Typography>
                            <Typography
                              style={{width: '50%'}}
                              onClick={(eve) => {
                                eve.stopPropagation();
                              }}
                            >
                              {/* <Tooltip title={'Vehicle:' + e?.vehicleNo}>
                              <div style={{marginTop: '-19px'}}>
                                <span
                                  style={{
                                    width: '30px',
                                    opacity:
                                      e?.vehicleNo == 'Not Assigned' ? '0' : '',
                                  }}
                                >
                                  {((e?.escortTrip == 'YES'
                                    ? e?.empList?.length - 1
                                    : e?.empList?.length) || 0) +
                                    '/' +
                                    (e.vehicleOccupancy || 0)}
                                </span>
                                <br />
                                <img
                                  style={{
                                    marginRight: '6%',
                                    maxWidth: '26px',
                                    maxHeight: '26px',
                                  }}
                                  className='route-icons'
                                  src={
                                    e?.vehicleNo == 'Not Assigned'
                                      ? '/assets/images/route_page_icon/car.png'
                                      : '/assets/images/route_page_icon/car_blue.png'
                                  }
                                />
                              </div>
                            </Tooltip> */}
                              <Tooltip
                                title={
                                  e?.vehicleNo !== 'Not Assigned' ? (
                                    <ul style={{padding: '5px'}}>
                                      {e.vehicleType && (
                                        <li>{'Variant: ' + e.vehicleType}</li>
                                      )}
                                      {e?.vehicleNo && (
                                        <li>{'Vehicle No: ' + e?.vehicleNo}</li>
                                      )}
                                      {currVeh?.modelNo && (
                                        <li>{'Model: ' + currVeh?.modelNo}</li>
                                      )}
                                    </ul>
                                  ) : (
                                    <>Not Assigned</>
                                  )
                                }
                              >
                                <div
                                  style={{
                                    display: 'flex',
                                    // alignItems: 'center',
                                    // justifyContent: 'center',
                                    flexDirection: 'column',
                                    marginTop: '-25px',
                                    marginRight: '6%',
                                  }}
                                >
                                  <div>
                                    <span
                                      style={{
                                        width: '30px',
                                        opacity:
                                          e?.vehicleNo == 'Not Assigned'
                                            ? '0'
                                            : '',
                                      }}
                                    >
                                      {console.log('e?.vehicleOccupancy', e)}
                                      {((e?.escortTrip == 'YES'
                                        ? e?.empList?.length - 1
                                        : e?.empList?.length) || 0) +
                                        '/' +
                                        (e?.vehicleOccupancy || 0)}
                                    </span>
                                  </div>
                                  <div>
                                    {e?.vehicleChange == 'YES' && (
                                      <DirectionsCarIcon
                                        style={{
                                          marginRight: '5px',
                                          width: '21px',
                                          height: '21px',
                                          marginTop: '3px',
                                          color: 'orange',
                                        }}
                                        onMouseEnter={() => {
                                          if (!e.vehicleId) return;
                                          axios
                                            .get(
                                              Api.baseUri +
                                                '/user-reg/vehicle-reg/' +
                                                e?.vehicleId,
                                            )
                                            .then((rs) => {
                                              console.log(
                                                'res',
                                                rs?.data?.data,
                                              );
                                              setcurrVeh(rs?.data?.data);
                                            });
                                        }}
                                        onMouseLeave={() => {
                                          setcurrVeh({});
                                        }}
                                        onClick={() => {
                                          if (e?.vendorName == 'Not Assigned') {
                                            toast.error(
                                              'Please assign vendor first.',
                                            );
                                            return;
                                          }
                                          if (
                                            e?.escortTrip == 'YES' &&
                                            !e?.escortId
                                          ) {
                                            toast.error(
                                              'Please assign escort first',
                                            );
                                            return;
                                          }
                                          if (
                                            e?.status == 'COMPLETED' ||
                                            e?.status == 'CANCLED' ||
                                            e?.status == 'STARTED' ||
                                            e?.status == 'ABSENT' ||
                                            e?.status == 'NOSHOW'
                                            // ||
                                            // moment(
                                            //   e?.routeDate +
                                            //     ' ' +
                                            //     e.startTime +
                                            //     ':00',
                                            // ).isBefore(
                                            //   moment(new Date()).format(
                                            //     'YYYY-MM-DD HH:mm:ss',
                                            //   ),
                                            // )
                                          ) {
                                            return;
                                          }
                                          if (e?.escortTrip == 'YES') {
                                            if (
                                              moment(
                                                e?.empList[1]
                                                  ?.expectedArivalTime,
                                              ).isBefore(
                                                moment(new Date()).format(
                                                  'HH:mm:ss',
                                                ),
                                              )
                                            ) {
                                              return;
                                            }
                                          }
                                          if (e?.escortTrip !== 'YES') {
                                            if (
                                              moment(
                                                e?.routeDate +
                                                  ' ' +
                                                  e.startTime +
                                                  ':00',
                                              ).isBefore(
                                                moment(new Date()).format(
                                                  'YYYY-MM-DD HH:mm:ss',
                                                ),
                                              )
                                            ) {
                                              return;
                                            }
                                          }
                                          console.log('shrey');
                                          // setOpenVehicle(true);
                                          // setSelectedData(e);
                                        }}
                                        className='route-icons'
                                        src={
                                          e?.vehicleNo == 'Not Assigned'
                                            ? '/assets/images/route_page_icon/car.png'
                                            : '/assets/images/route_page_icon/car_blue.png'
                                        }
                                      />
                                    )}
                                    {e?.vehicleChange !== 'YES' && (
                                      <img
                                        style={{
                                          marginRight: '5px',
                                          width: '21px',
                                          height: '21px',
                                          marginTop: '3px',
                                        }}
                                        onMouseEnter={() => {
                                          if (!e.vehicleId) return;
                                          axios
                                            .get(
                                              Api.baseUri +
                                                '/user-reg/vehicle-reg/' +
                                                e?.vehicleId,
                                            )
                                            .then((rs) => {
                                              console.log(
                                                'rs?.',
                                                rs?.data?.data,
                                              );
                                              setcurrVeh(rs?.data?.data);
                                            });
                                        }}
                                        onMouseLeave={() => {
                                          setcurrVeh({});
                                        }}
                                        onClick={() => {
                                          if (e?.vendorName == 'Not Assigned') {
                                            toast.error(
                                              'Please assign vendor first.',
                                            );
                                            return;
                                          }
                                          if (
                                            e?.escortTrip == 'YES' &&
                                            !e?.escortId
                                          ) {
                                            toast.error(
                                              'Please assign escort first',
                                            );
                                            return;
                                          }
                                          if (
                                            e?.status == 'COMPLETED' ||
                                            e?.status == 'CANCLED' ||
                                            // e?.status !== 'SCHEDULE' ||t
                                            e?.status == 'STARTED'
                                            //  ||
                                            // moment(
                                            //   e?.routeDate +
                                            //     ' ' +
                                            //     e.startTime +
                                            //     ':00',
                                            // ).isBefore(
                                            //   moment(new Date()).format(
                                            //     'YYYY-MM-DD HH:mm:ss',
                                            //   ),
                                            // )
                                          ) {
                                            return;
                                          }
                                          if (e?.escortTrip == 'YES') {
                                            if (
                                              moment(
                                                e?.empList[1]
                                                  ?.expectedArivalTime,
                                              ).isBefore(
                                                moment(new Date()).format(
                                                  'HH:mm:ss',
                                                ),
                                              )
                                            ) {
                                              return;
                                            }
                                          }
                                          if (e?.escortTrip !== 'YES') {
                                            if (
                                              moment(
                                                e?.routeDate +
                                                  ' ' +
                                                  e.startTime +
                                                  ':00',
                                              ).isBefore(
                                                moment(new Date()).format(
                                                  'YYYY-MM-DD HH:mm:ss',
                                                ),
                                              )
                                            ) {
                                              return;
                                            }
                                          }
                                          // setOpenVehicle(true);
                                          // setSelectedData(e);
                                        }}
                                        className='route-icons'
                                        src={
                                          e?.vehicleNo == 'Not Assigned'
                                            ? '/assets/images/route_page_icon/car.png'
                                            : '/assets/images/route_page_icon/car_blue.png'
                                        }
                                      />
                                    )}
                                  </div>
                                </div>
                              </Tooltip>
                            </Typography>
                            <Typography
                              style={{width: '50%'}}
                              onClick={(eve) => {
                                eve.stopPropagation();
                              }}
                            >
                              <Tooltip title='Map'>
                                <img
                                  style={{
                                    marginRight: '6%',
                                    maxWidth: '26px',
                                    maxHeight: '26px',
                                  }}
                                  className='route-icons'
                                  src='/assets/images/route_page_icon/map.png'
                                  // onClick={() => {
                                  //   createmap(e);
                                  //   let tempo = expandedItem;
                                  //   if (expandedItem.includes(index)) {
                                  //     // tempo.splice(tempo.indexOf(index), 1);
                                  //   } else {
                                  //     tempo.push(index);
                                  //   }
                                  //   setExpandedItem([...tempo]);
                                  // }}
                                  onClick={() => {
                                    let tempo = expandedItem;
                                    let tempo2 = expandedItemMap;
                                    if (expandedItem.includes(index)) {
                                      // tempo2.splice(tempo.indexOf(index), 1);
                                    } else {
                                      tempo.push(index);
                                    }
                                    if (expandedItemMap.includes(index)) {
                                      tempo2.splice(tempo.indexOf(index), 1);
                                      createmap(e, 'collapse');
                                      if (!e?.polyLine) getAllList();
                                    } else {
                                      createmap(e, 'expand');
                                      tempo2.push(index);
                                    }
                                    setExpandedItem([...tempo]);
                                    setExpandedItemMap([...tempo2]);
                                  }}
                                />
                              </Tooltip>
                            </Typography>
                            <Typography
                              style={{width: '50%'}}
                              onClick={(eve) => {
                                eve.stopPropagation();
                              }}
                            >
                              {' '}
                              {e?.tripCategory ? (
                                <span className='adhoc-creation btn'>
                                  {e?.tripCategory}
                                </span>
                              ) : null}
                            </Typography>
                          </Typography>

                          <Typography
                            style={{
                              width: '10%',
                              alignItems: 'center',
                              display: 'flex',
                              justifyContent: 'center',
                            }}
                            onClick={(eve) => {
                              eve.stopPropagation();
                            }}
                          >
                            <img
                              className='route-icons'
                              src='/assets/images/dashboard/recent_order_option.png'
                            />
                            {e?.status == 'COMPLETED' ||
                            e?.status == 'STARTED' ||
                            e?.status == 'CANCLED' ||
                            e?.status == 'ABSENT' ||
                            e?.status == 'NOSHOW' ||
                            moment(
                              e?.routeDate + ' ' + e.startTime + ':00',
                            ).isBefore(
                              moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                            ) ? null : (
                              <EditIcon
                                style={{
                                  position: 'absolute',
                                  right: '55px',
                                  color: '#407999',
                                }}
                                onClick={() => {
                                  if (
                                    myData[index]?.escortTrip == 'YES' &&
                                    !myData[index]?.escortId
                                  ) {
                                    toast.error('Please assign escort first');
                                    return;
                                  }
                                  if (
                                    moment(
                                      e?.routeDate + ' ' + e.startTime + ':00',
                                    ).isBefore(
                                      moment(new Date()).format(
                                        'YYYY-MM-DD HH:mm:ss',
                                      ),
                                    )
                                  ) {
                                    return;
                                  }
                                  setOpen(true);
                                  console.log('e', e);
                                  setSelectedTrip(e);
                                }}
                              />
                            )}
                          </Typography>
                        </div>
                      </AccordionSummary>

                      <AccordionDetails>
                        {searchAction == 'TOLL' &&
                        expandedItem.includes(index) ? (
                          <Toll
                            showRem={showRem}
                            selected={selectedAccord}
                            pind={index}
                            tid={e.id}
                            selectParentData={selectParentData}
                            setSelectedTolls={setSelectedTolls}
                            selectedTolls={selectedTolls}
                          />
                        ) : searchAction == 'PARKING' &&
                          expandedItem.includes(index) ? (
                          <Parking
                            showRem={showRem}
                            selected={selectedAccord}
                            pind={index}
                            tid={e.id}
                            selectParentData={selectParentData}
                            setSelectedTolls={setSelectedTolls}
                            selectedTolls={selectedTolls}
                          />
                        ) : (
                          <Typography
                            sx={{
                              border: '1px solid #efefef',
                              borderRadius: '8px',
                            }}
                          >
                            <div
                              id={e.tripCode}
                              className='emp-location-map'
                              style={{
                                height: expandedItemMap?.includes(index)
                                  ? '400px'
                                  : '',
                                maxHeight: '400px',
                                display: 'none',
                              }}
                            >
                              {expandedItemMap?.includes(index) && (
                                <TripDirection
                                  data={e}
                                  getAllList={getAllList}
                                />
                              )}
                            </div>
                            <table style={{borderSpacing: '0px'}}>
                              <tbody>
                                <RouteDataList
                                  selectedAccord={selectedAccord}
                                  childdata={childData}
                                  id={index}
                                  searchAction={searchAction}
                                />
                              </tbody>
                            </table>
                          </Typography>
                        )}
                      </AccordionDetails>
                    </Accordion>
                  </>
                );
              })
            ) : !myData ? (
              <p
                style={{
                  fontSize: '12px',
                  paddingLeft: '45%',
                  margin: '20% 0 20% 0',
                }}
              >
                No records to display
              </p>
            ) : (
              <p
                style={{
                  fontSize: '12px',
                  paddingLeft: '45%',
                  margin: '20% 0 20% 0',
                }}
              >
                No records to display
              </p>
            )}
          </div>
        </div>
      </div>
      <TablePagination
        component='div'
        count={tripLength?.totalElements}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <div style={{textAlign: 'center', marginTop: '20px'}}>
        {searchAction == 'TOLL' || searchAction == 'PARKING' ? (
          <span>
            <Button
              id='btnMui123'
              variant='contained'
              sx={{mr: 2}}
              disabled={!selectedTolls?.length}
              onClick={(e) => {
                setShowRem('Approve');
              }}
            >
              Approve
            </Button>
            <Button
              id='btnMui123'
              variant='contained'
              sx={{mr: 2}}
              disabled={!selectedTolls?.length}
              onClick={(e) => {
                setShowRem('Reject');
              }}
            >
              Reject
            </Button>
          </span>
        ) : (
          <Button
            id='btnMui123'
            variant='contained'
            // disabled={
            //   selectedDate < moment(new Date()).format('YYYY-MM-DD') ||
            //   !isAnySelected
            // }
            sx={{mr: 2}}
            onClick={(e) => {
              handleSubmitAction(e);
              if (searchAction == 'TRIP_SHEET') {
                console.log('tripsheet');
              }
            }}
          >
            Submit
          </Button>
        )}
        <Button
          id='btnMui123'
          variant='outlined'
          sx={{mr: 2}}
          onClick={(e) => {
            navigate('/dashboard');
          }}
        >
          Cancel
        </Button>
      </div>
      {/* {selectedItems?.length ? <AssignToDriver selectedItems={selectedItems} setOpen={setOpenFun} /> : null} */}
      {historyOpen?.id && (
        <Dialog
          open={true}
          onClose={() => {
            sethistoryOpen(null);
          }}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
          maxWidth='false'
          PaperProps={{
            sx: {
              width: 500,
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
            Trip History ({historyOpen?.code || 'NA'})
            <IconButton
              onClick={() => {
                sethistoryOpen(null);
              }}
              style={{position: 'absolute', top: '8px', right: '8px'}}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <History data={historyData} />
          </DialogContent>
        </Dialog>
      )}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle
          id='alert-dialog-title'
          style={{
            background: '#f5f2f2',
            position: 'relative',
            fontSize: '21px',
          }}
        >
          {selectedTrip?.vehicleNo == 'Not Assigned'
            ? 'Assign Vehicle'
            : 'Re-assign Vehicle'}
          <IconButton
            onClick={() => {
              setAddClicked(false);
            }}
            style={{position: 'absolute', top: '8px', right: '8px'}}
          >
            <CloseIcon
              onClick={() => {
                setOpen(false);
              }}
            />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{minWidth: '500px'}} id='alert-dialog-description'>
          <SmartForm
            template={poptemplate}
            onSubmit={handleSubmitDriver}
            buttons={[
              selectedTrip?.vehicleNo == 'Not Assigned' ? 'submit' : 'update',
            ]}
          />
        </DialogContent>
      </Dialog>
      {allShiftHistoryOpen && (
        <Dialog
          open={allShiftHistoryOpen}
          onClose={() => {
            setAllShiftHistoryOpen(false);
          }}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
          maxWidth='false'
          PaperProps={{
            sx: {
              width: 500,
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
            Shift History(
            {selectedDate ?? moment(new Date()).format('YYYY-MM-DD')})
            <IconButton
              onClick={() => {
                setAllShiftHistoryOpen(false);
              }}
              style={{position: 'absolute', top: '8px', right: '8px'}}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <History data={allShiftHistory} />
          </DialogContent>
        </Dialog>
      )}
      <Dialog
        open={escortAssign.dialog}
        onClose={() => {
          setEscortAssign({...escortAssign, dialog: false});
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        maxWidth='false'
        PaperProps={{
          sx: {
            width: 400,
            maxHeight: 500,
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
          Assign Escort
          <IconButton
            onClick={() => {
              setEscortAssign({...escortAssign, dialog: false});
            }}
            style={{position: 'absolute', top: '8px', right: '8px'}}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div className='grid-container'>
            <SmartForm
              template={EscortTemplate}
              onSubmit={handleSubmitEscort}
              buttons={['Submit']}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openRoute}
        onClose={() => {
          setOpenRoute(false);
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        maxWidth='false'
        PaperProps={{
          sx: {
            width: 500,
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
          Route Download
          <IconButton
            onClick={() => {
              setOpenRoute(false);
            }}
            style={{position: 'absolute', top: '8px', right: '8px'}}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <SmartForm
            template={templateDownload}
            onSubmit={handleSubmitDownload}
            buttons={['xls', 'pdf']}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

function initialize(mmiToken, loadCallback) {
  try {
    if (mmiToken) {
      let count = 0;
      //Insert your script seperated by comma like scriptArr = [mapSDK_url, plugins_url];
      // checking map key is working or not
      fetch(
        'https://apis.mappls.com/advancedmaps/api/' +
          mmiToken +
          '/map_sdk?layer=vector&v=3.0',
        {
          method: 'GET',
        },
      ).then((response) => {
        if (response?.status && response?.status != 200) {
          // map key is not working and have to rtegenerate
          fetch(Api.baseUri + '/userauth/app/mapkey/generate', {
            method: 'GET',
          })
            .then((response) => response.json())
            .then((response) => {
              if (response?.status != 200) {
                // map key not generated
                toast.error(
                  'Something went wrong with map key. Please contact to system administrator.',
                );
              } else {
                // new map key generated
                localStorage.setItem('mappl_access_token', response?.data);
                let mapSDK_url =
                  'https://apis.mappls.com/advancedmaps/api/' +
                  response?.data +
                  '/map_sdk?layer=vector&v=3.0';
                let plugins_url =
                  'https://apis.mappls.com/advancedmaps/api/' +
                  response?.data +
                  '/map_sdk_plugins?v=3.0';
                var scriptArr = [mapSDK_url, plugins_url];
                const recursivelyAddScript = (script) => {
                  if (count < script.length) {
                    const el = document.createElement('script');
                    el.src = script[count];
                    el.async = true;
                    el.type = 'text/javascript';
                    document.getElementsByTagName('head')[0].appendChild(el);
                    count = count + 1;
                    el.onload = function () {
                      recursivelyAddScript(script);
                    };
                  } else {
                    return loadCallback();
                  }
                };
                recursivelyAddScript(scriptArr);
              }
            });
        } else {
          // mapp key is working
          let mapSDK_url =
            'https://apis.mappls.com/advancedmaps/api/' +
            mmiToken +
            '/map_sdk?layer=vector&v=3.0';
          let plugins_url =
            'https://apis.mappls.com/advancedmaps/api/' +
            mmiToken +
            '/map_sdk_plugins?v=3.0';
          var scriptArr = [mapSDK_url, plugins_url];
          const recursivelyAddScript = (script) => {
            if (count < script.length) {
              const el = document.createElement('script');
              el.src = script[count];
              el.async = true;
              el.type = 'text/javascript';
              document.getElementsByTagName('head')[0].appendChild(el);
              count = count + 1;
              el.onload = function () {
                recursivelyAddScript(script);
              };
            } else {
              return loadCallback();
            }
          };
          recursivelyAddScript(scriptArr);
        }
      });
    }
  } catch (e) {
    console.error(String(e));
  }
}
export default RouteLists;
