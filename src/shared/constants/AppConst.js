export const authRole = {
  admin: ['admin'],
  superAdmin: ['superAdmin'],
  user: ['user', 'admin', 'superAdmin'],

};

export const RoutePermittedRole = {
  admin: 'admin',
  user: 'user',
  superAdmin: 'SUPERADMIN',
  tenentAdmin: 'TANENTADMIN',
  all: ['SUPERADMIN','TANENTADMIN', 'admin' , 'user', 'CORPORATEADMIN', 'VENDOR', 'EMPLOYEE', 'DRIVER','MANAGER'],
  ALL: "ALL",
  ERROR: "ERROR",
  gpsUser: ['CORPORATEADMIN', 'VENDOR'], //added by prince
  corporateAdmin: 'CORPORATEADMIN',
  vendor: 'VENDOR',
  employee: 'EMPLOYEE',
  driver: 'DRIVER',
  manager:'MANAGER',
  roasterUser:['EMPLOYEE', 'MANAGER', 'CORPORATEADMIN']
  
};
export const defaultUser = {
  displayName: 'John Alex',
  email: 'demo@example.com',
  token: 'access-token',
  role: 'user',
  photoURL: '/assets/images/avatar/A11.jpg',
};
export const initialUrl = '/dashboard'; // this url will open after login

// export const hithis=()=>{
//   var axios = require('axios');
//   var FormData = require('form-data');
//   var fs = require('fs');
//   var data = new FormData();
//   data.append('logodoc', fs.createReadStream('/C:/Users/SURAJ YADAV/OneDrive/Pictures/FABSLIP.jpg'));
//   data.append('regdoc', fs.createReadStream('/C:/Users/SURAJ YADAV/OneDrive/Pictures/MARCHSLIP.jpg'));
//   data.append('gstndoc', fs.createReadStream('/C:/Users/SURAJ YADAV/OneDrive/Pictures/FABSLIP.jpg'));
//   data.append('pandoc', fs.createReadStream('/C:/Users/SURAJ YADAV/OneDrive/Pictures/01-nature_668593321.jpg'));
//   data.append('data', '{"companyName":"SK","companyCode":"Test","companyAddress":"Test Address","companyRegNo":"123123","companyPAN":"PAN00000000","companyGSTN":"GSTIN00000000","landLineNo":"00999999","contactPersonName":"Chandra kamal","mobileNo":"9717773445","emailId":"suraj@gmail.com","bankCode":"ICIC","bankName":"ICICI","branchName":"Noida","accountName":"CK","accountNumber":"8888888888888","ifscCode":"ICIC000092"}');
  
//   var config = {
//     method: 'post',
//     url: 'http://180.151.3.104:9000/user-reg/tenant-reg',
//     headers: { 
//       ...data.getHeaders()
//     },
//     data : data
//   };
  
//   axios(config)
//   .then(function (response) {
//   })
//   .catch(function (error) {
//   });

// }