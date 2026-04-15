import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        organizationName: '',
        organizationSlug: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        // Auto-generate slug from org name
        if (name === 'organizationName') {
            const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            setForm((prev) => ({ ...prev, organizationSlug: slug }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(form);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.details?.[0]?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-brand">
                    <span className="logo-icon">✦</span>
                    TaskFlow
                </div>
                <h1>Create your account</h1>
                <p className="subtitle">Set up your organization and start managing tasks</p>

                {error && <div className="alert-bar alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            className="form-input"
                            placeholder="John Doe"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className="form-input"
                            placeholder="you@company.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            className="form-input"
                            placeholder="Min. 6 characters"
                            value={form.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="organizationName">Organization Name</label>
                        <input
                            id="organizationName"
                            name="organizationName"
                            type="text"
                            className="form-input"
                            placeholder="Acme Corp"
                            value={form.organizationName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="organizationSlug">Organization Slug</label>
                        <input
                            id="organizationSlug"
                            name="organizationSlug"
                            type="text"
                            className="form-input"
                            placeholder="acme-corp"
                            value={form.organizationSlug}
                            onChange={handleChange}
                            required
                            pattern="^[a-z0-9-]+$"
                            title="Lowercase letters, numbers, and hyphens only"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
