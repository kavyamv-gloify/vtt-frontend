import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';
const IVRs = React.lazy(() => import('./IVRs'));
const TabelData = React.lazy(() => import('./TableData'));
export const IVRConfig = [
  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/IVR',
    element: <IVRs />,
  },
  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/IVR/:id/:from/:to',
    element: <TabelData />,
  },
];
