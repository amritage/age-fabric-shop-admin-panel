export interface IStructureItem {
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

export interface StructureResponse {
  success: boolean;
  result: IStructureItem[];
}

export interface IAddStructure {
  img?: string;
  parent: string;
  children?: string[];
  productType: string;
  description?: string;
}

export interface IAddStructureResponse {
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

export interface IStructureDeleteRes {
  success?: boolean;
  message?: string;
}
