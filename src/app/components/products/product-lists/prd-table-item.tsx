import Image from "next/image";
import React from "react";
import { IProduct } from "@/types/fabricproduct-type";
import EditDeleteBtn from "../../button/edit-delete-btn";

const ProductTableItem = ({ product }: { product: IProduct }) => {
  const { _id, image, name, sku, salesPrice, quantity, currency } =
    product || {};

  return (
    <tr className="bg-white border-b border-gray6 last:border-0 text-start mx-9">
      <td className="pr-8 py-5 whitespace-nowrap">
        <a href="#" className="flex items-center space-x-5">
          {image && (
            <Image
              className="w-[60px] h-[60px] rounded-md object-cover bg-[#F2F3F5]"
              src={image}
              width={60}
              height={60}
              alt={name}
            />
          )}
          <span className="font-medium text-heading text-hover-primary transition">
            {name}
          </span>
        </a>
      </td>
      <td className="px-3 py-3 font-normal text-[#55585B] text-end">#{sku}</td>
      <td className="px-3 py-3 font-normal text-[#55585B] text-end">
        {quantity}
      </td>
      <td className="px-3 py-3 font-normal text-[#55585B] text-end">
        {currency} {salesPrice}
      </td>
      <td className="px-3 py-3 text-end">
        <span
          className={`text-[11px] px-3 py-1 rounded-md leading-none font-medium text-end ${
            quantity > 0
              ? "text-success bg-success/10"
              : "text-danger bg-danger/10"
          }`}
        >
          {quantity > 0 ? "In Stock" : "Out of Stock"}
        </span>
      </td>
      <td className="px-9 py-3 text-end">
        <div className="flex items-center justify-end space-x-2">
          <EditDeleteBtn id={_id} />
        </div>
      </td>
    </tr>
  );
};

export default ProductTableItem;
