import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';

const LiveTrip = React.lazy(() => import('./Vendordashboard/index'));
const CorporateAdmin = React.lazy(() => import('./Vendordashboard/index_copy'));

export const LiveTripConfig = [
  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/onboardCorporate/livetrip',
    element: <LiveTrip />,
  },

  {
    permittedRole: RoutePermittedRole.corporateAdmin,
    path: '/onboardCorporate/copy',
    element: <CorporateAdmin />,
  },
];
