import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';

const GPSVendorList=React.lazy(()=>import('./List'));
const GPSVendorCreate=React.lazy(()=>import('./CreateForm'));

export const GpsConfig = [
  {
    permittedRole: [RoutePermittedRole.corporateAdmin,RoutePermittedRole.vendor],
    path: '/Master/Gps-Vendor/create-form',
    element: <GPSVendorCreate />,
  },
  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/Master/Gps-Vendor/list',
    element: <GPSVendorList/>,
  },
 

];
