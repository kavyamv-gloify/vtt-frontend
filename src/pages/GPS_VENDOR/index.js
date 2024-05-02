import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';

const GPSList = React.lazy(() => import('./GpsVendor'));
const GPSAssociation = React.lazy(() => import('./Association'));

export const NewGpsListConfig = [
  {
    permittedRole: RoutePermittedRole.superAdmin,
    path: '/Mastergps',
    element: <GPSList />,
  },
  {
    permittedRole: RoutePermittedRole.superAdmin,
    path: '/Mastergps/association/:id',
    element: <GPSAssociation />,
  },
];
