import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';


// const Create=React.lazy(()=>import('./Createform'))
// const EmployeEdit=React.lazy(()=>import('./EditForm'))
const EscortAgencyTable=React.lazy(()=>import('./EscortAgencyTable'));


export const EscortAgencysConfigs = [
//   {
//     permittedRole: RoutePermittedRole.corporateAdmin,
//     path: '/onboardCorporate/escort-agency/create-form',
//     element: <Create/>,
//   },
//   {
//     permittedRole: RoutePermittedRole.corporateAdmin,
//     path: '/onboardCorporate/special-employee/edit-form/:id',
//     element: <EmployeEdit />,
//   },

  {
    // permittedRole: RoutePermittedRole.corporateAdmin,
    permittedRole: RoutePermittedRole.ALL,
    path: '/onboardCorporate/escort-agency/agency-listing',
    element: <EscortAgencyTable/>,
  },
 

];
