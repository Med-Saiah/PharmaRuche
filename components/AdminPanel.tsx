import React, { useState } from "react";
import { Order, Product, Language, Feedback } from "../types";

const LANGUAGES: Language[] = ["ar", "fr", "en"];
const EMPTY_TRANSLATIONS: Record<Language, string> = { ar: "", fr: "", en: "" };

interface AdminPanelProps {
  orders: Order[];
  feedbacks: Feedback[];
  products: Product[];

  onDeleteProduct: (id: string) => Promise<void> | void;
  onCreateProduct: (p: Omit<Product, "id">) => Promise<void>;
  onUpdateProduct: (id: string, p: Partial<Product>) => Promise<void>;

  onUpdateStatus: (id: string, s: Order["status"]) => Promise<void> | void;
  onLogout: () => Promise<void>;
  t: (key: string) => string;
  lang: Language;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  orders,
  products,
  feedbacks,
  onDeleteProduct,
  onCreateProduct,
  onUpdateProduct,
  onUpdateStatus,
  onLogout,
  t,
  lang,
}) => {
  const [view, setView] = useState<"dashboard" | "products">("dashboard");
  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: { ar: "", fr: "", en: "" },
    description: { ar: "", fr: "", en: "" },
    price: 0,
    image: "",
    category: "Honey",
  });

  const ensureTranslations = (value?: Partial<Record<Language, string>>) => ({
    ...EMPTY_TRANSLATIONS,
    ...(value || {}),
  });

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: { ...EMPTY_TRANSLATIONS },
      description: { ...EMPTY_TRANSLATIONS },
      price: 0,
      image: "",
      category: "Honey",
    });
    setIsAdding(false);
  };

  const handleChangeTranslation = (field: "name" | "description", langKey: Language, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...ensureTranslations(prev[field] as Partial<Record<Language, string>> | undefined),
        [langKey]: value,
      },
    }));
  };

  const handleDeleteProduct = async (id: string) => {
    const target = products.find((p) => p.id === id);
    const label = target?.name?.[lang] || target?.id || "this product";
    if (!window.confirm(`Delete ${label}?`)) return;

    setDeletingProductId(id);
    try {
      await onDeleteProduct(id);
    } catch (err) {
      console.error("Delete product failed:", err);
      alert("Unable to delete product. Check console for details.");
    } finally {
      setDeletingProductId(null);
    }
  };

  const handleStatusChange = async (id: string, status: Order["status"]) => {
    setStatusUpdatingId(id);
    try {
      await onUpdateStatus(id, status);
    } catch (err) {
      console.error("Status update failed:", err);
      alert("Failed to update order status. Check console for details.");
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const startEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      description: p.description,
      price: p.price,
      image: p.image,
      category: p.category,
    });
    setIsAdding(true);
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanImage = formData.image?.trim() || "https://via.placeholder.com/400";
    const payload: Omit<Product, "id"> = {
      name: ensureTranslations(formData.name as Partial<Record<Language, string>> | undefined),
      description: ensureTranslations(
        formData.description as Partial<Record<Language, string>> | undefined
      ),
      price: Math.abs(Number(formData.price ?? 0)),
      image: cleanImage,
      category: formData.category || "Honey",
    };

    const hasName = Object.values(payload.name).some((value) => value.trim().length > 0);
    if (!hasName) {
      alert("Please provide a name in at least one language.");
      return;
    }

    if (!payload.price || Number.isNaN(payload.price)) {
      alert("Price must be a valid number.");
      return;
    }

    setSavingProduct(true);
    try {
      if (editingProduct?.id) {
        await onUpdateProduct(editingProduct.id, payload);
      } else {
        await onCreateProduct(payload);
      }
      resetForm();
    } catch (err) {
      console.error("Product save failed:", err);
      alert("Failed to save product. Check console for details.");
    } finally {
      setSavingProduct(false);
    }
  };

  const totalRevenue = orders.reduce(
    (sum, order) => sum + (order.status !== "cancelled" ? order.total : 0),
    0
  );
  const pendingOrders = orders.filter((o) => o.status === "pending");
  const averageRating =
    feedbacks.length === 0
      ? 0
      : feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / feedbacks.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-50 font-montserrat text-zinc-900 pb-20">
      <nav className="bg-white text-zinc-900 shadow-md border-b border-zinc-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="Pharma Ruche" className="h-12 w-auto" />
                <div className="hidden md:block border-l border-zinc-200 pl-4">
                  <span className="block font-bold leading-none text-zinc-900">Admin Panel</span>
                  <span className="text-[9px] text-zinc-500 uppercase tracking-widest">
                    Dashboard
                  </span>
                </div>
              </div>

              <div className="hidden md:flex gap-2 bg-zinc-100 p-1.5 rounded-lg">
                <button
                  onClick={() => setView("dashboard")}
                  className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                    view === "dashboard"
                      ? "bg-[#d97706] text-white shadow-md"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200"
                  }`}
                >
                  📊 {t("dashboard")}
                </button>
                <button
                  onClick={() => setView("products")}
                  className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                    view === "products"
                      ? "bg-[#d97706] text-white shadow-md"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200"
                  }`}
                >
                  📦 {t("inventory")}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={onLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all shadow-md"
              >
                🚪 Logout
              </button>
            </div>
          </div>

          <div className="flex md:hidden gap-2 pb-4 pt-4 border-t border-zinc-100">
            <button
              onClick={() => setView("dashboard")}
              className={`flex-1 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                view === "dashboard" ? "bg-[#d97706] text-white shadow-md" : "bg-zinc-100 text-zinc-600"
              }`}
            >
              📊 {t("dashboard")}
            </button>
            <button
              onClick={() => setView("products")}
              className={`flex-1 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                view === "products" ? "bg-[#d97706] text-white shadow-md" : "bg-zinc-100 text-zinc-600"
              }`}
            >
              📦 {t("inventory")}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h1 className="text-4xl font-bold text-zinc-900">
              🏢 {view === "dashboard" ? t("dashboard") : t("inventory")}
            </h1>
            <p className="text-base text-zinc-600 font-medium mt-3">
              Welcome back! You have{" "}
              <span className="text-[#d97706] font-bold text-lg">{pendingOrders.length} pending orders</span>{" "}
              to manage.
            </p>
          </div>

          {view === "products" && (
            <button
              onClick={() => {
                setEditingProduct(null);
                setFormData({
                  name: { ar: "", fr: "", en: "" },
                  description: { ar: "", fr: "", en: "" },
                  price: 0,
                  image: "",
                  category: "Honey",
                });
                setIsAdding(true);
              }}
              className="bg-[#d97706] hover:bg-[#b45309] text-white px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <span>➕</span> Add Product
            </button>
          )}
        </div>

        {view === "dashboard" && (
          <div className="space-y-10 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-white to-green-50 p-8 rounded-2xl shadow-sm border border-green-100 flex flex-col justify-between h-44 hover:shadow-md transition-all">
                <div className="flex justify-between items-start">
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{t("stats_revenue")}</p>
                  <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center text-xl">
                    💰
                  </div>
                </div>
                <div>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-5xl font-black text-green-700">{totalRevenue.toLocaleString()}</span>
                    <span className="text-base font-bold text-zinc-500">{t("currency")}</span>
                  </div>
                  <p className="text-xs text-green-600 font-semibold">✓ All-time revenue</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-2xl shadow-sm border border-blue-100 flex flex-col justify-between h-44 hover:shadow-md transition-all">
                <div className="flex justify-between items-start">
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{t("stats_orders")}</p>
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
                    📦
                  </div>
                </div>
                <div>
                  <span className="text-5xl font-black text-blue-700 block mb-1">{orders.length}</span>
                  <p className="text-xs text-blue-600 font-semibold">Total orders received</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white to-amber-50 p-8 rounded-2xl shadow-sm border border-amber-100 flex flex-col justify-between h-44 hover:shadow-md transition-all">
                <div className="flex justify-between items-start">
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{t("stats_pending")}</p>
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-xl">
                    🔔
                  </div>
                </div>
                <div>
                  <span
                    className={`text-5xl font-black block mb-1 ${
                      pendingOrders.length > 0 ? "text-amber-700" : "text-zinc-900"
                    }`}
                  >
                    {pendingOrders.length}
                  </span>
                  <p className="text-xs text-amber-600 font-semibold">Awaiting action</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white to-purple-50 p-8 rounded-2xl shadow-sm border border-purple-100 flex flex-col justify-between h-44 hover:shadow-md transition-all">
                <div className="flex justify-between items-start">
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{t("feedback")}</p>
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-xl">
                    ⭐
                  </div>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-zinc-100">
                <div className="flex items-center justify-between p-6 border-b border-zinc-100">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Recent Orders</p>
                    <h3 className="text-2xl font-bold text-zinc-900">📑 Order List</h3>
                  </div>
                  <span className="text-sm px-3 py-1 rounded-full bg-zinc-100 text-zinc-600 font-semibold">
                    {orders.length} total
                  </span>
                </div>

                {orders.length === 0 ? (
                  <p className="p-8 text-zinc-500 text-sm">No orders yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] text-left text-sm">
                      <thead className="bg-zinc-50 text-[11px] uppercase tracking-[0.2em] text-zinc-500 font-bold">
                        <tr>
                          <th className="p-4">Customer</th>
                          <th className="p-4">Details</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                        {orders.map((o) => (
                          <tr key={o.id} className="hover:bg-zinc-50">
                            <td className="p-4 align-top">
                              <div className="font-bold text-zinc-900">{o.customerName}</div>
                              <div className="text-xs text-zinc-500">{o.phone}</div>
                              <div className="text-xs text-zinc-500">
                                {o.address} · {o.wilaya}
                              </div>
                              <div className="text-[11px] text-zinc-400 mt-1 font-mono">ID: {o.id}</div>
                            </td>
                            <td className="p-4 align-top">
                              <ul className="space-y-1 text-sm text-zinc-700">
                                {o.items.map((item) => (
                                  <li key={`${o.id}-${item.id}`} className="flex justify-between gap-3">
                                    <span className="font-medium">{item.name?.[lang] ?? item.name?.en}</span>
                                    <span className="text-xs text-zinc-500 font-mono">
                                      × {item.quantity} · {item.price} {t("currency")}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </td>
                            <td className="p-4 align-top">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${
                                    o.status === "pending"
                                      ? "bg-amber-100 text-amber-700"
                                      : o.status === "delivered"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {o.status}
                                </span>
                              </div>
                              <select
                                className="mt-3 w-full rounded-lg border border-zinc-200 bg-white p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d97706]"
                                value={o.status}
                                disabled={statusUpdatingId === o.id}
                                onChange={(e) => handleStatusChange(o.id, e.target.value as Order["status"])}
                              >
                                <option value="pending">Pending</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                              {statusUpdatingId === o.id && (
                                <p className="text-[11px] text-zinc-500 mt-1">Updating...</p>
                              )}
                            </td>
                            <td className="p-4 text-right align-top font-bold text-zinc-900">
                              {o.total} {t("currency")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-zinc-100">
                <div className="p-6 border-b border-zinc-100">
                  <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Latest feedback</p>
                  <h3 className="text-2xl font-bold text-zinc-900">⭐ Customer Voices</h3>
                </div>

                {feedbacks.length === 0 ? (
                  <p className="p-6 text-zinc-500 text-sm">No feedback yet.</p>
                ) : (
                  <ul className="divide-y divide-zinc-100">
                    {feedbacks.map((fb) => (
                      <li key={fb.id} className="p-5 space-y-2">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-bold text-zinc-900">{fb.customerName}</p>
                            <p className="text-xs text-zinc-500">Order: {fb.orderId}</p>
                          </div>
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-700 px-3 py-1 text-xs font-bold">
                            ⭐ {fb.rating}/5
                          </span>
                        </div>
                        <p className="text-sm text-zinc-700 leading-relaxed">{fb.comment}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        {view === "products" && (
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
                  {products.map((p) => (
                    <tr key={p.id} className="group hover:bg-zinc-50 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-xl bg-zinc-100 overflow-hidden border border-zinc-200">
                            <img src={p.image} className="w-full h-full object-cover" alt="" />
                          </div>
                          <div>
                            <div className="font-bold text-zinc-900 text-base">{p.name?.[lang] ?? ""}</div>
                            <div className="text-xs text-zinc-400 font-mono mt-1">ID: {p.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="inline-block px-3 py-1 bg-zinc-100 rounded-full text-[10px] font-bold uppercase text-zinc-500 tracking-wider">
                          {p.category}
                        </span>
                      </td>
                      <td className="p-6 font-mono font-black text-zinc-900">
                        {p.price} {t("currency")}
                      </td>
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
                            onClick={() => handleDeleteProduct(p.id)}
                            disabled={deletingProductId === p.id}
                            className="w-10 h-10 rounded-lg bg-red-50 text-red-500 hover:bg-red-600 hover:text-white flex items-center justify-center transition-all hover:shadow-md disabled:opacity-50"
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

      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-zinc-900/70 backdrop-blur-sm transition-opacity"
            onClick={() => setIsAdding(false)}
          ></div>

          <div className="bg-white w-full max-w-lg sm:max-w-2xl rounded-3xl p-6 sm:p-10 relative z-10 shadow-2xl animate-in zoom-in-95 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-bold text-zinc-900">
                {editingProduct ? "✏️ Edit Product" : "➕ Add New Product"}
              </h3>
              <button
                onClick={() => setIsAdding(false)}
                className="w-10 h-10 rounded-full bg-zinc-100 text-zinc-500 hover:bg-red-100 hover:text-red-600 font-bold flex items-center justify-center transition-all text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitProduct} className="space-y-6">
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-500">Names</p>
                <div className="grid md:grid-cols-3 gap-4">
                  {LANGUAGES.map((lng) => (
                    <div key={lng} className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-600">
                        Product name ({lng.toUpperCase()})
                      </label>
                      <input
                        value={formData.name?.[lng] ?? ""}
                        onChange={(e) => handleChangeTranslation("name", lng, e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d97706]"
                        placeholder="Enter name"
                        disabled={savingProduct}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-500">Descriptions</p>
                <div className="grid md:grid-cols-3 gap-4">
                  {LANGUAGES.map((lng) => (
                    <div key={lng} className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-600">
                        Description ({lng.toUpperCase()})
                      </label>
                      <textarea
                        value={formData.description?.[lng] ?? ""}
                        onChange={(e) => handleChangeTranslation("description", lng, e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d97706]"
                        rows={3}
                        placeholder="Short description"
                        disabled={savingProduct}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-600">Price ({t("currency")})</label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={formData.price ?? 0}
                    onChange={(e) => setFormData((prev) => ({ ...prev, price: Number(e.target.value) }))}
                    className="w-full rounded-xl border border-zinc-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d97706]"
                    disabled={savingProduct}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-600">Category</label>
                  <select
                    className="w-full rounded-xl border border-zinc-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d97706]"
                    value={formData.category ?? "Honey"}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    disabled={savingProduct}
                  >
                    <option value="Honey">Honey</option>
                    <option value="Supplements">Supplements</option>
                    <option value="Oils">Oils</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-600">Image URL</label>
                  <input
                    type="url"
                    value={formData.image ?? ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                    className="w-full rounded-xl border border-zinc-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d97706]"
                    placeholder="https://..."
                    disabled={savingProduct}
                  />
                  <p className="text-[11px] text-zinc-500">Leave blank to use a placeholder.</p>
                </div>
              </div>

              <div className="flex gap-4 pt-8">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-5 bg-zinc-100 text-zinc-700 font-bold rounded-2xl uppercase tracking-widest text-xs hover:bg-zinc-200 transition-all"
                  disabled={savingProduct}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-5 bg-[#d97706] text-white font-bold rounded-2xl shadow-lg hover:bg-[#b45309] hover:shadow-xl transition-all uppercase tracking-widest text-xs disabled:opacity-70"
                  disabled={savingProduct}
                >
                  {savingProduct
                    ? "Saving..."
                    : editingProduct
                    ? "💾 Save Changes"
                    : "➕ Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
