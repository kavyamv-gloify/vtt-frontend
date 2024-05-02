import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';
const VendorInvoiceList = React.lazy(() => import('./Vendor'));
const VendorInvoiceView = React.lazy(() => import('./Vendor/view'));
export const InvoicingConfig = [
  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/invoice-listing-vendor/:type/:fromDate/:toDate',
    element: <VendorInvoiceList />,
  },
  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/invoice-listing-vendor-view/:id/:fromDate/:toDate',
    element: <VendorInvoiceView />,
  },
];
