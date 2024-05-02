import React, {PureComponent} from 'react';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  {
    name: 'Noida',
    ActiveCorporates: 1500,
    InActiveCorporates: 500,
    ActiveVendors: 800,
    InActiveVendors: 200,
    ActiveVehicles: 1200,
    InActiveVehicles: 300,
    ActiveDrivers: 1000,
    InActiveDrivers: 400,
  },
  {
    name: 'Bangalore',
    ActiveCorporates: 1200,
    InActiveCorporates: 400,
    ActiveVendors: 700,
    InActiveVendors: 150,
    ActiveVehicles: 1100,
    InActiveVehicles: 250,
    ActiveDrivers: 900,
    InActiveDrivers: 350,
  },
  {
    name: 'Pune',
    ActiveCorporates: 1000,
    InActiveCorporates: 300,
    ActiveVendors: 600,
    InActiveVendors: 100,
    ActiveVehicles: 1000,
    InActiveVehicles: 200,
    ActiveDrivers: 800,
    InActiveDrivers: 300,
  },
  {
    name: 'Mumbai',
    ActiveCorporates: 500,
    InActiveCorporates: 40,
    ActiveVendors: 400,
    InActiveVendors: 300,
    ActiveVehicles: 300,
    InActiveVehicles: 300,
    ActiveDrivers: 300,
    InActiveDrivers: 300,
  },
];

export default class Example extends PureComponent {
  // static demoUrl = 'https://codesandbox.io/s/mixed-bar-chart-q4hgc';

  render() {
    const {data} = this.props;
    return (
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart
          data={data}
          barSize={7}
          margin={{
            top: 20,
            right: 0,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray='1' opacity={0.3} />
          <XAxis dataKey='cityName' />
          <YAxis />
          <Tooltip />
          {/* <Legend /> */}
          {/* <Bar dataKey='Child1' stackId='a' fill='#098fdc' />
          <Bar
            dataKey='Parent1'
            stackId='a'
            fill='#b2ddf5'
            radius={[10, 10, 0, 0]}
          />
          <Bar dataKey='Child2' stackId='b' fill='#f04f47' spacing={4} />
          <Bar
            dataKey='Parent2'
            stackId='b'
            fill='#ffe3e4'
            radius={[10, 10, 0, 0]}
          /> */}
          <Bar dataKey='activeCorp' stackId='e' fill='#098fdc' />
          <Bar
            dataKey='inActiveCorporate'
            stackId='e'
            fill='#b2ddf5'
            radius={[10, 10, 0, 0]}
          />
          <Bar dataKey='activeVendor' stackId='f' fill='#f04f47' spacing={4} />
          <Bar
            dataKey='inactiveVendor'
            stackId='f'
            fill='#ffe3e4'
            radius={[10, 10, 0, 0]}
          />
          <Bar dataKey='activevehicle' stackId='g' fill='#ff9800' />
          <Bar
            dataKey='inActiveVehicle'
            stackId='g'
            fill='#ffb74d'
            radius={[10, 10, 0, 0]}
          />
          <Bar dataKey='activeDriver' stackId='h' fill='#e91e63' />
          <Bar
            dataKey='inActiveDriver'
            stackId='h'
            fill='#f06292'
            radius={[10, 10, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}
