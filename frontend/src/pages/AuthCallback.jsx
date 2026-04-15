import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function AuthCallback() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { setUser } = useAuth();

    useEffect(() => {
        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get('refreshToken');

        if (accessToken && refreshToken) {
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            api.get('/auth/me')
                .then(({ data }) => {
                    setUser(data.user);
                    navigate('/dashboard');
                })
                .catch(() => navigate('/login?error=oauth_failed'));
        } else {
            navigate('/login?error=oauth_failed');
        }
    }, []);

    return (
        <div className="spinner-overlay" style={{ minHeight: '100vh' }}>
            <div className="spinner"></div>
        </div>
    );
}
