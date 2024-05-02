import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';

const DriverAttendence = React.lazy(() => import('./DriverAttendence'));
export const DriverAttendenceConfigs = [
  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/driver-attendence',
    element: <DriverAttendence />,
  },
];
