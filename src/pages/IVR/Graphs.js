import React, {useEffect, useState} from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
} from 'chart.js';
import {Chart} from 'react-chartjs-2';
import {faker} from '@faker-js/faker';
import axios from 'axios';
import Api from '@api';
import {useAuthUser} from '@crema/utility/AuthHooks';
import moment from 'moment';

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
);
export const options = {
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      // text: 'Chart.js Bar Chart - Stacked',
    },
  },
  responsive: true,
  scales: {
    x: {
      grid: {
        display: false,
      },
      stacked: true,
    },
    y: {
      grid: {
        display: false,
      },
      stacked: true,
    },
  },
};

export default function App({dateRange}) {
  const {user} = useAuthUser();
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
    if (dateRange?.fromDate == dateRange?.toDate) getTimeBaseData();
    else getDateBaseData();
  }, [dateRange]);
  function getDateBaseData() {
    let _api = `${Api.baseUri}/usernotify/notification/smsDataDateWiseByCorporateId/${user?.userList?.corporateId}/${dateRange?.fromDate}/${dateRange?.toDate}`;
    axios
      .get(_api)
      .then((res) => {
        let arr = [];
        let lbls = [];
        for (const [key, value] of Object.entries(res?.data)) {
          arr.push(key);
        }
        arr = arr?.sort(function (a, b) {
          return new Date(a) - new Date(b);
        });
        let delData = [];
        let penData = [];
        let FailData = [];
        let rateData = [];
        arr.map((el) => {
          lbls.push(moment(el).format('DD-MM-YYYY'));
          delData.push(res?.data[el]?.DELIVERED || 0);
          penData.push(res?.data[el]?.PENDING || 0);
          FailData.push(res?.data[el]?.FAILED || 0);
          rateData.push(
            (res?.data[el]?.DELIVERED * 100) / res?.data[el]?.TOTAL,
          );
        });
        let myData = [
          {
            type: 'line',
            label: 'Rate',
            borderColor: '#4ac1c1', //#11234e
            borderWidth: 2,
            fill: false,
            data: rateData,
          },
          {
            type: 'bar',
            label: 'Delivered', //#128505
            borderColor: 'rgb(4 159 96)',
            backgroundColor: 'rgb(4 159 96)',
            data: delData,
            borderWidth: 2,
          },
          {
            type: 'bar',
            label: 'Undelivered', //#931310
            borderColor: '#fe6460',
            backgroundColor: '#fe6460',
            data: FailData,
            borderWidth: 2,
          },
          {
            type: 'bar',
            label: 'Waiting for Delivery',
            borderColor: 'rgb(238, 176, 80)', //#1d4fae
            backgroundColor: 'rgb(238, 176, 80)',
            data: penData,
            borderWidth: 2,
          },
        ];
        setData({labels: lbls, datasets: myData});
      })
      .catch((err) => {});
  }
  function getTimeBaseData() {
    let _api = `${
      Api.baseUri
    }/usernotify/notification/smsDataTimeWiseByCorporateId/${
      user?.userList?.corporateId
    }/${dateRange?.fromDate + ' 00:00:00'}/${dateRange?.toDate + ' 23:59:00'}`;
    axios
      .get(_api)
      .then((res) => {
        let arr = [
          '0:0 - 4:0',
          '4:1 - 8:0',
          '8:1 - 12:0',
          '12:1 - 16:0',
          '16:1 - 20:0',
          '20:1 - 0:0',
        ];
        let delData = [];
        let penData = [];
        let FailData = [];
        let rateData = [];
        arr.map((el) => {
          delData.push(res?.data[el]?.DELIVERED || 0);
          penData.push(res?.data[el]?.PENDING || 0);
          FailData.push(res?.data[el]?.FAILED || 0);
          rateData.push(
            (res?.data[el]?.DELIVERED * 100) / res?.data[el]?.TOTAL,
          );
        });
        let myData = [
          {
            type: 'line',
            label: 'Rate',
            borderColor: '#4ac1c1', //#11234e
            borderWidth: 2,
            fill: false,
            data: rateData,
          },
          {
            type: 'bar',
            label: 'Delivered', //#128505
            borderColor: 'rgb(4 159 96)',
            backgroundColor: 'rgb(4 159 96)',
            data: delData,
            borderWidth: 2,
          },
          {
            type: 'bar',
            label: 'Undelivered', //#931310
            borderColor: '#fe6460',
            backgroundColor: '#fe6460',
            data: FailData,
            borderWidth: 2,
          },
          {
            type: 'bar',
            label: 'Waiting for Delivery',
            borderColor: 'rgb(238, 176, 80)', //#1d4fae
            backgroundColor: 'rgb(238, 176, 80)',
            data: penData,
            borderWidth: 2,
          },
        ];
        setData({
          labels: [
            '00:01 - 04:00',
            '04:01 - 08:00',
            '08:01 - 12:00',
            '12:01 - 16:00',
            '16:01 - 20:00',
            '20:01 - 00:00',
          ],
          datasets: myData,
        });
      })
      .catch((err) => {});
  }
  return <Chart type='bar' data={data} options={options} />;
}
