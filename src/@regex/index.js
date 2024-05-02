/* eslint-disable */
const data = JSON.parse(localStorage.getItem('myData')) || [];

const submitData = {
  name: 'Raj',
  email: 'aa@gg.com',
  mobile: 9989898998,
};
localStorage.setItem('myData', JSON.stringify([...data, submitData]));

const regex = {
  emailReg: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,30}$/,
  emailReg2: /^[@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
  phoneReg: /^[6-9]{1,1}[0-9]{9,9}$/, // 10 digit Starting from 6
  domainReg: /^[@]{1,1}[a-zA-Z0-9.-]+\.[a-zA-Z]{1,30}$/,
  landlineReg: /^[0-9]{1}[0-9]{7,14}$/, // 8 to 15 digit
  panReg: /[A-Z]{5}[0-9]{4}[A-Z]{1,1}$/,
  numReg: /^[0-9]{1,20}$/,
  acountNoReg: /^\d{9,18}$/,
  addressReg: /^\S[#.0-9a-zA-Z\s,[/,+,\-\,_,(,)]{1,249}$/,
  ifscReg: /[A-Z]{4}0[A-Z0-9]{6}$/,
  gstReg: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
  numOfYearReg: /^([1-9]{1,1}|[1-9][0-9]{1,1})$/, // 1 to 99,
  numofDayReg: /^([1-9]{1,1}|[1-9][0-9]{1,1}|[1-9][0-9]{1,3})$/,
  yearReg: /^[0-9]{4}$/, // 1 to 99
  vacancyReg: /^[0-9]{1,6}$/, // below 1,000,000
  num1000000:
    /^((1000000)|([1-9][0-9]{5})|([1-9][0-9]{4})|([1-9][0-9]{3})|([1-9][0-9]{2})|([1-9][0-9]{1})|([1-9]))$/,
  amountReg: /^(?:[1-9][0-9]{0,9}|10000000000)$/, // below 1,0000000000 (/^0*[1-9]\d{1,10}$/) /^(?:[1-9]\d?|10000000000)$/
  amountReg0: /^(?:[0-9][0-9]{0,9}|10000000000)$/, // 0 to 10000000000 (/^0*[1-9]\d{1,10}$/) /^(?:[1-9]\d?|10000000000)$/
  distanceReg: /^(?:[1-9][0-9]{0,3}|5000)$/,
  alphanumwith_Reg: /^[a-zA-Z0-9_]*$/,
  alphanumwithoutspaceReg: /^[a-zA-Z0-9]{0,8}$/,
  alphanumwithspaceReg: /^[a-zA-Z0-9 ]*$/,
  urlReg: /^[><?@+'`~^%&\*\[\]\{\}.!#|\\\"$';,:;=/\(\),\-\w+]{1,250}$/,
  codeReg: /^[a-zA-Z0-9,#,/,_,\-,*,(,).]{1,49}$/,
  codeReg16: /^[a-zA-Z0-9,#,/,_,\-,*,(,).]{1,16}$/,
  messageReg: /^.*[a-zA-Z]+.*$/,
  maxSize250: /^(?=.*[a-zA-Z]).{1,250}$/,
  maxSize1000: /^(?=.*[a-zA-Z]).{1,1000}$/,
  maxSize100: /^(?=.*[a-zA-Z]).{1,100}$/,
  maxSize50: /^(?=.*[a-zA-Z]).{0,50}$/,
  maxSize30: /^(?=.*[a-zA-Z]).{0,30}$/,
  dateReg: /^[0-9]{2}[/][0-9]{2}[/][0-9]{4}$/,
  maxSize150: /^(?=.*[a-zA-Z]).{1,150}$/,
  maxSize50AllowNum: /^(?=.*[a-zA-Z0-9_]).{1,50}$/,
  phoneORemailReg: /^(?:\d{10}|[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4})$/,
  drivingLicReg:
    /^(([A-Z]{2}[0-9]{2})( )|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$/,
  charwithnum: /^\S.[a-zA-Z0-9]{0,18}$/, // without space
  allowedExtensions: /(\.jpg|\.jpeg|\.png|\.svg|\.pdf|\.)$/i,
  hhmmReg: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
  time12HR: /^(1[0-2]|0?[1-9]):[0-5][0-9](am|pm)$/,
  alphaReg: /^\S[a-zA-Z_ ]{1,50}$/,
  char50: /^[a-zA-Z ]{0,50}$/,
  char30: /^[a-zA-Z ]{0,29}$/,
  adreesschar50: /^\S[a-zA-Z_ ]{1,49}$/,
  numberPlate: /^[A-Za-z]{1,3}-[A-Z0-9]{1,3}-[A-Z]{1,3}-[0-9]{1,5}$/,
  numberPlateTwo: /^[A-Za-z]{1,3}-[A-Z0-9]{1,3}-[0-9]{1,5}$/,
  numberPlateThree: /^\d{2}[A-Z]{2}\d{4}[A-Z]{2}$/,
  temperatureReg: /^9[0-9]{1,2}|10[0-9]{1,1}$/, //take upto 109
  otpRegex: /^[0-9]{1,6}$/,
  pincodeRegex: /^[0-9]{6,6}$/,
  hhmmRegwitham: /^([0-1]?[0-9]|2[0-3]):[0-9][0-9] (am|pm)$/,
  namewithemail:
    /^\S[a-zA-Z_ ]{1,50}|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
  age: /^((120)|(1[0-1][0-9]{1})|([2-9][0-9]{1})|(1[8-9]))$/,
  // companyreg: /^\S.[a-zA-Z_0-9,.,+,*,/ ]{0,49}$/
  companyreg: /^[a-z_0-9\d\-_ _._/\s]{0,49}$/i,
  imeiRegex : /^\d{15,17}$/,
};

export default regex;
