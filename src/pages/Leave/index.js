import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';
const List = React.lazy(() => import('./list'));
const ApprovalList = React.lazy(() => import('./approval-list'));
const LeaveSetting = React.lazy(() => import('./leave-settings'));
const NH = React.lazy(() => import('./NH-B'));
export const LeaveConfig = [
  {
    permittedRole: RoutePermittedRole.employee,
    path: '/leave-listing',
    element: <List />,
  },
  {
    permittedRole: RoutePermittedRole.all,
    path: '/nh-bank1',
    element: <NH />,
  },
  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/all-leave-listing',
    element: <ApprovalList />,
  },
  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/leave-settings',
    element: <LeaveSetting />,
  },
];
