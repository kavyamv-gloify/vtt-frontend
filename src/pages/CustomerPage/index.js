import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';
const CustomerPage = React.lazy(() => import('./CustomerPage'));
const ComplianceAssociation = React.lazy(() =>
  import('./CorporateModule/Compliance Association'),
);
const CorporatePage = React.lazy(() => import('./CorporatePage'));
const VendorPage = React.lazy(() => import('./VendorPage'));
const SettingModule = React.lazy(() =>
  import('./CorporateModule/SettingModule'),
);
const CorportaeModulePage = React.lazy(() =>
  import('./CorporateModule/CorporateMasterPage'),
);
const MasterModule = React.lazy(() => import('./CorporateModule/MasterModule'));
const RouteModule = React.lazy(() => import('./CorporateModule/RouteModule'));
const PendingProfile = React.lazy(() => import('./PendingProfile'));

export const CustomerPageConfig = [
  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/customer-page',
    element: <CustomerPage />,
  },
  {
    permittedRole: RoutePermittedRole.superAdmin,
    path: '/compliance-association/:id',
    element: <ComplianceAssociation />,
  },
  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/customer-page/corporatapage/:id/:logo',
    element: <CorporatePage />,
  },
  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/customer-page/corporatapage/vendorPage/:id',
    element: <VendorPage />,
  },
  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/customer-page/corporate/corporate-modules',
    element: <CorportaeModulePage />,
  },
  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/customer-page/masterpage/corporate-modules/master',
    element: <MasterModule />,
  },
  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/customer-page/masterpage/corporate-modules/route',
    element: <RouteModule />,
  },
  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/customer-page/masterpage/corporate-modules/setting',
    element: <SettingModule />,
  },
  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/customer-page/masterpage/pending-request',
    element: <PendingProfile />,
  },
  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/customer-page/masterpage/vendor-to-driver',
    element: <PendingProfile />,
  },
];
