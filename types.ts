
export type Language = 'ar' | 'fr' | 'en';

export interface Product {
  id: string;
  name: { [key in Language]: string };
  description: { [key in Language]: string };
  price: number;
  image: string;
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  wilaya: string;
  address: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'delivered' | 'cancelled';
  date: string;
}

export interface TranslationStrings {
  [key: string]: { [key in Language]: string };
}
