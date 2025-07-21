"use client";
import React, { useEffect, useState } from "react";
import { MonthSales, Received, Sales, TotalOrders } from "@/svg";
import { useGetDashboardAmountQuery } from "@/redux/order/orderApi";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import isBetween from "dayjs/plugin/isBetween";
import ErrorMsg from "../common/error-msg";
dayjs.extend(isToday, isYesterday);
dayjs.extend(isBetween);

type IPropType = {
  title: string;
  amount: number | undefined;
  cash?: number;
  card?: number;
  icon: React.ReactNode;
  clr: string;
  clr2: string;
};

function CardItem({ title, amount, cash, card, icon, clr, clr2 }: IPropType) {
  return (
    <div
      className={
        `widget-item relative bg-gradient-to-br from-white via-slate-50 to-slate-200 p-7 flex justify-between rounded-2xl shadow-xl border-l-4 border-blue-400 hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.03] transition-all duration-300 ease-in-out group`
      }
    >
      <div className="flex flex-col justify-between h-full">
        <h4 className="text-3xl font-extrabold text-blue-900 mb-2 leading-none tracking-tight drop-shadow-sm group-hover:text-blue-700 transition-colors">
          {amount !== undefined ? amount.toLocaleString() : "-"}
        </h4>
        <p className="text-base font-medium text-slate-600 mb-2 group-hover:text-blue-600 transition-colors">{title}</p>
        {(title === "Today Orders" || title === "Yesterday Orders") && (
          <div className={`badge space-x-1 ${clr}`}>
            <div className="flex text-center font-normal text-gray-50">
              {cash !== undefined && (
                <div className="px-1">Cash: {cash.toFixed(2)}</div>
              )}
              {card !== undefined && (
                <div className="px-1">Card: {card.toFixed(2)}</div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center justify-center">
        <span
          className={`text-3xl rounded-full flex items-center justify-center h-16 w-16 shrink-0 bg-gradient-to-tr from-blue-400 via-blue-600 to-blue-800 shadow-lg ring-4 ring-blue-200 group-hover:ring-blue-400 transition-all duration-300 ${clr2}`}
        >
          {icon}
        </span>
      </div>
      {/* Decorative accent */}
      <span className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-400 to-blue-200 rounded-l-2xl opacity-70 pointer-events-none" />
    </div>
  );
}

const CardItems = () => {
  const {
    data: dashboardOrderAmount,
    isError,
    isLoading,
  } = useGetDashboardAmountQuery();

  // decide what to render
  let content = null;

  if (isLoading) {
    content = <h2>Loading....</h2>;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }

  if (!isLoading && !isError) {
    content = (
      <>
        <CardItem
          title="Today Orders"
          amount={dashboardOrderAmount?.todayOrderAmount}
          card={dashboardOrderAmount?.todayCardPaymentAmount}
          cash={dashboardOrderAmount?.todayCashPaymentAmount}
          icon={<Received />}
          clr=""
          clr2="bg-success"
        />
        <CardItem
          title="Yesterday Orders"
          amount={dashboardOrderAmount?.yesterdayOrderAmount}
          card={dashboardOrderAmount?.yesterDayCardPaymentAmount}
          cash={dashboardOrderAmount?.yesterDayCashPaymentAmount}
          icon={<Sales />}
          clr="text-purple bg-purple/10"
          clr2="bg-purple"
        />
        <CardItem
          title="Monthly Orders"
          amount={dashboardOrderAmount?.monthlyOrderAmount}
          icon={<MonthSales />}
          clr="text-info bg-info/10"
          clr2="bg-info"
        />
        <CardItem
          title="Total Orders"
          amount={dashboardOrderAmount?.totalOrderAmount}
          icon={<TotalOrders />}
          clr="text-warning bg-warning/10"
          clr2="bg-warning"
        />
      </>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 mb-10">
      {content}
    </div>
  );
};

export default CardItems;
