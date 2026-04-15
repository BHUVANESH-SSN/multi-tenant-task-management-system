import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getInitials = (name) => {
        return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
    };

    return (
        <div className="app-layout">
            <aside className="sidebar">
                <div className="sidebar-brand">
                    <span className="logo-icon">✦</span>
                    TaskFlow
                </div>

                <nav className="sidebar-nav">
                    <span className="nav-section-title">Main</span>
                    <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <span className="nav-icon">◉</span>
                        Dashboard
                    </NavLink>
                    <NavLink to="/tasks" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <span className="nav-icon">☐</span>
                        Tasks
                    </NavLink>

                    {user?.role === 'ADMIN' && (
                        <>
                            <span className="nav-section-title">Admin</span>
                            <NavLink to="/audit-logs" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                                <span className="nav-icon">⟳</span>
                                Audit Logs
                            </NavLink>
                            <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                                <span className="nav-icon">⚙</span>
                                Admin Panel
                            </NavLink>
                        </>
                    )}
                </nav>

                <div className="sidebar-footer">
                    <div className="sidebar-user">
                        <div className="user-avatar">{getInitials(user?.name)}</div>
                        <div className="user-info">
                            <div className="user-name">{user?.name}</div>
                            <div className="user-role">{user?.role} · {user?.organization?.name}</div>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="btn btn-ghost btn-full" style={{ marginTop: '0.5rem' }}>
                        ↪ Sign Out
                    </button>
                </div>
            </aside>

            <main className="main-content">
                {children}
            </main>
        </div>
    );
}
