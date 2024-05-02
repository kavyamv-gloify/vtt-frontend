import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';

const DesignationForm=React.lazy(() => import('./Form'));
const DesignationTable=React.lazy(() => import('./DesignationTable'));
export const DesignationConfigs = [
  {
    permittedRole: RoutePermittedRole.corporateAdmin,
    path: '/onboardCorporate/designation/create-form',
    element: <DesignationForm />,
  },
  {
    permittedRole: RoutePermittedRole.corporateAdmin,
    path: '/onboardCorporate/designation/designation-table',
    element: <DesignationTable />,
  },

];
