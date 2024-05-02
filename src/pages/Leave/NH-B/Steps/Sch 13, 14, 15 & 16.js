import React, {useEffect} from 'react';

const Sch13_14_15_16 = ({clickedSwitch, activeStep, setActiveStep}) => {
  useEffect(() => {
    if (clickedSwitch != activeStep) setActiveStep(clickedSwitch);
  }, [clickedSwitch]);
  return <div>Sch13_14_15_16</div>;
};

export default Sch13_14_15_16;
