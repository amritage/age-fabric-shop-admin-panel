'NEXT_PUBLIC_API_BASE_URL=http://localhost:7000;'

export const filterConfig = [
  { name: "newCategoryId", label: "Category", api: `/api/newcategory/viewcategory` },
  { name: "structureId", label: "Structure", api: `/api/structure/view` },
  { name: "contentId", label: "Content", api: `/api/content/viewcontent` },
  { name: "finishId", label: "Finish", api: `/api/finish/view` },
  { name: "designId", label: "Design", api: `/api/design/view` },
  { name: "colorId", label: "Color", api: `/api/color/view` },
  { name: "motifsizeId", label: "Motif Size", api: `/api/motifsize/view` },
  { name: "suitableforId", label: "Suitable For", api: `/api/suitablefor/view` },
  { name: "vendorId", label: "Vendor", api: `/api/vendor/view` },
  { name: "groupcodeId", label: "Group Code", api: `/api/groupcode/view` },
  { name: "subStructureId", label: "Sub Structure", api: `/api/substructure/view` },
  { name: "subFinishId", label: "Sub Finish", api: `/api/subfinish/view` },
  { name: "subSuitableId", label: "Sub Suitable For", api: `/api/subsuitable/view` },
];
