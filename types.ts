
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
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
  showMainOffer?: boolean;
  showSideOffers?: boolean;
}

export type ViewMode = 'display' | 'admin' | 'remote';

export interface SyncMessage {
  type: 'UPDATE_CATEGORY' | 'FORCE_REFRESH';
  payload: any;
}
