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

const CreateForm = ({close}) => {
  const navigate = useNavigate();
  const [showbtn, setshowbtn] = React.useState(true);
  const [open, setOpen] = useState();
  const [boolean, setBoolean] = useState(false);
  const [snackbarMsg, setsnackBarMsg] = useState();
  const {user} = useAuthUser();

  const CorpId =
    user?.role == 'CORPORATEADMIN'
      ? user?.userList?.profileId
      : user?.userList?.corporateId;
  let agencytemplate = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    // title: 'Bank Type',
    description: 'Form for applying Job',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
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
      },
    ],
  };

  function handleSubmit(values) {
    if (values?.button.toUpperCase() == 'SUBMIT') {
      let dataSet = {};
      dataSet = values.data;
      dataSet.tenantId = user?.userList?.tanentId;
      dataSet.corporateId = CorpId;

      axios
        .post(api.agency.addagency, dataSet)
        .then((response) => {
          if (response?.data?.status == '200') {
            toast.success(
              `${response?.data?.data?.agencyName} created successfully`,
            );
            close(false);
          } else {
            return;
          }
        })
        .catch((err) => {
          toast.error('Something went wrong');
        });
    }
  }
  return (
    <>
      {!showbtn ? <AppLoader /> : null}
      <SmartForm
        template={agencytemplate}
        onSubmit={handleSubmit}
        buttons={['submit']}
      />
    </>
  );
};

export default CreateForm;
