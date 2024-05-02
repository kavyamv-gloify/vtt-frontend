import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

export default function BarChartComp({data}) {
  return (
    <BarChart
      width={450}
      height={280}
      data={data}
      barCategoryGap={30}
      barGap={4}
      margin={{
        top: 20,
        right: 30,
        left: 20,
        bottom: 30,
      }}
    >
      {/* <CartesianGrid strokeDasharray='3 3' /> */}
      <XAxis dataKey='name' />
      <YAxis />
      <Tooltip cursor={{fill: 'transparent'}} />
      {/* <Legend /> */}
      <Bar
        dataKey='Expected Delayed Trips'
        stackId='a'
        fill='rgb(13 174 155)'
      />
      <Bar
        dataKey='Total Trips'
        stackId='a'
        fill='rgb(13 174 155 /35%)'
        radius={[10, 10, 0, 0]}
      />
    </BarChart>
  );
}
