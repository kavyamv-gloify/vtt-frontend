import React, {useState, useEffect} from 'react';
import SmartForm from '@smart-form';
import {useAuthUser} from '@crema/utility/AuthHooks';
import regex from '@regex';
import axios from 'axios';
import api from '@api';
import AppLoader from '@crema/core/AppLoader';
import {toast} from 'react-toastify';

const ShiftCreateForm = ({close}) => {
  const [showbtn, setshowbtn] = React.useState(true);
  const {user} = useAuthUser();

  const CorpId =
    user?.role == 'CORPORATEADMIN'
      ? user?.userList?.profileId
      : user?.userList?.corporateId;
  let template = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    // title: 'Shift Type',
    description: 'Form for applying Job',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'hidden',
            name: 'corpId',
            id: 'corpId',
            title: 'corporate Id',
            // defaultValue: user?.userList?.profileId
            defaultValue: CorpId,
          },
          {
            type: 'section',
            layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
            fields: [
              {
                type: 'text',
                name: 'shiftName',
                id: 'shiftName',
                title: 'Name',
                infoMessage: [
                  'only Alphabets are allowed',
                  'Maximum length should be 50 characters',
                  'e.g.: Morning',
                ],
                pattern: {
                  value: regex.char50,
                  message: 'Please enter valid Shiftname',
                },
                validationProps: {
                  required: 'This is a mandatory field',
                },
              },
              //     ]
              // },

              // {
              //     type: "section",
              //     layout: { column: 2, spacing: 2, size: 'medium', label: 'fixed' },
              //     fields: [
              {
                type: 'radio',
                name: 'pickupType',
                id: 'pickupType',
                title: 'Pickup Mode',
                infoMessage: [
                  'Select option from the radio button options.',
                  'This is madatory field.',
                  'e.g.: Morning',
                ],
                options: [
                  {title: 'Home', value: 'HOME'},
                  {title: 'Nodal', value: 'NODAL'},
                ],
                validationProps: {
                  required: 'This is a mandatory field',
                },
              },
              // {
              //     type: 'switchToggle',
              //     name: 'pickupType',
              //     id: 'pickupType',
              //     title: "Logout Pickup Mode",
              //     infoMessage: ["Select option from the radio button options.", "This is madatory field.", "e.g.: Morning"],
              //     options: [
              //         { title: 'Home', value: 'HOME' },
              //         { title: 'Nodal', value: 'NODAL' },
              //     ],
              //     validationProps: {
              //         required: 'This is a mandatory field'
              //     }
              // },
              // {
              //     type: 'blank',
              //     name: 'pickupType23',
              //     id: 'pickupType23',
              //     title: "Login Pickup Mode",
              // },
            ],
          },
          {
            type: 'section',
            layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
            fields: [
              {
                type: 'text',
                name: 'shiftStart',
                id: 'shiftStart',
                title: 'Login',
                input_type: 'time',
                infoMessage: [
                  'Numerics are allowed',
                  'Time should start from 00-23',
                  'It should be followed by two digits from 00 to 59',
                  'e.g.: 00:00, 22:00',
                ],
                validationProps: {
                  required: 'This is a mandatory field',
                },
              },
              {
                type: 'text',
                name: 'shiftEnd',
                id: 'shiftEnd',
                title: 'Logout',
                input_type: 'time',
                infoMessage: [
                  'Numerics are allowed',
                  'Time should start from 00-23',
                  'It should be followed by two digits from 00 to 59',
                  'e.g.: 00:00, 22:00',
                ],
                // pattern: {
                //     value: regex.hhmmReg,
                //     message: 'Please enter valid Time (i.e.: 23:59, 00:00)'
                // },
                validationProps: {
                  required: 'This is a mandatory field',
                },
              },
            ],
          },

          // {
          //     type: "section",
          //     layout: { column: 2, spacing: 2, size: 'medium', label: 'fixed' },
          //     fields: [
          //         {
          //             type: "section",
          //             layout: { column: 2, spacing: 2, size: 'medium', label: 'fixed' },
          //             fields: [
          //                 {
          //                     type: 'autocomplete',
          //                     name: 'shiftType',
          //                     id: 'shiftType',
          //                     title: 'Shift Type',
          //                     infoMessage: ["Dropdown values are selectable", "e.g.:Weekly"],
          //                     options: shifttype ?? [],
          //                     validationProps: {
          //                         required: 'This is a mandatory field'
          //                     }
          //                 },
          //                 {
          //                     type: 'button',
          //                     name: 'addagency',
          //                     id: 'addagency',
          //                     title: '',
          //                     defaultValue: "Add Shift Type",
          //                 },
          //             ]
          //         },
          //     ]
          // },
          {
            type: 'text',
            name: 'remarks',
            id: 'remarks',
            title: 'Remarks',
            infoMessage: [
              'Alphanumeric characters are allowed',
              'Maximum length should be 250 characters',
              'e.g.: average, good',
            ],
            pattern: {
              value: regex.maxSize250,
              message: 'Please enter valid remarks with max 250 characters',
            },
            // validationProps: {
            //     required: 'This is a mandatory field'
            // }
          },
        ],
      },
    ],
  };

  const handleSubmit = async (values) => {
    setshowbtn(false);

    setshowbtn(false);
    if (values.button.toUpperCase() === 'SUBMIT') {
      let dataSet = {};
      dataSet = values.data;
      // shifttype?.map((e) => {
      //     if (e?.value == dataSet.shiftType) {
      //       dataSet.pickupType = e?.pickUpType
      //     }
      //   })

      axios
        .post(api.manageshifts.createform, dataSet)
        .then((response) => {
          if (response?.data?.status == '200') {
            // navigate('/onboardCorporate/shift/shift-listing')
            toast.success(
              `${response?.data?.data?.shiftName} created successfully`,
            );
            // toast.success(' Shift created successfully');
            close(false);
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
      {!showbtn ? <AppLoader /> : null}
      <SmartForm
        template={template}
        onSubmit={handleSubmit}
        buttons={['submit']}
        mode='onTouched'
      />
    </>
  );
};
export default ShiftCreateForm;
