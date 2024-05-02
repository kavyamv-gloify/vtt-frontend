import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';

const EmployeeCategoryForm=React.lazy(() => import('./Form'));
const EmployeeCategoryTable=React.lazy(() => import('./Table'));
export const EmployeeCategory = [
  {
    permittedRole: RoutePermittedRole.corporateAdmin,
    path: '/onboardCorporate/employee-category/create-form',
    element: <EmployeeCategoryForm />,
  },
  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/onboardCorporate/employee-category/employee-category-table',
    element: <EmployeeCategoryTable />,
  },

];
