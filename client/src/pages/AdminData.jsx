import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, Database } from 'lucide-react';
import api from '../api/axios';

const AdminData = () => {
    const [data, setData] = useState({ users: [], issues: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo || userInfo.role !== 'admin') {
            navigate('/login');
            return;
        }
        setUser(userInfo);

        const fetchData = async () => {
            try {
                const response = await api.get('/api/auth/admin-data');
                // if (!response.ok) throw new Error('Failed to fetch data'); // axios throws on error
                // const result = await response.json();
                setData(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, [navigate]);

    if (!user) return null;

    if (loading) return (
        <div className="min-h-screen bg-primary flex items-center justify-center text-accent">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                <LayoutDashboard size={48} />
            </motion.div>
        </div>
    );

    if (error) return <div className="text-red-500 p-10 text-center">Error: {error}</div>;

    return (
        <div className="flex h-screen bg-[#f8faff] overflow-hidden">
            {/* Sidebar (Reused Design) */}
            <motion.aside
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="w-72 bg-white border-r border-[#e2e8f0] hidden md:flex flex-col p-6 m-4 rounded-2xl h-[calc(100vh-2rem)] shadow-sm"
            >
                <div className="mb-10 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#b0e0e6] to-[#87ceeb] rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-blue-200">
                        <span className="text-3xl font-bold text-white">{user.name.charAt(0)}</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wider">{user.role}</h2>
                    <p className="text-xs text-slate-500 font-medium bg-slate-100 rounded-full py-1 px-3 inline-block mt-2 border border-slate-200">System Administrator</p>
                </div>

                <nav className="flex-1 space-y-3">
                    <button onClick={() => navigate('/dashboard')} className="w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 font-medium text-slate-500 hover:bg-[#f0f8ff] hover:text-[#0077b6]">
                        <LayoutDashboard className="mr-3 h-5 w-5" />
                        Main Dashboard
                    </button>
                    <button className="w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 font-medium bg-[#e6e6fa] text-[#6b46c1] shadow-md shadow-purple-100 border border-[#dcd0ff]">
                        <Database className="mr-3 h-5 w-5" />
                        Database View
                    </button>
                </nav>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen scrollbar-hide bg-[#f8faff]">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-800 mb-1">Database View</h1>
                        <p className="text-slate-500 text-sm">Direct access to MongoDB collections</p>
                    </div>
                </header>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ staggerChildren: 0.1 }}
                    className="space-y-8"
                >
                    {/* Users Table */}
                    <section className="bg-white p-6 rounded-3xl border border-[#e2e8f0] shadow-sm">
                        <h2 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2">
                            <Users className="text-[#6b46c1]" /> System Users ({data.users.length})
                        </h2>
                        <div className="overflow-x-auto rounded-xl border border-[#e2e8f0]">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#f8faff] text-slate-500 uppercase text-xs font-bold tracking-wider">
                                        <th className="p-4 border-b border-[#e2e8f0]">Name</th>
                                        <th className="p-4 border-b border-[#e2e8f0]">Email</th>
                                        <th className="p-4 border-b border-[#e2e8f0]">Role</th>
                                        <th className="p-4 border-b border-[#e2e8f0]">Department</th>
                                        <th className="p-4 border-b border-[#e2e8f0]">Type</th>
                                        <th className="p-4 border-b border-[#e2e8f0]">Year</th>
                                        <th className="p-4 border-b border-[#e2e8f0]">Joined</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.users.map((u, i) => (
                                        <motion.tr
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                                            key={u._id} className="hover:bg-[#f8faff] transition-colors border-b border-[#f1f5f9] text-sm"
                                        >
                                            <td className="p-4 text-slate-700 font-medium">{u.name}</td>
                                            <td className="p-4 text-slate-500">{u.email}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${u.role === 'admin' ? 'bg-red-50 text-red-600 border border-red-100' :
                                                    u.role === 'student' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                                                    }`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="p-4 text-slate-500">{u.department || 'N/A'}</td>
                                            <td className="p-4 text-slate-500">{u.studentType || '-'}</td>
                                            <td className="p-4 text-slate-500">{u.year || '-'}</td>
                                            <td className="p-4 text-slate-400 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Issues Table */}
                    <section className="bg-white p-6 rounded-3xl border border-[#e2e8f0] shadow-sm">
                        <h2 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2">
                            <Database className="text-[#6b46c1]" /> Issue Records ({data.issues.length})
                        </h2>
                        <div className="overflow-x-auto rounded-xl border border-[#e2e8f0]">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#f8faff] text-slate-500 uppercase text-xs font-bold tracking-wider">
                                        <th className="p-4 border-b border-[#e2e8f0]">Title</th>
                                        <th className="p-4 border-b border-[#e2e8f0]">Category</th>
                                        <th className="p-4 border-b border-[#e2e8f0]">Status</th>
                                        <th className="p-4 border-b border-[#e2e8f0]">Severity</th>
                                        <th className="p-4 border-b border-[#e2e8f0]">Filed By</th>
                                        <th className="p-4 border-b border-[#e2e8f0]">Assigned</th>
                                        <th className="p-4 border-b border-[#e2e8f0]">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.issues.length === 0 ? (
                                        <tr><td colSpan="7" className="p-8 text-center text-slate-500 italic">No records found.</td></tr>
                                    ) : (
                                        data.issues.map((issue, i) => (
                                            <motion.tr
                                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                                                key={issue._id} className="hover:bg-[#f8faff] transition-colors border-b border-[#f1f5f9] text-sm"
                                            >
                                                <td className="p-4 text-slate-700 font-medium">{issue.title}</td>
                                                <td className="p-4 text-slate-500 capitalize">{issue.category}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${issue.status === 'resolved' ? 'bg-green-50 text-green-600 border border-green-100' :
                                                        issue.status === 'in-progress' ? 'bg-yellow-50 text-yellow-600 border border-yellow-100' : 'bg-red-50 text-red-600 border border-red-100'
                                                        }`}>
                                                        {issue.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-slate-500 capitalize">{issue.severity}</td>
                                                <td className="p-4 text-slate-500 text-xs">{issue.user}</td>
                                                <td className="p-4 text-slate-500 text-xs">{issue.assignedTo || 'Unassigned'}</td>
                                                <td className="p-4 text-slate-400 text-xs">{new Date(issue.createdAt).toLocaleDateString()}</td>
                                            </motion.tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </motion.div>
            </main>
        </div>
    );
};

export default AdminData;
