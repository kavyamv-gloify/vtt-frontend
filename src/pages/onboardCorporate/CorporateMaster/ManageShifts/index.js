import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';

const ShiftCreateForm= React.lazy(()=>import('./NewShifts'))
const ShiftEditPage= React.lazy(()=>import('./EditShifts'));
const ShiftListingPage= React.lazy(()=>import('./ShiftListing'))
const ShiftDetailPage= React.lazy(()=>import('./NewShiftsDetails'));


export const ShiftsConfigs = [
  {
    permittedRole: RoutePermittedRole.corporateAdmin,
    path: '/onboardCorporate/shift/create-form',
    element: <ShiftCreateForm />,
  },
  {
    permittedRole: RoutePermittedRole.corporateAdmin,
    path: '/onboardCorporate/shift/edit-form/:id',
    element: <ShiftEditPage />,
  },
  {
    permittedRole: RoutePermittedRole.corporateAdmin,
    path: '/onboardCorporate/shift/detailPage/:id',
    element: <ShiftDetailPage/>,
  },
  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/onboardCorporate/shift/shift-listing',
    element: <ShiftListingPage/>,
  },
 

];
