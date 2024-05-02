import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';

const FuelTrack = React.lazy(() => import('./FuelTrack'));
export const FuelTrackConfigs = [
  // {
  //     permittedRole: [RoutePermittedRole.vendor, RoutePermittedRole.corporateAdmin],
  //     path: '/fuel-track',
  //     element: <FuelTrack />,
  // },

  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/fuel-track',
    element: <FuelTrack />,
  },
];
