import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoginForm } from '../features/auth/LoginForm';
import { Shield, Sparkles, Cpu } from 'lucide-react';

const LoginPage = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Direct redirect logic based on role
    useEffect(() => {
        if (isAuthenticated && user) {
            if (user.role === 'ADMIN') {
                navigate('/admin', { replace: true });
            } else if (user.role === 'CLIENT') {
                navigate('/client', { replace: true });
            }
        }
    }, [isAuthenticated, user, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#080a0f]">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] neon-glow"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] neon-glow" style={{ animationDelay: '2s' }}></div>

            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 transition-all duration-1000 animate-fade-in-scale">

                {/* Visual Side */}
                <div className="hidden lg:block space-y-12">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                            <Sparkles className="text-indigo-400" size={16} />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Quantum Protocol v2</span>
                        </div>
                        <h1 className="text-7xl font-black text-white leading-tight tracking-tighter">
                            Next-Gen <br />
                            <span className="neon-text italic">Trade Intelligence.</span>
                        </h1>
                        <p className="text-slate-400 text-xl font-medium max-w-md leading-relaxed">
                            Experience the most creative B2B ecosystem ever built. Fluid, reactive, and intelligent.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {[
                            { icon: Cpu, name: 'Smart Core', color: 'text-sky-400' },
                            { icon: Shield, name: 'Zero Trust', color: 'text-emerald-400' }
                        ].map((feat, i) => (
                            <div key={i} className="flex items-center gap-4 group">
                                <div className={`p-4 bg-slate-900 border border-white/5 rounded-2xl group-hover:scale-110 transition-transform duration-500 ${feat.color}`}>
                                    <feat.icon size={24} />
                                </div>
                                <span className="font-black text-white text-lg tracking-tight uppercase tracking-[0.1em]">{feat.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Login Card */}
                <div className="cyber-card p-1 rounded-[3rem] animate-float shadow-2xl shadow-indigo-500/10">
                    <div className="bg-[#11151e]/80 p-10 lg:p-14 rounded-[2.9rem] flex flex-col h-full border border-white/5">
                        <div className="mb-12">
                            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/40 mb-8 transform -rotate-12">
                                <span className="text-white font-black italic text-2xl">S</span>
                            </div>
                            <h2 className="text-4xl font-black text-white tracking-tighter mb-4 italic">Welcome Commander</h2>
                            <p className="text-slate-500 font-medium">Verify your credentials to initialize your session.</p>
                        </div>

                        <LoginForm />

                        <div className="mt-12 pt-8 border-t border-white/5 text-center">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
                                Protected by SmartShop Biometrics
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating particles or tech lines could be added here for more "Wow" */}
        </div>
    );
};

export default LoginPage;
