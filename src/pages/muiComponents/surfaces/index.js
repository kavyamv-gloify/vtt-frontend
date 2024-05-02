import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';

const AppBar = React.lazy(() => import('./AppBar'));
const Accordion = React.lazy(() => import('./Accordion'));
const Card = React.lazy(() => import('./Card'));
const Paper = React.lazy(() => import('./Paper'));

export const surfaceConfigs = [
  {
    permittedRole: RoutePermittedRole.user,
    path: '/mui/surface/appbar',
    element: <AppBar />,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/mui/surface/accordion',
    element: <Accordion />,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/mui/surface/cards',
    element: <Card />,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/mui/surface/paper',
    element: <Paper />,
  },
];
