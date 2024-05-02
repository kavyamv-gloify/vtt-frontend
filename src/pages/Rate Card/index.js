import React from 'react';
import { RoutePermittedRole } from 'shared/constants/AppConst';
const RateCreate = React.lazy(() => import('./Create'));
const RateList = React.lazy(() => import('./Listings'));

export const RateCardConfigs = [
  {
    permittedRole: RoutePermittedRole.ALL,
    path: 'rate-card/:id',
    element: <RateCreate />,
  },
  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/rate-card-list',
    element: <RateList />

  },
]