import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';
const Associate = React.lazy(() => import('./Association'));
const DriverAssociation = React.lazy(() => import('./DriverAssociation'));
const VehicleAssociation = React.lazy(() => import('./VehicleAssociation'));
export const AssociateConfig = [
  {
    permittedRole: RoutePermittedRole.superAdmin,
    path: '/association',
    element: <Associate />,
  },
  {
    permittedRole: RoutePermittedRole.superAdmin,
    path: '/driver-association/:id',
    element: <DriverAssociation />,
  },
  {
    permittedRole: RoutePermittedRole.superAdmin,
    path: '/vehicle-association/:id',
    element: <VehicleAssociation />,
  },
];
