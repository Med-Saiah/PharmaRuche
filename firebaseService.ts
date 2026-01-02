import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { Product, Order, Feedback } from "./types";

const PRODUCTS_COLLECTION = "products";
const ORDERS_COLLECTION = "orders";
const FEEDBACKS_COLLECTION = "feedbacks";

// --------------------
// Products
// --------------------
export const getAllProducts = async (): Promise<Product[]> => {
  const q = query(collection(db, PRODUCTS_COLLECTION), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...(d.data() as any), id: d.id } as Product));
};

export const addProduct = async (product: Omit<Product, "id">): Promise<string> => {
  const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
    ...product,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateProduct = async (id: string, product: Partial<Product>): Promise<void> => {
  await updateDoc(doc(db, PRODUCTS_COLLECTION, id), product);
};

export const deleteProduct = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
};

// --------------------
// Orders
// --------------------
export const getAllOrders = async (): Promise<Order[]> => {
  const q = query(collection(db, ORDERS_COLLECTION), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) } as Order));
};

export const addOrder = async (order: Omit<Order, "id">): Promise<string> => {
  const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
    ...order,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateOrderStatus = async (id: string, status: Order["status"]): Promise<void> => {
  await updateDoc(doc(db, ORDERS_COLLECTION, id), { status });
};

// --------------------
// Feedbacks
// --------------------
export const getAllFeedbacks = async (): Promise<Feedback[]> => {
  const q = query(collection(db, FEEDBACKS_COLLECTION), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) } as Feedback));
};

export const addFeedback = async (feedback: Omit<Feedback, "id">): Promise<string> => {
  const docRef = await addDoc(collection(db, FEEDBACKS_COLLECTION), {
    ...feedback,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};


