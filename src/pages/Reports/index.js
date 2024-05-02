import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';

const Reports= React.lazy(()=>import('./reports'))
export const ReportConfigs = [
 
    {
        permittedRole: RoutePermittedRole.ALL,
        path: '/master/reports',
        element: <Reports />,
      },
  
];
