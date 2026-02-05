import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    Package,
    ShoppingCart,
    Heart,
    Search,
    LogOut,
    Zap,
    Box,
    Loader2,
    LayoutDashboard,
    ShoppingBag,
    History,
    Settings,
    ChevronRight,
    TrendingUp,
    Shield,
    Menu,
    X,
    Plus,
    Minus,
    Trash2,
    CheckCircle2,
    AlertCircle,
    Cpu,
    Fingerprint
} from 'lucide-react';
import { clientApi } from '../../shared/api/clientApi';
import type { Client } from '../../shared/types/client';
import type { Product } from '../../shared/types/product';
import type { Order } from '../../shared/types/order';

const ClientDashboard = () => {
    const { user, logout } = useAuth();
    const [clientProfile, setClientProfile] = useState<Client | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [activeSection, setActiveSection] = useState('Overview');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [cart, setCart] = useState<(Product & { quantity: number })[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [orderFeedback, setOrderFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                let clientId = null;
                try {
                    const profileRes = await clientApi.getMe();
                    if (profileRes.data) {
                        setClientProfile(profileRes.data);
                        clientId = profileRes.data.id;
                    }
                } catch (err) {
                    console.error("Profile sync failed - User might not have a Client record yet", err);
                }

                if (clientId) {
                    const ordersRes = await clientApi.getOrders(clientId).catch(() => ({ data: [] }));
                    setOrders(ordersRes.data || []);
                }

                const productsRes = await clientApi.getProducts(0, 50).catch(err => {
                    console.error("Marketplace sync failed", err);
                    return { data: { content: [] } };
                });
                setProducts(productsRes.data.content || []);

            } catch (err) {
                console.error("Quantum Link Failure", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const addToCart = (product: Product) => {
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            setCart(cart.map(item =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
        setIsCartOpen(true);
    };

    const removeFromCart = (productId: number) => {
        setCart(cart.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId: number, delta: number) => {
        setCart(cart.map(item => {
            if (item.id === productId) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tvaRate = 0.20;
    const tvaAmount = cartSubtotal * tvaRate;
    const cartTotal = cartSubtotal + tvaAmount;

    const handlePlaceOrder = async () => {
        if (!clientProfile) {
            setOrderFeedback({ type: 'error', message: 'Client profile missing. Please contact administration.' });
            return;
        }
        if (cart.length === 0) return;

        setActionLoading(true);
        setOrderFeedback(null);

        const orderData = {
            clientId: clientProfile.id!,
            orderDate: new Date().toISOString(),
            subtotal: cartSubtotal,
            tva: tvaAmount,
            total: cartTotal,
            status: 'PENDING' as const,
            items: cart.map(item => ({
                productId: item.id!,
                quantity: item.quantity,
                price: item.price,
                totalLine: item.price * item.quantity
            }))
        } satisfies Partial<Order>;

        try {
            await clientApi.createOrder(orderData);
            setOrderFeedback({ type: 'success', message: 'Order protocol initialized successfully!' });
            setCart([]);
            setIsCartOpen(false);

            const ordersRes = await clientApi.getOrders(clientProfile.id!);
            setOrders(ordersRes.data || []);

            setTimeout(() => setOrderFeedback(null), 5000);
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            setOrderFeedback({
                type: 'error',
                message: error.response?.data?.message || 'Failed to initialize order protocol.'
            });
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#080a0f] flex items-center justify-center">
                <div className="relative">
                    <div className="w-24 h-24 border-2 border-indigo-500/20 rounded-full animate-ping absolute inset-0"></div>
                    <Loader2 className="animate-spin text-indigo-500 relative z-10" size={48} />
                    <p className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em] whitespace-nowrap">Syncing Neural Link...</p>
                </div>
            </div>
        );
    }

    const sideItems = [
        { name: 'Overview', icon: LayoutDashboard },
        { name: 'Marketplace', icon: ShoppingBag },
        { name: 'Orders', icon: History },
        { name: 'Favorites', icon: Heart },
        { name: 'Settings', icon: Settings },
    ];

    return (
        <div className="flex min-h-screen bg-[#06080b] text-slate-300 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
            )}

            {/* Premium Fixed Sidebar */}
            <aside className={`
                fixed top-0 left-0 h-full z-[110] bg-[#0a0d14] border-r border-white/5 
                transition-all duration-500 ease-in-out group/sidebar overflow-hidden
                ${isMobileMenuOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full lg:w-24 lg:translate-x-0 lg:hover:w-72'}
            `}>
                <div className="h-24 flex items-center px-6 mb-10">
                    <div className="flex items-center gap-4 min-w-max">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-400 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/40 transform group-hover/sidebar:rotate-6 transition-transform">
                            <Zap className="text-white" size={24} fill="white" />
                        </div>
                        <span className="text-white font-black text-xl tracking-tighter uppercase italic opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300">
                            District<span className="text-indigo-500">_OS</span>
                        </span>
                    </div>
                </div>

                <nav className="px-4 space-y-3">
                    {sideItems.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => {
                                setActiveSection(item.name);
                                setIsMobileMenuOpen(false);
                            }}
                            className={`
                                w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 relative group/item
                                ${activeSection === item.name
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                    : 'text-slate-500 hover:bg-white/5 hover:text-white'}
                            `}
                        >
                            <item.icon size={22} className="shrink-0 group-hover/item:scale-110 transition-transform" />
                            <span className="font-extrabold uppercase tracking-widest text-[10px] opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                                {item.name}
                            </span>
                            {activeSection === item.name && (
                                <div className="absolute left-0 w-1 h-6 bg-white rounded-full lg:hidden group-hover/sidebar:block" />
                            )}
                        </button>
                    ))}
                </nav>

                <div className="absolute bottom-10 left-0 w-full px-4">
                    <button onClick={logout} className="w-full flex items-center gap-4 p-4 rounded-2xl text-rose-500 hover:bg-rose-500/10 transition-all duration-300 group/logout">
                        <LogOut size={22} className="shrink-0 group-hover/logout:translate-x-1 transition-transform" />
                        <span className="font-extrabold uppercase tracking-widest text-[10px] opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300">Terminate Session</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-24 min-w-0 transition-all duration-500">
                {/* Modern Header */}
                <header className="h-24 bg-[#06080b]/80 backdrop-blur-xl sticky top-0 z-50 px-6 lg:px-12 flex items-center justify-between border-b border-white/5">
                    <div className="flex items-center gap-6">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden w-12 h-12 flex items-center justify-center bg-white/5 rounded-xl border border-white/5">
                            <Menu size={20} />
                        </button>
                        <div>
                            <h2 className="text-xl lg:text-2xl font-black text-white italic uppercase tracking-tighter leading-none">{activeSection}</h2>
                            <p className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.3em] mt-2 hidden sm:block">Sector: 7-G / Node: Active</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 lg:gap-8">
                        <div className="hidden md:flex items-center bg-white/5 border border-white/5 rounded-2xl px-5 py-2.5 focus-within:border-indigo-500/50 transition-all w-64 group">
                            <Search size={16} className="text-slate-600 group-focus-within:text-indigo-400" />
                            <input type="text" placeholder="Search Ledgers..." className="bg-transparent border-none outline-none text-[10px] font-bold uppercase tracking-widest w-full ml-3 text-white" />
                        </div>

                        <button onClick={() => setIsCartOpen(true)} className="relative w-12 h-12 flex items-center justify-center bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all group">
                            <ShoppingCart size={20} className="text-slate-400 group-hover:text-indigo-400" />
                            {cart.length > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-[10px] font-black flex items-center justify-center rounded-full text-white shadow-lg shadow-indigo-600/40">
                                    {cart.length}
                                </span>
                            )}
                        </button>

                        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                            <div className="text-right hidden sm:block">
                                <p className="text-[10px] font-black text-white uppercase leading-none mb-1">@{user?.username}</p>
                                <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">{clientProfile?.fidelityLevel || 'SYNCING'}</p>
                            </div>
                            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl flex items-center justify-center font-black text-white italic text-lg shadow-xl shadow-indigo-900/20">
                                {user?.username?.[0]?.toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-6 lg:p-12 max-w-[1440px] mx-auto pb-32">
                    {orderFeedback && (
                        <div className={`mb-10 p-6 rounded-[2.5rem] border animate-fade-in-scale flex items-center gap-6 ${orderFeedback.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                            }`}>
                            {orderFeedback.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                            <p className="text-xs font-black uppercase tracking-widest">{orderFeedback.message}</p>
                        </div>
                    )}

                    {/* Dashboard Logic */}
                    {/* Dashboard Logic */}
                    {activeSection === 'Overview' && (
                        <div className="space-y-12">
                            {/* Hero Card */}
                            <div className="relative overflow-hidden rounded-[3rem] bg-[#0a0d14] border border-white/5 p-8 lg:p-16">
                                <div className="absolute inset-0 grid-bg opacity-10"></div>
                                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-500/10 to-transparent"></div>

                                <div className="relative z-10 space-y-8">
                                    <h1 className="text-5xl lg:text-8xl font-black text-white italic tracking-tighter uppercase leading-[0.9]">
                                        District<br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-400 to-indigo-500 animate-gradient-x">{user?.username}</span>
                                    </h1>
                                    <button onClick={() => setActiveSection('Marketplace')} className="btn-neon flex items-center gap-3">
                                        <ShoppingBag size={18} /> New Order
                                    </button>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { label: 'Neural Tier', value: clientProfile?.fidelityLevel || 'BASIC', icon: Zap, color: 'text-indigo-400' },
                                    { label: 'Total Orders', value: orders.length, icon: Cpu, color: 'text-emerald-400' },
                                    { label: 'Confirmed', value: orders.filter(o => o.status === 'CONFIRMED').length, icon: CheckCircle2, color: 'text-sky-400' },
                                    { label: 'Rejected', value: orders.filter(o => o.status === 'REJECTED' || o.status === 'CANCELLED').length, icon: AlertCircle, color: 'text-rose-400' },
                                ].map((stat, i) => (
                                    <div key={i} className="cyber-card p-8 rounded-[2.5rem] group hover:scale-[1.05] transition-all">
                                        <stat.icon className={`${stat.color} mb-6 transition-transform group-hover:rotate-12`} size={24} />
                                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                                        <h4 className={`text-xl font-black text-white italic uppercase tracking-tighter ${stat.color}`}>{stat.value}</h4>
                                    </div>
                                ))}
                            </div>

                            {/* Recent Events */}
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 mt-12">
                                {/* Confirmed Orders */}
                                <section className="space-y-8">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Verified Transmissions</h3>
                                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase rounded-full border border-emerald-500/20">Active</span>
                                    </div>
                                    <div className="space-y-4">
                                        {orders.filter(o => o.status === 'CONFIRMED').length > 0 ? (
                                            orders.filter(o => o.status === 'CONFIRMED').slice(0, 3).map(order => (
                                                <div key={order.id} className="cyber-card p-6 rounded-[2rem] flex items-center justify-between border-emerald-500/10">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                                                            <CheckCircle2 size={20} />
                                                        </div>
                                                        <div>
                                                            <h5 className="font-black text-white text-xs uppercase tracking-widest">CL_#{order.id}</h5>
                                                            <p className="text-[8px] font-bold text-slate-500 uppercase">{new Date(order.orderDate).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                    <p className="text-lg font-black text-emerald-400 italic">${(order.total || 0).toLocaleString()}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-8 cyber-card rounded-[2rem] text-center opacity-30 text-[10px] font-bold uppercase">No verified clusters.</div>
                                        )}
                                    </div>
                                </section>

                                {/* Refused/Pending Orders */}
                                <section className="space-y-8">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Anomalies & Staging</h3>
                                        <span className="px-3 py-1 bg-rose-500/10 text-rose-400 text-[8px] font-black uppercase rounded-full border border-rose-500/20">Monitor</span>
                                    </div>
                                    <div className="space-y-4">
                                        {orders.filter(o => o.status !== 'CONFIRMED').length > 0 ? (
                                            orders.filter(o => o.status !== 'CONFIRMED').slice(0, 3).map(order => (
                                                <div key={order.id} className="cyber-card p-6 rounded-[2rem] flex items-center justify-between border-rose-500/10">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${order.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                                            {order.status === 'PENDING' ? <Cpu size={20} /> : <AlertCircle size={20} />}
                                                        </div>
                                                        <div>
                                                            <h5 className="font-black text-white text-xs uppercase tracking-widest">CL_#{order.id}</h5>
                                                            <p className="text-[8px] font-bold text-slate-500 uppercase">{order.status}</p>
                                                        </div>
                                                    </div>
                                                    <p className="text-lg font-black text-white italic">${(order.total || 0).toLocaleString()}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-8 cyber-card rounded-[2rem] text-center opacity-30 text-[10px] font-bold uppercase">System clear.</div>
                                        )}
                                    </div>
                                </section>
                            </div>
                        </div>
                    )}

                    {activeSection === 'Marketplace' && (
                        <div className="space-y-12 animate-fade-in-scale">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                <div>
                                    <h3 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none mb-4">Neural Supply</h3>
                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Available Assets in District Core</p>
                                </div>
                            </div>

                            {products.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                    {products.map((product) => (
                                        <div key={product.id} className="cyber-card rounded-[3rem] p-6 flex flex-col group hover:scale-[1.02] transition-all border border-white/5">
                                            <div className="aspect-square bg-[#080a0f] rounded-[2.5rem] mb-6 flex items-center justify-center relative overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <Package size={64} className="text-slate-800 group-hover:text-indigo-500 transition-all group-hover:scale-110" />
                                                {product.stockQuantity < 10 && (
                                                    <div className="absolute top-4 right-4 px-3 py-1 bg-rose-500/20 text-rose-500 text-[8px] font-black uppercase rounded-full border border-rose-500/30">Low Stock</div>
                                                )}
                                            </div>

                                            <div className="flex-1 space-y-2">
                                                <div className="flex justify-between items-start">
                                                    <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">{product.category}</p>
                                                    <p className="text-xl font-black text-white italic leading-none">${product.price.toLocaleString()}</p>
                                                </div>
                                                <h4 className="text-lg font-black text-white uppercase tracking-tighter truncate">{product.name}</h4>
                                                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium">
                                                    {product.description || 'Premium hardware for district maintenance and expansion.'}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => addToCart(product)}
                                                className="mt-8 w-full py-4 bg-white/5 hover:bg-indigo-600 text-slate-400 hover:text-white border border-white/5 hover:border-indigo-500 rounded-2xl transition-all duration-300 font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3"
                                            >
                                                <Plus size={14} /> Add to Stage
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-20 cyber-card rounded-[3rem] text-center space-y-6">
                                    <div className="w-20 h-20 bg-white/5 rounded-[2.5rem] flex items-center justify-center mx-auto text-slate-800 animate-pulse">
                                        <ShoppingBag size={40} />
                                    </div>
                                    <h4 className="text-2xl font-black text-white uppercase italic">Supply Chain Offline</h4>
                                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Unable to sync with District Marketplace. Please check your uplink.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeSection === 'Orders' && (
                        <div className="space-y-12 animate-fade-in-scale">
                            <h3 className="text-5xl font-black text-white italic uppercase tracking-tighter">Transmission Ledger</h3>
                            <div className="space-y-6">
                                {orders.length > 0 ? orders.map(order => (
                                    <div key={order.id} className="cyber-card p-10 rounded-[3.5rem] flex flex-col lg:row items-center justify-between gap-10 group transition-all hover:bg-white/[0.02]">
                                        <div className="flex items-center gap-8 w-full">
                                            <div className="w-20 h-20 bg-white/5 rounded-[2.5rem] flex items-center justify-center text-indigo-500 border border-white/5 group-hover:scale-110 transition-transform">
                                                <Shield size={32} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Sync ID: 0x{order.id.toString(16).toUpperCase()}</p>
                                                <h4 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Cluster_Transmission</h4>
                                                <div className="flex items-center gap-4 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                                                    <span>Node: Primary</span>
                                                    <span className="h-1 w-1 bg-slate-800 rounded-full" />
                                                    <span>Verified: {new Date(order.orderDate).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap lg:flex-nowrap items-center gap-12 w-full lg:w-auto justify-between border-t lg:border-t-0 border-white/5 pt-8 lg:pt-0">
                                            <div className="text-center lg:text-right min-w-[120px]">
                                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Payload</p>
                                                <p className="text-3xl font-black text-white italic tabular-nums">${order.total.toLocaleString()}</p>
                                            </div>
                                            <div className="min-w-[140px] text-center lg:text-right">
                                                <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${order.status === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' : 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                                                    }`}>{order.status}</span>
                                            </div>
                                            <button className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-2xl hover:bg-white/10 text-slate-500 hover:text-white transition-all">
                                                <ChevronRight size={24} />
                                            </button>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="py-20 cyber-card rounded-[3.5rem] text-center space-y-4 opacity-50">
                                        <History size={48} className="mx-auto text-slate-700" />
                                        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">No historic transmissions found.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Premium Cart Sidebar */}
            <aside className={`
                fixed top-0 right-0 h-full bg-[#0a0d14] border-l border-white/5 z-[150] 
                transition-all duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] flex flex-col
                ${isCartOpen ? 'w-full md:w-[500px] translate-x-0' : 'w-0 translate-x-full'}
            `}>
                <div className="p-10 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-indigo-600/30">
                            <ShoppingCart size={24} />
                        </div>
                        <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Stage Cart</h3>
                    </div>
                    <button onClick={() => setIsCartOpen(false)} className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-500 rounded-xl transition-all">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-10 space-y-10">
                    {cart.map((item) => (
                        <div key={item.id} className="flex gap-6 group">
                            <div className="w-20 h-20 bg-white/5 rounded-[1.5rem] flex items-center justify-center shrink-0 border border-white/5 group-hover:border-indigo-500/30 transition-all">
                                <Package size={32} className="text-slate-700 group-hover:text-indigo-500 transition-colors" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-black text-white uppercase tracking-widest truncate mb-1">{item.name}</h4>
                                <p className="text-[10px] font-black text-indigo-400 mb-4">${item.price.toLocaleString()} / UNIT</p>
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
                                        <button onClick={() => updateQuantity(item.id!, -1)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg text-slate-500"><Minus size={14} /></button>
                                        <span className="w-8 text-center text-xs font-black text-white">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id!, 1)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg text-white"><Plus size={14} /></button>
                                    </div>
                                    <button onClick={() => removeFromCart(item.id!)} className="text-slate-600 hover:text-rose-500 transition-colors"><Trash2 size={16} /></button>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-black text-white italic">${(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                    {cart.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center opacity-30 py-20">
                            <ShoppingCart size={80} className="text-slate-800 mb-6" />
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">Cart Node Offline</p>
                        </div>
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="p-10 bg-[#06080b] border-t border-white/5 space-y-8">
                        <div className="space-y-4">
                            <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-500">
                                <span>Net Payload</span>
                                <span className="text-white">${cartSubtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-500">
                                <span>Flux Tax (20%)</span>
                                <span className="text-white">${tvaAmount.toLocaleString()}</span>
                            </div>
                            <div className="h-px bg-white/10 my-6" />
                            <div className="flex justify-between items-baseline">
                                <span className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400">Total Force</span>
                                <span className="text-4xl font-black text-white italic tabular-nums tracking-tighter">${cartTotal.toLocaleString()}</span>
                            </div>
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            disabled={actionLoading}
                            className={`w-full py-6 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-xs transition-all duration-500 flex items-center justify-center gap-4 ${actionLoading
                                ? 'bg-indigo-600/50 cursor-not-allowed text-white/50'
                                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-2xl shadow-indigo-600/40 hover:scale-[1.02] active:scale-95'
                                }`}
                        >
                            {actionLoading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} fill="white" />}
                            {actionLoading ? 'Initializing Protocol...' : 'Confirm Payload'}
                        </button>
                    </div>
                )}
            </aside>
        </div>
    );
};

export default ClientDashboard;
