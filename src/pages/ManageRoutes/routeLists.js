import React, {useState, useEffect, useRef} from 'react';
import ReactDOMServer from 'react-dom/server';
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  DirectionsRenderer,
  InfoWindow,
} from '@react-google-maps/api';
import {GoogleMapsAPI} from '@smart-form/GoogleMap/g-config';
import {useNavigate, useParams} from 'react-router-dom';
import SmartForm from '@smart-form';
import {useAuthUser} from '@crema/utility/AuthHooks';
import AppLoader from '@crema/core/AppLoader';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import {makeStyles} from '@mui/styles';
import RouteDataList from './routeDataList';
import TripDirection from './tripDirection';
import CustomLabel from 'pages/common/CustomLabel';
import {Button, Checkbox, Tooltip} from '@mui/material';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import TollIcon from '@mui/icons-material/Toll';
import Box from '@mui/material/Box';
import AppTooltip from '@crema/core/AppTooltip';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import TripDetails from './TripDetails';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';
import Api from '@api';
import AssignToVendor from './assign-to-vendor';
import AssignToVehicle from './assign-to-vehicle';
import moment from 'moment';
import {toast} from 'react-toastify';
import Confirm from '@confirmation-box';
import _ from '@lodash';
import UploadRoutes from './Upload Route/Upload-route';
import {NULLIFY_MAIL} from 'shared/constants/ActionTypes';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import TablePagination from '@mui/material/TablePagination';
// import Box from '@mui/material/Box';
// import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
// import Typography from "@mui/material/Typography";
import ContentCut from '@mui/icons-material/ContentCut';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ContentPaste from '@mui/icons-material/ContentPaste';
import Cloud from '@mui/icons-material/Cloud';
import AxiosError from 'axios-error';
import {styled, lighten, darken} from '@mui/system';
import {useSelector} from 'react-redux';
import Penalty from './penalty';
import Parking from './parking';
import Toll from './toll';
import History from './history';
import InfoIcon from '@mui/icons-material/Info';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {get} from 'react-hook-form';
import {useReactToPrint} from 'react-to-print';
import TripSheet from './TripSheet';
import jsPDF from 'jspdf';
import SOSPOPUP from '../SOSPOPUP/index';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
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

