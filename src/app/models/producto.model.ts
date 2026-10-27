export const CATEGORIES = [                                    
  'Espresso', 'V60', 'Chemex', 'AeroPress', 'Origami', 'Sifón japonés', 'Moka',
] as const;                                                    // as const: arreglo de solo lectura, con valores fijos

export interface Producto {
  id: string | number;                                         // json-server puede devolverlo como texto o número
  modelName: string;
  category: string;                                            // igual que en el JSON
  salePrice: number;                                           // igual que en el JSON
  brand: string;
  material: string;
  isInStore: boolean;
  notes: string;
  cupProfile: string;
}

export type ProductoFormulario = Omit<Producto, 'id'>;         // lo mismo que Producto, sin id