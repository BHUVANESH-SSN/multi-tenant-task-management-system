import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

export default function Register() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        organizationName: '',
        organizationSlug: '',
    });
    const [showPassword, setShowPassword] = useState(false);
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
        <div className="auth-page bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-indigo-950 dark:to-gray-900 min-h-screen flex items-center justify-center relative p-4">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>
            <div className="auth-card w-full max-w-md backdrop-blur-md bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-xl dark:shadow-2xl border border-gray-200 dark:border-gray-800 p-8 transform transition-all hover:scale-[1.01]">
                <div className="auth-brand flex items-center gap-2 mb-6 justify-center">
                    <span className="logo-icon text-indigo-600 dark:text-indigo-400 text-2xl">✦</span>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">TaskFlow</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">Create your account</h1>
                <p className="subtitle text-gray-500 dark:text-gray-400 text-center mb-6">Set up your organization and start managing tasks</p>

                {error && <div className="alert-bar alert-error bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-group">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            className="form-input w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                            placeholder="John Doe"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className="form-input w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                            placeholder="you@company.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                className="form-input w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors pr-10"
                                placeholder="Min. 6 characters"
                                value={form.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                ) : (
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                    <div className="form-group flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Organization Name</label>
                            <input
                                id="organizationName"
                                name="organizationName"
                                type="text"
                                className="form-input w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                                placeholder="Acme Corp"
                                value={form.organizationName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="organizationSlug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Organization Slug</label>
                            <input
                                id="organizationSlug"
                                name="organizationSlug"
                                type="text"
                                className="form-input w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors opacity-75"
                                placeholder="acme-corp"
                                value={form.organizationSlug}
                                onChange={handleChange}
                                required
                                pattern="^[a-z0-9-]+$"
                                title="Lowercase letters, numbers, and hyphens only"
                            />
                        </div>
                    </div>
                    <button type="submit" className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-4" disabled={loading}>
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
                    Already have an account? <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
