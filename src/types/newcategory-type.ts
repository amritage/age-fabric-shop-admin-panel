// src/types/category-type.ts
export interface ICategory {
  _id?: string;
  name: string;
  productType: string;
  parent: string;
  image?: string;
}

export interface INewCategory {
  name: string;
  _id: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NewCategoryResponse {
  success: boolean;
  result: INewCategory[];
}

export interface IAddNewCategory {
  image?: string;
}

export interface IAddNewCategoryResponse {
  status: string;
  message: string;
  data: INewCategory;
}

export interface INewCategoryDeleteRes {
  success?: boolean;
  message?: string;
}
