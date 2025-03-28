import { GoogleOAuthProvider } from '@react-oauth/google';
import { Suspense, useEffect, useState } from 'react';
import { Route, Routes, useNavigate, useSearchParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { Loading } from './components';
import { AdministratorRoute } from './routes';
import { socket } from './socket';
import useBoundStore from './store';
import { SocketEvent } from './types';

import './config/firebase';
import 'react-toastify/dist/ReactToastify.css';
import 'react-datepicker/dist/react-datepicker.css';

const App = () => {
  const setToken = useBoundStore.use.setToken();
  const getUserProfile = useBoundStore.use.getUserProfile();

  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams({ token: '' });

  const { token: queryToken } = Object.fromEntries(searchParams);

  const navigate = useNavigate();

  useEffect(() => {
    if (
      queryToken &&
      queryToken !== '' &&
      window.location.pathname.split('/')[1] === 'login' &&
      window.location.pathname.split('/').length === 2
    ) {
      setToken(queryToken);
    } else {
      getUserProfile().then(() => {
        setTimeout(() => setLoading(false), 1000);
      });
    }
  }, [queryToken, setToken, getUserProfile]);

  useEffect(() => {
    if (queryToken && queryToken !== '') {
      navigate('/');
    }
  }, [queryToken, navigate]);

  useEffect(() => {
    const onConnect = () => {
      console.log('Connected to server socket');
    };

    const onDisconnect = () => {
      console.log('Disconnected from server socket');
    };

    socket.on(SocketEvent.CONNECT, onConnect);
    socket.on(SocketEvent.DISCONNECT, onDisconnect);

    return () => {
      socket.off(SocketEvent.CONNECT, onConnect);
      socket.off(SocketEvent.DISCONNECT, onDisconnect);
    };
  }, []);

  if (loading) return <Loading />;
  return (
    <>
      <Suspense fallback={null}>
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID as string}>
          <Routes>
            <Route path='*' element={<AdministratorRoute />} />
          </Routes>
        </GoogleOAuthProvider>
      </Suspense>
      <ToastContainer position='bottom-right' draggable={false} />
    </>
  );
};

export default App;
