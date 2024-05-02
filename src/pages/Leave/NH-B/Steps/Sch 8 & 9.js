import React, {useEffect} from 'react';

const Sch8_9 = ({clickedSwitch, activeStep, setActiveStep}) => {
  useEffect(() => {
    if (clickedSwitch != activeStep) setActiveStep(clickedSwitch);
  }, [clickedSwitch]);
  return <div>Sch8_9</div>;
};

export default Sch8_9;
