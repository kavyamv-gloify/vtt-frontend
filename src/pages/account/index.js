import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';
// import Account from './MyProfile';
// import TenantAdminInfoDuplicate from './MyProfile/PersonalInfo/TenantAdminInfoDuplicate';

import TenantAdminInfo from './MyProfile/AccountProfile/TenantProfile';
// import CorporateAdminInfo from './MyProfile/AccountProfile/CorporateProfile';
import EmployeeProfileForm from './MyProfile/AccountProfile/EmployeeProfile';
import VendorProfileInfo from './MyProfile/AccountProfile/VendorProfileForm'
import AllDefaultProfile from './MyProfile/AccountProfile';
import AllActiveProfile from './MyProfile/ActiveProfile';



export const accountPagesConfigs = [
  {
    permittedRole: RoutePermittedRole.all,
    path: '/my-profile',
    element: <AllDefaultProfile/>,
  },

  {
    permittedRole:RoutePermittedRole.all,
    path:'/my-profile-update-req',
    element: <AllActiveProfile/>,
  }
  // {
  //   permittedRole: RoutePermittedRole.corporateAdmin,
  //   path: '/corporate-profile',
  //   element: <CorporateAdminInfo/>,
  // },
  
  
];
