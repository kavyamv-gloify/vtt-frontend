import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';
const VehicleDriverList = React.lazy(() => import('./VehicleDriverList'));
export const VehicleDriverConfig = [
  {
    permittedRole: RoutePermittedRole.corporateAdmin,
    path: '/vehicle-driver-mapping',
    element: <VehicleDriverList />,
  },
];
