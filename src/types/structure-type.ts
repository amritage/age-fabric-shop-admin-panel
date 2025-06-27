
export interface IStrucutreItem {
  name: string | undefined;
  _id: string;
  img: string;
  parent: string;
  children: string[];
  productType: string;
  products?: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface StrucutreResponse {
  success: boolean;
  result: IStrucutreItem[];
}

export interface IAddStrucutre {
  img?: string;
  parent: string;
  children?: string[];
  productType: string;
  description?: string;
}

export interface IAddStrucutreResponse {
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

export interface IStrucutreDeleteRes {
  success?: boolean;
  message?: string;
}


