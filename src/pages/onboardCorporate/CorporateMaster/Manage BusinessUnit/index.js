import React from 'react';
import { RoutePermittedRole } from 'shared/constants/AppConst';
// const CreateNodelForm = React.lazy(() => import('./CreateForm'));
// const NodalTable = React.lazy(()=>import('./listing'));
// const EditForm = React.lazy(()=>import('./EditForm'));

const BusinessUnitList= React.lazy(()=>import ('./AccordianList'))
const BusinessUnitForm=React.lazy(()=>import ('./BussinessUnit'))
export const BusinessUnitConfigs = [
    
  
    {
      permittedRole: RoutePermittedRole.ALL,
      path: '/onbordTenent/BussinessUnit/table',
      element: <BusinessUnitList />,
    },
    {
        permittedRole: RoutePermittedRole.corporateAdmin,
        path: '/onbordTenent/BussinessUnit/BussinessUnit-form',
        element: <BusinessUnitForm />,
      },
    
  
  ];
  