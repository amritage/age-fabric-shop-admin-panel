export interface ICategory {
  _id?: string;
  name: string;
  productType: string;
  parent: string;
  image?: string;
}

export interface CategoryResponse {
  success: boolean;
  result: ICategory[];
}

export interface IAddCategory {
  img?: string;
  parent: string;
  children?: string[];
  productType: string;
  description?: string;
}

export interface IAddCategoryResponse {
  status: string;
  message: string;
  data: {
    parent: string;
    children?: string[];
    productType: string;
    products?: any[];
    _id: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface ICategoryDeleteRes {
  success?: boolean;
  message?: string;
}
