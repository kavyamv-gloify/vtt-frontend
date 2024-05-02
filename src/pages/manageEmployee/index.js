import React from 'react';
import { RoutePermittedRole } from 'shared/constants/AppConst';
const EmpolyeeForm = React.lazy(() => import('./EmpolyeeForm'));
const EmpolyeeList = React.lazy(() => import('./EmpolyeeListing'));
const EmployeeDetailPage = React.lazy(() => import('./EmployeeDetailPage'));
const EditEmployee = React.lazy(() => import('./EditEmployee'));
const EmployeePendingList = React.lazy(() => import('./EmpolyeeListing/PendingList'));
const EditPendingRequest = React.lazy(() => import('./EditEmployee/PendingForm'));
const NewEmployeeRequest = React.lazy(() => import('./EmpolyeeListing/NewEmployeeListing'));

export const empolyeeConfigs = [
  {   
    permittedRole: RoutePermittedRole.corporateAdmin,
    path: '/onboardCorporate/employee/create-form',
    element: <EmpolyeeForm />,
    module: 'Master', 
    submodule: 'Employee Register', 
    action: 'Create'
  },
  {
    permittedRole: [RoutePermittedRole.ALL],
    path: '/onboardCorporate/employee/employee-listing',
    element: <EmpolyeeList />,
    module: 'Master', 
    submodule: 'Employee Register', 
    action: 'Create'
  },
  {
    permittedRole: RoutePermittedRole.corporateAdmin,
    path: '/onboardCorporate/empolyee/detailPage/:id',
    element: <EmployeeDetailPage />,
  },
  {
    permittedRole: RoutePermittedRole.corporateAdmin,
    path: '/onboardCorporate/empolyee/editPage/:id',
    element: <EditEmployee />,
  },
  {
    permittedRole: RoutePermittedRole.corporateAdmin,
    path: '/onboardCorporate/pending-empolyee/editPage/:id',
    element: <EditPendingRequest />,
  },
  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/onboardCorporate/employee/pending-list',
    element: <EmployeePendingList />,
  },
  {
    permittedRole: RoutePermittedRole.corporateAdmin,
    path: '/onboardCorporate/employee/newemployee-request',
    element: <NewEmployeeRequest />,
  },
];
