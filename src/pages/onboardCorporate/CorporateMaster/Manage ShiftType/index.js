import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';

// const ShiftCreateForm= React.lazy(()=>import('./NewShifts'))
// const ShiftEditPage= React.lazy(()=>import('./EditShifts'));
// const ShiftListingPage= React.lazy(()=>import('./ShiftListing'))
// const ShiftDetailPage= React.lazy(()=>import('./NewShiftsDetails'));

const ShiftTypeCreateForm= React.lazy(()=>import('./NewShiftsType'))
const ShiftListingTypePage= React.lazy(()=>import('./ShiftTypeListing'))
const ShiftTypeEditPage= React.lazy(()=>import('./EditShiftType'));
export const ShiftsTypeConfigs = [
  {
    permittedRole: RoutePermittedRole.corporateAdmin,
    path: '/onboardCorporate/shiftType/create-form',
    element: <ShiftTypeCreateForm />,
  },
  {
    permittedRole: RoutePermittedRole.corporateAdmin,
    path: '/onboardCorporate/shiftType/edit-form/:id',
    element: <ShiftTypeEditPage />,
  },
//   {
//     permittedRole: RoutePermittedRole.corporateAdmin,
//     path: '/onboardCorporate/shiftType/detailPage/:id',
//     element: <ShiftDetailPage/>,
//   },
  {
    permittedRole: RoutePermittedRole.corporateAdmin,
    path: '/onboardCorporate/shiftType/shiftType-listing',
    element: <ShiftListingTypePage/>,
  },
 

];
