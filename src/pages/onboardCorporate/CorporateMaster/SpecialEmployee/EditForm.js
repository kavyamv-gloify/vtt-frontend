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

  useEffect(() => {
    async function fetchData() {
      const baseURL = `${api.specialEmployee.getbyId}/${id}`;
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
    title: 'Bank Type',
    description: 'Form for applying Job',
    // sections: [
    // {
    // layout: { column: 1, spacing: 2, size: 'small', label: 'fixed' },
    // id: 'personal_information',
    fields: [
      {
        type: 'text',
        name: 'categoryName',
        id: 'categoryName',
        title: 'Category Name',
        validationProps: {
          required: 'This is a mandatory field',
        },
        pattern: {
          value: regex.char50,
          message: 'Please enter valid category',
        },
      },

      // {
      //   type: 'text',
      //   name: 'size',
      //   id: 'size',
      //   isNumber: true,
      //   maxChar: 3,
      //   title: 'Strength',
      //   // pattern: {
      //   //     value: regex.numReg,
      //   //     message: 'Please enter  valid number of counts'
      //   // },
      //   validationProps: {
      //     required: 'This is a mandatory field',
      //   },
      // },

      {
        type: 'radio',
        name: 'guardisRequired',
        id: 'guardisRequired',
        title: 'Guard Is Required',
        options: [
          {title: 'Yes', value: 'Yes'},
          {title: 'No', value: 'No'},
        ],
        validationProps: {
          required: 'This is a mandatory field',
        },
      },
      {
        type: 'radio',
        name: 'exclusiveVehicle',
        id: 'exclusiveVehicle',
        title: 'Exclusive Vehicle',
        options: [
          {title: 'Yes', value: 'Yes'},
          {title: 'No', value: 'No'},
        ],
        validationProps: {
          required: 'This is a mandatory field',
        },
      },
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
        .put(api.specialEmployee.update, dataSet)
        .then((response) => {
          if (response?.data?.status == '200') {
            toast.success(
              `${response?.data?.data?.categoryName} details updated successfully`,
            );
            // toast.success(response?.data?.message ?? 'Created successfully');
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
      {data?.id && (
        <PopEdit
          title={data?.categoryName}
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

export default EditForm;
