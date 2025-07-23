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

  // Helper: check if any submenu is active
  const isSubMenuActive = (subMenus: ISubMenu[]): boolean =>
    subMenus.some((sub) =>
      sub.subMenus ? isSubMenuActive(sub.subMenus) : pathname === sub.link
    );

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
        {subMenus.map((subMenu) => {
          const active = pathname === subMenu.link;
          const hasActiveChild = subMenu.subMenus && isSubMenuActive(subMenu.subMenus);
          return (
            <li key={subMenu.link}>
              {subMenu.subMenus ? (
                // Render expandable submenu
                <>
                  <button
                    onClick={() => toggleSubMenu(subMenu.title)}
                    className={`group rounded-lg relative text-base font-semibold inline-flex items-center w-full transition-colors ease-in-out duration-300 px-5 py-2 mb-2 hover:bg-blue-50 hover:text-blue-700
                      ${expandedMenus.includes(subMenu.title) || hasActiveChild ? "bg-blue-100 text-blue-700 font-bold border-l-4 border-blue-500" : "text-gray-700"}
                    `}
                  >
                    <span className="inline-block mr-2 text-lg">
                      {subMenu.title}
                    </span>
                    <span
                      className={`absolute right-4 top-1/2 -translate-y-1/2 transition-transform duration-300 origin-center w-4 h-4
                        ${expandedMenus.includes(subMenu.title) ? "rotate-180" : ""}
                      `}
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
                  className={`group rounded-lg relative text-base font-semibold inline-flex items-center w-full transition-colors ease-in-out duration-300 px-5 py-2 mb-2 hover:bg-blue-50 hover:text-blue-700
                    ${active ? "bg-blue-100 text-blue-700 font-bold border-l-4 border-blue-500" : "text-gray-700"}
                  `}
                >
                  {subMenu.title}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <aside
      className={`w-[300px] lg:w-[250px] xl:w-[300px] border-r border-blue-200 overflow-y-auto sidebar-scrollbar fixed left-0 top-0 h-full bg-gradient-to-b from-blue-50 via-white to-pink-50 z-50 shadow-2xl rounded-tr-3xl rounded-br-3xl transition-transform duration-300 font-sans
        ${sideMenu ? "translate-x-[0px]" : "-translate-x-[300px] lg:translate-x-[0]"}
      `}
    >
      <div className="flex flex-col justify-between h-full">
        <div>
          {/* Logo */}
          <div className="py-4 pb-8 px-8 border-b border-blue-100 h-[78px]">
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
              {sidebar_menu.map((menu) => {
                const active = pathname === menu.link;
                const hasActiveChild = menu.subMenus && isSubMenuActive(menu.subMenus);
                return (
                  <li key={menu.id}>
                    {menu.subMenus ? (
                      // Render expandable menu
                      <>
                        <button
                          onClick={() => toggleSubMenu(menu.title)}
                          className={`group rounded-lg relative text-lg font-bold inline-flex items-center w-full transition-colors ease-in-out duration-300 px-5 py-3 mb-2 hover:bg-blue-100 hover:text-blue-700
                            ${expandedMenus.includes(menu.title) || hasActiveChild ? "bg-blue-200 text-blue-800 border-l-4 border-blue-600 shadow-md" : "text-gray-800"}
                          `}
                        >
                          <span className="inline-block mr-3 text-2xl">
                            <menu.icon />
                          </span>
                          {menu.title}
                          <span
                            className={`absolute right-4 top-1/2 -translate-y-1/2 transition-transform duration-300 origin-center w-4 h-4
                              ${expandedMenus.includes(menu.title) ? "rotate-180" : ""}
                            `}
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
                        className={`group rounded-lg relative text-lg font-bold inline-flex items-center w-full transition-colors ease-in-out duration-300 px-5 py-3 mb-2 hover:bg-blue-100 hover:text-blue-700
                          ${active ? "bg-blue-200 text-blue-800 border-l-4 border-blue-600 shadow-md" : "text-gray-800"}
                        `}
                      >
                        <span className="inline-block mr-3 text-2xl">
                          <menu.icon />
                        </span>
                        {menu.title}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </aside>
  );
}
