import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';
const EmployeeRoster = React.lazy(() => import('./employee-roster/CreateRoaster'));
const ManagerRoster = React.lazy(() => import('./manager-roster/CreateRoaster'));
const CorporateRoster = React.lazy(() => import('./corporate-roster/CreateRoaster'));
const RosterSettingList = React.lazy(() => import('./Roster-Settings/listing'));
// const EmployeeRosterReqList = React.lazy(() => import('./employee-roster/roster-list'));
// const EmployeeRosterReqForManager = React.lazy(() => import('./manager-roster/roster-list'));

export const rosterConfigs = [
  // {
  //   permittedRole: RoutePermittedRole.employee,
  //   path: '/rosters/my-roster-list',
  //   element: <EmployeeRosterReqList />,
  // },
  {
    permittedRole: RoutePermittedRole.employee,
    path: '/rosters/my-roster-req',
    element: <EmployeeRoster />,
  },
  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/roster-setting-list',
    element: <RosterSettingList />,
  },
  // {
  //   permittedRole: [RoutePermittedRole.manager, RoutePermittedRole.corporateAdmin],
  //   path: '/rosters/roster-req-list/:id',
  //   element: <EmployeeRosterReqForManager />,
  // },
  {
    permittedRole: RoutePermittedRole.manager,
    path: '/rosters/roster-creation',
    element: <ManagerRoster />,
  },
  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/rosters/roster-page',
    element: <CorporateRoster />,
  },

];
