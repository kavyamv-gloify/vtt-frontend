import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';

const FuelPrice = React.lazy(() => import('./FuelPrice'));
export const FuelPriceConfig = [
  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/fuel-price',
    element: <FuelPrice />,
  },
];
