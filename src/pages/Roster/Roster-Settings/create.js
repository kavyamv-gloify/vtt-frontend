import React from 'react';
import regex from '@regex';
import SmartForm from '@smart-form';
import {useState, useEffect} from 'react';
import AppLoader from '@crema/core/AppLoader';
import {useAuthUser} from '@crema/utility/AuthHooks';
import api from '@api';
import axios from 'axios';
import {toast} from 'react-toastify';
import {useNavigate} from 'react-router-dom';
import Api from '@api';
import CustomLabel from 'pages/common/CustomLabel';

const CreateRosterSetting = ({rosterId, setrosterId}) => {
  const [showbtn, setshowbtn] = useState(true);
  const {user} = useAuthUser();
  const [deptList, setdeptList] = useState();
  // const [rosterId, setrosterId] = useState();
  // const [shiftList, setshiftList] = useState();
  const [categoryList, setCategoryList] = useState();
  const [data, setData] = useState();
  const corporateId = user?.userList?.corporateId;
  const navigate = useNavigate();
  useEffect(() => {
    if (!corporateId) {
      return;
    }
    getDeptList();
    // getRosterList();
    // getShiftList();
    getCategoryList();
  }, [corporateId]);

  function getCategoryList() {
    let url = `${Api?.employeeCategory?.employeeCategoryList}`;
    axios
      .get(url)
      .then((result) => {
        let temArr = [];
        result?.data?.data?.map((el) => {
          temArr.push({title: el?.categoryType, value: el?.id});
        });
        setCategoryList(temArr ?? []);
      })
      .catch((err) => {
        setCategoryList([]);
      });
  }
  async function getDeptList() {
    let res = await axios.get(
      `${api?.department?.list}/null/employeeId/${corporateId}/corporateId?page=0&size=10000`,
    );
    let temp = [];
    if (res?.data?.data?.body['DepartmentList']?.length) {
      res?.data?.data?.body['DepartmentList']?.map((e) => {
        temp.push({title: e.departmentName, value: e.id});
      });
    }
    setdeptList(temp);
  }

  // async function getRosterList() {
  //     axios.get(`${Api.baseUri}/user-reg/Roaster-Setting/getbycorporateId/${corporateId}?page=0&size=4`).then(res => {
  //         let temp = [];
  //         if (res?.data?.data?.body["Corporate List"]?.length) {
  //             res?.data?.data?.body["Corporate List"]?.map((e) => {
  //                 setrosterId(e.id)
  //             })
  //         }
  //         else {
  //             setrosterId('NEW')
  //         }
  //     }).catch(err => {
  //         setrosterId('NEW')
  //     })
  // }

  useEffect(() => {
    async function getDataInfo() {
      if (rosterId.length) {
        axios
          .get(`${Api.baseUri}/user-reg/Roaster-Setting/getbyid/${rosterId}`)
          .then((res) => {
            let tempo = res?.data?.data;
            setData(tempo ?? {tempid: 'CREATE'});
          })
          .catch((err) => {
            setData({tempid: 'CREATE'});
          });
      }
    }
    getDataInfo();
  }, [rosterId]);

  // async function getShiftList() {
  //     let res = await axios.get(`${api.dropdown.shiftmanagement}`);
  //     let temp = [];
  //     if (res?.data?.data?.length) {
  //         res?.data?.data?.map((e) => {
  //             temp.push({ title: e.shiftName + '(' + e.shiftStart + '-' + e.shiftEnd + ')', value: e.id });
  //         })
  //     }
  //     setshiftList(temp);
  // }

  let template = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    // title: 'Roster Setting',
    description: 'Form for applying Job',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'section',
            layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
            fields: [
              {
                type: 'text',
                name: 'advanceRoaster',
                id: 'advanceRoaster',
                title: 'Advance Roster(Days)',
                infoMessage: [
                  'Numeric characters are allowed',
                  'Maximum length should be 4 characters',
                  '24',
                ],
                pattern: {
                  value: regex.numofDayReg,
                  message: 'Please enter  valid days with max 4 characters',
                },
                validationProps: {
                  required: 'This is a mandatory field',
                },
              },
              // {
              //     type: 'autocomplete',
              //     name: 'category',
              //     id: 'category',
              //     title: "Category",
              //     options: categoryList,
              //     infoMessage: ["Dropdown values are selectable", "e.g.: Contract"],
              //     validationProps: {
              //         required: 'This is a mandatory field'
              //     }
              // },
              {
                type: 'multiSelect',
                name: 'department',
                id: 'department',
                title: 'Department',
                infoMessage: ['Dropdown values are selectable', 'e.g.: Cloud'],
                options: deptList ?? [],
                validationProps: {
                  required: 'This is a mandatory field',
                },
              },
            ],
          },
          {
            type: 'radio',
            name: 'empManageRoaster',
            id: 'empManageRoaster',
            title: 'Employee Manage the Roster',
            infoMessage: ['Radio button is selectable', 'e.g.: yes'],
            options: [
              {title: 'Yes', value: 'Yes'},
              {title: 'No', value: 'No'},
            ],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'section',
            layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
            fields: [
              {
                type: 'radio',
                name: 'allowAdminApproval',
                id: 'allowAdminApproval',
                title: 'Corporate Approval required for any roster change ',
                infoMessage: ['Radio button is selectable', 'e.g.: yes'],
                options: [
                  {title: 'Yes', value: 'Yes'},
                  {title: 'No', value: 'No'},
                ],
                validationProps: {
                  required: 'This is a mandatory field',
                },
                dynamic: {
                  field: 'empManageRoaster',
                  value: 'Yes',
                },
              },
              {
                type: 'radio',
                name: 'allowManagerApproval',
                id: 'allowManagerApproval',
                title: 'Manager Approval required for any roster change ',
                infoMessage: ['Radio button is selectable', 'e.g.: yes'],
                options: [
                  {title: 'Yes', value: 'Yes'},
                  {title: 'No', value: 'No'},
                ],
                dynamic: {
                  field: 'empManageRoaster',
                  value: 'Yes',
                },
                validationProps: {
                  required: 'This is a mandatory field',
                },
              },
            ],
          },
          {
            type: 'section',
            layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
            fields: [
              {
                type: 'radio',
                name: 'managerManageEmpRoaster',
                id: 'managerManageEmpRoaster',
                title: 'Manager Manage the Employee Roster',
                infoMessage: ['Radio button is selectable', 'e.g.: yes'],
                options: [
                  {title: 'Yes', value: 'Yes'},
                  {title: 'No', value: 'No'},
                ],
                validationProps: {
                  required: 'This is a mandatory field',
                },
              },
              {
                type: 'radio',
                name: 'corpAdminManageEmpRoaster',
                id: 'corpAdminManageEmpRoaster',
                title: 'Corpoate Admin Manage the Employee Roster',
                infoMessage: ['Radio button is selectable', 'e.g.: yes'],
                options: [
                  {title: 'Yes', value: 'Yes'},
                  {title: 'No', value: 'No'},
                ],
                validationProps: {
                  required: 'This is a mandatory field',
                },
              },
            ],
          },
        ],
      },
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        title: 'Cutoff',
        fields: [
          {
            type: 'section',
            layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
            fields: [
              {
                type: 'radio',
                name: 'allowDailyChanges',
                id: 'allowDailyChanges',
                title: 'Allow Daily Changes(Login / Logout)',
                infoMessage: ['Radio button is selectable', 'e.g.: yes'],
                options: [
                  {title: 'Yes', value: 'Yes'},
                  {title: 'No', value: 'No'},
                ],
                validationProps: {
                  required: 'This is a mandatory field',
                },
              },
            ],
          },
          {
            type: 'section',
            layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
            fields: [
              {
                type: 'text',
                name: 'loginModifyCutoffTimeinMinutes',
                id: 'loginModifyCutoffTimeinMinutes',
                title: 'Cut-off time to modify Login Shift before  (Minutes) ',
                infoMessage: ['Numeric values', 'e.g.: 90'],
                validationProps: {
                  required: 'This is a mandatory field',
                },
                dynamic: {
                  field: 'allowDailyChanges',
                  value: 'Yes',
                },
              },
              {
                type: 'text',
                name: 'loginCancelCutoffTime',
                id: 'loginCancelCutoffTime',
                title: 'Cut-off time to cancel Login Shift before  (Minutes) ',
                infoMessage: ['Numeric value', 'e.g.: 90'],
                validationProps: {
                  required: 'This is a mandatory field',
                  manual: [
                    {
                      condition: `loginCancelCutoffTime < loginModifyCutoffTimeinMinutes`,
                      message: 'Cancel time should be less than modify time. ',
                    },
                  ],
                },
                dynamic: {
                  field: 'allowDailyChanges',
                  value: 'Yes',
                },
              },
            ],
          },
        ],
      },
      {
        type: 'section',
        layout: {column: 2, spacing: 4, size: 'medium', label: 'fixed'},
        fields: [
          {
            type: 'autocomplete',
            name: 'roasterTypeLogin',
            id: 'roasterTypeLogin',
            title: 'Roster Type',
            infoMessage: ['Dropdown values are selectable', 'e.g.: Weekly'],
            options: [
              {title: 'Weekly', value: 'weekly'},
              {title: 'Monthly', value: 'monthly'},
              {title: 'Fortnight', value: 'fortnight'},
            ],
            validationProps: {
              required: 'This is a mandatory field',
            },
            dynamic: {
              field: 'allowDailyChanges',
              value: 'No',
            },
          },
          {
            type: 'autocomplete',
            name: 'weekStartdayLogin',
            id: 'weekStartdayLogin',
            title: 'Week Start Day',
            infoMessage: ['Dropdown values are selectable', 'e.g.: Monday'],
            options: [
              {title: 'Monday', value: 'Monday'},
              {title: 'Tuesday', value: 'Tuesday'},
              {title: 'Wednesday', value: 'Wednesday'},
              {title: 'Thursday', value: 'Thursday'},
              {title: 'Friday', value: 'Friday'},
              {title: 'Saturday', value: 'Saturday'},
              {title: 'Sunday', value: 'Sunday'},
            ],
            validationProps: {
              required: 'This is a mandatory field',
            },
            dynamic: {
              condition: 'dy.allowDailyChanges && dy.roasterTypeLogin',
              field: ['allowDailyChanges', 'roasterTypeLogin'],
              value: ['No', 'weekly'],
            },
          },
          {
            type: 'text',
            disabled: true,
            name: 'tempo',
            id: 'tempo',
            title: 'Roster Start Date',
            defaultValue: '1st of each month',
            infoMessage: ['Nothing to change'],
            dynamic: {
              condition: 'dy.allowDailyChanges && dy.roasterTypeLogin',
              field: ['allowDailyChanges', 'roasterTypeLogin'],
              value: ['No', 'monthly'],
            },
          },
          {
            type: 'text',
            disabled: true,
            name: 'tempo',
            id: 'tempo',
            title: 'Roster Dates',
            defaultValue: '1 to 15 and 16 to last day of the month ',
            infoMessage: ['Nothing to change'],
            dynamic: {
              condition: 'dy.allowDailyChanges && dy.roasterTypeLogin',
              field: ['allowDailyChanges', 'roasterTypeLogin'],
              value: ['No', 'fortnight'],
            },
          },
          {
            type: 'autocomplete',
            name: 'roasterCutOffDay',
            id: 'roasterCutOffDay',
            title: 'Roster Cutoff Day',
            infoMessage: ['Dropdown values are selectable', 'e.g.: Monday'],
            // defaultValue:'Thursday',
            options: [
              {title: 'Monday', value: 'Monday'},
              {title: 'Tuesday', value: 'Tuesday'},
              {title: 'Wednesday', value: 'Wednesday'},
              {title: 'Thursday', value: 'Thursday'},
              {title: 'Friday', value: 'Friday'},
              {title: 'Saturday', value: 'Saturday'},
              {title: 'Sunday', value: 'Sunday'},
            ],
            validationProps: {
              required: 'This is a mandatory field',
            },
            dynamic: {
              condition: 'dy.allowDailyChanges && dy.roasterTypeLogin',
              field: ['allowDailyChanges', 'roasterTypeLogin'],
              value: ['No', 'weekly'],
            },
          },
          {
            type: 'text',
            disabled: true,
            name: 'tempo',
            id: 'tempo',
            title: 'Roster Cutoff Date',
            defaultValue:
              'Last day of previous fortnight (lastday of the mornth or 15th of month)',
            infoMessage: ['Not changeable'],
            dynamic: {
              condition: 'dy.allowDailyChanges && dy.roasterTypeLogin',
              field: ['allowDailyChanges', 'roasterTypeLogin'],
              value: ['No', 'fortnight'],
            },
          },
          {
            type: 'text',
            disabled: true,
            name: 'tempo',
            id: 'tempo',
            title: 'Roster Cutoff Date',
            defaultValue: 'Last day of previous month',
            infoMessage: ['Not changeable'],
            dynamic: {
              condition: 'dy.allowDailyChanges && dy.roasterTypeLogin',
              field: ['allowDailyChanges', 'roasterTypeLogin'],
              value: ['No', 'monthly'],
            },
          },
          {
            type: 'text',
            name: 'roasterCutOffTime',
            id: 'roasterCutOffTime',
            title: 'Roster Cutoff time',
            infoMessage: ['Numeric characters are allowed', 'e.g.: 02:00'],
            input_type: 'time',
            // pattern: {
            //     value: regex.hhmmReg,
            //     message: 'Please enter valid Time (i.e.: 2:00am)'
            // },
            validationProps: {
              required: 'This is a mandatory field',
            },
            dynamic: {
              field: 'allowDailyChanges',
              value: 'No',
            },
          },
        ],
      },
      {
        type: 'section',
        layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
        fields: [
          {
            type: 'text',
            name: 'logoutModifyCutoffTimeinMinutes',
            id: 'logoutModifyCutoffTimeinMinutes',
            title: 'Cut-off time to modify Logout Shift before  (Minutes) ',
            infoMessage: [
              'Dropdown values are selectable',
              'e.g.: Morning(10:00-17:00)',
            ],
            validationProps: {
              required: 'This is a mandatory field',
            },
            dynamic: {
              field: 'allowDailyChanges',
              value: 'Yes',
            },
          },
          {
            type: 'text',
            name: 'logoutCancelCutoffTime',
            id: 'logoutCancelCutoffTime',
            title: 'Cut-off time to cancel Logout Shift before  (Minutes) ',
            infoMessage: ['Numeric Value', 'e.g.: 90'],
            validationProps: {
              required: 'This is a mandatory field',
              manual: [
                {
                  condition: `logoutCancelCutoffTime < logoutModifyCutoffTimeinMinutes`,
                  message: 'Cancel time should be less than modify time.',
                },
              ],
            },
            dynamic: {
              field: 'allowDailyChanges',
              value: 'Yes',
            },
          },
        ],
      },
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        title: 'Notification and Message',
        fields: [
          {
            type: 'radio',
            name: 'pushNotification',
            id: 'pushNotification',
            title: 'Push Notification',
            infoMessage: ['Radio button is selectable', 'e.g.: Enable'],
            options: [
              {title: 'Enable', value: 'Enable'},
              {title: 'Disable', value: 'Disable'},
            ],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },

          {
            type: 'section',
            layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
            fields: [
              {
                type: 'ckeditor',
                name: 'notifyEmpSetUpcomingShiftPushNotification',
                id: 'notifyEmpSetUpcomingShiftPushNotification',
                title:
                  'Notify employee to set the schedule for upcoming days/shift before',
                pattern: {
                  value: regex.maxSize250,
                  message:
                    'Please enter  valid code with alpha-numeric and below 50 characters',
                },
                infoMessage: [
                  'Alphanumeric characters are allowed',
                  'Maximum length should be 250 characters',
                  'e.g.:Successfully created',
                ],
                validationProps: {
                  required: 'This is a mandatory field',
                },
                dynamic: {
                  field: 'pushNotification',
                  value: 'Enable',
                },
              },
              {
                type: 'ckeditor',
                name: 'notifyEmpCancelUpcomingShiftPushNotification',
                id: 'notifyEmpCancelUpcomingShiftPushNotification',
                title:
                  'Notify employee to cancel the schedule for upcoming days/shift before:',
                infoMessage: [
                  'Alphanumeric characters are allowed',
                  'Maximum length should be 250 characters',
                  'e.g.:Successfully created',
                ],
                validationProps: {
                  required: 'This is a mandatory field',
                },
                pattern: {
                  value: regex.maxSize250,
                  message:
                    'Please enter  valid code with alpha-numeric and below 50 characters',
                },
                dynamic: {
                  field: 'pushNotification',
                  value: 'Enable',
                },
              },
            ],
          },
          {
            type: 'radio',
            name: 'emailNotification',
            id: 'emailNotification',
            title: 'Email Notification',
            infoMessage: ['Radio button is selectable', 'e.g.: Enable'],
            options: [
              {title: 'Enable', value: 'Enable'},
              {title: 'Disable', value: 'Disable'},
            ],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'section',
            layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
            fields: [
              {
                type: 'ckeditor',
                name: 'notifyEmpSetUpcomingShiftEmail',
                id: 'notifyEmpSetUpcomingShiftEmail',
                title:
                  'Notify employee to set the schedule for upcoming days/shift before',
                infoMessage: [
                  'Alphanumeric characters are allowed',
                  'Maximum length should be 250 characters',
                  'e.g.:Successfully created',
                ],
                pattern: {
                  value: regex.maxSize50,
                  message:
                    'Please enter  valid code with alpha-numeric and below 50 characters',
                },
                validationProps: {
                  required: 'This is a mandatory field',
                },
                dynamic: {
                  field: 'emailNotification',
                  value: 'Enable',
                },
              },
              {
                type: 'ckeditor',
                name: 'notifyEmpCancelUpcomingShiftEmail',
                id: 'notifyEmpCancelUpcomingShiftEmail',
                title:
                  'Notify employee to cancel the schedule for upcoming days/shift before:',
                infoMessage: [
                  'Alphanumeric characters are allowed',
                  'Maximum length should be 250 characters',
                  'e.g.:Successfully created',
                ],
                validationProps: {
                  required: 'This is a mandatory field',
                },
                pattern: {
                  value: regex.maxSize250,
                  message:
                    'Please enter  valid code with alpha-numeric and below 50 characters',
                },
                dynamic: {
                  field: 'emailNotification',
                  value: 'Enable',
                },
              },
            ],
          },
          {
            type: 'radio',
            name: 'smsNotification',
            id: 'smsNotification',
            title: 'SMS',
            message: 'Charges is: NA',
            infoMessage: ['Radio button is selectable', 'e.g.: Enable'],
            options: [
              {title: 'Enable', value: 'Enable'},
              {title: 'Disable', value: 'Disable'},
            ],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'section',
            layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
            fields: [
              {
                type: 'ckeditor',
                name: 'notifyEmpSetUpcomingShiftSMS',
                id: 'notifyEmpSetUpcomingShiftSMS',
                title:
                  'Notify employee to set the schedule for upcoming days/shift before',
                infoMessage: [
                  'Alphanumeric characters are allowed',
                  'Maximum length should be 250 characters',
                  'e.g.:Successfully created',
                ],
                pattern: {
                  value: regex.maxSize50,
                  message:
                    'Please enter  valid code with alpha-numeric and below 50 characters',
                },
                validationProps: {
                  required: 'This is a mandatory field',
                },
                dynamic: {
                  field: 'smsNotification',
                  value: 'Enable',
                },
              },
              {
                type: 'ckeditor',
                name: 'notifyEmpCancelUpcomingShiftSMS',
                id: 'notifyEmpCancelUpcomingShiftSMS',
                title:
                  'Notify employee to cancel the schedule for upcoming days/shift before:',
                infoMessage: [
                  'Alphanumeric characters are allowed',
                  'Maximum length should be 250 characters',
                  'e.g.:Successfully created',
                ],
                validationProps: {
                  required: 'This is a mandatory field',
                },
                pattern: {
                  value: regex.maxSize250,
                  message:
                    'Please enter  valid code with alpha-numeric and below 50 characters',
                },
                dynamic: {
                  field: 'smsNotification',
                  value: 'Enable',
                },
              },
            ],
          },
          {
            type: 'radio',
            name: 'allowManagerCancel',
            id: 'allowManagerCancel',
            title: 'Can manager cancel the roster?',
            infoMessage: ['Radio button is selectable', 'e.g.: yes'],
            options: [
              {title: 'Yes', value: 'Yes'},
              {title: 'No', value: 'No'},
            ],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'radio',
            name: 'allowAdminCancel',
            id: 'allowAdminCancel',
            title: 'Can corporate admin cancel the roster?',
            infoMessage: ['Radio button is selectable', 'e.g.: yes'],
            options: [
              {title: 'Yes', value: 'Yes'},
              {title: 'No', value: 'No'},
            ],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
        ],
      },
    ],
  };

  const handleSubmit = async (values) => {
    setshowbtn(false);
    if (
      values?.data?.empManageRoaster != 'Yes' &&
      values?.data?.managerManageEmpRoaster != 'Yes' &&
      values?.data?.corpAdminManageEmpRoaster != 'Yes'
    ) {
      setTimeout(() => {
        setshowbtn(true);
      }, 2000);
      toast.error('Please allow atleast one role to manage the roster.');
      return;
    }
    if (values.button.toUpperCase() === 'SUBMIT') {
      let dataSet = {};
      dataSet = values.data;
      dataSet.corporateId = corporateId;
      axios
        .post(
          `${Api.baseUri}/user-reg/Roaster-Setting/save-roastersetting`,
          dataSet,
        )
        .then((response) => {
          if (response?.data?.status == '200') {
            setrosterId('');
            toast.success('Schedule Setting created successfully');
          } else {
            toast.error(response?.data?.message ?? 'Something went wrong');
          }
          setshowbtn(true);
        })
        .catch((er) => {
          setshowbtn(true);
          toast.error('Something went wrong');
        });
    }

    if (values.button.toUpperCase() === 'UPDATE') {
      let dataSet = {};
      dataSet = values.data;
      delete dataSet.deptList;
      dataSet.corporateId = corporateId;
      axios
        .put(
          `${Api.baseUri}/user-reg/Roaster-Setting/update-roastersetting`,
          dataSet,
        )
        .then((response) => {
          if (response?.data?.status == '200') {
            setrosterId('');
            toast.success('Schedule Setting updated successfully');
            // toast.success(response?.data?.message ?? 'Created successfully');
          } else {
            toast.error(response?.data?.message ?? 'Something went wrong');
          }
          setshowbtn(true);
        })
        .catch((er) => {
          setshowbtn(true);
          toast.error('Something went wrong');
        });
    }
  };

  return (
    <>
      <div style={{background: 'white', margin: '-30px', padding: '35px'}}>
        {(data?.id || data?.tempid) && (
          <SmartForm
            template={template}
            onSubmit={handleSubmit}
            mode='onTouched'
            defaultValues={data?.temid == 'CREATE' ? null : data}
            buttons={data?.tempid == 'CREATE' ? ['submit'] : ['update']}
          />
        )}
      </div>
    </>
  );
};

export default CreateRosterSetting;
