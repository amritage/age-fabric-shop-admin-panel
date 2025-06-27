// src/types/category-type.ts
export interface ICategory {
  _id?:        string;
  name:        string;
  productType: string;
  parent:      string;
  image?:      string;
}
