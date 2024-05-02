import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';
const CreateForm = React.lazy(() => import('./CreateForm'));
const Table = React.lazy(() => import('./TenentTable'));
const PendingTable = React.lazy(() => import('./TenentTable/pending'));
const DetailPage = React.lazy(() => import('./DetailPage'));
const EditPage = React.lazy(() => import('./EditPage'));
const ActionPage = React.lazy(() => import('./EditPage/pending'));

export const onBordTenentConfigs = [
  {
    permittedRole: RoutePermittedRole.superAdmin,
    path: '/onbordTenent/createForm',
    element: <CreateForm />,
  },
  {
    permittedRole: RoutePermittedRole.superAdmin,
    path: '/superadmin/table',
    element: <Table />,
  },
  {
    permittedRole: RoutePermittedRole.superAdmin,
    path: '/onbordTenent/pending-list',
    element: <PendingTable />,
  },
  {
    permittedRole: RoutePermittedRole.superAdmin,
    path: '/onbordTenent/detailPage/:id',
    element: <DetailPage />,
  },
  {
    permittedRole: RoutePermittedRole.superAdmin,
    path: '/onbordTenent/editPage/:id',
    element: <EditPage />,
  },
  {
    permittedRole: RoutePermittedRole.superAdmin,
    path: '/onbordTenent/action/:id',
    element: <ActionPage />,
  },
  {
    permittedRole: RoutePermittedRole.superAdmin,
    path: '/onbordTenent/action/:id',
    element: <ActionPage />,
  },
];
