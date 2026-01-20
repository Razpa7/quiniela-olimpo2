'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function IntroScreen({ onComplete }: { onComplete: () => void }) {
    const [isVisible, setIsVisible] = useState(true);
    const [audioInitialized, setAudioInitialized] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(false);
    const [countdown, setCountdown] = useState(6);
    const [showPermission, setShowPermission] = useState(false);

    const ambientMusicRef = useRef<HTMLAudioElement>(null);
    const thunderSoundRef = useRef<HTMLAudioElement>(null);
    const revelationSoundRef = useRef<HTMLAudioElement>(null);
    const enterSoundRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!audioInitialized) setShowPermission(true);
        }, 2000);
        return () => clearTimeout(timer);
    }, [audioInitialized]);

    useEffect(() => {
        const skipTimer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(skipTimer);
                    handleEnter();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        const thunderInterval = setInterval(() => {
            if (Math.random() > 0.7 && soundEnabled && thunderSoundRef.current) {
                thunderSoundRef.current.currentTime = 0;
                thunderSoundRef.current.play().catch(() => { });
            }
        }, 8000);

        return () => {
            clearInterval(skipTimer);
            clearInterval(thunderInterval);
        };
    }, [soundEnabled]);

    const activateAudio = () => {
        setAudioInitialized(true);
        setSoundEnabled(true);
        setShowPermission(false);
        if (ambientMusicRef.current) {
            ambientMusicRef.current.play().catch(console.error);
        }
    };

    const toggleSound = () => {
        if (!audioInitialized) {
            activateAudio();
            return;
        }
        const nextState = !soundEnabled;
        setSoundEnabled(nextState);
        if (ambientMusicRef.current) {
            if (nextState) ambientMusicRef.current.play();
            else ambientMusicRef.current.pause();
        }
    };

    const handleEnter = () => {
        if (enterSoundRef.current && soundEnabled) {
            enterSoundRef.current.play().catch(() => { });
        }
        if (ambientMusicRef.current) ambientMusicRef.current.pause();
        setIsVisible(false);
        setTimeout(onComplete, 1500);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black overflow-hidden select-none">
            {/* Background Video */}
            <div className="absolute inset-0 overflow-hidden">
                <video
                    autoPlay
                    muted
                    playsInline
                    loop
                    className="absolute min-w-full min-h-full object-cover opacity-20"
                >
                    <source src="https://assets.mixkit.co/videos/preview/mixkit-mystical-fire-in-the-dark-12157-large.mp4" type="video/mp4" />
                </video>
                <div className="lightning"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-purple-900/5 to-black"></div>
            </div>

            {/* Particles */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(50)].map((_, i) => (
                    <div
                        key={i}
                        className="particle"
                        style={{
                            left: `${Math.random() * 100}vw`,
                            animationDelay: `${Math.random() * 15}s`,
                            width: `${Math.random() * 3 + 2}px`,
                            height: `${Math.random() * 3 + 2}px`,
                            background: ['#fbbf24', '#60a5fa', '#facc15', '#a78bfa'][Math.floor(Math.random() * 4)]
                        }}
                    />
                ))}
            </div>

            {/* Audio Permission Overlay */}
            <AnimatePresence>
                {showPermission && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed bottom-[100px] left-1/2 -translate-x-1/2 bg-black/80 border border-red-500/50 rounded-2xl p-6 z-[10001] backdrop-blur-xl text-center shadow-[0_0_30px_rgba(239,68,68,0.2)]"
                    >
                        <p className="text-red-400 mb-4 flex items-center justify-center gap-2">
                            <i className="fas fa-volume-up"></i>
                            Haga clic para activar el oráculo sonoro
                        </p>
                        <button
                            onClick={activateAudio}
                            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl transition-all font-bold active:scale-95"
                        >
                            Activar Sonido
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="relative z-20 px-6 max-w-4xl text-center flex flex-col items-center">
                {/* God Symbols */}
                <div className="flex justify-center gap-6 md:gap-12 mb-12">
                    <div className="god-symbol text-amber-400 opacity-0" style={{ animation: 'godCardIntro 0.8s 0.5s forwards' }}>
                        <i className="fas fa-bolt text-4xl md:text-5xl"></i>
                        <div className="text-[10px] mt-2 font-bold tracking-widest">ZEUS</div>
                    </div>
                    <div className="god-symbol text-blue-400 opacity-0" style={{ animation: 'godCardIntro 0.8s 0.8s forwards' }}>
                        <i className="fas fa-water text-4xl md:text-5xl"></i>
                        <div className="text-[10px] mt-2 font-bold tracking-widest">POSEIDÓN</div>
                    </div>
                    <div className="god-symbol text-yellow-400 opacity-0" style={{ animation: 'godCardIntro 0.8s 1.1s forwards' }}>
                        <i className="fas fa-sun text-4xl md:text-5xl"></i>
                        <div className="text-[10px] mt-2 font-bold tracking-widest">APOLO</div>
                    </div>
                </div>

                {/* Title */}
                <div className="mb-4">
                    <h1 className="cinzel-font text-4xl md:text-7xl font-black tracking-wider uppercase mb-2 opacity-0 animate-fade-in-up"
                        style={{ animationDelay: '1.5s', animationFillMode: 'forwards' }}>
                        <span className="glitch" data-text="EL OLIMPO HA HABLADO">EL OLIMPO HA HABLADO</span>
                    </h1>
                </div>

                {/* Subtitle */}
                <div className="mb-12">
                    <p className="subtitle-red text-lg md:text-2xl font-light italic opacity-0 animate-fade-in-up"
                        style={{ animationDelay: '2s', animationFillMode: 'forwards' }}>
                        Los dioses revelan los números del destino
                    </p>
                </div>

                {/* Sacred Numbers */}
                <div className="flex justify-center gap-6 md:gap-12 mb-12">
                    {[
                        { num: '48', label: 'ZEUS', color: 'amber', icon: 'bolt', delay: 2.5 },
                        { num: '12', label: 'POSEIDÓN', color: 'blue', icon: 'water', delay: 3.0 },
                        { num: '09', label: 'APOLO', color: 'yellow', icon: 'sun', delay: 3.5 }
                    ].map((item, idx) => (
                        <div key={idx} className="relative group">
                            <div
                                className={`w-20 h-20 md:w-32 md:h-32 rounded-full border-4 border-${item.color}-500/50 flex items-center justify-center text-3xl md:text-5xl font-black text-${item.color}-400 bg-slate-900/90 backdrop-blur-md shadow-[0_0_40px_rgba(var(--${item.color}-rgb),0.3)] number-reveal`}
                                style={{ animationDelay: `${item.delay}s` }}
                            >
                                {item.num}
                            </div>
                            <div className={`absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-${item.color}-400 opacity-0 animate-fade-in-up flex items-center gap-1`} style={{ animationDelay: `${item.delay + 0.2}s` }}>
                                <i className={`fas fa-${item.icon}`}></i> {item.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Loading */}
                <div className="mb-12 w-full max-w-[300px]">
                    <div className="loading-bar">
                        <div className="loading-progress"></div>
                    </div>
                    <p className="text-slate-400 text-xs mt-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '4s', animationFillMode: 'forwards' }}>
                        Canalizando energías del Oráculo...
                    </p>
                </div>

                {/* Enter Button */}
                <button
                    onClick={handleEnter}
                    className="temple-entrance px-8 py-3 md:px-12 md:py-4 border-2 border-amber-500/30 text-amber-500 rounded-full font-black text-sm md:text-base hover:bg-amber-500/10 hover:border-amber-500 hover:text-white transition-all duration-500 group opacity-0 animate-fade-in-up shadow-[0_0_20px_rgba(245,158,11,0.1)]"
                    style={{ animationDelay: '4.5s', animationFillMode: 'forwards' }}
                >
                    <span className="flex items-center justify-center gap-3 tracking-widest">
                        <i className="fas fa-door-open group-hover:rotate-12 transition-transform"></i>
                        ENTRAR AL TEMPLO
                        <i className="fas fa-arrow-right group-hover:translate-x-2 transition-transform"></i>
                    </span>
                </button>

                {/* Countdown */}
                <div className="mt-8 text-slate-500 text-xs opacity-0 animate-fade-in-up" style={{ animationDelay: '5s', animationFillMode: 'forwards' }}>
                    Manifestación automática en <span className="text-amber-400 font-bold">{countdown}</span> segundos
                </div>
            </div>

            {/* Sound Toggle */}
            <button
                onClick={toggleSound}
                className="fixed bottom-6 right-6 z-[10000] w-12 h-12 rounded-full glass border border-amber-500/30 flex items-center justify-center transition-all hover:scale-110 active:scale-95 group"
            >
                <i className={`fas ${soundEnabled ? 'fa-volume-up text-amber-400' : 'fa-volume-mute text-slate-500'} text-xl transition-colors`} />
            </button>

            {/* Audio Assets */}
            <audio ref={ambientMusicRef} loop src="https://assets.mixkit.co/music/preview/mixkit-epic-mysterious-ambience-300.mp3" />
            <audio ref={thunderSoundRef} src="https://assets.mixkit.co/sfx/preview/mixkit-thunder-rumble-1192.mp3" />
            <audio ref={revelationSoundRef} src="https://assets.mixkit.co/sfx/preview/mixkit-magic-sparkle-sweep-149.mp3" />
            <audio ref={enterSoundRef} src="https://assets.mixkit.co/sfx/preview/mixkit-magic-portal-1375.mp3" />

            <style jsx>{`
        .number-reveal {
          --amber-rgb: 245, 158, 11;
          --blue-rgb: 59, 130, 246;
          --yellow-rgb: 234, 179, 8;
        }
      `}</style>
        </div>
    );
}
