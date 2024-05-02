import React from 'react';
import notification from '@crema/services/db/notifications';
import {IconButton} from '@mui/material';
import List from '@mui/material/List';
import Button from '@mui/material/Button';
import AppScrollbar from '@crema/core/AppScrollbar';
import IntlMessages from '@crema/utility/IntlMessages';
// import NotificationItem from './NotificationItem';
import SOS from './sos';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const AppNotificationContent = ({onClose, sxStyle, sosList, isFemale}) => {
  // console.log('sosList', sosList);
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: 280,
        height: '100%',
        ...sxStyle,
      }}
    >
      <Box
        sx={{
          padding: '5px 20px',
          display: 'flex',
          alignItems: 'center',
          borderBottom: 1,
          borderBottomColor: (theme) => theme.palette.divider,
          minHeight: {xs: 56, sm: 70},
        }}
      >
        <Typography
          component='h3'
          variant='h3'
          sx={{color: '#aa4251', fontSize: '22px', fontWeight: 600}}
        >
          SOS ({sosList.length || 0})
        </Typography>
        <IconButton
          sx={{
            height: 40,
            width: 40,
            marginLeft: 'auto',
            color: 'text.secondary',
          }}
          onClick={onClose}
          size='large'
        >
          <CancelOutlinedIcon />
        </IconButton>
      </Box>
      <AppScrollbar
        sx={{
          height: {xs: 'calc(100% - 96px)', sm: 'calc(100% - 110px)'},
        }}
      >
        <List sx={{py: 0}}>
          {sosList.map((item) => (
            // <NotificationItem key={item.id} item={item} />
            <SOS
              key={item.id}
              item={item}
              sosList={sosList}
              isFemale={isFemale}
            />
          ))}
        </List>
      </AppScrollbar>
      <Button
        id='btnMui123'
        sx={{
          borderRadius: 0,
          width: '100%',
          textTransform: 'capitalize',
          marginTop: 'auto',
          height: 40,
        }}
        variant='contained'
        color='primary'
      >
        <IntlMessages id='common.viewAll' />
      </Button>
    </Box>
  );
};

export default AppNotificationContent;

AppNotificationContent.propTypes = {
  onClose: PropTypes.func,
  sxStyle: PropTypes.object,
};
