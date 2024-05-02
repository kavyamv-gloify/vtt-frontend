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
import {toast} from 'react-toastify';

const CreateForm = () => {
  const navigate = useNavigate();
  const [showbtn, setshowbtn] = React.useState(true);
  const [open, setOpen] = useState();
  const [boolean, setBoolean] = useState(false);
  const [snackbarMsg, setsnackBarMsg] = useState();
  const [data, setData] = useState();
  const {id} = useParams();
  const userBankDetail = async () => {
    const baseURL = `${api.masterBank.id}/${id}`;
    let response = await axios.get(`${baseURL}`);

    setData(response.data.data);
  };

  useEffect(() => {
    userBankDetail();
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
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'text',
            name: 'code',
            id: 'code',
            title: 'CODE',
            pattern: {
              value: regex.maxSize50,
              message:
                'Please enter valid code with alpha-numeric and below 50 characters',
            },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },

          {
            type: 'text',
            name: 'name',
            id: 'name',
            title: 'Bank Name',
            pattern: {
              value: regex.messageReg,
              message: 'Please enter Bank Name',
            },
            validationProps: {
              required: 'This is a mandatory field',
            },
          },

          {
            type: 'radio',
            name: 'status',
            id: 'status',
            title: 'Status',
            options: [
              {title: 'Active', value: 'Active'},
              {title: 'Inactive', value: 'Inactive'},
            ],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          // {
          //     type: 'date',
          //     name: 'createdon',
          //     id: 'createdon',
          //     title: "Date",
          //     disabled: false,
          //     max: 'today',
          //     //   pattern: {
          //     //       value: regex.yearReg,
          //     //       message: 'Please enter valid format YYYY'
          //     //   },
          //     validationProps: {
          //         required: 'This is a mandatory field'
          //     }
          // },
        ],
      },
    ],
  };

  const handleSubmit = async (values) => {
    setshowbtn(false);

    setshowbtn(false);
    if (values.button.toUpperCase() === 'UPDATE') {
      let dataSet = {};
      dataSet = values.data;
      axios
        .put(api.support.createform, dataSet)
        .then((response) => {
          if (response?.data?.status == '200') {
            navigate('/Master/bank/table');
            toast.success(response?.data?.message ?? 'Updated successfully');
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
      {!showbtn ? <AppLoader /> : null}
      {data && data.id && (
        <SmartForm
          defaultValues={data}
          template={template}
          onSubmit={handleSubmit}
          buttons={['update']}
        />
      )}
      {/* <SnackbarCustom BooleanValue={boolean} open={open} onChange={handleChange}>{snackbarMsg}</SnackbarCustom> */}
    </>
  );
};

export default CreateForm;