const RouteLists = () => {
  const DefaultLocation = {lat: 28.62, lng: 77.09};
  const param = useParams();
  const [multipleTrip, setMultipleTrip] = useState();
  const [showbtn, setshowbtn] = React.useState(true);
  const [historyOpen, sethistoryOpen] = useState(null);
  const [selectedAccord, setSelectedAccord] = React.useState([]);
  const [selectedEmp, setSelectedEmp] = React.useState([]);
  const {user} = useAuthUser();
  const navigate = useNavigate();
  const [adhocCount, setAdhocCount] = useState(0);
  const [formData, setformData] = useState({});
  const [selectedBox, setSelectedBox] = useState([]);
  const [isAnySelected, setIsAnySelected] = useState(false);
  const [selectedDate, setSelectedDate] = useState();
  const [searchAction, setSearchAction] = useState('');
  const [shiftList, setShiftList] = useState();
  const [myData, setMyData] = useState([]);
  const [counts_, setCounts_] = useState([]);
  const [showLoader, setshowLoader] = useState(false);
  const [tripCodeList, setTripCodeList] = useState([]);
  const [tripPrevId, setTripPrevId] = useState('');
  const [moveEmpId, setMoveEmpId] = useState('');
  const [movePid, setMovePid] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [childData, setChildData] = useState([]);
  const [dlinkData, setDlinkData] = useState([]);
  const [filterOptions, setFilterOptions] = useState({});
  const [addClicked, setAddClicked] = React.useState(false);
  const [moveClicked, setMoveClicked] = React.useState(false);
  const [escortAssign, setEscortAssign] = React.useState({dialog: false});
  const [escortList, setEscortList] = React.useState([]);
  const [tripidToAddEmp, setTripidToAddEmp] = React.useState(false);
  const [assigneeEmp, setassigneeEmp] = React.useState();
  const [deleteConfirmbox, setDeleteConfirmbox] = useState(false);
  const [dlinkConfirmbox, setDlinkConfirmbox] = useState(false);
  const [deleteEmpId, setDeleteEmpId] = React.useState([]);
  const [tripId, setTripId] = React.useState([]);
  const [splitGroup, setSplitGroup] = React.useState([]);
  const [displayShift, setDisplayShift] = useState({});
  const [expandedItem, setExpandedItem] = React.useState([]);
  const [expandedItemMap, setExpandedItemMap] = React.useState([]);
  const [postData, setPostData] = useState();
  const [groupFilter, setGroupFilter] = useState();
  const [vehicleSelected, setVehicleSelected] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState();
  const [dotMenu, setDotMenu] = useState(false);
  const [deleteTripConfirmBox, setDeleteTripConfirmBox] = useState(false);
  const [tripIdtoDelete, setTripIdtoDelete] = useState();
  const [indexNum, setIndexNum] = useState();
  const [vendorList, setVendorList] = useState();
  const [value, setValue] = React.useState(0);
  const [penaltyBox, setPenaltyBox] = useState(false);
  const [openVehicle, setOpenVehicle] = useState(false);
  const [selectedData, setSelectedData] = useState();
  const [penalty, setPenalty] = useState();
  const [vendorId, setVendorId] = useState();
  const [historyData, setHistoryData] = useState();
  const [selectedTolls, setSelectedTolls] = useState([]);
  const [currVeh, setcurrVeh] = useState({});
  const [allShiftHistory, setAllShiftHistory] = useState({});
  const [allShiftHistoryOpen, setAllShiftHistoryOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(moment().format('HH:mm:ss'));
  const [shifts, setShifts] = useState();
  const myref = useRef(null);
  const [trip_Sheet, setTrip_sheet] = useState();
  const [_select, set_Select] = useState(false);
  const [localities, setLocalities] = useState();
  const [localitiesValue, setLocalitiesValue] = useState();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [tripLength, setTripLength] = useState();
  const [openAudit, setOpenAudit] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState();
  const [openReason, setOpenReason] = useState(false);
  const [myInput, setMyInput] = useState();
  const [routeSetting, setRouteSetting] = useState();
  const [tripDetail, setTripDetail] = useState(false);
  const [closeTripData, setCloseTripData] = useState();
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);
  useEffect(() => {
    // if (debouncedSearchTerm) {
    getAllList();
    // }
  }, [debouncedSearchTerm]);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };
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
  useEffect(() => {
    let temp = [];
    axios
      .get(Api.baseUri + '/user-reg/employee-reg/getLocalitiesData')
      .then((res) => {
        res?.data?.data?.map((el) => {
          temp.push({title: el?.locality, value: el?.locality});
        });

        setLocalities(temp);
      })
      .catch((err) => {
        console.log('err', err);
      });
  }, []);

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
  const [showRem, setShowRem] = useState(false);
  const [dd, setDD] = useState(false);

  const handlePrintTripSheet = useReactToPrint({
    // onBeforePrint: () => (document.title = ' Invoice'),
    content: () => myref.current,
  });

  function differencebetweenTime(d1, d2) {
    if (!d1 || !d2) return;
    // Declare dates
    let td1 = new Date(d1);
    let td2 = new Date(d2);
    let dif = td2 - td1;
    dif = Math?.round(dif / 1000 / 60);
    return dif;
  }
  setTimeout(() => {
    setDD(true);
  }, 200);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [myActions, setMyActions] = useState([]);
  const permissionCheck = useSelector(({settings}) => settings.permissions);
  useEffect(() => {
    if (!permissionCheck) return;
    let sub_mod = {};
    permissionCheck?.map((el) => {
      if (el.subModuleName == 'Route List') sub_mod = el;
    });
    setMyActions(sub_mod?.actions);
    if (
      (!sub_mod || !sub_mod?.actions?.includes('View')) &&
      user?.userList?.userRole !== 'SUPERADMIN'
    )
      navigate('/error-pages/error-404');
  }, [permissionCheck, user]);

  const ref = useRef(null);
  useOutsideAlerter(ref);
  function useOutsideAlerter(ref) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setTimeout(() => {
            setDotMenu(false);
          }, 100);
        }
      }
      // Bind the event listener
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [ref]);
  }
  useEffect(() => {
    axios
      .get(
        Api.baseUri +
          `/user-reg/routing-rule/get-by-corporate-id/${user?.userList?.profileId}`,
      )
      .then((res) => {
        setRouteSetting(res?.data?.data);
      })
      .catch((err) => {
        console.log('err', err);
      });
  }, []);
  useEffect(() => {
    const interval = window.setInterval(function () {
      getAllList();
      const currentTimestamp = moment().format('HH:mm:ss');
      setLastUpdated(currentTimestamp);
    }, 2000 * 60 * 1);

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

  useEffect(() => {
    let url = `${
      Api.employee.list
    }/corporate?page=${0}&size=${1200}&emailId=${null}&employeeCode=${null}&mobileNo=${null}`;
    axios
      .get(url)
      .then((result) => {
        let tem = result?.data?.data?.body?.EmployeeList;
        let temArr = [];
        tem?.map((el) => {
          temArr.push({title: el?.employeeFullName, value: el?.id});
        });
        setassigneeEmp(temArr ?? []);
      })
      .catch((err) => {
        setassigneeEmp([]);
      });
    let temp = [];
    axios
      .get(
        Api.baseUri +
          '/user-reg/penalty-Service/getAll?page=0&size=10&reason=null',
      )
      .then((res) => {
        res?.data?.data?.body?.['Penalty List']?.map((el) => {
          temp.push({title: el?.reason, value: el?.id});
        });
        setPenalty(temp ?? []);
      })
      .catch((er) => {
        setPenalty(temp ?? []);
      });
    axios
      .get(
        Api.baseUri +
          '/user-reg/escort-reg/corporate?page=0&size=10&escortCode=null&mobileNo=null&emailId=null&policeVericationNo=null',
      )
      .then((res) => {
        let arr = [];
        res?.data?.data?.body['Escort List']?.map((el) => {
          arr.push({title: el.firstName + ' ' + el.lastName, value: el.id});
        });
        setEscortList(arr);
      })
      .catch((err) => {});
  }, []);
  useEffect(() => {
    if (param?.id && param?.id != 'ALL' && param?.id?.split('==>>')[1]) {
      let temObj = filterOptions;
      temObj.date = param?.id?.split('==>>')[1];
      temObj.tripType = param?.id?.split('==>>')[2];
      setFilterOptions(temObj);
    }

    let arr = [{title: 'All Shifts', value: 'ALL'}];
    let url = `${
      Api.manageshifts.getlistbyCorporate
    }corporateId?page=${0}&size=${1000}&shiftName=null`;
    axios
      .get(url)
      .then((re) => {
        let temArray = re?.data?.data?.body?.ShiftList ?? [];
        temArray?.map((el) => {
          arr.push({
            title:
              el?.shiftName +
              ' - ' +
              el.pickupType +
              ' (' +
              el?.shiftStart +
              ' - ' +
              el?.shiftEnd +
              ') ',
            value: el?.id,
          });
        });
        setShiftList(arr);
      })
      .catch((err) => {
        setShiftList([{title: 'All Shifts', value: 'ALL'}]);
      });
    axios
      .get(Api.baseUri + '/user-reg/associatevendor/getallassociatecorporateId')
      .then((re) => {
        let temArr = [];
        re?.data?.data?.length &&
          re?.data?.data?.map((el) => {
            if (el?.vendor)
              temArr.push({
                title: el?.vendor?.vendorName,
                value: el?.vendor?.id,
              });
          });
        let sortedProducts = temArr.sort((p1, p2) =>
          new Date(p1.createdOn) < new Date(p2.createdOn)
            ? 1
            : new Date(p1.createdOn) > new Date(p2.createdOn)
            ? -1
            : 0,
        );
        setVendorList(sortedProducts ?? []);
      });
  }, []);

  useEffect(() => {
    setFilterOptions(filterOptions);
    getAllList();
  }, [
    filterOptions,
    searchAction,
    groupFilter,
    localitiesValue,
    page,
    rowsPerPage,
  ]);

  function fetchPenaltyAmount(d) {
    axios
      .get(Api.baseUri + '/user-reg/penalty-Service/' + d)
      .then((res) => {})
      .catch((err) => {});
  }

  function handlePenaltyChange(val) {
    fetchPenaltyAmount(val?.penalty?.value);
  }

  function handleSubmitAddEmp(val) {
    let reqBody = {
      tripId: tripidToAddEmp,
      passengers: [val?.data?.empId],
    };
    axios
      .post(Api?.baseUri + '/user-reg/trip-altr/add', reqBody)
      .then((res) => {
        if (res?.status == 200) {
          setAddClicked(false);
          if (res?.data?.status == 200) {
            toast.success(res?.data?.message ?? 'Added successfully.');
            getAllList();
          } else {
            toast.error(res?.data?.message ?? 'Something went wrong.');
          }
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  }
  function handleSubmitMoveEmp(val) {
    let reqBody = {
      tripId: tripPrevId,
      passengers: [movePid],
    };
    axios
      .post(Api?.baseUri + '/user-reg/trip-altr/remove', reqBody)
      .then((res) => {
        if (res?.data?.status == 200) {
          handleSubmitAddMoveEmp(val);
        } else {
          toast.error(res?.data?.message ?? 'Something Wrong.');
        }
      })
      .catch((err) => {
        toast.error('Something went wrong.');
      });
  }
  function handleSubmitAddMoveEmp(val) {
    let reqBody = {
      tripId: val?.data?.tripId,
      passengers: [moveEmpId],
    };
    axios
      .post(Api?.baseUri + '/user-reg/trip-altr/add', reqBody)
      .then((res) => {
        setMoveClicked(false);
        if (res?.data?.status == 200) {
          toast.success(res?.data?.message ?? 'Moved Successfully.');
          getAllList();
        } else {
          toast.error(res?.data?.message ?? 'Something Wrong.');
        }
      })
      .catch((err) => {
        toast.error('Something went wrong.');
      });
  }
  function closedeleteTripConfirmBox(val) {
    if (val == 'YES') {
      axios
        .post(
          Api.baseUri + '/user-reg/trip-route/cancel-trips/' + tripIdtoDelete,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success(`${res?.data?.data?.tripCode} is cancelled`);
            setDeleteTripConfirmBox(false);
            getAllList();
            setDotMenu(false);
          } else {
            toast.error('Something Went Wrong');
          }
        })
        .catch((err) => {});
    } else {
      setDeleteTripConfirmBox(false);
      setDotMenu(false);
    }
  }

  function getAllList() {
    setshowLoader(true);
    let postData = {
      date: filterOptions?.date || moment(new Date()).format('YYYY-MM-DD'),
      // date: tripdate,
      tripType: filterOptions?.tripType || 'ALL',
      vendorId: filterOptions?.vendorId || null,
      shiftId: filterOptions?.shiftTime || 'ALL',
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
          : groupFilter?.tripStatus == 'EXPIRED'
          ? 'EXPIRED'
          : groupFilter?.tripStatus == 'ABSENT'
          ? 'ABSENT'
          : groupFilter?.tripStatus == 'NOSHOW'
          ? 'NOSHOW'
          : null,
      numberOfFemalePassengers:
        groupFilter?.no_of_female == 'NO_OF_FEMALE' ? 1 : 0,
      driverStatus:
        groupFilter?.driver == 'ACCEPT'
          ? 'ACCEPT'
          : groupFilter?.driver == 'ASSIGN'
          ? 'NONE'
          : null,
      escortTrip: groupFilter?.escort == 'YES' ? 'YES' : null,
    };
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
        setshowLoader(false);
        let arr = [];
        let tripList = [];
        let adCount = 0;
        result?.data?.data?.content?.map((r) => {
          if (r?.vehicleStatus == null) {
            r.vehicleStatus = 'NONE';
          }
          if (param?.id != 'ALL' && tem.id != param?.id?.split('==>>')[0]) {
            return;
          }

          if (
            searchAction &&
            searchAction != 'PARKING' &&
            searchAction != 'TOLL' &&
            searchAction != 'TRIP_SHEET' &&
            searchAction !== 'AUDIT_TRIP' &&
            moment(r?.date + ' ' + r.startTime + ':00').isBefore(
              moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            )
          )
            return;
          if (
            (searchAction == 'ASSIGN_TO_VENDOR' && r?.vendorStatus != 'NONE') ||
            (searchAction == 'RE_ALLOCATE_VENDOR' &&
              r?.vendorStatus != 'ASSIGN') ||
            (searchAction == 'ALLOCATE_VEHICLE' &&
              r?.vehicleStatus != 'NONE') ||
            (searchAction == 'RE_ALLOCATE_VEHICLE' &&
              r?.vehicleStatus != 'ASSIGN')
          )
            return;

          if (searchAction == 'ASSIGN_TO_VENDOR' && r?.status == 'CANCLED') {
            return;
          }
          if (searchAction == 'TRIP_SHEET' && r?.status == 'CANCLED') {
            return;
          }
          if (
            searchAction == 'AUDIT_TRIP' &&
            (r?.date == moment().format('YYYY-MM-DD') ||
              r?.auditedStatus == 'AUDITED')
          ) {
            return;
          }
          if (searchAction == 'AUDIT_TRIP' && r?.auditedStatus == 'AUDITED') {
            return;
          }

          if (searchAction == 'CLOSE_TRIP' && r?.status !== 'STARTED') {
            return;
          }

          let tem = {};
          tem.id = r?.id;
          tem.escortTrip = r?.escortTrip;
          tem.escortId = r?.escortId;
          tem.tripCode = r?.tripCode ?? 'NA';
          tem.tripName = r?.tripName ?? 'NA';
          tem.vehicleNo = r?.vehicleNo || 'Not Assigned';
          tem.vehicleType = r?.vehicleType;
          tem.numberOfMalePassengers = r?.numberOfMalePassengers;
          tem.numberOfFemalePassengers = r?.numberOfFemalePassengers;
          tem.vehicleOccupancy = r?.vehicleOccupancy;
          tem.vehicleId = r?.vehicleId;
          tem.escortName = r?.escortName || 'Not Assigned';
          tem.driverName = r?.driverName || 'Not Assigned';
          tem.driverId = r?.driverId;
          tem.routeName = r?.routeName;
          tem.tripCategory = r?.tripCategory == 'ADHOCTRIP' ? 'Adhoc' : '';
          tem.tripType = r?.tripType;
          tem.routeDate = r?.date;
          tem.vendorStatus = r?.vendorStatus == 'NONE' ? 'No' : 'Yes';
          tem.vendorName = r?.vendorName || 'Not Assigned';
          tem.status = r?.status;
          tem.startTime = r?.startTime || 'NA';
          tem.tripDistance = r?.tripDistance;
          tem.actualTripDistance = r?.actualTripDistance;
          tem.noOfStoppage = r?.stopList?.length;
          tem.stops = r?.stopList;
          tem.tollParkingData = r?.tollParkingData;
          tem.tollCost = r?.tollCost;
          tem.parkingCost = r?.parkingCost;
          tem.shiftId = r?.shiftId;
          tem.vendorId = r?.vendorId;
          tem.escortTrip = r?.escortTrip;
          tem.vehicleStatus = r?.vehicleStatus;
          tem.stopList = r?.stopList;
          tem.isFemale = false;
          tem.vehicleChange = r?.vehicleChange;
          tem.polyLine = r?.polyLine;
          let temarr = [];
          r?.stopList?.map((empc) => {
            empc?.onBoardPassengers?.map((elel) => {
              if (elel.passType == 'ESCORT') {
                tem.escortTime = moment(elel.expectedArivalTime).format(
                  'HH:mm',
                );
              }
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
          let _escArr = [];
          r?.stopList?.map((_esc) => {
            _esc?.onBoardPassengers?.map((_el) => {
              // console.log('_el', _el);
              if (_el?.passType == 'ESCORT') {
                _escArr.push(_el);
              }
            });
          });
          tem.escort = _escArr;
          arr.push(tem);
          tripList.push({title: r?.tripCode ?? 'NA', value: r?.id});
        });
        let can_emp = 0;
        let abs_emp = 0;
        let noshow_emp = 0;
        let fem = 0;
        arr?.map((elmt) => {
          elmt?.empList?.map((elem) => {
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
        let mytemD5 = _.groupBy(arr, 'vehicleStatus');
        let mytemD6 = _.groupBy(arr, 'vendorId');
        let mytemD7 = _.groupBy(arr, 'driverId');
        setCounts_({
          ADHOC: mytemD?.Adhoc?.length || 0,
          REG: (arr?.length || 0) - (mytemD?.Adhoc?.length || 0),
          ALL: arr?.length,
          FEMALE: mytemD2?.YES?.length || 0,
          ESCORT: mytemD3?.YES?.length || 0,
          T_CANCELLED: mytemD4?.CANCLED?.length || 0,
          T_ABSENT: mytemD4?.ABSENT?.length || 0,
          T_NOSHOW: mytemD4?.NOSHOW?.length || 0,
          T_COMPLETED: mytemD4?.COMPLETED?.length || 0,
          T_STARTED: mytemD4?.STARTED?.length || 0,
          T_SCHEDULE: mytemD4?.SCHEDULE?.length || 0,
          T_EXPIRED: mytemD4?.EXPIRED?.length || 0,
          VEH_ASSIGN: mytemD5?.ASSIGN?.length || 0,
          E_CANCELLED: can_emp,
          E_ABSENT: abs_emp,
          E_NOSHOW: noshow_emp,
          E_FEM: fem,
          VEN_ASS: mytemD6?.length,
          VEN_NASS: arr?.length - mytemD6?.length,
          DRI_ASS: mytemD7?.length,
          DRI_NASS: arr?.length - mytemD7?.length,
        });
        setMyData([...arr]);
        setChildData([...arr]);
        setTripCodeList([...tripList]);
      })
      .catch((err) => {
        setshowLoader(false);
      });
  }
  useEffect(() => {
    let init = false;
    for (let [key, value] of Object.entries(childData)) {
      value?.empList?.length &&
        value?.empList?.map((ar) => {
          if (ar.checked == true) {
            init = true;
          }
        });
    }
    setIsAnySelected(init);
  }, [childData]);

  useEffect(() => {
    console.log('page', page, rowsPerPage);
  }, [page, rowsPerPage]);

  const actionList = [
    {label: 'Assign to Vendor', value: 'ASSIGN_TO_VENDOR'},
    {label: 'Re-Allocate Vendor', value: 'RE_ALLOCATE_VENDOR'},
    {label: 'Toll Tax', value: 'TOLL'},
    {label: 'Parking', value: 'PARKING'},
    {label: 'Merge Route', value: 'MERGE_ROUTE'},
    {label: 'Trip Sheet', value: 'TRIP_SHEET'},
    {label: 'Approve for Billing', value: 'AUDIT_TRIP'},
    {label: 'Close Trip', value: 'CLOSE_TRIP'},

    // { label: 'Allocate Vehicle', value: 'ALLOCATE_VEHICLE' },
    // { label: 'Re-Allocate Vehicle', value: 'RE_ALLOCATE_VEHICLE' },
  ];
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

  const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        marginTop: theme.spacing(2),
      },
    },
  }));

  useEffect(() => {
    setSearchAction(searchAction);
  }, [searchAction]);
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
            defaultValue: filterOptions?.tripType || 'ALL',
            title: 'Trip Type',
            options: [
              {title: 'All', value: 'ALL'},
              {title: 'Login', value: 'UPTRIP'},
              {title: 'Logout', value: 'DOWNTRIP'},
            ],
            style: {width: '20%'},
          },
          {
            type: 'select',
            name: 'shiftTime',
            id: 'shiftTime',
            defaultValue: 'ALL',
            title: 'Shift Time',
            options: shiftList ?? [{title: 'All Shifts', value: 'ALL'}],
            style: {width: '20%'},
          },
          {
            type: 'autocomplete',
            name: 'vendorId',
            id: 'vendorId',
            title: 'Vendor',
            options: vendorList ?? [],
            style: {width: '20%'},
          },
        ],
      },
    ],
  };
  let remTemplate = {
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
            type: 'text',
            name: 'remarks',
            id: 'remarks',
            title: 'Remarks',
          },
        ],
      },
    ],
  };
  let templateAdd = {
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
            type: 'autocomplete',
            name: 'empId',
            id: 'empId',
            title: 'Select Employee',
            options: assigneeEmp ?? [],
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
  let templateMove = {
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
            name: 'tripId',
            id: 'tripId',
            title: 'Select Trip',
            options: tripCodeList ?? [],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
        ],
      },
    ],
  };
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
  let Penaltytemplate = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'autocomplete',
            name: 'vendorId',
            id: 'vendorId',
            title: 'Vendor Name',
            validationProps: {
              required: 'This is a mandatory field',
            },
            options: vendorList ?? [],
            // options: [{ title: 'Expiry Date', value: 'EXPIRYDATE' }, { title: 'Document', value: 'DOCUMENT' }, { title: 'Add New', value: 'ADDNEW' }]
          },
          {
            type: 'array',
            name: 'complianceSubTopicList',
            id: 'complianceSubTopicList',
            layout: {
              column: 1,
              spacing: 2,
              size: 'small',
              label: 'blank',
              type: 'table',
            },
            columns: ['Vendor', 'Penalty', 'Amount', 'Remark'],
            subFields: [
              {
                type: 'autocomplete',
                name: 'vendorId',
                id: 'vendorId',
                title: 'Vendor Name',
                validationProps: {
                  required: 'This is a mandatory field',
                },
                options: vendorList ?? [],
                // options: [{ title: 'Expiry Date', value: 'EXPIRYDATE' }, { title: 'Document', value: 'DOCUMENT' }, { title: 'Add New', value: 'ADDNEW' }]
              },
              {
                type: 'autocomplete',
                name: 'penalty',
                id: 'penalty',
                title: 'Penalty',
                validationProps: {
                  required: 'This is a mandatory field',
                },
                options: penalty ?? [],
              },
              {
                type: 'text',
                name: 'amount',
                id: 'amount',
                title: 'Amount',
                validationProps: {
                  required: 'This is a mandatory field',
                },
              },

              {
                type: 'text',
                name: 'remark',
                id: 'remark',
                title: 'Remarks',
                validationProps: {
                  required: 'This is a mandatory field',
                },
              },
            ],
          },
        ],
      },
    ],
  };

  const selectParentData = async (event, evId) => {
    let temArr = selectedAccord;

    if (event === 'MAKING_DISABLE') {
      selectChildData(false, evId, 'ALL');
      temArr?.splice(temArr?.indexOf(evId), 1);
      return;
    }
    if (!temArr.includes(evId)) {
      temArr.push(evId);
      selectChildData(true, evId, 'ALL');
    } else {
      selectChildData(false, evId, 'ALL');
      temArr.splice(temArr.indexOf(evId), 1);
    }
    setSelectedAccord([...temArr]);
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

  const deleteEmpFromTrip = async (data) => {
    setDeleteConfirmbox(true);
    setDeleteEmpId(data?.empId);
    setTripId(data?.tripId);
  };
  const moveEmpToOtherTrip = async (data, pid_) => {
    tripCodeList.forEach(function (item, index) {
      item['value'] === data?.tripId && tripCodeList.splice(index, 1);
    });
    setTripCodeList(tripCodeList);
    setTripPrevId(data?.tripId);
    setMovePid(data?.empId);
    setMoveEmpId(data?.empId);
    setMoveClicked(true);
  };
  const cancelOrNoshowTrip = (data, index, _st) => {
    let postData = {
      tripId: data.tripId,
      empId: data?.empId,
      status: _st,
      escortId: '',
    };
    axios
      .post(
        Api?.baseUri + '/user-reg/trip-route/update-passenger-status',
        postData,
      )
      .then((res) => {
        if (res?.data?.status == 200) {
          toast.success(res?.data?.message ?? 'Removed Successfully.');
          getAllList();
        } else {
          toast.error(res?.data?.message || 'Something went wrong.');
        }
      })
      .catch((err) => {
        toast.error('Something went wrong.');
      });
  };

  const closeDeleteConfirmBox = (dd) => {
    if (dd == 'YES') {
      setDeleteConfirmbox(false);
      let reqBody = {
        tripId: tripId,
        passengers: [deleteEmpId],
      };
      axios
        .post(Api?.baseUri + '/user-reg/trip-altr/remove', reqBody)
        .then((res) => {
          if (res?.data?.status == 200) {
            toast.success('Employee is removed successfully.');
            getAllList();
          } else {
            toast.error(res?.data?.message ?? 'Something went wrong.');
          }
        })
        .catch((err) => {
          toast.error('Something went wrong.');
        });
    }
    if (dd == 'NO') {
      setDeleteConfirmbox(false);
    }
  };
  const closeDlinkConfirmBox = (dd) => {
    if (dd == 'YES') {
      setDlinkConfirmbox(false);
      let data = splitGroup;
      let selected_trip = _.filter(childData, function (o) {
        return o.id == data?.id;
      });
      let selectedEmp = ([] = _.filter(selected_trip[0]?.empList, {
        checked: true,
      }).map((v) => v.id));
      if (selectedEmp?.length <= 0) {
        toast.error('Employee not selected in this trip to split group.');
        return;
      }
      let reqBody = {
        tripId: data?.id,
        passengers: selectedEmp,
      };
      axios
        .post(Api?.baseUri + '/user-reg/trip-altr/delink', reqBody)
        .then((res) => {
          if (res?.status == 200) {
            if (res?.data?.status == 200) {
              toast.success(res?.data?.message ?? 'Delinked successfully');
              getAllList();
            } else {
              toast.error(res?.data?.message ?? 'Something went wrong');
            }
          }
        })
        .catch((err) => {
          toast.error('Something went wrong.');
        });
    }
    if (dd == 'NO') {
      setDlinkConfirmbox(false);
    }
  };
  const remInput = (msg, id, parentId) => {
    let tem = childData;
    tem[parentId]?.empList?.map((el, ind) => {
      if (el.id == id) {
        tem[parentId].empList[ind].remarks = msg;
      }
    });
    setChildData({...tem});
  };
  const handleSubmit = async (values) => {
    setSelectedDate(values?.data?.date);
    if (values?.button?.toUpperCase()?.trim() == 'SEARCH') {
      setFilterOptions({
        date: values?.data?.date || moment(new Date()).format('YYYY-MM-DD'),
        tripType: values?.data?.tripType || 'ALL',
        shiftTime: values?.data?.shiftTime || 'ALL',
        vendorId: values?.data?.vendorId || 'ALL',
      });
    } else {
      setFilterOptions({
        date: moment(new Date()).format('YYYY-MM-DD'),
        tripType: 'ALL',
        shiftTime: 'ALL',
      });
    }
  };
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
    if (
      searchAction == 'RE_ALLOCATE_VENDOR' ||
      searchAction == 'ASSIGN_TO_VENDOR'
    ) {
      setSelectedGroup('vendor');
      setSelectedItems(Arr);
    }
    if (
      searchAction == 'ALLOCATE_VEHICLE' ||
      searchAction == 'RE_ALLOCATE_VEHICLE'
    ) {
      setSelectedGroup('vehicle');
      setVehicleSelected(Arr);
    }

    if (searchAction == 'MERGE_ROUTE') {
      axios
        .post(
          Api.baseUri +
            `/user-reg/trip-altr/merge?tripId=${
              myData[selectedBox[0]]?.id
            }&tripId1=${myData[selectedBox[1]]?.id}`,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success('Route merged successfully');
            setSelectedBox([]);
            setSelectedAccord([]);
            setSearchAction({});
            getAllList();
          } else {
            toast.error(
              'Please select one more trip' || 'Single Trip can not be merged',
            );
          }
        })
        .catch((err) => {
          toast.error(err);
        });
    }
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
  useEffect(() => {
    if (multipleTrip?.length) {
      handlePrintTripSheet();
      setMultipleTrip([]);
    }
  }, [multipleTrip]);
  function setOpenFun(d) {
    if (d == false) {
      setSelectedItems([]);
      setVehicleSelected([]);
      setSelectedAccord([]);
      getAllList();
    }
  }

  const createmap = async (data, t) => {
    console.log('dataaaaa', data, t);
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

  const handleMouseEnter = (e) => {
    if (e.length) {
      axios.get(Api.baseUri + '/user-reg/shift/' + e).then((res) => {
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

  function handleDotOption(e) {
    setIndexNum(e);
    setTimeout(() => {
      setDotMenu(!dotMenu);
    }, 200);
  }
  function handleSubmitEscort(val) {
    let postData = {
      tripId: escortAssign?.tripId?.id,
      escortId: val?.data?.escortId,
    };
    axios
      .post(Api.baseUri + '/user-reg/trip-route/assign-trips-escort', postData)
      .then((res) => {
        if (res?.data?.status == '200') {
          toast.success('Escort Assigned Successfully');
          setEscortAssign({...escortAssign, dialog: false});
          getAllList();
        } else {
          toast.error('Something Went Wrong');
        }
      });
  }

  function mergeRoute(ev, index) {
    let temp = selectedBox;
    if (!temp.includes(index)) {
      temp.push(index);
    } else {
      temp.splice(temp.indexOf(index), 1);
    }

    selectedBox(temp);
  }

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

    setOpen(false);
  }
  const onclickChange = () => {
    setTripSheetId(null);
  };

  const downloadTripSheet = (e, v) => {
    console.log('e', e, v);
  };

  const handleChangePage = (event, newPage) => {
    console.log('newPage', newPage);
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  return (
    <>
      <Button></Button>
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
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <div>
            <CustomLabel labelVal='Routes' variantVal='h3-underline' />
          </div>
          {/* <Button>POPUP</Button> */}
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            {myActions?.includes('Download And Upload') && <UploadRoutes />}
            <AppTooltip
              placement={'top'}
              title={'Download'}
              sx={{marginLeft: '10px'}}
            >
              <ArrowCircleDownIcon
                className='title-icons-mui'
                // sx={{mr: 4}}
                onClick={() => {
                  setOpen(true);
                }}
              />
            </AppTooltip>
          </div>
        </div>

        <div className='route-search'>
          {param?.id == 'ALL' || filterOptions?.tripType ? (
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
                {name: 'shiftTime', value: filterOptions?.shiftTime},
                {name: 'vendorId', value: filterOptions?.vendorId},
              ]}
              buttons={['Search', 'Clear']}
            />
          ) : null}
        </div>
        {/* <div style={{display:"flex", height:"200px"}}><TripDirection /></div> */}
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

        <Box sx={{width: '100%'}}>
          <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label='basic tabs example'
            >
              <Tab
                label={'All [' + (counts_.ALL || 0) + ']'}
                {...a11yProps(0)}
              />
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
                  top: '12px',
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
                {searchAction == 'ASSIGN_TO_VENDOR' && (
                  <div
                    style={{
                      marginRight: '20px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Checkbox
                      disabled={searchAction !== 'ASSIGN_TO_VENDOR'}
                      checked={selectedAccord?.length == myData?.length}
                      onChange={(e) => {
                        e.stopPropagation();
                        const aa = Array.from(
                          {length: myData?.length},
                          (_, step) => step,
                        );

                        set_Select(true);

                        if (myData?.length == selectedAccord?.length) {
                          setSelectedAccord([]);
                          set_Select(false);
                          aa?.forEach((value) =>
                            selectParentData('MAKING_DISABLE', value),
                          );
                        } else {
                          setSelectedAccord([...aa]);
                          aa?.forEach((value) => selectParentData('', value));
                        }
                      }}
                    />

                    {selectedAccord?.length + ' Selected'}
                  </div>
                )}
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
          <TabPanel>
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
                      {dd && (
                        <Accordion
                          style={{
                            padding: '10px',
                            borderLeft:
                              e?.status == 'SCHEDULE'
                                ? '5px solid red'
                                : e?.status == 'COMPLETED'
                                ? '5px solid green'
                                : e?.status == 'STARTED'
                                ? '5px solid rgb(5, 63, 92)'
                                : '',
                            borderRight: e.isFemale ? '6px solid #f7007a' : '',
                            // borderBottom:
                            //   e?.vehicleChange == 'YES'
                            //     ? '6px solid orange'
                            //     : '',

                            borderRadius: '8px',
                          }}
                          expanded={expandedItem.includes(index)}
                        >
                          <AccordionSummary
                            sx={{
                              margin: '-10px',
                            }}
                            className='mb-2'
                            expandIcon={<CustomExpandIcon />}
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
                                      searchAction !== 'AUDIT_TRIP' &&
                                      selectedDate <
                                        moment(new Date()).format(
                                          'YYYY-MM-DD',
                                        )) ||
                                    !searchAction ||
                                    e?.status == 'CANCLED' ||
                                    (searchAction == 'MERGE_ROUTE' &&
                                      selectedBox?.length >= 2 &&
                                      !selectedBox.includes(index))
                                  }
                                  checked={
                                    searchAction !== 'TRIP_SHEET' &&
                                    searchAction !== 'PARKING' &&
                                    searchAction !== 'TOLL' &&
                                    searchAction !== 'AUDIT_TRIP' &&
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
                                    mergeRoute(ev, index);
                                    downloadTripSheet(ev, index);
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
                                      {/* {' (' +
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
                                        ')'} */}
                                      {'(' +
                                        (e?.tripType == 'UPTRIP'
                                          ? e?.escortTrip == 'YES'
                                            ? e?.empList[1]?.location?.locName
                                                ?.split(',')
                                                ?.join(', ')
                                            : e?.empList[0]?.location?.locName
                                                ?.split(',')
                                                ?.join(', ')
                                          : e?.tripType == 'DOWNTRIP'
                                          ? e?.escortTrip == 'YES'
                                            ? e?.empList[
                                                Number(e?.empList?.length) - 1
                                              ]?.location?.locName
                                                ?.split(',')
                                                ?.join(', ')
                                            : e?.escortTrip == null
                                            ? e?.empList[
                                                Number(e?.empList?.length) - 1
                                              ]?.location?.locName
                                                ?.split(',')
                                                ?.join(', ')
                                            : e?.empList[
                                                Number(e?.empList?.length) - 1
                                              ]?.location?.locName
                                                ?.split(',')
                                                ?.join(', ')
                                          : null) +
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
                                  zIndex: 99,
                                  display: 'flex',
                                  alignItems: 'center',
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
                                    right: '5px',
                                  }}
                                />
                                <span>
                                  [
                                  {e?.escortTrip == 'YES'
                                    ? e?.empList?.length - 1
                                    : e?.empList?.length}
                                  ]
                                </span>

                                <span
                                  style={{
                                    fontWeight: 'bold',
                                    color: '#e53835',
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginLeft: '15px',
                                    alignItems: 'center',
                                  }}
                                >
                                  {e?.stopList?.length &&
                                    differencebetweenTime(
                                      e?.stopList[
                                        e?.escortTrip == 'YES' &&
                                        e?.tripType == 'UPTRIP'
                                          ? 1
                                          : 0
                                      ][
                                        e?.tripType == 'DOWNTRIP'
                                          ? 'expectedArivalTime'
                                          : 'expectedDepartureTime'
                                      ],
                                      e?.stopList[
                                        e?.escortTrip == 'YES' &&
                                        e?.tripType == 'UPTRIP'
                                          ? 1
                                          : 0
                                      ][
                                        e?.tripType == 'DOWNTRIP'
                                          ? 'actualArivalTime'
                                          : 'actualDepartureTime'
                                      ],
                                    ) > 0 && (
                                      <Tooltip
                                        title={
                                          'Delayed by ' +
                                          differencebetweenTime(
                                            e?.stopList[
                                              e?.escortTrip == 'YES' ? 1 : 0
                                            ][
                                              e?.tripType == 'DOWNTRIP'
                                                ? 'expectedArivalTime'
                                                : 'expectedDepartureTime'
                                            ],
                                            e?.stopList[
                                              e?.escortTrip == 'YES' ? 1 : 0
                                            ][
                                              e?.tripType == 'DOWNTRIP'
                                                ? 'actualArivalTime'
                                                : 'actualDepartureTime'
                                            ],
                                          ) +
                                          ' mins'
                                        }
                                      >
                                        <span
                                          style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                          }}
                                        >
                                          <img
                                            src='/assets/images/delay-icon.svg'
                                            style={{
                                              height: '15px',
                                            }}
                                          />
                                        </span>
                                      </Tooltip>
                                    )}
                                </span>
                              </Typography>
                              <Typography
                                style={{
                                  width: '50%',
                                  display: 'flex',
                                  zIndex: 99,
                                }}
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
                                      'Shift Time : ' +
                                      (e?.adhocShiftTime ?? '')
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

                                <Tooltip title={'Vendor: ' + e?.vendorName}>
                                  <img
                                    style={{
                                      marginRight: '6%',
                                      width: '20px',
                                      height: '20px',
                                    }}
                                    className='route-icons'
                                    src={
                                      e?.vendorName == 'Not Assigned'
                                        ? '/assets/images/route_page_icon/vendor.png'
                                        : '/assets/images/route_page_icon/vendor_blue.png'
                                    }
                                  />
                                </Tooltip>
                                {e?.escortTrip == 'YES' && (
                                  <>
                                    <Tooltip
                                      title={
                                        'Escort: ' +
                                        (e?.escortTrip
                                          ? e?.escortName
                                          : 'Not Required')
                                      }
                                    >
                                      <div
                                        style={{
                                          position: 'relative',
                                          marginRight: '6%',
                                        }}
                                      >
                                        {e?.escort[0]?.status == 'SKIPPED' && (
                                          <img
                                            src={
                                              '/assets/images/right-down.png'
                                            }
                                            style={{
                                              width: '25px',
                                              height: '25px',
                                              position: 'absolute',
                                              top: '-14px',
                                              left: '0px',
                                            }}
                                          />
                                        )}

                                        <img
                                          style={{
                                            marginRight: '6%',
                                            width: '20px',
                                            height: '20px',
                                          }}
                                          className='route-icons'
                                          src={
                                            e.escortTrip != 'YES'
                                              ? '/assets/images/escortCancelled.svg'
                                              : e?.escortName == 'Not Assigned'
                                              ? '/assets/images/route_page_icon/escort.png'
                                              : '/assets/images/route_page_icon/escort_blue.png'
                                          }
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
                                        />
                                      </div>
                                    </Tooltip>
                                  </>
                                )}
                                {e?.escortTrip == 'NO' && (
                                  <Tooltip title={'Escort: ' + 'Not Required'}>
                                    <>
                                      <img
                                        style={{
                                          marginRight: '6%',
                                          width: '20px',
                                          height: '20px',
                                        }}
                                        className='route-icons'
                                        src={
                                          e.escortTrip != 'YES'
                                            ? '/assets/images/escortCancelled.svg'
                                            : e?.escortName == 'Not Assigned'
                                            ? '/assets/images/route_page_icon/escort.png'
                                            : '/assets/images/route_page_icon/escort_blue.png'
                                        }
                                        onClick={() => {
                                          if (
                                            e?.escortTrip !== 'YES' ||
                                            e.escortId ||
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
                                      />
                                    </>
                                  </Tooltip>
                                )}
                                <Tooltip title={'Driver: ' + e?.driverName}>
                                  <img
                                    style={{
                                      marginRight: '6%',
                                      width: '20px',
                                      height: '20px',
                                    }}
                                    className='route-icons'
                                    src={
                                      e?.driverName == 'Not Assigned'
                                        ? '/assets/images/route_page_icon/driver.png'
                                        : '/assets/images/route_page_icon/driver_blue.png'
                                    }
                                  />
                                </Tooltip>
                                <Tooltip
                                  title={
                                    e?.vehicleNo !== 'Not Assigned' ? (
                                      <ul style={{padding: '5px'}}>
                                        {e.vehicleType && (
                                          <li>{'Variant: ' + e.vehicleType}</li>
                                        )}
                                        {e?.vehicleNo && (
                                          <li>
                                            {'Vehicle No: ' + e?.vehicleNo}
                                          </li>
                                        )}
                                        {currVeh?.modelName && (
                                          <li>
                                            {'Model Name: ' + currVeh.modelName}
                                          </li>
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
                                        {((e?.escortTrip == 'YES'
                                          ? e?.empList?.length - 1
                                          : e?.empList?.length) || 0) +
                                          '/' +
                                          (e.vehicleOccupancy || 0)}
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
                                                setcurrVeh(rs?.data?.data);
                                              });
                                          }}
                                          onMouseLeave={() => {
                                            setcurrVeh({});
                                          }}
                                          onClick={() => {
                                            if (
                                              e?.vendorName == 'Not Assigned'
                                            ) {
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
                                            setOpenVehicle(true);
                                            setSelectedData(e);
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
                                                setcurrVeh(rs?.data?.data);
                                              });
                                          }}
                                          onMouseLeave={() => {
                                            setcurrVeh({});
                                          }}
                                          onClick={() => {
                                            if (
                                              e?.vendorName == 'Not Assigned'
                                            ) {
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
                                            setOpenVehicle(true);
                                            setSelectedData(e);
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
                                <Tooltip title='Map'>
                                  <img
                                    style={{
                                      marginRight: '6%',
                                      width: '20px',
                                      height: '20px',
                                    }}
                                    className='route-icons'
                                    src='/assets/images/route_page_icon/map.png'
                                    onClick={() => {
                                      console.log('...map');
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
                                {e?.tripCategory !== 'Adhoc' && (
                                  <Tooltip title='Add Employee'>
                                    <img
                                      style={{
                                        marginRight: '6%',
                                        width: '20px',
                                        height: '20px',
                                      }}
                                      className='route-icons'
                                      src='/assets/images/route_page_icon/addEmployee_blue.png'
                                      onClick={() => {
                                        if (
                                          e?.status == 'COMPLETED' ||
                                          e?.status == 'CANCLED' ||
                                          e?.status == 'INPROGRESS' ||
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
                                        setAddClicked(true);
                                        setTripidToAddEmp(e.id);
                                      }}
                                    />
                                  </Tooltip>
                                )}
                                {e.tripCategory !== 'Adhoc' && (
                                  <Tooltip title='Split Group'>
                                    <img
                                      style={{
                                        marginRight: '6%',
                                        width: '20px',
                                        height: '20px',
                                      }}
                                      className='route-icons'
                                      src='/assets/images/route_page_icon/delink_blue.png'
                                      onClick={() => {
                                        craeteDlink(e);
                                      }}
                                    />
                                  </Tooltip>
                                )}

                                {e?.tripCategory ? (
                                  <span className='adhoc-creation btn'>
                                    {e?.tripCategory}
                                  </span>
                                ) : null}
                              </Typography>
                              <Typography
                                style={{
                                  width: '15%',
                                  display: 'flex',
                                  // flexDirection: 'column',
                                  alignItems: 'center',
                                  // justifyContent: 'space-between',
                                  zIndex: 99,
                                }}
                                onClick={(eve) => {
                                  eve.stopPropagation();
                                }}
                              >
                                <IconButton
                                  onClick={() => {
                                    handleDotOption(index);
                                  }}
                                >
                                  <img
                                    className='route-icons'
                                    src='/assets/images/options.png'
                                    style={{
                                      display:
                                        e?.status == 'CANCLED' ? 'none' : '',
                                      height: '20px',
                                      position: 'relative',
                                    }}
                                  />
                                </IconButton>
                                <Tooltip title='Map'>
                                  <img
                                    style={{
                                      opacity:
                                        e.status == 'STARTED' ? '1' : '0',
                                      width: '20px',
                                      height: '20px',
                                    }}
                                    className='route-icons'
                                    src='/assets/images/route_page_icon/map.png'
                                    onClick={(eve) => {
                                      eve.stopPropagation();
                                      if (e.status !== 'STARTED') return;
                                      navigate('/test-live-tracking/' + e.id);
                                    }}
                                  />
                                </Tooltip>
                                {indexNum == index && dotMenu && (
                                  <Paper
                                    sx={{
                                      width: 120,
                                      maxWidth: '100%',
                                      marginLeft: '-117px',
                                      marginTop: '2px',
                                      position: 'absolute',
                                      zIndex: '2',
                                    }}
                                  >
                                    <MenuList ref={ref}>
                                      {e.status == 'SCHEDULE' && (
                                        <MenuItem
                                          onClick={() => {
                                            setDeleteTripConfirmBox(true);
                                            setTripIdtoDelete(e?.id);
                                          }}
                                        >
                                          <ListItemText>
                                            Cancel Trip
                                          </ListItemText>
                                        </MenuItem>
                                      )}
                                      <MenuItem
                                        onClick={() => {
                                          setPenaltyBox(e?.id);
                                        }}
                                      >
                                        <ListItemText>Add Penalty</ListItemText>
                                      </MenuItem>
                                      <MenuItem
                                        onClick={() => {
                                          setTripSheetId(e?.id);
                                        }}
                                      >
                                        <ListItemText>Trip Sheet</ListItemText>
                                      </MenuItem>
                                      {e.status == 'STARTED' && (
                                        <MenuItem
                                          onClick={() => {
                                            setTripDetail(true);
                                            setCloseTripData(e);
                                          }}
                                        >
                                          <ListItemText>
                                            Close Trip
                                          </ListItemText>
                                        </MenuItem>
                                      )}
                                    </MenuList>
                                  </Paper>
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
                                  id={e?.tripCode}
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
                                      selectedDate={selectedDate}
                                      id={index}
                                      pid={e.id}
                                      searchAction={searchAction}
                                      selectParentData={selectParentData}
                                      selectChildData={selectChildData}
                                      remInput={remInput}
                                      deleteEmpFromTrip={deleteEmpFromTrip}
                                      moveEmpToOtherTrip={moveEmpToOtherTrip}
                                      cancelOrNoshowTrip={cancelOrNoshowTrip}
                                    />
                                  </tbody>
                                </table>
                              </Typography>
                            )}
                          </AccordionDetails>
                        </Accordion>
                      )}
                    </>
                  );
                })
              ) : (
                <p
                  style={{
                    fontSize: '12px',
                    paddingLeft: '45%',
                    margin: '20% 0 20% 0',
                  }}
                >
                  {showLoader ? '' : 'No records to display'}
                </p>
              )}
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
                    if (searchAction == 'AUDIT_TRIP') {
                      console.log('data for audit');
                      setOpenAudit(true);
                    }
                    handleSubmitAction(e);
                    console.log('e', e);
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
          </TabPanel>
        </Box>
        {addClicked ? (
          <Dialog
            open={addClicked}
            onClose={() => {
              setAddClicked(false);
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
              Add Employee
              <IconButton
                onClick={() => {
                  setAddClicked(false);
                }}
                style={{position: 'absolute', top: '8px', right: '8px'}}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <div className='grid-container'>
                <SmartForm
                  template={templateAdd}
                  onSubmit={handleSubmitAddEmp}
                  buttons={['Add']}
                />
              </div>
            </DialogContent>
          </Dialog>
        ) : null}
        {moveClicked ? (
          <Dialog
            open={moveClicked}
            onClose={() => {
              setMoveClicked(false);
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
              Move Employee
              <IconButton
                onClick={() => {
                  setMoveClicked(false);
                }}
                style={{position: 'absolute', top: '8px', right: '8px'}}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <div className='grid-container'>
                <SmartForm
                  template={templateMove}
                  onSubmit={handleSubmitMoveEmp}
                  buttons={['Submit']}
                />
              </div>
            </DialogContent>
          </Dialog>
        ) : null}
      </div>
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
      {penaltyBox && <Penalty setPenaltyBox={setPenaltyBox} id={penaltyBox} />}
      {selectedGroup === 'vendor' && selectedItems.length ? (
        <AssignToVendor
          selectedItems={selectedItems}
          setOpen={setOpenFun}
          setAction={
            searchAction == 'ASSIGN_TO_VENDOR'
              ? 'Assign Vendor'
              : searchAction == 'RE_ALLOCATE_VENDOR'
              ? 'Re-allocate Vendor'
              : null
          }
        />
      ) : null}
      {selectedGroup === 'vehicle' && vehicleSelected?.length ? (
        <AssignToVehicle
          selectedItems={vehicleSelected}
          setOpen={setOpenFun}
          getAllList={getAllList}
          setAction={
            searchAction == 'ALLOCATE_VEHICLE'
              ? 'assign'
              : searchAction == 'RE_ALLOCATE_VEHICLE'
              ? 'reassign'
              : null
          }
        />
      ) : null}
      <Confirm
        open={deleteConfirmbox}
        header={'Confirm to Remove'}
        cnfMsg={`Are you sure, You want to remove this employee from trip?`}
        handleClose={closeDeleteConfirmBox}
      />
      <Confirm
        open={deleteTripConfirmBox}
        header={'Confirm to Delete'}
        cnfMsg={'Are you sure, You want to delete the Trip?'}
        handleClose={closedeleteTripConfirmBox}
      />
      <Confirm
        open={dlinkConfirmbox}
        header={'Confirm to Split Group'}
        cnfMsg={`Are you sure, You want to split group?`}
        handleClose={closeDlinkConfirmBox}
      />
      {openVehicle && (
        <AssignToVehicle
          action={'BY_CLICKING'}
          selectedData={selectedData}
          getAllList={getAllList}
          close={() => {
            setOpenVehicle(false);
          }}
        />
      )}
      {showRem ? (
        <>
          <Dialog
            open={true}
            onClose={() => {
              setShowRem(null);
            }}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
            maxWidth='false'
            PaperProps={{
              sx: {
                width: 400,
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
              {showRem +
                ' ' +
                (searchAction == 'TOLL' ? 'Toll Taxes' : 'Parking Charges')}
              <IconButton
                onClick={() => {
                  setShowRem(null);
                }}
                style={{position: 'absolute', top: '8px', right: '8px'}}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <div className='grid-container'>
                <SmartForm
                  template={remTemplate}
                  onSubmit={(val) => {
                    let tem = [];
                    selectedTolls?.map((el) => {
                      el.tollParkingData?.map((_el) => {
                        _el.remarks = val?.data.remarks;
                        _el.status =
                          showRem == 'Approve' ? 'APPROVED' : 'REJECTED';
                      });
                      tem.push(el);
                    });
                    axios
                      .post(
                        Api.baseUri + '/user-reg/trip-route/updateTolltax',
                        tem,
                      )
                      .then((res) => {
                        setShowRem(null);
                        if (res?.data?.status == '200') {
                          toast.success(res?.data?.message);
                        } else {
                          toast.error(
                            res?.data?.message || 'Something went wrong.',
                          );
                        }
                      })
                      .catch(() => {
                        setShowRem(null);
                        toast.error('Something went wrong.');
                      });
                  }}
                  buttons={[showRem]}
                />
              </div>
            </DialogContent>
          </Dialog>
        </>
      ) : null}
      {showLoader && <AppLoader />}

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

      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
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
              setOpen(false);
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
      {tripDetail && (
        <Dialog
          open={tripDetail}
          onClose={() => {
            setTripDetail(false);
          }}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
          maxWidth='false'
          PaperProps={{
            sx: {
              width: 1600,
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
            Trip Code:{closeTripData?.tripCode}
            <IconButton
              onClick={() => {
                setTripDetail(false);
              }}
              style={{position: 'absolute', top: '8px', right: '8px'}}
            >
              <CloseIcon
                onClick={() => {
                  setTripDetail(false);
                }}
              />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <TripDetails
              data={closeTripData}
              close={() => {
                setTripDetail(false);
                getAllList();
              }}
            />
          </DialogContent>
        </Dialog>
      )}
      <Dialog
        PaperProps={{
          sx: {
            width: '30%',
          },
        }}
        open={openAudit}
        onClose={() => {
          setOpenAudit(false);
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          {<h3>Do you want to Audit the trip?</h3>}
        </DialogTitle>
        {openReason && (
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>
              <TextField
                sx={{mt: 4}}
                label='Reason'
                onInput={(e) => {
                  setMyInput(e.target.value);
                }}
                fullWidth
              />
            </DialogContentText>
          </DialogContent>
        )}
        {openReason == false && (
          <DialogActions>
            <Button
              onClick={() => {
                let Arr = [];
                let audit_arr = [];
                for (let [key, value] of Object.entries(childData)) {
                  value?.empList?.length &&
                    value?.empList?.map((ar) => {
                      if (ar.checked == true) {
                        Arr.push(value?.id);
                      }
                    });
                }
                let unique = Arr.filter(
                  (item, i, ar) => ar.indexOf(item) === i,
                );
                unique?.map((el) => {
                  audit_arr.push({
                    id: el,
                    auditComment: myInput,
                    auditedStatus: 'AUDITED',
                  });
                });
                console.log('audit_arr', audit_arr);
                axios
                  .post(
                    Api.baseUri + '/user-reg/trip-route/auditedReport',
                    audit_arr,
                  )
                  .then((res) => {
                    if (res?.data?.status == '200') {
                      toast.success('Trip audited successfully');
                      setOpenAudit(false);
                      setSelectedBox([]);
                      setSelectedAccord([]);
                      // setSearchAction({});
                      getAllList();
                    }
                  })
                  .catch((err) => {
                    console.log('err');
                  });
              }}
            >
              Approve
            </Button>
            <Button
              onClick={() => {
                setOpenReason(true);
                // setOpenAudit(false);
              }}
              autoFocus
            >
              Reject
            </Button>
          </DialogActions>
        )}

        {openReason == true && (
          <div
            style={{padding: '10px', display: 'flex', justifyContent: 'center'}}
          >
            <Button
              disabled={!myInput}
              variant='contained'
              onClick={() => {
                let Arr = [];
                let audit_arr = [];
                for (let [key, value] of Object.entries(childData)) {
                  value?.empList?.length &&
                    value?.empList?.map((ar) => {
                      if (ar.checked == true) {
                        Arr.push(value?.id);
                      }
                    });
                }
                let unique = Arr.filter(
                  (item, i, ar) => ar.indexOf(item) === i,
                );
                unique?.map((el) => {
                  audit_arr.push({
                    id: el,
                    auditComment: myInput,
                    auditedStatus: 'NONAUDITED',
                  });
                });
                console.log('audit_arr', audit_arr);
                axios
                  .post(
                    Api.baseUri + '/user-reg/trip-route/auditedReport',
                    audit_arr,
                  )
                  .then((res) => {
                    if (res?.data?.status == '200') {
                      toast.success('Trip audited successfully');
                      setOpenAudit(false);
                      setSelectedBox([]);
                      // setSelectedAccord([]);
                      // setSearchAction({});
                      getAllList();
                    }
                  })
                  .catch((err) => {
                    console.log('err');
                  });
              }}
            >
              Submit
            </Button>
            <Button
              onClick={() => {
                setOpenReason(false);
              }}
            >
              Cancel
            </Button>
          </div>
        )}
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
  } catch (e) {}
}
export default RouteLists;
