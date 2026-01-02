import React, { useState, useEffect } from "react";
import { Language, Product, CartItem, Order, Feedback } from "./types";
import { TRANSLATIONS } from "./constants";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProductGrid from "./components/ProductGrid";
import CartDrawer from "./components/CartDrawer";
import Reviews from "./components/Reviews";
import Footer from "./components/Footer";
import AdminPanel from "./components/AdminPanel";
import ContactForm from "./components/ContactForm";
import AdminLogin from "./components/AdminLogin";
import ProductModal from "./components/ProductModal";
import OrderSuccessModal from "./components/OrderSuccessModal";
import { useFirebaseData } from "./useFirebaseData";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>("ar");
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Keep cart local (OK)
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Firestore data
const {
  products,
  orders,
  feedbacks,
  isAdmin,
  addOrder,
  addFeedback,
  updateOrderStatus,
  deleteProduct,
  addProduct,
  updateProduct,
} = useFirebaseData();



  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [recentOrder, setRecentOrder] = useState<Order | null>(null);

  const [hydratedCart, setHydratedCart] = useState(false);

  // Load Cart (localStorage)
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("pharma_cart");
      if (savedCart) setCart(JSON.parse(savedCart));
    } catch (e) {
      console.error("Cart Storage Error", e);
    } finally {
      setHydratedCart(true);
    }
  }, []);

  // Save Cart (localStorage)
  useEffect(() => {
    if (!hydratedCart) return;
    localStorage.setItem("pharma_cart", JSON.stringify(cart));
  }, [cart, hydratedCart]);

  // RTL/LTR
  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key: string) => TRANSLATIONS[key]?.[lang] || key;

  // Cart Logic
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  // ✅ PLACE ORDER -> Firestore
  const placeOrder = async (customerDetails: {
    name: string;
    phone: string;
    wilaya: string;
    address: string;
  }) => {
    if (cart.length === 0) return;

    const cleanName = customerDetails.name.trim();
    const cleanPhone = customerDetails.phone.trim();
    const cleanAddress = customerDetails.address.trim();
    if (!cleanName || !cleanPhone || !cleanAddress) return;

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const orderToSave: Omit<Order, "id"> = {
      customerName: cleanName,
      phone: cleanPhone,
      wilaya: customerDetails.wilaya,
      address: cleanAddress,
      items: [...cart],
      total,
      status: "pending",
      // keep a display date if you want:
      date: new Date().toLocaleDateString(),
    } as any;

    try {
      const id = await addOrder(orderToSave);

      const createdOrder: Order = { id, ...(orderToSave as any) };
      setRecentOrder(createdOrder);

      setCart([]);
      setIsCartOpen(false);
      setIsSuccessOpen(true);
    } catch (e) {
      console.error("Failed to add order to Firestore:", e);
      alert("Order failed. Check console for error.");
    }
  };

  // ✅ FEEDBACK -> Firestore
  const submitFeedback = async (rating: number, comment: string) => {
    if (!recentOrder) return;

    const trimmed = comment.trim();
    const feedbackToSave: Omit<Feedback, "id"> = {
      orderId: recentOrder.id,
      customerName: recentOrder.customerName,
      rating,
      comment: trimmed || t("thank_feedback"),
    } as any;

    try {
      await addFeedback(feedbackToSave);
      setRecentOrder(null);
      setIsSuccessOpen(false);
    } catch (e) {
      console.error("Failed to add feedback:", e);
      alert("Feedback failed. Check console for error.");
    }
  };

  return (
    <div
      className={`${
        lang === "ar" ? "font-cairo" : "font-montserrat"
      } min-h-screen text-zinc-900 transition-colors selection:bg-[#d97706] selection:text-white`}
    >
      {isAdmin ? (
        <AdminPanel
          orders={orders}
          feedbacks={feedbacks}
          products={products}
          onDeleteProduct={(id) => deleteProduct(id)}
          onCreateProduct={(p) => addProduct(p)}
          onUpdateProduct={(id, p) => updateProduct(id, p)}
          onUpdateStatus={(id, status) => updateOrderStatus(id, status)}
          t={t}
          lang={lang}
          onLogout={async () => {
            await signOut(auth);
            window.location.href = "/";
          }}
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

            {/* Products */}
            <section id="products" className="py-20 md:py-28 px-6 md:px-8 bg-[#fffbf0]">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 md:mb-20 space-y-4">
                  <h2 className="text-4xl md:text-6xl font-black text-zinc-900 font-cairo">
                    {t("products")}
                  </h2>
                  <div className="w-20 h-1.5 bg-[#d97706] mx-auto rounded-full"></div>
                  <p className="text-zinc-500 font-medium max-w-xl mx-auto">{t("hero_subtitle")}</p>
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

            {/* Contact */}
            <section id="contact" className="py-20 md:py-32 px-6 md:px-8 bg-white">
              <div className="max-w-7xl mx-auto bg-zinc-900 rounded-[3rem] p-8 md:p-16 lg:p-20 text-white relative overflow-hidden shadow-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
                  <div className="space-y-8">
                    <h2 className="text-4xl md:text-5xl font-black">{t("contact")}</h2>
                    <p className="text-zinc-400 text-lg leading-relaxed">
                      {lang === "ar"
                        ? "نحن هنا لمساعدتكم. تواصلوا معنا لطلب العسل أو للاستفسار عن منتجاتنا."
                        : "We are here to help. Contact us to order honey or inquire about our products."}
                    </p>
                  </div>

                  <div className="bg-white text-zinc-900 p-8 md:p-10 rounded-[2.5rem] shadow-2xl">
                    <ContactForm t={t} lang={lang} />
                  </div>
                </div>
              </div>
            </section>
          </main>

          <Footer t={t} lang={lang} onAdminClick={() => setIsLoginOpen(true)} />

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
            onSuccess={() => setIsLoginOpen(false)}
            t={t}
          />

          <OrderSuccessModal
            isOpen={isSuccessOpen}
            onClose={() => {
              setIsSuccessOpen(false);
              setRecentOrder(null);
            }}
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
