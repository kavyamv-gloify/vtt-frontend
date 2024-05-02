import React from 'react';
import { RoutePermittedRole } from 'shared/constants/AppConst';

const DriverShiftForm = React.lazy(() => import('./CreateForm'));
const DriverShiftList=React.lazy(()=>import('./DriverListTable'))
const DriverShiftEditForm= React.lazy(()=>import('./EditForm'));
const DriverShiftListDetailForm= React.lazy(()=>import('./DetailPage'));

export const DriverShiftConfigs = [

    {
        permittedRole: RoutePermittedRole.vendor,
        path: '/Master/drivershiftForm/create',
        element: <DriverShiftForm />,
    },

    {
        permittedRole: RoutePermittedRole.vendor,
        path: '/Master/drivershift/table',
        element: <DriverShiftList />,
    },

    {
        permittedRole: RoutePermittedRole.vendor,
        path: '/Master/drivershift/editForm/:id',
        element: <DriverShiftEditForm />,
    },
    {
        permittedRole: RoutePermittedRole.vendor,
        path: '/Master/drivershift/detailForm/:id',
        element: <DriverShiftListDetailForm />,
    },


]