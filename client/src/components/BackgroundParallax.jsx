import React from 'react';
import { motion } from 'framer-motion';

// Animation Type 2 – Layered Parallax Planes
const BackgroundParallax = () => {
    return (
        <div className="absolute inset-0 overflow-hidden -z-10 bg-[#f8faff]">
            {/* Layer 1 (Back) */}
            <motion.div
                animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-gradient-to-tr from-[#e6e6fa]/30 to-[#b0e0e6]/20 blur-3xl opacity-60"
            />

            {/* Layer 2 (Middle) */}
            <motion.div
                animate={{ x: [0, -40, 0], y: [0, 20, 0] }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute top-[20%] right-[-10%] w-[80%] h-[80%] bg-[#dcd0ff]/30 blur-2xl rounded-full opacity-50"
            />

            {/* Layer 3 (Front - Very Subtle) */}
            <motion.div
                animate={{ rotate: [0, 5, 0] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] bg-[#87ceeb]/10 blur-3xl rounded-full"
            />
        </div>
    );
};

export default BackgroundParallax;
