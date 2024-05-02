import React from 'react';
import { RoutePermittedRole } from 'shared/constants/AppConst';
import { useAuthUser } from '@crema/utility/AuthHooks';
// const DriverCreateForm = React.lazy(() => import('./RegisterDriver/index'))
// const DriverEditPage = React.lazy(() => import('./EditDrivers/index'));
// const DriverPendingEditPage = React.lazy(() => import('./EditDrivers/PendingEditPage'));
const ShiftListingPage = React.lazy(() => import('./RegisterShiftListing/index'))
// const DriverPendingListingPage = React.lazy(() => import('./RegisterDriverListing/PendingList'))
// const DriverDetailPage = React.lazy(() => import('./DriverListingDetailPage/index'));

// const DriverComplainceCreateForm = React.lazy(() => import('./DriverCompliances/ComplianceForm'))
// const DriverComplainceLisitng = React.lazy(() => import('./DriverCompliances/Driverlisting'));


export const ShiftConfigs = [
  // {
  //   permittedRole: [ RoutePermittedRole.tenentAdmin, RoutePermittedRole.vendor],  
  //   // permittedRole: [RoutePermittedRole.vendor, ],
  //   path: '/onboardadmin/driver/create-form',
  //   element: <DriverCreateForm />,
  // },
  // {
  //   permittedRole: [ RoutePermittedRole.tenentAdmin, RoutePermittedRole.vendor],  
  //   // permittedRole: [RoutePermittedRole.vendor],
  //   path: '/onboardadmin/driver/editPage/:id',
  //   element: <DriverEditPage />,
  // },
  // {
  //   permittedRole: [ RoutePermittedRole.tenentAdmin, RoutePermittedRole.vendor],  
  //   // permittedRole: [RoutePermittedRole.vendor],
  //   path: '/onboardadmin/pending-driver/editPage/:id',
  //   element: < DriverPendingEditPage />,
  // },

  // {
  //  permittedRole: [ RoutePermittedRole.tenentAdmin, RoutePermittedRole.vendor],  
  // //  permittedRole: [  RoutePermittedRole.vendor],  
  //   path: '/onboardadmin/driver/detailPage/:id',
  //   element: <DriverDetailPage />,
  // },
  {
    permittedRole: [ RoutePermittedRole.tenentAdmin, RoutePermittedRole.vendor],  
    // permittedRole: [  RoutePermittedRole.vendor],  
    path: '/onboardadmin/shift/shift-listing',
    element: <ShiftListingPage />,
  },
  // {
  //   permittedRole: [ RoutePermittedRole.tenentAdmin, RoutePermittedRole.vendor],  
  //   // permittedRole: [  RoutePermittedRole.vendor],  
  //   path: '/onboardadmin/pending-driver/driver-listing',
  //   element: <DriverPendingListingPage />,
  // },

  // {
  //   permittedRole: [ RoutePermittedRole.tenentAdmin, RoutePermittedRole.vendor],  
  //   // permittedRole: [  RoutePermittedRole.vendor],  
  //   path: '/compliance-listing',
  //   element: <DriverComplainceLisitng />,
  // },

  // {
  //   permittedRole: [ RoutePermittedRole.tenentAdmin, RoutePermittedRole.vendor],  
  //   // permittedRole: [  RoutePermittedRole.vendor],  
  //   path: '/vendor/driver-compliance/form',
  //   element: <DriverComplainceCreateForm />,
  // },


];
