
export const filterConfig = [
  // only the “top level” dropdowns here:
  { name: "newCategoryId", label: "Category", api: `/api/newcategory/viewcategory` },
  { name: "structureId",   label: "Structure", api: `/api/structure/view` },
  { name: "contentId",     label: "Content", api: `/api/content/viewcontent` },
  { name: "finishId",      label: "Finish", api: `/api/finish/view` },
  { name: "designId",      label: "Design", api: `/api/design/view` },
  { name: "colorId",       label: "Color", api: `/api/color/view` },
  { name: "motifsizeId",   label: "Motif Size", api: `/api/motifsize/view` },
  { name: "suitableforId", label: "Suitable For", api: `/api/suitablefor/view` },
  { name: "vendorId",      label: "Vendor", api: `/api/vendor/view` },
  { name: "groupcodeId",   label: "Group Code", api: `/api/groupcode/view` },
];

export const subFilterConfig = [
  // each one points at its own endpoint & names its parent key:
  { name: "subStructureId", parentKey: "structureId",   api: `/api/substructure/view` },
  { name: "subFinishId",    parentKey: "finishId",      api: `/api/subfinish/view` },
  { name: "subSuitableId",  parentKey: "suitableforId", api: `/api/subsuitable/view` },
];
