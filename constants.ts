
import { Category } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'bovinos',
    label: 'BOVINOS (CARNE DE PRIMEIRA)',
    offerImage: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&q=80&w=800',
    offerItemName: 'PICANHA ARGENTINA',
    offerPrice: 79.90,
    items: [
      { id: 'b1', name: 'PICANHA PREMIUM', price: 79.90, originalPrice: 89.90, unit: 'kg', isOffer: true },
      { id: 'b2', name: 'CONTRA FILÉ NOBRE', price: 42.90, originalPrice: 48.00, unit: 'kg', isOffer: true },
      { id: 'b3', name: 'ALCATRA C/ MAM.', price: 44.90, unit: 'kg' },
      { id: 'b4', name: 'FILÉ MIGNON', price: 68.00, unit: 'kg' },
      { id: 'b5', name: 'MAMINHA', price: 39.90, unit: 'kg' },
      { id: 'b6', name: 'FRALDINHA', price: 36.50, originalPrice: 39.90, unit: 'kg', isOffer: true },
      { id: 'b7', name: 'COXÃO MOLE', price: 38.90, unit: 'kg' },
      { id: 'b8', name: 'PATINHO', price: 37.00, unit: 'kg' },
      { id: 'b9', name: 'ACÉM MOÍDO', price: 28.90, unit: 'kg' },
      { id: 'b10', name: 'MÚSCULO', price: 26.50, unit: 'kg' },
    ]
  },
  {
    id: 'suinos',
    label: 'SUÍNOS (CORTES ESPECIAIS)',
    offerImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800',
    offerItemName: 'COSTELINHA SUÍNA',
    offerPrice: 28.90,
    items: [
      { id: 's1', name: 'COSTELINHA RIBS', price: 28.90, originalPrice: 34.00, unit: 'kg', isOffer: true },
      { id: 's2', name: 'LOMBO SUÍNO', price: 24.90, unit: 'kg' },
      { id: 's3', name: 'PERNIL C/ PELE', price: 16.90, originalPrice: 19.90, unit: 'kg', isOffer: true },
      { id: 's4', name: 'PANCETA CROCANTE', price: 29.90, unit: 'kg' },
      { id: 's5', name: 'COPA LOMBO', price: 22.00, unit: 'kg' },
      { id: 's6', name: 'BACON DEFUMADO', price: 42.00, unit: 'kg' },
      { id: 's7', name: 'PALETA SUÍNA', price: 15.50, unit: 'kg' },
    ]
  },
  {
    id: 'aves',
    label: 'AVES E DERIVADOS',
    offerImage: 'https://images.unsplash.com/photo-1606728035253-49df886300ed?auto=format&fit=crop&q=80&w=800',
    offerItemName: 'FILÉ DE FRANGO',
    offerPrice: 18.90,
    items: [
      { id: 'a1', name: 'FILé DE FRANGO', price: 18.90, originalPrice: 22.50, unit: 'kg', isOffer: true },
      { id: 'a2', name: 'FRANGO INTEIRO', price: 10.90, unit: 'kg' },
      { id: 'a3', name: 'SOBRECOXA RESF.', price: 12.90, originalPrice: 14.50, unit: 'kg', isOffer: true },
      { id: 'a4', name: 'ASA DE FRANGO', price: 17.00, unit: 'kg' },
      { id: 'a5', name: 'COXINHA DA ASA', price: 19.90, unit: 'kg' },
      { id: 'a6', name: 'CORAÇÃO TEMPERADO', price: 32.00, unit: 'kg' },
      { id: 'a7', name: 'MOELA', price: 11.90, unit: 'kg' },
    ]
  },
  {
    id: 'churrasco',
    label: 'ESPECIAL CHURRASCO',
    offerImage: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&q=80&w=800',
    offerItemName: 'LINGUIÇA TOSCANA',
    offerPrice: 19.90,
    items: [
      { id: 'c1', name: 'LINGUIÇA TOSCANA', price: 19.90, originalPrice: 24.00, unit: 'kg', isOffer: true },
      { id: 'c2', name: 'LINGUIÇA CUIABANA', price: 34.90, unit: 'kg' },
      { id: 'c3', name: 'LINGUIÇA DE FRANGO', price: 21.00, unit: 'kg' },
      { id: 'c4', name: 'PÃO DE ALHO RECH.', price: 14.90, unit: 'un', isOffer: true },
      { id: 'c5', name: 'QUEIJO COALHO', price: 18.50, unit: 'band' },
      { id: 'c6', name: 'ESPETINHO MISTO', price: 6.50, unit: 'un' },
      { id: 'c7', name: 'CARVÃO 4KG', price: 22.00, unit: 'un' },
    ]
  }
];
