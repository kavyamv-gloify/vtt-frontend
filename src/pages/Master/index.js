import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';
const VehicleForm = React.lazy(() => import('./VehicleType/CreateForm'));
const BankForm = React.lazy(() => import('./Bank/CreateForm'));
const FuelForm = React.lazy(() => import('./FuelType/CreateForm'));
const EditVehicleForm = React.lazy(() => import('./VehicleType/EditPage'));
const EditBankForm = React.lazy(() => import('./Bank/EditPage'));
const EditFuelForm = React.lazy(() => import('./FuelType/EditPage'));
const BankTable = React.lazy(() => import('./Bank/Table'));
const FuelTypeTable = React.lazy(() => import('./FuelType/Table'));
const VehicleTypeTable = React.lazy(() => import('./VehicleType/Table'));
const BankDetail = React.lazy(() => import('./Bank/DetailPage'));
const FuelTypeDetail = React.lazy(() => import('./FuelType/DetailPage'));
const VechileTypeDetail = React.lazy(() => import('./VehicleType/DetailPage'));
const TripForm = React.lazy(() => import('./TripRate/CreateForm'));
const TripList = React.lazy(() => import('./TripRate/Table'));
const EditForm = React.lazy(() => import('./TripRate/EditForm'));
const Topics = React.lazy(() => import('./Support/Topics/index'));
const TopicList = React.lazy(() => import('./Support/Topics/listing'));
const SubTopics = React.lazy(() => import('./Support/Sub-Topics/index'));
// const SubTopicList = React.lazy(()=>import('./Support/Sub-Topics/listing'));
const FAQ = React.lazy(() => import('./Support/FAQs/index'));
const FAQList = React.lazy(() => import('./Support/FAQs/listing'));
const UserSupport = React.lazy(() => import('./Support/User-Support/index'));
const UserFAQ = React.lazy(() => import('./Support/User-Support/FAQ/index'));
const MyComplaints = React.lazy(() =>
  import('./Support/User-Support/ticket-list'),
);
const AllComplaints = React.lazy(() => import('./Support/Tickets/index'));
const ComplaintAction = React.lazy(() => import('./Support/Tickets/action'));
const SubTopicEditPage = React.lazy(() =>
  import('./Support/Sub-Topics/EditPage'),
);
const RoleCreate = React.lazy(() => import('./Role/CreateForm'));
const PushNotificationSetting = React.lazy(() =>
  import('./push-notification/create'),
);
const RateCard = React.lazy(() => import('../Master/Rate Card/CreateRateCard'));
const RateCardTable = React.lazy(() =>
  import('../Master/Rate Card/RateCardTable'),
);
const SOSList = React.lazy(() => import('./SOS-Setting/index'));
const Taxes = React.lazy(() => import('./Tax'));
const Dummy = React.lazy(() => import('../Master/Rate Card/Dummy'));
const DriverSetting = React.lazy(() => import('../Master/Drive-setting/index'));
const EmployeeSetting = React.lazy(() =>
  import('../Master/Employee-setting/index'),
);
const TripSetting = React.lazy(() => import('../Master/Trip-setting/index'));
const OtherSetting = React.lazy(() => import('./Other-Setting/index'));
const DriverFeedBack = React.lazy(() => import('../Master/FeedBack/Table'));
const Themes = React.lazy(() => import('./Theme'));
const VehicleCategory = React.lazy(() => import('./VehicleVariant/Category'));
const VehicleBrand = React.lazy(() => import('./VehicleVariant/Brand'));
const VehicleVariant = React.lazy(() => import('./VehicleVariant/VehicleType'));
const VehicleModel = React.lazy(() => import('./VehicleVariant/Model'));
const VehicleColor = React.lazy(() => import('./VehicleVariant/Color'));
const Practise = React.lazy(() => import('./Practise'));
const NoDataFound = React.lazy(() => import('../../@common/NoDataFound'));
const MergedVehicleFile = React.lazy(() =>
  import('./VehicleVariant/MergedVehicleFile'),
);
const GeneralSetting = React.lazy(() => import('./General Setting/index'));
export const MasterConfigs = [
  {
    permittedRole: RoutePermittedRole.superAdmin,
    path: '/tax-categories',
    element: <Taxes />,
  },
  // -----------------------------------------------forms----------------------
  {
    permittedRole: RoutePermittedRole.superAdmin,
    path: '/theme-masters',
    element: <Themes />,
  },
  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/sos/setting',
    element: <SOSList />,
  },
  {
    permittedRole: [
      RoutePermittedRole.corporateAdmin,
      RoutePermittedRole.vendor,
    ],
    path: '/Master/vehicleType/create',
    element: <VehicleForm />,
  },

  {
    permittedRole: RoutePermittedRole.superAdmin,
    path: '/Master/bank/create',
    element: <BankForm />,
  },

  {
    permittedRole: RoutePermittedRole.superAdmin,
    path: '/Master/fuelType/create',
    element: <FuelForm />,
  },

  // -------------------------------------------------EditForm--------------------
  {
    permittedRole: RoutePermittedRole.superAdmin,
    path: '/Master/bank/editPage/:id',
    element: <EditBankForm />,
  },

  {
    permittedRole: RoutePermittedRole.superAdmin,
    path: '/Master/fuelType/editPage/:id',
    element: <EditFuelForm />,
  },

  {
    permittedRole: [
      RoutePermittedRole.corporateAdmin,
      RoutePermittedRole.vendor,
    ],
    path: '/Master/vehicleType/editPage/:id',
    element: <EditVehicleForm />,
  },

  // ------------------------------------------------------Table---------------------
  {
    permittedRole: RoutePermittedRole.superAdmin,
    path: '/Master/bank/table',
    element: <BankTable />,
  },
  {
    permittedRole: RoutePermittedRole.superAdmin,
    path: '/Master/fueltype/table',
    element: <FuelTypeTable />,
  },

  {
    permittedRole: RoutePermittedRole.ALL,
    // permittedRole: [RoutePermittedRole.corporateAdmin, RoutePermittedRole.vendor],
    path: '/Master/vehicletype/table',
    element: <VehicleTypeTable />,
  },

  // -------------------------------------------------------DetailForm------------------
  {
    permittedRole: RoutePermittedRole.superAdmin,
    path: '/Master/bank/detailpage/:id',
    element: <BankDetail />,
  },

  {
    permittedRole: RoutePermittedRole.superAdmin,
    path: '/Master/fuelType/detailpage/:id',
    element: <FuelTypeDetail />,
  },
  {
    permittedRole: RoutePermittedRole.corporateAdmin,
    path: '/Master/vehicleType/detailpage/:id',
    element: <VechileTypeDetail />,
  },

  // -------------------------------------------------------TripForm------------------

  {
    permittedRole: RoutePermittedRole.tenentAdmin,
    path: '/Master/TripRate/:id',
    element: <TripForm />,
  },
  {
    permittedRole: RoutePermittedRole.tenentAdmin,
    path: '/Master/TripRate/edit/:id',
    element: <EditForm />,
  },
  {
    permittedRole: RoutePermittedRole.tenentAdmin,
    path: '/Master/TripRate/Table',
    element: <TripList />,
  },

  // -------------------------------------------------------Support Form------------------

  {
    permittedRole: RoutePermittedRole.superAdmin,
    path: '/Master/support/topics/:id',
    element: <Topics />,
  },
  {
    permittedRole: RoutePermittedRole.superAdmin,
    path: '/Master/support/topic-list',
    element: <TopicList />,
  },
  {
    permittedRole: RoutePermittedRole.superAdmin,
    path: '/Master/support/create-subtopics',
    element: <SubTopics />,
  },
  {
    permittedRole: RoutePermittedRole.superAdmin,
    path: '/Master/support/subtopics/:id',
    element: <SubTopicEditPage />,
  },
  // {
  //   permittedRole: RoutePermittedRole.superAdmin,
  //   path: '/Master/support/subtopic-list',
  //   element: <SubTopicList />,
  // },
  {
    permittedRole: RoutePermittedRole.superAdmin,
    path: '/Master/support/faq/:id',
    element: <FAQ />,
  },
  {
    permittedRole: RoutePermittedRole.superAdmin,
    path: '/Master/support/faq-list',
    element: <FAQList />,
  },
  {
    permittedRole: RoutePermittedRole.employee,
    path: '/user/support',
    element: <UserSupport />,
  },
  {
    permittedRole: RoutePermittedRole.employee,
    path: '/user/support-faq/:id',
    element: <UserFAQ />,
  },
  {
    permittedRole: RoutePermittedRole.employee,
    path: '/user/my-complaints',
    element: <MyComplaints />,
  },
  {
    permittedRole: RoutePermittedRole.corporateAdmin,
    path: '/user/complaints-tickets',
    element: <AllComplaints />,
  },
  {
    permittedRole: RoutePermittedRole.corporateAdmin,
    path: '/user/complaints-tickets-action/:id',
    element: <ComplaintAction />,
  },
  {
    permittedRole: RoutePermittedRole.superAdmin,
    path: '/master/create-role',
    element: <RoleCreate />,
  },
  {
    permittedRole: RoutePermittedRole.ALL,
    path: '/setting/push-notification',
    element: <PushNotificationSetting />,
  },
  {
    permittedRole: RoutePermittedRole.superAdmin,
    path: '/setting/driver-setting/:id',
    element: <DriverSetting />,
  },
  // ---------------------------------------Rate Card-------------------------------------------------------------
  {
    permittedRole: RoutePermittedRole.corporateAdmin,
    path: '/master/rate-card',
    element: <RateCard />,
  },
  {
    permittedRole: RoutePermittedRole.superAdmin,
    path: '/setting/employee-setting/:id',
    element: <EmployeeSetting />,
  },
  {
    permittedRole: RoutePermittedRole.superAdmin,
    path: '/setting/trip-setting/:id',
    element: <TripSetting />,
  },

  {
    permittedRole: RoutePermittedRole.superAdmin,
    path: '/setting/other-setting/:id',
    element: <OtherSetting />,
  },

  {
    permittedRole: RoutePermittedRole.corporateAdmin,
    path: '/master/rate-card/table',
    element: <RateCardTable />,
  },

  {
    permittedRole: RoutePermittedRole.corporateAdmin,
    path: '/master/rate-card/table/dummy',
    element: <Dummy />,
  },
  // ---------------------------------------Rate Card-------------------------------------------------------------
  {
    permittedRole: RoutePermittedRole.superAdmin,
    path: '/master/driver-feedback',
    element: <DriverFeedBack />,
  },
  {
    permittedRole: RoutePermittedRole.superAdmin,
    path: '/vehicle-variant',
    element: <VehicleVariant />,
  },
  {
    permittedRole: RoutePermittedRole.superAdmin,
    path: '/vehicle-subcategory',
    element: <VehicleCategory />,
  },
  {
    permittedRole: RoutePermittedRole.superAdmin,
    path: '/vehicle-brand',
    element: <VehicleBrand />,
  },
  {
    permittedRole: RoutePermittedRole.superAdmin,
    path: '/vehicle-model',
    element: <VehicleModel />,
  },
  {
    permittedRole: RoutePermittedRole.superAdmin,
    path: '/vehicle-color',
    element: <VehicleColor />,
  },
  {
    permittedRole: RoutePermittedRole.all,
    path: '/practise',
    element: <Practise />,
  },
  {
    permittedRole: RoutePermittedRole.all,
    path: '/vehicle-master',
    element: <MergedVehicleFile />,
  },
  {
    permittedRole: RoutePermittedRole.all,
    path: '/NoDataFound',
    element: <NoDataFound />,
  },
  {
    permittedRole: RoutePermittedRole.all,
    path: '/general-setting/:id',
    element: <GeneralSetting />,
  },
];
