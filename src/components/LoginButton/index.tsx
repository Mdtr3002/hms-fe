import { GoogleLogin } from '@react-oauth/google';
import { FC } from 'react';

import { API_URL } from '../../config';
import useBoundStore from '../../store';
import { axios } from '../../utils/custom-axios';

const LoginButton: FC = () => {
  const setToken = useBoundStore.use.setToken();
  const getUserProfile = useBoundStore.use.getUserProfile();
  const closeSignInModal = useBoundStore.use.closeSignInModal();

  return (
    <GoogleLogin
      onSuccess={async (credentialResponse) => {
        const response = await axios.post(`${API_URL}auth/login`, {
          idToken: credentialResponse.credential,
        });
        setToken(response.data.payload.token);
        getUserProfile();
        closeSignInModal();
      }}
      onError={() => {
        console.log('Login Failed');
      }}
      useOneTap
    />
  );
};

export default LoginButton;
