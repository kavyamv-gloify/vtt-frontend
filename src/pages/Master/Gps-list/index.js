import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';

const GPSList = React.lazy(() => import('./List'));

export const GpsListConfig = [
  //   {
  //     permittedRole: [RoutePermittedRole.corporateAdmin,RoutePermittedRole.vendor],
  //     path: '/Master/Gps-Vendor/create-form',
  //     element: <GPSVendorCreate />,
  //   },
  {
    permittedRole: RoutePermittedRole.superAdmin,
    path: '/Master/Gps-list/list',
    element: <GPSList />,
  },
];
