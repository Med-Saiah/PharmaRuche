import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy,
  Timestamp,
  setDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { Product, Order, Feedback } from './types';

// Collections
const PRODUCTS_COLLECTION = 'products';
const ORDERS_COLLECTION = 'orders';
const FEEDBACKS_COLLECTION = 'feedbacks';

// Products
export const getAllProducts = async (): Promise<Product[]> => {
  const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
  return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Product));
};

export const addProduct = async (product: Omit<Product, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), product);
  return docRef.id;
};

export const updateProduct = async (id: string, product: Partial<Product>): Promise<void> => {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  await updateDoc(docRef, product);
};

export const deleteProduct = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
};

// Orders
export const getAllOrders = async (): Promise<Order[]> => {
  const q = query(collection(db, ORDERS_COLLECTION), orderBy('date', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as unknown as Order));
};

export const addOrder = async (order: Omit<Order, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, ORDERS_COLLECTION), order);
  return docRef.id;
};

export const updateOrderStatus = async (id: string, status: Order['status']): Promise<void> => {
  const docRef = doc(db, ORDERS_COLLECTION, id);
  await updateDoc(docRef, { status });
};

// Feedbacks
export const getAllFeedbacks = async (): Promise<Feedback[]> => {
  const q = query(collection(db, FEEDBACKS_COLLECTION), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as unknown as Feedback));
};

export const addFeedback = async (feedback: Omit<Feedback, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, FEEDBACKS_COLLECTION), feedback);
  return docRef.id;
};

// Initial data seeding (run once)
export const seedInitialData = async (products: Product[]): Promise<void> => {
  const existingProducts = await getAllProducts();
  if (existingProducts.length === 0) {
    for (const product of products) {
      const { id, ...productData } = product;
      await setDoc(doc(db, PRODUCTS_COLLECTION, id), productData);
    }
  }
};
