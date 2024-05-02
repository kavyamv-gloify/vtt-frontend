import React, {useState, useEffect} from 'react';
import regex from '@regex';
import axios from 'axios';
import api from '@api';
import PopEdit from '@editpopup';
import {toast} from 'react-toastify';

const EditLeaveSetting = ({
  id,
  popBTNClick,
  openDialog,
  setOpenAddDial,
  getAllSettings,
}) => {
  const [showbtn, setshowbtn] = React.useState(true);
  const [data, setData] = React.useState();
  const [departmentList, setDepartmentList] = useState([]);
  async function getDeptList() {
    axios
      .get(`${api?.dropdown?.department}`)
      .then((res) => {
        let temp = [];
        if (res?.data?.data?.length) {
          res?.data?.data?.map((e) => {
            temp.push({
              title: e.departmentName,
              value: e.id,
              name: e.departmentName,
            });
          });
        }
        setDepartmentList(temp);
      })
      .catch((er) => {
        setDepartmentList([]);
      });
  }
  useEffect(() => {
    getDeptList();
    getsettingById();
  }, []);
  const getsettingById = () => {
    axios
      .get(`${api?.leave?.getLeaveSettingById + id}`)
      .then((res) => {
        setData(res?.data?.data[0]);
      })
      .catch((er) => {
        setData({});
      });
  };
  let template = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    title: 'Bank Type',
    description: 'Form for applying Job',
    // sections: [
    // {
    // layout: { column: 1, spacing: 2, size: 'small', label: 'fixed' },
    // id: 'personal_information',
    fields: [
      {
        type: 'multiSelect',
        name: 'departments',
        id: 'departments',
        title: 'Departments',
        infoMessage: ['Radio button is selectable', 'e.g.: yes'],
        options: departmentList,
        validationProps: {
          required: 'This is a mandatory field',
        },
      },
      {
        type: 'section',
        layout: {column: 2, spacing: 2, size: 'small', label: 'fixed'},
        sectionName: 'cutoff',
        sectiontitle: 'Cutoff Time',
        fields: [
          {
            type: 'text',
            name: 'applyCutoffDays', // approvalCutoffDays
            id: 'applyCutoffDays',
            title: 'Cutoff Time to Apply (Days)',
            isNumber: true,
            maxChar: 3,
            infoMessage: ['Radio button is selectable', 'e.g.: yes'],
            pattern: {
              value: regex.numofDayReg,
              message: 'Please enter  valid days with max 4 characters',
            },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'text',
            name: 'cancelCutoffDays',
            id: 'cancelCutoffDays',
            isNumber: true,
            maxChar: 3,
            title: 'Cutoff Time to Cancel (Days)',
            infoMessage: ['Radio button is selectable', 'e.g.: yes'],
            pattern: {
              value: regex.numofDayReg,
              message: 'Please enter  valid days with max 4 characters',
            },
            validationProps: {
              required: 'This is a mandatory field',
              manual: [
                {
                  condition: `cancelCutoffDays <= applyCutoffDays`,
                  message: 'Cancel time should be less than apply time. ',
                },
              ],
            },
          },
          {
            type: 'text',
            name: 'approvalCutoffDays', // approvalCutoffDays
            id: 'approvalCutoffDays',
            title: 'Cutoff time to approve/reject (Days)',
            isNumber: true,
            maxChar: 3,
            infoMessage: ['Numeric value only', 'e.g.: 1, 5'],
            pattern: {
              value: regex.numofDayReg,
              message: 'Please enter valid days min 1.',
            },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'text',
            name: 'maxLeaveAllowed', // approvalCutoffDays
            id: 'maxLeaveAllowed',
            title: 'Maximum allowed leave',
            isNumber: true,
            maxChar: 3,
            infoMessage: ['Numeric value only', 'e.g.: 1, 5'],
            pattern: {
              value: regex.numofDayReg,
              message: 'Please enter valid days min 1.',
            },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
        ],
      },
      {
        type: 'section',
        layout: {column: 2, spacing: 2, size: 'small', label: 'fixed'},
        sectionName: 'approvals',
        sectiontitle: 'Approvals',
        fields: [
          {
            type: 'switchToggle',
            name: 'managerApprovalReq',
            id: 'managerApprovalReq',
            title: 'Allow Manager to Approve/Reject',
            infoMessage: ['Radio button is selectable', 'e.g.: yes'],
            options: [
              {title: 'Yes', value: 'YES'},
              {title: 'No', value: 'NO'},
            ],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'switchToggle',
            name: 'corporateApprovalReq',
            id: 'corporateApprovalReq',
            title: 'Allow Corporate Admin to Approve/Reject',
            infoMessage: ['Radio button is selectable', 'e.g.: yes'],
            options: [
              {title: 'Yes', value: 'YES'},
              {title: 'No', value: 'NO'},
            ],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
        ],
      },
      {
        type: 'section',
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        sectionName: 'smsApply',
        sectiontitle: 'SMS on apply',
        fields: [
          {
            type: 'switchToggle',
            name: 'allowSmsAlertOnApplyByEmp',
            id: 'allowSmsAlertOnApplyByEmp',
            title: 'Send SMS after Leave Applied',
            infoMessage: ['Radio button is selectable', 'e.g.: yes'],
            options: [
              {title: 'Yes', value: 'YES'},
              {title: 'No', value: 'NO'},
            ],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'ckeditor',
            name: 'smsMsgOnApplyByEmp',
            id: 'smsMsgOnApplyByEmp',
            title: 'SMS Body for Applied Leave',
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
              field: 'allowSmsAlertOnApplyByEmp',
              value: 'YES',
            },
          },
        ],
      },
      {
        type: 'section',
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        sectionName: 'SMSCancel',
        sectiontitle: 'SMS on cancel',
        fields: [
          {
            type: 'switchToggle',
            name: 'allowSmsAlertOnCancelByEmp',
            id: 'allowSmsAlertOnCancelByEmp',
            title: 'Send SMS after Leave Cancelled',
            infoMessage: ['Radio button is selectable', 'e.g.: yes'],
            options: [
              {title: 'Yes', value: 'YES'},
              {title: 'No', value: 'NO'},
            ],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'ckeditor',
            name: 'smsMsgOnCancelByEmp',
            id: 'smsMsgOnCancelByEmp',
            title: 'SMS Body for Cancelled Leave',
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
              field: 'allowSmsAlertOnCancelByEmp',
              value: 'YES',
            },
          },
        ],
      },
      {
        type: 'section',
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        sectionName: 'smsPending',
        sectiontitle: 'SMS on approval/rejection',
        fields: [
          {
            type: 'switchToggle',
            name: 'allowSmsAlertOnPendingReqAction',
            id: 'allowSmsAlertOnPendingReqAction',
            title: 'SMS after Leave Approved/Rejected',
            infoMessage: ['Radio button is selectable', 'e.g.: yes'],
            options: [
              {title: 'Yes', value: 'YES'},
              {title: 'No', value: 'NO'},
            ],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'ckeditor',
            name: 'smsMsgOnPendingReqAction',
            id: 'smsMsgOnPendingReqAction',
            title: 'SMS Body for Approved/Rejected Leave',
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
              field: 'allowSmsAlertOnPendingReqAction',
              value: 'YES',
            },
          },
        ],
      },
      {
        type: 'section',
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        sectionName: 'emailApply',
        sectiontitle: 'Email on apply',
        fields: [
          {
            type: 'switchToggle',
            name: 'allowEmailAlertOnApplyByEmp',
            id: 'allowEmailAlertOnApplyByEmp',
            title: 'Send Email after Leave Applied',
            infoMessage: ['Radio button is selectable', 'e.g.: yes'],
            options: [
              {title: 'Yes', value: 'YES'},
              {title: 'No', value: 'NO'},
            ],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'ckeditor',
            name: 'emailMsgOnApplyByEmp',
            id: 'emailMsgOnApplyByEmp',
            title: 'Email Body for Applied Leave',
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
              field: 'allowEmailAlertOnApplyByEmp',
              value: 'YES',
            },
          },
        ],
      },
      {
        type: 'section',
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        sectionName: 'emailCancel',
        sectiontitle: 'Email on cancel',
        fields: [
          {
            type: 'switchToggle',
            name: 'allowEmailAlertOnCancelByEmp',
            id: 'allowEmailAlertOnCancelByEmp',
            title: 'Send email after Leave Cancelled',
            infoMessage: ['Radio button is selectable', 'e.g.: yes'],
            options: [
              {title: 'Yes', value: 'YES'},
              {title: 'No', value: 'NO'},
            ],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'ckeditor',
            name: 'emailMsgOnCancelByEmp',
            id: 'emailMsgOnCancelByEmp',
            title: 'Email Body for Cancelled Leave',
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
              field: 'allowEmailAlertOnCancelByEmp',
              value: 'YES',
            },
          },
        ],
      },
      {
        type: 'section',
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        sectionName: 'emailPending',
        sectiontitle: 'Email on approval/rejection',
        fields: [
          {
            type: 'switchToggle',
            name: 'allowEmailAlertOnPendingReqAction',
            id: 'allowEmailAlertOnPendingReqAction',
            title: 'Email after Leave Approved/Rejected',
            infoMessage: ['Radio button is selectable', 'e.g.: yes'],
            options: [
              {title: 'Yes', value: 'YES'},
              {title: 'No', value: 'NO'},
            ],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'ckeditor',
            name: 'emailMsgOnPendingReqAction',
            id: 'emailMsgOnPendingReqAction',
            title: 'Email Body for Approved/Rejected Leave',
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
              field: 'allowEmailAlertOnPendingReqAction',
              value: 'YES',
            },
          },
        ],
      },
      {
        type: 'section',
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        sectionName: 'pushApply',
        sectiontitle: 'Push notification on apply',
        fields: [
          {
            type: 'switchToggle',
            name: 'allowPushMsgAlertOnApplyByEmp',
            id: 'allowPushMsgAlertOnApplyByEmp',
            title: 'Push Notification after Leave Applied',
            infoMessage: ['Radio button is selectable', 'e.g.: yes'],
            options: [
              {title: 'Yes', value: 'YES'},
              {title: 'No', value: 'NO'},
            ],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'ckeditor',
            name: 'pushMsgOnApplyByEmp',
            id: 'pushMsgOnApplyByEmp',
            title: 'Push Notification Body for Applied Leave',
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
              field: 'allowPushMsgAlertOnApplyByEmp',
              value: 'YES',
            },
          },
        ],
      },
      {
        type: 'section',
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        sectionName: 'pushCancel',
        sectiontitle: 'Push notification on cancel',
        fields: [
          {
            type: 'switchToggle',
            name: 'allowPushMsgAlertOnCancelByEmp',
            id: 'allowPushMsgAlertOnCancelByEmp',
            title: 'Push Notification after Leave Cancelled',
            infoMessage: ['Radio button is selectable', 'e.g.: yes'],
            options: [
              {title: 'Yes', value: 'YES'},
              {title: 'No', value: 'NO'},
            ],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },

          {
            type: 'ckeditor',
            name: 'pushMsgOnCancelByEmp',
            id: 'pushMsgOnCancelByEmp',
            title: 'Push Notification Body for Cancelled Leave',
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
              field: 'allowPushMsgAlertOnCancelByEmp',
              value: 'YES',
            },
          },
        ],
      },
      {
        type: 'section',
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        sectionName: 'pushPending',
        sectiontitle: 'Push notification on approval/rejection',
        fields: [
          {
            type: 'switchToggle',
            name: 'allowPushMsgAlertOnPendingReqAction',
            id: 'allowPushMsgAlertOnPendingReqAction',
            title: 'Push Notification after Leave Approved/Rejected',
            infoMessage: ['Radio button is selectable', 'e.g.: yes'],
            options: [
              {title: 'Yes', value: 'YES'},
              {title: 'No', value: 'NO'},
            ],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'ckeditor',
            name: 'pushMsgOnPendingReqAction',
            id: 'pushMsgOnPendingReqAction',
            title: 'Push Notification Body for Approved/Rejected Leave',
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
              field: 'allowPushMsgAlertOnPendingReqAction',
              value: 'YES',
            },
          },
        ],
      },

      //     ]
      // },
    ],
  };
  const handleSubmit = (values) => {
    if (values?.close) {
      getAllSettings();
      return;
    }
    setshowbtn(false);
    if (values.button.toUpperCase() === 'UPDATE') {
      let postData = values?.data;
      let dptNameArr = [];
      departmentList?.map((el) => {
        if (values?.data?.departments?.includes(el.value)) {
          values?.data?.departments?.map((ele) => {
            if (el.value == ele) {
              dptNameArr.push(el.name);
            }
          });
        }
      });
      postData.departmentName = dptNameArr;
      postData.autoRejectDate = '1'; //moment(new Date()).format('YYYY-MM-DD')
      postData.autoRejectTime = '23:59';
      axios
        .post(api.leave.updateLeaveSetting, postData)
        .then((res) => {
          // setshowbtn(true);
          if (res?.data?.status == '200') {
            setOpenAddDial(false);
            toast.success('Leave setting edited successfully.');
            getAllSettings();
          } else {
            setshowbtn(true);
            toast.error(res?.data?.message || 'Something went wrong.');
          }
          setshowbtn(true);
        })
        .catch((err) => {
          toast.error('Something went wrong.');
          // setshowbtn(true);
          // setshowbtn(true);
        });
    }
  };
  return (
    <>
      {data?.id && (
        <PopEdit
          title={'Update Setting'}
          poptemplate={template}
          defaultValues={data}
          openDialog={openDialog}
          showbtn={showbtn}
          mode='onTouched'
          buttons={['Update']}
          popAction={handleSubmit}
        />
      )}
    </>
  );
};

export default EditLeaveSetting;
