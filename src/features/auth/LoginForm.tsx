import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader2, Mail, Lock } from 'lucide-react';

export const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            await login({ username, password });
            // The AuthContext update will trigger a re-render
            // But we can proactively check the user roles after login returns
            // Since our login in AuthContext now sets the user immediately
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Authentication failed. Check your coordinates.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="text-rose-400 bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl text-sm animate-pulse flex items-center gap-3">
                        <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] ml-2">Access ID</label>
                    <div className="relative group">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                            <Mail size={18} />
                        </div>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-slate-800/50 border border-white/5 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all duration-500 outline-none text-white font-medium placeholder:text-slate-600"
                            placeholder="Enter username"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center ml-2">
                        <label className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em]">Security Key</label>
                    </div>
                    <div className="relative group">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                            <Lock size={18} />
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-slate-800/50 border border-white/5 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all duration-500 outline-none text-white font-medium placeholder:text-slate-600"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-neon mt-4 group"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                    {isSubmitting ? (
                        <span className="flex items-center justify-center gap-3">
                            <Loader2 className="animate-spin" size={20} />
                            Decrypting Access...
                        </span>
                    ) : (
                        <span className="flex items-center justify-center gap-2">
                            Secure Login
                        </span>
                    )}
                </button>
            </form>
        </div>
    );
};
