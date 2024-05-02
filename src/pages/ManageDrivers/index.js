import React from 'react';
import { RoutePermittedRole } from 'shared/constants/AppConst';
import { useAuthUser } from '@crema/utility/AuthHooks';
const DriverCreateForm = React.lazy(() => import('./RegisterDriver/index'))
const DriverEditPage = React.lazy(() => import('./EditDrivers/index'));
const DriverPendingEditPage = React.lazy(() => import('./EditDrivers/PendingEditPage'));
const DriverListingPage = React.lazy(() => import('./RegisterDriverListing/index'))
const DriverPendingListingPage = React.lazy(() => import('./RegisterDriverListing/PendingList'))
const DriverDetailPage = React.lazy(() => import('./DriverListingDetailPage/index'));
// const Compliance = React.lazy(() => import('./Compliances/ComplianceForm'))
const ComplainceLisitng = React.lazy(() => import('./Compliances'));


export const DriverConfigs = [
  {
    permittedRole: [ RoutePermittedRole.tenentAdmin, RoutePermittedRole.vendor, RoutePermittedRole.corporateAdmin],  
    // permittedRole: [RoutePermittedRole.vendor, ],
    path: '/onboardadmin/driver/create-form',
    element: <DriverCreateForm />,
  },
  {
    permittedRole: [ RoutePermittedRole.tenentAdmin, RoutePermittedRole.vendor,  RoutePermittedRole.corporateAdmin],  
    // permittedRole: [RoutePermittedRole.vendor],
    path: '/onboardadmin/driver/editPage/:id',
    element: <DriverEditPage />,
  },
  {
    permittedRole: [ RoutePermittedRole.tenentAdmin, RoutePermittedRole.vendor,  RoutePermittedRole.corporateAdmin],  
    // permittedRole: [RoutePermittedRole.vendor],
    path: '/onboardadmin/pending-driver/editPage/:id',
    element: < DriverPendingEditPage />,
  },

  {
   permittedRole: [ RoutePermittedRole.tenentAdmin, RoutePermittedRole.vendor,  RoutePermittedRole.corporateAdmin],  
  //  permittedRole: [  RoutePermittedRole.vendor],  
    path: '/onboardadmin/driver/detailPage/:id',
    element: <DriverDetailPage />,
  },
  {
    permittedRole: RoutePermittedRole.ALL,  
    // permittedRole: [  RoutePermittedRole.vendor],  
    path: '/onboardadmin/driver/driver-listing',
    element: <DriverListingPage />,
  },
  {
    permittedRole: RoutePermittedRole.ALL,  
    // permittedRole: [  RoutePermittedRole.vendor],  
    path: '/onboardadmin/driver/driver-listing/:type',
    element: <DriverListingPage />,
  },
  {
    permittedRole: [ RoutePermittedRole.tenentAdmin, RoutePermittedRole.vendor,  RoutePermittedRole.corporateAdmin],  
    // permittedRole: [  RoutePermittedRole.vendor],  
    path: '/onboardadmin/pending-driver/driver-listing',
    element: <DriverPendingListingPage />,
  },

  {
    // permittedRole: [ RoutePermittedRole.tenentAdmin, RoutePermittedRole.vendor,  RoutePermittedRole.corporateAdmin],
    permittedRole: RoutePermittedRole.ALL,  
    // permittedRole: [  RoutePermittedRole.vendor],  
    path: '/compliance-listing',
    element: <ComplainceLisitng />,
  },

  // {
  //   permittedRole: [ RoutePermittedRole.tenentAdmin, RoutePermittedRole.vendor,  RoutePermittedRole.corporateAdmin],  
  //   // permittedRole: [  RoutePermittedRole.vendor],  
  //   path: '/vendor/driver-compliance/form',
  //   element: <Compliance />,
  // },


];
