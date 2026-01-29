import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, AlertCircle, CheckCircle, Clock, ArrowRight, User as UserIcon, Upload, X, Send, ShieldCheck, AlertTriangle } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const IssueCard = ({ issue, role, refreshIssues }) => {
    const [action, setAction] = useState(null); // 'forward' or 'resolve'
    const [forwardTo, setForwardTo] = useState('');
    const [candidates, setCandidates] = useState([]);
    const [note, setNote] = useState('');
    const [resolutionImage, setResolutionImage] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (action === 'forward' && candidates.length === 0) {
            fetchCandidates();
        }
    }, [action]);

    const fetchCandidates = async () => {
        try {
            const { data } = await api.get('/api/issues/forward-candidates?limit=100');
            setCandidates(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);
        try {
            const { data } = await api.post('/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setResolutionImage(data.image);
            setUploading(false);
        } catch (error) {
            toast.error('Image upload failed');
            setUploading(false);
        }
    };

    const submitAction = async () => {
        try {
            const body = {};

            if (action === 'forward') {
                if (!forwardTo) return toast.error('Select a user to forward to');
                body.forwardToUserId = forwardTo;
                body.note = note;
            } else if (action === 'resolve') {
                if (!resolutionImage || !note) return toast.error('Proof and Note are required');
                body.status = 'resolved';
                body.resolutionImage = resolutionImage;
                body.note = note;
            }

            await api.put(`/api/issues/${issue._id}/status`, body);
            toast.success('Action Successful');
            setAction(null);
            refreshIssues();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Action Failed');
        }
    };

    const handleClose = async () => {
        try {
            await api.put(`/api/issues/${issue._id}/status`, { status: 'closed' });
            toast.success('Issue Closed Successfully');
            refreshIssues();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to Close Issue');
        }
    };

    // Strict Pastel Theme Badge Colors
    const statusColors = {
        'pending-review': 'bg-[#e6e6fa] text-[#6b46c1] border-[#dcd0ff]', // Lavender Mist
        'open': 'bg-[#f0f8ff] text-[#0077b6] border-[#b0e0e6]', // Alice Blue / Ocean
        'in-progress': 'bg-[#fff0f5] text-[#d63384] border-[#ffc0cb]', // Lavender Blush / Pink
        'resolved': 'bg-[#f0fff4] text-[#2f855a] border-[#c6f6d5]', // Honeydew / Green
        'escalated': 'bg-[#fff5f5] text-[#c53030] border-[#fed7d7]', // Soft Red
    };

    const isAuthority = ['principal', 'admin', 'dean', 'hod', 'faculty', 'warden', 'transport_incharge'].includes(role);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={`bg-white p-6 rounded-2xl border transition-all duration-300 relative overflow-visible shadow-sm hover:shadow-lg ${issue.severity === 'emergency'
                ? 'border-red-200 shadow-red-100 ring-2 ring-red-50'
                : 'border-slate-100 hover:border-[#b0e0e6]'
                }`}
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 w-fit ${statusColors[issue.status] || 'bg-slate-50 text-slate-500'}`}>
                        {issue.status === 'escalated' && <AlertTriangle size={12} />}
                        {issue.status === 'resolved' && <CheckCircle size={12} />}
                        {issue.status.replace('-', ' ').toUpperCase()}
                    </span>
                    <h3 className="text-lg font-bold text-slate-800 mt-2">{issue.title}</h3>
                    <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                        <UserIcon className="w-4 h-4 text-[#87ceeb]" /> <span>{issue.createdBy?.name || 'Student'}</span> •
                        <span className="capitalize text-[#6b46c1] font-medium">{issue.category}</span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-sm text-slate-400 flex items-center justify-end gap-1 mb-1">
                        <Calendar className="w-3 h-3" /> {new Date(issue.createdAt).toLocaleDateString()}
                    </div>

                    {issue.reopenCount > 0 && (
                        <div className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-md border border-red-100 mb-1 flex items-center justify-end gap-1">
                            <AlertTriangle size={10} /> Reopened {issue.reopenCount}x
                        </div>
                    )}

                    {/* SLA Timer */}
                    <div className="flex justify-end">
                        <SLATimer deadline={issue.slaDeadline} status={issue.status} />
                    </div>

                    {issue.currentHandler && (
                        <div className="text-xs text-[#6b46c1] mt-2 px-2 py-1 bg-[#e6e6fa] rounded border border-[#dcd0ff] font-medium inline-block">
                            Handler: {issue.currentHandler.name}
                        </div>
                    )}
                </div>
            </div>

            <p className="text-slate-600 text-sm mb-6 line-clamp-2 leading-relaxed">{issue.description}</p>

            {/* Resolution Proof Display */}
            {issue.status === 'resolved' && issue.resolutionImage && (
                <div className="mt-4 p-4 bg-[#f0fff4]/60 rounded-xl border border-[#c6f6d5]">
                    <h4 className="text-[#2f855a] font-bold flex items-center gap-2 text-sm mb-2"><ShieldCheck className="w-4 h-4" /> Resolution Proof</h4>
                    <div className="relative group overflow-hidden rounded-lg border border-[#c6f6d5] shadow-sm">
                        <img src={`/uploads${issue.resolutionImage.replace('uploads/', '/')}`} alt="Proof" className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                            <span className="text-white text-xs font-bold">Verified Resolution</span>
                        </div>
                    </div>
                    <p className="text-[#276749] text-xs mt-3 italic bg-white/50 p-2 rounded-lg">"{issue.resolutionNote}"</p>

                    {/* Verification Actions: Student, Admin, or Principal can verify */}
                    {['student', 'admin', 'principal'].includes(role) && (
                        <div className="mt-4 flex gap-3">
                            <button
                                className="flex-1 bg-[#48bb78] text-white font-bold py-2 rounded-xl hover:bg-[#38a169] text-xs shadow-lg shadow-green-500/20 transition-all hover:scale-105"
                                onClick={handleClose}
                            >
                                Confirm & Close
                            </button>
                            <button
                                className="flex-1 bg-white text-red-500 border border-red-200 font-bold py-2 rounded-xl hover:bg-red-50 text-xs transition-colors"
                                onClick={() => {
                                    const reason = prompt("Reason for rejection:");
                                    if (reason) {
                                        toast.error("Issue Reopened (Simulation)");
                                    }
                                }}
                            >
                                Reject & Reopen
                            </button>
                        </div>
                    )}
                </div>
            )}

            {isAuthority && issue.status !== 'resolved' && (
                <div className="flex gap-3 mt-4 pt-4 border-t border-slate-50">
                    <button
                        onClick={() => setAction('forward')}
                        className="flex-1 py-2.5 rounded-xl bg-white border border-[#b0e0e6] text-slate-600 hover:bg-[#f0f8ff] hover:text-[#0077b6] hover:border-[#87ceeb] text-sm font-bold transition-all flex items-center justify-center gap-2"
                    >
                        <ArrowRight size={16} /> Forward
                    </button>
                    <button
                        onClick={() => setAction('resolve')}
                        className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#b0e0e6] to-[#87ceeb] text-slate-800 hover:shadow-lg hover:shadow-blue-200 text-sm font-bold transition-all flex items-center justify-center gap-2"
                    >
                        <CheckCircle size={16} /> Resolve
                    </button>
                </div>
            )}

            {/* Action Modals */}
            <AnimatePresence>
                {action && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-4 bg-[#f8faff] rounded-2xl p-5 border border-[#e2e8f0] overflow-hidden"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-slate-700 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                                {action === 'forward' ? <Send size={16} className="text-[#6b46c1]" /> : <ShieldCheck size={16} className="text-[#2f855a]" />}
                                {action === 'forward' ? 'Forward Issue' : 'Resolve Issue'}
                            </h4>
                            <button onClick={() => setAction(null)} className="p-1 hover:bg-white rounded-full transition-colors"><X className="w-4 h-4 text-slate-400 hover:text-red-500" /></button>
                        </div>

                        {action === 'forward' ? (
                            <div className="space-y-3">
                                <select
                                    className="w-full p-3 text-sm bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#87ceeb]/30 focus:border-[#87ceeb] outline-none transition-all"
                                    value={forwardTo}
                                    onChange={(e) => setForwardTo(e.target.value)}
                                >
                                    <option value="">Select Authority...</option>
                                    {candidates.map(c => (
                                        <option key={c._id} value={c._id}>{c.name} ({c.role} - {c.department || 'Admin'})</option>
                                    ))}
                                </select>
                                <textarea
                                    className="w-full p-3 text-sm bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl h-24 focus:ring-2 focus:ring-[#87ceeb]/30 focus:border-[#87ceeb] outline-none transition-all resize-none"
                                    placeholder="Add instruction note..."
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                />
                                <button onClick={submitAction} className="w-full py-2.5 bg-[#6b46c1] hover:bg-[#5a52d5] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#6b46c1]/20 transition-all flex items-center justify-center gap-2">
                                    Send to Authority <ArrowRight size={16} />
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="border-2 border-dashed border-[#b0e0e6] rounded-xl p-6 text-center cursor-pointer hover:border-[#87ceeb] hover:bg-[#f0f8ff] transition-all relative bg-white/60 group">
                                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleFileUpload} accept="image/*" />
                                    {uploading ? <div className="text-[#6b46c1] font-bold text-sm animate-pulse">Uploading...</div> :
                                        resolutionImage ? <div className="text-[#2f855a] text-sm font-bold flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4" /> Image Uploaded!</div> :
                                            <div className="text-slate-400 text-sm flex flex-col items-center gap-2 group-hover:text-[#6b46c1] transition-colors">
                                                <Upload className="w-6 h-6" />
                                                <span className="font-medium">Click to Upload Proof Photo</span>
                                            </div>}
                                </div>
                                <textarea
                                    className="w-full p-3 text-sm bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl h-24 focus:ring-2 focus:ring-[#87ceeb]/30 focus:border-[#87ceeb] outline-none transition-all resize-none"
                                    placeholder="Resolution details..."
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                />
                                <button onClick={submitAction} disabled={!resolutionImage || uploading} className="bg-gradient-to-r from-[#48bb78] to-[#38a169] text-white w-full py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:shadow-none hover:scale-[1.02] flex items-center justify-center gap-2">
                                    <CheckCircle size={16} /> Mark as Resolved
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// SLA Timer Component (Refined Colors)
const SLATimer = ({ deadline, status }) => {
    const [timeLeft, setTimeLeft] = useState('');
    const [isOverdue, setIsOverdue] = useState(false);

    useEffect(() => {
        if (!deadline || status === 'resolved') return;

        const updateTimer = () => {
            const now = new Date();
            const end = new Date(deadline);
            const diff = end - now;

            if (diff <= 0) {
                setIsOverdue(true);
                setTimeLeft('OVERDUE');
            } else {
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                setTimeLeft(`${hours}h ${minutes}m`);
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 60000);
        return () => clearInterval(interval);
    }, [deadline, status]);

    if (!deadline || status === 'resolved') return null;

    return (
        <div className={`text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 ${isOverdue ? 'bg-red-50 text-red-600 border border-red-200 animate-pulse' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
            <Clock className="w-3 h-3" />
            {timeLeft}
        </div>
    );
};

export default IssueCard;
