import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({ total: 0, todo: 0, inProgress: 0, done: 0 });
    const [recentTasks, setRecentTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const { data } = await api.get('/tasks?limit=5');
            const tasks = data.tasks || [];

            setStats({
                total: data.pagination?.total || tasks.length,
                todo: tasks.filter(t => t.status === 'TODO').length,
                inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
                done: tasks.filter(t => t.status === 'DONE').length,
            });

            // For more accurate counts, fetch all with each status
            const [todoRes, ipRes, doneRes] = await Promise.all([
                api.get('/tasks?status=TODO&limit=1'),
                api.get('/tasks?status=IN_PROGRESS&limit=1'),
                api.get('/tasks?status=DONE&limit=1'),
            ]);

            setStats({
                total: data.pagination?.total || 0,
                todo: todoRes.data.pagination?.total || 0,
                inProgress: ipRes.data.pagination?.total || 0,
                done: doneRes.data.pagination?.total || 0,
            });

            setRecentTasks(tasks);
        } catch (err) {
            console.error('Failed to fetch dashboard data:', err);
        } finally {
            setLoading(false);
        }
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

    if (loading) {
        return (
            <Layout>
                <div className="spinner-overlay"><div className="spinner"></div></div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="page-header">
                <h1>Dashboard</h1>
                <p className="page-description">
                    Welcome back, {user?.name}! Here's an overview of your organization's tasks.
                </p>
            </div>

            <div className="page-body">
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">📋</div>
                        <div className="stat-value">{stats.total}</div>
                        <div className="stat-label">Total Tasks</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🔴</div>
                        <div className="stat-value">{stats.todo}</div>
                        <div className="stat-label">To Do</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🟡</div>
                        <div className="stat-value">{stats.inProgress}</div>
                        <div className="stat-label">In Progress</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🟢</div>
                        <div className="stat-value">{stats.done}</div>
                        <div className="stat-label">Completed</div>
                    </div>
                </div>

                <h2 style={{ fontSize: 'var(--font-lg)', marginBottom: 'var(--space-lg)' }}>Recent Tasks</h2>

                {recentTasks.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">☐</div>
                        <h3>No tasks yet</h3>
                        <p>Create your first task to get started</p>
                    </div>
                ) : (
                    <div className="tasks-grid">
                        {recentTasks.map(task => (
                            <div key={task.id} className="task-card">
                                <div className="task-card-header">
                                    <span className="task-card-title">{task.title}</span>
                                    {getPriorityBadge(task.priority)}
                                </div>
                                {task.description && (
                                    <p className="task-card-description">{task.description}</p>
                                )}
                                <div className="task-card-meta">
                                    {getStatusBadge(task.status)}
                                    {task.assignee && (
                                        <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
                                            → {task.assignee.name}
                                        </span>
                                    )}
                                    <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                                        {new Date(task.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}
