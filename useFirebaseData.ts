import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { auth, db } from "./firebase";
import { Product, Order, Feedback } from "./types";
import {
  addProduct as addProductToFirestore,
  updateProduct as updateProductInFirestore,
  deleteProduct as deleteProductFromFirestore,
  addOrder as addOrderToFirestore,
  updateOrderStatus as updateOrderStatusInFirestore,
  addFeedback as addFeedbackToFirestore,
} from "./firebaseService";

export const useFirebaseData = () => {
  const adminAllowList = useMemo(
    () =>
      (import.meta.env.VITE_ADMIN_EMAILS || "")
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean),
    []
  );

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(true);

  const isAdmin = useMemo(() => {
    if (!currentUser) return false;
    const email = currentUser.email?.toLowerCase();
    if (!email) return false;
    if (adminAllowList.length === 0) return false; // safer default: require explicit allowlist
    return adminAllowList.includes(email);
  }, [currentUser, adminAllowList]);
  const loading = loadingProducts || loadingOrders || loadingFeedbacks;

  // Auth
  useEffect(() => {
    return onAuthStateChanged(auth, (user) => setCurrentUser(user));
  }, []);

  // Products (realtime)
  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    return onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Product[];
        setProducts(list);
        setLoadingProducts(false);
      },
      (err) => {
        console.error("Products snapshot error:", err);
        setLoadingProducts(false);
      }
    );
  }, []);

  // Orders (realtime, admin only)
  useEffect(() => {
    if (!isAdmin) {
      setOrders([]);
      setLoadingOrders(false);
      return;
    }

    setLoadingOrders(true);
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));

    return onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Order[];
        setOrders(list);
        setLoadingOrders(false);
      },
      (err) => {
        console.error("Orders snapshot error:", err);
        setLoadingOrders(false);
      }
    );
  }, [isAdmin]);

  // Feedbacks (realtime)
  useEffect(() => {
    const q = query(collection(db, "feedbacks"), orderBy("createdAt", "desc"));
    return onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Feedback[];
        setFeedbacks(list);
        setLoadingFeedbacks(false);
      },
      (err) => {
        console.error("Feedbacks snapshot error:", err);
        setLoadingFeedbacks(false);
      }
    );
  }, []);

  // CRUD
  const addProduct = async (product: Omit<Product, "id">) => addProductToFirestore(product);
  const updateProduct = async (id: string, product: Partial<Product>) =>
    updateProductInFirestore(id, product);
  const deleteProduct = async (id: string) => deleteProductFromFirestore(id);

  const addOrder = async (order: Omit<Order, "id">) => addOrderToFirestore(order);
  const updateOrderStatus = async (id: string, status: Order["status"]) =>
    updateOrderStatusInFirestore(id, status);

  const addFeedback = async (feedback: Omit<Feedback, "id">) => addFeedbackToFirestore(feedback);

  return {
    products,
    orders,
    feedbacks,
    currentUser,
    isAdmin,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    addOrder,
    updateOrderStatus,
    addFeedback,
  };
};
