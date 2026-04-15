import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Tasks() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ status: '', priority: '' });
    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [form, setForm] = useState({ title: '', description: '', status: 'TODO', priority: 'MEDIUM', dueDate: '', assignedTo: '' });
    const [orgUsers, setOrgUsers] = useState([]);
    const [error, setError] = useState('');
    const [toast, setToast] = useState(null);

    useEffect(() => { fetchTasks(); }, [filters]);
    useEffect(() => { fetchOrgUsers(); }, []);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchTasks = async (page = 1) => {
        try {
            setLoading(true);
            const params = new URLSearchParams({ page, limit: 20 });
            if (filters.status) params.append('status', filters.status);
            if (filters.priority) params.append('priority', filters.priority);
            const { data } = await api.get(`/tasks?${params}`);
            setTasks(data.tasks);
            setPagination(data.pagination);
        } catch (err) {
            console.error('Failed to fetch tasks:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrgUsers = async () => {
        try {
            const { data } = await api.get('/users/profile');
            // For members, just show themselves; for admins, fetch all users
            if (user?.role === 'ADMIN') {
                const res = await api.get('/users');
                setOrgUsers(res.data.users || []);
            }
        } catch (err) { }
    };

    const openCreateModal = () => {
        setEditingTask(null);
        setForm({ title: '', description: '', status: 'TODO', priority: 'MEDIUM', dueDate: '', assignedTo: '' });
        setError('');
        setShowModal(true);
    };

    const openEditModal = (task) => {
        setEditingTask(task);
        setForm({
            title: task.title,
            description: task.description || '',
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
            assignedTo: task.assignedTo || '',
        });
        setError('');
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const payload = { ...form };
            if (!payload.assignedTo) delete payload.assignedTo;
            if (!payload.dueDate) delete payload.dueDate;

            if (editingTask) {
                await api.put(`/tasks/${editingTask.id}`, payload);
                showToast('Task updated successfully');
            } else {
                await api.post('/tasks', payload);
                showToast('Task created successfully');
            }
            setShowModal(false);
            fetchTasks();
        } catch (err) {
            setError(err.response?.data?.error || 'Operation failed');
        }
    };

    const handleDelete = async (taskId) => {
        if (!confirm('Are you sure you want to delete this task?')) return;
        try {
            await api.delete(`/tasks/${taskId}`);
            showToast('Task deleted successfully');
            fetchTasks();
        } catch (err) {
            showToast(err.response?.data?.error || 'Delete failed', 'error');
        }
    };

    const canUpdateTask = (task) => {
        return user?.role === 'ADMIN' || task.createdBy === user?.id || task.assignedTo === user?.id;
    };

    const canDeleteTask = (task) => {
        return user?.role === 'ADMIN' || task.createdBy === user?.id;
    };

    const getStatusBadge = (status) => {
        const map = {
            TODO: { className: 'badge badge-todo', label: 'To Do' },
            IN_PROGRESS: { className: 'badge badge-in-progress', label: 'In Progress' },
            DONE: { className: 'badge badge-done', label: 'Done' },
        };
        const s = map[status] || map.TODO;
        return <span className={s.className}>{s.label}</span>;
    };

    const getPriorityBadge = (priority) => {
        const map = {
            LOW: { className: 'badge badge-low', label: 'Low' },
            MEDIUM: { className: 'badge badge-medium', label: 'Medium' },
            HIGH: { className: 'badge badge-high', label: 'High' },
        };
        const p = map[priority] || map.MEDIUM;
        return <span className={p.className}>{p.label}</span>;
    };

    return (
        <Layout>
            <div className="page-header">
                <div className="page-header-actions">
                    <div>
                        <h1>Tasks</h1>
                        <p className="page-description">Manage your organization's tasks</p>
                    </div>
                    <button onClick={openCreateModal} className="btn btn-primary">
                        + New Task
                    </button>
                </div>
            </div>

            <div className="page-body">
                {/* Filters */}
                <div className="filters-bar">
                    <select
                        className="filter-select"
                        value={filters.status}
                        onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
                    >
                        <option value="">All Status</option>
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="DONE">Done</option>
                    </select>
                    <select
                        className="filter-select"
                        value={filters.priority}
                        onChange={(e) => setFilters(f => ({ ...f, priority: e.target.value }))}
                    >
                        <option value="">All Priority</option>
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                    </select>
                </div>

                {/* Tasks List */}
                {loading ? (
                    <div className="spinner-overlay"><div className="spinner"></div></div>
                ) : tasks.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">☐</div>
                        <h3>No tasks found</h3>
                        <p>Create a new task or adjust your filters</p>
                        <button onClick={openCreateModal} className="btn btn-primary">+ New Task</button>
                    </div>
                ) : (
                    <>
                        <div className="tasks-grid">
                            {tasks.map(task => (
                                <div key={task.id} className="task-card">
                                    <div className="task-card-header">
                                        <span className="task-card-title">{task.title}</span>
                                        <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
                                            {getPriorityBadge(task.priority)}
                                            {(canUpdateTask(task) || canDeleteTask(task)) && (
                                                <div className="task-card-actions" style={{ opacity: 1 }}>
                                                    {canUpdateTask(task) && (
                                                        <button onClick={() => openEditModal(task)} className="btn btn-ghost btn-sm">✎</button>
                                                    )}
                                                    {canDeleteTask(task) && (
                                                        <button onClick={() => handleDelete(task.id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--error)' }}>✕</button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {task.description && (
                                        <p className="task-card-description">{task.description}</p>
                                    )}
                                    <div className="task-card-meta">
                                        {getStatusBadge(task.status)}
                                        <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
                                            by {task.creator?.name}
                                        </span>
                                        {task.assignee && (
                                            <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
                                                → {task.assignee.name}
                                            </span>
                                        )}
                                        {task.dueDate && (
                                            <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                                                Due: {new Date(task.dueDate).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    className="pagination-btn"
                                    disabled={pagination.page <= 1}
                                    onClick={() => fetchTasks(pagination.page - 1)}
                                >
                                    ← Prev
                                </button>
                                <span className="pagination-info">
                                    Page {pagination.page} of {pagination.totalPages}
                                </span>
                                <button
                                    className="pagination-btn"
                                    disabled={pagination.page >= pagination.totalPages}
                                    onClick={() => fetchTasks(pagination.page + 1)}
                                >
                                    Next →
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Task Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingTask ? 'Edit Task' : 'Create Task'}</h2>
                            <button onClick={() => setShowModal(false)} className="btn btn-ghost btn-sm">✕</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                {error && <div className="alert-bar alert-error">{error}</div>}
                                <div className="form-group">
                                    <label>Title</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Task title"
                                        value={form.title}
                                        onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                                        required
                                        disabled={editingTask && !canDeleteTask(editingTask)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        className="form-input"
                                        placeholder="Task description (optional)"
                                        value={form.description}
                                        onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                                        rows={3}
                                        disabled={editingTask && !canDeleteTask(editingTask)}
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
                                    <div className="form-group">
                                        <label>Status</label>
                                        <select className="form-input" value={form.status} onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))}>
                                            <option value="TODO">To Do</option>
                                            <option value="IN_PROGRESS">In Progress</option>
                                            <option value="DONE">Done</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Priority</label>
                                        <select className="form-input" value={form.priority} onChange={(e) => setForm(f => ({ ...f, priority: e.target.value }))} disabled={editingTask && !canDeleteTask(editingTask)}>
                                            <option value="LOW">Low</option>
                                            <option value="MEDIUM">Medium</option>
                                            <option value="HIGH">High</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Due Date</label>
                                    <input
                                        type="date"
                                        className="form-input"
                                        value={form.dueDate}
                                        onChange={(e) => setForm(f => ({ ...f, dueDate: e.target.value }))}
                                        disabled={editingTask && !canDeleteTask(editingTask)}
                                    />
                                </div>
                                {user?.role === 'ADMIN' && orgUsers.length > 0 && (
                                    <div className="form-group">
                                        <label>Assign To</label>
                                        <select className="form-input" value={form.assignedTo} onChange={(e) => setForm(f => ({ ...f, assignedTo: e.target.value }))}>
                                            <option value="">Unassigned</option>
                                            {orgUsers.map(u => (
                                                <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                                <button type="submit" className="btn btn-primary">
                                    {editingTask ? 'Update Task' : 'Create Task'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast && (
                <div className={`toast toast-${toast.type}`}>{toast.message}</div>
            )}
        </Layout>
    );
}
