
import { Product, TranslationStrings } from './types';

export const WILAYAS = [
  "01 Adrar", "02 Chlef", "03 Laghouat", "04 Oum El Bouaghi", "05 Batna", "06 Béjaïa", "07 Biskra", 
  "08 Béchar", "09 Blida", "10 Bouira", "11 Tamanrasset", "12 Tébessa", "13 Tlemcen", "14 Tiaret", 
  "15 Tizi Ouzou", "16 Alger", "17 Djelfa", "18 Jijel", "19 Sétif", "20 Saïda", "21 Skikda", 
  "22 Sidi Bel Abbès", "23 Annaba", "24 Guelma", "25 Constantine", "26 Médéa", "27 Mostaganem", 
  "28 M'Sila", "29 Mascara", "30 Ouargla", "31 Oran", "32 El Bayadh", "33 Illizi", "34 Bordj Bou Arreridj", 
  "35 Boumerdès", "36 El Tarf", "37 Tindouf", "38 Tissemsilt", "39 El Oued", "40 Khenchela", 
  "41 Souk Ahras", "42 Tipaza", "43 Mila", "44 Aïn Defla", "45 Naâma", "46 Aïn Témouchent", 
  "47 Ghardaïa", "48 Relizane"
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'PR-EUC-500',
    name: { ar: 'عسل الكاليتوس - 500غ', fr: 'Miel d\'Eucalyptus - 500g', en: 'Eucalyptus Honey - 500g' },
    description: { 
      ar: 'عسل طبيعي 100% مستخلص من أزهار الكاليتوس في غابات الجزائر. مذاق مميز وفوائد عظيمة.', 
      fr: 'Miel 100% naturel extrait des fleurs d\'eucalyptus des forêts algériennes.', 
      en: '100% natural honey extracted from eucalyptus flowers in Algerian forests.' 
    },
    price: 2800,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800',
    category: 'Honey'
  },
  {
    id: 'PR-SDR-250',
    name: { ar: 'عسل السدر الملكي - 250غ', fr: 'Miel de Jujubier Royal - 250g', en: 'Royal Sidr Honey - 250g' },
    description: { 
      ar: 'الذهب السائل. عسل سدر فاخر، قوام كثيف وطعم لا يقاوم. من أجود ما تنتجه مناحلنا.', 
      fr: 'L\'Or liquide. Miel de jujubier premium, texture dense et goût irrésistible.', 
      en: 'Liquid gold. Premium Sidr honey, dense texture and irresistible taste.' 
    },
    price: 4500,
    image: 'https://images.unsplash.com/photo-1612475498348-e77e31e635d1?auto=format&fit=crop&q=80&w=800',
    category: 'Honey'
  },
  {
    id: 'PR-POL-100',
    name: { ar: 'حبوب الطلع - 100غ', fr: 'Pollen d\'Abeille - 100g', en: 'Bee Pollen - 100g' },
    description: { 
      ar: 'كنز الفيتامينات. حبوب طلع طازجة تم جمعها بعناية لتعزيز طاقتك اليومية.', 
      fr: 'Trésor de vitamines. Pollen frais récolté avec soin pour booster votre énergie.', 
      en: 'Vitamin treasure. Fresh pollen carefully collected to boost your daily energy.' 
    },
    price: 1200,
    image: 'https://images.unsplash.com/photo-1555447405-058428d6964d?auto=format&fit=crop&q=80&w=800',
    category: 'Supplements'
  }
];

