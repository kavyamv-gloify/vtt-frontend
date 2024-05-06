import React from 'react';
import {Navigate} from 'react-router-dom';
import {initialUrl} from 'shared/constants/AppConst';
import {authRouteConfig} from './auth';
import Error403 from './errorPages/Error403';
import {errorPagesConfigs} from './errorPages';
import {dashBoardConfigs} from './dashboards';
import {extraPagesConfigs} from './extraPages';
import {ecommerceConfig} from './ecommerce';
import {userListConfig} from './userList';
import {userPagesConfig} from './userPages';
import {muiComponentConfigs} from './muiComponents';
import {thirdPartyConfigs} from './thirdParty';
import {appsConfig} from './apps';
import {accountPagesConfigs} from './account';
import {onBordTenentConfigs} from './onBordTenent';
import {onbordCorporateConfigs} from './onboardCorporate';
import {empolyeeConfigs} from './manageEmployee';
import {test} from './test';
import {MasterConfigs} from './Master';
import {DriverShiftConfigs} from './DriverShift';
import {DepartmentConfigs} from './onboardCorporate/CorporateMaster/ManageDepartment';
import {SpecialEmployeeConfigs} from './onboardCorporate/CorporateMaster/SpecialEmployee';
// import {VehiclecostConfigs} from './VehicleTypeCost';
import {PenaltyConfigs} from './Penalty';
import {GpsConfig} from './Master/Gps-Vendor/index';
import {GpsListConfig} from './Master/Gps-list/index';
import {EmployeeCategory} from './onboardCorporate/CorporateMaster/ManageEmployeeCategory';
import {DriverConfigs} from './ManageDrivers';
import {VehicleConfigs} from './ManageVehicles';
import {VendorConfigs} from './ManageVendor';
import {ShiftsConfigs} from './onboardCorporate/CorporateMaster/ManageShifts';
import {DesignationConfigs} from './onboardCorporate/CorporateMaster/ManageDesignation';
import {EscortConfigs} from './ManageEscort';
import {SiteOfficeConfigs} from './ManagesiteOffice';
import {BusinessUnitConfigs} from './onboardCorporate/CorporateMaster/Manage BusinessUnit';
import {HolidayConfigs} from './onboardCorporate/CorporateMaster/Manageholidays';
import {home} from './home';
import {Routes} from './Routes-OLD';
import {NodalPointConfigs} from './NodelPoint';
import {RoutingConfigs} from './ManageRoutes';
import {mapplsConfigs} from './ManageMappls';
import {liveTracking} from './ManageLiveTracking';
import {rosterConfigs} from './Roster';
import {vTypeConfigs} from './VTypeCost';
import {ShiftConfigs} from './ManageShifts';
import {LiveTripConfig} from './onboardCorporate/CorporateMaster/LiveTrip/index';
import {LeaveConfig} from './Leave';
import {ShiftsTypeConfigs} from './onboardCorporate/CorporateMaster/Manage ShiftType/index';
import {AnnouncementConfigs} from './onboardCorporate/CorporateMaster/Announcement/index';
// import {IncedentManagementConfig} from './Incedent-management/index';
import {ComplianceConfig} from './compliances/index';
import {AdhocTripConfig} from './AdhocTrip/index';
import {EscortAgencysConfigs} from './onboardCorporate/CorporateMaster/ManageEscortAgency/index';
import {UserManagementConfig} from './User-Management';
import {ReportConfigs} from './Reports';
import {FeedBackConfigs} from './FeedBack';
import {IVRConfig} from './IVR';
import {BillingsConfigs} from './Billings';
import {TrainingVideoConfig} from './Training Video';
import {RateCardConfigs} from './Rate Card';
import {InvoicingConfig} from './Invoicing';
import {CustomerPageConfig} from './CustomerPage/index';
import {FuelTrackConfigs} from './FuelTracking/index';
import {IncidentConfig} from './Incident-Management/index';
import {YourRideConfigs} from './YourRide';
import {DriversShiftConfigs} from '../pages/DriversShift/index';
import {UserConfigs} from './EtravelMate User/index';
import {VendorUserConfigs} from './Vendor-User-Management/index';

import {DriverConsentConfigs} from './DriverConsent/index';
import {DriverAttendenceConfigs} from './DriverAttendence/index';
import {notificationsConfigs} from './Notifications/index';
import {FuelPriceConfig} from './FuelPrice/index';
import {AssociateConfig} from './Association/index';
import {NewGpsListConfig} from './GPS_VENDOR/index';
import {POCMapConfig} from './POCMap';
import {VehicleDriverConfig} from './Vehicle-Driver/index';
const authorizedStructure = {
  fallbackPath: '/home',
  unAuthorizedComponent: <Error403 />,
  routes: [
    ...IVRConfig,
    ...notificationsConfigs,
    ...InvoicingConfig,
    ...MasterConfigs,
    ...RateCardConfigs,
    ...BillingsConfigs,
    ...DriversShiftConfigs,
    ...onBordTenentConfigs,
    ...onbordCorporateConfigs,
    ...dashBoardConfigs,
    ...accountPagesConfigs,
    ...appsConfig,
    ...thirdPartyConfigs,
    ...extraPagesConfigs,
    ...ecommerceConfig,
    ...muiComponentConfigs,
    ...userPagesConfig,
    ...userListConfig,
    ...test,
    ...home,
    ...Routes,
    ...empolyeeConfigs,
    ...DepartmentConfigs,
    ...DriverConsentConfigs,
    ...DriverConfigs,
    ...ShiftConfigs,
    ...VehicleConfigs,
    ...VendorConfigs,
    ...ShiftsConfigs,
    ...EscortConfigs,
    ...SiteOfficeConfigs,
    ...HolidayConfigs,
    ...NodalPointConfigs,
    ...RoutingConfigs,
    ...mapplsConfigs,
    ...liveTracking,
    ...rosterConfigs,
    ...SpecialEmployeeConfigs,
    ...DesignationConfigs,
    ...EmployeeCategory,
    // ...VehiclecostConfigs,
    ...PenaltyConfigs,
    ...GpsConfig,
    ...GpsListConfig,
    ...vTypeConfigs,
    ...BusinessUnitConfigs,
    ...LiveTripConfig,
    ...LeaveConfig,
    ...ShiftsTypeConfigs,
    // ...IncedentManagementConfig,
    ...AnnouncementConfigs,
    ...ComplianceConfig,
    ...AdhocTripConfig,
    ...EscortAgencysConfigs,
    ...UserManagementConfig,
    ...ReportConfigs,
    ...FeedBackConfigs,
    ...TrainingVideoConfig,
    ...CustomerPageConfig,
    ...FuelTrackConfigs,
    ...IncidentConfig,
    ...YourRideConfigs,
    ...UserConfigs,
    ...VendorUserConfigs,
    ...DriverAttendenceConfigs,
    ...FuelPriceConfig,
    ...AssociateConfig,
    ...NewGpsListConfig,
    ...POCMapConfig,
    ...VehicleDriverConfig,
  ],
};

const unAuthorizedStructure = {
  fallbackPath: initialUrl,
  routes: authRouteConfig,
};
const anonymousStructure = {
  routes: errorPagesConfigs.concat([
    {
      path: '/',
      element: <Navigate to={initialUrl} />,
    },
    {
      path: '*',
      element: <Navigate to='/error-pages/error-404' />,
    },
  ]),
};

export {authorizedStructure, unAuthorizedStructure, anonymousStructure};
