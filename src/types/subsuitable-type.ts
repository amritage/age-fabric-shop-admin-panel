export interface SuitableForRef {
  _id: string;
  name: string | { en?: string; hi?: string };
}

export interface ISubSuitableFor {
  _id: string;
  name: string;
  suitableforId: string | SuitableForRef; // ✅ updated here
}
