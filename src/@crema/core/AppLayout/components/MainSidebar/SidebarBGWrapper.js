import React, {useEffect} from 'react';
import PropsTypes from 'prop-types';
import Box from '@mui/material/Box';
import {alpha} from '@mui/material';
import {ThemeMode} from 'shared/constants/AppEnums';
import {useSidebarContext} from '../../../../utility/AppContextProvider/SidebarContextProvider';
import {useAuthUser} from '@crema/utility/AuthHooks';

const SidebarBgWrapper = ({children}) => {
  const {user} = useAuthUser();
  const {
    sidebarBgColor,
    sidebarTextColor,
    mode,
    isSidebarBgImage,
    sidebarBgImage,
  } = useSidebarContext();

  useEffect(() => {
    setInterval(() => {
      var elements = document.getElementsByClassName(
        'MuiButton-containedPrimary',
      );
      for (var i = 0; i < elements.length; i++) {
        elements[i].style.background =
          user?.userList?.theme?.btnColor || 'primary';
        elements[i].style.color = 'white';
      }
      var elements2 = document.getElementsByClassName(
        'MuiButton-outlinedPrimary',
      );
      for (var i = 0; i < elements2.length; i++) {
        elements2[i].style.color = user?.userList?.theme?.btnColor || 'primary';
        elements2[i].style.borderColor =
          user?.userList?.theme?.btnColor || 'primary';
      }
    }, 1);
  }, [user]);
  return (
    <Box
      sx={{
        position: 'relative',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        backgroundColor: user?.userList?.theme?.bgColor || '#10234e', // This is sidebar backgroud color RRRRRRRRRRRRRRRR
        backgroundImage: isSidebarBgImage
          ? `url(/assets/images/sidebar/images/${sidebarBgImage}.png)`
          : '',
        backgroundRepeat: isSidebarBgImage ? 'no-repeat' : '',
        backgroundPosition: isSidebarBgImage ? 'center center' : '',
        backgroundSize: isSidebarBgImage ? 'cover' : '',
        color: sidebarTextColor, // This is sidebar color RRRRRRRRRRRRRRRR
        // boxShadow: '3px 3px 4px rgba(0, 0, 0, 0.04)',
        '&:before': {
          content: '""',
          display: isSidebarBgImage ? 'block' : 'none',
          position: 'absolute',
          left: 0,
          top: 0,
          zIndex: 1,
          width: '100%',
          height: '100%',
          backgroundColor: (theme) =>
            mode === ThemeMode.LIGHT
              ? alpha(theme.palette.common.white, 0.5)
              : alpha(theme.palette.common.black, 0.5),
        },
        '& > *': {
          position: 'relative',
          zIndex: 3,
        },
      }}
    >
      {children}
    </Box>
  );
};

export default SidebarBgWrapper;

SidebarBgWrapper.propTypes = {
  children: PropsTypes.node,
  isSidebarBgImage: PropsTypes.bool,
  themeMode: PropsTypes.string,
  sidebarBgColor: PropsTypes.oneOfType([PropsTypes.string, PropsTypes.number]),
  sidebarBgImage: PropsTypes.oneOfType([PropsTypes.string, PropsTypes.number]),
};
