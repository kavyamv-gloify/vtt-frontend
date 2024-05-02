import {HiUserCircle, HiCalendar, HiUserGroup, HiHome} from 'react-icons/hi';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import ScheduleIcon from '@mui/icons-material/Schedule';
import DnsIcon from '@mui/icons-material/Dns';
import SupportIcon from '@mui/icons-material/Support';
import SettingsIcon from '@mui/icons-material/Settings';
import {RoutePermittedRole} from 'shared/constants/AppConst';
import LanIcon from '@mui/icons-material/Lan';
import PeopleIcon from '@mui/icons-material/People';
import StorefrontIcon from '@mui/icons-material/Storefront';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BusinessIcon from '@mui/icons-material/Business';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SellIcon from '@mui/icons-material/Sell';
import CommuteIcon from '@mui/icons-material/Commute';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import RuleFolderIcon from '@mui/icons-material/RuleFolder';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import RateReviewIcon from '@mui/icons-material/RateReview';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import FestivalIcon from '@mui/icons-material/Festival';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import FeedIcon from '@mui/icons-material/Feed';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import StyleIcon from '@mui/icons-material/Style';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import AddTaskIcon from '@mui/icons-material/AddTask';
// import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
const routesConfig = [
  {
    id: 'home',
    title: 'Home',
    messageId: 'Home',
    permittedRole: RoutePermittedRole.all,
    icon: <HiHome />,
    type: 'item',
    url: '/dashboard',
  },
  // {
  //   id: 'taxes',
  //   title: 'Taxes',
  //   messageId: 'Taxes',
  //   permittedRole: RoutePermittedRole.vendor,
  //   type: 'item',
  //   url: '/taxes',
  //   icon: <HiUserCircle />,
  // },
  {
    id: 'taxes',
    title: 'Taxes',
    messageId: 'Taxes',
    module: 'Taxes',
    submodule: 'Taxes',
    iconUrl: 'Taxes',
    permittedRole: RoutePermittedRole.ALL,
    icon: <HiUserCircle />,
    type: 'item',
    url: '/taxes',
  },
  // {
  //   id: 'onBordTenet',
  //   title: 'Register Tenant',
  //   module: 'Manage SuperAdmins',
  //   submodule: 'Manage Super Admins',
  //   messageId: 'Manage Super Admins',
  //   permittedRole: RoutePermittedRole.superAdmin,
  //   type: 'item',
  //   url: '/superadmin/table',
  //   icon: <HiUserCircle />,
  // },
  {
    id: 'manageThemess',
    title: 'Manage Themes',
    messageId: 'Themes',
    permittedRole: RoutePermittedRole.superAdmin,
    type: 'item',
    url: '/theme-masters',
    icon: <ColorLensIcon sx={{fontSize: '20px'}} />,
  },
  {
    id: 'manageusers',
    title: 'Manage Users',
    messageId: 'Users',
    permittedRole: RoutePermittedRole.superAdmin,
    type: 'item',
    url: '/users',
    icon: <HiUserCircle />,
  },

  {
    id: 'manageRoles',
    title: 'Manage Roles',
    module: 'Manage Roles',
    submodule: 'Manage Roles',
    messageId: 'Roles',
    permittedRole: RoutePermittedRole.superAdmin,
    type: 'item',
    url: '/roles',
    icon: <SupervisedUserCircleIcon sx={{fontSize: '22px'}} />,
  },

  // {
  //   id: 'table',
  //   title: 'customerpage',
  //   messageId: 'Customer Page',
  //   iconUrl: 'Trainingvideo',
  //   permittedRole: [RoutePermittedRole.superAdmin],
  //   type: 'item',
  //   icon: <SupervisorAccountIcon sx={{fontSize: 'medium'}} />,
  //   // icon: (
  //   //   <img
  //   //     className='sidebar-icon'
  //   //     src={'/assets/images/specialEmployee.svg'}
  //   //   />
  //   // ),
  //   url: '/customer-page',
  // },
  {
    id: 'customerpage',
    title: 'customerpage',
    messageId: 'Customers ',
    permittedRole: RoutePermittedRole.superAdmin,
    type: 'item',
    url: '/customer-page',
    icon: <HomeWorkIcon sx={{fontSize: 'large'}} />,
    // icon: (
    //   <img
    //     className='sidebar-icon'
    //     src={'/assets/images/specialEmployee.svg'}
    //   />
    // ),
  },
  {
    id: 'MasterSupport',
    title: 'Support Master',
    messageId: 'Support Master',
    permittedRole: RoutePermittedRole.superAdmin,
    type: 'collapse',
    iconUrl: '',
    icon: <SupportAgentIcon sx={{fontSize: 'large'}} />,
    children: [
      {
        id: 'createDepartment',
        title: 'Topics',
        messageId: 'Topics',
        permittedRole: RoutePermittedRole.superAdmin,
        type: 'item',
        url: '/Master/support/topic-list',
        icon: <SupervisorAccountIcon />,
      },
      {
        id: 'createDepartment',
        title: 'FAQs',
        messageId: 'FAQs',
        permittedRole: RoutePermittedRole.superAdmin,
        type: 'item',
        url: '/Master/support/faq-list',
        icon: <ContactSupportIcon sx={{fontSize: '22px'}} />,
      },
    ],
  },
  {
    id: 'VehicleMaster',
    title: 'Vehicle Master',
    messageId: 'Vehicle Master',
    permittedRole: RoutePermittedRole.superAdmin,
    type: 'collapse',
    iconUrl: '',
    icon: <DriveEtaIcon sx={{fontSize: '22px'}} />,
    children: [
      {
        id: 'createDepartment',
        title: 'Vehicle Color Theme',
        messageId: 'Vehicle Color Theme',
        permittedRole: RoutePermittedRole.superAdmin,
        type: 'item',
        url: '/vehicle-color',
        icon: <StyleIcon sx={{fontSize: '22px'}} />,
      },
      {
        id: 'createDepartment',
        title: 'Vehicle Type',
        messageId: 'Vehicle Type',
        permittedRole: RoutePermittedRole.superAdmin,
        type: 'item',
        url: '/vehicle-master',
        icon: <AirportShuttleIcon sx={{fontSize: '22px'}} />,
      },
      // {
      //   id: 'createDepartment',
      //   title: 'Vehicle Category',
      //   messageId: 'Vehicle Category',
      //   permittedRole: RoutePermittedRole.superAdmin,
      //   type: 'item',
      //   url: '/vehicle-subcategory',
      //   icon: <SupervisorAccountIcon />,
      // },
      // {
      //   id: 'createDepartment',
      //   title: 'Vehicle Brand',
      //   messageId: 'Vehicle Brand',
      //   permittedRole: RoutePermittedRole.superAdmin,
      //   type: 'item',
      //   url: '/vehicle-brand',
      //   icon: <SupervisorAccountIcon />,
      // },
      {
        id: 'createDepartment',
        title: 'Vehicle Model',
        messageId: 'Vehicle Model',
        permittedRole: RoutePermittedRole.superAdmin,
        type: 'item',
        url: '/vehicle-model',
        icon: <LocalTaxiIcon sx={{fontSize: '22px'}} />,
      },
    ],
  },
  {
    id: 'Compliances',
    title: 'Add Compliances',
    messageId: 'Compliance Master',
    iconUrl: 'Compliance',
    permittedRole: RoutePermittedRole.superAdmin,
    type: 'item',
    url: '/Master/compliance/compliance-list',
    icon: <RuleFolderIcon />,
  },
  {
    id: 'FeedbackCategory',
    title: 'Driver Feedback Category',
    messageId: 'Driver Feedback ',
    permittedRole: RoutePermittedRole.superAdmin,
    type: 'item',
    url: '/master/driver-feedback',
    icon: <FeedIcon sx={{medium: '22px'}} />,
  },
  {
    id: 'taxCategory',
    title: 'Tax Category',
    messageId: 'Tax ',
    permittedRole: RoutePermittedRole.superAdmin,
    type: 'item',
    url: '/tax-categories',
    icon: <PriceChangeIcon sx={{medium: '22px'}} />,
    // icon: <RateReviewIcon />,
  },
  {
    id: 'taxCategory',
    title: 'Fuel Price',
    messageId: 'Fuel Price ',
    permittedRole: RoutePermittedRole.superAdmin,
    type: 'item',
    url: '/fuel-price',
    icon: <LocalGasStationIcon sx={{fontSize: '22px'}} />,
  },
  {
    id: 'managetraining',
    title: 'Training Video',
    messageId: 'Self Help',
    permittedRole: RoutePermittedRole.superAdmin,
    type: 'item',
    url: '/trainingVideo',
    icon: <OndemandVideoIcon sx={{fontSize: '21px'}} />,
    // icon: (
    //   <img
    //     className='sidebar-icon'
    //     src={'/assets/images/specialEmployee.svg'}
    //   />
    // ),
  },
  {
    id: 'managegpsvendor',
    title: 'GPS Vendor',
    messageId: 'GPS Vendor',
    permittedRole: RoutePermittedRole.superAdmin,
    type: 'item',
    url: '/Mastergps',
    icon: <FestivalIcon sx={{fontSize: '21px'}} />,
    // icon: (
    //   <img
    //     className='sidebar-icon'
    //     src={'/assets/images/specialEmployee.svg'}
    //   />
    // ),
  },
  {
    id: 'manageassociation',
    title: 'Manage Association',
    messageId: 'Association',
    permittedRole: RoutePermittedRole.superAdmin,
    type: 'item',
    url: '/association',
    icon: <AddTaskIcon sx={{fontSize: 'medium'}} />,
    // icon: (
    //   <img
    //     className='sidebar-icon'
    //     src={'/assets/images/specialEmployee.svg'}
    //   />
    // ),
  },
  // {
  //   id: 'table',
  //   title: 'TrainingVideo',
  //   messageId: 'Training Video',
  //   permittedRole: RoutePermittedRole.superAdmin,
  //   type: 'item',
  //   icon: (
  //     <img
  //       className='sidebar-icon'
  //       src={'/assets/images/specialEmployee.svg'}
  //     />
  //   ),
  //   url: '/trainingVideo',
  // },
  {
    id: 'onboardCorporates',
    title: 'Manage Corporates',
    permittedRole: [
      RoutePermittedRole.tenentAdmin,
      RoutePermittedRole.superAdmin,
    ],
    // module: 'Manage Corporates',
    // submodule: 'Manage Corporates',
    messageId: 'Manage Corporates',
    type: 'item',
    icon: <HiUserGroup />,
    url: '/onbordCorporate/list',
  },

  // {
  //   id: 'Driver Notification',
  //   title: 'Driver Notification',
  //   messageId: 'Driver App setting',
  //   // module: 'Setting',
  //   // submodule: 'Driver Notification',
  //   iconUrl: 'DriverNotifications',
  //   permittedRole: RoutePermittedRole.superAdmin,
  //   type: 'item',
  //   url: '/setting/driver-setting',
  //   icon: <ManageAccountsIcon fontSize='small' />,
  // },
  // {
  //   id: 'Employee Notification',
  //   title: 'Employee Notification',
  //   messageId: 'Employee App setting',
  //   // module: 'Setting',
  //   // submodule: 'Driver Notification',
  //   iconUrl: 'DriverNotifications',
  //   permittedRole: RoutePermittedRole.superAdmin,
  //   type: 'item',
  //   url: '/setting/employee-setting',
  //   icon: <ManageAccountsIcon fontSize='small' />,
  // },
  {
    id: 'LiveTrip',
    title: 'LiveTrip',
    module: 'Active Trips',
    submodule: 'Active Trips',
    iconUrl: 'ActiveTrip',
    messageId: 'Active Trips',
    // permittedRole: [RoutePermittedRole.corporateAdmin, RoutePermittedRole.vendor],
    permittedRole: RoutePermittedRole.ALL,
    type: 'item',
    url: '/onboardCorporate/livetrip',
    icon: (
      <img className='sidebar-icon' src={'/assets/images/liveLocation.svg'} />
    ),
  },
  // {
  //   id: 'LiveTracking',
  //   title: 'LiveTracking',
  //   module: 'Live Tracking',
  //   iconUrl: 'LiveTracking',
  //   submodule: 'Live Tracking',
  //   messageId: 'Live Tracking',
  //   // permittedRole: [RoutePermittedRole.corporateAdmin, RoutePermittedRole.vendor],
  //   permittedRole: RoutePermittedRole.corporateAdmin,
  //   type: 'item',
  //   url: '/test-live-tracking-dashboard/DEFAULT',
  //   icon: (
  //     <img className='sidebar-icon' src={'/assets/images/liveLocation.svg'} />
  //   ),
  // },
  {
    id: 'LiveTracking',
    title: 'Live Tracking',
    module: 'Live Tracking',
    submodule: 'Live Tracking',
    messageId: 'Live Tracking',
    iconUrl: 'LiveTracking',
    // permittedRole: RoutePermittedRole.corporateAdmin,
    permittedRole: RoutePermittedRole.ALL,
    type: 'item',
    icon: (
      <img className='sidebar-icon' src={'/assets/images/liveLocation.svg'} />
    ),
    url: '/test-live-tracking-dashboard/DEFAULT',
  },
  // {
  //   id: 'YourRides',
  //   title: 'YourRides',
  //   iconUrl: 'LiveTracking',
  //   messageId: 'Your Rides',
  //   permittedRole: [RoutePermittedRole.manager],
  //   type: 'item',
  //   url: '/your-ride',
  //   icon: (
  //     <img className='sidebar-icon' src={'/assets/images/liveLocation.svg'} />
  //   ),
  // },
  {
    id: 'YourRides',
    title: 'Your Rides',
    module: 'Your Rides',
    submodule: 'Your Rides',
    messageId: 'Your Rides',
    iconUrl: 'YourRides',
    // permittedRole: RoutePermittedRole.corporateAdmin,
    permittedRole: RoutePermittedRole.ALL,
    type: 'item',
    icon: (
      <img className='sidebar-icon' src={'/assets/images/liveLocation.svg'} />
    ),
    url: '/your-ride',
  },
  {
    id: 'Master',
    title: 'Master',
    module: 'Master',
    messageId: 'Master',
    // permittedRole: RoutePermittedRole.corporateAdmin,
    permittedRole: RoutePermittedRole.ALL,
    type: 'collapse',
    iconUrl: 'Master',
    icon: <DnsIcon fontSize='small' />,
    children: [
      {
        id: 'table',
        title: 'Register Employee Table',
        module: 'Master',
        submodule: 'Employees',
        messageId: 'Employees',
        iconUrl: 'Employees',
        // permittedRole: RoutePermittedRole.corporateAdmin,
        permittedRole: [RoutePermittedRole.ALL],
        type: 'item',
        icon: <HiUserCircle />,
        url: '/onboardCorporate/employee/employee-listing',
      },
      {
        id: 'CreateShifts',
        title: 'Register Shifts Details',
        module: 'Master',
        iconUrl: 'Shifts',
        submodule: 'Shifts',
        messageId: 'Shifts',
        permittedRole: RoutePermittedRole.ALL,
        // permittedRole: RoutePermittedRole.corporateAdmin,
        type: 'item',
        url: '/onboardCorporate/shift/shift-listing',
        icon: <ScheduleIcon fontSize='small' />,
      },
      {
        id: 'createDepartment',
        title: 'Our Department',
        module: 'Master',
        submodule: 'Departments',
        iconUrl: 'Departments',
        messageId: 'Departments',
        permittedRole: RoutePermittedRole.ALL,
        // permittedRole: RoutePermittedRole.corporateAdmin,
        type: 'item',
        url: '/onboardCorporate/department/department-listing',
        icon: <LanIcon fontSize='small' />,
      },
      // {
      //   id: 'createDesignation',
      //   title: 'Designation',
      //   messageId: 'Designation',
      //   permittedRole: RoutePermittedRole.corporateAdmin,
      //   type: 'item',
      //   url: '/onboardCorporate/designation/designation-table',
      //   icon: <SupervisorAccountIcon />,

      // },
      {
        id: 'createbusinessunit',
        title: 'Business Unit',
        module: 'Master',
        iconUrl: 'BusinessUnits',
        submodule: 'Business Unit',
        messageId: 'Business Unit',
        permittedRole: RoutePermittedRole.ALL,
        // permittedRole: RoutePermittedRole.corporateAdmin,
        type: 'item',
        url: '/onbordTenent/BussinessUnit/table',
        icon: <BusinessIcon fontSize='small' />,
      },
      {
        id: 'vendorList',
        title: 'Vendors Listing',
        module: 'Master',
        submodule: 'Vendors',
        iconUrl: 'Vendors',
        messageId: 'Vendors',
        permittedRole: RoutePermittedRole.ALL,
        // permittedRole: RoutePermittedRole.corporateAdmin,
        icon: <StorefrontIcon fontSize='small' />,
        type: 'item',
        url: '/onboardadmin/vendor/vendor-listing/Def',
      },
      {
        id: 'driversList',
        title: 'Drivers Listing',
        module: 'Master',
        submodule: 'Drivers',
        iconUrl: 'Drivers',
        messageId: 'Drivers',
        permittedRole: RoutePermittedRole.ALL,
        // permittedRole: [RoutePermittedRole.vendor, RoutePermittedRole.corporateAdmin],
        icon: (
          <img className='sidebar-icon' src={'/assets/images/driver.svg'} />
        ),
        hoverIcon: (
          <img className='sidebar-icon' src={'/assets/images/driver-2.svg'} />
        ),
        type: 'item',
        url: '/onboardadmin/driver/driver-listing/Def',
      },
      {
        id: 'vehicleList',
        title: 'Vehicles Listing',
        module: 'Master',
        submodule: 'Vehicles',
        messageId: 'Vehicles',
        iconUrl: 'Vehicle',
        permittedRole: RoutePermittedRole.ALL,
        // permittedRole: [RoutePermittedRole.corporateAdmin, RoutePermittedRole.vendor],
        icon: <DriveEtaIcon />,
        type: 'item',
        url: '/onboardadmin/vehicle/vehicle-listing/Def',
      },
      {
        id: 'vehicleList',
        title: 'Vehicles Driver GPS Mapping',
        module: 'Master',
        submodule: 'Vehicles Driver GPS Mapping',
        messageId: 'Vehicles Driver GPS Mapping',
        iconUrl: 'Vehicle',
        permittedRole: RoutePermittedRole.ALL,
        // permittedRole: [RoutePermittedRole.corporateAdmin, RoutePermittedRole.vendor],
        icon: <DriveEtaIcon />,
        type: 'item',
        url: '/onboardadmin/vehicle/vehicle-driver-gps-mapping',
      },
      // {
      //   id: 'vehicleDriverMapping',
      //   title: 'Vehicles Listing',
      //   messageId: 'Vehicles Driver GPS Mapping',
      //   permittedRole: [RoutePermittedRole.superAdmin,RoutePermittedRole.corporate ],
      //   type: 'item',
      //   url: '/onboardadmin/vehicle/vehicle-driver-gps-mapping',
      //   icon: <DriveEtaIcon />,
      // },
      {
        id: 'vehicleDriverMapping',
        title: 'Vehicles Listing',
        module: 'Master',
        submodule: 'Vehicles',
        messageId: 'Vehicles Driver GPS Mapping',
        iconUrl: 'Vehicle',
        permittedRole: RoutePermittedRole.ALL,
        // permittedRole: [RoutePermittedRole.corporateAdmin, RoutePermittedRole.vendor],
        icon: <DriveEtaIcon />,
        type: 'item',
        url: '/onboardadmin/vehicle/vehicle-driver-gps-mapping',
      },
      {
        id: 'manageHoliday',
        title: 'Manage Holiday',
        module: 'Master',
        submodule: 'Manage Holidays',
        iconUrl: 'Holidays',
        messageId: 'Manage Holidays',
        permittedRole: RoutePermittedRole.ALL,
        // permittedRole: RoutePermittedRole.corporateAdmin,
        type: 'item',
        url: '/onboardCorporate/holiday/holiday-listing',
        icon: <CalendarTodayIcon fontSize='small' />,
      },
      {
        id: 'Trip',
        title: 'Register Nodal Point Detail',
        module: 'Master',
        submodule: 'Nodal Point',
        messageId: 'Nodal Point',
        iconUrl: 'NodalPoints',
        permittedRole: RoutePermittedRole.ALL,
        // permittedRole: RoutePermittedRole.corporateAdmin,
        type: 'item',
        url: '/onbordTenent/NodelPoint/table',
        icon: <AddLocationAltIcon style={{fontSize: 'large'}} />,
      },
      {
        id: 'employeeCategory',
        title: 'Employee Category',
        module: 'Master',
        iconUrl: 'EmployeeCategory',
        submodule: 'Employee Category',
        messageId: 'Employee Category',
        permittedRole: RoutePermittedRole.ALL,
        // permittedRole: RoutePermittedRole.corporateAdmin,
        type: 'item',
        url: '/onboardCorporate/employee-category/employee-category-table',
        icon: <PeopleIcon fontSize='small' />,
      },
      {
        id: 'table',
        title: 'Escort List',
        module: 'Master',
        iconUrl: 'Escorts',
        submodule: 'Escort',
        messageId: 'Escort',
        permittedRole: RoutePermittedRole.ALL,
        // permittedRole: RoutePermittedRole.corporateAdmin,
        type: 'item',
        icon: (
          <img className='sidebar-icon' src={'/assets/images/escort.svg'} />
        ),
        url: '/onboardadmin/escort/escort-listing',
      },
      {
        id: 'table',
        title: 'Escort Agency List',
        module: 'Master',
        submodule: 'Escort Agency',
        iconUrl: 'EscortAgency',
        messageId: 'Escort Agency',
        permittedRole: RoutePermittedRole.ALL,
        // permittedRole: RoutePermittedRole.corporateAdmin,
        type: 'item',
        icon: (
          <img className='sidebar-icon' src={'/assets/images/escort.svg'} />
        ),
        url: '/onboardCorporate/escort-agency/agency-listing',
      },
      {
        id: 'siteOfficeList',
        title: 'SiteOffice Listing',
        module: 'Master',
        submodule: 'Site Office',
        iconUrl: 'SiteOffice',
        messageId: 'Site Office',
        // permittedRole: [RoutePermittedRole.corporateAdmin],
        permittedRole: RoutePermittedRole.ALL,
        type: 'item',
        icon: <BusinessIcon style={{fontSize: 'large'}} />,
        url: '/onbordCorporate/siteOffice/siteoffice-listing',
      },
      {
        id: 'table',
        title: 'Special Employee Table',
        messageId: 'Special Employee',
        module: 'Master',
        iconUrl: 'SpecialEmployee',
        submodule: 'Special Employee',
        permittedRole: RoutePermittedRole.ALL,
        // permittedRole: RoutePermittedRole.corporateAdmin,
        type: 'item',
        icon: (
          <img
            className='sidebar-icon'
            src={'/assets/images/specialEmployee.svg'}
          />
        ),
        url: '/onboardCorporate/special-employee/specialemployee-listing',
      },
      {
        id: 'penlty',
        title: 'Penalty',
        messageId: 'Penalty ',
        module: 'Master',
        submodule: 'Penalty',
        iconUrl: 'Penalty',
        permittedRole: RoutePermittedRole.ALL,
        icon: (
          <img className='sidebar-icon' src={'/assets/images/penality.svg'} />
        ),
        type: 'item',
        url: '/onboardCorporate/penalty/penalty-listing',
      },
      {
        id: 'RegisterVehicle',
        title: 'Register Vehicle Table',
        messageId: 'Vehicle Variant ',
        module: 'Master',
        iconUrl: 'VehicleVariant',
        submodule: 'Vehicle Variant',
        permittedRole: RoutePermittedRole.ALL,
        type: 'item',
        icon: <CommuteIcon fontSize='small' />,
        url: '/Master/vehicleType/table',
      },
      // {
      //   id: 'GpsVendor',
      //   title: 'GPS Vendor',
      //   messageId: 'GPS Vendor',
      //   module: 'Master',
      //   iconUrl: 'GpsVendors',
      //   submodule: 'GPS Vendor',
      //   permittedRole: RoutePermittedRole.corporateAdmin,
      //   type: 'item',
      //   icon: (
      //     <img
      //       className='sidebar-icon'
      //       src={'/assets/images/liveLocation.svg'}
      //     />
      //   ),
      //   url: '/Master/Gps-Vendor/list',
      // },
      {
        id: 'GpsList',
        title: 'GPS List',
        messageId: 'GPS List',
        module: 'Master',
        iconUrl: 'GpsLists',
        submodule: 'GPS List',
        permittedRole: RoutePermittedRole.superAdmin,
        type: 'item',
        icon: (
          <img
            className='sidebar-icon'
            src={'/assets/images/liveLocation.svg'}
          />
        ),
        url: '/Master/Gps-list/list',
      },
    ],
  },
  // {
  //   id: 'roster',
  //   title: 'Roster',
  //   messageId: 'Schedule',
  //   permittedRole: RoutePermittedRole.manager,
  //   type: 'item',
  //   iconUrl: 'Roster',
  //   url: '/rosters/roster-creation',
  //   icon: (
  //     <img className='sidebar-icon' src={'/assets/images/rosterIcon.png'} />
  //   ),
  // },
  {
    id: 'roster',
    title: 'Roster',
    messageId: 'Schedule',
    module: 'RosterManager',
    submodule: 'RosterManager',
    iconUrl: 'Roster',
    permittedRole: RoutePermittedRole.ALL,
    icon: (
      <img className='sidebar-icon' src={'/assets/images/rosterIcon.png'} />
    ),
    type: 'item',
    url: '/rosters/roster-creation',
  },
  // {
  //   id: 'AdhocTrips',
  //   title: 'AdhocTrip',
  //   messageId: 'Adhoc Trip',
  //   permittedRole: RoutePermittedRole.manager,
  //   iconUrl: 'Adhoc',
  //   type: 'item',
  //   url: '/pending-AdhocTrip',
  //   icon: <DriveEtaIcon style={{color: 'white'}} />,
  // },
  {
    id: 'AdhocTrips',
    title: 'AdhocTrip',
    messageId: 'Adhoc Trip',
    module: 'Adhoc TripManager',
    submodule: 'Adhoc TripManager',
    iconUrl: 'Adhoc',
    permittedRole: RoutePermittedRole.ALL,
    icon: <DriveEtaIcon style={{color: 'white'}} />,
    type: 'item',
    url: '/pending-AdhocTrip',
  },
  // {
  //   id: 'Leaves',
  //   title: 'Leave',
  //   iconUrl: 'Leave',
  //   messageId: 'Leaves',
  //   permittedRole: RoutePermittedRole.manager,
  //   type: 'item',
  //   icon: <ManageAccountsIcon fontSize='small' />,
  //   url: '/all-leave-listing',
  // },
  // {
  //   id: 'Leave',
  //   title: 'Manage Leave',
  //   iconUrl: 'Leave',
  //   messageId: 'Manage Leaves',
  //   permittedRole: RoutePermittedRole.employee,
  //   type: 'item',
  //   icon: <ManageAccountsIcon fontSize='small' />,
  //   url: '/leave-listing',
  // },
  {
    id: 'Leave',
    title: 'Manage Leaves',
    messageId: 'Manage Leaves',
    module: 'Manage Leaves',
    submodule: 'Manage Leaves',
    iconUrl: 'Leave',
    permittedRole: RoutePermittedRole.ALL,
    icon: <ManageAccountsIcon fontSize='small' />,
    type: 'item',
    url: '/leave-listing',
  },
  // {
  //   id: 'adhocTrip',
  //   title: 'adhocTrip',
  //   module: 'Adhoc Trip',
  //   iconUrl: 'Adhoc',
  //   messageId: 'Adhoc Trip',
  //   permittedRole: RoutePermittedRole.employee,
  //   type: 'item',
  //   icon: <ManageAccountsIcon fontSize='small' />,
  //   url: '/AdhocTrip-list',
  // },
  {
    id: 'adhocTrip',
    title: 'adhocTrip',
    messageId: 'Adhoc Trip',
    module: 'Adhoc TripEmployee',
    submodule: 'Adhoc TripEmployee',
    iconUrl: 'Adhoc',
    permittedRole: RoutePermittedRole.ALL,
    icon: <ManageAccountsIcon fontSize='small' />,
    type: 'item',
    url: '/AdhocTrip-list',
  },
  {
    id: 'roster',
    title: 'Roster',
    messageId: 'Schedule',
    module: 'RosterEmployee',
    submodule: 'RosterEmployee',
    iconUrl: 'Roster',
    permittedRole: RoutePermittedRole.ALL,
    url: '/rosters/my-roster-req',
    icon: (
      <img className='sidebar-icon' src={'/assets/images/rosterIcon.png'} />
    ),
    type: 'item',
  },
  // {
  //   id: 'Triprequests',
  //   title: 'Roster',
  //   messageId: 'Schedule',
  //   iconUrl: 'Roster',
  //   permittedRole: RoutePermittedRole.employee,
  //   type: 'item',
  //   url: '/rosters/my-roster-req',
  //   icon: (
  //     <img className='sidebar-icon' src={'/assets/images/rosterIcon.png'} />
  //   ),
  // },
  // {
  //   id: 'roster',
  //   title: 'Roster',
  //   messageId: 'Schedule',
  //   module: 'Roster',
  //   submodule: 'Roster',
  //   iconUrl: 'Roster',
  //   permittedRole: RoutePermittedRole.ALL,
  //   icon: (
  //     <img className='sidebar-icon' src={'/assets/images/rosterIcon.png'} />
  //   ),
  //   type: 'item',
  //   url: '/rosters/roster-creation',
  // },
  {
    id: 'Triprequest',
    title: 'Roster',
    module: 'Roster',
    submodule: 'Roster',
    iconUrl: 'Roster',
    messageId: 'Schedule',
    permittedRole: RoutePermittedRole.ALL,
    type: 'item',
    url: '/rosters/roster-page',
    icon: (
      <img className='sidebar-icon' src={'/assets/images/rosterIcon.png'} />
    ),
    icon2: <img className='sidebar-icon' src={'/assets/images/yesIcon.png'} />,
  },
  // {
  //   id: 'routeListss',
  //   title: 'Route List',
  //   iconUrl: 'Routes',
  //   messageId: 'Route List (Vendor)',
  //   permittedRole: RoutePermittedRole.vendor,
  //   icon: <img className='sidebar-icon' src={'/assets/images/routeList.svg'} />,
  //   type: 'item',
  //   url: '/route-lists-for-vendor/ALL',
  // },
  {
    id: 'routeListss',
    title: 'Route List',
    messageId: 'Route List (Vendor)',
    module: 'RoutesVendor',
    submodule: 'RoutesVendor',
    iconUrl: 'Routes',
    permittedRole: RoutePermittedRole.ALL,
    icon: (
      <img className='sidebar-icon' src={'/assets/images/liveLocation.svg'} />
    ),
    type: 'item',
    url: '/route-lists-for-vendor/ALL',
  },
  // {
  //   id: 'driverAttendence',
  //   title: 'Driver Attendence',
  //   iconUrl: 'DriverAttendence',
  //   messageId: 'Driver Attendence',
  //   permittedRole: [
  //     RoutePermittedRole.vendor,
  //     RoutePermittedRole.corporateAdmin,
  //   ],
  //   icon: <img className='sidebar-icon' src={'/assets/images/routeList.svg'} />,
  //   type: 'item',
  //   url: '/driver-attendence',
  // },
  {
    id: 'Triprequest',
    title: 'Roster',
    module: 'Driver Attendance',
    submodule: 'Driver Attendance',
    iconUrl: 'Roster',
    messageId: 'Driver Attendance',
    permittedRole: RoutePermittedRole.ALL,
    type: 'item',
    url: '/driver-attendence',
    icon: (
      <img className='sidebar-icon' src={'/assets/images/rosterIcon.png'} />
    ),
    icon2: <img className='sidebar-icon' src={'/assets/images/yesIcon.png'} />,
  },
  {
    id: 'routes',
    title: 'Routes',
    module: 'Routes',
    messageId: 'Routes',
    iconUrl: 'Routes',
    permittedRole: RoutePermittedRole.ALL,
    type: 'collapse',
    icon: <img className='sidebar-icon' src={'/assets/images/routeIcon.svg'} />,
    children: [
      {
        id: 'createMasterRoutes',
        title: 'Route Master',
        module: 'Route Master',
        submodule: 'Route Master',
        messageId: 'Route Master',
        iconUrl: 'RouteMaster',
        permittedRole: RoutePermittedRole.ALL,
        type: 'item',
        url: '/master-routes',
        icon: (
          <img
            className='sidebar-icon'
            src={'/assets/images/routeMaster.svg'}
          />
        ),
      },
      {
        id: 'routeList',
        title: 'Auto Generated',
        module: 'Auto Generated',
        submodule: 'Auto Generated',
        messageId: 'Auto Generated',
        iconUrl: 'VRP',
        permittedRole: RoutePermittedRole.ALL,
        icon: (
          <img className='sidebar-icon' src={'/assets/images/routeList.svg'} />
        ),
        type: 'item',
        url: '/create-new-route',
      },
      {
        id: 'routeLists1',
        title: 'Route List',
        module: 'Route List',
        submodule: 'Route List',
        iconUrl: 'RouteList',
        messageId: 'Route List',
        permittedRole: RoutePermittedRole.ALL,
        icon: (
          <img className='sidebar-icon' src={'/assets/images/routeList.svg'} />
        ),
        type: 'item',
        url: '/route-lists/ALL',
      },
    ],
  },
  {
    id: 'AdhocTripss',
    title: 'AdhocTrip',
    module: 'Adhoc Trip',
    submodule: 'Adhoc Trip',
    messageId: 'Adhoc Trip',
    permittedRole: RoutePermittedRole.ALL,
    iconUrl: 'Adhoc',
    type: 'item',
    url: '/createForm/corporate-AdhocTrip',
    icon: <DriveEtaIcon style={{color: 'white'}} />,
  },
  {
    id: 'LeaveManagement',
    title: 'Leave',
    messageId: 'Leave Management',
    module: 'Leave Management',
    iconUrl: 'Leave',
    submodule: 'Leave Management',
    permittedRole: RoutePermittedRole.ALL,
    type: 'item',
    icon: <ManageAccountsIcon fontSize='small' />,
    url: '/all-leave-listing',
  },
  {
    id: 'Rate-Card',
    title: 'Register RateCardTable',
    messageId: 'Rate Card',
    module: 'Rate Card',
    iconUrl: 'RateCard',
    submodule: 'Rate Card',
    permittedRole: RoutePermittedRole.ALL,
    type: 'item',
    icon: <SellIcon fontSize='small' />,
    url: '/rate-card-list',
  },
  {
    id: 'compliances',
    title: 'Compliance',
    messageId: 'Compliance',
    module: 'Compliance',
    iconUrl: 'Compliance',
    submodule: 'Compliance',
    permittedRole: RoutePermittedRole.ALL,
    type: 'item',
    icon: <AdminPanelSettingsIcon fontSize='small' />,
    url: '/compliance-listing',
  },
  {
    id: 'fuelTracking',
    title: 'Fuel Tracking',
    module: 'Fuel Tracking',
    submodule: 'Fuel Tracking',
    iconUrl: 'FuelTracking',
    messageId: 'Fuel Tracking',
    permittedRole: RoutePermittedRole.ALL,
    type: 'item',
    url: '/fuel-track',
    icon: <ManageAccountsIcon fontSize='small' />,
  },
  // {
  //   id: 'Fuel Tracking',
  //   title: 'Fuel Tracking',
  //   messageId: 'Fuel Tracking',
  //   // module: 'Setting',
  //   // submodule: 'Driver Notification',
  //   iconUrl: 'DriverNotifications',
  //   permittedRole: [
  //     RoutePermittedRole.corporateAdmin,
  //     RoutePermittedRole.vendor,
  //   ],
  //   type: 'item',
  //   url: '/fuel-track',
  //   icon: <ManageAccountsIcon fontSize='small' />,
  // },
  {
    id: 'reports',
    title: 'Reports',
    module: 'Reports',
    submodule: 'Reports',
    iconUrl: 'Reports',
    messageId: 'Reports',
    permittedRole: RoutePermittedRole.ALL,
    type: 'item',
    url: '/master/reports',
    icon: (
      <img className='sidebar-icon' src={'/assets/images/liveLocation.svg'} />
    ),
  },
  // {
  //   id: 'CorpBilling',
  //   title: 'CorpBilling',
  //   messageId: "Corporate's Billing",
  //   iconUrl: 'Billing',
  //   permittedRole: RoutePermittedRole.vendor,
  //   type: 'item',
  //   url: '/vendor-billings',
  //   icon: (
  //     <img className='sidebar-icon' src={'/assets/images/liveLocation.svg'} />
  //   ),
  // },
  {
    id: 'CorpBilling',
    title: "Corporate's Billing",
    messageId: "Corporate's Billing",
    module: 'Corporates Billing',
    submodule: 'Corporates Billing',
    iconUrl: 'CorpBilling',
    permittedRole: RoutePermittedRole.ALL,
    icon: (
      <img className='sidebar-icon' src={'/assets/images/liveLocation.svg'} />
    ),
    type: 'item',
    url: '/vendor-billings',
  },
  {
    id: 'Billing',
    title: 'Billing',
    module: 'Billing',
    submodule: 'Billing',
    messageId: 'Billing',
    iconUrl: 'Billing',
    permittedRole: RoutePermittedRole.ALL,
    type: 'item',
    url: '/billings',
    icon: (
      <img className='sidebar-icon' src={'/assets/images/liveLocation.svg'} />
    ),
  },
  {
    id: 'IVR',
    title: 'IVR',
    module: 'IVR',
    submodule: 'IVR',
    messageId: 'IVR',
    iconUrl: 'IVR',
    permittedRole: RoutePermittedRole.ALL,
    type: 'item',
    url: '/IVR',
    icon: (
      <img className='sidebar-icon' src={'/assets/images/liveLocation.svg'} />
    ),
  },
  {
    id: 'Invoicing',
    title: 'Invoicing',
    module: 'Invoicing',
    submodule: 'Invoicing',
    messageId: 'Invoicing',
    iconUrl: 'Invoicing',
    permittedRole: RoutePermittedRole.ALL,
    type: 'item',
    url: '/invoice-listing-vendor/Today/null/null',
    icon: (
      <img className='sidebar-icon' src={'/assets/images/liveLocation.svg'} />
    ),
  },
  // {
  //   id: 'Invoicing',
  //   title: 'Invoicing',
  //   module: 'Invoicing',
  //   submodule: 'Invoicing',
  //   iconUrl: 'Invoicing',
  //   messageId: 'Invoicing',
  //   permittedRole: [
  //     RoutePermittedRole.vendor,
  //     RoutePermittedRole.corporateAdmin,
  //   ],
  //   type: 'item',
  //   url: '/invoice-listing-vendor/Today/null/null',
  //   icon: (
  //     <img className='sidebar-icon' src={'/assets/images/liveLocation.svg'} />
  //   ),
  // },
  {
    id: 'table',
    title: 'Feedback',
    messageId: 'Feedback',
    module: 'Feedback',
    iconUrl: 'Feedback',
    submodule: 'Feedback',
    permittedRole: RoutePermittedRole.ALL,
    type: 'item',
    icon: (
      <img
        className='sidebar-icon'
        src={'/assets/images/specialEmployee.svg'}
      />
    ),
    url: '/feedback-view',
  },
  // {
  //   id: 'table',
  //   title: 'Driver Consent',
  //   messageId: 'Driver Consent',
  //   // module: 'Feedback',
  //   iconUrl: 'Feedback',
  //   // submodule: 'Feedback',
  //   permittedRole: RoutePermittedRole.superAdmin,
  //   type: 'item',
  //   icon: <DocumentScannerIcon sx={{fontSize: 'medium'}} />,
  //   // icon: (
  //   //   <img
  //   //     className='sidebar-icon'
  //   //     src={'/assets/images/specialEmployee.svg'}
  //   //   />
  //   // ),
  //   url: '/driver-consent',
  // },
  {
    id: 'TrainingVideo',
    title: 'driverconsent',
    messageId: 'Driver Consent',
    permittedRole: RoutePermittedRole.superAdmin,
    // module: 'Training Videos',
    // submodule: 'Training Videos',
    type: 'item',
    url: '/driver-consent',
    icon: <DocumentScannerIcon sx={{fontSize: '22px'}} />,
    // icon: (
    //   <img
    //     className='sidebar-icon'
    //     src={'/assets/images/specialEmployee.svg'}
    //   />
    // ),
  },
  // {
  //   id: 'table',
  //   title: 'Driver Shift',
  //   messageId: 'Driver Shift',
  //   // module: 'Feedback',
  //   iconUrl: 'Feedback',
  //   // submodule: 'Feedback',
  //   permittedRole: RoutePermittedRole.vendor,
  //   type: 'item',
  //   icon: (
  //     <img
  //       className='sidebar-icon'
  //       src={'/assets/images/specialEmployee.svg'}
  //     />
  //   ),
  //   url: '/vendor/driver-shift',
  // },
  // {
  //   id: 'DriverShift',
  //   title: 'Driver Shift',
  //   messageId: 'Driver Shift',
  //   module: 'Driver Shift',
  //   submodule: 'Driver Shift',
  //   iconUrl: 'CorpBilling',
  //   permittedRole: RoutePermittedRole.ALL,
  //   icon: (
  //     <img className='sidebar-icon' src={'/assets/images/liveLocation.svg'} />
  //   ),
  //   type: 'item',
  //   url: '/vendor/driver-shift',
  // },
  // {
  //   id: 'table',
  //   title: 'TrainingVideo',
  //   messageId: 'Training Video',
  //   // module: 'Setting',
  //   iconUrl: 'Trainingvideo',
  //   // submodule: 'Feedback',
  //   permittedRole: RoutePermittedRole.superAdmin,

  //   icon: (
  //     <img
  //       className='sidebar-icon'
  //       src={'/assets/images/specialEmployee.svg'}
  //     />
  //   ),
  //   url: '/trainingVideo',
  // },
  {
    id: 'TrainingVideo',
    title: 'Training Video',
    messageId: 'Training Video',
    permittedRole: RoutePermittedRole.ALL,
    module: 'Training Videos',
    submodule: 'Training Videos',
    type: 'item',
    url: '/trainingVideo',
    icon: <OndemandVideoIcon sx={{fontSize: '21px'}} />,
    // icon: (
    //   <img
    //     className='sidebar-icon'
    //     src={'/assets/images/specialEmployee.svg'}
    //   />
    // ),
  },

  {
    id: 'table',
    title: 'TrainingVideo',
    messageId: 'Training Videos',
    iconUrl: 'Trainingvideo',
    permittedRole: RoutePermittedRole.superAdmin,
    icon: <OndemandVideoIcon sx={{fontSize: '21px'}} />,
    // icon: (
    //   <img
    //     className='sidebar-icon'
    //     src={'/assets/images/specialEmployee.svg'}
    //   />
    // ),
    url: '/trainingVideo',
  },
  // {
  //   id: 'TrainingVideo',
  //   title: 'Training Video',
  //   messageId: 'Training Video ',
  //   permittedRole: RoutePermittedRole.superAdmin,
  //   type: 'item',
  //   url: '/trainingVideo',
  //   icon: (
  //     <img
  //       className='sidebar-icon'
  //       src={'/assets/images/specialEmployee.svg'}
  //     />
  //   ),
  // },
  {
    id: 'announcementList',
    title: 'Announcement Listing',
    module: 'Announcements',
    submodule: 'Announcements',
    messageId: 'Announcements',
    permittedRole: RoutePermittedRole.ALL,
    iconUrl: 'Announcement',
    type: 'item',
    icon: <BusinessIcon />,
    url: '/onboardCorporate/announcement/announcement-listing',
  },
  // {
  //   id: 'support',
  //   title: 'Register Trip Detail',
  //   module: 'Support',
  //   submodule: 'Support',
  //   messageId: 'Support',
  //   permittedRole: RoutePermittedRole.employee,
  //   type: 'item',
  //   url: '/user/support',
  //   icon: <SupportIcon />,
  // },
  {
    id: 'support',
    title: 'Register Trip Detail',
    module: 'Support',
    submodule: 'Support',
    iconUrl: 'Support',
    messageId: 'Support',
    icon: <SupportIcon />,
    permittedRole: RoutePermittedRole.ALL,
    type: 'item',
    url: '/user/support',
  },

  {
    id: 'Incident Management Type',
    title: 'Incident Management Type',
    module: 'Incident Management',
    submodule: 'Incident Management',
    messageId: 'Incident Management',
    permittedRole: RoutePermittedRole.ALL,
    type: 'item',
    icon: <SupportIcon fontSize='small' />,
    url: '/incident-view',
  },
  // {
  //   id: 'Incident Type Table ',
  //   title: 'Incident Type Table',
  //   messageId: 'Incident Type Table',
  //   permittedRole: RoutePermittedRole.superAdmin,
  //   type: 'item',
  //   icon: <SupportIcon fontSize='small' />,
  //   url: '/incident-management-incidentType-table',
  // },
  {
    id: 'Setting',
    title: 'Setting',
    messageId: 'Setting',
    module: 'Setting',
    iconUrl: 'Setting',
    permittedRole: RoutePermittedRole.ALL,
    type: 'collapse',
    icon: <SettingsIcon fontSize='small' />,
    children: [
      {
        id: 'Roster Setting',
        title: 'Roster Setting',
        messageId: 'Schedule ',
        module: 'Setting',
        submodule: 'Roster Setting',
        iconUrl: 'RosterSettings',
        permittedRole: RoutePermittedRole.ALL,
        type: 'item',
        url: '/roster-setting-list',
        icon: <ManageAccountsIcon fontSize='small' />,
      },
      {
        id: 'Route',
        title: 'Route',
        messageId: 'Routing Rule',
        module: 'Setting',
        submodule: 'Routing Rule',
        permittedRole: RoutePermittedRole.ALL,
        iconUrl: 'RoutingRule',
        type: 'item',
        icon: (
          <img
            className='sidebar-icon'
            src={'/assets/images/routingRules.svg'}
          />
        ),
        url: '/manage-route/routing-rule',
      },
      {
        id: 'LeaveSetting',
        title: 'Leave Setting',
        messageId: 'Leave',
        module: 'Setting',
        submodule: 'Leave Setting',
        permittedRole: RoutePermittedRole.ALL,
        iconUrl: 'LeaveSetting',
        type: 'item',
        url: '/leave-settings',
        icon: <ManageAccountsIcon fontSize='small' />,
      },
      {
        id: 'SOS Setting',
        title: 'SOS Setting',
        messageId: 'SOS',
        module: 'Setting',
        submodule: 'SOS Setting',
        permittedRole: RoutePermittedRole.ALL,
        iconUrl: 'SOSSettings',
        type: 'item',
        url: '/sos/setting',
        icon: <ManageAccountsIcon fontSize='small' />,
      },
      {
        id: 'Push Notification',
        title: 'Push Notification',
        messageId: 'Push Notification',
        module: 'Setting',
        iconUrl: 'PushNotification',
        submodule: 'Push Notification',
        permittedRole: RoutePermittedRole.ALL,
        type: 'item',
        url: '/setting/push-notification',
        icon: <ManageAccountsIcon fontSize='small' />,
      },
      {
        id: 'table',
        title: 'Compliance Setting',
        messageId: 'Compliance',
        module: 'Setting',
        submodule: 'Compliance Setting',
        iconUrl: 'ComplianceSetting',
        permittedRole: RoutePermittedRole.ALL,
        type: 'item',
        icon: (
          <img
            className='sidebar-icon'
            src={'/assets/images/specialEmployee.svg'}
          />
        ),
        url: '/compliance/settings',
      },
    ],
  },
];
export default routesConfig;
