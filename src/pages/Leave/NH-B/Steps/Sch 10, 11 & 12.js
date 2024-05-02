import React, {useEffect} from 'react';

const Sch10_11_12 = ({clickedSwitch, activeStep, setActiveStep}) => {
  useEffect(() => {
    if (clickedSwitch != activeStep) setActiveStep(clickedSwitch);
  }, [clickedSwitch]);
  return <div>Sch10_11_12</div>;
};

export default Sch10_11_12;
