import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Shield, Key, Mail, Lock, ArrowRight } from 'lucide-react';
import BackgroundParallax from '../components/BackgroundParallax';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/api/auth/login', credentials);
            localStorage.setItem('userInfo', JSON.stringify(res.data)); // Fix: Store full user info for App.jsx check
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.user?.role || res.data.role); // Handle potential structure diff
            localStorage.setItem('userId', res.data.user?.id || res.data._id);
            toast.success('Login Successful');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        }
    };

    return (

        <div className="min-h-screen flex items-center justify-center relative font-sans text-slate-700 bg-[#f8fafc] p-6">
            <Toaster position="top-right" />

            {/* Animated Background Shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[20%] -left-[10%] w-[700px] h-[700px] rounded-full bg-purple-200/20 blur-3xl opacity-60"
                />
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-blue-200/20 blur-3xl opacity-60"
                />
            </div>

            {/* Centered Single Card (No Image) */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md bg-white shadow-2xl rounded-3xl overflow-hidden border border-slate-100 p-8 md:p-10"
            >
                <div>
                    <div className="mb-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#f3f0ff] rounded-2xl mb-4 text-[#6b46c1]">
                            <Shield size={32} />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800">Student Login</h1>
                        <p className="text-slate-500 text-sm mt-2">Enter credentials to access the portal.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#6b46c1] transition-colors" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="student@srm.edu.in"
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-[#6b46c1] transition-all text-sm font-medium text-slate-800"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#6b46c1] transition-colors" size={18} />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-[#6b46c1] transition-all text-sm font-medium text-slate-800"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex justify-end">
                                <a href="#" className="text-xs text-[#6b46c1] font-semibold hover:underline">Forgot Password?</a>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#6b46c1] hover:bg-[#5b3ba8] text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-200 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
                        >
                            <span>Sign In</span>
                            <ArrowRight size={20} />
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                        <p className="text-slate-500 text-sm">
                            Don't have an account?{' '}
                            <button
                                onClick={() => navigate('/register')}
                                className="text-[#6b46c1] font-bold hover:underline"
                            >
                                Register Now
                            </button>
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Footer */}
            <div className="fixed bottom-4 text-center z-0 w-full opacity-40 pointer-events-none">
                <p className="text-slate-400 text-xs">© 2026 SRM University AP.</p>
            </div>
        </div>
    );
};

export default Login;
