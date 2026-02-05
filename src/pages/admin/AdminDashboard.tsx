import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    Users,
    Package,
    LogOut,
    Plus,
    Trash2,
    Edit,
    X,
    Target,
    Loader2,
    History,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { clientApi, productApi, orderApi } from '../../shared/api/adminApi';
import type { Client } from '../../shared/types/client';
import type { Product } from '../../shared/types/product';
import type { Order } from '../../shared/types/order';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState<'Overview' | 'Clients' | 'Products' | 'Orders'>('Overview');
    const [clients, setClients] = useState<Client[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    // Form states
    const [clientForm, setClientForm] = useState<Client>({
        username: '', email: '', password: '', totalOrders: 0, totalSpent: 0
    });
    const [productForm, setProductForm] = useState<Product>({
        name: '', description: '', price: 0, stockQuantity: 0
    });

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'Overview') {
                const [clientsRes, productsRes, ordersRes] = await Promise.all([
                    clientApi.getAll(),
                    productApi.getAll(),
                    orderApi.getAll()
                ]);
                console.log("Admin Overview Sync:", { clients: clientsRes.data, products: productsRes.data, orders: ordersRes.data });
                setClients(clientsRes.data || []);
                setProducts(productsRes.data?.content || productsRes.data || []);
                setOrders(ordersRes.data || []);
            } else if (activeTab === 'Clients') {
                const res = await clientApi.getAll();
                setClients(res.data || []);
            } else if (activeTab === 'Products') {
                const res = await productApi.getAll();
                setProducts(res.data?.content || res.data || []);
            } else if (activeTab === 'Orders') {
                const res = await orderApi.getAll();
                console.log("Admin Orders Fetch:", res.data);
                setOrders(res.data || []);
            }
        } catch (err) {
            console.error("Failed to load data", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            if (activeTab === 'Clients') await clientApi.delete(id);
            else await productApi.delete(id);
            loadData();
        } catch (err) {
            alert("Delete failed");
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (activeTab === 'Clients') {
                if (editingItem) await clientApi.update(editingItem.id, clientForm);
                else await clientApi.create(clientForm);
            } else {
                if (editingItem) await productApi.update(editingItem.id, productForm);
                else await productApi.create(productForm);
            }
            setIsModalOpen(false);
            setEditingItem(null);
            loadData();
        } catch (err) {
            alert("Save failed");
        }
    };

    const openModal = (item: any = null) => {
        setEditingItem(item);
        if (activeTab === 'Clients') {
            setClientForm(item || { username: '', email: '', password: '', totalOrders: 0, totalSpent: 0 });
        } else {
            setProductForm(item || { name: '', description: '', price: 0, stockQuantity: 0 });
        }
        setIsModalOpen(true);
    };

    return (
        <div className="flex min-h-screen bg-[#080a0f] text-slate-300">
            {/* Sidebar */}
            <aside className="w-80 bg-[#11151e] border-r border-white/5 flex flex-col fixed h-full z-20">
                <div className="p-10 flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/40 transform rotate-3">
                        <span className="text-white font-black italic text-2xl">S</span>
                    </div>
                    <span className="text-white font-black text-2xl tracking-tighter italic uppercase">Admin<span className="text-indigo-500">_OS</span></span>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-2">
                    {[
                        { name: 'Overview', icon: Target },
                        { name: 'Products', icon: Package },
                        { name: 'Clients', icon: Users },
                        { name: 'Orders', icon: History },
                    ].map((item) => (
                        <button
                            key={item.name}
                            onClick={() => setActiveTab(item.name as any)}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-3xl transition-all duration-500 font-black uppercase tracking-widest text-[10px] ${activeTab === item.name
                                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 translate-x-2'
                                : 'text-slate-500 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <item.icon size={18} />
                            {item.name}
                        </button>
                    ))}
                </nav>

                <div className="p-6">
                    <button onClick={logout} className="w-full flex items-center justify-center gap-4 py-5 rounded-[2rem] bg-rose-500/5 text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-500 font-black uppercase tracking-widest text-[10px] border border-rose-500/20">
                        <LogOut size={16} /> Disconnect
                    </button>
                </div>
            </aside>

            {/* Main Area */}
            <main className="flex-1 ml-80 p-12">
                <header className="flex items-center justify-between mb-16">
                    <div>
                        <h1 className="text-5xl font-black text-white italic tracking-tighter mb-2">{activeTab}</h1>
                        <p className="text-indigo-400 font-bold uppercase tracking-[0.3em] text-[10px]">Commander {user?.username} // Protocol Active</p>
                    </div>
                    {activeTab !== 'Orders' && activeTab !== 'Overview' && (
                        <button
                            onClick={() => openModal()}
                            className="btn-neon flex items-center gap-2 px-6 py-3 text-[10px] uppercase font-black tracking-widest"
                        >
                            <Plus size={16} /> New {activeTab.slice(0, -1)}
                        </button>
                    )}
                </header>

                {activeTab === 'Overview' ? (
                    <div className="space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="cyber-card p-8 rounded-[3rem] border border-white/5 hover:border-indigo-500/30 transition-all group">
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2 group-hover:text-indigo-400">Total Clients</p>
                                <h3 className="text-4xl font-black text-white italic tracking-tighter">{clients.length}</h3>
                            </div>
                            <div className="cyber-card p-8 rounded-[3rem] border border-white/5 hover:border-emerald-500/30 transition-all group">
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2 group-hover:text-emerald-400">Total Products</p>
                                <h3 className="text-4xl font-black text-white italic tracking-tighter">{products.length}</h3>
                            </div>
                            <div className="cyber-card p-8 rounded-[3rem] border border-white/5 hover:border-amber-500/30 transition-all group">
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2 group-hover:text-amber-400">Total Orders</p>
                                <h3 className="text-4xl font-black text-white italic tracking-tighter">{orders.length}</h3>
                            </div>
                            <div className="cyber-card p-8 rounded-[3rem] border border-white/5 hover:border-rose-500/30 transition-all group">
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2 group-hover:text-rose-400">Yield Flux</p>
                                <h3 className="text-4xl font-black text-white italic tracking-tighter">
                                    ${orders.reduce((acc, curr) => acc + (curr.total || 0), 0).toLocaleString()}
                                </h3>
                            </div>
                        </div>

                        <div className="cyber-card rounded-[3rem] overflow-hidden border border-white/5">
                            <div className="p-8 border-b border-white/5 flex justify-between items-center">
                                <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Recent Transmissions</h3>
                                <button onClick={() => setActiveTab('Orders')} className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors">View All Clusters</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                        <tr>
                                            <th className="px-8 py-6">Order</th>
                                            <th className="px-8 py-6">Client</th>
                                            <th className="px-8 py-6">Total</th>
                                            <th className="px-8 py-6">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {orders.slice(0, 3).map((order) => (
                                            <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-8 py-6 font-black text-white italic"># {order.id}</td>
                                                <td className="px-8 py-6 text-[10px] font-bold text-slate-400">
                                                    @{order.clientUsername || '---'}
                                                </td>
                                                <td className="px-8 py-6 font-black text-indigo-400">
                                                    ${order.total.toLocaleString()}
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${order.status === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' :
                                                        order.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' :
                                                            'bg-rose-500/10 text-rose-500 border-rose-500/30'
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {orders.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="px-8 py-20 text-center text-[10px] font-black uppercase tracking-widest text-slate-600">No active transmissions detected.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="cyber-card rounded-[3rem] overflow-hidden">
                        {loading ? (
                            <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-indigo-500" size={48} /></div>
                        ) : (
                            <table className="w-full text-left">
                                <thead className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                    <tr>
                                        {activeTab === 'Orders' ? (
                                            <>
                                                <th className="px-8 py-6">Order</th>
                                                <th className="px-8 py-6">Client</th>
                                                <th className="px-8 py-6">Date</th>
                                                <th className="px-8 py-6">Total</th>
                                                <th className="px-8 py-6">Status</th>
                                            </>
                                        ) : (
                                            <>
                                                <th className="px-8 py-6">{activeTab === 'Clients' ? 'User' : 'Product'}</th>
                                                <th className="px-8 py-6">{activeTab === 'Clients' ? 'Status' : 'Price'}</th>
                                            </>
                                        )}
                                        <th className="px-8 py-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {activeTab === 'Orders' ? (
                                        orders.length > 0 ? orders.map((order) => (
                                            <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-8 py-6 font-black text-white italic"># {order.id}</td>
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-col">
                                                        <span className="text-white font-black text-[10px] uppercase tracking-tighter italic">@{order.clientUsername || '---'}</span>
                                                        <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">UID: {order.clientId}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-[10px] font-bold text-slate-400 whitespace-nowrap">
                                                    {order.orderDate ? new Date(order.orderDate).toLocaleString() : '---'}
                                                </td>
                                                <td className="px-8 py-6 font-black text-indigo-400">
                                                    ${(order.total || 0).toLocaleString()}
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${order.status === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' :
                                                        order.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' :
                                                            'bg-rose-500/10 text-rose-500 border-rose-500/30'
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex justify-end gap-3">
                                                        {order.status === 'PENDING' && (
                                                            <>
                                                                <button
                                                                    onClick={async () => {
                                                                        if (confirm("Confirm this order protocol?")) {
                                                                            try {
                                                                                await orderApi.confirm(order.id);
                                                                                loadData();
                                                                            } catch (err) {
                                                                                alert("Confirmation sequence failed");
                                                                            }
                                                                        }
                                                                    }}
                                                                    className="w-10 h-10 flex items-center justify-center bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all border border-emerald-500/20"
                                                                    title="Confirm Order"
                                                                >
                                                                    <CheckCircle2 size={16} />
                                                                </button>
                                                                <button
                                                                    onClick={async () => {
                                                                        if (confirm("Cancel this order protocol?")) {
                                                                            try {
                                                                                await orderApi.cancel(order.id);
                                                                                loadData();
                                                                            } catch (err) {
                                                                                alert("Cancellation sequence failed");
                                                                            }
                                                                        }
                                                                    }}
                                                                    className="w-10 h-10 flex items-center justify-center bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20"
                                                                    title="Cancel Order"
                                                                >
                                                                    <AlertCircle size={16} />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={6} className="px-8 py-20 text-center">
                                                    <div className="flex flex-col items-center gap-4 opacity-30">
                                                        <History size={48} />
                                                        <p className="text-[10px] font-black uppercase tracking-[0.4em]">No active transmissions detected in this sector.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    ) : (
                                        (activeTab === 'Clients' ? clients : products).map((item: any) => (
                                            <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-8 py-6 font-black text-white italic">{item.username || item.name}</td>
                                                <td className="px-8 py-6 uppercase text-[10px] font-bold text-indigo-400">
                                                    {activeTab === 'Clients' ? item.fidelityLevel : `$${item.price}`}
                                                </td>
                                                <td className="px-8 py-6 text-right flex justify-end gap-3">
                                                    <button onClick={() => openModal(item)} className="p-2 hover:text-indigo-400 transition-colors"><Edit size={18} /></button>
                                                    <button onClick={() => handleDelete(item.id)} className="p-2 hover:text-rose-500 transition-colors"><Trash2 size={18} /></button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </main>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#080a0f]/80 backdrop-blur-md">
                    <div className="cyber-card w-full max-w-lg rounded-[3rem] p-10 animate-fade-in-scale">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">
                                {editingItem ? 'Edit' : 'Create'} {activeTab.slice(0, -1)}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSave} className="space-y-6">
                            {activeTab === 'Clients' ? (
                                <>
                                    <input
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 outline-none focus:border-indigo-500/50"
                                        placeholder="Username" value={clientForm.username} onChange={e => setClientForm({ ...clientForm, username: e.target.value })} required
                                    />
                                    <input
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 outline-none focus:border-indigo-500/50"
                                        placeholder="Email" type="email" value={clientForm.email} onChange={e => setClientForm({ ...clientForm, email: e.target.value })} required
                                    />
                                    {!editingItem && <input
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 outline-none focus:border-indigo-500/50"
                                        placeholder="Password" type="password" value={clientForm.password} onChange={e => setClientForm({ ...clientForm, password: e.target.value })} required
                                    />}
                                </>
                            ) : (
                                <>
                                    <input
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 outline-none focus:border-indigo-500/50"
                                        placeholder="Product Name" value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} required
                                    />
                                    <textarea
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 outline-none focus:border-indigo-500/50"
                                        placeholder="Description" value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                                    />
                                    <div className="flex gap-4">
                                        <input
                                            type="number" className="w-1/2 bg-white/5 border border-white/5 rounded-2xl p-4 outline-none focus:border-indigo-500/50"
                                            placeholder="Price" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: Number(e.target.value) })} required
                                        />
                                        <input
                                            type="number" className="w-1/2 bg-white/5 border border-white/5 rounded-2xl p-4 outline-none focus:border-indigo-500/50"
                                            placeholder="Stock" value={productForm.stockQuantity} onChange={e => setProductForm({ ...productForm, stockQuantity: Number(e.target.value) })} required
                                        />
                                    </div>
                                </>
                            )}
                            <button type="submit" className="w-full btn-neon py-5 text-[10px] uppercase font-black">
                                {editingItem ? 'Save Updates' : 'Confirm Creation'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
