import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    ArrowRight,
    Zap,
    Fingerprint,
    Cpu,
    Layers,
    Sparkle
} from 'lucide-react';

const HomePage = () => {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    // Auto-redirect to dashboard if already logged in
    useEffect(() => {
        if (isAuthenticated && user) {
            navigate(user.role === 'ADMIN' ? '/admin' : '/client', { replace: true });
        }
    }, [isAuthenticated, user, navigate]);

    return (
        <div className="min-h-screen bg-[#080a0f] text-slate-200 overflow-hidden relative selection:bg-indigo-500/30">
            {/* Cyberpunk Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

            {/* Neon Orbs */}
            <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] neon-glow"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] neon-glow" style={{ animationDelay: '2s' }}></div>

            {/* Navigation */}
            <nav className="fixed top-0 w-full z-[100] border-b border-white/5 bg-[#080a0f]/50 backdrop-blur-xl px-8 py-6 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:rotate-12 transition-transform duration-500">
                        <span className="text-white font-black italic text-xl">S</span>
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-white">Smart<span className="text-indigo-500">Shop</span></span>
                </Link>

                <div className="flex items-center gap-6">
                    <Link to="/login" className="px-8 py-3 bg-white text-black font-black rounded-2xl hover:bg-slate-200 hover:scale-105 active:scale-95 transition-all text-sm shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                        Enter Matrix
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <main className="relative z-10 pt-48 pb-32 px-8 flex flex-col items-center text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-12 animate-bounce">
                    <Sparkle size={14} className="text-indigo-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Revolutionizing Global Trade</span>
                </div>

                <h1 className="text-8xl lg:text-[10rem] font-black leading-[0.8] tracking-tighter text-white mb-12">
                    SMART<br />
                    <span className="neon-text italic">DISTRICT.</span>
                </h1>

                <p className="max-w-2xl text-xl text-slate-400 font-medium leading-relaxed mb-16 px-4">
                    The first B2B ecosystem designed with <span className="text-white font-black">Cyber-Premium</span> aesthetics.
                    Unleash the power of intelligent procurement.
                </p>

                <div className="flex flex-wrap gap-8 justify-center">
                    <Link to="/login" className="btn-neon px-12 py-6 text-xl group flex items-center gap-4 border border-white/10">
                        Initialize Access
                        <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                    <button className="px-12 py-6 bg-slate-900 text-white font-black rounded-3xl border border-white/5 hover:bg-slate-800 transition-all text-xl">
                        Neural Solutions
                    </button>
                </div>

                {/* Tech Badges */}
                <div className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-5xl">
                    {[
                        { icon: Zap, label: 'Turbo Sync' },
                        { icon: Fingerprint, label: 'Bio Security' },
                        { icon: Cpu, label: 'AI Oracle' },
                        { icon: Layers, label: 'Multi-Stack' },
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center gap-4 p-8 cyber-card rounded-[2.5rem] group cursor-default">
                            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform duration-500">
                                <item.icon size={28} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 group-hover:text-white transition-colors">
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>
            </main>

            <footer className="relative z-10 py-12 text-center text-[10px] font-black uppercase tracking-[0.5em] text-slate-700">
                © 2026 SmartShop District // All Systems Operational
            </footer>
        </div>
    );
};

export default HomePage;
