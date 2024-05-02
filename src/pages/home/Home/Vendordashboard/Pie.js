import React from 'react';
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import {Pie, Doughnut} from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const styles = {
  pieContainer: {
    width: '220px',
    height: '220px',
  },
  relative: {
    position: 'relative',
  },
};

export default function PIECHART({chartdata, type}) {
  return (
    <div style={styles.pieContainer}>
      {type == 'PIE' ? (
        <Pie
          height={'220px'}
          data={chartdata}
          options={{
            plugins: {
              legend: {
                display: false,
              },
            },
          }}
        />
      ) : (
        <Doughnut
          height={'220px'}
          data={chartdata}
          options={{
            plugins: {
              legend: {
                display: false,
              },
            },
          }}
        />
      )}
    </div>
  );
}
