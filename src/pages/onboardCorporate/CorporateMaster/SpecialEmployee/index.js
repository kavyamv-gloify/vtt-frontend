import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';


const EmployeCreate=React.lazy(()=>import('./Createform'))
const EmployeEdit=React.lazy(()=>import('./EditForm'))
const EmployeTable=React.lazy(()=>import('./Table'));


export const SpecialEmployeeConfigs = [
  {
    permittedRole: RoutePermittedRole.corporateAdmin,
    path: '/onboardCorporate/special-employee/create-form',
    element: <EmployeCreate />,
  },
  {
    permittedRole: RoutePermittedRole.corporateAdmin,
    path: '/onboardCorporate/special-employee/edit-form/:id',
    element: <EmployeEdit />,
  },

  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/onboardCorporate/special-employee/specialemployee-listing',
    element: <EmployeTable/>,
  },
 

];
