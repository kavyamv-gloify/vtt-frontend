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

const EditForm = ({id, popBTNClick, openDialog}) => {
  const navigate = useNavigate();
  const [showbtn, setshowbtn] = React.useState(true);
  const [open, setOpen] = useState();
  const [boolean, setBoolean] = useState(false);
  const [snackbarMsg, setsnackBarMsg] = useState();
  const [data, setData] = useState();
  // const [showbtn, setshowbtn] = useState(true);
  const {user} = useAuthUser();

  const CorpId =
    user?.role == 'CORPORATEADMIN'
      ? user?.userList?.profileId
      : user?.userList?.corporateId;

  useEffect(() => {
    async function fetchData() {
      const baseURL = api.baseUri + '/user-reg/Agency-Service/getbyid/' + id;
      let response = await axios.get(`${baseURL}`);

      setData(response?.data?.data);
    }
    fetchData();
  }, [id]);

  let template = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    title: 'Penalty',
    description: 'Form for applying Job',
    fields: [
      {
        type: 'text',
        name: 'agencyName',
        id: 'agencyName',
        title: 'Agency Name',
        infoMessage: [
          'Only alphabets are allowed.',
          'Maximum length should be 50 characters.',
          'Ex-XYZ.',
        ],
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
      dataSet = values.data;
      dataSet.tenantId = user?.userList?.tanentId;
      dataSet.corporateId = CorpId;
      axios
        .put(api.baseUri + '/user-reg/Agency-Service/update-agency', dataSet)
        .then((response) => {
          if (response?.data?.status == '200') {
            toast.success(
              `${response?.data?.data?.agencyName} details updated successfully`,
            );
            // toast.success(response?.data?.message ?? 'Updated successfully');
            popBTNClick(false);
            // window.location.reload();
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
          title={data?.agencyName}
          poptemplate={template}
          defaultValues={data}
          openDialog={openDialog}
          showbtn={showbtn}
          buttons={['Update']}
          popAction={handleSubmit}
        />
      )}
    </>
  );
};

export default EditForm;
