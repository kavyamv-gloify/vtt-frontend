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

  useEffect(() => {
    async function fetchData() {
      const baseURL = `${api.penalty.getbyId}/${id}`;
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
    // sections: [
    // {
    // layout: { column: 1, spacing: 2, size: 'small', label: 'fixed' },
    // id: 'personal_information',
    fields: [
      {
        type: 'text',
        name: 'reason',
        id: 'reason',
        title: 'Reason',
        infoMessage: [
          'Alpha Numeric Characters are allowed',
          'Maximum length should be 150',
          'e.g.: OTA-Penalty1',
        ],
        pattern: {
          value: regex.maxSize150,
          message: 'Please enter  valid amount',
        },
        validationProps: {
          required: 'This is a mandatory field',
        },
        //   options: [
        //     { title: 'OTAPenalty', value: 'OTAPenalty' },
        //     { title: 'OTDPenalty', value: 'OTDPenalty' },
        //     { title: 'Overspeed', value: 'Overspeed' },

        //   ]
      },
      {
        type: 'text',
        name: 'amount',
        id: 'amount',
        title: 'Amount',
        isNumber: true,
        maxChar: 7,
        pattern: {
          value: regex.num1000000,
          message: 'Please enter  valid amount',
        },
        validationProps: {
          required: 'This is a mandatory field',
        },
      },

      // {
      //     type: 'text',
      //     name: 'delete',
      //     id: 'delete',
      //     title: 'Delete',
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

      if (user?.role == 'VENDOR') {
        dataSet.vendorId = user?.userList?.profileId;
      }

      if (user?.role == 'CORPORATEADMIN') {
        dataSet.corporateId = user?.userList?.profileId;
      }
      axios
        .put(api.penalty.update, dataSet)
        .then((response) => {
          if (response?.data?.status == '200') {
            // navigate('/onboardCorporate/penalty/penalty-listing')
            toast.success(
              `${response?.data?.data?.reason} details updated successfully`,
            );
            // toast.success(response?.data?.message ?? 'Updated successfully');
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
      {/* {!showbtn ?
                <AppLoader />
                : null} */}
      {data && data.id && (
        <PopEdit
          title={data?.reason}
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

      {/* <SnackbarCustom BooleanValue={boolean} open={open} onChange={handleChange}>{snackbarMsg}</SnackbarCustom> */}
    </>
  );
};

export default EditForm;
