import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import SmartForm from '@smart-form';
import {useAuthUser} from '@crema/utility/AuthHooks';
import regex from '@regex';
import axios from 'axios';
import api from '@api';
import SnackbarCustom from 'pages/thirdParty/SnackBar/SnackBarMsg';
import {SettingsPowerRounded} from '@mui/icons-material';
import {useState} from 'react';
import {useParams} from 'react-router-dom';
import AppLoader from '@crema/core/AppLoader';
import Api from '@api';
import PopEdit from '@editpopup';
import {toast} from 'react-toastify';

const EditForm = ({id, popBTNClick, openDialog}) => {
  const navigate = useNavigate();
  const {user} = useAuthUser();
  const [data, setData] = useState();
  // const {id}= useParams();
  const CorpId =
    user?.role == 'CORPORATEADMIN'
      ? user?.userList?.profileId
      : user?.userList?.corporateId;
  const [deptList, setDeptList] = useState();
  const [showbtn, setshowbtn] = React.useState(true);
  const [shiftType, setShiftType] = useState();
  const corporateId = user.userList.profileId;

  const userShiftsDetail = async () => {
    const baseURL = `${Api?.masters?.getallShift}/${id}`;
    let response = await axios.get(`${baseURL}`);

    setData(response?.data?.data);
  };
  useEffect(() => {
    userShiftsDetail();
    getShiftType();
  }, [id]);

  // async function getDeptList() {
  //     let res = await axios.get(`${Api?.department?.list}/null/employeeId/${corporateId}/corporateId`);
  //     let temp = [];
  //     if (res?.data?.data?.length) {
  //         res?.data?.data?.map((e) => {
  //
  //             temp.push({ title: e.departmentName, value: e.id });
  //         })
  //     }
  //     setDeptList(temp);
  // }

  // useEffect(() => {

  //     getDeptList();
  // }, [])

  async function getShiftType() {
    let res = await axios.get(`${api?.mastershifttype?.getall}`);
    let temp = [];

    if (res?.data?.data?.length) {
      res?.data?.data?.map((e) => {
        temp.push({title: e.shiftType, value: e.shiftType});
      });
    }
    setShiftType(temp);
  }
  let template = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    title: 'Edit Form',
    description: 'Form for applying Job',
    // sections: [
    // {
    // layout: { column: 1, spacing: 2, size: 'small', label: 'fixed' },
    // id: 'personal_information',
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
        type: 'switchToggle',
        name: 'pickupType',
        id: 'pickupType',
        title: 'Pick-up Mode',
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
      //     type: 'autocomplete',
      //     name: 'shiftType',
      //     id: 'shiftType',
      //     title: 'Shift Type',
      //     infoMessage: ["Dropdown values are selectable", "e.g.: Weekly"],
      //     options: shiftType ?? [],
      //     validationProps: {
      //       required: 'This is a mandatory field'
      //     }
      //   },
      {
        type: 'text',
        name: 'shiftName',
        id: 'shiftName',
        title: 'Name',
        validationProps: {
          required: 'This is a mandatory field',
        },
      },
      {
        type: 'time',
        name: 'shiftStart',
        id: 'shiftStart',
        title: 'Login',
        // disabled: true,
        input_type: 'time',
        // pattern: {
        //     value: regex.hhmmReg,
        //     message: 'Please enter valid Time (i.e.: 23:59, 00:00)'
        // },

        validationProps: {
          required: 'This is a mandatory field',
        },
      },

      {
        type: 'time',
        name: 'shiftEnd',
        id: 'shiftEnd',
        title: 'Logout',
        // disabled: true,
        input_type: 'time',
        // pattern: {
        //     value: regex.hhmmReg,
        //     message: 'Please enter valid Time (i.e.: 23:59, 00:00)'
        // },
        validationProps: {
          required: 'This is a mandatory field',
        },
      },
      // {
      //     type: 'text',
      //     name: 'shiftLogin',
      //     id: 'shiftLogin',
      //     title: 'Shift Login',

      //     pattern: {
      //         value: regex.hhmmReg,
      //         message: 'Please enter valid Time (i.e.: 23:59, 00:00)'
      //     },
      //     validationProps: {
      //         required: 'This is a mandatory field'
      //     }
      // },
      // {
      //     type: 'text',
      //     name: 'shiftLogout',
      //     id: 'shiftLogout',
      //     title: 'Shift Logout',

      //     pattern: {
      //         value: regex.hhmmReg,
      //         message: 'Please enter valid Time (i.e.: 23:59, 00:00)'
      //     },
      //     validationProps: {
      //         required: 'This is a mandatory field'
      //     }
      // },
      // {
      //     type: 'text',
      //     name: 'login',
      //     id: 'login',
      //     title: 'Login',

      //     pattern: {
      //         value: regex.hhmmReg,
      //         message: 'Please enter valid Time (i.e.: 23:59, 00:00)'
      //     },
      //     validationProps: {
      //         required: 'This is a mandatory field'
      //     }
      // },
      // {
      //     type: 'text',
      //     name: 'logout',
      //     id: 'logout',
      //     title: 'Logout',

      //     pattern: {
      //         value: regex.hhmmReg,
      //         message: 'Please enter valid Time (i.e.: 23:59, 00:00)'
      //     },
      //     validationProps: {
      //         required: 'This is a mandatory field'
      //     }
      // },
      // {
      //     type: 'text',
      //     name: 'reportingTime',
      //     id: 'reportingTime',
      //     title: 'Reporting Time',

      //     pattern: {
      //         value: regex.hhmmReg,
      //         message: 'Please enter valid Time (i.e.: 23:59, 00:00)'
      //     },
      //     validationProps: {
      //         required: 'This is a mandatory field'
      //     }
      // },
      // {
      //     type: 'autocomplete',
      //     name: 'departmentId',
      //     id: 'departmentId',
      //     title: 'Department Name',
      //     options: deptList ?? [],
      //     validationProps: {
      //         required: 'This is a mandatory field'
      //     }
      // },

      {
        type: 'text',
        name: 'remarks',
        id: 'remarks',
        title: 'Remarks',

        pattern: {
          value: regex.maxSize250,
          message: 'Please enter valid remarks with max 250 characters',
        },
        // validationProps: {
        //     required: 'This is a mandatory field'
        // }
      },

      // {
      //     type: 'autocomplete',
      //     name: 'departmentId',
      //     id: 'departmentId',
      //     title: 'Department Name',
      //     options: deptList,
      //     validationProps: {
      //         required: 'This is a mandatory field'
      //     }
      // },
    ],
    // },
    // ]
  };

  const handleSubmit = async (values) => {
    if (values?.close) {
      popBTNClick(false);
      return;
    }
    setshowbtn(false);

    setshowbtn(false);
    if (values.button.toUpperCase() === 'UPDATE') {
      let dataSet = {};
      dataSet = values.data;

      axios
        .put(api.manageshifts.createform, dataSet)
        .then((response) => {
          if (response?.data?.status == '200') {
            // navigate('/onboardCorporate/shift/shift-listing'),
            toast.success(
              `${response?.data?.data?.shiftName} details updated successfully`,
            );
            // toast.success('Shift updated successfully');
            popBTNClick(false);
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

    //
  };

  return (
    <>
      {/* {!showbtn ?
                <AppLoader />
                : null} */}
      {data && data.id && (
        <PopEdit
          title={data?.shiftName}
          defaultValues={data}
          poptemplate={template}
          openDialog={openDialog}
          popAction={handleSubmit}
          buttons={['update']}
        />
      )}
    </>
  );
};

export default EditForm;