export const TRANSLATIONS: TranslationStrings = {
  shop_name: { ar: 'فارما روش', fr: 'Pharma Ruche', en: 'Pharma Ruche' },
  tagline: { ar: 'من الطبيعة إليك', fr: 'De la Nature à Vous', en: 'Pure & Organic' },
  home: { ar: 'الرئيسية', fr: 'Accueil', en: 'Home' },
  products: { ar: 'المنتجات', fr: 'Nos Produits', en: 'Our Products' },
  reviews: { ar: 'آراء العملاء', fr: 'Témoignages', en: 'Reviews' },
  contact: { ar: 'اتصل بنا', fr: 'Contact', en: 'Contact' },
  add_to_cart: { ar: 'إضافة للسلة', fr: 'Ajouter au panier', en: 'Add to Cart' },
  checkout: { ar: 'الدفع', fr: 'Commander', en: 'Checkout' },
  cart: { ar: 'سلة المشتريات', fr: 'Mon Panier', en: 'My Cart' },
  total: { ar: 'المجموع', fr: 'Total', en: 'Total' },
  full_name: { ar: 'الاسم الكامل', fr: 'Nom complet', en: 'Full Name' },
  phone: { ar: 'رقم الهاتف', fr: 'Téléphone', en: 'Phone' },
  wilaya: { ar: 'الولاية', fr: 'Wilaya', en: 'Province' },
  address: { ar: 'العنوان', fr: 'Adresse de livraison', en: 'Delivery Address' },
  confirm_order: { ar: 'تأكيد الطلب', fr: 'Confirmer la commande', en: 'Confirm Order' },
  currency: { ar: 'دج', fr: 'DA', en: 'DZD' },
  hero_title: { ar: 'عسل طبيعي، نقي 100%', fr: 'Miel Pur & Naturel', en: '100% Pure Honey' },
  hero_subtitle: { ar: 'من قلب الطبيعة الجزائرية، نقدم لكم أجود منتجات الخلية. خالية من الإضافات، غنية بالفوائد.', fr: 'Du cœur de la nature algérienne, le meilleur de la ruche. Sans additifs, riche en bienfaits.', en: 'From the heart of Algerian nature, the best of the hive. No additives, rich in benefits.' },
  admin_panel: { ar: 'لوحة التحكم', fr: 'Gestion Boutique', en: 'Shop Manager' },
  orders: { ar: 'الطلبات', fr: 'Commandes', en: 'Orders' },
  status_pending: { ar: 'جديد', fr: 'Nouveau', en: 'New' },
  status_delivered: { ar: 'تم التسليم', fr: 'Livré', en: 'Delivered' },
  empty_cart: { ar: 'سلتك فارغة', fr: 'Votre panier est vide', en: 'Your cart is empty' },
  login: { ar: 'دخول الموظفين', fr: 'Accès Staff', en: 'Staff Login' },
  password: { ar: 'كلمة المرور', fr: 'Mot de passe', en: 'Password' },
  back_to_shop: { ar: 'العودة للمتجر', fr: 'Retour au site', en: 'Back to Shop' },
  about_us: { ar: 'قصتنا', fr: 'Notre Histoire', en: 'Our Story' },
  stats_revenue: { ar: 'المبيعات', fr: 'Chiffre d\'Affaires', en: 'Revenue' },
  stats_orders: { ar: 'الطلبات', fr: 'Commandes', en: 'Orders' },
  stats_pending: { ar: 'قيد المعالجة', fr: 'En Cours', en: 'Pending' },
  order_success_title: { ar: 'تم استلام طلبك بنجاح!', fr: 'Commande Reçue !', en: 'Order Received!' },
  order_success_desc: { ar: 'شكراً لثقتك في منتجاتنا. سنتصل بك قريباً لتأكيد التوصيل.', fr: 'Merci pour votre confiance. Nous vous appellerons bientôt pour la livraison.', en: 'Thank you for trusting us. We will call you shortly for delivery.' },
  close: { ar: 'إغلاق', fr: 'Fermer', en: 'Close' },
  admin_access: { ar: 'إدارة المتجر', fr: 'Administration', en: 'Admin' },
  inventory: { ar: 'المخزون', fr: 'Stock', en: 'Inventory' },
  dashboard: { ar: 'نظرة عامة', fr: 'Vue d\'ensemble', en: 'Overview' }
};
