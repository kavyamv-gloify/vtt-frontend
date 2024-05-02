import React, { useEffect, useState } from 'react';
import SmartForm from '@smart-form';
import regex from '@regex';
import axios from 'axios';
import api from '@api';
import AppLoader from '@crema/core/AppLoader';
import { toast } from 'react-toastify';

const LeaveSetting = ({ setOpenAddDial, getAllSettings }) => {
    const [showbtn, setshowbtn] = React.useState(true);
    const [departmentList, setDepartmentList] = useState([]);

    async function getDeptList() {
        axios.get(`${api?.dropdown?.department}`).then((res) => {
            let temp = [];
            if (res?.data?.data?.length) {
                res?.data?.data?.map((e) => {
                    temp.push({ title: e.departmentName, value: e.id, name: e.departmentName });
                })
            }
            setDepartmentList(temp);
        }).catch((er) => {
            setDepartmentList([])
        })
    }
    useEffect(() => {
        getDeptList();
    }, [])
    let template = {
        layout: { column: 2, spacing: 2, size: 'medium', label: 'fixed', type: 'grid' },
        // title: 'Leave Setting',
        description: 'Form for applying Job',
        sections: [
            {
                layout: { column: 1, spacing: 2, size: 'small', label: 'fixed' },
                id: 'setting_information',
                fields: [
                    {
                        type: 'multiSelect',
                        name: 'departments',
                        id: 'departments',
                        title: "Departments",
                        infoMessage: ["Multiple select dropdown", "e.g.: Cloud, HR, Sales"],
                        options: departmentList,
                        validationProps: {
                            required: 'This is a mandatory field'
                        }
                    },
                    {
                        type: 'section',
                        layout: { column: 2, spacing: 2, size: 'small', label: 'fixed' },
                        fields: [
                            {
                                type: 'text',
                                name: 'applyCutoffDays', // approvalCutoffDays
                                id: 'applyCutoffDays',
                                title: "Cutoff Time to Apply (Days)",
                                isNumber: true,
                                maxChar: 3,
                                infoMessage: ["Numeric value only", "e.g.: 1, 5"],
                                pattern: {
                                    value: regex.numofDayReg,
                                    message: 'Please enter valid days min 1.'
                                },
                                validationProps: {
                                    required: 'This is a mandatory field'
                                }
                            },
                            {
                                type: 'text',
                                name: 'cancelCutoffDays',
                                id: 'cancelCutoffDays',
                                isNumber: true,
                                maxChar: 3,
                                title: "Cutoff Time to Cancel (Days)",
                                infoMessage: ["Numeric value only", "e.g.: 1, 5"],
                                pattern: {
                                    value: regex.numofDayReg,
                                    message: 'Please enter valid days min 1.'
                                },
                                validationProps: {
                                    required: 'This is a mandatory field',
                                    manual: [
                                        {
                                            condition: `cancelCutoffDays <= applyCutoffDays`,
                                            message: "Cancel time should be less than apply time. "
                                        }
                                    ],
                                },
                            },
                            {
                                type: 'text',
                                name: 'approvalCutoffDays', // approvalCutoffDays
                                id: 'approvalCutoffDays',
                                title: "Cutoff time to approve/reject (Days)",
                                isNumber: true,
                                maxChar: 3,
                                infoMessage: ["Numeric value only", "e.g.: 1, 5"],
                                pattern: {
                                    value: regex.numofDayReg,
                                    message: 'Please enter valid days min 1.'
                                },
                                validationProps: {
                                    required: 'This is a mandatory field',
                                    manual: [
                                        {
                                            condition: `approvalCutoffDays <= applyCutoffDays`,
                                            message: "Approve/Reject count should be less than apply time. "
                                        }
                                    ],
                                },
                            },
                            {
                                type: 'text',
                                name: 'maxLeaveAllowed', // approvalCutoffDays
                                id: 'maxLeaveAllowed',
                                title: "Maximum allowed leave",
                                isNumber: true,
                                maxChar: 3,
                                infoMessage: ["Numeric value only", "e.g.: 1, 5"],
                                pattern: {
                                    value: regex.numofDayReg,
                                    message: 'Please enter valid days min 1.'
                                },
                                validationProps: {
                                    required: 'This is a mandatory field'
                                }
                            },
                            {
                                type: 'switchToggle',
                                name: 'managerApprovalReq',
                                id: 'managerApprovalReq',
                                title: "Allow Manager to Approve/Reject",
                                infoMessage: ["Radio button is selectable", "e.g.: yes"],
                                options: [
                                    { title: "Yes", value: "YES" },
                                    { title: "No", value: "NO" }
                                ],
                                // validationProps: {
                                //     required: 'This is a mandatory field'
                                // },
                            },
                            {
                                type: 'switchToggle',
                                name: 'corporateApprovalReq',
                                id: 'corporateApprovalReq',
                                title: "Allow Corporate Admin to Approve/Reject",
                                infoMessage: ["Radio button is selectable", "e.g.: yes"],
                                options: [
                                    { title: "Yes", value: "YES" },
                                    { title: "No", value: "NO" }
                                ],
                                // validationProps: {
                                //     required: 'This is a mandatory field'
                                // },
                            },
                        ]
                    },
                    {
                        type: 'section',
                        layout: { column: 2, spacing: 2, size: 'small', label: 'fixed' },
                        fields: [{
                            type: 'switchToggle',
                            name: 'allowSmsAlertOnApplyByEmp',
                            id: 'allowSmsAlertOnApplyByEmp',
                            title: "Send SMS after Leave Applied",
                            infoMessage: ["Radio button is selectable", "e.g.: yes"],
                            options: [
                                { title: "Yes", value: "YES" },
                                { title: "No", value: "NO" }
                            ],
                            // validationProps: {
                            //     required: 'This is a mandatory field'
                            // },
                        },
                        {
                            type: 'switchToggle',
                            name: 'allowSmsAlertOnCancelByEmp',
                            id: 'allowSmsAlertOnCancelByEmp',
                            title: "Send SMS after Leave Cancelled",
                            infoMessage: ["Radio button is selectable", "e.g.: yes"],
                            options: [
                                { title: "Yes", value: "YES" },
                                { title: "No", value: "NO" }
                            ],
                            // validationProps: {
                            //     required: 'This is a mandatory field'
                            // },
                        },
                        ]
                    },
                    {
                        type: 'section',
                        layout: { column: 2, spacing: 2, size: 'small', label: 'fixed' },
                        fields: [

                            {
                                type: 'ckeditor',
                                name: 'smsMsgOnApplyByEmp',
                                id: 'smsMsgOnApplyByEmp',
                                title: "SMS Body for Applied Leave",
                                pattern: {
                                    value: regex.maxSize250,
                                    message: 'Please enter valid code with alpha-numeric and below 50 characters'
                                },
                                infoMessage: ["Alphanumeric characters are allowed", "Maximum length should be 250 characters", "e.g.:Successfully created"],
                                validationProps: {
                                    required: 'This is a mandatory field'
                                },
                                dynamic: {
                                    field: 'allowSmsAlertOnApplyByEmp',
                                    value: 'YES'
                                },
                            },
                            {
                                type: 'blank_field',
                                name: 'blankField1',
                                id: 'blankField1',
                                dynamic: {
                                    field: 'allowSmsAlertOnApplyByEmp',
                                    value: 'NO'
                                },
                            },
                            //     ]
                            // },
                            // {
                            //     type: 'section',
                            //     layout: { column: 1, spacing: 2, size: 'small', label: 'fixed' },
                            //     fields: [

                            {
                                type: 'ckeditor',
                                name: 'smsMsgOnCancelByEmp',
                                id: 'smsMsgOnCancelByEmp',
                                title: "SMS Body for Cancelled Leave",
                                pattern: {
                                    value: regex.maxSize250,
                                    message: 'Please enter valid code with alpha-numeric and below 50 characters'
                                },
                                infoMessage: ["Alphanumeric characters are allowed", "Maximum length should be 250 characters", "e.g.:Successfully created"],
                                validationProps: {
                                    required: 'This is a mandatory field'
                                },
                                dynamic: {
                                    field: 'allowSmsAlertOnCancelByEmp',
                                    value: 'YES'
                                },
                            },
                            {
                                type: 'blank_field',
                                name: 'blankField1',
                                id: 'blankField1',
                                dynamic: {
                                    field: 'allowSmsAlertOnCancelByEmp',
                                    value: 'NO'
                                },
                            },
                        ]
                    },
                    {
                        type: 'section',
                        layout: { column: 2, spacing: 2, size: 'small', label: 'fixed' },
                        fields: [
                            {
                                type: 'switchToggle',
                                name: 'allowSmsAlertOnPendingReqAction',
                                id: 'allowSmsAlertOnPendingReqAction',
                                title: "SMS after Leave Approved/Rejected",
                                infoMessage: ["Radio button is selectable", "e.g.: yes"],
                                options: [
                                    { title: "Yes", value: "YES" },
                                    { title: "No", value: "NO" }
                                ],
                                // validationProps: {
                                //     required: 'This is a mandatory field'
                                // },
                            },
                            {
                                type: 'switchToggle',
                                name: 'allowEmailAlertOnApplyByEmp',
                                id: 'allowEmailAlertOnApplyByEmp',
                                title: "Send Email after Leave Applied",
                                infoMessage: ["Radio button is selectable", "e.g.: yes"],
                                options: [
                                    { title: "Yes", value: "YES" },
                                    { title: "No", value: "NO" }
                                ],
                                // validationProps: {
                                //     required: 'This is a mandatory field'
                                // },
                            },
                        ]
                    },
                    {
                        type: 'section',
                        layout: { column: 2, spacing: 2, size: 'small', label: 'fixed' },
                        fields: [
                            {
                                type: 'ckeditor',
                                name: 'smsMsgOnPendingReqAction',
                                id: 'smsMsgOnPendingReqAction',
                                title: "SMS Body for Approved/Rejected Leave",
                                pattern: {
                                    value: regex.maxSize250,
                                    message: 'Please enter valid code with alpha-numeric and below 50 characters'
                                },
                                infoMessage: ["Alphanumeric characters are allowed", "Maximum length should be 250 characters", "e.g.:Successfully created"],
                                validationProps: {
                                    required: 'This is a mandatory field'
                                },
                                dynamic: {
                                    field: 'allowSmsAlertOnPendingReqAction',
                                    value: 'YES'
                                },
                            },
                            {
                                type: 'blank_field',
                                name: 'blankField1',
                                id: 'blankField1',
                                dynamic: {
                                    field: 'allowSmsAlertOnPendingReqAction',
                                    value: 'NO'
                                },
                            },
                            {
                                type: 'ckeditor',
                                name: 'emailMsgOnApplyByEmp',
                                id: 'emailMsgOnApplyByEmp',
                                title: "Email Body for Applied Leave",
                                pattern: {
                                    value: regex.maxSize250,
                                    message: 'Please enter valid code with alpha-numeric and below 50 characters'
                                },
                                infoMessage: ["Alphanumeric characters are allowed", "Maximum length should be 250 characters", "e.g.:Successfully created"],
                                validationProps: {
                                    required: 'This is a mandatory field'
                                },
                                dynamic: {
                                    field: 'allowEmailAlertOnApplyByEmp',
                                    value: 'YES'
                                },
                            },
                            {
                                type: 'blank_field',
                                name: 'blankField1',
                                id: 'blankField1',
                                dynamic: {
                                    field: 'allowEmailAlertOnApplyByEmp',
                                    value: 'NO'
                                },
                            },
                        ]
                    },
                    {
                        type: 'section',
                        layout: { column: 2, spacing: 2, size: 'small', label: 'fixed' },
                        fields: [
                            {
                                type: 'switchToggle',
                                name: 'allowEmailAlertOnCancelByEmp',
                                id: 'allowEmailAlertOnCancelByEmp',
                                title: "Send email after Leave Cancelled",
                                infoMessage: ["Radio button is selectable", "e.g.: yes"],
                                options: [
                                    { title: "Yes", value: "YES" },
                                    { title: "No", value: "NO" }
                                ],
                                // validationProps: {
                                //     required: 'This is a mandatory field'
                                // },
                            },
                            {
                                type: 'switchToggle',
                                name: 'allowEmailAlertOnPendingReqAction',
                                id: 'allowEmailAlertOnPendingReqAction',
                                title: "Email after Leave Approved/Rejected",
                                infoMessage: ["Radio button is selectable", "e.g.: yes"],
                                options: [
                                    { title: "Yes", value: "YES" },
                                    { title: "No", value: "NO" }
                                ],
                                // validationProps: {
                                //     required: 'This is a mandatory field'
                                // },
                            },
                        ]
                    },

                    {
                        type: 'section',
                        layout: { column: 2, spacing: 2, size: 'small', label: 'fixed' },
                        fields: [
                            {
                                type: 'ckeditor',
                                name: 'emailMsgOnCancelByEmp',
                                id: 'emailMsgOnCancelByEmp',
                                title: "Email Body for Cancelled Leave",
                                pattern: {
                                    value: regex.maxSize250,
                                    message: 'Please enter valid code with alpha-numeric and below 50 characters'
                                },
                                infoMessage: ["Alphanumeric characters are allowed", "Maximum length should be 250 characters", "e.g.:Successfully created"],
                                validationProps: {
                                    required: 'This is a mandatory field'
                                },
                                dynamic: {
                                    field: 'allowEmailAlertOnCancelByEmp',
                                    value: 'YES'
                                },
                            },
                            {
                                type: 'blank_field',
                                name: 'blankField1',
                                id: 'blankField1',
                                dynamic: {
                                    field: 'allowEmailAlertOnCancelByEmp',
                                    value: 'NO'
                                },
                            },

                            {
                                type: 'ckeditor',
                                name: 'emailMsgOnPendingReqAction',
                                id: 'emailMsgOnPendingReqAction',
                                title: "Email Body for Approved/Rejected Leave",
                                pattern: {
                                    value: regex.maxSize250,
                                    message: 'Please enter valid code with alpha-numeric and below 50 characters'
                                },
                                infoMessage: ["Alphanumeric characters are allowed", "Maximum length should be 250 characters", "e.g.:Successfully created"],
                                validationProps: {
                                    required: 'This is a mandatory field'
                                },
                                dynamic: {
                                    field: 'allowEmailAlertOnPendingReqAction',
                                    value: 'YES'
                                },
                            },
                            {
                                type: 'blank_field',
                                name: 'blankField1',
                                id: 'blankField1',
                                dynamic: {
                                    field: 'allowEmailAlertOnPendingReqAction',
                                    value: 'NO'
                                },
                            },
                        ]
                    },
                    {
                        type: 'section',
                        layout: { column: 2, spacing: 2, size: 'small', label: 'fixed' },
                        fields: [
                            {
                                type: 'switchToggle',
                                name: 'allowPushMsgAlertOnApplyByEmp',
                                id: 'allowPushMsgAlertOnApplyByEmp',
                                title: "Push Notification after Leave Applied",
                                infoMessage: ["Radio button is selectable", "e.g.: yes"],
                                options: [
                                    { title: "Yes", value: "YES" },
                                    { title: "No", value: "NO" }
                                ],
                                // validationProps: {
                                //     required: 'This is a mandatory field'
                                // },
                            },

                            {
                                type: 'switchToggle',
                                name: 'allowPushMsgAlertOnCancelByEmp',
                                id: 'allowPushMsgAlertOnCancelByEmp',
                                title: "Push Notification after Leave Cancelled",
                                infoMessage: ["Radio button is selectable", "e.g.: yes"],
                                options: [
                                    { title: "Yes", value: "YES" },
                                    { title: "No", value: "NO" }
                                ],
                                // validationProps: {
                                //     required: 'This is a mandatory field'
                                // },
                            },
                        ]
                    },

                    {
                        type: 'section',
                        layout: { column: 2, spacing: 2, size: 'small', label: 'fixed' },
                        fields: [
                            {
                                type: 'ckeditor',
                                name: 'pushMsgOnApplyByEmp',
                                id: 'pushMsgOnApplyByEmp',
                                title: "Push Notification Body for Applied Leave",
                                pattern: {
                                    value: regex.maxSize250,
                                    message: 'Please enter valid code with alpha-numeric and below 50 characters'
                                },
                                infoMessage: ["Alphanumeric characters are allowed", "Maximum length should be 250 characters", "e.g.:Successfully created"],
                                validationProps: {
                                    required: 'This is a mandatory field'
                                },
                                dynamic: {
                                    field: 'allowPushMsgAlertOnApplyByEmp',
                                    value: 'YES'
                                },
                            },
                            {
                                type: 'blank_field',
                                name: 'blankField1',
                                id: 'blankField1',
                                dynamic: {
                                    field: 'allowPushMsgAlertOnApplyByEmp',
                                    value: 'NO'
                                },
                            },

                            {
                                type: 'ckeditor',
                                name: 'pushMsgOnCancelByEmp',
                                id: 'pushMsgOnCancelByEmp',
                                title: "Push Notification Body for Cancelled Leave",
                                pattern: {
                                    value: regex.maxSize250,
                                    message: 'Please enter valid code with alpha-numeric and below 50 characters'
                                },
                                infoMessage: ["Alphanumeric characters are allowed", "Maximum length should be 250 characters", "e.g.:Successfully created"],
                                validationProps: {
                                    required: 'This is a mandatory field'
                                },
                                dynamic: {
                                    field: 'allowPushMsgAlertOnCancelByEmp',
                                    value: 'YES'
                                },
                            },
                            {
                                type: 'blank_field',
                                name: 'blankField1',
                                id: 'blankField1',
                                dynamic: {
                                    field: 'allowPushMsgAlertOnCancelByEmp',
                                    value: 'NO'
                                },
                            },
                        ]
                    },
                    {
                        type: 'section',
                        layout: { column: 1, spacing: 2, size: 'small', label: 'fixed' },
                        fields: [
                            {
                                type: 'switchToggle',
                                name: 'allowPushMsgAlertOnPendingReqAction',
                                id: 'allowPushMsgAlertOnPendingReqAction',
                                title: "Push Notification after Leave Approved/Rejected",
                                infoMessage: ["Radio button is selectable", "e.g.: yes"],
                                options: [
                                    { title: "Yes", value: "YES" },
                                    { title: "No", value: "NO" }
                                ],
                                // validationProps: {
                                //     required: 'This is a mandatory field'
                                // },
                            },
                            {
                                type: 'ckeditor',
                                name: 'pushMsgOnPendingReqAction',
                                id: 'pushMsgOnPendingReqAction',
                                title: "Push Notification Body for Approved/Rejected Leave",
                                pattern: {
                                    value: regex.maxSize250,
                                    message: 'Please enter valid code with alpha-numeric and below 50 characters'
                                },
                                infoMessage: ["Alphanumeric characters are allowed", "Maximum length should be 250 characters", "e.g.:Successfully created"],
                                validationProps: {
                                    required: 'This is a mandatory field'
                                },
                                dynamic: {
                                    field: 'allowPushMsgAlertOnPendingReqAction',
                                    value: 'YES'
                                },
                            },
                        ]
                    },

                ]
            },
        ]
    };
    const handleSubmit = async (values) => {
        setshowbtn(false);
        if (values.button?.toUpperCase() == 'SUBMIT') {
            let postData = values?.data;
            let dptNameArr = [];
            departmentList?.map(el => {
                if (values?.data?.departments?.includes(el.value)) {
                    values?.data?.departments?.map(ele => {
                        if (el.value == ele) { dptNameArr.push(el.name); }
                    })
                }
            })
            postData.departmentName = dptNameArr;
            postData.autoRejectDate = '1'; //moment(new Date()).format('YYYY-MM-DD')
            postData.autoRejectTime = '23:59';
            axios.post(api.leave.postLeaveSetting, postData).then(res => {
                setshowbtn(true);
                if (res?.data?.status == '200') {
                    setOpenAddDial(false);
                    toast.success("Leave setting created successfully.");
                    getAllSettings();
                }
                else {
                    toast.error(res?.data?.message || "Something went wrong.")

                }
            }).catch(err => {
                toast.error("Something went wrong.")
                setshowbtn(true);
            })
        }
    }
    return (
        <>
            {!showbtn ?
                <AppLoader />
                : null}
            <SmartForm
                template={template}
                onSubmit={handleSubmit}
                buttons={['submit']}
                mode={"onTouched"}
            />
        </>
    )
}

export default LeaveSetting