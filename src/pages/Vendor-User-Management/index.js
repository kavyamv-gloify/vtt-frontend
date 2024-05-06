import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';

const VendorUser = React.lazy(() => import('./VendorUser'));
export const VendorUserConfigs = [
  {
    permittedRole: [RoutePermittedRole.ALL],
    path: '/vendor-user',
    element: <VendorUser />,
  },
];
