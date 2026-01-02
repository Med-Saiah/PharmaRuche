
import React, { useState } from 'react';
import { Order, Product, Language, Feedback } from '../types';

interface AdminPanelProps {
  orders: Order[];
  feedbacks: Feedback[];
  products: Product[];
  onDeleteProduct: (id: string) => void;
  onAddProduct: (p: Product) => void;
  onUpdateStatus: (id: string, s: Order['status']) => void;
  onLogout: () => void;
  t: (key: string) => string;
  lang: Language;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ orders, products, feedbacks, onDeleteProduct, onAddProduct, onUpdateStatus, onLogout, t, lang }) => {
  const [view, setView] = useState<'dashboard' | 'products'>('dashboard');
  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: { ar: '', fr: '', en: '' },
    description: { ar: '', fr: '', en: '' },
    price: 0,
    image: '',
    category: 'Honey'
  });

  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanImage = formData.image?.trim() || 'https://via.placeholder.com/400';
    
    const newP: Product = {
      id: editingProduct?.id || `PR-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      name: formData.name as any,
      description: formData.description as any,
      price: Math.abs(Number(formData.price)),
      image: cleanImage,
      category: formData.category || 'Honey'
    };
    onAddProduct(newP);
    setIsAdding(false);
    setEditingProduct(null);
    setFormData({ name: { ar: '', fr: '', en: '' }, description: { ar: '', fr: '', en: '' }, price: 0, image: '', category: 'Honey' });
  };

  const startEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData(p);
    setIsAdding(true);
  };

  const totalRevenue = orders.reduce((sum, order) => sum + (order.status !== 'cancelled' ? order.total : 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const averageRating = feedbacks.length === 0 ? 0 : (feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / feedbacks.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-50 font-montserrat text-zinc-900 pb-20">
      
      {/* Top Navigation Bar - Professional & Stable */}
      <nav className="bg-white text-zinc-900 shadow-md border-b border-zinc-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="Pharma Ruche" className="h-12 w-auto" />
                <div className="hidden md:block border-l border-zinc-200 pl-4">
                  <span className="block font-bold leading-none text-zinc-900">Admin Panel</span>
                  <span className="text-[9px] text-zinc-500 uppercase tracking-widest">Dashboard</span>
                </div>
              </div>
              
              <div className="hidden md:flex gap-2 bg-zinc-100 p-1.5 rounded-lg">
                <button 
                  onClick={() => setView('dashboard')}
                  className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${view === 'dashboard' ? 'bg-[#d97706] text-white shadow-md' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200'}`}
                >
                  📊 {t('dashboard')}
                </button>
                <button 
                  onClick={() => setView('products')}
                  className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${view === 'products' ? 'bg-[#d97706] text-white shadow-md' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200'}`}
                >
                  📦 {t('inventory')}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <a href="/" className="text-zinc-600 hover:text-[#d97706] text-sm font-bold transition-colors hidden sm:block border-r border-zinc-200 pr-4">
                ← {t('back_to_shop')}
              </a>
              <button onClick={onLogout} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all shadow-md">
                🚪 Logout
              </button>
            </div>
          </div>
          
          {/* Mobile Tabs */}
          <div className="flex md:hidden gap-2 pb-4 pt-4 border-t border-zinc-100">
             <button 
                  onClick={() => setView('dashboard')}
                  className={`flex-1 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${view === 'dashboard' ? 'bg-[#d97706] text-white shadow-md' : 'bg-zinc-100 text-zinc-600'}`}
                >
                  📊 {t('dashboard')}
              </button>
              <button 
                  onClick={() => setView('products')}
                  className={`flex-1 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${view === 'products' ? 'bg-[#d97706] text-white shadow-md' : 'bg-zinc-100 text-zinc-600'}`}
                >
                  📦 {t('inventory')}
              </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-10">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h1 className="text-4xl font-bold text-zinc-900">🏢 {view === 'dashboard' ? t('dashboard') : t('inventory')}</h1>
            <p className="text-base text-zinc-600 font-medium mt-3">
              Welcome back! You have <span className="text-[#d97706] font-bold text-lg">{pendingOrders.length} pending orders</span> to manage.
            </p>
          </div>
          {view === 'products' && (
            <button 
              onClick={() => { setEditingProduct(null); setIsAdding(true); }}
              className="bg-[#d97706] hover:bg-[#b45309] text-white px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <span>➕</span> Add Product
            </button>
          )}
        </div>

        {/* Dashboard View */}
        {view === 'dashboard' && (
          <div className="space-y-10 animate-fade-in">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
               <div className="bg-gradient-to-br from-white to-green-50 p-8 rounded-2xl shadow-sm border border-green-100 flex flex-col justify-between h-44 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start">
                     <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{t('stats_revenue')}</p>
                     <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center text-xl">💰</div>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-5xl font-black text-green-700">{totalRevenue.toLocaleString()}</span>
                      <span className="text-base font-bold text-zinc-500">{t('currency')}</span>
                    </div>
                    <p className="text-xs text-green-600 font-semibold">✓ All-time revenue</p>
                  </div>
               </div>
               <div className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-2xl shadow-sm border border-blue-100 flex flex-col justify-between h-44 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start">
                     <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{t('stats_orders')}</p>
                     <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl">📦</div>
                  </div>
                  <div>
                    <span className="text-5xl font-black text-blue-700 block mb-1">{orders.length}</span>
                    <p className="text-xs text-blue-600 font-semibold">Total orders received</p>
                  </div>
               </div>
               <div className="bg-gradient-to-br from-white to-amber-50 p-8 rounded-2xl shadow-sm border border-amber-100 flex flex-col justify-between h-44 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start">
                     <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{t('stats_pending')}</p>
                     <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-xl">🔔</div>
                  </div>
                  <div>
                    <span className={`text-5xl font-black block mb-1 ${pendingOrders.length > 0 ? 'text-amber-700' : 'text-zinc-900'}`}>{pendingOrders.length}</span>
                    <p className="text-xs text-amber-600 font-semibold">Awaiting action</p>
                  </div>
               </div>
               <div className="bg-gradient-to-br from-white to-purple-50 p-8 rounded-2xl shadow-sm border border-purple-100 flex flex-col justify-between h-44 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start">
                     <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{t('feedback')}</p>
                     <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-xl">⭐</div>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-5xl font-black text-purple-700">{averageRating.toFixed(1)}</span>
                      <span className="text-base font-bold text-zinc-500">/5</span>
                    </div>
                    <p className="text-xs text-purple-600 font-semibold">({feedbacks.length} reviews)</p>
                  </div>
               </div>
            </div>

            {/* Orders List */}
            <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
              <div className="p-8 border-b border-zinc-100 flex justify-between items-center bg-gradient-to-r from-zinc-50 to-white">
                 <h3 className="font-bold text-2xl text-zinc-900">📋 {t('orders')}</h3>
                 <span className="text-xs font-bold bg-[#d97706]/10 px-4 py-2 rounded-full text-[#d97706] border border-[#d97706]/20">{orders.length} Total Orders</span>
              </div>
              
              {orders.length === 0 ? (
                <div className="p-20 text-center">
                   <div className="text-6xl mb-4 opacity-30">📭</div>
                   <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">No orders yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] text-left rtl:text-right text-xs sm:text-sm">
                    <thead className="bg-gradient-to-r from-zinc-50 to-zinc-100 text-zinc-600 text-[10px] uppercase tracking-widest font-bold">
                      <tr>
                        <th className="p-6 text-left">Order ID</th>
                        <th className="p-6 text-left">Customer</th>
                        <th className="p-6 text-left">Amount</th>
                        <th className="p-6 text-left">Status</th>
                        <th className="p-6 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 text-sm">
                       {orders.map(order => (
                         <tr key={order.id} className="hover:bg-zinc-50 transition-colors">
                           <td className="p-6 font-mono font-bold text-zinc-500">#{order.id}</td>
                           <td className="p-6">
                             <div className="font-bold text-zinc-900">{order.customerName}</div>
                             <div className="text-xs text-zinc-400">{order.phone}</div>
                             <div className="text-xs text-zinc-400 truncate max-w-[150px]">{order.wilaya}</div>
                           </td>
                           <td className="p-6 font-black text-zinc-900">{order.total} {t('currency')}</td>
                           <td className="p-6">
                              <span className={`inline-block px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                order.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                                order.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                              }`}>
                                {t(`status_${order.status}` as any) || order.status}
                              </span>
                           </td>
                           <td className="p-6 text-right">
                             <select 
                               value={order.status}
                               onChange={(e) => onUpdateStatus(order.id, e.target.value as any)}
                               className="bg-white border-2 border-zinc-200 text-xs rounded-xl px-4 py-2 outline-none focus:border-zinc-900 cursor-pointer font-bold transition-all"
                             >
                               <option value="pending">Pending</option>
                               <option value="delivered">Delivered</option>
                               <option value="cancelled">Cancel</option>
                             </select>
                           </td>
                         </tr>
                       ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
              <div className="p-8 border-b border-zinc-100 flex justify-between items-center bg-gradient-to-r from-zinc-50 to-white">
                 <h3 className="font-bold text-2xl text-zinc-900">💬 {t('latest_feedback')}</h3>
                 <span className="text-xs font-bold bg-purple-50 px-4 py-2 rounded-full text-purple-700 border border-purple-200">{feedbacks.length} Reviews</span>
              </div>

              {feedbacks.length === 0 ? (
                <div className="p-12 text-center text-zinc-400 font-bold uppercase tracking-widest text-sm">No feedback yet</div>
              ) : (
                <div className="divide-y divide-zinc-100">
                  {feedbacks.slice(0, 6).map((fb) => (
                    <div key={fb.id} className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <p className="text-sm font-black text-zinc-900">{fb.customerName}</p>
                        <p className="text-xs text-zinc-400">#{fb.orderId} · {new Date(fb.createdAt).toLocaleDateString()}</p>
                        <p className="text-zinc-600 mt-2 leading-relaxed max-w-2xl">{fb.comment}</p>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500 text-lg font-black">
                        {[...Array(5)].map((_, idx) => (
                          <span key={idx}>{idx < fb.rating ? '★' : '☆'}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Inventory View */}
        {view === 'products' && (
           <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden animate-fade-in">
              <div className="p-8 border-b border-zinc-100 bg-gradient-to-r from-zinc-50 to-white">
                <h3 className="font-bold text-2xl text-zinc-900">📦 Product Inventory</h3>
                <p className="text-sm text-zinc-500 mt-1">Manage your products and inventory</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left rtl:text-right text-xs sm:text-sm">
                   <thead className="bg-gradient-to-r from-zinc-50 to-zinc-100 text-zinc-600 text-[10px] uppercase tracking-widest font-bold">
                     <tr>
                       <th className="p-6 text-left">Product Item</th>
                       <th className="p-6 text-left">Category</th>
                       <th className="p-6 text-left">Price</th>
                       <th className="p-6 text-right">Controls</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-zinc-100 text-sm">
                      {products.map(p => (
                        <tr key={p.id} className="group hover:bg-zinc-50 transition-colors">
                          <td className="p-6">
                             <div className="flex items-center gap-4">
                               <div className="w-16 h-16 rounded-xl bg-zinc-100 overflow-hidden border border-zinc-200">
                                 <img src={p.image} className="w-full h-full object-cover" alt="" />
                               </div>
                               <div>
                                 <div className="font-bold text-zinc-900 text-base">{p.name[lang]}</div>
                                 <div className="text-xs text-zinc-400 font-mono mt-1">ID: {p.id}</div>
                               </div>
                             </div>
                          </td>
                          <td className="p-6">
                            <span className="inline-block px-3 py-1 bg-zinc-100 rounded-full text-[10px] font-bold uppercase text-zinc-500 tracking-wider">{p.category}</span>
                          </td>
                          <td className="p-6 font-mono font-black text-zinc-900">{p.price} {t('currency')}</td>
                          <td className="p-6 text-right">
                             <div className="flex justify-end gap-3">
                               <button 
                                onClick={() => startEdit(p)} 
                                className="w-10 h-10 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all hover:shadow-md"
                                title="Edit Product"
                               >
                                 ✏️
                               </button>
                               <button 
                                onClick={() => onDeleteProduct(p.id)} 
                                className="w-10 h-10 rounded-lg bg-red-50 text-red-500 hover:bg-red-600 hover:text-white flex items-center justify-center transition-all hover:shadow-md"
                                title="Delete Product"
                               >
                                 🗑️
                               </button>
                             </div>
                          </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
              </div>
           </div>
        )}
      </main>

      {/* Modal - Modern & Clean */}
      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-900/70 backdrop-blur-sm transition-opacity" onClick={() => setIsAdding(false)}></div>
          <div className="bg-white w-full max-w-lg sm:max-w-2xl rounded-3xl p-6 sm:p-10 relative z-10 shadow-2xl animate-in zoom-in-95 overflow-y-auto max-h-[90vh]">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-3xl font-bold text-zinc-900">{editingProduct ? '✏️ Edit Product' : '➕ Add New Product'}</h3>
                <button onClick={() => setIsAdding(false)} className="w-10 h-10 rounded-full bg-zinc-100 text-zinc-500 hover:bg-red-100 hover:text-red-600 font-bold flex items-center justify-center transition-all text-lg">✕</button>
             </div>

             <form onSubmit={handleSubmitProduct} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Name (EN/FR)</label>
                     <input required className="w-full p-4 bg-zinc-50 border-2 border-zinc-100 rounded-2xl font-bold outline-none focus:border-[#d97706] focus:bg-white transition-all" value={formData.name?.en} onChange={(e) => setFormData({...formData, name: {...formData.name, en: e.target.value, fr: e.target.value} as any})} />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Name (AR)</label>
                     <input dir="rtl" required className="w-full p-4 bg-zinc-50 border-2 border-zinc-100 rounded-2xl font-bold outline-none focus:border-[#d97706] focus:bg-white transition-all" value={formData.name?.ar} onChange={(e) => setFormData({...formData, name: {...formData.name, ar: e.target.value} as any})} />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Price ({t('currency')})</label>
                     <input type="number" required className="w-full p-4 bg-zinc-50 border-2 border-zinc-100 rounded-2xl font-bold outline-none focus:border-[#d97706] focus:bg-white transition-all" value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Category</label>
                     <select className="w-full p-4 bg-zinc-50 border-2 border-zinc-100 rounded-2xl font-bold outline-none focus:border-[#d97706] focus:bg-white transition-all cursor-pointer appearance-none" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                       <option value="Honey">Honey</option>
                       <option value="Supplements">Supplements</option>
                     </select>
                   </div>
                </div>
                
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Description</label>
                   <textarea className="w-full p-4 bg-zinc-50 border-2 border-zinc-100 rounded-2xl font-medium outline-none focus:border-[#d97706] focus:bg-white transition-all resize-none" rows={3} value={formData.description?.[lang]} onChange={(e) => setFormData({...formData, description: {...formData.description, [lang]: e.target.value} as any})}></textarea>
                </div>
                
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Image URL</label>
                   <input required className="w-full p-4 bg-zinc-50 border-2 border-zinc-100 rounded-2xl font-mono text-xs outline-none focus:border-[#d97706] focus:bg-white transition-all" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} />
                </div>
                
                <div className="flex gap-4 pt-8">
                   <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-5 bg-zinc-100 text-zinc-700 font-bold rounded-2xl uppercase tracking-widest text-xs hover:bg-zinc-200 transition-all">Cancel</button>
                   <button type="submit" className="flex-1 py-5 bg-[#d97706] text-white font-bold rounded-2xl shadow-lg hover:bg-[#b45309] hover:shadow-xl transition-all uppercase tracking-widest text-xs">{editingProduct ? '💾 Save Changes' : '➕ Create Product'}</button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
