import React, {createContext, useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {useDispatch} from 'react-redux';
import io from 'socket.io-client';
import {
  FETCH_ERROR,
  FETCH_START,
  FETCH_SUCCESS,
} from 'shared/constants/ActionTypes';
import jwtAxios, {setAuthToken} from './index';
import axios from 'axios';
import geturl from '@common/fileUrl';
import Api from '@api';
import {permissionCheck} from 'redux/actions';
const host = Api?.baseUri;
import {setCompanyName, setLeaveCount} from 'redux/actions';
import {toast} from 'react-toastify';
const socket = io(host, {path: '/api/socket.io/'});

const JWTAuthContext = createContext();
const JWTAuthActionsContext = createContext();

export const useJWTAuth = () => useContext(JWTAuthContext);

export const useJWTAuthActions = () => useContext(JWTAuthActionsContext);

const JWTAuthAuthProvider = ({children}) => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [firebaseData, setJWTAuthData] = useState({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const dispatch = useDispatch();
  async function setTokenData(data) {
    let tempo = data?.data;

    let checkSwitch = localStorage.getItem('switched');
    if (tempo?.userRoles?.length) {
      tempo.isManagerKey = 'YES';
    }
    if (tempo.userRoleName == 'CORPORATEADMIN') {
      try {
        let res11 = await axios.get(
          Api.baseUri + '/user-reg/corporate-reg/' + tempo?.profileId,
        );
        tempo.contactName =
          (res11?.data?.data?.contactPersonFirstName || '') +
          ' ' +
          (res11?.data?.data?.contactPersonLastName || '');
      } catch (er) {}
    }
    if (tempo?.userRoleName == 'EMPLOYEE' && checkSwitch) {
      let re = await axios.post(Api?.auth?.switchRole, {
        authToken: localStorage.getItem('token'),
        userRole: checkSwitch == 'MANAGER' ? 'ROSTERADMIN' : checkSwitch,
      });
      if (re?.data?.data?.token) tempo.token = re?.data?.data?.authToken;
      localStorage.setItem('token', re?.data?.data?.authToken);
      localStorage.setItem('userRole', re?.data?.data?.userRole);
      localStorage.removeItem('switched');
      if (re?.data?.data?.authToken) {
        setAuthToken(re?.data?.data?.authToken);
        // axios.defaults.headers.common['vtt_user_signature'] = `${re?.data?.data?.authToken}`;
      }
      if (re?.data?.data?.userRole) tempo.userRole = re?.data?.data?.userRole;
    }
    let dtheme = {};
    if (data?.data?.tanentId) {
      try {
        let res = await axios.get(
          Api.baseUri + '/user-reg/tenant-reg/' + data?.data?.tanentId,
        );
        dtheme.theme = res?.data?.data?.theme || {bgColor: '#10234e'};
      } catch (er) {}
    }
    axios
      .get(
        Api.baseUri +
          '/user-reg/user-permission/get-all-user-permission-by-corpId/' +
          data?.data?.corporateId +
          '/' +
          (data?.data?.userRole == 'MANAGER'
            ? 'ROSTERADMIN'
            : data?.data?.userRole == 'TANENTADMIN' ||
              data?.data?.userRole == 'SUPERADMIN'
            ? 'CORPORATEADMIN'
            : data?.data?.userRole),
      )
      .then((_re) => {
        dispatch(permissionCheck(_re?.data?.data?.permissions || []));
      })
      .catch((_err) => {});
    if (tempo?.userRole == 'ROSTERADMIN') {
      tempo.userRole = 'MANAGER';
    }
    let tenId =
      tempo.userRole == 'TENANTADMIN' ? tempo?.profileId : tempo.tanentId;

    axios
      .get(
        Api.baseUri +
          '/user-reg/siteoffice-reg/corporate?page=0&size=100&officeName=null',
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          dispatch(
            setCompanyName(
              res?.data?.data?.body?.['SiteOffice List'][0]?.companyName +
                '++' +
                res?.data?.data?.body?.['SiteOffice List'][0]?.officeName,
            ),
          );
        }
      })
      .catch((err) => {});

    // axios.get(Api.baseUri + '/user-reg/adhoc-trip/get-adhoc-request-by-empid').then((res) => {
    //   if (res?.data?.status == "200") {
    //
    //     dispatch(setLeaveCount(res?.data?.data?.length))
    //   }
    // }).catch((err) => {
    //
    // })

    axios
      .get(Api.onBoardTenant?.list + '/' + tenId)
      .then((res) => {
        geturl.getRealUrl(res?.data?.data?.companyLogoDoc, 'COMPANY_LOGO');
      })
      .catch((err) => {});
    setJWTAuthData({
      user: {...tempo, ...dtheme},
      isLoading: false,
      isAuthenticated: true,
    });
  }
  useEffect(() => {
    const getAuthUser = async () => {
      const token = localStorage.getItem('token');
      const isSwitch = localStorage.getItem('switched');

      if (!token) {
        setJWTAuthData({
          user: undefined,
          isLoading: false,
          isAuthenticated: false,
        });
        return;
      }
      if (!isSwitch) setAuthToken(token);
      axios
        .post(Api.auth.verifyToken, {authToken: token})
        .then(({data}) => {
          // socket.on('welcome', function(data) { socket.emit('i am client', {data: 'foo!', id: data.id}); });
          // socket.emit('add-user', data?.data?.profileId);
          if (data.status == '200') {
            if (data.data.userRole != 'SUPERADMIN')
              data.data.isImpersonate = null;
            setTokenData(data);
            axios
              .get(Api?.token?.tokenapi)
              .then((result) => {
                localStorage.setItem('mappl_access_token', result?.data?.data);
              })
              .catch((err) => {});
            // setJWTAuthData({
            //           user: data.data,
            //           isLoading: false,
            //           isAuthenticated: true,
            //         });
          } else {
            setJWTAuthData({
              user: undefined,
              isLoading: false,
              isAuthenticated: false,
            });
            localStorage.clear();
            window.location.reload();
          }
        })
        .catch(() => {
          setJWTAuthData({
            user: undefined,
            isLoading: false,
            isAuthenticated: false,
          });
          localStorage.clear();
          window.location.reload();
        });
    };
    getAuthUser();
  }, []);

  const signInUser = async ({type, otp, uid, loginType}) => {
    dispatch({type: FETCH_START});
    let requestData = {},
      uri = '';
    if (type == 'sso') {
      requestData = {ssoToken: otp, ssoName: loginType, ssoEmail: uid};
      uri = Api.auth.ssoUserLoginMail;
    } else {
      requestData = {userId: uid, otp: otp};
      uri = Api.auth.verifyOTP;
      localStorage.setItem('userID', uid);

    }
    try {
      ///${uid}/${otp}628e0395d3011b6b9fb0d294
      const {data} = await axios.post(`${uri}`, requestData);
      if (data?.status == '200' && data?.data?.userRole != 'DRIVER') {
        if (data.data.userRole != 'SUPERADMIN') data.data.isImpersonate = null;
        localStorage.setItem('token', data?.data?.authToken);
        if (data?.data == 'ROSTERADMIN')
          localStorage.setItem('userRole', 'MANAGER');
        else localStorage.setItem('userRole', data?.data?.userRole);
        localStorage.removeItem('switched');

        socket.on('welcome', function (data) {
          socket.emit('i am client', {data: 'foo!', id: data.id});
        });
        socket.emit('add-user', data?.data?.profileId);
        axios
          .get(Api?.token?.tokenapi)
          .then((result) => {
            localStorage.setItem('mappl_access_token', result?.data?.data);
          })
          .catch((err) => {});
        axios
          .get(
            Api.baseUri +
              '/user-reg/user-permission/get-all-user-permission-by-corpId/' +
              data?.data?.corporateId +
              '/' +
              (data?.data?.userRole == 'MANAGER'
                ? 'ROSTERADMIN'
                : data?.data?.userRole),
          )
          .then((_re) => {
            dispatch(permissionCheck(_re?.data?.data?.permissions || []));
          })
          .catch((_err) => {});
        setAuthToken(data?.data?.authToken);
        axios.interceptors.request.use(function (config) {
          config.headers.vtt_user_signature = data?.data?.authToken;
          return config;
        });
        // // const res = await jwtAxios.get('/auth');
        let tempo = data?.data;
        let tenId =
          tempo.userRole == 'TENANTADMIN' ? tempo?.profileId : tempo.tanentId;
        axios
          .get(
            Api.baseUri +
              '/user-reg/siteoffice-reg/corporate?page=0&size=100&officeName=null',
          )
          .then((res) => {
            if (res?.data?.status == '200') {
              dispatch(
                setCompanyName(
                  res?.data?.data?.body?.['SiteOffice List'][0]?.companyName +
                    '++' +
                    res?.data?.data?.body?.['SiteOffice List'][0]?.officeName,
                ),
              );
            }
          })
          .catch((err) => {});
        axios
          .get(Api.onBoardTenant?.list + '/' + tenId)
          .then((res) => {
            geturl.getRealUrl(res?.data?.data?.companyLogoDoc, 'COMPANY_LOGO');
          })
          .catch((err) => {});
        if (tempo?.userRole == 'ROSTERADMIN') {
          tempo.userRole = 'MANAGER';
        }

        let dtheme = {};
        axios
          .get(Api.baseUri + '/user-reg/tenant-reg/' + data?.data?.tanentId)
          .then((re) => {
            dtheme.theme = re?.data?.data?.theme || {
              bgColor: '#10234e',
              btnColor: 'primary',
              hoverColor: 'black',
              fontColor: 'white',
            };
            setJWTAuthData({
              user: {...tempo, ...dtheme},
              isAuthenticated: true,
              isLoading: false,
            });
          })
          .catch((er) => {});
        setJWTAuthData({
          user: tempo,
          isAuthenticated: true,
          isLoading: false,
        });
        dispatch({type: FETCH_SUCCESS});
        if (data.data.userRole == 'CORPORATEADMIN') {
          window.location.reload();
        }
      } else {
        setJWTAuthData({
          ...firebaseData,
          isAuthenticated: false,
          isLoading: false,
        });
        dispatch({
          type: FETCH_ERROR,
          payload: data?.message || 'Something went wrong',
        });
        localStorage.clear();
      }
    } catch (error) {
      setJWTAuthData({
        ...firebaseData,
        isAuthenticated: false,
        isLoading: false,
      });
      dispatch({
        type: FETCH_ERROR,
        payload: error?.message || 'Something went wrong',
      });
    }
  };

  // const signUpUser = async ({ name, email, password }) => {
  //   dispatch({ type: FETCH_START });
  //   try {
  //     const { data } = await jwtAxios.post('users', { name, email, password });
  //     localStorage.setItem('token', data.token);
  //     setAuthToken(data.token);
  //     const res = await jwtAxios.get('/auth');
  //     setJWTAuthData({
  //       user: res.data,
  //       isAuthenticated: true,
  //       isLoading: false,
  //     });
  //     dispatch({ type: FETCH_SUCCESS });
  //   } catch (error) {
  //     setJWTAuthData({
  //       ...firebaseData,
  //       isAuthenticated: false,
  //       isLoading: false,
  //     });
  //
  //     dispatch({
  //       type: FETCH_ERROR,
  //       payload: error?.response?.data?.error || 'Something went wrong',
  //     });
  //   }
  // };

  const logout = async () => {
    toast.success('You logged out successfully');
    localStorage.clear();
    setAuthToken();
    setJWTAuthData({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
    window.location.reload();
  };

  return (
    <JWTAuthContext.Provider
      value={{
        ...firebaseData,
      }}
    >
      <JWTAuthActionsContext.Provider
        value={{
          // signUpUser,
          signInUser,
          logout,
        }}
      >
        {children}
      </JWTAuthActionsContext.Provider>
    </JWTAuthContext.Provider>
  );
};
export default JWTAuthAuthProvider;

JWTAuthAuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
