import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';

export default function AuditLogs() {
    const [logs, setLogs] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchLogs(); }, []);

    const fetchLogs = async (page = 1) => {
        try {
            setLoading(true);
            const { data } = await api.get(`/audit-logs?page=${page}&limit=25`);
            setLogs(data.logs);
            setPagination(data.pagination);
        } catch (err) {
            console.error('Failed to fetch audit logs:', err);
        } finally {
            setLoading(false);
        }
    };

    const getActionBadge = (action) => {
        const map = {
            CREATED: { className: 'badge badge-done', label: 'Created' },
            UPDATED: { className: 'badge badge-in-progress', label: 'Updated' },
            DELETED: { className: 'badge badge-todo', label: 'Deleted' },
        };
        const a = map[action] || map.CREATED;
        return <span className={a.className}>{a.label}</span>;
    };

    const formatChanges = (changes) => {
        if (!changes || typeof changes !== 'object') return '—';
        const entries = Object.entries(changes);
        if (entries.length === 0) return '—';

        return entries.map(([key, val]) => {
            if (val && typeof val === 'object' && 'from' in val && 'to' in val) {
                return `${key}: ${val.from || '(empty)'} → ${val.to || '(empty)'}`;
            }
            return `${key}: ${JSON.stringify(val)}`;
        }).join(', ');
    };

    return (
        <Layout>
            <div className="page-header">
                <h1>Audit Logs</h1>
                <p className="page-description">Track all task-related actions in your organization</p>
            </div>

            <div className="page-body">
                {loading ? (
                    <div className="spinner-overlay"><div className="spinner"></div></div>
                ) : logs.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">⟳</div>
                        <h3>No audit logs yet</h3>
                        <p>Actions will appear here when tasks are created, updated, or deleted</p>
                    </div>
                ) : (
                    <>
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Action</th>
                                        <th>Task</th>
                                        <th>Performed By</th>
                                        <th>Changes</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map(log => (
                                        <tr key={log.id}>
                                            <td>{getActionBadge(log.action)}</td>
                                            <td style={{ fontWeight: 500 }}>{log.taskTitle || log.task?.title || '—'}</td>
                                            <td>
                                                <span style={{ color: 'var(--text-secondary)' }}>{log.user?.name || '—'}</span>
                                            </td>
                                            <td>
                                                <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', maxWidth: '300px', display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {formatChanges(log.changes)}
                                                </span>
                                            </td>
                                            <td style={{ color: 'var(--text-muted)', fontSize: 'var(--font-xs)', whiteSpace: 'nowrap' }}>
                                                {new Date(log.createdAt).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {pagination.totalPages > 1 && (
                            <div className="pagination">
                                <button className="pagination-btn" disabled={pagination.page <= 1} onClick={() => fetchLogs(pagination.page - 1)}>
                                    ← Prev
                                </button>
                                <span className="pagination-info">Page {pagination.page} of {pagination.totalPages}</span>
                                <button className="pagination-btn" disabled={pagination.page >= pagination.totalPages} onClick={() => fetchLogs(pagination.page + 1)}>
                                    Next →
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </Layout>
    );
}
