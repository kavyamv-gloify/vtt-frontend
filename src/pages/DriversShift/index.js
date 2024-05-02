import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';

const DriverShift = React.lazy(() => import('./list'));
export const DriversShiftConfigs = [
  {
    permittedRole: [
      RoutePermittedRole.vendor,
      // RoutePermittedRole.corporateAdmin,
    ],
    path: '/vendor/driver-shift',
    element: <DriverShift />,
  },
];
