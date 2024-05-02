import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';

const NotificationItems = React.lazy(() => import('./NotificationItems/index'));

export const notificationsConfigs = [
  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/Notifications',
    element: <NotificationItems />,
  },
];
