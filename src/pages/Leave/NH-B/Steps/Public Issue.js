import React, {useEffect} from 'react';

const PublicIssue = ({clickedSwitch, activeStep, setActiveStep}) => {
  useEffect(() => {
    if (clickedSwitch != activeStep) setActiveStep(clickedSwitch);
  }, [clickedSwitch]);
  return <div>PublicIssue</div>;
};

export default PublicIssue;
