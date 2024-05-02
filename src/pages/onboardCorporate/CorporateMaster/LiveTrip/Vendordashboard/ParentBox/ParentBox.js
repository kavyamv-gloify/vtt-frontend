import React, {useEffect, useState} from 'react';
import Container from '../ChildBox/ChildBox';

const ParentBox = ({tripData, tripType, tripDate, getAllData}) => {
  // console.log('tripData, tripType, tripDate', tripData, tripType, tripDate);
  return (
    <>
      {tripDate?.map((el, i) => {
        return (
          <div style={{paddingTop: '10px'}}>
            <Container
              data={tripData[el]}
              tripType={tripType[i]}
              tripDate={el}
              getAllData={getAllData}
            />
          </div>
        );
      })}
    </>
  );
};

export default ParentBox;
