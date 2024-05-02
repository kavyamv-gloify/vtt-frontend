import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';

const Users = React.lazy(() => import('./Users'));
export const UserConfigs = [
  {
    permittedRole: [RoutePermittedRole.superAdmin],
    path: '/users',
    element: <Users />,
  },
];
