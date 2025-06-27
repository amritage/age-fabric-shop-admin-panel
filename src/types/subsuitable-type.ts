export interface ISubSuitableFor {
  _id: string;
  name: string;
  suitableForId: string;  // parent SuitableFor reference
}
