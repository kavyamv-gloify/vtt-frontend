/* eslint-disable */
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Steppers from '@smart-form/stepper';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import api from '@api';
import regex from '@regex';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {toast} from 'react-toastify';
import AppLoader from '@crema/core/AppLoader';
import {te} from 'date-fns/locale';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import PopEdit from '@editpopup';

const EditForm = ({id, popBTNClick, openDialog}) => {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  // const { id } = useParams();
  const {user} = useAuthUser();
  const [address, setAddress] = useState();
  const [vendor, setVendor] = useState();
  const [mobileCheck, setMobileCheck] = useState();
  const [mobileNo, setMobileNo] = useState();
  const [vendorList, setVendorList] = useState();
  const vendorProfile = user?.userList?.profileId;

  const [showbtn, setshowbtn] = React.useState(true);

  useEffect(() => {
    async function fetchData() {
      const baseURL = `${api.driver.shift}/${id}`;
      let response = await axios.get(`${baseURL}`);

      setData(response.data.data);
    }
    fetchData();
  }, [id]);

  return (
    <>
      {!showbtn ? <AppLoader /> : null}

      {data && data.id && (
        <>
          <p>Test</p>
        </>
      )}
    </>
  );
};

export default EditForm;
