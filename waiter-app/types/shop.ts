export type Ingredient = {
  allergen: boolean;
  created_at: string;
  description: string;
  id: string;
  selection_type: string;
  suitable_for_diet: string;
  title: string;
  updated_at: string;
};

export type Product = {
  description: string;
  id: string;
  qr: string;
  sku: string;
  title: string;
  variations: Product[];
  ingredients: Ingredient[];
};

export type ShopMenu = {
  id: string;
  name: string;
  opening_time: string;
  closing_time: string;
  opening_days: string;
  manager_id: string;
  products: Product[];
};
