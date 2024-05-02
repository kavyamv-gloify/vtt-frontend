import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);



export default function PIECHART({chartdata}) {
  return <div>
    <Pie data={chartdata} options={{
        plugins: {
            legend: {
                display: false
            },
        }
    }}/>
    </div>
}
