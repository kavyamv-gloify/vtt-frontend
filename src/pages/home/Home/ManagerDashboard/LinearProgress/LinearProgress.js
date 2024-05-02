import * as React from 'react';
import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { pink } from '@mui/material/colors';
import { makeStyles } from '@mui/styles';

function LinearProgressWithLabel(props) {
  const useStyles = makeStyles(() => ({
    root: {
      "& .MuiLinearProgress-colorPrimary": {
        backgroundColor: "#dbdbdb",
        height:"6px",
        borderRadius:"10px",
      },
      "& .MuiLinearProgress-barColorPrimary": {
        backgroundColor: props?.bgcolor ?? "yellow",
      },
    
    },
  }))
  const classes = useStyles();
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }} className={classes.root}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};

export default function LinearWithValueLabel({ progressVal, bgcolor }) {
  //   const [progress, setProgress] = React.useState(10);

  //   React.useEffect(() => {
  //     const timer = 
  //     setInterval(() => {
  //       setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10));
  //     }, 800);
  //     return () => {
  //       clearInterval(timer);
  //     };
  //   }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgressWithLabel value={progressVal ?? 10} bgcolor={bgcolor} />
    </Box>
  );
}