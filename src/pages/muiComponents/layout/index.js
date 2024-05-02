import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';

const Box = React.lazy(() => import('./Box'));
const Container = React.lazy(() => import('./Container'));
const Grid = React.lazy(() => import('./Grid'));
const Stack = React.lazy(() => import('./Stack'));
const ImageList = React.lazy(() => import('./ImageList'));

export const layoutConfigs = [
  {
    permittedRole: RoutePermittedRole.user,
    path: '/mui/layout/box',
    element: <Box />,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/mui/layout/container',
    element: <Container />,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/mui/layout/Grid',
    element: <Grid />,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/mui/layout/Stack',
    element: <Stack />,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/mui/layout/Image-list',
    element: <ImageList />,
  },
];
