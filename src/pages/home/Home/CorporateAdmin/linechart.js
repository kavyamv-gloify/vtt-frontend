import React, {useEffect, useState} from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

export default function LineChartComp({colorArray, mydata}) {
  const [data, setData] = useState([]);
  useEffect(() => {
    let arr = [];
    Object.keys(mydata).map((elm) => {
      console.log(elm, 'my element');
      arr.push({
        Name: elm,
        ['OTA Emp']: mydata[elm]?.ota_emp?.length
          ? Number((mydata[elm]?.ota_emp?.length * 100) / mydata[elm]?.up_pass)
          : 0,
        ['OTA Trip']: mydata[elm]?.ota_trip?.length
          ? Number((mydata[elm]?.ota_trip?.length * 100) / mydata[elm]?.up_trip)
          : 0,
        ['OTD Emp']: mydata[elm]?.otd_emp?.length
          ? Number(
              (mydata[elm]?.otd_emp?.length * 100) / mydata[elm]?.down_pass,
            )
          : 0,
        ['OTD Trip']: mydata[elm]?.otd_trip?.length
          ? Number(
              (mydata[elm]?.otd_trip?.length * 100) / mydata[elm]?.down_trip,
            )
          : 0,
      });
    });
    console.log('arr', arr);
    setData(arr);
  }, [mydata]);
  return (
    <LineChart
      width={600}
      height={250}
      data={data}
      margin={{
        top: 10,
        right: 10,
        left: 10,
        bottom: 10,
      }}
    >
      {/* <CartesianGrid strokeDasharray='1 9' /> content={<CustomTooltip />} */}
      <XAxis dataKey='Name' />
      <YAxis type='number' domain={[0, 100]} />
      <Tooltip />
      <Legend />
      <Line
        type='monotone'
        dataKey='OTA Emp'
        stroke={colorArray[0]}
        strokeWidth={1}
        dot={false}
      />
      <Line
        type='monotone'
        dataKey='OTA Trip'
        stroke={colorArray[1]}
        strokeWidth={1}
        dot={false}
      />
      <Line
        type='monotone'
        dataKey='OTD Emp'
        stroke={colorArray[2]}
        strokeWidth={1}
        dot={false}
      />
      <Line
        type='monotone'
        dataKey='OTD Trip'
        stroke={colorArray[3]}
        strokeWidth={1}
        dot={false}
      />
    </LineChart>
  );
}
