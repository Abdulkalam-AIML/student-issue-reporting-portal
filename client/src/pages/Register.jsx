import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { UserPlus, User, Mail, Lock, Briefcase, GraduationCap, Calendar, ChevronDown, Shield, ArrowRight, Bus, Home } from 'lucide-react';
import BackgroundParallax from '../components/BackgroundParallax';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [studentType, setStudentType] = useState('hosteller');
    const [department, setDepartment] = useState('CSE');
    const [year, setYear] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            // Ensure department is sent for everyone except admin (or as per backend logic)
            // Backend likely ignores extra fields, but let's be safe.
            const bodyData = {
                name,
                email,
                password,
                role,
                department: role === 'admin' ? undefined : department
            };

            if (role === 'student') {
                bodyData.studentType = studentType;
                bodyData.year = year;
            }

            const { data } = await api.post('/api/auth/register', bodyData, config);

            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success('Registration Successful');

            setTimeout(() => {
                if (data.role === 'admin') navigate('/admin-data');
                // Redirect standard users to Dashboard
                else navigate('/dashboard');
            }, 500);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration Failed');
            setIsLoading(false);
        }
    };

    return (

        <div className="min-h-screen flex items-center justify-center relative font-sans text-slate-700 bg-[#f8fafc] p-6 lg:p-10">
            <Toaster position="top-right" />

            {/* Animated Background Shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[10%] left-[10%] w-[500px] h-[500px] rounded-full bg-purple-200/20 blur-3xl opacity-60"
                />
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] rounded-full bg-indigo-200/20 blur-3xl opacity-60"
                />
            </div>

            {/* Centered Single Card (No Image) */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 w-full max-w-2xl bg-white shadow-2xl rounded-3xl overflow-hidden border border-slate-100 p-8 lg:p-12 my-auto"
            >
                <div className="flex flex-col justify-center bg-white overflow-y-auto">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Create Account</h1>
                            <p className="text-slate-500 text-sm mt-1">Join the official SRM Issue Portal</p>
                        </div>
                        <div className="w-12 h-12 bg-[#f3f0ff] rounded-xl flex items-center justify-center text-[#6b46c1]">
                            <UserPlus size={24} />
                        </div>
                    </div>

                    <form onSubmit={submitHandler} className="space-y-4">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Name */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#6b46c1] transition-colors" size={18} />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter full name"
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-[#6b46c1] transition-all text-sm font-medium text-slate-800"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#6b46c1] transition-colors" size={18} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="student@srm.edu.in"
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-[#6b46c1] transition-all text-sm font-medium text-slate-800"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#6b46c1] transition-colors" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Create password"
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-[#6b46c1] transition-all text-sm font-medium text-slate-800"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Role */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Identity</label>
                                <div className="relative group">
                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <div className="relative">
                                        <select
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                            className="w-full pl-11 pr-8 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-[#6b46c1] transition-all text-sm font-medium text-slate-800 appearance-none cursor-pointer"
                                        >
                                            <option value="student">Student</option>
                                            <option value="faculty">Faculty</option>
                                            <option value="hod">HOD</option>
                                            <option value="dean">Dean</option>
                                            <option value="principal">Principal</option>
                                            <option value="warden">Warden</option>
                                            <option value="transport_incharge">Transport Incharge</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                    </div>
                                </div>
                            </div>

                            {/* Department */}
                            {role !== 'admin' && role !== 'principal' && role !== 'warden' && role !== 'transport_incharge' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1">
                                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Department</label>
                                    <div className="relative group">
                                        <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <div className="relative">
                                            <select
                                                value={department}
                                                onChange={(e) => setDepartment(e.target.value)}
                                                className="w-full pl-11 pr-8 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-[#6b46c1] transition-all text-sm font-medium text-slate-800 appearance-none cursor-pointer"
                                            >
                                                <option value="">Select...</option>
                                                <option value="CSE">CSE</option>
                                                <option value="ECE">ECE</option>
                                                <option value="EEE">EEE</option>
                                                <option value="MECH">MECH</option>
                                                <option value="CIVIL">CIVIL</option>
                                                <option value="AIML">AIML</option>
                                                <option value="AIDS">AIDS</option>
                                                <option value="IoT">IoT</option>
                                                <option value="Cyber">Cyber Sec</option>
                                                <option value="BBA">BBA</option>
                                                <option value="MBA">MBA</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {role === 'student' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1">
                                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Residence</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                            {studentType === 'hosteller' ? <Home size={18} /> : (studentType === 'bus' ? <Bus size={18} /> : <User size={18} />)}
                                        </div>
                                        <div className="relative">
                                            <select
                                                value={studentType}
                                                onChange={(e) => setStudentType(e.target.value)}
                                                className="w-full pl-11 pr-8 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-[#6b46c1] transition-all text-sm font-medium text-slate-800 appearance-none cursor-pointer"
                                            >
                                                <option value="hosteller">Hosteller</option>
                                                <option value="bus">Day Scholar</option>
                                                <option value="own">Own Transp</option>
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1">
                                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Year</label>
                                    <div className="relative group">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <div className="relative">
                                            <select
                                                value={year}
                                                onChange={(e) => setYear(Number(e.target.value))}
                                                className="w-full pl-11 pr-8 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-[#6b46c1] transition-all text-sm font-medium text-slate-800 appearance-none cursor-pointer"
                                            >
                                                <option value={1}>1st Year</option>
                                                <option value={2}>2nd Year</option>
                                                <option value={3}>3rd Year</option>
                                                <option value={4}>4th Year</option>
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#6b46c1] hover:bg-[#5b3ba8] text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-200 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 mt-4 disabled:opacity-70"
                        >
                            <span>{isLoading ? 'Creating Account...' : 'Create Account'}</span>
                            {!isLoading && <ArrowRight size={20} />}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-slate-500 text-sm">
                            Already have an account?{' '}
                            <button
                                onClick={() => navigate('/login')}
                                className="text-[#6b46c1] font-bold hover:underline"
                            >
                                Sign In
                            </button>
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Footer */}
            <div className="fixed bottom-4 text-center z-0 w-full opacity-40 pointer-events-none">
                <p className="text-slate-400 text-xs">© 2026 SRM University AP. All Rights Reserved.</p>
            </div>
        </div>
    );
};

export default Register;
