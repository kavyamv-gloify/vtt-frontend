import React, {useEffect} from 'react';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {Formik} from 'formik';
import * as yup from 'yup';
// import PersonalInfoForm from './PersonalInfoForm';
import PropTypes from 'prop-types';
import {Box} from '@mui/material';
import Api from '@api';
import axios from 'axios';
import {toast} from 'react-toastify';
import {useNavigate} from 'react-router-dom';
import DriverProfileInfo from './DriverProfileForm';
import CorporateAdminInfo from './CorporateProfile';
import EmployeeProfileForm from './EmployeeProfile';
import TenantAdminInfo from './TenantProfile';
import VendorProfileInfo from './VendorProfileForm';
import CustomLabel from 'pages/common/CustomLabel';

const AllActiveProfile = () => {
  const {user} = useAuthUser();
  const navigate = useNavigate();

  return (
    <>
      <CustomLabel labelVal='Profile Update' variantVal='h3-underline' />
      {/* {user.role=="DRIVER" ? 
            <Box sx={{
                position: 'relative',
                maxWidth: 550,
            }}>
                <h1>Hii</h1>

            </Box>
            :user.role=="TANENTADMIN" ? 
            <Box sx={{
                position: 'relative',
                maxWidth: 550,
            }}>
            </Box>
            :user.role=="CORPORATEADMIN"?
            <Box sx={{
                position: 'relative',
                maxWidth: 550,
            }}>
                <h1>GM</h1>

            </Box>            
            : null}  */}
      {user.role == 'DRIVER' && (
        <Box>
          <DriverProfileInfo />
        </Box>
      )}
      {user.role == 'CORPORATEADMIN' && (
        <Box>
          <CorporateAdminInfo />
        </Box>
      )}

      {user.role == 'VENDOR' && (
        <Box>
          <VendorProfileInfo />
        </Box>
      )}
      {(user.role == 'EMPLOYEE' || user.role == 'MANAGER') && (
        <Box>
          <EmployeeProfileForm />
        </Box>
      )}

      {user.role == 'TANENTADMIN' && (
        <Box>
          <TenantAdminInfo />
        </Box>
      )}
    </>
  );
};

export default AllActiveProfile;
