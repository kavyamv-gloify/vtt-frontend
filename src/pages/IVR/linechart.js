import React, {useEffect, useState} from 'react';
import './style.css';
// import Chart from 'chart.js/auto';
import Api from '@api';
import {Line} from 'react-chartjs-2';
import {Chart, registerables} from 'chart.js';
import axios from 'axios';
import moment from 'moment';
Chart.register(...registerables);
var ctx = document.getElementById('myChart');
const options = {
  maintainAspectRatio: false,
  scales: {
    x: {
      stacked: true,
      grid: {
        display: true,
      },
      beginAtZero: true,
      min: 0,
    },
    y: {
      grid: {
        display: true,
      },
      beginAtZero: true,
      min: 0,
      //   stacked: true,
    },
  },
};
export default function App({dateRange}) {
  const [data, setData] = useState({
    labels: [],
    datasets: [],
  });
  useEffect(() => {
    if (!dateRange?.fromDate || !dateRange?.toDate) {
      setData({
        labels: [],
        datasets: [],
      });
      return;
    }
    if (dateRange?.fromDate == dateRange?.toDate) getByTime();
    else getByDate();
  }, [dateRange]);
  function getByDate() {
    axios
      .post(Api.baseUri + '/api/dashboard/ivr/ivrCallsDataCountByDate', {
        from: dateRange?.fromDate,
        to: dateRange?.toDate,
      })
      .then((res) => {
        let tem = {};
        let _t = res?.data?.data?.length ? res?.data?.data[0] : [];
        tem.missed = _.groupBy(_t?.count_missed, 'date');
        tem.completed = _.groupBy(_t?.count_comp, 'date');
        tem.employee = _.groupBy(_t?.count_by_etd, 'date');
        tem.driver = _.groupBy(_t?.count_by_dte, 'date');
        let dates = [];
        let tem_data = _t?.all_dates?.sort(function (a, b) {
          return new Date(a.date) - new Date(b.date);
        });
        let missed_ = [];
        let completed_ = [];
        let employee_ = [];
        let driver_ = [];
        tem_data?.map((el) => {
          dates.push(moment(el.date).format('DD-MM-YYYY'));
          missed_.push(
            tem.missed[el.date]?.length ? tem.missed[el.date][0]?.count : 0,
          );
          completed_.push(
            tem.completed[el.date]?.length
              ? tem.completed[el.date][0]?.count
              : 0,
          );
          employee_.push(
            tem.employee[el.date]?.length ? tem.employee[el.date][0]?.count : 0,
          );
          driver_.push(
            tem.driver[el.date]?.length ? tem.driver[el.date][0]?.count : 0,
          );
        });
        Chart.defaults.font.style = 'italic';
        setData({
          labels: [0, ...dates],
          datasets: [
            {
              label: 'Missed',
              data: [0, ...missed_],
              fill: true,
              backgroundColor: 'transparent',
              borderColor: 'rgba(75,192,192,1)',
            },
            {
              label: 'Completed',
              data: [0, ...completed_],
              fill: true,
              backgroundColor: 'transparent',
              borderColor: 'grey',
            },
            {
              label: 'Employee',
              data: [0, ...employee_],
              fill: true,
              backgroundColor: 'transparent',
              borderColor: '#ffa600',
            },
            {
              label: 'Driver',
              data: [0, ...driver_],
              fill: true,
              backgroundColor: 'transparent',
              borderColor: '#ff6361',
            },
          ],
        });
      })
      .catch((err) => {});
  }
  function getByTime() {
    axios
      .post(Api.baseUri + '/api/dashboard/ivr/ivrCallsDataCountForToday', {
        from: dateRange?.fromDate,
        to: dateRange?.toDate,
      })
      .then((res) => {
        let resp = res?.data?.data[0] || {};
        let dates = [
          '00:01 - 04:00',
          '04:01 - 08:00',
          '08:01 - 12:00',
          '12:01 - 16:00',
          '16:01 - 20:00',
          '20:01 - 00:00',
        ];
        let missed_ = [
          resp?.count_missed_00_04,
          resp?.count_missed_04_08,
          resp?.count_missed_08_12,
          resp?.count_missed_12_16,
          resp?.count_missed_16_20,
          resp?.count_missed_20_00,
        ];
        let completed_ = [
          resp?.count_comp_00_04,
          resp?.count_comp_04_08,
          resp?.count_comp_08_12,
          resp?.count_comp_12_16,
          resp?.count_comp_16_20,
          resp?.count_comp_20_00,
        ];
        let employee_ = [
          resp?.count_etd_00_04,
          resp?.count_etd_04_08,
          resp?.count_etd_08_12,
          resp?.count_etd_12_16,
          resp?.count_etd_16_20,
          resp?.count_etd_20_00,
        ];
        let driver_ = [
          resp?.count_dte_00_04,
          resp?.count_dte_04_08,
          resp?.count_dte_08_12,
          resp?.count_dte_12_16,
          resp?.count_dte_16_20,
          resp?.count_dte_20_00,
        ];
        Chart.defaults.font.style = 'italic';
        setData({
          labels: [0, ...dates],
          datasets: [
            {
              label: 'Missed',
              data: [0, ...missed_],
              fill: true,
              backgroundColor: 'transparent',
              borderColor: 'rgba(75,192,192,1)',
            },
            {
              label: 'Completed',
              data: [0, ...completed_],
              fill: true,
              backgroundColor: 'transparent',
              borderColor: 'grey',
            },
            {
              label: 'Employee',
              data: [0, ...employee_],
              fill: true,
              backgroundColor: 'transparent',
              borderColor: '#ffa600',
            },
            {
              label: 'Driver',
              data: [0, ...driver_],
              fill: true,
              backgroundColor: 'transparent',
              borderColor: '#ff6361',
            },
          ],
        });
      })
      .catch((err) => {});
  }
  return (
    <div className='App box2-tab1' style={{height: '400px'}}>
      <Line data={data} options={options} />
    </div>
  );
}
