import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';

const DriverConsent = React.lazy(() => import('./list'));
export const DriverConsentConfigs = [
  {
    permittedRole: [
      // RoutePermittedRole.vendor,
      // RoutePermittedRole.corporateAdmin,
      RoutePermittedRole.superAdmin,
    ],
    path: '/driver-consent',
    element: <DriverConsent />,
  },
];
