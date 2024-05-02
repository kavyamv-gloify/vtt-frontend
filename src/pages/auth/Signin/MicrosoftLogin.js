import React, {useEffect, useState} from 'react';
import jwt_decode from 'jwt-decode';
import {useAuthMethod} from '@crema/utility/AuthHooks';
import MicrosoftLogin from 'react-microsoft-login';

export default function MicroSoftLogin() {
  const {signInUser} = useAuthMethod();
  const {isCalled, setIsCalled} = useState(true);

  /*const handleCredentialResponse = (response) => {
        const userObject = jwt_decode(response.idToken.rawIdToken)
         
        if(userObject?.email_verified){ 
            signInUser({
                type: 'sso',
                uid: 'google', 
                otp: response.credential
            });
        }
        //  
      }

  useEffect(() => {
    google?.accounts?.id?.initialize({
        client_id: "1021333375632-ec07ivfoqvbde1gh3msmq90pb493g7m6.apps.googleusercontent.com",
        callback: handleCredentialResponse
      });

      google?.accounts?.id?.prompt();
      
      google?.accounts?.id?.renderButton(
        document.getElementById("buttonDiv"),
        { theme: 'outline', size: 'large' }
      );
  }, [])*/
  const authHandler = (err, data) => {
    const userObject = jwt_decode(data.idToken.rawIdToken);
    if (userObject?.preferred_username && isCalled) {
      setIsCalled(false);
      signInUser({
        type: 'sso',
        uid: 'microsoft',
        otp: data.idToken.rawIdToken,
      });
    }
  };
  return (
    <MicrosoftLogin
      clientId='d2414cf9-2969-4061-9243-2dafa5585755'
      authCallback={authHandler}
    />
  );
}
