
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number; // Preço original para mostrar o desconto
  unit: 'kg' | 'un' | 'band';
  isOffer?: boolean;
}

export interface Category {
  id: string;
  label: string;
  items: MenuItem[];
  offerImage?: string;
  offerItemName?: string;
  offerPrice?: number;
}

export type ViewMode = 'display' | 'admin';
