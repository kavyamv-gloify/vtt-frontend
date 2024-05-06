// const baseUri = 'http://13.232.51.162:9000'
// const baseUri= "http://k8s-vttprod-ingressp-0b87b88d60-1268368438.ap-south-1.elb.amazonaws.com/"  // 23 RD MAY 2023


// const baseUri = 'https://api.etravelmate.com';



// const baseUri = 'https://uatapi.etravelmate.com';

const baseUri = "http://15.207.98.143:9000"

// const baseUri = 'https://d1gttvcykaes1q.cloudfront.net';

// const baseUri = 'https://qa-api.etravelmate.com';





// const baseUri = 'http://vttappdbackend.vsplcloud.in';
// const baseUri = 'https://devapi.etravelmate.com';
// const baseUri = 'https://demovtt.vsplcloud.in';
// const baseUri =
//   'http://k8s-kubesyst-ingressp-c805673717-82084199.us-east-1.elb.amazonaws.com';
// const baseUri = "http://35.154.91.194:9000"
// const baseUri= "http://180.151.3.104:9000"
// const baseUri = 'http://192.168.15.5:9000'
// const baseUri='http://3.7.19.219:9000'
// const baseUri = 'https://vttappdbackend.vsplcloud.in';

export default {
  baseUri,
  imgUrl: baseUri + '/user-reg/download-file/img-file?fileurl=',
  mycurrentServer:
    typeof window != 'undefined'
      ? window.location.origin
      : 'https://' +
        (baseUri.includes('uatapi') ? 'uat' : 'app') +
        '.etravelmate.com',
  // mycurrentServer:
  //   typeof window != 'undefined'
  //     ? window.location.origin
  //     : 'https://app.etravelmate.com',
  // mycurrentServer:
  //   typeof window != 'undefined'
  //     ? window.location.origin
  //     : 'https://dev.etravelmate.com',
  auth: {
    getOTP: `${baseUri}/userauth/authenticateUser`,
    verifyOTP: `${baseUri}/userauth/verifyLoginOtp`,
    verifyToken: `${baseUri}/userauth/verifyauthtoken`,
    getbyId: `${baseUri}/user-reg/employee-reg/`,
    ssoUserLogin: `${baseUri}/userauth/ssoUserLogin`,
    ssoUserLoginMail: `${baseUri}/userauth/ssoUserLoginCred`,
    switchRole: `${baseUri}/userauth/switchUserRole`,
  },
  file: {
    filedownload: `${baseUri}/user-reg/download-file`,
  },
  ratecard: {
    saveRatecard: `${baseUri}/user-reg/trip-ratecard/save`,
    getlist: `${baseUri}/user-reg/trip-ratecard`,
  },
  trip: {
    saveRatecard: `${baseUri}/user-reg/rateCard-corp`,
    getsaveRatecard: `${baseUri}/user-reg/rateCard-corp`,
    tripRequest: `${baseUri}/user-reg/trip-req`,
    vendortripList: `${baseUri}/user-reg/trip-route/search-vendor-trips-list`,
    tripList: `${baseUri}/user-reg/trip-route/search-corporate-trips-list`,
    addEmp: `${baseUri}/user-reg/trip-altr/add`,
    removeEmp: `${baseUri}/user-reg/trip-altr/remove`,
    delinkEmp: `${baseUri}/user-reg/trip-altr/delink`,
    getTripById: `${baseUri}/user-reg/trip-route/get-trip-by-id`,
  },

  nodal: {
    nodalpoint: `${baseUri}/user-reg/nodal-point`,
  },
  nodalpoint: {
    nodalpointapi: `${baseUri}/user-reg/nodal-point`,
  },
  routes: {
    create: `${baseUri}/user-reg/generate-routes`,
    getDist: `${baseUri}/user-reg/getdist/`,
    getallgeneratedroutes: `${baseUri}/user-reg/generate-routes/getallgeneratedroutes`,
    assignToDriverList: `${baseUri}/user-reg/trip-route/get-vendor-trips-list-by-driverstatus/`,
    assignToVendorList: `${baseUri}/user-reg/trip-route/get-corptrips-list-by-vendorstatus/`,
    assignToVendor: `${baseUri}/user-reg/trip-route/assign-trips-vendor`,
    assignToDriver: `${baseUri}/user-reg/trip-route/assign-trips-to-driver`,
    addRoutingRule: `${baseUri}/user-reg/routing-rule/save`,
    getRoutingRuleByCorporateId: `${baseUri}/user-reg/routing-rule/get-by-corporate-id/`,
    officeRoute: `${baseUri}/user-reg/office-route/getbycorp-id/`,
    createOfficeRoute: `${baseUri}/user-reg/office-route/save-Ofiice-Route`,
  },
  masters: {
    getallBank: `${baseUri}/master/bank/status/Active`,
    getallShift: `${baseUri}/user-reg/shift`,
    getallDept: `${baseUri}/user-reg/department`,
    getallNodal: `${baseUri}/user-reg/NodalPoints`,
    addnodalpoint: `${baseUri}/user-reg/office-route/add-nodalpoint`,
    deleteRouteOfc: `${baseUri}/user-reg/office-route/route/`,
    deleteNodal: `${baseUri}/user-reg/office-route/remove-nodalpoint/`,
    getAllDeptByCorporate: `${baseUri}/user-reg/department/null/employeeId/`,
    getAllvtypecost: `${baseUri}/user-reg/vehicletypecost/getAll`,
    // getallNodal:'${baseUri}/user-reg/NodalPoints'
  },
  roaster: {
    roasterListByCreator: `${baseUri}/user-reg/roaster/roasterlistbycreater`,
    roasterCreation: `${baseUri}/user-reg/roaster/creation`,
    roasterUpdate: `${baseUri}/user-reg/roaster/roaster-update`,
    getbyid: `${baseUri}/user-reg/roaster/`,
    getemployeebyshiftandtime: `${baseUri}/user-reg/roaster/getemployeebyshiftandtime?shiftId=`,
    roasterrequest: `${baseUri}/trip/ticket/roasterrequest/YES`,
    getcreatedRoasterNew: `${baseUri}/user-reg/roaster/roasterlistbycreater/`,
    createRoasterNew: `${baseUri}/user-reg/roaster/creation`,
    roasterReqList: `${baseUri}/trip/ticket/roasterrequest/YES`,
    roastersetting: `${baseUri}/user-reg/Roaster-Setting/save-roastersetting`,
  },
  onBoardTenant: {
    list: `${baseUri}/user-reg/tenant-reg`,
    changeRequest: `${baseUri}/user-reg/tenant-change`,
    getChangeRequest: `${baseUri}/user-reg/tenant-change`,
    approve: `${baseUri}/user-reg/tenant-change/approve`,
    reject: `${baseUri}/user-reg/tenant-change/reject`,
  },
  holiday: {
    holidayList: `${baseUri}/user-reg/siteoffice-holyday/getholidaybycorporate`,
    createHoliday: `${baseUri}/user-reg/siteoffice-holyday/save`,
  },
  onBoardCorporate: {
    list: `${baseUri}/user-reg/corporate-reg`,
    changeRequest: `${baseUri}/user-reg/corporate-change`,
    getChangeRequest: `${baseUri}/user-reg/corporate-change`,
    pendingCorp: `${baseUri}/user-reg/corporate-change/`,
  },
  employee: {
    list: `${baseUri}/user-reg/employee-reg`,
    changeRequest: `${baseUri}/user-reg/employee-change`,
    byEmployeeCode: `${baseUri}/user-reg/employee-reg/getByEmpCodeOrEmailId`,
    getAllManager: `${baseUri}/user-reg/employee-reg/fetch/`,
    employeeloginrequest: `${baseUri}/user-reg/employee-request/newemployeereq`,
  },
  driver: {
    list: `${baseUri}/user-reg/driver-reg`,
    shift: `${baseUri}/user-reg/driver-shift`,
    changeRequest: `${baseUri}/user-reg/driver-change`,
    driverMap: `${baseUri}/user-reg/vehicle-driver-mapping`,
    approve: `${baseUri}/user-reg/driver-change/approve`,
    reject: `${baseUri}/user-reg/driver-change/reject`,
    freeDriver: `${baseUri}/user-reg/driver-reg/get-all-free-driver-by-vendor`,
  },
  vehicle: {
    list: `${baseUri}/user-reg/vehicle-reg`,
    vendor: `${baseUri}}/user-reg/vehicle-reg/v007/vendor`,
    createComp: `${baseUri}/user-reg/vehicle`,
    findbyvehicleId: `${baseUri}/user-reg/vehicle/findbyregvehicleid?regVehicleId=`,
  },
  vendor: {
    list: `${baseUri}/user-reg/vendor-reg`,
    changeRequest: `${baseUri}/user-reg/vendor-change`,
    associateVendorList: `${baseUri}/user-reg/associatevendor/getallassociatecorporateId
        `,
  },
  siteOffice: {
    list: `${baseUri}/user-reg/siteoffice-reg`,
  },

  masterBank: {
    createform: `${baseUri}/master/bank`,
    list: `${baseUri}/master/bank/status`,
    id: `${baseUri}/master/bank/id`,
  },
  support: {
    topicCreate: `${baseUri}/user-reg/helpmaster/savehelpmaster`,
    deleteTopic: `${baseUri}/user-reg/helpmaster/deactivatehelptopic/`,
    deleteSubTopic: `${baseUri}/user-reg/subtopiccontroller/deactivatesubtopic/`,
    topicUpdate: `${baseUri}/user-reg/helpmaster/updatehelpmaster`,
    topicList: `${baseUri}/user-reg/helpmaster/getAll`,
    gettopicbyid: `${baseUri}/user-reg/helpmaster/`,
    subtopicCreate: `${baseUri}/user-reg/subtopiccontroller/savesubtopic`,
    subtopicUpdate: `${baseUri}/user-reg/subtopiccontroller/updatesubtopic`,
    subtopicList: `${baseUri}/user-reg/subtopiccontroller/getAll`,
    getsubtopicbyid: `${baseUri}/user-reg/subtopiccontroller/`,
    getSubtopicbyTopicid: `${baseUri}/user-reg/subtopiccontroller/`,
    getAllFAQs: `${baseUri}/user-reg/faqcontroller/getAll`,
    saveFAQ: `${baseUri}/user-reg/faqcontroller/savefaqcontroller`,
    updateFAQ: `${baseUri}/user-reg/faqcontroller/updatefaqcontroller`,
    getFAQbyid: `${baseUri}/user-reg/faqcontroller/`,
    getFAQsBySubTopic: `${baseUri}/user-reg/faqcontroller/`,
    raiseTicket: `${baseUri}/user-reg/ticket`,
    getAllTicket: `${baseUri}/user-reg/ticket/getall`,
    getTicketById: `${baseUri}/user-reg/ticket/getbyId/`,
    getTicketByEMPId: `${baseUri}/user-reg/ticket/getTicketByEmployeeId/`,
  },
  masterFueltype: {
    createform: `${baseUri}/master/fueltype`,
    list: `${baseUri}/master/fueltype/status`,
    id: `${baseUri}/master/fueltype/id`,
  },
  masterVehicletype: {
    createform: `${baseUri}/user-reg/vehicletype/addvehicletype`,
    list: `${baseUri}/user-reg/vehicletype/getallvehicletype`,
    id: `${baseUri}/user-reg/vehicletype/vehicletypeId?id=`,
    update: `${baseUri}/user-reg/vehicletype/updatevehicletype`,
    listbytanent: `${baseUri}/user-reg/vehicletype/vehicletypeBytanentId`,
    delete: `${baseUri}//user-reg/vehicletype`,
  },
  drivershift: {
    createform: `${baseUri}/user-reg/driver-shift`,
    list: `${baseUri}/user-reg/driver-shift`,
  },
  download: {
    download: `${baseUri}/user-reg/download-file`,
  },

  escort: {
    createform: `${baseUri}/user-reg/escort-reg`,
  },

  department: {
    list: `${baseUri}/user-reg/department`,
  },

  manageshifts: {
    createform: `${baseUri}/user-reg/shift`,
    list: `${baseUri}/user-reg/shift`,
    getlistbyCorporate: `${baseUri}/user-reg/shift/`,
  },

  compliance: {
    getdriverCompliance: `${baseUri}/user-reg/driver-compliance`,
    saveVehicleCompliance: `${baseUri}/user-reg/vehicle/savecomplianceofvehicle`,
  },

  mobileNo: {
    mobileCheck: `${baseUri}}/userauth/user-account`,
  },

  specialEmployee: {
    create: `${baseUri}/user-reg/special-employee/save-SpecialEmployeeCategory`,
    update: `${baseUri}/user-reg/special-employee/update-SpecialEmployeeCategory`,
    getall: `${baseUri}/user-reg/special-employee/getAll`,
    getbyId: `${baseUri}/user-reg/special-employee`,
  },

  vehicleTypeCost: {
    create: `${baseUri}/user-reg/vehicletypecost/addvehicletypecost`,
    update: `${baseUri}/user-reg/vehicletypecost/updatevehicletypecost`,
    getall: `${baseUri}user-reg/vehicletypecost/getAll`,
    getbyId: `${baseUri}/user-reg/vehicletypecost`,
  },

  penalty: {
    create: `${baseUri}/user-reg/penalty-Service/save-penalty`,
    update: `${baseUri}/user-reg/penalty-Service/update-penalty`,
    getall: `${baseUri}/user-reg/penalty-Service/getAll`,
    getbyId: `${baseUri}/user-reg/penalty-Service/`,
    delete: `${baseUri}/user-reg/penalty-Service/deactivatepenalty`,
  },

  employeesignup: {
    getemail: `${baseUri}user-reg/employee-request/savenewdata/`,
    savenewemploye: `${baseUri}/user-reg/employee-request/newemployeereq`,
    getList: `${baseUri}/user-reg/employee-request/getemployeelistbydomain`,
    getNewEmployeebyId: `${baseUri}//user-reg/employee-request/getbyid`,
    approve: `${baseUri}/user-reg/employee-request/savenewemployee`,
  },

  agency: {
    addagency: `${baseUri}/user-reg/Agency-Service/save-agency`,
    getAll: `${baseUri}/user-reg/Agency-Service/getAll`,
  },

  internalagency: {
    addagency: `${baseUri}/user-reg/internal-reg/save`,
    getall: `${baseUri}/user-reg/internal-reg/getAll`,
  },

  mastershifttype: {
    addshifttype: `${baseUri}/user-reg/shiftType-reg/save`,
    getall: `${baseUri}/user-reg/shiftType-reg/getAll`,
  },

  designation: {
    savedesignation: `${baseUri}/user-reg/bussiness-unit/save-desig`,
    designationList: `${baseUri}/user-reg/designation/getbytanentId`,
    getbyid: `${baseUri}/user-reg/bussiness-unit/getDesig`,
    update: `${baseUri}/user-reg/bussiness-unit/update-desig`,
    delete: `${baseUri}/user-reg/bussiness-unit/desig`,
  },

  businessUnit: {
    saveform: `${baseUri}/user-reg/bussiness-unit/save-bunit`,
    list: `${baseUri}/user-reg/bussiness-unit/getbycorporateId`,
    getbyId: `${baseUri}/user-reg/bussiness-unit/getbyid`,
    deletebU: `${baseUri}/user-reg/bussiness-unit/bu`,
    update: `${baseUri}/user-reg/bussiness-unit/update-bunit`,
  },

  employeeCategory: {
    saveemployeeCategory: `${baseUri}/user-reg/employee-category/save-empcategory`,
    updateemployeeCategory: `${baseUri}/user-reg/employee-category/update-empcategory`,
    employeeCategoryList: `${baseUri}/user-reg/employee-category/getbytanentId`,
    getbyId: `${baseUri}/user-reg/employee-category/getbyid`,
    delete: `${baseUri}/user-reg/employee-category/del-empcategory`,
  },

  token: {
    tokenapi: `${baseUri}/userauth/app/mapkey`,
    // tokenapi: `https://devapi.etravelmate.com/userauth/app/mapkey`
  },

  dropdown: {
    department: `${baseUri}/user-reg/department/dp-department`,
    vendor: `${baseUri}/user-reg/vendor-reg/dp-vendor`,
    shiftmanagement: `${baseUri}/user-reg/shift/dp-getallshift`,
    escortagency: `${baseUri}/user-reg/Agency-Service/dp-getallagency`,
    driveragency: `${baseUri}/user-reg/internal-reg/dp-getallinternalagency`,
  },
  leave: {
    save: `${baseUri}/user-reg/leave-reg/save-leave`,
    update: `${baseUri}/user-reg/leave-reg/update-leave`,
    getbyid: `${baseUri}/user-reg/leave-reg/getbyid/`,
    // getAll: `${baseUri}/user-reg/leave-reg/getAll`,
    getAll: `${baseUri}/user-reg/leave-reg/getByFilters`,
    postLeaveSetting: `${baseUri}/user-reg/leave-setting/save-leave-setting`,
    getAllLeaveSetting: `${baseUri}/user-reg/leave-setting/getall`,
    getLeaveSettingById: `${baseUri}/user-reg/leave-setting/getbyDepartmentId/`,
    getLeaveSettingByDeptId: `${baseUri}/user-reg/leave-setting/getbyDepartmentId/`,
    updateLeaveSetting: `${baseUri}/user-reg/leave-setting/update-leave-setting`,
  },
  sos: {
    sosSettingSave: `${baseUri}/user-reg/sos-setting/save-sos-setting`,
    sosSettingUpdate: `${baseUri}/user-reg/sos-setting/update-sos-setting`,
    sosSettingById: `${baseUri}/user-reg/sos-setting/get-sos-setting-byid/`,
    sosSettingList: `${baseUri}/user-reg/sos-setting/getall`,
  },

  shiftType: {
    getAll: `${baseUri}/user-reg/shiftType-reg/getAll`,
    getbyId: `${baseUri}/user-reg/shiftType-reg/getById`,
    update: `${baseUri}/user-reg/shiftType-reg/update`,
  },

  dashBoard: {
    dashBoardTripList: `${baseUri}/api/dashboard/analytics/shifts`,
  },

  announcement: {
    create: `${baseUri}/user-reg/announcement/save-announcement`,
    update: `${baseUri}/user-reg/announcement/update-announcement`,
    listing: `${baseUri}/user-reg/announcement/getbycorpoarteid/ACTIVE`,
    getbyId: `${baseUri}/user-reg/announcement/getbyid`,
    empAnnounceList: `${baseUri}/user-reg/announcement/getbyEmpId`,
  },
  setting: {
    notificationSettingSave: `${baseUri}/user-reg/push-not-config/save-push-notification-setting`,
    notificationSettinggetAll: `${baseUri}/user-reg/push-not-config/get-all-push-notification-setting`,
    notificationSettingUpdate: `${baseUri}/user-reg/push-not-config/update-push-notification-setting`,
  },
};
