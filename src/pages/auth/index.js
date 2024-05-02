import React from 'react';

const Signin = React.lazy(() => import('./Signin'));
// const SigninUser = React.lazy(() => import('./Signin/users'));
const Signup = React.lazy(() => import('./Signup'));
const Login=React.lazy(()=>import ('./LoginPage'));
const ForgotPassword = React.lazy(() => import('./ForgetPassword'));
const ConfirmSignupAwsCognito = React.lazy(() =>
  import('./ConfirmSignupAwsCognito'),
);
const ResetPasswordAwsCognito = React.lazy(() =>
  import('./ResetPasswordAwsCognito'),
);
export const authRouteConfig = [
  {
    path: '/home',
    element: <Signin />,
  },
  // {
  //   path: '/signin-user',
  //   element: <SigninUser />,
  // },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/forget-password',
    element: <ForgotPassword />,
  },
  {
    path: '/confirm-signup',
    element: <ConfirmSignupAwsCognito />,
  },
  {
    path: '/reset-password',
    element: <ResetPasswordAwsCognito />,
  },

  {
    path: '/login',
    element: <Login />,
  },
];
