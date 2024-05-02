import React, {useEffect} from 'react';
import jwt_decode from 'jwt-decode';
import {useAuthMethod} from '@crema/utility/AuthHooks';

export default function GoogleLogin() {
  const {signInUser} = useAuthMethod();

  const handleCredentialResponse = (response) => {
    const userObject = jwt_decode(response.credential);
    if (userObject?.email_verified) {
      // signInUser({
      //     type: 'sso',
      //     uid: 'google',
      //     otp: response.credential
      // });
    }
  };

  useEffect(() => {
    google?.accounts?.id?.initialize({
      client_id:
        '1021333375632-ec07ivfoqvbde1gh3msmq90pb493g7m6.apps.googleusercontent.com',
      // '703258428488-54taamfkcl1ea2vrsihuu4t0edu03th8.apps.googleusercontent.com',
      callback: handleCredentialResponse,
    });

    // google?.accounts?.id?.prompt();

    google?.accounts?.id?.renderButton(document.getElementById('buttonDiv'), {
      theme: 'outline',
      size: 'large',
    });
  }, []);

  return <div id='buttonDiv'></div>;
}
