import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function AdminPanel() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [addForm, setAddForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [toast, setToast] = useState(null);

    const [organization, setOrganization] = useState(null);
    const [editingOrg, setEditingOrg] = useState(false);
    const [orgNameForm, setOrgNameForm] = useState('');

    useEffect(() => {
        fetchUsers();
        fetchOrg();
    }, []);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchOrg = async () => {
        try {
            const { data } = await api.get('/organizations');
            setOrganization(data.organization);
            setOrgNameForm(data.organization.name);
        } catch (err) { }
    };

    const handleOrgRename = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.put('/organizations', { name: orgNameForm });
            setOrganization(data.organization);
            setEditingOrg(false);
            showToast('Organization renamed successfully');
        } catch (err) {
            showToast(err.response?.data?.error || 'Rename failed', 'error');
        }
    };

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/users');
            setUsers(data.users || []);
        } catch (err) {
            console.error('Failed to fetch users:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddMember = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/auth/members', addForm);
            showToast('Member added successfully');
            setShowAddModal(false);
            setAddForm({ name: '', email: '', password: '' });
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to add member');
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await api.put(`/users/${userId}/role`, { role: newRole });
            showToast(`Role updated to ${newRole}`);
            fetchUsers();
        } catch (err) {
            showToast(err.response?.data?.error || 'Failed to update role', 'error');
        }
    };

    const handleRemoveUser = async (userId, userName) => {
        if (!confirm(`Remove ${userName} from the organization? This cannot be undone.`)) return;
        try {
            await api.delete(`/users/${userId}`);
            showToast('User removed');
            fetchUsers();
        } catch (err) {
            showToast(err.response?.data?.error || 'Failed to remove user', 'error');
        }
    };

    return (
        <Layout>
            <div className="page-header">
                <div className="admin-stats-grid">
                    <div className="stat-card">
                        <div className="stat-label">Organization Name</div>
                        {editingOrg ? (
                            <form onSubmit={handleOrgRename} style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)' }}>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={orgNameForm}
                                    onChange={(e) => setOrgNameForm(e.target.value)}
                                    autoFocus
                                />
                                <button type="submit" className="btn btn-primary btn-sm">Save</button>
                                <button type="button" onClick={() => { setEditingOrg(false); setOrgNameForm(organization.name); }} className="btn btn-secondary btn-sm">Cancel</button>
                            </form>
                        ) : (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div className="stat-value" style={{ fontSize: '1.5rem' }}>{organization?.name || 'Loading...'}</div>
                                <button onClick={() => setEditingOrg(true)} className="btn btn-ghost btn-sm">✎ Edit Name</button>
                            </div>
                        )}
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Organization Slug</div>
                        <div className="stat-value" style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>{organization?.slug || '...'}</div>
                    </div>
                </div>

                <div className="page-header" style={{ marginTop: 'var(--space-xl)' }}>
                    <div className="page-header-actions">
                        <div>
                            <h2>User Management</h2>
                            <p className="page-description">Manage users and roles</p>
                        </div>
                        <button onClick={() => { setShowAddModal(true); setError(''); }} className="btn btn-primary">
                            + Add Member
                        </button>
                    </div>
                </div>
            </div>

            <div className="page-body">
                {loading ? (
                    <div className="spinner-overlay"><div className="spinner"></div></div>
                ) : (
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Tasks Created</th>
                                    <th>Joined</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id}>
                                        <td style={{ fontWeight: 500 }}>
                                            {u.name}
                                            {u.id === currentUser?.id && (
                                                <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>(you)</span>
                                            )}
                                        </td>
                                        <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                                        <td>
                                            <span className={`badge ${u.role === 'ADMIN' ? 'badge-admin' : 'badge-member'}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td>{u._count?.createdTasks ?? 0}</td>
                                        <td style={{ color: 'var(--text-muted)', fontSize: 'var(--font-xs)' }}>
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </td>
                                        <td>
                                            {u.id !== currentUser?.id && (
                                                <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                                                    <select
                                                        className="filter-select"
                                                        value={u.role}
                                                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                                        style={{ minWidth: '100px' }}
                                                    >
                                                        <option value="ADMIN">Admin</option>
                                                        <option value="MEMBER">Member</option>
                                                    </select>
                                                    <button
                                                        onClick={() => handleRemoveUser(u.id, u.name)}
                                                        className="btn btn-danger btn-sm"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add Member Modal */}
            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Add Member</h2>
                            <button onClick={() => setShowAddModal(false)} className="btn btn-ghost btn-sm">✕</button>
                        </div>
                        <form onSubmit={handleAddMember}>
                            <div className="modal-body">
                                {error && <div className="alert-bar alert-error">{error}</div>}
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Jane Smith"
                                        value={addForm.name}
                                        onChange={(e) => setAddForm(f => ({ ...f, name: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        className="form-input"
                                        placeholder="jane@company.com"
                                        value={addForm.email}
                                        onChange={(e) => setAddForm(f => ({ ...f, email: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        className="form-input"
                                        placeholder="Min. 6 characters"
                                        value={addForm.password}
                                        onChange={(e) => setAddForm(f => ({ ...f, password: e.target.value }))}
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">Cancel</button>
                                <button type="submit" className="btn btn-primary">Add Member</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}
        </Layout>
    );
}
