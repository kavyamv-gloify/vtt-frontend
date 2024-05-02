import {Grid} from '@mui/material';
import {Box} from '@mui/system';
import React, {useEffect, useState} from 'react';
import PIECHART from './Pie';

const UploadSection = ({chartArr, labels, headLabel, colorCode, type}) => {
  const [totalSum, setTotalSum] = useState();
  const [chartdata, setChartData] = useState({});

  useEffect(() => {
    if (!chartArr?.length) return;
    const customLabels = labels.map((label, index) => `${label}`);
    setChartData({
      labels: customLabels,
      height: '220px',
      datasets: [
        {
          label: 'Markets Monitored',
          backgroundColor: colorCode,
          data: chartArr,
          maintainAspectRatio: false,
          responsive: false,
        },
      ],
    });
  }, [chartArr]);

  useEffect(() => {
    let n = 0;
    chartdata?.datasets?.length &&
      chartdata?.datasets[0]?.data?.length &&
      chartdata?.datasets[0]?.data?.map((e) => {
        n = n + Number(e);
      });
    setTotalSum(n);
  }, [chartdata]);
  return (
    <div>
      <Box sx={{flexGrow: 1}}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <div>
              {chartdata?.datasets?.length && chartdata?.datasets[0]?.data ? (
                <PIECHART chartdata={chartdata} type={type} />
              ) : null}
            </div>
          </Grid>
          <Grid
            item
            xs={6}
            style={{display: 'flex', alignItems: 'center', textAlign: 'center'}}
          >
            <div style={{width: '100%'}}>
              <h2 style={{marginBottom: '25px', fontWeight: '600'}}>
                {headLabel}: {totalSum}
              </h2>
              <div style={{paddingLeft: '25%', textAlign: 'left'}}>
                {chartdata?.datasets?.length && chartdata?.datasets[0]?.data
                  ? chartdata?.datasets[0]?.data?.map((d, index) => {
                      return (
                        <div style={{display: 'flex', padding: '5px'}}>
                          <div
                            style={{
                              width: '30px',
                              height: '15px',
                              border: '0.5px solid',
                              background:
                                chartdata?.datasets[0]?.backgroundColor[index],
                            }}
                          ></div>
                          <span style={{flex: 1, padding: '0px 0px 0px 10px'}}>
                            {chartdata?.labels[index]}
                          </span>
                        </div>
                      );
                    })
                  : null}
              </div>
            </div>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default UploadSection;
