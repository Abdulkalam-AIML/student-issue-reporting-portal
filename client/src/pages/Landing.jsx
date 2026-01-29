import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Clock, Users, Phone, Mail, MapPin, CheckCircle } from 'lucide-react';
import BackgroundGrid from '../components/BackgroundGrid';

const Landing = () => {


    return (
        <div className="min-h-screen font-sans text-slate-700 overflow-x-hidden selection:bg-[#dcd0ff] selection:text-[#6b46c1]">
            <BackgroundGrid />

            {/* 1. Sticky Header */}
            <header className="fixed top-0 left-0 right-0 py-4 px-6 md:px-12 bg-white/80 backdrop-blur-md border-b border-[#e2e8f0] z-50 flex items-center justify-between transition-all">
                <div className="flex items-center gap-3">

                    <motion.div
                        initial={{ rotate: -180, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="w-12 h-12 flex items-center justify-center"
                    >
                        <img
                            src="/srm_logo.png"
                            alt="SRM Logo"
                            className="w-full h-full object-contain filter drop-shadow-md"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentNode.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6b46c1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>';
                            }}
                        />
                    </motion.div>
                    <div className="flex flex-col">
                        <span className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight leading-none">
                            Student Issue Portal
                        </span>
                    </div>
                </div>

                <Link to="/login">
                    <button className="px-6 py-2.5 bg-[#dcd0ff] hover:bg-[#c4b5fd] text-[#6b46c1] font-bold rounded-xl shadow-sm transition-all hover:scale-105 active:scale-95 text-sm md:text-base border border-[#b0e0e6]/50">
                        Login / Sign In
                    </button>
                </Link>
            </header>

            {/* Spacer for sticky header */}
            <div className="h-24"></div>

            {/* 2. Hero Section */}
            {/* 2. Hero Section */}
            <section className="pt-20 pb-16 px-6 md:px-20 text-center relative z-10 overflow-hidden">
                {/* Background Campus Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1600"
                        alt="College Campus Buildings"
                        className="w-full h-full object-cover opacity-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/50 to-[#f0f8ff]" />
                </div>

                <div className="relative z-10 max-w-5xl mx-auto">
                    {/* Floating Animated Background Blobs */}
                    <motion.div
                        animate={{ y: [0, -20, 0], opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-10 left-10 w-32 h-32 bg-purple-300/30 rounded-full blur-3xl -z-10"
                    />
                    <motion.div
                        animate={{ y: [0, 20, 0], x: [0, 10, 0], opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-10 right-10 w-40 h-40 bg-blue-300/30 rounded-full blur-3xl -z-10"
                    />

                    <motion.h1
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.1
                                }
                            }
                        }}
                        className="text-5xl md:text-8xl font-bold mb-6 text-slate-800 tracking-tight leading-tight"
                    >
                        {Array.from("Student Issue Portal").map((char, index) => (
                            <motion.span
                                key={index}
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 12, stiffness: 100 } }
                                }}
                            >
                                {char === " " ? "\u00A0" : char}
                            </motion.span>
                        ))}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="text-xl md:text-2xl text-slate-500 font-light max-w-2xl mx-auto"
                    >
                        Report issues. Track action. Ensure accountability.
                    </motion.p>
                </div>

            </section>



            {/* 3. Cinematic Visual Showcase (Bento Grid) */}
            <section className="py-20 px-6 md:px-20 max-w-7xl mx-auto relative z-10">
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.2
                            }
                        }
                    }}
                >
                    {/* Card 1: Main Campus Pulse (Large) */}
                    <motion.div
                        className="md:col-span-2 md:row-span-2 relative group rounded-3xl overflow-hidden shadow-2xl border border-white/40"
                        variants={{
                            hidden: { y: 50, opacity: 0 },
                            visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
                        }}
                    >
                        <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/10 transition-colors duration-500 z-10" />
                        <img
                            src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1600"
                            alt="SRM Campus Infrastructure"
                            className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-[1.5s] ease-in-out"
                        />
                        <div className="absolute bottom-0 left-0 p-8 z-20 bg-gradient-to-t from-slate-900/80 to-transparent w-full">
                            <h3 className="text-white text-3xl font-bold mb-2 font-serif tracking-wide">World-Class Infrastructure</h3>
                            <p className="text-slate-200 text-lg font-light">Maintaining excellence in every corner of the campus.</p>
                        </div>
                    </motion.div>

                    {/* Card 2: Faculty Support (top right) */}
                    <motion.div
                        className="relative group rounded-3xl overflow-hidden shadow-xl border border-white/40"
                        variants={{
                            hidden: { x: 50, opacity: 0 },
                            visible: { x: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
                        }}
                    >
                        <div className="absolute inset-0 bg-indigo-900/20 group-hover:bg-indigo-900/10 transition-colors duration-500 z-10" />
                        <img
                            src="https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80&w=800"
                            alt="Faculty Mentorship"
                            className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-[1.5s]"
                        />
                        <div className="absolute bottom-0 left-0 p-6 z-20 bg-gradient-to-t from-slate-900/90 to-transparent w-full">
                            <h4 className="text-white text-xl font-bold font-serif">Faculty Guidance</h4>
                        </div>
                    </motion.div>

                    {/* Card 3: Active Resolution (middle right) */}
                    <motion.div
                        className="relative group rounded-3xl overflow-hidden shadow-xl border border-white/40"
                        variants={{
                            hidden: { x: 50, opacity: 0 },
                            visible: { x: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
                        }}
                    >
                        <div className="absolute inset-0 bg-blue-900/20 group-hover:bg-blue-900/10 transition-colors duration-500 z-10" />
                        <img
                            src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800"
                            alt="Maintenance in Action"
                            className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-[1.5s]"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800";
                            }}
                        />
                        <div className="absolute bottom-0 left-0 p-6 z-20 bg-gradient-to-t from-slate-900/90 to-transparent w-full">
                            <h4 className="text-white text-xl font-bold font-serif">Instant Resolution</h4>
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* 4. About Section */}
            <section className="py-24 px-6 md:px-20 max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">About the Student <br />Issue Requesting Portal</h2>
                        <p className="text-lg text-slate-600 leading-relaxed mb-8">
                            This portal enables students to report campus-related issues in real time and transparently track their resolution. Each request is logged with timestamps, assigned to responsible authorities, and monitored until closure, ensuring accountability and timely action.
                        </p>

                        <ul className="space-y-4">
                            {[
                                "Real-time issue tracking",
                                "Clear responsibility & escalation",
                                "Transparent resolution timeline"
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-white border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow">
                                    <div className="w-8 h-8 rounded-full bg-[#e6e6fa] flex items-center justify-center text-[#6b46c1]">
                                        <CheckCircle size={18} />
                                    </div>
                                    <span className="font-semibold text-slate-700">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>


                </div>
            </section>

            {/* 5. Footer */}
            <footer className="py-16 px-6 md:px-20 bg-[#f0f8ff] border-t border-[#b0e0e6]/50">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 bg-[#87ceeb] rounded-lg flex items-center justify-center text-white">
                                <Shield className="w-5 h-5" />
                            </div>
                            <span className="text-xl font-bold text-slate-800">SRM Institute</span>
                        </div>
                        <p className="text-slate-500 max-w-sm mb-6">
                            Empowering students and faculty to build a better campus environment together.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold text-slate-800 mb-6">For further assistance, contact us:</h4>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <MapPin className="text-[#6b46c1] mt-1" size={20} />
                                <span className="text-slate-600">SRM Nagar, Kattankulathur,<br />Chengalpattu Dist, Tamil Nadu - 603203</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <Mail className="text-[#6b46c1]" size={20} />
                                <a href="mailto:helpdesk@srm.edu.in" className="text-slate-600 hover:text-[#6b46c1] transition-colors">helpdesk@srm.edu.in</a>
                            </div>
                            <div className="flex items-center gap-4">
                                <Phone className="text-[#6b46c1]" size={20} />
                                <span className="text-slate-600">+91 44 27417000</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-[#e2e8f0] text-center text-slate-400 text-sm">
                    &copy; 2026 SRM Institute. All rights reserved.
                </div>
            </footer>
        </div >
    );
};

export default Landing;
