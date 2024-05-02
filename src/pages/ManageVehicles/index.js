import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';

const VehicleCreateForm = React.lazy(() => import('./RegisterVehicles/index'));
const VehicleEditPage = React.lazy(() => import('./EditVehicles/index'));
const VehicleListingPage = React.lazy(() =>
  import('./RegisterVehiclesListing/index'),
);
const VehicleDriverGpsMapping = React.lazy(() =>
  import('./RegisterVehiclesListing/VehicleDriverGpsMapping'),
);
const VehicleDetailPage = React.lazy(() => import('./VehicleDetailPage/index'));

const VehcileComplainceCreateForm = React.lazy(() =>
  import('./vehicleCompliances/VehicleForm'),
);
const VehicleComplainceLisitng = React.lazy(() =>
  import('./vehicleCompliances/Table'),
);

export const VehicleConfigs = [
  {
    permittedRole: [
      RoutePermittedRole.tenentAdmin,
      RoutePermittedRole.vendor,
      RoutePermittedRole.corporateAdmin,
    ],
    path: '/onboardadmin/vehicle/create-form',
    element: <VehicleCreateForm />,
  },
  {
    permittedRole: [
      RoutePermittedRole.tenentAdmin,
      RoutePermittedRole.vendor,
      RoutePermittedRole.corporateAdmin,
    ],
    path: '/onboardadmin/vehicle/editPage/:id',
    element: <VehicleEditPage />,
  },

  {
    permittedRole: [
      RoutePermittedRole.tenentAdmin,
      RoutePermittedRole.vendor,
      RoutePermittedRole.corporateAdmin,
    ],
    path: '/onboardadmin/vehicle/detailPage/:id',
    element: <VehicleDetailPage />,
  },

  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/onboardadmin/vehicle/vehicle-listing',
    element: <VehicleListingPage />,
  },
  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/onboardadmin/vehicle/vehicle-listing/:id',
    element: <VehicleListingPage />,
  },
  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/vendor/vehicle-compliance/vehicle-listing',
    element: <VehicleComplainceLisitng />,
  },

  {
    permittedRole: [
      RoutePermittedRole.vendor,
      RoutePermittedRole.corporateAdmin,
    ],
    path: '/vendor/vehicle-compliance/form',
    element: <VehcileComplainceCreateForm />,
  },

  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/onboardadmin/vehicle/vehicle-driver-gps-mapping',
    element: <VehicleDriverGpsMapping />,
  },
];
