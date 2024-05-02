import React from 'react';
import {Grid} from '@mui/material';
import VisitorPageView from 'pages/dashboards/Analytics/VisitorPageView/index.js';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import AppCard from '@crema/core/AppCard';
import AppSelect from '@crema/core/AppSelect';
import {useIntl} from 'react-intl';
// import HospitalActivity from 'pages/dashboards/HealthCare/HospitalActivity/index.js'
const TripAnalaytics = () => {
  const data = [
    {name: '15 MAY', Page: '150', Visitor: '270'},
    {name: '16 MAY', Page: '750', Visitor: '280'},
    {name: '17 MAY', Page: '250', Visitor: '300'},
    {name: '18 MAY', Page: '350', Visitor: '340'},
    {name: '19 MAY', Page: '450', Visitor: '530'},
    {name: '20 MAY', Page: '550', Visitor: '390'},
    {name: '21 MAY', Page: '650', Visitor: '276'},
  ];
  const handleSelectionType = (data) => {};
  const {messages} = useIntl();
  return (
    <Grid container spacing={2} sx={{marginTop: '20px'}}>
      <Grid item xs={12} md={12} sm={12}>
        {/* <VisitorPageView data={data} /> */}
        <AppCard
          sxStyle={{height: 1}}
          title={'Visitors & Page view'}
          action={
            <AppSelect
              menus={[
                messages['dashboard.thisWeek'],
                messages['dashboard.lastWeeks'],
                messages['dashboard.lastMonth'],
              ]}
              defaultValue={messages['dashboard.thisWeek']}
              onChange={handleSelectionType}
            />
          }
        >
          <Grid container>
            <Grid item xs={12} sm={12} md={12}>
              <ResponsiveContainer width='100%' height={350}>
                <LineChart
                  data={data}
                  margin={{top: 50, right: 0, left: -25, bottom: 0}}
                >
                  <XAxis
                    dataKey='name'
                    tickLine={false}
                    axisLine={false}
                    padding={{left: 20, right: 20}}
                  />
                  <Tooltip labelStyle={{color: 'black'}} />
                  <CartesianGrid
                    stroke='#eee'
                    horizontal={true}
                    vertical={false}
                  />
                  <Line
                    type='monotone'
                    dataKey='Page'
                    stroke='#0698ec'
                    dot={false}
                    strokeWidth={2}
                    activeDot={{r: 4}}
                  />
                  <Line
                    type='monotone'
                    dot={false}
                    strokeWidth={2}
                    dataKey='Visitor'
                    stroke='#f44d50'
                  />
                </LineChart>
              </ResponsiveContainer>
            </Grid>
          </Grid>
        </AppCard>
      </Grid>
    </Grid>
  );
};

export default TripAnalaytics;
