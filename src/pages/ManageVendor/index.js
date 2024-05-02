import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';

const VendorCreateForm = React.lazy(() => import('./RegisterVendor/index'));
const VendorEditPage = React.lazy(() => import('./EditVendor/index'));
const VendorPendingEditPage = React.lazy(() =>
  import('./EditVendor/PendingEditPage'),
);
const VendorListingPage = React.lazy(() => import('./VendorListing/index'));
const VendorPendingListingPage = React.lazy(() =>
  import('./VendorListing/PendingList'),
);
const VendorDetailPage = React.lazy(() => import('./VendorDetailPage/index'));

export const VendorConfigs = [
  {
    permittedRole: [
      RoutePermittedRole.tenentAdmin,
      RoutePermittedRole.corporateAdmin,
    ],
    path: '/onboardadmin/vendor/create-form',
    element: <VendorCreateForm />,
  },
  {
    permittedRole: [
      RoutePermittedRole.tenentAdmin,
      RoutePermittedRole.corporateAdmin,
    ],
    path: '/onboardadmin/vendor/editPage/:id',
    element: <VendorEditPage />,
  },
  {
    permittedRole: [
      RoutePermittedRole.tenentAdmin,
      RoutePermittedRole.corporateAdmin,
    ],
    path: '/onboardadmin/pending-vendor/editPage/:id',
    element: <VendorPendingEditPage />,
  },

  {
    permittedRole: [
      RoutePermittedRole.tenentAdmin,
      RoutePermittedRole.corporateAdmin,
    ],
    path: '/onboardadmin/vendor/detailPage/:id',
    element: <VendorDetailPage />,
  },
  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/onboardadmin/vendor/vendor-listing/:type',
    element: <VendorListingPage />,
  },
  {
    permittedRole: [
      RoutePermittedRole.tenentAdmin,
      RoutePermittedRole.corporateAdmin,
    ],
    path: '/onboardadmin/pending-vendor/vendor-listing',
    element: <VendorPendingListingPage />,
  },
];
