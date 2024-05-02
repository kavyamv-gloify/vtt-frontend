import * as React from 'react';
import {useState, useEffect} from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FormControl from '@mui/material/FormControl';
import {
  TableBody,
  TableCell,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Autocomplete,
  TextField,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Box,
} from '@mui/material';
import moment from 'moment';
import axios from 'axios';
import api from '@api';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {Button} from '@mui/material';
import Api from '@api';
import {toast} from 'react-toastify';
import _ from 'lodash';
import Dial from './dial';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ScheduleIcon from '@mui/icons-material/Schedule';
import Confirm from '@confirmation-box';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AllPendings from '../manager-roster/roster-list';
import CloseIcon from '@mui/icons-material/Close';
import AppTooltip from '@crema/core/AppTooltip';
import CustomLabel from 'pages/common/CustomLabel';
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';

const tempmonthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const CreateRoster = () => {
  const weeks = [
    {title: 'Sunday', value: 'SUN'},
    {title: 'Monday', value: 'MON'},
    {title: 'Tuesday', value: 'TUE'},
    {title: 'Wednesday', value: 'WED'},
    {title: 'Thursday', value: 'THU'},
    {title: 'Friday', value: 'FRI'},
    {title: 'Saturday', value: 'SAT'},
  ];
  const navigate = useNavigate();
  const [shift, setShift] = React.useState({});
  const [openDial, setOpenDial] = React.useState(false);
  const [shiftFor, setShiftFor] = React.useState('BOTH');
  const [employee, setEmployee] = useState();
  const [selectedDate, setselectedDate] = React.useState([]);
  const [selectedEmployee, setSelectedEmployee] = React.useState([]);
  const [fetchedweekoffDate, setFetchedWeekOffDate] = useState([]);
  const [realdeptname, setRealdeptName] = React.useState();
  const [deptname, setdeptName] = React.useState([]);
  const [deptList, setdeptList] = useState();
  const [tempdatearray, setTempDatearray] = useState();
  const [selectedLogoutShift, setSelectedLogoutShift] = useState();
  const [selectedLoginShift, setSelectedLoginShift] = useState();
  const [pendingRosterData, setpendingRosterData] = useState();
  const [pendingRcount, setpendingRcount] = useState();
  const [pendingId, setpendingId] = useState('ALL');
  const [openPending, setopenPending] = useState(false);
  const [openCnf, setOpenCnf] = useState(false);
  const [myCnfTempData, setMyCnfTempData] = useState();
  const {user} = useAuthUser();
  const employeeId = user?.userList?.profileId;
  const corporateId = user?.userList?.corporateId;
  const [HolidayArr, setHolidayArr] = React.useState([]);
  const [rosterSettings, setRosterSettings] = useState();
  const [HolidayObj, setHolidayObj] = React.useState({});
  const [leavesArr, setleavesArr] = React.useState([]);
  const [myActions, setMyActions] = useState([]);

  const permissionCheck = useSelector(({settings}) => settings.permissions);
  useEffect(() => {
    if (!permissionCheck) return;
    let sub_mod = {};
    permissionCheck?.map((el) => {
      if (el.subModuleName == 'RosterManager') sub_mod = el;
    });
    setMyActions(sub_mod?.actions);
    if (
      (!sub_mod || !sub_mod?.actions?.includes('View')) &&
      user?.userList?.userRole !== 'SUPERADMIN'
    )
      navigate('/error-pages/error-404');
  }, [permissionCheck, user]);
  useEffect(() => {
    let temfrom = moment(
      new Date(new Date().setDate(new Date().getDate() + 1)),
    ).format('YYYY-MM-DD');
    let temto = moment(
      new Date(new Date().setDate(new Date().getDate() + 7)),
    ).format('YYYY-MM-DD');
    if (deptname.length) getLeaves(temfrom, temto);
  }, [deptname]);
  var getDaysArray = function (start, end) {
    for (
      var arr = [], dt = new Date(start);
      dt <= new Date(end);
      dt.setDate(dt.getDate() + 1)
    ) {
      arr.push(moment(new Date(dt)).format('DD/MM/YYYY'));
    }
    return arr;
  };
  function getLeaves(temfrom, temto) {
    let postData = {
      empId: '',
      status: '',
      empCode: '',
      fromDate: '',
      toDate: '',
      departmentId: '',
      managerId: '',
    };
    axios
      .post(Api?.leave?.getAll, postData)
      .then((re) => {
        let myobj = [];
        re?.data?.data?.map((tem_elem) => {
          if (tem_elem?.status == 'APPROVED') {
            var daylist = getDaysArray(
              new Date(tem_elem?.fromDate),
              new Date(tem_elem?.toDate),
            );
            daylist.map((ele_tem) => {
              myobj.push(tem_elem?.empId + '<<==>>' + ele_tem);
            });
          }
        });
        setleavesArr(myobj);
      })
      .catch((er) => {});
  }

  useEffect(() => {
    let temfrom = moment(
      new Date(new Date().setDate(new Date().getDate() + 1)),
    ).format('YYYY-MM-DD');
    let temto = moment(
      new Date(new Date().setDate(new Date().getDate() + 7)),
    ).format('YYYY-MM-DD');
    getHolidays(temfrom, temto);
    //         var timeStart = new Date().getHours();
    // var timeEnd = new Date("01/01/2007 " + '23:00').getHours();

    // var hourDiff = timeEnd - timeStart;
  }, []);
  function getRosterSetting() {
    if (!deptname?.length) {
      return;
    }
    axios
      .get(
        `${Api?.baseUri}/user-reg/Roaster-Setting/getroastersetting/${deptname[0]}/departmentId`,
      )
      .then((res) => {
        setRosterSettings(res?.data?.data);
      })
      .catch((err) => {});
  }
  function compareTime(date, time, type) {
    const temtime = time;
    function getWeekStartDate(dateToCompare) {
      let weekDay = rosterSettings?.weekStartdayLogin;
      var WEEK_DAYS = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];
      var MILLIS_PER_DAY = 86400000;
      var desiredIndex = WEEK_DAYS.indexOf(weekDay);
      var currentDate = dateToCompare;
      var daysDifference = ((currentDate.getDay() - desiredIndex + 6) % 7) + 1; //the number of days ago
      if (WEEK_DAYS.indexOf(weekDay) == dateToCompare?.getDay()) {
        return dateToCompare;
      } else
        return new Date(
          currentDate.getTime() - MILLIS_PER_DAY * daysDifference,
        );
    }
    function lastOccurrenceOf(weekDay, dateToCompare) {
      let weekStartDate = getWeekStartDate(dateToCompare);
      if (rosterSettings?.roasterTypeLogin?.toUpperCase() == 'WEEKLY') {
        var WEEK_DAYS = [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ];
        var MILLIS_PER_DAY = 86400000;
        var desiredIndex = WEEK_DAYS.indexOf(weekDay);
        var currentDate = dateToCompare;
        var daysDifference =
          ((currentDate.getDay() - desiredIndex + 6) % 7) + 1; //the number of days ago
        if (
          moment(new Date(weekStartDate)).isBefore(
            new Date(currentDate.getTime() - MILLIS_PER_DAY * daysDifference),
          )
        ) {
          return lastOccurrenceOf(
            weekDay,
            new Date(currentDate.getTime() - MILLIS_PER_DAY * daysDifference),
          );
        }
        return new Date(
          currentDate.getTime() - MILLIS_PER_DAY * daysDifference,
        );
      }
      if (rosterSettings?.roasterTypeLogin?.toUpperCase() == 'MONTHLY') {
        var d = new Date(temp_date1); // current date
        d.setDate(1); // going to 1st of the month
        d.setHours(-1); // going to last hour before this date even started.
        return d;
      }
      if (rosterSettings?.roasterTypeLogin?.toUpperCase() == 'FORTNIGHT') {
        if (temp_date1?.split('-')[2] <= 15) {
          var d = new Date(temp_date1); // current date
          d.setDate(1); // going to 1st of the month
          d.setHours(-1); // going to last hour before this date even started.
          return d;
        } else {
          return new Date(
            temp_date1?.split('-')[0] +
              '-' +
              temp_date1?.split('-')[1] +
              '-' +
              '15',
          );
        }
      }
    }
    let temp_date1 = moment(date).format('YYYY-MM-DD');
    let temp_date2 = moment(new Date()).format('YYYY-MM-DD');
    if (
      moment(temp_date1).isSame(temp_date2) ||
      moment(new Date(temp_date2)).isBefore(new Date(temp_date1))
    ) {
      if (!time || time?.toUpperCase()?.trim() == 'OFF') {
        if (moment(new Date(temp_date2)).isBefore(new Date(temp_date1))) {
          time = '00:01';
        } else return false;
      }
      function diff_minutes() {
        var h = new Date().getHours();
        var m = new Date().getMinutes();
        var s = new Date().getSeconds();
        var date1 = moment(`${temp_date1} ${time}:00`);
        var date2 = moment(`${temp_date2} ${h}:${m}:${s}`);
        let differenceInMs = date1.diff(date2); // diff yields milliseconds
        let duration = moment.duration(differenceInMs); // moment.duration accepts ms
        let differenceInMinutes = duration.asMinutes(); // if you would like to have the output 559
        return differenceInMinutes;
      }
      if (type == 'LOGIN_MODIFY') {
        if (rosterSettings?.allowDailyChanges?.toUpperCase()?.trim() == 'YES') {
          if (
            Number(rosterSettings?.loginModifyCutoffTimeinMinutes) <
            diff_minutes()
          ) {
            return true;
          } else {
            return false;
          }
        } else if (
          rosterSettings?.allowDailyChanges?.toUpperCase()?.trim() == 'NO'
        ) {
          let temp_lastDate =
            lastOccurrenceOf(
              rosterSettings?.roasterCutOffDay,
              new Date(temp_date1),
            ) || new Date();
          if (
            moment(new Date()).isBefore(
              temp_lastDate.setHours(
                rosterSettings?.roasterCutOffTime?.split(':')[0],
                rosterSettings?.roasterCutOffTime?.split(':')[1],
                0,
                0,
              ),
            )
          ) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      }
      if (type == 'LOGIN_CANCEL') {
        if (!temtime || temtime == 'OFF') {
          return false;
        }
        if (rosterSettings?.allowDailyChanges?.toUpperCase()?.trim() == 'YES') {
          if (
            Number(rosterSettings?.loginCancelCutoffTime) < diff_minutes() &&
            Number(rosterSettings?.loginModifyCutoffTimeinMinutes) >
              diff_minutes()
          ) {
            return true;
          } else {
            return false;
          }
        } else if (
          rosterSettings?.allowDailyChanges?.toUpperCase()?.trim() == 'NO'
        ) {
          let temp_lastDate =
            lastOccurrenceOf(
              rosterSettings?.roasterCutOffDay,
              new Date(temp_date1),
            ) || new Date();
          if (
            !moment(new Date()).isBefore(
              temp_lastDate.setHours(
                rosterSettings?.roasterCutOffTime?.split(':')[0],
                rosterSettings?.roasterCutOffTime?.split(':')[1],
                0,
                0,
              ),
            ) &&
            moment(new Date()).isBefore(moment(`${temp_date1} ${time}:00`))
          ) {
            return true;
          }
        } else {
          return false;
        }
      }

      if (type == 'LOGOUT_CANCEL') {
        if (!temtime || temtime == 'OFF') {
          return false;
        }
        if (rosterSettings?.allowDailyChanges?.toUpperCase()?.trim() == 'YES') {
          if (
            Number(rosterSettings?.logoutCancelCutoffTime) < diff_minutes() &&
            Number(rosterSettings?.logoutModifyCutoffTimeinMinutes) >
              diff_minutes()
          ) {
            return true;
          } else {
            return false;
          }
        } else if (
          rosterSettings?.allowDailyChanges?.toUpperCase()?.trim() == 'NO'
        ) {
          let temp_lastDate =
            lastOccurrenceOf(
              rosterSettings?.roasterCutOffDay,
              new Date(temp_date1),
            ) || new Date();
          if (
            !moment(new Date()).isBefore(
              temp_lastDate.setHours(
                rosterSettings?.roasterCutOffTime?.split(':')[0],
                rosterSettings?.roasterCutOffTime?.split(':')[1],
                0,
                0,
              ),
            ) &&
            moment(new Date()).isBefore(moment(`${temp_date1} ${time}:00`))
          ) {
            return true;
          }
        } else {
          return false;
        }
      } else if (type == 'LOGOUT_MODIFY') {
        if (rosterSettings?.allowDailyChanges?.toUpperCase()?.trim() == 'YES') {
          if (
            Number(rosterSettings?.logoutModifyCutoffTimeinMinutes) <
            diff_minutes()
          ) {
            return true;
          } else {
            return false;
          }
        } else if (
          rosterSettings?.allowDailyChanges?.toUpperCase()?.trim() == 'NO'
        ) {
          let temp_lastDate =
            lastOccurrenceOf(
              rosterSettings?.roasterCutOffDay,
              new Date(temp_date1),
            ) || new Date();
          if (
            moment(new Date()).isBefore(
              temp_lastDate.setHours(
                rosterSettings?.roasterCutOffTime?.split(':')[0],
                rosterSettings?.roasterCutOffTime?.split(':')[1],
                0,
                0,
              ),
            )
          ) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      }
    } else {
      return false;
    }
  }
  function getHolidays(temfrom, temto) {
    // axios.get(Api.siteOffice.list + '/' + user?.userList?.corporateId + '/corporate?page=0&size=100').then((res)=>{
    //     if(res?.data?.data?.body['SiteOffice List'][0]?.id){
    axios
      .get(Api?.holiday?.holidayList)
      .then((re) => {
        //+res?.data?.data?.body['SiteOffice List'][0]?.id+'/office'
        let arr = [];
        let obj = {};
        re?.data?.data?.map((myel) => {
          arr?.push(myel?.holidayDate?.split('T')[0]);
          obj[myel?.holidayDate?.split('T')[0]] = myel?.holidayName;
        });
        setHolidayArr(arr);
        setHolidayObj({...obj});
      })
      .catch((er) => {});
    //     }
    // }).catch(err=>{
    //
    // })
  }
  const handleChanges = (e) => {
    setdeptName(e ? [e?.value] : []);
    setRealdeptName(e);
  };
  const fetchPendingRoster = () => {
    axios
      .get(Api?.baseUri + '/user-reg/roaster/get-team-roaster-req')
      .then((res) => {
        let myobj = {};
        let sorted = res?.data?.data?.sort((p1, p2) =>
          new Date(p1.createdOn) < new Date(p2.createdOn)
            ? 1
            : new Date(p1.createdOn) > new Date(p2.createdOn)
            ? -1
            : 0,
        );
        sorted?.map((rem) => {
          rem?.dates?.map((el) => {
            myobj[
              rem?.employeeId + '<<==>>' + moment(el?.date).format('DD/MM/YYYY')
            ] =
              (rem?.loginTime || 'OFF') +
              '<<==>>' +
              (rem?.logoutTime || 'OFF') +
              '<<==>>' +
              rem?.id;
          });
        });
        setpendingRosterData(myobj);
        setpendingRcount(res?.data?.data?.length);
      })
      .catch((err) => {});
  };
  const handleConfBox = (dd) => {
    setOpenCnf(false);
    if (dd == 'YES') onCancel(myCnfTempData);
  };
  useEffect(() => {
    fetchPendingRoster();
  }, []);
  function onCancel({date, empid, login, logout}) {
    axios
      .get(Api?.employee?.list + '/' + empid)
      .then((res) => {
        let MyData = res?.data?.data;
        let postData = {
          tanentId: MyData?.tanentId,
          tanentName: MyData?.tanentName,
          corporateId: MyData?.corporateId,
          corporateName: MyData?.companyName,
          officeId: MyData?.officeId,
          officeName: MyData?.officeName,
          departmentId: realdeptname?.value,
          departmentName: realdeptname?.title,
          loginShiftId: login,
          logoutShiftId: logout,
          dates: [{date: moment(date).format('YYYY-MM-DD'), weekOff: 'NO'}],
          employeeIds: [empid],
        };
        axios
          .post(Api?.roaster?.roasterCreation, postData)
          .then((respo) => {
            if (respo?.data?.status == '200') {
              toast.success(respo?.data?.message ?? 'Success');
              fetchAllData();
            } else {
              toast.error(respo?.data?.message ?? 'Something went wrong');
            }
          })
          .catch((err) => {
            toast.error(err?.message ?? 'Something went wrong');
          });
      })
      .catch((err) => {});
  }
  function openDialFun(dialvalue) {
    setOpenDial(false);
    setSelectedLogoutShift(null);
    setSelectedLoginShift(null);
    setselectedDate([]);
    setSelectedEmployee([]);
  }
  // function fetchAllData() {
  //     let tem = {}
  //     let postbody = {
  //         "fromDate": moment(new Date(tempdatearray[0])).format("YYYY-MM-DD"),
  //         "toDate": moment(new Date(tempdatearray[tempdatearray?.length - 1])).format("YYYY-MM-DD"),
  //         "departmentId": deptname[0],
  //         "managerId": user?.userList?.profileId
  //     }
  //     axios.post(Api?.baseUri + "/user-reg/roaster/employeeroasterlist", postbody).then(res => {
  //         let temoffDate = [];
  //         res?.data?.data?.dateList?.map(rr => {
  //             if (rr?.weekOff == "YES") {
  //                 temoffDate.push(moment(rr?.date).format("DD/MM/YYYY"))
  //             }
  //         })
  //         setFetchedWeekOffDate(temoffDate);
  //         res?.data?.data?.empList?.map((ok) => {
  //             if (ok?.roasterList?.length) {
  //                 ok?.roasterList?.map(re => {
  //                     tem[re?.employeeId + "<<==>>" + moment(re?.date).format("DD/MM/YYYY")] = re?.loginTime + "<==>" + re?.logoutTime + "<==>" + re?.loginShiftId + "<==>" + re?.logoutShiftId + "<==>" + re?.weekOff;
  //                 }) // logintime, logouttime, loginid, logoutid
  //             }
  //         })
  //         setShift(tem)

  //     }).catch(err => {
  //     })
  // }
  function fetchAllData() {
    let tem = {};
    let postbody = {
      fromDate: moment(new Date(tempdatearray[0])).format('YYYY-MM-DD'),
      toDate: moment(new Date(tempdatearray[tempdatearray?.length - 1])).format(
        'YYYY-MM-DD',
      ),
      departmentId: deptname[0],
      managerId: user?.userList?.profileId,
    };
    axios
      .post(Api?.baseUri + '/user-reg/roaster/employeeroasterlist', postbody)
      .then((res) => {
        let temoffDate = [];
        res?.data?.data?.dateList?.map((rr) => {
          if (rr?.weekOff == 'YES') {
            temoffDate.push(moment(rr?.date).format('DD/MM/YYYY'));
          }
        });
        setFetchedWeekOffDate(temoffDate);
        res?.data?.data?.empList?.map((ok) => {
          if (ok?.roasterList?.length) {
            ok?.roasterList?.map((re) => {
              if (re?.loginShiftId == 'CANCEL') re.loginTime = 'CANCEL';
              if (re?.logoutShiftId == 'CANCEL') re.logoutTime = 'CANCEL';
              if (re?.loginShiftId == 'OFF') re.loginTime = 'OFF';
              if (re?.logoutShiftId == 'OFF') re.logoutTime = 'OFF';
              // tem[re?.employeeId + "<<==>>" + moment(re?.date).format("DD/MM/YYYY")] = { login: re?.loginTime ?? "10:00 AM", logout: re?.logoutTime ?? "08:00 PM", loginshiftid: re?.loginShiftId, logoutshiftid: re?.logoutShiftId};
              tem[
                re?.employeeId +
                  '<<==>>' +
                  moment(re?.date).format('DD/MM/YYYY')
              ] =
                re?.loginTime +
                '<==>' +
                re?.logoutTime +
                '<==>' +
                re?.loginShiftId +
                '<==>' +
                re?.logoutShiftId +
                '<==>' +
                (re?.weekOff || 'NO') +
                '<==>' +
                re?.logoutDate;
            }); // logintime, logouttime, loginid, logoutid
          }
        });
        setShift(tem);
      })
      .catch((err) => {});
  }
  useEffect(() => {
    if (!deptname?.length) {
      return;
    }
    fetchAllData();
    getRosterSetting();
  }, [deptname, tempdatearray, openDial]);
  useEffect(() => {
    async function getDeptList() {
      const baseURL = `${api.department.list}/${
        user?.userList?.userRole == 'CORPORATEADMIN' ? null : employeeId
      }/employeeId/${
        user?.userList?.userRole == 'CORPORATEADMIN'
          ? user?.userList?.profileId
          : corporateId
      }/corporateId?page=0&size=1000`;
      axios.get(`${baseURL}`).then((response) => {
        let temp = [];
        if (response?.data?.data?.body['DATA']?.id) {
          temp.push({
            title: response?.data?.data?.body['DATA']?.departmentName,
            value: response?.data?.data?.body['DATA']?.id,
          });
        }
        // if (response?.data?.data?.body['DATA']?.length) {
        //     response?.data?.data?.body['DATA']?.map((e) => {
        //         temp.push({ title: e.departmentName, value: e.id });
        //     })
        setdeptList(temp);
        if (temp?.length) {
          setRealdeptName(temp[0]);
          setdeptName([temp[0]?.value]);
        } else {
          setdeptName(null);
          setRealdeptName(null);
        }
        // }
      });
    }
    getDeptList();
  }, [employeeId, corporateId]);

  useEffect(() => {
    arrowRight(true, null, null);
  }, []);

  const arrowRight = (initialCall, daycount, myfirstdate) => {
    let date;
    if (initialCall) date = new Date();
    else date = tempdatearray[tempdatearray?.length - 1];
    let temparr = [];
    let templastDate = '';
    for (var i = 0; i < 7 + 1; i++) {
      var last = new Date(date);
      last.setDate(last.getDate() + i);
      templastDate = `${
        last.getMonth() + 1
      }/${last.getDate()}/${last.getFullYear()}`;
      templastDate = last;
      if (i != 0) temparr.push(templastDate);
    }
    setTempDatearray(temparr);
  };
  const arrowLeft = () => {
    let temparr = [];
    let templastDate = '';
    for (var i = 0; i < 8; i++) {
      var last = new Date(tempdatearray[0]);
      last.setDate(last.getDate() - i);
      templastDate = `${
        last.getMonth() - 1
      }/${last.getDate()}/${last.getFullYear()}`;
      templastDate = last;
      if (i != 0) temparr.push(templastDate);
    }
    temparr = temparr.reverse();
    setTempDatearray(temparr);
  };
  useEffect(() => {
    async function getEmployeeList() {
      if (deptname && deptname?.length) {
        let baseURL;
        if (user?.userList?.userRole == 'CORPORATEADMIN')
          baseURL = `${api.employee.list}/${deptname}/departmentId/null/shiftId`;
        else if (user?.userList?.userRole == 'MANAGER')
          baseURL = `${api.employee.list}/${employeeId}/manager/${deptname}/department`;
        else if (user?.userList?.userRole == 'EMPLOYEE') {
          baseURL = `${api.employee.list}/${employeeId}`;
        }
        axios
          .get(`${baseURL}`)
          .then((response) => {
            setEmployee(response?.data?.data);
            if (user?.userList?.userRole == 'EMPLOYEE') {
              setEmployee([response?.data?.data]);
            }
          })
          .catch((er) => {
            setEmployee([]);
          });
      } else {
        setEmployee([]);
      }
    }
    getEmployeeList();
  }, [employeeId, deptname]);

  return (
    <>
      <Grid container spacing={2} sx={{mb: 8}} className='page-header-second'>
        <Grid item xs={6}>
          <CustomLabel labelVal='Schedule' variantVal='h3-underline' />
        </Grid>
        <Grid item xs={6}>
          <Box display='flex' justifyContent='flex-end'>
            <div className='left-seperator'>
              {rosterSettings?.allowManagerApproval?.toUpperCase()?.trim() ==
              'YES' ? (
                <AppTooltip placement={'top'} title={'Pending Requests'}>
                  <span
                    className='title-icons-mui'
                    style={{
                      display: 'flex',
                      alignItems: 'end',
                      fontWeight: 600,
                    }}
                  >
                    <PendingActionsIcon
                      onClick={() => {
                        setpendingId('ALL');
                        setopenPending(true);
                      }}
                    />
                    <span style={{fontSize: '12px'}}>{pendingRcount ?? 0}</span>
                  </span>
                </AppTooltip>
              ) : null}
              {rosterSettings?.managerManageEmpRoaster?.toUpperCase()?.trim() ==
                'YES' && myActions?.includes('Create') ? (
                <AppTooltip placement={'top'} title={'Schedule'}>
                  <ScheduleIcon
                    className='title-icons-mui'
                    onClick={() => {
                      setOpenDial(true);
                      setShiftFor('BOTH');
                    }}
                  />
                </AppTooltip>
              ) : null}
            </div>
          </Box>
        </Grid>
      </Grid>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        <div style={{width: '100%'}}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              color: 'white',
              justifyContent: 'space-between',
            }}
          >
            <div style={{borderRadius: '10px', borderColor: '2px solid black'}}>
              <FormControl sx={{m: 1, width: 250}}>
                <Autocomplete
                  id='free-solo-demo'
                  disabled={deptList?.length == 1}
                  freeSolo
                  onChange={(e, option, v) => {
                    if (v == 'clear') {
                      handleChanges(null);
                    } else {
                      handleChanges(option);
                    }
                  }}
                  value={realdeptname ? realdeptname : null}
                  options={deptList ?? []}
                  style={{background: '#fff'}}
                  InputProps={{disableUnderline: true}}
                  getOptionLabel={(option) => option.title}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label='Department'
                      style={{fontWeight: 'bold'}}
                      InputProps={{
                        ...params.InputProps,
                        disableUnderline: true,
                      }}
                    />
                  )}
                />
              </FormControl>
            </div>
            <div
              style={{
                display: 'flex',
                marginTop: '1.2rem',
                marginLeft: '1rem',
                color: 'black',
              }}
            >
              <ArrowBackIosIcon
                style={{cursor: 'pointer', fontSize: '1.3rem'}}
                onClick={arrowLeft}
              />
              <div style={{display: 'flex'}}>
                <h5 style={{fontSize: '16px'}}>
                  {tempdatearray?.length
                    ? tempdatearray[0]?.getDate()?.toLocaleString('en-US', {
                        minimumIntegerDigits: 2,
                        useGrouping: false,
                      })
                    : '-'}
                </h5>
                <h5 style={{fontSize: '16px'}}>
                  {tempdatearray?.length
                    ? tempmonthNames[tempdatearray[0].getMonth()]
                    : '-'}
                </h5>
                <span style={{margin: '4px'}}>-</span>
                <h5 style={{fontSize: '16px'}}>
                  {tempdatearray?.length
                    ? tempdatearray[tempdatearray?.length - 1]
                        ?.getDate()
                        ?.toLocaleString('en-US', {
                          minimumIntegerDigits: 2,
                          useGrouping: false,
                        })
                    : '-'}
                </h5>
                <h5 style={{fontSize: '16px'}}>
                  {tempdatearray?.length
                    ? tempmonthNames[
                        tempdatearray[tempdatearray?.length - 1].getMonth()
                      ]
                    : '-'}
                </h5>
              </div>
              <ArrowForwardIosIcon
                style={{
                  fontSize: '1.3rem',
                  marginLeft: '0.3rem',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  arrowRight(false, null, null);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      {/* -----------------------------------------------Table Content------------------------------------------------------- */}
      <TableContainer component={Paper} style={{marginTop: '1rem'}}>
        <Table sx={{minWidth: 400}} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell
                align='left'
                style={{
                  position: 'sticky',
                  left: 0,
                  background: 'white',
                  zIndex: 800,
                  border: '1px solid #f2f2f2',
                  fontWeight: '600',
                  background: '#1167b1',
                  color: 'white',
                  fontSize: '1.5rem',
                  borderRadius: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                  justifyContent: 'space-around',
                }}
              >
                <CalendarMonthIcon style={{fontSize: '3rem'}} />
                <span style={{fontSize: '1rem'}}>
                  {tempdatearray?.length
                    ? tempmonthNames[tempdatearray[0].getMonth()] ==
                      tempmonthNames[
                        tempdatearray[tempdatearray?.length - 1].getMonth()
                      ]
                      ? tempmonthNames[tempdatearray[0].getMonth()]
                      : tempmonthNames[tempdatearray[0].getMonth()] +
                        ' - ' +
                        tempmonthNames[
                          tempdatearray[tempdatearray?.length - 1].getMonth()
                        ]
                    : '-'}
                </span>
                <p
                  style={{
                    fontWeight: '600',
                    color: 'white',
                    fontSize: '1rem',
                    marginLeft: '0.5rem',
                    alignItems: 'center',
                    marginTop: '0rem',
                  }}
                >
                  {''}
                </p>
              </TableCell>
              {tempdatearray?.length &&
                tempdatearray?.map((ett, ind) => (
                  <TableCell
                    style={{
                      border: '1px solid #f2f2f2',
                      background:
                        tempdatearray[ind] < new Date() ||
                        tempdatearray[ind] >
                          new Date().setDate(
                            new Date().getDate() +
                              (rosterSettings?.advanceRoaster
                                ? Number(rosterSettings?.advanceRoaster)
                                : 60),
                          )
                          ? '#f2f2f2'
                          : '',
                    }}
                  >
                    <Tooltip
                      title={
                        HolidayObj[
                          moment(tempdatearray[ind]).format('YYYY-MM-DD')
                        ]
                          ? HolidayObj[
                              moment(tempdatearray[ind]).format('YYYY-MM-DD')
                            ]
                          : null
                      }
                      placement='bottom'
                    >
                      <div style={{marginLeft: '2rem'}}>
                        <div
                          style={{
                            textAlign: 'center',
                            width: '3rem',
                            height: '3rem',
                            border: '2px solid #ebecf0',
                            borderRadius: '50%',
                            padding: '2rem',
                            background: selectedDate?.includes(
                              moment(ett).format('DD/MM/YYYY'),
                            )
                              ? '#00c66f'
                              : HolidayArr?.includes(
                                  moment(tempdatearray[ind]).format(
                                    'YYYY-MM-DD',
                                  ),
                                )
                              ? '#fff3dc'
                              : '',
                            cursor: 'pointer',
                            color: selectedDate?.includes(
                              moment(ett).format('DD/MM/YYYY'),
                            )
                              ? 'white'
                              : 'black',
                          }}
                          onClick={(e) => {
                            if (
                              rosterSettings?.managerManageEmpRoaster
                                ?.toUpperCase()
                                ?.trim() != 'YES'
                            )
                              return;
                            if (
                              tempdatearray[ind] < new Date() ||
                              tempdatearray[ind] >
                                new Date().setDate(
                                  new Date().getDate() +
                                    (rosterSettings?.advanceRoaster
                                      ? Number(rosterSettings?.advanceRoaster)
                                      : 60),
                                )
                            ) {
                              return;
                            }
                            if (tempdatearray[ind] < new Date()) {
                              return;
                            }
                            let temDate = selectedDate;
                            if (
                              temDate?.includes(
                                moment(ett).format('DD/MM/YYYY'),
                              )
                            ) {
                              temDate.splice(
                                temDate.indexOf(
                                  moment(ett).format('DD/MM/YYYY'),
                                ),
                                1,
                              );
                            } else {
                              temDate.push(moment(ett).format('DD/MM/YYYY'));
                            }
                            setselectedDate([...temDate]);
                          }}
                        >
                          <div
                            style={{
                              alignContent: 'center',
                              alignItems: 'center',
                              marginTop: '-1.5rem',
                              marginLeft: '-0.8rem',
                            }}
                          >
                            <p style={{fontWeight: '600', fontSize: '1.5rem'}}>
                              {ett?.getDate()?.toLocaleString('en-US', {
                                minimumIntegerDigits: 2,
                                useGrouping: false,
                              })}
                            </p>
                            <p style={{fontWeight: '600'}}>
                              {weeks[ett.getDay()]?.value}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Tooltip>
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {employee?.length
              ? employee?.map((employee, index) => {
                  return (
                    <>
                      <TableRow>
                        <TableCell
                          align='left'
                          style={{
                            position: 'sticky',
                            left: 0,
                            cursor: 'pointer',
                            background: selectedEmployee?.includes(employee?.id)
                              ? '#e1e7fc'
                              : 'white',
                            zIndex: 800,
                          }}
                          onClick={(e) => {
                            if (
                              rosterSettings?.managerManageEmpRoaster
                                ?.toUpperCase()
                                ?.trim() != 'YES'
                            )
                              return;
                            let temDate = selectedEmployee;
                            if (temDate?.includes(employee?.id)) {
                              temDate.splice(temDate.indexOf(employee?.id), 1);
                            } else {
                              temDate.push(employee?.id);
                            }
                            setSelectedEmployee([...temDate]);
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                            }}
                          >
                            {/* <div style={{ textAlign: "center", width: "3rem", height: "3rem", border: "2px solid #ebecf0", borderRadius: "50%", padding: "2rem", marginTop: "1rem", }} ></div> */}
                            <img
                              style={{
                                width: '51px',
                                height: '51px',
                                borderRadius: '50%',
                                border: '2px solid #ebecf0',
                              }}
                              src={Api?.imgUrl + employee.photo}
                              onError={(event) =>
                                (event.target.src =
                                  employee?.gender?.toUpperCase()?.trim() ==
                                  'FEMALE'
                                    ? '/assets/images/female.webp'
                                    : '/assets/images/placeholder.jpg')
                              }
                            />
                            <h5
                              style={{marginTop: '20px', marginLeft: '0.5rem'}}
                            >
                              {employee?.id == user?.userList?.profileId
                                ? 'You'
                                : employee.employeeFullName}
                            </h5>
                          </div>
                        </TableCell>
                        {tempdatearray?.length &&
                          tempdatearray?.map((e, ind) => {
                            return (
                              <TableCell
                                style={{
                                  position: 'relative',
                                  border: '1px solid #f2f2f2',
                                  background: leavesArr?.includes(
                                    employee?.id +
                                      '<<==>>' +
                                      moment(e).format('DD/MM/YYYY'),
                                  )
                                    ? '#fdf0f2'
                                    : !(
                                        compareTime(
                                          tempdatearray[ind],
                                          shift[
                                            employee?.id +
                                              '<<==>>' +
                                              moment(e).format('DD/MM/YYYY')
                                          ]?.split('<==>')[0] != 'null'
                                            ? shift[
                                                employee?.id +
                                                  '<<==>>' +
                                                  moment(e).format('DD/MM/YYYY')
                                              ]?.split('<==>')[0] == 'CANCEL'
                                              ? 'CANCELLED'
                                              : shift[
                                                  employee?.id +
                                                    '<<==>>' +
                                                    moment(e).format(
                                                      'DD/MM/YYYY',
                                                    )
                                                ]?.split('<==>')[0] ?? null
                                            : null,
                                          'LOGIN_MODIFY',
                                        ) ||
                                        compareTime(
                                          shift[
                                            employee?.id +
                                              '<<==>>' +
                                              moment(e).format('DD/MM/YYYY')
                                          ]?.split('<==>')[5] != 'null'
                                            ? shift[
                                                employee?.id +
                                                  '<<==>>' +
                                                  moment(e).format('DD/MM/YYYY')
                                              ]?.split('<==>')[5] == 'CANCEL'
                                              ? 'CANCELLED'
                                              : shift[
                                                  employee?.id +
                                                    '<<==>>' +
                                                    moment(e).format(
                                                      'DD/MM/YYYY',
                                                    )
                                                ]?.split('<==>')[5] ??
                                                tempdatearray[ind]
                                            : tempdatearray[ind],
                                          shift[
                                            employee?.id +
                                              '<<==>>' +
                                              moment(e).format('DD/MM/YYYY')
                                          ]?.split('<==>')[1] != 'null'
                                            ? shift[
                                                employee?.id +
                                                  '<<==>>' +
                                                  moment(e).format('DD/MM/YYYY')
                                              ]?.split('<==>')[1] == 'CANCEL'
                                              ? 'CANCELLED'
                                              : shift[
                                                  employee?.id +
                                                    '<<==>>' +
                                                    moment(e).format(
                                                      'DD/MM/YYYY',
                                                    )
                                                ]?.split('<==>')[1] ?? null
                                            : null,
                                          'LOGOUT_MODIFY',
                                        )
                                      ) ||
                                      tempdatearray[ind] >
                                        new Date().setDate(
                                          new Date().getDate() +
                                            (rosterSettings?.advanceRoaster
                                              ? Number(
                                                  rosterSettings?.advanceRoaster,
                                                )
                                              : 60),
                                        )
                                    ? '#f2f2f2'
                                    : shift[
                                        employee?.id +
                                          '<<==>>' +
                                          moment(e).format('DD/MM/YYYY')
                                      ]?.split('<==>')[4] == 'YES'
                                    ? '#e0eeff'
                                    : '',
                                }}
                              >
                                <div>
                                  <div style={{marginTop: '0.5rem'}}>
                                    <form>
                                      <div>
                                        {rosterSettings?.allowManagerApproval
                                          ?.toUpperCase()
                                          ?.trim() == 'YES' &&
                                        pendingRosterData[
                                          employee?.id +
                                            '<<==>>' +
                                            moment(tempdatearray[ind]).format(
                                              'DD/MM/YYYY',
                                            )
                                        ] ? (
                                          <Tooltip
                                            title={
                                              <ul
                                                style={{
                                                  listStyleType: 'circle',
                                                  paddingLeft: '10px',
                                                }}
                                              >
                                                <li>
                                                  Login:{' '}
                                                  {
                                                    pendingRosterData[
                                                      employee?.id +
                                                        '<<==>>' +
                                                        moment(
                                                          tempdatearray[ind],
                                                        ).format('DD/MM/YYYY')
                                                    ]?.split('<<==>>')[0]
                                                  }
                                                </li>
                                                <li>
                                                  Logout:{' '}
                                                  {
                                                    pendingRosterData[
                                                      employee?.id +
                                                        '<<==>>' +
                                                        moment(
                                                          tempdatearray[ind],
                                                        ).format('DD/MM/YYYY')
                                                    ]?.split('<<==>>')[1]
                                                  }
                                                </li>
                                              </ul>
                                            }
                                            placement='bottom'
                                          >
                                            <AccessTimeIcon
                                              onClick={() => {
                                                setopenPending(true);
                                                setpendingId(
                                                  window.btoa(
                                                    pendingRosterData[
                                                      employee?.id +
                                                        '<<==>>' +
                                                        moment(
                                                          tempdatearray[ind],
                                                        ).format('DD/MM/YYYY')
                                                    ]?.split('<<==>>')[2],
                                                  ),
                                                );
                                              }}
                                              className='cursor'
                                              sx={{
                                                stroke: '#098cfc',
                                                strokeWidth: 1,
                                                position: 'absolute',
                                                fontSize: '17px',
                                                right: '8px',
                                                top: '8px',
                                              }}
                                            />
                                          </Tooltip>
                                        ) : null}
                                        <div
                                          style={{
                                            display: 'flex',
                                            position: 'relative',
                                          }}
                                          className='cursor'
                                          onClick={() => {
                                            let tem_bool = compareTime(
                                              tempdatearray[ind],
                                              shift[
                                                employee?.id +
                                                  '<<==>>' +
                                                  moment(e).format('DD/MM/YYYY')
                                              ]?.split('<==>')[0] != 'null'
                                                ? shift[
                                                    employee?.id +
                                                      '<<==>>' +
                                                      moment(e).format(
                                                        'DD/MM/YYYY',
                                                      )
                                                  ]?.split('<==>')[0] ==
                                                  'CANCEL'
                                                  ? 'CANCELLED'
                                                  : shift[
                                                      employee?.id +
                                                        '<<==>>' +
                                                        moment(e).format(
                                                          'DD/MM/YYYY',
                                                        )
                                                    ]?.split('<==>')[0] ?? null
                                                : null,
                                              'LOGIN_MODIFY',
                                            );
                                            if (!tem_bool) {
                                              return;
                                            }
                                            if (
                                              rosterSettings?.managerManageEmpRoaster
                                                ?.toUpperCase()
                                                ?.trim() != 'YES'
                                            )
                                              return;
                                            // if (rosterSettings?.allowDailyChanges?.toUpperCase()?.trim() != "YES") return;
                                            if (
                                              tempdatearray[ind] >
                                              new Date().setDate(
                                                new Date().getDate() +
                                                  (rosterSettings?.advanceRoaster
                                                    ? Number(
                                                        rosterSettings?.advanceRoaster,
                                                      )
                                                    : 60),
                                              )
                                            ) {
                                              return;
                                            }
                                            // if(rosterSettings?.loginModifyCutoffTimeinMinutes){}
                                            if (
                                              shift[
                                                employee?.id +
                                                  '<<==>>' +
                                                  moment(e).format('DD/MM/YYYY')
                                              ]?.split('<==>')[0] == 'CANCEL'
                                            ) {
                                              return;
                                            }
                                            // if (tempdatearray[ind] < new Date().setHours(0, 0, 0, 0)) { return; }
                                            let temEmp = [];
                                            if (
                                              temEmp?.includes(employee?.id)
                                            ) {
                                              // temEmp.splice(temEmp.indexOf(employee?.id), 1);
                                            } else {
                                              temEmp.push(employee?.id);
                                            }
                                            setSelectedEmployee([...temEmp]);

                                            let temDate = [];
                                            if (
                                              temDate?.includes(
                                                moment(e).format('DD/MM/YYYY'),
                                              )
                                            ) {
                                              // temDate.splice(temDate.indexOf(moment(e).format("DD/MM/YYYY")), 1);
                                            } else {
                                              temDate.push(
                                                moment(e).format('DD/MM/YYYY'),
                                              );
                                            }
                                            setselectedDate([...temDate]);
                                            setSelectedLoginShift(
                                              shift[
                                                employee?.id +
                                                  '<<==>>' +
                                                  moment(e).format('DD/MM/YYYY')
                                              ]?.split('<==>')[2],
                                            );
                                            setSelectedLogoutShift(
                                              shift[
                                                employee?.id +
                                                  '<<==>>' +
                                                  moment(e).format('DD/MM/YYYY')
                                              ]?.split('<==>')[3],
                                            );
                                            setShiftFor('LOGIN'),
                                              setOpenDial(true);
                                          }}
                                          disabled={true}
                                        >
                                          <span
                                            style={{
                                              margin: '5px 5px 0px 0px',
                                              fontWeight: '',
                                            }}
                                          >
                                            <img src='/assets/images/login_icon.png' />
                                          </span>
                                          <span
                                            style={{
                                              padding: '14px 0px 0px 5px',
                                              fontSize: '15px',
                                              color:
                                                shift[
                                                  employee?.id +
                                                    '<<==>>' +
                                                    moment(e).format(
                                                      'DD/MM/YYYY',
                                                    )
                                                ]?.split('<==>')[0] == 'CANCEL'
                                                  ? '#f03e3e'
                                                  : '',
                                              fontWeight:
                                                shift[
                                                  employee?.id +
                                                    '<<==>>' +
                                                    moment(e).format(
                                                      'DD/MM/YYYY',
                                                    )
                                                ]?.split('<==>')[0] == 'CANCEL'
                                                  ? 'bold'
                                                  : '',
                                            }}
                                            id={
                                              moment(e).format('DD/MM/YYYY') +
                                              employee?.id +
                                              'Login'
                                            }
                                          >
                                            {shift[
                                              employee?.id +
                                                '<<==>>' +
                                                moment(e).format('DD/MM/YYYY')
                                            ]?.split('<==>')[0] != 'null'
                                              ? shift[
                                                  employee?.id +
                                                    '<<==>>' +
                                                    moment(e).format(
                                                      'DD/MM/YYYY',
                                                    )
                                                ]?.split('<==>')[0] == 'CANCEL'
                                                ? 'CANCELLED'
                                                : shift[
                                                    employee?.id +
                                                      '<<==>>' +
                                                      moment(e).format(
                                                        'DD/MM/YYYY',
                                                      )
                                                  ]?.split('<==>')[0] ?? 'OFF'
                                              : 'OFF'}
                                          </span>
                                          {rosterSettings?.allowManagerCancel
                                            ?.toUpperCase()
                                            ?.trim() == 'YES' &&
                                            compareTime(
                                              tempdatearray[ind],
                                              shift[
                                                employee?.id +
                                                  '<<==>>' +
                                                  moment(e).format('DD/MM/YYYY')
                                              ]?.split('<==>')[0] != 'null'
                                                ? shift[
                                                    employee?.id +
                                                      '<<==>>' +
                                                      moment(e).format(
                                                        'DD/MM/YYYY',
                                                      )
                                                  ]?.split('<==>')[0] ==
                                                  'CANCEL'
                                                  ? 'CANCELLED'
                                                  : shift[
                                                      employee?.id +
                                                        '<<==>>' +
                                                        moment(e).format(
                                                          'DD/MM/YYYY',
                                                        )
                                                    ]?.split('<==>')[0] ?? null
                                                : null,
                                              'LOGIN_CANCEL',
                                            ) &&
                                            shift[
                                              employee?.id +
                                                '<<==>>' +
                                                moment(e).format('DD/MM/YYYY')
                                            ]?.split('<==>')[0] != 'CANCEL' && (
                                              <span>
                                                <CancelIcon
                                                  style={{
                                                    position: 'absolute',
                                                    right: '0',
                                                    top: '15px',
                                                    fontSize: '18px',
                                                    color: '#e23535',
                                                  }}
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenCnf(true);
                                                    setMyCnfTempData({
                                                      date: tempdatearray[ind],
                                                      empid: employee?.id,
                                                      login: 'CANCEL',
                                                      logout:
                                                        shift[
                                                          employee?.id +
                                                            '<<==>>' +
                                                            moment(
                                                              tempdatearray[
                                                                ind
                                                              ],
                                                            ).format(
                                                              'DD/MM/YYYY',
                                                            )
                                                        ]?.split('<==>')[3],
                                                    });
                                                  }}
                                                />
                                              </span>
                                            )}
                                        </div>
                                        <div
                                          style={{
                                            display: 'flex',
                                            position: 'relative',
                                          }}
                                          className='cursor'
                                          onClick={() => {
                                            let tem_bool = compareTime(
                                              shift[
                                                employee?.id +
                                                  '<<==>>' +
                                                  moment(e).format('DD/MM/YYYY')
                                              ]?.split('<==>')[5] != 'null'
                                                ? shift[
                                                    employee?.id +
                                                      '<<==>>' +
                                                      moment(e).format(
                                                        'DD/MM/YYYY',
                                                      )
                                                  ]?.split('<==>')[5] ==
                                                  'CANCEL'
                                                  ? 'CANCELLED'
                                                  : shift[
                                                      employee?.id +
                                                        '<<==>>' +
                                                        moment(e).format(
                                                          'DD/MM/YYYY',
                                                        )
                                                    ]?.split('<==>')[5] ??
                                                    tempdatearray[ind]
                                                : tempdatearray[ind],
                                              shift[
                                                employee?.id +
                                                  '<<==>>' +
                                                  moment(e).format('DD/MM/YYYY')
                                              ]?.split('<==>')[1] != 'null'
                                                ? shift[
                                                    employee?.id +
                                                      '<<==>>' +
                                                      moment(e).format(
                                                        'DD/MM/YYYY',
                                                      )
                                                  ]?.split('<==>')[1] ==
                                                  'CANCEL'
                                                  ? 'CANCELLED'
                                                  : shift[
                                                      employee?.id +
                                                        '<<==>>' +
                                                        moment(e).format(
                                                          'DD/MM/YYYY',
                                                        )
                                                    ]?.split('<==>')[1] ?? null
                                                : null,
                                              'LOGOUT_MODIFY',
                                            );
                                            if (!tem_bool) {
                                              return;
                                            }
                                            if (
                                              rosterSettings?.managerManageEmpRoaster
                                                ?.toUpperCase()
                                                ?.trim() != 'YES'
                                            )
                                              return;
                                            // if (rosterSettings?.allowDailyChanges?.toUpperCase()?.trim() != "YES") return;
                                            if (
                                              tempdatearray[ind] >
                                              new Date().setDate(
                                                new Date().getDate() +
                                                  (rosterSettings?.advanceRoaster
                                                    ? Number(
                                                        rosterSettings?.advanceRoaster,
                                                      )
                                                    : 60),
                                              )
                                            ) {
                                              return;
                                            }
                                            if (
                                              shift[
                                                employee?.id +
                                                  '<<==>>' +
                                                  moment(e).format('DD/MM/YYYY')
                                              ]?.split('<==>')[1] == 'CANCEL'
                                            ) {
                                              return;
                                            }
                                            // if (tempdatearray[ind] < new Date()) { return; }
                                            // let temEmp = selectedEmployee;
                                            // if (temEmp?.includes(employee?.id)) {
                                            //     // temEmp.splice(temEmp.indexOf(employee?.id), 1);
                                            // } else {
                                            //     temEmp.push(employee?.id);
                                            // }
                                            // setSelectedEmployee([...temEmp]);
                                            let temEmp = [];
                                            if (
                                              temEmp?.includes(employee?.id)
                                            ) {
                                              // temEmp.splice(temEmp.indexOf(employee?.id), 1);
                                            } else {
                                              temEmp.push(employee?.id);
                                            }
                                            setSelectedEmployee([...temEmp]);
                                            let temDate = [];
                                            if (
                                              temDate?.includes(
                                                moment(e).format('DD/MM/YYYY'),
                                              )
                                            ) {
                                              // temDate.splice(temDate.indexOf(moment(e).format("DD/MM/YYYY")), 1);
                                            } else {
                                              temDate.push(
                                                moment(e).format('DD/MM/YYYY'),
                                              );
                                            }
                                            setselectedDate([...temDate]);
                                            setSelectedLoginShift(
                                              shift[
                                                employee?.id +
                                                  '<<==>>' +
                                                  moment(e).format('DD/MM/YYYY')
                                              ]?.split('<==>')[2],
                                            );
                                            setSelectedLogoutShift(
                                              shift[
                                                employee?.id +
                                                  '<<==>>' +
                                                  moment(e).format('DD/MM/YYYY')
                                              ]?.split('<==>')[3],
                                            );

                                            setShiftFor('LOGOUT'),
                                              setOpenDial(true);
                                          }}
                                          disabled={true}
                                        >
                                          <span
                                            style={{
                                              margin: '5px 5px 0px 0px',
                                              fontWeight: '',
                                            }}
                                          >
                                            <img src='/assets/images/logout_icon.png' />
                                            {shift[
                                              employee?.id +
                                                '<<==>>' +
                                                moment(e).format('DD/MM/YYYY')
                                            ]?.split('<==>')[5] &&
                                            shift[
                                              employee?.id +
                                                '<<==>>' +
                                                moment(e).format('DD/MM/YYYY')
                                            ]?.split('<==>')[5] != 'null' &&
                                            shift[
                                              employee?.id +
                                                '<<==>>' +
                                                moment(e).format('DD/MM/YYYY')
                                            ]?.split('<==>')[5] !=
                                              moment(e).format('YYYY-MM-DD') ? (
                                              <img
                                                style={{
                                                  position: 'absolute',
                                                  top: '20px',
                                                  left: '-8px',
                                                  width: '18px',
                                                  height: '18px',
                                                }}
                                                src='/assets/images/aa.png'
                                              />
                                            ) : null}
                                          </span>
                                          <span
                                            style={{
                                              padding: '14px 0px 0px 5px',
                                              fontSize: '15px',
                                              color:
                                                shift[
                                                  employee?.id +
                                                    '<<==>>' +
                                                    moment(e).format(
                                                      'DD/MM/YYYY',
                                                    )
                                                ]?.split('<==>')[1] == 'CANCEL'
                                                  ? '#f03e3e'
                                                  : '',
                                              fontWeight:
                                                shift[
                                                  employee?.id +
                                                    '<<==>>' +
                                                    moment(e).format(
                                                      'DD/MM/YYYY',
                                                    )
                                                ]?.split('<==>')[1] == 'CANCEL'
                                                  ? 'bold'
                                                  : '',
                                            }}
                                            id={
                                              moment(e).format('DD/MM/YYYY') +
                                              employee?.id +
                                              'Logout'
                                            }
                                          >
                                            {shift[
                                              employee?.id +
                                                '<<==>>' +
                                                moment(e).format('DD/MM/YYYY')
                                            ]?.split('<==>')[1] != 'null'
                                              ? shift[
                                                  employee?.id +
                                                    '<<==>>' +
                                                    moment(e).format(
                                                      'DD/MM/YYYY',
                                                    )
                                                ]?.split('<==>')[1] == 'CANCEL'
                                                ? 'CANCELLED'
                                                : shift[
                                                    employee?.id +
                                                      '<<==>>' +
                                                      moment(e).format(
                                                        'DD/MM/YYYY',
                                                      )
                                                  ]?.split('<==>')[1] ?? 'OFF'
                                              : 'OFF'}
                                          </span>
                                          {rosterSettings?.allowManagerCancel
                                            ?.toUpperCase()
                                            ?.trim() == 'YES' &&
                                            compareTime(
                                              shift[
                                                employee?.id +
                                                  '<<==>>' +
                                                  moment(e).format('DD/MM/YYYY')
                                              ]?.split('<==>')[5] != 'null'
                                                ? shift[
                                                    employee?.id +
                                                      '<<==>>' +
                                                      moment(e).format(
                                                        'DD/MM/YYYY',
                                                      )
                                                  ]?.split('<==>')[5] ==
                                                  'CANCEL'
                                                  ? 'CANCELLED'
                                                  : shift[
                                                      employee?.id +
                                                        '<<==>>' +
                                                        moment(e).format(
                                                          'DD/MM/YYYY',
                                                        )
                                                    ]?.split('<==>')[5] ??
                                                    tempdatearray[ind]
                                                : tempdatearray[ind],
                                              shift[
                                                employee?.id +
                                                  '<<==>>' +
                                                  moment(e).format('DD/MM/YYYY')
                                              ]?.split('<==>')[1] != 'null'
                                                ? shift[
                                                    employee?.id +
                                                      '<<==>>' +
                                                      moment(e).format(
                                                        'DD/MM/YYYY',
                                                      )
                                                  ]?.split('<==>')[1] ==
                                                  'CANCEL'
                                                  ? 'CANCELLED'
                                                  : shift[
                                                      employee?.id +
                                                        '<<==>>' +
                                                        moment(e).format(
                                                          'DD/MM/YYYY',
                                                        )
                                                    ]?.split('<==>')[1] ?? null
                                                : null,
                                              'LOGOUT_CANCEL',
                                            ) &&
                                            shift[
                                              employee?.id +
                                                '<<==>>' +
                                                moment(e).format('DD/MM/YYYY')
                                            ]?.split('<==>')[1] != 'CANCEL' && (
                                              <span>
                                                <CancelIcon
                                                  style={{
                                                    position: 'absolute',
                                                    right: '0',
                                                    top: '15px',
                                                    fontSize: '18px',
                                                    color: '#e23535',
                                                  }}
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenCnf(true);
                                                    setMyCnfTempData({
                                                      date: tempdatearray[ind],
                                                      empid: employee?.id,
                                                      login:
                                                        shift[
                                                          employee?.id +
                                                            '<<==>>' +
                                                            moment(
                                                              tempdatearray[
                                                                ind
                                                              ],
                                                            ).format(
                                                              'DD/MM/YYYY',
                                                            )
                                                        ]?.split('<==>')[2],
                                                      logout: 'CANCEL',
                                                    });
                                                  }}
                                                />
                                              </span>
                                            )}
                                        </div>
                                      </div>
                                    </form>
                                  </div>
                                </div>
                              </TableCell>
                            );
                          })}
                      </TableRow>
                    </>
                  );
                })
              : null}
          </TableBody>
        </Table>
      </TableContainer>
      <Confirm
        cnfMsg={'Do you really want to cancel?'}
        open={openCnf}
        header={'Cancel Roster'}
        handleClose={handleConfBox}
      />
      {openDial && (
        <Dial
          selectedDate={selectedDate}
          selectedEmployee={selectedEmployee}
          openDialFun={openDialFun}
          employee={employee}
          rosterSettings={rosterSettings}
          selectedLogoutShift={selectedLogoutShift}
          selectedLoginShift={selectedLoginShift}
          realdeptname={realdeptname}
          weekoffs={[]}
          deptname={deptname}
          tempdatearray={tempdatearray}
          shiftFor={shiftFor}
        />
      )}
      {openPending ? (
        <Dialog
          fullWidth={true}
          maxWidth={'1sm'}
          open={openPending}
          onClose={() => {
            setopenPending(false);
          }}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle id='alert-dialog-title' style={{background: '#f5f2f2'}}>
            {/* {header} */}
            <h1>Pending Requests</h1>
            <div style={{position: 'absolute', top: '12px', right: '15px'}}>
              <span>
                <CloseIcon
                  style={{cursor: 'pointer'}}
                  onClick={() => {
                    setopenPending(false);
                  }}
                />
              </span>
            </div>
          </DialogTitle>
          <DialogContent style={{marginTop: '10px'}}>
            <AllPendings
              id={pendingId}
              handleFun={() => {
                setopenPending(false);
                fetchPendingRoster();
                fetchAllData();
              }}
            />
          </DialogContent>
        </Dialog>
      ) : null}
    </>
  );
};
export default CreateRoster;
