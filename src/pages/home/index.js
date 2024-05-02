import React from 'react';
import { RoutePermittedRole } from 'shared/constants/AppConst';
const Dashboard = React.lazy(() => import('./dashboard'));
export const home = [
  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/dashboard',
    element: <Dashboard />,
  },
];
