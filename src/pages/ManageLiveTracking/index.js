import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';

const LiveTracking= React.lazy(()=>import('./liveTracking'))
const DashboardView= React.lazy(()=>import('./dashboardView'))
const LiveTrackInfo= React.lazy(()=> import ('./liveTrickInfo'))
const GoogleTracking= React.lazy(()=> import ('./GOOGLE'))
const GoogleTrackingDashBoard= React.lazy(()=> import ('./GOOGLE/Dashboard'))


export const liveTracking = [
  {
    permittedRole: RoutePermittedRole.corporateAdmin,
    path: '/live-tracking/:type',
    element: <LiveTracking />,
  },
  {
    permittedRole: [RoutePermittedRole.corporateAdmin, RoutePermittedRole.vendor],
    path: '/dashboard-view',
    element: <DashboardView />,
  },
  {
    permittedRole: [RoutePermittedRole.corporateAdmin, RoutePermittedRole.vendor],
    path: '/live-tracking-info/:id',
    element: <LiveTrackInfo />,
  },
  {
    permittedRole: RoutePermittedRole.all,
    path: '/test-live-tracking/:id',
    element: <GoogleTracking />,
  },  
  {
    permittedRole: RoutePermittedRole.all,
    path: '/test-live-tracking-dashboard/:type',
    element: <GoogleTrackingDashBoard />,
  },  

];
