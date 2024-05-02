import React, {useState} from 'react';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import IntlMessages from '../../utility/IntlMessages';
import {LayoutType} from 'shared/constants/AppEnums';
import {useLayoutContext} from '../../utility/AppContextProvider/LayoutContextProvider';
import AppScrollbar from '../AppScrollbar';
import {red} from '@mui/material/colors';
import ThemeColors from './ThemeColors';
import ThemeFooter from './ThemeFooter';
import ThemeModes from './ThemeModes';
import ThemeDirection from './ThemeDirection';
import SidebarSettings from './SidebarSettings';
import NavStyles from './NavStyles';
import LayoutTypes from './LayoutTypes';
import ThemeHeader from './ThemeHeader';
import HelpForm from '../HelpSupportForm/HelpForm';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import './index.css';
import {useAuthUser} from '@crema/utility/AuthHooks';
import AppNotifications from '@crema/core/AppNotifications';
import {sosClicked} from 'redux/actions';
import {useDispatch} from 'react-redux';

const AppThemeSetting = () => {
  const [isSettingOpen, setSettingOpen] = useState(false);
  const [isColorSettingOpen, setColorSettingOpen] = useState(false);
  const {layoutType} = useLayoutContext();
  const {user} = useAuthUser();
  const dispatch = useDispatch();
  const CloseHelpSupport = () => {
    setSettingOpen(false);
  };
  return (
    <Box
      style={{display: ''}}
      sx={{
        position: 'fixed',

        right: 0,
        top: '50%',
        transform: "translateY('-50%')",
        zIndex: 9999999,
      }}
      className='customizerOption'
    >
      {user.role == 'CORPORATEADMIN' || user.role == 'VENDOR' ? (
        <>
          <Box
            sx={{
              width: '45px',
              height: '38px',
              borderTopLeftRadius: '7px',
              borderBottomLeftRadius: '7px',
              display: 'flex',
              alignTtems: 'center',
              justifyContent: 'center',
              // borderRadius: '30px 0 0 30px',
              // mb: 1,
              backgroundColor: red[600],
              '&:hover': {
                backgroundColor: red[800],
              },
              '& button': {
                borderRadius: '0px 0 0 0px',

                '&:focus': {
                  borderRadius: '0px 0 0 0px',
                },
              },
            }}
          >
            <img
              onClick={() => {
                dispatch(sosClicked());
              }}
              src='/assets/images/sos2.svg'
              style={{width: '30px', height: 'auto'}}
            />
          </Box>
          <Box
            sx={{
              height: '30px',
              background: '#ff8901',
              padding: '10px',
              marginTop: '10px',
              width: '44px',
              display: 'flex',
              fontWeight: 600,
              borderTopLeftRadius: '7px',
              borderBottomLeftRadius: '7px',
              alignItems: 'center',
              cursor: 'pointer',
              justifyContent: 'center',
            }}
            onClick={() => setSettingOpen(!isSettingOpen)}
          >
            <p
              style={{
                // transform: 'rotate(-270deg)',
                color: 'white',
                fontSize: '20px',
              }}
            >
              {/* Help & Support */}?
            </p>
            {/* <IconButton>
              {
                <p
                  style={{
                    transform: 'rotate(-270deg)',
                    color: 'white',
                    width: '1px',
                  }}
                >
                  Contact Support
                </p>
              }
              <SupportAgentIcon
                sx={{
                  animation: 'rotation 2s infinite linear',
                  color: 'white',
                }}
              />
              <SupportAgentIcon />
            </IconButton> */}
          </Box>
        </>
      ) : null}
      {/* <Box
        sx={{
          borderRadius: '30px 0 0 30px',
          backgroundColor: red[500],
          '&:hover': {
            backgroundColor: red[700],
          },
          '& button': {
            borderRadius: '30px 0 0 30px',

            '&:focus': {
              borderRadius: '30px 0 0 30px',
            },
          },
        }}
      >
        <IconButton onClick={() => setColorSettingOpen(!isSettingOpen)}>
          <ColorLensIcon
            sx={{
              color: 'white',
            }}
          />
        </IconButton>
      </Box> */}
      <Drawer
        anchor='right'
        sx={{
          '& .MuiBackdrop-root': {
            background: 'transparent',
          },
        }}
        className={layoutType === LayoutType.BOXED ? 'boxed-drawer' : ''}
        open={isSettingOpen}
        onClose={() => setSettingOpen(false)}
      >
        <AppScrollbar
          sx={{
            width: {xs: 300, md: 360, xl: 400},
          }}
        >
          <Box
            sx={{
              padding: {xs: '20px', xl: '28px 22px'},
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box
              component='h3'
              mb={0.5}
              fontSize={18}
              style={{textAlign: 'center'}}
            >
              Help and Support
              {/* <IntlMessages id='customizer.customiseSidebar' /> */}
            </Box>
            <Box
              component='p'
              mb={0}
              color='text.secondary'
              style={{textAlign: 'center'}}
            >
              Please submit your query here
              {/* <IntlMessages id='customizer.customiseSidebarText' /> */}
            </Box>
          </Box>
          <Box
            sx={{
              padding: {xs: '20px', xl: '28px 22px'},
            }}
          >
            {/* <div style={{fontWeight:"bolder", color:"#9b9595", textAlign:"center", paddingTop:"90%"}} >Coming Soon</div> */}
            <HelpForm close={CloseHelpSupport} />
            {/* <NavStyles />
            <LayoutTypes />
            <ThemeDirection />
            <ThemeHeader />
            <ThemeFooter />
            <SidebarSettings /> */}
          </Box>
        </AppScrollbar>
      </Drawer>
      <Drawer
        anchor='right'
        open={isColorSettingOpen}
        onClose={() => setColorSettingOpen(false)}
        sx={{
          '& .MuiBackdrop-root': {
            background: 'transparent',
          },
        }}
        className={layoutType === LayoutType.BOXED ? 'boxed-drawer' : ''}
      >
        <AppScrollbar
          sx={{
            width: {xs: 300, md: 360, xl: 400},
          }}
        >
          <Box
            sx={{
              padding: {xs: '20px', xl: '28px 22px'},
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box component='h3' mb={0.5} fontSize={18}>
              <IntlMessages id='customizer.customiseTheme' />
            </Box>
            <Box component='p' mb={0} color='text.secondary'>
              <IntlMessages id='customizer.customiseText' />
            </Box>
          </Box>
          <Box
            sx={{
              padding: {xs: '20px', xl: '28px 22px'},
            }}
          >
            <ThemeModes />
            <ThemeColors />
          </Box>
        </AppScrollbar>
      </Drawer>
    </Box>
  );
};

export default AppThemeSetting;
