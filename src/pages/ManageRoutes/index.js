import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';

const Routing = React.lazy(() => import('./manageRoutes'));
// const MasterRoutes = React.lazy(() => import('./Master Route/masterRoutes'));
const MasterRoutes = React.lazy(() =>
  import('./Master Route/masterRoutes_dev'),
);
const RouteLists = React.lazy(() => import('./routeLists'));
// const VendorRouteLists = React.lazy(() => import('./routeLists-vendor'));
const VendorRouteLists = React.lazy(() => import('./Vendor-Routes/index'));
const CreateRoute = React.lazy(() => import('./Create/createRoute'));
const AssignToDriver = React.lazy(() => import('./assign-to-driver'));
const TripSheet = React.lazy(() => import('./TripSheet'));

export const RoutingConfigs = [
  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/manage-route/routing-rule',
    element: <Routing />,
  },
  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/master-routes',
    element: <MasterRoutes />,
  },
  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/create-new-route',
    element: <CreateRoute />,
  },
  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/route-lists/:id',
    element: <RouteLists />,
  },
  {
    permittedRole: RoutePermittedRole.vendor,
    // path: 'route-lists-for-vendor/:id',
    path: '/route-lists-for-vendor/ALL',
    element: <VendorRouteLists />,
  },
  {
    permittedRole: RoutePermittedRole.vendor,
    path: '/assign-route-to-driver',
    element: <AssignToDriver />,
  },
  {
    permittedRole: RoutePermittedRole.corporateAdmin,
    path: '/tripsheet',
    element: <TripSheet />,
  },
];
