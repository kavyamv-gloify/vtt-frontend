import React, {useEffect, useMemo, useState} from 'react';
import {Collapse, Icon, IconButton, ListItemText, SvgIcon} from '@mui/material';
import {useLocation, useNavigate} from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import VerticalItem from '../VerticalItem';
import Box from '@mui/material/Box';
import IntlMessages from '../../../../../utility/IntlMessages';
import {checkPermission} from '../../../../../utility/helper/RouteHelper';
import {useAuthUser} from '../../../../../utility/AuthHooks';
import {useThemeContext} from '../../../../../utility/AppContextProvider/ThemeContextProvider';
import {useSidebarContext} from '../../../../../utility/AppContextProvider/SidebarContextProvider';
import VerticalCollapseItem from './VerticalCollapseItem';
import {ReactComponent as Master} from 'pages/SVG/Master.svg';
import {ReactComponent as Routes} from 'pages/SVG/Routes.svg';
import {ReactComponent as Setting} from 'pages/SVG/Settings.svg';

const needsToBeOpened = (pathname, item) => {
  return pathname && isUrlInChildren(item, pathname);
};

const isUrlInChildren = (parent, url) => {
  if (!parent.children) {
    return false;
  }

  for (let i = 0; i < parent.children.length; i++) {
    if (parent.children[i].children) {
      if (isUrlInChildren(parent.children[i], url)) {
        return true;
      }
    }

    if (
      parent.children[i].url === url ||
      url.includes(parent.children[i].url)
    ) {
      return true;
    }
  }

  return false;
};

const VerticalCollapse = ({item, level, subModuleArr}) => {
  const {user} = useAuthUser();
  const {theme} = useThemeContext();
  const {sidebarTextColor} = useSidebarContext();
  const {pathname} = useLocation();
  const [open, setOpen] = useState(() => needsToBeOpened(pathname, item));
  const navigate = useNavigate(); // Do not Remove this.
  const [fc, setFC] = useState(user?.userList?.theme?.fontColor);

  useEffect(() => {
    if (window.location.pathname == item.url)
      setFC(user?.userList?.theme?.hoverColor || 'black');
    else setFC(user?.userList?.theme?.fontColor || 'white');
  }, [navigate, user]);

  useEffect(() => {
    if (needsToBeOpened(pathname, item)) {
      setOpen(true);
    }
  }, [pathname, item]);

  const handleClick = () => {
    setOpen(!open);
  };

  const hasPermission = useMemo(
    () => checkPermission(item.permittedRole, user.role),
    [item.permittedRole, user.role],
  );

  if (!hasPermission) {
    return null;
  }

  return (
    <>
      <VerticalCollapseItem
        level={level}
        sidebarTextColor={sidebarTextColor}
        button
        component='div'
        className={clsx('menu-vertical-collapse', open && 'open')}
        onClick={handleClick}
      >
        {item.icon && (
          <Box component='span'>
            <Icon sx={{mr: 4}} color='action' className={clsx('nav-item-icon')}>
              {!item.iconUrl && item.icon}
              {
                <span style={{height: '1em'}}>
                  {item.iconUrl == 'Setting' && (
                    <Setting fill={fc} height='1em' width='1em' />
                  )}
                  {item.iconUrl == 'Master' && (
                    <Master fill={fc} height='1em' width='1em' />
                  )}
                  {item.iconUrl == 'Routes' && (
                    <Routes fill={fc} height='1em' width='1em' />
                  )}
                </span>
              }
            </Icon>
          </Box>
        )}
        <ListItemText
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontSize: 14,
          }}
          className='nav-item-content'
          classes={{primary: clsx('nav-item-text')}}
          primary={<>{item.messageId}</>}
        />
        <IconButton
          className='nav-item-icon-arrow-btn'
          sx={{p: 0, mr: 0.75}}
          disableRipple
          size='large'
        >
          <Icon className='nav-item-icon-arrow' color='inherit'>
            {open
              ? 'expand_more'
              : theme.direction === 'ltr'
              ? 'chevron_right'
              : 'chevron_left'}
          </Icon>
        </IconButton>
      </VerticalCollapseItem>

      {item.children && (
        <Collapse in={open} className='collapse-children'>
          {item.children.map((item) => (
            <React.Fragment key={item.id}>
              {(item.permittedRole != 'ALL' ||
                subModuleArr?.includes(item.submodule)) && (
                <>
                  {item.type === 'collapse' && (
                    <VerticalCollapse item={item} level={level + 1} />
                  )}
                  {item.type === 'item' && (
                    <VerticalItem item={item} level={level + 1} />
                  )}
                </>
              )}
            </React.Fragment>
          ))}
        </Collapse>
      )}
    </>
  );
};

VerticalCollapse.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    icon: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    permittedRole: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    children: PropTypes.array,
    messageId: PropTypes.string,
    type: PropTypes.string,
  }),
  level: PropTypes.number,
};
VerticalCollapse.defaultProps = {};

export default React.memo(VerticalCollapse);
