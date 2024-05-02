import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import _ from 'lodash';
import api from '@api';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {Grid} from '@mui/material';
import CustomLabel from 'pages/common/CustomLabel';
import SOSSetting from './create';

const List = () => {
  const {user} = useAuthUser();
  const [settingList, setSettingList] = useState();
  function getSetting() {
    axios
      .get(api.sos.sosSettingList)
      .then((res) => {
        setSettingList(res?.data?.data ?? []);
      })
      .catch((err) => {
        setSettingList([]);
      });
  }
  useEffect(() => {
    getSetting();
  }, []);

  return (
    <>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={8}>
          <CustomLabel labelVal='SOS Setting' variantVal='h3-underline' />
        </Grid>
      </Grid>
      <SOSSetting getAllSettings={getSetting} settingList={settingList} />
    </>
  );
};

export default List;
