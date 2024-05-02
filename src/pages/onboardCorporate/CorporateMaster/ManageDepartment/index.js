import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';

const DepartmentCreateForm= React.lazy(()=>import('./CreateForm'))
const DepartmentEditPage= React.lazy(()=>import('./EditPage'));
const DepartmentListingPage= React.lazy(()=>import('./DepartmentListing'))
const DepartmentDetailPage= React.lazy(()=>import('./DetailPage'));


export const DepartmentConfigs = [
  {
    permittedRole: RoutePermittedRole.corporateAdmin,
    path: '/onboardCorporate/department/create-form',
    element: <DepartmentCreateForm />,
  },
  {
    permittedRole: RoutePermittedRole.corporateAdmin,
    path: '/onboardCorporate/department/edit-form/:id',
    element: <DepartmentEditPage />,
  },
  {
    permittedRole: RoutePermittedRole.corporateAdmin,
    path: '/onboardCorporate/department/detailPage/:id',
    element: <DepartmentDetailPage />,
  },
  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/onboardCorporate/department/department-listing',
    element: <DepartmentListingPage/>,
  },
 

];
