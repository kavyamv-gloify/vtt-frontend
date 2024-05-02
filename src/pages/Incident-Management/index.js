import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';

const TicketView = React.lazy(() => import('./IncidentManagement'));
// const Description = React.lazy(() => import('./TicketInformation/index'));
const EmpTicket = React.lazy(() =>
  import('../Incident-Management/EmployeeTab/TicketLisiting'),
);
const TicketInfo = React.lazy(() => import('./TicketInformation/TicketInfo'));
const Practise=React.lazy(() => import('./Settings/practise'))
export const IncidentConfig = [
  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/incident-view',
    element: <TicketView />,
  },
  // {
  //   permittedRole: RoutePermittedRole.ALL,
  //   path: '/ticket-view/:id',
  //   element: <Description />,
  // },
  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/ticket-listing/:id',
    element: <EmpTicket />,
  },
  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/view/:id',
    element: <TicketInfo />,
  },
  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/view/:id',
    element: <TicketInfo />,
  },
  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/auto-practise',
    element: <Practise />,
  },
];
