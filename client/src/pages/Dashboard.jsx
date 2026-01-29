import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LogOut, Plus, LayoutDashboard, FileText, CheckCircle,
    AlertCircle, Clock, Shield, Upload, X, Search, Filter, Bell,
    Wrench, Home, Bus, Calendar, Database, ChevronDown, ChevronUp
} from 'lucide-react';
import IssueCard from '../components/IssueCard';
import BackgroundParallax from '../components/BackgroundParallax';



const Dashboard = () => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [showForm, setShowForm] = useState(false);
    const [newIssue, setNewIssue] = useState({ title: '', description: '', severity: 'medium', category: 'infrastructure' });
    const [expandedIssueId, setExpandedIssueId] = useState(null);
    const [authorities, setAuthorities] = useState([]);
    const [myScore, setMyScore] = useState(null);
    const [userName, setUserName] = useState('User');

    const navigate = useNavigate();
    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            try {
                const parsed = JSON.parse(userInfo);
                // Handle both flat structure and nested .user structure
                setUserName(parsed.name || parsed.user?.name || 'User');
            } catch (e) {
                console.error("Error parsing user info", e);
            }
        }
        fetchIssues();
    }, []);

    const fetchIssues = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await api.get('/api/issues');
            setIssues(res.data);
            setLoading(false);
        } catch (err) {
            toast.error('Failed to load issues');
            setLoading(false);
        }
    };

    const fetchAuthorities = async () => {
        try {
            const res = await api.get('/api/auth/admin-data');
            // Filter only authorities
            const auths = res.data.users.filter(u => ['admin', 'principal', 'dean', 'hod', 'faculty', 'warden'].includes(u.role));
            setAuthorities(auths.sort((a, b) => b.accountabilityScore - a.accountabilityScore));

            // Set my score if I am an authority
            const me = res.data.users.find(u => u._id === userId);
            if (me) setMyScore(me.accountabilityScore);
        } catch (err) {
            console.error('Failed to load authorities');
        }
    };

    useEffect(() => {
        if (role !== 'student') {
            fetchAuthorities();
        }
    }, [role]);

    const handleCreateIssue = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            // Optimistic Update
            const tempIssue = { ...newIssue, status: 'Open', _id: Date.now(), createdBy: { _id: userId } };
            setIssues([tempIssue, ...issues]);
            setShowForm(false);

            await api.post('/api/issues', newIssue);
            toast.success('Issue Submitted Successfully');
            fetchIssues(); // Refresh for real ID
        } catch (err) {
            toast.error('Failed to submit issue');
            fetchIssues(); // Revert on fail
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            // Optimistic update
            const updatedIssues = issues.map(i => i._id === id ? { ...i, status: newStatus } : i);
            setIssues(updatedIssues);

            await api.put(`/api/issues/${id}/status`, { status: newStatus });
            toast.success(`Status updated to ${newStatus}`);
        } catch (err) {
            toast.error('Failed to update status');
            fetchIssues(); // Revert
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'open': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'in progress': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'resolved': return 'bg-green-100 text-green-700 border-green-200';
            case 'escalated': return 'bg-red-100 text-red-700 border-red-200';
            case 'pending-review': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const latestUpdates = [
        { id: 1, title: "Classroom Furniture Repair", desc: "Desk replacement in A-Block", date: "2h ago", img: "/update_furniture.png", icon: Wrench },
        { id: 2, title: "Hostel Maintenance", desc: "Corridor cleaning & lighting", date: "5h ago", img: "/update_hostel.png", icon: Home },
        { id: 3, title: "Campus Transport", desc: "Bus #42 service & safety check", date: "1d ago", img: "/update_bus.png", icon: Bus },
    ];

    const toggleRow = (id) => {
        if (expandedIssueId === id) setExpandedIssueId(null);
        else setExpandedIssueId(id);
    };

    return (
        <div className="min-h-screen font-sans text-slate-700 bg-[#f8faff] relative overflow-hidden">
            <Toaster position="top-right" />
            <BackgroundParallax />

            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-20 md:w-64 bg-white/80 backdrop-blur-xl border-r border-[#e2e8f0] z-30 flex flex-col justify-between py-8 transition-all duration-300">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-[#e6e6fa] rounded-xl flex items-center justify-center text-[#6b46c1] shadow-sm mb-10">
                        <Shield size={28} />
                    </div>

                    <nav className="space-y-4 w-full px-4">
                        <button
                            onClick={() => setFilter('all')}
                            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-medium ${filter === 'all' ? 'bg-[#dcd0ff]/50 text-[#6b46c1]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
                        >
                            <LayoutDashboard size={20} />
                            <span className="hidden md:block">Dashboard</span>
                        </button>
                        {role === 'student' && (
                            <button
                                onClick={() => setFilter('my-reports')}
                                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-medium ${filter === 'my-reports' ? 'bg-[#dcd0ff]/50 text-[#6b46c1]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
                            >
                                <FileText size={20} />
                                <span className="hidden md:block">My Reports</span>
                            </button>
                        )}

                        {role === 'admin' && (
                            <button onClick={() => navigate('/admin-data')} className="w-full flex items-center gap-4 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-700 rounded-xl transition-all font-medium">
                                <Database size={20} />
                                <span className="hidden md:block">Database View</span>
                            </button>
                        )}
                    </nav>
                </div>

                <div className="px-4">
                    <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all font-medium">
                        <LogOut size={20} />
                        <span className="hidden md:block">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-20 md:ml-64 p-6 md:p-10 relative z-10">

                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">
                            Hello {userName}
                        </h1>
                        <p className="text-slate-500">Welcome back to the portal</p>
                    </div>

                    <div className="flex items-center gap-4">
                        {role === 'student' && (
                            <button
                                onClick={() => setShowForm(true)}
                                className="btn-primary shadow-lg shadow-[#b0e0e6]/50"
                            >
                                <Plus size={20} />
                                New Report
                            </button>
                        )}
                        <div className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 relative">
                            <Bell size={20} />
                            <span className="absolute top-0 right-0 w-3 h-3 bg-red-400 rounded-full border-2 border-white"></span>
                        </div>
                    </div>
                </header>

                {/* UNIFIED DASHBOARD - CARD VIEW FOR EVERYONE */}
                {/* Authorities need IssueCard logic for resolving/forwarding, which Table View lacked */}
                <div>
                    {/* Stats & Scoreboard Grid */}
                    {role !== 'student' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {/* My Score Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Shield size={64} className="text-[#4f46e5]" />
                                </div>
                                <h3 className="text-slate-500 font-medium text-sm mb-2">My Accountability Score</h3>
                                <div className="flex items-end gap-2">
                                    <span className={`text-4xl font-bold ${(myScore || 100) >= 90 ? 'text-green-500' :
                                        (myScore || 100) >= 70 ? 'text-blue-500' :
                                            (myScore || 100) >= 50 ? 'text-yellow-500' : 'text-red-500'
                                        }`}>
                                        {myScore !== null ? myScore : 100}
                                    </span>
                                    <span className="text-slate-400 text-sm mb-1">/ 100</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${(myScore || 100) >= 90 ? 'bg-green-500' :
                                            (myScore || 100) >= 70 ? 'bg-blue-500' :
                                                (myScore || 100) >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                            }`}
                                        style={{ width: `${myScore !== null ? myScore : 100}%` }}
                                    ></div>
                                </div>
                            </motion.div>

                            {/* Top Performers */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
                            >
                                <h3 className="text-slate-700 font-bold mb-4 flex items-center gap-2">
                                    <Shield className="text-amber-400" size={18} /> Top Performing Authorities
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {authorities.slice(0, 3).map((auth, i) => (
                                        <div key={auth._id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                                                {auth.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-700">{auth.name}</div>
                                                <div className="text-xs text-slate-500 flex items-center gap-1">
                                                    <span className="text-green-600 font-bold">{auth.accountabilityScore} pts</span>
                                                </div>
                                            </div>
                                            {i === 0 && <span className="ml-auto text-amber-400 text-xs">👑</span>}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    )}

                    <div className="flex gap-8 items-start">
                        {/* Issues Feed (Left/Main) */}
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-slate-800">
                                    {role === 'student' ? 'Your Timeline' :
                                        role === 'admin' ? 'All System Issues' :
                                            role === 'principal' ? 'Pending Review & Triage' :
                                                'Assigned Issues'}
                                </h2>

                                {/* Filter for Authorities to organize their view */}
                                {(role !== 'student') && (
                                    <div className="flex gap-2">
                                        {['All', 'Open', 'Pending-Review', 'Resolved'].map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => setFilter(s.toLowerCase())}
                                                className={`px-3 py-1 text-xs font-semibold rounded-md border transition-all ${filter === s.toLowerCase() ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {loading ? (
                                <div className="text-center py-20 text-slate-400">Loading issues...</div>
                            ) : (
                                <div className="space-y-6 relative">
                                    {/* Connector Line only for students/timeline look */}
                                    {role === 'student' && <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gradient-to-b from-indigo-100 to-transparent z-0"></div>}

                                    <AnimatePresence>
                                        {issues.length === 0 ? (
                                            <div className="text-center py-10 text-slate-500 italic bg-white rounded-2xl border border-slate-200">
                                                No issues found.
                                            </div>
                                        ) : (
                                            issues
                                                .filter(i => {
                                                    if (filter === 'all') return true;
                                                    if (filter === 'my-reports') return i.createdBy?._id === userId || i.createdBy === userId;
                                                    return i.status.toLowerCase() === filter;
                                                })
                                                .map((issue, index) => (
                                                    <motion.div
                                                        key={issue._id}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.95 }}
                                                        transition={{ delay: index * 0.1 }}
                                                        className="relative z-10"
                                                    >
                                                        <IssueCard issue={issue} refreshIssues={fetchIssues} role={role} statusColor={getStatusColor(issue.status)} />
                                                    </motion.div>
                                                ))
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>

                        {/* Right Sidebar: Updates & Stats (Hidden on mobile) */}
                        <div className="hidden lg:block w-80 space-y-6 sticky top-6">
                            {/* Latest Updates Module */}
                            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                                <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                                    <Bell size={18} className="text-indigo-500" /> Latest Campus Updates
                                </h3>
                                <div className="space-y-4">
                                    {latestUpdates.map(update => (
                                        <div key={update.id} className="flex gap-3 hover:bg-slate-50 p-2 rounded-lg transition-colors cursor-pointer">
                                            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                                                <update.icon size={18} />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-700 leading-tight">{update.title}</h4>
                                                <p className="text-xs text-slate-500 line-clamp-1">{update.desc}</p>
                                                <span className="text-[10px] text-slate-400">{update.date}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Accountability Tip */}
                            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-5 rounded-3xl shadow-lg shadow-indigo-200 text-white relative overflow-hidden">
                                <div className="relative z-10">
                                    <h3 className="font-bold text-lg mb-1">Stay Accountable!</h3>
                                    <p className="text-indigo-100 text-xs text-pretty">Resolving issues within the SLA wins you points. Delays reduce your authority score.</p>
                                </div>
                                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* New Issue Modal (Student Only) */}
            <AnimatePresence>
                {showForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-white/60"
                        >
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-[#f8faff]">
                                <h2 className="text-xl font-bold text-slate-800">Submit New Issue</h2>
                                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleCreateIssue} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Issue Title</label>
                                    <input
                                        type="text"
                                        required
                                        className="glass-input"
                                        placeholder="Brief summary of the issue"
                                        value={newIssue.title}
                                        onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 mb-1">Category</label>
                                        <select
                                            className="glass-input"
                                            value={newIssue.category}
                                            onChange={(e) => setNewIssue({ ...newIssue, category: e.target.value })}
                                        >
                                            <option value="infrastructure">Infrastructure</option>
                                            <option value="academic">Academic</option>
                                            <option value="hostel">Hostel</option>
                                            <option value="transport">Transport</option>
                                            <option value="cafeteria">Cafeteria</option>
                                            <option value="safety">Safety</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 mb-1">Severity</label>
                                        <select
                                            className="glass-input"
                                            value={newIssue.severity}
                                            onChange={(e) => setNewIssue({ ...newIssue, severity: e.target.value })}
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                            <option value="urgent">Urgent</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Description</label>
                                    <textarea
                                        required
                                        rows="4"
                                        className="glass-input resize-none"
                                        placeholder="Detailed explanation of the issue..."
                                        value={newIssue.description}
                                        onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
                                    ></textarea>
                                </div>

                                <div className="pt-4">
                                    <button type="submit" className="btn-primary w-full">
                                        Submit Report
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;
