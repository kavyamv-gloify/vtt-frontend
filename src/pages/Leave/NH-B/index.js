import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import GeneralInformation from './Steps/General Information';
import AssetsLiab from './Steps/Assets & Liab';
import './styles.css';
import {makeStyles} from '@mui/styles';
import Sch1 from './Steps/Sch 1';
import Sch2 from './Steps/Sch 2';
import Sch3_4_5 from './Steps/Sch 3, 4 & 5';

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  stepper: {
    zIndex: 1,
    display: 'flex',
    justifyContent: 'center',
    position: 'fixed',
  },
}));
const steps = [
  'General Information',
  'Assets & Liab',
  'Sch 1',
  'Sch 2',
  'Sch 3, 4 & 5',
  'Sch 6 & 7',
  'Sch 8 & 9',
  'Sch 10, 11 & 12',
  'P & L',
  'Sch 13, 14, 15 & 16',
  'Quantum-NPAs',
  'Suits',
  'Public Issue',
  'Asset Quality-Loans & Advances',
  'CKF',
  'Profile',
  'LCR Disclosure',
];

// ==============DO NOT REMOVE===============
// const rule = {
//   FORMULA: 'Locked Cell Whose Value Is Derived By Formula', // BLUE (FOLLOW THE FORMULA ADDED FOR THE CELL)
//   OPEN: 'Value To Be Entered By User', // WHITE (THIS IS FOR OPENBOX WHICH INPUT TYPE IS COMMENTED)
//   LOCKED: 'Locked Cell, No Value Can Be Entered', // GREY (DISABLED MODE)
//   DROPDOWN: 'Value To Be Selected From Drop Down', // YELLOW (INPUT TYPE DROPDOWN)
//   ADDMORE: 'Value To Be Entered By User And Rows Can Be Added/Deleted', // AQUA (ADDMORE FEATURE)
//   OPENTEXT: 'Text Value Is To Be Expected', // WHITE WITH PATTERN (OPEN BOX WHICH INPUT TYPE SHOULD BE TEXT)
//   NOIDEA: 'To Add Footnote, Right Click the Cell', // ORANGE (NEED CLARITY)
// };
// ==============END===============

export default function HorizontalLinearAlternativeLabelStepper() {
  const ref = React.useRef(null);
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [clickedSwitch, setClickedSwitch] = React.useState(0);
  const [bodyMargin, setbodyMargin] = React.useState(0);
  function switchFunc(i) {
    setClickedSwitch(i);
  }
  React.useEffect(() => {
    setbodyMargin(ref.current.clientHeight);
  }, []);
  return (
    <Box sx={{width: '100%'}}>
      
      <Stepper
        ref={ref}
        activeStep={activeStep}
        alternativeLabel
        className={classes.stepper}
      >
        {steps.map((label, ind) => (
          <Step
            key={label}
            onClick={() => {
              switchFunc(ind);
            }}
          >
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div style={{marginTop: bodyMargin}}>
        {activeStep == 0 && (
          <GeneralInformation
            clickedSwitch={clickedSwitch}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            setClickedSwitch={setClickedSwitch}
          />
        )}
        {activeStep == 1 && (
          <AssetsLiab
            clickedSwitch={clickedSwitch}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            setClickedSwitch={setClickedSwitch}
          />
        )}
        {activeStep == 2 && (
          <Sch1
            clickedSwitch={clickedSwitch}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            setClickedSwitch={setClickedSwitch}
          />
        )}
        {activeStep == 3 && (
          <Sch2
            clickedSwitch={clickedSwitch}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            setClickedSwitch={setClickedSwitch}
          />
        )}
        {activeStep == 4 && (
          <Sch3_4_5
            clickedSwitch={clickedSwitch}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            setClickedSwitch={setClickedSwitch}
          />
        )}
      </div>
    </Box>
  );
}
