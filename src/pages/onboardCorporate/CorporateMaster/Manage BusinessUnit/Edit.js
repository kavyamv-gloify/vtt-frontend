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
import PopEdit from '@editpopup';

const EditBusinessUnitForm = ({id, popBTNClick, openDialog}) => {
  const navigate = useNavigate();
  const [data, setData] = useState();
  const [showbtn, setshowbtn] = React.useState(true);

  useEffect(() => {
    async function getbusinesss() {
      axios
        .get(`${api.businessUnit.getbyId}/${id}`)
        .then((res) => {
          setData(res?.data?.data);
        })
        .catch((er) => {});
    }
    getbusinesss();
  }, [id]);

  let template = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    // title: 'Edit Page',
    description: 'Form for applying Job',
    // sections: [
    // {
    // layout: { column: 1, spacing: 2, size: 'small', label: 'fixed' },
    // id: 'personal_information',
    fields: [
      {
        type: 'text',
        name: 'name',
        id: 'name',
        title: 'Business Unit Name',
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

    if (values.button.toUpperCase() === 'UPDATE') {
      let dataSet = {};
      dataSet = values.data;
      axios
        .put(api.businessUnit.update, dataSet)
        .then((response) => {
          if (response?.data?.status == '200') {
            // navigate('/onboardCorporate/designation/designation-table')
            toast.success(
              `${response?.data?.data?.name} details updated successfully `,
            );
            popBTNClick(false);
          } else {
            toast.error(response?.data?.message ?? 'Something went wrong');
          }
          setshowbtn(true);
        })
        .catch((er) => {
          setshowbtn(true);
        });
    }
  };

  return (
    <>
      {data && data.id && (
        <PopEdit
          title={data?.name}
          poptemplate={template}
          defaultValues={data}
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

export default EditBusinessUnitForm;
