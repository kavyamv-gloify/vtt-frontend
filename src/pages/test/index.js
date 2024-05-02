import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';
import Test from './Test';

export const test = [
  {
    permittedRole: RoutePermittedRole.user,
    path: '/test',
    element: <Test />,
  },
];
