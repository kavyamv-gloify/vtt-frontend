import React, {useState, useEffect, createRef} from 'react';
import {useNavigate} from 'react-router-dom';
import SmartForm from '@smart-form';
import {useAuthUser} from '@crema/utility/AuthHooks';
import AppLoader from '@crema/core/AppLoader';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import {makeStyles} from '@mui/styles';
import Pagination from '@mui/material/Pagination';
import RouteList from './table';
import CustomLabel from 'pages/common/CustomLabel';
import {Button, Tooltip, Checkbox, Grid, TablePagination} from '@mui/material';
import Box from '@mui/material/Box';
import SmartFilter from '@smart-filter';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from '@mui/material';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import CloseIcon from '@mui/icons-material/Close';
import UploadSection from './upload-section';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';
import FilterPop from '@filter-pop';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import axios from 'axios';
import Api from '@api';
import {toast} from 'react-toastify';
import regex from '@regex';
import excelDoc from '@excelupload/excelupload';
import DeleteIcon from '@mui/icons-material/Delete';
import Confirm from '@confirmation-box';
import moment from 'moment';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import GroupsIcon from '@mui/icons-material/Groups';
import AppTooltip from '@crema/core/AppTooltip';
// import ImageFunction from '../Snapshot/index'
import MapSnapShot from '../Snapshot/tripSnapshot';
import '../index.css';
import {useScreenshot} from 'use-react-screenshot';
import getStaticGmapURLForDirection from '../Snapshot/tripSnapshot';
import {useSelector} from 'react-redux';
import {useTheme} from '@mui/material/styles';
import AppsPagination from '@crema/core/AppsPagination';
import AppsFooter from '@crema/core/AppsContainer/AppsFooter';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import _ from 'lodash';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import QuickSearchPage from '@quick-search';

