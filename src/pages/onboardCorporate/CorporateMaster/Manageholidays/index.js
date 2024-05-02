import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';

const HolidayCreateForm= React.lazy(()=>import('./Createform'))
const HolidayEditPage= React.lazy(()=>import('./EditPage'));
const HolidayListingPage= React.lazy(()=>import('./Holidaylisting'))


export const HolidayConfigs = [
  {
    permittedRole: RoutePermittedRole.corporateAdmin,
    path: '/onboardCorporate/holiday/create-form/:id',
    element: <HolidayCreateForm />,
  },
  {
    permittedRole: RoutePermittedRole.corporateAdmin,
    path: '/onboardCorporate/holiday/edit-form/:id',
    element: <HolidayEditPage/>,
  },
  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/onboardCorporate/holiday/holiday-listing',
    element: < HolidayListingPage/>,
  },
 

];
