import React, {useEffect} from 'react';

const P_And_L = ({clickedSwitch, activeStep, setActiveStep}) => {
  useEffect(() => {
    if (clickedSwitch != activeStep) setActiveStep(clickedSwitch);
  }, [clickedSwitch]);
  return <div>P_And_L</div>;
};

export default P_And_L;
