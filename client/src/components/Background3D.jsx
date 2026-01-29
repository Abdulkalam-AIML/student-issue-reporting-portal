import React from 'react';
import { motion } from 'framer-motion';

const Background3D = () => {
    // Corporate/Calm Palette: Slate 900 background with accents
    // We create floating planes with very subtle transparency
    const planes = [
        // Large background plane - deep slate
        {
            width: '60vw',
            height: '60vh',
            bg: 'bg-indigo-300/20',
            top: '10%',
            left: '10%',
            delay: 0,
            duration: 15,
            zIndex: 0
        },
        // Accent plane - soft teal
        {
            width: '30vw',
            height: '30vw',
            bg: 'bg-purple-300/20',
            top: '20%',
            right: '-5%',
            delay: 2,
            duration: 12,
            zIndex: 1
        },
        // Floating detail - sky blue
        {
            width: '20vw',
            height: '20vw',
            bg: 'bg-blue-300/20',
            bottom: '10%',
            left: '20%',
            delay: 1,
            duration: 18,
            zIndex: 1
        },
        // Foreground hint
        {
            width: '15vw',
            height: '15vw',
            bg: 'bg-white/5',
            top: '40%',
            right: '20%',
            delay: 3,
            duration: 14,
            zIndex: 2
        }
    ];

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {/* Gradient Base - Light Pastel */}
            <div className="absolute inset-0 bg-slate-50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-white to-purple-50" />

            {/* Floating Planes */}
            {planes.map((plane, index) => (
                <motion.div
                    key={index}
                    className={`absolute rounded-[3rem] backdrop-blur-3xl border border-white/40 ${plane.bg}`}
                    style={{
                        width: plane.width,
                        height: plane.height,
                        top: plane.top,
                        left: plane.left,
                        right: plane.right,
                        bottom: plane.bottom,
                        zIndex: plane.zIndex,
                    }}
                    animate={{
                        y: [0, -40, 0],
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.05, 1],
                    }}
                    transition={{
                        duration: plane.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: plane.delay,
                    }}
                />
            ))}

            {/* Grid Overlay for "SaaS" feel */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
        </div>
    );
};

export default Background3D;
