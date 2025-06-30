import Image from "next/image";
import dayjs from "dayjs";
import React, { useState, useEffect } from "react";
import { Notification, Close } from "@/svg";
import { useGetProductsQuery } from "@/redux/newproduct/NewProductApi";
import { IProduct } from "@/types/product-type";

// prop type
type IPropType = {
  nRef: React.RefObject<HTMLDivElement>;
  notificationOpen: boolean;
  handleNotificationOpen: () => void;
};

const NotificationArea = ({
  nRef,
  notificationOpen,
  handleNotificationOpen,
}: IPropType) => {
  const [show, setShow] = useState(false);
  const { data: products } = useGetProductsQuery({ page: 1, limit: 100 });
  const stockOutProducts = products?.data.filter((p) => p.quantity === 0);

  return (
    <div ref={nRef}>
      <button
        onClick={handleNotificationOpen}
        className="relative w-[40px] h-[40px] leading-[40px] rounded-md text-gray border border-gray hover:bg-themeLight hover:text-theme hover:border-themeLight"
      >
        <Notification />
        <span className="w-[20px] h-[20px] inline-block bg-danger rounded-full absolute -top-[4px] -right-[4px] border-[2px] border-white text-xs leading-[18px] font-medium text-white">
          {stockOutProducts && stockOutProducts.length}
        </span>
      </button>

      {notificationOpen && (
        <div className="w-80 h-[400px] overflow-y-scroll bg-white shadow-lg rounded-md mt-2">
          <div className="tp-notify-header-wrapper flex items-center justify-between px-5 py-3 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-800">Notifications</h3>
          </div>
          <div className="tp-notify-content">
            {stockOutProducts?.length === 0 && (
              <p className="text-center text-sm text-gray-500 py-6">
                No new notifications
              </p>
            )}
            {stockOutProducts?.map((item) => (
              <div
                key={item._id}
                className="tp-notify-item flex items-center space-x-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition"
              >
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">
                    <span className="font-bold">{item.name}</span> is out of
                    stock!
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.updated_at
                      ? new Date(item.updated_at).toLocaleDateString()
                      : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationArea;
