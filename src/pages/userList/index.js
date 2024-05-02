import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';
const Flat = React.lazy(() => import('./Flat'));
const Modern = React.lazy(() => import('./Modern'));
const Standard = React.lazy(() => import('./Standard'));

export const userListConfig = [
  {
    permittedRole: RoutePermittedRole.user,
    path: '/list-type/flat',
    element: <Flat />,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/list-type/morden',
    element: <Modern />,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/list-type/standard',
    element: <Standard />,
  },
];
