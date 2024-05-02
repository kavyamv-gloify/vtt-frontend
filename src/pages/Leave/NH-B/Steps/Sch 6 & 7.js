import React, {useEffect} from 'react';

const Sch6_7 = ({clickedSwitch, activeStep, setActiveStep}) => {
  useEffect(() => {
    if (clickedSwitch != activeStep) setActiveStep(clickedSwitch);
  }, [clickedSwitch]);
  return <div>Sch6_7</div>;
};

export default Sch6_7;
