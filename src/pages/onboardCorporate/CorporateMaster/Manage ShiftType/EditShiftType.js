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
import AwsAuthProvider from '@crema/services/auth/aws-cognito/AWSAuthProvider';
import PopEdit from '@editpopup';

const EditShiftType = ({id, popBTNClick, openDialog}) => {
  const navigate = useNavigate();
  const [showbtn, setshowbtn] = React.useState(true);
  const [data, setData] = useState();
  const {user} = useAuthUser();
  useEffect(() => {
    async function getShiftType() {
      axios
        .get(`${api.shiftType.getbyId}/${id}`)
        .then((response) => {
          setData(response?.data?.data ?? []);
        })
        .catch(() => {
          setData([]);
        });
    }
    getShiftType();
  }, [id]);

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
        type: 'text',
        name: 'shiftType',
        id: 'shiftType',
        title: 'Shift Type Name',
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

      {
        type: 'radio',
        name: 'pickupType',
        id: 'pickupType',
        title: 'Pick Up',
        infoMessage: [
          'only Alphabets are allowed',
          'Maximum length should be 50 characters',
          'e.g.: Morning',
        ],
        options: [
          {title: 'Home', value: 'HOME'},
          {title: 'Nodal', value: 'NODAL'},
        ],
        pattern: {
          value: regex.char50,
          message: 'Please enter valid Shiftname',
        },
        validationProps: {
          required: 'This is a mandatory field',
        },
      },
    ],
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
      dataSet.tanentId = user?.userList?.tanentId;
      dataSet.corporateId = user?.userList?.corporateId;
      dataSet.status = 'ACTIVE';
      axios
        .put(api.shiftType.update, dataSet)
        .then((response) => {
          if (response?.data?.status == '200') {
            // navigate('/onboardCorporate/designation/designation-table')
            toast.success(response?.data?.message ?? 'Created successfully');
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
  };

  return (
    <>
      {data && data.id && (
        <PopEdit
          title={data?.shiftType}
          poptemplate={template}
          defaultValues={data}
          openDialog={openDialog}
          // showbtn={showbtn}
          buttons={['update']}
          // onChange={handleChange}
          // setVal={[{ name: "pointName", value: tempFData?.pointname }, { name: "latitude", value: tempFData?.latitude },{name:"longitude", value: tempFData?.longitude} ]}
          popAction={handleSubmit}
        />
      )}
    </>
  );
};

export default EditShiftType;
