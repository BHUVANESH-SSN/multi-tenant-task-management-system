import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import AuditLogs from './pages/AuditLogs';
import AdminPanel from './pages/AdminPanel';

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />

                    {/* Protected routes */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute><Dashboard /></ProtectedRoute>
                    } />
                    <Route path="/tasks" element={
                        <ProtectedRoute><Tasks /></ProtectedRoute>
                    } />
                    <Route path="/audit-logs" element={
                        <ProtectedRoute requiredRole="ADMIN"><AuditLogs /></ProtectedRoute>
                    } />
                    <Route path="/admin" element={
                        <ProtectedRoute requiredRole="ADMIN"><AdminPanel /></ProtectedRoute>
                    } />

                    {/* Default redirect */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}
