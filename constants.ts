
import { Category } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'bovinos',
    label: 'BOVINOS',
    showMainOffer: true,
    showSideOffers: true,
    offerImage: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&q=80&w=800',
    offerItemName: 'PICANHA CONG. FRIBOI',
    offerPrice: 89.60,
    items: [
      { id: 'b1', name: 'Coração Bovino', price: 13.49, unit: 'kg' },
      { id: 'b2', name: 'Ossada Bovina', price: 8.99, unit: 'kg' },
      { id: 'b3', name: 'Carne com Osso', price: 24.29, unit: 'kg' },
      { id: 'b4', name: 'Fígado Bovino', price: 18.49, unit: 'kg' },
      { id: 'b5', name: 'Picanha Congelada Friboi', price: 89.60, unit: 'kg', isOffer: true },
      { id: 'b6', name: 'Ossada da Alcatra', price: 21.99, unit: 'kg' },
      { id: 'b7', name: 'Chambaril', price: 21.79, unit: 'kg' },
      { id: 'b8', name: 'Carne de Sol', price: 49.99, unit: 'kg' },
      { id: 'b9', name: 'Bife Light', price: 49.90, unit: 'kg' },
      { id: 'b10', name: 'Coxão Mole Friboi', price: 45.00, unit: 'kg' },
      { id: 'b11', name: 'Coxão Duro Friboi', price: 36.50, unit: 'kg' },
      { id: 'b12', name: 'Carne Maciça', price: 28.39, unit: 'kg' }
    ]
  },
  {
    id: 'suinos',
    label: 'SUÍNOS',
    showMainOffer: true,
    showSideOffers: true,
    offerImage: 'https://images.unsplash.com/photo-1602491673980-73aa38de027a?auto=format&fit=crop&q=80&w=800',
    offerItemName: 'COSTELA SUÍNA',
    offerPrice: 21.99,
    items: [
      { id: 's1', name: 'Bisteca Suína', price: 18.99, unit: 'kg' },
      { id: 's2', name: 'Costela Suína', price: 21.99, unit: 'kg', isOffer: true },
      { id: 's3', name: 'Pé de Porco', price: 11.99, unit: 'kg' },
      { id: 's4', name: 'Toucinho', price: 24.00, unit: 'kg' },
      { id: 's5', name: 'Lombo Suíno', price: 30.00, unit: 'kg' },
      { id: 's6', name: 'Kit Feijoada', price: 26.00, unit: 'kg' }
    ]
  },
  {
    id: 'aves',
    label: 'AVES',
    showMainOffer: true,
    showSideOffers: true,
    offerImage: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&q=80&w=800',
    offerItemName: 'COXINHA DA ASA',
    offerPrice: 19.99,
    items: [
      { id: 'a1', name: 'Coxa e Sobrecoxa', price: 13.49, unit: 'kg' },
      { id: 'a2', name: 'Filé de Peito', price: 24.30, unit: 'kg' },
      { id: 'a3', name: 'Tulipa', price: 30.99, unit: 'kg' },
      { id: 'a4', name: 'Coxinha da Asa', price: 19.99, unit: 'kg', isOffer: true },
      { id: 'a5', name: 'Coxinha Asa Temperada', price: 25.99, unit: 'kg' }
    ]
  },
  {
    id: 'embutidos',
    label: 'EMBUTIDOS',
    showMainOffer: true,
    showSideOffers: true,
    offerImage: 'https://images.unsplash.com/photo-1541048612927-b2446263de3d?auto=format&fit=crop&q=80&w=800',
    offerItemName: 'CALABRESA PERDIGÃO',
    offerPrice: 34.99,
    items: [
      { id: 'e1', name: 'Salsicha Freado', price: 8.99, unit: 'kg' },
      { id: 'e2', name: 'Toscana Suína', price: 21.99, unit: 'kg' },
      { id: 'e3', name: 'Toscana Frimesa', price: 21.99, unit: 'kg' },
      { id: 'e4', name: 'Toscana Apimentada', price: 25.99, unit: 'kg' },
      { id: 'e5', name: 'Calabresa Seara', price: 31.49, unit: 'kg' },
      { id: 'e6', name: 'Calabresa Frimesa', price: 25.50, unit: 'kg' },
      { id: 'e7', name: 'Calabresa Estrela', price: 25.50, unit: 'kg' },
      { id: 'e8', name: 'Calabresa Aurora', price: 27.99, unit: 'kg' },
      { id: 'e9', name: 'Calabresa Perdigão', price: 34.99, unit: 'kg', isOffer: true },
      { id: 'e10', name: 'Salsicha Perdigão', price: 15.70, unit: 'kg' },
      { id: 'e11', name: 'Salsicha Seara', price: 14.99, unit: 'kg' },
      { id: 'e12', name: 'Salsicha Lebom', price: 11.49, unit: 'kg' }
    ]
  }
];
