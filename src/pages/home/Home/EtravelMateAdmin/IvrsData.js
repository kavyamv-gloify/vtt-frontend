import React from 'react';
import {Grid} from '@mui/material';
import StatsCardWithGraph from '../../../dashboards/Metrics/StatsCardWithGraph/index';
const IvrsData = () => {
  const content = [
    {title: 'IVR Data', value: '55,658'},
    {title: 'SMS Data', value: '55,658'},
    {title: 'Google API Data', value: '55,658'},
  ];
  const data = [
    {
      data: {
        value: '5,345',
        graphData: [
          {name: 'revenue ', traffic: '10'},
          {name: 'revenue ', traffic: '30'},
          {name: 'revenue ', traffic: '50'},
          {name: 'revenue ', traffic: '40'},
          {name: 'revenue ', traffic: '30'},
          {name: 'revenue ', traffic: '70'},
          {name: 'revenue ', traffic: '60'},
          {name: 'revenue ', traffic: '90'},
        ],
      },
    },
  ];
  return (
    <Grid container md={12} sm={12} xs={12} style={{marginTop: '30px'}}>
      {content?.map((el, ind) => {
        return (
          <Grid
            item
            md={4}
            spacing={2}
            style={{paddingLeft: ind != 0 ? '30px' : '0'}}
          >
            <StatsCardWithGraph
              text={el?.title}
              type={'trafficGraph'}
              headingColor={'black'}
              valueColor={'red'}
              bgColor={'white'}
              data={data[0]?.data}
              curvecolor={'orange'}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default IvrsData;
