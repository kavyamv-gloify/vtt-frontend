import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';

const AboutUs = React.lazy(() => import('./AboutUs'));
const ContactUs = React.lazy(() => import('./ContactUs'));
const KnowledgeBase = React.lazy(() => import('./KnowledgeBase'));
const Portfolio = React.lazy(() => import('./Portfolio'));
const FAQ = React.lazy(() => import('./FAQ'));
const Pricing = React.lazy(() => import('./Pricing'));

export const extraPagesConfigs = [
  {
    permittedRole: RoutePermittedRole.user,
    path: '/extra-pages/about-us',
    element: <AboutUs />,
  },

  {
    permittedRole: RoutePermittedRole.user,
    path: '/extra-pages/knowledge-base',
    element: <KnowledgeBase />,
  },

  {
    permittedRole: RoutePermittedRole.user,
    path: '/extra-pages/portfolio',
    element: <Portfolio />,
  },

  {
    permittedRole: RoutePermittedRole.user,
    path: '/extra-pages/faq',
    element: <FAQ />,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/extra-pages/contact-us',
    element: <ContactUs />,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/extra-pages/pricing',
    element: <Pricing />,
  },
];
