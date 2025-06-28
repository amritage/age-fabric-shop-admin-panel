import { ComponentType } from "react";

// Interface for submenu items that can have their own submenus
export interface ISubMenu {
  title: string;
  link: string;
  subMenus?: ISubMenu[];
}

// Interface for main menu items
export interface ISidebarMenus {
  id: number;
  icon: ComponentType; // For SVG icons
  link?: string;
  title: string;
  subMenus?: ISubMenu[];
}
