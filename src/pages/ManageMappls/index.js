import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';

const PlacePicker= React.lazy(()=>import('./placePicker'))
const DirectionWithMultipleViaPoints= React.lazy(()=>import('./directionWithMultipleViaPoints'))
const LiveTracking= React.lazy(()=>import('./liveTracking'))
const InTouchSdk= React.lazy(()=>import('./intouchsdk'))
const DashboardView= React.lazy(()=>import('./dashboardView'))
const MapplForm= React.lazy(()=>import('./mapplForm'))


export const mapplsConfigs = [
  {
    permittedRole: RoutePermittedRole.corporateAdmin,
    path: '/manage-mappls/place-picker',
    element: <PlacePicker />,
  },
  {
    permittedRole: RoutePermittedRole.corporateAdmin,
    path: '/manage-mappls/direction-with-multiple-via-points',
    element: <DirectionWithMultipleViaPoints />,
  },
  {
    permittedRole: [RoutePermittedRole.corporateAdmin, RoutePermittedRole.vendor],
    path: '/manage-mappls/live-tracking',
    element: <LiveTracking />,
  },
  {
    permittedRole: RoutePermittedRole.corporateAdmin,
    path: '/manage-mappls/intouchsdk',
    element: <InTouchSdk />,
  },
  {
    permittedRole: [RoutePermittedRole.corporateAdmin, RoutePermittedRole.vendor],
    path: '/manage-mappls/dashboard-view',
    element: <DashboardView />,
  },
  {
    permittedRole: RoutePermittedRole.corporateAdmin,
    path: '/manage-mappls/test-form',
    element: <MapplForm />,
  },
  

];