// import { useNavigate } from 'react-router-dom';
const weekAr = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const weeks = [
  {title: 'Sunday', value: 'SUN'},
  {title: 'Monday', value: 'MON'},
  {title: 'Tuesday', value: 'TUE'},
  {title: 'Wednesday', value: 'WED'},
  {title: 'Thursday', value: 'THU'},
  {title: 'Friday', value: 'FRI'},
  {title: 'Saturday', value: 'SAT'},
];
const fieldList = [
  {title: 'Route Id', value: 'routeId'},
  {title: 'Log-in', value: 'loginTime'},
  {title: 'Office Location', value: 'officeLocation.locName'},
  {title: 'Employee ID', value: 'passengers.empCode'},
  {title: 'Employee Name', value: 'passengers.name'},
  {title: 'Employee Email ID', value: 'passengers.emailId'},
  {title: 'Employee Mobile No.', value: 'passengers.mobileNo'},
];
function TablePaginationActions(props) {
  const theme = useTheme();
  const {count, page, rowsPerPage, onPageChange} = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{flexShrink: 0, ml: 2.5}}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label='first page'
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label='previous page'
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label='next page'
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label='last page'
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}
const CustomExpandIcon = ({opacity}) => {
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
        <AddBoxOutlinedIcon style={{color: '#407999', opacity: opacity}} />
      </div>
    </Box>
  );
};
const MasterRoutes = () => {
  const navigate = useNavigate();
  const {user} = useAuthUser();
  const [myActions, setMyActions] = React.useState([]);
  const permissionCheck = useSelector(({settings}) => settings.permissions);
  React.useEffect(() => {
    if (!permissionCheck) return;
    let sub_mod = {};
    permissionCheck?.map((el) => {
      if (el.subModuleName == 'Route Master') sub_mod = el;
    });
    setMyActions(sub_mod?.actions);
    if (
      (!sub_mod || !sub_mod?.actions?.includes('View')) &&
      user?.userList?.userRole !== 'SUPERADMIN'
    )
      navigate('/error-pages/error-404');
  }, [permissionCheck, user]);
  const [showbtn, setshowbtn] = React.useState(true);
  const [fileName, setFileName] = useState('');
  const [mrouteId, setMrouteId] = useState('');
  const [masterRouteId, setMasterRouteId] = useState('');

  const [formData, setformData] = useState({});
  const [masterData, setMastderData] = useState([]);
  console.log('masterData', masterData);
  const [childData, setChildData] = useState([
    {id: 1, childid: 1, name: 'abc'},
    {id: 2, childid: 2, name: 'xyz'},
    {id: 3, childid: 2, name: 'efg'},
  ]);
  const itemsPerPage = 10;
  const [rowsPerPage, setRowsPerPage] = useState(10); // Set your default rows per page here

  const [page, setPage] = React.useState(0);
  const [totalCount, settotalCount] = React.useState(1);
  const [open, setOpen] = React.useState(false);
  const [chartData, setChartData] = React.useState([]);
  const [openFilter, setOpenFilter] = React.useState(false);
  const [disableDown, setDisableDown] = React.useState(false);
  const [openConfirmbox, setOpenConfirmBox] = useState(false);
  const [deleteConfirmbox, setDeleteConfirmbox] = useState(false);
  const [selectedAccord, setSelectedAccord] = React.useState([]);
  const [copyErrorMsg, setCopyErrorMsg] = React.useState('');
  const [openConfirmboxCopy, setOpenConfirmboxCopy] = React.useState(false);
  const [deleteEmpId, setDeleteEmpId] = React.useState([]);
  const [holidayArr, setHolidayArr] = React.useState([]);
  const [formDates, setformDates] = React.useState();
  const [myFinalDateArr, setmyFinalDateArr] = React.useState();
  const [regeneration, setRegeneration] = React.useState({});
  const [clickMe, setClickMe] = useState(false);
  const [curtResponse, setCurtResponse] = useState();
  const [image, takeScreenShot] = useScreenshot();
  const [showIamge, setShowImage] = useState();
  const ref = createRef(null);
  const [mapPosition, setMapPosition] = useState();
  const [imageSource, setImageSource] = useState();
  const [count, setCount] = useState(0);
  const [passenger, setPassenger] = useState();
  const [postData, setPostData] = useState();
  const [validationCheck, setValidationCheck] = useState('');
  const [shiftConfirmation, setShiftConfirmation] = useState(false);
  const [filter, setFilter] = useState({});
  const [filterRes, setFilterRes] = useState(null);
  const [filterShow, setfilterShow] = useState(false);
  console.log('filter', filter);
  const getImage = () => {
    takeScreenShot(ref.current);
    setShowImage(true);
  };
  const fetchDistributionData = async () => {
    try {
      const response = await axios.get(
        Api?.baseUri + '/user-reg/master-route/getMasterRouteData',
      );
      const {MaleTripCount, FemaleTripCount, FemaleTravellingCount} =
        response.data.data.pendingMap;
      const countsArray = [
        parseInt(MaleTripCount),
        parseInt(FemaleTripCount),
        parseInt(FemaleTravellingCount),
      ];
      setChartData(countsArray);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    fetchDistributionData();
  }, []);

  function onChangeVal(v) {
    if (v?.fromDate != formDates?.fromdate || v?.toDate != formDates?.todate) {
      getHolidays(v?.fromDate, v?.toDate);
      setformDates({fromdate: v?.fromDate, todate: v?.toDate});
    }
  }
  function getFinalDates(dateArr, holiday, weekOffs) {
    let temDateArr = [];
    dateArr?.map((el, ind) => {
      if (
        !weekOffs?.includes(weekAr[new Date(el).getDay()]) ||
        !holiday?.includes(el)
      ) {
        temDateArr.push(el);
      }
    });
    return temDateArr;
  }
  function getHolidays(temfrom, temto) {
    axios
      .get(Api?.holiday?.holidayList)
      .then((re) => {
        //+res?.data?.data?.body['SiteOffice List'][0]?.id+'/office'
        let arr = [];
        re?.data?.data?.map((myel) => {
          if (temfrom == 'NA') {
            if (
              selectedDate?.includes(
                moment(myel?.holidayDate).format('DD/MM/YYYY'),
              )
            ) {
              arr?.push({
                title:
                  moment(new Date(myel?.holidayDate?.split('T')[0])).format(
                    'DD MMM',
                  ) +
                  ' - ' +
                  myel?.holidayName,
                value: myel?.holidayDate?.split('T')[0],
              });
            }
          } else {
            if (
              new Date(myel?.holidayDate?.split('T')[0]) >= new Date(temfrom) &&
              new Date(myel?.holidayDate?.split('T')[0]) <= new Date(temto)
            ) {
              arr?.push({
                title:
                  moment(new Date(myel?.holidayDate?.split('T')[0])).format(
                    'DD MMM',
                  ) +
                  ' - ' +
                  myel?.holidayName,
                value: myel?.holidayDate?.split('T')[0],
              });
            }
          }
        });
        if (arr?.length) {
          toast.warning(
            'There ' +
              (arr?.length > 1
                ? 'are ' + arr?.length + ' holidays'
                : 'is ' + arr?.length + ' holiday') +
              ' in this date range Please select Holidays to enable.',
          );
        }
        setHolidayArr([...arr]);
      })
      .catch((er) => {});
  }
  function handleClose(dd) {
    setOpenFilter(false);
    if (dd === 'NO') return;
  }
  // const getAllRoutes = () => {
  //   axios
  //     .get(Api?.baseUri + '/user-reg/master-route/getallmasterroute')
  //     .then((res) => {
  //       let temTotalEmpCount = 0;
  //       let temMaleCount = 0;
  //       let temFemaleCount = 0;
  //       res?.data?.data?.map((el) => {
  //         el?.passengers?.map((elem) => {
  //           temTotalEmpCount = ++temTotalEmpCount;
  //           if (elem?.gender?.toUpperCase() == 'MALE') {
  //             temMaleCount = ++temMaleCount;
  //           }
  //           if (elem?.gender?.toUpperCase() == 'FEMALE') {
  //             temFemaleCount = ++temFemaleCount;
  //           }
  //         });
  //       });
  //       setChartData([temMaleCount, temFemaleCount, temTotalEmpCount]);
  //       setMastderData(res?.data?.data);
  //     })
  //     .catch((err) => {});
  // };
  const getAllRoutes = async () => {
    try {
      let payload = {
        collection: 'MasterRoute',
        pageSize: rowsPerPage,
        pageNo: page + 1,
        filters: [
          {
            fieldOperator: '$and',
            field: 'status',
            valueOperator: '$eq',
            value: 'ACTIVE',
          },
        ],
      };
      if (!_.isEmpty(filter)) {
        payload = {
          ...payload,
          filters: [...payload.filters, ...filter],
        };
      }
      console.log('payload', payload);

      const response = await axios.post(
        `${Api?.baseUri}/api/dashboard/employee/filter`,
        payload,
      );
      // const counts = response?.data?.data?.reduce(
      //   (acc, el) => {
      //     el.passengers.forEach((elem) => {
      //       acc.totalEmpCount++;
      //       if (elem.gender.toUpperCase() == 'MALE') {
      //         acc.maleCount++;
      //       }
      //       if (elem.gender.toUpperCase() == 'FEMALE') {
      //         acc.femaleCount++;
      //       }
      //     });
      //     return acc;
      //   },
      //   {totalEmpCount: 0, maleCount: 0, femaleCount: 0},
      // );

      // setChartData([
      //   counts.maleCount,
      //   counts.femaleCount,
      //   counts.totalEmpCount,
      // ]);
      if (response?.data?.status == 200) {
        setMastderData(response?.data);
      } else {
        setMastderData([]);
      }
    } catch (error) {
      // Handle errors
      console.error('Error fetching data:', error);
      setMastderData([]);
    }
  };

  useEffect(() => {
    if (!filterRes) {
      getAllRoutes();
    }
  }, [page, rowsPerPage, filter]);

  useEffect(() => {
    setSelectedAccord(selectedAccord);
  }, [selectedAccord]);

  const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        marginTop: theme.spacing(2),
      },
    },
  }));
  const classes = useStyles();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  useEffect(() => {
    if (!user?.userList?.profileId) {
      return;
    }
  }, []);

  function myProcess(p1, p2) {
    let postData = p2.postData;
    postData.passengerSnapshot = p1;
    axios
      .post(Api.baseUri + '/user-reg/trip-driver/update-snapshot', postData)
      .then((res) => {
        if (res?.data?.status == '200') {
        }
      })
      .catch((err) => {});
    setTimeout(() => {
      setCount(count + 1);
    }, 3000);
  }

  let filtertemplate = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    description: 'Form for applying Job',
    // filtertype:"POP",
    //  margin-top: -30px;
    // background: #31bc7b;
    // border-radius: 20px;
    // width: 113px;
    sections: [
      {
        layout: {column: 2, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'text',
            name: 'empid',
            id: 'empid',
            title: 'Employee ID',
            inputiconurl: '/assets/images/login_icon.png',
            pattern: {
              value: regex.maxSize50,
              message:
                'Please enter  valid code with alpha-numeric and below 50 characters',
            },
          },
          {
            type: 'text',
            name: 'empname',
            id: 'empname',
            inputiconurl: '/assets/images/login_icon.png',
            title: 'Employee Name',
            pattern: {
              value: regex.maxSize50,
              message:
                'Please enter  valid code with alpha-numeric and below 50 characters',
            },
          },
          {
            type: 'text',
            name: 'tripid',
            id: 'tripid',
            inputiconurl: '/assets/images/logout_icon.png',
            title: 'Trip ID',
            pattern: {
              value: regex.maxSize50,
              message:
                'Please enter  valid code with alpha-numeric and below 50 characters',
            },
          },
          {
            type: 'text',
            name: 'gender',
            id: 'gender',
            inputiconurl: '/assets/images/login_icon.png',
            title: 'Gender',
            pattern: {
              value: regex.maxSize50,
              message:
                'Please enter  valid code with alpha-numeric and below 50 characters',
            },
          },
          {
            type: 'text',
            name: 'emailid',
            id: 'emailid',
            inputiconurl: '/assets/images/login_icon.png',
            title: 'Email Id',
            pattern: {
              value: regex.maxSize50,
              message:
                'Please enter  valid code with alpha-numeric and below 50 characters',
            },
          },
          {
            type: 'text',
            name: 'code',
            id: 'code',
            inputiconurl: '/assets/images/login_icon.png',
            title: 'Mobile No',
            pattern: {
              value: regex.maxSize50,
              message:
                'Please enter  valid code with alpha-numeric and below 50 characters',
            },
          },
        ],
      },
    ],
  };
  let template = {
    layout: {
      column: 1,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    title: '',
    description: '',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'date',
            name: 'fromDate',
            id: 'fromDate',
            title: 'From Date',
            min: 'today',
            validationProps: {
              required: 'This is a mandatory field',
              manual: [
                {
                  condition: `fromDate >= today`,
                  message:
                    "From date should be more than or equal to today's date.",
                },
              ],
            },
          },
          {
            type: 'date',
            name: 'toDate',
            id: 'To Date',
            min: 'today',
            title: 'To Date',
            validationProps: {
              required: 'This is a mandatory field',
              // manual: [
              //   {
              //     condition: `toDate >= today`,
              //     message: "To date should be more than or equal to today's date."
              //   }
              // ],
              validate: [
                {
                  condition: 'fromDate <= toDate',
                  message: 'From date should not be greater than To date.',
                },
              ],
            },
          },
          {
            type: 'multiSelect',
            name: 'weekOffs',
            id: 'weekOffs',
            title: 'WeekOffs',
            options: weeks ?? [],
          },
          {
            type: 'multiSelect',
            name: 'holidays',
            id: 'holidays',
            title: 'Holidays',
            options: holidayArr ?? [],
          },
          {
            type: 'section',
            layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
            fields: [
              {
                type: 'switchToggle',
                name: 'allowRegeneration',
                id: 'allowRegeneration',
                title: 'Allow Re-Generation',
                defaultValue: 'NO',
                // infoMessage: ['Radio button is selectable', 'e.g.: yes'],
                options: [
                  {title: 'Yes', value: 'YES'},
                  {title: 'No', value: 'NO'},
                ],
              },
              {
                type: 'switchToggle',
                name: 'allowSkipEmployee',
                id: 'allowSkipEmployee',
                title: 'Allow Skip Employee',
                defaultValue: 'NO',
                // infoMessage: ['Radio button is selectable', 'e.g.: yes'],
                options: [
                  {title: 'Yes', value: 'YES'},
                  {title: 'No', value: 'NO'},
                ],
              },
            ],
          },
        ],
      },
    ],
  };

  const uploadMasterList = async (event) => {
    setFileName(event?.target?.files[0]?.name);
  };
  const downloadFile = async (event) => {};
  const copyRoute = async (data) => {
    if (selectedAccord.length > 0) {
      setOpen(true);
    } else {
      toast.error('Please select at least one route.');
    }
  };
  var getDaysArray = function (start, end) {
    for (
      var arr = [], dt = new Date(start);
      dt <= new Date(end);
      dt.setDate(dt.getDate() + 1)
    ) {
      arr.push(new Date(dt));
    }
    return arr;
  };
  const handleSubmit = async (values) => {
    console.log('values', values);
    setshowbtn(false);
    setOpenConfirmboxCopy(false);
    if (values == 'NO') {
      setshowbtn(true);
    }
    if (values?.button?.toUpperCase() === 'SUBMIT' || values == 'YES') {
      let date1 = moment();
      let date2 = moment(values?.data?.fromDate);
      let difference = date1.diff(date2, 'days');
      if (difference > 0) {
        setTimeout(function () {
          setshowbtn(true);
        }, 1000);
        toast.error('Please enter a valid date.');
        return;
      }
      let dateArr = getDaysArray(
        new Date(values?.data?.fromDate),
        new Date(values?.data?.toDate),
      );
      dateArr = dateArr.map((v) => v.toISOString().slice(0, 10));
      let temDateArray = getFinalDates(
        dateArr,
        values?.data?.holidays,
        values?.data?.weekOffs,
      );
      setmyFinalDateArr(temDateArray);
      setRegeneration({
        allowRegeneration: values?.data?.allowRegeneration,
        allowSkipEmployee: values?.data?.allowSkipEmployee,
      });
      let postbody = {
        dates: values == 'YES' ? myFinalDateArr : temDateArray,
        masterIds: selectedAccord,
        allMasters:
          selectedAccord.length === masterData?.data?.length ? 'YES' : 'NO',
        allowTripsWithLeave: validationCheck == 'LEAVE' ? 'true' : 'false',
        allowTripsWithHolidays: validationCheck == 'HOLIDAY' ? 'true' : 'false',
        allowTripsWithNoRoster: validationCheck == 'ROSTER' ? 'true' : 'false',
        allowRegeneration:
          values == 'YES'
            ? regeneration?.allowRegeneration
            : values?.data?.allowRegeneration,
        allowSkipEmployee:
          values == 'YES'
            ? regeneration?.allowSkipEmployee
            : values?.data?.allowSkipEmployee,
      };
      console.log('postbody', postbody);
      setPostData(postbody);
      axios
        .post(
          Api.baseUri + '/user-reg/trip-route/create-master-route-trip',
          postbody,
        )
        .then((res) => {
          setshowbtn(true);
          setOpen(false);
          if (res?.data?.status == '200') {
            setCurtResponse(res);
            // toast.success(res?.data?.message ?? 'Success');
            toast.success('Master Route Copied Successfully.');
            setSelectedAccord([]);
            sentRouteSnapshot(res?.data?.data);
          } else if (res?.data?.status == '400') {
            setTimeout(() => {
              if (res?.data?.message?.split('#')?.[0] == 'ROSTER') {
                setOpenConfirmboxCopy(true);
                setValidationCheck('ROSTER');
                setCopyErrorMsg(res?.data?.message?.split('#')?.[1]);
              }
              // if (res?.data?.message?.split('#')?.[0] == 'LEAVE') {
              //   setOpenConfirmboxCopy(true);
              //   setValidationCheck('LEAVE');
              //   setCopyErrorMsg(res?.data?.message?.split('#')?.[1]);
              // }
              else if (res?.data?.message?.split('#')?.[0] == 'SHIFT') {
                setShiftConfirmation(true);
                setCopyErrorMsg(res?.data?.message?.split('#')?.[1]);
              } else if (res?.data?.message?.split('#')?.[0] == 'HOLIDAY') {
                setOpenConfirmboxCopy(true);
                setValidationCheck('HOLIDAY');
                setCopyErrorMsg(res?.data?.message?.split('#')?.[1]);
              } else {
                toast.error(res?.data?.message ?? 'Failed', {
                  autoClose: 5000,
                });
              }
            }, 200);
          } else {
            toast.error(res?.data?.message ?? 'Failed');
          }
        })
        .catch((err) => {
          setOpen(false);
          setshowbtn(true);
          toast.error('Something went wrong.');
        });
    }

    // if (validationCheck == 'SHIFT' && values == 'YES') {
    //   window.location.href = `./onboardCorporate/department/department-listing`;
    // }
  };

  const selectAllRoute = async (event) => {
    let temArr = [];
    if (event.target.checked === true) {
      masterData?.data?.map((e) => {
        temArr.push(e?._id);
      });
    }
    setSelectedAccord(temArr);
  };
  const selectRoute = async (event, id) => {
    let temArr = selectedAccord;
    if (temArr.includes(id)) {
      temArr.splice(temArr.indexOf(id), 1);
    } else {
      temArr.push(id);
    }
    setSelectedAccord([...temArr]);
  };
  const deleteMasterRoute = async (id, routeId) => {
    setOpenConfirmBox(true);
    setMrouteId(id);
    setMasterRouteId(routeId);
  };
  const closeConfirmBox = (dd) => {
    if (dd == 'YES') {
      setOpenConfirmBox(false);
      axios
        .delete(Api?.baseUri + '/user-reg/master-route/' + mrouteId)
        .then((res) => {
          if (res?.status == 200) {
            // toast.success(
            //   res?.message ?? masterRouteId + ' delete successfully',
            // );
            toast.success(masterRouteId + ' Master Route Deleted.');
            getAllRoutes();
          }
        })
        .catch((err) => {
          toast.error(err);
        });
    }
    if (dd == 'NO') {
      setOpenConfirmBox(false);
    }
  };
  // const deleteEmpFromRoute = (row) => {
  // }
  const deleteEmpFromRoute = async (row) => {
    setDeleteConfirmbox(true);
    setDeleteEmpId(row?._id);
    console.log('row', row);
  };
  const closeDeleteConfirmBox = (dd) => {
    if (dd == 'YES') {
      setDeleteConfirmbox(false);
      axios
        .delete(Api?.baseUri + '/user-reg/master-route/employee/' + deleteEmpId)
        .then((res) => {
          if (res?.status == 200) {
            // toast.success(res?.message ?? 'Deleted successfully');
            toast.success(
              res?.data?.data?.name + ' removed successfully from Route.' ??
                'Deleted successfully',
            );
            getAllRoutes();
          }
        })
        .catch((err) => {
          toast.error(err);
        });
    }
    if (dd == 'NO') {
      setDeleteConfirmbox(false);
    }
  };

  const imageSrc = (d) => {
    if (d?.length) {
      setImageSource(d);
    }
  };

  function sentRouteSnapshot(value) {
    let temp = [];
    let temp_arr = [];
    for (let i = 0; i <= value?.length; i++) {
      temp = temp.concat(value[i]?.stopList);
    }
    for (let i = 0; i <= temp?.length; i++) {
      if (temp[i]?.onBoardPassengers)
        temp_arr = temp_arr.concat(temp[i]?.onBoardPassengers);
    }
    let temp_object = [];
    for (let i = 0; i <= temp_arr?.length - 1; i++) {
      temp_object.push({
        origin_lat: temp_arr[i]?.location?.latitude,
        origin_long: temp_arr[i]?.location?.longitude,
        destination_lat: temp_arr[i]?.officeLocation?.latitude,
        destination_long: temp_arr[i]?.officeLocation?.longitude,
        postData: {
          tripId: temp_arr[i]?.tripId,
          driverId: temp_arr[i]?.driverId,
          passengerId: temp_arr[i]?.empId,
          driverSnapShot: '',
          passengerSnapshot: '',
        },
      });
    }
    setMapPosition(temp_object);
  }
  const handleClosefilter = (d) => {
    setOpenFilter(false);
  };
  useEffect(() => {
    console.log('filterRes', filterRes);

    // Check if filterRes is present and not empty
    if (filterRes && filterRes.length > 0) {
      setMastderData({data: filterRes, totalItems: filterRes?.length});
    } else {
      // If filterRes is empty, fetch data using getAllRoutes
      getAllRoutes();
    }
  }, [filterRes]);
  const getFilterData = () => {};

  return (
    <>
      <div style={{display: 'none'}}>
        {mapPosition?.length > count && (
          <MapSnapShot
            mapPosition={mapPosition}
            imageSrc={imageSrc}
            myProcess={myProcess}
            count={count}
          />
        )}
      </div>

      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={3}>
          <CustomLabel labelVal='Master Routes' variantVal='h3-underline' />
        </Grid>
        <Grid item xs={12} sm={3} md={4}>
          <QuickSearchPage
            masterKey='routeId'
            module={'MasterRoute'}
            searchClicked={true}
            searchUrl={'/employee-reg/filter'}
            displayFields={['routeId', 'loginTime']}
            filterRes={filterRes}
            getFilterData={getFilterData}
            setFilterRes={setFilterRes}
          />
        </Grid>
        <Grid xs={12} sm={9} md={5}>
          <Box display='flex' justifyContent='flex-end' alignItems='center'>
            {/* <AppTooltip placement={'top'} title={'Add Filter'}>
              <FilterAltOutlinedIcon
                className='title-icons-mui'
                style={{color: _.isEmpty(filter) ? '' : '#ff9800'}}
                onClick={() => {
                  setfilterShow(true);
                  setOpenFilter(true);
                }}
              />
            </AppTooltip>
            <AppTooltip placement={'top'} title={'Clear Filter'}>
              <img
                src='/assets/images/clear-filter.png'
                onClick={() => {
                  setfilterShow(false);
                  setFilter({});
                  handleClosefilter({button: 'clear'});
                }}
                className='title-icons-mui'
              />
            </AppTooltip> */}
            {myActions?.includes('Download And Upload') && (
              <>
                <AppTooltip title='Download Template'>
                  <ArrowCircleDownIcon
                    onClick={async () => {
                      setDisableDown(true);
                      let url = '/user-reg/master-route/download-template';
                      await excelDoc?.downloadDoc(url, 'Route-Template');
                      setDisableDown(false);
                    }}
                  />
                </AppTooltip>

                {/* <Button
                  // id='btnMui123'
                  disabled={disableDown}
                  onClick={async () => {
                    setDisableDown(true);
                    let url = '/user-reg/master-route/download-template';
                    await excelDoc?.downloadDoc(url, 'Route-Template');
                    setDisableDown(false);
                  }}
                  variant='outlined'
                  // className='route-file-download-btn'
                  style={{
                    fontSize: '12px',
                    borderRadius: '13px',
                    right: '10px',
                  }}
                >
                  <FileDownloadIcon className='route-file-download-icon' />
                  Download Template
                </Button> */}
              </>
            )}
          </Box>
        </Grid>
      </Grid>

      <UploadSection
        chartArr={chartData}
        getAllRoutes={getAllRoutes}
        fetchDistributionData={fetchDistributionData}
      />
      <div className='routeListData route-list-data'>
        <div style={{width: '100%', display: 'flex'}}>
          <div style={{width: '50%'}}>
            {myActions?.includes('Copy') && (
              <AppTooltip placement={'top'} title={"Copy Route's"}>
                <FileCopyIcon
                  onClick={(eve) => {
                    eve.stopPropagation();
                    copyRoute(eve);
                  }}
                />
              </AppTooltip>
            )}
          </div>
          <div style={{width: '50%', textAlign: 'right'}}>
            {/* <Button
              id='btnMui123'
              variant='outlined'
              sx={{mb: 2, background: '#fdfdfd'}}
              onClick={(e) => {
                setOpenFilter(true);
              }}
            >
              <FilterAltIcon sx={{fontSize: '18px', marginBottom: '3px'}} />
              Filter
            </Button> */}
            <Box display='flex' justifyContent='flex-end' alignItems='center'>
              <AppTooltip placement={'top'} title={'Add Filter'}>
                <FilterAltOutlinedIcon
                  className='title-icons-mui'
                  style={{color: _.isEmpty(filter) ? '' : '#ff9800'}}
                  onClick={() => {
                    setfilterShow(true);
                    setOpenFilter(true);
                  }}
                />
              </AppTooltip>
              <AppTooltip placement={'top'} title={'Clear Filter'}>
                <img
                  src='/assets/images/clear-filter.png'
                  onClick={() => {
                    setfilterShow(false);
                    setFilter({});
                    handleClosefilter({button: 'clear'});
                  }}
                  className='title-icons-mui'
                />
              </AppTooltip>
            </Box>
          </div>
        </div>
        <div>
          <Accordion
            onClick={(eve) => {
              eve.stopPropagation();
            }}
            className='route-accordion-header'
          >
            <AccordionSummary
              className='mb-2'
              expandIcon={<CustomExpandIcon opacity='0' />}
              aria-controls='panel1a-content'
              id='panel1a-header'
            >
              <Typography style={{width: '5%'}}>
                <Checkbox
                  color='success'
                  style={{borderColor: 'red', pointerEvents: 'auto'}}
                  checked={selectedAccord?.length == masterData?.data?.length}
                  onClick={(ev) => {
                    ev.stopPropagation();
                  }}
                  onChange={(ev) => {
                    selectAllRoute(ev);
                  }}
                />
              </Typography>
              <Typography className='route-acc-head-cells-20'>
                <AssignmentIndIcon className='route-master-head-mui-icon' />
                <span>Route Id</span>
              </Typography>
              <Typography className='route-acc-head-cells-20'>
                <ExitToAppIcon className='route-master-head-mui-icon' />
                <span>Log-in</span>
              </Typography>
              <Typography className='route-acc-head-cells-20'>
                <LocationOnIcon className='route-master-head-mui-icon' />
                <span>Office Location</span>
              </Typography>
              <Typography className='route-acc-head-cells-15'>
                <StopCircleIcon className='route-master-head-mui-icon' />
                <span>No. of Stoppage</span>
              </Typography>
              <Typography className='route-acc-head-cells-15'>
                <GroupsIcon className='route-master-head-mui-icon' />
                {/* <img className="route-icons" src="/assets/images/route_page_icon/employee.png" style={{ position: 'relative', top: '3px', right: '5px' }} /> */}
                <span>Total Employees</span>
              </Typography>
              <Typography
                style={{width: '5%'}}
                className='route-acc-head-cells-20'
              >
                <span></span>
              </Typography>
            </AccordionSummary>
          </Accordion>

          {masterData?.data?.length ? (
            masterData?.data.map((e) => {
              return (
                <Accordion style={{padding: '10px'}}>
                  <AccordionSummary
                    className='mb-2'
                    expandIcon={<CustomExpandIcon />}
                    aria-controls='panel1a-content'
                    id='panel1a-header'
                  >
                    <Typography style={{width: '5%'}}>
                      <Checkbox
                        color='success'
                        style={{borderColor: 'red'}}
                        checked={selectedAccord?.includes(e?._id)}
                        onClick={(ev) => {
                          ev.stopPropagation();
                        }}
                        onChange={(ev) => {
                          selectRoute(ev, e?._id);
                        }}
                      />
                    </Typography>
                    <Typography className='route-acc-body-cells-20'>
                      {e.routeId}
                    </Typography>
                    <Typography className='route-acc-body-cells-20'>
                      {e.loginTime}
                    </Typography>
                    <Typography className='route-acc-body-cells-20'>
                      {e.officeLocation?.locName ?? e?.officeName}
                    </Typography>
                    <Typography className='route-acc-body-cells-15'>
                      {e.passengers?.length}
                    </Typography>
                    <Typography className='route-acc-body-cells-15'>
                      {e.passengers?.length}
                    </Typography>
                    <Typography style={{width: '3.5%'}}>
                      <DeleteIcon
                        color='primary'
                        style={{color: '#bc0805', marginTop: '40%'}}
                        onClick={(eve) => {
                          eve.stopPropagation();
                          deleteMasterRoute(e._id, e.routeId);
                        }}
                      />
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      <div className='route-list-div'></div>
                      <RouteList
                        rows={e.passengers}
                        id={e._id}
                        deleteEmpFromRoute={deleteEmpFromRoute}
                      />
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              );
            })
          ) : !masterData?.data ? (
            <p className='route-no-data'>No records to display</p>
          ) : (
            <p className='route-no-data'>No records to display</p>
          )}
          <div
            className={classes.root}
            style={{display: 'flex', justifyContent: 'center'}}
          >
            {masterData?.data?.length > 0 ? (
              <TablePagination
                rowsPerPageOptions={[10, 25, 50, 100, 250, 500]}
                component='div'
                colSpan={3}
                count={masterData?.totalItems}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {'aria-label': 'rows per page'},
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            ) : null}
          </div>
        </div>
      </div>

      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        maxWidth='false'
      >
        <DialogTitle id='alert-dialog-title' className='header-color'>
          <h1>Master Route</h1>
          <IconButton
            className='header-close-btn'
            onClick={() => {
              setOpen(false);
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent style={{padding: '0px 20px 15px 20px', width: '500px'}}>
          {!showbtn ? <AppLoader /> : null}
          <div className='grid-container'>
            <SmartForm
              template={template}
              defaultValues={{allowRegeneration: 'NO', allowSkipEmployee: 'NO'}}
              onSubmit={handleSubmit}
              buttons={['submit']}
              onChange={onChangeVal}
              showbtn={showbtn}
            />
          </div>
        </DialogContent>
      </Dialog>
      {/* <FilterPop
        open={openFilter}
        handleClose={handleClose}
        title={'Route Filter'}
        template={filtertemplate}
        cnfMsg={'cnfMsg'}
        header={'My Header'}
      /> */}
      <Confirm
        open={openConfirmboxCopy}
        header={'Confirm to Copy'}
        cnfMsg={copyErrorMsg + 'Still want to create?'}
        handleClose={handleSubmit}
      />
      <Confirm
        open={openConfirmbox}
        header={'Confirm to Deactivate'}
        cnfMsg={`Are you sure, You want to deactivate the Route - ${masterRouteId}?`}
        handleClose={closeConfirmBox}
      />
      <Confirm
        open={deleteConfirmbox}
        header={'Confirm to Delete'}
        cnfMsg={`Are you sure, You want to delete this employee from route?`}
        handleClose={closeDeleteConfirmBox}
      />

      <Dialog
        open={shiftConfirmation}
        // onClose={() => { setShiftConfirmation(false) }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        maxWidth='false'
      >
        <DialogTitle id='alert-dialog-title' className='header-color'>
          <h1>Confirm to Copy</h1>
        </DialogTitle>
        <DialogContent
          style={{padding: '20px', textAlign: 'center', width: '500px'}}
        >
          <p style={{textAlign: 'left'}}>
            This shift doesn't exist to this department of the employee{' '}
            <a
              style={{color: '#fe7f0c'}}
              className='cursor'
              onClick={() => {
                navigate('/onboardCorporate/department/department-listing');
              }}
            >
              Click here{' '}
            </a>
            to map the shift
          </p>
          <Button
            id='btnMui123'
            sx={{mt: 4}}
            onClick={() => {
              setShiftConfirmation(false);
            }}
          >
            Cancel
          </Button>
        </DialogContent>
      </Dialog>
      {filterShow && (
        <SmartFilter
          open={openFilter}
          title={'Route Master'}
          handleClose={handleClosefilter}
          filter={filter}
          fieldList={fieldList}
          setFilter={setFilter}
        />
      )}
    </>
  );
};

export default MasterRoutes;
