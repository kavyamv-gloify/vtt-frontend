import React from 'react';
import { RoutePermittedRole } from 'shared/constants/AppConst';

const FeedBack = React.lazy(() => import('./FeedBack'))
export const FeedBackConfigs = [

    {
        permittedRole: RoutePermittedRole.ALL,
        path: '/feedback-view',
        element: <FeedBack />,
    },

];
