import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import SmartForm from '@smart-form';
import {useAuthUser} from '@crema/utility/AuthHooks';
import regex from '@regex';
import axios from 'axios';
import api from '@api';
import SnackbarCustom from 'pages/thirdParty/SnackBar/SnackBarMsg';
import {SettingsPowerRounded} from '@mui/icons-material';
import AppLoader from '@crema/core/AppLoader';
import {toast} from 'react-toastify';
import CustomLabel from 'pages/common/CustomLabel';
import {useSelector} from 'react-redux';

const CreateForm = () => {
  const navigate = useNavigate();
  const [showbtn, setshowbtn] = React.useState(true);
  const {user} = useAuthUser();
  const [formData, setformData] = useState();
  const [formType, setFormType] = useState('update');
  const [myActions, setMyActions] = useState([]);
  const [loginshifts, setLoginShifts] = useState();
  const [logoutshifts, setLogoutShifts] = useState();
  const permissionCheck = useSelector(({settings}) => settings.permissions);
  useEffect(() => {
    if (!permissionCheck) return;
    let sub_mod = {};
    permissionCheck?.map((el) => {
      if (el.subModuleName == 'Routing Rule') sub_mod = el;
    });
    setMyActions(sub_mod?.actions);
    if (
      (!sub_mod || !sub_mod?.actions?.includes('View')) &&
      user?.userList?.userRole !== 'SUPERADMIN'
    )
      navigate('/error-pages/error-404');
  }, [permissionCheck, user]);
  useEffect(() => {
    if (!user?.userList?.corporateId) {
      return;
    }
    axios
      .get(api.routes.getRoutingRuleByCorporateId + user?.userList?.corporateId)
      .then((response) => {
        console.log('response', response);
        if (response?.data?.data)
          setformData({
            ...response?.data?.data,
            tempallowedShiftsForLoginTrip:
              response?.data?.data?.allowedShiftsForLoginTrip,
            tempallowedShiftsForLogoutTrip:
              response?.data?.data?.allowedShiftsForLogoutTrip,
          });
        else {
          setformData({});
          setFormType('create');
        }
      })
      .catch((er) => {
        // setshowbtn(true);
        // toast.error("Something went wrong");
        setformData({});
        setFormType('create');
      });
  }, []);
  useEffect(() => {
    console.log('formData', formData);
  }, [formData]);
  useEffect(() => {
    const baseURL = `${api.manageshifts.getlistbyCorporate}corporateId?page=0&size=10000&shiftName=null`;
    let temAr = [];
    let temArr = [];
    axios
      .get(baseURL)
      .then((response) => {
        response?.data?.data?.body['ShiftList']?.map((r) => {
          temAr.push({
            title: r.shiftName + '(' + r.shiftStart + ')',
            value: r?.id,
          });
          temArr.push({
            title: r.shiftName + '(' + r.shiftEnd + ')',
            value: r?.id,
          });
        });
        setLoginShifts(temAr);
        setLogoutShifts(temArr);
      })
      .catch((er) => {});
  }, []);

  let template = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    // title: 'Routing Rule',
    // description: 'Routing Rule',
    sections: [
      {
        layout: {column: 2, spacing: 2, size: 'small', label: 'fixed'},
        id: 'routing_rule',
        fields: [
          {
            type: 'radio',
            name: 'deviConst',
            id: 'deviConst',
            title: 'Deviation constraint:',
            infoMessage: ['Radio button is selectable', 'Ex: ETA'],
            options: [
              {title: 'ETA', value: 'eta'},
              {title: 'Distance', value: 'distance'},
            ],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'section',
            layout: {
              column: 1,
              spacing: 2,
              size: 'small',
              label: 'fixed',
              type: 'grid',
            },
            fields: [
              {
                type: 'text',
                name: 'maxTravelTimeAllowInMin',
                id: 'maxTravelTimeAllowInMin',
                title:
                  'Maximum travel time deviation allowed per employee(in minute(s))',
                maxChar: '5',
                isNumber: true,
                infoMessage: [
                  'Numeric characters are allowed',
                  'Maximum length should be 5 characters',
                  'eg: 120',
                ],
                validationProps: {
                  required: 'This is a mandatory field',
                },
                dynamic: {
                  field: 'deviConst',
                  value: 'eta',
                },
              },
              {
                type: 'text',
                name: 'maxTravelTimeAllowInDistance',
                id: 'maxTravelTimeAllowInDistance',
                title: 'Maximum travel distance allowed per employee(km)',
                maxChar: '5',
                isNumber: true,
                infoMessage: [
                  'Numeric characters are allowed',
                  'Maximum length should be 5 characters',
                  'eg: 120',
                ],

                // pattern: {
                //     value: regeg.maxSize50,
                //     message: 'Please enter valid time in minutes'
                // },
                validationProps: {
                  required: 'This is a mandatory field',
                },
                dynamic: {
                  field: 'deviConst',
                  value: 'distance',
                },
              },
            ],
          },
          {
            type: 'text',
            name: 'maxTravelTimeAllowInPer',
            id: 'maxTravelTimeAllowInPer',
            title: 'Whichever is lower will be applied in routing(%)',
            maxChar: '3',
            isNumber: true,
            infoMessage: [
              'Numeric characters are allowed',
              'Maximum length should be 3 characters',
              'eg: 120',
            ],

            // pattern: {
            //     value: regeg.maxSize50,
            //     message: 'Please enter valid routing(%)'
            // },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          // {
          //   type: 'text',
          //   name: 'avgSpeed',
          //   id: 'avgSpeed',
          //   title: 'Average Speed(km/hr)',
          //   maxChar: '3',
          //   isNumber: true,
          //   infoMessage: [
          //     'Numeric characters are allowed',
          //     'Maximum length should be 3 characters',
          //     'Ex: 120',
          //   ],

          //   // pattern: {
          //   //     value: regex.maxSize50,
          //   //     message: 'Please enter valid Average Speed'
          //   // },
          //   validationProps: {
          //     required: 'This is a mandatory field',
          //   },
          // },
          // {
          //   type: 'text',
          //   name: 'maxVehicleSpeedAllowed',
          //   id: 'maxVehicleSpeedAllowed',
          //   title: 'Max Vehicle Speed Allowed(km/hr)',
          //   maxChar: '3',
          //   isNumber: true,
          //   infoMessage: [
          //     'Numeric characters are allowed',
          //     'Maximum length should be 3 characters',
          //     'Ex: 120',
          //   ],

          //   // pattern: {
          //   //     value: regex.maxSize50,
          //   //     message: 'Please enter valid Max Vehicle Speed Allowed'
          //   // },
          //   validationProps: {
          //     required: 'This is a mandatory field',
          //   },
          // },
          {
            type: 'text',
            name: 'boardingTime',
            id: 'boardingTime',
            title: 'Boarding Time/Stop(min)',
            maxChar: '3',
            isNumber: true,
            infoMessage: [
              'Numeric characters are allowed',
              'Maximum length should be 3 characters',
              'Ex: 120',
            ],

            // pattern: {
            //     value: regex.maxSize50,
            //     message: 'Please enter valid Speed Boarding Time/Stop'
            // },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'text',
            name: 'maxTravelTime',
            id: 'maxTravelTime',
            title: 'Maximum Travel Time(min)',
            maxChar: '5',
            isNumber: true,
            infoMessage: [
              'Numeric characters are allowed',
              'Maximum length should be 5 characters',
              'Ex: 120',
            ],

            // pattern: {
            //     value: regex.maxSize50,
            //     message: 'Please enter valid Maximum Travel Time'
            // },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'text',
            name: 'bufferTime',
            id: 'bufferTime',
            title: 'Buffer Time/Trip(min)',
            maxChar: '3',
            isNumber: true,
            infoMessage: [
              'Numeric characters are allowed',
              'Maximum length should be 3 characters',
              'Ex: 120',
            ],

            // pattern: {
            //     value: regex.maxSize50,
            //     message: 'Please enter valid Buffer Time/Trip'
            // },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'text',
            name: 'localityRadius',
            id: 'localityRadius',
            title: 'Locality Radius(km)',
            maxChar: '5',
            isNumber: true,
            infoMessage: [
              'Numeric characters are allowed',
              'Maximum length should be 5 characters',
              'Ex: 120',
            ],

            // pattern: {
            //     value: regex.maxSize50,
            //     message: 'Please enter valid Buffer Time/Trip'
            // },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'text',
            name: 'otaBuffer',
            id: 'otaBuffer',
            title: 'OTA Buffer(min)',
            maxChar: '3',
            isNumber: true,
            infoMessage: [
              'Numeric characters are allowed',
              'Maximum length should be 3 characters',
              'Ex: 120',
            ],

            // pattern: {
            //     value: regex.maxSize50,
            //     message: 'Please enter valid OTA Buffer'
            // },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'text',
            name: 'otdBuffer',
            id: 'otdBuffer',
            title: 'OTD Buffer(min)',
            maxChar: '3',
            isNumber: true,
            infoMessage: [
              'Numeric characters are allowed',
              'Maximum length should be 3 characters',
              'Ex: 120',
            ],

            // pattern: {
            //     value: regex.maxSize50,
            //     message: 'Please enter valid OTD Buffer'
            // },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
        ],
      },

      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        title: 'Regular Trip',
        fields: [
          {
            type: 'section',
            layout: {column: 1, spacing: 2, size: 'medium', label: 'fixed'},
            fields: [
              {
                type: 'autocomplete',
                name: 'femaleSecurity',
                id: 'femaleSecurity',
                disabled: false,
                title: 'Female Security',
                infoMessage: ['Dropdown values are selectable', 'eg: Always'],
                options: [
                  {title: 'No', value: 'no'},
                  {title: 'Yes', value: 'yes'},
                  {title: 'Always', value: 'always'},
                ],
              },
              {
                type: 'autocomplete',
                name: 'darkHoursMode',
                id: 'darkHoursMode',
                disabled: false,
                title: 'Darkhour Mode',
                infoMessage: [
                  'Dropdown values are selectable',
                  'eg: Shift Based Guard',
                ],
                options: [
                  {title: 'Shift Based Guard', value: 'shiftbased'},
                  {title: 'ETA Based Guard', value: 'etabased'},
                ],
                dynamic: {
                  field: 'femaleSecurity',
                  // isNotValue: 'no',
                  value: 'yes',
                },
              },
              {
                type: 'section',
                layout: {
                  column: 2,
                  spacing: 2,
                  size: 'small',
                  label: 'fixed',
                  type: 'grid',
                },
                fields: [
                  {
                    type: 'multiSelect',
                    name: 'tempallowedShiftsForLoginTrip',
                    id: 'tempallowedShiftsForLoginTrip',
                    // multiple: true,
                    options: loginshifts ?? [],
                    disabled: false,
                    title: 'Allowed shift for login (From)',
                    // input_type: 'time',
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
                    dynamic: {
                      field: 'darkHoursMode',
                      value: 'shiftbased',
                    },
                  },
                  {
                    type: 'multiSelect',
                    name: 'tempallowedShiftsForLogoutTrip',
                    id: 'tempallowedShiftsForLogoutTrip',
                    // multiple: true,
                    options: logoutshifts ?? [],
                    disabled: false,
                    // input_type: 'time',
                    title: 'Allowed Shift for logout (To)',
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
                    dynamic: {
                      field: 'darkHoursMode',
                      value: 'shiftbased',
                    },
                  },
                ],
                dynamic: {
                  field: 'femaleSecurity',
                  value: 'yes',
                  // isNotValue: 'no',
                },
              },
              {
                type: 'section',
                layout: {
                  column: 2,
                  spacing: 2,
                  size: 'small',
                  label: 'fixed',
                  type: 'grid',
                },
                fields: [
                  {
                    type: 'text',
                    name: 'pickUpETADurationFrom',
                    id: 'pickUpETADurationFrom',
                    disabled: false,
                    title: 'Pickup ETA Duration (From)',
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
                    dynamic: {
                      field: 'darkHoursMode',
                      value: 'etabased',
                    },
                  },
                  {
                    type: 'text',
                    name: 'pickUpETADurationTo',
                    id: 'pickUpETADurationTo',
                    disabled: false,
                    input_type: 'time',
                    title: 'Pickup ETA Duration(To)',
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
                    dynamic: {
                      field: 'darkHoursMode',
                      value: 'etabased',
                    },
                  },
                ],
                dynamic: {
                  field: 'femaleSecurity',
                  value: 'yes',
                  // isNotValue: 'no',
                },
              },
              {
                type: 'section',
                layout: {
                  column: 2,
                  spacing: 2,
                  size: 'small',
                  label: 'fixed',
                  type: 'grid',
                },
                fields: [
                  {
                    type: 'text',
                    name: 'dropETADurationFrom',
                    id: 'dropETADurationFrom',
                    disabled: false,
                    input_type: 'time',
                    title: 'Drop ETA Duration (From)',
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
                    dynamic: {
                      field: 'darkHoursMode',
                      value: 'etabased',
                    },
                  },
                  {
                    type: 'text',
                    name: 'dropETADurationTo',
                    id: 'dropETADurationTo',
                    infoMessage: [
                      'Numerics are allowed',
                      'Time should start from 00-23',
                      'It should be followed by two digits from 00 to 59',
                      'e.g.: 00:00, 22:00',
                    ],
                    disabled: false,
                    input_type: 'time',
                    title: 'Drop ETA Duration  (To)',
                    // pattern: {
                    //     value: regex.hhmmReg,
                    //     message: 'Please enter valid Time (i.e.: 23:59, 00:00)'
                    // },
                    validationProps: {
                      required: 'This is a mandatory field',
                    },
                    dynamic: {
                      field: 'darkHoursMode',
                      value: 'etabased',
                    },
                  },
                ],
                dynamic: {
                  field: 'femaleSecurity',
                  // isNotValue: 'no',
                  value: 'yes',
                },
              },
            ],
          },
        ],
      },

      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        title: 'Adhoc Trip',
        fields: [
          {
            type: 'section',
            layout: {column: 1, spacing: 2, size: 'medium', label: 'fixed'},
            fields: [
              {
                type: 'autocomplete',
                name: 'adhocFemaleSecurity',
                id: 'adhocFemaleSecurity',
                disabled: false,
                title: 'Adhoc Female Security',
                infoMessage: ['Dropdown values are selectable', 'eg: Always'],
                options: [
                  {title: 'No', value: 'no'},
                  {title: 'Yes', value: 'yes'},
                  {title: 'Always', value: 'always'},
                ],
              },
              {
                type: 'section',
                layout: {
                  column: 2,
                  spacing: 2,
                  size: 'medium',
                  label: 'fixed',
                },
                fields: [
                  {
                    type: 'text',
                    input_type: 'time',
                    name: 'adhocPickUpETADurationFrom',
                    id: 'adhocPickUpETADurationFrom',
                    disabled: false,
                    title: 'Adhoc Pickup ETA duration (from)',
                    infoMessage: [
                      'Dropdown values are selectable',
                      'eg: Always',
                    ],
                    options: [
                      {title: 'No', value: 'no'},
                      {title: 'Yes', value: 'yes'},
                      {title: 'Always', value: 'always'},
                    ],
                    dynamic: {
                      field: 'adhocFemaleSecurity',
                      value: 'yes',
                    },
                  },
                  {
                    type: 'text',
                    input_type: 'time',
                    name: 'adhocPickUpETADurationTo',
                    id: 'adhocPickUpETADurationTo',
                    disabled: false,
                    title: 'Adhoc Pickup ETA duration (to)',
                    infoMessage: [
                      'Dropdown values are selectable',
                      'eg: Always',
                    ],
                    options: [
                      {title: 'No', value: 'no'},
                      {title: 'Yes', value: 'yes'},
                      {title: 'Always', value: 'always'},
                    ],
                    dynamic: {
                      field: 'adhocFemaleSecurity',
                      value: 'yes',
                    },
                  },
                  {
                    type: 'text',
                    input_type: 'time',
                    name: 'adhocDropETADurationFrom',
                    id: 'adhocDropETADurationFrom',
                    disabled: false,
                    title: 'Adhoc Drop ETA duration (from)',
                    infoMessage: [
                      'Dropdown values are selectable',
                      'eg: Always',
                    ],
                    options: [
                      {title: 'No', value: 'no'},
                      {title: 'Yes', value: 'yes'},
                      {title: 'Always', value: 'always'},
                    ],
                    dynamic: {
                      field: 'adhocFemaleSecurity',
                      value: 'yes',
                    },
                  },
                  {
                    type: 'text',
                    input_type: 'time',
                    name: 'adhocDropETADurationTo',
                    id: 'adhocDropETADurationTo',
                    disabled: false,
                    title: 'Adhoc Drop ETA duration (to)',
                    infoMessage: [
                      'Dropdown values are selectable',
                      'eg: Always',
                    ],
                    options: [
                      {title: 'No', value: 'no'},
                      {title: 'Yes', value: 'yes'},
                      {title: 'Always', value: 'always'},
                    ],
                    dynamic: {
                      field: 'adhocFemaleSecurity',
                      value: 'yes',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };

  const handleSubmit = async (values) => {
    setshowbtn(false);
    setshowbtn(false);
    console.log('values', values?.data);
    let dataSet = {
      corporateId: user?.userList?.corporateId,
      corporateName: user?.userList?.corporateName,
      tanentId: user?.userList?.tanentId,
      tanentName: user?.userList?.tanentName,
    };
    let temp = [];
    let temp_arr = [];
    values?.data?.tempallowedShiftsForLoginTrip?.map((el) => {
      temp.push(el);
    });
    values?.data?.tempallowedShiftsForLogoutTrip?.map((el) => {
      temp_arr.push(el);
    });
    console.log('temp', temp, temp_arr);
    values.data.allowedShiftsForLoginTrip = temp;

    values.data.allowedShiftsForLogoutTrip = temp_arr;
    dataSet = {...dataSet, ...values.data};
    console.log('dataSet', dataSet);
    delete dataSet.tempallowedShiftsForLoginTrip;
    delete dataSet.tempallowedShiftsForLogoutTrip;

    axios
      .post(api.routes.addRoutingRule, dataSet)
      .then((response) => {
        if (response?.data?.status == '200') {
          if (formType === 'create') {
            toast.success('Routing Rule created successfully');
            // toast.success('Created successfully');
            window.location.reload();
          } else {
            toast.success('Routing Rule edited successfully');
          }
        } else {
          toast.error(response?.data?.message ?? 'Something went wrong');
        }
        setshowbtn(true);
      })
      .catch((er) => {
        setshowbtn(true);
        toast.error('Something went wrong');
      });
    // };
  };
  return (
    <>
      <div style={{marginBottom: '10px'}}>
        <CustomLabel labelVal='Routing Rule' variantVal='h3-underline' />
      </div>
      {!showbtn ? <AppLoader /> : null}
      {formData ? (
        <SmartForm
          template={template}
          defaultValues={formData}
          onSubmit={handleSubmit}
          buttons={
            formType == 'create'
              ? myActions?.includes('Create')
                ? ['submit']
                : null
              : myActions?.includes('Edit')
              ? ['update']
              : null
          }
        />
      ) : null}
    </>
  );
};

export default CreateForm;
