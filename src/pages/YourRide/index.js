import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';

const YourRide = React.lazy(() => import('./YourRide'));
// const DesignationTable = React.lazy(() => import('./DesignationTable'));
export const YourRideConfigs = [
  {
    permittedRole: [RoutePermittedRole.employee, RoutePermittedRole.manager],
    path: '/your-ride',
    element: <YourRide />,
  },
];
