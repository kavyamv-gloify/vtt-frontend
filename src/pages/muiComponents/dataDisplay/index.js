import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';

const Avatar = React.lazy(() => import('./Avatar'));
const Badges = React.lazy(() => import('./Badges'));
const Chips = React.lazy(() => import('./Chips'));
const Divider = React.lazy(() => import('./Divider'));
const Lists = React.lazy(() => import('./Lists'));
const Table = React.lazy(() => import('./Table'));
const Tooltip = React.lazy(() => import('./Tooltip'));
const Typography = React.lazy(() => import('./Typography'));

export const dataDisplayConfigs = [
  {
    permittedRole: RoutePermittedRole.user,
    path: '/mui/data-display/avatars',
    element: <Avatar />,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/mui/data-display/badges',
    element: <Badges />,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/mui/data-display/chips',
    element: <Chips />,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/mui/data-display/divider',
    element: <Divider />,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/mui/data-display/lists',
    element: <Lists />,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/mui/data-display/tables',
    element: <Table />,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/mui/data-display/tooltip',
    element: <Tooltip />,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/mui/data-display/typography',
    element: <Typography />,
  },
];
