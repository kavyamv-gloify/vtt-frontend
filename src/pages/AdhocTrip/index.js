import React from 'react';
import { RoutePermittedRole } from 'shared/constants/AppConst';
const List = React.lazy(() => import('./PendingAdhocTrip'));
const Form = React.lazy(() => import('./AdhocTripForm'));
const EmployeeAdhocList = React.lazy(() => import('./AdhocList'));
const EmployeeAdhoc = React.lazy(() => import('./Corporate Adhoc Trip/AdhocList'));

export const AdhocTripConfig = [
  {
    permittedRole: RoutePermittedRole.manager,
    path: '/pending-AdhocTrip',
    element: <List />,
  },
  {
    permittedRole: RoutePermittedRole.employee,
    path: '/AdhocTrip-list',
    element: <EmployeeAdhocList />,
  },
  {
    permittedRole: RoutePermittedRole.employee,
    path: '/createForm-AdhocTrip',
    element: <Form />,
  },
  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/createForm/corporate-AdhocTrip',
    element: <EmployeeAdhoc />,
  },
];
