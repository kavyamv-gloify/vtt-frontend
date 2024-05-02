import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';

const Overview = React.lazy(() => import('./Overview'));
const Layout = React.lazy(() => import('./Layout'));
const Columns = React.lazy(() => import('./Columns'));
const Rows = React.lazy(() => import('./Rows'));
const Editing = React.lazy(() => import('./Editing'));
const Sorting = React.lazy(() => import('./Sorting'));
const Filtering = React.lazy(() => import('./Filtering'));
const Pagination = React.lazy(() => import('./Pagination'));
const Selection = React.lazy(() => import('./Selection'));
const Events = React.lazy(() => import('./Events'));
const Export = React.lazy(() => import('./Export'));
const Components = React.lazy(() => import('./Components'));
const Styling = React.lazy(() => import('./Styling'));
const Localization = React.lazy(() => import('./Localization'));
const Scrolling = React.lazy(() => import('./Scrolling'));
const Virtualization = React.lazy(() => import('./Virtualization'));
const Accessibility = React.lazy(() => import('./Accessibility'));

export const dataGridConfigs = [
  {
    permittedRole: RoutePermittedRole.user,
    path: '/mui/data-grid/overview',
    element: <Overview />,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/mui/data-grid/layout',
    element: <Layout />,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/mui/data-grid/columns',
    element: <Columns />,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/mui/data-grid/rows',
    element: <Rows />,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/mui/data-grid/editing',
    element: <Editing />,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/mui/data-grid/sorting',
    element: <Sorting />,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/mui/data-grid/filtering',
    element: <Filtering />,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/mui/data-grid/pagination',
    element: <Pagination />,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/mui/data-grid/selection',
    element: <Selection />,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/mui/data-grid/events',
    element: <Events />,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/mui/data-grid/export',
    element: <Export />,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/mui/data-grid/components',
    element: <Components />,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/mui/data-grid/styling',
    element: <Styling />,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/mui/data-grid/localization',
    element: <Localization />,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/mui/data-grid/scrolling',
    element: <Scrolling />,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/mui/data-grid/virtualization',
    element: <Virtualization />,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/mui/data-grid/accessibility',
    element: <Accessibility />,
  },
];
