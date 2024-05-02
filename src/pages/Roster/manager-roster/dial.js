import Api from '@api';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {Close} from '@mui/icons-material';
import {Dialog, DialogContent, DialogTitle, Typography} from '@mui/material';
import SmartForm from '@smart-form';
import axios from 'axios';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import AppLoader from '@crema/core/AppLoader';
const Dial = ({
  rosterSettings,
  selectedEmployee,
  selectedDate,
  openDialFun,
  employee,
  weekoffs,
  deptname,
  shiftFor,
  realdeptname,
  selectedLoginShift,
  selectedLogoutShift,
  tempdatearray,
}) => {
  const [showbtn, setShowbtn] = React.useState(true);
  const [open, setOpen] = React.useState(true);
  const [shiftList, setShiftList] = React.useState([]);
  const [MyData, setMyData] = React.useState();
  const [empList, setEmpList] = React.useState([]);
  const [selectedEmp, setselectedEmp] = React.useState([]);
  const [loginShiftList, setLoginShiftList] = React.useState([]);
  const [logoutShiftList, setLogoutShiftList] = React.useState([]);
  const [ErrorMsg, setErrorMsg] = React.useState([]);
  const [FormData, setFormData] = React.useState({
    fromdate: moment(
      new Date(new Date().setDate(new Date().getDate() + 1)),
    ).format('YYYY-MM-DD'),
    todate: moment(
      new Date(new Date().setDate(new Date().getDate() + 7)),
    ).format('YYYY-MM-DD'),
  });
  const {user} = useAuthUser();
  const employeeId = user?.userList?.profileId;
  const corporateId = user?.userList?.corporateId;
  const [selDate, setSelDate] = useState();
  const [HolidayArr, setHolidayArr] = React.useState([]);
  function myGetData(d) {
    if (FormData?.fromdate != d?.fromdate || FormData?.todate != d?.todate) {
      if (d?.fromdate == undefined || d?.todate == undefined) {
        return;
      }
      getHolidays(d?.fromdate, d?.todate);
      setFormData({fromdate: d?.fromdate, todate: d?.todate});
    }
  }
  useEffect(() => {
    let temfrom = moment(
      new Date(new Date().setDate(new Date().getDate() + 1)),
    ).format('YYYY-MM-DD');
    let temto = moment(
      new Date(new Date().setDate(new Date().getDate() + 7)),
    ).format('YYYY-MM-DD');
    if (!selectedDate?.length) {
      getHolidays(temfrom, temto);
    } else {
      getHolidays('NA', 'NA');
    }
  }, []);
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
  useEffect(() => {
    if (!selectedDate?.length) return;
    let temArr = [];
    selectedDate?.map((e) => {
      temArr.push(
        moment(new Date(e?.split('/')?.reverse()?.join('-'))).format('MMM DD'),
      );
    });
    setSelDate(temArr)?.sort();
  }, []);
  const weeks = [
    {title: 'Sunday', value: 'SUN'},
    {title: 'Monday', value: 'MON'},
    {title: 'Tuesday', value: 'TUE'},
    {title: 'Wednesday', value: 'WED'},
    {title: 'Thursday', value: 'THU'},
    {title: 'Friday', value: 'FRI'},
    {title: 'Saturday', value: 'SAT'},
  ];
  useEffect(() => {
    axios
      .get(Api?.employee?.list + '/' + employeeId)
      .then((res) => {
        setMyData(res?.data?.data);
      })
      .catch((err) => {});
  }, [employeeId]);
  useEffect(() => {
    let tem = [];
    let temsel = [];
    if (employee?.length) {
      employee?.map((em) => {
        // if (selectedEmployee?.includes(em?.id)) { temsel.push({ title: em?.employeeCode + " - " + em?.employeeFullName, value: em?.id }) }
        tem.push({
          title: em?.employeeCode + ' - ' + em?.employeeFullName,
          value: em?.id,
        });
        if (!selectedEmployee?.length) {
          temsel.push(em?.id);
        }
      });
    }
    setEmpList(tem);
    setselectedEmp(temsel);
  }, [employee]);
  useEffect(() => {
    if (deptname && deptname?.length) {
      const baseURL = `${Api.manageshifts.list}/${
        user?.userList?.userRole == 'CORPORATEADMIN'
          ? user?.userList?.profileId
          : corporateId
      }/corporateid/${deptname}/departmentid`;
      axios
        .get(`${baseURL}`)
        .then((response) => {
          let temp = [];
          let logintemp = [{title: 'OFF', value: 'OFF'}];
          let logouttemp = [{title: 'OFF', value: 'OFF'}];
          if (response?.data?.data?.length) {
            response?.data?.data?.map((e) => {
              temp.push({
                title: e.shiftName,
                value: e.id,
                value2: {
                  id: e.id,
                  login: e.shiftStart,
                  logout: e.shiftEnd,
                  name: e.shiftName,
                },
              });
              logintemp.push({title: e.shiftStart, value: e.id});
              logouttemp.push({title: e.shiftEnd, value: e.id});
            });
            setShiftList(temp);
            setLoginShiftList(logintemp);
            setLogoutShiftList(logouttemp);
          }
        })
        .catch((err) => {});
    }
  }, [corporateId, deptname]);
  let template = {
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
            type: 'multiSelect',
            name: 'employees',
            id: 'employees',
            title: 'Employees',
            defaultValue: selectedEmployee,
            disabled: shiftFor != 'BOTH',
            max: 3,
            multiple: true,
            options: empList ?? [],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'section',
            layout: {column: 1, spacing: 2, size: 'medium', label: 'fixed'},
            fields: !selectedDate?.length
              ? []
              : [
                  {
                    type: 'text',
                    name: 'selectedDate',
                    id: 'selectedDate',
                    title: 'Dates',
                    defaultValue: selectedDate?.join(', '),
                    disabled: true,
                    // validationProps: {
                    //     required: 'This is a mandatory field'
                    // }
                  },
                ],
          },
          {
            type: 'section',
            layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
            fields: selectedDate?.length
              ? []
              : [
                  {
                    type: 'date',
                    name: 'fromdate',
                    id: 'fromdate',
                    defaultValue:
                      tempdatearray[0] > new Date()
                        ? tempdatearray[0]
                        : new Date().setDate(new Date().getDate() + 1),
                    // defaultValue: tempdatearray[0],
                    minmax: 'custom',
                    minCustomDate: new Date().setDate(new Date().getDate() + 1),
                    maxCustomDate: new Date().setDate(
                      new Date().getDate() +
                        (rosterSettings?.advanceRoaster
                          ? Number(rosterSettings?.advanceRoaster)
                          : 60),
                    ),
                    // maxCustomDate: new Date().setDate( new Date().getDate() + 60),
                    title: 'From Date',
                    validationProps: {
                      required: 'This is a mandatory field',
                      validate: [
                        {
                          condition: 'fromdate <= todate',
                          message:
                            'From date should not be greater than till date.',
                        },
                      ],
                    },
                  },
                  {
                    type: 'date',
                    name: 'todate',
                    id: 'todate',
                    defaultValue:
                      tempdatearray[6] > new Date()
                        ? tempdatearray[6] >
                          new Date().setDate(
                            new Date().getDate() +
                              (rosterSettings?.advanceRoaster
                                ? Number(rosterSettings?.advanceRoaster)
                                : 0),
                          )
                          ? new Date().setDate(
                              new Date().getDate() +
                                (rosterSettings?.advanceRoaster
                                  ? Number(rosterSettings?.advanceRoaster)
                                  : 7),
                            )
                          : tempdatearray[6]
                        : new Date().setDate(new Date().getDate() + 7),
                    // defaultValue: tempdatearray[6] > new Date() ? tempdatearray[6] : new Date().setDate( new Date().getDate() + 7),
                    // defaultValue: tempdatearray[6],
                    minmax: 'custom',
                    minCustomDate: new Date().setDate(new Date().getDate() + 1),
                    maxCustomDate: new Date().setDate(
                      new Date().getDate() +
                        (rosterSettings?.advanceRoaster
                          ? Number(rosterSettings?.advanceRoaster)
                          : 60),
                    ),
                    // maxCustomDate: new Date().setDate( new Date().getDate() + 60),
                    title: 'Till Date',
                    validationProps: {
                      required: 'This is a mandatory field',
                      validate: [
                        {
                          condition: 'fromdate <= todate',
                          message:
                            'From date should not be greater than till date.',
                        },
                      ],
                    },
                  },
                ],
          },

          {
            type: 'section',
            layout: {column: 1, spacing: 2, size: 'medium', label: 'fixed'},
            fields:
              shiftFor != 'BOTH'
                ? []
                : [
                    {
                      type: 'multiSelect',
                      name: 'weekoffs',
                      id: 'weekoffs',
                      title: 'Weekoffs',
                      options: weeks,
                      defaultValue: weekoffs,
                      validationProps: {
                        required: 'This is a mandatory field',
                      },
                    },
                  ],
          },
          {
            type: 'section',
            layout: {column: 1, spacing: 2, size: 'medium', label: 'fixed'},
            fields:
              shiftFor != 'BOTH'
                ? []
                : [
                    {
                      type: 'multiSelect',
                      name: 'holidays',
                      id: 'holidays',
                      title: 'Holidays',
                      disabled: !HolidayArr?.length,
                      options: HolidayArr ?? [],
                    },
                  ],
          },
          // {
          //     type: "section",
          //     layout: { column: 1, spacing: 2, size: 'medium', label: 'fixed' },
          //     fields: (shiftFor != "BOTH") ? [] : [
          //         {
          //             type: 'select',
          //             name: 'shift',
          //             id: 'shift',
          //             title: "Shift",
          //             options: shiftList ?? [],
          //             validationProps: {
          //                 required: 'This is a mandatory field'
          //             }
          //         },
          //     ]
          // },
          {
            type: 'section',
            layout: {
              column: shiftFor == 'BOTH' ? 2 : 1,
              spacing: 2,
              size: 'medium',
              label: 'fixed',
            },
            fields:
              shiftFor == 'BOTH'
                ? [
                    {
                      type: 'select',
                      name: 'loginshift',
                      id: 'loginshift',
                      title: 'Login Shift',
                      defaultValue: 'OFF',
                      options: loginShiftList ?? [],
                      validationProps: {
                        required: 'This is a mandatory field',
                      },
                    },
                    {
                      type: 'select',
                      name: 'logoutshift',
                      id: 'logoutshift',
                      defaultValue: 'OFF',
                      title: 'Logout Shift',
                      options: logoutShiftList ?? [],
                      validationProps: {
                        required: 'This is a mandatory field',
                      },
                    },
                  ]
                : shiftFor == 'LOGIN'
                ? [
                    {
                      type: 'select',
                      name: 'loginshift',
                      id: 'loginshift',
                      defaultValue: 'OFF',
                      title: 'Login Shift',
                      options: loginShiftList ?? [],
                      validationProps: {
                        required: 'This is a mandatory field',
                      },
                    },
                  ]
                : [
                    {
                      type: 'select',
                      name: 'logoutshift',
                      defaultValue: 'OFF',
                      id: 'logoutshift',
                      title: 'Logout Shift',
                      options: logoutShiftList ?? [],
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
  function handleSubmit(val) {
    setShowbtn(false);
    let dateee = [];
    if (!selectedDate?.length) {
      var daylist = getDaysArray(
        new Date(val?.data?.fromdate),
        new Date(val?.data?.todate),
      );
      daylist?.map((da) => {
        let inTime;
        let outTime;
        loginShiftList?.map((lt) => {
          if (lt?.value == val?.data?.loginshift) {
            inTime = lt?.title;
          }
        });
        logoutShiftList?.map((lt) => {
          if (lt?.value == val?.data?.logoutshift) {
            outTime = lt?.title;
          }
        });
        let temCheck1 = compareTime(da, inTime, 'LOGIN_MODIFY');
        let temCheck2 = compareTime(da, outTime, 'LOGOUT_MODIFY');
        if (
          (shiftFor == 'BOTH' && temCheck1 && temCheck2) ||
          (shiftFor != 'BOTH' && (temCheck1 || temCheck2))
        ) {
          let myweekoffs =
            typeof val?.data?.weekoffs == 'string'
              ? val?.data?.weekoffs?.split(',')
              : val?.data?.weekoffs;
          if (myweekoffs?.includes(weeks[da?.getDay()]?.value)) {
            dateee.push({
              date: moment(da).format('YYYY-MM-DD'),
              weekOff: shiftFor == 'BOTH' ? 'YES' : 'NO',
            });
          } else {
            dateee.push({
              date: moment(da).format('YYYY-MM-DD'),
              weekOff: 'NO',
            });
          }
        } else {
          if (!ErrorMsg?.includes(moment(da).format('DD-MM-YYYY'))) {
            let arr = ErrorMsg;
            arr.push(moment(da).format('DD-MM-YYYY'));
            setErrorMsg(arr);
          }
        }
      });
    } else {
      selectedDate?.map((se) => {
        let inTime;
        let outTime;
        loginShiftList?.map((lt) => {
          if (lt?.value == val?.data?.loginshift) {
            inTime = lt?.title;
          }
        });
        logoutShiftList?.map((lt) => {
          if (lt?.value == val?.data?.logoutshift) {
            outTime = lt?.title;
          }
        });
        let temCheck1 = compareTime(
          new Date(se?.split('/')?.reverse()?.join('-')),
          inTime,
          'LOGIN_MODIFY',
        );
        let temCheck2 = compareTime(
          new Date(se?.split('/')?.reverse()?.join('-')),
          outTime,
          'LOGOUT_MODIFY',
        );
        if (
          (shiftFor == 'BOTH' && temCheck1 && temCheck2) ||
          (shiftFor != 'BOTH' && (temCheck1 || temCheck2))
        ) {
          let myweekoffs =
            typeof val?.data?.weekoffs == 'string'
              ? val?.data?.weekoffs?.split(',')
              : val?.data?.weekoffs ?? [];
          if (
            myweekoffs?.includes(
              weeks[new Date(se?.split('/')?.reverse()?.join('-'))?.getDay()]
                ?.value,
            )
          ) {
            dateee.push({
              date: se?.split('/')?.reverse()?.join('-'),
              weekOff: shiftFor == 'BOTH' ? 'YES' : 'NO',
            });
          } else {
            dateee.push({
              date: se?.split('/')?.reverse()?.join('-'),
              weekOff: 'NO',
            });
          }
        } else {
          if (!ErrorMsg?.includes(se)) {
            let arr = ErrorMsg;
            arr.push(se);
            setErrorMsg(arr);
          }
        }
        // dateee.push({date: se?.split("/")?.reverse()?.join('-'), weekOff: "YES"})
      });
    }
    let postdata = {
      tanentId: MyData?.tanentId,
      tanentName: MyData?.tanentName,
      corporateId: MyData.corporateId,
      corporateName: MyData?.companyName,
      officeId: MyData?.officeId,
      officeName: MyData?.officeName,
      departmentId: realdeptname?.value,
      departmentName: realdeptname?.title,
      loginShiftId:
        val?.data?.loginshift != 'null' ? val?.data?.loginshift : null,
      logoutShiftId:
        val?.data?.logoutshift != 'null' ? val?.data?.logoutshift : null,
      dates: dateee,
      employeeIds:
        typeof val?.data?.employees == 'string'
          ? val?.data?.employees?.split(',')
          : val?.data?.employees,
    };
    if (ErrorMsg?.length) {
      toast.error('Time exceeds for: ' + ErrorMsg?.join());
    }
    if (!dateee?.length) {
      setOpen(false);
      openDialFun(false);
      return;
    }
    axios
      .post(Api?.roaster?.roasterCreation, postdata)
      .then((res) => {
        setShowbtn(true);
        if (res?.data?.status == '200') {
          if (val?.data?.holidays?.length) {
            postHolidayDate(val?.data?.holidays, val?.data?.employees);
          } else {
            toast.success(res?.data?.message ?? 'Success');
            setOpen(false);
            openDialFun(false);
          }
        } else {
          toast.error(res?.data?.message ?? 'Something went wrong');
        }
      })
      .catch((err) => {
        setShowbtn(true);
        toast.error(err?.message ?? 'Something went wrong');
      });
  }

  function postHolidayDate(hol, myemp) {
    let dateee = [];
    hol?.map((se) => {
      dateee.push({
        date: se,
        weekOff: 'NO',
      });
    });
    let postdata = {
      tanentId: user?.userList?.tanentId,
      tanentName: user?.userList?.tanentName,
      corporateId: user?.userList.profileId,
      corporateName: user?.userList?.userName,
      // "officeId": MyData?.officeId,
      // "officeName": MyData?.officeName,
      departmentId: realdeptname?.value,
      departmentName: realdeptname?.title,
      loginShiftId: 'OFF',
      logoutShiftId: 'OFF',
      dates: dateee,
      employeeIds: typeof myemp == 'string' ? myemp?.split(',') : myemp,
    };
    axios
      .post(Api?.roaster?.roasterCreation, postdata)
      .then((res) => {
        if (res?.data?.status == '200') {
          toast.success(res?.data?.message ?? 'Success');
          setOpen(false);
          openDialFun(false);
        } else {
          toast.error(res?.data?.message ?? 'Something went wrong');
        }
      })
      .catch((err) => {
        toast.error(err?.message ?? 'Something went wrong');
      });
  }

  // function myInputFun(e){
  //     let val = e ?? {};
  //     if(val?.shift && !val?.loginshift){ val.loginshift = val?.shift }
  //     if(val?.shift && !val?.logoutshift){ val.logoutshift = val?.shift }
  //     if(val == FormData){return;}
  //     setFormData(val);
  // }
  return (
    <div>
      <Dialog
        open={open}
        PaperProps={{
          sx: {
            width: '600px',
          },
        }}
        onClose={() => {
          setOpen(false);
          openDialFun(false);
        }}
      >
        <DialogTitle style={{background: '#f5f2f2'}}>
          <h1>Schedule Roster</h1>
          <Close
            onClick={(e) => {
              setOpen(false);
              openDialFun(false);
            }}
            style={{
              position: 'absolute',
              right: '12px',
              top: '14px',
              cursor: 'pointer',
            }}
          />
        </DialogTitle>
        <DialogContent
          sx={{
            color: 'text.secondary',
            fontSize: 14,
            paddingRight: '2.8rem',
            paddingLeft: '2.8rem',
          }}
          id='alert-dialog-description'
        >
          {!showbtn ? <AppLoader /> : null}
          {(selectedEmp?.length || selectedEmployee?.length) &&
          ((selectedDate?.length && selDate?.length) ||
            !selectedDate?.length) ? (
            <SmartForm
              // getOnInput={myInputFun}
              template={template}
              onSubmit={handleSubmit}
              defaultValues={
                selDate?.length
                  ? {
                      employees: selectedEmployee?.length
                        ? selectedEmployee
                        : selectedEmp,
                      selectedDate: selDate?.join(' | '),
                      logoutshift: selectedLogoutShift,
                      loginshift: selectedLoginShift,
                    }
                  : {
                      employees: selectedEmployee?.length
                        ? selectedEmployee
                        : selectedEmp,
                      logoutshift: selectedLogoutShift,
                      loginshift: selectedLoginShift,
                    }
              }
              getOnInput={myGetData}
              // setVal={[{ name: "loginshift", value: FormData?.loginshift }, { name: "logoutshift", value: FormData?.logoutshift }]}
              onCancel={() => {
                setOpen(false);
                openDialFun(false);
              }}
              buttons={['submit', 'cancel']}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dial;
