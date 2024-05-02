import React from 'react';
import { RoutePermittedRole } from 'shared/constants/AppConst';
const CreateRoute = React.lazy(() => import('./route-create'));
const RouteList = React.lazy(() => import('./route-listing'));
const RouteAssign = React.lazy(() => import('./assign'));
const Mappal = React.lazy(() => import('./route-create123'));
export const Routes = [
  {
    permittedRole: RoutePermittedRole.all,
    path: '/create-route',
    element: <CreateRoute />,
  },
  {
    permittedRole: RoutePermittedRole.all,
    path: '/route-listing',
    element: <RouteList />,
  },
  {
    permittedRole: RoutePermittedRole.all,
    path: '/route-assign/:id',
    element: <RouteAssign />,
  },
  {
    permittedRole: RoutePermittedRole.all,
    path: '/mappal',
    element: <Mappal />,
  },
];
