import React from 'react';
import PropsTypes from 'prop-types';
import ListItem from '@mui/material/ListItem';
import {Fonts} from 'shared/constants/AppEnums';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {alpha} from '@mui/material';

const VerticalCollapseItem = ({children, sidebarTextColor, ...rest}) => {
  const {user} = useAuthUser();
  return (
    <ListItem
      sx={{
        height: 40,
        my: 0.25,
        pl: '31px',
        pr: 3.75,
        whiteSpace: 'nowrap',
        transition: 'all 0.4s ease',
        '& .nav-item-text': {
          fontWeight: Fonts.MEDIUM,
          color: user?.userList?.theme?.fontColor || 'white',
          // opacity: 0.7,
        },

        '& .nav-item-icon': {
          color: user?.userList?.theme?.fontColor || 'white',
          // opacity: 0.7,
          fontSize: 20,
          display: 'block',
        },

        '& .nav-item-icon-arrow': {
          color: user?.userList?.theme?.fontColor || 'white',
          // opacity: 0.7,
        },

        '& .MuiIconButton-root': {
          mr: 3,
          padding: 0,
        },

        '& .MuiTouchRipple-root': {
          zIndex: 10,
        },

        '&.open, &:hover, &:focus': {
          '& .nav-item-text, & .nav-item-icon, & .nav-item-icon-arrow': {
            fontWeight: Fonts.MEDIUM,
            opacity: 1,
            // color: sidebarTextColor,
          },

          '& .nav-item-icon': {
            color: user?.userList?.theme?.fontColor || 'white',
          },

          '& .nav-item-icon-arrow': {
            color: user?.userList?.theme?.fontColor || 'white',
          },
        },
        '&:hover': {
          backgroundColor: 'transparent',
        },
      }}
      {...rest}
    >
      {children}
    </ListItem>
  );
};

export default VerticalCollapseItem;

VerticalCollapseItem.propTypes = {
  children: PropsTypes.node,
  sidebarTextColor: PropsTypes.string,
};
