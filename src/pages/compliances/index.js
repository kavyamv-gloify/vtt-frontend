import React from 'react';
import { RoutePermittedRole } from 'shared/constants/AppConst';
const List = React.lazy(() => import('./ComplianceLisiting/index.js'))
const Create= React.lazy(() => import('./Add Compliance/index'))
// const ApprovalList = React.lazy(() => import('./AssignComplaince/index.js'))
const ComplianceSettings = React.lazy(() => import('./Setting'))
// const LeaveSetting = React.lazy(() => import('./leave-settings'));
export const ComplianceConfig = [
  {
    permittedRole: [RoutePermittedRole.superAdmin],
    path: '/Master/compliance/compliance-list',
    element: <List />,
  },
  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/compliance/settings',
    element: <ComplianceSettings />,
  },
  {
    permittedRole: [RoutePermittedRole.superAdmin],
    path: '/Master/compliance/compliance-create',
    element: <Create />,
  },
  // {
  //   permittedRole: [ RoutePermittedRole.tenantAdmin],
  //   path: '/Master/compliance/assigncompliance',
  //   element: <ApprovalList />,
  // },
//   {
//     permittedRole: RoutePermittedRole.corporateAdmin,
//     path: '/leave-settings',
//     element: <LeaveSetting />,
//   },
];