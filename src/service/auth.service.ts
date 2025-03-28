import { API_URL } from '../config';

const loginWithGoogle = () => window.open(`${API_URL}auth/google/`, '_self');

const AuthService = { loginWithGoogle };

export default AuthService;
