import React, {useEffect, useState} from 'react';
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
// import Employeedashboard from './Home/ManagerDashboard';
// import Employeedashboard from './Home/EmployeesDashboard';
import EtravelMateAdmin from './Home/EtravelMateAdmin/index';
import SuperAdmindashboard from './Home/SuperAdmin';
import VendorDashboard from './Home/Vendordashboard/index';
import CorporateAdmindashboard from './Home/CorporateAdmin';
import ManagerDashBoard from './Home/ManagerDashboard/index';
// import ManagerDisplay from './Home/ManagerDashboard'
import geturl from '@common/fileUrl';
import Employeedashboard from './Home/Employeedashboard/index';
const Alldashboard = () => {
  const {user} = useAuthUser();
  const navigate = useNavigate();
  const [empRole, setEmpRole] = useState();
  useEffect(() => {
    let tem = localStorage.getItem('emplRole');
    setEmpRole(tem);
  }, []);

  return (
    <>
      {/* <>{empRole == "Employee"? <Employeedashboard/>:<ManagerDisplay/>}</> */}

      {/* {user.role == "CORPORATEADMIN" && (
        <Box
        >
          <CorporateAdmindashboard />
        </Box>
      )}  && (user.role !== "TANENTADMIN") */}
      {user.role !== 'DRIVER' &&
        user.role !== 'VENDOR' &&
        user.role !== 'MANAGER' &&
        user.role !== 'EMPLOYEE' &&
        user.role !== 'SUPERADMIN' && (
          <Box>
            <CorporateAdmindashboard />
          </Box>
        )}
      {user.role == 'DRIVER' && (
        <Box>
          <CorporateAdmindashboard />
        </Box>
      )}

      {user.role == 'VENDOR' && (
        <Box>
          <VendorDashboard />
        </Box>
      )}

      {user.role == 'MANAGER' && (
        <Box>
          <ManagerDashBoard />
        </Box>
      )}

      {user.role == 'EMPLOYEE' && (
        <Box>
          <Employeedashboard />
        </Box>
      )}

      {/* {user.role == 'SUPERADMIN' && (
        <Box>
          <EtravelMateAdmin />
        </Box>
      )} */}

      {((user?.userList?.tanentId && user?.userList?.tanentId != 'null') ||
        user?.userList?.corporateId) &&
      user?.role == 'SUPERADMIN' &&
      user?.userList?.isImpersonate != 'NO' ? (
        <Box>
          <CorporateAdmindashboard />
        </Box>
      ) : (
        <Box>{user?.role == 'SUPERADMIN' && <EtravelMateAdmin />}</Box>
      )}
    </>
  );
};

export default Alldashboard;
