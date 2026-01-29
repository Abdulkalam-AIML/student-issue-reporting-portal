import React from 'react';
import { motion } from 'framer-motion';

// Animation Type 1 – Floating Grid Panels
const BackgroundGrid = () => {
    return (
        <div className="absolute inset-0 overflow-hidden -z-10 bg-slate-50">
            {/* Soft Pastel Background Base */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#e6e6fa] via-[#f0f8ff] to-[#e6e6fa] opacity-60"></div>

            {/* Floating Panels */}
            {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute bg-white/40 backdrop-blur-sm border border-white/60 rounded-2xl shadow-sm"
                    initial={{
                        x: Math.random() * window.innerWidth,
                        y: Math.random() * window.innerHeight,
                        opacity: 0,
                        scale: 0.8
                    }}
                    animate={{
                        y: [0, -40, 0],
                        opacity: [0.3, 0.6, 0.3],
                        scale: [1, 1.05, 1]
                    }}
                    transition={{
                        duration: 8 + Math.random() * 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: Math.random() * 5
                    }}
                    style={{
                        width: 100 + Math.random() * 200,
                        height: 100 + Math.random() * 200,
                        rotate: Math.random() * 10 - 5
                    }}
                />
            ))}
        </div>
    );
};

export default BackgroundGrid;
