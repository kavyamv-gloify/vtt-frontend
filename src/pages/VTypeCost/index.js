import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';
const TypeCostList = React.lazy(() => import('./Table'));
const TypeCostCreate = React.lazy(() => import('./CreateForm'));

export const vTypeConfigs = [
  {
    permittedRole: [ RoutePermittedRole.corporateAdmin,  RoutePermittedRole.vendor],
    path: '/onboardCorporate/vehiclecost/vehiclecost-listing',
    element: <TypeCostList />,
  },
  {
    permittedRole: [ RoutePermittedRole.corporateAdmin,  RoutePermittedRole.vendor],
    path: '/onboardCorporate/vehiclecost/create-form',
    element: <TypeCostCreate/>,
  },
];
