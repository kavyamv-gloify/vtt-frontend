import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';

const EscortCreateForm= React.lazy(()=>import('./EscortRegister'))
const EscortEditPage= React.lazy(()=>import('./EscortEditPage'));
const EscortListingPage= React.lazy(()=>import('./EscortTable'))
const EscortDetailPage= React.lazy(()=>import('./EscortDetailPage'));



export const EscortConfigs = [
  {
    permittedRole: RoutePermittedRole.corporateAdmin,
    path: '/onboardadmin/escort/create-form',
    element: <EscortCreateForm />,
  },
  {
    permittedRole: RoutePermittedRole.corporateAdmin,
    path: '/onboardadmin/escort/editPage/:id',
    element: <EscortEditPage />,
  },
  
 
  {
    permittedRole: RoutePermittedRole.corporateAdmin,
    path: '/onboardadmin/escort/detailPage/:id',
    element: <EscortDetailPage />,
  },
  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/onboardadmin/escort/escort-listing',
    element: <EscortListingPage/>,
  },
  

  
 

];
