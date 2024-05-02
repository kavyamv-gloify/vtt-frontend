import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';

const Billings = React.lazy(() => import('./billing'));
const VendorBillings = React.lazy(() => import('./vendor-billings'));
const Taxes = React.lazy(() => import('./Taxes-Vendor'));

export const BillingsConfigs = [
  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/billings',
    element: <Billings />,
  },

  {
    permittedRole: RoutePermittedRole.vendor,
    path: '/vendor-billings',
    element: <VendorBillings />,
  },
  {
    permittedRole: RoutePermittedRole.vendor,
    path: '/taxes',
    element: <Taxes />,
  },
];
