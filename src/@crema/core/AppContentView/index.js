import React, { useEffect } from 'react';
import AppFooter from '../AppLayout/components/AppFooter';
import AppErrorBoundary from '../AppErrorBoundary';
import {useAuthUser} from '../../utility/AuthHooks';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import AppContentViewWrapper from './AppContentViewWrapper';
import AppSuspense from '../AppSuspense';
import {Navigate, Route, Routes, useRoutes} from 'react-router-dom';
import generateRoutes from '../../utility/RouteGenerator';
import {
  anonymousStructure,
  authorizedStructure,
  unAuthorizedStructure,
} from '../../../pages';
import {initialUrl} from 'shared/constants/AppConst';
import axios from 'axios';
import Api from '@api';
const AppContentView = ({sxStyle}) => {

useEffect(() => {
  axios.get(
      Api.baseUri + '/api/gps-devices/trip-started?tripId=testTrip',
    )
    .then((response) =>{
      console.log("resp", response)
      if(response?.status==200){
        console.log('api used to call every where')
      }
    })
    .catch((error) => console.log(error));
}, []);
  const {user, isAuthenticated} = useAuthUser();
  const routes = useRoutes(
    generateRoutes({
      isAuthenticated: isAuthenticated,
      userRole: user?.role,
      unAuthorizedStructure,
      authorizedStructure,
      anonymousStructure,
    }),
  );
  return (
    <AppContentViewWrapper>
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          p: {xs: 4, md: 5, xl: 4},
          pt: {xs: 1, md: 1, xl: 1},
          pb: {xs: 1, md: 2, xl: 1},
          // pr: {xs: 1, md: 4, xl: 7.5},

          ...sxStyle,
        }}
        className='app-content'
      >
        <AppSuspense>
          <AppErrorBoundary>
            {routes}
            <Routes>
              <Route path='/' element={<Navigate to={initialUrl} />} />
            </Routes>
          </AppErrorBoundary>
        </AppSuspense>
      </Box>
      <AppFooter />
    </AppContentViewWrapper>
  );
};

export default AppContentView;

AppContentView.propTypes = {
  sxStyle: PropTypes.object,
};
