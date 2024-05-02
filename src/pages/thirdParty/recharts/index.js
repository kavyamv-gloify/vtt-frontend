import React from 'react';
import AreaChart from './Area';
import BarChart from './Bar';
import ComposedChart from './Composed';
import LineChart from './Line';
import PieChart from './Pie';
import Radial from './Radial';
import Treemap from './Treemap';
import Scatter from './Scatter';
import Radar from './Radar';
import FunnelChart from './Funnel';

export const rechartsConfigs = [
  {
    path: '/recharts/area',
    element: <AreaChart />,
  },
  {
    path: '/recharts/bar',
    element: <BarChart />,
  },
  {
    path: '/recharts/composed',
    element: <ComposedChart />,
  },
  {
    path: '/recharts/line',
    element: <LineChart />,
  },
  {
    path: '/recharts/pie',
    element: <PieChart />,
  },
  {
    path: '/recharts/radar',
    element: <Radar />,
  },
  {
    path: '/recharts/radial',
    element: <Radial />,
  },
  {
    path: '/recharts/treemap',
    element: <Treemap />,
  },
  {
    path: '/recharts/scatter',
    element: <Scatter />,
  },
  {
    path: '/recharts/funnel',
    element: <FunnelChart />,
  },
];
