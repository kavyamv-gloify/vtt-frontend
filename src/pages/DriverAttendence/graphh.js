import React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import AppCard from '@crema/core/AppCard';
// import LinearWithValueLabel from '../Common Component/LinearProgress/LinearProgress';
import LinearWithValueLabel from './LinearProgress';
const Stats = ({icon, bgColor, text, value, title, data, total}) => {
  console.log('data', data);
  return (
    <AppCard
      sxStyle={{
        // height: 1,
        // textAlign: 'center',
        borderRadius: '10px',
        '& .MuiCardContent-root': {
          display: 'flex',
          alignItems: 'flex-start',
          padding: '10px',

          ':last-of-type': {
            pb: '10px',
          },
        },
      }}
    >
      <Avatar
        sx={{
          display: 'flex',
          alignItems: 'center',
          // p: {xs: 3, xl: 4},
          // mb: {xs: 4, md: 5},
          m: '0',
          mr: 2,
          height: 36,
          width: 36,
          backgroundColor: bgColor ?? 'pink',
        }}
      >
        <img src={icon} alt='' style={{width: '25px'}} />
      </Avatar>
      <Box display={'flex'} sx={{flexFlow: 'column wrap'}}>
        <Box
          component='h3'
          sx={{
            fontWeight: 600,
            fontSize: 16,
            textAlign: 'left',
            lineHeight: 1,
          }}
        >
          {data ?? '0'}
        </Box>
        <Box
          component='p'
          sx={{
            color: 'text.secondary',
            fontSize: 14,
          }}
        >
          {title}
        </Box>
        <Box
          sx={{
            width: '100%', // Ensure the linear progress bar takes up the full width
            display: 'flex',
          }}
        >
          <LinearWithValueLabel progress={(data / total) * 100 ?? '0'} />
        </Box>
      </Box>
    </AppCard>
  );
};

export default Stats;

Stats.defaultProps = {
  bgColor: '',
  value: '',
};

Stats.propTypes = {
  text: PropTypes.any.isRequired,
  bgColor: PropTypes.string,
  icon: PropTypes.string,
  value: PropTypes.string,
};
