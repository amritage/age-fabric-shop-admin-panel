import { ISidebarMenus } from "./../types/menu-types";
import {
  Dashboard,
  Categories,
  Coupons,
  Orders,
  Pages,
  Products,
  Profile,
  Reviews,
  Setting,
  Leaf,
  StuffUser,
} from "@/svg";

const sidebar_menu: Array<ISidebarMenus> = [
  {
    id: 1,
    icon: Dashboard,
    link: "/dashboard",
    title: "Dashboard",
  },
  {
    id: 2,
    icon: Dashboard,
    link: "/dashboard",
    title: "Fabric-products",
    subMenus: [
      { title: "Add Product", link: "/fabric-products/add" },
      { title: "View Product", link: "/fabric-products/view" },
    ],
  },
  {
    id: 3,
    icon: Orders,
    title: "Filters",
    subMenus: [
      { title: "Category", link: "/newcategory" },
      { title: "Structure", link: "/structure" },
      { title: "Sub Structure", link: "/sub-structure" },
      { title: "Content", link: "/content" },
      { title: "Finish", link: "/finish" },
      { title: "Sub Finish", link: "/subfinish" },
      { title: "Design", link: "/design" },
      { title: "Color", link: "/colors" },
      { title: "Motif", link: "/motif" },
      { title: "Suitable For", link: "/suitable-for" },
      { title: "Sub Suitable For", link: "/subsuitablefor" },
      { title: "Vendor", link: "/vendor" },
      { title: "Unique code", link: "/unique-code" },
      { title: "Group Code", link: "/group-code" },
    ],
  },
/*   {
    id: 4,
    icon: Categories,
    link: "/category",
    title: "Category",
  },
  {
    id: 5,
    icon: Orders,
    link: "/orders",
    title: "Orders",
  },
  {
    id: 6,
    icon: Leaf,
    link: "/brands",
    title: "Brand",
  },
  {
    id: 7,
    icon: Reviews,
    link: "/reviews",
    title: "Reviews",
  },
  {
    id: 8,
    icon: Coupons,
    link: "/coupon",
    title: "Coupons",
  },
  {
    id: 9,
    icon: Profile,
    link: "/profile",
    title: "Profile",
  },
  {
    id: 10,
    icon: Setting,
    link: "#",
    title: "Online store",
  },
  {
    id: 11,
    icon: Products,
    link: "/product-list",
    title: "Products",
    subMenus: [
      { title: "Product List", link: "/product-list" },
      { title: "Product Grid", link: "/product-grid" },
      { title: "Add Product", link: "/add-product" },
    ],
  }, */
];

export default sidebar_menu;
