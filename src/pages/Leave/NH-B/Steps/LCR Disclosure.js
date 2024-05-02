import React, {useEffect} from 'react';

const LCR_Disclosure = ({clickedSwitch, activeStep, setActiveStep}) => {
  useEffect(() => {
    if (clickedSwitch != activeStep) setActiveStep(clickedSwitch);
  }, [clickedSwitch]);
  return <div>LCR_Disclosure</div>;
};

export default LCR_Disclosure;
