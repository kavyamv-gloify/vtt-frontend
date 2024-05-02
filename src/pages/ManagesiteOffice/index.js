import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';

const SiteofficeCreateForm= React.lazy(()=>import('./RegisterSiteoffice/index'))
const SiteofficeEditPage= React.lazy(()=>import('./EditSiteOffceForm/EditForm'));
const SiteofficeListingPage= React.lazy(()=>import('./SiteOfficeListing/index'))
const SiteofficeDetailPage= React.lazy(()=>import('./DetailSiteOfficepage/DetailPage'));


export const SiteOfficeConfigs = [
{
    permittedRole: [RoutePermittedRole.corporateAdmin],
    path: '/onbordCorporate/siteOffice/create-form',
    element: <SiteofficeCreateForm />,
  },
  {
    // permittedRole: [RoutePermittedRole.corporateAdmin],
    permittedRole: RoutePermittedRole.ALL,
    path: '/onbordCorporate/siteOffice/siteoffice-listing',
    element: <SiteofficeListingPage />,
  },
  {
    permittedRole: [RoutePermittedRole.corporateAdmin, RoutePermittedRole.tenentAdmin],
    path: '/onbordCorporate/siteOffice/edit-form/:id',
    element: <SiteofficeEditPage />,
  },
  {
    permittedRole: [RoutePermittedRole.corporateAdmin, RoutePermittedRole.tenentAdmin],
    path: '/onbordCorporate/siteOffice/detailPage/:id',
    element: <SiteofficeDetailPage/>,
  }
];