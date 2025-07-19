"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DownArrow } from "@/svg";
import sidebar_menu from "@/data/sidebar-menus";
import { ISubMenu } from "@/types/menu-types";

interface IProps {
  sideMenu: boolean;
  setSideMenu: (value: boolean) => void;
}

export default function Sidebar({ sideMenu, setSideMenu }: IProps) {
  // State to track which menus are expanded
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const pathname = usePathname();

  // Handle menu item click
  const handleMenuActive = (title: string) => {
    setSideMenu(false);
  };

  // Toggle submenu expansion
  const toggleSubMenu = (title: string) => {
    setExpandedMenus((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    );
  };

  // Recursive function to render submenus
  const renderSubMenu = (subMenus: ISubMenu[], level = 0) => {
    return (
      <ul className={`${level > 0 ? "pl-6" : ""}`}>
        {subMenus.map((subMenu) => (
          <li key={subMenu.link}>
            {subMenu.subMenus ? (
              // Render expandable submenu
              <>
                <button
                  onClick={() => toggleSubMenu(subMenu.title)}
                  className={`group rounded-md relative text-black text-lg font-medium inline-flex items-center w-full transition-colors ease-in-out duration-300 px-5 py-[9px] mb-2 hover:bg-gray ${
                    expandedMenus.includes(subMenu.title) ? "bg-gray" : ""
                  }`}
                >
                  <span className="inline-block mr-[10px] text-xl">
                    {subMenu.title}
                  </span>
                  <span
                    className={`absolute right-4 top-[52%] transition-transform duration-300 origin-center w-4 h-4 ${
                      expandedMenus.includes(subMenu.title) ? "rotate-180" : ""
                    }`}
                  >
                    <DownArrow />
                  </span>
                </button>
                {expandedMenus.includes(subMenu.title) &&
                  renderSubMenu(subMenu.subMenus, level + 1)}
              </>
            ) : (
              // Render regular menu item
              <Link
                href={subMenu.link}
                onClick={() => handleMenuActive(subMenu.title)}
                className={`group rounded-md relative text-black text-lg font-medium inline-flex items-center w-full transition-colors ease-in-out duration-300 px-5 py-[9px] mb-2 hover:bg-gray ${
                  pathname === subMenu.link ? "bg-gray" : ""
                }`}
              >
                {subMenu.title}
              </Link>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <aside
      className={`w-[300px] lg:w-[250px] xl:w-[300px] border-r border-gray overflow-y-auto sidebar-scrollbar fixed left-0 top-0 h-full bg-white z-50 transition-transform duration-300 ${
        sideMenu
          ? "translate-x-[0px]"
          : "-translate-x-[300px] lg:translate-x-[0]"
      }`}
    >
      <div className="flex flex-col justify-between h-full">
        <div>
          {/* Logo */}
          <div className="py-4 pb-8 px-8 border-b border-gray h-[78px]">
            <Link href="/dashboard">
              <Image
                className="w-[140px]"
                width={140}
                height={43}
                src="/assets/img/logo/logo.svg"
                alt="logo"
                priority
              />
            </Link>
          </div>

          {/* Menu Items */}
          <div className="px-4 py-5">
            <ul>
              {sidebar_menu.map((menu) => (
                <li key={menu.id}>
                  {menu.subMenus ? (
                    // Render expandable menu
                    <>
                      <button
                        onClick={() => toggleSubMenu(menu.title)}
                        className={`group rounded-md relative text-black text-lg font-medium inline-flex items-center w-full transition-colors ease-in-out duration-300 px-5 py-[9px] mb-2 hover:bg-gray ${
                          expandedMenus.includes(menu.title) ? "bg-gray" : ""
                        }`}
                      >
                        <span className="inline-block mr-[10px] text-xl">
                          <menu.icon />
                        </span>
                        {menu.title}
                        <span
                          className={`absolute right-4 top-[52%] transition-transform duration-300 origin-center w-4 h-4 ${
                            expandedMenus.includes(menu.title)
                              ? "rotate-180"
                              : ""
                          }`}
                        >
                          <DownArrow />
                        </span>
                      </button>
                      {expandedMenus.includes(menu.title) &&
                        renderSubMenu(menu.subMenus)}
                    </>
                  ) : (
                    // Render regular menu item
                    <Link
                      href={menu.link || "#"}
                      onClick={() => handleMenuActive(menu.title)}
                      className={`group rounded-md relative text-black text-lg font-medium inline-flex items-center w-full transition-colors ease-in-out duration-300 px-5 py-[9px] mb-2 hover:bg-gray ${
                        pathname === menu.link ? "bg-gray" : ""
                      }`}
                    >
                      <span className="inline-block mr-[10px] text-xl">
                        <menu.icon />
                      </span>
                      {menu.title}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </aside>
  );
}
