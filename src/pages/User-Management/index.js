import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';

const RoleMaster = React.lazy(() => import('./role-master'));
const Permissions = React.lazy(() => import('./permissions'));
const Module = React.lazy(() => import('./masters/module'));
const SubModule = React.lazy(() => import('./masters/subModule'));
const Users = React.lazy(() => import('./corporate'));
export const UserManagementConfig = [
  {
    permittedRole: RoutePermittedRole.superAdmin,
    path: '/roles',
    element: <RoleMaster />,
  },
  {
    permittedRole: RoutePermittedRole.superAdmin,
    path: '/role/permissions/:id',
    element: <Permissions />,
  },
  {
    permittedRole: RoutePermittedRole.superAdmin,
    path: '/master/module',
    element: <Module />,
  },
  {
    permittedRole: RoutePermittedRole.superAdmin,
    path: '/master/submodule',
    element: <SubModule />,
  },
  {
    permittedRole: RoutePermittedRole.corporateAdmin,
    path: '/users/user-role',
    element: <Users />,
  },
];
