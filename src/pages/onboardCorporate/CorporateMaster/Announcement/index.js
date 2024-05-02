import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';


const AnnouncementCreate=React.lazy(()=>import('./NewAnnouncement'))
const AnnouncementEdit=React.lazy(()=>import('./EditAnnouncement'))
const AnnouncementTable=React.lazy(()=>import('./AnnouncementLisiting'));
const Dummyeditior= React.lazy(()=>import ('./dummyckeditor'));

export const AnnouncementConfigs = [
  {
    permittedRole: RoutePermittedRole.corporateAdmin,
    path: '/onboardCorporate/announcement/create-form',
    element: <AnnouncementCreate />,
  },
  {
    permittedRole: RoutePermittedRole.corporateAdmin,
    path: '/onboardCorporate/announcement/edit-form/:id',
    element: <AnnouncementEdit />,
  },

  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/onboardCorporate/announcement/announcement-listing',
    element: <AnnouncementTable/>,
  },

  {
    permittedRole: RoutePermittedRole.corporateAdmin,
    path: '/onboardCorporate/announcement/ckeditor',
    element: <Dummyeditior/>,
  },
 

];
