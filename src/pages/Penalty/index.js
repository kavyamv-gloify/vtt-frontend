import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';

// const ShiftCreateForm= React.lazy(()=>import('./NewShifts'))
// const ShiftEditPage= React.lazy(()=>import('./EditShifts'));
// const ShiftListingPage= React.lazy(()=>import('./ShiftListing'))
// const ShiftDetailPage= React.lazy(()=>import('./NewShiftsDetails'));


const PenaltyCreate=React.lazy(()=>import('./CreateForm'));
const PenaltyTable=React.lazy(()=>import('./Table'));

export const PenaltyConfigs = [
  {
    permittedRole: [RoutePermittedRole.corporateAdmin,RoutePermittedRole.vendor],
    path: '/onboardCorporate/penalty/create-form',
    element: <PenaltyCreate />,
  },
//   {
//     permittedRole:[RoutePermittedRole.corporateAdmin,RoutePermittedRole.vendor],
//     path: '/onboardCorporate/penalty/edit-form/:id',
//     element: <ShiftEditPage />,
//   },
//   {
//     permittedRole:[RoutePermittedRole.corporateAdmin,RoutePermittedRole.vendor],
//     path: '/onboardCorporate/penalty/detailPage/:id',
//     element: <ShiftDetailPage/>,
//   },
  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/onboardCorporate/penalty/penalty-listing',
    element: <PenaltyTable/>,
  },
 

];
