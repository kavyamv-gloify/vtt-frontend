import React from 'react';
import { RoutePermittedRole } from 'shared/constants/AppConst';
const CreateNodelForm = React.lazy(() => import('./CreateForm'));
const NodalTable = React.lazy(()=>import('./listing'));
const EditForm = React.lazy(()=>import('./EditForm'));


export const NodalPointConfigs = [
    
  
    {
      permittedRole: RoutePermittedRole.corporateAdmin,
      path: '/onbordTenent/NodelPoint/createform',
      element: <CreateNodelForm />,
    },
  
    {
      permittedRole: RoutePermittedRole.ALL,
      path: '/onbordTenent/NodelPoint/table',
      element: <NodalTable />,
    },
  
    {
      permittedRole: RoutePermittedRole.corporateAdmin,
      path: '/onbordTenent/NodelPoint/edit/:id',
      element: <EditForm />,
    },
  ];
  