import React, {useEffect} from 'react';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {Formik} from 'formik';
import * as yup from 'yup';
import PersonalInfoForm from './PersonalInfoForm';
import PropTypes from 'prop-types';
import {Box} from '@mui/material';
import Api from '@api';
import axios from 'axios';
import {toast} from 'react-toastify';
import {useNavigate} from 'react-router-dom';
import TenantAdminInfoDuplicate from './TenantAdminInfoDuplicate';
// import CorporateAdminInfoForm from '../CorporateAdminInfo/CorporateProfileForm';

const validationSchema = yup.object({
  email: yup.string().email('Invalid email format').required('Required'),
});
const PersonalInfo = () => {
  const {user} = useAuthUser();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: 'relative',
        maxWidth: 550,
      }}
    >
      {user.role == 'TANENTADMIN' ? (
        <Formik
          validateOnBlur={true}
          initialValues={{
            ...user,
            photoURL: user.photoURL
              ? user.photoURL
              : '/assets/images/placeholder.jpg',
          }}
          validationSchema={validationSchema}
          onSubmit={(data, {setSubmitting}) => {
            setSubmitting(true);

            if (user?.userList?.profileId) {
              axios
                .get(Api.auth.getbyId + user?.userList?.profileId)
                .then((res) => {
                  if (res?.data?.status == '200') {
                    // if(res?.data?.data?.profileStatus != "DEFAULT") {
                    let tempreq = res?.data?.data;
                    tempreq.mobileNo = data?.mobile;
                    tempreq.profileStatus = 'ACTIVE';
                    axios.put(Api.employee.list, tempreq).then((resp) => {
                      if (resp?.data?.status == '200') {
                        toast.success('Updated Successfully');
                        navigate('/dashboard');
                      }
                    });
                    // }
                  }
                })
                .catch((err) => {});
            }

            //TODO Api Call here to save user info
            setSubmitting(false);
          }}
        >
          {({values, setFieldValue}) => {
            return (
              <PersonalInfoForm values={values} setFieldValue={setFieldValue} />
              // <TenantAdminInfoDuplicate values={values} setFieldValue={setFieldValue}/>
            );
          }}
        </Formik>
      ) : null}
    </Box>
  );
};

export default PersonalInfo;

PersonalInfo.propTypes = {
  setFieldValue: PropTypes.func,
  values: PropTypes.string,
};
