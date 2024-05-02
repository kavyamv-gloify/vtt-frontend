import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
// import SmartForm from '@smart-form';
import {useAuthUser} from '@crema/utility/AuthHooks';
import regex from '@regex';
import axios from 'axios';
import Api from '@api';
import SnackbarCustom from 'pages/thirdParty/SnackBar/SnackBarMsg';
import {Grid} from '@mui/material';
import CustomLabel from 'pages/common/CustomLabel';
import {SettingsPowerRounded} from '@mui/icons-material';
import AppLoader from '@crema/core/AppLoader';
import {toast} from 'react-toastify';
import SmartForm from '@smart-form';
import {useParams} from 'react-router-dom';

const index = () => {
  const [showbtn, setshowbtn] = useState(true);
  const [data, setData] = useState();
  const {id} = useParams();

  function handleSubmit(val) {
    setshowbtn(false);

    if (val?.button == 'submit') {
      let postData = val?.data;
      postData.corporateId = [id];
      postData.autoApproved = 'NO';
      axios
        .post(
          Api.baseUri +
            '/user-reg/fuelTracking-setting/create-fuelTracking-setting',
          postData,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success('Fuel Setting submitted successfully');
            setshowbtn(true);
          }
        })
        .catch((err) => {
          toast.error(err);
          setshowbtn(true);
        });
    }
    if (val?.button == 'update') {
      let postData = val?.data;
      postData.corporateId = [id];
      postData.autoApproved = 'NO';
      postData.id = data?.id;
      axios
        .put(
          Api.baseUri +
            '/user-reg/fuelTracking-setting/update-fuelTracking-setting',
          postData,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success('Fuel Setting updated successfully');
            setshowbtn(true);
          }
        })
        .catch((err) => {
          toast.error(err);
          setshowbtn(true);
        });
    }
  }

  useEffect(() => {
    if (!id) {
      return;
    }
    getData();
  }, [id]);
  function getData() {
    axios
      .get(
        Api.baseUri +
          `/user-reg/fuelTracking-setting/get-fuelTracking-setting-by-corporateId/${id}`,
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          console.log('res', res?.data?.data);
          setData(res?.data?.data);
        }
      })
      .catch((err) => {
        setData({});
      });
  }
  let template = {
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
            type: 'switchToggle',
            name: 'corporateApprovalRequired',
            id: 'corporateApprovalRequired',
            title: 'Can corporate admin approve/reject the fuel tracking?',
            infoMessage: ['Radio button is selectable', 'e.g.: yes'],
            options: [
              {title: 'Yes', value: 'YES'},
              {title: 'No', value: 'NO'},
            ],
            validationProps: {
              // required: 'This is a mandatory field'
            },
          },
          {
            type: 'switchToggle',
            name: 'vendorApprovalRequired',
            id: 'vendorApprovalRequired',
            title: 'Can vendor approve/reject the fuel tracking?',
            infoMessage: ['Radio button is selectable', 'e.g.: yes'],
            options: [
              {title: 'Yes', value: 'YES'},
              {title: 'No', value: 'NO'},
            ],
            validationProps: {
              // required: 'This is a mandatory field'
            },
          },
        ],
      },
    ],
  };
  return (
    <div>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={8}>
          <CustomLabel labelVal='Fuel Setting' variantVal='h3-underline' />
        </Grid>
      </Grid>
      {data?.id && (
        <SmartForm
          template={template}
          defaultValues={data?.id ? data : {}}
          onSubmit={handleSubmit}
          buttons={['update']}
        />
      )}
      {!data?.id && (
        <SmartForm
          template={template}
          // defaultValues={data?.id ? data : {}}
          onSubmit={handleSubmit}
          buttons={['submit']}
        />
      )}
    </div>
  );
};

export default index;
