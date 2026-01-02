
import React, { useState, useEffect } from 'react';
import { Language, Product, CartItem, Order, Feedback } from './types';
import { TRANSLATIONS, INITIAL_PRODUCTS } from './constants';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import CartDrawer from './components/CartDrawer';
import Reviews from './components/Reviews';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import ContactForm from './components/ContactForm';
import AdminLogin from './components/AdminLogin';
import ProductModal from './components/ProductModal';
import OrderSuccessModal from './components/OrderSuccessModal';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('ar');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [recentOrder, setRecentOrder] = useState<Order | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Load Data
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('pharma_cart');
      const savedOrders = localStorage.getItem('pharma_orders');
      const savedProducts = localStorage.getItem('pharma_products');
      const savedFeedbacks = localStorage.getItem('pharma_feedbacks');
      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedOrders) setOrders(JSON.parse(savedOrders));
      if (savedProducts) setProducts(JSON.parse(savedProducts));
      if (savedFeedbacks) setFeedbacks(JSON.parse(savedFeedbacks));
    } catch (e) {
      console.error("Storage Error", e);
    } finally {
      setHydrated(true);
    }
  }, []);

  // Save Data
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem('pharma_cart', JSON.stringify(cart));
    localStorage.setItem('pharma_orders', JSON.stringify(orders));
    localStorage.setItem('pharma_products', JSON.stringify(products));
    localStorage.setItem('pharma_feedbacks', JSON.stringify(feedbacks));
  }, [cart, orders, products, feedbacks, hydrated]);

  // RTL/LTR Handling
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Cart Logic
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const placeOrder = (customerDetails: { name: string; phone: string; wilaya: string; address: string }) => {
    if (cart.length === 0) return;

    const cleanName = customerDetails.name.trim();
    const cleanPhone = customerDetails.phone.trim();
    const cleanAddress = customerDetails.address.trim();

    if (!cleanName || !cleanPhone || !cleanAddress) return;

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      customerName: cleanName,
      phone: cleanPhone,
      wilaya: customerDetails.wilaya,
      address: cleanAddress,
      items: [...cart],
      total,
      status: 'pending',
      date: new Date().toLocaleDateString()
    };
    setOrders(prev => [newOrder, ...prev]);
    setRecentOrder(newOrder);
    setCart([]); // Clear cart
    setIsCartOpen(false);
    setIsSuccessOpen(true);
  };

  const submitFeedback = (rating: number, comment: string) => {
    if (!recentOrder) return;

    const trimmed = comment.trim();
    const feedback: Feedback = {
      id: `FB-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      orderId: recentOrder.id,
      customerName: recentOrder.customerName,
      rating,
      comment: trimmed || t('thank_feedback'),
      createdAt: new Date().toISOString()
    };

    setFeedbacks(prev => [feedback, ...prev]);
    setOrders(prev => prev.map(o => o.id === recentOrder.id ? { ...o, feedback } : o));
    setRecentOrder(null);
    setIsSuccessOpen(false);
  };

  const deleteProduct = (id: string) => {
    if(window.confirm("Are you sure you want to delete this product?")) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const addOrUpdateProduct = (p: Product) => {
    setProducts(prev => {
      const exists = prev.find(item => item.id === p.id);
      if (exists) return prev.map(item => item.id === p.id ? p : item);
      return [p, ...prev];
    });
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const t = (key: string) => TRANSLATIONS[key]?.[lang] || key;

  return (
    <div className={`${lang === 'ar' ? 'font-cairo' : 'font-montserrat'} min-h-screen text-zinc-900 transition-colors selection:bg-[#d97706] selection:text-white`}>
      
      {isAdmin ? (
        <AdminPanel
          orders={orders}
          feedbacks={feedbacks}
          products={products}
          onDeleteProduct={deleteProduct}
          onAddProduct={addOrUpdateProduct}
          onUpdateStatus={updateOrderStatus}
          t={t}
          lang={lang}
          onLogout={() => setIsAdmin(false)}
        />
      ) : (
        <>
          <Navbar
            lang={lang}
            setLang={setLang}
            cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
            onCartClick={() => setIsCartOpen(true)}
            onAdminClick={() => setIsLoginOpen(true)}
            t={t}
          />

          <main className="page-transition">
            <Hero t={t} />

            {/* About Section - Beekeeping Story, Warm & Organic */}
            <section id="about" className="py-24 md:py-32 px-6 max-w-7xl mx-auto">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                 <div className="space-y-8 order-2 lg:order-1">
                   <div className="flex items-center gap-3">
                     <span className="w-12 h-1 bg-[#d97706]"></span>
                     <span className="text-xs font-black uppercase tracking-[0.3em] text-[#d97706]">{t('about_us')}</span>
                   </div>
                   <h2 className="text-4xl md:text-5xl font-black text-zinc-900 leading-tight">
                     {lang === 'ar' ? 'من الخلية إلى منزلك، بكل حب وإتقان' : 'From the Hive to Your Home, With Love.'}
                   </h2>
                   <p className="text-zinc-600 leading-relaxed font-medium text-lg">
                     {lang === 'ar' ? 'نحن مربو نحل شغوفون، نؤمن بأن العسل هو هدية الطبيعة الأغلى. نعتني بخلايانا في مناطق برية نقية لضمان عسل خام، غير مبستر، ومملوء بالفوائد الحيوية.' : 
                      'We are passionate beekeepers who believe honey is nature\'s most precious gift. We tend our hives in pristine wild areas to ensure raw, unpasteurized honey, brimming with bio-active benefits.'}
                   </p>
                   
                   <div className="space-y-4 pt-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-xl">🌿</div>
                        <div>
                           <h4 className="font-bold text-zinc-900">{lang === 'ar' ? 'طبيعي 100%' : '100% Organic'}</h4>
                           <p className="text-sm text-zinc-500">{lang === 'ar' ? 'بدون سكر أو إضافات' : 'No sugar, no additives'}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-xl">🐝</div>
                        <div>
                           <h4 className="font-bold text-zinc-900">{lang === 'ar' ? 'إنتاج حرفي' : 'Artisanal Production'}</h4>
                           <p className="text-sm text-zinc-500">{lang === 'ar' ? 'عناية خاصة بكل خلية' : 'Hand-harvested with care'}</p>
                        </div>
                      </div>
                   </div>
                 </div>
                 
                 <div className="relative order-1 lg:order-2">
                    <div className="absolute top-0 right-0 w-full h-full bg-[#d97706] rounded-[3rem] rotate-6 opacity-10"></div>
                    <img 
                      src="https://images.unsplash.com/photo-1621274403997-37aae1848b40?auto=format&fit=crop&q=80&w=800" 
                      className="relative z-10 rounded-[3rem] shadow-2xl w-full object-cover h-[500px] hover:scale-[1.02] transition-transform duration-700"
                      alt="Beekeeper at work"
                    />
                    <div className="absolute -bottom-6 -left-6 z-20 bg-white p-6 rounded-[2rem] shadow-xl border border-zinc-100 max-w-[200px]">
                       <p className="text-center font-black text-4xl text-[#d97706]">+10</p>
                       <p className="text-center text-[10px] font-bold uppercase tracking-widest text-zinc-400">Years Experience</p>
                    </div>
                 </div>
               </div>
            </section>

            {/* Products */}
            <section id="products" className="py-24 px-6 bg-[#fffbf0]">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                  <h2 className="text-4xl md:text-6xl font-black text-zinc-900 font-cairo">{t('products')}</h2>
                  <div className="w-20 h-1.5 bg-[#d97706] mx-auto rounded-full"></div>
                  <p className="text-zinc-500 font-medium max-w-xl mx-auto">{t('hero_subtitle')}</p>
                </div>
                <ProductGrid 
                  products={products} 
                  addToCart={addToCart} 
                  onSelectProduct={setSelectedProduct}
                  t={t} 
                  lang={lang} 
                />
              </div>
            </section>
            
            <Reviews t={t} feedbacks={feedbacks} lang={lang} />

            {/* Professional Contact */}
            <section id="contact" className="py-32 px-6 bg-white">
               <div className="max-w-7xl mx-auto bg-zinc-900 rounded-[3rem] p-8 md:p-20 text-white relative overflow-hidden shadow-2xl">
                  {/* Organic Shape Decor */}
                  <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#d97706] opacity-20 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none"></div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
                     <div className="space-y-8">
                       <h2 className="text-4xl md:text-5xl font-black">{t('contact')}</h2>
                       <p className="text-zinc-400 text-lg leading-relaxed">
                         {lang === 'ar' ? 'نحن هنا لمساعدتكم. تواصلوا معنا لطلب العسل أو للاستفسار عن منتجاتنا.' : 'We are here to help. Contact us to order honey or inquire about our products.'}
                       </p>
                       <div className="space-y-6 pt-8">
                          <div className="flex items-center gap-6 group cursor-pointer">
                             <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-2xl group-hover:bg-[#d97706] transition-colors">📞</div>
                             <div>
                               <p className="text-xs uppercase font-bold text-zinc-500">Call Us</p>
                               <p className="text-2xl font-bold font-mono">0550 00 11 22</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-6 group cursor-pointer">
                             <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-2xl group-hover:bg-[#d97706] transition-colors">📍</div>
                             <div>
                               <p className="text-xs uppercase font-bold text-zinc-500">Visit Us</p>
                               <p className="text-xl font-bold">Alger, Algérie</p>
                             </div>
                          </div>
                       </div>
                     </div>
                     
                     <div className="bg-white text-zinc-900 p-8 md:p-10 rounded-[2.5rem] shadow-2xl">
                        <ContactForm t={t} lang={lang} />
                     </div>
                  </div>
               </div>
            </section>
          </main>
          
          <Footer t={t} lang={lang} onAdminClick={() => setIsLoginOpen(true)} />

          {/* Modals */}
          <CartDrawer 
            isOpen={isCartOpen} 
            onClose={() => setIsCartOpen(false)} 
            cart={cart} 
            updateQuantity={updateQuantity} 
            removeFromCart={removeFromCart}
            onPlaceOrder={placeOrder}
            t={t}
            lang={lang}
          />

          {selectedProduct && (
            <ProductModal 
              product={selectedProduct} 
              onClose={() => setSelectedProduct(null)} 
              addToCart={addToCart}
              t={t}
              lang={lang}
            />
          )}

          <AdminLogin 
            isOpen={isLoginOpen} 
            onClose={() => setIsLoginOpen(false)} 
            onSuccess={() => { setIsAdmin(true); setIsLoginOpen(false); }} 
            t={t}
          />

          <OrderSuccessModal
            isOpen={isSuccessOpen}
            onClose={() => { setIsSuccessOpen(false); setRecentOrder(null); }}
            onSubmitFeedback={submitFeedback}
            order={recentOrder}
            lang={lang}
            t={t}
          />
        </>
      )}
    </div>
  );
};

export default App;
