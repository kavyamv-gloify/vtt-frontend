import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';
const Map = React.lazy(() => import('./POCMap'));

export const POCMapConfig = [
  {
    permittedRole: RoutePermittedRole.superAdmin,
    path: '/poc-map',
    element: <Map />,
  },
];
