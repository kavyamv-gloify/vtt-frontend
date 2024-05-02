import React, {useEffect} from 'react';

const Suits = ({clickedSwitch, activeStep, setActiveStep}) => {
  useEffect(() => {
    if (clickedSwitch != activeStep) setActiveStep(clickedSwitch);
  }, [clickedSwitch]);
  return <div>Suits</div>;
};

export default Suits;
