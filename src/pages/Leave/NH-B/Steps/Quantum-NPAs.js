import React, {useEffect} from 'react';

const QuantumNPAs = ({clickedSwitch, activeStep, setActiveStep}) => {
  useEffect(() => {
    if (clickedSwitch != activeStep) setActiveStep(clickedSwitch);
  }, [clickedSwitch]);
  return <div>QuantumNPAs</div>;
};

export default QuantumNPAs;
