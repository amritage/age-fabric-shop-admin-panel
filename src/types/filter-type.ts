export interface IFilter {
  _id: string;
  name: string;
  img: string;
  type: string;
  values?: string[];
}

export interface IFilterResponse {
  success: boolean;
  message: string;
  result: IFilter[];
}

export interface IAddFilter {
  name: string;
  img: string;
  type: string;
  values?: string[];
}

export interface IAddFilterResponse {
  success: boolean;
  message: string;
  result: IFilter;
}
