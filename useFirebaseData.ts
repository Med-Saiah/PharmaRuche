import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import { Product, Order, Feedback } from "./types";
import {
  addProduct as addProductToFirestore,
  updateProduct as updateProductInFirestore,
  deleteProduct as deleteProductFromFirestore,
  addOrder as addOrderToFirestore,
  updateOrderStatus as updateOrderStatusInFirestore,
  addFeedback as addFeedbackToFirestore,
  seedInitialData,
} from "./firebaseService";
import { INITIAL_PRODUCTS } from "./constants";

/**
 * Safe mapper: Firestore doc -> Product
 * - Ensures `id` is present
 * - Avoids UI crash when old/incorrect docs exist
 */
function mapProductDoc(doc: QueryDocumentSnapshot<DocumentData>): Product {
  const data = doc.data() as Partial<Product>;

  // Normalize multilingual fields (some docs may have string instead of map)
  const normalizeI18n = (v: any) => {
    if (!v) return { ar: "", en: "", fr: "" };
    if (typeof v === "string") return { ar: v, en: v, fr: v };
    return {
      ar: v.ar ?? "",
      en: v.en ?? "",
      fr: v.fr ?? "",
    };
  };

  return {
    id: doc.id, // ✅ always use Firestore document id
    name: normalizeI18n((data as any).name),
    description: normalizeI18n((data as any).description),
    category: (data as any).category ?? "Honey",
    price: typeof (data as any).price === "number" ? (data as any).price : 0,
    image: (data as any).image ?? "",
    // If your Product type has more fields, keep them here safely:
    ...Object.fromEntries(
      Object.entries(data as any).filter(([key]) => key !== "id")
    ),
  } as Product;
}

function mapOrderDoc(doc: QueryDocumentSnapshot<DocumentData>): Order {
  return { id: doc.id, ...(doc.data() as any) } as Order;
}

function mapFeedbackDoc(doc: QueryDocumentSnapshot<DocumentData>): Feedback {
  return { id: doc.id, ...(doc.data() as any) } as Feedback;
}

export const useFirebaseData = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(true);

  const isAdmin = useMemo(() => !!currentUser, [currentUser]);
  const loading = loadingProducts || loadingFeedbacks || loadingOrders;

  // -------------------------
  // Auth
  // -------------------------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  // -------------------------
  // Products (realtime)
  // -------------------------
  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("price", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const productsData = snapshot.docs.map(mapProductDoc);

        setProducts(productsData);
        setLoadingProducts(false);
      },
      (error) => {
        console.error("Error loading products:", error);

        // Fallback only if Firestore truly fails (offline / perms)
        setProducts(INITIAL_PRODUCTS);
        setLoadingProducts(false);
      }
    );

    return unsubscribe;
  }, []);

  // -------------------------
  // Orders (realtime, admin only)
  // -------------------------
  useEffect(() => {
    if (!currentUser) {
      setOrders([]);
      setLoadingOrders(false);
      return;
    }

    setLoadingOrders(true);

    const q = query(collection(db, "orders"), orderBy("date", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setOrders(snapshot.docs.map(mapOrderDoc));
        setLoadingOrders(false);
      },
      (error) => {
        console.error("Error loading orders:", error);
        setLoadingOrders(false);
      }
    );

    return unsubscribe;
  }, [currentUser]);

  // -------------------------
  // Feedbacks (realtime)
  // -------------------------
  useEffect(() => {
    const q = query(collection(db, "feedbacks"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setFeedbacks(snapshot.docs.map(mapFeedbackDoc));
        setLoadingFeedbacks(false);
      },
      (error) => {
        console.error("Error loading feedbacks:", error);
        setLoadingFeedbacks(false);
      }
    );

    return unsubscribe;
  }, []);

  // -------------------------
  // Seed initial products (admin only)
  // -------------------------
  useEffect(() => {
    // Only seed when:
    // - products finished loading
    // - admin logged in (rules allow write)
    // - products is empty
    if (!loadingProducts && isAdmin && products.length === 0) {
      console.log("Seeding initial products...");
      seedInitialData(INITIAL_PRODUCTS).catch((error) => {
        console.error("Error seeding products:", error);
      });
    }
  }, [loadingProducts, isAdmin, products.length]);

  // -------------------------
  // Product operations
  // -------------------------
  const addProduct = async (product: Omit<Product, "id">) => {
    await addProductToFirestore(product);
  };

  const updateProduct = async (id: string, product: Partial<Product>) => {
    await updateProductInFirestore(id, product);
  };

  const deleteProduct = async (id: string) => {
    await deleteProductFromFirestore(id);
  };

  // -------------------------
  // Order operations
  // -------------------------
  const addOrder = async (order: Omit<Order, "id">) => {
    return await addOrderToFirestore(order);
  };

  const updateOrderStatus = async (id: string, status: Order["status"]) => {
    await updateOrderStatusInFirestore(id, status);
  };

  // -------------------------
  // Feedback operations
  // -------------------------
  const addFeedback = async (feedback: Omit<Feedback, "id">) => {
    await addFeedbackToFirestore(feedback);
  };

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
