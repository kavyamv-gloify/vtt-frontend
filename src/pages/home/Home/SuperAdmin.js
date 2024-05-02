import React, {useEffect} from 'react';
import {toast} from 'react-toastify';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {useNavigate} from 'react-router-dom';
import UserPop from './userPop';
// import axios from 'axios';
// import ManagerOperation from './ManagerOperation/ManagerOperation'

const SuperAdmindashboard = () => {
  const navigate = useNavigate();
  const {user} = useAuthUser();

  useEffect(() => {
    if (user?.userList?.userStatus == 'DEFAULT') {
      navigate('/my-profile');
    }
  }, [user?.userList?.userStatus]);

  return (
    <>
      {/* <ManagerOperation/> */}
      <p>Hii</p>
    </>
  );
};

export default SuperAdmindashboard;
