
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
    <div className="min-h-screen bg-[#f3f4f6] font-montserrat text-zinc-900 pb-20">
      
      {/* Top Navigation Bar - Professional & Stable */}
      <nav className="bg-zinc-900 text-white shadow-lg sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#d97706] rounded-xl flex items-center justify-center font-black shadow-lg shadow-amber-900/50">PR</div>
                <div className="hidden md:block">
                  <span className="block font-bold leading-none">Admin</span>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-widest">Manager</span>
                </div>
              </div>
              
              <div className="hidden md:flex gap-1 bg-zinc-800/50 p-1 rounded-lg">
                <button 
                  onClick={() => setView('dashboard')}
                  className={`px-6 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${view === 'dashboard' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
                >
                  {t('dashboard')}
                </button>
                <button 
                  onClick={() => setView('products')}
                  className={`px-6 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${view === 'products' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
                >
                  {t('inventory')}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <a href="/" className="text-zinc-400 hover:text-white text-sm font-bold transition-colors hidden sm:block">
                {t('back_to_shop')}
              </a>
              <button onClick={onLogout} className="bg-red-600 hover:bg-red-500 text-white px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors shadow-lg shadow-red-900/20">
                Log Out
              </button>
            </div>
          </div>
          
          {/* Mobile Tabs */}
          <div className="flex md:hidden gap-1 pb-4">
             <button 
                  onClick={() => setView('dashboard')}
                  className={`flex-1 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${view === 'dashboard' ? 'bg-white text-zinc-900' : 'bg-zinc-800 text-zinc-400'}`}
                >
                  {t('dashboard')}
              </button>
              <button 
                  onClick={() => setView('products')}
                  className={`flex-1 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${view === 'products' ? 'bg-white text-zinc-900' : 'bg-zinc-800 text-zinc-400'}`}
                >
                  {t('inventory')}
              </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-10">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 pb-6 border-b border-zinc-200">
          <div>
            <h1 className="text-3xl font-black text-zinc-900">{view === 'dashboard' ? t('dashboard') : t('inventory')}</h1>
            <p className="text-sm text-zinc-500 font-medium mt-1">
              Welcome back. You have <span className="text-[#d97706] font-bold">{pendingOrders.length} new orders</span> today.
            </p>
          </div>
          {view === 'products' && (
            <button 
              onClick={() => { setEditingProduct(null); setIsAdding(true); }}
              className="bg-zinc-900 hover:bg-[#d97706] text-white px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl transition-all transform active:scale-95 flex items-center gap-2"
            >
              <span>+</span> Add Product
            </button>
          )}
        </div>

        {/* Dashboard View */}
        {view === 'dashboard' && (
          <div className="space-y-10 animate-fade-in">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
               <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100 flex flex-col justify-between h-40">
                  <div className="flex justify-between items-start">
                     <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{t('stats_revenue')}</p>
                     <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">💰</div>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-zinc-900">{totalRevenue.toLocaleString()}</span>
                    <span className="text-sm font-bold text-zinc-400">{t('currency')}</span>
                  </div>
               </div>
               <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100 flex flex-col justify-between h-40">
                  <div className="flex justify-between items-start">
                     <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{t('stats_orders')}</p>
                     <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">📦</div>
                  </div>
                  <span className="text-4xl font-black text-zinc-900">{orders.length}</span>
               </div>
               <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100 flex flex-col justify-between h-40">
                  <div className="flex justify-between items-start">
                     <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{t('stats_pending')}</p>
                     <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">🔔</div>
                  </div>
                  <span className={`text-4xl font-black ${pendingOrders.length > 0 ? 'text-[#d97706]' : 'text-zinc-900'}`}>{pendingOrders.length}</span>
               </div>
               <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100 flex flex-col justify-between h-40">
                  <div className="flex justify-between items-start">
                     <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{t('feedback')}</p>
                     <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">⭐</div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-zinc-900">{averageRating.toFixed(1)}</span>
                    <span className="text-sm font-bold text-zinc-400">/5 ({feedbacks.length})</span>
                  </div>
               </div>
            </div>

            {/* Orders List */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-zinc-100 overflow-hidden">
              <div className="p-8 border-b border-zinc-100 flex justify-between items-center">
                 <h3 className="font-black text-xl text-zinc-900">{t('orders')}</h3>
                 <span className="text-xs font-bold bg-zinc-100 px-3 py-1 rounded-full text-zinc-500">{orders.length} Total</span>
              </div>
              
              {orders.length === 0 ? (
                <div className="p-20 text-center">
                   <div className="text-6xl mb-4 opacity-20">📭</div>
                   <p className="text-zinc-400 font-bold uppercase tracking-widest text-sm">No orders yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] text-left rtl:text-right text-xs sm:text-sm">
                    <thead className="bg-zinc-50 text-zinc-400 text-[10px] uppercase tracking-widest font-black">
                      <tr>
                        <th className="p-6">Order ID</th>
                        <th className="p-6">Customer</th>
                        <th className="p-6">Amount</th>
                        <th className="p-6">Status</th>
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

            <div className="bg-white rounded-[2rem] shadow-sm border border-zinc-100 overflow-hidden">
              <div className="p-8 border-b border-zinc-100 flex justify-between items-center">
                 <h3 className="font-black text-xl text-zinc-900">{t('latest_feedback')}</h3>
                 <span className="text-xs font-bold bg-purple-50 px-3 py-1 rounded-full text-purple-700">{feedbacks.length}</span>
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
           <div className="bg-white rounded-[2rem] shadow-sm border border-zinc-100 overflow-hidden animate-fade-in">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left rtl:text-right text-xs sm:text-sm">
                   <thead className="bg-zinc-50 text-zinc-400 text-[10px] uppercase tracking-widest font-black">
                     <tr>
                       <th className="p-6">Product Item</th>
                       <th className="p-6">Category</th>
                       <th className="p-6">Price</th>
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
                                className="w-10 h-10 rounded-lg bg-zinc-100 hover:bg-zinc-900 hover:text-white flex items-center justify-center transition-all"
                                title="Edit"
                               >
                                 ✏️
                               </button>
                               <button 
                                onClick={() => onDeleteProduct(p.id)} 
                                className="w-10 h-10 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all"
                                title="Delete"
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
          <div className="absolute inset-0 bg-zinc-900/80 backdrop-blur-sm transition-opacity" onClick={() => setIsAdding(false)}></div>
          <div className="bg-white w-full max-w-lg sm:max-w-2xl rounded-[2.5rem] p-6 sm:p-10 relative z-10 shadow-2xl animate-in zoom-in-95 overflow-y-auto max-h-[90vh]">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-3xl font-black text-zinc-900">{editingProduct ? 'Edit Product' : 'Add New Item'}</h3>
                <button onClick={() => setIsAdding(false)} className="w-10 h-10 rounded-full bg-zinc-100 text-zinc-400 hover:bg-zinc-200 font-black flex items-center justify-center transition-colors">✕</button>
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
                
                <div className="flex gap-4 pt-6">
                   <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-5 bg-zinc-100 text-zinc-500 font-black rounded-2xl uppercase tracking-widest text-xs hover:bg-zinc-200 transition-colors">Cancel</button>
                   <button type="submit" className="flex-1 py-5 bg-zinc-900 text-white font-black rounded-2xl shadow-xl hover:bg-[#d97706] transition-all uppercase tracking-widest text-xs">{editingProduct ? 'Save Changes' : 'Create Product'}</button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
