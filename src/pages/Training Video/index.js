import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';
const TrainingVideo = React.lazy(() => import('./main'));
export const TrainingVideoConfig = [
  {
    permittedRole: RoutePermittedRole.all,
    path: '/trainingVideo',
    element: <TrainingVideo />,
  },
];
