import React, {useState} from 'react';
import StandingMan from '@icons/standingMan';
import 'pages/home/Home/CorporateAdmin/style.css';

function FleetMix({title, data}) {
  return (
    <div
      className='card-normal min-h-300'
      style={{boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px'}}
    >
      <div className='card-title'>
        <div>{title}</div>
      </div>
      <div className='dash-fleets-mix'>
        {data.map(
          (v) =>
            v?.label != 'NA' &&
            !isNaN(v?.seats) && (
              <div className='fm-bar' style={{width: '40px', height: '80%'}}>
                <div className='fm-value'>
                  {((v.value * 100) / v.seats)?.toFixed(2)}%
                </div>
                <div
                  className='fm-progressor'
                  style={{
                    height: (v.value * 100) / v.seats + '%',
                    backgroundColor: v.color ?? '#000',
                  }}
                >
                  <div className='fm-icon'>
                    <StandingMan color={v.color ?? '#000'} text={v.value} />
                  </div>
                  <div className='fm-title'>{v.label}</div>
                </div>
              </div>
            ),
        )}
      </div>
    </div>
  );
}

export default FleetMix;
