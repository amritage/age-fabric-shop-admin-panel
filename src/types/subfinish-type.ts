export interface ISubFinish {
  _id: string;
  name: string;
  structureId: string; // parent structure reference
  finishId: string; // parent finish reference
}
