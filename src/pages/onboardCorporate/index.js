import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';
const CorporateForm = React.lazy(() => import('./CorporateForm'));
const OnboardPendingCorporateList = React.lazy(() =>
  import('./OnboardeCorporateList/pending'),
);
const OnboardeCorporateList = React.lazy(() =>
  import('./OnboardeCorporateList'),
);
const DetailPage = React.lazy(() => import('./DetailPage'));
const EditPage = React.lazy(() => import('./EditPage'));
const PendingForm = React.lazy(() => import('./EditPage/pending'));
const AssignVehicle = React.lazy(() => import('./AssignDriver/listing'));
const AllotPage = React.lazy(() => import('./AssignDriver/AllotPage'));

export const onbordCorporateConfigs = [
  {
    permittedRole: [
      RoutePermittedRole.tenentAdmin,
      RoutePermittedRole.superAdmin,
    ],
    path: '/onbordCorporate/create',
    element: <CorporateForm />,
  },
  {
    permittedRole: [
      RoutePermittedRole.tenentAdmin,
      RoutePermittedRole.superAdmin,
    ],
    path: '/onbordCorporate/list',
    element: <OnboardeCorporateList />,
  },
  {
    permittedRole: [
      RoutePermittedRole.tenentAdmin,
      RoutePermittedRole.superAdmin,
    ],
    path: '/onbordCorporate/pending-list',
    element: <OnboardPendingCorporateList />,
  },
  {
    permittedRole: [
      RoutePermittedRole.tenentAdmin,
      RoutePermittedRole.superAdmin,
    ],
    path: '/onbordCorporate/pending-list/:id',
    element: <OnboardPendingCorporateList />,
  },

  {
    permittedRole: RoutePermittedRole.tenentAdmin,
    path: '/onbordCorporate/detailPage/:id',
    element: <DetailPage />,
  },
  {
    permittedRole: RoutePermittedRole.tenentAdmin,
    path: '/onbordCorporate/editPage/:id',
    element: <EditPage />,
  },

  {
    permittedRole: RoutePermittedRole.tenentAdmin,
    path: '/onboardCorporate/pending-corporate/:id',
    element: <PendingForm />,
  },

  {
    permittedRole: RoutePermittedRole.tenentAdmin,
    path: '/vehicle-listing',
    element: <AssignVehicle />,
  },
  {
    permittedRole: RoutePermittedRole.tenentAdmin,
    path: '/allotPage',
    element: <AllotPage />,
  },
];
