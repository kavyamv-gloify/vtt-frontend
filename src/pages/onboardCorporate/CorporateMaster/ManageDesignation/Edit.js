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

const EditDesignationForm = ({id, popBTNClick, openDialog, getFilterData}) => {
  const navigate = useNavigate();
  const [showbtn, setshowbtn] = React.useState(true);
  const [data, setData] = useState();

  useEffect(() => {
    async function getDesignation() {
      axios
        .get(`${api.designation.getbyid}/${id}`)
        .then((res) => {
          setData(res?.data?.data);
        })
        .catch(() => {
          setData([]);
        });
    }
    getDesignation();
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
        name: 'designationName',
        id: 'designationName',
        title: 'Designation Name',
        pattern: {
          value: regex.maxSize50,
          message:
            'Please enter  valid code with alpha-numeric and below 50 characters',
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
      (dataSet.status = 'ACTIVE'),
        axios
          .put(api.designation.update, dataSet)
          .then((response) => {
            if (response?.data?.status == '200') {
              // navigate('/onboardCorporate/designation/designation-table')
              toast.success(
                `${response?.data?.data?.designationName} details updated successfully`,
              );
              // toast.success(response?.data?.message ?? 'Created successfully');
              getFilterData();
              popBTNClick(false);
            } else {
              setshowbtn(true);
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
      {/* {!showbtn ?
                <AppLoader />
                : null} */}
      {data && data.id && (
        <PopEdit
          // title={data?.reason}
          poptemplate={template}
          defaultValues={data}
          title={data?.designationName}
          openDialog={openDialog}
          showbtn={showbtn}
          buttons={['Update']}
          // onChange={handleChange}
          // setVal={[{ name: "pointName", value: tempFData?.pointname }, { name: "latitude", value: tempFData?.latitude },{name:"longitude", value: tempFData?.longitude} ]}
          popAction={handleSubmit}
        />
      )}
    </>
  );
};

export default EditDesignationForm;
